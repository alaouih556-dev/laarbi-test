import { useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Download, FileJson, Printer, RotateCcw, ShieldCheck } from 'lucide-react'
import { DIAGNOSTIC_GRIDS, GRID_CHARGE_HEADERS, GRID_SCORE_NOTE } from '@/data/grid'
import { SECTOR_LABEL, SECTOR_ORDER } from '@/data/catalog'
import { cn } from '@/lib/utils'
import { Alert, Badge, Button, Card, CardBody, CardHeader, Field, Input, Select, TableWrap, Td, Textarea, Th, Tr } from '@/components/ui'
import type { DiagnosticGrid, GridChargeDraft, GridDraft, Sector } from '@/types'

const STORAGE_PREFIX = 'allneeds.grid.'

function emptyDraft(sector: Sector): GridDraft {
  return {
    sector,
    fields: {},
    documents: {},
    answers: {},
    scores: {},
    keyPoints: {},
    charges: {},
    synth: {},
    criteria: {},
    decision: '',
    decisionNotes: '',
    nextStep: '',
    updatedAt: new Date().toISOString(),
  }
}

function emptyCharge(): GridChargeDraft {
  return { fournisseur: '', cost: '', due: '', notes: '' }
}

function loadDraft(sector: Sector): GridDraft {
  if (typeof window === 'undefined') return emptyDraft(sector)
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + sector)
    if (!raw) return emptyDraft(sector)
    const parsed = JSON.parse(raw) as Partial<GridDraft>
    return { ...emptyDraft(sector), ...parsed, sector }
  } catch {
    return emptyDraft(sector)
  }
}

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function csvCell(value: string): string {
  const safe = /^[=+\-@\t\r]/.test(value.trim()) ? `'${value}` : value
  return `"${safe.replace(/"/g, '""')}"`
}

export function InternalGrid({ sector }: { sector: Sector }) {
  const grid: DiagnosticGrid = DIAGNOSTIC_GRIDS[sector]
  const [draft, setDraft] = useState<GridDraft>(() => loadDraft(sector))
  const [activeStage, setActiveStage] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const stageCount = grid.levers.length + 4
  const stages = ['Préparer', ...grid.levers.map((lever) => lever.name), 'Charges', 'Synthèse', 'Décision']
  const answeredQuestions = grid.levers.reduce((count, lever) => count + lever.questions.filter((question) => (draft.scores[question.id] ?? 0) > 0).length, 0)
  const totalQuestions = grid.levers.reduce((count, lever) => count + lever.questions.length, 0)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_PREFIX + sector, JSON.stringify(draft))
    } catch {
      /* stockage indisponible : la grille reste utilisable en mémoire */
    }
  }, [draft, sector])

  function patch(update: (current: GridDraft) => GridDraft) {
    setDraft((current) => ({ ...update(current), updatedAt: new Date().toISOString() }))
  }

  const leverTotals = useMemo(
    () =>
      grid.levers.map((l) => {
        const scored = l.questions.map((q) => draft.scores[q.id] ?? 0)
        const total = scored.reduce((acc, n) => acc + n, 0)
        const answered = scored.filter((n) => n > 0).length
        return { id: l.id, total, answered, max: l.questions.length * 5 }
      }),
    [grid.levers, draft.scores],
  )

  const qualificationTotal = useMemo(
    () => grid.criteria.reduce((acc, c) => acc + (draft.criteria[c.id]?.note ?? 0), 0),
    [grid.criteria, draft.criteria],
  )

  const reading = grid.readings.find((r) => qualificationTotal >= r.min && qualificationTotal <= r.max)

  function setField(id: string, value: string) {
    patch((d) => ({ ...d, fields: { ...d.fields, [id]: value } }))
  }

  function setAnswer(id: string, value: string) {
    patch((d) => ({ ...d, answers: { ...d.answers, [id]: value } }))
  }

  function setScore(id: string, value: number) {
    patch((d) => {
      const scores = { ...d.scores }
      if (value === 0) delete scores[id]
      else scores[id] = value
      return { ...d, scores }
    })
  }

  function setCharge(id: string, key: keyof GridChargeDraft, value: string) {
    patch((d) => ({
      ...d,
      charges: {
        ...d.charges,
        [id]: { ...emptyCharge(), ...d.charges[id], [key]: value },
      },
    }))
  }

  function setCriterion(id: string, note: number, comment?: string) {
    patch((d) => ({
      ...d,
      criteria: {
        ...d.criteria,
        [id]: { note, comment: comment ?? d.criteria[id]?.comment ?? '' },
      },
    }))
  }

  function buildRows(): [string, string, string][] {
    const rows: [string, string, string][] = []
    rows.push(['En-tête', 'Grille', grid.title])
    rows.push(['En-tête', 'Contexte', grid.context])
    grid.structureFields.forEach((f) => rows.push(['Structure', f.label, draft.fields[f.id] ?? '']))
    grid.documents.forEach((d) => rows.push(['Documents demandés', d, draft.documents[d] ? 'Reçu' : 'Non reçu']))
    grid.levers.forEach((l, i) => {
      const total = leverTotals[i]
      rows.push([`Levier ${i + 1}`, `${l.name} — score`, `${total.total} / ${total.max}`])
      l.questions.forEach((q, qi) => {
        rows.push([`Levier ${i + 1} · Q${qi + 1}`, q.text, draft.answers[q.id] ?? ''])
        rows.push([`Levier ${i + 1} · Q${qi + 1}`, 'Score /5', String(draft.scores[q.id] ?? '')])
      })
      rows.push([`Levier ${i + 1}`, 'Point clé à retenir', draft.keyPoints[l.id] ?? ''])
    })
    grid.chargeRows.forEach((c) => {
      const entry = draft.charges[c.id]
      rows.push(['Charges', c.poste, entry?.fournisseur ?? ''])
      rows.push(['Charges', `${c.poste} — coût annuel HT`, entry?.cost ?? ''])
      rows.push(['Charges', `${c.poste} — échéance`, entry?.due ?? ''])
      rows.push(['Charges', `${c.poste} — observations`, entry?.notes ?? ''])
    })
    grid.synthRows.forEach((s) => rows.push(['Synthèse', s.label, draft.synth[s.id] ?? '']))
    grid.criteria.forEach((c) => {
      const entry = draft.criteria[c.id]
      rows.push(['Qualification', c.label, String(entry?.note ?? '')])
      rows.push(['Qualification', `${c.label} — commentaire`, entry?.comment ?? ''])
    })
    rows.push(['Qualification', 'Score total', `${qualificationTotal} / ${grid.criteria.length * 2}`])
    rows.push(['Qualification', 'Lecture du score', `Lecture du score (${grid.readingsNote})`])
    rows.push(['Décision', 'Recommandation', draft.decision])
    rows.push(['Décision', 'Précisions', draft.decisionNotes])
    rows.push(['Décision', 'Prochain rendez-vous / relance', draft.nextStep])
    return rows
  }

  function exportCsv() {
    const header = ['Section', 'Rubrique', 'Valeur']
    const body = buildRows().map((r) => r.map(csvCell).join(','))
    download(`grille-starter-${sector}-${new Date().toISOString().slice(0, 10)}.csv`, [header.join(','), ...body].join('\n'), 'text/csv;charset=utf-8')
  }

  function exportJson() {
    const payload = {
      meta: {
        titre: grid.title,
        contexte: grid.context,
        secteur: SECTOR_LABEL[sector],
        exporteLe: new Date().toISOString(),
        derniereModification: draft.updatedAt,
      },
      releves: {
        structure: grid.structureFields.map((f) => ({ rubrique: f.label, valeur: draft.fields[f.id] ?? '' })),
        documents: grid.documents.map((d) => ({ document: d, recu: Boolean(draft.documents[d]) })),
        leviers: grid.levers.map((l, i) => ({
          levier: l.name,
          score: leverTotals[i].total,
          maximum: leverTotals[i].max,
          pointCle: draft.keyPoints[l.id] ?? '',
          questions: l.questions.map((q) => ({
            numero: q.id,
            question: q.text,
            reponse: draft.answers[q.id] ?? '',
            score: draft.scores[q.id] ?? null,
          })),
        })),
        charges: grid.chargeRows.map((c) => ({
          poste: c.poste,
          fournisseur: draft.charges[c.id]?.fournisseur ?? '',
          coutAnnuelHT: draft.charges[c.id]?.cost ?? '',
          echeance: draft.charges[c.id]?.due ?? '',
          observations: draft.charges[c.id]?.notes ?? '',
        })),
        synthese: grid.synthRows.map((s) => ({ rubrique: s.label, contenu: draft.synth[s.id] ?? '' })),
        qualification: {
          criteres: grid.criteria.map((c) => ({
            critere: c.label,
            note: draft.criteria[c.id]?.note ?? 0,
            commentaire: draft.criteria[c.id]?.comment ?? '',
          })),
          scoreTotal: qualificationTotal,
          maximum: grid.criteria.length * 2,
          lecture: grid.readings,
          recommandation: reading?.action ?? '',
        },
        decision: {
          recommandation: draft.decision,
          precisions: draft.decisionNotes,
          prochainRendezVous: draft.nextStep,
        },
      },
    }
    download(
      `grille-starter-${sector}-${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(payload, null, 2),
      'application/json',
    )
  }

  function reset() {
    if (typeof window !== 'undefined' && !window.confirm('Effacer toutes les réponses de cette grille ?')) return
    patch(() => emptyDraft(sector))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-ink-100 bg-white p-3">
        {SECTOR_ORDER.map((s) => (
          <Link
            key={s}
            to="/admin/grille"
            search={{ secteur: s }}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-semibold transition',
              s === sector
                ? 'border-ink-950 bg-ink-950 text-white'
                : 'border-ink-200 text-ink-600 hover:border-ink-400 hover:text-ink-950',
            )}
          >
            {SECTOR_LABEL[s]}
          </Link>
        ))}
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => window.print()}>
            <Printer className="h-3.5 w-3.5" />
            Imprimer
          </Button>
          <Button size="sm" variant="outline" onClick={exportCsv}>
            <Download className="h-3.5 w-3.5" />
            CSV
          </Button>
          <Button size="sm" variant="outline" onClick={exportJson}>
            <FileJson className="h-3.5 w-3.5" />
            JSON
          </Button>
          <Button size="sm" variant="ghost" onClick={reset}>
            <RotateCcw className="h-3.5 w-3.5" />
            Réinitialiser
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-ink-100 bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[.14em] text-brand-700">Entretien guidé · {activeStage + 1} / {stageCount}</p><h2 className="mt-1 text-xl font-bold text-ink-950">{stages[activeStage]}</h2><p className="mt-1 text-sm text-ink-500">{answeredQuestions} / {totalQuestions} questions évaluées · sauvegarde automatique activée</p></div>
          <div className="w-full sm:w-52"><div className="flex justify-between text-xs text-ink-500"><span>Avancement</span><span>{Math.round((activeStage / (stageCount - 1)) * 100)} %</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-ink-100"><div className="h-full rounded-full bg-brand-600 transition-all" style={{width:`${(activeStage/(stageCount-1))*100}%`}}/></div></div>
        </div>
        <div className="mt-4 flex gap-1.5">{stages.map((stage,index)=><span key={stage} title={stage} className={`h-1.5 flex-1 rounded-full ${index<activeStage?'bg-emerald-500':index===activeStage?'bg-brand-600':'bg-ink-100'}`}/>)}</div>
      </div>

      {activeStage === 0 ? <Card>
        <CardHeader
          title={grid.title}
          description={grid.context}
          action={<Badge tone="warning">Usage interne</Badge>}
        />
        <CardBody className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {grid.structureFields.map((field) => (
              <Field key={field.id} label={field.label}>
                {field.type === 'select' ? (
                  <Select value={draft.fields[field.id] ?? ''} onChange={(e) => setField(field.id, e.target.value)}>
                    <option value="">{field.placeholder}</option>
                    {field.options?.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Input
                    type={field.type === 'date' ? 'date' : 'text'}
                    value={draft.fields[field.id] ?? ''}
                    placeholder={field.placeholder}
                    onChange={(e) => setField(field.id, e.target.value)}
                  />
                )}
              </Field>
            ))}
          </div>

          <div>
            <p className="text-sm font-semibold text-ink-950">Avant le rendez-vous : documents à demander</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {grid.documents.map((doc) => {
                const checked = Boolean(draft.documents[doc])
                return (
                  <button
                    key={doc}
                    type="button"
                    onClick={() =>
                      patch((d) => ({ ...d, documents: { ...d.documents, [doc]: !d.documents[doc] } }))
                    }
                    className={cn(
                      'flex items-start gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm transition',
                      checked
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                        : 'border-ink-200 bg-white text-ink-700 hover:border-ink-400',
                    )}
                  >
                    <span
                      className={cn(
                        'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[0.6rem] font-bold',
                        checked ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-ink-300 text-transparent',
                      )}
                    >
                      ✓
                    </span>
                    {doc}
                  </button>
                )
              })}
            </div>
          </div>

          <details className="rounded-xl border border-ink-100">
            <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-ink-800">Voir le déroulé du rendez-vous <span className="font-normal text-ink-500">· 90 minutes</span></summary>
            <div className="border-t border-ink-100 p-3">
            <TableWrap className="mt-3">
              <thead>
                <tr>
                  <Th>Durée</Th>
                  <Th>Bloc</Th>
                  <Th>Objectif</Th>
                </tr>
              </thead>
              <tbody>
                {grid.steps.map((step) => (
                  <Tr key={step.range}>
                    <Td>
                      <span className="whitespace-nowrap font-medium text-ink-900">{step.range}</span>
                    </Td>
                    <Td>
                      <span className="font-medium text-ink-900">{step.block}</span>
                      <span className="block text-xs text-ink-500">{step.duration}</span>
                    </Td>
                    <Td>{step.objective}</Td>
                  </Tr>
                ))}
              </tbody>
            </TableWrap>
            </div>
          </details>

          <details className="rounded-xl border border-amber-200 bg-amber-50/40"><summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-amber-950">Voir les règles de confidentialité et le périmètre d’intervention</summary><div className="px-3 pb-3"><Alert tone="warning" title={sector === 'sante' ? 'Notre engagement pour votre structure' : `Garde-fous ${SECTOR_LABEL[sector]}`} icon={<ShieldCheck className="h-4 w-4" />}>
            {sector === 'sante' ? <p className="mb-3">Notre analyse porte sur l’organisation, la gestion et la performance de votre structure — jamais sur la prise en charge médicale de vos patients.</p> : null}
            <ul className="mt-1 list-disc space-y-1 pl-4">
              {grid.guardrails.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </Alert></div></details>
        </CardBody>
      </Card> : null}

      {(activeStage >= 1 && activeStage <= grid.levers.length ? [grid.levers[activeStage - 1]] : []).map((l) => {
        const index = activeStage - 1
        const totals = leverTotals[index]
        const question = l.questions[Math.min(questionIndex, l.questions.length - 1)]
        const isLastQuestion = questionIndex >= l.questions.length - 1
        return (
          <Card key={l.id}>
            <CardHeader
              title={l.name}
              description={`${l.scoreNote} · Question ${Math.min(questionIndex + 1,l.questions.length)} sur ${l.questions.length}`}
              action={
                <Badge tone={totals.total >= totals.max * 0.7 ? 'success' : totals.total > 0 ? 'warning' : 'neutral'}>
                  Score du levier : {totals.total} / {totals.max}
                </Badge>
              }
            />
            <CardBody className="space-y-4">
              <div className="min-h-[280px] rounded-2xl border border-ink-100 bg-ink-50/50 p-5 sm:p-7">
                  <div key={question.id} className="rounded-xl border border-ink-100 bg-white p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <p className="max-w-3xl text-lg font-semibold leading-relaxed text-ink-950">
                        {question.text}
                      </p>
                      <div className="flex shrink-0 items-center gap-1">
                        {[1, 2, 3, 4, 5].map((n) => {
                          const active = draft.scores[question.id] === n
                          return (
                            <button
                              key={n}
                              type="button"
                              onClick={() => setScore(question.id, active ? 0 : n)}
                              className={cn(
                                'h-11 w-11 rounded-xl border text-base font-bold transition',
                                active
                                  ? 'border-brand-600 bg-brand-600 text-white'
                                  : 'border-ink-200 text-ink-500 hover:border-ink-400 hover:text-ink-900',
                              )}
                            >
                              {n}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-ink-400">1 = point faible majeur · 3 = partiellement maîtrisé · 5 = maîtrisé</p>
                    <Textarea rows={4} className="mt-4 bg-white" placeholder="Que vous a répondu le dirigeant ? Notez un fait ou un exemple concret…" value={draft.answers[question.id] ?? ''} onChange={(e) => setAnswer(question.id, e.target.value)} />
                  </div>
              </div>
              <div className="flex items-center justify-between gap-3"><Button size="sm" variant="outline" disabled={questionIndex===0} onClick={()=>setQuestionIndex(Math.max(0,questionIndex-1))}><ArrowLeft size={14}/> Question précédente</Button><span className="text-xs font-medium text-ink-500">{questionIndex+1} / {l.questions.length}</span><Button size="sm" variant="outline" disabled={isLastQuestion} onClick={()=>setQuestionIndex(Math.min(l.questions.length-1,questionIndex+1))}>Question suivante <ArrowRight size={14}/></Button></div>

              {isLastQuestion ? <Field label="En une phrase : qu’est-ce que le dirigeant doit retenir ?" hint="Reformulez le constat clé avec ses mots si possible.">
                <Input
                  value={draft.keyPoints[l.id] ?? ''}
                  placeholder="Le principal enseignement de cet échange…"
                  onChange={(e) =>
                    patch((d) => ({ ...d, keyPoints: { ...d.keyPoints, [l.id]: e.target.value } }))
                  }
                />
              </Field> : null}
            </CardBody>
          </Card>
        )
      })}

      {activeStage === grid.levers.length + 1 ? <Card>
        <CardHeader title="Charges récurrentes : relevé" description={grid.chargeIntro} />
        <CardBody>
          <TableWrap>
            <thead>
              <tr>
                <Th>Poste</Th>
                {GRID_CHARGE_HEADERS.map((h) => (
                  <Th key={h}>{h}</Th>
                ))}
              </tr>
            </thead>
            <tbody>
                {grid.chargeRows.map((c) => (
                  <Tr key={c.id}>
                    <Td>
                      <span className="font-medium text-ink-900">{c.poste}</span>
                    </Td>
                    <Td>
                      <Input
                        value={draft.charges[c.id]?.fournisseur ?? ''}
                        placeholder="Fournisseur"
                        onChange={(e) => setCharge(c.id, 'fournisseur', e.target.value)}
                      />
                    </Td>
                    <Td>
                      <Input
                        value={draft.charges[c.id]?.cost ?? ''}
                        placeholder="0 DH"
                        onChange={(e) => setCharge(c.id, 'cost', e.target.value)}
                      />
                    </Td>
                    <Td>
                      <Input
                        value={draft.charges[c.id]?.due ?? ''}
                        placeholder="JJ/MM"
                        onChange={(e) => setCharge(c.id, 'due', e.target.value)}
                      />
                    </Td>
                    <Td>
                      <Input
                        value={draft.charges[c.id]?.notes ?? ''}
                        placeholder="Observations"
                        onChange={(e) => setCharge(c.id, 'notes', e.target.value)}
                      />
                    </Td>
                  </Tr>
                ))}
            </tbody>
          </TableWrap>
        </CardBody>
      </Card> : null}

      {activeStage === grid.levers.length + 2 ? <Card>
        <CardHeader title="Synthèse du diagnostic" description="À remplir avec le client avant la fin du rendez-vous." />
        <CardBody className="space-y-4">
          {grid.synthRows.map((s) => (
            <Field key={s.id} label={s.label}>
              <Textarea
                rows={s.lines}
                value={draft.synth[s.id] ?? ''}
                onChange={(e) =>
                  patch((d) => ({ ...d, synth: { ...d.synth, [s.id]: e.target.value } }))
                }
              />
            </Field>
          ))}
        </CardBody>
      </Card> : null}

      {activeStage === grid.levers.length + 3 ? <Card className="border-amber-300">
        <CardHeader
          title="Qualification commerciale"
          description="Ne pas montrer au client."
          action={<Badge tone="warning">{qualificationTotal} / {grid.criteria.length * 2}</Badge>}
        />
        <CardBody className="space-y-4">
          <p className="text-sm text-ink-600">{grid.criteriaNote}</p>

          <div className="space-y-3">
            {grid.criteria.map((c) => {
              const entry = draft.criteria[c.id]
              return (
                <div key={c.id} className="rounded-xl border border-ink-100 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-medium text-ink-900">{c.label}</p>
                    <div className="flex items-center gap-1">
                      {[0, 1, 2].map((n) => {
                        const active = (entry?.note ?? 0) === n
                        return (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setCriterion(c.id, n)}
                            className={cn(
                              'h-8 w-8 rounded-lg border text-sm font-semibold transition',
                              active
                                ? 'border-ink-950 bg-ink-950 text-white'
                                : 'border-ink-200 text-ink-500 hover:border-ink-400 hover:text-ink-900',
                            )}
                          >
                            {n}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <Input
                    className="mt-2"
                    placeholder="Commentaire"
                    value={entry?.comment ?? ''}
                    onChange={(e) => setCriterion(c.id, entry?.note ?? 0, e.target.value)}
                  />
                </div>
              )
            })}
          </div>

          <div className="rounded-xl bg-ink-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
              Lecture du score ({grid.readingsNote})
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-ink-600">
              {grid.readings.map((r) => (
                <li key={r.range} className={cn(reading?.range === r.range && 'font-semibold text-ink-950')}>
                  <span className="inline-block w-20 font-semibold">{r.range}</span>
                  {r.action}
                </li>
              ))}
            </ul>
            {reading ? (
              <p className="mt-3 flex items-start gap-2 text-sm font-semibold text-brand-700">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                {reading.action}
              </p>
            ) : null}
          </div>

          <div>
            <p className="text-sm font-semibold text-ink-950">Décision</p>
            <TableWrap className="mt-3">
              <thead>
                <tr>
                  <Th>Rubrique</Th>
                  <Th>Précisions</Th>
                </tr>
              </thead>
              <tbody>
                <Tr>
                  <Td>
                    <span className="font-medium text-ink-900">Score total</span>
                  </Td>
                  <Td>
                    <span className="text-sm font-semibold text-ink-950">
                      {qualificationTotal} / {grid.criteria.length * 2}
                    </span>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <span className="font-medium text-ink-900">Recommandation</span>
                    <span className="block text-xs text-ink-500">
                      {grid.decisions.join(' · ')}
                    </span>
                  </Td>
                  <Td>
                    <Select
                      value={draft.decision}
                      onChange={(e) => patch((d) => ({ ...d, decision: e.target.value }))}
                    >
                      <option value="">Sélectionnez</option>
                      {grid.decisions.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </Select>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <span className="font-medium text-ink-900">Prochain rendez-vous / relance</span>
                  </Td>
                  <Td>
                    <Input
                      type="date"
                      value={draft.nextStep}
                      onChange={(e) => patch((d) => ({ ...d, nextStep: e.target.value }))}
                    />
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <span className="font-medium text-ink-900">Précisions</span>
                  </Td>
                  <Td>
                    <Textarea
                      rows={2}
                      placeholder="Engagements, qui fait quoi, pour quand"
                      value={draft.decisionNotes}
                      onChange={(e) => patch((d) => ({ ...d, decisionNotes: e.target.value }))}
                    />
                  </Td>
                </Tr>
              </tbody>
            </TableWrap>
          </div>
        </CardBody>
      </Card> : null}

      <div className="sticky bottom-3 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink-200 bg-white/95 p-3 shadow-lift backdrop-blur"><Button variant="outline" disabled={activeStage===0} onClick={()=>{setActiveStage(Math.max(0,activeStage-1));setQuestionIndex(0)}}><ArrowLeft size={15}/> Étape précédente</Button><span className="text-center text-xs text-ink-500">Brouillon sauvegardé automatiquement sur cet appareil</span>{activeStage<stageCount-1?<Button onClick={()=>{setActiveStage(Math.min(stageCount-1,activeStage+1));setQuestionIndex(0)}}>Continuer : {stages[activeStage+1]} <ArrowRight size={15}/></Button>:<Button onClick={exportCsv}><Check size={15}/> Terminer et exporter la synthèse</Button>}</div>

      <p className="text-center text-xs text-ink-400">
        Brouillon enregistré automatiquement dans ce navigateur · dernière modification{' '}
        {new Date(draft.updatedAt).toLocaleString('fr-FR')} · {GRID_SCORE_NOTE}
      </p>
    </div>
  )
}
