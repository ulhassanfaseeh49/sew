"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[fabric,sF]=useState("cotton");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const guides:Record<string,{wash:string,dry:string}>={cotton:{wash:"Machine wash warm/hot",dry:"Tumble dry medium"},linen:{wash:"Machine wash warm",dry:"Tumble dry low, press damp"},wool:{wash:"Soak in cool water 30 min",dry:"Roll in towel, lay flat"},silk:{wash:"Hand wash cool with gentle soap",dry:"Air dry, press while damp"},rayon:{wash:"Hand wash cool or gentle cycle",dry:"Lay flat to dry"},knit:{wash:"Machine wash warm, gentle cycle",dry:"Tumble dry medium"}};const g=guides[fabric]||guides.cotton;const hasResult=true;const resultValue=fabric+" pre-wash method";const resultLabel=g.wash;
const faqItems=[{q:"Can I skip pre-washing?",a:"Only if garment will be dry-cleaned, or for crafts/bags that wont be washed. Always pre-wash for quilts."}];
return(<div className="container"><Breadcrumb items={[{label:"Shrinkage",href:"/shrinkage"},{label:"Pre-Washing Guide"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🧺</span> Shrinkage #235</span><h1>Pre-Washing Guide</h1><p>Step-by-step pre-washing for different fabrics.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Fabric</label><select className="input-field" value={fabric} onChange={e=>sF(e.target.value)}><option value="cotton">Cotton</option><option value="linen">Linen</option><option value="wool">Wool</option><option value="silk">Silk</option><option value="rayon">Rayon</option><option value="knit">Knits</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Wash</span><strong>{g.wash}</strong></div><div className={styles.resultRow}><span>Dry</span><strong>{g.dry}</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/shrinkage" className="related-tool-link">💧 All Shrinkage</a></div></aside></div></div>);}