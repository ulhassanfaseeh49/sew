"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Recycle, Scissors } from "lucide-react";
export default function Page(){
const[pieces,sP]=useState("");const[pieceW,sPW]=useState("");const[pieceH,sPH]=useState("");const[fw,sFw]=useState("42");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const p=parseInt(pieces)||0;const pw=parseFloat(pieceW)||0;const ph=parseFloat(pieceH)||0;const fw2=parseFloat(fw)||42;const across=Math.floor(fw2/pw);const rows=across>0?Math.ceil(p/across):0;const totalLen=rows*ph;const yd=Math.ceil((totalLen/36)*8)/8;const used=p*pw*ph;const total=yd*36*fw2;const eff=total>0?(used/total*100):0;const hasResult=p>0&&pw>0;const resultValue=yd+" yards ("+eff.toFixed(0)+"% efficient)";const resultLabel=p+" pieces optimally arranged";
const faqItems=[{q:"How do I minimize fabric waste?",a:"Arrange pieces to maximize cuts across the fabric width first, then calculate rows needed."}];
return(<div className="container"><Breadcrumb items={[{label:"Cutting Tools",href:"/cutting"},{label:"Waste Minimization Planner"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Recycle size={14} strokeWidth={1.5} /> Cutting #175</span><h1>Waste Minimization Planner</h1><p>Optimize cutting to minimize waste.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Pieces needed</label><input type="number" className="input-field" placeholder="24" value={pieces} onChange={e=>sP(e.target.value)}/></div><div className="input-group"><label className="input-label">Piece W</label><input type="number" className="input-field" placeholder="5" value={pieceW} onChange={e=>sPW(e.target.value)}/></div><div className="input-group"><label className="input-label">Piece H</label><input type="number" className="input-field" placeholder="5" value={pieceH} onChange={e=>sPH(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Efficiency</span><strong>{eff.toFixed(1)}%</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/cutting" className="related-tool-link"><Scissors size={13} /> All Cutting</a></div></aside></div></div>);}