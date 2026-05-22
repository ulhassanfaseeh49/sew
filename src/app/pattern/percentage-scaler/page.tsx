"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Ruler, Search } from "lucide-react";

export default function Page() {
  const [original,setOriginal]=useState("");const [pct,setPct]=useState("125");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const orig=parseFloat(original)||0;const p=parseFloat(pct)||100;const scaled=orig*(p/100);const hasResult=orig>0;const resultValue=scaled.toFixed(3)+"\"";const resultLabel=orig+"\" scaled to "+p+"%";

  const faqItems = [{q:"How do I scale a pattern evenly?",a:"Apply the same percentage to all dimensions. Use a copy machine or digital scaling tool."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Pattern Tools",href:"/pattern"},{label:"Percentage Scaling Calculator"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Pattern Tool</span>
            <h1>Percentage Scaling Calculator</h1>
            <p>Scale any dimension by a custom percentage.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label" htmlFor="orig">Original dimension (in)</label><input id="orig" type="number" className="input-field" placeholder="e.g., 15" value={original} onChange={e=>setOriginal(e.target.value)} min="0" step="0.125"/></div><div className="input-group"><label className="input-label" htmlFor="pct">Scale percentage</label><input id="pct" type="number" className="input-field" placeholder="e.g., 125" value={pct} onChange={e=>setPct(e.target.value)} min="1"/></div></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Original</span><strong>{orig}&quot;</strong></div><div className={styles.resultRow}><span>Scaled</span><strong>{scaled.toFixed(3)}&quot;</strong></div><div className={styles.resultRow}><span>Change</span><strong>{(scaled-orig)>0?"+":""}{(scaled-orig).toFixed(3)}&quot;</strong></div>
                </div>
                <div className="toolbar">
                  <button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button>
                  <button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button>
                </div>
              </div>
            )}
          </div>
          <section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div>
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/pattern/enlargement-calculator" className="related-tool-link"><Search size={13} /> Enlargement</a><a href="/pattern/copy-shop-guide" className="related-tool-link"><Printer size={13} /> Copy Shop</a></div></aside>
      </div>
    </div>
  );
}