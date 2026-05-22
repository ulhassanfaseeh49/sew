"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const pieces = ["Collar", "Collar stand", "Cuffs (×2)", "Front placket", "Waistband", "Pocket flaps", "Button band", "Belt"];

export default function InterfacingCalcPage() {
    const [selected, setSelected] = useState<Record<string, boolean>>({}); const [ifcWidth, setIfcWidth] = useState("20"); const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const iw = parseFloat(ifcWidth) || 20;
    const dims: Record<string, [number, number]> = { Collar: [12, 4], "Collar stand": [16, 2.5], "Cuffs (×2)": [10, 3], "Front placket": [20, 2], Waistband: [36, 3], "Pocket flaps": [6, 4], "Button band": [20, 1.5], Belt: [36, 2] };
    const selectedPieces = pieces.filter(p => selected[p]);
    const totalArea = selectedPieces.reduce((sum, p) => { const [l, w] = dims[p]; return sum + l * w; }, 0);
    const estYards = totalArea > 0 ? Math.ceil((totalArea / (iw * 36)) * 4) / 4 : 0;

    const faqItems = [{ q: "What width is interfacing?", a: "Interfacing commonly comes in 20\" or 22\" widths for fusible types, and 44/45\" for sew-in woven interfacing." }, { q: "Which pieces need interfacing?", a: "Typically collars, cuffs, waistbands, button plackets, and any area that needs structure or stability." }];

    return (<div className="container"><Breadcrumb items={[{ label: "Yardage Calculators", href: "/yardage" }, { label: "Interfacing Calculator" }]} />
        <div className="calculator-layout"><div className="calculator-main">
            <div className={styles.toolHeader}><span className="category-badge"><span>🏷️</span> Yardage Tool #32</span><h1>Interfacing Yardage Calculator</h1><p>Calculate how much interfacing to buy based on which pattern pieces need it.</p></div>
            <div className={`glass-card ${styles.calculatorCard}`}>
                <h2 className={styles.calcTitle}>Select Pieces</h2>
                <div className="calculator-form">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "1rem" }}>
                        {pieces.map(p => (<label key={p} style={{ display: "flex", gap: "0.5rem", alignItems: "center", fontSize: "0.9rem", cursor: "pointer" }}><input type="checkbox" checked={!!selected[p]} onChange={e => setSelected({ ...selected, [p]: e.target.checked })} />{p} ({dims[p][0]}&quot;×{dims[p][1]}&quot;)</label>))}
                    </div>
                    <div className="input-group"><label className="input-label">Interfacing width</label><select className="input-field" value={ifcWidth} onChange={e => setIfcWidth(e.target.value)}><option value="20">20&quot;</option><option value="22">22&quot;</option><option value="44.5">44/45&quot;</option></select></div>
                </div>
                {selectedPieces.length > 0 && (<div className={`calculator-results ${styles.results}`}>
                    <div className="result-card"><div className="result-value">{estYards.toFixed(2)} yards</div><div className="result-label">{iw}&quot;-wide interfacing for {selectedPieces.length} pieces</div></div>
                    <div className={styles.resultDetails}>
                        {selectedPieces.map(p => (<div key={p} className={styles.resultRow}><span>{p}</span><strong>{dims[p][0]}&quot;×{dims[p][1]}&quot; ({dims[p][0] * dims[p][1]} sq in)</strong></div>))}
                        <div className={styles.resultRow}><span>Total area</span><strong>{totalArea.toFixed(0)} sq in</strong></div>
                    </div>
                    <div className="toolbar"><button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`Interfacing: ${estYards.toFixed(2)} yd of ${iw}" for ${selectedPieces.join(', ')}`)}>📋 Copy</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}>🖨️ Print</button></div>
                </div>)}
            </div>
            <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
        </div><aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related Tools</h4><a href="/yardage/lining-calculator" className="related-tool-link">🧥 Lining</a><a href="/yardage/underlining-calculator" className="related-tool-link">📄 Underlining</a></div></aside></div>
    </div>);
}
