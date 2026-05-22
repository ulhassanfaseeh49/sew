"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Palette, Printer, Scissors } from "lucide-react";
export default function Page(){
const[brand,sB]=useState("dmc");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const info:Record<string,string>={dmc:"DMC is the most widely used system. Numbers range from 1-5200.",anchor:"Anchor uses a different numbering system. Cross-reference charts available online.",sulky:"Sulky rayon threads popular for machine embroidery. 1001-1534 range.",madeira:"Madeira uses 4-digit codes. Known for rayon and polyneon threads."};const i2=info[brand]||info.dmc;const hasResult=true;const resultValue=brand.toUpperCase()+" thread system";const resultLabel=i2;
const faqItems=[{q:"Is DMC the same as Anchor colors?",a:"No, different numbering. A DMC 310 (black) is Anchor 403. Always use a conversion chart."}];
return(<div className="container"><Breadcrumb items={[{label:"Embroidery",href:"/embroidery"},{label:"Thread Color Converter"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><Palette size={14} strokeWidth={1.5} /> Embroidery #313</span><h1>Thread Color Converter</h1><p>DMC/Anchor/Sulky conversion.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Thread brand system</label><select className="input-field" value={brand} onChange={e=>sB(e.target.value)}><option value="dmc">DMC</option><option value="anchor">Anchor</option><option value="sulky">Sulky</option><option value="madeira">Madeira</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/embroidery" className="related-tool-link"><Scissors size={13} /> All Embroidery</a></div></aside></div></div>);}