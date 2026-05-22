"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Flag, Printer, Ruler, Shield } from "lucide-react";

export default function Page() {
  const [flagW,setFlagW]=useState("");const [flagH,setFlagH]=useState("");const [qty,setQty]=useState("1");
  const [fabricWidth, setFabricWidth] = useState("44.5");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const fw = parseFloat(fabricWidth) || 44.5;
  const fW=parseFloat(flagW)||0;const fH=parseFloat(flagH)||0;const q=parseInt(qty)||1;const cutW=fW+2;const cutH=fH+2;const across=Math.floor(fw/cutW);const rows=across>0?Math.ceil(q/across):0;const totalLen=rows*cutH;const resultYards=Math.ceil((totalLen/36)*8)/8;const resultLabel=q+" flag(s) at "+fW+"x"+fH;const hasResult=fW>0&&fH>0;

  const faqItems = [{q:"What fabric for outdoor flags?",a:"Nylon or polyester for durability. Cotton for indoor decorative flags."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Yardage Calculators",href:"/yardage"},{label:"Flag/Banner Yardage Calculator"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><Flag size={14} strokeWidth={1.5} /> Yardage Tool</span>
            <h1>Flag/Banner Yardage Calculator</h1>
            <p>Yardage for flags, banners, and bunting.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Dimensions</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label" htmlFor="fw2">Flag width (in)</label><input id="fw2" type="number" className="input-field" placeholder="e.g., 36" value={flagW} onChange={e=>setFlagW(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label" htmlFor="fh">Flag height (in)</label><input id="fh" type="number" className="input-field" placeholder="e.g., 24" value={flagH} onChange={e=>setFlagH(e.target.value)} min="0"/></div></div><div className="input-group"><label className="input-label" htmlFor="q">Quantity</label><input id="q" type="number" className="input-field" value={qty} onChange={e=>setQty(e.target.value)} min="1"/></div>
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