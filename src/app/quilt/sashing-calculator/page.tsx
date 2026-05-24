"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, ChevronDown, LayoutGrid } from "lucide-react";

/* helpers */
function toFrac(v: number): string {
    if (v <= 0) return "0";
    const w = Math.floor(v);
    const f = v - w;
    const map: [number, string][] = [[0, ""], [0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
    let best = map[0], bd = 1;
    for (const [n, s] of map) { const d = Math.abs(f - n); if (d < bd) { bd = d; best = [n, s]; } }
    if (Math.abs(f - 1) < bd) return `${w + 1}`;
    if (!best[1]) return `${w || ""}`;
    return w > 0 ? `${w}${best[1]}` : `${best[1]}`;
}
function toF(v: number): string { return toFrac(v) + '"'; }

const WOF = 42;
const SA = 0.5; // total seam allowance (¼" each side)

const layoutPresets: [number, number][] = [[3, 3], [4, 4], [4, 5], [4, 6], [5, 6], [5, 7], [6, 6], [6, 7], [6, 8]];
const sashPresets = [1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6];

const faqItems = [
    { q: "How much sashing fabric do I need for a quilt?", a: "It depends on block size, block count, sashing width, and whether you use cornerstones. For 6×7 blocks at 12\" with 2\" sashing and cornerstones: ~1.25 yards for strips + ~0.28 yards for cornerstones = ~1.5 yards total. Our calculator gives exact amounts for any configuration." },
    { q: "How do I calculate quilt sashing yardage?", a: "Count total sashing strips × cut length to get total inches. Divide by WOF to get how many strips fit per fabric width. Multiply strip count by cut width. Divide by 36 for yards. Add cornerstone yardage separately if using different fabric." },
    { q: "What is the difference between sashing with and without cornerstones?", a: "Without cornerstones: long horizontal strips run the full quilt width. Simpler to cut and sew. With cornerstones: each sashing strip is cut to individual block width, and small squares go at each intersection. More design options but more pieces." },
    { q: "How does sashing affect quilt size?", a: "For N blocks with 'between only' sashing: adds (N-1) × sashing width per dimension. With outer sashing: adds (N+1) × sashing width. Example: 6 blocks at 12\" + 2\" sashing between = 72\" + 10\" = 82\" (5 strips × 2\")." },
    { q: "What is a cornerstone in a quilt?", a: "A cornerstone is a small square placed at each sashing intersection. It's the same width as the sashing strips, forming a decorative grid. Cornerstones can be the same fabric as sashing, an accent color, or scrappy. They don't change quilt size." },
    { q: "How wide should quilt sashing be?", a: "Common widths: 1\"–3\" for small/medium blocks, 2\"–4\" for large blocks. Rule of thumb: sashing should be ¼ to ⅓ of block size. 12\" blocks → 2\"–4\" sashing. Wider sashing makes blocks look more separated; narrower keeps them visually connected." },
    { q: "How many sashing strips do I need?", a: "Without cornerstones: horizontal strips = (rows-1), each the full quilt width. Vertical short strips = cols × (rows-1). With cornerstones: short strips = cols × (rows-1) + rows × (cols-1). Count carefully — the most common mistake is miscounting." },
    { q: "What is piano key sashing?", a: "Sashing strips made from small squares or rectangles of multiple fabrics sewn end-to-end. Creates a colorful striped effect. Each 'key' is typically 1.5\"–2.5\" finished. Total keys = keys per strip × total strips. Divide across fabrics for yardage." },
    { q: "How do I calculate sashing for an on-point quilt?", a: "On-point sashing follows the diagonal layout. Strip length = block size × √2 (the diagonal). Sashing is cut on the bias, requiring extra yardage (~30% more than straight-set). Setting triangles are needed at edges. This is advanced — consider our Setting Triangle Calculator." },
    { q: "Should sashing seams be pressed toward blocks or toward sashing?", a: "Traditional: press toward sashing — it frames each block visually and creates good nesting for row joins. Modern: press open to reduce bulk. For joining rows: alternate pressing directions so seams nest at intersections." },
    { q: "What is the difference between sashing and borders?", a: "Sashing goes BETWEEN individual blocks throughout the quilt interior. Borders go AROUND the entire outer edge. Sashing uses less fabric per inch of size increase but creates a different look. Many quilts use both: sashing inside + borders outside." },
    { q: "How do I use sashing to reach a specific quilt size?", a: "Use our reverse calculator: enter target size, block size, and layout. The tool calculates what sashing width achieves your target. Formula: sashing width = (target - blocks total) ÷ sashing count. Often a border adjustment is needed for exact fit." },
];

export default function Page() {
    const [blockSize, setBlockSize] = useState(12);
    const [cols, setCols] = useState(6);
    const [rows, setRows] = useState(7);
    const [sashW, setSashW] = useState(2);
    const [placement, setPlacement] = useState<"between" | "full">("between");
    const [hasCS, setHasCS] = useState(true);
    const [fabricW, setFabricW] = useState(42);
    const [showCutPlan, setShowCutPlan] = useState(false);
    const [showCompare, setShowCompare] = useState(false);
    const [showReverse, setShowReverse] = useState(false);
    const [showScrappy, setShowScrappy] = useState(false);
    const [showPiano, setShowPiano] = useState(false);
    const [showEdu, setShowEdu] = useState(false);
    const [scrappyFabs, setScrappyFabs] = useState(4);
    const [pianoKeySize, setPianoKeySize] = useState(2);
    const [pianoFabs, setPianoFabs] = useState(4);
    const [targetW, setTargetW] = useState(90);
    const [targetH, setTargetH] = useState(100);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const cutW = sashW + SA;
    const cutBlock = blockSize + SA;

    const calc = useMemo(() => {
        // Sashing strip counts
        const sashCols = placement === "between" ? (cols - 1) : (cols + 1);
        const sashRows = placement === "between" ? (rows - 1) : (rows + 1);

        // With cornerstones: short strips everywhere
        // Without cornerstones: long horizontal strips + short vertical strips
        let shortH = 0, shortV = 0, longStrips = 0, csCount = 0;
        if (hasCS) {
            // Horizontal short strips: sashCols per "sash-row"
            // Vertical short strips: sashRows per "sash-column" (but for grid it's simpler)
            // Actually: for a grid with cornerstones:
            // horizontal sashing strips = cols * sashRows (one between/beside each block per sash row)
            // vertical sashing strips = rows * sashCols (one between/beside each block per sash col)
            // Wait - let me think about this properly.
            // In a sashed quilt with cornerstones, each row of blocks gets sashCols short vertical strips next to them.
            // Between row pairs, there are horizontal short strips: cols short horizontal strips per sashing row.
            // So: short vertical strips (same height as block) = rows * sashCols
            // short horizontal strips (same width as block) = cols * sashRows
            // cornerstones = sashCols * sashRows
            shortV = rows * sashCols; // vertical strips next to blocks
            shortH = cols * sashRows; // horizontal strips between rows
            csCount = sashCols * sashRows;
        } else {
            // Long horizontal strips run full width, short vertical strips between blocks in each row
            shortV = (cols - 1) * rows; // vertical strips between blocks within each row
            longStrips = sashRows; // full-width horizontal strips between rows
            if (placement === "full") {
                shortV = (cols - 1) * rows; // vertical between blocks only (outer handled by long strips)
                longStrips = rows + 1; // horizontal: between + outer
                // Plus outer vertical strips
                shortV += rows * 2; // outer left + right for each row
            }
        }
        const totalShort = shortH + shortV;
        const shortCutLen = cutBlock; // short strip length = block size + SA
        const longCutLen = cols * blockSize + (cols - 1) * sashW + (placement === "full" ? 0 : 0); // full quilt width in blocks+sashing

        // Quilt size
        const quiltW = cols * blockSize + sashCols * sashW;
        const quiltH = rows * blockSize + sashRows * sashW;

        // Yardage for short strips
        const shortPerWOF = Math.floor(fabricW / shortCutLen);
        const shortWOFstrips = Math.ceil(totalShort / Math.max(shortPerWOF, 1));
        const shortYdInches = shortWOFstrips * cutW;

        // Yardage for long strips
        const longPerWOF = 1; // each long strip is one WOF cut or pieced
        const longYdInches = longStrips * cutW;

        // Yardage for cornerstones
        const csPerWOF = Math.floor(fabricW / cutW);
        const csWOFstrips = Math.ceil(csCount / Math.max(csPerWOF, 1));
        const csYdInches = csWOFstrips * cutW;

        const totalYdInches = shortYdInches + longYdInches + csYdInches;
        const totalYd = totalYdInches / 36;
        const buyYd = Math.ceil(totalYd * 4) / 4; // round to nearest ¼ yd
        const buyWithBuffer = buyYd + 0.25;

        return { sashCols, sashRows, shortH, shortV, totalShort, longStrips, csCount, quiltW, quiltH, shortPerWOF, shortWOFstrips, csPerWOF, csWOFstrips, totalYd, buyYd, buyWithBuffer, shortCutLen, longCutLen: quiltW + SA };
    }, [cols, rows, blockSize, sashW, placement, hasCS, fabricW, cutW, cutBlock, SA]);

    // Width comparison table
    const compareRows = useMemo(() => {
        return sashPresets.map(sw => {
            const sc = placement === "between" ? (cols - 1) : (cols + 1);
            const sr = placement === "between" ? (rows - 1) : (rows + 1);
            const qw = cols * blockSize + sc * sw;
            const qh = rows * blockSize + sr * sw;
            return { sw, qw, qh, active: Math.abs(sw - sashW) < 0.01 };
        });
    }, [cols, rows, blockSize, placement, sashW]);

    // Reverse calculator
    const reverse = useMemo(() => {
        const sc = placement === "between" ? (cols - 1) : (cols + 1);
        const sr = placement === "between" ? (rows - 1) : (rows + 1);
        const blocksOnlyW = cols * blockSize;
        const blocksOnlyH = rows * blockSize;
        const neededW = (targetW - blocksOnlyW) / sc;
        const neededH = (targetH - blocksOnlyH) / sr;
        const nearestW = Math.round(neededW * 4) / 4;
        const nearestH = Math.round(neededH * 4) / 4;
        const actualW = blocksOnlyW + sc * nearestW;
        const actualH = blocksOnlyH + sr * nearestH;
        return { neededW, neededH, nearestW, nearestH, actualW, actualH, blocksOnlyW, blocksOnlyH, sc, sr };
    }, [cols, rows, blockSize, placement, targetW, targetH]);

    const tH = { padding: "5px 8px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left" as const, fontSize: 11, fontWeight: 600 as const };
    const tD = { padding: "4px 8px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11 };
    const tR = { textAlign: "right" as const };

    const copyText = `Sashing: ${calc.totalShort} strips at ${toF(cutW)} × ${toF(calc.shortCutLen)}${calc.longStrips > 0 ? `, ${calc.longStrips} long strips` : ""}${hasCS ? `, ${calc.csCount} cornerstones at ${toF(cutW)} × ${toF(cutW)}` : ""}. Quilt: ${calc.quiltW}" × ${calc.quiltH}". Buy: ${toFrac(calc.buyWithBuffer)} yd.`;

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "Sashing Calculator" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><LayoutGrid size={14} strokeWidth={1.5} /> Quilt #142</span>
                        <h1>Sashing Width &amp; Yardage Calculator</h1>
                        <p>Calculate sashing strip counts, cutting dimensions, cornerstone counts, and total yardage for any quilt layout. Includes width comparison, reverse calculator, scrappy and piano key sashing.</p>
                    </div>

                    {/* ① BLOCK CONFIG */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>① Block &amp; Layout</h2>
                        <div className="input-group" style={{ marginBottom: 8 }}>
                            <label className="input-label">Finished block size (inches)</label>
                            <input type="number" className="input-field" value={blockSize} onChange={e => setBlockSize(Math.max(1, parseFloat(e.target.value) || 12))} min={1} step={0.5} />
                            <div style={{ display: "flex", gap: 3, marginTop: 4, flexWrap: "wrap" }}>
                                {[3, 4, 5, 6, 8, 9, 10, 12, 14, 16, 18].map(s => (
                                    <button key={s} className={`btn btn-sm ${blockSize === s ? "btn-primary" : "btn-ghost"}`} onClick={() => setBlockSize(s)} style={{ fontSize: 9, padding: "2px 5px" }}>{s}&quot;</button>
                                ))}
                            </div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Columns</label>
                                <input type="number" className="input-field" value={cols} onChange={e => setCols(Math.max(1, parseInt(e.target.value) || 1))} min={1} /></div>
                            <div className="input-group"><label className="input-label">Rows</label>
                                <input type="number" className="input-field" value={rows} onChange={e => setRows(Math.max(1, parseInt(e.target.value) || 1))} min={1} /></div>
                        </div>
                        <div style={{ display: "flex", gap: 3, marginTop: 4, flexWrap: "wrap" }}>
                            {layoutPresets.map(([c, r]) => (
                                <button key={`${c}x${r}`} className={`btn btn-sm ${cols === c && rows === r ? "btn-primary" : "btn-ghost"}`} onClick={() => { setCols(c); setRows(r); }} style={{ fontSize: 9 }}>{c}×{r}</button>
                            ))}
                        </div>
                        <div style={{ marginTop: 6, fontSize: 12, color: "var(--color-text-secondary)" }}>Total blocks: <strong>{cols * rows}</strong></div>
                    </div>

                    {/* ② SASHING */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>② Sashing Width &amp; Options</h2>
                        <div className="input-group" style={{ marginBottom: 8 }}>
                            <label className="input-label">Finished sashing width (inches)</label>
                            <input type="number" className="input-field" value={sashW} onChange={e => setSashW(Math.max(0.5, parseFloat(e.target.value) || 2))} min={0.5} step={0.5} />
                            <div style={{ display: "flex", gap: 3, marginTop: 4, flexWrap: "wrap" }}>
                                {sashPresets.map(s => (
                                    <button key={s} className={`btn btn-sm ${sashW === s ? "btn-primary" : "btn-ghost"}`} onClick={() => setSashW(s)} style={{ fontSize: 9 }}>{s}&quot;</button>
                                ))}
                            </div>
                            <div style={{ fontSize: 11, marginTop: 4, color: "var(--color-text-tertiary)" }}>Cut width: {toF(cutW)} (finished + {toF(SA)} seam allowance)</div>
                        </div>
                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                            <label style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                                <input type="radio" name="placement" checked={placement === "between"} onChange={() => setPlacement("between")} /> Between blocks only
                            </label>
                            <label style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                                <input type="radio" name="placement" checked={placement === "full"} onChange={() => setPlacement("full")} /> Between + outer edges
                            </label>
                        </div>
                        <label style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                            <input type="checkbox" checked={hasCS} onChange={e => setHasCS(e.target.checked)} /> Cornerstones
                        </label>
                        <div className="input-group" style={{ marginTop: 8 }}>
                            <label className="input-label">Usable fabric width</label>
                            <input type="number" className="input-field" value={fabricW} onChange={e => setFabricW(Math.max(36, parseInt(e.target.value) || 42))} min={36} />
                        </div>
                    </div>

                    {/* ③ RESULTS */}
                    <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(160,50%,45%)" }}>
                        <h2 className={styles.calcTitle}>③ Sashing Results</h2>
                        <div className="result-card" style={{ textAlign: "center", padding: 16 }}>
                            <div className="result-prefix">Finished Quilt Size</div>
                            <div className="result-value" style={{ fontSize: 32 }}>{calc.quiltW}&quot; × {calc.quiltH}&quot;</div>
                            <div className="result-label">{cols}×{rows} blocks at {blockSize}&quot; + {sashW}&quot; sashing ({placement === "full" ? "full" : "between"})</div>
                        </div>
                        <div className={styles.resultDetails} style={{ marginTop: 8 }}>
                            {hasCS ? (
                                <>
                                    <div className="result-row"><span>Short sashing strips</span><strong>{calc.totalShort} at {toF(cutW)} × {toF(calc.shortCutLen)}</strong></div>
                                    <div className="result-row"><span>Cornerstones</span><strong>{calc.csCount} at {toF(cutW)} × {toF(cutW)}</strong></div>
                                </>
                            ) : (
                                <>
                                    {calc.totalShort > 0 && <div className="result-row"><span>Short strips (vertical between blocks)</span><strong>{calc.totalShort} at {toF(cutW)} × {toF(calc.shortCutLen)}</strong></div>}
                                    {calc.longStrips > 0 && <div className="result-row"><span>Long strips (full width rows)</span><strong>{calc.longStrips} at {toF(cutW)} × {calc.longCutLen.toFixed(1)}&quot;</strong></div>}
                                </>
                            )}
                            <div className="result-row"><span>WOF strips to cut</span><strong>{calc.shortWOFstrips + (hasCS ? calc.csWOFstrips : calc.longStrips)} strips at {toF(cutW)}</strong></div>
                            <div className="result-row"><span>Short strips per WOF</span><strong>{calc.shortPerWOF}</strong></div>
                        </div>
                        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                            <div style={{ padding: 12, background: "hsl(160,12%,96%)", borderRadius: 8, textAlign: "center" }}>
                                <div style={{ fontSize: 10, fontWeight: 600 }}>Exact Yardage</div>
                                <div style={{ fontSize: 22, fontWeight: 800, color: "hsl(160,50%,40%)" }}>{calc.totalYd.toFixed(2)} yd</div>
                            </div>
                            <div style={{ padding: 12, background: "hsl(220,12%,96%)", borderRadius: 8, textAlign: "center" }}>
                                <div style={{ fontSize: 10, fontWeight: 600 }}>Buy (with buffer)</div>
                                <div style={{ fontSize: 22, fontWeight: 800, color: "hsl(220,50%,40%)" }}>{toFrac(calc.buyWithBuffer)} yd</div>
                            </div>
                        </div>
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
                                <div style={{ padding: 10, background: "hsl(160,10%,97%)", borderRadius: 6, marginBottom: 6 }}>
                                    <strong>Step 1: Cut WOF strips for sashing</strong>
                                    <div>□ Cut <strong>{calc.shortWOFstrips} strips</strong> at {toF(cutW)} wide × WOF</div>
                                </div>
                                <div style={{ padding: 10, background: "hsl(0,0%,97%)", borderRadius: 6, marginBottom: 6 }}>
                                    <strong>Step 2: Sub-cut sashing strips</strong>
                                    <div>□ From each WOF strip, cut <strong>{calc.shortPerWOF} pieces</strong> at {toF(calc.shortCutLen)} long</div>
                                    <div>□ Total: <strong>{calc.totalShort} short strips</strong> at {toF(cutW)} × {toF(calc.shortCutLen)}</div>
                                    {calc.shortPerWOF > 0 && <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>Leftover per strip: ~{(fabricW - calc.shortPerWOF * calc.shortCutLen).toFixed(1)}&quot;</div>}
                                </div>
                                {hasCS && (
                                    <>
                                        <div style={{ padding: 10, background: "hsl(280,10%,97%)", borderRadius: 6, marginBottom: 6 }}>
                                            <strong>Step 3: Cut WOF strips for cornerstones</strong>
                                            <div>□ Cut <strong>{calc.csWOFstrips} strips</strong> at {toF(cutW)} wide × WOF</div>
                                        </div>
                                        <div style={{ padding: 10, background: "hsl(40,10%,97%)", borderRadius: 6, marginBottom: 6 }}>
                                            <strong>Step 4: Sub-cut cornerstones</strong>
                                            <div>□ From each strip, cut <strong>{calc.csPerWOF} squares</strong> at {toF(cutW)} × {toF(cutW)}</div>
                                            <div>□ Total: <strong>{calc.csCount} cornerstones</strong> (cut {calc.csWOFstrips * calc.csPerWOF}, {calc.csWOFstrips * calc.csPerWOF - calc.csCount} spare)</div>
                                        </div>
                                    </>
                                )}
                                {!hasCS && calc.longStrips > 0 && (
                                    <div style={{ padding: 10, background: "hsl(280,10%,97%)", borderRadius: 6, marginBottom: 6 }}>
                                        <strong>Step 3: Cut long sashing strips</strong>
                                        <div>□ Cut <strong>{calc.longStrips} strips</strong> at {toF(cutW)} wide × WOF</div>
                                        <div style={{ fontSize: 11 }}>Piece together if quilt width exceeds WOF</div>
                                    </div>
                                )}
                                <div style={{ padding: 8, background: "hsl(0,0%,96%)", borderRadius: 6, fontSize: 11 }}>
                                    <strong>Assembly:</strong> Sew short sashing between blocks in each row → {hasCS ? "Build cornerstone sashing rows → " : ""}Join all rows with {hasCS ? "cornerstone rows" : "long horizontal strips"} → Press seams toward sashing
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ═══ WIDTH COMPARISON ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowCompare(!showCompare)}>
                            📊 Sashing Width Comparison
                            <ChevronDown size={14} style={{ transform: showCompare ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showCompare && (
                            <div style={{ marginTop: 10, overflowX: "auto" }}>
                                <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
                                    <thead><tr><th style={tH}>Sashing</th><th style={tH}>Quilt Width</th><th style={tH}>Quilt Height</th><th style={tH}></th></tr></thead>
                                    <tbody>
                                        <tr style={{ background: sashW === 0 ? "hsl(160,20%,93%)" : undefined }}>
                                            <td style={tD}>None</td><td style={tD}>{cols * blockSize}&quot;</td><td style={tD}>{rows * blockSize}&quot;</td><td style={tD}></td>
                                        </tr>
                                        {compareRows.map(cr => (
                                            <tr key={cr.sw} style={{ background: cr.active ? "hsl(160,20%,93%)" : undefined, cursor: "pointer" }} onClick={() => setSashW(cr.sw)}>
                                                <td style={{ ...tD, fontWeight: cr.active ? 700 : 400 }}>{toF(cr.sw)}{cr.active ? " ← your choice" : ""}</td>
                                                <td style={tD}>{cr.qw}&quot;</td>
                                                <td style={tD}>{cr.qh}&quot;</td>
                                                <td style={tD}>{cr.active ? "✓" : ""}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 4 }}>Click any row to select that sashing width.</div>
                            </div>
                        )}
                    </div>

                    {/* ═══ REVERSE CALC ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowReverse(!showReverse)}>
                            🎯 Target Size → Sashing Width
                            <ChevronDown size={14} style={{ transform: showReverse ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showReverse && (
                            <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9 }}>
                                <div className="calculator-form-row" style={{ marginBottom: 8 }}>
                                    <div className="input-group"><label className="input-label">Target width</label>
                                        <input type="number" className="input-field" value={targetW} onChange={e => setTargetW(Math.max(10, parseInt(e.target.value) || 90))} min={10} /></div>
                                    <div className="input-group"><label className="input-label">Target height</label>
                                        <input type="number" className="input-field" value={targetH} onChange={e => setTargetH(Math.max(10, parseInt(e.target.value) || 100))} min={10} /></div>
                                </div>
                                <div className={styles.resultDetails}>
                                    <div className="result-row"><span>Blocks only</span><strong>{reverse.blocksOnlyW}&quot; × {reverse.blocksOnlyH}&quot;</strong></div>
                                    <div className="result-row"><span>Width needs ({reverse.sc} sash cols)</span><strong>{reverse.neededW.toFixed(2)}&quot; → nearest {toF(reverse.nearestW)}</strong></div>
                                    <div className="result-row"><span>Height needs ({reverse.sr} sash rows)</span><strong>{reverse.neededH.toFixed(2)}&quot; → nearest {toF(reverse.nearestH)}</strong></div>
                                </div>
                                {Math.abs(reverse.nearestW - reverse.nearestH) > 0.01 && (
                                    <div style={{ marginTop: 6, padding: 6, background: "hsl(40,20%,96%)", borderRadius: 4, fontSize: 11 }}>
                                        ⚠️ Width and height need different sashing widths. Consider using {toF(Math.max(reverse.nearestW, reverse.nearestH))} throughout and adjusting with borders.
                                    </div>
                                )}
                                <div style={{ marginTop: 6, padding: 6, background: "hsl(160,15%,96%)", borderRadius: 4, fontSize: 11 }}>
                                    With {toF(reverse.nearestW)} sashing (width-matched): {reverse.actualW}&quot; × {(reverse.blocksOnlyH + reverse.sr * reverse.nearestW).toFixed(1)}&quot;
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ═══ SCRAPPY ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowScrappy(!showScrappy)}>
                            🎨 Scrappy Sashing Planner
                            <ChevronDown size={14} style={{ transform: showScrappy ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showScrappy && (
                            <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9 }}>
                                <div className="input-group" style={{ marginBottom: 8 }}>
                                    <label className="input-label">Number of fabrics</label>
                                    <input type="number" className="input-field" value={scrappyFabs} onChange={e => setScrappyFabs(Math.max(2, parseInt(e.target.value) || 2))} min={2} />
                                </div>
                                {(() => {
                                    const total = calc.totalShort;
                                    const perFab = Math.ceil(total / scrappyFabs);
                                    const stripsPerFabWOF = Math.ceil(perFab / calc.shortPerWOF);
                                    const ydPerFab = (stripsPerFabWOF * cutW) / 36;
                                    const buyPer = Math.ceil(ydPerFab * 4) / 4;
                                    return (
                                        <div className={styles.resultDetails}>
                                            <div className="result-row"><span>Total strips</span><strong>{total}</strong></div>
                                            <div className="result-row"><span>Strips per fabric</span><strong>{perFab}</strong></div>
                                            <div className="result-row"><span>WOF strips per fabric</span><strong>{stripsPerFabWOF} at {toF(cutW)}</strong></div>
                                            <div className="result-row"><span>Yardage per fabric</span><strong>{toFrac(buyPer)} yd</strong></div>
                                            <div className="result-row"><span>Total across {scrappyFabs} fabrics</span><strong>{toFrac(buyPer * scrappyFabs)} yd</strong></div>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}
                    </div>

                    {/* ═══ PIANO KEY ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowPiano(!showPiano)}>
                            🎹 Piano Key Sashing
                            <ChevronDown size={14} style={{ transform: showPiano ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showPiano && (
                            <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9 }}>
                                <div className="calculator-form-row" style={{ marginBottom: 8 }}>
                                    <div className="input-group"><label className="input-label">Key size (finished)</label>
                                        <input type="number" className="input-field" value={pianoKeySize} onChange={e => setPianoKeySize(Math.max(0.5, parseFloat(e.target.value) || 2))} min={0.5} step={0.5} /></div>
                                    <div className="input-group"><label className="input-label">Number of fabrics</label>
                                        <input type="number" className="input-field" value={pianoFabs} onChange={e => setPianoFabs(Math.max(2, parseInt(e.target.value) || 4))} min={2} /></div>
                                </div>
                                {(() => {
                                    const keysPerStrip = Math.floor(blockSize / pianoKeySize);
                                    const actualLen = keysPerStrip * pianoKeySize;
                                    const totalStrips = calc.totalShort;
                                    const totalKeys = keysPerStrip * totalStrips;
                                    const keysPerFab = Math.ceil(totalKeys / pianoFabs);
                                    const keyCut = pianoKeySize + SA;
                                    const keysPerWOF = Math.floor(fabricW / keyCut);
                                    const wofPerFab = Math.ceil(keysPerFab / keysPerWOF);
                                    const ydPerFab = (wofPerFab * keyCut) / 36;
                                    const buyPer = Math.ceil(ydPerFab * 4) / 4;
                                    return (
                                        <>
                                            <div className={styles.resultDetails}>
                                                <div className="result-row"><span>Keys per strip</span><strong>{keysPerStrip} ({toF(pianoKeySize)} keys in {toF(blockSize)} block)</strong></div>
                                                {Math.abs(actualLen - blockSize) > 0.01 && <div className="result-row" style={{ color: "hsl(40,70%,40%)" }}><span>⚠️ Keys don&apos;t divide evenly</span><strong>Actual: {toF(actualLen)} (adjust key size)</strong></div>}
                                                <div className="result-row"><span>Total sashing strips</span><strong>{totalStrips}</strong></div>
                                                <div className="result-row"><span>Total keys needed</span><strong>{totalKeys}</strong></div>
                                                <div className="result-row"><span>Keys per fabric</span><strong>{keysPerFab}</strong></div>
                                                <div className="result-row"><span>Key cut size</span><strong>{toF(keyCut)} × {toF(cutW)}</strong></div>
                                                <div className="result-row"><span>Yardage per fabric</span><strong>{toFrac(buyPer)} yd</strong></div>
                                                <div className="result-row"><span>Total across {pianoFabs} fabrics</span><strong>{toFrac(buyPer * pianoFabs)} yd</strong></div>
                                            </div>
                                            <div style={{ marginTop: 6, fontSize: 11, color: "var(--color-text-tertiary)" }}>
                                                Assembly: Sew {keysPerStrip} keys end-to-end per strip → press seams one direction → resulting strip: {toF(cutW)} × {toF(blockSize + SA)}
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        )}
                    </div>

                    {/* ═══ EDUCATIONAL ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowEdu(!showEdu)}>
                            📚 Understanding Sashing
                            <ChevronDown size={14} style={{ transform: showEdu ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showEdu && (
                            <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.9, color: "var(--color-text-secondary)" }}>
                                <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>Why Use Sashing?</h4>
                                <p style={{ fontSize: 12 }}>Sashing visually separates blocks to let each one shine. It makes quilts larger without more blocks, adds design interest, and hides small block size variations. Skip sashing when blocks create secondary patterns (log cabin, pinwheel quilts).</p>
                                <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 10 }}>Cornerstones vs No Cornerstones</h4>
                                <p style={{ fontSize: 12 }}>Without: long strips run the full quilt width — simpler, fewer pieces. With: individual block-width strips + squares at each intersection — more design options, can use accent color, but more pieces to cut and sew. Beginners: start without cornerstones.</p>
                                <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 10 }}>Pressing Sashing</h4>
                                <p style={{ fontSize: 12 }}>Traditional: press toward sashing (frames each block). Modern: press open (less bulk). For row joins: alternate pressing directions so seams nest at intersections. Handle cornerstone intersections carefully — 4 seam allowances meet.</p>
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
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Your Sashing</h4>
                        <div style={{ fontSize: 12, lineHeight: 2.2, color: "var(--color-text-secondary)" }}>
                            <div>Block: <strong>{blockSize}&quot;</strong></div>
                            <div>Layout: <strong>{cols}×{rows} ({cols * rows})</strong></div>
                            <div>Sashing: <strong>{sashW}&quot; fin → {toF(cutW)} cut</strong></div>
                            <div>Quilt: <strong>{calc.quiltW}&quot;×{calc.quiltH}&quot;</strong></div>
                            <div>Strips: <strong>{calc.totalShort}</strong></div>
                            {hasCS && <div>Cornerstones: <strong>{calc.csCount}</strong></div>}
                            <div>Buy: <strong>{toFrac(calc.buyWithBuffer)} yd</strong></div>
                        </div>
                    </div>
                    <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Cornerstone Formula</h4>
                        <div style={{ fontSize: 11, padding: 8, background: "hsl(0,0%,96%)", borderRadius: 6, fontFamily: "monospace", lineHeight: 2 }}>
                            Between only:<br />
                            CS = (cols−1)×(rows−1)<br />
                            Full sashing:<br />
                            CS = (cols+1)×(rows+1)<br />
                            Cut: sashW + ½&quot;
                        </div>
                    </div>
                    <div className="glass-card related-tools">
                        <h4>Related Tools</h4>
                        <a href="/quilt/size-calculator" className="related-tool-link">Quilt Size Calculator</a>
                        <a href="/quilt/border-calculator" className="related-tool-link">Border Calculator</a>
                        <a href="/quilt/blocks-needed" className="related-tool-link">Blocks Needed</a>
                        <a href="/quilt/backing-calculator" className="related-tool-link">Backing Calculator</a>
                        <a href="/quilt/binding-calculator" className="related-tool-link">Binding Calculator</a>
                        <a href="/quilt/layout-planner" className="related-tool-link">Layout Planner</a>
                        <a href="/quilt" className="related-tool-link">All Quilt Tools</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}