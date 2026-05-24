"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { BarChart3, ClipboardCopy, Printer, Ruler, Wrench } from "lucide-react";

export default function Page() {
  const [current,setCurrent]=useState("");const [desired,setDesired]=useState("");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const ce=parseFloat(current)||0;const de=parseFloat(desired)||0;const adj=de-ce;const perSide=adj/4;const hasResult=ce!==0||de!==0;const resultValue=(adj>0?"+":"")+adj.toFixed(2)+"\" total";const resultLabel="adjust "+(adj>0?"add":"remove")+" ease";

  const faqItems = [{q:"How do I remove ease from a pattern?",a:"Divide the total reduction by the number of seams (usually 4 for bodice), then take in each seam equally."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Pattern Tools",href:"/pattern"},{label:"Ease Adjustment Tool"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><Wrench size={14} strokeWidth={1.5} /> Pattern Tool</span>
            <h1>Ease Adjustment Tool</h1>
            <p>Add or remove ease from a pattern for custom fit.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label" htmlFor="ce">Current ease (in)</label><input id="ce" type="number" className="input-field" placeholder="e.g., 4" value={current} onChange={e=>setCurrent(e.target.value)} step="0.25"/></div><div className="input-group"><label className="input-label" htmlFor="de">Desired ease (in)</label><input id="de" type="number" className="input-field" placeholder="e.g., 2" value={desired} onChange={e=>setDesired(e.target.value)} step="0.25"/></div></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Total adjustment</span><strong>{adj>0?"+":""}{adj.toFixed(2)}&quot;</strong></div><div className={styles.resultRow}><span>Per side seam</span><strong>{perSide>0?"+":""}{perSide.toFixed(3)}&quot;</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/pattern/ease-adjuster" className="related-tool-link"><Ruler size={13} /> Ease Calc</a><a href="/pattern/size-grader" className="related-tool-link"><BarChart3 size={13} /> Size Grader</a></div></aside>
      </div>
    </div>
  );
}