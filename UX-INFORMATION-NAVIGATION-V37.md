# ALLNEEDS — Refonte du pilotage et des accès V37

## Pilotage de direction et continuité des parcours

- Accueil admin ramené à une file de décisions datées : demande sans réponse, prospect en retard, besoin sans prestataire, livrable en attente, jalon dépassé, diagnostic à restituer.
- Acquisition de nouveaux clients distincte des offres complémentaires proposées aux comptes existants après diagnostic publié. Le chiffre du pipeline d’acquisition n’additionne pas ces deux activités.
- La vue Admin des opportunités complémentaires permet de suivre les étapes renseignées par les concierges.
- Le menu Concierge dit « Offres complémentaires » plutôt que « Suivi commercial », pour nommer l’action réelle.
- Les indicateurs financiers disent clairement qu’il s’agit d’honoraires contractualisés ou de budgets annoncés, pas d’encaissements ni de marge. Coûts prestataires, factures et paiements ne sont pas encore enregistrés.
- Les relances ouvrent le canal de contact et ne prétendent pas envoyer le message. Les relances document et prospect sont consignées ; les rappels de devis renvoient à la fiche besoin où la décision doit être suivie.
- La qualification convertit la borne basse déclarée d’une fourchette en budget de travail sans concaténer par erreur ses bornes.
- Les actions « planifier » sans création réelle de rendez-vous sont retirées des raccourcis de production.

## Plan d’action

- Priorité 1 isolée, autres étapes rangées ensuite, avec rang explicite.
- L’ordre s’appuie sur les jalons bloqués, l’urgence déclarée, les décisions attendues et les pièces requises.
- Chaque action explique pourquoi elle remonte, ce qu’elle débloque et ouvre le dossier correspondant.
- L’ordre reste une recommandation et n’invente pas d’échéance.

## Objectifs de dirigeant

- Choix d’un cap métier au lieu de cartes statiques avec compteurs.
- Présentation de l’effet attendu dans le quotidien et des dossiers réellement associés au cap.
- Les actions ne sont plus répétées artificiellement d’un objectif à l’autre.
- Une explication précise le rôle et les limites de la rubrique.

## Résultats

- Point de pilotage en tête, progression des missions et pièces à compléter visibles.
- Volumes secondaires repliés; indicateurs calculés à partir des dossiers de l’établissement.

## Équipe

- Ajout d’un salarié avec nom, e-mail, fonction, rôle et sélection des rubriques autorisées.
- Invitation en attente, changement de rôle et retrait de l’accès dans la démonstration.
- Ces accès sont stockés localement dans l’espace de démonstration. Aucun e-mail, compte indépendant ni contrôle serveur des permissions n’est activé.

## Navigation et marketing

- Suppression du bandeau de contexte répété sous l’en-tête des pages client.
- Accroche publique centrée sur la charge de direction, le diagnostic, trois priorités et la décision laissée au dirigeant.
- Messages par secteur précisés autour de situations quotidiennes, sans statistique ou promesse de résultat inventée.

## Améliorations précédentes conservées

- Diagnostic guidé question par question, réponses sauvegardées et repères internes repliés.
- Missions présentées comme un parcours de progression avec prochaines étapes et jalons réels.
- Profil & activité et navigation groupée/mobile.
- Prix et détail des offres réservés à l’espace connecté; secteurs santé, enseignement et tourisme conservés.

## Vérification

État de la version V37 avant le raccordement V38 : le code n’avait pas été compilé ni prévisualisé et aucun test automatisé n’avait été lancé.

## Audit de complétude — points à traiter avant une mise en production

- Authentification (état V37, remplacé en V38) : le premier backend existait mais l’écran ne l’appelait pas encore. Voir `UX-CONNEXION-SESSION-V38.md` pour la suite.
- Accès salariés et concierges : invitations, rôles et affectations restent stockés dans le navigateur. Le filtrage d’interface ne constitue pas un contrôle d’accès serveur. Les règles du backend sont encore limitées aux diagnostics et consentements ; aucune donnée réelle ne doit y être introduite avant l’intégration et la couverture de toutes les ressources.
- Données : les changements de la démo restent sur l’appareil via localStorage ; ils ne sont partagés ni entre collaborateurs ni entre appareils. Définir stockage central, sauvegarde, historique et suppression avant pilote réel.
- Relances : les brouillons ouvrent l’application e-mail et ne partent pas automatiquement. Le suivi de devis reste consigné dans la fiche du besoin ; aucun historique dédié à l’objet « devis » n’est encore stocké.
- Finances : honoraires contractuels, montants proposés et budgets annoncés ne renseignent ni facturation, encaissement, coûts prestataires, commission, marge ou renouvellement. Ne pas les interpréter comme trésorerie ou revenu net.
- Écosystème prestataires : les champs de conformité sont des déclarations de démonstration ; conserver les justificatifs, dates de validité et traces de contrôle dans un dossier documentaire avant diffusion réelle.
- Rendez-vous : certaines confirmations mettent à jour un statut local. Aucune synchronisation calendrier, notification automatique ou détection de conflit n’est connectée.
- Backend (état V37, complété partiellement en V38) : l’API de connexion est maintenant appelée par l’écran, avec routes rôle protégées ; les ressources métier et leur intégration restent à terminer. Voir `BACKEND-AUTH-V1.md` et `UX-CONNEXION-SESSION-V38.md`.
- Publication : les coordonnées, profils et exemples présents sont fictifs. Remplacer par les vrais contenus approuvés et vérifier le consentement avant toute mise en ligne.
