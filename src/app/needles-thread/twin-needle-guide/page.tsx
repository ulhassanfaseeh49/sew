"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Link, Printer, Scissors } from "lucide-react";
export default function Page(){
const[spacing,sS]=useState("4");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const info:Record<string,{use:string,size:string}>={1.6:{use:"Pintucks, delicate fabrics, decorative",size:"Use with 70/10 or 75/11"},2.5:{use:"Narrow hems, lightweight knits",size:"Use with 75/11 or 80/12"},3:{use:"General hemming, casual wear",size:"Use with 80/12"},4:{use:"Standard knit hems (T-shirts, activewear)",size:"Use with 80/12 or 90/14"},6:{use:"Wide decorative topstitching",size:"Use with 80/12 (check stitch plate width!)"}};const i2=info[spacing]||info[4];const hasResult=true;const resultValue=spacing+"mm twin needle";const resultLabel=i2.use+" | "+i2.size;
const faqItems=[{q:"Can I use twin needles on any machine?",a:"Most zigzag machines support twin needles. Check your stitch plate width — the needles must clear the hole."}];
return(<div className="container"><Breadcrumb items={[{label:"Needles & Thread",href:"/needles-thread"},{label:"Twin Needle Guide"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Link size={14} strokeWidth={1.5} /> Needle #437</span><h1>Twin Needle Guide</h1><p>Twin needle sizes and uses.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Needle spacing (mm)</label><select className="input-field" value={spacing} onChange={e=>sS(e.target.value)}><option value="1.6">1.6mm (narrow)</option><option value="2.5">2.5mm</option><option value="3">3mm</option><option value="4">4mm (standard)</option><option value="6">6mm (wide)</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/needles-thread" className="related-tool-link"><Scissors size={13} /> All Needles</a></div></aside></div></div>);}