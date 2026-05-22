"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[mm,sM]=useState("");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const m=parseFloat(mm)||0;const spi=m>0?25.4/m:0;const hasResult=m>0;const resultValue=spi.toFixed(1)+" SPI";const resultLabel=m+"mm = "+spi.toFixed(1)+" stitches per inch";
const faqItems=[{q:"What SPI is normal?",a:"10-12 SPI (2.5mm) for regular sewing. Higher SPI = shorter stitches = stronger seam."}];
return(<div className="container"><Breadcrumb items={[{label:"Machine",href:"/machine"},{label:"SPI Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🔢</span> Machine #440</span><h1>SPI Calculator</h1><p>Convert stitch length to stitches per inch.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Stitch length (mm)</label><input type="number" className="input-field" placeholder="2.5" value={mm} onChange={e=>sM(e.target.value)} min="0" step="0.1"/></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/machine" className="related-tool-link">🧵 All Machine</a></div></aside></div></div>);}