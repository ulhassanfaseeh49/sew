"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [fab1Name,setFab1Name]=useState("Cotton");const [fab1Price,setFab1Price]=useState("");const [fab1Yards,setFab1Yards]=useState("");const [fab2Name,setFab2Name]=useState("Linen");const [fab2Price,setFab2Price]=useState("");const [fab2Yards,setFab2Yards]=useState("");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const f1p=parseFloat(fab1Price)||0;const f1y=parseFloat(fab1Yards)||0;const f2p=parseFloat(fab2Price)||0;const f2y=parseFloat(fab2Yards)||0;const cost1=f1p*f1y;const cost2=f2p*f2y;const diff=Math.abs(cost1-cost2);const cheaper=cost1<=cost2?fab1Name:fab2Name;const hasResult=cost1>0&&cost2>0;const resultValue=cheaper+" saves $"+diff.toFixed(2);const resultLabel="comparison: "+fab1Name+" vs "+fab2Name;

  const faqItems = [{q:"Should I always choose the cheapest fabric?",a:"Not necessarily. Consider durability, drape, ease of sewing, and how it affects the final look."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Cost Calculators",href:"/cost"},{label:"Fabric Comparison Tool"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>⚖️</span> Cost Tool #74</span>
            <h1>Fabric Comparison Tool</h1>
            <p>Compare costs of different fabrics for the same project side by side.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <p style={{fontSize:"0.85rem",color:"var(--color-text-tertiary)",marginBottom:"0.5rem"}}>Fabric A</p><div className="calculator-form-row"><div className="input-group"><label className="input-label">Name</label><input type="text" className="input-field" value={fab1Name} onChange={e=>setFab1Name(e.target.value)}/></div><div className="input-group"><label className="input-label">$/yard</label><input type="number" className="input-field" placeholder="e.g., 12" value={fab1Price} onChange={e=>setFab1Price(e.target.value)} min="0" step="0.01"/></div><div className="input-group"><label className="input-label">Yards</label><input type="number" className="input-field" placeholder="e.g., 3" value={fab1Yards} onChange={e=>setFab1Yards(e.target.value)} min="0" step="0.125"/></div></div><p style={{fontSize:"0.85rem",color:"var(--color-text-tertiary)",marginBottom:"0.5rem",marginTop:"1rem"}}>Fabric B</p><div className="calculator-form-row"><div className="input-group"><label className="input-label">Name</label><input type="text" className="input-field" value={fab2Name} onChange={e=>setFab2Name(e.target.value)}/></div><div className="input-group"><label className="input-label">$/yard</label><input type="number" className="input-field" placeholder="e.g., 18" value={fab2Price} onChange={e=>setFab2Price(e.target.value)} min="0" step="0.01"/></div><div className="input-group"><label className="input-label">Yards</label><input type="number" className="input-field" placeholder="e.g., 2.5" value={fab2Yards} onChange={e=>setFab2Yards(e.target.value)} min="0" step="0.125"/></div></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>{fab1Name}</span><strong>${cost1.toFixed(2)} ({f1y} yd × ${f1p}/yd)</strong></div><div className={styles.resultRow}><span>{fab2Name}</span><strong>${cost2.toFixed(2)} ({f2y} yd × ${f2p}/yd)</strong></div><div className={styles.resultRow}><span>Difference</span><strong>${diff.toFixed(2)}</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/cost/per-yard" className="related-tool-link">💰 Per Yard</a><a href="/cost/budget-comparator" className="related-tool-link">📋 Budget</a></div></aside>
      </div>
    </div>
  );
}