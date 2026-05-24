"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Scissors, ClipboardCopy, Printer } from "lucide-react";

export default function Page() {
    const [vals, setVals] = useState({"numTucks":8,"tuckDepth":0.125,"spacing":0.25});
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const faqItems = [{"q":"How much fabric do tucks use?","a":"Each tuck uses 2x its depth. Eight 1/8\" tucks use 2 inches of fabric."}];
    const fabricTaken=vals.numTucks*vals.tuckDepth*2;const totalSection=vals.numTucks*(vals.tuckDepth*2+vals.spacing);
    return (<div className="container"><Breadcrumb items={[{ label: "Garment", href: "/garment" }, { label: "Tuck/Pin Tuck Calculator" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} /> Garment #210</span><h1>Tuck/Pin Tuck Calculator</h1><p>Calculate fabric for tucks.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}>
                <h2 className={styles.calcTitle}>Measurements</h2>
                <div className="calculator-form-row">
                    <div className="input-group"><label className="input-label">Number of tucks</label><input type="number" className="input-field" value={vals.numTucks} onChange={e => setVals(p=>({...p, numTucks: parseFloat(e.target.value)||8}))} style={{width:80}} /></div>
                        <div className="input-group"><label className="input-label">Tuck depth</label><input type="number" className="input-field" value={vals.tuckDepth} onChange={e => setVals(p=>({...p, tuckDepth: parseFloat(e.target.value)||0.125}))} style={{width:80}} /></div>
                        <div className="input-group"><label className="input-label">Space between</label><input type="number" className="input-field" value={vals.spacing} onChange={e => setVals(p=>({...p, spacing: parseFloat(e.target.value)||0.25}))} style={{width:80}} /></div>
                </div>
            </div>
            <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(280,50%,45%)" }}>
                <h2 className={styles.calcTitle}>Results</h2>
                <div className={styles.resultDetails}>
                    <div className="result-row"><span>Fabric taken by tucks</span><strong>{fabricTaken.toFixed(2)+'"'}</strong></div>
                        <div className="result-row"><span>Total tuck section width</span><strong>{totalSection.toFixed(2)+'"'}</strong></div>
                </div>
            </div>
            <div className="toolbar" style={{ marginBottom: 10 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText("Tuck/Pin Tuck Calculator result")}><ClipboardCopy size={13} /> Copy</button>
                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
            </div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link">All Garment</a></div></aside></div></div>);
}
