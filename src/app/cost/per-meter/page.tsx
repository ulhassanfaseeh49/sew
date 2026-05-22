"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [pricePerMeter,setPricePerMeter]=useState("");const [meters,setMeters]=useState("");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const ppm=parseFloat(pricePerMeter)||0;const mt=parseFloat(meters)||0;const total=ppm*mt;const perYard=ppm*0.9144;const hasResult=ppm>0&&mt>0;const resultValue="$"+total.toFixed(2);const resultLabel=mt+" meters at $"+ppm.toFixed(2)+"/m";

  const faqItems = [{q:"How do I convert price per meter to per yard?",a:"Multiply the per-meter price by 0.9144 to get the per-yard price."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Cost Calculators",href:"/cost"},{label:"Cost Per Meter Calculator"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>💶</span> Cost Tool #68</span>
            <h1>Cost Per Meter Calculator</h1>
            <p>Calculate cost per meter or total from price per meter.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label" htmlFor="ppm">Price per meter ($)</label><input id="ppm" type="number" className="input-field" placeholder="e.g., 14.99" value={pricePerMeter} onChange={e=>setPricePerMeter(e.target.value)} min="0" step="0.01"/></div><div className="input-group"><label className="input-label" htmlFor="mt">Meters needed</label><input id="mt" type="number" className="input-field" placeholder="e.g., 3" value={meters} onChange={e=>setMeters(e.target.value)} min="0" step="0.1"/></div></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Price per yard</span><strong>${perYard.toFixed(2)}/yd</strong></div><div className={styles.resultRow}><span>Equivalent yards</span><strong>{(mt/0.9144).toFixed(2)} yd</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/cost/per-yard" className="related-tool-link">💰 Per Yard</a><a href="/convert/meters-to-yards" className="related-tool-link">↔️ M to Yd</a></div></aside>
      </div>
    </div>
  );
}