# ALLNEEDS V19 — Application intégrale du référentiel stratégique

Le document `reference/ALLNEEDS_Reflexion_Strategique_UX_UI.pdf` est traité comme **prompt maître / cahier des charges produit**, pas comme une pièce jointe informative.

## Règle d’architecture

Le portail principal porte la qualification, le diagnostic, la priorisation, la décision, l’action, le suivi, les KPI réels et l’optimisation. Les verticales Santé, Enseignement et Tourisme donnent le contexte métier. Les quatre métiers ALLNEEDS restent des moteurs de réponse derrière une navigation orientée objectifs.

## SaaS Santé séparé

Le SaaS ALLNEEDS Santé reste une application distincte. Il n’est pas fusionné dans le portail principal. Le portail principal contient le diagnostic Santé 360° et peut ouvrir le SaaS métier séparé quand l’accès est activé. Le dossier `ALLNEEDS-SANTE` est restauré à l’état antérieur à l’intégration erronée V17.

## Principes appliqués dans tout le portail principal

- Positionnement écosystème opérationnel, jamais simple annuaire / marketplace.
- Boucle visible : Besoin → Diagnostic → Priorité → Décision → Action → Résultat → KPI → Optimisation.
- Navigation principale : Accueil/Cockpit, Objectifs, Actions, Équipe, Écosystème, Performance, Projets, Documents, Notifications, Paramètres.
- One Next Action persistante dans l’espace client.
- Expérience filtrée par contexte et rôle sans dupliquer 108 parcours.
- Onboarding progressif : qui, activité, lieu, difficulté principale, objectif prioritaire.
- Profil entreprise transformé en cockpit opérationnel avec uniquement des données réellement présentes.
- Matching explicable et preuves de confiance visibles.
- Messagerie contextuelle rattachée aux sujets/dossiers.
- Notifications classées par intention et conduisant à l’action.
- KPI calculés uniquement à partir de données existantes.
- Expert / Partenaire avec environnement de travail séparé.
- Admin en Control Tower.
- Responsive orienté exécution sur mobile et décision/analyse sur desktop.
- Diagnostic Santé 360° v5.1 intégré dans le portail principal seulement.

Aucune donnée métier inexistante n’est présentée comme réelle.
