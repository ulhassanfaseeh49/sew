"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

export default function Page() {
  const [apronType,setApronType]=useState("full");
  const [fabricWidth, setFabricWidth] = useState("44.5");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const fw = parseFloat(fabricWidth) || 44.5;
  const yardageMap: Record<string,number>={full:1.25,half:0.75,bistro:1,cobbler:1.5,child:0.75};const resultYards=yardageMap[apronType]||1;const resultLabel=apronType+" apron";const hasResult=true;

  const faqItems = [{q:"How much fabric for a full apron?",a:"A full bib apron needs about 1.25 yards including pockets and ties."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Yardage Calculators",href:"/yardage"},{label:"Apron Yardage Calculator"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span>👨‍🍳</span> Yardage Tool #63</span>
            <h1>Apron Yardage Calculator</h1>
            <p>Yardage for aprons by style.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Dimensions</h2>
            <div className="calculator-form">
              <div className="input-group"><label className="input-label">Apron style</label><select className="input-field" value={apronType} onChange={e=>setApronType(e.target.value)}><option value="full">Full apron (bib)</option><option value="half">Half apron (waist)</option><option value="bistro">Bistro</option><option value="cobbler">Cobbler</option><option value="child">Child&apos;s apron</option></select></div>
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