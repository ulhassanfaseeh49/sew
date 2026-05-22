"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer } from "lucide-react";
export default function Page(){
const[finW,sFW]=useState("");const[finH,sFH]=useState("");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const fw2=parseFloat(finW)||0;const fh=parseFloat(finH)||0;const gooseSq=fw2+1.25;const skySq=fh+0.875;const hasResult=fw2>0&&fh>0;const resultValue="Goose: "+gooseSq.toFixed(2)+"\" / Sky: "+skySq.toFixed(2)+"\"";const resultLabel="no-waste method (4 at a time)";
const faqItems=[{q:"What are flying geese?",a:"Rectangular units with a center triangle flanked by two corner triangles."}];
return(<div className="container"><Breadcrumb items={[{label:"Quilt Tools",href:"/quilt"},{label:"Flying Geese Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Quilt #149</span><h1>Flying Geese Calculator</h1><p>Cutting sizes for flying geese.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Finished W</label><input type="number" className="input-field" placeholder="4" value={finW} onChange={e=>sFW(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Finished H</label><input type="number" className="input-field" placeholder="2" value={finH} onChange={e=>sFH(e.target.value)} min="0"/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/quilt" className="related-tool-link"> All Quilt</a></div></aside></div></div>);}