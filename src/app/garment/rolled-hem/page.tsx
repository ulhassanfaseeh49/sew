"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[method,sM]=useState("machine");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const info:Record<string,{width:string,allowance:string,tip:string}>={machine:{width:"1/8-3/16\"",allowance:"3/8\"",tip:"Use rolled hem presser foot. Trim and fold as you sew."},hand:{width:"1/16-1/8\"",allowance:"1/4\"",tip:"Roll tiny fold between fingers, slip stitch invisibly."},serger:{width:"1/8\"",allowance:"Trim automatically",tip:"Adjust differential feed for different fabrics."}};const i2=info[method]||info.machine;const hasResult=true;const resultValue=i2.width+" finished width";const resultLabel=method+" rolled hem";
const faqItems=[{q:"When should I use a rolled hem?",a:"On sheer and lightweight fabrics where a regular hem would be too bulky."}];
return(<div className="container"><Breadcrumb items={[{label:"Garment Tools",href:"/garment"},{label:"Rolled Hem Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🔄</span> Garment #213</span><h1>Rolled Hem Calculator</h1><p>Settings for machine or hand-rolled hems.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Method</label><select className="input-field" value={method} onChange={e=>sM(e.target.value)}><option value="machine">Machine (rolled hem foot)</option><option value="hand">Hand rolled</option><option value="serger">Serger rolled hem</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Allowance needed</span><strong>{i2.allowance}</strong></div><div className={styles.resultRow}><span>Tip</span><strong style={{fontWeight:"normal",fontSize:"0.85rem"}}>{i2.tip}</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link">👗 All Garment</a></div></aside></div></div>);}