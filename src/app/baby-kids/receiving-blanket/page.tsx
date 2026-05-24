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

type BlanketSize = "swaddle" | "standard" | "large" | "rectangle" | "crib" | "custom";
const sizes: { key: BlanketSize; name: string; w: number; h: number }[] = [
    { key: "swaddle", name: "Swaddle", w: 47, h: 47 },
    { key: "standard", name: "Standard", w: 30, h: 30 },
    { key: "large", name: "Large", w: 36, h: 36 },
    { key: "rectangle", name: "Rectangle", w: 30, h: 40 },
    { key: "crib", name: "Crib", w: 36, h: 52 },
    { key: "custom", name: "Custom", w: 30, h: 30 },
];

type Layer = "single" | "double" | "quilted";
type Edge = "serged" | "hem" | "rolled" | "bias" | "turned";
const edgeAllow: Record<Edge, number> = { serged: 0, hem: 1, rolled: 0.25, bias: 0.25, turned: 0.5 };

const faqItems = [
    { q: "What size should a receiving blanket be?", a: "Standard receiving blankets are 30\" × 30\". Muslin swaddles are 47\" × 47\". Large format is 36\" × 36\". For everyday use, standard size works well. For swaddling, the larger 47\" size gives much better wrapping ability." },
    { q: "How much fabric do I need for a receiving blanket?", a: "For a 30\" × 30\" single-layer blanket: about 1 yard of 44\" fabric. For double-layer, double that. For a 47\" muslin swaddle, you need 1⅓ yards. Add 10-15% if using flannel due to significant shrinkage." },
    { q: "What is the best fabric for receiving blankets?", a: "Cotton muslin is classic and softens with washing. Cotton flannel is warm but shrinks 10-15%. Double gauze is soft and breathable. All must be pre-washed for baby items. Choose OEKO-TEX certified when possible." },
    { q: "Should I pre-wash fabric for baby blankets?", a: "Absolutely yes. Pre-wash removes chemicals, sizing, and excess dye. Flannel MUST be pre-washed in hot water (shrinks 10-15%). Wash 2-3 times to complete shrinkage. Use gentle, baby-safe detergent." },
    { q: "How do I finish the edges of a receiving blanket?", a: "Serged/overlocked edges are cleanest. Double-fold hem for a clean look. Rolled hem for lightweight muslin. Bias binding for a decorative finish. Turned-and-topstitched for double-layer blankets (no visible edge finish needed)." },
    { q: "How many receiving blankets does a newborn need?", a: "6-10 is typical — babies go through them quickly. They're used for swaddling, burping, nursing cover, changing pad, and general cleanup. Making a set of 5-6 is a popular baby shower gift." },
    { q: "Can I use minky fabric for a receiving blanket?", a: "Yes, on one side paired with cotton on the other. Minky is super soft but slippery to sew. Use lots of clips (not pins), reduce presser foot pressure, and sew slowly. Avoid minky against baby's face during sleep as it retains heat." },
    { q: "How do I make a double-layer receiving blanket?", a: "Cut two fabric pieces to the same size plus ½\" seam allowance. Place right sides together, sew around the edge leaving a 4\" turning gap. Turn right side out, press, and topstitch closed. This creates a professional, finished blanket." },
];

export default function Page() {
    const [sizeKey, setSizeKey] = useState<BlanketSize>("standard");
    const [customW, setCustomW] = useState(30);
    const [customH, setCustomH] = useState(30);
    const [layers, setLayers] = useState<Layer>("double");
    const [edge, setEdge] = useState<Edge>("turned");
    const [fabricType, setFabricType] = useState("cotton");
    const [qty, setQty] = useState(3);
    const [fabricWidth, setFabricWidth] = useState(44);

    const [showBulk, setShowBulk] = useState(false);
    const [showEdu, setShowEdu] = useState(false);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const calc = useMemo(() => {
        const preset = sizes.find(s => s.key === sizeKey) || sizes[1];
        const finW = sizeKey === "custom" ? customW : preset.w;
        const finH = sizeKey === "custom" ? customH : preset.h;

        const edgeAdd = edgeAllow[edge] * 2; // both sides
        const cutW = finW + edgeAdd + (layers === "quilted" ? 1 : 0);
        const cutH = finH + edgeAdd + (layers === "quilted" ? 1 : 0);

        // Shrinkage added if flannel
        const shrink = fabricType === "flannel" ? 1.12 : 1.0;
        const adjCutW = Math.ceil(cutW * shrink);
        const adjCutH = Math.ceil(cutH * shrink);

        // How many blankets fit across fabric width
        const acrossW = Math.floor(fabricWidth / adjCutW);
        const acrossH = Math.floor(fabricWidth / adjCutH);
        // Choose most efficient orientation
        const bestAcross = Math.max(acrossW, acrossH);
        const bestLen = bestAcross === acrossW ? adjCutH : adjCutW;

        const strips = Math.ceil(qty / Math.max(bestAcross, 1));
        const layerMulti = layers === "single" ? 1 : layers === "double" ? 2 : 3;
        const totalLen = strips * bestLen * layerMulti;
        const yd = Math.ceil((totalLen / 36) * 4) / 4;

        // Bias binding
        const perim = (finW + finH) * 2 + 8;
        const biasYd = edge === "bias" ? Math.ceil((perim * qty / 42) * 2.5 / 36 * 4) / 4 : 0; // 2.5" strips

        return { finW, finH, cutW: adjCutW, cutH: adjCutH, yd, biasYd, bestAcross, bestLen, layerMulti, perim };
    }, [sizeKey, customW, customH, layers, edge, fabricType, qty, fabricWidth]);

    const copyText = `${qty} receiving blankets (${calc.finW}"×${calc.finH}", ${layers} layer, ${edge} edge): ${toFrac(calc.yd)} yd${calc.biasYd > 0 ? ` + ${toFrac(calc.biasYd)} yd bias` : ""}.`;

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Baby & Kids", href: "/baby-kids" }, { label: "Receiving Blanket" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Baby size={14} strokeWidth={1.5} /> Baby #387</span>
                        <h1>Receiving Blanket Calculator</h1>
                        <p>Calculate fabric for receiving blankets — swaddle, standard, and custom sizes with single, double, or quilted layers and multiple edge finishes.</p>
                    </div>

                    {/* ① SIZE */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>① Blanket Size</h2>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                            {sizes.map(s => (
                                <button key={s.key} className={`btn btn-sm ${sizeKey === s.key ? "btn-primary" : "btn-ghost"}`} onClick={() => setSizeKey(s.key)} style={{ fontSize: 10 }}>{s.name} ({s.w}&quot;×{s.h}&quot;)</button>
                            ))}
                        </div>
                        {sizeKey === "custom" && (
                            <div className="calculator-form-row" style={{ marginTop: 6 }}>
                                <div className="input-group"><label className="input-label">Width</label><input type="number" className="input-field" value={customW} onChange={e => setCustomW(Math.max(10, parseInt(e.target.value) || 30))} /></div>
                                <div className="input-group"><label className="input-label">Height</label><input type="number" className="input-field" value={customH} onChange={e => setCustomH(Math.max(10, parseInt(e.target.value) || 30))} /></div>
                            </div>
                        )}
                    </div>

                    {/* ② CONSTRUCTION */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>② Layers &amp; Edge Finish</h2>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Layers</label>
                                <div style={{ display: "flex", gap: 3 }}>
                                    {([["single", "Single"], ["double", "Double"], ["quilted", "Quilted"]] as const).map(([k, l]) => (
                                        <button key={k} className={`btn btn-sm ${layers === k ? "btn-primary" : "btn-ghost"}`} onClick={() => { setLayers(k); if (k !== "single") setEdge("turned"); }} style={{ fontSize: 10 }}>{l}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="input-group"><label className="input-label">Edge finish</label>
                                <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                                    {([["serged", "Serged"], ["hem", "Hemmed"], ["rolled", "Rolled"], ["bias", "Bias bound"], ["turned", "Turned"]] as const).map(([k, l]) => (
                                        <button key={k} className={`btn btn-sm ${edge === k ? "btn-primary" : "btn-ghost"}`} onClick={() => setEdge(k)} style={{ fontSize: 10 }}>{l}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ③ FABRIC & QTY */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>③ Fabric &amp; Quantity</h2>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Fabric type</label>
                                <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                                    {[["cotton", "Cotton"], ["flannel", "Flannel (+12%)"], ["muslin", "Muslin"], ["minky", "Minky"]].map(([k, l]) => (
                                        <button key={k} className={`btn btn-sm ${fabricType === k ? "btn-primary" : "btn-ghost"}`} onClick={() => setFabricType(k)} style={{ fontSize: 10 }}>{l}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="input-group"><label className="input-label">Fabric width</label>
                                <div style={{ display: "flex", gap: 3 }}>
                                    {[44, 54, 60].map(w => (<button key={w} className={`btn btn-sm ${fabricWidth === w ? "btn-primary" : "btn-ghost"}`} onClick={() => setFabricWidth(w)} style={{ fontSize: 10 }}>{w}&quot;</button>))}
                                </div>
                            </div>
                            <div className="input-group"><label className="input-label">Quantity</label>
                                <input type="number" className="input-field" value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))} min={1} style={{ width: 60 }} /></div>
                        </div>
                        {fabricType === "flannel" && (
                            <div style={{ fontSize: 10, color: "hsl(40,70%,35%)", marginTop: 4 }}>⚠️ Flannel shrinks 10-15%. Extra added automatically. Pre-wash in hot water before cutting.</div>
                        )}
                    </div>

                    {/* RESULT */}
                    <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(280,50%,45%)" }}>
                        <h2 className={styles.calcTitle}>Your Fabric Needs</h2>
                        <div style={{ display: "grid", gridTemplateColumns: calc.biasYd > 0 ? "1fr 1fr" : "1fr", gap: 10, marginBottom: 12 }}>
                            <div style={{ padding: 14, background: "hsl(280,15%,95%)", borderRadius: 10, textAlign: "center" }}>
                                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(280,40%,35%)" }}>Main Fabric</div>
                                <div style={{ fontSize: 32, fontWeight: 800, color: "hsl(280,50%,30%)" }}>{toFrac(calc.yd)}</div>
                                <div style={{ fontSize: 10 }}>yards for {qty} blanket{qty > 1 ? "s" : ""}</div>
                            </div>
                            {calc.biasYd > 0 && (
                                <div style={{ padding: 14, background: "hsl(160,15%,95%)", borderRadius: 10, textAlign: "center" }}>
                                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(160,40%,35%)" }}>Bias Binding</div>
                                    <div style={{ fontSize: 32, fontWeight: 800, color: "hsl(160,50%,30%)" }}>{toFrac(calc.biasYd)}</div>
                                    <div style={{ fontSize: 10 }}>yards</div>
                                </div>
                            )}
                        </div>
                        <div className={styles.resultDetails}>
                            <div className="result-row"><span>Finished size</span><strong>{calc.finW}&quot; × {calc.finH}&quot;</strong></div>
                            <div className="result-row"><span>Cut size per blanket</span><strong>{calc.cutW}&quot; × {calc.cutH}&quot;</strong></div>
                            <div className="result-row"><span>Layers × {calc.layerMulti}</span><strong>{calc.layerMulti === 1 ? "Single" : calc.layerMulti === 2 ? "Double" : "Quilted (3 layer)"}</strong></div>
                            <div className="result-row"><span>Blankets per fabric width</span><strong>{calc.bestAcross}</strong></div>
                        </div>
                    </div>

                    <div className="toolbar" style={{ marginBottom: 10 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} /> Copy</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                    </div>

                    {/* BULK TABLE */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowBulk(!showBulk)}>
                            📦 Bulk / Donation Planning
                            <ChevronDown size={14} style={{ transform: showBulk ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showBulk && (
                            <div style={{ marginTop: 10, overflowX: "auto" }}>
                                <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
                                    <thead><tr><th style={{ padding: "5px 8px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left", fontSize: 11, fontWeight: 600 }}>Qty</th><th style={{ padding: "5px 8px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left", fontSize: 11, fontWeight: 600 }}>Fabric ({layers})</th></tr></thead>
                                    <tbody>{[5, 10, 25, 50].map(q => {
                                        const s = Math.ceil(q / Math.max(calc.bestAcross, 1));
                                        const y = Math.ceil(s * calc.bestLen * calc.layerMulti / 36 * 4) / 4;
                                        return <tr key={q}><td style={{ padding: "4px 8px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11 }}>{q}</td><td style={{ padding: "4px 8px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11 }}>{toFrac(y)} yd</td></tr>;
                                    })}</tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* EDUCATIONAL */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowEdu(!showEdu)}>
                            📚 Fabric Guide for Baby Blankets
                            <ChevronDown size={14} style={{ transform: showEdu ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showEdu && (
                            <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9, color: "var(--color-text-secondary)" }}>
                                <p><strong>Cotton muslin:</strong> Classic choice. Lightweight, breathable, softens beautifully with each wash. Best for swaddle-style blankets. Wash 3+ times before gifting.</p>
                                <p><strong>Flannel:</strong> Warm and cozy. Shrinks 10-15% — always pre-wash in hot water. Great for winter babies. Double-layer flannel is very popular.</p>
                                <p><strong>Minky:</strong> Ultra-soft. Use on ONE side only, pair with cotton. Slippery to sew — use clips, not pins. Walk slowly. Reduce presser foot pressure.</p>
                                <p><strong>Double gauze:</strong> Two layers of gauze woven together. Breathable, soft, and lightweight. Perfect for warm-weather babies.</p>
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
                            <div>Size: <strong>{calc.finW}&quot;×{calc.finH}&quot;</strong></div>
                            <div>Layers: <strong>{layers}</strong></div>
                            <div>Edge: <strong>{edge}</strong></div>
                            <div>Qty: <strong>{qty}</strong></div>
                            <div style={{ marginTop: 6, fontSize: 14, fontWeight: 800, color: "hsl(280,50%,35%)" }}>Total: {toFrac(calc.yd)} yd</div>
                        </div>
                    </div>
                    <div className="glass-card related-tools">
                        <h4>Related Tools</h4>
                        <a href="/baby-kids/baby-quilt" className="related-tool-link">Baby Quilt Guide</a>
                        <a href="/baby-kids/swaddle" className="related-tool-link">Swaddle Calculator</a>
                        <a href="/baby-kids/burp-cloth" className="related-tool-link">Burp Cloth Calculator</a>
                        <a href="/shrinkage/pre-wash-shrinkage" className="related-tool-link">Shrinkage Calculator</a>
                        <a href="/baby-kids" className="related-tool-link">All Baby & Kids</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}