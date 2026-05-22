"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Plus, Printer, Ruler, Shield } from "lucide-react";

export default function Page() {
  const [size, setSize] = useState("M");
  const [style, setStyle] = useState("Size 18-20");
  const [fabricWidth, setFabricWidth] = useState("44.5");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);

  const baseYd = 3.5;
  const sizeMult: Record<string,number> = {XS:0.8,S:0.9,M:1,L:1.1,XL:1.2,XXL:1.35};
  const widthMult: Record<string,number> = {"36":1.2,"44.5":1,"54":0.85,"60":0.78};
  const allStyles = ["Size 18-20","Size 22-24","Size 26-28","Size 30+"];
  const styleMult = 1 + (allStyles.indexOf(style) * 0.05);
  const mult = (sizeMult[size]||1) * (widthMult[fabricWidth]||1) * styleMult;
  const yardage = baseYd * mult;
  const rounded = Math.ceil(yardage * 8) / 8;
  const meters = rounded * 0.9144;

  const faqItems = [
    {q:"How accurate is this estimate?",a:"This provides a starting estimate. Always check your specific pattern yardage requirements when available."},
    {q:"Does fabric width affect yardage?",a:"Yes! Wider fabric lets pieces fit better across the width, reducing yardage needed."},
  ];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Yardage Calculators",href:"/yardage"},{label:"Plus-Size Yardage Adjuster"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><Plus size={14} strokeWidth={1.5} /> Yardage Tool</span>
            <h1>Plus-Size Yardage Adjuster</h1>
            <p>Adjust standard yardage for plus-size.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              <div className="calculator-form-row">
                <div className="input-group"><label className="input-label">Style</label>
                  <select className="input-field" value={style} onChange={e=>setStyle(e.target.value)}><option value="Size 18-20">Size 18-20</option><option value="Size 22-24">Size 22-24</option><option value="Size 26-28">Size 26-28</option><option value="Size 30+">Size 30+</option></select></div>
                <div className="input-group"><label className="input-label">Size</label>
                  <select className="input-field" value={size} onChange={e=>setSize(e.target.value)}>
                    <option value="XS">XS</option><option value="S">S</option><option value="M">M</option><option value="L">L</option><option value="XL">XL</option><option value="XXL">XXL</option>
                  </select></div>
              </div>
              <div className="input-group"><label className="input-label">Fabric width</label>
                <select className="input-field" value={fabricWidth} onChange={e=>setFabricWidth(e.target.value)}>
                  <option value="36">36&quot;</option><option value="44.5">44/45&quot;</option><option value="54">54&quot;</option><option value="60">60&quot;</option>
                </select></div>
            </div>
            <div className={`calculator-results ${styles.results}`}>
              <div className="result-card"><div className="result-value">{rounded.toFixed(3)} yards</div>
                <div className="result-label">{style} in size {size} on {fabricWidth}&quot; fabric</div></div>
              <div className={styles.resultDetails}>
                <div className={styles.resultRow}><span>Meters</span><strong>{meters.toFixed(2)} m</strong></div>
                <div className={styles.resultRow}><span>Base estimate</span><strong>{baseYd} yd</strong></div>
              </div>
              <div className="toolbar">
                <button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(style+" "+size+": "+rounded.toFixed(3)+" yd")}><ClipboardCopy size={13} /> Copy</button>
                <button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button>
              </div>
            </div>
          </div>
          <section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div>
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/yardage/basic-calculator" className="related-tool-link"><Ruler size={13} /> Basic Yardage</a><a href="/yardage/buffer-calculator" className="related-tool-link"><Shield size={13} /> Buffer</a></div></aside>
      </div>
    </div>
  );
}