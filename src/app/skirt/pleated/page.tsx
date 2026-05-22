"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, FileText, Printer, Shirt } from "lucide-react";
export default function Page(){
const[waist,sW]=useState("");const[length,sL]=useState("22");const[pleatType,sP]=useState("knife");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const w=parseFloat(waist)||0;const l=parseFloat(length)||22;const mult=pleatType==="knife"?3:pleatType==="box"?3:2.5;const fabricW=w*mult;const widths=Math.ceil(fabricW/44);const yd=Math.ceil(widths*(l+4)/36*4)/4;const hasResult=w>0;const resultValue=yd+" yards";const resultLabel=pleatType+" pleats: "+fabricW+"\" total width ("+mult+"x)";
const faqItems=[{q:"How do I calculate pleat depth?",a:"For knife pleats: depth = space between pleats. For 1 inch pleats visible, fold 2 inches of fabric."}];
return(<div className="container"><Breadcrumb items={[{label:"Skirt",href:"/skirt"},{label:"Pleated Skirt Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><FileText size={14} strokeWidth={1.5} /> Skirt #361</span><h1>Pleated Skirt Calculator</h1><p>Fabric for knife, box, and accordion pleats.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Waist (in)</label><input type="number" className="input-field" placeholder="28" value={waist} onChange={e=>sW(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Length (in)</label><input type="number" className="input-field" value={length} onChange={e=>sL(e.target.value)}/></div><div className="input-group"><label className="input-label">Pleat type</label><select className="input-field" value={pleatType} onChange={e=>sP(e.target.value)}><option value="knife">Knife pleats</option><option value="box">Box pleats</option><option value="accordion">Accordion pleats</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/skirt" className="related-tool-link"><Shirt size={13} /> All Skirts</a></div></aside></div></div>);}