"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
    Ruler, ArrowRightLeft, Copy, Printer, AlertTriangle,
    ChevronDown, Info, ArrowRight, BookOpen, ShoppingBag
} from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "./page.module.css";

const YARDS_TO_METERS = 0.9144;

const fractionPresets = [
    { label: "⅛ yd", value: 0.125 },
    { label: "¼ yd", value: 0.25 },
    { label: "⅓ yd", value: 1 / 3 },
    { label: "⅜ yd", value: 0.375 },
    { label: "½ yd", value: 0.5 },
    { label: "⅝ yd", value: 0.625 },
    { label: "⅔ yd", value: 2 / 3 },
    { label: "¾ yd", value: 0.75 },
    { label: "⅞ yd", value: 0.875 },
    { label: "1 yd", value: 1 },
    { label: "1¼ yd", value: 1.25 },
    { label: "1½ yd", value: 1.5 },
    { label: "1⅔ yd", value: 5 / 3 },
    { label: "1¾ yd", value: 1.75 },
    { label: "2 yd", value: 2 },
    { label: "2½ yd", value: 2.5 },
    { label: "3 yd", value: 3 },
    { label: "3½ yd", value: 3.5 },
    { label: "4 yd", value: 4 },
    { label: "5 yd", value: 5 },
    { label: "6 yd", value: 6 },
    { label: "10 yd", value: 10 },
];

const referenceTable = [
    { yards: "⅛ yd", yVal: 0.125 },
    { yards: "¼ yd", yVal: 0.25 },
    { yards: "⅓ yd", yVal: 1 / 3 },
    { yards: "½ yd", yVal: 0.5 },
    { yards: "⅔ yd", yVal: 2 / 3 },
    { yards: "¾ yd", yVal: 0.75 },
    { yards: "1 yd", yVal: 1 },
    { yards: "1½ yd", yVal: 1.5 },
    { yards: "2 yd", yVal: 2 },
    { yards: "3 yd", yVal: 3 },
    { yards: "4 yd", yVal: 4 },
    { yards: "5 yd", yVal: 5 },
];

const faqItems = [
    {
        q: "How many meters is 1 yard of fabric?",
        a: "One yard of fabric equals exactly 0.9144 meters (91.44 centimeters). This is the internationally agreed conversion factor. A meter is about 9.4% longer than a yard, so you always need slightly fewer meters than yards."
    },
    {
        q: "How do I convert ⅓ yard to meters?",
        a: "⅓ yard equals approximately 0.3048 meters (30.48 cm). This is a tricky conversion because ⅓ creates a repeating decimal. In practice, ask for 0.3 meters or 30.5 cm at the fabric store."
    },
    {
        q: "Do fabric stores round up when selling by the meter?",
        a: "Most fabric stores cut in 0.1-meter (10 cm) increments. Some specialty stores can cut to 0.05-meter (5 cm) increments. Always round up your requirement to the nearest increment the store offers — it's better to have a small remnant than be short."
    },
    {
        q: "Is a yard longer or shorter than a meter?",
        a: "A yard is shorter than a meter. One yard is 91.44 cm, while one meter is 100 cm. That means a meter is about 3.37 inches (8.56 cm) longer than a yard. When converting from yards to meters, you'll always need a smaller number."
    },
    {
        q: "How do I convert yards to meters without a calculator?",
        a: "A quick mental shortcut: multiply yards by 0.9 for a rough estimate. For example, 3 yards × 0.9 = 2.7 meters (exact is 2.74m). This gets you within 2% of the exact answer, close enough for a quick fabric store estimate."
    },
];

const relatedTools = [
    { name: "Meters to Yards Converter", href: "/convert/meters-to-yards", icon: ArrowRightLeft },
    { name: "Universal Sewing Converter", href: "/convert/universal-sewing-converter", icon: Ruler },
    { name: "Inches to Centimeters", href: "/convert/inches-to-centimeters", icon: Ruler },
    { name: "Fabric Width Converter", href: "/convert/fabric-width-universal", icon: ArrowRightLeft },
    { name: "Basic Yardage Calculator", href: "/yardage/basic-calculator", icon: Ruler },
];

export default function YardsToMetersPage() {
    const [yards, setYards] = useState<string>("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const numericYards = parseFloat(yards) || 0;
    const meters = numericYards * YARDS_TO_METERS;
    const centimeters = meters * 100;
    const inches = numericYards * 36;
    const feet = inches / 12;
    const roundedUpMeters = Math.ceil(meters * 10) / 10;

    const isHighYardage = numericYards > 20;

    const handlePreset = useCallback((value: number) => {
        setYards(value % 1 === 0 ? value.toString() : value.toFixed(4).replace(/0+$/, "").replace(/\.$/, ""));
    }, []);

    const handleCopy = useCallback(() => {
        if (numericYards > 0) {
            navigator.clipboard.writeText(
                `${numericYards} yards = ${meters.toFixed(4)} meters (${centimeters.toFixed(1)} cm)\nRounded up for buying: ${roundedUpMeters.toFixed(1)} m`
            );
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [numericYards, meters, centimeters, roundedUpMeters]);

    const handlePrint = useCallback(() => {
        window.print();
    }, []);

    return (
        <div className="container">
            <Breadcrumb
                items={[
                    { label: "Conversion Tools", href: "/convert" },
                    { label: "Yards to Meters" },
                ]}
            />

            <div className="calculator-page">
                <div className="calculator-layout">
                    <div className="calculator-main">
                        {/* Tool Header */}
                        <div className={styles.toolHeader}>
                            <span className="category-badge">
                                <Ruler size={14} strokeWidth={1.5} /> Conversion Tool #1
                            </span>
                            <h1>Yards to Meters Converter</h1>
                            <p>
                                Convert fabric yardage to meters with sewing-specific presets and fraction support.
                                Perfect for international pattern shopping and fabric conversion.
                            </p>
                        </div>

                        {/* Calculator Card */}
                        <div className="calculator-card">
                            <h2 className={styles.calcTitle}>Enter Yards</h2>

                            <div className="calculator-form">
                                <div className="input-group">
                                    <label className="input-label" htmlFor="yards-input">
                                        Yards
                                    </label>
                                    <input
                                        id="yards-input"
                                        type="number"
                                        className="input-field input-mono"
                                        placeholder="Enter yards (e.g., 2.5)"
                                        value={yards}
                                        onChange={(e) => setYards(e.target.value)}
                                        min="0"
                                        step="0.125"
                                        autoFocus
                                    />
                                    <span className="input-helper">
                                        Accepts decimals and fractions. Tip: 1 yard = 0.9144 meters.
                                    </span>
                                </div>

                                {/* Fraction Presets */}
                                <div className={styles.presets}>
                                    <span className={styles.presetsLabel}>Quick presets (tap to auto-fill):</span>
                                    <div className={styles.presetGrid}>
                                        {fractionPresets.map((preset) => (
                                            <button
                                                key={preset.label}
                                                className={`btn btn-ghost btn-sm ${Math.abs(parseFloat(yards) - preset.value) < 0.001 ? styles.presetActive : ""}`}
                                                onClick={() => handlePreset(preset.value)}
                                            >
                                                {preset.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Smart Warning */}
                            {isHighYardage && (
                                <div className="note-warning" style={{ marginTop: 16 }}>
                                    <AlertTriangle size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                                    <strong>Heads up:</strong> {numericYards} yards is a large amount. Double-check this is correct before purchasing.
                                </div>
                            )}

                            {/* Results */}
                            {numericYards > 0 && (
                                <div className={styles.results}>
                                    <div className="calculator-divider" />

                                    {/* Primary Result */}
                                    <div className="result-card">
                                        <div className="result-prefix">Result</div>
                                        <div className="result-value">{meters.toFixed(4)} m</div>
                                        <div className="result-label">
                                            {numericYards} yard{numericYards !== 1 ? "s" : ""} = {meters.toFixed(4)} meters
                                        </div>
                                    </div>

                                    {/* Secondary Results */}
                                    <div className={styles.resultDetails}>
                                        <div className="result-row">
                                            <span className="result-row-label">Exact meters</span>
                                            <span className="result-row-value">{meters.toFixed(4)} m</span>
                                        </div>
                                        <div className="result-row">
                                            <span className="result-row-label">Rounded (nearest 0.1m)</span>
                                            <span className="result-row-value">{(Math.round(meters * 10) / 10).toFixed(1)} m</span>
                                        </div>
                                        <div className="result-row">
                                            <span className="result-row-label">Rounded up for buying</span>
                                            <span className="result-row-value" style={{ color: 'var(--color-accent-primary)', fontWeight: 700 }}>
                                                {roundedUpMeters.toFixed(1)} m
                                            </span>
                                        </div>
                                        <div className="result-row">
                                            <span className="result-row-label">Centimeters</span>
                                            <span className="result-row-value">{centimeters.toFixed(1)} cm</span>
                                        </div>
                                        <div className="result-row">
                                            <span className="result-row-label">Inches</span>
                                            <span className="result-row-value">{inches.toFixed(1)} in</span>
                                        </div>
                                        <div className="result-row">
                                            <span className="result-row-label">Feet</span>
                                            <span className="result-row-value">{feet.toFixed(2)} ft</span>
                                        </div>
                                    </div>

                                    {/* Buying Guidance */}
                                    <div className="note-tip" style={{ marginTop: 16 }}>
                                        <ShoppingBag size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                                        <strong>At the fabric store:</strong> Ask for <strong>{roundedUpMeters.toFixed(1)} meters</strong>.
                                        Always round up when buying — shrinkage, cutting waste, and pattern matching all need extra fabric.
                                    </div>

                                    {/* Toolbar */}
                                    <div className="toolbar" style={{ marginTop: 16 }}>
                                        <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
                                            <Copy size={14} /> {copied ? "Copied!" : "Copy Result"}
                                        </button>
                                        <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
                                            <Printer size={14} /> Print
                                        </button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => setYards("")}>
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
                                        <h4>Enter your yardage</h4>
                                        <p>Type yards in the input field, or tap a quick preset button for common fractions.</p>
                                    </div>
                                </div>
                                <div className="step-item">
                                    <div className="step-number">2</div>
                                    <div className="step-content">
                                        <h4>Read the conversion</h4>
                                        <p>The result appears instantly with exact meters, centimeters, and rounded values.</p>
                                    </div>
                                </div>
                                <div className="step-item">
                                    <div className="step-number">3</div>
                                    <div className="step-content">
                                        <h4>Use the buying guidance</h4>
                                        <p>The &quot;Rounded up for buying&quot; value tells you exactly what to ask for at the fabric store.</p>
                                    </div>
                                </div>
                                <div className="step-item">
                                    <div className="step-number">4</div>
                                    <div className="step-content">
                                        <h4>Copy or print</h4>
                                        <p>Copy results to clipboard or print a clean reference to take shopping with you.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Reference Table */}
                        <div className="calculator-card">
                            <h2 className={styles.sectionTitle}>
                                <BookOpen size={20} strokeWidth={1.5} style={{ color: 'var(--color-accent-primary)' }} />
                                Quick Reference Table
                            </h2>
                            <p style={{ fontSize: 14, color: 'var(--color-text-tertiary)', marginBottom: 16 }}>
                                Common yardage fractions every sewist should know.
                            </p>
                            <div className={styles.tableWrap}>
                                <table className={styles.convTable}>
                                    <thead>
                                        <tr>
                                            <th>Yards</th>
                                            <th>Meters</th>
                                            <th>Centimeters</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {referenceTable.map((row) => (
                                            <tr key={row.yards}>
                                                <td>{row.yards}</td>
                                                <td>{(row.yVal * YARDS_TO_METERS).toFixed(2)} m</td>
                                                <td>{(row.yVal * YARDS_TO_METERS * 100).toFixed(1)} cm</td>
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
                                Understanding Yards &amp; Meters
                            </h2>
                            <div className={styles.eduGrid}>
                                <div className={styles.eduItem}>
                                    <h4>Why patterns use yards</h4>
                                    <p>Yards are the standard fabric measurement in the United States and Canada. Most American sewing patterns list fabric requirements in yards because fabric stores in these countries sell and cut fabric by the yard.</p>
                                </div>
                                <div className={styles.eduItem}>
                                    <h4>Why fabric stores use meters</h4>
                                    <p>The metric system is the international standard. Fabric stores in Europe, Asia, Australia, and most of the world measure fabric in meters. Online international stores almost always list in meters.</p>
                                </div>
                                <div className={styles.eduItem}>
                                    <h4>Why ⅓ yard is tricky to convert</h4>
                                    <p>⅓ yard converts to 0.3048 meters — a repeating decimal when expressed as centimeters (30.48 cm). In practice, round to 0.3m or 30.5 cm.</p>
                                </div>
                                <div className={styles.eduItem}>
                                    <h4>Common fractions to memorize</h4>
                                    <p>The three conversions every sewist should know by heart: ½ yard ≈ 0.46m, 1 yard ≈ 0.91m, and 2 yards ≈ 1.83m. These cover most quick estimates.</p>
                                </div>
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <section className="faq-section">
                            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
                            <div style={{ marginTop: 16 }}>
                                {faqItems.map((faq, i) => (
                                    <div
                                        key={i}
                                        className={`faq-item ${activeFaq === i ? "active" : ""}`}
                                    >
                                        <button
                                            className="faq-question"
                                            onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                            aria-expanded={activeFaq === i}
                                        >
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
                                        <span className="related-tool-icon">
                                            <IconComp size={16} strokeWidth={1.5} />
                                        </span>
                                        {tool.name}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="quick-reference">
                            <h4>Quick Reference</h4>
                            <div className={styles.quickRefItem}>
                                <span>1 yard</span>
                                <strong>0.9144 m</strong>
                            </div>
                            <div className={styles.quickRefItem}>
                                <span>1 meter</span>
                                <strong>1.0936 yd</strong>
                            </div>
                            <div className={styles.quickRefItem}>
                                <span>1 yard</span>
                                <strong>36 inches</strong>
                            </div>
                            <div className={styles.quickRefItem}>
                                <span>1 meter</span>
                                <strong>100 cm</strong>
                            </div>
                            <div className={styles.quickRefItem}>
                                <span>1 yard</span>
                                <strong>91.44 cm</strong>
                            </div>
                        </div>

                        {/* Reverse Link */}
                        <Link href="/convert/meters-to-yards" className="btn btn-secondary btn-md" style={{ width: '100%', justifyContent: 'center' }}>
                            <ArrowRightLeft size={16} /> Meters → Yards
                        </Link>
                    </aside>
                </div>
            </div>
        </div>
    );
}
