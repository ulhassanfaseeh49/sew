"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[type,sT]=useState("underbust");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const yds:Record<string,{outer:number,lining:number,flat:number}>={underbust:{outer:1.5,lining:1.5,flat:1},overbust:{outer:2,lining:2,flat:1.5},"waist-cincher":{outer:1,lining:1,flat:0.75}};const y=yds[type]||yds.underbust;const hasResult=true;const resultValue=y.outer+" yd each: outer + lining + interlining";const resultLabel=type+" corset (~"+y.flat+" yd flat steel boning fabric)";
const faqItems=[{q:"How many layers does a corset need?",a:"Minimum 2 (fashion + strength layer). Professional: 3 layers (outer, coutil/strength, lining)."}];
return(<div className="container"><Breadcrumb items={[{label:"Costume",href:"/costume"},{label:"Corset Fabric Yardage"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>👗</span> Costume #334</span><h1>Corset Fabric Yardage</h1><p>Fabric for corsets.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Corset type</label><select className="input-field" value={type} onChange={e=>sT(e.target.value)}><option value="underbust">Underbust</option><option value="overbust">Overbust</option><option value="waist-cincher">Waist cincher</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/costume" className="related-tool-link">🎭 All Costume</a></div></aside></div></div>);}