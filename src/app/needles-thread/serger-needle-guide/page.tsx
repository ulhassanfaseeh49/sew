"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[brand,sB]=useState("generic");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const info:Record<string,{system:string,note:string}>={generic:{system:"HA×1 or EL×705 (same as home machine)",note:"Most home sergers use standard home machine needles"},bernina:{system:"EL×705 only",note:"Bernina sergers require their specific needle system"},industrial:{system:"DC×1 or DC×27",note:"Industrial overlockers use different needle systems — check manual"}};const i2=info[brand]||info.generic;const hasResult=true;const resultValue=i2.system;const resultLabel=i2.note;
const faqItems=[{q:"Can I use regular needles in my serger?",a:"Most home sergers use HA×1 (same as home machines). Always check your manual — wrong needles cause damage."}];
return(<div className="container"><Breadcrumb items={[{label:"Needles & Thread",href:"/needles-thread"},{label:"Serger Needle Guide"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>⚙️</span> Needle #435</span><h1>Serger Needle Guide</h1><p>Serger needle selection.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Serger brand</label><select className="input-field" value={brand} onChange={e=>sB(e.target.value)}><option value="generic">Most sergers (HA×1/EL×705)</option><option value="bernina">Bernina</option><option value="industrial">Industrial (DC×1)</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/needles-thread" className="related-tool-link">🪡 All Needles</a></div></aside></div></div>);}