"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[qw,sW]=useState("60");const[qh,sH]=useState("80");const[stripW,sS]=useState("2.5");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const w=parseFloat(qw)||60;const h=parseFloat(qh)||80;const sw=parseFloat(stripW)||2.5;const perim=(w+h)*2+12;const strips=Math.ceil(perim/42);const yd=Math.ceil(strips*sw/36*8)/8;const hasResult=true;const resultValue=yd+" yards binding";const resultLabel=strips+" strips, "+perim+"\" total length";
const faqItems=[{q:"Why add 12 inches to perimeter?",a:"Extra for mitered corners (1 inch each = 4 inches), overlap at start/end, and safety margin."}];
return(<div className="container"><Breadcrumb items={[{label:"Bias Binding",href:"/bias-binding"},{label:"Quilt Binding (Perimeter)"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🟩</span> Bias #287</span><h1>Quilt Binding (Perimeter)</h1><p>Binding for quilts by perimeter method.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Quilt width</label><input type="number" className="input-field" value={qw} onChange={e=>sW(e.target.value)}/></div><div className="input-group"><label className="input-label">Quilt height</label><input type="number" className="input-field" value={qh} onChange={e=>sH(e.target.value)}/></div><div className="input-group"><label className="input-label">Strip width</label><input type="number" className="input-field" value={stripW} onChange={e=>sS(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Perimeter</span><strong>{perim}&quot;</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/bias-binding" className="related-tool-link">🎀 All Bias</a></div></aside></div></div>);}