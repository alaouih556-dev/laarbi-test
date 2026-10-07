import fs from 'node:fs'
const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), 'utf8')
const store = read('src/store/store.tsx')
const workspace = read('src/features/saas/Workspace.tsx')
const nav = read('src/components/layouts.tsx')
const signup = read('src/routes/inscription.tsx')
const detail = read('src/routes/concierge/entreprises/$id.tsx')
const required = [
  [store.includes('saasAccessByOrg'), 'saasAccessByOrg'],
  [store.includes('conciergeScope'), 'conciergeScope'],
  [workspace.includes('Accès SaaS en attente de validation'), 'locked SaaS screen'],
  [nav.includes("disabled: !saasEnabled"), 'disabled SaaS nav'],
  [signup.includes('WORKSPACE_PROFILES'), 'workspace profile signup'],
  [signup.includes('REGISTRATION_SET'), 'registration profile persisted'],
  [detail.includes('if (!orgIds.has(id)) throw notFound()'), 'concierge URL scope guard'],
]
const failed = required.filter(([ok]) => !ok)
if (failed.length) {
  console.error('V9 access checks failed:', failed.map(([,name]) => name).join(', '))
  process.exit(1)
}
console.log('OK — V9 client SaaS lock, inscription profile, per-company activation and concierge scoping are present.')
