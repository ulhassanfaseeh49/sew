"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

export default function FabricWidth36to45Page() {
    const [yardage, setYardage] = useState("");
    const [direction, setDirection] = useState<"36to45" | "45to36">("36to45");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const y = parseFloat(yardage) || 0;
    const fromW = direction === "36to45" ? 36 : 44.5;
    const toW = direction === "36to45" ? 44.5 : 36;
    const converted = y * (fromW / toW);
    const rounded = Math.ceil(converted * 8) / 8;

    const faqItems = [
        { q: "Why is 36\" fabric still relevant?", a: "Many vintage patterns from the 1940s-1960s were designed for 36\"-wide fabric. If you're recreating vintage garments, you'll need this conversion for modern 44/45\" fabric." },
    ];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "36\" to 44/45\" Width" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><span>↔️</span> Conversion Tool #14</span>
                        <h1>Fabric Width Converter (36&quot; to 44/45&quot;)</h1>
                        <p>Convert between vintage 36&quot;-wide and standard 44/45&quot; fabric widths.</p>
                    </div>
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Convert Width</h2>
                        <div className="calculator-form">
                            <div className="input-group">
                                <label className="input-label">Direction</label>
                                <select className="input-field" value={direction} onChange={e => setDirection(e.target.value as "36to45" | "45to36")}>
                                    <option value="36to45">36&quot; → 44/45&quot;</option>
                                    <option value="45to36">44/45&quot; → 36&quot;</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label className="input-label" htmlFor="yd">Yardage for {fromW}&quot; fabric</label>
                                <input id="yd" type="number" className="input-field" placeholder="e.g., 3" value={yardage} onChange={e => setYardage(e.target.value)} min="0" step="0.125" />
                            </div>
                        </div>
                        {y > 0 && (<div className={`calculator-results ${styles.results}`}>
                            <div className="result-card"><div className="result-value">{rounded.toFixed(3)} yards</div><div className="result-label">For {toW}&quot;-wide fabric</div></div>
                            <div className={styles.resultDetails}>
                                <div className={styles.resultRow}><span>Exact</span><strong>{converted.toFixed(4)} yd</strong></div>
                                <div className={styles.resultRow}><span>Difference</span><strong>{Math.abs(y - converted).toFixed(2)} yd</strong></div>
                            </div>
                            <div className="toolbar">
                                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`${y} yd of ${fromW}" = ${rounded} yd of ${toW}"`)}>📋 Copy</button>
                                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>🖨️ Print</button>
                            </div>
                        </div>)}
                    </div>
                    <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/convert/fabric-width-universal" className="related-tool-link">↔️ Universal Width</a><a href="/convert/fabric-width-44-to-60" className="related-tool-link">↔️ 44&quot; to 60&quot;</a></div></aside>
            </div>
        </div>
    );
}
