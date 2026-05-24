"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Baby, ClipboardCopy, Printer, ChevronDown } from "lucide-react";

function toFrac(v: number): string {
    if (v <= 0) return "0"; const w = Math.floor(v); const f = v - w;
    const map: [number, string][] = [[0, ""], [0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
    let best = map[0], bd = 1;
    for (const [n, s] of map) { const d = Math.abs(f - n); if (d < bd) { bd = d; best = [n, s]; } }
    if (Math.abs(f - 1) < bd) return `${w + 1}`; if (!best[1]) return w > 0 ? `${w}` : "0";
    return w > 0 ? `${w} ${best[1]}` : `${best[1]}`;
}

const swaddleSizes = [
    { key: "small", name: "Small", w: 30, h: 30, desc: "Preemie / newborn" },
    { key: "standard", name: "Standard", w: 44, h: 44, desc: "Most common" },
    { key: "large", name: "Large", w: 47, h: 47, desc: "Full swaddle wrap" },
    { key: "xlarge", name: "Extra Large", w: 52, h: 52, desc: "Maximum coverage" },
];

const faqItems = [
    { q: "What size swaddle blanket should I make?", a: "47\" × 47\" is the most popular size — large enough for a good swaddle wrap. 44\" square is standard. Larger is better — you can't swaddle well with a blanket that's too small." },
    { q: "What fabric is best for swaddle blankets?", a: "Double gauze or muslin are the gold standard — lightweight, breathable, and soften with each wash. Bamboo rayon is ultra-soft. Jersey knit has some stretch for easier wrapping." },
    { q: "How many swaddle blankets do I need?", a: "4-6 is ideal. They'll be used for swaddling, nursing cover, stroller shade, changing pad, and general cleanup. A gift set of 3 is very popular." },
    { q: "Should I pre-wash swaddle fabric?", a: "Muslin: wash 3+ times before gifting (it softens dramatically). Pre-cut 3-5\" larger than desired finished size to account for shrinkage. Use hot water to maximize pre-shrinkage." },
];

export default function Page() {
    const [sizeKey, setSizeKey] = useState("large");
    const [fabric, setFabric] = useState("muslin");
    const [qty, setQty] = useState(3);
    const [fabricWidth, setFabricWidth] = useState(44);
    const [showBulk, setShowBulk] = useState(false);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const spec = swaddleSizes.find(s => s.key === sizeKey) || swaddleSizes[2];
    const shrinkFactor = fabric === "muslin" || fabric === "cotton" ? 1.1 : 1.05;

    const calc = useMemo(() => {
        const cutW = Math.ceil(spec.w * shrinkFactor) + 1;
        const cutH = Math.ceil(spec.h * shrinkFactor) + 1;
        const perRow = Math.floor(fabricWidth / cutW);
        const strips = Math.ceil(qty / Math.max(perRow, 1));
        const yd = Math.ceil(strips * cutH / 36 * 4) / 4;
        return { cutW, cutH, perRow, yd };
    }, [spec, shrinkFactor, qty, fabricWidth]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Baby & Kids", href: "/baby-kids" }, { label: "Swaddle Blanket" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Baby size={14} strokeWidth={1.5} /> Baby #395</span>
                        <h1>Swaddle Blanket Calculator</h1>
                        <p>Calculate muslin, gauze, or jersey yardage for swaddle blankets. Set and bulk production planning.</p>
                    </div>

                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Size, Fabric &amp; Quantity</h2>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                            {swaddleSizes.map(s => (<button key={s.key} className={`btn btn-sm ${sizeKey === s.key ? "btn-primary" : "btn-ghost"}`} onClick={() => setSizeKey(s.key)} style={{ fontSize: 10 }}>{s.name} ({s.w}&quot;sq)</button>))}
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Fabric</label>
                                <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                                    {[["muslin", "Muslin"], ["gauze", "Double Gauze"], ["jersey", "Jersey"], ["bamboo", "Bamboo"], ["cotton", "Cotton"]].map(([k, l]) => (
                                        <button key={k} className={`btn btn-sm ${fabric === k ? "btn-primary" : "btn-ghost"}`} onClick={() => setFabric(k)} style={{ fontSize: 10 }}>{l}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="input-group"><label className="input-label">Qty</label>
                                <input type="number" className="input-field" value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))} min={1} style={{ width: 60 }} /></div>
                        </div>
                    </div>

                    <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(160,50%,40%)" }}>
                        <h2 className={styles.calcTitle}>Fabric Needed</h2>
                        <div style={{ padding: 14, background: "hsl(160,15%,95%)", borderRadius: 10, textAlign: "center", marginBottom: 12 }}>
                            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(160,40%,35%)" }}>Total</div>
                            <div style={{ fontSize: 36, fontWeight: 800, color: "hsl(160,50%,30%)" }}>{toFrac(calc.yd)}</div>
                            <div style={{ fontSize: 10 }}>yards for {qty} swaddle{qty > 1 ? "s" : ""}</div>
                        </div>
                        <div className={styles.resultDetails}>
                            <div className="result-row"><span>Cut size (+ shrinkage)</span><strong>{calc.cutW}&quot; × {calc.cutH}&quot;</strong></div>
                            <div className="result-row"><span>Swaddles per width</span><strong>{calc.perRow}</strong></div>
                        </div>
                    </div>

                    <div className="toolbar" style={{ marginBottom: 10 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`${qty} swaddle blankets (${spec.w}" sq, ${fabric}): ${toFrac(calc.yd)} yd.`)}><ClipboardCopy size={13} /> Copy</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                    </div>

                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowBulk(!showBulk)}>
                            📦 Bulk / Gift Set Planning <ChevronDown size={14} style={{ transform: showBulk ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showBulk && (
                            <div style={{ marginTop: 10, overflowX: "auto" }}>
                                <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
                                    <thead><tr><th style={{ padding: "5px 8px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left", fontSize: 11, fontWeight: 600 }}>Qty</th><th style={{ padding: "5px 8px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left", fontSize: 11, fontWeight: 600 }}>Fabric</th></tr></thead>
                                    <tbody>{[3, 4, 6, 10, 25].map(q => {
                                        const s = Math.ceil(q / Math.max(calc.perRow, 1));
                                        const y = Math.ceil(s * calc.cutH / 36 * 4) / 4;
                                        return <tr key={q}><td style={{ padding: "4px 8px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11 }}>{q}</td><td style={{ padding: "4px 8px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11 }}>{toFrac(y)} yd</td></tr>;
                                    })}</tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <section className="faq-section"><h2>FAQ</h2>
                        <div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (
                            <div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}>
                                <button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button>
                                <div className="faq-answer">{f.a}</div>
                            </div>
                        ))}</div>
                    </section>
                </div>
                <aside className="calculator-sidebar">
                    <div className="glass-card related-tools">
                        <h4>Related Tools</h4>
                        <a href="/baby-kids/receiving-blanket" className="related-tool-link">Receiving Blanket</a>
                        <a href="/baby-kids/baby-quilt" className="related-tool-link">Baby Quilt</a>
                        <a href="/baby-kids" className="related-tool-link">All Baby & Kids</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}