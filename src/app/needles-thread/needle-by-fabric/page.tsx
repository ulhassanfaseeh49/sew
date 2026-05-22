"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[fabric,sF]=useState("cotton");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const rec:Record<string,{size:string,type:string}>={sheer:{size:"60/8 or 70/10",type:"Microtex/sharp"},cotton:{size:"80/12",type:"Universal or sharp"},knit:{size:"75/11",type:"Ball point or stretch"},denim:{size:"90/14 or 100/16",type:"Jeans needle"},leather:{size:"90/14 or 100/16",type:"Leather needle (cutting point)"}};const r=rec[fabric]||rec.cotton;const hasResult=true;const resultValue=r.size+" "+r.type;const resultLabel="for "+fabric+" fabrics";
const faqItems=[{q:"What needle for quilting cotton?",a:"80/12 universal or sharp needle. Change after every 6-8 hours of sewing."}];
return(<div className="container"><Breadcrumb items={[{label:"Needles & Thread",href:"/needles-thread"},{label:"Needle by Fabric Guide"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🪡</span> Needle #428</span><h1>Needle by Fabric Guide</h1><p>Match needle size to fabric type.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Fabric type</label><select className="input-field" value={fabric} onChange={e=>sF(e.target.value)}><option value="sheer">Sheer/silk</option><option value="cotton">Cotton/quilting</option><option value="knit">Knit/jersey</option><option value="denim">Denim/heavy</option><option value="leather">Leather/vinyl</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/needles-thread" className="related-tool-link">🪡 All Needles</a></div></aside></div></div>);}