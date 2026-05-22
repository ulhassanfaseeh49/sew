"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Ruler, Shirt } from "lucide-react";
export default function Page(){
const[height,sH]=useState("65");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const h=parseFloat(height)||65;const waistToFloor=h*0.57;const mini=Math.round(waistToFloor*0.38);const midi=Math.round(waistToFloor*0.7);const maxi=Math.round(waistToFloor-1);const hasResult=true;const resultValue="mini: "+mini+"\" | midi: "+midi+"\" | maxi: "+maxi+"\"";const resultLabel="based on "+h+"\" height";
const faqItems=[{q:"What length is most flattering?",a:"Midi length (below knee) is universally flattering. Mini works best on taller frames."}];
return(<div className="container"><Breadcrumb items={[{label:"Skirt",href:"/skirt"},{label:"Maxi vs Midi vs Mini"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Skirt #363</span><h1>Maxi vs Midi vs Mini</h1><p>Compare skirt lengths.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Your height (in)</label><input type="number" className="input-field" value={height} onChange={e=>sH(e.target.value)}/></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Mini (above knee)</span><strong>{mini}&quot;</strong></div><div className={styles.resultRow}><span>Midi (below knee)</span><strong>{midi}&quot;</strong></div><div className={styles.resultRow}><span>Maxi (ankle)</span><strong>{maxi}&quot;</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/skirt" className="related-tool-link"><Shirt size={13} /> All Skirts</a></div></aside></div></div>);}