import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { SECTOR_LABEL, SECTOR_ORDER } from '@/data/catalog'
import { SectorPage } from '@/components/SectorPage'
import { Button } from '@/components/ui'
import type { Sector } from '@/types'

export const Route = createFileRoute('/_public/secteurs/$sector')({
  component: SectorRoute,
  notFoundComponent: UnknownSector,
  head: ({ params }) => {
    const sector = params.sector as Sector
    const meta = SECTOR_ORDER.includes(sector) ? SECTOR_META[sector] : null
    return {
      meta: meta
        ? [
            { title: `ALLNEEDS ${SECTOR_LABEL[sector].toUpperCase()} — ${meta.subtitle}` },
            { name: 'description', content: meta.description },
          ]
        : [{ title: 'Secteur introuvable — ALLNEEDS' }],
    }
  },
})

const SECTOR_META: Record<Sector, { subtitle: string; description: string }> = {
  enseignement: {
    subtitle: 'Écoles privées, crèches et centres de formation',
    description:
      'Inscriptions, image, équipe et charges : diagnostic, structuration et accompagnement 30 jours pour les écoles privées, crèches et centres de formation.',
  },
  sante: {
    subtitle: 'Cabinets, centres de santé et laboratoires',
    description:
      'Parcours patient, visibilité informative, équipe et charges : diagnostic, structuration et accompagnement 30 jours pour les cabinets, centres de santé et laboratoires.',
  },
  tourisme: {
    subtitle: 'Riads, maisons d’hôtes, hôtels et restaurants',
    description:
      'Réservations directes, image, équipe et charges : diagnostic, structuration et accompagnement 30 jours pour les riads, maisons d’hôtes, hôtels et restaurants.',
  },
}

function SectorRoute() {
  const { sector } = Route.useParams()
  if (!SECTOR_ORDER.includes(sector as Sector)) throw notFound()
  return <SectorPage sector={sector as Sector} />
}

function UnknownSector() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow">Secteur introuvable</p>
      <h1 className="display-1 mt-4">Ce secteur n’existe pas encore</h1>
      <p className="lede mt-4 max-w-xl">
        Nous travaillons l’enseignement, la santé et le tourisme. Si votre activité n’y figure pas, contactez-nous : le
        diagnostic reste utile hors de ces trois secteurs.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link to="/secteurs">
          <Button>Voir les trois secteurs</Button>
        </Link>
        <Link to="/contact">
          <Button variant="outline">Nous contacter</Button>
        </Link>
      </div>
    </div>
  )
}
