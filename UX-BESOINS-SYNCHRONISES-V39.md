# ALLNEEDS — Besoins synchronisés V39

## Parcours désormais partagé

1. Le dirigeant ou responsable dépose un besoin depuis son espace client.
2. Le serveur contrôle l’entreprise et le rôle, puis enregistre la demande avec sa date, son auteur, ses critères et un premier événement d’historique.
3. L’administration et le concierge affecté retrouvent cette même demande sur leurs écrans, avec le périmètre d’entreprise du compte.
4. L’équipe fait avancer le dossier étape par étape. Chaque transition est enregistrée au serveur et ajoutée à son historique.
5. Le dirigeant/responsable peut signer ou clôturer. Un collaborateur peut consulter son périmètre mais ne peut pas créer de demande ou modifier une étape.
6. Quand le profil revient sur l’écran ou remet la fenêtre au premier plan, les besoins sont relus sur le serveur.

## Ce que l’écran annonce

- L’espace connecté signale que les besoins et leurs étapes sont synchronisés.
- Les limites de quota ne sont pas appliquées côté serveur : elles ne bloquent donc pas le dépôt connecté.
- Les prestataires et devis de démonstration sont masqués dans les dossiers réels. L’administration explique ces deux fonctions comme étant à raccorder.
- Les missions, diagnostics hors API, messages, documents, rendez-vous, abonnements et indicateurs ne sont pas déclarés synchronisés par cette tranche.

## API

- `GET /api/needs` : liste uniquement les besoins accessibles au rôle et au périmètre entreprise.
- `POST /api/needs` : validation et création côté serveur.
- `PATCH /api/needs/:id` : mise à jour d’étape, contrôle de rôle, contrôle d’ordre et historisation.
- Les requêtes d’écriture doivent avoir une origine web autorisée et une session valide.

## Mise en route locale

Suivre `BACKEND-AUTH-V1.md` pour lancer l’API, définir un mot de passe sur un compte de démonstration et démarrer Vite sur `127.0.0.1:5176`.

## État de validation

`node --check backend/server.mjs` est passé. Les dépendances frontend ne sont pas installées ici ; build, typage et vérification en navigateur restent à effectuer avant toute présentation comme pilote prêt.
