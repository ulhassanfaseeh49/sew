"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

const units = ["yards", "meters", "inches", "centimeters", "millimeters", "feet"] as const;
type Unit = typeof units[number];
const toInches: Record<Unit, number> = { yards: 36, meters: 39.3701, inches: 1, centimeters: 0.393701, millimeters: 0.0393701, feet: 12 };
const fromInches: Record<Unit, number> = { yards: 1 / 36, meters: 0.0254, inches: 1, centimeters: 2.54, millimeters: 25.4, feet: 1 / 12 };
const labels: Record<Unit, string> = { yards: "Yards", meters: "Meters", inches: "Inches", centimeters: "Centimeters", millimeters: "Millimeters", feet: "Feet" };
const abbr: Record<Unit, string> = { yards: "yd", meters: "m", inches: "in", centimeters: "cm", millimeters: "mm", feet: "ft" };

export default function UniversalConverterPage() {
    const [fromUnit, setFromUnit] = useState<Unit>("yards");
    const [toUnit, setToUnit] = useState<Unit>("meters");
    const [value, setValue] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const num = parseFloat(value) || 0;
    const inInches = num * toInches[fromUnit];
    const result = inInches * fromInches[toUnit];

    const allResults = units.filter(u => u !== fromUnit).map(u => ({ unit: u, value: inInches * fromInches[u] }));

    const faqItems = [
        { q: "Why is an all-in-one converter useful?", a: "Instead of switching between multiple tools, you can convert any sewing measurement in any direction with one calculator." },
    ];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Universal Sewing Converter" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><span>🌐</span> Conversion Tool #11</span>
                        <h1>All-in-One Sewing Unit Converter</h1>
                        <p>Master converter: yards, meters, inches, cm, mm, feet — any direction with sewing presets.</p>
                    </div>
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Convert Units</h2>
                        <div className="calculator-form">
                            <div className="calculator-form-row">
                                <div className="input-group">
                                    <label className="input-label">From</label>
                                    <select className="input-field" value={fromUnit} onChange={e => setFromUnit(e.target.value as Unit)}>
                                        {units.map(u => (<option key={u} value={u}>{labels[u]}</option>))}
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label className="input-label">To</label>
                                    <select className="input-field" value={toUnit} onChange={e => setToUnit(e.target.value as Unit)}>
                                        {units.map(u => (<option key={u} value={u}>{labels[u]}</option>))}
                                    </select>
                                </div>
                            </div>
                            <div className="input-group">
                                <label className="input-label" htmlFor="val">Value</label>
                                <input id="val" type="number" className="input-field" placeholder={`Enter ${labels[fromUnit].toLowerCase()}`} value={value} onChange={e => setValue(e.target.value)} min="0" step="0.01" />
                            </div>
                        </div>
                        {num > 0 && (
                            <div className={`calculator-results ${styles.results}`}>
                                <div className="result-card">
                                    <div className="result-value">{result.toFixed(4)} {abbr[toUnit]}</div>
                                    <div className="result-label">{num} {abbr[fromUnit]} = {result.toFixed(4)} {labels[toUnit].toLowerCase()}</div>
                                </div>
                                <div className={styles.resultDetails}>
                                    {allResults.map(r => (
                                        <div key={r.unit} className={styles.resultRow}>
                                            <span>{labels[r.unit]}</span><strong>{r.value.toFixed(4)} {abbr[r.unit]}</strong>
                                        </div>
                                    ))}
                                </div>
                                <div className="toolbar">
                                    <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`${num} ${abbr[fromUnit]} = ${result.toFixed(4)} ${abbr[toUnit]}`)}>📋 Copy</button>
                                    <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>🖨️ Print</button>
                                    <button className="btn btn-ghost btn-sm" onClick={() => { setFromUnit(toUnit); setToUnit(fromUnit); }}>🔄 Swap</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar">
                    <div className="glass-card related-tools"><h4>Related Tools</h4>
                        <a href="/convert/yards-to-meters" className="related-tool-link">📏 Yards to Meters</a>
                        <a href="/convert/inches-to-centimeters" className="related-tool-link">📏 Inches to CM</a>
                        <a href="/convert/fraction-to-decimal" className="related-tool-link">🔢 Fraction/Decimal</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}
