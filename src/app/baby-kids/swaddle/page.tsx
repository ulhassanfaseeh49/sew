"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[size,sS]=useState("large");const[layers,sL]=useState("1");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const dim=size==="small"?36:47;const ly=parseInt(layers)||1;const yd=Math.ceil((dim+1)/36*ly*4)/4;const hasResult=true;const resultValue=yd+" yards muslin";const resultLabel=dim+"×"+dim+"\" "+ly+"-layer swaddle";
const faqItems=[{q:"What is the best fabric for swaddles?",a:"Double gauze or muslin. Its breathable, soft, and slightly stretchy. Pre-wash before sewing."}];
return(<div className="container"><Breadcrumb items={[{label:"Baby & Kids",href:"/baby-kids"},{label:"Swaddle Blanket"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🤱</span> Baby #395</span><h1>Swaddle Blanket</h1><p>Muslin swaddle blankets.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Size</label><select className="input-field" value={size} onChange={e=>sS(e.target.value)}><option value="small">Small (36×36)</option><option value="large">Large (47×47)</option></select></div><div className="input-group"><label className="input-label">Layers</label><select className="input-field" value={layers} onChange={e=>sL(e.target.value)}><option value="1">Single layer</option><option value="2">Double layer</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/baby-kids" className="related-tool-link">👶 All Baby</a></div></aside></div></div>);}