"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[item,sI]=useState("tote");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const data:Record<string,{make:string,buy:string,verdict:string}>={tote:{make:"$8 materials, 2 hrs, minimal waste",buy:"$5-15 store, overseas shipping, factory conditions",verdict:"MAKE — saves money long-term, zero waste possible"},dress:{make:"$20-40 materials, 6-10 hrs, custom fit",buy:"$30-80 store, fast fashion waste",verdict:"MAKE — better fit, eco-friendly, lasts longer"},curtains:{make:"$30-60 materials, 3 hrs, exact size",buy:"$50-200 store, limited sizes",verdict:"MAKE — saves money, perfect fit, choice of fabric"},quilt:{make:"$50-150 materials, 20-40 hrs, heirloom",buy:"$100-400 store (mass-produced)",verdict:"MAKE — handmade quilts last generations"}};const d=data[item]||data.tote;const hasResult=true;const resultValue=d.verdict;const resultLabel="make: "+d.make+" | buy: "+d.buy;
const faqItems=[{q:"When is it better to buy?",a:"Simple basics (underwear, socks) are cheaper to buy. Make items where fit, quality, or uniqueness matter."}];
return(<div className="container"><Breadcrumb items={[{label:"Sustainable",href:"/sustainable"},{label:"Make vs Buy Calculator"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>⚖️</span> Eco #460</span><h1>Make vs Buy Calculator</h1><p>Environmental impact comparison.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Item to compare</label><select className="input-field" value={item} onChange={e=>sI(e.target.value)}><option value="tote">Tote bag</option><option value="dress">Dress</option><option value="curtains">Curtains</option><option value="quilt">Quilt</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/sustainable" className="related-tool-link">♻️ All Sustainable</a></div></aside></div></div>);}