"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[side,sS]=useState("1");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const s=parseFloat(side)||1;const w=s*2;const h=s*Math.sqrt(3);const hasResult=s>0;const resultValue=w.toFixed(2)+"\" wide x "+h.toFixed(2)+"\" tall";const resultLabel=s+"\" side hexagon";
const faqItems=[{q:"What is EPP?",a:"English Paper Piecing — hand-sewing over paper templates for precision."}];
return(<div className="container"><Breadcrumb items={[{label:"Quilt Tools",href:"/quilt"},{label:"Hexagon Calculator (EPP)"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>⬡</span> Quilt #154</span><h1>Hexagon Calculator (EPP)</h1><p>Hexagon dimensions for English Paper Piecing.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Side length (in)</label><input type="number" className="input-field" placeholder="1" value={side} onChange={e=>sS(e.target.value)} min="0" step="0.25"/></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Width (flat-to-flat)</span><strong>{h.toFixed(2)}&quot;</strong></div><div className={styles.resultRow}><span>Cut fabric</span><strong>+3/8&quot; SA all around</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/quilt" className="related-tool-link">🟩 All Quilt</a></div></aside></div></div>);}