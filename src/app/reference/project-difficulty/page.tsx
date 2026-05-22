"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { BarChart3, BookOpen, ClipboardCopy, Printer } from "lucide-react";
export default function Page(){
const[project,sP]=useState("pillowcase");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const info:Record<string,{level:string,skills:string,time:string}>={pillowcase:{level:" Beginner",skills:"Straight seams only",time:"30-60 min"},tote:{level:" Easy",skills:"Straight seams, handles, boxed corners",time:"2-3 hours"},apron:{level:" Easy",skills:"Seams, ties, pockets",time:"2 hours"},skirt:{level:" Intermediate",skills:"Zipper, waistband, hemming",time:"3-5 hours"},shirt:{level:" Advanced",skills:"Buttonholes, collar, cuffs, fitting",time:"8-12 hours"},dress:{level:" Advanced",skills:"Fitting, darts, zipper, facing",time:"10-15 hours"},jacket:{level:" Expert",skills:"Tailoring, lining, welt pockets",time:"20-30 hours"},coat:{level:" Expert",skills:"Heavy fabrics, lining, bound buttonholes",time:"30-50 hours"}};const i2=info[project]||info.pillowcase;const hasResult=true;const resultValue=i2.level;const resultLabel="skills: "+i2.skills+" | time: "+i2.time;
const faqItems=[{q:"What should my first sewing project be?",a:"A pillowcase — straight seams only, instant gratification, and useful result."}];
return(<div className="container"><Breadcrumb items={[{label:"Reference",href:"/reference"},{label:"Project Difficulty Guide"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><BarChart3 size={14} strokeWidth={1.5} /> Ref #476</span><h1>Project Difficulty Guide</h1><p>Difficulty ratings for projects.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Project</label><select className="input-field" value={project} onChange={e=>sP(e.target.value)}><option value="pillowcase">Pillowcase</option><option value="tote">Tote bag</option><option value="apron">Apron</option><option value="skirt">Simple skirt</option><option value="shirt">Button-up shirt</option><option value="dress">Fitted dress</option><option value="jacket">Tailored jacket</option><option value="coat">Coat</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/reference" className="related-tool-link"><BookOpen size={13} /> All Reference</a></div></aside></div></div>);}