# ALLNEEDS V9 — Architecture d’accès prête pour le backend

## Client
- À l’inscription, le client choisit son secteur, son profil d’espace métier et son abonnement.
- Après connexion réelle, le backend devra déterminer le rôle, l’entreprise, le secteur, l’abonnement et les permissions.
- Le client ne voit jamais les autres secteurs dans son espace connecté.
- L’espace SaaS de son secteur est visible mais verrouillé tant que `saas_enabled=false`.
- L’activation SaaS est gérée par l’administrateur entreprise par entreprise.

## Concierge
- Le concierge dispose d’un pilotage proche de l’administration pour les entreprises de son portefeuille : fiche entreprise complète, besoins, diagnostics, missions, prestataires liés, rendez-vous, documents, messages et suivi commercial.
- Son périmètre est l’union des entreprises attribuées par l’admin et des entreprises qu’il a apportées, filtrée par ses secteurs autorisés.
- Il ne voit jamais les autres entreprises, y compris en accédant directement à une URL de dossier.
- Il peut faire avancer les opérations dans son périmètre (statuts besoins, missions, rendez-vous, documents, publication de diagnostic et réponses messages).
- Il ne peut pas créer d’administrateur, changer les droits globaux, s’attribuer une entreprise ou activer lui-même le SaaS d’un client.

## Administrateur
- Vue globale de toutes les entreprises et tous les concierges.
- Création/suspension des concierges.
- Affectation des secteurs et entreprises aux concierges.
- Activation SaaS par entreprise.

## Règle backend cible
Toute API entreprise doit vérifier :

`admin OR (concierge AND company_id IN concierge_scope) OR (client AND company_id = user.company_id)`

Le filtrage frontend reste uniquement une UX de démonstration ; le backend devra répéter toutes les règles côté serveur.
