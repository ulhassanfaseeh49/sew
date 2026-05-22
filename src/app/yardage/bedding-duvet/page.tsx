"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [bedSize,setBedSize]=useState("queen");const [dropSide,setDropSide]=useState("12");
  const [fabricWidth, setFabricWidth] = useState("44.5");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const fw = parseFloat(fabricWidth) || 44.5;
  const dims: Record<string,[number,number]>={twin:[68,86],full:[86,86],queen:[92,96],king:[110,96]};const[dw,dh]=dims[bedSize]||[92,96];const ds=parseFloat(dropSide)||12;const coverW=dw+ds*2;const coverH=dh+ds;const widthsNeeded=Math.ceil(coverW/fw);const totalLen=widthsNeeded*coverH*2;const resultYards=Math.ceil((totalLen/36)*8)/8;const resultLabel=bedSize+" duvet cover (front+back)";const hasResult=true;

  const faqItems = [{q:"What size duvet do I need?",a:"Twin 68x86, Full 86x86, Queen 92x96, King 110x96 inches."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Yardage Calculators",href:"/yardage"},{label:"Bedding/Duvet Yardage Calculator"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>🛌</span> Yardage Tool #58</span>
            <h1>Bedding/Duvet Yardage Calculator</h1>
            <p>Yardage for duvet covers and bedspreads.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Dimensions</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label">Bed size</label><select className="input-field" value={bedSize} onChange={e=>setBedSize(e.target.value)}><option value="twin">Twin</option><option value="full">Full</option><option value="queen">Queen</option><option value="king">King</option></select></div><div className="input-group"><label className="input-label" htmlFor="ds">Side drop (in)</label><input id="ds" type="number" className="input-field" value={dropSide} onChange={e=>setDropSide(e.target.value)} min="0"/></div></div>
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
                  <div className={styles.resultRow}><span>Cover size</span><strong>{coverW.toFixed(0)}&quot; x {coverH.toFixed(0)}&quot;</strong></div>
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