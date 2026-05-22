"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[fabric,sF]=useState("cotton");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const info:Record<string,{weight:string,care:string,use:string}>={cotton:{weight:"110-200 GSM",care:"Machine wash, tumble dry",use:"Quilting, dresses, shirts, crafts"},linen:{weight:"150-250 GSM",care:"Machine wash cool, hang dry",use:"Garments, home decor, bags"},silk:{weight:"30-120 GSM",care:"Dry clean or hand wash",use:"Evening wear, blouses, scarves"},wool:{weight:"150-400 GSM",care:"Dry clean or hand wash cool",use:"Coats, suits, blankets"},denim:{weight:"200-400 GSM",care:"Machine wash, tumble low",use:"Jeans, jackets, bags"},chiffon:{weight:"30-70 GSM",care:"Hand wash or dry clean",use:"Evening wear, overlays, scarves"},velvet:{weight:"200-350 GSM",care:"Dry clean recommended",use:"Formal wear, cushions, curtains"},jersey:{weight:"120-250 GSM",care:"Machine wash, lay flat to dry",use:"T-shirts, dresses, loungewear"}};const i2=info[fabric]||info.cotton;const hasResult=true;const resultValue=fabric;const resultLabel=i2.weight+" | "+i2.care;
const faqItems=[{q:"How do I learn about different fabrics?",a:"Touch and sew with as many as possible. Visit fabric stores, feel the drape, and read the bolt labels."}];
return(<div className="container"><Breadcrumb items={[{label:"Reference",href:"/reference"},{label:"Fabric Encyclopedia"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>📚</span> Ref #462</span><h1>Fabric Encyclopedia</h1><p>Fabric types A-Z.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Fabric type</label><select className="input-field" value={fabric} onChange={e=>sF(e.target.value)}><option value="cotton">Cotton</option><option value="linen">Linen</option><option value="silk">Silk</option><option value="wool">Wool</option><option value="denim">Denim</option><option value="chiffon">Chiffon</option><option value="velvet">Velvet</option><option value="jersey">Jersey knit</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Best for</span><strong style={{fontWeight:"normal",fontSize:"0.85rem"}}>{i2.use}</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/reference" className="related-tool-link">📚 All Reference</a></div></aside></div></div>);}