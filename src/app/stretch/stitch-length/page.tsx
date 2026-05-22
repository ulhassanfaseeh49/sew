"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[stitch,sS]=useState("zigzag");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const info:Record<string,{length:string,width:string,use:string}>={zigzag:{length:"2-2.5mm",width:"1-1.5mm narrow",use:"Seams on basic knits"},stretch:{length:"2.5mm",width:"Built-in pattern",use:"Most stretch, reinforced seams"},twin:{length:"2.5-3mm",width:"4mm needle spacing",use:"Hems — creates professional finish"},overlock:{length:"2.5-3mm",width:"5mm cut width",use:"Seams + finishing in one pass"},coverstitch:{length:"3mm",width:"5-6mm",use:"Professional hems and necklines"}};const i2=info[stitch]||info.zigzag;const hasResult=true;const resultValue=stitch;const resultLabel=i2.use;
const faqItems=[{q:"Can I sew knits on a regular machine?",a:"Yes! Use a stretch needle, zigzag or stretch stitch, and reduce presser foot pressure."}];
return(<div className="container"><Breadcrumb items={[{label:"Stretch",href:"/stretch"},{label:"Knit Stitch Length Guide"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🧵</span> Stretch #305</span><h1>Knit Stitch Length Guide</h1><p>Stitch types for knit fabrics.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Stitch type</label><select className="input-field" value={stitch} onChange={e=>sS(e.target.value)}><option value="zigzag">Zigzag</option><option value="stretch">Stretch stitch (lightning)</option><option value="twin">Twin needle</option><option value="overlock">Overlock/serger</option><option value="coverstitch">Coverstitch</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Length</span><strong>{i2.length}</strong></div><div className={styles.resultRow}><span>Width</span><strong>{i2.width}</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/stretch" className="related-tool-link">🧶 All Stretch</a></div></aside></div></div>);}