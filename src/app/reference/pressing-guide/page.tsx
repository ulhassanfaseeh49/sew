"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { BookOpen, ClipboardCopy, Printer } from "lucide-react";
export default function Page(){
const[topic,sT]=useState("pressing");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const info:Record<string,{desc:string,tip:string}>={pressing:{desc:"Lift and place iron, apply pressure, lift again. No sliding motion.",tip:"Press after EVERY seam. This is the secret to professional results."},ironing:{desc:"Ironing slides back and forth (for wrinkles). Pressing is stationary (for sewing).",tip:"Never iron across seams — it stretches and distorts the fabric."},tools:{desc:"Iron, pressing ham, sleeve board, tailor clapper, seam roll, pressing cloth.",tip:"A tailor ham shapes curves (bust, sleeve caps). A clapper flattens creases."},fabrics:{desc:"Silk/synthetic: low heat, pressing cloth. Cotton/linen: high heat, steam. Wool: medium, steam + clapper.",tip:"Always test heat on a scrap first. Use a pressing cloth on dark or shiny fabrics."}};const i2=info[topic]||info.pressing;const hasResult=true;const resultValue=topic;const resultLabel=i2.desc;
const faqItems=[{q:"Is pressing really that important?",a:"Absolutely. Pressing accounts for 50% of a professional-looking garment. Never skip it."}];
return(<div className="container"><Breadcrumb items={[{label:"Reference",href:"/reference"},{label:"Pressing vs Ironing"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Ref #480</span><h1>Pressing vs Ironing</h1><p>The difference between pressing and ironing.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Topic</label><select className="input-field" value={topic} onChange={e=>sT(e.target.value)}><option value="pressing">Pressing technique</option><option value="ironing">Ironing vs pressing</option><option value="tools">Pressing tools</option><option value="fabrics">Heat settings by fabric</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/reference" className="related-tool-link"><BookOpen size={13} /> All Reference</a></div></aside></div></div>);}