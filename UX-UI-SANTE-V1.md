# ALLNEEDS — UX/UI Santé V1

Cette version restructure l'expérience autour de 4 principes :

1. **Accueil général** : présentation d'ALLNEEDS sans mélanger les trois secteurs.
2. **Choix du secteur** : Santé, Enseignement ou Tourisme, puis navigation vers un univers dédié.
3. **Trois rôles séparés** : Client, Concierge, Administrateur.
4. **SaaS visible mais verrouillé** : un module peut être présenté au client sans être cliquable tant que l'administrateur n'a pas ouvert l'accès.

## Santé

La page Santé est enrichie à partir des documents fournis :
- diagnostic STARTER de 90 minutes ;
- 4 leviers, 7 questions par levier, score /35 ;
- documents à demander avant rendez-vous ;
- garde-fous santé ;
- logique STARTER / PRO / PERFORMANCE déjà présente dans le catalogue.

## Rôles

### Client
- voit son espace et ses SaaS ;
- les SaaS non autorisés restent visibles mais désactivés.

### Concierge
- ne voit que les entreprises explicitement attribuées par l'administrateur ;
- ne voit que les secteurs autorisés ;
- peut ajouter une entreprise qu'il apporte lui-même, uniquement dans un secteur autorisé.

### Administrateur
- crée/suspend les comptes concierge ;
- attribue les secteurs ;
- attribue les entreprises ;
- ouvre/ferme les accès SaaS du client démo.

## Routes ajoutées
- `/concierge`
- `/concierge/entreprises`
- `/admin/concierges`

## Important
Cette version reste une **démo frontend** : les autorisations sont simulées dans le store/localStorage. La version production devra reproduire les mêmes règles côté backend/API afin qu'un utilisateur ne puisse pas contourner les droits en modifiant l'URL ou le navigateur.
