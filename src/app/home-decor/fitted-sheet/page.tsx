"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[bedSize,sB]=useState("queen");const[depth,sD]=useState("12");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const dims:Record<string,[number,number]>={twin:[39,75],full:[54,75],queen:[60,80],king:[76,80]};const[bw,bl]=dims[bedSize]||[60,80];const d=parseFloat(depth)||12;const cutW=bw+d*2+6;const cutL=bl+d*2+6;const yd=Math.ceil(cutL/36*4)/4;const hasResult=true;const resultValue=yd+" yards ("+cutW+"\" wide)";const resultLabel="may need to seam widths for wider beds";
const faqItems=[{q:"How much elastic for a fitted sheet?",a:"Full perimeter of the sheet bottom. About 4-5 yards for a queen size."}];
return(<div className="container"><Breadcrumb items={[{label:"Home Decor",href:"/home-decor"},{label:"Fitted Sheet Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>📐</span> Home #276</span><h1>Fitted Sheet Calculator</h1><p>Fabric for fitted sheets.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Bed size</label><select className="input-field" value={bedSize} onChange={e=>sB(e.target.value)}><option value="twin">Twin</option><option value="full">Full</option><option value="queen">Queen</option><option value="king">King</option></select></div><div className="input-group"><label className="input-label">Mattress depth (in)</label><input type="number" className="input-field" value={depth} onChange={e=>sD(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/home-decor" className="related-tool-link">🏠 All Home</a></div></aside></div></div>);}