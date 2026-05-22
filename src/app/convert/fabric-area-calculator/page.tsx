"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

const areaUnits = [
    { key: "sqin", label: "Square Inches", factor: 1 },
    { key: "sqft", label: "Square Feet", factor: 1 / 144 },
    { key: "sqcm", label: "Square Centimeters", factor: 6.4516 },
    { key: "sqm", label: "Square Meters", factor: 0.00064516 },
    { key: "sqyd", label: "Square Yards", factor: 1 / 1296 },
];

export default function FabricAreaCalculatorPage() {
    const [width, setWidth] = useState("");
    const [length, setLength] = useState("");
    const [unit, setUnit] = useState<"in" | "cm">("in");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const w = parseFloat(width) || 0;
    const l = parseFloat(length) || 0;
    // Convert to sq inches as base
    const factor = unit === "cm" ? 1 / 2.54 : 1;
    const wIn = w * factor; const lIn = l * factor;
    const sqIn = wIn * lIn;

    const faqItems = [
        { q: "Why calculate fabric area?", a: "Knowing the total area helps compare fabric amounts across different widths and tells you exactly how much usable fabric you have for irregular-shaped projects." },
    ];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Fabric Area Calculator" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><span>📐</span> Conversion Tool #24</span>
                        <h1>Fabric Area Calculator</h1>
                        <p>Calculate total fabric area in square inches, square feet, sq cm, or sq meters.</p>
                    </div>
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Fabric Dimensions</h2>
                        <div className="calculator-form">
                            <div className="input-group">
                                <label className="input-label">Unit</label>
                                <select className="input-field" value={unit} onChange={e => setUnit(e.target.value as "in" | "cm")}>
                                    <option value="in">Inches</option><option value="cm">Centimeters</option>
                                </select>
                            </div>
                            <div className="calculator-form-row">
                                <div className="input-group"><label className="input-label" htmlFor="w">Width ({unit})</label><input id="w" type="number" className="input-field" placeholder="e.g., 44" value={width} onChange={e => setWidth(e.target.value)} min="0" /></div>
                                <div className="input-group"><label className="input-label" htmlFor="l">Length ({unit})</label><input id="l" type="number" className="input-field" placeholder="e.g., 36" value={length} onChange={e => setLength(e.target.value)} min="0" /></div>
                            </div>
                        </div>
                        {sqIn > 0 && (<div className={`calculator-results ${styles.results}`}>
                            <div className="result-card"><div className="result-value">{sqIn.toFixed(1)} sq in</div><div className="result-label">{w} × {l} {unit}</div></div>
                            <div className={styles.resultDetails}>
                                {areaUnits.map(u => (<div key={u.key} className={styles.resultRow}><span>{u.label}</span><strong>{(sqIn * u.factor).toFixed(4)}</strong></div>))}
                            </div>
                            <div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(areaUnits.map(u => `${u.label}: ${(sqIn * u.factor).toFixed(4)}`).join('\n'))}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}>🖨️ Print</button></div>
                        </div>)}
                    </div>
                    <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/convert/fabric-width-universal" className="related-tool-link">↔️ Width Converter</a><a href="/cost/per-square-unit" className="related-tool-link">💰 Cost Per Sq Unit</a></div></aside>
            </div>
        </div>
    );
}
