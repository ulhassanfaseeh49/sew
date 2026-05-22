"use client";

import { useState, useCallback } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

const CM_TO_IN = 0.393701;

const fractionDisplay = (inches: number): string => {
    const whole = Math.floor(inches);
    const remainder = inches - whole;
    const sixteenths = Math.round(remainder * 16);
    if (sixteenths === 0) return `${whole}"`;
    if (sixteenths === 16) return `${whole + 1}"`;
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const d = gcd(sixteenths, 16);
    const num = sixteenths / d;
    const den = 16 / d;
    return whole > 0 ? `${whole} ${num}/${den}"` : `${num}/${den}"`;
};

const commonPresets = [
    { label: "0.5 cm", value: 0.5 }, { label: "1 cm", value: 1 }, { label: "1.5 cm", value: 1.5 },
    { label: "2 cm", value: 2 }, { label: "2.54 cm", value: 2.54 }, { label: "5 cm", value: 5 },
    { label: "10 cm", value: 10 }, { label: "30 cm", value: 30 }, { label: "50 cm", value: 50 },
    { label: "100 cm", value: 100 }, { label: "114 cm", value: 114 }, { label: "150 cm", value: 150 },
];

export default function CentimetersToInchesPage() {
    const [cm, setCm] = useState<string>("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const numericCm = parseFloat(cm) || 0;
    const inches = numericCm * CM_TO_IN;
    const mm = numericCm * 10;

    const handleCopy = useCallback(() => {
        if (numericCm > 0) {
            navigator.clipboard.writeText(`${numericCm} cm = ${inches.toFixed(4)}" (${fractionDisplay(inches)})`);
        }
    }, [numericCm, inches]);

    const faqItems = [
        { q: "How do I convert centimeters to inches for sewing?", a: "Divide the centimeters by 2.54 to get inches. Our calculator does this for you and also shows the nearest sewing fraction." },
        { q: "What is the nearest sewing fraction?", a: "Sewing typically uses fractions in 16ths of an inch (1/16\", 1/8\", 3/16\", 1/4\", etc.). Our tool rounds to the nearest 1/16\" for precision." },
    ];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Centimeters to Inches" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><span>📏</span> Conversion Tool #4</span>
                        <h1>Centimeters to Inches Converter</h1>
                        <p>Convert centimeters to inches with fraction display (nearest 1/16&quot;). Perfect for translating metric patterns.</p>
                    </div>

                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Enter Centimeters</h2>
                        <div className="calculator-form">
                            <div className="input-group">
                                <label className="input-label" htmlFor="cm-input">Centimeters</label>
                                <input id="cm-input" type="number" className="input-field" placeholder="Enter centimeters (e.g., 10)" value={cm} onChange={(e) => setCm(e.target.value)} min="0" step="0.1" />
                            </div>
                            <div className={styles.presets}>
                                <span className={styles.presetsLabel}>Common values:</span>
                                <div className={styles.presetGrid}>
                                    {commonPresets.map((p) => (
                                        <button key={p.label} className={`btn btn-ghost btn-sm ${parseFloat(cm) === p.value ? styles.presetActive : ""}`} onClick={() => setCm(p.value.toString())}>{p.label}</button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {numericCm > 0 && (
                            <div className={`calculator-results ${styles.results}`}>
                                <div className="result-card">
                                    <div className="result-value">{fractionDisplay(inches)}</div>
                                    <div className="result-label">{numericCm} cm = {inches.toFixed(4)} inches</div>
                                </div>
                                <div className={styles.resultDetails}>
                                    <div className={styles.resultRow}><span>Decimal inches</span><strong>{inches.toFixed(4)}&quot;</strong></div>
                                    <div className={styles.resultRow}><span>Millimeters</span><strong>{mm.toFixed(1)} mm</strong></div>
                                    <div className={styles.resultRow}><span>Nearest ⅛&quot;</span><strong>{(Math.round(inches * 8) / 8).toFixed(3)}&quot;</strong></div>
                                    <div className={styles.resultRow}><span>Nearest ¼&quot;</span><strong>{(Math.round(inches * 4) / 4).toFixed(2)}&quot;</strong></div>
                                </div>
                                <div className="toolbar">
                                    <button className="btn btn-secondary btn-sm" onClick={handleCopy}>📋 Copy</button>
                                    <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>🖨️ Print</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <section className="faq-section">
                        <h2>Frequently Asked Questions</h2>
                        <div style={{ marginTop: "1.5rem" }}>
                            {faqItems.map((faq, i) => (
                                <div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}>
                                    <button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button>
                                    <div className="faq-answer">{faq.a}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <aside className="calculator-sidebar">
                    <div className="glass-card related-tools">
                        <h4>Related Tools</h4>
                        <a href="/convert/inches-to-centimeters" className="related-tool-link">🔄 Inches to Centimeters</a>
                        <a href="/body/measurement-guide" className="related-tool-link">👤 Body Measurement Guide</a>
                        <a href="/convert/decimal-to-fraction" className="related-tool-link">🔢 Decimal to Fraction</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}
