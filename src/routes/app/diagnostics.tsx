import { Link, createFileRoute } from '@tanstack/react-router'
import { CalendarCheck, Download, FileText } from 'lucide-react'
import { useDemo } from '@/store/store'
import { PageHeader } from '@/components/layouts'
import { Alert, Badge, Button, Card, CardHeader, CardBody, EmptyState, Meter } from '@/components/ui'
import { LEVER_LABEL } from '@/lib/status'
import { minutesToHours } from '@/lib/metrics'
import { longDate } from '@/lib/format'
import { SECTORS } from '@/data/catalog'
import { ComparisonTable } from '@/components/marketing'
import { hasPublishedDiagnostic } from '@/lib/offer-visibility'

export const Route = createFileRoute('/app/diagnostics')({
  component: DiagnosticsPage,
  head: () => ({ meta: [{ title: 'Mes diagnostics — ALLNEEDS' }] }),
})

export function DiagnosticsPage() {
  const { state, orgId } = useDemo()

  const diagnostics = state.diagnostics
    .filter((d) => d.orgId === orgId && d.status === 'publie')
    .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))

  const sector = state.orgs.find((org) => org.id === orgId)?.sector

  return (
    <>
      <PageHeader
        eyebrow="Diagnostic"
        title="Mes diagnostics publiés"
        description="Publiés par ALLNEEDS après relecture interne. Vous ne voyez que la version validée."
      />

      {diagnostics.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-5 w-5" />}
          title="Aucun diagnostic publié"
          description="Votre diagnostic STARTER apparaîtra ici une fois rédigé, relu et validé par notre équipe."
          action={
            <Link to="/diagnostic">
              <Button size="sm">Réserver un diagnostic</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-6">
          {diagnostics.map((diag) => {
            const average = Math.round(diag.scores.reduce((a, s) => a + s.score, 0) / diag.scores.length)
            return (
              <Card key={diag.id}>
                <CardHeader
                  title={`Diagnostic ${diag.ref}`}
                  description={`Réalisé le ${longDate(diag.createdAt)} · ${minutesToHours(diag.durationMin)} · auteur : ${diag.author}`}
                  action={
                    <div className="flex items-center gap-2">
                      <Badge tone={average < 55 ? 'warning' : 'success'}>Score global {average}/100</Badge>
                      <Button size="sm" variant="outline">
                        <Download className="h-3.5 w-3.5" />
                        PDF
                      </Button>
                    </div>
                  }
                />

                <CardBody>
                  <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Scores par levier</p>
                      <ul className="mt-4 space-y-3">
                        {diag.scores.map((s) => (
                          <li key={s.lever}>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-ink-700">{LEVER_LABEL[s.lever] ?? s.lever}</span>
                              <Meter value={s.score} />
                            </div>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-5 text-xs leading-relaxed text-ink-500">
                        Un score élevé indique un levier déjà maîtrisé ; un score bas, une marge de progression importante.
                        Ces scores sont un indicateur interne, pas une note.
                      </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <DiagnosticBlock title="Forces" items={diag.strengths} tone="success" />
                      <DiagnosticBlock title="Difficultés prioritaires" items={diag.difficulties} tone="warning" />
                      <DiagnosticBlock title="Opportunités" items={diag.opportunities} tone="brand" />
                      <div className="rounded-xl bg-ink-950 p-4 text-white">
                        <p className="text-xs font-semibold uppercase tracking-wider text-sand-300">3 priorités</p>
                        <ul className="mt-3 space-y-2">
                          {diag.priorities.map((p, i) => (
                            <li key={p} className="flex gap-2.5 text-sm text-ink-100">
                              <span className="font-display text-lg leading-none text-sand-300">0{i + 1}</span>
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {diag.notes ? (
                    <p className="mt-6 border-t border-ink-100 pt-4 text-xs italic text-ink-500">{diag.notes}</p>
                  ) : null}

                  <div className="mt-5 flex flex-wrap gap-3 border-t border-ink-100 pt-5">
                    <Link to="/tarifs">
                      <Button size="sm">Structurer avec PRO</Button>
                    </Link>
                    <Link to="/tarifs">
                      <Button size="sm" variant="outline">
                        Aller jusqu’à PERFORMANCE
                      </Button>
                    </Link>
                    <Link to="/diagnostic">
                      <Button size="sm" variant="ghost">
                        <CalendarCheck className="h-3.5 w-3.5" />
                        Refaire un point
                      </Button>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            )
          })}
        </div>
      )}

      {hasPublishedDiagnostic(state.diagnostics, orgId) && sector ? (
        <section className="mt-8 space-y-4">
          <h2 className="font-display text-2xl text-ink-950">Comparatif des formules après votre diagnostic</h2>
          <p className="text-sm text-ink-600">Comparez les contenus et les livrables des formules adaptées à votre secteur.</p>
          <ComparisonTable rows={SECTORS[sector].comparison} />
        </section>
      ) : null}

      <Alert tone="info" className="mt-6" title="Ce que le diagnostic ne fait pas">
        STARTER permet de comprendre. Il ne réalise pas la mission : ni création, ni production, ni accompagnement
        opérationnel, ni recherche de prestataires.
      </Alert>
    </>
  )
}

function DiagnosticBlock({
  title,
  items,
  tone,
}: {
  title: string
  items: string[]
  tone: 'success' | 'warning' | 'brand'
}) {
  const styles = {
    success: 'bg-emerald-50 text-emerald-900',
    warning: 'bg-amber-50 text-amber-900',
    brand: 'bg-brand-50 text-brand-900',
  }
  const dots = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    brand: 'bg-brand-500',
  }
  return (
    <div className={`rounded-xl p-4 ${styles[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-wider opacity-70">{title}</p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-relaxed">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dots[tone]}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
