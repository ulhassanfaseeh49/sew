"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [mode,setMode]=useState("seam-to-cutting");const [sa,setSa]=useState("0.625");const [dimension,setDimension]=useState("");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const dim=parseFloat(dimension)||0;const seam=parseFloat(sa)||0.625;const result=mode==="seam-to-cutting"?dim+seam*2:dim-seam*2;const hasResult=dim>0;const resultValue=result.toFixed(3)+"\"";const resultLabel=mode==="seam-to-cutting"?"Cutting line measurement":"Seam line (finished) measurement";

  const faqItems = [{q:"What is the difference between European and American patterns?",a:"European patterns are usually drawn on the seam line (no SA). American patterns include SA in the cutting line."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Pattern Tools",href:"/pattern"},{label:"Seam Line to Cutting Line Converter"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>✂️</span> Pattern Tool #112</span>
            <h1>Seam Line to Cutting Line Converter</h1>
            <p>Convert between European seam line and American cutting line patterns.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="input-group"><label className="input-label">Conversion direction</label><select className="input-field" value={mode} onChange={e=>setMode(e.target.value)}><option value="seam-to-cutting">Seam line → Cutting line (add SA)</option><option value="cutting-to-seam">Cutting line → Seam line (remove SA)</option></select></div><div className="calculator-form-row"><div className="input-group"><label className="input-label" htmlFor="dim">Measurement (in)</label><input id="dim" type="number" className="input-field" placeholder="e.g., 15" value={dimension} onChange={e=>setDimension(e.target.value)} min="0" step="0.125"/></div><div className="input-group"><label className="input-label">Seam allowance</label><select className="input-field" value={sa} onChange={e=>setSa(e.target.value)}><option value="0.375">3/8&quot;</option><option value="0.5">1/2&quot;</option><option value="0.625">5/8&quot;</option><option value="1">1&quot; (European standard)</option></select></div></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Input</span><strong>{dim}&quot; ({mode==="seam-to-cutting"?"seam line":"cutting line"})</strong></div><div className={styles.resultRow}><span>SA per side</span><strong>{seam}&quot;</strong></div><div className={styles.resultRow}><span>Result</span><strong>{result.toFixed(3)}&quot;</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/seam-allowance/adder" className="related-tool-link">➕ SA Adder</a><a href="/seam-allowance/converter" className="related-tool-link">↔️ SA Converter</a></div></aside>
      </div>
    </div>
  );
}