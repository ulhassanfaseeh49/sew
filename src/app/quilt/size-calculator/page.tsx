"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, ChevronDown, Ruler } from "lucide-react";

/* ─── STANDARD BED SIZES ─── */
const bedSizes: { name: string; w: number; h: number }[] = [
    { name: "Crib", w: 36, h: 52 },
    { name: "Baby Play Mat", w: 36, h: 36 },
    { name: "Throw / Lap", w: 50, h: 65 },
    { name: "Twin", w: 60, h: 80 },
    { name: "Full / Double", w: 72, h: 90 },
    { name: "Queen", w: 84, h: 92 },
    { name: "King", w: 100, h: 108 },
    { name: "California King", w: 104, h: 108 },
];

/* ─── LAYOUT PRESETS ─── */
const layoutPresets = [
    [3, 3], [4, 4], [4, 5], [4, 6], [5, 6], [5, 7], [6, 6], [6, 7], [6, 8], [7, 8], [7, 9], [8, 10],
];

/* ─── BLOCK SIZE PRESETS ─── */
const blockPresets = [3, 4, 4.5, 5, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 24];

/* ─── FAQ ─── */
const faqItems = [
    { q: "What is a finished quilt size vs unfinished?", a: "Finished size is the final measurement after all seams are sewn. Unfinished size includes seam allowances (typically ½\" larger per edge). A 12\" finished block is 12½\" unfinished. This calculator works with finished sizes — enter how big your block will be after sewing." },
    { q: "How does sashing affect quilt size?", a: "Sashing strips between blocks add to both width and height. For 5 blocks with 2\" sashing between (not outer edges): 4 sashing strips × 2\" = 8\" added to that dimension. With outer sashing, add 2 more strips. Cornerstones don't change size — they're the same width as sashing." },
    { q: "How many blocks for a queen-size quilt?", a: "A queen quilt is ~84\" × 92\". With 12\" blocks and no sashing: 7×8 = 56 blocks (84\"×96\" — close). With 2\" sashing: fewer blocks needed because sashing adds width. This calculator shows exact numbers for any combination." },
    { q: "What is a standard throw quilt size?", a: "A standard throw/lap quilt is approximately 50\" × 65\". This provides good coverage for sitting on a couch. Common layouts: 5×7 blocks at 9\" (45\"×63\" + borders) or 4×5 blocks at 12\" (48\"×60\" + borders)." },
    { q: "How do I calculate quilt size on point (diagonal)?", a: "For on-point layouts, the block diagonal = block size × 1.414. A 12\" on-point block occupies 16.97\" diagonally. You also need setting triangles (side) and corner triangles. The total width = (blocks across × diagonal) and you need half-blocks at edges." },
    { q: "Does the seam allowance affect the finished quilt size?", a: "Yes, indirectly. If your seam allowance is wider than ¼\", each block finishes smaller. For example, a 12½\" unfinished block with ⅜\" seams finishes at 11¾\" instead of 12\". Over many blocks, this compounds significantly. Test your seam allowance!" },
    { q: "How much should a quilt drop on the sides of a bed?", a: "For a bedspread look: 14\"–16\" drop (covers to bottom of mattress). For a coverlet: 9\"–12\" drop (partial coverage). For a duvet-style: 6\"–8\" drop. Add pillow tuck (10\"–12\") to the length if the quilt covers pillows." },
    { q: "What is the difference between sashing and borders?", a: "Sashing goes BETWEEN individual blocks, separating and framing each one. Borders go around the ENTIRE outer edge of the assembled quilt top. Sashing is optional and adds complexity; borders are very common and are the easiest way to adjust finished size." },
    { q: "Do cornerstones change the quilt size?", a: "No! Cornerstones are the small squares at sashing intersections. They are the same width as the sashing strips, so they don't add any extra size. They are purely decorative — they add visual interest where sashing strips cross." },
    { q: "How do I add borders to reach a specific size?", a: "Use our reverse calculator (Mode B): enter your target size, block size, and layout. The tool calculates how much border width you need. For manual calculation: border width = (target size − blocks-only size) ÷ 2. Each border goes on both sides." },
];

export default function Page() {
    /* ─── STATE ─── */
    const [mode, setMode] = useState<"A" | "B">("A");
    const [blockSize, setBlockSize] = useState(12);
    const [cols, setCols] = useState(5);
    const [rows, setRows] = useState(6);
    const [hasSashing, setHasSashing] = useState(false);
    const [sashW, setSashW] = useState(2);
    const [sashOuter, setSashOuter] = useState(false);
    const [hasCornerstones, setHasCornerstones] = useState(false);
    const [borderCount, setBorderCount] = useState(1);
    const [b1, setB1] = useState(4);
    const [b2, setB2] = useState(2);
    const [b3, setB3] = useState(0);
    // Mode B target
    const [targetW, setTargetW] = useState(84);
    const [targetH, setTargetH] = useState(92);
    const [showBreakdown, setShowBreakdown] = useState(true);
    const [showMattress, setShowMattress] = useState(false);
    const [showOnPoint, setShowOnPoint] = useState(false);
    const [showEdu, setShowEdu] = useState(false);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const borders = [b1, b2, b3].slice(0, borderCount);

    /* ─── MODE A: blocks → size ─── */
    const calcA = useMemo(() => {
        // Blocks only
        const blocksW = cols * blockSize;
        const blocksH = rows * blockSize;
        // Sashing
        let sashCountH = hasSashing ? (cols - 1) : 0; // vertical strips between columns
        let sashCountV = hasSashing ? (rows - 1) : 0; // horizontal strips between rows
        if (hasSashing && sashOuter) { sashCountH += 2; sashCountV += 2; }
        const sashAddW = sashCountH * sashW;
        const sashAddH = sashCountV * sashW;
        const afterSashW = blocksW + sashAddW;
        const afterSashH = blocksH + sashAddH;
        // Cornerstones count
        const csCount = hasSashing && hasCornerstones ? sashCountH * sashCountV : 0;
        // Borders
        let w = afterSashW, h = afterSashH;
        const borderSteps: { label: string; w: number; h: number }[] = [{ label: "After sashing", w, h }];
        borders.forEach((bw, i) => {
            if (bw > 0) { w += bw * 2; h += bw * 2; borderSteps.push({ label: `After border ${i + 1} (${bw}")`, w, h }); }
        });
        const totalBlocks = cols * rows;
        // Sashing strip counts
        const vSashStrips = hasSashing ? sashCountH * rows : 0;
        const hSashStrips = hasSashing ? sashCountV * cols : 0;
        return { blocksW, blocksH, afterSashW, afterSashH, finalW: w, finalH: h, totalBlocks, sashCountH, sashCountV, vSashStrips, hSashStrips, csCount, borderSteps };
    }, [cols, rows, blockSize, hasSashing, sashW, sashOuter, hasCornerstones, borders]);

    /* ─── MODE B: target → blocks ─── */
    const calcB = useMemo(() => {
        let innerW = targetW, innerH = targetH;
        borders.slice().reverse().forEach(bw => { if (bw > 0) { innerW -= bw * 2; innerH -= bw * 2; } });
        // Remove sashing
        // blocks*blockSize + sashCount*sashW = innerDim
        // sashCount = hasSashing ? (blocks-1)+2*sashOuter : 0
        // blocks*blockSize + (blocks-1+2*sashOuter)*sashW = innerDim  (if sashing)
        // blocks*(blockSize+sashW) - sashW + 2*sashOuter*sashW = innerDim
        // blocks = (innerDim + sashW - 2*sashOuter*sashW) / (blockSize + sashW)
        let neededCols: number, neededRows: number;
        if (hasSashing) {
            const eff = blockSize + sashW;
            const adjW = innerW + sashW - (sashOuter ? 2 * sashW : 0);
            const adjH = innerH + sashW - (sashOuter ? 2 * sashW : 0);
            neededCols = Math.max(1, Math.round(adjW / eff));
            neededRows = Math.max(1, Math.round(adjH / eff));
        } else {
            neededCols = Math.max(1, Math.round(innerW / blockSize));
            neededRows = Math.max(1, Math.round(innerH / blockSize));
        }
        // Recompute actual size
        const aW = neededCols * blockSize + (hasSashing ? ((neededCols - 1) + (sashOuter ? 2 : 0)) * sashW : 0);
        const aH = neededRows * blockSize + (hasSashing ? ((neededRows - 1) + (sashOuter ? 2 : 0)) * sashW : 0);
        let fW = aW, fH = aH;
        borders.forEach(bw => { if (bw > 0) { fW += bw * 2; fH += bw * 2; } });
        return { neededCols, neededRows, totalBlocks: neededCols * neededRows, actualW: fW, actualH: fH, diffW: fW - targetW, diffH: fH - targetH };
    }, [targetW, targetH, blockSize, hasSashing, sashW, sashOuter, borders]);

    const qW = mode === "A" ? calcA.finalW : calcB.actualW;
    const qH = mode === "A" ? calcA.finalH : calcB.actualH;

    // Bed comparison
    const bedCompare = bedSizes.map(b => {
        const dw = Math.abs(qW - b.w), dh = Math.abs(qH - b.h);
        const maxD = Math.max(dw, dh);
        const fit = maxD <= 4 ? "match" : maxD <= 10 ? "close" : "far";
        return { ...b, dw, dh, fit };
    });

    // On-point
    const onPoint = useMemo(() => {
        const diag = blockSize * Math.SQRT2;
        const c = mode === "A" ? cols : calcB.neededCols;
        const r = mode === "A" ? rows : calcB.neededRows;
        const opW = c * diag;
        const opH = r * diag;
        const settingSide = blockSize * Math.SQRT2 / 2 + 0.875;
        const settingCorner = blockSize / Math.SQRT2 + 0.875;
        return { diag, opW, opH, settingSide, settingCorner };
    }, [blockSize, cols, rows, mode, calcB]);

    const tH = { padding: "5px 8px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left" as const, fontSize: 11, fontWeight: 600 as const };
    const tD = { padding: "4px 8px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11 };

    const copyText = `Quilt Size: ${qW}" × ${qH}". ${mode === "A" ? `${cols}×${rows} blocks at ${blockSize}"` : `Need ${calcB.neededCols}×${calcB.neededRows} blocks`}${hasSashing ? ` + ${sashW}" sashing` : ""}${borders.filter(b => b > 0).length ? ` + borders (${borders.filter(b => b > 0).join("+")}")` : ""}.`;

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "Quilt Size Calculator" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Quilt #129</span>
                        <h1>Quilt Size Calculator</h1>
                        <p>Calculate your finished quilt dimensions from block size, layout, sashing, and borders. Compare to standard bed sizes instantly. The foundation tool for every quilt project.</p>
                    </div>

                    {/* ① MODE */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>① Calculator Mode</h2>
                        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                            <button className={`btn btn-sm ${mode === "A" ? "btn-primary" : "btn-ghost"}`} onClick={() => setMode("A")}>Block Count → Quilt Size</button>
                            <button className={`btn btn-sm ${mode === "B" ? "btn-primary" : "btn-ghost"}`} onClick={() => setMode("B")}>Target Size → Block Count</button>
                        </div>

                        {/* Block size */}
                        <div className="input-group" style={{ marginBottom: 8 }}>
                            <label className="input-label">Finished block size (inches)</label>
                            <input type="number" className="input-field" value={blockSize} onChange={e => setBlockSize(Math.max(1, parseFloat(e.target.value) || 12))} min={1} step={0.5} />
                            <div style={{ display: "flex", gap: 3, marginTop: 4, flexWrap: "wrap" }}>
                                {blockPresets.map(s => (
                                    <button key={s} className={`btn btn-sm ${blockSize === s ? "btn-primary" : "btn-ghost"}`} onClick={() => setBlockSize(s)} style={{ fontSize: 9, padding: "2px 5px" }}>{s}&quot;</button>
                                ))}
                            </div>
                        </div>

                        {mode === "A" ? (
                            <div className="calculator-form-row" style={{ marginTop: 8 }}>
                                <div className="input-group">
                                    <label className="input-label">Blocks across (columns)</label>
                                    <input type="number" className="input-field" value={cols} onChange={e => setCols(Math.max(1, parseInt(e.target.value) || 1))} min={1} />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Blocks down (rows)</label>
                                    <input type="number" className="input-field" value={rows} onChange={e => setRows(Math.max(1, parseInt(e.target.value) || 1))} min={1} />
                                </div>
                            </div>
                        ) : (
                            <div className="calculator-form-row" style={{ marginTop: 8 }}>
                                <div className="input-group">
                                    <label className="input-label">Target width (inches)</label>
                                    <input type="number" className="input-field" value={targetW} onChange={e => setTargetW(Math.max(10, parseInt(e.target.value) || 60))} min={10} />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Target height (inches)</label>
                                    <input type="number" className="input-field" value={targetH} onChange={e => setTargetH(Math.max(10, parseInt(e.target.value) || 80))} min={10} />
                                </div>
                            </div>
                        )}

                        {mode === "A" && (
                            <div style={{ display: "flex", gap: 3, marginTop: 6, flexWrap: "wrap" }}>
                                {layoutPresets.map(([c, r]) => (
                                    <button key={`${c}x${r}`} className={`btn btn-sm ${cols === c && rows === r ? "btn-primary" : "btn-ghost"}`} onClick={() => { setCols(c); setRows(r); }} style={{ fontSize: 9, padding: "2px 6px" }}>{c}×{r}</button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ② SASHING */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>② Sashing (Optional)</h2>
                        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                            <label style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                                <input type="checkbox" checked={hasSashing} onChange={e => setHasSashing(e.target.checked)} /> Enable sashing
                            </label>
                            {hasSashing && (
                                <label style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                                    <input type="checkbox" checked={sashOuter} onChange={e => setSashOuter(e.target.checked)} /> Include outer edges
                                </label>
                            )}
                            {hasSashing && (
                                <label style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                                    <input type="checkbox" checked={hasCornerstones} onChange={e => setHasCornerstones(e.target.checked)} /> Cornerstones
                                </label>
                            )}
                        </div>
                        {hasSashing && (
                            <div className="input-group">
                                <label className="input-label">Sashing width (finished, inches)</label>
                                <input type="number" className="input-field" value={sashW} onChange={e => setSashW(Math.max(0.5, parseFloat(e.target.value) || 2))} min={0.5} step={0.5} />
                                <div style={{ display: "flex", gap: 3, marginTop: 4, flexWrap: "wrap" }}>
                                    {[1, 1.5, 2, 2.5, 3, 3.5, 4].map(s => (
                                        <button key={s} className={`btn btn-sm ${sashW === s ? "btn-primary" : "btn-ghost"}`} onClick={() => setSashW(s)} style={{ fontSize: 9 }}>{s}&quot;</button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ③ BORDERS */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>③ Borders</h2>
                        <div className="input-group" style={{ marginBottom: 8 }}>
                            <label className="input-label">Number of borders</label>
                            <select className="input-field" value={borderCount} onChange={e => setBorderCount(parseInt(e.target.value))}>
                                {[0, 1, 2, 3].map(n => <option key={n} value={n}>{n === 0 ? "No borders" : `${n} border${n > 1 ? "s" : ""}`}</option>)}
                            </select>
                        </div>
                        {borderCount >= 1 && (
                            <div className="input-group" style={{ marginBottom: 6 }}>
                                <label className="input-label">Border 1 width (inches)</label>
                                <input type="number" className="input-field" value={b1} onChange={e => setB1(Math.max(0, parseFloat(e.target.value) || 0))} min={0} step={0.5} />
                            </div>
                        )}
                        {borderCount >= 2 && (
                            <div className="input-group" style={{ marginBottom: 6 }}>
                                <label className="input-label">Border 2 width (inches)</label>
                                <input type="number" className="input-field" value={b2} onChange={e => setB2(Math.max(0, parseFloat(e.target.value) || 0))} min={0} step={0.5} />
                            </div>
                        )}
                        {borderCount >= 3 && (
                            <div className="input-group">
                                <label className="input-label">Border 3 width (inches)</label>
                                <input type="number" className="input-field" value={b3} onChange={e => setB3(Math.max(0, parseFloat(e.target.value) || 0))} min={0} step={0.5} />
                            </div>
                        )}
                    </div>

                    {/* ④ RESULTS */}
                    <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(160,50%,45%)" }}>
                        <h2 className={styles.calcTitle}>④ Finished Quilt Size</h2>
                        <div className="result-card" style={{ textAlign: "center", padding: 20 }}>
                            <div className="result-value" style={{ fontSize: 36 }}>{qW}&quot; × {qH}&quot;</div>
                            <div className="result-label" style={{ fontSize: 13 }}>
                                {mode === "A"
                                    ? `${cols}×${rows} = ${calcA.totalBlocks} blocks at ${blockSize}"`
                                    : `Need ${calcB.neededCols}×${calcB.neededRows} = ${calcB.totalBlocks} blocks at ${blockSize}"`}
                            </div>
                            {mode === "B" && (Math.abs(calcB.diffW) > 0.01 || Math.abs(calcB.diffH) > 0.01) && (
                                <div style={{ fontSize: 11, marginTop: 4, color: "hsl(40,70%,40%)" }}>
                                    Actual vs target: {calcB.diffW > 0 ? "+" : ""}{calcB.diffW.toFixed(1)}&quot; wide, {calcB.diffH > 0 ? "+" : ""}{calcB.diffH.toFixed(1)}&quot; tall
                                </div>
                            )}
                        </div>

                        {/* Size breakdown */}
                        {mode === "A" && showBreakdown && (
                            <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9 }}>
                                <div className={styles.resultDetails}>
                                    <div className="result-row"><span>Blocks only ({cols}×{rows})</span><strong>{calcA.blocksW}&quot; × {calcA.blocksH}&quot;</strong></div>
                                    {hasSashing && <div className="result-row"><span>+ Sashing ({sashW}&quot;{sashOuter ? " + outer" : ""})</span><strong>{calcA.afterSashW}&quot; × {calcA.afterSashH}&quot;</strong></div>}
                                    {calcA.borderSteps.slice(1).map((step, i) => (
                                        <div key={i} className="result-row"><span>{step.label}</span><strong>{step.w}&quot; × {step.h}&quot;</strong></div>
                                    ))}
                                    <div className="result-row" style={{ borderTop: "2px solid hsl(0,0%,85%)" }}><span style={{ fontWeight: 700 }}>Final size</span><strong style={{ color: "hsl(160,50%,35%)" }}>{calcA.finalW}&quot; × {calcA.finalH}&quot;</strong></div>
                                </div>
                                {hasSashing && (
                                    <div style={{ marginTop: 6, fontSize: 11, color: "var(--color-text-tertiary)" }}>
                                        Sashing: {calcA.sashCountH} vertical + {calcA.sashCountV} horizontal strips
                                        {hasCornerstones && ` | ${calcA.csCount} cornerstones at ${sashW}" × ${sashW}"`}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Toolbar */}
                    <div className="toolbar" style={{ marginBottom: 10 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} /> Copy</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                    </div>

                    {/* ═══ BED SIZE COMPARISON ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Standard Size Comparison</h2>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
                                <thead><tr>
                                    <th style={tH}>Size</th><th style={tH}>Standard</th><th style={tH}>Your Quilt</th><th style={tH}>Difference</th><th style={tH}>Fit</th>
                                </tr></thead>
                                <tbody>{bedCompare.map(b => (
                                    <tr key={b.name} style={{ background: b.fit === "match" ? "hsl(150,25%,95%)" : b.fit === "close" ? "hsl(45,25%,95%)" : undefined }}>
                                        <td style={{ ...tD, fontWeight: 600 }}>{b.name}</td>
                                        <td style={tD}>{b.w}&quot;×{b.h}&quot;</td>
                                        <td style={tD}>{qW}&quot;×{qH}&quot;</td>
                                        <td style={tD}>{qW - b.w > 0 ? "+" : ""}{qW - b.w}&quot; / {qH - b.h > 0 ? "+" : ""}{qH - b.h}&quot;</td>
                                        <td style={tD}>
                                            <span style={{ padding: "1px 6px", borderRadius: 4, fontSize: 10, fontWeight: 600, color: "#fff", background: b.fit === "match" ? "hsl(150,50%,40%)" : b.fit === "close" ? "hsl(40,70%,50%)" : "hsl(0,40%,55%)" }}>
                                                {b.fit === "match" ? "✓ Match" : b.fit === "close" ? "~ Close" : "✗ Far"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}</tbody>
                            </table>
                        </div>
                        <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 4 }}>Match = within 4&quot;, Close = within 10&quot;</div>
                    </div>

                    {/* ═══ MATTRESS FIT ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowMattress(!showMattress)}>
                            🛏️ Mattress Fit Analysis
                            <ChevronDown size={14} style={{ transform: showMattress ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showMattress && (
                            <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9 }}>
                                {bedSizes.filter(b => b.name !== "Baby Play Mat").map(bed => {
                                    // Standard mattress dimensions (width × length)
                                    const mSizes: Record<string, [number, number]> = { "Crib": [28, 52], "Throw / Lap": [0, 0], "Twin": [39, 75], "Full / Double": [54, 75], "Queen": [60, 80], "King": [76, 80], "California King": [72, 84] };
                                    const [mw, mh] = mSizes[bed.name] || [0, 0];
                                    if (mw === 0) return null;
                                    const dropSide = (qW - mw) / 2;
                                    const dropFoot = qH - mh;
                                    return (
                                        <div key={bed.name} style={{ padding: 6, background: "hsl(0,0%,97%)", borderRadius: 4, marginBottom: 4, fontSize: 11 }}>
                                            <strong>{bed.name}</strong> (mattress {mw}&quot;×{mh}&quot;)
                                            <div>Side drop: <strong style={{ color: dropSide >= 14 ? "hsl(150,50%,35%)" : dropSide >= 9 ? "hsl(40,70%,40%)" : "hsl(0,50%,45%)" }}>{dropSide.toFixed(1)}&quot;</strong>
                                                {dropSide >= 14 ? " ✓ Full coverage" : dropSide >= 9 ? " ~ Coverlet" : dropSide > 0 ? " ✗ Short" : " ✗ Too narrow"}
                                            </div>
                                            <div>Foot drop: <strong>{dropFoot.toFixed(1)}&quot;</strong></div>
                                        </div>
                                    );
                                })}
                                <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 4 }}>Full coverage: 14–16&quot; drop. Coverlet: 9–12&quot;. Add 10–12&quot; to length for pillow tuck.</div>
                            </div>
                        )}
                    </div>

                    {/* ═══ ON-POINT ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowOnPoint(!showOnPoint)}>
                            ◇ On-Point / Diagonal Layout
                            <ChevronDown size={14} style={{ transform: showOnPoint ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showOnPoint && (
                            <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9 }}>
                                <div className={styles.resultDetails}>
                                    <div className="result-row"><span>Block diagonal</span><strong>{onPoint.diag.toFixed(2)}&quot; ({blockSize}&quot; × √2)</strong></div>
                                    <div className="result-row"><span>On-point quilt size (approx)</span><strong>{onPoint.opW.toFixed(1)}&quot; × {onPoint.opH.toFixed(1)}&quot;</strong></div>
                                    <div className="result-row"><span>Side setting triangle cut</span><strong>{onPoint.settingSide.toFixed(2)}&quot; squares, cut ×2 diag</strong></div>
                                    <div className="result-row"><span>Corner triangle cut</span><strong>{onPoint.settingCorner.toFixed(2)}&quot; squares, cut ×1 diag</strong></div>
                                </div>
                                <div style={{ marginTop: 6, fontSize: 11, color: "var(--color-text-tertiary)" }}>
                                    Side triangles: {(mode === "A" ? cols : calcB.neededCols) * 2 + (mode === "A" ? rows : calcB.neededRows) * 2 - 4} needed | Corner triangles: 4 needed
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ═══ EDUCATIONAL ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowEdu(!showEdu)}>
                            📚 Understanding Quilt Sizing
                            <ChevronDown size={14} style={{ transform: showEdu ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showEdu && (
                            <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.9, color: "var(--color-text-secondary)" }}>
                                <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>Finished vs Unfinished</h4>
                                <p style={{ fontSize: 12 }}>A &quot;finished&quot; measurement is after sewing — the size the block will be in your completed quilt. &quot;Unfinished&quot; includes seam allowances (add ½&quot; for standard ¼&quot; seams on each side). Always plan with finished sizes; the seam allowances take care of themselves.</p>
                                <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 10 }}>Why Quilts End Up the Wrong Size</h4>
                                <p style={{ fontSize: 12 }}>The #1 cause: inaccurate seam allowance. If your ¼&quot; seam is actually 5/16&quot;, each block loses ⅛&quot; per seam. Over 6 blocks: ¾&quot; shorter. Over a whole quilt: several inches too small. Test your seam allowance with a scrap strip before starting!</p>
                                <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 10 }}>How Sashing Works</h4>
                                <p style={{ fontSize: 12 }}>Sashing strips go between blocks. For N blocks in a row, there are (N−1) sashing strips between them. If you add outer sashing, that&apos;s 2 more strips per dimension. Cornerstones sit at sashing intersections — they&apos;re purely decorative and don&apos;t change the size.</p>
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
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Your Quilt</h4>
                        <div style={{ fontSize: 12, lineHeight: 2.2, color: "var(--color-text-secondary)" }}>
                            <div>Size: <strong>{qW}&quot; × {qH}&quot;</strong></div>
                            <div>Block: <strong>{blockSize}&quot;</strong></div>
                            <div>Layout: <strong>{mode === "A" ? `${cols}×${rows}` : `${calcB.neededCols}×${calcB.neededRows}`}</strong></div>
                            <div>Blocks: <strong>{mode === "A" ? calcA.totalBlocks : calcB.totalBlocks}</strong></div>
                            {hasSashing && <div>Sashing: <strong>{sashW}&quot;</strong></div>}
                            {borders.filter(b => b > 0).map((b, i) => <div key={i}>Border {i + 1}: <strong>{b}&quot;</strong></div>)}
                        </div>
                    </div>
                    <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Standard Sizes</h4>
                        <div style={{ fontSize: 11, lineHeight: 2, color: "var(--color-text-secondary)" }}>
                            {bedSizes.map(b => <div key={b.name}>{b.name}: <strong>{b.w}&quot;×{b.h}&quot;</strong></div>)}
                        </div>
                    </div>
                    <div className="glass-card related-tools">
                        <h4>Related Tools</h4>
                        <a href="/quilt/blocks-needed" className="related-tool-link">Blocks Needed</a>
                        <a href="/quilt/backing-calculator" className="related-tool-link">Backing Calculator</a>
                        <a href="/quilt/batting-calculator" className="related-tool-link">Batting Calculator</a>
                        <a href="/quilt/sashing-calculator" className="related-tool-link">Sashing Calculator</a>
                        <a href="/quilt/border-calculator" className="related-tool-link">Border Calculator</a>
                        <a href="/quilt/binding-calculator" className="related-tool-link">Binding Calculator</a>
                        <a href="/quilt/layout-planner" className="related-tool-link">Layout Planner</a>
                        <a href="/quilt" className="related-tool-link">All Quilt Tools</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}