"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Scissors, ClipboardCopy, Printer } from "lucide-react";

export default function Page() {
    const [vals, setVals] = useState({"finLen":28,"ratio":2});
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const faqItems = [{"q":"What gather ratio to use?","a":"1.5x: subtle. 2x: standard. 2.5x: full. 3x: dramatic. 4x: tulle/bridal."}];
    const ungathered=vals.finLen*vals.ratio;const strips=Math.ceil(ungathered/44);
    return (<div className="container"><Breadcrumb items={[{ label: "Garment", href: "/garment" }, { label: "Gather Ratio Calculator" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} /> Garment #207</span><h1>Gather Ratio Calculator</h1><p>Calculate fabric needed for gathering.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}>
                <h2 className={styles.calcTitle}>Measurements</h2>
                <div className="calculator-form-row">
                    <div className="input-group"><label className="input-label">Finished gathered length</label><input type="number" className="input-field" value={vals.finLen} onChange={e => setVals(p=>({...p, finLen: parseFloat(e.target.value)||28}))} style={{width:80}} /></div>
                        <div className="input-group"><label className="input-label">Fullness ratio</label><input type="number" className="input-field" value={vals.ratio} onChange={e => setVals(p=>({...p, ratio: parseFloat(e.target.value)||2}))} style={{width:80}} /></div>
                </div>
            </div>
            <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(280,50%,45%)" }}>
                <h2 className={styles.calcTitle}>Results</h2>
                <div className={styles.resultDetails}>
                    <div className="result-row"><span>Ungathered fabric</span><strong>{ungathered+'"'}</strong></div>
                        <div className="result-row"><span>Strips needed (44" WOF)</span><strong>{strips}</strong></div>
                </div>
            </div>
            <div className="toolbar" style={{ marginBottom: 10 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText("Gather Ratio Calculator result")}><ClipboardCopy size={13} /> Copy</button>
                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
            </div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link">All Garment</a></div></aside></div></div>);
}
