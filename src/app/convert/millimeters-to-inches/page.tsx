"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

export default function MillimetersToInchesPage() {
    const [mm, setMm] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const numMm = parseFloat(mm) || 0;
    const inches = numMm / 25.4;
    const cm = numMm / 10;
    // Fraction display
    const whole = Math.floor(inches);
    const rem = inches - whole;
    const sixteenths = Math.round(rem * 16);
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const fractionStr = () => {
        if (sixteenths === 0) return `${whole}"`;
        if (sixteenths === 16) return `${whole + 1}"`;
        const d = gcd(sixteenths, 16); const n = sixteenths / d; const dn = 16 / d;
        return whole > 0 ? `${whole} ${n}/${dn}"` : `${n}/${dn}"`;
    };

    const presets = [1, 2, 3, 5, 6, 8, 10, 12, 15, 18, 20, 25, 30, 40, 50];
    const faqItems = [
        { q: "Why convert millimeters to inches for sewing?", a: "Button sizes, snap sizes, and small sewing hardware are often measured in millimeters. Converting to inches helps match them with imperial patterns." },
        { q: "How many millimeters are in one inch?", a: "One inch equals exactly 25.4 millimeters." },
    ];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Millimeters to Inches" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><span>📏</span> Conversion Tool #7</span>
                        <h1>Millimeters to Inches Converter</h1>
                        <p>Convert millimeters to inches with fraction display — for buttons, snaps, and small hardware.</p>
                    </div>
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Enter Millimeters</h2>
                        <div className="calculator-form">
                            <div className="input-group">
                                <label className="input-label" htmlFor="mm">Millimeters</label>
                                <input id="mm" type="number" className="input-field" placeholder="e.g., 15" value={mm} onChange={e => setMm(e.target.value)} min="0" step="0.5" />
                            </div>
                            <div className={styles.presets}><span className={styles.presetsLabel}>Common sizes (mm):</span>
                                <div className={styles.presetGrid}>{presets.map(p => (<button key={p} className={`btn btn-ghost btn-sm ${parseFloat(mm) === p ? styles.presetActive : ""}`} onClick={() => setMm(p.toString())}>{p}mm</button>))}</div>
                            </div>
                        </div>
                        {numMm > 0 && (
                            <div className={`calculator-results ${styles.results}`}>
                                <div className="result-card">
                                    <div className="result-value">{fractionStr()}</div>
                                    <div className="result-label">{numMm} mm = {inches.toFixed(4)} inches</div>
                                </div>
                                <div className={styles.resultDetails}>
                                    <div className={styles.resultRow}><span>Decimal inches</span><strong>{inches.toFixed(4)}&quot;</strong></div>
                                    <div className={styles.resultRow}><span>Centimeters</span><strong>{cm.toFixed(2)} cm</strong></div>
                                </div>
                                <div className="toolbar">
                                    <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`${numMm} mm = ${fractionStr()} (${inches.toFixed(4)}")`)}>📋 Copy</button>
                                    <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>🖨️ Print</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar">
                    <div className="glass-card related-tools"><h4>Related Tools</h4>
                        <a href="/convert/inches-to-millimeters" className="related-tool-link">🔄 Inches to Millimeters</a>
                        <a href="/convert/centimeters-to-inches" className="related-tool-link">📏 CM to Inches</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}
