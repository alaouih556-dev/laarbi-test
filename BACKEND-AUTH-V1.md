# Backend ALLNEEDS — authentification et périmètre API

## Ce qui a changé

- Les requêtes API ne peuvent plus choisir leur identité via `x-user-id`.
- Connexion par adresse e-mail et mot de passe, avec hash scrypt salé dans le fichier utilisateur.
- Session signée, cookie `HttpOnly`, `SameSite=Strict`, expiration à 8 heures et indicateur `Secure` en production.
- Déconnexion qui expire le cookie, endpoint `/api/me` qui retourne uniquement le profil public.
- Origine web configurée explicitement, contrôle d’origine sur les écritures, taille maximale du corps JSON de 1 Mo et limitation des échecs de connexion.
- Les permissions diagnostics et besoins sont contrôlées selon le rôle et l’entreprise côté serveur. Les collaborateurs ne peuvent pas lire ni créer de diagnostic ou déposer/modifier un besoin. Le consentement provient de la session du dirigeant ; son nom et sa date sont produits par le serveur.
- `GET /api/needs` ne renvoie que les besoins des entreprises attribuées à l’utilisateur (toutes pour l’administration). `POST /api/needs` crée un dossier partagé. `PATCH /api/needs/:id` conserve l’historique de chaque changement d’étape ; les changements opérationnels sont réservés à l’administration/au concierge et les décisions finales au dirigeant/responsable.
- Les secrets de mots de passe sont exclus des réponses API et les fichiers de données/journal sont écrits avec des permissions restrictives quand le système les prend en charge.
- L’écran de connexion utilise maintenant ces routes : les boutons de démo sont distincts et ne se présentent plus comme une authentification.
- Les entrées `/app`, `/admin` et `/concierge` vérifient la session et son rôle. L’interface bloque les ouvertures directes sans session ou sans rôle autorisé.

## Démarrage local

1. Depuis la racine du projet, démarrer l’API avec `npm run backend:start`. Cela initialise `backend/data/db.json` et crée les profils de démonstration sans mot de passe.
2. Pour chaque profil utilisé, définir un mot de passe depuis un terminal interactif avec `npm run backend:set-password -- adresse@exemple.ma`. La saisie est masquée et exige au moins 12 caractères.
3. Démarrer l’interface avec `npm run dev`. Vite écoute sur `127.0.0.1:5176` et transmet `/api` au backend local sur le port 8787.
4. En production, définir `ALLNEEDS_SESSION_SECRET` avec une valeur aléatoire d’au moins 32 caractères, `ALLNEEDS_FRONTEND_ORIGIN` avec l’origine HTTPS exacte de l’interface, et un répertoire `ALLNEEDS_DATA_DIR` privé et persistant.

## Limites avant toute utilisation métier réelle

- L’authentification, les diagnostics et les besoins (création et changement d’étape) sont raccordés au serveur. Devis, prestataires, missions, rendez-vous, messages, fichiers, abonnements et indicateurs restent des démonstrations locales ; ne les traitez pas comme des dossiers réels.
- Les boutons de démonstration et le parcours `/inscription` restent locaux. L’inscription ne crée pas d’utilisateur serveur et n’envoie pas de demande ; l’écran le signale.
- Le serveur fournit seulement les comptes de démonstration listés dans `backend/server.mjs`. Pour créer un vrai client, responsable ou collaborateur, il manque encore une gestion sécurisée des invitations/utilisateurs dans l’administration.
- Le stockage serveur est encore un fichier JSON : pas de transactions, de contrôle de concurrence, de sauvegarde automatisée, ni de gestion de comptes et d’invitations par l’interface.
- La limitation des tentatives est en mémoire dans un seul processus. La révocation des sessions et la limitation distribuée ne sont pas implémentées.
- Pas de récupération de mot de passe, confirmation d’adresse, MFA, journal de connexion administrable, rotation de secret ou mécanisme de déploiement/secret manager.
- La gestion des quotas n’est pas encore appliquée côté serveur. Les routes de missions, fichiers, messages, prestataires, factures et abonnements restent à implémenter avant d’y stocker des données réelles.
- La version V39 n’a pas été compilée ni validée par des tests automatisés dans cette session. Ne pas utiliser les comptes ou données d’exemple avec des données réelles.
