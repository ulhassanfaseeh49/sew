"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { BarChart3, ClipboardCopy, Printer, Shirt } from "lucide-react";

export default function Page() {
  const [yourShoulder,setYourShoulder]=useState("");const [patternShoulder,setPatternShoulder]=useState("");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const ys=parseFloat(yourShoulder)||0;const ps=parseFloat(patternShoulder)||0;const diff=ys-ps;const perSide=diff/2;const hasResult=ys>0&&ps>0;const resultValue=(diff>0?"+":"")+diff.toFixed(2)+"\" total";const resultLabel=diff>0?"Broaden shoulders":"Narrow shoulders";

  const faqItems = [{q:"How do I adjust shoulder width in a pattern?",a:"For small adjustments, pivot at the armhole notch. For larger changes, use slash-and-spread at the shoulder."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Pattern Tools",href:"/pattern"},{label:"Broad Shoulder Adjustment"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span></span> Pattern Tool</span>
            <h1>Broad Shoulder Adjustment</h1>
            <p>Calculate shoulder width adjustments.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label" htmlFor="ys">Your shoulder width (in)</label><input id="ys" type="number" className="input-field" placeholder="e.g., 16" value={yourShoulder} onChange={e=>setYourShoulder(e.target.value)} min="0" step="0.25"/></div><div className="input-group"><label className="input-label" htmlFor="ps">Pattern shoulder width (in)</label><input id="ps" type="number" className="input-field" placeholder="e.g., 15" value={patternShoulder} onChange={e=>setPatternShoulder(e.target.value)} min="0" step="0.25"/></div></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Per side</span><strong>{perSide>0?"+":""}{perSide.toFixed(3)}&quot;</strong></div><div className={styles.resultRow}><span>Method</span><strong>{Math.abs(diff)>1?"Slash and spread":"Pivot at armhole notch"}</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/pattern/full-bust-adjustment" className="related-tool-link"><Shirt size={13} /> FBA</a><a href="/pattern/size-grader" className="related-tool-link"><BarChart3 size={13} /> Size Grader</a></div></aside>
      </div>
    </div>
  );
}