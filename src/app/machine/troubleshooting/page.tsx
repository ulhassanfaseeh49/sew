"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[problem,sP]=useState("thread-bunching");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const fixes:Record<string,string>={["thread-bunching"]:"1) Rethread the top thread completely. 2) Check bobbin is inserted correctly. 3) Hold thread tails when starting.",skipping:"1) Change the needle (its dull). 2) Use correct needle type for fabric. 3) Check needle is inserted fully.",["breaking-thread"]:"1) Rethread machine. 2) Check for burrs on needle plate. 3) Use quality thread. 4) Reduce tension.",["breaking-needle"]:"1) Dont pull fabric. 2) Use correct needle size. 3) Remove pins before they reach the foot.",puckering:"1) Reduce tension. 2) Use shorter stitch length. 3) Use appropriate needle size.",tension:"1) Rethread top and bobbin. 2) Clean lint from tension discs. 3) Adjust upper tension dial."};const fix=fixes[problem]||"Check machine manual.";const hasResult=true;const resultValue=problem.replace(/-/g," ");const resultLabel=fix;
const faqItems=[{q:"What causes most sewing machine problems?",a:"80% of problems are solved by rethreading, changing the needle, or cleaning lint from the bobbin area."}];
return(<div className="container"><Breadcrumb items={[{label:"Machine",href:"/machine"},{label:"Troubleshooting Tool"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🔧</span> Machine #446</span><h1>Troubleshooting Tool</h1><p>Fix common sewing machine problems.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Problem</label><select className="input-field" value={problem} onChange={e=>sP(e.target.value)}><option value="thread-bunching">Thread bunching underneath</option><option value="skipping">Skipped stitches</option><option value="breaking-thread">Thread breaking</option><option value="breaking-needle">Needle breaking</option><option value="puckering">Fabric puckering</option><option value="tension">Uneven tension</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/machine" className="related-tool-link">🧵 All Machine</a></div></aside></div></div>);}