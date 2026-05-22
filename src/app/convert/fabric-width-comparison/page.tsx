"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

const widths = [36, 44.5, 54, 60, 72, 90, 108];

export default function FabricWidthComparisonPage() {
    const [yardage, setYardage] = useState("3");
    const [baseWidth, setBaseWidth] = useState("44.5");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const y = parseFloat(yardage) || 0;
    const bw = parseFloat(baseWidth) || 44.5;

    const faqItems = [
        { q: "How does this comparison tool help?", a: "It shows at a glance how much yardage you'd need at every common fabric width, so you can make the best purchasing decision." },
    ];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Fabric Width Comparison" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><span>👁️</span> Conversion Tool #16</span>
                        <h1>Fabric Width Comparison Tool</h1>
                        <p>Side-by-side comparison showing how much fabric you need at every standard width.</p>
                    </div>
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Compare Widths</h2>
                        <div className="calculator-form">
                            <div className="calculator-form-row">
                                <div className="input-group">
                                    <label className="input-label" htmlFor="base">Your pattern&apos;s width</label>
                                    <select id="base" className="input-field" value={baseWidth} onChange={e => setBaseWidth(e.target.value)}>
                                        {widths.map(w => (<option key={w} value={w}>{w}&quot;</option>))}
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label className="input-label" htmlFor="yd">Required yardage</label>
                                    <input id="yd" type="number" className="input-field" placeholder="e.g., 3" value={yardage} onChange={e => setYardage(e.target.value)} min="0" step="0.125" />
                                </div>
                            </div>
                        </div>
                        {y > 0 && (
                            <div className={`calculator-results ${styles.results}`}>
                                <div className={styles.resultDetails}>
                                    {widths.map(w => {
                                        const need = y * (bw / w);
                                        const rounded = Math.ceil(need * 8) / 8;
                                        const diff = ((need - y) / y * 100);
                                        return (<div key={w} className={styles.resultRow} style={w === bw ? { background: 'var(--color-accent-glow)' } : {}}>
                                            <span>{w}&quot; wide {w === bw ? "(base)" : ""}</span>
                                            <strong>{rounded.toFixed(3)} yd <span style={{ color: diff < 0 ? 'var(--color-accent-primary)' : diff > 0 ? '#ef4444' : 'var(--color-text-tertiary)', fontSize: '0.75rem', marginLeft: '0.5rem' }}>{diff < 0 ? `${Math.abs(diff).toFixed(1)}% less` : diff > 0 ? `${diff.toFixed(1)}% more` : "—"}</span></strong>
                                        </div>);
                                    })}
                                </div>
                                <div className="toolbar">
                                    <button className="btn btn-secondary btn-sm" onClick={() => { const t = widths.map(w => `${w}": ${(Math.ceil(y * bw / w * 8) / 8).toFixed(3)} yd`).join('\n'); navigator.clipboard.writeText(t); }}>📋 Copy All</button>
                                    <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>🖨️ Print</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/convert/fabric-width-universal" className="related-tool-link">↔️ Universal Width</a><a href="/yardage/basic-calculator" className="related-tool-link">🧵 Yardage Calculator</a></div></aside>
            </div>
        </div>
    );
}
