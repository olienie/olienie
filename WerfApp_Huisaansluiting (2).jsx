import { useState, useRef, useCallback } from "react";

// ─── DATA ───────────────────────────────────────────────────────────────────
const FASEN = {
  Zwijndrecht: ["Fase 1 – Bareelstraat","Fase 2 – Burchtsestraat","Fase 3 – Laarstraat-Molenbergstraat","Fase 4 – Vervolg Burchtsestraat","Fase 5 – Alfred van Oststraat","Fase 6 – Laarstraat-Antwerpsesteenweg","Fase 7 – Burchtsestraat-Verbrandendijk"],
  Puurs: ["Fase 1","Fase 2","Fase 3","Pompstation A","Pompstation B"]
};
const SECTIES = ["Project","GPS Metingen","Deel 1 – Hoofdriool","Deel 2 – Huisaansluiting","Kolken","Materialen","Foto's","Overzicht"];

const EMPTY = {
  // Project
  project:"Zwijndrecht", fase:"", straat:"", huisnr:"", bus:"", datum: new Date().toISOString().slice(0,10),
  uitvoerder:"", rol:"werfleider",
  // GPS
  x_lambert:"", y_lambert:"", z_taw:"",
  afstand_put_afwaarts:"", afstand_put_opwaarts:"", afstand_volgende_put:"",
  afstand_gevel_rechts:"", afstand_rooilijn:"",
  put_afwaarts_nr:"", put_opwaarts_nr:"",
  // Hoofdriool
  type_riolering:"gescheiden", diameter_hoofd:"200", materiaal_hoofd:"PVC",
  diepte_inlaat:"", diepte_put_afwaarts:"", diepte_put_opwaarts:"",
  lengte_hoofd:"", helling:"",
  // HA
  type_ha:"DWA+RWA", diameter_ha:"160", materiaal_ha:"PVC",
  diepte_ha_putje:"", ligging_ha:"rijweg", hoek_aansl:"45",
  type_aansl:"gewone aansluiting", terugslagklep:"nee",
  // Materialen Deel 1 – Hoofdriool (Ø200)
  m1_buis200:"", m1_bocht45_200:"", m1_bocht90_200:"", m1_tstuk200:"", m1_koppel200:"", m1_mof200:"", m1_inspput400:"", m1_inspput600:"",
  // Materialen Deel 2 – HA (Ø160)
  m2_buis160:"", m2_bocht15_160:"", m2_bocht30_160:"", m2_bocht45_160:"", m2_bocht90_160:"",
  m2_tstuk160:"", m2_tstuk_ip160:"",  // T-stuk gewoon 160 vs T-stuk in-plaat (IP) 160
  m2_koppel160:"", m2_mof160:"", m2_krimpmof:"",
  m2_reductie_160_110:"", m2_reductie_110_90:"", m2_reductie_110_80:"",
  // Materialen HA-putje
  m2_ha_putje_d:"400", m2_ha_putje_deksel:"1",
  // Kleine diameters (vertakking naar woning)
  m3_buis110:"", m3_bocht45_110:"", m3_bocht90_110:"", m3_tstuk110:"", m3_koppel110:"",
  m3_buis90:"",  m3_bocht45_90:"",  m3_bocht90_90:"",

  // Kolken
  kolk_straat:"", kolk_huisnr:"", kolk_x:"", kolk_y:"", kolk_z_taw:"",
  kolk_type:"standaard", kolk_diameter:"400", kolk_diepte:"",
  kolk_afstand_boordtrottoir:"", kolk_afstand_gevel:"",
  km_buis160:"", km_bocht45_160:"", km_bocht90_160:"", km_bocht15_160:"", km_bocht30_160:"",
  km_tstuk160:"", km_tstuk_ip160:"", km_koppel160:"", km_mof160:"", km_krimpmof160:"",
  km_buis110:"", km_bocht45_110:"", km_bocht90_110:"", km_tstuk110:"", km_koppel110:"",
  kolk_opmerkingen:"",
  // Foto's
  fotos: [null,null,null,null],
  fotoLabels:["Boring / uitgraving","Plaatsing buis","Verbinding privé kant","Omhulling / afwerking"],
  // Opmerkingen
  opmerkingen:""
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmtID = (data) => {
  const d = data.datum?.replace(/-/g,"") || "00000000";
  const f = (data.fase||"F?").replace(/[^0-9]/g,"") || "?";
  const nr = Math.floor(Math.random()*900+100);
  return `ZW-F${f}-${d.slice(4)}-${nr}`;
};

const calcVoortgang = (data) => {
  const required = ["straat","huisnr","datum","uitvoerder","diepte_ha_putje","diepte_inlaat","type_ha","diameter_ha"];
  const filled = required.filter(k => data[k] && String(data[k]).trim());
  const hasGPS = data.x_lambert && data.y_lambert;
  const hasFotos = data.fotos.filter(Boolean).length;
  return { pct: Math.round((filled.length/required.length)*100), hasGPS, hasFotos };
};

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────
const Label = ({children, req}) => (
  <label style={{display:"block",fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"#4a5568",marginBottom:4}}>
    {children}{req && <span style={{color:"#e53e3e",marginLeft:2}}>*</span>}
  </label>
);

const Input = ({label,req,value,onChange,type="text",placeholder,unit,min,step,readOnly,hint}) => (
  <div style={{marginBottom:16}}>
    {label && <Label req={req}>{label}</Label>}
    <div style={{display:"flex",alignItems:"center",gap:6}}>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)}
        placeholder={placeholder||""} min={min} step={step} readOnly={readOnly}
        style={{flex:1,padding:"10px 12px",border:"1.5px solid #e2e8f0",borderRadius:6,fontSize:14,
          background:readOnly?"#f7fafc":"white",color:"#1a202c",outline:"none",
          fontFamily:"inherit",WebkitAppearance:"none"}}/>
      {unit && <span style={{fontSize:12,color:"#718096",minWidth:28}}>{unit}</span>}
    </div>
    {hint && <div style={{fontSize:11,color:"#a0aec0",marginTop:3}}>{hint}</div>}
  </div>
);

const Select = ({label,req,value,onChange,options,hint}) => (
  <div style={{marginBottom:16}}>
    {label && <Label req={req}>{label}</Label>}
    <select value={value} onChange={e=>onChange(e.target.value)}
      style={{width:"100%",padding:"10px 12px",border:"1.5px solid #e2e8f0",borderRadius:6,
        fontSize:14,background:"white",color:"#1a202c",outline:"none",fontFamily:"inherit",
        WebkitAppearance:"none",backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23718096' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
        backgroundRepeat:"no-repeat",backgroundPosition:"right 12px center",paddingRight:32}}>
      {options.map(o => typeof o==="string"
        ? <option key={o} value={o}>{o}</option>
        : <option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
    {hint && <div style={{fontSize:11,color:"#a0aec0",marginTop:3}}>{hint}</div>}
  </div>
);

const NumInput = ({label,value,onChange,unit,min="0"}) => (
  <div style={{marginBottom:0}}>
    {label && <Label>{label}</Label>}
    <div style={{display:"flex",alignItems:"center",gap:6}}>
      <button onClick={()=>onChange(Math.max(0,(parseInt(value)||0)-1))}
        style={{width:34,height:34,border:"1.5px solid #e2e8f0",borderRadius:6,background:"#f7fafc",
          fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"#4a5568"}}>−</button>
      <input type="number" value={value} onChange={e=>onChange(e.target.value)} min={min}
        style={{flex:1,padding:"8px 0",border:"1.5px solid #e2e8f0",borderRadius:6,fontSize:16,
          fontWeight:700,textAlign:"center",color:"#1a202c",outline:"none",fontFamily:"inherit"}}/>
      <button onClick={()=>onChange((parseInt(value)||0)+1)}
        style={{width:34,height:34,border:"1.5px solid #e2e8f0",borderRadius:6,background:"#2d3748",
          fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:"white"}}>+</button>
    </div>
    {unit && <div style={{fontSize:11,color:"#a0aec0",textAlign:"center",marginTop:2}}>{unit}</div>}
  </div>
);

const Row2 = ({children}) => (
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>{children}</div>
);
const Row3 = ({children}) => (
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>{children}</div>
);

const SectionTitle = ({icon,title,sub,color="#1a202c"}) => (
  <div style={{marginBottom:20,paddingBottom:12,borderBottom:"2px solid #e2e8f0"}}>
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <span style={{fontSize:22}}>{icon}</span>
      <div>
        <div style={{fontFamily:"system-ui,sans-serif",fontSize:18,fontWeight:800,color,letterSpacing:"-0.3px"}}>{title}</div>
        {sub && <div style={{fontSize:12,color:"#718096",marginTop:1}}>{sub}</div>}
      </div>
    </div>
  </div>
);

const MaterialCard = ({title,color="#2d3748",items,data,upd}) => (
  <div style={{background:"white",border:"1.5px solid #e2e8f0",borderRadius:10,overflow:"hidden",marginBottom:16}}>
    <div style={{background:color,color:"white",padding:"10px 16px",fontSize:12,fontWeight:800,letterSpacing:1,textTransform:"uppercase"}}>{title}</div>
    <div style={{padding:"16px",display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:16}}>
      {items.map(({key,label,unit}) => (
        <div key={key}>
          <div style={{fontSize:11,fontWeight:700,color:"#4a5568",letterSpacing:0.5,marginBottom:6,textTransform:"uppercase"}}>{label}</div>
          <NumInput value={data[key]||0} onChange={v=>upd(key,v)} unit={unit}/>
        </div>
      ))}
    </div>
  </div>
);

const Badge = ({children,color}) => (
  <span style={{display:"inline-block",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:color+"22",color,border:`1px solid ${color}44`}}>{children}</span>
);

const VlarioRow = ({label,value,src,auto}) => (
  <tr style={{borderBottom:"1px solid #e2e8f0"}}>
    <td style={{padding:"8px 12px",fontSize:12,fontWeight:600,color:"#2d3748",width:"35%"}}>{label}</td>
    <td style={{padding:"8px 12px",fontSize:13,color: value?"#1a202c":"#a0aec0",fontFamily:"'DM Mono',monospace"}}>{value||"—"}</td>
    <td style={{padding:"8px 12px"}}><Badge color={auto?"#1a7a45":"#c47a00"}>{src}</Badge></td>
  </tr>
);

// ─── FOTO UPLOAD ─────────────────────────────────────────────────────────────
const FotoSlot = ({index,foto,label,onChange}) => {
  const ref = useRef();
  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => onChange(index, e.target.result);
    reader.readAsDataURL(file);
  };
  return (
    <div style={{border:"2px dashed #cbd5e0",borderRadius:10,overflow:"hidden",background:"#f7fafc",cursor:"pointer"}}
      onClick={()=>!foto&&ref.current.click()}
      onDragOver={e=>{e.preventDefault();e.currentTarget.style.borderColor="#3182ce"}}
      onDragLeave={e=>{e.currentTarget.style.borderColor="#cbd5e0"}}
      onDrop={e=>{e.preventDefault();handleFile(e.dataTransfer.files[0])}}>
      {foto ? (
        <div style={{position:"relative"}}>
          <img src={foto} alt={label} style={{width:"100%",height:160,objectFit:"cover",display:"block"}}/>
          <button onClick={e=>{e.stopPropagation();onChange(index,null)}}
            style={{position:"absolute",top:6,right:6,background:"rgba(0,0,0,0.7)",color:"white",border:"none",borderRadius:20,width:28,height:28,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
          <div style={{background:"rgba(0,0,0,0.6)",color:"white",padding:"6px 10px",fontSize:11,fontWeight:700,letterSpacing:1}}>✓ {label}</div>
        </div>
      ) : (
        <div style={{padding:24,textAlign:"center"}}>
          <div style={{fontSize:32,marginBottom:8}}>📷</div>
          <div style={{fontSize:12,fontWeight:700,color:"#4a5568"}}>{label}</div>
          <div style={{fontSize:11,color:"#a0aec0",marginTop:4}}>Tik of sleep foto hier</div>
        </div>
      )}
      <input ref={ref} type="file" accept="image/*" capture="environment"
        style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
    </div>
  );
};

// ─── EXPORT ──────────────────────────────────────────────────────────────────
const buildVlarioExport = (data, id) => {
  const lines = [
    `VLARIO FICHE EXPORT`,`ID: ${id}`,`Datum: ${data.datum}`,``,
    `=== PROJECTIDENTIFICATIE ===`,
    `Gemeente: Zwijndrecht`,`Project: ${data.project}`,`Fase: ${data.fase}`,
    `Straat: ${data.straat}`,`Huisnummer: ${data.huisnr}${data.bus?" bus "+data.bus:""}`,
    `Uitvoerder: ${data.uitvoerder}`,``,
    `=== GPS / LANDMETER ===`,
    `X Lambert72: ${data.x_lambert||"—"}`,`Y Lambert72: ${data.y_lambert||"—"}`,`Z TAW: ${data.z_taw||"—"}`,
    `Put stroomafwaarts: ${data.put_afwaarts_nr}`,`Put stroomopwaarts: ${data.put_opwaarts_nr}`,
    `Afstand put stroomaf (m): ${data.afstand_put_afwaarts}`,`Afstand put stroomop (m): ${data.afstand_put_opwaarts}`,
    `Afstand volgende put (m): ${data.afstand_volgende_put}`,
    `Afstand rechter gevel (m): ${data.afstand_gevel_rechts}`,`Afstand rooilijn (m): ${data.afstand_rooilijn}`,``,
    `=== DEEL 1 – HOOFDRIOOL ===`,
    `Type: ${data.type_riolering}`,`Diameter: Ø${data.diameter_hoofd}mm`,`Materiaal: ${data.materiaal_hoofd}`,
    `Diepte inlaat riool (m): ${data.diepte_inlaat}`,`Diepte put stroomaf (m): ${data.diepte_put_afwaarts}`,
    `Diepte put stroomop (m): ${data.diepte_put_opwaarts}`,`Lengte (lm): ${data.lengte_hoofd}`,`Helling (%): ${data.helling}`,``,
    `=== DEEL 2 – HUISAANSLUITING ===`,
    `Type: ${data.type_ha}`,`Diameter: Ø${data.diameter_ha}mm`,`Materiaal: ${data.materiaal_ha}`,
    `Diepte HA-putje (m): ${data.diepte_ha_putje}`,`Ligging: ${data.ligging_ha}`,
    `Type aansluiting: ${data.type_aansl}`,`Hoek: ${data.hoek_aansl}°`,`Terugslagklep: ${data.terugslagklep}`,``,
    `=== MATERIALEN HOOFDRIOOL (Ø${data.diameter_hoofd}) ===`,
    `Buis Ø200: ${data.m1_buis200||0} lm`,`Bocht 45° Ø200: ${data.m1_bocht45_200||0} st`,
    `Bocht 90° Ø200: ${data.m1_bocht90_200||0} st`,`T-stuk Ø200: ${data.m1_tstuk200||0} st`,
    `Koppelstuk Ø200: ${data.m1_koppel200||0} st`,`Mof Ø200: ${data.m1_mof200||0} st`,
    `Inspectieput Ø400: ${data.m1_inspput400||0} st`,`Inspectieput Ø600: ${data.m1_inspput600||0} st`,``,
    `=== MATERIALEN HUISAANSLUITING (Ø160) ===`,
    `Buis Ø160: ${data.m2_buis160||0} lm`,
    `Bocht 15° Ø160: ${data.m2_bocht15_160||0} st`,`Bocht 30° Ø160: ${data.m2_bocht30_160||0} st`,
    `Bocht 45° Ø160: ${data.m2_bocht45_160||0} st`,`Bocht 90° Ø160: ${data.m2_bocht90_160||0} st`,
    `T-stuk Ø160 gewoon: ${data.m2_tstuk160||0} st`,`T-stuk in-plaat Ø160: ${data.m2_tstuk_ip160||0} st`,
    `Koppelstuk Ø160: ${data.m2_koppel160||0} st`,`Mof Ø160: ${data.m2_mof160||0} st`,
    `Krimpmof: ${data.m2_krimpmof||0} st`,
    `Reductie 160→110: ${data.m2_reductie_160_110||0} st`,
    `Reductie 110→90: ${data.m2_reductie_110_90||0} st`,
    `Reductie 110→80: ${data.m2_reductie_110_80||0} st`,
    `HA-putje Ø${data.m2_ha_putje_d}: ${data.m2_ha_putje_deksel||0} st`,``,
    `=== KLEINE DIAMETERS (vertakking woning) ===`,
    `Buis Ø110: ${data.m3_buis110||0} lm`,`Bocht 45° Ø110: ${data.m3_bocht45_110||0} st`,
    `Bocht 90° Ø110: ${data.m3_bocht90_110||0} st`,`T-stuk Ø110: ${data.m3_tstuk110||0} st`,
    `Buis Ø90: ${data.m3_buis90||0} lm`,`Bocht 45° Ø90: ${data.m3_bocht45_90||0} st`,
    `Bocht 90° Ø90: ${data.m3_bocht90_90||0} st`,``,
    `=== FOTO'S ===`,
    ...data.fotos.map((f,i)=>`Foto ${i+1} (${data.fotoLabels[i]}): ${f?"AANWEZIG":"ONTBREEKT"}`),``,
    `Opmerkingen: ${data.opmerkingen||"—"}`
  ];
  return lines.join("\n");
};

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function WerfApp() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({...EMPTY});
  const [saved, setSaved] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [ficheID] = useState(fmtID(EMPTY));

  const upd = useCallback((k,v) => setData(d=>({...d,[k]:v})), []);
  const updFoto = useCallback((i,v) => setData(d=>{const f=[...d.fotos];f[i]=v;return{...d,fotos:f}}), []);

  const { pct, hasGPS, hasFotos } = calcVoortgang(data);

  const saveRecord = () => {
    const rec = {...data, id: ficheID, savedAt: new Date().toISOString()};
    setSaved(s=>[...s, rec]);
    setShowSaved(true);
  };

  const downloadTxt = () => {
    const txt = buildVlarioExport(data, ficheID);
    const blob = new Blob([txt], {type:"text/plain;charset=utf-8"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${ficheID}_Vlario.txt`;
    a.click();
  };

  // ── STEP CONTENT ──
  const steps = [
    // 0 – Project
    <div key="project">
      <SectionTitle icon="📋" title="Projectidentificatie" sub="Basisgegevens aansluiting" color="#1a202c"/>
      <Row2>
        <Select label="Project" req value={data.project} onChange={v=>{upd("project",v);upd("fase","")}}
          options={["Zwijndrecht","Puurs"]}/>
        <Select label="Fase" req value={data.fase} onChange={v=>upd("fase",v)}
          options={["Kies fase...", ...(FASEN[data.project]||[])]}/>
      </Row2>
      <Row3>
        <div style={{gridColumn:"1/3"}}>
          <Input label="Straatnaam" req value={data.straat} onChange={v=>upd("straat",v)} placeholder="Bareelstraat"/>
        </div>
        <Input label="Huisnr" req value={data.huisnr} onChange={v=>upd("huisnr",v)} placeholder="12"/>
      </Row3>
      <Row2>
        <Input label="Bus / toevoeging" value={data.bus} onChange={v=>upd("bus",v)} placeholder="optioneel"/>
        <Input label="Datum" req type="date" value={data.datum} onChange={v=>upd("datum",v)}/>
      </Row2>
      <Row2>
        <Input label="Uitvoerder" req value={data.uitvoerder} onChange={v=>upd("uitvoerder",v)} placeholder="Naam ploeg/persoon"/>
        <Select label="Rol" value={data.rol} onChange={v=>upd("rol",v)}
          options={["werfleider","projectleider","ploegbaas","arbeider","landmeter","onderaannemer"]}/>
      </Row2>
    </div>,

    // 1 – GPS
    <div key="gps">
      <SectionTitle icon="📍" title="GPS Metingen" sub="Door landmeter of zelf opmeten" color="#2b6cb0"/>
      <div style={{background:"#ebf8ff",border:"1px solid #bee3f8",borderRadius:8,padding:12,marginBottom:20,fontSize:12,color:"#2c5282"}}>
        <strong>Wie vult dit in?</strong> Landmeter of werfleider via GPS meetstok (Topcon). Ploeg kan dit leeg laten.
      </div>
      <div style={{fontWeight:800,fontSize:12,letterSpacing:1,textTransform:"uppercase",color:"#4a5568",marginBottom:12}}>Lambert72 Coördinaten</div>
      <Row3>
        <Input label="X Lambert72" value={data.x_lambert} onChange={v=>upd("x_lambert",v)} placeholder="152345.234" hint="6 decimalen"/>
        <Input label="Y Lambert72" value={data.y_lambert} onChange={v=>upd("y_lambert",v)} placeholder="203456.789" hint="6 decimalen"/>
        <Input label="Z TAW (m)" value={data.z_taw} onChange={v=>upd("z_taw",v)} placeholder="5.23" hint="hoogte maaiveld"/>
      </Row3>
      <div style={{fontWeight:800,fontSize:12,letterSpacing:1,textTransform:"uppercase",color:"#4a5568",margin:"20px 0 12px"}}>Putnummers</div>
      <Row2>
        <Input label="Put stroomafwaarts (nr)" value={data.put_afwaarts_nr} onChange={v=>upd("put_afwaarts_nr",v)} placeholder="P12"/>
        <Input label="Put stroomopwaarts (nr)" value={data.put_opwaarts_nr} onChange={v=>upd("put_opwaarts_nr",v)} placeholder="P13"/>
      </Row2>
      <div style={{fontWeight:800,fontSize:12,letterSpacing:1,textTransform:"uppercase",color:"#4a5568",margin:"20px 0 12px"}}>Afstanden (m)</div>
      <Row2>
        <Input label="Afstand tot put stroomaf" value={data.afstand_put_afwaarts} onChange={v=>upd("afstand_put_afwaarts",v)} unit="m" type="number" placeholder="8.50"/>
        <Input label="Afstand tot put stroomop" value={data.afstand_put_opwaarts} onChange={v=>upd("afstand_put_opwaarts",v)} unit="m" type="number" placeholder="12.30"/>
      </Row2>
      <Row3>
        <Input label="Afstand volgende put" value={data.afstand_volgende_put} onChange={v=>upd("afstand_volgende_put",v)} unit="m" type="number" hint="put-tot-put afstand"/>
        <Input label="Afstand rechter gevel" value={data.afstand_gevel_rechts} onChange={v=>upd("afstand_gevel_rechts",v)} unit="m" type="number" hint="HA-putje tot gevel"/>
        <Input label="Afstand rooilijn" value={data.afstand_rooilijn} onChange={v=>upd("afstand_rooilijn",v)} unit="m" type="number" hint="HA-putje tot rooilijn"/>
      </Row3>
    </div>,

    // 2 – Hoofdriool
    <div key="hoofd">
      <SectionTitle icon="🔧" title="Deel 1 – Hoofdriool" sub="Aanleg collectorstelsel" color="#744210"/>
      <Row3>
        <Select label="Type riolering" req value={data.type_riolering} onChange={v=>upd("type_riolering",v)}
          options={["gescheiden – nieuw","gescheiden – relining","gemengd – bestaand","DWA enkel","RWA enkel","combinatie nieuw+bestaand"]}/>
        <Select label="Diameter" req value={data.diameter_hoofd} onChange={v=>upd("diameter_hoofd",v)}
          options={["160","200","250","300","315","400","500","600","700","800","900"]} hint="mm"/>
        <Select label="Materiaal" req value={data.materiaal_hoofd} onChange={v=>upd("materiaal_hoofd",v)}
          options={["PVC","Beton","Gres (aardewerk)","PP","PE","GVK (glasvezel)","Gietijzer","Staal"]}/>
      </Row3>
      <div style={{fontWeight:800,fontSize:12,letterSpacing:1,textTransform:"uppercase",color:"#4a5568",margin:"16px 0 12px"}}>Dieptes &amp; Afmetingen</div>
      <Row3>
        <Input label="Diepte inlaat riool" req value={data.diepte_inlaat} onChange={v=>upd("diepte_inlaat",v)} unit="m" type="number" step="0.01" placeholder="1.80" hint="onderkant buis"/>
        <Input label="Diepte put stroomaf" value={data.diepte_put_afwaarts} onChange={v=>upd("diepte_put_afwaarts",v)} unit="m" type="number" step="0.01" placeholder="1.75"/>
        <Input label="Diepte put stroomop" value={data.diepte_put_opwaarts} onChange={v=>upd("diepte_put_opwaarts",v)} unit="m" type="number" step="0.01" placeholder="1.95"/>
      </Row3>
      <Row2>
        <Input label="Lengte aangelegd" value={data.lengte_hoofd} onChange={v=>upd("lengte_hoofd",v)} unit="lm" type="number" step="0.1"/>
        <Input label="Helling (%)" value={data.helling} onChange={v=>upd("helling",v)} unit="%" type="number" step="0.01" placeholder="0.30" hint="min. 0.25%"/>
      </Row2>
    </div>,

    // 3 – HA
    <div key="ha">
      <SectionTitle icon="🏠" title="Deel 2 – Huisaansluiting" sub="Aansluiting woning op riool" color="#1a7a45"/>
      <div style={{background:"#f0fff4",border:"1px solid #9ae6b4",borderRadius:8,padding:"10px 14px",marginBottom:14,fontSize:12,color:"#1a7a45"}}>
        <strong>📍 Ligging HA-putje is verplicht voor Vlario</strong> — kies de exacte ligging uit de dropdown.
      </div>
      <Row3>
        <Select label="Type HA" req value={data.type_ha} onChange={v=>upd("type_ha",v)}
          options={["DWA + RWA (gescheiden)","DWA enkel","RWA enkel","Gemengd (1 buis)","Herbronnement DWA","Herbronnement RWA"]}/>
        <Select label="Diameter HA" req value={data.diameter_ha} onChange={v=>upd("diameter_ha",v)}
          options={["110","125","160","200"]} hint="mm"/>
        <Select label="Materiaal HA" value={data.materiaal_ha} onChange={v=>upd("materiaal_ha",v)}
          options={["PVC (standaard)","PP","PE","Gres (aardewerk)","Gietijzer","Staal"]}/>
      </Row3>
      <Row3>
        <Input label="Diepte HA-putje" req value={data.diepte_ha_putje} onChange={v=>upd("diepte_ha_putje",v)} unit="m" type="number" step="0.01" placeholder="0.90" hint="bovenkant deksel t.o.v. invert"/>
        <Select label="Ligging HA-putje" value={data.ligging_ha} onChange={v=>upd("ligging_ha",v)}
          options={["rijweg – asfalt","rijweg – klinkers","rijweg – beton","trottoir – betontegel","trottoir – klinkers","trottoir – asfalt","onverharde berm","verharde berm","fietspad","oprit – asfalt","oprit – klinkers","oprit – beton","tuin","parking","andere"]}/>
        <Select label="Hoek aansluiting" value={data.hoek_aansl} onChange={v=>upd("hoek_aansl",v)}
          options={[{v:"45",l:"45° (standaard)"},{v:"60",l:"60°"},{v:"67.5",l:"67.5°"},{v:"90",l:"90° (haaks)"},{v:"variabel",l:"Variabel"}]}/>
      </Row3>
      <Row2>
        <Select label="Type aansluiting" value={data.type_aansl} onChange={v=>upd("type_aansl",v)}
          options={["gewone aansluiting – haaks","gewone aansluiting – schuin","T-stuk in lijn","T-stuk haaks","zadel Ø200/160","zadel Ø200/110","inboormof Ø160","inboormof Ø110","Y-stuk 45°","Y-stuk 67.5°","boorkoppeling"]}/>
        <Select label="Terugslagklep" value={data.terugslagklep} onChange={v=>upd("terugslagklep",v)}
          options={["nee","ja"]}/>
      </Row2>
    </div>,


    // 3b – Kolken
    <div key="kolken">
      <SectionTitle icon="🌧️" title="Kolken" sub="Registratie straatkolken en materialen" color="#2b6cb0"/>
      <div style={{background:"#ebf8ff",border:"1px solid #bee3f8",borderRadius:8,padding:10,marginBottom:16,fontSize:12,color:"#2c5282"}}>
        <strong>Kolken:</strong> Zelfde materialen als HA maar <strong>geen reducties</strong>. Vul in per kolk die aangelegd wordt in deze fase.
      </div>
      <Row2>
        <Input label="Straat" value={data.kolk_straat} onChange={v=>upd("kolk_straat",v)} placeholder="Bareelstraat"/>
        <Input label="Huisnr / locatie" value={data.kolk_huisnr} onChange={v=>upd("kolk_huisnr",v)} placeholder="t.h.v. nr 12"/>
      </Row2>
      <Row3>
        <Select label="Type kolk" value={data.kolk_type} onChange={v=>upd("kolk_type",v)}
          options={["standaard","verhoogde rand","verdiept","dubbele kolk","koffer kolk"]}/>
        <Select label="Diameter" value={data.kolk_diameter} onChange={v=>upd("kolk_diameter",v)}
          options={[{v:"300",l:"Ø300"},{v:"400",l:"Ø400"},{v:"500",l:"Ø500"}]}/>
        <Input label="Diepte kolk" value={data.kolk_diepte} onChange={v=>upd("kolk_diepte",v)} unit="m" type="number" step="0.01" placeholder="0.75"/>
      </Row3>
      <Row2>
        <Input label="Afstand boord / trottoir" value={data.kolk_afstand_boordtrottoir} onChange={v=>upd("kolk_afstand_boordtrottoir",v)} unit="m" type="number" step="0.01" hint="van kolk tot band/boord"/>
        <Input label="Afstand gevel" value={data.kolk_afstand_gevel} onChange={v=>upd("kolk_afstand_gevel",v)} unit="m" type="number" step="0.01"/>
      </Row2>
      <Row3>
        <Input label="X Lambert72" value={data.kolk_x} onChange={v=>upd("kolk_x",v)} placeholder="152345.234" hint="optioneel GPS"/>
        <Input label="Y Lambert72" value={data.kolk_y} onChange={v=>upd("kolk_y",v)} placeholder="203456.789"/>
        <Input label="Z TAW" value={data.kolk_z_taw} onChange={v=>upd("kolk_z_taw",v)} unit="m" placeholder="5.23"/>
      </Row3>

      <MaterialCard title="Kolk – Aansluitbuis Ø160" color="#2b6cb0"
        data={data} upd={upd}
        items={[
          {key:"km_buis160",    label:"Buis Ø160",      unit:"lm"},
          {key:"km_bocht15_160",label:"Bocht 15°",      unit:"st"},
          {key:"km_bocht30_160",label:"Bocht 30°",      unit:"st"},
          {key:"km_bocht45_160",label:"Bocht 45°",      unit:"st"},
          {key:"km_bocht90_160",label:"Bocht 90°",      unit:"st"},
          {key:"km_tstuk160",   label:"T-stuk Ø160",    unit:"st"},
          {key:"km_tstuk_ip160",label:"T-stuk IP Ø160", unit:"st"},
          {key:"km_koppel160",  label:"Koppelstuk",     unit:"st"},
          {key:"km_mof160",     label:"Mof Ø160",       unit:"st"},
          {key:"km_krimpmof160",label:"Krimpmof",       unit:"st"},
        ]}/>
      <MaterialCard title="Kolk – Kleine diameter Ø110" color="#1a5c35"
        data={data} upd={upd}
        items={[
          {key:"km_buis110",    label:"Buis Ø110",      unit:"lm"},
          {key:"km_bocht45_110",label:"Bocht 45°",      unit:"st"},
          {key:"km_bocht90_110",label:"Bocht 90°",      unit:"st"},
          {key:"km_tstuk110",   label:"T-stuk Ø110",    unit:"st"},
          {key:"km_koppel110",  label:"Koppelstuk",     unit:"st"},
        ]}/>
      <Input label="Opmerkingen kolk" value={data.kolk_opmerkingen} onChange={v=>upd("kolk_opmerkingen",v)}
        placeholder="Bijzonderheden, afwijkend type, locatie opmerking..."/>
    </div>,

    // 5 – Materialen
    <div key="mat">
      <SectionTitle icon="📦" title="Materialen" sub="Per aansluiting — alles invullen" color="#553c9a"/>
      <MaterialCard title={`Deel 1 – Hoofdriool Ø${data.diameter_hoofd}`} color="#744210"
        data={data} upd={upd}
        items={[
          {key:"m1_buis200",label:`Buis Ø${data.diameter_hoofd}`,unit:"lm"},
          {key:"m1_bocht45_200",label:"Bocht 45°",unit:"st"},
          {key:"m1_bocht90_200",label:"Bocht 90°",unit:"st"},
          {key:"m1_tstuk200",label:"T-stuk",unit:"st"},
          {key:"m1_koppel200",label:"Koppelstuk",unit:"st"},
          {key:"m1_mof200",label:"Mof",unit:"st"},
          {key:"m1_inspput400",label:"Inspectieput Ø400",unit:"st"},
          {key:"m1_inspput600",label:"Inspectieput Ø600",unit:"st"},
        ]}/>
      <MaterialCard title="Deel 2 – Huisaansluiting Ø160" color="#1a5c35"
        data={data} upd={upd}
        items={[
          {key:"m2_buis160",label:"Buis Ø160",unit:"lm"},
          {key:"m2_bocht15_160",label:"Bocht 15°",unit:"st"},
          {key:"m2_bocht30_160",label:"Bocht 30°",unit:"st"},
          {key:"m2_bocht45_160",label:"Bocht 45°",unit:"st"},
          {key:"m2_bocht90_160",label:"Bocht 90°",unit:"st"},
          {key:"m2_tstuk160",label:"T-stuk Ø160",unit:"st"},
          {key:"m2_tstuk_ip160",label:"T-stuk IP Ø160",unit:"st"},
          {key:"m2_koppel160",label:"Koppelstuk",unit:"st"},
          {key:"m2_mof160",label:"Mof Ø160",unit:"st"},
          {key:"m2_krimpmof",label:"Krimpmof",unit:"st"},
        ]}/>
      <MaterialCard title="Reducties" color="#553c9a"
        data={data} upd={upd}
        items={[
          {key:"m2_reductie_160_110",label:"Reductie 160→110",unit:"st"},
          {key:"m2_reductie_110_90", label:"Reductie 110→90", unit:"st"},
          {key:"m2_reductie_110_80", label:"Reductie 110→80", unit:"st"},
        ]}/>
      <MaterialCard title="HA-Putje" color="#2b6cb0"
        data={data} upd={upd}
        items={[
          {key:"m2_ha_putje_deksel",label:"HA-putje + deksel",unit:"st"},
        ]}/>
      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:16,marginTop:4}}>
        <Label>Diameter HA-putje</Label>
        <div style={{display:"flex",gap:6}}>
          {["400","500","600","800"].map(d=>(
            <button key={d} onClick={()=>upd("m2_ha_putje_d",d)}
              style={{padding:"6px 14px",border:`2px solid ${data.m2_ha_putje_d===d?"#2b6cb0":"#e2e8f0"}`,
                borderRadius:6,background:data.m2_ha_putje_d===d?"#2b6cb0":"white",
                color:data.m2_ha_putje_d===d?"white":"#4a5568",fontWeight:700,fontSize:13,cursor:"pointer"}}>
              Ø{d}
            </button>
          ))}
        </div>
      </div>
      <MaterialCard title="Kleine diameters – vertakking woning" color="#1a202c"
        data={data} upd={upd}
        items={[
          {key:"m3_buis110",label:"Buis Ø110",unit:"lm"},
          {key:"m3_bocht45_110",label:"Bocht 45° Ø110",unit:"st"},
          {key:"m3_bocht90_110",label:"Bocht 90° Ø110",unit:"st"},
          {key:"m3_tstuk110",label:"T-stuk Ø110",unit:"st"},
          {key:"m3_koppel110",label:"Koppel Ø110",unit:"st"},
          {key:"m3_buis90",label:"Buis Ø90",unit:"lm"},
          {key:"m3_bocht45_90",label:"Bocht 45° Ø90",unit:"st"},
          {key:"m3_bocht90_90",label:"Bocht 90° Ø90",unit:"st"},
        ]}/>
    </div>,

    // 6 – Foto's
    <div key="fotos">
      <SectionTitle icon="📷" title="Foto's" sub="4 verplichte foto's — direct vanuit camera" color="#c05621"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
        {data.fotos.map((f,i)=>(
          <FotoSlot key={i} index={i} foto={f} label={data.fotoLabels[i]} onChange={updFoto}/>
        ))}
      </div>
      <div style={{background:"#fffbeb",border:"1px solid #f6e05e",borderRadius:8,padding:12,fontSize:12,color:"#744210",marginBottom:16}}>
        <strong>Vlario vereiste:</strong> Minstens 4 foto's per aansluiting. Maak ze terwijl je aan de sleuf staat — achteraf is te laat.
      </div>
      <Input label="Opmerkingen" value={data.opmerkingen} onChange={v=>upd("opmerkingen",v)}
        placeholder="Afwijkingen, bijzonderheden, coördinaten niet beschikbaar..."/>
    </div>,

    // 7 – Overzicht / Vlario
    <div key="overzicht">
      <SectionTitle icon="✅" title="Overzicht & Vlario Export" sub={`Fiche ID: ${ficheID}`} color="#1a7a45"/>

      {/* Voortgangsindicator */}
      <div style={{background:"white",border:"1.5px solid #e2e8f0",borderRadius:10,padding:20,marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{fontSize:13,fontWeight:700}}>Volledigheid</span>
          <span style={{fontSize:18,fontWeight:800,color: pct>=90?"#1a7a45":pct>=60?"#c47a00":"#e53e3e"}}>{pct}%</span>
        </div>
        <div style={{height:8,background:"#e2e8f0",borderRadius:4,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${pct}%`,background: pct>=90?"#1a7a45":pct>=60?"#c47a00":"#e53e3e",borderRadius:4,transition:"width .4s"}}/>
        </div>
        <div style={{display:"flex",gap:12,marginTop:12,flexWrap:"wrap"}}>
          <Badge color={hasGPS?"#1a7a45":"#e53e3e"}>{hasGPS?"✓ GPS aanwezig":"⚠ GPS ontbreekt"}</Badge>
          <Badge color={hasFotos===4?"#1a7a45":hasFotos>0?"#c47a00":"#e53e3e"}>{hasFotos}/4 foto's</Badge>
          <Badge color={data.diepte_ha_putje?"#1a7a45":"#e53e3e"}>{data.diepte_ha_putje?"✓ Diepte HA":"⚠ Diepte HA ontbreekt"}</Badge>
        </div>
      </div>

      {/* Vlario mapping tabel */}
      <div style={{background:"white",border:"1.5px solid #e2e8f0",borderRadius:10,overflow:"hidden",marginBottom:20}}>
        <div style={{background:"#1a202c",color:"white",padding:"12px 16px",fontSize:12,fontWeight:800,letterSpacing:1,textTransform:"uppercase"}}>
          Vlario Fiche — Veldmapping
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr style={{background:"#f7fafc"}}>
                <th style={{padding:"8px 12px",fontSize:11,fontWeight:700,color:"#4a5568",textAlign:"left",letterSpacing:1,textTransform:"uppercase"}}>Vlario Veld</th>
                <th style={{padding:"8px 12px",fontSize:11,fontWeight:700,color:"#4a5568",textAlign:"left",letterSpacing:1,textTransform:"uppercase"}}>Waarde</th>
                <th style={{padding:"8px 12px",fontSize:11,fontWeight:700,color:"#4a5568",textAlign:"left",letterSpacing:1,textTransform:"uppercase"}}>Bron</th>
              </tr>
            </thead>
            <tbody>
              <VlarioRow label="Gemeente" value="Zwijndrecht" src="Automatisch" auto/>
              <VlarioRow label="Straatnaam" value={data.straat} src="Forms" auto/>
              <VlarioRow label="Huisnummer" value={data.huisnr} src="Forms" auto/>
              <VlarioRow label="Datum uitvoering" value={data.datum} src="Forms" auto/>
              <VlarioRow label="X Lambert72" value={data.x_lambert} src="GPS/Landmeter" auto={!!data.x_lambert}/>
              <VlarioRow label="Y Lambert72" value={data.y_lambert} src="GPS/Landmeter" auto={!!data.y_lambert}/>
              <VlarioRow label="Z TAW" value={data.z_taw} src="GPS/Landmeter" auto={!!data.z_taw}/>
              <VlarioRow label="Put stroomafwaarts" value={data.put_afwaarts_nr} src="Meting" auto/>
              <VlarioRow label="Afstand put stroomaf" value={data.afstand_put_afwaarts?data.afstand_put_afwaarts+" m":""} src="Meting" auto/>
              <VlarioRow label="Afstand gevel rechts" value={data.afstand_gevel_rechts?data.afstand_gevel_rechts+" m":""} src="Meting" auto/>
              <VlarioRow label="Afstand rooilijn" value={data.afstand_rooilijn?data.afstand_rooilijn+" m":""} src="Meting" auto/>
              <VlarioRow label="Type HA" value={data.type_ha} src="Forms" auto/>
              <VlarioRow label="Diameter HA" value={`Ø${data.diameter_ha}mm`} src="Forms" auto/>
              <VlarioRow label="Materiaal HA" value={data.materiaal_ha} src="Forms" auto/>
              <VlarioRow label="Diepte HA-putje" value={data.diepte_ha_putje?data.diepte_ha_putje+" m":""} src="Ploeg" auto/>
              <VlarioRow label="Diepte inlaat riool" value={data.diepte_inlaat?data.diepte_inlaat+" m":""} src="Ploeg" auto/>
              <VlarioRow label="Type aansluiting" value={data.type_aansl} src="Forms" auto/>
              <VlarioRow label="Hoek aansluiting" value={data.hoek_aansl+"°"} src="Forms" auto/>
              <VlarioRow label="Terugslagklep" value={data.terugslagklep} src="Forms" auto/>
              <VlarioRow label="Foto's aanwezig" value={`${data.fotos.filter(Boolean).length}/4`} src="Upload" auto={data.fotos.filter(Boolean).length===4}/>
            </tbody>
          </table>
        </div>
      </div>

      {/* Materialenlijst samenvatting */}
      <div style={{background:"white",border:"1.5px solid #e2e8f0",borderRadius:10,overflow:"hidden",marginBottom:20}}>
        <div style={{background:"#553c9a",color:"white",padding:"12px 16px",fontSize:12,fontWeight:800,letterSpacing:1,textTransform:"uppercase",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span>Materialen — Vorderingsstaat</span>
          <span style={{fontSize:10,opacity:.7,fontWeight:400}}>→ automatisch naar vorderingstab</span>
        </div>
        <div style={{padding:16,display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0"}}>
          {[
            [`Buis Ø${data.diameter_hoofd}`, data.m1_buis200||0, "lm"],
            ["Buis Ø160", data.m2_buis160||0, "lm"],
            ["Buis Ø110", data.m3_buis110||0, "lm"],
            ["Buis Ø90", data.m3_buis90||0, "lm"],
            ["T-stuk Ø160", data.m2_tstuk160||0, "st"],
            ["T-stuk IP Ø160", data.m2_tstuk_ip160||0, "st"],
            ["Bochten (alle)", [data.m2_bocht15_160,data.m2_bocht30_160,data.m2_bocht45_160,data.m2_bocht90_160].reduce((a,b)=>a+(parseInt(b)||0),0), "st"],
            ["Kolken Ø160 buis", data.km_buis160||0, "lm"],
            ["Kolken Ø110 buis", data.km_buis110||0, "lm"],
            ["Reducties (alle)", [data.m2_reductie_160_110,data.m2_reductie_110_90,data.m2_reductie_110_80].reduce((a,b)=>a+(parseInt(b)||0),0), "st"],
            ["Inspectieputten", (parseInt(data.m1_inspput400)||0)+(parseInt(data.m1_inspput600)||0), "st"],
            ["HA-putje", data.m2_ha_putje_deksel||0, "st"],
          ].map(([lbl,val,un])=>(
            <div key={lbl} style={{display:"flex",justifyContent:"space-between",padding:"7px 12px",borderBottom:"1px solid #f7fafc",fontSize:13}}>
              <span style={{color:"#4a5568"}}>{lbl}</span>
              <span style={{fontWeight:700,fontFamily:"monospace"}}>{val} <span style={{fontSize:11,color:"#a0aec0"}}>{un}</span></span>
            </div>
          ))}
        </div>
      </div>

      {/* Actieknoppen */}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <button onClick={saveRecord}
          style={{width:"100%",padding:16,background:"#1a7a45",color:"white",border:"none",borderRadius:10,
            fontSize:16,fontWeight:800,cursor:"pointer",letterSpacing:0.5}}>
          ✓ Opslaan & Indienen
        </button>
        <button onClick={downloadTxt}
          style={{width:"100%",padding:14,background:"#1a202c",color:"white",border:"none",borderRadius:10,
            fontSize:14,fontWeight:700,cursor:"pointer"}}>
          ⬇ Download Vlario Export (.txt)
        </button>
        {saved.length>0 && (
          <button onClick={()=>setShowSaved(!showSaved)}
            style={{width:"100%",padding:14,background:"#553c9a",color:"white",border:"none",borderRadius:10,
              fontSize:14,fontWeight:700,cursor:"pointer"}}>
            📊 Vorderingsregister ({saved.length} fiches)
          </button>
        )}
      </div>

      {/* Vorderingsregister */}
      {showSaved && saved.length>0 && (
        <div style={{marginTop:20,background:"white",border:"1.5px solid #e2e8f0",borderRadius:10,overflow:"hidden"}}>
          <div style={{background:"#553c9a",color:"white",padding:"12px 16px",fontSize:12,fontWeight:800,letterSpacing:1,textTransform:"uppercase"}}>
            Vorderingsregister — {saved.length} fiches ingediend
          </div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead>
                <tr style={{background:"#f7fafc"}}>
                  {["ID","Straat","Nr","Fase","Type HA","Diepte HA","Buis Ø160","Bochten","Status"].map(h=>(
                    <th key={h} style={{padding:"8px 10px",fontWeight:700,color:"#4a5568",textAlign:"left",letterSpacing:0.5,whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {saved.map((r,i)=>(
                  <tr key={i} style={{borderBottom:"1px solid #e2e8f0",background:i%2?"#f7fafc":"white"}}>
                    <td style={{padding:"7px 10px",fontFamily:"monospace",fontWeight:700,color:"#553c9a",whiteSpace:"nowrap"}}>{r.id}</td>
                    <td style={{padding:"7px 10px"}}>{r.straat}</td>
                    <td style={{padding:"7px 10px"}}>{r.huisnr}</td>
                    <td style={{padding:"7px 10px",whiteSpace:"nowrap"}}>{(r.fase||"").split("–")[0]?.trim()}</td>
                    <td style={{padding:"7px 10px"}}><Badge color="#1a7a45">{r.type_ha}</Badge></td>
                    <td style={{padding:"7px 10px",fontFamily:"monospace"}}>{r.diepte_ha_putje||"—"} m</td>
                    <td style={{padding:"7px 10px",fontFamily:"monospace"}}>{r.m2_buis160||0} lm</td>
                    <td style={{padding:"7px 10px",fontFamily:"monospace"}}>{[r.m2_bocht15_160,r.m2_bocht30_160,r.m2_bocht45_160,r.m2_bocht90_160].reduce((a,b)=>a+(parseInt(b)||0),0)} st</td>
                    <td style={{padding:"7px 10px"}}><Badge color="#1a7a45">✓ Ingediend</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{padding:"10px 16px",background:"#f7fafc",fontSize:11,color:"#718096",borderTop:"1px solid #e2e8f0"}}>
            → Kopieer deze tabel naar je Excel vorderingsstaat / Power Automate pikt dit automatisch op
          </div>
        </div>
      )}
    </div>
  ];

  const canNext = step < SECTIES.length - 1;
  const canPrev = step > 0;

  return (
    <div style={{maxWidth:"100%",width:"100%",minHeight:"100vh",background:"#0f172a",fontFamily:"'DM Sans',system-ui,sans-serif"}}>

      {/* HEADER */}
      <div style={{background:"#0f172a",color:"white",padding:"16px 20px",position:"sticky",top:0,zIndex:50,borderBottom:"3px solid #e8401c"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:10,letterSpacing:3,textTransform:"uppercase",color:"#e8401c",marginBottom:2,fontWeight:700}}>COLAS — WERF</div>
            <div style={{fontSize:17,fontWeight:800,letterSpacing:"-0.3px"}}>Huisaansluiting Registratie</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:9,color:"rgba(255,255,255,.4)",letterSpacing:1,marginBottom:2}}>VOLLEDIGHEID</div>
            <div style={{fontSize:22,fontWeight:800,color: pct>=90?"#4ade80":pct>=60?"#fb923c":"#f87171"}}>{pct}%</div>
          </div>
        </div>
        {/* Step indicator */}
        <div style={{display:"flex",gap:3,marginTop:12}}>
          {SECTIES.map((s,i)=>(
            <button key={i} onClick={()=>setStep(i)}
              style={{flex:1,height:4,borderRadius:2,border:"none",cursor:"pointer",
                background: i===step?"#e8401c":i<step?"#22c55e":"rgba(255,255,255,.12)",
                transition:"background .2s"}}/>
          ))}
        </div>
        <div style={{fontSize:12,color:"rgba(255,255,255,.6)",marginTop:6,letterSpacing:0.5,fontWeight:500}}>
          {step+1}/{SECTIES.length} — {SECTIES[step]}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{padding:"20px 16px 120px",background:"#0f172a",minHeight:"calc(100vh - 80px)"}}>
        <div style={{background:"white",borderRadius:12,padding:"20px 16px",boxShadow:"0 4px 24px rgba(0,0,0,0.3)"}}>{steps[step]}</div>
      </div>

      {/* BOTTOM NAV */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,width:"100%",
        background:"#0f172a",borderTop:"2px solid #e8401c",padding:"12px 16px",display:"flex",gap:10,zIndex:50}}>
        <button onClick={()=>setStep(s=>s-1)} disabled={!canPrev}
          style={{flex:1,padding:14,border:"1.5px solid #e2e8f0",borderRadius:10,
            background: canPrev?"#334155":"#1e293b",color: canPrev?"white":"#475569",
            fontWeight:700,fontSize:14,cursor: canPrev?"pointer":"default"}}>
          ← Vorige
        </button>
        {canNext ? (
          <button onClick={()=>setStep(s=>s+1)}
            style={{flex:2,padding:14,border:"none",borderRadius:10,background:"#e8401c",
              color:"white",fontWeight:800,fontSize:14,cursor:"pointer",letterSpacing:0.3}}>
            Volgende: {SECTIES[step+1]} →
          </button>
        ) : (
          <button onClick={saveRecord}
            style={{flex:2,padding:14,border:"none",borderRadius:10,background:"#1a7a45",
              color:"white",fontWeight:800,fontSize:15,cursor:"pointer"}}>
            ✓ Opslaan & Indienen
          </button>
        )}
      </div>
    </div>
  );
}
