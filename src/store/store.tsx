import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import {
  DELIVERABLES,
  DEMO_NOW,
  DIAGNOSTICS,
  LEADS,
  MEETINGS,
  MESSAGES,
  MISSIONS,
  NEEDS,
  NOTIFICATIONS,
  ORGS,
  PROVIDERS,
  QUOTES,
  SUBSCRIPTION,
  THREADS,
  DOCUMENTS,
} from '@/data/demo'
import { ACCESS_OFFERS } from '@/data/catalog'
import type {
  AppUser,
  ClientOrg,
  DeliverableStatus,
  DocStatus,
  Lead,
  LeadStage,
  Meeting,
  MeetingStatus,
  MessageAuthor,
  MilestoneStatus,
  Mission,
  MissionStatus,
  Need,
  NeedStatus,
  NotificationItem,
  Provider,
  Quote,
  Sector,
  Toast,
} from '@/types'

/* ------------------------------------------------------------------ */
/* Types publics                                                       */
/* ------------------------------------------------------------------ */

export interface PublicRequest {
  id: string
  at: string
  kind: 'besoin' | 'mission' | 'diagnostic' | 'contact' | 'newsletter'
  name: string
  org: string
  email: string
  phone: string
  sector: Sector
  city: string
  message: string
  budget: string
  status: 'nouveau' | 'contacte' | 'planifie' | 'clos'
  assignedTo: string
  notes: string
}

export interface PublicBooking {
  id: string
  at: string
  createdAt: string
  org: string
  name: string
  role: string
  email: string
  phone: string
  sector: Sector
  city: string
  headcount: string
  date: string
  slot: string
  format: 'sur_site' | 'visio' | 'telephone'
  topic: string
  status: 'confirme' | 'propose' | 'realise' | 'annule'
}

export type Role = 'client' | 'admin' | 'concierge'
export type ClientWorkspaceRole = 'dirigeant' | 'manager' | 'collaborateur'
export type SanteSaasRole = 'directeur' | 'reception' | 'comptabilite'

export interface ConciergeAccount {
  id: string
  name: string
  email: string
  active: boolean
  sectors: Sector[]
  assignedOrgIds: string[]
  createdOrgIds: string[]
}

export interface ClientTeamMember {
  id: string
  orgId: string
  name: string
  email: string
  jobTitle: string
  role: 'manager' | 'collaborateur'
  access: string[]
  status: 'invitation_en_attente' | 'actif'
  createdAt: string
}

export interface CommercialOpportunity {
  id: string
  orgId: string
  offerCode: 'PRO' | 'PERFORMANCE'
  offerName: string
  signal: string
  status: 'a_qualifier' | 'a_preparer' | 'proposee' | 'interessee' | 'acceptee' | 'refusee'
  createdAt: string
}

export interface DemoActivity {
  id: string
  at: string
  actor: string
  role: string
  orgId: string
  organization: string
  type: 'analyse' | 'action' | 'progression' | 'decision'
  text: string
}

export const DEMO_CLIENT_PROFILES = {
  'usr-amina': { orgId: 'org-amal', name: 'Amina Bennani', email: 'a.bennani@al-amal.ma', roleLabel: 'Direction · Enseignement', initials: 'AB' },
  'usr-youssef': { orgId: 'org-nour', name: 'Dr Youssef Idrissi', email: 'direction@clinique-nour.ma', roleLabel: 'Direction · Santé', initials: 'YI' },
  'usr-salma': { orgId: 'org-riad', name: 'Salma Ouazzani', email: 'salma@riad-lumen.ma', roleLabel: 'Direction · Tourisme', initials: 'SO' },
  'usr-manager': { orgId: 'org-amal', name: 'Responsable Al Amal', email: 'manager@al-amal.ma', roleLabel: 'Responsable · Enseignement', initials: 'RA' },
  'usr-collab': { orgId: 'org-amal', name: 'Collaborateur Al Amal', email: 'collaborateur@al-amal.ma', roleLabel: 'Collaborateur · Enseignement', initials: 'CA' },
} as const


export interface DemoState {
  role: Role
  userId: string
  onboarded: boolean
  subscription: typeof SUBSCRIPTION
  orgs: ClientOrg[]
  providers: Provider[]
  needs: Need[]
  quotes: Quote[]
  missions: Mission[]
  deliverables: typeof DELIVERABLES
  meetings: typeof MEETINGS
  documents: typeof DOCUMENTS
  threads: typeof THREADS
  messages: typeof MESSAGES
  diagnostics: typeof DIAGNOSTICS
  leads: Lead[]
  notifications: NotificationItem[]
  requests: PublicRequest[]
  bookings: PublicBooking[]
  concierges: ConciergeAccount[]
  teamMembers: ClientTeamMember[]
  commercialOpportunities: CommercialOpportunity[]
  activities: DemoActivity[]
  saasAccess: Record<Sector, boolean>
  saasAccessByOrg: Record<string, boolean>
  saasRolesByOrg: Record<string, SanteSaasRole[]>
  saasActivatedAtByOrg: Record<string, string | null>
  registrationProfile: { sector: Sector; workspaceProfile: string; situation?: 'entreprise_existante' | 'creation' | 'investisseur'; tier: string | null; payment: string | null; activated: boolean; orgName?: string; contactName?: string; appointmentDate?: string; appointmentSlot?: string } | null
  clientWorkspaceRole: ClientWorkspaceRole
  toasts: Toast[]
  now: string
}

const initialState: DemoState = {
  role: 'client',
  userId: 'usr-amina',
  onboarded: true,
  subscription: SUBSCRIPTION,
  orgs: ORGS,
  providers: PROVIDERS,
  needs: NEEDS,
  quotes: QUOTES,
  missions: MISSIONS,
  deliverables: DELIVERABLES,
  meetings: MEETINGS,
  documents: DOCUMENTS,
  threads: THREADS,
  messages: MESSAGES,
  diagnostics: DIAGNOSTICS,
  leads: LEADS,
  notifications: NOTIFICATIONS,
  requests: [
    {
      id: 'req-001',
      at: d2(0),
      kind: 'besoin',
      name: 'Hicham Ouazzani',
      org: 'École Les Oliviers',
      email: 'h.ouazzari@lesoliviers.ma',
      phone: '+212 6 10 22 33 44',
      sector: 'enseignement',
      city: 'Casablanca',
      message: 'Logiciel de gestion avec espace parents, 180 élèves.',
      budget: '15 000 – 25 000 DH',
      status: 'nouveau',
      assignedTo: 'Non assigné',
      notes: '',
    },
    {
      id: 'req-002',
      at: d2(-1),
      kind: 'mission',
      name: 'Rachid Amrani',
      org: 'Cabinet Amrani',
      email: 'contact@amrani.ma',
      phone: '+212 6 44 90 11 03',
      sector: 'sante',
      city: 'Fès',
      message: 'Nous cherchons à refaire notre page de contact et notre parcours de rendez-vous.',
      budget: '10 000 – 15 000 DH',
      status: 'contacte',
      assignedTo: 'Youssef Tazi',
      notes: 'Rappeler après 14h.',
    },
    {
      id: 'req-003',
      at: d2(-3),
      kind: 'diagnostic',
      name: 'Imane Tazi',
      org: 'Crèche Petit Monde',
      email: 'direction@petitmonde.ma',
      phone: '+212 6 55 12 90 07',
      sector: 'enseignement',
      city: 'Casablanca',
      message: 'Diagnostic offert, petite structure de 20 enfants.',
      budget: '—',
      status: 'planifie',
      assignedTo: 'Nada Bennani',
      notes: 'Créneau proposé mardi 10h.',
    },
  ],
  concierges: [
    {
      id: 'conc-001',
      name: 'Yassine El Mansouri',
      email: 'concierge.sante@allneeds.ma',
      active: true,
      sectors: ['sante'],
      assignedOrgIds: ['org-nour'],
      createdOrgIds: [],
    },
  ],
  teamMembers: [],
  commercialOpportunities: [],
  activities: [
    { id: 'activity-01', at: d2(-1), actor: 'Nada Bennani', role: 'Pilotage ALLNEEDS', orgId: 'org-amal', organization: 'École Al Amal', type: 'analyse', text: 'A relu le diagnostic et isolé les trois priorités à valider avec la direction.' },
    { id: 'activity-02', at: d2(-1, 11), actor: 'Amina Bennani', role: 'Direction · Enseignement', orgId: 'org-amal', organization: 'École Al Amal', type: 'decision', text: 'A transmis les chiffres d’inscription anonymisés pour préparer le point de suivi.' },
    { id: 'activity-03', at: d2(0, 8, 45), actor: 'Yassine El Mansouri', role: 'Concierge', orgId: 'org-riad', organization: 'Riad Lumen', type: 'action', text: 'A préparé la relance sur les réservations directes avant le prochain rendez-vous.' },
    { id: 'activity-04', at: d2(0, 9, 5), actor: 'Salma Ouazzani', role: 'Direction · Tourisme', orgId: 'org-riad', organization: 'Riad Lumen', type: 'progression', text: 'A confirmé ses canaux de réservation prioritaires pour le diagnostic.' },
    { id: 'activity-05', at: d2(-2), actor: 'Atlas Logiciels', role: 'Partenaire', orgId: 'org-amal', organization: 'École Al Amal', type: 'action', text: 'A déposé une proposition mise à jour avec périmètre, calendrier et livrables.' },
    { id: 'activity-06', at: d2(-2, 14), actor: 'Dr Youssef Idrissi', role: 'Direction · Santé', orgId: 'org-nour', organization: 'Clinique Nour', type: 'decision', text: 'A demandé une précision sur le suivi des rendez-vous avant de valider la prochaine étape.' },
  ],
  saasAccess: { enseignement: false, sante: true, tourisme: false },
  saasAccessByOrg: { 'org-amal': false, 'org-nour': true, 'org-riad': false },
  saasRolesByOrg: { 'org-amal': [], 'org-nour': ['directeur', 'reception', 'comptabilite'], 'org-riad': [] },
  saasActivatedAtByOrg: { 'org-amal': null, 'org-nour': DEMO_NOW, 'org-riad': null },
  registrationProfile: null,
  clientWorkspaceRole: 'dirigeant',
  bookings: [
    {
      id: 'bk-001',
      at: d2(2),
      createdAt: d2(-6),
      org: 'École Al Amal',
      name: 'Amina Bennani',
      role: 'Directrice',
      email: 'a.bennani@al-amal.ma',
      phone: '+212 6 22 41 08 90',
      sector: 'enseignement',
      city: 'Casablanca',
      headcount: '18 salariés',
      date: d2(12).slice(0, 10),
      slot: '10:00 – 11:30',
      format: 'sur_site',
      topic: 'Campagne d’inscription 2027',
      status: 'confirme',
    },
    {
      id: 'bk-002',
      at: d2(3),
      createdAt: d2(-1),
      org: 'Riad Lumen',
      name: 'Salma Ouazzani',
      role: 'Gérante',
      email: 'salma@riad-lumen.ma',
      phone: '+212 6 11 55 90 34',
      sector: 'tourisme',
      city: 'Marrakech',
      headcount: '11 collaborateurs',
      date: d2(9).slice(0, 10),
      slot: '14:00 – 15:30',
      format: 'visio',
      topic: 'Réduire la dépendance aux plateformes',
      status: 'propose',
    },
  ],
  toasts: [],
  now: DEMO_NOW,
}

function d2(offsetDays: number) {
  const base = new Date(DEMO_NOW)
  base.setDate(base.getDate() + offsetDays)
  return base.toISOString()
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

function stamp(base: string, offsetMinutes = 0) {
  return new Date(new Date(base).getTime() + offsetMinutes * 60000).toISOString()
}

/* ------------------------------------------------------------------ */
/* Actions                                                             */
/* ------------------------------------------------------------------ */

export type DemoAction =
  | { type: 'RESET' }
  | { type: 'SET_ROLE'; role: Role }
  | { type: 'SAAS_SET_ACCESS'; sector: Sector; value: boolean }
  | { type: 'SAAS_SET_ORG_ACCESS'; orgId: string; value: boolean }
  | { type: 'SAAS_SET_ORG_ROLE'; orgId: string; role: SanteSaasRole; value: boolean }
  | { type: 'REGISTRATION_SET'; profile: NonNullable<DemoState['registrationProfile']> }
  | { type: 'REGISTRATION_ACTIVATION_SET'; value: boolean }
  | { type: 'CLIENT_WORKSPACE_ROLE_SET'; role: ClientWorkspaceRole }
  | { type: 'TEAM_MEMBER_CREATE'; member: Omit<ClientTeamMember, 'id' | 'createdAt' | 'status'> }
  | { type: 'TEAM_MEMBER_REVOKE'; id: string }
  | { type: 'TEAM_MEMBER_ROLE_SET'; id: string; role: ClientTeamMember['role'] }
  | { type: 'PROVIDER_PATCH'; id: string; patch: Partial<Provider> }
  | { type: 'COMMERCIAL_OPPORTUNITY_CREATE'; opportunity: Omit<CommercialOpportunity, 'id' | 'createdAt' | 'status'> }
  | { type: 'COMMERCIAL_OPPORTUNITY_STATUS_SET'; id: string; status: CommercialOpportunity['status'] }
  | { type: 'CONCIERGE_CREATE'; account: ConciergeAccount }
  | { type: 'CONCIERGE_TOGGLE'; id: string }
  | { type: 'CONCIERGE_ASSIGN_ORG'; id: string; orgId: string; value: boolean }
  | { type: 'CONCIERGE_ASSIGN_SECTOR'; id: string; sector: Sector; value: boolean }
  | { type: 'CONCIERGE_ADD_ORG'; conciergeId: string; org: ClientOrg }
  | { type: 'SWITCH_USER'; userId: string }
  | { type: 'SET_ONBOARDED'; value: boolean }
  | { type: 'TOAST_ADD'; toast: Omit<Toast, 'id'> }
  | { type: 'TOAST_REMOVE'; id: string }
  | { type: 'REQUEST_CREATE'; request: Omit<PublicRequest, 'id' | 'at' | 'status' | 'assignedTo' | 'notes'> }
  | { type: 'REQUEST_SET_STATUS'; id: string; status: PublicRequest['status'] }
  | { type: 'REQUEST_ASSIGN'; id: string; assignedTo: string }
  | { type: 'BOOKING_CREATE'; booking: Omit<PublicBooking, 'id' | 'createdAt' | 'status'> }
  | { type: 'BOOKING_SET_STATUS'; id: string; status: PublicBooking['status'] }
  | { type: 'NEED_CREATE'; need: Need }
  | { type: 'NEED_SET_STATUS'; id: string; status: NeedStatus; label?: string }
  | { type: 'NEED_ADD_PROVIDER'; needId: string; providerId: string }
  | { type: 'QUOTE_ADD'; quote: Quote }
  | { type: 'QUOTE_SET_STATUS'; id: string; status: Quote['status'] }
  | { type: 'MEETING_SET_STATUS'; id: string; status: MeetingStatus }
  | { type: 'MEETING_CREATE'; meeting: Omit<Meeting, 'id' | 'status'> }
  | { type: 'THREAD_CREATE'; thread: Omit<(typeof THREADS)[number], 'id' | 'lastAt' | 'unread'> }
  | {
      type: 'MESSAGE_SEND'
      threadId: string
      body: string
      author: MessageAuthor
      authorName: string
      orgId?: string
    }
  | { type: 'DOC_SET_STATUS'; id: string; status: DocStatus; comment?: string }
  | { type: 'DELIVERABLE_SET_STATUS'; id: string; status: DeliverableStatus }
  | { type: 'MISSION_SET_STATUS'; id: string; status: MissionStatus }
  | { type: 'MILESTONE_SET_STATUS'; missionId: string; milestoneId: string; status: MilestoneStatus }
  | { type: 'DIAGNOSTIC_PUBLISH'; id: string }
  | { type: 'DIAGNOSTIC_BACK_TO_REVIEW'; id: string }
  | { type: 'DIAGNOSTIC_SAVE'; diagnostic: typeof DIAGNOSTICS[number] }
  | { type: 'LEAD_SET_STAGE'; id: string; stage: LeadStage }
  | { type: 'LEAD_PATCH'; id: string; patch: Partial<Lead> }
  | { type: 'LEAD_CREATE'; lead: Lead }
  | { type: 'LEADS_DEMO_SET'; leads: Lead[] }
  | { type: 'LEADS_DEMO_RESET' }
  | { type: 'NOTIF_READ'; id: string }
  | { type: 'NOTIF_READ_ALL' }
  | { type: 'SUBSCRIPTION_PATCH'; patch: Partial<DemoState['subscription']> }
  | { type: 'SUBSCRIPTION_CONSUME'; count: number }
  | { type: 'SUBSCRIPTION_CANCEL' }

/* ------------------------------------------------------------------ */
/* Reducer                                                             */
/* ------------------------------------------------------------------ */

function withToast(state: DemoState, title: string, description: string, tone: Toast['tone'] = 'success'): DemoState {
  const toast: Toast = { id: uid('toast'), title, description, tone }
  return { ...state, toasts: [...state.toasts, toast] }
}

function withActivity(state: DemoState, activity: Omit<DemoActivity, 'id' | 'at'>): DemoState {
  return { ...state, activities: [{ ...activity, id: uid('activity'), at: state.now }, ...(state.activities ?? [])].slice(0, 80) }
}

function activityActor(state: DemoState) {
  if (state.role === 'admin') return { actor: 'Nada Bennani', role: 'Pilotage ALLNEEDS' }
  if (state.role === 'concierge') return { actor: 'Yassine El Mansouri', role: 'Concierge' }
  if (state.role === 'client') {
    const client = DEMO_CLIENT_PROFILES[state.userId as keyof typeof DEMO_CLIENT_PROFILES]
    return { actor: client?.name ?? 'Équipe de l’établissement', role: client?.roleLabel ?? 'Espace client' }
  }
  return { actor: state.providers[0]?.name ?? 'Partenaire', role: 'Partenaire' }
}

function reducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'RESET':
      return { ...initialState, toasts: [] }

    case 'SET_ROLE':
      return { ...state, role: action.role }

    case 'SAAS_SET_ACCESS':
      return { ...state, saasAccess: { ...state.saasAccess, [action.sector]: action.value } }

    case 'SAAS_SET_ORG_ACCESS':
      return {
        ...state,
        saasAccessByOrg: { ...state.saasAccessByOrg, [action.orgId]: action.value },
        saasActivatedAtByOrg: { ...state.saasActivatedAtByOrg, [action.orgId]: action.value ? (state.saasActivatedAtByOrg[action.orgId] ?? state.now) : null },
      }

    case 'SAAS_SET_ORG_ROLE': {
      const current = state.saasRolesByOrg[action.orgId] ?? []
      const next = action.value ? Array.from(new Set([...current, action.role])) : current.filter((role) => role !== action.role)
      return { ...state, saasRolesByOrg: { ...state.saasRolesByOrg, [action.orgId]: next } }
    }

    case 'REGISTRATION_SET':
      return { ...state, registrationProfile: action.profile }

    case 'REGISTRATION_ACTIVATION_SET':
      return state.registrationProfile ? { ...state, registrationProfile: { ...state.registrationProfile, activated: action.value } } : state

    case 'CLIENT_WORKSPACE_ROLE_SET':
      return { ...state, clientWorkspaceRole: action.role }

    case 'TEAM_MEMBER_CREATE': {
      const exists = state.teamMembers.some((member) => member.orgId === action.member.orgId && member.email.toLowerCase() === action.member.email.toLowerCase())
      if (exists) return withToast(state, 'Accès déjà enregistré', 'Cette adresse e-mail possède déjà un accès pour cet établissement.', 'warning')
      const member: ClientTeamMember = { ...action.member, id: uid('team'), createdAt: state.now, status: 'invitation_en_attente' }
      const org = state.orgs.find((item) => item.id === member.orgId)
      return withToast(withActivity({ ...state, teamMembers: [member, ...state.teamMembers] }, { ...activityActor(state), orgId: member.orgId, organization: org?.name ?? 'Établissement', type: 'action', text: `A préparé un accès ${member.role === 'manager' ? 'responsable' : 'collaborateur'} pour ${member.name}.` }), 'Accès préparé', 'Cette invitation est enregistrée dans la démonstration. Aucun e-mail n’a été envoyé.', 'info')
    }

    case 'TEAM_MEMBER_REVOKE':
      return withToast(withActivity({ ...state, teamMembers: state.teamMembers.filter((member) => member.id !== action.id) }, { ...activityActor(state), orgId: state.teamMembers.find((member) => member.id === action.id)?.orgId ?? '', organization: state.orgs.find((org) => org.id === state.teamMembers.find((member) => member.id === action.id)?.orgId)?.name ?? 'Établissement', type: 'decision', text: `A retiré l’accès de ${state.teamMembers.find((member) => member.id === action.id)?.name ?? 'un membre'}.` }), 'Accès retiré', 'Le membre a été retiré de la liste de démonstration.')

    case 'TEAM_MEMBER_ROLE_SET':
      return withActivity({ ...state, teamMembers: state.teamMembers.map((member) => member.id === action.id ? { ...member, role: action.role, access: action.role === 'manager' ? ['actions', 'missions', 'documents', 'messages', 'results', 'team'] : ['actions', 'missions', 'documents', 'messages'] } : member) }, { ...activityActor(state), orgId: state.teamMembers.find((member) => member.id === action.id)?.orgId ?? '', organization: state.orgs.find((org) => org.id === state.teamMembers.find((member) => member.id === action.id)?.orgId)?.name ?? 'Établissement', type: 'decision', text: `A ajusté le rôle de ${state.teamMembers.find((member) => member.id === action.id)?.name ?? 'un membre'} en « ${action.role === 'manager' ? 'responsable' : 'collaborateur'} ».` })

    case 'PROVIDER_PATCH':
      return withActivity({ ...state, providers: state.providers.map((provider) => provider.id === action.id ? { ...provider, ...action.patch } : provider) }, { ...activityActor(state), orgId: '', organization: state.providers.find((provider) => provider.id === action.id)?.name ?? 'Profil partenaire', type: 'progression', text: 'A actualisé ses informations et ses disponibilités de prestation.' })

    case 'COMMERCIAL_OPPORTUNITY_CREATE': {
      const exists = state.commercialOpportunities.some((item) => item.orgId === action.opportunity.orgId && item.offerCode === action.opportunity.offerCode && !['acceptee', 'refusee'].includes(item.status))
      if (exists) return withToast(state, 'Piste déjà ouverte', 'Cette offre complémentaire est déjà suivie pour cette entreprise.', 'warning')
      const opportunity: CommercialOpportunity = { ...action.opportunity, id: uid('opportunity'), createdAt: state.now, status: 'a_qualifier' }
      return withToast({ ...state, commercialOpportunities: [opportunity, ...state.commercialOpportunities] }, 'Piste commerciale créée', 'Qualifiez le besoin avec le dirigeant avant de préparer une proposition.', 'success')
    }

    case 'COMMERCIAL_OPPORTUNITY_STATUS_SET':
      return { ...state, commercialOpportunities: state.commercialOpportunities.map((item) => item.id === action.id ? { ...item, status: action.status } : item) }

    case 'CONCIERGE_CREATE':
      return withToast({ ...state, concierges: [action.account, ...state.concierges] }, 'Compte concierge créé', action.account.email)

    case 'CONCIERGE_TOGGLE':
      return { ...state, concierges: state.concierges.map((c) => c.id === action.id ? { ...c, active: !c.active } : c) }

    case 'CONCIERGE_ASSIGN_ORG':
      return { ...state, concierges: state.concierges.map((c) => c.id === action.id ? { ...c, assignedOrgIds: action.value ? Array.from(new Set([...c.assignedOrgIds, action.orgId])) : c.assignedOrgIds.filter((x) => x !== action.orgId) } : c) }

    case 'CONCIERGE_ASSIGN_SECTOR':
      return { ...state, concierges: state.concierges.map((c) => c.id === action.id ? { ...c, sectors: action.value ? Array.from(new Set([...c.sectors, action.sector])) : c.sectors.filter((x) => x !== action.sector) } : c) }

    case 'CONCIERGE_ADD_ORG':
      return withToast({ ...state, orgs: [action.org, ...state.orgs], concierges: state.concierges.map((c) => c.id === action.conciergeId ? { ...c, createdOrgIds: [action.org.id, ...c.createdOrgIds] } : c) }, 'Entreprise ajoutée', action.org.name)

    case 'SWITCH_USER':
      return { ...state, userId: action.userId }

    case 'SET_ONBOARDED':
      return { ...state, onboarded: action.value }

    case 'TOAST_ADD':
      return withToast(state, action.toast.title, action.toast.description ?? '', action.toast.tone)

    case 'TOAST_REMOVE':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) }

    case 'REQUEST_CREATE':
      return withToast(
        {
          ...state,
          requests: [
            {
              ...action.request,
              id: uid('req'),
              at: state.now,
              status: 'nouveau',
              assignedTo: 'Non assigné',
              notes: '',
            },
            ...state.requests,
          ],
        },
        'Demande enregistrée dans la démo',
        'Cette version conserve les données dans ce navigateur ; aucune demande n’est transmise à l’équipe.',
        'success',
      )

    case 'REQUEST_SET_STATUS':
      return { ...state, requests: state.requests.map((r) => (r.id === action.id ? { ...r, status: action.status } : r)) }

    case 'REQUEST_ASSIGN':
      return { ...state, requests: state.requests.map((r) => (r.id === action.id ? { ...r, assignedTo: action.assignedTo } : r)) }

    case 'BOOKING_CREATE':
      return withToast(
        {
          ...state,
          bookings: [
            { ...action.booking, id: uid('bk'), createdAt: state.now, status: 'confirme' },
            ...state.bookings,
          ],
        },
        'Créneau enregistré dans la démo',
        'Aucun e-mail ni message WhatsApp n’est envoyé par cette version.',
        'success',
      )

    case 'BOOKING_SET_STATUS':
      return { ...state, bookings: state.bookings.map((b) => (b.id === action.id ? { ...b, status: action.status } : b)) }

    case 'NEED_CREATE':
      return withToast(
        {
          ...state,
          needs: [action.need, ...state.needs],
          subscription: {
            ...state.subscription,
            consumed: state.subscription.consumed + 1,
          },
        },
        'Besoin enregistré',
        'Votre recherche de prestataires est lancée.',
        'success',
      )

    case 'NEED_SET_STATUS':
      return withActivity({
        ...state,
        needs: state.needs.map((need) =>
          need.id === action.id
            ? {
                ...need,
                status: action.status,
                timeline: action.label
                  ? [...need.timeline, { at: state.now, label: action.label }]
                  : need.timeline,
              }
            : need,
        ),
      }, { ...activityActor(state), orgId: state.needs.find((need) => need.id === action.id)?.orgId ?? '', organization: state.orgs.find((org) => org.id === state.needs.find((need) => need.id === action.id)?.orgId)?.name ?? 'Demande client', type: 'progression', text: action.label ?? `A fait avancer la demande vers « ${action.status.replaceAll('_', ' ')} ».` })

    case 'NEED_ADD_PROVIDER': {
      const need = state.needs.find((n) => n.id === action.needId)
      if (!need || need.candidateIds.includes(action.providerId)) return state
      return {
        ...state,
        needs: state.needs.map((n) =>
          n.id === action.needId
            ? {
                ...n,
                candidateIds: [...n.candidateIds, action.providerId],
                status: n.status === 'recherche' || n.status === 'recu' || n.status === 'analyse' ? 'propositions' : n.status,
                timeline: [...n.timeline, { at: state.now, label: 'Prestataire proposé' }],
              }
            : n,
        ),
      }
    }

    case 'QUOTE_ADD':
      return withActivity({
        ...state,
        quotes: [action.quote, ...state.quotes],
        needs: state.needs.map((n) =>
          n.id === action.quote.needId ? { ...n, quoteIds: [...n.quoteIds, action.quote.id], status: 'devis' } : n,
        ),
      }, { ...activityActor(state), orgId: state.needs.find((need) => need.id === action.quote.needId)?.orgId ?? '', organization: state.orgs.find((org) => org.id === state.needs.find((need) => need.id === action.quote.needId)?.orgId)?.name ?? 'Demande client', type: 'action', text: `A transmis une proposition de ${action.quote.amount.toLocaleString('fr-FR')} MAD, avec délai et périmètre.` })

    case 'QUOTE_SET_STATUS':
      return withActivity({
        ...state,
        quotes: state.quotes.map((q) => (q.id === action.id ? { ...q, status: action.status } : q)),
      }, { ...activityActor(state), orgId: state.needs.find((need) => need.id === state.quotes.find((quote) => quote.id === action.id)?.needId)?.orgId ?? '', organization: state.orgs.find((org) => org.id === state.needs.find((need) => need.id === state.quotes.find((quote) => quote.id === action.id)?.needId)?.orgId)?.name ?? 'Proposition partenaire', type: action.status === 'accepte' || action.status === 'refuse' ? 'decision' : 'progression', text: `La proposition est maintenant « ${action.status.replaceAll('_', ' ')} ».` })

    case 'MEETING_SET_STATUS':
      return { ...state, meetings: state.meetings.map((m) => (m.id === action.id ? { ...m, status: action.status } : m)) }

    case 'MEETING_CREATE':
      return withToast(
        { ...state, meetings: [{ ...action.meeting, id: uid('meet'), status: 'confirme' }, ...state.meetings] },
        'Rendez-vous confirmé',
        action.meeting.title,
        'success',
      )

    case 'THREAD_CREATE':
      return {
        ...state,
        threads: [{ ...action.thread, id: uid('th'), lastAt: state.now, unread: 0 }, ...state.threads],
      }

    case 'MESSAGE_SEND': {
      const thread = state.threads.find((t) => t.id === action.threadId)
      const orgId = action.orgId ?? thread?.orgId ?? 'org-amal'
      const readerIsClient = state.role !== 'admin'
      const isOwn = action.author === 'client' ? readerIsClient : !readerIsClient
      const orgName = state.orgs.find((org) => org.id === orgId)?.name ?? 'Dossier client'
      return withActivity({
        ...state,
        messages: [
          ...state.messages,
          {
            id: uid('msg'),
            orgId,
            threadId: action.threadId,
            author: action.author,
            authorName: action.authorName,
            at: state.now,
            body: action.body,
            read: isOwn,
          },
        ],
        threads: state.threads.map((t) =>
          t.id === action.threadId
            ? { ...t, lastAt: state.now, unread: isOwn ? t.unread : t.unread + 1 }
            : t,
        ),
      }, { actor: action.authorName, role: action.author === 'client' ? 'Équipe cliente' : 'Équipe ALLNEEDS', orgId, organization: orgName, type: 'action', text: `A partagé une mise à jour dans la conversation : « ${action.body.slice(0, 110)}${action.body.length > 110 ? '…' : ''} »` })
    }

    case 'DOC_SET_STATUS':
      return withActivity({
        ...state,
        documents: state.documents.map((doc) =>
          doc.id === action.id ? { ...doc, status: action.status, comment: action.comment ?? doc.comment, updatedAt: state.now } : doc,
        ),
      }, { ...activityActor(state), orgId: state.documents.find((doc) => doc.id === action.id)?.orgId ?? '', organization: state.orgs.find((org) => org.id === state.documents.find((doc) => doc.id === action.id)?.orgId)?.name ?? 'Dossier client', type: action.status === 'valide' ? 'progression' : 'action', text: `${state.documents.find((doc) => doc.id === action.id)?.name ?? 'Document'} : statut mis à jour vers « ${action.status.replaceAll('_', ' ')} ».` })

    case 'DELIVERABLE_SET_STATUS':
      return withActivity({
        ...state,
        deliverables: state.deliverables.map((d) => (d.id === action.id ? { ...d, status: action.status, updatedAt: state.now } : d)),
      }, { ...activityActor(state), orgId: state.missions.find((mission) => mission.id === state.deliverables.find((item) => item.id === action.id)?.missionId)?.orgId ?? '', organization: state.orgs.find((org) => org.id === state.missions.find((mission) => mission.id === state.deliverables.find((item) => item.id === action.id)?.missionId)?.orgId)?.name ?? 'Livrable de mission', type: action.status === 'valide' ? 'progression' : 'action', text: `${state.deliverables.find((item) => item.id === action.id)?.title ?? 'Un livrable'} a été mis à jour : « ${action.status.replaceAll('_', ' ')} ».` })

    case 'MISSION_SET_STATUS':
      return withActivity({ ...state, missions: state.missions.map((m) => (m.id === action.id ? { ...m, status: action.status } : m)) }, { ...activityActor(state), orgId: state.missions.find((mission) => mission.id === action.id)?.orgId ?? '', organization: state.orgs.find((org) => org.id === state.missions.find((mission) => mission.id === action.id)?.orgId)?.name ?? 'Mission', type: action.status === 'terminee' ? 'decision' : 'progression', text: `La mission a évolué vers « ${action.status.replaceAll('_', ' ')} ».` })

    case 'MILESTONE_SET_STATUS':
      return withActivity({
        ...state,
        missions: state.missions.map((m) =>
          m.id === action.missionId
            ? { ...m, milestones: m.milestones.map((ms) => (ms.id === action.milestoneId ? { ...ms, status: action.status } : ms)) }
            : m,
        ),
      }, { ...activityActor(state), orgId: state.missions.find((mission) => mission.id === action.missionId)?.orgId ?? '', organization: state.orgs.find((org) => org.id === state.missions.find((mission) => mission.id === action.missionId)?.orgId)?.name ?? 'Mission', type: action.status === 'fait' ? 'progression' : 'action', text: `Un jalon de mission a évolué vers « ${action.status.replaceAll('_', ' ')} ».` })

    case 'DIAGNOSTIC_PUBLISH': {
      const diag = state.diagnostics.find((x) => x.id === action.id)
      const published = { ...state, diagnostics: state.diagnostics.map((x) => (x.id === action.id ? { ...x, status: 'publie' as const, publishedAt: state.now } : x)) }
      const org = state.orgs.find((item) => item.id === diag?.orgId)
      return withToast(withActivity(published, { ...activityActor(state), orgId: diag?.orgId ?? '', organization: org?.name ?? 'Dossier client', type: 'progression', text: `A publié le diagnostic ${diag?.ref ?? ''} avec les priorités à suivre.` }), 'Diagnostic publié', `Réf. ${diag?.ref ?? ''} — visible dans l’espace client.`)
    }

    case 'DIAGNOSTIC_BACK_TO_REVIEW':
      return {
        ...state,
        diagnostics: state.diagnostics.map((x) =>
          x.id === action.id ? { ...x, status: 'en_revue' as const, publishedAt: null } : x,
        ),
      }

    case 'DIAGNOSTIC_SAVE': {
      const exists = state.diagnostics.some((x) => x.id === action.diagnostic.id)
      return {
        ...state,
        diagnostics: exists
          ? state.diagnostics.map((x) => (x.id === action.diagnostic.id ? action.diagnostic : x))
          : [action.diagnostic, ...state.diagnostics],
      }
    }

    case 'LEAD_SET_STAGE':
      return withActivity({
        ...state,
        leads: state.leads.map((l) =>
          l.id === action.id ? { ...l, stage: action.stage, lastContactAt: state.now } : l,
        ),
      }, { ...activityActor(state), orgId: '', organization: state.leads.find((lead) => lead.id === action.id)?.orgName ?? 'Prospect', type: action.stage === 'gagne' || action.stage === 'perdu' ? 'decision' : 'progression', text: `A fait évoluer le dossier vers l’étape « ${action.stage.replaceAll('_', ' ')} ».` })

    case 'LEAD_PATCH':
      return withActivity({ ...state, leads: state.leads.map((l) => (l.id === action.id ? { ...l, ...action.patch } : l)) }, { ...activityActor(state), orgId: '', organization: state.leads.find((lead) => lead.id === action.id)?.orgName ?? 'Prospect', type: 'action', text: action.patch.nextAction ? `Action consignée · ${action.patch.nextAction}` : 'Le dossier prospect a été actualisé.' })

    case 'LEAD_CREATE':
      return withToast({ ...state, leads: [action.lead, ...state.leads] }, 'Lead créé', action.lead.orgName)

    case 'LEADS_DEMO_SET':
      return withToast(withActivity({ ...state, leads: action.leads }, { ...activityActor(state), orgId: '', organization: 'Portefeuille de prospection', type: 'action', text: 'A préparé une journée de prospection simulée : 30 établissements répartis entre santé, enseignement et tourisme.' }), 'Journée de prospection prête', '30 entreprises fictives · 10 par secteur · actions de démonstration disponibles.', 'info')

    case 'LEADS_DEMO_RESET':
      return withToast({ ...state, leads: LEADS }, 'Pipeline initial restauré', 'Les données de démonstration d’origine sont revenues.', 'info')

    case 'NOTIF_READ':
      return { ...state, notifications: state.notifications.map((n) => (n.id === action.id ? { ...n, read: true } : n)) }

    case 'NOTIF_READ_ALL':
      return { ...state, notifications: state.notifications.map((n) => ({ ...n, read: true })) }

    case 'SUBSCRIPTION_PATCH':
      return { ...state, subscription: { ...state.subscription, ...action.patch } }

    case 'SUBSCRIPTION_CONSUME':
      return {
        ...state,
        subscription: { ...state.subscription, consumed: state.subscription.consumed + action.count },
      }

    case 'SUBSCRIPTION_CANCEL':
      return withToast(
        { ...state, subscription: { ...state.subscription, status: 'expire', autoRenew: false } },
        'Résiliation enregistrée',
        'Préavis de 30 jours avant l’échéance.',
        'info',
      )

    default:
      return state
  }
}

/* ------------------------------------------------------------------ */
/* Context                                                             */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'allneeds.demo.v2'

interface StoreValue {
  state: DemoState
  dispatch: (action: DemoAction) => void
  user: AppUser
  role: Role
  setRole: (role: Role) => void
  orgId: string
}

const DemoContext = createContext<StoreValue | null>(null)

function load(): DemoState {
  if (typeof window === 'undefined') return initialState
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState
    const parsed = JSON.parse(raw) as Partial<DemoState>
    return { ...initialState, ...parsed, activities: parsed.activities ?? initialState.activities, teamMembers: parsed.teamMembers ?? [], commercialOpportunities: parsed.commercialOpportunities ?? [], toasts: [] }
  } catch {
    return initialState
  }
}

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, toasts: [] }))
    } catch {
      /* quota ou mode privé : la démo reste utilisable en mémoire */
    }
  }, [state])

  const setRole = useCallback((role: Role) => dispatch({ type: 'SET_ROLE', role }), [])

  const value = useMemo<StoreValue>(() => {
    const concierge = state.concierges.find((item) => item.id === state.userId) ?? state.concierges[0]
    const clientProfile = DEMO_CLIENT_PROFILES[state.userId as keyof typeof DEMO_CLIENT_PROFILES] ?? DEMO_CLIENT_PROFILES['usr-amina']
    const user: AppUser = {
      id: state.userId,
      orgId: state.role === 'client' ? clientProfile.orgId : '',
      name: state.role === 'admin' ? 'Nada Bennani' : state.role === 'concierge' ? (concierge?.name ?? 'Concierge ALLNEEDS') : clientProfile.name,
      email: state.role === 'admin' ? 'nada@allneeds.ma' : state.role === 'concierge' ? (concierge?.email ?? 'concierge@allneeds.ma') : clientProfile.email,
      role: state.role === 'admin' ? 'admin' : state.role === 'concierge' ? 'concierge' : 'direction',
      roleLabel: state.role === 'admin' ? 'ALLNEEDS · Administrateur' : state.role === 'concierge' ? 'ALLNEEDS · Concierge' : clientProfile.roleLabel,
      initials: state.role === 'admin' ? 'NB' : state.role === 'concierge' ? 'YM' : clientProfile.initials,
    }
    return {
      state,
      dispatch,
      user,
      role: state.role,
      setRole,
      orgId: state.role === 'client' ? clientProfile.orgId : '',
    }
  }, [state, setRole])

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo(): StoreValue {
  const ctx = useContext(DemoContext)
  if (!ctx) throw new Error('useDemo doit être utilisé dans DemoStoreProvider')
  return ctx
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */


export function conciergeScope(state: DemoState, conciergeId = state.userId) {
  const concierge = state.concierges.find((item) => item.id === conciergeId) ?? state.concierges[0]
  const orgIds = new Set([...(concierge?.assignedOrgIds ?? []), ...(concierge?.createdOrgIds ?? [])])
  const orgs = state.orgs.filter((org) => orgIds.has(org.id) && (concierge?.sectors.includes(org.sector) ?? false))
  return { concierge, orgIds: new Set(orgs.map((org) => org.id)), orgs }
}

export function orgHasSaasAccess(state: DemoState, orgId: string, sector: Sector) {
  return state.saasAccessByOrg[orgId] ?? state.saasAccess[sector] ?? false
}

export function makeNeed(input: {
  orgId: string
  title: string
  category: Need['category']
  categoryLabel: string
  description: string
  location: string
  budgetMax: number | null
  urgency: Need['urgency']
  deadline: string | null
}): Need {
  return {
    id: uid('need'),
    orgId: input.orgId,
    title: input.title,
    category: input.category,
    categoryLabel: input.categoryLabel,
    status: 'recu',
    urgency: input.urgency,
    budgetMax: input.budgetMax,
    submittedAt: DEMO_NOW,
    deadline: input.deadline,
    description: input.description,
    location: input.location,
    candidateIds: [],
    quoteIds: [],
    assignedTo: 'Nada (ALLNEEDS)',
    timeline: [{ at: DEMO_NOW, label: 'Demande reçue' }],
  }
}

export function makeQuote(input: {
  needId: string
  providerId: string
  amount: number
  delayWeeks: number
  validUntil: string
  detail: string
  breakdown: { label: string; amount: number }[]
}): Quote {
  return {
    id: uid('quote'),
    needId: input.needId,
    providerId: input.providerId,
    amount: input.amount,
    currency: 'MAD',
    delayWeeks: input.delayWeeks,
    validUntil: input.validUntil,
    status: 'recu',
    receivedAt: DEMO_NOW,
    detail: input.detail,
    breakdown: input.breakdown,
  }
}

export function makeBookingDate(days: number) {
  const base = new Date(DEMO_NOW)
  base.setDate(base.getDate() + days)
  return base.toISOString()
}

export function tierLimit(tier: DemoState['subscription']['tier'], key: 'needsPerYear' | 'concurrentNeeds') {
  const offer = ACCESS_OFFERS.find((o) => o.tier === tier)
  return offer ? offer[key] : 0
}

export function providerById(providers: Provider[], id: string) {
  return providers.find((p) => p.id === id)
}

export function missionById(missions: Mission[], id: string | null) {
  if (!id) return undefined
  return missions.find((m) => m.id === id)
}

export function statusLabel<T extends string>(value: T, map: Partial<Record<T, string>>) {
  return map[value] ?? value
}

export { stamp }
