import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Inbox, LockKeyhole, Plus } from 'lucide-react'
import { useDemo, makeNeed, tierLimit } from '@/store/store'
import { useAuth } from '@/features/auth/AuthContext'
import { useOperationalNeeds } from '@/features/operations/useOperationalNeeds'
import { PageHeader } from '@/components/layouts'
import {
  Badge,
  Alert,
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  Modal,
  Select,
  Tabs,
  Textarea,
} from '@/components/ui'
import { NEED_FLOW, NEED_STATUS, URGENCY } from '@/lib/status'
import { longDate, money, relative } from '@/lib/format'
import { byId } from '@/lib/utils'
import type { Need, NeedStatus } from '@/types'

export const Route = createFileRoute('/app/besoins/')({
  component: BesoinsPage,
  head: () => ({ meta: [{ title: 'Mes besoins — ALLNEEDS' }] }),
})

const CATEGORIES = [
  { value: 'logiciel', label: 'Logiciel de gestion, site ou espace en ligne' },
  { value: 'creation', label: 'Logo, identité visuelle, photo, vidéo, impression' },
  { value: 'rh', label: 'Recrutement, paie, formation, organisation' },
  { value: 'logistique', label: 'Transport, restauration, assurance, fournitures' },
  { value: 'energie', label: 'Énergie, fluides, télécom' },
  { value: 'maintenance', label: 'Maintenance informatique, réseaux, équipements' },
]

function categoryLabel(value: string) {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value
}

export function BesoinsPage() {
  const { state, dispatch, orgId } = useDemo()
  const auth = useAuth()
  const operations = useOperationalNeeds(state.needs.filter((need) => need.orgId === orgId))
  const [filter, setFilter] = useState<'actifs' | 'tous' | 'clos'>('actifs')
  const [open, setOpen] = useState(false)
  const [limitOpen, setLimitOpen] = useState(false)
  const [form, setForm] = useState({
    title: '',
    category: 'logiciel',
    description: '',
    location: '',
    budgetMax: '',
    urgency: 'normale' as Need['urgency'],
    deadline: '',
  })

  const needs = operations.needs.filter((n) => n.orgId === orgId)
  const hasAccessSubscription = state.registrationProfile === null || Boolean(state.registrationProfile.tier)
  const annualLimit = tierLimit(state.subscription.tier, 'needsPerYear')
  const concurrentLimit = tierLimit(state.subscription.tier, 'concurrentNeeds')
  const activeCount = needs.filter((n) => n.status !== 'clos' && n.status !== 'signe').length
  const annualUsed = state.registrationProfile ? needs.length : state.subscription.consumed
  const blockedReason = operations.live ? null : !hasAccessSubscription ? 'subscription' : annualUsed >= annualLimit ? 'annual' : activeCount >= concurrentLimit ? 'concurrent' : null
  const openNeedForm = () => blockedReason ? setLimitOpen(true) : setOpen(true)
  const filtered = needs.filter((n) => {
    if (filter === 'tous') return true
    if (filter === 'clos') return n.status === 'clos' || n.status === 'signe'
    return n.status !== 'clos' && n.status !== 'signe'
  })

  async function submit() {
    if (!form.title.trim()) return
    const input = {
        orgId,
        title: form.title,
        category: form.category as Need['category'],
        categoryLabel: categoryLabel(form.category),
        description: form.description,
        location: form.location || 'Casablanca',
        budgetMax: form.budgetMax ? Number(form.budgetMax) : null,
        urgency: form.urgency,
        deadline: form.deadline || null,
      }
    try {
      if (auth.status === 'authenticated') await operations.create(input)
      else dispatch({ type: 'NEED_CREATE', need: makeNeed(input) })
      setOpen(false)
      setForm({ title: '', category: 'logiciel', description: '', location: '', budgetMax: '', urgency: 'normale', deadline: '' })
    } catch (cause) {
      dispatch({ type: 'TOAST_ADD', toast: { title: 'Demande non enregistrée', description: cause instanceof Error ? cause.message : 'Impossible d’enregistrer ce besoin.', tone: 'warning' } })
    }
  }

  const counts = {
    actifs: needs.filter((n) => n.status !== 'clos' && n.status !== 'signe').length,
    clos: needs.filter((n) => n.status === 'clos' || n.status === 'signe').length,
    tous: needs.length,
  }

  return (
    <>
      <PageHeader
        eyebrow="Espace client"
        title="Mes besoins"
        description="Un besoin = une catégorie de prestation. Les besoins non consommés restent dans votre pool ACCÈS."
        actions={
          <Button size="sm" onClick={openNeedForm}>
            <Plus className="h-3.5 w-3.5" />
            Déposer un besoin
          </Button>
        }
      />

      {operations.live ? <Alert tone="info" className="mb-5" title="Besoins enregistrés sur le serveur">Ici, les demandes déposées et leur suivi sont persistants. Les quotas, prestataires, devis et missions ne sont pas encore synchronisés.</Alert> : null}
      {operations.error ? <Alert tone="danger" className="mb-5" title="Chargement des demandes impossible">{operations.error}</Alert> : null}

      <div className="mb-5 rounded-xl border border-ink-100 bg-white p-4 text-sm text-ink-600">
        {operations.live ? <>Suivi serveur · {needs.length} demande(s) enregistrée(s). Les limites d’abonnement ne sont pas encore contrôlées côté serveur.</> : hasAccessSubscription ? <>Formule <strong>{state.subscription.tier}</strong> · {annualUsed}/{annualLimit} besoins utilisés cette année · {activeCount}/{concurrentLimit} traités en même temps.</> : <>Aucun abonnement ALLNEEDS ACCÈS actif. Vous pouvez consulter votre espace, mais un abonnement est nécessaire pour déposer un besoin.</>}
      </div>

      <div className="mb-5">
        <Tabs
          value={filter}
          onChange={(v) => setFilter(v as typeof filter)}
          tabs={[
            { value: 'actifs', label: 'En cours', count: counts.actifs },
            { value: 'clos', label: 'Clos et signés', count: counts.clos },
            { value: 'tous', label: 'Tous', count: counts.tous },
          ]}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Inbox className="h-5 w-5" />}
          title="Aucun besoin dans cette vue"
          description="Déposez un besoin : nous recherchons, vérifions les prestataires et comparons les devis."
          action={<Button size="sm" onClick={openNeedForm}>Déposer un besoin</Button>}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((need) => {
            const status = NEED_STATUS[need.status]
            const providers = operations.live ? [] : need.candidateIds.map((id) => byId(state.providers, id)).filter(Boolean)
            const quotes = operations.live ? [] : need.quoteIds.map((id) => byId(state.quotes, id)).filter(Boolean)
            const step = Math.max(0, NEED_FLOW.indexOf(need.status as NeedStatus))
            return (
              <Card key={need.id} className="flex flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink-950">{need.title}</p>
                    <p className="mt-1 text-xs text-ink-500">{need.categoryLabel}</p>
                  </div>
                  <Badge tone={status.tone}>{status.label}</Badge>
                </div>

                <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-ink-600">{need.description}</p>

                <div className="mt-5 grid grid-cols-3 gap-3 border-t border-ink-100 pt-4 text-xs">
                  <div>
                    <p className="text-ink-400">Prestataires</p>
                    <p className="mt-0.5 font-semibold text-ink-900">{providers.length}</p>
                  </div>
                  <div>
                    <p className="text-ink-400">Devis</p>
                    <p className="mt-0.5 font-semibold text-ink-900">{quotes.length}</p>
                  </div>
                  <div>
                    <p className="text-ink-400">Budget</p>
                    <p className="mt-0.5 font-semibold text-ink-900">
                      {need.budgetMax ? money(need.budgetMax) : 'à définir'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-ink-500">
                  <span>
                    Déposé {relative(need.submittedAt)}
                    {need.deadline ? ` · échéance ${longDate(need.deadline)}` : ''}
                  </span>
                  <Badge tone={URGENCY[need.urgency].tone}>{URGENCY[need.urgency].label}</Badge>
                </div>

                <Link to="/app/besoins/$id" params={{ id: need.id }} className="mt-5">
                  <Button size="sm" fullWidth variant="outline">
                    Suivre ce besoin
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </Card>
            )
          })}
        </div>
      )}

      <Modal open={limitOpen} onClose={() => setLimitOpen(false)} title={blockedReason === 'subscription' ? 'ALLNEEDS ACCÈS requis' : 'Limite de votre formule atteinte'} description={blockedReason === 'annual' ? `Votre formule ${state.subscription.tier} prévoit ${annualLimit} besoins par an.` : blockedReason === 'concurrent' ? `Votre formule ${state.subscription.tier} permet ${concurrentLimit} besoins traités en même temps.` : 'Choisissez CONNECT, PLUS ou PRIORITÉ selon vos besoins.'}>
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl bg-ink-50 p-4"><LockKeyhole className="mt-0.5 h-5 w-5 text-brand-700"/><p className="text-sm leading-relaxed text-ink-600">Les quotas appliqués sont ceux de la fiche ALLNEEDS ACCÈS : CONNECT 6 besoins/an et 2 simultanés, PLUS 15 et 3, PRIORITÉ 30 et 5.</p></div>
          <div className="flex flex-wrap justify-end gap-2"><Button variant="ghost" onClick={()=>setLimitOpen(false)}>Fermer</Button><Link to="/app/abonnement"><Button>Voir les abonnements</Button></Link></div>
        </div>
      </Modal>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Déposer un besoin"
        description="Ce besoin consomme 1 unité de votre pool ACCÈS. Une demande multi-prestations compte pour 2."
      >
        <div className="space-y-5">
          <Field label="Intitulé" required>
            <Input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Logiciel de gestion avec espace parents"
            />
          </Field>
          <Field label="Catégorie de prestation" required>
            <Select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Description" required>
            <Textarea
              rows={5}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Contexte, contraintes, échéances…"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Ville">
              <Input
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="Casablanca"
              />
            </Field>
            <Field label="Budget max (DH)">
              <Input
                type="number"
                value={form.budgetMax}
                onChange={(e) => setForm((f) => ({ ...f, budgetMax: e.target.value }))}
                placeholder="20000"
              />
            </Field>
            <Field label="Urgence">
              <Select
                value={form.urgency}
                onChange={(e) => setForm((f) => ({ ...f, urgency: e.target.value as Need['urgency'] }))}
              >
                <option value="faible">Faible</option>
                <option value="normale">Normale</option>
                <option value="haute">Haute</option>
              </Select>
            </Field>
          </div>
          <Field label="Échéance souhaitée">
            <Input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
            />
          </Field>

          <div className="flex justify-end gap-3 border-t border-ink-100 pt-5">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Annuler
            </Button>
          <Button onClick={() => void submit()} disabled={operations.loading || !form.description.trim()}>Envoyer la demande</Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
