"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { BookOpen, ClipboardCopy, Printer } from "lucide-react";
export default function Page(){
const[size,sS]=useState("queen");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const data:Record<string,{w:number,l:number}>={crib:{w:28,l:52},twin:{w:39,l:75},twinxl:{w:39,l:80},full:{w:54,l:75},queen:{w:60,l:80},king:{w:76,l:80},calking:{w:72,l:84}};const d=data[size]||data.queen;const hasResult=true;const resultValue=d.w+"\" × "+d.l+"\"";const resultLabel=size+" mattress dimensions";
const faqItems=[{q:"What is the difference between King and Cal King?",a:"King is wider (76×80), California King is longer and narrower (72×84)."}];
return(<div className="container"><Breadcrumb items={[{label:"Home Decor",href:"/home-decor"},{label:"Bed Size Reference"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><BookOpen size={14} strokeWidth={1.5} /> Home #279</span><h1>Bed Size Reference</h1><p>Mattress dimensions reference.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Bed size</label><select className="input-field" value={size} onChange={e=>sS(e.target.value)}><option value="crib">Crib</option><option value="twin">Twin</option><option value="twinxl">Twin XL</option><option value="full">Full</option><option value="queen">Queen</option><option value="king">King</option><option value="calking">California King</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/home-decor" className="related-tool-link"> All Home</a></div></aside></div></div>);}