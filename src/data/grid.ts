import type {
  DiagnosticGrid,
  GridChargeRow,
  GridCriterion,
  GridLever,
  GridReading,
  GridStep,
  GridStructureField,
  GridSynthRow,
  Sector,
} from '@/types'

/* ------------------------------------------------------------------ */
/* Éléments communs aux trois secteurs                                  */
/* ------------------------------------------------------------------ */

export const GRID_SCORE_NOTE = 'Score : 1 = point faible majeur · 3 = correct mais non structuré · 5 = maîtrisé.'

const STRUCTURE_FIELDS: GridStructureField[] = [
  { id: 'date', label: 'Date', placeholder: 'JJ/MM/AAAA', type: 'date' },
  { id: 'interlocuteur', label: 'Interlocuteur / fonction', placeholder: 'Ex. Directrice / trustee', type: 'text' },
  { id: 'animateur', label: 'Animateur ALLNEEDS', placeholder: 'Prénom Nom', type: 'text' },
  { id: 'decideur', label: 'Décideur présent ?', placeholder: 'Sélectionnez', type: 'select', options: ['oui', 'non'] },
  { id: 'ville', label: 'Ville / effectif', placeholder: 'Ex. Casablanca · 240 élèves', type: 'text' },
]

const STEPS: GridStep[] = [
  {
    range: '0 – 10 min',
    duration: '10 min',
    block: 'Cadrage',
    objective: 'Expliquer le format et ce que le diagnostic ne fait pas',
  },
  {
    range: '10 – 70 min',
    duration: '60 min',
    block: '4 leviers (15 min chacun)',
    objective: 'Poser les questions, noter les faits, scorer de 1 à 5',
  },
  {
    range: '70 – 80 min',
    duration: '10 min',
    block: 'Synthèse à chaud',
    objective: 'Forces, difficultés, opportunités',
  },
  {
    range: '80 – 90 min',
    duration: '10 min',
    block: 'Restitution et suite',
    objective: 'Valider les 3 priorités, annoncer le compte-rendu sous 48 h',
  },
]

const SYNTH_ROWS: GridSynthRow[] = [
  { id: 'forces', label: 'Forces (3)', lines: 3 },
  { id: 'difficultes', label: 'Difficultés prioritaires (3)', lines: 3 },
  { id: 'opportunites', label: 'Opportunités détectées (3)', lines: 3 },
  { id: 'priorites', label: '3 priorités recommandées', lines: 3 },
  { id: 'besoins', label: 'Besoins détectés pour Accès', lines: 2 },
  { id: 'decisions', label: 'Décisions et suites convenues', lines: 3 },
]

const CRITERIA: GridCriterion[] = [
  { id: 'decideur', label: 'Décideur présent et impliqué' },
  { id: 'probleme', label: 'Problème clairement exprimé et coûteux' },
  { id: 'urgence', label: 'Urgence ou échéance identifiée' },
  { id: 'budget', label: "Budget évoqué ou capacité d'investir" },
  { id: 'structuration', label: 'Ouverture à structurer avant d’acheter des outils' },
  { id: 'reference', label: 'Accord possible pour devenir référence' },
]

const READINGS: GridReading[] = [
  { range: '9 à 12', min: 9, max: 12, action: 'Proposer PERFORMANCE ou PRO, prix de lancement à l’appui.' },
  { range: '6 à 8', min: 6, max: 8, action: 'Proposer PRO, ou PRO puis Accès.' },
  { range: '3 à 5', min: 3, max: 5, action: 'Proposer Accès CONNECT ou PLUS pour les besoins détectés.' },
  { range: '0 à 2', min: 0, max: 2, action: 'Restituer le diagnostic, garder le contact.' },
]

const DECISIONS = ['STARTER seul', 'PRO', 'PERFORMANCE', 'Accès (niveau)']

const READINGS_NOTE = 'repères à ajuster après les premiers diagnostics'

const lever = (id: string, name: string, questions: string[]): GridLever => ({
  id,
  name,
  scoreNote: GRID_SCORE_NOTE,
  questions: questions.map((text, i) => ({ id: `${id}-q${i + 1}`, text })),
})

const charge = (id: string, poste: string): GridChargeRow => ({ id, poste })

/* ------------------------------------------------------------------ */
/* Enseignement                                                         */
/* ------------------------------------------------------------------ */

const ENSEIGNEMENT_LEVERS: GridLever[] = [
  lever('inscriptions', 'Inscriptions & développement', [
    'Effectif actuel par rapport à la capacité d’accueil, par niveau ?',
    'Combien de demandes d’information par mois ou par an ? Par quels canaux ?',
    'Parcours d’inscription : étapes, délais, qui répond ? Taux visites vers inscriptions ?',
    'Comment les familles en attente sont-elles relancées ?',
    'Taux de réinscription et motifs de départ connus ?',
    'Périodes clés d’inscription et actions menées à ces périodes ?',
    'Potentiel de développement (niveaux, filières, programmes, horaires) ?',
  ]),
  lever('image', 'Image & communication', [
    'Positionnement : en une phrase, pourquoi choisir cet établissement ?',
    'Site ou page d’inscription : existe, clair, avec formulaire de demande ?',
    'Réseaux sociaux : fréquence, contenus, audience de parents ?',
    'Fiche Google et avis des familles ?',
    'Supports de présentation : brochure, visite, dossier d’inscription ?',
    'Comment les projets et la vie de l’établissement sont-ils valorisés ?',
    'Règles internes de diffusion des images d’élèves : autorisations obtenues ?',
  ]),
  lever('equipe', 'Équipe & organisation', [
    'Organisation direction, administration, équipe pédagogique : rôles formalisés ?',
    'Fiches de poste existantes ?',
    'Qui gère les admissions et la relation avec les familles ?',
    'Circulation de l’information entre direction, enseignants et administration ?',
    'Recrutement et fidélisation des enseignants : difficultés ?',
    'Outils de gestion (présence, notes, facturation, communication familles) ?',
    'Principaux points de blocage exprimés par la direction ?',
  ]),
  lever('charges', 'Charges & prestataires', [
    'Quelles sont les 5 plus grosses charges hors salaires ?',
    'Transport scolaire : prestataire, coût, conditions ?',
    'Restauration : prestataire, coût, satisfaction ?',
    'Assurances : couvertures et primes, dernière mise en concurrence ?',
    'Logiciel de gestion scolaire et espace parents : coût, usage réel ?',
    'Fournitures, mobilier, maintenance : fournisseurs et conditions ?',
    'Télécom, internet, échéances de renouvellement et investissements prévus ?',
  ]),
]

/* ------------------------------------------------------------------ */
/* Santé                                                               */
/* ------------------------------------------------------------------ */

const SANTE_LEVERS: GridLever[] = [
  lever('patients', 'Patients & développement', [
    'Combien de patients ou de consultations par semaine, et quelle est la capacité maximale de l’agenda ?',
    'Taux de remplissage moyen par praticien ? Créneaux vides récurrents ?',
    'Part de rendez-vous non honorés ou annulés tardivement ? Quel dispositif de rappel ?',
    'Comment les patients prennent-ils rendez-vous (téléphone, WhatsApp, en ligne) ? Délai de réponse ?',
    'D’où viennent les nouveaux patients (recommandation, confrères, en ligne) ? Est-ce suivi ?',
    'Comment les patients sont-ils relancés (contrôles, suivis, retours) ?',
    'Quel potentiel de développement identifié (prestations, horaires, praticiens) ?',
  ]),
  lever('visibilite', 'Visibilité & confiance', [
    'Fiche Google : revendiquée, complète ? Nombre et note des avis ?',
    'Site ou page d’information : existe-t-il, à jour, informatif ?',
    'Comment les avis sont-ils collectés et traités, y compris les avis négatifs ?',
    'Quelles informations pratiques sont données aux patients (tarifs, préparation, accès, horaires) ?',
    'Cohérence de l’image : signalétique, documents, présence en ligne ?',
    'Quels canaux de communication sont utilisés, dans le respect des règles de la profession ?',
    'Quels retours les patients donnent-ils sur l’accueil et l’attente ?',
  ]),
  lever('equipe', 'Équipe & organisation', [
    'Qui fait quoi (praticiens, accueil, assistants) ? Organisation formalisée ?',
    'Fiches de poste existantes et à jour ?',
    'Comment l’accueil gère-t-il les pics (téléphone, arrivées, demandes administratives) ?',
    'Comment l’information circule-t-elle dans l’équipe (transmissions, réunions) ?',
    'Protocoles administratifs écrits (accueil, facturation, gestion des absences) ?',
    'Rotation du personnel, absences ou tensions dans l’équipe ?',
    'Principaux points de blocage exprimés par le responsable ?',
  ]),
  lever('charges', 'Charges & équipements', [
    'Quelles sont les 5 plus grosses charges récurrentes hors salaires ?',
    'Contrats de maintenance du matériel : existence, coût, échéances ?',
    'Assurances : couvertures, primes, dernière mise en concurrence ?',
    'Fournisseurs de consommables : nombre, conditions, dernier changement ?',
    'Logiciels (gestion, rendez-vous, facturation) : coûts, usages réels, doublons ?',
    'Télécom et internet : contrat, coût, qualité ?',
    'Investissements ou renouvellements prévus dans les 12 mois ?',
  ]),
]

/* ------------------------------------------------------------------ */
/* Tourisme                                                            */
/* ------------------------------------------------------------------ */

const TOURISME_LEVERS: GridLever[] = [
  lever('reservations', 'Réservations & développement', [
    'Capacité (chambres, couverts) et taux d’occupation par mois ?',
    'Répartition des réservations : directes ou plateformes ? Commissions payées sur 12 mois ?',
    'Prix moyen par nuit ou ticket moyen : évolution sur 2 ans ?',
    'Comment les demandes directes sont-elles traitées (délai, réponse, relance) ?',
    'Clients fidèles ou récurrents : suivi et relance ?',
    'Saisonnalité : mois creux et actions menées ?',
    'Potentiel de développement (offres, packages, séjours, groupes, événements) ?',
  ]),
  lever('image', 'Image & visibilité', [
    'Positionnement en une phrase et clientèle cible ?',
    'Site : existe-t-il, réservation directe possible, version mobile ?',
    'Instagram, Google, autres réseaux : fréquence, qualité des visuels, audience ?',
    'Avis (Google, plateformes) : note, volume, réponses apportées ?',
    'Qualité et date des photos ?',
    'Cohérence entre l’image en ligne et l’expérience réelle ?',
    'Partenariats de visibilité (agences, conciergeries, influence) ?',
  ]),
  lever('equipe', 'Équipe & exploitation', [
    'Organisation réception, service, entretien, direction : rôles clairs ?',
    'Fiches de poste existantes ?',
    'Procédures d’arrivée, de départ et de gestion des demandes clients ?',
    'Gestion des plannings et des pics saisonniers (renforts) ?',
    'Rotation du personnel et formation de l’équipe ?',
    'Gestion des réclamations et des retours clients ?',
    'Principaux points de blocage exprimés par le gérant ?',
  ]),
  lever('charges', 'Charges & fournisseurs', [
    'Quelles sont les 5 plus grosses charges hors salaires ?',
    'Blanchisserie et linge : prestataire, coût, qualité ?',
    'Fournisseurs F&B : nombre, conditions, pertes ?',
    'Énergie, télécom, internet : contrats et coûts ?',
    'Logiciels (réservation, channel manager, caisse) : coûts, usages, doublons ?',
    'Assurances (RC, multirisque, perte d’exploitation) ?',
    'Investissements et renouvellements prévus avant la haute saison ?',
  ]),
]

/* ------------------------------------------------------------------ */
/* Grilles                                                             */
/* ------------------------------------------------------------------ */

export const DIAGNOSTIC_GRIDS: Record<Sector, DiagnosticGrid> = {
  enseignement: {
    sector: 'enseignement',
    title: 'Grille de diagnostic STARTER · Enseignement',
    context: '2h15 · 4 thèmes · 3 priorités · qualification commerciale',
    structureFields: STRUCTURE_FIELDS,
    documents: [
      'Dernières factures télécom et internet',
      'Polices d’assurance',
      'Contrats de transport et de restauration',
      'Liste des abonnements logiciels',
      'Brochure ou dossier d’inscription actuel',
      'Chiffres d’inscription des 2 dernières années (sans aucune donnée nominative)',
    ],
    steps: STEPS,
    guardrails: [
      'Ne demander ni conserver aucune donnée nominative d’élève.',
      'Aucune image d’enfant sans autorisation des représentants légaux.',
      'Ne donner aucun avis pédagogique, réglementaire ou juridique.',
    ],
    levers: ENSEIGNEMENT_LEVERS,
    chargeIntro:
      'À remplir avec les factures. Chaque échéance de renouvellement est une opportunité de besoin pour ALLNEEDS Accès.',
    chargeRows: [
      charge('transport', 'Transport scolaire'),
      charge('restauration', 'Restauration'),
      charge('assurance-scolaire', 'Assurance scolaire'),
      charge('assurance-multirisque', 'Assurance multirisque'),
      charge('logiciels', 'Logiciels et abonnements'),
      charge('fournitures', 'Fournitures et mobilier'),
      charge('telecom', 'Télécom et internet'),
      charge('autre', 'Autre'),
    ],
    synthRows: SYNTH_ROWS,
    criteria: CRITERIA,
    criteriaNote: 'Notez chaque critère : 0 = non, 1 = partiellement, 2 = oui.',
    readings: READINGS,
    readingsNote: READINGS_NOTE,
    decisions: DECISIONS,
  },
  sante: {
    sector: 'sante',
    title: 'Grille de diagnostic STARTER · Santé',
    context: '2h15 · 4 thèmes · 3 priorités · qualification commerciale',
    structureFields: STRUCTURE_FIELDS.map((field) =>
      field.id === 'ville' ? { ...field, placeholder: 'Ex. Casablanca · 3 praticiens' } : field,
    ),
    documents: [
      'Dernières factures télécom et internet',
      'Polices d’assurance : responsabilité civile professionnelle et multirisque',
      'Contrats de maintenance du matériel',
      'Liste des abonnements logiciels',
      '2 à 3 factures de fournisseurs de consommables',
      'Capture de l’agenda de la semaine (sans aucun nom de patient)',
    ],
    steps: STEPS,
    guardrails: [
      'Confidentialité : seules les informations nécessaires à l’analyse sont demandées. Les données permettant d’identifier un patient doivent être anonymisées.',
      'Neutralité : ALLNEEDS ne délivre aucun avis médical, clinique ou réglementaire',
      'Objectivité : les constats, recommandations et estimations sont formulés après analyse des données disponibles, sans promesse de résultat préalable',
    ],
    levers: SANTE_LEVERS,
    chargeIntro:
      'À remplir avec les factures. Chaque échéance de renouvellement est une opportunité de besoin pour ALLNEEDS Accès.',
    chargeRows: [
      charge('materiel', 'Matériel et consommables'),
      charge('maintenance', 'Maintenance du matériel'),
      charge('rc-pro', 'Assurance RC professionnelle'),
      charge('multirisque', 'Assurance multirisque'),
      charge('logiciels', 'Logiciels et abonnements'),
      charge('telecom', 'Télécom et internet'),
      charge('dechets', 'Collecte des déchets médicaux'),
      charge('autre', 'Autre'),
    ],
    synthRows: SYNTH_ROWS,
    criteria: CRITERIA,
    criteriaNote: 'Notez chaque critère : 0 = non, 1 = partiellement, 2 = oui.',
    readings: READINGS,
    readingsNote: READINGS_NOTE,
    decisions: DECISIONS,
  },
  tourisme: {
    sector: 'tourisme',
    title: 'Grille de diagnostic STARTER · Tourisme',
    context: '2h15 · 4 thèmes · 3 priorités · qualification commerciale',
    structureFields: STRUCTURE_FIELDS.map((field) =>
      field.id === 'ville' ? { ...field, placeholder: 'Ex. Marrakech · 12 chambres' } : field,
    ),
    documents: [
      'Dernières factures télécom, internet et énergie',
      'Polices d’assurance',
      'Contrats de blanchisserie et de fournisseurs',
      'Abonnements logiciels et plateformes, avec relevé des commissions sur 12 mois',
      'Taux d’occupation mensuel des 12 derniers mois',
      'Liens du site et des pages en ligne',
    ],
    steps: STEPS,
    guardrails: [
      'Ne demander aucune donnée confidentielle de clients ou d’invités.',
      'Ne se prononcer ni sur le classement ni sur la conformité réglementaire de l’établissement.',
      'Ne promettre aucun niveau de réservations avant analyse.',
    ],
    levers: TOURISME_LEVERS,
    chargeIntro:
      'À remplir avec les factures. Chaque échéance de renouvellement est une opportunité de besoin pour ALLNEEDS Accès.',
    chargeRows: [
      charge('blanchisserie', 'Blanchisserie et linge'),
      charge('fnb', 'Fournisseurs F&B'),
      charge('energie', 'Énergie'),
      charge('telecom', 'Télécom et internet'),
      charge('logiciels', 'Logiciels et plateformes'),
      charge('assurances', 'Assurances'),
      charge('maintenance', 'Maintenance'),
      charge('autre', 'Autre'),
    ],
    synthRows: SYNTH_ROWS,
    criteria: CRITERIA,
    criteriaNote: 'Notez chaque critère : 0 = non, 1 = partiellement, 2 = oui.',
    readings: READINGS,
    readingsNote: READINGS_NOTE,
    decisions: DECISIONS,
  },
}

export const GRID_CHARGE_HEADERS = ['Fournisseur actuel', 'Coût annuel HT', 'Échéance', 'Observations'] as const
