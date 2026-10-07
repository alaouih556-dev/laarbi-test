import fs from 'node:fs'
const root = new URL('../', import.meta.url)
const read = (f) => fs.readFileSync(new URL(f, root), 'utf8')
const catalog = read('src/data/catalog.ts')
const inscription = read('src/routes/inscription.tsx')
const needs = read('src/routes/app/besoins/index.tsx')
const mission = read('src/components/MissionPage.tsx')
const concierge = read('src/routes/concierge/entreprises/$id.tsx')
const rules = [
  ['CONNECT 6/an', /tier: 'CONNECT'[\s\S]*needsPerYear: 6[\s\S]*concurrentNeeds: 2/.test(catalog)],
  ['PLUS 15/an', /tier: 'PLUS'[\s\S]*needsPerYear: 15[\s\S]*concurrentNeeds: 3/.test(catalog)],
  ['PRIORITE 30/an', /tier: 'PRIORITE'[\s\S]*needsPerYear: 30[\s\S]*concurrentNeeds: 5/.test(catalog)],
  ['No forced subscription on signup', /tier: null, payment: null/.test(inscription)],
  ['Quota blocker in needs', /annualLimit[\s\S]*concurrentLimit[\s\S]*blockedReason/.test(needs)],
  ['Full old-price strike UI', /line-through/.test(mission) && /priceNormal/.test(mission)],
  ['Concierge detail preserved', /SaaS métier/.test(concierge)],
]
let failed = false
for (const [name, ok] of rules) { console.log(`${ok ? 'OK' : 'FAIL'} — ${name}`); if (!ok) failed = true }
if (failed) process.exit(1)
