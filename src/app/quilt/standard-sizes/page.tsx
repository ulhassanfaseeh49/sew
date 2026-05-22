"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[sz,sSz]=useState("queen");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const sizes:Record<string,[number,number]>={crib:[36,52],throw:[50,65],twin:[65,87],full:[78,87],queen:[88,92],king:[108,92]};const[qw,qh]=sizes[sz]||[88,92];const hasResult=true;const resultValue=qw+"x"+qh+"\"";const resultLabel=sz+" quilt size";
const faqItems=[{q:"What size quilt fits a queen bed?",a:"88x92 inches is standard, but add drop if you want it to hang over sides."}];
return(<div className="container"><Breadcrumb items={[{label:"Quilt Tools",href:"/quilt"},{label:"Standard Quilt Sizes"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>📖</span> Quilt #133</span><h1>Standard Quilt Sizes</h1><p>Reference for all standard quilt sizes.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Size</label><select className="input-field" value={sz} onChange={e=>sSz(e.target.value)}><option value="crib">Crib</option><option value="throw">Throw</option><option value="twin">Twin</option><option value="full">Full</option><option value="queen">Queen</option><option value="king">King</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Width</span><strong>{qw}&quot;</strong></div><div className={styles.resultRow}><span>Height</span><strong>{qh}&quot;</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/quilt" className="related-tool-link">🟩 All Quilt</a></div></aside></div></div>);}