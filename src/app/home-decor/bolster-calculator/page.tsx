"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[dia,sD]=useState("6");const[len,sL]=useState("18");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const d=parseFloat(dia)||6;const l=parseFloat(len)||18;const circ=d*Math.PI;const bodyW=circ+1;const bodyL=l+1;const circleR=d/2+0.5;const yd=Math.ceil((bodyW*bodyL+circleR*circleR*Math.PI*2)/(54*36)*4)/4;const hasResult=true;const resultValue=yd+" yards";const resultLabel=bodyW.toFixed(1)+"\" × "+bodyL+"\" body + 2 circles";
const faqItems=[{q:"How do I sew a bolster end?",a:"Cut a circle (diameter + 1 inch SA). Pin and sew around, clipping curves for smooth fit."}];
return(<div className="container"><Breadcrumb items={[{label:"Home Decor",href:"/home-decor"},{label:"Bolster Pillow Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🔵</span> Home #264</span><h1>Bolster Pillow Calculator</h1><p>Fabric for bolster pillows.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Diameter (in)</label><input type="number" className="input-field" value={dia} onChange={e=>sD(e.target.value)}/></div><div className="input-group"><label className="input-label">Length (in)</label><input type="number" className="input-field" value={len} onChange={e=>sL(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/home-decor" className="related-tool-link">🏠 All Home</a></div></aside></div></div>);}