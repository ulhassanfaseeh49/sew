"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [fabric,setFabric]=useState("");const [lining,setLining]=useState("");const [interfacing,setInterfacing]=useState("");const [thread,setThread]=useState("3");const [zipper,setZipper]=useState("");const [buttons,setButtons]=useState("");const [elastic,setElastic]=useState("");const [pattern,setPattern]=useState("");const [other,setOther]=useState("");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const items=[{n:"Fabric",v:parseFloat(fabric)||0},{n:"Lining",v:parseFloat(lining)||0},{n:"Interfacing",v:parseFloat(interfacing)||0},{n:"Thread",v:parseFloat(thread)||0},{n:"Zipper",v:parseFloat(zipper)||0},{n:"Buttons",v:parseFloat(buttons)||0},{n:"Elastic",v:parseFloat(elastic)||0},{n:"Pattern",v:parseFloat(pattern)||0},{n:"Other",v:parseFloat(other)||0}];const total=items.reduce((s,i)=>s+i.v,0);const hasResult=total>0;const resultValue="$"+total.toFixed(2);const resultLabel="total itemized cost";

  const faqItems = [{q:"What costs are easy to forget?",a:"Thread, interfacing, elastic, and bias tape are commonly forgotten. Also consider needle wear and electricity."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Cost Calculators",href:"/cost"},{label:"Complete Cost Breakdown"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>🧾</span> Cost Tool #72</span>
            <h1>Complete Cost Breakdown</h1>
            <p>Itemized cost breakdown with every component.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label">Fabric ($)</label><input type="number" className="input-field" placeholder="0" value={fabric} onChange={e=>setFabric(e.target.value)} min="0" step="0.01"/></div><div className="input-group"><label className="input-label">Lining ($)</label><input type="number" className="input-field" placeholder="0" value={lining} onChange={e=>setLining(e.target.value)} min="0" step="0.01"/></div><div className="input-group"><label className="input-label">Interfacing ($)</label><input type="number" className="input-field" placeholder="0" value={interfacing} onChange={e=>setInterfacing(e.target.value)} min="0" step="0.01"/></div></div><div className="calculator-form-row"><div className="input-group"><label className="input-label">Thread ($)</label><input type="number" className="input-field" value={thread} onChange={e=>setThread(e.target.value)} min="0" step="0.01"/></div><div className="input-group"><label className="input-label">Zipper ($)</label><input type="number" className="input-field" placeholder="0" value={zipper} onChange={e=>setZipper(e.target.value)} min="0" step="0.01"/></div><div className="input-group"><label className="input-label">Buttons ($)</label><input type="number" className="input-field" placeholder="0" value={buttons} onChange={e=>setButtons(e.target.value)} min="0" step="0.01"/></div></div><div className="calculator-form-row"><div className="input-group"><label className="input-label">Elastic ($)</label><input type="number" className="input-field" placeholder="0" value={elastic} onChange={e=>setElastic(e.target.value)} min="0" step="0.01"/></div><div className="input-group"><label className="input-label">Pattern ($)</label><input type="number" className="input-field" placeholder="0" value={pattern} onChange={e=>setPattern(e.target.value)} min="0" step="0.01"/></div><div className="input-group"><label className="input-label">Other ($)</label><input type="number" className="input-field" placeholder="0" value={other} onChange={e=>setOther(e.target.value)} min="0" step="0.01"/></div></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  {items.filter(i=>i.v>0).map(i=>(<div key={i.n} className={styles.resultRow}><span>{i.n}</span><strong>${i.v.toFixed(2)} ({(total>0?(i.v/total*100).toFixed(0):0)}%)</strong></div>))}
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/cost/project-estimator" className="related-tool-link">📊 Project Estimator</a><a href="/cost/per-garment" className="related-tool-link">👗 Per Garment</a></div></aside>
      </div>
    </div>
  );
}