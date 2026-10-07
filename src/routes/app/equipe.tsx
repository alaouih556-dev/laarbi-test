import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { BriefcaseBusiness, Mail, Plus, ShieldCheck, Trash2, UserRound, UsersRound } from 'lucide-react'
import { PageHeader } from '@/components/layouts'
import { Badge, Button, Field, Input, Modal, Select, Checkbox } from '@/components/ui'
import { useDemo, type ClientTeamMember } from '@/store/store'

export const Route = createFileRoute('/app/equipe')({ component: TeamPage })

const accessOptions = [
  { id: 'actions', label: 'Plan d’action', description: 'Consulter les actions et leurs échéances.' },
  { id: 'missions', label: 'Projets & missions', description: 'Suivre les étapes et livrables.' },
  { id: 'documents', label: 'Documents', description: 'Accéder aux pièces utiles au travail.' },
  { id: 'messages', label: 'Messages', description: 'Échanger avec ALLNEEDS.' },
  { id: 'results', label: 'Résultats', description: 'Voir les indicateurs de pilotage.' },
  { id: 'team', label: 'Gestion de l’équipe', description: 'Inviter et gérer les accès des autres salariés.' },
]

function TeamPage() {
  const { state, orgId, user, dispatch } = useDemo()
  const org = state.orgs.find((item) => item.id === orgId)
  const owners = Array.from(new Set([
    ...state.missions.filter((mission) => mission.orgId === orgId && mission.status !== 'terminee').map((mission) => mission.owner),
    ...state.needs.filter((need) => need.orgId === orgId && !['clos', 'signe'].includes(need.status)).map((need) => need.assignedTo),
  ])).filter(Boolean)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [role, setRole] = useState<ClientTeamMember['role']>('collaborateur')
  const [access, setAccess] = useState<string[]>(['actions', 'missions', 'documents', 'messages'])
  const members = useMemo(() => state.teamMembers.filter((member) => member.orgId === orgId), [state.teamMembers, orgId])

  const selectRole = (nextRole: ClientTeamMember['role']) => {
    setRole(nextRole)
    setAccess(nextRole === 'manager' ? accessOptions.map((option) => option.id) : ['actions', 'missions', 'documents', 'messages'])
  }

  const submit = () => {
    if (!name.trim() || !email.trim() || !email.includes('@')) return
    dispatch({ type: 'TEAM_MEMBER_CREATE', member: { orgId, name: name.trim(), email: email.trim(), jobTitle: jobTitle.trim(), role, access } })
    setOpen(false)
    setName(''); setEmail(''); setJobTitle(''); setRole('collaborateur'); setAccess(['actions', 'missions', 'documents', 'messages'])
  }

  return <>
    <PageHeader eyebrow="Équipe" title="Donnez à chacun l’accès utile à son rôle." description="Vous restez maître des accès : choisissez qui peut consulter les actions, missions, documents et résultats de votre établissement." actions={<Button onClick={() => setOpen(true)}><Plus size={16}/> Ajouter un salarié</Button>} />
    <section className="team-access-intro"><div className="team-access-mark"><ShieldCheck size={21}/></div><div><strong>Le dirigeant garde la maîtrise</strong><p>Chaque salarié reçoit uniquement les rubriques sélectionnées. Vous pourrez modifier ou retirer son accès à tout moment.</p></div><span>{members.length} accès ajouté{members.length > 1 ? 's' : ''}</span></section>
    <div className="team-access-layout">
      <section className="team-access-list"><div className="team-section-heading"><div><h2>Personnes de l’établissement</h2><p>Accès de connexion et responsabilités de suivi.</p></div></div>
        <article className="team-access-person is-director"><span className="team-person-avatar">{user.initials}</span><div className="team-person-main"><strong>{user.name}</strong><span>{user.email}</span><small>{org?.contactRole ?? 'Dirigeant'} · accès propriétaire</small></div><Badge tone="brand">Dirigeant</Badge></article>
        {members.map((member) => <article className="team-access-person" key={member.id}><span className="team-person-avatar is-member"><UserRound size={19}/></span><div className="team-person-main"><strong>{member.name}</strong><span>{member.email}</span><small>{member.jobTitle || 'Salarié'} · {member.access.length} rubrique{member.access.length > 1 ? 's' : ''}</small><div className="team-member-access">{member.access.map((key) => <span key={key}>{accessOptions.find((item) => item.id === key)?.label ?? key}</span>)}</div></div><div className="team-person-controls"><Badge tone={member.status === 'actif' ? 'success' : 'warning'}>{member.status === 'actif' ? 'Actif' : 'Invitation en attente'}</Badge><Select aria-label={`Rôle de ${member.name}`} value={member.role} onChange={(event) => dispatch({ type: 'TEAM_MEMBER_ROLE_SET', id: member.id, role: event.target.value as ClientTeamMember['role'] })}><option value="collaborateur">Collaborateur</option><option value="manager">Responsable</option></Select><Button variant="ghost" size="sm" aria-label={`Retirer l’accès de ${member.name}`} onClick={() => dispatch({ type: 'TEAM_MEMBER_REVOKE', id: member.id })}><Trash2 size={15}/> Retirer</Button></div></article>)}
        {!members.length ? <div className="team-access-empty"><UsersRound size={22}/><div><strong>Aucun salarié n’a encore accès à cet espace.</strong><p>Ajoutez une première personne pour partager le suivi sans partager votre compte dirigeant.</p></div><Button size="sm" variant="outline" onClick={() => setOpen(true)}><Plus size={15}/> Ajouter un salarié</Button></div> : null}
      </section>
      <aside className="team-access-side"><h2>Choisissez le bon niveau</h2><article><span className="role-icon"><UserRound size={19}/></span><div><strong>Dirigeant</strong><p>Vision globale, décisions et maîtrise des accès de l’établissement.</p></div></article><article><span className="role-icon secondary"><BriefcaseBusiness size={19}/></span><div><strong>Responsable</strong><p>Suit les actions, missions et indicateurs de son périmètre.</p></div></article><article><span className="role-icon secondary"><UsersRound size={19}/></span><div><strong>Collaborateur</strong><p>Accède aux tâches et documents nécessaires à son travail.</p></div></article><div className="team-access-note"><Mail size={16}/><p><strong>Démo d’accès</strong><br/>Les invitations sont enregistrées sur cet appareil. L’envoi d’e-mail et la connexion personnelle seront actifs lorsque les comptes salariés seront reliés au service d’authentification.</p></div></aside>
    </div>
    {owners.length ? <details className="team-existing-owners"><summary>Responsables déjà affectés à des dossiers <span>{owners.length}</span></summary><div>{owners.map((owner) => <span key={owner}><BriefcaseBusiness size={15}/>{owner}</span>)}</div></details> : null}
    <Modal open={open} onClose={() => setOpen(false)} title="Ajouter un salarié" description="Préparez son accès et choisissez les rubriques qu’il pourra consulter." size="lg"><div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2"><Field label="Nom et prénom" required><Input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex. Sara El Mansouri"/></Field><Field label="Adresse e-mail professionnelle" required><Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="sara@entreprise.ma"/></Field></div>
      <div className="grid gap-4 sm:grid-cols-2"><Field label="Fonction"><Input value={jobTitle} onChange={(event) => setJobTitle(event.target.value)} placeholder="Ex. Responsable administratif"/></Field><Field label="Rôle dans ALLNEEDS"><Select value={role} onChange={(event) => selectRole(event.target.value as ClientTeamMember['role'])}><option value="collaborateur">Collaborateur · tâches et documents</option><option value="manager">Responsable · suivi et gestion d’équipe</option></Select></Field></div>
      <fieldset className="space-y-3"><legend className="mb-1 text-sm font-semibold text-ink-900">Rubriques autorisées</legend>{accessOptions.map((option) => <Checkbox key={option.id} label={option.label} description={option.description} checked={access.includes(option.id)} onChange={(event) => setAccess((current) => event.target.checked ? [...new Set([...current, option.id])] : current.filter((item) => item !== option.id))}/>)}</fieldset>
      <p className="rounded-xl bg-ink-50 p-3 text-xs leading-relaxed text-ink-600">Cette action prépare une invitation dans la démonstration. Aucun e-mail ne sera envoyé depuis cette version.</p>
      <div className="flex justify-end gap-2 border-t border-ink-100 pt-4"><Button variant="ghost" onClick={() => setOpen(false)}>Annuler</Button><Button onClick={submit} disabled={!name.trim() || !email.includes('@')}>Enregistrer l’accès</Button></div>
    </div></Modal>
  </>
}
