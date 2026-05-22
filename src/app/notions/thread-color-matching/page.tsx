"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Palette, Printer, Scissors } from "lucide-react";
export default function Page(){
const[method,sM]=useState("match");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const tips:Record<string,string>={match:"Choose thread that matches the dominant color when fabric is in motion.",blend:"Go one shade darker — it blends better than lighter thread.",contrast:"Use complementary colors for visible topstitching effect.",invisible:"Clear monofilament for light fabrics, smoke for dark fabrics."};const hasResult=true;const resultValue=method;const resultLabel=tips[method]||"";
const faqItems=[{q:"Should thread match exactly?",a:"A shade darker is better than lighter. Thread sinks into fabric and appears lighter once sewn."}];
return(<div className="container"><Breadcrumb items={[{label:"Notions",href:"/notions"},{label:"Thread Color Matching Guide"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Palette size={14} strokeWidth={1.5} /> Notion #183</span><h1>Thread Color Matching Guide</h1><p>Guide for choosing thread color.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Method</label><select className="input-field" value={method} onChange={e=>sM(e.target.value)}><option value="match">Exact match</option><option value="blend">Blend (slightly darker)</option><option value="contrast">Contrast/decorative</option><option value="invisible">Invisible/monofilament</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/notions" className="related-tool-link"><Scissors size={13} /> All Notions</a></div></aside></div></div>);}