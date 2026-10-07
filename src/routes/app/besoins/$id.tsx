import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowLeft,
  Check,
  Circle,
  MessageSquare,
  Network,
  Receipt,
  ShieldCheck,
  Star,
} from 'lucide-react'
import { useDemo } from '@/store/store'
import { useOperationalNeeds } from '@/features/operations/useOperationalNeeds'
import { PageHeader } from '@/components/layouts'
import { Alert, Badge, Button, Card, CardHeader, CardBody, Progress } from '@/components/ui'
import { NEED_FLOW, NEED_STATUS, URGENCY } from '@/lib/status'
import { longDate, money, relative } from '@/lib/format'
import { byId } from '@/lib/utils'
import type { Provider, Quote } from '@/types'

export const Route = createFileRoute('/app/besoins/$id')({
  component: BesoinDetail,
  head: ({ params }) => ({ meta: [{ title: `Besoin ${params.id ?? ''} — ALLNEEDS` }] }),
})

export function BesoinDetail() {
  const { id } = Route.useParams()
  const { state, dispatch, orgId } = useDemo()
  const operations = useOperationalNeeds(state.needs.filter((item) => item.orgId === orgId))

  const need = byId(operations.needs.filter((n) => n.orgId === orgId), id)

  if (operations.loading) return <><PageHeader eyebrow="Besoins" title="Chargement du dossier"/><Alert tone="info">Récupération du besoin depuis le serveur…</Alert></>
  if (operations.error) return <><PageHeader eyebrow="Besoins" title="Chargement impossible"/><Alert tone="danger" title="Le dossier n’a pas pu être chargé">{operations.error}</Alert><Link to="/app/besoins" className="mt-4 inline-flex font-semibold underline">Retour à mes besoins</Link></>

  if (!need) {
    return (
      <>
        <PageHeader eyebrow="Besoins" title="Besoin introuvable" />
        <Alert tone="warning" title="Ce besoin n’existe pas ou n’est pas rattaché à votre établissement.">
          <Link to="/app/besoins" className="font-semibold underline">
            Retour à mes besoins
          </Link>
        </Alert>
      </>
    )
  }

  const status = NEED_STATUS[need.status]
  const providers = (operations.live ? [] : need.candidateIds)
    .map((pid) => byId(state.providers, pid))
    .filter((x): x is Provider => x != null)
  const quotes = (operations.live ? [] : need.quoteIds)
    .map((qid) => byId(state.quotes, qid))
    .filter((x): x is Quote => x != null)
  const stepIndex = Math.max(0, NEED_FLOW.indexOf(need.status))

  return (
    <>
      <Link to="/app/besoins" className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-ink-500 hover:text-ink-900">
        <ArrowLeft className="h-3.5 w-3.5" />
        Tous mes besoins
      </Link>

      <PageHeader
        eyebrow={`${need.categoryLabel} · ${relative(need.submittedAt)}`}
        title={need.title}
        description={need.description}
        actions={
          <>
            <Link to="/app/messages">
              <Button size="sm" variant="outline">
                <MessageSquare className="h-3.5 w-3.5" />
                Écrire à l’équipe
              </Button>
            </Link>
            <Badge tone={status.tone} className="px-3 py-1">
              {status.label}
            </Badge>
          </>
        }
      />

      {operations.live ? <Alert tone="info" className="mb-5" title="Demande synchronisée">Cette demande et son historique sont enregistrés sur le serveur. Prestataires, devis et échanges restent à connecter.</Alert> : null}

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          {/* Avancement */}
          <Card>
            <CardHeader title="Avancement" description="Votre besoin suit toujours le même parcours." />
            <CardBody>
              <ol className="space-y-0">
                {NEED_FLOW.map((step, i) => {
                  const done = i < stepIndex
                  const active = i === stepIndex
                  return (
                    <li key={step} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-[0.7rem] font-bold ${
                            done
                              ? 'bg-emerald-500 text-white'
                              : active
                                ? 'bg-brand-700 text-white ring-4 ring-brand-100'
                                : 'bg-ink-100 text-ink-400'
                          }`}
                        >
                          {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                        </span>
                        {i < NEED_FLOW.length - 1 ? (
                          <span className={`w-px flex-1 ${done ? 'bg-emerald-300' : 'bg-ink-200'}`} />
                        ) : null}
                      </div>
                      <div className="pb-6">
                        <p className={`text-sm font-semibold ${active ? 'text-ink-950' : done ? 'text-ink-700' : 'text-ink-400'}`}>
                          {NEED_STATUS[step].label}
                        </p>
                        {active ? <p className="mt-0.5 text-xs text-ink-500">Étape en cours</p> : null}
                      </div>
                    </li>
                  )
                })}
              </ol>
            </CardBody>
          </Card>

          {/* Prestataires proposés */}
          <Card>
            <CardHeader
              title="Prestataires proposés"
              description="Vérifiés par ALLNEEDS avant proposition. Le contrat se conclut directement avec eux."
              action={<Network className="h-4 w-4 text-ink-400" />}
            />
            <div className="divide-y divide-ink-50">
              {providers.length === 0 ? (
                <CardBody>
                  <p className="text-sm text-ink-500">
                    Les prestataires sont en cours de recherche et de vérification. Vous recevrez une première
                    proposition selon votre délai contractuel.
                  </p>
                </CardBody>
              ) : null}
              {providers.map((provider) => {
                const quote = quotes.find((q) => q.providerId === provider.id)
                return (
                  <div key={provider.id} className="px-5 py-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-ink-950">{provider.name}</p>
                          <Badge tone={provider.verification === 'approfondie' ? 'brand' : 'neutral'}>
                            Vérification {provider.verification}
                          </Badge>
                          {provider.minorsCompliant ? <Badge tone="success">Conforme mineurs</Badge> : null}
                        </div>
                        <p className="mt-1 text-xs text-ink-500">
                          {provider.categoryLabel} · {provider.city} · réponse sous {provider.responseDelay}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="flex items-center justify-end gap-1 text-sm font-semibold text-ink-900">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          {provider.rating.toFixed(1)}
                          <span className="text-xs font-normal text-ink-400">({provider.reviews})</span>
                        </p>
                        <p className="text-xs text-ink-500">{provider.priceHint}</p>
                      </div>
                    </div>

                    <ul className="mt-3 grid gap-1.5 text-xs text-ink-600 sm:grid-cols-2">
                      {provider.highlights.slice(0, 4).map((h) => (
                        <li key={h} className="flex items-start gap-1.5">
                          <Circle className="mt-1 h-1.5 w-1.5 shrink-0 fill-ink-300 text-ink-300" />
                          {h}
                        </li>
                      ))}
                    </ul>

                    {quote ? (
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-ink-50 px-4 py-3">
                        <div>
                          <p className="text-xs text-ink-500">Devis reçu</p>
                          <p className="text-sm font-bold text-ink-950">{money(quote.amount)} HT</p>
                        </div>
                        <div className="text-xs text-ink-500">
                          <p>Livraison : {quote.delayWeeks} semaines</p>
                          <p>Valable jusqu’au {longDate(quote.validUntil)}</p>
                        </div>
                        <div className="flex gap-2">
                          <Link to="/app/devis">
                            <Button size="sm" variant="outline">
                              <Receipt className="h-3.5 w-3.5" />
                              Comparer
                            </Button>
                          </Link>
                          {quote.status === 'recu' || quote.status === 'en_etude' ? (
                            <Button
                              size="sm"
                              onClick={() =>
                                dispatch({ type: 'QUOTE_SET_STATUS', id: quote.id, status: 'accepte' })
                              }
                            >
                              Accepter
                            </Button>
                          ) : (
                            <Badge tone={quote.status === 'accepte' ? 'success' : 'neutral'}>
                              {quote.status === 'accepte' ? 'Accepté' : 'Refusé'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader title="Historique" />
            <CardBody>
              <ul className="space-y-4">
                {[...need.timeline].reverse().map((entry, i) => (
                  <li key={`${entry.at}-${i}`} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className="mt-1 h-2 w-2 rounded-full bg-brand-600" />
                      {i < need.timeline.length - 1 ? <span className="w-px flex-1 bg-ink-200" /> : null}
                    </div>
                    <div className="pb-2">
                      <p className="text-sm text-ink-800">{entry.label}</p>
                      <p className="mt-0.5 text-xs text-ink-400">{relative(entry.at)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader title="Fiche du besoin" />
            <CardBody className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-500">Catégorie</span>
                <span className="text-right font-medium text-ink-900">{need.categoryLabel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-500">Budget max</span>
                <span className="font-medium text-ink-900">{need.budgetMax ? money(need.budgetMax) : 'à définir'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-500">Urgence</span>
                <Badge tone={URGENCY[need.urgency].tone}>{URGENCY[need.urgency].label}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-500">Échéance</span>
                <span className="font-medium text-ink-900">{need.deadline ? longDate(need.deadline) : '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-500">Localisation</span>
                <span className="font-medium text-ink-900">{need.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-500">Interlocuteur</span>
                <span className="font-medium text-ink-900">{need.assignedTo}</span>
              </div>
            </CardBody>
          </Card>

          {quotes.length > 0 ? (
            <Card>
              <CardHeader title="Comparatif de devis" />
              <CardBody className="space-y-4">
                {quotes.map((quote) => {
                  const provider = byId(state.providers, quote.providerId)
                  const best = Math.min(...quotes.map((q) => q.amount))
                  return (
                    <div key={quote.id}>
                      <div className="flex items-baseline justify-between">
                        <p className="text-sm font-semibold text-ink-900">{provider?.name}</p>
                        <p className="font-display text-lg text-ink-950">{money(quote.amount)}</p>
                      </div>
                      {quote.amount === best ? <Badge tone="success" className="mt-1">Meilleur prix</Badge> : null}
                      <p className="mt-1.5 text-xs text-ink-500">
                        {quote.delayWeeks} semaines · {quote.status === 'accepte' ? 'accepté' : quote.status === 'refuse' ? 'refusé' : 'en étude'}
                      </p>
                    </div>
                  )
                })}
                <Progress value={quotes.filter((q) => q.status !== 'recu').length / quotes.length * 100} label="Décisions prises" />
              </CardBody>
            </Card>
          ) : null}

          <Alert tone="info" title="Rappel" icon={<ShieldCheck className="h-4 w-4" />}>
            Le contrat est conclu directement entre vous et le prestataire, qui reste responsable de sa prestation. ALLNEEDS
            vous informe de toute commission éventuellement perçue.
          </Alert>
        </aside>
      </div>
    </>
  )
}
