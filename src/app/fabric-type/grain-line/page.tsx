"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Ruler, Scale } from "lucide-react";
export default function Page(){
const[topic,sT]=useState("straight");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const info:Record<string,{desc:string,use:string}>={straight:{desc:"Parallel to the selvage. Least stretch. Most stable direction.",use:"Most pattern pieces are cut on straight grain for stability."},cross:{desc:"Perpendicular to selvage. Slightly more stretch than straight grain.",use:"Occasionally used for borders, some garment pieces."},bias:{desc:"45° angle to selvage. Maximum stretch and drape.",use:"Bias-cut garments, binding tape, and pieces needing stretch."},selvage:{desc:"The finished edge of the fabric. Tightly woven, doesnt fray.",use:"Use as a reference edge. Do NOT include in patterns (it shrinks differently)."}};const i2=info[topic]||info.straight;const hasResult=true;const resultValue=topic+" grain";const resultLabel=i2.desc;
const faqItems=[{q:"Why does grain line matter?",a:"Wrong grain causes garments to twist, hang unevenly, or stretch out of shape. Always follow pattern grain lines."}];
return(<div className="container"><Breadcrumb items={[{label:"Fabric Type",href:"/fabric-type"},{label:"Grain Line Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Fabric #423</span><h1>Grain Line Calculator</h1><p>Identify grain direction.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Grain type</label><select className="input-field" value={topic} onChange={e=>sT(e.target.value)}><option value="straight">Straight grain (lengthwise)</option><option value="cross">Cross grain (widthwise)</option><option value="bias">True bias (45°)</option><option value="selvage">Selvage</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/fabric-type" className="related-tool-link"><Scale size={13} /> All Fabric Type</a></div></aside></div></div>);}