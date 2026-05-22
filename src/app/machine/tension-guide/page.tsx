"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[fabric,sF]=useState("cotton");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const rec:Record<string,{tension:string,note:string}>={sheer:{tension:"2-3 (lower)",note:"Reduce tension to prevent puckering"},cotton:{tension:"4-5 (standard)",note:"Default for most machines"},knit:{tension:"3-4 (slightly lower)",note:"Reduce to prevent stretched seams"},heavy:{tension:"5-6 (slightly higher)",note:"Increase for multiple layers"},stretch:{tension:"2-3 (low)",note:"Use stretch stitch with low tension"}};const r=rec[fabric]||rec.cotton;const hasResult=true;const resultValue="tension: "+r.tension;const resultLabel=r.note;
const faqItems=[{q:"How do I know if tension is wrong?",a:"Loops on top = upper tension too loose. Loops underneath = upper tension too tight. Both sides equal = correct."}];
return(<div className="container"><Breadcrumb items={[{label:"Machine",href:"/machine"},{label:"Tension Guide"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>⚙️</span> Machine #441</span><h1>Tension Guide</h1><p>Tension settings by fabric type.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Fabric</label><select className="input-field" value={fabric} onChange={e=>sF(e.target.value)}><option value="sheer">Sheer/lightweight</option><option value="cotton">Cotton/medium</option><option value="knit">Knit</option><option value="heavy">Heavy/denim</option><option value="stretch">Stretch/lycra</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/machine" className="related-tool-link">🧵 All Machine</a></div></aside></div></div>);}