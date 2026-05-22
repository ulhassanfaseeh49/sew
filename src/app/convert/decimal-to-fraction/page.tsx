"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

export default function DecimalToFractionPage() {
    const [decimal, setDecimal] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const num = parseFloat(decimal) || 0;
    const whole = Math.floor(num);
    const rem = num - whole;
    // Find nearest fraction (1/16ths)
    const sixteenths = Math.round(rem * 16);
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const getFrac = () => {
        if (sixteenths === 0) return { n: 0, d: 1, str: `${whole}"` };
        if (sixteenths === 16) return { n: 0, d: 1, str: `${whole + 1}"` };
        const d = gcd(sixteenths, 16); const n = sixteenths / d; const dn = 16 / d;
        return { n, d: dn, str: whole > 0 ? `${whole} ${n}/${dn}"` : `${n}/${dn}"` };
    };
    const frac = getFrac();
    const cm = num * 2.54;

    const faqItems = [
        { q: "How does this tool round decimals to fractions?", a: "It finds the nearest 1/16\" fraction, which is the finest standard division on sewing rulers. Then it simplifies (e.g., 8/16 becomes 1/2)." },
        { q: "What if my decimal doesn't match any fraction exactly?", a: "The tool rounds to the nearest 1/16\". For most sewing, this level of precision is more than sufficient." },
    ];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Decimal to Fraction" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><span>🔢</span> Conversion Tool #10</span>
                        <h1>Decimal to Fraction Converter</h1>
                        <p>Convert decimal inches to the nearest sewing fraction (1/16, 1/8, 1/4, 3/8, 1/2, 5/8, 3/4, 7/8).</p>
                    </div>
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Enter Decimal Inches</h2>
                        <div className="calculator-form">
                            <div className="input-group">
                                <label className="input-label" htmlFor="dec">Decimal Inches</label>
                                <input id="dec" type="number" className="input-field" placeholder="e.g., 0.625" value={decimal} onChange={e => setDecimal(e.target.value)} min="0" step="0.001" />
                            </div>
                        </div>
                        {num > 0 && (
                            <div className={`calculator-results ${styles.results}`}>
                                <div className="result-card">
                                    <div className="result-value">{frac.str}</div>
                                    <div className="result-label">Nearest sewing fraction for {num}&quot;</div>
                                </div>
                                <div className={styles.resultDetails}>
                                    <div className={styles.resultRow}><span>In 16ths</span><strong>{whole > 0 ? `${whole} ` : ""}{sixteenths}/16&quot;</strong></div>
                                    <div className={styles.resultRow}><span>Centimeters</span><strong>{cm.toFixed(3)} cm</strong></div>
                                    <div className={styles.resultRow}><span>Millimeters</span><strong>{(cm * 10).toFixed(2)} mm</strong></div>
                                </div>
                                <div className="toolbar">
                                    <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`${num}" ≈ ${frac.str}`)}>📋 Copy</button>
                                    <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>🖨️ Print</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar">
                    <div className="glass-card related-tools"><h4>Related Tools</h4>
                        <a href="/convert/fraction-to-decimal" className="related-tool-link">🔄 Fraction to Decimal</a>
                        <a href="/seam-allowance/converter" className="related-tool-link">✂️ Seam Allowance</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}
