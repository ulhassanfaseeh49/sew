"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { BarChart3, ClipboardCopy, Printer, Shirt } from "lucide-react";
export default function Page(){
const[garment,sG]=useState("dress");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const recs:Record<string,{narrow:string,standard:string,deep:string}>={dress:{narrow:"1/2\" rolled",standard:"1\" double fold",deep:"2\" couture"},skirt:{narrow:"1/2\" narrow",standard:"1-1/2\" standard",deep:"2-3\" formal"},pants:{narrow:"1\" casual",standard:"1-1/2\" standard",deep:"2\" tailored"},top:{narrow:"3/8\" knit",standard:"1\" blouse",deep:"1-1/2\" shirt"}};const r=recs[garment]||recs.dress;const hasResult=true;const resultValue="See depths below";const resultLabel=garment+" hem options";
const faqItems=[{q:"Does hem depth affect hang?",a:"Yes, deeper hems add weight which improves drape on dresses and skirts."}];
return(<div className="container"><Breadcrumb items={[{label:"Garment Tools",href:"/garment"},{label:"Hem Depth Comparator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><BarChart3 size={14} strokeWidth={1.5} /> Garment #211</span><h1>Hem Depth Comparator</h1><p>Compare hem depths and visual effect.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Garment</label><select className="input-field" value={garment} onChange={e=>sG(e.target.value)}><option value="dress">Dress</option><option value="skirt">Skirt</option><option value="pants">Pants</option><option value="top">Top/blouse</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Narrow</span><strong>{r.narrow}</strong></div><div className={styles.resultRow}><span>Standard</span><strong>{r.standard}</strong></div><div className={styles.resultRow}><span>Deep</span><strong>{r.deep}</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link"><Shirt size={13} /> All Garment</a></div></aside></div></div>);}