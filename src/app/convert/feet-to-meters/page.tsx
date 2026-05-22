"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

export default function FeetToMetersPage() {
    const [feet, setFeet] = useState("");
    const [extraInches, setExtraInches] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const totalInches = (parseFloat(feet) || 0) * 12 + (parseFloat(extraInches) || 0);
    const meters = totalInches * 0.0254;
    const cm = meters * 100;
    const yards = totalInches / 36;
    const hasResult = totalInches > 0;

    const faqItems = [
        { q: "How do I convert feet and inches to meters?", a: "Multiply feet by 0.3048 to get meters. For remaining inches, multiply by 0.0254 and add to the result." },
        { q: "When do I need feet to meters conversion in sewing?", a: "For large projects like curtains, upholstery, and room measurements where dimensions are often given in feet." },
    ];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Feet to Meters" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><span>📏</span> Conversion Tool #5</span>
                        <h1>Feet to Meters Converter</h1>
                        <p>Convert feet and inches to meters for large fabric measurements and room dimensions.</p>
                    </div>
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Enter Feet &amp; Inches</h2>
                        <div className="calculator-form">
                            <div className="calculator-form-row">
                                <div className="input-group">
                                    <label className="input-label" htmlFor="feet">Feet</label>
                                    <input id="feet" type="number" className="input-field" placeholder="e.g., 6" value={feet} onChange={e => setFeet(e.target.value)} min="0" />
                                </div>
                                <div className="input-group">
                                    <label className="input-label" htmlFor="in">Inches</label>
                                    <input id="in" type="number" className="input-field" placeholder="e.g., 3" value={extraInches} onChange={e => setExtraInches(e.target.value)} min="0" max="11" step="0.5" />
                                </div>
                            </div>
                        </div>
                        {hasResult && (
                            <div className={`calculator-results ${styles.results}`}>
                                <div className="result-card">
                                    <div className="result-value">{meters.toFixed(4)} m</div>
                                    <div className="result-label">{feet || 0} ft {extraInches || 0} in = {meters.toFixed(4)} meters</div>
                                </div>
                                <div className={styles.resultDetails}>
                                    <div className={styles.resultRow}><span>Centimeters</span><strong>{cm.toFixed(1)} cm</strong></div>
                                    <div className={styles.resultRow}><span>Yards</span><strong>{yards.toFixed(4)} yd</strong></div>
                                    <div className={styles.resultRow}><span>Total inches</span><strong>{totalInches.toFixed(1)}&quot;</strong></div>
                                </div>
                                <div className="toolbar">
                                    <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`${feet || 0}' ${extraInches || 0}" = ${meters.toFixed(4)} m`)}>📋 Copy</button>
                                    <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>🖨️ Print</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar">
                    <div className="glass-card related-tools"><h4>Related Tools</h4>
                        <a href="/convert/meters-to-feet" className="related-tool-link">🔄 Meters to Feet</a>
                        <a href="/convert/yards-to-meters" className="related-tool-link">📏 Yards to Meters</a>
                        <a href="/curtains/yardage-calculator" className="related-tool-link">🪟 Curtain Calculator</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}
