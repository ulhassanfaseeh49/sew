"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Drama, Printer, Shirt } from "lucide-react";
export default function Page(){
const[type,sT]=useState("standard");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const data:Record<string,{fabric:string,steel:string,width:string}>={small:{fabric:"2-3 yards",steel:"3-4 steels",width:"12-15\" projection"},standard:{fabric:"3-5 yards",steel:"5-7 steels",width:"15-20\" projection"},large:{fabric:"5-7 yards",steel:"7-10 steels",width:"20-24\" projection"}};const d=data[type]||data.standard;const hasResult=true;const resultValue=d.fabric;const resultLabel=d.steel+", "+d.width;
const faqItems=[{q:"What is a bustle?",a:"A framework worn under the skirt at the back to create dramatic rear fullness, popular 1870s-1890s."}];
return(<div className="container"><Breadcrumb items={[{label:"Costume",href:"/costume"},{label:"Bustle Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Shirt size={14} strokeWidth={1.5} /> Costume #349</span><h1>Bustle Calculator</h1><p>Victorian bustle materials.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Bustle type</label><select className="input-field" value={type} onChange={e=>sT(e.target.value)}><option value="small">Small/lobster tail</option><option value="standard">Standard (1880s)</option><option value="large">Large/shelf bustle</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/costume" className="related-tool-link"><Drama size={13} /> All Costume</a></div></aside></div></div>);}