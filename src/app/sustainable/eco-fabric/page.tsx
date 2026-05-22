"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Leaf, Printer, Recycle } from "lucide-react";
export default function Page(){
const[fabric,sF]=useState("organic-cotton");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const info:Record<string,{water:string,rating:string,note:string}>={["organic-cotton"]:{water:"Medium",rating:"Good",note:"No pesticides but still water-intensive"},tencel:{water:"Low",rating:"Excellent",note:"Closed-loop production, biodegradable"},hemp:{water:"Very low",rating:"Excellent",note:"Minimal water, no pesticides, fast growing"},bamboo:{water:"Low (plant)",rating:"Moderate",note:"Plant is eco but processing can use chemicals"},["recycled-poly"]:{water:"Low",rating:"Good",note:"Diverts plastic from landfill, still sheds microfibers"},linen:{water:"Low",rating:"Very good",note:"Flax is naturally low-impact, long lasting"}};const i2=info[fabric]||info["organic-cotton"];const hasResult=true;const resultValue=fabric.replace(/-/g," ")+" — "+i2.rating;const resultLabel="water usage: "+i2.water+" | "+i2.note;
const faqItems=[{q:"What is the most eco-friendly fabric?",a:"Hemp and linen have the lowest environmental impact. Tencel is the best semi-synthetic option."}];
return(<div className="container"><Breadcrumb items={[{label:"Sustainable",href:"/sustainable"},{label:"Eco-Fabric Comparator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Leaf size={14} strokeWidth={1.5} /> Eco #454</span><h1>Eco-Fabric Comparator</h1><p>Compare eco-friendly fabrics.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Eco fabric</label><select className="input-field" value={fabric} onChange={e=>sF(e.target.value)}><option value="organic-cotton">Organic cotton</option><option value="tencel">Tencel/lyocell</option><option value="hemp">Hemp</option><option value="bamboo">Bamboo</option><option value="recycled-poly">Recycled polyester</option><option value="linen">Linen</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/sustainable" className="related-tool-link"><Recycle size={13} /> All Sustainable</a></div></aside></div></div>);}