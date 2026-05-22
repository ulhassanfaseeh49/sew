"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { BarChart3, ClipboardCopy, Printer, Scissors } from "lucide-react";
export default function Page(){
const[relaxed,sR]=useState("");const[stretched,sS]=useState("");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const r=parseFloat(relaxed)||0;const s=parseFloat(stretched)||0;const pct=r>0?((s-r)/r*100):0;const hasResult=r>0&&s>0;const resultValue=pct.toFixed(0)+"% stretch";const resultLabel=r+"\" → "+s+"\" (gained "+(s-r).toFixed(1)+"\")";
const faqItems=[{q:"How do I measure stretch percentage?",a:"Cut a 4 inch swatch, stretch it, and measure. (Stretched - Original) / Original × 100."}];
return(<div className="container"><Breadcrumb items={[{label:"Stretch",href:"/stretch"},{label:"Stretch Percentage Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><BarChart3 size={14} strokeWidth={1.5} /> Stretch #299</span><h1>Stretch Percentage Calculator</h1><p>Calculate fabric stretch percentage.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Relaxed length (in)</label><input type="number" className="input-field" placeholder="4" value={relaxed} onChange={e=>sR(e.target.value)}/></div><div className="input-group"><label className="input-label">Stretched length (in)</label><input type="number" className="input-field" placeholder="6" value={stretched} onChange={e=>sS(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/stretch" className="related-tool-link"><Scissors size={13} /> All Stretch</a></div></aside></div></div>);}