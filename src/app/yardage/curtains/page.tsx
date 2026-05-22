"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Frame, Printer, Ruler, Shield } from "lucide-react";

export default function Page() {
  const [windowW,setWindowW]=useState("");const [windowH,setWindowH]=useState("");const [fullness,setFullness]=useState("2");const [panels,setPanels]=useState("2");
  const [fabricWidth, setFabricWidth] = useState("44.5");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const fw = parseFloat(fabricWidth) || 44.5;
  const ww=parseFloat(windowW)||0;const wh=parseFloat(windowH)||0;const full=parseFloat(fullness)||2;const np=parseInt(panels)||2;const panelW=(ww*full)/np;const panelH=wh+8;const totalLen=np*panelH;const resultYards=Math.ceil((totalLen/36)*8)/8;const resultLabel=np+" panels at "+panelW.toFixed(0)+"x"+panelH.toFixed(0);const hasResult=ww>0&&wh>0;

  const faqItems = [{q:"What fullness ratio should I use?",a:"Standard is 2x. Use 1.5x for casual, 2.5-3x for formal pleated drapes."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Yardage Calculators",href:"/yardage"},{label:"Curtain/Drape Yardage Calculator"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><Frame size={14} strokeWidth={1.5} /> Yardage Tool</span>
            <h1>Curtain/Drape Yardage Calculator</h1>
            <p>Yardage for curtains by window size and fullness.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Dimensions</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label" htmlFor="ww">Window width (in)</label><input id="ww" type="number" className="input-field" placeholder="e.g., 72" value={windowW} onChange={e=>setWindowW(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label" htmlFor="wh">Desired length (in)</label><input id="wh" type="number" className="input-field" placeholder="e.g., 84" value={windowH} onChange={e=>setWindowH(e.target.value)} min="0"/></div></div><div className="calculator-form-row"><div className="input-group"><label className="input-label">Fullness</label><select className="input-field" value={fullness} onChange={e=>setFullness(e.target.value)}><option value="1.5">1.5x (minimal)</option><option value="2">2x (standard)</option><option value="2.5">2.5x (full)</option><option value="3">3x (luxurious)</option></select></div><div className="input-group"><label className="input-label" htmlFor="np">Panels</label><input id="np" type="number" className="input-field" value={panels} onChange={e=>setPanels(e.target.value)} min="1"/></div></div>
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
                  <div className={styles.resultRow}><span>Panel width</span><strong>{panelW.toFixed(0)}&quot;</strong></div>
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