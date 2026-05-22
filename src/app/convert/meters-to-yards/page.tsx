"use client";

import { useState, useCallback } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

const METERS_TO_YARDS = 1.0936133;

const commonPresets = [
    { label: "0.25 m", value: 0.25 },
    { label: "0.5 m", value: 0.5 },
    { label: "1 m", value: 1 },
    { label: "1.5 m", value: 1.5 },
    { label: "2 m", value: 2 },
    { label: "2.5 m", value: 2.5 },
    { label: "3 m", value: 3 },
    { label: "5 m", value: 5 },
    { label: "10 m", value: 10 },
];

const faqItems = [
    { q: "How many yards are in one meter?", a: "One meter equals approximately 1.0936 yards, or about 1 yard and 3.37 inches." },
    { q: "Is a meter longer than a yard?", a: "Yes, a meter is about 9.4% longer than a yard. One meter equals approximately 39.37 inches, while one yard equals 36 inches." },
    { q: "How do I convert a European pattern's fabric requirement to yards?", a: "Multiply the meters by 1.0936 to get yards. Then round up to the nearest ¼ yard for safe purchasing." },
];

export default function MetersToYardsPage() {
    const [meters, setMeters] = useState<string>("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const numericMeters = parseFloat(meters) || 0;
    const yards = numericMeters * METERS_TO_YARDS;
    const inches = numericMeters * 39.3701;
    const cm = numericMeters * 100;

    const fractionYards = (val: number) => {
        const whole = Math.floor(val);
        const frac = val - whole;
        const fractions = [
            { val: 0, label: "" }, { val: 0.125, label: "⅛" }, { val: 0.25, label: "¼" },
            { val: 0.333, label: "⅓" }, { val: 0.375, label: "⅜" }, { val: 0.5, label: "½" },
            { val: 0.625, label: "⅝" }, { val: 0.667, label: "⅔" }, { val: 0.75, label: "¾" },
            { val: 0.875, label: "⅞" }, { val: 1, label: "" }
        ];
        let closest = fractions[0];
        let minDiff = Math.abs(frac - fractions[0].val);
        for (const f of fractions) {
            const diff = Math.abs(frac - f.val);
            if (diff < minDiff) { minDiff = diff; closest = f; }
        }
        if (closest.val === 1) return `${whole + 1}`;
        if (closest.val === 0) return `${whole}`;
        return whole > 0 ? `${whole} ${closest.label}` : closest.label;
    };

    const handleCopy = useCallback(() => {
        if (numericMeters > 0) {
            navigator.clipboard.writeText(`${numericMeters} meters = ${yards.toFixed(4)} yards`);
        }
    }, [numericMeters, yards]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Meters to Yards" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><span>📏</span> Conversion Tool #2</span>
                        <h1>Meters to Yards Converter</h1>
                        <p>Convert fabric meters to yards with fraction display. Perfect for converting European pattern requirements.</p>
                    </div>

                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Enter Meters</h2>
                        <div className="calculator-form">
                            <div className="input-group">
                                <label className="input-label" htmlFor="meters-input">Meters</label>
                                <input id="meters-input" type="number" className="input-field" placeholder="Enter meters (e.g., 2.0)" value={meters} onChange={(e) => setMeters(e.target.value)} min="0" step="0.1" />
                            </div>
                            <div className={styles.presets}>
                                <span className={styles.presetsLabel}>Quick presets:</span>
                                <div className={styles.presetGrid}>
                                    {commonPresets.map((p) => (
                                        <button key={p.label} className={`btn btn-ghost btn-sm ${parseFloat(meters) === p.value ? styles.presetActive : ""}`} onClick={() => setMeters(p.value.toString())}>{p.label}</button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {numericMeters > 0 && (
                            <div className={`calculator-results ${styles.results}`}>
                                <div className="result-card">
                                    <div className="result-value">{yards.toFixed(4)} yd</div>
                                    <div className="result-label">{numericMeters} meter{numericMeters !== 1 ? "s" : ""} in yards</div>
                                </div>
                                <div className={styles.resultDetails}>
                                    <div className={styles.resultRow}><span>Fraction Display</span><strong>{fractionYards(yards)} yard{yards > 1 ? "s" : ""}</strong></div>
                                    <div className={styles.resultRow}><span>Inches</span><strong>{inches.toFixed(1)} in</strong></div>
                                    <div className={styles.resultRow}><span>Centimeters</span><strong>{cm.toFixed(1)} cm</strong></div>
                                    <div className={styles.resultRow}><span>Rounded up (nearest ¼ yd)</span><strong>{(Math.ceil(yards * 4) / 4).toFixed(2)} yd</strong></div>
                                </div>
                                <div className="toolbar">
                                    <button className="btn btn-secondary btn-sm" onClick={handleCopy}>📋 Copy Result</button>
                                    <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>🖨️ Print</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={`glass-card ${styles.infoSection}`}>
                        <h2>Common Meters to Yards</h2>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead><tr><th>Meters</th><th>Yards</th><th>Fraction</th></tr></thead>
                                <tbody>
                                    {[0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 4, 5].map((m) => (
                                        <tr key={m}><td>{m}</td><td>{(m * METERS_TO_YARDS).toFixed(4)}</td><td>{fractionYards(m * METERS_TO_YARDS)} yd</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <section className="faq-section">
                        <h2>Frequently Asked Questions</h2>
                        <div style={{ marginTop: "1.5rem" }}>
                            {faqItems.map((faq, i) => (
                                <div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}>
                                    <button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                                        {faq.q}
                                        <svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                                    </button>
                                    <div className="faq-answer">{faq.a}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <aside className="calculator-sidebar">
                    <div className="glass-card related-tools">
                        <h4>Related Tools</h4>
                        <a href="/convert/yards-to-meters" className="related-tool-link">🔄 Yards to Meters</a>
                        <a href="/convert/centimeters-to-inches" className="related-tool-link">📏 Centimeters to Inches</a>
                        <a href="/convert/universal-sewing-converter" className="related-tool-link">🌐 Universal Converter</a>
                        <a href="/cost/per-meter" className="related-tool-link">💰 Cost Per Meter</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}
