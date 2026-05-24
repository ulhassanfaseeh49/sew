"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Scissors, ClipboardCopy, Printer } from "lucide-react";

export default function Page() {
    const [vals, setVals] = useState({"depth":2,"garLen":60});
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const faqItems = [{"q":"How does blind hem work?","a":"Fold hem up, then fold back. Machine catches tiny bit of fold + main fabric. Nearly invisible."}];
    const foldUp=vals.depth+0.25;const vis='barely visible catch stitch';
    return (<div className="container"><Breadcrumb items={[{ label: "Garment", href: "/garment" }, { label: "Blind Hem Calculator" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} /> Garment #215</span><h1>Blind Hem Calculator</h1><p>Calculate fabric for invisible blind hems.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}>
                <h2 className={styles.calcTitle}>Measurements</h2>
                <div className="calculator-form-row">
                    <div className="input-group"><label className="input-label">Hem depth</label><input type="number" className="input-field" value={vals.depth} onChange={e => setVals(p=>({...p, depth: parseFloat(e.target.value)||2}))} style={{width:80}} /></div>
                        <div className="input-group"><label className="input-label">Garment hem circumference</label><input type="number" className="input-field" value={vals.garLen} onChange={e => setVals(p=>({...p, garLen: parseFloat(e.target.value)||60}))} style={{width:80}} /></div>
                </div>
            </div>
            <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(280,50%,45%)" }}>
                <h2 className={styles.calcTitle}>Results</h2>
                <div className={styles.resultDetails}>
                    <div className="result-row"><span>Fold up</span><strong>{foldUp+'"'}</strong></div>
                        <div className="result-row"><span>Fold back</span><strong>{(foldUp-0.25)+'"'}</strong></div>
                        <div className="result-row"><span>Visibility</span><strong>{vis}</strong></div>
                </div>
            </div>
            <div className="toolbar" style={{ marginBottom: 10 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText("Blind Hem Calculator result")}><ClipboardCopy size={13} /> Copy</button>
                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
            </div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link">All Garment</a></div></aside></div></div>);
}
