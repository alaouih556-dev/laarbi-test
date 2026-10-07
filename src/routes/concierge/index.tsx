import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Building2, CircleAlert, Clock3, MapPin, PlusCircle } from 'lucide-react'
import { Badge, Button, Card, SectionHeading } from '@/components/ui'
import { SECTOR_LABEL } from '@/data/catalog'
import { conciergeScope, useDemo } from '@/store/store'
import { ActivityPulse } from '@/components/ActivityPulse'

export const Route = createFileRoute('/concierge/')({ component: ConciergeDashboard })

function ConciergeDashboard() {
  const { state } = useDemo()
  const { concierge, orgs } = conciergeScope(state)
  const portfolio = orgs.map((org) => {
    const needs = state.needs.filter((item) => item.orgId === org.id && !['signe', 'clos'].includes(item.status))
    const urgentNeed = needs.find((item) => item.urgency === 'haute')
    const blocked = state.missions.find((mission) => mission.orgId === org.id && mission.milestones.some((milestone) => milestone.status === 'bloque'))
    const review = state.diagnostics.find((item) => item.orgId === org.id && item.status === 'en_revue')
    const pendingDocs = state.documents.filter((item) => item.orgId === org.id && item.required && item.status !== 'valide')
    const openMissions = state.missions.filter((item) => item.orgId === org.id && item.status !== 'terminee')
    const next = urgentNeed
      ? { label: 'Urgent', text: `Relancer « ${urgentNeed.title} »`, detail: 'Un besoin est déclaré urgent.', tone: 'danger' as const, rank: 100 }
      : blocked
        ? { label: 'Bloqué', text: 'Débloquer une étape de mission', detail: blocked.title, tone: 'warning' as const, rank: 95 }
        : review
          ? { label: 'À traiter', text: 'Relire un diagnostic', detail: `Diagnostic ${review.ref} en attente.`, tone: 'warning' as const, rank: 90 }
          : pendingDocs.length
            ? { label: 'À relancer', text: `Récupérer ${pendingDocs.length} pièce${pendingDocs.length > 1 ? 's' : ''} requise${pendingDocs.length > 1 ? 's' : ''}`, detail: pendingDocs.slice(0, 2).map((document) => document.name).join(' · '), tone: 'warning' as const, rank: 80 }
            : needs.length
              ? { label: 'Suivi', text: `${needs.length} besoin${needs.length > 1 ? 's' : ''} ouvert${needs.length > 1 ? 's' : ''}`, detail: needs[0].title, tone: 'brand' as const, rank: 60 }
              : openMissions.length
                ? { label: 'En cours', text: `${openMissions.length} mission${openMissions.length > 1 ? 's' : ''} à suivre`, detail: openMissions[0].title, tone: 'brand' as const, rank: 40 }
                : { label: 'À jour', text: 'Aucune relance prioritaire', detail: 'Aucun blocage repéré dans les dossiers.', tone: 'success' as const, rank: 10 }
    return { org, needs, openMissions, next }
  }).sort((a, b) => b.next.rank - a.next.rank)
  const urgentCount = portfolio.filter((item) => item.next.rank >= 95).length
  const attentionCount = portfolio.filter((item) => item.next.rank >= 60 && item.next.rank < 95).length

  return <div className="container-app py-8 concierge-portfolio-page">
    <div className="flex flex-wrap items-end justify-between gap-4"><SectionHeading eyebrow="Espace concierge" title="Votre journée, entreprise par entreprise." description="Traitez d’abord les urgences et les blocages. Le reste de votre portefeuille vient ensuite."/><Link to={'/concierge/entreprises' as any}><Button><PlusCircle className="h-4 w-4"/> Ajouter une entreprise</Button></Link></div>
    <div className="concierge-day-summary"><article className="is-urgent"><span><CircleAlert size={18}/></span><div><strong>{urgentCount}</strong><small>urgente{urgentCount === 1 ? '' : 's'}</small></div></article><article><span><Clock3 size={18}/></span><div><strong>{attentionCount}</strong><small>à faire avancer</small></div></article><article><span><Building2 size={18}/></span><div><strong>{orgs.length}</strong><small>entreprise{orgs.length === 1 ? '' : 's'} au portefeuille</small></div></article><div className="concierge-sector-tags">{(concierge?.sectors ?? []).map((sector) => <Badge key={sector}>{SECTOR_LABEL[sector]}</Badge>)}</div></div>
    <div className="concierge-queue-heading"><div><small>ORDRE DE SUIVI CONSEILLÉ</small><h2>Par quoi commencer</h2></div><span>Les dossiers urgents remontent en premier</span></div>
    <div className="concierge-portfolio-list">{portfolio.map(({ org, next, needs, openMissions }, index) => <Card key={org.id} className="concierge-portfolio-card"><div className={`concierge-portfolio-rank ${next.rank >= 95 ? 'is-urgent' : ''}`}>{String(index + 1).padStart(2, '0')}</div><div className="concierge-portfolio-company"><div className="concierge-portfolio-name"><h3>{org.name}</h3><Badge>{SECTOR_LABEL[org.sector]}</Badge></div><p><MapPin size={13}/>{org.city} · {org.contactName}</p><div className="concierge-portfolio-mini"><span>{needs.length} besoin{needs.length === 1 ? '' : 's'}</span><span>{openMissions.length} mission{openMissions.length === 1 ? '' : 's'}</span></div></div><div className="concierge-portfolio-next"><Badge tone={next.tone}>{next.label}</Badge><strong>{next.text}</strong><small>{next.detail}</small></div><Link to={'/concierge/entreprises/$id' as any} params={{ id: org.id } as any}>Ouvrir le suivi <ArrowRight size={15}/></Link></Card>)}</div>
    <ActivityPulse activities={state.activities} orgIds={new Set(orgs.map((org) => org.id))} title="Votre travail fait avancer ces entreprises" href="/concierge/diagnostics" />
    {!portfolio.length ? <Card className="mt-6 p-8 text-center"><Building2 className="mx-auto h-6 w-6 text-ink-400"/><p className="mt-3 font-semibold text-ink-900">Votre portefeuille est vide</p><p className="mt-1 text-sm text-ink-500">Une entreprise apparaîtra ici dès qu’elle vous sera attribuée.</p><Link to={'/concierge/entreprises' as any} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-700">Ajouter une entreprise <ArrowRight size={14}/></Link></Card> : null}
  </div>
}
