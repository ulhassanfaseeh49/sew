"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Ruler, Shirt } from "lucide-react";
export default function Page(){
const[finW,sF]=useState("");const[tuckD,sT]=useState("0.25");const[spacing,sS]=useState("0.5");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const fw=parseFloat(finW)||0;const td=parseFloat(tuckD)||0.25;const sp=parseFloat(spacing)||0.5;
const numTucks=fw>0?Math.floor(fw/(sp+td*2)):0;const fabricNeeded=fw+numTucks*td*2;
const hasResult=fw>0;const resultValue=fabricNeeded.toFixed(1)+"\""+"\" fabric needed";const resultLabel=numTucks+" tucks at "+td+"\" depth";
const faqItems=[{q:"What is a pin tuck?",a:"A very narrow tuck (1/16 to 1/8 inch) used for decorative texture on blouses."}];
return(<div className="container"><Breadcrumb items={[{label:"Garment Tools",href:"/garment"},{label:"Tuck Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Garment #229</span><h1>Tuck Calculator</h1><p>Calculate tuck size, spacing, and fabric needed.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Finished width (in)</label><input type="number" className="input-field" placeholder="10" value={finW} onChange={e=>sF(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Tuck depth</label><input type="number" className="input-field" value={tuckD} onChange={e=>sT(e.target.value)}/></div><div className="input-group"><label className="input-label">Spacing</label><input type="number" className="input-field" value={spacing} onChange={e=>sS(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Tucks</span><strong>{numTucks}</strong></div><div className={styles.resultRow}><span>Extra fabric</span><strong>{(fabricNeeded-fw).toFixed(1)}&quot;</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link"><Shirt size={13} /> All Garment</a></div></aside></div></div>);}