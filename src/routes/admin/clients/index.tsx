import { useMemo, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Building2, CalendarClock, CircleAlert, FileText, Search, UserRoundCheck } from 'lucide-react'
import { useDemo } from '@/store/store'
import { PageHeader } from '@/components/layouts'
import { Badge, Button, Card, Input, Stat, Tabs } from '@/components/ui'
import { SECTOR_LABEL } from '@/data/catalog'
import { longDate, money, relative, daysUntil } from '@/lib/format'
import { DEMO_NOW } from '@/data/demo'

export const Route = createFileRoute('/admin/clients/')({ component: AdminClients, head: () => ({ meta: [{ title: 'Clients — ALLNEEDS' }] }) })

type Action = { title:string; detail:string; destination:'/admin/clients/$id'|'/admin/besoins/'|'/admin/missions/'; label:string; level:'urgent'|'waiting'|'normal'|'clear'; rank:number }

export function AdminClients() {
  const {state}=useDemo()
  const now=new Date(DEMO_NOW).getTime()
  const [query,setQuery]=useState('')
  const [filter,setFilter]=useState('tous')

  const clients=useMemo(()=>state.orgs.filter(org=>filter==='tous'||org.sector===filter).filter(org=>!query.trim()||`${org.name} ${org.city} ${org.contactName} ${org.kind}`.toLowerCase().includes(query.toLowerCase())).map(org=>{
    const needs=state.needs.filter(need=>need.orgId===org.id)
    const activeNeeds=needs.filter(need=>!['signe','clos'].includes(need.status))
    const missions=state.missions.filter(mission=>mission.orgId===org.id)
    const activeMissions=missions.filter(mission=>mission.status!=='terminee')
    const documents=state.documents.filter(document=>document.orgId===org.id&&document.status==='demande')
    const quotes=state.quotes.filter(quote=>needs.some(need=>need.id===quote.needId)&&['recu','en_etude'].includes(quote.status))
    const overdue=activeMissions.flatMap(mission=>mission.milestones.filter(milestone=>milestone.status!=='fait'&&daysUntil(milestone.dueAt,now)<0).map(milestone=>({mission,milestone}))).sort((a,b)=>a.milestone.dueAt.localeCompare(b.milestone.dueAt))[0]
    const retouch=state.deliverables.find(item=>activeMissions.some(mission=>mission.id===item.missionId)&&item.status==='retouche')
    const review=state.deliverables.find(item=>activeMissions.some(mission=>mission.id===item.missionId)&&item.status==='en_relecture')
    const waitingNeed=activeNeeds.find(need=>need.urgency==='haute'||need.candidateIds.length===0||need.quoteIds.length===0)
    let action:Action
    if(!org.onboardedAt)action={title:'Finaliser l’accueil de ce client',detail:'Vérifiez les accès, le contact décisionnaire et les pièces de démarrage.',destination:'/admin/clients/$id',label:'Compléter le dossier',level:'urgent',rank:0}
    else if(overdue)action={title:`Tenir la promesse : ${overdue.milestone.title}`,detail:`Jalon en retard sur ${overdue.mission.title}. Échéance ${longDate(overdue.milestone.dueAt)}.`,destination:'/admin/missions/',label:'Piloter la mission',level:'urgent',rank:1}
    else if(retouch)action={title:`Reprendre la retouche : ${retouch.title}`,detail:`Retour client à traiter · version ${retouch.version}/${retouch.maxVersions}.`,destination:'/admin/missions/',label:'Voir les livrables',level:'urgent',rank:1}
    else if(quotes.length)action={title:'Obtenir une décision sur un devis',detail:`${quotes.length} devis reçus ou à l’étude pour les besoins de cet établissement.`,destination:'/admin/besoins/',label:'Comparer les devis',level:'waiting',rank:2}
    else if(review)action={title:`Attendre le retour sur « ${review.title} »`,detail:`Livrable transmis au client ${relative(review.updatedAt,now)}. Vérifiez le délai de validation.`,destination:'/admin/missions/',label:'Suivre la livraison',level:'waiting',rank:2}
    else if(waitingNeed)action={title:`Débloquer le besoin : ${waitingNeed.title}`,detail:`${waitingNeed.candidateIds.length} prestataire(s) proposé(s) · ${waitingNeed.quoteIds.length} devis · responsable ${waitingNeed.assignedTo}.`,destination:'/admin/besoins/',label:'Faire avancer le besoin',level:waitingNeed.urgency==='haute'?'urgent':'waiting',rank:waitingNeed.urgency==='haute'?1:3}
    else if(documents.length)action={title:`Obtenir ${documents.length} pièce(s) requise(s)`,detail:documents.slice(0,2).map(document=>document.name).join(' · '),destination:'/admin/clients/$id',label:'Voir le dossier',level:'waiting',rank:3}
    else if(activeMissions.length){const mission=activeMissions[0];const next=mission.milestones.filter(item=>item.status!=='fait').sort((a,b)=>a.dueAt.localeCompare(b.dueAt))[0];action=next?{title:`Prochain jalon : ${next.title}`,detail:`${mission.title} · prévu le ${longDate(next.dueAt)} · responsable ${mission.owner}.`,destination:'/admin/missions/',label:'Voir le pilotage',level:'normal',rank:4}:{title:'Préparer le prochain point de pilotage',detail:`${mission.title} · confortez l’avancement et la prochaine échéance avec le client.`,destination:'/admin/missions/',label:'Voir la mission',level:'normal',rank:4}}
    else action={title:'Aucune action bloquante identifiée',detail:'Compte à suivre : vérifiez le prochain besoin exprimé et le bilan de la dernière prestation.',destination:'/admin/clients/$id',label:'Ouvrir le compte',level:'clear',rank:5}
    const lastActivity=[...needs.map(n=>n.submittedAt),...missions.map(m=>m.startedAt),...state.diagnostics.filter(d=>d.orgId===org.id).map(d=>d.createdAt)].sort().reverse()[0]
    const contracted=missions.reduce((sum,mission)=>sum+mission.price,0)
    return {org,needs,activeNeeds,missions,activeMissions,documents,action,lastActivity,contracted}
  }).sort((a,b)=>a.action.rank-b.action.rank||(b.lastActivity??'').localeCompare(a.lastActivity??'')),[state.orgs,state.needs,state.missions,state.documents,state.quotes,state.deliverables,state.diagnostics,query,filter,now])

  const ranked=clients.filter(client=>client.action.level==='urgent'||client.action.level==='waiting').length
  const needsAtRisk=state.needs.filter(need=>!['signe','clos'].includes(need.status)&&(need.urgency==='haute'||need.candidateIds.length===0||need.quoteIds.length===0)).length
  const lateMilestones=state.missions.filter(m=>m.status!=='terminee').reduce((count,mission)=>count+mission.milestones.filter(ms=>ms.status!=='fait'&&daysUntil(ms.dueAt,now)<0).length,0)
  const contracted=state.missions.reduce((sum,mission)=>sum+mission.price,0)

  return <>
    <PageHeader eyebrow="Portefeuille · décisions client" title="Clients & engagements" description="Par compte, repérez ce qui attend une décision, un livrable ou une action de l’équipe. Traitez d’abord les situations à risque."/>
    <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Stat label="Comptes à traiter" value={ranked} hint="Besoin, mission ou dossier en attente" tone={ranked?'warning':'success'}/><Stat label="Besoins à débloquer" value={needsAtRisk} hint="Sans devis, sans prestataire ou prioritaires" tone={needsAtRisk?'danger':'info'}/><Stat label="Jalons en retard" value={lateMilestones} hint="Engagements à replanifier avec le client" tone={lateMilestones?'danger':'success'}/><Stat label="Honoraires contractualisés" value={money(contracted)} hint="Montant des missions · hors coûts prestataires" tone="brand"/></div>

    <Card className="mb-4 p-4"><div className="relative"><Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"/><Input aria-label="Rechercher dans le portefeuille" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Établissement, ville ou interlocuteur…" className="pl-10"/></div></Card>
    <div className="mb-5"><Tabs value={filter} onChange={setFilter} tabs={[{value:'tous',label:'Tous les comptes',count:state.orgs.length},{value:'enseignement',label:'Enseignement',count:state.orgs.filter(o=>o.sector==='enseignement').length},{value:'sante',label:'Santé',count:state.orgs.filter(o=>o.sector==='sante').length},{value:'tourisme',label:'Tourisme',count:state.orgs.filter(o=>o.sector==='tourisme').length}]}/></div>

    <div className="space-y-4">{clients.map(({org,needs,activeNeeds,missions,activeMissions,documents,action,lastActivity,contracted:clientValue})=>{
      const accent=action.level==='urgent'?'border-l-red-500':action.level==='waiting'?'border-l-amber-400':action.level==='normal'?'border-l-sky-400':'border-l-emerald-400'
      const tone=action.level==='urgent'?'danger':action.level==='waiting'?'warning':action.level==='normal'?'info':'success'
      return <Card key={org.id} className={`overflow-hidden border-l-4 ${accent}`}><div className="grid gap-5 p-5 xl:grid-cols-[minmax(250px,1fr)_minmax(320px,1.2fr)_auto]"><div className="min-w-0"><div className="flex items-center gap-3"><span className="rounded-xl bg-ink-950 p-2.5 text-sand-300"><Building2 size={21}/></span><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><Link to="/admin/clients/$id" params={{id:org.id}} className="text-lg font-bold text-ink-950 hover:text-brand-700">{org.name}</Link><Badge tone={org.onboardedAt?'success':'warning'}>{org.onboardedAt?'Actif':'À accueillir'}</Badge></div><p className="mt-1 text-xs text-ink-600">{SECTOR_LABEL[org.sector]} · {org.city} · {org.kind}</p></div></div><p className="mt-3 flex items-center gap-2 text-sm text-ink-700"><UserRoundCheck size={15}/>{org.contactName} · {org.contactRole}</p><p className="mt-1 text-xs text-ink-500">Client depuis {longDate(org.createdAt)}{lastActivity?` · Activité ${relative(lastActivity,now)}`:''}</p></div>
        <div className={`rounded-xl border p-4 ${action.level==='urgent'?'border-red-100 bg-red-50/60':action.level==='waiting'?'border-amber-100 bg-amber-50/50':action.level==='normal'?'border-sky-100 bg-sky-50/50':'border-emerald-100 bg-emerald-50/50'}`}><div className="flex items-start gap-2"><span className="mt-0.5"><CircleAlert size={17}/></span><div><p className="text-[.65rem] font-bold uppercase tracking-wider text-ink-500">Prochaine action utile</p><p className="mt-1 font-semibold leading-snug text-ink-950">{action.title}</p><p className="mt-1 text-xs leading-relaxed text-ink-700">{action.detail}</p></div></div><Link to={action.destination as any} params={action.destination==='/admin/clients/$id'?{id:org.id}:undefined as any} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-900">{action.label}<ArrowRight size={14}/></Link></div>
        <div className="flex flex-wrap items-center gap-4 xl:flex-col xl:items-end xl:justify-center"><div className="flex gap-4 text-right"><QuickMetric label="Besoins ouverts" value={activeNeeds.length}/><QuickMetric label="Missions en cours" value={activeMissions.length}/><QuickMetric label="Honoraires" value={money(clientValue)}/></div><div className="flex flex-wrap justify-end gap-1.5">{documents.length?<Badge tone="warning"><FileText size={12}/>{documents.length} pièce(s) attendue(s)</Badge>:null}{needs.filter(need=>need.urgency==='haute'&&!['signe','clos'].includes(need.status)).length?<Badge tone="danger">Besoin prioritaire</Badge>:null}</div></div></div><div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 bg-ink-50/60 px-5 py-3"><div className="flex flex-wrap gap-2">{org.tags.slice(0,3).map(tag=><Badge key={tag} tone="neutral">{tag}</Badge>)}{!org.tags.length?<span className="text-xs text-ink-500">Suivi du compte actif</span>:null}</div><span className="text-xs text-ink-500">{needs.length} demandes au total · {missions.length} missions au total · {documents.length?`${documents.length} pièces attendues`:'aucune pièce en attente'}</span></div></Card>
    })}{clients.length===0?<Card className="p-8 text-center"><p className="font-semibold">Aucun compte trouvé</p><p className="mt-1 text-sm text-ink-500">Changez les filtres ou votre recherche.</p></Card>:null}</div>
    <p className="mt-5 text-xs text-ink-400">Les honoraires sont les montants contractuels enregistrés sur les missions. La marge, les factures et les encaissements ne sont pas présents dans les données de démonstration.</p>
  </>
}

function QuickMetric({label,value}:{label:string;value:string|number}){return <div><span className="block text-[.65rem] text-ink-500">{label}</span><strong className="mt-0.5 block text-sm text-ink-950">{value}</strong></div>}
