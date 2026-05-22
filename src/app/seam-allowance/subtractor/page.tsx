"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ArrowLeftRight, ClipboardCopy, Minus, Plus, Printer } from "lucide-react";

export default function Page() {
  const [cutting,setCutting]=useState("");const [sa,setSa]=useState("0.625");const [sides,setSides]=useState("2");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const cut=parseFloat(cutting)||0;const seam=parseFloat(sa)||0.625;const s=parseInt(sides)||2;const finished=cut-(seam*s);const hasResult=cut>0;const resultValue=finished.toFixed(3)+"\"";const resultLabel="finished measurement ("+cut+"\" - "+seam+"\" × "+s+" sides)";

  const faqItems = [{q:"Why would I subtract seam allowance?",a:"To check if a patterns finished dimensions match your needs, or when adapting a pattern with SA already included."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Seam Allowance Tools",href:"/seam-allowance"},{label:"Seam Allowance Subtractor"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><Minus size={14} strokeWidth={1.5} /> Seam Tool</span>
            <h1>Seam Allowance Subtractor</h1>
            <p>Remove seam allowance from cutting measurements to find finished dimensions.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label" htmlFor="cut">Cutting measurement (in)</label><input id="cut" type="number" className="input-field" placeholder="e.g., 16.25" value={cutting} onChange={e=>setCutting(e.target.value)} min="0" step="0.125"/></div><div className="input-group"><label className="input-label">Seam allowance</label><select className="input-field" value={sa} onChange={e=>setSa(e.target.value)}><option value="0.25">1/4&quot;</option><option value="0.375">3/8&quot;</option><option value="0.5">1/2&quot;</option><option value="0.625">5/8&quot;</option><option value="1">1&quot;</option></select></div></div><div className="input-group"><label className="input-label">Sides to remove SA</label><select className="input-field" value={sides} onChange={e=>setSides(e.target.value)}><option value="1">1 side</option><option value="2">2 sides</option><option value="4">4 sides</option></select></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Cutting size</span><strong>{cut}&quot;</strong></div><div className={styles.resultRow}><span>SA removed</span><strong>-{(seam*s).toFixed(3)}&quot;</strong></div><div className={styles.resultRow}><span>Finished</span><strong>{finished.toFixed(3)}&quot;</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/seam-allowance/adder" className="related-tool-link"><Plus size={13} /> Adder</a><a href="/seam-allowance/converter" className="related-tool-link"><ArrowLeftRight size={13} /> Converter</a></div></aside>
      </div>
    </div>
  );
}