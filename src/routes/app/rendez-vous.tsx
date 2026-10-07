import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { CalendarCheck, CalendarPlus, MapPin, Video } from 'lucide-react'
import { useDemo } from '@/store/store'
import { PageHeader } from '@/components/layouts'
import {
  Alert,
  Badge,
  Button,
  Card,
  CardHeader,
  CardBody,
  EmptyState,
  Field,
  Modal,
  Select,
  Tabs,
  Textarea,
  useDisclosure,
} from '@/components/ui'
import { MEETING_STATUS } from '@/lib/status'
import { dateTime, longDate, relative, timeOnly } from '@/lib/format'
import { minutesToHours } from '@/lib/metrics'
import { byId } from '@/lib/utils'
import type { Meeting } from '@/types'

export const Route = createFileRoute('/app/rendez-vous')({
  component: RendezVousPage,
  head: () => ({ meta: [{ title: 'Mes rendez-vous — ALLNEEDS' }] }),
})

const KIND_LABEL: Record<Meeting['kind'], string> = {
  diagnostic: 'Diagnostic',
  cadrage: 'Cadrage',
  pilotage: 'Pilotage',
  bilan: 'Bilan',
  appel: 'Appel',
}

export function RendezVousPage() {
  const { state, dispatch, orgId, user } = useDemo()
  const [filter, setFilter] = useState('a_venir')
  const modal = useDisclosure()
  const [kind, setKind] = useState<Meeting['kind']>('pilotage')
  const [missionId, setMissionId] = useState('')
  const [slot, setSlot] = useState('10:00 – 11:30')
  const [topic, setTopic] = useState('')

  const meetings = state.meetings
    .filter((m) => m.orgId === orgId)
    .filter((m) => {
      if (filter === 'a_venir') return m.status === 'confirme' || m.status === 'propose'
      if (filter === 'passes') return m.status === 'realise'
      return m.status === 'annule'
    })
    .sort((a, b) => (filter === 'passes' ? b.at.localeCompare(a.at) : a.at.localeCompare(b.at)))

  const myMissions = state.missions.filter((m) => m.orgId === orgId)

  function requestMeeting() {
    const [from, to] = slot.split(' – ')
    const day = new Date()
    day.setDate(day.getDate() + 3)
    const start = `${day.toISOString().slice(0, 10)}T${from}:00.000Z`
    const end = new Date(new Date(start).getTime() + (to ? 90 : 60) * 60000).toISOString()

    dispatch({
      type: 'MEETING_CREATE',
      meeting: {
        orgId,
        missionId: missionId || null,
        title: topic.trim() || `${KIND_LABEL[kind]} — ${user.name}`,
        kind,
        at: start,
        durationMin: 90,
        location: kind === 'diagnostic' ? 'Sur site (à confirmer)' : 'Visio (lien envoyé par e-mail)',
        attendees: ['Direction'],
        agenda: [],
        notes: end,
      },
    })
    modal.close()
    setTopic('')
  }

  const nextMeeting = state.meetings
    .filter((m) => m.orgId === orgId && (m.status === 'confirme' || m.status === 'propose'))
    .sort((a, b) => a.at.localeCompare(b.at))[0]

  return (
    <>
      <PageHeader
        eyebrow="Rendez-vous"
        title="Mes rendez-vous"
        description="Diagnostics, cadrages, points de pilotage et bilans. Les créneaux sont confirmés par notre équipe."
        actions={
          <Button size="sm" variant="dark" onClick={modal.openFn}>
            <CalendarPlus className="h-3.5 w-3.5" />
            Demander un créneau
          </Button>
        }
      />

      {nextMeeting ? (
        <Card className="mb-6 border-brand-200 bg-brand-50/60 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">Prochain rendez-vous</p>
              <p className="mt-1 font-display text-2xl text-ink-950">{dateTime(nextMeeting.at)}</p>
              <p className="mt-1 text-sm text-ink-700">
                {nextMeeting.title} · {minutesToHours(nextMeeting.durationMin)} · {nextMeeting.location}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone={MEETING_STATUS[nextMeeting.status].tone}>
                {MEETING_STATUS[nextMeeting.status].label}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => dispatch({ type: 'MEETING_SET_STATUS', id: nextMeeting.id, status: 'realise' })}
              >
                Marquer réalisé
              </Button>
            </div>
          </div>
        </Card>
      ) : null}

      <div className="mb-5">
        <Tabs
          value={filter}
          onChange={setFilter}
          tabs={[
            { value: 'a_venir', label: 'À venir' },
            { value: 'passes', label: 'Passés' },
            { value: 'annules', label: 'Annulés' },
          ]}
        />
      </div>

      {meetings.length === 0 ? (
        <EmptyState
          icon={<CalendarCheck className="h-5 w-5" />}
          title="Aucun rendez-vous dans cette vue"
          description="Le diagnostic STARTER est un premier rendez-vous structuré, puis les points de pilotage suivent le calendrier de la mission."
          action={
            <Link to="/diagnostic">
              <Button size="sm">Réserver un diagnostic</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {meetings.map((m) => {
            const status = MEETING_STATUS[m.status]
            const mission = byId(state.missions, m.missionId)
            return (
              <Card key={m.id}>
                <CardHeader
                  title={m.title}
                  description={`${KIND_LABEL[m.kind]} · ${dateTime(m.at)} · ${minutesToHours(m.durationMin)}`}
                  action={<Badge tone={status.tone}>{status.label}</Badge>}
                />
                <CardBody>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <p className="flex items-center gap-2 text-sm text-ink-600">
                      <MapPin className="h-4 w-4 text-ink-400" />
                      {m.location}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-ink-600">
                      <Video className="h-4 w-4 text-ink-400" />
                      {m.attendees.join(', ')}
                    </p>
                    <p className="text-sm text-ink-600">
                      {filter === 'passes' ? `Réalisé ${relative(m.at, new Date(state.now).getTime())}` : `Dans ${relative(m.at, new Date(state.now).getTime()).replace('il y a ', '')}`}
                    </p>
                  </div>

                  {mission ? (
                    <p className="mt-4 text-xs text-ink-500">
                      Mission liée :{' '}
                      <Link to="/app/missions/$id" params={{ id: mission.id }} className="font-semibold text-brand-700">
                        {mission.code} · {mission.title}
                      </Link>
                    </p>
                  ) : null}

                  {m.agenda.length > 0 ? (
                    <ul className="mt-3 space-y-1">
                      {m.agenda.map((a) => (
                        <li key={a} className="text-xs text-ink-600">
                          — {a}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {m.notes ? (
                    <p className="mt-3 rounded-lg bg-ink-50 px-3 py-2 text-xs italic text-ink-600">
                      {m.notes}
                    </p>
                  ) : null}

                  <div className="mt-4 flex flex-wrap gap-2 border-t border-ink-100 pt-4">
                    {m.status === 'confirme' || m.status === 'propose' ? (
                      <>
                        <Button size="sm" variant="outline">
                          <Video className="h-3.5 w-3.5" />
                          {m.location.startsWith('Visio') ? 'Rejoindre la visio' : 'Voir les coordonnées'}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => dispatch({ type: 'MEETING_SET_STATUS', id: m.id, status: 'annule' })}
                        >
                          Reporter
                        </Button>
                      </>
                    ) : (
                      <p className="text-xs text-ink-400">
                        {m.status === 'realise'
                          ? `Compte rendu disponible — ${longDate(m.at)}`
                          : 'Annulé. Proposez un nouveau créneau si nécessaire.'}
                      </p>
                    )}
                  </div>
                </CardBody>
              </Card>
            )
          })}
        </div>
      )}

      <Alert tone="info" className="mt-6" title="Créneaux et participation">
        Un rendez-vous Includes le compte rendu écrit et les points d’action. Un rendez-vous non annulé 24 h à l’avance
        peut être facturé au titre du périmètre PILOTAGE.
      </Alert>

      <Modal
        open={modal.open}
        onClose={modal.close}
        title="Demander un créneau"
        description="Nous confirmons sous 24 h ouvrées avec un lien de visio ou une proposition sur site."
      >
        <div className="space-y-4">
          <Field label="Type de rendez-vous" required>
            <Select value={kind} onChange={(e) => setKind(e.target.value as Meeting['kind'])}>
              <option value="diagnostic">Diagnostic</option>
              <option value="cadrage">Cadrage</option>
              <option value="pilotage">Point de pilotage</option>
              <option value="bilan">Bilan</option>
            </Select>
          </Field>
          <Field label="Mission concernée" hint="Facultatif.">
            <Select value={missionId} onChange={(e) => setMissionId(e.target.value)}>
              <option value="">Aucune — question générale</option>
              {myMissions.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.code} · {m.title}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Créneau souhaité" required>
            <Select value={slot} onChange={(e) => setSlot(e.target.value)}>
              <option value="10:00 – 11:30">10:00 – 11:30</option>
              <option value="14:00 – 15:30">14:00 – 15:30</option>
              <option value="16:00 – 17:30">16:00 – 17:30</option>
            </Select>
          </Field>
          <Field label="Objet" hint="Une phrase suffit.">
            <Textarea
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex. valider les priorités avant la refonte du site"
            />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={modal.close}>
              Annuler
            </Button>
            <Button variant="dark" onClick={requestMeeting}>
              Envoyer la demande
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
