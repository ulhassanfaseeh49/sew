"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { BarChart3, ClipboardCopy, Printer, Ribbon } from "lucide-react";
export default function Page(){
const[cutW,sC]=useState("");const[fold,sFd]=useState("double");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const cw=parseFloat(cutW)||0;const finW=fold==="double"?(cw-0.5)/4:(cw-0.5)/2;const hasResult=cw>0;const resultValue=finW.toFixed(3)+"\" finished visible";const resultLabel=cw+"\" cut → "+fold+"-fold binding";
const faqItems=[{q:"What is the visible binding width?",a:"The finished width you see on the edge. For 2.5 inch double-fold quilt binding, its about 1/2 inch."}];
return(<div className="container"><Breadcrumb items={[{label:"Bias Binding",href:"/bias-binding"},{label:"Binding Width Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><BarChart3 size={14} strokeWidth={1.5} /> Bias #286</span><h1>Binding Width Calculator</h1><p>Cut width to finished width.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Cut width (in)</label><input type="number" className="input-field" placeholder="2.5" value={cutW} onChange={e=>sC(e.target.value)} min="0" step="0.125"/></div><div className="input-group"><label className="input-label">Fold type</label><select className="input-field" value={fold} onChange={e=>sFd(e.target.value)}><option value="single">Single fold</option><option value="double">Double fold</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/bias-binding" className="related-tool-link"><Ribbon size={13} /> All Bias</a></div></aside></div></div>);}