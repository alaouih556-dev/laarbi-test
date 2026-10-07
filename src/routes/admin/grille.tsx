import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '@/components/layouts'
import { InternalGrid } from '@/components/InternalGrid'
import { Badge } from '@/components/ui'
import type { Sector } from '@/types'

const SECTORS: Sector[] = ['enseignement', 'sante', 'tourisme']

export const Route = createFileRoute('/admin/grille')({
  validateSearch: (search: Record<string, unknown>): { secteur?: Sector } => {
    const value = String(search.secteur ?? 'enseignement')
    return { secteur: (SECTORS.includes(value as Sector) ? value : 'enseignement') as Sector }
  },
  component: AdminGrille,
  head: () => ({
    meta: [{ title: 'Grille de diagnostic STARTER — ALLNEEDS' }, { name: 'robots', content: 'noindex, nofollow' }],
  }),
})

function AdminGrille() {
  const secteur = Route.useSearch().secteur ?? 'enseignement'

  return (
    <>
      <PageHeader
        eyebrow="ALLNEEDS · usage interne"
        title="Grille de diagnostic STARTER"
        description="Support du diagnostic Express : environ 2h15, 4 thèmes, 3 priorités. Les réponses restent sur ce poste."
        actions={<Badge tone="warning">Document interne</Badge>}
      />
      <InternalGrid key={secteur} sector={secteur} />
    </>
  )
}
