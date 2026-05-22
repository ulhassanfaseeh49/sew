"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
    Ruler, ArrowRightLeft, Copy, Printer, ChevronDown,
    Info, BookOpen, ShoppingBag
} from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

const METERS_TO_YARDS = 1.0936133;

const commonPresets = [
    { label: "0.1 m", value: 0.1 },
    { label: "0.25 m", value: 0.25 },
    { label: "0.5 m", value: 0.5 },
    { label: "0.75 m", value: 0.75 },
    { label: "1 m", value: 1 },
    { label: "1.25 m", value: 1.25 },
    { label: "1.5 m", value: 1.5 },
    { label: "1.75 m", value: 1.75 },
    { label: "2 m", value: 2 },
    { label: "2.5 m", value: 2.5 },
    { label: "3 m", value: 3 },
    { label: "4 m", value: 4 },
    { label: "5 m", value: 5 },
    { label: "10 m", value: 10 },
];

const referenceTable = [
    { m: 0.25, yd: "0.27", frac: "¼ yd" },
    { m: 0.5, yd: "0.55", frac: "½ yd" },
    { m: 1, yd: "1.09", frac: "1⅛ yd" },
    { m: 1.5, yd: "1.64", frac: "1⅝ yd" },
    { m: 2, yd: "2.19", frac: "2¼ yd" },
    { m: 2.5, yd: "2.73", frac: "2¾ yd" },
    { m: 3, yd: "3.28", frac: "3¼ yd" },
    { m: 4, yd: "4.37", frac: "4⅜ yd" },
    { m: 5, yd: "5.47", frac: "5½ yd" },
];

const faqItems = [
    {
        q: "How many yards is 1 meter of fabric?",
        a: "One meter of fabric equals approximately 1.0936 yards, or about 1 yard and 3⅜ inches. When buying, round up to 1⅛ yards to be safe."
    },
    {
        q: "How do I convert 1.5 meters to yards?",
        a: "1.5 meters equals approximately 1.64 yards. For purchasing, round up to 1⅝ yards or 1¾ yards to have a small safety margin."
    },
    {
        q: "Why does my result show a fraction instead of a decimal?",
        a: "Fabric stores in the US cut fabric in fractions of a yard (¼, ½, ¾). Showing the nearest fraction makes it easy to ask for the right amount at the cutting counter."
    },
    {
        q: "What is the difference between a meter and a yard?",
        a: "A meter is about 9.4% longer than a yard. One meter equals 39.37 inches (100 cm), while one yard equals 36 inches (91.44 cm). The difference is about 3⅜ inches."
    },
    {
        q: "How do I ask for meters at a US fabric store?",
        a: "Most US fabric stores sell by the yard. Convert your meter requirement to yards first, then ask for that amount. Some specialty stores can cut in metric if you ask."
    },
];

const relatedTools = [
    { name: "Yards to Meters Converter", href: "/convert/yards-to-meters", icon: ArrowRightLeft },
    { name: "Universal Sewing Converter", href: "/convert/universal-sewing-converter", icon: Ruler },
    { name: "Centimeters to Inches", href: "/convert/centimeters-to-inches", icon: Ruler },
    { name: "Fabric Cost Calculator", href: "/cost/per-meter", icon: Ruler },
];

export default function MetersToYardsPage() {
    const [meters, setMeters] = useState<string>("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const numericMeters = parseFloat(meters) || 0;
    const yards = numericMeters * METERS_TO_YARDS;
    const inches = numericMeters * 39.3701;
    const cm = numericMeters * 100;
    const feetTotal = inches / 12;

    const fractionYards = (val: number) => {
        const whole = Math.floor(val);
        const frac = val - whole;
        const fractions = [
            { val: 0, label: "" }, { val: 0.125, label: "⅛" }, { val: 0.25, label: "¼" },
            { val: 0.333, label: "⅓" }, { val: 0.375, label: "⅜" }, { val: 0.5, label: "½" },
            { val: 0.625, label: "⅝" }, { val: 0.667, label: "⅔" }, { val: 0.75, label: "¾" },
            { val: 0.875, label: "⅞" }, { val: 1, label: "" }
        ];
        let closest = fractions[0];
        let minDiff = Math.abs(frac - fractions[0].val);
        for (const f of fractions) {
            const diff = Math.abs(frac - f.val);
            if (diff < minDiff) { minDiff = diff; closest = f; }
        }
        if (closest.val === 1) return `${whole + 1}`;
        if (closest.val === 0) return `${whole}`;
        return whole > 0 ? `${whole}${closest.label}` : closest.label;
    };

    const roundUpQuarter = Math.ceil(yards * 4) / 4;

    const handleCopy = useCallback(() => {
        if (numericMeters > 0) {
            navigator.clipboard.writeText(
                `${numericMeters} meters = ${yards.toFixed(4)} yards (≈ ${fractionYards(yards)} yd)\nBuy: ${roundUpQuarter.toFixed(2)} yards`
            );
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [numericMeters, yards, roundUpQuarter]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Meters to Yards" }]} />

            <div className="calculator-page">
                <div className="calculator-layout">
                    <div className="calculator-main">
                        {/* Header */}
                        <div className={styles.toolHeader}>
                            <span className="category-badge">
                                <Ruler size={14} strokeWidth={1.5} /> Conversion Tool
                            </span>
                            <h1>Meters to Yards Converter</h1>
                            <p>
                                Convert fabric meters to yards with fraction display for sewing-friendly results.
                                Perfect for converting international pattern requirements to US yardage.
                            </p>
                        </div>

                        {/* Calculator */}
                        <div className="calculator-card">
                            <h2 className={styles.calcTitle}>Enter Meters</h2>
                            <div className="calculator-form">
                                <div className="input-group">
                                    <label className="input-label" htmlFor="meters-input">Meters</label>
                                    <input
                                        id="meters-input"
                                        type="number"
                                        className="input-field input-mono"
                                        placeholder="Enter meters (e.g., 1.5)"
                                        value={meters}
                                        onChange={(e) => setMeters(e.target.value)}
                                        min="0"
                                        step="0.1"
                                        autoFocus
                                    />
                                    <span className="input-helper">1 meter = 1.0936 yards (about 39.37 inches).</span>
                                </div>

                                <div className={styles.presets}>
                                    <span className={styles.presetsLabel}>Quick presets:</span>
                                    <div className={styles.presetGrid}>
                                        {commonPresets.map((p) => (
                                            <button
                                                key={p.label}
                                                className={`btn btn-ghost btn-sm ${parseFloat(meters) === p.value ? styles.presetActive : ""}`}
                                                onClick={() => setMeters(p.value.toString())}
                                            >
                                                {p.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {numericMeters > 0 && (
                                <div className={styles.results}>
                                    <div className="calculator-divider" />

                                    <div className="result-card">
                                        <div className="result-prefix">Result</div>
                                        <div className="result-value">{fractionYards(yards)} yards</div>
                                        <div className="result-label">
                                            {numericMeters} meter{numericMeters !== 1 ? "s" : ""} = {yards.toFixed(4)} yards
                                        </div>
                                    </div>

                                    <div className={styles.resultDetails}>
                                        <div className="result-row">
                                            <span className="result-row-label">Decimal yards</span>
                                            <span className="result-row-value">{yards.toFixed(4)} yd</span>
                                        </div>
                                        <div className="result-row">
                                            <span className="result-row-label">Nearest fraction</span>
                                            <span className="result-row-value">{fractionYards(yards)} yd</span>
                                        </div>
                                        <div className="result-row">
                                            <span className="result-row-label">Rounded up (nearest ¼ yd)</span>
                                            <span className="result-row-value" style={{ color: 'var(--color-accent-primary)', fontWeight: 700 }}>
                                                {roundUpQuarter.toFixed(2)} yd
                                            </span>
                                        </div>
                                        <div className="result-row">
                                            <span className="result-row-label">Inches</span>
                                            <span className="result-row-value">{inches.toFixed(1)} in</span>
                                        </div>
                                        <div className="result-row">
                                            <span className="result-row-label">Feet + inches</span>
                                            <span className="result-row-value">
                                                {Math.floor(feetTotal)} ft {(inches % 12).toFixed(1)} in
                                            </span>
                                        </div>
                                        <div className="result-row">
                                            <span className="result-row-label">Centimeters</span>
                                            <span className="result-row-value">{cm.toFixed(1)} cm</span>
                                        </div>
                                    </div>

                                    <div className="note-tip" style={{ marginTop: 16 }}>
                                        <ShoppingBag size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                                        <strong>At the fabric store:</strong> Ask for <strong>{roundUpQuarter.toFixed(2)} yards</strong> ({fractionYards(roundUpQuarter)} yards).
                                        Always round up when buying.
                                    </div>

                                    <div className="toolbar" style={{ marginTop: 16 }}>
                                        <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
                                            <Copy size={14} /> {copied ? "Copied!" : "Copy Result"}
                                        </button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
                                            <Printer size={14} /> Print
                                        </button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => setMeters("")}>
                                            Clear
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* How to Use */}
                        <div className="calculator-card">
                            <h2 className={styles.sectionTitle}>
                                <Info size={20} strokeWidth={1.5} style={{ color: 'var(--color-accent-primary)' }} />
                                How to Use
                            </h2>
                            <div className={styles.stepsGrid}>
                                <div className="step-item">
                                    <div className="step-number">1</div>
                                    <div className="step-content">
                                        <h4>Enter meters</h4>
                                        <p>Type the meter amount from your pattern, or tap a preset button.</p>
                                    </div>
                                </div>
                                <div className="step-item">
                                    <div className="step-number">2</div>
                                    <div className="step-content">
                                        <h4>Read the fraction</h4>
                                        <p>The result shows both decimal and fraction yards for easy store communication.</p>
                                    </div>
                                </div>
                                <div className="step-item">
                                    <div className="step-number">3</div>
                                    <div className="step-content">
                                        <h4>Round up for safety</h4>
                                        <p>Use the &quot;Rounded up&quot; value to ensure you buy enough fabric.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reference Table */}
                        <div className="calculator-card">
                            <h2 className={styles.sectionTitle}>
                                <BookOpen size={20} strokeWidth={1.5} style={{ color: 'var(--color-accent-primary)' }} />
                                Quick Reference Table
                            </h2>
                            <div className={styles.tableWrap}>
                                <table className={styles.convTable}>
                                    <thead><tr><th>Meters</th><th>Yards</th><th>Nearest Fraction</th></tr></thead>
                                    <tbody>
                                        {referenceTable.map((row) => (
                                            <tr key={row.m}><td>{row.m} m</td><td>{row.yd} yd</td><td>{row.frac}</td></tr>
                                        ))}
                                    </tbody>
                                </table>
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
                            <h4>Quick Reference</h4>
                            <div className={styles.quickRefItem}><span>1 meter</span><strong>1.0936 yd</strong></div>
                            <div className={styles.quickRefItem}><span>1 yard</span><strong>0.9144 m</strong></div>
                            <div className={styles.quickRefItem}><span>1 meter</span><strong>39.37 in</strong></div>
                            <div className={styles.quickRefItem}><span>1 meter</span><strong>100 cm</strong></div>
                        </div>

                        <Link href="/convert/yards-to-meters" className="btn btn-secondary btn-md" style={{ width: '100%', justifyContent: 'center' }}>
                            <ArrowRightLeft size={16} /> Yards → Meters
                        </Link>
                    </aside>
                </div>
            </div>
        </div>
    );
}
