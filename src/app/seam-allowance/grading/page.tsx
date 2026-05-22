"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { BookOpen, ClipboardCopy, Printer, Ruler } from "lucide-react";

export default function Page() {
  const [originalSA,setOriginalSA]=useState("0.625");const [layers,setLayers]=useState("2");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const sa=parseFloat(originalSA)||0.625;const ly=parseInt(layers)||2;const grades=Array.from({length:ly},(_,i)=>{const w=sa-(i*0.125);return Math.max(w,0.125);});const hasResult=true;const resultValue="Grade from "+sa+"\" to "+grades[grades.length-1]+"\"";const resultLabel="graded seam allowances for "+ly+" layers";

  const faqItems = [{q:"Why grade seam allowances?",a:"Grading prevents a ridge of bulk showing through on the right side, especially on collars, facings, and waistbands."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Seam Allowance Tools",href:"/seam-allowance"},{label:"Seam Allowance Grading Calculator"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Seam Tool</span>
            <h1>Seam Allowance Grading Calculator</h1>
            <p>Calculate graded seam allowances for reducing bulk at intersections.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label">Original SA</label><select className="input-field" value={originalSA} onChange={e=>setOriginalSA(e.target.value)}><option value="0.375">3/8&quot;</option><option value="0.5">1/2&quot;</option><option value="0.625">5/8&quot;</option><option value="1">1&quot;</option></select></div><div className="input-group"><label className="input-label">Number of layers</label><select className="input-field" value={layers} onChange={e=>setLayers(e.target.value)}><option value="2">2 layers</option><option value="3">3 layers</option><option value="4">4+ layers</option></select></div></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  {grades.map((g,i)=>(<div key={i} className={styles.resultRow}><span>Layer {i+1} {i===0?"(closest to body)":"(outer)"}</span><strong>{g.toFixed(3)}&quot; ({(g*2.54).toFixed(1)} cm)</strong></div>))}<div className={styles.resultRow}><span>Purpose</span><strong style={{fontWeight:"normal",fontSize:"0.85rem"}}>Each layer is trimmed 1/8&quot; shorter to distribute bulk evenly</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/seam-allowance/curved-seams" className="related-tool-link"> Curved Seams</a><a href="/seam-allowance/standard-guide" className="related-tool-link"><BookOpen size={13} /> Standard Guide</a></div></aside>
      </div>
    </div>
  );
}