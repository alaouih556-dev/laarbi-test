import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, CheckCircle2, MessageSquare } from 'lucide-react'
import { SECTOR_LABEL, SECTOR_ORDER } from '@/data/catalog'
import { useDemo } from '@/store/store'
import { Button, Card, Field, Input, Select, Textarea, Alert } from '@/components/ui'
import type { Sector } from '@/types'

export const Route = createFileRoute('/_public/contact')({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: 'Contact — ALLNEEDS' },
      { name: 'description', content: 'Écrivez à ALLNEEDS : réponse sous 24 h ouvrées. Téléphone, WhatsApp et formulaire.' },
    ],
  }),
})

export function ContactPage() {
  const { dispatch } = useDemo()
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({
    name: '',
    org: '',
    email: '',
    phone: '',
    sector: 'enseignement' as Sector,
    subject: 'Question avant de m’engager',
    message: '',
  })

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    dispatch({
      type: 'REQUEST_CREATE',
      request: {
        kind: 'contact',
        name: form.name,
        org: form.org,
        email: form.email,
        phone: form.phone,
        sector: form.sector,
        city: '',
        message: `[${form.subject}] ${form.message}`,
        budget: '',
      },
    })
    setSent(true)
  }

  return (
    <>
      <section className="border-b border-ink-100 bg-[#f8fbff]">
        <div className="container-page py-16 sm:py-20">
          <p className="eyebrow">Parlons de votre situation</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight tracking-[-.04em] sm:text-6xl">Une question avant le premier pas ?</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-ink-600">
            Décrivez votre contexte, votre question ou votre échéance. Nous vous orienterons vers la prochaine étape la plus utile.
          </p>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="p-6 sm:p-8">
            {sent ? (
              <div className="py-6 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-7 w-7" />
                </span>
                <h2 className="display-2 mt-6">Enregistré dans la démonstration</h2>
                <p className="lede mx-auto mt-3 max-w-md">
                  Merci {form.name.split(' ')[0] || 'pour votre message'}. Cette version conserve la saisie dans ce navigateur ; elle ne la transmet pas à l’équipe ALLNEEDS.
                </p>
                <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>
                  Envoyer un autre message
                </Button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <h2 className="font-display text-2xl tracking-tight text-ink-950">Nous écrire</h2>
                <Alert tone="info" title="Formulaire de démonstration">
                  La saisie reste sur cet appareil. Aucun message ni rendez-vous n’est transmis depuis cette version.
                </Alert>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Votre nom" required>
                    <Input value={form.name} onChange={(e) => set('name', e.target.value)} required />
                  </Field>
                  <Field label="Votre établissement">
                    <Input value={form.org} onChange={(e) => set('org', e.target.value)} placeholder="Nom de votre établissement" />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="E-mail" required>
                    <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required />
                  </Field>
                  <Field label="Téléphone">
                    <Input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+212 6 ..." />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Secteur">
                    <Select value={form.sector} onChange={(e) => set('sector', e.target.value as Sector)}>
                      {SECTOR_ORDER.map((sector) => (
                        <option key={sector} value={sector}>
                          {SECTOR_LABEL[sector]}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Objet">
                    <Input value={form.subject} onChange={(e) => set('subject', e.target.value)} />
                  </Field>
                </div>

                <Field label="Message" required>
                  <Textarea
                    rows={6}
                    value={form.message}
                    onChange={(e) => set('message', e.target.value)}
                    placeholder="Votre question, votre contexte, votre échéance…"
                    required
                  />
                </Field>

                <Button type="submit" size="lg">
                  <MessageSquare className="h-4 w-4" />
                  Enregistrer dans la démo
                </Button>
              </form>
            )}
          </Card>

          <aside className="space-y-5">
            <Card className="p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Prendre contact</p>
              <div className="mt-5 rounded-2xl bg-ink-50 p-5">
                <MessageSquare className="h-5 w-5 text-brand-700" />
                <p className="mt-3 text-sm font-semibold text-ink-950">Décrivez votre besoin dans le formulaire.</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">Les coordonnées officielles et les informations légales seront communiquées avant toute souscription.</p>
              </div>
            </Card>

            <Alert tone="info" title="Vous êtes déjà client ?">
              Utilisez la messagerie de votre espace client : la réponse y est rattachée à votre besoin, donc traçable.
            </Alert>

            <Card className="p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Raccourcis</p>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link to="/inscription" className="inline-flex items-center gap-1.5 font-semibold text-brand-700">
                    Réserver le diagnostic
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </li>
                <li>

                </li>
                <li>
                  <Link to="/diagnostic" className="inline-flex items-center gap-1.5 font-semibold text-brand-700">
                    Voir le déroulement du diagnostic
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </li>
                <li>
                  <Link to="/connexion" className="inline-flex items-center gap-1.5 font-semibold text-brand-700">
                    Accéder à mon espace
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </li>
              </ul>
            </Card>
          </aside>
        </div>
      </section>
    </>
  )
}
