"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { Baby, Bed, ClipboardCopy, Printer } from "lucide-react";
export default function Page(){
const[type,sT]=useState("standard");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const dims:Record<string,{w:number,l:number,d:number}>={standard:{w:28,l:52,d:6},mini:{w:24,l:38,d:4},packnplay:{w:25,l:37,d:3}};const d=dims[type]||dims.standard;const cutW=d.w+d.d*2+6;const cutL=d.l+d.d*2+6;const yd=Math.ceil(cutL/36*4)/4;const hasResult=true;const resultValue=yd+" yards ("+cutW+"\" wide needed)";const resultLabel=type+" crib: "+d.w+"×"+d.l+"×"+d.d+"\"";
const faqItems=[{q:"What fabric for crib sheets?",a:"100% cotton or jersey knit. Must be tight-fitting for safety. Use full elastic all around."}];
return(<div className="container"><Breadcrumb items={[{label:"Baby & Kids",href:"/baby-kids"},{label:"Crib Sheet Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Bed size={14} strokeWidth={1.5} /> Baby #397</span><h1>Crib Sheet Calculator</h1><p>Fitted crib sheets.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Crib type</label><select className="input-field" value={type} onChange={e=>sT(e.target.value)}><option value="standard">Standard (28×52)</option><option value="mini">Mini crib (24×38)</option><option value="packnplay">Pack-n-Play (25×37)</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/baby-kids" className="related-tool-link"><Baby size={13} /> All Baby</a></div></aside></div></div>);}