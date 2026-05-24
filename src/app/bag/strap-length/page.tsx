"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ShoppingBag, ClipboardCopy, Printer } from "lucide-react";

function toFrac(v: number): string {
    if (v <= 0) return "0"; const w = Math.floor(v); const f = v - w;
    const map: [number, string][] = [[0,""], [0.125,"⅛"], [0.25,"¼"], [0.375,"⅜"], [0.5,"½"], [0.625,"⅝"], [0.75,"¾"], [0.875,"⅞"]];
    let best = map[0], bd = 1;
    for (const [n, s] of map) { const d = Math.abs(f - n); if (d < bd) { bd = d; best = [n, s]; } }
    if (Math.abs(f - 1) < bd) return `${w + 1}`; if (!best[1]) return w > 0 ? `${w}` : "0";
    return w > 0 ? `${w} ${best[1]}` : `${best[1]}`;
}

const styles2=[
    {key:"shoulder",name:"Shoulder",drop:12,total:26,desc:"Standard shoulder carry"},
    {key:"crossbody",name:"Crossbody",drop:22,total:48,desc:"Across the body"},
    {key:"hand",name:"Hand carry",drop:5,total:14,desc:"Short handles"},
    {key:"backpack",name:"Backpack",drop:14,total:32,desc:"Over both shoulders"},
];
export default function Page(){
    const [style,setStyle]=useState("shoulder");
    const [activeFaq,setActiveFaq]=useState<number|null>(null);
    const faqItems=[{q:"How long should bag straps be?",a:"Hand carry: 14\". Shoulder: 24-28\". Crossbody: 44-52\". Backpack: 28-34\". Add 2-3\" for seam allowances."}];
    const spec=styles2.find(s=>s.key===style)||styles2[0];
    return (<div className="container"><Breadcrumb items={[{label:"Bags",href:"/bag"},{label:"Strap Length"}]}/>
        <div className="calculator-layout"><div className="calculator-main">
        <div className={styles.toolHeader}><span className="category-badge"><ShoppingBag size={14}/> Bag #370</span><h1>Bag Strap Length Calculator</h1><p>Calculate strap length by carry style.</p></div>
        <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Carry Style</h2>
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                {styles2.map(s=>(<button key={s.key} className={`btn btn-sm ${style===s.key?"btn-primary":"btn-ghost"}`} onClick={()=>setStyle(s.key)} style={{fontSize:10}}>{s.name}</button>))}
            </div>
        </div>
        <div className={`glass-card ${styles.calculatorCard}`} style={{borderLeft:"4px solid hsl(200,50%,45%)"}}>
            <h2 className={styles.calcTitle}>Strap Measurements</h2>
            <div style={{padding:14,background:"hsl(200,15%,95%)",borderRadius:10,textAlign:"center",marginBottom:12}}>
                <div style={{fontSize:9,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"hsl(200,40%,35%)"}}>Total Strap Length</div>
                <div style={{fontSize:36,fontWeight:800,color:"hsl(200,50%,30%)"}}>{spec.total}\"</div>
                <div style={{fontSize:10}}>Drop: {spec.drop}\" — {spec.desc}</div>
            </div>
            <div className={styles.resultDetails}>
                <div className="result-row"><span>Cut length (+ SA)</span><strong>{spec.total+3}\"</strong></div>
            </div>
        </div>
        <div className="toolbar" style={{marginBottom:10}}>
  <button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(`${spec.name} strap: ${spec.total}" total, ${spec.drop}" drop`)}><ClipboardCopy size={13}/> Copy</button>
  <button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13}/> Print</button>
</div>
        <section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/bag/strap-width" className="related-tool-link">Strap Width</a><a href="/bag/tote-bag" className="related-tool-link">Tote Bag</a><a href="/bag" className="related-tool-link">All Bags</a></div></aside></div></div>);
}