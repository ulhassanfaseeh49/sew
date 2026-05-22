"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { BookOpen, ClipboardCopy, Printer, Star } from "lucide-react";
export default function Page(){
const[interest,sI]=useState("home");const[hasSerger,sS]=useState("no");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const recs:Record<string,{machine:string,hand:string}>={home:{machine:"Pillowcase or simple curtain panels",hand:"Hand-sewn coasters or napkins"},garments:{machine:"Elastic-waist pajama pants",hand:"Simple drawstring skirt"},quilting:{machine:"Patchwork pot holder (4 squares)",hand:"Hand-pieced mini quilt block"},accessories:{machine:"Zippered pouch or drawstring bag",hand:"Fabric bookmark or pin cushion"}};const r=recs[interest]||recs.home;const project=hasSerger==="yes"?r.machine:r.hand;const hasResult=true;const resultValue=project;const resultLabel="perfect first "+interest+" project for "+(hasSerger==="yes"?"machine":"hand")+" sewing";
const faqItems=[{q:"Why start simple?",a:"Building confidence with successful small projects motivates you to tackle bigger ones."}];
return(<div className="container"><Breadcrumb items={[{label:"Reference",href:"/reference"},{label:"First Project Recommender"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Star size={14} strokeWidth={1.5} /> Ref #477</span><h1>First Project Recommender</h1><p>Your first sewing project.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Main interest</label><select className="input-field" value={interest} onChange={e=>sI(e.target.value)}><option value="home">Home decor</option><option value="garments">Clothing</option><option value="quilting">Quilting</option><option value="accessories">Bags/accessories</option></select></div><div className="input-group"><label className="input-label">Have sewing machine?</label><select className="input-field" value={hasSerger} onChange={e=>sS(e.target.value)}><option value="yes">Yes</option><option value="no">No (hand sewing only)</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/reference" className="related-tool-link"><BookOpen size={13} /> All Reference</a></div></aside></div></div>);}