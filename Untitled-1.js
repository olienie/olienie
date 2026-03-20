import { useState, useRef, useCallback, useEffect } from "react";

// ═══ FONTS ═══════════════════════════════════════════════════════════════════
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;800;900&family=Barlow:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Barlow',sans-serif;background:#080d15;color:#e2e8f0}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:#0f172a}
::-webkit-scrollbar-thumb{background:#334155;border-radius:2px}
input,select,textarea{font-family:'Barlow',sans-serif}
input[type=range]{accent-color:#e8401c}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
`;

// ═══ DATA ════════════════════════════════════════════════════════════════════
const FASEN = {
  Zwijndrecht:["Fase 1 – Bareelstraat","Fase 2 – Burchtsestraat","Fase 3 – Laarstraat-Molenbergstraat","Fase 4 – Vervolg Burchtsestraat","Fase 5 – Alfred van Oststraat","Fase 6 – Laarstraat-Antwerpsesteenweg","Fase 7 – Burchtsestraat-Verbrandendijk"],
  Puurs:["Fase 1","Fase 2","Fase 3","Pompstation A","Pompstation B"]
};

const STOCK_DATA = [
  {id:"B200",  cat:"Buizen",    code:"PVC-200",  naam:"PVC buis Ø200mm",        eh:"lm", stock:120,min:50, bestel:200,prijs:32.00,post:"21.10",lev:"Wavin",   lt:3},
  {id:"B160",  cat:"Buizen",    code:"PVC-160",  naam:"PVC buis Ø160mm",        eh:"lm", stock:85, min:40, bestel:150,prijs:25.00,post:"21.10",lev:"Wavin",   lt:3},
  {id:"B110",  cat:"Buizen",    code:"PVC-110",  naam:"PVC buis Ø110mm",        eh:"lm", stock:60, min:30, bestel:100,prijs:16.50,post:"21.10",lev:"Wavin",   lt:3},
  {id:"B90",   cat:"Buizen",    code:"PVC-90",   naam:"PVC buis Ø90mm",         eh:"lm", stock:40, min:20, bestel:80, prijs:12.00,post:"21.10",lev:"Wavin",   lt:3},
  {id:"BC45_160",cat:"Bochten", code:"BC45-160", naam:"Bocht 45° Ø160mm",       eh:"st", stock:35, min:15, bestel:50, prijs:12.00,post:"21.20",lev:"Wavin",   lt:3},
  {id:"BC90_160",cat:"Bochten", code:"BC90-160", naam:"Bocht 90° Ø160mm",       eh:"st", stock:28, min:12, bestel:40, prijs:14.00,post:"21.20",lev:"Wavin",   lt:3},
  {id:"BC15_160",cat:"Bochten", code:"BC15-160", naam:"Bocht 15° Ø160mm",       eh:"st", stock:22, min:10, bestel:40, prijs:10.50,post:"21.20",lev:"Wavin",   lt:3},
  {id:"BC30_160",cat:"Bochten", code:"BC30-160", naam:"Bocht 30° Ø160mm",       eh:"st", stock:18, min:10, bestel:40, prijs:11.00,post:"21.20",lev:"Wavin",   lt:3},
  {id:"BC45_110",cat:"Bochten", code:"BC45-110", naam:"Bocht 45° Ø110mm",       eh:"st", stock:15, min:8,  bestel:30, prijs:7.50, post:"21.20",lev:"Wavin",   lt:3},
  {id:"BC90_110",cat:"Bochten", code:"BC90-110", naam:"Bocht 90° Ø110mm",       eh:"st", stock:12, min:8,  bestel:30, prijs:8.50, post:"21.20",lev:"Wavin",   lt:3},
  {id:"TS160",   cat:"T-stukken",code:"TS-160",  naam:"T-stuk Ø160mm",          eh:"st", stock:20, min:10, bestel:40, prijs:28.00,post:"21.30",lev:"Wavin",   lt:5},
  {id:"TSIP160", cat:"T-stukken",code:"TSIP-160",naam:"T-stuk in-plaat Ø160mm", eh:"st", stock:6,  min:5,  bestel:20, prijs:38.00,post:"21.30",lev:"Wavin",   lt:5},
  {id:"TS200",   cat:"T-stukken",code:"TS-200",  naam:"T-stuk Ø200mm",          eh:"st", stock:8,  min:5,  bestel:20, prijs:45.00,post:"21.30",lev:"Wavin",   lt:5},
  {id:"TS110",   cat:"T-stukken",code:"TS-110",  naam:"T-stuk Ø110mm",          eh:"st", stock:14, min:8,  bestel:30, prijs:18.00,post:"21.30",lev:"Wavin",   lt:5},
  {id:"R160_110",cat:"Reducties",code:"R160/110",naam:"Reductie 160→110mm",      eh:"st", stock:12, min:6,  bestel:25, prijs:14.00,post:"21.40",lev:"Wavin",   lt:3},
  {id:"R110_90", cat:"Reducties",code:"R110/90", naam:"Reductie 110→90mm",       eh:"st", stock:8,  min:5,  bestel:20, prijs:11.00,post:"21.40",lev:"Wavin",   lt:3},
  {id:"R110_80", cat:"Reducties",code:"R110/80", naam:"Reductie 110→80mm",       eh:"st", stock:6,  min:5,  bestel:20, prijs:10.00,post:"21.40",lev:"Wavin",   lt:3},
  {id:"MOF160",  cat:"Verbinding",code:"MOF-160",naam:"Mof Ø160mm",              eh:"st", stock:45, min:20, bestel:80, prijs:6.50, post:"21.50",lev:"Wavin",   lt:2},
  {id:"KOP160",  cat:"Verbinding",code:"KOP-160",naam:"Koppelstuk Ø160mm",       eh:"st", stock:30, min:15, bestel:60, prijs:8.50, post:"21.50",lev:"Wavin",   lt:2},
  {id:"KRM",     cat:"Verbinding",code:"KRM-160",naam:"Krimpmof Ø160mm",         eh:"st", stock:10, min:6,  bestel:25, prijs:12.00,post:"21.50",lev:"Wavin",   lt:2},
  {id:"IP400",   cat:"Putten",   code:"IP-400",  naam:"Inspectieput Ø400mm",     eh:"st", stock:5,  min:3,  bestel:10, prijs:185.0,post:"22.10",lev:"Pipelife",lt:7},
  {id:"IP600",   cat:"Putten",   code:"IP-600",  naam:"Inspectieput Ø600mm",     eh:"st", stock:3,  min:2,  bestel:8,  prijs:320.0,post:"22.10",lev:"Pipelife",lt:7},
  {id:"HAPD400", cat:"Putten",   code:"HA-400",  naam:"HA-putje + deksel Ø400",  eh:"st", stock:8,  min:4,  bestel:15, prijs:145.0,post:"22.20",lev:"Pipelife",lt:5},
  {id:"KOLK400", cat:"Kolken",   code:"KOLK-400",naam:"Straatkolk Ø400mm",       eh:"st", stock:6,  min:3,  bestel:12, prijs:95.00,post:"23.10",lev:"Benor",   lt:5},
  {id:"ZAND",    cat:"Granulaten",code:"ZAND",   naam:"Stabilisatiezand",         eh:"m³", stock:45, min:20, bestel:80, prijs:28.00,post:"24.10",lev:"Sibelco", lt:2},
  {id:"GRIND",   cat:"Granulaten",code:"GRIND",  naam:"Drainagegrind 4/16",       eh:"m³", stock:18, min:10, bestel:40, prijs:38.00,post:"24.10",lev:"Sibelco", lt:2},
];

const MEETSTAAT_DATA = [
  {post:"21.10",omschr:"Aanleg PVC rioolbuis",          eh:"lm", EP:85,   cat:"Riool"},
  {post:"21.20",omschr:"Levering & plaatsing bochten",  eh:"st", EP:32,   cat:"Riool"},
  {post:"21.30",omschr:"Levering T-stukken",            eh:"st", EP:65,   cat:"Riool"},
  {post:"21.40",omschr:"Levering reducties",            eh:"st", EP:28,   cat:"Riool"},
  {post:"21.50",omschr:"Verbindingsstukken (moffen e.a.)",eh:"st",EP:18,  cat:"Riool"},
  {post:"22.10",omschr:"Plaatsing inspectieput",        eh:"st", EP:650,  cat:"Putten"},
  {post:"22.20",omschr:"Plaatsing HA-putje",            eh:"st", EP:420,  cat:"Putten"},
  {post:"23.10",omschr:"Plaatsing straatkolk",          eh:"st", EP:285,  cat:"Kolken"},
  {post:"24.10",omschr:"Aanvulzand & granulaten",       eh:"m³", EP:72,   cat:"Grond"},
  {post:"25.10",omschr:"Grondwerken uitgraving",        eh:"m³", EP:28,   cat:"Grond"},
  {post:"26.10",omschr:"Herstel rijweg – asfalt",       eh:"m²", EP:145,  cat:"Herstel"},
  {post:"26.20",omschr:"Herstel trottoir",              eh:"m²", EP:85,   cat:"Herstel"},
  {post:"27.10",omschr:"Signalisatie werf (ff)",        eh:"ff", EP:1200, cat:"Diversen"},
];

const PLANNING_DATA = [
  {id:1,project:"Zwijndrecht",fase:"Fase 1 – Bareelstraat",        start:"2025-03-03",einde:"2025-04-11",ploeg:"Ploeg A",status:"in uitvoering",vrtg:65,aansl:28},
  {id:2,project:"Zwijndrecht",fase:"Fase 2 – Burchtsestraat",      start:"2025-04-14",einde:"2025-06-06",ploeg:"Ploeg A",status:"gepland",      vrtg:0, aansl:42},
  {id:3,project:"Zwijndrecht",fase:"Fase 3 – Laarstraat-Mol.",     start:"2025-06-09",einde:"2025-07-18",ploeg:"Ploeg A",status:"gepland",      vrtg:0, aansl:35},
  {id:4,project:"Zwijndrecht",fase:"Fase 4 – Vervolg Burchts.",    start:"2025-07-21",einde:"2025-09-05",ploeg:"Ploeg A",status:"gepland",      vrtg:0, aansl:38},
  {id:5,project:"Zwijndrecht",fase:"Fase 5 – Alfred v. Oststr.",   start:"2025-09-08",einde:"2025-10-17",ploeg:"Ploeg A",status:"gepland",      vrtg:0, aansl:30},
  {id:6,project:"Zwijndrecht",fase:"Fase 6 – Laarstr.-Antw.",      start:"2025-10-20",einde:"2025-12-05",ploeg:"Ploeg A",status:"gepland",      vrtg:0, aansl:45},
  {id:7,project:"Zwijndrecht",fase:"Fase 7 – Verbrandendijk",      start:"2025-12-08",einde:"2026-02-06",ploeg:"Ploeg A",status:"gepland",      vrtg:0, aansl:52},
  {id:8,project:"Puurs",      fase:"Fase 1",                        start:"2025-01-20",einde:"2025-05-02",ploeg:"Ploeg B",status:"in uitvoering",vrtg:42,aansl:60},
  {id:9,project:"Puurs",      fase:"Fase 2",                        start:"2025-05-05",einde:"2025-08-15",ploeg:"Ploeg B",status:"gepland",      vrtg:0, aansl:55},
  {id:10,project:"Puurs",     fase:"Fase 3",                        start:"2025-08-18",einde:"2025-11-28",ploeg:"Ploeg B",status:"gepland",      vrtg:0, aansl:50},
  {id:11,project:"Puurs",     fase:"Pompstation A",                 start:"2025-06-02",einde:"2025-07-11",ploeg:"Ploeg B",status:"gepland",      vrtg:0, aansl:5},
  {id:12,project:"Puurs",     fase:"Pompstation B",                 start:"2025-09-01",einde:"2025-10-10",ploeg:"Ploeg B",status:"gepland",      vrtg:0, aansl:5},
];

const VORD_DATA = [
  {id:"ZW-F1-001",project:"Zwijndrecht",fase:"Fase 1",datum:"2025-03-05",adres:"Bareelstraat 4",buis200:18,buis160:6,buis110:2,bochten:3,tstuk:1,ip:1,ha:1,kolk:0,zand:2.5,status:"goedgekeurd"},
  {id:"ZW-F1-002",project:"Zwijndrecht",fase:"Fase 1",datum:"2025-03-06",adres:"Bareelstraat 6",buis200:16,buis160:8,buis110:3,bochten:4,tstuk:1,ip:0,ha:1,kolk:1,zand:2.0,status:"goedgekeurd"},
  {id:"ZW-F1-003",project:"Zwijndrecht",fase:"Fase 1",datum:"2025-03-07",adres:"Bareelstraat 8",buis200:20,buis160:5,buis110:4,bochten:2,tstuk:2,ip:0,ha:1,kolk:0,zand:3.0,status:"in review"},
  {id:"PU-F1-001",project:"Puurs",      fase:"Fase 1",datum:"2025-01-25",adres:"Kerkstraat 12", buis200:22,buis160:7,buis110:3,bochten:5,tstuk:1,ip:1,ha:1,kolk:0,zand:3.5,status:"goedgekeurd"},
  {id:"PU-F1-002",project:"Puurs",      fase:"Fase 1",datum:"2025-01-28",adres:"Kerkstraat 14", buis200:15,buis160:6,buis110:2,bochten:3,tstuk:1,ip:1,ha:1,kolk:1,zand:2.0,status:"goedgekeurd"},
];

// ═══ HELPERS ═════════════════════════════════════════════════════════════════
const f€ = n => `€ ${Number(n).toLocaleString("nl-BE",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const TODAY = new Date().toISOString().slice(0,10);
const G_START="2025-01-01", G_END="2026-03-01";
const days=(a,b)=>Math.round((new Date(b)-new Date(a))/864e5);
const gPct=d=>Math.max(0,Math.min(100,(days(G_START,d)/days(G_START,G_END))*100));
const alertLvl=(s,m)=>s<=0?"leeg":s<=m*.5?"kritiek":s<=m?"laag":s<=m*1.5?"let op":"ok";
const alertClr=l=>({leeg:"#ef4444",kritiek:"#ef4444",laag:"#f97316","let op":"#eab308",ok:"#22c55e"})[l]||"#64748b";
const statusClr=s=>({["in uitvoering"]:"#e8401c",gepland:"#3b82f6",afgerond:"#22c55e",vertraagd:"#f97316"})[s]||"#64748b";
const pvcSum=(vord,key)=>vord.reduce((a,v)=>a+(parseInt(v[key])||0),0);

// ═══ SHARED UI ═══════════════════════════════════════════════════════════════
const Lbl=({children,req,hint})=>(
  <div style={{marginBottom:4}}>
    <label style={{fontSize:10,fontWeight:700,letterSpacing:1.2,textTransform:"uppercase",color:"#64748b"}}>
      {children}{req&&<span style={{color:"#ef4444",marginLeft:2}}>*</span>}
    </label>
    {hint&&<div style={{fontSize:10,color:"#475569",marginTop:1}}>{hint}</div>}
  </div>
);

const Inp=({label,req,hint,value,onChange,type="text",placeholder,unit,readOnly,step})=>(
  <div style={{marginBottom:10}}>
    {label&&<Lbl req={req} hint={hint}>{label}</Lbl>}
    <div style={{display:"flex",gap:6,alignItems:"center"}}>
      <input type={type} value={value||""} onChange={e=>onChange(e.target.value)}
        placeholder={placeholder||""} readOnly={readOnly} step={step}
        style={{flex:1,padding:"9px 11px",border:`1.5px solid ${readOnly?"#1e3a5f":"#334155"}`,borderRadius:6,
          fontSize:13,background:readOnly?"#0a1929":"#0f172a",color:"#e2e8f0",outline:"none",WebkitAppearance:"none"}}/>
      {unit&&<span style={{fontSize:11,color:"#475569",minWidth:24,flexShrink:0}}>{unit}</span>}
    </div>
  </div>
);

const Sel=({label,req,value,onChange,options,hint})=>(
  <div style={{marginBottom:10}}>
    {label&&<Lbl req={req} hint={hint}>{label}</Lbl>}
    <select value={value||""} onChange={e=>onChange(e.target.value)}
      style={{width:"100%",padding:"9px 30px 9px 11px",border:"1.5px solid #334155",borderRadius:6,
        fontSize:13,background:"#0f172a",color:"#e2e8f0",outline:"none",
        WebkitAppearance:"none",backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%2364748b' d='M5 7L0 2h10z'/%3E%3C/svg%3E\")",
        backgroundRepeat:"no-repeat",backgroundPosition:"right 10px center"}}>
      {options.map(o=>typeof o==="string"?<option key={o} value={o}>{o}</option>:<option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  </div>
);

const R2=({children,gap=8})=><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap}}>{children}</div>;
const R3=({children})=><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>{children}</div>;

const Card=({children,style={}})=>(
  <div style={{background:"#0d1424",border:"1px solid #1e293b",borderRadius:8,overflow:"hidden",...style}}>
    {children}
  </div>
);
const CardHead=({children,color="#1e293b",right})=>(
  <div style={{background:color,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
    <div style={{fontSize:11,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:"#94a3b8"}}>{children}</div>
    {right&&<div>{right}</div>}
  </div>
);

const Dot=({lvl})=>{
  const c=alertClr(lvl);
  return <span style={{display:"inline-flex",alignItems:"center",gap:4}}>
    <span style={{width:7,height:7,borderRadius:"50%",background:c,display:"inline-block",
      animation:["leeg","kritiek"].includes(lvl)?"pulse 1.2s infinite":"none"}}/>
    <span style={{fontSize:10,fontWeight:700,color:c,textTransform:"uppercase",letterSpacing:.5}}>{lvl}</span>
  </span>;
};

const Tag=({children,color="#3b82f6"})=>(
  <span style={{display:"inline-block",padding:"2px 7px",borderRadius:3,fontSize:10,
    fontWeight:700,letterSpacing:.3,background:color+"1a",color,border:`1px solid ${color}30`,
    fontFamily:"'JetBrains Mono',monospace",whiteSpace:"nowrap"}}>
    {children}
  </span>
);

const StatRow=({items})=>(
  <div style={{display:"grid",gridTemplateColumns:`repeat(${items.length},1fr)`,gap:2,marginBottom:12}}>
    {items.map(({lbl,val,c})=>(
      <div key={lbl} style={{background:"#0a0f1a",padding:"10px 12px",borderLeft:`3px solid ${c}`}}>
        <div style={{fontSize:9,color:"#475569",letterSpacing:1,textTransform:"uppercase",fontWeight:700,marginBottom:2}}>{lbl}</div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:800,color:"#e2e8f0",lineHeight:1}}>{val}</div>
      </div>
    ))}
  </div>
);

const InfoBox=({children,color="#3b82f6"})=>(
  <div style={{background:color+"12",border:`1px solid ${color}30`,borderLeft:`3px solid ${color}`,
    borderRadius:6,padding:"9px 12px",marginBottom:12,fontSize:12,color:color==="green"||color==="#22c55e"?"#86efac":"#93c5fd",lineHeight:1.5}}>
    {children}
  </div>
);

// ═══ FOTO SLOT ════════════════════════════════════════════════════════════════
const FotoSlot=({index,foto,label,onChange})=>{
  const ref=useRef();
  const handle=f=>{if(!f)return;const r=new FileReader();r.onload=e=>onChange(index,e.target.result);r.readAsDataURL(f);};
  return(
    <div style={{border:"1.5px dashed #334155",borderRadius:6,overflow:"hidden",background:"#0a0f1a",cursor:"pointer"}}
      onClick={()=>!foto&&ref.current.click()}
      onDragOver={e=>{e.preventDefault();e.currentTarget.style.borderColor="#3b82f6"}}
      onDragLeave={e=>{e.currentTarget.style.borderColor="#334155"}}
      onDrop={e=>{e.preventDefault();handle(e.dataTransfer.files[0])}}>
      {foto?(
        <div style={{position:"relative"}}>
          <img src={foto} alt={label} style={{width:"100%",height:110,objectFit:"cover",display:"block"}}/>
          <button onClick={ev=>{ev.stopPropagation();onChange(index,null);}}
            style={{position:"absolute",top:4,right:4,background:"rgba(0,0,0,.8)",color:"white",border:"none",
              borderRadius:20,width:22,height:22,cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
          <div style={{background:"rgba(0,0,0,.7)",color:"#4ade80",padding:"3px 8px",fontSize:9,fontWeight:700}}>✓ {label}</div>
        </div>
      ):(
        <div style={{padding:14,textAlign:"center"}}>
          <div style={{fontSize:20,marginBottom:4}}>📷</div>
          <div style={{fontSize:10,fontWeight:600,color:"#475569",lineHeight:1.3}}>{label}</div>
        </div>
      )}
      <input ref={ref} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={e=>handle(e.target.files[0])}/>
    </div>
  );
};

// ═══ NUM INPUT (teller) ═══════════════════════════════════════════════════════
const Num=({label,value,onChange,unit})=>(
  <div>
    {label&&<Lbl>{label}</Lbl>}
    <div style={{display:"flex",alignItems:"center",gap:4}}>
      <button onClick={()=>onChange(Math.max(0,(parseInt(value)||0)-1))}
        style={{width:30,height:30,border:"1px solid #334155",borderRadius:4,background:"#1e293b",
          color:"#94a3b8",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>−</button>
      <input type="number" value={value||0} onChange={e=>onChange(e.target.value)} min="0"
        style={{flex:1,padding:"6px 0",border:"1px solid #334155",borderRadius:4,fontSize:15,fontWeight:700,
          textAlign:"center",background:"#0f172a",color:"#e2e8f0",outline:"none"}}/>
      <button onClick={()=>onChange((parseInt(value)||0)+1)}
        style={{width:30,height:30,border:"none",borderRadius:4,background:"#e8401c",
          color:"white",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>+</button>
    </div>
    {unit&&<div style={{fontSize:9,color:"#475569",textAlign:"center",marginTop:2}}>{unit}</div>}
  </div>
);

const MatCard=({title,color,items,data,upd})=>(
  <Card style={{marginBottom:10}}>
    <div style={{background:color,padding:"8px 14px",fontSize:10,fontWeight:800,letterSpacing:1,textTransform:"uppercase",color:"white"}}>{title}</div>
    <div style={{padding:12,display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:12}}>
      {items.map(({k,l,u})=><div key={k}><Num label={l} value={data[k]||0} onChange={v=>upd(k,v)} unit={u}/></div>)}
    </div>
  </Card>
);

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 1 — MANAGEMENT PITCH
// ═══════════════════════════════════════════════════════════════════════════
const PitchModule=()=>(
  <div style={{animation:"fadeIn .3s ease"}}>
    {/* Hero */}
    <div style={{background:"linear-gradient(135deg,#0a0f1a 0%,#1e2d4a 100%)",border:"1px solid #1e293b",borderRadius:10,padding:"32px 28px",marginBottom:12,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",right:-20,top:-30,fontFamily:"'Barlow Condensed',sans-serif",fontSize:220,fontWeight:900,color:"rgba(255,255,255,.02)",lineHeight:1,pointerEvents:"none"}}>COLAS</div>
      <div style={{fontSize:10,letterSpacing:4,textTransform:"uppercase",color:"#e8401c",fontWeight:800,marginBottom:8}}>Colas België NV · Projectautomatisering 2025</div>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:42,fontWeight:900,lineHeight:.9,color:"white",marginBottom:12}}>
        STOP HET<br/><span style={{color:"#e8401c"}}>PAPIER</span>WERK
      </div>
      <div style={{fontSize:13,color:"#64748b",lineHeight:1.6,maxWidth:480,marginBottom:20}}>
        PUURS &amp; ZWIJNDRECHT volledig geautomatiseerd — van WhatsApp-foto's en papieren bonnetjes naar een zelfrijdend digitaal systeem in Microsoft 365.
      </div>
      {/* Citaat */}
      <div style={{borderLeft:"3px solid #e8401c",paddingLeft:16,background:"rgba(232,64,28,.06)",padding:"14px 16px",borderRadius:"0 6px 6px 0"}}>
        <div style={{fontSize:15,fontStyle:"italic",color:"rgba(255,255,255,.8)",lineHeight:1.6,fontWeight:300}}>
          "We meten niet om te rapporteren.<br/>We meten om te <strong style={{fontStyle:"normal",fontWeight:700,color:"white"}}>bewijzen</strong> dat het werkt — en dan <strong style={{fontStyle:"normal",fontWeight:700,color:"white"}}>nooit meer terug</strong> te gaan."
        </div>
        <div style={{fontSize:10,color:"#475569",marginTop:8,letterSpacing:1,fontFamily:"'JetBrains Mono',monospace"}}>JOLIEN · PROJECTMANAGER COLAS · ZWIJNDRECHT 2025</div>
      </div>
    </div>

    {/* Pijn vs. Winst */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:2,marginBottom:2}}>
      <Card>
        <CardHead color="#1a0a0a">🔴 VANDAAG — ELK ADRES KOST</CardHead>
        <div style={{padding:14}}>
          {["Foto's via WhatsApp, papieren notities op werf","Werfleider sorteert dagelijks 15-30 min berichten","Dubbele invoer: werf → admin → Geo-IT → Excel","Elke Vlario-fiche: 15-30 min handwerk","Restpunten vergeten, deadlines gemist","Junior deeltijds → dingen vallen weg"].map(t=>(
            <div key={t} style={{display:"flex",gap:8,padding:"5px 0",borderBottom:"1px solid #1a0f0f",fontSize:12,color:"#94a3b8"}}>
              <span style={{color:"#ef4444",fontWeight:700,flexShrink:0}}>✕</span>{t}
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <CardHead color="#0a1a0f">🟢 NA AUTOMATISERING</CardHead>
        <div style={{padding:14}}>
          {["QR-code scan op smartphone → formulier klaar","Alles verwerkt in <60 sec door Power Automate","Vlario-fiche automatisch aangemaakt als PDF","Vorderingsstaat genereert zichzelf elke maandag","Restpunten escaleren automatisch bij deadline","Planning en stock altijd up-to-date"].map(t=>(
            <div key={t} style={{display:"flex",gap:8,padding:"5px 0",borderBottom:"1px solid #0a1a0f",fontSize:12,color:"#94a3b8"}}>
              <span style={{color:"#22c55e",fontWeight:700,flexShrink:0}}>✓</span>{t}
            </div>
          ))}
        </div>
      </Card>
    </div>

    {/* Tijdsvergelijking */}
    <div style={{background:"#0a0f1a",border:"1px solid #1e293b",padding:"24px",display:"grid",gridTemplateColumns:"1fr 60px 1fr",alignItems:"center",gap:12,marginBottom:2}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:80,fontWeight:900,color:"#ef4444",lineHeight:1}}>125</div>
        <div style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"#475569"}}>min / aansluiting</div>
        <div style={{fontSize:11,color:"#334155",marginTop:4}}>Papier · WhatsApp · dubbele invoer</div>
      </div>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:40,color:"#334155",textAlign:"center"}}>→</div>
      <div style={{textAlign:"center"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:80,fontWeight:900,color:"#22c55e",lineHeight:1}}>5</div>
        <div style={{fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"#475569"}}>min / aansluiting</div>
        <div style={{fontSize:11,color:"#334155",marginTop:4}}>Formulier invullen · automatische fiche</div>
      </div>
    </div>
    <div style={{background:"#e8401c",padding:"12px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:900,color:"white"}}>425 UUR BESPAARD OP ZWIJNDRECHT ALLEEN</div>
      <div style={{fontSize:12,color:"rgba(255,255,255,.7)",maxWidth:280,textAlign:"right"}}>Dat is &gt;10 voltijdse werkweken — met exact dezelfde mensen en M365-tools die Colas al betaalt</div>
    </div>

    {/* KPI's */}
    <StatRow items={[
      {lbl:"Tijdsbesparing/fiche",val:"97%",    c:"#e8401c"},
      {lbl:"Extra licentiekosten",val:"€ 0",    c:"#22c55e"},
      {lbl:"Opbouwtijd (eenmalig)",val:"6 uur", c:"#3b82f6"},
      {lbl:"Live na pilootweek",   val:"1 week",c:"#f59e0b"},
    ]}/>

    {/* 5 Flows */}
    <Card style={{marginBottom:12}}>
      <CardHead>5 GEAUTOMATISEERDE FLOWS · MICROSOFT 365</CardHead>
      <div style={{padding:12,display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
        {[
          {n:"01",t:"Huisaansluitingen + Vlario",tr:"Forms ingediend",c:"#e8401c",st:["Auto-ID aangemaakt (ZW-F1-001)","44 velden ingevuld in Word-template","PDF → SharePoint + e-mail Junior/Jolien","Register bijgewerkt, status: Aangemaakt"]},
          {n:"02",t:"Weekplanning",              tr:"Vrijdag 15:00",  c:"#3b82f6",st:["Openstaande adressen per fase ophalen","Prioritering: fase → datum → blokkering","Planning-Excel bijgewerkt","Teams-bericht volgende week verstuurd"]},
          {n:"03",t:"Restpunten & Escalatie",    tr:"Dagelijks 08:00",c:"#f97316",st:["Deadline morgen → herinnering","Deadline verstreken → escalatie Jolien","Kritiek >48u → directe Teams-mention","Opgelost → archivering + dashboard"]},
          {n:"04",t:"Vorderingsstaten",           tr:"Maandag 07:00",  c:"#a78bfa",st:["Statistieken per fase berekend","Word-template ingevuld","PDF → SharePoint + e-mail Jolien"]},
          {n:"05",t:"Nutsleidingen Alerts",       tr:"Dagelijks 07:30",c:"#f59e0b",st:["7 dagen voor uitvoering → alert","Vertraagd → HA's markeren als geblokkeerd"]},
          {n:"06",t:"Piloot Meting",              tr:"Elke inzending + VR 16:00",c:"#22c55e",st:["Doorlooptijd T2−T1 meten","Volledigheid % berekenen","Weekrapport VR 16:00 → Jolien"]},
        ].map(({n,t,tr,c,st})=>(
          <div key={n} style={{background:"#0a0f1a",border:`1px solid ${c}20`,borderLeft:`3px solid ${c}`,borderRadius:4,overflow:"hidden"}}>
            <div style={{background:c+"15",padding:"8px 12px",display:"flex",gap:10,alignItems:"center"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:900,color:c+"40",lineHeight:1}}>{n}</div>
              <div>
                <div style={{fontWeight:700,fontSize:12,color:"#e2e8f0"}}>{t}</div>
                <div style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:c,marginTop:1}}>{tr}</div>
              </div>
            </div>
            <div style={{padding:"8px 12px"}}>
              {st.map((s,i)=>(
                <div key={i} style={{display:"flex",gap:6,fontSize:11,color:"#64748b",padding:"3px 0",borderBottom:i<st.length-1?"1px solid #1e293b":"none"}}>
                  <span style={{color:c,flexShrink:0,fontWeight:700}}>{i+1}</span>{s}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>

    {/* Implementatieplan */}
    <Card>
      <CardHead>IMPLEMENTATIEPLAN — 4 WEKEN</CardHead>
      <div style={{padding:12,display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
        {[
          {f:"A",w:"Week 1-2",t:"Fundament",c:"#3b82f6",items:["SharePoint structuur","Excel-registers","Teams-kanalen","MS Forms + QR-code"]},
          {f:"B",w:"Week 2-3",t:"Kern-flows",c:"#e8401c",items:["Flow 1: Intake + Vlario","Vlario Word-template","Flow 3: Restpunten","Testen Zwijndrecht F1"]},
          {f:"C",w:"Week 3-4",t:"Rapportage",c:"#f59e0b",items:["Flow 2: Planning","Flow 4: Vorderingsstaten","Flow 5: Nutsleidingen","Stock dashboard"]},
          {f:"D",w:"Week 5-6",t:"Go-Live",   c:"#22c55e",items:["Testen productiescenario","Training Olivier & Junior","Historische data invoer","Go / No-Go beslissing"]},
        ].map(({f,w,t,c,items})=>(
          <div key={f} style={{background:"#0a0f1a",borderRadius:4,overflow:"hidden"}}>
            <div style={{background:c,padding:"8px 12px",display:"flex",alignItems:"center",gap:8}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:32,fontWeight:900,color:"rgba(255,255,255,.3)",lineHeight:1}}>{f}</div>
              <div><div style={{fontWeight:800,fontSize:12,color:"white"}}>{t}</div><div style={{fontSize:10,color:"rgba(255,255,255,.6)"}}>{w}</div></div>
            </div>
            <div style={{padding:"8px 12px"}}>
              {items.map(it=><div key={it} style={{fontSize:11,color:"#64748b",padding:"3px 0",borderBottom:"1px solid #1e293b",display:"flex",gap:6}}><span style={{color:c}}>→</span>{it}</div>)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 2 — WERF: HUISAANSLUITING REGISTRATIE
// ═══════════════════════════════════════════════════════════════════════════
const WERF_STEPS=["Project","GPS","Hoofdriool","HA","Kolken","Materialen","Foto's","Overzicht"];

const WerfModule=({onSubmit})=>{
  const [step,setStep]=useState(0);
  const [d,setD]=useState({
    project:"Zwijndrecht",fase:"",straat:"",huisnr:"",bus:"",datum:TODAY,uitvoerder:"",rol:"werfleider",
    x:"",y:"",z_taw:"",put_af_nr:"",put_op_nr:"",afst_put_af:"",afst_put_op:"",afst_gevel:"",afst_rooilijn:"",
    type_riool:"gescheiden – nieuw",diam_hoofd:"200",mat_hoofd:"PVC",
    diepte_inlaat:"",diepte_put_af:"",diepte_put_op:"",lengte:"",helling:"",
    type_ha:"DWA + RWA (gescheiden)",diam_ha:"160",mat_ha:"PVC (standaard)",
    diepte_ha:"",ligging_ha:"rijweg – asfalt",hoek:"45",type_aansl:"gewone aansluiting – haaks",terugslagklep:"nee",
    kolk_type:"standaard",kolk_d:"400",kolk_diepte:"",kolk_gevel:"",kolk_boord:"",
    m1_buis:"",m1_b45:"",m1_b90:"",m1_ts:"",m1_kop:"",m1_mof:"",m1_ip400:"",m1_ip600:"",
    m2_buis160:"",m2_b15:"",m2_b30:"",m2_b45:"",m2_b90:"",m2_ts160:"",m2_tsip:"",m2_kop:"",m2_mof:"",m2_krm:"",
    m2_r160_110:"",m2_r110_90:"",m2_r110_80:"",m2_ha_d:"400",m2_ha_st:"",
    m3_buis110:"",m3_b45_110:"",m3_b90_110:"",m3_ts110:"",m3_buis90:"",m3_b45_90:"",m3_b90_90:"",
    km_buis160:"",km_b15:"",km_b30:"",km_b45:"",km_b90:"",km_ts160:"",km_tsip:"",km_kop:"",km_mof:"",km_krm:"",
    km_buis110:"",km_b45_110:"",km_b90_110:"",km_ts110:"",
    fotos:[null,null,null,null],
    opmerking:""
  });
  const u=(k,v)=>setD(p=>({...p,[k]:v}));
  const uf=(i,v)=>setD(p=>{const f=[...p.fotos];f[i]=v;return{...p,fotos:f};});

  // Volledigheid
  const req=["straat","huisnr","datum","uitvoerder","diepte_ha","ligging_ha"];
  const pct=Math.round((req.filter(k=>d[k]&&String(d[k]).trim()).length/req.length)*100);

  const screens=[
    // 0 Project
    <div key="p">
      <R2><Sel label="Project" req value={d.project} onChange={v=>{u("project",v);u("fase","");}} options={["Zwijndrecht","Puurs"]}/><Sel label="Fase" req value={d.fase} onChange={v=>u("fase",v)} options={["Kies...", ...(FASEN[d.project]||[])]}/></R2>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:8}}><Inp label="Straatnaam" req value={d.straat} onChange={v=>u("straat",v)} placeholder="Bareelstraat"/><Inp label="Huisnr" req value={d.huisnr} onChange={v=>u("huisnr",v)} placeholder="12"/></div>
      <R2><Inp label="Datum" req type="date" value={d.datum} onChange={v=>u("datum",v)}/><Inp label="Uitvoerder" req value={d.uitvoerder} onChange={v=>u("uitvoerder",v)} placeholder="Naam"/></R2>
      <R2><Sel label="Rol" value={d.rol} onChange={v=>u("rol",v)} options={["werfleider","ploegbaas","arbeider","onderaannemer"]}/><Inp label="Bus/toevoeging" value={d.bus} onChange={v=>u("bus",v)} placeholder="optioneel"/></R2>
    </div>,
    // 1 GPS
    <div key="g">
      <InfoBox><strong>GPS meetstok (Topcon) of landmeter.</strong> Ploeg kan leeg laten.</InfoBox>
      <R3><Inp label="X Lambert72" value={d.x} onChange={v=>u("x",v)} placeholder="152345.234" hint="6 decimalen"/><Inp label="Y Lambert72" value={d.y} onChange={v=>u("y",v)} placeholder="203456.789" hint="6 decimalen"/><Inp label="Z TAW" value={d.z_taw} onChange={v=>u("z_taw",v)} unit="m" placeholder="5.23"/></R3>
      <R2><Inp label="Put stroomaf (nr)" value={d.put_af_nr} onChange={v=>u("put_af_nr",v)} placeholder="P12"/><Inp label="Put stroomop (nr)" value={d.put_op_nr} onChange={v=>u("put_op_nr",v)} placeholder="P13"/></R2>
      <R2><Inp label="Afstand put stroomaf" value={d.afst_put_af} onChange={v=>u("afst_put_af",v)} unit="m" type="number" step="0.01"/><Inp label="Afstand put stroomop" value={d.afst_put_op} onChange={v=>u("afst_put_op",v)} unit="m" type="number" step="0.01"/></R2>
      <R2><Inp label="Afstand rechter gevel" value={d.afst_gevel} onChange={v=>u("afst_gevel",v)} unit="m" type="number" step="0.01" hint="HA-putje tot gevel"/><Inp label="Afstand rooilijn" value={d.afst_rooilijn} onChange={v=>u("afst_rooilijn",v)} unit="m" type="number" step="0.01"/></R2>
    </div>,
    // 2 Hoofdriool
    <div key="h">
      <R3><Sel label="Type riolering" value={d.type_riool} onChange={v=>u("type_riool",v)} options={["gescheiden – nieuw","gescheiden – relining","gemengd – bestaand","DWA enkel","RWA enkel"]}/><Sel label="Diameter" value={d.diam_hoofd} onChange={v=>u("diam_hoofd",v)} options={["160","200","250","300","315","400","500","600","700","800","900"]} hint="mm"/><Sel label="Materiaal" value={d.mat_hoofd} onChange={v=>u("mat_hoofd",v)} options={["PVC","Beton","Gres","PP","PE","GVK","Gietijzer"]}/></R3>
      <R3><Inp label="Diepte inlaat riool" req value={d.diepte_inlaat} onChange={v=>u("diepte_inlaat",v)} unit="m" type="number" step="0.01" hint="onderkant buis"/><Inp label="Diepte put stroomaf" value={d.diepte_put_af} onChange={v=>u("diepte_put_af",v)} unit="m" type="number" step="0.01"/><Inp label="Diepte put stroomop" value={d.diepte_put_op} onChange={v=>u("diepte_put_op",v)} unit="m" type="number" step="0.01"/></R3>
      <R2><Inp label="Lengte aangelegd" value={d.lengte} onChange={v=>u("lengte",v)} unit="lm" type="number" step="0.1"/><Inp label="Helling" value={d.helling} onChange={v=>u("helling",v)} unit="%" type="number" step="0.01" hint="min. 0.25%"/></R2>
    </div>,
    // 3 HA
    <div key="ha">
      <InfoBox color="#22c55e"><strong>📍 Ligging HA-putje is verplicht voor Vlario</strong></InfoBox>
      <R3><Sel label="Type HA" req value={d.type_ha} onChange={v=>u("type_ha",v)} options={["DWA + RWA (gescheiden)","DWA enkel","RWA enkel","Gemengd (1 buis)","Herbronnement DWA","Herbronnement RWA"]}/><Sel label="Diameter HA" value={d.diam_ha} onChange={v=>u("diam_ha",v)} options={["110","125","160","200"]} hint="mm"/><Sel label="Materiaal HA" value={d.mat_ha} onChange={v=>u("mat_ha",v)} options={["PVC (standaard)","PP","PE","Gres","Gietijzer"]}/></R3>
      <R3><Inp label="Diepte HA-putje" req value={d.diepte_ha} onChange={v=>u("diepte_ha",v)} unit="m" type="number" step="0.01" hint="bovenkant deksel"/><Sel label="Ligging HA-putje" req value={d.ligging_ha} onChange={v=>u("ligging_ha",v)} options={["rijweg – asfalt","rijweg – klinkers","rijweg – beton","trottoir – betontegel","trottoir – klinkers","trottoir – asfalt","onverharde berm","verharde berm","fietspad","oprit – asfalt","oprit – klinkers","oprit – beton","tuin","parking","andere"]}/><Sel label="Hoek" value={d.hoek} onChange={v=>u("hoek",v)} options={[{v:"45",l:"45°"},{v:"60",l:"60°"},{v:"67.5",l:"67.5°"},{v:"90",l:"90° haaks"},{v:"variabel",l:"Variabel"}]}/></R3>
      <R2><Sel label="Type aansluiting" value={d.type_aansl} onChange={v=>u("type_aansl",v)} options={["gewone aansluiting – haaks","gewone aansluiting – schuin","T-stuk in lijn","T-stuk haaks","zadel Ø200/160","zadel Ø200/110","inboormof Ø160","inboormof Ø110","Y-stuk 45°","Y-stuk 67.5°","boorkoppeling"]}/><Sel label="Terugslagklep" value={d.terugslagklep} onChange={v=>u("terugslagklep",v)} options={["nee","ja"]}/></R2>
    </div>,
    // 4 Kolken
    <div key="k">
      <R3><Sel label="Type kolk" value={d.kolk_type} onChange={v=>u("kolk_type",v)} options={["standaard","verhoogde rand","verdiept","dubbele kolk","koffer kolk"]}/><Sel label="Diameter" value={d.kolk_d} onChange={v=>u("kolk_d",v)} options={[{v:"300",l:"Ø300"},{v:"400",l:"Ø400"},{v:"500",l:"Ø500"}]}/><Inp label="Diepte kolk" value={d.kolk_diepte} onChange={v=>u("kolk_diepte",v)} unit="m" type="number" step="0.01"/></R3>
      <R2><Inp label="Afstand boord/trottoir" value={d.kolk_boord} onChange={v=>u("kolk_boord",v)} unit="m" type="number" step="0.01"/><Inp label="Afstand gevel" value={d.kolk_gevel} onChange={v=>u("kolk_gevel",v)} unit="m" type="number" step="0.01"/></R2>
      <MatCard title="Kolk – Aansluitbuis Ø160" color="#1e3a5f" data={d} upd={u}
        items={[{k:"km_buis160",l:"Buis Ø160",u:"lm"},{k:"km_b15",l:"Bocht 15°",u:"st"},{k:"km_b30",l:"Bocht 30°",u:"st"},{k:"km_b45",l:"Bocht 45°",u:"st"},{k:"km_b90",l:"Bocht 90°",u:"st"},{k:"km_ts160",l:"T-stuk",u:"st"},{k:"km_tsip",l:"T-stuk IP",u:"st"},{k:"km_kop",l:"Koppelstuk",u:"st"},{k:"km_mof",l:"Mof",u:"st"},{k:"km_krm",l:"Krimpmof",u:"st"}]}/>
      <MatCard title="Kolk – Ø110" color="#1a3a1a" data={d} upd={u}
        items={[{k:"km_buis110",l:"Buis Ø110",u:"lm"},{k:"km_b45_110",l:"Bocht 45°",u:"st"},{k:"km_b90_110",l:"Bocht 90°",u:"st"},{k:"km_ts110",l:"T-stuk",u:"st"}]}/>
    </div>,
    // 5 Materialen
    <div key="m">
      <MatCard title={`Deel 1 – Hoofdriool Ø${d.diam_hoofd}`} color="#3d1f0a" data={d} upd={u}
        items={[{k:"m1_buis",l:`Buis Ø${d.diam_hoofd}`,u:"lm"},{k:"m1_b45",l:"Bocht 45°",u:"st"},{k:"m1_b90",l:"Bocht 90°",u:"st"},{k:"m1_ts",l:"T-stuk",u:"st"},{k:"m1_kop",l:"Koppelstuk",u:"st"},{k:"m1_mof",l:"Mof",u:"st"},{k:"m1_ip400",l:"Insp.put Ø400",u:"st"},{k:"m1_ip600",l:"Insp.put Ø600",u:"st"}]}/>
      <MatCard title="Deel 2 – Huisaansluiting Ø160" color="#0a2010" data={d} upd={u}
        items={[{k:"m2_buis160",l:"Buis Ø160",u:"lm"},{k:"m2_b15",l:"Bocht 15°",u:"st"},{k:"m2_b30",l:"Bocht 30°",u:"st"},{k:"m2_b45",l:"Bocht 45°",u:"st"},{k:"m2_b90",l:"Bocht 90°",u:"st"},{k:"m2_ts160",l:"T-stuk Ø160",u:"st"},{k:"m2_tsip",l:"T-stuk IP",u:"st"},{k:"m2_kop",l:"Koppelstuk",u:"st"},{k:"m2_mof",l:"Mof",u:"st"},{k:"m2_krm",l:"Krimpmof",u:"st"}]}/>
      <MatCard title="Reducties" color="#1e0a3d" data={d} upd={u}
        items={[{k:"m2_r160_110",l:"160→110",u:"st"},{k:"m2_r110_90",l:"110→90",u:"st"},{k:"m2_r110_80",l:"110→80",u:"st"}]}/>
      <div style={{marginBottom:10}}>
        <Lbl>HA-putje diameter</Lbl>
        <div style={{display:"flex",gap:6}}>
          {["400","500","600","800"].map(v=><button key={v} onClick={()=>u("m2_ha_d",v)}
            style={{flex:1,padding:"8px",border:`1.5px solid ${d.m2_ha_d===v?"#e8401c":"#334155"}`,borderRadius:6,
              background:d.m2_ha_d===v?"#e8401c20":"#0f172a",color:d.m2_ha_d===v?"#fb923c":"#64748b",fontWeight:700,fontSize:12,cursor:"pointer"}}>Ø{v}</button>)}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
        <Num label="HA-putje + deksel (st)" value={d.m2_ha_st||0} onChange={v=>u("m2_ha_st",v)}/>
      </div>
      <MatCard title="Kleine diameters – vertakking woning" color="#1a1a0a" data={d} upd={u}
        items={[{k:"m3_buis110",l:"Buis Ø110",u:"lm"},{k:"m3_b45_110",l:"Bocht 45° Ø110",u:"st"},{k:"m3_b90_110",l:"Bocht 90° Ø110",u:"st"},{k:"m3_ts110",l:"T-stuk Ø110",u:"st"},{k:"m3_buis90",l:"Buis Ø90",u:"lm"},{k:"m3_b45_90",l:"Bocht 45° Ø90",u:"st"},{k:"m3_b90_90",l:"Bocht 90° Ø90",u:"st"}]}/>
    </div>,
    // 6 Foto's
    <div key="f">
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
        {d.fotos.map((f,i)=><FotoSlot key={i} index={i} foto={f} label={["Boring/uitgraving","Plaatsing buis","Verbinding privé","Omhulling/afwerking"][i]} onChange={uf}/>)}
      </div>
      <Inp label="Opmerkingen" value={d.opmerking} onChange={v=>u("opmerking",v)} placeholder="Afwijkingen, bijzonderheden..."/>
    </div>,
    // 7 Overzicht
    <div key="o">
      {/* Volledigheid */}
      <div style={{background:"#0a0f1a",border:"1px solid #1e293b",borderRadius:8,padding:14,marginBottom:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <span style={{fontSize:12,fontWeight:700,color:"#94a3b8"}}>Volledigheid formulier</span>
          <span style={{fontSize:20,fontWeight:800,color:pct>=90?"#22c55e":pct>=60?"#f97316":"#ef4444"}}>{pct}%</span>
        </div>
        <div style={{height:6,background:"#1e293b",borderRadius:3,overflow:"hidden"}}>
          <div style={{height:"100%",width:pct+"%",background:pct>=90?"#22c55e":pct>=60?"#f97316":"#ef4444",borderRadius:3,transition:"width .4s"}}/>
        </div>
        <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>
          <Tag color={d.x&&d.y?"#22c55e":"#ef4444"}>{d.x&&d.y?"✓ GPS":"⚠ Geen GPS"}</Tag>
          <Tag color={d.fotos.filter(Boolean).length===4?"#22c55e":"#f97316"}>{d.fotos.filter(Boolean).length}/4 foto's</Tag>
          <Tag color={d.diepte_ha?"#22c55e":"#ef4444"}>{d.diepte_ha?"✓ Diepte HA":"⚠ Diepte HA"}</Tag>
          <Tag color={d.ligging_ha?"#22c55e":"#f97316"}>{d.ligging_ha||"Ligging HA ?"}</Tag>
        </div>
      </div>
      {/* Materialen samenvatting */}
      <Card style={{marginBottom:10}}>
        <CardHead>MATERIALEN SAMENVATTING → VORDERINGSSTAAT</CardHead>
        <div style={{padding:10,display:"grid",gridTemplateColumns:"1fr 1fr",gap:0}}>
          {[
            [`Buis Ø${d.diam_hoofd}`,d.m1_buis||0,"lm"],
            ["Buis Ø160",d.m2_buis160||0,"lm"],
            ["Buis Ø110",d.m3_buis110||0,"lm"],
            ["Bochten Ø160",[d.m2_b15,d.m2_b30,d.m2_b45,d.m2_b90].reduce((a,b)=>a+(parseInt(b)||0),0),"st"],
            ["T-stuk Ø160",d.m2_ts160||0,"st"],
            ["T-stuk IP Ø160",d.m2_tsip||0,"st"],
            ["Reducties",[d.m2_r160_110,d.m2_r110_90,d.m2_r110_80].reduce((a,b)=>a+(parseInt(b)||0),0),"st"],
            ["Inspectieputten",(parseInt(d.m1_ip400)||0)+(parseInt(d.m1_ip600)||0),"st"],
            ["HA-putje",d.m2_ha_st||0,"st"],
            ["Kolken Ø160 buis",d.km_buis160||0,"lm"],
          ].map(([lbl,val,eh])=>(
            <div key={lbl} style={{display:"flex",justifyContent:"space-between",padding:"6px 10px",borderBottom:"1px solid #1e293b",fontSize:12}}>
              <span style={{color:"#64748b"}}>{lbl}</span>
              <span style={{fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:"#e2e8f0"}}>{val} <span style={{fontSize:10,color:"#334155"}}>{eh}</span></span>
            </div>
          ))}
        </div>
      </Card>
      <button onClick={()=>{onSubmit({...d,id:`ZW-F-${Date.now()}`,savedAt:TODAY});setStep(0);setD(p=>({...p,straat:"",huisnr:"",bus:"",opmerking:"",fotos:[null,null,null,null]}));}}
        style={{width:"100%",padding:14,background:"#22c55e",color:"white",border:"none",borderRadius:8,fontSize:15,fontWeight:800,cursor:"pointer",boxShadow:"0 2px 12px rgba(34,197,94,.25)"}}>
        ✓ Opslaan & Indienen — naar Vorderingen
      </button>
    </div>
  ];

  return(
    <div style={{animation:"fadeIn .3s ease"}}>
      {/* Header met voortgang */}
      <div style={{background:"#0a0f1a",border:"1px solid #1e293b",borderRadius:8,padding:"12px 14px",marginBottom:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:800,color:"white"}}>Huisaansluiting Registratie</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:800,color:pct>=90?"#22c55e":pct>=60?"#f97316":"#ef4444"}}>{pct}%</div>
        </div>
        <div style={{display:"flex",gap:2}}>
          {WERF_STEPS.map((s,i)=>(
            <button key={i} onClick={()=>setStep(i)} title={s}
              style={{flex:1,height:4,border:"none",borderRadius:2,cursor:"pointer",
                background:i===step?"#e8401c":i<step?"#22c55e":"#1e293b",transition:"background .2s"}}/>
          ))}
        </div>
        <div style={{fontSize:11,color:"#475569",marginTop:5}}>{step+1}/{WERF_STEPS.length} — {WERF_STEPS[step]}</div>
      </div>
      <div style={{background:"#0d1424",border:"1px solid #1e293b",borderRadius:8,padding:"16px 14px",marginBottom:10}}>
        {screens[step]}
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0}
          style={{flex:1,padding:12,border:"1.5px solid #334155",borderRadius:8,background:step>0?"#1e293b":"#0a0f1a",
            color:step>0?"#e2e8f0":"#334155",fontWeight:700,fontSize:13,cursor:step>0?"pointer":"default"}}>← Vorige</button>
        {step<WERF_STEPS.length-1?(
          <button onClick={()=>setStep(s=>s+1)}
            style={{flex:2,padding:12,border:"none",borderRadius:8,background:"#e8401c",color:"white",fontWeight:800,fontSize:14,cursor:"pointer",boxShadow:"0 2px 8px rgba(232,64,28,.3)"}}>
            {WERF_STEPS[step+1]} →
          </button>
        ):(
          <button onClick={()=>{onSubmit({...d,id:`ZW-F-${Date.now()}`,savedAt:TODAY});}}
            style={{flex:2,padding:12,border:"none",borderRadius:8,background:"#22c55e",color:"white",fontWeight:800,fontSize:14,cursor:"pointer"}}>
            ✓ Indienen
          </button>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 3 — GPS / LANDMETER
// ═══════════════════════════════════════════════════════════════════════════
const GPS_STEPS=["Project","Putten","Afstanden","Diepte & Helling","As-Built","Foto's"];

const GPSModule=({onSave})=>{
  const mkPut=(nr="")=>({nr,x:"",y:"",z:"",deksel:"",inv_in:"",inv_uit:"",d:"400",opm:""});
  const [step,setStep]=useState(0);
  const [d,setD]=useState({project:"Zwijndrecht",fase:"",datum:TODAY,uitvoerder:"",instrument:"Topcon Hyper GPS",
    putten:[mkPut("P01"),mkPut("P02")],
    afst_pp:"",afst_gevel:"",afst_rooilijn:"",afst_ha_af:"",afst_ha_op:"",
    dmin:"",dmax:"",lengte:"",helling:"",helling_vereist:"0.30",helling_ok:"",
    ab_plan:"",ab_rooilijn:"",ab_kabels:"",ab_verbonden:"",ab_opm:"",
    fotos:[null,null,null,null,null,null],opmerking:""
  });
  const u=(k,v)=>setD(p=>({...p,[k]:v}));
  const uf=(i,v)=>setD(p=>{const f=[...p.fotos];f[i]=v;return{...p,fotos:f};});
  const updPut=(i,p)=>setD(dd=>{const arr=[...dd.putten];arr[i]=p;return{...dd,putten:arr};});

  const p0=d.putten[0],pN=d.putten[d.putten.length-1];
  const hCalc=(p0?.inv_uit&&pN?.inv_in&&d.afst_pp)
    ?(((parseFloat(p0.inv_uit)-parseFloat(pN.inv_in))/parseFloat(d.afst_pp))*100).toFixed(3):null;

  const ChkRow=({label,k,hint})=>(
    <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"9px 0",borderBottom:"1px solid #1e293b"}}>
      <div style={{display:"flex",gap:4,flexShrink:0}}>
        {["ok","nok","n/a"].map(v=>(
          <button key={v} onClick={()=>u(k,v)}
            style={{padding:"4px 8px",border:"1.5px solid",borderRadius:4,fontSize:10,fontWeight:700,cursor:"pointer",
              borderColor:d[k]===v?(v==="ok"?"#22c55e":v==="nok"?"#ef4444":"#f97316"):"#334155",
              background:d[k]===v?(v==="ok"?"#14532d":v==="nok"?"#450a0a":"#431407"):"#0f172a",
              color:d[k]===v?(v==="ok"?"#4ade80":v==="nok"?"#f87171":"#fb923c"):"#475569"}}>
            {v==="ok"?"✓ OK":v==="nok"?"✗ NOK":"—"}
          </button>
        ))}
      </div>
      <div><div style={{fontSize:12,fontWeight:600,color:"#e2e8f0"}}>{label}</div>{hint&&<div style={{fontSize:10,color:"#475569",marginTop:1}}>{hint}</div>}</div>
    </div>
  );

  const screens=[
    <div key="proj">
      <R2><Sel label="Project" req value={d.project} onChange={v=>{u("project",v);u("fase","");}} options={["Zwijndrecht","Puurs"]}/><Sel label="Fase" req value={d.fase} onChange={v=>u("fase",v)} options={["Kies...",...(FASEN[d.project]||[])]}/></R2>
      <R2><Inp label="Datum" type="date" value={d.datum} onChange={v=>u("datum",v)}/><Sel label="Instrument" value={d.instrument} onChange={v=>u("instrument",v)} options={["Topcon Hyper GPS","Leica TS16","Trimble R10","Ander GPS-toestel"]}/></R2>
      <Inp label="Uitvoerder (landmeter / werfleider)" req value={d.uitvoerder} onChange={v=>u("uitvoerder",v)} placeholder="Naam"/>
    </div>,
    <div key="putten">
      <InfoBox><strong>Lambert72:</strong> min. 6 decimalen verplicht voor Vlario-upload.</InfoBox>
      {d.putten.map((p,i)=>(
        <Card key={i} style={{marginBottom:8}}>
          <div style={{background:"#1e3a5f",padding:"8px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <input value={p.nr} onChange={e=>updPut(i,{...p,nr:e.target.value})} placeholder="Putnummer"
              style={{background:"transparent",border:"none",color:"#e2e8f0",fontWeight:700,fontSize:14,outline:"none",width:160}}/>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              <select value={p.d} onChange={e=>updPut(i,{...p,d:e.target.value})}
                style={{padding:"3px 6px",background:"#0f172a",border:"1px solid #334155",color:"#e2e8f0",borderRadius:3,fontSize:11}}>
                {["400","600","800","1000"].map(v=><option key={v} value={v}>Ø{v}</option>)}
              </select>
              {d.putten.length>1&&<button onClick={()=>setD(dd=>({...dd,putten:dd.putten.filter((_,j)=>j!==i)}))}
                style={{background:"#ef444420",border:"1px solid #ef444440",color:"#f87171",borderRadius:3,width:24,height:24,cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>}
            </div>
          </div>
          <div style={{padding:"10px 12px 2px"}}>
            <R3><Inp label="X Lambert72" req value={p.x} onChange={v=>updPut(i,{...p,x:v})} placeholder="152345.234"/><Inp label="Y Lambert72" req value={p.y} onChange={v=>updPut(i,{...p,y:v})} placeholder="203456.789"/><Inp label="Z TAW" req value={p.z} onChange={v=>updPut(i,{...p,z:v})} unit="m" placeholder="5.23"/></R3>
            <R3><Inp label="Deksel TAW" value={p.deksel} onChange={v=>updPut(i,{...p,deksel:v})} unit="m"/><Inp label="Invert IN" value={p.inv_in} onChange={v=>updPut(i,{...p,inv_in:v})} unit="m TAW"/><Inp label="Invert UIT" value={p.inv_uit} onChange={v=>updPut(i,{...p,inv_uit:v})} unit="m TAW"/></R3>
          </div>
        </Card>
      ))}
      <button onClick={()=>setD(dd=>({...dd,putten:[...dd.putten,mkPut(`P0${dd.putten.length+1}`)]}))}
        style={{width:"100%",padding:10,border:"1.5px dashed #1e3a5f",borderRadius:6,background:"#0a1929",color:"#60a5fa",fontWeight:700,fontSize:12,cursor:"pointer"}}>
        + Inspectieput toevoegen
      </button>
    </div>,
    <div key="afst">
      <Inp label="Put-tot-put afstand (as)" req value={d.afst_pp} onChange={v=>u("afst_pp",v)} unit="m" type="number" step="0.01" hint="hartlijn → hartlijn"/>
      <R2><Inp label="Afstand rechter gevel" req value={d.afst_gevel} onChange={v=>u("afst_gevel",v)} unit="m" type="number" step="0.01" hint="HA-putje tot gevel"/><Inp label="Afstand rooilijn" req value={d.afst_rooilijn} onChange={v=>u("afst_rooilijn",v)} unit="m" type="number" step="0.01"/></R2>
      <R2><Inp label="Afstand HA-putje stroomaf" value={d.afst_ha_af} onChange={v=>u("afst_ha_af",v)} unit="m" type="number" step="0.01" hint="Vlario G10"/><Inp label="Afstand HA-putje stroomop" value={d.afst_ha_op} onChange={v=>u("afst_ha_op",v)} unit="m" type="number" step="0.01" hint="Vlario I10"/></R2>
    </div>,
    <div key="diep">
      <R3><Inp label="Diepte min" req value={d.dmin} onChange={v=>u("dmin",v)} unit="m" type="number" step="0.01"/><Inp label="Diepte max" value={d.dmax} onChange={v=>u("dmax",v)} unit="m" type="number" step="0.01"/><Inp label="Lengte gemeten" value={d.lengte} onChange={v=>u("lengte",v)} unit="lm" type="number" step="0.1"/></R3>
      <R2><Inp label="Helling vereist (min)" value={d.helling_vereist} onChange={v=>u("helling_vereist",v)} unit="%" type="number" step="0.01"/><Inp label="Helling gemeten" req value={d.helling} onChange={v=>u("helling",v)} unit="%" type="number" step="0.001"/></R2>
      {hCalc&&<div style={{background:parseFloat(hCalc)>=parseFloat(d.helling_vereist)?"#14532d30":"#450a0a30",border:`1px solid ${parseFloat(hCalc)>=parseFloat(d.helling_vereist)?"#22c55e40":"#ef444440"}`,borderRadius:6,padding:"10px 12px",marginBottom:10}}>
        <div style={{fontSize:10,letterSpacing:1,textTransform:"uppercase",color:parseFloat(hCalc)>=parseFloat(d.helling_vereist)?"#4ade80":"#f87171",fontWeight:700,marginBottom:3}}>Auto-berekening</div>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:22,fontWeight:700,color:parseFloat(hCalc)>=parseFloat(d.helling_vereist)?"#4ade80":"#f87171"}}>{hCalc}% {parseFloat(hCalc)>=parseFloat(d.helling_vereist)?"✓ OK":"⚠ ONDER MINIMUM"}</div>
      </div>}
      <div style={{display:"flex",gap:6}}>
        {["ok","nok","twijfel"].map(v=><button key={v} onClick={()=>u("helling_ok",v)}
          style={{flex:1,padding:"10px",border:"1.5px solid",borderRadius:6,fontWeight:700,fontSize:12,cursor:"pointer",
            borderColor:d.helling_ok===v?(v==="ok"?"#22c55e":v==="nok"?"#ef4444":"#f97316"):"#334155",
            background:d.helling_ok===v?(v==="ok"?"#14532d":v==="nok"?"#450a0a":"#431407"):"#0f172a",
            color:d.helling_ok===v?(v==="ok"?"#4ade80":v==="nok"?"#f87171":"#fb923c"):"#64748b"}}>
          {v==="ok"?"✓ OK":v==="nok"?"✗ NOK":"? Twijfel"}
        </button>)}
      </div>
    </div>,
    <div key="ab">
      <ChkRow label="Ligging conform uitvoeringsplan" k="ab_plan" hint="Putten & leidingen op correcte positie"/>
      <ChkRow label="Rooilijn vrij — geen inname privé-terrein" k="ab_rooilijn"/>
      <ChkRow label="Kruisende kabels / leidingen vrij" k="ab_kabels"/>
      <ChkRow label="Riool correct verbonden op collector" k="ab_verbonden" hint="DWA op DWA, RWA op RWA"/>
      <div style={{marginTop:10}}><Inp label="Opmerkingen" value={d.ab_opm} onChange={v=>u("ab_opm",v)} placeholder="Afwijkingen..."/></div>
    </div>,
    <div key="f">
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
        {d.fotos.map((f,i)=><FotoSlot key={i} index={i} foto={f} label={["Put stroomaf (voor)","Put stroomop (voor)","Aanleg bovenaanzicht","Aanleg zijaanzicht","HA-putje locatie","Opmeting/schetsboek"][i]} onChange={uf}/>)}
      </div>
      <Inp label="Opmerkingen dossier" value={d.opmerking} onChange={v=>u("opmerking",v)} placeholder="Bijzonderheden..."/>
      <button onClick={()=>{onSave({...d,savedAt:TODAY});}}
        style={{width:"100%",marginTop:8,padding:13,background:"#22c55e",color:"white",border:"none",borderRadius:8,fontSize:14,fontWeight:800,cursor:"pointer",boxShadow:"0 2px 10px rgba(34,197,94,.25)"}}>
        ✓ GPS Rapport Opslaan
      </button>
    </div>
  ];

  return(
    <div style={{animation:"fadeIn .3s ease"}}>
      <div style={{background:"#0a0f1a",border:"1px solid #1e293b",borderRadius:8,padding:"12px 14px",marginBottom:10}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:17,fontWeight:800,color:"white",marginBottom:8}}>GPS Meting — Landmeter / Werfleider</div>
        <div style={{display:"flex",gap:2}}>
          {GPS_STEPS.map((s,i)=><button key={i} onClick={()=>setStep(i)} title={s}
            style={{flex:1,height:4,border:"none",borderRadius:2,cursor:"pointer",
              background:i===step?"#3b82f6":i<step?"#22c55e":"#1e293b",transition:"background .2s"}}/>)}
        </div>
        <div style={{fontSize:11,color:"#475569",marginTop:5}}>{step+1}/{GPS_STEPS.length} — {GPS_STEPS[step]}</div>
      </div>
      <div style={{background:"#0d1424",border:"1px solid #1e293b",borderRadius:8,padding:"16px 14px",marginBottom:10}}>{screens[step]}</div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0}
          style={{flex:1,padding:12,border:"1.5px solid #334155",borderRadius:8,background:step>0?"#1e293b":"#0a0f1a",color:step>0?"#e2e8f0":"#334155",fontWeight:700,fontSize:13,cursor:step>0?"pointer":"default"}}>← Vorige</button>
        {step<GPS_STEPS.length-1&&<button onClick={()=>setStep(s=>s+1)}
          style={{flex:2,padding:12,border:"none",borderRadius:8,background:"#3b82f6",color:"white",fontWeight:800,fontSize:13,cursor:"pointer"}}>
          {GPS_STEPS[step+1]} →
        </button>}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 4 — STOCK
// ═══════════════════════════════════════════════════════════════════════════
const StockModule=({vorderingen})=>{
  const [stock,setStock]=useState(STOCK_DATA);
  const [filter,setFilter]=useState("allen");
  const [search,setSearch]=useState("");
  const [editId,setEditId]=useState(null);
  const [editVal,setEditVal]=useState({});

  // PVC verbruik auto uit vorderingen
  const verbruik={
    B200:pvcSum(vorderingen,"buis200"), B160:pvcSum(vorderingen,"buis160"),
    B110:pvcSum(vorderingen,"buis110"), B90:pvcSum(vorderingen,"buis90"),
    BC45_160:pvcSum(vorderingen,"bochten"), BC90_160:pvcSum(vorderingen,"bochten"),
    IP400:pvcSum(vorderingen,"ip"), IP600:pvcSum(vorderingen,"ip"),
    HAPD400:pvcSum(vorderingen,"ha"), KOLK400:pvcSum(vorderingen,"kolk"),
  };

  const cats=["allen",...Array.from(new Set(STOCK_DATA.map(s=>s.cat)))];
  const toOrder=stock.filter(s=>["leeg","kritiek","laag"].includes(alertLvl(s.stock,s.min)));
  const orderVal=toOrder.reduce((a,s)=>a+Math.max(0,s.bestel-s.stock)*s.prijs,0);
  const filtered=stock.filter(s=>(filter==="allen"||s.cat===filter)&&(!search||s.naam.toLowerCase().includes(search.toLowerCase())||s.code.toLowerCase().includes(search.toLowerCase())));

  return(
    <div style={{animation:"fadeIn .3s ease"}}>
      <StatRow items={[{lbl:"Artikelen",val:stock.length,c:"#3b82f6"},{lbl:"Alerts",val:toOrder.length,c:"#f97316"},{lbl:"Te bestellen",val:toOrder.length,c:"#ef4444"},{lbl:"Bestelwaarde",val:f€(orderVal),c:"#22c55e"}]}/>

      {toOrder.length>0&&<div style={{background:"#450a0a20",border:"1.5px solid #ef444430",borderLeft:"4px solid #ef4444",borderRadius:6,padding:"12px 14px",marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:800,color:"#f87171"}}>⚠ BESTELADVIES — {toOrder.length} artikel{toOrder.length>1?"s":""}</div>
          <button onClick={()=>{const l=["BESTELADVIES COLAS","Datum: "+TODAY,"","Artikel\tCode\tQty\tE.H.\tLeverancier\tLevertijd",...toOrder.map(s=>`${s.naam}\t${s.code}\t${Math.max(0,s.bestel-s.stock)}\t${s.eh}\t${s.lev}\t${s.lt}d`),"","Totaal: "+f€(orderVal)].join("\n");const b=new Blob([l],{type:"text/plain"});const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=`Besteladvies_${TODAY}.txt`;a.click();}}
            style={{padding:"6px 12px",background:"#ef4444",color:"white",border:"none",borderRadius:4,fontWeight:700,fontSize:11,cursor:"pointer"}}>⬇ Bestelbon</button>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {toOrder.map(s=>{const qty=Math.max(0,s.bestel-s.stock);const vbr=verbruik[s.id]||0;const c=alertClr(alertLvl(s.stock,s.min));return(
            <div key={s.id} style={{background:"#0f172a",border:`1px solid ${c}20`,borderLeft:`3px solid ${c}`,padding:"7px 10px",borderRadius:4,minWidth:150}}>
              <div style={{fontSize:10,fontFamily:"'JetBrains Mono',monospace",color:c,fontWeight:700}}>{s.code}</div>
              <div style={{fontSize:11,fontWeight:600,color:"#e2e8f0",margin:"2px 0"}}>{s.naam}</div>
              <div style={{fontSize:10,color:"#475569"}}>Stock: <strong style={{color:c}}>{s.stock}</strong>/{s.min} {s.eh}</div>
              {vbr>0&&<div style={{fontSize:10,color:"#f97316"}}>Verbruikt: {vbr} {s.eh}</div>}
              <div style={{fontSize:10,color:"#4ade80",fontWeight:700,marginTop:2}}>→ {qty} {s.eh} | {s.lev} ({s.lt}d)</div>
            </div>
          );})}
        </div>
      </div>}

      <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap",alignItems:"center"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Zoek..."
          style={{padding:"7px 10px",border:"1.5px solid #334155",borderRadius:4,fontSize:12,flex:1,minWidth:120,background:"#0f172a",color:"#e2e8f0"}}/>
        {cats.map(c=><button key={c} onClick={()=>setFilter(c)}
          style={{padding:"5px 10px",border:"1.5px solid",borderRadius:4,fontSize:10,fontWeight:700,cursor:"pointer",letterSpacing:.5,textTransform:"uppercase",
            borderColor:filter===c?"#e8401c":"#334155",background:filter===c?"#e8401c15":"#0f172a",color:filter===c?"#fb923c":"#64748b"}}>{c}</button>)}
      </div>

      <div style={{background:"#0a0f1a",border:"1px solid #1e293b",borderRadius:6,overflow:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead>
            <tr style={{background:"#0f172a"}}>
              {["","Code","Artikel","Post","Stock","Min","Verbruikt","Bestel","E.H.","Prijs","Lev.",""].map(h=>(
                <th key={h} style={{padding:"8px 9px",fontSize:9,fontWeight:700,letterSpacing:1,textTransform:"uppercase",textAlign:"left",whiteSpace:"nowrap",color:"#475569",borderBottom:"1px solid #1e293b"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s,i)=>{const lvl=alertLvl(s.stock,s.min);const isE=editId===s.id;const vbr=verbruik[s.id]||0;return(
              <tr key={s.id} style={{background:i%2?"#0a0f1a":"#0c1120",borderBottom:"1px solid #161e30"}}>
                <td style={{padding:"7px 9px"}}><Dot lvl={lvl}/></td>
                <td style={{padding:"7px 9px"}}><Tag>{s.code}</Tag></td>
                <td style={{padding:"7px 9px",fontWeight:600,color:"#e2e8f0"}}>{s.naam}</td>
                <td style={{padding:"7px 9px",fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#a78bfa"}}>{s.post}</td>
                <td style={{padding:"7px 9px"}}>{isE?<input type="number" value={editVal.stock??s.stock} onChange={e=>setEditVal(v=>({...v,stock:+e.target.value}))} style={{width:55,padding:"3px 5px",border:"1.5px solid #3b82f6",borderRadius:3,fontSize:12,textAlign:"center",background:"#0f172a",color:"#e2e8f0"}}/>:<span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:alertClr(lvl),fontSize:13}}>{s.stock}</span>}</td>
                <td style={{padding:"7px 9px",fontFamily:"'JetBrains Mono',monospace",color:"#475569"}}>{s.min}</td>
                <td style={{padding:"7px 9px",fontFamily:"'JetBrains Mono',monospace",color:vbr>0?"#fb923c":"#334155",fontWeight:vbr>0?700:400}}>{vbr>0?vbr:"—"}</td>
                <td style={{padding:"7px 9px",fontFamily:"'JetBrains Mono',monospace",color:"#60a5fa"}}>{s.bestel}</td>
                <td style={{padding:"7px 9px",color:"#475569"}}>{s.eh}</td>
                <td style={{padding:"7px 9px",fontFamily:"'JetBrains Mono',monospace",color:"#64748b",fontSize:11}}>{f€(s.prijs)}</td>
                <td style={{padding:"7px 9px",color:"#475569",fontSize:11,whiteSpace:"nowrap"}}>{s.lev} {s.lt}d</td>
                <td style={{padding:"7px 7px"}}>{isE?<div style={{display:"flex",gap:3}}><button onClick={()=>{setStock(p=>p.map(x=>x.id===editId?{...x,...editVal}:x));setEditId(null);}} style={{padding:"3px 7px",background:"#22c55e",color:"white",border:"none",borderRadius:3,cursor:"pointer",fontSize:10,fontWeight:700}}>✓</button><button onClick={()=>setEditId(null)} style={{padding:"3px 5px",background:"#1e293b",color:"#94a3b8",border:"none",borderRadius:3,cursor:"pointer",fontSize:10}}>✕</button></div>:<button onClick={()=>{setEditId(s.id);setEditVal({stock:s.stock});}} style={{padding:"3px 8px",background:"#1e3a5f",color:"#60a5fa",border:"1px solid #1e3a5f",borderRadius:3,cursor:"pointer",fontSize:9,fontWeight:700}}>Bijw.</button>}</td>
              </tr>
            );})}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 5 — VORDERINGEN + MEETSTAAT
// ═══════════════════════════════════════════════════════════════════════════
const VorderingenModule=({vorderingen})=>{
  const [posten,setPosten]=useState(MEETSTAAT_DATA.map(p=>({...p,qty:0,qty2:0})));
  const [subTab,setSubTab]=useState("v");

  const totBuis=pvcSum(vorderingen,"buis200")+pvcSum(vorderingen,"buis160")+pvcSum(vorderingen,"buis110")+pvcSum(vorderingen,"buis90");
  const totBochten=pvcSum(vorderingen,"bochten");
  const totTs=pvcSum(vorderingen,"tstuk");

  useEffect(()=>{
    setPosten(prev=>prev.map(p=>{
      if(p.post==="21.10")return{...p,qty2:totBuis};
      if(p.post==="21.20")return{...p,qty2:totBochten};
      if(p.post==="21.30")return{...p,qty2:totTs};
      if(p.post==="22.10")return{...p,qty2:pvcSum(vorderingen,"ip")};
      if(p.post==="22.20")return{...p,qty2:pvcSum(vorderingen,"ha")};
      if(p.post==="23.10")return{...p,qty2:pvcSum(vorderingen,"kolk")};
      if(p.post==="24.10")return{...p,qty2:pvcSum(vorderingen,"zand")};
      return p;
    }));
  },[vorderingen]);

  const tB=posten.reduce((a,p)=>a+p.qty*p.EP,0);
  const tV=posten.reduce((a,p)=>a+p.qty2*p.EP,0);

  return(
    <div style={{animation:"fadeIn .3s ease"}}>
      <div style={{display:"flex",gap:2,marginBottom:12}}>
        {[["v","📑 Ingediende Fiches"],["m","📋 Meetstaat & Vorderingsstaten"]].map(([k,l])=>(
          <button key={k} onClick={()=>setSubTab(k)}
            style={{flex:1,padding:"10px",border:"1.5px solid",borderRadius:6,fontWeight:700,fontSize:11,cursor:"pointer",
              borderColor:subTab===k?"#e8401c":"#334155",background:subTab===k?"#e8401c15":"#0f172a",color:subTab===k?"#fb923c":"#64748b"}}>
            {l}
          </button>
        ))}
      </div>

      {subTab==="v"&&(
        <div>
          {/* Auto PVC totalen */}
          <Card style={{marginBottom:12}}>
            <div style={{background:"#0a1929",padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #1e293b"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:800,color:"#60a5fa",letterSpacing:.5}}>⚡ AUTO PVC-VERBRUIK (uit ingediende fiches)</div>
            </div>
            <div style={{padding:10,display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
              {[
                {l:"Buis Ø200",v:pvcSum(vorderingen,"buis200"),eh:"lm",c:"#3b82f6"},
                {l:"Buis Ø160",v:pvcSum(vorderingen,"buis160"),eh:"lm",c:"#3b82f6"},
                {l:"Buis Ø110",v:pvcSum(vorderingen,"buis110"),eh:"lm",c:"#3b82f6"},
                {l:"Buis Ø90", v:pvcSum(vorderingen,"buis90"), eh:"lm",c:"#3b82f6"},
                {l:"Bochten",  v:totBochten,  eh:"st",c:"#8b5cf6"},
                {l:"T-stukken",v:totTs,        eh:"st",c:"#8b5cf6"},
                {l:"Inspectieputten",v:pvcSum(vorderingen,"ip"),eh:"st",c:"#f59e0b"},
                {l:"HA-putjes",v:pvcSum(vorderingen,"ha"),     eh:"st",c:"#f59e0b"},
                {l:"Kolken",   v:pvcSum(vorderingen,"kolk"),   eh:"st",c:"#f59e0b"},
                {l:"Zand",     v:pvcSum(vorderingen,"zand"),   eh:"m³",c:"#22c55e"},
                {l:"Totaal buis",v:totBuis,   eh:"lm",c:"#e8401c"},
              ].map(({l,v,eh,c})=>(
                <div key={l} style={{background:"#0a0f1a",padding:"7px 10px",borderRadius:4,borderLeft:`2px solid ${c}30`}}>
                  <div style={{fontSize:9,color:"#475569",textTransform:"uppercase",letterSpacing:.5,fontWeight:700}}>{l}</div>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:16,fontWeight:700,color:c,lineHeight:1.2}}>{v} <span style={{fontSize:9,color:"#334155"}}>{eh}</span></div>
                </div>
              ))}
            </div>
          </Card>
          {/* Fiche tabel */}
          <div style={{background:"#0a0f1a",border:"1px solid #1e293b",borderRadius:6,overflow:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
              <thead><tr style={{background:"#0f172a"}}>{["ID","Datum","Adres","Fase","Ø200","Ø160","Ø110","Bochten","T-stuk","IP","Zand","Status"].map(h=><th key={h} style={{padding:"7px 8px",fontSize:9,fontWeight:700,letterSpacing:.5,textTransform:"uppercase",textAlign:"left",whiteSpace:"nowrap",color:"#475569",borderBottom:"1px solid #1e293b"}}>{h}</th>)}</tr></thead>
              <tbody>
                {vorderingen.map((v,i)=>(
                  <tr key={v.id} style={{background:i%2?"#0a0f1a":"#0c1120",borderBottom:"1px solid #161e30"}}>
                    <td style={{padding:"6px 8px",fontFamily:"'JetBrains Mono',monospace",fontSize:9,fontWeight:700,color:"#a78bfa",whiteSpace:"nowrap"}}>{v.id}</td>
                    <td style={{padding:"6px 8px",color:"#475569",whiteSpace:"nowrap"}}>{v.datum}</td>
                    <td style={{padding:"6px 8px",fontWeight:600,color:"#e2e8f0"}}>{v.adres}</td>
                    <td style={{padding:"6px 8px",color:"#64748b"}}>{v.fase}</td>
                    <td style={{padding:"6px 8px",fontFamily:"'JetBrains Mono',monospace",color:"#60a5fa"}}>{v.buis200}</td>
                    <td style={{padding:"6px 8px",fontFamily:"'JetBrains Mono',monospace",color:"#60a5fa"}}>{v.buis160}</td>
                    <td style={{padding:"6px 8px",fontFamily:"'JetBrains Mono',monospace",color:"#60a5fa"}}>{v.buis110}</td>
                    <td style={{padding:"6px 8px",fontFamily:"'JetBrains Mono',monospace",color:"#a78bfa"}}>{v.bochten}</td>
                    <td style={{padding:"6px 8px",fontFamily:"'JetBrains Mono',monospace",color:"#a78bfa"}}>{v.tstuk}</td>
                    <td style={{padding:"6px 8px",fontFamily:"'JetBrains Mono',monospace",color:"#f59e0b"}}>{v.ip}</td>
                    <td style={{padding:"6px 8px",fontFamily:"'JetBrains Mono',monospace",color:"#22c55e"}}>{v.zand}</td>
                    <td style={{padding:"6px 8px"}}><Tag color={v.status==="goedgekeurd"?"#22c55e":v.status==="in review"?"#f97316":"#64748b"}>{v.status}</Tag></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subTab==="m"&&(
        <div>
          <StatRow items={[{lbl:"Aanneemsom bestek",val:f€(tB),c:"#3b82f6"},{lbl:"Gevorderd (auto)",val:f€(tV),c:"#22c55e"},{lbl:"Te vorderen",val:f€(Math.max(0,tB-tV)),c:"#f97316"}]}/>
          <InfoBox color="#22c55e"><strong>⚡ Auto-koppeling:</strong> "Gevorderd" wordt automatisch ingevuld vanuit ingediende fiches. Handmatig bijwerken is ook mogelijk.</InfoBox>
          <div style={{background:"#0a0f1a",border:"1px solid #1e293b",borderRadius:6,overflow:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead><tr style={{background:"#0f172a"}}>{["Post","Omschrijving","E.H.","E.P.","Qty bestek","Bestek","Qty gevorderd ⚡","Gevorderd"].map(h=><th key={h} style={{padding:"8px 9px",fontSize:9,fontWeight:700,letterSpacing:.5,textTransform:"uppercase",textAlign:"left",whiteSpace:"nowrap",color:"#475569",borderBottom:"1px solid #1e293b"}}>{h}</th>)}</tr></thead>
              <tbody>
                {posten.map((p,i)=>(
                  <tr key={p.post} style={{background:i%2?"#0a0f1a":"#0c1120",borderBottom:"1px solid #161e30"}}>
                    <td style={{padding:"7px 9px",fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:"#a78bfa"}}>{p.post}</td>
                    <td style={{padding:"7px 9px",fontWeight:600,color:"#e2e8f0",minWidth:160}}>{p.omschr}</td>
                    <td style={{padding:"7px 9px",color:"#475569",fontFamily:"'JetBrains Mono',monospace"}}>{p.eh}</td>
                    <td style={{padding:"7px 9px",fontFamily:"'JetBrains Mono',monospace",color:"#64748b",fontSize:11}}>{f€(p.EP)}</td>
                    <td style={{padding:"7px 9px"}}><input type="number" min="0" value={p.qty} onChange={e=>setPosten(prev=>prev.map(x=>x.post===p.post?{...x,qty:+e.target.value}:x))} style={{width:65,padding:"3px 5px",border:"1.5px solid #334155",borderRadius:3,fontSize:12,textAlign:"center",background:"#0f172a",color:"#e2e8f0"}}/></td>
                    <td style={{padding:"7px 9px",fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:"#60a5fa",fontSize:11}}>{f€(p.qty*p.EP)}</td>
                    <td style={{padding:"7px 9px"}}><input type="number" min="0" value={p.qty2} onChange={e=>setPosten(prev=>prev.map(x=>x.post===p.post?{...x,qty2:+e.target.value}:x))} style={{width:65,padding:"3px 5px",border:"1.5px solid #22c55e30",borderRadius:3,fontSize:12,textAlign:"center",background:"#0a1e0f",color:"#4ade80"}}/></td>
                    <td style={{padding:"7px 9px",fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:"#4ade80",fontSize:11}}>{f€(p.qty2*p.EP)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot><tr style={{background:"#0f172a",borderTop:"2px solid #1e293b"}}>
                <td colSpan={5} style={{padding:"9px",fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:800,color:"#e2e8f0"}}>TOTAAL</td>
                <td style={{padding:"9px",fontFamily:"'JetBrains Mono',monospace",fontWeight:800,fontSize:13,color:"#60a5fa"}}>{f€(tB)}</td>
                <td/>
                <td style={{padding:"9px",fontFamily:"'JetBrains Mono',monospace",fontWeight:800,fontSize:13,color:"#4ade80"}}>{f€(tV)}</td>
              </tr></tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 6 — PLANNING
// ═══════════════════════════════════════════════════════════════════════════
const PlanningModule=()=>{
  const [planning,setPlanning]=useState(PLANNING_DATA);
  const [filter,setFilter]=useState("allen");
  const [editId,setEditId]=useState(null);
  const todayPct=gPct(TODAY);
  const filtered=planning.filter(p=>filter==="allen"||p.project===filter);
  const upd=(id,k,v)=>setPlanning(prev=>prev.map(p=>p.id===id?{...p,[k]:v}:p));
  const tA=filtered.reduce((a,p)=>a+p.aansl,0);
  const tK=filtered.reduce((a,p)=>a+Math.round(p.aansl*(p.vrtg/100)),0);

  return(
    <div style={{animation:"fadeIn .3s ease"}}>
      <StatRow items={[{lbl:"Fasen",val:filtered.length,c:"#3b82f6"},{lbl:"Aansluitingen",val:tA,c:"#a78bfa"},{lbl:"Klaar",val:tK,c:"#22c55e"},{lbl:"% Gereed",val:Math.round(tK/Math.max(tA,1)*100)+"%",c:"#e8401c"}]}/>
      <div style={{display:"flex",gap:4,marginBottom:12}}>
        {["allen","Zwijndrecht","Puurs"].map(p=><button key={p} onClick={()=>setFilter(p)}
          style={{padding:"6px 14px",border:"1.5px solid",borderRadius:4,fontSize:11,fontWeight:700,cursor:"pointer",letterSpacing:.5,textTransform:"uppercase",
            borderColor:filter===p?"#e8401c":"#334155",background:filter===p?"#e8401c15":"#0f172a",color:filter===p?"#fb923c":"#64748b"}}>{p}</button>)}
      </div>
      {/* Gantt */}
      <Card style={{marginBottom:12}}>
        <div style={{background:"#0f172a",padding:"9px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #1e293b"}}>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:800,color:"#e2e8f0",letterSpacing:.5}}>GANTT 2025–2026</span>
          <span style={{fontSize:9,color:"#334155",fontFamily:"'JetBrains Mono',monospace"}}>{G_START} → {G_END}</span>
        </div>
        <div style={{position:"relative",height:18,background:"#080d15",borderBottom:"1px solid #1e293b",overflow:"hidden"}}>
          {Array.from({length:15},(_,i)=>{const dt=new Date(2025,i,1).toISOString().slice(0,10);const pct=gPct(dt);return pct>=0&&pct<=100?<div key={i} style={{position:"absolute",left:pct+"%",top:0,height:"100%",borderLeft:"1px solid #1e293b",paddingLeft:2,fontSize:7,fontWeight:700,color:"#334155",display:"flex",alignItems:"center",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:.3}}>{["Jan","Feb","Mrt","Apr","Mei","Jun","Jul","Aug","Sep","Okt","Nov","Dec","Jan","Feb","Mrt"][i]}{i>=12?" '26":" '25"}</div>:null;})}
          <div style={{position:"absolute",left:todayPct+"%",top:0,width:2,height:"100%",background:"#e8401c",zIndex:5}}/>
        </div>
        <div style={{padding:"4px 0"}}>
          {filtered.map(f=>{const s=gPct(f.start),e=gPct(f.einde),w=Math.max(.5,e-s),c=statusClr(f.status);return(
            <div key={f.id} style={{position:"relative",height:26,marginBottom:2,display:"flex",alignItems:"center"}}>
              <div style={{width:160,flexShrink:0,paddingRight:6,paddingLeft:8,fontSize:9,fontWeight:600,color:"#475569",textAlign:"right",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                <span style={{fontSize:8,color:"#334155",marginRight:2}}>{f.project}</span>{f.fase.split("–").pop()?.trim()||f.fase}
              </div>
              <div style={{flex:1,position:"relative",height:"100%"}}>
                <div style={{position:"absolute",left:todayPct+"%",top:0,width:1,height:"100%",background:"#e8401c",opacity:.3,zIndex:5}}/>
                <div style={{position:"absolute",left:s+"%",width:w+"%",top:4,height:18,background:c,borderRadius:2,opacity:.8}} title={`${f.fase}: ${f.start} → ${f.einde}`}>
                  <div style={{position:"absolute",left:0,top:0,height:"100%",width:f.vrtg+"%",background:"rgba(255,255,255,.2)",borderRadius:2}}/>
                  {w>4&&<div style={{position:"absolute",left:3,top:1,fontSize:7,fontWeight:700,color:"white",whiteSpace:"nowrap"}}>{f.vrtg>0?f.vrtg+"%":""}</div>}
                </div>
              </div>
              <div style={{width:28,flexShrink:0,textAlign:"right",paddingRight:6,fontSize:8,fontFamily:"'JetBrains Mono',monospace",color:"#334155"}}>{f.aansl}</div>
            </div>
          );})}
        </div>
        <div style={{padding:"5px 10px 8px",display:"flex",gap:10,fontSize:8,borderTop:"1px solid #1e293b"}}>
          {[["in uitvoering","#e8401c"],["gepland","#3b82f6"],["afgerond","#22c55e"],["vertraagd","#f97316"]].map(([l,c])=>(
            <span key={l} style={{display:"flex",alignItems:"center",gap:3}}><span style={{width:9,height:5,background:c,borderRadius:1,display:"inline-block"}}/><span style={{color:"#475569"}}>{l}</span></span>
          ))}
        </div>
      </Card>
      {/* Tabel */}
      <div style={{background:"#0a0f1a",border:"1px solid #1e293b",borderRadius:6,overflow:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{background:"#0f172a"}}>{["Project","Fase","Start","Einde","Ploeg","Aansl.","Voortgang","Status",""].map(h=><th key={h} style={{padding:"8px 9px",fontSize:9,fontWeight:700,letterSpacing:.5,textTransform:"uppercase",textAlign:"left",whiteSpace:"nowrap",color:"#475569",borderBottom:"1px solid #1e293b"}}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map((f,i)=>{const isE=editId===f.id;return(
              <tr key={f.id} style={{background:i%2?"#0a0f1a":"#0c1120",borderBottom:"1px solid #161e30"}}>
                <td style={{padding:"7px 9px"}}><Tag color="#3b82f6">{f.project}</Tag></td>
                <td style={{padding:"7px 9px",fontWeight:600,color:"#e2e8f0",maxWidth:150,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.fase}</td>
                <td style={{padding:"7px 7px"}}>{isE?<input type="date" value={f.start} onChange={e=>upd(f.id,"start",e.target.value)} style={{padding:"2px 5px",border:"1.5px solid #3b82f6",borderRadius:3,fontSize:10,background:"#0f172a",color:"#e2e8f0"}}/>:<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#64748b"}}>{f.start}</span>}</td>
                <td style={{padding:"7px 7px"}}>{isE?<input type="date" value={f.einde} onChange={e=>upd(f.id,"einde",e.target.value)} style={{padding:"2px 5px",border:"1.5px solid #3b82f6",borderRadius:3,fontSize:10,background:"#0f172a",color:"#e2e8f0"}}/>:<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#64748b"}}>{f.einde}</span>}</td>
                <td style={{padding:"7px 7px"}}>{isE?<input value={f.ploeg} onChange={e=>upd(f.id,"ploeg",e.target.value)} style={{padding:"2px 5px",border:"1.5px solid #3b82f6",borderRadius:3,fontSize:10,width:70,background:"#0f172a",color:"#e2e8f0"}}/>:<span style={{color:"#64748b",fontSize:11}}>{f.ploeg}</span>}</td>
                <td style={{padding:"7px 9px",fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:"#a78bfa"}}>{f.aansl}</td>
                <td style={{padding:"7px 9px",minWidth:120}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    {isE?<input type="range" min="0" max="100" value={f.vrtg} onChange={e=>upd(f.id,"vrtg",+e.target.value)} style={{flex:1}}/>:<div style={{flex:1,height:4,background:"#1e293b",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:f.vrtg+"%",background:statusClr(f.status),borderRadius:2,transition:"width .3s"}}/></div>}
                    <span style={{fontSize:10,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",minWidth:26,color:statusClr(f.status)}}>{f.vrtg}%</span>
                  </div>
                </td>
                <td style={{padding:"7px 9px"}}>{isE?<select value={f.status} onChange={e=>upd(f.id,"status",e.target.value)} style={{padding:"2px 5px",border:"1.5px solid #3b82f6",borderRadius:3,fontSize:10,background:"#0f172a",color:"#e2e8f0"}}>{["gepland","in uitvoering","afgerond","vertraagd"].map(s=><option key={s}>{s}</option>)}</select>:<Tag color={statusClr(f.status)}>{f.status}</Tag>}</td>
                <td style={{padding:"7px 7px"}}>{isE?<button onClick={()=>setEditId(null)} style={{padding:"3px 7px",background:"#22c55e",color:"white",border:"none",borderRadius:3,cursor:"pointer",fontSize:9,fontWeight:700}}>✓</button>:<button onClick={()=>setEditId(f.id)} style={{padding:"3px 7px",background:"#1e293b",color:"#60a5fa",border:"1px solid #1e3a5f",borderRadius:3,cursor:"pointer",fontSize:9,fontWeight:700}}>Bewerk</button>}</td>
              </tr>
            );})}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════
const TABS=[
  {id:"pitch",   icon:"🎯", label:"Management Pitch"},
  {id:"werf",    icon:"📱", label:"Werf – HA Registratie"},
  {id:"gps",     icon:"📍", label:"GPS Meting"},
  {id:"stock",   icon:"📦", label:"Stock & Besteladvies"},
  {id:"vord",    icon:"📑", label:"Vorderingen & Meetstaat"},
  {id:"planning",icon:"📅", label:"Planning & Gantt"},
];

export default function ColasApp(){
  const [tab,setTab]=useState("pitch");
  const [vorderingen,setVorderingen]=useState(VORD_DATA);

  const addVord=useCallback(record=>{
    setVorderingen(prev=>[...prev,{
      id:record.id||`NEW-${Date.now()}`,
      project:record.project||"Zwijndrecht",
      fase:(record.fase||"Fase 1").split("–")[0].trim(),
      datum:record.datum||TODAY,
      adres:`${record.straat||""} ${record.huisnr||""}`.trim()||"Onbekend",
      buis200:parseInt(record.m1_buis)||0,
      buis160:parseInt(record.m2_buis160)||0,
      buis110:parseInt(record.m3_buis110)||0,
      buis90:parseInt(record.m3_buis90)||0,
      bochten:[record.m2_b15,record.m2_b30,record.m2_b45,record.m2_b90].reduce((a,b)=>a+(parseInt(b)||0),0),
      tstuk:(parseInt(record.m2_ts160)||0)+(parseInt(record.m2_tsip)||0),
      ip:(parseInt(record.m1_ip400)||0)+(parseInt(record.m1_ip600)||0),
      ha:parseInt(record.m2_ha_st)||0,
      kolk:0,
      zand:0,
      status:"in review"
    }]);
    setTab("vord");
  },[]);

  const stockAlerts=STOCK_DATA.filter(s=>["leeg","kritiek","laag"].includes(alertLvl(s.stock,s.min)));

  return(
    <div style={{minHeight:"100vh",background:"#080d15"}}>
      <style>{STYLE}</style>

      {/* HEADER */}
      <div style={{background:"#0a0f1a",borderBottom:"2px solid #e8401c",position:"sticky",top:0,zIndex:100}}>
        <div style={{padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div>
              <div style={{fontSize:8,letterSpacing:4,textTransform:"uppercase",color:"#e8401c",fontWeight:800}}>COLAS BELGIË NV</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:900,color:"white",letterSpacing:.5,lineHeight:1}}>WERF PLATFORM</div>
            </div>
            <div style={{width:1,height:28,background:"#1e293b"}}/>
            <div style={{fontSize:9,color:"#334155",fontFamily:"'JetBrains Mono',monospace"}}>{TODAY}</div>
          </div>
          {stockAlerts.length>0&&(
            <button onClick={()=>setTab("stock")}
              style={{display:"flex",alignItems:"center",gap:5,background:"#ef444415",border:"1px solid #ef444330",borderRadius:4,padding:"5px 9px",cursor:"pointer"}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:"#ef4444",display:"inline-block",animation:"pulse 1.2s infinite"}}/>
              <span style={{fontSize:10,fontWeight:700,color:"#f87171"}}>{stockAlerts.length} alert{stockAlerts.length>1?"s":""}</span>
            </button>
          )}
        </div>
        {/* Tab nav - scrollable */}
        <div style={{overflowX:"auto",display:"flex",borderTop:"1px solid #1e293b",WebkitOverflowScrolling:"touch"}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              style={{flexShrink:0,padding:"10px 14px",background:"none",border:"none",
                borderBottom:`2px solid ${tab===t.id?"#e8401c":"transparent"}`,
                color:tab===t.id?"#fb923c":"#475569",fontFamily:"'Barlow Condensed',sans-serif",
                fontSize:12,fontWeight:700,letterSpacing:.5,textTransform:"uppercase",cursor:"pointer",
                display:"flex",alignItems:"center",gap:5,whiteSpace:"nowrap"}}>
              <span style={{fontSize:13}}>{t.icon}</span>{t.label}
              {t.id==="stock"&&stockAlerts.length>0&&(
                <span style={{background:"#ef4444",color:"white",borderRadius:"50%",width:14,height:14,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:800}}>
                  {stockAlerts.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{padding:"14px 14px 40px",maxWidth:900,margin:"0 auto"}}>
        {tab==="pitch"   &&<PitchModule/>}
        {tab==="werf"    &&<WerfModule onSubmit={addVord}/>}
        {tab==="gps"     &&<GPSModule onSave={()=>{}}/>}
        {tab==="stock"   &&<StockModule vorderingen={vorderingen}/>}
        {tab==="vord"    &&<VorderingenModule vorderingen={vorderingen}/>}
        {tab==="planning"&&<PlanningModule/>}
      </div>
    </div>
  );
}