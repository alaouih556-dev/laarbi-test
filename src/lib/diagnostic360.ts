/* Moteur de calcul du diagnostic 360° — règles v5.1. */
/* Toute logique de score/couverture/conclusivité vit ici, pas dans l'UI. */
import { QUESTIONS, VOLETS, type DiagnosticQuestion } from '../features/health360/diagnosticData'

export type DiagnosticFormat = 'Complet' | 'Express'
export type AnswersMap = Record<string, { score: number; comment: string }>

export interface SideStats {
  /** Somme des notes > 0 */
  total: number
  /** Moyenne des notes > 0 (0 = note absente, jamais une faiblesse) */
  avg: number
  /** total / (5 * nb de notes renseignées) * 100 */
  index: number
  /** Nombre de questions notées (> 0) */
  coverage: number
  /** Nombre de questions à 0 / non évaluées dans le volet */
  zeros: number
  /** Questions internes ou externes visibles dans ce format */
  pool: number
  /** Dénominateur du rapport : 5 * pool */
  max: number
}

export interface VoletStats {
  id: number
  internal: SideStats
  external: SideStats
  /** Plus de 2 questions internes à 0 => volet non conclusif */
  conclusive: boolean
  /** Indice indicatif du volet sur les questions de ce format */
  index: number
}

export interface RankedQuestion {
  q: DiagnosticQuestion
  s: number
}

export interface DiagnosticSummary {
  byVolet: VoletStats[]
  forces: RankedQuestion[]
  weaknesses: RankedQuestion[]
  priorities: (RankedQuestion & { priority: number })[]
  opportunities: (RankedQuestion & { gap: number })[]
  threats: (RankedQuestion & { gap: number })[]
  /** Questions visibles dans ce format */
  totalQuestions: number
  /** Questions répondues (> 0) parmi les visibles */
  answered: number
  /** true si toutes les questions visibles sont répondues */
  complete: boolean
  /** En Express, l'indice est indicatif et les volets ne sont pas classés entre eux */
  indicative: boolean
}

export function isVisible(q: DiagnosticQuestion, format: DiagnosticFormat): boolean {
  return format === 'Express' ? q.starred : true
}

export function visibleQuestions(format: DiagnosticFormat): DiagnosticQuestion[] {
  return QUESTIONS.filter((q) => isVisible(q, format))
}

function sideStats(questions: DiagnosticQuestion[], answers: AnswersMap): SideStats {
  const scores = questions.map((q) => answers[q.id]?.score ?? 0)
  const noted = scores.filter((s) => s > 0)
  const total = noted.reduce((a, b) => a + b, 0)
  return {
    total,
    avg: noted.length ? total / noted.length : 0,
    index: noted.length ? (total / (5 * noted.length)) * 100 : 0,
    coverage: noted.length,
    zeros: scores.filter((s) => s === 0).length,
    pool: questions.length,
    max: 5 * questions.length,
  }
}

export function computeDiagnostic(answers: AnswersMap, format: DiagnosticFormat): DiagnosticSummary {
  const byVolet: VoletStats[] = VOLETS.map((v) => {
    const visible = QUESTIONS.filter((q) => Number(q.id[0]) === v.id && isVisible(q, format))
    const internalQs = visible.filter((q) => q.internal)
    const externalQs = visible.filter((q) => !q.internal)
    const internal = sideStats(internalQs, answers)
    const external = sideStats(externalQs, answers)
    return {
      id: v.id,
      internal,
      external,
      conclusive: internal.zeros <= 2,
      index:
        internal.pool + external.pool > 0
          ? (internal.index * internal.pool + external.index * external.pool) / (internal.pool + external.pool)
          : 0,
    }
  })
  const visible = visibleQuestions(format)
  const scoredInternal = visible
    .filter((q) => q.internal && (answers[q.id]?.score ?? 0) > 0)
    .map((q) => ({ q, s: answers[q.id]!.score }))
  const scoredExternal = visible
    .filter((q) => !q.internal && (answers[q.id]?.score ?? 0) > 0)
    .map((q) => ({ q, s: answers[q.id]!.score }))
  return {
    byVolet,
    forces: scoredInternal.filter((x) => x.s >= 4).sort((a, b) => b.s - a.s || (b.q.weight ?? 0) - (a.q.weight ?? 0)).slice(0, 3),
    weaknesses: scoredInternal.filter((x) => x.s <= 2).sort((a, b) => a.s - b.s || (b.q.weight ?? 0) - (a.q.weight ?? 0)).slice(0, 3),
    priorities: scoredInternal
      .map((x) => ({ ...x, priority: (5 - x.s) * (x.q.weight ?? 0) }))
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 3),
    opportunities: scoredExternal
      .filter((x) => x.q.type === 'Opportunité' && x.s <= 3)
      .map((x) => ({ ...x, gap: (5 - x.s) * (x.q.enjeu ?? 0) }))
      .sort((a, b) => b.gap - a.gap)
      .slice(0, 3),
    threats: scoredExternal
      .filter((x) => x.q.type === 'Menace' && x.s <= 3)
      .map((x) => ({ ...x, gap: (5 - x.s) * (x.q.enjeu ?? 0) }))
      .sort((a, b) => b.gap - a.gap)
      .slice(0, 3),
    totalQuestions: visible.length,
    answered: visible.filter((q) => (answers[q.id]?.score ?? 0) > 0).length,
    complete: visible.length > 0 && visible.every((q) => (answers[q.id]?.score ?? 0) > 0),
    indicative: format === 'Express',
  }
}
