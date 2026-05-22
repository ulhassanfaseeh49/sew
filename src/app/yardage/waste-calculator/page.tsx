"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Recycle, Ruler, Shield } from "lucide-react";

export default function WasteCalcPage() {
    const [fabricWidth, setFabricWidth] = useState("44.5"); const [yardsBought, setYardsBought] = useState(""); const [efficiency, setEfficiency] = useState("75"); const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const fw = parseFloat(fabricWidth) || 44.5; const yb = parseFloat(yardsBought) || 0; const eff = parseFloat(efficiency) || 75;
    const totalArea = fw * (yb * 36); const usedArea = totalArea * (eff / 100); const wasteArea = totalArea - usedArea;
    const wasteYards = (wasteArea / (fw * 36)); const rating = eff >= 85 ? "Excellent" : eff >= 70 ? "Good" : eff >= 55 ? "Average" : "High Waste";

    const faqItems = [{ q: "What is normal fabric waste?", a: "Typical garment cutting wastes 15-30% of fabric (70-85% efficiency). Simple rectangles can achieve 90%+, while circle skirts may waste 40-50%." }, { q: "How can I reduce waste?", a: "Use remnants for small projects, combine pattern pieces efficiently, or explore zero-waste pattern cutting techniques." }];

    return (<div className="container"><Breadcrumb items={[{ label: "Yardage Calculators", href: "/yardage" }, { label: "Waste Calculator" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><Recycle size={14} strokeWidth={1.5} /> Yardage Tool</span><h1>Fabric Waste Calculator</h1><p>Estimate fabric waste based on cutting efficiency and plan more sustainable projects.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}>
                <h2 className={styles.calcTitle}>Estimate Waste</h2>
                <div className="calculator-form">
                    <div className="calculator-form-row">
                        <div className="input-group"><label className="input-label" htmlFor="fw">Fabric width</label><select id="fw" className="input-field" value={fabricWidth} onChange={e => setFabricWidth(e.target.value)}><option value="44.5">44/45&quot;</option><option value="54">54&quot;</option><option value="60">60&quot;</option></select></div>
                        <div className="input-group"><label className="input-label" htmlFor="yb">Yards purchased</label><input id="yb" type="number" className="input-field" placeholder="e.g., 3" value={yardsBought} onChange={e => setYardsBought(e.target.value)} min="0" /></div>
                    </div>
                    <div className="input-group"><label className="input-label">Cutting efficiency: {eff}% ({rating})</label><input type="range" className="input-field" min="30" max="95" value={efficiency} onChange={e => setEfficiency(e.target.value)} style={{ padding: "0.5rem" }} /><div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--color-text-tertiary)" }}><span>30% (circle skirts)</span><span>95% (rectangles)</span></div></div>
                </div>
                {yb > 0 && (<div className={`calculator-results ${styles.results}`}>
                    <div className="result-card"><div className="result-value">{wasteYards.toFixed(2)} yards wasted</div><div className="result-label">{(100 - eff).toFixed(0)}% waste — {rating}</div></div>
                    <div className={styles.resultDetails}>
                        <div className={styles.resultRow}><span>Total fabric area</span><strong>{totalArea.toFixed(0)} sq in</strong></div>
                        <div className={styles.resultRow}><span>Used for project</span><strong>{usedArea.toFixed(0)} sq in ({eff}%)</strong></div>
                        <div className={styles.resultRow}><span>Waste area</span><strong>{wasteArea.toFixed(0)} sq in ({(100 - eff).toFixed(0)}%)</strong></div>
                    </div>
                    <div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`Waste: ${wasteYards.toFixed(2)} yd (${(100 - eff)}%)`)}><ClipboardCopy size={13} /> Copy</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button></div>
                </div>)}
            </div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/yardage/buffer-calculator" className="related-tool-link"><Shield size={13} /> Buffer Calculator</a><a href="/yardage/basic-calculator" className="related-tool-link"><Ruler size={13} /> Basic Yardage</a></div></aside></div>
    </div>);
}
