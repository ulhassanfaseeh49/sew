"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [originalPrice,setOriginalPrice]=useState("");const [originalYards,setOriginalYards]=useState("");const [remainingYards,setRemainingYards]=useState("");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const op=parseFloat(originalPrice)||0;const oy=parseFloat(originalYards)||0;const ry=parseFloat(remainingYards)||0;const remnantValue=op*ry;const usedValue=op*(oy-ry);const pctRemaining=oy>0?((ry/oy)*100):0;const hasResult=op>0&&ry>0;const resultValue="$"+remnantValue.toFixed(2);const resultLabel=ry+" yards remaining ("+pctRemaining.toFixed(0)+"% of original)";

  const faqItems = [{q:"What can I do with fabric remnants?",a:"Small projects like pouches, scrunchies, patchwork, applique, or sell/swap with other sewists."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Cost Calculators",href:"/cost"},{label:"Remnant Value Calculator"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>🧵</span> Cost Tool #79</span>
            <h1>Remnant Value Calculator</h1>
            <p>Value of leftover fabric based on original price.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label">Original $/yd</label><input type="number" className="input-field" placeholder="e.g., 15" value={originalPrice} onChange={e=>setOriginalPrice(e.target.value)} min="0" step="0.01"/></div><div className="input-group"><label className="input-label">Original yards</label><input type="number" className="input-field" placeholder="e.g., 3" value={originalYards} onChange={e=>setOriginalYards(e.target.value)} min="0" step="0.125"/></div></div><div className="input-group"><label className="input-label">Remaining yards</label><input type="number" className="input-field" placeholder="e.g., 0.75" value={remainingYards} onChange={e=>setRemainingYards(e.target.value)} min="0" step="0.125"/></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Original total</span><strong>${(op*oy).toFixed(2)}</strong></div><div className={styles.resultRow}><span>Used value</span><strong>${usedValue.toFixed(2)}</strong></div><div className={styles.resultRow}><span>Remnant value</span><strong>${remnantValue.toFixed(2)}</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/cost/stash-value" className="related-tool-link">📦 Stash Value</a><a href="/cost/per-yard" className="related-tool-link">💰 Per Yard</a></div></aside>
      </div>
    </div>
  );
}