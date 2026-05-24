"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Scissors, ClipboardCopy, Printer } from "lucide-react";

export default function Page() {
    const [vals, setVals] = useState({"armLen":23,"style":1});
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const faqItems = [{"q":"Standard sleeve lengths?","a":"Cap: 4-5\". Short: 9-10\". 3/4: 17-18\". Long: full arm length + 1\"."}];
    const styles=[{name:'Cap sleeve',pct:0.2},{name:'Short sleeve',pct:0.43},{name:'3/4 sleeve',pct:0.75},{name:'Long sleeve',pct:1}];const s=styles[vals.style]||styles[1];const len=Math.round(vals.armLen*s.pct);
    return (<div className="container"><Breadcrumb items={[{ label: "Garment", href: "/garment" }, { label: "Sleeve Length Calculator" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} /> Garment #219</span><h1>Sleeve Length Calculator</h1><p>Calculate sleeve length by style.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}>
                <h2 className={styles.calcTitle}>Measurements</h2>
                <div className="calculator-form-row">
                    <div className="input-group"><label className="input-label">Arm length (shoulder to wrist)</label><input type="number" className="input-field" value={vals.armLen} onChange={e => setVals(p=>({...p, armLen: parseFloat(e.target.value)||23}))} style={{width:80}} /></div>
                        <div className="input-group"><label className="input-label">Style (0-3)</label><input type="number" className="input-field" value={vals.style} onChange={e => setVals(p=>({...p, style: parseFloat(e.target.value)||1}))} style={{width:80}} /></div>
                </div>
            </div>
            <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(280,50%,45%)" }}>
                <h2 className={styles.calcTitle}>Results</h2>
                <div className={styles.resultDetails}>
                    <div className="result-row"><span>Style</span><strong>{s.name}</strong></div>
                        <div className="result-row"><span>Sleeve length</span><strong>{len+'"'}</strong></div>
                        <div className="result-row"><span>Hem allowance</span><strong>{'1-1.5"'}</strong></div>
                </div>
            </div>
            <div className="toolbar" style={{ marginBottom: 10 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText("Sleeve Length Calculator result")}><ClipboardCopy size={13} /> Copy</button>
                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
            </div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link">All Garment</a></div></aside></div></div>);
}
