"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[stitch,sS]=useState("zigzag");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const rec:Record<string,{width:string,note:string}>={zigzag:{width:"1.0-5.0mm",note:"Narrow (1mm) for seams, wide (5mm) for finishing"},buttonhole:{width:"5.0-7.0mm",note:"Width must accommodate the button thickness"},applique:{width:"3.0-4.0mm",note:"Close zigzag (satin) with 0.3-0.5mm length"},overcast:{width:"3.0-5.0mm",note:"Match to fabric edge to prevent tunneling"},decorative:{width:"variable",note:"Follow machine guide for each decorative stitch"}};const r=rec[stitch]||rec.zigzag;const hasResult=true;const resultValue=r.width;const resultLabel=r.note;
const faqItems=[{q:"What does stitch width control?",a:"The side-to-side movement of the needle. Only applies to zigzag and decorative stitches."}];
return(<div className="container"><Breadcrumb items={[{label:"Machine",href:"/machine"},{label:"Stitch Width Guide"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>↔️</span> Machine #439</span><h1>Stitch Width Guide</h1><p>Width for zigzag and decorative stitches.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Stitch type</label><select className="input-field" value={stitch} onChange={e=>sS(e.target.value)}><option value="zigzag">Zigzag</option><option value="buttonhole">Buttonhole</option><option value="applique">Appliqué satin stitch</option><option value="overcast">Overcast/overlock</option><option value="decorative">Decorative</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/machine" className="related-tool-link">🧵 All Machine</a></div></aside></div></div>);}