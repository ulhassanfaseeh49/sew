"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Scissors } from "lucide-react";
export default function Page(){
const[fabric,sF]=useState("cotton");const[stitch,sS]=useState("4thread");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const hasResult=true;const resultValue=stitch+" on "+fabric;const resultLabel=fabric==="knit"?"differential feed 1.3-1.5, length 2.5mm":"differential feed 1.0, length 2.5-3mm";
const faqItems=[{q:"What is the most common serger stitch?",a:"4-thread overlock for seaming and finishing in one pass. 3-thread for edges only."}];
return(<div className="container"><Breadcrumb items={[{label:"Machine",href:"/machine"},{label:"Serger Settings Guide"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Machine #448</span><h1>Serger Settings Guide</h1><p>Serger settings by fabric and stitch.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Fabric</label><select className="input-field" value={fabric} onChange={e=>sF(e.target.value)}><option value="cotton">Cotton/woven</option><option value="knit">Knit/jersey</option><option value="sheer">Sheer</option><option value="heavy">Heavy/denim</option></select></div><div className="input-group"><label className="input-label">Stitch</label><select className="input-field" value={stitch} onChange={e=>sS(e.target.value)}><option value="4thread">4-thread overlock</option><option value="3thread">3-thread overlock</option><option value="rolled">Rolled hem</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/machine" className="related-tool-link"><Scissors size={13} /> All Machine</a></div></aside></div></div>);}