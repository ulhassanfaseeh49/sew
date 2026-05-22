"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [tableLen,setTableLen]=useState("72");const [backdrop,setBackdrop]=useState("no");
  const [fabricWidth, setFabricWidth] = useState("44.5");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const fw = parseFloat(fabricWidth) || 44.5;
  const tl=parseFloat(tableLen)||72;const clothYd=Math.ceil(((tl+60)*(90+30))/(fw*36)*8)/8;const backdropYd=backdrop==="yes"?Math.ceil((96*tl)/(fw*36)*8)/8:0;const resultYards=Math.ceil((clothYd+backdropYd)*8)/8;const resultLabel="booth display"+(backdrop==="yes"?" with backdrop":"");const hasResult=true;

  const faqItems = [{q:"How much fabric for a booth?",a:"A 6ft table needs 3-4 yards for tablecloth. Add 6-8 yards for backdrop."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Yardage Calculators",href:"/yardage"},{label:"Booth Display Calculator"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>🏪</span> Yardage Tool #66</span>
            <h1>Booth Display Calculator</h1>
            <p>Yardage for craft fair booth displays.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Dimensions</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label" htmlFor="tl">Table length (in)</label><input id="tl" type="number" className="input-field" value={tableLen} onChange={e=>setTableLen(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Backdrop?</label><select className="input-field" value={backdrop} onChange={e=>setBackdrop(e.target.value)}><option value="no">No backdrop</option><option value="yes">Yes, 8ft backdrop</option></select></div></div>
              <div className="input-group"><label className="input-label">Fabric width</label>
                <select className="input-field" value={fabricWidth} onChange={e=>setFabricWidth(e.target.value)}>
                  <option value="44.5">44/45&quot;</option><option value="54">54&quot;</option><option value="60">60&quot;</option><option value="108">108&quot;</option>
                </select></div>
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultYards.toFixed(3)} yards</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  <div className={styles.resultRow}><span>Meters</span><strong>{(resultYards*0.9144).toFixed(2)} m</strong></div>
                  
                </div>
                <div className="toolbar">
                  <button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultYards.toFixed(3)+' yards')}>📋 Copy</button>
                  <button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button>
                </div>
              </div>
            )}
          </div>
          <section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div>
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/yardage/basic-calculator" className="related-tool-link">📐 Basic Yardage</a><a href="/yardage/buffer-calculator" className="related-tool-link">🛡️ Buffer</a></div></aside>
      </div>
    </div>
  );
}