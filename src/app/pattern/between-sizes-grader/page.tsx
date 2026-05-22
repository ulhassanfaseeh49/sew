"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { BarChart3, ClipboardCopy, Printer, Ruler } from "lucide-react";

export default function Page() {
  const [measurement,setMeasurement]=useState("");const [sizeA,setSizeA]=useState("");const [sizeB,setSizeB]=useState("");const [aName,setAName]=useState("Size 12");const [bName,setBName]=useState("Size 14");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const ms=parseFloat(measurement)||0;const sa=parseFloat(sizeA)||0;const sb=parseFloat(sizeB)||0;const range=sb-sa;const blend=range>0?((ms-sa)/range)*100:0;const hasResult=ms>0&&sa>0&&sb>0;const resultValue=blend.toFixed(0)+"% toward "+bName;const resultLabel="blend between "+aName+" and "+bName;

  const faqItems = [{q:"Should I always blend between sizes?",a:"If your bust is one size and hips another, blend at the waist. This is very common and gives a better fit."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Pattern Tools",href:"/pattern"},{label:"Between Sizes Grader"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span></span> Pattern Tool</span>
            <h1>Between Sizes Grader</h1>
            <p>Blend between two pattern sizes when measurements fall between.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="input-group"><label className="input-label" htmlFor="ms">Your measurement (in)</label><input id="ms" type="number" className="input-field" placeholder="e.g., 37" value={measurement} onChange={e=>setMeasurement(e.target.value)} min="0" step="0.25"/></div><div className="calculator-form-row"><div className="input-group"><label className="input-label">{aName} measurement</label><input type="number" className="input-field" placeholder="e.g., 36" value={sizeA} onChange={e=>setSizeA(e.target.value)} min="0" step="0.25"/></div><div className="input-group"><label className="input-label">{bName} measurement</label><input type="number" className="input-field" placeholder="e.g., 38" value={sizeB} onChange={e=>setSizeB(e.target.value)} min="0" step="0.25"/></div></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>{aName}</span><strong>{blend.toFixed(0)}% of distance from {aName}</strong></div><div className={styles.resultRow}><span>Blend method</span><strong>Grade {blend.toFixed(0)}% of the way from {aName} to {bName}</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/pattern/size-grader" className="related-tool-link"><BarChart3 size={13} /> Size Grader</a><a href="/pattern/ease-calculator" className="related-tool-link"><Ruler size={13} /> Ease</a></div></aside>
      </div>
    </div>
  );
}