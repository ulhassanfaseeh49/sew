"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Scale } from "lucide-react";
export default function Page(){
const[weave,sW]=useState("plain");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const info:Record<string,{desc:string,examples:string}>={plain:{desc:"Over-under-over-under pattern. Equal front and back. Most common weave.",examples:"Muslin, quilting cotton, voile, chiffon, taffeta"},twill:{desc:"Diagonal rib pattern. Strong and durable. Has a right and wrong side.",examples:"Denim, gabardine, tweed, drill, herringbone"},satin:{desc:"Long float threads create smooth, lustrous surface. Slippery to sew.",examples:"Satin, sateen, charmeuse, duchess satin"},basket:{desc:"Two or more threads woven as one. Checkerboard look.",examples:"Monk cloth, hopsack, oxford cloth"},jacquard:{desc:"Complex patterns woven into the fabric by a special loom.",examples:"Brocade, damask, tapestry, matelassé"}};const i2=info[weave]||info.plain;const hasResult=true;const resultValue=weave+" weave";const resultLabel=i2.desc;
const faqItems=[{q:"Does weave affect sewing?",a:"Yes. Satin weave is slippery (use pins/weights). Twill is stable. Jacquard may need pattern matching."}];
return(<div className="container"><Breadcrumb items={[{label:"Fabric Type",href:"/fabric-type"},{label:"Weave Type Guide"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Fabric #426</span><h1>Weave Type Guide</h1><p>Plain, twill, satin weaves.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Weave type</label><select className="input-field" value={weave} onChange={e=>sW(e.target.value)}><option value="plain">Plain weave</option><option value="twill">Twill weave</option><option value="satin">Satin weave</option><option value="basket">Basket weave</option><option value="jacquard">Jacquard</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/fabric-type" className="related-tool-link"><Scale size={13} /> All Fabric Type</a></div></aside></div></div>);}