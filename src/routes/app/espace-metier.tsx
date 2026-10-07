import { createFileRoute } from '@tanstack/react-router'
import { ExternalLink, HeartPulse, LockKeyhole, ShieldCheck } from 'lucide-react'
import { orgHasSaasAccess, useDemo } from '@/store/store'

export const Route = createFileRoute('/app/espace-metier')({ component: Metier })

function Metier() {
  const { state, orgId } = useDemo()
  const org = state.orgs.find((item) => item.id === orgId)
  const sector = org?.sector ?? 'enseignement'
  const enabled = org ? orgHasSaasAccess(state, org.id, org.sector) : false
  const roles = org ? (state.saasRolesByOrg[org.id] ?? []) : []
  const activatedAt = org ? state.saasActivatedAtByOrg[org.id] : null
  const url = sector === 'sante' ? 'https://allneed-s-sante.vercel.app' : null

  if (!enabled) return (
    <section className="container-page py-10">
      <div className="health-external-card">
        <div className="health-external-icon"><LockKeyhole size={26}/></div>
        <div>
          <span className="eyebrow">ESPACE MÉTIER · ACCÈS CONTRÔLÉ</span>
          <h1>Votre espace métier est encore verrouillé.</h1>
          <p>L’accès est activé par l’administrateur ALLNEEDS pour votre entreprise. Vous pouvez continuer à utiliser le diagnostic, le plan d’action, les projets, les documents et les messages du portail principal.</p>
        </div>
        <div className="health-external-action disabled">En attente d’activation</div>
      </div>
    </section>
  )

  return (
    <section className="container-page py-10">
      <div className="health-external-card">
        <div className="health-external-icon">{sector === 'sante' ? <HeartPulse size={28}/> : <ShieldCheck size={28}/>}</div>
        <div>
          <span className="eyebrow">ESPACE MÉTIER · ACCÈS AUTORISÉ</span>
          <h1>{sector === 'sante' ? 'ALLNEEDS Santé est disponible.' : 'Votre espace métier est activé.'}</h1>
          <p>{sector === 'sante' ? 'Le portail principal conserve votre diagnostic, vos priorités et votre pilotage. La gestion métier Santé reste dans son SaaS séparé.' : 'Votre accès métier a été validé par ALLNEEDS.'}</p>
          {sector === 'sante' ? <p className="mt-2 text-xs text-ink-500">Rôles autorisés : {roles.length ? roles.map((role) => role === 'directeur' ? 'Directeur' : role === 'reception' ? 'Réception' : 'Comptabilité').join(' · ') : 'Aucun rôle sélectionné'}{activatedAt ? ` · Activé le ${new Date(activatedAt).toLocaleDateString('fr-FR')}` : ''}</p> : null}
        </div>
        {url ? <a href={url} target="_blank" rel="noreferrer" className="health-external-action">Accéder à ALLNEEDS Santé <ExternalLink size={16}/></a> : <div className="health-external-action disabled">SaaS métier à configurer</div>}
      </div>
    </section>
  )
}
