"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { BookOpen, CheckCircle, ClipboardCopy, Printer } from "lucide-react";
export default function Page(){
const[budget,sB]=useState("basic");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const kits:Record<string,{items:string,priority:string}>={basic:{items:"Scissors, pins, hand needles, thread, tape measure, seam ripper",priority:"Borrow a machine, buy only essentials"},starter:{items:"Basic + sewing machine, iron, cutting mat, rotary cutter, ruler",priority:"Invest in a quality machine and iron"},complete:{items:"Starter + dress form, serger, presser feet set, fabric organizer",priority:"Full setup for serious sewing"}};const k=kits[budget]||kits.basic;const hasResult=true;const resultValue=budget+" kit";const resultLabel=k.items;
const faqItems=[{q:"What should I buy first?",a:"A quality pair of fabric scissors, pins, and thread. Then a sewing machine when you are committed."}];
return(<div className="container"><Breadcrumb items={[{label:"Reference",href:"/reference"},{label:"Beginner Sewing Checklist"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><CheckCircle size={14} strokeWidth={1.5} /> Ref #474</span><h1>Beginner Sewing Checklist</h1><p>Essential supplies for beginners.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Budget level</label><select className="input-field" value={budget} onChange={e=>sB(e.target.value)}><option value="basic">Basic ($50-100)</option><option value="starter">Starter ($100-200)</option><option value="complete">Complete ($200-400)</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/reference" className="related-tool-link"><BookOpen size={13} /> All Reference</a></div></aside></div></div>);}