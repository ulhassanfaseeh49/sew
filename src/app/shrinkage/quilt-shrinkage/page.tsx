"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer } from "lucide-react";
export default function Page(){
const[qw,sW]=useState("60");const[qh,sH]=useState("80");const[batting,sB]=useState("cotton");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const w=parseFloat(qw)||60;const h=parseFloat(qh)||80;const pct=batting==="cotton"?4:batting==="poly"?1.5:2.5;const newW=w*(1-pct/100);const newH=h*(1-pct/100);const hasResult=true;const resultValue=Math.round(newW)+"x"+Math.round(newH)+"\"";const resultLabel="after ~"+pct+"% shrinkage with "+batting+" batting";
const faqItems=[{q:"Should I pre-wash quilt fabric?",a:"Many quilters skip pre-washing for the crinkly vintage look. Pre-wash if you need exact sizing."}];
return(<div className="container"><Breadcrumb items={[{label:"Shrinkage",href:"/shrinkage"},{label:"Quilt Shrinkage Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Shrinkage #236</span><h1>Quilt Shrinkage Calculator</h1><p>How much a quilt shrinks after first wash.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Quilt width</label><input type="number" className="input-field" value={qw} onChange={e=>sW(e.target.value)}/></div><div className="input-group"><label className="input-label">Quilt height</label><input type="number" className="input-field" value={qh} onChange={e=>sH(e.target.value)}/></div><div className="input-group"><label className="input-label">Batting</label><select className="input-field" value={batting} onChange={e=>sB(e.target.value)}><option value="cotton">Cotton (3-5%)</option><option value="poly">Polyester (1-2%)</option><option value="blend">Cotton/poly blend (2-3%)</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/shrinkage" className="related-tool-link"> All Shrinkage</a></div></aside></div></div>);}