"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { BookOpen, ClipboardCopy, Printer } from "lucide-react";
export default function Page(){
const[issue,sI]=useState("tight-bust");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const fixes:Record<string,{cause:string,fix:string}>={["tight-bust"]:{cause:"Need larger cup size or more ease at bust",fix:"Do a Full Bust Adjustment (FBA). Add 1-2\" at center front."},["pulling-back"]:{cause:"Back is too narrow or too short",fix:"Add width at center back seam. Lengthen back bodice if rides up."},["shoulder-wide"]:{cause:"Pattern shoulders wider than your body",fix:"Take in shoulder seam equally from each side. Redraw armhole."},["waist-gap"]:{cause:"Waist pattern larger than your waist",fix:"Add darts or take in side seams at waist. Add elastic."},["hip-tight"]:{cause:"Need more room through hip area",fix:"Let out side seams below waist. Or size up and take in waist."},["sleeve-tight"]:{cause:"Upper arm or bicep larger than pattern",fix:"Slash and spread sleeve pattern at bicep. Add 1-2\" width."}};const i2=fixes[issue]||fixes["tight-bust"];const hasResult=true;const resultValue=issue.replace(/-/g," ");const resultLabel="cause: "+i2.cause;
const faqItems=[{q:"How do I know if my garment fits?",a:"No pulling, wrinkles, or strain lines. Moves with your body. Smooth across bust, back, and shoulders."}];
return(<div className="container"><Breadcrumb items={[{label:"Reference",href:"/reference"},{label:"Fitting Flowchart"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Ref #483</span><h1>Fitting Flowchart</h1><p>Diagnose and fix fitting problems.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Fitting issue</label><select className="input-field" value={issue} onChange={e=>sI(e.target.value)}><option value="tight-bust">Tight across bust</option><option value="pulling-back">Pulling at back</option><option value="shoulder-wide">Shoulders too wide</option><option value="waist-gap">Gaping at waist</option><option value="hip-tight">Tight at hips</option><option value="sleeve-tight">Sleeve too tight</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Fix</span><strong style={{fontWeight:"normal",fontSize:"0.85rem"}}>{i2.fix}</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/reference" className="related-tool-link"><BookOpen size={13} /> All Reference</a></div></aside></div></div>);}