import { createServer } from 'node:http'
import { readFileSync, writeFileSync, mkdirSync, appendFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scrypt = promisify(scryptCallback)
const ROOT = process.env.ALLNEEDS_DATA_DIR || join(process.cwd(), 'backend', 'data')
const DB_PATH = join(ROOT, 'db.json')
const AUDIT_PATH = join(ROOT, 'audit.jsonl')
const COOKIE_NAME = 'allneeds_session'
const SESSION_TTL_SECONDS = 8 * 60 * 60
const MAX_BODY_BYTES = 1024 * 1024
const FRONTEND_ORIGIN = process.env.ALLNEEDS_FRONTEND_ORIGIN || 'http://127.0.0.1:5176'
const isProduction = process.env.NODE_ENV === 'production'
const sessionSecret = process.env.ALLNEEDS_SESSION_SECRET || (!isProduction ? randomBytes(32).toString('base64url') : '')

if (sessionSecret.length < 32) throw new Error('ALLNEEDS_SESSION_SECRET doit contenir au moins 32 caractères en production.')
if (!process.env.ALLNEEDS_SESSION_SECRET) console.warn('Session secret temporaire : les sessions expireront au redémarrage du serveur.')
mkdirSync(ROOT, { recursive: true })

const emptyDb = () => ({
  users: [
    { id: 'admin-nada', email: 'nada@allneeds.ma', role: 'admin', orgIds: ['*'], name: 'Nada Bennani', active: true, passwordHash: null },
    { id: 'conc-001', email: 'concierge.sante@allneeds.ma', role: 'concierge', orgIds: ['org-nour'], name: 'Yassine El Mansouri', active: true, passwordHash: null },
    { id: 'usr-amina', email: 'a.bennani@al-amal.ma', role: 'dirigeant', orgIds: ['org-amal'], name: 'Amina Bennani', active: true, passwordHash: null },
    { id: 'usr-youssef', email: 'direction@clinique-nour.ma', role: 'dirigeant', orgIds: ['org-nour'], name: 'Dr Youssef Idrissi', active: true, passwordHash: null },
    { id: 'usr-salma', email: 'salma@riad-lumen.ma', role: 'dirigeant', orgIds: ['org-riad'], name: 'Salma Ouazzani', active: true, passwordHash: null },
    { id: 'usr-manager', email: 'manager@al-amal.ma', role: 'manager', orgIds: ['org-amal'], name: 'Responsable Al Amal', active: true, passwordHash: null },
    { id: 'usr-collab', email: 'collaborateur@al-amal.ma', role: 'collaborateur', orgIds: ['org-amal'], name: 'Collaborateur Al Amal', active: true, passwordHash: null },
  ],
  orgs: [
    { id: 'org-amal', name: 'École Al Amal', sector: 'enseignement' },
    { id: 'org-nour', name: 'Clinique Nour', sector: 'sante' },
    { id: 'org-riad', name: 'Riad Lumen', sector: 'tourisme' },
  ],
  diagnostics: [],
  needs: [],
  consents: [],
})

const loadDb = () => (existsSync(DB_PATH) ? JSON.parse(readFileSync(DB_PATH, 'utf8')) : emptyDb())
const saveDb = (data) => writeFileSync(DB_PATH, JSON.stringify(data, null, 2), { mode: 0o600 })
let db = loadDb()
db.needs ??= []
db.diagnostics ??= []
db.consents ??= []
if (!existsSync(DB_PATH)) saveDb(db)

const json = (res, code, body, headers = {}) => {
  res.writeHead(code, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', ...headers })
  res.end(JSON.stringify(body))
}
const audit = (event, detail) => appendFileSync(AUDIT_PATH, JSON.stringify({ ts: new Date().toISOString(), event, ...detail }) + '\n', { mode: 0o600 })
const safeUser = ({ passwordHash: _passwordHash, ...user }) => user

async function readBody(req) {
  let size = 0
  const chunks = []
  for await (const chunk of req) {
    size += chunk.length
    if (size > MAX_BODY_BYTES) throw Object.assign(new Error('corps trop volumineux'), { status: 413 })
    chunks.push(chunk)
  }
  if (!size) return {}
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')) }
  catch { throw Object.assign(new Error('JSON invalide'), { status: 400 }) }
}

function signature(payload) {
  return createHmac('sha256', sessionSecret).update(payload).digest('base64url')
}

function issueSession(user) {
  const payload = Buffer.from(JSON.stringify({ sub: user.id, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS })).toString('base64url')
  return `${payload}.${signature(payload)}`
}

function sessionUser(req) {
  const cookie = req.headers.cookie?.split(';').map((item) => item.trim()).find((item) => item.startsWith(`${COOKIE_NAME}=`))
  const token = cookie?.slice(COOKIE_NAME.length + 1)
  if (!token) return null
  const [payload, supplied, extra] = token.split('.')
  if (!payload || !supplied || extra) return null
  const expected = signature(payload)
  const a = Buffer.from(supplied)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    const user = db.users.find((item) => item.id === data.sub && item.active !== false)
    return data.exp > Math.floor(Date.now() / 1000) ? user ?? null : null
  } catch { return null }
}

function cookie(value, maxAge) {
  return `${COOKIE_NAME}=${value}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${maxAge}${isProduction ? '; Secure' : ''}`
}

function requireSameOrigin(req, res) {
  const origin = req.headers.origin
  if (origin && origin !== FRONTEND_ORIGIN) {
    json(res, 403, { error: 'origine refusée' })
    return false
  }
  return true
}

function canAccessOrg(user, orgId) {
  if (!user || !orgId) return false
  if (user.role === 'admin') return true
  return Array.isArray(user.orgIds) && user.orgIds.includes(orgId)
}

function canReadDiagnostics(user) {
  return ['admin', 'concierge', 'commercial', 'dirigeant', 'manager'].includes(user?.role)
}

function canCreateDiagnostic(user, format) {
  if (['admin', 'concierge', 'dirigeant', 'manager'].includes(user?.role)) return true
  return user?.role === 'commercial' && user.scope === 'crm' && format === 'Express'
}

const NEED_STATUSES = new Set(['recu', 'analyse', 'recherche', 'propositions', 'devis', 'negociation', 'signe', 'clos'])
const NEED_CATEGORIES = new Set(['logiciel', 'creation', 'rh', 'logistique', 'energie', 'maintenance'])
const NEED_URGENCY = new Set(['faible', 'normale', 'haute'])
const NEED_FLOW = ['recu', 'analyse', 'recherche', 'propositions', 'devis', 'negociation', 'signe']
const NEED_READ_ROLES = new Set(['admin', 'concierge', 'dirigeant', 'manager', 'collaborateur'])
const OPERATIONS_ROLES = new Set(['admin', 'concierge'])

function allowedText(value, maximum, field) {
  if (typeof value !== 'string' || !value.trim() || value.length > maximum) throw Object.assign(new Error(`${field} invalide`), { status: 400 })
  return value.trim()
}

function canCreateNeed(user) { return OPERATIONS_ROLES.has(user?.role) || ['dirigeant', 'manager'].includes(user?.role) }
function canUpdateNeed(user) { return OPERATIONS_ROLES.has(user?.role) || ['dirigeant', 'manager'].includes(user?.role) }

function scopedNeeds(user) {
  return db.needs.filter((need) => canAccessOrg(user, need.orgId))
}

const failures = new Map()
function loginThrottled(key) {
  const now = Date.now()
  const recent = (failures.get(key) ?? []).filter((time) => now - time < 15 * 60 * 1000)
  failures.set(key, recent)
  return recent.length >= 8
}
function markLoginFailure(key) {
  failures.set(key, [...(failures.get(key) ?? []), Date.now()])
}
function clearLoginFailures(key) { failures.delete(key) }

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost')
  try {
    if (req.method === 'OPTIONS') {
      const origin = req.headers.origin
      if (origin !== FRONTEND_ORIGIN) return json(res, 403, { error: 'origine refusée' })
      res.writeHead(204, {
        'access-control-allow-origin': FRONTEND_ORIGIN,
        'access-control-allow-credentials': 'true',
        'access-control-allow-methods': 'GET, POST, OPTIONS',
        'access-control-allow-headers': 'content-type',
        'access-control-max-age': '600',
        vary: 'Origin',
      })
      return res.end()
    }

    const cors = req.headers.origin === FRONTEND_ORIGIN ? { 'access-control-allow-origin': FRONTEND_ORIGIN, 'access-control-allow-credentials': 'true', vary: 'Origin' } : {}
    if (req.method === 'GET' && url.pathname === '/api/health') return json(res, 200, { ok: true }, cors)

    if (req.method === 'POST' && url.pathname === '/api/auth/login') {
      if (!requireSameOrigin(req, res)) return
      const body = await readBody(req)
      const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
      const password = typeof body.password === 'string' ? body.password : ''
      const key = `${req.socket.remoteAddress ?? 'unknown'}:${email}`
      if (loginThrottled(key)) return json(res, 429, { error: 'trop de tentatives, réessayez dans 15 minutes' }, cors)
      const user = db.users.find((item) => item.email?.toLowerCase() === email && item.active !== false)
      let valid = false
      if (user?.passwordHash && password.length <= 1024) {
        const [scheme, salt, stored] = user.passwordHash.split('$')
        if (scheme === 'scrypt' && salt && stored) {
          const candidate = await scrypt(password, salt, 64)
          const expected = Buffer.from(stored, 'hex')
          valid = candidate.length === expected.length && timingSafeEqual(candidate, expected)
        }
      }
      if (!valid) {
        markLoginFailure(key)
        audit('auth.login.denied', { email: email.slice(0, 160), ip: req.socket.remoteAddress ?? 'unknown' })
        return json(res, 401, { error: 'adresse e-mail ou mot de passe incorrect' }, cors)
      }
      clearLoginFailures(key)
      audit('auth.login.ok', { by: user.id })
      return json(res, 200, { user: safeUser(user) }, { ...cors, 'set-cookie': cookie(issueSession(user), SESSION_TTL_SECONDS) })
    }

    if (req.method === 'POST' && url.pathname === '/api/auth/logout') {
      if (!requireSameOrigin(req, res)) return
      const user = sessionUser(req)
      if (user) audit('auth.logout', { by: user.id })
      return json(res, 200, { ok: true }, { ...cors, 'set-cookie': cookie('', 0) })
    }

    if (req.method === 'GET' && url.pathname === '/api/me') {
      const user = sessionUser(req)
      if (!user) return json(res, 401, { error: 'non authentifié' }, cors)
      return json(res, 200, safeUser(user), cors)
    }

    const user = sessionUser(req)
    if (!user) return json(res, 401, { error: 'non authentifié' }, cors)
    if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method) && url.pathname.startsWith('/api/') && !requireSameOrigin(req, res)) return

    if (req.method === 'GET' && url.pathname === '/api/needs') {
      if (!NEED_READ_ROLES.has(user.role)) return json(res, 403, { error: 'rôle non autorisé à consulter les besoins' }, cors)
      const visible = scopedNeeds(user).sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
      audit('need.read.list', { by: user.id, count: visible.length })
      return json(res, 200, visible, cors)
    }

    if (req.method === 'POST' && url.pathname === '/api/needs') {
      if (!canCreateNeed(user)) return json(res, 403, { error: 'votre rôle ne peut pas déposer un besoin' }, cors)
      const body = await readBody(req)
      const orgId = allowedText(body.orgId, 120, 'entreprise')
      if (!canAccessOrg(user, orgId)) return json(res, 403, { error: 'entreprise hors de votre périmètre' }, cors)
      if (!db.orgs.some((org) => org.id === orgId)) return json(res, 404, { error: 'entreprise introuvable' }, cors)
      const category = allowedText(body.category, 40, 'catégorie')
      const urgency = body.urgency == null ? 'normale' : body.urgency
      if (!NEED_URGENCY.has(urgency)) return json(res, 400, { error: 'urgence invalide' }, cors)
      if (!NEED_CATEGORIES.has(category)) return json(res, 400, { error: 'catégorie inconnue' }, cors)
      const title = allowedText(body.title, 180, 'intitulé')
      const description = allowedText(body.description, 4000, 'description')
      const location = allowedText(body.location || 'À préciser', 160, 'ville')
      const budgetMax = body.budgetMax == null || body.budgetMax === '' ? null : Number(body.budgetMax)
      if (budgetMax !== null && (!Number.isFinite(budgetMax) || budgetMax < 0 || budgetMax > 1_000_000_000)) return json(res, 400, { error: 'budget invalide' }, cors)
      const deadline = body.deadline ? allowedText(body.deadline, 40, 'échéance') : null
      if (deadline && Number.isNaN(Date.parse(deadline))) return json(res, 400, { error: 'échéance invalide' }, cors)
      const now = new Date().toISOString()
      const record = {
        id: `need-${randomBytes(12).toString('hex')}`, orgId, title, category,
        categoryLabel: allowedText(body.categoryLabel || category, 180, 'nom de catégorie'),
        status: 'recu', urgency, budgetMax, submittedAt: now, deadline, description, location,
        candidateIds: [], quoteIds: [], assignedTo: user.role === 'concierge' ? user.name : 'À attribuer',
        timeline: [{ at: now, label: 'Besoin déposé par le client' }],
      }
      db.needs.unshift(record)
      saveDb(db)
      audit('need.create', { by: user.id, org: orgId, id: record.id })
      return json(res, 201, record, cors)
    }

    const needRoute = url.pathname.match(/^\/api\/needs\/([^/]+)$/)
    if (needRoute && req.method === 'PATCH') {
      const need = db.needs.find((item) => item.id === needRoute[1])
      if (!need) return json(res, 404, { error: 'besoin introuvable' }, cors)
      if (!canAccessOrg(user, need.orgId)) return json(res, 403, { error: 'besoin hors de votre périmètre' }, cors)
      const body = await readBody(req)
      if (!NEED_STATUSES.has(body.status)) return json(res, 400, { error: 'étape invalide' }, cors)
      const isClientDecision = ['dirigeant', 'manager'].includes(user.role) && ['signe', 'clos'].includes(body.status)
      if (!canUpdateNeed(user) && !isClientDecision) return json(res, 403, { error: 'votre rôle ne peut pas modifier cette étape' }, cors)
      if (isClientDecision && body.status === 'signe' && need.status !== 'negociation') return json(res, 409, { error: 'la signature est possible après la négociation' }, cors)
      if (OPERATIONS_ROLES.has(user.role)) {
        const currentIndex = NEED_FLOW.indexOf(need.status)
        const targetIndex = NEED_FLOW.indexOf(body.status)
        const allowedStep = targetIndex >= 0 && targetIndex <= currentIndex + 1 || body.status === 'clos'
        if (!allowedStep) return json(res, 409, { error: 'faites avancer le dossier étape par étape' }, cors)
      }
      if (['dirigeant', 'manager'].includes(user.role) && !['signe', 'clos'].includes(body.status)) return json(res, 403, { error: 'le client peut uniquement signer ou clôturer sa demande' }, cors)
      const now = new Date().toISOString()
      need.status = body.status
      need.timeline = [...(Array.isArray(need.timeline) ? need.timeline : []), { at: now, label: allowedText(body.label || `Étape mise à jour : ${body.status}`, 240, 'historique') }]
      saveDb(db)
      audit('need.status.update', { by: user.id, org: need.orgId, id: need.id, status: need.status })
      return json(res, 200, need, cors)
    }

    if (req.method === 'GET' && url.pathname === '/api/diagnostics') {
      if (!canReadDiagnostics(user)) return json(res, 403, { error: 'rôle non autorisé' }, cors)
      const visible = db.diagnostics.filter((diagnostic) => canAccessOrg(user, diagnostic.orgId))
      audit('diagnostic.read.list', { by: user.id, count: visible.length })
      return json(res, 200, visible, cors)
    }

    const diagnosticRoute = url.pathname.match(/^\/api\/diagnostics(?:\/([^/]+))?(\/consent)?$/)
    if (diagnosticRoute && diagnosticRoute[1] === undefined && req.method === 'POST') {
      const body = await readBody(req)
      if (!body.orgId || !['Express', 'Complet'].includes(body.format)) return json(res, 400, { error: 'orgId ou format invalide' }, cors)
      if (!canAccessOrg(user, body.orgId)) return json(res, 403, { error: 'organisation hors périmètre' }, cors)
      if (!canCreateDiagnostic(user, body.format)) return json(res, 403, { error: 'rôle non autorisé à créer ce diagnostic' }, cors)
      const org = db.orgs.find((item) => item.id === body.orgId)
      if (!org) return json(res, 404, { error: 'organisation introuvable' }, cors)
      if (body.sector && body.sector !== org.sector) return json(res, 400, { error: 'secteur différent de celui de l’organisation' }, cors)
      const now = new Date().toISOString()
      const record = { id: `diag-${randomBytes(12).toString('hex')}`, orgId: body.orgId, format: body.format, sector: org.sector, answers: body.answers && typeof body.answers === 'object' && !Array.isArray(body.answers) ? body.answers : {}, consent: null, createdBy: user.id, createdAt: now, updatedAt: now }
      db.diagnostics.push(record)
      saveDb(db)
      audit('diagnostic.create', { by: user.id, org: body.orgId, id: record.id })
      return json(res, 201, record, cors)
    }

    if (diagnosticRoute?.[1] && !diagnosticRoute[2] && req.method === 'GET') {
      if (!canReadDiagnostics(user)) return json(res, 403, { error: 'rôle non autorisé' }, cors)
      const diagnostic = db.diagnostics.find((item) => item.id === diagnosticRoute[1])
      if (!diagnostic) return json(res, 404, { error: 'introuvable' }, cors)
      if (!canAccessOrg(user, diagnostic.orgId)) return json(res, 403, { error: 'interdit' }, cors)
      audit('diagnostic.read.one', { by: user.id, id: diagnostic.id })
      return json(res, 200, diagnostic, cors)
    }

    if (diagnosticRoute?.[1] && diagnosticRoute[2] && req.method === 'POST') {
      if (user.role !== 'dirigeant') return json(res, 403, { error: 'seul le dirigeant de l’entreprise peut enregistrer ce consentement' }, cors)
      const diagnostic = db.diagnostics.find((item) => item.id === diagnosticRoute[1])
      if (!diagnostic) return json(res, 404, { error: 'introuvable' }, cors)
      if (!canAccessOrg(user, diagnostic.orgId)) return json(res, 403, { error: 'interdit' }, cors)
      const body = await readBody(req)
      if (typeof body.version !== 'string' || !body.version.trim() || body.version.length > 100) return json(res, 400, { error: 'version requise' }, cors)
      const entry = { acceptedAt: new Date().toISOString(), version: body.version.trim(), by: user.name, recordedAt: new Date().toISOString(), byUserId: user.id }
      diagnostic.consents = diagnostic.consents || []
      diagnostic.consents.push(entry)
      db.consents.push({ diagnosticId: diagnostic.id, orgId: diagnostic.orgId, ...entry })
      saveDb(db)
      audit('consent.record', { by: user.id, diagnosticId: diagnostic.id, version: entry.version })
      return json(res, 201, { ok: true, consent: entry }, cors)
    }

    return json(res, 404, { error: 'route inconnue' }, cors)
  } catch (error) {
    const status = error.status || 500
    if (status === 500) audit('server.error', { path: url.pathname, message: String(error.message || error).slice(0, 240) })
    return json(res, status, { error: status === 500 ? 'erreur serveur' : error.message })
  }
})

const port = Number(process.env.PORT || 8787)
server.listen(port, () => console.log(`ALLNEEDS backend sur http://127.0.0.1:${port}`))
export default server
