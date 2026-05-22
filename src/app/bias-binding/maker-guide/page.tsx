"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Ribbon, Wrench } from "lucide-react";
export default function Page(){
const[finW,sF]=useState("0.5");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const makers:Record<string,{maker:string,cutW:string}>={0.25:{maker:"6mm maker",cutW:"3/4\""},0.5:{maker:"12mm maker",cutW:"1\""},0.75:{maker:"18mm maker",cutW:"1-3/8\""},1:{maker:"25mm maker",cutW:"1-3/4\""},2:{maker:"50mm maker",cutW:"3-1/2\""}};const mk=makers[finW]||makers["0.5"];const hasResult=true;const resultValue=mk.maker;const resultLabel="cut strips "+mk.cutW+" wide";
const faqItems=[{q:"Do I need a bias tape maker?",a:"Not required but makes it much faster and more consistent. They fold the edges as you press."}];
return(<div className="container"><Breadcrumb items={[{label:"Bias Binding",href:"/bias-binding"},{label:"Bias Tape Maker Guide"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Wrench size={14} strokeWidth={1.5} /> Bias #288</span><h1>Bias Tape Maker Guide</h1><p>Which maker size to use.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Desired finished width</label><select className="input-field" value={finW} onChange={e=>sF(e.target.value)}><option value="0.25">1/4\" (6mm)</option><option value="0.5">1/2\" (12mm)</option><option value="0.75">3/4\" (18mm)</option><option value="1">1\" (25mm)</option><option value="2">2\" (50mm)</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Maker size</span><strong>{mk.maker}</strong></div><div className={styles.resultRow}><span>Cut width</span><strong>{mk.cutW}</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/bias-binding" className="related-tool-link"><Ribbon size={13} /> All Bias</a></div></aside></div></div>);}