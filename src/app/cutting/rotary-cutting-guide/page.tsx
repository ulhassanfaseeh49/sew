"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[shape,sS]=useState("strip");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const guides: Record<string,{ruler:string,method:string}>={strip:{ruler:"6x24 ruler",method:"Fold fabric, align ruler at desired width, cut with rotary cutter."},square:{ruler:"Square ruler",method:"Cut strip to desired width, then cross-cut into squares."},hst:{ruler:"6x24 ruler",method:"Cut square, draw diagonal, sew 1/4 inch each side, cut on line."},rect:{ruler:"6x24 ruler",method:"Cut strip to desired height, then cross-cut to desired width."}};const g=guides[shape]||guides.strip;const hasResult=true;const resultValue=shape;const resultLabel="rotary cutting guide";
const faqItems=[{q:"What size rotary cutter should I use?",a:"45mm is most versatile. 28mm for curves and detail, 60mm for heavy fabrics and many layers."}];
return(<div className="container"><Breadcrumb items={[{label:"Cutting Tools",href:"/cutting"},{label:"Rotary Cutting Guide"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🔄</span> Cutting #177</span><h1>Rotary Cutting Guide</h1><p>Reference for rotary cutting common shapes.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Shape</label><select className="input-field" value={shape} onChange={e=>sS(e.target.value)}><option value="strip">Strips</option><option value="square">Squares</option><option value="hst">HST</option><option value="rect">Rectangles</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Ruler</span><strong>{g.ruler}</strong></div><div className={styles.resultRow}><span>Method</span><strong style={{fontWeight:"normal",fontSize:"0.85rem"}}>{g.method}</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/cutting" className="related-tool-link">✂️ All Cutting</a></div></aside></div></div>);}