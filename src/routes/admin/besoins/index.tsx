import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Check, Filter, Plus, Search, Star, X } from 'lucide-react'
import { useDemo, makeQuote } from '@/store/store'
import { useAuth } from '@/features/auth/AuthContext'
import { useOperationalNeeds } from '@/features/operations/useOperationalNeeds'
import { PageHeader } from '@/components/layouts'
import {
  Alert,
  Badge,
  Button,
  Card,
  CardHeader,
  CardBody,
  Field,
  Input,
  Modal,
  Select,
  Textarea,
  useDisclosure,
} from '@/components/ui'
import { NEED_FLOW, NEED_STATUS } from '@/lib/status'
import { longDate, money, relative } from '@/lib/format'
import { byId } from '@/lib/utils'
import { DEMO_NOW } from '@/data/demo'
import type { Need, NeedStatus, Provider, Quote } from '@/types'

export const Route = createFileRoute('/admin/besoins/')({
  component: AdminNeeds,
  head: () => ({ meta: [{ title: 'Besoins — ALLNEEDS' }] }),
})

export function AdminNeeds() {
  const { state, dispatch } = useDemo()
  const auth = useAuth()
  const operations = useOperationalNeeds(state.needs)
  const providerModal = useDisclosure()
  const quoteModal = useDisclosure()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('actifs')
  const [orgFilter, setOrgFilter] = useState('tous')
  const [target, setTarget] = useState<Need | null>(null)
  const [providerId, setProviderId] = useState('')
  const [quote, setQuote] = useState({ amount: '', delay: '4', detail: '' })

  const now = new Date(state.now).getTime()

  const needs = operations.needs
    .filter((n) => (status === 'tous' ? true : status === 'actifs' ? !['signe', 'clos'].includes(n.status) : n.status === status))
    .filter((n) => (orgFilter === 'tous' ? true : n.orgId === orgFilter))
    .filter((n) =>
      query.trim() ? `${n.title} ${n.categoryLabel} ${n.location}`.toLowerCase().includes(query.toLowerCase()) : true,
    )
    .sort((a, b) => NEED_FLOW.indexOf(a.status) - NEED_FLOW.indexOf(b.status) || b.submittedAt.localeCompare(a.submittedAt))

  const availableProviders = operations.live ? [] : state.providers.filter(
    (p) => p.category === target?.category && !target?.candidateIds.includes(p.id),
  )

  function addProvider() {
    if (!target || !providerId) return
    dispatch({ type: 'NEED_ADD_PROVIDER', needId: target.id, providerId })
    dispatch({
      type: 'TOAST_ADD',
      toast: {
        title: 'Prestataire proposé',
        description: `${byId(state.providers, providerId)?.name} est maintenant visible dans l’espace client.`,
        tone: 'success',
      },
    })
    setTarget({ ...target, candidateIds: [...target.candidateIds, providerId] })
    setProviderId('')
    providerModal.close()
  }

  function addQuote() {
    if (!target || !quote.amount) return
    dispatch({
      type: 'QUOTE_ADD',
      quote: makeQuote({
        needId: target.id,
        providerId: target.candidateIds[0] ?? 'prov-atlas',
        amount: Number(quote.amount),
        delayWeeks: Number(quote.delay),
        validUntil: new Date(new Date(DEMO_NOW).getTime() + 30 * 86400000).toISOString(),
        detail: quote.detail || 'Devis de démonstration.',
        breakdown: [{ label: 'Prestation', amount: Number(quote.amount) }],
      }),
    })
    setQuote({ amount: '', delay: '4', detail: '' })
    quoteModal.close()
  }

  return (
    <>
      <PageHeader
        eyebrow="Opérationnel"
        title="Besoins clients"
        description="Proposez des prestataires, transmettez les devis, avancez l’étape. Chaque action est visible côté client."
        actions={
          <Link to="/admin/qualification">
            <Button size="sm" variant="outline">
              <Filter className="h-3.5 w-3.5" />
              Demandes entrantes
            </Button>
          </Link>
        }
      />

      {operations.live ? <Alert tone="info" className="mb-5" title="Besoins synchronisés">Les demandes et leurs changements d’étape sont persistants et partagés entre les espaces. Les propositions de prestataires et devis restent à raccorder.</Alert> : null}
      {operations.error ? <Alert tone="danger" className="mb-5" title="Chargement des besoins impossible">{operations.error}</Alert> : null}

      <Card className="mb-5 p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative lg:col-span-2">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un besoin, une catégorie, une ville…"
              className="pl-10"
            />
          </div>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="actifs">Besoins actifs</option>
            <option value="tous">Tous les statuts</option>
            {NEED_FLOW.map((s) => (
              <option key={s} value={s}>
                {NEED_STATUS[s].label}
              </option>
            ))}
            <option value="clos">Clos</option>
          </Select>
          <Select value={orgFilter} onChange={(e) => setOrgFilter(e.target.value)}>
            <option value="tous">Tous les établissements</option>
            {state.orgs.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      <div className="space-y-4">
        {needs.map((need) => {
          const org = byId(state.orgs, need.orgId)
          const statusMeta = NEED_STATUS[need.status]
          const quotes = (operations.live ? [] : need.quoteIds)
            .map((q) => byId(state.quotes, q))
            .filter((x): x is Quote => x != null)
          const providers = (operations.live ? [] : need.candidateIds)
            .map((p) => byId(state.providers, p))
            .filter((x): x is Provider => x != null)
          const stepIndex = NEED_FLOW.indexOf(need.status)
          const nextStatus = NEED_FLOW[Math.min(stepIndex + 1, NEED_FLOW.length - 1)]

          return (
            <Card key={need.id}>
              <CardHeader
                title={need.title}
                description={`${org?.name} · ${need.categoryLabel} · ${need.location} · reçu ${relative(need.submittedAt, now)}`}
                action={
                  <div className="flex items-center gap-2">
                    {need.urgency === 'haute' ? <Badge tone="danger">Urgent</Badge> : null}
                    <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
                  </div>
                }
              />
              <CardBody>
                <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
                  <div>
                    <p className="text-sm leading-relaxed text-ink-700">{need.description}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge tone="neutral">Budget max {need.budgetMax ? money(need.budgetMax) : 'à définir'}</Badge>
                      {need.deadline ? <Badge tone="neutral">Échéance {longDate(need.deadline)}</Badge> : null}
                      <Badge tone="neutral">Assigné à {need.assignedTo}</Badge>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {!operations.live ? <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setTarget(need)
                          providerModal.openFn()
                        }}
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Proposer un prestataire
                      </Button> : null}
                      {!operations.live ? <Button
                        size="sm"
                        variant="outline"
                        disabled={providers.length === 0}
                        onClick={() => {
                          setTarget(need)
                          quoteModal.openFn()
                        }}
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Saisir un devis
                      </Button> : null}
          {stepIndex >= 0 && nextStatus !== need.status ? (
                        <Button
                          size="sm"
                          onClick={() => {
                            const label = `Étape avancée par l’équipe : ${NEED_STATUS[nextStatus].label}`
                            if (auth.status === 'authenticated') void operations.setStatus(need.id, nextStatus as NeedStatus, label).catch((cause) => dispatch({ type: 'TOAST_ADD', toast: { title: 'Étape non enregistrée', description: cause instanceof Error ? cause.message : 'Réessayez.', tone: 'warning' } }))
                            else dispatch({
                              type: 'NEED_SET_STATUS',
                              id: need.id,
                              status: nextStatus as NeedStatus,
                              label,
                            })
                          }}
                        >
                          Passer à « {NEED_STATUS[nextStatus].label} »
                        </Button>
                      ) : null}
                      {need.status !== 'clos' ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (auth.status === 'authenticated') void operations.setStatus(need.id, 'clos', 'Besoin clos par l’équipe ALLNEEDS').catch((cause) => dispatch({ type: 'TOAST_ADD', toast: { title: 'Besoin non clôturé', description: cause instanceof Error ? cause.message : 'Réessayez.', tone: 'warning' } }))
                            else dispatch({ type: 'NEED_SET_STATUS', id: need.id, status: 'clos', label: 'Besoin clos' })
                          }}
                        >
                          <X className="h-3.5 w-3.5" />
                          Closer
                        </Button>
                      ) : null}
                    </div>

                    <div className="mt-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Historique</p>
                      <ul className="mt-2 space-y-1">
                        {need.timeline.map((entry, i) => (
                          <li key={`${entry.at}-${i}`} className="text-xs text-ink-500">
                            <span className="text-ink-400">{longDate(entry.at)}</span> — {entry.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                        Prestataires proposés ({operations.live ? 'à raccorder' : providers.length})
                      </p>
                      <ul className="mt-2 space-y-2">
                        {operations.live ? (
                          <li className="rounded-lg border border-dashed border-ink-200 px-3 py-3 text-xs text-ink-500">La sélection des prestataires sera activée avec la synchronisation du catalogue.</li>
                        ) : providers.length === 0 ? (
                          <li className="rounded-lg border border-dashed border-ink-200 px-3 py-3 text-xs text-ink-400">
                            Aucun prestataire proposé. Le client attend.
                          </li>
                        ) : null}
                        {providers.map((p) => (
                          <ProviderRow key={p.id} provider={p} />
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                        Devis reçus ({operations.live ? 'à raccorder' : quotes.length})
                      </p>
                      {operations.live ? (
                        <p className="mt-2 rounded-lg border border-dashed border-ink-200 px-3 py-3 text-xs text-ink-500">La saisie et la comparaison des devis seront disponibles une fois leur enregistrement serveur raccordé.</p>
                      ) : quotes.length === 0 ? (
                        <p className="mt-2 rounded-lg border border-dashed border-ink-200 px-3 py-3 text-xs text-ink-400">
                          Aucun devis. Saisissez-en un pour débloquer la comparaison.
                        </p>
                      ) : (
                        <ul className="mt-2 space-y-2">
                          {quotes.map((q) => (
                            <li key={q.id} className="rounded-lg border border-ink-100 px-3 py-2">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-semibold text-ink-950">{money(q.amount)}</p>
                                <Badge
                                  tone={
                                    q.status === 'accepte'
                                      ? 'success'
                                      : q.status === 'refuse'
                                        ? 'danger'
                                        : q.status === 'en_etude'
                                          ? 'info'
                                          : 'neutral'
                                  }
                                >
                                  {q.status === 'accepte'
                                    ? 'Accepté'
                                    : q.status === 'refuse'
                                      ? 'Refusé'
                                      : q.status === 'en_etude'
                                        ? 'En étude'
                                        : 'Reçu'}
                                </Badge>
                              </div>
                              <p className="mt-0.5 text-xs text-ink-500">
                                {byId(state.providers, q.providerId)?.name} · {q.delayWeeks} semaines · valable jusqu’au{' '}
                                {longDate(q.validUntil)}
                              </p>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          )
        })}
      </div>

      {needs.length === 0 ? (
        <Card className="mt-4 p-8 text-center">
          <p className="text-sm text-ink-500">Aucun besoin ne correspond à ces filtres.</p>
        </Card>
      ) : null}

      <Modal
        open={providerModal.open}
        onClose={providerModal.close}
        title="Proposer un prestataire"
        description={target ? `${target.title} — ${target.categoryLabel}` : ''}
      >
        <div className="space-y-4">
          <Field label="Prestataire vérifié" required>
            <Select value={providerId} onChange={(e) => setProviderId(e.target.value)}>
              <option value="">Choisir…</option>
              {availableProviders.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.verification} · {p.city}
                </option>
              ))}
            </Select>
          </Field>

          {providerId ? (
            <ProviderDetail provider={byId(state.providers, providerId) as Provider} />
          ) : (
            <p className="text-xs text-ink-500">
              Seuls les prestataires de la catégorie du besoin sont proposés. Un prestataire non vérifié doit passer par
              la page Prestataires avant d’être proposé.
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={providerModal.close}>
              Annuler
            </Button>
            <Button onClick={addProvider} disabled={!providerId}>
              Proposer au client
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={quoteModal.open}
        onClose={quoteModal.close}
        title="Saisir un devis"
        description={target ? `${target.title} — pour le premier prestataire proposé` : ''}
        size="sm"
      >
        <div className="space-y-4">
          <Field label="Montant HT (DH)" required>
            <Input type="number" value={quote.amount} onChange={(e) => setQuote({ ...quote, amount: e.target.value })} />
          </Field>
          <Field label="Délai de livraison (semaines)">
            <Input type="number" value={quote.delay} onChange={(e) => setQuote({ ...quote, delay: e.target.value })} />
          </Field>
          <Field label="Détail du devis" hint="Visible dans l’espace client.">
            <Textarea rows={3} value={quote.detail} onChange={(e) => setQuote({ ...quote, detail: e.target.value })} />
          </Field>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={quoteModal.close}>
              Annuler
            </Button>
            <Button onClick={addQuote} disabled={!quote.amount}>
              Transmettre
            </Button>
          </div>
        </div>
      </Modal>

      <Alert tone="info" className="mt-6" title="Règle de transparence">
        Le devis est transmis tel quel. Si une commission est perçue par ALLNEEDS, elle est communiquée au client avant
        signature — jamais après.
      </Alert>
    </>
  )
}

function ProviderRow({ provider }: { provider: Provider }) {
  return (
    <li className="flex items-center justify-between gap-2 rounded-lg border border-ink-100 px-3 py-2">
      <div>
        <p className="text-sm font-semibold text-ink-950">{provider.name}</p>
        <p className="mt-0.5 text-xs text-ink-500">
          {provider.city} · réponse {provider.responseDelay} ·{' '}
          <span className="inline-flex items-center gap-0.5">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {provider.rating.toFixed(1)}
          </span>
        </p>
      </div>
      <Badge tone={provider.verification === 'approfondie' ? 'success' : 'warning'}>
        {provider.verification === 'approfondie' ? 'Vérifié' : 'Base'}
      </Badge>
    </li>
  )
}

function ProviderDetail({ provider }: { provider: Provider }) {
  return (
    <div className="rounded-xl bg-ink-50 p-4">
      <p className="text-sm font-semibold text-ink-950">{provider.name}</p>
      <p className="mt-0.5 text-xs text-ink-500">{provider.note}</p>
      <ul className="mt-2 space-y-1">
        {provider.highlights.map((h) => (
          <li key={h} className="text-xs text-ink-600">
            <Check className="mr-1 inline h-3 w-3 text-emerald-600" />
            {h}
          </li>
        ))}
      </ul>
    </div>
  )
}
