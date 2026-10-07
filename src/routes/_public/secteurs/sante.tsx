import { createFileRoute } from '@tanstack/react-router'
import { SectorPage } from '@/components/SectorPage'

export const Route = createFileRoute('/_public/secteurs/sante')({
  component: () => <SectorPage sector="sante" />,
  head: () => ({
    meta: [
      { title: 'ALLNEEDS SANTÉ — Cliniques, cabinets et centres de soins' },
      {
        name: 'description',
        content:
          'File active, réputation, équipe et charges : diagnostic, structuration et accompagnement 30 jours pour les cliniques et centres de soins.',
      },
    ],
  }),
})
