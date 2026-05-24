"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, ChevronDown, Info, AlertTriangle, Hash } from "lucide-react";

/* ─── constants ────────────────────────────────────── */
const QUILT_SIZES = [
 { label: "Baby / Crib", w: 36, h: 52 },
 { label: "Baby Play Mat", w: 36, h: 36 },
 { label: "Stroller", w: 30, h: 40 },
 { label: "Toddler", w: 42, h: 52 },
 { label: "Throw / Lap", w: 50, h: 65 },
 { label: "Large Throw", w: 60, h: 72 },
 { label: "Twin", w: 60, h: 80 },
 { label: "Twin XL", w: 66, h: 90 },
 { label: "Full / Double", w: 72, h: 90 },
 { label: "Queen", w: 84, h: 92 },
 { label: "King", w: 100, h: 108 },
 { label: "Cal King", w: 104, h: 108 },
];
const BLOCK_PRESETS = [3, 4, 4.5, 5, 6, 7, 8, 9, 10, 12, 14, 15, 16, 18, 20, 24];
const SASH_PRESETS = [1, 1.5, 2, 2.5, 3, 3.5, 4];
const BORDER_PRESETS = [1, 1.5, 2, 2.5, 3, 4, 5, 6];

function toFrac(v: number): string {
 const w = Math.floor(v); const f = v - w;
 const fracs: [number, string][] = [[0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
 for (const [d, sym] of fracs) { if (Math.abs(f - d) < 0.02) return w >0 ? `${w}${sym}` : sym; }
 if (f >0.01) return v.toFixed(1);
 return String(w);
}

type Layout = "straight" | "onpoint";

interface LayoutOption {
 cols: number;
 rows: number;
 total: number;
 finW: number;
 finH: number;
 diffW: number;
 diffH: number;
 diffTotal: number;
}

/* ─── component ──────────────────────────────────── */
export default function Page() {
 /* target size */
 const [targetW, setTargetW] = useState("84");
 const [targetH, setTargetH] = useState("92");
 /* block */
 const [blockSize, setBlockSize] = useState("12");
 const [isUnfinished, setIsUnfinished] = useState(false);
 const [sa, setSa] = useState("0.25");
 /* layout */
 const [layout, setLayout] = useState<Layout>("straight");
 /* sashing */
 const [hasSashing, setHasSashing] = useState(false);
 const [sashW, setSashW] = useState("2");
 const [sashOuter, setSashOuter] = useState(false);
 /* borders */
 const [borderCount, setBorderCount] = useState(1);
 const [border1, setBorder1] = useState("4");
 const [border2, setBorder2] = useState("2");
 const [border3, setBorder3] = useState("1.5");
 /* already have */
 const [hasBlocks, setHasBlocks] = useState(false);
 const [blocksOnHand, setBlocksOnHand] = useState("0");
 /* tolerance */
 const [tolerance, setTolerance] = useState(4);
 /* UI */
 const [showEdu, setShowEdu] = useState(false);
 const [activeFaq, setActiveFaq] = useState<number | null>(null);

 /* derived */
 const tW = parseFloat(targetW) || 0;
 const tH = parseFloat(targetH) || 0;
 const seam = parseFloat(sa) || 0.25;
 const finBlock = isUnfinished ? (parseFloat(blockSize) || 0) - seam * 2 : (parseFloat(blockSize) || 0);
 const sash = hasSashing ? (parseFloat(sashW) || 0) : 0;
 const borders: number[] = [];
 if (borderCount >= 1) borders.push(parseFloat(border1) || 0);
 if (borderCount >= 2) borders.push(parseFloat(border2) || 0);
 if (borderCount >= 3) borders.push(parseFloat(border3) || 0);
 const totalBorder = borders.reduce((a, b) =>a + b, 0) * 2;
 const onHand = parseInt(blocksOnHand) || 0;

 // Available space for blocks+sashing (subtract borders)
 const availW = tW - totalBorder;
 const availH = tH - totalBorder;

 /* ═══ CORE CALCULATION ═══ */
 const options = useMemo(() =>{
 if (finBlock <= 0 || tW <= 0 || tH <= 0) return [];

 const results: LayoutOption[] = [];

 if (layout === "straight") {
 // unit = block + sashing (except outer edge depends on sashOuter)
 const unit = finBlock + sash;

 // Try a range of col×row combos around the target
 const minCols = Math.max(1, Math.floor((availW - (sashOuter ? sash : 0)) / unit) - 2);
 const maxCols = Math.ceil((availW + tolerance + (sashOuter ? sash : 0)) / unit) + 2;
 const minRows = Math.max(1, Math.floor((availH - (sashOuter ? sash : 0)) / unit) - 2);
 const maxRows = Math.ceil((availH + tolerance + (sashOuter ? sash : 0)) / unit) + 2;

 for (let c = minCols; c <= maxCols && c <= 30; c++) {
 for (let r = minRows; r <= maxRows && r <= 30; r++) {
 // Calculate achieved size
 let blockAreaW: number, blockAreaH: number;
 if (sash >0) {
 if (sashOuter) {
 // sash on all edges: (cols × block) + ((cols+1) × sash)
 blockAreaW = c * finBlock + (c + 1) * sash;
 blockAreaH = r * finBlock + (r + 1) * sash;
 } else {
 // sash between blocks only: (cols × block) + ((cols-1) × sash)
 blockAreaW = c * finBlock + (c - 1) * sash;
 blockAreaH = r * finBlock + (r - 1) * sash;
 }
 } else {
 blockAreaW = c * finBlock;
 blockAreaH = r * finBlock;
 }
 const finW = blockAreaW + totalBorder;
 const finH = blockAreaH + totalBorder;
 const diffW = finW - tW;
 const diffH = finH - tH;
 if (Math.abs(diffW) <= tolerance + 2 && Math.abs(diffH) <= tolerance + 2) {
 results.push({ cols: c, rows: r, total: c * r, finW, finH, diffW, diffH, diffTotal: Math.abs(diffW) + Math.abs(diffH) });
 }
 }
 }
 } else {
 // On-point: diagonal setting
 // For on-point, the effective diagonal of a block is block × √2
 const diagBlock = finBlock * Math.SQRT2;
 const unitDiag = diagBlock + (sash >0 ? sash * Math.SQRT2 : 0);

 const minCols = Math.max(1, Math.floor(availW / unitDiag) - 1);
 const maxCols = Math.ceil((availW + tolerance) / unitDiag) + 2;
 const minRows = Math.max(1, Math.floor(availH / unitDiag) - 1);
 const maxRows = Math.ceil((availH + tolerance) / unitDiag) + 2;

 for (let c = minCols; c <= maxCols && c <= 20; c++) {
 for (let r = minRows; r <= maxRows && r <= 20; r++) {
 const blockAreaW = c * diagBlock + (sash >0 ? (c - 1) * sash * Math.SQRT2 : 0);
 const blockAreaH = r * diagBlock + (sash >0 ? (r - 1) * sash * Math.SQRT2 : 0);
 const finW = blockAreaW + totalBorder;
 const finH = blockAreaH + totalBorder;
 const diffW = finW - tW;
 const diffH = finH - tH;
 if (Math.abs(diffW) <= tolerance + 4 && Math.abs(diffH) <= tolerance + 4) {
 results.push({ cols: c, rows: r, total: c * r, finW, finH, diffW, diffH, diffTotal: Math.abs(diffW) + Math.abs(diffH) });
 }
 }
 }
 }

 results.sort((a, b) =>a.diffTotal - b.diffTotal);
 return results.slice(0, 10);
 }, [finBlock, tW, tH, sash, sashOuter, totalBorder, layout, availW, availH, tolerance]);

 const best = options[0] || null;

 /* sashing piece count */
 const sashPieces = best && sash >0 ? {
 hStrips: best.cols * (best.rows - 1) + (sashOuter ? best.cols * 2 : 0),
 vStrips: best.rows * (best.cols - 1) + (sashOuter ? best.rows * 2 : 0),
 cornerstones: sashOuter ? (best.cols + 1) * (best.rows + 1) : (best.cols - 1) * (best.rows - 1),
 get total() { return this.hStrips + this.vStrips; },
 } : null;

 /* size gap analysis */
 const gapAnalysis = best && (Math.abs(best.diffW) >1 || Math.abs(best.diffH) >1) ? {
 canAdjustBorder: true,
 suggestedBorderW: borders.length >0 ? (borders[0] - best.diffW / 2) : 0,
 suggestedBorderH: borders.length >0 ? (borders[0] - best.diffH / 2) : 0,
 } : null;

 /* warnings */
 const warnings: string[] = [];
 if (finBlock >0 && tW >0 && finBlock >tW) warnings.push("Block size is larger than target quilt width.");
 if (finBlock >0 && tH >0 && finBlock >tH) warnings.push("Block size is larger than target quilt height.");
 if (tW >0 && tW < 12) warnings.push("Target width is very small — are you sure?");
 if (tH >0 && tH < 12) warnings.push("Target height is very small — are you sure?");
 if (sash >finBlock && finBlock >0) warnings.push("Sashing is wider than your block — this is unusual.");

 const copyText = best ? `Blocks needed: ${best.total} (${best.cols} across × ${best.rows} down). Finished size: ${toFrac(best.finW)}" × ${toFrac(best.finH)}". Block: ${toFrac(finBlock)}" finished.${hasSashing ? ` Sashing: ${toFrac(sash)}".` : ""}${totalBorder >0 ? ` Borders: ${toFrac(totalBorder / 2)}" each side.` : ""}` : "";

 /* quick ref */
 const quickRef = [
 { size: "Baby", w: 36, h: 52, b6: { c: 6, r: 9, t: 54 }, b10: { c: 4, r: 5, t: 20 }, b12: { c: 3, r: 4, t: 12 } },
 { size: "Throw", w: 50, h: 65, b6: { c: 8, r: 11, t: 88 }, b10: { c: 5, r: 7, t: 35 }, b12: { c: 4, r: 5, t: 20 } },
 { size: "Twin", w: 60, h: 80, b6: { c: 10, r: 13, t: 130 }, b10: { c: 6, r: 8, t: 48 }, b12: { c: 5, r: 7, t: 35 } },
 { size: "Queen", w: 84, h: 92, b6: { c: 14, r: 15, t: 210 }, b10: { c: 8, r: 9, t: 72 }, b12: { c: 7, r: 8, t: 56 } },
 { size: "King", w: 100, h: 108, b6: { c: 17, r: 18, t: 306 }, b10: { c: 10, r: 11, t: 110 }, b12: { c: 8, r: 9, t: 72 } },
 ];

 /* FAQ */
 const faqItems = [
 { q: "How many 12-inch blocks do I need for a queen-size quilt?", a: "For a standard queen (84×92\"), you need approximately 56 blocks (7 across × 8 down) without sashing or borders. With a 4\" border on each side, the block area is 76×84\", requiring about 42 blocks (6×7). The exact count depends on your sashing and border choices." },
 { q: "How many 6-inch blocks do I need for a throw quilt?", a: "For a standard throw (50×65\"), without borders you need approximately 88 blocks (8 across × 11 down = 48×66\"). With borders, fewer blocks are needed. Use this calculator with your exact border and sashing preferences for the precise count." },
 { q: "How do I resize a quilt pattern to a bigger size?", a: "Enter the new target size and your block size in this calculator. Compare the new block count with the original pattern's count to see how many more blocks you need. You may also need to adjust borders or add sashing to hit the exact size." },
 { q: "Can I add borders to make my quilt the right size?", a: "Yes! Borders are your best tool for fine-tuning quilt size. If your block layout is slightly smaller than your target, add or widen borders to bridge the gap. This calculator shows the size difference so you can adjust borders accordingly." },
 { q: "What if no block count gives me exactly the size I want?", a: "This is normal — quilt sizes are determined by multiples of block size. For example, with 12\" blocks you can only get widths of 12\", 24\", 36\", 48\", etc. Use borders and sashing to bridge the gap between achievable block area and your target size." },
 { q: "How does sashing affect how many blocks I need?", a: "Sashing adds width between blocks, so each block+sashing unit is larger. This means you need FEWER blocks to fill the same space. For example, 12\" blocks with 2\" sashing need only 6 blocks across for 82\" (vs 7 blocks for 84\" without sashing)." },
 { q: "How many quilt blocks for a king-size quilt?", a: "For a king (100×108\") with 12\" blocks and no sashing: 8 across × 9 down = 72 blocks. With 2\" sashing: 7×8 = 56 blocks. With 4\" borders: fewer blocks needed. The exact count depends on your design choices." },
 { q: "What layout is best for a lap quilt?", a: "Lap quilts (50×65\") work well with 10\" or 12\" blocks. A 5×6 layout of 12\" blocks gives 60×72\" — a generous lap size. Smaller blocks like 6\" give more design flexibility but require more piecing work." },
 { q: "How do I calculate blocks for an on-point quilt?", a: "On-point quilts rotate blocks 45°, so each block takes up more space diagonally. A 12\" block occupies about 17\" diagonally (12 × √2 ≈ 16.97\"). Select 'On-Point' layout in this calculator for automatic diagonal sizing." },
 { q: "What is the most common quilt block layout?", a: "The most common layout is 'straight set' — blocks arranged in a simple grid of rows and columns. For bed quilts, 5×6, 6×7, 7×8, and 8×9 are very popular block arrangements depending on block size and desired quilt size." },
 ];

 return (
 <div className="container">
 <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "Blocks Needed Calculator" }]} />
 <div className="calculator-layout">
 <div className="calculator-main">
 {/* HEADER */}
 <div className={styles.toolHeader}>
 <span className="category-badge"><Hash size={14} strokeWidth={1.5} />Quilt #130</span>
 <h1>Blocks Needed for Quilt Size Calculator</h1>
 <p>Enter your target quilt size and block size to find exactly how many blocks you need. Includes sashing, borders, multiple layout options, and standard bed size presets.</p>
 </div>

 {/* ① TARGET SIZE */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>① Target Quilt Size</h2>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
 {QUILT_SIZES.map(s =>(
 <button key={s.label} className={`btn btn-sm ${parseFloat(targetW) === s.w && parseFloat(targetH) === s.h ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>{ setTargetW(String(s.w)); setTargetH(String(s.h)); }}>{s.label}</button>
 ))}
 </div>
 <div className="calculator-form-row">
 <div className="input-group">
 <label className="input-label">Width (inches)</label>
 <input type="number" className="input-field" value={targetW} onChange={e =>setTargetW(e.target.value)} min={1} />
 </div>
 <div className="input-group">
 <label className="input-label">Height (inches)</label>
 <input type="number" className="input-field" value={targetH} onChange={e =>setTargetH(e.target.value)} min={1} />
 </div>
 </div>
 </div>

 {/* ② BLOCK SIZE */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>② Block Size</h2>
 <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
 <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
 <input type="checkbox" checked={isUnfinished} onChange={e =>setIsUnfinished(e.target.checked)} style={{ accentColor: "var(--color-accent-primary)" }} />Entering unfinished size
 </label>
 </div>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
 {BLOCK_PRESETS.map(b =>(
 <button key={b} className={`btn btn-sm ${parseFloat(blockSize) === b ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setBlockSize(String(b))}>{toFrac(b)}&quot;</button>
 ))}
 </div>
 <div className="input-group" style={{ maxWidth: 200 }}>
 <label className="input-label">{isUnfinished ? "Unfinished" : "Finished"} block size (inches)</label>
 <input type="number" className="input-field" value={blockSize} onChange={e =>setBlockSize(e.target.value)} min={1} max={36} step={0.25} />
 </div>
 {isUnfinished && <div style={{ fontSize: 12, color: "var(--color-accent-primary)", marginTop: 4 }}>Finished block: {toFrac(finBlock)}&quot; (after subtracting {toFrac(seam)}&quot; SA from each side)</div>}
 {isUnfinished && (
 <div className="input-group" style={{ maxWidth: 200, marginTop: 6 }}>
 <label className="input-label">Seam allowance</label>
 <select className="input-field" value={sa} onChange={e =>setSa(e.target.value)}>
 <option value="0.25">¼&quot; (standard)</option>
 <option value="0.375">⅜&quot;</option>
 <option value="0.5">½&quot;</option>
 </select>
 </div>
 )}
 </div>

 {/* ③ LAYOUT TYPE */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>③ Layout Type</h2>
 <div style={{ display: "flex", gap: 6 }}>
 <button className={`btn btn-sm ${layout === "straight" ? "btn-primary" : "btn-secondary"}`} onClick={() =>setLayout("straight")}>Straight Set (rows &amp; columns)
 </button>
 <button className={`btn btn-sm ${layout === "onpoint" ? "btn-primary" : "btn-secondary"}`} onClick={() =>setLayout("onpoint")}>On-Point / Diagonal
 </button>
 </div>
 {layout === "onpoint" && <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 6 }}><Info size={12} style={{ display: "inline", marginRight: 4 }} />Blocks rotated 45° — each block takes ~{toFrac(finBlock * Math.SQRT2)}&quot; diagonally. You&apos;ll also need setting triangles.</div>}
 </div>

 {/* ④ SASHING */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>④ Sashing</h2>
 <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
 <input type="checkbox" checked={hasSashing} onChange={e =>setHasSashing(e.target.checked)} style={{ accentColor: "var(--color-accent-primary)" }} />Include sashing between blocks
 </label>
 {hasSashing && (<>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
 {SASH_PRESETS.map(s =>(
 <button key={s} className={`btn btn-sm ${parseFloat(sashW) === s ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setSashW(String(s))}>{toFrac(s)}&quot;</button>
 ))}
 </div>
 <div className="input-group" style={{ maxWidth: 200, marginBottom: 8 }}>
 <label className="input-label">Sashing width (finished)</label>
 <input type="number" className="input-field" value={sashW} onChange={e =>setSashW(e.target.value)} min={0.5} max={8} step={0.25} />
 </div>
 <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
 <input type="checkbox" checked={sashOuter} onChange={e =>setSashOuter(e.target.checked)} style={{ accentColor: "var(--color-accent-primary)" }} />Sashing on outer edges too
 </label>
 </>)}
 </div>

 {/* ⑤ BORDERS */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>⑤ Borders</h2>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
 {[0, 1, 2, 3].map(n =>(
 <button key={n} className={`btn btn-sm ${borderCount === n ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setBorderCount(n)}>{n === 0 ? "No borders" : `${n} border${n >1 ? "s" : ""}`}</button>
 ))}
 </div>
 {borderCount >= 1 && (
 <div style={{ marginBottom: 8 }}>
 <label className="input-label">Border 1 width</label>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 4 }}>
 {BORDER_PRESETS.map(b =><button key={b} className={`btn btn-sm ${parseFloat(border1) === b ? "btn-primary" : "btn-secondary"}`} onClick={() =>setBorder1(String(b))}>{toFrac(b)}&quot;</button>)}
 </div>
 <div className="input-group" style={{ maxWidth: 150 }}><input type="number" className="input-field" value={border1} onChange={e =>setBorder1(e.target.value)} min={0.5} max={12} step={0.25} /></div>
 </div>
 )}
 {borderCount >= 2 && (
 <div style={{ marginBottom: 8 }}>
 <label className="input-label">Border 2 width</label>
 <div className="input-group" style={{ maxWidth: 150 }}><input type="number" className="input-field" value={border2} onChange={e =>setBorder2(e.target.value)} min={0.5} max={12} step={0.25} /></div>
 </div>
 )}
 {borderCount >= 3 && (
 <div style={{ marginBottom: 8 }}>
 <label className="input-label">Border 3 width</label>
 <div className="input-group" style={{ maxWidth: 150 }}><input type="number" className="input-field" value={border3} onChange={e =>setBorder3(e.target.value)} min={0.5} max={12} step={0.25} /></div>
 </div>
 )}
 {totalBorder >0 && (
 <div style={{ fontSize: 12, color: "hsl(35,80%,45%)", marginTop: 4 }}>
 <Info size={12} style={{ display: "inline", marginRight: 4 }} />Borders use {toFrac(totalBorder)}&quot; total ({toFrac(totalBorder / 2)}&quot; each side), leaving {toFrac(availW)}&quot; × {toFrac(availH)}&quot; for blocks{hasSashing ? " + sashing" : ""}.
 </div>
 )}
 </div>

 {/* ⑥ BLOCKS ON HAND */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>⑥ Blocks Already Made</h2>
 <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
 <input type="checkbox" checked={hasBlocks} onChange={e =>setHasBlocks(e.target.checked)} style={{ accentColor: "var(--color-accent-primary)" }} />I already have some blocks
 </label>
 {hasBlocks && (
 <div className="input-group" style={{ maxWidth: 200 }}>
 <label className="input-label">Blocks completed</label>
 <input type="number" className="input-field" value={blocksOnHand} onChange={e =>setBlocksOnHand(e.target.value)} min={0} />
 </div>
 )}
 </div>

 {/* ⑦ TOLERANCE */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>⑦ Size Flexibility</h2>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
 {[{ val: 1, label: "Exact (±1\")" }, { val: 2, label: "±2\"" }, { val: 4, label: "±4\" (default)" }, { val: 6, label: "±6\"" }].map(t =>(
 <button key={t.val} className={`btn btn-sm ${tolerance === t.val ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setTolerance(t.val)}>{t.label}</button>
 ))}
 </div>
 </div>

 {/* Warnings */}
 {warnings.length >0 && (
 <div style={{ marginBottom: 12 }}>
 {warnings.map((w, i) =>(
 <div key={i} style={{ fontSize: 12, color: "hsl(0,70%,50%)", marginTop: 4 }}>
 <AlertTriangle size={12} style={{ display: "inline", marginRight: 4 }} />{w}
 </div>
 ))}
 </div>
 )}

 {/* ═══ RESULTS ═══ */}
 {best && (<>
 <div className={`calculator-results ${styles.results}`}>
 {/* PRIMARY RESULT */}
 <div className="result-card">
 <div className="result-value">{best.total} blocks needed</div>
 <div className="result-label">{best.cols} across × {best.rows} down → {toFrac(best.finW)}&quot; × {toFrac(best.finH)}&quot; finished</div>
 </div>

 {/* Detailed breakdown */}
 <div className={styles.resultDetails}>
 <div className={styles.resultRow}><span>Target size</span><strong>{toFrac(tW)}&quot; × {toFrac(tH)}&quot;</strong></div>
 <div className={styles.resultRow}><span>Achieved size</span><strong>{toFrac(best.finW)}&quot; × {toFrac(best.finH)}&quot;</strong></div>
 <div className={styles.resultRow}>
 <span>Difference</span>
 <strong style={{ color: best.diffTotal <= 2 ? "hsl(140,60%,35%)" : best.diffTotal <= 8 ? "hsl(35,80%,45%)" : "hsl(0,70%,50%)" }}>
 {best.diffW >= 0 ? "+" : ""}{toFrac(best.diffW)}&quot; W, {best.diffH >= 0 ? "+" : ""}{toFrac(best.diffH)}&quot; H
 </strong>
 </div>
 <div className={styles.resultRow}><span>Block size (finished)</span><strong>{toFrac(finBlock)}&quot;</strong></div>
 <div className={styles.resultRow}><span>Layout</span><strong>{best.cols} columns × {best.rows} rows</strong></div>
 <div className={styles.resultRow}><span>Total blocks</span><strong>{best.total}</strong></div>
 {hasSashing && <div className={styles.resultRow}><span>Sashing width</span><strong>{toFrac(sash)}&quot;</strong></div>}
 {totalBorder >0 && <div className={styles.resultRow}><span>Total border width</span><strong>{toFrac(totalBorder / 2)}&quot; each side</strong></div>}
 {hasBlocks && onHand >0 && (
 <div className={styles.resultRow} style={{ borderTop: "2px solid var(--color-border)", paddingTop: 8, marginTop: 4 }}>
 <span style={{ fontWeight: 600 }}>Additional blocks to make</span>
 <strong style={{ color: best.total - onHand <= 0 ? "hsl(140,60%,35%)" : "var(--color-text-primary)" }}>
 {best.total - onHand <= 0 ? "None — you have enough! ✓" : `${best.total - onHand} more blocks`}
 </strong>
 </div>
 )}
 </div>

 {/* Sashing pieces */}
 {sashPieces && (
 <div style={{ background: "var(--color-bg-secondary)", borderRadius: "var(--radius-md)", padding: 14, marginTop: 10, fontSize: 13, lineHeight: 1.8 }}>
 <strong>Sashing Pieces Needed:</strong>
 <div style={{ fontFamily: "var(--font-mono, monospace)", marginTop: 4 }}>
 <div>Horizontal strips: {sashPieces.hStrips} pieces ({toFrac(finBlock)}&quot; × {toFrac(sash)}&quot;)</div>
 <div>Vertical strips: {sashPieces.vStrips} pieces ({toFrac(sash)}&quot; × {toFrac(finBlock)}&quot;)</div>
 <div>Total sashing pieces: {sashPieces.total}</div>
 <div>Cornerstones: {sashPieces.cornerstones} pieces ({toFrac(sash)}&quot; × {toFrac(sash)}&quot;)</div>
 </div>
 </div>
 )}

 {/* Size gap analysis */}
 {gapAnalysis && borders.length >0 && (
 <div style={{ background: "hsl(35,90%,95%)", borderRadius: "var(--radius-md)", padding: 14, marginTop: 10, fontSize: 13, lineHeight: 1.8 }}>
 <strong>Size Adjustment Tips:</strong>
 <div style={{ marginTop: 6 }}>Your layout is {best.diffW >= 0 ? toFrac(best.diffW) + "\" wider" : toFrac(Math.abs(best.diffW)) + "\" narrower"} and {best.diffH >= 0 ? toFrac(best.diffH) + "\" taller" : toFrac(Math.abs(best.diffH)) + "\" shorter"} than target.
 <ul style={{ paddingLeft: 18, marginTop: 4 }}>
 {Math.abs(best.diffW) >0 && <li>Adjust border width by {toFrac(Math.abs(best.diffW) / 2)}&quot; to match target width</li>}
 {Math.abs(best.diffH) >0 && <li>Adjust border height by {toFrac(Math.abs(best.diffH) / 2)}&quot; to match target height</li>}
 <li>Or accept the slight difference — it&apos;s within {toFrac(best.diffTotal)}&quot; total</li>
 </ul>
 </div>
 </div>
 )}
 </div>

 {/* Toolbar */}
 <div className="toolbar" style={{ marginBottom: 16 }}>
 <button className="btn btn-secondary btn-sm" onClick={() =>navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} />Copy</button>
 <button className="btn btn-secondary btn-sm" onClick={() =>window.print()}><Printer size={13} />Print</button>
 </div>

 {/* ALTERNATIVE LAYOUTS TABLE */}
 {options.length >1 && (
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Alternative Layout Options</h3>
 <div className={styles.tableWrap}>
 <table className={styles.convTable}>
 <thead><tr><th>#</th><th>Across</th><th>Down</th><th>Total</th><th>Finished Size</th><th>Diff from Target</th></tr></thead>
 <tbody>
 {options.map((o, i) =>(
 <tr key={i} style={i === 0 ? { background: "var(--color-accent-light)", fontWeight: 600 } : undefined}>
 <td>{i + 1}</td>
 <td>{o.cols}</td>
 <td>{o.rows}</td>
 <td style={{ fontWeight: 600 }}>{o.total}</td>
 <td>{toFrac(o.finW)}&quot; × {toFrac(o.finH)}&quot;</td>
 <td style={{ color: o.diffTotal <= 2 ? "hsl(140,60%,35%)" : o.diffTotal <= 8 ? "hsl(35,80%,45%)" : "hsl(0,70%,50%)" }}>
 {o.diffW >= 0 ? "+" : ""}{toFrac(o.diffW)}&quot; / {o.diffH >= 0 ? "+" : ""}{toFrac(o.diffH)}&quot;
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )}
 </>)}

 {/* QUICK REFERENCE */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Quick Reference — Blocks Needed (no sashing, no borders)</h3>
 <div className={styles.tableWrap}>
 <table className={styles.convTable}>
 <thead><tr><th>Quilt Size</th><th>6&quot; blocks</th><th>10&quot; blocks</th><th>12&quot; blocks</th></tr></thead>
 <tbody>
 {quickRef.map((q, i) =>(
 <tr key={i}>
 <td>{q.size} ({q.w}×{q.h}&quot;)</td>
 <td>{q.b6.c}×{q.b6.r} = {q.b6.t}</td>
 <td>{q.b10.c}×{q.b10.r} = {q.b10.t}</td>
 <td style={{ fontWeight: 600 }}>{q.b12.c}×{q.b12.r} = {q.b12.t}</td>
 </tr>
 ))}
 </tbody>
 </table>
 <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 6 }}>Block counts rounded up. Actual quilt may be slightly larger than the target size.</div>
 </div>
 </div>

 {/* EDUCATIONAL */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
 onClick={() =>setShowEdu(!showEdu)}>Why You Can&apos;t Always Hit an Exact Size <ChevronDown size={14} style={{ transform: showEdu ? "rotate(180deg)" : "none", transition: "0.2s" }} />
 </button>
 {showEdu && (
 <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
 <p>Quilt sizes are determined by <strong>multiples of block size</strong>. With 12&quot; blocks, your quilt top can only be 12&quot;, 24&quot;, 36&quot;, 48&quot;, 60&quot;, 72&quot;, 84&quot;, 96&quot;, etc. wide.</p>
 <p style={{ marginTop: 8 }}>If your target is 84&quot; wide: 84 ÷ 12 = 7 blocks across ✓ (exact fit!)</p>
 <p>If your target is 90&quot; wide: 90 ÷ 12 = 7.5 blocks — you can&apos;t cut half a block. You&apos;d need 7 blocks (84&quot;) or 8 blocks (96&quot;).</p>
 <h4 style={{ fontSize: 15, fontWeight: 600, marginTop: 12, color: "var(--color-text-primary)" }}>How to Bridge the Gap</h4>
 <ul style={{ paddingLeft: 20, marginTop: 6 }}>
 <li><strong>Borders:</strong>Add a 3&quot; border to each side of 84&quot; = 90&quot; ✓</li>
 <li><strong>Sashing:</strong>Adding 2&quot; sashing between 7 blocks = 7×12 + 6×2 = 96&quot;</li>
 <li><strong>Different block size:</strong>10&quot; blocks fit 90&quot; perfectly (9 blocks)</li>
 <li><strong>Accept the difference:</strong>A few inches won&apos;t matter on most quilts</li>
 </ul>
 <p style={{ marginTop: 8 }}><strong>Pro tip:</strong>Borders are your best &quot;adjustment tool&quot; — they can be any width, making them perfect for fine-tuning your quilt to hit an exact target size.</p>
 </div>
 )}
 </div>

 {/* FAQ */}
 <section className="faq-section">
 <h2>Frequently Asked Questions</h2>
 <div style={{ marginTop: "1.5rem" }}>
 {faqItems.map((f, i) =>(
 <div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}>
 <button className="faq-question" onClick={() =>setActiveFaq(activeFaq === i ? null : i)}>
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
 <div>Cols = Target W ÷ Block</div>
 <div>Rows = Target H ÷ Block</div>
 <div>Total = Cols × Rows</div>
 </div>
 </div>
 <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
 <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Popular Combos</h4>
 <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.8 }}>
 <div>Queen + 12&quot; blocks = <strong>56 blocks</strong></div>
 <div>Throw + 10&quot; blocks = <strong>35 blocks</strong></div>
 <div>Baby + 6&quot; blocks = <strong>54 blocks</strong></div>
 <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 4 }}>Without sashing or borders</div>
 </div>
 </div>
 <div className="glass-card related-tools">
 <h4>Related Tools</h4>
 <a href="/quilt/block-size-calculator" className="related-tool-link">Block Size Calculator</a>
 <a href="/quilt/quilt-size-calculator" className="related-tool-link">Quilt Size Calculator</a>
 <a href="/quilt/sashing-calculator" className="related-tool-link">Sashing Calculator</a>
 <a href="/quilt/backing-calculator" className="related-tool-link">Backing Calculator</a>
 <a href="/quilt" className="related-tool-link">All Quilt Tools</a>
 </div>
 </aside>
 </div>
 </div>
 );
}