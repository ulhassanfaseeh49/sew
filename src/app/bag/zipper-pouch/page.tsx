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
const sizes = [{"k":"small","n":"Small (5×4)","w":5,"h":4},{"k":"med","n":"Medium (8×5)","w":8,"h":5},{"k":"large","n":"Large (10×7)","w":10,"h":7},{"k":"xl","n":"Travel (12×9)","w":12,"h":9}];
export default function Page() {
    const [sizeKey,setSizeKey]=useState(sizes[1]?.k||sizes[0].k);
    const [qty,setQty]=useState(1);
    const [activeFaq,setActiveFaq]=useState<number|null>(null);
    const faqItems=[{"q":"How much fabric for a zipper pouch?","a":"Small: 1/4 yd. Medium: 1/3 yd. Large: 1/2 yd. You need outer, lining, and interfacing — so triple the estimate for all layers."}];
    const spec=sizes.find((s: typeof sizes[0])=>s.k===sizeKey)||sizes[0];
    const calc=useMemo(()=>{
        const sa=1;
        const d=(spec as any).d||0;
        const cutW=spec.w+d+sa*2;
        const cutH=spec.h*2+d+sa*2;
        const area=cutW*cutH*qty;
        const yd=Math.ceil(area/(44*36)*4)/4;
        return { cutW, cutH, yd: Math.max(yd, 0.25) };
    },[spec,qty]);
    return (<div className="container"><Breadcrumb items={[{label:"Bags",href:"/bag"},{label:"Zipper Pouch Size"}]}/>
        <div className="calculator-layout"><div className="calculator-main">
        <div className={styles.toolHeader}><span className="category-badge"><ShoppingBag size={14}/> Bag #372</span><h1>Zipper Pouch Size Calculator</h1><p>Calculate fabric for zipper pouches by size.</p></div>
        <div className={`glass-card ${styles.calculatorCard}`}>
            <h2 className={styles.calcTitle}>Size & Quantity</h2>
            <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>
                {sizes.map((s: typeof sizes[0])=>(<button key={s.k} className={`btn btn-sm ${sizeKey===s.k?"btn-primary":"btn-ghost"}`} onClick={()=>setSizeKey(s.k)} style={{fontSize:10}}>{s.n}</button>))}
            </div>
            <div className="input-group"><label className="input-label">Qty</label><input type="number" className="input-field" value={qty} onChange={e=>setQty(Math.max(1,parseInt(e.target.value)||1))} min={1} style={{width:60}}/></div>
        </div>
        <div className={`glass-card ${styles.calculatorCard}`} style={{borderLeft:"4px solid hsl(200,50%,45%)"}}>
            <h2 className={styles.calcTitle}>Fabric Needed</h2>
            <div style={{padding:14,background:"hsl(200,15%,95%)",borderRadius:10,textAlign:"center",marginBottom:12}}>
                <div style={{fontSize:9,fontWeight:700,letterSpacing:1,textTransform:"uppercase",color:"hsl(200,40%,35%)"}}>Total</div>
                <div style={{fontSize:36,fontWeight:800,color:"hsl(200,50%,30%)"}}>{toFrac(calc.yd)}</div>
                <div style={{fontSize:10}}>yards for {qty} item{qty>1?"s":""}</div>
            </div>
            <div className={styles.resultDetails}>
                <div className="result-row"><span>Cut panel</span><strong>{calc.cutW}" × {calc.cutH}"</strong></div>
            </div>
        </div>
        <div className="toolbar" style={{marginBottom:10}}>
            <button className="btn btn-secondary btn-sm" onClick={()=>navigator.clipboard.writeText(`${qty} Zipper: ${toFrac(calc.yd)} yd`)}><ClipboardCopy size={13}/> Copy</button>
            <button className="btn btn-secondary btn-sm" onClick={()=>window.print()}><Printer size={13}/> Print</button>
        </div>
        <section className="faq-section"><h2>FAQ</h2><div style={{marginTop:"1.5rem"}}>{faqItems.map((f,i)=>(<div key={i} className={`faq-item ${activeFaq===i?"active":""}`}><button className="faq-question" onClick={()=>setActiveFaq(activeFaq===i?null:i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/bag/tote-bag" className="related-tool-link">Tote Bag</a><a href="/bag" className="related-tool-link">All Bags</a></div></aside></div>
    </div>);
}
