"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [materialPerUnit,setMaterialPerUnit]=useState("");const [fixedCosts,setFixedCosts]=useState("");const [quantity,setQuantity]=useState("");const [hoursPerUnit,setHoursPerUnit]=useState("");const [hourlyRate,setHourlyRate]=useState("15");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const mpu=parseFloat(materialPerUnit)||0;const fc=parseFloat(fixedCosts)||0;const qty=parseInt(quantity)||1;const hpu=parseFloat(hoursPerUnit)||0;const rate=parseFloat(hourlyRate)||0;const laborPerUnit=hpu*rate;const fixedPerUnit=fc/qty;const costPerUnit=mpu+laborPerUnit+fixedPerUnit;const totalCost=costPerUnit*qty;const hasResult=mpu>0&&qty>0;const resultValue="$"+costPerUnit.toFixed(2)+"/unit";const resultLabel=qty+" units, $"+totalCost.toFixed(2)+" total";

  const faqItems = [{q:"How does batch size affect cost?",a:"Larger batches spread fixed costs like patterns and setup across more units, lowering per-unit cost."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Cost Calculators",href:"/cost"},{label:"Batch Production Cost Calculator"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>🏭</span> Cost Tool #81</span>
            <h1>Batch Production Cost Calculator</h1>
            <p>Per-unit cost when making multiple identical items.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label">Material per unit ($)</label><input type="number" className="input-field" placeholder="e.g., 12" value={materialPerUnit} onChange={e=>setMaterialPerUnit(e.target.value)} min="0" step="0.01"/></div><div className="input-group"><label className="input-label">Quantity</label><input type="number" className="input-field" placeholder="e.g., 20" value={quantity} onChange={e=>setQuantity(e.target.value)} min="1"/></div></div><div className="calculator-form-row"><div className="input-group"><label className="input-label">Hours per unit</label><input type="number" className="input-field" placeholder="e.g., 2" value={hoursPerUnit} onChange={e=>setHoursPerUnit(e.target.value)} min="0" step="0.25"/></div><div className="input-group"><label className="input-label">Hourly rate ($)</label><input type="number" className="input-field" value={hourlyRate} onChange={e=>setHourlyRate(e.target.value)} min="0"/></div></div><div className="input-group"><label className="input-label">Fixed costs (pattern, setup, $)</label><input type="number" className="input-field" placeholder="e.g., 30" value={fixedCosts} onChange={e=>setFixedCosts(e.target.value)} min="0" step="0.01"/></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Material per unit</span><strong>${mpu.toFixed(2)}</strong></div><div className={styles.resultRow}><span>Labor per unit</span><strong>${laborPerUnit.toFixed(2)}</strong></div><div className={styles.resultRow}><span>Fixed cost per unit</span><strong>${fixedPerUnit.toFixed(2)} (${fc.toFixed(2)} ÷ {qty})</strong></div><div className={styles.resultRow}><span>Total batch cost</span><strong>${totalCost.toFixed(2)}</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/cost/pricing-calculator" className="related-tool-link">🏷️ Pricing</a><a href="/cost/per-garment" className="related-tool-link">👗 Per Garment</a></div></aside>
      </div>
    </div>
  );
}