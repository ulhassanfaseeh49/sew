"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { BarChart3, ClipboardCopy, Printer, Scale } from "lucide-react";
export default function Page(){
const[fabric,sF]=useState("quilting-cotton");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const data:Record<string,{gsm:string,cat:string,proj:string}>={chiffon:{gsm:"30-70",cat:"Sheer",proj:"Evening wear, overlays, scarves"},voile:{gsm:"60-100",cat:"Lightweight",proj:"Curtains, blouses, summer dresses"},lawn:{gsm:"70-100",cat:"Lightweight",proj:"Dresses, blouses, quilting"},["quilting-cotton"]:{gsm:"110-150",cat:"Light-medium",proj:"Quilts, totes, crafts"},poplin:{gsm:"120-150",cat:"Light-medium",proj:"Shirts, dresses, linings"},linen:{gsm:"150-250",cat:"Medium",proj:"Garments, home décor, bags"},denim:{gsm:"200-400",cat:"Medium-heavy",proj:"Jeans, jackets, bags"},canvas:{gsm:"300-600",cat:"Heavy",proj:"Bags, upholstery, outdoor"},fleece:{gsm:"200-350",cat:"Medium-heavy",proj:"Blankets, jackets, loungewear"}};const d=data[fabric]||data["quilting-cotton"];const hasResult=true;const resultValue=d.gsm+" GSM ("+d.cat+")";const resultLabel=d.proj;
const faqItems=[{q:"What GSM is quilting cotton?",a:"Quilting cotton is typically 110-150 GSM, classified as light to medium weight."}];
return(<div className="container"><Breadcrumb items={[{label:"Fabric Type",href:"/fabric-type"},{label:"Fabric Weight Comparator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><BarChart3 size={14} strokeWidth={1.5} /> Fabric #417</span><h1>Fabric Weight Comparator</h1><p>Compare fabric weights by category.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Fabric type</label><select className="input-field" value={fabric} onChange={e=>sF(e.target.value)}><option value="chiffon">Chiffon</option><option value="voile">Voile</option><option value="lawn">Lawn</option><option value="quilting-cotton">Quilting cotton</option><option value="poplin">Poplin</option><option value="linen">Linen</option><option value="denim">Denim</option><option value="canvas">Canvas</option><option value="fleece">Fleece</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/fabric-type" className="related-tool-link"><Scale size={13} /> All Fabric Type</a></div></aside></div></div>);}