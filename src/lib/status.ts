import type { Tone } from '@/components/ui'
import type {
  DeliverableStatus,
  DocStatus,
  LeadStage,
  MeetingStatus,
  MilestoneStatus,
  MissionStatus,
  NeedStatus,
} from '@/types'

export const NEED_STATUS: Record<NeedStatus, { label: string; tone: Tone }> = {
  recu: { label: 'Reçu', tone: 'neutral' },
  analyse: { label: 'En analyse', tone: 'info' },
  recherche: { label: 'Recherche', tone: 'info' },
  propositions: { label: 'Prestataires proposés', tone: 'brand' },
  devis: { label: 'Devis reçus', tone: 'brand' },
  negociation: { label: 'Négociation', tone: 'warning' },
  signe: { label: 'Signé', tone: 'success' },
  clos: { label: 'Clos', tone: 'neutral' },
}

export const NEED_FLOW: NeedStatus[] = ['recu', 'analyse', 'recherche', 'propositions', 'devis', 'negociation', 'signe']

export const MISSION_STATUS: Record<MissionStatus, { label: string; tone: Tone }> = {
  cadrage: { label: 'Cadrage', tone: 'info' },
  en_cours: { label: 'En cours', tone: 'brand' },
  livraison: { label: 'Livraison', tone: 'warning' },
  accompagnement: { label: 'Accompagnement 30 j', tone: 'violet' },
  terminee: { label: 'Terminée', tone: 'success' },
}

export const MILESTONE_STATUS: Record<MilestoneStatus, { label: string; tone: Tone }> = {
  a_venir: { label: 'À venir', tone: 'neutral' },
  en_cours: { label: 'En cours', tone: 'brand' },
  fait: { label: 'Fait', tone: 'success' },
  bloque: { label: 'Bloqué', tone: 'danger' },
}

export const DELIVERABLE_STATUS: Record<DeliverableStatus, { label: string; tone: Tone }> = {
  en_attente: { label: 'En attente', tone: 'neutral' },
  en_relecture: { label: 'En relecture', tone: 'info' },
  retouche: { label: 'Retouche demandée', tone: 'warning' },
  valide: { label: 'Vérifié', tone: 'success' },
}

export const DOC_STATUS: Record<DocStatus, { label: string; tone: Tone }> = {
  demande: { label: 'À fournir', tone: 'warning' },
  recu: { label: 'Fourni', tone: 'info' },
  valide: { label: 'Vérifié', tone: 'success' },
}

export const MEETING_STATUS: Record<MeetingStatus, { label: string; tone: Tone }> = {
  propose: { label: 'Proposé', tone: 'warning' },
  confirme: { label: 'Confirmé', tone: 'success' },
  realise: { label: 'Réalisé', tone: 'neutral' },
  annule: { label: 'Annulé', tone: 'danger' },
}

export const LEAD_STAGE: Record<LeadStage, { label: string; tone: Tone }> = {
  nouveau: { label: 'Nouveau', tone: 'info' },
  contacte: { label: 'Contacté', tone: 'neutral' },
  diagnostic_planifie: { label: 'Diagnostic planifié', tone: 'brand' },
  proposition: { label: 'Proposition', tone: 'warning' },
  gagne: { label: 'Gagné', tone: 'success' },
  perdu: { label: 'Perdu', tone: 'danger' },
}

export const LEAD_FLOW: LeadStage[] = ['nouveau', 'contacte', 'diagnostic_planifie', 'proposition', 'gagne']

export const LEVER_LABEL: Record<string, string> = {
  inscriptions: 'Inscriptions & développement',
  image: 'Image & communication',
  equipe: 'Équipe & organisation',
  charges: 'Charges & prestataires',
  offre: 'Offre & parcours',
  frequentation: 'Distribution',
  conformite: 'Conformité',
  experience: 'Expérience',
}

export const URGENCY: Record<string, { label: string; tone: Tone }> = {
  faible: { label: 'Faible', tone: 'neutral' },
  normale: { label: 'Normale', tone: 'info' },
  haute: { label: 'Haute', tone: 'warning' },
}
