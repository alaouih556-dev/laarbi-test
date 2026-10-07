import { readFileSync } from 'node:fs'
const store=readFileSync('src/store/store.tsx','utf8')
const admin=readFileSync('src/routes/admin/concierges.tsx','utf8')
const client=readFileSync('src/routes/app/espace-metier.tsx','utf8')
const settings=readFileSync('src/routes/app/parametres.tsx','utf8')
const access=readFileSync('src/routes/_public/tarifs.tsx','utf8')
const tariffs=readFileSync('src/routes/_public/tarifs.tsx','utf8')
const css=readFileSync('src/index.css','utf8')
const checks=[
 ['Admin per-company access', admin.includes('Accès aux espaces métier') && admin.includes('SAAS_SET_ORG_ACCESS')],
 ['Health role permissions', store.includes('SanteSaasRole') && admin.includes('Directeur') && admin.includes('Réception') && admin.includes('Comptabilité')],
 ['Client lock/allow state', client.includes('Votre espace métier est encore verrouillé') && client.includes('ACCÈS AUTORISÉ')],
 ['No client role demo selector', !settings.includes('EXPÉRIENCE PAR RÔLE · DÉMONSTRATION')],
 ['Single CTA access', access.includes('secondary={null}')],
 ['Single CTA tariffs', tariffs.includes('secondary={null}')],
 ['Objective cards readable', css.includes('.engine-grid article{border:1px solid #d8e4ef;background:#fff')],
]
for(const [name,ok] of checks){if(!ok) throw new Error(`V22 failed: ${name}`);console.log(`OK — ${name}`)}
console.log('OK — V22 requested UX/access corrections passed.')
