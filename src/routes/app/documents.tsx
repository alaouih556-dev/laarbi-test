import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { FileCheck2, FileText, FolderOpen, Upload } from 'lucide-react'
import { useDemo } from '@/store/store'
import { PageHeader } from '@/components/layouts'
import { Alert, Badge, Button, Card, CardHeader, CardBody, Tabs } from '@/components/ui'
import { DOC_STATUS } from '@/lib/status'
import { relative } from '@/lib/format'
import type { DocumentItem } from '@/types'

export const Route = createFileRoute('/app/documents')({
  component: DocumentsPage,
  head: () => ({ meta: [{ title: 'Mes documents — ALLNEEDS' }] }),
})

const KIND_LABEL: Record<DocumentItem['kind'], string> = {
  contrat: 'Contrat',
  devis: 'Devis',
  facture: 'Facture',
  autorisation: 'Autorisation',
  livrable: 'Livrable',
  autre: 'Autre',
}

export function DocumentsPage() {
  const { state, dispatch, orgId } = useDemo()
  const [filter, setFilter] = useState('tous')

  const docs = state.documents
    .filter((d) => d.orgId === orgId)
    .filter((d) => (filter === 'tous' ? true : d.status === filter))

  const all = state.documents.filter((d) => d.orgId === orgId)
  const pending = all.filter((d) => d.status === 'demande')

  return (
    <>
      <PageHeader
        eyebrow="Dossier"
        title="Mes documents"
        description="Contrats, devis signés, factures, autorisations parentales ou réglementaires. Tout est centralisé et tracé."
      />

      {pending.length > 0 ? (
        <Alert tone="warning" className="mb-6" title={`${pending.length} document(s) en attente de votre envoi`}>
          Un document manquant peut bloquer une mission. Envoyez-le depuis cette page : il est transmis à l’équipe en
          lecture seule.
        </Alert>
      ) : null}

      <div className="mb-5">
        <Tabs
          value={filter}
          onChange={setFilter}
          tabs={[
            { value: 'tous', label: 'Tous', count: all.length },
            { value: 'demande', label: 'À fournir', count: all.filter((d) => d.status === 'demande').length },
            { value: 'recu', label: 'Reçus', count: all.filter((d) => d.status === 'recu').length },
            { value: 'valide', label: 'Validés', count: all.filter((d) => d.status === 'valide').length },
          ]}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader title="Mon dossier" description={`${all.length} documents · mis à jour ${relative(state.now)}`} />
          <div className="divide-y divide-ink-50">
            {docs.length === 0 ? (
              <CardBody>
                <p className="text-sm text-ink-500">Aucun document dans cette vue.</p>
              </CardBody>
            ) : null}
            {docs.map((d) => {
              const s = DOC_STATUS[d.status]
              return (
                <div key={d.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="mt-0.5 rounded-lg bg-ink-100 p-2 text-ink-500">
                      <FileText className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink-950">{d.name}</p>
                      <p className="mt-0.5 text-xs text-ink-500">
                        {KIND_LABEL[d.kind]} · {d.sizeLabel} · {relative(d.updatedAt, new Date(state.now).getTime())}
                      </p>
                      {d.comment ? <p className="mt-1 text-xs italic text-ink-500">{d.comment}</p> : null}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {d.required ? <Badge tone="warning">Obligatoire</Badge> : null}
                    <Badge tone={s.tone}>{s.label}</Badge>
                    {d.status === 'demande' ? (
                      <>
                        <Button size="sm" onClick={() => dispatch({ type: 'DOC_SET_STATUS', id: d.id, status: 'recu' })}>
                          <Upload className="h-3.5 w-3.5" />
                          Envoyer
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            dispatch({
                              type: 'DOC_SET_STATUS',
                              id: d.id,
                              status: 'recu',
                              comment: 'Sans objet pour cette année — à reconduire',
                            })
                          }
                        >
                          Sans objet
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="ghost">
                        <FileCheck2 className="h-3.5 w-3.5" />
                        Consulter
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-brand-700" />
              <p className="text-sm font-semibold text-ink-950">Confiance et confidentialité</p>
            </div>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-ink-600">
              <li>• Vos documents sont accessibles à l’équipe ALLNEEDS assignée à votre établissement.</li>
              <li>• Aucune donnée n’est revendue, ni transmise à des tiers hors prestataires concernés.</li>
              <li>• Les autorisations sensibles sont purgées à la fin de la mission, sur demande.</li>
            </ul>
          </Card>

          <Card className="p-5">
            <p className="text-sm font-semibold text-ink-950">Ce que nous demandons</p>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-ink-600">
              <li>• Établissement : statuts ou attestation d’existence, registre administratif.</li>
              <li>• Mineurs : autorisation parentale écrite et attestations de scolarité à jour.</li>
              <li>• Prestataires : attestation d’assurance, RIB ou coordonnées bancaires vérifiées.</li>
            </ul>
          </Card>
        </div>
      </div>
    </>
  )
}
