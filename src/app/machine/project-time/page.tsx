"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Scissors } from "lucide-react";
export default function Page(){
const[type,sT]=useState("blouse");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const times:Record<string,{total:string,cut:string,sew:string,finish:string}>={pillowcase:{total:"30-60 min",cut:"10",sew:"15",finish:"5"},tote:{total:"2-3 hours",cut:"20",sew:"60",finish:"20"},skirt:{total:"2-4 hours",cut:"30",sew:"90",finish:"30"},blouse:{total:"4-6 hours",cut:"45",sew:"180",finish:"45"},dress:{total:"6-10 hours",cut:"60",sew:"300",finish:"60"},pants:{total:"4-6 hours",cut:"45",sew:"180",finish:"45"},jacket:{total:"10-20 hours",cut:"60",sew:"600",finish:"120"},quilt:{total:"20-40 hours",cut:"120",sew:"600",finish:"300"}};const t2=times[type]||times.blouse;const hasResult=true;const resultValue=t2.total;const resultLabel="cut "+t2.cut+"m + sew "+t2.sew+"m + finish "+t2.finish+"m";
const faqItems=[{q:"Why do projects take longer than expected?",a:"Pressing, pinning, ripping, fitting, and decision-making add 30-50% to pure sewing time."}];
return(<div className="container"><Breadcrumb items={[{label:"Machine",href:"/machine"},{label:"Project Time Estimator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Machine #444</span><h1>Project Time Estimator</h1><p>Total project time estimate.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Project</label><select className="input-field" value={type} onChange={e=>sT(e.target.value)}><option value="pillowcase">Pillowcase</option><option value="tote">Tote bag</option><option value="skirt">Simple skirt</option><option value="blouse">Blouse/shirt</option><option value="dress">Dress</option><option value="pants">Pants</option><option value="jacket">Jacket/coat</option><option value="quilt">Quilt (throw)</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/machine" className="related-tool-link"><Scissors size={13} /> All Machine</a></div></aside></div></div>);}