"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { Activity, ClipboardCopy, Printer } from "lucide-react";
export default function Page(){
const[tableLen,sL]=useState("60");const[overhang,sO]=useState("6");const[runnerW,sW]=useState("14");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const tl=parseFloat(tableLen)||60;const oh=parseFloat(overhang)||6;const rw=parseFloat(runnerW)||14;const cutL=tl+oh*2+1;const cutW=rw+1;const yd=Math.ceil(cutL/36*4)/4;const hasResult=true;const resultValue=yd+" yards";const resultLabel=cutL+"\" × "+cutW+"\" runner";
const faqItems=[{q:"How long should a table runner be?",a:"Table length plus 6-12 inches overhang on each end."}];
return(<div className="container"><Breadcrumb items={[{label:"Home Decor",href:"/home-decor"},{label:"Table Runner Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Activity size={14} strokeWidth={1.5} /> Home #270</span><h1>Table Runner Calculator</h1><p>Fabric for table runners.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Table length (in)</label><input type="number" className="input-field" value={tableLen} onChange={e=>sL(e.target.value)}/></div><div className="input-group"><label className="input-label">Overhang each end</label><input type="number" className="input-field" value={overhang} onChange={e=>sO(e.target.value)}/></div><div className="input-group"><label className="input-label">Runner width</label><input type="number" className="input-field" value={runnerW} onChange={e=>sW(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/home-decor" className="related-tool-link"> All Home</a></div></aside></div></div>);}