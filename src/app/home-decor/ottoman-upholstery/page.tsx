"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer } from "lucide-react";
export default function Page(){
const[shape,sS]=useState("square");const[size,sZ]=useState("24");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const s=parseFloat(size)||24;const yd=Math.ceil((s+20)*(s+20)/(54*36)*4)/4+0.5;const hasResult=true;const resultValue=yd+" yards";const resultLabel=shape+" ottoman ~"+s+"\" wide";
const faqItems=[{q:"Do I need piping for an ottoman?",a:"Piping adds a professional finish. Budget an extra 2-3 yards of bias strip fabric."}];
return(<div className="container"><Breadcrumb items={[{label:"Home Decor",href:"/home-decor"},{label:"Ottoman Upholstery"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Home #258</span><h1>Ottoman Upholstery</h1><p>Yardage for ottomans.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Shape</label><select className="input-field" value={shape} onChange={e=>sS(e.target.value)}><option value="square">Square</option><option value="round">Round</option><option value="rectangular">Rectangular</option></select></div><div className="input-group"><label className="input-label">Width/diameter (in)</label><input type="number" className="input-field" value={size} onChange={e=>sZ(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/home-decor" className="related-tool-link"> All Home</a></div></aside></div></div>);}