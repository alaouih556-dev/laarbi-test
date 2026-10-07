# Backend MVP — décision V23 (P0)

## Verdict

Le brief P0 exige backend (auth réelle, isolation entreprise côté serveur, consentements journalisés, sauvegardes). Avant tout développement, on fixe le cadre. V22 repose sur `localStorage` + routeur ; toute nouvelle donnée persistante doit être réévaluée via ce document avant implémentation.

## Choix proposé (à valider avant dev)

- **Base** : Postgres (Supabase ou VPS) — schéma relationnel nécessaire aux consentements et consent views, RLS pour isolation entreprise.
- **Auth** : Supabase Auth (email) ou équivalent — interdit de resécréter dans le front.
- **Consentements** : ligne par acceptation avec `consented_at`, `user_id`, `version`, `ip`, `user_agent` — append-only, exportable.
- **Permissions** : middleware unique `assertAccess(orgId, resource, action)` appliqué à chaque lecture/écriture API ; la règle cible du brief est la source.
- **Exports/suppression** : jobs planifiés, journalisés ; politique 90 jours alignée sur les grilles 360.
- **Environnements** : `dev` / `staging` / `prod` séparés ; aucun secret dans le dépôt.

## Contrat API minimal MVP

- `POST /api/diagnostics` — crée/maj un diagnostic (ownership par orgId et userId validés)
- `GET /api/diagnostics/:id` — charge un diagnostic (ownership vérifié)
- `POST /api/diagnostics/:id/consent` — journalise acceptation (append-only)
- `GET /api/entreprises` (admin/concierge scope), `PATCH /api/entreprises/:id/access` (admin uniquement)

Non livré dans cette tranche : implémentation serveur, migrations, tests d'isolation. C'est la prochaine tranche concrète après validation de ce cadre.
