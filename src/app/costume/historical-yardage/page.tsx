"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[era,sE]=useState("victorian");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const data:Record<string,{outer:string,lining:string,note:string}>={medieval:{outer:"6-10 yd",lining:"4-6 yd",note:"Wool or linen, simple construction"},renaissance:{outer:"8-12 yd",lining:"6-8 yd",note:"Multiple layers, slashed sleeves"},elizabethan:{outer:"10-15 yd",lining:"8-10 yd",note:"Elaborate, boned bodice, farthingale"},regency:{outer:"4-6 yd",lining:"3-4 yd",note:"High waist, lightweight muslin or silk"},victorian:{outer:"10-14 yd",lining:"8-10 yd",note:"Bustle, multiple petticoats, boning"},edwardian:{outer:"8-12 yd",lining:"6-8 yd",note:"S-bend corset, trumpet skirt, lace"}};const d=data[era]||data.victorian;const hasResult=true;const resultValue=d.outer+" outer fabric";const resultLabel=d.lining+" lining | "+d.note;
const faqItems=[{q:"Which era uses the most fabric?",a:"Elizabethan and Victorian costumes use the most (10-15 yards) due to elaborate construction."}];
return(<div className="container"><Breadcrumb items={[{label:"Costume",href:"/costume"},{label:"Historical Costume Yardage"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>📜</span> Costume #347</span><h1>Historical Costume Yardage</h1><p>Yardage by historical era.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Historical era</label><select className="input-field" value={era} onChange={e=>sE(e.target.value)}><option value="medieval">Medieval (1100-1400)</option><option value="renaissance">Renaissance (1400-1600)</option><option value="elizabethan">Elizabethan (1558-1603)</option><option value="regency">Regency (1811-1820)</option><option value="victorian">Victorian (1837-1901)</option><option value="edwardian">Edwardian (1901-1910)</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/costume" className="related-tool-link">🎭 All Costume</a></div></aside></div></div>);}