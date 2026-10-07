import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { Building2, LockKeyhole } from 'lucide-react'
import { Badge, Card, SectionHeading } from '@/components/ui'
import { conciergeScope, useDemo } from '@/store/store'
import { SECTOR_LABEL } from '@/data/catalog'

export function ConciergeGuard({ children }: { children: ReactNode }) {
  const { state } = useDemo()
  const { concierge } = conciergeScope(state)
  if (!concierge?.active) {
    return <Card className="p-8 text-center"><LockKeyhole className="mx-auto h-6 w-6 text-ink-400"/><p className="mt-3 font-semibold text-ink-950">Compte concierge inactif</p><p className="mt-1 text-sm text-ink-500">L’administrateur doit réactiver ce compte avant de poursuivre.</p></Card>
  }
  return <>{children}</>
}

export function ScopedEmpty({ title = 'Aucune donnée dans votre portefeuille', description = 'Seules les données des entreprises qui vous sont attribuées sont affichées.' }: { title?: string; description?: string }) {
  return <Card className="p-8 text-center"><Building2 className="mx-auto h-6 w-6 text-ink-400"/><p className="mt-3 font-semibold text-ink-950">{title}</p><p className="mt-1 text-sm text-ink-500">{description}</p></Card>
}

export function OrgIdentity({ orgId }: { orgId: string }) {
  const { state } = useDemo()
  const org = state.orgs.find((item) => item.id === orgId)
  if (!org) return null
  return <Link to={'/concierge/entreprises/$id' as any} params={{ id: org.id } as any} className="inline-flex items-center gap-2 font-semibold text-ink-950 hover:text-brand-700"><span>{org.name}</span><Badge tone="neutral">{SECTOR_LABEL[org.sector]}</Badge></Link>
}

export function ConciergeHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <SectionHeading eyebrow={eyebrow} title={title} description={description} />
}
