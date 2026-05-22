"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer } from "lucide-react";
export default function Page(){
const[fin,sF]=useState("9");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const f=parseFloat(fin)||9;const gridSize=f/3;const cutSize=gridSize+0.5;const hasResult=f>0;const resultValue=cutSize.toFixed(2)+"\" squares (9 needed)";const resultLabel=gridSize.toFixed(2)+"\" finished grid";
const faqItems=[{q:"What is a nine-patch?",a:"A block made of 9 equal squares arranged in 3 rows of 3."}];
return(<div className="container"><Breadcrumb items={[{label:"Quilt Tools",href:"/quilt"},{label:"Nine-Patch Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>#</span> Quilt #151</span><h1>Nine-Patch Calculator</h1><p>Strip widths for nine-patch blocks.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Finished block size</label><input type="number" className="input-field" value={fin} onChange={e=>sF(e.target.value)} min="0"/></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Grid size</span><strong>{gridSize.toFixed(2)}&quot;</strong></div><div className={styles.resultRow}><span>Cut size</span><strong>{cutSize.toFixed(2)}&quot;</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/quilt" className="related-tool-link"> All Quilt</a></div></aside></div></div>);}