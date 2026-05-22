"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

export default function FatEighthCalculatorPage() {
    const [squareSize, setSquareSize] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const feW = 22; const feH = 9;
    const sq = parseFloat(squareSize) || 0;
    const across = sq > 0 ? Math.floor(feW / sq) : 0;
    const down = sq > 0 ? Math.floor(feH / sq) : 0;
    const total = across * down;

    const faqItems = [
        { q: "What is a fat eighth?", a: "A fat eighth is a fat quarter cut in half, resulting in approximately 9\" × 22\" (instead of a standard eighth yard which is 4.5\" × 44\")." },
        { q: "How many fat eighths in a fat quarter?", a: "Two fat eighths make one fat quarter. A fat eighth is half the area of a fat quarter." },
    ];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Fat Eighth Calculator" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><span>🟩</span> Conversion Tool #19</span>
                        <h1>Fat Eighth Calculator</h1>
                        <p>Calculate how many pieces you can cut from a fat eighth (9&quot; × 22&quot;).</p>
                    </div>
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Fat Eighth: {feW}&quot; × {feH}&quot; ({feW * feH} sq in)</h2>
                        <div className="calculator-form">
                            <div className="input-group">
                                <label className="input-label" htmlFor="sq">Square size (inches)</label>
                                <input id="sq" type="number" className="input-field" placeholder='e.g., 2.5 for 2.5" squares' value={squareSize} onChange={e => setSquareSize(e.target.value)} min="0" step="0.25" />
                            </div>
                        </div>
                        {total > 0 && (<div className={`calculator-results ${styles.results}`}>
                            <div className="result-card"><div className="result-value">{total} squares</div><div className="result-label">{sq}&quot; × {sq}&quot; squares ({across} across × {down} down)</div></div>
                            <div className="toolbar">
                                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`${total} ${sq}" squares from 1 FE`)}>📋 Copy</button>
                                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>🖨️ Print</button>
                            </div>
                        </div>)}
                    </div>
                    <div className={`glass-card ${styles.infoSection}`}>
                        <h2>Common Cuts from a Fat Eighth</h2>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead><tr><th>Square</th><th>Count</th><th>Layout</th></tr></thead>
                                <tbody>{[2, 2.5, 3, 3.5, 4, 4.5].map(s => { const a = Math.floor(feW / s); const d = Math.floor(feH / s); return <tr key={s}><td>{s}&quot;</td><td>{a * d}</td><td>{a}×{d}</td></tr>; })}</tbody>
                            </table>
                        </div>
                    </div>
                    <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/convert/fat-quarter-calculator" className="related-tool-link">🟩 Fat Quarter</a><a href="/convert/precut-fabric-sizes" className="related-tool-link">📋 Pre-Cut Sizes</a></div></aside>
            </div>
        </div>
    );
}
