"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[tiers,sT]=useState("3");const[topLen,sL]=useState("8");const[waist,sW]=useState("28");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const t2=parseInt(tiers)||3;const tl=parseFloat(topLen)||8;const w=parseFloat(waist)||28;let totalYd=0;for(let i=0;i<t2;i++){const circ=w*Math.pow(1.5,i+1);const widths=Math.ceil(circ/44);totalYd+=widths*(tl+2)/36;}const yd=Math.ceil(totalYd*4)/4;const hasResult=w>0;const resultValue=yd+" yards";const resultLabel=t2+"-tier petticoat with increasing fullness";
const faqItems=[{q:"How do tiers work?",a:"Each tier is 1.5x wider than the one above, creating a graduated fullness like a wedding cake."}];
return(<div className="container"><Breadcrumb items={[{label:"Costume",href:"/costume"},{label:"Petticoat Yardage"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🩰</span> Costume #337</span><h1>Petticoat Yardage</h1><p>Multi-tiered petticoats.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Tiers</label><input type="number" className="input-field" value={tiers} onChange={e=>sT(e.target.value)} min="1" max="5"/></div><div className="input-group"><label className="input-label">Top tier length (in)</label><input type="number" className="input-field" value={topLen} onChange={e=>sL(e.target.value)}/></div><div className="input-group"><label className="input-label">Waist (in)</label><input type="number" className="input-field" value={waist} onChange={e=>sW(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/costume" className="related-tool-link">🎭 All Costume</a></div></aside></div></div>);}