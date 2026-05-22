"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

export default function BoltYardageCalculatorPage() {
    const [totalYards, setTotalYards] = useState("");
    const [usedYards, setUsedYards] = useState("");
    const [pricePerYard, setPricePerYard] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const total = parseFloat(totalYards) || 0;
    const used = parseFloat(usedYards) || 0;
    const price = parseFloat(pricePerYard) || 0;
    const remaining = Math.max(0, total - used);
    const totalCost = total * price;
    const usedCost = used * price;
    const remainingCost = remaining * price;
    const meters = total * 0.9144;

    const faqItems = [
        { q: "How many yards are on a standard bolt of fabric?", a: "Standard bolts contain 10-20 yards for quilting cottons, 15-25 yards for apparel, and up to 50-100 yards for wholesale bolts." },
        { q: "How do I track bolt usage?", a: "Enter the total yards on the bolt and subtract what you've used. This tool calculates remaining yardage and value." },
    ];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Bolt Yardage Calculator" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><span>🧵</span> Conversion Tool #17</span>
                        <h1>Fabric Bolt Yardage Calculator</h1>
                        <p>Track bolt yardage, calculate remaining fabric, and estimate the value of your fabric inventory.</p>
                    </div>
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Bolt Details</h2>
                        <div className="calculator-form">
                            <div className="calculator-form-row">
                                <div className="input-group">
                                    <label className="input-label" htmlFor="total">Total yards on bolt</label>
                                    <input id="total" type="number" className="input-field" placeholder="e.g., 15" value={totalYards} onChange={e => setTotalYards(e.target.value)} min="0" />
                                </div>
                                <div className="input-group">
                                    <label className="input-label" htmlFor="used">Yards used so far</label>
                                    <input id="used" type="number" className="input-field" placeholder="e.g., 4.5" value={usedYards} onChange={e => setUsedYards(e.target.value)} min="0" />
                                </div>
                            </div>
                            <div className="input-group">
                                <label className="input-label" htmlFor="price">Price per yard ($, optional)</label>
                                <input id="price" type="number" className="input-field" placeholder="e.g., 12.99" value={pricePerYard} onChange={e => setPricePerYard(e.target.value)} min="0" step="0.01" />
                            </div>
                        </div>
                        {total > 0 && (<div className={`calculator-results ${styles.results}`}>
                            <div className="result-card"><div className="result-value">{remaining.toFixed(2)} yards remaining</div><div className="result-label">of {total} total yards ({meters.toFixed(1)} meters)</div></div>
                            <div className={styles.resultDetails}>
                                <div className={styles.resultRow}><span>Used</span><strong>{used.toFixed(2)} yd ({total > 0 ? ((used / total) * 100).toFixed(1) : 0}%)</strong></div>
                                <div className={styles.resultRow}><span>Remaining</span><strong>{remaining.toFixed(2)} yd ({total > 0 ? ((remaining / total) * 100).toFixed(1) : 0}%)</strong></div>
                                {price > 0 && <><div className={styles.resultRow}><span>Total bolt value</span><strong>${totalCost.toFixed(2)}</strong></div>
                                    <div className={styles.resultRow}><span>Value used</span><strong>${usedCost.toFixed(2)}</strong></div>
                                    <div className={styles.resultRow}><span>Remaining value</span><strong>${remainingCost.toFixed(2)}</strong></div></>}
                            </div>
                            <div className="toolbar">
                                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`Bolt: ${total} yd, Used: ${used} yd, Remaining: ${remaining} yd`)}>📋 Copy</button>
                                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>🖨️ Print</button>
                            </div>
                        </div>)}
                    </div>
                    <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/convert/bolt-to-project-estimator" className="related-tool-link">📦 Bolt to Project</a><a href="/cost/per-yard" className="related-tool-link">💰 Cost Per Yard</a></div></aside>
            </div>
        </div>
    );
}
