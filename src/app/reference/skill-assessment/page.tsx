"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { BookOpen, ClipboardCopy, Printer, Target } from "lucide-react";
export default function Page(){
const[canStraight,sS]=useState("yes");const[canZip,sZ]=useState("no");const[canFit,sF]=useState("no");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const score=(canStraight==="yes"?1:0)+(canZip==="yes"?1:0)+(canFit==="yes"?1:0);const level=score===0?"Complete beginner":score===1?"Beginner":score===2?"Intermediate":"Advanced";const next=score===0?"Start with straight seams and simple projects":score===1?"Learn zippers, buttonholes, and curved seams":score===2?"Practice fitting, tailoring, and complex construction":"Explore couture techniques and pattern drafting";const hasResult=true;const resultValue=level;const resultLabel="next step: "+next;
const faqItems=[{q:"How long to become an intermediate sewist?",a:"With regular practice, 6-12 months. Completing 10-15 projects across different techniques accelerates learning."}];
return(<div className="container"><Breadcrumb items={[{label:"Reference",href:"/reference"},{label:"Skill Level Assessment"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Target size={14} strokeWidth={1.5} /> Ref #475</span><h1>Skill Level Assessment</h1><p>Test your sewing skill level.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Can sew straight seams?</label><select className="input-field" value={canStraight} onChange={e=>sS(e.target.value)}><option value="yes">Yes</option><option value="no">No</option></select></div><div className="input-group"><label className="input-label">Can insert zippers?</label><select className="input-field" value={canZip} onChange={e=>sZ(e.target.value)}><option value="yes">Yes</option><option value="no">No</option></select></div><div className="input-group"><label className="input-label">Can do pattern fitting?</label><select className="input-field" value={canFit} onChange={e=>sF(e.target.value)}><option value="yes">Yes</option><option value="no">No</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/reference" className="related-tool-link"><BookOpen size={13} /> All Reference</a></div></aside></div></div>);}