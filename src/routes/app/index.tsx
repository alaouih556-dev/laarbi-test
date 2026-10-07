import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Bell, BriefcaseBusiness, FileText } from 'lucide-react'
import { PageHeader } from '@/components/layouts'
import { EmptyNextAction, NextActionCard } from '@/components/OperationalUX'
import { useDemo } from '@/store/store'
import { buildNextActions, missionProgress, resolveSituation, situationLabel } from '@/lib/operational'
import { Badge, Card, Progress } from '@/components/ui'
import { DOC_STATUS } from '@/lib/status'
import type { Mission } from '@/types'
import { ActivityPulse } from '@/components/ActivityPulse'

export const Route = createFileRoute('/app/')({
  component: ClientCockpit,
  head: () => ({ meta: [{ title: 'Accueil — ALLNEEDS' }] }),
})

function nextMilestone(mission: Mission) {
  return mission.milestones.find((milestone) => milestone.status === 'bloque')
    ?? mission.milestones.find((milestone) => milestone.status === 'en_cours')
    ?? [...mission.milestones].filter((milestone) => milestone.status === 'a_venir').sort((a, b) => a.dueAt.localeCompare(b.dueAt))[0]
}

function ClientCockpit() {
  const { state, orgId } = useDemo()
  const org = state.orgs.find((item) => item.id === orgId)
  const situation = resolveSituation(state)
  const nextActions = buildNextActions(state, orgId).filter((action) => action.id !== 'docs')
  const requiredDocuments = state.documents.filter((document) => document.orgId === orgId && document.required && document.status !== 'valide')
  const primaryDocument = requiredDocuments[0]
  const primaryAction = primaryDocument ? null : nextActions[0]
  const activeMissions = state.missions.filter((mission) => mission.orgId === orgId && mission.status !== 'terminee')
  const featuredMission = activeMissions[0]
  const milestone = featuredMission ? nextMilestone(featuredMission) : null
  const otherCount = Math.max(0, requiredDocuments.length - (primaryDocument ? 1 : 0)) + Math.max(0, nextActions.length - (primaryAction ? 1 : 0))
  const unreadNotifs = state.notifications.filter((notification) => !notification.read).length

  return <div className="operational-cockpit">
    <PageHeader eyebrow={`${situationLabel(situation)} · ${org?.sector ?? ''}`} title="Aujourd’hui" description="Voici la prochaine chose utile à régler pour votre établissement." actions={<Link to="/app/notifications" className="cockpit-notif-link"><Bell size={16}/>{unreadNotifs ? `Notifications · ${unreadNotifs}` : 'Notifications'}</Link>} />

    <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]" aria-label="Votre priorité et votre suivi">
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-brand-700">Votre priorité</p>
        {primaryDocument ? <Card className="border-brand-200 p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><FileText size={20}/></span><Badge tone={DOC_STATUS[primaryDocument.status].tone}>{primaryDocument.status === 'demande' ? 'À fournir' : 'À vérifier'}</Badge></div><h2 className="mt-5 font-display text-xl font-bold text-ink-950">{primaryDocument.name}</h2><p className="mt-2 text-sm leading-relaxed text-ink-600">Cette pièce est nécessaire pour faire avancer votre dossier.</p><Link to="/app/documents" className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-3 text-sm font-bold text-white">Ouvrir mes documents <ArrowRight size={15}/></Link></Card> : primaryAction ? <NextActionCard action={primaryAction} featured /> : <Card className="p-5"><EmptyNextAction/></Card>}
        {otherCount > 0 ? <details className="mt-4 rounded-2xl border border-ink-100 bg-white"><summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-ink-700">Voir les autres actions ({otherCount})</summary><div className="space-y-3 border-t border-ink-100 p-4">{requiredDocuments.slice(primaryDocument ? 1 : 0).map((document) => <Link key={document.id} to="/app/documents" className="flex items-center justify-between gap-3 rounded-xl bg-ink-50 p-3"><span className="text-sm font-medium text-ink-800">{document.name}</span><Badge tone={DOC_STATUS[document.status].tone}>{document.status === 'demande' ? 'À fournir' : 'À vérifier'}</Badge></Link>)}{nextActions.slice(primaryAction ? 1 : 0).map((action) => <NextActionCard key={action.id} action={action} compact/>)}</div></details> : null}
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between gap-3"><p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-400">Votre accompagnement</p><Link to="/app/projets" className="text-xs font-semibold text-brand-700">Tout voir <ArrowRight size={13}/></Link></div>
        {featuredMission ? <Link to={`/app/missions/${featuredMission.id}` as any} className="block rounded-3xl border border-ink-100 bg-white p-5 shadow-sm transition hover:shadow-lift sm:p-6"><div className="flex items-start justify-between gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-brand-700"><BriefcaseBusiness size={20}/></span><Badge tone={milestone?.status === 'bloque' ? 'danger' : 'brand'}>{milestone?.status === 'bloque' ? 'À débloquer' : 'En cours'}</Badge></div><h2 className="mt-5 font-display text-lg font-bold text-ink-950">{featuredMission.title}</h2><p className="mt-1 text-sm text-ink-500">{milestone ? `Prochaine étape : ${milestone.title}` : 'Consulter les avancées de votre mission'}</p><div className="mt-5"><Progress value={missionProgress(featuredMission)} label="Avancement de la mission"/></div><p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-700">Ouvrir le suivi <ArrowRight size={14}/></p></Link> : <Card className="p-5"><p className="font-semibold text-ink-950">Votre espace est prêt.</p><p className="mt-2 text-sm leading-relaxed text-ink-600">Vos missions et leurs prochaines étapes apparaîtront ici dès leur démarrage.</p><Link to="/app/actions" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">Voir mes actions <ArrowRight size={14}/></Link></Card>}
      </div>
    </section>

    <ActivityPulse activities={state.activities} orgIds={new Set([orgId])} title="Les personnes de votre dossier ont avancé" />
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-ink-50 px-4 py-3"><p className="text-xs text-ink-600">Votre espace ALLNEEDS · {org?.name ?? 'Établissement'} · {activeMissions.length} mission{activeMissions.length > 1 ? 's' : ''} en cours</p><Link to="/app/actions" className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700">Toutes mes actions <ArrowRight size={13}/></Link></div>
  </div>
}
