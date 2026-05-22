"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [outerYd,setOuterYd]=useState("");const [outerW,setOuterW]=useState("44.5");const [underW,setUnderW]=useState("44.5");const [coverage,setCoverage]=useState("100");
  const [fabricWidth, setFabricWidth] = useState("44.5");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const fw = parseFloat(fabricWidth) || 44.5;
  const oy=parseFloat(outerYd)||0;const ow=parseFloat(outerW)||44.5;const uw=parseFloat(underW)||44.5;const cov=parseFloat(coverage)||100;const base=oy*(cov/100)*(ow/uw);const resultYards=Math.ceil(base*8)/8;const resultLabel="underlining at "+cov+"% coverage";const hasResult=oy>0;

  const faqItems = [{q:"What is underlining?",a:"Underlining is cut identically to fashion fabric and basted to each piece before construction for added body or opacity."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Yardage Calculators",href:"/yardage"},{label:"Underlining Yardage Calculator"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>📄</span> Yardage Tool #33</span>
            <h1>Underlining Yardage Calculator</h1>
            <p>Calculate underlining fabric (cut-for-cut with fashion fabric).</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Dimensions</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label" htmlFor="oy">Fashion fabric yardage</label><input id="oy" type="number" className="input-field" placeholder="e.g., 4" value={outerYd} onChange={e=>setOuterYd(e.target.value)} min="0" step="0.125"/></div><div className="input-group"><label className="input-label">Coverage</label><select className="input-field" value={coverage} onChange={e=>setCoverage(e.target.value)}><option value="100">Full garment</option><option value="70">Bodice only</option><option value="50">Select pieces</option></select></div></div>
              <div className="input-group"><label className="input-label">Fabric width</label>
                <select className="input-field" value={fabricWidth} onChange={e=>setFabricWidth(e.target.value)}>
                  <option value="44.5">44/45&quot;</option><option value="54">54&quot;</option><option value="60">60&quot;</option><option value="108">108&quot;</option>
                </select></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultYards.toFixed(3)} yards</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Meters</span><strong>{(resultYards*0.9144).toFixed(2)} m</strong></div>
                  <div className={styles.resultRow}><span>Coverage</span><strong>{coverage}%</strong></div>
                </div>
                <div className="toolbar">
                  <button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultYards.toFixed(3)+' yards')}>📋 Copy</button>
                  <button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button>
                </div>
              </div>
            )}
          </div>
          <section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div>
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/yardage/basic-calculator" className="related-tool-link">📐 Basic Yardage</a><a href="/yardage/buffer-calculator" className="related-tool-link">🛡️ Buffer</a></div></aside>
      </div>
    </div>
  );
}