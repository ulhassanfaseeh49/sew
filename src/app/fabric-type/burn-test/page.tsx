"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Flame, Printer, Scale } from "lucide-react";
export default function Page(){
const[result,sR]=useState("burns-ash");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const info:Record<string,{fiber:string,detail:string}>={["burns-ash"]:{fiber:"Cotton or linen (cellulose)",detail:"Burns steadily, smells like burning paper, leaves soft gray ash."},["melts-bead"]:{fiber:"Polyester or nylon (synthetic)",detail:"Melts and drips. Hard plastic bead. Chemical smell. Self-extinguishes."},["burns-curl"]:{fiber:"Silk or wool (protein)",detail:"Burns slowly, curls away from flame. Smells like burning hair."},["self-extinguish"]:{fiber:"Treated or blend",detail:"May be fire-retardant treated or a blend. Test with other methods."}};const i2=info[result]||info["burns-ash"];const hasResult=true;const resultValue="likely: "+i2.fiber;const resultLabel=i2.detail;
const faqItems=[{q:"Is the burn test safe?",a:"Use a small swatch in a fireproof dish. Work in ventilated area. Have water nearby. Never test whole fabric."}];
return(<div className="container"><Breadcrumb items={[{label:"Fabric Type",href:"/fabric-type"},{label:"Burn Test Guide"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Flame size={14} strokeWidth={1.5} /> Fabric #425</span><h1>Burn Test Guide</h1><p>Identify fibers by burn test.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Burn result</label><select className="input-field" value={result} onChange={e=>sR(e.target.value)}><option value="burns-ash">Burns, gray ash (paper smell)</option><option value="melts-bead">Melts into hard bead</option><option value="burns-curl">Burns and curls away</option><option value="self-extinguish">Self-extinguishes</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/fabric-type" className="related-tool-link"><Scale size={13} /> All Fabric Type</a></div></aside></div></div>);}