"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[type,sT]=useState("braided");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const info:Record<string,{use:string,width:string,note:string}>={braided:{use:"Casings only (narrows when stretched)",width:"1/4-1\"",note:"Cheapest option, do not sew through"},knitted:{use:"Casings or sew-through",width:"1/4-2\"",note:"Doesnt narrow when stretched, most versatile"},woven:{use:"Waistbands, heavy-duty",width:"3/4-3\"",note:"Firm, doesnt roll, wont narrow"},foe:{use:"Edges of knits, underwear",width:"5/8-3/4\"",note:"Folds over raw edge, decorative finish"},clear:{use:"Stabilizing knit seams",width:"3/8\"",note:"Invisible, prevents shoulder stretch-out"},swim:{use:"Swimwear, lingerie",width:"3/8-3/4\"",note:"Chlorine and salt resistant"}};const i2=info[type]||info.braided;const hasResult=true;const resultValue=type+" elastic";const resultLabel=i2.use;
const faqItems=[{q:"Which elastic is best for beginners?",a:"Knitted elastic is most versatile — it works in casings and can be sewn through without losing stretch."}];
return(<div className="container"><Breadcrumb items={[{label:"Elastic",href:"/elastic"},{label:"Elastic Types Guide"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>📖</span> Elastic #297</span><h1>Elastic Types Guide</h1><p>Guide to elastic types and applications.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Elastic type</label><select className="input-field" value={type} onChange={e=>sT(e.target.value)}><option value="braided">Braided</option><option value="knitted">Knitted</option><option value="woven">Woven (non-roll)</option><option value="foe">Fold-over (FOE)</option><option value="clear">Clear/transparent</option><option value="swim">Swimwear/lingerie</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Width range</span><strong>{i2.width}</strong></div><div className={styles.resultRow}><span>Note</span><strong style={{fontWeight:"normal",fontSize:"0.85rem"}}>{i2.note}</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/elastic" className="related-tool-link">〰️ All Elastic</a></div></aside></div></div>);}