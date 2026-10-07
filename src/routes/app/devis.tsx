import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Check, Receipt, X } from 'lucide-react'
import { useDemo } from '@/store/store'
import { PageHeader } from '@/components/layouts'
import { Badge, Button, Card, CardHeader, CardBody, EmptyState, Tabs, Progress } from '@/components/ui'
import { longDate, money, relative } from '@/lib/format'
import { byId, sum } from '@/lib/utils'
import type { Quote } from '@/types'

export const Route = createFileRoute('/app/devis')({
  component: DevisPage,
  head: () => ({ meta: [{ title: 'Mes devis — ALLNEEDS' }] }),
})

const STATUS: Record<Quote['status'], { label: string; tone: 'neutral' | 'info' | 'success' | 'danger' }> = {
  recu: { label: 'Reçu', tone: 'neutral' },
  en_etude: { label: 'En étude', tone: 'info' },
  accepte: { label: 'Accepté', tone: 'success' },
  refuse: { label: 'Refusé', tone: 'danger' },
}

export function DevisPage() {
  const { state, dispatch, orgId } = useDemo()
  const [filter, setFilter] = useState('tous')

  const quotes = state.quotes
    .filter((q) => {
      const need = byId(state.needs, q.needId)
      return need?.orgId === orgId
    })
    .filter((q) => (filter === 'tous' ? true : q.status === filter))

  const allQuotes = state.quotes.filter((q) => byId(state.needs, q.needId)?.orgId === orgId)
  const grouped = allQuotes.reduce<Record<string, Quote[]>>((acc, quote) => {
    acc[quote.needId] = acc[quote.needId] ?? []
    acc[quote.needId].push(quote)
    return acc
  }, {})

  return (
    <>
      <PageHeader
        eyebrow="Négociation"
        title="Mes devis"
        description="Comparatif chiffré, échéances et validity. Vous décidez, nous relançons si besoin."
      />

      <div className="mb-5">
        <Tabs
          value={filter}
          onChange={setFilter}
          tabs={[
            { value: 'tous', label: 'Tous', count: allQuotes.length },
            { value: 'recu', label: 'Reçus', count: allQuotes.filter((q) => q.status === 'recu').length },
            { value: 'en_etude', label: 'En étude', count: allQuotes.filter((q) => q.status === 'en_etude').length },
            { value: 'accepte', label: 'Acceptés', count: allQuotes.filter((q) => q.status === 'accepte').length },
            { value: 'refuse', label: 'Refusés', count: allQuotes.filter((q) => q.status === 'refuse').length },
          ]}
        />
      </div>

      {quotes.length === 0 ? (
        <EmptyState
          icon={<Receipt className="h-5 w-5" />}
          title="Aucun devis dans cette vue"
          description="Les devis arrivent ici dès que les prestataires les transmettent. Vous recevrez aussi une fiche comparative écrite."
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([needId, group]) => {
            const need = byId(state.needs, needId)
            if (!group.some((q) => (filter === 'tous' ? true : q.status === filter))) return null
            const cheapest = Math.min(...group.map((q) => q.amount))
            const fastest = Math.min(...group.map((q) => q.delayWeeks))
            const spread = Math.max(...group.map((q) => q.amount)) - cheapest

            return (
              <Card key={needId}>
                <CardHeader
                  title={need?.title ?? 'Besoin'}
                  description={need?.categoryLabel}
                  action={
                    <span className="text-xs text-ink-500">
                      Écart entre offres : {money(spread)} · soit {Math.round((spread / cheapest) * 100)} %
                    </span>
                  }
                />
                <CardBody className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                  {group.map((quote) => {
                    const provider = byId(state.providers, quote.providerId)
                    const status = STATUS[quote.status]
                    const isBest = quote.amount === cheapest
                    const isFast = quote.delayWeeks === fastest
                    const total = sum(quote.breakdown.map((b) => b.amount))

                    return (
                      <div
                        key={quote.id}
                        className={`flex flex-col rounded-xl border p-4 ${
                          isBest ? 'border-emerald-300 bg-emerald-50/40' : 'border-ink-100'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-ink-950">{provider?.name}</p>
                          <Badge tone={status.tone}>{status.label}</Badge>
                        </div>

                        <p className="mt-3 font-display text-2xl leading-none text-ink-950">{money(quote.amount)}</p>
                        <p className="mt-1 text-xs text-ink-500">HT · {quote.delayWeeks} semaines de livraison</p>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {isBest ? <Badge tone="success">Meilleur prix</Badge> : null}
                          {isFast ? <Badge tone="brand">Plus rapide</Badge> : null}
                        </div>

                        <p className="mt-3 text-xs leading-relaxed text-ink-600">{quote.detail}</p>

                        <ul className="mt-3 space-y-1 border-t border-ink-100 pt-3 text-xs">
                          {quote.breakdown.map((b) => (
                            <li key={b.label} className="flex justify-between gap-3 text-ink-600">
                              <span>{b.label}</span>
                              <span className="tabular-nums">{money(b.amount)}</span>
                            </li>
                          ))}
                          {total !== quote.amount ? (
                            <li className="flex justify-between gap-3 border-t border-ink-100 pt-1 font-semibold text-ink-900">
                              <span>Total annoncé</span>
                              <span className="tabular-nums">{money(quote.amount)}</span>
                            </li>
                          ) : null}
                        </ul>

                        <p className="mt-3 text-xs text-ink-400">
                          Valable jusqu’au {longDate(quote.validUntil)} · reçu {relative(quote.receivedAt)}
                        </p>

                        {quote.status === 'recu' || quote.status === 'en_etude' ? (
                          <div className="mt-4 flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => dispatch({ type: 'QUOTE_SET_STATUS', id: quote.id, status: 'accepte' })}
                            >
                              <Check className="h-3.5 w-3.5" />
                              Accepter
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => dispatch({ type: 'QUOTE_SET_STATUS', id: quote.id, status: 'refuse' })}
                            >
                              <X className="h-3.5 w-3.5" />
                              Refuser
                            </Button>
                          </div>
                        ) : (
                          <p className="mt-4 text-xs font-semibold text-ink-600">
                            {quote.status === 'accepte'
                              ? 'Décision prise. Le contrat se conclut directement avec le prestataire.'
                              : 'Devis écarté. L’interlocuteur peut vous proposer une alternative.'}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </CardBody>
              </Card>
            )
          })}
        </div>
      )}

      <Card className="mt-6 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Engagement</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          Nous ne négocions pas à votre place. Nous comparons, nous quantifions, et nous vous aidons à décider avec les
          informations en main. Toute commission eventualmente perçue par ALLNEEDS auprès d’un prestataire vous est
          communiquée.
        </p>
        <Progress className="mt-4" value={100} label="Écarts analysés et documentés" tone="emerald" />
      </Card>
    </>
  )
}
