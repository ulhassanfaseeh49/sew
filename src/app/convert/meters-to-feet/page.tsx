"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

export default function MetersToFeetPage() {
    const [meters, setMeters] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const m = parseFloat(meters) || 0;
    const totalInches = m * 39.3701;
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    const yards = m * 1.0936133;
    const cm = m * 100;

    const faqItems = [
        { q: "How many feet are in one meter?", a: "One meter equals approximately 3 feet 3.37 inches (3.2808 feet)." },
        { q: "When would I convert meters to feet?", a: "When measuring rooms for curtains, tablecloths, or upholstery projects where room dimensions are needed in feet." },
    ];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Meters to Feet" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><span>📏</span> Conversion Tool #6</span>
                        <h1>Meters to Feet Converter</h1>
                        <p>Convert meters to feet and inches for room measurements and large fabric projects.</p>
                    </div>
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Enter Meters</h2>
                        <div className="calculator-form">
                            <div className="input-group">
                                <label className="input-label" htmlFor="m">Meters</label>
                                <input id="m" type="number" className="input-field" placeholder="e.g., 2.5" value={meters} onChange={e => setMeters(e.target.value)} min="0" step="0.1" />
                            </div>
                        </div>
                        {m > 0 && (
                            <div className={`calculator-results ${styles.results}`}>
                                <div className="result-card">
                                    <div className="result-value">{feet}&apos; {inches.toFixed(1)}&quot;</div>
                                    <div className="result-label">{m} meters = {feet} feet {inches.toFixed(1)} inches</div>
                                </div>
                                <div className={styles.resultDetails}>
                                    <div className={styles.resultRow}><span>Decimal feet</span><strong>{(m * 3.28084).toFixed(4)} ft</strong></div>
                                    <div className={styles.resultRow}><span>Yards</span><strong>{yards.toFixed(4)} yd</strong></div>
                                    <div className={styles.resultRow}><span>Centimeters</span><strong>{cm.toFixed(1)} cm</strong></div>
                                    <div className={styles.resultRow}><span>Total inches</span><strong>{totalInches.toFixed(2)}&quot;</strong></div>
                                </div>
                                <div className="toolbar">
                                    <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`${m} m = ${feet}' ${inches.toFixed(1)}"`)}>📋 Copy</button>
                                    <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>🖨️ Print</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar">
                    <div className="glass-card related-tools"><h4>Related Tools</h4>
                        <a href="/convert/feet-to-meters" className="related-tool-link">🔄 Feet to Meters</a>
                        <a href="/convert/meters-to-yards" className="related-tool-link">📏 Meters to Yards</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}
