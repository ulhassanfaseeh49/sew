"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Baby, ClipboardCopy, Printer } from "lucide-react";

function toFrac(v: number): string {
    if (v <= 0) return "0"; const w = Math.floor(v); const f = v - w;
    const map: [number, string][] = [[0, ""], [0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
    let best = map[0], bd = 1;
    for (const [n, s] of map) { const d = Math.abs(f - n); if (d < bd) { bd = d; best = [n, s]; } }
    if (Math.abs(f - 1) < bd) return `${w + 1}`; if (!best[1]) return w > 0 ? `${w}` : "0";
    return w > 0 ? `${w} ${best[1]}` : `${best[1]}`;
}

type DSize = "nb" | "s" | "m" | "l" | "xl";
const dSizes: { key: DSize; name: string; waist: number; rise: number; leg: number }[] = [
    { key: "nb", name: "Newborn (6-12 lbs)", waist: 13, rise: 13, leg: 8 },
    { key: "s", name: "Small (8-15 lbs)", waist: 15, rise: 14, leg: 9 },
    { key: "m", name: "Medium (15-25 lbs)", waist: 17, rise: 16, leg: 10 },
    { key: "l", name: "Large (25-35 lbs)", waist: 19, rise: 17, leg: 11 },
    { key: "xl", name: "XL (35+ lbs)", waist: 21, rise: 18, leg: 12 },
];

const faqItems = [
    { q: "How much PUL fabric for a diaper cover?", a: "One cover: about ⅓ yard of PUL. A set of 6 covers: ~1½ yards. PUL is 54-60\" wide, so you can fit 2 covers across most widths." },
    { q: "What is PUL fabric?", a: "Polyurethane Laminate — a waterproof fabric with a thin plastic coating on one side. It's stretchy, breathable, and the gold standard for cloth diaper covers. DO NOT iron PUL — it will melt." },
    { q: "How much elastic for diaper covers?", a: "Typically ⅜\" braided elastic: 6-8\" for each leg opening (×2) and 8-12\" for the waist. That's about 20-28\" total elastic per cover." },
    { q: "Can I use FOE instead of elastic?", a: "Yes! Fold-over elastic (FOE) gives a soft, finished edge in one step. You need the perimeter of leg openings (2× leg elastic length) plus waist. About 36-48\" of FOE per cover." },
];

export default function Page() {
    const [size, setSize] = useState<DSize>("m");
    const [qty, setQty] = useState(6);
    const [useSnaps, setUseSnaps] = useState(true);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const spec = dSizes.find(s => s.key === size) || dSizes[2];

    const calc = useMemo(() => {
        const cutW = spec.waist + 4; // SA + overlap
        const cutH = spec.rise + 3;
        const perRow = Math.floor(58 / cutW); // PUL is typically 58"
        const strips = Math.ceil(qty / Math.max(perRow, 1));
        const pulYd = Math.ceil(strips * cutH / 36 * 4) / 4;
        const legElastic = spec.leg * 0.75; // elastic is shorter than opening
        const waistElastic = spec.waist * 0.85;
        const elasticPerCover = legElastic * 2 + waistElastic;
        const totalElastic = Math.ceil(elasticPerCover * qty);
        const snaps = useSnaps ? qty * 4 : 0;
        return { cutW, cutH, pulYd, elasticPerCover, totalElastic, snaps };
    }, [spec, qty, useSnaps]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Baby & Kids", href: "/baby-kids" }, { label: "Diaper Cover" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Baby size={14} strokeWidth={1.5} /> Baby #393</span>
                        <h1>Diaper / Nappy Cover Calculator</h1>
                        <p>Calculate PUL fabric and elastic for cloth diaper covers by size. Includes snap and FOE estimates.</p>
                    </div>

                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Size &amp; Quantity</h2>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                            {dSizes.map(s => (<button key={s.key} className={`btn btn-sm ${size === s.key ? "btn-primary" : "btn-ghost"}`} onClick={() => setSize(s.key)} style={{ fontSize: 10 }}>{s.name}</button>))}
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Quantity</label>
                                <input type="number" className="input-field" value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))} min={1} style={{ width: 60 }} /></div>
                            <div className="input-group"><label className="input-label">Closure</label>
                                <div style={{ display: "flex", gap: 3 }}>
                                    <button className={`btn btn-sm ${useSnaps ? "btn-primary" : "btn-ghost"}`} onClick={() => setUseSnaps(true)} style={{ fontSize: 10 }}>Snaps</button>
                                    <button className={`btn btn-sm ${!useSnaps ? "btn-primary" : "btn-ghost"}`} onClick={() => setUseSnaps(false)} style={{ fontSize: 10 }}>Hook &amp; Loop</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(200,50%,45%)" }}>
                        <h2 className={styles.calcTitle}>Materials Needed</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
                            <div style={{ padding: 12, background: "hsl(200,15%,95%)", borderRadius: 10, textAlign: "center" }}>
                                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(200,40%,35%)" }}>PUL Fabric</div>
                                <div style={{ fontSize: 28, fontWeight: 800, color: "hsl(200,50%,30%)" }}>{toFrac(calc.pulYd)}</div>
                                <div style={{ fontSize: 10 }}>yards</div>
                            </div>
                            <div style={{ padding: 12, background: "hsl(160,15%,95%)", borderRadius: 10, textAlign: "center" }}>
                                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(160,40%,35%)" }}>Elastic (⅜&quot;)</div>
                                <div style={{ fontSize: 28, fontWeight: 800, color: "hsl(160,50%,30%)" }}>{Math.ceil(calc.totalElastic)}&quot;</div>
                                <div style={{ fontSize: 10 }}>{toFrac(Math.ceil(calc.totalElastic / 36 * 4) / 4)} yards</div>
                            </div>
                            <div style={{ padding: 12, background: "hsl(40,15%,95%)", borderRadius: 10, textAlign: "center" }}>
                                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(40,40%,35%)" }}>{useSnaps ? "KAM Snaps" : "Hook & Loop"}</div>
                                <div style={{ fontSize: 28, fontWeight: 800, color: "hsl(40,50%,30%)" }}>{useSnaps ? calc.snaps : qty * 2}</div>
                                <div style={{ fontSize: 10 }}>{useSnaps ? "sets" : "strips"}</div>
                            </div>
                        </div>
                        <div className={styles.resultDetails}>
                            <div className="result-row"><span>Cut size per cover</span><strong>{calc.cutW}&quot; × {calc.cutH}&quot;</strong></div>
                            <div className="result-row"><span>Elastic per cover</span><strong>{calc.elasticPerCover.toFixed(0)}&quot;</strong></div>
                        </div>
                        <div style={{ fontSize: 10, color: "hsl(0,60%,45%)", marginTop: 6 }}>⚠️ Do NOT iron PUL — it will melt. Use 3mm+ stitch length. Use Teflon foot.</div>
                    </div>

                    <div className="toolbar" style={{ marginBottom: 10 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`${qty} diaper covers (${spec.name}): ${toFrac(calc.pulYd)} yd PUL, ${calc.totalElastic}" elastic, ${calc.snaps} snaps.`)}><ClipboardCopy size={13} /> Copy</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                    </div>

                    <section className="faq-section"><h2>Frequently Asked Questions</h2>
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
                        <a href="/elastic/elastic-calculator" className="related-tool-link">Elastic Calculator</a>
                        <a href="/baby-kids" className="related-tool-link">All Baby & Kids</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}