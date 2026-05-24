"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Scissors, ClipboardCopy, Printer } from "lucide-react";

export default function Page() {
    const [vals, setVals] = useState({"armhole":18,"capCirc":20});
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const faqItems = [{"q":"How much sleeve cap ease?","a":"1-1.5\" for standard. 1.5-2\" for tailored. Over 2\" needs very careful easing."}];
    const ease=vals.capCirc-vals.armhole;const pct=(ease/vals.armhole*100).toFixed(1);
    return (<div className="container"><Breadcrumb items={[{ label: "Garment", href: "/garment" }, { label: "Sleeve Cap Ease Calculator" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} /> Garment #220</span><h1>Sleeve Cap Ease Calculator</h1><p>Calculate ease for setting sleeves.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}>
                <h2 className={styles.calcTitle}>Measurements</h2>
                <div className="calculator-form-row">
                    <div className="input-group"><label className="input-label">Armhole measurement</label><input type="number" className="input-field" value={vals.armhole} onChange={e => setVals(p=>({...p, armhole: parseFloat(e.target.value)||18}))} style={{width:80}} /></div>
                        <div className="input-group"><label className="input-label">Sleeve cap circumference</label><input type="number" className="input-field" value={vals.capCirc} onChange={e => setVals(p=>({...p, capCirc: parseFloat(e.target.value)||20}))} style={{width:80}} /></div>
                </div>
            </div>
            <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(280,50%,45%)" }}>
                <h2 className={styles.calcTitle}>Results</h2>
                <div className={styles.resultDetails}>
                    <div className="result-row"><span>Sleeve cap ease</span><strong>{ease.toFixed(1)+'"'}</strong></div>
                        <div className="result-row"><span>Ease percentage</span><strong>{pct+'%'}</strong></div>
                        <div className="result-row"><span>Recommendation</span><strong>{ease<1?'Too little ease':ease>2.5?'High ease - ease stitch carefully':'Normal range'}</strong></div>
                </div>
            </div>
            <div className="toolbar" style={{ marginBottom: 10 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText("Sleeve Cap Ease Calculator result")}><ClipboardCopy size={13} /> Copy</button>
                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
            </div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link">All Garment</a></div></aside></div></div>);
}
