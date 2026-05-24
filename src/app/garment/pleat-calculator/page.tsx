"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Scissors, ClipboardCopy, Printer } from "lucide-react";

export default function Page() {
    const [vals, setVals] = useState({"finW":28,"numPleats":8,"depth":1,"type":0});
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const faqItems = [{"q":"Knife vs box pleat fabric?","a":"Knife: depth x 2 fabric each. Box: depth x 4. Box pleats use twice the fabric!"}];
    const mult=vals.type===0?2:4;const totalFabric=vals.finW+(vals.numPleats*vals.depth*mult);const ratio=(totalFabric/vals.finW).toFixed(1);
    return (<div className="container"><Breadcrumb items={[{ label: "Garment", href: "/garment" }, { label: "Pleat Calculator" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} /> Garment #205</span><h1>Pleat Calculator</h1><p>Calculate pleat depth, spacing, and fabric needed.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}>
                <h2 className={styles.calcTitle}>Measurements</h2>
                <div className="calculator-form-row">
                    <div className="input-group"><label className="input-label">Finished width</label><input type="number" className="input-field" value={vals.finW} onChange={e => setVals(p=>({...p, finW: parseFloat(e.target.value)||28}))} style={{width:80}} /></div>
                        <div className="input-group"><label className="input-label">Number of pleats</label><input type="number" className="input-field" value={vals.numPleats} onChange={e => setVals(p=>({...p, numPleats: parseFloat(e.target.value)||8}))} style={{width:80}} /></div>
                        <div className="input-group"><label className="input-label">Pleat depth</label><input type="number" className="input-field" value={vals.depth} onChange={e => setVals(p=>({...p, depth: parseFloat(e.target.value)||1}))} style={{width:80}} /></div>
                        <div className="input-group"><label className="input-label">Type (0=knife,1=box)</label><input type="number" className="input-field" value={vals.type} onChange={e => setVals(p=>({...p, type: parseFloat(e.target.value)||0}))} style={{width:80}} /></div>
                </div>
            </div>
            <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(280,50%,45%)" }}>
                <h2 className={styles.calcTitle}>Results</h2>
                <div className={styles.resultDetails}>
                    <div className="result-row"><span>Flat fabric needed</span><strong>{totalFabric+'"'}</strong></div>
                        <div className="result-row"><span>Fabric multiplier</span><strong>{ratio+'x'}</strong></div>
                        <div className="result-row"><span>Fabric per pleat</span><strong>{(vals.depth*mult)+'"'}</strong></div>
                </div>
            </div>
            <div className="toolbar" style={{ marginBottom: 10 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText("Pleat Calculator result")}><ClipboardCopy size={13} /> Copy</button>
                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
            </div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link">All Garment</a></div></aside></div></div>);
}
