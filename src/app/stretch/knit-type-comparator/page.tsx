"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Scale, Scissors } from "lucide-react";
export default function Page(){
const[type,sT]=useState("jersey");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const info:Record<string,{stretch:string,weight:string,use:string}>={jersey:{stretch:"25-50%",weight:"Light-medium",use:"T-shirts, dresses, linings"},interlock:{stretch:"25-35%",weight:"Medium",use:"Baby clothes, better T-shirts"},rib:{stretch:"50-100%",weight:"Medium",use:"Cuffs, neckbands, fitted tops"},ponte:{stretch:"15-25%",weight:"Medium-heavy",use:"Pants, blazers, structured garments"},["french-terry"]:{stretch:"25-40%",weight:"Medium-heavy",use:"Sweatshirts, joggers, casual wear"},sweater:{stretch:"20-40%",weight:"Medium-heavy",use:"Sweaters, cardigans, cozy layers"}};const i2=info[type]||info.jersey;const hasResult=true;const resultValue=type;const resultLabel=i2.use;
const faqItems=[{q:"Which knit curls least?",a:"Interlock and ponte curls the least. Single jersey curls most at the edges."}];
return(<div className="container"><Breadcrumb items={[{label:"Stretch",href:"/stretch"},{label:"Knit Type Comparator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Scale size={14} strokeWidth={1.5} /> Stretch #303</span><h1>Knit Type Comparator</h1><p>Jersey vs interlock vs rib.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Knit type</label><select className="input-field" value={type} onChange={e=>sT(e.target.value)}><option value="jersey">Single jersey</option><option value="interlock">Interlock</option><option value="rib">Rib knit</option><option value="ponte">Ponte/double knit</option><option value="french-terry">French terry</option><option value="sweater">Sweater knit</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Stretch</span><strong>{i2.stretch}</strong></div><div className={styles.resultRow}><span>Weight</span><strong>{i2.weight}</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/stretch" className="related-tool-link"><Scissors size={13} /> All Stretch</a></div></aside></div></div>);}