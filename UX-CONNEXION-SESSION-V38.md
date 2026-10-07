# ALLNEEDS — Connexion, sessions et besoins synchronisés V39

## Livré dans cette tranche

- Le formulaire `/connexion` appelle `POST /api/auth/login` et conserve uniquement le cookie de session HttpOnly du serveur. Les erreurs du backend sont affichées sans révéler si l’adresse ou le mot de passe est incorrect.
- Au chargement, l’interface vérifie `/api/me`. L’en-tête reprend le nom et le rôle renvoyés par le serveur.
- Les espaces `/app`, `/admin`, `/concierge` et `/expert` vérifient la session et son rôle. Un rôle inconnu ou une ouverture directe sans session est refusé.
- La déconnexion appelle le serveur et expire le cookie.
- Les comptes de démonstration sont des boutons séparés. Leur état est porté par un indicateur de session éphémère, distinct du cookie d’authentification.
- L’inscription locale est appelée « parcours de démonstration » : un avertissement précise qu’aucun compte n’est créé et qu’aucune demande n’est envoyée.
- L’espace `/expert` peut être exploré en démo ; aucun dossier partenaire ni échange client réel n’y est connecté. Le rôle serveur `prestataire` est reconnu par le garde-fou, mais aucun compte partenaire réel ne peut encore être provisionné par l’administration.
- Après connexion réelle, l’interface avertit que seuls l’accès et le rôle sont vérifiés : les données métier affichées restent fictives et locales. Les contrôles de réinitialisation de démo ne sont pas proposés dans cette session.
- Vite est fixé sur le port 5176, correspondant à l’origine autorisée par défaut dans le backend.

## Extension V39 — cycle de vie des besoins

- Le dirigeant/responsable peut déposer un besoin et le concierge/l’administration le retrouvent sur le serveur, avec accès limité aux organisations permises par leur compte.
- Les changements de statut des besoins sont synchronisés entre les espaces et historisés côté serveur. Seuls l’administration/le concierge pilotent les étapes métier ; le dirigeant/responsable peut signer ou clôturer.
- Un collaborateur ne peut ni déposer un besoin ni modifier son statut. Les contrôles sont appliqués par l’API, pas uniquement par les boutons de l’interface.
- Les vues connectées de besoins n’affichent plus de prestataires ou devis fictifs venant du navigateur.
- L’indication globale est précisée : seuls les besoins et diagnostics sont raccordés au serveur. Les missions, prestataires, devis, messages, documents, rendez-vous, abonnements et indicateurs ne le sont pas encore.

## Rôles et comptes semés

Les profils initiaux du backend couvrent l’administrateur ALLNEEDS, le concierge de démonstration, trois dirigeants (Enseignement, Santé, Tourisme), un responsable et un collaborateur. Aucun mot de passe n’est livré. L’opérateur doit le définir interactivement avec `npm run backend:set-password -- adresse@exemple.ma`.

## Ce qui bloque encore un pilote réel

1. Les utilisateurs ne peuvent pas créer de compte depuis l’interface. L’administration doit obtenir une fonction serveur d’invitation, révocation et attribution d’entreprise/rôle.
2. Seuls les diagnostics et besoins sont persistés au serveur. Chaque autre ressource doit être migrée avec autorisations et cloisonnement : devis, prestataires, missions/jalons/livrables, messages, documents, rendez-vous, abonnements et indicateurs.
3. L’équipe et les concierges sont encore gérés localement ; leurs changements de rôle et droits ne sont pas des autorisations serveur effectives.
4. Le stockage est un JSON local sans transactions, réplication ni sauvegarde automatisée. Il faut une base durable et des sauvegardes restaurables avant d’y placer des données réelles.
5. Récupération du compte, confirmation d’adresse, révocation des autres sessions, MFA et audit exploitable ne sont pas implémentés.
6. Le backend n’est pas raccordé au déploiement de production. La configuration actuelle du proxy ne suffit qu’au développement local.

## Vérification

Le fichier backend a passé `node --check`. Aucun build ni parcours navigateur n’a été lancé : les dépendances frontend ne sont pas installées dans cet environnement. La compilation et les parcours navigateur restent à confirmer avant un pilote.
