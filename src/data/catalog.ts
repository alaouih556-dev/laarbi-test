import type { AccessOffer, LaunchOffer, MissionCode, MissionOffer, Sector, SectorContent } from '@/types'

export const LAUNCH_OFFER: LaunchOffer = {
  label: "OFFRE DE LANCEMENT",
  deadline: '31 octobre 2026',
  condition: 'ou aux 5 premiers clients de chaque secteur',
  freeDiagnostic: true,
}

export const BRAND_STEPS = [
  {
    code: 'STARTER' as MissionCode,
    title: 'Comprendre',
    number: '01',
    summary: "Un diagnostic de 2h15 pour savoir où votre établissement doit agir en priorité.",
    output: 'Vous repartez avec 3 priorités claires.',
  },
  {
    code: 'PRO' as MissionCode,
    title: 'Structurer',
    number: '02',
    summary: "Vos priorités deviennent des process, des supports et des outils prêts à l'emploi.",
    output: 'Des fondations utilisées dès la première semaine.',
  },
  {
    code: 'PERFORMANCE' as MissionCode,
    title: 'Agir',
    number: '03',
    summary: '30 jours d’accompagnement pour mettre en œuvre, suivre les résultats et ajuster.',
    output: 'Un plan d’action, des indicateurs, un bilan.',
  },
]

export const PLANS: Record<Sector, MissionOffer[]> = {
  enseignement: [
    {
      code: 'STARTER',
      step: '01',
      name: 'STARTER',
      verb: 'Comprendre',
      tagline: "Avant d'investir dans une solution, identifiez ce dont votre établissement a réellement besoin.",
      priceNormal: 495,
      priceLaunch: null,
      priceNote: 'au lieu de 495 DH · Diagnostic Performance',
      payment: 'Inclus',
      delay: '2h15',
      idealFor:
        "les demandes d'inscription stagnent, l'organisation repose sur trop peu de personnes ou les charges augmentent, sans que vous sachiez par où commencer.",
      intro:
        "Un diagnostic de 2h15 pour savoir où votre établissement doit agir en priorité : inscriptions, image, équipe, charges. Vous repartez avec 3 priorités claires.",
      included: [
        {
          title: 'Inscriptions & développement',
          items: [
            "Demandes d'information et canaux",
            'Parcours de la demande à l’inscription',
            'Relance des familles en attente',
            'Réinscriptions et potentiel de développement',
          ],
        },
        {
          title: 'Image & communication',
          items: [
            'Positionnement',
            'Site et page d’inscription',
            'Réseaux sociaux et avis des familles',
            'Supports de présentation',
          ],
        },
        {
          title: 'Équipe & organisation',
          items: [
            'Répartition des rôles',
            'Gestion des admissions',
            'Circulation de l’information',
            'Principaux points de blocage',
          ],
        },
        {
          title: 'Charges & prestataires',
          items: [
            'Transport et restauration',
            'Assurances',
            'Logiciels de gestion',
            'Fournitures, mobilier, télécom et internet',
          ],
        },
      ],
      deliverables: [
        'Un état des lieux synthétique',
        'Vos principales forces',
        'Vos difficultés prioritaires',
        'Les opportunités détectées',
        '3 priorités recommandées',
      ],
      notIncluded: [
        'Création, production, accompagnement opérationnel',
        'Recherche de prestataires, négociation ou mise en œuvre',
        'Aucun avis pédagogique, réglementaire ou juridique',
      ],
      highlights: ['1 diagnostic', '2h15 maximum', '3 priorités', 'Aucun engagement'],
      commitment: 'STARTER permet de comprendre. Il ne réalise pas la mission.',
      launchLabel: 'DIAGNOSTIC STARTER',
    },
    {
      code: 'PRO',
      step: '02',
      name: 'PRO',
      verb: 'Structurer',
      tagline: 'Vous savez où agir. Nous transformons vos priorités en outils, méthodes et structures concrets.',
      priceNormal: 8495,
      priceLaunch: 6495,
      priceNote: 'au lieu de 8 495 DH HT · Mission de structuration · paiement unique',
      payment: 'Paiement unique',
      delay: '4 à 6 semaines après la réunion de cadrage',
      idealFor:
        'vos priorités sont claires, mais il vous manque les process, les supports et les outils pour avancer.',
      intro:
        "Vos priorités deviennent des process, des supports et des outils prêts à l'emploi pour votre équipe. Les fondations sont construites, la mise en œuvre reste à votre main — sauf si vous choisissez PERFORMANCE.",
      included: [
        {
          title: 'Inscriptions & familles',
          items: [
            'Process d’inscription structuré, de la demande à la signature',
            'Qualification des familles',
            'Argumentaire de visite et de présentation',
            'Méthode de relance des familles en attente',
            'Outil de suivi des demandes d’inscription',
            '1 session de formation de 2 h pour l’équipe d’accueil et d’administration',
          ],
          limit: 'Limite : 1 process d’inscription + 1 session de formation',
        },
        {
          title: 'Image & communication',
          items: [
            'Création ou optimisation du logo',
            'Palette couleurs et typographies',
            'Identité visuelle légère',
            '2 réseaux sociaux créés ou optimisés',
            'Site ou page d’inscription jusqu’à 4 pages, avec formulaire de demande',
          ],
          limit:
            'Limite : 2 plateformes sociales, 4 pages web, pas d’e-commerce, pas de développement spécifique, pas de community management',
        },
        {
          title: 'Équipe & organisation',
          items: [
            'Clarification des rôles',
            'Responsabilités principales',
            'Outils simples de suivi',
          ],
          limit: 'Limite : 3 fiches de poste',
        },
        {
          title: 'Pilotage, cadrage & livraison',
          items: [
            '1 tableau de bord : demandes, visites, inscriptions, réinscriptions',
            'Outil de suivi d’activité',
            'Réunion de cadrage',
            'Organisation des priorités',
            'Contrôle qualité et livraison des éléments',
          ],
        },
      ],
      deliverables: [
        'Process d’inscription + argumentaire',
        'Outil de suivi des demandes',
        'Support de formation équipe (2 h)',
        'Identité visuelle et logo',
        '2 réseaux sociaux',
        'Site / page d’inscription 4 pages',
        '3 fiches de poste',
        'Tableau de bord',
        'Outil de suivi d’activité',
      ],
      notIncluded: [
        'Community management, publicité, budget média',
        'Recrutement, inscriptions réalisées pour le client',
        'E-commerce, développement complexe',
        'Conseil pédagogique, accompagnement permanent',
      ],
      highlights: [
        '1 process d’inscription',
        '1 formation 2 h',
        '4 pages web · 2 réseaux sociaux',
        '3 fiches de poste',
        '1 tableau de bord',
      ],
      commitment: 'PRO construit les fondations.',
      awarenessNote:
        "Toute image d'élève ou de mineur n'est utilisée qu'avec l'autorisation écrite des représentants légaux, à obtenir par l'établissement.",
    },
    {
      code: 'PERFORMANCE',
      step: '03',
      name: 'PERFORMANCE',
      verb: 'Agir',
      tagline:
        'Une fois la structuration livrée, nous vous accompagnons dans la mise en œuvre, le suivi et les ajustements pendant 30 jours.',
      priceNormal: 13945,
      priceLaunch: 10945,
      priceNote: 'au lieu de 13 945 DH HT · Structuration + accompagnement 30 jours · paiement unique',
      payment: 'Paiement unique',
      delay: '9 à 11 semaines après la réunion de cadrage',
      idealFor:
        'vous voulez avancer avec un appui, pas seulement recevoir des documents. Tout le contenu de PRO est inclus, auquel s’ajoute l’accompagnement ci-dessous.',
      intro:
        'PRO structure. PERFORMANCE va plus loin : une fois la structuration livrée, nous vous accompagnons dans la mise en œuvre, le suivi et les ajustements pendant 30 jours.',
      included: [
        {
          title: 'Tout le contenu de PRO',
          items: [
            'Process d’inscription, formation, identité visuelle, site, réseaux sociaux',
            'Fiches de poste, tableau de bord, outil de suivi',
          ],
        },
        {
          title: 'Pilotage sur 30 jours',
          items: [
            'Plan d’action personnalisé',
            '4 rendez-vous de pilotage',
            'Suivi des actions',
            'Identification des blocages',
            'Ajustements et bilan final',
          ],
        },
        {
          title: 'Inscriptions & développement',
          items: [
            'Suivi des indicateurs : demandes, visites, inscriptions',
            'Suivi de l’activité et des objectifs',
            'Analyse des résultats',
            'Actions correctives',
          ],
        },
        {
          title: 'Communication & acquisition',
          items: [
            '1 vidéo UGC (visite, vie de l’établissement)',
            '4 publications simples',
            'Préparation d’une campagne sponsorisée d’inscription',
            'Paramétrage, suivi, analyse et ajustements simples',
          ],
          limit: 'Limite : budget publicitaire non inclus : budget à définir après analyse',
        },
        {
          title: 'Suivi des collaborateurs (jusqu’à 3)',
          items: ['Objectifs et activité', 'Indicateurs et résultats', 'Écarts', 'Actions correctives'],
          limit: 'Limite : 3 collaborateurs',
        },
        {
          title: 'Optimisation des charges',
          items: [
            'Analyse approfondie de 3 catégories de dépenses maximum : transport, restauration, assurances, logiciels de gestion, fournitures, télécom',
            'Situation → coût → conditions → alternatives → comparaison → opportunité → recommandation',
          ],
          limit:
            "ALLNEEDS ne promet pas une économie avant analyse : nous identifions, quantifions et évaluons les opportunités.",
        },
        {
          title: 'Recherche de solutions (lorsque nécessaire)',
          items: [
            'Identification de solutions, recherche de prestataires',
            'Comparaison des propositions, présentation des options et aide à la décision',
          ],
        },
      ],
      deliverables: [
        'Tout PRO',
        'Plan d’action personnalisé',
        '4 rendez-vous de pilotage',
        'Tableau de bord + suivi des indicateurs',
        'Suivi de 3 collaborateurs',
        '1 vidéo UGC + 4 publications',
        '1 campagne sponsorisée préparée et suivie',
        'Analyse de 3 catégories de charges',
        'Bilan final',
      ],
      notIncluded: [
        'Budget publicitaire (budget à définir après analyse)',
        'Community management au quotidien',
        'Recrutement, inscriptions réalisées pour le client',
        'Conseil pédagogique, réglementaire ou juridique',
      ],
      highlights: [
        '30 jours d’accompagnement',
        '4 rendez-vous de pilotage',
        '1 vidéo UGC · 4 publications',
        '1 campagne sponsorisée',
        '3 catégories de charges',
        '3 collaborateurs suivis',
      ],
      commitment: 'PERFORMANCE construit, met en œuvre, suit et ajuste.',
      awarenessNote:
        "Calendrier des inscriptions. Le meilleur moment pour démarrer PERFORMANCE se situe plusieurs mois avant vos périodes d'inscription : nous calons le planning avec vous au cadrage.",
    },
  ],
  sante: [
    {
      code: 'STARTER',
      step: '01',
      name: 'STARTER',
      verb: 'Comprendre',
      tagline:
        "Avant d'investir dans une solution, identifiez ce dont votre structure de santé a réellement besoin.",
      priceNormal: 495,
      priceLaunch: null,
      priceNote: 'au lieu de 495 DH · Diagnostic Performance',
      payment: 'Inclus',
      delay: '2h15',
      idealFor:
        "votre agenda se remplit mal, l'accueil est débordé ou les charges augmentent, sans que vous sachiez par où commencer.",
      intro:
        "Un diagnostic de 2h15 pour savoir où votre structure doit agir en priorité : agenda, accueil, équipe, charges. Vous repartez avec 3 priorités claires.",
      included: [
        {
          title: 'Patients & développement',
          items: [
            "Remplissage de l'agenda",
            'Absences et annulations',
            'Prise de rendez-vous',
            'Suivi et relance des patients',
          ],
        },
        {
          title: 'Visibilité & confiance',
          items: ['Présence en ligne', 'Fiche Google et avis', "Cohérence de l'image", 'Information donnée aux patients'],
        },
        {
          title: 'Équipe & organisation',
          items: [
            'Répartition des rôles',
            "Fonctionnement de l'accueil",
            "Circulation de l'information",
            'Principaux points de blocage',
          ],
        },
        {
          title: 'Charges & équipements',
          items: [
            'Maintenance du matériel',
            'Assurances, dont responsabilité civile professionnelle',
            'Fournisseurs et consommables',
            'Logiciels, télécom et internet',
          ],
        },
      ],
      deliverables: [
        'Un état des lieux synthétique',
        'Vos principales forces',
        'Vos difficultés prioritaires',
        'Les opportunités détectées',
        '3 priorités recommandées',
      ],
      notIncluded: [
        'Création, production, accompagnement opérationnel, recherche de prestataires, négociation ou mise en œuvre',
        'Aucun avis médical, clinique ou juridique',
      ],
      highlights: ['1 diagnostic', '2h15 maximum'],
      commitment: 'STARTER permet de comprendre. Il ne réalise pas la mission.',
      launchLabel: 'DIAGNOSTIC STARTER',
    },
    {
      code: 'PRO',
      step: '02',
      name: 'PRO',
      verb: 'Structurer',
      tagline: 'Vous savez où agir. Nous transformons vos priorités en outils, méthodes et structures concrets.',
      priceNormal: 8495,
      priceLaunch: 6495,
      priceNote: 'au lieu de 8 495 DH HT · Mission de structuration · paiement unique',
      payment: 'Paiement unique',
      delay: '4 à 6 semaines après la réunion de cadrage',
      idealFor:
        'vos priorités sont claires, mais il vous manque les parcours, les protocoles et les outils pour avancer.',
      intro:
        'Vos priorités deviennent des parcours, des protocoles et des outils prêts à l’emploi pour votre équipe. PRO construit les fondations, la mise en œuvre reste à votre main — sauf si vous choisissez PERFORMANCE.',
      included: [
        {
          title: 'Patients & accueil',
          items: [
            'Parcours patient : accueil, rendez-vous, suivi',
            'Méthode de relance et gestion des absences',
            'Argumentaire de présentation des services',
            "Outil de suivi des rendez-vous et de l'activité",
            "1 session de formation de 2 h pour l'équipe d'accueil",
          ],
          limit: 'Limite : 1 parcours patient + 1 session de formation',
        },
        {
          title: 'Visibilité informative',
          items: [
            'Identité visuelle légère',
            'Fiche Google optimisée',
            'Site informatif jusqu’à 4 pages',
            "Prise de rendez-vous en ligne (paramétrage d'un outil existant)",
            'Charte de communication informative',
          ],
          limit:
            "Limite : 4 pages web, pas de publicité, pas d'e-commerce, pas de développement spécifique",
        },
        {
          title: 'Équipe & organisation',
          items: [
            'Clarification des rôles',
            'Responsabilités principales',
            "3 protocoles administratifs et d'accueil",
            '3 fiches de poste maximum',
          ],
          limit: 'Limite : 3 protocoles, 3 fiches de poste',
        },
        {
          title: 'Pilotage, cadrage & livraison',
          items: [
            '1 tableau de bord : remplissage, absences, nouveaux patients, avis',
            "Outil de suivi d'activité",
            'Réunion de cadrage',
            'Organisation des priorités',
            'Contrôle qualité et livraison des éléments',
          ],
        },
      ],
      deliverables: [
        'Parcours patient et méthode de relance',
        'Argumentaire de présentation des services',
        "Outil de suivi des rendez-vous et de l'activité",
        'Support de formation équipe (2 h)',
        'Identité visuelle, fiche Google et site informatif 4 pages',
        'Charte de communication informative',
        "3 protocoles administratifs et d'accueil + 3 fiches de poste",
        "Tableau de bord et outil de suivi d'activité",
      ],
      notIncluded: [
        'Publicité, budget média, campagne sponsorisée',
        'Recrutement, conseil médical ou clinique',
        'Aménagement des locaux, développement complexe',
        'Accompagnement permanent',
      ],
      highlights: [
        '1 parcours patient',
        '1 formation 2 h',
        '4 pages web · fiche Google optimisée',
        '3 protocoles · 3 fiches de poste',
        '1 tableau de bord',
      ],
      commitment: 'PRO construit les fondations.',
      awarenessNote:
        "Votre communication reste soumise aux règles de votre profession : la validation auprès de votre ordre ou de votre instance reste à votre charge.",
    },
    {
      code: 'PERFORMANCE',
      step: '03',
      name: 'PERFORMANCE',
      verb: 'Agir',
      tagline:
        'PRO structure. PERFORMANCE va plus loin : une fois la structuration livrée, nous vous accompagnons dans la mise en œuvre, le suivi et les ajustements pendant 30 jours.',
      priceNormal: 13945,
      priceLaunch: 10945,
      priceNote: 'au lieu de 13 945 DH HT · Structuration + accompagnement 30 jours · paiement unique',
      payment: 'Paiement unique',
      delay:
        '9 à 11 semaines après la réunion de cadrage : structuration (4 à 6 semaines), puis accompagnement de 30 jours. Paiement unique.',
      idealFor:
        "vous voulez avancer avec un appui, pas seulement recevoir des documents. Tout le contenu de PRO est inclus, auquel s'ajoute l'accompagnement ci-dessous.",
      intro:
        'Tout le contenu de PRO est inclus, auquel s’ajoute l’accompagnement 30 jours : pilotage, indicateurs, contenus d’information, suivi des collaborateurs et optimisation des charges.',
      included: [
        { title: 'Tout le contenu de PRO', items: ['Parcours patient, formation, visibilité informative, site, tableau de bord', 'Protocoles, fiches de poste, outils de suivi'] },
        {
          title: 'Pilotage sur 30 jours',
          items: [
            'Plan d’action personnalisé',
            '4 rendez-vous de pilotage',
            'Suivi des actions',
            'Identification des blocages',
            'Ajustements et bilan final',
          ],
        },
        {
          title: 'Patients & développement',
          items: [
            'Suivi des indicateurs : remplissage, absences',
            "Suivi de l'activité et des objectifs",
            'Analyse des résultats',
            'Actions correctives',
          ],
        },
        {
          title: 'Visibilité informative',
          items: [
            "4 contenus d'information (fiches, publications)",
            'Suivi de la fiche Google et de la prise de rendez-vous en ligne',
            'Process de gestion des avis + 1 réponse-type',
            'Analyse des résultats et ajustements simples',
          ],
          limit: 'Limite : aucune campagne publicitaire, dans le respect du cadre de la profession',
        },
        {
          title: 'Suivi des collaborateurs (jusqu’à 3)',
          items: ['Objectifs et activité', 'Indicateurs et résultats', 'Écarts', 'Actions correctives'],
        },
        {
          title: 'Optimisation des charges',
          items: [
            'Analyse approfondie de 3 catégories de dépenses maximum : matériel et maintenance, assurances, consommables, fournisseurs, logiciels, télécom',
            'Situation → coût → conditions → alternatives → comparaison → opportunité → recommandation',
          ],
          limit:
            'ALLNEEDS ne promet pas une économie avant analyse : nous identifions, quantifions et évaluons les opportunités.',
        },
        {
          title: 'Recherche de solutions (lorsque nécessaire)',
          items: [
            'Identification de solutions, recherche de prestataires, comparaison des propositions',
            'Présentation des options et aide à la décision',
          ],
        },
      ],
      deliverables: [
        'Tout PRO',
        'Plan d’action personnalisé',
        '4 rendez-vous de pilotage',
        'Tableau de bord + suivi des indicateurs : remplissage, absences',
        '4 contenus d’information et suivi de la fiche Google',
        'Suivi de 3 collaborateurs',
        'Analyse de 3 catégories de charges',
        'Bilan final',
      ],
      notIncluded: [
        'Campagne publicitaire et budget média',
        'Conseil médical ou clinique',
        'Aménagement des locaux, développement complexe',
        'Productions au-delà des limites écrites',
      ],
      highlights: [
        '4 contenus d’information',
        '3 catégories de charges',
        '3 collaborateurs suivis',
        '4 rendez-vous de pilotage',
        '30 jours d’accompagnement',
      ],
      commitment: 'PERFORMANCE construit, met en œuvre, suit et ajuste.',
      awarenessNote:
        'Vos données patients. ALLNEEDS n’a pas besoin d’accéder à des dossiers patients : les outils livrés ne contiennent que des données d’organisation (créneaux, absences, volumes). La conformité du traitement de vos données (loi 09-08) relève de votre structure ; nous vous orientons si nécessaire.',
    },
  ],
  tourisme: [
    {
      code: 'STARTER',
      step: '01',
      name: 'STARTER',
      verb: 'Comprendre',
      tagline:
        "Avant d'investir dans une solution, identifiez ce dont votre établissement a réellement besoin.",
      priceNormal: 495,
      priceLaunch: null,
      priceNote: 'au lieu de 495 DH · Diagnostic Performance',
      payment: 'Inclus',
      delay: '2h15',
      idealFor:
        'vos réservations dépendent trop des plateformes, la saison creuse pèse ou les charges augmentent, sans que vous sachiez par où commencer.',
      intro:
        'Un diagnostic de 2h15 pour savoir où votre établissement doit agir en priorité : réservations directes, image, équipe, charges. Vous repartez avec 3 priorités claires.',
      included: [
        {
          title: 'Réservations & développement',
          items: [
            'Part des réservations directes',
            "Taux d'occupation et saisonnalité",
            'Traitement des demandes',
            'Fidélisation des clients',
          ],
        },
        {
          title: 'Image & visibilité',
          items: ['Positionnement', 'Site et présence en ligne', 'Qualité des photos', 'Avis clients'],
        },
        {
          title: 'Équipe & exploitation',
          items: [
            'Répartition des rôles',
            "Procédures d'accueil",
            'Gestion des pics saisonniers',
            'Principaux points de blocage',
          ],
        },
        {
          title: 'Charges & fournisseurs',
          items: [
            'Blanchisserie et fournisseurs',
            'Énergie, télécom et internet',
            'Assurances',
            'Logiciels, réservation et commissions',
          ],
        },
      ],
      deliverables: [
        'Un état des lieux synthétique',
        'Vos principales forces',
        'Vos difficultés prioritaires',
        'Les opportunités détectées',
        '3 priorités recommandées',
      ],
      notIncluded: [
        'Création, production, accompagnement opérationnel, recherche de prestataires, négociation ou mise en œuvre',
        'Aucun avis réglementaire (classement, autorisations) ou juridique',
      ],
      highlights: ['1 diagnostic', '2h15 maximum'],
      commitment: 'STARTER permet de comprendre. Il ne réalise pas la mission.',
      launchLabel: 'DIAGNOSTIC STARTER',
    },
    {
      code: 'PRO',
      step: '02',
      name: 'PRO',
      verb: 'Structurer',
      tagline: 'Vous savez où agir. Nous transformons vos priorités en outils, méthodes et structures concrets.',
      priceNormal: 8495,
      priceLaunch: 6495,
      priceNote: 'au lieu de 8 495 DH HT · Mission de structuration · paiement unique',
      payment: 'Paiement unique',
      delay: '4 à 6 semaines après la réunion de cadrage',
      idealFor:
        'vos priorités sont claires, mais il vous manque les offres, les procédures et les outils pour avancer.',
      intro:
        'Vos priorités deviennent des offres, des procédures et des outils prêts à l’emploi pour votre équipe. PRO construit les fondations.',
      included: [
        {
          title: 'Réservations & accueil',
          items: [
            'Stratégie de réservation directe : offres et parcours',
            'Modèles de réponse aux demandes',
            'Méthode de relance des demandes non converties',
            "Outil de suivi des demandes et des clients",
            "1 session de formation de 2 h pour la réception",
          ],
          limit: 'Limite : 1 stratégie de réservation directe + 1 session de formation',
        },
        {
          title: 'Image & visibilité',
          items: [
            'Création ou optimisation du logo',
            'Palette couleurs et typographies',
            'Identité visuelle légère',
            '2 plateformes créées ou optimisées (ex. Instagram, Google)',
            "Site vitrine jusqu'à 4 pages, relié à votre outil de réservation existant",
            'Process de collecte et de réponse aux avis',
          ],
          limit:
            "Limite : 2 plateformes, 4 pages web, pas de moteur de réservation développé sur mesure, photos fournies par le client, pas de community management",
        },
        {
          title: 'Équipe & exploitation',
          items: [
            'Clarification des rôles',
            'Responsabilités principales',
            'Outils simples de suivi',
            '3 fiches de poste maximum',
          ],
          limit: 'Limite : 3 fiches de poste',
        },
        {
          title: 'Pilotage, cadrage & livraison',
          items: [
            '1 tableau de bord : occupation, prix moyen, part de réservations directes, avis',
            "Outil de suivi d'activité",
            'Réunion de cadrage',
            'Organisation des priorités',
            'Contrôle qualité et livraison des éléments',
          ],
        },
      ],
      deliverables: [
        'Stratégie de réservation directe et modèles de réponse',
        "Outil de suivi des demandes et des clients",
        'Support de formation réception (2 h)',
        'Identité visuelle et logo',
        '2 plateformes (ex. Instagram, Google)',
        'Site vitrine 4 pages relié à votre outil de réservation',
        'Process de collecte et de réponse aux avis',
        '3 fiches de poste',
        'Tableau de bord',
      ],
      notIncluded: [
        'Community management, publicité, budget média',
        'Recrutement, réservations réalisées pour le client',
        'Moteur de réservation sur mesure, shooting photo',
        'Accompagnement permanent',
      ],
      highlights: [
        '1 stratégie de réservation directe',
        '1 formation 2 h',
        '4 pages · 2 plateformes',
        '3 fiches de poste',
        '1 tableau de bord',
      ],
      commitment: 'PRO construit les fondations.',
      awarenessNote:
        "Un shooting photo n'est pas inclus : il peut être confié à un photographe vérifié du réseau ALLNEEDS Accès, en prestation complémentaire.",
    },
    {
      code: 'PERFORMANCE',
      step: '03',
      name: 'PERFORMANCE',
      verb: 'Agir',
      tagline:
        'PRO structure. PERFORMANCE va plus loin : une fois la structuration livrée, nous vous accompagnons dans la mise en œuvre, le suivi et les ajustements pendant 30 jours.',
      priceNormal: 13945,
      priceLaunch: 10945,
      priceNote: 'au lieu de 13 945 DH HT · Structuration + accompagnement 30 jours · paiement unique',
      payment: 'Paiement unique',
      delay:
        '9 à 11 semaines après la réunion de cadrage : structuration (4 à 6 semaines), puis accompagnement de 30 jours. Paiement unique.',
      idealFor:
        "vous voulez avancer avec un appui, pas seulement recevoir des documents. Tout le contenu de PRO est inclus, auquel s'ajoute l'accompagnement ci-dessous.",
      intro:
        'Tout le contenu de PRO est inclus, auquel s’ajoute l’accompagnement 30 jours : pilotage, indicateurs, visibilité, acquisition et optimisation des charges.',
      included: [
        { title: 'Tout le contenu de PRO', items: ['Réservation directe, formation, identité visuelle, site, plateformes, avis'] },
        {
          title: 'Pilotage sur 30 jours',
          items: [
            'Plan d’action personnalisé',
            '4 rendez-vous de pilotage',
            'Suivi des actions',
            'Identification des blocages',
            'Ajustements et bilan final',
          ],
        },
        {
          title: 'Réservations & développement',
          items: [
            'Suivi des indicateurs : occupation, réservations directes',
            'Comparaison du coût d’acquisition et des commissions plateformes',
            'Analyse des résultats',
            'Actions correctives',
          ],
        },
        {
          title: 'Visibilité & acquisition',
          items: [
            '1 vidéo UGC (séjour, lieu, expérience)',
            '4 publications simples',
            'Préparation d’une campagne sponsorisée de réservation directe',
            'Paramétrage, suivi, analyse et ajustements simples',
          ],
          limit: 'Limite : budget publicitaire non inclus : budget à définir après analyse',
        },
        {
          title: 'Suivi des collaborateurs (jusqu’à 3)',
          items: ['Objectifs et activité', 'Indicateurs et résultats', 'Écarts', 'Actions correctives'],
        },
        {
          title: 'Optimisation des charges',
          items: [
            'Analyse approfondie de 3 catégories de dépenses maximum : blanchisserie, fournisseurs, énergie, logiciels de réservation, assurances, télécom',
            'Situation → coût → conditions → alternatives → comparaison → opportunité → recommandation',
          ],
          limit:
            'ALLNEEDS ne promet pas une économie avant analyse : nous identifions, quantifions et évaluons les opportunités.',
        },
        {
          title: 'Recherche de solutions (lorsque nécessaire)',
          items: [
            'Identification de solutions, recherche de prestataires, comparaison des propositions',
            'Présentation des options et aide à la décision',
          ],
        },
      ],
      deliverables: [
        'Tout PRO',
        'Plan d’action personnalisé',
        '4 rendez-vous de pilotage',
        'Suivi des indicateurs : occupation, réservations directes',
        '1 vidéo UGC + 4 publications',
        '1 campagne sponsorisée de réservation directe',
        'Analyse de 3 catégories de charges',
        'Bilan final',
      ],
      notIncluded: [
        'Budget publicitaire (budget à définir après analyse)',
        'Community management au quotidien',
        'Réservations réalisées pour le client, moteur de réservation sur mesure',
        'Conseil réglementaire (classement, autorisations) ou juridique',
      ],
      highlights: [
        '4 publications',
        '1 campagne publicitaire',
        '3 catégories de charges',
        '3 collaborateurs suivis',
        '4 rendez-vous de pilotage',
        '30 jours d’accompagnement',
      ],
      commitment: 'PERFORMANCE construit, met en œuvre, suit et ajuste.',
      awarenessNote:
        'Saisonnalité. Idéalement, démarrez PERFORMANCE 2 à 3 mois avant votre haute saison : nous calons le planning avec vous au cadrage.',
    },
  ],
}

export const ACCESS_OFFERS: AccessOffer[] = [
  {
    tier: 'CONNECT',
    name: 'CONNECT',
    priceYear: 1490,
    priceMonth: 149,
    audience: 'Besoin ponctuel',
    tagline: 'Accès au réseau. Idéal si vous avez de temps en temps besoin d’un prestataire fiable.',
    needsPerYear: 6,
    concurrentNeeds: 2,
    users: '1',
    providersPerNeed: 2,
    verification: 'base',
    firstProposal: '5 jours ouvrés',
    quoteComparison: '—',
    followUp: '—',
    responseTime: '72 h ouvrées',
    contact: 'WhatsApp',
    starterDiagnostic: '—',
    missionDiscount: 0,
  },
  {
    tier: 'PLUS',
    name: 'PLUS',
    priceYear: 3490,
    priceMonth: 349,
    audience: 'Plusieurs besoins',
    tagline: 'Comparer et suivre. Idéal si vous avez plusieurs besoins et voulez comparer avant de choisir.',
    needsPerYear: 15,
    concurrentNeeds: 3,
    users: '1',
    providersPerNeed: 2,
    verification: 'approfondie',
    firstProposal: '3 jours ouvrés',
    quoteComparison: 'Comparatif de 2 devis',
    followUp: 'Relance à J+7',
    responseTime: '48 h ouvrées',
    contact: 'WhatsApp + téléphone',
    starterDiagnostic: '—',
    missionDiscount: 10,
    featured: true,
  },
  {
    tier: 'PRIORITE',
    name: 'PRIORITÉ',
    priceYear: 5490,
    priceMonth: 549,
    audience: 'Interlocuteur attitré',
    tagline: 'Attitré et rapide. Idéal si vous voulez un interlocuteur attitré et des réponses rapides.',
    needsPerYear: 30,
    concurrentNeeds: 5,
    users: "Jusqu'à 3",
    providersPerNeed: 3,
    verification: 'approfondie',
    firstProposal: '48 h',
    quoteComparison: "Jusqu'à 3 devis + recommandation motivée",
    followUp: 'Jusqu’à la signature + point de satisfaction',
    responseTime: '24 h ouvrées',
    contact: 'Interlocuteur attitré',
    starterDiagnostic: '1 par an',
    missionDiscount: 15,
  },
]

export const ACCESS_COMPARISON: { label: string; key: keyof AccessOffer }[] = [


  { label: 'Besoins par an (pool reportable sur 12 mois)', key: 'needsPerYear' },
  { label: 'Besoins traités en même temps', key: 'concurrentNeeds' },
  { label: 'Utilisateurs', key: 'users' },
  { label: 'Prestataires proposés par besoin', key: 'providersPerNeed' },
  { label: 'Vérification du prestataire', key: 'verification' },
  { label: 'Délai de première proposition', key: 'firstProposal' },
  { label: 'Comparaison de devis', key: 'quoteComparison' },
  { label: 'Suivi de la mise en relation', key: 'followUp' },
  { label: 'Réponse à vos messages', key: 'responseTime' },
  { label: 'Contact', key: 'contact' },
  { label: 'Diagnostic STARTER', key: 'starterDiagnostic' },
]

export const ACCESS_CATEGORIES: Record<Sector, { title: string; items: string[] }[]> = {
  enseignement: [
    {
      title: 'Inscriptions & développement',
      items: ['Logiciel de gestion scolaire et espace parents', 'Outil de suivi des demandes'],
    },
    {
      title: 'Image & communication',
      items: ['Développeur web', 'Graphiste', 'Photographe ou vidéaste', 'Imprimeur'],
    },
    {
      title: 'Équipe & organisation',
      items: ['Cabinet de recrutement', 'Formateur', 'Paie externalisée'],
    },
    {
      title: 'Charges & prestataires',
      items: ['Transport scolaire', 'Restauration', 'Mobilier', 'Fournitures', 'Assurance scolaire', 'Télécom'],
    },
  ],
  sante: [
    {
      title: 'Patients & développement',
      items: ['Logiciel de gestion de cabinet et de rendez-vous', 'Outil de rappel des patients'],
    },
    {
      title: 'Visibilité & confiance',
      items: ['Développeur web', 'Graphiste', 'Photographe'],
    },
    {
      title: 'Équipe & organisation',
      items: ['Cabinet de recrutement', 'Formateur', 'Paie externalisée'],
    },
    {
      title: 'Charges & équipements',
      items: [
        'Matériel et consommables',
        'Maintenance d’équipements',
        'Assurance RC',
        'Collecte des déchets médicaux',
        'Télécom',
      ],
    },
  ],
  tourisme: [
    {
      title: 'Réservations & développement',
      items: ['Channel manager', 'Logiciel de réservation', 'Outil de suivi des demandes'],
    },
    {
      title: 'Image & visibilité',
      items: ['Photographe ou vidéaste', 'Développeur web', 'Graphiste', 'Imprimeur'],
    },
    {
      title: 'Équipe & exploitation',
      items: ['Recrutement saisonnier', 'Formateur', 'Paie externalisée'],
    },
    {
      title: 'Charges & fournisseurs',
      items: ['Blanchisserie et linge', 'Fournisseurs F&B', 'Énergie et télécom', 'Assurance'],
    },
  ],
}

export const ACCESS_VERIFICATION: Record<Sector, { base: string; approfondie: string }> = {
  enseignement: {
    base: 'Existence légale (RC, ICE) et activité du prestataire.',
    approfondie:
      'En plus : 2 références clients, cohérence des tarifs avec le marché et délais annoncés, et selon la prestation, références d’établissements et respect des règles applicables aux mineurs (transport, restauration).',
  },
  sante: {
    base: 'Existence légale (RC, ICE) et activité du prestataire.',
    approfondie:
      'En plus : 2 références clients, cohérence des tarifs avec le marché et délais annoncés, et selon la prestation, agréments ou autorisations applicables et service après-vente.',
  },
  tourisme: {
    base: 'Existence légale (RC, ICE) et activité du prestataire.',
    approfondie:
      'En plus : 2 références clients, cohérence des tarifs avec le marché et délais annoncés, et selon la prestation, autorisations d’exercice, assurance RC et avis vérifiables.',
  },
}

const COMPARAISON_COMMUNE: { label: string; values: [string | null, string | null, string | null] }[] = [
  { label: 'Positionnement', values: ['Comprendre', 'Structurer', 'Agir'] },
  { label: 'Diagnostic 4 leviers', values: ['✓', '✓', '✓'] },
  { label: '3 priorités', values: ['✓', '✓', '✓'] },
  { label: 'Process d’inscription', values: ['—', '✓', '✓'] },
  { label: 'Formation équipe d’accueil', values: ['—', '1 × 2 h', '✓'] },
  { label: 'Identité visuelle', values: ['—', '✓', '✓'] },
  { label: 'Réseaux sociaux', values: ['—', '2', '2 + suivi'] },
  { label: 'Site ou page d’inscription', values: ['—', '4 pages', '4 pages'] },
  { label: 'Fiches de poste', values: ['—', '3', '3'] },
  { label: 'Tableau de bord', values: ['—', '1', '1 + suivi'] },
  { label: 'Plan d’action', values: ['—', '—', '✓'] },
  { label: 'Pilotage', values: ['—', '—', '30 jours'] },
  { label: 'Rendez-vous', values: ['1 diagnostic', 'Cadrage', '4'] },
  { label: 'Publications', values: ['—', '—', '4'] },
  { label: 'Campagne sponsorisée', values: ['—', '—', '1'] },
  { label: 'Vidéo UGC', values: ['—', '—', '1'] },
  { label: 'Optimisation des charges', values: ['Pré-analyse', '—', '3 catégories'] },
  { label: 'Recherche de solutions', values: ['—', '—', '✓'] },
  { label: 'Suivi collaborateurs', values: ['—', '—', '3 max.'] },
  { label: 'Bilan final', values: ['—', '—', '✓'] },
  { label: 'Délai', values: ['2h15', '4 à 6 semaines', '9 à 11 semaines'] },
  { label: 'Engagement', values: ['Aucun', 'Mission ponctuelle', 'Structuration + 30 jours'] },
  { label: 'Paiement', values: ['Inclus', 'Unique', 'Unique'] },
]

export const SECTORS: Record<Sector, SectorContent> = {
  enseignement: {
    id: 'enseignement',
    name: 'ALLNEEDS ENSEIGNEMENT',
    tagline: 'Votre réseau de solutions pour écoles privées, crèches et centres de formation',
    audience:
      'Écoles privées · crèches et maternelles · centres de formation · établissements de soutien scolaire',
    promise: 'Le besoin de votre établissement est le point de départ. Vous formez, nous structurons. Nous identifions les priorités de votre établissement, construisons les solutions adaptées et mobilisons les compétences nécessaires. Un seul interlocuteur, des livrables concrets, un périmètre clair dès le départ. Nous n’intervenons jamais sur le contenu pédagogique.',
    steps: [
      {
        code: 'STARTER',
        title: 'Comprendre (STARTER)',
        detail:
          'Un diagnostic de 2h15 pour savoir où votre établissement doit agir en priorité : inscriptions, image, équipe, charges. Vous repartez avec 3 priorités claires.',
      },
      {
        code: 'PRO',
        title: 'Structurer (PRO)',
        detail:
          'Vos priorités deviennent des process, des supports et des outils prêts à l’emploi pour votre équipe.',
      },
      {
        code: 'PERFORMANCE',
        title: 'Agir (PERFORMANCE)',
        detail:
          'Après la structuration, 30 jours d’accompagnement pour mettre en œuvre, suivre les résultats et ajuster.',
      },
    ],
    levers: [
      {
        id: 'inscriptions',
        name: 'Inscriptions & développement',
        detail: 'Demandes d’information, visites, inscriptions, réinscriptions.',
      },
      {
        id: 'image',
        name: 'Image & communication',
        detail: 'Positionnement, présence en ligne, relation avec les familles.',
      },
      {
        id: 'equipe',
        name: 'Équipe & organisation',
        detail: 'Rôles direction, administration et équipe pédagogique.',
      },
      {
        id: 'charges',
        name: 'Charges & prestataires',
        detail: 'Transport, restauration, logiciels, assurances, fournitures.',
      },
    ],
    reasons: [
      {
        title: 'Votre établissement d’abord',
        detail:
          'Nous partons de votre situation et de votre calendrier d’inscriptions, pas d’un catalogue.',
      },
      {
        title: 'Un cadre qui protège les familles',
        detail:
          'Aucune donnée nominative d’élève, images d’enfants uniquement avec autorisation écrite des représentants légaux.',
      },
      {
        title: 'Un seul interlocuteur',
        detail:
          'Nous mobilisons les compétences nécessaires, vous n’avez pas à chercher dix prestataires.',
      },
    ],
    highlights: [
      { title: '3 priorités en 2h15', detail: 'Un diagnostic court, un livrable écrit, aucun engagement.' },
      { title: 'Un périmètre clair dès le départ', detail: 'Ce qui est inclus, ce qui ne l’est pas, écrit noir sur blanc.' },
      { title: 'Un interlocuteur unique', detail: 'Direction, administration, équipe pédagogique : une seule entrée.' },
      { title: 'Des livrables, pas des rapports', detail: 'Des process, des supports, des outils que votre équipe utilise.' },
    ],
    comparison: COMPARAISON_COMMUNE,
    oneLiner: {
      STARTER: '« Je comprends votre établissement et j’identifie vos priorités. »',
      PRO: '« Je transforme vos priorités en outils, méthodes et structures concrètes. »',
      PERFORMANCE:
        '« Je structure, puis je vous accompagne pendant 30 jours pour mettre ces actions en œuvre, les suivre et les ajuster. »',
    },
    awarenessNote:
      "Toute image d'élève ou de mineur n'est utilisée qu'avec l'autorisation écrite des représentants légaux, à obtenir par l'établissement. ALLNEEDS ne fournit pas de conseil pédagogique, réglementaire ou juridique.",
    extraNotes: [
      {
        title: 'Délai de livraison',
        detail: 'PRO : 4 à 6 semaines après la réunion de cadrage. PERFORMANCE : 9 à 11 semaines (structuration puis 30 jours d’accompagnement).',
      },
      {
        title: 'Budget publicitaire',
        detail:
          'Non inclus dans les missions. budget à définir après analyse pour obtenir des résultats mesurables.',
      },
      {
        title: 'Retouches',
        detail: '2 tours de retouches par livrable. Toute production supplémentaire fait l’objet d’une prestation complémentaire.',
      },
    ],
    faq: [
      {
        q: 'Intervenez-vous sur le contenu pédagogique ?',
        a: "Non. Nous n’intervenons jamais sur le contenu pédagogique. Nous travaillons l'organisation, l'image, les processus et les prestataires.",
      },
      {
        q: 'Puis-je utiliser des photos d’enfants ?',
        a: "Uniquement avec l’autorisation écrite des représentants légaux, à recueillir par l’établissement. Aucune donnée nominative d’élève n’est utilisée.",
      },
      {
        q: 'Le site et les réseaux sociaux nous appartiennent-ils ?',
        a: 'Oui. Le site, les réseaux sociaux et les comptes publicitaires restent votre propriété, y compris en cas d’arrêt de mission.',
      },
      {
        q: 'Quand faut-il démarrer PERFORMANCE ?',
        a: "Plusieurs mois avant vos périodes d'inscription. Le planning est calé avec vous lors du cadrage.",
      },
      {
        q: 'La remise abonnés est-elle cumulable avec l’offre de lancement ?',
        a: 'Non. L’avantage abonné (PLUS ou PRIORITÉ) s’applique au prix normal des missions PRO et PERFORMANCE, et n’est pas cumulable avec l’offre de lancement.',
      },
    ],
  },
  sante: {
    id: 'sante',
    name: 'ALLNEEDS SANTÉ',
    tagline: 'Votre réseau de solutions pour cabinets, centres de santé et laboratoires',
    audience:
      'Cabinets médicaux et dentaires · centres pluridisciplinaires · laboratoires d’analyses · professions paramédicales',
    promise:
      'Le besoin de votre structure de santé est le point de départ. Vous soignez, nous structurons. Un seul interlocuteur, des livrables concrets, un périmètre clair dès le départ. Nous n’intervenons jamais sur l’acte médical.',
    steps: [
      {
        code: 'STARTER',
        title: 'Comprendre (STARTER)',
        detail:
          'Un diagnostic de 2h15 pour savoir où votre structure doit agir en priorité : agenda, accueil, équipe, charges. Vous repartez avec 3 priorités claires.',
      },
      {
        code: 'PRO',
        title: 'Structurer (PRO)',
        detail:
          'Vos priorités deviennent des parcours, des protocoles et des outils prêts à l’emploi pour votre équipe.',
      },
      {
        code: 'PERFORMANCE',
        title: 'Agir (PERFORMANCE)',
        detail:
          'Après la structuration, 30 jours d’accompagnement pour mettre en œuvre, suivre les résultats et ajuster.',
      },
    ],
    levers: [
      {
        id: 'inscriptions',
        name: 'Patients & développement',
        detail: 'Parcours patient, prise de rendez-vous, relance, suivi.',
      },
      {
        id: 'image',
        name: 'Visibilité & confiance',
        detail: 'Présence en ligne informative, avis, image de la structure.',
      },
      {
        id: 'equipe',
        name: 'Équipe & organisation',
        detail: 'Rôles praticiens, accueil et assistants, protocoles administratifs.',
      },
      {
        id: 'charges',
        name: 'Charges & équipements',
        detail: 'Matériel, maintenance, assurances, logiciels, fournisseurs.',
      },
    ],
    reasons: [
      {
        title: 'Votre structure d’abord',
        detail: 'Nous partons de votre organisation, pas d’un catalogue de services.',
      },
      {
        title: 'Un cadre qui respecte votre profession',
        detail: 'Communication informative, aucune promesse médicale, aucun conseil clinique.',
      },
      {
        title: 'Un seul interlocuteur',
        detail:
          'Nous mobilisons les compétences nécessaires, vous n’avez pas à chercher dix prestataires.',
      },
    ],
    highlights: [
      {
        title: 'Un seul interlocuteur',
        detail:
          'Cabinet, centre ou laboratoire : une seule entrée, nous mobilisons les compétences nécessaires.',
      },
      {
        title: 'Des livrables concrets',
        detail: 'Parcours, protocoles, outils, indicateurs — pas des rapports.',
      },
      {
        title: 'Un périmètre clair dès le départ',
        detail: 'Ce qui est inclus, ce qui ne l’est pas, et les limites écrites noir sur blanc.',
      },
      {
        title: 'Jamais sur l’acte médical',
        detail: 'Aucune promesse médicale, aucun conseil clinique, aucune donnée de dossier patient.',
      },
    ],
    comparison: [


      { label: 'Positionnement', values: ['Comprendre', 'Structurer', 'Agir'] },
      { label: 'Diagnostic 4 leviers', values: ['✓', '✓', '✓'] },
      { label: '3 priorités', values: ['✓', '✓', '✓'] },
      { label: 'Parcours patient et protocoles', values: ['—', '✓', '✓'] },
      { label: 'Formation équipe d’accueil', values: ['—', '1 × 2 h', '✓'] },
      { label: 'Identité visuelle', values: ['—', '✓', '✓'] },
      { label: 'Fiche Google', values: ['—', '✓', '✓ + suivi'] },
      { label: 'Site informatif', values: ['—', '4 pages', '4 pages'] },
      { label: 'Prise de rendez-vous en ligne', values: ['—', '✓', '✓ + suivi'] },
      { label: 'Fiches de poste', values: ['—', '3', '3'] },
      { label: 'Tableau de bord', values: ['—', '1', '1 + suivi'] },
      { label: 'Plan d’action', values: ['—', '—', '✓'] },
      { label: 'Pilotage', values: ['—', '—', '30 jours'] },
      { label: 'Rendez-vous', values: ['1 diagnostic', 'Cadrage', '4'] },
      { label: 'Contenus d’information', values: ['—', '—', '4'] },
      { label: 'Gestion des avis', values: ['—', '—', '✓'] },
      { label: 'Optimisation des charges', values: ['Pré-analyse', '—', '3 catégories'] },
      { label: 'Recherche de solutions', values: ['—', '—', '✓'] },
      { label: 'Suivi collaborateurs', values: ['—', '—', '3 max.'] },
      { label: 'Bilan final', values: ['—', '—', '✓'] },
      { label: 'Délai', values: ['2h15', '4 à 6 semaines', '9 à 11 semaines'] },
      { label: 'Engagement', values: ['Aucun', 'Mission ponctuelle', 'Structuration + 30 jours'] },
      { label: 'Paiement', values: ['Inclus', 'Unique', 'Unique'] },
    ],
    oneLiner: {
      STARTER: '« Je comprends votre structure de santé et j’identifie vos priorités. »',
      PRO: '« Je transforme vos priorités en outils, méthodes et structures concrètes. »',
      PERFORMANCE:
        '« Je structure, puis je vous accompagne pendant 30 jours pour mettre ces actions en œuvre, les suivre et les ajuster. »',
    },
    awarenessNote:
      "ALLNEEDS n'intervient jamais sur l'acte médical et n'accède à aucun dossier patient. Les outils livrés ne contiennent que des données d'organisation (créneaux, absences, volumes) : la conformité du traitement de vos données (loi 09-08) relève de votre structure, nous vous orientons si nécessaire.",
    extraNotes: [
      {
        title: 'Délai de livraison',
        detail:
          'STARTER : 2h15. PRO : 4 à 6 semaines après la réunion de cadrage. PERFORMANCE : 9 à 11 semaines (structuration puis 30 jours d’accompagnement). Paiement unique.',
      },
      {
        title: 'Vos données patients',
        detail:
          'ALLNEEDS n’a pas besoin d’accéder à des dossiers patients. Les outils livrés ne contiennent que des données d’organisation (créneaux, absences, volumes).',
      },
      {
        title: 'Cadre de la profession',
        detail:
          'La validation de votre communication auprès de votre ordre ou de votre instance reste à votre charge. Aucune campagne publicitaire n’est réalisée dans le cadre de ces formules.',
      },
      {
        title: 'Retouches',
        detail:
          '2 tours de retouches par livrable. Toute production supplémentaire fait l’objet d’une prestation complémentaire.',
      },
    ],
    faq: [
      {
        q: 'Intervenez-vous sur l’acte médical ?',
        a: 'Jamais. Notre périmètre est organisationnel, commercial et administratif : ni conseil clinique, ni promesse médicale.',
      },
      {
        q: 'Avez-vous besoin d’accéder à nos dossiers patients ?',
        a: 'Non. Les outils livrés ne contiennent que des données d’organisation : créneaux, absences, volumes. La conformité du traitement de vos données (loi 09-08) relève de votre structure.',
      },
      {
        q: 'Qui valide notre communication ?',
        a: 'Vous. Votre communication reste soumise aux règles de votre profession : la validation auprès de votre ordre ou de votre instance reste à votre charge.',
      },
      {
        q: 'Le site et les réseaux sociaux nous appartiennent-ils ?',
        a: 'Oui. Le site, les réseaux sociaux et les comptes publicitaires restent votre propriété, y compris en cas d’arrêt de mission.',
      },
      {
        q: 'Puis-je combiner avec ALLNEEDS ACCÈS ?',
        a: 'Oui. L’avantage abonné (PLUS ou PRIORITÉ) s’applique sur les missions PRO et PERFORMANCE au prix normal, et n’est pas cumulable avec l’offre de lancement.',
      },
    ],
  },
  tourisme: {
    id: 'tourisme',
    name: 'ALLNEEDS TOURISME',
    tagline: 'Votre réseau de solutions pour riads, maisons d’hôtes, hôtels et restaurants',
    audience: 'Riads et maisons d’hôtes · petits hôtels · restaurants · agences et prestataires d’expériences',
    promise:
      'Le besoin de votre établissement est le point de départ. Vous accueillez, nous structurons. Un seul interlocuteur, des livrables concrets, un périmètre clair dès le départ. Nous n’intervenons jamais dans l’exploitation au quotidien.',
    steps: [
      {
        code: 'STARTER',
        title: 'Comprendre (STARTER)',
        detail:
          'Un diagnostic de 2h15 pour savoir où votre établissement doit agir en priorité : réservations directes, image, équipe, charges. Vous repartez avec 3 priorités claires.',
      },
      {
        code: 'PRO',
        title: 'Structurer (PRO)',
        detail:
          'Vos priorités deviennent des offres, des procédures et des outils prêts à l’emploi pour votre équipe.',
      },
      {
        code: 'PERFORMANCE',
        title: 'Agir (PERFORMANCE)',
        detail:
          'Après la structuration, 30 jours d’accompagnement pour mettre en œuvre, suivre les résultats et ajuster.',
      },
    ],
    levers: [
      {
        id: 'frequentation',
        name: 'Réservations & développement',
        detail: 'Réservations directes, traitement des demandes, fidélisation, saisonnalité.',
      },
      {
        id: 'image',
        name: 'Image & visibilité',
        detail: 'Positionnement, photos, présence en ligne, avis clients.',
      },
      {
        id: 'equipe',
        name: 'Équipe & exploitation',
        detail: 'Rôles réception, service et direction, procédures d’accueil.',
      },
      {
        id: 'charges',
        name: 'Charges & fournisseurs',
        detail: 'Blanchisserie, fournisseurs, énergie, logiciels, assurances.',
      },
    ],
    reasons: [
      {
        title: 'Votre établissement d’abord',
        detail: 'Nous partons de votre situation et de votre saisonnalité, pas d’un catalogue.',
      },
      {
        title: 'Moins de dépendance aux plateformes',
        detail: 'Le travail est orienté vers la réservation directe et la maîtrise des commissions.',
      },
      {
        title: 'Un seul interlocuteur',
        detail:
          'Nous mobilisons les compétences nécessaires, vous n’avez pas à chercher dix prestataires.',
      },
    ],
    highlights: [
      {
        title: 'Réservation directe',
        detail: 'Part des réservations directes, taux d’occupation, coût des commissions.',
      },
      {
        title: 'Contenu',
        detail: 'Photos, UGC, parcours de réservation relié à votre outil existant.',
      },
      {
        title: 'Saisonnalité',
        detail: 'Les leviers sont calés sur vos mois forts et vos mois creux.',
      },
      {
        title: 'Charges',
        detail: 'Analyse chiffrée de 3 catégories maximum, sans promesse avant mesure.',
      },
    ],
    comparison: [


      { label: 'Positionnement', values: ['Comprendre', 'Structurer', 'Agir'] },
      { label: 'Diagnostic 4 leviers', values: ['✓', '✓', '✓'] },
      { label: '3 priorités', values: ['✓', '✓', '✓'] },
      { label: 'Stratégie de réservation directe', values: ['—', '✓', '✓'] },
      { label: 'Formation réception', values: ['—', '1 × 2 h', '✓'] },
      { label: 'Identité visuelle', values: ['—', '✓', '✓'] },
      { label: 'Plateformes (réseaux, Google)', values: ['—', '2', '2 + suivi'] },
      { label: 'Site vitrine', values: ['—', '4 pages', '4 pages'] },
      { label: 'Process avis clients', values: ['—', '✓', '✓ + suivi'] },
      { label: 'Fiches de poste', values: ['—', '3', '3'] },
      { label: 'Tableau de bord', values: ['—', '1', '1 + suivi'] },
      { label: 'Plan d’action', values: ['—', '—', '✓'] },
      { label: 'Pilotage', values: ['—', '—', '30 jours'] },
      { label: 'Rendez-vous', values: ['1 diagnostic', 'Cadrage', '4'] },
      { label: 'Publications', values: ['—', '—', '4'] },
      { label: 'Campagne sponsorisée', values: ['—', '—', '1'] },
      { label: 'Vidéo UGC', values: ['—', '—', '1'] },
      { label: 'Optimisation des charges', values: ['Pré-analyse', '—', '3 catégories'] },
      { label: 'Recherche de solutions', values: ['—', '—', '✓'] },
      { label: 'Suivi collaborateurs', values: ['—', '—', '3 max.'] },
      { label: 'Bilan final', values: ['—', '—', '✓'] },
      { label: 'Délai', values: ['2h15', '4 à 6 semaines', '9 à 11 semaines'] },
      { label: 'Engagement', values: ['Aucun', 'Mission ponctuelle', 'Structuration + 30 jours'] },
      { label: 'Paiement', values: ['Inclus', 'Unique', 'Unique'] },
    ],
    oneLiner: {
      STARTER: '« Je comprends votre établissement et j’identifie vos priorités. »',
      PRO: '« Je transforme vos priorités en outils, méthodes et structures concrètes. »',
      PERFORMANCE:
        '« Je structure, puis je vous accompagne pendant 30 jours pour mettre ces actions en œuvre, les suivre et les ajuster. »',
    },
    awarenessNote:
      "Un shooting photo n'est pas inclus : il peut être confié à un photographe vérifié du réseau ALLNEEDS Accès, en prestation complémentaire. Aucune campagne publicitaire n'est réalisée dans le cadre de ces formules.",
    extraNotes: [
      {
        title: 'Délai de livraison',
        detail:
          'STARTER : 2h15. PRO : 4 à 6 semaines après la réunion de cadrage. PERFORMANCE : 9 à 11 semaines (structuration puis 30 jours d’accompagnement). Paiement unique.',
      },
      {
        title: 'Saisonnalité',
        detail:
          'Idéalement, démarrez PERFORMANCE 2 à 3 mois avant votre haute saison : nous calons le planning avec vous au cadrage.',
      },
      {
        title: 'Budget publicitaire',
        detail:
          'Non inclus : budget à définir après analyse pour obtenir des résultats mesurables.',
      },
      {
        title: 'Retouches',
        detail:
          '2 tours de retouches par livrable. Toute production supplémentaire fait l’objet d’une prestation complémentaire.',
      },
    ],
    faq: [
      {
        q: 'Travaillez-vous avec les plateformes ?',
        a: 'Oui, mais l’objectif est de réduire votre dépendance : on regarde d’abord votre taux d’occupation, votre part de réservation directe et le coût de vos commissions.',
      },
      {
        q: 'Faites-vous les photos ?',
        a: 'Le shooting photo n’est pas inclus en PRO. Il peut être confié à un photographe vérifié du réseau ALLNEEDS Accès, en prestation complémentaire. En PERFORMANCE, une vidéo UGC est incluse.',
      },
      {
        q: 'Développez-vous un moteur de réservation ?',
        a: 'Non. Le site vitrine est relié à votre outil de réservation existant. Un développement sur mesure n’est pas inclus.',
      },
      {
        q: 'Y a-t-il un engagement ?',
        a: 'Aucun sur STARTER. PRO et PERFORMANCE sont des missions ponctuelles, avec périmètre et limites écrits.',
      },
      {
        q: 'Puis-je combiner avec ALLNEEDS ACCÈS ?',
        a: 'Oui. L’avantage abonné (PLUS ou PRIORITÉ) s’applique sur les missions PRO et PERFORMANCE au prix normal, et n’est pas cumulable avec l’offre de lancement.',
      },
    ],
  },
}

export const SECTOR_ORDER: Sector[] = ['enseignement', 'sante', 'tourisme']

export const SECTOR_LABEL: Record<Sector, string> = {
  enseignement: 'Enseignement',
  sante: 'Santé',
  tourisme: 'Tourisme',
}

export const MISSION_LABEL: Record<MissionCode, string> = {
  STARTER: 'STARTER',
  PRO: 'PRO',
  PERFORMANCE: 'PERFORMANCE',
}

export const NEED_CATEGORY_LABEL: Record<string, string> = {
  logiciel: 'Logiciel',
  creation: 'Création',
  rh: 'RH & organisation',
  logistique: 'Logistique',
  energie: 'Énergie & fluides',
  maintenance: 'Maintenance',
}

export const COMPANY = {
  name: 'ALLNEEDS',
  legal: '[ raison sociale · ICE · RC · ville : à compléter ]',
  phone: '[Téléphone]',
  whatsapp: '[WhatsApp]',
  email: '[Email]',
  site: '[Site web]',
  city: 'Casablanca, Maroc',
  taxNote: 'Prix hors taxes, TVA 20 % en sus.',
}
