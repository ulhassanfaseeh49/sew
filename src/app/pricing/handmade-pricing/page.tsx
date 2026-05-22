"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[materials,sM]=useState("");const[hours,sH]=useState("");const[rate,sR]=useState("15");const[markup,sMk]=useState("2");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const m=parseFloat(materials)||0;const h=parseFloat(hours)||0;const r=parseFloat(rate)||15;const mk=parseFloat(markup)||2;const labor=h*r;const cost=m+labor;const price=cost*mk;const profit=price-cost;const hasResult=m>0||h>0;const resultValue="$"+price.toFixed(2);const resultLabel="cost $"+cost.toFixed(2)+" × "+mk+"x markup = $"+profit.toFixed(2)+" profit";
const faqItems=[{q:"What markup should I use?",a:"2x is industry standard for handmade. 2.5-3x for premium or unique items. Never sell below cost."}];
return(<div className="container"><Breadcrumb items={[{label:"Pricing",href:"/pricing"},{label:"Handmade Item Pricing"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>💰</span> Pricing #400</span><h1>Handmade Item Pricing</h1><p>Calculate selling price for handmade items.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Material cost ($)</label><input type="number" className="input-field" placeholder="12" value={materials} onChange={e=>sM(e.target.value)} min="0" step="0.01"/></div><div className="input-group"><label className="input-label">Hours spent</label><input type="number" className="input-field" placeholder="3" value={hours} onChange={e=>sH(e.target.value)} min="0" step="0.25"/></div><div className="input-group"><label className="input-label">Hourly rate ($)</label><input type="number" className="input-field" value={rate} onChange={e=>sR(e.target.value)}/></div><div className="input-group"><label className="input-label">Markup multiplier</label><select className="input-field" value={markup} onChange={e=>sMk(e.target.value)}><option value="1.5">1.5x</option><option value="2">2x (recommended)</option><option value="2.5">2.5x</option><option value="3">3x (premium)</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Materials</span><strong>${m.toFixed(2)}</strong></div><div className={styles.resultRow}><span>Labor</span><strong>${labor.toFixed(2)}</strong></div><div className={styles.resultRow}><span>Profit</span><strong>${profit.toFixed(2)}</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/pricing" className="related-tool-link">💰 All Pricing</a></div></aside></div></div>);}