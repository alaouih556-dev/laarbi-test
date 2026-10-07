import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Bell, BriefcaseBusiness, Building2, FileCheck2, Gauge, Network, Target } from 'lucide-react'
import { PageHeader } from '@/components/layouts'
import { useDemo } from '@/store/store'
import { buildNextActions, buildObjectives, resolveSituation, situationLabel } from '@/lib/operational'
import { SECTOR_LABEL } from '@/data/catalog'

export const Route = createFileRoute('/app/parametres')({ component: SettingsPage })

function SettingsPage() {
  const { state, orgId } = useDemo()
  const org = state.orgs.find((item) => item.id === orgId)
  const objectives = buildObjectives(state, orgId)
  const actions = buildNextActions(state, orgId)
  const needs = state.needs.filter((item) => item.orgId === orgId)
  const missions = state.missions.filter((item) => item.orgId === orgId)
  const diagnostics = state.diagnostics.filter((item) => item.orgId === orgId)
  const documents = state.documents.filter((item) => item.orgId === orgId)
  const threads = state.threads.filter((item) => item.orgId === orgId)
  const candidateIds = new Set(needs.flatMap((need) => need.candidateIds))
  const experts = state.providers.filter((provider) => candidateIds.has(provider.id))
  const activeMissions = missions.filter((mission) => mission.status !== 'terminee')
  const activeNeeds = needs.filter((need) => !['clos', 'signe'].includes(need.status))
  const published = diagnostics.filter((diagnostic) => diagnostic.status === 'publie')
  const alerts = state.notifications.filter((notification) => !notification.read && notification.tone === 'warning')
  const meetings = state.meetings.filter((meeting) => meeting.orgId === orgId)
  const priority = actions[0]

  return <>
    <PageHeader
      eyebrow="Compte"
      title="Profil & activité"
      description="Les repères essentiels de votre établissement. Cette page est un résumé, pas un écran de réglages."
    />

    <div className="company-cockpit-grid profile-summary-grid">
      <section><small><Building2 size={13} /> VOTRE ÉTABLISSEMENT</small><h2>{org?.name ?? 'Établissement'}</h2><p>{org ? `${org.kind} · ${SECTOR_LABEL[org.sector]} · ${org.city} · ${org.size}` : 'Les informations de votre établissement apparaîtront ici.'}</p></section>
      <section><small><Target size={13} /> VOTRE SITUATION</small><h2>{situationLabel(resolveSituation(state))}</h2><p>Ce contexte aide ALLNEEDS à adapter les priorités et les recommandations à votre activité.</p></section>
      <section className="profile-priority-card"><small><Gauge size={13} /> PROCHAINE ACTION</small><h2>{priority?.title ?? 'Aucune action urgente'}</h2><p>{priority?.why ?? 'Aucun sujet ne demande votre attention pour le moment.'}</p>{priority ? <Link to={priority.to as any}>Voir quoi faire <ArrowRight size={14} /></Link> : null}</section>
    </div>

    <details className="profile-activity-details">
      <summary>Voir les indicateurs de suivi <span>8 repères · activité de votre dossier</span></summary>
      <div className="company-cockpit-grid profile-activity-grid">
        <section><small><Target size={13} /> OBJECTIFS</small><h2>{objectives.length}</h2><p>{objectives.length ? objectives.map((objective) => objective.title).join(' · ') : 'Aucun objectif défini.'}</p></section>
        <section><small><Gauge size={13} /> BESOINS</small><h2>{activeNeeds.length} actif{activeNeeds.length === 1 ? '' : 's'}</h2><p>{needs.length} besoin{needs.length === 1 ? '' : 's'} enregistré{needs.length === 1 ? '' : 's'} au total.</p></section>
        <section><small><BriefcaseBusiness size={13} /> PROJETS & MISSIONS</small><h2>{activeMissions.length} en cours</h2><p>{missions.filter((mission) => mission.status === 'terminee').length} terminé{missions.filter((mission) => mission.status === 'terminee').length === 1 ? '' : 's'}.</p></section>
        <section><small><FileCheck2 size={13} /> DIAGNOSTICS</small><h2>{published.length} publié{published.length === 1 ? '' : 's'}</h2><p>{diagnostics.length} diagnostic{diagnostics.length === 1 ? '' : 's'} dans votre espace.</p></section>
        <section><small><Network size={13} /> EXPERTS LIÉS</small><h2>{experts.length}</h2><p>Prestataires déjà associés à vos besoins.</p></section>
        <section><small><FileCheck2 size={13} /> DOCUMENTS</small><h2>{documents.filter((document) => document.status === 'valide').length}/{documents.length} validés</h2><p>{documents.filter((document) => document.required && document.status !== 'valide').length} pièce{documents.filter((document) => document.required && document.status !== 'valide').length === 1 ? '' : 's'} requise{documents.filter((document) => document.required && document.status !== 'valide').length === 1 ? '' : 's'} à compléter.</p></section>
        <section><small><Bell size={13} /> ALERTES</small><h2>{alerts.length}</h2><p>{alerts.length ? 'Alerte(s) non lue(s) à vérifier.' : 'Aucune alerte urgente non lue.'}</p></section>
        <section><small><BriefcaseBusiness size={13} /> HISTORIQUE</small><h2>{threads.length} conversation{threads.length === 1 ? '' : 's'}</h2><p>{meetings.length} rendez-vous enregistré{meetings.length === 1 ? '' : 's'}.</p></section>
      </div>
    </details>
  </>
}
