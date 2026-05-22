"use client";
import{useState}from"react";
import Breadcrumb from"@/components/ui/Breadcrumb";
import styles from"../../convert/yards-to-meters/page.module.css";
import { BookOpen, ClipboardCopy, Printer } from "lucide-react";
export default function Page(){
const[symbol,sS]=useState("notch");
const[activeFaq,setActiveFaq]=useState<number|null>(null);
const info:Record<string,{meaning:string,action:string}>={notch:{meaning:"Matching point for aligning pieces",action:"Cut small triangles outward at notch marks. Match single to single, double to double."},dart:{meaning:"Fold marking for shaping (bust, waist)",action:"Mark both legs and the point. Fold RST, stitch from wide end to point."},grainline:{meaning:"Direction to place pattern on fabric grain",action:"Align arrow parallel to selvage. Measure both ends to selvage for accuracy."},fold:{meaning:"Place this edge on fabric fold (creates symmetry)",action:"Fold fabric, place bracket edge on fold. Do NOT cut along fold line."},dots:{meaning:"Matching points for construction details",action:"Mark with chalk or pins. Align dots when joining pieces."},button:{meaning:"Placement for buttons and buttonholes",action:"Mark center position. Space evenly. Start at bust for womens shirts."}};const i2=info[symbol]||info.notch;const hasResult=true;const resultValue=symbol;const resultLabel=i2.meaning;
const faqItems=[{q:"Are pattern symbols the same across brands?",a:"Mostly yes, but some companies use variations. Always check the pattern guide sheet."}];
return(<div className="container"><Breadcrumb items={[{label:"Reference",href:"/reference"},{label:"Pattern Symbol Guide"}]}/>
<div className="calculator-layout"><div className="calculator-main">
<div className={styles.toolHeader}><span className="category-badge"><span></span> Ref #464</span><h1>Pattern Symbol Guide</h1><p>Pattern markings explained.</p></div>
<div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Details</h2>
<div className="calculator-form"><div className="input-group"><label className="input-label">Pattern symbol</label><select className="input-field" value={symbol} onChange={e=>sS(e.target.value)}><option value="notch">Notch (triangle)</option><option value="dart">Dart (diamond)</option><option value="grainline">Grainline (arrow)</option><option value="fold">Fold line (bracket)</option><option value="dots">Dots/circles</option><option value="button">Button placement</option></select></div></div>
{hasResult&&(<div className={`calculator-results ${styles.results}`}>
<div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
<div className={styles.resultDetails}></div>
<div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13} /> Print</button></div>
</div>)}
</div>
<section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
</div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/reference" className="related-tool-link"><BookOpen size={13} /> All Reference</a></div></aside></div></div>);}