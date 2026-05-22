"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[head,sH]=useState("22");const[type,sT]=useState("knotted");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const h=parseFloat(head)||22;const dims:Record<string,{l:number,w:number}>={knotted:{l:Math.round(h*1.5),w:5},turban:{l:Math.round(h*2),w:8},["elastic-back"]:{l:Math.round(h*0.7),w:4}};const d=dims[type]||dims.knotted;const hasResult=true;const resultValue=d.l+"\" × "+d.w+"\" fabric strip";const resultLabel=type+" headband for "+h+"\" head";
const faqItems=[{q:"What fabric for headbands?",a:"Knit jersey works best — it stretches comfortably. Cotton for non-stretch with elastic back."}];
return(<div className="container"><Breadcrumb items={[{label:"Bags",href:"/bags"},{label:"Headband Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🤸</span> Bag #382</span><h1>Headband Calculator</h1><p>Headband width and length.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Head circumference (in)</label><input type="number" className="input-field" value={head} onChange={e=>sH(e.target.value)}/></div><div className="input-group"><label className="input-label">Style</label><select className="input-field" value={type} onChange={e=>sT(e.target.value)}><option value="knotted">Knotted</option><option value="turban">Turban</option><option value="elastic-back">Elastic back</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/bags" className="related-tool-link">👜 All Bags</a></div></aside></div></div>);}