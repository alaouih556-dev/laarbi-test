import assert from 'node:assert/strict'
import ts from 'typescript'
import {readFileSync} from 'node:fs'
const base=ts.transpileModule(readFileSync('src/features/saas/model.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText
const baseUrl='data:text/javascript;base64,'+Buffer.from(base).toString('base64')
const source=readFileSync('src/features/saas/tourism-model.ts','utf8').replace("from './model'",'from '+JSON.stringify(baseUrl))
const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText
const {initialTourism,enrich,validateTourism,stayTotal,inventory,placeTicket,cancelTicket,quoteTotals,confirmAgencyRequest,syncAgencyCancellation}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'))
const all=initialTourism();const hotel=all.hebergement
hotel.rows.tarifs=[{id:'season',name:'Saison',unit:'unit1',date:'2026-10-16',endDate:'2026-10-18',price:'900'}]
let row={id:'stay',client:'client-demo',unit:'unit1',date:'2026-10-15',endDate:'2026-10-18',people:'2',status:'Confirmée',paid:'0'}
assert.equal(stayTotal(row,hotel),2450)
row=enrich('hebergement','reservations',row,hotel);assert.equal(validateTourism('hebergement','reservations',row,hotel),undefined)
hotel.rows.reservations=[row]
assert.match(validateTourism('hebergement','reservations',{...row,id:'stay2'},hotel),/déjà réservée/)
assert.equal(validateTourism('hebergement','reservations',{...row,id:'stay2',date:'2026-10-18',endDate:'2026-10-19'},hotel),undefined)
assert.match(validateTourism('hebergement','reservations',{...row,id:'stay2',people:'3',date:'2026-10-19',endDate:'2026-10-20'},hotel),/capacité/)
const activity=enrich('activites','participants',{id:'attendee',client:'client-demo',session:'session1',adults:'2',children:'1',rate:'Standard',paid:'0',refund:'0',status:'Confirmée'},all.activites)
assert.equal(activity.total,'450');all.activites.rows.participants=[activity]
assert.match(validateTourism('activites','participants',enrich('activites','participants',{...activity,id:'a2',adults:'10',children:'0'},all.activites),all.activites),/Capacité/)
const waitlist={...activity,id:'waiting',adults:'100',status:'Liste d’attente'};assert.equal(validateTourism('activites','participants',waitlist,all.activites),undefined)
const transport=all.transport;let trip={id:'ride',name:'Transfert',client:'client-demo',departure:'A',arrival:'B',date:'2026-10-15',start:'09:00',end:'10:00',vehicle:'vehicle1',driver:'driver1',people:'2',distance:'30',price:'350',paid:'0',status:'Confirmé'}
trip=enrich('transport','trajets',trip,transport);assert.equal(trip.cost,'90');transport.rows.trajets=[trip]
assert.match(validateTourism('transport','trajets',{...trip,id:'ride2'},transport),/déjà affecté/)
assert.match(validateTourism('transport','trajets',{...trip,id:'ride2',start:'10:00',end:'11:00',people:'9'},transport),/Capacité/)
let restaurant=all.restauration
restaurant=inventory(restaurant,'tomate',12,'Réception','Achat',20);assert.equal(restaurant.ingredients[0].cost,15);assert.equal(restaurant.ingredients[0].stock,24)
assert.throws(()=>inventory(restaurant,'tomate',30,'Perte','Casse'),/négatif/)
const stocked=restaurant
const ordered=placeTicket(stocked,[{recipe:'plat1',quantity:2},{recipe:'plat1',quantity:1}],'table1','Commande 1')
assert.equal(ordered.tickets[0].total,195);assert.equal(ordered.ingredients[0].stock,23.55)
assert.throws(()=>placeTicket(stocked,[{recipe:'plat1',quantity:1},{recipe:'plat1',quantity:10000}],'table1','Échec atomique'),/Stock insuffisant/)
assert.equal(stocked.ingredients[0].stock,24)
const cancelled=cancelTicket(ordered,ordered.tickets[0].id);assert.equal(cancelled.ingredients[0].stock,24);assert.equal(cancelled.sales.length,0)
assert.throws(()=>cancelTicket(cancelled,cancelled.tickets[0].id),/déjà annulée/)
assert.equal(inventory(stocked,'tomate',0,'Inventaire','Comptage').ingredients[0].stock,0)
assert.deepEqual(quoteTotals([{id:'service',total:'1000',totalCost:'700',status:'Confirmée'},{id:'cancelled',total:'500',totalCost:'300',status:'Annulée'}],100),{gross:1000,cost:700,total:900,margin:200})
assert.throws(()=>quoteTotals([{id:'service',total:'10',totalCost:'5',status:'Confirmée'}],11),/Remise/)
const coordination=initialTourism();const service={id:'svc',name:'Séjour',trip:'trip1',branch:'hebergement',supplier:'supplier-hebergement',sourceId:'unit1',date:'2026-10-15',endDate:'2026-10-18',start:'09:00',end:'10:00',quantity:'3',price:'700',cost:'650',total:'2100',totalCost:'1950',supplierPaid:'0',status:'Demande envoyée',notes:''}
coordination.agence.rows.prestations=[service]
const confirmed=confirmAgencyRequest(coordination,'hebergement','svc',{reference:'CONF-001',people:'2'})
assert.equal(confirmed.agence.rows.prestations[0].status,'Confirmée');assert.equal(confirmed.hebergement.rows.reservations[0].unit,'unit1')
assert.equal(coordination.hebergement.rows.reservations.length,0)
const conflict={...confirmed,agence:{...confirmed.agence,rows:{...confirmed.agence.rows,prestations:[...confirmed.agence.rows.prestations,{...service,id:'svc2'}]}}};assert.throws(()=>confirmAgencyRequest(conflict,'hebergement','svc2',{reference:'CONFLICT',people:'2'}),/déjà réservée/);assert.equal(conflict.agence.rows.prestations[1].status,'Demande envoyée');assert.equal(conflict.hebergement.rows.reservations.length,1)
assert.throws(()=>confirmAgencyRequest(confirmed,'hebergement','svc',{reference:'CONF-002',people:'2'}),/déjà traitée/)
const next={...confirmed.agence,rows:{...confirmed.agence.rows,prestations:[{...confirmed.agence.rows.prestations[0],status:'Annulée'}]}}
assert.equal(syncAgencyCancellation(confirmed,next).hebergement.rows.reservations[0].status,'Annulée')
console.log('Contrôles Tourisme réussis : saisons, disponibilité, capacités, coûts, tickets atomiques, annulation/stock, devis, confirmation agence et libération de réservation.')
