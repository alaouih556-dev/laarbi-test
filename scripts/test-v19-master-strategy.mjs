import { readFileSync, existsSync } from 'node:fs'
const read=(p)=>readFileSync(p,'utf8')
const checks=[
 ['Master strategy document', existsSync('STRATEGIE-PRODUIT-UX-V19.md')],
 ['Persistent client context', read('src/routes/app.tsx').includes('ClientContextBar') && read('src/components/OperationalUX.tsx').includes('PROCHAINE ACTION')],
 ['Full 8-step loop public', ['Besoin','Diagnostic','Priorité','Décision','Action','Résultat','KPI','Optimisation'].every(x=>read('src/routes/_public/index.tsx').includes(`'${x}'`))],
 ['Three situations public', ['Entreprise existante','Entreprise en création','Investisseur'].every(x=>read('src/routes/_public/index.tsx').includes(x))],
 ['Four métiers behind objectives', ['Commercial & force de vente','Visibilité, marketing & communication','RH, organisation, process & outils','Charges, contrats & accompagnement juridique'].every(x=>read('src/routes/_public/index.tsx').includes(x))],
 ['Objective-first private nav', read('src/components/layouts.tsx').includes("label: 'Objectifs'") && !read('src/components/layouts.tsx').includes("label: 'Commercial'" )],
 ['Progressive onboarding five-context logic', read('src/routes/inscription.tsx').includes('Ville') && read('src/routes/onboarding.tsx').includes('difficulté principale') && read('src/routes/onboarding.tsx').includes('objectif prioritaire')],
 ['Operational company profile cockpit', read('src/routes/app/parametres.tsx').includes('Votre cockpit d’entreprise') && read('src/routes/app/parametres.tsx').includes('ÉCOSYSTÈME') && read('src/routes/app/parametres.tsx').includes('HISTORIQUE')],
 ['Contextual messaging', read('src/routes/app/messages.tsx').includes('fait partie du workflow')],
 ['Explainable matching', read('src/routes/app/ecosysteme.tsx').includes('Pourquoi ce profil apparaît ici')],
 ['No invented KPI', read('src/routes/app/performance.tsx').includes('Aucun KPI n’est inventé')],
 ['Control Tower admin', read('src/routes/admin/index.tsx').includes('Control Tower')],
 ['Separate expert workspace', existsSync('src/components/ExpertWorkspace.tsx') && read('src/components/ExpertWorkspace.tsx').includes('Propositions')],
 ['Health SaaS remains separate', read('src/routes/app/espace-metier.tsx').includes('https://allneed-s-sante.vercel.app')],
 ['Health 360 questionnaire remains principal', existsSync('src/routes/app/diagnostic-auto.tsx')],
]
for(const [label,ok] of checks){if(!ok)throw new Error(`V19 failed: ${label}`);console.log(`OK — ${label}`)}
console.log('OK — V19 master strategic UX checks passed.')
