"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Hash, Printer } from "lucide-react";
export default function Page(){
const[qw,sQW]=useState("60");const[qh,sQH]=useState("80");const[bs,sBs]=useState("12");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const w2=parseFloat(qw)||60;const h2=parseFloat(qh)||80;const b=parseFloat(bs)||12;const cols=Math.ceil(w2/b);const rows=Math.ceil(h2/b);const total=cols*rows;const hasResult=true;const resultValue=total+" blocks";const resultLabel=cols+" across x "+rows+" down";
const faqItems=[{q:"Should I add extra blocks?",a:"Make 1-2 extras in case of mistakes or for a matching pillow."}];
return(<div className="container"><Breadcrumb items={[{label:"Quilt Tools",href:"/quilt"},{label:"Blocks Needed Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Hash size={14} strokeWidth={1.5} /> Quilt #130</span><h1>Blocks Needed Calculator</h1><p>How many blocks for a specific quilt size.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Quilt width</label><input type="number" className="input-field" value={qw} onChange={e=>sQW(e.target.value)}/></div><div className="input-group"><label className="input-label">Quilt height</label><input type="number" className="input-field" value={qh} onChange={e=>sQH(e.target.value)}/></div><div className="input-group"><label className="input-label">Block size</label><input type="number" className="input-field" value={bs} onChange={e=>sBs(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Columns</span><strong>{cols}</strong></div><div className={styles.resultRow}><span>Rows</span><strong>{rows}</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/quilt" className="related-tool-link"> All Quilt</a></div></aside></div></div>);}