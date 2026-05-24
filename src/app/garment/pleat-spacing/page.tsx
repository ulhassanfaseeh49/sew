"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Scissors, ClipboardCopy, Printer } from "lucide-react";

export default function Page() {
    const [vals, setVals] = useState({"totalW":28,"numPleats":7,"pleatW":1});
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const faqItems = [{"q":"How to space pleats evenly?","a":"Formula: (total width - all pleat widths) / (pleats + 1) = gap between each."}];
    const totalPleatW=vals.numPleats*vals.pleatW;const space=(vals.totalW-totalPleatW)/(vals.numPleats+1);
    return (<div className="container"><Breadcrumb items={[{ label: "Garment", href: "/garment" }, { label: "Pleat Spacing Tool" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} /> Garment #206</span><h1>Pleat Spacing Tool</h1><p>Calculate even pleat spacing across any width.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}>
                <h2 className={styles.calcTitle}>Measurements</h2>
                <div className="calculator-form-row">
                    <div className="input-group"><label className="input-label">Total width</label><input type="number" className="input-field" value={vals.totalW} onChange={e => setVals(p=>({...p, totalW: parseFloat(e.target.value)||28}))} style={{width:80}} /></div>
                        <div className="input-group"><label className="input-label">Pleats</label><input type="number" className="input-field" value={vals.numPleats} onChange={e => setVals(p=>({...p, numPleats: parseFloat(e.target.value)||7}))} style={{width:80}} /></div>
                        <div className="input-group"><label className="input-label">Pleat width (visible)</label><input type="number" className="input-field" value={vals.pleatW} onChange={e => setVals(p=>({...p, pleatW: parseFloat(e.target.value)||1}))} style={{width:80}} /></div>
                </div>
            </div>
            <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(280,50%,45%)" }}>
                <h2 className={styles.calcTitle}>Results</h2>
                <div className={styles.resultDetails}>
                    <div className="result-row"><span>Space between pleats</span><strong>{space.toFixed(2)+'"'}</strong></div>
                        <div className="result-row"><span>First pleat from edge</span><strong>{space.toFixed(2)+'"'}</strong></div>
                </div>
            </div>
            <div className="toolbar" style={{ marginBottom: 10 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText("Pleat Spacing Tool result")}><ClipboardCopy size={13} /> Copy</button>
                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
            </div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link">All Garment</a></div></aside></div></div>);
}
