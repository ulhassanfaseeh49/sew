"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Scissors, ClipboardCopy, Printer } from "lucide-react";

export default function Page() {
    const [vals, setVals] = useState({"finLen":60,"depth":3,"ratio":2.5});
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const faqItems = [{"q":"Self-lined ruffle?","a":"Double the strip width and fold in half. No hem needed at bottom edge!"}];
    const ungathered=vals.finLen*vals.ratio;const cutW=vals.depth+0.75+0.5;const strips=Math.ceil(ungathered/44);const yd=Math.ceil(strips*cutW/36*4)/4;
    return (<div className="container"><Breadcrumb items={[{ label: "Garment", href: "/garment" }, { label: "Ruffle Fullness Calculator" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} /> Garment #208</span><h1>Ruffle Fullness Calculator</h1><p>Calculate fabric strips for ruffles.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}>
                <h2 className={styles.calcTitle}>Measurements</h2>
                <div className="calculator-form-row">
                    <div className="input-group"><label className="input-label">Finished ruffle length</label><input type="number" className="input-field" value={vals.finLen} onChange={e => setVals(p=>({...p, finLen: parseFloat(e.target.value)||60}))} style={{width:80}} /></div>
                        <div className="input-group"><label className="input-label">Ruffle depth</label><input type="number" className="input-field" value={vals.depth} onChange={e => setVals(p=>({...p, depth: parseFloat(e.target.value)||3}))} style={{width:80}} /></div>
                        <div className="input-group"><label className="input-label">Fullness ratio</label><input type="number" className="input-field" value={vals.ratio} onChange={e => setVals(p=>({...p, ratio: parseFloat(e.target.value)||2.5}))} style={{width:80}} /></div>
                </div>
            </div>
            <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(280,50%,45%)" }}>
                <h2 className={styles.calcTitle}>Results</h2>
                <div className={styles.resultDetails}>
                    <div className="result-row"><span>Ungathered length</span><strong>{ungathered+'"'}</strong></div>
                        <div className="result-row"><span>Cut strip width</span><strong>{cutW.toFixed(2)+'"'}</strong></div>
                        <div className="result-row"><span>Strips to join</span><strong>{strips}</strong></div>
                        <div className="result-row"><span>Yardage</span><strong>{yd+' yd'}</strong></div>
                </div>
            </div>
            <div className="toolbar" style={{ marginBottom: 10 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText("Ruffle Fullness Calculator result")}><ClipboardCopy size={13} /> Copy</button>
                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
            </div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link">All Garment</a></div></aside></div></div>);
}
