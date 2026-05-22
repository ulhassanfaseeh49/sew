"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Ruler, ArrowRightLeft, Copy, Printer, ChevronDown, BookOpen, AlertTriangle } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

const decimalPresets = [
    { l: "0.125", v: 0.125 }, { l: "0.25", v: 0.25 }, { l: "0.375", v: 0.375 },
    { l: "0.5", v: 0.5 }, { l: "0.625", v: 0.625 }, { l: "0.75", v: 0.75 }, { l: "0.875", v: 0.875 },
    { l: "1.25", v: 1.25 }, { l: "1.375", v: 1.375 }, { l: "1.5", v: 1.5 },
    { l: "1.625", v: 1.625 }, { l: "1.75", v: 1.75 }, { l: "1.875", v: 1.875 }, { l: "2.0", v: 2 },
];

const faqItems = [
    { q: "How does this tool round decimals to fractions?", a: "It finds the nearest 1/16\" fraction, which is the finest standard division on sewing rulers. Then it simplifies the fraction (e.g., 8/16 becomes 1/2). It also shows you 1/8\" and 1/4\" precision options." },
    { q: "What if my decimal doesn't match any fraction exactly?", a: "The tool shows the nearest fraction at each precision level and tells you the rounding error. For most sewing, 1/16\" precision is more than sufficient." },
    { q: "When would I need to convert decimal to fraction?", a: "When a calculator, software, or pattern grading system gives you a decimal result (like 0.375\") and you need to mark it on a ruler that shows fractions." },
    { q: "Is it better to use 1/8\" or 1/16\" precision?", a: "1/8\" precision is fine for most sewing. Use 1/16\" only for very precise work like tailoring, pattern drafting, or small items." },
];

const getFraction = (val: number, precision: number) => {
    const whole = Math.floor(val);
    const rem = val - whole;
    const units = Math.round(rem * precision);
    if (units === 0) return { str: `${whole}"`, error: rem * precision };
    if (units === precision) return { str: `${whole + 1}"`, error: (1 - rem) * precision };
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const d = gcd(units, precision);
    const n = units / d;
    const dn = precision / d;
    const fracVal = whole + units / precision;
    return { str: whole > 0 ? `${whole} ${n}/${dn}"` : `${n}/${dn}"`, error: Math.abs(val - fracVal) };
};

const relatedTools = [
    { name: "Fraction to Decimal", href: "/convert/fraction-to-decimal", icon: ArrowRightLeft },
    { name: "Inches to CM", href: "/convert/inches-to-centimeters", icon: Ruler },
    { name: "Seam Allowance Tools", href: "/seam-allowance/converter", icon: Ruler },
];

export default function DecimalToFractionPage() {
    const [decimal, setDecimal] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const num = parseFloat(decimal) || 0;
    const frac16 = getFraction(num, 16);
    const frac8 = getFraction(num, 8);
    const frac4 = getFraction(num, 4);
    const cm = num * 2.54;
    const mm = cm * 10;
    const isSignificantError = frac16.error > 1 / 32;

    const handleCopy = useCallback(() => {
        if (num > 0) {
            navigator.clipboard.writeText(`${num}" ≈ ${frac16.str} (${cm.toFixed(3)} cm)`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [num, frac16.str, cm]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Decimal to Fraction" }]} />
            <div className="calculator-page">
                <div className="calculator-layout">
                    <div className="calculator-main">
                        <div className={styles.toolHeader}>
                            <span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Conversion Tool #10</span>
                            <h1>Decimal to Fraction Converter</h1>
                            <p>Convert decimal inches to nearest sewing fraction — shows the closest 1/16&quot;, 1/8&quot;, and 1/4&quot; fractions.</p>
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.calcTitle}>Enter Decimal Inches</h2>
                            <div className="calculator-form">
                                <div className="input-group">
                                    <label className="input-label" htmlFor="dec">Decimal Inches</label>
                                    <input id="dec" type="number" className="input-field input-mono" placeholder="e.g., 0.625" value={decimal} onChange={e => setDecimal(e.target.value)} min="0" step="0.001" autoFocus />
                                    <span className="input-helper">Enter any decimal and see the nearest sewing fraction.</span>
                                </div>
                                <div className={styles.presets}>
                                    <span className={styles.presetsLabel}>Common decimals:</span>
                                    <div className={styles.presetGrid}>
                                        {decimalPresets.map(p => (
                                            <button key={p.l} className={`btn btn-ghost btn-sm ${parseFloat(decimal) === p.v ? styles.presetActive : ""}`} onClick={() => setDecimal(p.v.toString())}>{p.l}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {num > 0 && (
                                <div className={styles.results}>
                                    <div className="calculator-divider" />
                                    <div className="result-card">
                                        <div className="result-prefix">Nearest Fraction</div>
                                        <div className="result-value">{frac16.str}</div>
                                        <div className="result-label">Nearest 1/16&quot; fraction for {num}&quot;</div>
                                    </div>

                                    <div className={styles.resultDetails}>
                                        <div className="result-row"><span className="result-row-label">To nearest ¼&quot;</span><span className="result-row-value">{frac4.str}</span></div>
                                        <div className="result-row"><span className="result-row-label">To nearest ⅛&quot;</span><span className="result-row-value">{frac8.str}</span></div>
                                        <div className="result-row"><span className="result-row-label">To nearest 1/16&quot;</span><span className="result-row-value" style={{ fontWeight: 700 }}>{frac16.str}</span></div>
                                        <div className="result-row"><span className="result-row-label">Centimeters</span><span className="result-row-value">{cm.toFixed(3)} cm</span></div>
                                        <div className="result-row"><span className="result-row-label">Millimeters</span><span className="result-row-value">{mm.toFixed(2)} mm</span></div>
                                    </div>

                                    {isSignificantError && (
                                        <div className="note-warning" style={{ marginTop: 16 }}>
                                            <AlertTriangle size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                                            <strong>Note:</strong> The rounding error is over 1/32&quot;. The exact decimal {num}&quot; falls between standard fractions. Consider using the 1/16&quot; fraction for closest accuracy.
                                        </div>
                                    )}

                                    <div className="toolbar" style={{ marginTop: 16 }}>
                                        <button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => setDecimal("")}>Clear</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <section className="faq-section">
                            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
                            <div style={{ marginTop: 16 }}>
                                {faqItems.map((faq, i) => (
                                    <div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}>
                                        <button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)} aria-expanded={activeFaq === i}>
                                            {faq.q}<ChevronDown size={16} className="faq-chevron" />
                                        </button>
                                        <div className="faq-answer">{faq.a}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <aside className="calculator-sidebar">
                        <div className="related-tools">
                            <h4>Related Tools</h4>
                            {relatedTools.map((tool) => {
                                const IC = tool.icon; return (
                                    <Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>
                                );
                            })}
                        </div>
                        <div className="quick-reference">
                            <h4>Common Conversions</h4>
                            <div className={styles.quickRefItem}><span>0.125</span><strong>⅛&quot;</strong></div>
                            <div className={styles.quickRefItem}><span>0.375</span><strong>⅜&quot;</strong></div>
                            <div className={styles.quickRefItem}><span>0.5</span><strong>½&quot;</strong></div>
                            <div className={styles.quickRefItem}><span>0.625</span><strong>⅝&quot;</strong></div>
                            <div className={styles.quickRefItem}><span>0.875</span><strong>⅞&quot;</strong></div>
                        </div>
                        <Link href="/convert/fraction-to-decimal" className="btn btn-secondary btn-md" style={{ width: '100%', justifyContent: 'center' }}>
                            <ArrowRightLeft size={16} /> Fraction → Decimal
                        </Link>
                    </aside>
                </div>
            </div>
        </div>
    );
}
