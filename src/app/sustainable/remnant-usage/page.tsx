"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[width,sW]=useState("");const[length,sL]=useState("");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const w=parseFloat(width)||0;const l=parseFloat(length)||0;const area=w*l;const projects=area>=200?"Tote bag, pillow cover, or baby bib":area>=100?"Zipper pouch, headband, or scrunchies":area>=50?"Face mask, coaster set, or bookmark":"Patchwork pieces, appliqué shapes, or stuffing";const hasResult=w>0&&l>0;const resultValue=area+" sq inches usable";const resultLabel=projects;
const faqItems=[{q:"What can I make with small scraps?",a:"Under 5 inches: patchwork, stuffing. 5-10 inches: pouches, coasters. Larger: bags, accessories."}];
return(<div className="container"><Breadcrumb items={[{label:"Sustainable",href:"/sustainable"},{label:"Remnant Usage Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🧩</span> Eco #452</span><h1>Remnant Usage Calculator</h1><p>Projects from leftover fabric.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Remnant width (in)</label><input type="number" className="input-field" placeholder="15" value={width} onChange={e=>sW(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Remnant length (in)</label><input type="number" className="input-field" placeholder="20" value={length} onChange={e=>sL(e.target.value)} min="0"/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/sustainable" className="related-tool-link">♻️ All Sustainable</a></div></aside></div></div>);}