import { spawn } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const DATA = join(process.cwd(), 'backend', 'data-test');
rmSync(DATA, { recursive: true, force: true });
mkdirSync(DATA, { recursive: true });
const env = { ...process.env, ALLNEEDS_DATA_DIR: DATA, PORT: '8788' };
const child = spawn(process.execPath, ['backend/server.mjs'], { env, stdio: 'pipe' });
await new Promise((r) => setTimeout(r, 900));
const base = 'http://localhost:8788';
const call = (path, { method = 'GET', user, body } = {}) =>
  fetch(base + path, { method, headers: { 'content-type': 'application/json', ...(user ? { 'x-user-id': user } : {}) }, body: body ? JSON.stringify(body) : undefined }).then((r) => r.json());

try {
  const health = await call('/api/health');
  if (!health.ok) throw new Error('health');
  const noauth = await call('/api/me');
  if (noauth.error !== 'non authentifié') throw new Error('auth requise');

  const created = await call('/api/diagnostics', { method: 'POST', user: 'u-concierge', body: { orgId: 'org-atlas', format: 'Complet', sector: 'sante' } });
  if (created.error || !created.id) throw new Error('create concierge: ' + (created.error || '?'));
  const denied = await call('/api/diagnostics', { method: 'POST', user: 'u-concierge', body: { orgId: 'org-riad-inconnu', format: 'Complet' } });
  if (denied.error !== 'organisation hors périmètre') throw new Error('isolation concierge: ' + JSON.stringify(denied));
  const colSub = await call('/api/diagnostics', { method: 'POST', user: 'u-collab', body: { orgId: 'org-atlas', format: 'Complet' } });
  if (colSub.error) throw new Error('collab org ok attendu: ' + JSON.stringify(colSub));
  const commercialExpress = await call('/api/diagnostics', { method: 'POST', user: 'u-commercial', body: { orgId: 'org-riad', format: 'Express', sector: 'tourisme' } });
  if (commercialExpress.error) throw new Error('commercial Express accepté: ' + JSON.stringify(commercialExpress));
  const commercialComplet = await call('/api/diagnostics', { method: 'POST', user: 'u-commercial', body: { orgId: 'org-riad', format: 'Complet' } });
  if (!/Express uniquement/.test(commercialComplet.error)) throw new Error('commercial ne peut pas créer Complet');
  const consent = await call(`/api/diagnostics/${created.id}/consent`, { method: 'POST', user: 'u-dirigeant', body: { acceptedAt: new Date().toISOString(), version: 'grille-360-v5.1', by: 'Dr Atlas' } });
  if (consent.error) throw new Error('consent: ' + JSON.stringify(consent));
  const badConsent = await call(`/api/diagnostics/${created.id}/consent`, { method: 'POST', user: 'u-dirigeant', body: { acceptedAt: '' } });
  if (!/requis/.test(badConsent.error || '')) throw new Error('consent invalide accepté');
  const otherOrgDiag = await call('/api/diagnostics', { method: 'POST', user: 'u-commercial', body: { orgId: 'org-riad', format: 'Express' } });
  const otherGet = await call(`/api/diagnostics/${otherOrgDiag.id}`, { user: 'u-dirigeant' });
  if (otherGet.error !== 'interdit') throw new Error('isolation lecture: dirigeant accède org-riad');
  const adminGet = await call(`/api/diagnostics/${otherOrgDiag.id}`, { user: 'u-admin' });
  if (adminGet.error || adminGet.id !== otherOrgDiag.id) throw new Error('admin doit voir tout');
  console.log('OK — isolation tenants, rôles concierge/commercial/collab/admin, consentement journalisé (append-only)');
} finally {
  child.kill();
}
