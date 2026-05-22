"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[stitches,sS]=useState("");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const s=parseInt(stitches)||0;const inchesPerSkein=480;const inchesPerStitch=1.5;const totalIn=s*inchesPerStitch;const skeins=Math.ceil(totalIn/inchesPerSkein);const hasResult=s>0;const resultValue=skeins+" skein(s)";const resultLabel=s+" stitches × 1.5\"/stitch = "+totalIn+"\" thread";
const faqItems=[{q:"How much floss per cross-stitch?",a:"About 1.5 inches of floss per cross-stitch on 14ct Aida. One skein covers ~320 stitches."}];
return(<div className="container"><Breadcrumb items={[{label:"Embroidery",href:"/embroidery"},{label:"Cross-Stitch Thread Usage"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🧶</span> Embroidery #315</span><h1>Cross-Stitch Thread Usage</h1><p>Skeins needed per color.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Total stitches for one color</label><input type="number" className="input-field" placeholder="500" value={stitches} onChange={e=>sS(e.target.value)} min="0"/></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/embroidery" className="related-tool-link">🪡 All Embroidery</a></div></aside></div></div>);}