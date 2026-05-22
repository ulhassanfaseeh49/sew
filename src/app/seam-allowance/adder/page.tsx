"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ArrowLeftRight, ClipboardCopy, Minus, Plus, Printer } from "lucide-react";

export default function Page() {
  const [finished,setFinished]=useState("");const [sa,setSa]=useState("0.625");const [sides,setSides]=useState("2");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const fin=parseFloat(finished)||0;const seam=parseFloat(sa)||0.625;const s=parseInt(sides)||2;const cutting=fin+(seam*s);const hasResult=fin>0;const resultValue=cutting.toFixed(3)+"\"";const resultLabel="cutting measurement ("+fin+"\" + "+seam+"\" × "+s+" sides)";

  const faqItems = [{q:"When do I add seam allowance to 4 sides?",a:"For rectangular pieces like quilt blocks or cushion covers where all edges are seamed."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Seam Allowance Tools",href:"/seam-allowance"},{label:"Seam Allowance Adder"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><Plus size={14} strokeWidth={1.5} /> Seam Tool</span>
            <h1>Seam Allowance Adder</h1>
            <p>Add seam allowance to finished measurements for cutting dimensions.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label" htmlFor="fin">Finished measurement (in)</label><input id="fin" type="number" className="input-field" placeholder="e.g., 15" value={finished} onChange={e=>setFinished(e.target.value)} min="0" step="0.125"/></div><div className="input-group"><label className="input-label">Seam allowance</label><select className="input-field" value={sa} onChange={e=>setSa(e.target.value)}><option value="0.25">1/4&quot;</option><option value="0.375">3/8&quot;</option><option value="0.5">1/2&quot;</option><option value="0.625">5/8&quot;</option><option value="1">1&quot;</option></select></div></div><div className="input-group"><label className="input-label">Sides to add SA</label><select className="input-field" value={sides} onChange={e=>setSides(e.target.value)}><option value="1">1 side</option><option value="2">2 sides (both ends)</option><option value="4">4 sides (all around)</option></select></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Finished</span><strong>{fin}&quot;</strong></div><div className={styles.resultRow}><span>SA added</span><strong>+{(seam*s).toFixed(3)}&quot;</strong></div><div className={styles.resultRow}><span>Cutting size</span><strong>{cutting.toFixed(3)}&quot;</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/seam-allowance/subtractor" className="related-tool-link"><Minus size={13} /> Subtractor</a><a href="/seam-allowance/converter" className="related-tool-link"><ArrowLeftRight size={13} /> Converter</a></div></aside>
      </div>
    </div>
  );
}