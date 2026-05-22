"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Hash, Printer, Scissors } from "lucide-react";
export default function Page(){
const[seamFt,sS]=useState("");const[spi,sSpi]=useState("12");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const sf=parseFloat(seamFt)||0;const sp=parseFloat(spi)||12;const totalStitches=Math.round(sf*12*sp);const hasResult=sf>0;const resultValue=totalStitches.toLocaleString()+" stitches";const resultLabel=sf+" ft × "+sp+" SPI";
const faqItems=[{q:"Why count stitches?",a:"Helps estimate thread usage and machine wear. Also useful for machine embroidery planning."}];
return(<div className="container"><Breadcrumb items={[{label:"Machine",href:"/machine"},{label:"Stitch Count Estimator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Hash size={14} strokeWidth={1.5} /> Machine #445</span><h1>Stitch Count Estimator</h1><p>Total stitches in a project.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Total seam length (ft)</label><input type="number" className="input-field" placeholder="50" value={seamFt} onChange={e=>sS(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Stitches per inch</label><input type="number" className="input-field" value={spi} onChange={e=>sSpi(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/machine" className="related-tool-link"><Scissors size={13} /> All Machine</a></div></aside></div></div>);}