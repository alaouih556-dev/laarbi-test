# ALLNEEDS · Espaces métier Tourisme v2

Livraison frontend complète basée sur la version ALLNEEDS-SaaS précédente. Site public, client, admin, Santé, Éducation et diagnostic sont conservés. Tourisme devient cinq espaces distincts : quatre branches opérationnelles et l’agence centrale.

## Démarrage

Node.js >=22.12 (ou 24), puis dans le dossier extrait :

```powershell
npm install
npm run typecheck
npm run test:saas
npm run test:tourisme
npm run build
npm run dev
```

Le menu client « Espace métier SaaS » ouvre l’espace métier. Les branches disposent aussi de liens directs :

- `/app/tourisme/hebergement`
- `/app/tourisme/restauration`
- `/app/tourisme/activites`
- `/app/tourisme/transport`
- `/app/tourisme/agence`

Les données sont fictives et persistées dans le même navigateur. Les nouvelles branches utilisent `allneeds.tourism.v2.<organisation>`. Les anciennes données Tourisme v1 ne sont ni supprimées ni importées automatiquement. Santé, Éducation et leurs données restent sur les clés précédentes.

## Hébergement

Clients, catégories/équipements/services, unités/chambres, capacité et état technique, prix de base, saisons tarifaires, réservations de séjour, arrivée/départ, acomptes, ménage/maintenance, équipe, documents et échéances, facturation et dépenses.

Tarif du séjour calculé nuit par nuit avec la saison applicable. Départ exclusif. Refus des saisons qui se chevauchent, de la double réservation, des unités indisponibles et des capacités dépassées. Planning quotidien avec séjours actifs et tâches.

## Restauration

Salle/tables/zones, réservations avec horaires/capacité/conflits, clients, fournisseurs/conditions, menus/formules, ingrédients/unités/seuils/coûts, recettes et quantités par portion, prix de vente, marge ingrédients, mouvements de stock, achat/réception, pertes, inventaire compté, commandes multi-plats, tickets cuisine, encaissements partiels, annulations et restitutions de stock, clôtures de caisse et écart, factures/dépenses/équipe/documents. Les repas de groupes confirmés par l’agence apparaissent dans un module distinct.

Réception : coût moyen pondéré. Création de ticket : vérification atomique de toutes les lignes avant enregistrement, réservation du stock et conservation des prix/coûts. Annulation : restitution exacte des quantités d’origine, annulation des ventes associées, trace du remboursement enregistré et protection contre la double restitution. Aucun remboursement bancaire réel.

Les fiches techniques calculent la marge ingrédients, hors charges, énergie, personnel, pertes et taxes. Menus et tickets sont distincts : les menus décrivent les formules ; les tickets utilisent les recettes préparées. La clôture de caisse compare deux montants saisis ; elle ne constitue pas une clôture comptable certifiée.

## Activités

Catalogue (excursion, atelier, sport, culture, sortie), lieux/consignes/durée, tarifs adulte/enfant/groupe, coût de séance, guides/langues/compétences, équipements, séances/créneaux/capacité, participants, liste d’attente, présence, remboursement enregistré, planning, factures, dépenses, équipe et documents.

Prix calculé par composition adulte/enfant ou tarif groupe. Capacité par séance ; la liste d’attente ne consomme pas de place. Guides indisponibles et chevauchements d’affectation refusés.

## Transport

Clients, véhicules/catégories/capacité/coût kilométrique/kilométrage/état, chauffeurs/permis/échéance, trajets et transferts, origine/destination/horaires, affectation chauffeur/véhicule, passagers et embarquement, carburant/entretien/incidents, facturation/dépenses/équipe/documents.

Vérification de capacité, disponibilité technique, validité déclarée du permis, collisions de véhicule ou chauffeur. Coût estimatif = distance × coût kilométrique ; il ne représente pas une comptabilité complète du trajet. Créneaux limités à la même journée.

## Agence de voyage

CRM clients, fournisseurs par branche et conditions, dossiers voyage/dates/voyageurs/budget, listes voyageurs, programme de prestations, coûts fournisseurs, prix client, règlements fournisseurs, devis/version/statut, modifications/annulations/frais/remboursements, facturation/dépenses/équipe/documents.

Constructeur de package : choisir un dossier, composer hébergement/repas/activités/transport avec des ressources locales ou prestations externes, quantités et prix négociés. Calcul du prix, coût et marge après remise. Chaque version de devis fige ses lignes ; détail et export du devis client sans coûts internes.

Programme chronologique, aperçu voyageur sans coûts internes, téléchargement texte et impression/PDF par le navigateur. Le programme ne présente comme réservées que les prestations confirmées. L’aperçu voyageur est une présentation de démo, pas un portail authentifié indépendant.

### Coordination fournisseur

1. L’agence ajoute une prestation et clique « Demander au fournisseur ».
2. La branche concernée ouvre « Demandes agence ».
3. Le fournisseur examine, renseigne une référence et confirme ou refuse.
4. Pour une ressource locale, confirmation = création d’une réservation après les contrôles de la branche. Échec = aucune réservation ni confirmation créée.
5. Les prestations externes sont confirmées manuellement, sans réservation locale.
6. Une annulation de prestation confirmée depuis l’agence annule aussi la réservation locale liée et libère la capacité. Les remboursements restent à enregistrer séparément.

Pour les groupes, utilisez plusieurs prestations d’hébergement si les voyageurs doivent être répartis entre plusieurs unités. La date d’une activité locale doit correspondre au créneau choisi. Une réservation de repas groupe est un engagement de prestation, pas un ticket cuisine ni une affectation de table.

## Fonctions communes

Formulaires détaillés, références sélectionnées par identifiant, recherche, filtre de statut, modification, suppression contrôlée des références utilisées, export CSV par module, JSON par branche, tableau de bord et planning quotidien. Les factures et les opérations sont affichées séparément pour éviter de les additionner deux fois.

## Santé, Éducation, diagnostic

Fonctions de la version précédente conservées : fiches patients fictives et suivi administratif, index documentaire, rendez-vous et règlements ; inscriptions/groupes/emploi du temps/présences/échéances ; diagnostic par secteur avec les 28 questions originales, 4 axes, sauvegarde, scores complets, priorités, rapport JSON/impression et avis admin.

## Limites explicites

Frontend de démonstration uniquement. Pas de serveur, authentification métier réelle, contrôle d’accès sécurisé, isolation entre entreprises au niveau serveur, collaboration entre navigateurs, paiement bancaire, email/SMS, intégration OTA/POS, facturation fiscale certifiée ou stockage de dossiers médicaux. Ne saisissez pas de données réelles sensibles.

Les documents sont des index, pas des fichiers archivés. Pas de gestion complète de lots/péremption ou FIFO, de tournées multi-jours, d’optimisation d’itinéraires, de plan de salle graphique, de prix dynamiques, de synchronisation Channel Manager, de vouchers contractuels signés ou de remboursement bancaire. Les validations se basent sur les informations déclarées dans la démo.

Les données commerciales fournisseur restent dans le même store frontend pour la démonstration de coordination ; le masquage de l’aperçu voyageur ne remplace pas une séparation des données API.

## Validation

TypeScript/génération de routes, build de production, contrôles métier hérités et suite Tourisme (tarifs saisonniers, disponibilité, capacité, transport, stocks, commandes atomiques, annulation/restock, devis figés, coordination agence et annulation liée). Résultats consignés dans VALIDATION.md. Vérification visuelle et end-to-end navigateur non effectuée : navigateur de test absent de l’environnement.

React 19 / Vite 8 / TypeScript / Tailwind 4 / TanStack Router, versions testées indiquées dans package.json. Code splitting TanStack désactivé pour éviter le problème de chemins Windows contenant une apostrophe. dist contient le build statique ; node_modules est exclu du ZIP.
