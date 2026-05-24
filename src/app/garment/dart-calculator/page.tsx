"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Scissors, ClipboardCopy, Printer } from "lucide-react";

export default function Page() {
    const [vals, setVals] = useState({"bustFull":38,"bustHigh":34,"bustPtH":10});
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const faqItems = [{"q":"How wide should a dart be?","a":"Dart intake = full bust minus high bust measurement. Split evenly between left and right darts."}];
    const dartIntake=vals.bustFull-vals.bustHigh;const dartLen=vals.bustPtH-0.75;const dartWidthEach=dartIntake/2;
    return (<div className="container"><Breadcrumb items={[{ label: "Garment", href: "/garment" }, { label: "Dart Calculator" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} /> Garment #201</span><h1>Dart Calculator</h1><p>Calculate dart width, length, and placement.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}>
                <h2 className={styles.calcTitle}>Measurements</h2>
                <div className="calculator-form-row">
                    <div className="input-group"><label className="input-label">Full bust</label><input type="number" className="input-field" value={vals.bustFull} onChange={e => setVals(p=>({...p, bustFull: parseFloat(e.target.value)||38}))} style={{width:80}} /></div>
                        <div className="input-group"><label className="input-label">High bust</label><input type="number" className="input-field" value={vals.bustHigh} onChange={e => setVals(p=>({...p, bustHigh: parseFloat(e.target.value)||34}))} style={{width:80}} /></div>
                        <div className="input-group"><label className="input-label">Bust point height</label><input type="number" className="input-field" value={vals.bustPtH} onChange={e => setVals(p=>({...p, bustPtH: parseFloat(e.target.value)||10}))} style={{width:80}} /></div>
                </div>
            </div>
            <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(280,50%,45%)" }}>
                <h2 className={styles.calcTitle}>Results</h2>
                <div className={styles.resultDetails}>
                    <div className="result-row"><span>Dart intake (total)</span><strong>{dartIntake.toFixed(1)+'"'}</strong></div>
                        <div className="result-row"><span>Dart width each side</span><strong>{dartWidthEach.toFixed(2)+'"'}</strong></div>
                        <div className="result-row"><span>Dart length</span><strong>{dartLen.toFixed(1)+'"'}</strong></div>
                        <div className="result-row"><span>Dart point from apex</span><strong>{'3/4"'}</strong></div>
                </div>
            </div>
            <div className="toolbar" style={{ marginBottom: 10 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText("Dart Calculator result")}><ClipboardCopy size={13} /> Copy</button>
                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
            </div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link">All Garment</a></div></aside></div></div>);
}
