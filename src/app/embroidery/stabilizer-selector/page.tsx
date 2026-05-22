"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Scissors } from "lucide-react";
export default function Page(){
const[fabric,sF]=useState("cotton");const[design,sD]=useState("medium");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const recs:Record<string,string>={cotton:"Tear-away stabilizer",knit:"Cut-away stabilizer (permanent support)",sheer:"Water-soluble (dissolves after stitching)",terry:"Cut-away + topping (water-soluble on top)",leather:"Self-adhesive tear-away (no hooping)"};const stab=recs[fabric]||recs.cotton;const hasResult=true;const resultValue=stab;const resultLabel="for "+fabric+" with "+design+" density design";
const faqItems=[{q:"Can I reuse stabilizer?",a:"No, use fresh stabilizer each time. Used stabilizer has holes and wont support the design evenly."}];
return(<div className="container"><Breadcrumb items={[{label:"Embroidery",href:"/embroidery"},{label:"Stabilizer Type Selector"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><ClipboardCopy size={14} strokeWidth={1.5} /> Embroidery #311</span><h1>Stabilizer Type Selector</h1><p>Pick the right stabilizer.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Fabric</label><select className="input-field" value={fabric} onChange={e=>sF(e.target.value)}><option value="cotton">Cotton/woven</option><option value="knit">Knit</option><option value="sheer">Sheer/organza</option><option value="terry">Terry/towel</option><option value="leather">Vinyl/leather</option></select></div><div className="input-group"><label className="input-label">Density</label><select className="input-field" value={design} onChange={e=>sD(e.target.value)}><option value="light">Light</option><option value="medium">Medium</option><option value="heavy">Heavy/dense</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/embroidery" className="related-tool-link"><Scissors size={13} /> All Embroidery</a></div></aside></div></div>);}