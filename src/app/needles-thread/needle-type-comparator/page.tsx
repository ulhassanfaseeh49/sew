"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { BarChart3, ClipboardCopy, Printer, Scissors } from "lucide-react";
export default function Page(){
const[type,sT]=useState("universal");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const info:Record<string,{point:string,use:string}>={universal:{point:"Slightly rounded tip",use:"General purpose, woven and some knits"},ballpoint:{point:"Rounded tip (pushes between fibers)",use:"Knit fabrics — prevents snags and runs"},stretch:{point:"Special stretch tip",use:"Very stretchy knits, lycra, swimwear"},microtex:{point:"Very sharp fine tip",use:"Silk, microfiber, precise stitching"},jeans:{point:"Modified sharp, reinforced",use:"Heavy denim, canvas, multiple layers"},quilting:{point:"Tapered, thin",use:"Piecing through multiple cotton layers"},topstitch:{point:"Sharp with large eye",use:"Heavy thread topstitching, decorative work"},leather:{point:"Cutting/chisel tip",use:"Leather, vinyl, suede (makes clean holes)"}};const i2=info[type]||info.universal;const hasResult=true;const resultValue=type+" needle";const resultLabel=i2.point+" — "+i2.use;
const faqItems=[{q:"What needle should beginners start with?",a:"Universal 80/12 handles most woven fabrics. Add a ballpoint for knits and a jeans needle for heavy fabrics."}];
return(<div className="container"><Breadcrumb items={[{label:"Needles & Thread",href:"/needles-thread"},{label:"Needle Type Comparator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><BarChart3 size={14} strokeWidth={1.5} /> Needle #432</span><h1>Needle Type Comparator</h1><p>Compare needle types and uses.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Needle type</label><select className="input-field" value={type} onChange={e=>sT(e.target.value)}><option value="universal">Universal</option><option value="ballpoint">Ballpoint/jersey</option><option value="stretch">Stretch</option><option value="microtex">Microtex/sharp</option><option value="jeans">Jeans/denim</option><option value="quilting">Quilting</option><option value="topstitch">Topstitch</option><option value="leather">Leather</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/needles-thread" className="related-tool-link"><Scissors size={13} /> All Needles</a></div></aside></div></div>);}