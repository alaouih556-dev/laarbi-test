import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, ShieldCheck, Users, Network, FileCheck2 } from 'lucide-react'
import { LAUNCH_OFFER, SECTORS } from '@/data/catalog'
import { ReasonCards } from '@/components/marketing'
import { Card, SectionHeading } from '@/components/ui'

export const Route = createFileRoute('/_public/a-propos')({
  component: AProposPage,
  head: () => ({
    meta: [
      { title: 'Qui est derrière ALLNEEDS' },
      {
        name: 'description',
        content: 'Notre méthode, notre cadre, nos engagements et nos références.',
      },
    ],
  }),
})

const PRINCIPES = [
  {
    icon: ShieldCheck,
    title: 'Un cadre qui protège',
    detail:
      'Aucune donnée nominative d’élève, de patient ou de client. Images d’enfants uniquement avec autorisation écrite des représentants légaux, à recueillir par l’établissement.',
  },
  {
    icon: Users,
    title: 'Un seul interlocuteur',
    detail:
      'Nous mobilisons les compétences nécessaires : graphiste, développeur, juriste administratif, consultant communication. Vous n’avez pas à chercher dix prestataires.',
  },
  {
    icon: FileCheck2,
    title: 'Un périmètre écrit',
    detail:
      'Avant toute mission, vous voyez les livrables, les limites, le calendrier et le prix dans votre espace et sur le devis.',
  },
  {
    icon: Network,
    title: 'Des prestataires vérifiés',
    detail:
      'Existence légale, références clients, cohérence des tarifs, respect des règles applicables aux mineurs. Nous informons de toute commission éventuellement perçue.',
  },
]

export function AProposPage() {
  return (
    <>
      <section className="border-b border-ink-100 bg-[#f8fbff]">
        <div className="container-page py-16 sm:py-20">
          <p className="eyebrow">Notre façon de travailler</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight tracking-[-.04em] sm:text-6xl">D’abord comprendre votre réalité. Ensuite, trouver le bon appui.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-ink-600">
            ALLNEEDS relie les besoins réels des établissements aux compétences capables de les faire avancer. Chaque suite est expliquée, cadrée et laissée à votre décision.
          </p>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeading eyebrow="Notre méthode" title="Le besoin de l’établissement est le point de départ." />
            <div className="prose-allneeds mt-6">
              <p>
                Nous ne partons pas d’un catalogue. Nous partons de votre histoire et de votre calendrier :
                inscriptions, rentrée, saison haute, échéances d’assurance.
              </p>
              <p>
                Un seul interlocuteur suit votre demande du premier échange jusqu’à la signature avec le prestataire, puis
                jusqu’au bilan. Les livrables sont produits pour être utilisés par votre équipe, pas pour être rangés
                dans un dossier.
              </p>
              <p>
                Nous ne promettons pas de résultat chiffré avant analyse. Sur les charges, nous n’annonçons aucune
                économie avant d’avoir mesuré la situation réelle.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {PRINCIPES.map((principe) => (
              <Card key={principe.title} className="p-5">
                <principe.icon className="h-5 w-5 text-brand-700" />
                <p className="mt-3 text-sm font-semibold text-ink-950">{principe.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{principe.detail}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-ink-100 bg-ink-50 py-16">
        <div className="container-page">
          <SectionHeading eyebrow="Nos principes" title="Trois raisons qui reviennent dans chaque mission" align="center" />
          <div className="mt-14">
            <ReasonCards reasons={SECTORS.enseignement.reasons} />
          </div>
        </div>
      </section>

      <section className="border-y border-ink-100 bg-ink-50 py-16">
        <div className="container-page">
          <SectionHeading eyebrow="Des preuves de travail" title="Des éléments concrets pour décider." description="Nous privilégions un périmètre vérifiable et des pièces que vous pouvez examiner plutôt que des chiffres ou des témoignages sans contexte." />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { title: 'Un cadrage écrit', detail: 'Objectifs, livrables, limites, délais et responsabilités définis avec vous.' },
              { title: 'Des livrables montrables', detail: 'Process, supports, tableaux de bord et outils remis à votre établissement.' },
              { title: 'Un suivi lisible', detail: 'Décisions, étapes et points de blocage consignés au fil de la mission.' },
            ].map((item) => <Card key={item.title} className="p-5"><p className="font-semibold text-ink-950">{item.title}</p><p className="mt-2 text-sm leading-relaxed text-ink-600">{item.detail}</p></Card>)}
          </div>
        </div>
      </section>

      <section className="container-page pb-20">
        <Card className="flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
              {LAUNCH_OFFER.label} · {LAUNCH_OFFER.deadline}
            </p>
            <h2 className="mt-3 font-display text-2xl tracking-tight text-ink-950">
              Le premier pas : un diagnostic offert d’environ 2h15.
            </h2>
            <p className="mt-2 text-sm text-ink-600">
              Sans engagement. Vous repartez avec trois priorités écrites et la liberté de choisir la suite.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/inscription">
              <span className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand-700 px-5 text-sm font-semibold text-white transition hover:bg-brand-800">
                Faire le point
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </Card>
      </section>
    </>
  )
}
