"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [localPrice,setLocalPrice]=useState("");const [localYards,setLocalYards]=useState("");const [onlinePrice,setOnlinePrice]=useState("");const [onlineShipping,setOnlineShipping]=useState("");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const lp=parseFloat(localPrice)||0;const ly=parseFloat(localYards)||0;const op=parseFloat(onlinePrice)||0;const os=parseFloat(onlineShipping)||0;const localTotal=lp*ly;const onlineTotal=op*ly+os;const diff=localTotal-onlineTotal;const hasResult=lp>0&&op>0&&ly>0;const resultValue=diff>0?"Online saves $"+diff.toFixed(2):"Local saves $"+Math.abs(diff).toFixed(2);const resultLabel="for "+ly+" yards";

  const faqItems = [{q:"Is online fabric shopping worth the shipping cost?",a:"It depends on the price difference and how much you buy. Larger orders amortize shipping better."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Cost Calculators",href:"/cost"},{label:"Online vs Local Store Comparator"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>🛒</span> Cost Tool #76</span>
            <h1>Online vs Local Store Comparator</h1>
            <p>Compare total cost including shipping for online vs local.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label">Local $/yd</label><input type="number" className="input-field" placeholder="e.g., 14" value={localPrice} onChange={e=>setLocalPrice(e.target.value)} min="0" step="0.01"/></div><div className="input-group"><label className="input-label">Yards</label><input type="number" className="input-field" placeholder="e.g., 3" value={localYards} onChange={e=>setLocalYards(e.target.value)} min="0" step="0.125"/></div></div><div className="calculator-form-row"><div className="input-group"><label className="input-label">Online $/yd</label><input type="number" className="input-field" placeholder="e.g., 10" value={onlinePrice} onChange={e=>setOnlinePrice(e.target.value)} min="0" step="0.01"/></div><div className="input-group"><label className="input-label">Shipping ($)</label><input type="number" className="input-field" placeholder="e.g., 8" value={onlineShipping} onChange={e=>setOnlineShipping(e.target.value)} min="0" step="0.01"/></div></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Local total</span><strong>${localTotal.toFixed(2)}</strong></div><div className={styles.resultRow}><span>Online total</span><strong>${onlineTotal.toFixed(2)} (fabric ${(op*ly).toFixed(2)} + ship ${os.toFixed(2)})</strong></div>
                </div>
                <div className="toolbar">
                  <button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button>
                  <button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button>
                </div>
              </div>
            )}
          </div>
          <section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div>
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/cost/fabric-comparison" className="related-tool-link">⚖️ Compare</a><a href="/cost/wholesale-vs-retail" className="related-tool-link">🏭 Wholesale</a></div></aside>
      </div>
    </div>
  );
}