import { useState, useEffect, useCallback } from "react";

// ─── FONTS ───────────────────────────────────────────────────────────────────
const FONT = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');`;

// ─── INITIËLE STOCKCATALOGUS ─────────────────────────────────────────────────
const INIT_STOCK = [
  // Buizen
  { id:"B200", cat:"Buizen",       code:"PVC-200",   naam:"PVC buis Ø200mm",        eenheid:"lm",  stock:120, min:50,  bestel:200, prijs:32.00,  post:"21.10", leverancier:"Wavin",     levertijd:3 },
  { id:"B160", cat:"Buizen",       code:"PVC-160",   naam:"PVC buis Ø160mm",        eenheid:"lm",  stock:85,  min:40,  bestel:150, prijs:25.00,  post:"21.10", leverancier:"Wavin",     levertijd:3 },
  { id:"B110", cat:"Buizen",       code:"PVC-110",   naam:"PVC buis Ø110mm",        eenheid:"lm",  stock:60,  min:30,  bestel:100, prijs:16.50,  post:"21.10", leverancier:"Wavin",     levertijd:3 },
  { id:"B90",  cat:"Buizen",       code:"PVC-90",    naam:"PVC buis Ø90mm",         eenheid:"lm",  stock:40,  min:20,  bestel:80,  prijs:12.00,  post:"21.10", leverancier:"Wavin",     levertijd:3 },
  // Bochten 200
  { id:"BC45_200", cat:"Bochten",  code:"BC45-200",  naam:"Bocht 45° Ø200mm",       eenheid:"st",  stock:18,  min:10,  bestel:30,  prijs:28.00,  post:"21.20", leverancier:"Wavin",     levertijd:3 },
  { id:"BC90_200", cat:"Bochten",  code:"BC90-200",  naam:"Bocht 90° Ø200mm",       eenheid:"st",  stock:12,  min:8,   bestel:25,  prijs:32.00,  post:"21.20", leverancier:"Wavin",     levertijd:3 },
  // Bochten 160
  { id:"BC15_160", cat:"Bochten",  code:"BC15-160",  naam:"Bocht 15° Ø160mm",       eenheid:"st",  stock:22,  min:10,  bestel:40,  prijs:10.50,  post:"21.20", leverancier:"Wavin",     levertijd:3 },
  { id:"BC30_160", cat:"Bochten",  code:"BC30-160",  naam:"Bocht 30° Ø160mm",       eenheid:"st",  stock:18,  min:10,  bestel:40,  prijs:11.00,  post:"21.20", leverancier:"Wavin",     levertijd:3 },
  { id:"BC45_160", cat:"Bochten",  code:"BC45-160",  naam:"Bocht 45° Ø160mm",       eenheid:"st",  stock:35,  min:15,  bestel:50,  prijs:12.00,  post:"21.20", leverancier:"Wavin",     levertijd:3 },
  { id:"BC90_160", cat:"Bochten",  code:"BC90-160",  naam:"Bocht 90° Ø160mm",       eenheid:"st",  stock:28,  min:12,  bestel:40,  prijs:14.00,  post:"21.20", leverancier:"Wavin",     levertijd:3 },
  // Bochten 110
  { id:"BC45_110", cat:"Bochten",  code:"BC45-110",  naam:"Bocht 45° Ø110mm",       eenheid:"st",  stock:15,  min:8,   bestel:30,  prijs:7.50,   post:"21.20", leverancier:"Wavin",     levertijd:3 },
  { id:"BC90_110", cat:"Bochten",  code:"BC90-110",  naam:"Bocht 90° Ø110mm",       eenheid:"st",  stock:12,  min:8,   bestel:30,  prijs:8.50,   post:"21.20", leverancier:"Wavin",     levertijd:3 },
  // T-stukken
  { id:"TS200",    cat:"T-stukken",code:"TS-200",    naam:"T-stuk Ø200mm",          eenheid:"st",  stock:8,   min:5,   bestel:20,  prijs:45.00,  post:"21.30", leverancier:"Wavin",     levertijd:5 },
  { id:"TS160",    cat:"T-stukken",code:"TS-160",    naam:"T-stuk Ø160mm",          eenheid:"st",  stock:20,  min:10,  bestel:40,  prijs:28.00,  post:"21.30", leverancier:"Wavin",     levertijd:5 },
  { id:"TSIP160",  cat:"T-stukken",code:"TSIP-160",  naam:"T-stuk in-plaat Ø160mm", eenheid:"st",  stock:6,   min:5,   bestel:20,  prijs:38.00,  post:"21.30", leverancier:"Wavin",     levertijd:5 },
  { id:"TS110",    cat:"T-stukken",code:"TS-110",    naam:"T-stuk Ø110mm",          eenheid:"st",  stock:14,  min:8,   bestel:30,  prijs:18.00,  post:"21.30", leverancier:"Wavin",     levertijd:5 },
  // Reducties
  { id:"R160_110", cat:"Reducties",code:"R-160/110", naam:"Reductie 160→110mm",     eenheid:"st",  stock:12,  min:6,   bestel:25,  prijs:14.00,  post:"21.40", leverancier:"Wavin",     levertijd:3 },
  { id:"R110_90",  cat:"Reducties",code:"R-110/90",  naam:"Reductie 110→90mm",      eenheid:"st",  stock:8,   min:5,   bestel:20,  prijs:11.00,  post:"21.40", leverancier:"Wavin",     levertijd:3 },
  { id:"R110_80",  cat:"Reducties",code:"R-110/80",  naam:"Reductie 110→80mm",      eenheid:"st",  stock:6,   min:5,   bestel:20,  prijs:10.00,  post:"21.40", leverancier:"Wavin",     levertijd:3 },
  // Moffen & koppels
  { id:"MOF160",   cat:"Verbinding",code:"MOF-160",  naam:"Mof Ø160mm",             eenheid:"st",  stock:45,  min:20,  bestel:80,  prijs:6.50,   post:"21.50", leverancier:"Wavin",     levertijd:2 },
  { id:"MOF200",   cat:"Verbinding",code:"MOF-200",  naam:"Mof Ø200mm",             eenheid:"st",  stock:22,  min:10,  bestel:40,  prijs:9.00,   post:"21.50", leverancier:"Wavin",     levertijd:2 },
  { id:"KOP160",   cat:"Verbinding",code:"KOP-160",  naam:"Koppelstuk Ø160mm",      eenheid:"st",  stock:30,  min:15,  bestel:60,  prijs:8.50,   post:"21.50", leverancier:"Wavin",     levertijd:2 },
  { id:"KOP110",   cat:"Verbinding",code:"KOP-110",  naam:"Koppelstuk Ø110mm",      eenheid:"st",  stock:20,  min:10,  bestel:40,  prijs:5.50,   post:"21.50", leverancier:"Wavin",     levertijd:2 },
  { id:"KRM",      cat:"Verbinding",code:"KRM-160",  naam:"Krimpmof Ø160mm",        eenheid:"st",  stock:10,  min:6,   bestel:25,  prijs:12.00,  post:"21.50", leverancier:"Wavin",     levertijd:2 },
  // Putten
  { id:"IP400",    cat:"Putten",   code:"IP-400",    naam:"Inspectieput Ø400mm",    eenheid:"st",  stock:5,   min:3,   bestel:10,  prijs:185.00, post:"22.10", leverancier:"Pipelife",  levertijd:7 },
  { id:"IP600",    cat:"Putten",   code:"IP-600",    naam:"Inspectieput Ø600mm",    eenheid:"st",  stock:3,   min:2,   bestel:8,   prijs:320.00, post:"22.10", leverancier:"Pipelife",  levertijd:7 },
  { id:"HAPD400",  cat:"Putten",   code:"HA-400",    naam:"HA-putje + deksel Ø400", eenheid:"st",  stock:8,   min:4,   bestel:15,  prijs:145.00, post:"22.20", leverancier:"Pipelife",  levertijd:5 },
  { id:"HAPD500",  cat:"Putten",   code:"HA-500",    naam:"HA-putje + deksel Ø500", eenheid:"st",  stock:4,   min:2,   bestel:10,  prijs:195.00, post:"22.20", leverancier:"Pipelife",  levertijd:5 },
  // Kolken
  { id:"KOLK400",  cat:"Kolken",   code:"KOLK-400",  naam:"Straatkolk Ø400mm",      eenheid:"st",  stock:6,   min:3,   bestel:12,  prijs:95.00,  post:"23.10", leverancier:"Benor",     levertijd:5 },
  { id:"KOLK500",  cat:"Kolken",   code:"KOLK-500",  naam:"Straatkolk Ø500mm",      eenheid:"st",  stock:3,   min:2,   bestel:8,   prijs:125.00, post:"23.10", leverancier:"Benor",     levertijd:5 },
  // Granulaten
  { id:"ZAND",     cat:"Granulaten",code:"ZAND",     naam:"Stabilisatiezand",       eenheid:"m³",  stock:45,  min:20,  bestel:80,  prijs:28.00,  post:"24.10", leverancier:"Sibelco",   levertijd:2 },
  { id:"GRIND",    cat:"Granulaten",code:"GRIND",    naam:"Drainagegrind 4/16",     eenheid:"m³",  stock:18,  min:10,  bestel:40,  prijs:38.00,  post:"24.10", leverancier:"Sibelco",   levertijd:2 },
];

// ─── MEETSTAAT POSTEN ─────────────────────────────────────────────────────────
const MEETSTAAT = [
  { post:"21.10", omschrijving:"Aanleg PVC rioolbuis",       eenheid:"lm",  EP:85.00,  cat:"Riool" },
  { post:"21.20", omschrijving:"Levering & plaatsing bochten",eenheid:"st",  EP:32.00,  cat:"Riool" },
  { post:"21.30", omschrijving:"Levering & plaatsing T-stukken",eenheid:"st",EP:65.00,  cat:"Riool" },
  { post:"21.40", omschrijving:"Levering reducties",         eenheid:"st",  EP:28.00,  cat:"Riool" },
  { post:"21.50", omschrijving:"Verbindingsstukken",         eenheid:"st",  EP:18.00,  cat:"Riool" },
  { post:"22.10", omschrijving:"Levering & plaatsing inspectieput",eenheid:"st",EP:650.00,cat:"Putten" },
  { post:"22.20", omschrijving:"Levering & plaatsing HA-putje",eenheid:"st",EP:420.00, cat:"Putten" },
  { post:"23.10", omschrijving:"Levering & plaatsing straatkolk",eenheid:"st",EP:285.00,cat:"Kolken" },
  { post:"24.10", omschrijving:"Aanvulzand & granulaten",    eenheid:"m³",  EP:72.00,  cat:"Grond" },
  { post:"25.10", omschrijving:"Grondwerken uitgraving",     eenheid:"m³",  EP:28.00,  cat:"Grond" },
  { post:"25.20", omschrijving:"Grondwerken aanvulling",     eenheid:"m³",  EP:22.00,  cat:"Grond" },
  { post:"26.10", omschrijving:"Herstel rijweg (asfalt)",    eenheid:"m²",  EP:145.00, cat:"Herstel" },
  { post:"26.20", omschrijving:"Herstel trottoir (betontegel)",eenheid:"m²",EP:85.00,  cat:"Herstel" },
  { post:"27.10", omschrijving:"Signalisatie werf",          eenheid:"ff",  EP:1200.00,cat:"Diversen" },
];

// ─── FASEN PLANNING ───────────────────────────────────────────────────────────
const INIT_PLANNING = [
  { id:1, project:"Zwijndrecht", fase:"Fase 1 – Bareelstraat",          start:"2025-03-03", einde:"2025-04-11", ploeg:"Ploeg A", status:"in uitvoering", voortgang:65, aansluitingen:28 },
  { id:2, project:"Zwijndrecht", fase:"Fase 2 – Burchtsestraat",        start:"2025-04-14", einde:"2025-06-06", ploeg:"Ploeg A", status:"gepland",      voortgang:0,  aansluitingen:42 },
  { id:3, project:"Zwijndrecht", fase:"Fase 3 – Laarstraat-Molenbergstr",start:"2025-06-09", einde:"2025-07-18", ploeg:"Ploeg A", status:"gepland",      voortgang:0,  aansluitingen:35 },
  { id:4, project:"Zwijndrecht", fase:"Fase 4 – Vervolg Burchtsestraat", start:"2025-07-21", einde:"2025-09-05", ploeg:"Ploeg A", status:"gepland",      voortgang:0,  aansluitingen:38 },
  { id:5, project:"Zwijndrecht", fase:"Fase 5 – Alfred van Oststraat",  start:"2025-09-08", einde:"2025-10-17", ploeg:"Ploeg A", status:"gepland",      voortgang:0,  aansluitingen:30 },
  { id:6, project:"Zwijndrecht", fase:"Fase 6 – Laarstraat-Antw.steen.",start:"2025-10-20", einde:"2025-12-05", ploeg:"Ploeg A", status:"gepland",      voortgang:0,  aansluitingen:45 },
  { id:7, project:"Zwijndrecht", fase:"Fase 7 – Burchtsestr.-Verbrand.", start:"2025-12-08", einde:"2026-02-06", ploeg:"Ploeg A", status:"gepland",      voortgang:0,  aansluitingen:52 },
  { id:8, project:"Puurs",       fase:"Fase 1",                          start:"2025-01-20", einde:"2025-05-02", ploeg:"Ploeg B", status:"in uitvoering", voortgang:42, aansluitingen:60 },
  { id:9, project:"Puurs",       fase:"Fase 2",                          start:"2025-05-05", einde:"2025-08-15", ploeg:"Ploeg B", status:"gepland",      voortgang:0,  aansluitingen:55 },
  { id:10,project:"Puurs",       fase:"Fase 3",                          start:"2025-08-18", einde:"2025-11-28", ploeg:"Ploeg B", status:"gepland",      voortgang:0,  aansluitingen:50 },
  { id:11,project:"Puurs",       fase:"Pompstation A",                   start:"2025-06-02", einde:"2025-07-11", ploeg:"Ploeg B", status:"gepland",      voortgang:0,  aansluitingen:5  },
  { id:12,project:"Puurs",       fase:"Pompstation B",                   start:"2025-09-01", einde:"2025-10-10", ploeg:"Ploeg B", status:"gepland",      voortgang:0,  aansluitingen:5  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const statusColor = (s) => ({
  "in uitvoering":"#e8401c", "gepland":"#2b6cb0", "afgerond":"#1a7a45", "vertraagd":"#c47a00"
})[s] || "#718096";

const alertLevel = (stock, min) => {
  if (stock <= 0) return "leeg";
  if (stock <= min * 0.5) return "kritiek";
  if (stock <= min) return "laag";
  if (stock <= min * 1.5) return "let op";
  return "ok";
};

const alertColor = (lvl) => ({
  "leeg":"#e53e3e","kritiek":"#e53e3e","laag":"#c47a00","let op":"#d69e2e","ok":"#1a7a45"
})[lvl];

const alertBg = (lvl) => ({
  "leeg":"#fff5f5","kritiek":"#fff5f5","laag":"#fffbeb","let op":"#fefcbf","ok":"#f0fff4"
})[lvl];

const fmtEur = (n) => `€ ${Number(n).toLocaleString("nl-BE",{minimumFractionDigits:2})}`;
const daysBetween = (a,b) => Math.round((new Date(b)-new Date(a))/(1000*60*60*24));
const today = new Date().toISOString().slice(0,10);

// ─── GANTT HELPER ─────────────────────────────────────────────────────────────
const GANTT_START = "2025-01-01";
const GANTT_END   = "2026-03-01";
const ganttPct = (date) => {
  const total = daysBetween(GANTT_START, GANTT_END);
  const pos   = daysBetween(GANTT_START, date);
  return Math.max(0, Math.min(100, (pos/total)*100));
};

// ─── STYLE TAG ────────────────────────────────────────────────────────────────
const StyleTag = () => (
  <style>{`
    ${FONT}
    * { box-sizing:border-box; margin:0; padding:0; }
    body { font-family:'Barlow',sans-serif; }
    ::-webkit-scrollbar { width:5px; height:5px; }
    ::-webkit-scrollbar-track { background:#f1f1f1; }
    ::-webkit-scrollbar-thumb { background:#cbd5e0; border-radius:3px; }
    input,select,textarea { font-family:'Barlow',sans-serif; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
    @keyframes slideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  `}</style>
);

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
const Tag = ({children,color="#2b6cb0"}) => (
  <span style={{display:"inline-block",padding:"2px 8px",borderRadius:3,fontSize:11,
    fontWeight:700,letterSpacing:.5,background:color+"18",color,border:`1px solid ${color}30`,
    fontFamily:"'JetBrains Mono',monospace"}}>
    {children}
  </span>
);

const AlertDot = ({level}) => {
  const c = alertColor(level);
  return (
    <span style={{display:"inline-flex",alignItems:"center",gap:5}}>
      <span style={{width:8,height:8,borderRadius:"50%",background:c,display:"inline-block",
        animation:level==="leeg"||level==="kritiek"?"pulse 1.2s infinite":"none"}}/>
      <span style={{fontSize:11,fontWeight:700,color:c,textTransform:"uppercase",letterSpacing:.5}}>{level}</span>
    </span>
  );
};

// ─── STOCK PANEL ─────────────────────────────────────────────────────────────
const StockPanel = ({ stock, setStock }) => {
  const [filter, setFilter] = useState("allen");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editVal, setEditVal] = useState({});

  const cats = ["allen", ...Array.from(new Set(INIT_STOCK.map(s=>s.cat)))];
  const alerts = stock.filter(s=>alertLevel(s.stock,s.min)!=="ok");
  const toOrder = stock.filter(s=>["leeg","kritiek","laag"].includes(alertLevel(s.stock,s.min)));

  const filtered = stock.filter(s=>{
    const matchCat = filter==="allen" || s.cat===filter;
    const matchSearch = !search || s.naam.toLowerCase().includes(search.toLowerCase()) || s.code.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const saveEdit = () => {
    setStock(prev=>prev.map(s=>s.id===editId ? {...s,...editVal} : s));
    setEditId(null);
  };

  const orderValue = toOrder.reduce((acc,s)=>{
    const qty = Math.max(0, s.bestel - s.stock);
    return acc + qty * s.prijs;
  },0);

  return (
    <div style={{animation:"slideIn .3s ease"}}>
      {/* HEADER STATS */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:2,marginBottom:16}}>
        {[
          {lbl:"Totaal artikelen",val:stock.length,   color:"#1a202c"},
          {lbl:"Alerts",          val:alerts.length,  color:"#c47a00"},
          {lbl:"Bestellen",       val:toOrder.length, color:"#e53e3e"},
          {lbl:"Bestelwaarde",    val:fmtEur(orderValue), color:"#1a7a45"},
        ].map(({lbl,val,color})=>(
          <div key={lbl} style={{background:"#1a202c",padding:"16px 18px",borderLeft:`4px solid ${color}`}}>
            <div style={{fontSize:11,color:"rgba(255,255,255,.4)",letterSpacing:1,textTransform:"uppercase",fontWeight:600,marginBottom:4}}>{lbl}</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:800,color:"white"}}>{val}</div>
          </div>
        ))}
      </div>

      {/* BESTELADVIES BANNER */}
      {toOrder.length > 0 && (
        <div style={{background:"#fff5f5",border:"2px solid #feb2b2",borderLeft:"5px solid #e53e3e",padding:"14px 18px",marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:800,color:"#e53e3e"}}>
              ⚠ BESTELADVIES — {toOrder.length} artikel{toOrder.length>1?"s":" "} onder minimum
            </div>
            <button onClick={()=>{
              const lines = ["BESTELADVIES COLAS","Datum: "+today,"",
                "Artikel\t\tCode\tBestelqty\tEenheid\tLeverancier\tLevertijd\tWaarde",
                ...toOrder.map(s=>{
                  const qty = Math.max(0,s.bestel-s.stock);
                  return `${s.naam}\t${s.code}\t${qty}\t${s.eenheid}\t${s.leverancier}\t${s.levertijd}d\t${fmtEur(qty*s.prijs)}`;
                }),
                "","TOTAAL: "+fmtEur(orderValue)
              ].join("\n");
              const b = new Blob([lines],{type:"text/plain"});
              const a = document.createElement("a"); a.href=URL.createObjectURL(b);
              a.download="Besteladvies_"+today+".txt"; a.click();
            }}
              style={{padding:"8px 16px",background:"#e53e3e",color:"white",border:"none",
                borderRadius:4,fontWeight:700,fontSize:12,cursor:"pointer",letterSpacing:.5}}>
              ⬇ Bestelbon exporteren
            </button>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {toOrder.map(s=>{
              const qty = Math.max(0,s.bestel-s.stock);
              const lvl = alertLevel(s.stock,s.min);
              return (
                <div key={s.id} style={{background:"white",border:`1px solid ${alertColor(lvl)}40`,
                  borderLeft:`3px solid ${alertColor(lvl)}`,padding:"8px 12px",borderRadius:3,minWidth:180}}>
                  <div style={{fontSize:11,fontFamily:"'JetBrains Mono',monospace",color:alertColor(lvl),fontWeight:700}}>{s.code}</div>
                  <div style={{fontSize:12,fontWeight:600,color:"#1a202c",margin:"2px 0"}}>{s.naam}</div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <span style={{fontSize:11,color:"#718096"}}>Voorraad: <strong style={{color:alertColor(lvl)}}>{s.stock}</strong> / min {s.min} {s.eenheid}</span>
                  </div>
                  <div style={{fontSize:11,color:"#1a7a45",fontWeight:700,marginTop:3}}>→ Bestellen: {qty} {s.eenheid} | {s.leverancier} ({s.levertijd}d)</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FILTER BAR */}
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Zoek artikel..."
          style={{padding:"8px 12px",border:"1.5px solid #e2e8f0",borderRadius:4,fontSize:13,flex:1,minWidth:160,fontFamily:"'Barlow',sans-serif"}}/>
        <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
          {cats.map(c=>(
            <button key={c} onClick={()=>setFilter(c)}
              style={{padding:"7px 12px",border:"1.5px solid",borderRadius:4,fontSize:11,fontWeight:700,
                cursor:"pointer",letterSpacing:.5,textTransform:"uppercase",
                borderColor:filter===c?"#1a202c":"#e2e8f0",
                background:filter===c?"#1a202c":"white",
                color:filter===c?"white":"#718096"}}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* STOCK TABEL */}
      <div style={{background:"white",border:"1.5px solid #e2e8f0",overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead>
              <tr style={{background:"#1a202c",color:"white"}}>
                {["Status","Code","Artikel","Post","Stock","Min","Bestel","Eenheid","Prijs","Leverancier","Levertijd",""].map(h=>(
                  <th key={h} style={{padding:"10px 12px",fontFamily:"'Barlow Condensed',sans-serif",
                    fontSize:12,fontWeight:700,letterSpacing:1,textTransform:"uppercase",textAlign:"left",whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s,i)=>{
                const lvl = alertLevel(s.stock, s.min);
                const isEdit = editId===s.id;
                return (
                  <tr key={s.id} style={{background:i%2===0?alertBg(lvl)+"88":"white",borderBottom:"1px solid #f0f0f0",transition:"background .15s"}}>
                    <td style={{padding:"9px 12px",whiteSpace:"nowrap"}}><AlertDot level={lvl}/></td>
                    <td style={{padding:"9px 12px"}}><Tag>{s.code}</Tag></td>
                    <td style={{padding:"9px 12px",fontWeight:600,color:"#1a202c"}}>{s.naam}</td>
                    <td style={{padding:"9px 12px",fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:"#553c9a"}}>{s.post}</td>
                    <td style={{padding:"9px 12px"}}>
                      {isEdit ? (
                        <input type="number" value={editVal.stock??s.stock} onChange={e=>setEditVal(v=>({...v,stock:+e.target.value}))}
                          style={{width:70,padding:"4px 6px",border:"1.5px solid #3182ce",borderRadius:3,fontSize:13,fontFamily:"'JetBrains Mono',monospace",textAlign:"center"}}/>
                      ) : (
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:700,
                          color:alertColor(lvl),fontSize:14}}>{s.stock}</span>
                      )}
                    </td>
                    <td style={{padding:"9px 12px",fontFamily:"'JetBrains Mono',monospace",color:"#718096"}}>{s.min}</td>
                    <td style={{padding:"9px 12px",fontFamily:"'JetBrains Mono',monospace",color:"#2b6cb0"}}>{s.bestel}</td>
                    <td style={{padding:"9px 12px",color:"#718096"}}>{s.eenheid}</td>
                    <td style={{padding:"9px 12px",fontFamily:"'JetBrains Mono',monospace"}}>{fmtEur(s.prijs)}</td>
                    <td style={{padding:"9px 12px",color:"#2d3748"}}>{s.leverancier}</td>
                    <td style={{padding:"9px 12px",color:"#718096"}}>{s.levertijd}d</td>
                    <td style={{padding:"9px 6px"}}>
                      {isEdit ? (
                        <div style={{display:"flex",gap:4}}>
                          <button onClick={saveEdit} style={{padding:"4px 10px",background:"#1a7a45",color:"white",border:"none",borderRadius:3,cursor:"pointer",fontSize:12,fontWeight:700}}>✓</button>
                          <button onClick={()=>setEditId(null)} style={{padding:"4px 8px",background:"#e2e8f0",color:"#4a5568",border:"none",borderRadius:3,cursor:"pointer",fontSize:12}}>✕</button>
                        </div>
                      ) : (
                        <button onClick={()=>{setEditId(s.id);setEditVal({stock:s.stock})}}
                          style={{padding:"4px 10px",background:"#ebf8ff",color:"#2b6cb0",border:"1px solid #bee3f8",borderRadius:3,cursor:"pointer",fontSize:11,fontWeight:700}}>
                          Bijwerken
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── MEETSTAAT PANEL ──────────────────────────────────────────────────────────
const MeetstaatPanel = ({ stock }) => {
  const [posten, setPosten] = useState(MEETSTAAT.map(p=>({...p, qty:0, qty2:0})));
  const [actieve, setActieve] = useState("allen");

  const cats = ["allen",...Array.from(new Set(MEETSTAAT.map(m=>m.cat)))];
  const filtered = posten.filter(p=>actieve==="allen"||p.cat===actieve);
  const totaal = posten.reduce((acc,p)=>acc+p.qty*p.EP,0);
  const totaalVorderd = posten.reduce((acc,p)=>acc+p.qty2*p.EP,0);

  const updPost = (post,field,val) => setPosten(prev=>prev.map(p=>p.post===post?{...p,[field]:+val}:p));

  // Link stock → posten
  const stockLink = (post) => {
    const items = stock.filter(s=>s.post===post && alertLevel(s.stock,s.min)!=="ok");
    return items;
  };

  return (
    <div style={{animation:"slideIn .3s ease"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:2,marginBottom:16}}>
        {[
          {lbl:"Totaal aanneemsom (geschat)",val:fmtEur(totaal),     color:"#2b6cb0"},
          {lbl:"Gevorderd",                  val:fmtEur(totaalVorderd),color:"#1a7a45"},
          {lbl:"Te vorderen",                val:fmtEur(totaal-totaalVorderd),color:"#c47a00"},
        ].map(({lbl,val,color})=>(
          <div key={lbl} style={{background:"#1a202c",padding:"16px 18px",borderLeft:`4px solid ${color}`}}>
            <div style={{fontSize:11,color:"rgba(255,255,255,.4)",letterSpacing:1,textTransform:"uppercase",fontWeight:600,marginBottom:4}}>{lbl}</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:800,color:"white"}}>{val}</div>
          </div>
        ))}
      </div>

      <div style={{display:"flex",gap:4,marginBottom:12,flexWrap:"wrap"}}>
        {cats.map(c=>(
          <button key={c} onClick={()=>setActieve(c)}
            style={{padding:"7px 14px",border:"1.5px solid",borderRadius:4,fontSize:11,fontWeight:700,
              cursor:"pointer",letterSpacing:.5,textTransform:"uppercase",
              borderColor:actieve===c?"#553c9a":"#e2e8f0",
              background:actieve===c?"#553c9a":"white",
              color:actieve===c?"white":"#718096"}}>
            {c}
          </button>
        ))}
      </div>

      <div style={{background:"white",border:"1.5px solid #e2e8f0",overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead>
              <tr style={{background:"#553c9a",color:"white"}}>
                {["Post","Omschrijving","Cat","E.H.","E.P.","Qty (bestek)","Bedrag bestek","Qty (gevorderd)","Bedrag gevorderd","Stock alert"].map(h=>(
                  <th key={h} style={{padding:"10px 12px",fontFamily:"'Barlow Condensed',sans-serif",
                    fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",textAlign:"left",whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p,i)=>{
                const alerts = stockLink(p.post);
                return (
                  <tr key={p.post} style={{background:i%2?"#f9f9ff":"white",borderBottom:"1px solid #f0f0f0"}}>
                    <td style={{padding:"9px 12px",fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:"#553c9a"}}>{p.post}</td>
                    <td style={{padding:"9px 12px",fontWeight:600,color:"#1a202c",minWidth:220}}>{p.omschrijving}</td>
                    <td style={{padding:"9px 12px"}}><Tag color="#553c9a">{p.cat}</Tag></td>
                    <td style={{padding:"9px 12px",color:"#718096",fontFamily:"'JetBrains Mono',monospace"}}>{p.eenheid}</td>
                    <td style={{padding:"9px 12px",fontFamily:"'JetBrains Mono',monospace"}}>{fmtEur(p.EP)}</td>
                    <td style={{padding:"9px 12px"}}>
                      <input type="number" min="0" value={p.qty} onChange={e=>updPost(p.post,"qty",e.target.value)}
                        style={{width:80,padding:"5px 8px",border:"1.5px solid #e2e8f0",borderRadius:3,
                          fontSize:13,fontFamily:"'JetBrains Mono',monospace",textAlign:"center"}}/>
                    </td>
                    <td style={{padding:"9px 12px",fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:"#2b6cb0"}}>{fmtEur(p.qty*p.EP)}</td>
                    <td style={{padding:"9px 12px"}}>
                      <input type="number" min="0" value={p.qty2} onChange={e=>updPost(p.post,"qty2",e.target.value)}
                        style={{width:80,padding:"5px 8px",border:"1.5px solid #c6f6d5",borderRadius:3,
                          fontSize:13,fontFamily:"'JetBrains Mono',monospace",textAlign:"center",background:"#f0fff4"}}/>
                    </td>
                    <td style={{padding:"9px 12px",fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:"#1a7a45"}}>{fmtEur(p.qty2*p.EP)}</td>
                    <td style={{padding:"9px 12px"}}>
                      {alerts.length>0 && (
                        <span style={{fontSize:11,color:"#c47a00",fontWeight:700}}>
                          ⚠ {alerts.map(a=>a.code).join(", ")}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{background:"#1a202c",color:"white"}}>
                <td colSpan={6} style={{padding:"12px",fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:800,letterSpacing:1}}>TOTAAL</td>
                <td style={{padding:"12px",fontFamily:"'JetBrains Mono',monospace",fontWeight:800,fontSize:15,color:"#63b3ed"}}>{fmtEur(totaal)}</td>
                <td/>
                <td style={{padding:"12px",fontFamily:"'JetBrains Mono',monospace",fontWeight:800,fontSize:15,color:"#68d391"}}>{fmtEur(totaalVorderd)}</td>
                <td/>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div style={{marginTop:8,fontSize:11,color:"#a0aec0",padding:"6px 2px"}}>
        ℹ Qty (gevorderd) = ingediende vorderingsstaat. Stock alert = gekoppeld aan voorraadniveau via postnummer.
      </div>
    </div>
  );
};

// ─── PLANNING PANEL ───────────────────────────────────────────────────────────
const PlanningPanel = () => {
  const [planning, setPlanning] = useState(INIT_PLANNING);
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("allen");

  const projects = ["allen","Zwijndrecht","Puurs"];
  const filtered = planning.filter(f=>filter==="allen"||f.project===filter);

  const upd = (id,field,val) => setPlanning(prev=>prev.map(p=>p.id===id?{...p,[field]:val}:p));

  const totAansl = filtered.reduce((a,p)=>a+p.aansluitingen,0);
  const totVlario = filtered.reduce((a,p)=>a+Math.round(p.aansluitingen*(p.voortgang/100)),0);

  // Today line position
  const todayPct = ganttPct(today);

  return (
    <div style={{animation:"slideIn .3s ease"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:2,marginBottom:16}}>
        {[
          {lbl:"Totaal fasen",    val:filtered.length,      color:"#2b6cb0"},
          {lbl:"Aansluitingen",   val:totAansl,             color:"#553c9a"},
          {lbl:"Vlario klaar",    val:totVlario,            color:"#1a7a45"},
          {lbl:"% Gereed",        val:Math.round(totVlario/Math.max(totAansl,1)*100)+"%", color:"#e8401c"},
        ].map(({lbl,val,color})=>(
          <div key={lbl} style={{background:"#1a202c",padding:"14px 16px",borderLeft:`4px solid ${color}`}}>
            <div style={{fontSize:11,color:"rgba(255,255,255,.4)",letterSpacing:1,textTransform:"uppercase",fontWeight:600,marginBottom:3}}>{lbl}</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:30,fontWeight:800,color:"white"}}>{val}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{display:"flex",gap:4,marginBottom:16}}>
        {projects.map(p=>(
          <button key={p} onClick={()=>setFilter(p)}
            style={{padding:"7px 16px",border:"1.5px solid",borderRadius:4,fontSize:12,fontWeight:700,
              cursor:"pointer",letterSpacing:.5,textTransform:"uppercase",
              borderColor:filter===p?"#e8401c":"#e2e8f0",
              background:filter===p?"#e8401c":"white",
              color:filter===p?"white":"#718096"}}>
            {p}
          </button>
        ))}
      </div>

      {/* GANTT */}
      <div style={{background:"white",border:"1.5px solid #e2e8f0",marginBottom:16,overflow:"hidden"}}>
        <div style={{background:"#1a202c",padding:"10px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:800,color:"white",letterSpacing:1}}>GANTT — PROJECTPLANNING 2025–2026</span>
          <span style={{fontSize:11,color:"rgba(255,255,255,.4)",fontFamily:"'JetBrains Mono',monospace"}}>{GANTT_START} → {GANTT_END}</span>
        </div>
        {/* Maand-labels */}
        <div style={{position:"relative",height:24,background:"#f7fafc",borderBottom:"1px solid #e2e8f0",overflow:"hidden"}}>
          {["Jan","Feb","Mrt","Apr","Mei","Jun","Jul","Aug","Sep","Okt","Nov","Dec","Jan","Feb","Mrt"].map((m,i)=>{
            const d = new Date(2025,i,1).toISOString().slice(0,10);
            const pct = ganttPct(d);
            return pct>=0&&pct<=100 ? (
              <div key={i} style={{position:"absolute",left:pct+"%",top:0,height:"100%",
                borderLeft:"1px solid #e2e8f0",paddingLeft:3,fontSize:9,fontWeight:700,
                color:"#a0aec0",letterSpacing:.5,display:"flex",alignItems:"center",
                fontFamily:"'Barlow Condensed',sans-serif"}}>
                {m}{i>=12?" '26":" '25"}
              </div>
            ):null;
          })}
          {/* Today line */}
          <div style={{position:"absolute",left:todayPct+"%",top:0,width:2,height:"100%",background:"#e8401c",zIndex:5}}/>
        </div>
        {/* Fase balken */}
        <div style={{padding:"8px 0"}}>
          {filtered.map(f=>{
            const s = ganttPct(f.start);
            const e = ganttPct(f.einde);
            const w = Math.max(0.5, e-s);
            const c = statusColor(f.status);
            return (
              <div key={f.id} style={{position:"relative",height:32,marginBottom:3,display:"flex",alignItems:"center"}}>
                <div style={{width:200,flexShrink:0,paddingRight:8,paddingLeft:12,fontSize:11,fontWeight:600,
                  color:"#4a5568",textAlign:"right",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                  <span style={{fontSize:10,color:"#a0aec0",marginRight:4}}>{f.project}</span>{f.fase.split("–")[1]?.trim()||f.fase}
                </div>
                <div style={{flex:1,position:"relative",height:"100%"}}>
                  {/* Today line overlay */}
                  <div style={{position:"absolute",left:todayPct+"%",top:0,width:2,height:"100%",background:"#e8401c",opacity:.3,zIndex:5}}/>
                  {/* Bar */}
                  <div style={{position:"absolute",left:s+"%",width:w+"%",top:6,height:20,
                    background:c,borderRadius:2,opacity:.85,cursor:"pointer",transition:"opacity .2s"}}
                    title={`${f.fase}: ${f.start} → ${f.einde}`}
                    onMouseEnter={e=>e.target.style.opacity="1"}
                    onMouseLeave={e=>e.target.style.opacity=".85"}>
                    {/* Progress fill */}
                    <div style={{position:"absolute",left:0,top:0,height:"100%",width:f.voortgang+"%",
                      background:"rgba(255,255,255,.35)",borderRadius:2}}/>
                    {w>5 && <div style={{position:"absolute",left:4,top:2,fontSize:9,fontWeight:700,color:"white",whiteSpace:"nowrap",overflow:"hidden"}}>
                      {f.voortgang>0?f.voortgang+"% ":""}
                    </div>}
                  </div>
                </div>
                <div style={{width:40,flexShrink:0,textAlign:"right",paddingRight:8,fontSize:10,
                  fontFamily:"'JetBrains Mono',monospace",color:"#718096"}}>{f.aansluitingen}</div>
              </div>
            );
          })}
        </div>
        <div style={{padding:"6px 16px 10px",display:"flex",gap:16,fontSize:11,color:"#a0aec0",borderTop:"1px solid #f0f0f0"}}>
          {[["in uitvoering","#e8401c"],["gepland","#2b6cb0"],["afgerond","#1a7a45"],["vertraagd","#c47a00"]].map(([l,c])=>(
            <span key={l} style={{display:"flex",alignItems:"center",gap:4}}>
              <span style={{width:12,height:8,background:c,borderRadius:1,display:"inline-block"}}/>
              {l}
            </span>
          ))}
          <span style={{marginLeft:"auto"}}>Lichte balk = voortgang | # = aansluitingen</span>
        </div>
      </div>

      {/* FASE TABEL */}
      <div style={{background:"white",border:"1.5px solid #e2e8f0",overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead>
              <tr style={{background:"#2b6cb0",color:"white"}}>
                {["Project","Fase","Start","Einde","Ploeg","Aansl.","Voortgang %","Status",""].map(h=>(
                  <th key={h} style={{padding:"10px 12px",fontFamily:"'Barlow Condensed',sans-serif",
                    fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",textAlign:"left",whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((f,i)=>{
                const isEdit = editId===f.id;
                return (
                  <tr key={f.id} style={{background:i%2?"#f7fafc":"white",borderBottom:"1px solid #f0f0f0"}}>
                    <td style={{padding:"9px 12px"}}><Tag color="#2b6cb0">{f.project}</Tag></td>
                    <td style={{padding:"9px 12px",fontWeight:600,color:"#1a202c",maxWidth:180}}>{f.fase}</td>
                    <td style={{padding:"9px 8px",fontFamily:"'JetBrains Mono',monospace",fontSize:12}}>
                      {isEdit?<input type="date" value={f.start} onChange={e=>upd(f.id,"start",e.target.value)}
                        style={{padding:"3px 6px",border:"1.5px solid #3182ce",borderRadius:3,fontSize:12,fontFamily:"'JetBrains Mono',monospace"}}/>:f.start}
                    </td>
                    <td style={{padding:"9px 8px",fontFamily:"'JetBrains Mono',monospace",fontSize:12}}>
                      {isEdit?<input type="date" value={f.einde} onChange={e=>upd(f.id,"einde",e.target.value)}
                        style={{padding:"3px 6px",border:"1.5px solid #3182ce",borderRadius:3,fontSize:12,fontFamily:"'JetBrains Mono',monospace"}}/>:f.einde}
                    </td>
                    <td style={{padding:"9px 8px"}}>
                      {isEdit?<input value={f.ploeg} onChange={e=>upd(f.id,"ploeg",e.target.value)}
                        style={{padding:"3px 6px",border:"1.5px solid #3182ce",borderRadius:3,fontSize:12,width:90}}/>:f.ploeg}
                    </td>
                    <td style={{padding:"9px 8px",fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:"#553c9a"}}>{f.aansluitingen}</td>
                    <td style={{padding:"9px 8px",minWidth:140}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        {isEdit?(
                          <input type="range" min="0" max="100" value={f.voortgang}
                            onChange={e=>upd(f.id,"voortgang",+e.target.value)}
                            style={{flex:1,accentColor:statusColor(f.status)}}/>
                        ):(
                          <div style={{flex:1,height:6,background:"#e2e8f0",borderRadius:3,overflow:"hidden"}}>
                            <div style={{height:"100%",width:f.voortgang+"%",background:statusColor(f.status),borderRadius:3,transition:"width .3s"}}/>
                          </div>
                        )}
                        <span style={{fontSize:12,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",minWidth:32,color:statusColor(f.status)}}>{f.voortgang}%</span>
                      </div>
                    </td>
                    <td style={{padding:"9px 8px"}}>
                      {isEdit?(
                        <select value={f.status} onChange={e=>upd(f.id,"status",e.target.value)}
                          style={{padding:"4px 6px",border:"1.5px solid #3182ce",borderRadius:3,fontSize:12}}>
                          {["gepland","in uitvoering","afgerond","vertraagd"].map(s=><option key={s}>{s}</option>)}
                        </select>
                      ):(
                        <Tag color={statusColor(f.status)}>{f.status}</Tag>
                      )}
                    </td>
                    <td style={{padding:"9px 8px"}}>
                      {isEdit?(
                        <button onClick={()=>setEditId(null)}
                          style={{padding:"4px 10px",background:"#1a7a45",color:"white",border:"none",borderRadius:3,cursor:"pointer",fontSize:12,fontWeight:700}}>✓</button>
                      ):(
                        <button onClick={()=>setEditId(f.id)}
                          style={{padding:"4px 10px",background:"#ebf8ff",color:"#2b6cb0",border:"1px solid #bee3f8",borderRadius:3,cursor:"pointer",fontSize:11,fontWeight:700}}>Bewerken</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN APP ────────────────────────────────────────────────────────────────
const TABS = [
  {id:"stock",   label:"Stock & Besteladvies", icon:"📦"},
  {id:"meetstaat",label:"Meetstaat & Posten",  icon:"📋"},
  {id:"planning", label:"Planning & Gantt",    icon:"📅"},
];

export default function ProjectDashboard() {
  const [tab, setTab] = useState("stock");
  const [stock, setStock] = useState(INIT_STOCK);

  const alerts = stock.filter(s=>["leeg","kritiek","laag"].includes(alertLevel(s.stock,s.min)));

  return (
    <div style={{minHeight:"100vh",background:"#f0ede6",fontFamily:"'Barlow',sans-serif"}}>
      <StyleTag/>

      {/* TOP HEADER */}
      <div style={{background:"#0f1623",borderBottom:"2px solid #e8401c",padding:"0 32px"}}>
        <div style={{maxWidth:1400,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:20,padding:"14px 0"}}>
            <div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,letterSpacing:4,
                textTransform:"uppercase",color:"#e8401c",fontWeight:700}}>COLAS BELGIË</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:900,
                color:"white",letterSpacing:1,lineHeight:1}}>PROJECT DASHBOARD</div>
            </div>
            <div style={{width:1,height:36,background:"rgba(255,255,255,.1)"}}/>
            <div style={{fontSize:12,color:"rgba(255,255,255,.4)"}}>PUURS & ZWIJNDRECHT · {today}</div>
          </div>
          {alerts.length>0 && (
            <div style={{display:"flex",alignItems:"center",gap:8,background:"#e53e3e18",
              border:"1px solid #e53e3e40",borderRadius:4,padding:"8px 14px"}}>
              <span style={{width:8,height:8,borderRadius:"50%",background:"#e53e3e",
                display:"inline-block",animation:"pulse 1.2s infinite"}}/>
              <span style={{fontSize:12,fontWeight:700,color:"#fc8181"}}>{alerts.length} stockalert{alerts.length>1?"s":""}</span>
            </div>
          )}
        </div>
      </div>

      {/* TAB NAV */}
      <div style={{background:"#1a202c",padding:"0 32px"}}>
        <div style={{maxWidth:1400,margin:"0 auto",display:"flex",gap:2}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              style={{padding:"14px 24px",background:"none",border:"none",borderBottom:`3px solid ${tab===t.id?"#e8401c":"transparent"}`,
                color:tab===t.id?"white":"rgba(255,255,255,.4)",fontFamily:"'Barlow Condensed',sans-serif",
                fontSize:15,fontWeight:700,letterSpacing:1,textTransform:"uppercase",cursor:"pointer",
                transition:"all .2s",display:"flex",alignItems:"center",gap:8}}>
              <span>{t.icon}</span>{t.label}
              {t.id==="stock" && alerts.length>0 && (
                <span style={{background:"#e53e3e",color:"white",borderRadius:"50%",width:18,height:18,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800}}>
                  {alerts.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{maxWidth:1400,margin:"0 auto",padding:"24px 32px"}}>
        {tab==="stock"    && <StockPanel    stock={stock} setStock={setStock}/>}
        {tab==="meetstaat"&& <MeetstaatPanel stock={stock}/>}
        {tab==="planning" && <PlanningPanel/>}
      </div>
    </div>
  );
}
