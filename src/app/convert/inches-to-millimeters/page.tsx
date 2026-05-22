"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

export default function InchesToMillimetersPage() {
    const [inches, setInches] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const numIn = parseFloat(inches) || 0;
    const mm = numIn * 25.4;
    const cm = mm / 10;

    const presets = [
        { l: '⅛"', v: 0.125 }, { l: '¼"', v: 0.25 }, { l: '⅜"', v: 0.375 }, { l: '½"', v: 0.5 },
        { l: '⅝"', v: 0.625 }, { l: '¾"', v: 0.75 }, { l: '1"', v: 1 }, { l: '1½"', v: 1.5 }, { l: '2"', v: 2 },
    ];
    const faqItems = [
        { q: "How many millimeters are in one inch?", a: "One inch equals exactly 25.4 millimeters." },
        { q: "When do sewists need inches to mm conversion?", a: "When ordering hardware (buttons, snaps, grommets) or needles that are sized in millimeters." },
    ];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Inches to Millimeters" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><span>📏</span> Conversion Tool #8</span>
                        <h1>Inches to Millimeters Converter</h1>
                        <p>Convert inches (including sewing fractions) to millimeters for precise hardware sizing.</p>
                    </div>
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Enter Inches</h2>
                        <div className="calculator-form">
                            <div className="input-group">
                                <label className="input-label" htmlFor="in">Inches</label>
                                <input id="in" type="number" className="input-field" placeholder="e.g., 0.625 for ⅝&quot;" value={inches} onChange={e => setInches(e.target.value)} min="0" step="0.0625" />
                            </div>
                            <div className={styles.presets}><span className={styles.presetsLabel}>Common fractions:</span>
                                <div className={styles.presetGrid}>{presets.map(p => (<button key={p.l} className={`btn btn-ghost btn-sm ${parseFloat(inches) === p.v ? styles.presetActive : ""}`} onClick={() => setInches(p.v.toString())}>{p.l}</button>))}</div>
                            </div>
                        </div>
                        {numIn > 0 && (
                            <div className={`calculator-results ${styles.results}`}>
                                <div className="result-card">
                                    <div className="result-value">{mm.toFixed(2)} mm</div>
                                    <div className="result-label">{numIn}&quot; = {mm.toFixed(2)} millimeters</div>
                                </div>
                                <div className={styles.resultDetails}>
                                    <div className={styles.resultRow}><span>Centimeters</span><strong>{cm.toFixed(3)} cm</strong></div>
                                </div>
                                <div className="toolbar">
                                    <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`${numIn}" = ${mm.toFixed(2)} mm`)}>📋 Copy</button>
                                    <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>🖨️ Print</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar">
                    <div className="glass-card related-tools"><h4>Related Tools</h4>
                        <a href="/convert/millimeters-to-inches" className="related-tool-link">🔄 MM to Inches</a>
                        <a href="/convert/inches-to-centimeters" className="related-tool-link">📏 Inches to CM</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}
