"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

const fabricCuts = [
    { name: "Fat Quarter", w: 22, h: 18, desc: "Half yard cut in half widthwise" },
    { name: "Fat Eighth", w: 22, h: 9, desc: "Fat quarter cut in half" },
    { name: "Quarter Yard", w: 44, h: 9, desc: "Standard ¼ yard cut" },
    { name: "Half Yard", w: 44, h: 18, desc: "Standard ½ yard cut" },
    { name: "Third Yard", w: 44, h: 12, desc: "Standard ⅓ yard cut" },
    { name: "Charm Square (5\")", w: 5, h: 5, desc: "Pre-cut 5\" square" },
    { name: "Layer Cake (10\")", w: 10, h: 10, desc: "Pre-cut 10\" square" },
];

export default function FabricCutComparatorPage() {
    const [squareSize, setSquareSize] = useState("5");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const sq = parseFloat(squareSize) || 5;

    const faqItems = [
        { q: "What's the advantage of a fat quarter over a regular quarter yard?", a: "A fat quarter (18\"×22\") is squarer than a quarter yard (9\"×44\"), making it much better for cutting larger pieces like 5\" or 6\" squares." },
    ];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Fabric Cut Comparator" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><span>📊</span> Conversion Tool #20</span>
                        <h1>Fabric Cut Comparator</h1>
                        <p>Visual comparison of half yard vs quarter yard vs fat quarter — see how many pieces each gives you.</p>
                    </div>
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Compare Cuts</h2>
                        <div className="calculator-form">
                            <div className="input-group">
                                <label className="input-label" htmlFor="sq">Square size to cut (inches)</label>
                                <input id="sq" type="number" className="input-field" placeholder="e.g., 5" value={squareSize} onChange={e => setSquareSize(e.target.value)} min="1" step="0.5" />
                            </div>
                        </div>
                        <div className={`calculator-results ${styles.results}`} style={{ marginTop: '1.5rem' }}>
                            <div className={styles.resultDetails}>
                                {fabricCuts.map(cut => {
                                    const across = Math.floor(cut.w / sq); const down = Math.floor(cut.h / sq);
                                    const area = cut.w * cut.h;
                                    return (<div key={cut.name} className={styles.resultRow}>
                                        <span><strong>{cut.name}</strong> ({cut.w}&quot;×{cut.h}&quot;, {area} sq in)</span>
                                        <strong>{across * down} squares</strong>
                                    </div>);
                                })}
                            </div>
                            <div className="toolbar">
                                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>🖨️ Print Comparison</button>
                            </div>
                        </div>
                    </div>
                    <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/convert/fat-quarter-calculator" className="related-tool-link">🟩 Fat Quarter</a><a href="/convert/fat-eighth-calculator" className="related-tool-link">🟩 Fat Eighth</a><a href="/convert/precut-fabric-sizes" className="related-tool-link">📋 Pre-Cut Sizes</a></div></aside>
            </div>
        </div>
    );
}
