"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Recycle } from "lucide-react";
export default function Page(){
const[priority,sP]=useState("water");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const recs:Record<string,{fibers:string,note:string}>={water:{fibers:"Hemp, linen, recycled polyester",note:"These fibers need minimal water in production"},chemical:{fibers:"Organic cotton, hemp, organic linen",note:"Grown without synthetic pesticides or fertilizers"},biodegradable:{fibers:"Cotton, linen, hemp, silk, wool, Tencel",note:"All natural fibers and Tencel biodegrade naturally"},durability:{fibers:"Hemp, linen, wool",note:"These fibers last decades with proper care"}};const r=recs[priority]||recs.water;const hasResult=true;const resultValue=r.fibers;const resultLabel=r.note;
const faqItems=[{q:"Is organic cotton enough?",a:"Its better than conventional but still water-intensive. Consider hemp or linen for lower impact."}];
return(<div className="container"><Breadcrumb items={[{label:"Sustainable",href:"/sustainable"},{label:"Sustainable Fiber Guide"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Eco #455</span><h1>Sustainable Fiber Guide</h1><p>Guide to sustainable fibers.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Your priority</label><select className="input-field" value={priority} onChange={e=>sP(e.target.value)}><option value="water">Low water usage</option><option value="chemical">Chemical-free</option><option value="biodegradable">Biodegradable</option><option value="durability">Long-lasting</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/sustainable" className="related-tool-link"><Recycle size={13} /> All Sustainable</a></div></aside></div></div>);}