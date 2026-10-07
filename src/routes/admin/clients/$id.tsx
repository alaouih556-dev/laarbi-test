import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowLeft, Building2, Mail, Phone, UserCheck } from 'lucide-react'
import { useDemo } from '@/store/store'
import { PageHeader } from '@/components/layouts'
import {
  Alert,
  Badge,
  Button,
  Card,
  CardHeader,
  CardBody,
  Divider,
  KeyValue,
  Meter,
  Progress,
  Stat,
} from '@/components/ui'
import { DELIVERABLE_STATUS, LEAD_STAGE, MISSION_STATUS, NEED_STATUS } from '@/lib/status'
import { SECTOR_LABEL } from '@/data/catalog'
import { dateTime, longDate, money, relative } from '@/lib/format'
import { byId, percentage } from '@/lib/utils'
import { DEMO_NOW } from '@/data/demo'

export const Route = createFileRoute('/admin/clients/$id')({
  component: AdminClientDetail,
  head: ({ params }) => ({ meta: [{ title: `Client ${params.id ?? ''} — ALLNEEDS` }] }),
})

export function AdminClientDetail() {
  const { id } = Route.useParams()
  const { state, dispatch } = useDemo()
  const now = new Date(DEMO_NOW).getTime()

  const org = byId(state.orgs, id)
  if (!org) throw notFound()

  const needs = state.needs.filter((n) => n.orgId === org.id)
  const missions = state.missions.filter((m) => m.orgId === org.id)
  const documents = state.documents.filter((d) => d.orgId === org.id)
  const diagnostics = state.diagnostics.filter((d) => d.orgId === org.id)
  const meetings = state.meetings.filter((m) => m.orgId === org.id)
  const lead = state.leads.find((l) => l.convertedOrgId === org.id)
  const deliverables = state.deliverables.filter((d) => missions.some((m) => m.id === d.missionId))
  const missionValue = missions.reduce((acc, m) => acc + m.price, 0)

  return (
    <>
      <Link
        to="/admin/clients"
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500 hover:text-ink-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Tous les clients
      </Link>

      <PageHeader
        eyebrow={`${SECTOR_LABEL[org.sector]} · ${org.city}`}
        title={org.name}
        description={`${org.kind} · ${org.size} · client depuis le ${longDate(org.createdAt)}`}
        actions={
          org.onboardedAt ? (
            <Badge tone="success" className="px-3 py-1">
              <UserCheck className="h-3 w-3" />
              Onboardé le {longDate(org.onboardedAt)}
            </Badge>
          ) : (
            <Button
              size="sm"
              onClick={() =>
                dispatch({ type: 'TOAST_ADD', toast: { title: 'Onboarding marqué comme terminé', description: org.name, tone: 'success' } })
              }
            >
              Marquer l’onboarding terminé
            </Button>
          )
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Besoins" value={needs.length} hint={`${needs.filter((n) => !['signe', 'clos'].includes(n.status)).length} actifs`} tone="brand" />
        <Stat label="Missions" value={missions.length} hint={`${money(missionValue)} HT`} tone="violet" />
        <Stat
          label="Livrables"
          value={`${deliverables.filter((d) => d.status === 'valide').length}/${deliverables.length}`}
          hint="validés"
          tone="success"
        />
        <Stat
          label="Documents manquants"
          value={documents.filter((d) => d.status === 'demande').length}
          hint="à réclamer"
          tone={documents.some((d) => d.status === 'demande') ? 'warning' : 'success'}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Besoins"
              description="Le suivi réel, pas un résumé commercial."
              action={
                <Link to="/admin/besoins" className="text-xs font-semibold text-brand-700">
                  Traiter
                </Link>
              }
            />
            <div className="divide-y divide-ink-50">
              {needs.map((need) => {
                const status = NEED_STATUS[need.status]
                return (
                  <div key={need.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink-950">{need.title}</p>
                      <p className="mt-0.5 text-xs text-ink-500">
                        {need.categoryLabel} · reçu {relative(need.submittedAt, now)} · {need.candidateIds.length}{' '}
                        prestataire(s) · {need.quoteIds.length} devis
                      </p>
                    </div>
                    <Badge tone={status.tone}>{status.label}</Badge>
                  </div>
                )
              })}
            </div>
          </Card>

          <Card>
            <CardHeader title="Missions" description="Livrables et jalons ouverts." />
            <div className="divide-y divide-ink-50">
              {missions.map((mission) => (
                <div key={mission.id} className="px-5 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-ink-950">
                        {mission.code} · {mission.ref}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-500">
                        {mission.title} · {mission.owner} · {money(mission.price)} HT
                      </p>
                    </div>
                    <Badge tone={MISSION_STATUS[mission.status].tone}>
                      {MISSION_STATUS[mission.status].label}
                    </Badge>
                  </div>
                  <Progress className="mt-3" value={mission.onboardingProgress} label="Avancement" />
                  <ul className="mt-3 space-y-1">
                    {mission.milestones.map((ms) => (
                      <li key={ms.id} className="flex items-center justify-between text-xs">
                        <span className={ms.status === 'fait' ? 'text-ink-400 line-through' : 'text-ink-700'}>
                          {ms.title}
                        </span>
                        <span className="text-ink-400">{longDate(ms.dueAt)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Diagnostics" description="Brouillons, en relecture et publiés." />
            <div className="divide-y divide-ink-50">
              {diagnostics.length === 0 ? (
                <CardBody>
                  <p className="text-sm text-ink-500">Aucun diagnostic enregistré pour cet établissement.</p>
                </CardBody>
              ) : null}
              {diagnostics.map((diag) => {
                const average = Math.round(diag.scores.reduce((a, s) => a + s.score, 0) / diag.scores.length)
                return (
                  <div key={diag.id} className="px-5 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-ink-950">{diag.ref}</p>
                      <div className="flex items-center gap-2">
                        <Badge tone={diag.status === 'publie' ? 'success' : 'warning'}>
                          {diag.status === 'publie' ? 'Publié' : 'En relecture'}
                        </Badge>
                        <Badge tone="neutral">Score {average}</Badge>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-ink-500">
                      {diag.author} · réalisé le {longDate(diag.createdAt)}
                      {diag.publishedAt ? ` · publié le ${longDate(diag.publishedAt)}` : ''}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-4">
                      {diag.scores.map((s) => (
                        <div key={s.lever} className="flex items-center gap-2">
                          <span className="text-xs text-ink-500">{s.lever}</span>
                          <Meter value={s.score} />
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader title="Fiche client" />
            <CardBody className="space-y-2">
              <KeyValue label="Contact">
                {org.contactName}
                <span className="block text-xs text-ink-500">{org.contactRole}</span>
              </KeyValue>
              <Divider />
              <a href={`mailto:${org.contactEmail}`} className="flex items-center gap-2 text-sm text-ink-700 hover:text-brand-700">
                <Mail className="h-3.5 w-3.5" />
                {org.contactEmail}
              </a>
              <a href={`tel:${org.contactPhone}`} className="flex items-center gap-2 text-sm text-ink-700 hover:text-brand-700">
                <Phone className="h-3.5 w-3.5" />
                {org.contactPhone}
              </a>
              <Divider />
              <div className="flex flex-wrap gap-1.5">
                {org.tags.map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>
            </CardBody>
          </Card>

          {lead ? (
            <Card>
              <CardHeader title="Fiche commerciale" />
              <CardBody className="space-y-2">
                <KeyValue label="Étape">
                  <Badge tone={LEAD_STAGE[lead.stage].tone}>{LEAD_STAGE[lead.stage].label}</Badge>
                </KeyValue>
                <KeyValue label="Budget annoncé">{lead.budget ? money(lead.budget) : '—'}</KeyValue>
                <KeyValue label="Score">{lead.score}/100</KeyValue>
                <KeyValue label="Suivant">{lead.nextAction}</KeyValue>
                <p className="pt-2 text-xs leading-relaxed text-ink-500">{lead.notes}</p>
                <Link to="/admin/pipeline" className="mt-2 block text-xs font-semibold text-brand-700">
                  Ouvrir dans le pipeline
                </Link>
              </CardBody>
            </Card>
          ) : null}

          <Card>
            <CardHeader title="Notes internes" />
            <CardBody>
              <p className="text-sm leading-relaxed text-ink-600">{org.notes || 'Aucune note.'}</p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Derniers rendez-vous" />
            <div className="divide-y divide-ink-50">
              {meetings.length === 0 ? (
                <CardBody>
                  <p className="text-sm text-ink-500">Aucun rendez-vous.</p>
                </CardBody>
              ) : null}
              {meetings
                .sort((a, b) => b.at.localeCompare(a.at))
                .slice(0, 4)
                .map((m) => (
                  <div key={m.id} className="px-5 py-3">
                    <p className="text-sm font-semibold text-ink-900">{m.title}</p>
                    <p className="mt-0.5 text-xs text-ink-500">
                      {dateTime(m.at)} · {m.status}
                    </p>
                  </div>
                ))}
            </div>
          </Card>

          <Alert tone="info" title="Espace client">
            Les modifications faites ici (besoins, devis, livrables, diagnostics) apparaissent immédiatement dans l’espace
            client de {org.name}.
          </Alert>
        </aside>
      </div>
    </>
  )
}
