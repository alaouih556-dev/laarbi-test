import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowRight, CalendarClock, Check, CircleAlert, CircleCheck, Clock3, FileCheck2, MessageCircle, Play, RotateCcw } from 'lucide-react'
import { useDemo } from '@/store/store'
import { PageHeader } from '@/components/layouts'
import { Alert, Badge, Button, Card, CardBody, CardHeader, Progress, Stat, Tabs } from '@/components/ui'
import { DELIVERABLE_STATUS, MILESTONE_STATUS, MISSION_STATUS } from '@/lib/status'
import { dateTime, daysUntil, longDate, money, relative } from '@/lib/format'
import { byId, percentage } from '@/lib/utils'
import { DEMO_NOW } from '@/data/demo'
import type { DeliverableStatus, MilestoneStatus } from '@/types'

export const Route = createFileRoute('/admin/missions/')({ component: AdminMissions, head: () => ({ meta: [{ title: 'Missions — ALLNEEDS' }] }) })

type MissionAction={level:'urgent'|'waiting'|'next'|'clear';title:string;detail:string;label:string;run:()=>void}

export function AdminMissions() {
  const {state,dispatch}=useDemo()
  const [filter,setFilter]=useState('ouvertes')
  const now=new Date(DEMO_NOW).getTime()
  const open=state.missions.filter(m=>m.status!=='terminee')
  const visible=state.missions.filter(m=>filter==='toutes'?true:filter==='ouvertes'?m.status!=='terminee':m.status==='terminee')
  const reviews=state.deliverables.filter(d=>d.status==='en_relecture').length
  const reworks=state.deliverables.filter(d=>d.status==='retouche').length
  const lateMissions=open.filter(m=>m.milestones.some(ms=>ms.status!=='fait'&&daysUntil(ms.dueAt,now)<0))
  const contracted=open.reduce((sum,m)=>sum+m.price,0)

  const getAction=(mission:typeof state.missions[number]):MissionAction=>{
    const deliverables=state.deliverables.filter(d=>d.missionId===mission.id)
    const meetings=state.meetings.filter(m=>m.missionId===mission.id)
    const overdue=mission.milestones.filter(ms=>ms.status!=='fait'&&daysUntil(ms.dueAt,now)<0).sort((a,b)=>a.dueAt.localeCompare(b.dueAt))[0]
    if(overdue)return {level:'urgent',title:`Jalon en retard : ${overdue.title}`,detail:`Échéance ${longDate(overdue.dueAt)}. Replanifiez avec le client et indiquez un nouveau délai réaliste.`,label:'Reprendre le jalon',run:()=>dispatch({type:'MILESTONE_SET_STATUS',missionId:mission.id,milestoneId:overdue.id,status:'en_cours'})}
    const retouch=deliverables.find(d=>d.status==='retouche')
    if(retouch)return {level:'urgent',title:`Retouche à traiter : ${retouch.title}`,detail:`Retour client reçu · version ${retouch.version}/${retouch.maxVersions}. Réaffectez le travail et convenez de la date de retour.`,label:'Reprendre la production',run:()=>dispatch({type:'DELIVERABLE_SET_STATUS',id:retouch.id,status:'en_attente'})}
    const review=deliverables.find(d=>d.status==='en_relecture')
    if(review)return {level:'waiting',title:`Décision client attendue : ${review.title}`,detail:`Le livrable est en relecture depuis ${relative(review.updatedAt,now)}. Vérifiez que le client sait quoi valider et avant quelle date.`,label:'Ouvrir le suivi client',run:()=>dispatch({type:'TOAST_ADD',toast:{title:'À suivre avec le client',description:`Demander la validation ou les retours sur « ${review.title} ».`,tone:'info'}})}
    const awaiting=deliverables.find(d=>d.status==='en_attente')
    if(awaiting)return {level:'next',title:`Préparer le prochain livrable : ${awaiting.title}`,detail:`Livrable ${awaiting.type.toLowerCase()} attendu · propriétaire : ${awaiting.owner}. Vérifiez son périmètre avant envoi.`,label:'Soumettre au client',run:()=>dispatch({type:'DELIVERABLE_SET_STATUS',id:awaiting.id,status:'en_relecture'})}
    const proposedMeeting=meetings.find(m=>m.status==='propose')
    if(proposedMeeting)return {level:'waiting',title:`Confirmer le rendez-vous : ${proposedMeeting.title}`,detail:`${dateTime(proposedMeeting.at)} · ${proposedMeeting.location}.`,label:'Confirmer le créneau',run:()=>dispatch({type:'MEETING_SET_STATUS',id:proposedMeeting.id,status:'confirme'})}
    const nextMilestone=mission.milestones.filter(ms=>ms.status!=='fait').sort((a,b)=>a.dueAt.localeCompare(b.dueAt))[0]
    if(nextMilestone){const late=daysUntil(nextMilestone.dueAt,now)<=3;return {level:late?'waiting':'next',title:`Prochain jalon : ${nextMilestone.title}`,detail:`Échéance ${longDate(nextMilestone.dueAt)}. Responsable mission : ${mission.owner}.`,label:nextMilestone.status==='en_cours'?'Marquer le jalon livré':'Démarrer le jalon',run:()=>dispatch({type:'MILESTONE_SET_STATUS',missionId:mission.id,milestoneId:nextMilestone.id,status:nextMilestone.status==='en_cours'?'fait':'en_cours'})}}
    const allValidated=deliverables.every(d=>d.status==='valide')
    if(allValidated&&mission.status!=='terminee')return {level:'clear',title:'Livraison vérifiée : préparer la clôture et le bilan',detail:'Tous les jalons sont terminés et tous les livrables sont validés. Fermez la mission après le bilan client.',label:'Clôturer après le bilan',run:()=>dispatch({type:'MISSION_SET_STATUS',id:mission.id,status:'terminee'})}
    return {level:'clear',title:'Aucun blocage détecté',detail:'Les jalons et livrables sont à jour. Le prochain rendez-vous se planifie avec le client.',label:'Aucun blocage',run:()=>{}}
  }

  const priority=useMemo(()=>open.map(m=>({mission:m,action:getAction(m)})).sort((a,b)=>({urgent:0,waiting:1,next:2,clear:3}[a.action.level]-{urgent:0,waiting:1,next:2,clear:3}[b.action.level])),[open,state.deliverables,state.meetings,state.orgs])
  const prioritized=priority.filter(item=>item.action.level!=='clear')
  function scrollToMission(id:string){document.getElementById(`mission-${id}`)?.scrollIntoView({behavior:'smooth',block:'start'})}

  return <>
    <PageHeader eyebrow="Production · valeur livrée" title="Pilotage des missions" description="Tenez les engagements client : voyez les retards, obtenez les validations, pilotez les livrables et clôturez après le bilan."/>

    <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Stat label="Missions à piloter" value={open.length} hint={`${lateMissions.length} avec au moins un jalon en retard`} tone={lateMissions.length?'warning':'brand'}/><Stat label="Honoraires contractualisés" value={money(contracted)} hint="Montant des missions ouvertes · hors coûts prestataires" tone="success"/><Stat label="Retours client attendus" value={reviews} hint="Livrables transmis à valider" tone={reviews?'warning':'info'}/><Stat label="Retouches à reprendre" value={reworks} hint="Livrables renvoyés par le client" tone={reworks?'danger':'success'}/></div>

    {prioritized.length?<Card className="mb-6 overflow-hidden"><CardHeader title="À traiter maintenant" description="Actions classées par risque de retard et attente client." action={<Badge tone={lateMissions.length?'danger':'warning'}>{prioritized.length} actions ouvertes</Badge>}/><div className="divide-y divide-ink-100">{prioritized.slice(0,4).map(({mission,action})=><article key={mission.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4"><div className="flex min-w-0 items-start gap-3"><span className={`mt-0.5 rounded-lg p-2 ${action.level==='urgent'?'bg-red-50 text-red-700':action.level==='waiting'?'bg-amber-50 text-amber-700':'bg-sky-50 text-sky-700'}`}>{action.level==='urgent'?<CircleAlert size={17}/>:action.level==='waiting'?<Clock3 size={17}/>:<CalendarClock size={17}/>}</span><div className="min-w-0"><p className="text-xs font-semibold text-ink-500">{byId(state.orgs,mission.orgId)?.name} · {mission.ref}</p><p className="mt-1 font-semibold text-ink-950">{action.title}</p><p className="mt-1 text-xs text-ink-600">{action.detail}</p></div></div><div className="flex shrink-0 gap-2"><Button size="sm" variant="outline" onClick={()=>scrollToMission(mission.id)}>Voir la mission</Button><Button size="sm" onClick={action.run}>{action.label}</Button></div></article>)}</div></Card>:<Alert tone="success" className="mb-6" title="Toutes les missions sont à jour">Aucun jalon en retard ni décision client en attente détecté.</Alert>}

    <div className="mb-5"><Tabs value={filter} onChange={setFilter} tabs={[{value:'ouvertes',label:'En cours',count:open.length},{value:'terminee',label:'Terminées',count:state.missions.filter(m=>m.status==='terminee').length},{value:'toutes',label:'Toutes',count:state.missions.length}]}/></div>

    <div className="space-y-5">{visible.map(mission=>{
      const org=byId(state.orgs,mission.orgId)
      const deliverables=state.deliverables.filter(d=>d.missionId===mission.id)
      const meetings=state.meetings.filter(meeting=>meeting.missionId===mission.id).sort((a,b)=>a.at.localeCompare(b.at))
      const doneMilestones=mission.milestones.filter(ms=>ms.status==='fait').length
      const doneDeliverables=deliverables.filter(d=>d.status==='valide').length
      const missionAction=getAction(mission)
      const milestoneProgress=percentage(doneMilestones,mission.milestones.length)
      return <Card id={`mission-${mission.id}`} key={mission.id} className="scroll-mt-24 overflow-hidden"><header className="flex flex-wrap items-start justify-between gap-4 border-b border-ink-100 px-5 py-5"><div><div className="flex flex-wrap items-center gap-2"><span className="font-mono text-xs font-bold tracking-wide text-brand-700">{mission.ref}</span><Badge tone={MISSION_STATUS[mission.status].tone}>{MISSION_STATUS[mission.status].label}</Badge></div><h2 className="mt-2 text-xl font-bold text-ink-950">{mission.title}</h2><p className="mt-1 text-sm text-ink-600">{org?.name} · pilote {mission.owner} · échéance cible {longDate(mission.targetEnd)}</p></div><div className="rounded-xl bg-ink-50 px-4 py-3 text-right"><span className="block text-xs text-ink-500">Honoraires contractualisés</span><strong className="font-display text-xl text-ink-950">{money(mission.price)}</strong><span className="block text-[.65rem] text-ink-500">HT · hors coûts prestataires</span></div></header>

        <CardBody className="space-y-5"><section className={`rounded-xl border p-4 ${missionAction.level==='urgent'?'border-red-200 bg-red-50/60':missionAction.level==='waiting'?'border-amber-200 bg-amber-50/60':missionAction.level==='next'?'border-sky-100 bg-sky-50/50':'border-emerald-100 bg-emerald-50/50'}`}><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-start gap-3"><span className="mt-0.5">{missionAction.level==='urgent'?<CircleAlert className="text-red-700" size={19}/>:missionAction.level==='clear'?<CircleCheck className="text-emerald-700" size={19}/>:<Clock3 className="text-amber-700" size={19}/>}</span><div><p className="text-xs font-bold uppercase tracking-wider text-ink-500">Prochaine décision utile</p><h3 className="mt-1 font-semibold text-ink-950">{missionAction.title}</h3><p className="mt-1 text-sm text-ink-700">{missionAction.detail}</p></div></div>{mission.status!=='terminee'?<Button size="sm" onClick={missionAction.run}>{missionAction.label}<ArrowRight size={14}/></Button>:<Badge tone="success">Mission clôturée</Badge>}</div></section>

        <div className="grid gap-6 xl:grid-cols-[.9fr_1.1fr]"><section><div className="flex items-end justify-between gap-2"><div><p className="text-sm font-semibold text-ink-900">Jalons contractuels</p><p className="mt-1 text-xs text-ink-500">{doneMilestones}/{mission.milestones.length} terminés · progression calculée sur les jalons, pas estimée.</p></div><strong className="text-sm tabular-nums text-ink-900">{milestoneProgress} %</strong></div><Progress value={milestoneProgress} className="mt-3"/><ol className="mt-4 space-y-2">{mission.milestones.map((milestone,index)=>{const left=daysUntil(milestone.dueAt,now);const overdue=milestone.status!=='fait'&&left<0;const nextStatus:MilestoneStatus=milestone.status==='fait'?'en_cours':milestone.status==='bloque'?'en_cours':milestone.status==='a_venir'?'en_cours':'fait';return <li key={milestone.id} className={`flex items-center gap-3 rounded-xl border p-3 ${overdue?'border-red-200 bg-red-50/40':'border-ink-100'}`}><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${milestone.status==='fait'?'bg-emerald-100 text-emerald-800':overdue?'bg-red-100 text-red-800':'bg-ink-100 text-ink-700'}`}>{milestone.status==='fait'?<Check size={15}/>:String(index+1).padStart(2,'0')}</span><div className="min-w-0 flex-1"><p className={`text-sm font-semibold ${milestone.status==='fait'?'text-ink-400 line-through':'text-ink-900'}`}>{milestone.title}</p><p className={`mt-0.5 text-xs ${overdue?'font-semibold text-red-700':'text-ink-500'}`}>{overdue?`En retard de ${Math.abs(left)} j`:milestone.status==='fait'?'Réalisé':`Échéance ${longDate(milestone.dueAt)}`}</p></div><Badge tone={MILESTONE_STATUS[milestone.status].tone}>{MILESTONE_STATUS[milestone.status].label}</Badge>{milestone.status!=='fait'?<Button size="sm" variant="outline" onClick={()=>dispatch({type:'MILESTONE_SET_STATUS',missionId:mission.id,milestoneId:milestone.id,status:nextStatus})}>{milestone.status==='en_cours'?'Terminer':'Démarrer'}</Button>:null}</li>})}</ol>

        <details className="mt-4 rounded-xl border border-ink-100"><summary className="cursor-pointer px-4 py-3 text-sm font-semibold">Périmètre convenu · {mission.scope.length} inclus · {mission.outOfScope.length} hors périmètre</summary><div className="grid gap-4 border-t border-ink-100 p-4 sm:grid-cols-2"><div><p className="text-xs font-bold uppercase text-emerald-700">Inclus</p><ul className="mt-2 space-y-1 text-sm text-ink-700">{mission.scope.map(item=><li key={item}>✓ {item}</li>)}</ul></div><div><p className="text-xs font-bold uppercase text-ink-500">Hors périmètre</p><ul className="mt-2 space-y-1 text-sm text-ink-600">{mission.outOfScope.map(item=><li key={item}>· {item}</li>)}</ul></div></div></details></section>

        <section><div className="flex items-end justify-between gap-2"><div><p className="text-sm font-semibold text-ink-900">Livrables & décisions client</p><p className="mt-1 text-xs text-ink-500">{doneDeliverables}/{deliverables.length} validés explicitement par le client</p></div><Badge tone={doneDeliverables===deliverables.length?'success':'warning'}>{deliverables.filter(d=>d.status==='en_relecture').length} en attente de retour</Badge></div><div className="mt-3 space-y-2">{deliverables.map(item=>{const status=DELIVERABLE_STATUS[item.status];return <article key={item.id} className="rounded-xl border border-ink-100 p-3"><div className="flex flex-wrap items-start justify-between gap-2"><div><p className="font-semibold text-ink-900">{item.title}</p><p className="mt-1 text-xs text-ink-500">{item.type} · v{item.version}/{item.maxVersions} · responsable {item.owner} · actualisé {relative(item.updatedAt,now)}</p></div><Badge tone={status.tone}>{status.label}</Badge></div>{item.status==='en_attente'?<Button className="mt-3" size="sm" variant="outline" onClick={()=>dispatch({type:'DELIVERABLE_SET_STATUS',id:item.id,status:'en_relecture' as DeliverableStatus})}><FileCheck2 size={14}/>Transmettre au client pour validation</Button>:item.status==='en_relecture'?<p className="mt-2 flex items-center gap-1.5 text-xs text-amber-800"><MessageCircle size={13}/>Attendre son accord explicite ou recueillir une demande de retouche.</p>:item.status==='retouche'?<Button className="mt-3" size="sm" variant="outline" onClick={()=>dispatch({type:'DELIVERABLE_SET_STATUS',id:item.id,status:'en_attente' as DeliverableStatus})}><RotateCcw size={14}/>Reprendre la production</Button>:<p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-800"><Check size={13}/>Validation client enregistrée.</p>}</article>})}{deliverables.length===0?<p className="rounded-xl bg-ink-50 p-4 text-sm text-ink-600">Aucun livrable n’est encore associé. Vérifiez le périmètre avant de lancer la production.</p>:null}</div>

        <details className="mt-4 rounded-xl border border-ink-100"><summary className="cursor-pointer px-4 py-3 text-sm font-semibold">Rendez-vous de pilotage · {meetings.length}</summary><div className="divide-y divide-ink-100 border-t border-ink-100">{meetings.map(meeting=><article key={meeting.id} className="flex flex-wrap items-center justify-between gap-3 p-3"><div><p className="text-sm font-semibold">{meeting.title}</p><p className="mt-1 text-xs text-ink-500">{dateTime(meeting.at)} · {meeting.location} · {meeting.status==='propose'?'proposé':'confirmé'}</p></div>{meeting.status==='propose'?<Button size="sm" variant="outline" onClick={()=>dispatch({type:'MEETING_SET_STATUS',id:meeting.id,status:'confirme'})}>Confirmer</Button>:null}</article>)}{!meetings.length?<p className="p-3 text-sm text-ink-500">Aucun rendez-vous lié pour le moment.</p>:null}</div></details>
        </section></div>

      </CardBody></Card>
    })}{visible.length===0?<Card className="p-8 text-center"><p className="font-semibold text-ink-900">Aucune mission dans cette vue.</p></Card>:null}</div>

    <p className="mt-5 text-xs text-ink-400">Les montants affichés sont les honoraires enregistrés sur les missions. Le coût prestataire, la marge, les factures et les encaissements ne sont pas modélisés dans ces données de démonstration.</p>
  </>
}
