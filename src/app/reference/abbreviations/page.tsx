"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { BookOpen, ClipboardCopy, Printer } from "lucide-react";
export default function Page(){
const[abbr,sA]=useState("RST");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const defs:Record<string,string>={RST:"Right Sides Together — place fabric with printed/right sides facing each other",WST:"Wrong Sides Together — place fabric with wrong/back sides facing each other",WOF:"Width of Fabric — the full width from selvage to selvage (usually 44-60 inches)",SA:"Seam Allowance — the area between the stitching line and the raw edge",HST:"Half Square Triangle — a quilting unit made from two triangles",FPP:"Foundation Paper Piecing — quilting technique sewing on paper templates",UFO:"Un-Finished Object — a started but incomplete sewing project",WIP:"Work In Progress — a project currently being worked on",FQ:"Fat Quarter — 18×22 inch pre-cut fabric piece"};const def=defs[abbr]||"Unknown abbreviation";const hasResult=true;const resultValue=abbr;const resultLabel=def;
const faqItems=[{q:"What does RST mean?",a:"Right Sides Together — the most common instruction meaning place the pretty sides of fabric facing each other."}];
return(<div className="container"><Breadcrumb items={[{label:"Reference",href:"/reference"},{label:"Abbreviations Database"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Ref #465</span><h1>Abbreviations Database</h1><p>Sewing abbreviations.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Abbreviation</label><select className="input-field" value={abbr} onChange={e=>sA(e.target.value)}><option value="RST">RST</option><option value="WST">WST</option><option value="WOF">WOF</option><option value="SA">SA</option><option value="HST">HST</option><option value="FPP">FPP</option><option value="UFO">UFO</option><option value="WIP">WIP</option><option value="FQ">FQ</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/reference" className="related-tool-link"><BookOpen size={13} /> All Reference</a></div></aside></div></div>);}