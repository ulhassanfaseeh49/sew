"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[type,sT]=useState("crib");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const sizes:Record<string,{w:number,h:number}>={receiving:{w:30,h:30},stroller:{w:30,h:36},crib:{w:36,h:52},toddler:{w:42,h:58},play:{w:40,h:40}};const s=sizes[type]||sizes.crib;const topYd=Math.ceil(s.w*s.h/(44*36)*4)/4;const hasResult=true;const resultValue=s.w+"\" × "+s.h+"\"";const resultLabel=topYd+" yd top + "+topYd+" yd backing + batting";
const faqItems=[{q:"What size is a standard crib quilt?",a:"36×52 inches fits a standard crib mattress (28×52) with drape on the sides."}];
return(<div className="container"><Breadcrumb items={[{label:"Baby & Kids",href:"/baby-kids"},{label:"Baby Quilt Size Guide"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🍼</span> Baby #386</span><h1>Baby Quilt Size Guide</h1><p>Dimensions for baby quilts.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Quilt type</label><select className="input-field" value={type} onChange={e=>sT(e.target.value)}><option value="receiving">Receiving (30×30)</option><option value="stroller">Stroller (30×36)</option><option value="crib">Crib (36×52)</option><option value="toddler">Toddler (42×58)</option><option value="play">Play mat (40×40)</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/baby-kids" className="related-tool-link">👶 All Baby</a></div></aside></div></div>);}