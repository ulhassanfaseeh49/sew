"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [fabricCost,setFabricCost]=useState("");const [liningCost,setLiningCost]=useState("");const [interfacingCost,setInterfacingCost]=useState("");const [notionsCost,setNotionsCost]=useState("");const [patternCost,setPatternCost]=useState("");const [threadCost,setThreadCost]=useState("3");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const fc=parseFloat(fabricCost)||0;const lc=parseFloat(liningCost)||0;const ic=parseFloat(interfacingCost)||0;const nc=parseFloat(notionsCost)||0;const pc=parseFloat(patternCost)||0;const tc=parseFloat(threadCost)||0;const total=fc+lc+ic+nc+pc+tc;const hasResult=total>0;const resultValue="$"+total.toFixed(2);const resultLabel="total project cost";

  const faqItems = [{q:"What costs should I include in a sewing project?",a:"Include fabric, lining, interfacing, thread, zippers, buttons, elastic, pattern, and any specialty notions."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Cost Calculators",href:"/cost"},{label:"Total Project Cost Estimator"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>📊</span> Cost Tool #69</span>
            <h1>Total Project Cost Estimator</h1>
            <p>Comprehensive cost: fabric, lining, interfacing, thread, notions, and pattern.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label" htmlFor="fc">Fabric cost ($)</label><input id="fc" type="number" className="input-field" placeholder="e.g., 45" value={fabricCost} onChange={e=>setFabricCost(e.target.value)} min="0" step="0.01"/></div><div className="input-group"><label className="input-label" htmlFor="lc">Lining cost ($)</label><input id="lc" type="number" className="input-field" placeholder="0" value={liningCost} onChange={e=>setLiningCost(e.target.value)} min="0" step="0.01"/></div></div><div className="calculator-form-row"><div className="input-group"><label className="input-label" htmlFor="ic">Interfacing ($)</label><input id="ic" type="number" className="input-field" placeholder="0" value={interfacingCost} onChange={e=>setInterfacingCost(e.target.value)} min="0" step="0.01"/></div><div className="input-group"><label className="input-label" htmlFor="nc">Notions ($)</label><input id="nc" type="number" className="input-field" placeholder="e.g., 8" value={notionsCost} onChange={e=>setNotionsCost(e.target.value)} min="0" step="0.01"/></div></div><div className="calculator-form-row"><div className="input-group"><label className="input-label" htmlFor="pc">Pattern ($)</label><input id="pc" type="number" className="input-field" placeholder="e.g., 15" value={patternCost} onChange={e=>setPatternCost(e.target.value)} min="0" step="0.01"/></div><div className="input-group"><label className="input-label" htmlFor="tc">Thread ($)</label><input id="tc" type="number" className="input-field" value={threadCost} onChange={e=>setThreadCost(e.target.value)} min="0" step="0.01"/></div></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Fabric</span><strong>${fc.toFixed(2)}</strong></div><div className={styles.resultRow}><span>Lining</span><strong>${lc.toFixed(2)}</strong></div><div className={styles.resultRow}><span>Interfacing</span><strong>${ic.toFixed(2)}</strong></div><div className={styles.resultRow}><span>Notions</span><strong>${nc.toFixed(2)}</strong></div><div className={styles.resultRow}><span>Pattern</span><strong>${pc.toFixed(2)}</strong></div><div className={styles.resultRow}><span>Thread</span><strong>${tc.toFixed(2)}</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/cost/breakdown" className="related-tool-link">🧾 Breakdown</a><a href="/cost/per-garment" className="related-tool-link">👗 Per Garment</a></div></aside>
      </div>
    </div>
  );
}