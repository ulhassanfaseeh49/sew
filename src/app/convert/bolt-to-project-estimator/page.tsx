"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

export default function BoltToProjectEstimatorPage() {
    const [boltYards, setBoltYards] = useState("");
    const [fabricWidth, setFabricWidth] = useState("44.5");
    const [projectYards, setProjectYards] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const bolt = parseFloat(boltYards) || 0; const projY = parseFloat(projectYards) || 0;
    const projects = projY > 0 ? Math.floor(bolt / projY) : 0;
    const leftover = projY > 0 ? bolt - (projects * projY) : 0;

    const faqItems = [
        { q: "How many projects can I get from a bolt?", a: "Divide the total bolt yardage by the yardage per project. We round down since you can't make a partial project." },
    ];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Bolt to Project Estimator" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><span>📦</span> Conversion Tool #22</span>
                        <h1>Fabric Bolt to Project Estimator</h1>
                        <p>Given a bolt of X yards, how many projects can you make? Perfect for batch crafting and Etsy sellers.</p>
                    </div>
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Estimate Projects</h2>
                        <div className="calculator-form">
                            <div className="calculator-form-row">
                                <div className="input-group"><label className="input-label" htmlFor="bolt">Bolt size (yards)</label><input id="bolt" type="number" className="input-field" placeholder="e.g., 15" value={boltYards} onChange={e => setBoltYards(e.target.value)} min="0" /></div>
                                <div className="input-group"><label className="input-label" htmlFor="fw">Fabric width</label>
                                    <select id="fw" className="input-field" value={fabricWidth} onChange={e => setFabricWidth(e.target.value)}>
                                        <option value="44.5">44/45&quot;</option><option value="60">60&quot;</option><option value="108">108&quot;</option>
                                    </select>
                                </div>
                            </div>
                            <div className="input-group"><label className="input-label" htmlFor="proj">Yards per project</label><input id="proj" type="number" className="input-field" placeholder="e.g., 2.5" value={projectYards} onChange={e => setProjectYards(e.target.value)} min="0" step="0.125" /></div>
                        </div>
                        {bolt > 0 && projY > 0 && (<div className={`calculator-results ${styles.results}`}>
                            <div className="result-card"><div className="result-value">{projects} projects</div><div className="result-label">from {bolt} yards of {fabricWidth}&quot;-wide fabric</div></div>
                            <div className={styles.resultDetails}>
                                <div className={styles.resultRow}><span>Leftover fabric</span><strong>{leftover.toFixed(2)} yards</strong></div>
                                <div className={styles.resultRow}><span>Fabric used</span><strong>{(projects * projY).toFixed(2)} yd ({((projects * projY) / bolt * 100).toFixed(1)}%)</strong></div>
                            </div>
                            <div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`${projects} projects from ${bolt} yd bolt (${leftover.toFixed(2)} yd leftover)`)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}>🖨️ Print</button></div>
                        </div>)}
                    </div>
                    <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/convert/bolt-yardage-calculator" className="related-tool-link">🧵 Bolt Yardage</a><a href="/pricing/handmade-pricing" className="related-tool-link">🏷️ Pricing Calculator</a></div></aside>
            </div>
        </div>
    );
}
