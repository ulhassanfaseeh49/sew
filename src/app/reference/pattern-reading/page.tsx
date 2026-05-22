"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[section,sS]=useState("envelope");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const info:Record<string,{explains:string,tip:string}>={envelope:{explains:"Photo/illustration of finished garment, size range, pattern number",tip:"Choose size by body measurements, NOT ready-to-wear size"},back:{explains:"Fabric requirements, notions needed, finished measurements, body measurement chart",tip:"Buy the amount listed for your size AND view/width of fabric"},guide:{explains:"Step-by-step construction instructions with diagrams",tip:"Read ALL instructions before cutting. Highlight your size line."},pieces:{explains:"Paper pieces with markings — grainline, notches, darts, fold lines",tip:"Cut your size. Use pattern weights or pins on fabric."},cutting:{explains:"Diagrams showing how to place pieces on folded or open fabric",tip:"Find the layout for YOUR size and fabric width. Follow it exactly."}};const i2=info[section]||info.envelope;const hasResult=true;const resultValue=section;const resultLabel=i2.explains;
const faqItems=[{q:"Do I need to follow the pattern exactly?",a:"Yes, especially as a beginner. Once you understand construction, you can modify confidently."}];
return(<div className="container"><Breadcrumb items={[{label:"Reference",href:"/reference"},{label:"Pattern Reading Tutorial"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>📄</span> Ref #478</span><h1>Pattern Reading Tutorial</h1><p>How to read sewing patterns.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Pattern section</label><select className="input-field" value={section} onChange={e=>sS(e.target.value)}><option value="envelope">Envelope front</option><option value="back">Envelope back</option><option value="guide">Guide sheet</option><option value="pieces">Pattern pieces</option><option value="cutting">Cutting layout</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/reference" className="related-tool-link">📚 All Reference</a></div></aside></div></div>);}