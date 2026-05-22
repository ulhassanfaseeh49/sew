"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Ruler, ArrowRightLeft, Copy, Printer, ChevronDown, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

const presets = [
    { label: "0.5 m", value: 0.5 }, { label: "1 m", value: 1 }, { label: "1.5 m", value: 1.5 },
    { label: "2 m", value: 2 }, { label: "2.5 m", value: 2.5 }, { label: "3 m", value: 3 },
    { label: "4 m", value: 4 }, { label: "5 m", value: 5 }, { label: "10 m", value: 10 },
];

const refTable = [
    { m: 0.5, ft: "1.64", ftIn: '1 ft 7¾"' },
    { m: 1, ft: "3.28", ftIn: '3 ft 3⅜"' },
    { m: 1.5, ft: "4.92", ftIn: '4 ft 11"' },
    { m: 2, ft: "6.56", ftIn: '6 ft 6¾"' },
    { m: 2.5, ft: "8.20", ftIn: '8 ft 2½"' },
    { m: 3, ft: "9.84", ftIn: '9 ft 10"' },
];

const faqItems = [
    { q: "How many feet are in one meter?", a: "One meter equals approximately 3 feet 3.37 inches (3.2808 feet). A meter is about 10% longer than a yard (3 feet)." },
    { q: "When would I convert meters to feet for sewing?", a: "When measuring rooms for curtains, tablecloths, or upholstery projects where room dimensions are usually recorded in feet and inches." },
    { q: "What is 2 meters in feet and inches?", a: "2 meters equals 6 feet 6¾ inches (6.56 feet). This is roughly the height of a tall doorway." },
];

const relatedTools = [
    { name: "Feet to Meters", href: "/convert/feet-to-meters", icon: ArrowRightLeft },
    { name: "Meters to Yards", href: "/convert/meters-to-yards", icon: Ruler },
    { name: "Curtain Calculator", href: "/curtains/yardage-calculator", icon: Ruler },
    { name: "Universal Converter", href: "/convert/universal-sewing-converter", icon: Ruler },
];

export default function MetersToFeetPage() {
    const [meters, setMeters] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const m = parseFloat(meters) || 0;
    const totalInches = m * 39.3701;
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    const decimalFeet = m * 3.28084;
    const yards = m * 1.0936133;
    const cm = m * 100;

    const handleCopy = useCallback(() => {
        if (m > 0) {
            navigator.clipboard.writeText(`${m} m = ${feet}' ${inches.toFixed(1)}" (${decimalFeet.toFixed(2)} ft)`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [m, feet, inches, decimalFeet]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Meters to Feet" }]} />
            <div className="calculator-page">
                <div className="calculator-layout">
                    <div className="calculator-main">
                        <div className={styles.toolHeader}>
                            <span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Conversion Tool #6</span>
                            <h1>Meters to Feet Converter</h1>
                            <p>Convert meters to feet and inches for users working in imperial with metric measurements.</p>
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.calcTitle}>Enter Meters</h2>
                            <div className="calculator-form">
                                <div className="input-group">
                                    <label className="input-label" htmlFor="m">Meters</label>
                                    <input id="m" type="number" className="input-field input-mono" placeholder="e.g., 2.5" value={meters} onChange={e => setMeters(e.target.value)} min="0" step="0.1" autoFocus />
                                    <span className="input-helper">1 meter = 3.2808 feet (3 ft 3⅜&quot;)</span>
                                </div>
                                <div className={styles.presets}>
                                    <span className={styles.presetsLabel}>Common values:</span>
                                    <div className={styles.presetGrid}>
                                        {presets.map(p => (
                                            <button key={p.label} className={`btn btn-ghost btn-sm ${parseFloat(meters) === p.value ? styles.presetActive : ""}`} onClick={() => setMeters(p.value.toString())}>{p.label}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {m > 0 && (
                                <div className={styles.results}>
                                    <div className="calculator-divider" />
                                    <div className="result-card">
                                        <div className="result-prefix">Result</div>
                                        <div className="result-value">{feet}&apos; {inches.toFixed(1)}&quot;</div>
                                        <div className="result-label">{m} meters = {feet} feet {inches.toFixed(1)} inches</div>
                                    </div>
                                    <div className={styles.resultDetails}>
                                        <div className="result-row"><span className="result-row-label">Feet + inches</span><span className="result-row-value">{feet} ft {inches.toFixed(1)} in</span></div>
                                        <div className="result-row"><span className="result-row-label">Decimal feet</span><span className="result-row-value">{decimalFeet.toFixed(4)} ft</span></div>
                                        <div className="result-row"><span className="result-row-label">Total inches</span><span className="result-row-value">{totalInches.toFixed(2)}&quot;</span></div>
                                        <div className="result-row"><span className="result-row-label">Yards</span><span className="result-row-value">{yards.toFixed(4)} yd</span></div>
                                        <div className="result-row"><span className="result-row-label">Centimeters</span><span className="result-row-value">{cm.toFixed(1)} cm</span></div>
                                    </div>
                                    <div className="toolbar" style={{ marginTop: 16 }}>
                                        <button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => setMeters("")}>Clear</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="calculator-card">
                            <h2 className={styles.sectionTitle}><BookOpen size={20} strokeWidth={1.5} style={{ color: 'var(--color-accent-primary)' }} /> Reference Table</h2>
                            <div className={styles.tableWrap}>
                                <table className={styles.convTable}>
                                    <thead><tr><th>Meters</th><th>Feet (decimal)</th><th>Feet + Inches</th></tr></thead>
                                    <tbody>{refTable.map(r => (<tr key={r.m}><td>{r.m} m</td><td>{r.ft} ft</td><td>{r.ftIn}</td></tr>))}</tbody>
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
                            <div className={styles.quickRefItem}><span>1 meter</span><strong>3.28 ft</strong></div>
                            <div className={styles.quickRefItem}><span>1 meter</span><strong>39.37 in</strong></div>
                            <div className={styles.quickRefItem}><span>2 meters</span><strong>6.56 ft</strong></div>
                        </div>
                        <Link href="/convert/feet-to-meters" className="btn btn-secondary btn-md" style={{ width: '100%', justifyContent: 'center' }}>
                            <ArrowRightLeft size={16} /> Feet → Meters
                        </Link>
                    </aside>
                </div>
            </div>
        </div>
    );
}
