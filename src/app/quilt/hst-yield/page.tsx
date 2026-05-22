"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { BarChart3, ClipboardCopy, Printer } from "lucide-react";
export default function Page(){
const[sq,sSq]=useState("");const[method,sM]=useState("2");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const s=parseFloat(sq)||0;const mt=parseInt(method)||2;const finSize=mt===2?s-0.875:mt===4?s/2-0.5:s/2-0.5;const hasResult=s>0;const resultValue=mt+" HSTs at "+finSize.toFixed(2)+"\"";const resultLabel="from "+s+"\" squares";
const faqItems=[{q:"Which HST method is best?",a:"2-at-a-time for precision, 8-at-a-time for speed."}];
return(<div className="container"><Breadcrumb items={[{label:"Quilt Tools",href:"/quilt"},{label:"HST Yield Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><BarChart3 size={14} strokeWidth={1.5} /> Quilt #147</span><h1>HST Yield Calculator</h1><p>How many HSTs from a given square.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Square size</label><input type="number" className="input-field" placeholder="5" value={sq} onChange={e=>sSq(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Method</label><select className="input-field" value={method} onChange={e=>sM(e.target.value)}><option value="2">2 at a time</option><option value="4">4 at a time</option><option value="8">8 at a time</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/quilt" className="related-tool-link"> All Quilt</a></div></aside></div></div>);}