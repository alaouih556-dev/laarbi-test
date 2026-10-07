# ALLNEEDS V16 — Implémentation du référentiel stratégique UX/UI & Architecture produit

Cette version part de V15 et applique le document de référence `ALLNEEDS — Réflexion stratégique UX/UI & Architecture produit` sans reconstruire le produit depuis zéro.

## Principes réellement intégrés

- Positionnement : ALLNEEDS est présenté comme un écosystème opérationnel, pas comme un annuaire.
- Boucle produit visible : Besoin → Diagnostic → Priorité → Décision → Action → Résultat → KPI → Optimisation.
- Navigation client réorganisée autour de l’intention utilisateur : Accueil/Cockpit, Objectifs, Actions, Équipe, Écosystème, Performance, Projets, Documents, Notifications, Paramètres.
- Les 4 métiers restent des moteurs internes et sont exposés comme contexte dans les objectifs, pas comme navigation principale.
- Trois situations sont désormais capturées à l’inscription : entreprise existante, entreprise en création, investisseur.
- Onboarding progressif : difficulté principale puis objectif prioritaire, sans questionnaire lourd au démarrage.
- One Next Action : le cockpit calcule une prochaine action à partir des données déjà présentes (documents requis, besoins, missions, messages, rendez-vous, diagnostics).
- Les KPI de Performance sont uniquement dérivés des données de démonstration réelles ; aucun chiffre n’est inventé.
- Matching explicable : l’Écosystème n’affiche que les prestataires déjà reliés aux besoins et explique pourquoi un profil apparaît.
- Rôle client contextuel de démonstration : Dirigeant, Manager/Responsable, Collaborateur filtrent la navigation.
- Espace Expert/Partenaire séparé : Accueil, Demandes, Missions, Clients, Agenda, Propositions, Documents, Performance, Profil.
- Admin conservé comme Control Tower.
- Messagerie existante conservée ; les nouvelles surfaces renvoient vers les dossiers existants au lieu de créer une messagerie parallèle.
- Notifications orientées intention : action requise, attention, information, résultat.
- Responsive : les nouveaux cockpits se réorganisent pour mobile sans simplement compresser les grilles desktop.
- Le lien ALLNEEDS Santé reste direct vers `https://allneed-s-sante.vercel.app`.
- ALLNEEDS Santé conserve son workflow métier existant et reçoit une priorité `One Next Action` sur le dashboard.

## Ce qui reste volontairement "démo frontend"

Le projet existant n’a pas de backend de production pour les nouveaux contextes. La version V16 ne prétend donc pas que les points suivants sont réels côté serveur : authentification multi-rôle, calcul automatique avancé des priorités, matching algorithmique, stockage partagé inter-appareils, permissions backend, synchronisation temps réel. Les interfaces utilisent les données de démonstration existantes et rendent cette limite explicite.

## Règles de conservation

Les pages Besoins, Diagnostics, Missions, Devis, Prestataires, Messages, Documents, Rendez-vous, Livrables, Abonnement, Concierge et Admin sont conservées. La nouvelle navigation les réorganise derrière un cockpit objectif/action sans supprimer la logique existante.

## Vérifications

- `node scripts/test-questionnaires.mjs`
- `node scripts/test-access-v9.mjs`
- `node scripts/test-v10-rules.mjs`
- `node scripts/test-v16-strategy.mjs`

Le build complet nécessite les dépendances npm (`npm install`) puis `npm run build`.
