import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { Toaster } from '@/components/layouts'
import { AuthProvider } from '@/features/auth/AuthContext'

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
  errorComponent: RouteError,
})

function RootLayout() {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col">
        <Outlet />
        <Toaster />
      </div>
    </AuthProvider>
  )
}

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-display text-7xl text-sand-400">404</p>
      <div>
        <h1 className="display-2">Page introuvable</h1>
        <p className="lede mx-auto mt-3 max-w-md">
          Cette page n’existe pas ou a été déplacée. Reprenons depuis l’accueil.
        </p>
      </div>
      <a
        href="/"
        className="inline-flex h-11 items-center rounded-lg bg-brand-700 px-5 text-sm font-semibold text-white transition hover:bg-brand-800"
      >
        Retour à l’accueil
      </a>
    </div>
  )
}

function RouteError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-50 px-5 py-12">
      <section className="w-full max-w-xl rounded-3xl border border-ink-100 bg-white p-7 shadow-lift sm:p-10">
        <p className="eyebrow">ALLNEEDS · PAGE INTERROMPUE</p>
        <h1 className="display-2 mt-3">Cette page n’a pas pu s’ouvrir.</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-600">Vos autres espaces restent accessibles. Réessayez ou revenez à l’accueil.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className="inline-flex h-11 items-center rounded-full bg-brand-700 px-5 text-sm font-bold text-white hover:bg-brand-800">Réessayer</button>
          <Link to="/" className="inline-flex h-11 items-center rounded-full border border-ink-200 px-5 text-sm font-bold text-ink-800 hover:bg-ink-50">Retour à l’accueil</Link>
        </div>
        {import.meta.env.DEV ? <details className="mt-6 text-xs text-ink-500"><summary className="cursor-pointer font-semibold">Détails techniques</summary><pre className="mt-2 whitespace-pre-wrap break-words">{error.message}</pre></details> : null}
      </section>
    </main>
  )
}
