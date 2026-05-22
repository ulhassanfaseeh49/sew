"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[project,sP]=useState("dress");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const recs:Record<string,{fabrics:string,weight:string}>={dress:{fabrics:"Cotton lawn, rayon, linen, jersey, crepe, chiffon",weight:"Light to medium"},blouse:{fabrics:"Voile, lawn, silk, cotton, rayon challis",weight:"Lightweight"},pants:{fabrics:"Twill, denim, linen, ponte, corduroy",weight:"Medium to heavy"},jacket:{fabrics:"Wool, tweed, canvas, denim, faux leather",weight:"Medium-heavy"},quilt:{fabrics:"Quilting cotton (100%)",weight:"Light-medium (110-150 GSM)"},bag:{fabrics:"Canvas, duck, denim, cork, upholstery",weight:"Heavy (250+ GSM)"},curtains:{fabrics:"Cotton, linen, voile, velvet, blackout",weight:"Varies by style"},upholstery:{fabrics:"Canvas, duck, tapestry, vinyl, outdoor fabric",weight:"Heavy (300+ GSM)"}};const r=recs[project]||recs.dress;const hasResult=true;const resultValue=r.fabrics;const resultLabel="recommended weight: "+r.weight;
const faqItems=[{q:"How do I choose the right fabric?",a:"Match weight and drape to your pattern requirements. Always check the pattern envelope for recommendations."}];
return(<div className="container"><Breadcrumb items={[{label:"Fabric Type",href:"/fabric-type"},{label:"Fabric Selection Guide"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>📖</span> Fabric #418</span><h1>Fabric Selection Guide</h1><p>Find fabric for your project.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Project type</label><select className="input-field" value={project} onChange={e=>sP(e.target.value)}><option value="dress">Dress/skirt</option><option value="blouse">Blouse/top</option><option value="pants">Pants</option><option value="jacket">Jacket/coat</option><option value="quilt">Quilt</option><option value="bag">Bag/tote</option><option value="curtains">Curtains</option><option value="upholstery">Upholstery</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/fabric-type" className="related-tool-link">⚖️ All Fabric Type</a></div></aside></div></div>);}