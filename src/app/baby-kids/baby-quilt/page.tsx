"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Baby, ClipboardCopy, Printer, ChevronDown } from "lucide-react";

function toFrac(v: number): string {
    if (v <= 0) return "0";
    const w = Math.floor(v); const f = v - w;
    const map: [number, string][] = [[0, ""], [0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
    let best = map[0], bd = 1;
    for (const [n, s] of map) { const d = Math.abs(f - n); if (d < bd) { bd = d; best = [n, s]; } }
    if (Math.abs(f - 1) < bd) return `${w + 1}`;
    if (!best[1]) return w > 0 ? `${w}` : "0";
    return w > 0 ? `${w} ${best[1]}` : `${best[1]}`;
}

type QuiltType = "mini-crib" | "crib" | "toddler" | "play" | "stroller" | "car-seat" | "receiving" | "custom";
const presets: { key: QuiltType; name: string; w: number; h: number; desc: string }[] = [
    { key: "mini-crib", name: "Mini Crib", w: 24, h: 38, desc: "Small crib / bassinet" },
    { key: "crib", name: "Standard Crib", w: 36, h: 52, desc: "Most common baby quilt" },
    { key: "toddler", name: "Toddler", w: 42, h: 58, desc: "Toddler bed / floor" },
    { key: "play", name: "Play Mat", w: 40, h: 40, desc: "Floor play / tummy time" },
    { key: "stroller", name: "Stroller", w: 30, h: 40, desc: "Narrow for pram/stroller" },
    { key: "car-seat", name: "Car Seat", w: 18, h: 20, desc: "Small cover" },
    { key: "receiving", name: "Receiving", w: 30, h: 30, desc: "Swaddle size" },
    { key: "custom", name: "Custom", w: 36, h: 52, desc: "Enter your own size" },
];

const faqItems = [
    { q: "What size should a baby crib quilt be?", a: "36\" × 52\" is the standard crib quilt size. It fits a standard 28\" × 52\" crib mattress with modest drape on the sides. Keep it snug — excess fabric hanging over crib sides is a safety concern. Never use a quilt with babies under 12 months during sleep." },
    { q: "Is it safe to use a quilt in a baby's crib?", a: "The AAP recommends NO loose bedding in cribs for babies under 12 months due to SIDS risk. Baby quilts are best used for tummy time, play mats, stroller covers, and as decorative items. After 12 months, quilts can be used with supervision." },
    { q: "How much fabric do I need for a baby quilt?", a: "For a standard 36\" × 52\" crib quilt: about 1½ yards for the top (with simple blocks), 1¾ yards for backing (from 44\" fabric), crib-size batting (45\" × 60\"), and ¼ yard for binding. Add more for sashing or borders." },
    { q: "What batting is best for baby quilts?", a: "Cotton/poly blend is most popular — it's lightweight, breathable, and easy to wash. Low-loft batting is best for baby quilts (less bulk). Avoid high-loft polyester for sleep items. Pre-wash cotton batting to prevent post-quilt shrinkage." },
    { q: "Should I pre-wash fabric for baby quilts?", a: "YES — always pre-wash all fabrics for baby items. This removes chemicals, sizing, and excess dye. Flannel especially must be pre-washed (it shrinks 10-15%). Use gentle detergent and hot water for maximum pre-shrinkage." },
    { q: "How do I make a quick baby quilt as a gift?", a: "The fastest method: use a panel print as the center, add a simple border, and quilt with straight lines. A strip quilt (jelly roll) is also fast. Budget 4-8 hours for a beginner. Pre-cut bundles speed up cutting significantly." },
    { q: "What is the difference between a crib quilt and a play mat?", a: "A crib quilt (36\" × 52\") is rectangular and sized for the mattress. A play mat (36-40\" square) is square, often thicker with extra batting, and meant for floor use. Play mats can be chunkier since they won't be used in a crib." },
    { q: "How do I quilt a baby quilt at home?", a: "Use walking foot for straight-line quilting — the easiest method. Quilt in-the-ditch (along seam lines), in diagonal lines, or in a simple grid. Use cotton thread, not metallic. Quilting every 4-6\" is sufficient for baby quilts." },
];

export default function Page() {
    const [quiltType, setQuiltType] = useState<QuiltType>("crib");
    const [customW, setCustomW] = useState(36);
    const [customH, setCustomH] = useState(52);
    const [blockSize, setBlockSize] = useState(6);
    const [hasSashing, setHasSashing] = useState(false);
    const [sashW, setSashW] = useState(1.5);
    const [hasBorder, setHasBorder] = useState(true);
    const [borderW, setBorderW] = useState(3);
    const [backingW, setBackingW] = useState(44);
    const [backingOverhang, setBackingOverhang] = useState(3);
    const [bindingStripW, setBindingStripW] = useState(2.5);

    const [showSafety, setShowSafety] = useState(false);
    const [showCutting, setShowCutting] = useState(false);
    const [showRef, setShowRef] = useState(false);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const calc = useMemo(() => {
        const preset = presets.find(p => p.key === quiltType) || presets[1];
        const qW = quiltType === "custom" ? customW : preset.w;
        const qH = quiltType === "custom" ? customH : preset.h;

        // Usable interior (minus borders)
        const interiorW = hasBorder ? qW - borderW * 2 : qW;
        const interiorH = hasBorder ? qH - borderW * 2 : qH;

        // Blocks
        const effectiveBlock = hasSashing ? blockSize + sashW : blockSize;
        const blocksAcross = Math.max(1, Math.floor(interiorW / effectiveBlock));
        const blocksDown = Math.max(1, Math.floor(interiorH / effectiveBlock));
        const totalBlocks = blocksAcross * blocksDown;

        // Top fabric (simple 2-color blocks)
        const cutBlock = blockSize + 0.5; // seam allowance
        const fabricW = 42; // usable WOF
        const blocksPerStrip = Math.floor(fabricW / cutBlock);
        const strips = Math.ceil(totalBlocks / Math.max(blocksPerStrip, 1));
        const topYd = Math.ceil((strips * cutBlock) / 36 * 4) / 4;

        // Sashing
        let sashYd = 0;
        if (hasSashing) {
            const hSashes = blocksAcross * (blocksDown + 1);
            const vSashes = blocksDown * (blocksAcross + 1);
            const totalSashPieces = hSashes + vSashes;
            const sashCut = blockSize + 0.5;
            const sPR = Math.floor(fabricW / (sashW + 0.5));
            const sStrips = Math.ceil(totalSashPieces / Math.max(sPR, 1));
            sashYd = Math.ceil((sStrips * sashCut) / 36 * 4) / 4;
        }

        // Border
        let borderYd = 0;
        if (hasBorder) {
            const borderStrips = Math.ceil((qW * 2 + qH * 2 + 16) / fabricW); // 16" margin
            borderYd = Math.ceil((borderStrips * (borderW + 0.5)) / 36 * 4) / 4;
        }

        // Backing
        const backW = qW + backingOverhang * 2;
        const backH = qH + backingOverhang * 2;
        let backYd = 0;
        if (backW <= backingW) {
            backYd = Math.ceil((backH / 36) * 4) / 4;
        } else {
            const widths = Math.ceil(backW / backingW);
            backYd = Math.ceil((widths * backH / 36) * 4) / 4;
        }

        // Batting
        const batW = qW + 4;
        const batH = qH + 4;
        const batPkg = batW <= 45 && batH <= 60 ? "Crib (45\" × 60\")" : batW <= 72 && batH <= 90 ? "Twin (72\" × 90\")" : "Full/Queen";

        // Binding
        const perim = (qW + qH) * 2 + 12; // +12 for mitered corners/overlap
        const bindStrips = Math.ceil(perim / fabricW);
        const bindYd = Math.ceil((bindStrips * bindingStripW) / 36 * 4) / 4;

        const totalYd = topYd + sashYd + borderYd + backYd + bindYd;

        return {
            qW, qH, blocksAcross, blocksDown, totalBlocks,
            topYd, sashYd, borderYd, backYd, bindYd, totalYd,
            batW, batH, batPkg, perim, bindStrips,
        };
    }, [quiltType, customW, customH, blockSize, hasSashing, sashW, hasBorder, borderW, backingW, backingOverhang, bindingStripW]);

    const tH = { padding: "5px 8px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left" as const, fontSize: 11, fontWeight: 600 as const };
    const tD = { padding: "4px 8px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11 };

    const copyText = `Baby Quilt: ${calc.qW}" × ${calc.qH}", ${calc.totalBlocks} blocks at ${blockSize}". Top: ${toFrac(calc.topYd)} yd, Backing: ${toFrac(calc.backYd)} yd, Binding: ${toFrac(calc.bindYd)} yd, Batting: ${calc.batPkg}. Total: ~${toFrac(calc.totalYd)} yd.`;

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Baby & Kids", href: "/baby-kids" }, { label: "Baby Quilt Size Guide" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Baby size={14} strokeWidth={1.5} /> Baby #386</span>
                        <h1>Baby Quilt Size Guide &amp; Calculator</h1>
                        <p>Calculate dimensions and yardage for baby quilts — crib, toddler, play mat, stroller, and more. Includes batting, backing, binding, and safety guidance.</p>
                    </div>

                    {/* SAFETY BANNER */}
                    <div style={{ padding: 10, background: "hsl(0,35%,95%)", borderRadius: 8, fontSize: 12, marginBottom: 10, color: "hsl(0,60%,35%)", fontWeight: 600, borderLeft: "4px solid hsl(0,60%,50%)" }}>
                        ⚠️ <strong>Safety:</strong> The AAP recommends NO loose bedding in cribs for babies under 12 months. Baby quilts are safest as play mats, stroller covers, and decorative items.
                    </div>

                    {/* ① QUILT TYPE */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>① Quilt Type &amp; Size</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 5 }}>
                            {presets.map(p => (
                                <button key={p.key} className={`btn btn-sm ${quiltType === p.key ? "btn-primary" : "btn-ghost"}`} onClick={() => setQuiltType(p.key)} style={{ fontSize: 10, textAlign: "left", padding: "5px 7px", height: "auto" }}>
                                    <strong>{p.name}</strong><br /><span style={{ fontSize: 8, opacity: 0.7 }}>{p.w}&quot;×{p.h}&quot; — {p.desc}</span>
                                </button>
                            ))}
                        </div>
                        {quiltType === "custom" && (
                            <div className="calculator-form-row" style={{ marginTop: 8 }}>
                                <div className="input-group"><label className="input-label">Width (in)</label><input type="number" className="input-field" value={customW} onChange={e => setCustomW(Math.max(10, parseInt(e.target.value) || 36))} min={10} /></div>
                                <div className="input-group"><label className="input-label">Height (in)</label><input type="number" className="input-field" value={customH} onChange={e => setCustomH(Math.max(10, parseInt(e.target.value) || 52))} min={10} /></div>
                            </div>
                        )}
                        <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 6 }}>Finished quilt: <strong>{calc.qW}&quot; × {calc.qH}&quot;</strong></div>
                    </div>

                    {/* ② BLOCK CONFIG */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>② Block &amp; Layout</h2>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Block size (finished, in)</label>
                                <div style={{ display: "flex", gap: 3 }}>
                                    {[4, 5, 6, 8, 10].map(s => (
                                        <button key={s} className={`btn btn-sm ${blockSize === s ? "btn-primary" : "btn-ghost"}`} onClick={() => setBlockSize(s)} style={{ fontSize: 10 }}>{s}&quot;</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="calculator-form-row" style={{ marginTop: 6 }}>
                            <div className="input-group"><label className="input-label">Sashing</label>
                                <div style={{ display: "flex", gap: 3 }}>
                                    <button className={`btn btn-sm ${!hasSashing ? "btn-primary" : "btn-ghost"}`} onClick={() => setHasSashing(false)} style={{ fontSize: 10 }}>No</button>
                                    <button className={`btn btn-sm ${hasSashing ? "btn-primary" : "btn-ghost"}`} onClick={() => setHasSashing(true)} style={{ fontSize: 10 }}>Yes</button>
                                </div>
                                {hasSashing && <input type="number" className="input-field" value={sashW} onChange={e => setSashW(Math.max(0.5, parseFloat(e.target.value) || 1.5))} min={0.5} step={0.5} style={{ width: 70, marginTop: 3 }} />}
                            </div>
                            <div className="input-group"><label className="input-label">Border</label>
                                <div style={{ display: "flex", gap: 3 }}>
                                    <button className={`btn btn-sm ${!hasBorder ? "btn-primary" : "btn-ghost"}`} onClick={() => setHasBorder(false)} style={{ fontSize: 10 }}>No</button>
                                    <button className={`btn btn-sm ${hasBorder ? "btn-primary" : "btn-ghost"}`} onClick={() => setHasBorder(true)} style={{ fontSize: 10 }}>Yes</button>
                                </div>
                                {hasBorder && <input type="number" className="input-field" value={borderW} onChange={e => setBorderW(Math.max(1, parseFloat(e.target.value) || 3))} min={1} step={0.5} style={{ width: 70, marginTop: 3 }} />}
                            </div>
                            <div className="input-group"><label className="input-label">Backing width</label>
                                <div style={{ display: "flex", gap: 3 }}>
                                    {[44, 60, 108].map(w => (<button key={w} className={`btn btn-sm ${backingW === w ? "btn-primary" : "btn-ghost"}`} onClick={() => setBackingW(w)} style={{ fontSize: 10 }}>{w}&quot;</button>))}
                                </div>
                            </div>
                        </div>
                        <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 6 }}>
                            Layout: {calc.blocksAcross} × {calc.blocksDown} = <strong>{calc.totalBlocks} blocks</strong> at {blockSize}&quot;{hasBorder ? ` + ${borderW}" border` : ""}
                        </div>
                    </div>

                    {/* ═══ RESULTS ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(320,50%,45%)" }}>
                        <h2 className={styles.calcTitle}>Your Baby Quilt Yardage</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                            <div style={{ padding: 14, background: "hsl(320,15%,95%)", borderRadius: 10, textAlign: "center" }}>
                                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(320,40%,35%)" }}>Total Fabric</div>
                                <div style={{ fontSize: 32, fontWeight: 800, color: "hsl(320,50%,30%)" }}>{toFrac(calc.totalYd)}</div>
                                <div style={{ fontSize: 10 }}>yards (all fabrics)</div>
                            </div>
                            <div style={{ padding: 14, background: "hsl(200,15%,95%)", borderRadius: 10, textAlign: "center" }}>
                                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(200,40%,35%)" }}>Quilt Size</div>
                                <div style={{ fontSize: 28, fontWeight: 800, color: "hsl(200,50%,30%)" }}>{calc.qW}&quot;×{calc.qH}&quot;</div>
                                <div style={{ fontSize: 10 }}>{calc.totalBlocks} blocks</div>
                            </div>
                        </div>
                        <div className={styles.resultDetails}>
                            <div className="result-row"><span>Block fabric (2-color)</span><strong>{toFrac(calc.topYd)} yd</strong></div>
                            {hasSashing && <div className="result-row"><span>Sashing fabric</span><strong>{toFrac(calc.sashYd)} yd</strong></div>}
                            {hasBorder && <div className="result-row"><span>Border fabric ({borderW}&quot; wide)</span><strong>{toFrac(calc.borderYd)} yd</strong></div>}
                            <div className="result-row"><span>Backing ({backingW}&quot; wide)</span><strong>{toFrac(calc.backYd)} yd</strong></div>
                            <div className="result-row"><span>Binding ({bindingStripW}&quot; strips)</span><strong>{toFrac(calc.bindYd)} yd</strong></div>
                            <div className="result-row"><span>Batting</span><strong>{calc.batPkg}</strong></div>
                        </div>
                    </div>

                    <div className="toolbar" style={{ marginBottom: 10 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} /> Copy</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                    </div>

                    {/* SAFETY SECTION */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowSafety(!showSafety)}>
                            🛡️ Crib Safety &amp; Best Practices
                            <ChevronDown size={14} style={{ transform: showSafety ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showSafety && (
                            <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9, color: "var(--color-text-secondary)" }}>
                                <p><strong>Safe crib quilt size:</strong> 36&quot; × 52&quot; maximum. Standard crib mattress is 28&quot; × 52&quot;.</p>
                                <p><strong>Under 12 months:</strong> No quilts in sleep area (AAP guidelines).</p>
                                <p><strong>Pre-wash everything:</strong> Remove chemicals, sizing, excess dye. Hot water for maximum shrinkage.</p>
                                <p><strong>Avoid small embellishments:</strong> No buttons, beads, or small pieces on items for babies under 3 years — choking hazard.</p>
                                <p><strong>Use colorfast fabrics:</strong> Baby quilts get washed frequently. Test for color bleeding before assembly.</p>
                            </div>
                        )}
                    </div>

                    {/* CUTTING GUIDE */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowCutting(!showCutting)}>
                            ✂️ Cutting Guide
                            <ChevronDown size={14} style={{ transform: showCutting ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showCutting && (
                            <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9 }}>
                                <div className={styles.resultDetails}>
                                    <div className="result-row"><span>Block squares (each color)</span><strong>{Math.ceil(calc.totalBlocks / 2)} pcs at {blockSize + 0.5}&quot; sq</strong></div>
                                    {hasSashing && <div className="result-row"><span>Sashing strips</span><strong>{sashW + 0.5}&quot; × {blockSize + 0.5}&quot;</strong></div>}
                                    {hasBorder && <div className="result-row"><span>Border strips</span><strong>{borderW + 0.5}&quot; wide (WOF)</strong></div>}
                                    <div className="result-row"><span>Binding strips</span><strong>{calc.bindStrips} strips at {bindingStripW}&quot; × WOF</strong></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* REFERENCE TABLE */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowRef(!showRef)}>
                            📊 Baby Quilt Quick Reference
                            <ChevronDown size={14} style={{ transform: showRef ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showRef && (
                            <div style={{ marginTop: 10, overflowX: "auto" }}>
                                <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
                                    <thead><tr><th style={tH}>Type</th><th style={tH}>Size</th><th style={tH}>~Top</th><th style={tH}>~Backing</th><th style={tH}>Batting</th></tr></thead>
                                    <tbody>
                                        {presets.filter(p => p.key !== "custom").map(p => {
                                            const tY = Math.ceil(p.w * p.h / (44 * 36) * 4) / 4 + 0.25;
                                            const bY = p.w <= 44 ? Math.ceil(p.h / 36 * 4) / 4 : Math.ceil(2 * p.h / 36 * 4) / 4;
                                            return (<tr key={p.key} style={{ background: quiltType === p.key ? "hsl(320,15%,93%)" : undefined }}>
                                                <td style={{ ...tD, fontWeight: 600 }}>{p.name}</td><td style={tD}>{p.w}&quot;×{p.h}&quot;</td><td style={tD}>{toFrac(tY)} yd</td><td style={tD}>{toFrac(bY)} yd</td><td style={tD}>{p.w <= 45 && p.h <= 60 ? "Crib" : "Twin"}</td>
                                            </tr>);
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* FAQ */}
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
                        <div style={{ fontSize: 12, lineHeight: 2.2, color: "var(--color-text-secondary)" }}>
                            <div>🧵 Block fabric: <strong>{toFrac(calc.topYd)} yd</strong></div>
                            {hasSashing && <div>🧵 Sashing: <strong>{toFrac(calc.sashYd)} yd</strong></div>}
                            {hasBorder && <div>🧵 Border: <strong>{toFrac(calc.borderYd)} yd</strong></div>}
                            <div>🧵 Backing: <strong>{toFrac(calc.backYd)} yd</strong></div>
                            <div>🧵 Binding: <strong>{toFrac(calc.bindYd)} yd</strong></div>
                            <div>🛏️ Batting: <strong>{calc.batPkg}</strong></div>
                        </div>
                    </div>
                    <div className="glass-card related-tools">
                        <h4>Related Tools</h4>
                        <a href="/baby-kids/receiving-blanket" className="related-tool-link">Receiving Blanket</a>
                        <a href="/quilt/quilt-size-calculator" className="related-tool-link">Quilt Size Calculator</a>
                        <a href="/quilt/quilt-binding-calculator" className="related-tool-link">Binding Calculator</a>
                        <a href="/baby-kids" className="related-tool-link">All Baby & Kids</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}