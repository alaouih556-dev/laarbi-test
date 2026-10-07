import { createFileRoute } from '@tanstack/react-router'
import { SectorPage } from '@/components/SectorPage'

export const Route = createFileRoute('/_public/secteurs/enseignement')({
  component: () => <SectorPage sector="enseignement" />,
  head: () => ({
    meta: [
      { title: 'ALLNEEDS ENSEIGNEMENT — Écoles privées, crèches et centres de formation' },
      {
        name: 'description',
        content:
          'Inscriptions, image, équipe et charges : diagnostic, structuration et accompagnement 30 jours pour les écoles privées, crèches et centres de formation.',
      },
    ],
  }),
})
