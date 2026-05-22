"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Scissors } from "lucide-react";
export default function Page(){
const[stitches,sS]=useState("");const[colors,sC]=useState("5");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const s=parseInt(stitches)||0;const c=parseInt(colors)||5;const meters=s*0.025;const perColor=meters/c;const hasResult=s>0;const resultValue=Math.ceil(meters)+"m total thread";const resultLabel="~"+Math.ceil(perColor)+"m per color ("+c+" colors)";
const faqItems=[{q:"How much thread per 1000 stitches?",a:"About 25 meters per 1000 stitches, but varies by stitch type and density."}];
return(<div className="container"><Breadcrumb items={[{label:"Embroidery",href:"/embroidery"},{label:"Thread Coverage Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} strokeWidth={1.5} /> Embroidery #309</span><h1>Thread Coverage Calculator</h1><p>Estimate thread for embroidery designs.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Total stitch count</label><input type="number" className="input-field" placeholder="15000" value={stitches} onChange={e=>sS(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Number of colors</label><input type="number" className="input-field" value={colors} onChange={e=>sC(e.target.value)} min="1"/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/embroidery" className="related-tool-link"><Scissors size={13} /> All Embroidery</a></div></aside></div></div>);}