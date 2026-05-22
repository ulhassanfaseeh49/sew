"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[fabricA,sA]=useState("cotton");const[fabricB,sB]=useState("polyester");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const props:Record<string,{breathe:string,drape:string,wrinkle:string}>={cotton:{breathe:"High",drape:"Medium",wrinkle:"High"},linen:{breathe:"Very high",drape:"Medium-stiff",wrinkle:"Very high"},silk:{breathe:"High",drape:"Excellent",wrinkle:"Low"},wool:{breathe:"High",drape:"Good",wrinkle:"Low"},polyester:{breathe:"Low",drape:"Variable",wrinkle:"Very low"},rayon:{breathe:"Medium",drape:"Excellent",wrinkle:"High"}};const a=props[fabricA]||props.cotton;const b=props[fabricB]||props.polyester;const hasResult=true;const resultValue=fabricA+" vs "+fabricB;const resultLabel="see comparison below";
const faqItems=[{q:"What is fabric drape?",a:"How a fabric hangs and flows. Silk has excellent drape (flows), canvas has poor drape (stiff)."}];
return(<div className="container"><Breadcrumb items={[{label:"Fabric Type",href:"/fabric-type"},{label:"Property Comparator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>📋</span> Fabric #420</span><h1>Property Comparator</h1><p>Compare fabric properties.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Fabric A</label><select className="input-field" value={fabricA} onChange={e=>sA(e.target.value)}><option value="cotton">Cotton</option><option value="linen">Linen</option><option value="silk">Silk</option><option value="wool">Wool</option><option value="polyester">Polyester</option><option value="rayon">Rayon</option></select></div><div className="input-group"><label className="input-label">Fabric B</label><select className="input-field" value={fabricB} onChange={e=>sB(e.target.value)}><option value="cotton">Cotton</option><option value="linen">Linen</option><option value="silk">Silk</option><option value="wool">Wool</option><option value="polyester">Polyester</option><option value="rayon">Rayon</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Breathability</span><strong>{a.breathe} vs {b.breathe}</strong></div><div className={styles.resultRow}><span>Drape</span><strong>{a.drape} vs {b.drape}</strong></div><div className={styles.resultRow}><span>Wrinkle</span><strong>{a.wrinkle} vs {b.wrinkle}</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/fabric-type" className="related-tool-link">⚖️ All Fabric Type</a></div></aside></div></div>);}