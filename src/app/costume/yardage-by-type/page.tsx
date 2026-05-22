"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[type,sT]=useState("medieval");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const yds:Record<string,{outer:number,lining:number}>={medieval:{outer:8,lining:4},renaissance:{outer:10,lining:6},victorian:{outer:12,lining:8},regency:{outer:6,lining:4},"1950s":{outer:8,lining:5},superhero:{outer:3,lining:0},fairy:{outer:6,lining:3}};const y=yds[type]||yds.medieval;const hasResult=true;const resultValue=y.outer+" yd outer"+(y.lining>0?" + "+y.lining+" yd lining":"");const resultLabel=type+" costume (average, 45\" fabric)";
const faqItems=[{q:"How accurate are these estimates?",a:"These are averages. Actual yardage varies by size, design details, and fabric width. Add 15% for safety."}];
return(<div className="container"><Breadcrumb items={[{label:"Costume",href:"/costume"},{label:"Costume Yardage Estimator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🎭</span> Costume #333</span><h1>Costume Yardage Estimator</h1><p>Yardage by costume type.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Costume era/type</label><select className="input-field" value={type} onChange={e=>sT(e.target.value)}><option value="medieval">Medieval</option><option value="renaissance">Renaissance</option><option value="victorian">Victorian</option><option value="regency">Regency</option><option value="1950s">1950s</option><option value="superhero">Superhero bodysuit</option><option value="fairy">Fairy/fantasy</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/costume" className="related-tool-link">🎭 All Costume</a></div></aside></div></div>);}