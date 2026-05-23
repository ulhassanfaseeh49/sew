"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Ribbon, ChevronDown, Info, AlertTriangle } from "lucide-react";

/* ─── constants ────────────────────────────────────── */
interface Preset { label: string; w: number; h: number }
const PRESETS: Preset[] = [
    { label: "Baby / Crib", w: 36, h: 52 },
    { label: "Throw", w: 54, h: 72 },
    { label: "Twin", w: 60, h: 80 },
    { label: "Full / Double", w: 72, h: 90 },
    { label: "Queen", w: 84, h: 92 },
    { label: "King", w: 100, h: 108 },
    { label: "Cal King", w: 104, h: 108 },
];

type QShape = "rect" | "square" | "hexagon" | "octagon" | "irregular";
const SHAPES: { key: QShape; label: string; note: string }[] = [
    { key: "rect", label: "Rectangle", note: "Standard rectangular quilt — most common." },
    { key: "square", label: "Square", note: "Square quilt — perimeter = side × 4." },
    { key: "hexagon", label: "Hexagon", note: "6-sided quilt — bias binding recommended." },
    { key: "octagon", label: "Octagon", note: "8-sided quilt." },
    { key: "irregular", label: "Irregular / Measured", note: "Enter total perimeter directly." },
];

type BindFold = "double" | "single" | "premade";
type BindGrain = "straight" | "bias";
type SafetyLevel = "none" | "small" | "standard" | "generous" | "custom";

const CUT_WIDTHS = [
    { cut: 2.0, fold: "double" as const, finished: "~⅜\"", best: "Wall hangings, delicate look" },
    { cut: 2.25, fold: "double" as const, finished: "~½\"", best: "Standard quilt binding" },
    { cut: 2.5, fold: "double" as const, finished: "~½–⅝\"", best: "Most popular — recommended" },
    { cut: 3.0, fold: "double" as const, finished: "~¾\"", best: "Bold look, thicker quilts" },
    { cut: 3.5, fold: "double" as const, finished: "~1\"", best: "Wide binding, statement" },
    { cut: 1.5, fold: "single" as const, finished: "~⅜\"", best: "Table runners, wall hangings" },
    { cut: 2.0, fold: "single" as const, finished: "~⅝\"", best: "Standard single-fold" },
];

const SAFETY: Record<SafetyLevel, number> = { none: 0, small: 6, standard: 12, generous: 18, custom: 0 };

function toFrac(y: number): string {
    const neg = y < 0; const abs = Math.abs(y); const w = Math.floor(abs); const f = abs - w;
    const fracs: [number, string][] = [[0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
    const s = neg ? "-" : "";
    for (const [v, sym] of fracs) { if (Math.abs(f - v) < 0.02) return w > 0 ? `${s}${w}${sym}` : `${s}${sym}`; }
    if (f > 0.01) return `${s}${abs.toFixed(2)}`;
    return `${s}${w}`;
}
function roundUp8(v: number) { return Math.ceil(v * 8) / 8; }
function roundUp4(v: number) { return Math.ceil(v * 4) / 4; }

/* ─── component ──────────────────────────────────── */
export default function Page() {
    /* Shape & dimensions */
    const [shape, setShape] = useState<QShape>("rect");
    const [qw, setQw] = useState("84");
    const [qh, setQh] = useState("92");
    const [sideLen, setSideLen] = useState("12");
    const [directPerim, setDirectPerim] = useState("");
    /* Binding style */
    const [foldType, setFoldType] = useState<BindFold>("double");
    const [grain, setGrain] = useState<BindGrain>("straight");
    /* Strip width */
    const [cutWidth, setCutWidth] = useState("2.5");
    /* Fabric */
    const [fabricWidth, setFabricWidth] = useState("42");
    /* Allowances */
    const [cornerAllow, setCornerAllow] = useState("12");
    const [joinAllow, setJoinAllow] = useState("15");
    const [safetyLevel, setSafetyLevel] = useState<SafetyLevel>("standard");
    const [customSafety, setCustomSafety] = useState("");
    /* "Do I Have Enough" */
    const [haveMode, setHaveMode] = useState(false);
    const [haveYd, setHaveYd] = useState("");
    const [haveFw, setHaveFw] = useState("42");
    const [haveCw, setHaveCw] = useState("2.5");
    /* Collapsibles */
    const [showAllowances, setShowAllowances] = useState(false);
    const [showEdu, setShowEdu] = useState(false);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    /* derived */
    const w = parseFloat(qw) || 0;
    const h = parseFloat(qh) || 0;
    const sl = parseFloat(sideLen) || 0;
    const cw = parseFloat(cutWidth) || 2.5;
    const fw = parseFloat(fabricWidth) || 42;
    const ca = parseFloat(cornerAllow) || 0;
    const ja = parseFloat(joinAllow) || 0;
    const sm = safetyLevel === "custom" ? (parseFloat(customSafety) || 0) : SAFETY[safetyLevel];

    /* perimeter */
    const perimeter = useMemo(() => {
        switch (shape) {
            case "rect": return (w + h) * 2;
            case "square": return w * 4;
            case "hexagon": return sl * 6;
            case "octagon": return sl * 8;
            case "irregular": return parseFloat(directPerim) || 0;
            default: return 0;
        }
    }, [shape, w, h, sl, directPerim]);

    /* corners count — hex/oct have more corners, so scale allowance proportionally */
    const corners = shape === "hexagon" ? 6 : shape === "octagon" ? 8 : 4;
    const effectiveCA = ca * (corners / 4); // 12" default is for 4 corners (3" each); hex gets 18", oct gets 24"

    /* calculation */
    const result = useMemo(() => {
        if (perimeter <= 0) return null;
        const totalLen = perimeter + effectiveCA + ja + sm;
        const usableFW = fw; // user sets usable width (after selvage removal)
        const strips = Math.ceil(totalLen / usableFW);
        const rawYards = (strips * cw) / 36;
        const roundedYd = roundUp4(rawYards);
        /* bias uses ~1.4x more fabric */
        const biasMultiplier = grain === "bias" ? 1.4 : 1;
        const biasYd = roundUp4(rawYards * biasMultiplier);
        const purchaseYd = grain === "bias" ? biasYd : roundedYd;
        /* total available length */
        const availableLen = strips * usableFW;
        const extraLen = availableLen - totalLen;
        /* finished width estimate (double fold) */
        const finishedWidth = foldType === "double" ? (cw / 2 - 0.25) / 2 : (cw - 0.5) / 2;
        return { totalLen, strips, rawYards, roundedYd, purchaseYd, availableLen, extraLen, biasYd, finishedWidth, biasMultiplier };
    }, [perimeter, effectiveCA, ja, sm, fw, cw, grain, foldType]);

    /* "Do I Have Enough?" */
    const haveResult = useMemo(() => {
        if (!haveMode || !result) return null;
        const yd = parseFloat(haveYd) || 0;
        if (yd <= 0) return null;
        const hfw = parseFloat(haveFw) || 42;
        const hcw = parseFloat(haveCw) || 2.5;
        const stripsFromYd = Math.floor((yd * 36) / hcw);
        const totalLen = stripsFromYd * hfw;
        const enough = totalLen >= result.totalLen;
        return { stripsFromYd, totalLen, enough, surplus: totalLen - result.totalLen, yd, hfw, hcw };
    }, [haveMode, haveYd, haveFw, haveCw, result]);

    const copyText = result ? `Binding: ${toFrac(result.purchaseYd)} yd of ${fw}" fabric. Cut ${result.strips} strips at ${cw}". Perimeter: ${perimeter}".` : "";

    /* Quick reference table */
    const quickRef = PRESETS.map(p => {
        const perim = (p.w + p.h) * 2;
        const total = perim + 12 + 15 + 12; // standard allowances
        const strips = Math.ceil(total / 42);
        const yd = roundUp4((strips * 2.5) / 36);
        return { name: p.label, size: `${p.w}×${p.h}`, perim: `${perim}"`, strips: `${strips}`, yd: `${yd.toFixed(2)}`, buy: toFrac(roundUp4(yd + 0.12)) };
    });

    /* FAQ */
    const faqItems = [
        { q: "How do I calculate quilt binding yardage?", a: "Measure your quilt's perimeter (width + height) × 2. Add 12\" for corners, 15\" for joining overlap, and 12\" safety margin. Divide total by your usable fabric width to get the number of strips. Multiply strips × cut width ÷ 36 for yardage." },
        { q: "How wide should I cut my binding strips?", a: "For double-fold binding (most common), cut strips at 2.5\" wide. This gives approximately ½\" finished binding width — the most popular and versatile choice. Cut wider (3\") for thick quilts or narrower (2.25\") for a delicate look." },
        { q: "How much binding do I need for a queen quilt?", a: "A queen quilt (84\" × 92\") has a 352\" perimeter. With standard allowances, you need about 391\" of binding, which requires 10 strips from 42\" fabric — approximately 1 yard of fabric." },
        { q: "What is double-fold binding?", a: "Double-fold (French) binding is created by cutting strips, folding in half lengthwise with wrong sides together, then sewing the raw edges to the quilt. This creates a durable double-thickness edge. It's the most common and recommended method." },
        { q: "How do I join binding strips together?", a: "Place two strips at right angles, right sides together. Draw a diagonal line from corner to corner and stitch on that line. Trim to ¼\" seam allowance and press open. This diagonal join distributes bulk and is nearly invisible." },
        { q: "What is the difference between straight grain and bias binding?", a: "Straight grain binding is cut across the fabric width — economical and works for straight-edged quilts. Bias binding is cut at 45° — it stretches to hug curves and is required for scalloped, curved, or hexagon quilts. Bias uses about 40% more fabric." },
        { q: "How do I miter binding corners?", a: "Stop stitching ¼\" from the corner, backstitch. Fold binding straight up (45° angle), then fold it back down along the next edge. Start stitching from the top. This creates a neat mitered fold on both front and back." },
        { q: "How do I calculate binding for a non-rectangular quilt?", a: "For hexagons, multiply side length × 6. For octagons, multiply × 8. For irregular shapes, use a flexible tape measure along all edges. Add corner allowances for each corner (about 3\" each), plus joining and safety allowances." },
        { q: "How much extra binding should I buy?", a: "Add 12\" for 4 corners (3\" each), 12–18\" for joining/overlap at start and end, and 6–18\" for safety margin. For a standard queen quilt, about 39\" extra (roughly ¼ yard)." },
        { q: "Can I piece together scraps for quilt binding?", a: "Yes! Scrappy binding is popular. Cut strips from multiple fabrics at the same width and join with diagonal seams. Minimum usable strip length is about 12–15 inches. Mix randomly or plan a pattern for visual balance." },
        { q: "How do I join the binding at the end?", a: "Leave 6–8\" tails at both start and end. Open the binding folds, lay the strips flat, and join with a diagonal seam — just like joining two strips. Trim, press, refold, and stitch the remaining section." },
        { q: "What is the standard binding width for a quilt?", a: "The most popular is 2.5\" cut width (double-fold), giving approximately ½\" of finished binding visible on the front. This is the recommended standard for bed quilts, throws, and most projects." },
    ];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "Binding Calculator" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    {/* HEADER */}
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Ribbon size={14} strokeWidth={1.5} /> Quilt #138</span>
                        <h1>Quilt Binding Calculator</h1>
                        <p>Calculate binding yardage, strips to cut, and finished binding width for any quilt size and shape.</p>
                    </div>

                    {/* ① QUILT SHAPE & SIZE */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>① Quilt Shape &amp; Size</h2>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                            {SHAPES.map(s => (
                                <button key={s.key} className={`btn btn-sm ${shape === s.key ? "btn-primary" : "btn-secondary"}`}
                                    onClick={() => setShape(s.key)}>{s.label}</button>
                            ))}
                        </div>
                        <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 10 }}>
                            <Info size={12} style={{ display: "inline", marginRight: 4 }} />{SHAPES.find(s => s.key === shape)!.note}
                        </div>

                        {/* Presets for rect */}
                        {(shape === "rect" || shape === "square") && (
                            <div className={styles.presets}><div className={styles.presetGrid}>
                                {PRESETS.map((p, i) => (
                                    <button key={i} className={`btn btn-sm btn-secondary ${w === p.w && h === p.h ? styles.presetActive : ""}`}
                                        onClick={() => { setQw(String(p.w)); setQh(String(p.h)); setShape("rect"); }}>{p.label}</button>
                                ))}
                            </div></div>
                        )}

                        <div className="calculator-form" style={{ marginTop: 10 }}>
                            {shape === "rect" && (
                                <div className="calculator-form-row">
                                    <div className="input-group"><label className="input-label" htmlFor="qw">Width (inches)</label>
                                        <input id="qw" type="number" className="input-field" value={qw} onChange={e => setQw(e.target.value)} min={1} /></div>
                                    <div className="input-group"><label className="input-label" htmlFor="qh">Height (inches)</label>
                                        <input id="qh" type="number" className="input-field" value={qh} onChange={e => setQh(e.target.value)} min={1} /></div>
                                </div>
                            )}
                            {shape === "square" && (
                                <div className="calculator-form-row" style={{ maxWidth: 300 }}>
                                    <div className="input-group"><label className="input-label">Side length (inches)</label>
                                        <input type="number" className="input-field" value={qw} onChange={e => setQw(e.target.value)} min={1} /></div>
                                </div>
                            )}
                            {(shape === "hexagon" || shape === "octagon") && (
                                <div className="calculator-form-row" style={{ maxWidth: 300 }}>
                                    <div className="input-group"><label className="input-label">Side length (inches)</label>
                                        <input type="number" className="input-field" value={sideLen} onChange={e => setSideLen(e.target.value)} min={1} /></div>
                                </div>
                            )}
                            {shape === "irregular" && (
                                <div className="calculator-form-row" style={{ maxWidth: 300 }}>
                                    <div className="input-group"><label className="input-label">Total perimeter (inches)</label>
                                        <input type="number" className="input-field" placeholder="e.g., 280" value={directPerim} onChange={e => setDirectPerim(e.target.value)} min={1} /></div>
                                </div>
                            )}
                            {perimeter > 0 && <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-accent-primary)", marginTop: 8 }}>Perimeter: {perimeter}&quot;</div>}
                        </div>
                        {(shape === "hexagon") && (
                            <div style={{ fontSize: 12, color: "hsl(35,80%,45%)", marginTop: 8 }}>
                                <AlertTriangle size={12} style={{ display: "inline", marginRight: 4 }} />Bias binding is recommended for hexagon quilts to handle the angles.
                            </div>
                        )}
                    </div>

                    {/* ② BINDING STYLE */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>② Binding Style</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                            <div>
                                <label className="input-label" style={{ marginBottom: 6, display: "block" }}>Fold Type</label>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                    <button className={`btn btn-sm ${foldType === "double" ? "btn-primary" : "btn-secondary"}`} onClick={() => setFoldType("double")}>Double-Fold</button>
                                    <button className={`btn btn-sm ${foldType === "single" ? "btn-primary" : "btn-secondary"}`} onClick={() => setFoldType("single")}>Single-Fold</button>
                                    <button className={`btn btn-sm ${foldType === "premade" ? "btn-primary" : "btn-secondary"}`} onClick={() => setFoldType("premade")}>Pre-Made</button>
                                </div>
                            </div>
                            <div>
                                <label className="input-label" style={{ marginBottom: 6, display: "block" }}>Grain Direction</label>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                    <button className={`btn btn-sm ${grain === "straight" ? "btn-primary" : "btn-secondary"}`} onClick={() => setGrain("straight")}>Straight Grain</button>
                                    <button className={`btn btn-sm ${grain === "bias" ? "btn-primary" : "btn-secondary"}`} onClick={() => setGrain("bias")}>Bias (45°)</button>
                                </div>
                            </div>
                        </div>
                        <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
                            {foldType === "double" && "Double-fold: strips folded in half before applying. Most durable — recommended for bed quilts."}
                            {foldType === "single" && "Single-fold: thinner edge. Best for wall hangings, table runners, and lightweight projects."}
                            {foldType === "premade" && "Pre-made: commercial binding tape. Calculator shows length needed — no strip cutting required."}
                            {grain === "bias" && " · Bias binding stretches to hug curves — uses ~40% more fabric."}
                        </div>
                    </div>

                    {/* ③ STRIP WIDTH & FABRIC */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>③ Strip Width &amp; Fabric</h2>
                        {foldType !== "premade" ? (
                            <div className="calculator-form">
                                <div className="calculator-form-row">
                                    <div className="input-group"><label className="input-label">Cut strip width (inches)</label>
                                        <input type="number" className="input-field" value={cutWidth} onChange={e => setCutWidth(e.target.value)} step={0.25} min={1} max={6} /></div>
                                    <div className="input-group"><label className="input-label">Usable fabric width (inches)</label>
                                        <input type="number" className="input-field" value={fabricWidth} onChange={e => setFabricWidth(e.target.value)} min={10} /></div>
                                </div>
                                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                                    {[2, 2.25, 2.5, 3, 3.5].map(v => (
                                        <button key={v} className={`btn btn-sm ${parseFloat(cutWidth) === v ? "btn-primary" : "btn-secondary"}`}
                                            onClick={() => setCutWidth(String(v))}>{v}&quot;</button>
                                    ))}
                                </div>
                                {cw > 0 && <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 8 }}>
                                    Finished binding width: ~{result ? result.finishedWidth.toFixed(2) : "—"}&quot;
                                    {foldType === "double" ? " (double-fold)" : " (single-fold)"}
                                </div>}
                                {cw > 4 && <div style={{ fontSize: 12, color: "hsl(35,80%,45%)", marginTop: 4 }}>
                                    <AlertTriangle size={12} style={{ display: "inline", marginRight: 4 }} />Very wide binding — unusual. Double-check your intended finished width.
                                </div>}
                            </div>
                        ) : (
                            <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
                                Pre-made binding is sold by length. The calculator will show how many yards/inches to purchase.
                            </div>
                        )}
                    </div>

                    {/* ④ ALLOWANCES (collapsible) */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
                            onClick={() => setShowAllowances(!showAllowances)}>
                            ④ Allowances (corners {effectiveCA}&quot; + join {ja}&quot; + safety {sm}&quot; = +{effectiveCA + ja + sm}&quot;)
                            <ChevronDown size={14} style={{ transform: showAllowances ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                        </button>
                        {showAllowances && (
                            <div style={{ marginTop: 12 }}>
                                <div className="calculator-form-row">
                                    <div className="input-group"><label className="input-label">Corner allowance (total)</label>
                                        <input type="number" className="input-field" value={cornerAllow} onChange={e => setCornerAllow(e.target.value)} min={0} /></div>
                                    <div className="input-group"><label className="input-label">Join/overlap allowance</label>
                                        <input type="number" className="input-field" value={joinAllow} onChange={e => setJoinAllow(e.target.value)} min={0} /></div>
                                </div>
                                <label className="input-label" style={{ marginTop: 10 }}>Safety margin</label>
                                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
                                    {(["none", "small", "standard", "generous", "custom"] as SafetyLevel[]).map(s => (
                                        <button key={s} className={`btn btn-sm ${safetyLevel === s ? "btn-primary" : "btn-secondary"}`}
                                            onClick={() => setSafetyLevel(s)}>
                                            {s === "none" ? "None (0\")" : s === "small" ? "Small (+6\")" : s === "standard" ? "Standard (+12\")" : s === "generous" ? "Generous (+18\")" : "Custom"}
                                        </button>
                                    ))}
                                </div>
                                {safetyLevel === "custom" && (
                                    <div className="input-group" style={{ maxWidth: 200, marginTop: 8 }}>
                                        <input type="number" className="input-field" placeholder="inches" value={customSafety} onChange={e => setCustomSafety(e.target.value)} min={0} />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ═══ RESULTS ═══ */}
                    {result && (<>
                        <div className={`calculator-results ${styles.results}`}>
                            <div className="result-card">
                                <div className="result-value">{toFrac(result.purchaseYd)} yard{result.purchaseYd !== 1 ? "s" : ""}</div>
                                <div className="result-label">
                                    recommended purchase · {result.strips} strips at {cw}&quot; × WOF
                                </div>
                            </div>

                            <div className={styles.resultDetails}>
                                <div className={styles.resultRow}><span>Quilt perimeter</span><strong>{perimeter}&quot;</strong></div>
                                <div className={styles.resultRow}><span>+ Corner allowance ({corners} corners)</span><strong>+{effectiveCA}&quot;</strong></div>
                                <div className={styles.resultRow}><span>+ Join/overlap</span><strong>+{ja}&quot;</strong></div>
                                <div className={styles.resultRow}><span>+ Safety margin</span><strong>+{sm}&quot;</strong></div>
                                <div className={styles.resultRow} style={{ borderTop: "2px solid var(--color-border)", paddingTop: 8 }}>
                                    <span style={{ fontWeight: 600 }}>Total binding length</span><strong>{result.totalLen}&quot; ({(result.totalLen / 12).toFixed(1)} ft)</strong>
                                </div>
                                <div className={styles.resultRow}><span>Cut strip width</span><strong>{cw}&quot;</strong></div>
                                <div className={styles.resultRow}><span>Usable fabric width</span><strong>{fw}&quot;</strong></div>
                                <div className={styles.resultRow}><span>Strips needed</span><strong>{result.strips}</strong></div>
                                <div className={styles.resultRow}><span>Raw yardage</span><strong>{result.rawYards.toFixed(3)} yd</strong></div>
                                {grain === "bias" && <div className={styles.resultRow}><span>Bias fabric multiplier</span><strong>×{result.biasMultiplier} → {result.biasYd.toFixed(2)} yd</strong></div>}
                                <div className={styles.resultRow}><span>Finished binding width</span><strong>~{result.finishedWidth.toFixed(2)}&quot;</strong></div>
                            </div>
                        </div>

                        {/* BINDING LENGTH BAR */}
                        <div className={`glass-card ${styles.calculatorCard}`}>
                            <h2 className={styles.calcTitle}>Binding Length Check</h2>
                            <div style={{ marginBottom: 8 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4, color: "var(--color-text-secondary)" }}>
                                    <span>Needed: {result.totalLen}&quot;</span>
                                    <span>Available: {result.availableLen}&quot;</span>
                                </div>
                                <div style={{ height: 20, background: "var(--color-bg-secondary)", borderRadius: 10, overflow: "hidden", position: "relative" }}>
                                    <div style={{
                                        height: "100%", borderRadius: 10, transition: "width 0.3s",
                                        width: `${Math.min(100, (result.totalLen / result.availableLen) * 100)}%`,
                                        background: result.extraLen >= 24 ? "hsl(140,50%,50%)" : result.extraLen >= 0 ? "hsl(45,80%,50%)" : "hsl(0,60%,50%)"
                                    }} />
                                </div>
                                <div style={{
                                    fontSize: 13, fontWeight: 600, marginTop: 4,
                                    color: result.extraLen >= 24 ? "hsl(140,50%,35%)" : result.extraLen >= 0 ? "hsl(35,70%,40%)" : "hsl(0,60%,45%)"
                                }}>
                                    {result.extraLen >= 0 ? `✓ ${result.extraLen}" extra — you're good!` : `✗ Short by ${-result.extraLen}" — add more strips`}
                                </div>
                            </div>
                        </div>

                        {/* CUTTING INSTRUCTIONS */}
                        {foldType !== "premade" && (
                            <div className={`glass-card ${styles.calculatorCard}`}>
                                <h2 className={styles.calcTitle}>✂️ Cutting Instructions</h2>
                                <div style={{ background: "var(--color-bg-secondary)", padding: 14, borderRadius: "var(--radius-md)", fontSize: 14, lineHeight: 1.9, fontFamily: "var(--font-mono, monospace)" }}>
                                    <div>From <strong>{toFrac(result.purchaseYd)} yard{result.purchaseYd !== 1 ? "s" : ""}</strong> of {fw}&quot;-wide fabric, cut:</div>
                                    <div style={{ fontSize: 18, fontWeight: 700, margin: "6px 0", color: "var(--color-accent-primary)" }}>{result.strips} strips at {cw}&quot; × WOF</div>
                                    <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
                                        Join strips with diagonal seams (45° angle)<br />
                                        Press seams open<br />
                                        {foldType === "double" ? "Fold strip in half lengthwise (wrong sides together)" : "Press under seam allowances on both long edges"}<br />
                                        Press well<br />
                                        Total joined length: ~{result.availableLen}&quot; ({(result.availableLen / 12).toFixed(1)} ft)<br />
                                        Your quilt needs: {result.totalLen}&quot; ({(result.totalLen / 12).toFixed(1)} ft)<br />
                                        Extra binding: ~{result.extraLen}&quot; ✓
                                    </div>
                                </div>
                            </div>
                        )}

                        {foldType === "premade" && (
                            <div className={`glass-card ${styles.calculatorCard}`}>
                                <h2 className={styles.calcTitle}>Pre-Made Binding Purchase</h2>
                                <div style={{ fontSize: 14, lineHeight: 1.8 }}>
                                    <div>Total binding length needed: <strong>{result.totalLen}&quot;</strong> ({(result.totalLen / 36).toFixed(1)} yards)</div>
                                    <div style={{ marginTop: 8 }}>
                                        <strong>Buy:</strong> {toFrac(roundUp4(result.totalLen / 36 + 0.25))} yards of pre-made binding tape
                                    </div>
                                    <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 8 }}>
                                        Common packages: 3 yd, 6 yd, 10 yd, 15 yd — choose the next size up that covers your needs.
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* DO I HAVE ENOUGH */}
                        <div className={`glass-card ${styles.calculatorCard}`}>
                            <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
                                onClick={() => setHaveMode(!haveMode)}>
                                🧶 Do I Have Enough Binding Fabric? <ChevronDown size={14} style={{ transform: haveMode ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                            </button>
                            {haveMode && (
                                <div style={{ marginTop: 12 }}>
                                    <div className="calculator-form-row">
                                        <div className="input-group"><label className="input-label">Yardage on hand</label>
                                            <input type="number" className="input-field" placeholder="e.g., 0.75" value={haveYd} onChange={e => setHaveYd(e.target.value)} min={0} step={0.125} /></div>
                                        <div className="input-group"><label className="input-label">Fabric width&quot;</label>
                                            <input type="number" className="input-field" value={haveFw} onChange={e => setHaveFw(e.target.value)} min={10} /></div>
                                        <div className="input-group"><label className="input-label">Cut width&quot;</label>
                                            <input type="number" className="input-field" value={haveCw} onChange={e => setHaveCw(e.target.value)} min={1} step={0.25} /></div>
                                    </div>
                                    {haveResult && (
                                        <div style={{ marginTop: 10, padding: 12, borderRadius: "var(--radius-md)", background: haveResult.enough ? "hsl(140,50%,95%)" : "hsl(0,60%,95%)", fontSize: 14 }}>
                                            {haveResult.enough ? (
                                                <><strong style={{ color: "hsl(140,50%,35%)" }}>✅ Yes! You can cut {haveResult.stripsFromYd} strips = {haveResult.totalLen}&quot; of binding.</strong>
                                                    <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}> — {haveResult.surplus}&quot; surplus.</span></>
                                            ) : (
                                                <><strong style={{ color: "hsl(0,60%,45%)" }}>❌ Not enough.</strong>
                                                    <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
                                                        {" "}You can cut {haveResult.stripsFromYd} strips = {haveResult.totalLen}&quot;, but need {result.totalLen}&quot;. Short by {-haveResult.surplus}&quot;.
                                                    </span></>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* TOOLBAR */}
                        <div className="toolbar" style={{ marginBottom: 16 }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(copyText)}>
                                <ClipboardCopy size={13} /> Copy
                            </button>
                            <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
                                <Printer size={13} /> Print
                            </button>
                        </div>
                    </>)}

                    {/* CUT WIDTH REFERENCE TABLE */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Cut Width → Finished Width Reference</h2>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead><tr><th>Cut Width</th><th>Type</th><th>Finished Width</th><th>Best For</th></tr></thead>
                                <tbody>
                                    {CUT_WIDTHS.map((c, i) => (
                                        <tr key={i} style={parseFloat(cutWidth) === c.cut && foldType === c.fold ? { background: "var(--color-accent-light)" } : undefined}>
                                            <td style={{ fontWeight: 600, fontFamily: "inherit" }}>{c.cut}&quot;</td>
                                            <td>{c.fold === "double" ? "Double-fold" : "Single-fold"}</td>
                                            <td>{c.finished}</td>
                                            <td style={{ fontSize: 12 }}>{c.best}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* QUICK REFERENCE TABLE */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Quick Reference — Standard Binding</h2>
                        <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 10 }}>
                            Based on double-fold binding, 2.5&quot; cut strips, 42&quot; usable fabric width, standard allowances.
                        </p>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead><tr><th>Quilt Size</th><th>Perimeter</th><th>Strips</th><th>Yardage</th><th>Buy</th></tr></thead>
                                <tbody>
                                    {quickRef.map((r, i) => (
                                        <tr key={i}>
                                            <td style={{ fontFamily: "inherit" }}>{r.name} ({r.size}&quot;)</td>
                                            <td>{r.perim}</td>
                                            <td>{r.strips}</td>
                                            <td>{r.yd} yd</td>
                                            <td style={{ fontWeight: 600 }}>{r.buy} yd</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* EDUCATIONAL CONTENT */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
                            onClick={() => setShowEdu(!showEdu)}>
                            📚 Binding Basics &amp; Tips <ChevronDown size={14} style={{ transform: showEdu ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                        </button>
                        {showEdu && (
                            <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
                                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: "var(--color-text-primary)" }}>What is Quilt Binding?</h3>
                                <p>Binding is the fabric strip that wraps around the raw edges of a finished quilt, covering all three layers (top, batting, backing). It protects the edges and gives the quilt a clean, professional finish.</p>
                                <h3 style={{ fontSize: 15, fontWeight: 600, margin: "14px 0 6px", color: "var(--color-text-primary)" }}>Double-Fold vs Single-Fold</h3>
                                <p>Double-fold (French) binding is folded in half before attaching — creating two layers of fabric at the edge. It&apos;s far more durable and is the default choice for most quilts. Single-fold is one layer, thinner, and best for lightweight projects.</p>
                                <h3 style={{ fontSize: 15, fontWeight: 600, margin: "14px 0 6px", color: "var(--color-text-primary)" }}>Cut Width vs Finished Width</h3>
                                <p>This confuses beginners: a 2.5&quot; cut strip does NOT give 2.5&quot; visible binding. After folding, wrapping around the edge, and accounting for seam allowances, a 2.5&quot; strip yields roughly ½&quot; of visible binding on the front.</p>
                                <h3 style={{ fontSize: 15, fontWeight: 600, margin: "14px 0 6px", color: "var(--color-text-primary)" }}>Diagonal Joining</h3>
                                <p>Join binding strips at a 45° angle (not straight across). This distributes bulk evenly and makes the seam nearly invisible. Place strips at right angles, right sides together, stitch diagonally, trim to ¼&quot;, and press open.</p>
                                <h3 style={{ fontSize: 15, fontWeight: 600, margin: "14px 0 6px", color: "var(--color-text-primary)" }}>When to Use Bias Binding</h3>
                                <p>Bias binding is mandatory for quilts with curved edges, scallops, or hexagonal shapes. The 45° grain direction allows the binding to stretch and conform to curves without puckering. It uses about 40% more fabric than straight grain.</p>
                            </div>
                        )}
                    </div>

                    {/* FAQ */}
                    <section className="faq-section">
                        <h2>Frequently Asked Questions</h2>
                        <div style={{ marginTop: "1.5rem" }}>
                            {faqItems.map((f, i) => (
                                <div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}>
                                    <button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                                        {f.q}
                                        <svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none">
                                            <path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                    <div className="faq-answer">{f.a}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* SIDEBAR */}
                <aside className="calculator-sidebar">
                    <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Binding Quick Tips</h4>
                        <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.8 }}>
                            <div>✓ Always cut WOF (width of fabric) for efficiency</div>
                            <div>✓ 2.5&quot; cut width is the universal standard</div>
                            <div>✓ Leave 6–8&quot; tails at start and end</div>
                            <div>✓ Join with diagonal seams for invisible joins</div>
                            <div>✓ Start midway on a side, never at a corner</div>
                        </div>
                    </div>
                    <div className="glass-card related-tools">
                        <h4>Related Tools</h4>
                        <a href="/quilt/backing-calculator" className="related-tool-link">Quilt Backing Calculator</a>
                        <a href="/quilt/batting-calculator" className="related-tool-link">Quilt Batting Calculator</a>
                        <a href="/quilt/size-calculator" className="related-tool-link">Quilt Size Calculator</a>
                        <a href="/quilt/blocks-needed" className="related-tool-link">Blocks Needed Calculator</a>
                        <a href="/yardage/basic-calculator" className="related-tool-link">Fabric Yardage Calculator</a>
                        <a href="/quilt" className="related-tool-link">All Quilt Tools</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}