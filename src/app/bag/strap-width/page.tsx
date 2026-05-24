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

export default function Page(){
    const [finW,setFinW]=useState(1.5);
    const [strapLen,setStrapLen]=useState(26);
    const [qty,setQty]=useState(2);
    const [activeFaq,setActiveFaq]=useState<number|null>(null);
    const faqItems=[{q:"What width for bag straps?",a:"Tote: 1-1.5\". Crossbody: 1-2\". Backpack: 1.5-2\". Hand: 3/4-1\". Wider = more comfortable for heavy loads."}];
    const cutW=finW*2+1;
    const cutL=strapLen+3;
    const yd=Math.ceil(cutW*cutL*qty/(44*36)*4)/4;
    return (<div className="container"><Breadcrumb items={[{label:"Bags",href:"/bag"},{label:"Strap Width"}]}/>
        <div className="calculator-layout"><div className="calculator-main">
        <div className={styles.toolHeader}><span className="category-badge"><ShoppingBag size={14}/> Bag #371</span><h1>Bag Strap Width &amp; Fabric Calculator</h1><p>Calculate fabric for bag straps by width and length.</p></div>
        <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Strap Details</h2>
            <div className="calculator-form-row">
                <div className="input-group"><label className="input-label">Finished width</label><div style={{display:"flex",gap:3}}>{[0.75,1,1.5,2].map(w=>(<button key={w} className={`btn btn-sm ${finW===w?"btn-primary":"btn-ghost"}`} onClick={()=>setFinW(w)} style={{fontSize:10}}>{w}\"</button>))}</div></div>
                <div className="input-group"><label className="input-label">Length (in)</label><input type="number" className="input-field" value={strapLen} onChange={e=>setStrapLen(parseInt(e.target.value)||26)} style={{width:70}}/></div>
                <div className="input-group"><label className="input-label">Qty</label><input type="number" className="input-field" value={qty} onChange={e=>setQty(Math.max(1,parseInt(e.target.value)||1))} min={1} style={{width:60}}/></div>
            </div>
        </div>
        <div className={`glass-card ${styles.calculatorCard}`} style={{borderLeft:"4px solid hsl(340,50%,45%)"}}>
            <h2 className={styles.calcTitle}>Result</h2>
            <div className={styles.resultDetails}>
                <div className="result-row"><span>Cut width (fold method)</span><strong>{cutW}\"</strong></div>
                <div className="result-row"><span>Cut length</span><strong>{cutL}\"</strong></div>
                <div className="result-row"><span>Total fabric</span><strong>{toFrac(Math.max(yd,0.125))} yd</strong></div>
            </div>
        </div>
        <div className="toolbar" style={{marginBottom:10}}>
  <button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(`${qty} straps: cut ${cutW}" x ${cutL}" each`)}><ClipboardCopy size={13}/> Copy</button>
  <button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13}/> Print</button>
</div>
        <section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/bag/strap-length" className="related-tool-link">Strap Length</a><a href="/bag" className="related-tool-link">All Bags</a></div></aside></div></div>);
}