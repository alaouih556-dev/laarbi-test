import { createServer } from 'vite'
import React from 'react'
import { renderToString } from 'react-dom/server'
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
try {
  const { DemoStoreProvider } = await server.ssrLoadModule('/src/store/store.tsx')
  const { Diagnostic } = await server.ssrLoadModule('/src/features/saas/Diagnostic.tsx')
  const wrap = (el) => renderToString(React.createElement(DemoStoreProvider, null, el))
  const { PACKS } = await server.ssrLoadModule('/src/features/health360/packs.ts')
  for (const [key, pack] of Object.entries(PACKS)) {
    for (const expect of ['GRILLE DE DIAGNOSTIC 360°', 'Cadre lu et accepté', 'Deux formats, une même grille']) {
      // @ts-ignore
      const { Diagnostic360 } = await server.ssrLoadModule('/src/features/health360/Diagnostic360.tsx')
      const html = wrap(React.createElement(Diagnostic360, { sector: key }))
      if (!html.includes(expect)) throw new Error(`${key}: manquant ${expect}`)
      if (!html.includes(pack.labelUpper)) throw new Error(`${key}: label absent`)
      if (pack.questions.length !== 40 || pack.volets.length !== 4) throw new Error(`${key}: pack incomplet`)
      if (pack.documents.length < 3 || pack.gardeFous.length < 3 || pack.chargesPostes.length < 4) throw new Error(`${key}: sections tranchees incomplètes`)
    }
    console.log('OK', key, pack.questions.length, 'questions,', pack.volets.length, 'volets, garde-fous:', pack.gardeFous.length)
  }
  console.log('OK — Diagnostic360 packs rendus (Santé / Enseignement / Tourisme), questions et volets alignés v5.1')
} finally { await server.close() }
