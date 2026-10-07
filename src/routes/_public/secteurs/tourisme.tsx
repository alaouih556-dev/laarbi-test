import { createFileRoute } from '@tanstack/react-router'
import { SectorPage } from '@/components/SectorPage'

export const Route = createFileRoute('/_public/secteurs/tourisme')({
  component: () => <SectorPage sector="tourisme" />,
  head: () => ({
    meta: [
      { title: 'ALLNEEDS TOURISME — Hôtels, riads et acteurs du tourisme' },
      {
        name: 'description',
        content:
          'Offre, distribution, équipe et charges : diagnostic, structuration et accompagnement 30 jours pour les hôtels, riads et locations meublées.',
      },
    ],
  }),
})
