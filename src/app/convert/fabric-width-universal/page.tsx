"use client";

import { useState, useCallback } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

const commonWidths = [
    { label: '36"', value: 36 },
    { label: '44/45"', value: 44.5 },
    { label: '54"', value: 54 },
    { label: '58/60"', value: 59 },
    { label: '72"', value: 72 },
    { label: '90"', value: 90 },
    { label: '108"', value: 108 },
];

const faqItems = [
    { q: "How does fabric width affect yardage needed?", a: "Wider fabric means you can fit more pattern pieces side by side, which reduces the total length (yardage) required. The formula is: New Yardage = Original Yardage × (Original Width ÷ New Width)." },
    { q: "What are the most common fabric widths?", a: "The most common widths are 44/45\" (quilting cotton, many apparel fabrics), 58/60\" (apparel, home décor), and 108\" (quilt backing, sheeting). Vintage fabrics may be 36\" wide." },
    { q: "Can I always just use the width ratio formula?", a: "The formula gives you a good estimate, but it's not always exact because pattern piece arrangement matters. Always add 10-15% extra for safety, especially for garments with large pieces." },
];

export default function FabricWidthUniversalPage() {
    const [origWidth, setOrigWidth] = useState<string>("44.5");
    const [newWidth, setNewWidth] = useState<string>("60");
    const [origYardage, setOrigYardage] = useState<string>("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const ow = parseFloat(origWidth) || 0;
    const nw = parseFloat(newWidth) || 0;
    const oy = parseFloat(origYardage) || 0;
    const newYardage = ow > 0 && nw > 0 ? oy * (ow / nw) : 0;
    const savings = oy > 0 ? oy - newYardage : 0;
    const savingsPercent = oy > 0 ? (savings / oy) * 100 : 0;

    const handleCopy = useCallback(() => {
        if (newYardage > 0) {
            navigator.clipboard.writeText(
                `Converting ${oy} yd of ${ow}" fabric to ${nw}" width: ${newYardage.toFixed(2)} yards needed (${savingsPercent >= 0 ? 'saves' : 'needs extra'} ${Math.abs(savingsPercent).toFixed(1)}%)`
            );
        }
    }, [oy, ow, nw, newYardage, savingsPercent]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Universal Fabric Width Converter" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><span>↔️</span> Conversion Tool #15</span>
                        <h1>Universal Fabric Width Converter</h1>
                        <p>Convert yardage requirements between ANY two fabric widths. Enter your pattern&apos;s width, the fabric you&apos;re buying, and the yardage to convert.</p>
                    </div>

                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Width Conversion</h2>
                        <div className="calculator-form">
                            <div className="calculator-form-row">
                                <div className="input-group">
                                    <label className="input-label" htmlFor="orig-width">Pattern Fabric Width (inches)</label>
                                    <input id="orig-width" type="number" className="input-field" placeholder='e.g., 44.5' value={origWidth} onChange={(e) => setOrigWidth(e.target.value)} min="1" step="0.5" />
                                    <div className={styles.presetGrid} style={{ marginTop: '0.5rem' }}>
                                        {commonWidths.map(w => (
                                            <button key={`o${w.value}`} className={`btn btn-ghost btn-sm ${parseFloat(origWidth) === w.value ? styles.presetActive : ""}`} onClick={() => setOrigWidth(w.value.toString())}>{w.label}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label className="input-label" htmlFor="new-width">Your Fabric Width (inches)</label>
                                    <input id="new-width" type="number" className="input-field" placeholder='e.g., 60' value={newWidth} onChange={(e) => setNewWidth(e.target.value)} min="1" step="0.5" />
                                    <div className={styles.presetGrid} style={{ marginTop: '0.5rem' }}>
                                        {commonWidths.map(w => (
                                            <button key={`n${w.value}`} className={`btn btn-ghost btn-sm ${parseFloat(newWidth) === w.value ? styles.presetActive : ""}`} onClick={() => setNewWidth(w.value.toString())}>{w.label}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="input-group">
                                <label className="input-label" htmlFor="orig-yardage">Original Yardage Required</label>
                                <input id="orig-yardage" type="number" className="input-field" placeholder="Enter yardage from pattern (e.g., 3)" value={origYardage} onChange={(e) => setOrigYardage(e.target.value)} min="0" step="0.125" />
                            </div>
                        </div>

                        {newYardage > 0 && (
                            <div className={`calculator-results ${styles.results}`}>
                                <div className="result-card">
                                    <div className="result-value">{(Math.ceil(newYardage * 8) / 8).toFixed(3)} yards</div>
                                    <div className="result-label">
                                        You need this much {nw}&quot;-wide fabric (rounded up to nearest ⅛ yd)
                                    </div>
                                </div>
                                <div className={styles.resultDetails}>
                                    <div className={styles.resultRow}><span>Exact conversion</span><strong>{newYardage.toFixed(4)} yd</strong></div>
                                    <div className={styles.resultRow}><span>In meters</span><strong>{(newYardage * 0.9144).toFixed(2)} m</strong></div>
                                    <div className={styles.resultRow}>
                                        <span>{savings >= 0 ? "Fabric saved" : "Extra needed"}</span>
                                        <strong style={{ color: savings >= 0 ? 'var(--color-accent-primary)' : '#ef4444' }}>
                                            {Math.abs(savings).toFixed(2)} yd ({Math.abs(savingsPercent).toFixed(1)}%)
                                        </strong>
                                    </div>
                                    <div className={styles.resultRow}><span>Width ratio</span><strong>{(ow / nw).toFixed(4)}</strong></div>
                                </div>
                                <div className="toolbar">
                                    <button className="btn btn-secondary btn-sm" onClick={handleCopy}>📋 Copy</button>
                                    <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>🖨️ Print</button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={`glass-card ${styles.infoSection}`}>
                        <h2>Conversion Table: Common Width Changes</h2>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead><tr><th>From Width</th><th>To Width</th><th>For 1 yard</th><th>For 2 yards</th><th>For 3 yards</th></tr></thead>
                                <tbody>
                                    {[
                                        [44.5, 60], [44.5, 108], [60, 44.5], [60, 108], [36, 44.5], [36, 60], [108, 60],
                                    ].map(([from, to]) => (
                                        <tr key={`${from}-${to}`}>
                                            <td>{from}&quot;</td>
                                            <td>{to}&quot;</td>
                                            <td>{(1 * from / to).toFixed(2)} yd</td>
                                            <td>{(2 * from / to).toFixed(2)} yd</td>
                                            <td>{(3 * from / to).toFixed(2)} yd</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <section className="faq-section">
                        <h2>Frequently Asked Questions</h2>
                        <div style={{ marginTop: "1.5rem" }}>
                            {faqItems.map((faq, i) => (
                                <div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}>
                                    <button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button>
                                    <div className="faq-answer">{faq.a}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <aside className="calculator-sidebar">
                    <div className="glass-card related-tools">
                        <h4>Related Tools</h4>
                        <a href="/convert/fabric-width-44-to-60" className="related-tool-link">↔️ 44&quot; to 60&quot; Converter</a>
                        <a href="/convert/fabric-width-60-to-108" className="related-tool-link">↔️ 60&quot; to 108&quot; Converter</a>
                        <a href="/yardage/basic-calculator" className="related-tool-link">🧵 Yardage Calculator</a>
                        <a href="/convert/fabric-width-comparison" className="related-tool-link">👁️ Width Comparison Tool</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}
