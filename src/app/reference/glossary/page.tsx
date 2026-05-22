"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { BookOpen, ClipboardCopy, Printer } from "lucide-react";
export default function Page(){
const[letter,sL]=useState("B");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const terms:Record<string,string>={A:"Appliqué — decorating fabric by sewing pieces on top",B:"Bias — 45° angle to grain; Bobbin — lower thread spool; Basting — temporary long stitches",C:"Casing — fabric tunnel for elastic/drawstring; Clipping — cutting into seam allowance on curves",D:"Dart — folded wedge for shaping; Drape — how fabric hangs",E:"Ease — extra space added beyond body measurement for comfort",F:"Facing — fabric that finishes a raw edge (neckline, armhole)",G:"Grain — direction of fabric threads; Gathering — pulling fabric into fullness",S:"Selvage — finished edge of fabric; Seam allowance — fabric between stitch line and edge"};const def=terms[letter]||"Select a letter";const hasResult=true;const resultValue=letter+" terms";const resultLabel=def;
const faqItems=[{q:"What sewing terms should beginners know?",a:"RST (right sides together), SA (seam allowance), WOF (width of fabric), and selvage are essential."}];
return(<div className="container"><Breadcrumb items={[{label:"Reference",href:"/reference"},{label:"Sewing Glossary"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><BookOpen size={14} strokeWidth={1.5} /> Ref #461</span><h1>Sewing Glossary</h1><p>A-Z sewing terminology.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Browse by letter</label><select className="input-field" value={letter} onChange={e=>sL(e.target.value)}><option>A</option><option>B</option><option>C</option><option>D</option><option>E</option><option>F</option><option>G</option><option>S</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/reference" className="related-tool-link"><BookOpen size={13} /> All Reference</a></div></aside></div></div>);}