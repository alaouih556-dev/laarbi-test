import assert from 'node:assert/strict'
import ts from 'typescript'
import {readFileSync} from 'node:fs'
const code=ts.transpileModule(readFileSync('src/features/saas/model.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText
const {seed,sell,recipeCost,validateRow}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'))
const ws=seed('tourisme')
assert.equal(recipeCost(ws.recipes[0],ws.ingredients),5.1)
const sold=sell(ws,'plat1',2)
assert.equal(sold.ingredients[0].stock,11.7)
assert.equal(sold.sales[0].total,130)
assert.equal(sold.sales[0].cost,10.2)
assert.equal(ws.ingredients[0].stock,12)
assert.throws(()=>sell(ws,'plat1',1000),/Stock insuffisant/)
assert.throws(()=>sell(ws,'plat1',1.5),/entière/)
const booking={id:'b1',name:'Demo',resource:'Chambre 101',date:'2026-10-01',endDate:'2026-10-03',people:'2',status:'Confirmée'}
assert.equal(validateRow('reservations',booking,ws),undefined)
ws.rows.reservations=[booking]
assert.match(validateRow('reservations',{...booking,id:'b2',date:'2026-10-02'},ws),/déjà réservé/)
assert.equal(validateRow('reservations',{...booking,id:'b2',date:'2026-10-03',endDate:'2026-10-05'},ws),undefined)
assert.match(validateRow('reservations',{...booking,id:'b2',people:'3'},ws),/Capacité/)
ws.rows.participants=[{id:'p1',name:'Demo',activity:'Découverte de la ville',people:'11',status:'Confirmée'}]
assert.match(validateRow('participants',{id:'p2',activity:'Découverte de la ville',people:'2'},ws),/places/)
assert.match(validateRow('paiements',{id:'f1',paid:'200',total:'100'},ws),/dépasse/)
const duplicate=seed('tourisme');duplicate.recipes[0].items=[{ingredient:'tomate',quantity:7},{ingredient:'tomate',quantity:7}];assert.throws(()=>sell(duplicate,'plat1',1),/Stock insuffisant/)
console.log('12 contrôles métier réussis : stock, coûts, réservations, capacités, règlements.')
