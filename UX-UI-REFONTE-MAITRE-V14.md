# ALLNEEDS — Refonte UX/UI maître V14

## Objectif
Refonte de présentation uniquement, à partir de V13. Aucun parcours, route, formulaire, CTA métier, questionnaire, rôle, logique de quota ou règle commerciale n'a été supprimé ni remplacé.

Parcours mental renforcé : **BESOIN → ALLNEEDS → SOLUTION → ACTION**.

## Audit « Avant »
Références visuelles V13 incluses dans :
- `public/references/avant/navigation-v13.png`
- `public/references/avant/hero-v13.png`
- `public/references/avant/secteurs-v13.png`
- `public/references/avant/parcours-v13.png`
- `public/references/avant/home-v13-full.png`

Ces images servent uniquement de référence de design avant refonte.

## Refonte de la partie publique
- Hero recentré sur l'intention utilisateur : « dites-nous ce qui bloque ».
- CTA principal rendu immédiatement identifiable : « Commencer par mon besoin ».
- Choix secteur conservé, mais formulé comme un choix de contexte après le besoin.
- Concept multi-besoins rendu visible sans créer de nouveau quota ou nouvelle offre.
- Parcours Comprendre / Structurer / Agir conservé et hiérarchisé.
- Progressive disclosure sur le détail du diagnostic : les 28 questions secteur restent présentes mais ne saturent plus l'écran par défaut.
- Formules, grilles, textes commerciaux et règles V10/V11/V12/V13 conservés.

## Avant-goût des espaces privés
Mockups haute définition inclus dans :
- `public/previews/client-sante.png`
- `public/previews/client-enseignement.png`
- `public/previews/client-tourisme.png`
- `public/previews/concierge.png`
- `public/previews/admin.png`

La home montre Client, Concierge et Administration avec données fictives et sans exposer de fonction sensible. Chaque page secteur montre uniquement l'aperçu client de son secteur.

## Profils
Un seul design system, avec accents légers :
- Client : bleu ALLNEEDS
- Concierge : turquoise
- Administrateur : violet

La structure d'accès existante est inchangée :
- client → son organisation / son secteur ;
- concierge → entreprises attribuées / apportées uniquement ;
- admin → vue globale.

## Principes ChanTan appliqués sans copie
- action principale visible immédiatement ;
- interface centrée intention ;
- cartes fortement hiérarchisées ;
- progressive disclosure ;
- charge cognitive réduite ;
- statuts/actions visibles ;
- feedback conservé dans les workflows existants.

## Ce qui n'a volontairement pas été inventé
- Aucun nouveau partenaire, aucune nouvelle offre, aucun nouveau quota.
- Aucun nouveau workflow métier.
- Aucun prix ou avantage ajouté.
- Le projet `ALLNEEDS-SANTE` est conservé tel quel côté logique et fonctionnalités ; V14 travaille surtout la plateforme principale et ses aperçus publics.

## Validation
- Parse syntaxique de l'ensemble de `src/**/*.ts(x)` : 0 erreur de parsing.
- `scripts/test-questionnaires.mjs` : OK.
- `scripts/test-access-v9.mjs` : OK.
- Les anciens tests V10/V11 se chevauchent sur la visibilité publique des prix : V11 masque les prix avant diagnostic, ce qui rend l'assertion V10 « old-price strike public » obsolète dans V13+. La règle commerciale actuelle n'a pas été modifiée par V14.
