"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[category,sC]=useState("wash");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const info:Record<string,string>={wash:"Tub icon: Machine wash. Number = max temp (30°/40°/60°). Hand = hand wash only. X = do not wash.",bleach:"Triangle: Any bleach OK. Lines = non-chlorine only. X-triangle = do not bleach.",dry:"Square: Tumble dry. Dots = heat (1=low, 2=med, 3=high). Line = flat dry. X = no tumble.",iron:"Iron icon: Dots = heat (1=low silk, 2=med wool, 3=high cotton/linen). X = do not iron.",dryclean:"Circle: Professional clean. Letters (P, F, W) = specific solvents. X = do not dry clean."};const desc=info[category]||info.wash;const hasResult=true;const resultValue=category+" care symbols";const resultLabel=desc;
const faqItems=[{q:"Are care symbols universal?",a:"Yes, the ASTM/ISO care label system is used internationally with standardized symbols."}];
return(<div className="container"><Breadcrumb items={[{label:"Fabric Type",href:"/fabric-type"},{label:"Care Symbol Database"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🏷️</span> Fabric #419</span><h1>Care Symbol Database</h1><p>Fabric care symbols guide.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Symbol category</label><select className="input-field" value={category} onChange={e=>sC(e.target.value)}><option value="wash">Washing</option><option value="bleach">Bleaching</option><option value="dry">Drying</option><option value="iron">Ironing</option><option value="dryclean">Dry cleaning</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/fabric-type" className="related-tool-link">⚖️ All Fabric Type</a></div></aside></div></div>);}