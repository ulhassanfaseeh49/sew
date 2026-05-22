"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer } from "lucide-react";
export default function Page(){
const[fin,sF]=useState("8");const[wedges,sW2]=useState("8");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const f=parseFloat(fin)||8;const w3=parseInt(wedges)||8;const angle=360/w3;const cutSq=f/2+1;const hasResult=f>0;const resultValue=w3+" wedges at "+angle+"°";const resultLabel="cut from "+cutSq.toFixed(1)+"\" squares";
const faqItems=[{q:"What is a kaleidoscope block?",a:"A circular design made from identical wedge-shaped pieces."}];
return(<div className="container"><Breadcrumb items={[{label:"Quilt Tools",href:"/quilt"},{label:"Kaleidoscope Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Quilt #159</span><h1>Kaleidoscope Calculator</h1><p>Cutting sizes for kaleidoscope blocks.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Finished size</label><input type="number" className="input-field" value={fin} onChange={e=>sF(e.target.value)}/></div><div className="input-group"><label className="input-label">Wedges</label><select className="input-field" value={wedges} onChange={e=>sW2(e.target.value)}><option value="4">4</option><option value="6">6</option><option value="8">8</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/quilt" className="related-tool-link"> All Quilt</a></div></aside></div></div>);}