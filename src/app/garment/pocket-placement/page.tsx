"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Shirt } from "lucide-react";
export default function Page(){
const[garment,sG]=useState("pants");const[hipLine,sH]=useState("");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const hl=parseFloat(hipLine)||8;const pos=garment==="pants"?"Side seam at hip, back welt at "+Math.round(hl*0.6)+"\" from waist":garment==="shirt"?"Chest pocket at bust dart level":garment==="skirt"?"Side seam at "+hl+"\" from waist":"Welt at "+Math.round(hl*0.75)+"\" from waist";const hasResult=true;const resultValue=pos;const resultLabel=garment+" pocket placement";
const faqItems=[{q:"How do I find the right pocket position?",a:"Let your arm hang naturally — where your hand falls is the ideal pocket opening height."}];
return(<div className="container"><Breadcrumb items={[{label:"Garment Tools",href:"/garment"},{label:"Pocket Placement Tool"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Shirt size={14} strokeWidth={1.5} /> Garment #225</span><h1>Pocket Placement Tool</h1><p>Pocket placement positions.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Garment</label><select className="input-field" value={garment} onChange={e=>sG(e.target.value)}><option value="pants">Pants</option><option value="shirt">Shirt</option><option value="skirt">Skirt</option><option value="jacket">Jacket</option></select></div><div className="input-group"><label className="input-label">Hip line from waist (in)</label><input type="number" className="input-field" placeholder="8" value={hipLine} onChange={e=>sH(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link"><Shirt size={13} /> All Garment</a></div></aside></div></div>);}