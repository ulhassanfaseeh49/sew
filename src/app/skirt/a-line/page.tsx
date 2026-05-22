"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Shirt } from "lucide-react";
export default function Page(){
const[waist,sW]=useState("");const[hip,sH]=useState("");const[length,sL]=useState("22");const[hemAdd,sHA]=useState("4");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const w=parseFloat(waist)||0;const h=parseFloat(hip)||0;const l=parseFloat(length)||22;const ha=parseFloat(hemAdd)||4;const hemW=h+ha*2;const yd=Math.ceil((l+4)/36*4)/4*2;const hasResult=w>0&&h>0;const resultValue=yd+" yards";const resultLabel="waist "+w+"\" → hem "+hemW+"\" (4 panels)";
const faqItems=[{q:"How much flare for an A-line?",a:"3-5 inches added to each side at the hem gives a classic A-line silhouette."}];
return(<div className="container"><Breadcrumb items={[{label:"Skirt",href:"/skirt"},{label:"A-Line Skirt Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Skirt #356</span><h1>A-Line Skirt Calculator</h1><p>A-line dimensions and flare.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Waist (in)</label><input type="number" className="input-field" placeholder="28" value={waist} onChange={e=>sW(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Hip (in)</label><input type="number" className="input-field" placeholder="38" value={hip} onChange={e=>sH(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Length (in)</label><input type="number" className="input-field" value={length} onChange={e=>sL(e.target.value)}/></div><div className="input-group"><label className="input-label">Hem flare each side (in)</label><input type="number" className="input-field" value={hemAdd} onChange={e=>sHA(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/skirt" className="related-tool-link"><Shirt size={13} /> All Skirts</a></div></aside></div></div>);}