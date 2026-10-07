# Vérification questionnaires STARTER — V7

Date de contrôle : 03/10/2026

## Résultat

Les trois questionnaires sont séparés et proviennent désormais d'une source unique : `src/data/grid.ts`.

- Santé : 4 leviers × 7 questions = 28 questions.
- Enseignement : 4 leviers × 7 questions = 28 questions.
- Tourisme : 4 leviers × 7 questions = 28 questions.

Les 84 questions ont été comparées aux trois documents Word fournis par secteur. Aucune question attendue n'est absente.

## Correction anti-régression

- La page publique de chaque secteur lit directement `DIAGNOSTIC_GRIDS[sector]` : plus de copie manuelle des questions dans `SectorPage.tsx`.
- Le diagnostic automatique client déduit le secteur depuis l'entreprise du compte connecté et n'affiche plus de sélecteur Santé / Enseignement / Tourisme.
- Un client Enseignement ne charge donc que la grille Enseignement ; idem pour Santé et Tourisme.
- La grille interne Admin conserve le choix de secteur, car l'administrateur doit pouvoir travailler sur les trois grilles.

## Repères des grilles

### Santé
Patients & développement · Visibilité & confiance · Équipe & organisation · Charges & équipements

### Enseignement
Inscriptions & développement · Image & communication · Équipe & organisation · Charges & prestataires

### Tourisme
Réservations & développement · Image & visibilité · Équipe & exploitation · Charges & fournisseurs
