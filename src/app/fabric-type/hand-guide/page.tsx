"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Scale } from "lucide-react";
export default function Page(){
const[hand,sH]=useState("crisp");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const info:Record<string,{examples:string,projects:string}>={crisp:{examples:"Taffeta, organza, cotton lawn, poplin",projects:"Structured dresses, shirts, tailored garments"},soft:{examples:"Flannel, jersey, double gauze, minky",projects:"Baby items, loungewear, pajamas, blankets"},fluid:{examples:"Rayon, silk charmeuse, crepe, viscose",projects:"Draped dresses, skirts, evening wear"},stiff:{examples:"Canvas, denim, buckram, duck cloth",projects:"Bags, upholstery, structured accessories"},lofty:{examples:"Fleece, batting, wool felt, boiled wool",projects:"Coats, blankets, stuffed animals, insulation"}};const i2=info[hand]||info.crisp;const hasResult=true;const resultValue=hand+" hand fabrics";const resultLabel=i2.examples;
const faqItems=[{q:"How do I feel fabric hand?",a:"Drape fabric over your hand. Crisp stands out. Fluid falls straight. Soft collapses gently."}];
return(<div className="container"><Breadcrumb items={[{label:"Fabric Type",href:"/fabric-type"},{label:"Fabric Hand Guide"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Fabric #424</span><h1>Fabric Hand Guide</h1><p>Crisp, soft, fluid fabric hand.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Fabric hand</label><select className="input-field" value={hand} onChange={e=>sH(e.target.value)}><option value="crisp">Crisp</option><option value="soft">Soft</option><option value="fluid">Fluid/drapey</option><option value="stiff">Stiff/structured</option><option value="lofty">Lofty/spongy</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/fabric-type" className="related-tool-link"><Scale size={13} /> All Fabric Type</a></div></aside></div></div>);}