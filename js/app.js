
function showPanel(n){
  // Limpiar los paneles dinámicos exclusivos de Servicio cuando
  // el usuario cambia a otra etapa. Así Contenedor/Piezas y el botón
  // "Continuar" nunca aparecen en Especiales, Analizador o Cotización.
  const panelContenedor = $("panel2");
  const panelCarga = $("panel3");
  const serviceContinue = $("servicioContinue");

  if(n !== 1){
    panelContenedor?.classList.remove("active","inline-carga-suelta","service-side-active");
    panelCarga?.classList.remove("active","inline-carga-suelta","service-side-active");
    if(serviceContinue) serviceContinue.style.display = "none";
  }else{
    if(serviceContinue) serviceContinue.style.display = "flex";
  }

  if((n===2 || n===3) && $("tipoCarga")){
    showPanel(1);
    toggleContainer();
    const tipo = $("tipoCarga").value;
    setTimeout(()=>scrollToId(tipo === "Contenedor" ? "panel2" : "panel3"),80);
    return;
  }

  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  const p=document.getElementById('panel'+n);
  if(p)p.classList.add('active');

  document.querySelectorAll('.app-tab').forEach(tab=>{
    tab.classList.toggle('active',Number(tab.dataset.panel)===n);
  });

  if(n===1) toggleContainer();
  updateDashboard();
  window.scrollTo({top:0,behavior:'smooth'});
}
function updateDashboard(){const t=typeof totals==='function'?totals():{weight:0,volume:0,refs:0};const a=typeof lastAnalysis!=='undefined'?lastAnalysis:null;const q=id=>document.getElementById(id);if(q('dashTon'))q('dashTon').textContent=(t.weight||0).toFixed(2)+' t';if(q('dashM3'))q('dashM3').textContent=(t.volume||0).toFixed(2)+' m³';if(q('dashRefs'))q('dashRefs').textContent=t.refs||0;updateQuoteButton();if(a&&typeof validation==='function'){const v=validation(a);q('dashStatus').textContent=v.level==='green'?'Aprobado':v.level==='yellow'?'Revisar':'No compatible';q('dashDot').className='status-dot '+v.level;}else{q('dashStatus').textContent='Pendiente';q('dashDot').className='status-dot';}}
function updateQuoteButton(){const button=$("quoteGenerateBtn");if(!button)return;const enabled=typeof hasCargo==='function'&&hasCargo();button.disabled=!enabled;button.setAttribute("aria-disabled",String(!enabled));}

const BASE_VEHICLES = [
 {name:"4 x 4",cap:1,vol:5.5,L:2.0,W:1.4,H:1.5,body:"Furgón - carpado platón",cargo:"Carga suelta / bultos / pallets",special:""},
 {name:"Turbo",cap:4.5,vol:18.5,L:4.5,W:2.0,H:2.1,body:"Furgón - carpado platón",cargo:"Carga suelta / bultos / pallets",special:""},
 {name:"600 sencillo",cap:8,vol:30.5,L:5.9,W:2.3,H:2.2,body:"Furgón - carpado / plancha",cargo:"Carga suelta / bultos / pallets / contenedor 20'",special:""},
 {name:"Doble troque",cap:17,vol:35.5,L:7.5,W:2.3,H:2.2,body:"Furgón - carpado / plancha",cargo:"Carga suelta / bultos / pallets / contenedor 20'",special:""},
 {name:"Minimula patineta",cap:18,vol:71.5,L:12,W:2.4,H:2.3,body:"Furgón - carpado plancha - grillo",cargo:"Carga suelta / bultos / contenedor 20' (combinados)",special:""},
 {name:"Mula",cap:35,vol:71.5,L:12,W:2.4,H:2.3,body:"Furgón - carpado plancha - grillo",cargo:"Carga suelta / bultos / contenedor 40' (combinados)",special:""},
 {name:"Carro tanque / niñera",cap:30,vol:null,L:12,W:2.4,H:2.4,body:"Tanque / tráiler hidráulico o de guaya",cargo:"Líquidos / vehículos",special:"Carga especializada"},
 {name:"Tolva",cap:35,vol:null,L:12,W:2.4,H:2.4,body:"Tolva",cargo:"Granel",special:"Carga especializada"},
 {name:"Cama baja / tolva",cap:35,vol:null,L:null,W:null,H:null,body:"Tráiler cama baja",cargo:"Cargas extra dimensionadas",special:"Según resolución / permiso"},
 {name:"Modular",cap:100,vol:null,L:null,W:null,H:null,body:"Tráiler modular",cargo:"Cargas extra dimensionadas",special:"Según resolución / permiso"},
 {name:"Van / furgón liviano",cap:1.2,vol:7,L:3.0,W:1.6,H:1.45,body:"Furgón cerrado",cargo:"Paquetería / urbana",special:"Configurable"},
 {name:"NHR",cap:2.5,vol:12,L:3.6,W:1.8,H:1.8,body:"Furgón / estacas",cargo:"Carga urbana liviana",special:"Configurable"},
 {name:"NPR",cap:4,vol:16,L:4.2,W:1.9,H:2.0,body:"Furgón / estacas",cargo:"Distribución urbana",special:"Configurable"},
 {name:"NQR",cap:6,vol:24,L:5.0,W:2.1,H:2.1,body:"Furgón / estacas",cargo:"Carga urbana mayor",special:"Configurable"},
 {name:"Furgón refrigerado",cap:8,vol:28,L:5.8,W:2.25,H:2.2,body:"Furgón refrigerado",cargo:"Carga con temperatura controlada",special:"Refrigeración"},
 {name:"Plataforma",cap:18,vol:null,L:8,W:2.5,H:2.5,body:"Plataforma",cargo:"Equipos / estructuras",special:"Carga especial"},
 {name:"Portacontenedor 20'",cap:30,vol:null,L:6.1,W:2.44,H:2.59,body:"Portacontenedor",cargo:"Contenedor 20'",special:"Validar peso bruto y ruta"},
 {name:"Portacontenedor 40'",cap:35,vol:null,L:12.2,W:2.44,H:2.9,body:"Portacontenedor",cargo:"Contenedor 40 / 40 HC",special:"Validar peso bruto y ruta"},
 {name:"Cama alta extensible",cap:35,vol:null,L:14,W:2.5,H:3,body:"Cama extensible",cargo:"Carga larga / especial",special:"Permiso según caso"}
];
let vehicles = JSON.parse(localStorage.getItem("lt_vehicles")||"null") || BASE_VEHICLES.map(v=>({...v}));
let pieces = [];
let lastAnalysis = null;
let editingIndex = null;

function $(id){return document.getElementById(id)}
function num(id){return parseFloat($(id).value)||0}
function scrollToId(id){$(id).scrollIntoView({behavior:"smooth"})}
function toggleContainer(){
  const tipo = $("tipoCarga").value;
  const serviceContinue = $("servicioContinue");
  if(serviceContinue) serviceContinue.style.display = tipo === "Carga suelta" ? "flex" : "none";
  const panelContenedor = $("panel2");
  const panelCarga = $("panel3");

  if(!panelContenedor || !panelCarga) return;

  // Al entrar por primera vez a Servicio no mostramos ningún formulario
  // secundario. Aparece únicamente después de que el usuario seleccione
  // explícitamente el tipo de carga.
  panelContenedor.classList.remove("active","inline-carga-suelta","service-side-active");
  panelCarga.classList.remove("active","inline-carga-suelta","service-side-active");

  if(!tipo) return;

  if(tipo === "Contenedor"){
    panelContenedor.classList.add("inline-carga-suelta","service-side-active");
  }else if(tipo === "Carga suelta"){
    panelCarga.classList.add("inline-carga-suelta","service-side-active");
  }
  updateLooseCargoContinue();
}
function updateLooseCargoContinue(){
  const button=$("looseCargoContinue");
  if(!button)return;
  const enabled=$("tipoCarga")?.value==="Carga suelta" && pieces.length>0;
  button.disabled=!enabled;
  button.setAttribute("aria-disabled",String(!enabled));
}
function continuarServicio(){
  const tipo = $("tipoCarga").value;

  if(!tipo){
    alert("Primero selecciona el tipo de carga.");
    $("tipoCarga").focus();
    return;
  }

  if(tipo === "Carga suelta" && (!pieces || pieces.length === 0)){
    alert("Agrega al menos una carga válida antes de continuar.");
    const p = $("panel3");
    if(p) p.scrollIntoView({behavior:"smooth",block:"start"});
    return;
  }

  if(tipo === "Contenedor"){
    if(num("contCant") < 1){
      alert("Indica una cantidad de contenedores válida.");
      $("contCant")?.focus();
      return;
    }
  }

  showPanel(4);
}

function irDesdeServicio(){
  const tipo = $("tipoCarga").value;

  if(tipo === "Contenedor" || tipo === "Carga suelta"){
    toggleContainer();
    setTimeout(()=>scrollToId(tipo === "Contenedor" ? "panel2" : "panel3"),80);
    return;
  }

  showPanel(4);
}
function volverACarga(){
  showPanel(1);
  toggleContainer();
  const tipo = $("tipoCarga").value;
  setTimeout(()=>scrollToId(tipo === "Contenedor" ? "panel2" : "panel3"),80);
}
function unitToM(v,u){return u==="Centímetros"?v/100:v}
function weightToT(v,u){return u==="kg"?v/1000:v}

function calcPiecePreview(){
 const q=Math.max(1,num("pCant")), L=unitToM(num("pL"),$("pUnidad").value), W=unitToM(num("pA"),$("pUnidad").value), H=unitToM(num("pH"),$("pUnidad").value);
 const wt=weightToT(num("pPeso"),$("pPesoUnidad").value);
 $("previewPiece").innerHTML=(L&&W&&H?`Volumen unitario: <b>${(L*W*H).toFixed(2)} m³</b> · volumen total: <b>${(L*W*H*q).toFixed(2)} m³</b>`:"Ingresa medidas")+" · "+(wt?`peso total: <b>${(wt*q).toFixed(3)} t</b>`:"ingresa peso");
}
["pCant","pL","pA","pH","pPeso","pUnidad","pPesoUnidad"].forEach(id=>$(id).addEventListener("input",calcPiecePreview));

function addPieceObject(){
 const q=Math.max(1,num("pCant")), L=unitToM(num("pL"),$("pUnidad").value), W=unitToM(num("pA"),$("pUnidad").value), H=unitToM(num("pH"),$("pUnidad").value), wt=weightToT(num("pPeso"),$("pPesoUnidad").value);
 if(!L||!W||!H||!wt){alert("Completa cantidad, largo, ancho, alto y peso de la pieza.");return null}
 return {desc:$("pDesc").value.trim()||`Referencia ${pieces.length+1}`,q,L,W,H,wt,nw:wt,gw:wt,apilable:$("pApilable").checked,acostarse:$("pAcostarse").checked,sobresalir:$("pSobresalir").checked,fragil:$("pFragil").checked,peligrosa:$("pPeligrosa").checked};
}
function resetPieceForm(){
 ["pDesc","pL","pA","pH","pPeso"].forEach(id=>$(id).value="");
 $("pCant").value=1;$("pUnidad").value="Centímetros";$("pPesoUnidad").value="kg";
 ["pApilable","pAcostarse","pSobresalir","pFragil","pPeligrosa"].forEach(id=>$(id).checked=false);
 editingIndex=null; calcPiecePreview();
}
function agregarPieza(){
 const p=addPieceObject(); if(!p)return;
 if(editingIndex!==null){pieces[editingIndex]=p}else pieces.push(p);
 renderPieces(); resetPieceForm(); scrollToId("pieceForm");
}
function editarPieza(i){
 const p=pieces[i]; editingIndex=i;
 $("pDesc").value=p.desc;$("pCant").value=p.q;$("pL").value=p.L;$("pA").value=p.W;$("pH").value=p.H;$("pUnidad").value="Metros";$("pPeso").value=p.wt;$("pPesoUnidad").value="toneladas";
 $("pApilable").checked=p.apilable;$("pAcostarse").checked=p.acostarse;$("pSobresalir").checked=p.sobresalir;$("pFragil").checked=p.fragil;$("pPeligrosa").checked=p.peligrosa;
 calcPiecePreview();scrollToId("pieceForm");
}
function eliminarPieza(i){if(confirm("¿Eliminar esta referencia?")){pieces.splice(i,1);renderPieces()}}
function renderPieces(){
 let el=$("pieceList");
 if(!pieces.length){el.innerHTML='<div class="empty">No hay referencias guardadas. Agrega la primera pieza o grupo, o impórtalas desde Excel o PDF.</div>'}
 else el.innerHTML=pieces.map((p,i)=>{
  const boxesLabel = p.boxes ? ` · ${p.boxes} cajas` : "";
  const vol = (Number.isFinite(Number(p.volume))?Number(p.volume):p.L*p.W*p.H*(p.boxes||p.q)).toFixed(3);
  const area = (p.L*p.W*(p.boxes||p.q)).toFixed(2);
  const pesoTotT = (p.wt*p.q).toFixed(3);
  const pesoTotKg = ((p.wt*p.q)*1000).toFixed(1);
  const dimCm = `${Math.round(p.L*100)} × ${Math.round(p.W*100)} × ${Math.round(p.H*100)} cm`;
  const dimM = `${p.L.toFixed(2)} × ${p.W.toFixed(2)} × ${p.H.toFixed(2)} m`;
  return `<div class="piece"><div class="piece-grid">
 <div><b>${esc(p.desc)}</b><small>${p.q} und${boxesLabel} · ${dimCm} <span style="color:#8f9bad">(${dimM})</span></small></div>
 <div><small>Peso</small><b>${pesoTotT} t</b> <span style="font-size:10px;color:#8f9bad">(${pesoTotKg} kg)</span></div>
 <div><small>Volumen</small><b>${vol} m³</b></div>
 <div><small>Área piso</small><b>${area} m²</b></div>
 <div><small>Apilable</small><b>${p.apilable?"Sí":"No"}</b></div>
 <div><small>Estado</small><b>${p.peligrosa?"Peligrosa":p.fragil?"Frágil":"Normal"}</b></div>
 <div style="display:flex;gap:5px"><button class="iconbtn" onclick="editarPieza(${i})" title="Editar">✎</button><button class="iconbtn" onclick="eliminarPieza(${i})" title="Eliminar">×</button></div>
 </div></div>`;
 }).join("");
 const t=totals();$("totalTon").textContent=t.weight.toFixed(3)+" t ("+(t.weight*1000).toFixed(1)+" kg)";$("totalM3").textContent=t.volume.toFixed(2)+" m³";$("totalArea").textContent=t.area.toFixed(2)+" m²";$("totalRefs").textContent=pieces.length;
 renderMeasuresTable();
 updateLooseCargoContinue();
 updateQuoteButton();
}
function renderMeasuresTable(){
 const tbl=$("measuresTable"); if(!tbl)return;
 if(isContainer()){
  const count=Math.max(1,num("contCant"));
  const weight=(num("contMerc")+num("contTara"))*count/1000;
  tbl.innerHTML=`<tr><td>Contenedor ${esc($("contTam").value)}</td><td>${count}</td><td class="muted-cell">Dimensiones según equipo</td><td>${weight.toFixed(3)} t</td><td>N/D</td></tr>`;
  return;
 }
 if(!pieces.length){tbl.innerHTML='<tr><td colspan="5" class="muted-cell" style="text-align:center;padding:16px">Sin referencias registradas.</td></tr>';return}
 tbl.innerHTML=pieces.map(p=>{
   const totT = (p.wt*p.q).toFixed(3);
   const totKg = (p.wt*p.q*1000).toFixed(1);
   const vol = (Number.isFinite(Number(p.volume))?Number(p.volume):p.L*p.W*p.H*(p.boxes||p.q)).toFixed(3);
   const cantLabel = p.boxes ? `${p.q} (${p.boxes} cjs)` : `${p.q}`;
   const dimStr = `${Math.round(p.L*100)}×${Math.round(p.W*100)}×${Math.round(p.H*100)} cm`;
   return `<tr><td>${esc(p.desc)}</td><td>${cantLabel}</td><td class="muted-cell">${dimStr}</td><td>${totT} t <small style="color:#8f9bad">(${totKg} kg)</small></td><td>${vol}</td></tr>`;
 }).join("");
}
function isContainer(){return $("tipoCarga")?.value==="Contenedor"}
function hasCargo(){return pieces.length>0 || (isContainer() && num("contMerc")>0 && num("contCant")>=1)}
function totals(){
 if(isContainer()){
  const count=Math.max(1,num("contCant"));
  const weight=(num("contMerc")+num("contTara"))*count/1000;
  return {weight,gw:weight,net:num("contMerc")*count/1000,volume:0,area:0,refs:count,maxL:0,maxW:0,maxH:0};
 }
 return pieces.reduce((a,p)=>{
   const quantity=Number(p.q)||0;
   const boxes=Number(p.boxes)||quantity;
   const gross=Number(p.gw??p.wt)||0;
   const net=Number(p.nw??p.wt)||0;
   a.weight+=gross*quantity;
   a.gw+=gross*quantity;
   a.net+=net*quantity;
   a.volume+=Number.isFinite(Number(p.volume))?Number(p.volume):p.L*p.W*p.H*boxes;
   a.area+=p.L*p.W*boxes;
   a.maxL=Math.max(a.maxL,p.L);
   a.maxW=Math.max(a.maxW,p.W);
   a.maxH=Math.max(a.maxH,p.H);
   return a;
 },{weight:0,gw:0,net:0,volume:0,area:0,refs:pieces.length,maxL:0,maxW:0,maxH:0});
}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}

const PDF_HEADER_DEFINITIONS = [
  { key: "desc", aliases: ["descripcion de la mercancia", "descripcion del producto", "commodity description", "equipo / carga", "descripcion", "description", "detalle", "producto", "product", "mercancia", "mercancía", "articulo", "artículo", "material", "nombre", "especificacion", "desc", "commodity"] },
  { key: "size", aliases: ["dimensions (lxwxh cm)", "dimensions (cm)", "dimensiones (cm)", "dimensiones (m)", "medidas (cm)", "medidas (m)", "size/cbm", "size", "cbm", "dimensiones", "dimension", "medidas", "medida", "tamano", "lxwxh", "l x a x h", "dim (cm)", "dim (m)", "dim (mm)", "medidas (mts)", "dimensiones (mts)"] },
  { key: "totalGw", aliases: ["total gw (kgs)", "total gw", "total gross weight", "peso bruto total", "gw total", "total weight", "total gross wt", "peso bruto tot", "peso total (t)", "peso total (ton)", "peso total (kg)", "peso total", "peso bruto (kg)", "peso (kg)", "peso (t)", "peso (ton)", "gross weight (kgs)", "gross weight", "peso bruto", "gw (kgs)", "gw", "peso", "weight"] },
  { key: "totalNw", aliases: ["total nw (kgs)", "total nw", "total net weight", "peso neto total", "nw total", "total net wt", "peso neto (kg)", "peso neto (t)", "peso neto", "net weight (kgs)", "net weight", "nw (kgs)", "nw"] },
  { key: "gwUnit", aliases: ["peso bruto unitario", "peso bruto por caja", "peso unitario", "gw/ctn", "gw/box", "peso x caja", "peso por bulto", "peso unit (kg)", "peso u (t)", "peso/u", "peso unit", "unit gw", "unit gross weight", "unit weight", "gw per ctn", "gw per box"] },
  { key: "nwUnit", aliases: ["peso neto unitario", "peso neto por caja", "nw/ctn", "nw/box", "p. neto unit", "unit nw", "unit net weight"] },
  { key: "pcsPerBox", aliases: ["unidades por caja", "piezas por caja", "pcs/ctn", "pcs/box", "pcs ctn", "pcs box", "pcsctn", "pcsbox", "und/caja"] },
  { key: "qty", aliases: ["quantity (pcs)", "cantidad piezas", "piezas totales", "total pcs", "tot pcs", "unidades", "units", "qty (pcs)", "cantidad", "cant", "qty", "quantity", "und", "pcs", "piezas", "cant.", "pieces"] },
  { key: "boxes", aliases: ["total bultos", "total cartons", "total cajas", "total ctns", "cant bultos", "cant cajas", "total pkgs", "bultos", "ctns", "cartons", "cajas", "boxes", "paquetes", "pkgs", "packages"] },
  { key: "len", aliases: ["largo (cm)", "largo (m)", "largo (mm)", "length (cm)", "length (m)", "largo", "longitud", "length", "l (cm)", "l (m)", "l (mm)", "l"] },
  { key: "width", aliases: ["ancho (cm)", "ancho (m)", "ancho (mm)", "width (cm)", "width (m)", "ancho", "width", "wide", "w (cm)", "w (m)", "w (mm)", "w", "a"] },
  { key: "height", aliases: ["alto (cm)", "alto (m)", "alto (mm)", "height (cm)", "height (m)", "alto", "altura", "height", "h (cm)", "h (m)", "h (mm)", "h"] },
  { key: "ref", aliases: ["referencia n°", "referencia no", "part number", "codigo producto", "referencia", "reference", "part no", "item code", "sku", "modelo", "ref"] },
  { key: "code", aliases: ["commodity item", "carton no", "awb item", "item no", "ctn no", "bulto no", "box no", "codigo", "code", "posicion", "ítem", "item", "pos", "nro", "no", "sec"] },
  { key: "vol", aliases: ["volumen total", "volume (cbm)", "volume (m3)", "volumen (m3)", "cbm", "volumen", "volume", "m3", "cubicaje"] }
];

function normHeader(h){return String(h||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]/g,"")}
function parseNumber(value){
 const raw=String(value??"").trim().replace(/\s/g,"");
 if(!raw)return NaN;
 const numeric=(raw.match(/[+-]?[0-9][0-9.,]*/) || [""])[0];
 if(!numeric)return NaN;
 const normalized=numeric.includes(",")&&numeric.includes(".")
  ? (numeric.lastIndexOf(",")>numeric.lastIndexOf(".")?numeric.replace(/\./g,"").replace(",","."):numeric.replace(/,/g,""))
  : numeric.replace(",",".");
 return Number(normalized);
}
function importValue(keys,names){
 for(const name of names){
  const exact=keys[normHeader(name)];
  if(exact!==undefined&&String(exact).trim()!=="")return exact;
 }
 const key=Object.keys(keys).find(candidate=>names.some(name=>normHeader(name).length>1&&candidate.includes(normHeader(name))));
 return key?keys[key]:undefined;
}
function normalizePdfText(value){return String(value||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g," ").trim()}

function matchHeaderCategory(tokenText){
  const rawClean = tokenText.trim().toLowerCase();
  const nToken = normHeader(tokenText);
  if(!nToken) return null;
  
  for(const def of PDF_HEADER_DEFINITIONS){
    for(const alias of def.aliases){
      const nAlias = normHeader(alias);
      if(!nAlias) continue;
      
      if(nToken === nAlias) return def.key;
      
      if(alias.length === 1){
        if(rawClean === alias) return def.key;
      } else {
        if(nToken.length >= nAlias.length && (nToken.startsWith(nAlias) || nToken.endsWith(nAlias) || nToken.includes(nAlias))){
          return def.key;
        }
      }
    }
  }
  return null;
}

function findPdfMeasurement(text,names){
 const aliases=names.map(name=>normalizePdfText(name).replace(/\s+/g,"\\s*"));
 const match=new RegExp(`(?:${aliases.join("|")})[\\s.:=\\/-]*([0-9][0-9.,]*)\\s*(mm|cm|m|kg|lb|lbs|t|ton(?:eladas?)?)?`,"i").exec(text);
 return match?{value:parseNumber(match[1]),unit:(match[2]||"").toLowerCase()}:null;
}
function findPdfNumber(text,names){
 const measurement=findPdfMeasurement(text,names);
 return measurement?measurement.value:NaN;
}
function findPdfDimensions(text){
 if(!text||typeof text!=="string")return null;
 const match=/([0-9][0-9.,]*)\s*[x×*]\s*([0-9][0-9.,]*)\s*[x×*]\s*([0-9][0-9.,]*)\s*(mm|cm|m)?(?:\/[^\s]+)?(?:\b|$)/i.exec(text);
 if(match){
  const rawL=parseNumber(match[1]), rawW=parseNumber(match[2]), rawH=parseNumber(match[3]);
  let unit=(match[4]||"").toLowerCase();
  if(!unit){
   const maxVal=Math.max(rawL,rawW,rawH);
   unit=maxVal>4?"cm":"m";
  }
  return {L:rawL,W:rawW,H:rawH,unit,index:match.index,end:match.index+match[0].length};
 }
 const labelled=/\b(?:largo|length|l)\s*:\s*([0-9][0-9.,]*)\s+(?:ancho|width|w|a)\s*:\s*([0-9][0-9.,]*)\s+(?:alto|height|h)\s*:\s*([0-9][0-9.,]*)\s*(mm|cm|m)?/i.exec(text);
 if(labelled){
  const rawL=parseNumber(labelled[1]), rawW=parseNumber(labelled[2]), rawH=parseNumber(labelled[3]);
  let unit=(labelled[4]||"").toLowerCase();
  if(!unit){
   const maxVal=Math.max(rawL,rawW,rawH);
   unit=maxVal>4?"cm":"m";
  }
  return {L:rawL,W:rawW,H:rawH,unit,index:labelled.index,end:labelled.index+labelled[0].length};
 }
 return null;
}
function convertPdfMeasurement(measurement,defaultUnit){
 if(!measurement||!Number.isFinite(measurement.value))return NaN;
 const unit=(measurement.unit||defaultUnit||"").toLowerCase();
 if(["mm"].includes(unit))return measurement.value/1000;
 if(["cm"].includes(unit))return measurement.value/100;
 if(["kg"].includes(unit))return measurement.value/1000;
 if(["g"].includes(unit))return measurement.value/1000000;
 if(["t","ton","tons","tonelada","toneladas"].includes(unit))return measurement.value;
 if(["lb","lbs"].includes(unit))return measurement.value*0.00045359237;
 return measurement.value;
}
function pdfRows(items){
 const groups=[];
 items.filter(item=>String(item.str||"").trim()).forEach(item=>{
  const x=Number(item.transform?.[4]||0), y=Number(item.transform?.[5]||0);
  const width=Number(item.width||(String(item.str).length*6));
  const group=groups.find(candidate=>Math.abs(candidate.y-y)<5.5);
  if(group){
    group.items.push({text:String(item.str).trim(),x,width});
  } else {
    groups.push({y,items:[{text:String(item.str).trim(),x,width}]});
  }
 });
 return groups.sort((a,b)=>b.y-a.y).map(group=>({
   y:group.y,
   items:group.items.sort((a,b)=>a.x-b.x),
   text:group.items.map(item=>item.text).join(" ").trim()
 })).filter(row=>row.text);
}
function pdfLines(items){return pdfRows(items).map(row=>row.text)}

function detectPdfTableColumns(headerRows){
  const combinedItems = [];
  headerRows.forEach(hr => combinedItems.push(...hr.items));
  combinedItems.sort((a, b) => a.x - b.x);

  const matchedColumns = [];
  const claimedIndices = new Set();

  for(let i = 0; i < combinedItems.length; i++){
    if(claimedIndices.has(i)) continue;
    const item = combinedItems[i];
    
    let key = matchHeaderCategory(item.text);
    let spanCount = 1;

    if(!key && i < combinedItems.length - 1 && !claimedIndices.has(i + 1)){
      const nextItem = combinedItems[i+1];
      if(Math.abs(nextItem.x - (item.x + (item.width || 0))) < 50){
        key = matchHeaderCategory(item.text + " " + nextItem.text);
        if(key) spanCount = 2;
      }
    }

    if(key){
      claimedIndices.add(i);
      if(spanCount > 1) claimedIndices.add(i + 1);

      const fullHeaderText = (item.text + " " + (spanCount > 1 ? combinedItems[i+1].text : "")).toLowerCase();
      let explicitUnit = "";
      if(/\b(mm)\b/i.test(fullHeaderText)) explicitUnit = "mm";
      else if(/\b(cm)\b/i.test(fullHeaderText)) explicitUnit = "cm";
      else if(/\b(m|mts|metros)\b/i.test(fullHeaderText)) explicitUnit = "m";
      else if(/\b(t|ton|tons|toneladas)\b/i.test(fullHeaderText)) explicitUnit = "t";
      else if(/\b(kg|kgs|kilos)\b/i.test(fullHeaderText)) explicitUnit = "kg";
      else if(/\b(lb|lbs|libras)\b/i.test(fullHeaderText)) explicitUnit = "lb";

      matchedColumns.push({
        key,
        x: item.x,
        width: item.width || 40,
        unit: explicitUnit,
        rawText: item.text + (spanCount > 1 ? " " + combinedItems[i+1].text : "")
      });
    }
  }

  const uniqueKeys = new Set(matchedColumns.map(c => c.key));
  const hasDesc = uniqueKeys.has("desc") || uniqueKeys.has("ref") || uniqueKeys.has("code");
  const hasQty = uniqueKeys.has("qty") || uniqueKeys.has("boxes");
  const hasDimOrWt = uniqueKeys.has("size") || uniqueKeys.has("len") || uniqueKeys.has("width") || uniqueKeys.has("height") || uniqueKeys.has("totalGw") || uniqueKeys.has("gwUnit");

  if(uniqueKeys.size < 3 || !(hasDesc && (hasQty || hasDimOrWt))) return null;

  // Disambiguate when multiple GW or NW columns exist (e.g. Total GW vs Unit GW)
  const gwCols = matchedColumns.filter(c => c.key === "totalGw" || c.key === "gwUnit");
  if(gwCols.length > 1){
    const totCol = gwCols.find(c => /total|tot/i.test(c.rawText || ""));
    const unitCol = gwCols.find(c => c !== totCol);
    if(totCol && unitCol){
      totCol.key = "totalGw";
      unitCol.key = "gwUnit";
    }
  }
  const nwCols = matchedColumns.filter(c => c.key === "totalNw" || c.key === "nwUnit");
  if(nwCols.length > 1){
    const totCol = nwCols.find(c => /total|tot/i.test(c.rawText || ""));
    const unitCol = nwCols.find(c => c !== totCol);
    if(totCol && unitCol){
      totCol.key = "totalNw";
      unitCol.key = "nwUnit";
    }
  }

  matchedColumns.sort((a, b) => a.x - b.x);

  for(let i = 0; i < matchedColumns.length; i++){
    const curr = matchedColumns[i];
    const prev = i > 0 ? matchedColumns[i - 1] : null;
    const next = i < matchedColumns.length - 1 ? matchedColumns[i + 1] : null;

    curr.minX = prev ? (prev.x + curr.x) / 2 : 0;
    curr.maxX = next ? (curr.x + next.x) / 2 : Infinity;
  }

  return matchedColumns;
}

function extractCellFromRow(row, column){
  if(!column) return "";
  const cells = row.items.filter(item => item.x >= column.minX && item.x < column.maxX);
  return cells.map(c => c.text).join(" ").trim();
}

function pdfTableRecords(items){
  const rows = pdfRows(items);
  if(rows.length < 2) return { records: [], totals: {} };

  let bestHeaderIndex = -1;
  let detectedColumns = null;

  for(let i = 0; i < Math.min(rows.length - 1, 20); i++){
    let cols = detectPdfTableColumns([rows[i]]);
    if(!cols && i < rows.length - 1){
      cols = detectPdfTableColumns([rows[i], rows[i+1]]);
    }

    if(cols){
      bestHeaderIndex = i;
      detectedColumns = cols;
      break;
    }
  }

  if(!detectedColumns || bestHeaderIndex < 0){
    return { records: [], totals: {} };
  }

  const colMap = {};
  detectedColumns.forEach(c => { colMap[c.key] = c; });

  const records = [];
  const startRowIdx = bestHeaderIndex + 1;

  for(let r = startRowIdx; r < rows.length; r++){
    const row = rows[r];
    const normalized = normalizePdfText(row.text);

    if(/^(?:total|subtotal|totales|cantidad total|peso neto|peso bruto|volume total|volumen total|grand total|resumen)\b/i.test(normalized)) continue;
    if(detectPdfTableColumns([row])) continue;
    if(!/\d/.test(row.text)) continue;

    const descText = extractCellFromRow(row, colMap.desc);
    const refText = extractCellFromRow(row, colMap.ref);
    const codeText = extractCellFromRow(row, colMap.code);
    const description = [refText, descText].filter(Boolean).join(" - ") || descText || refText || codeText || `Ítem ${records.length + 1}`;

    const qtyVal = parseNumber(extractCellFromRow(row, colMap.qty));
    const boxVal = parseNumber(extractCellFromRow(row, colMap.boxes));
    const quantity = Number.isFinite(qtyVal) && qtyVal > 0 ? qtyVal : Number.isFinite(boxVal) && boxVal > 0 ? boxVal : 1;
    const boxes = Number.isFinite(boxVal) && boxVal > 0 ? boxVal : Number.isFinite(qtyVal) && qtyVal > 0 ? qtyVal : 1;

    let L = NaN, W = NaN, H = NaN;
    const sizeStr = extractCellFromRow(row, colMap.size);
    if(sizeStr){
      const parsedDim = findPdfDimensions(sizeStr);
      if(parsedDim){
        L = convertPdfMeasurement({ value: parsedDim.L, unit: parsedDim.unit }, "cm");
        W = convertPdfMeasurement({ value: parsedDim.W, unit: parsedDim.unit }, "cm");
        H = convertPdfMeasurement({ value: parsedDim.H, unit: parsedDim.unit }, "cm");
      }
    }

    if(!Number.isFinite(L) || !Number.isFinite(W) || !Number.isFinite(H)){
      const rawL = parseNumber(extractCellFromRow(row, colMap.len));
      const rawW = parseNumber(extractCellFromRow(row, colMap.width));
      const rawH = parseNumber(extractCellFromRow(row, colMap.height));

      if(Number.isFinite(rawL) && Number.isFinite(rawW) && Number.isFinite(rawH)){
        const unitL = colMap.len?.unit || (rawL > 4 ? "cm" : "m");
        const unitW = colMap.width?.unit || (rawW > 4 ? "cm" : "m");
        const unitH = colMap.height?.unit || (rawH > 4 ? "cm" : "m");

        L = convertPdfMeasurement({ value: rawL, unit: unitL }, "cm");
        W = convertPdfMeasurement({ value: rawW, unit: unitW }, "cm");
        H = convertPdfMeasurement({ value: rawH, unit: unitH }, "cm");
      }
    }

    const gwTotVal = parseNumber(extractCellFromRow(row, colMap.totalGw));
    const nwTotVal = parseNumber(extractCellFromRow(row, colMap.totalNw));
    const gwUnitVal = parseNumber(extractCellFromRow(row, colMap.gwUnit));
    const nwUnitVal = parseNumber(extractCellFromRow(row, colMap.nwUnit));

    const unitGW = colMap.totalGw?.unit || colMap.gwUnit?.unit || "kg";
    const unitNW = colMap.totalNw?.unit || colMap.nwUnit?.unit || "kg";

    let grossKg = Number.isFinite(gwTotVal)
      ? (unitGW === "t" ? gwTotVal * 1000 : unitGW === "lb" ? gwTotVal * 0.453592 : gwTotVal)
      : Number.isFinite(gwUnitVal)
      ? (unitGW === "t" ? gwUnitVal * 1000 * boxes : unitGW === "lb" ? gwUnitVal * 0.453592 * boxes : gwUnitVal * boxes)
      : Number.isFinite(nwTotVal)
      ? (unitNW === "t" ? nwTotVal * 1000 : nwTotVal)
      : Number.isFinite(nwUnitVal)
      ? (unitNW === "t" ? nwUnitVal * 1000 * boxes : nwUnitVal * boxes)
      : NaN;

    let netKg = Number.isFinite(nwTotVal)
      ? (unitNW === "t" ? nwTotVal * 1000 : nwTotVal)
      : Number.isFinite(nwUnitVal)
      ? (unitNW === "t" ? nwUnitVal * 1000 * boxes : nwUnitVal * boxes)
      : grossKg;

    const cbmVal = parseNumber(extractCellFromRow(row, colMap.vol));
    const volume = Number.isFinite(cbmVal) && cbmVal > 0
      ? cbmVal
      : (Number.isFinite(L) && Number.isFinite(W) && Number.isFinite(H) ? L * W * H * boxes : NaN);

    if(!Number.isFinite(grossKg) || !Number.isFinite(volume) || !Number.isFinite(L)) continue;

    records.push({
      desc: description,
      q: quantity,
      boxes: boxes,
      L: Number(L.toFixed(4)),
      W: Number(W.toFixed(4)),
      H: Number(H.toFixed(4)),
      wt: (grossKg / 1000) / quantity,
      gw: (grossKg / 1000) / quantity,
      nw: (netKg / 1000) / quantity,
      volume: Number(volume.toFixed(4)),
      apilable: true,
      acostarse: false,
      sobresalir: false,
      fragil: false,
      peligrosa: false
    });
  }

  const docText = rows.map(r => r.text).join(" ");
  const findTot = (aliases) => {
    const match = new RegExp(`(?:${aliases.join("|")})\\s*[:=]?\\s*([0-9][0-9.,]*)`, "i").exec(docText);
    return match ? parseNumber(match[1]) : NaN;
  };

  const totals = {
    quantity: findTot(["cantidad total", "total quantity", "total pcs", "total piezas"]),
    boxes: findTot(["total de cajas", "total cajas", "total cartons", "total ctns", "total bultos"]),
    net: findTot(["peso neto total", "total nw", "peso neto"]),
    gross: findTot(["peso bruto total", "total gw", "peso bruto", "peso total"]),
    volume: findTot(["volumen total", "volume total", "total cbm", "total m3"])
  };

  return { records, totals };
}

function pdfPatternRecords(lines){
  const records = [];
  for(let i = 0; i < lines.length; i++){
    const line = lines[i];
    if(!line || !/\d/.test(line)) continue;
    if(/^(?:total|subtotal|fecha|invoice|pagina|page|telefono|tel|nit|direccion)\b/i.test(line)) continue;
    
    const dimMatch = /([0-9][0-9.,]*)\s*[x×*]\s*([0-9][0-9.,]*)\s*[x×*]\s*([0-9][0-9.,]*)\s*(mm|cm|m)?(?:\/[^\s]+)?(?:\b|$)/i.exec(line);
    if(!dimMatch) continue;
    
    const rawL = parseNumber(dimMatch[1]);
    const rawW = parseNumber(dimMatch[2]);
    const rawH = parseNumber(dimMatch[3]);
    const explicitUnit = (dimMatch[4] || (Math.max(rawL, rawW, rawH) > 4 ? "cm" : "m")).toLowerCase();
    
    const L = explicitUnit === "mm" ? rawL / 1000 : explicitUnit === "cm" ? rawL / 100 : rawL;
    const W = explicitUnit === "mm" ? rawW / 1000 : explicitUnit === "cm" ? rawW / 100 : rawW;
    const H = explicitUnit === "mm" ? rawH / 1000 : explicitUnit === "cm" ? rawH / 100 : rawH;
    
    let grossKg = NaN;
    const afterDims = line.slice(dimMatch.index + dimMatch[0].length);
    const wtMatch = /(?:peso|weight|gw|gross|bruto)?[\s.:=-]*([0-9][0-9.,]*)\s*(kg|kgs|kilos|t|ton|tons|toneladas|lb|lbs|g)?/i.exec(afterDims)
      || /(?:peso|weight|gw|gross|bruto)[\s.:=-]*([0-9][0-9.,]*)\s*(kg|kgs|kilos|t|ton|tons|toneladas|lb|lbs|g)?/i.exec(line);
      
    if(wtMatch && Number.isFinite(parseNumber(wtMatch[1]))){
      const wtVal = parseNumber(wtMatch[1]);
      const unit = (wtMatch[2] || "kg").toLowerCase();
      grossKg = unit.startsWith("t") ? wtVal * 1000 : unit.startsWith("lb") ? wtVal * 0.453592 : wtVal;
    }
    
    let quantity = 1, boxes = 1;
    const beforeDims = line.slice(0, dimMatch.index);
    const qtyMatches = [...beforeDims.matchAll(/\b([0-9]+)\s*(?:und|unidades|units|pcs|piezas|cajas|boxes|ctns|bultos|pkgs)?\b/gi)];
    if(qtyMatches.length){
      const lastQ = parseInt(qtyMatches[qtyMatches.length - 1][1], 10);
      if(lastQ > 0 && lastQ < 100000){
        quantity = lastQ;
        boxes = lastQ;
      }
    }
    
    const desc = beforeDims.replace(/^[0-9.-]+\s*/, "").replace(/\b[0-9]+\s*(?:und|unidades|units|pcs|piezas|cajas|boxes|ctns|bultos|pkgs)?\s*$/i, "").trim() || `Ítem ${records.length + 1}`;
    const volume = L * W * H * boxes;
    
    if(Number.isFinite(grossKg) && Number.isFinite(volume) && volume > 0){
      records.push({
        desc,
        q: quantity,
        boxes,
        L: Number(L.toFixed(4)),
        W: Number(W.toFixed(4)),
        H: Number(H.toFixed(4)),
        wt: (grossKg / 1000) / quantity,
        gw: (grossKg / 1000) / quantity,
        nw: (grossKg / 1000) / quantity,
        volume: Number(volume.toFixed(4)),
        apilable: true,
        acostarse: false,
        sobresalir: false,
        fragil: false,
        peligrosa: false
      });
    }
  }
  return records;
}

function pdfKeyValueRecord(text){
  const normalized = normalizePdfText(text);
  
  const descMatch = /(?:descripcion(?:\s+de(?:\s+la)?\s+carga)?|producto|mercancia|equipo|carga)[\s.:=-]+([^\n\r,;]+)/i.exec(text);
  const desc = descMatch ? descMatch[1].trim() : "Carga General";
  
  const qtyMatch = /(?:cantidad|unidades|piezas|bultos|cant)[\s.:=-]+([0-9]+)/i.exec(normalized);
  const q = qtyMatch ? parseInt(qtyMatch[1], 10) : 1;
  
  let L = NaN, W = NaN, H = NaN;
  const dimMatch = /([0-9][0-9.,]*)\s*[x×*]\s*([0-9][0-9.,]*)\s*[x×*]\s*([0-9][0-9.,]*)\s*(mm|cm|m)?/i.exec(normalized);
  if(dimMatch){
    const rawL = parseNumber(dimMatch[1]);
    const rawW = parseNumber(dimMatch[2]);
    const rawH = parseNumber(dimMatch[3]);
    const unit = (dimMatch[4] || (Math.max(rawL, rawW, rawH) > 4 ? "cm" : "m")).toLowerCase();
    L = unit === "mm" ? rawL / 1000 : unit === "cm" ? rawL / 100 : rawL;
    W = unit === "mm" ? rawW / 1000 : unit === "cm" ? rawW / 100 : rawW;
    H = unit === "mm" ? rawH / 1000 : unit === "cm" ? rawH / 100 : rawH;
  } else {
    const lMatch = /(?:largo|longitud|length|l)[\s.:=-]+([0-9][0-9.,]*)\s*(mm|cm|m|mts|metros)?/i.exec(normalized);
    const wMatch = /(?:ancho|width|w|a)[\s.:=-]+([0-9][0-9.,]*)\s*(mm|cm|m|mts|metros)?/i.exec(normalized);
    const hMatch = /(?:alto|altura|height|h)[\s.:=-]+([0-9][0-9.,]*)\s*(mm|cm|m|mts|metros)?/i.exec(normalized);
    
    if(lMatch && wMatch && hMatch){
      const parseDim = (m) => {
        const val = parseNumber(m[1]);
        const u = (m[2] || (val > 4 ? "cm" : "m")).toLowerCase();
        return u === "mm" ? val / 1000 : u === "cm" ? val / 100 : val;
      };
      L = parseDim(lMatch);
      W = parseDim(wMatch);
      H = parseDim(hMatch);
    }
  }
  
  let grossKg = NaN;
  const wtMatch = /(?:peso|peso bruto|peso total|weight|gw|bruto)[\s.:=-]+([0-9][0-9.,]*)\s*(kg|kgs|kilos|t|ton|tons|toneladas|lb|lbs|g)?/i.exec(normalized);
  if(wtMatch){
    const wtVal = parseNumber(wtMatch[1]);
    const u = (wtMatch[2] || "kg").toLowerCase();
    grossKg = u.startsWith("t") ? wtVal * 1000 : u.startsWith("lb") ? wtVal * 0.453592 : wtVal;
  }
  
  if(Number.isFinite(L) && Number.isFinite(W) && Number.isFinite(H) && Number.isFinite(grossKg)){
    const volume = L * W * H * q;
    return {
      desc,
      q,
      boxes: q,
      L: Number(L.toFixed(4)),
      W: Number(W.toFixed(4)),
      H: Number(H.toFixed(4)),
      wt: (grossKg / 1000) / q,
      gw: (grossKg / 1000) / q,
      nw: (grossKg / 1000) / q,
      volume: Number(volume.toFixed(4)),
      apilable: true,
      acostarse: false,
      sobresalir: false,
      fragil: false,
      peligrosa: false
    };
  }
  return null;
}

function pdfTotals(text){
 const find=(aliases)=>{const match=new RegExp(`(?:${aliases.join("|")})\\s*[:=]?\\s*([0-9][0-9.,]*)\\s*(kg|cbm|m3|m³|pcs|piezas|cajas)?`,"i").exec(text);return match?parseNumber(match[1]):NaN};
 return {quantity:find(["cantidad total","total quantity","total pcs"]),boxes:find(["total de cajas","total cajas","total cartons","total ctns"]),net:find(["peso neto total","total nw"]),gross:find(["peso bruto total","total gw"]),volume:find(["volumen total","volume total","total cbm"])};
}

function comparePdfTotals(expected,actual){
 const checks=[
  ["cantidad",expected.quantity,actual.quantity,0],
  ["cajas",expected.boxes,actual.boxes,0],
  ["peso neto",expected.net,actual.net*1000,1.0],
  ["peso bruto",expected.gross,actual.weight*1000,1.0],
  ["volumen",expected.volume,actual.volume,0.1]
 ];
 return checks.filter(([,documentValue,calculated,tolerance])=>Number.isFinite(documentValue)&&Number.isFinite(calculated)&&Math.abs(documentValue-calculated)>tolerance).map(([name,documentValue,calculated,tolerance])=>({name,documentValue,calculated,tolerance,difference:calculated-documentValue}));
}

function pdfRecord(text,index){
 if(!text||typeof text!=="string")return null;
 const patternResults = pdfPatternRecords([text]);
 if(patternResults.length){
   return { record: patternResults[0], missing: [], warnings: [] };
 }
 const kv = pdfKeyValueRecord(text);
 if(kv){
   return { record: kv, missing: [], warnings: [] };
 }
 return null;
}

function prepareIncompleteImport(result){
 const record=result.record;
 $("pDesc").value=record.desc;
 $("pCant").value=Number.isFinite(record.q)?record.q:"";
 $("pL").value=Number.isFinite(record.L)?record.L:"";
 $("pA").value=Number.isFinite(record.W)?record.W:"";
 $("pH").value=Number.isFinite(record.H)?record.H:"";
 $("pPeso").value=Number.isFinite(record.wt)?record.wt:"";
 $("pUnidad").value="Metros";$("pPesoUnidad").value="toneladas";calcPiecePreview();
 $("excelHelp").textContent=`PDF leído parcialmente. Completa: ${result.missing.join(", ")}. Los valores encontrados quedaron en el formulario y no se agregó una referencia incompleta.`;
}

async function ocrPdfPages(documentPdf){
 if(typeof Tesseract==="undefined")return [];
 const lines=[];
 for(let pageNumber=1;pageNumber<=documentPdf.numPages;pageNumber++){
  const page=await documentPdf.getPage(pageNumber);
  const viewport=page.getViewport({scale:1.6});
  const canvas=document.createElement("canvas");
  canvas.width=viewport.width;canvas.height=viewport.height;
  await page.render({canvasContext:canvas.getContext("2d"),viewport}).promise;
  const result=await Tesseract.recognize(canvas,"spa+eng");
  lines.push(...String(result.data.text||"").split(/\r?\n/).filter(Boolean));
 }
 return lines;
}

async function importarPDF(file){
 if(typeof pdfjsLib==="undefined")throw new Error("El lector PDF todavía no está disponible.");

 // 1. LIMPIEZA COMPLETA: Cada importación inicia 100% desde cero
 pieces = [];
 lastAnalysis = null;
 editingIndex = -1;
 if($("pDesc")) $("pDesc").value = "";
 if($("pCant")) $("pCant").value = "";
 if($("pL")) $("pL").value = "";
 if($("pA")) $("pA").value = "";
 if($("pH")) $("pH").value = "";
 if($("pPeso")) $("pPeso").value = "";
 renderPieces();
 updateDashboard();

 pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
 const documentPdf=await pdfjsLib.getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise;
 const lines=[], items=[];
 for(let pageNumber=1;pageNumber<=documentPdf.numPages;pageNumber++){
  const page=await documentPdf.getPage(pageNumber);
  const content=await page.getTextContent();
  const pageOffset=(pageNumber-1)*2000;
  (content.items||[]).forEach(item=>{
   if(!String(item.str||"").trim())return;
   const transform=item.transform?[...item.transform]:[1,0,0,1,0,0];
   transform[5]=(transform[5]||0)-pageOffset;
   items.push({
    ...item,
    str:String(item.str||""),
    transform,
    pageNumber
   });
  });
  lines.push(...pdfLines(content.items));
 }

 let text=normalizePdfText(lines.join(" "));
 let table=pdfTableRecords(items);
 let records=table.records;

 // Strategy 2: Pattern-based extraction across lines
 if(!records.length && lines.length > 0){
  records = pdfPatternRecords(lines);
 }

 // Strategy 3: Key-Value Document extraction
 if(!records.length && text.length > 0){
  const kv = pdfKeyValueRecord(lines.join("\n"));
  if(kv) records = [kv];
 }

 // Strategy 4: OCR Fallback if document has no selectable text
 if(!records.length && (text.length < 30 || lines.length < 3)){
  $("excelHelp").textContent="PDF escaneado detectado. Intentando reconocer el texto con OCR, esto puede tardar unos segundos...";
  const ocrLines = await ocrPdfPages(documentPdf);
  if(ocrLines.length){
   lines.push(...ocrLines);
   text=normalizePdfText(lines.join(" "));
   records = pdfPatternRecords(ocrLines);
   if(!records.length){
    const kv = pdfKeyValueRecord(ocrLines.join("\n"));
    if(kv) records = [kv];
   }
  }
 }

 let importadas=0;
 if(records.length){
  pieces=[];
  records.forEach(record=>{
    pieces.push({...record,apilable:true,acostarse:false,sobresalir:false,fragil:false,peligrosa:false});
    importadas++;
  });
 }

 renderPieces();
 updateDashboard();

 const importedTotals=records.reduce((a,record)=>{
   a.quantity+=Number(record.q)||0;
   a.boxes+=Number(record.boxes)||0;
   a.net+=(Number(record.nw)||0)*(Number(record.q)||0);
   a.weight+=(Number(record.gw??record.wt)||0)*(Number(record.q)||0);
   a.volume+=Number(record.volume)||0;
   return a;
 },{quantity:0,boxes:0,net:0,weight:0,volume:0});

 const mismatches=comparePdfTotals(table.totals||{},importedTotals);

 // MODO DEBUG estructurado en consola
 const debugTable = [
   { "Métrica": "Referencias", "Declarado PDF": "-", "Calculado": importadas, "Diferencia": "-", "Estado": "OK" },
   { "Métrica": "Piezas (Und)", "Declarado PDF": table.totals?.quantity ?? "N/D", "Calculado": importedTotals.quantity, "Diferencia": Number.isFinite(table.totals?.quantity) ? (importedTotals.quantity - table.totals.quantity) : "-", "Estado": (!Number.isFinite(table.totals?.quantity) || importedTotals.quantity === table.totals.quantity) ? "OK" : "REVISAR" },
   { "Métrica": "Cajas / Bultos", "Declarado PDF": table.totals?.boxes ?? "N/D", "Calculado": importedTotals.boxes, "Diferencia": Number.isFinite(table.totals?.boxes) ? (importedTotals.boxes - table.totals.boxes) : "-", "Estado": (!Number.isFinite(table.totals?.boxes) || importedTotals.boxes === table.totals.boxes) ? "OK" : "REVISAR" },
   { "Métrica": "Peso Neto (kg)", "Declarado PDF": table.totals?.net ? (table.totals.net).toFixed(2) : "N/D", "Calculado": (importedTotals.net * 1000).toFixed(2), "Diferencia": Number.isFinite(table.totals?.net) ? ((importedTotals.net * 1000) - table.totals.net).toFixed(2) + " kg" : "-", "Estado": (!Number.isFinite(table.totals?.net) || Math.abs((importedTotals.net * 1000) - table.totals.net) <= 1.0) ? "OK" : "REVISAR" },
   { "Métrica": "Peso Bruto (kg)", "Declarado PDF": table.totals?.gross ? (table.totals.gross).toFixed(2) : "N/D", "Calculado": (importedTotals.weight * 1000).toFixed(2), "Diferencia": Number.isFinite(table.totals?.gross) ? ((importedTotals.weight * 1000) - table.totals.gross).toFixed(2) + " kg" : "-", "Estado": (!Number.isFinite(table.totals?.gross) || Math.abs((importedTotals.weight * 1000) - table.totals.gross) <= 1.0) ? "OK" : "REVISAR" },
   { "Métrica": "Volumen (m³)", "Declarado PDF": table.totals?.volume ? (table.totals.volume).toFixed(2) : "N/D", "Calculado": (importedTotals.volume).toFixed(2), "Diferencia": Number.isFinite(table.totals?.volume) ? (importedTotals.volume - table.totals.volume).toFixed(2) + " m³" : "-", "Estado": (!Number.isFinite(table.totals?.volume) || Math.abs(importedTotals.volume - table.totals.volume) <= 0.1) ? "OK" : "REVISAR" }
 ];

 console.group(`🔍 [DEBUG PDF] Archivo: ${file.name}`);
 console.table(debugTable);
 console.groupEnd();

 if(importadas){
  if(mismatches.length){
    alert(`Alerta: los datos calculados no coinciden exactamente con los totales del PDF (${mismatches.map(item=>`${item.name}: ${item.difference>0?"+":""}${item.difference.toFixed(2)}`).join(", ")}). Se conservaron los datos individuales extraídos.`);
  }
  const statusMsg = `PDF "${file.name}" procesado: ${importadas} ref(s) | ${importedTotals.boxes} cajas | ${(importedTotals.weight).toFixed(2)} t (${(importedTotals.weight*1000).toFixed(1)} kg) | ${importedTotals.volume.toFixed(2)} m³`;
  $("excelHelp").textContent = statusMsg;
  alert(statusMsg);
 } else {
  const isScanned = (!text || text.length < 30) && !lines.length;
  const msg = isScanned
    ? "El PDF parece ser un documento escaneado o imagen sin capa de texto seleccionable. Ingresa los datos manualmente o conviértelo a un PDF digital."
    : "No pudimos identificar tablas de carga con dimensiones (Largo x Ancho x Alto) y pesos en el archivo. Verifica el formato del PDF o ingresa las piezas manualmente.";
  $("excelHelp").textContent = msg;
  alert(msg);
 }
}
function importarArchivo(evt){
 const file=evt.target.files[0]; if(!file)return;
 if(file.name.toLowerCase().endsWith(".pdf")){importarPDF(file).catch(()=>alert("No pudimos leer el PDF. Verifica que contenga texto seleccionable y datos de dimensiones, peso y cantidad."));evt.target.value="";return}
 importarExcel(evt);
}
function importarExcel(evt){
 const file=evt.target.files[0]; if(!file)return;
 const reader=new FileReader();
 reader.onload=function(e){
  try{
    const data=new Uint8Array(e.target.result);
    const wb=XLSX.read(data,{type:"array"});
    const aliases=["largo","long","length","longitud","ancho","width","wide","alto","height","altura","peso","weight","kg","cantidad","qty","quantity","unidades","cant","cajas","ctns","cartons","size","dimension","dimensiones","cbm","gw","nw"];
    
    // Find best sheet
    let bestSheet=wb.Sheets[wb.SheetNames[0]];
    let bestMatrix=[];
    let bestScore=-1;
    for(const sName of wb.SheetNames){
      const currentSheet=wb.Sheets[sName];
      const currentMatrix=XLSX.utils.sheet_to_json(currentSheet,{header:1,defval:""});
      const score=currentMatrix.slice(0,25).reduce((acc,row)=>acc+row.filter(cell=>aliases.some(alias=>normHeader(cell).includes(normHeader(alias)))).length,0);
      if(score>bestScore){bestScore=score;bestSheet=currentSheet;bestMatrix=currentMatrix;}
    }
    const matrix=bestMatrix;
    if(!matrix.length){alert("El archivo no tiene hojas con datos tabulares.");return;}
    
    const headerIndex=matrix.slice(0,25).reduce((best,row,index)=>{const score=row.filter(cell=>aliases.some(alias=>normHeader(cell).includes(normHeader(alias)))).length;return score>best.score?{index,score}:best},{index:0,score:0}).index;
    const headers=matrix[headerIndex]||[];
    const headerText=headers.map(String).join(" ");
    const rows=matrix.slice(headerIndex+1).filter(row=>row.some(value=>String(value).trim()!=="")).map(row=>Object.fromEntries(headers.map((header,index)=>[header,row[index]??""])));
    if(!rows.length){alert("El archivo no contiene filas de datos.");return;}
    
    let importadas=0, omitidas=0, faltantes={largo:0,ancho:0,alto:0,peso:0,cantidad:0};
    pieces=[];
    rows.forEach(row=>{
      const keys={}; Object.keys(row).forEach(k=>keys[normHeader(k)]=row[k]);
      const get=(...names)=>importValue(keys,names);
      
      const descVal=get("descripcion","referencia","item","producto","description","nombre","material","codigo","code","detalle");
      const desc=descVal?String(descVal).trim():`Ítem ${pieces.length+importadas+1}`;
      
      // Skip summary / total rows
      if(/^(?:total|subtotal|totales|suma|sum|resumen)\b/i.test(normHeader(desc))||/^(?:total|subtotal)\b/i.test(normHeader(Object.values(row)[0])))return;
      
      const cantValue=parseNumber(get("cantidad","cant","und","unidades","units","quantity","qty","pcs","piezas"));
      const boxesValue=parseNumber(get("cajas","cartons","ctns","boxes","bultos","paquetes"));
      const cant=Number.isFinite(cantValue)&&cantValue>0?cantValue:Number.isFinite(boxesValue)&&boxesValue>0?boxesValue:1;
      const boxCount=Number.isFinite(boxesValue)&&boxesValue>0?boxesValue:Number.isFinite(cantValue)&&cantValue>0?cantValue:1;
      
      let L=parseNumber(get("largo","long","longitud","length","l"));
      let W=parseNumber(get("ancho","width","wide","w","a"));
      let H=parseNumber(get("alto","altura","height","h"));
      
      // Check combined dimensions if individual columns are missing
      if(!Number.isFinite(L)||!Number.isFinite(W)||!Number.isFinite(H)){
        const dimStr=String(get("dimensiones","dimension","size","medidas","medida","tamano","lxwxh","sizecbm","cbm")||"");
        const parsedDims=findPdfDimensions(dimStr);
        if(parsedDims){
          L=parsedDims.L;
          W=parsedDims.W;
          H=parsedDims.H;
        }
      }
      
      // Weights
      const gwTotal=parseNumber(get("pesobrutototal","totalgw","grosstotal","gwtotal","totalweight","pesototal"));
      const nwTotal=parseNumber(get("pesonetototal","totalnw","nettotal","nwtotal"));
      const gwUnit=parseNumber(get("pesobruto","grossweight","gw","pesounitario","pesou","peso","weight","kg","kilos"));
      const nwUnit=parseNumber(get("pesoneto","netweight","nw"));
      
      let pesoTotalKg=Number.isFinite(gwTotal)?gwTotal:Number.isFinite(gwUnit)?gwUnit*(Number.isFinite(boxesValue)?boxesValue:cant):Number.isFinite(nwTotal)?nwTotal:Number.isFinite(nwUnit)?nwUnit*(Number.isFinite(boxesValue)?boxesValue:cant):NaN;
      
      const unidad=String(get("unidad","unidadmedida","unidaddemedida","dimensionunit")||(/\bmm\b/i.test(headerText)?"mm":/\bmetros?\b|\(m\)/i.test(headerText)?"m":"cm")).toLowerCase();
      const unidadPeso=String(get("unidadpeso","unidaddepeso","undpeso","weightunit")||(/\blb?s\b/i.test(headerText)?"lb":/\bton(?:eladas?)?\b/i.test(headerText)?"t":"kg")).toLowerCase();
      
      const missing=[!L&&"largo",!W&&"ancho",!H&&"alto",!Number.isFinite(pesoTotalKg)&&"peso"].filter(Boolean);
      if(missing.length){missing.forEach(field=>faltantes[field]++);omitidas++;return;}
      
      if(unidad.startsWith("mm")){L/=1000;W/=1000;H/=1000;}else if(!unidad.startsWith("m")){L/=100;W/=100;H/=100;}
      if(unidadPeso.startsWith("lb")){pesoTotalKg*=0.00045359237*1000;}else if(unidadPeso.startsWith("t")){pesoTotalKg*=1000;}
      
      const wtUnitTonnes=(pesoTotalKg/1000)/cant;
      const cbmVal=parseNumber(get("cbm","volumen","volume","m3","m³"));
      const vol=Number.isFinite(cbmVal)?cbmVal:(L*W*H*boxCount);
      
      pieces.push({
        desc:String(desc),
        q:cant,
        L:Number(L.toFixed(4)),
        W:Number(W.toFixed(4)),
        H:Number(H.toFixed(4)),
        wt:wtUnitTonnes,
        nw:wtUnitTonnes,
        gw:wtUnitTonnes,
        boxes:boxCount,
        volume:Number(vol.toFixed(4)),
        apilable:true,
        acostarse:false,
        sobresalir:false,
        fragil:false,
        peligrosa:false
      });
      importadas++;
    });
    
    renderPieces();
    updateDashboard();
    const missingSummary=Object.entries(faltantes).filter(([,count])=>count).map(([field,count])=>`${field}: ${count}`).join(", ");
    const warning=matrix[headerIndex].some(cell=>/cm|mm|kg/i.test(String(cell)))?"":" Unidades asumidas: cm y kg.";
    alert(`Importación completa: ${importadas} referencia(s) agregada(s).${warning}${omitidas?` ${omitidas} fila(s) omitida(s) por datos incompletos${missingSummary?` (${missingSummary})`:""}.`:""}`);
  }catch(err){
    alert("No pudimos leer el archivo. Verifica que sea un Excel o CSV válido y que incluya largo, ancho, alto y peso.");
  }
  evt.target.value="";
 };
 reader.readAsArrayBuffer(file);
}

function specialCompatibility(v,t){
 const reqClosed=$("cerrado")?.value==="Sí", reqTemp=$("temp")?.value==="Sí", reqDanger=$("peligrosa")?.value==="Sí"||pieces.some(p=>p.peligrosa), reqProject=$("tipoCarga")?.value==="Proyecto"||$("equipo")?.value!=="No", over=$("sobredim")?.value==="Sí";
 if(reqTemp && !/refrigerado/i.test(v.body) && v.name!=="Furgón refrigerado") return false;
 if(reqClosed && !/Furgón|furgón|carpado/i.test(v.body)) return false;
 if(reqDanger && /4 x 4|Van|NHR|NPR/i.test(v.name)) return false;
 if(over && !/cama|modular|plataforma|extensible|mula|Minimula/i.test(v.name)) return false;
 if(reqProject && !/plataforma|cama|modular|Mula|Minimula|Doble troque/i.test(v.name)) return false;
 if(!over && !reqProject && /cama baja|modular|tolva|tanque|niñera/i.test(v.name+" "+v.body)) return false;
 return true;
}
function containerCompatibility(v){
 if($("tipoCarga")?.value!=="Contenedor") return true;
 const tam=$("contTam")?.value;
 if(tam==="20'" && !/20|Minimula|Mula|Doble|600/i.test(v.cargo+" "+v.name)) return false;
 if((tam==="40'"||tam==="40 HC") && !/40|Mula|portacontenedor/i.test(v.cargo+" "+v.name)) return false;
 return /Portacontenedor|Minimula|Mula|Doble troque|600 sencillo/i.test(v.name+" "+v.body);
}
function analyzeVehicle(v,t,margin=0.10){
 if(v.cap===null||v.cap<=0)return null;
 const needWeight=t.weight*(1+margin);
 const needVol=t.volume*(1+margin);
 const dimsOk=v.L===null|| (t.maxL<=v.L && t.maxW<=v.W && t.maxH<=v.H);
 const weightOk=needWeight<=v.cap;
 const volOk=v.vol===null || needVol<=v.vol;
 const special=specialCompatibility(v,t)&&containerCompatibility(v);
 const maxStackH=Math.max(1.0,Math.min(v.H||2.0,1.8));
 const effectiveArea=pieces.some(p=>p.apilable)||pieces.every(p=>p.H<0.8)?(needVol/maxStackH):(t.area*(1+margin));
 const areaApprox=v.L&&v.W?effectiveArea<=(v.L*v.W):true;
 const compatible=weightOk&&volOk&&dimsOk&&special&&areaApprox;
 const wOcc=v.cap? t.weight/v.cap*100:0;
 const vOcc=v.vol? t.volume/v.vol*100:0;
 const score=compatible ? (v.cap*0.45+(v.vol||999)*0.25+(v.L||99)*(v.W||99)*0.15+vOcc*0.1+wOcc*0.05) : Infinity;
 return {v,compatible,wOcc,vOcc,dimsOk,weightOk,volOk,special,areaApprox,score};
}
function analyzeSet(){
 const t=totals(); if(!hasCargo())return {t,options:[],best:null};
 const normal=vehicles.map(v=>analyzeVehicle(v,t)).filter(Boolean);
 normal.sort((a,b)=>a.score-b.score);
 const compatible=normal.filter(x=>x.compatible);
 if(compatible.length)return {t,options:normal,best:compatible[0]};
 // If no single vehicle, find minimum combination using repeated vehicles for scalable standard vehicles.
 const candidates=vehicles.filter(v=>v.cap>0 && v.name!=="Cama baja / tolva" && v.name!=="Modular").map(v=>{
   const byWeight=Math.ceil(t.weight/(v.cap*0.9));
   const byVol=v.vol?Math.ceil(t.volume/(v.vol*0.9)):1;
   const count=Math.max(1,byWeight,byVol);
   const dims=v.L===null || (t.maxL<=v.L&&t.maxW<=v.W&&t.maxH<=v.H);
   const special=specialCompatibility(v,t)&&containerCompatibility(v);
   return {v,count,dims,special,wOcc:(t.weight/(v.cap*count))*100,vOcc:v.vol?(t.volume/(v.vol*count))*100:0,score:count*100+v.cap+(v.vol||0)/10};
 }).filter(x=>x.dims&&x.special).sort((a,b)=>a.score-b.score);
 return {t,options:normal,best:candidates.length?{...candidates[0],multi:true}:null};
}
function validation(a){
 const errs=[], warns=[];
 if(!a.best){errs.push("No existe un vehículo compatible con los datos registrados. Revisa peso, dimensiones, volumen y condiciones especiales.");return {level:"red",errs,warns}}
 if(a.best.multi) warns.push(`Se requieren aproximadamente ${a.best.count} unidades de ${a.best.v.name}. La combinación debe confirmarse con el transportador.`);
 const t=a.t, v=a.best.v;
 const wo=a.best.wOcc, vo=a.best.vOcc;
 if(wo>90||vo>90)warns.push("Ocupación superior al 90 %: se recomienda confirmar distribución y disponibilidad.");
 if(wo>100||vo>100)errs.push("La carga supera la capacidad estimada de la combinación.");
 if(!a.best.dimsOk)errs.push("Una o más piezas exceden las dimensiones internas disponibles.");
 if(t.area>0 && v.L&&v.W && t.area/(v.L*v.W)>1.0 && pieces.some(p=>!p.apilable && p.H>=0.8))warns.push("El área de piso está cercana al límite. El cubicaje por sí solo no garantiza que los pallets/piezas quepan.");
 if(pieces.some(p=>!p.apilable && p.H>=0.8))warns.push("Hay carga no apilable de gran altura. La distribución real del piso debe validarse.");
 if($("sobredim")?.value==="Sí")warns.push("Carga sobredimensionada: puede requerir permisos, escolta o revisión especializada.");
 if($("peligrosa")?.value==="Sí"||pieces.some(p=>p.peligrosa))warns.push("Mercancía peligrosa: validar ONU, clase, documentación y vehículo autorizado.");
 if($("temp")?.value==="Sí")warns.push("Se requiere control de temperatura. Confirmar rango y equipo refrigerado.");
 return {level:errs.length?"red":warns.length?"yellow":"green",errs,warns}
}
function analizar(){
 const currentTotals=totals();
 console.info("Analizador recibe",{referencias:pieces.length,unidades:pieces.reduce((sum,p)=>sum+(Number(p.q)||0),0),cajas:pieces.reduce((sum,p)=>sum+(Number(p.boxes)||0),0),pesoNetoKg:(currentTotals.net||0)*1000,pesoBrutoKg:(currentTotals.weight||0)*1000,volumenM3:currentTotals.volume||0});
 const a=analyzeSet(); lastAnalysis=a; const val=a.best?validation(a):{level:"blue",errs:["Agrega al menos una pieza."],warns:[]};
 $("alerts").innerHTML=[...val.errs.map(x=>`<div class="alert red">⚠ ${esc(x)}</div>`),...val.warns.map(x=>`<div class="alert yellow">⚠ ${esc(x)}</div>`),(!val.errs.length&&!val.warns.length?`<div class="alert green">✓ La combinación cumple peso, volumen, dimensiones y condiciones registradas.</div>`:"")].join("");
 renderMeasuresTable();
 if(!a.best){$("recommendation").innerHTML="";return}
 const b=a.best,v=b.v, badge=val.level;
 $("recommendation").innerHTML=`<div class="recommend">
 <div class="rec-top"><div><div class="eyebrow">RECOMENDACIÓN ${b.multi?"DE COMBINACIÓN":"PRINCIPAL"}</div><div class="rec-name">${esc(v.name)} ${b.multi?`× ${b.count}`:"× 1"}</div><div style="color:#9ba8b9;font-size:12px;margin-top:4px">${esc(v.body)} · ${esc(v.cargo)}</div></div><span class="badge ${badge}">${badge==="green"?"VERDE":badge==="yellow"?"AMARILLO":"ROJO"}</span></div>
 <div class="bars"><div class="barline"><span>Ocupación peso</span><div class="bar"><div class="fill" style="width:${Math.min(100,b.wOcc)}%"></div></div><b>${b.wOcc.toFixed(1)}%</b></div><div class="barline"><span>Ocupación volumen</span><div class="bar"><div class="fill" style="width:${Math.min(100,b.vOcc||0)}%"></div></div><b>${(b.vOcc||0).toFixed(1)}%</b></div></div>
 <div class="rec-grid"><div class="rec-stat"><span>Peso bruto</span><b>${(a.t.weight*1000).toFixed(2)} kg</b></div><div class="rec-stat"><span>Peso neto</span><b>${((a.t.net||0)*1000).toFixed(2)} kg</b></div><div class="rec-stat"><span>Volumen total</span><b>${a.t.volume.toFixed(2)} m³</b></div><div class="rec-stat"><span>Referencias</span><b>${a.t.refs}</b></div><div class="rec-stat"><span>Dimensión máx.</span><b>${a.t.maxL.toFixed(2)} × ${a.t.maxW.toFixed(2)} × ${a.t.maxH.toFixed(2)} m</b></div></div>
 <div class="alt-list"><b style="font-size:12px;color:#b9c3d1">Alternativas</b>${a.options.filter(x=>x.compatible&&x.v.name!==v.name).slice(0,3).map(x=>`<div class="alt"><strong>${esc(x.v.name)}</strong><span>1 vehículo</span><span>${x.wOcc.toFixed(1)}% peso</span><span>${x.v.vol?x.vOcc.toFixed(1)+"% volumen":"Vol. ND"}</span></div>`).join("")||'<div class="alert blue">No hay otra alternativa individual que cumpla todos los criterios.</div>'}</div>
 </div>`;
 generarCotizacion();
}
function money(v){ if(isNaN(v))v=0; return "$ "+Number(v).toLocaleString("es-CO",{minimumFractionDigits:0,maximumFractionDigits:0}); }
function exportarExcel(){
 if(typeof XLSX==="undefined"){alert("No está disponible el exportador Excel.");return}
 const rows=isContainer()?[{
  Descripción:`Contenedor ${$("contTam").value}`,
  Cantidad:Math.max(1,num("contCant")),
  Largo:"",Ancho:"",Alto:"",
  Unidad:"m",
  Peso:num("contMerc")+num("contTara"),
  "Unidad de peso":"kg"
 }]:pieces.map(piece=>({
  Descripción:piece.desc,Cantidad:piece.q,Largo:piece.L,Ancho:piece.W,Alto:piece.H,
  Unidad:"m",Peso:piece.wt*1000,"Unidad de peso":"kg"
 }));
 if(!rows.length){alert("No hay datos de carga para exportar.");return}
 const sheet=XLSX.utils.json_to_sheet(rows);
 const workbook=XLSX.utils.book_new();XLSX.utils.book_append_sheet(workbook,sheet,"Carga");
 XLSX.writeFile(workbook,"logitrading-carga.xlsx");
}
function generarCotizacion(guardar=false){
  console.log("🔵 generarCotizacion() llamada con guardar="+guardar);
  // Siempre recalculamos para que la cotización use los últimos datos ingresados.
  if(!hasCargo()){
    console.log("❌ No hay carga registrada");
    $("quote").innerHTML='<div class="empty">⚠ Completa los datos básicos de la carga antes de generar la cotización.</div>';
    return;
  }
  const a=analyzeSet();
  lastAnalysis=a;
  if(!a.best){
    console.log("❌ No se encontró vehículo compatible");
    $("quote").innerHTML='<div class="alert red">⚠ No se encontró un vehículo compatible. Revisa peso, volumen, dimensiones y condiciones especiales.</div>';
    return;
  }
  console.log("✅ Vehículo encontrado:", a.best.v.name);
  const op=$("operacion").value, mod=$("modalidad").value, serv=$("servicio").value;
  const val=validation(a);
  const fecha=$("fecha").value ? new Date($("fecha").value).toLocaleString("es-CO") : "Pendiente";

  const venta=num("vVenta"), costo=num("vCosto"), sello=num("vSello"), devol=num("vDevolucion"), otros=num("vOtros");
  let utilidad=$("vUtilidad").value!==""?num("vUtilidad"):(venta-costo-sello-devol-otros);
  const totalCotizado = venta || (costo+sello+devol+otros+Math.max(0,utilidad));
  const margenPct = venta ? (utilidad/venta*100) : 0;

  $("quote").innerHTML=`<div class="quote-head executive-head"><div class="quote-brand"><img src="assets/logitrading-logo.png?v=4" alt="Logitrading" class="quote-logo"><div><div class="eyebrow">RESUMEN EJECUTIVO</div><h2>Cotización de transporte</h2><div class="quote-meta">${esc(op)} · ${esc(mod)} · ${esc(serv)} · ${esc(fecha)}</div></div></div><span class="badge ${val.level}">${val.level.toUpperCase()}</span></div>
  <div class="final-recommendation">
    <div class="final-rec-title"><span>VEHÍCULO RECOMENDADO</span><b>${val.level==="green"?"✓ MEJOR AJUSTE":val.level==="yellow"?"⚠ REVISAR ANTES DE COTIZAR":"✕ REVISIÓN NECESARIA"}</b></div>
    <div class="final-rec-body">
      <div class="final-rec-image">${vehicleSvg(a.best.v)}</div>
      <div class="final-rec-main">
        <div class="final-rec-name">${esc(a.best.v.name)} <small>× ${a.best.multi?a.best.count:1}</small></div>
        <div class="final-rec-meta">${esc(a.best.v.body)} · ${esc(a.best.v.cargo)}</div>
        <div class="final-rec-grid">
          <div><span>Capacidad útil</span><strong>${a.best.v.cap===null?"N/D":a.best.v.cap+" t"}</strong></div>
          <div><span>Volumen útil</span><strong>${a.best.v.vol===null?"N/D":a.best.v.vol+" m³"}</strong></div>
          <div><span>Ocupación peso</span><strong>${a.best.wOcc.toFixed(1)}%</strong></div>
          <div><span>Ocupación volumen</span><strong>${(a.best.vOcc||0).toFixed(1)}%</strong></div>
        </div>
      </div>
    </div>
  </div>
  <div class="quote-section"><div class="quote-section-title">Detalles del servicio</div><table class="service-details"><tr><th>Ruta</th><td>${esc($("origen").value||"Pendiente")} → ${esc($("destino").value||"Pendiente")}</td></tr><tr><th>Recogida</th><td>${esc($("recogida").value||"Pendiente")}</td></tr><tr><th>Destino</th><td>${esc($("destino").value||"Pendiente")}</td></tr><tr><th>Fecha requerida</th><td>${esc(fecha)}</td></tr><tr><th>Tipo de carga</th><td>${esc($("tipoCarga").value||"Pendiente")}</td></tr><tr><th>Carga</th><td>Peso bruto: ${(a.t.weight*1000).toFixed(2)} kg · Peso neto: ${((a.t.net||0)*1000).toFixed(2)} kg · ${a.t.volume.toFixed(2)} m³ · ${a.t.area.toFixed(2)} m² · ${pieces.length} referencias</td></tr><tr><th>Dimensión máxima</th><td>${a.t.maxL.toFixed(2)} × ${a.t.maxW.toFixed(2)} × ${a.t.maxH.toFixed(2)} m</td></tr><tr><th>Requerimientos</th><td>${requirements()}</td></tr></table></div>

  <div class="final-recommendation quote-values" style="margin-top:18px">
    <div class="final-rec-title"><span>VALORES DE LA COTIZACIÓN</span><b>${esc($("vObs").value||"")}</b></div>
    <table style="margin-top:0">
      <tr><th>Valor de venta (flete cliente)</th><td>${money(venta)}</td></tr>
      <tr><th>Costo transportador</th><td>${money(costo)}</td></tr>
      <tr><th>Sello satelital / seguridad</th><td>${money(sello)}</td></tr>
      <tr><th>Devolución de vacío</th><td>${money(devol)}</td></tr>
      <tr><th>Otros cargos</th><td>${money(otros)}</td></tr>
      <tr><th>Utilidad neta</th><td>${money(utilidad)} ${venta?`(${margenPct.toFixed(1)}% sobre venta)`:""}</td></tr>
      <tr class="quote-total"><th><b>TOTAL COTIZADO AL CLIENTE</b></th><td><b>${money(totalCotizado)}</b></td></tr>
    </table>
  </div>

  <div style="margin-top:13px;color:#8f9bad;font-size:11px">Nota comercial: recomendación preliminar. Confirmar vehículo real, disponibilidad, ruta, restricciones, distribución física, permisos y tarifa antes de emitir la oferta definitiva.</div>`;
  if(guardar){
    console.log("💾 Guardando cotización...");
    guardarCotizacion(a,totalCotizado);
  }
}
function imprimirCotizacion(){
  showPanel(7);
  generarCotizacion();
  setTimeout(()=>window.print(),150);
}
function requirements(){
 const r=[]; if($("cerrado").value==="Sí")r.push("carrocería cerrada"); if($("satelital").value==="Sí")r.push("sello satelital"); if($("escolta").value==="Sí")r.push("escolta"); if($("equipo").value!=="No")r.push($("equipo").value); if($("temp").value==="Sí")r.push("temperatura controlada"); if($("peligrosa").value==="Sí"||pieces.some(p=>p.peligrosa))r.push("mercancía peligrosa"); if($("sobredim").value==="Sí")r.push("sobredimensión"); return r.join(", ")||"Sin requerimientos especiales registrados";
}

function vehicleSvg(v){
  const n = (v.name||"").toLowerCase();
  let type = "truck";
  if(n.includes("4 x 4") || n.includes("van") || n.includes("nhr") || n.includes("npr") || n.includes("nqr")) type="light";
  else if(n.includes("turbo") || n.includes("600")) type="box";
  else if(n.includes("doble") || n.includes("sencillo")) type="medium";
  else if(n.includes("minimula") || n==="mula") type="semi";
  else if(n.includes("portacontenedor")) type="container";
  else if(n.includes("tanque") || n.includes("niñera")) type="tank";
  else if(n.includes("tolva")) type="hopper";
  else if(n.includes("cama baja") || n.includes("cama alta") || n.includes("plataforma") || n.includes("modular")) type="flat";
  else if(n.includes("refrigerado")) type="reefer";

  const id = ('veh'+Math.random().toString(36).slice(2,8));
  const colors = {
    light:['#f7fafc','#dbe7f3','#f59a2f'], box:['#eef3f8','#9eb2c8','#f59a2f'],
    medium:['#edf3f8','#7890aa','#f59a2f'], semi:['#f4f7fa','#647d97','#ff9d2e'],
    container:['#eaf2f8','#315b7a','#f59a2f'], tank:['#f2f5f8','#8a98a8','#f59a2f'],
    hopper:['#f1f5f8','#667b90','#f59a2f'], flat:['#f4f6f8','#60768c','#f59a2f'],
    reefer:['#ffffff','#c9d8e6','#37a7e8'], truck:['#f1f5f8','#71869a','#f59a2f']
  }[type];
  const [light, dark, accent] = colors;
  const bg = `url(#${id}bg)`;
  const wheel = (x,y,r=5)=>`<circle cx="${x}" cy="${y}" r="${r+2}" fill="#18212c" opacity=".35"/><circle cx="${x}" cy="${y}" r="${r}" fill="#111820" stroke="#e7edf3" stroke-width="1.6"/><circle cx="${x}" cy="${y}" r="2" fill="#8795a3"/>`;
  const cab = `<path d="M12 49h9l5-18q1-4 5-4h16v22h-4" fill="${dark}" stroke="#e7edf3" stroke-width="1.4"/>
    <path d="M27 31h14l4 14H25z" fill="url(#${id}glass)" stroke="#f6b35b" stroke-width="1.2"/>
    <path d="M29 33h10l2 9H27z" fill="#bfe4f5" opacity=".92"/>
    <path d="M16 48h6M47 48h7" stroke="${accent}" stroke-width="2.5" stroke-linecap="round"/>
    ${wheel(32,51,5)}${wheel(66,51,5)}`;
  let body='';
  if(type==='light') body=`<rect x="49" y="32" width="30" height="17" rx="3" fill="url(#${id}body)" stroke="#e7edf3" stroke-width="1.4"/><path d="M53 35h22v11H53z" fill="#f7fbff" opacity=".22"/><path d="M52 48h25" stroke="${accent}" stroke-width="2"/>`;
  else if(type==='box') body=`<rect x="48" y="24" width="47" height="25" rx="3" fill="url(#${id}body)" stroke="#e7edf3" stroke-width="1.5"/><path d="M53 28h37v17H53z" fill="#ffffff" opacity=".08"/><path d="M58 25v23M85 25v23" stroke="#ffffff" opacity=".16"/><path d="M52 47h38" stroke="${accent}" stroke-width="2"/>${wheel(57,51,5)}${wheel(86,51,5)}`;
  else if(type==='medium') body=`<rect x="48" y="28" width="52" height="21" rx="3" fill="url(#${id}body)" stroke="#e7edf3" stroke-width="1.5"/><path d="M53 32h42v12H53z" fill="#ffffff" opacity=".08"/><path d="M61 29v19M88 29v19" stroke="#ffffff" opacity=".13"/><path d="M51 47h46" stroke="${accent}" stroke-width="2"/>${wheel(58,51,5)}${wheel(86,51,5)}${wheel(99,51,5)}`;
  else if(type==='semi') body=`<rect x="48" y="27" width="43" height="22" rx="3" fill="url(#${id}body)" stroke="#e7edf3" stroke-width="1.5"/><path d="M92 32h13v17H92z" fill="${dark}" stroke="#e7edf3" stroke-width="1.3"/><path d="M53 31h33v14H53z" fill="#fff" opacity=".08"/><path d="M51 47h50" stroke="${accent}" stroke-width="2"/>${wheel(57,51,5)}${wheel(75,51,5)}${wheel(96,51,5)}${wheel(105,51,5)}`;
  else if(type==='container') body=`<rect x="48" y="25" width="56" height="24" rx="2" fill="url(#${id}body)" stroke="#e7edf3" stroke-width="1.5"/><path d="M54 27v20M61 27v20M68 27v20M75 27v20M82 27v20M89 27v20M96 27v20" stroke="#ffffff" opacity=".18"/><rect x="78" y="30" width="19" height="9" rx="1" fill="#dbe8f1" opacity=".16"/><text x="87.5" y="37" text-anchor="middle" font-size="5" fill="#fff" opacity=".8" font-weight="700">20 / 40</text>${wheel(59,51,5)}${wheel(88,51,5)}${wheel(102,51,5)}`;
  else if(type==='tank') body=`<path d="M49 31Q72 21 98 31v10q-24 10-49 0z" fill="url(#${id}body)" stroke="#e7edf3" stroke-width="1.5"/><path d="M55 33q18-6 37 0" fill="none" stroke="#fff" opacity=".22"/><path d="M51 47h46" stroke="${accent}" stroke-width="2"/>${wheel(58,51,5)}${wheel(87,51,5)}${wheel(101,51,5)}`;
  else if(type==='hopper') body=`<path d="M49 28h51l-8 21H57z" fill="url(#${id}body)" stroke="#e7edf3" stroke-width="1.5"/><path d="M54 31h41" stroke="#fff" opacity=".18"/><path d="M58 47h38" stroke="${accent}" stroke-width="2"/>${wheel(60,51,5)}${wheel(89,51,5)}${wheel(101,51,5)}`;
  else if(type==='flat') body=`<rect x="48" y="41" width="57" height="8" rx="2" fill="url(#${id}body)" stroke="#e7edf3" stroke-width="1.5"/><path d="M53 40v-10h12v10M69 40V26h13v14M86 40v-7h12v7" fill="none" stroke="${accent}" stroke-width="2.2"/><path d="M52 44h50" stroke="#fff" opacity=".15"/>${wheel(58,51,5)}${wheel(88,51,5)}${wheel(101,51,5)}`;
  else if(type==='reefer') body=`<rect x="48" y="25" width="49" height="24" rx="3" fill="url(#${id}body)" stroke="#dbe5ee" stroke-width="1.5"/><rect x="52" y="29" width="40" height="15" rx="2" fill="#dff2fb"/><path d="M56 32h16M56 36h12" stroke="#70b9d8" stroke-width="1.2"/><text x="81" y="39" text-anchor="middle" font-size="5.2" fill="#25749c" font-weight="800">REEFER</text>${wheel(58,51,5)}${wheel(88,51,5)}${wheel(101,51,5)}`;
  return `<svg viewBox="0 0 118 62" role="img" aria-label="${esc(v.name)}">
    <defs>
      <linearGradient id="${id}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#182332"/><stop offset="1" stop-color="#0c121a"/></linearGradient>
      <linearGradient id="${id}body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${light}"/><stop offset="1" stop-color="${dark}"/></linearGradient>
      <linearGradient id="${id}glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9f5ff"/><stop offset="1" stop-color="#68a9c7"/></linearGradient>
      <filter id="${id}shadow"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".45"/></filter>
    </defs>
    <rect width="118" height="62" rx="9" fill="${bg}"/>
    <path d="M8 54h103" stroke="#344454" stroke-width="1"/>
    <ellipse cx="64" cy="53" rx="48" ry="4" fill="#000" opacity=".28"/>
    <g filter="url(#${id}shadow)">${cab}${body}</g>
    <path d="M12 48h4" stroke="#ffd36b" stroke-width="2" stroke-linecap="round"/>
  </svg>`;
}

function renderVehicles(){
 $("vehicleTable").innerHTML=vehicles.map((v,i)=>`<tr onclick="verFicha(${i})">
   <td><div class="vehicle-name"><div><b>${esc(v.name)}</b><div class="vehicle-badge">${esc(v.special||"Estándar")}</div></div></div></td>
   <td><div class="vehicle-photo">${vehicleSvg(v)}</div></td>
   <td>${v.cap? v.cap.toFixed(1):"ND"}</td>
   <td>${v.vol?v.vol.toFixed(1):"ND"}</td>
   <td class="muted-cell">${v.L?`${v.L} × ${v.W} × ${v.H}`:"Según resolución"}</td>
   <td>${esc(v.body)}</td>
   <td>${esc(v.cargo)}</td>
   <td class="muted-cell">${esc(v.special||"—")}</td>
 </tr>`).join("");
 localStorage.setItem("lt_vehicles",JSON.stringify(vehicles));
}
function verFicha(i){
 const v=vehicles[i];
 const box=$("vehicleModalBox");
 box.innerHTML=`
  <div class="modal-head">
    <div><div class="eyebrow">FICHA TÉCNICA</div><h2 style="margin:4px 0 0">${esc(v.name)}</h2></div>
    <button class="iconbtn" onclick="cerrarFicha()">×</button>
  </div>
  <div class="modal-image">${vehicleSvg(v)}</div>
  <div class="final-rec-grid" style="margin-top:16px">
    <div><span>Capacidad útil</span><strong>${v.cap!==null?v.cap+" t":"N/D"}</strong></div>
    <div><span>Volumen útil</span><strong>${v.vol!==null?v.vol+" m³":"N/D"}</strong></div>
    <div><span>Largo interno</span><strong>${v.L!==null?v.L+" m":"Según resolución"}</strong></div>
    <div><span>Ancho interno</span><strong>${v.W!==null?v.W+" m":"Según resolución"}</strong></div>
    <div><span>Alto interno</span><strong>${v.H!==null?v.H+" m":"Según resolución"}</strong></div>
    <div><span>Carrocería</span><strong>${esc(v.body)}</strong></div>
    <div><span>Uso / carga</span><strong>${esc(v.cargo)}</strong></div>
    <div><span>Condición especial</span><strong>${esc(v.special||"Estándar")}</strong></div>
  </div>
  <div class="footer-note" style="margin-top:16px;text-align:left">Ficha generada a partir de la tabla maestra editable. Ajusta los valores en la pestaña "Tabla maestra" si difieren de la cotización real del transportador.</div>
  <div style="display:flex;justify-content:flex-end;margin-top:14px"><button class="btn primary" onclick="cerrarFicha()">Cerrar</button></div>
 `;
 $("vehicleModalOverlay").classList.add("open");
}
function cerrarFicha(){$("vehicleModalOverlay").classList.remove("open");}
function restaurarVehiculos(){if(confirm("¿Restaurar la tabla maestra a los valores base?")){vehicles=BASE_VEHICLES.map(v=>({...v}));renderVehicles();}}
function reiniciarTodo(){if(!confirm("Esto borrará la solicitud, las piezas y el análisis. ¿Continuar?"))return;pieces=[];lastAnalysis=null;document.querySelectorAll("input").forEach(i=>{if(i.type!=="checkbox")i.value=""});document.querySelectorAll("select").forEach(s=>s.selectedIndex=0);$("pCant").value=1;$("contCant").value=1;renderPieces();$("alerts").innerHTML='<div class="alert blue">Solicitud reiniciada. Puedes empezar una nueva.</div>';$("recommendation").innerHTML="";$("quote").innerHTML='<div class="empty">Aún no hay cotización.</div>';toggleContainer();window.scrollTo({top:0,behavior:"smooth"})}
function guardarCotizacion(a,totalCotizado){
  if(!lastAnalysis){alert("No hay análisis para guardar.");return}
  const id=Math.random().toString(36).slice(2,8).toUpperCase();
  const record={
    id,
    fecha:new Date().toLocaleString("es-CO"),
    operacionId:$("operationId").value||"—",
    cliente:$("clientName").value||"—",
    tipoCarga:$("tipoCarga").value||"—",
    peso:a.t.weight.toFixed(3),
    volumen:a.t.volume.toFixed(2),
    vehiculo:a.best.v.name+(a.best.multi?` × ${a.best.count}`:""),
    total:money(totalCotizado)
  };
  let history=JSON.parse(localStorage.getItem("lt_history")||"[]");
  history.unshift(record);
  if(history.length>500)history=history.slice(0,500);
  localStorage.setItem("lt_history",JSON.stringify(history));
  alert(`Cotización guardada: ${id}`);
  renderHistory();
}
function renderHistory(){
  const tbody=$("historyTableBody");
  const search=($("historySearch")?.value||"").toLowerCase();
  if(!tbody)return;
  let history=JSON.parse(localStorage.getItem("lt_history")||"[]");
  if(search){
    history=history.filter(r=>(r.operacionId.toLowerCase().includes(search)||r.cliente.toLowerCase().includes(search)));
  }
  const count=$("historyCount");
  if(count)count.textContent=`${history.length} ${history.length===1?"registro":"registros"}`;
  if(!history.length){
    tbody.innerHTML='<tr><td colspan="9" style="text-align:center;padding:20px;color:#8f9bad">No hay registros en el historial.</td></tr>';
    return;
  }
  tbody.innerHTML=history.map(r=>`<tr>
    <td>${esc(r.fecha)}</td>
    <td><strong>${esc(r.operacionId)}</strong></td>
    <td>${esc(r.cliente)}</td>
    <td>${esc(r.tipoCarga)}</td>
    <td>${r.peso} t</td>
    <td>${r.volumen} m³</td>
    <td>${esc(r.vehiculo)}</td>
    <td><strong>${r.total}</strong></td>
    <td><button class="iconbtn" onclick="if(confirm('¿Eliminar este registro?')){let h=JSON.parse(localStorage.getItem('lt_history')||'[]');h=h.filter(x=>x.id!=='${r.id}');localStorage.setItem('lt_history',JSON.stringify(h));renderHistory();}" title="Eliminar">×</button></td>
  </tr>`).join("");
}
function exportarHistorial(){
  if(typeof XLSX==="undefined"){alert("No está disponible el exportador Excel.");return}
  let history=JSON.parse(localStorage.getItem("lt_history")||"[]");
  if(!history.length){alert("El historial está vacío.");return}
  const rows=history.map(r=>({
    "Fecha":r.fecha,
    "ID Operación":r.operacionId,
    "Cliente":r.cliente,
    "Tipo Carga":r.tipoCarga,
    "Peso (t)":r.peso,
    "Volumen (m³)":r.volumen,
    "Vehículo":r.vehiculo,
    "Total":r.total
  }));
  const sheet=XLSX.utils.json_to_sheet(rows);
  const workbook=XLSX.utils.book_new();XLSX.utils.book_append_sheet(workbook,sheet,"Historial");
  XLSX.writeFile(workbook,"logitrading-historial.xlsx");
}
function vaciarHistorial(){
  if(confirm("¿Borrar todo el historial de cotizaciones? Esta acción no se puede deshacer.")){
    localStorage.removeItem("lt_history");
    renderHistory();
    alert("Historial borrado.");
  }
}
renderVehicles();renderPieces();calcPiecePreview();renderHistory();
document.addEventListener("input",updateDashboard);document.addEventListener("change",updateDashboard);
