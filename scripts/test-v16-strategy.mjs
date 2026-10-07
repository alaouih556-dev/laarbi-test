import { readFileSync, existsSync } from 'node:fs'

const requiredFiles = [
  'src/lib/operational.ts',
  'src/components/OperationalUX.tsx',
  'src/routes/app/objectifs.tsx',
  'src/routes/app/actions.tsx',
  'src/routes/app/equipe.tsx',
  'src/routes/app/ecosysteme.tsx',
  'src/routes/app/performance.tsx',
  'src/routes/app/projets.tsx',
  'src/routes/app/notifications.tsx',
  'src/routes/app/parametres.tsx',
  'src/routes/expert.tsx',
  'src/routes/expert/index.tsx',
]
for (const file of requiredFiles) {
  if (!existsSync(file)) throw new Error(`V16 missing file: ${file}`)
}

const dashboard = readFileSync('src/routes/app/index.tsx', 'utf8')
const operational = readFileSync('src/lib/operational.ts', 'utf8')
const layouts = readFileSync('src/components/layouts.tsx', 'utf8')
const signup = readFileSync('src/routes/inscription.tsx', 'utf8')
const onboarding = readFileSync('src/routes/onboarding.tsx', 'utf8')
const ecosystem = readFileSync('src/routes/app/ecosysteme.tsx', 'utf8')
const performance = readFileSync('src/routes/app/performance.tsx', 'utf8')
const expert = readFileSync('src/components/ExpertWorkspace.tsx', 'utf8')

const assertions = [
  ['Action-first cockpit', dashboard.includes('À traiter') && dashboard.toLowerCase().includes('documents à suivre') && dashboard.includes('buildNextActions') && !dashboard.includes('WorkflowStrip')],
  ['Operational action engine', operational.includes('buildNextActions') && dashboard.includes('buildNextActions')],
  ['Objective-first navigation', layouts.includes("label: 'Objectifs'") && (layouts.includes("label: 'Actions'") || layouts.includes("label: 'Plan d’action'")) && !layouts.includes("label: 'Commercial'" )],
  ['Three user situations', signup.includes('entreprise_existante') && signup.includes('creation') && signup.includes('investisseur')],
  ['Progressive onboarding', onboarding.includes('Onboarding progressif') && onboarding.includes('principale difficulté')],
  ['Role-sensitive client navigation', layouts.includes('clientWorkspaceRole') && layouts.includes("workspaceRole === 'collaborateur'")],
  ['Explainable matching', ecosystem.includes('Pourquoi ce profil apparaît ici') && operational.includes('providerReasons')],
  ['No invented KPI principle', performance.includes('Aucun KPI n’est inventé')],
  ['Expert workspace', expert.includes('Demandes') && expert.includes('Missions') && expert.includes('Clients') && expert.includes('Agenda') && expert.includes('Propositions') && expert.includes('Documents') && expert.includes('Performance') && expert.includes('Profil')],
  ['Contextual notifications', existsSync('src/routes/app/notifications.tsx')],
  ['Health link direct', readFileSync('src/routes/app/espace-metier.tsx','utf8').includes('https://allneed-s-sante.vercel.app')],
]
for (const [label, ok] of assertions) {
  if (!ok) throw new Error(`V16 strategy check failed: ${label}`)
  console.log(`OK — ${label}`)
}
console.log('OK — V16 strategic UX/product architecture checks passed.')
