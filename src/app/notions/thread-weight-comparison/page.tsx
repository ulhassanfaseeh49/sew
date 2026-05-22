"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Scale, Scissors } from "lucide-react";
export default function Page(){
const[weight,sW]=useState("40");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const info:Record<string,{use:string,needle:string}>={30:{use:"Topstitching, decorative, heavy fabrics",needle:"90/14-100/16"},40:{use:"All-purpose sewing, most projects",needle:"80/12-90/14"},50:{use:"Piecing quilts, fine fabrics",needle:"70/10-80/12"},60:{use:"Bobbin thread, invisible hems, delicates",needle:"60/8-70/10"}};const w=info[weight]||info["40"];const hasResult=true;const resultValue=weight+"wt thread";const resultLabel=w.use;
const faqItems=[{q:"What weight thread should I use?",a:"40wt is all-purpose. Use 50wt for quilting piecing, 30wt for topstitching."}];
return(<div className="container"><Breadcrumb items={[{label:"Notions",href:"/notions"},{label:"Thread Weight Comparison"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Scale size={14} strokeWidth={1.5} /> Notion #182</span><h1>Thread Weight Comparison</h1><p>Compare thread weights and recommendations.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Thread weight</label><select className="input-field" value={weight} onChange={e=>sW(e.target.value)}><option value="30">30wt (heavy)</option><option value="40">40wt (all-purpose)</option><option value="50">50wt (fine)</option><option value="60">60wt (extra fine)</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Best for</span><strong style={{fontWeight:"normal",fontSize:"0.85rem"}}>{w.use}</strong></div><div className={styles.resultRow}><span>Needle size</span><strong>{w.needle}</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/notions" className="related-tool-link"><Scissors size={13} /> All Notions</a></div></aside></div></div>);}