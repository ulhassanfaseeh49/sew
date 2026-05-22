"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ArrowLeftRight, ClipboardCopy, Plus, Printer, Ruler } from "lucide-react";

export default function Page() {
  const [sa,setSa]=useState("0.625");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const inches=parseFloat(sa)||0;const cm=inches*2.54;const mm=inches*25.4;const hasResult=true;const resultValue=inches+"\" = "+cm.toFixed(1)+" cm";const resultLabel="seam allowance conversion";

  const faqItems = [{q:"What is the standard seam allowance?",a:"5/8 inch (1.6 cm) is standard for garment sewing. 1/4 inch for quilting. 1/2 inch for home decor."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Seam Allowance Tools",href:"/seam-allowance"},{label:"Seam Allowance Converter"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><ArrowLeftRight size={14} strokeWidth={1.5} /> Seam Tool</span>
            <h1>Seam Allowance Converter</h1>
            <p>Convert between common seam allowances in imperial and metric.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="input-group"><label className="input-label">Select seam allowance</label><select className="input-field" value={sa} onChange={e=>setSa(e.target.value)}><option value="0.25">1/4&quot; (quilting)</option><option value="0.375">3/8&quot;</option><option value="0.5">1/2&quot;</option><option value="0.625">5/8&quot; (standard)</option><option value="1">1&quot;</option><option value="1.5">1-1/2&quot;</option></select></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Inches</span><strong>{inches}&quot;</strong></div><div className={styles.resultRow}><span>Centimeters</span><strong>{cm.toFixed(2)} cm</strong></div><div className={styles.resultRow}><span>Millimeters</span><strong>{mm.toFixed(1)} mm</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/seam-allowance/adder" className="related-tool-link"><Plus size={13} /> SA Adder</a><a href="/seam-allowance/metric-converter" className="related-tool-link"><Ruler size={13} /> Metric</a></div></aside>
      </div>
    </div>
  );
}