"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[hemCirc,sH]=useState("");const[hoops,sHp]=useState("4");const[height,sHt]=useState("30");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const hc=parseFloat(hemCirc)||0;const hp=parseInt(hoops)||4;const ht=parseFloat(height)||30;const spacing=ht/(hp+1);const bottomDia=hc/Math.PI;const hasResult=hc>0;const resultValue=hp+" hoops, "+spacing.toFixed(1)+"\" apart";const resultLabel="bottom hoop: "+bottomDia.toFixed(0)+"\" diameter ("+hc+"\" circ)";
const faqItems=[{q:"What material for hoop skirt?",a:"Spring steel hoops, boning tape channels, or plastic tubing. Attach to cotton twill tape channels."}];
return(<div className="container"><Breadcrumb items={[{label:"Costume",href:"/costume"},{label:"Hoop Skirt Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🔵</span> Costume #339</span><h1>Hoop Skirt Calculator</h1><p>Hoop skirt dimensions.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Desired hem circumference (in)</label><input type="number" className="input-field" placeholder="120" value={hemCirc} onChange={e=>sH(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Number of hoops</label><input type="number" className="input-field" value={hoops} onChange={e=>sHp(e.target.value)} min="2"/></div><div className="input-group"><label className="input-label">Skirt height (in)</label><input type="number" className="input-field" value={height} onChange={e=>sHt(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/costume" className="related-tool-link">🎭 All Costume</a></div></aside></div></div>);}