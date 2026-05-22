"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Scissors } from "lucide-react";
export default function Page(){
const[stitchesW,sW]=useState("");const[stitchesH,sH]=useState("");const[mesh,sM]=useState("13");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const sw=parseInt(stitchesW)||0;const sh=parseInt(stitchesH)||0;const m=parseInt(mesh)||13;const finW=sw/m;const finH=sh/m;const hasResult=sw>0&&sh>0;const resultValue=finW.toFixed(1)+"\" × "+finH.toFixed(1)+"\"";const resultLabel="on "+m+" mesh canvas";
const faqItems=[{q:"What mesh count is best for needlepoint?",a:"13 mesh is most popular. 10 mesh for beginners, 18 mesh for fine detail."}];
return(<div className="container"><Breadcrumb items={[{label:"Embroidery",href:"/embroidery"},{label:"Needlepoint Canvas Count"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Embroidery #317</span><h1>Needlepoint Canvas Count</h1><p>Size on different mesh counts.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Design width (stitches)</label><input type="number" className="input-field" placeholder="120" value={stitchesW} onChange={e=>sW(e.target.value)}/></div><div className="input-group"><label className="input-label">Design height</label><input type="number" className="input-field" placeholder="100" value={stitchesH} onChange={e=>sH(e.target.value)}/></div><div className="input-group"><label className="input-label">Mesh count</label><select className="input-field" value={mesh} onChange={e=>sM(e.target.value)}><option value="10">10 mesh</option><option value="12">12 mesh</option><option value="13">13 mesh</option><option value="14">14 mesh</option><option value="18">18 mesh (petit point)</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/embroidery" className="related-tool-link"><Scissors size={13} /> All Embroidery</a></div></aside></div></div>);}