import type { Lead, Sector } from '@/types'
import { DEMO_NOW } from '@/data/demo'

type ProspectSeed = {
  sector: Sector
  org: string
  contact: string
  role: string
  city: string
  kind: string
  source: Lead['source']
  signal: string
}

// Données inventées, avec des domaines et numéros réservés aux exemples.
const PROSPECTS: ProspectSeed[] = [
  { sector: 'sante', org: 'Centre Médical Al Wifaq', contact: 'Samira El Idrissi', role: 'Directrice', city: 'Casablanca', kind: 'Centre médical', source: 'recommandation', signal: 'Accueil partagé entre téléphone et rendez-vous' },
  { sector: 'enseignement', org: 'École Les Orangers', contact: 'Nabil Amrani', role: 'Directeur', city: 'Rabat', kind: 'École privée', source: 'site', signal: 'Suivi des demandes de visite à clarifier' },
  { sector: 'tourisme', org: 'Dar Zayna', contact: 'Meryem Bennis', role: 'Gérante', city: 'Marrakech', kind: 'Maison d’hôtes', source: 'linkedin', signal: 'Demandes de réservation réparties sur plusieurs canaux' },
  { sector: 'sante', org: 'Clinique Al Manar', contact: 'Omar Chraïbi', role: 'Directeur administratif', city: 'Rabat', kind: 'Clinique', source: 'evenement', signal: 'Rappels de rendez-vous réalisés manuellement' },
  { sector: 'enseignement', org: 'Groupe Scolaire Atlas', contact: 'Hind El Fassi', role: 'Fondatrice', city: 'Marrakech', kind: 'Groupe scolaire', source: 'recommandation', signal: 'Période d’inscription à préparer' },
  { sector: 'tourisme', org: 'Riad Sable & Jasmin', contact: 'Yassir Lahlou', role: 'Gérant', city: 'Fès', kind: 'Riad', source: 'site', signal: 'Réponses clients difficiles à coordonner en haute saison' },
  { sector: 'sante', org: 'Cabinet Horizon Santé', contact: 'Nour El Khatib', role: 'Associée', city: 'Tanger', kind: 'Cabinet médical', source: 'appel entrant', signal: 'Organisation de l’accueil à revoir' },
  { sector: 'enseignement', org: 'Crèche Les Petits Nuages', contact: 'Lina Tazi', role: 'Directrice', city: 'Casablanca', kind: 'Crèche', source: 'site', signal: 'Demandes de préinscription sans tableau commun' },
  { sector: 'tourisme', org: 'Maison Bahia', contact: 'Amine Chafai', role: 'Propriétaire', city: 'Essaouira', kind: 'Maison d’hôtes', source: 'evenement', signal: 'Visibilité de l’offre avant la prochaine saison' },
  { sector: 'sante', org: 'Laboratoire Ibn Sina', contact: 'Kawtar Benjelloun', role: 'Responsable de site', city: 'Fès', kind: 'Laboratoire', source: 'recommandation', signal: 'Flux d’accueil et information à fluidifier' },
  { sector: 'enseignement', org: 'Institut Cap Avenir', contact: 'Reda Mernissi', role: 'Directeur', city: 'Agadir', kind: 'Centre de formation', source: 'linkedin', signal: 'Remplissage des sessions de formation' },
  { sector: 'tourisme', org: 'Hôtel Jardin d’Argan', contact: 'Salma Rami', role: 'Directrice', city: 'Agadir', kind: 'Hôtel', source: 'appel entrant', signal: 'Préparation de la saison et suivi des demandes directes' },
  { sector: 'sante', org: 'Centre Dentaire Sourire', contact: 'Mehdi Alaoui', role: 'Associé', city: 'Marrakech', kind: 'Centre dentaire', source: 'site', signal: 'Créneaux annulés et relances à suivre' },
  { sector: 'enseignement', org: 'École Al Qalam', contact: 'Sanae Kabbaj', role: 'Directrice', city: 'Tanger', kind: 'École privée', source: 'evenement', signal: 'Communication des admissions à harmoniser' },
  { sector: 'tourisme', org: 'Kasbah Tifawine', contact: 'Hamza El Mansouri', role: 'Gérant', city: 'Ouarzazate', kind: 'Maison d’hôtes', source: 'recommandation', signal: 'Offre et parcours de réservation à simplifier' },
  { sector: 'sante', org: 'Polyclinique Al Amal', contact: 'Imane Rahmani', role: 'Directrice des opérations', city: 'Meknès', kind: 'Polyclinique', source: 'linkedin', signal: 'Coordination de l’accueil entre services' },
  { sector: 'enseignement', org: 'École Les Amandiers', contact: 'Younes Berrada', role: 'Fondateur', city: 'Kénitra', kind: 'École privée', source: 'site', signal: 'Visites et demandes familles à mieux convertir' },
  { sector: 'tourisme', org: 'Dar Océan', contact: 'Nadia Filali', role: 'Gérante', city: 'Essaouira', kind: 'Maison d’hôtes', source: 'linkedin', signal: 'Réponses et avis clients à centraliser' },
  { sector: 'sante', org: 'Cabinet Atlas Kiné', contact: 'Anas Boulahya', role: 'Associé', city: 'Rabat', kind: 'Cabinet paramédical', source: 'appel entrant', signal: 'Planning et rappels d’absence à organiser' },
  { sector: 'enseignement', org: 'Groupe Éducatif Alif', contact: 'Maha Sefrioui', role: 'Directrice générale', city: 'Casablanca', kind: 'Groupe scolaire', source: 'recommandation', signal: 'Process d’admission multi-sites à clarifier' },
  { sector: 'tourisme', org: 'Atlas Trails', contact: 'Ilyas Kettani', role: 'Fondateur', city: 'Marrakech', kind: 'Agence d’expériences', source: 'evenement', signal: 'Capacité et suivi des demandes groupes' },
  { sector: 'sante', org: 'Centre Ophtalmo Noor', contact: 'Rania Ziani', role: 'Directrice', city: 'Tanger', kind: 'Centre de soins', source: 'site', signal: 'Parcours d’accueil et consignes à harmoniser' },
  { sector: 'enseignement', org: 'Crèche Les Colibris', contact: 'Amal Rachidi', role: 'Gérante', city: 'Marrakech', kind: 'Crèche', source: 'appel entrant', signal: 'Demandes familles et places disponibles à rapprocher' },
  { sector: 'tourisme', org: 'Riad Bab Louka', contact: 'Karim Benkirane', role: 'Gérant', city: 'Fès', kind: 'Riad', source: 'site', signal: 'Préparation de l’offre hors saison' },
  { sector: 'sante', org: 'Clinique Les Oliviers', contact: 'Leila Mansour', role: 'Directrice administrative', city: 'Casablanca', kind: 'Clinique', source: 'recommandation', signal: 'Demandes entrantes et délais de rappel' },
  { sector: 'enseignement', org: 'Académie Al Boustane', contact: 'Sofiane El Gharbi', role: 'Directeur', city: 'Agadir', kind: 'École privée', source: 'linkedin', signal: 'Suivi des réinscriptions et des visites' },
  { sector: 'tourisme', org: 'Maison des Remparts', contact: 'Aya Chraïbi', role: 'Propriétaire', city: 'Rabat', kind: 'Maison d’hôtes', source: 'recommandation', signal: 'Organisation des demandes de groupes' },
  { sector: 'sante', org: 'Centre Kiné Moulay Ismail', contact: 'Bilal El Amrani', role: 'Responsable', city: 'Meknès', kind: 'Centre paramédical', source: 'evenement', signal: 'Rendez-vous et disponibilité de l’équipe' },
  { sector: 'enseignement', org: 'Institut Horizon Pro', contact: 'Nawal Idrissi', role: 'Fondatrice', city: 'Tanger', kind: 'Centre de formation', source: 'site', signal: 'Parcours prospect jusqu’à l’inscription' },
  { sector: 'tourisme', org: 'Dar des Saisons', contact: 'Rachid El Fenn', role: 'Gérant', city: 'Chefchaouen', kind: 'Maison d’hôtes', source: 'appel entrant', signal: 'Saison haute et répartition des tâches d’accueil' },
]

const PIPELINE: Lead['stage'][] = [
  'nouveau','contacte','nouveau','diagnostic_planifie','contacte','nouveau','contacte','nouveau','proposition','contacte',
  'nouveau','diagnostic_planifie','contacte','nouveau','contacte','diagnostic_planifie','nouveau','contacte','nouveau','proposition',
  'contacte','nouveau','diagnostic_planifie','contacte','proposition','nouveau','contacte','gagne','proposition','perdu',
]

const TODAY_ACTIONS = new Set([0, 1, 2, 4, 5, 6, 7, 8, 10, 12, 13, 15])
const estimatedBudget = (index: number) => 6500 + ((index * 1873) % 17500)

export const PROSPECTING_DEMO_LEADS: Lead[] = PROSPECTS.map((prospect, index) => {
  const stage = PIPELINE[index]
  const dueOffset = TODAY_ACTIONS.has(index) ? 0 : 1 + (index % 5)
  const nextAction = stage === 'nouveau'
    ? 'Appeler pour qualifier le besoin et proposer le diagnostic Express'
    : stage === 'contacte'
      ? 'Relancer avec une question métier et convenir de la prochaine étape'
      : stage === 'diagnostic_planifie'
        ? 'Confirmer l’objectif du diagnostic et préparer les éléments utiles'
        : stage === 'proposition'
          ? 'Faire le point sur la proposition et répondre aux questions'
          : stage === 'gagne'
            ? 'Préparer le démarrage et confirmer le périmètre signé'
            : 'Consigner le motif de report et prévoir une reprise au bon moment'
  const emailName = prospect.contact.toLowerCase().replace(/[^a-z]+/g, '.')
  const now = new Date(DEMO_NOW)
  const at = (days: number) => {
    const value = new Date(now)
    value.setDate(value.getDate() + days)
    return value.toISOString()
  }
  return {
    id: `prospect-demo-${String(index + 1).padStart(2, '0')}`,
    orgName: prospect.org,
    contactName: prospect.contact,
    contactRole: prospect.role,
    email: `${emailName}@exemple.invalid`,
    phone: `+212 6 00 00 0${Math.floor(index / 10)} ${String(index + 1).padStart(2, '0')} ${String(30 + index).padStart(2, '0')}`,
    city: prospect.city,
    sector: prospect.sector,
    kind: prospect.kind,
    headcount: '',
    source: prospect.source,
    stage,
    budget: stage === 'gagne' || stage === 'perdu' ? estimatedBudget(index) : index % 4 === 0 ? estimatedBudget(index) : null,
    urgency: TODAY_ACTIONS.has(index) && index % 4 === 0 ? 'haute' : 'normale',
    assignedTo: index % 2 === 0 ? 'Nada Bennani' : 'Youssef Tazi',
    createdAt: at(-Math.min(index % 14, 9)),
    lastContactAt: at(stage === 'nouveau' ? -Math.min(index % 4, 2) : -1),
    nextAction,
    nextActionAt: at(dueOffset),
    score: Math.min(92, 48 + ((index * 7) % 44)),
    notes: `Simulation fictive · Signal à vérifier en conversation : ${prospect.signal}. Aucune donnée réelle de contact.`,
    convertedOrgId: null,
  }
})
