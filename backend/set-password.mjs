import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { randomBytes, scrypt as scryptCallback } from 'node:crypto'
import { promisify } from 'node:util'

const scrypt = promisify(scryptCallback)
const dbPath = join(process.env.ALLNEEDS_DATA_DIR || join(process.cwd(), 'backend', 'data'), 'db.json')
const email = process.argv[2]?.trim().toLowerCase()

if (!email || !existsSync(dbPath)) {
  console.error('Usage: node backend/set-password.mjs <email>  (initialisez d’abord backend/server.mjs)')
  process.exit(1)
}
if (!process.stdin.isTTY || !process.stdin.setRawMode) {
  console.error('Lancez cette commande dans un terminal interactif pour saisir le mot de passe sans l’afficher.')
  process.exit(1)
}

const db = JSON.parse(readFileSync(dbPath, 'utf8'))
const user = db.users.find((item) => item.email?.toLowerCase() === email)
if (!user) {
  console.error('Compte introuvable. Cette commande ne crée pas de nouveau compte.')
  process.exit(1)
}

function readSecret(prompt) {
  return new Promise((resolve, reject) => {
    const input = process.stdin
    let value = ''
    process.stdout.write(prompt)
    input.setRawMode(true)
    input.resume()
    const onData = (buffer) => {
      for (const char of buffer.toString('utf8')) {
        if (char === '\u0003') { cleanup(); reject(new Error('interrompu')); return }
        if (char === '\r' || char === '\n') { cleanup(); process.stdout.write('\n'); resolve(value); return }
        if (char === '\u007f' || char === '\b') value = value.slice(0, -1)
        else if (char >= ' ') value += char
      }
    }
    const cleanup = () => { input.off('data', onData); input.setRawMode(false); input.pause() }
    input.on('data', onData)
  })
}

try {
  const password = await readSecret('Nouveau mot de passe (12 caractères minimum) : ')
  if (password.length < 12 || password.length > 1024) throw new Error('le mot de passe doit contenir entre 12 et 1024 caractères')
  const salt = randomBytes(16).toString('hex')
  const hash = await scrypt(password, salt, 64)
  user.passwordHash = `scrypt$${salt}$${hash.toString('hex')}`
  user.active = true
  writeFileSync(dbPath, JSON.stringify(db, null, 2), { mode: 0o600 })
  console.log(`Mot de passe défini pour ${user.email}. Configurez ALLNEEDS_SESSION_SECRET avant un déploiement.`)
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
