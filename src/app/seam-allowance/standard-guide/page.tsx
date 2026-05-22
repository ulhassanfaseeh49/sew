"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [project,setProject]=useState("garment");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const guides: Record<string,{sa:string,cm:string,notes:string}>={garment:{sa:"5/8\"",cm:"1.5 cm",notes:"Standard for most commercial patterns. Allows for fitting adjustments."},quilting:{sa:"1/4\"",cm:"0.6 cm",notes:"Standard for patchwork. Use a quarter-inch presser foot for accuracy."},homedecor:{sa:"1/2\"",cm:"1.3 cm",notes:"Common for pillows, curtains, and home decor items."},bagmaking:{sa:"3/8\" to 1/2\"",cm:"1.0-1.3 cm",notes:"Varies by pattern. Heavier fabrics may use 1/2\"."},dollclothes:{sa:"1/4\"",cm:"0.6 cm",notes:"Small scale requires narrow seam allowances to reduce bulk."},knit:{sa:"1/4\" to 3/8\"",cm:"0.6-1.0 cm",notes:"Narrower because knits stretch. Use a stretch stitch."}};const g=guides[project]||guides.garment;const hasResult=true;const resultValue=g.sa;const resultLabel=project+" standard seam allowance";

  const faqItems = [{q:"Can I change the seam allowance on a pattern?",a:"Yes, but you must adjust all pattern pieces consistently and re-mark any notches."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Seam Allowance Tools",href:"/seam-allowance"},{label:"Standard Seam Allowance Guide"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>📖</span> Seam Tool #86</span>
            <h1>Standard Seam Allowance Guide</h1>
            <p>Interactive guide showing standard seam allowances by project type.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="input-group"><label className="input-label">Project type</label><select className="input-field" value={project} onChange={e=>setProject(e.target.value)}><option value="garment">Garment sewing</option><option value="quilting">Quilting</option><option value="homedecor">Home decor</option><option value="bagmaking">Bag making</option><option value="dollclothes">Doll clothes</option><option value="knit">Knit fabrics</option></select></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Imperial</span><strong>{g.sa}</strong></div><div className={styles.resultRow}><span>Metric</span><strong>{g.cm}</strong></div><div className={styles.resultRow}><span>Notes</span><strong style={{fontWeight:"normal",fontSize:"0.85rem"}}>{g.notes}</strong></div>
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
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/seam-allowance/comparison" className="related-tool-link">📊 Comparison</a><a href="/seam-allowance/converter" className="related-tool-link">↔️ Converter</a></div></aside>
      </div>
    </div>
  );
}