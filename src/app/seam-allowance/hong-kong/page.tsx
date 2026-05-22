"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Ribbon, Shirt } from "lucide-react";

export default function Page() {
  const [saWidth,setSaWidth]=useState("0.625");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const sa=parseFloat(saWidth)||0.625;const biasStripWidth=sa+0.5;const biasStripCut=biasStripWidth*2;const hasResult=true;const resultValue=biasStripCut.toFixed(2)+"\" bias strip cut width";const resultLabel="Hong Kong finish for "+sa+"\" seam allowance";

  const faqItems = [{q:"What is a Hong Kong seam finish?",a:"A couture technique where bias strips wrap around raw seam allowance edges for a clean, professional inside finish."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Seam Allowance Tools",href:"/seam-allowance"},{label:"Hong Kong Seam Finish Calculator"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><Ribbon size={14} strokeWidth={1.5} /> Seam Tool</span>
            <h1>Hong Kong Seam Finish Calculator</h1>
            <p>Calculate bias strip width and SA for Hong Kong seam finishes.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="input-group"><label className="input-label">Seam allowance width</label><select className="input-field" value={saWidth} onChange={e=>setSaWidth(e.target.value)}><option value="0.375">3/8&quot;</option><option value="0.5">1/2&quot;</option><option value="0.625">5/8&quot;</option><option value="1">1&quot;</option></select></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Seam allowance</span><strong>{sa}&quot;</strong></div><div className={styles.resultRow}><span>Cut bias strip</span><strong>{biasStripCut.toFixed(2)}&quot; wide</strong></div><div className={styles.resultRow}><span>Finished binding width</span><strong>~{(biasStripCut/4).toFixed(2)}&quot;</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/seam-allowance/french-seam" className="related-tool-link">🇫🇷 French Seam</a><a href="/seam-allowance/flat-felled" className="related-tool-link"><Shirt size={13} /> Flat-Felled</a></div></aside>
      </div>
    </div>
  );
}