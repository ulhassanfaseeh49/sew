"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Ruler, Scissors } from "lucide-react";
export default function Page(){
const[stripW,sS]=useState("");const[fw,sFw]=useState("42");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const sw=parseFloat(stripW)||0;const fw2=parseFloat(fw)||42;const perYard=Math.floor(36/sw);const perStrip=Math.floor(fw2/sw);const hasResult=sw>0;const resultValue=perYard+" WOF strips per yard";const resultLabel="each strip yields "+perStrip+" sub-cuts at "+sw+"\"";
const faqItems=[{q:"How many strips per yard?",a:"Divide 36 by strip width. A 2.5 inch strip gives 14 strips per yard."}];
return(<div className="container"><Breadcrumb items={[{label:"Cutting Tools",href:"/cutting"},{label:"Strip Cutting Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Cutting #167</span><h1>Strip Cutting Calculator</h1><p>How many strips from a yard of fabric.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Strip width (in)</label><input type="number" className="input-field" placeholder="2.5" value={stripW} onChange={e=>sS(e.target.value)} min="0" step="0.25"/></div><div className="input-group"><label className="input-label">Fabric width</label><input type="number" className="input-field" value={fw} onChange={e=>sFw(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Strips per yard</span><strong>{perYard}</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/cutting" className="related-tool-link"><Scissors size={13} /> All Cutting</a></div></aside></div></div>);}