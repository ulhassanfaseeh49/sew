"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[size,sS]=useState("queen");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const sizes:Record<string,{dim:string,blocks:string}>={baby:{dim:"36×52\"",blocks:"~12 blocks (12\")"},throw:{dim:"50×65\"",blocks:"~20 blocks (12\")"},twin:{dim:"68×86\"",blocks:"~42 blocks (12\")"},full:{dim:"80×86\"",blocks:"~42 blocks (12\")"},queen:{dim:"86×94\"",blocks:"~56 blocks (12\")"},king:{dim:"104×94\"",blocks:"~72 blocks (12\")"}};const s=sizes[size]||sizes.queen;const hasResult=true;const resultValue=size+": "+s.dim;const resultLabel=s.blocks;
const faqItems=[{q:"What quilt size fits my bed?",a:"Measure your mattress and add 10-15\" drop per side. Queen mattress is 60×80\"."}];
return(<div className="container"><Breadcrumb items={[{label:"Reference",href:"/reference"},{label:"Quilt Size Chart"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🛏️</span> Ref #468</span><h1>Quilt Size Chart</h1><p>Standard quilt sizes.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Quilt size</label><select className="input-field" value={size} onChange={e=>sS(e.target.value)}><option value="baby">Baby/crib</option><option value="throw">Throw/lap</option><option value="twin">Twin</option><option value="full">Full/double</option><option value="queen">Queen</option><option value="king">King</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/reference" className="related-tool-link">📚 All Reference</a></div></aside></div></div>);}