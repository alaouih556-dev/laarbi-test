# Audit stratégique et visuel ALLNEEDS — 7 octobre 2026

## Corrections intégrées

- **Promesse commerciale cohérente :** l’offre STARTER / Express est présentée comme un diagnostic d’environ 2 h 15, avec 20 questions, 4 thèmes et 3 priorités. Le diagnostic complet d’environ 6 h 45 est présenté comme une étape que le concierge propose ensuite, avec périmètre, calendrier et tarif à valider avant tout démarrage.
- **Résultats plus utiles :** la page Résultats rassemble maintenant besoins, missions et documents dans un tableau filtrable et recherchable. Les lignes affichent l’état, la prochaine action, la progression et l’échéance quand elle existe; le tri met les blocages et sujets urgents en premier.
- **Offres explicables :** la rubrique concierge « Offres complémentaires » montre les livrables, le périmètre inclus, les exclusions, le prix et le délai à discuter avant la décision du client.
- **Espace partenaire orienté travail :** les rubriques couvrent les réponses aux demandes, les devis, l’agenda, les missions, les documents, les résultats et le profil. Les actions de navigation distinguent la page active.
- **Lisibilité ciblée :** les légendes et petits textes des pages offres, diagnostics concierge et entreprises suivies ont été relevés à une taille minimale plus confortable; les tableaux restent parcourables sur petit écran.
- **Erreur récupérable :** une erreur de page affiche maintenant une explication en français, une action pour réessayer et un retour à l’accueil. Les détails techniques restent réservés au développement.

## Points qui restent avant une vraie mise en production

1. **Les actions de démonstration ne sont pas encore des échanges réels.** Les invitations d’équipe, devis partenaires et plusieurs mutations du portail sont stockés localement dans le navigateur; aucun courriel, devis, document ou rendez-vous n’est transmis par ces écrans.
2. **Les données doivent avoir une source serveur commune.** Il faut relier ces actions à des comptes, permissions, stockage partagé et journal d’audit côté serveur avant de s’en servir entre clients, concierges et prestataires.
3. **L’écran Vercel montré en capture n’a pas pu être reproduit ici.** La route secteur existe dans le code; le nouveau secours améliore le comportement visible en cas d’exception, mais ne prouve pas que la cause de l’erreur du déploiement est corrigée.
4. **La validation visuelle finale dans un navigateur et la compilation restent à faire.** Les dépendances du projet ne sont pas installées dans ce dossier. L’audit a été fait sur le code et les captures fournies; aucun déploiement Vercel n’a été effectué.

## Lecture marketing

Le parcours recommandé est maintenant plus explicite : diagnostic Express d’entrée → constats et priorités restitués → proposition de mission par le concierge si un besoin réel est confirmé → accord du client sur le devis et le périmètre. Une recommandation ne vaut pas vente et le diagnostic complet n’est pas présenté comme du travail gratuit par défaut.

