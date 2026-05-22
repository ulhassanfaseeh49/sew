"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Ribbon, Shirt } from "lucide-react";

export default function Page() {
  const [finishedWidth,setFinishedWidth]=useState("0.25");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const fw=parseFloat(finishedWidth)||0.25;const firstPass=0.375;const secondPass=fw;const totalSA=firstPass+secondPass;const hasResult=true;const resultValue=totalSA.toFixed(3)+"\" total SA per side";const resultLabel="French seam: "+firstPass+"\" first pass + "+fw+"\" second pass";

  const faqItems = [{q:"When should I use French seams?",a:"For sheer fabrics, unlined garments, or any time you want fully enclosed raw edges for a clean finish."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Seam Allowance Tools",href:"/seam-allowance"},{label:"French Seam Calculator"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>🇫🇷</span> Seam Tool</span>
            <h1>French Seam Calculator</h1>
            <p>Calculate seam allowance for French seams: two-pass enclosed construction.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="input-group"><label className="input-label">Desired finished French seam width</label><select className="input-field" value={finishedWidth} onChange={e=>setFinishedWidth(e.target.value)}><option value="0.1875">3/16&quot; (narrow)</option><option value="0.25">1/4&quot; (standard)</option><option value="0.375">3/8&quot; (wide)</option></select></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>First stitch (wrong sides together)</span><strong>{firstPass}&quot; from edge</strong></div><div className={styles.resultRow}><span>Trim to</span><strong>1/8&quot;</strong></div><div className={styles.resultRow}><span>Second stitch (right sides together)</span><strong>{secondPass}&quot; from fold</strong></div><div className={styles.resultRow}><span>Total seam allowance needed</span><strong>{totalSA.toFixed(3)}&quot; ({(totalSA*2.54).toFixed(1)} cm)</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/seam-allowance/flat-felled" className="related-tool-link"><Shirt size={13} /> Flat-Felled</a><a href="/seam-allowance/hong-kong" className="related-tool-link"><Ribbon size={13} /> Hong Kong</a></div></aside>
      </div>
    </div>
  );
}