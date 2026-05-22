"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[device,sD]=useState("13");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const sizes:Record<string,{w:number,h:number}>={11:{w:11,h:8},13:{w:13,h:9},14:{w:14,h:10},15:{w:15,h:10},16:{w:16,h:11}};const s=sizes[device]||sizes[13];const cutW=s.w+2;const cutH=s.h*2+3;const hasResult=true;const resultValue=cutW+"\" × "+cutH+"\" (outer + lining + batting)";const resultLabel="3 layers for "+device+"\" device";
const faqItems=[{q:"How much padding for a laptop sleeve?",a:"Use fusible fleece or 1/4 inch foam batting between outer and lining for protection."}];
return(<div className="container"><Breadcrumb items={[{label:"Bags",href:"/bags"},{label:"Laptop Sleeve Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>💻</span> Bag #380</span><h1>Laptop Sleeve Calculator</h1><p>Padded sleeves for laptops.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Device size</label><select className="input-field" value={device} onChange={e=>sD(e.target.value)}><option value="11">11\" tablet</option><option value="13">13\" laptop</option><option value="14">14\" laptop</option><option value="15">15\" laptop</option><option value="16">16\" laptop</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/bags" className="related-tool-link">👜 All Bags</a></div></aside></div></div>);}