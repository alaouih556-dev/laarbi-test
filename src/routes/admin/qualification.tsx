import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Inbox, Mail, Phone, UserPlus } from 'lucide-react'
import { useDemo } from '@/store/store'
import { PageHeader } from '@/components/layouts'
import {
  Alert,
  Badge,
  Button,
  Card,
  CardHeader,
  CardBody,
  Select,
  Tabs,
} from '@/components/ui'
import { SECTOR_LABEL } from '@/data/catalog'
import { relative } from '@/lib/format'
import { DEMO_NOW } from '@/data/demo'
import type { Lead } from '@/types'

const KIND_LABEL: Record<string, string> = {
  besoin: 'Besoin',
  mission: 'Mission',
  diagnostic: 'Diagnostic',
  contact: 'Contact',
  newsletter: 'Newsletter',
}

const STATUS: Record<string, { label: string; tone: 'neutral' | 'info' | 'brand' | 'success' }> = {
  nouveau: { label: 'Nouveau', tone: 'brand' },
  contacte: { label: 'Contacté', tone: 'info' },
  planifie: { label: 'Planifié', tone: 'neutral' },
  clos: { label: 'Clos', tone: 'success' },
}

export const Route = createFileRoute('/admin/qualification')({
  component: QualificationPage,
  head: () => ({ meta: [{ title: 'Qualification — ALLNEEDS' }] }),
})

export function QualificationPage() {
  const { state, dispatch } = useDemo()
  const [filter, setFilter] = useState('tous')
  const [assignee, setAssignee] = useState('tous')

  const team = Array.from(new Set([...state.leads.map((l) => l.assignedTo), ...state.requests.map((r) => r.assignedTo)]))

  const requests = state.requests
    .filter((r) => (filter === 'tous' ? true : r.kind === filter))
    .filter((r) => (assignee === 'tous' ? true : r.assignedTo === assignee))
    .sort((a, b) => b.at.localeCompare(a.at))

  const bookings = state.bookings
    .filter((b) => (filter === 'tous' ? true : b.status === 'confirme'))
    .sort((a, b) => a.date.localeCompare(b.date))

  function convertToLead(request: typeof state.requests[number]) {
    const firstAmount = request.budget.match(/\d[\d\s]*/)?.[0]?.replace(/\s/g, '')
    const amount = firstAmount ? Number(firstAmount) || null : null
    const lead: Lead = {
      id: `lead-${Math.random().toString(36).slice(2, 8)}`, orgName: request.org, contactName: request.name,
      contactRole: '', email: request.email, phone: request.phone, city: request.city, sector: request.sector,
      kind: request.kind === 'besoin' ? 'Besoin entrant' : request.kind === 'mission' ? 'Demande de mission' : 'Contact entrant',
      headcount: '', source: 'site', stage: 'nouveau', budget: amount, urgency: 'normale', assignedTo: request.assignedTo === 'Non assigné' ? (team[0] ?? 'À assigner') : request.assignedTo,
      createdAt: request.at, lastContactAt: request.at, nextAction: 'Rappeler pour qualifier la demande',
      nextActionAt: new Date(new Date(DEMO_NOW).getTime() + 86400000).toISOString(), score: 50,
      notes: `${request.message}\nBudget indiqué : ${request.budget}\nCréé depuis la qualification ${request.id}.`, convertedOrgId: null,
    }
    dispatch({ type: 'LEAD_CREATE', lead })
    dispatch({ type: 'REQUEST_SET_STATUS', id: request.id, status: 'clos' })
    dispatch({ type: 'TOAST_ADD', toast: { title: 'Opportunité créée dans le pipeline', description: `${request.org} · première action : ${lead.nextAction}`, tone: 'success' } })
  }

  return (
    <>
      <PageHeader
        eyebrow="Entrée"
        title="Qualification des demandes"
        description="Répondez au contact, attribuez un responsable et décidez de la suite : suivi commercial, besoin à traiter ou diagnostic à confirmer."
      />

      <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <Tabs
          value={filter}
          onChange={setFilter}
          tabs={[
            { value: 'tous', label: 'Toutes', count: state.requests.length },
            { value: 'besoin', label: 'Besoins', count: state.requests.filter((r) => r.kind === 'besoin').length },
            { value: 'mission', label: 'Missions', count: state.requests.filter((r) => r.kind === 'mission').length },
            { value: 'diagnostic', label: 'Diagnostics', count: state.requests.filter((r) => r.kind === 'diagnostic').length },
            { value: 'contact', label: 'Contacts', count: state.requests.filter((r) => r.kind === 'contact').length },
          ]}
        />
        <Select value={assignee} onChange={(e) => setAssignee(e.target.value)} className="lg:w-52">
          <option value="tous">Toute l’équipe</option>
          {team.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(340px,.8fr)]">
        <Card>
          <CardHeader
            title="Demandes entrantes"
            description="Chaque demande doit avoir un responsable et une prochaine action. Répondez depuis votre messagerie ou appelez le contact."
            action={<Badge tone={state.requests.filter((r) => r.status === 'nouveau').length ? 'brand' : 'neutral'}>{state.requests.filter((r) => r.status === 'nouveau').length} nouvelles</Badge>}
          />
          <div className="divide-y divide-ink-100">{requests.map((r) => <article key={r.id} className={`p-5 ${r.status==='nouveau'?'bg-sky-50/30':''}`}>
            <div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><h3 className="text-lg font-bold text-ink-950">{r.org}</h3><Badge tone="neutral">{KIND_LABEL[r.kind]??r.kind}</Badge><Badge tone={STATUS[r.status].tone}>{STATUS[r.status].label}</Badge></div><p className="mt-1 text-sm text-ink-600">{r.name} · {SECTOR_LABEL[r.sector]} · {r.city} · reçue {relative(r.at,new Date(state.now).getTime())}</p></div><div className="min-w-52"><label className="mb-1 block text-[.68rem] font-semibold uppercase tracking-wider text-ink-500">Responsable</label><Select aria-label={`Responsable pour ${r.org}`} value={r.assignedTo} onChange={e=>dispatch({type:'REQUEST_ASSIGN',id:r.id,assignedTo:e.target.value})}><option value="Non assigné">À attribuer</option>{team.filter(t=>t!=='Non assigné').map(t=><option key={t} value={t}>{t}</option>)}</Select></div></div>
            <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(220px,.72fr)]"><div className="min-w-0 rounded-xl border border-ink-100 bg-white p-4"><p className="text-[.68rem] font-bold uppercase tracking-wider text-ink-400">Ce que le contact demande</p><p className="mt-2 whitespace-normal break-words text-sm leading-relaxed text-ink-800">{r.message}</p><div className="mt-3 flex flex-wrap gap-3 text-xs text-ink-600"><span><strong>Budget :</strong> {r.budget||'À qualifier'}</span><span><strong>Source :</strong> Site ALLNEEDS</span></div></div>
            <div className="flex flex-col justify-between gap-3 rounded-xl bg-ink-50 p-4"><div><p className="text-[.68rem] font-bold uppercase tracking-wider text-ink-500">Contact direct</p><p className="mt-2 truncate text-sm font-semibold text-ink-900">{r.name}</p><p className="mt-1 break-all text-xs text-ink-600">{r.email||'E-mail manquant'}</p><p className="mt-1 text-xs text-ink-600">{r.phone||'Téléphone manquant'}</p></div><div className="flex flex-wrap gap-2"><a href={`mailto:${r.email}?subject=${encodeURIComponent(`Suite à votre demande ALLNEEDS — ${r.org}`)}&body=${encodeURIComponent(`Bonjour ${r.name},\n\nNous avons bien reçu votre demande concernant : ${r.message}\n\nJe vous propose un échange afin de préciser votre besoin et la prochaine étape. Quel créneau vous conviendrait ?\n\nBien cordialement,\nALLNEEDS`)}`}><Button size="sm" variant="outline" disabled={!r.email}><Mail size={14}/> Répondre par e-mail</Button></a><a href={`tel:${r.phone.replace(/\s/g,'')}`}><Button size="sm" variant="outline" disabled={!r.phone}><Phone size={14}/> Appeler</Button></a></div></div></div>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-ink-100 pt-3"><p className="max-w-2xl text-xs leading-relaxed text-ink-500">{r.status==='nouveau'?'À faire : répondre, vérifier le besoin et confirmer qui décide.':r.status==='contacte'?'À faire : noter la réponse et fixer la prochaine étape.':r.status==='planifie'?'À faire : préparer et tenir le rendez-vous convenu.':'Demande clôturée.'}</p><div className="flex flex-wrap items-center gap-2"><label className="text-xs text-ink-500">Étape suivante</label><Select aria-label={`Étape de la demande ${r.org}`} value={r.status} onChange={e=>dispatch({type:'REQUEST_SET_STATUS',id:r.id,status:e.target.value as (typeof state.requests)[number]['status']})} className="w-40">{Object.entries(STATUS).map(([value,meta])=><option key={value} value={value}>{meta.label}</option>)}</Select>{!['diagnostic','newsletter'].includes(r.kind)&&r.status!=='clos'?<Button size="sm" onClick={()=>convertToLead(r)}><UserPlus size={14}/>Créer une opportunité<ArrowRight size={14}/></Button>:null}</div></div>
          </article>)}</div>
          {requests.length === 0 ? (
            <CardBody>
              <p className="text-sm text-ink-500">Aucune demande dans cette vue.</p>
            </CardBody>
          ) : null}
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Réservations de diagnostic" description="Le diagnostic STARTER est notre porte d’entrée." />
            <div className="divide-y divide-ink-50">
              {bookings.length === 0 ? (
                <CardBody>
                  <p className="text-sm text-ink-500">Aucune réservation.</p>
                </CardBody>
              ) : null}
              {bookings.map((b) => (
                <div key={b.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-ink-950">{b.org}</p>
                      <p className="mt-0.5 text-xs text-ink-500">
                        {b.name} ({b.role}) · {b.topic}
                      </p>
                    </div>
                    <Badge tone={b.status === 'confirme' ? 'success' : 'warning'}>
                      {b.status === 'confirme' ? 'Confirmé' : 'À confirmer'}
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-ink-600">
                    {b.date} · {b.slot} · {b.format === 'sur_site' ? 'Sur site' : b.format === 'visio' ? 'Visio' : 'Téléphone'} ·{' '}
                    {b.city}
                  </p>
                  {b.status !== 'confirme' ? (
                    <Button
                      className="mt-3"
                      size="sm"
                      onClick={() => dispatch({ type: 'BOOKING_SET_STATUS', id: b.id, status: 'confirme' })}
                    >
                      Confirmer le créneau
                    </Button>
                  ) : null}
                </div>
              ))}
            </div>
          </Card>

          <Alert tone="info" title="Règle de qualification" icon={<Inbox className="h-4 w-4" />}>
            Une demande devient un lead lorsque le besoin est nommé, le budget connu et la décision identifiée. Sinon, elle
            reste une demande à traiter.
          </Alert>

          <Card className="p-5">
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-brand-700" />
              <p className="text-sm font-semibold text-ink-950">Convertir en lead</p>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-ink-500">L’action « Créer une opportunité » ci-dessus ajoute le prospect directement au pipeline avec ses coordonnées, son secteur et sa première relance. Les demandes de diagnostic et les inscriptions newsletter suivent leur propre parcours.</p>
          </Card>
        </div>
      </div>
    </>
  )
}
