export type Industry = 'sante' | 'enseignement' | 'tourisme'
export type Row = { id: string; [key: string]: string }
export type Field = { key: string; label: string; type?: 'number' | 'date' | 'time' | 'email'; options?: string[]; required?: boolean }
export type Module = { id: string; title: string; description: string; fields: Field[] }
const f = (key: string, label: string, type?: Field['type'], options?: string[]): Field => ({ key, label, type, options, required: true })
const contact = [f('name','Nom'), f('phone','Téléphone')]
const payment = [f('name','Référence / client'),f('total','Montant dû (MAD)','number'),f('paid','Montant reçu (MAD)','number'),f('date','Échéance','date'),f('method','Mode',undefined,['Espèces','Virement','Carte','Chèque'])]
const planning = [f('name','Intitulé'),f('resource','Intervenant / ressource'),f('date','Date','date'),f('start','Début','time'),f('end','Fin','time')]
const documents = [f('name','Nom du document'),f('owner','Dossier associé'),f('category','Type'),f('date','Date','date'),f('status','Statut',undefined,['À recevoir','Reçu','Archivé'])]
export const titles: Record<Industry,string> = { sante:'Santé', enseignement:'Éducation', tourisme:'Tourisme' }
export const modules: Record<Industry,Module[]> = {
 sante:[
 {id:'patients',title:'Patients & dossiers',description:'Fiches fictives et suivi administratif.',fields:[...contact,f('reference','Référence dossier'),f('status','Statut',undefined,['Actif','Archivé'])]},
 {id:'rdv',title:'Rendez-vous',description:'Planning par praticien, avec contrôle des chevauchements.',fields:planning},
 {id:'visites',title:'Suivi des visites',description:'Historique administratif des visites, sans conseil médical.',fields:[f('name','Patient / référence'),f('date','Date','date'),f('practitioner','Praticien'),f('status','Suivi',undefined,['Prévu','Réalisé','À recontacter']),f('note','Note administrative')]},
 {id:'documents',title:'Archives',description:'Index des documents. Aucun fichier médical réel à déposer dans la démo.',fields:documents},
 {id:'paiements',title:'Factures & paiements',description:'Montants, règlements partiels et restes à payer.',fields:payment}],
 enseignement:[
 {id:'inscriptions',title:'Inscriptions',description:'Demandes, validation et affectation à un groupe.',fields:[...contact,f('guardian','Responsable légal'),f('group','Groupe / classe'),f('status','Statut',undefined,['Demande','Validée','Liste d’attente','Annulée'])]},
 {id:'groupes',title:'Classes & enseignants',description:'Effectifs, capacités et référents.',fields:[f('name','Classe / groupe'),f('teacher','Enseignant'),f('capacity','Capacité','number')]},
 {id:'planning',title:'Emploi du temps',description:'Séances, salles et intervenants.',fields:planning},
 {id:'presences',title:'Présences',description:'Suivi par élève et date.',fields:[f('name','Élève'),f('group','Groupe'),f('date','Date','date'),f('status','Présence',undefined,['Présent','Absent','Retard','Absence justifiée'])]},
 {id:'documents',title:'Documents',description:'Index des pièces d’inscription et attestations.',fields:documents},
 {id:'paiements',title:'Scolarité & échéances',description:'Frais, règlements et soldes.',fields:payment}],
 tourisme:[
 {id:'clients',title:'Clients & voyageurs',description:'Coordonnées fictives et préférences.',fields:[...contact,f('email','E-mail','email')]},
 {id:'hebergements',title:'Hébergements',description:'Unités, capacité et prix par nuit.',fields:[f('name','Chambre / unité'),f('capacity','Capacité','number'),f('price','Prix / nuit (MAD)','number')]},
 {id:'reservations',title:'Réservations séjour',description:'Dates exclusives de départ, capacité et absence de double réservation.',fields:[f('name','Client'),f('resource','Unité (nom exact)'),f('date','Arrivée','date'),f('endDate','Départ','date'),f('people','Voyageurs','number'),f('status','Statut',undefined,['Confirmée','Option','Annulée'])]},
 {id:'activites',title:'Activités',description:'Excursions, ateliers, sorties et guides.',fields:[f('name','Activité'),f('resource','Guide / lieu'),f('date','Date','date'),f('start','Début','time'),f('end','Fin','time'),f('capacity','Places','number'),f('price','Prix / personne (MAD)','number')]},
 {id:'participants',title:'Réservations activités',description:'Inscription et contrôle des places restantes.',fields:[f('name','Client'),f('activity','Activité (nom exact)'),f('people','Nombre de places','number'),f('status','Statut',undefined,['Confirmée','Annulée'])]},
 {id:'tables',title:'Tables & salle',description:'Organisation de la restauration.',fields:[f('name','Table'),f('capacity','Couverts','number'),f('zone','Zone')]},
 {id:'tables-rdv',title:'Réservations restaurant',description:'Créneaux, tables et couverts.',fields:[...planning,f('people','Couverts','number')]},
 {id:'fournisseurs',title:'Fournisseurs',description:'Achats et contacts de la restauration.',fields:[...contact,f('category','Produits / catégorie')]},
 {id:'paiements',title:'Factures & encaissements',description:'Séjours, activités et restauration.',fields:payment}]
}
export type Recipe = { id:string; name:string; price:number; items:{ingredient:string; quantity:number}[] }
export type Ingredient = { id:string; name:string; unit:string; stock:number; threshold:number; cost:number }
export type Sale = { id:string; date:string; recipe:string; quantity:number; total:number; cost:number }
export type Workspace = { rows:Record<string,Row[]>; ingredients:Ingredient[]; recipes:Recipe[]; sales:Sale[] }
export function seed(industry:Industry):Workspace {
 const rows:Record<string,Row[]> = {}
 modules[industry].forEach(m=>{rows[m.id]=[]})
 rows.paiements=[{id:'invoice-demo',name:'Facture de démonstration',total:'1200',paid:'400',date:'2026-10-15',method:'Virement'}]
 if(industry==='sante') rows.patients=[{id:'p1',name:'Patient Démo',phone:'0000000000',reference:'PAT-001',status:'Actif'}]
 if(industry==='enseignement') rows.groupes=[{id:'g1',name:'Groupe A',teacher:'Enseignant Démo',capacity:'25'}]
 if(industry==='tourisme') {
 rows.hebergements=[{id:'h1',name:'Chambre 101',capacity:'2',price:'650'}]
 rows.activites=[{id:'a1',name:'Découverte de la ville',resource:'Guide Démo',date:'2026-10-15',start:'09:00',end:'11:00',capacity:'12',price:'180'}]
 rows.tables=[{id:'t1',name:'Table 1',capacity:'4',zone:'Terrasse'}]
 }
 return {rows,ingredients:[{id:'tomate',name:'Tomates',unit:'kg',stock:12,threshold:3,cost:10},{id:'pates',name:'Pâtes',unit:'kg',stock:8,threshold:2,cost:18}],recipes:[{id:'plat1',name:'Pâtes à la tomate',price:65,items:[{ingredient:'tomate',quantity:0.15},{ingredient:'pates',quantity:0.2}]}],sales:[]}
}
export function validateRow(module:string,row:Row,ws:Workspace):string|undefined {
 if('total' in row && Number(row.paid)>Number(row.total)) return 'Le règlement dépasse le montant dû.'
 if(row.start && row.end && row.end<=row.start) return 'La fin doit être après le début.'
 if(row.endDate && row.endDate<=row.date) return 'Le départ doit être après l’arrivée.'
 const active = (ws.rows[module]||[]).filter(r=>r.id!==row.id && r.status!=='Annulée')
 if(row.status==='Annulée') return
 if(row.start && active.some(r=>r.resource===row.resource&&r.date===row.date&&r.start<row.end&&r.end>row.start)) return 'Cette ressource est déjà occupée sur ce créneau.'
 if(module==='reservations') {
 const unit=ws.rows.hebergements.find(r=>r.name===row.resource)
 if(!unit) return 'Choisissez le nom exact d’une unité existante.'
 if(Number(row.people)>Number(unit.capacity)) return 'Capacité de l’hébergement dépassée.'
 if(active.some(r=>r.resource===row.resource&&r.date<row.endDate&&r.endDate>row.date)) return 'L’hébergement est déjà réservé sur ces dates.'
 }
 if(module==='inscriptions' && row.status==='Validée') {
 const group=ws.rows.groupes.find(r=>r.name===row.group)
 if(!group) return 'Créez le groupe avant de valider cette inscription.'
 if(active.filter(r=>r.group===row.group && r.status==='Validée').length>=Number(group.capacity)) return 'Le groupe est complet.'
 }
 if(module==='participants') {
 const activity=ws.rows.activites.find(r=>r.name===row.activity)
 if(!activity) return 'Cette activité n’existe pas.'
 const count=active.filter(r=>r.activity===row.activity).reduce((s,r)=>s+Number(r.people),0)
 if(count+Number(row.people)>Number(activity.capacity)) return 'Le nombre de places disponibles est insuffisant.'
 }
 if(module==='tables-rdv') {
 const table=ws.rows.tables.find(r=>r.name===row.resource)
 if(!table) return 'Indiquez le nom exact d’une table existante.'
 if(Number(row.people)>Number(table.capacity)) return 'Cette table ne dispose pas de suffisamment de couverts.'
 }
 return
}
export function recipeCost(recipe:Recipe,ingredients:Ingredient[]):number {
 return recipe.items.reduce((sum,item)=>sum+item.quantity*(ingredients.find(i=>i.id===item.ingredient)?.cost||0),0)
}
export function sell(ws:Workspace,recipeId:string,quantity:number):Workspace {
 const recipe=ws.recipes.find(r=>r.id===recipeId)
 if(!recipe||!Number.isInteger(quantity)||quantity<1) throw new Error('Choisissez un plat et une quantité entière positive.')
 if(!recipe.items.length) throw new Error('Ajoutez les ingrédients de la recette avant de vendre.')
 const required:Record<string,number>={}
 for(const item of recipe.items) required[item.ingredient]=(required[item.ingredient]||0)+item.quantity*quantity
 for(const [ingredientId,amount] of Object.entries(required)) {
 const ingredient=ws.ingredients.find(i=>i.id===ingredientId)
 if(!ingredient||ingredient.stock<amount) throw new Error('Stock insuffisant : '+(ingredient?.name||ingredientId))
 }
 return {...ws,ingredients:ws.ingredients.map(i=>({...i,stock:i.stock-recipe.items.filter(r=>r.ingredient===i.id).reduce((n,r)=>n+r.quantity*quantity,0)})),sales:[...ws.sales,{id:crypto.randomUUID(),date:new Date().toISOString(),recipe:recipe.name,quantity,total:recipe.price*quantity,cost:recipeCost(recipe,ws.ingredients)*quantity}]}
}
