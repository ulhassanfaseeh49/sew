"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Ruler, Shield } from "lucide-react";

export default function Page() {
  const [pilSize,setPilSize]=useState("18");const [qty,setQty]=useState("2");
  const [fabricWidth, setFabricWidth] = useState("44.5");
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const fw = parseFloat(fabricWidth) || 44.5;
  const ps=parseFloat(pilSize)||18;const q=parseInt(qty)||1;const cutSize=ps+1;const totalPieces=q*2;const across=Math.floor(fw/cutSize);const rows=across>0?Math.ceil(totalPieces/across):0;const totalLen=rows*cutSize;const resultYards=Math.ceil((totalLen/36)*8)/8;const resultLabel=q+" pillow(s) at "+ps+"\"";const hasResult=true;

  const faqItems = [{q:"How much fabric for a throw pillow?",a:"An 18-inch pillow needs about half a yard for front and back."}];

  return (
    <div className="container">
      <Breadcrumb items={[{label:"Yardage Calculators",href:"/yardage"},{label:"Pillow/Cushion Yardage Calculator"}]} />
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className={styles.toolHeader}>
            <span className="category-badge"><span></span> Yardage Tool</span>
            <h1>Pillow/Cushion Yardage Calculator</h1>
            <p>Yardage for throw pillows of any size.</p>
          </div>
          <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Enter Dimensions</h2>
            <div className="calculator-form">
              <div className="calculator-form-row"><div className="input-group"><label className="input-label">Pillow size</label><select className="input-field" value={pilSize} onChange={e=>setPilSize(e.target.value)}><option value="12">12&quot;</option><option value="14">14&quot;</option><option value="16">16&quot;</option><option value="18">18&quot;</option><option value="20">20&quot;</option><option value="24">24&quot;</option><option value="26">26&quot; (Euro)</option></select></div><div className="input-group"><label className="input-label" htmlFor="qty">Quantity</label><input id="qty" type="number" className="input-field" value={qty} onChange={e=>setQty(e.target.value)} min="1"/></div></div>
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