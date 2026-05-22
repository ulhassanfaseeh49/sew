"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Ruler, ShoppingBag } from "lucide-react";
export default function Page(){
const[type,sT]=useState("shoulder");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const lengths:Record<string,{len:number,note:string}>={handle:{len:20,note:"10\" drop, hand-carry"},shoulder:{len:30,note:"15\" drop, over shoulder"},crossbody:{len:52,note:"26\" drop, across body"},backpack:{len:32,note:"adjustable, 16\" per strap"}};const d=lengths[type]||lengths.shoulder;const hasResult=true;const resultValue=d.len+"\" finished strap";const resultLabel=d.note;
const faqItems=[{q:"How long should bag handles be?",a:"20 inches for hand-carry, 30 inches for shoulder, 50+ inches for crossbody. Measure your preference."}];
return(<div className="container"><Breadcrumb items={[{label:"Bags",href:"/bags"},{label:"Strap Length Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Bag #370</span><h1>Strap Length Calculator</h1><p>Strap for shoulder, crossbody, and handles.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Bag type</label><select className="input-field" value={type} onChange={e=>sT(e.target.value)}><option value="handle">Short handles</option><option value="shoulder">Shoulder strap</option><option value="crossbody">Crossbody</option><option value="backpack">Backpack straps</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/bags" className="related-tool-link"><ShoppingBag size={13} /> All Bags</a></div></aside></div></div>);}