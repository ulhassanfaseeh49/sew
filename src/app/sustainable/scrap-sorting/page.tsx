"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Recycle, Ruler } from "lucide-react";
export default function Page(){
const[size,sS]=useState("medium");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const info:Record<string,{projects:string,storage:string}>={tiny:{projects:"Stuffing, confetti, paper piecing foundations",storage:"Compost or textile recycling bin"},small:{projects:"2.5\" squares, HST, small appliqué, hexagons",storage:"Sort by color in zip bags"},medium:{projects:"5\" charm squares, log cabin centers, small pouches",storage:"Sort by color/print in bins"},large:{projects:"Fat quarter projects, blocks, bibs, face masks",storage:"Fold and file in drawers by color"},yardage:{projects:"Full garment pieces, large projects, backing",storage:"Fold on mini bolts or hang in closet"}};const i2=info[size]||info.medium;const hasResult=true;const resultValue=size+" scraps: "+i2.projects;const resultLabel="storage tip: "+i2.storage;
const faqItems=[{q:"Should I save all scraps?",a:"Save anything 2 inches or larger. Smaller pieces can be used for stuffing or composted if natural fiber."}];
return(<div className="container"><Breadcrumb items={[{label:"Sustainable",href:"/sustainable"},{label:"Scrap Sorting Guide"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Eco #459</span><h1>Scrap Sorting Guide</h1><p>Sort scraps by usable size.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Scrap size category</label><select className="input-field" value={size} onChange={e=>sS(e.target.value)}><option value="tiny">Tiny (under 2\")</option><option value="small">Small (2-5\")</option><option value="medium">Medium (5-10\")</option><option value="large">Large (10-18\")</option><option value="yardage">Usable yardage (18\"+)</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/sustainable" className="related-tool-link"><Recycle size={13} /> All Sustainable</a></div></aside></div></div>);}