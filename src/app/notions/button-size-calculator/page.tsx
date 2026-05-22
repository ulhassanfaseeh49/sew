"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[ligne,sL]=useState("24");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const l=parseInt(ligne)||24;const mm=l*0.635;const inches=mm/25.4;const hasResult=true;const resultValue=l+"L = "+mm.toFixed(1)+"mm = "+inches.toFixed(2)+"\"";const resultLabel="button size conversion";
const faqItems=[{q:"What is ligne?",a:"A traditional French button measurement. 1 ligne = 0.635mm. It is the standard industry unit."}];
return(<div className="container"><Breadcrumb items={[{label:"Notions",href:"/notions"},{label:"Button Size Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🔘</span> Notion #186</span><h1>Button Size Calculator</h1><p>Convert button sizes between ligne, mm, and inches.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Button size (ligne)</label><select className="input-field" value={ligne} onChange={e=>sL(e.target.value)}><option value="14">14L (shirt cuff)</option><option value="18">18L (dress shirt)</option><option value="20">20L (blouse)</option><option value="24">24L (blazer)</option><option value="30">30L (coat small)</option><option value="36">36L (coat)</option><option value="40">40L (coat large)</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Ligne</span><strong>{l}L</strong></div><div className={styles.resultRow}><span>Millimeters</span><strong>{mm.toFixed(1)} mm</strong></div><div className={styles.resultRow}><span>Inches</span><strong>{inches.toFixed(3)}&quot;</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/notions" className="related-tool-link">🧵 All Notions</a></div></aside></div></div>);}