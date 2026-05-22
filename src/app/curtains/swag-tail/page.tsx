"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[winW,sW]=useState("");const[swags,sS]=useState("1");const[tailLen,sT]=useState("36");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const w=parseFloat(winW)||0;const s=parseInt(swags)||1;const tl=parseFloat(tailLen)||36;const swagFabric=s*(w/s+24);const tailFabric=2*tl;const totalIn=swagFabric+tailFabric;const yd=Math.ceil(totalIn/36*4)/4;const hasResult=w>0;const resultValue=yd+" yards total";const resultLabel=s+" swag(s) + 2 tails";
const faqItems=[{q:"How wide should each swag be?",a:"Each swag should span no more than 40-48 inches for proper drape. Use multiple swags for wider windows."}];
return(<div className="container"><Breadcrumb items={[{label:"Curtains",href:"/curtains"},{label:"Swag and Tail Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🎀</span> Curtain #252</span><h1>Swag and Tail Calculator</h1><p>Fabric for swag and tail treatments.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Window width (in)</label><input type="number" className="input-field" placeholder="60" value={winW} onChange={e=>sW(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Number of swags</label><input type="number" className="input-field" value={swags} onChange={e=>sS(e.target.value)} min="1"/></div><div className="input-group"><label className="input-label">Tail length (in)</label><input type="number" className="input-field" value={tailLen} onChange={e=>sT(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/curtains" className="related-tool-link">🪟 All Curtains</a></div></aside></div></div>);}