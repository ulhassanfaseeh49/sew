"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { BookOpen, ClipboardCopy, Frame, Printer } from "lucide-react";
export default function Page(){
const[type,sT]=useState("inside");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const tips:Record<string,{width:string,height:string,tip:string}>={inside:{width:"Measure width at top, middle, bottom — use smallest",height:"Measure height at left, middle, right — use smallest",tip:"Deduct 1/4 to 1/2 inch for clearance."},outside:{width:"Measure window + 4-8 inches each side",height:"Measure from rod to desired length",tip:"Mount rod 4-6 inches above the window frame for height illusion."}};const t2=tips[type]||tips.inside;const hasResult=true;const resultValue=type+" mount";const resultLabel=t2.tip;
const faqItems=[{q:"Should I measure multiple times?",a:"Yes, measure each dimension at 3 points. Windows are rarely perfectly square."}];
return(<div className="container"><Breadcrumb items={[{label:"Curtains",href:"/curtains"},{label:"Window Measurement Guide"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><BookOpen size={14} strokeWidth={1.5} /> Curtain #254</span><h1>Window Measurement Guide</h1><p>How to measure windows for treatments.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Mounting</label><select className="input-field" value={type} onChange={e=>sT(e.target.value)}><option value="inside">Inside mount (within frame)</option><option value="outside">Outside mount (above frame)</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Width</span><strong style={{fontWeight:"normal",fontSize:"0.85rem"}}>{t2.width}</strong></div><div className={styles.resultRow}><span>Height</span><strong style={{fontWeight:"normal",fontSize:"0.85rem"}}>{t2.height}</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/curtains" className="related-tool-link"><Frame size={13} /> All Curtains</a></div></aside></div></div>);}