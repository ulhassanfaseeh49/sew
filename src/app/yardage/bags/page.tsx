"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Ruler, Shield, ShoppingBag } from "lucide-react";

export default function Page() {
  const [bagType,setBagType]=useState("tote");
  const [fabricWidth, setFabricWidth] = useState("44.5");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const fw = parseFloat(fabricWidth) || 44.5;
  const yardageMap: Record<string,{main:number,lining:number}>={tote:{main:1,lining:0.75},crossbody:{main:0.75,lining:0.5},backpack:{main:1.5,lining:1},clutch:{main:0.5,lining:0.25},drawstring:{main:0.75,lining:0},duffel:{main:2,lining:1.5}};const yds=yardageMap[bagType]||{main:1,lining:0.75};const resultYards=Math.ceil(yds.main*8)/8;const resultLabel=bagType+" — outer fabric";const hasResult=true;

  const faqItems = [{q:"How much fabric for a tote?",a:"A standard tote needs about 1 yard outer and 3/4 yard lining."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Yardage Calculators",href:"/yardage"},{label:"Bag/Tote Yardage Calculator"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><ShoppingBag size={14} strokeWidth={1.5} /> Yardage Tool</span>
            <h1>Bag/Tote Yardage Calculator</h1>
            <p>Yardage for bags, totes, and purses.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Dimensions</h2>
            <div className="calculator-form">
              <div className="input-group"><label className="input-label">Bag type</label><select className="input-field" value={bagType} onChange={e=>setBagType(e.target.value)}><option value="tote">Tote bag</option><option value="crossbody">Crossbody</option><option value="backpack">Backpack</option><option value="clutch">Clutch</option><option value="drawstring">Drawstring</option><option value="duffel">Duffel</option></select></div>
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
                  <div className={styles.resultRow}><span>Lining</span><strong>{(yardageMap[bagType]||{lining:0.75}).lining.toFixed(2)} yd</strong></div>
                </div>
                <div className="toolbar">
                  <button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultYards.toFixed(3)+' yards')}><ClipboardCopy size={13} /> Copy</button>
                  <button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button>
                </div>
              </div>
            )}
          </div>
          <section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div>
        <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/yardage/basic-calculator" className="related-tool-link"><Ruler size={13} /> Basic Yardage</a><a href="/yardage/buffer-calculator" className="related-tool-link"><Shield size={13} /> Buffer</a></div></aside>
      </div>
    </div>
  );
}