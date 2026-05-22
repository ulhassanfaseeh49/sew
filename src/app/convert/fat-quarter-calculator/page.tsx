"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

export default function FatQuarterCalculatorPage() {
    const [squareSize, setSquareSize] = useState("");
    const [rectW, setRectW] = useState("");
    const [rectH, setRectH] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const fqW = 22; const fqH = 18;
    const fqArea = fqW * fqH; // 396 sq in
    const sq = parseFloat(squareSize) || 0;
    const rw = parseFloat(rectW) || 0;
    const rh = parseFloat(rectH) || 0;

    const squaresAcross = sq > 0 ? Math.floor(fqW / sq) : 0;
    const squaresDown = sq > 0 ? Math.floor(fqH / sq) : 0;
    const totalSquares = squaresAcross * squaresDown;

    const rectsAcross = rw > 0 ? Math.floor(fqW / rw) : 0;
    const rectsDown = rh > 0 ? Math.floor(fqH / rh) : 0;
    const totalRects = rectsAcross * rectsDown;

    const faqItems = [
        { q: "What is a fat quarter?", a: "A fat quarter is a half-yard of fabric cut in half across the width, resulting in a piece approximately 18\" × 22\" (instead of a standard quarter yard which is 9\" × 44\")." },
        { q: "Why are fat quarters popular in quilting?", a: "Fat quarters are more useful for cutting larger pieces because of their squarer shape, compared to a standard quarter yard which is long and narrow." },
    ];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Fat Quarter Calculator" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><span>🟩</span> Conversion Tool #18</span>
                        <h1>Fat Quarter Calculator</h1>
                        <p>Calculate how many pieces you can cut from a fat quarter (18&quot; × 22&quot;). Enter square or rectangle dimensions.</p>
                    </div>
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Fat Quarter: {fqW}&quot; × {fqH}&quot; ({fqArea} sq in)</h2>
                        <div className="calculator-form">
                            <div className="input-group">
                                <label className="input-label" htmlFor="sq">Cut squares of size (inches)</label>
                                <input id="sq" type="number" className="input-field" placeholder='e.g., 5 for 5" squares' value={squareSize} onChange={e => setSquareSize(e.target.value)} min="0" step="0.25" />
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-tertiary)', textAlign: 'center' }}>— or cut rectangles —</p>
                            <div className="calculator-form-row">
                                <div className="input-group">
                                    <label className="input-label" htmlFor="rw">Width (inches)</label>
                                    <input id="rw" type="number" className="input-field" placeholder="e.g., 2.5" value={rectW} onChange={e => setRectW(e.target.value)} min="0" step="0.25" />
                                </div>
                                <div className="input-group">
                                    <label className="input-label" htmlFor="rh">Height (inches)</label>
                                    <input id="rh" type="number" className="input-field" placeholder="e.g., 4.5" value={rectH} onChange={e => setRectH(e.target.value)} min="0" step="0.25" />
                                </div>
                            </div>
                        </div>
                        {(totalSquares > 0 || totalRects > 0) && (<div className={`calculator-results ${styles.results}`}>
                            {sq > 0 && <div className="result-card"><div className="result-value">{totalSquares} squares</div><div className="result-label">{sq}&quot; × {sq}&quot; squares from one fat quarter ({squaresAcross} across × {squaresDown} down)</div></div>}
                            {rw > 0 && rh > 0 && <div className="result-card"><div className="result-value">{totalRects} rectangles</div><div className="result-label">{rw}&quot; × {rh}&quot; rectangles from one fat quarter ({rectsAcross} across × {rectsDown} down)</div></div>}
                            <div className="toolbar">
                                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(sq > 0 ? `${totalSquares} ${sq}" squares from 1 FQ` : `${totalRects} ${rw}"×${rh}" rects from 1 FQ`)}>📋 Copy</button>
                                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>🖨️ Print</button>
                            </div>
                        </div>)}
                    </div>
                    <div className={`glass-card ${styles.infoSection}`}>
                        <h2>Common Cuts from a Fat Quarter</h2>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead><tr><th>Square Size</th><th>Count</th><th>Layout</th></tr></thead>
                                <tbody>
                                    {[2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9].map(s => {
                                        const a = Math.floor(fqW / s); const d = Math.floor(fqH / s);
                                        return <tr key={s}><td>{s}&quot;</td><td>{a * d}</td><td>{a} × {d}</td></tr>;
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/convert/fat-eighth-calculator" className="related-tool-link">🟩 Fat Eighth</a><a href="/convert/fabric-cut-comparator" className="related-tool-link">📊 Cut Comparator</a><a href="/convert/precut-fabric-sizes" className="related-tool-link">📋 Pre-Cut Sizes</a></div></aside>
            </div>
        </div>
    );
}
