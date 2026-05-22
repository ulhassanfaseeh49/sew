"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[headCirc,sH]=useState("");const[style,sS]=useState("fitted");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const h=parseFloat(headCirc)||0;const ease=style==="oversized"?6:style==="pointed"?4:2;const hoodW=(h+ease)/2+1;const hoodH=style==="pointed"?20:14;const yd=Math.ceil(hoodW*2*hoodH/(54*36)*4)/4||0.5;const hasResult=h>0;const resultValue=yd+" yards";const resultLabel=style+" hood: "+hoodW.toFixed(0)+"\" × "+hoodH+"\" (×2 pieces)";
const faqItems=[{q:"How do I draft a hood pattern?",a:"Measure head height (crown to chin) and width (half circumference + ease). Create a curved rectangle."}];
return(<div className="container"><Breadcrumb items={[{label:"Costume",href:"/costume"},{label:"Hood Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🧙</span> Costume #341</span><h1>Hood Calculator</h1><p>Hood dimensions and fabric.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Head circumference (in)</label><input type="number" className="input-field" placeholder="22" value={headCirc} onChange={e=>sH(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Style</label><select className="input-field" value={style} onChange={e=>sS(e.target.value)}><option value="fitted">Fitted</option><option value="oversized">Oversized/dramatic</option><option value="pointed">Pointed/wizard</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/costume" className="related-tool-link">🎭 All Costume</a></div></aside></div></div>);}