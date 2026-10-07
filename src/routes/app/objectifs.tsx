import { useMemo, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Check, CircleHelp, Compass, Gauge, ShieldCheck, UsersRound } from 'lucide-react'
import { PageHeader } from '@/components/layouts'
import { useDemo } from '@/store/store'
import { buildObjectives, buildNextActions, mapNeedToObjective, mapMissionToObjective, type ObjectiveItem } from '@/lib/operational'

export const Route = createFileRoute('/app/objectifs')({ component: ObjectivesPage })

const outcomes: Record<ObjectiveItem['id'], { benefit: string; daily: string; firstStep: string; to: string; icon: typeof Compass }> = {
  ventes: { benefit: 'Faire avancer les demandes et les décisions commerciales.', daily: 'Repérer les demandes qui attendent une réponse ou un choix, au lieu de les retrouver au dernier moment.', firstStep: 'Voir les besoins commerciaux', to: '/app/besoins', icon: Compass },
  visibilite: { benefit: 'Rendre votre offre plus claire et plus facile à choisir.', daily: 'Concentrer vos efforts de communication sur les sujets qui répondent à un besoin concret de vos clients.', firstStep: 'Faire le point sur les actions liées', to: '/app/actions', icon: Gauge },
  organisation: { benefit: 'Mieux répartir le travail et les responsabilités.', daily: 'Savoir qui suit quoi et rendre les prochaines étapes visibles à l’équipe.', firstStep: 'Voir les actions d’organisation', to: '/app/equipe', icon: UsersRound },
  optimisation: { benefit: 'Mieux maîtriser les dépenses, contrats et risques.', daily: 'Faire ressortir les pièces et décisions à vérifier avant qu’elles ne freinent un dossier.', firstStep: 'Vérifier documents et dossiers', to: '/app/documents', icon: ShieldCheck },
}

function ObjectivesPage() {
  const { state, orgId } = useDemo()
  const objectives = buildObjectives(state, orgId)
  const actions = buildNextActions(state, orgId)
  const [selectedId, setSelectedId] = useState<ObjectiveItem['id']>('organisation')
  const selected = objectives.find((objective) => objective.id === selectedId) ?? objectives[0]
  const outcome = outcomes[selected.id]
  const relevantActions = useMemo(() => actions.filter((action) => {
    if (action.id.startsWith('need-')) {
      const need = state.needs.find((item) => action.id === `need-${item.id}`)
      return need ? mapNeedToObjective(need) === selected.id : false
    }
    if (action.id.startsWith('mission-')) {
      const mission = state.missions.find((item) => action.id === `mission-${item.id}`)
      return mission ? mapMissionToObjective(mission).includes(selected.id) : false
    }
    if (action.id === 'docs') return selected.id === 'optimisation'
    if (action.id === 'diagnostic') return selected.id === 'optimisation'
    if (action.id === 'messages') return false
    if (action.id.startsWith('meeting-')) return false
    return false
  }), [actions, state.needs, state.missions, selected.id])
  const Icon = outcome.icon

  return <>
    <PageHeader eyebrow="Choisir votre priorité" title="Quel sujet voulez-vous sortir de votre tête en premier ?" description="Les objectifs servent à donner un cap au travail ALLNEEDS. Choisissez une priorité : vous verrez les dossiers qui y contribuent et par où commencer." />
    <section className="objective-picker" aria-label="Choisir un objectif de dirigeant">
      {objectives.map((objective, index) => {
        const item = outcomes[objective.id]
        const ObjectiveIcon = item.icon
        const active = objective.id === selected.id
        return <button type="button" key={objective.id} className={`objective-choice ${active ? 'is-selected' : ''}`} aria-pressed={active} onClick={() => setSelectedId(objective.id)}>
          <span className="objective-choice-number">0{index + 1}</span><span className="objective-choice-icon"><ObjectiveIcon size={18}/></span><strong>{objective.title}</strong><small>{item.benefit}</small>{active ? <span className="objective-choice-check"><Check size={14}/></span> : null}
        </button>
      })}
    </section>

    <section className="objective-outcome-panel">
      <div className="objective-outcome-top"><span className="objective-outcome-icon"><Icon size={21}/></span><div><small>VOTRE CAP · {selected.title.toUpperCase()}</small><h2>{outcome.benefit}</h2><p>{outcome.daily}</p></div></div>
      <div className="objective-proof-row"><div><small>À suivre dans ce cap</small><strong>{selected.activeNeeds} besoin{selected.activeNeeds > 1 ? 's' : ''} · {selected.activeMissions} mission{selected.activeMissions > 1 ? 's' : ''}</strong><span>Comptés à partir des dossiers de votre établissement.</span></div><Link to={outcome.to as any}>{outcome.firstStep} <ArrowRight size={15}/></Link></div>
    </section>

    <section className="objective-linked-actions"><div className="objective-linked-heading"><div><small>LIEN AVEC LE QUOTIDIEN</small><h2>{relevantActions.length ? 'Les prochaines étapes liées à ce cap' : 'Aucune action ouverte dans ce cap pour le moment'}</h2></div><span>{relevantActions.length} action{relevantActions.length > 1 ? 's' : ''}</span></div>
      {relevantActions.length ? <ol>{relevantActions.slice(0, 3).map((action, index) => <li key={action.id}><span className="objective-action-rank">{index + 1}</span><div><strong>{action.title}</strong><p>{action.why}</p></div><Link to={action.to as any} aria-label={`Ouvrir : ${action.title}`}><ArrowRight size={17}/></Link></li>)}</ol> : <div className="objective-no-action"><div><strong>Aucun dossier actif n’est directement associé à ce cap.</strong><p>Vous pouvez ouvrir la rubrique correspondante pour vérifier la situation ou créer un premier besoin.</p></div><Link to={outcome.to as any}>{outcome.firstStep} <ArrowRight size={15}/></Link></div>}
    </section>

    <details className="objective-explainer"><summary><CircleHelp size={16}/> À quoi sert cette rubrique ?</summary><div><p>Elle vous aide à choisir ce qui mérite l’attention de l’entreprise, puis à retrouver les besoins et missions concernés. Elle ne crée pas de tâches et ne promet pas un résultat automatique : le diagnostic et vos décisions définissent les actions à mener.</p><Link to="/app/actions">Voir le plan d’action complet <ArrowRight size={14}/></Link></div></details>
  </>
}
