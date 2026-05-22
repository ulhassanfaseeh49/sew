"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[price,sP]=useState("");const[shipping,sS]=useState("5");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const p=parseFloat(price)||0;const s=parseFloat(shipping)||0;const total=p+s;const listing=0.20;const transaction=total*0.065;const payment=total*0.03+0.25;const totalFees=listing+transaction+payment;const net=total-totalFees;const hasResult=p>0;const resultValue="$"+net.toFixed(2)+" net after fees";const resultLabel="$"+totalFees.toFixed(2)+" total Etsy fees";
const faqItems=[{q:"How much does Etsy take?",a:"About 10-12% total: $0.20 listing + 6.5% transaction + 3% + $0.25 payment processing."}];
return(<div className="container"><Breadcrumb items={[{label:"Pricing",href:"/pricing"},{label:"Etsy Fee Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🏪</span> Pricing #404</span><h1>Etsy Fee Calculator</h1><p>Calculate Etsy fees and profit.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Selling price ($)</label><input type="number" className="input-field" placeholder="35" value={price} onChange={e=>sP(e.target.value)} min="0" step="0.01"/></div><div className="input-group"><label className="input-label">Shipping charged ($)</label><input type="number" className="input-field" value={shipping} onChange={e=>sS(e.target.value)} min="0" step="0.01"/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Listing fee</span><strong>$0.20</strong></div><div className={styles.resultRow}><span>Transaction (6.5%)</span><strong>${transaction.toFixed(2)}</strong></div><div className={styles.resultRow}><span>Payment (3%+$0.25)</span><strong>${payment.toFixed(2)}</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/pricing" className="related-tool-link">💰 All Pricing</a></div></aside></div></div>);}