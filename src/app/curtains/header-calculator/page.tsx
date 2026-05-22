"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[style,sS]=useState("pinch");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const data:Record<string,{allowance:string,fullness:string}>={pinch:{allowance:"4\"",fullness:"2.5-3x"},pencil:{allowance:"3-4\"",fullness:"2-2.5x"},eyelet:{allowance:"2\"",fullness:"1.5-2x"},tab:{allowance:"4\" (tab length)",fullness:"1.5x"},rod:{allowance:"3-4\" (casing + ruffle)",fullness:"2-2.5x"},wave:{allowance:"2\"",fullness:"2x"}};const d=data[style]||data.pinch;const hasResult=true;const resultValue=style+" header";const resultLabel="Allowance: "+d.allowance+" | Fullness: "+d.fullness;
const faqItems=[{q:"Which header style is easiest?",a:"Rod pocket is the easiest — just fold and sew a casing. Tab top is also beginner-friendly."}];
return(<div className="container"><Breadcrumb items={[{label:"Curtains",href:"/curtains"},{label:"Header Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🔝</span> Curtain #242</span><h1>Header Calculator</h1><p>Fabric allowances for different header styles.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Header style</label><select className="input-field" value={style} onChange={e=>sS(e.target.value)}><option value="pinch">Pinch pleat</option><option value="pencil">Pencil pleat</option><option value="eyelet">Eyelet/grommet</option><option value="tab">Tab top</option><option value="rod">Rod pocket</option><option value="wave">Wave/ripplefold</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/curtains" className="related-tool-link">🪟 All Curtains</a></div></aside></div></div>);}