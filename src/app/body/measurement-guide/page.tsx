"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { BookOpen, ClipboardCopy, Printer, Ruler } from "lucide-react";
export default function Page(){
  const [area,setArea]=useState("bust");
  const [activeFaq,setActiveFaq]=useState<number|null>(null);
  const guides: Record<string,{how:string,tip:string}>={bust:{how:"Measure around the fullest part of the bust, keeping tape parallel to the floor.",tip:"Wear the bra you plan to sew for."},waist:{how:"Measure at your natural waist — the narrowest point above your navel.",tip:"Tie a string around your waist first to find the exact line."},hip:{how:"Measure at the fullest point of your hips, about 7-9 inches below your waist.",tip:"Stand with feet together for consistency."},shoulder:{how:"Measure from shoulder point to shoulder point across the back.",tip:"Have someone else measure for accuracy."},inseam:{how:"Measure from crotch to desired hem, standing straight.",tip:"Measure a favorite pair of pants instead for accuracy."},arm:{how:"From shoulder point, over bent elbow, to wrist bone.",tip:"Bend elbow slightly and let arm relax."}};const g=guides[area]||guides.bust;const hasResult=true;const resultValue=area.charAt(0).toUpperCase()+area.slice(1);const resultLabel="measurement guide";
  const faqItems=[{q:"What tool do I need to measure myself?",a:"A flexible tape measure (not a metal one). Have someone help you for back measurements."}];
  return(<div className="container"><Breadcrumb items={[{label:"Body Tools",href:"/body"},{label:"How to Measure Yourself"}]}/>
    <div className="calculator-layout"><div className="calculator-main">
      <div className={styles.toolHeader}><span className="category-badge"><BookOpen size={14} strokeWidth={1.5} /> Body Tool</span><h1>How to Measure Yourself</h1><p>Step-by-step guide for taking all body measurements accurately.</p></div>
      <div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
        <div className="calculator-form"><div className="input-group"><label className="input-label">Measurement area</label><select className="input-field" value={area} onChange={e=>setArea(e.target.value)}><option value="bust">Bust</option><option value="waist">Waist</option><option value="hip">Hip</option><option value="shoulder">Shoulder width</option><option value="inseam">Inseam</option><option value="arm">Arm length</option></select></div></div>
        {hasResult&&(<div className={`calculator-results ${styles.results}`}>
          <div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
          <div className={styles.resultDetails}><div className={styles.resultRow}><span>How to measure</span><strong style={{fontWeight:"normal",fontSize:"0.85rem"}}>{g.how}</strong></div><div className={styles.resultRow}><span>Pro tip</span><strong style={{fontWeight:"normal",fontSize:"0.85rem"}}>{g.tip}</strong></div></div>
          <div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
        </div>)}
      </div>
      <section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
    </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/body/measurement-tracker" className="related-tool-link"><ClipboardCopy size={13} /> Tracker</a><a href="/body/ease-calculator" className="related-tool-link"><Ruler size={13} /> Ease</a></div></aside></div></div>);
}