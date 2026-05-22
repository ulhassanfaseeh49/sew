"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, ShoppingBag } from "lucide-react";
export default function Page(){
const[w,sW]=useState("14");const[h,sH]=useState("16");const[d,sD]=useState("4");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const w2=parseFloat(w)||14;const h2=parseFloat(h)||16;const d2=parseFloat(d)||4;const bodyW=w2+d2+1;const bodyH=h2*2+d2+1;const yd=Math.ceil(bodyW*bodyH/(44*36)*4)/4;const hasResult=true;const resultValue=yd+" yards outer + "+yd+" yards lining";const resultLabel=bodyW+"\" × "+bodyH+"\" main panel";
const faqItems=[{q:"What size tote is most useful?",a:"14×16×4 inches is a great everyday tote. Fits laptops, groceries, and everyday essentials."}];
return(<div className="container"><Breadcrumb items={[{label:"Bags",href:"/bags"},{label:"Tote Bag Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><ShoppingBag size={14} strokeWidth={1.5} /> Bag #367</span><h1>Tote Bag Calculator</h1><p>Fabric for tote bags by dimensions.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Width (in)</label><input type="number" className="input-field" value={w} onChange={e=>sW(e.target.value)}/></div><div className="input-group"><label className="input-label">Height (in)</label><input type="number" className="input-field" value={h} onChange={e=>sH(e.target.value)}/></div><div className="input-group"><label className="input-label">Depth (in)</label><input type="number" className="input-field" value={d} onChange={e=>sD(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/bags" className="related-tool-link"><ShoppingBag size={13} /> All Bags</a></div></aside></div></div>);}