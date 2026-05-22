"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[fabric,sF]=useState("cotton-woven");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const data:Record<string,{range:string,note:string}>={"cotton-woven":{range:"2-5%",note:"Higher shrinkage with looser weaves"},"cotton-knit":{range:"5-8%",note:"Knits shrink more, especially in length"},linen:{range:"3-7%",note:"Can shrink significantly in first wash"},rayon:{range:"3-8%",note:"Very prone to shrinkage, handle carefully"},wool:{range:"2-5%",note:"Can felt if agitated in hot water"},silk:{range:"1-3%",note:"Minimal if hand washed properly"},polyester:{range:"0-1%",note:"Very stable, minimal shrinkage"},nylon:{range:"0-1%",note:"Heat-sensitive but minimal shrinkage"},denim:{range:"3-5%",note:"Sanforized denim shrinks less (1-2%)"},flannel:{range:"4-8%",note:"High shrinkage, always pre-wash"}};const d=data[fabric]||data["cotton-woven"];const hasResult=true;const resultValue=d.range;const resultLabel=d.note;
const faqItems=[{q:"What fabrics shrink most?",a:"Rayon, linen, flannel, and cotton knits shrink the most (5-8%). Synthetics shrink least (<1%)."}];
return(<div className="container"><Breadcrumb items={[{label:"Shrinkage",href:"/shrinkage"},{label:"Fabric Shrinkage Database"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>📋</span> Shrinkage #234</span><h1>Fabric Shrinkage Database</h1><p>Expected shrinkage by fabric type.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Fabric type</label><select className="input-field" value={fabric} onChange={e=>sF(e.target.value)}><option value="cotton-woven">Cotton (woven)</option><option value="cotton-knit">Cotton (knit)</option><option value="linen">Linen</option><option value="rayon">Rayon/viscose</option><option value="wool">Wool</option><option value="silk">Silk</option><option value="polyester">Polyester</option><option value="nylon">Nylon</option><option value="denim">Denim</option><option value="flannel">Flannel</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/shrinkage" className="related-tool-link">💧 All Shrinkage</a></div></aside></div></div>);}