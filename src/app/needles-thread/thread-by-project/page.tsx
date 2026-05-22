"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[project,sP]=useState("garment");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const rec:Record<string,{weight:string,type:string}>={garment:{weight:"50wt all-purpose",type:"Polyester or cotton-wrapped poly"},quilting:{weight:"50wt or 40wt",type:"100% cotton (Aurifil, Gutermann)"},topstitch:{weight:"30wt or 12wt (heavy)",type:"Topstitch thread with topstitch needle"},embroidery:{weight:"40wt",type:"Rayon or polyester embroidery thread"},serger:{weight:"40-50wt or texturized",type:"Serger cones (2000-3000 yd)"}};const r=rec[project]||rec.garment;const hasResult=true;const resultValue=r.weight;const resultLabel=r.type;
const faqItems=[{q:"Does thread weight matter?",a:"Yes! 50wt is standard. Thinner (60wt) for delicate fabrics. Thicker (30wt) for topstitching and quilting."}];
return(<div className="container"><Breadcrumb items={[{label:"Needles & Thread",href:"/needles-thread"},{label:"Thread Weight Guide"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🧵</span> Needle #430</span><h1>Thread Weight Guide</h1><p>Thread weight by project type.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Project</label><select className="input-field" value={project} onChange={e=>sP(e.target.value)}><option value="garment">Garment sewing</option><option value="quilting">Quilting</option><option value="topstitch">Topstitching</option><option value="embroidery">Machine embroidery</option><option value="serger">Serger/overlock</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/needles-thread" className="related-tool-link">🪡 All Needles</a></div></aside></div></div>);}