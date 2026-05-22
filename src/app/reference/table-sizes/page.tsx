"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { BookOpen, ClipboardCopy, Printer, UtensilsCrossed } from "lucide-react";
export default function Page(){
const[type,sT]=useState("dining-6");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const info:Record<string,{dim:string,cloth:string}>={["dining-4"]:{dim:"36×48\"",cloth:"Tablecloth: 52×70\" (8\" drop)"},["dining-6"]:{dim:"36×72\"",cloth:"Tablecloth: 52×90\" (8\" drop)"},["dining-8"]:{dim:"36×96\"",cloth:"Tablecloth: 52×114\" (8\" drop)"},["round-4"]:{dim:"48\" diameter",cloth:"Round cloth: 68\" diameter (10\" drop)"},coffee:{dim:"24×48\"",cloth:"Runner: 14×48\" or small cloth: 36×60\""}};const i2=info[type]||info["dining-6"];const hasResult=true;const resultValue=type.replace(/-/g," ")+": "+i2.dim;const resultLabel=i2.cloth;
const faqItems=[{q:"How much tablecloth overhang?",a:"8-10 inches for casual, 15 inches for formal, floor-length (30\") for events."}];
return(<div className="container"><Breadcrumb items={[{label:"Reference",href:"/reference"},{label:"Table Size Reference"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><UtensilsCrossed size={14} strokeWidth={1.5} /> Ref #472</span><h1>Table Size Reference</h1><p>Standard table dimensions.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Table type</label><select className="input-field" value={type} onChange={e=>sT(e.target.value)}><option value="dining-4">Dining (4 person)</option><option value="dining-6">Dining (6 person)</option><option value="dining-8">Dining (8 person)</option><option value="round-4">Round (4 person)</option><option value="coffee">Coffee table</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/reference" className="related-tool-link"><BookOpen size={13} /> All Reference</a></div></aside></div></div>);}