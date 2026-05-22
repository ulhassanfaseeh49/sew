"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[origW,sW]=useState("");const[newW,sN]=useState("");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const ow=parseFloat(origW)||0;const nw=parseFloat(newW)||0;const pct=ow>0?(nw/ow*100):0;const hasResult=ow>0&&nw>0;const resultValue=pct.toFixed(0)+"% of original";const resultLabel="scale "+(pct>100?"up":"down")+" by "+Math.abs(pct-100).toFixed(0)+"%";
const faqItems=[{q:"How much can I resize embroidery?",a:"10-15% is safe. Beyond 20% may cause density problems — too sparse or too dense."}];
return(<div className="container"><Breadcrumb items={[{label:"Embroidery",href:"/embroidery"},{label:"Design Size Scaler"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🔍</span> Embroidery #312</span><h1>Design Size Scaler</h1><p>Resize embroidery designs.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Original width (in)</label><input type="number" className="input-field" placeholder="4" value={origW} onChange={e=>sW(e.target.value)}/></div><div className="input-group"><label className="input-label">New width (in)</label><input type="number" className="input-field" placeholder="5" value={newW} onChange={e=>sN(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/embroidery" className="related-tool-link">🪡 All Embroidery</a></div></aside></div></div>);}