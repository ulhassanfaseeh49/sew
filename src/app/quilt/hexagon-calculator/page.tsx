"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, ChevronDown } from "lucide-react";

/* ─── helpers ──────────────────────────────────── */
function toFrac(v: number): string {
    const w = Math.floor(v);
    const r = v - w;
    const m: [number, string][] = [[0.0625, "1/16"], [0.125, "⅛"], [0.1875, "3/16"], [0.25, "¼"], [0.3125, "5/16"], [0.375, "⅜"], [0.4375, "7/16"], [0.5, "½"], [0.5625, "9/16"], [0.625, "⅝"], [0.6875, "11/16"], [0.75, "¾"], [0.8125, "13/16"], [0.875, "⅞"], [0.9375, "15/16"]];
    for (const [t, s] of m) if (Math.abs(r - t) < 0.015) return w > 0 ? `${w}${s}` : s;
    if (r < 0.03) return `${w || "0"}`;
    return v.toFixed(2);
}
const roundN = (v: number, d = 3) => Math.round(v * 10 ** d) / 10 ** d;
const ceilQ = (v: number, q = 0.25) => Math.ceil(v / q) * q;
const SQRT3 = Math.sqrt(3);

/* ─── presets ──────────────────────────────────── */
const SIDE_PRESETS = [
    { val: 0.25, label: '¼"', mm: 6, desc: "Miniature" },
    { val: 0.5, label: '½"', mm: 12, desc: "Small" },
    { val: 0.75, label: '¾"', mm: 19, desc: "Medium-small" },
    { val: 1, label: '1"', mm: 25, desc: "Most popular" },
    { val: 1.25, label: '1¼"', mm: 32, desc: "Medium-large" },
    { val: 1.5, label: '1½"', mm: 38, desc: "Large" },
    { val: 2, label: '2"', mm: 50, desc: "Very large" },
    { val: 2.5, label: '2½"', mm: 64, desc: "Jumbo" },
    { val: 3, label: '3"', mm: 76, desc: "Statement" },
];

const SA_OPTIONS = [
    { value: 0.25, label: '¼"', desc: "Experienced / large hexagons" },
    { value: 0.375, label: '⅜"', desc: "Standard EPP (recommended)" },
    { value: 0.5, label: '½"', desc: "Beginner / small hexagons" },
];

const REF_TABLE = [
    { side: 0.25, w: 0.5, h: 0.433, area: 0.162 },
    { side: 0.5, w: 1.0, h: 0.866, area: 0.650 },
    { side: 0.75, w: 1.5, h: 1.299, area: 1.462 },
    { side: 1, w: 2.0, h: 1.732, area: 2.598 },
    { side: 1.25, w: 2.5, h: 2.165, area: 4.060 },
    { side: 1.5, w: 3.0, h: 2.598, area: 5.845 },
    { side: 2, w: 4.0, h: 3.464, area: 10.392 },
    { side: 2.5, w: 5.0, h: 4.330, area: 16.238 },
    { side: 3, w: 6.0, h: 5.196, area: 23.383 },
];

const QUILT_SIZES = [
    { name: "Wall 24×24″", hexes: 130 },
    { name: "Baby 36×45″", hexes: 440 },
    { name: "Throw 54×72″", hexes: 1010 },
    { name: "Twin 60×80″", hexes: 1240 },
    { name: "Queen 84×92″", hexes: 2000 },
    { name: "King 100×108″", hexes: 2800 },
];

const FLOWER_RINGS = [
    { rings: 0, perRing: 0, total: 1, diam: 2 },
    { rings: 1, perRing: 6, total: 7, diam: 6 },
    { rings: 2, perRing: 12, total: 19, diam: 10 },
    { rings: 3, perRing: 18, total: 37, diam: 14 },
    { rings: 4, perRing: 24, total: 61, diam: 18 },
    { rings: 5, perRing: 30, total: 91, diam: 22 },
];

/* ─── component ──────────────────────────────────── */
export default function Page() {
    const [side, setSide] = useState(1);
    const [inputMethod, setInputMethod] = useState<"side" | "width" | "height">("side");
    const [sa, setSa] = useState(0.375);
    const [numFlowers, setNumFlowers] = useState(24);
    const [rings, setRings] = useState(2);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [showRef, setShowRef] = useState(false);
    const [showFlower, setShowFlower] = useState(false);
    const [showYardage, setShowYardage] = useState(false);
    const [showQuiltRef, setShowQuiltRef] = useState(false);
    const [showCompat, setShowCompat] = useState(false);
    const [showMath, setShowMath] = useState(false);
    const [showBasting, setShowBasting] = useState(false);
    const [showMM, setShowMM] = useState(false);

    /* ─── core math ─── */
    const calc = useMemo(() => {
        const s = side;
        const width = s * 2;                   // point to point
        const height = s * SQRT3;              // flat to flat
        const area = s * s * (3 * SQRT3 / 2);  // hexagon area
        const mm = s * 25.4;

        // Fabric cut = paper + SA on all sides
        const fabricSide = s + sa;             // NOT ×2, SA added to each EDGE
        const fabricW = fabricSide * 2;
        const fabricH = fabricSide * SQRT3;

        // Flower calculations
        const hexPerFlower = 3 * rings * rings + 3 * rings + 1;
        const flowerHexes = numFlowers * hexPerFlower;
        // Path hexagons estimate (~ 30-40% of flower hexes for 1-row path)
        const pathHexes = Math.round(numFlowers * rings * 7.5);
        const totalHexes = flowerHexes + pathHexes;

        // Fabric yield: how many hexagons from various fabric cuts?
        // Fat quarter: 18" × 22"
        const fqCols = Math.floor(22 / fabricW);
        const fqRows = Math.floor(18 / fabricH);
        const hexFQ = fqCols * fqRows;
        // Half yard: 18" × ~42" usable
        const hyRows = Math.floor(18 / fabricH);
        const hyCols = Math.floor(42 / fabricW);
        const hexHalfYd = hyCols * hyRows;
        // Full yard: 36" × ~42" usable
        const fyRows = Math.floor(36 / fabricH);
        const fyCols = Math.floor(42 / fabricW);
        const hexFullYd = fyCols * fyRows;
        const perRow = fyCols;

        // Compatible shapes
        const triHeight = roundN(s * SQRT3 / 2, 3);
        const diamondW = roundN(s * 2, 3);
        const diamondH = roundN(s * SQRT3, 3);
        const halfHexW = roundN(s * 2, 3);
        const halfHexH = roundN(s * SQRT3 / 2, 3);

        return {
            s, width: roundN(width), height: roundN(height), area: roundN(area),
            mm: roundN(mm, 1),
            fabricSide: roundN(fabricSide), fabricW: roundN(fabricW), fabricH: roundN(fabricH),
            hexPerFlower, flowerHexes, pathHexes, totalHexes,
            hexFQ, hexHalfYd, hexFullYd,
            triHeight, diamondW, diamondH, halfHexW, halfHexH,
            perRow,
        };
    }, [side, sa, numFlowers, rings]);

    /* ─── SVG hex preview ─── */
    const hexSvg = useMemo(() => {
        const scale = 50;
        const cx = 100, cy = 80;
        const s = side * scale;
        // flat-top hexagon points
        const pts = Array.from({ length: 6 }, (_, i) => {
            const ang = (Math.PI / 180) * (60 * i);
            return [cx + s * Math.cos(ang), cy + s * Math.sin(ang)];
        });
        const ptsStr = pts.map(p => p.join(",")).join(" ");
        // fabric hex (larger)
        const fs = calc.fabricSide * scale;
        const fpts = Array.from({ length: 6 }, (_, i) => {
            const ang = (Math.PI / 180) * (60 * i);
            return [cx + fs * Math.cos(ang), cy + fs * Math.sin(ang)];
        });
        const fptsStr = fpts.map(p => p.join(",")).join(" ");
        return (
            <svg viewBox="0 0 200 160" style={{ width: "100%", maxWidth: 280 }}>
                {/* Fabric cut hex */}
                <polygon points={fptsStr} fill="hsl(30,30%,95%)" stroke="hsl(30,60%,55%)" strokeWidth={0.8} strokeDasharray="3,2" />
                {/* Paper template hex */}
                <polygon points={ptsStr} fill="hsl(200,30%,92%)" stroke="hsl(200,60%,45%)" strokeWidth={1} />
                {/* Width dimension */}
                <line x1={cx - s} y1={cy} x2={cx + s} y2={cy} stroke="hsl(200,50%,50%)" strokeWidth={0.4} strokeDasharray="2,1" />
                <text x={cx} y={cy - 4} textAnchor="middle" fontSize={7} fill="hsl(200,50%,40%)">{toFrac(calc.width)}&quot; wide</text>
                {/* Height dimension */}
                <line x1={cx} y1={cy - s * SQRT3 / 2} x2={cx} y2={cy + s * SQRT3 / 2} stroke="hsl(150,50%,45%)" strokeWidth={0.4} strokeDasharray="2,1" />
                <text x={cx + s + 8} y={cy + 3} textAnchor="start" fontSize={7} fill="hsl(150,50%,35%)">{toFrac(calc.height)}&quot; tall</text>
                {/* Side label */}
                <text x={cx + s * 0.6} y={cy - s * 0.5 - 3} textAnchor="middle" fontSize={6} fill="hsl(0,50%,50%)">side: {toFrac(side)}&quot;</text>
                {/* Labels */}
                <text x={cx} y={156} textAnchor="middle" fontSize={6} fill="hsl(200,40%,50%)">— Paper template —</text>
                <text x={cx} y={147} textAnchor="middle" fontSize={5} fill="hsl(30,40%,50%)">--- Fabric cut (+{toFrac(sa)}&quot; SA) ---</text>
            </svg>
        );
    }, [side, calc, sa]);

    /* ─── input from width/height ─── */
    const handleWidthInput = (w: number) => { setSide(roundN(w / 2, 3)); };
    const handleHeightInput = (h: number) => { setSide(roundN(h / SQRT3, 3)); };

    /* ─── copy ─── */
    const copyText = `${toFrac(side)}" side hexagon (${roundN(calc.mm, 0)}mm): Paper template ${toFrac(calc.width)}" wide × ${toFrac(calc.height)}" tall. Fabric cut (${toFrac(sa)}" SA): ${toFrac(calc.fabricW)}" × ${toFrac(calc.fabricH)}". Area: ${roundN(calc.area, 2)} sq in. ${numFlowers} GFG flowers (${rings}-ring): ${calc.totalHexes} total hexagons.`;

    /* ─── FAQ ─── */
    const faqItems = [
        { q: "What does '1-inch hexagon' actually mean?", a: `When a template says "1-inch hexagon" it means the SIDE LENGTH is 1 inch — NOT the width or height. A 1" side hexagon is actually 2" wide (point to point) and 1.732" tall (flat to flat). This causes huge confusion because "1 inch" sounds small, but the hexagon is actually 2 inches across.` },
        { q: `How many hexagons do I need for a queen-size quilt?`, a: `For 1" side hexagons in a solid grid: approximately 2,000 hexagons for a queen-size quilt (84"×92"). For a Grandmother's Flower Garden with path hexagons, the count varies by flower size and path width. Use the calculator above for your exact configuration.` },
        { q: `What is the width of a ${toFrac(side)}" hexagon?`, a: `A hexagon with ${toFrac(side)}" sides has: Width (point to point) = ${toFrac(side)} × 2 = ${toFrac(calc.width)}". Height (flat to flat) = ${toFrac(side)} × √3 = ${toFrac(calc.height)}". These are the paper template dimensions. For fabric cutting, add ${toFrac(sa)}" seam allowance: ${toFrac(calc.fabricW)}" wide × ${toFrac(calc.fabricH)}" tall.` },
        { q: "How do I calculate hexagon dimensions?", a: `For a regular hexagon with side length S: Width (point to point) = S × 2. Height (flat to flat) = S × √3 ≈ S × 1.732. Area = S² × (3√3/2) ≈ S² × 2.598. This works because a hexagon is made of six equilateral triangles, and the relationship between the triangle side and height involves √3.` },
        { q: `How much fabric do I need for ${calc.totalHexes} hexagons?`, a: `At ${toFrac(side)}" side with ${toFrac(sa)}" SA: a fat quarter (18"×22") yields ~${calc.hexFQ} hexagons. A full yard (36"×44") yields ~${calc.hexFullYd} hexagons. For ${calc.totalHexes} hexagons: ~${roundN(calc.totalHexes / calc.hexFullYd, 1)} yards total (split across your fabrics).` },
        { q: "What is a Grandmother's Flower Garden quilt?", a: `A classic EPP hexagon pattern over 100 years old. Each "flower" is a center hexagon surrounded by rings of petals. The traditional 2-ring flower has 19 hexagons (1 center + 6 inner petals + 12 outer petals). Flowers are separated by "path" hexagons in a background fabric.` },
        { q: "How many hexagons in a Grandmother's Flower Garden block?", a: `It depends on the number of petal rings: 1 ring = 7 hexagons (1+6), 2 rings = 19 hexagons (1+6+12), 3 rings = 37 hexagons (1+6+12+18). The formula: total = 3N² + 3N + 1, where N is the number of rings. The traditional GFG uses 2 rings (19 hexagons per flower).` },
        { q: "What seam allowance for hexagon EPP?", a: `⅜" (9-10mm) is standard and recommended for most EPP. ¼" works for experienced quilters with larger hexagons (1.5"+). ½" is easier for beginners and small hexagons. The seam allowance is the fabric that wraps around the paper template and gets folded and basted.` },
        { q: "How many hexagons from a fat quarter?", a: `It depends on hexagon size. For 1" side hexagons with ⅜" SA: a fat quarter (18"×22") yields approximately ${calc.hexFQ} hexagons. Larger hexagons yield fewer per fat quarter. Nesting (alternating up and down) improves yield by 15-20%.` },
        { q: "What is English Paper Piecing?", a: "English Paper Piecing (EPP) is a hand-sewing technique where fabric is wrapped around paper templates and basted, then pieces are whip-stitched together. The paper keeps pieces precisely shaped. It's very portable — no sewing machine needed. Hexagons are the most popular EPP shape, creating the classic Grandmother's Flower Garden pattern." },
    ];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "Hexagon Calculator (EPP)" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    {/* HEADER */}
                    <div className={styles.toolHeader}>
                        <span className="category-badge">⬡ Quilt #154</span>
                        <h1>Hexagon Size Calculator (EPP)</h1>
                        <p>Calculate all dimensions for hexagon English Paper Piecing — side length, width, height, fabric cutting size with seam allowance, Grandmother&apos;s Flower Garden planning, piece counts, and yardage. Includes printable reference and compatible shapes.</p>
                    </div>

                    {/* SIZING EXPLAINER */}
                    <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(200,60%,50%)" }}>
                        <h2 className={styles.calcTitle}>How Hexagon Size Is Measured</h2>
                        <div style={{ fontSize: 13, lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
                            When people say &quot;a 1-inch hexagon&quot; they mean the <strong>SIDE LENGTH = 1 inch</strong>. The side determines everything:
                            <div style={{ fontFamily: "monospace", margin: "6px 0", padding: 8, background: "hsl(200,15%,97%)", borderRadius: 6 }}>
                                Width (point to point) = side × 2<br />
                                Height (flat to flat) = side × √3 ≈ side × 1.732
                            </div>
                        </div>
                    </div>

                    {/* ① INPUT METHOD */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>① Enter Hexagon Size</h2>
                        <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                            {([["side", "Side Length"], ["width", "Width (P-to-P)"], ["height", "Height (F-to-F)"]] as const).map(([m, l]) => (
                                <button key={m} className={`btn btn-sm ${inputMethod === m ? "btn-primary" : "btn-secondary"}`}
                                    onClick={() => setInputMethod(m)}>{l}</button>
                            ))}
                        </div>

                        {inputMethod === "side" && (
                            <>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
                                    {SIDE_PRESETS.map(p => (
                                        <button key={p.val} className={`btn btn-sm ${side === p.val ? "btn-primary" : "btn-secondary"}`}
                                            onClick={() => setSide(p.val)} style={{ fontSize: 11 }}>
                                            {p.label} <span style={{ opacity: 0.6 }}>({p.mm}mm)</span>
                                        </button>
                                    ))}
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Side length (inches)</label>
                                    <input type="number" className="input-field" value={side} onChange={e => setSide(parseFloat(e.target.value) || 0.25)} min={0.125} max={6} step={0.125} />
                                </div>
                            </>
                        )}
                        {inputMethod === "width" && (
                            <div className="input-group">
                                <label className="input-label">Width — point to point (inches)</label>
                                <input type="number" className="input-field" value={roundN(side * 2)} onChange={e => handleWidthInput(parseFloat(e.target.value) || 1)} min={0.25} max={12} step={0.25} />
                                <div style={{ fontSize: 11, marginTop: 2, color: "var(--color-text-tertiary)" }}>Side = width ÷ 2 = {toFrac(side)}&quot;</div>
                            </div>
                        )}
                        {inputMethod === "height" && (
                            <div className="input-group">
                                <label className="input-label">Height — flat to flat (inches)</label>
                                <input type="number" className="input-field" value={roundN(side * SQRT3)} onChange={e => handleHeightInput(parseFloat(e.target.value) || 1)} min={0.2} max={10} step={0.1} />
                                <div style={{ fontSize: 11, marginTop: 2, color: "var(--color-text-tertiary)" }}>Side = height ÷ √3 = {toFrac(side)}&quot;</div>
                            </div>
                        )}
                    </div>

                    {/* ② SEAM ALLOWANCE */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>② EPP Seam Allowance</h2>
                        <div style={{ display: "flex", gap: 6 }}>
                            {SA_OPTIONS.map(o => (
                                <button key={o.value} className={`btn btn-sm ${sa === o.value ? "btn-primary" : "btn-secondary"}`}
                                    onClick={() => setSa(o.value)} style={{ textAlign: "left", fontSize: 12 }}>
                                    <div>{o.label}</div>
                                    <div style={{ fontSize: 10, opacity: 0.7 }}>{o.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ═══ PRIMARY RESULTS ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(150,60%,40%)" }}>
                        <h2 className={styles.calcTitle}>Your {toFrac(side)}&quot; Hexagon ({roundN(calc.mm, 0)}mm)</h2>

                        {/* SVG preview */}
                        <div style={{ textAlign: "center", marginBottom: 10 }}>{hexSvg}</div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 13, lineHeight: 1.9 }}>
                            <div style={{ padding: 10, background: "hsl(200,15%,97%)", borderRadius: 6 }}>
                                <div style={{ fontWeight: 700, color: "hsl(200,60%,40%)", fontSize: 12, marginBottom: 2 }}>Paper Template</div>
                                <div>Side: <strong>{toFrac(side)}&quot;</strong> ({roundN(calc.mm, 1)}mm)</div>
                                <div>Width (P→P): <strong>{toFrac(calc.width)}&quot;</strong></div>
                                <div>Height (F→F): <strong>{toFrac(calc.height)}&quot;</strong></div>
                                <div>Area: <strong>{roundN(calc.area, 2)} sq in</strong></div>
                            </div>
                            <div style={{ padding: 10, background: "hsl(30,15%,97%)", borderRadius: 6 }}>
                                <div style={{ fontWeight: 700, color: "hsl(30,60%,40%)", fontSize: 12, marginBottom: 2 }}>Fabric Cut (+{toFrac(sa)}&quot; SA)</div>
                                <div>Side: <strong>{toFrac(calc.fabricSide)}&quot;</strong></div>
                                <div>Width: <strong>{toFrac(calc.fabricW)}&quot;</strong></div>
                                <div>Height: <strong>{toFrac(calc.fabricH)}&quot;</strong></div>
                                <div>Min. scrap: <strong>{toFrac(ceilQ(calc.fabricW + 0.2))}&quot; × {toFrac(ceilQ(calc.fabricH + 0.2))}&quot;</strong></div>
                            </div>
                        </div>

                        {/* Fabric yield */}
                        <div style={{ marginTop: 8, padding: 10, background: "hsl(150,15%,97%)", borderRadius: 6, fontSize: 12, lineHeight: 1.9 }}>
                            <div style={{ fontWeight: 700, color: "hsl(150,50%,35%)", marginBottom: 2 }}>Fabric Yield (approx.)</div>
                            <div>Fat quarter (18&quot;×22&quot;): ~{calc.hexFQ} hexagons</div>
                            <div>Half yard (18&quot;×44&quot;): ~{calc.hexHalfYd} hexagons</div>
                            <div>Full yard (36&quot;×44&quot;): ~{calc.hexFullYd} hexagons</div>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="toolbar" style={{ marginBottom: 16 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} /> Copy</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                    </div>

                    {/* ═══ GRANDMOTHER'S FLOWER GARDEN ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
                            onClick={() => setShowFlower(!showFlower)}>
                            🌸 Grandmother&apos;s Flower Garden Planner
                            <ChevronDown size={14} style={{ transform: showFlower ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                        </button>
                        {showFlower && (
                            <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.8 }}>
                                <div className="calculator-form-row">
                                    <div className="input-group">
                                        <label className="input-label">Petal rings per flower</label>
                                        <div style={{ display: "flex", gap: 4 }}>
                                            {[1, 2, 3, 4].map(n => (
                                                <button key={n} className={`btn btn-sm ${rings === n ? "btn-primary" : "btn-secondary"}`}
                                                    onClick={() => setRings(n)}>{n} ring{n > 1 ? "s" : ""} ({3 * n * n + 3 * n + 1})</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label className="input-label">Number of flowers</label>
                                        <input type="number" className="input-field" value={numFlowers} onChange={e => setNumFlowers(parseInt(e.target.value) || 1)} min={1} max={100} />
                                    </div>
                                </div>

                                <div style={{ marginTop: 8, padding: 10, background: "hsl(330,15%,97%)", borderRadius: 6, lineHeight: 1.9 }}>
                                    <div style={{ fontWeight: 700, color: "hsl(330,50%,45%)" }}>Hexagon Count</div>
                                    <div>Center: <strong>{numFlowers}</strong> ({numFlowers} × 1)</div>
                                    {rings >= 1 && <div>Ring 1 petals: <strong>{numFlowers * 6}</strong> ({numFlowers} × 6)</div>}
                                    {rings >= 2 && <div>Ring 2 petals: <strong>{numFlowers * 12}</strong> ({numFlowers} × 12)</div>}
                                    {rings >= 3 && <div>Ring 3 petals: <strong>{numFlowers * 18}</strong> ({numFlowers} × 18)</div>}
                                    {rings >= 4 && <div>Ring 4 petals: <strong>{numFlowers * 24}</strong> ({numFlowers} × 24)</div>}
                                    <div>Flower hexagons: <strong>{calc.flowerHexes}</strong></div>
                                    <div>Path/background (est.): <strong>~{calc.pathHexes}</strong></div>
                                    <div style={{ fontWeight: 700, fontSize: 15, color: "hsl(150,60%,35%)" }}>Total: ~{calc.totalHexes} hexagons</div>
                                    <div style={{ fontSize: 11, marginTop: 4, color: "var(--color-text-tertiary)" }}>
                                        Paper templates needed: {calc.totalHexes} papers
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ═══ YARDAGE ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
                            onClick={() => setShowYardage(!showYardage)}>
                            🧵 Yardage Estimate
                            <ChevronDown size={14} style={{ transform: showYardage ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                        </button>
                        {showYardage && (
                            <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.8 }}>
                                {[
                                    { label: `Centers (${numFlowers})`, count: numFlowers, color: "hsl(40,20%,97%)" },
                                    ...(rings >= 1 ? [{ label: `Ring 1 petals (${numFlowers * 6})`, count: numFlowers * 6, color: "hsl(330,15%,97%)" }] : []),
                                    ...(rings >= 2 ? [{ label: `Ring 2 petals (${numFlowers * 12})`, count: numFlowers * 12, color: "hsl(280,15%,97%)" }] : []),
                                    { label: `Path/background (~${calc.pathHexes})`, count: calc.pathHexes, color: "hsl(200,15%,97%)" },
                                ].map((c, i) => {
                                    const yd = roundN(c.count / calc.hexFullYd, 2);
                                    const buy = ceilQ(yd + 0.1);
                                    return (
                                        <div key={i} style={{ padding: 8, background: c.color, borderRadius: 6, marginBottom: 4 }}>
                                            <strong>{c.label}</strong>: {c.count} hexagons → {roundN(yd, 1)} yd → <strong>buy {toFrac(buy)} yd</strong>
                                        </div>
                                    );
                                })}
                                <div style={{ padding: 8, background: "hsl(45,30%,96%)", borderRadius: 6, fontSize: 11, marginTop: 4, color: "var(--color-text-secondary)" }}>
                                    ⚠ EPP uses more fabric than machine piecing due to seam allowance wrapping. Add 10-15% extra for scrappy cutting.
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ═══ DIMENSION REFERENCE TABLE ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
                            onClick={() => setShowRef(!showRef)}>
                            📐 Hexagon Size Reference Table
                            <ChevronDown size={14} style={{ transform: showRef ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                        </button>
                        {showRef && (
                            <div style={{ marginTop: 10, overflowX: "auto" }}>
                                <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}>
                                    <thead><tr style={{ borderBottom: "2px solid hsl(0,0%,85%)" }}>
                                        <th style={{ textAlign: "left", padding: "5px 4px" }}>Side</th>
                                        <th style={{ textAlign: "right", padding: "5px 4px" }}>Width</th>
                                        <th style={{ textAlign: "right", padding: "5px 4px" }}>Height</th>
                                        <th style={{ textAlign: "right", padding: "5px 4px" }}>Area</th>
                                    </tr></thead>
                                    <tbody>
                                        {REF_TABLE.map((r, i) => {
                                            const isCurrent = Math.abs(r.side - side) < 0.01;
                                            return (
                                                <tr key={i} style={{ background: isCurrent ? "hsl(150,40%,95%)" : undefined, borderBottom: "1px solid hsl(0,0%,92%)", cursor: "pointer" }}
                                                    onClick={() => setSide(r.side)}>
                                                    <td style={{ padding: "4px 4px", fontWeight: isCurrent ? 700 : 400 }}>{toFrac(r.side)}&quot;</td>
                                                    <td style={{ textAlign: "right", padding: "4px 4px" }}>{toFrac(r.w)}&quot;</td>
                                                    <td style={{ textAlign: "right", padding: "4px 4px" }}>{r.h.toFixed(3)}&quot;</td>
                                                    <td style={{ textAlign: "right", padding: "4px 4px" }}>{r.area.toFixed(3)}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                <div style={{ fontSize: 9, marginTop: 4, color: "var(--color-text-tertiary)" }}>Click any row to fill calculator with that size.</div>
                            </div>
                        )}
                    </div>

                    {/* ═══ MM CONVERSION TABLE ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
                            onClick={() => setShowMM(!showMM)}>
                            🔄 mm ↔ Inches Conversion Table
                            <ChevronDown size={14} style={{ transform: showMM ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                        </button>
                        {showMM && (
                            <div style={{ marginTop: 10, overflowX: "auto" }}>
                                <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}>
                                    <thead><tr style={{ borderBottom: "2px solid hsl(0,0%,85%)" }}>
                                        <th style={{ textAlign: "left", padding: "5px 4px" }}>mm</th>
                                        <th style={{ textAlign: "right", padding: "5px 4px" }}>Side (in)</th>
                                        <th style={{ textAlign: "right", padding: "5px 4px" }}>Width</th>
                                        <th style={{ textAlign: "right", padding: "5px 4px" }}>Height</th>
                                    </tr></thead>
                                    <tbody>
                                        {[6, 10, 12, 16, 19, 22, 25, 32, 38, 50].map((mm, i) => {
                                            const sInch = mm / 25.4;
                                            return (
                                                <tr key={i} style={{ borderBottom: "1px solid hsl(0,0%,92%)", cursor: "pointer" }}
                                                    onClick={() => setSide(roundN(sInch, 3))}>
                                                    <td style={{ padding: "4px 4px", fontWeight: 600 }}>{mm}mm</td>
                                                    <td style={{ textAlign: "right", padding: "4px 4px" }}>{toFrac(sInch)}&quot;</td>
                                                    <td style={{ textAlign: "right", padding: "4px 4px" }}>{toFrac(sInch * 2)}&quot;</td>
                                                    <td style={{ textAlign: "right", padding: "4px 4px" }}>{(sInch * SQRT3).toFixed(2)}&quot;</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* ═══ QUILT SIZE REFERENCE ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
                            onClick={() => setShowQuiltRef(!showQuiltRef)}>
                            🛏️ Hexagon Count by Quilt Size
                            <ChevronDown size={14} style={{ transform: showQuiltRef ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                        </button>
                        {showQuiltRef && (
                            <div style={{ marginTop: 10, overflowX: "auto" }}>
                                <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}>
                                    <thead><tr style={{ borderBottom: "2px solid hsl(0,0%,85%)" }}>
                                        <th style={{ textAlign: "left", padding: "5px 4px" }}>Quilt Size</th>
                                        <th style={{ textAlign: "right", padding: "5px 4px" }}>~Hexagons (1&quot; side)</th>
                                        <th style={{ textAlign: "right", padding: "5px 4px" }}>Papers</th>
                                    </tr></thead>
                                    <tbody>
                                        {QUILT_SIZES.map((q, i) => (
                                            <tr key={i} style={{ borderBottom: "1px solid hsl(0,0%,92%)" }}>
                                                <td style={{ padding: "4px 4px" }}>{q.name}</td>
                                                <td style={{ textAlign: "right", padding: "4px 4px", fontWeight: 600 }}>~{q.hexes.toLocaleString()}</td>
                                                <td style={{ textAlign: "right", padding: "4px 4px" }}>{q.hexes.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div style={{ fontSize: 9, marginTop: 4, color: "var(--color-text-tertiary)" }}>
                                    Based on 1&quot; side hexagons in solid grid layout. GFG layouts may differ.
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ═══ FLOWER RING REFERENCE ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
                            onClick={() => setShowBasting(!showBasting)}>
                            🌼 Flower Ring Count Reference
                            <ChevronDown size={14} style={{ transform: showBasting ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                        </button>
                        {showBasting && (
                            <div style={{ marginTop: 10, overflowX: "auto" }}>
                                <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}>
                                    <thead><tr style={{ borderBottom: "2px solid hsl(0,0%,85%)" }}>
                                        <th style={{ textAlign: "left", padding: "5px 4px" }}>Rings</th>
                                        <th style={{ textAlign: "right", padding: "5px 4px" }}>Hexagons/Ring</th>
                                        <th style={{ textAlign: "right", padding: "5px 4px" }}>Total</th>
                                        <th style={{ textAlign: "right", padding: "5px 4px" }}>~Diameter (1&quot;)</th>
                                    </tr></thead>
                                    <tbody>
                                        {FLOWER_RINGS.map((fr, i) => (
                                            <tr key={i} style={{ background: fr.rings === rings ? "hsl(150,40%,95%)" : undefined, borderBottom: "1px solid hsl(0,0%,92%)" }}>
                                                <td style={{ padding: "4px 4px" }}>{fr.rings === 0 ? "Center" : `${fr.rings} ring${fr.rings > 1 ? "s" : ""}`}</td>
                                                <td style={{ textAlign: "right", padding: "4px 4px" }}>{fr.perRing || "—"}</td>
                                                <td style={{ textAlign: "right", padding: "4px 4px", fontWeight: 600 }}>{fr.total}</td>
                                                <td style={{ textAlign: "right", padding: "4px 4px" }}>~{fr.diam}&quot;</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div style={{ fontSize: 10, marginTop: 4, color: "var(--color-text-tertiary)" }}>
                                    Formula: hexagons in ring N = 6N. Total through ring N = 3N² + 3N + 1. Traditional GFG = 2 rings (19 hex).
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ═══ COMPATIBLE SHAPES ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
                            onClick={() => setShowCompat(!showCompat)}>
                            🔷 Compatible EPP Shapes
                            <ChevronDown size={14} style={{ transform: showCompat ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                        </button>
                        {showCompat && (
                            <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.8 }}>
                                {[
                                    { shape: "Equilateral Triangle", dims: `Side: ${toFrac(side)}" — Height: ${toFrac(calc.triHeight)}"`, use: "Fill edges, decorative elements" },
                                    { shape: "60° Diamond (Rhombus)", dims: `Side: ${toFrac(side)}" — Width: ${toFrac(calc.diamondW)}" — Height: ${toFrac(calc.diamondH)}"`, use: "Lone Star designs" },
                                    { shape: "Half Hexagon", dims: `Width: ${toFrac(calc.halfHexW)}" — Height: ${toFrac(calc.halfHexH)}"`, use: "Create straight quilt edges" },
                                ].map((s, i) => (
                                    <div key={i} style={{ padding: 8, background: i % 2 === 0 ? "hsl(200,15%,97%)" : "hsl(150,15%,97%)", borderRadius: 6, marginBottom: 4 }}>
                                        <strong>{s.shape}:</strong> {s.dims}
                                        <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>Use: {s.use}</div>
                                    </div>
                                ))}
                                <div style={{ fontSize: 11, marginTop: 4, color: "var(--color-text-tertiary)" }}>
                                    All compatible shapes use the same side length ({toFrac(side)}&quot;) for seamless EPP assembly.
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ═══ MATH EXPLANATION ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
                            onClick={() => setShowMath(!showMath)}>
                            📐 Hexagon Math Explained
                            <ChevronDown size={14} style={{ transform: showMath ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                        </button>
                        {showMath && (
                            <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.9, color: "var(--color-text-secondary)" }}>
                                <div style={{ padding: 10, background: "hsl(200,15%,97%)", borderRadius: 6, fontFamily: "monospace" }}>
                                    <div><strong>Side S = {toFrac(side)}&quot;</strong></div>
                                    <div>Width = S × 2 = {toFrac(side)} × 2 = <strong>{toFrac(calc.width)}&quot;</strong></div>
                                    <div>Height = S × √3 = {toFrac(side)} × 1.732 = <strong>{calc.height.toFixed(3)}&quot;</strong></div>
                                    <div>Area = S² × (3√3/2) = {side}² × 2.598 = <strong>{roundN(calc.area, 3)} sq in</strong></div>
                                </div>
                                <div style={{ marginTop: 6, fontSize: 12 }}>
                                    <strong>Why √3?</strong> A hexagon is 6 equilateral triangles. Drawing a line from flat to flat creates two 30-60-90 triangles. The ratio long-leg/hypotenuse = √3/2, so height = side × √3.
                                </div>
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
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Hexagon Formula</h4>
                        <div style={{ fontSize: 12, fontFamily: "monospace", lineHeight: 2, color: "var(--color-text-secondary)" }}>
                            <div><strong>Width</strong> = side × 2</div>
                            <div><strong>Height</strong> = side × √3</div>
                            <div><strong>Area</strong> = S² × 2.598</div>
                            <div style={{ marginTop: 6 }}><strong>Fabric:</strong></div>
                            <div>side + SA (each edge)</div>
                            <div style={{ marginTop: 6 }}><strong>Flower rings:</strong></div>
                            <div>Ring N = 6N hexagons</div>
                            <div>Total = 3N²+3N+1</div>
                        </div>
                    </div>
                    <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>EPP Tips</h4>
                        <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.9 }}>
                            <div>• 1&quot; side = most popular</div>
                            <div>• ⅜&quot; SA = standard EPP</div>
                            <div>• &quot;1 inch&quot; = side length!</div>
                            <div>• Hang 24h before binding</div>
                            <div>• Use basting glue for speed</div>
                            <div>• Remove papers after joining</div>
                        </div>
                    </div>
                    <div className="glass-card related-tools">
                        <h4>Related Tools</h4>
                        <a href="/quilt/binding-calculator" className="related-tool-link">Binding Calculator</a>
                        <a href="/quilt/backing-calculator" className="related-tool-link">Backing Calculator</a>
                        <a href="/quilt/dresden-plate-calculator" className="related-tool-link">Dresden Plate</a>
                        <a href="/quilt" className="related-tool-link">All Quilt Tools</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}