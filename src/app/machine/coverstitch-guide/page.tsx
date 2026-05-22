"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Scissors } from "lucide-react";
export default function Page(){
const[fabric,sF]=useState("knit");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const rec:Record<string,{needles:string,length:string,diff:string}>={knit:{needles:"2 needles (wide or narrow)",length:"3.0mm",diff:"1.0-1.3"},["heavy-knit"]:{needles:"2 needles wide",length:"3.5mm",diff:"1.0-1.3"},swim:{needles:"2 needles narrow",length:"2.5mm",diff:"1.5-2.0"}};const r=rec[fabric]||rec.knit;const hasResult=true;const resultValue="coverstitch on "+fabric;const resultLabel="needles: "+r.needles+" | length: "+r.length+" | diff feed: "+r.diff;
const faqItems=[{q:"Do I need a coverstitch machine?",a:"Not essential. Twin needle on a regular machine creates a similar look. Coverstitch is for production speed."}];
return(<div className="container"><Breadcrumb items={[{label:"Machine",href:"/machine"},{label:"Coverstitch Guide"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} strokeWidth={1.5} /> Machine #449</span><h1>Coverstitch Guide</h1><p>Coverstitch machine settings.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Fabric</label><select className="input-field" value={fabric} onChange={e=>sF(e.target.value)}><option value="knit">Knit/jersey</option><option value="heavy-knit">Heavy knit/sweatshirt</option><option value="swim">Swimwear/lycra</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/machine" className="related-tool-link"><Scissors size={13} /> All Machine</a></div></aside></div></div>);}