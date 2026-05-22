"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[type,sT]=useState("double");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const data:Record<string,{allowance:string,desc:string}>={single:{allowance:"1-2\"",desc:"Fold once, finish raw edge with serger or zigzag."},double:{allowance:"1-2.5\"",desc:"Fold twice for enclosed raw edge. Most common."},blind:{allowance:"1.5-2\"",desc:"Invisible from right side. Use blind hem foot."},rolled:{allowance:"1/4-3/8\"",desc:"Tiny rolled edge for sheers and lightweight."},lettuce:{allowance:"1/4-3/8\"",desc:"Stretched edge on knits for wavy effect."}};const d=data[type]||data.double;const hasResult=true;const resultValue=d.allowance+" allowance";const resultLabel=d.desc;
const faqItems=[{q:"What is the most common hem allowance?",a:"1.5 inches for double-fold on garments, 1/4 inch for rolled hems on sheers."}];
return(<div className="container"><Breadcrumb items={[{label:"Garment Tools",href:"/garment"},{label:"Hem Allowance Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>📐</span> Garment #210</span><h1>Hem Allowance Calculator</h1><p>Hem allowance by hem type.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Hem type</label><select className="input-field" value={type} onChange={e=>sT(e.target.value)}><option value="single">Single fold</option><option value="double">Double fold</option><option value="blind">Blind hem</option><option value="rolled">Rolled hem</option><option value="lettuce">Lettuce hem</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link">👗 All Garment</a></div></aside></div></div>);}