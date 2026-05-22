"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Shirt } from "lucide-react";
export default function Page() {
    const [waist, sW] = useState("28"); const [length, sL] = useState("24");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const w = parseFloat(waist) || 28; const l = parseFloat(length) || 24; const skirtStyles = [["Straight", 1.5], ["A-line", 2], ["Quarter circle", 2.5], ["Half circle", 3], ["Full circle", 5]]; const hasResult = true; const resultValue = "see comparison below"; const resultLabel = "estimates for " + w + "\" waist, " + l + "\" length";
    const faqItems = [{ q: "Which skirt style uses the least fabric?", a: "A straight/pencil skirt uses the least (1.5 yards). Full circle uses the most (4-6 yards)." }];
    return (<div className="container"><Breadcrumb items={[{ label: "Skirt", href: "/skirt" }, { label: "Skirt Yardage by Style" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><ClipboardCopy size={14} strokeWidth={1.5} /> Skirt #360</span><h1>Skirt Yardage by Style</h1><p>Compare all skirt styles.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}><h2 className={styles.calcTitle}>Enter Details</h2>
                <div className="calculator-form"><div className="calculator-form-row"><div className="input-group"><label className="input-label">Waist (in)</label><input type="number" className="input-field" value={waist} onChange={e => sW(e.target.value)} /></div><div className="input-group"><label className="input-label">Length (in)</label><input type="number" className="input-field" value={length} onChange={e => sL(e.target.value)} /></div></div></div>
                {hasResult && (<div className={`calculator-results ${styles.results}`}>
                    <div className="result-card"><div className="result-value">{resultValue}</div><div className="result-label">{resultLabel}</div></div>
                    <div className={styles.resultDetails}><div>{[["Straight", "1.5"], ["A-line", "2"], ["Quarter circle", "2.5"], ["Half circle", "3"], ["Full circle", "5"]].map((s, i) => <div key={i} className={styles.resultRow}><span>{s[0]}</span><strong>{s[1]} yards</strong></div>)}</div></div>
                    <div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(resultValue)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button></div>
                </div>)}
            </div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/skirt" className="related-tool-link"><Shirt size={13} /> All Skirts</a></div></aside></div></div>);
}