"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Shirt } from "lucide-react";
export default function Page(){
const[waist,sW]=useState("");const[tiers,sT]=useState("3");const[totalLen,sL]=useState("24");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const w=parseFloat(waist)||0;const t2=parseInt(tiers)||3;const tl=parseFloat(totalLen)||24;const tierH=tl/t2;let totalYd=0;for(let i=0;i<t2;i++){const tw=w*Math.pow(1.5,i+1);const widths=Math.ceil(tw/44);totalYd+=widths*(tierH+2)/36;}const yd=Math.ceil(totalYd*4)/4;const hasResult=w>0;const resultValue=yd+" yards";const resultLabel=t2+" tiers, "+tierH.toFixed(0)+"\" each, graduated fullness";
const faqItems=[{q:"How do tiered skirts work?",a:"Each tier is wider than the one above (usually 1.5x) and gathered to fit the tier above it."}];
return(<div className="container"><Breadcrumb items={[{label:"Skirt",href:"/skirt"},{label:"Tiered Skirt Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Skirt #362</span><h1>Tiered Skirt Calculator</h1><p>Multi-tier prairie skirts.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Waist (in)</label><input type="number" className="input-field" placeholder="28" value={waist} onChange={e=>sW(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Tiers</label><input type="number" className="input-field" value={tiers} onChange={e=>sT(e.target.value)} min="2" max="5"/></div><div className="input-group"><label className="input-label">Total length (in)</label><input type="number" className="input-field" value={totalLen} onChange={e=>sL(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/skirt" className="related-tool-link"><Shirt size={13} /> All Skirts</a></div></aside></div></div>);}