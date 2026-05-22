"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[fabric,sF]=useState("cotton");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const recs:Record<string,{thread:string,tip:string}>={cotton:{thread:"Cotton or poly-cotton",tip:"100% cotton for quilting, poly-cotton for garments."},silk:{thread:"Silk or fine polyester",tip:"Use 60wt for delicate silks."},polyester:{thread:"Polyester",tip:"Match synthetic to synthetic for stretch compatibility."},denim:{thread:"Heavy-duty polyester or cotton",tip:"Use 30wt for topstitching, 40wt for seams."},knit:{thread:"Polyester with stretch",tip:"Woolly nylon in bobbin for extra stretch in seams."},wool:{thread:"Silk or polyester",tip:"Silk thread presses beautifully with wool."}};const r=recs[fabric]||recs.cotton;const hasResult=true;const resultValue=r.thread;const resultLabel=r.tip;
const faqItems=[{q:"Can I use polyester thread on cotton?",a:"Yes, poly-cotton thread works on most fabrics. Pure cotton thread is mainly preferred for quilting."}];
return(<div className="container"><Breadcrumb items={[{label:"Notions",href:"/notions"},{label:"Thread Type by Fabric"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>📋</span> Notion #184</span><h1>Thread Type by Fabric</h1><p>Match thread types to fabric types.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Fabric type</label><select className="input-field" value={fabric} onChange={e=>sF(e.target.value)}><option value="cotton">Cotton</option><option value="silk">Silk</option><option value="polyester">Polyester/synthetic</option><option value="denim">Denim</option><option value="knit">Knits</option><option value="wool">Wool</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/notions" className="related-tool-link">🧵 All Notions</a></div></aside></div></div>);}