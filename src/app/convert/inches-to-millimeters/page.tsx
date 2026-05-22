"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Ruler, ArrowRightLeft, Copy, Printer, ChevronDown, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

const presets = [
    { l: '⅛"', v: 0.125 }, { l: '¼"', v: 0.25 }, { l: '⅜"', v: 0.375 },
    { l: '½"', v: 0.5 }, { l: '⅝"', v: 0.625 }, { l: '¾"', v: 0.75 },
    { l: '⅞"', v: 0.875 }, { l: '1"', v: 1 }, { l: '1½"', v: 1.5 }, { l: '2"', v: 2 },
];

const refTable = [
    { frac: '1/16"', mm: "1.6", cm: "0.16" }, { frac: '⅛"', mm: "3.2", cm: "0.32" },
    { frac: '¼"', mm: "6.4", cm: "0.64" }, { frac: '⅜"', mm: "9.5", cm: "0.95" },
    { frac: '½"', mm: "12.7", cm: "1.27" }, { frac: '⅝"', mm: "15.9", cm: "1.59" },
    { frac: '¾"', mm: "19.1", cm: "1.91" }, { frac: '⅞"', mm: "22.2", cm: "2.22" },
    { frac: '1"', mm: "25.4", cm: "2.54" }, { frac: '2"', mm: "50.8", cm: "5.08" },
];

const faqItems = [
    { q: "How many millimeters are in one inch?", a: "One inch equals exactly 25.4 millimeters. This is the precise international definition, not an approximation." },
    { q: "When do sewists need inches to mm conversion?", a: "When ordering hardware (buttons, snaps, grommets), needles, or elastic that are sized in millimeters, especially from international suppliers." },
    { q: "What is ⅝ inch in millimeters?", a: "⅝ inch equals 15.875 mm (rounded to 15.9 mm). This is the standard garment seam allowance in US patterns." },
    { q: "How do I find the right button size in mm?", a: "Multiply the inch size by 25.4. Common conversions: ½\" = 12.7mm, ¾\" = 19.1mm, 1\" = 25.4mm. Or use our MM to Inches converter for the reverse." },
];

const relatedTools = [
    { name: "MM to Inches", href: "/convert/millimeters-to-inches", icon: ArrowRightLeft },
    { name: "Inches to CM", href: "/convert/inches-to-centimeters", icon: Ruler },
    { name: "Elastic Calculator", href: "/elastic/width-calculator", icon: Ruler },
];

export default function InchesToMillimetersPage() {
    const [inches, setInches] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const numIn = parseFloat(inches) || 0;
    const mm = numIn * 25.4;
    const cm = mm / 10;

    const handleCopy = useCallback(() => {
        if (numIn > 0) {
            navigator.clipboard.writeText(`${numIn}" = ${mm.toFixed(1)} mm (${cm.toFixed(2)} cm)`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [numIn, mm, cm]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Inches to Millimeters" }]} />
            <div className="calculator-page">
                <div className="calculator-layout">
                    <div className="calculator-main">
                        <div className={styles.toolHeader}>
                            <span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Conversion Tool #8</span>
                            <h1>Inches to Millimeters Converter</h1>
                            <p>Convert inches (including fractions) to millimeters for precise sewing and notion shopping.</p>
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.calcTitle}>Enter Inches</h2>
                            <div className="calculator-form">
                                <div className="input-group">
                                    <label className="input-label" htmlFor="in">Inches</label>
                                    <input id="in" type="number" className="input-field input-mono" placeholder='e.g., 0.625 for ⅝"' value={inches} onChange={e => setInches(e.target.value)} min="0" step="0.0625" autoFocus />
                                    <span className="input-helper">1 inch = 25.4 mm exactly.</span>
                                </div>
                                <div className={styles.presets}>
                                    <span className={styles.presetsLabel}>Common fractions:</span>
                                    <div className={styles.presetGrid}>
                                        {presets.map(p => (
                                            <button key={p.l} className={`btn btn-ghost btn-sm ${parseFloat(inches) === p.v ? styles.presetActive : ""}`} onClick={() => setInches(p.v.toString())}>{p.l}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {numIn > 0 && (
                                <div className={styles.results}>
                                    <div className="calculator-divider" />
                                    <div className="result-card">
                                        <div className="result-prefix">Result</div>
                                        <div className="result-value">{mm.toFixed(1)} mm</div>
                                        <div className="result-label">{numIn}&quot; = {mm.toFixed(2)} millimeters</div>
                                    </div>
                                    <div className={styles.resultDetails}>
                                        <div className="result-row"><span className="result-row-label">Millimeters</span><span className="result-row-value">{mm.toFixed(2)} mm</span></div>
                                        <div className="result-row"><span className="result-row-label">Centimeters</span><span className="result-row-value">{cm.toFixed(3)} cm</span></div>
                                    </div>
                                    <div className="toolbar" style={{ marginTop: 16 }}>
                                        <button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => setInches("")}>Clear</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.sectionTitle}><BookOpen size={20} strokeWidth={1.5} style={{ color: 'var(--color-accent-primary)' }} /> Fraction Inches to MM Reference</h2>
                            <div className={styles.tableWrap}>
                                <table className={styles.convTable}>
                                    <thead><tr><th>Inches</th><th>MM</th><th>CM</th></tr></thead>
                                    <tbody>{refTable.map(r => (<tr key={r.frac}><td>{r.frac}</td><td>{r.mm} mm</td><td>{r.cm} cm</td></tr>))}</tbody>
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
                            <h4>Key Conversions</h4>
                            <div className={styles.quickRefItem}><span>1 inch</span><strong>25.4 mm</strong></div>
                            <div className={styles.quickRefItem}><span>⅝ inch</span><strong>15.9 mm</strong></div>
                            <div className={styles.quickRefItem}><span>¼ inch</span><strong>6.4 mm</strong></div>
                        </div>
                        <Link href="/convert/millimeters-to-inches" className="btn btn-secondary btn-md" style={{ width: '100%', justifyContent: 'center' }}>
                            <ArrowRightLeft size={16} /> MM → Inches
                        </Link>
                    </aside>
                </div>
            </div>
        </div>
    );
}
