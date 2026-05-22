"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [highBust,setHighBust]=useState("");const [fullBust,setFullBust]=useState("");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const hb=parseFloat(highBust)||0;const fb=parseFloat(fullBust)||0;const diff=hb-fb;const needsSBA=diff>1;const sbaAmount=diff;const dartDecrease=sbaAmount/2;const hasResult=hb>0&&fb>0;const resultValue=needsSBA?sbaAmount.toFixed(1)+"\" SBA needed":"No SBA needed";const resultLabel=diff.toFixed(1)+"\" difference (high bust larger)";

  const faqItems = [{q:"When do I need an SBA?",a:"When your full bust is smaller than your high bust by more than 1 inch, the pattern will have excess fabric at the dart area."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Pattern Tools",href:"/pattern"},{label:"Small Bust Adjustment (SBA) Calculator"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>👚</span> Pattern Tool #105</span>
            <h1>Small Bust Adjustment (SBA) Calculator</h1>
            <p>Calculate SBA for reducing dart intake.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label" htmlFor="hb">High bust (in)</label><input id="hb" type="number" className="input-field" placeholder="e.g., 34" value={highBust} onChange={e=>setHighBust(e.target.value)} min="0" step="0.5"/></div><div className="input-group"><label className="input-label" htmlFor="fb">Full bust (in)</label><input id="fb" type="number" className="input-field" placeholder="e.g., 33" value={fullBust} onChange={e=>setFullBust(e.target.value)} min="0" step="0.5"/></div></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Difference</span><strong>{diff.toFixed(1)}&quot;</strong></div><div className={styles.resultRow}><span>SBA needed?</span><strong>{needsSBA?"Yes — reduce by "+sbaAmount.toFixed(1)+"\"":"No"}</strong></div>{needsSBA&&<div className={styles.resultRow}><span>Dart decrease</span><strong>-{dartDecrease.toFixed(2)}&quot; per dart</strong></div>}
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/pattern/full-bust-adjustment" className="related-tool-link">👗 FBA</a><a href="/pattern/ease-calculator" className="related-tool-link">📏 Ease</a></div></aside>
      </div>
    </div>
  );
}