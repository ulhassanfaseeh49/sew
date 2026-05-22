"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Shirt } from "lucide-react";
export default function Page(){
const[finLen,sF]=useState("");const[ratio,sR]=useState("2");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const fl=parseFloat(finLen)||0;const r=parseFloat(ratio)||2;const fabric=fl*r;const hasResult=fl>0;const resultValue=fabric.toFixed(1)+"\" fabric";const resultLabel=fl+"\" × "+r+"x fullness";
const faqItems=[{q:"What gather ratio should I use?",a:"1.5x for light gathers, 2x for standard, 3x for very full like curtains or ruffles."}];
return(<div className="container"><Breadcrumb items={[{label:"Garment Tools",href:"/garment"},{label:"Gather Ratio Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Garment #207</span><h1>Gather Ratio Calculator</h1><p>Fabric needed for gathering.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Finished length (in)</label><input type="number" className="input-field" placeholder="20" value={finLen} onChange={e=>sF(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Fullness ratio</label><select className="input-field" value={ratio} onChange={e=>sR(e.target.value)}><option value="1.5">1.5x (light)</option><option value="2">2x (standard)</option><option value="2.5">2.5x (full)</option><option value="3">3x (very full)</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link"><Shirt size={13} /> All Garment</a></div></aside></div></div>);}