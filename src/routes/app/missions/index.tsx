import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Briefcase, CalendarDays, Check, Clock, Flag, Sparkles } from 'lucide-react'
import { useDemo } from '@/store/store'
import { PageHeader } from '@/components/layouts'
import { Alert, Badge, Button, Card, EmptyState } from '@/components/ui'
import { MISSION_STATUS } from '@/lib/status'
import { longDate, relative } from '@/lib/format'

export const Route = createFileRoute('/app/missions/')({
  component: MissionsPage,
  head: () => ({ meta: [{ title: 'Mes missions — ALLNEEDS' }] }),
})

export function MissionsPage() {
  const { state, orgId } = useDemo()
  const missions = state.missions.filter((mission) => mission.orgId === orgId).sort((a, b) => b.startedAt.localeCompare(a.startedAt))

  return <>
    <PageHeader
      eyebrow="Missions · votre parcours"
      title="Chaque étape fait avancer votre projet."
      description="Retrouvez la prochaine étape, votre avancement et les rendez-vous clés. Le périmètre complet reste disponible dans chaque mission."
      actions={<Link to="/diagnostic"><Button size="sm" variant="outline">Découvrir une mission</Button></Link>}
    />

    {missions.length === 0 ? <EmptyState icon={<Briefcase className="h-5 w-5" />} title="Votre parcours commencera ici" description="Un diagnostic permet d’identifier les étapes utiles à votre établissement." action={<Link to="/diagnostic"><Button size="sm">Commencer par un diagnostic</Button></Link>} /> : (
      <div className="mission-lobby-list">
        {missions.map((mission) => {
          const status = MISSION_STATUS[mission.status]
          const done = mission.milestones.filter((milestone) => milestone.status === 'fait').length
          const nextMilestone = mission.milestones.find((milestone) => milestone.status === 'bloque' || milestone.status === 'en_cours') ?? mission.milestones.find((milestone) => milestone.status === 'a_venir')
          const deliverables = state.deliverables.filter((item) => item.missionId === mission.id)
          const validatedDeliverables = deliverables.filter((item) => item.status === 'valide').length
          const nextMeeting = state.meetings.filter((meeting) => meeting.missionId === mission.id && meeting.status !== 'realise' && meeting.status !== 'annule').sort((a, b) => a.at.localeCompare(b.at))[0]

          return <Card key={mission.id} className="mission-lobby-card">
            <div className="mission-lobby-head"><span className="mission-lobby-code"><Sparkles size={15}/>{mission.code} · MISSION</span><Badge tone={status.tone}>{status.label}</Badge></div>
            <h2>{mission.title}</h2>
            <p className="mission-lobby-meta">Réf. {mission.ref} · Livraison cible {longDate(mission.targetEnd)}</p>
            <div className="mission-lobby-progress"><div><span>Progression du parcours</span><strong>{mission.onboardingProgress}%</strong></div><div className="mission-adventure-track" role="progressbar" aria-label={`Avancement de ${mission.title}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={mission.onboardingProgress}><span style={{width:`${mission.onboardingProgress}%`}}/></div><small>{done}/{mission.milestones.length} jalons franchis · {validatedDeliverables}/{deliverables.length} livrables validés</small></div>
            {nextMilestone ? <div className={`mission-lobby-next ${nextMilestone.status==='bloque'?'blocked':''}`}><span><Flag size={16}/></span><div><small>{nextMilestone.status==='bloque'?'À DÉBLOQUER':'PROCHAINE ÉTAPE'}</small><strong>{nextMilestone.title}</strong><em>Échéance {longDate(nextMilestone.dueAt)}</em></div><span className="mission-lobby-next-number">{String(mission.milestones.indexOf(nextMilestone)+1).padStart(2,'0')}</span></div> : null}
            <div className="mission-mini-path" aria-label="Étapes principales">{mission.milestones.slice(0,5).map((milestone,index)=><span key={milestone.id} className={milestone.status==='fait'?'done':milestone.status==='bloque'?'blocked':milestone.status==='en_cours'?'current':''} title={milestone.title}>{milestone.status==='fait'?<Check size={12}/>:String(index+1).padStart(2,'0')}</span>)}</div>
            {nextMeeting ? <div className="mission-lobby-meeting"><CalendarDays size={15}/><span>{nextMeeting.title}</span><small>{relative(nextMeeting.at)} · {nextMeeting.durationMin} min</small></div> : null}
            <div className="mission-lobby-footer"><span><Clock size={14}/>{mission.owner}</span><Link to="/app/missions/$id" params={{id:mission.id}}><Button size="sm">Reprendre le parcours <ArrowRight size={14}/></Button></Link></div>
            <details className="mission-scope-details"><summary>Voir le périmètre convenu</summary><div className="mission-scope-columns"><div><strong>Inclus</strong>{mission.scope.map((item)=><p key={item}><Check size={13}/>{item}</p>)}</div><div><strong>Hors périmètre</strong>{mission.outOfScope.map((item)=><p key={item}>{item}</p>)}</div></div></details>
          </Card>
        })}
      </div>
    )}

    <Alert tone="warning" className="mt-6" title="Retouches et production supplémentaire">Deux tours de retouches par livrable sont inclus. Toute production supplémentaire est chiffrée et validée avant réalisation.</Alert>
    <p className="mt-4 text-xs text-ink-400">Retrouvez aussi vos <Link to="/app/livrables" className="font-semibold text-brand-700">livrables</Link> et votre <Link to="/app/documents" className="font-semibold text-brand-700">dossier documentaire</Link>. Dernière mise à jour : {relative(state.now)}.</p>
  </>
}
