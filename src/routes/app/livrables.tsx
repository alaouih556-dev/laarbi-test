import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { FileDown, FileText, MessageSquare } from 'lucide-react'
import { useDemo } from '@/store/store'
import { PageHeader } from '@/components/layouts'
import { Badge, Button, Card, CardHeader, CardBody, EmptyState, Tabs, Progress } from '@/components/ui'
import { DELIVERABLE_STATUS } from '@/lib/status'
import { longDate, relative } from '@/lib/format'
import { byId, percentage } from '@/lib/utils'

export const Route = createFileRoute('/app/livrables')({
  component: LivrablesPage,
  head: () => ({ meta: [{ title: 'Mes livrables — ALLNEEDS' }] }),
})

export function LivrablesPage() {
  const { state, dispatch, orgId } = useDemo()
  const [filter, setFilter] = useState('tous')

  const missionIds = state.missions.filter((m) => m.orgId === orgId).map((m) => m.id)
  const deliverables = state.deliverables
    .filter((d) => missionIds.includes(d.missionId))
    .filter((d) => (filter === 'tous' ? true : d.status === filter))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

  const all = state.deliverables.filter((d) => missionIds.includes(d.missionId))
  const validated = all.filter((d) => d.status === 'valide').length

  return (
    <>
      <PageHeader
        eyebrow="Productions"
        title="Mes livrables"
        description="Chaque livrable est versionné. 2 tours de retouches sont inclus ; au-delà, une prestation complémentaire est chiffrée."
        actions={
          <Link to="/app/documents">
            <Button size="sm" variant="outline">
              Voir mon dossier documentaire
            </Button>
          </Link>
        }
      />

      <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <Tabs
          value={filter}
          onChange={setFilter}
          tabs={[
            { value: 'tous', label: 'Tous', count: all.length },
            { value: 'en_attente', label: 'En production', count: all.filter((d) => d.status === 'en_attente').length },
            { value: 'en_relecture', label: 'À valider', count: all.filter((d) => d.status === 'en_relecture').length },
            { value: 'retouche', label: 'En retouche', count: all.filter((d) => d.status === 'retouche').length },
            { value: 'valide', label: 'Validés', count: validated },
          ]}
        />
        <div className="w-full lg:w-56">
          <Progress value={percentage(validated, all.length)} tone="emerald" label="Livrables validés" />
        </div>
      </div>

      {deliverables.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-5 w-5" />}
          title="Aucun livrable dans cette vue"
          description="Les livrables sont définis au cadrage de la mission, puis vous les validez en ligne."
          action={
            <Link to="/app/missions">
              <span className="text-sm font-semibold text-brand-700">Voir mes missions</span>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {deliverables.map((d) => {
            const mission = byId(state.missions, d.missionId)
            const s = DELIVERABLE_STATUS[d.status]
            return (
              <Card key={d.id}>
                <CardHeader
                  title={d.title}
                  description={`${mission ? `${mission.code} · ${mission.title}` : 'Mission'} · ${d.type} · ${d.sizeLabel}`}
                  action={<Badge tone={s.tone}>{s.label}</Badge>}
                />
                <CardBody>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-ink-500">
                      <span>Version {d.version} sur {d.maxVersions}</span>
                      <span>Responsable : {d.owner}</span>
                      <span>Déposé le {longDate(d.updatedAt)}</span>
                      <span>Modifié {relative(d.updatedAt, new Date(state.now).getTime())}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="ghost">
                        <FileDown className="h-3.5 w-3.5" />
                        Télécharger
                      </Button>
                      {d.status === 'en_relecture' ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => dispatch({ type: 'DELIVERABLE_SET_STATUS', id: d.id, status: 'valide' })}
                          >
                            Valider
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => dispatch({ type: 'DELIVERABLE_SET_STATUS', id: d.id, status: 'retouche' })}
                          >
                            Retouche
                          </Button>
                        </>
                      ) : null}
                      {d.status === 'valide' ? (
                        <Link to="/app/messages">
                          <Button size="sm" variant="ghost">
                            <MessageSquare className="h-3.5 w-3.5" />
                            Complément
                          </Button>
                        </Link>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
                    <div
                      className="h-full rounded-full bg-brand-600"
                      style={{ width: `${percentage(d.version, d.maxVersions)}%` }}
                    />
                  </div>
                </CardBody>
              </Card>
            )
          })}
        </div>
      )}
    </>
  )
}
