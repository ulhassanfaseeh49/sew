"use client";

import { useState, useCallback } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "./page.module.css";

const YARDS_TO_METERS = 0.9144;

const commonPresets = [
    { label: "¼ yard", value: 0.25 },
    { label: "⅓ yard", value: 1 / 3 },
    { label: "½ yard", value: 0.5 },
    { label: "⅔ yard", value: 2 / 3 },
    { label: "1 yard", value: 1 },
    { label: "1½ yards", value: 1.5 },
    { label: "2 yards", value: 2 },
    { label: "3 yards", value: 3 },
    { label: "5 yards", value: 5 },
    { label: "10 yards", value: 10 },
];

const faqItems = [
    {
        q: "How many meters are in one yard?",
        a: "One yard equals exactly 0.9144 meters. This is the international standard conversion factor used worldwide."
    },
    {
        q: "Why do I need to convert yards to meters for sewing?",
        a: "Many sewing patterns, especially from European designers, list fabric requirements in meters. If you're shopping in the US where fabric is sold by the yard, or vice versa, you need accurate conversion to buy the right amount."
    },
    {
        q: "Should I round up when converting yards to meters?",
        a: "Yes! Always round up to the nearest 0.1 meter (or buy a little extra). Fabric shrinkage, cutting mistakes, and pattern matching all require extra fabric. It's better to have a small remnant than to be short."
    },
    {
        q: "What's the difference between yards and meters?",
        a: "A yard (36 inches) is an imperial unit used primarily in the US. A meter (100 centimeters) is a metric unit used in most other countries. A meter is about 9.4% longer than a yard."
    },
];

export default function YardsToMetersPage() {
    const [yards, setYards] = useState<string>("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const numericYards = parseFloat(yards) || 0;
    const meters = numericYards * YARDS_TO_METERS;
    const centimeters = meters * 100;
    const inches = numericYards * 36;

    const handlePreset = useCallback((value: number) => {
        setYards(value.toString());
    }, []);

    const handleCopy = useCallback(() => {
        if (numericYards > 0) {
            navigator.clipboard.writeText(
                `${numericYards} yards = ${meters.toFixed(4)} meters (${centimeters.toFixed(1)} cm)`
            );
        }
    }, [numericYards, meters, centimeters]);

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

            <div className="calculator-layout">
                <div className="calculator-main">
                    {/* Header */}
                    <div className={styles.toolHeader}>
                        <span className="category-badge">
                            <span>📏</span> Conversion Tool #1
                        </span>
                        <h1>Yards to Meters Converter</h1>
                        <p>
                            Convert fabric yardage to meters instantly. Perfect for international
                            pattern shopping and fabric conversion.
                        </p>
                    </div>

                    {/* Calculator */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Enter Yards</h2>

                        <div className="calculator-form">
                            <div className="input-group">
                                <label className="input-label" htmlFor="yards-input">
                                    Yards
                                </label>
                                <input
                                    id="yards-input"
                                    type="number"
                                    className="input-field"
                                    placeholder="Enter yards (e.g., 2.5)"
                                    value={yards}
                                    onChange={(e) => setYards(e.target.value)}
                                    min="0"
                                    step="0.125"
                                />
                            </div>

                            {/* Presets */}
                            <div className={styles.presets}>
                                <span className={styles.presetsLabel}>Quick presets:</span>
                                <div className={styles.presetGrid}>
                                    {commonPresets.map((preset) => (
                                        <button
                                            key={preset.label}
                                            className={`btn btn-ghost btn-sm ${parseFloat(yards) === preset.value ? styles.presetActive : ""
                                                }`}
                                            onClick={() => handlePreset(preset.value)}
                                        >
                                            {preset.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Results */}
                        {numericYards > 0 && (
                            <div className={`calculator-results ${styles.results}`}>
                                <div className="result-card">
                                    <div className="result-value">{meters.toFixed(4)} m</div>
                                    <div className="result-label">
                                        {numericYards} yard{numericYards !== 1 ? "s" : ""} in meters
                                    </div>
                                </div>

                                <div className={styles.resultDetails}>
                                    <div className={styles.resultRow}>
                                        <span>Centimeters</span>
                                        <strong>{centimeters.toFixed(1)} cm</strong>
                                    </div>
                                    <div className={styles.resultRow}>
                                        <span>Inches</span>
                                        <strong>{inches.toFixed(1)} in</strong>
                                    </div>
                                    <div className={styles.resultRow}>
                                        <span>Rounded up (nearest 0.1m)</span>
                                        <strong>{(Math.ceil(meters * 10) / 10).toFixed(1)} m</strong>
                                    </div>
                                </div>

                                {/* Toolbar */}
                                <div className="toolbar">
                                    <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
                                        📋 Copy Result
                                    </button>
                                    <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
                                        🖨️ Print
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* How to Use */}
                    <div className={`glass-card ${styles.infoSection}`}>
                        <h2>How to Use This Calculator</h2>
                        <ol className={styles.steps}>
                            <li>Enter the number of yards in the input field, or click a quick preset</li>
                            <li>The conversion to meters appears instantly below</li>
                            <li>Use the &quot;Rounded up&quot; value when buying fabric — always buy a little extra!</li>
                            <li>Copy or print the results to take to the fabric store</li>
                        </ol>
                    </div>

                    {/* Conversion Table */}
                    <div className={`glass-card ${styles.infoSection}`}>
                        <h2>Common Yards to Meters Conversions</h2>
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
                                    {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 10].map((y) => (
                                        <tr key={y}>
                                            <td>{y}</td>
                                            <td>{(y * YARDS_TO_METERS).toFixed(4)}</td>
                                            <td>{(y * YARDS_TO_METERS * 100).toFixed(1)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* FAQ */}
                    <section className="faq-section">
                        <h2>Frequently Asked Questions</h2>
                        <div style={{ marginTop: "1.5rem" }}>
                            {faqItems.map((faq, i) => (
                                <div
                                    key={i}
                                    className={`faq-item ${activeFaq === i ? "active" : ""}`}
                                >
                                    <button
                                        className="faq-question"
                                        onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                    >
                                        {faq.q}
                                        <svg
                                            className="faq-chevron"
                                            width="16"
                                            height="10"
                                            viewBox="0 0 16 10"
                                            fill="none"
                                        >
                                            <path
                                                d="M1 1L8 8L15 1"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    </button>
                                    <div className="faq-answer">{faq.a}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <aside className="calculator-sidebar">
                    <div className="glass-card related-tools">
                        <h4>Related Tools</h4>
                        <a href="/convert/meters-to-yards" className="related-tool-link">
                            🔄 Meters to Yards Converter
                        </a>
                        <a href="/convert/inches-to-centimeters" className="related-tool-link">
                            📏 Inches to Centimeters
                        </a>
                        <a href="/convert/universal-sewing-converter" className="related-tool-link">
                            🌐 Universal Sewing Converter
                        </a>
                        <a href="/convert/fabric-width-universal" className="related-tool-link">
                            ↔️ Fabric Width Converter
                        </a>
                        <a href="/yardage/basic-calculator" className="related-tool-link">
                            🧵 Basic Yardage Calculator
                        </a>
                    </div>

                    <div className={`glass-card ${styles.quickRef}`}>
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
                    </div>
                </aside>
            </div>
        </div>
    );
}
