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

type BabySize = "preemie" | "nb" | "3m" | "6m" | "9m" | "12m" | "18m" | "24m";
const sizeLabels: Record<BabySize, string> = { preemie: "Preemie", nb: "Newborn (0-3m)", "3m": "3 months", "6m": "6 months", "9m": "9 months", "12m": "12 months", "18m": "18 months", "24m": "24 months" };
type Garment = "onesie-ss" | "onesie-ls" | "romper-s" | "romper-l" | "sleeper" | "top" | "pants" | "dress" | "hat" | "cardigan";
const garments: { key: Garment; name: string; yd: Record<BabySize, number>; fabric: string }[] = [
    { key: "onesie-ss", name: "Onesie (short sleeve)", fabric: "Jersey knit", yd: { preemie: .25, nb: .33, "3m": .375, "6m": .5, "9m": .5, "12m": .625, "18m": .625, "24m": .75 } },
    { key: "onesie-ls", name: "Onesie (long sleeve)", fabric: "Jersey knit", yd: { preemie: .33, nb: .5, "3m": .5, "6m": .625, "9m": .625, "12m": .75, "18m": .75, "24m": .875 } },
    { key: "romper-s", name: "Romper (short)", fabric: "Jersey knit", yd: { preemie: .33, nb: .5, "3m": .5, "6m": .625, "9m": .75, "12m": .75, "18m": .875, "24m": 1 } },
    { key: "romper-l", name: "Romper (long)", fabric: "Jersey knit", yd: { preemie: .5, nb: .625, "3m": .75, "6m": .875, "9m": 1, "12m": 1, "18m": 1.125, "24m": 1.25 } },
    { key: "sleeper", name: "Sleeper / Footie", fabric: "Jersey knit", yd: { preemie: .5, nb: .75, "3m": .875, "6m": 1, "9m": 1.125, "12m": 1.25, "18m": 1.375, "24m": 1.5 } },
    { key: "top", name: "Baby Top", fabric: "Jersey knit", yd: { preemie: .25, nb: .25, "3m": .33, "6m": .375, "9m": .375, "12m": .5, "18m": .5, "24m": .625 } },
    { key: "pants", name: "Pants / Leggings", fabric: "Jersey knit", yd: { preemie: .25, nb: .25, "3m": .33, "6m": .375, "9m": .375, "12m": .5, "18m": .5, "24m": .625 } },
    { key: "dress", name: "Baby Dress", fabric: "Cotton/knit", yd: { preemie: .375, nb: .5, "3m": .625, "6m": .75, "9m": .875, "12m": 1, "18m": 1.125, "24m": 1.25 } },
    { key: "hat", name: "Hat / Bonnet", fabric: "Rib knit", yd: { preemie: .125, nb: .125, "3m": .125, "6m": .125, "9m": .125, "12m": .25, "18m": .25, "24m": .25 } },
    { key: "cardigan", name: "Cardigan", fabric: "Knit/woven", yd: { preemie: .375, nb: .5, "3m": .625, "6m": .75, "9m": .875, "12m": 1, "18m": 1, "24m": 1.25 } },
];

const faqItems = [
    { q: "How much fabric for a baby onesie?", a: "Short-sleeve onesie: ¼–½ yard depending on size (preemie to 12 months). Long-sleeve: ⅓–¾ yard. Use jersey knit with minimum 50% stretch. Add ⅛ yard rib knit for neckband and cuffs." },
    { q: "What fabric is best for baby clothing?", a: "Jersey knit (cotton or cotton/spandex blend) is the standard — soft, stretchy, breathable. Interlock knit is thicker and great for babies. Bamboo jersey is ultra-soft. Use ballpoint needles for knits." },
    { q: "How many snaps for a baby onesie?", a: "Typically 3 snaps at the crotch (KAM size 20). Some patterns add 2-3 shoulder snaps for larger head openings. Use KAM plastic snaps — they're safe and easy to apply with a snap press." },
    { q: "Should I pre-wash baby clothing fabric?", a: "YES — always pre-wash all fabric for baby items. Remove chemicals, sizing, and loose dye. Wash in hot water to pre-shrink. Use baby-safe detergent. Knits may shrink 3-8%." },
    { q: "What is a layette set?", a: "A coordinated set of basics for a newborn: typically 3 onesies, 2-3 pants, 2 hats, and sometimes a receiving blanket. From the same fabric collection, about 2½–3 yards of jersey knit for a basic 7-piece set." },
    { q: "How do I sew stretch fabric for babies?", a: "Use a serger/overlocker for professional results. Or use a stretch/lightning bolt stitch on a regular machine. Ballpoint needles prevent holes in knit. Use polyester thread (slight stretch). Walk slowly — knits can stretch under the foot." },
];

export default function Page() {
    const [size, setSize] = useState<BabySize>("6m");
    const [selected, setSelected] = useState<Set<Garment>>(new Set(["onesie-ss", "pants", "hat"]));
    const [qtyMap, setQtyMap] = useState<Record<string, number>>({});
    const [showNotions, setShowNotions] = useState(false);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const toggle = (g: Garment) => { const s = new Set(selected); s.has(g) ? s.delete(g) : s.add(g); setSelected(s); };
    const getQty = (g: Garment) => qtyMap[g] || 1;
    const setQty = (g: Garment, n: number) => setQtyMap({ ...qtyMap, [g]: n });

    const calc = useMemo(() => {
        const items = garments.filter(g => selected.has(g.key)).map(g => {
            const yd = g.yd[size] * getQty(g.key);
            return { ...g, qty: getQty(g.key), yd: Math.ceil(yd * 8) / 8 };
        });
        const totalYd = items.reduce((s, i) => s + i.yd, 0);
        const totalSnaps = items.filter(i => i.key.startsWith("onesie") || i.key.startsWith("romper")).reduce((s, i) => s + i.qty * 3, 0);
        return { items, totalYd: Math.ceil(totalYd * 4) / 4, totalSnaps };
    }, [size, selected, qtyMap]);

    const copyText = calc.items.map(i => `${i.qty}× ${i.name}: ${toFrac(i.yd)} yd`).join(", ") + `. Total: ${toFrac(calc.totalYd)} yd.`;

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Baby & Kids", href: "/baby-kids" }, { label: "Baby Clothing Yardage" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Baby size={14} strokeWidth={1.5} /> Baby #388</span>
                        <h1>Baby Clothing Yardage Calculator</h1>
                        <p>Estimate fabric for baby garments by type and size — from preemie through 24 months. Build a layette set with coordinated yardage.</p>
                    </div>

                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>① Baby Size</h2>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                            {(Object.keys(sizeLabels) as BabySize[]).map(s => (
                                <button key={s} className={`btn btn-sm ${size === s ? "btn-primary" : "btn-ghost"}`} onClick={() => setSize(s)} style={{ fontSize: 10 }}>{sizeLabels[s]}</button>
                            ))}
                        </div>
                    </div>

                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>② Select Garments</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 5 }}>
                            {garments.map(g => (
                                <button key={g.key} className={`btn btn-sm ${selected.has(g.key) ? "btn-primary" : "btn-ghost"}`} onClick={() => toggle(g.key)} style={{ fontSize: 10, textAlign: "left", padding: "5px 7px", height: "auto" }}>
                                    <strong>{g.name}</strong><br /><span style={{ fontSize: 8, opacity: 0.7 }}>{g.fabric} — {toFrac(g.yd[size])} yd</span>
                                </button>
                            ))}
                        </div>
                        {selected.size > 0 && (
                            <div style={{ marginTop: 8 }}>
                                <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Quantities:</div>
                                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                    {garments.filter(g => selected.has(g.key)).map(g => (
                                        <div key={g.key} style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10 }}>
                                            <span>{g.name}:</span>
                                            <input type="number" className="input-field" value={getQty(g.key)} onChange={e => setQty(g.key, Math.max(1, parseInt(e.target.value) || 1))} min={1} style={{ width: 40, padding: "2px 4px", fontSize: 10 }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {calc.items.length > 0 && (
                        <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(280,50%,45%)" }}>
                            <h2 className={styles.calcTitle}>Yardage Results</h2>
                            <div style={{ padding: 14, background: "hsl(280,15%,95%)", borderRadius: 10, textAlign: "center", marginBottom: 12 }}>
                                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(280,40%,35%)" }}>Total Fabric</div>
                                <div style={{ fontSize: 36, fontWeight: 800, color: "hsl(280,50%,30%)" }}>{toFrac(calc.totalYd)}</div>
                                <div style={{ fontSize: 10 }}>yards (knit fabric)</div>
                            </div>
                            <div className={styles.resultDetails}>
                                {calc.items.map(i => (
                                    <div key={i.key} className="result-row"><span>{i.qty}× {i.name}</span><strong>{toFrac(i.yd)} yd</strong></div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="toolbar" style={{ marginBottom: 10 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} /> Copy</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                    </div>

                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowNotions(!showNotions)}>
                            🔧 Notions &amp; Hardware
                            <ChevronDown size={14} style={{ transform: showNotions ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showNotions && (
                            <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9 }}>
                                <div className={styles.resultDetails}>
                                    <div className="result-row"><span>KAM snaps (size 20)</span><strong>{calc.totalSnaps} sets</strong></div>
                                    <div className="result-row"><span>Rib knit (neckbands/cuffs)</span><strong>⅛–¼ yd</strong></div>
                                    <div className="result-row"><span>FOE for leg openings</span><strong>~{calc.items.filter(i => i.key.startsWith("onesie")).reduce((s, i) => s + i.qty, 0) * 18}&quot;</strong></div>
                                </div>
                                <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 4 }}>Use ballpoint needles for knit fabrics. Stretch thread (polyester) recommended.</div>
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
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Quick Summary</h4>
                        <div style={{ fontSize: 12, lineHeight: 2.2, color: "var(--color-text-secondary)" }}>
                            {calc.items.map(i => <div key={i.key}>{i.qty}× {i.name}: <strong>{toFrac(i.yd)} yd</strong></div>)}
                            <div style={{ borderTop: "1px solid hsl(0,0%,90%)", paddingTop: 4, marginTop: 4, fontSize: 14, fontWeight: 800, color: "hsl(280,50%,35%)" }}>Total: {toFrac(calc.totalYd)} yd</div>
                        </div>
                    </div>
                    <div className="glass-card related-tools">
                        <h4>Related Tools</h4>
                        <a href="/baby-kids/size-converter" className="related-tool-link">Size Converter</a>
                        <a href="/baby-kids/growth-room" className="related-tool-link">Growth Room</a>
                        <a href="/elastic/elastic-calculator" className="related-tool-link">Elastic Calculator</a>
                        <a href="/baby-kids" className="related-tool-link">All Baby & Kids</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}