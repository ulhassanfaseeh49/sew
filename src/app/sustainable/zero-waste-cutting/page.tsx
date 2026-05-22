"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Recycle, Scissors } from "lucide-react";
export default function Page(){
const[project,sP]=useState("top");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const tips:Record<string,{technique:string,savings:string}>={top:{technique:"Rectangle-based construction, kimono sleeves, no curved seams",savings:"~95% fabric utilization"},dress:{technique:"T-shape or cross-shape cutting from single rectangle",savings:"~90% fabric utilization"},pants:{technique:"Hakama/wide-leg from rectangles, minimal shaping",savings:"~85% fabric utilization"},skirt:{technique:"Wrap or rectangle skirts, gathered from full width",savings:"~95% fabric utilization"}};const t2=tips[project]||tips.top;const hasResult=true;const resultValue=t2.savings;const resultLabel=t2.technique;
const faqItems=[{q:"What is zero-waste sewing?",a:"Designing patterns that use 100% of the fabric rectangle with no scraps. Based on geometric shapes."}];
return(<div className="container"><Breadcrumb items={[{label:"Sustainable",href:"/sustainable"},{label:"Zero-Waste Cutting Guide"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} strokeWidth={1.5} /> Eco #451</span><h1>Zero-Waste Cutting Guide</h1><p>Zero-waste cutting techniques.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Project type</label><select className="input-field" value={project} onChange={e=>sP(e.target.value)}><option value="top">Top/blouse</option><option value="dress">Dress</option><option value="pants">Pants</option><option value="skirt">Skirt</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/sustainable" className="related-tool-link"><Recycle size={13} /> All Sustainable</a></div></aside></div></div>);}