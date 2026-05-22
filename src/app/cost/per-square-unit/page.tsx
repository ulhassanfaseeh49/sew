"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [pricePerYard,setPricePerYard]=useState("");const [fabricWidth,setFabricWidth]=useState("44.5");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const ppy=parseFloat(pricePerYard)||0;const fw=parseFloat(fabricWidth)||44.5;const sqInPerYard=fw*36;const costPerSqIn=sqInPerYard>0?ppy/sqInPerYard:0;const costPerSqCm=costPerSqIn/6.4516;const costPerSqFt=costPerSqIn*144;const hasResult=ppy>0;const resultValue="$"+costPerSqIn.toFixed(4)+"/sq in";const resultLabel="at $"+ppy.toFixed(2)+"/yd on "+fw+" wide fabric";

  const faqItems = [{q:"Why calculate cost per square inch?",a:"It lets you compare fabrics of different widths fairly and price small projects accurately."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Cost Calculators",href:"/cost"},{label:"Cost Per Square Unit Calculator"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>📐</span> Cost Tool #78</span>
            <h1>Cost Per Square Unit Calculator</h1>
            <p>Cost per square inch/cm for detailed project costing.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label" htmlFor="ppy">Price per yard ($)</label><input id="ppy" type="number" className="input-field" placeholder="e.g., 14" value={pricePerYard} onChange={e=>setPricePerYard(e.target.value)} min="0" step="0.01"/></div><div className="input-group"><label className="input-label">Fabric width</label><select className="input-field" value={fabricWidth} onChange={e=>setFabricWidth(e.target.value)}><option value="44.5">44/45&quot;</option><option value="54">54&quot;</option><option value="60">60&quot;</option></select></div></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Per sq inch</span><strong>${costPerSqIn.toFixed(4)}</strong></div><div className={styles.resultRow}><span>Per sq cm</span><strong>${costPerSqCm.toFixed(4)}</strong></div><div className={styles.resultRow}><span>Per sq foot</span><strong>${costPerSqFt.toFixed(2)}</strong></div><div className={styles.resultRow}><span>Sq inches per yard</span><strong>{sqInPerYard.toFixed(0)}</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/cost/per-yard" className="related-tool-link">💰 Per Yard</a><a href="/convert/fabric-area-calculator" className="related-tool-link">📐 Area Calc</a></div></aside>
      </div>
    </div>
  );
}