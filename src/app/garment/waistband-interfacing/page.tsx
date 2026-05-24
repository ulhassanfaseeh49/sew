"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Scissors, ClipboardCopy, Printer } from "lucide-react";

export default function Page() {
    const [vals, setVals] = useState({"waist":28,"width":1.5});
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const faqItems = [{"q":"Do I always interface waistbands?","a":"Yes! Prevents stretching and rolling. Use firm, not lightweight interfacing."}];
    const intLen=vals.waist+3;const intW=vals.width;
    return (<div className="container"><Breadcrumb items={[{ label: "Garment", href: "/garment" }, { label: "Waistband Interfacing Calculator" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} /> Garment #212</span><h1>Waistband Interfacing Calculator</h1><p>Calculate interfacing for waistbands.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}>
                <h2 className={styles.calcTitle}>Measurements</h2>
                <div className="calculator-form-row">
                    <div className="input-group"><label className="input-label">Waist measurement</label><input type="number" className="input-field" value={vals.waist} onChange={e => setVals(p=>({...p, waist: parseFloat(e.target.value)||28}))} style={{width:80}} /></div>
                        <div className="input-group"><label className="input-label">Band width</label><input type="number" className="input-field" value={vals.width} onChange={e => setVals(p=>({...p, width: parseFloat(e.target.value)||1.5}))} style={{width:80}} /></div>
                </div>
            </div>
            <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(280,50%,45%)" }}>
                <h2 className={styles.calcTitle}>Results</h2>
                <div className={styles.resultDetails}>
                    <div className="result-row"><span>Interfacing cut</span><strong>{intLen.toFixed(0)+'" x '+intW+'"'}</strong></div>
                        <div className="result-row"><span>Type recommended</span><strong>{'Firm fusible (Pellon SF101 or 931TD)'}</strong></div>
                </div>
            </div>
            <div className="toolbar" style={{ marginBottom: 10 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText("Waistband Interfacing Calculator result")}><ClipboardCopy size={13} /> Copy</button>
                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
            </div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link">All Garment</a></div></aside></div></div>);
}
