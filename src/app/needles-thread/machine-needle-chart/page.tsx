"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[size,sS]=useState("80");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const rec:Record<string,{fabrics:string,projects:string}>={60:{fabrics:"Chiffon, organza, batiste",projects:"Delicate garments, heirloom sewing"},70:{fabrics:"Voile, lawn, georgette",projects:"Light blouses, lingerie"},75:{fabrics:"Lightweight knits, jersey",projects:"T-shirts, casual knit garments"},80:{fabrics:"Quilting cotton, poplin, broadcloth",projects:"Most garments, quilting, general sewing"},90:{fabrics:"Linen, gabardine, light denim",projects:"Heavier garments, medium-weight projects"},100:{fabrics:"Denim, canvas, upholstery",projects:"Jeans, bags, home décor"},110:{fabrics:"Heavy canvas, leather, multiple layers",projects:"Heavy-duty projects, outdoor gear"}};const r=rec[size]||rec[80];const hasResult=true;const resultValue=size+" needle";const resultLabel=r.fabrics;
const faqItems=[{q:"When should I change my needle?",a:"Every 6-8 hours of sewing, at the start of each new project, or immediately if it hits a pin."}];
return(<div className="container"><Breadcrumb items={[{label:"Needles & Thread",href:"/needles-thread"},{label:"Machine Needle Chart"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>📋</span> Needle #433</span><h1>Machine Needle Chart</h1><p>Complete needle reference chart.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Needle size</label><select className="input-field" value={size} onChange={e=>sS(e.target.value)}><option value="60">60/8 (finest)</option><option value="70">70/10</option><option value="75">75/11</option><option value="80">80/12 (standard)</option><option value="90">90/14</option><option value="100">100/16</option><option value="110">110/18</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/needles-thread" className="related-tool-link">🪡 All Needles</a></div></aside></div></div>);}