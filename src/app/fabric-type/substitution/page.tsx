"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, RefreshCw, Scale } from "lucide-react";
export default function Page(){
const[original,sO]=useState("quilting-cotton");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const subs:Record<string,string>={["quilting-cotton"]:"Poplin, broadcloth, cotton lawn, or cotton sateen",silk:"Rayon, polyester satin, Tencel, or silk blends",wool:"Wool blends, melton, ponte (for structured), or boiled wool",denim:"Twill, bull denim, canvas, or heavy cotton drill",linen:"Linen blends, cotton-linen, or Tencel linen",chiffon:"Georgette, organza, or polyester chiffon"};const sub=subs[original]||"Check weight and drape match";const hasResult=true;const resultValue="alternatives: "+sub;const resultLabel="match weight, drape, and care requirements";
const faqItems=[{q:"Can I substitute any fabric?",a:"Match the weight and drape of the original. Test drape by holding against your body before cutting."}];
return(<div className="container"><Breadcrumb items={[{label:"Fabric Type",href:"/fabric-type"},{label:"Fabric Substitution"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><RefreshCw size={14} strokeWidth={1.5} /> Fabric #421</span><h1>Fabric Substitution</h1><p>Find alternative fabrics.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Original fabric</label><select className="input-field" value={original} onChange={e=>sO(e.target.value)}><option value="quilting-cotton">Quilting cotton</option><option value="silk">Silk</option><option value="wool">Wool</option><option value="denim">Denim</option><option value="linen">Linen</option><option value="chiffon">Chiffon</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/fabric-type" className="related-tool-link"><Scale size={13} /> All Fabric Type</a></div></aside></div></div>);}