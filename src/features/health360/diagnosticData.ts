export type DiagnosticQuestion = {
  id:string; starred:boolean; internal:boolean; title:string; question:string; relance:string; besoinAcces:boolean;
  levels:string[]; weight?:number; enjeu?:number; type:'Interne'|'Opportunité'|'Menace';
};

export const VOLETS = [
  {
    "id": 1,
    "title": "COMMERCIALE ET FORCE DE VENTE",
    "subtitle": "Comment vous trouvez, convertissez et gardez vos clients."
  },
  {
    "id": 2,
    "title": "VISIBILITÉ, MARKETING ET COMMUNICATION",
    "subtitle": "Comment vous êtes vus, choisis et recommandés."
  },
  {
    "id": 3,
    "title": "RH, FICHES DE POSTE, OUTILS DE TRAVAIL ET ORGANISATION",
    "subtitle": "Comment l'équipe est organisée, outillée et fidélisée."
  },
  {
    "id": 4,
    "title": "RÉDUCTION DES CHARGES ET COMPTABILITÉ ANALYTIQUE",
    "subtitle": "Ce que coûte l'activité et ce qu'elle rapporte."
  }
] as const;

export const QUESTIONS:DiagnosticQuestion[] = [
  {
    "id": "1A1",
    "starred": true,
    "internal": true,
    "title": "Objectif chiffré",
    "question": "Quel objectif mensuel de nouveaux patients avez-vous fixé par prestation, et quel est le taux d'occupation de votre agenda ?",
    "relance": "Qui le connaît dans l'équipe ? Quand l'avez-vous ajusté pour la dernière fois ?",
    "besoinAcces": false,
    "levels": [
      "Aucun objectif, aucun chiffre en tête",
      "Objectif oral, jamais comparé au réel",
      "Objectif écrit, comparé au réel de temps en temps",
      "Objectif écrit, comparé au réel chaque mois, équipe informée",
      "Objectif par prestation, suivi chaque semaine, écart analysé, action corrective datée"
    ],
    "weight": 3,
    "type": "Interne"
  },
  {
    "id": "1A2",
    "starred": true,
    "internal": true,
    "title": "Origine des demandes",
    "question": "Sur vos 20 dernières rendez-vous, combien viennent de chaque source (bouche-à-oreille, Google, réseaux, partenaires, autres) ?",
    "relance": "Demandez-vous systématiquement « comment nous avez-vous connus ? » Où notez-vous la réponse ?",
    "besoinAcces": false,
    "levels": [
      "Aucune idée de la provenance",
      "Impression générale, aucun chiffre",
      "Sources principales connues, sans pourcentage",
      "Sources chiffrées en pourcentage sur les 3 derniers mois",
      "Sources chiffrées chaque mois, coût et résultat par source, efforts réorientés"
    ],
    "weight": 3,
    "type": "Interne"
  },
  {
    "id": "1A3",
    "starred": true,
    "internal": true,
    "title": "Délai de réponse",
    "question": "Quelle part des appels de prise de rendez-vous est décrochée, et en combien de temps rappelez-vous un appel manqué ?",
    "relance": "Combien d'appels manqués hier ? Que dit votre répondeur ?",
    "besoinAcces": false,
    "levels": [
      "Plus de 3 appels sur 10 manqués, aucun rappel",
      "Appels manqués fréquents, rappel dans les 24 h quand c'est possible",
      "Peu d'appels manqués, rappel dans la journée",
      "Moins de 1 appel sur 10 manqué, rappel sous 2 h, messagerie claire",
      "Appels manqués comptés, rappel sous 30 min, prise de rendez-vous en ligne 24 h/24"
    ],
    "weight": 3,
    "type": "Interne"
  },
  {
    "id": "1A4",
    "starred": true,
    "internal": true,
    "title": "Transformation",
    "question": "Sur 10 demandes de rendez-vous, combien se transforment en rendez-vous ? Pour les autres, savez-vous pourquoi ?",
    "relance": "Qui rappelle les demandes restées sans suite, et sous quel délai ?",
    "besoinAcces": false,
    "levels": [
      "Jamais compté, demandes perdues sans suite",
      "Estimation vague, causes des pertes inconnues",
      "Taux connu à peu près, causes devinées",
      "Taux mesuré chaque mois, causes des pertes notées",
      "Taux mesuré par prestation, objectif fixé, causes traitées, taux en hausse sur 6 mois"
    ],
    "weight": 3,
    "type": "Interne"
  },
  {
    "id": "1A5",
    "starred": false,
    "internal": true,
    "title": "Tarifs et offres",
    "question": "Vos tarifs et offres sont-ils écrits, comparés à ceux de 3 concurrents directs et révisés chaque année ?",
    "relance": "Quelle offre vous rapporte le plus de marge ? Laquelle vous coûte plus qu'elle ne rapporte ?",
    "besoinAcces": false,
    "levels": [
      "Aucune grille écrite, tarifs donnés au cas par cas",
      "Grille ancienne ou incomplète",
      "Grille écrite et claire, non révisée depuis plus d'un an",
      "Grille révisée chaque année après comparaison avec 3 concurrents",
      "Offres packagées, marge connue par offre, tarifs ajustés selon la demande"
    ],
    "weight": 2,
    "type": "Interne"
  },
  {
    "id": "1A6",
    "starred": false,
    "internal": true,
    "title": "Relance et fidélisation",
    "question": "Rappelez-vous les rendez-vous à vos patients (SMS, appel), et quel est votre taux de rendez-vous non honorés ?",
    "relance": "Combien de créneaux perdus la semaine dernière ? Avez-vous une liste d'attente ?",
    "besoinAcces": false,
    "levels": [
      "Aucun rappel, rendez-vous non honorés jamais comptés",
      "Rappel occasionnel, taux inconnu",
      "Rappel pour certains patients, taux estimé",
      "Rappel systématique, taux mesuré chaque mois",
      "Rappel systématique, taux en baisse constante, liste d'attente active"
    ],
    "weight": 2,
    "type": "Interne"
  },
  {
    "id": "1A7",
    "starred": false,
    "internal": true,
    "title": "Responsable commercial",
    "question": "Qui est responsable du développement commercial, combien d'heures par semaine y consacre-t-il, et sur quels résultats est-il suivi ?",
    "relance": "Que se passe-t-il sur ce sujet quand cette personne est absente ?",
    "besoinAcces": false,
    "levels": [
      "Personne, rien de défini",
      "Le dirigeant quand il a le temps (moins d'1 h par semaine)",
      "Le dirigeant, avec un créneau fixe chaque semaine",
      "Une personne désignée, avec des objectifs écrits",
      "Une personne formée, objectifs écrits, point hebdomadaire, résultats partagés"
    ],
    "weight": 2,
    "type": "Interne"
  },
  {
    "id": "1B1",
    "starred": true,
    "internal": false,
    "title": "Demande non servie",
    "question": "Quelle prestation, quel horaire ou quelle spécialité vos patients demandent-ils régulièrement sans que vous les proposiez ? Combien de demandes avez-vous dû refuser le mois dernier ?",
    "relance": "Quelle demande revient le plus souvent ? Que faudrait-il pour la servir ?",
    "besoinAcces": false,
    "levels": [
      "Aucune idée",
      "Soupçon, sans chiffre",
      "Demande identifiée et chiffrée, rien de lancé",
      "Demande identifiée, test lancé avec objectif",
      "Demande exploitée, résultats mesurés"
    ],
    "enjeu": 3,
    "type": "Opportunité"
  },
  {
    "id": "1B2",
    "starred": true,
    "internal": false,
    "title": "Concurrent proche",
    "question": "Si un concurrent proche baisse ses prix de 10 % ou ouvre à côté de chez vous, combien de patients risquez-vous de perdre, et quelle parade est prévue ?",
    "relance": "Qui sont vos 2 concurrents les plus proches, et en quoi êtes-vous différent ?",
    "besoinAcces": false,
    "levels": [
      "Très exposé, aucune parade",
      "Exposé, parade improvisée",
      "Risque connu, parade partielle",
      "Offre différenciée, patients fidèles",
      "Position de référence, peu sensible au prix"
    ],
    "enjeu": 3,
    "type": "Menace"
  },
  {
    "id": "1B3",
    "starred": false,
    "internal": false,
    "title": "Partenaires qui envoient des patients",
    "question": "Quels partenaires (confrères, mutuelles, entreprises, pharmacies, structures de soins) vous adressent des patients, et quelle part de votre activité cela représente-t-il ?",
    "relance": "Comment gardez-vous le lien avec eux, dans le respect des règles de votre profession ?",
    "besoinAcces": false,
    "levels": [
      "Aucun partenaire",
      "Un ou deux, relation informelle, volume inconnu",
      "Plusieurs, volume estimé, non suivi",
      "Plusieurs, volume suivi, contact nommé chez chacun",
      "Partenariats actifs, accord écrit, volume mesuré, objectif annuel"
    ],
    "enjeu": 2,
    "type": "Opportunité"
  },
  {
    "id": "2A1",
    "starred": true,
    "internal": true,
    "title": "Fiche Google",
    "question": "Ouvrons votre fiche Google : est-elle revendiquée, complète (horaires, téléphone, catégorie, photos, lien de prise de rendez-vous) et à jour ?",
    "relance": "Les horaires des jours fériés sont-ils justes ? Qui gère la fiche ?",
    "besoinAcces": false,
    "levels": [
      "Absente, non revendiquée, ou informations fausses",
      "Revendiquée, informations incomplètes",
      "Complète : horaires, téléphone, catégorie, photos",
      "Complète, photos de moins de 6 mois, lien d'action actif",
      "Complète, publication au moins mensuelle, questions et avis traités sous 48 h"
    ],
    "weight": 3,
    "type": "Interne"
  },
  {
    "id": "2A2",
    "starred": true,
    "internal": true,
    "title": "Site internet",
    "question": "Depuis un téléphone, combien de clics et de minutes faut-il à un visiteur pour prendre rendez-vous sur votre site ?",
    "relance": "Faisons le test en séance. Combien de visites par mois, et combien de demandes en ligne ?",
    "besoinAcces": false,
    "levels": [
      "Pas de site",
      "Site ancien ou illisible sur mobile",
      "Site à jour et lisible sur mobile, aucune action en ligne",
      "Action en ligne possible en moins de 5 clics",
      "Action en ligne complète, visites et conversions suivies chaque mois"
    ],
    "weight": 3,
    "type": "Interne"
  },
  {
    "id": "2A3",
    "starred": true,
    "internal": true,
    "title": "Avis en ligne",
    "question": "Combien d'avis en ligne avez-vous, avec quelle note, et à quel pourcentage répondez-vous ? Comment en obtenez-vous de nouveaux ?",
    "relance": "Comment gérez-vous les avis, dans le respect des règles de votre profession ?",
    "besoinAcces": false,
    "levels": [
      "Moins de 10 avis, ou note sous 3,5",
      "10 à 30 avis, aucune réponse",
      "30 à 60 avis, note de 4 ou plus, réponses rares",
      "Plus de 60 avis, note de 4,3 ou plus, réponse à la plupart",
      "Plus de 100 avis, note de 4,5 ou plus, réponse à tous, demande d'avis systématique"
    ],
    "weight": 3,
    "type": "Interne"
  },
  {
    "id": "2A4",
    "starred": false,
    "internal": true,
    "title": "Réseaux sociaux",
    "question": "À quelle fréquence publiez-vous sur les réseaux utilisés par votre cible, et qui s'en charge ?",
    "relance": "Quel réseau vous a déjà rapporté une demande ? Combien ?",
    "besoinAcces": false,
    "levels": [
      "Jamais, ou aucun compte",
      "Moins d'une fois par mois",
      "Environ 2 fois par mois",
      "Chaque semaine",
      "2 à 3 fois par semaine, avec un calendrier"
    ],
    "weight": 1,
    "type": "Interne"
  },
  {
    "id": "2A5",
    "starred": false,
    "internal": true,
    "title": "Identité visuelle",
    "question": "Mettons côte à côte votre site, vos réseaux, votre signalétique et vos documents : un inconnu reconnaît-il la même structure ?",
    "relance": "Existe-t-il une charte écrite (logo, couleurs, ton) ?",
    "besoinAcces": false,
    "levels": [
      "Aucune identité",
      "Logo ancien, supports hétérogènes",
      "Identité correcte, quelques incohérences",
      "Identité cohérente sur site, réseaux et papier",
      "Identité forte, charte écrite, reconnaissable d'un coup d'œil"
    ],
    "weight": 1,
    "type": "Interne"
  },
  {
    "id": "2A6",
    "starred": false,
    "internal": true,
    "title": "Message clé",
    "question": "En une phrase, pourquoi vous choisit-on plutôt qu'un concurrent proche ? Qu'en diraient 3 de vos patients ?",
    "relance": "Cette phrase figure-t-elle sur votre site et sur votre fiche Google ?",
    "besoinAcces": false,
    "levels": [
      "Aucun message clair",
      "Message générique (qualité, sérieux, proximité)",
      "Message clair, non repris partout",
      "Message clair, repris sur le site, la fiche Google et les supports",
      "Message différenciant, vérifié auprès d'au moins 5 patients, repris partout"
    ],
    "weight": 2,
    "type": "Interne"
  },
  {
    "id": "2A7",
    "starred": false,
    "internal": true,
    "title": "Budget et résultats",
    "question": "Combien dépensez-vous par an en communication (temps compris), et quel nombre de rendez-vous en découle ?",
    "relance": "Quelle action a le mieux marché l'an dernier ? Laquelle arrêteriez-vous ?",
    "besoinAcces": false,
    "levels": [
      "Aucun budget, aucun suivi",
      "Budget flou, aucun suivi",
      "Budget connu, retours estimés",
      "Budget fixé, retours mesurés par action",
      "Budget par canal, coût par rendez-vous connu et comparé"
    ],
    "weight": 2,
    "type": "Interne"
  },
  {
    "id": "2B1",
    "starred": false,
    "internal": false,
    "title": "Recherches en ligne",
    "question": "Tapez sur Google ce que tape quelqu'un qui vous cherche dans votre zone (métier + ville) : savez-vous ce qui est cherché, et apparaissez-vous en première page ?",
    "relance": "Quelles 3 recherches voudriez-vous gagner ?",
    "besoinAcces": false,
    "levels": [
      "Aucune idée de ce qui est cherché, absent des résultats",
      "Intuition seulement, absent de la première page",
      "Quelques recherches testées, présent seulement sur votre nom",
      "Recherches principales connues, première page sur au moins 2 requêtes",
      "Recherches suivies, première page sur la plupart des requêtes clés"
    ],
    "enjeu": 2,
    "type": "Opportunité"
  },
  {
    "id": "2B2",
    "starred": true,
    "internal": false,
    "title": "Visibilité du concurrent",
    "question": "Pour la même recherche, votre concurrent le plus proche apparaît-il avant vous, et avec combien d'avis de plus ou de moins ?",
    "relance": "Quel concurrent a récemment refait son site ou ses photos ?",
    "besoinAcces": false,
    "levels": [
      "Très largement plus visible",
      "Nettement plus visible",
      "À peu près égal",
      "Vous êtes devant",
      "Vous êtes la référence locale"
    ],
    "enjeu": 3,
    "type": "Menace"
  },
  {
    "id": "2B3",
    "starred": false,
    "internal": false,
    "title": "Relais de visibilité",
    "question": "Quels relais (annuaires santé, confrères, presse locale, partenaires) vous apportent de la visibilité, et combien de demandes en viennent ?",
    "relance": "Ces relais respectent-ils les règles de communication de votre profession ?",
    "besoinAcces": false,
    "levels": [
      "Aucun relais",
      "Un ou deux, jamais mesurés",
      "Plusieurs, retours estimés",
      "Plusieurs, retours mesurés",
      "Relais négociés ou animés, retours mesurés et réinvestis"
    ],
    "enjeu": 2,
    "type": "Opportunité"
  },
  {
    "id": "3A1",
    "starred": false,
    "internal": true,
    "title": "Rôles",
    "question": "Si vous êtes absent une semaine, qui décide quoi ? Chacun sait-il de quoi il est responsable ?",
    "relance": "Dernière absence du dirigeant : qu'est-ce qui a bloqué ?",
    "besoinAcces": false,
    "levels": [
      "Tout remonte au dirigeant",
      "Rôles flous, doublons fréquents",
      "Rôles connus oralement",
      "Rôles écrits, remplaçant identifié pour les postes clés",
      "Rôles écrits, remplaçants formés, une semaine d'absence du dirigeant sans blocage"
    ],
    "weight": 2,
    "type": "Interne"
  },
  {
    "id": "3A2",
    "starred": false,
    "internal": true,
    "title": "Fiches de poste",
    "question": "Pour quels postes existe-t-il une fiche de poste écrite, et quand a-t-elle été mise à jour ?",
    "relance": "Le titulaire du poste l'a-t-il lue ? Contient-elle des objectifs ?",
    "besoinAcces": false,
    "levels": [
      "Aucune",
      "Pour un ou deux postes",
      "Pour tous, mais anciennes",
      "Pour tous, à jour (moins d'un an)",
      "À jour, avec objectifs et indicateurs, signées"
    ],
    "weight": 2,
    "type": "Interne"
  },
  {
    "id": "3A3",
    "starred": false,
    "internal": true,
    "title": "Accueil d'un nouvel arrivant",
    "question": "Que se passe-t-il le premier jour, la première semaine et le premier mois d'un nouvel arrivant ?",
    "relance": "Qui est son référent ? Quand fait-on le point de fin de période d'essai ?",
    "besoinAcces": false,
    "levels": [
      "Aucun accueil",
      "Présentation rapide le premier jour",
      "Accompagnement informel la première semaine",
      "Livret d'accueil et un référent",
      "Parcours écrit sur 1 à 3 mois, point de fin de période"
    ],
    "weight": 2,
    "type": "Interne"
  },
  {
    "id": "3A4",
    "starred": false,
    "internal": true,
    "title": "Planning et remplacements",
    "question": "Quand l'équipe connaît-elle son planning, et que se passe-t-il quand quelqu'un est absent ?",
    "relance": "La dernière absence imprévue : qui a remplacé, avec quel préavis ?",
    "besoinAcces": false,
    "levels": [
      "Géré au jour le jour",
      "Planning à la semaine, absences subies",
      "Planning mensuel, remplacements improvisés",
      "Planning mensuel, remplaçants prévus",
      "Planning à 2 mois, pics et absences planifiés, heures supplémentaires suivies"
    ],
    "weight": 2,
    "type": "Interne"
  },
  {
    "id": "3A5",
    "starred": true,
    "internal": true,
    "title": "Procédures",
    "question": "Parmi vos procédures clés (accueil, prise de rendez-vous, encaissement), lesquelles sont écrites, et sont-elles appliquées ?",
    "relance": "Montrez-moi la dernière version. Quand a-t-elle été relue ?",
    "besoinAcces": false,
    "levels": [
      "Aucune",
      "Quelques notes",
      "Principales écrites, peu appliquées",
      "Écrites et appliquées",
      "Écrites, appliquées, vérifiées et mises à jour"
    ],
    "weight": 3,
    "type": "Interne"
  },
  {
    "id": "3A6",
    "starred": true,
    "internal": true,
    "title": "Outils de travail",
    "question": "Pour traiter une rendez-vous, de la demande à l'encaissement, combien de fois la même information est-elle saisie ou recopiée ?",
    "relance": "Quel outil vous fait perdre le plus de temps ? Que paie-t-on sans l'utiliser ?",
    "besoinAcces": true,
    "levels": [
      "Papier ou tableurs dispersés",
      "Outils présents, information ressaisie à chaque étape",
      "Outils présents, ressaisie sur 1 ou 2 étapes",
      "Outils utilisés par tous, ressaisie rare",
      "Outils intégrés, aucune ressaisie, coût maîtrisé, équipe formée"
    ],
    "weight": 3,
    "type": "Interne"
  },
  {
    "id": "3A7",
    "starred": false,
    "internal": true,
    "title": "Stabilité de l'équipe",
    "question": "Combien de collaborateurs sont partis ces 24 derniers mois, et savez-vous pourquoi ?",
    "relance": "Faites-vous un entretien annuel ? Existe-t-il un plan de formation ?",
    "besoinAcces": false,
    "levels": [
      "Plus d'un tiers de l'équipe est parti en 2 ans",
      "Environ un quart est parti",
      "Un salarié sur dix est parti",
      "Aucun départ en 2 ans",
      "Aucun départ, entretien annuel et plan de formation"
    ],
    "weight": 2,
    "type": "Interne"
  },
  {
    "id": "3B1",
    "starred": false,
    "internal": false,
    "title": "Profils disponibles",
    "question": "Quand vous recrutez (assistants, secrétaires ou personnel de soins), combien de temps faut-il pour trouver un bon profil, et avez-vous des candidats en attente ?",
    "relance": "Dernier recrutement : combien de semaines, combien de candidats ?",
    "besoinAcces": false,
    "levels": [
      "Impossible",
      "Très difficile, plusieurs mois",
      "Difficile, 1 à 2 mois",
      "Assez facile grâce à un réseau",
      "Vivier actif (écoles, réseau), candidats en attente"
    ],
    "enjeu": 2,
    "type": "Opportunité"
  },
  {
    "id": "3B2",
    "starred": true,
    "internal": false,
    "title": "Attractivité face aux concurrents",
    "question": "Face aux concurrents locaux, vos conditions de travail (salaire, horaires, ambiance, formation) vous font-elles gagner ou perdre des candidats et des collaborateurs ?",
    "relance": "Qui est parti chez un concurrent ces 2 dernières années, et pourquoi ?",
    "besoinAcces": false,
    "levels": [
      "Des départs vers les concurrents, conditions inférieures",
      "Conditions inférieures, risque de départ",
      "Conditions comparables",
      "Conditions supérieures sur un point clé",
      "Employeur recherché, candidatures spontanées"
    ],
    "enjeu": 3,
    "type": "Menace"
  },
  {
    "id": "3B3",
    "starred": false,
    "internal": false,
    "title": "Prestataires RH et outils",
    "question": "Faites-vous appel à des prestataires (recrutement, formation, paie, logiciels), et les avez-vous comparés ou négociés ?",
    "relance": "Quel prestataire pèse le plus dans vos coûts ? Quand l'avez-vous mis en concurrence ?",
    "besoinAcces": false,
    "levels": [
      "Aucun, tout en interne",
      "Un prestataire subi",
      "Prestataires utilisés, jamais comparés",
      "Comparés une fois",
      "Comparés chaque année, conditions négociées"
    ],
    "enjeu": 1,
    "type": "Opportunité"
  },
  {
    "id": "4A1",
    "starred": true,
    "internal": true,
    "title": "Plus grosses charges",
    "question": "Citez vos 5 plus grosses charges hors salaires, avec leur montant annuel.",
    "relance": "Quelle charge a le plus augmenté en 2 ans ? Avez-vous les factures sous la main ?",
    "besoinAcces": true,
    "levels": [
      "Non",
      "Vaguement",
      "Oui, montants approximatifs",
      "Oui, montants annuels exacts",
      "Oui, suivies chaque mois avec un budget"
    ],
    "weight": 3,
    "type": "Interne"
  },
  {
    "id": "4A2",
    "starred": true,
    "internal": true,
    "title": "Échéances des contrats",
    "question": "Pour chacun de vos contrats principaux, connaissez-vous la date de renouvellement et la date limite de préavis ?",
    "relance": "Quel contrat se renouvelle dans les 12 prochains mois ?",
    "besoinAcces": true,
    "levels": [
      "Aucune",
      "Quelques-unes",
      "La plupart, non suivies",
      "Toutes, listées",
      "Calendrier avec rappel 3 mois avant le préavis"
    ],
    "weight": 3,
    "type": "Interne"
  },
  {
    "id": "4A3",
    "starred": true,
    "internal": true,
    "title": "Dernière comparaison",
    "question": "Quand avez-vous mis en concurrence au moins 2 fournisseurs pour la dernière fois, et quelle économie en est sortie ?",
    "relance": "Sur quel poste n'avez-vous jamais comparé ?",
    "besoinAcces": true,
    "levels": [
      "Jamais",
      "Il y a plus de 3 ans",
      "Il y a 2 à 3 ans",
      "Il y a 1 à 2 ans",
      "Il y a moins d'un an, économie chiffrée"
    ],
    "weight": 3,
    "type": "Interne"
  },
  {
    "id": "4A4",
    "starred": true,
    "internal": true,
    "title": "Marge par activité",
    "question": "Quels sont le coût et la marge par prestation, et le taux d'occupation de votre agenda ?",
    "relance": "Quelle activité vous coûte plus qu'elle ne rapporte ?",
    "besoinAcces": false,
    "levels": [
      "Non",
      "Marge globale seulement",
      "Marge connue pour l'activité principale",
      "Marge connue pour la plupart",
      "Marge par activité suivie chaque trimestre"
    ],
    "weight": 3,
    "type": "Interne"
  },
  {
    "id": "4A5",
    "starred": true,
    "internal": true,
    "title": "Trésorerie",
    "question": "Quel est votre solde de trésorerie prévu dans 3 mois, et comment le savez-vous ?",
    "relance": "Quel mois est le plus tendu ? Quel est votre seuil de rentabilité mensuel ?",
    "besoinAcces": false,
    "levels": [
      "Non, je regarde le solde de la banque",
      "Bilan annuel seulement",
      "Suivi irrégulier",
      "Tableau mensuel",
      "Tableau mensuel, prévision à 3-6 mois, seuil de rentabilité connu"
    ],
    "weight": 3,
    "type": "Interne"
  },
  {
    "id": "4A6",
    "starred": false,
    "internal": true,
    "title": "Achats",
    "question": "Comment gérez-vous vos achats (consommables) : planification, nombre de devis, prix négociés, pertes ?",
    "relance": "Dernière commande : combien de devis ? Quelle part est perdue ou jetée ?",
    "besoinAcces": false,
    "levels": [
      "Au coup par coup, sans suivi",
      "Fournisseur habituel, prix jamais comparés",
      "Prix comparés de temps en temps",
      "Commandes planifiées, 2 à 3 devis",
      "Commandes planifiées, prix négociés, pertes mesurées"
    ],
    "weight": 2,
    "type": "Interne"
  },
  {
    "id": "4A7",
    "starred": false,
    "internal": true,
    "title": "Entretien et investissements",
    "question": "Avez-vous un plan d'entretien et d'investissement budgété sur 12 mois ? La dernière panne coûteuse était-elle prévisible ?",
    "relance": "Quel équipement vous inquiète le plus ?",
    "besoinAcces": false,
    "levels": [
      "Aucun, pannes subies",
      "Besoins connus, aucun budget",
      "Liste des besoins, budget partiel",
      "Plan budgété",
      "Plan budgété, maintenance préventive planifiée"
    ],
    "weight": 2,
    "type": "Interne"
  },
  {
    "id": "4B1",
    "starred": true,
    "internal": false,
    "title": "Prix du marché",
    "question": "Pour vos 3 plus gros postes, savez-vous si vous payez plus cher que le marché, et de combien ?",
    "relance": "Quel écart avez-vous déjà constaté sur un devis concurrent ?",
    "besoinAcces": false,
    "levels": [
      "Aucune idée",
      "Impression seulement",
      "Quelques comparaisons",
      "Écart chiffré sur les postes principaux",
      "Économies obtenues et mesurées"
    ],
    "enjeu": 3,
    "type": "Opportunité"
  },
  {
    "id": "4B2",
    "starred": true,
    "internal": false,
    "title": "Hausse des coûts",
    "question": "Si vos charges augmentent de 10 %, pouvez-vous ajuster vos prix, et en combien de temps ?",
    "relance": "La dernière hausse de tarif : quand, de combien, quelle réaction ?",
    "besoinAcces": false,
    "levels": [
      "Hausses subies, aucune marge",
      "Hausses subies, marge faible",
      "Hausses connues, parade partielle",
      "Hausses anticipées, contrats sécurisés",
      "Hausses anticipées, contrats longs, tarifs ajustés"
    ],
    "enjeu": 3,
    "type": "Menace"
  },
  {
    "id": "4B3",
    "starred": false,
    "internal": false,
    "title": "Partenaires financiers",
    "question": "Avec quels partenaires financiers (banque, expert-comptable, centrales d'achat) travaillez-vous, et quelles conditions avez-vous négociées, quand ?",
    "relance": "Quand avez-vous revu vos conditions bancaires pour la dernière fois ?",
    "besoinAcces": false,
    "levels": [
      "Conditions subies",
      "Conditions correctes, jamais négociées",
      "Comparées une fois",
      "Négociées",
      "Négociées chaque année, avec conseils de pilotage"
    ],
    "enjeu": 2,
    "type": "Opportunité"
  }
] as DiagnosticQuestion[];

export const TRANSPARENCE = [
  "Un compte-rendu vous est remis sous 48 h, utilisable sans aucun achat auprès d'ALLNEEDS.",
  "ALLNEEDS propose aussi des offres (STARTER, PRO, PERFORMANCE, Accès). La recommandation peut être de ne rien acheter chez nous. La fiche d'adéquation, en dernière page, vous est montrée.",
  "Vos documents servent uniquement à ce diagnostic, sont consultés par l'équipe ALLNEEDS concernée, conservés 90 jours si aucun contrat n'est signé, puis supprimés. Suppression anticipée sur simple demande.",
  "Aucune promesse chiffrée avant analyse. Le diagnostic constate, il ne juge pas.",
] as const;

export const DOCUMENTS = [
  "Dernières factures télécom, internet et énergie",
  "Polices d'assurance : responsabilité civile professionnelle et multirisque",
  "Contrats de maintenance du matériel et de collecte des déchets médicaux",
  "Liste des abonnements logiciels (agenda, gestion, facturation)",
  "2 à 3 factures de fournisseurs de consommables",
  "Capture de l'agenda de la semaine (sans aucun nom de patient) et grille tarifaire",
  "Pour tout document : masquer toute donnée nominative avant remise.",
] as const;

export const FORMATS = [
  {format:'Complet',contenu:'40 questions, 4 volets',duree:'4 × 90 min + 45 min de synthèse (≈ 6 h 45), réparties sur 2 à 4 séances',quand:'Décideur disponible, enjeu élevé, premier diagnostic structurant'},
  {format:'Express ★',contenu:'20 questions marquées ★ (poids ou enjeu 3)',duree:'≈ 2 h 15 (cadrage 10 min, ~5 min par question, synthèse 25 min)',quand:'Décideur peu disponible, première prise de contact, qualification rapide. Le diagnostic complet peut suivre.'},
] as const;

export const DEROULE = [
  ['0 – 10 min','Cadrage','Expliquer le format, la notation de 0 à 5, la colonne Commentaire et ce que le diagnostic ne fait pas'],
  ['10 – 55 min','Partie A · 7 questions internes','Ce que la structure maîtrise : poser la question, creuser avec la relance, commenter, noter (environ 6 min par question)'],
  ['55 – 70 min','Partie B · 3 questions externes','Ce qui vient du marché, des clients et des partenaires : opportunités et menaces (environ 5 min par question)'],
  ['70 – 80 min','Synthèse à chaud du volet','Reporter les notes, repérer les 4–5 et les 1–2, noter les points à vérifier'],
  ['80 – 90 min','Restitution du volet','Valider avec le décideur ; passer au volet suivant ou fixer la prochaine séance'],
  ['Après les 4 volets','Séance de synthèse globale (45 min)','Classer les 40 notes, remplir la synthèse avec causes racines, valider les décisions et le plan de suivi'],
] as const;

export const GARDE_FOUS = [
  "Ne donner aucun avis médical, clinique ou réglementaire.",
  "Ne collecter aucune donnée nominative de patient (masquer les noms dans les captures d'agenda).",
  "Ne promettre aucun résultat chiffré avant analyse.",
  "Avis en ligne, publicité et réseaux (volet 2) : ne rien recommander tant que le professionnel n'a pas vérifié les règles de communication de son ordre ou de son autorité de tutelle.",
  "Chaque note est justifiée dans la colonne Commentaire (exemple cité, chiffre donné, document vu).",
] as const;

export const NOTATION = [
  {note:0,niveau:'Non évalué',type:'Non abordé ou aucune information fournie. Exclu du calcul de moyenne.'},
  {note:1,niveau:'Critique',type:"Inexistant, non maîtrisé ou bloquant pour l'activité."},
  {note:2,niveau:'Insuffisant',type:'Existe mais insuffisant, subi ou non suivi.'},
  {note:3,niveau:'Correct',type:'Fonctionnel, mais non structuré ni optimisé.'},
  {note:4,niveau:'Maîtrisé',type:'Structuré, suivi, avec des résultats visibles.'},
  {note:5,niveau:'Exemplaire',type:'Mesuré dans la durée, pouvant servir de référence.'},
] as const;

export const REGLES = [
  "Au fait, jamais à l'opinion. Aucun arrondi à la hausse. En cas d'hésitation entre deux notes, retenir la plus basse. Une affirmation sans exemple ni chiffre se note au niveau le plus bas compatible, puis se corrige dans la colonne Commentaire si un élément est montré.",
  "Poids (internes) : 3 = impact estimé de plus de 5 % du chiffre d'affaires ou des charges annuelles ; 2 = de 2 à 5 % ; 1 = moins de 2 %. L'animateur peut modifier un poids d'un cran avec le décideur, en justifiant par écrit.",
  "Enjeu (externes) : importance du sujet pour la structure, de 1 à 3. Écart = (5 − note) × enjeu.",
  "Question non traitée = 0, exclue de la moyenne. Si plus de 2 questions internes sont à 0 dans un volet, le volet est « non conclusif » et n'entre pas dans le classement.",
  "Calibration : les 5 premiers diagnostics de chaque animateur sont notés en binôme. Ensuite, 1 diagnostic sur 10 est re-noté par un second animateur sur 10 questions tirées au hasard. Un écart moyen d'un point ou plus déclenche une revue des repères.",
  "Repères et poids provisoires : à recalibrer sur données réelles après les 10 premiers diagnostics de chaque secteur.",
] as const;

export const CHARGES_POSTES = ['Matériel et consommables','Maintenance du matériel','Assurance RC professionnelle','Assurance multirisque','Logiciels et abonnements','Télécom et internet','Collecte des déchets médicaux','Autre'] as const;

export const ADEQUATION_CRITERIA = ['Décideur présent et impliqué','Problème clairement exprimé et coûteux','Échéance ou urgence identifiée',"Capacité d'investir évoquée", "Ouverture à structurer avant d'acheter des outils", 'Accord possible pour devenir structure de référence'] as const;

export const VERSIONS = [
  ['v4','—','Grille initiale : 40 questions, notation 0–5, qualification commerciale interne.','Fondateur ALLNEEDS'],
  ['v5','05/10/2026','Indice de maîtrise (%) · enjeu et écart pondéré pour les externes · formats Complet et Express · observation terrain · causes racines · plan de suivi J+30/60/90 · cadre de transparence · fiche d’adéquation partagée · calibration.','Fondateur ALLNEEDS'],
  ['v5.1','05/10/2026','Colonne Commentaire à la place de la preuve · 40 questions réécrites (formulation concrète, repères observables) avec une relance de creusement · questions conciergeries et concierges dans le volet Tourisme · questions de rappel (Santé) et de réinscription (Enseignement).','Fondateur ALLNEEDS'],
] as const;
