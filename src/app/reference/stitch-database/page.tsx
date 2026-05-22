"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { BookOpen, ClipboardCopy, Printer, Scissors } from "lucide-react";
export default function Page(){
const[stitch,sS]=useState("straight");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const info:Record<string,{setting:string,use:string}>={straight:{setting:"Length 2.5mm, width 0",use:"Seaming wovens, topstitching, most sewing"},zigzag:{setting:"Length 2.0mm, width 2-5mm",use:"Stretch seams, finishing edges, appliqué"},backstitch:{setting:"Hand needle, any thread",use:"Strongest hand stitch, repairs, hems"},blanket:{setting:"Hand or machine decorative",use:"Edges, appliqué, fleece finishing"},overcast:{setting:"Length 2.0mm, width 5mm",use:"Edge finishing to prevent fraying"},basting:{setting:"Length 4-5mm, width 0",use:"Temporary stitching, gathering, fitting"}};const i2=info[stitch]||info.straight;const hasResult=true;const resultValue=stitch+" stitch";const resultLabel=i2.setting+" — "+i2.use;
const faqItems=[{q:"What stitch is used most?",a:"Straight stitch for 90% of sewing. Zigzag for knits and finishing. Backstitch for hand sewing."}];
return(<div className="container"><Breadcrumb items={[{label:"Reference",href:"/reference"},{label:"Stitch Database"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} strokeWidth={1.5} /> Ref #463</span><h1>Stitch Database</h1><p>Stitch types and machine settings.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Stitch type</label><select className="input-field" value={stitch} onChange={e=>sS(e.target.value)}><option value="straight">Straight stitch</option><option value="zigzag">Zigzag</option><option value="backstitch">Backstitch (hand)</option><option value="blanket">Blanket stitch</option><option value="overcast">Overcast</option><option value="basting">Basting</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/reference" className="related-tool-link"><BookOpen size={13} /> All Reference</a></div></aside></div></div>);}