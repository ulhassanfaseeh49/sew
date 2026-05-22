"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { BarChart3, ClipboardCopy, Printer, Scale, Target } from "lucide-react";
export default function Page(){
  const [size,setSize]=useState("12");
  const [activeFaq,setActiveFaq]=useState<number|null>(null);
  const data: Record<string,{bust:number,waist:number,hip:number}>={6:{bust:30.5,waist:23,hip:32.5},8:{bust:31.5,waist:24,hip:33.5},10:{bust:32.5,waist:25,hip:34.5},12:{bust:34,waist:26.5,hip:36},14:{bust:36,waist:28,hip:38},16:{bust:38,waist:30,hip:40},18:{bust:40,waist:32,hip:42},20:{bust:42,waist:34,hip:44}};const d=data[size]||data["12"];const hasResult=true;const resultValue="Size "+size;const resultLabel="standard body measurements";
  const faqItems=[{q:"Are standard measurements the same across brands?",a:"No. Each pattern company has their own standard measurements. Always check the size chart on your pattern."}];
  return(<div className="container"><Breadcrumb items={[{label:"Body Tools",href:"/body"},{label:"Standard Body Measurements"}]}/>
    <div className="calculator-layout"><div className="calculator-main">
      <div className={styles.toolHeader}><span className="category-badge"><BarChart3 size={14} strokeWidth={1.5} /> Body Tool</span><h1>Standard Body Measurements</h1><p>Database of standard measurements by size.</p></div>
      <div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
        <div className="calculator-form"><div className="input-group"><label className="input-label">Pattern size</label><select className="input-field" value={size} onChange={e=>setSize(e.target.value)}><option value="6">6</option><option value="8">8</option><option value="10">10</option><option value="12">12</option><option value="14">14</option><option value="16">16</option><option value="18">18</option><option value="20">20</option></select></div></div>
        {hasResult&&(<div className={`calculator-results ${styles.results}`}>
          <div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
          <div className={styles.resultDetails}><div className={styles.resultRow}><span>Bust</span><strong>{d.bust}&quot;</strong></div><div className={styles.resultRow}><span>Waist</span><strong>{d.waist}&quot;</strong></div><div className={styles.resultRow}><span>Hip</span><strong>{d.hip}&quot;</strong></div></div>
          <div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
        </div>)}
      </div>
      <section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
    </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/body/pattern-size-selector" className="related-tool-link"><Target size={13} /> Size Selector</a><a href="/body/brand-size-comparator" className="related-tool-link"><Scale size={13} /> Compare</a></div></aside></div></div>);
}