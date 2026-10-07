export type Sector = 'enseignement' | 'sante' | 'tourisme'

export type MissionCode = 'STARTER' | 'PRO' | 'PERFORMANCE'

export type AccessTier = 'CONNECT' | 'PLUS' | 'PRIORITE'

export type Levers =
  | 'inscriptions'
  | 'image'
  | 'equipe'
  | 'charges'
  | 'offre'
  | 'frequentation'
  | 'conformite'
  | 'experience'

export type LeadStage =
  | 'nouveau'
  | 'contacte'
  | 'diagnostic_planifie'
  | 'proposition'
  | 'gagne'
  | 'perdu'

export type LeadSource =
  | 'site'
  | 'recommandation'
  | 'abonnement'
  | 'appel entrant'
  | 'evenement'
  | 'linkedin'

export type NeedStatus =
  | 'recu'
  | 'analyse'
  | 'recherche'
  | 'propositions'
  | 'devis'
  | 'negociation'
  | 'signe'
  | 'clos'

export type ProviderCategory =
  | 'logiciel'
  | 'creation'
  | 'rh'
  | 'logistique'
  | 'energie'
  | 'maintenance'

export type VerificationLevel = 'base' | 'approfondie'

export type MissionStatus =
  | 'cadrage'
  | 'en_cours'
  | 'livraison'
  | 'accompagnement'
  | 'terminee'

export type MilestoneStatus = 'a_venir' | 'en_cours' | 'fait' | 'bloque'

export type DeliverableStatus = 'en_attente' | 'en_relecture' | 'valide' | 'retouche'

export type DocStatus = 'demande' | 'recu' | 'valide'

export type DiagnosticStatus = 'brouillon' | 'en_revue' | 'publie'

export type MeetingStatus = 'propose' | 'confirme' | 'realise' | 'annule'

export type MessageAuthor = 'client' | 'allneeds' | 'prestataire'

/* ------------------------------------------------------------------ */
/* Catalogue                                                           */
/* ------------------------------------------------------------------ */

export interface FeatureRow {
  label: string
  values: [string | null, string | null, string | null]
}

export interface MissionOffer {
  code: MissionCode
  step: string
  name: string
  verb: string
  tagline: string
  priceNormal: number
  priceLaunch: number | null
  priceNote: string
  payment: string
  delay: string
  idealFor: string
  intro: string
  included: { title: string; items: string[]; limit?: string }[]
  deliverables: string[]
  notIncluded: string[]
  highlights: string[]
  commitment: string
  awarenessNote?: string
  launchLabel?: string
}

export interface AccessOffer {
  tier: AccessTier
  name: string
  priceYear: number
  priceMonth: number
  audience: string
  tagline: string
  needsPerYear: number
  concurrentNeeds: number
  users: string
  providersPerNeed: number
  verification: VerificationLevel
  firstProposal: string
  quoteComparison: string
  followUp: string
  responseTime: string
  contact: string
  starterDiagnostic: string
  missionDiscount: number
  featured?: boolean
}

export interface SectorContent {
  id: Sector
  name: string
  tagline: string
  audience: string
  promise: string
  steps: { code: MissionCode; title: string; detail: string }[]
  levers: { id: Levers; name: string; detail: string }[]
  reasons: { title: string; detail: string }[]
  highlights: { title: string; detail: string }[]
  comparison: FeatureRow[]
  oneLiner: Record<MissionCode, string>
  priceNote?: string
  awarenessNote?: string
  extraNotes: { title: string; detail: string }[]
  faq: { q: string; a: string }[]
}

export interface LaunchOffer {
  label: string
  deadline: string
  condition: string
  freeDiagnostic: boolean
}

/* ------------------------------------------------------------------ */
/* Grille de diagnostic interne (STARTER)                               */
/* ------------------------------------------------------------------ */

export interface GridQuestion {
  id: string
  text: string
}

export interface GridLever {
  id: string
  name: string
  scoreNote: string
  questions: GridQuestion[]
}

export interface GridStructureField {
  id: string
  label: string
  placeholder: string
  type: 'text' | 'date' | 'select'
  options?: string[]
}

export interface GridChargeRow {
  id: string
  poste: string
}

export interface GridSynthRow {
  id: string
  label: string
  lines: number
}

export interface GridCriterion {
  id: string
  label: string
}

export interface GridReading {
  range: string
  min: number
  max: number
  action: string
}

export interface GridStep {
  range: string
  duration: string
  block: string
  objective: string
}

export interface DiagnosticGrid {
  sector: Sector
  title: string
  context: string
  structureFields: GridStructureField[]
  documents: string[]
  steps: GridStep[]
  guardrails: string[]
  levers: GridLever[]
  chargeIntro: string
  chargeRows: GridChargeRow[]
  synthRows: GridSynthRow[]
  criteria: GridCriterion[]
  criteriaNote: string
  readings: GridReading[]
  readingsNote: string
  decisions: string[]
}

export interface GridChargeDraft {
  fournisseur: string
  cost: string
  due: string
  notes: string
}

export interface GridDraft {
  sector: Sector
  fields: Record<string, string>
  documents: Record<string, boolean>
  answers: Record<string, string>
  scores: Record<string, number>
  keyPoints: Record<string, string>
  charges: Record<string, GridChargeDraft>
  synth: Record<string, string>
  criteria: Record<string, { note: number; comment: string }>
  decision: string
  decisionNotes: string
  nextStep: string
  updatedAt: string
}

/* ------------------------------------------------------------------ */
/* Entités de démonstration                                            */
/* ------------------------------------------------------------------ */

export interface ClientOrg {
  id: string
  name: string
  sector: Sector
  city: string
  kind: string
  size: string
  contactName: string
  contactRole: string
  contactEmail: string
  contactPhone: string
  onboardedAt: string | null
  createdAt: string
  tags: string[]
  notes: string
}

export interface AppUser {
  id: string
  orgId: string
  name: string
  email: string
  role: 'direction' | 'admin' | 'pedagogique' | 'concierge'
  roleLabel: string
  initials: string
}

export interface Subscription {
  tier: AccessTier
  status: 'actif' | 'expire' | 'suspendu'
  startedAt: string
  renewsAt: string
  autoRenew: boolean
  payment: 'annuel' | 'trimestriel'
  consumed: number
  poolCarriedOver: number
  starterUsed: number
}

export interface Provider {
  id: string
  name: string
  category: ProviderCategory
  categoryLabel: string
  city: string
  verification: VerificationLevel
  verifiedAt: string
  rating: number
  reviews: number
  priceLevel: 1 | 2 | 3
  priceHint: string
  responseDelay: string
  highlights: string[]
  references: string[]
  minorsCompliant: boolean
  insurance: boolean
  note: string
}

export interface Quote {
  id: string
  needId: string
  providerId: string
  amount: number
  currency: 'MAD'
  delayWeeks: number
  validUntil: string
  status: 'recu' | 'en_etude' | 'accepte' | 'refuse'
  receivedAt: string
  detail: string
  breakdown: { label: string; amount: number }[]
}

export interface Need {
  id: string
  orgId: string
  title: string
  category: ProviderCategory
  categoryLabel: string
  status: NeedStatus
  urgency: 'faible' | 'normale' | 'haute'
  budgetMax: number | null
  submittedAt: string
  deadline: string | null
  description: string
  location: string
  candidateIds: string[]
  quoteIds: string[]
  assignedTo: string
  timeline: { at: string; label: string }[]
}

export interface Milestone {
  id: string
  title: string
  status: MilestoneStatus
  dueAt: string
}

export interface Deliverable {
  id: string
  missionId: string
  title: string
  type: string
  status: DeliverableStatus
  version: number
  maxVersions: number
  updatedAt: string
  owner: string
  link: string
  sizeLabel: string
}

export interface Mission {
  id: string
  orgId: string
  code: MissionCode
  ref: string
  title: string
  status: MissionStatus
  startedAt: string
  targetEnd: string
  kickoffAt: string | null
  price: number
  levers: Levers[]
  owner: string
  leadId: string
  milestones: Milestone[]
  scope: string[]
  outOfScope: string[]
  onboardingProgress: number
}

export interface Meeting {
  id: string
  orgId: string
  missionId: string | null
  title: string
  kind: 'diagnostic' | 'cadrage' | 'pilotage' | 'bilan' | 'appel'
  at: string
  durationMin: number
  status: MeetingStatus
  location: string
  attendees: string[]
  agenda: string[]
  notes: string
}

export interface DocumentItem {
  id: string
  orgId: string
  name: string
  kind: 'contrat' | 'devis' | 'facture' | 'autorisation' | 'livrable' | 'autre'
  status: DocStatus
  updatedAt: string
  sizeLabel: string
  required: boolean
  comment: string
}

export interface Message {
  id: string
  orgId: string
  threadId: string
  author: MessageAuthor
  authorName: string
  at: string
  body: string
  read: boolean
}

export interface Thread {
  id: string
  orgId: string
  subject: string
  topic: string
  lastAt: string
  unread: number
}

export interface InternalDiagnostic {
  id: string
  orgId: string
  ref: string
  author: string
  status: DiagnosticStatus
  createdAt: string
  reviewedAt: string | null
  publishedAt: string | null
  scores: { lever: Levers; score: number }[]
  strengths: string[]
  difficulties: string[]
  opportunities: string[]
  priorities: string[]
  durationMin: number
  notes: string
}

export interface Lead {
  id: string
  orgName: string
  contactName: string
  contactRole: string
  email: string
  phone: string
  city: string
  sector: Sector
  kind: string
  headcount: string
  source: LeadSource
  stage: LeadStage
  budget: number | null
  urgency: 'faible' | 'normale' | 'haute'
  assignedTo: string
  createdAt: string
  lastContactAt: string
  nextAction: string
  nextActionAt: string
  score: number
  notes: string
  convertedOrgId: string | null
}

export interface NotificationItem {
  id: string
  at: string
  title: string
  body: string
  tone: 'info' | 'success' | 'warning'
  link: string | null
  read: boolean
}

export interface Toast {
  id: string
  title: string
  description?: string
  tone: 'info' | 'success' | 'warning'
}
