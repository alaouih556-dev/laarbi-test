import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { SECTOR_LABEL, SECTOR_ORDER } from '@/data/catalog'
import { FaqList, CtaBand } from '@/components/marketing'
import { Card, Input, SectionHeading } from '@/components/ui'
import { useSelectedSector } from '@/lib/sector-filter'

export const Route = createFileRoute('/_public/faq')({
  component: FaqPage,
  head: () => ({
    meta: [
      { title: 'Questions fréquentes — ALLNEEDS' },
      {
        name: 'description',
        content:
          'Le diagnostic, les secteurs accompagnés, les modalités de travail et la protection des données.',
      },
    ],
  }),
})

const GENERALES = [
  {
    q: 'À qui s’adresse ALLNEEDS ?',
    a: 'Aux dirigeants d’établissements de santé, d’enseignement et de tourisme qui veulent mieux organiser leurs priorités et décider de la suite à partir de leur quotidien.',
  },
  {
    q: 'Que se passe-t-il pendant le premier échange ?',
    a: 'Nous parlons de votre situation pendant 2h15. Vous repartez avec un état des lieux synthétique, les principaux points à clarifier et trois priorités recommandées.',
  },
  {
    q: 'Le diagnostic m’engage-t-il à acheter une prestation ?',
    a: 'Non. Le diagnostic est offert pendant l’offre de lancement et ne vous oblige pas à poursuivre avec ALLNEEDS.',
  },
  {
    q: 'Comment connaître le prix et le contenu d’un accompagnement ?',
    a: 'Après le diagnostic, les offres complètes sont visibles dans votre espace après connexion. Le périmètre, les livrables, le prix et les limites figurent aussi sur un devis avant votre accord.',
  },
  {
    q: 'ALLNEEDS garantit-elle un résultat chiffré ?',
    a: 'Non. Nous partons des faits observés dans votre établissement. Les opportunités sont évaluées après analyse, sans promesse de résultat avant d’avoir les éléments nécessaires.',
  },
  {
    q: 'Comment protégez-vous les informations sensibles ?',
    a: 'Le diagnostic porte sur votre organisation. Il ne nécessite pas de partager les données nominatives de patients ou d’élèves. Toute utilisation d’image de mineur requiert l’autorisation écrite des représentants légaux.',
  },
]

const SECTOR_FAQ = {
  enseignement: [{ q: 'Le diagnostic porte-t-il sur la pédagogie ?', a: 'Non. Il concerne l’organisation de l’établissement, les admissions, les échanges avec les familles et les besoins opérationnels.' }],
  sante: [{ q: 'Le diagnostic porte-t-il sur les soins ?', a: 'Non. Il concerne l’organisation, l’accueil et les besoins opérationnels de votre structure.' }],
  tourisme: [{ q: 'Faut-il remplacer nos outils de réservation ?', a: 'Non. Le premier échange part de vos outils, canaux et habitudes actuels.' }],
}

export function FaqPage() {
  const [query, setQuery] = useState('')
  const selectedSector = useSelectedSector()

  const filtered = useMemo(() => {
    const all = [
      { group: 'Général', items: GENERALES },
      ...(selectedSector ? [{ group: SECTOR_LABEL[selectedSector], items: SECTOR_FAQ[selectedSector] }] : SECTOR_ORDER.map((sector) => ({ group: SECTOR_LABEL[sector], items: SECTOR_FAQ[sector] }))),
    ]
    if (!query.trim()) return all
    const q = query.toLowerCase()
    return all
      .map((block) => ({
        group: block.group,
        items: block.items.filter(
          (item) => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q),
        ),
      }))
      .filter((block) => block.items.length > 0)
  }, [query, selectedSector])

  return (
    <>
      <section className="border-b border-ink-100 bg-[#f8fbff]">
        <div className="container-page py-16 sm:py-20">
          <p className="eyebrow">Avant de décider</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight tracking-[-.04em] sm:text-6xl">Les réponses claires, avant de vous engager.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-ink-600">Découvrez ce que le diagnostic apporte, comment nous protégeons vos informations et ce qui se passe après.</p>

          <div className="relative mt-8 max-w-xl">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une question…"
              className="pl-10"
            />
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-[0.35fr_0.65fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Card className="p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Rubriques</p>
              <ul className="mt-4 space-y-2 text-sm">
                {filtered.map((block) => (
                  <li key={block.group} className="flex items-center justify-between gap-3 text-ink-700">
                    <span>{block.group}</span>
                    <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[0.65rem] tabular-nums text-ink-600">
                      {block.items.length}
                    </span>
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                Poser une question
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Card>
          </div>

          <div className="space-y-12">
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50/50 px-6 py-12 text-center">
                <p className="text-sm font-semibold text-ink-800">Aucune réponse pour « {query} »</p>
                <p className="mt-1.5 text-sm text-ink-500">Écrivez-nous, nous répondons sous 24 h ouvrées.</p>
                <Link to="/contact" className="mt-5 inline-block">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                    Nous écrire
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </div>
            ) : null}

            {filtered.map((block) => (
              <div key={block.group}>
                <h2 className="font-display text-2xl tracking-tight text-ink-950">{block.group}</h2>
                <div className="mt-5">
                  <FaqList items={block.items} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <SectionHeading
            eyebrow="En résumé"
            title="Ce que vous obtenez avant de décider"
            align="center"
          />
          <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: 'Un état des lieux', d: 'Les forces et les points de blocage de votre situation.' },
              { t: 'Trois priorités', d: 'Des sujets concrets pour orienter vos décisions.' },
              { t: 'Une suite lisible', d: 'Périmètre et prix détaillés dans votre espace après connexion.' },
              { t: 'Votre liberté', d: 'Vous choisissez de poursuivre ou non après le diagnostic.' },
            ].map((item) => (
              <Card key={item.t} className="p-5">
                <p className="text-sm font-semibold text-ink-950">{item.t}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{item.d}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Une question sans réponse ici ?"
        description="Parlez-nous de votre quotidien. Nous vous aiderons à voir si le diagnostic ALLNEEDS peut vous être utile."
        secondary={{ label: 'Nous contacter', to: '/contact' }}
      />
    </>
  )
}
