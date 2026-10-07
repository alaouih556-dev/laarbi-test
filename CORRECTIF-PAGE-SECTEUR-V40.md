# Correctif page secteur — V40

La page Enseignement appelait le composant `Link` pour son bouton de diagnostic sans importer ce composant. Le navigateur levait une erreur JavaScript au rendu et affichait l’écran générique « Something went wrong ».

Le composant `Link` est maintenant importé depuis `@tanstack/react-router` dans `src/components/SectorPage.tsx`. Les autres pages de secteur utilisent ce même composant et bénéficient du correctif.

État : correctif appliqué au code source. Le site `laarbi-test.vercel.app` n’est pas accessible dans le périmètre Vercel connecté actuellement ; le déploiement du correctif sur cette URL reste à faire lorsque le projet Vercel correspondant sera accessible.
