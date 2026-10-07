import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { SECTORS, SECTOR_LABEL, SECTOR_ORDER } from '@/data/catalog'
import { CtaBand } from '@/components/marketing'
import { Card } from '@/components/ui'
import { selectSector, useSelectedSector } from '@/lib/sector-filter'

export const Route = createFileRoute('/_public/secteurs/')({
  component: SecteursPage,
  head: () => ({
    meta: [
      { title: 'Nos secteurs — ALLNEEDS' },
      { name: 'description', content: 'Enseignement, Santé, Tourisme : un même cadre, des leviers adaptés à votre établissement.' },
    ],
  }),
})

const EXTRA: Record<string, { signal: string; question: string }> = {
  enseignement: { signal: 'Les demandes d’inscription se perdent entre les appels, les messages et les visites.', question: 'Comment mieux suivre chaque famille jusqu’à sa décision ?' },
  sante: { signal: 'L’accueil jongle entre appels, rendez-vous, annulations et demandes de patients.', question: 'Comment libérer du temps et rendre le parcours plus lisible ?' },
  tourisme: { signal: 'Les demandes arrivent par plusieurs canaux, avec des pics d’activité difficiles à absorber.', question: 'Comment mieux organiser les réservations et préparer la saison ?' },
}

function SecteursPage() {
  const selectedSector = useSelectedSector()
  const navigate = useNavigate()
  useEffect(() => {
    if (selectedSector) navigate({ to: '/secteurs/$sector', params: { sector: selectedSector }, replace: true })
  }, [selectedSector, navigate])
  if (selectedSector) return <main className="container-page py-24 text-center text-sm text-ink-500">Ouverture de votre secteur…</main>
  return (
    <>
      <section className="border-b border-ink-100 bg-[#f8fbff]">
        <div className="container-page grid gap-8 py-16 sm:py-20 lg:grid-cols-[1fr_auto] lg:items-end">
          <div><p className="eyebrow">Nos secteurs</p><h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight tracking-[-.04em] sm:text-6xl">Chaque métier a ses urgences. Votre diagnostic doit le comprendre.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-ink-600">Santé, enseignement ou tourisme : nous partons de ce qui se passe vraiment dans votre établissement, avant de parler de solutions.</p></div>
          <a href="#secteurs" className="inline-flex min-h-12 items-center gap-2 text-sm font-bold text-brand-700">Trouver mon secteur <ArrowRight className="h-4 w-4"/></a>
        </div>
      </section>

      <section id="secteurs" className="container-page py-16 sm:py-24">
        <div className="mb-10 max-w-2xl"><p className="eyebrow">Dites-nous où vous vous reconnaissez</p><h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Un point de départ adapté à votre réalité.</h2></div>
        <div className="grid gap-5 lg:grid-cols-3">
          {SECTOR_ORDER.map((sector) => {
            const content = SECTORS[sector]
            const extra = EXTRA[sector]
            return (
              <Card key={sector} className="flex min-h-full flex-col rounded-[1.75rem] p-7 transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[.16em] text-brand-700">{content.name}</p>
                <h2 className="mt-3 font-display text-2xl font-semibold leading-snug tracking-tight text-ink-950">
                  {content.tagline}
                </h2>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-600">{content.promise}</p>

                <dl className="mt-7 space-y-4 border-t border-ink-100 pt-5">
                  <div>
                    <dt className="text-[0.7rem] font-semibold uppercase tracking-wider text-ink-400">Pour qui</dt>
                    <dd className="mt-1 text-sm text-ink-700">{content.audience}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.7rem] font-semibold uppercase tracking-wider text-ink-400">Ce qui se passe</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-ink-700">{extra.signal}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.7rem] font-semibold uppercase tracking-wider text-ink-400">La question à éclaircir</dt>
                    <dd className="mt-1 text-sm font-semibold leading-relaxed text-ink-900">{extra.question}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.7rem] font-semibold uppercase tracking-wider text-ink-400">Pistes explorées avec vous</dt>
                    <dd className="mt-1 text-sm text-ink-700">{content.levers.map((l) => l.name).join(' · ')}</dd>
                  </div>
                </dl>

                <Link to="/secteurs/$sector" params={{ sector }} className="mt-7 border-t border-ink-100 pt-5" onClick={() => selectSector(sector)}>
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700">
                    Comprendre notre approche {SECTOR_LABEL[sector]}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </Card>
            )
          })}
        </div>
      </section>

      <CtaBand
        title="Vous voulez y voir plus clair ?"
        description="Parlons de votre établissement pendant un diagnostic Express offert d’environ 2h15, sans engagement. Vous repartez avec trois priorités écrites."
        secondary={{ label: 'Nous contacter', to: '/contact' }}
      />
    </>
  )
}
