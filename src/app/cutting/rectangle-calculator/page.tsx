"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[rw,sRW]=useState("");const[rh,sRH]=useState("");const[fw,sFw]=useState("42");const[yd,sYd]=useState("1");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const w=parseFloat(rw)||0;const h=parseFloat(rh)||0;const fw2=parseFloat(fw)||42;const y=parseFloat(yd)||1;const across=Math.floor(fw2/w);const down=Math.floor(y*36/h);const total=across*down;const hasResult=w>0&&h>0;const resultValue=total+" rectangles";const resultLabel=across+"x"+down+" from "+y+" yard(s)";
const faqItems=[{q:"How do I maximize rectangle cutting?",a:"Try both orientations (rotated 90°) and pick the one that yields more pieces."}];
return(<div className="container"><Breadcrumb items={[{label:"Cutting Tools",href:"/cutting"},{label:"Rectangle Cutting Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>▬</span> Cutting #169</span><h1>Rectangle Cutting Calculator</h1><p>How many rectangles from fabric.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Rect W</label><input type="number" className="input-field" placeholder="4" value={rw} onChange={e=>sRW(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Rect H</label><input type="number" className="input-field" placeholder="6" value={rh} onChange={e=>sRH(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Fabric W</label><input type="number" className="input-field" value={fw} onChange={e=>sFw(e.target.value)}/></div><div className="input-group"><label className="input-label">Yards</label><input type="number" className="input-field" value={yd} onChange={e=>sYd(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/cutting" className="related-tool-link">✂️ All Cutting</a></div></aside></div></div>);}