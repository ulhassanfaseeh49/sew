"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[finLen,sF]=useState("");const[depth,sD]=useState("2");const[ratio,sR]=useState("2");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const fl=parseFloat(finLen)||0;const d=parseFloat(depth)||2;const r=parseFloat(ratio)||2;const stripLen=fl*r;const cutDepth=d+1;const hasResult=fl>0;const resultValue=stripLen.toFixed(1)+"\" × "+cutDepth+"\" strip";const resultLabel=r+"x gather for "+fl+"\" finished";
const faqItems=[{q:"How wide should ruffle strips be?",a:"Finished depth + 1 inch for hem and seam allowance. Double for a folded ruffle."}];
return(<div className="container"><Breadcrumb items={[{label:"Garment Tools",href:"/garment"},{label:"Ruffle Fullness Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🎀</span> Garment #208</span><h1>Ruffle Fullness Calculator</h1><p>Fabric strip length for ruffles.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Finished ruffle length</label><input type="number" className="input-field" placeholder="36" value={finLen} onChange={e=>sF(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Ruffle depth (in)</label><input type="number" className="input-field" value={depth} onChange={e=>sD(e.target.value)}/></div><div className="input-group"><label className="input-label">Fullness</label><select className="input-field" value={ratio} onChange={e=>sR(e.target.value)}><option value="1.5">1.5x</option><option value="2">2x</option><option value="3">3x</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link">👗 All Garment</a></div></aside></div></div>);}