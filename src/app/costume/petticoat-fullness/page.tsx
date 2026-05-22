"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Drama, Printer } from "lucide-react";
export default function Page(){
const[waist,sW]=useState("");const[length,sL]=useState("24");const[fullness,sF]=useState("3");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const w=parseFloat(waist)||0;const l=parseFloat(length)||24;const f=parseFloat(fullness)||3;const hemCirc=w*f;const widths=Math.ceil(hemCirc/44);const yd=Math.ceil(widths*(l+4)/36*4)/4;const hasResult=w>0;const resultValue=yd+" yards";const resultLabel=widths+" widths at "+f+"x fullness";
const faqItems=[{q:"How full should a petticoat be?",a:"3x for standard skirt support, 4x for dramatic Victorian or ball gown volume."}];
return(<div className="container"><Breadcrumb items={[{label:"Costume",href:"/costume"},{label:"Petticoat Fullness Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Costume #336</span><h1>Petticoat Fullness Calculator</h1><p>Fabric for petticoats.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Waist (in)</label><input type="number" className="input-field" placeholder="28" value={waist} onChange={e=>sW(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Length (in)</label><input type="number" className="input-field" value={length} onChange={e=>sL(e.target.value)}/></div><div className="input-group"><label className="input-label">Fullness ratio</label><select className="input-field" value={fullness} onChange={e=>sF(e.target.value)}><option value="2">2x (moderate)</option><option value="3">3x (full)</option><option value="4">4x (very full)</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/costume" className="related-tool-link"><Drama size={13} /> All Costume</a></div></aside></div></div>);}