"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Scissors, ClipboardCopy, Printer } from "lucide-react";

export default function Page() {
    const [vals, setVals] = useState({"dartW":1.5,"dartL":4,"posn":2});
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const faqItems = [{"q":"How does a dart create shape?","a":"A dart removes a wedge of fabric, pulling flat fabric into a 3D curve matching the body."}];
    const intakeAt=vals.dartW*(1-vals.posn/vals.dartL);const area=vals.dartW*vals.dartL/2;
    return (<div className="container"><Breadcrumb items={[{ label: "Garment", href: "/garment" }, { label: "Dart Intake Calculator" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} /> Garment #202</span><h1>Dart Intake Calculator</h1><p>Calculate how much fabric a dart takes in at any point.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}>
                <h2 className={styles.calcTitle}>Measurements</h2>
                <div className="calculator-form-row">
                    <div className="input-group"><label className="input-label">Dart width (intake)</label><input type="number" className="input-field" value={vals.dartW} onChange={e => setVals(p=>({...p, dartW: parseFloat(e.target.value)||1.5}))} style={{width:80}} /></div>
                        <div className="input-group"><label className="input-label">Dart length</label><input type="number" className="input-field" value={vals.dartL} onChange={e => setVals(p=>({...p, dartL: parseFloat(e.target.value)||4}))} style={{width:80}} /></div>
                        <div className="input-group"><label className="input-label">Position from seam</label><input type="number" className="input-field" value={vals.posn} onChange={e => setVals(p=>({...p, posn: parseFloat(e.target.value)||2}))} style={{width:80}} /></div>
                </div>
            </div>
            <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(280,50%,45%)" }}>
                <h2 className={styles.calcTitle}>Results</h2>
                <div className={styles.resultDetails}>
                    <div className="result-row"><span>Intake at position</span><strong>{intakeAt.toFixed(2)+'"'}</strong></div>
                        <div className="result-row"><span>Triangle area</span><strong>{area.toFixed(1)+' sq in'}</strong></div>
                </div>
            </div>
            <div className="toolbar" style={{ marginBottom: 10 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText("Dart Intake Calculator result")}><ClipboardCopy size={13} /> Copy</button>
                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
            </div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link">All Garment</a></div></aside></div></div>);
}
