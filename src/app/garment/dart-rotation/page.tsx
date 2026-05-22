"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, RefreshCw, Shirt } from "lucide-react";
export default function Page(){
const[from,sF]=useState("waist");const[to,sT]=useState("shoulder");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const hasResult=true;const resultValue=from+" → "+to+" dart";const resultLabel="slash the pattern from "+to+" to bust point, close "+from+" dart";
const faqItems=[{q:"Can any dart be rotated?",a:"Yes, all bust darts point to the bust apex. You can rotate the intake to any seam that touches the bust area."}];
return(<div className="container"><Breadcrumb items={[{label:"Garment Tools",href:"/garment"},{label:"Dart Rotation Tool"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><RefreshCw size={14} strokeWidth={1.5} /> Garment #203</span><h1>Dart Rotation Tool</h1><p>Guide for rotating darts to different positions.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Dart from</label><select className="input-field" value={from} onChange={e=>sF(e.target.value)}><option value="waist">Waist</option><option value="shoulder">Shoulder</option><option value="side">Side seam</option></select></div><div className="input-group"><label className="input-label">Rotate to</label><select className="input-field" value={to} onChange={e=>sT(e.target.value)}><option value="shoulder">Shoulder</option><option value="armhole">Armhole</option><option value="center">Center front</option><option value="french">French dart</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link"><Shirt size={13} /> All Garment</a></div></aside></div></div>);}