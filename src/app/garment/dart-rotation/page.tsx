"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Scissors, ClipboardCopy, Printer } from "lucide-react";

export default function Page() {
    const [vals, setVals] = useState({"dartW":1.5,"fromPos":0,"toPos":1});
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const faqItems = [{"q":"Does rotating a dart change its intake?","a":"No! Rotation moves the dart but the intake stays the same. The fit does not change."}];
    const positions=['Shoulder','Side seam','Waist','Armhole','Neckline','French'];const fromName=positions[vals.fromPos]||'Shoulder';const toName=positions[vals.toPos]||'Side seam';
    return (<div className="container"><Breadcrumb items={[{ label: "Garment", href: "/garment" }, { label: "Dart Rotation Tool" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} /> Garment #203</span><h1>Dart Rotation Tool</h1><p>Guide for rotating darts between positions.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}>
                <h2 className={styles.calcTitle}>Measurements</h2>
                <div className="calculator-form-row">
                    <div className="input-group"><label className="input-label">Current dart width</label><input type="number" className="input-field" value={vals.dartW} onChange={e => setVals(p=>({...p, dartW: parseFloat(e.target.value)||1.5}))} style={{width:80}} /></div>
                        <div className="input-group"><label className="input-label">From</label><input type="number" className="input-field" value={vals.fromPos} onChange={e => setVals(p=>({...p, fromPos: parseFloat(e.target.value)||0}))} style={{width:80}} /></div>
                        <div className="input-group"><label className="input-label">To</label><input type="number" className="input-field" value={vals.toPos} onChange={e => setVals(p=>({...p, toPos: parseFloat(e.target.value)||1}))} style={{width:80}} /></div>
                </div>
            </div>
            <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(280,50%,45%)" }}>
                <h2 className={styles.calcTitle}>Results</h2>
                <div className={styles.resultDetails}>
                    <div className="result-row"><span>Rotating from</span><strong>{fromName}</strong></div>
                        <div className="result-row"><span>Rotating to</span><strong>{toName}</strong></div>
                        <div className="result-row"><span>Intake (unchanged)</span><strong>{vals.dartW+'"'}</strong></div>
                </div>
            </div>
            <div className="toolbar" style={{ marginBottom: 10 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText("Dart Rotation Tool result")}><ClipboardCopy size={13} /> Copy</button>
                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
            </div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link">All Garment</a></div></aside></div></div>);
}
