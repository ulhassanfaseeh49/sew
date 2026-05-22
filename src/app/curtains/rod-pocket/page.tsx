"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[rodDia,sR]=useState("1");const[ruffle,sRf]=useState("1.5");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const rd=parseFloat(rodDia)||1;const rf=parseFloat(ruffle)||1.5;const casing=rd*Math.PI/2+0.5;const totalHeader=(casing+rf)*2;const hasResult=true;const resultValue=totalHeader.toFixed(1)+"\" header allowance";const resultLabel=casing.toFixed(1)+"\" pocket + "+rf+"\" ruffle (doubled)";
const faqItems=[{q:"How much ease for a rod pocket?",a:"Add 1/2 inch to the rod circumference/2 for ease. The curtain should slide freely on the rod."}];
return(<div className="container"><Breadcrumb items={[{label:"Curtains",href:"/curtains"},{label:"Rod Pocket Size Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🔄</span> Curtain #243</span><h1>Rod Pocket Size Calculator</h1><p>Rod pocket casing width.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Rod diameter (in)</label><select className="input-field" value={rodDia} onChange={e=>sR(e.target.value)}><option value="0.5">1/2\"</option><option value="0.75">3/4\"</option><option value="1">1\"</option><option value="1.5">1-1/2\"</option><option value="2">2\"</option></select></div><div className="input-group"><label className="input-label">Ruffle above (in)</label><input type="number" className="input-field" value={ruffle} onChange={e=>sRf(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/curtains" className="related-tool-link">🪟 All Curtains</a></div></aside></div></div>);}