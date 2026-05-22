"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { BookOpen, ClipboardCopy, Hash, Printer } from "lucide-react";
export default function Page(){
const[formula,sF]=useState("circle-radius");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const formulas:Record<string,{eq:string,example:string}>={["circle-radius"]:{eq:"radius = waist / (2 x pi x portion)",example:"28\" waist full circle: 28/(2×3.14×1) = 4.46\" radius"},["gather-ratio"]:{eq:"gathered width = finished width × ratio (1.5-3x)",example:"12\" panel at 2x: needs 24\" of fabric to gather"},ease:{eq:"pattern size = body measurement + ease",example:"36\" bust + 3\" ease = 39\" pattern bust"},bias:{eq:"cut width = (finished width × 2) + (2 × seam allowance)",example:"1/2\" binding finished: (0.5×2)+(2×0.25) = 1.5\" cut"},pleat:{eq:"fabric needed = finished width × multiplier (2-3x)",example:"28\" waist with knife pleats: 28 × 3 = 84\" fabric"},curtain:{eq:"fabric width = window width × fullness (2-2.5x)",example:"36\" window at 2.5x: 90\" total curtain width"}};const f=formulas[formula]||formulas["circle-radius"];const hasResult=true;const resultValue=f.eq;const resultLabel=f.example;
const faqItems=[{q:"Do I need to be good at math to sew?",a:"Basic arithmetic is enough. These formulas are simple once you understand what each variable means."}];
return(<div className="container"><Breadcrumb items={[{label:"Reference",href:"/reference"},{label:"Sewing Math Formulas"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Hash size={14} strokeWidth={1.5} /> Ref #484</span><h1>Sewing Math Formulas</h1><p>All sewing math formulas.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Formula</label><select className="input-field" value={formula} onChange={e=>sF(e.target.value)}><option value="circle-radius">Circle skirt radius</option><option value="gather-ratio">Gather ratio</option><option value="ease">Ease calculation</option><option value="bias">Bias strip width</option><option value="pleat">Pleat fabric calculation</option><option value="curtain">Curtain fullness</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/reference" className="related-tool-link"><BookOpen size={13} /> All Reference</a></div></aside></div></div>);}