import { seed, sell, type Row, type Workspace, type Field } from './model'
export type Branch = 'hebergement'|'restauration'|'activites'|'transport'|'agence'
export type TField = Field & {ref?: string; optional?:boolean}
export type TModule = {id:string;title:string;description:string;fields:TField[]}
export type Ticket = {id:string;table:string;name:string;status:'À préparer'|'En préparation'|'Prête'|'Servie'|'Annulée';paid:number;total:number;cost:number;date:string;refunded?:number;uses?:{ingredient:string;quantity:number}[];saleIds?:string[];lines:{recipe:string;quantity:number;price:number}[]}
export type Movement = {id:string;ingredient:string;quantity:number;kind:string;date:string;note:string;cost:number}
export type BranchData = Workspace & {tickets:Ticket[];movements:Movement[]}
export type TourismData = Record<Branch,BranchData>
export const branches: Record<Branch,{title:string;subtitle:string;icon:string;accent:string}> = {
 hebergement:{title:'Hébergement',subtitle:'Séjours, accueil et opérations hôtelières',icon:'H',accent:'#0369a1'},
 restauration:{title:'Restauration',subtitle:'De la fiche technique à la caisse',icon:'R',accent:'#b45309'},
 activites:{title:'Activités',subtitle:'Expériences, guides et participants',icon:'A',accent:'#0f766e'},
 transport:{title:'Transport',subtitle:'Flotte, chauffeurs et transferts',icon:'T',accent:'#6d28d9'},
 agence:{title:'Agence de voyage',subtitle:'Voyages, packages et coordination',icon:'V',accent:'#be185d'}
}
const t=(key:string,label:string,type?:Field['type'],options?:string[],ref?:string,optional=false):TField=>({key,label,type,options,ref,required:!optional,optional})
const n=(key:string,label:string)=>t(key,label,'number')
const r=(key:string,label:string,ref:string)=>t(key,label,undefined,undefined,ref)
const d=(key='date',label='Date')=>t(key,label,'date')
const stat=(options:string[])=>t('status','Statut',undefined,options)
const contact=[t('name','Nom'),t('phone','Téléphone'),t('email','E-mail','email'),t('city','Ville')]
const customer:TModule={id:'clients',title:'Clients & contacts',description:'Coordonnées, provenance et préférences de vos clients fictifs.',fields:[...contact,t('origin','Canal / provenance'),t('notes','Préférences',undefined,undefined,undefined,true)]}
const finance:TModule={id:'paiements',title:'Facturation & règlements',description:'Registre de démonstration : montants, acomptes et échéances.',fields:[t('name','Référence facture'),r('client','Client','clients'),n('total','Montant dû (MAD)'),n('paid','Montant réglé (MAD)'),d('date','Échéance'),t('method','Mode',undefined,['Espèces','Carte','Virement','Chèque']),t('notes','Référence dossier',undefined,undefined,undefined,true)]}
const expense:TModule={id:'depenses',title:'Dépenses & fournisseurs',description:'Charges enregistrées et règlements fournisseurs.',fields:[t('name','Libellé'),t('supplier','Fournisseur'),t('category','Catégorie'),n('total','Montant (MAD)'),n('paid','Réglé (MAD)'),d()]}
const docs:TModule={id:'documents',title:'Documents & échéances',description:'Index de pièces et dates de validité ; pas de dépôt de fichiers confidentiels.',fields:[t('name','Document'),t('owner','Dossier / ressource'),t('category','Type'),d('date','Date de validité'),stat(['À recevoir','Reçu','À renouveler','Archivé'])]}
const team:TModule={id:'equipe',title:'Équipe & organisation',description:'Rôles opérationnels déclaratifs dans la démo.',fields:[...contact,t('role','Fonction'),stat(['Actif','Absent','Inactif'])]}
export const tourismModules:Record<Branch,TModule[]>={
 hebergement:[customer,
 {id:'categories',title:'Catégories & prestations',description:'Catégories de chambre, équipements et services inclus.',fields:[t('name','Catégorie'),n('capacity','Capacité'),t('features','Équipements'),t('included','Prestations incluses')]},
 {id:'unites',title:'Chambres & unités',description:'Inventaire des unités, tarifs de base et disponibilité technique.',fields:[t('name','Unité'),r('category','Catégorie','categories'),n('capacity','Voyageurs maximum'),n('price','Prix de base / nuit (MAD)'),t('floor','Étage / bâtiment'),stat(['Disponible','Maintenance','Hors service'])]},
 {id:'tarifs',title:'Tarifs saisonniers',description:'Un tarif par unité et période. Les chevauchements sont refusés.',fields:[t('name','Saison'),r('unit','Unité','unites'),d('date','Début inclus'),d('endDate','Fin exclusive'),n('price','Prix / nuit (MAD)')]},
 {id:'reservations',title:'Séjours & accueil',description:'Disponibilités, coût automatique par nuit, arrivée et départ.',fields:[r('client','Voyageur','clients'),r('unit','Unité','unites'),d('date','Arrivée'),d('endDate','Départ'),n('people','Voyageurs'),stat(['Option','Confirmée','Arrivé','Parti','Annulée']),n('paid','Acompte / reçu (MAD)'),t('notes','Demandes particulières',undefined,undefined,undefined,true)]},
 {id:'menage',title:'Ménage & maintenance',description:'Tâches par chambre, équipe et priorité.',fields:[t('name','Intervention'),r('unit','Unité','unites'),d(),r('employee','Responsable','equipe'),t('priority','Priorité',undefined,['Normale','Haute','Urgente']),stat(['À faire','En cours','Terminée'])]},finance,expense,docs,team],
 restauration:[customer,
 {id:'tables',title:'Salle & tables',description:'Zones, couverts et plan de salle sous forme de cartes.',fields:[t('name','Table'),t('zone','Zone'),n('capacity','Couverts'),stat(['Disponible','Hors service'])]},
 {id:'reservations',title:'Réservations de table',description:'Créneaux par table avec capacité et chevauchements contrôlés.',fields:[r('client','Client','clients'),r('table','Table','tables'),d(),t('start','Début','time'),t('end','Fin','time'),n('people','Couverts'),stat(['Confirmée','Arrivé','Terminée','Annulée'])]},
 {id:'fournisseurs',title:'Fournisseurs',description:'Contacts, spécialités, délais et conditions de paiement.',fields:[...contact,t('category','Famille de produits'),n('delay','Délai livraison (jours)'),t('terms','Conditions de règlement')]},
 {id:'menus',title:'Menus & formules',description:'Présentation des menus et conditions de service.',fields:[t('name','Menu / formule'),t('description','Contenu'),n('price','Prix (MAD)'),t('service','Service',undefined,['Petit-déjeuner','Déjeuner','Dîner','Toute la journée'])]},
 {id:'groupesAgence',title:'Repas groupes agence',description:'Prestations de restauration confirmées pour les voyageurs de l’agence ; distinctes des tickets cuisine.',fields:[t('name','Prestation'),r('client','Client','clients'),r('menu','Menu','menus'),d(),t('start','Début','time'),t('end','Fin','time'),n('people','Couverts'),n('total','Montant fournisseur (MAD)'),stat(['Confirmée','Réalisée','Annulée'])]},
 {id:'clotures',title:'Clôtures de caisse',description:'Comptage déclaré et écart calculé. Le montant attendu est saisi depuis votre caisse.',fields:[t('name','Service'),d(),n('expected','Montant attendu (MAD)'),n('counted','Montant compté (MAD)'),r('employee','Responsable','equipe')]},finance,expense,docs,team],
 activites:[customer,
 {id:'catalogue',title:'Catalogue d’expériences',description:'Activités, lieux, durée, tarifs et consignes.',fields:[t('name','Activité'),t('category','Catégorie',undefined,['Excursion','Atelier','Sport','Culture','Sortie']),t('location','Lieu'),n('duration','Durée (minutes)'),n('adultPrice','Prix adulte (MAD)'),n('childPrice','Prix enfant (MAD)'),n('groupPrice','Prix groupe / participant (MAD)'),n('cost','Coût de base / séance (MAD)'),t('instructions','Consignes / matériel')]},
 {id:'guides',title:'Guides & animateurs',description:'Contacts et compétences des intervenants.',fields:[...contact,t('languages','Langues'),t('skills','Compétences'),stat(['Actif','Indisponible'])]},
 {id:'equipements',title:'Matériel & équipements',description:'Inventaire et état des ressources.',fields:[t('name','Équipement'),n('quantity','Quantité'),stat(['Disponible','Maintenance','Hors service'])]},
 {id:'sessions',title:'Créneaux & planning',description:'Séances, guide, capacité et état de confirmation.',fields:[t('name','Référence séance'),r('activity','Activité','catalogue'),r('guide','Guide','guides'),d(),t('start','Début','time'),t('end','Fin','time'),n('capacity','Places'),stat(['Ouverte','Confirmée','Terminée','Annulée'])]},
 {id:'participants',title:'Réservations & présence',description:'Places, tarifs adultes/enfants/groupe, liste d’attente et présence.',fields:[r('client','Client','clients'),r('session','Créneau','sessions'),n('adults','Adultes'),n('children','Enfants'),t('rate','Tarif',undefined,['Standard','Groupe']),n('paid','Reçu (MAD)'),stat(['Confirmée','Liste d’attente','Présent','Absent','Annulée']),n('refund','Remboursement enregistré (MAD)')]},finance,expense,docs,team],
 transport:[customer,
 {id:'vehicules',title:'Flotte & véhicules',description:'Véhicules, capacité, état et coût kilométrique.',fields:[t('name','Immatriculation'),t('category','Catégorie',undefined,['Voiture','Van','Minibus','Autocar']),n('capacity','Places voyageurs'),n('costKm','Coût indicatif / km (MAD)'),n('odometer','Kilométrage'),stat(['Disponible','Maintenance','Hors service'])]},
 {id:'chauffeurs',title:'Chauffeurs',description:'Coordonnées, permis et disponibilités déclarées.',fields:[...contact,t('licence','Catégorie permis'),d('date','Échéance permis'),stat(['Actif','Indisponible'])]},
 {id:'trajets',title:'Trajets & transferts',description:'Véhicule/chauffeur, horaires, capacité, prix et coût estimatif.',fields:[t('name','Référence trajet'),r('client','Client','clients'),t('departure','Départ'),t('arrival','Arrivée'),d(),t('start','Début','time'),t('end','Fin','time'),r('vehicle','Véhicule','vehicules'),r('driver','Chauffeur','chauffeurs'),n('people','Passagers'),n('distance','Distance (km)'),n('price','Prix client (MAD)'),n('paid','Reçu (MAD)'),stat(['Prévu','Confirmé','En cours','Terminé','Annulé'])]},
 {id:'passagers',title:'Listes de passagers',description:'Passagers par trajet et présence au départ.',fields:[t('name','Nom fictif'),r('trip','Trajet','trajets'),t('pickup','Point de prise en charge'),stat(['À embarquer','Embarqué','Absent'])]},
 {id:'entretien',title:'Entretien & carburant',description:'Dépenses véhicule, échéances et incidents.',fields:[t('name','Intervention / plein'),r('vehicle','Véhicule','vehicules'),d(),t('category','Type',undefined,['Carburant','Entretien','Incident','Assurance']),n('total','Coût (MAD)'),n('odometer','Kilométrage'),stat(['Prévu','Réalisé'])]},finance,expense,docs,team],
 agence:[customer,
 {id:'fournisseurs',title:'Partenaires & fournisseurs',description:'Prestataires par branche, contacts et conditions.',fields:[...contact,t('branch','Branche',undefined,['Hébergement','Restauration','Activités','Transport']),t('terms','Conditions / annulation'),stat(['À qualifier','Actif','Suspendu'])]},
 {id:'voyages',title:'Dossiers voyage',description:'Voyageurs, dates, budget et état du dossier. Les prestations sont liées par identifiant.',fields:[t('name','Référence / titre'),r('client','Client','clients'),d('date','Début'),d('endDate','Fin'),n('people','Voyageurs'),n('budget','Budget client (MAD)'),stat(['Brouillon','Devis envoyé','Accepté','En préparation','En cours','Terminé','Annulé']),t('notes','Préférences',undefined,undefined,undefined,true)]},
 {id:'voyageurs',title:'Voyageurs & groupes',description:'Liste de voyageurs fictifs et besoins de prise en charge.',fields:[t('name','Nom fictif'),r('trip','Dossier','voyages'),t('type','Catégorie',undefined,['Adulte','Enfant']),t('notes','Besoin particulier',undefined,undefined,undefined,true)]},
 {id:'prestations',title:'Programme & prestations',description:'Composez le voyage jour par jour et suivez les demandes fournisseur.',fields:[t('name','Prestation'),r('trip','Dossier voyage','voyages'),t('branch','Branche',undefined,['hebergement','restauration','activites','transport']),r('supplier','Fournisseur','fournisseurs'),d(),t('start','Début','time'),t('end','Fin','time'),n('quantity','Quantité'),n('cost','Prix fournisseur / unité (MAD)'),n('price','Prix client / unité (MAD)'),n('supplierPaid','Réglé au fournisseur (MAD)'),stat(['À demander','Demande envoyée','Option','Confirmée','Refusée','Annulée']),t('notes','Conditions / référence confirmation',undefined,undefined,undefined,true)]},
 {id:'devis',title:'Devis & versions',description:'Versions détaillées créées dans le constructeur de package ; devis complémentaires manuels.',fields:[t('name','Référence / version'),r('trip','Dossier','voyages'),n('total','Prix total (MAD)'),n('cost','Coût fournisseur (MAD)'),n('paid','Reçu (MAD)'),d('date','Validité'),stat(['Brouillon','Envoyé','Accepté','Refusé','Expiré'])]},
 {id:'annulations',title:'Modifications & annulations',description:'Registre des frais et remboursements décidés après accord fournisseur.',fields:[t('name','Motif'),r('trip','Dossier','voyages'),r('service','Prestation','prestations'),n('fees','Frais (MAD)'),n('refund','Remboursement prévu (MAD)'),n('refunded','Remboursement effectué (MAD)'),stat(['À examiner','Accepté','Clôturé'])]},finance,expense,docs,team]
}
export function initialTourism():TourismData{
 const data={} as TourismData
 for(const b of Object.keys(branches) as Branch[]){const base=seed('tourisme');data[b]={...base,rows:Object.fromEntries(tourismModules[b].map(m=>[m.id,[]])),tickets:[],movements:[]};data[b].rows.clients=[{id:'client-demo',name:'Client Démo',phone:'0000000000',email:'demo@example.com',city:'Casablanca',origin:'Démonstration',notes:''}];data[b].rows.equipe=[{id:'team-demo',name:'Équipe Démo',phone:'0000000000',email:'equipe@example.com',city:'Casablanca',role:'Responsable',status:'Actif'}]}
 data.hebergement.rows.categories=[{id:'cat1',name:'Double',capacity:'2',features:'Wi-Fi · salle de bain',included:'Petit-déjeuner'}]
 data.hebergement.rows.unites=[{id:'unit1',name:'Chambre 101',category:'cat1',capacity:'2',price:'650',floor:'1',status:'Disponible'}]
 data.restauration.rows.tables=[{id:'table1',name:'Table 1',zone:'Terrasse',capacity:'4',status:'Disponible'}]
 data.activites.rows.catalogue=[{id:'activity1',name:'Découverte de la ville',category:'Culture',location:'Casablanca',duration:'120',adultPrice:'180',childPrice:'90',groupPrice:'150',cost:'400',instructions:'Chaussures confortables'}]
 data.activites.rows.guides=[{id:'guide1',name:'Guide Démo',phone:'0000000000',email:'guide@example.com',city:'Casablanca',languages:'Français',skills:'Culture',status:'Actif'}]
 data.activites.rows.sessions=[{id:'session1',name:'Visite du matin',activity:'activity1',guide:'guide1',date:'2026-10-15',start:'09:00',end:'11:00',capacity:'12',status:'Ouverte'}]
 data.transport.rows.vehicules=[{id:'vehicle1',name:'DEMO-001',category:'Van',capacity:'8',costKm:'3',odometer:'10000',status:'Disponible'}]
 data.transport.rows.chauffeurs=[{id:'driver1',name:'Chauffeur Démo',phone:'0000000000',email:'chauffeur@example.com',city:'Casablanca',licence:'B',date:'2027-10-01',status:'Actif'}]
 data.agence.rows.voyages=[{id:'trip1',name:'Séjour découverte',client:'client-demo',date:'2026-10-15',endDate:'2026-10-18',people:'2',budget:'6000',status:'Brouillon',notes:''}]
 data.agence.rows.fournisseurs=(['hebergement','restauration','activites','transport'] as Branch[]).map(b=>({id:'supplier-'+b,name:branches[b].title+' Démo',phone:'0000000000',email:'fournisseur@example.com',city:'Casablanca',branch:branches[b].title,terms:'À confirmer',status:'Actif'}))
 return data
}
const isActive=(r:Row)=>!['Annulée','Annulé','Refusée','Liste d’attente'].includes(r.status)
const overlap=(a:Row,b:Row)=>a.date===b.date&&a.start<b.end&&a.end>b.start
export function stayTotal(row:Row,data:BranchData):number{
 const unit=data.rows.unites.find(r=>r.id===row.unit);if(!unit)return 0
 let total=0;const end=Date.parse(row.endDate);const nights=(end-Date.parse(row.date))/86400000;if(!Number.isFinite(nights)||nights<1||nights>3660)return 0;for(let day=Date.parse(row.date);day<end;day+=86400000){const date=new Date(day).toISOString().slice(0,10);const tariff=data.rows.tarifs.find(t=>t.unit===row.unit&&t.date<=date&&t.endDate>date);total+=Number(tariff?.price??unit.price)}return total
}
export function enrich(branch:Branch,module:string,row:Row,data:BranchData):Row{
 const result={...row}
 if(branch==='hebergement'&&module==='reservations')result.total=String(stayTotal(row,data))
 if(branch==='activites'&&module==='participants'){
 const session=data.rows.sessions.find(s=>s.id===row.session);const a=data.rows.catalogue.find(a=>a.id===session?.activity)
 result.people=String(Number(row.adults)+Number(row.children));result.total=String(row.rate==='Groupe'?Number(a?.groupPrice||0)*Number(result.people):Number(row.adults)*Number(a?.adultPrice||0)+Number(row.children)*Number(a?.childPrice||0))
 }
 if(branch==='transport'&&module==='trajets'){const vehicle=data.rows.vehicules.find(v=>v.id===row.vehicle);result.total=row.price;result.cost=String(Number(vehicle?.costKm||0)*Number(row.distance))}
 if(branch==='agence'&&module==='prestations'){result.total=String(Number(row.price)*Number(row.quantity));result.totalCost=String(Number(row.cost)*Number(row.quantity))}
 if(module==='clotures')result.difference=String(Number(row.counted)-Number(row.expected))
 return result
}
export function validateTourism(branch:Branch,module:string,row:Row,data:BranchData):string|undefined{
 const config=tourismModules[branch].find(m=>m.id===module)
 for(const field of config?.fields||[]){const value=row[field.key];if(field.required&&!value?.trim())return 'Champ requis : '+field.label;if(field.type==='number'&&(!Number.isFinite(Number(value))||Number(value)<0))return 'Montant ou quantité invalide : '+field.label;if(field.ref&&value&&!data.rows[field.ref]?.some(r=>r.id===value))return 'Référence introuvable : '+field.label}
 for(const k of ['people','adults','children']){if(row[k]!==undefined&&(!Number.isInteger(Number(row[k]))||Number(row[k])<0||(k==='people'&&Number(row[k])<1)))return 'Nombre entier valide requis : '+k}
 if(row.capacity!==undefined&&(!Number.isInteger(Number(row.capacity))||Number(row.capacity)<1))return 'Capacité entière positive requise.'
 if(row.endDate && Date.parse(row.endDate)-Date.parse(row.date)>3660*86400000)return 'Période maximale : 10 ans.'
 if(row.start&&row.end&&row.end<=row.start)return 'La fin doit être après le début (créneau dans la même journée).'
 if(row.endDate&&row.endDate<=row.date)return 'La fin doit être après la date de début.'
 if(row.total&&Number(row.paid)>Number(row.total))return 'Le règlement dépasse le montant dû.'
 if(row.refund&&Number(row.refund)>Number(row.paid||row.total||Infinity))return 'Le remboursement dépasse le règlement reçu.'
 if(module==='annulations'&&Number(row.refunded)>Number(row.refund))return 'Le remboursement effectué dépasse le montant prévu.'
 if(module==='prestations'){const previous=data.rows.prestations.find(s=>s.id===row.id);if(previous?.status==='Confirmée' && row.status!=='Annulée' && ['branch','sourceId','date','endDate','start','end','trip','quantity','cost','price'].some(k=>previous[k]!==row[k]))return 'Annulez puis recréez la prestation pour modifier une réservation confirmée.'}
 if(module==='prestations' && row.status==='Confirmée' && row.sourceId && data.rows.prestations.find(s=>s.id===row.id)?.status!=='Confirmée')return 'Confirmez cette ressource locale depuis Demandes agence dans la branche fournisseur.'
 if(module==='prestations'&&Number(row.supplierPaid)>Number(row.totalCost))return 'Le paiement fournisseur dépasse le coût.'
 const others=(data.rows[module]||[]).filter(r=>r.id!==row.id&&isActive(r))
 if(['unites','tables','vehicules','categories','sessions'].includes(module)&&others.some(r=>r.name===row.name))return 'Ce nom de ressource existe déjà.'
 if(!isActive(row))return
 if(branch==='hebergement'&&['reservations','tarifs'].includes(module)){
 if(others.some(r=>r.unit===row.unit&&r.date<row.endDate&&r.endDate>row.date))return module==='tarifs'?'Une saison existe déjà pour cette période.':'Cette unité est déjà réservée.'
 if(module==='reservations'){const unit=data.rows.unites.find(r=>r.id===row.unit);if(unit?.status!=='Disponible')return 'L’unité est indisponible.';if(!Number.isInteger(Number(row.people))||Number(row.people)<1||Number(row.people)>Number(unit.capacity))return 'Nombre de voyageurs incompatible avec la capacité.'}
 }
 if(branch==='restauration'&&module==='reservations'){
 const table=data.rows.tables.find(t=>t.id===row.table);if(table?.status!=='Disponible')return 'Table indisponible.';if(Number(row.people)<1||Number(row.people)>Number(table.capacity))return 'Capacité de la table dépassée.';if(others.some(r=>r.table===row.table&&overlap(r,row)))return 'Cette table est réservée sur ce créneau.'
 }
 if(branch==='activites'&&module==='sessions'){
 if(data.rows.guides.find(g=>g.id===row.guide)?.status!=='Actif')return 'Guide indisponible.'
 if(others.some(r=>r.guide===row.guide&&overlap(r,row)))return 'Le guide est déjà affecté à un autre créneau.'
 }
 if(branch==='activites'&&module==='participants'){
 const session=data.rows.sessions.find(s=>s.id===row.session);if(session?.status==='Annulée')return 'Ce créneau est annulé.'
 if(!Number.isInteger(Number(row.adults))||!Number.isInteger(Number(row.children))||Number(row.people)<1)return 'Au moins un participant entier est requis.'
 if(others.filter(r=>r.session===row.session).reduce((n,r)=>n+Number(r.people),0)+Number(row.people)>Number(session?.capacity))return 'Capacité insuffisante : utilisez la liste d’attente.'
 }
 if(branch==='transport'&&module==='trajets'){
 const vehicle=data.rows.vehicules.find(v=>v.id===row.vehicle)
 if((data.rows.chauffeurs.find(d=>d.id===row.driver)?.date||'9999-12-31')<row.date)return 'Permis chauffeur expiré à la date du trajet.'
 if(vehicle?.status!=='Disponible'||data.rows.chauffeurs.find(d=>d.id===row.driver)?.status!=='Actif')return 'Véhicule ou chauffeur indisponible.'
 if(Number(row.people)<1||Number(row.people)>Number(vehicle.capacity))return 'Capacité du véhicule dépassée.'
 if(others.some(r=>(r.vehicle===row.vehicle||r.driver===row.driver)&&overlap(r,row)))return 'Véhicule ou chauffeur déjà affecté.'
 }
 if(branch==='agence'&&module==='prestations'){
 const supplier=data.rows.fournisseurs.find(f=>f.id===row.supplier);if(supplier && (supplier.branch!==branches[row.branch as Branch]?.title || supplier.status!=='Actif'))return 'Choisissez un fournisseur actif de cette branche.'
 if(row.status==='Confirmée'&&!row.notes?.trim())return 'Référence fournisseur requise pour une confirmation manuelle.';
 if(row.branch==='hebergement'&&(!row.endDate||row.endDate<=row.date))return 'Indiquez un départ après l’arrivée pour la prestation d’hébergement.';
 const trip=data.rows.voyages.find(v=>v.id===row.trip);if(trip&&(row.date<trip.date||row.date>trip.endDate))return 'La prestation doit être dans les dates du voyage.'
 }
 return
}
export function inventory(data:BranchData,ingredientId:string,quantity:number,kind:string,note:string,cost?:number):BranchData{
 const i=data.ingredients.find(i=>i.id===ingredientId);if(!i||!Number.isFinite(quantity)||(kind==='Inventaire'?quantity<0:quantity<=0))throw new Error('Ingrédient et quantité positive requis.')
 const change=kind==='Perte'?-quantity:kind==='Inventaire'?quantity-i.stock:quantity
 if(i.stock+change<0)throw new Error('Le stock ne peut pas devenir négatif.')
 return {...data,ingredients:data.ingredients.map(x=>x.id===ingredientId?{...x,stock:x.stock+change,cost:kind==='Réception'&&cost!==undefined?(x.stock*x.cost+quantity*cost)/(x.stock+quantity):x.cost}:x),movements:[...data.movements,{id:crypto.randomUUID(),ingredient:ingredientId,quantity:change,kind,date:new Date().toISOString(),note,cost:cost??i.cost}]}
}
export function placeTicket(data:BranchData,lines:{recipe:string;quantity:number}[],table:string,name:string):BranchData{
 if(!lines.length)throw new Error('Ajoutez au moins un plat.')
 if(!name.trim())throw new Error('Nom ou référence client requis.')
 const tableRow=data.rows.tables.find(t=>t.id===table);if(table&&tableRow?.status!=='Disponible')throw new Error('Table indisponible.')
 let next:Workspace=data;let total=0;let cost=0
 const ticketLines=lines.map(line=>{const recipe=data.recipes.find(r=>r.id===line.recipe);if(!recipe)throw new Error('Recette introuvable.');next=sell(next,line.recipe,line.quantity);const sale=next.sales.at(-1)!;total+=sale.total;cost+=sale.cost;return {...line,price:recipe.price}})
 return {...data,...next,tickets:[...data.tickets,{id:crypto.randomUUID(),table,name,status:'À préparer',paid:0,total,cost,date:new Date().toISOString(),uses:data.ingredients.map(i=>({ingredient:i.id,quantity:i.stock-next.ingredients.find(x=>x.id===i.id)!.stock})).filter(u=>u.quantity>0),saleIds:next.sales.slice(data.sales.length).map(s=>s.id),lines:ticketLines}],movements:[...data.movements,...data.ingredients.map(i=>({id:crypto.randomUUID(),ingredient:i.id,quantity:next.ingredients.find(x=>x.id===i.id)!.stock-i.stock,kind:'Commande',date:new Date().toISOString(),note:name,cost:i.cost})).filter(m=>m.quantity!==0)]}
}
export function quoteTotals(services:Row[],discount:number){const active=services.filter(isActive);const gross=active.reduce((n,s)=>n+Number(s.total),0);const cost=active.reduce((n,s)=>n+Number(s.totalCost),0);if(!Number.isFinite(discount)||discount<0||discount>gross)throw new Error('Remise incompatible avec le total.');return {gross,cost,total:gross-discount,margin:gross-discount-cost}}
export function cancelTicket(data:BranchData,id:string):BranchData{
 const ticket=data.tickets.find(t=>t.id===id);if(!ticket||ticket.status==='Annulée')throw new Error('Commande déjà annulée ou introuvable.')
 const uses=(ticket as Ticket & {uses?:{ingredient:string;quantity:number}[]}).uses||[]
 const saleIds=(ticket as Ticket & {saleIds?:string[]}).saleIds||[]
 return {...data,ingredients:data.ingredients.map(i=>({...i,stock:i.stock+uses.filter(u=>u.ingredient===i.id).reduce((n,u)=>n+u.quantity,0)})),sales:data.sales.filter(s=>!saleIds.includes(s.id)),tickets:data.tickets.map(t=>t.id===id?{...t,status:'Annulée',refunded:t.paid,paid:0}:t),movements:[...data.movements,...uses.map(u=>({id:crypto.randomUUID(),ingredient:u.ingredient,quantity:u.quantity,kind:'Annulation commande',date:new Date().toISOString(),note:id,cost:data.ingredients.find(i=>i.id===u.ingredient)?.cost||0}))]}
}
export function confirmAgencyRequest(all:TourismData,branch:Branch,serviceId:string,values:Record<string,string>):TourismData{
 const service=all.agence.rows.prestations.find(s=>s.id===serviceId)
 if(!service||service.branch!==branch||service.status!=='Demande envoyée')throw new Error('Demande inexistante ou déjà traitée.')
 const trip=all.agence.rows.voyages.find(t=>t.id===service.trip);if(!trip)throw new Error('Dossier introuvable.')
 const reference=values.reference?.trim();if(!reference)throw new Error('Référence de confirmation requise.')
 const data=all[branch];let updated=data
 if(service.sourceId){
 const client=all.agence.rows.clients.find(c=>c.id===trip.client);const clientId='agence-'+trip.client
 updated={...data,rows:{...data.rows,clients:[...data.rows.clients.filter(c=>c.id!==clientId),{...client,id:clientId,name:client?.name||'Voyageur agence'}]}}
 const people=values.people||trip.people;if(!Number.isInteger(Number(people))||Number(people)<1)throw new Error('Nombre entier positif de voyageurs requis.')
 let module='';let booking:Row={id:'agency-'+service.id,client:clientId,date:service.date,start:service.start,end:service.end,paid:'0',notes:reference}
 if(branch==='hebergement'){module='reservations';booking={...booking,unit:service.sourceId,endDate:service.endDate,people,status:'Confirmée'}}
 if(branch==='activites'){const session=data.rows.sessions.find(s=>s.id===service.sourceId);if(!session||session.date!==service.date)throw new Error('Le créneau ne correspond pas à la date demandée.');module='participants';booking={...booking,session:service.sourceId,adults:people,children:'0',rate:'Standard',refund:'0',status:'Confirmée'}}
 if(branch==='transport'){module='trajets';booking={...booking,name:service.name,vehicle:service.sourceId,driver:values.driver||'',departure:values.departure||'',arrival:values.arrival||'',distance:values.distance||'',people,price:service.totalCost,status:'Confirmé'}}
 if(branch==='restauration'){if(!data.rows.menus.some(m=>m.id===service.sourceId))throw new Error('Menu introuvable.');module='groupesAgence';booking={...booking,name:service.name,menu:service.sourceId,people,status:'Confirmée',total:service.totalCost}}
 booking=enrich(branch,module,booking,updated);const error=validateTourism(branch,module,booking,updated);if(error)throw new Error(error)
 updated={...updated,rows:{...updated.rows,[module]:[...(updated.rows[module]||[]).filter(r=>r.id!==booking.id),booking]}}
 }
 return {...all,[branch]:updated,agence:{...all.agence,rows:{...all.agence.rows,prestations:all.agence.rows.prestations.map(s=>s.id===service.id?{...s,status:'Confirmée',notes:reference}:s)}}}
}
export function syncAgencyCancellation(all:TourismData,next:BranchData):TourismData{
 let result:TourismData={...all,agence:next}
 for(const old of all.agence.rows.prestations){const now=next.rows.prestations.find(s=>s.id===old.id);if(old.status==='Confirmée'&&now?.status==='Annulée'){
 const branch=old.branch as Branch;const module=branch==='hebergement'?'reservations':branch==='activites'?'participants':branch==='transport'?'trajets':'groupesAgence';const data=result[branch]
 result={...result,[branch]:{...data,rows:{...data.rows,[module]:(data.rows[module]||[]).map(r=>r.id==='agency-'+old.id?{...r,status:branch==='transport'?'Annulé':'Annulée'}:r)}}}
 }}return result
}
