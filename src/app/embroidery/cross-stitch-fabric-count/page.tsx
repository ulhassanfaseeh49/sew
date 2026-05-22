"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[stitchesW,sW]=useState("");const[stitchesH,sH]=useState("");const[count,sC]=useState("14");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const sw=parseInt(stitchesW)||0;const sh=parseInt(stitchesH)||0;const ct=parseInt(count)||14;const effCt=ct>=28?ct/2:ct;const finW=sw/effCt;const finH=sh/effCt;const hasResult=sw>0&&sh>0;const resultValue=finW.toFixed(1)+"\" × "+finH.toFixed(1)+"\"";const resultLabel="finished design on "+ct+" count fabric";
const faqItems=[{q:"What count is best for beginners?",a:"14 count Aida is easiest with visible holes. 18 count gives finer detail for experienced stitchers."}];
return(<div className="container"><Breadcrumb items={[{label:"Embroidery",href:"/embroidery"},{label:"Cross-Stitch Fabric Count"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🔢</span> Embroidery #314</span><h1>Cross-Stitch Fabric Count</h1><p>Finished size by fabric count.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Pattern width (stitches)</label><input type="number" className="input-field" placeholder="100" value={stitchesW} onChange={e=>sW(e.target.value)}/></div><div className="input-group"><label className="input-label">Pattern height</label><input type="number" className="input-field" placeholder="80" value={stitchesH} onChange={e=>sH(e.target.value)}/></div><div className="input-group"><label className="input-label">Fabric count</label><select className="input-field" value={count} onChange={e=>sC(e.target.value)}><option value="14">14 count Aida</option><option value="16">16 count Aida</option><option value="18">18 count Aida</option><option value="28">28 count linen (over 2)</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/embroidery" className="related-tool-link">🪡 All Embroidery</a></div></aside></div></div>);}