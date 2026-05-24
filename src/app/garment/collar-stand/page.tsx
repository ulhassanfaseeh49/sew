"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Scissors, ClipboardCopy, Printer } from "lucide-react";

export default function Page() {
    const [vals, setVals] = useState({"neckCirc":15,"standH":1.25});
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const faqItems = [{"q":"Standard collar stand height?","a":"Dress shirt: 1.25\". Casual: 1\". Mandarin/band: 1-1.5\". Stand holds collar upright."}];
    const cutL=vals.neckCirc+3;const cutW=vals.standH*2+1.25;
    return (<div className="container"><Breadcrumb items={[{ label: "Garment", href: "/garment" }, { label: "Collar Stand Calculator" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} /> Garment #222</span><h1>Collar Stand Calculator</h1><p>Calculate collar stand and fall dimensions.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}>
                <h2 className={styles.calcTitle}>Measurements</h2>
                <div className="calculator-form-row">
                    <div className="input-group"><label className="input-label">Neck circumference</label><input type="number" className="input-field" value={vals.neckCirc} onChange={e => setVals(p=>({...p, neckCirc: parseFloat(e.target.value)||15}))} style={{width:80}} /></div>
                        <div className="input-group"><label className="input-label">Stand height</label><input type="number" className="input-field" value={vals.standH} onChange={e => setVals(p=>({...p, standH: parseFloat(e.target.value)||1.25}))} style={{width:80}} /></div>
                </div>
            </div>
            <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(280,50%,45%)" }}>
                <h2 className={styles.calcTitle}>Results</h2>
                <div className={styles.resultDetails}>
                    <div className="result-row"><span>Stand cut length</span><strong>{cutL.toFixed(1)+'"'}</strong></div>
                        <div className="result-row"><span>Stand cut width</span><strong>{cutW.toFixed(1)+'"'}</strong></div>
                        <div className="result-row"><span>Interfacing</span><strong>{'Full piece, fusible'}</strong></div>
                </div>
            </div>
            <div className="toolbar" style={{ marginBottom: 10 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText("Collar Stand Calculator result")}><ClipboardCopy size={13} /> Copy</button>
                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
            </div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link">All Garment</a></div></aside></div></div>);
}
