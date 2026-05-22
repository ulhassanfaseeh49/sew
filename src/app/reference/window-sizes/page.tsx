"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[type,sT]=useState("double-hung");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const info:Record<string,{common:string,curtain:string}>={["double-hung"]:{common:"24-36\" wide × 36-72\" tall",curtain:"Add 4-8\" each side, extend 4\" above"},casement:{common:"18-36\" wide × 36-72\" tall",curtain:"Must clear the crank mechanism"},picture:{common:"48-96\" wide × 36-60\" tall",curtain:"Wide panels needed, often 2-3x width"},slider:{common:"36-84\" wide × 24-60\" tall",curtain:"One-way draw or center-opening panels"},bay:{common:"60-120\" total × 36-60\" tall",curtain:"Individual panels per section or single curved rod"}};const i2=info[type]||info["double-hung"];const hasResult=true;const resultValue=type+": "+i2.common;const resultLabel=i2.curtain;
const faqItems=[{q:"How do I measure windows for curtains?",a:"Measure rod width (not window), add 4-8\" per side for coverage. Height from rod to desired length."}];
return(<div className="container"><Breadcrumb items={[{label:"Reference",href:"/reference"},{label:"Window Size Reference"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🪟</span> Ref #471</span><h1>Window Size Reference</h1><p>Common window dimensions.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Window type</label><select className="input-field" value={type} onChange={e=>sT(e.target.value)}><option value="double-hung">Double hung</option><option value="casement">Casement</option><option value="picture">Picture window</option><option value="slider">Sliding</option><option value="bay">Bay window</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/reference" className="related-tool-link">📚 All Reference</a></div></aside></div></div>);}