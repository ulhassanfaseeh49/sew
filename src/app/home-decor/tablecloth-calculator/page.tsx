"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, UtensilsCrossed } from "lucide-react";
export default function Page(){
const[shape,sS]=useState("rect");const[len,sL]=useState("60");const[w,sW]=useState("36");const[drop,sD]=useState("10");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const l=parseFloat(len)||60;const w2=parseFloat(w)||36;const d=parseFloat(drop)||10;const cutL=shape==="round"?l+d*2+2:l+d*2+2;const cutW=shape==="round"?cutL:w2+d*2+2;const yd=Math.ceil(cutL*cutW/(54*36)*4)/4;const hasResult=true;const resultValue=yd+" yards";const resultLabel=cutL+"\" × "+cutW+"\" with "+d+"\" drop";
const faqItems=[{q:"What is a standard tablecloth drop?",a:"8-10 inches for casual, 15 inches for formal, 30 inches (floor-length) for events."}];
return(<div className="container"><Breadcrumb items={[{label:"Home Decor",href:"/home-decor"},{label:"Tablecloth Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><UtensilsCrossed size={14} strokeWidth={1.5} /> Home #269</span><h1>Tablecloth Calculator</h1><p>Tablecloth dimensions.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Shape</label><select className="input-field" value={shape} onChange={e=>sS(e.target.value)}><option value="rect">Rectangle</option><option value="round">Round</option></select></div><div className="input-group"><label className="input-label">{shape==="round"?"Diameter":"Length"} (in)</label><input type="number" className="input-field" value={len} onChange={e=>sL(e.target.value)}/></div>{shape==="rect"&&<div className="input-group"><label className="input-label">Width (in)</label><input type="number" className="input-field" value={w} onChange={e=>sW(e.target.value)}/></div>}<div className="input-group"><label className="input-label">Drop (in)</label><input type="number" className="input-field" value={drop} onChange={e=>sD(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/home-decor" className="related-tool-link"> All Home</a></div></aside></div></div>);}