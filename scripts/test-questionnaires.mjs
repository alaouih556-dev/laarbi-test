import fs from 'node:fs'

const source = fs.readFileSync(new URL('../src/data/grid.ts', import.meta.url), 'utf8')

const expectations = {
  ENSEIGNEMENT: [
    'Effectif actuel par rapport à la capacité d’accueil, par niveau ?',
    'Règles internes de diffusion des images d’élèves : autorisations obtenues ?',
    'Télécom, internet, échéances de renouvellement et investissements prévus ?',
  ],
  SANTE: [
    'Combien de patients ou de consultations par semaine, et quelle est la capacité maximale de l’agenda ?',
    'Quels retours les patients donnent-ils sur l’accueil et l’attente ?',
    'Investissements ou renouvellements prévus dans les 12 mois ?',
  ],
  TOURISME: [
    'Capacité (chambres, couverts) et taux d’occupation par mois ?',
    'Partenariats de visibilité (agences, conciergeries, influence) ?',
    'Investissements et renouvellements prévus avant la haute saison ?',
  ],
}

for (const [name, markers] of Object.entries(expectations)) {
  const match = source.match(new RegExp(`const ${name}_LEVERS: GridLever\\[\\] = \\[([\\s\\S]*?)\\n\\]`))
  if (!match) throw new Error(`Section ${name} introuvable`)
  const block = match[1]
  const leverCount = (block.match(/lever\('/g) || []).length
  const questionCount = (block.match(/\?'/g) || []).length
  if (leverCount !== 4) throw new Error(`${name}: ${leverCount} leviers au lieu de 4`)
  if (questionCount !== 28) throw new Error(`${name}: ${questionCount} questions au lieu de 28`)
  for (const marker of markers) {
    if (!block.includes(marker)) throw new Error(`${name}: question repère absente: ${marker}`)
  }
}

console.log('OK — 3 questionnaires distincts, 4 leviers et 28 questions par secteur.')
