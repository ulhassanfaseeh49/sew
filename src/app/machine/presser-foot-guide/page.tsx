"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Scissors } from "lucide-react";
export default function Page(){
const[task,sT]=useState("general");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const info:Record<string,{foot:string,note:string}>={general:{foot:"Standard/all-purpose foot",note:"Included with machine. For straight and zigzag."},zipper:{foot:"Zipper foot",note:"Narrow foot sews close to zipper teeth."},buttonhole:{foot:"Buttonhole foot",note:"Automatic 1-step or 4-step buttonholes."},["invisible-zip"]:{foot:"Invisible zipper foot",note:"Special grooves hold coils flat for invisible result."},walking:{foot:"Walking/even feed foot",note:"Feeds top and bottom layers evenly. Essential for quilting."},freeMotion:{foot:"Free-motion/darning foot",note:"Drop feed dogs. Move fabric freely for quilting designs."},quarter:{foot:"1/4\" piecing foot",note:"Guide for accurate quilting seams."}};const i2=info[task]||info.general;const hasResult=true;const resultValue=i2.foot;const resultLabel=i2.note;
const faqItems=[{q:"How many presser feet do I need?",a:"Start with all-purpose, zipper, and buttonhole. Add walking foot for quilting and blind hem foot."}];
return(<div className="container"><Breadcrumb items={[{label:"Machine",href:"/machine"},{label:"Presser Foot Guide"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Machine #442</span><h1>Presser Foot Guide</h1><p>Which foot to use for each task.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Task</label><select className="input-field" value={task} onChange={e=>sT(e.target.value)}><option value="general">General sewing</option><option value="zipper">Zipper installation</option><option value="buttonhole">Buttonhole</option><option value="invisible-zip">Invisible zipper</option><option value="walking">Quilting/layers</option><option value="freeMotion">Free-motion quilting</option><option value="quarter">1/4\" seam (quilting)</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/machine" className="related-tool-link"><Scissors size={13} /> All Machine</a></div></aside></div></div>);}