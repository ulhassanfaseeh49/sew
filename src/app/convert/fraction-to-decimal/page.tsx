"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Ruler, ArrowRightLeft, Copy, Printer, ChevronDown, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

const sewingFractions = [
    { frac: "1/16", val: 0.0625, cm: "0.16", mm: "1.6", use: "Tiny seam, tolerances" },
    { frac: "1/8", val: 0.125, cm: "0.32", mm: "3.2", use: "Quilting, tiny seam" },
    { frac: "3/16", val: 0.1875, cm: "0.48", mm: "4.8", use: "Rare, intermediate" },
    { frac: "1/4", val: 0.25, cm: "0.64", mm: "6.4", use: "Quilting seam allowance" },
    { frac: "5/16", val: 0.3125, cm: "0.79", mm: "7.9", use: "Some patterns" },
    { frac: "3/8", val: 0.375, cm: "0.95", mm: "9.5", use: "Children's patterns, knits" },
    { frac: "7/16", val: 0.4375, cm: "1.11", mm: "11.1", use: "Rare" },
    { frac: "1/2", val: 0.5, cm: "1.27", mm: "12.7", use: "General seam allowance" },
    { frac: "9/16", val: 0.5625, cm: "1.43", mm: "14.3", use: "Rare" },
    { frac: "5/8", val: 0.625, cm: "1.59", mm: "15.9", use: "Standard garment seam" },
    { frac: "11/16", val: 0.6875, cm: "1.75", mm: "17.5", use: "Rare" },
    { frac: "3/4", val: 0.75, cm: "1.91", mm: "19.1", use: "Wide seam, hem" },
    { frac: "13/16", val: 0.8125, cm: "2.06", mm: "20.6", use: "Rare" },
    { frac: "7/8", val: 0.875, cm: "2.22", mm: "22.2", use: "Wide seam allowance" },
    { frac: "15/16", val: 0.9375, cm: "2.38", mm: "23.8", use: "Rare" },
];

const faqItems = [
    { q: 'What is 5/8 as a decimal?', a: '5/8 equals exactly 0.625 inches. This is the standard seam allowance in US garment sewing patterns — one of the most important fractions every sewist should know.' },
    { q: 'What is 7/8 inch as a decimal?', a: '7/8 inch equals exactly 0.875 inches (2.22 cm). This is used as a wide seam allowance in some tailoring and coat patterns.' },
    { q: 'How do I enter fractions in a calculator?', a: 'Divide the top number by the bottom number: 5/8 → 5 ÷ 8 = 0.625. Or use our quick-tap grid to find the decimal instantly.' },
    { q: 'What decimal is 1/4 inch?', a: '1/4 inch equals 0.25 inches (0.635 cm). This is the standard quilting seam allowance.' },
    { q: 'How many decimal places do I need for sewing?', a: 'Two decimal places (1/100th of an inch) is more than enough for all sewing applications. Even 1/16\" precision is finer than most fabric can be cut.' },
];

const relatedTools = [
    { name: "Decimal to Fraction", href: "/convert/decimal-to-fraction", icon: ArrowRightLeft },
    { name: "Inches to CM", href: "/convert/inches-to-centimeters", icon: Ruler },
    { name: "Seam Allowance Tools", href: "/seam-allowance/converter", icon: Ruler },
];

export default function FractionToDecimalPage() {
    const [whole, setWhole] = useState("");
    const [selected, setSelected] = useState<string>("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const w = parseInt(whole) || 0;
    const frac = sewingFractions.find(f => f.frac === selected);
    const decimal = w + (frac?.val || 0);
    const cm = decimal * 2.54;
    const mm = cm * 10;
    const hasResult = decimal > 0;

    const handleCopy = useCallback(() => {
        if (hasResult) {
            navigator.clipboard.writeText(`${w ? w + " " : ""}${selected}" = ${decimal.toFixed(4)}" = ${cm.toFixed(3)} cm`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [hasResult, w, selected, decimal, cm]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Fraction to Decimal" }]} />
            <div className="calculator-page">
                <div className="calculator-layout">
                    <div className="calculator-main">
                        <div className={styles.toolHeader}>
                            <span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Conversion Tool #9</span>
                            <h1>Fraction to Decimal Converter</h1>
                            <p>Convert sewing fractions to decimal inches with visual reference — for the fractions every sewist encounters.</p>
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.calcTitle}>Select Fraction</h2>
                            <div className="calculator-form">
                                <div className="calculator-form-row">
                                    <div className="input-group">
                                        <label className="input-label" htmlFor="w">Whole Inches (optional)</label>
                                        <input id="w" type="number" className="input-field input-mono" placeholder="0" value={whole} onChange={e => setWhole(e.target.value)} min="0" />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Fraction</label>
                                        <select className="input-field" value={selected} onChange={e => setSelected(e.target.value)}>
                                            <option value="">Select fraction</option>
                                            {sewingFractions.map(f => (<option key={f.frac} value={f.frac}>{f.frac}&quot;</option>))}
                                        </select>
                                    </div>
                                </div>

                                {/* Quick Tap Grid */}
                                <div className={styles.presets}>
                                    <span className={styles.presetsLabel}>Quick tap (most common bolded):</span>
                                    <div className={styles.presetGrid}>
                                        {sewingFractions.map(f => (
                                            <button
                                                key={f.frac}
                                                className={`btn btn-ghost btn-sm ${selected === f.frac ? styles.presetActive : ""}`}
                                                onClick={() => setSelected(f.frac)}
                                                style={["1/4", "3/8", "1/2", "5/8", "3/4", "7/8"].includes(f.frac) ? { fontWeight: 600 } : {}}
                                            >
                                                {f.frac}&quot;
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {hasResult && (
                                <div className={styles.results}>
                                    <div className="calculator-divider" />
                                    <div className="result-card">
                                        <div className="result-prefix">Result</div>
                                        <div className="result-value">{decimal.toFixed(4)}&quot;</div>
                                        <div className="result-label">{w > 0 ? `${w} ` : ""}{selected || "0"}&quot; as decimal</div>
                                    </div>
                                    <div className={styles.resultDetails}>
                                        <div className="result-row"><span className="result-row-label">Decimal inches</span><span className="result-row-value">{decimal.toFixed(4)}&quot;</span></div>
                                        <div className="result-row"><span className="result-row-label">Centimeters</span><span className="result-row-value">{cm.toFixed(3)} cm</span></div>
                                        <div className="result-row"><span className="result-row-label">Millimeters</span><span className="result-row-value">{mm.toFixed(2)} mm</span></div>
                                        {frac?.use && (
                                            <div className="result-row"><span className="result-row-label">Common use</span><span className="result-row-value">{frac.use}</span></div>
                                        )}
                                    </div>
                                    <div className="toolbar" style={{ marginTop: 16 }}>
                                        <button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => { setWhole(""); setSelected(""); }}>Clear</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.sectionTitle}><BookOpen size={20} strokeWidth={1.5} style={{ color: 'var(--color-accent-primary)' }} /> Complete Sewing Fraction Reference</h2>
                            <div className={styles.tableWrap}>
                                <table className={styles.convTable}>
                                    <thead><tr><th>Fraction</th><th>Decimal&quot;</th><th>CM</th><th>MM</th><th>Common Use</th></tr></thead>
                                    <tbody>
                                        {sewingFractions.map(f => (
                                            <tr key={f.frac}>
                                                <td>{f.frac}&quot;</td><td>{f.val.toFixed(4)}</td><td>{f.cm}</td><td>{f.mm}</td>
                                                <td style={{ color: 'var(--color-text-tertiary)' }}>{f.use}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
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
                            <h4>Key Fractions</h4>
                            <div className={styles.quickRefItem}><span>¼&quot;</span><strong>0.250</strong></div>
                            <div className={styles.quickRefItem}><span>⅜&quot;</span><strong>0.375</strong></div>
                            <div className={styles.quickRefItem}><span>½&quot;</span><strong>0.500</strong></div>
                            <div className={styles.quickRefItem}><span>⅝&quot;</span><strong>0.625</strong></div>
                            <div className={styles.quickRefItem}><span>¾&quot;</span><strong>0.750</strong></div>
                        </div>
                        <Link href="/convert/decimal-to-fraction" className="btn btn-secondary btn-md" style={{ width: '100%', justifyContent: 'center' }}>
                            <ArrowRightLeft size={16} /> Decimal → Fraction
                        </Link>
                    </aside>
                </div>
            </div>
        </div>
    );
}
