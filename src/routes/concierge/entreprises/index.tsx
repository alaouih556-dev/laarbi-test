import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Building2, CircleAlert, MapPin, Plus } from 'lucide-react'
import { ConciergeGuard } from '@/features/concierge/ScopedSection'
import { conciergeScope, useDemo } from '@/store/store'
import { Badge, Button, Card } from '@/components/ui'
import { SECTOR_LABEL } from '@/data/catalog'

export const Route = createFileRoute('/concierge/entreprises/')({ component: ConciergeCompanies })

function ConciergeCompanies() {
  const { state } = useDemo()
  const { orgs } = conciergeScope(state)
  return <ConciergeGuard><div className="container-app py-8 concierge-company-list-page">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Votre relation client</p><h1 className="mt-2 font-display text-3xl font-bold text-ink-950">Entreprises que vous accompagnez</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-600">Une fiche par client : priorité à traiter, contact dirigeant et historique utile pour garder le fil.</p></div><Link to={'/concierge/entreprises/nouvelle' as any}><Button><Plus size={16}/> Ajouter une entreprise</Button></Link></div>
    <div className="concierge-company-roster">{orgs.map((org) => {
      const needs = state.needs.filter((need) => need.orgId === org.id && !['signe', 'clos'].includes(need.status))
      const missions = state.missions.filter((mission) => mission.orgId === org.id && mission.status !== 'terminee')
      const diagnostics = state.diagnostics.filter((diagnostic) => diagnostic.orgId === org.id && diagnostic.status !== 'publie')
      const urgent = needs.filter((need) => need.urgency === 'haute').length
      const action = urgent ? `${urgent} besoin${urgent > 1 ? 's' : ''} urgent${urgent > 1 ? 's' : ''} à faire avancer` : diagnostics.length ? 'Diagnostic à restituer' : missions.length ? `${missions.length} mission${missions.length > 1 ? 's' : ''} à suivre` : 'Relation à entretenir'
      return <Card key={org.id} className="concierge-roster-card"><div className="concierge-roster-icon"><Building2 size={19}/></div><div className="concierge-roster-main"><div className="concierge-roster-title"><h2>{org.name}</h2><Badge>{SECTOR_LABEL[org.sector]}</Badge></div><p><MapPin size={13}/>{org.city} · {org.contactName} · {org.contactRole}</p><div className="concierge-roster-focus">{urgent ? <CircleAlert size={14}/> : <ArrowRight size={14}/>}<strong>{action}</strong></div><div className="concierge-roster-counts"><span>{needs.length} besoins ouverts</span><span>{missions.length} missions</span><span>{state.commercialOpportunities.filter((item) => item.orgId === org.id && !['acceptee', 'refusee'].includes(item.status)).length} pistes commerciales</span></div></div><Link to={'/concierge/entreprises/$id' as any} params={{ id: org.id } as any}>Ouvrir le suivi <ArrowRight size={15}/></Link></Card>
    })}{!orgs.length ? <Card className="p-8 text-center"><Building2 className="mx-auto h-7 w-7 text-ink-400"/><h2 className="mt-3 font-semibold text-ink-900">Aucune entreprise dans votre portefeuille</h2><p className="mt-1 text-sm text-ink-500">Ajoutez un client après accord et créez sa première fiche de suivi.</p><Link to={'/concierge/entreprises/nouvelle' as any} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand-700">Créer une fiche <ArrowRight size={14}/></Link></Card> : null}</div>
  </div></ConciergeGuard>
}
