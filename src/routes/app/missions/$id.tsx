import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, Check, CircleAlert, FileDown, Flag, MessageSquare, Plus, Sparkles, Trophy, X } from 'lucide-react'
import { useState } from 'react'
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
  Modal,
  Progress,
  Select,
  Textarea,
  useDisclosure,
} from '@/components/ui'
import { DELIVERABLE_STATUS, LEVER_LABEL, MEETING_STATUS, MILESTONE_STATUS, MISSION_STATUS } from '@/lib/status'
import { dateTime, longDate, relative, timeOnly } from '@/lib/format'
import { byId, percentage } from '@/lib/utils'
import type { Meeting } from '@/types'

export const Route = createFileRoute('/app/missions/$id')({
  component: MissionDetail,
  head: ({ params }) => ({ meta: [{ title: `Mission ${params.id ?? ''} — ALLNEEDS` }] }),
})

export function MissionDetail() {
  const { id } = Route.useParams()
  const { state, dispatch, orgId, user } = useDemo()
  const meetingModal = useDisclosure()
  const [slot, setSlot] = useState('10:00 – 11:30')
  const [agenda, setAgenda] = useState('')

  const mission = byId(state.missions.filter((m) => m.orgId === orgId), id)

  if (!mission) {
    return (
      <>
        <PageHeader eyebrow="Missions" title="Mission introuvable" />
        <Alert tone="warning" title="Cette mission n’existe pas ou n’est pas rattachée à votre établissement.">
          <Link to="/app/missions" className="font-semibold underline">
            Retour à mes missions
          </Link>
        </Alert>
      </>
    )
  }

  const status = MISSION_STATUS[mission.status]
  const deliverables = state.deliverables.filter((d) => d.missionId === mission.id)
  const validated = deliverables.filter((d) => d.status === 'valide').length
  const meetings = state.meetings
    .filter((m) => m.missionId === mission.id)
    .sort((a, b) => a.at.localeCompare(b.at))
  const completedMilestones = mission.milestones.filter((item) => item.status === 'fait').length
  const blockedIndex = mission.milestones.findIndex((item) => item.status === 'bloque')
  const inProgressIndex = mission.milestones.findIndex((item) => item.status === 'en_cours')
  const upcomingIndex = mission.milestones.findIndex((item) => item.status === 'a_venir')
  const activeMilestoneIndex = blockedIndex >= 0 ? blockedIndex : inProgressIndex >= 0 ? inProgressIndex : upcomingIndex
  const nextMilestone = activeMilestoneIndex >= 0 ? mission.milestones[activeMilestoneIndex] : undefined
  const milestonePercent = percentage(completedMilestones, mission.milestones.length)

  const selectedMission = mission

  function proposeMeeting() {
    const payload: Omit<Meeting, 'id' | 'status'> = {
      orgId: selectedMission.orgId,
      missionId: selectedMission.id,
      title: `Point d'avancement — ${selectedMission.title}`,
      kind: 'pilotage',
      at: `${new Date().toISOString().slice(0, 10)}T${
        slot.startsWith('10') ? '10:00' : slot.startsWith('14') ? '14:00' : '16:00'
      }:00.000Z`,
      durationMin: 90,
      location: 'Visio (lien envoyé par e-mail)',
      attendees: ['Direction', selectedMission.owner],
      agenda: agenda.trim() ? [agenda.trim()] : ['Revue des livrables', 'Arbitrages ouverts'],
      notes: '',
    }
    dispatch({ type: 'MEETING_CREATE', meeting: payload })
    meetingModal.close()
    setAgenda('')
  }

  return (
    <>
      <Link
        to="/app/missions"
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500 hover:text-ink-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Toutes mes missions
      </Link>

      <section className="mission-adventure-hero">
        <div className="mission-adventure-top"><span className="mission-adventure-kicker"><Flag size={14}/> {mission.code} · PARCOURS ALLNEEDS</span><Badge tone={status.tone}>{status.label}</Badge></div>
        <h1>{mission.title}</h1>
        <p className="mission-adventure-subtitle">{mission.ref} · Démarrée le {longDate(mission.startedAt)} · Livraison cible {longDate(mission.targetEnd)}</p>
        <div className="mission-adventure-progress">
          <div className="mission-progress-copy"><div><span>Avancement de votre mission</span><strong>{mission.onboardingProgress}%</strong></div><small>{completedMilestones} jalon{completedMilestones===1?'':'s'} franchi{completedMilestones===1?'':'s'} sur {mission.milestones.length}</small></div>
          <div className="mission-adventure-track" role="progressbar" aria-label="Avancement déclaré de la mission" aria-valuemin={0} aria-valuemax={100} aria-valuenow={mission.onboardingProgress}><span style={{width:`${mission.onboardingProgress}%`}}/></div>
          {nextMilestone ? <div className="mission-next-quest"><span className={nextMilestone.status==='bloque'?'mission-quest-icon blocked':'mission-quest-icon'}>{nextMilestone.status==='bloque'?<CircleAlert size={17}/>:<Sparkles size={17}/>}</span><div><small>{nextMilestone.status==='bloque'?'À DÉBLOQUER':`ÉTAPE ${activeMilestoneIndex+1} SUR ${mission.milestones.length}`}</small><strong>{nextMilestone.title}</strong><span>Échéance {longDate(nextMilestone.dueAt)}</span></div><Trophy className="mission-next-trophy" size={23}/></div>:null}
        </div>
        <div className="mission-adventure-actions"><Link to="/app/messages"><Button size="sm" variant="outline"><MessageSquare className="h-3.5 w-3.5"/>Messagerie</Button></Link><Button size="sm" variant="dark" onClick={meetingModal.openFn}><Plus className="h-3.5 w-3.5"/>Proposer un créneau</Button></div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Votre parcours"
              description="Chaque étape franchie rapproche votre établissement du résultat attendu."
              action={<span className="mission-journey-count">{completedMilestones}/{mission.milestones.length}</span>}
            />
            <div className="mission-quest-board">
              {mission.milestones.map((ms, index) => {
                const tone = MILESTONE_STATUS[ms.status]
                const isCurrent = index === activeMilestoneIndex && ms.status !== 'fait'
                return (
                  <div key={ms.id} className={`mission-quest-row ${ms.status==='fait'?'completed':''} ${isCurrent?'current':''} ${ms.status==='bloque'?'blocked':''}`}>
                    <div className="mission-quest-marker"><span>{ms.status==='fait'?<Check size={17}/>:ms.status==='bloque'?<X size={16}/>:String(index+1).padStart(2,'0')}</span>{index<mission.milestones.length-1?<i/>:null}</div>
                    <div className="mission-quest-content"><div className="mission-quest-heading"><div><small>{ms.status==='fait'?'ÉTAPE FRANCHIE':isCurrent?'PROCHAINE ÉTAPE':`ÉTAPE ${String(index+1).padStart(2,'0')}`}</small><p>{ms.title}</p></div><Badge tone={tone.tone}>{tone.label}</Badge></div><div className="mission-quest-meta"><span><Flag size={13}/> Échéance {longDate(ms.dueAt)}</span>{ms.status==='a_venir'||ms.status==='en_cours'?<span>{relative(ms.dueAt,new Date(state.now).getTime())}</span>:null}</div></div>
                  </div>
                )
              })}
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Livrables"
              description={`${validated}/${deliverables.length} validés · 2 tours de retouches inclus par livrable`}
              action={
                <Progress
                  value={percentage(validated, deliverables.length)}
                  tone="emerald"
                  className="w-32"
                />
              }
            />
            <div className="divide-y divide-ink-50">
              {deliverables.length === 0 ? (
                <CardBody>
                  <p className="text-sm text-ink-500">Les livrables sont définis au cadrage et apparaissent ici.</p>
                </CardBody>
              ) : null}
              {deliverables.map((d) => {
                const s = DELIVERABLE_STATUS[d.status]
                return (
                  <div key={d.id} className="px-5 py-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-ink-950">{d.title}</p>
                        <p className="mt-0.5 text-xs text-ink-500">
                          {d.type} · v{d.version}/{d.maxVersions} · {d.sizeLabel} · mis à jour {relative(d.updatedAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge tone={s.tone}>{s.label}</Badge>
                        <Button size="sm" variant="ghost">
                          <FileDown className="h-3.5 w-3.5" />
                          Ouvrir
                        </Button>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-ink-500">Responsable : {d.owner}</p>

                    {d.status === 'valide' ? null : (
                      <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg bg-ink-50 px-3 py-2">
                        <p className="mr-auto text-xs text-ink-600">
                          {d.status === 'en_attente'
                            ? 'Livrable en cours de production.'
                            : d.status === 'en_relecture'
                              ? 'En relecture — retour attendu sous 48 h ouvrées.'
                              : 'Une retouche est demandée sur votre retour.'}
                        </p>
                        {d.status === 'en_relecture' ? (
                          <Button
                            size="sm"
                            onClick={() => dispatch({ type: 'DELIVERABLE_SET_STATUS', id: d.id, status: 'valide' })}
                          >
                            Valider
                          </Button>
                        ) : null}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => dispatch({ type: 'DELIVERABLE_SET_STATUS', id: d.id, status: 'retouche' })}
                        >
                          Demander une retouche
                        </Button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>

          <Card>
            <CardHeader title="Périmètre contractuel" description="Ce qui est inclus, et ce qui ne l’est pas." />
            <CardBody className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Inclus</p>
                <ul className="mt-3 space-y-1.5">
                  {mission.scope.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-sm text-ink-700">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">Non inclus</p>
                <ul className="mt-3 space-y-1.5">
                  {mission.outOfScope.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-sm text-ink-500">
                      <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-300" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </CardBody>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader title="Repères" />
            <CardBody className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-500">Votre interlocuteur</span>
                <span className="font-medium text-ink-900">{mission.owner}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-500">Montant de la mission</span>
                <span className="text-sm text-ink-500">Périmètre convenu</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-500">Avancement déclaré</span>
                <span className="font-medium text-ink-900">{mission.onboardingProgress} %</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {mission.levers.map((l) => (
                  <Badge key={l} tone="neutral">
                    {LEVER_LABEL[l] ?? l}
                  </Badge>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Rendez-vous" description="Cadrage, pilotage, accompagnement, bilan." />
            <div className="divide-y divide-ink-50">
              {meetings.length === 0 ? (
                <CardBody>
                  <p className="text-sm text-ink-500">Aucun rendez-vous planifié pour cette mission.</p>
                </CardBody>
              ) : null}
              {meetings.map((m) => {
                const ms = MEETING_STATUS[m.status]
                return (
                  <div key={m.id} className="px-5 py-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-ink-900">{m.title}</p>
                      <Badge tone={ms.tone}>{ms.label}</Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-ink-500">
                      {dateTime(m.at)} · {m.durationMin} min · {m.location}
                    </p>
                    {m.agenda.length > 0 ? (
                      <ul className="mt-2 space-y-1">
                        {m.agenda.map((a) => (
                          <li key={a} className="text-xs text-ink-600">
                            — {a}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {m.notes ? <p className="mt-2 text-xs italic text-ink-500">{m.notes}</p> : null}
                    <div className="mt-2 flex gap-2">
                      {m.status === 'confirme' || m.status === 'propose' ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => dispatch({ type: 'MEETING_SET_STATUS', id: m.id, status: 'realise' })}
                          >
                            Marquer réalisé
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => dispatch({ type: 'MEETING_SET_STATUS', id: m.id, status: 'annule' })}
                          >
                            Annuler
                          </Button>
                        </>
                      ) : (
                        <span className="text-xs text-ink-400">Terminé {relative(m.at, new Date(state.now).getTime())}</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          <Alert tone="warning" title="Hors périmètre" icon={<CircleAlert className="h-4 w-4" />}>
            Toute demande hors périmètre écrit est chiffrée et validée avant exécution. Aucun travail supplémentaire
            n’est engagé sans accord.
          </Alert>

          <Card className="p-4">
            <p className="text-xs text-ink-500">
              Abonnement actif · échéance {longDate(state.subscription.renewsAt)}
            </p>
            <Link to="/app/abonnement" className="mt-1 block text-xs font-semibold text-brand-700">
              Gérer mon abonnement
            </Link>
            <p className="mt-3 text-xs text-ink-400">Dernière connexion : {timeOnly(state.now)} · {user.email}</p>
          </Card>
        </aside>
      </div>

      <Modal
        open={meetingModal.open}
        onClose={meetingModal.close}
        title="Proposer un créneau"
        description="Nous confirmons le créneau et envoyons le lien de visio."
      >
        <div className="space-y-4">
          <Field label="Créneau souhaité" required>
            <Select value={slot} onChange={(e) => setSlot(e.target.value)}>
              <option value="10:00 – 11:30">10:00 – 11:30</option>
              <option value="14:00 – 15:30">14:00 – 15:30</option>
              <option value="16:00 – 17:30">16:00 – 17:30</option>
            </Select>
          </Field>
          <Field label="Ordre du jour" hint="Facultatif. Nous complétons avec l’avancement des livrables.">
            <Textarea
              rows={3}
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              placeholder="Ex. valider la charte éditoriale, arbitrer la refonte du site"
            />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={meetingModal.close}>
              Annuler
            </Button>
            <Button variant="dark" onClick={proposeMeeting}>
              Envoyer la proposition
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
