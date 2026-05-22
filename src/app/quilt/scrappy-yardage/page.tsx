"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer } from "lucide-react";
export default function Page(){
const[qw,sW]=useState("60");const[qh,sH]=useState("80");const[patchSize,sPS]=useState("5");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const w2=parseFloat(qw)||60;const h2=parseFloat(qh)||80;const ps=parseFloat(patchSize)||5;const patches=Math.ceil(w2/ps)*Math.ceil(h2/ps);const yd=Math.ceil((patches*(ps+0.5)*(ps+0.5))/(42*36)*8)/8;const hasResult=true;const resultValue=patches+" patches, ~"+yd+" yards";const resultLabel="scrappy quilt estimate";
const faqItems=[{q:"How much fabric for a scrappy quilt?",a:"It depends on patch size, but plan for 30% extra to account for variety."}];
return(<div className="container"><Breadcrumb items={[{label:"Quilt Tools",href:"/quilt"},{label:"Scrappy Quilt Estimator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Quilt #164</span><h1>Scrappy Quilt Estimator</h1><p>Yardage for scrappy quilts from mixed scraps.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Quilt W</label><input type="number" className="input-field" value={qw} onChange={e=>sW(e.target.value)}/></div><div className="input-group"><label className="input-label">Quilt H</label><input type="number" className="input-field" value={qh} onChange={e=>sH(e.target.value)}/></div><div className="input-group"><label className="input-label">Patch size</label><input type="number" className="input-field" value={patchSize} onChange={e=>sPS(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/quilt" className="related-tool-link"> All Quilt</a></div></aside></div></div>);}