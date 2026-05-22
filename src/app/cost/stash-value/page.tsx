"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [entries,setEntries]=useState([{yards:"",price:""},{yards:"",price:""},{yards:"",price:""}]);
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const totalYards=entries.reduce((s,e)=>s+(parseFloat(e.yards)||0),0);const totalValue=entries.reduce((s,e)=>s+(parseFloat(e.yards)||0)*(parseFloat(e.price)||0),0);const avgPerYard=totalYards>0?totalValue/totalYards:0;const hasResult=totalValue>0;const resultValue="$"+totalValue.toFixed(2);const resultLabel=totalYards.toFixed(1)+" total yards in stash";

  const faqItems = [{q:"Why track my stash value?",a:"It helps with insurance, prevents over-buying, and motivates you to use what you have."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Cost Calculators",href:"/cost"},{label:"Fabric Stash Value Estimator"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>📦</span> Cost Tool #80</span>
            <h1>Fabric Stash Value Estimator</h1>
            <p>Estimate the total value of your fabric stash.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>{entries.map((e,i)=>(<div key={i} className="calculator-form-row"><div className="input-group"><label className="input-label">Fabric #{i+1} yards</label><input type="number" className="input-field" placeholder="0" value={e.yards} onChange={ev=>{const n=[...entries];n[i].yards=ev.target.value;setEntries(n);}} min="0" step="0.125"/></div><div className="input-group"><label className="input-label">$/yard</label><input type="number" className="input-field" placeholder="0" value={e.price} onChange={ev=>{const n=[...entries];n[i].price=ev.target.value;setEntries(n);}} min="0" step="0.01"/></div></div>))}<button className="btn btn-ghost btn-sm" onClick={()=>setEntries([...entries,{yards:"",price:""}])}>+ Add fabric</button></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Total yards</span><strong>{totalYards.toFixed(1)}</strong></div><div className={styles.resultRow}><span>Average $/yard</span><strong>${avgPerYard.toFixed(2)}</strong></div><div className={styles.resultRow}><span>Fabrics tracked</span><strong>{entries.filter(e=>(parseFloat(e.yards)||0)>0).length}</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/cost/remnant-value" className="related-tool-link">🧵 Remnant Value</a><a href="/cost/per-yard" className="related-tool-link">💰 Per Yard</a></div></aside>
      </div>
    </div>
  );
}