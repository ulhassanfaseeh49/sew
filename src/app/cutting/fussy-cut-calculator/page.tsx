"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Scissors, Target } from "lucide-react";
export default function Page(){
const[motifW,sW]=useState("");const[motifH,sH]=useState("");const[repeat,sR]=useState("");const[qty,sQ]=useState("4");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const mw=parseFloat(motifW)||0;const mh=parseFloat(motifH)||0;const r=parseFloat(repeat)||mh;const q=parseInt(qty)||4;const rows=q;const totalLen=rows*r;const yd=Math.ceil((totalLen/36)*8)/8;const hasResult=mw>0&&mh>0;const resultValue=yd+" yards";const resultLabel=q+" fussy-cut motifs with "+r+"\" repeat";
const faqItems=[{q:"What is fussy cutting?",a:"Centering a specific motif or design within each cut piece. Uses more fabric but creates stunning effects."}];
return(<div className="container"><Breadcrumb items={[{label:"Cutting Tools",href:"/cutting"},{label:"Fussy Cut Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Target size={14} strokeWidth={1.5} /> Cutting #179</span><h1>Fussy Cut Calculator</h1><p>Yardage for fussy cutting specific motifs.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Motif W</label><input type="number" className="input-field" placeholder="6" value={motifW} onChange={e=>sW(e.target.value)}/></div><div className="input-group"><label className="input-label">Motif H</label><input type="number" className="input-field" placeholder="6" value={motifH} onChange={e=>sH(e.target.value)}/></div></div><div className="calculator-form-row"><div className="input-group"><label className="input-label">Repeat (in)</label><input type="number" className="input-field" placeholder="12" value={repeat} onChange={e=>sR(e.target.value)}/></div><div className="input-group"><label className="input-label">Qty needed</label><input type="number" className="input-field" value={qty} onChange={e=>sQ(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/cutting" className="related-tool-link"><Scissors size={13} /> All Cutting</a></div></aside></div></div>);}