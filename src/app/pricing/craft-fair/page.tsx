"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, DollarSign, Printer } from "lucide-react";
export default function Page(){
const[booth,sB]=useState("");const[items,sI]=useState("");const[avgPrice,sA]=useState("");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const b=parseFloat(booth)||0;const i2=parseInt(items)||0;const ap=parseFloat(avgPrice)||0;const revenue=i2*ap;const breakEvenItems=ap>0?Math.ceil(b/ap):0;const hasResult=b>0&&i2>0&&ap>0;const resultValue="sell "+breakEvenItems+" items to break even";const resultLabel="revenue if sold out: $"+revenue.toFixed(0)+" — booth: $"+b;
const faqItems=[{q:"How many items should I bring?",a:"Bring 2-3x what you expect to sell. Variety attracts browsers. Display at multiple price points."}];
return(<div className="container"><Breadcrumb items={[{label:"Pricing",href:"/pricing"},{label:"Craft Fair Pricing"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Pricing #405</span><h1>Craft Fair Pricing</h1><p>Pricing for craft fairs.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Booth cost ($)</label><input type="number" className="input-field" placeholder="150" value={booth} onChange={e=>sB(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Items to sell</label><input type="number" className="input-field" placeholder="50" value={items} onChange={e=>sI(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Average price ($)</label><input type="number" className="input-field" placeholder="25" value={avgPrice} onChange={e=>sA(e.target.value)} min="0"/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/pricing" className="related-tool-link"><DollarSign size={13} /> All Pricing</a></div></aside></div></div>);}