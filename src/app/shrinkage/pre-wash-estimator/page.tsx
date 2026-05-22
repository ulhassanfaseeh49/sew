"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer } from "lucide-react";
export default function Page(){
const[fabric,sF]=useState("cotton");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const rates:Record<string,{pct:number,method:string}>={cotton:{pct:3,method:"Machine wash warm, tumble dry"},linen:{pct:5,method:"Machine wash warm, tumble dry"},rayon:{pct:5,method:"Hand wash cool, lay flat to dry"},wool:{pct:3,method:"Steam or soak in cool water"},silk:{pct:2,method:"Hand wash cool, air dry"},polyester:{pct:0.5,method:"Machine wash, minimal shrinkage"},knit:{pct:5,method:"Machine wash warm, tumble dry medium"}};const r=rates[fabric]||rates.cotton;const hasResult=true;const resultValue=r.pct+"% expected shrinkage";const resultLabel=r.method;
const faqItems=[{q:"Should I always pre-wash fabric?",a:"Yes for garments and items that will be washed. No for crafts, bag linings, or dry-clean-only projects."}];
return(<div className="container"><Breadcrumb items={[{label:"Shrinkage",href:"/shrinkage"},{label:"Pre-Wash Shrinkage Estimator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Shrinkage #230</span><h1>Pre-Wash Shrinkage Estimator</h1><p>Estimate shrinkage by fabric type and fiber content.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Fabric type</label><select className="input-field" value={fabric} onChange={e=>sF(e.target.value)}><option value="cotton">Cotton</option><option value="linen">Linen</option><option value="rayon">Rayon</option><option value="wool">Wool</option><option value="silk">Silk</option><option value="polyester">Polyester</option><option value="knit">Cotton knit</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/shrinkage" className="related-tool-link"> All Shrinkage</a></div></aside></div></div>);}