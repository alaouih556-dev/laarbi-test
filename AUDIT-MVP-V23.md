# AUDIT PRODUIT & TRANCHE MVP V23 — ALLNEEDS

Date : 06/10/2026. Portée : ALLNEEDS-PRINCIPAL (V22 extrait, node_modules, build vérifié).

## 1. Sources analysées (ordre de priorité du brief)

1. **Grilles 360 v5.1 (Santé / Enseignement / Tourisme)** — 4 volets, 40 questions (28 internes A, 12 externes B), repères 1→5, commentaire, relances, Complet (~6 h 45) et Express ✱ (~20 questions, ~2 h 15), notation (0 = non évalué, exclu des moyennes), Type = (5−note)×poids / écart = (5−note)×enjeu, causes racines ×3, J+30/60/90, fiche d'adéquation /12, re-notation J+90, cadre de transparence, garde-fous, journal de versions.
2. **Plaquettes commerciales** — STARTER (diagnostic 1 h 30, offert), PRO (mission de structuration, prix unique), PERFORMANCE (+30 j), Accès CONNECT/PLUS/PRIORITÉ (pool 6/15/30 besoins/an). Garde-fous (aucune promesse chiffrée avant analyse, aucune donnée nominative d'élèves, communication informative en Santé).
3. **Réflexion stratégique UX/UI** — boucle BESOIN→DIAGNOSTIC→PRIORITÉ→DÉCISION→ACTION→RÉSULTAT→KPI→OPTIMISATION ; navigation par objectifs ; onboarding progressif ; « One Next Action » ; dashboard-cockpit ; KPI mesurés uniquement.
4. **Code V22** — React 19 + TanStack Router + Tailwind 4, store localStorage, espaces public/client/admin/concierge/expert, SaaS Santé et Tourisme séparés.

## 2. État complet V23 (livré sur V22)

### Corrections / extensions diagnostic 360
- **`src/lib/diagnostic360.ts`** (nouveau) : moteur unique v5.1 — 0 exclu, couverture, indice de maîtrise, conclusivité (>2 internes à 0), priorités (5−note)×poids, écarts externes (5−note)×enjeu, pools internes/externes, mode Express ✱ (indice indicatif, volets non classés, conclusivité sur questions posées uniquement).
- **`Diagnostic360.tsx`** branché sur ce moteur, consentement horodaté (`consentAt`, `consentBy`, `consentVersion`) exigé avant démarrage.
- **`packs.ts` + `diagnosticData.{tourism,enseignement}.ts`** (générés depuis les grilles v5.1) : les 3 secteurs utilisent désormais le Diagnostic360 complet, avec garde-fous et documents propres à chaque verticale. `Diagnostic.tsx` ne sépare plus Santé des autres.

### Décision D3 — prix publics
Les pages publiques reprennent les plaquettes (prix de lancement + prix normal barré). La règle V11 « pas de prix avant diagnostic publié » est supersédée par la V22 ; `test-offers-v11` est aligné sur cette décision (passe désormais).

### Refonte accueil/parcours publics (demande utilisateur)
- Accueil : premier choix = la verticale (Santé/Enseignement/Tourisme), puis bande "Faites votre diagnostic offert", puis le contexte/héros.
- Pages publiques **Accès** et **Missions** supprimées (routes `_public/acces`, `_public/missions`, composant `MissionPage`).
- Tous les liens/boutons publics renvoyés vers le diagnostic offert (`/diagnostic`) ou `/tarifs` ; page tarifs CTA vers diagnostic.

### Tests
- `test-diagnostic360` : OK • `test-diagnostic360:packs` (SSR des 3 packs, 40 questions, 4 volets, garde-fous) : OK • tests métier existants : OK • typecheck : OK • build : OK (2.1 s)
- `test-offers-v11` : OK (aligné sur D3)

### Architecture backend — première tranche livrée
- **`backend/server.mjs`** (nouveau) : serveur MVP (Node http, store JSON en dev, à remplacer par Postgres) avec isolation tenant et rôles : admin (tout), concierge (portefeuille attribué), commercial (Express uniquement, périmètre CRM), client même organisation. Consentements append-only (`backend/data/db.json` + `audit.jsonl`), traces audit de lecture/écriture, validation des entrées.
- **`scripts/test-backend.mjs` + `npm run test:backend`** : OK — isolation tenants, rôles, consentement journalisé.
- Le cadre d'évolution reste dans `BACKEND-MVP-V23.md` (Postgres, Auth réelle, rétention 90 j).

## 3. Écarts au brief restants (prochaine tranche)

1. **Remplacer le store JSON par Postgres** et brancher une auth réelle (cookies signés) — le schéma de base est défini dans `BACKEND-MVP-V23.md`.
2. **Parcours CRM commercial → passation concierge → J+90** : contractualiser (sections concierge/entreprises existent mais Lifecycle non relié serveur).
3. **Espace Expert** : à circonscrire (permissions serveur P0 avant activation).
4. **Rétention/suppression** : à formaliser juridiquement puis implémenter.
5. **Revue visuelle** des parcours critiques (client, admin, concierge) et accessibilité.
