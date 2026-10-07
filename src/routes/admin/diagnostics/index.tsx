import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Check, Eye, FileCheck2, Gauge, LockKeyhole, Pencil, Send, ShieldCheck, Undo2 } from 'lucide-react'
import { useDemo } from '@/store/store'
import { PageHeader } from '@/components/layouts'
import {
  Alert,
  Badge,
  Button,
  Card,
  CardHeader,
  CardBody,
  Field,
  Meter,
  Modal,
  Tabs,
  Textarea,
  useDisclosure,
} from '@/components/ui'
import { LEVER_LABEL } from '@/lib/status'
import { minutesToHours } from '@/lib/metrics'
import { longDate, relative } from '@/lib/format'
import { byId } from '@/lib/utils'
import type { InternalDiagnostic, Levers } from '@/types'

export const Route = createFileRoute('/admin/diagnostics/')({
  component: AdminDiagnostics,
  head: () => ({ meta: [{ title: 'Diagnostics internes — ALLNEEDS' }] }),
})

const LEVERS: Levers[] = [
  'inscriptions',
  'image',
  'equipe',
  'charges',
  'offre',
  'frequentation',
  'conformite',
  'experience',
]

export function AdminDiagnostics() {
  const { state, dispatch } = useDemo()
  const [filter, setFilter] = useState('tous')
  const [checks, setChecks] = useState<Record<string, boolean[]>>({})
  const edit = useDisclosure()
  const [draft, setDraft] = useState<InternalDiagnostic | null>(null)

  const list = state.diagnostics
    .filter((d) => (filter === 'tous' ? true : d.status === filter))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  function openEdit(diag: InternalDiagnostic) {
    setDraft(JSON.parse(JSON.stringify(diag)) as InternalDiagnostic)
    edit.openFn()
  }

  function save() {
    if (!draft) return
    dispatch({ type: 'DIAGNOSTIC_SAVE', diagnostic: draft })
    edit.close()
  }

  return (
    <>
      <PageHeader
        eyebrow="Interne"
        title="Préparer la restitution au dirigeant"
        description="La relecture vérifie que le diagnostic est juste, confidentiel et compréhensible — puis décide s’il peut être partagé avec le client."
        actions={
          <Badge tone="warning">
            {state.diagnostics.filter((d) => d.status === 'en_revue').length} en relecture
          </Badge>
        }
      />

      <div className="mb-5">
        <Tabs
          value={filter}
          onChange={setFilter}
          tabs={[
            { value: 'tous', label: 'Tous', count: state.diagnostics.length },
            { value: 'brouillon', label: 'Brouillons', count: state.diagnostics.filter((d) => d.status === 'brouillon').length },
            { value: 'en_revue', label: 'En relecture', count: state.diagnostics.filter((d) => d.status === 'en_revue').length },
            { value: 'publie', label: 'Publiés', count: state.diagnostics.filter((d) => d.status === 'publie').length },
          ]}
        />
      </div>

      <div className="space-y-4">
        {list.map((diag) => {
          const org = byId(state.orgs, diag.orgId)
          const average = diag.scores.length ? Math.round(diag.scores.reduce((a, s) => a + s.score, 0) / diag.scores.length) : 0
          const reviewChecks = checks[diag.id] ?? [false, false, false]
          const readyToPublish = reviewChecks.every(Boolean)
          const lowest = [...diag.scores].sort((a,b)=>a.score-b.score).slice(0,2)
          return (
            <Card key={diag.id}>
              <CardHeader
                title={`${diag.ref} · ${org?.name ?? 'Établissement'}`}
                description={`${diag.author} · ${minutesToHours(diag.durationMin)} · créé ${relative(diag.createdAt, new Date(state.now).getTime())}`}
                action={
                  <div className="flex items-center gap-2">
                    <Badge tone={diag.status === 'publie' ? 'success' : diag.status === 'en_revue' ? 'warning' : 'neutral'}>
                      {diag.status === 'publie' ? 'Publié' : diag.status === 'en_revue' ? 'En relecture' : 'Brouillon'}
                    </Badge>
                    <Badge tone="neutral">Score {average}</Badge>
                  </div>
                }
              />
              <CardBody>
                <div className="rounded-2xl border border-brand-100 bg-brand-50/50 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div><p className="text-xs font-bold uppercase tracking-[.14em] text-brand-700">La décision à prendre</p><h3 className="mt-1 text-xl font-bold text-ink-950">Ce diagnostic est-il prêt à être restitué ?</h3><p className="mt-1 max-w-3xl text-sm leading-relaxed text-ink-600">Le dirigeant doit pouvoir comprendre sa situation, reconnaître les constats et repartir avec des priorités concrètes.</p></div>
                    <div className="rounded-xl bg-white px-4 py-3 text-right"><span className="block text-xs text-ink-500">Lecture globale</span><strong className="font-display text-3xl text-ink-950">{average}<span className="text-base text-ink-400">/100</span></strong></div>
                  </div>
                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    <DecisionTile number="01" label="Commencer par" value={LEVER_LABEL[lowest[0]?.lever] ?? 'Le besoin prioritaire'} detail={diag.difficulties[0] ?? 'Difficulté à confirmer avec le dirigeant.'} tone="warning"/>
                    <DecisionTile number="02" label="S’appuyer sur" value={diag.strengths[0] ?? 'Les atouts de l’entreprise'} detail="À préserver et mobiliser dans le plan d’action." tone="success"/>
                    <DecisionTile number="03" label="Premier résultat attendu" value={diag.priorities[0] ?? 'Priorité à préciser'} detail={diag.opportunities[0] ?? 'Définir une première action mesurable avec le client.'} tone="brand"/>
                  </div>
                </div>

                {diag.notes ? <div className="mt-4 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"><LockKeyhole className="mt-0.5 h-4 w-4 shrink-0"/><div><strong>Note interne — ne pas transmettre au client</strong><p className="mt-1">{diag.notes}</p></div></div> : null}

                <details className="mt-4 rounded-xl border border-ink-100 bg-white"><summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-ink-800">Voir les éléments détaillés de la relecture <span className="ml-1 text-xs font-normal text-ink-500">Scores, constats et opportunités</span></summary><div className="grid gap-5 border-t border-ink-100 p-4 lg:grid-cols-[.9fr_1.1fr]"><div><p className="text-xs font-bold uppercase tracking-wider text-ink-500">Scores par levier</p><ul className="mt-3 space-y-2">{diag.scores.map(s=><li key={s.lever} className="flex items-center justify-between gap-3"><span className="text-sm text-ink-700">{LEVER_LABEL[s.lever]??s.lever}</span><Meter value={s.score}/></li>)}</ul></div><div className="grid gap-4 sm:grid-cols-2"><InternalList title="Forces confirmées" items={diag.strengths} tone="success"/><InternalList title="Difficultés à traiter" items={diag.difficulties} tone="warning"/><InternalList title="Pistes d’amélioration" items={diag.opportunities} tone="info"/><InternalList title="Priorités proposées" items={diag.priorities} tone="brand"/></div></div></details>

                {diag.status !== 'publie' ? <div className="mt-5 rounded-xl border border-ink-100 p-4"><div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-700"/><div><h4 className="font-semibold text-ink-950">Avant de partager avec le dirigeant</h4><p className="mt-1 text-xs text-ink-500">Cochez les vérifications réellement effectuées. La publication rend le diagnostic visible dans son espace.</p><div className="mt-3 grid gap-2">{['Aucun nom de prestataire, patient ou salarié ne révèle une information confidentielle.','Chaque priorité découle d’un constat vérifiable du diagnostic.','La restitution indique une première action réaliste, sans promettre un résultat garanti.'].map((label,index)=><label key={label} className="flex cursor-pointer items-start gap-2.5 rounded-lg bg-ink-50 px-3 py-2.5 text-sm text-ink-700"><input type="checkbox" checked={reviewChecks[index]} onChange={event=>setChecks(current=>({...current,[diag.id]:reviewChecks.map((checked,i)=>i===index?event.target.checked:checked)}))} className="mt-1 accent-brand-700"/><span>{label}</span></label>)}</div></div></div></div> : <div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800"><Check className="h-4 w-4"/>Partagé le {diag.publishedAt ? longDate(diag.publishedAt) : '—'} · visible par {org?.contactName ?? 'le client'}.</div>}

                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-ink-100 pt-4">
                  <Button size="sm" variant="outline" onClick={() => openEdit(diag)}>
                    <Pencil className="h-3.5 w-3.5" />
                    Modifier
                  </Button>
                  {diag.status === 'publie' ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => dispatch({ type: 'DIAGNOSTIC_BACK_TO_REVIEW', id: diag.id })}
                    >
                      <Undo2 className="h-3.5 w-3.5" />
                      Repasser en relecture
                    </Button>
                  ) : (
                    <Button size="sm" disabled={!readyToPublish} onClick={() => dispatch({ type: 'DIAGNOSTIC_PUBLISH', id: diag.id })}>
                      <Send className="h-3.5 w-3.5" />
                      {readyToPublish ? 'Partager au dirigeant' : 'Terminer les vérifications pour partager'}
                    </Button>
                  )}
                  {diag.status !== 'publie' ? <span className="flex items-center gap-1.5 text-xs text-ink-500"><Eye className="h-3.5 w-3.5"/>Le dirigeant verra cette synthèse et ses priorités, pas les notes internes.</span> : null}
                </div>
              </CardBody>
            </Card>
          )
        })}
      </div>

      <Alert tone="warning" className="mt-6" title="Règles de publication" icon={<FileCheck2 className="h-4 w-4" />}>
        Anonymisez tout prestataire cité, retirez les données nominatives de salariés ou de patients, et vérifiez que chaque
        priorité est réalisable par l’établissement lui-même.
      </Alert>

      <Modal open={edit.open} onClose={edit.close} title="Modifier le diagnostic" size="lg" description="Les modifications portent sur le contenu publié.">
        {draft ? (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Référence">
                <input
                  className="h-10 w-full rounded-lg border border-ink-200 px-3 text-sm"
                  value={draft.ref}
                  onChange={(e) => setDraft({ ...draft, ref: e.target.value })}
                />
              </Field>
              <Field label="Auteur">
                <input
                  className="h-10 w-full rounded-lg border border-ink-200 px-3 text-sm"
                  value={draft.author}
                  onChange={(e) => setDraft({ ...draft, author: e.target.value })}
                />
              </Field>
            </div>

            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-ink-700">
                <Gauge className="h-3.5 w-3.5" />
                Scores (0 à 100)
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {LEVERS.map((lever) => {
                  const existing = draft.scores.find((s) => s.lever === lever)
                  return (
                    <div key={lever} className="flex items-center gap-3">
                      <span className="w-40 shrink-0 text-xs text-ink-600">{LEVER_LABEL[lever]}</span>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={existing?.score ?? 50}
                        onChange={(e) => {
                          const value = Number(e.target.value)
                          setDraft({
                            ...draft,
                            scores: existing
                              ? draft.scores.map((s) => (s.lever === lever ? { ...s, score: value } : s))
                              : [...draft.scores, { lever, score: value }],
                          })
                        }}
                        className="h-1 flex-1 accent-brand-700"
                      />
                      <span className="w-8 text-right text-xs tabular-nums text-ink-600">
                        {existing?.score ?? 50}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            <ListEditor
              label="Forces"
              items={draft.strengths}
              onChange={(strengths) => setDraft({ ...draft, strengths })}
            />
            <ListEditor
              label="Difficultés prioritaires"
              items={draft.difficulties}
              onChange={(difficulties) => setDraft({ ...draft, difficulties })}
            />
            <ListEditor
              label="Opportunités"
              items={draft.opportunities}
              onChange={(opportunities) => setDraft({ ...draft, opportunities })}
            />
            <ListEditor
              label="3 priorités"
              items={draft.priorities}
              onChange={(priorities) => setDraft({ ...draft, priorities })}
            />

            <Field label="Note de relecture interne" hint="Visible uniquement par l’équipe.">
              <Textarea rows={2} value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} />
            </Field>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={edit.close}>
                Annuler
              </Button>
              <Button onClick={save}>Enregistrer</Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  )
}

function InternalList({
  title,
  items,
  tone,
}: {
  title: string
  items: string[]
  tone: 'success' | 'warning' | 'info' | 'brand'
}) {
  const colors = {
    success: 'text-emerald-700',
    warning: 'text-amber-700',
    info: 'text-sky-700',
    brand: 'text-brand-700',
  }
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">{title}</p>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li key={item} className={`text-sm leading-relaxed ${colors[tone]}`}>
            — {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function DecisionTile({number,label,value,detail,tone}:{number:string;label:string;value:string;detail:string;tone:'warning'|'success'|'brand'}) {
  const accent = tone === 'warning' ? 'border-amber-200 bg-amber-50/70' : tone === 'success' ? 'border-emerald-200 bg-emerald-50/70' : 'border-brand-100 bg-white'
  return <article className={`rounded-xl border p-4 ${accent}`}><span className="text-[.65rem] font-bold tracking-wider text-ink-400">{number} · {label}</span><h4 className="mt-2 text-sm font-bold leading-snug text-ink-950">{value}</h4><p className="mt-1 text-xs leading-relaxed text-ink-600">{detail}</p></article>
}

function ListEditor({
  label,
  items,
  onChange,
}: {
  label: string
  items: string[]
  onChange: (next: string[]) => void
}) {
  return (
    <Field label={label} hint="Une ligne par élément. Videz une ligne pour la supprimer.">
      <Textarea
        rows={4}
        value={items.join('\n')}
        onChange={(e) => onChange(e.target.value.split('\n').filter((l) => l.trim().length > 0))}
      />
    </Field>
  )
}
