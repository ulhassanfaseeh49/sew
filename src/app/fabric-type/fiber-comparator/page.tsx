"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[fiber,sF]=useState("cotton");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const info:Record<string,{type:string,pros:string,cons:string}>={cotton:{type:"Natural (plant)",pros:"Breathable, easy care, affordable",cons:"Wrinkles, shrinks, fades"},linen:{type:"Natural (plant)",pros:"Very breathable, strong, eco-friendly",cons:"Wrinkles easily, stiff initially"},silk:{type:"Natural (animal)",pros:"Luxurious drape, temperature regulating",cons:"Expensive, delicate, dry clean"},wool:{type:"Natural (animal)",pros:"Warm, resilient, naturally wrinkle-resistant",cons:"Shrinks if washed, moths, felting"},polyester:{type:"Synthetic",pros:"Durable, wrinkle-free, affordable",cons:"Not breathable, static, pills"},nylon:{type:"Synthetic",pros:"Very strong, elastic, quick-drying",cons:"Not breathable, heat sensitive"},tencel:{type:"Semi-synthetic",pros:"Eco-friendly, soft, breathable, drapes well",cons:"Can be expensive, wrinkles"}};const fi=info[fiber]||info.cotton;const hasResult=true;const resultValue=fiber+" ("+fi.type+")";const resultLabel=fi.pros;
const faqItems=[{q:"Is natural or synthetic better?",a:"Neither is universally better. Natural fibers breathe better. Synthetics are more durable and easy-care."}];
return(<div className="container"><Breadcrumb items={[{label:"Fabric Type",href:"/fabric-type"},{label:"Natural vs Synthetic"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>🌿</span> Fabric #422</span><h1>Natural vs Synthetic</h1><p>Compare fiber types.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Fiber type</label><select className="input-field" value={fiber} onChange={e=>sF(e.target.value)}><option value="cotton">Cotton (natural)</option><option value="linen">Linen (natural)</option><option value="silk">Silk (natural)</option><option value="wool">Wool (natural)</option><option value="polyester">Polyester (synthetic)</option><option value="nylon">Nylon (synthetic)</option><option value="tencel">Tencel (semi-synthetic)</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Pros</span><strong style={{fontWeight:"normal",fontSize:"0.85rem"}}>{fi.pros}</strong></div><div className={styles.resultRow}><span>Cons</span><strong style={{fontWeight:"normal",fontSize:"0.85rem"}}>{fi.cons}</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/fabric-type" className="related-tool-link">⚖️ All Fabric Type</a></div></aside></div></div>);}