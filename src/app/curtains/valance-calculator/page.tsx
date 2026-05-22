"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Frame, Printer } from "lucide-react";
export default function Page(){
const[winW,sW]=useState("");const[depth,sD]=useState("18");const[fullness,sF]=useState("2.5");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const w=parseFloat(winW)||0;const d=parseFloat(depth)||18;const f=parseFloat(fullness)||2.5;const fabricW=w*f;const cutD=d+6;const widths=Math.ceil(fabricW/54);const yd=Math.ceil(widths*cutD/36*4)/4;const hasResult=w>0;const resultValue=yd+" yards";const resultLabel=widths+" width(s) at "+cutD+"\" cut depth";
const faqItems=[{q:"How deep should a valance be?",a:"Typically 15-20 inches, or about 1/5 of the window height. Deeper for formal, shallower for casual."}];
return(<div className="container"><Breadcrumb items={[{label:"Curtains",href:"/curtains"},{label:"Valance Yardage Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Curtain #246</span><h1>Valance Yardage Calculator</h1><p>Yardage for valances by style.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Window width (in)</label><input type="number" className="input-field" placeholder="60" value={winW} onChange={e=>sW(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Valance depth (in)</label><input type="number" className="input-field" value={depth} onChange={e=>sD(e.target.value)}/></div><div className="input-group"><label className="input-label">Fullness</label><input type="number" className="input-field" value={fullness} onChange={e=>sF(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/curtains" className="related-tool-link"><Frame size={13} /> All Curtains</a></div></aside></div></div>);}