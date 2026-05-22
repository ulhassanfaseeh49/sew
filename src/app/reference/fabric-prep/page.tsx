"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[fabric,sF]=useState("cotton");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const info:Record<string,{prep:string,shrink:string}>={cotton:{prep:"Machine wash warm, tumble dry. Press before cutting.",shrink:"3-5% shrinkage expected"},linen:{prep:"Machine wash warm, tumble dry. Press with steam.",shrink:"5-10% shrinkage expected"},silk:{prep:"Steam or dry clean before cutting. Do NOT wash unless garment will be washed.",shrink:"Minimal if dry cleaned"},wool:{prep:"Steam press or London shrink method. Do NOT machine wash.",shrink:"Can shrink 5-10% if washed"},knit:{prep:"Wash and dry same as finished garment. Let relax flat overnight.",shrink:"3-8% depending on fiber"},synthetic:{prep:"Minimal prep needed. Wash to remove sizing.",shrink:"Less than 1%"}};const i2=info[fabric]||info.cotton;const hasResult=true;const resultValue=fabric+" preparation";const resultLabel=i2.prep+" ("+i2.shrink+")";
const faqItems=[{q:"Do I really need to pre-wash fabric?",a:"Yes for cotton, linen, and knits to prevent shrinkage in the finished item. Skip for dry-clean-only fabrics."}];
return(<div className="container"><Breadcrumb items={[{label:"Reference",href:"/reference"},{label:"Fabric Prep Guide"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🧺</span> Ref #481</span><h1>Fabric Prep Guide</h1><p>Pre-wash and prepare fabric.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Fabric type</label><select className="input-field" value={fabric} onChange={e=>sF(e.target.value)}><option value="cotton">Cotton</option><option value="linen">Linen</option><option value="silk">Silk</option><option value="wool">Wool</option><option value="knit">Knit/jersey</option><option value="synthetic">Polyester/synthetic</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/reference" className="related-tool-link">📚 All Reference</a></div></aside></div></div>);}