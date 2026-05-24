"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Scissors, ClipboardCopy, Printer } from "lucide-react";

export default function Page() {
    const [vals, setVals] = useState({"garLen":24,"type":0});
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const faqItems = [{"q":"Where to place pockets?","a":"Patch: 60% down from top, 2\" from side. In-seam: at hand drop height. Welt: 55% down."}];
    const types=[{name:'Patch pocket',fromTop:0.6,fromSide:2},{name:'Welt pocket',fromTop:0.55,fromSide:3},{name:'In-seam pocket',fromTop:0.45,fromSide:0}];const t=types[vals.type]||types[0];const topDist=Math.round(vals.garLen*t.fromTop);
    return (<div className="container"><Breadcrumb items={[{ label: "Garment", href: "/garment" }, { label: "Pocket Placement Calculator" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} /> Garment #225</span><h1>Pocket Placement Calculator</h1><p>Calculate pocket position on garments.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}>
                <h2 className={styles.calcTitle}>Measurements</h2>
                <div className="calculator-form-row">
                    <div className="input-group"><label className="input-label">Garment length</label><input type="number" className="input-field" value={vals.garLen} onChange={e => setVals(p=>({...p, garLen: parseFloat(e.target.value)||24}))} style={{width:80}} /></div>
                        <div className="input-group"><label className="input-label">Type (0=patch,1=welt,2=inseam)</label><input type="number" className="input-field" value={vals.type} onChange={e => setVals(p=>({...p, type: parseFloat(e.target.value)||0}))} style={{width:80}} /></div>
                </div>
            </div>
            <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(280,50%,45%)" }}>
                <h2 className={styles.calcTitle}>Results</h2>
                <div className={styles.resultDetails}>
                    <div className="result-row"><span>Type</span><strong>{t.name}</strong></div>
                        <div className="result-row"><span>From top</span><strong>{topDist+'"'}</strong></div>
                        <div className="result-row"><span>From side edge</span><strong>{t.fromSide+'"'}</strong></div>
                </div>
            </div>
            <div className="toolbar" style={{ marginBottom: 10 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText("Pocket Placement Calculator result")}><ClipboardCopy size={13} /> Copy</button>
                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
            </div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link">All Garment</a></div></aside></div></div>);
}
