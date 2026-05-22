"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Recycle } from "lucide-react";
export default function Page(){
const[item,sI]=useState("tshirt");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const data:Record<string,{store:string,handmade:string,savings:string}>={tshirt:{store:"~7 kg CO2 (shipping, factory)",handmade:"~2 kg CO2 (local fabric, no shipping)",savings:"~70% less"},dress:{store:"~15 kg CO2",handmade:"~4 kg CO2",savings:"~73% less"},tote:{store:"~5 kg CO2",handmade:"~1 kg CO2 (using scraps: near zero)",savings:"~80% less"},quilt:{store:"~20 kg CO2",handmade:"~6 kg CO2",savings:"~70% less"}};const d=data[item]||data.tshirt;const hasResult=true;const resultValue="handmade saves "+d.savings+" CO2";const resultLabel="store: "+d.store+" vs handmade: "+d.handmade;
const faqItems=[{q:"Is handmade really better for the environment?",a:"Generally yes, especially with local/organic fabrics. No overseas shipping, no factory waste."}];
return(<div className="container"><Breadcrumb items={[{label:"Sustainable",href:"/sustainable"},{label:"Carbon Footprint Compare"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Eco #457</span><h1>Carbon Footprint Compare</h1><p>Handmade vs store-bought impact.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Item</label><select className="input-field" value={item} onChange={e=>sI(e.target.value)}><option value="tshirt">T-shirt</option><option value="dress">Dress</option><option value="tote">Tote bag</option><option value="quilt">Quilt</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/sustainable" className="related-tool-link"><Recycle size={13} /> All Sustainable</a></div></aside></div></div>);}