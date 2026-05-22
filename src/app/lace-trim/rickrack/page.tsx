"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[length,sL]=useState("");const[size,sS]=useState("medium");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const l=parseFloat(length)||0;const yd=Math.ceil(l/36*4)/4;const hasResult=l>0;const resultValue=yd+" yards "+size+" rickrack";const resultLabel=l+"\" application";
const faqItems=[{q:"Can I hide rickrack in a seam?",a:"Yes! Sandwich it between seam layers with only the peaks showing for a professional peek-a-boo effect."}];
return(<div className="container"><Breadcrumb items={[{label:"Lace & Trim",href:"/lace-trim"},{label:"Rickrack Yardage Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>⚡</span> Trim #325</span><h1>Rickrack Yardage Calculator</h1><p>Rickrack/zigzag trim yardage.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Application length (in)</label><input type="number" className="input-field" placeholder="60" value={length} onChange={e=>sL(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Size</label><select className="input-field" value={size} onChange={e=>sS(e.target.value)}><option value="baby">Baby (1/4\")</option><option value="medium">Medium (1/2\")</option><option value="jumbo">Jumbo (1\")</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/lace-trim" className="related-tool-link">🌸 All Trim</a></div></aside></div></div>);}