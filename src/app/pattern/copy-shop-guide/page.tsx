"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [fromPaper,setFromPaper]=useState("A0");const [toPaper,setToPaper]=useState("letter");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const sizes: Record<string,[number,number]>={A0:[33.1,46.8],A1:[23.4,33.1],A4:[8.27,11.7],letter:[8.5,11]};const[fw,fh]=sizes[fromPaper]||[33.1,46.8];const[tw,th]=sizes[toPaper]||[8.5,11];const scalePct=Math.min(tw/fw,th/fh)*100;const hasResult=true;const resultValue=scalePct.toFixed(1)+"% scale";const resultLabel=fromPaper+" → "+toPaper;

  const faqItems = [{q:"Should I tile patterns or use a copy shop?",a:"Copy shops with A0/A1 printers give one-piece prints. Home printing requires tiling and taping multiple pages."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Pattern Tools",href:"/pattern"},{label:"Copy Shop Scaling Guide"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>🖨️</span> Pattern Tool #99</span>
            <h1>Copy Shop Scaling Guide</h1>
            <p>Calculate exact print percentage for pattern printing at copy shops.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label">Pattern printed on</label><select className="input-field" value={fromPaper} onChange={e=>setFromPaper(e.target.value)}><option value="A0">A0 (33.1 x 46.8&quot;)</option><option value="A1">A1 (23.4 x 33.1&quot;)</option><option value="A4">A4 (8.27 x 11.7&quot;)</option><option value="letter">Letter (8.5 x 11&quot;)</option></select></div><div className="input-group"><label className="input-label">Print on</label><select className="input-field" value={toPaper} onChange={e=>setToPaper(e.target.value)}><option value="letter">Letter (8.5 x 11&quot;)</option><option value="A4">A4 (8.27 x 11.7&quot;)</option><option value="A0">A0 (33.1 x 46.8&quot;)</option><option value="A1">A1 (23.4 x 33.1&quot;)</option></select></div></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>From size</span><strong>{fw}&quot; x {fh}&quot;</strong></div><div className={styles.resultRow}><span>To size</span><strong>{tw}&quot; x {th}&quot;</strong></div><div className={styles.resultRow}><span>Tell copy shop</span><strong>Print at {scalePct.toFixed(1)}%</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/pattern/pdf-print-calculator" className="related-tool-link">📄 PDF Print</a><a href="/pattern/percentage-scaler" className="related-tool-link">📐 % Scaler</a></div></aside>
      </div>
    </div>
  );
}