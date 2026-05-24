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

type BibStyle = "bandana" | "standard" | "feeding" | "pelican" | "smock";
const bibSpecs: { key: BibStyle; name: string; w: number; h: number; desc: string }[] = [
    { key: "bandana", name: "Bandana / Drool", w: 12, h: 9, desc: "Most popular, triangular" },
    { key: "standard", name: "Standard Bibette", w: 9, h: 10, desc: "Small round bib" },
    { key: "feeding", name: "Full Feeding", w: 12, h: 14, desc: "Large coverage" },
    { key: "pelican", name: "Pelican Pocket", w: 12, h: 15, desc: "With catch pocket" },
    { key: "smock", name: "Smock Bib", w: 16, h: 16, desc: "Covers sleeves" },
];

const faqItems = [
    { q: "How much fabric do I need for baby bibs?", a: "A single bandana bib uses about 12\" × 9\" of fabric (front + back). From 1 yard of 44\" fabric, you can cut about 12-14 bandana bibs. For a set of 5: roughly ⅝ yard each of front and back fabric." },
    { q: "What is the best fabric for baby bibs?", a: "Front: quilting cotton (cute prints). Back: terry cloth (most absorbent), fleece (water-resistant), or PUL (fully waterproof). For drool bibs, absorbency matters most — terry is best. For feeding bibs, waterproof PUL backing protects clothes." },
    { q: "How do I make a waterproof bib?", a: "Use PUL (polyurethane laminate) fabric as the backing. Sew with 3mm+ stitch length (too small perforates PUL). Use a Teflon foot or tissue paper between fabric and foot. Do NOT iron PUL with high heat — it melts. Cut with rotary cutter for clean edges." },
    { q: "What size should a baby bib be?", a: "Bandana bibs: 12\" × 9\" for 6-12 months. Standard bibs: 9\" × 10\". Feeding bibs: 12\" × 14\" for full coverage. Neck opening: 12-14\" circumference for 6-12 month babies. Size up slightly for toddlers." },
    { q: "How do I attach KAM snaps?", a: "You need a KAM snap press/plier tool. Mark snap positions, punch a hole with the awl, insert socket/stud through hole, press together with the tool. Use 2-3 snaps for adjustable neck sizing. Test security — snaps must not detach (choking hazard)." },
    { q: "How many bibs does a baby need?", a: "Drooling babies go through 6-10 bibs per day. For feeding: 5-8 bibs in rotation. A gift set of 5-6 bibs is very appreciated. Baby shower gift: make a set of 8 (5 bandana + 3 feeding) in coordinating fabrics." },
];

export default function Page() {
    const [bibStyle, setBibStyle] = useState<BibStyle>("bandana");
    const [qty, setQty] = useState(5);
    const [snapsPerBib, setSnapsPerBib] = useState(2);
    const [fabricWidth, setFabricWidth] = useState(44);
    const [showCraft, setShowCraft] = useState(false);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const spec = bibSpecs.find(b => b.key === bibStyle) || bibSpecs[0];

    const calc = useMemo(() => {
        const cutW = spec.w + 1; // SA
        const cutH = spec.h + 1;
        const perRow = Math.floor(fabricWidth / cutW);
        const strips = Math.ceil(qty / Math.max(perRow, 1));
        const frontYd = Math.ceil(strips * cutH / 36 * 4) / 4;
        const backYd = frontYd;
        const totalSnaps = qty * snapsPerBib;
        return { cutW, cutH, perRow, frontYd, backYd, totalSnaps };
    }, [spec, qty, snapsPerBib, fabricWidth]);

    const copyText = `${qty} ${spec.name} bibs: Front ${toFrac(calc.frontYd)} yd + Back ${toFrac(calc.backYd)} yd, ${calc.totalSnaps} KAM snaps.`;

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Baby & Kids", href: "/baby-kids" }, { label: "Bib Calculator" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Baby size={14} strokeWidth={1.5} /> Baby #391</span>
                        <h1>Baby Bib Calculator</h1>
                        <p>Calculate fabric and hardware for bandana, feeding, pelican, and smock bibs. Includes snap counts, bulk production, and craft fair planning.</p>
                    </div>

                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>① Bib Style</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 5 }}>
                            {bibSpecs.map(b => (
                                <button key={b.key} className={`btn btn-sm ${bibStyle === b.key ? "btn-primary" : "btn-ghost"}`} onClick={() => setBibStyle(b.key)} style={{ fontSize: 10, textAlign: "left", padding: "5px 7px", height: "auto" }}>
                                    <strong>{b.name}</strong><br /><span style={{ fontSize: 8, opacity: 0.7 }}>{b.w}&quot;×{b.h}&quot; — {b.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>② Quantity &amp; Hardware</h2>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Number of bibs</label>
                                <input type="number" className="input-field" value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))} min={1} style={{ width: 70 }} /></div>
                            <div className="input-group"><label className="input-label">Snaps per bib</label>
                                <div style={{ display: "flex", gap: 3 }}>
                                    {[1, 2, 3].map(n => (<button key={n} className={`btn btn-sm ${snapsPerBib === n ? "btn-primary" : "btn-ghost"}`} onClick={() => setSnapsPerBib(n)} style={{ fontSize: 10 }}>{n}</button>))}
                                </div>
                            </div>
                            <div className="input-group"><label className="input-label">Fabric width</label>
                                <div style={{ display: "flex", gap: 3 }}>
                                    {[44, 54, 60].map(w => (<button key={w} className={`btn btn-sm ${fabricWidth === w ? "btn-primary" : "btn-ghost"}`} onClick={() => setFabricWidth(w)} style={{ fontSize: 10 }}>{w}&quot;</button>))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(340,50%,45%)" }}>
                        <h2 className={styles.calcTitle}>Fabric &amp; Hardware Needs</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
                            <div style={{ padding: 12, background: "hsl(340,15%,95%)", borderRadius: 10, textAlign: "center" }}>
                                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(340,40%,35%)" }}>Front Fabric</div>
                                <div style={{ fontSize: 28, fontWeight: 800, color: "hsl(340,50%,30%)" }}>{toFrac(calc.frontYd)}</div>
                                <div style={{ fontSize: 10 }}>yards</div>
                            </div>
                            <div style={{ padding: 12, background: "hsl(200,15%,95%)", borderRadius: 10, textAlign: "center" }}>
                                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(200,40%,35%)" }}>Back Fabric</div>
                                <div style={{ fontSize: 28, fontWeight: 800, color: "hsl(200,50%,30%)" }}>{toFrac(calc.backYd)}</div>
                                <div style={{ fontSize: 10 }}>yards</div>
                            </div>
                            <div style={{ padding: 12, background: "hsl(40,15%,95%)", borderRadius: 10, textAlign: "center" }}>
                                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(40,40%,35%)" }}>KAM Snaps</div>
                                <div style={{ fontSize: 28, fontWeight: 800, color: "hsl(40,50%,30%)" }}>{calc.totalSnaps}</div>
                                <div style={{ fontSize: 10 }}>sets</div>
                            </div>
                        </div>
                        <div className={styles.resultDetails}>
                            <div className="result-row"><span>Cut size per bib</span><strong>{calc.cutW}&quot; × {calc.cutH}&quot;</strong></div>
                            <div className="result-row"><span>Bibs per fabric width</span><strong>{calc.perRow}</strong></div>
                        </div>
                    </div>

                    <div className="toolbar" style={{ marginBottom: 10 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} /> Copy</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                    </div>

                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowCraft(!showCraft)}>
                            🎪 Craft Fair / Bulk Planning
                            <ChevronDown size={14} style={{ transform: showCraft ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showCraft && (
                            <div style={{ marginTop: 10, overflowX: "auto" }}>
                                <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
                                    <thead><tr><th style={{ padding: "5px 8px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left", fontSize: 11, fontWeight: 600 }}>Qty</th><th style={{ padding: "5px 8px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left", fontSize: 11, fontWeight: 600 }}>Front</th><th style={{ padding: "5px 8px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left", fontSize: 11, fontWeight: 600 }}>Back</th><th style={{ padding: "5px 8px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left", fontSize: 11, fontWeight: 600 }}>Snaps</th></tr></thead>
                                    <tbody>{[10, 25, 50, 100].map(q => {
                                        const s = Math.ceil(q / Math.max(calc.perRow, 1));
                                        const y = Math.ceil(s * (spec.h + 1) / 36 * 4) / 4;
                                        return <tr key={q}><td style={{ padding: "4px 8px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11 }}>{q}</td><td style={{ padding: "4px 8px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11 }}>{toFrac(y)} yd</td><td style={{ padding: "4px 8px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11 }}>{toFrac(y)} yd</td><td style={{ padding: "4px 8px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11 }}>{q * snapsPerBib}</td></tr>;
                                    })}</tbody>
                                </table>
                            </div>
                        )}
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
                    <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Shopping List</h4>
                        <div style={{ fontSize: 12, lineHeight: 2.2 }}>
                            <div>🎨 Front: <strong>{toFrac(calc.frontYd)} yd</strong></div>
                            <div>🧵 Back: <strong>{toFrac(calc.backYd)} yd</strong></div>
                            <div>🔘 Snaps: <strong>{calc.totalSnaps} sets</strong></div>
                            <div>🔧 Snap setter tool</div>
                        </div>
                    </div>
                    <div className="glass-card related-tools">
                        <h4>Related Tools</h4>
                        <a href="/baby-kids/burp-cloth" className="related-tool-link">Burp Cloth Calculator</a>
                        <a href="/baby-kids/receiving-blanket" className="related-tool-link">Receiving Blanket</a>
                        <a href="/baby-kids/baby-clothing-yardage" className="related-tool-link">Baby Clothing Yardage</a>
                        <a href="/baby-kids" className="related-tool-link">All Baby & Kids</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}