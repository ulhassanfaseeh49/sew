"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[region,sR]=useState("us");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const info:Record<string,{sa:string,note:string}>={us:{sa:"5/8\" (1.6cm)",note:"Standard for Big 4 patterns (Simplicity, McCall, Butterick, Vogue)"},european:{sa:"1cm (3/8\")",note:"Burda and many European indie patterns use metric"},quilting:{sa:"1/4\" (0.6cm)",note:"Standard for all quilt piecing. Use 1/4 foot for accuracy."},knits:{sa:"3/8\" or 1/4\" (1cm or 0.6cm)",note:"Knit patterns often use smaller SA since fabric doesnt fray"}};const i2=info[region]||info.us;const hasResult=true;const resultValue=i2.sa;const resultLabel=i2.note;
const faqItems=[{q:"Why do different patterns have different seam allowances?",a:"Tradition and practicality. US uses 5/8\" for adjustability. Quilters use 1/4\" for precision."}];
return(<div className="container"><Breadcrumb items={[{label:"Reference",href:"/reference"},{label:"Seam Allowance Chart"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>📏</span> Ref #467</span><h1>Seam Allowance Chart</h1><p>Standard seam allowances.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Sewing tradition</label><select className="input-field" value={region} onChange={e=>sR(e.target.value)}><option value="us">US patterns</option><option value="european">European patterns</option><option value="quilting">Quilting</option><option value="knits">Knit garments</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/reference" className="related-tool-link">📚 All Reference</a></div></aside></div></div>);}