import { useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, PlusCircle } from 'lucide-react'
import { Button, Card, Field, Input, Select, SectionHeading } from '@/components/ui'
import { conciergeScope, useDemo } from '@/store/store'
import type { Sector } from '@/types'
import { SECTOR_LABEL } from '@/data/catalog'

export const Route = createFileRoute('/concierge/entreprises/nouvelle')({ component: NewConciergeCompany })

function NewConciergeCompany() {
  const { state, dispatch } = useDemo()
  const { concierge } = conciergeScope(state)
  const navigate = useNavigate()
  const allowedSectors = concierge?.sectors ?? []
  const [sector, setSector] = useState<Sector>(allowedSectors[0] ?? 'sante')

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!concierge || !allowedSectors.includes(sector)) return
    const data = new FormData(event.currentTarget)
    const id = `org-conc-${Date.now()}`
    dispatch({ type: 'CONCIERGE_ADD_ORG', conciergeId: concierge.id, org: {
      id, name: String(data.get('name')), sector, city: String(data.get('city')), kind: String(data.get('kind')), size: String(data.get('size')),
      contactName: String(data.get('contactName')), contactRole: String(data.get('contactRole')), contactEmail: String(data.get('contactEmail')), contactPhone: String(data.get('contactPhone')),
      onboardedAt: null, createdAt: new Date().toISOString(), tags: ['Apport concierge'], notes: 'Nouvelle entreprise à accueillir et qualifier avec le concierge.',
    } })
    navigate({ to: '/concierge/entreprises' as any })
  }

  return <div className="container-app py-8"><Link to={'/concierge/entreprises' as any} className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-ink-500"><ArrowLeft size={14}/> Entreprises suivies</Link><SectionHeading eyebrow="Nouvelle relation client" title="Créer une fiche de suivi" description="Enregistrez le contact principal et le secteur. Le diagnostic de départ servira à comprendre ses besoins avant toute proposition."/><Card className="mt-6 max-w-3xl p-6"><form onSubmit={submit} className="grid gap-5 md:grid-cols-2"><Field label="Nom de l’entreprise" required><Input name="name" required/></Field><Field label="Secteur autorisé" required><Select value={sector} onChange={(event) => setSector(event.target.value as Sector)}>{allowedSectors.map((value) => <option key={value} value={value}>{SECTOR_LABEL[value]}</option>)}</Select></Field><Field label="Type de structure" required><Input name="kind" placeholder="Cabinet, école, hôtel…" required/></Field><Field label="Ville" required><Input name="city" required/></Field><Field label="Taille / activité"><Input name="size" placeholder="Effectif, capacité…"/></Field><Field label="Nom du contact dirigeant" required><Input name="contactName" required/></Field><Field label="Fonction"><Input name="contactRole" placeholder="Dirigeant, directrice…"/></Field><Field label="E-mail professionnel"><Input name="contactEmail" type="email"/></Field><Field label="Téléphone"><Input name="contactPhone" type="tel"/></Field><div className="md:col-span-2 flex justify-end"><Button type="submit"><PlusCircle size={16}/> Créer la fiche</Button></div></form></Card></div>
}
