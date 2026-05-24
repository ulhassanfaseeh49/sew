"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Ruler, Shirt } from "lucide-react";

export default function Page() {
  const [height,setHeight]=useState("");const [patternHeight,setPatternHeight]=useState("65");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const yh=parseFloat(height)||0;const ph=parseFloat(patternHeight)||65;const diff=yh-ph;const bodiceAdj=diff*0.3;const skirtAdj=diff*0.5;const sleeveAdj=diff*0.2;const hasResult=yh>0;const resultValue=(diff>0?"+":"")+diff.toFixed(1)+"\" total adjustment";const resultLabel=yh<63?"Petite adjustment":yh>67?"Tall adjustment":"Standard height";

  const faqItems = [{q:"Where do I lengthen or shorten a pattern?",a:"At the designated lengthen/shorten lines, usually at mid-bodice and mid-skirt. Never adjust at the hemline alone."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Pattern Tools",href:"/pattern"},{label:"Petite/Tall Height Adjuster"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Pattern Tool</span>
            <h1>Petite/Tall Height Adjuster</h1>
            <p>Calculate lengthen/shorten adjustments for petite and tall figures.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label" htmlFor="yh">Your height (inches)</label><input id="yh" type="number" className="input-field" placeholder="e.g., 62" value={height} onChange={e=>setHeight(e.target.value)} min="48" max="84"/></div><div className="input-group"><label className="input-label" htmlFor="ph">Pattern designed for (in)</label><input id="ph" type="number" className="input-field" value={patternHeight} onChange={e=>setPatternHeight(e.target.value)}/></div></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Bodice (above waist)</span><strong>{bodiceAdj>0?"+":""}{bodiceAdj.toFixed(2)}&quot;</strong></div><div className={styles.resultRow}><span>Skirt/pants (below waist)</span><strong>{skirtAdj>0?"+":""}{skirtAdj.toFixed(2)}&quot;</strong></div><div className={styles.resultRow}><span>Sleeve length</span><strong>{sleeveAdj>0?"+":""}{sleeveAdj.toFixed(2)}&quot;</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/pattern/full-bust-adjustment" className="related-tool-link"><Shirt size={13} /> FBA</a><a href="" className="related-tool-link"><Ruler size={13} /> Ease</a></div></aside>
      </div>
    </div>
  );
}