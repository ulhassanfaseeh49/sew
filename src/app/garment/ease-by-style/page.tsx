"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { BookOpen, ClipboardCopy, Printer, Shirt } from "lucide-react";
export default function Page(){
const[style,sS]=useState("fitted");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const eases:Record<string,{bust:string,waist:string,hip:string}>={close:{bust:"0-1\"",waist:"0-0.5\"",hip:"0-1\""},fitted:{bust:"2-3\"",waist:"1\"",hip:"2\""},semi:{bust:"3-4\"",waist:"1-2\"",hip:"2-3\""},loose:{bust:"4-6\"",waist:"2-4\"",hip:"3-5\""},oversized:{bust:"6-10+\"",waist:"4-8\"",hip:"5-8\""}};const e=eases[style]||eases.fitted;const hasResult=true;const resultValue=style+" fit";const resultLabel="standard ease amounts";
const faqItems=[{q:"How do I know what ease a pattern has?",a:"Check the finished garment measurements on the pattern envelope or instruction sheet."}];
return(<div className="container"><Breadcrumb items={[{label:"Garment Tools",href:"/garment"},{label:"Ease by Style Guide"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><BookOpen size={14} strokeWidth={1.5} /> Garment #227</span><h1>Ease by Style Guide</h1><p>Standard ease by garment style.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Style</label><select className="input-field" value={style} onChange={e=>sS(e.target.value)}><option value="close">Very close fitting</option><option value="fitted">Fitted</option><option value="semi">Semi-fitted</option><option value="loose">Loose</option><option value="oversized">Oversized</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Bust ease</span><strong>{e.bust}</strong></div><div className={styles.resultRow}><span>Waist ease</span><strong>{e.waist}</strong></div><div className={styles.resultRow}><span>Hip ease</span><strong>{e.hip}</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link"><Shirt size={13} /> All Garment</a></div></aside></div></div>);}