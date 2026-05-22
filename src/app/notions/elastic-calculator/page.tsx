"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Scissors } from "lucide-react";
export default function Page(){
const[body,sB]=useState("");const[app,sA]=useState("waist");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const b=parseFloat(body)||0;const ratios:Record<string,{ratio:number,width:string}>={waist:{ratio:0.85,width:"1-2\""},cuff:{ratio:0.9,width:"1/4-1/2\""},neckline:{ratio:0.75,width:"1/4-3/8\""},leg:{ratio:0.85,width:"3/8-1/2\""}};const r=ratios[app]||ratios.waist;const elastic=b*r.ratio+1;const hasResult=b>0;const resultValue=elastic.toFixed(1)+"\" elastic";const resultLabel=app+" elastic ("+Math.round(r.ratio*100)+"% of body + 1\" overlap)";
const faqItems=[{q:"How tight should elastic be?",a:"Cut at 80-90% of body measurement for comfort. Test on your body before sewing in."}];
return(<div className="container"><Breadcrumb items={[{label:"Notions",href:"/notions"},{label:"Elastic Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Notion #192</span><h1>Elastic Calculator</h1><p>Elastic length and width by application.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Body measurement (in)</label><input type="number" className="input-field" placeholder="28" value={body} onChange={e=>sB(e.target.value)} min="0"/></div><div className="input-group"><label className="input-label">Application</label><select className="input-field" value={app} onChange={e=>sA(e.target.value)}><option value="waist">Waistband</option><option value="cuff">Cuff/sleeve</option><option value="neckline">Neckline</option><option value="leg">Leg opening</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Width</span><strong>{r.width}</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/notions" className="related-tool-link"><Scissors size={13} /> All Notions</a></div></aside></div></div>);}