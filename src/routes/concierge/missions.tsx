import { useMemo, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, CalendarClock, CheckCircle2, CircleAlert, ClipboardCheck, Clock3, FileCheck2, Handshake, PhoneCall, ShieldCheck } from 'lucide-react'
import { ConciergeGuard, ConciergeHeading, OrgIdentity, ScopedEmpty } from '@/features/concierge/ScopedSection'
import { conciergeScope, useDemo } from '@/store/store'
import { Badge, Button, Card, Progress } from '@/components/ui'
import { MILESTONE_STATUS, MISSION_STATUS, LEVER_LABEL } from '@/lib/status'
import { money } from '@/lib/format'

export const Route = createFileRoute('/concierge/missions')({ component: ConciergeMissions })

type MissionFilter = 'a_suivre' | 'blocages' | 'terminees' | 'toutes'

function ConciergeMissions() {
  const { state } = useDemo()
  const { orgIds, orgs } = conciergeScope(state)
  const [filter, setFilter] = useState<MissionFilter>('a_suivre')
  const all = useMemo(() => state.missions.filter((mission) => orgIds.has(mission.orgId)), [state.missions, orgIds])
  const blockedCount = all.filter((mission) => mission.milestones.some((milestone) => milestone.status === 'bloque')).length
  const activeCount = all.filter((mission) => mission.status !== 'terminee').length
  const pendingDeliverables = state.deliverables.filter((deliverable) => all.some((mission) => mission.id === deliverable.missionId) && deliverable.status !== 'valide').length
  const visible = useMemo(() => all.filter((mission) => filter === 'toutes' || filter === 'terminees' && mission.status === 'terminee' || filter === 'blocages' && mission.milestones.some((milestone) => milestone.status === 'bloque') || filter === 'a_suivre' && mission.status !== 'terminee').sort((a, b) => Number(b.milestones.some((milestone) => milestone.status === 'bloque')) - Number(a.milestones.some((milestone) => milestone.status === 'bloque')) || a.targetEnd.localeCompare(b.targetEnd)), [all, filter])

  return <ConciergeGuard><div className="concierge-missions-page">
    <ConciergeHeading eyebrow="Tenir l’engagement client" title="Chaque mission doit aboutir à un résultat suivi." description="Votre rôle : repérer ce qui peut déraper, coordonner le prochain jalon avec l’équipe ALLNEEDS et tenir le client informé jusqu’au bilan."/>

    <section className="concierge-mission-purpose"><div><span><Handshake size={19}/></span><div><small>POUR LE CLIENT</small><strong>Recevoir ce qui a été convenu, au bon moment.</strong></div></div><div><span><ShieldCheck size={19}/></span><div><small>POUR ALLNEEDS</small><strong>Une mission tenue, documentée et suivie jusqu’au bilan.</strong></div></div><p>Le statut ne suffit pas : chaque mission doit avoir un prochain jalon, un responsable et un point de contact prévu.</p></section>

    <section className="concierge-mission-stats"><article className={blockedCount ? 'has-alert' : ''}><CircleAlert size={17}/><strong>{blockedCount}</strong><span>mission{blockedCount === 1 ? '' : 's'} bloquée{blockedCount === 1 ? '' : 's'}</span></article><article><ClipboardCheck size={17}/><strong>{pendingDeliverables}</strong><span>livrable{pendingDeliverables === 1 ? '' : 's'} à suivre</span></article><article><Clock3 size={17}/><strong>{activeCount}</strong><span>mission{activeCount === 1 ? '' : 's'} active{activeCount === 1 ? '' : 's'}</span></article><Link to={'/concierge/rendez-vous' as any}><CalendarClock size={17}/> Organiser un point client <ArrowRight size={14}/></Link></section>

    <div className="concierge-mission-toolbar"><div><small>VOTRE FILE DE COORDINATION</small><h2>Ce qui demande votre attention</h2></div><div>{([['a_suivre', 'En cours'], ['blocages', `Bloquées (${blockedCount})`], ['terminees', 'Bilan à faire'], ['toutes', `Toutes (${all.length})`]] as const).map(([key, label]) => <button type="button" key={key} className={filter === key ? 'is-active' : ''} onClick={() => setFilter(key)}>{label}</button>)}</div></div>

    <div className="concierge-mission-list">{visible.map((mission) => {
      const org = orgs.find((company) => company.id === mission.orgId)
      const blocked = mission.milestones.find((milestone) => milestone.status === 'bloque')
      const current = mission.milestones.find((milestone) => milestone.status === 'en_cours')
      const nextMilestone = blocked ?? current ?? mission.milestones.find((milestone) => milestone.status === 'a_venir')
      const missionDeliverables = state.deliverables.filter((deliverable) => deliverable.missionId === mission.id)
      const needsReview = missionDeliverables.filter((deliverable) => deliverable.status === 'en_relecture' || deliverable.status === 'retouche')
      const isComplete = mission.status === 'terminee'
      const action = isComplete ? { tag: 'Bilan à organiser', title: 'Confirmer le résultat avec le client', detail: 'Vérifier la réception des livrables, recueillir son retour et définir la suite utile.', tone: 'success' as const, icon: CheckCircle2 } : blocked ? { tag: 'À débloquer', title: `Résoudre le blocage : ${blocked.title}`, detail: 'Contacter le responsable de mission, convenir d’un plan de reprise et prévenir le client.', tone: 'danger' as const, icon: CircleAlert } : needsReview.length ? { tag: 'Livrable à valider', title: `Faire le point sur « ${needsReview[0].title} »`, detail: 'Vérifier avec le client si le livrable répond au besoin et transmettre les retours au responsable.', tone: 'warning' as const, icon: FileCheck2 } : current ? { tag: 'Prochain jalon', title: `Faire avancer : ${current.title}`, detail: 'Confirmer qui porte l’étape, la date de livraison et le prochain message au client.', tone: 'brand' as const, icon: Clock3 } : { tag: 'Préparation', title: `Préparer : ${nextMilestone?.title ?? 'le prochain jalon'}`, detail: 'Valider les éléments d’entrée et annoncer au client la prochaine échéance connue.', tone: 'brand' as const, icon: CalendarClock }
      const ActionIcon = action.icon
      return <Card key={mission.id} className={`concierge-mission-card ${blocked ? 'is-blocked' : ''}`}>
        <header><div><OrgIdentity orgId={mission.orgId}/><h3>{mission.title}</h3><small>{mission.code} · {mission.owner} · échéance cible {new Date(mission.targetEnd).toLocaleDateString('fr-FR')}</small></div><Badge tone={MISSION_STATUS[mission.status].tone}>{MISSION_STATUS[mission.status].label}</Badge></header>
        <div className="concierge-mission-progress-row"><Progress value={mission.onboardingProgress} label="Progression déclarée"/><strong>{mission.onboardingProgress}%</strong></div>
        <div className="concierge-mission-current"><div className="concierge-mission-current-title"><span className={`tone-${action.tone}`}><ActionIcon size={17}/></span><div><Badge tone={action.tone}>{action.tag}</Badge><h4>{action.title}</h4><p>{action.detail}</p></div></div>{nextMilestone ? <div className="concierge-current-milestone"><small>JALON CONCERNÉ</small><strong>{nextMilestone.title}</strong><span>{MILESTONE_STATUS[nextMilestone.status].label} · {new Date(nextMilestone.dueAt).toLocaleDateString('fr-FR')}</span></div> : null}</div>
        <div className="concierge-mission-footer"><div><small>Promesse / périmètre</small><span>{mission.scope.slice(0, 2).join(' · ') || mission.levers.map((lever) => LEVER_LABEL[lever] ?? lever).join(' · ')}</span><small>{missionDeliverables.length} livrable{missionDeliverables.length === 1 ? '' : 's'} · {needsReview.length} à valider · {money(mission.price)} HT</small></div><div><Link to={'/concierge/entreprises/$id' as any} params={{ id: mission.orgId } as any}><PhoneCall size={14}/> Ouvrir le suivi client</Link>{isComplete ? <Link to={'/concierge/rendez-vous' as any}><CalendarClock size={14}/> Planifier le bilan</Link> : null}</div></div>
        <details className="concierge-mission-details"><summary>Voir les jalons et livrables <span>{mission.milestones.length} jalons · {missionDeliverables.length} livrables</span></summary><div>{mission.milestones.map((milestone) => <article key={milestone.id}><span className={`milestone-dot is-${milestone.status}`}/><strong>{milestone.title}</strong><Badge tone={MILESTONE_STATUS[milestone.status].tone}>{MILESTONE_STATUS[milestone.status].label}</Badge><small>{new Date(milestone.dueAt).toLocaleDateString('fr-FR')}</small></article>)}{missionDeliverables.map((deliverable) => <article key={deliverable.id}><FileCheck2 size={15}/><strong>{deliverable.title}</strong><Badge tone={deliverable.status === 'valide' ? 'success' : deliverable.status === 'retouche' ? 'warning' : 'neutral'}>{deliverable.status === 'valide' ? 'Validé' : deliverable.status === 'retouche' ? 'Retour attendu' : deliverable.status === 'en_relecture' ? 'À relire' : 'En attente'}</Badge><small>{deliverable.owner}</small></article>)}</div></details>
      </Card>
    })}{!visible.length ? <ScopedEmpty/> : null}</div>
  </div></ConciergeGuard>
}
