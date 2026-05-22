"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, ShoppingBag } from "lucide-react";
export default function Page(){
const[qty,sQ]=useState("4");const[size,sS]=useState("standard");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const q=parseInt(qty)||4;const dims:Record<string,{l:number,w:number,elastic:number}>={mini:{l:14,w:3,elastic:6},standard:{l:22,w:4,elastic:8},jumbo:{l:28,w:6,elastic:9}};const d=dims[size]||dims.standard;const area=q*d.l*d.w;const yd=Math.ceil(area/(44*36)*8)/8;const hasResult=true;const resultValue=yd+" yards + "+q+"×"+d.elastic+"\" elastic";const resultLabel=q+" "+size+" scrunchies ("+d.l+"×"+d.w+"\" each)";
const faqItems=[{q:"What elastic for scrunchies?",a:"1/4 inch braided elastic, 6-9 inches per scrunchie. Knot the ends after threading through."}];
return(<div className="container"><Breadcrumb items={[{label:"Bags",href:"/bags"},{label:"Scrunchie Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Bag #383</span><h1>Scrunchie Calculator</h1><p>Fabric for scrunchies.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Quantity</label><input type="number" className="input-field" value={qty} onChange={e=>sQ(e.target.value)} min="1"/></div><div className="input-group"><label className="input-label">Size</label><select className="input-field" value={size} onChange={e=>sS(e.target.value)}><option value="mini">Mini</option><option value="standard">Standard</option><option value="jumbo">Jumbo</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/bags" className="related-tool-link"><ShoppingBag size={13} /> All Bags</a></div></aside></div></div>);}