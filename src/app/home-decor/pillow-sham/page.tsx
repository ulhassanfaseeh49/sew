"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[size,sS]=useState("standard");const[flange,sF]=useState("2");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const dims:Record<string,[number,number]>={standard:[20,26],king:[20,36],euro:[26,26]};const[ph,pw]=dims[size]||[20,26];const f=parseFloat(flange)||2;const cutW=pw+f*2+1;const cutH=ph+f*2+1;const backW=Math.ceil(pw*0.65);const yd=Math.ceil((cutW*(cutH+backW*2))/(54*36)*4)/4;const hasResult=true;const resultValue=yd+" yards per sham";const resultLabel=size+" with "+f+"\" flange";
const faqItems=[{q:"What is a pillow sham flange?",a:"A decorative flat border around the edge, typically 2-3 inches wide."}];
return(<div className="container"><Breadcrumb items={[{label:"Home Decor",href:"/home-decor"},{label:"Pillow Sham Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🛌</span> Home #278</span><h1>Pillow Sham Calculator</h1><p>Fabric for pillow shams.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Pillow size</label><select className="input-field" value={size} onChange={e=>sS(e.target.value)}><option value="standard">Standard (20×26)</option><option value="king">King (20×36)</option><option value="euro">Euro (26×26)</option></select></div><div className="input-group"><label className="input-label">Flange width (in)</label><input type="number" className="input-field" value={flange} onChange={e=>sF(e.target.value)} min="0"/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/home-decor" className="related-tool-link">🏠 All Home</a></div></aside></div></div>);}