"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { BookOpen, ClipboardCopy, Printer } from "lucide-react";
export default function Page(){
  const [people,setPeople]=useState([{name:"",bust:"",waist:"",hip:""}]);
  const [activeFaq,setActiveFaq]=useState<number|null>(null);
  const filled=people.filter(p=>p.name);const hasResult=filled.length>0;const resultValue=filled.length+" person(s)";const resultLabel="measurement profiles";
  const faqItems=[{q:"Why manage multiple measurements?",a:"If you sew for family or clients, having all measurements in one place saves time."}];
  return(<div className="container"><Breadcrumb items={[{label:"Body Tools",href:"/body"},{label:"Multi-Person Measurement Manager"}]}/>
    <div className="calculator-layout"><div className="calculator-main">
      <div className={styles.toolHeader}><span className="category-badge"><span></span> Body Tool</span><h1>Multi-Person Measurement Manager</h1><p>Store measurements for multiple people.</p></div>
      <div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
        <div className="calculator-form"><div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>{people.map((p,i)=>(<div key={i} className="calculator-form-row"><div className="input-group"><label className="input-label">Name</label><input type="text" className="input-field" placeholder="Name" value={p.name} onChange={e=>{const n=[...people];n[i].name=e.target.value;setPeople(n);}}/></div><div className="input-group"><label className="input-label">Bust</label><input type="number" className="input-field" placeholder="0" value={p.bust} onChange={e=>{const n=[...people];n[i].bust=e.target.value;setPeople(n);}}/></div><div className="input-group"><label className="input-label">Waist</label><input type="number" className="input-field" placeholder="0" value={p.waist} onChange={e=>{const n=[...people];n[i].waist=e.target.value;setPeople(n);}}/></div></div>))}<button className="btn btn-ghost btn-sm" onClick={()=>setPeople([...people,{name:"",bust:"",waist:"",hip:""}])}>+ Add person</button></div></div>
        {hasResult&&(<div className={`calculator-results ${styles.results}`}>
          <div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
          <div className={styles.resultDetails}>{filled.map(p=>(<div key={p.name} className={styles.resultRow}><span>{p.name}</span><strong>B:{p.bust||"-"} W:{p.waist||"-"}</strong></div>))}</div>
          <div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
        </div>)}
      </div>
      <section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
    </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/body/measurement-tracker" className="related-tool-link"><ClipboardCopy size={13} /> Tracker</a><a href="/body/measurement-guide" className="related-tool-link"><BookOpen size={13} /> Guide</a></div></aside></div></div>);
}