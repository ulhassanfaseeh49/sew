"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Plus, Printer } from "lucide-react";
export default function Page(){
const[yards,sY]=useState("");const[shrinkPct,sS]=useState("5");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const y=parseFloat(yards)||0;const s=parseFloat(shrinkPct)||5;const buyYd=y/(1-s/100);const extra=buyYd-y;const hasResult=y>0;const resultValue=Math.ceil(buyYd*8)/8+" yards to buy";const resultLabel="buy "+extra.toFixed(2)+" extra yards for "+s+"% shrinkage";
const faqItems=[{q:"How do I calculate extra for shrinkage?",a:"Divide your needed yardage by (1 - shrinkage%). For 3 yards at 5%: 3 / 0.95 = 3.16 yards."}];
return(<div className="container"><Breadcrumb items={[{label:"Shrinkage",href:"/shrinkage"},{label:"Buy Extra for Shrinkage"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Plus size={14} strokeWidth={1.5} /> Shrinkage #231</span><h1>Buy Extra for Shrinkage</h1><p>How much extra fabric to buy for shrinkage.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Yards needed</label><input type="number" className="input-field" placeholder="3" value={yards} onChange={e=>sY(e.target.value)} min="0" step="0.125"/></div><div className="input-group"><label className="input-label">Shrinkage %</label><input type="number" className="input-field" value={shrinkPct} onChange={e=>sS(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Extra</span><strong>{extra.toFixed(2)} yards</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/shrinkage" className="related-tool-link"> All Shrinkage</a></div></aside></div></div>);}