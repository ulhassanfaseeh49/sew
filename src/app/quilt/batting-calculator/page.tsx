"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Cloud, ChevronDown, Info, AlertTriangle } from "lucide-react";

/* ─── types & constants ──────────────────────────── */
interface Preset { label: string; w: number; h: number }
const PRESETS: Preset[] = [
    { label: "Mini / Wall", w: 24, h: 24 },
    { label: "Baby / Crib", w: 36, h: 52 },
    { label: "Stroller", w: 30, h: 40 },
    { label: "Toddler", w: 42, h: 52 },
    { label: "Throw", w: 54, h: 72 },
    { label: "Large Throw", w: 60, h: 72 },
    { label: "Twin", w: 60, h: 80 },
    { label: "Twin XL", w: 66, h: 90 },
    { label: "Full / Double", w: 72, h: 90 },
    { label: "Queen", w: 84, h: 92 },
    { label: "King", w: 100, h: 108 },
    { label: "Cal King", w: 104, h: 108 },
];

type QMethod = "home" | "longarm" | "longarm-rental" | "hand" | "tied" | "qayg" | "unsure";
const METHODS: { key: QMethod; label: string; oh: number; note: string }[] = [
    { key: "home", label: "Home Machine", oh: 3, note: "Extra batting helps feed through the machine evenly." },
    { key: "longarm", label: "Longarm (Pro)", oh: 6, note: "Check with your longarm quilter for their specific requirements." },
    { key: "longarm-rental", label: "Longarm (Rental)", oh: 6, note: "Self-service longarm typically requires 4–8\" overhang." },
    { key: "hand", label: "Hand Quilting", oh: 4, note: "Extra batting helps secure in hoop or frame." },
    { key: "tied", label: "Tied Quilt", oh: 2, note: "Minimal overhang needed for tied quilts." },
    { key: "qayg", label: "Quilt-As-You-Go", oh: 2, note: "QAYG batting is cut per block; overhang applies to each block." },
    { key: "unsure", label: "Not Sure Yet", oh: 4, note: "4\" is a safe standard for most quilting methods." },
];

interface BattingSize { label: string; w: number; h: number; cat: string }
const PRE_CUT: BattingSize[] = [
    { label: "Craft", w: 36, h: 45, cat: "Craft" },
    { label: "Crib", w: 45, h: 60, cat: "Baby" },
    { label: "Throw (60×60)", w: 60, h: 60, cat: "Throw" },
    { label: "Throw (60×80)", w: 60, h: 80, cat: "Throw" },
    { label: "Twin", w: 72, h: 90, cat: "Twin" },
    { label: "Full", w: 81, h: 96, cat: "Full" },
    { label: "Queen", w: 90, h: 108, cat: "Queen" },
    { label: "King", w: 120, h: 120, cat: "King" },
];

interface BattingType { key: string; label: string; fiber: string; loft: string; qDist: string; warmth: string; best: string; price: string; shrink: number }
const BATTINGS: BattingType[] = [
    { key: "cotton", label: "100% Cotton", fiber: "Natural", loft: "Low–Medium", qDist: "2–3\"", warmth: "Medium", best: "Traditional quilts, hand quilting, frequently washed quilts", price: "$$", shrink: 4 },
    { key: "blend", label: "80/20 Cotton/Poly", fiber: "Blend", loft: "Low–Medium", qDist: "3–4\"", warmth: "Medium", best: "All-purpose, beginners, machine quilting", price: "$$", shrink: 2 },
    { key: "poly", label: "100% Polyester", fiber: "Synthetic", loft: "Low–Very High", qDist: "4–6\"", warmth: "Light–Medium", best: "Wall hangings, show quilts, high loft projects", price: "$–$$", shrink: 0 },
    { key: "wool", label: "Wool", fiber: "Natural", loft: "Medium–High", qDist: "3–4\"", warmth: "Very Warm", best: "Heirloom quilts, hand quilting, cold climates", price: "$$$", shrink: 1 },
    { key: "bamboo", label: "Bamboo", fiber: "Natural", loft: "Low–Medium", qDist: "2–3\"", warmth: "Medium", best: "Baby quilts, sensitive skin, eco-conscious", price: "$$–$$$", shrink: 3 },
    { key: "silk", label: "Silk", fiber: "Natural", loft: "Very Low", qDist: "1–2\"", warmth: "Light–Medium", best: "Heirloom, art quilts, ultra-lightweight quilts", price: "$$$$", shrink: 0 },
    { key: "fusible", label: "Fusible", fiber: "Various", loft: "Low", qDist: "4–6\"", warmth: "Light", best: "Wall hangings, table runners, stable projects", price: "$$", shrink: 0 },
    { key: "thermal", label: "Thermal / Insulated", fiber: "Metalized Poly", loft: "Low", qDist: "—", warmth: "Heat Resistant", best: "Potholders, oven mitts, placemats", price: "$$", shrink: 0 },
];

const ROLL_WIDTHS = [90, 96, 108, 120];

function toFrac(y: number): string {
    const neg = y < 0; const abs = Math.abs(y); const w = Math.floor(abs); const f = abs - w;
    const fracs: [number, string][] = [[0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
    const s = neg ? "-" : "";
    for (const [v, sym] of fracs) { if (Math.abs(f - v) < 0.02) return w > 0 ? `${s}${w}${sym}` : `${s}${sym}`; }
    if (f > 0.01) return `${s}${abs.toFixed(2)}`;
    return `${s}${w}`;
}
function roundUp4(v: number) { return Math.ceil(v * 4) / 4; }

/* ─── component ──────────────────────────────────── */
export default function Page() {
    const [qw, setQw] = useState("60");
    const [qh, setQh] = useState("80");
    const [method, setMethod] = useState<QMethod>("home");
    const [customOH, setCustomOH] = useState("");
    const [battingType, setBattingType] = useState("blend");
    const [preWash, setPreWash] = useState(false);
    /* Do I Have Enough */
    const [haveMode, setHaveMode] = useState(false);
    const [haveW, setHaveW] = useState("");
    const [haveH, setHaveH] = useState("");
    /* Collapsibles */
    const [showType, setShowType] = useState(false);
    const [showEdu, setShowEdu] = useState(false);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    /* derived */
    const w = parseFloat(qw) || 0;
    const h = parseFloat(qh) || 0;
    const mObj = METHODS.find(m => m.key === method)!;
    const overhang = customOH !== "" ? (parseFloat(customOH) || 0) : mObj.oh;
    const bType = BATTINGS.find(b => b.key === battingType)!;
    const shrinkPct = preWash ? bType.shrink : 0;

    /* calculation */
    const result = useMemo(() => {
        if (w <= 0 || h <= 0) return null;
        let bw = w + overhang * 2;
        let bh = h + overhang * 2;
        if (shrinkPct > 0) { bw *= (1 + shrinkPct / 100); bh *= (1 + shrinkPct / 100); }
        bw = Math.ceil(bw); bh = Math.ceil(bh);

        /* Pre-cut comparison */
        const fits = PRE_CUT.map(pc => {
            const fitsW = pc.w >= bw;
            const fitsH = pc.h >= bh;
            const fits = fitsW && fitsH;
            const sparW = pc.w - bw;
            const sparH = pc.h - bh;
            let status: "too-small" | "tight" | "good" | "generous" = "too-small";
            if (fits) {
                if (sparW >= 10 && sparH >= 10) status = "generous";
                else if (sparW >= 2 && sparH >= 2) status = "good";
                else status = "tight";
            }
            return { ...pc, fits, fitsW, fitsH, sparW, sparH, status };
        });

        /* Best recommendation */
        const goodFits = fits.filter(f => f.status === "good" || f.status === "tight");
        const recommended = goodFits.length > 0 ? goodFits[0] : fits.find(f => f.status === "generous") || null;

        /* By the yard */
        const yardage = ROLL_WIDTHS.map(rw => {
            const coversWidth = rw >= bw;
            const lengthYd = bh / 36;
            const purchaseYd = roundUp4(lengthYd);
            return { rollWidth: rw, coversWidth, lengthYd, purchaseYd };
        });

        return { bw, bh, fits, recommended, yardage };
    }, [w, h, overhang, shrinkPct]);

    /* "Do I Have Enough?" */
    const haveResult = useMemo(() => {
        if (!result || !haveMode) return null;
        const hw = parseFloat(haveW) || 0;
        const hh = parseFloat(haveH) || 0;
        if (hw <= 0 || hh <= 0) return null;
        const enoughW = hw >= result.bw;
        const enoughH = hh >= result.bh;
        return { enough: enoughW && enoughH, sparW: hw - result.bw, sparH: hh - result.bh, hw, hh };
    }, [result, haveMode, haveW, haveH]);

    /* Is baby or potholder? */
    const isBaby = w <= 52 && h <= 60;
    const isPotholder = w <= 15 && h <= 15;

    /* Quick reference */
    const quickRef = PRESETS.filter(p => p.w >= 36).slice(0, 7).map(p => {
        const bw = p.w + 8; const bh = p.h + 8;
        const best = PRE_CUT.find(pc => pc.w >= bw && pc.h >= bh);
        const yd = roundUp4(bh / 36);
        return { name: p.label, size: `${p.w}×${p.h}`, batting: `${bw}×${bh}`, bestPkg: best?.label || "By the yard", yardage: `${toFrac(yd)} yd × 90\"` };
    });

    const copyText = result ? `Batting needed: ${result.bw}" × ${result.bh}" for ${w}" × ${h}" quilt` : "";

    /* FAQ */
    const faqItems = [
        { q: "What size batting do I need for a queen-size quilt?", a: "A standard queen quilt top is 84\" × 92\". With 4\" overhang for home machine quilting, you need batting at least 92\" × 100\". A pre-cut Queen batting (90\" × 108\") works well — verify the width is sufficient." },
        { q: "What is the best batting for machine quilting?", a: "80/20 cotton/polyester blend is the most popular choice for machine quilting. It's easy to work with, doesn't shift much, and gives a nice flat appearance. Needle-punched and scrim battings are also excellent for machine quilting." },
        { q: "What is the difference between cotton and polyester batting?", a: "Cotton batting is breathable, drapes well, and gives a crinkled antique look after washing. Polyester is lightweight, doesn't shrink, but can beard (fibers migrate through fabric). 80/20 blend combines benefits of both." },
        { q: "How much bigger should batting be than the quilt top?", a: "It depends on your quilting method: 2–4\" for home machine, 4–8\" for longarm, 4–6\" for hand quilting, 2–3\" for tied quilts. This extra is called 'overhang' and ensures batting doesn't shift short during quilting." },
        { q: "What batting should I send to a longarm quilter?", a: "Ask your longarm quilter for their specific requirements. Most need 4–8\" larger than the quilt top on all sides. Popular longarm-friendly battings include Hobbs Heirloom 80/20 and Quilters Dream battings with scrim." },
        { q: "Can I use two pieces of batting joined together?", a: "Yes! Butt the edges together and whip-stitch by hand, or overlap 1–2\" and stitch. Fusible batting tape also works. Place the seam where quilting is dense to hide it." },
        { q: "What is quilting distance and why does it matter?", a: "Quilting distance is the maximum space between quilting lines. Each batting type has a maximum safe distance — quilting too far apart causes batting to shift, bunch, and deteriorate over time." },
        { q: "Should I pre-wash my batting?", a: "It depends on the look you want. Pre-washing removes sizing and pre-shrinks so the quilt stays flat. Not pre-washing creates a charming crinkled look after the first wash. Cotton batting shrinks 3–5%; polyester doesn't shrink." },
        { q: "What is loft in batting?", a: "Loft is the thickness of batting. Low loft (¼\") gives a flat, traditional look ideal for machine/hand quilting. High loft (1–2\") is puffy and warm, best for tied quilts and comforters." },
        { q: "What is the best batting for hand quilting?", a: "Wool batting is the gold standard — the needle glides through beautifully. 100% cotton (low loft) is also excellent. Avoid high-loft polyester which is very difficult to hand-quilt through." },
        { q: "What batting is safe for baby quilts?", a: "Use low-loft batting only — avoid high loft (suffocation risk). Organic cotton or bamboo batting are excellent for sensitive skin. Always follow safe sleep guidelines." },
        { q: "What is 80/20 batting?", a: "80/20 refers to 80% cotton and 20% polyester blend. It's the most popular all-purpose batting: combines cotton's drape and breathability with polyester's stability and lightness." },
    ];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "Batting Size Calculator" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    {/* HEADER */}
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Cloud size={14} strokeWidth={1.5} /> Quilt #137</span>
                        <h1>Quilt Batting Size Calculator</h1>
                        <p>Find the exact batting size for your quilt, compare pre-cut packages, and get batting type recommendations.</p>
                    </div>

                    {/* ① QUILT SIZE */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>① Quilt Top Size</h2>
                        <div className={styles.presets}><div className={styles.presetGrid}>
                            {PRESETS.map((p, i) => (
                                <button key={i} className={`btn btn-sm btn-secondary ${w === p.w && h === p.h ? styles.presetActive : ""}`}
                                    onClick={() => { setQw(String(p.w)); setQh(String(p.h)); }}>{p.label}</button>
                            ))}
                        </div></div>
                        <div className="calculator-form" style={{ marginTop: 12 }}>
                            <div className="calculator-form-row">
                                <div className="input-group"><label className="input-label" htmlFor="qw">Width (inches)</label>
                                    <input id="qw" type="number" className="input-field" value={qw} onChange={e => setQw(e.target.value)} min={1} /></div>
                                <div className="input-group"><label className="input-label" htmlFor="qh">Height (inches)</label>
                                    <input id="qh" type="number" className="input-field" value={qh} onChange={e => setQh(e.target.value)} min={1} /></div>
                            </div>
                        </div>
                    </div>

                    {/* ② QUILTING METHOD */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>② Quilting Method</h2>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                            {METHODS.map(m => (
                                <button key={m.key} className={`btn btn-sm ${method === m.key ? "btn-primary" : "btn-secondary"}`}
                                    onClick={() => { setMethod(m.key); setCustomOH(""); }}>{m.label}</button>
                            ))}
                        </div>
                        <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 10 }}>
                            <Info size={12} style={{ display: "inline", marginRight: 4 }} />{mObj.note}
                        </div>
                        <div className="calculator-form-row" style={{ maxWidth: 300 }}>
                            <div className="input-group">
                                <label className="input-label">Overhang per side (inches)</label>
                                <input type="number" className="input-field" placeholder={String(mObj.oh)}
                                    value={customOH} onChange={e => setCustomOH(e.target.value)} min={0} max={24} />
                            </div>
                        </div>
                        {overhang > 12 && <div style={{ fontSize: 12, color: "hsl(35,80%,45%)", marginTop: 6 }}>
                            <AlertTriangle size={12} style={{ display: "inline", marginRight: 4 }} />Unusual overhang — double-check your quilter&apos;s requirements.
                        </div>}
                    </div>

                    {/* ③ BATTING TYPE */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
                            onClick={() => setShowType(!showType)}>
                            ③ Batting Type: {bType.label} <ChevronDown size={14} style={{ transform: showType ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                        </button>
                        {showType && (
                            <div style={{ marginTop: 12 }}>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                                    {BATTINGS.map(b => (
                                        <button key={b.key} className={`btn btn-sm ${battingType === b.key ? "btn-primary" : "btn-secondary"}`}
                                            onClick={() => setBattingType(b.key)}>{b.label}</button>
                                    ))}
                                </div>
                                <div style={{ background: "var(--color-bg-secondary)", padding: 12, borderRadius: "var(--radius-md)", fontSize: 13, lineHeight: 1.7 }}>
                                    <strong>{bType.label}</strong> — {bType.fiber}<br />
                                    Loft: {bType.loft} · Quilting distance: {bType.qDist} · Warmth: {bType.warmth}<br />
                                    Best for: {bType.best}<br />
                                    Price: {bType.price} · Shrinkage: {bType.shrink > 0 ? `~${bType.shrink}%` : "None"}
                                </div>
                                <label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 13, marginTop: 10, color: "var(--color-text-secondary)" }}>
                                    <input type="checkbox" checked={preWash} onChange={e => setPreWash(e.target.checked)} />
                                    Pre-wash batting? {preWash && bType.shrink > 0 && <span style={{ color: "var(--color-text-tertiary)" }}>(adds {bType.shrink}% to dimensions)</span>}
                                </label>
                            </div>
                        )}
                    </div>

                    {/* SAFETY NOTES */}
                    {isBaby && battingType !== "thermal" && (
                        <div style={{ background: "hsl(45,90%,95%)", border: "1px solid hsl(45,80%,70%)", padding: "12px 16px", borderRadius: "var(--radius-md)", fontSize: 13, marginBottom: 16 }}>
                            <strong>⚠️ Baby Quilt Safety:</strong> Use <strong>low-loft</strong> batting only. High loft is not recommended for baby sleep quilts. Organic cotton or bamboo are ideal for sensitive skin.
                        </div>
                    )}
                    {isPotholder && battingType !== "thermal" && (
                        <div style={{ background: "hsl(0,80%,95%)", border: "1px solid hsl(0,60%,70%)", padding: "12px 16px", borderRadius: "var(--radius-md)", fontSize: 13, marginBottom: 16 }}>
                            <strong>🔥 Potholder / Oven Mitt Warning:</strong> Standard batting is <strong>NOT heat resistant</strong>. Use <strong>Thermal / Insulated batting</strong> (like Insul-Bright) for any item that will contact heat.
                        </div>
                    )}

                    {/* ═══ RESULTS ═══ */}
                    {result && (<>
                        <div className={`calculator-results ${styles.results}`}>
                            <div className="result-card">
                                <div className="result-value">{result.bw}&quot; × {result.bh}&quot;</div>
                                <div className="result-label">
                                    Required batting size · {(result.bw * 2.54).toFixed(0)} × {(result.bh * 2.54).toFixed(0)} cm
                                </div>
                            </div>

                            <div className={styles.resultDetails}>
                                <div className={styles.resultRow}><span>Quilt top</span><strong>{w}&quot; × {h}&quot;</strong></div>
                                <div className={styles.resultRow}><span>Overhang ({overhang}&quot; all sides)</span><strong>+{overhang * 2}&quot; W × +{overhang * 2}&quot; H</strong></div>
                                {shrinkPct > 0 && <div className={styles.resultRow}><span>Pre-wash shrinkage ({shrinkPct}%)</span><strong>+{Math.ceil((w + overhang * 2) * shrinkPct / 100)}&quot; W × +{Math.ceil((h + overhang * 2) * shrinkPct / 100)}&quot; H</strong></div>}
                                <div className={styles.resultRow}><span>Batting type</span><strong>{bType.label}</strong></div>
                                <div className={styles.resultRow}><span>Max quilting distance</span><strong>{bType.qDist}</strong></div>
                            </div>
                        </div>

                        {/* RECOMMENDED */}
                        {result.recommended && (
                            <div style={{ background: "var(--color-accent-light)", padding: "14px 18px", borderRadius: "var(--radius-md)", marginBottom: 16, border: "1px solid var(--color-accent-primary)" }}>
                                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--color-accent-primary)", marginBottom: 4 }}>
                                    ✓ Recommended: {result.recommended.label} batting ({result.recommended.w}&quot; × {result.recommended.h}&quot;)
                                </div>
                                <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
                                    Gives you {result.recommended.sparW}&quot; extra width and {result.recommended.sparH}&quot; extra height.
                                </div>
                            </div>
                        )}

                        {/* PRE-CUT COMPARISON */}
                        <div className={`glass-card ${styles.calculatorCard}`}>
                            <h2 className={styles.calcTitle}>Pre-Cut Batting Comparison</h2>
                            <div className={styles.tableWrap}>
                                <table className={styles.convTable}>
                                    <thead><tr><th>Package</th><th>Size</th><th>Fits?</th><th>Spare</th><th>Verdict</th></tr></thead>
                                    <tbody>
                                        {result.fits.map((f, i) => (
                                            <tr key={i} style={{
                                                background: f.status === "too-small" ? "hsl(0,60%,97%)" :
                                                    f.status === "tight" ? "hsl(45,80%,95%)" :
                                                        f.status === "good" ? "hsl(140,50%,95%)" : "hsl(210,50%,95%)"
                                            }}>
                                                <td style={{ fontWeight: 600, fontFamily: "inherit" }}>{f.label}</td>
                                                <td>{f.w}&quot; × {f.h}&quot;</td>
                                                <td>{f.fits ? "✓ Yes" : "✗ No"}</td>
                                                <td>{f.fits ? `+${f.sparW}" W, +${f.sparH}" H` : `${!f.fitsW ? `Short ${-f.sparW}" W` : "OK"} ${!f.fitsH ? `Short ${-f.sparH}" H` : "OK"}`}</td>
                                                <td style={{
                                                    fontSize: 12, fontWeight: 500, color:
                                                        f.status === "too-small" ? "hsl(0,60%,45%)" :
                                                            f.status === "tight" ? "hsl(35,70%,40%)" :
                                                                f.status === "good" ? "hsl(140,50%,35%)" : "hsl(210,50%,40%)"
                                                }}>
                                                    {f.status === "too-small" ? "Too small" : f.status === "tight" ? "Tight fit" : f.status === "good" ? "Good fit ★" : "Generous"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* BY THE YARD */}
                        <div className={`glass-card ${styles.calculatorCard}`}>
                            <h2 className={styles.calcTitle}>Batting by the Yard</h2>
                            <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 10 }}>
                                Need {result.bh}&quot; of length. Standard batting rolls come in these widths:
                            </p>
                            <div className={styles.tableWrap}>
                                <table className={styles.convTable}>
                                    <thead><tr><th>Roll Width</th><th>Covers Width?</th><th>Length Needed</th><th>Buy</th></tr></thead>
                                    <tbody>
                                        {result.yardage.map((y, i) => (
                                            <tr key={i} style={{ background: y.coversWidth ? "hsl(140,50%,97%)" : "hsl(0,60%,97%)" }}>
                                                <td style={{ fontWeight: 600 }}>{y.rollWidth}&quot;</td>
                                                <td>{y.coversWidth ? `✓ Yes (${y.rollWidth - result.bw}" spare)` : `✗ No (short by ${result.bw - y.rollWidth}")`}</td>
                                                <td>{y.lengthYd.toFixed(2)} yd</td>
                                                <td style={{ fontWeight: 600 }}>{toFrac(y.purchaseYd)} yd</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* SVG DIAGRAM */}
                        <div className={`glass-card ${styles.calculatorCard}`}>
                            <h2 className={styles.calcTitle}>Batting Size Diagram</h2>
                            <div style={{ width: "100%", maxWidth: 500, margin: "0 auto" }}>
                                <svg viewBox="0 0 320 280" style={{ width: "100%", height: "auto" }}>
                                    {/* Recommended pre-cut (if applicable) */}
                                    {result.recommended && (() => {
                                        const scale = 260 / Math.max(result.recommended.w, result.recommended.h);
                                        const rW = result.recommended.w * scale;
                                        const rH = result.recommended.h * scale;
                                        const rx = (320 - rW) / 2;
                                        const ry = (280 - rH) / 2;
                                        const bW2 = result.bw * scale;
                                        const bH2 = result.bh * scale;
                                        const bx = (320 - bW2) / 2;
                                        const by = (280 - bH2) / 2;
                                        const qW = w * scale;
                                        const qH = h * scale;
                                        const qx = (320 - qW) / 2;
                                        const qy = (280 - qH) / 2;
                                        return (<>
                                            <rect x={rx} y={ry} width={rW} height={rH} fill="hsl(210,50%,92%)" stroke="hsl(210,50%,60%)" strokeWidth={1} strokeDasharray="4 2" rx={2} />
                                            <rect x={bx} y={by} width={bW2} height={bH2} fill="hsl(140,40%,90%)" stroke="hsl(140,50%,50%)" strokeWidth={1.5} rx={2} />
                                            <rect x={qx} y={qy} width={qW} height={qH} fill="white" stroke="hsl(0,0%,40%)" strokeWidth={1.5} rx={2} />
                                            <text x={qx + qW / 2} y={qy + qH / 2 - 6} textAnchor="middle" fontSize={11} fontWeight={600} fill="hsl(0,0%,30%)">Quilt Top</text>
                                            <text x={qx + qW / 2} y={qy + qH / 2 + 8} textAnchor="middle" fontSize={10} fill="hsl(0,0%,50%)">{w}&quot;×{h}&quot;</text>
                                            {/* Overhang arrows */}
                                            <text x={bx + bW2 / 2} y={by - 4} textAnchor="middle" fontSize={9} fill="hsl(140,50%,40%)">Required: {result.bw}&quot;×{result.bh}&quot;</text>
                                            <text x={rx + rW / 2} y={ry + rH + 14} textAnchor="middle" fontSize={9} fill="hsl(210,50%,45%)">{result.recommended.label}: {result.recommended.w}&quot;×{result.recommended.h}&quot;</text>
                                            {/* Overhang label */}
                                            <line x1={qx} y1={by + 8} x2={bx} y2={by + 8} stroke="hsl(140,50%,50%)" strokeWidth={1} markerEnd="url(#arr)" />
                                            <text x={(qx + bx) / 2} y={by + 6} textAnchor="middle" fontSize={8} fill="hsl(140,50%,40%)">{overhang}&quot;</text>
                                            <defs><marker id="arr" viewBox="0 0 6 6" refX={6} refY={3} markerWidth={4} markerHeight={4} orient="auto"><path d="M0,0 L6,3 L0,6Z" fill="hsl(140,50%,50%)" /></marker></defs>
                                        </>);
                                    })()}
                                </svg>
                                <div style={{ display: "flex", justifyContent: "center", gap: 16, fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 4 }}>
                                    <span>⬜ Quilt Top</span>
                                    <span style={{ color: "hsl(140,50%,40%)" }}>🟩 Required Batting</span>
                                    <span style={{ color: "hsl(210,50%,50%)" }}>🟦 Pre-Cut Package</span>
                                </div>
                            </div>
                        </div>

                        {/* DO I HAVE ENOUGH */}
                        <div className={`glass-card ${styles.calculatorCard}`}>
                            <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
                                onClick={() => setHaveMode(!haveMode)}>
                                🧶 Do I Have Enough Batting? <ChevronDown size={14} style={{ transform: haveMode ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                            </button>
                            {haveMode && (
                                <div style={{ marginTop: 12 }}>
                                    <div className="calculator-form-row">
                                        <div className="input-group"><label className="input-label">Your batting width&quot;</label>
                                            <input type="number" className="input-field" placeholder="e.g., 90" value={haveW} onChange={e => setHaveW(e.target.value)} min={0} /></div>
                                        <div className="input-group"><label className="input-label">Your batting height&quot;</label>
                                            <input type="number" className="input-field" placeholder="e.g., 108" value={haveH} onChange={e => setHaveH(e.target.value)} min={0} /></div>
                                    </div>
                                    {haveResult && (
                                        <div style={{ marginTop: 10, padding: 12, borderRadius: "var(--radius-md)", background: haveResult.enough ? "hsl(140,50%,95%)" : "hsl(0,60%,95%)", fontSize: 14 }}>
                                            {haveResult.enough ? (
                                                <><strong style={{ color: "hsl(140,50%,35%)" }}>✅ Yes, you have enough!</strong>
                                                    <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}> — {haveResult.sparW}&quot; spare width, {haveResult.sparH}&quot; spare height</span></>
                                            ) : (
                                                <><strong style={{ color: "hsl(0,60%,45%)" }}>❌ Not enough.</strong>
                                                    <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
                                                        {haveResult.sparW < 0 ? ` Short by ${-haveResult.sparW}" in width.` : ""}
                                                        {haveResult.sparH < 0 ? ` Short by ${-haveResult.sparH}" in height.` : ""}
                                                        {" "}Consider piecing two batting pieces together.
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

                    {/* BATTING TYPE COMPARISON TABLE */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Batting Type Comparison</h2>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead><tr><th>Type</th><th>Fiber</th><th>Quilting Dist.</th><th>Warmth</th><th>Price</th><th>Best For</th></tr></thead>
                                <tbody>
                                    {BATTINGS.filter(b => b.key !== "thermal" && b.key !== "fusible").map(b => (
                                        <tr key={b.key} style={b.key === battingType ? { background: "var(--color-accent-light)" } : undefined}>
                                            <td style={{ fontWeight: 600, fontFamily: "inherit" }}>{b.label}</td>
                                            <td>{b.fiber}</td>
                                            <td>{b.qDist}</td>
                                            <td>{b.warmth}</td>
                                            <td>{b.price}</td>
                                            <td style={{ fontSize: 12 }}>{b.best}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* QUICK REFERENCE */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Quick Reference — Standard Quilt Batting Sizes</h2>
                        <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 10 }}>Based on 4&quot; overhang all sides. Use calculator above for your specific requirements.</p>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead><tr><th>Quilt Size</th><th>Required Batting</th><th>Best Pre-Cut</th><th>By the Yard</th></tr></thead>
                                <tbody>
                                    {quickRef.map((r, i) => (
                                        <tr key={i}>
                                            <td style={{ fontFamily: "inherit" }}>{r.name} ({r.size}&quot;)</td>
                                            <td>{r.batting}&quot;</td>
                                            <td style={{ fontWeight: 600 }}>{r.bestPkg}</td>
                                            <td>{r.yardage}</td>
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
                            📚 Batting Basics for Beginners <ChevronDown size={14} style={{ transform: showEdu ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                        </button>
                        {showEdu && (
                            <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
                                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: "var(--color-text-primary)" }}>What is Batting?</h3>
                                <p>Batting (also called wadding) is the soft layer between a quilt top and backing. It provides warmth, loft, and structure. Every quilt has three layers: the pieced top, the batting in the middle, and the backing fabric.</p>
                                <h3 style={{ fontSize: 15, fontWeight: 600, margin: "14px 0 6px", color: "var(--color-text-primary)" }}>Why Must Batting Be Larger?</h3>
                                <p>During quilting, fabric shifts and draws in slightly. Extra batting (overhang) ensures the batting doesn&apos;t come up short at the edges. Longarm quilters especially need generous overhang because their frames pull the layers taut.</p>
                                <h3 style={{ fontSize: 15, fontWeight: 600, margin: "14px 0 6px", color: "var(--color-text-primary)" }}>Pre-Cut vs. By the Yard</h3>
                                <p>Pre-cut packages come in standard sizes (Crib, Twin, Queen, King) and are convenient. Buying by the yard from a roll is often more economical for odd sizes or when you can reuse leftover batting.</p>
                                <h3 style={{ fontSize: 15, fontWeight: 600, margin: "14px 0 6px", color: "var(--color-text-primary)" }}>Storing Batting</h3>
                                <p>Roll batting instead of folding to avoid permanent crease lines. Store in a cool, dry place away from direct sunlight. Compressed polyester batting may lose loft permanently.</p>
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
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Quilting Distance Check</h4>
                        <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.8 }}>
                            <p style={{ marginBottom: 8 }}>Your batting ({bType.label}) allows a max quilting distance of <strong>{bType.qDist}</strong>.</p>
                            <p style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
                                Always check the manufacturer&apos;s specific requirements — they vary by product even within the same fiber type.
                            </p>
                        </div>
                    </div>
                    <div className="glass-card related-tools">
                        <h4>Related Tools</h4>
                        <a href="/quilt/backing-calculator" className="related-tool-link">Quilt Backing Calculator</a>
                        <a href="/quilt/binding-calculator" className="related-tool-link">Quilt Binding Calculator</a>
                        <a href="/quilt/size-calculator" className="related-tool-link">Quilt Size Calculator</a>
                        <a href="/quilt/blocks-needed" className="related-tool-link">Blocks Needed Calculator</a>
                        <a href="/shrinkage/pre-wash-estimator" className="related-tool-link">Shrinkage Calculator</a>
                        <a href="/quilt" className="related-tool-link">All Quilt Tools</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}