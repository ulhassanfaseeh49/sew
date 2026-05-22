"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[qty,sQ]=useState("8");const[size,sS]=useState("18");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const q=parseInt(qty)||8;const s=parseInt(size)||18;const cut=s+1;const across=Math.floor(44/cut);const rows=Math.ceil(q/across);const yd=Math.ceil(rows*cut/36*4)/4;const hasResult=true;const resultValue=yd+" yards";const resultLabel=q+" napkins ("+across+" per row × "+rows+" rows)";
const faqItems=[{q:"What fabric is best for napkins?",a:"Cotton or linen. Pre-wash for softness. Avoid synthetic — it doesnt absorb well."}];
return(<div className="container"><Breadcrumb items={[{label:"Home Decor",href:"/home-decor"},{label:"Napkin Yardage Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🧻</span> Home #272</span><h1>Napkin Yardage Calculator</h1><p>Yardage for cloth napkins.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Quantity</label><input type="number" className="input-field" value={qty} onChange={e=>sQ(e.target.value)} min="1"/></div><div className="input-group"><label className="input-label">Size (in)</label><select className="input-field" value={size} onChange={e=>sS(e.target.value)}><option value="14">14\" (cocktail)</option><option value="18">18\" (lunch)</option><option value="22">22\" (dinner)</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/home-decor" className="related-tool-link">🏠 All Home</a></div></aside></div></div>);}