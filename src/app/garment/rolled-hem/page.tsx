"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Scissors, ClipboardCopy, Printer } from "lucide-react";

export default function Page() {
    const [vals, setVals] = useState({"method":1});
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const faqItems = [{"q":"When to use rolled hem?","a":"Sheer fabrics, shirt tails, scarves, chiffon overlays. Creates delicate edge."}];
    const methods=[{name:'Hand rolled',allow:0.375,finish:'Ultra fine'},{name:'Machine foot',allow:0.25,finish:'Narrow, 2 folds'},{name:'Serger',allow:0,finish:'Trimmed during sewing'}];const m=methods[vals.method]||methods[0];
    return (<div className="container"><Breadcrumb items={[{ label: "Garment", href: "/garment" }, { label: "Rolled Hem Calculator" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} /> Garment #216</span><h1>Rolled Hem Calculator</h1><p>Calculate rolled/narrow hem dimensions.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}>
                <h2 className={styles.calcTitle}>Measurements</h2>
                <div className="calculator-form-row">
                    <div className="input-group"><label className="input-label">Method (0=hand,1=machine,2=serger)</label><input type="number" className="input-field" value={vals.method} onChange={e => setVals(p=>({...p, method: parseFloat(e.target.value)||1}))} style={{width:80}} /></div>
                </div>
            </div>
            <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(280,50%,45%)" }}>
                <h2 className={styles.calcTitle}>Results</h2>
                <div className={styles.resultDetails}>
                    <div className="result-row"><span>Method</span><strong>{m.name}</strong></div>
                        <div className="result-row"><span>Hem allowance needed</span><strong>{m.allow+'"'}</strong></div>
                        <div className="result-row"><span>Finish</span><strong>{m.finish}</strong></div>
                </div>
            </div>
            <div className="toolbar" style={{ marginBottom: 10 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText("Rolled Hem Calculator result")}><ClipboardCopy size={13} /> Copy</button>
                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
            </div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/garment" className="related-tool-link">All Garment</a></div></aside></div></div>);
}
