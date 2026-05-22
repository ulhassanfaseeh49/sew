"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [tableL,setTableL]=useState("");const [tableW,setTableW]=useState("");const [drop,setDrop]=useState("10");
  const [fabricWidth, setFabricWidth] = useState("44.5");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const fw = parseFloat(fabricWidth) || 44.5;
  const tl=parseFloat(tableL)||0;const tw=parseFloat(tableW)||0;const dr=parseFloat(drop)||10;const clothL=tl+dr*2;const clothW=tw+dr*2;const widthsNeeded=Math.ceil(clothW/fw);const totalLen=widthsNeeded*clothL;const resultYards=Math.ceil((totalLen/36)*8)/8;const resultLabel=clothL.toFixed(0)+"x"+clothW.toFixed(0)+" tablecloth";const hasResult=tl>0&&tw>0;

  const faqItems = [{q:"What drop length should I use?",a:"Casual: 6 inches, Standard: 8-10 inches, Formal: 15 inches, Floor-length: 29-30 inches."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Yardage Calculators",href:"/yardage"},{label:"Tablecloth Yardage Calculator"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>🍽️</span> Yardage Tool #56</span>
            <h1>Tablecloth Yardage Calculator</h1>
            <p>Yardage for tablecloths by table size and drop.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Dimensions</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label" htmlFor="tl">Table length (in)</label><input id="tl" type="number" className="input-field" placeholder="e.g., 60" value={tableL} onChange={e=>setTableL(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label" htmlFor="tw">Table width (in)</label><input id="tw" type="number" className="input-field" placeholder="e.g., 36" value={tableW} onChange={e=>setTableW(e.target.value)} min="0"/></div></div><div className="input-group"><label className="input-label">Drop length</label><select className="input-field" value={drop} onChange={e=>setDrop(e.target.value)}><option value="6">6&quot; (casual)</option><option value="10">10&quot; (standard)</option><option value="15">15&quot; (formal)</option><option value="29">29&quot; (floor)</option></select></div>
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
                  <div className={styles.resultRow}><span>Cloth size</span><strong>{clothL.toFixed(0)}&quot; x {clothW.toFixed(0)}&quot;</strong></div>
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