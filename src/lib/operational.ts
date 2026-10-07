import type { DemoState } from '@/store/store'
import type { Need, Mission, Provider } from '@/types'
import { NEED_STATUS } from '@/lib/status'

export type OperationalTone = 'action' | 'attention' | 'information' | 'resultat'
export type SituationKind = 'entreprise_existante' | 'creation' | 'investisseur'

export interface NextActionItem {
  id: string
  tone: OperationalTone
  title: string
  detail: string
  why: string
  result: string
  to: string
  priority: number
}

export interface ObjectiveItem {
  id: 'ventes' | 'visibilite' | 'organisation' | 'optimisation'
  title: string
  description: string
  engine: string
  activeNeeds: number
  activeMissions: number
  links: string[]
}

export function resolveSituation(state: DemoState): SituationKind {
  const situation = state.registrationProfile?.situation
  if (situation) return situation
  const profile = state.registrationProfile?.workspaceProfile?.toLowerCase() ?? ''
  if (profile.includes('invest')) return 'investisseur'
  if (profile.includes('cré') || profile.includes('crea') || profile.includes('porteur')) return 'creation'
  return 'entreprise_existante'
}

export function situationLabel(kind: SituationKind) {
  if (kind === 'creation') return 'Entreprise en création'
  if (kind === 'investisseur') return 'Investisseur'
  return 'Entreprise existante'
}

export function mapNeedToObjective(need: Need): ObjectiveItem['id'] {
  if (need.category === 'rh') return 'organisation'
  if (need.category === 'energie' || need.category === 'maintenance' || need.category === 'logistique') return 'optimisation'
  if (need.category === 'creation') return 'visibilite'
  return 'ventes'
}

export function mapMissionToObjective(mission: Mission): ObjectiveItem['id'][] {
  const ids = new Set<ObjectiveItem['id']>()
  for (const lever of mission.levers) {
    if (['inscriptions', 'offre', 'frequentation'].includes(lever)) ids.add('ventes')
    if (['image', 'experience'].includes(lever)) ids.add('visibilite')
    if (lever === 'equipe') ids.add('organisation')
    if (['charges', 'conformite'].includes(lever)) ids.add('optimisation')
  }
  if (ids.size === 0) ids.add('organisation')
  return Array.from(ids)
}

export function buildObjectives(state: DemoState, orgId: string): ObjectiveItem[] {
  const needs = state.needs.filter((n) => n.orgId === orgId && !['clos', 'signe'].includes(n.status))
  const missions = state.missions.filter((m) => m.orgId === orgId && m.status !== 'terminee')
  const defs: Omit<ObjectiveItem, 'activeNeeds' | 'activeMissions'>[] = [
    {
      id: 'ventes',
      title: 'Mieux vendre',
      description: 'Acquisition, prospection, conversion, fidélisation et développement commercial.',
      engine: 'Commercial & force de vente',
      links: ['/app/besoins', '/app/missions'],
    },
    {
      id: 'visibilite',
      title: 'Mieux communiquer',
      description: 'Positionnement, visibilité, contenus, campagnes et acquisition.',
      engine: 'Visibilité, marketing & communication',
      links: ['/app/besoins', '/app/missions'],
    },
    {
      id: 'organisation',
      title: 'Mieux s’organiser',
      description: 'RH, responsabilités, process, outils et suivi de l’activité.',
      engine: 'RH, organisation, process & outils',
      links: ['/app/actions', '/app/equipe'],
    },
    {
      id: 'optimisation',
      title: 'Mieux maîtriser les coûts & risques',
      description: 'Charges, contrats, juridique, risques et optimisation de la structure.',
      engine: 'Réduction des charges & accompagnement juridique',
      links: ['/app/documents', '/app/ecosysteme'],
    },
  ]
  return defs.map((def) => ({
    ...def,
    activeNeeds: needs.filter((n) => mapNeedToObjective(n) === def.id).length,
    activeMissions: missions.filter((m) => mapMissionToObjective(m).includes(def.id)).length,
  }))
}

export function buildNextActions(state: DemoState, orgId: string): NextActionItem[] {
  const actions: NextActionItem[] = []
  const pendingDocs = state.documents.filter((d) => d.orgId === orgId && d.required && d.status !== 'valide')
  if (pendingDocs.length) {
    actions.push({
      id: 'docs', tone: 'action', priority: 108,
      title: `${pendingDocs.length} document${pendingDocs.length > 1 ? 's' : ''} à compléter`,
      detail: pendingDocs.slice(0, 2).map((d) => d.name).join(' · '),
      why: 'Ces pièces sont marquées comme requises et restent à valider.',
      result: 'Dossier complété pour que l’équipe puisse poursuivre le traitement.',
      to: '/app/documents',
    })
  }

  const needs = state.needs.filter((n) => n.orgId === orgId && !['clos', 'signe'].includes(n.status))
  for (const need of needs) {
    if (need.status === 'devis' || need.status === 'propositions') {
      const quoteCount = state.quotes.filter((q) => q.needId === need.id && !['refuse'].includes(q.status)).length
      actions.push({
        id: `need-${need.id}`, tone: 'action', priority: need.urgency === 'haute' ? 124 : need.status === 'negociation' ? 103 : 88,
        title: `Décider sur « ${need.title} »`,
        detail: quoteCount ? `${quoteCount} proposition${quoteCount > 1 ? 's' : ''} disponible${quoteCount > 1 ? 's' : ''}.` : 'Des propositions sont en cours de comparaison.',
        why: need.urgency === 'haute' ? 'Ce besoin est déclaré urgent et une proposition attend une décision.' : `Le dossier est à l’étape « ${need.status.replace('_', ' ')} » : une décision évite qu’il reste en attente.`,
        result: 'Votre choix est tracé et le dossier passe à l’étape suivante.',
        to: `/app/besoins/${need.id}`,
      })
    } else {
      actions.push({
        id: `need-${need.id}`, tone: need.urgency === 'haute' ? 'attention' : 'information', priority: need.urgency === 'haute' ? 118 : 60,
        title: `Suivre « ${need.title} »`,
        detail: `${NEED_STATUS[need.status].label} · Responsable : ${need.assignedTo}.`,
        why: 'Le besoin est actif et doit conserver une prochaine action visible.',
        result: 'Avancement tracé sans relance dispersée.',
        to: `/app/besoins/${need.id}`,
      })
    }
  }

  const missions = state.missions.filter((m) => m.orgId === orgId && m.status !== 'terminee')
  for (const mission of missions) {
    const blocked = mission.milestones.find((m) => m.status === 'bloque')
    const inProgress = mission.milestones.find((m) => m.status === 'en_cours')
    if (blocked || inProgress) {
      const milestone = blocked ?? inProgress!
      actions.push({
        id: `mission-${mission.id}`, tone: blocked ? 'attention' : 'action', priority: blocked ? 132 : 76,
        title: blocked ? `Débloquer « ${milestone.title} »` : `Continuer « ${milestone.title} »`,
        detail: `${mission.title} · ${mission.owner}`,
        why: blocked ? 'Un jalon bloque actuellement la mission.' : 'C’est le jalon actuellement en cours.',
        result: 'Mission remise sur une trajectoire claire.',
        to: `/app/missions/${mission.id}`,
      })
    }
  }

  const unread = state.threads.filter((t) => t.orgId === orgId && t.unread > 0)
  if (unread.length) {
    actions.push({
      id: 'messages', tone: 'action', priority: 72,
      title: `${unread.reduce((s, t) => s + t.unread, 0)} message${unread.reduce((s, t) => s + t.unread, 0) > 1 ? 's' : ''} à lire`,
      detail: unread.slice(0, 2).map((t) => t.subject).join(' · '),
      why: 'Ces échanges sont rattachés à des dossiers actifs.',
      result: 'Décisions et réponses replacées dans leur contexte.',
      to: '/app/messages',
    })
  }

  const nextMeeting = state.meetings
    .filter((m) => m.orgId === orgId && ['confirme', 'propose'].includes(m.status))
    .sort((a, b) => a.at.localeCompare(b.at))[0]
  if (nextMeeting) {
    actions.push({
      id: `meeting-${nextMeeting.id}`, tone: 'information', priority: 45,
      title: `Préparer : ${nextMeeting.title}`,
      detail: `${new Date(nextMeeting.at).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })} · ${nextMeeting.location}`,
      why: 'C’est votre prochain rendez-vous planifié.',
      result: 'Rendez-vous préparé avec le bon contexte.',
      to: '/app/rendez-vous',
    })
  }

  const published = state.diagnostics.filter((d) => d.orgId === orgId && d.status === 'publie')
  if (published.length) {
    actions.push({
      id: 'diagnostic', tone: 'resultat', priority: 30,
      title: 'Revoir vos priorités issues du diagnostic',
      detail: published[0].priorities.slice(0, 2).join(' · ') || `Diagnostic ${published[0].ref}`,
      why: 'Un diagnostic publié doit rester relié aux actions qui suivent.',
      result: 'Priorités transformées en actions concrètes.',
      to: '/app/diagnostics',
    })
  }

  return actions.sort((a, b) => b.priority - a.priority)
}

export function providerReasons(provider: Provider, need?: Need): string[] {
  const reasons: string[] = []
  if (need && provider.category === need.category) reasons.push(`Expertise alignée avec « ${need.categoryLabel} »`)
  if (need && provider.city === need.location) reasons.push(`Présence à ${provider.city}`)
  if (provider.verification === 'approfondie') reasons.push('Vérification approfondie enregistrée')
  if (provider.insurance) reasons.push('Assurance déclarée dans le dossier fournisseur')
  if (provider.references.length) reasons.push(`${provider.references.length} référence${provider.references.length > 1 ? 's' : ''} disponible${provider.references.length > 1 ? 's' : ''}`)
  return reasons.length ? reasons : ['Profil présent dans la base ALLNEEDS pour cette catégorie']
}

export function missionProgress(mission: Mission) {
  if (!mission.milestones.length) return 0
  return Math.round((mission.milestones.filter((m) => m.status === 'fait').length / mission.milestones.length) * 100)
}
