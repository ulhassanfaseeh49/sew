"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

const sewingFractions = [
    { frac: "1/16", val: 0.0625 }, { frac: "1/8", val: 0.125 }, { frac: "3/16", val: 0.1875 },
    { frac: "1/4", val: 0.25 }, { frac: "5/16", val: 0.3125 }, { frac: "3/8", val: 0.375 },
    { frac: "7/16", val: 0.4375 }, { frac: "1/2", val: 0.5 }, { frac: "9/16", val: 0.5625 },
    { frac: "5/8", val: 0.625 }, { frac: "11/16", val: 0.6875 }, { frac: "3/4", val: 0.75 },
    { frac: "13/16", val: 0.8125 }, { frac: "7/8", val: 0.875 }, { frac: "15/16", val: 0.9375 },
];

export default function FractionToDecimalPage() {
    const [whole, setWhole] = useState("");
    const [selected, setSelected] = useState<string>("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const w = parseInt(whole) || 0;
    const frac = sewingFractions.find(f => f.frac === selected);
    const decimal = w + (frac?.val || 0);
    const cm = decimal * 2.54;
    const mm = cm * 10;
    const hasResult = decimal > 0;

    const faqItems = [
        { q: "What do sewing fractions like 5/8\" mean?", a: "5/8\" means five-eighths of an inch, or 0.625 inches (1.59 cm). It's the standard seam allowance in US garment patterns." },
        { q: "Why does sewing use fractions instead of decimals?", a: "Imperial measurement rulers are marked in fractions (1/4, 1/8, 1/16 inch). Since sewists work with rulers, fractions are more practical than decimals." },
    ];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Fraction to Decimal" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><span>🔢</span> Conversion Tool #9</span>
                        <h1>Fraction to Decimal Converter</h1>
                        <p>Convert sewing fractions (1/4&quot;, 3/8&quot;, 5/8&quot;, 7/8&quot;) to decimal inches with metric equivalents.</p>
                    </div>
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Select Fraction</h2>
                        <div className="calculator-form">
                            <div className="calculator-form-row">
                                <div className="input-group">
                                    <label className="input-label" htmlFor="w">Whole Inches</label>
                                    <input id="w" type="number" className="input-field" placeholder="0" value={whole} onChange={e => setWhole(e.target.value)} min="0" />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Fraction</label>
                                    <select className="input-field" value={selected} onChange={e => setSelected(e.target.value)}>
                                        <option value="">Select fraction</option>
                                        {sewingFractions.map(f => (<option key={f.frac} value={f.frac}>{f.frac}&quot;</option>))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        {hasResult && (
                            <div className={`calculator-results ${styles.results}`}>
                                <div className="result-card">
                                    <div className="result-value">{decimal.toFixed(4)}&quot;</div>
                                    <div className="result-label">{w > 0 ? `${w} ` : ""}{selected || "0"}&quot; as decimal</div>
                                </div>
                                <div className={styles.resultDetails}>
                                    <div className={styles.resultRow}><span>Centimeters</span><strong>{cm.toFixed(3)} cm</strong></div>
                                    <div className={styles.resultRow}><span>Millimeters</span><strong>{mm.toFixed(2)} mm</strong></div>
                                </div>
                                <div className="toolbar">
                                    <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`${w ? w + " " : ""}${selected}" = ${decimal.toFixed(4)}" = ${cm.toFixed(3)} cm`)}>📋 Copy</button>
                                    <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>🖨️ Print</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={`glass-card ${styles.infoSection}`}>
                        <h2>Complete Fraction Reference</h2>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead><tr><th>Fraction</th><th>Decimal&quot;</th><th>CM</th><th>MM</th></tr></thead>
                                <tbody>{sewingFractions.map(f => (<tr key={f.frac}><td>{f.frac}&quot;</td><td>{f.val.toFixed(4)}</td><td>{(f.val * 2.54).toFixed(3)}</td><td>{(f.val * 25.4).toFixed(2)}</td></tr>))}</tbody>
                            </table>
                        </div>
                    </div>
                    <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar">
                    <div className="glass-card related-tools"><h4>Related Tools</h4>
                        <a href="/convert/decimal-to-fraction" className="related-tool-link">🔄 Decimal to Fraction</a>
                        <a href="/seam-allowance/converter" className="related-tool-link">✂️ Seam Allowance Converter</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}
