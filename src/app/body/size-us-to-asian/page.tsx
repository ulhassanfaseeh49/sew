"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
export default function Page(){
  const [usSize,setUsSize]=useState("8");
  const [activeFaq,setActiveFaq]=useState<number|null>(null);
  const map: Record<string,{jp:string,kr:string,cn:string}>={2:{jp:"5-7",kr:"44",cn:"155/80A"},4:{jp:"7-9",kr:"55",cn:"160/84A"},6:{jp:"9",kr:"55-66",cn:"165/88A"},8:{jp:"11",kr:"66",cn:"170/92A"},10:{jp:"13",kr:"77",cn:"175/96A"},12:{jp:"15",kr:"77-88",cn:"175/100A"},14:{jp:"17",kr:"88",cn:"180/104A"}};const m=map[usSize]||map["8"];const hasResult=true;const resultValue="JP "+m.jp+" / KR "+m.kr;const resultLabel="US "+usSize+" Asian size equivalents";
  const faqItems=[{q:"Are Asian sizes smaller than US?",a:"Generally yes. Asian sizing tends to run 1-2 sizes smaller than US sizing."}];
  return(<div className="container"><Breadcrumb items={[{label:"Body Tools",href:"/body"},{label:"US to Asian Size Converter"}]}/>
    <div className="calculator-layout"><div className="calculator-main">
      <div className={styles.toolHeader}><span className="category-badge"><span>🌏</span> Body Tool #118</span><h1>US to Asian Size Converter</h1><p>Convert between US and Asian clothing sizes.</p></div>
      <div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
        <div className="calculator-form"><div className="input-group"><label className="input-label">US Size</label><select className="input-field" value={usSize} onChange={e=>setUsSize(e.target.value)}><option value="2">2 (XS)</option><option value="4">4 (S)</option><option value="6">6 (S-M)</option><option value="8">8 (M)</option><option value="10">10 (L)</option><option value="12">12 (XL)</option><option value="14">14 (XXL)</option></select></div></div>
        {hasResult&&(<div className={`calculator-results ${styles.results}`}>
          <div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
          <div className={styles.resultDetails}><div className={styles.resultRow}><span>Japanese</span><strong>{m.jp}</strong></div><div className={styles.resultRow}><span>Korean</span><strong>{m.kr}</strong></div><div className={styles.resultRow}><span>Chinese</span><strong>{m.cn}</strong></div></div>
          <div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
        </div>)}
      </div>
      <section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
    </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/body/size-us-to-uk" className="related-tool-link">🇬🇧 US→UK</a><a href="/body/size-converter-universal" className="related-tool-link">🌐 Universal</a></div></aside></div></div>);
}