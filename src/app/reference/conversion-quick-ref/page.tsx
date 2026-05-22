"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { BookOpen, ClipboardCopy, Printer } from "lucide-react";
export default function Page(){
const[from,sF]=useState("yards");const[val,sV]=useState("");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const v=parseFloat(val)||0;const conv:Record<string,{yd:number,m:number,in2:number,cm:number}>={yards:{yd:1,m:0.9144,in2:36,cm:91.44},meters:{yd:1.0936,m:1,in2:39.37,cm:100},inches:{yd:0.02778,m:0.0254,in2:1,cm:2.54},cm:{yd:0.01094,m:0.01,in2:0.3937,cm:1}};const c=conv[from]||conv.yards;const hasResult=v>0;const resultValue=v+" "+from;const resultLabel=(v*c.yd).toFixed(3)+" yd | "+(v*c.m).toFixed(3)+" m | "+(v*c.in2).toFixed(2)+" in | "+(v*c.cm).toFixed(2)+" cm";
const faqItems=[{q:"What conversion do sewists use most?",a:"Yards to meters (×0.9144) and inches to centimeters (×2.54) are the most common."}];
return(<div className="container"><Breadcrumb items={[{label:"Reference",href:"/reference"},{label:"Conversion Quick Reference"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><ClipboardCopy size={14} strokeWidth={1.5} /> Ref #466</span><h1>Conversion Quick Reference</h1><p>All-in-one measurement conversions.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">From</label><select className="input-field" value={from} onChange={e=>sF(e.target.value)}><option value="yards">Yards</option><option value="meters">Meters</option><option value="inches">Inches</option><option value="cm">Centimeters</option></select></div><div className="input-group"><label className="input-label">Value</label><input type="number" className="input-field" placeholder="1" value={val} onChange={e=>sV(e.target.value)} min="0" step="0.01"/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/reference" className="related-tool-link"><BookOpen size={13} /> All Reference</a></div></aside></div></div>);}