"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { BookOpen, ClipboardCopy, Printer } from "lucide-react";
export default function Page(){
const[location,sL]=useState("hem");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const tips:Record<string,string>={hem:"Apply trim along the finished hem edge. Can be topstitched or sandwiched in the hem fold.",yoke:"Insert trim in the yoke seam while sewing. Pin trim to right side of one piece before joining.",collar:"Apply trim to the outer collar edge before attaching to the neckline.",cuff:"Sandwich trim in the cuff seam or topstitch to the finished cuff edge.",center:"Apply along the center front opening overlapping the edge by the trim header width."};const tip=tips[location]||tips.hem;const hasResult=true;const resultValue=location+" trim placement";const resultLabel=tip;
const faqItems=[{q:"Where should I place trim on a garment?",a:"Common spots: hem, neckline, cuffs, yoke seams, center front, and pocket edges."}];
return(<div className="container"><Breadcrumb items={[{label:"Lace & Trim",href:"/lace-trim"},{label:"Trim Placement Guide"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><BookOpen size={14} strokeWidth={1.5} /> Trim #330</span><h1>Trim Placement Guide</h1><p>Visual guide for trim placement.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Placement</label><select className="input-field" value={location} onChange={e=>sL(e.target.value)}><option value="hem">Hem edge</option><option value="yoke">Yoke seam</option><option value="collar">Collar edge</option><option value="cuff">Cuff edge</option><option value="center">Center front</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/lace-trim" className="related-tool-link"> All Trim</a></div></aside></div></div>);}