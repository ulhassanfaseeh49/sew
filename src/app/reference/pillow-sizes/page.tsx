"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[type,sT]=useState("throw");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const info:Record<string,{dim:string,fabric:string}>={throw:{dim:"16×16, 18×18, or 20×20\"",fabric:"Cut 1\" larger than insert for snug fit"},lumbar:{dim:"12×20\" or 14×24\"",fabric:"Add envelope back or zipper closure"},euro:{dim:"26×26\"",fabric:"~0.75 yard per sham + flange"},body:{dim:"20×54\"",fabric:"~1.5 yards per pillowcase"},bolster:{dim:"6\" dia × 16-20\" long",fabric:"Cylinder + 2 circle ends + zipper"},floor:{dim:"24×24\" or 30×30\"",fabric:"Heavy fabric, box style with gusset"}};const i2=info[type]||info.throw;const hasResult=true;const resultValue=type+": "+i2.dim;const resultLabel=i2.fabric;
const faqItems=[{q:"What size pillow cover should I make?",a:"Make the cover 1 inch smaller than the insert for a plump, professional look."}];
return(<div className="container"><Breadcrumb items={[{label:"Reference",href:"/reference"},{label:"Pillow Size Reference"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🛋️</span> Ref #473</span><h1>Pillow Size Reference</h1><p>Standard pillow and cushion sizes.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Pillow type</label><select className="input-field" value={type} onChange={e=>sT(e.target.value)}><option value="throw">Throw/accent</option><option value="lumbar">Lumbar</option><option value="euro">Euro sham</option><option value="body">Body pillow</option><option value="bolster">Bolster</option><option value="floor">Floor cushion</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/reference" className="related-tool-link">📚 All Reference</a></div></aside></div></div>);}