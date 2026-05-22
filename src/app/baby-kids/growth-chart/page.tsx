"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
export default function Page(){
const[age,sA]=useState("4");const[gender,sG]=useState("girl");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const charts:Record<string,{chest:number,waist:number,height:number}>={2:{chest:21,waist:20,height:34},3:{chest:22,waist:20.5,height:38},4:{chest:23,waist:21,height:41},5:{chest:24,waist:21.5,height:44},6:{chest:25,waist:22,height:47},8:{chest:27,waist:23,height:51},10:{chest:28.5,waist:24,height:55},12:{chest:30,waist:25,height:59}};const c=charts[age]||charts[4];const hasResult=true;const resultValue="age "+age+" average";const resultLabel="chest "+c.chest+"\" | waist "+c.waist+"\" | height "+c.height+"\"";
const faqItems=[{q:"Are these exact measurements?",a:"These are averages. Always measure the specific child. Kids vary widely in proportions."}];
return(<div className="container"><Breadcrumb items={[{label:"Baby & Kids",href:"/baby-kids"},{label:"Growth Chart by Age"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span>📊</span> Baby #399</span><h1>Growth Chart by Age</h1><p>Body measurements by age.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
<div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Age (years)</label><select className="input-field" value={age} onChange={e=>sA(e.target.value)}><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="8">8</option><option value="10">10</option><option value="12">12</option></select></div><div className="input-group"><label className="input-label">Gender</label><select className="input-field" value={gender} onChange={e=>sG(e.target.value)}><option value="girl">Girl</option><option value="boy">Boy</option></select></div></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}><div className={styles.resultRow}><span>Chest</span><strong>{c.chest}&quot;</strong></div><div className={styles.resultRow}><span>Waist</span><strong>{c.waist}&quot;</strong></div><div className={styles.resultRow}><span>Height</span><strong>{c.height}&quot;</strong></div></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/baby-kids" className="related-tool-link">👶 All Baby</a></div></aside></div></div>);}