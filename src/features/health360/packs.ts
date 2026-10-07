import type { DiagnosticQuestion } from './diagnosticData';
import {
  ADEQUATION_CRITERIA, CHARGES_POSTES as SANTE_CHARGES_POSTES, DEROULE, DOCUMENTS as SANTE_DOCUMENTS,
  FORMATS, GARDE_FOUS as SANTE_GARDE_FOUS, NOTATION, REGLES, QUESTIONS as SANTE_QUESTIONS,
  TRANSPARENCE as SANTE_TRANSPARENCE, VERSIONS, VOLETS as SANTE_VOLETS,
} from './diagnosticData'
import { QUESTIONS as TOURISME_QUESTIONS, VOLETS as TOURISME_VOLETS, TRANSPARENCE as TOURISME_TRANSPARENCE, DOCUMENTS as TOURISME_DOCUMENTS, GARDE_FOUS as TOURISME_GARDE_FOUS, CHARGES_POSTES as TOURISME_CHARGES_POSTES } from './diagnosticData.tourism'
import { QUESTIONS as ENSEIGNEMENT_QUESTIONS, VOLETS as ENSEIGNEMENT_VOLETS, TRANSPARENCE as ENSEIGNEMENT_TRANSPARENCE, DOCUMENTS as ENSEIGNEMENT_DOCUMENTS, GARDE_FOUS as ENSEIGNEMENT_GARDE_FOUS, CHARGES_POSTES as ENSEIGNEMENT_CHARGES_POSTES } from './diagnosticData.enseignement'

export type SectorKey = 'sante' | 'enseignement' | 'tourisme'

export interface SectorPack {
  sector: SectorKey
  label: string
  labelUpper: string
  questions: DiagnosticQuestion[]
  volets: ReadonlyArray<{id:number;title:string;subtitle:string}>
  transparency: readonly string[]
  documents: readonly string[]
  formats: ReadonlyArray<any>
  deroule: ReadonlyArray<any>
  gardeFous: readonly string[]
  notation: ReadonlyArray<any>
  regles: ReadonlyArray<any>
  chargesPostes: readonly string[]
  adequationCriteria: typeof ADEQUATION_CRITERIA
  versions: ReadonlyArray<any>
  sectorNote?: string
}

export const PACKS: Record<SectorKey, SectorPack> = {
  sante: {
    sector: 'sante', label: 'Santé', labelUpper: 'SANTÉ',
    questions: SANTE_QUESTIONS, volets: SANTE_VOLETS,
    transparency: SANTE_TRANSPARENCE, documents: SANTE_DOCUMENTS, formats: FORMATS, deroule: DEROULE,
    gardeFous: SANTE_GARDE_FOUS, notation: NOTATION, regles: REGLES, chargesPostes: SANTE_CHARGES_POSTES,
    adequationCriteria: ADEQUATION_CRITERIA, versions: VERSIONS,
    sectorNote: "Note de cadre : la sollicitation d'avis, la publicité et la présence sur les réseaux sont encadrées pour les professions de santé. L'animateur constate le niveau de maîtrise, il ne recommande aucune action sans que le professionnel ait vérifié les règles applicables.",
  },
  enseignement: {
    sector: 'enseignement', label: 'Enseignement', labelUpper: 'ENSEIGNEMENT',
    questions: ENSEIGNEMENT_QUESTIONS, volets: ENSEIGNEMENT_VOLETS,
    transparency: ENSEIGNEMENT_TRANSPARENCE, documents: ENSEIGNEMENT_DOCUMENTS, formats: FORMATS, deroule: DEROULE,
    gardeFous: ENSEIGNEMENT_GARDE_FOUS, notation: NOTATION, regles: REGLES, chargesPostes: ENSEIGNEMENT_CHARGES_POSTES,
    adequationCriteria: ADEQUATION_CRITERIA, versions: VERSIONS,
    sectorNote: "Note de cadre : aucune donnée nominative d'élève n'est collectée ; les images de mineurs exigent l'autorisation écrite des représentants légaux.",
  },
  tourisme: {
    sector: 'tourisme', label: 'Tourisme', labelUpper: 'TOURISME',
    questions: TOURISME_QUESTIONS, volets: TOURISME_VOLETS,
    transparency: TOURISME_TRANSPARENCE, documents: TOURISME_DOCUMENTS, formats: FORMATS, deroule: DEROULE,
    gardeFous: TOURISME_GARDE_FOUS, notation: NOTATION, regles: REGLES, chargesPostes: TOURISME_CHARGES_POSTES,
    adequationCriteria: ADEQUATION_CRITERIA, versions: VERSIONS,
    sectorNote: "Note de cadre : ne jamais demander de données confidentielles de clients ou d'invités ; pas de promesse chiffrée sur les réservations avant analyse.",
  },
}
