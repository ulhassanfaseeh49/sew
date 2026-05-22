"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[age,sA]=useState("5");const[type,sT]=useState("princess");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const ageMult=parseInt(age)<=3?0.6:parseInt(age)<=6?0.75:parseInt(age)<=9?0.85:1;const baseYd=type==="princess"?5:type==="superhero"?2:type==="animal"?3:4;const yd=Math.ceil(baseYd*ageMult*4)/4;const hasResult=true;const resultValue=yd+" yards";const resultLabel=type+" costume for age "+age;
const faqItems=[{q:"Should I make kids costumes size up?",a:"Yes, slightly bigger is fine — kids grow fast. Add elastic waists for adjustability."}];
return(<div className="container"><Breadcrumb items={[{label:"Baby & Kids",href:"/baby-kids"},{label:"Kids Costume Size"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🎭</span> Baby #394</span><h1>Kids Costume Size</h1><p>Fabric for children costumes.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Age</label><select className="input-field" value={age} onChange={e=>sA(e.target.value)}><option value="2">2-3 years</option><option value="5">4-6 years</option><option value="8">7-9 years</option><option value="11">10-12 years</option></select></div><div className="input-group"><label className="input-label">Costume type</label><select className="input-field" value={type} onChange={e=>sT(e.target.value)}><option value="princess">Princess dress</option><option value="superhero">Superhero</option><option value="animal">Animal onesie</option><option value="fairy">Fairy/angel</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/baby-kids" className="related-tool-link">👶 All Baby</a></div></aside></div></div>);}