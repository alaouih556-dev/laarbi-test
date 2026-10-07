import { createJiti } from 'jiti'

const jiti = createJiti(import.meta.url, { moduleCache: false })
const engine = await jiti.import('../src/lib/diagnostic360.ts')
const { QUESTIONS } = await jiti.import('../src/features/health360/diagnosticData.ts')

function uniform(score) {
  const answers = {}
  for (const q of QUESTIONS) answers[q.id] = { score, comment: 'x' }
  return answers
}

// 1. Complet : 40 questions, volets 7 internes / 3 externes, indice 80 % à note uniforme 4
const compact = engine.computeDiagnostic(uniform(4), 'Complet')
if (compact.totalQuestions !== 40) throw new Error('Complet: 40 questions attendues, ' + compact.totalQuestions)
if (!compact.byVolet.every((v) => v.conclusive && v.internal.pool === 7 && v.external.pool === 3)) throw new Error('Complet: volets attendus 7 internes / 3 externes')
if (compact.indicative !== false) throw new Error('Complet ne doit pas être indicatif')
if (compact.byVolet.some((v) => v.internal.index !== 80)) throw new Error('Note uniforme 4 => indice 80 %')

// 2. Express : seules les questions ✱ comptent, indice indicatif
const express = engine.computeDiagnostic(uniform(4), 'Express')
const starredCount = QUESTIONS.filter((q) => q.starred).length
if (express.totalQuestions !== starredCount) throw new Error(`Express: ${starredCount} questions attendues, ${express.totalQuestions}`)
if (!express.indicative) throw new Error('Express doit être indicatif')
const expressInternalPool = express.byVolet.reduce((n, v) => n + v.internal.pool, 0)
if (expressInternalPool !== QUESTIONS.filter((q) => q.starred && q.internal).length) throw new Error('Express: pools internes faux')

// 3. 0 exclu des moyennes/indices, jamais une faiblesse ; volet à 7 internes 0 => non conclusif
const partial = {}
for (const q of QUESTIONS) partial[q.id] = { score: 0, comment: '' }
for (const q of QUESTIONS.filter((q) => q.internal && q.id.startsWith('1'))) partial[q.id] = { score: 5, comment: 'observé' }
const p = engine.computeDiagnostic(partial, 'Complet')
const v1 = p.byVolet[0]
if (v1.internal.avg !== 5 || v1.internal.index !== 100 || v1.internal.coverage !== 7) throw new Error('0 doit être exclu de moyenne/indice/couverture')
if (p.byVolet[1].conclusive !== false) throw new Error('Volet internes à 0 => non conclusif')
if (p.priorities.some((x) => x.s === 0) || p.weaknesses.some((x) => x.s === 0)) throw new Error('0 ne doit pas alimenter priorités/faiblesses')

// 4. Express : la conclusivité ne doit pas dépendre des questions non posées
const expressAnswers = {}
for (const q of QUESTIONS) expressAnswers[q.id] = { score: 0, comment: '' }
for (const q of QUESTIONS.filter((q) => q.starred)) expressAnswers[q.id] = { score: 4, comment: 'x' }
const pe = engine.computeDiagnostic(expressAnswers, 'Express')
if (pe.byVolet.some((v) => !v.conclusive)) throw new Error('Express: conclusivité calculée sur les questions non posées')
if (!pe.complete) throw new Error('Express: toutes les questions ✱ répondues => complet')

// 5. Priorités : (5 - note) × poids
const pw = uniform(5)
const low = QUESTIONS.find((q) => q.internal && q.weight === 3)
pw[low.id] = { score: 1, comment: '' }
const pr = engine.computeDiagnostic(pw, 'Complet')
if (pr.priorities[0].priority !== (5 - 1) * 3) throw new Error('Priorité = (5 - note) × poids')

console.log('OK — moteur diagnostic 360 (0 exclu, Express ✱, conclusivité, priorités) v5.1')
