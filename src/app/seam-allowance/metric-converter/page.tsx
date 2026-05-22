"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [imperial,setImperial]=useState("0.625");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const imp=parseFloat(imperial)||0.625;const exactCm=imp*2.54;const roundedCm=Math.round(exactCm*2)/2;const diff=Math.abs(exactCm-roundedCm);const hasResult=true;const resultValue=exactCm.toFixed(2)+" cm (use "+roundedCm.toFixed(1)+" cm)";const resultLabel=imp+"\" to metric";

  const faqItems = [{q:"Why does 5/8 inch become 1.5 cm and not 1.6 cm?",a:"1.6 cm is exact, but 1.5 cm is the standard metric equivalent because its easier to mark and the difference is negligible."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Seam Allowance Tools",href:"/seam-allowance"},{label:"Seam Allowance to Metric"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>📏</span> Seam Tool #88</span>
            <h1>Seam Allowance to Metric</h1>
            <p>Convert imperial seam allowances to metric equivalents.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="input-group"><label className="input-label">Imperial seam allowance</label><select className="input-field" value={imperial} onChange={e=>setImperial(e.target.value)}><option value="0.25">1/4&quot;</option><option value="0.375">3/8&quot;</option><option value="0.5">1/2&quot;</option><option value="0.625">5/8&quot;</option><option value="0.75">3/4&quot;</option><option value="1">1&quot;</option><option value="1.5">1-1/2&quot;</option></select></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Exact conversion</span><strong>{exactCm.toFixed(3)} cm</strong></div><div className={styles.resultRow}><span>Practical metric</span><strong>{roundedCm.toFixed(1)} cm</strong></div><div className={styles.resultRow}><span>Rounding difference</span><strong>{diff.toFixed(3)} cm ({(diff/exactCm*100).toFixed(1)}%)</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/seam-allowance/converter" className="related-tool-link">↔️ Converter</a><a href="/convert/inches-to-centimeters" className="related-tool-link">📏 In→Cm</a></div></aside>
      </div>
    </div>
  );
}