"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Shirt } from "lucide-react";
export default function Page(){
const[measurement,sM]=useState("");const[shrinkPct,sS]=useState("5");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const m2=parseFloat(measurement)||0;const s=parseFloat(shrinkPct)||5;const adjusted=m2/(1-s/100);const extra=adjusted-m2;const hasResult=m2>0;const resultValue=adjusted.toFixed(2)+"\" adjusted pattern";const resultLabel="add "+extra.toFixed(2)+"\" to compensate for "+s+"% shrinkage";
const faqItems=[{q:"Should I adjust the pattern or buy extra fabric?",a:"Pre-washing is best. If you cant pre-wash, adjust the pattern by the shrinkage percentage."}];
return(<div className="container"><Breadcrumb items={[{label:"Shrinkage",href:"/shrinkage"},{label:"Garment Shrinkage Adjuster"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Shirt size={14} strokeWidth={1.5} /> Shrinkage #237</span><h1>Garment Shrinkage Adjuster</h1><p>Pattern size adjustments for expected shrinkage.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Pattern measurement (in)</label><input type="number" className="input-field" placeholder="36" value={measurement} onChange={e=>sM(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Expected shrinkage %</label><input type="number" className="input-field" value={shrinkPct} onChange={e=>sS(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/shrinkage" className="related-tool-link"> All Shrinkage</a></div></aside></div></div>);}