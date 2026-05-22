"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Scissors } from "lucide-react";
export default function Page(){
const[type,sT]=useState("sharps");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const info:Record<string,{desc:string,sizes:string}>={sharps:{desc:"Medium length, sharp point. General hand sewing.",sizes:"1-12 (lower=larger)"},betweens:{desc:"Short, strong. For quilting — small stitches through layers.",sizes:"7-12 (10 is popular)"},embroidery:{desc:"Like sharps but with larger eye for floss.",sizes:"1-12"},tapestry:{desc:"Blunt tip, large eye. For counted thread work.",sizes:"13-28"},beading:{desc:"Very thin, long. For beadwork and sequins.",sizes:"10-15"},leather:{desc:"Triangular cutting tip. For leather and suede.",sizes:"1-8"}};const i2=info[type]||info.sharps;const hasResult=true;const resultValue=type+" needle";const resultLabel=i2.desc+" | sizes "+i2.sizes;
const faqItems=[{q:"What hand needle is most versatile?",a:"Sharps size 8 or 9 for general hand sewing. Keep embroidery needles for floss work."}];
return(<div className="container"><Breadcrumb items={[{label:"Needles & Thread",href:"/needles-thread"},{label:"Hand Needle Guide"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Needle #434</span><h1>Hand Needle Guide</h1><p>Hand sewing needle types.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Needle type</label><select className="input-field" value={type} onChange={e=>sT(e.target.value)}><option value="sharps">Sharps</option><option value="betweens">Betweens (quilting)</option><option value="embroidery">Embroidery/crewel</option><option value="tapestry">Tapestry</option><option value="beading">Beading</option><option value="leather">Leather/glover</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/needles-thread" className="related-tool-link"><Scissors size={13} /> All Needles</a></div></aside></div></div>);}