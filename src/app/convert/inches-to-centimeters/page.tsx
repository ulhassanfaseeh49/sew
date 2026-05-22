"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
    Ruler, ArrowRightLeft, Copy, Printer, ChevronDown,
    Info, BookOpen, ShoppingBag
} from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

const IN_TO_CM = 2.54;

const commonPresets = [
    { label: '⅛"', value: 0.125 },
    { label: '¼"', value: 0.25 },
    { label: '⅜"', value: 0.375 },
    { label: '½"', value: 0.5 },
    { label: '⅝"', value: 0.625 },
    { label: '¾"', value: 0.75 },
    { label: '1"', value: 1 },
    { label: '1½"', value: 1.5 },
    { label: '2"', value: 2 },
    { label: '3"', value: 3 },
    { label: '6"', value: 6 },
    { label: '9"', value: 9 },
    { label: '12"', value: 12 },
    { label: '18"', value: 18 },
    { label: '36"', value: 36 },
    { label: '44"', value: 44 },
    { label: '45"', value: 45 },
    { label: '54"', value: 54 },
    { label: '60"', value: 60 },
];

const referenceTable = [
    { val: 1 / 16, frac: '1/16"', cm: "0.16", mm: "2", practical: "0.2 cm" },
    { val: 0.125, frac: '⅛"', cm: "0.32", mm: "3", practical: "0.3 cm" },
    { val: 0.25, frac: '¼"', cm: "0.64", mm: "6", practical: "0.6 cm" },
    { val: 0.375, frac: '⅜"', cm: "0.95", mm: "10", practical: "1.0 cm" },
    { val: 0.5, frac: '½"', cm: "1.27", mm: "13", practical: "1.3 cm" },
    { val: 0.625, frac: '⅝"', cm: "1.59", mm: "16", practical: "1.5 cm" },
    { val: 0.75, frac: '¾"', cm: "1.91", mm: "19", practical: "2.0 cm" },
    { val: 0.875, frac: '⅞"', cm: "2.22", mm: "22", practical: "2.2 cm" },
    { val: 1, frac: '1"', cm: "2.54", mm: "25", practical: "2.5 cm" },
    { val: 1.5, frac: '1½"', cm: "3.81", mm: "38", practical: "4.0 cm" },
    { val: 2, frac: '2"', cm: "5.08", mm: "51", practical: "5.0 cm" },
    { val: 6, frac: '6"', cm: "15.24", mm: "152", practical: "15 cm" },
    { val: 12, frac: '12"', cm: "30.48", mm: "305", practical: "30.5 cm" },
    { val: 36, frac: '36"', cm: "91.44", mm: "914", practical: "91.5 cm" },
];

const faqItems = [
    {
        q: "What is 5/8 inch in centimeters?",
        a: "5/8 inch (⅝\") equals exactly 1.5875 centimeters. In practical sewing, this is typically rounded to 1.5 cm or 1.6 cm. The 5/8\" seam allowance is the standard for American garment sewing patterns."
    },
    {
        q: "What is 1/4 inch seam allowance in cm?",
        a: "A 1/4 inch seam allowance equals 0.635 cm. Quilters using metric tools typically round this to 0.6 cm or use a 0.75 cm (¼\" + a little extra) seam guide."
    },
    {
        q: "How do I convert pattern measurements from inches to cm?",
        a: "Multiply any inch measurement by 2.54 to get centimeters. For sewing fractions: ¼\" = 0.6 cm, ½\" = 1.3 cm, ⅝\" = 1.6 cm, 1\" = 2.5 cm. For seam allowances, use the nearest standard metric allowance."
    },
    {
        q: "What is 36 inches in centimeters?",
        a: "36 inches (1 yard) equals 91.44 centimeters, or 0.9144 meters. This is one of the most important sewing conversions to know."
    },
    {
        q: "Is 1 inch exactly 2.54 centimeters?",
        a: "Yes, exactly. Since 1959, the inch has been defined internationally as exactly 25.4 millimeters (2.54 centimeters). This is not an approximation — it's the precise definition."
    },
];

const relatedTools = [
    { name: "Centimeters to Inches", href: "/convert/centimeters-to-inches", icon: ArrowRightLeft },
    { name: "Millimeters to Inches", href: "/convert/millimeters-to-inches", icon: Ruler },
    { name: "Seam Allowance Converter", href: "/seam-allowance/converter", icon: Ruler },
    { name: "Fraction to Decimal", href: "/convert/fraction-to-decimal", icon: Ruler },
    { name: "Body Measurement Guide", href: "/body/measurement-guide", icon: Ruler },
];

export default function InchesToCentimetersPage() {
    const [inches, setInches] = useState<string>("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const numericInches = parseFloat(inches) || 0;
    const cm = numericInches * IN_TO_CM;
    const mm = cm * 10;
    const meters = cm / 100;
    const practicalCm = Math.round(cm * 2) / 2; // nearest 0.5 cm

    const handleCopy = useCallback(() => {
        if (numericInches > 0) {
            navigator.clipboard.writeText(
                `${numericInches}" = ${cm.toFixed(2)} cm (${mm.toFixed(1)} mm)\nPractical: ${practicalCm.toFixed(1)} cm`
            );
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [numericInches, cm, mm, practicalCm]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Inches to Centimeters" }]} />

            <div className="calculator-page">
                <div className="calculator-layout">
                    <div className="calculator-main">
                        <div className={styles.toolHeader}>
                            <span className="category-badge">
                                <Ruler size={14} strokeWidth={1.5} /> Conversion Tool #3
                            </span>
                            <h1>Inches to Centimeters Converter</h1>
                            <p>
                                Convert inches (including sewing fractions like ⅝&quot;) to centimeters for pattern work,
                                body measurements, and fabric calculations.
                            </p>
                        </div>

                        {/* Calculator */}
                        <div className="calculator-card">
                            <h2 className={styles.calcTitle}>Enter Inches</h2>
                            <div className="calculator-form">
                                <div className="input-group">
                                    <label className="input-label" htmlFor="inches-input">Inches</label>
                                    <input
                                        id="inches-input"
                                        type="number"
                                        className="input-field input-mono"
                                        placeholder='Enter inches (e.g., 5.625 for 5⅝")'
                                        value={inches}
                                        onChange={(e) => setInches(e.target.value)}
                                        min="0"
                                        step="0.0625"
                                        autoFocus
                                    />
                                    <span className="input-helper">1 inch = exactly 2.54 centimeters. Tip: 5/8 = 0.625</span>
                                </div>

                                <div className={styles.presets}>
                                    <span className={styles.presetsLabel}>Common sewing measurements:</span>
                                    <div className={styles.presetGrid}>
                                        {commonPresets.map((p) => (
                                            <button
                                                key={p.label}
                                                className={`btn btn-ghost btn-sm ${parseFloat(inches) === p.value ? styles.presetActive : ""}`}
                                                onClick={() => setInches(p.value.toString())}
                                            >
                                                {p.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {numericInches > 0 && (
                                <div className={styles.results}>
                                    <div className="calculator-divider" />

                                    <div className="result-card">
                                        <div className="result-prefix">Result</div>
                                        <div className="result-value">{cm.toFixed(2)} cm</div>
                                        <div className="result-label">{numericInches}&quot; in centimeters</div>
                                    </div>

                                    <div className={styles.resultDetails}>
                                        <div className="result-row">
                                            <span className="result-row-label">Exact centimeters</span>
                                            <span className="result-row-value">{cm.toFixed(2)} cm</span>
                                        </div>
                                        <div className="result-row">
                                            <span className="result-row-label">Millimeters</span>
                                            <span className="result-row-value">{mm.toFixed(1)} mm</span>
                                        </div>
                                        <div className="result-row">
                                            <span className="result-row-label">Practical (nearest 0.5cm)</span>
                                            <span className="result-row-value" style={{ color: 'var(--color-accent-primary)', fontWeight: 700 }}>
                                                {practicalCm.toFixed(1)} cm
                                            </span>
                                        </div>
                                        <div className="result-row">
                                            <span className="result-row-label">Meters</span>
                                            <span className="result-row-value">{meters.toFixed(4)} m</span>
                                        </div>
                                    </div>

                                    {/* Sewing context note */}
                                    {numericInches <= 1 && (
                                        <div className="note-tip" style={{ marginTop: 16 }}>
                                            <Info size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                                            <strong>Seam allowance tip:</strong> For seam allowances, consistent rounding matters more than exact conversion.
                                            Use the nearest standard metric seam allowance (0.6, 1.0, 1.5, or 2.0 cm).
                                        </div>
                                    )}

                                    <div className="toolbar" style={{ marginTop: 16 }}>
                                        <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
                                            <Copy size={14} /> {copied ? "Copied!" : "Copy Result"}
                                        </button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
                                            <Printer size={14} /> Print
                                        </button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => setInches("")}>
                                            Clear
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Reference Table */}
                        <div className="calculator-card">
                            <h2 className={styles.sectionTitle}>
                                <BookOpen size={20} strokeWidth={1.5} style={{ color: 'var(--color-accent-primary)' }} />
                                Sewing Fractions to CM Reference
                            </h2>
                            <div className={styles.tableWrap}>
                                <table className={styles.convTable}>
                                    <thead>
                                        <tr>
                                            <th>Inches</th>
                                            <th>Exact CM</th>
                                            <th>Practical CM</th>
                                            <th>MM</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {referenceTable.map((r) => (
                                            <tr key={r.frac}>
                                                <td>{r.frac}</td>
                                                <td>{r.cm}</td>
                                                <td>{r.practical}</td>
                                                <td>{r.mm}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Educational Content */}
                        <div className="calculator-card">
                            <h2 className={styles.sectionTitle}>
                                <BookOpen size={20} strokeWidth={1.5} style={{ color: 'var(--color-accent-primary)' }} />
                                Sewing Context
                            </h2>
                            <div className={styles.eduGrid}>
                                <div className={styles.eduItem}>
                                    <h4>Why seam allowances differ</h4>
                                    <p>US patterns use 5/8&quot; (1.59 cm), European patterns typically use 1.0 cm or 1.5 cm. Japanese patterns often include no seam allowance at all — you add your own.</p>
                                </div>
                                <div className={styles.eduItem}>
                                    <h4>Standard metric seam allowances</h4>
                                    <p>The most common metric values: 0.6 cm (quilting), 1.0 cm (lightweight), 1.5 cm (standard garment), 2.0 cm (coat/heavy). Pick the nearest standard rather than converting precisely.</p>
                                </div>
                            </div>
                        </div>

                        {/* FAQ */}
                        <section className="faq-section">
                            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
                            <div style={{ marginTop: 16 }}>
                                {faqItems.map((faq, i) => (
                                    <div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}>
                                        <button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)} aria-expanded={activeFaq === i}>
                                            {faq.q}
                                            <ChevronDown size={16} className="faq-chevron" />
                                        </button>
                                        <div className="faq-answer">{faq.a}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <aside className="calculator-sidebar">
                        <div className="related-tools">
                            <h4>Related Tools</h4>
                            {relatedTools.map((tool) => {
                                const IconComp = tool.icon;
                                return (
                                    <Link key={tool.href} href={tool.href} className="related-tool-link">
                                        <span className="related-tool-icon"><IconComp size={16} strokeWidth={1.5} /></span>
                                        {tool.name}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="quick-reference">
                            <h4>Key Conversions</h4>
                            <div className={styles.quickRefItem}><span>1 inch</span><strong>2.54 cm</strong></div>
                            <div className={styles.quickRefItem}><span>⅝ inch</span><strong>1.59 cm</strong></div>
                            <div className={styles.quickRefItem}><span>¼ inch</span><strong>0.64 cm</strong></div>
                            <div className={styles.quickRefItem}><span>12 inches</span><strong>30.48 cm</strong></div>
                            <div className={styles.quickRefItem}><span>36 inches</span><strong>91.44 cm</strong></div>
                        </div>

                        <Link href="/convert/centimeters-to-inches" className="btn btn-secondary btn-md" style={{ width: '100%', justifyContent: 'center' }}>
                            <ArrowRightLeft size={16} /> CM → Inches
                        </Link>
                    </aside>
                </div>
            </div>
        </div>
    );
}
