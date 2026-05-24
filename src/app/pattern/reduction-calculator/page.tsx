"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Search } from "lucide-react";

export default function Page() {
 const [originalSize,setOriginalSize]=useState("");const [targetSize,setTargetSize]=useState("");
 const [activeFaq, setActiveFaq] = useState<number|null>(null);
 const os=parseFloat(originalSize)||0;const ts=parseFloat(targetSize)||0;const pct=os>0?(ts/os)*100:0;const hasResult=os>0&&ts>0;const resultValue=pct.toFixed(1)+"%";const resultLabel="reduce to "+pct.toFixed(1)+"% of original";

 const faqItems = [{q:"Will reducing a pattern affect seam allowances?",a:"Yes. Seam allowances scale too, so very small reductions (like doll clothes) may need adjusted SA."}];

 return (
 <div className="container">
 <Breadcrumb items={[{label:"Pattern Tools",href:"/pattern"},{label:"Pattern Reduction Calculator"}]} />
 <div className="calculator-layout">
 <div className="calculator-main">
 <div className={styles.toolHeader}>
 <span className="category-badge"><span></span>Pattern Tool</span>
 <h1>Pattern Reduction Calculator</h1>
 <p>Reduce patterns for storage, miniatures, or doll clothes.</p>
 </div>
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>Enter Details</h2>
 <div className="calculator-form">
 <div className="calculator-form-row"><div className="input-group"><label className="input-label" htmlFor="os">Original dimension (in)</label><input id="os" type="number" className="input-field" placeholder="e.g., 36" value={originalSize} onChange={e=>setOriginalSize(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label" htmlFor="ts">Target dimension (in)</label><input id="ts" type="number" className="input-field" placeholder="e.g., 9" value={targetSize} onChange={e=>setTargetSize(e.target.value)} min="0"/></div></div>
 </div>
 {hasResult && (
 <div className={`calculator-results ${styles.results}`}>
 <div className="result-card"><div className="result-value">{resultValue}</div>
 <div className="result-label">{resultLabel}</div></div>
 <div className={styles.resultDetails}>
 <div className={styles.resultRow}><span>Scale factor</span><strong>{(ts/os).toFixed(3)}x</strong></div><div className={styles.resultRow}><span>Reduction</span><strong>{(100-pct).toFixed(1)}% smaller</strong></div>
 </div>
 <div className="toolbar">
 <button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} />Copy</button>
 <button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} />Print</button>
 </div>
 </div>
 )}
 </div>
 <section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
 </div>
 <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/pattern/enlargement-calculator" className="related-tool-link"><Search size={13} />Enlargement</a><a href="/pattern/doll-clothes-scaler" className="related-tool-link">Doll Clothes</a></div></aside>
 </div>
 </div>
 );
}