"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

export default function FabricWidth44to60Page() {
    const [yardage, setYardage] = useState("");
    const [direction, setDirection] = useState<"44to60" | "60to44">("44to60");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const y = parseFloat(yardage) || 0;
    const fromW = direction === "44to60" ? 44.5 : 60;
    const toW = direction === "44to60" ? 60 : 44.5;
    const converted = y * (fromW / toW);
    const rounded = Math.ceil(converted * 8) / 8;

    const faqItems = [
        { q: "When do I need to convert between 44\" and 60\" fabric?", a: "When your pattern calls for 44/45\"-wide fabric but you found a beautiful 60\"-wide option, or vice versa. Wider fabric means less yardage needed." },
    ];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "44/45\" to 60\" Width" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><span>↔️</span> Conversion Tool #12</span>
                        <h1>Fabric Width Converter (44/45&quot; to 60&quot;)</h1>
                        <p>Calculate how much 60&quot;-wide fabric you need when pattern calls for 44/45&quot; fabric, and vice versa.</p>
                    </div>
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Convert Width</h2>
                        <div className="calculator-form">
                            <div className="input-group">
                                <label className="input-label">Direction</label>
                                <select className="input-field" value={direction} onChange={e => setDirection(e.target.value as "44to60" | "60to44")}>
                                    <option value="44to60">44/45&quot; → 60&quot; (need less)</option>
                                    <option value="60to44">60&quot; → 44/45&quot; (need more)</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label className="input-label" htmlFor="yd">Yardage for {fromW}&quot; fabric</label>
                                <input id="yd" type="number" className="input-field" placeholder="e.g., 3" value={yardage} onChange={e => setYardage(e.target.value)} min="0" step="0.125" />
                            </div>
                        </div>
                        {y > 0 && (<div className={`calculator-results ${styles.results}`}>
                            <div className="result-card">
                                <div className="result-value">{rounded.toFixed(3)} yards</div>
                                <div className="result-label">You need this much {toW}&quot;-wide fabric</div>
                            </div>
                            <div className={styles.resultDetails}>
                                <div className={styles.resultRow}><span>Exact</span><strong>{converted.toFixed(4)} yd</strong></div>
                                <div className={styles.resultRow}><span>Savings</span><strong>{Math.abs(y - converted).toFixed(2)} yd ({Math.abs((1 - converted / y) * 100).toFixed(1)}%)</strong></div>
                            </div>
                            <div className="toolbar">
                                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`${y} yd of ${fromW}" = ${rounded.toFixed(3)} yd of ${toW}"`)}>📋 Copy</button>
                                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>🖨️ Print</button>
                            </div>
                        </div>)}
                    </div>
                    <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/convert/fabric-width-universal" className="related-tool-link">↔️ Universal Width Converter</a><a href="/convert/fabric-width-60-to-108" className="related-tool-link">↔️ 60&quot; to 108&quot;</a></div></aside>
            </div>
        </div>
    );
}
