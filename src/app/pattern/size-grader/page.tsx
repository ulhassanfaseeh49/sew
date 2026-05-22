"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [bust,setBust]=useState("");const [targetBust,setTargetBust]=useState("");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const cb=parseFloat(bust)||0;const tb=parseFloat(targetBust)||0;const diff=tb-cb;const bustGrade=diff/4;const waistGrade=diff*0.9/4;const hipGrade=diff*1.1/4;const hasResult=cb>0&&tb>0;const resultValue=diff>0?"+"+diff.toFixed(1)+"\" total grade":diff.toFixed(1)+"\" total grade";const resultLabel=(diff>0?"Grading up":"Grading down")+" from "+cb+"\" to "+tb+"\"";

  const faqItems = [{q:"What is pattern grading?",a:"Systematically increasing or decreasing a pattern at specific points to change the size while maintaining proportions."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Pattern Tools",href:"/pattern"},{label:"Pattern Size Grading Tool"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>📊</span> Pattern Tool #95</span>
            <h1>Pattern Size Grading Tool</h1>
            <p>Grade a pattern up or down between sizes with standard grade rules.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label" htmlFor="cb">Current bust (in)</label><input id="cb" type="number" className="input-field" placeholder="e.g., 36" value={bust} onChange={e=>setBust(e.target.value)} min="0" step="0.5"/></div><div className="input-group"><label className="input-label" htmlFor="tb">Target bust (in)</label><input id="tb" type="number" className="input-field" placeholder="e.g., 40" value={targetBust} onChange={e=>setTargetBust(e.target.value)} min="0" step="0.5"/></div></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Bust grade (per quarter)</span><strong>{bustGrade>0?"+":""}{bustGrade.toFixed(3)}&quot;</strong></div><div className={styles.resultRow}><span>Waist grade (per quarter)</span><strong>{waistGrade>0?"+":""}{waistGrade.toFixed(3)}&quot;</strong></div><div className={styles.resultRow}><span>Hip grade (per quarter)</span><strong>{hipGrade>0?"+":""}{hipGrade.toFixed(3)}&quot;</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/pattern/between-sizes-grader" className="related-tool-link">🔀 Between Sizes</a><a href="/pattern/percentage-scaler" className="related-tool-link">📐 % Scaler</a></div></aside>
      </div>
    </div>
  );
}