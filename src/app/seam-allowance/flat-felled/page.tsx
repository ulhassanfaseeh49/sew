"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Scale, Shirt } from "lucide-react";

export default function Page() {
  const [finishedWidth,setFinishedWidth]=useState("0.25");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const fw=parseFloat(finishedWidth)||0.25;const sideA=fw+0.25;const sideB=fw*2+0.25;const hasResult=true;const resultValue="Side A: "+sideA.toFixed(3)+"\" / Side B: "+sideB.toFixed(3)+"\"";const resultLabel="flat-felled seam allowances (asymmetric)";

  const faqItems = [{q:"Where are flat-felled seams used?",a:"Jeans, menswear, sportswear, and any garment needing durable, flat, enclosed seams."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Seam Allowance Tools",href:"/seam-allowance"},{label:"Flat-Felled Seam Calculator"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><Shirt size={14} strokeWidth={1.5} /> Seam Tool</span>
            <h1>Flat-Felled Seam Calculator</h1>
            <p>Calculate seam allowance for flat-felled seams.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="input-group"><label className="input-label">Finished topstitch width</label><select className="input-field" value={finishedWidth} onChange={e=>setFinishedWidth(e.target.value)}><option value="0.25">1/4&quot; (standard)</option><option value="0.375">3/8&quot; (wide)</option><option value="0.5">1/2&quot; (extra wide)</option></select></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Trimmed side (A)</span><strong>{sideA.toFixed(3)}&quot; — trimmed to 1/8&quot; after first stitch</strong></div><div className={styles.resultRow}><span>Folding side (B)</span><strong>{sideB.toFixed(3)}&quot; — folds over and topstitched</strong></div><div className={styles.resultRow}><span>Finished width</span><strong>{fw}&quot;</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/seam-allowance/french-seam" className="related-tool-link">🇫🇷 French Seam</a><a href="/seam-allowance/finish-comparison" className="related-tool-link"><Scale size={13} /> Compare</a></div></aside>
      </div>
    </div>
  );
}