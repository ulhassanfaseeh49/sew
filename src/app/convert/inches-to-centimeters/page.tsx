"use client";

import { useState, useCallback } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

const IN_TO_CM = 2.54;

const commonPresets = [
    { label: '¼"', value: 0.25 }, { label: '⅜"', value: 0.375 }, { label: '½"', value: 0.5 },
    { label: '⅝"', value: 0.625 }, { label: '¾"', value: 0.75 }, { label: '1"', value: 1 },
    { label: '1½"', value: 1.5 }, { label: '2"', value: 2 }, { label: '3"', value: 3 },
    { label: '6"', value: 6 }, { label: '12"', value: 12 }, { label: '18"', value: 18 },
    { label: '22"', value: 22 }, { label: '36"', value: 36 }, { label: '45"', value: 45 },
    { label: '60"', value: 60 },
];

const faqItems = [
    { q: "How many centimeters are in one inch?", a: "One inch equals exactly 2.54 centimeters. This is an internationally standardized conversion factor." },
    { q: "Why are sewing fractions like 5/8\" important?", a: "The 5/8\" (1.59 cm) seam allowance is the standard in American garment sewing patterns. Being able to convert this accurately to metric is essential for sewists using metric rulers." },
    { q: "What's the metric equivalent of a 1/4\" quilt seam allowance?", a: "A 1/4\" seam allowance equals 0.635 cm. Most quilters using metric round this to 0.6 cm or 0.75 cm (the nearest standard metric seam allowance)." },
];

export default function InchesToCentimetersPage() {
    const [inches, setInches] = useState<string>("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const numericInches = parseFloat(inches) || 0;
    const cm = numericInches * IN_TO_CM;
    const mm = cm * 10;
    const meters = cm / 100;

    const handleCopy = useCallback(() => {
        if (numericInches > 0) {
            navigator.clipboard.writeText(`${numericInches}" = ${cm.toFixed(2)} cm (${mm.toFixed(1)} mm)`);
        }
    }, [numericInches, cm, mm]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Inches to Centimeters" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><span>📏</span> Conversion Tool #3</span>
                        <h1>Inches to Centimeters Converter</h1>
                        <p>Convert inches (including sewing fractions like 5/8&quot;) to centimeters instantly. Essential for working with international patterns.</p>
                    </div>

                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Enter Inches</h2>
                        <div className="calculator-form">
                            <div className="input-group">
                                <label className="input-label" htmlFor="inches-input">Inches</label>
                                <input id="inches-input" type="number" className="input-field" placeholder='Enter inches (e.g., 5.625 for 5⅝")' value={inches} onChange={(e) => setInches(e.target.value)} min="0" step="0.0625" />
                            </div>
                            <div className={styles.presets}>
                                <span className={styles.presetsLabel}>Common sewing measurements:</span>
                                <div className={styles.presetGrid}>
                                    {commonPresets.map((p) => (
                                        <button key={p.label} className={`btn btn-ghost btn-sm ${parseFloat(inches) === p.value ? styles.presetActive : ""}`} onClick={() => setInches(p.value.toString())}>{p.label}</button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {numericInches > 0 && (
                            <div className={`calculator-results ${styles.results}`}>
                                <div className="result-card">
                                    <div className="result-value">{cm.toFixed(2)} cm</div>
                                    <div className="result-label">{numericInches}&quot; in centimeters</div>
                                </div>
                                <div className={styles.resultDetails}>
                                    <div className={styles.resultRow}><span>Millimeters</span><strong>{mm.toFixed(1)} mm</strong></div>
                                    <div className={styles.resultRow}><span>Meters</span><strong>{meters.toFixed(4)} m</strong></div>
                                    <div className={styles.resultRow}><span>Rounded (nearest 0.5cm)</span><strong>{(Math.round(cm * 2) / 2).toFixed(1)} cm</strong></div>
                                </div>
                                <div className="toolbar">
                                    <button className="btn btn-secondary btn-sm" onClick={handleCopy}>📋 Copy Result</button>
                                    <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>🖨️ Print</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={`glass-card ${styles.infoSection}`}>
                        <h2>Sewing-Specific Conversion Reference</h2>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead><tr><th>Inches</th><th>Fraction</th><th>CM</th><th>MM</th><th>Sewing Use</th></tr></thead>
                                <tbody>
                                    {[
                                        { val: 0.25, frac: '¼"', use: "Quilt seam allowance" },
                                        { val: 0.375, frac: '⅜"', use: "French seam, lightweight" },
                                        { val: 0.5, frac: '½"', use: "Home décor / craft" },
                                        { val: 0.625, frac: '⅝"', use: "Standard garment SA" },
                                        { val: 1, frac: '1"', use: "Fur, coat seam allowance" },
                                        { val: 1.5, frac: '1½"', use: "Standard hem allowance" },
                                        { val: 2, frac: '2"', use: "Wide waistband width" },
                                        { val: 18, frac: '18"', use: "Fat quarter height" },
                                        { val: 22, frac: '22"', use: "Fat quarter width" },
                                        { val: 44, frac: '44"', use: "Standard fabric width" },
                                        { val: 60, frac: '60"', use: "Wide fabric width" },
                                    ].map((r) => (
                                        <tr key={r.val}><td>{r.val}</td><td>{r.frac}</td><td>{(r.val * IN_TO_CM).toFixed(2)}</td><td>{(r.val * IN_TO_CM * 10).toFixed(1)}</td><td style={{ color: 'var(--color-text-tertiary)' }}>{r.use}</td></tr>
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
                        <a href="/convert/centimeters-to-inches" className="related-tool-link">🔄 Centimeters to Inches</a>
                        <a href="/convert/millimeters-to-inches" className="related-tool-link">📏 Millimeters to Inches</a>
                        <a href="/seam-allowance/converter" className="related-tool-link">✂️ Seam Allowance Converter</a>
                        <a href="/convert/fraction-to-decimal" className="related-tool-link">🔢 Fraction to Decimal</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}
