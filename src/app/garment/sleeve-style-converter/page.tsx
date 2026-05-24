"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Scissors, ClipboardCopy, Printer } from "lucide-react";

export default function Page() {
    const [vals, setVals] = useState({"from":0,"armLen":23});
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const faqItems = [{"q":"Can I convert sleeve types?","a":"Yes with pattern adjustment. Set-in to raglan: remove shoulder seam, reshape armhole."}];
    const dataRows=['Set-in sleeve','Raglan sleeve','Dolman/batwing'];const fromS=dataRows[vals.from]|| dataRows[0];
    return (<div className="container"><Breadcrumb items={[{ label: "Garment", href: "/garment" }, { label: "Sleeve Style Converter" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} /> Garment #221</span><h1>Sleeve Style Converter</h1><p>Convert between sleeve types.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}>
                <h2 className={styles.calcTitle}>Measurements</h2>
                <div className="calculator-form-row">
                    <div className="input-group"><label className="input-label">From style (0-2)</label><input type="number" className="input-field" value={vals.from} onChange={e => setVals(p=>({...p, from: parseFloat(e.target.value)||0}))} style={{width:80}} /></div>
                        <div className="input-group"><label className="input-label">Arm length</label><input type="number" className="input-field" value={vals.armLen} onChange={e => setVals(p=>({...p, armLen: parseFloat(e.target.value)||23}))} style={{width:80}} /></div>
                </div>
            </div>
            <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(280,50%,45%)" }}>
                <h2 className={styles.calcTitle}>Results</h2>
                <div className={styles.resultDetails}>
                    <div className="result-row"><span>Converting from</span><strong>{fromS}</strong></div>
                        <div className="result-row"><span>Key change</span><strong>{'Adjust shoulder seam/armhole shape'}</strong></div>
                        <div className="result-row"><span>Arm length ref</span><strong>{vals.armLen+'"'}</strong></div>
                </div>
            </div>
            <div className="toolbar" style={{ marginBottom: 10 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText("Sleeve Style Converter result")}><ClipboardCopy size={13} /> Copy</button>
                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
            </div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link">All Garment</a></div></aside></div></div>);
}
