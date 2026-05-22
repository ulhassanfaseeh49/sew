"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { Bed, ClipboardCopy, Printer } from "lucide-react";
export default function Page(){
const[bedSize,sB]=useState("queen");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const sizes:Record<string,{w:number,yd:number}>={twin:{w:39,yd:2},full:{w:54,yd:2.5},queen:{w:60,yd:3},king:{w:76,yd:3.5}};const s=sizes[bedSize]||sizes.queen;const hasResult=true;const resultValue=s.yd+" yards fabric";const resultLabel=bedSize+" headboard ("+s.w+"\" wide)";
const faqItems=[{q:"How tall should a headboard be?",a:"24-36 inches above the mattress top. Taller for a dramatic look."}];
return(<div className="container"><Breadcrumb items={[{label:"Home Decor",href:"/home-decor"},{label:"Headboard Upholstery"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Bed size={14} strokeWidth={1.5} /> Home #260</span><h1>Headboard Upholstery</h1><p>Fabric for upholstered headboards.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Bed size</label><select className="input-field" value={bedSize} onChange={e=>sB(e.target.value)}><option value="twin">Twin (39\")</option><option value="full">Full (54\")</option><option value="queen">Queen (60\")</option><option value="king">King (76\")</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/home-decor" className="related-tool-link"> All Home</a></div></aside></div></div>);}