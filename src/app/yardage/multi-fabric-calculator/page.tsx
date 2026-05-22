"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [fab1,setFab1]=useState("");const [fab2,setFab2]=useState("");const [fab3,setFab3]=useState("");
  const [fabricWidth, setFabricWidth] = useState("44.5");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const fw = parseFloat(fabricWidth) || 44.5;
  const f1=parseFloat(fab1)||0;const f2=parseFloat(fab2)||0;const f3=parseFloat(fab3)||0;const total=f1+f2+f3;const resultYards=total;const resultLabel="total across "+(f3>0?"3":"2")+" fabrics";const hasResult=total>0;

  const faqItems = [{q:"Why use a multi-fabric calculator?",a:"Color-blocked garments and multi-fabric projects need separate yardage for each fabric. This tool tracks them together."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Yardage Calculators",href:"/yardage"},{label:"Multi-Fabric Project Calculator"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>🎯</span> Yardage Tool #34</span>
            <h1>Multi-Fabric Project Calculator</h1>
            <p>Yardage for color-blocked and multi-fabric projects.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Dimensions</h2>
            <div className="calculator-form">
              <div className="input-group"><label className="input-label" htmlFor="f1">Fabric A yardage</label><input id="f1" type="number" className="input-field" placeholder="e.g., 2" value={fab1} onChange={e=>setFab1(e.target.value)} min="0" step="0.125"/></div><div className="input-group"><label className="input-label" htmlFor="f2">Fabric B yardage</label><input id="f2" type="number" className="input-field" placeholder="e.g., 1.5" value={fab2} onChange={e=>setFab2(e.target.value)} min="0" step="0.125"/></div><div className="input-group"><label className="input-label" htmlFor="f3">Fabric C yardage (optional)</label><input id="f3" type="number" className="input-field" placeholder="0" value={fab3} onChange={e=>setFab3(e.target.value)} min="0" step="0.125"/></div>
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
                  <div className={styles.resultRow}><span>Fabric A</span><strong>{(parseFloat(fab1)||0).toFixed(3)} yd</strong></div><div className={styles.resultRow}><span>Fabric B</span><strong>{(parseFloat(fab2)||0).toFixed(3)} yd</strong></div>{(parseFloat(fab3)||0)>0&&<div className={styles.resultRow}><span>Fabric C</span><strong>{(parseFloat(fab3)||0).toFixed(3)} yd</strong></div>}
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