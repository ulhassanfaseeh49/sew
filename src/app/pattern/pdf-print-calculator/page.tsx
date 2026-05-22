"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, FileText, Printer, Ruler } from "lucide-react";

export default function Page() {
  const [patternW,setPatternW]=useState("");const [patternH,setPatternH]=useState("");const [paperSize,setPaperSize]=useState("letter");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const pw=parseFloat(patternW)||0;const ph=parseFloat(patternH)||0;const paper: Record<string,[number,number]>={letter:[8,10.5],A4:[7.77,11.2]};const[ppW,ppH]=paper[paperSize]||[8,10.5];const cols=Math.ceil(pw/ppW);const rows=Math.ceil(ph/ppH);const pages=cols*rows;const hasResult=pw>0&&ph>0;const resultValue=pages+" pages";const resultLabel=cols+" columns × "+rows+" rows";

  const faqItems = [{q:"How do I assemble a tiled PDF pattern?",a:"Print at 100% (no scaling), trim overlap edges, align registration marks, and tape pages together."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Pattern Tools",href:"/pattern"},{label:"PDF Pattern Printing Calculator"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><FileText size={14} strokeWidth={1.5} /> Pattern Tool</span>
            <h1>PDF Pattern Printing Calculator</h1>
            <p>Calculate pages needed for printing PDF patterns at home.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label" htmlFor="pw">Pattern width (in)</label><input id="pw" type="number" className="input-field" placeholder="e.g., 36" value={patternW} onChange={e=>setPatternW(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label" htmlFor="ph">Pattern height (in)</label><input id="ph" type="number" className="input-field" placeholder="e.g., 48" value={patternH} onChange={e=>setPatternH(e.target.value)} min="0"/></div></div><div className="input-group"><label className="input-label">Paper size</label><select className="input-field" value={paperSize} onChange={e=>setPaperSize(e.target.value)}><option value="letter">Letter (8.5 x 11)</option><option value="A4">A4 (8.27 x 11.7)</option></select></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Columns</span><strong>{cols}</strong></div><div className={styles.resultRow}><span>Rows</span><strong>{rows}</strong></div><div className={styles.resultRow}><span>Total pages</span><strong>{pages}</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/pattern/copy-shop-guide" className="related-tool-link"><Printer size={13} /> Copy Shop</a><a href="/pattern/percentage-scaler" className="related-tool-link"><Ruler size={13} /> % Scaler</a></div></aside>
      </div>
    </div>
  );
}