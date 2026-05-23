"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Grid3X3, ChevronDown } from "lucide-react";

/* ─── helpers ──────────────────────────────────── */
function toFrac(v: number): string {
    const w = Math.floor(v);
    const f = v - w;
    const fracs: [number, string][] = [[0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
    for (const [d, sym] of fracs) { if (Math.abs(f - d) < 0.02) return w > 0 ? `${w}${sym}` : sym; }
    if (f > 0.01) return v.toFixed(2);
    return String(w);
}
function roundUp(val: number, incr: number) { return Math.ceil(val / incr) * incr; }

/* ─── constants ─────────────────────────────────── */
const LAYOUT_PRESETS = [
    { label: "3×3", c: 3, r: 3 }, { label: "4×4", c: 4, r: 4 },
    { label: "4×5", c: 4, r: 5 }, { label: "5×6", c: 5, r: 6 },
    { label: "6×7", c: 6, r: 7 }, { label: "6×8", c: 6, r: 8 },
    { label: "7×8", c: 7, r: 8 }, { label: "8×10", c: 8, r: 10 },
];

const SASHING_PRESETS = ["1", "1.5", "2", "2.5", "3", "3.5", "4"];

type Placement = "between" | "full";
type Style = "plain" | "four-patch" | "hst" | "pinwheel" | "snowball";

const STYLE_INFO: Record<Style, { label: string; desc: string; minSash: number }> = {
    plain: { label: "Plain / Solid", desc: "Single fabric square — most common", minSash: 0 },
    "four-patch": { label: "Four-Patch", desc: "4 small squares, 2-color grid", minSash: 1.5 },
    hst: { label: "HST (Diagonal)", desc: "Half-square triangle split", minSash: 1.5 },
    pinwheel: { label: "Pinwheel", desc: "4 HSTs in pinwheel formation", minSash: 2.5 },
    snowball: { label: "Snowball", desc: "Square with cut corners", minSash: 1.5 },
};

/* ─── reference table data — pre-computed ────────── */
const REF_LAYOUTS = [
    { c: 3, r: 3 }, { c: 3, r: 4 }, { c: 4, r: 4 }, { c: 4, r: 5 },
    { c: 4, r: 6 }, { c: 5, r: 5 }, { c: 5, r: 6 }, { c: 5, r: 7 },
    { c: 6, r: 6 }, { c: 6, r: 7 }, { c: 6, r: 8 }, { c: 7, r: 7 },
    { c: 7, r: 8 }, { c: 7, r: 9 }, { c: 8, r: 10 },
];

/* ─── component ──────────────────────────────────── */
export default function Page() {
    const [cols, setCols] = useState(6);
    const [rows, setRows] = useState(7);
    const [sashW, setSashW] = useState("2");
    const [placement, setPlacement] = useState<Placement>("between");
    const [cStyle, setCStyle] = useState<Style>("plain");
    const [fabricW, setFabricW] = useState("44");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [showRef, setShowRef] = useState(false);
    const [showEdu, setShowEdu] = useState(false);

    const sw = parseFloat(sashW) || 2; // finished sashing width
    const usW = (parseFloat(fabricW) || 44) - 1; // usable width after selvage
    const cutSize = sw + 0.5; // standard cornerstone cut size

    /* ═══ CORE CALCULATION ═══ */
    const results = useMemo(() => {
        /* Cornerstone count */
        const countBetween = (cols - 1) * (rows - 1);
        const countFull = (cols + 1) * (rows + 1);
        const count = placement === "between" ? countBetween : countFull;
        const sashCols = placement === "between" ? cols - 1 : cols + 1;
        const sashRows = placement === "between" ? rows - 1 : rows + 1;

        /* Plain cornerstone yardage */
        const sqPerStrip = Math.floor(usW / cutSize);
        const stripsNeeded = Math.ceil(count / sqPerStrip);
        const fabricInches = stripsNeeded * cutSize;
        const fabricYd = +(fabricInches / 36).toFixed(2);
        const buyYd = roundUp(fabricYd + 0.05, 0.25);
        const extraFromStrips = (stripsNeeded * sqPerStrip) - count;

        /* Style-specific calcs */
        let styleCalc: {
            label: string;
            piecesPerStone: number;
            totalPieces: number;
            pieceCutSize: number; // for each sub-piece
            pieceCutLabel: string;
            colorACount: number;
            colorBCount: number;
            colorAStrips: number;
            colorBStrips: number;
            colorAYd: number;
            colorBYd: number;
            colorABuy: number;
            colorBBuy: number;
            note: string;
        } | null = null;

        if (cStyle === "four-patch") {
            const subFinished = sw / 2;
            const subCut = subFinished + 0.5;
            const totalSq = count * 4;
            const perColor = Math.ceil(totalSq / 2);
            const sqPS = Math.floor(usW / subCut);
            const strA = Math.ceil(perColor / sqPS);
            const ydA = +((strA * subCut) / 36).toFixed(2);
            styleCalc = {
                label: "Four-Patch",
                piecesPerStone: 4,
                totalPieces: totalSq,
                pieceCutSize: subCut,
                pieceCutLabel: `${toFrac(subCut)}" × ${toFrac(subCut)}"`,
                colorACount: perColor,
                colorBCount: perColor,
                colorAStrips: strA,
                colorBStrips: strA,
                colorAYd: ydA,
                colorBYd: ydA,
                colorABuy: roundUp(ydA + 0.05, 0.25),
                colorBBuy: roundUp(ydA + 0.05, 0.25),
                note: `Each small square: ${toFrac(subFinished)}" finished → ${toFrac(subCut)}" cut. Unfinished cornerstone: ${toFrac(cutSize)}" ✓`,
            };
        } else if (cStyle === "hst") {
            // 2-at-a-time method: cut sq = finished + 7/8"
            const hstCutSq = sw + 0.875;
            const pairs = Math.ceil(count / 2); // each pair of squares yields 2 HSTs
            const sqPS = Math.floor(usW / hstCutSq);
            const strA = Math.ceil(pairs / sqPS);
            const ydA = +((strA * hstCutSq) / 36).toFixed(2);
            styleCalc = {
                label: "HST (Half-Square Triangle)",
                piecesPerStone: 1, // 1 HST unit per cornerstone
                totalPieces: count,
                pieceCutSize: hstCutSq,
                pieceCutLabel: `${toFrac(hstCutSq)}" × ${toFrac(hstCutSq)}"`,
                colorACount: pairs,
                colorBCount: pairs,
                colorAStrips: strA,
                colorBStrips: strA,
                colorAYd: ydA,
                colorBYd: ydA,
                colorABuy: roundUp(ydA + 0.05, 0.25),
                colorBBuy: roundUp(ydA + 0.05, 0.25),
                note: `2-at-a-time method: ${pairs} pairs → ${pairs * 2} HSTs (need ${count}). Cut: ${toFrac(hstCutSq)}" squares. Unfinished: ${toFrac(cutSize)}" ✓`,
            };
        } else if (cStyle === "pinwheel") {
            // 4 HSTs per pinwheel, each HST finished = sw/2
            const hstFinished = sw / 2;
            const hstCutSq = hstFinished + 0.875;
            const totalHSTs = count * 4;
            const pairs = Math.ceil(totalHSTs / 2);
            const sqPS = Math.floor(usW / hstCutSq);
            const strA = Math.ceil(pairs / sqPS);
            const ydA = +((strA * hstCutSq) / 36).toFixed(2);
            styleCalc = {
                label: "Pinwheel (4 HSTs)",
                piecesPerStone: 4,
                totalPieces: totalHSTs,
                pieceCutSize: hstCutSq,
                pieceCutLabel: `${toFrac(hstCutSq)}" × ${toFrac(hstCutSq)}"`,
                colorACount: pairs,
                colorBCount: pairs,
                colorAStrips: strA,
                colorBStrips: strA,
                colorAYd: ydA,
                colorBYd: ydA,
                colorABuy: roundUp(ydA + 0.05, 0.25),
                colorBBuy: roundUp(ydA + 0.05, 0.25),
                note: `Each HST: ${toFrac(hstFinished)}" finished. ${pairs} pairs → ${pairs * 2} HSTs (need ${totalHSTs}). Unfinished cornerstone: ${toFrac(cutSize)}" ✓`,
            };
        } else if (cStyle === "snowball") {
            // Main square + 4 corner flip squares
            const cornerFinished = sw / 4; // approximate
            const cornerCut = cornerFinished + 0.5;
            const totalCorners = count * 4;
            const mainSqPS = Math.floor(usW / cutSize);
            const mainStrips = Math.ceil(count / mainSqPS);
            const mainYd = +((mainStrips * cutSize) / 36).toFixed(2);
            const cornerSqPS = Math.floor(usW / cornerCut);
            const cornerStrips = Math.ceil(totalCorners / cornerSqPS);
            const cornerYd = +((cornerStrips * cornerCut) / 36).toFixed(2);
            styleCalc = {
                label: "Snowball",
                piecesPerStone: 5, // 1 main + 4 corners
                totalPieces: count + totalCorners,
                pieceCutSize: cornerCut,
                pieceCutLabel: `Main: ${toFrac(cutSize)}" + Corners: ${toFrac(cornerCut)}"`,
                colorACount: count,
                colorBCount: totalCorners,
                colorAStrips: mainStrips,
                colorBStrips: cornerStrips,
                colorAYd: mainYd,
                colorBYd: cornerYd,
                colorABuy: roundUp(mainYd + 0.05, 0.25),
                colorBBuy: roundUp(cornerYd + 0.05, 0.25),
                note: `Main squares: ${toFrac(cutSize)}" cut. Corner flip squares: ${toFrac(cornerCut)}" cut (stitch-and-flip method). Unfinished: ${toFrac(cutSize)}" ✓`,
            };
        }

        return {
            count, countBetween, countFull, sashCols, sashRows,
            sqPerStrip, stripsNeeded, fabricInches, fabricYd, buyYd, extraFromStrips,
            styleCalc,
        };
    }, [cols, rows, placement, sw, cutSize, usW, cStyle]);

    const handlePreset = (c: number, r: number) => { setCols(c); setRows(r); };

    const copyText = `Cornerstones: ${results.count} squares at ${toFrac(cutSize)}" × ${toFrac(cutSize)}". Cut ${results.stripsNeeded} WOF strips at ${toFrac(cutSize)}". Buy ${toFrac(results.buyYd)} yards.`;

    /* FAQ items */
    const faqItems = [
        { q: "What are cornerstones in a quilt?", a: "Cornerstones (also called sashing squares, connector squares, or posts) are small squares placed at the intersections of sashing strips. They create a grid effect and add design interest. They're typically cut in an accent fabric to provide contrast at each intersection." },
        { q: "How many cornerstones does my quilt need?", a: `For sashing between blocks only: (columns − 1) × (rows − 1). For a 6×7 layout, that's 5 × 6 = 30 cornerstones. If sashing also goes around the outer edges, use (columns + 1) × (rows + 1) = 7 × 8 = 56. The count is NOT columns × rows — that's a common mistake.` },
        { q: "What size do I cut cornerstone squares?", a: "Cornerstones must match your sashing width. The cut size equals the finished sashing width plus ½\" for seam allowances. For example, 2\" finished sashing → cut cornerstones at 2½\" × 2½\"." },
        { q: "How do I calculate cornerstone yardage?", a: "Divide your usable fabric width (typically 42½\") by the cornerstone cut size to find squares per strip. Divide total cornerstones by squares per strip to find strips needed. Multiply strips × cut size for total inches, then divide by 36 for yards." },
        { q: "Do cornerstones go on the outer edges of the quilt?", a: "It depends on your sashing style. 'Between blocks only' places cornerstones only at inner intersections. 'Full sashing' (around all outer edges) adds cornerstones to the perimeter too, nearly doubling the count. Most patterns use between-blocks-only." },
        { q: "Can I use different fabric for cornerstones than sashing?", a: "Yes! This is the most popular design choice. A contrasting fabric for cornerstones (like a dark accent against lighter sashing) creates visual interest at every intersection. Calculate yardage separately for each fabric." },
        { q: "What are pieced cornerstones?", a: "Instead of plain squares, pieced cornerstones use multiple fabric pieces sewn together — four-patch, HST (half-square triangle), pinwheel, or snowball designs. They make each intersection a mini design element. The cornerstone finishes at the same size as sashing width." },
        { q: "Can I make my cornerstones into pinwheels?", a: "Yes! Pinwheel cornerstones use 4 HSTs arranged in a spinning formation. Each HST finishes at half the sashing width. Best with sashing 2½\" or wider for manageable piece sizes. They create a dynamic effect at every intersection." },
        { q: "Why does cornerstone size have to match sashing width?", a: "Sashing strips and cornerstones form a grid. For the grid to lie flat, the cornerstone must be exactly the same finished size as the sashing width. If it's larger, you get bumps; smaller, you get gaps. Both cause alignment problems." },
        { q: "How do I arrange scrappy cornerstones for best visual balance?", a: "For random scrappy, mix all cornerstone squares before placing. For planned scrappy, try row-based colors, diagonal stripes, or checkerboard patterns. Avoid placing the same fabric in adjacent positions for the most balanced look." },
        { q: "What is the difference between a cornerstone and a setting square?", a: "Cornerstones are small squares at sashing intersections. Setting squares (alternate blocks) are full-size blank blocks placed between pieced blocks. They serve different purposes — cornerstones accent the grid, setting squares showcase quilting." },
        { q: "Can I cut cornerstones from the same fabric as my sashing?", a: "Yes, if using the same fabric, you can often cut cornerstones from sashing strip remnants. After cutting your sashing strips, check if leftover fabric is wide enough. A fat quarter of sashing fabric typically yields 60+ cornerstones at 2½\"." },
    ];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "Cornerstone Calculator" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    {/* HEADER */}
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Grid3X3 size={14} strokeWidth={1.5} /> Quilt #145</span>
                        <h1>Cornerstone Calculator</h1>
                        <p>Calculate how many cornerstones your quilt needs, what size to cut them, yardage required, and pieced cornerstone cutting plans including four-patch, HST, pinwheel, and snowball options.</p>
                    </div>

                    {/* ① LAYOUT */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>① Quilt Layout</h2>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
                            {LAYOUT_PRESETS.map(p => (
                                <button key={p.label} className={`btn btn-sm ${cols === p.c && rows === p.r ? "btn-primary" : "btn-secondary"}`}
                                    onClick={() => handlePreset(p.c, p.r)}>{p.label}</button>
                            ))}
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Blocks across (columns)</label>
                                <input type="number" className="input-field" value={cols} onChange={e => setCols(parseInt(e.target.value) || 1)} min={2} max={20} /></div>
                            <div className="input-group"><label className="input-label">Blocks down (rows)</label>
                                <input type="number" className="input-field" value={rows} onChange={e => setRows(parseInt(e.target.value) || 1)} min={2} max={20} /></div>
                        </div>
                        <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 4 }}>
                            Total blocks: {cols} × {rows} = {cols * rows}
                        </div>
                    </div>

                    {/* ② SASHING */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>② Sashing &amp; Placement</h2>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Finished sashing width</label>
                                <select className="input-field" value={sashW} onChange={e => setSashW(e.target.value)}>
                                    {SASHING_PRESETS.map(v => <option key={v} value={v}>{v}&quot;</option>)}
                                    <option value="5">5&quot;</option>
                                </select></div>
                            <div className="input-group"><label className="input-label">Fabric width</label>
                                <select className="input-field" value={fabricW} onChange={e => setFabricW(e.target.value)}>
                                    <option value="42">42&quot;</option><option value="44">44&quot;</option><option value="45">45&quot;</option><option value="60">60&quot;</option>
                                </select></div>
                        </div>
                        <div style={{ marginTop: 10 }}>
                            <label className="input-label" style={{ marginBottom: 6, display: "block" }}>Sashing placement</label>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                <button className={`btn btn-sm ${placement === "between" ? "btn-primary" : "btn-secondary"}`}
                                    onClick={() => setPlacement("between")}
                                    style={{ display: "flex", flexDirection: "column", lineHeight: 1.3, padding: "8px 12px", alignItems: "flex-start" }}>
                                    <span style={{ fontWeight: 600 }}>Between Blocks Only</span>
                                    <span style={{ fontSize: 10, opacity: 0.8, fontWeight: 400 }}>(cols−1) × (rows−1) • most common</span>
                                </button>
                                <button className={`btn btn-sm ${placement === "full" ? "btn-primary" : "btn-secondary"}`}
                                    onClick={() => setPlacement("full")}
                                    style={{ display: "flex", flexDirection: "column", lineHeight: 1.3, padding: "8px 12px", alignItems: "flex-start" }}>
                                    <span style={{ fontWeight: 600 }}>Full Sashing (+ outer edges)</span>
                                    <span style={{ fontSize: 10, opacity: 0.8, fontWeight: 400 }}>(cols+1) × (rows+1) • border effect</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ③ CORNERSTONE STYLE */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>③ Cornerstone Style</h2>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {(Object.entries(STYLE_INFO) as [Style, typeof STYLE_INFO.plain][]).map(([key, info]) => (
                                <button key={key}
                                    className={`btn btn-sm ${cStyle === key ? "btn-primary" : "btn-secondary"}`}
                                    onClick={() => setCStyle(key)}
                                    disabled={sw < info.minSash}
                                    style={{ display: "flex", flexDirection: "column", lineHeight: 1.3, padding: "8px 12px", alignItems: "flex-start", opacity: sw < info.minSash ? 0.5 : 1 }}>
                                    <span style={{ fontWeight: 600 }}>{info.label}</span>
                                    <span style={{ fontSize: 10, opacity: 0.8, fontWeight: 400 }}>{info.desc}{sw < info.minSash ? ` (min ${info.minSash}" sashing)` : ""}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ═══ PRIMARY RESULT — CORNERSTONE COUNT ═══ */}
                    <div className={`calculator-results ${styles.results}`}>
                        <div className="result-card">
                            <div className="result-value">{results.count} Cornerstones</div>
                            <div className="result-label">
                                {cols} across × {rows} down • {placement === "between" ? "sashing between blocks" : "full sashing with outer edges"}
                            </div>
                        </div>

                        {/* Formula explanation */}
                        <div style={{ padding: 12, background: "hsl(200,40%,96%)", borderRadius: "var(--radius-md)", fontSize: 13, lineHeight: 1.8, fontFamily: "var(--font-mono, monospace)", marginTop: 10 }}>
                            {placement === "between" ? (
                                <>
                                    <div><strong>Formula:</strong> (cols − 1) × (rows − 1)</div>
                                    <div>= ({cols} − 1) × ({rows} − 1)</div>
                                    <div>= {cols - 1} sash columns × {rows - 1} sash rows</div>
                                    <div>= <strong>{results.count} cornerstones</strong></div>
                                </>
                            ) : (
                                <>
                                    <div><strong>Formula:</strong> (cols + 1) × (rows + 1)</div>
                                    <div>= ({cols} + 1) × ({rows} + 1)</div>
                                    <div>= {cols + 1} sash columns × {rows + 1} sash rows</div>
                                    <div>= <strong>{results.count} cornerstones</strong></div>
                                </>
                            )}
                        </div>

                        {/* Count comparison */}
                        <div className={styles.resultDetails} style={{ marginTop: 10 }}>
                            <div className={styles.resultRow}><span>Between blocks only</span><strong>{results.countBetween} cornerstones</strong></div>
                            <div className={styles.resultRow}><span>Full sashing (+ edges)</span><strong>{results.countFull} cornerstones</strong></div>
                            <div className={styles.resultRow}><span>Difference</span><strong>+{results.countFull - results.countBetween} ({placement === "between" ? "you save" : "extra for edges"})</strong></div>
                        </div>
                    </div>

                    {/* ═══ CUTTING INSTRUCTIONS — PLAIN ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Cutting Instructions{cStyle !== "plain" ? " (Plain Base)" : ""}</h2>
                        <div className={styles.resultDetails}>
                            <div className={styles.resultRow}><span>Cornerstone finished size</span><strong>{toFrac(sw)}&quot; × {toFrac(sw)}&quot;</strong></div>
                            <div className={styles.resultRow}><span>Cornerstone cut size</span><strong>{toFrac(cutSize)}&quot; × {toFrac(cutSize)}&quot;</strong></div>
                            <div className={styles.resultRow}><span>Total cornerstones</span><strong>{results.count}</strong></div>
                            <div className={styles.resultRow}><span>Squares per WOF strip</span><strong>{results.sqPerStrip} (from {toFrac(usW)}&quot; usable width)</strong></div>
                            <div className={styles.resultRow}><span>WOF strips needed</span><strong>{results.stripsNeeded} strip{results.stripsNeeded > 1 ? "s" : ""} at {toFrac(cutSize)}&quot;</strong></div>
                            {results.extraFromStrips > 0 && (
                                <div className={styles.resultRow}><span>Extra squares from strips</span><strong>{results.extraFromStrips} spare{results.extraFromStrips > 1 ? "s" : ""}</strong></div>
                            )}
                            <div className={styles.resultRow}><span>Fabric length needed</span><strong>{results.fabricInches}&quot; = {results.fabricYd} yards</strong></div>
                            <div className={styles.resultRow} style={{ fontWeight: 600 }}><span>Buy</span><strong style={{ color: "hsl(150,60%,35%)" }}>{toFrac(results.buyYd)} yard{results.buyYd !== 1 ? "s" : ""}</strong></div>
                        </div>
                    </div>

                    {/* ═══ PIECED CORNERSTONE PLAN ═══ */}
                    {cStyle !== "plain" && results.styleCalc && (
                        <div className={`glass-card ${styles.calculatorCard}`}>
                            <h2 className={styles.calcTitle}>{results.styleCalc.label} Cornerstone Plan</h2>
                            <div className={styles.resultDetails}>
                                <div className={styles.resultRow}><span>Total cornerstones</span><strong>{results.count}</strong></div>
                                <div className={styles.resultRow}><span>Sub-pieces per cornerstone</span><strong>{results.styleCalc.piecesPerStone}</strong></div>
                                <div className={styles.resultRow}><span>Total sub-pieces</span><strong>{results.styleCalc.totalPieces}</strong></div>
                                <div className={styles.resultRow}><span>Sub-piece cut size</span><strong>{results.styleCalc.pieceCutLabel}</strong></div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
                                <div style={{ padding: 10, background: "hsl(210,40%,96%)", borderRadius: "var(--radius-md)" }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Color A ({cStyle === "snowball" ? "Main squares" : "Fabric A"})</div>
                                    <div style={{ fontSize: 13, lineHeight: 1.7 }}>
                                        <div>Pieces: {results.styleCalc.colorACount}</div>
                                        <div>Strips: {results.styleCalc.colorAStrips}</div>
                                        <div>Yardage: {results.styleCalc.colorAYd} yd</div>
                                        <div style={{ fontWeight: 600, color: "hsl(150,60%,35%)" }}>Buy: {toFrac(results.styleCalc.colorABuy)} yd</div>
                                    </div>
                                </div>
                                <div style={{ padding: 10, background: "hsl(0,30%,96%)", borderRadius: "var(--radius-md)" }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Color B ({cStyle === "snowball" ? "Corner triangles" : "Fabric B"})</div>
                                    <div style={{ fontSize: 13, lineHeight: 1.7 }}>
                                        <div>Pieces: {results.styleCalc.colorBCount}</div>
                                        <div>Strips: {results.styleCalc.colorBStrips}</div>
                                        <div>Yardage: {results.styleCalc.colorBYd} yd</div>
                                        <div style={{ fontWeight: 600, color: "hsl(150,60%,35%)" }}>Buy: {toFrac(results.styleCalc.colorBBuy)} yd</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 8 }}>
                                {results.styleCalc.note}
                            </div>
                        </div>
                    )}

                    {/* Toolbar */}
                    <div className="toolbar" style={{ marginBottom: 16 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} /> Copy</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                    </div>

                    {/* ═══ VISUAL GRID ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Quilt Grid — Cornerstone Positions</h2>
                        <div style={{ overflowX: "auto" }}>
                            <div style={{
                                display: "inline-grid",
                                gridTemplateColumns: (() => {
                                    const totalGridCols = placement === "full" ? cols * 2 + 1 : cols * 2 - 1;
                                    return Array.from({ length: totalGridCols }, (_, c) => {
                                        const isBlockCol = placement === "full" ? c % 2 === 1 : c % 2 === 0;
                                        return isBlockCol ? "28px" : "16px";
                                    }).join(" ");
                                })(),
                                gap: 2, padding: 8
                            }}>
                                {(() => {
                                    const cells: JSX.Element[] = [];
                                    const totalGridCols = placement === "full" ? cols * 2 + 1 : cols * 2 - 1;
                                    const totalGridRows = placement === "full" ? rows * 2 + 1 : rows * 2 - 1;
                                    let stoneNum = 0;

                                    for (let r = 0; r < totalGridRows; r++) {
                                        for (let c = 0; c < totalGridCols; c++) {
                                            const isBlockRow = placement === "full" ? r % 2 === 1 : r % 2 === 0;
                                            const isBlockCol = placement === "full" ? c % 2 === 1 : c % 2 === 0;
                                            const isSashRow = !isBlockRow;
                                            const isSashCol = !isBlockCol;

                                            if (isBlockRow && isBlockCol) {
                                                // Block
                                                cells.push(<div key={`${r}-${c}`} style={{ width: 28, height: 20, background: "hsl(200,50%,85%)", borderRadius: 2, fontSize: 7, display: "flex", alignItems: "center", justifyContent: "center", color: "hsl(200,50%,40%)" }}>B</div>);
                                            } else if (isSashRow && isSashCol) {
                                                // Cornerstone
                                                stoneNum++;
                                                cells.push(<div key={`${r}-${c}`} style={{ width: 16, height: 16, background: "hsl(340,60%,55%)", borderRadius: 2, fontSize: 7, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700 }}>{stoneNum}</div>);
                                            } else if (isBlockRow && isSashCol) {
                                                // Vertical sashing
                                                cells.push(<div key={`${r}-${c}`} style={{ width: 16, height: 20, background: "hsl(45,40%,85%)", borderRadius: 1 }} />);
                                            } else {
                                                // Horizontal sashing
                                                cells.push(<div key={`${r}-${c}`} style={{ width: 28, height: 16, background: "hsl(45,40%,85%)", borderRadius: 1 }} />);
                                            }
                                        }
                                    }
                                    return cells;
                                })()}
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 12, fontSize: 11, marginTop: 8, color: "var(--color-text-secondary)" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 3 }}><span style={{ width: 10, height: 10, background: "hsl(200,50%,85%)", borderRadius: 2, display: "inline-block" }} /> Blocks ({cols * rows})</span>
                            <span style={{ display: "flex", alignItems: "center", gap: 3 }}><span style={{ width: 10, height: 10, background: "hsl(45,40%,85%)", borderRadius: 2, display: "inline-block" }} /> Sashing</span>
                            <span style={{ display: "flex", alignItems: "center", gap: 3 }}><span style={{ width: 10, height: 10, background: "hsl(340,60%,55%)", borderRadius: 2, display: "inline-block" }} /> Cornerstones ({results.count})</span>
                        </div>
                    </div>

                    {/* ═══ REFERENCE TABLE ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
                            onClick={() => setShowRef(!showRef)}>
                            📊 Cornerstone Count Reference Table
                            <ChevronDown size={14} style={{ transform: showRef ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                        </button>
                        {showRef && (
                            <div style={{ marginTop: 10 }}>
                                <div className={styles.tableWrap}>
                                    <table className={styles.convTable}>
                                        <thead><tr><th>Layout</th><th>Between Only</th><th>Full Sashing</th><th>Difference</th></tr></thead>
                                        <tbody>
                                            {REF_LAYOUTS.map((l, i) => (
                                                <tr key={i} style={{ background: l.c === cols && l.r === rows ? "hsl(150,40%,93%)" : undefined }}>
                                                    <td style={{ fontWeight: l.c === cols && l.r === rows ? 700 : 400 }}>{l.c}×{l.r} ({l.c * l.r} blocks)</td>
                                                    <td>{(l.c - 1) * (l.r - 1)}</td>
                                                    <td>{(l.c + 1) * (l.r + 1)}</td>
                                                    <td>+{(l.c + 1) * (l.r + 1) - (l.c - 1) * (l.r - 1)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ═══ EDUCATIONAL ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
                            onClick={() => setShowEdu(!showEdu)}>
                            📚 Why the Cornerstone Count Confuses Most Quilters
                            <ChevronDown size={14} style={{ transform: showEdu ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                        </button>
                        {showEdu && (
                            <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
                                <p style={{ marginBottom: 8 }}><strong>The common mistake:</strong> &quot;I have a 6×7 quilt, so I need 6×7 = 42 cornerstones.&quot; <strong style={{ color: "hsl(0,70%,50%)" }}>Wrong!</strong></p>
                                <p style={{ marginBottom: 8 }}>Cornerstones go at <strong>intersections</strong> of sashing strips, not at blocks. If you have 6 blocks in a row with sashing between them, there are <strong>5 gaps</strong> (not 6). Similarly, 7 rows create <strong>6 horizontal gaps</strong>.</p>
                                <p style={{ marginBottom: 8 }}>Intersections: 5 columns × 6 rows = <strong>30 cornerstones</strong> (not 42).</p>
                                <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 12 }}>Full Sashing Changes Everything</h4>
                                <p style={{ marginBottom: 8 }}>If sashing also goes around the outer edges, you add one sashing column on each side and one sashing row on top and bottom: ({cols}+1) × ({rows}+1) = <strong>{(cols + 1) * (rows + 1)} cornerstones</strong>. That&apos;s {(cols + 1) * (rows + 1) - (cols - 1) * (rows - 1)} more than between-only!</p>
                                <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 12 }}>Assembly Order</h4>
                                <ol style={{ paddingLeft: 20 }}>
                                    <li>Lay out all blocks, sashing strips, and cornerstones</li>
                                    <li>Sew blocks and short sashing strips into horizontal rows</li>
                                    <li>Sew cornerstones and sashing strips into sashing rows</li>
                                    <li>Join block rows and sashing rows alternately</li>
                                    <li>Press entire quilt top</li>
                                </ol>
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
                        <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.9, fontFamily: "var(--font-mono, monospace)" }}>
                            <div>Between: (C−1)×(R−1)</div>
                            <div>Full: (C+1)×(R+1)</div>
                            <div>Cut = Sash + ½&quot;</div>
                        </div>
                    </div>
                    <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Quick Answer</h4>
                        <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.8 }}>
                            <div>3×3 → 4 stones</div>
                            <div>4×5 → 12 stones</div>
                            <div>5×6 → 20 stones</div>
                            <div>6×7 → 30 stones</div>
                            <div>7×8 → 42 stones</div>
                            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 4 }}>Between blocks only</div>
                        </div>
                    </div>
                    <div className="glass-card related-tools">
                        <h4>Related Tools</h4>
                        <a href="/quilt/sashing-calculator" className="related-tool-link">Sashing Calculator</a>
                        <a href="/quilt/blocks-needed" className="related-tool-link">Blocks Needed Calculator</a>
                        <a href="/quilt/border-calculator" className="related-tool-link">Border Calculator</a>
                        <a href="/quilt/backing-calculator" className="related-tool-link">Backing Calculator</a>
                        <a href="/quilt" className="related-tool-link">All Quilt Tools</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}