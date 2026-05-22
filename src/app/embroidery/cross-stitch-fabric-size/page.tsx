"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Ruler, Scissors } from "lucide-react";
export default function Page(){
const[designW,sW]=useState("");const[designH,sH]=useState("");const[margin,sM]=useState("3");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const w=parseFloat(designW)||0;const h=parseFloat(designH)||0;const mg=parseFloat(margin)||3;const cutW=w+mg*2;const cutH=h+mg*2;const hasResult=w>0&&h>0;const resultValue=Math.ceil(cutW)+"\" × "+Math.ceil(cutH)+"\"";const resultLabel="includes "+mg+"\" margin on each side for framing";
const faqItems=[{q:"How much margin do I need?",a:"3 inches minimum on each side for framing. More for larger projects or decorative mats."}];
return(<div className="container"><Breadcrumb items={[{label:"Embroidery",href:"/embroidery"},{label:"Cross-Stitch Fabric Size"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Embroidery #316</span><h1>Cross-Stitch Fabric Size</h1><p>Fabric piece size needed.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Design width (in)</label><input type="number" className="input-field" placeholder="7" value={designW} onChange={e=>sW(e.target.value)}/></div><div className="input-group"><label className="input-label">Design height (in)</label><input type="number" className="input-field" placeholder="5" value={designH} onChange={e=>sH(e.target.value)}/></div><div className="input-group"><label className="input-label">Margin each side (in)</label><input type="number" className="input-field" value={margin} onChange={e=>sM(e.target.value)}/></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/embroidery" className="related-tool-link"><Scissors size={13} /> All Embroidery</a></div></aside></div></div>);}