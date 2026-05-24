"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Scissors, ClipboardCopy, Printer } from "lucide-react";

export default function Page() {
    const [vals, setVals] = useState({"wrist":7,"cuffW":2,"overlap":1});
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const faqItems = [{"q":"Standard cuff width?","a":"Dress shirt: 2-2.5 inches. Casual: 1.5 inches. French cuff: 3 inches (folds back)."}];
    const ease=0.5;const cutL=vals.wrist+ease+vals.overlap+1.25;const cutW=vals.cuffW*2+1.25;
    return (<div className="container"><Breadcrumb items={[{ label: "Garment", href: "/garment" }, { label: "Cuff Calculator" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} /> Garment #223</span><h1>Cuff Calculator</h1><p>Calculate fabric for shirt and sleeve cuffs.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}>
                <h2 className={styles.calcTitle}>Measurements</h2>
                <div className="calculator-form-row">
                    <div className="input-group"><label className="input-label">Wrist measurement</label><input type="number" className="input-field" value={vals.wrist} onChange={e => setVals(p=>({...p, wrist: parseFloat(e.target.value)||7}))} style={{width:80}} /></div>
                        <div className="input-group"><label className="input-label">Cuff width</label><input type="number" className="input-field" value={vals.cuffW} onChange={e => setVals(p=>({...p, cuffW: parseFloat(e.target.value)||2}))} style={{width:80}} /></div>
                        <div className="input-group"><label className="input-label">Overlap</label><input type="number" className="input-field" value={vals.overlap} onChange={e => setVals(p=>({...p, overlap: parseFloat(e.target.value)||1}))} style={{width:80}} /></div>
                </div>
            </div>
            <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(280,50%,45%)" }}>
                <h2 className={styles.calcTitle}>Results</h2>
                <div className={styles.resultDetails}>
                    <div className="result-row"><span>Cuff cut length</span><strong>{cutL.toFixed(1)+'"'}</strong></div>
                        <div className="result-row"><span>Cuff cut width</span><strong>{cutW.toFixed(1)+'"'}</strong></div>
                        <div className="result-row"><span>Interfacing size</span><strong>{cutL.toFixed(1)+'" x '+vals.cuffW+'"'}</strong></div>
                </div>
            </div>
            <div className="toolbar" style={{ marginBottom: 10 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText("Cuff Calculator result")}><ClipboardCopy size={13} /> Copy</button>
                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
            </div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link">All Garment</a></div></aside></div></div>);
}
