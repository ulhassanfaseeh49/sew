"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Scissors } from "lucide-react";
export default function Page(){
const[fabric,sF]=useState("jersey");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const settings:Record<string,{diff:string,note:string}>={jersey:{diff:"1.3-1.5",note:"Prevents wavy seams on single jersey"},rib:{diff:"1.5-2.0",note:"High setting for stretchy rib knits"},interlock:{diff:"1.0-1.3",note:"Stable knit, minimal adjustment needed"},swimwear:{diff:"1.5-2.0",note:"High differential + use woolly nylon in loopers"},fleece:{diff:"1.0-1.3",note:"Low setting, fleece is stable"}};const s=settings[fabric]||settings.jersey;const hasResult=true;const resultValue="Differential feed: "+s.diff;const resultLabel=s.note;
const faqItems=[{q:"What is differential feed?",a:"It controls how fast the front and back feed dogs move fabric. Higher = more gathering = less stretching."}];
return(<div className="container"><Breadcrumb items={[{label:"Stretch",href:"/stretch"},{label:"Differential Feed Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Stretch #306</span><h1>Differential Feed Calculator</h1><p>Serger settings for knits.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Fabric type</label><select className="input-field" value={fabric} onChange={e=>sF(e.target.value)}><option value="jersey">Jersey</option><option value="rib">Rib knit</option><option value="interlock">Interlock</option><option value="swimwear">Swimwear/lycra</option><option value="fleece">Fleece</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/stretch" className="related-tool-link"><Scissors size={13} /> All Stretch</a></div></aside></div></div>);}