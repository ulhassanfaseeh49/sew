"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Shirt, TrendingUp } from "lucide-react";
export default function Page(){
const[grain,sG]=useState("straight");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const info:Record<string,{stretch:string,use:string}>={straight:{stretch:"Minimal stretch, most stable",use:"Most garment pieces, pants legs, shirt bodies"},cross:{stretch:"Slight stretch",use:"Waistbands, yokes, neckband facings"},bias:{stretch:"Maximum stretch (diagonal)",use:"Bias cuts, binding, draping, circular designs"}};const g=info[grain]||info.straight;const hasResult=true;const resultValue=grain+" grain";const resultLabel=g.stretch;
const faqItems=[{q:"Why does grain line matter?",a:"Fabric behaves differently on each grain. Wrong grain can cause twisting, sagging, or stretching."}];
return(<div className="container"><Breadcrumb items={[{label:"Garment Tools",href:"/garment"},{label:"Fabric Grain Line Guide"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><TrendingUp size={14} strokeWidth={1.5} /> Garment #228</span><h1>Fabric Grain Line Guide</h1><p>Guide for straight grain, cross grain, bias.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Grain type</label><select className="input-field" value={grain} onChange={e=>sG(e.target.value)}><option value="straight">Straight grain (lengthwise)</option><option value="cross">Cross grain (crosswise)</option><option value="bias">True bias (45°)</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Stretch</span><strong>{g.stretch}</strong></div><div className={styles.resultRow}><span>Best for</span><strong style={{fontWeight:"normal",fontSize:"0.85rem"}}>{g.use}</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link"><Shirt size={13} /> All Garment</a></div></aside></div></div>);}