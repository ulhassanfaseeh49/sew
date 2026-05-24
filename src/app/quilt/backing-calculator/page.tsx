"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Scissors, Info } from "lucide-react";

/* ─── constants ────────────────────────────────────────────────── */
const PRESETS: { label: string; w: number; h: number }[] = [
    { label: "Baby / Crib", w: 36, h: 52 },
    { label: "Stroller", w: 30, h: 40 },
    { label: "Throw", w: 54, h: 72 },
    { label: "Large Throw", w: 60, h: 72 },
    { label: "Twin", w: 60, h: 80 },
    { label: "Twin XL", w: 66, h: 90 },
    { label: "Full / Double", w: 72, h: 90 },
    { label: "Queen", w: 84, h: 92 },
    { label: "King", w: 100, h: 108 },
    { label: "Cal King", w: 104, h: 108 },
];

const FABRIC_WIDTHS = [
    { label: '36"', value: 36 },
    { label: '42" (44 washed)', value: 42 },
    { label: '44"', value: 44 },
    { label: '45"', value: 45 },
    { label: '54"', value: 54 },
    { label: '60"', value: 60 },
    { label: '90"', value: 90 },
    { label: '108" wide back', value: 108 },
    { label: '118"', value: 118 },
    { label: '120"', value: 120 },
];

type QuiltMethod = "home" | "longarm" | "longarm-self" | "hand" | "tied" | "none";

const METHOD_INFO: Record<QuiltMethod, { label: string; overhang: number; note: string }> = {
    home: { label: "Home Machine", overhang: 3, note: "Standard 2-4\" overhang for domestic machines." },
    longarm: { label: "Longarm (Professional)", overhang: 6, note: "Most longarm quilters require 4-8\" on all sides." },
    "longarm-self": { label: "Longarm (Self / Rental)", overhang: 6, note: "Same as professional longarm; check rental facility requirements." },
    hand: { label: "Hand Quilting", overhang: 5, note: "Extra backing extends beyond quilting hoop edges." },
    tied: { label: "Tied Quilt", overhang: 2, note: "Minimal overhang needed for tying." },
    none: { label: "Not Decided Yet", overhang: 4, note: "Using 4\" default; adjust once you decide." },
};

type SeamOption = "none" | "center" | "offset" | "two-seam";
type Buffer = "none" | "small" | "standard" | "generous";

const BUFFER_MAP: Record<Buffer, { label: string; val: number }> = {
    none: { label: "None (exact)", val: 0 },
    small: { label: "+0.25 yd", val: 0.25 },
    standard: { label: "+0.5 yd (recommended)", val: 0.5 },
    generous: { label: "+1 yd", val: 1 },
};

/* ─── helpers ──────────────────────────────────────────────────── */
function toFraction(y: number): string {
    const whole = Math.floor(y);
    const frac = y - whole;
    const fracs: [number, string][] = [[0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
    for (const [v, s] of fracs) {
        if (Math.abs(frac - v) < 0.01) return whole > 0 ? `${whole}${s}` : s;
    }
    if (frac > 0.01) return y.toFixed(2);
    return whole.toString();
}

function roundUpEighth(v: number): number {
    return Math.ceil(v * 8) / 8;
}

function roundUpQuarter(v: number): number {
    return Math.ceil(v * 4) / 4;
}

function ydsToMeters(y: number): string {
    return (y * 0.9144).toFixed(2);
}

/* ─── seam calc engine ─────────────────────────────────────────── */
interface CalcResult {
    seamType: SeamOption;
    panelCount: number;
    totalLengthInches: number;   // total fabric length (along fabric bolt)
    totalYards: number;          // raw yards
    purchaseYards: number;       // rounded + buffer
    backingW: number;
    backingH: number;
    panels: { widthUsed: number; lengthNeeded: number }[];
    seamAllowanceTotal: number;
}

function calcBacking(
    quiltW: number, quiltH: number,
    overhang: number, usableWidth: number,
    seamAllowance: number, bufferYd: number,
    seamPref: SeamOption
): CalcResult {
    const backingW = quiltW + overhang * 2;
    const backingH = quiltH + overhang * 2;

    // Can we do it seamless?
    if (usableWidth >= backingW) {
        const raw = backingH / 36;
        const purchase = roundUpQuarter(raw) + bufferYd;
        return {
            seamType: "none", panelCount: 1,
            totalLengthInches: backingH, totalYards: roundUpEighth(raw),
            purchaseYards: purchase, backingW, backingH,
            panels: [{ widthUsed: backingW, lengthNeeded: backingH }],
            seamAllowanceTotal: 0,
        };
    }

    // Seam required — calculate for different options
    const sa = seamAllowance;

    if (seamPref === "two-seam" || (usableWidth * 2 - sa) < backingW) {
        // Three panels needed
        const panelW = usableWidth;
        const totalCoverage = panelW * 3 - sa * 2;
        if (totalCoverage < backingW) {
            // Extremely wide quilt — still do 3 panels, might need wider fabric
        }
        const rawPerPanel = backingH / 36;
        const totalRaw = rawPerPanel * 3;
        const purchase = roundUpQuarter(totalRaw) + bufferYd;
        return {
            seamType: "two-seam", panelCount: 3,
            totalLengthInches: backingH * 3, totalYards: roundUpEighth(totalRaw),
            purchaseYards: purchase, backingW, backingH,
            panels: [
                { widthUsed: panelW, lengthNeeded: backingH },
                { widthUsed: panelW, lengthNeeded: backingH },
                { widthUsed: Math.max(1, Math.min(panelW, backingW - (panelW * 2 - sa * 2))), lengthNeeded: backingH },
            ],
            seamAllowanceTotal: sa * 2,
        };
    }

    // Two panels (one seam)
    const panel1W = usableWidth;
    const panel2W = backingW - usableWidth + sa;
    const rawPerPanel = backingH / 36;
    const totalRaw = rawPerPanel * 2;
    const purchase = roundUpQuarter(totalRaw) + bufferYd;
    const st: SeamOption = seamPref === "offset" ? "offset" : "center";

    return {
        seamType: st, panelCount: 2,
        totalLengthInches: backingH * 2, totalYards: roundUpEighth(totalRaw),
        purchaseYards: purchase, backingW, backingH,
        panels: [
            { widthUsed: panel1W, lengthNeeded: backingH },
            { widthUsed: panel2W, lengthNeeded: backingH },
        ],
        seamAllowanceTotal: sa,
    };
}

/* ─── Quick Reference Pre-computed ─────────────────────────────── */
function quickRefRow(w: number, h: number, fabricW: number, overhang: number) {
    const r = calcBacking(w, h, overhang, fabricW - 1.5, 0.5, 0, "offset");
    return { yds: roundUpQuarter(r.totalYards), seams: r.panelCount - 1 };
}

/* ─── component ────────────────────────────────────────────────── */
export default function Page() {
    /* state */
    const [quiltWidth, setQuiltWidth] = useState("60");
    const [quiltHeight, setQuiltHeight] = useState("80");
    const [activePreset, setActivePreset] = useState<number | null>(null);
    const [method, setMethod] = useState<QuiltMethod>("home");
    const [customOverhang, setCustomOverhang] = useState("");
    const [fabricWidthIdx, setFabricWidthIdx] = useState(2); // 44" default
    const [selvageDeduct, setSelvageDeduct] = useState("1.5");
    const [seamAllowance, setSeamAllowance] = useState("0.5");
    const [seamPref, setSeamPref] = useState<SeamOption>("offset");
    const [buffer, setBuffer] = useState<Buffer>("standard");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [showBreakdown, setShowBreakdown] = useState(true);

    /* derived */
    const qw = parseFloat(quiltWidth) || 60;
    const qh = parseFloat(quiltHeight) || 80;
    const overhang = customOverhang !== "" ? (parseFloat(customOverhang) || 0) : METHOD_INFO[method].overhang;
    const fabricW = FABRIC_WIDTHS[fabricWidthIdx].value;
    const selvage = parseFloat(selvageDeduct) || 1.5;
    const usableW = fabricW - selvage;
    const sa = parseFloat(seamAllowance) || 0.5;
    const bufYd = BUFFER_MAP[buffer].val;

    const result = useMemo(() =>
        calcBacking(qw, qh, overhang, usableW, sa, bufYd, seamPref),
        [qw, qh, overhang, usableW, sa, bufYd, seamPref]
    );

    /* width comparison */
    const widthComparison = useMemo(() => {
        const widths = [42, 60, 108];
        return widths.map(fw => {
            const r = calcBacking(qw, qh, overhang, fw - 1.5, sa, bufYd, "offset");
            return { fw, ...r };
        });
    }, [qw, qh, overhang, sa, bufYd]);

    /* quick reference */
    const quickRef = useMemo(() =>
        PRESETS.map(p => ({
            label: p.label,
            w: p.w, h: p.h,
            f44: quickRefRow(p.w, p.h, 44, 6),
            f60: quickRefRow(p.w, p.h, 60, 6),
            f108: quickRefRow(p.w, p.h, 108, 6),
        })),
        []
    );

    /* preset click */
    function applyPreset(i: number) {
        setActivePreset(i);
        setQuiltWidth(String(PRESETS[i].w));
        setQuiltHeight(String(PRESETS[i].h));
    }

    /* seam comparison for current quilt */
    const seamOptions = useMemo(() => {
        if (result.seamType === "none") return null;
        const opts: { label: string; type: SeamOption; r: CalcResult }[] = [
            { label: "Centered vertical seam", type: "center", r: calcBacking(qw, qh, overhang, usableW, sa, bufYd, "center") },
            { label: "Offset vertical seam (⅓–⅔)", type: "offset", r: calcBacking(qw, qh, overhang, usableW, sa, bufYd, "offset") },
        ];
        const twoSeam = calcBacking(qw, qh, overhang, usableW, sa, bufYd, "two-seam");
        opts.push({ label: "Two seams (3 panels)", type: "two-seam", r: twoSeam });
        return opts;
    }, [qw, qh, overhang, usableW, sa, bufYd]);

    const copyText = `Backing needed: ${toFraction(result.purchaseYards)} yards of ${fabricW}" fabric (${result.seamType === "none" ? "no seam" : result.panelCount + " panels"})`;

    /* ─── FAQ ─────────────────────────────────────────── */
    const faqItems = [
        { q: "How much backing fabric do I need for a queen-size quilt?", a: "A queen quilt (84×92\") typically needs about 3 yards of 108\" wide backing fabric or 5.5–6 yards of 44\" fabric. The exact amount depends on your quilting method, overhang requirements, and seam placement. Use the calculator above for a precise answer." },
        { q: "Do I need to add extra backing for a longarm quilter?", a: "Yes. Most longarm quilters require 4–8 inches of extra backing on ALL sides (not total). The industry standard is 6\" per side. Always confirm with your specific longarm quilter before cutting, as some require more." },
        { q: "What is the best fabric width for quilt backing?", a: "108\" wide backing fabric is easiest because it eliminates seams for most quilts up to king size. However, 44\" quilting cotton gives you the most fabric choices and can be more affordable per yard." },
        { q: "Should the backing seam be horizontal or vertical?", a: "Vertical seams (running top to bottom) are most common and preferred by many longarm quilters. An offset vertical seam (placed at ⅓ from one edge) is less visible than a centered seam. Horizontal seams work when the quilt is wider than it is long." },
        { q: "How do I calculate quilt backing yardage?", a: "Add your overhang to the quilt dimensions on all sides. Divide the total backing width by your fabric's usable width to find how many panels you need. Multiply the number of panels by the backing length, convert to yards (÷36), then add a safety buffer." },
        { q: "Can I use regular fabric for quilt backing?", a: "Yes! Standard 44\" quilting cotton works perfectly for quilt backing. You'll need seams for quilts wider than about 40\", but this is completely normal. Some quilters even use bed sheets, though the high thread count can be harder to quilt through." },
        { q: "What is wide quilt backing fabric?", a: "Wide backing fabric is specially manufactured in widths of 90\", 108\", 118\", or 120\". It eliminates the need for seams in most quilt sizes. Common brands include Moda Grunge Wide Backs, Robert Kaufman, and Riley Blake." },
        { q: "How much extra backing do I need for a longarm quilter?", a: "Add 4–8 inches per side beyond your quilt top dimensions. For a typical queen quilt (84×92\"), your backing should be at least 96×104\" (with 6\" overhang). This extra fabric is needed because the longarm frame clamps and tensions the fabric." },
        { q: "Should I pre-wash my quilt backing fabric?", a: "Pre-washing is a personal choice. If you pre-wash, buy 3–5% extra fabric to account for shrinkage. If you don't pre-wash, your finished quilt will shrink slightly on first wash, creating a vintage puckered look. Be consistent: pre-wash ALL fabrics in the quilt, or none." },
        { q: "How do I piece a quilt backing?", a: "Cut your fabric into panels the length of your backing. Sew panels together using a ½\" seam allowance. Press seams open for a flatter finish. Trim the backing to the required size with even overhang on all sides. An offset seam is less noticeable than a centered one." },
        { q: "How do I join backing panels?", a: "Place panels right sides together, aligning all edges. Sew with a ½\" seam allowance. Press the seam open (not to one side) for the flattest result. Trim selvages before joining. For prints, consider how the pattern will look across the seam." },
        { q: "What size backing do I need for a king-size quilt?", a: "A king quilt (100×108\") with 6\" overhang needs a 112×120\" backing. With 108\" wide fabric, you need about 3.5 yards. With 44\" fabric, you'll need about 9.5–10 yards with two vertical seams creating three panels." },
    ];

    /* ─── render ─────────────────────────────────────── */
    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "Backing Yardage Calculator" }]} />

            <div className="calculator-layout">
                <div className="calculator-main">
                    {/* HEADER */}
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Scissors size={14} strokeWidth={1.5} /> Quilt #136</span>
                        <h1>Quilt Backing Yardage Calculator</h1>
                        <p>Calculate exactly how much backing fabric to buy for any quilt size — with seam placement, overhang options, and longarm requirements.</p>
                    </div>

                    {/* ── SECTION 1 — QUILT SIZE ────────────── */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>① Quilt Top Dimensions</h2>

                        {/* Presets */}
                        <div className={styles.presets} style={{ marginBottom: 18 }}>
                            <span className={styles.presetsLabel}>Quick-select a standard size:</span>
                            <div className={styles.presetGrid}>
                                {PRESETS.map((p, i) => (
                                    <button key={i} className={`btn btn-sm btn-secondary ${activePreset === i ? styles.presetActive : ""}`}
                                        onClick={() => applyPreset(i)}>
                                        {p.label} ({p.w}×{p.h})
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="calculator-form">
                            <div className="calculator-form-row">
                                <div className="input-group">
                                    <label className="input-label">Quilt Width (inches)</label>
                                    <input type="number" className="input-field" value={quiltWidth}
                                        onChange={e => { setQuiltWidth(e.target.value); setActivePreset(null); }} min={1} />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Quilt Height (inches)</label>
                                    <input type="number" className="input-field" value={quiltHeight}
                                        onChange={e => { setQuiltHeight(e.target.value); setActivePreset(null); }} min={1} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── SECTION 2 — QUILTING METHOD ────────── */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>② Quilting Method &amp; Overhang</h2>
                        <div className="calculator-form">
                            <div className="input-group" style={{ marginBottom: 12 }}>
                                <label className="input-label">Quilting Method</label>
                                <select className="input-field" value={method}
                                    onChange={e => { setMethod(e.target.value as QuiltMethod); setCustomOverhang(""); }}>
                                    {(Object.keys(METHOD_INFO) as QuiltMethod[]).map(k => (
                                        <option key={k} value={k}>{METHOD_INFO[k].label}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ fontSize: 13, color: "var(--color-text-tertiary)", marginBottom: 12, display: "flex", alignItems: "flex-start", gap: 6 }}>
                                <Info size={14} style={{ marginTop: 2, flexShrink: 0 }} /> {METHOD_INFO[method].note}
                            </div>
                            <div className="calculator-form-row">
                                <div className="input-group">
                                    <label className="input-label">Overhang per side (inches)</label>
                                    <input type="number" className="input-field"
                                        value={customOverhang !== "" ? customOverhang : String(METHOD_INFO[method].overhang)}
                                        onChange={e => setCustomOverhang(e.target.value)} min={0} step={0.5} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── SECTION 3 — FABRIC WIDTH ──────────── */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>③ Backing Fabric Width</h2>
                        <div className="calculator-form">
                            <div className="calculator-form-row">
                                <div className="input-group">
                                    <label className="input-label">Fabric Bolt Width</label>
                                    <select className="input-field" value={fabricWidthIdx}
                                        onChange={e => setFabricWidthIdx(Number(e.target.value))}>
                                        {FABRIC_WIDTHS.map((fw, i) => (
                                            <option key={i} value={i}>{fw.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Selvage Deduction (inches)</label>
                                    <input type="number" className="input-field" value={selvageDeduct}
                                        onChange={e => setSelvageDeduct(e.target.value)} min={0} step={0.5} />
                                </div>
                            </div>
                            <div style={{ fontSize: 13, color: "var(--color-text-tertiary)", marginTop: 4 }}>
                                Usable width: <strong style={{ color: "var(--color-text-primary)" }}>{usableW.toFixed(1)}&quot;</strong> after selvage removal
                            </div>
                        </div>
                    </div>

                    {/* ── SECTION 4 — SEAM & BUFFER ─────────── */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>④ Seam &amp; Safety Buffer</h2>
                        <div className="calculator-form">
                            <div className="calculator-form-row">
                                <div className="input-group">
                                    <label className="input-label">Seam Allowance (inches)</label>
                                    <select className="input-field" value={seamAllowance}
                                        onChange={e => setSeamAllowance(e.target.value)}>
                                        <option value="0.25">¼&quot;</option>
                                        <option value="0.5">½&quot; (standard)</option>
                                        <option value="0.625">⅝&quot;</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Seam Preference</label>
                                    <select className="input-field" value={seamPref}
                                        onChange={e => setSeamPref(e.target.value as SeamOption)}>
                                        <option value="center">Centered vertical</option>
                                        <option value="offset">Offset vertical (recommended)</option>
                                        <option value="two-seam">Two seams (3 panels)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="input-group" style={{ marginTop: 8 }}>
                                <label className="input-label">Safety Buffer</label>
                                <select className="input-field" value={buffer}
                                    onChange={e => setBuffer(e.target.value as Buffer)}>
                                    {(Object.keys(BUFFER_MAP) as Buffer[]).map(k => (
                                        <option key={k} value={k}>{BUFFER_MAP[k].label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* ═══ RESULTS ═══════════════════════════════ */}
                    <div className={`calculator-results ${styles.results}`}>
                        {/* Primary result */}
                        <div className="result-card">
                            <div className="result-value">{toFraction(result.purchaseYards)} yards</div>
                            <div className="result-label">
                                recommended purchase &nbsp;·&nbsp; {result.purchaseYards.toFixed(2)} yd &nbsp;·&nbsp; {ydsToMeters(result.purchaseYards)} m
                            </div>
                        </div>

                        {/* Summary box */}
                        <div className={styles.resultDetails}>
                            <div className={styles.resultRow}><span>Quilt top size</span><strong>{qw}&quot; × {qh}&quot;</strong></div>
                            <div className={styles.resultRow}><span>Required backing size</span><strong>{result.backingW}&quot; × {result.backingH}&quot;</strong></div>
                            <div className={styles.resultRow}><span>Overhang (each side)</span><strong>{overhang}&quot;</strong></div>
                            <div className={styles.resultRow}><span>Fabric width (usable)</span><strong>{usableW.toFixed(1)}&quot;</strong></div>
                            <div className={styles.resultRow}><span>Seams required</span><strong>{result.panelCount - 1 === 0 ? "None ✓" : `${result.panelCount - 1} (${result.panelCount} panels)`}</strong></div>
                            <div className={styles.resultRow}><span>Safety buffer</span><strong>+{BUFFER_MAP[buffer].val} yd</strong></div>
                            <div className={styles.resultRow}><span>Raw yardage (before buffer)</span><strong>{toFraction(result.totalYards)} yd</strong></div>
                        </div>

                        {/* Toolbar */}
                        <div className="toolbar">
                            <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(copyText)}>
                                <ClipboardCopy size={13} /> Copy
                            </button>
                            <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
                                <Printer size={13} /> Print
                            </button>
                        </div>
                    </div>

                    {/* ═══ SVG DIAGRAM ═══════════════════════════ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Backing Diagram</h2>
                        <div style={{ width: "100%", overflowX: "auto" }}>
                            <BackingDiagram
                                quiltW={qw} quiltH={qh}
                                backingW={result.backingW} backingH={result.backingH}
                                overhang={overhang} panels={result.panels}
                                seamType={result.seamType} usableW={usableW}
                            />
                        </div>
                    </div>

                    {/* ═══ STEP-BY-STEP BREAKDOWN ════════════════ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle} style={{ cursor: "pointer" }}
                            onClick={() => setShowBreakdown(!showBreakdown)}>
                            Step-by-Step Calculation {showBreakdown ? "▾" : "▸"}
                        </h2>
                        {showBreakdown && (
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.8, color: "var(--color-text-secondary)", background: "var(--color-bg-secondary)", padding: "16px 20px", borderRadius: "var(--radius-md)" }}>
                                <div>Quilt top size: {qw}&quot; × {qh}&quot;</div>
                                <div>Overhang ({overhang}&quot; all sides):</div>
                                <div style={{ paddingLeft: 16 }}>Width needed: {qw}&quot; + {overhang}&quot; + {overhang}&quot; = <strong>{result.backingW}&quot;</strong></div>
                                <div style={{ paddingLeft: 16 }}>Length needed: {qh}&quot; + {overhang}&quot; + {overhang}&quot; = <strong>{result.backingH}&quot;</strong></div>
                                <div style={{ marginTop: 8 }}>Fabric width (usable): {usableW.toFixed(1)}&quot;</div>
                                {result.seamType === "none" ? (
                                    <>
                                        <div style={{ color: "var(--color-accent-primary)", fontWeight: 600 }}>{usableW.toFixed(1)}&quot; ≥ {result.backingW}&quot; needed → NO SEAM REQUIRED ✓</div>
                                        <div style={{ marginTop: 8 }}>Backing length needed: {result.backingH}&quot;</div>
                                        <div>Convert to yards: {result.backingH}&quot; ÷ 36 = {(result.backingH / 36).toFixed(3)} yards</div>
                                        <div>Round up: {toFraction(result.totalYards)} yards</div>
                                        {bufYd > 0 && <div>Add safety buffer: +{bufYd} yard</div>}
                                    </>
                                ) : (
                                    <>
                                        <div style={{ color: "#e67e22", fontWeight: 600 }}>{usableW.toFixed(1)}&quot; &lt; {result.backingW}&quot; needed → SEAM REQUIRED</div>
                                        <div style={{ marginTop: 8 }}>Panels needed: {result.panelCount}</div>
                                        {result.panels.map((p, i) => (
                                            <div key={i} style={{ paddingLeft: 16 }}>Panel {i + 1}: {p.widthUsed.toFixed(1)}&quot; wide × {p.lengthNeeded}&quot; long</div>
                                        ))}
                                        <div style={{ marginTop: 8 }}>
                                            Total fabric length: {result.panelCount} × {result.backingH}&quot; = {result.totalLengthInches}&quot;
                                        </div>
                                        <div>Convert to yards: {result.totalLengthInches}&quot; ÷ 36 = {(result.totalLengthInches / 36).toFixed(3)} yards</div>
                                        <div>Round up: {toFraction(result.totalYards)} yards</div>
                                        {bufYd > 0 && <div>Add safety buffer: +{bufYd} yard</div>}
                                    </>
                                )}
                                <div style={{ marginTop: 12, fontSize: 15, fontWeight: 700, color: "var(--color-accent-primary)" }}>
                                    RECOMMENDED PURCHASE: {toFraction(result.purchaseYards)} yards of {fabricW}&quot; fabric
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ═══ SEAM COMPARISON TABLE ═════════════════ */}
                    {seamOptions && (
                        <div className={`glass-card ${styles.calculatorCard}`}>
                            <h2 className={styles.calcTitle}>Seam Placement Comparison</h2>
                            <div className={styles.tableWrap}>
                                <table className={styles.convTable}>
                                    <thead>
                                        <tr>
                                            <th>Seam Option</th>
                                            <th>Panels</th>
                                            <th>Yardage</th>
                                            <th>Purchase</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {seamOptions.map((o, i) => (
                                            <tr key={i} style={o.type === seamPref ? { background: "var(--color-accent-light)" } : undefined}>
                                                <td style={{ fontFamily: "inherit" }}>
                                                    {o.label}
                                                    {o.type === "offset" && <span style={{ marginLeft: 6, fontSize: 11, color: "var(--color-accent-primary)", fontWeight: 600 }}>★ Recommended</span>}
                                                </td>
                                                <td>{o.r.panelCount}</td>
                                                <td>{toFraction(o.r.totalYards)} yd</td>
                                                <td>{toFraction(o.r.purchaseYards)} yd</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ═══ WIDTH COMPARISON ═══════════════════════ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Fabric Width Comparison</h2>
                        <p style={{ fontSize: 13, color: "var(--color-text-tertiary)", marginBottom: 14 }}>For your {qw}&quot;×{qh}&quot; quilt with {overhang}&quot; overhang:</p>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead>
                                    <tr>
                                        <th>Fabric Width</th>
                                        <th>Seams</th>
                                        <th>Panels</th>
                                        <th>Purchase</th>
                                        <th>Best For</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {widthComparison.map((c, i) => (
                                        <tr key={i} style={c.fw === (fabricW <= 45 ? 42 : fabricW <= 65 ? 60 : 108) ? { background: "var(--color-accent-light)" } : undefined}>
                                            <td>{c.fw + 1.5}&quot; ({c.fw}&quot; usable)</td>
                                            <td>{c.panelCount - 1 === 0 ? "None" : c.panelCount - 1}</td>
                                            <td>{c.panelCount}</td>
                                            <td style={{ fontWeight: 600 }}>{toFraction(c.purchaseYards)} yd</td>
                                            <td style={{ fontFamily: "inherit", fontSize: 12 }}>
                                                {c.fw === 42 ? "Budget, fabric variety" : c.fw === 60 ? "Mid-size quilts" : (c.panelCount === 1 ? "Easiest, no seams" : "Wide backing")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ═══ QUICK REFERENCE TABLE ═════════════════ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Quick Reference — Backing Yardage</h2>
                        <p style={{ fontSize: 13, color: "var(--color-text-tertiary)", marginBottom: 14 }}>Based on 6&quot; overhang all sides. Click any row to load that size.</p>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead>
                                    <tr>
                                        <th>Quilt Size</th>
                                        <th>44&quot; Fabric</th>
                                        <th>60&quot; Fabric</th>
                                        <th>108&quot; Fabric</th>
                                        <th>Seams (44&quot;)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {quickRef.map((r, i) => (
                                        <tr key={i} style={{ cursor: "pointer" }} onClick={() => applyPreset(i)}>
                                            <td style={{ fontFamily: "inherit" }}>{r.label} ({r.w}×{r.h})</td>
                                            <td>{r.f44.yds} yd</td>
                                            <td>{r.f60.yds} yd</td>
                                            <td>{r.f108.yds} yd</td>
                                            <td>{r.f44.seams === 0 ? "None" : r.f44.seams}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ═══ FAQ ═══════════════════════════════════ */}
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

                {/* ═══ SIDEBAR ═════════════════════════════════ */}
                <aside className="calculator-sidebar">
                    {/* Longarm Checklist */}
                    <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, color: "var(--color-text-primary)" }}>Longarm Checklist</h4>
                        <ul style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.8, listStyle: "none", padding: 0, margin: 0 }}>
                            {[
                                "4–8\" overhang all sides",
                                "Seams pressed OPEN",
                                "No selvages on backing",
                                "Backing square & straight",
                                "Label which side is top",
                            ].map((item, i) => (
                                <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                                    <span style={{ color: "var(--color-accent-primary)", fontWeight: 700, flexShrink: 0 }}>✓</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Related tools */}
                    <div className="glass-card related-tools">
                        <h4>Related Tools</h4>
                        <a href="/quilt/batting-calculator" className="related-tool-link">Batting Calculator #137</a>
                        <a href="/quilt/binding-calculator" className="related-tool-link">Binding Calculator #138</a>
                        <a href="" className="related-tool-link">Quilt Size Calculator #129</a>
                        <a href="/quilt/blocks-needed" className="related-tool-link">Blocks Needed #130</a>
                        <a href="" className="related-tool-link">Standard Sizes #133</a>
                        <a href="/quilt" className="related-tool-link">All Quilt Tools</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}

/* ═══ BACKING DIAGRAM (SVG) ═══════════════════════════════════ */
function BackingDiagram({
    quiltW, quiltH, backingW, backingH,
    overhang, panels, seamType, usableW,
}: {
    quiltW: number; quiltH: number;
    backingW: number; backingH: number;
    overhang: number;
    panels: { widthUsed: number; lengthNeeded: number }[];
    seamType: SeamOption;
    usableW: number;
}) {
    const pad = 50;
    const scale = Math.min(360 / backingW, 260 / backingH);
    const sw = backingW * scale;
    const sh = backingH * scale;
    const ox = overhang * scale;
    const oy = overhang * scale;
    const qw2 = quiltW * scale;
    const qh2 = quiltH * scale;
    const svgW = sw + pad * 2;
    const svgH = sh + pad * 2 + 30;

    // panel line positions
    const seamLines: number[] = [];
    if (seamType !== "none" && panels.length > 1) {
        let accum = 0;
        for (let i = 0; i < panels.length - 1; i++) {
            accum += panels[i].widthUsed * scale;
            seamLines.push(accum);
        }
    }

    return (
        <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: "100%", maxWidth: 480, height: "auto" }}>
            {/* backing rectangle */}
            <rect x={pad} y={pad} width={sw} height={sh} rx={4}
                fill="hsl(200, 40%, 92%)" stroke="hsl(200, 40%, 65%)" strokeWidth={1.5} />

            {/* quilt top area */}
            <rect x={pad + ox} y={pad + oy} width={qw2} height={qh2} rx={3}
                fill="white" stroke="hsl(200, 20%, 50%)" strokeWidth={1} strokeDasharray="6 3" />

            {/* overhang arrows & labels */}
            {/* top */}
            <line x1={pad + ox + qw2 / 2} y1={pad} x2={pad + ox + qw2 / 2} y2={pad + oy} stroke="hsl(0, 70%, 55%)" strokeWidth={1} markerEnd="url(#arrowRed)" />
            <text x={pad + ox + qw2 / 2 + 8} y={pad + oy / 2 + 4} fontSize={10} fill="hsl(0, 70%, 45%)">{overhang}&quot;</text>
            {/* left */}
            <line x1={pad} y1={pad + oy + qh2 / 2} x2={pad + ox} y2={pad + oy + qh2 / 2} stroke="hsl(0, 70%, 55%)" strokeWidth={1} />
            <text x={pad + ox / 2 - 8} y={pad + oy + qh2 / 2 - 6} fontSize={10} fill="hsl(0, 70%, 45%)">{overhang}&quot;</text>

            {/* seam lines */}
            {seamLines.map((lx, i) => (
                <g key={i}>
                    <line x1={pad + lx} y1={pad + 2} x2={pad + lx} y2={pad + sh - 2}
                        stroke="hsl(30, 80%, 50%)" strokeWidth={2} strokeDasharray="8 4" />
                    <text x={pad + lx + 4} y={pad + sh + 14} fontSize={9} fill="hsl(30, 70%, 40%)">Seam {i + 1}</text>
                </g>
            ))}

            {/* dimension labels */}
            <text x={pad + sw / 2} y={pad - 10} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--color-text-primary)">{backingW}&quot;</text>
            <text x={pad + sw + 14} y={pad + sh / 2} textAnchor="start" fontSize={11} fontWeight={600} fill="var(--color-text-primary)" transform={`rotate(90, ${pad + sw + 14}, ${pad + sh / 2})`}>{backingH}&quot;</text>

            {/* inner label */}
            <text x={pad + ox + qw2 / 2} y={pad + oy + qh2 / 2} textAnchor="middle" fontSize={11} fill="hsl(200, 20%, 45%)">
                Quilt Top {quiltW}&quot;×{quiltH}&quot;
            </text>

            {/* panel colors */}
            {panels.length > 1 && panels.map((p, i) => {
                let px = pad;
                for (let j = 0; j < i; j++) px += panels[j].widthUsed * scale;
                return (
                    <text key={`pl${i}`} x={px + (p.widthUsed * scale) / 2} y={pad + sh + 26} textAnchor="middle" fontSize={9} fill="var(--color-text-tertiary)">
                        Panel {i + 1}: {p.widthUsed.toFixed(1)}&quot;
                    </text>
                );
            })}

            {/* arrow marker */}
            <defs>
                <marker id="arrowRed" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6 Z" fill="hsl(0,70%,55%)" />
                </marker>
            </defs>
        </svg>
    );
}