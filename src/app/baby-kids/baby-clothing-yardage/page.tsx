"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { Baby, ClipboardCopy, Printer } from "lucide-react";
export default function Page(){
const[garment,sG]=useState("onesie");const[size,sS]=useState("6m");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const yds:Record<string,number>={onesie:0.5,romper:0.75,dress:1,pants:0.5,hat:0.25};const yd=yds[garment]||0.5;const hasResult=true;const resultValue=yd+" yards";const resultLabel=garment+" in size "+size;
const faqItems=[{q:"How much fabric for a baby onesie?",a:"About 1/2 yard for sizes NB-12m. Use knit fabric with snap tape for easy dressing."}];
return(<div className="container"><Breadcrumb items={[{label:"Baby & Kids",href:"/baby-kids"},{label:"Baby Clothing Yardage"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Baby #388</span><h1>Baby Clothing Yardage</h1><p>Yardage for baby garments.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Garment</label><select className="input-field" value={garment} onChange={e=>sG(e.target.value)}><option value="onesie">Onesie/bodysuit</option><option value="romper">Romper</option><option value="dress">Dress</option><option value="pants">Pants</option><option value="hat">Hat</option></select></div><div className="input-group"><label className="input-label">Size</label><select className="input-field" value={size} onChange={e=>sS(e.target.value)}><option value="nb">Newborn</option><option value="3m">3 months</option><option value="6m">6 months</option><option value="12m">12 months</option><option value="2t">2T</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/baby-kids" className="related-tool-link"><Baby size={13} /> All Baby</a></div></aside></div></div>);}