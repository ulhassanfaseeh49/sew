"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[bedSize,sB]=useState("queen");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const sizes:Record<string,{w:number,h:number}>={twin:{w:68,h:86},full:{w:78,h:86},queen:{w:88,h:92},king:{w:108,h:92}};const s=sizes[bedSize]||sizes.queen;const cutW=s.w+2;const cutH=s.h+2;const widths=Math.ceil(cutW/54);const yd=Math.ceil(widths*cutH/36*4)/4*2;const hasResult=true;const resultValue=yd+" yards total (front+back)";const resultLabel=bedSize+" duvet: "+s.w+"\" × "+s.h+"\"";
const faqItems=[{q:"What closure for a duvet cover?",a:"Buttons, snaps, or a zipper along the bottom opening. Ties at inside corners hold the duvet in place."}];
return(<div className="container"><Breadcrumb items={[{label:"Home Decor",href:"/home-decor"},{label:"Duvet Cover Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🛏️</span> Home #274</span><h1>Duvet Cover Calculator</h1><p>Fabric for duvet covers.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Bed size</label><select className="input-field" value={bedSize} onChange={e=>sB(e.target.value)}><option value="twin">Twin</option><option value="full">Full</option><option value="queen">Queen</option><option value="king">King</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/home-decor" className="related-tool-link">🏠 All Home</a></div></aside></div></div>);}