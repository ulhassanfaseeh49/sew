"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[seats,sS]=useState("4");const[type,sT]=useState("seat-only");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const n=parseInt(seats)||4;const per=type==="seat-only"?0.5:type==="seat-back"?1:2;const yd=Math.ceil(n*per*4)/4;const hasResult=true;const resultValue=yd+" yards";const resultLabel=n+" chairs × "+per+" yd each";
const faqItems=[{q:"How much fabric per dining chair seat?",a:"About 1/2 yard per seat-only, 1 yard for seat + back, 2 yards for full upholstery."}];
return(<div className="container"><Breadcrumb items={[{label:"Home Decor",href:"/home-decor"},{label:"Dining Chair Upholstery"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🪑</span> Home #257</span><h1>Dining Chair Upholstery</h1><p>Yardage for dining chairs.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Chairs</label><input type="number" className="input-field" value={seats} onChange={e=>sS(e.target.value)} min="1"/></div><div className="input-group"><label className="input-label">Type</label><select className="input-field" value={type} onChange={e=>sT(e.target.value)}><option value="seat-only">Seat only</option><option value="seat-back">Seat + back</option><option value="full">Full upholstery</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/home-decor" className="related-tool-link">🏠 All Home</a></div></aside></div></div>);}