"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer } from "lucide-react";
export default function Page(){
const[bs,sBs]=useState("");const[cornerPct,sCP]=useState("25");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const b=parseFloat(bs)||0;const p=parseFloat(cornerPct)||25;const corner=Math.ceil((b*p/100+0.5)*8)/8;const hasResult=b>0;const resultValue=corner+"\" corner squares";const resultLabel="for "+b+"\" snowball block";
const faqItems=[{q:"When do I use snowball blocks?",a:"To soften corners of squares or create curved-looking designs."}];
return(<div className="container"><Breadcrumb items={[{label:"Quilt Tools",href:"/quilt"},{label:"Snowball Block Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Quilt #150</span><h1>Snowball Block Calculator</h1><p>Corner square sizes.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Block size</label><input type="number" className="input-field" placeholder="12" value={bs} onChange={e=>sBs(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Corner %</label><select className="input-field" value={cornerPct} onChange={e=>sCP(e.target.value)}><option value="20">20% (small)</option><option value="25">25% (standard)</option><option value="33">33% (large)</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/quilt" className="related-tool-link"> All Quilt</a></div></aside></div></div>);}