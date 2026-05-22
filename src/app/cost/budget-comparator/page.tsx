"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [budget,setBudget]=useState("");const [projectCost,setProjectCost]=useState("");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const bg=parseFloat(budget)||0;const tc=parseFloat(projectCost)||0;const diff=bg-tc;const withinBudget=diff>=0;const pct=bg>0?((tc/bg)*100):0;const hasResult=bg>0&&tc>0;const resultValue=withinBudget?"$"+diff.toFixed(2)+" under budget":"$"+Math.abs(diff).toFixed(2)+" over budget";const resultLabel=pct.toFixed(0)+"% of budget used";

  const faqItems = [{q:"What if my project is over budget?",a:"Consider a less expensive fabric, use coupons, skip lining, or simplify the design to reduce notions."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Cost Calculators",href:"/cost"},{label:"Fabric Cost vs Budget"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>📋</span> Cost Tool #70</span>
            <h1>Fabric Cost vs Budget</h1>
            <p>Compare your total project cost against a budget.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label" htmlFor="bg">Your budget ($)</label><input id="bg" type="number" className="input-field" placeholder="e.g., 50" value={budget} onChange={e=>setBudget(e.target.value)} min="0" step="0.01"/></div><div className="input-group"><label className="input-label" htmlFor="tc">Estimated project cost ($)</label><input id="tc" type="number" className="input-field" placeholder="e.g., 65" value={projectCost} onChange={e=>setProjectCost(e.target.value)} min="0" step="0.01"/></div></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Budget</span><strong>${bg.toFixed(2)}</strong></div><div className={styles.resultRow}><span>Project cost</span><strong>${tc.toFixed(2)}</strong></div><div className={styles.resultRow}><span>Difference</span><strong style={{color:withinBudget?"var(--color-success)":"var(--color-error)"}}>{withinBudget?"-":"+"}${Math.abs(diff).toFixed(2)}</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/cost/project-estimator" className="related-tool-link">📊 Project Cost</a><a href="/cost/fabric-comparison" className="related-tool-link">⚖️ Compare Fabrics</a></div></aside>
      </div>
    </div>
  );
}