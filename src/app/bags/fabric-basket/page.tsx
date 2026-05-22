"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, ShoppingBag } from "lucide-react";
export default function Page(){
const[w,sW]=useState("10");const[d,sD]=useState("10");const[h,sH]=useState("8");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const w2=parseFloat(w)||10;const d2=parseFloat(d)||10;const h2=parseFloat(h)||8;const cutW=w2+1;const cutH=h2*2+d2+1;const yd=Math.ceil(cutW*cutH*2/(44*36)*4)/4;const hasResult=true;const resultValue=yd+" yards outer + "+yd+" yards lining";const resultLabel=w2+"×"+d2+"×"+h2+"\" basket + heavy interfacing";
const faqItems=[{q:"How do I make a fabric basket stand up?",a:"Use Peltex 70 or ByAnnie soft and stable foam interfacing. Double-layer fusible fleece also works."}];
return(<div className="container"><Breadcrumb items={[{label:"Bags",href:"/bags"},{label:"Fabric Basket Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Bag #385</span><h1>Fabric Basket Calculator</h1><p>Storage basket dimensions.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Width (in)</label><input type="number" className="input-field" value={w} onChange={e=>sW(e.target.value)}/></div><div className="input-group"><label className="input-label">Depth (in)</label><input type="number" className="input-field" value={d} onChange={e=>sD(e.target.value)}/></div><div className="input-group"><label className="input-label">Height (in)</label><input type="number" className="input-field" value={h} onChange={e=>sH(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/bags" className="related-tool-link"><ShoppingBag size={13} /> All Bags</a></div></aside></div></div>);}