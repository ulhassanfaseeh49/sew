"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Scale, Shirt } from "lucide-react";

export default function Page() {
  
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const finishes=[{name:"Serged/Overlocked",time:"Fast",cost:"Requires serger",best:"Everyday garments"},{name:"Zigzag stitch",time:"Fast",cost:"Any machine",best:"Casual garments, knits"},{name:"Pinked edges",time:"Fast",cost:"Pinking shears",best:"Non-fraying fabrics"},{name:"French seam",time:"Medium",cost:"No extra tools",best:"Sheers, unlined garments"},{name:"Flat-felled seam",time:"Medium",cost:"No extra tools",best:"Jeans, sportswear"},{name:"Hong Kong finish",time:"Slow",cost:"Bias strips",best:"Couture, unlined jackets"},{name:"Bound with bias tape",time:"Slow",cost:"Bias tape",best:"Heavy fabrics, coats"}];const hasResult=true;const resultValue=finishes.length+" seam finishes";const resultLabel="comparison reference";

  const faqItems = [{q:"Which seam finish is best?",a:"It depends on fabric type, garment style, and available tools. French seams for sheers, serging for everyday, Hong Kong for couture."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Seam Allowance Tools",href:"/seam-allowance"},{label:"Seam Finish Comparison Guide"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><Scale size={14} strokeWidth={1.5} /> Seam Tool</span>
            <h1>Seam Finish Comparison Guide</h1>
            <p>Compare all seam finish types side by side.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Details</h2>
            <div className="calculator-form">
              
            </div>
            {hasResult && (
              <div className={`calculator-results ${styles.results}`}>
                <div className="result-card"><div className="result-value">{resultValue}</div>
                  <div className="result-label">{resultLabel}</div></div>
                <div className={styles.resultDetails}>
                  {finishes.map(f=>(<div key={f.name} className={styles.resultRow} style={{flexDirection:"column",alignItems:"flex-start",gap:"0.25rem"}}><strong>{f.name}</strong><span style={{fontSize:"0.85rem"}}>⏱ {f.time} ·  {f.cost} ·  Best for: {f.best}</span></div>))}
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