"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Scissors, ClipboardCopy, Printer } from "lucide-react";

export default function Page() {
    const [vals, setVals] = useState({"type":0});
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const faqItems = [{"q":"Why does grain direction matter?","a":"Grain affects drape, stretch, and hang. Wrong grain = garment twists, distorts, or stretches."}];
    const grains=[{name:'Lengthwise (warp)',angle:0,stretch:'None',use:'Most pattern pieces'},{name:'Crosswise (weft)',angle:90,stretch:'Slight',use:'Some neckline facings'},{name:'Bias (true)',angle:45,stretch:'Maximum',use:'Bias binding, draped pieces'}];const g=grains[vals.type]||grains[0];
    return (<div className="container"><Breadcrumb items={[{ label: "Garment", href: "/garment" }, { label: "Grain Line Guide" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} /> Garment #229</span><h1>Grain Line Guide</h1><p>Guide to fabric grain direction.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}>
                <h2 className={styles.calcTitle}>Measurements</h2>
                <div className="calculator-form-row">
                    <div className="input-group"><label className="input-label">Grain type (0-2)</label><input type="number" className="input-field" value={vals.type} onChange={e => setVals(p=>({...p, type: parseFloat(e.target.value)||0}))} style={{width:80}} /></div>
                </div>
            </div>
            <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(280,50%,45%)" }}>
                <h2 className={styles.calcTitle}>Results</h2>
                <div className={styles.resultDetails}>
                    <div className="result-row"><span>Grain</span><strong>{g.name}</strong></div>
                        <div className="result-row"><span>Angle to selvage</span><strong>{g.angle+'°'}</strong></div>
                        <div className="result-row"><span>Stretch</span><strong>{g.stretch}</strong></div>
                        <div className="result-row"><span>Common use</span><strong>{g.use}</strong></div>
                </div>
            </div>
            <div className="toolbar" style={{ marginBottom: 10 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText("Grain Line Guide result")}><ClipboardCopy size={13} /> Copy</button>
                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
            </div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link">All Garment</a></div></aside></div></div>);
}
