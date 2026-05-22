"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Cloud, Printer, Ruler, Shield } from "lucide-react";

export default function Page() {
  const [quiltW,setQuiltW]=useState("");const [quiltH,setQuiltH]=useState("");const [overhang,setOverhang]=useState("4");
  const [fabricWidth, setFabricWidth] = useState("44.5");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const fw = parseFloat(fabricWidth) || 44.5;
  const qw=parseFloat(quiltW)||0;const qh=parseFloat(quiltH)||0;const oh=parseFloat(overhang)||4;const batW=qw+oh*2;const batH=qh+oh*2;const sizes=[{n:"Crib",w:45,h:60},{n:"Twin",w:72,h:90},{n:"Full",w:81,h:96},{n:"Queen",w:90,h:108},{n:"King",w:120,h:120}];const bestFit=sizes.find(s=>s.w>=batW&&s.h>=batH);const resultYards=Math.ceil(((batW*batH)/(fw*36))*8)/8;const resultLabel=batW.toFixed(0)+"x"+batH.toFixed(0)+" batting needed";const hasResult=qw>0&&qh>0;

  const faqItems = [{q:"What standard batting sizes are available?",a:"Crib 45x60, Twin 72x90, Full 81x96, Queen 90x108, King 120x120 inches."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Yardage Calculators",href:"/yardage"},{label:"Quilt Batting Size Calculator"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><Cloud size={14} strokeWidth={1.5} /> Yardage Tool</span>
            <h1>Quilt Batting Size Calculator</h1>
            <p>Batting size with overhang vs standard sizes.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Dimensions</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label" htmlFor="qw">Quilt width (in)</label><input id="qw" type="number" className="input-field" placeholder="e.g., 60" value={quiltW} onChange={e=>setQuiltW(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label" htmlFor="qh">Quilt height (in)</label><input id="qh" type="number" className="input-field" placeholder="e.g., 80" value={quiltH} onChange={e=>setQuiltH(e.target.value)} min="0"/></div></div><div className="input-group"><label className="input-label" htmlFor="oh">Overhang (in)</label><input id="oh" type="number" className="input-field" value={overhang} onChange={e=>setOverhang(e.target.value)} min="0"/></div>
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
                  <div className={styles.resultRow}><span>Batting size</span><strong>{batW.toFixed(0)}&quot; x {batH.toFixed(0)}&quot;</strong></div>{bestFit&&<div className={styles.resultRow}><span>Nearest standard</span><strong>{bestFit.n} ({bestFit.w}&quot;x{bestFit.h}&quot;)</strong></div>}
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