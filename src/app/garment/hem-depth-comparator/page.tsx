"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Scissors, ClipboardCopy, Printer } from "lucide-react";

export default function Page() {
    const [vals, setVals] = useState({"len":40});
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const faqItems = [{"q":"What hem depth for my project?","a":"Heavier fabric = wider hem. Formal = wider. Casual = narrower. Sheer = rolled."}];
    const hems=[0.25,0.5,0.625,1,1.5,2,3];
    return (<div className="container"><Breadcrumb items={[{ label: "Garment", href: "/garment" }, { label: "Hem Depth Comparator" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} /> Garment #214</span><h1>Hem Depth Comparator</h1><p>Compare different hem depths visually.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}>
                <h2 className={styles.calcTitle}>Measurements</h2>
                <div className="calculator-form-row">
                    <div className="input-group"><label className="input-label">Garment length</label><input type="number" className="input-field" value={vals.len} onChange={e => setVals(p=>({...p, len: parseFloat(e.target.value)||40}))} style={{width:80}} /></div>
                </div>
            </div>
            <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(280,50%,45%)" }}>
                <h2 className={styles.calcTitle}>Results</h2>
                <div className={styles.resultDetails}>
                    <div className="result-row"><span>Narrow rolled</span><strong>{'1/4" - for sheer, delicate'}</strong></div>
                        <div className="result-row"><span>Baby hem</span><strong>{'1/2" - lightweight fabrics'}</strong></div>
                        <div className="result-row"><span>Standard narrow</span><strong>{'5/8" - blouses, shirts'}</strong></div>
                        <div className="result-row"><span>Medium</span><strong>{'1" - casual pants'}</strong></div>
                        <div className="result-row"><span>Standard wide</span><strong>{'1.5" - pants, jackets'}</strong></div>
                        <div className="result-row"><span>Full</span><strong>{'2" - skirts, dresses'}</strong></div>
                        <div className="result-row"><span>Deep</span><strong>{'3" - formal, curtains'}</strong></div>
                </div>
            </div>
            <div className="toolbar" style={{ marginBottom: 10 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText("Hem Depth Comparator result")}><ClipboardCopy size={13} /> Copy</button>
                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
            </div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link">All Garment</a></div></aside></div></div>);
}
