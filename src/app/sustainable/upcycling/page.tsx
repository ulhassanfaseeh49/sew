"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Recycle, RefreshCw } from "lucide-react";
export default function Page(){
const[garment,sG]=useState("shirt");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const ideas:Record<string,{projects:string,fabric:string}>={shirt:{projects:"Baby dress, tote bag, pillow cover, apron, face masks",fabric:"~1.5 yards usable fabric"},jeans:{projects:"Bag, skirt, cushion cover, coasters, pencil case",fabric:"~1 yard denim (minus seams)"},dress:{projects:"Skirt, top, baby clothing, headbands, scrunchies",fabric:"~2 yards depending on size"},sweater:{projects:"Mittens, hat, pillow cover, stuffed animal, boot cuffs",fabric:"~1 yard knit fabric"},sheets:{projects:"Curtains, pillow cases, tote bags, aprons, quilt backing",fabric:"~4-6 yards usable fabric"}};const i2=ideas[garment]||ideas.shirt;const hasResult=true;const resultValue=i2.fabric;const resultLabel=i2.projects;
const faqItems=[{q:"Is upcycling worth the effort?",a:"Yes! It saves money, reduces textile waste, and creates unique one-of-a-kind items."}];
return(<div className="container"><Breadcrumb items={[{label:"Sustainable",href:"/sustainable"},{label:"Upcycling Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><RefreshCw size={14} strokeWidth={1.5} /> Eco #456</span><h1>Upcycling Calculator</h1><p>New items from old garments.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Old garment</label><select className="input-field" value={garment} onChange={e=>sG(e.target.value)}><option value="shirt">Mens shirt</option><option value="jeans">Jeans</option><option value="dress">Dress</option><option value="sweater">Sweater</option><option value="sheets">Bed sheets</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/sustainable" className="related-tool-link"><Recycle size={13} /> All Sustainable</a></div></aside></div></div>);}