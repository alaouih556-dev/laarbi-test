import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { MapPin, Search, ShieldCheck, Star } from 'lucide-react'
import { useDemo } from '@/store/store'
import { PageHeader } from '@/components/layouts'
import { Badge, Card, EmptyState, Input, Select } from '@/components/ui'

export const Route = createFileRoute('/app/prestataires')({
  component: PrestatairesPage,
  head: () => ({ meta: [{ title: 'Réseau de prestataires — ALLNEEDS' }] }),
})

export function PrestatairesPage() {
  const { state } = useDemo()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('tous')
  const [level, setLevel] = useState('tous')

  const categories = Array.from(new Set(state.providers.map((p) => p.category)))
  const cities = Array.from(new Set(state.providers.map((p) => p.city)))

  const providers = state.providers
    .filter((p) => (category === 'tous' ? true : p.category === category))
    .filter((p) => (level === 'tous' ? true : p.verification === level))
    .filter((p) =>
      query.trim()
        ? `${p.name} ${p.categoryLabel} ${p.city} ${p.highlights.join(' ')}`.toLowerCase().includes(query.toLowerCase())
        : true,
    )

  const usedInNeeds = state.needs.reduce<Record<string, number>>((acc, need) => {
    need.candidateIds.forEach((pid) => {
      acc[pid] = (acc[pid] ?? 0) + 1
    })
    return acc
  }, {})

  return (
    <>
      <PageHeader
        eyebrow="Réseau"
        title="Les prestataires mobilisables"
        description="Vérifiés par ALLNEEDS. Vous ne payez jamais un prestataire via l’abonnement : le contrat est conclu directement avec lui."
      />

      <Card className="mb-6 p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative lg:col-span-2">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un prestataire, une prestation, une ville…"
              className="pl-10"
            />
          </div>
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="tous">Toutes les catégories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {state.providers.find((p) => p.category === c)?.categoryLabel ?? c}
              </option>
            ))}
          </Select>
          <Select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="tous">Tous les niveaux de vérification</option>
            <option value="base">Vérification de base</option>
            <option value="approfondie">Vérification approfondie</option>
          </Select>
        </div>
        <p className="mt-3 text-xs text-ink-500">
          {providers.length} prestataire{providers.length > 1 ? 's' : ''} affiché{providers.length > 1 ? 's' : ''} ·{' '}
          {cities.length} villes couvertes
        </p>
      </Card>

      {providers.length === 0 ? (
        <EmptyState
          title="Aucun prestataire ne correspond"
          description="Élargissez vos filtres, ou déposez un besoin : nous cherchons un prestataire même s’il n’est pas au catalogue."
          action={
            <Link to="/inscription">
              <span className="text-sm font-semibold text-brand-700">Déposer un besoin</span>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {providers.map((provider) => (
            <Card key={provider.id} className="flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink-950">{provider.name}</p>
                  <p className="mt-0.5 text-xs text-ink-500">{provider.categoryLabel}</p>
                </div>
                <Badge tone={provider.verification === 'approfondie' ? 'brand' : 'neutral'}>
                  {provider.verification === 'approfondie' ? 'Approfondie' : 'Base'}
                </Badge>
              </div>

              <div className="mt-3 flex items-center gap-3 text-xs text-ink-500">
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {provider.rating.toFixed(1)} ({provider.reviews})
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {provider.city}
                </span>
                <span>Réponse {provider.responseDelay}</span>
              </div>

              <ul className="mt-4 flex-1 space-y-1.5">
                {provider.highlights.map((h) => (
                  <li key={h} className="text-sm leading-relaxed text-ink-700">
                    {h}
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {provider.minorsCompliant ? (
                  <Badge tone="success">
                    <ShieldCheck className="h-3 w-3" />
                    Règles mineurs
                  </Badge>
                ) : null}
                {provider.insurance ? <Badge tone="info">Assuré</Badge> : null}
              </div>

              <p className="mt-4 rounded-lg bg-ink-50 px-3 py-2 text-xs text-ink-600">{provider.note}</p>

              <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-4">
                <span className="text-xs text-ink-500">
                  {usedInNeeds[provider.id] ? `Proposé sur ${usedInNeeds[provider.id]} besoin(s)` : 'Non encore mobilisé'}
                </span>
                <span className="text-sm font-semibold text-ink-900">{provider.priceHint}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
