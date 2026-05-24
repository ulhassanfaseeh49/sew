"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, ChevronDown, Hexagon } from "lucide-react";

/* helpers */
function toFrac(v: number): string {
    if (v <= 0) return "0";
    const w = Math.floor(v);
    const f = v - w;
    const map: [number, string][] = [[0, ""], [0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
    let best = map[0], bd = 1;
    for (const [n, s] of map) { const d = Math.abs(f - n); if (d < bd) { bd = d; best = [n, s]; } }
    if (Math.abs(f - 1) < bd) return `${w + 1}`;
    if (!best[1]) return w > 0 ? `${w}` : "0";
    return w > 0 ? `${w}${best[1]}` : `${best[1]}`;
}
function toF(v: number): string { return toFrac(v) + '"'; }

const SA = 0.5;
const blockPresets = [4, 5, 6, 8, 9, 10, 12, 14, 15, 16, 18];

const depthOptions: { label: string; frac: number; desc: string }[] = [
    { label: "Very Small", frac: 1 / 8, desc: "Tiny corner accent" },
    { label: "Small (¼)", frac: 1 / 4, desc: "Subtle bevel" },
    { label: "Standard (⅓)", frac: 1 / 3, desc: "Classic snowball ★" },
    { label: "Half-Point (½)", frac: 1 / 2, desc: "Circles meet perfectly" },
    { label: "Large (⅔)", frac: 2 / 3, desc: "Dramatic octagon" },
];

const faqItems = [
    { q: "What size corner squares for a snowball block?", a: "Corner square cut size = desired finished triangle leg + ½\". For a 9\" block with ⅓ depth (3\" leg): corner = 3\" + 0.5\" = 3.5\" cut. For half-point circles: corner = block ÷ 2 + 0.5\"." },
    { q: "How do I make a snowball quilt block?", a: "Cut one large square (main) and four small squares (corners). Draw diagonal on each corner square. Place on main square corners, right sides together. Stitch ON the diagonal line. Trim to ¼\" seam allowance. Press corner back. Repeat all 4 corners." },
    { q: "What is the stitch-and-flip technique?", a: "Place a small square on a larger piece, right sides together. Draw a diagonal line and stitch exactly ON that line (not ¼\" away). Trim excess, press back. Used in snowball blocks, flying geese, square-in-a-square, and many other blocks." },
    { q: "What size corners for a 9-inch snowball block?", a: "Standard (⅓ depth): 3.5\" corner squares (3\" finished leg). Half-point (circles): 5\" corner squares (4.5\" finished leg). Small (¼ depth): 2.75\" corner squares (2.25\" leg). Choose based on desired visual effect." },
    { q: "How do I make a snowball and nine-patch quilt?", a: "Use same finished size for both blocks (e.g., 9\"). Nine-patch squares = block ÷ 3 (=3\" finished, 3.5\" cut). Snowball corners at ⅓ depth also use 3.5\" squares. Alternate blocks in checkerboard. The corner triangles frame the nine-patch grid perfectly." },
    { q: "What secondary pattern do snowball blocks make?", a: "When snowball blocks meet, corner triangles create secondary patterns: small corners → star points, ⅓ corners → diamonds, ½ corners → perfect circles, large corners → overlapping octagons. The circles at half-point depth are the most beloved effect." },
    { q: "How do I get perfect circles with snowball blocks?", a: "Make corner depth exactly ½ of block size. For 9\" block: corner squares = 5\" (4.5\" finished leg). When four blocks meet, the four half-point triangles create a perfect circle at the intersection. All blocks must be identical size." },
    { q: "What size corner squares make circles in a snowball quilt?", a: "Corner cut size = (finished block ÷ 2) + 0.5\". For 9\" block: 4.5\" + 0.5\" = 5\". For 12\" block: 6\" + 0.5\" = 6.5\". The corners from adjacent blocks combine to form circles at each 4-block intersection." },
    { q: "How do I save waste triangles from snowball blocks?", a: "When trimming corners, save both layers — they make HST units. Or: stitch a second line ¼\" from the first BEFORE cutting, creating a pre-sewn HST. From 30 blocks × 4 corners = 120 bonus HSTs. Use for scrappy pillows, small projects, or borders." },
    { q: "What is the difference between connector corners and snowball blocks?", a: "Same technique — stitch-and-flip. Snowball blocks use all 4 corners of a square. Connector corners use 1-2 corners of any rectangle or square as part of another block (like flying geese). The math is identical: corner cut = desired leg + 0.5\"." },
    { q: "How do I plan a snowball and nine-patch quilt?", a: "Choose block size divisible by 3 (e.g., 9\", 12\", 15\"). Calculate: nine-patch square = block ÷ 3 + 0.5\" (cut). Snowball corner = same cut size. Layout: alternate in checkerboard. Count each block type, calculate yardage separately for main squares, corners, and nine-patch colors." },
    { q: "Why won't my snowball corners meet when sewn together?", a: "Three possible causes: 1) Corner depth too shallow (needs to be exactly ½ block size for meeting). 2) Blocks are inconsistent sizes. 3) Seam allowances vary. Check: if corners should meet, corner cut size = block finished ÷ 2 + 0.5\"." },
];

export default function Page() {
    const [mode, setMode] = useState<"plan" | "ninepatch">("plan");
    const [blockSize, setBlockSize] = useState(9);
    const [depthIdx, setDepthIdx] = useState(2); // Standard (⅓)
    const [corners, setCorners] = useState(4);
    const [cols, setCols] = useState(5);
    const [rows, setRows] = useState(6);
    const [fabricW, setFabricW] = useState(42);
    const [showCutPlan, setShowCutPlan] = useState(false);
    const [showDepthTable, setShowDepthTable] = useState(false);
    const [showWaste, setShowWaste] = useState(false);
    const [showEdu, setShowEdu] = useState(false);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const cutMain = blockSize + SA;
    const depth = depthOptions[depthIdx];
    const legFin = blockSize * depth.frac;
    const cutCorner = legFin + SA;

    const calc = useMemo(() => {
        const totalBlocks = mode === "ninepatch" ? Math.ceil((cols * rows) / 2) : cols * rows;
        const npBlocks = mode === "ninepatch" ? Math.floor((cols * rows) / 2) : 0;

        // Main squares
        const mainPerWOF = Math.floor(fabricW / cutMain);
        const mainWOF = Math.ceil(totalBlocks / Math.max(mainPerWOF, 1));
        const mainYdIn = mainWOF * cutMain;
        const mainYd = mainYdIn / 36;
        const mainBuy = Math.ceil(mainYd * 4) / 4 + 0.25;

        // Corner squares
        const totalCorners = totalBlocks * corners;
        const cornerPerWOF = Math.floor(fabricW / cutCorner);
        const cornerWOF = Math.ceil(totalCorners / Math.max(cornerPerWOF, 1));
        const cornerYdIn = cornerWOF * cutCorner;
        const cornerYd = cornerYdIn / 36;
        const cornerBuy = Math.ceil(cornerYd * 4) / 4 + 0.25;

        // Nine-patch (Mode D)
        const npSquareSize = blockSize / 3;
        const npCutSq = npSquareSize + SA;
        const npColorA = npBlocks * 5;
        const npColorB = npBlocks * 4;
        const npAperWOF = Math.floor(fabricW / npCutSq);
        const npAWOF = Math.ceil(npColorA / Math.max(npAperWOF, 1));
        const npAYd = (npAWOF * npCutSq) / 36;
        const npABuy = Math.ceil(npAYd * 4) / 4 + 0.25;
        const npBWOF = Math.ceil(npColorB / Math.max(npAperWOF, 1));
        const npBYd = (npBWOF * npCutSq) / 36;
        const npBBuy = Math.ceil(npBYd * 4) / 4 + 0.25;

        // Quilt size
        const quiltW = cols * blockSize;
        const quiltH = rows * blockSize;

        // Waste HSTs
        const wasteTriangles = totalCorners;
        const wasteHSTs = Math.floor(wasteTriangles / 2);
        const wasteHSTfin = (cutCorner - SA) / Math.SQRT2;

        return {
            totalBlocks, npBlocks, mainPerWOF, mainWOF, mainYd, mainBuy,
            totalCorners, cornerPerWOF, cornerWOF, cornerYd, cornerBuy,
            npSquareSize, npCutSq, npColorA, npColorB, npABuy, npBBuy,
            quiltW, quiltH, wasteHSTs, wasteHSTfin,
        };
    }, [mode, cols, rows, corners, cutMain, cutCorner, blockSize, fabricW]);

    // Reference table
    const refData = useMemo(() => blockPresets.map(bs => ({
        bs,
        q: (bs / 4 + SA).toFixed(2), qF: toF(bs / 4 + SA),
        t: (bs / 3 + SA).toFixed(2), tF: toF(bs / 3 + SA),
        h: (bs / 2 + SA).toFixed(2), hF: toF(bs / 2 + SA),
    })), []);

    const tH = { padding: "5px 8px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left" as const, fontSize: 11, fontWeight: 600 as const };
    const tD = { padding: "4px 8px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11 };

    const copyText = `Snowball ${blockSize}": Main squares ${toF(cutMain)}, Corner squares ${toF(cutCorner)} (${depth.label}). ${calc.totalBlocks} blocks: main ${toFrac(calc.mainBuy)} yd, corners ${toFrac(calc.cornerBuy)} yd.`;

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "Snowball Calculator" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Hexagon size={14} strokeWidth={1.5} /> Quilt #150</span>
                        <h1>Snowball Block Calculator</h1>
                        <p>Calculate corner square sizes for snowball blocks, plan snowball &amp; nine-patch quilts, get complete cutting plans and yardage. Includes secondary pattern preview and waste triangle calculator.</p>
                    </div>

                    {/* MODE TOGGLE */}
                    <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                        <button className={`btn ${mode === "plan" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("plan")}>Snowball Planner</button>
                        <button className={`btn ${mode === "ninepatch" ? "btn-primary" : "btn-secondary"}`} onClick={() => setMode("ninepatch")}>Snowball + Nine-Patch</button>
                    </div>

                    {/* ① BLOCK SIZE */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>① Block Size</h2>
                        <div className="input-group" style={{ marginBottom: 8 }}>
                            <label className="input-label">Finished block size (inches)</label>
                            <input type="number" className="input-field" value={blockSize} onChange={e => setBlockSize(Math.max(2, parseFloat(e.target.value) || 9))} min={2} step={0.5} />
                            <div style={{ display: "flex", gap: 3, marginTop: 4, flexWrap: "wrap" }}>
                                {blockPresets.map(s => (
                                    <button key={s} className={`btn btn-sm ${blockSize === s ? "btn-primary" : "btn-ghost"}`} onClick={() => setBlockSize(s)} style={{ fontSize: 9, padding: "2px 5px" }}>{s}&quot;</button>
                                ))}
                            </div>
                        </div>
                        <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Cut main square: <strong>{toF(cutMain)}</strong> (finished {blockSize}&quot; + {toF(SA)} SA)</div>
                    </div>

                    {/* ② CORNER DEPTH */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>② Corner Depth</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                            {depthOptions.map((d, i) => (
                                <button key={i} className={`btn btn-sm ${depthIdx === i ? "btn-primary" : "btn-ghost"}`} onClick={() => setDepthIdx(i)}
                                    style={{ textAlign: "left", justifyContent: "flex-start", fontSize: 11, padding: "6px 10px" }}>
                                    <span style={{ width: 140, display: "inline-block", fontWeight: 600 }}>{d.label}</span>
                                    <span style={{ color: depthIdx === i ? "#fff" : "var(--color-text-tertiary)" }}>
                                        leg {toF(blockSize * d.frac)} → cut {toF(blockSize * d.frac + SA)} — {d.desc}
                                    </span>
                                </button>
                            ))}
                        </div>
                        {mode === "plan" && (
                            <div className="input-group" style={{ marginTop: 8 }}>
                                <label className="input-label">Corners per block</label>
                                <div style={{ display: "flex", gap: 4 }}>
                                    {[1, 2, 3, 4].map(n => (
                                        <button key={n} className={`btn btn-sm ${corners === n ? "btn-primary" : "btn-ghost"}`} onClick={() => setCorners(n)} style={{ fontSize: 10 }}>{n}</button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ③ LAYOUT */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>③ Layout &amp; Fabric</h2>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Columns</label>
                                <input type="number" className="input-field" value={cols} onChange={e => setCols(Math.max(1, parseInt(e.target.value) || 1))} min={1} /></div>
                            <div className="input-group"><label className="input-label">Rows</label>
                                <input type="number" className="input-field" value={rows} onChange={e => setRows(Math.max(1, parseInt(e.target.value) || 1))} min={1} /></div>
                        </div>
                        {mode === "ninepatch" && (
                            <div style={{ fontSize: 11, marginTop: 4, color: "var(--color-text-secondary)" }}>
                                Alternating: <strong>{calc.totalBlocks} snowball</strong> + <strong>{calc.npBlocks} nine-patch</strong> = {cols * rows} total
                            </div>
                        )}
                        <div className="input-group" style={{ marginTop: 8 }}>
                            <label className="input-label">Usable fabric width</label>
                            <input type="number" className="input-field" value={fabricW} onChange={e => setFabricW(Math.max(36, parseInt(e.target.value) || 42))} min={36} />
                        </div>
                    </div>

                    {/* ④ RESULTS */}
                    <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(200,50%,45%)" }}>
                        <h2 className={styles.calcTitle}>④ Snowball Block Sizes</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                            <div style={{ padding: 16, background: "hsl(200,15%,95%)", borderRadius: 10, textAlign: "center" }}>
                                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "hsl(200,40%,35%)" }}>Main Square</div>
                                <div style={{ fontSize: 30, fontWeight: 800, color: "hsl(200,50%,30%)", margin: "4px 0" }}>{toF(cutMain)}</div>
                                <div style={{ fontSize: 10 }}>{blockSize}&quot; finished</div>
                            </div>
                            <div style={{ padding: 16, background: "hsl(340,15%,95%)", borderRadius: 10, textAlign: "center" }}>
                                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "hsl(340,40%,35%)" }}>Corner Square</div>
                                <div style={{ fontSize: 30, fontWeight: 800, color: "hsl(340,50%,35%)", margin: "4px 0" }}>{toF(cutCorner)}</div>
                                <div style={{ fontSize: 10 }}>{depth.label} — {toF(legFin)} leg</div>
                            </div>
                        </div>

                        <div className={styles.resultDetails}>
                            <div className="result-row"><span>Snowball blocks</span><strong>{calc.totalBlocks} ({corners} corners each)</strong></div>
                            <div className="result-row"><span>Main squares</span><strong>{calc.totalBlocks} at {toF(cutMain)}</strong></div>
                            <div className="result-row"><span>Corner squares</span><strong>{calc.totalCorners} at {toF(cutCorner)}</strong></div>
                            <div className="result-row"><span>Quilt size (before borders)</span><strong>{calc.quiltW}&quot; × {calc.quiltH}&quot;</strong></div>
                        </div>

                        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                            <div style={{ padding: 10, background: "hsl(200,10%,96%)", borderRadius: 6, textAlign: "center" }}>
                                <div style={{ fontSize: 10, fontWeight: 600 }}>Main Fabric</div>
                                <div style={{ fontSize: 18, fontWeight: 800, color: "hsl(200,50%,35%)" }}>{toFrac(calc.mainBuy)} yd</div>
                            </div>
                            <div style={{ padding: 10, background: "hsl(340,10%,96%)", borderRadius: 6, textAlign: "center" }}>
                                <div style={{ fontSize: 10, fontWeight: 600 }}>Corner Fabric</div>
                                <div style={{ fontSize: 18, fontWeight: 800, color: "hsl(340,50%,40%)" }}>{toFrac(calc.cornerBuy)} yd</div>
                            </div>
                        </div>

                        {/* Nine-Patch section */}
                        {mode === "ninepatch" && (
                            <div style={{ marginTop: 12, padding: 12, background: "hsl(40,15%,96%)", borderRadius: 8 }}>
                                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Nine-Patch Blocks ({calc.npBlocks})</div>
                                <div className={styles.resultDetails}>
                                    <div className="result-row"><span>NP square size</span><strong>{toF(calc.npCutSq)} ({toF(calc.npSquareSize)} finished)</strong></div>
                                    <div className="result-row"><span>Color A (5/block)</span><strong>{calc.npColorA} squares → {toFrac(calc.npABuy)} yd</strong></div>
                                    <div className="result-row"><span>Color B (4/block)</span><strong>{calc.npColorB} squares → {toFrac(calc.npBBuy)} yd</strong></div>
                                </div>
                                <div style={{ fontSize: 11, marginTop: 6, padding: 6, background: "hsl(150,15%,95%)", borderRadius: 4 }}>
                                    ✓ NP square cut ({toF(calc.npCutSq)}) = Snowball corner cut ({toF(cutCorner)}) {Math.abs(calc.npCutSq - cutCorner) < 0.01 ? "— perfect match!" : `— different! (depth ≠ ⅓)`}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Toolbar */}
                    <div className="toolbar" style={{ marginBottom: 10 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} /> Copy</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                    </div>

                    {/* ═══ CUTTING PLAN ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowCutPlan(!showCutPlan)}>
                            ✂️ Complete Cutting Plan
                            <ChevronDown size={14} style={{ transform: showCutPlan ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showCutPlan && (
                            <div style={{ marginTop: 10, fontSize: 12, lineHeight: 2 }}>
                                <div style={{ padding: 10, background: "hsl(200,10%,97%)", borderRadius: 6, marginBottom: 6 }}>
                                    <strong>Step 1: Cut main squares</strong>
                                    <div>□ Cut <strong>{calc.mainWOF} WOF strips</strong> at {toF(cutMain)} wide</div>
                                    <div>□ Sub-cut <strong>{calc.mainPerWOF} squares</strong> per strip at {toF(cutMain)}</div>
                                    <div>□ Total: <strong>{calc.totalBlocks} squares</strong> at {toF(cutMain)} × {toF(cutMain)}</div>
                                </div>
                                <div style={{ padding: 10, background: "hsl(340,10%,97%)", borderRadius: 6, marginBottom: 6 }}>
                                    <strong>Step 2: Cut corner squares</strong>
                                    <div>□ Cut <strong>{calc.cornerWOF} WOF strips</strong> at {toF(cutCorner)} wide</div>
                                    <div>□ Sub-cut <strong>{calc.cornerPerWOF} squares</strong> per strip at {toF(cutCorner)}</div>
                                    <div>□ Total: <strong>{calc.totalCorners} corner squares</strong></div>
                                </div>
                                <div style={{ padding: 10, background: "hsl(0,0%,97%)", borderRadius: 6, marginBottom: 6 }}>
                                    <strong>Step 3: Stitch-and-flip corners</strong>
                                    <div>□ Draw diagonal on wrong side of ALL corner squares</div>
                                    <div>□ Place on main square corner, right sides together, edges aligned</div>
                                    <div>□ Stitch exactly ON the diagonal line</div>
                                    <div>□ Trim to ¼&quot; seam allowance</div>
                                    <div>□ Press corner back — repeat all {corners} corners per block</div>
                                </div>
                                {mode === "ninepatch" && (
                                    <div style={{ padding: 10, background: "hsl(40,10%,97%)", borderRadius: 6, marginBottom: 6 }}>
                                        <strong>Step 4: Cut nine-patch squares</strong>
                                        <div>□ Color A: cut {calc.npColorA} squares at {toF(calc.npCutSq)}</div>
                                        <div>□ Color B: cut {calc.npColorB} squares at {toF(calc.npCutSq)}</div>
                                        <div>□ Assembly: sew 3×3 grid (5A + 4B) per nine-patch block</div>
                                    </div>
                                )}
                                <div style={{ padding: 8, background: "hsl(0,0%,96%)", borderRadius: 6, fontSize: 11 }}>
                                    <strong>Assembly:</strong> {mode === "ninepatch" ? "Alternate snowball & nine-patch in checkerboard → " : ""}Sew blocks into rows → join rows → press seams → add borders
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ═══ DEPTH TABLE ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowDepthTable(!showDepthTable)}>
                            📊 Corner Size Reference Table
                            <ChevronDown size={14} style={{ transform: showDepthTable ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showDepthTable && (
                            <div style={{ marginTop: 10, overflowX: "auto" }}>
                                <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
                                    <thead><tr><th style={tH}>Block</th><th style={tH}>¼ Depth</th><th style={tH}>⅓ Depth</th><th style={tH}>½ Depth</th></tr></thead>
                                    <tbody>{refData.map(r => {
                                        const active = Math.abs(r.bs - blockSize) < 0.01;
                                        return (
                                            <tr key={r.bs} style={{ background: active ? "hsl(200,15%,93%)" : undefined, cursor: "pointer" }} onClick={() => setBlockSize(r.bs)}>
                                                <td style={{ ...tD, fontWeight: 600 }}>{r.bs}&quot;</td>
                                                <td style={tD}>{r.qF}</td>
                                                <td style={{ ...tD, fontWeight: r.bs === 9 ? 700 : 400 }}>{r.tF}{r.bs === 9 ? " ★" : ""}</td>
                                                <td style={tD}>{r.hF}</td>
                                            </tr>
                                        );
                                    })}</tbody>
                                </table>
                                <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 4 }}>★ 9&quot; block at ⅓ depth pairs perfectly with 3&quot; nine-patch squares (both cut at 3½&quot;). Click to select.</div>
                            </div>
                        )}
                    </div>

                    {/* ═══ WASTE TRIANGLES ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowWaste(!showWaste)}>
                            ♻️ Waste Triangle Calculator
                            <ChevronDown size={14} style={{ transform: showWaste ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showWaste && (
                            <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9 }}>
                                <div className={styles.resultDetails}>
                                    <div className="result-row"><span>Corner squares trimmed</span><strong>{calc.totalCorners}</strong></div>
                                    <div className="result-row"><span>Waste triangles (save both layers)</span><strong>{calc.totalCorners} pairs</strong></div>
                                    <div className="result-row"><span>Bonus HST units</span><strong>{calc.wasteHSTs}</strong></div>
                                    <div className="result-row"><span>Bonus HST finished size</span><strong>~{calc.wasteHSTfin.toFixed(1)}&quot;</strong></div>
                                </div>
                                <div style={{ marginTop: 6, fontSize: 11, color: "var(--color-text-tertiary)" }}>
                                    Tip: To save HSTs, stitch a second line ¼&quot; from the diagonal BEFORE cutting. Save both layers when trimming corners. Press and trim for bonus HST units.
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ═══ EDUCATIONAL ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowEdu(!showEdu)}>
                            📚 Understanding Snowball Blocks
                            <ChevronDown size={14} style={{ transform: showEdu ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showEdu && (
                            <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.9, color: "var(--color-text-secondary)" }}>
                                <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>Secondary Patterns — The Magic</h4>
                                <p style={{ fontSize: 12 }}>When snowball blocks meet, corner triangles create secondary patterns: small corners → star points, ⅓ corners → diamonds, ½ corners → perfect circles. The half-point circle is one of quilting&apos;s most beloved effects. Adjust corner depth to control the pattern.</p>

                                <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 10 }}>The Nine-Patch Connection</h4>
                                <p style={{ fontSize: 12 }}>A 9&quot; block has 3&quot; nine-patch squares (9÷3=3, cut 3½&quot;). Snowball corners at ⅓ depth also cut at 3½&quot;. Same cut size = efficient bulk cutting. The corner triangles frame the nine-patch grid perfectly, creating an interlocking visual. Use sizes divisible by 3 (9&quot;, 12&quot;, 15&quot;).</p>

                                <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 10 }}>Common Mistakes</h4>
                                <p style={{ fontSize: 12 }}>❌ Stitching ¼&quot; from the line (that&apos;s for HSTs, not snowball). ❌ Not pressing corners flat (causes lumps). ❌ Inconsistent diagonal direction. ✅ Stitch ON the line, trim to ¼&quot;, press firmly from right side.</p>
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
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Your Snowball</h4>
                        <div style={{ fontSize: 12, lineHeight: 2.2, color: "var(--color-text-secondary)" }}>
                            <div>Block: <strong>{blockSize}&quot;</strong> → cut {toF(cutMain)}</div>
                            <div>Corners: <strong>{toF(cutCorner)}</strong> ({depth.label})</div>
                            <div>Leg: <strong>{toF(legFin)}</strong> finished</div>
                            <div>Layout: <strong>{cols}×{rows}</strong></div>
                            <div>Snowball: <strong>{calc.totalBlocks}</strong></div>
                            {mode === "ninepatch" && <div>Nine-patch: <strong>{calc.npBlocks}</strong></div>}
                            <div>Main: <strong>{toFrac(calc.mainBuy)} yd</strong></div>
                            <div>Corners: <strong>{toFrac(calc.cornerBuy)} yd</strong></div>
                        </div>
                    </div>
                    <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Quick Formula</h4>
                        <div style={{ fontSize: 11, padding: 8, background: "hsl(0,0%,96%)", borderRadius: 6, fontFamily: "monospace", lineHeight: 2 }}>
                            Corner cut = leg + ½&quot;<br />
                            ⅓ depth: block ÷ 3 + ½&quot;<br />
                            ½ depth: block ÷ 2 + ½&quot;<br />
                            Stitch ON the line!
                        </div>
                    </div>
                    <div className="glass-card related-tools">
                        <h4>Related Tools</h4>
                        <a href="/quilt/nine-patch-calculator" className="related-tool-link">Nine-Patch Calculator</a>
                        <a href="/quilt/hst-calculator" className="related-tool-link">HST Calculator</a>
                        <a href="/quilt/size-calculator" className="related-tool-link">Quilt Size Calculator</a>
                        <a href="/quilt/blocks-needed" className="related-tool-link">Blocks Needed</a>
                        <a href="/quilt/backing-calculator" className="related-tool-link">Backing Calculator</a>
                        <a href="/quilt" className="related-tool-link">All Quilt Tools</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}