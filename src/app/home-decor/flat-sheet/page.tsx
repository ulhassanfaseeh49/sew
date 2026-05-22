"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Ruler } from "lucide-react";
export default function Page(){
const[bedSize,sB]=useState("queen");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const sizes:Record<string,{w:number,l:number}>={twin:{w:66,l:96},full:{w:81,l:96},queen:{w:90,l:102},king:{w:108,l:102}};const s=sizes[bedSize]||sizes.queen;const cutW=s.w+2;const cutL=s.l+6;const yd=Math.ceil(cutL/36*4)/4;const hasResult=true;const resultValue=yd+" yards";const resultLabel=cutW+"\" × "+cutL+"\" flat sheet";
const faqItems=[{q:"What size is a queen flat sheet?",a:"Standard queen flat sheet is 90×102 inches. Allow extra for a wide top hem."}];
return(<div className="container"><Breadcrumb items={[{label:"Home Decor",href:"/home-decor"},{label:"Flat Sheet Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Home #277</span><h1>Flat Sheet Calculator</h1><p>Fabric for flat sheets.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Bed size</label><select className="input-field" value={bedSize} onChange={e=>sB(e.target.value)}><option value="twin">Twin</option><option value="full">Full</option><option value="queen">Queen</option><option value="king">King</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/home-decor" className="related-tool-link"> All Home</a></div></aside></div></div>);}