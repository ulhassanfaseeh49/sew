"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Ruler, Scissors } from "lucide-react";
export default function Page(){
const[fabric,sF]=useState("cotton");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const rec:Record<string,{mm:string,spi:string}>={sheer:{mm:"1.5-2.0",spi:"13-18"},cotton:{mm:"2.5",spi:"10-12"},knit:{mm:"2.5-3.0",spi:"8-10"},heavy:{mm:"3.0-3.5",spi:"7-8"},basting:{mm:"4.0-5.0",spi:"5-6"}};const r=rec[fabric]||rec.cotton;const hasResult=true;const resultValue=r.mm+"mm stitch length";const resultLabel=r.spi+" stitches per inch";
const faqItems=[{q:"What is the default stitch length?",a:"2.5mm is the standard for most fabrics. Shorter for delicate, longer for heavy or basting."}];
return(<div className="container"><Breadcrumb items={[{label:"Machine",href:"/machine"},{label:"Stitch Length Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Machine #438</span><h1>Stitch Length Calculator</h1><p>Stitch length by fabric and application.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Fabric type</label><select className="input-field" value={fabric} onChange={e=>sF(e.target.value)}><option value="sheer">Sheer/delicate</option><option value="cotton">Cotton/medium</option><option value="knit">Knit/stretch</option><option value="heavy">Heavy/denim</option><option value="basting">Basting</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/machine" className="related-tool-link"><Scissors size={13} /> All Machine</a></div></aside></div></div>);}