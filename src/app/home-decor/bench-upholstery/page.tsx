"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer } from "lucide-react";
export default function Page(){
const[len,sL]=useState("48");const[depth,sD]=useState("16");const[foam,sF]=useState("3");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const l=parseFloat(len)||48;const d=parseFloat(depth)||16;const f=parseFloat(foam)||3;const cutW=d+f*2+4;const cutL=l+f*2+4;const yd=Math.ceil(cutW*cutL/(54*36)*4)/4;const hasResult=true;const resultValue=yd+" yards";const resultLabel=cutL+"\" x "+cutW+"\" cut piece";
const faqItems=[{q:"What foam thickness for a bench?",a:"2-3 inches for dining benches, 4 inches for window seats. Use high-density foam for durability."}];
return(<div className="container"><Breadcrumb items={[{label:"Home Decor",href:"/home-decor"},{label:"Bench Upholstery"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🪵</span> Home #259</span><h1>Bench Upholstery</h1><p>Yardage for benches.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Length (in)</label><input type="number" className="input-field" value={len} onChange={e=>sL(e.target.value)}/></div><div className="input-group"><label className="input-label">Depth (in)</label><input type="number" className="input-field" value={depth} onChange={e=>sD(e.target.value)}/></div><div className="input-group"><label className="input-label">Foam height (in)</label><input type="number" className="input-field" value={foam} onChange={e=>sF(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/home-decor" className="related-tool-link"> All Home</a></div></aside></div></div>);}