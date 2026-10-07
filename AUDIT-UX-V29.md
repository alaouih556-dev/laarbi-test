# Audit UX — V29 face aux exigences ALLNEEDS

Date : octobre 2026. Source : V29 courant.

## Context and already applied (V23–V29)
- Diagnostic 360 unique Santé/Enseignement/Tourisme est présent (`/app/diagnostic-auto`, moteur partagé, Express ✱ indicatif, exclusion du 0).
- CTA publics “diagnostic offert” redirigent vers `/inscription`; “Créer mon compte” visible sur la page d’accueil.
- Navigation client affiche `Diagnostic 360° <secteur>` + `Espace métier SaaS` verrouillé/activé selon admin.
- Public nav : Accueil + univers choisi + Diagnostic offert + FAQ (pas de tous les métiers).
- Styles V24–V29 css déjà appliqués : typo, ombres, fonds clairs saisissables.

## Points forts/écarts face à la direction UX
1. COCKPIT :
   - 🟡 Actuellement l’accueil client (`/app`) présente encore de nombreux cards/bannières. On a du texte répétitif et des domaines non prioritaires.
   - ✅ Les feux comme “Diagnostic 360” et “Plan d’action” existent mais ne sont pas assez hiérarchisés en prochaines actions.
   - 🟢 Action requise : réduire les paragraphes, augmenter “Que faire ici et maintenant”, remplacer stats décoratives par sources explicables.

2. DOSSIER TRAVAIL :
   - 🟡 Missions/besoins/devis existent séparément dans `/app/*`, pas dans un objet unifié. La demande était d’utiliser `Dossier` justement.
   - 🟢 Action requise : renforcer l’objet Dossier comme conteneur métier (besoin, responsable, échéances, devis, documents, résultats) sans créer un nouveau modèle.

3. TEXTE → OBJETS MÉTIER :
   - 🟢 Échéances : cartes/factures/boolées sont présentes partiellement via widgets (Stat, table etc.), mais pas assez expressives.
   - 🟢 Action requise : remplacer broches d’explications sur pages publiques par icones actions claires et states visuels (fourni/vérifié/refusé).

4. RÔLES / VISIBILITÉ :
   - ✅ Rôles existent dans store et store model; espace Expert verrouillé par défaut via admin.
   - 🟡 Expert workspace montre `data issus de la démo` — à clarifier avec badge permanent.
   - 🟢 Action requise : garder l’affichage demo, éviter toute suggestion d’automatisation réelle.

5. TYPOGRAPHIE/HIÉRARCHIE :
   - ✅ Déjà normalisation Manrope/DM Sans + V24 spacing.
   - 🟡 Cartes encore parfois trop denses sur mobile; tableaux dans admin a conservés.
   - 🟢 Action requise : appliquer la règle “fait → conséquence → action → preuve” sur les 10 pages clés (Accueil, Secteurs, Diagnostic, /app, /app/diagnostics, /concierge*, /admin*).

6. COULEURS / ARRIVÉES :
   - ✅ Fond désormais contrasté; accents sectoriels couleurs par voie.
   - 🟡 Liens/boutons parfois gris sur fond clair; dans V29 il y a encore des sections blanches.
   - 🟢 Action requise : accentuer les fonds neutres du cockPit? pas de ce rapport.

7. Pièces jointes :
   - 🟡 Pages Documents proposent index; pas encore d’objet pièce avec source/date/statut/responsable juxtaposés.
   - 🟢 Action requise : une fiche document unifiée existe? partiellement; à renforcer plutôt qu’implanter.

8. Marketing :
   - ✅ Accueil: choix du secteur en tête, CTA inscription, offre claire.
   - 🟡 Dans pages publiques, les blocs descriptifs restent longs; besoin de logique “situation → conséquence → action → preuve”.

9. Mobile/accessibilité :
   - Déjà grid-responsive avec `max-w-7xl`, accessibilité boutons; à tester les cibles tactiles sur saint onglets (Header, Tables).

## Priorités proposées
1. Page /app (cockpit dirigeant) : réduire texte, hiérarchie “fais ici et maintenant”, sources en small, prochaine action visible.
2. Page /app/documents et /app/devis : consolider remplacer texte par cartes métier (type facture/document, statut, fichier, responsable).
3. Public Pages: raccourcir paragraphs, ajouter tokens de décision (action, délai, livrable, limites) — surtout sur Secteurs et Tarifs.
4. Expert: ajouter badge `ENVIRONNEMENT DE DEMO` plus visible dans app shell.
5. Renforcer fil d’Ariane sur pages publiques (déjà) et documenter navigateurs cas.

## Limites/missing data
-Backend Postgres et Auth réelle toujours sorties du MVP: en V29 le store est navigateur/local; ne pas prétendre isolation serveur.
-Pas de KPI réels: les stats demo ne doivent pas être présentées comme client réel.
