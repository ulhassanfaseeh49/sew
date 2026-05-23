"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Circle, ChevronDown } from "lucide-react";

/* ─── helpers ──────────────────────────────────── */
function toFrac(v: number): string {
    const w = Math.floor(v);
    const r = v - w;
    const m: [number, string][] = [[0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
    for (const [t, s] of m) if (Math.abs(r - t) < 0.02) return w > 0 ? `${w}${s}` : s;
    if (r < 0.05) return `${w || "0"}`;
    return v.toFixed(2);
}
const roundN = (v: number, d = 2) => Math.round(v * 10 ** d) / 10 ** d;
const ceilQ = (v: number, q = 0.25) => Math.ceil(v / q) * q;

/* ─── presets ──────────────────────────────────── */
const WAIST_PRESETS = [22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44];
const LENGTH_STYLES = [
    { label: "Mini", val: 15 }, { label: "Above Knee", val: 20 },
    { label: "Knee", val: 24 }, { label: "Midi", val: 30 },
    { label: "Tea", val: 40 }, { label: "Maxi", val: 46 }, { label: "Floor", val: 52 },
];
const FABRIC_WIDTHS = [36, 44, 45, 54, 60, 72];
const SA_OPTIONS = [
    { value: 0.25, label: '¼"' }, { value: 0.375, label: '⅜"' },
    { value: 0.5, label: '½"' }, { value: 0.625, label: '⅝"' },
];
const HEM_OPTIONS = [
    { value: 0.25, label: '¼" rolled' }, { value: 0.5, label: '½"' },
    { value: 1, label: '1"' }, { value: 1.5, label: '1½"' }, { value: 2, label: '2"' },
];

/* ref table sizes */
const REF_WAISTS = [22, 24, 26, 28, 30, 32, 34, 36, 40, 44];
const REF_LENGTHS = [
    { label: "Mini 15″", val: 15 }, { label: "Knee 24″", val: 24 },
    { label: "Midi 30″", val: 30 }, { label: "Maxi 46″", val: 46 },
];

/* ─── component ──────────────────────────────────── */
export default function FullCirclePage() {
    const [waist, setWaist] = useState(28);
    const [skirtLen, setSkirtLen] = useState(25);
    const [fabricW, setFabricW] = useState(44);
    const [seamAllow, setSeamAllow] = useState(0.625);
    const [hemAllow, setHemAllow] = useState(1);
    const [layers, setLayers] = useState(1);
    const [showLayers, setShowLayers] = useState(false);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [showRef, setShowRef] = useState(false);
    const [showSteps, setShowSteps] = useState(false);
    const [showMath, setShowMath] = useState(false);
    const [showProblems, setShowProblems] = useState(false);
    const [showStyles, setShowStyles] = useState(false);

    /* ─── core math ─── */
    const calc = useMemo(() => {
        const r = waist / (2 * Math.PI);                  // waist radius
        const innerCut = r + seamAllow;                   // inner radius with SA
        const outerR = r + skirtLen;                      // outer radius (no hem)
        const outerCut = outerR + hemAllow;               // outer radius with hem
        const cuttingDia = outerCut * 2;                  // full diameter needed
        const hemCirc = 2 * Math.PI * outerR;             // hem circumference
        const fitsOnFabric = cuttingDia <= fabricW;       // can cut one-piece?

        // Yardage for 2-half-circles (back seam)
        const twoHalfLen = outerCut * 2;                  // need 2 × outer radius length
        const twoHalfYd = roundN(twoHalfLen / 36, 2);
        const twoHalfBuy = ceilQ(twoHalfYd + 0.1);

        // Yardage for one-piece (fold & cut)
        const onePieceLen = cuttingDia;
        const onePieceYd = roundN(onePieceLen / 36, 2);
        const onePieceBuy = ceilQ(onePieceYd + 0.1);

        // Half-circle alternative (lighter)
        const halfR = waist / Math.PI;                    // half circle: C = π × r
        const halfOuterCut = halfR + skirtLen + hemAllow;
        const halfYd = roundN((halfOuterCut * 2) / 36, 2);
        const halfBuy = ceilQ(halfYd + 0.1);

        return {
            r: roundN(r, 3), innerCut: roundN(innerCut, 2), outerR: roundN(outerR, 2),
            outerCut: roundN(outerCut, 2), cuttingDia: roundN(cuttingDia, 2),
            hemCirc: roundN(hemCirc, 1), fitsOnFabric,
            twoHalfYd, twoHalfBuy, onePieceYd, onePieceBuy,
            halfYd, halfBuy,
        };
    }, [waist, skirtLen, fabricW, seamAllow, hemAllow]);

    /* ─── SVG cutting diagram ─── */
    const svgDiagram = useMemo(() => {
        const scale = 2;   // px per inch (simplified)
        const maxR = calc.outerCut * scale;
        const innerR = calc.innerCut * scale;
        const fabWpx = fabricW * scale;
        const svgW = Math.max(maxR * 2 + 40, fabWpx + 40);
        const svgH = maxR + 30;
        const cx = svgW / 2;
        const cy = 15;
        return (
            <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: "100%", maxWidth: 480 }}>
                {/* Fabric width constraint */}
                <rect x={(svgW - fabWpx) / 2} y={0} width={fabWpx} height={svgH} fill="hsl(45,30%,95%)" stroke="hsl(45,40%,70%)" strokeWidth={0.5} strokeDasharray="4,2" />
                {/* Outer arc (half circle shown) */}
                <path d={`M ${cx - maxR} ${cy} A ${maxR} ${maxR} 0 0 1 ${cx + maxR} ${cy}`}
                    fill="hsl(150,30%,90%)" stroke="hsl(150,50%,45%)" strokeWidth={1} />
                {/* Inner arc (waist hole) */}
                <path d={`M ${cx - innerR} ${cy} A ${innerR} ${innerR} 0 0 1 ${cx + innerR} ${cy}`}
                    fill="hsl(0,0%,95%)" stroke="hsl(0,50%,55%)" strokeWidth={1} />
                {/* Center dot */}
                <circle cx={cx} cy={cy} r={2} fill="hsl(0,60%,50%)" />
                {/* Dimension: inner radius */}
                <line x1={cx} y1={cy} x2={cx + innerR} y2={cy} stroke="hsl(0,50%,55%)" strokeWidth={0.5} strokeDasharray="2,1" />
                <text x={cx + innerR / 2} y={cy - 4} textAnchor="middle" fontSize={7} fill="hsl(0,50%,50%)">{toFrac(calc.innerCut)}&quot;</text>
                {/* Dimension: outer radius */}
                <line x1={cx} y1={cy + 8} x2={cx + maxR} y2={cy + 8} stroke="hsl(150,50%,45%)" strokeWidth={0.5} strokeDasharray="2,1" />
                <text x={cx + maxR / 2} y={cy + 16} textAnchor="middle" fontSize={7} fill="hsl(150,50%,35%)">{toFrac(calc.outerCut)}&quot;</text>
                {/* Fabric width label */}
                <text x={svgW / 2} y={svgH - 4} textAnchor="middle" fontSize={7} fill="hsl(45,40%,50%)">← {fabricW}&quot; fabric width →</text>
                {/* Labels */}
                <text x={cx} y={cy + maxR * 0.5} textAnchor="middle" fontSize={8} fill="hsl(150,40%,40%)">Skirt</text>
                <text x={cx} y={cy + innerR * 0.3 + 4} textAnchor="middle" fontSize={6} fill="hsl(0,40%,50%)">Waist</text>
                {!calc.fitsOnFabric && (
                    <text x={svgW / 2} y={svgH - 14} textAnchor="middle" fontSize={7} fill="hsl(0,60%,50%)" fontWeight="bold">⚠ Circle exceeds fabric width!</text>
                )}
            </svg>
        );
    }, [calc, fabricW]);

    /* copy text */
    const copyText = `Full Circle Skirt: ${waist}" waist, ${skirtLen}" length. Waist radius: ${toFrac(calc.r)}". Inner cut radius: ${toFrac(calc.innerCut)}" (with ${toFrac(seamAllow)}" SA). Outer cut radius: ${toFrac(calc.outerCut)}" (with ${toFrac(hemAllow)}" hem). Cutting diameter: ${toFrac(calc.cuttingDia)}". Hem circumference: ${roundN(calc.hemCirc, 0)}". ${calc.fitsOnFabric ? `Fits on ${fabricW}" fabric — buy ${toFrac(calc.onePieceBuy)} yd.` : `Needs back seam on ${fabricW}" fabric — buy ${toFrac(calc.twoHalfBuy)} yd.`}`;

    /* FAQ */
    const faqItems = [
        { q: "How do I calculate circle skirt radius?", a: `Radius = Waist ÷ (2 × π) = Waist ÷ 6.283. For a ${waist}" waist: ${waist} ÷ 6.283 = ${toFrac(calc.r)}". This is the distance from the center point to the inner circle (waist opening). Add seam allowance: ${toFrac(calc.r)} + ${toFrac(seamAllow)} = ${toFrac(calc.innerCut)}" cutting radius.` },
        { q: "How much fabric do I need for a full circle skirt?", a: `It depends on waist, length, and fabric width. For a ${waist}" waist and ${skirtLen}" length on ${fabricW}" fabric: ${calc.fitsOnFabric ? `the circle fits — buy ${toFrac(calc.onePieceBuy)} yards.` : `the ${toFrac(calc.cuttingDia)}" diameter exceeds ${fabricW}", so cut 2 half-circles with a back seam and buy ${toFrac(calc.twoHalfBuy)} yards.`}` },
        { q: `Can I cut a full circle skirt from ${fabricW}" fabric?`, a: `Your cutting diameter is ${toFrac(calc.cuttingDia)}". ${calc.fitsOnFabric ? `Yes — it fits on ${fabricW}" fabric! Use the quarter-fold method for easiest cutting.` : `No — it's wider than ${fabricW}". Cut 2 half-circles and seam them at center back, or switch to wider fabric (60"+).`}` },
        { q: "What is the difference between a full and half circle skirt?", a: `A full circle (360°) creates maximum fullness and volume. A half circle (180°) uses exactly half the fabric with moderate fullness. For ${waist}" waist and ${skirtLen}" length: full circle needs ~${toFrac(calc.twoHalfBuy)} yd, half circle needs ~${toFrac(calc.halfBuy)} yd.` },
        { q: "Why does my circle skirt hem look wavy?", a: "Wavy hems are caused by the bias cut of the outer edge — fabric at 45° to the grain stretches and drops. To fix: hang the skirt for 24-48 hours BEFORE hemming. Mark the hem level while hanging, trim to even length, then use a narrow rolled hem. Never hem immediately after cutting." },
        { q: "How do I add seam allowance to a circle skirt?", a: `Add seam allowance to the RADIUS (not diameter). Inner circle: radius ${toFrac(calc.r)}" + ${toFrac(seamAllow)}" seam = ${toFrac(calc.innerCut)}" cut radius. Outer circle: radius ${toFrac(calc.outerR)}" + ${toFrac(hemAllow)}" hem = ${toFrac(calc.outerCut)}" cut radius. Our calculator adds both automatically.` },
        { q: "What is the best fabric for a circle skirt?", a: "Different fabrics create different effects: chiffon/organza for maximum float, cotton/cotton-blend for classic swing look, taffeta for structured fullness, quilting cotton for budget-friendly, jersey/ponte for knit circle skirts. Avoid very heavy fabrics — they drag the waist and reduce lift." },
        { q: "Where does the zipper go on a circle skirt?", a: "Left side seam (most common on one-piece skirts), center back seam (natural placement when using 2 half-circles), or center back invisible zipper. Most circle skirts use a 7\" zipper." },
        { q: "How do I use the string compass method?", a: `Tie string to a chalk marker. Hold the other end at exactly ${toFrac(calc.outerCut)}" from the pen. Pin the string at the center point of your fabric. Pull taut and draw the outer arc. Repeat at ${toFrac(calc.innerCut)}" for the inner (waist) arc. The string keeps the radius constant, creating a perfect circle.` },
        { q: "What is the hem circumference of a circle skirt?", a: `The hem circumference is the total length of the outer edge: 2π × outer radius = 2 × 3.14159 × ${toFrac(calc.outerR)} = ${roundN(calc.hemCirc, 0)}" (${roundN(calc.hemCirc / 12, 1)} feet!). This tells you how much bias tape you'd need, how long hemming takes, and affects how the skirt moves.` },
    ];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Skirt Calculators", href: "/skirt" }, { label: "Full Circle Skirt" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    {/* HEADER */}
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Circle size={14} strokeWidth={1.5} /> Skirt #4</span>
                        <h1>Full Circle Skirt Calculator</h1>
                        <p>Calculate waist radius, cutting dimensions, fabric yardage, and hem circumference for a 360° full circle skirt. Includes visual cutting diagram, fabric width problem detection, step-by-step instructions, and complete reference chart.</p>
                    </div>

                    {/* ① WAIST */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>① Your Waist Measurement</h2>
                        <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 6 }}>
                            Measure around your natural waist (smallest part) — or hips if the skirt sits lower.
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
                            {WAIST_PRESETS.map(w => (
                                <button key={w} className={`btn btn-sm ${waist === w ? "btn-primary" : "btn-secondary"}`}
                                    onClick={() => setWaist(w)}>{w}&quot;</button>
                            ))}
                        </div>
                        <div className="input-group">
                            <input type="number" className="input-field" value={waist} onChange={e => setWaist(parseFloat(e.target.value) || 22)} min={15} max={80} step={0.5} />
                        </div>
                    </div>

                    {/* ② LENGTH */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>② Skirt Length</h2>
                        <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 6 }}>
                            Measure from waist to desired hem. Choose a style or enter custom.
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
                            {LENGTH_STYLES.map(ls => (
                                <button key={ls.label} className={`btn btn-sm ${skirtLen === ls.val ? "btn-primary" : "btn-secondary"}`}
                                    onClick={() => setSkirtLen(ls.val)}>{ls.label} ({ls.val}&quot;)</button>
                            ))}
                        </div>
                        <div className="input-group">
                            <input type="number" className="input-field" value={skirtLen} onChange={e => setSkirtLen(parseFloat(e.target.value) || 15)} min={5} max={60} step={0.5} />
                        </div>
                        <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 4 }}>
                            Approximate lengths for 5′4″ (163 cm). Adjust for your height.
                        </div>
                    </div>

                    {/* ③ FABRIC & ALLOWANCES */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>③ Fabric &amp; Allowances</h2>
                        <div className="calculator-form-row">
                            <div className="input-group">
                                <label className="input-label">Fabric width</label>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                    {FABRIC_WIDTHS.map(fw => (
                                        <button key={fw} className={`btn btn-sm ${fabricW === fw ? "btn-primary" : "btn-secondary"}`}
                                            onClick={() => setFabricW(fw)}>{fw}&quot;</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="calculator-form-row" style={{ marginTop: 8 }}>
                            <div className="input-group">
                                <label className="input-label">Waist seam allowance</label>
                                <div style={{ display: "flex", gap: 4 }}>
                                    {SA_OPTIONS.map(o => (
                                        <button key={o.value} className={`btn btn-sm ${seamAllow === o.value ? "btn-primary" : "btn-secondary"}`}
                                            onClick={() => setSeamAllow(o.value)}>{o.label}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Hem allowance</label>
                                <div style={{ display: "flex", gap: 4 }}>
                                    {HEM_OPTIONS.map(o => (
                                        <button key={o.value} className={`btn btn-sm ${hemAllow === o.value ? "btn-primary" : "btn-secondary"}`}
                                            onClick={() => setHemAllow(o.value)}>{o.label}</button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Multi-layer toggle */}
                        <button className="btn btn-sm btn-secondary" style={{ marginTop: 8 }}
                            onClick={() => setShowLayers(!showLayers)}>
                            {showLayers ? "▼" : "▶"} Multi-Layer / Petticoat Options
                        </button>
                        {showLayers && (
                            <div style={{ marginTop: 6, display: "flex", gap: 4 }}>
                                {[1, 2, 3, 4].map(n => (
                                    <button key={n} className={`btn btn-sm ${layers === n ? "btn-primary" : "btn-secondary"}`}
                                        onClick={() => setLayers(n)}>{n} layer{n > 1 ? "s" : ""}</button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ═══ PRIMARY RESULTS ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(150,60%,40%)" }}>
                        <h2 className={styles.calcTitle}>📐 Your Circle Skirt Measurements</h2>

                        {/* Visual diagram */}
                        <div style={{ textAlign: "center", marginBottom: 12 }}>
                            {svgDiagram}
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 13, lineHeight: 2 }}>
                            <div style={{ padding: 10, background: "hsl(0,15%,97%)", borderRadius: 6 }}>
                                <div style={{ fontWeight: 700, color: "hsl(0,50%,45%)", fontSize: 12, marginBottom: 2 }}>Inner Circle (Waist)</div>
                                <div>Waist radius: <strong>{toFrac(calc.r)}&quot;</strong></div>
                                <div>+ {toFrac(seamAllow)}&quot; seam = <strong>{toFrac(calc.innerCut)}&quot;</strong> cut</div>
                            </div>
                            <div style={{ padding: 10, background: "hsl(150,15%,97%)", borderRadius: 6 }}>
                                <div style={{ fontWeight: 700, color: "hsl(150,50%,35%)", fontSize: 12, marginBottom: 2 }}>Outer Circle (Hem)</div>
                                <div>Outer radius: <strong>{toFrac(calc.outerR)}&quot;</strong></div>
                                <div>+ {toFrac(hemAllow)}&quot; hem = <strong>{toFrac(calc.outerCut)}&quot;</strong> cut</div>
                            </div>
                        </div>

                        <div style={{ marginTop: 8, padding: 10, background: "hsl(200,15%,97%)", borderRadius: 6, fontSize: 13, lineHeight: 2 }}>
                            <div>Cutting diameter: <strong>{toFrac(calc.cuttingDia)}&quot;</strong> (outer × 2)</div>
                            <div>Hem circumference: <strong>{roundN(calc.hemCirc, 0)}&quot;</strong> ({roundN(calc.hemCirc / 12, 1)} ft of hem!)</div>
                            {layers > 1 && <div>Layers: <strong>{layers}</strong> — multiply yardage × {layers}</div>}
                        </div>
                    </div>

                    {/* ═══ FABRIC REQUIREMENT ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: `4px solid ${calc.fitsOnFabric ? "hsl(150,60%,40%)" : "hsl(40,80%,50%)"}` }}>
                        <h2 className={styles.calcTitle}>🧵 How Much Fabric Do You Need?</h2>

                        {!calc.fitsOnFabric ? (
                            <>
                                <div style={{ padding: 10, background: "hsl(40,30%,96%)", borderRadius: 6, marginBottom: 10, fontSize: 13 }}>
                                    <strong style={{ color: "hsl(40,70%,40%)" }}>⚠ Your cutting circle ({toFrac(calc.cuttingDia)}&quot;) is wider than your fabric ({fabricW}&quot;)!</strong>
                                    <div style={{ marginTop: 4, color: "var(--color-text-secondary)" }}>Here are your options:</div>
                                </div>
                                <div style={{ display: "grid", gap: 8 }}>
                                    <div style={{ padding: 10, background: "hsl(150,15%,97%)", borderRadius: 6, fontSize: 13, lineHeight: 1.8 }}>
                                        <div style={{ fontWeight: 700, color: "hsl(150,60%,35%)" }}>Option 1: Add a Back Seam (Recommended)</div>
                                        <div>Cut two half-circles and seam at center back.</div>
                                        <div>Fabric needed: 2 × {toFrac(calc.outerCut)}&quot; = {toFrac(calc.outerCut * 2)}&quot;</div>
                                        <div style={{ fontWeight: 600 }}>Buy: {toFrac(calc.twoHalfBuy * layers)} yd of {fabricW}&quot; fabric</div>
                                    </div>
                                    <div style={{ padding: 10, background: "hsl(200,15%,97%)", borderRadius: 6, fontSize: 13, lineHeight: 1.8 }}>
                                        <div style={{ fontWeight: 700, color: "hsl(200,60%,35%)" }}>Option 2: Use Wider Fabric (60&quot;+)</div>
                                        <div>{calc.cuttingDia <= 60 ? `Your circle fits on 60" fabric — no seam needed!` : `Even 60" may be tight at ${toFrac(calc.cuttingDia)}". Consider 72" or panels.`}</div>
                                        <div style={{ fontWeight: 600 }}>Buy: {toFrac(calc.onePieceBuy * layers)} yd of 60&quot; fabric</div>
                                    </div>
                                    <div style={{ padding: 10, background: "hsl(280,15%,97%)", borderRadius: 6, fontSize: 13, lineHeight: 1.8 }}>
                                        <div style={{ fontWeight: 700, color: "hsl(280,50%,45%)" }}>Option 3: Half-Circle Skirt Instead</div>
                                        <div>Same waist, same length, half the fullness — less fabric.</div>
                                        <div style={{ fontWeight: 600 }}>Buy: {toFrac(calc.halfBuy * layers)} yd of {fabricW}&quot; fabric</div>
                                        <Link href="/skirt/half-circle" style={{ fontSize: 12, color: "hsl(200,60%,40%)" }}>→ Half-Circle Calculator</Link>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div style={{ padding: 12, background: "hsl(150,20%,96%)", borderRadius: 6, fontSize: 13, lineHeight: 1.8 }}>
                                <div style={{ fontWeight: 700, color: "hsl(150,60%,35%)" }}>✅ Your circle fits on {fabricW}&quot; fabric!</div>
                                <div>Use the quarter-fold method — no seams needed.</div>
                                <div>Cutting diameter: {toFrac(calc.cuttingDia)}&quot; — fabric is {fabricW}&quot; wide.</div>
                                <div style={{ fontWeight: 600, fontSize: 15, marginTop: 4 }}>Buy: {toFrac(calc.onePieceBuy * layers)} yards of {fabricW}&quot; fabric</div>
                            </div>
                        )}

                        <div style={{ marginTop: 8, padding: 8, background: "hsl(45,30%,96%)", borderRadius: 6, fontSize: 11, color: "var(--color-text-secondary)" }}>
                            ⚠ Hang skirt for 24-48 hours before hemming. Bias sections will stretch and drop — trim hem level after hanging.
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="toolbar" style={{ marginBottom: 16 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} /> Copy</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                    </div>

                    {/* ═══ REFERENCE TABLE ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
                            onClick={() => setShowRef(!showRef)}>
                            📊 Circle Skirt Reference Chart
                            <ChevronDown size={14} style={{ transform: showRef ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                        </button>
                        {showRef && (
                            <div style={{ marginTop: 10, overflowX: "auto" }}>
                                <table style={{ width: "100%", fontSize: 10, borderCollapse: "collapse" }}>
                                    <thead><tr style={{ borderBottom: "2px solid hsl(0,0%,85%)" }}>
                                        <th style={{ textAlign: "left", padding: "4px 3px" }}>Waist</th>
                                        {REF_LENGTHS.map(l => <th key={l.val} style={{ textAlign: "right", padding: "4px 3px" }}>{l.label}</th>)}
                                    </tr></thead>
                                    <tbody>
                                        {REF_WAISTS.map(w => {
                                            const isCurrent = w === waist;
                                            return (
                                                <tr key={w} style={{ background: isCurrent ? "hsl(150,40%,95%)" : undefined, borderBottom: "1px solid hsl(0,0%,92%)" }}>
                                                    <td style={{ padding: "3px 3px", fontWeight: isCurrent ? 700 : 400 }}>{w}&quot;</td>
                                                    {REF_LENGTHS.map(l => {
                                                        const rr = w / (2 * Math.PI);
                                                        const outerCutR = rr + l.val + hemAllow;
                                                        const dia = outerCutR * 2;
                                                        const fits44 = dia <= 44;
                                                        const yd44 = fits44 ? ceilQ(dia / 36 + 0.1) : ceilQ((outerCutR * 2) / 36 + 0.1);
                                                        return (
                                                            <td key={l.val} style={{
                                                                textAlign: "right", padding: "3px 3px",
                                                                color: fits44 ? "hsl(150,50%,35%)" : "hsl(0,50%,45%)",
                                                                cursor: "pointer",
                                                            }} onClick={() => { setWaist(w); setSkirtLen(l.val); }}>
                                                                {toFrac(yd44)} yd
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                <div style={{ fontSize: 9, marginTop: 4, color: "var(--color-text-tertiary)" }}>
                                    Yardage for 44&quot; fabric with {toFrac(hemAllow)}&quot; hem. <span style={{ color: "hsl(150,50%,35%)" }}>Green = fits one-piece</span>, <span style={{ color: "hsl(0,50%,45%)" }}>Red = needs back seam</span>. Click any cell to fill calculator.
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ═══ CUTTING INSTRUCTIONS ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
                            onClick={() => setShowSteps(!showSteps)}>
                            ✂️ Step-by-Step Cutting Instructions
                            <ChevronDown size={14} style={{ transform: showSteps ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                        </button>
                        {showSteps && (
                            <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
                                {[
                                    { step: 1, title: "Prepare your fabric", desc: `Pre-wash and press. Fold in half lengthwise (right sides together). Folded fabric: ${fabricW / 2}" wide × needed length.` },
                                    { step: 2, title: "Find your center point", desc: "At the corner where BOTH edges are fold lines, mark the center point with chalk or a pin." },
                                    { step: 3, title: "Mark the inner circle (waist)", desc: `From the center point, measure out ${toFrac(calc.innerCut)}" in a quarter-circle arc. Use a string compass — tie string to chalk at ${toFrac(calc.innerCut)}", pin other end at center.` },
                                    { step: 4, title: "Mark the outer circle (hem)", desc: `From the same center point, measure out ${toFrac(calc.outerCut)}" in a quarter-circle arc. This includes ${toFrac(hemAllow)}" hem allowance.` },
                                    { step: 5, title: "Cut along both arcs", desc: `Cut along BOTH arcs through all layers. ${calc.fitsOnFabric ? "Unfold — you have a full circle!" : "Unfold each piece — you have 2 half-circles."}` },
                                    { step: 6, title: "Mark grain line", desc: "Mark the straight grain from center of inner arc to center of outer arc on each piece." },
                                    ...(calc.fitsOnFabric ? [] : [
                                        { step: 7, title: "Sew back seam", desc: `Right sides together, sew the two half-circles at center back with ${toFrac(seamAllow)}" seam allowance. Press seam open. You have a full circle!` },
                                    ]),
                                    { step: calc.fitsOnFabric ? 7 : 8, title: "Finish", desc: `Attach waistband or facing at inner circle. Install zipper. Hang 24-48 hours, then hem the outer edge using ${toFrac(hemAllow)}" allowance.` },
                                ].map(s => (
                                    <div key={s.step} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid hsl(0,0%,92%)" }}>
                                        <span style={{ fontWeight: 700, fontSize: 16, color: "hsl(150,60%,40%)", minWidth: 24, textAlign: "right" }}>{s.step}</span>
                                        <div><div style={{ fontWeight: 600 }}>{s.title}</div><div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>{s.desc}</div></div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ═══ CIRCLE SKIRT MATH ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
                            onClick={() => setShowMath(!showMath)}>
                            📐 The Circle Skirt Formula Explained
                            <ChevronDown size={14} style={{ transform: showMath ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                        </button>
                        {showMath && (
                            <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
                                <div style={{ padding: 10, background: "hsl(200,15%,97%)", borderRadius: 6, marginBottom: 8, fontFamily: "monospace" }}>
                                    <div><strong>Radius = Waist ÷ (2 × π)</strong></div>
                                    <div>r = {waist} ÷ 6.283 = <strong>{toFrac(calc.r)}&quot;</strong></div>
                                </div>
                                <div style={{ fontSize: 12 }}>
                                    <strong>Why?</strong> Circumference of a circle = 2πr. We need circumference = waist. So r = waist ÷ 2π.
                                </div>
                                <div style={{ marginTop: 8, padding: 10, background: "hsl(150,15%,97%)", borderRadius: 6 }}>
                                    <div>Step 1: Waist radius = {waist} ÷ 6.283 = <strong>{toFrac(calc.r)}&quot;</strong></div>
                                    <div>Step 2: + seam allowance = {toFrac(calc.r)} + {toFrac(seamAllow)} = <strong>{toFrac(calc.innerCut)}&quot;</strong> (inner cut)</div>
                                    <div>Step 3: + skirt length = {toFrac(calc.r)} + {skirtLen} = <strong>{toFrac(calc.outerR)}&quot;</strong> (outer radius)</div>
                                    <div>Step 4: + hem allowance = {toFrac(calc.outerR)} + {toFrac(hemAllow)} = <strong>{toFrac(calc.outerCut)}&quot;</strong> (outer cut)</div>
                                    <div>Step 5: Cutting diameter = {toFrac(calc.outerCut)} × 2 = <strong>{toFrac(calc.cuttingDia)}&quot;</strong></div>
                                    <div>Step 6: Hem circumference = 2π × {toFrac(calc.outerR)} = <strong>{roundN(calc.hemCirc, 0)}&quot;</strong> ({roundN(calc.hemCirc / 12, 1)} ft)</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ═══ SKIRT STYLES COMPARISON ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
                            onClick={() => setShowStyles(!showStyles)}>
                            👗 Circle Skirt Styles — Fullness Comparison
                            <ChevronDown size={14} style={{ transform: showStyles ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                        </button>
                        {showStyles && (
                            <div style={{ marginTop: 10, overflowX: "auto" }}>
                                <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}>
                                    <thead><tr style={{ borderBottom: "2px solid hsl(0,0%,85%)" }}>
                                        <th style={{ textAlign: "left", padding: "5px 4px" }}>Style</th>
                                        <th style={{ textAlign: "right", padding: "5px 4px" }}>Portion</th>
                                        <th style={{ textAlign: "left", padding: "5px 4px" }}>Fullness</th>
                                        <th style={{ textAlign: "right", padding: "5px 4px" }}>~Fabric</th>
                                        <th style={{ textAlign: "left", padding: "5px 4px" }}>Best For</th>
                                    </tr></thead>
                                    <tbody>
                                        {[
                                            { style: "Quarter Circle", portion: "¼ (90°)", fullness: "Light", mult: 0.25, best: "Casual, subtle flare" },
                                            { style: "Half Circle", portion: "½ (180°)", fullness: "Medium", mult: 0.5, best: "Everyday wear" },
                                            { style: "¾ Circle", portion: "¾ (270°)", fullness: "Full", mult: 0.75, best: "Dressy, formal" },
                                            { style: "Full Circle", portion: "1 (360°)", fullness: "Maximum", mult: 1, best: "Prom, costume, dance" },
                                        ].map((s, i) => {
                                            const isCurrent = s.mult === 1;
                                            return (
                                                <tr key={i} style={{ background: isCurrent ? "hsl(150,40%,95%)" : undefined, borderBottom: "1px solid hsl(0,0%,92%)" }}>
                                                    <td style={{ padding: "4px 4px", fontWeight: isCurrent ? 700 : 400 }}>{s.style}</td>
                                                    <td style={{ textAlign: "right", padding: "4px 4px" }}>{s.portion}</td>
                                                    <td style={{ padding: "4px 4px" }}>{s.fullness}</td>
                                                    <td style={{ textAlign: "right", padding: "4px 4px" }}>{toFrac(ceilQ(calc.twoHalfBuy * s.mult + 0.05))} yd</td>
                                                    <td style={{ padding: "4px 4px" }}>{s.best}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* ═══ PROBLEMS & SOLUTIONS ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
                            onClick={() => setShowProblems(!showProblems)}>
                            🔧 Common Problems &amp; Solutions
                            <ChevronDown size={14} style={{ transform: showProblems ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                        </button>
                        {showProblems && (
                            <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.7, color: "var(--color-text-secondary)" }}>
                                {[
                                    {
                                        title: "My fabric isn't wide enough", color: "hsl(40,20%,97%)", titleColor: "hsl(40,60%,40%)",
                                        desc: "Add a center back seam (most common), switch to wider fabric (60\"+), or make a half-circle skirt instead. Our calculator automatically detects this and shows all options."
                                    },
                                    {
                                        title: "Circle skirt hem looks wavy", color: "hsl(200,20%,97%)", titleColor: "hsl(200,60%,40%)",
                                        desc: "Bias-cut outer edges stretch. ALWAYS hang the skirt 24-48 hours before hemming. Mark hem level while hanging, trim to even, then use a narrow rolled hem or serger. Never hem immediately."
                                    },
                                    {
                                        title: "Skirt isn't full enough", color: "hsl(150,20%,97%)", titleColor: "hsl(150,60%,40%)",
                                        desc: "A full circle = maximum fullness. For more volume: use lighter fabric (chiffon, organza), add a petticoat underneath, or use multiple layers. See layer option above."
                                    },
                                    {
                                        title: "Calculating for unusual waist sizes", color: "hsl(280,20%,97%)", titleColor: "hsl(280,60%,40%)",
                                        desc: "The formula works for ANY waist size — children's (18\"+), plus-size (up to 80\"+), and everything between. Just enter your actual measurement."
                                    },
                                ].map((p, i) => (
                                    <div key={i} style={{ padding: 10, background: p.color, borderRadius: 6, marginBottom: 6 }}>
                                        <strong style={{ color: p.titleColor }}>{p.title}</strong>
                                        <p style={{ marginTop: 4 }}>{p.desc}</p>
                                    </div>
                                ))}
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
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Quick Formula</h4>
                        <div style={{ fontSize: 12, fontFamily: "monospace", lineHeight: 2, color: "var(--color-text-secondary)" }}>
                            <div><strong>Waist radius:</strong></div>
                            <div>r = waist ÷ (2π)</div>
                            <div>r = waist ÷ 6.283</div>
                            <div style={{ marginTop: 6 }}><strong>Inner cut:</strong></div>
                            <div>r + seam allowance</div>
                            <div style={{ marginTop: 6 }}><strong>Outer cut:</strong></div>
                            <div>r + length + hem</div>
                            <div style={{ marginTop: 6 }}><strong>Diameter:</strong></div>
                            <div>outer cut × 2</div>
                        </div>
                    </div>
                    <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Quick Answer</h4>
                        <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.9 }}>
                            <div>28&quot; waist, 25&quot; length:</div>
                            <div>Radius: 4.46&quot;</div>
                            <div>Buy: ~2 yd (44&quot; fabric)</div>
                            <div>Hem: 185&quot; (15.4 ft!)</div>
                        </div>
                    </div>
                    <div className="glass-card related-tools">
                        <h4>Related Skirt Tools</h4>
                        <Link href="/skirt/half-circle" className="related-tool-link">Half Circle Skirt</Link>
                        <Link href="/skirt/quarter-circle" className="related-tool-link">Quarter Circle Skirt</Link>
                        <Link href="/skirt/three-quarter-circle" className="related-tool-link">¾ Circle Skirt</Link>
                        <Link href="/skirt/tiered" className="related-tool-link">Tiered Skirt</Link>
                        <Link href="/skirt" className="related-tool-link">All Skirt Tools</Link>
                    </div>
                </aside>
            </div>
        </div>
    );
}