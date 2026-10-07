import { Link, createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { CalendarClock, Check, CirclePlay, GripVertical, Mail, Phone, Plus, RotateCcw, Trophy } from 'lucide-react'
import { useDemo, type CommercialOpportunity } from '@/store/store'
import { PageHeader } from '@/components/layouts'
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  Field,
  Input,
  Modal,
  Select,
  Stat,
  TableWrap,
  Td,
  Textarea,
  Th,
  Tr,
  useDisclosure,
} from '@/components/ui'
import { LEAD_FLOW, LEAD_STAGE } from '@/lib/status'
import { SECTOR_LABEL } from '@/data/catalog'
import { longDate, money, relative, daysUntil } from '@/lib/format'
import { DEMO_NOW } from '@/data/demo'
import type { Lead, LeadSource, LeadStage, Sector } from '@/types'
import { PROSPECTING_DEMO_LEADS } from '@/data/prospecting-demo'
import { ActivityPulse } from '@/components/ActivityPulse'

export const Route = createFileRoute('/admin/pipeline')({
  component: PipelinePage,
  head: () => ({ meta: [{ title: 'Pipeline — ALLNEEDS' }] }),
})

const SOURCES: Record<LeadSource, string> = {
  site: 'Site',
  recommandation: 'Recommandation',
  abonnement: 'Abonnement',
  'appel entrant': 'Appel entrant',
  evenement: 'Événement',
  linkedin: 'LinkedIn',
}

export function PipelinePage() {
  const { state, dispatch } = useDemo()
  const modal = useDisclosure()
  const now = new Date(state.now).getTime()
  const simulationActive = state.leads.some((lead) => lead.id.startsWith('prospect-demo-'))
  const [assignee, setAssignee] = useState('tous')

  const [form, setForm] = useState({
    orgName: '',
    contactName: '',
    contactRole: '',
    email: '',
    phone: '',
    city: '',
    sector: 'enseignement' as Sector,
    kind: '',
    source: 'site' as LeadSource,
    budget: '',
    notes: '',
  })

  const team = useMemo(() => Array.from(new Set(state.leads.map((l) => l.assignedTo))), [state.leads])
  const filtered = state.leads.filter((l) => (assignee === 'tous' ? true : l.assignedTo === assignee))

  const open = filtered.filter((l) => l.stage !== 'gagne' && l.stage !== 'perdu')
  const won = filtered.filter((l) => l.stage === 'gagne')
  const lost = filtered.filter((l) => l.stage === 'perdu')
  const pipelineValue = open.reduce((acc, l) => acc + (l.budget ?? 0), 0)
  const winRate = filtered.length > 0 ? Math.round((won.length / (won.length + lost.length)) * 100) : 0
  const existingClientOpportunities = state.commercialOpportunities
    .filter((item) => !['acceptee', 'refusee'].includes(item.status))
    .map((item) => ({ ...item, org: state.orgs.find((org) => org.id === item.orgId) }))
  const demoProspects = filtered.filter((lead) => lead.id.startsWith('prospect-demo-'))
  const dueToday = demoProspects.filter((lead) => lead.nextActionAt.slice(0, 10) <= state.now.slice(0, 10) && !['gagne', 'perdu'].includes(lead.stage))
  const completedDemoActions = demoProspects.filter((lead) => lead.notes.includes('Action simulée effectuée :')).length
  const sectorCounts = (['sante', 'enseignement', 'tourisme'] as const).map((sector) => ({ sector, count: demoProspects.filter((lead) => lead.sector === sector).length }))

  function completeProspectingAction(lead: Lead) {
    const tomorrow = new Date(state.now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const done = lead.nextAction
    dispatch({ type: 'LEAD_PATCH', id: lead.id, patch: {
      stage: lead.stage === 'nouveau' ? 'contacte' : lead.stage,
      lastContactAt: state.now,
      nextAction: lead.stage === 'nouveau' ? 'Envoyer le récapitulatif et proposer un échange de cadrage' : lead.stage === 'contacte' ? 'Reprendre contact et vérifier si le sujet reste prioritaire' : lead.stage === 'diagnostic_planifie' ? 'Préparer les éléments de contexte pour le diagnostic' : 'Faire le point sur la proposition et répondre aux questions',
      nextActionAt: tomorrow.toISOString(),
      score: Math.min(100, lead.score + 2),
      notes: `${lead.notes}\nAction simulée effectuée : ${done}.`,
    } })
  }

  function createLead() {
    dispatch({
      type: 'LEAD_CREATE',
      lead: {
        id: `lead-${Math.random().toString(36).slice(2, 8)}`,
        orgName: form.orgName || 'Nouvel établissement',
        contactName: form.contactName || 'Contact à qualifier',
        contactRole: form.contactRole,
        email: form.email,
        phone: form.phone,
        city: form.city,
        sector: form.sector,
        kind: form.kind,
        headcount: '',
        source: form.source,
        stage: 'nouveau',
        budget: form.budget ? Number(form.budget) : null,
        urgency: 'normale',
        assignedTo: 'Nada Bennani',
        createdAt: new Date(now).toISOString(),
        lastContactAt: new Date(now).toISOString(),
        nextAction: 'Premier appel de qualification',
        nextActionAt: new Date(now + 86400000).toISOString(),
        score: 50,
        notes: form.notes,
        convertedOrgId: null,
      },
    })
    modal.close()
    setForm({
      orgName: '',
      contactName: '',
      contactRole: '',
      email: '',
      phone: '',
      city: '',
      sector: 'enseignement',
      kind: '',
      source: 'site',
      budget: '',
      notes: '',
    })
  }

  return (
    <>
      <PageHeader
        eyebrow="Commercial"
        title="Acquisition de nouveaux clients"
        description="Suivez les prospects depuis le premier contact jusqu’à la signature. Les offres complémentaires aux clients existants sont suivies séparément ci-dessous."
        actions={
          <>
            <Select value={assignee} onChange={(e) => setAssignee(e.target.value)} className="w-48">
              <option value="tous">Toute l’équipe</option>
              {team.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
            {simulationActive ? <Button size="sm" variant="outline" onClick={() => dispatch({ type: 'LEADS_DEMO_RESET' })}><RotateCcw className="h-3.5 w-3.5"/>Restaurer le pipeline</Button> : <Button size="sm" variant="outline" onClick={() => dispatch({ type: 'LEADS_DEMO_SET', leads: PROSPECTING_DEMO_LEADS })}><CirclePlay className="h-3.5 w-3.5"/>Lancer la journée · 30 prospects</Button>}
            <Button size="sm" onClick={modal.openFn}>
              <Plus className="h-3.5 w-3.5" />
              Nouveau lead
            </Button>
          </>
        }
      />

      {simulationActive ? <Card className="mb-6 overflow-hidden border-sky-100 bg-gradient-to-br from-white via-sky-50/50 to-white">
        <CardBody className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-brand-700">Journée de prospection · simulation locale</p><h2 className="mt-1 text-xl font-bold text-ink-950">30 établissements. Un suivi à faire vivre.</h2><p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-600">Passez les actions en revue, consignez les contacts et observez le pipeline évoluer. Toutes les entreprises et coordonnées sont fictives.</p></div><div className="flex flex-wrap gap-2"><Badge tone="info">{dueToday.length} actions à faire</Badge><Badge tone="success">{completedDemoActions} actions consignées</Badge></div></div>
          <div className="grid gap-3 sm:grid-cols-3">{sectorCounts.map(({ sector, count }) => <div key={sector} className="flex items-center justify-between rounded-xl border border-ink-100 bg-white px-4 py-3"><span className="text-sm font-semibold text-ink-700">{sector === 'sante' ? 'Santé' : sector === 'enseignement' ? 'Enseignement' : 'Tourisme'}</span><span className="font-display text-2xl font-semibold text-brand-700">{count}<span className="ml-1 text-xs font-medium text-ink-400">prospects</span></span></div>)}</div>
          <div className="grid gap-5 xl:grid-cols-[1fr_.75fr]">
            <section className="rounded-2xl border border-ink-100 bg-white"><header className="flex items-center justify-between border-b border-ink-100 px-4 py-3"><div><p className="text-[0.68rem] font-bold uppercase tracking-wider text-ink-400">À faire maintenant</p><h3 className="mt-0.5 font-semibold text-ink-950">La prochaine action, dossier par dossier</h3></div><span className="text-xs text-ink-500">{dueToday.length} restantes</span></header><div className="divide-y divide-ink-50">{dueToday.slice(0, 6).map((lead) => <article key={lead.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-ink-900">{lead.orgName}<span className="ml-2 text-xs font-normal text-ink-400">{lead.city} · {SECTOR_LABEL[lead.sector]}</span></p><p className="mt-1 text-xs leading-relaxed text-ink-600">{lead.nextAction}</p></div><Button size="sm" variant="outline" onClick={() => completeProspectingAction(lead)}><Check className="h-3.5 w-3.5"/>Action faite</Button></article>)}{!dueToday.length ? <p className="px-4 py-5 text-sm text-emerald-800">La file du jour est traitée. Les prochaines relances apparaîtront demain dans la simulation.</p> : null}</div></section>
            <div className="rounded-2xl bg-ink-950 p-5 text-white"><p className="text-xs font-bold uppercase tracking-[.15em] text-sky-300">Ce qui progresse</p><div className="mt-4 space-y-3">{(['nouveau','contacte','diagnostic_planifie','proposition','gagne','perdu'] as const).map((stage) => { const count = demoProspects.filter((lead) => lead.stage === stage).length; return <div key={stage} className="flex items-center justify-between gap-3"><span className="text-sm text-ink-100">{LEAD_STAGE[stage].label}</span><span className="font-semibold tabular-nums">{count}</span></div> })}</div><p className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-ink-300">Enregistrer une action met à jour la prochaine étape, le score et l’historique du prospect. Les changements alimentent aussi le fil d’activité partagé.</p></div>
          </div>
        </CardBody>
      </Card> : null}
      {simulationActive ? <div className="mb-6"><ActivityPulse activities={state.activities} title="La trace des actions de la journée" href="/admin/relances" /></div> : null}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Opportunités" value={open.length} hint={`${money(pipelineValue)} de budget annoncé`} tone="brand" />
        <Stat label="Gagnés" value={won.length} hint={money(won.reduce((a, l) => a + (l.budget ?? 0), 0))} tone="success" />
        <Stat label="Perdus" value={lost.length} hint="Budgets reportés ou non actés" tone="warning" />
        <Stat label="Taux de réussite" value={`${winRate} %`} hint="Gagnés sur leads clos" tone="info" />
      </div>

      <section className="mb-6">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-700">Prospection</p>
            <h2 className="mt-1 text-lg font-bold text-ink-950">La prochaine action pour faire avancer chaque prospect</h2>
          </div>
          <p className="text-xs text-ink-500">Les colonnes suivent le contact jusqu’à la vente.</p>
        </div>
        <div className="overflow-x-auto pb-2">
          <div className="grid min-w-[1190px] grid-cols-5 gap-4">
            {LEAD_FLOW.map((stage) => {
          const items = filtered.filter((l) => l.stage === stage)
          const value = items.reduce((acc, l) => acc + (l.budget ?? 0), 0)
          return (
            <div key={stage} className="rounded-2xl border border-ink-100 bg-white p-3">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-ink-900">{LEAD_STAGE[stage].label}</p>
                  <p className="text-[0.65rem] text-ink-400">{items.length} lead(s)</p>
                </div>
                <Badge tone={LEAD_STAGE[stage].tone}>{money(value)}</Badge>
              </div>
              <div className="space-y-2">
                {items.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} now={now} />
                ))}
                {items.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-ink-200 px-3 py-4 text-center text-xs text-ink-400">
                    Vide
                  </p>
                ) : null}
              </div>
            </div>
          )
            })}
          </div>
        </div>
      </section>

      <Card className="mb-6 overflow-hidden">
        <CardBody className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-700">Développement du portefeuille</p>
              <h2 className="mt-1 text-lg font-semibold text-ink-950">Offres complémentaires chez les clients</h2>
              <p className="mt-1 text-sm text-ink-600">Pistes PRO ou PERFORMANCE ouvertes par le concierge après un diagnostic publié. Elles ne comptent pas comme de nouveaux prospects.</p>
            </div>
            <Badge tone="info">{existingClientOpportunities.length} pistes actives</Badge>
          </div>
          {existingClientOpportunities.length ? <div className="divide-y divide-ink-100 rounded-xl border border-ink-100">{existingClientOpportunities.map((item) => <ExistingClientOpportunity key={item.id} item={item} />)}</div> : <p className="rounded-xl bg-ink-50 p-4 text-sm text-ink-600">Aucune piste complémentaire active. Le concierge en ouvre une seulement après avoir validé un besoin avec le client.</p>}
        </CardBody>
      </Card>

      <Card>
        <CardBody className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-ink-950">Leads perdus</p>
              <p className="text-xs text-ink-500">Un lead perdu reste documenté : la raison compte plus que la perte.</p>
            </div>
            <Badge tone="danger">{lost.length}</Badge>
          </div>
          <TableWrap>
            <thead>
              <tr>
                <Th>Établissement</Th>
                <Th>Motif</Th>
                <Th>Budget</Th>
                <Th>Dernier contact</Th>
                <Th>Suivant</Th>
              </tr>
            </thead>
            <tbody>
              {lost.map((lead) => (
                <Tr key={lead.id}>
                  <Td>
                    <span className="font-semibold text-ink-950">{lead.orgName}</span>
                    <span className="block text-xs text-ink-500">{lead.kind}</span>
                  </Td>
                  <Td>{lead.notes}</Td>
                  <Td>{lead.budget ? money(lead.budget) : '—'}</Td>
                  <Td>{longDate(lead.lastContactAt)}</Td>
                  <Td>{lead.nextAction}</Td>
                </Tr>
              ))}
            </tbody>
          </TableWrap>
        </CardBody>
      </Card>

      <Modal
        open={modal.open}
        onClose={modal.close}
        title="Nouveau lead"
        description="Il apparaît immédiatement dans la première colonne du pipeline."
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Établissement" required>
              <Input value={form.orgName} onChange={(e) => setForm({ ...form, orgName: e.target.value })} placeholder="École Les Oliviers" />
            </Field>
            <Field label="Type">
              <Input value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })} placeholder="École privée" />
            </Field>
            <Field label="Contact" required>
              <Input value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
            </Field>
            <Field label="Fonction">
              <Input value={form.contactRole} onChange={(e) => setForm({ ...form, contactRole: e.target.value })} placeholder="Directrice" />
            </Field>
            <Field label="E-mail">
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
            <Field label="Téléphone">
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </Field>
            <Field label="Ville">
              <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </Field>
            <Field label="Secteur">
              <Select value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value as Sector })}>
                <option value="enseignement">Enseignement</option>
                <option value="sante">Santé</option>
                <option value="tourisme">Tourisme</option>
              </Select>
            </Field>
            <Field label="Source">
              <Select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value as LeadSource })}>
                {Object.entries(SOURCES).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Budget annoncé (DH)">
              <Input
                type="number"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                placeholder="15000"
              />
            </Field>
          </div>
          <Field label="Notes de qualification">
            <Textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={modal.close}>
              Annuler
            </Button>
            <Button onClick={createLead}>Créer le lead</Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

function LeadCard({ lead, now }: { lead: Lead; now: number }) {
  const { dispatch } = useDemo()
  const nextIndex = LEAD_FLOW.indexOf(lead.stage)
  const nextStage = LEAD_FLOW[Math.min(nextIndex + 1, LEAD_FLOW.length - 1)]
  const late = daysUntil(lead.nextActionAt, now) < 0 && lead.stage !== 'gagne'

  return (
    <div className={`rounded-xl border p-3 ${late ? 'border-red-200 bg-red-50/40' : 'border-ink-100'}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold leading-snug text-ink-950">{lead.orgName}</p>
        <GripVertical className="h-3.5 w-3.5 shrink-0 text-ink-300" />
      </div>
      <p className="mt-0.5 text-xs text-ink-500">
        {lead.contactName} · {SECTOR_LABEL[lead.sector]} · {lead.city}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <Badge tone={lead.urgency === 'haute' ? 'danger' : 'neutral'}>{SOURCES[lead.source]}</Badge>
        {lead.budget ? <Badge tone="brand">{money(lead.budget)}</Badge> : null}
        <Badge tone={lead.score >= 75 ? 'success' : lead.score >= 55 ? 'info' : 'neutral'}>{lead.score}</Badge>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-ink-600">{lead.nextAction}</p>
      <p className={`mt-1 flex items-center gap-1 text-[0.68rem] ${late ? 'font-semibold text-red-600' : 'text-ink-400'}`}>
        <CalendarClock className="h-3 w-3" />
        {late ? `En retard de ${Math.abs(daysUntil(lead.nextActionAt, now))} j` : relative(lead.nextActionAt, now)}
      </p>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-ink-100 pt-2">
        <div className="flex shrink-0 gap-1 text-ink-400">
          <a href={`mailto:${lead.email}`} title="E-mail" className="rounded p-1 hover:bg-ink-50 hover:text-ink-800">
            <Mail className="h-3.5 w-3.5" />
          </a>
          <a href={`tel:${lead.phone}`} title="Téléphone" className="rounded p-1 hover:bg-ink-50 hover:text-ink-800">
            <Phone className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-end gap-1">
          <Select
            value={lead.stage}
            onChange={(e) => dispatch({ type: 'LEAD_SET_STAGE', id: lead.id, stage: e.target.value as LeadStage })}
            className="h-7 min-w-0 w-28 text-xs"
          >
            {Object.entries(LEAD_STAGE).map(([value, meta]) => (
              <option key={value} value={value}>
                {meta.label}
              </option>
            ))}
          </Select>
          {nextStage !== lead.stage ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => dispatch({ type: 'LEAD_SET_STAGE', id: lead.id, stage: nextStage })}
              title={`Passer à ${LEAD_STAGE[nextStage].label}`}
            >
              <Trophy className="h-3.5 w-3.5" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function ExistingClientOpportunity({ item }: { item: CommercialOpportunity & { org?: { name: string; city: string } } }) {
  const { dispatch } = useDemo()
  const labels: Record<CommercialOpportunity['status'], string> = { a_qualifier: 'À qualifier', a_preparer: 'À préparer', proposee: 'Présentée', interessee: 'Intérêt confirmé', acceptee: 'Acceptée', refusee: 'Sans suite' }
  return <article className="flex flex-wrap items-center justify-between gap-4 p-4">
    <div className="min-w-0">
      <p className="font-semibold text-ink-950">{item.org?.name ?? 'Client'}</p>
      <p className="mt-0.5 text-sm text-ink-600">{item.offerName} · {item.org?.city ?? 'Ville non renseignée'}</p>
      <p className="mt-1 text-xs text-ink-500">Signal du diagnostic : {item.signal} · ouverte le {longDate(item.createdAt)}</p>
    </div>
    <div className="flex items-center gap-2"><Badge tone={item.status === 'interessee' ? 'success' : 'brand'}>{labels[item.status]}</Badge><Select aria-label={`Étape de la piste ${item.offerName} · ${item.org?.name ?? 'client'}`} value={item.status} onChange={(event) => dispatch({ type: 'COMMERCIAL_OPPORTUNITY_STATUS_SET', id: item.id, status: event.target.value as CommercialOpportunity['status'] })} className="w-48"><option value="a_qualifier">À qualifier avec le client</option><option value="a_preparer">Proposition à préparer</option><option value="proposee">Proposition présentée</option><option value="interessee">Intérêt confirmé</option><option value="acceptee">Acceptée</option><option value="refusee">Sans suite</option></Select></div>
  </article>
}
