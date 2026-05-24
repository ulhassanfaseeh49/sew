"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Package, ChevronDown } from "lucide-react";

/* ─── helpers ──────────────────────────────────── */
function toFrac(v: number): string {
 const w = Math.floor(v);
 const r = v - w;
 const m: [number, string][] = [[0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
 for (const [t, s] of m) if (Math.abs(r - t) < 0.02) return w >0 ? `${w}${s}` : s;
 if (r < 0.05) return `${w}`;
 return v.toFixed(2);
}
const ceilQ = (v: number, q = 0.25) =>Math.ceil(v / q) * q;

/* ─── constants ──────────────────────────────────── */
const FQ_W = 17.5; // usable width
const FQ_H = 21; // usable height
const SA = 0.5; // seam allowance total (¼" each side)

const BUNDLE_PRESETS = [5, 6, 8, 10, 12, 15, 18, 20, 24, 30, 36, 40];

const BLOCK_SIZES = [3, 4, 5, 6, 7, 8, 9, 10, 12, 15];

const SQ_SIZES = [
 { sq: 2, cut: 2 }, { sq: 2.5, cut: 2.5 }, { sq: 3, cut: 3 },
 { sq: 3.5, cut: 3.5 }, { sq: 4, cut: 4 }, { sq: 4.5, cut: 4.5 },
 { sq: 5, cut: 5 }, { sq: 6, cut: 6 }, { sq: 7, cut: 7 },
 { sq: 8, cut: 8 }, { sq: 9, cut: 9 }, { sq: 10, cut: 10 },
 { sq: 12, cut: 12 },
];

/* ─── component ──────────────────────────────────── */
export default function Page() {
 const [fqCount, setFqCount] = useState(20);
 const [blockSize, setBlockSize] = useState(12);
 const [useBackground, setUseBackground] = useState(false);
 const [bgFabricWidth, setBgFabricWidth] = useState(44);
 const [activeFaq, setActiveFaq] = useState<number | null>(null);
 const [showRef, setShowRef] = useState(false);
 const [showSqRef, setShowSqRef] = useState(false);
 const [showComparison, setShowComparison] = useState(false);
 const [showBundleRef, setShowBundleRef] = useState(false);

 /* ─── core math ─── */
 const results = useMemo(() =>{
 const cutSize = blockSize + SA;
 const across = Math.floor(FQ_W / cutSize);
 const down = Math.floor(FQ_H / cutSize);
 const blocksPerFQ = across * down;
 const tooLarge = cutSize >FQ_W || cutSize >FQ_H;
 const totalBlocks = tooLarge ? 0 : blocksPerFQ * fqCount;

 // Best quilt layouts from total blocks (no background)
 const layouts: { cols: number; rows: number; blocks: number; w: number; h: number; name: string }[] = [];
 if (!tooLarge && totalBlocks >0) {
 for (let c = 2; c <= Math.min(20, totalBlocks); c++) {
 const r = Math.floor(totalBlocks / c);
 if (r >= 2 && c * r <= totalBlocks) {
 const w = c * blockSize;
 const h = r * blockSize;
 let name = "";
 if (w >= 36 && w <= 42 && h >= 42 && h <= 56) name = "Baby";
 else if (w >= 44 && w <= 54 && h >= 56 && h <= 66) name = "Throw";
 else if (w >= 54 && w <= 66 && h >= 66 && h <= 80) name = "Lap";
 else if (w >= 56 && w <= 68 && h >= 80 && h <= 96) name = "Twin";
 else if (w >= 72 && w <= 84 && h >= 84 && h <= 100) name = "Full/Queen";
 else if (w >= 90 && h >= 96) name = "King";
 if (name) layouts.push({ cols: c, rows: r, blocks: c * r, w, h, name });
 }
 }
 // Deduplicate by name, keep first
 const seen = new Set<string>();
 const deduped: typeof layouts = [];
 for (const l of layouts) {
 if (!seen.has(l.name)) { seen.add(l.name); deduped.push(l); }
 }
 layouts.length = 0;
 layouts.push(...deduped);
 }

 // If no named layouts, pick best general layout
 let bestLayout = layouts[0] || null;
 if (!bestLayout && totalBlocks >= 4) {
 const cols = Math.round(Math.sqrt(totalBlocks * 1.2)); // slightly wider
 const rows = Math.floor(totalBlocks / cols);
 if (cols >= 2 && rows >= 2) {
 bestLayout = { cols, rows, blocks: cols * rows, w: cols * blockSize, h: rows * blockSize, name: "Custom" };
 }
 }

 // Background alternate layout
 let bgLayout = null;
 if (useBackground && totalBlocks >0) {
 const totalWithBg = totalBlocks * 2;
 // Find best grid for doubled blocks
 for (let c = 2; c <= 20; c++) {
 const r = Math.floor(totalWithBg / c);
 if (r >= 2 && c * r <= totalWithBg) {
 const w = c * blockSize;
 const h = r * blockSize;
 let name = "";
 if (w >= 56 && w <= 68 && h >= 80 && h <= 100) name = "Twin";
 else if (w >= 72 && w <= 84 && h >= 84 && h <= 100) name = "Full/Queen";
 else if (w >= 90 && h >= 96) name = "King";
 else if (w >= 54 && w <= 66 && h >= 66 && h <= 80) name = "Lap";
 else if (w >= 44 && w <= 54 && h >= 56 && h <= 66) name = "Throw";
 if (name) { bgLayout = { cols: c, rows: r, blocks: c * r, w, h, name, bgBlocks: Math.floor((c * r) / 2) }; break; }
 }
 }
 if (!bgLayout && totalWithBg >= 4) {
 const c = Math.round(Math.sqrt(totalWithBg * 1.2));
 const r = Math.floor(totalWithBg / c);
 bgLayout = { cols: c, rows: r, blocks: c * r, w: c * blockSize, h: r * blockSize, name: "Custom", bgBlocks: Math.floor((c * r) / 2) };
 }
 }

 // Background yardage
 let bgYardage = 0, bgBuy = 0;
 if (bgLayout) {
 const usableW = bgFabricWidth - 1;
 const bgPerRow = Math.max(1, Math.floor(usableW / cutSize));
 const bgRows = Math.ceil(bgLayout.bgBlocks / bgPerRow);
 const bgInches = bgRows * cutSize;
 bgYardage = bgInches / 36;
 bgBuy = ceilQ(bgYardage + 0.05);
 }

 // Remnant from each FQ after cutting blocks
 const usedW = across * cutSize;
 const usedH = down * cutSize;
 const remnantStripA = { w: FQ_W - usedW, h: FQ_H }; // side strip
 const remnantStripB = { w: usedW, h: FQ_H - usedH }; // bottom strip

 return {
 cutSize, across, down, blocksPerFQ, tooLarge, totalBlocks,
 layouts, bestLayout, bgLayout, bgYardage, bgBuy,
 remnantStripA, remnantStripB,
 };
 }, [fqCount, blockSize, useBackground, bgFabricWidth]);

 /* ─── blocks-per-FQ reference ─── */
 const blockRefRows = useMemo(() =>{
 return BLOCK_SIZES.map(bs =>{
 const cs = bs + SA;
 const a = Math.floor(FQ_W / cs);
 const d = Math.floor(FQ_H / cs);
 const too = cs >FQ_W || cs >FQ_H;
 return { size: bs, cut: cs, across: a, down: d, per: too ? 0 : a * d, tooLarge: too };
 });
 }, []);

 /* ─── squares-per-FQ reference ─── */
 const sqRefRows = useMemo(() =>{
 return SQ_SIZES.map(s =>{
 const a = Math.floor(FQ_W / s.cut);
 const d = Math.floor(FQ_H / s.cut);
 return { size: s.sq, across: a, down: d, per: a * d };
 });
 }, []);

 /* SVG block layout within FQ */
 const fqLayoutSvg = useMemo(() =>{
 if (results.tooLarge) return null;
 const scale = 2.6;
 const w = FQ_W * scale, h = FQ_H * scale;
 const rects: JSX.Element[] = [];
 for (let r = 0; r < results.down; r++) {
 for (let c = 0; c < results.across; c++) {
 rects.push(
 <rect key={`${r}-${c}`}
 x={c * results.cutSize * scale + 1}
 y={r * results.cutSize * scale + 1}
 width={results.cutSize * scale - 2}
 height={results.cutSize * scale - 2}
 rx={2} fill="hsl(150,50%,80%)" stroke="hsl(150,50%,45%)" strokeWidth={1}
 />
 );
 }
 }
 // Remnant areas
 const usedW = results.across * results.cutSize * scale;
 const usedH = results.down * results.cutSize * scale;
 if (w - usedW >2) {
 rects.push(<rect key="ra" x={usedW} y={0} width={w - usedW} height={h} fill="hsl(40,40%,90%)" stroke="hsl(40,40%,70%)" strokeWidth={0.5} strokeDasharray="3,2" />);
 }
 if (h - usedH >2) {
 rects.push(<rect key="rb" x={0} y={usedH} width={usedW} height={h - usedH} fill="hsl(40,40%,90%)" stroke="hsl(40,40%,70%)" strokeWidth={0.5} strokeDasharray="3,2" />);
 }
 return (
 <svg viewBox={`0 0 ${w + 4} ${h + 16}`} style={{ width: "100%", maxWidth: w + 4 }}>
 <rect x={0} y={0} width={w} height={h} fill="none" stroke="hsl(0,0%,70%)" strokeWidth={1} />
 {rects}
 <text x={w / 2} y={h + 12} textAnchor="middle" fontSize={8} fill="hsl(0,0%,50%)">
 {toFrac(FQ_W)}&quot; × {FQ_H}&quot; fat quarter → {results.blocksPerFQ} blocks
 </text>
 </svg>
 );
 }, [results]);

 /* copy text */
 const copyText = `Fat Quarter Bundle: ${fqCount} FQs. Block size: ${blockSize}" finished. Blocks per FQ: ${results.blocksPerFQ}. Total blocks: ${results.totalBlocks}.${results.bestLayout ? ` Best layout: ${results.bestLayout.cols}×${results.bestLayout.rows} = ${results.bestLayout.w}"×${results.bestLayout.h}" ${results.bestLayout.name}.` : ""}${results.bgLayout ? ` With background: ${results.bgLayout.w}"×${results.bgLayout.h}" ${results.bgLayout.name}. Buy ${toFrac(results.bgBuy)} yd background.` : ""}`;

 /* FAQ */
 const faqItems = [
 { q: "What are the dimensions of a fat quarter?", a: `A fat quarter measures 18" × 22" (approximately 17.5" × 21" usable after trimming selvages). It is one-quarter yard of fabric cut "fat" — at half the yardage width and half the bolt width — rather than a regular quarter yard which is 9" × 44". Both have the same area (396 sq in) but the fat quarter is much more useful for cutting blocks.` },
 { q: "How many blocks can I cut from a fat quarter?", a: `It depends on block size. From one fat quarter (17.5" × 21" usable): 6" blocks = ${blockRefRows.find(r =>r.size === 6)?.per || 6}, 8" blocks = ${blockRefRows.find(r =>r.size === 8)?.per || 4}, 10" blocks = ${blockRefRows.find(r =>r.size === 10)?.per || 2}, 12" blocks = ${blockRefRows.find(r =>r.size === 12)?.per || 1}. With your current ${blockSize}" selection: ${results.blocksPerFQ} blocks per fat quarter.` },
 { q: "How many fat quarters do I need for a throw quilt?", a: "For a throw quilt (approximately 48\"×60\"): using 12\" blocks you need 20 fat quarters (4×5 layout = 20 blocks). Using 6\" blocks you need about 15 fat quarters (10×10 = 100 blocks, ~17 FQs). Adding alternating background blocks cuts the fat quarter count roughly in half." },
 { q: "What is the difference between a fat quarter and a quarter yard?", a: "Both contain the same area (396 sq in), but they're cut differently. A regular quarter yard is 9\" × 44\" — very narrow. A fat quarter is 18\" × 22\" — much wider. Fat quarters are far more useful for cutting blocks and squares because the wider shape accommodates larger pieces. Use fat quarters for blocks; use regular quarter yards only when you need long strips." },
 { q: "How many fat quarters for a queen-size quilt?", a: "For a queen quilt (approximately 84\"×96\"): using 12\" blocks with no background you need about 56 fat quarters (7×8 layout). Using 12\" blocks with alternating background, 42 fat quarters plus about 3.75 yards of background fabric makes an approximately 84\"×96\" queen." },
 { q: "How many 12-inch blocks from a fat quarter?", a: "Exactly 1 block. A 12\" finished block requires a 12.5\" cut square. From a 17.5\" × 21\" fat quarter, you get 1 across × 1 down = 1 block. This makes planning very simple: the number of fat quarters equals the number of blocks. The remaining fabric (an L-shaped piece) can yield 5\" charm squares." },
 { q: "What can I make with 20 fat quarters?", a: `With 20 fat quarters: (1) Twenty 12" blocks → 4×5 layout → 48"×60" throw quilt. (2) Eighty 8" blocks → 8×10 → 64"×80" twin quilt. (3) One hundred twenty 6" blocks → 10×12 → 60"×72" lap quilt. (4) With background fabric added: a twin or even full-size quilt.` },
 { q: "Can I cut charm squares from a fat quarter?", a: "Yes! From one fat quarter you can cut twelve 5\" charm squares (3 across × 4 down). From a 20 FQ bundle: 240 charm squares. These are equivalent to nearly 5 charm packs (42 squares each). Fat quarters are a great source for charm squares when you want specific fabric choices." },
 { q: "How many fat quarters in a bundle?", a: "Fat quarter bundles vary widely: 5-6 FQs (small accent bundle), 8-10 (small collection), 12-15 (popular mid-size), 18-20 (common medium), 24-30 (large), 36-40+ (full fabric collection). The most popular bundle sizes are 10, 12, and 20 fat quarters." },
 { q: "What is a fat quarter bundle in quilting?", a: "A fat quarter bundle is a pre-packaged collection of fat quarters from the same fabric line or designer. The fabrics are selected to coordinate with each other, making it easy to create a cohesive quilt without individually selecting fabrics. Bundles save time and guarantee coordinated colors and prints." },
 ];

 return (
 <div className="container">
 <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "Fat Quarter Bundle Calculator" }]} />
 <div className="calculator-layout">
 <div className="calculator-main">
 {/* HEADER */}
 <div className={styles.toolHeader}>
 <span className="category-badge"><Package size={14} strokeWidth={1.5} />Quilt #163</span>
 <h1>Fat Quarter Bundle Calculator</h1>
 <p>Calculate how many blocks you can cut from your fat quarter bundle, what size quilts you can make, background fabric needed, and plan complete projects. Works for any bundle size from 5 to 40+ fat quarters.</p>
 </div>

 {/* ① BUNDLE SIZE */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>① Your Fat Quarter Bundle</h2>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
 {BUNDLE_PRESETS.map(n =>(
 <button key={n} className={`btn btn-sm ${fqCount === n ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setFqCount(n)}>{n} FQs</button>
 ))}
 </div>
 <div className="calculator-form-row">
 <div className="input-group"><label className="input-label">Fat quarters in bundle</label>
 <input type="number" className="input-field" value={fqCount} onChange={e =>setFqCount(parseInt(e.target.value) || 1)} min={1} max={100} /></div>
 </div>
 <div style={{ marginTop: 8, padding: 10, background: "hsl(200,25%,96%)", borderRadius: 6, fontSize: 12, lineHeight: 1.7, color: "var(--color-text-secondary)" }}>
 <strong>Fat Quarter:</strong>18&quot; × 22&quot; (usable: {toFrac(FQ_W)}&quot; × {FQ_H}&quot;) • Area: 396 sq&quot; each<br />Total fabric: <strong>{fqCount} × 396 = {(fqCount * 396).toLocaleString()} sq&quot;</strong>({toFrac(fqCount * 0.25)} yards equivalent)
 </div>
 </div>

 {/* ② BLOCK SIZE */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>② Block Size</h2>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
 {BLOCK_SIZES.map(bs =>{
 const cs = bs + SA;
 const tl = cs >FQ_W || cs >FQ_H;
 const a = Math.floor(FQ_W / cs);
 const d = Math.floor(FQ_H / cs);
 const per = tl ? 0 : a * d;
 return (
 <button key={bs}
 className={`btn btn-sm ${blockSize === bs ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setBlockSize(bs)}
 style={{ opacity: tl ? 0.5 : 1 }}>
 {bs}&quot; <span style={{ fontSize: 9, opacity: 0.7 }}>({per}/FQ)</span>
 </button>
 );
 })}
 </div>
 <div className="calculator-form-row">
 <div className="input-group"><label className="input-label">Finished block size (inches)</label>
 <input type="number" className="input-field" value={blockSize} onChange={e =>setBlockSize(parseFloat(e.target.value) || 6)} min={2} max={17} step={0.5} /></div>
 </div>
 {results.tooLarge && (
 <div style={{ marginTop: 8, padding: 8, background: "hsl(0,40%,95%)", borderRadius: 6, fontSize: 12, color: "hsl(0,60%,45%)", fontWeight: 600 }}>
 ⚠ A {blockSize}&quot; finished block requires {toFrac(results.cutSize)}&quot; cuts — too large for a fat quarter ({toFrac(FQ_W)}&quot; × {FQ_H}&quot;). Maximum block size: 17&quot;.
 </div>
 )}
 </div>

 {/* ③ BACKGROUND */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>③ Background Fabric (Optional)</h2>
 <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13 }}>
 <input type="checkbox" checked={useBackground} onChange={e =>setUseBackground(e.target.checked)}
 style={{ width: 18, height: 18, accentColor: "hsl(150,60%,40%)" }} />Add background alternate blocks to double quilt size
 </label>
 {useBackground && (
 <div className="calculator-form-row" style={{ marginTop: 8 }}>
 <div className="input-group"><label className="input-label">Background fabric width</label>
 <select className="input-field" value={bgFabricWidth} onChange={e =>setBgFabricWidth(parseInt(e.target.value))}>
 <option value={42}>42&quot;</option><option value={44}>44&quot;</option><option value={60}>60&quot;</option>
 </select></div>
 </div>
 )}
 </div>

 {/* ═══ PRIMARY RESULT ═══ */}
 {!results.tooLarge && (
 <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(150,60%,40%)" }}>
 <h2 className={styles.calcTitle}>What You Can Make</h2>

 {/* Block layout in FQ visual */}
 <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 12 }}>
 <div style={{ textAlign: "center" }}>
 <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: "var(--color-text-secondary)" }}>Block Layout per FQ</div>
 {fqLayoutSvg}
 </div>
 <div style={{ flex: 1, minWidth: 200 }}>
 <div className="result-card" style={{ marginBottom: 8 }}>
 <div className="result-value">{results.blocksPerFQ} block{results.blocksPerFQ !== 1 ? "s" : ""} per FQ</div>
 <div className="result-label">{blockSize}&quot; blocks ({results.across}×{results.down} from {toFrac(FQ_W)}&quot;×{FQ_H}&quot;)</div>
 </div>
 <div className="result-card">
 <div className="result-value">{results.totalBlocks} total blocks</div>
 <div className="result-label">from {fqCount} fat quarters</div>
 </div>
 </div>
 </div>

 {/* Layout options */}
 {results.bestLayout && (
 <div style={{ padding: 12, background: "hsl(150,30%,96%)", borderRadius: 6, marginBottom: 8 }}>
 <div style={{ fontSize: 13, fontWeight: 700, color: "hsl(150,60%,30%)", marginBottom: 4 }}>
 ✓ Best Layout (FQ blocks only)
 </div>
 <div style={{ fontSize: 14, fontWeight: 600 }}>
 {results.bestLayout.cols} × {results.bestLayout.rows} = {results.bestLayout.blocks} blocks → {results.bestLayout.w}&quot; × {results.bestLayout.h}&quot; {results.bestLayout.name}
 </div>
 {results.totalBlocks >results.bestLayout.blocks && (
 <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 2 }}>
 ({results.totalBlocks - results.bestLayout.blocks} blocks remaining — use for bonus project)
 </div>
 )}
 </div>
 )}

 {results.layouts.length >1 && (
 <div style={{ marginBottom: 8 }}>
 <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, color: "var(--color-text-secondary)" }}>Other Layout Options</div>
 {results.layouts.slice(1, 4).map((l, i) =>(
 <div key={i} style={{ fontSize: 12, padding: "4px 0", borderBottom: "1px solid hsl(0,0%,92%)" }}>
 {l.cols}×{l.rows} = {l.blocks} blocks → {l.w}&quot;×{l.h}&quot; <strong>{l.name}</strong>
 </div>
 ))}
 </div>
 )}

 {/* With background */}
 {useBackground && results.bgLayout && (
 <div style={{ padding: 12, background: "hsl(200,25%,96%)", borderRadius: 6, marginTop: 8 }}>
 <div style={{ fontSize: 13, fontWeight: 700, color: "hsl(200,60%,35%)", marginBottom: 4 }}>With Background Alternates
 </div>
 <div style={{ fontSize: 14, fontWeight: 600 }}>
 {results.bgLayout.cols} × {results.bgLayout.rows} = {results.bgLayout.blocks} blocks → {results.bgLayout.w}&quot; × {results.bgLayout.h}&quot; {results.bgLayout.name}
 </div>
 <div style={{ fontSize: 12, marginTop: 4, lineHeight: 1.7 }}>
 <div>FQ blocks: {results.totalBlocks} • Background blocks: {results.bgLayout.bgBlocks}</div>
 <div style={{ fontWeight: 600, color: "hsl(150,60%,35%)" }}>Background fabric: buy {toFrac(results.bgBuy)} yd ({toFrac(results.bgYardage)} yd needed)</div>
 </div>
 </div>
 )}

 {/* Remnants info */}
 <div style={{ marginTop: 10, padding: 10, background: "hsl(45,30%,96%)", borderRadius: 6 }}>
 <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, color: "hsl(45,50%,35%)" }}>Remnants per FQ After Cutting</div>
 <div style={{ fontSize: 12, lineHeight: 1.7, color: "var(--color-text-secondary)" }}>
 {results.remnantStripA.w >0.5 && <div>Side strip: {toFrac(results.remnantStripA.w)}&quot; × {FQ_H}&quot; — cut into {Math.floor(results.remnantStripA.w)} strips or squares</div>}
 {results.remnantStripB.h >0.5 && <div>Bottom strip: {toFrac(results.remnantStripB.w)}&quot; × {toFrac(results.remnantStripB.h)}&quot; — cut into smaller pieces</div>}
 <div style={{ fontSize: 11, marginTop: 3, color: "var(--color-text-tertiary)" }}>Total from {fqCount} FQs: {results.remnantStripA.w >0.5 ? `${fqCount} side strips` : ""}{results.remnantStripA.w >0.5 && results.remnantStripB.h >0.5 ? " + " : ""}{results.remnantStripB.h >0.5 ? `${fqCount} bottom strips` : ""} — save for a bonus project!
 </div>
 </div>
 </div>
 </div>
 )}

 {/* Toolbar */}
 <div className="toolbar" style={{ marginBottom: 16 }}>
 <button className="btn btn-secondary btn-sm" onClick={() =>navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} />Copy</button>
 <button className="btn btn-secondary btn-sm" onClick={() =>window.print()}><Printer size={13} />Print</button>
 </div>

 {/* ═══ BLOCKS PER FQ REFERENCE ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
 onClick={() =>setShowRef(!showRef)}>Blocks per Fat Quarter Reference
 <ChevronDown size={14} style={{ transform: showRef ? "rotate(180deg)" : "none", transition: "0.2s" }} />
 </button>
 {showRef && (
 <div style={{ marginTop: 10, overflowX: "auto" }}>
 <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
 <thead><tr style={{ borderBottom: "2px solid hsl(0,0%,85%)" }}>
 <th style={{ textAlign: "left", padding: "6px 6px" }}>Finished</th>
 <th style={{ textAlign: "right", padding: "6px 6px" }}>Cut</th>
 <th style={{ textAlign: "right", padding: "6px 6px" }}>Across</th>
 <th style={{ textAlign: "right", padding: "6px 6px" }}>Down</th>
 <th style={{ textAlign: "right", padding: "6px 6px" }}>Per FQ</th>
 <th style={{ textAlign: "right", padding: "6px 6px" }}>Total ({fqCount})</th>
 </tr></thead>
 <tbody>
 {blockRefRows.map(r =>(
 <tr key={r.size} style={{ background: r.size === blockSize ? "hsl(150,40%,95%)" : undefined, borderBottom: "1px solid hsl(0,0%,92%)" }}>
 <td style={{ padding: "5px 6px", fontWeight: r.size === blockSize ? 700 : 400 }}>{r.size}&quot;</td>
 <td style={{ textAlign: "right", padding: "5px 6px" }}>{toFrac(r.cut)}&quot;</td>
 <td style={{ textAlign: "right", padding: "5px 6px" }}>{r.tooLarge ? "—" : r.across}</td>
 <td style={{ textAlign: "right", padding: "5px 6px" }}>{r.tooLarge ? "—" : r.down}</td>
 <td style={{ textAlign: "right", padding: "5px 6px", fontWeight: 600 }}>{r.tooLarge ? "⚠" : r.per}</td>
 <td style={{ textAlign: "right", padding: "5px 6px" }}>{r.tooLarge ? "—" : r.per * fqCount}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </div>

 {/* ═══ SQUARES PER FQ REFERENCE ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
 onClick={() =>setShowSqRef(!showSqRef)}>
 ▪️ Squares per Fat Quarter Reference
 <ChevronDown size={14} style={{ transform: showSqRef ? "rotate(180deg)" : "none", transition: "0.2s" }} />
 </button>
 {showSqRef && (
 <div style={{ marginTop: 10, overflowX: "auto" }}>
 <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
 <thead><tr style={{ borderBottom: "2px solid hsl(0,0%,85%)" }}>
 <th style={{ textAlign: "left", padding: "6px 6px" }}>Square</th>
 <th style={{ textAlign: "right", padding: "6px 6px" }}>Across</th>
 <th style={{ textAlign: "right", padding: "6px 6px" }}>Down</th>
 <th style={{ textAlign: "right", padding: "6px 6px" }}>Per FQ</th>
 <th style={{ textAlign: "right", padding: "6px 6px" }}>Total ({fqCount})</th>
 </tr></thead>
 <tbody>
 {sqRefRows.map(r =>(
 <tr key={r.size} style={{ borderBottom: "1px solid hsl(0,0%,92%)" }}>
 <td style={{ padding: "5px 6px" }}>{toFrac(r.size)}&quot;</td>
 <td style={{ textAlign: "right", padding: "5px 6px" }}>{r.across}</td>
 <td style={{ textAlign: "right", padding: "5px 6px" }}>{r.down}</td>
 <td style={{ textAlign: "right", padding: "5px 6px", fontWeight: 600 }}>{r.per}</td>
 <td style={{ textAlign: "right", padding: "5px 6px" }}>{r.per * fqCount}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </div>

 {/* ═══ FQ vs QUARTER YARD ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
 onClick={() =>setShowComparison(!showComparison)}>Fat Quarter vs Regular Quarter Yard
 <ChevronDown size={14} style={{ transform: showComparison ? "rotate(180deg)" : "none", transition: "0.2s" }} />
 </button>
 {showComparison && (
 <div style={{ marginTop: 10 }}>
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
 <div style={{ padding: 10, background: "hsl(150,30%,96%)", borderRadius: 6 }}>
 <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, color: "hsl(150,60%,35%)" }}>Fat Quarter</div>
 <div style={{ fontSize: 12, lineHeight: 1.8 }}>
 <div>Size: <strong>18&quot; × 22&quot;</strong></div>
 <div>Area: 396 sq&quot;</div>
 <div>Max block: 17&quot;</div>
 <div>6&quot; blocks: <strong>6</strong></div>
 <div>Best for: <strong>Blocks, pieces</strong></div>
 </div>
 </div>
 <div style={{ padding: 10, background: "hsl(0,0%,96%)", borderRadius: 6 }}>
 <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, color: "hsl(0,0%,45%)" }}>Regular ¼ Yard</div>
 <div style={{ fontSize: 12, lineHeight: 1.8 }}>
 <div>Size: <strong>9&quot; × 44&quot;</strong></div>
 <div>Area: 396 sq&quot;</div>
 <div>Max block: 8&quot;</div>
 <div>6&quot; blocks: <strong>0</strong>(too narrow!)</div>
 <div>Best for: <strong>Strips, borders</strong></div>
 </div>
 </div>
 </div>
 <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: "hsl(150,60%,35%)", textAlign: "center" }}>Same area — completely different utility. Fat quarters are vastly more useful for blocks!
 </div>
 </div>
 )}
 </div>

 {/* ═══ BUNDLE SIZE REFERENCE ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
 onClick={() =>setShowBundleRef(!showBundleRef)}>Bundle Size Project Guide
 <ChevronDown size={14} style={{ transform: showBundleRef ? "rotate(180deg)" : "none", transition: "0.2s" }} />
 </button>
 {showBundleRef && (
 <div style={{ marginTop: 10 }}>
 {[
 { n: 5, desc: "Wall hanging or table runner", ex: "1×5 at 12\" = 12\"×60\" runner" },
 { n: 6, desc: "Baby quilt (small)", ex: "2×3 at 12\" = 24\"×36\"" },
 { n: 10, desc: "Baby to lap quilt", ex: "2×5 at 12\" = 24\"×60\"" },
 { n: 12, desc: "Baby quilt (popular)", ex: "3×4 at 12\" = 36\"×48\"" },
 { n: 15, desc: "Lap quilt", ex: "3×5 at 12\" = 36\"×60\"" },
 { n: 20, desc: "Throw quilt ★", ex: "4×5 at 12\" = 48\"×60\"" },
 { n: 24, desc: "Lap to throw", ex: "4×6 at 12\" = 48\"×72\"" },
 { n: 30, desc: "Throw to lap", ex: "5×6 at 12\" = 60\"×72\"" },
 { n: 36, desc: "Full/Queen", ex: "6×6 at 12\" = 72\"×72\"" },
 { n: 40, desc: "Twin to full", ex: "5×8 at 12\" = 60\"×96\"" },
 ].map((b, i) =>(
 <div key={i} style={{
 display: "flex", alignItems: "center", gap: 8, padding: "6px 0",
 borderBottom: "1px solid hsl(0,0%,92%)",
 background: b.n === fqCount ? "hsl(150,40%,96%)" : undefined,
 borderRadius: b.n === fqCount ? 4 : 0,
 padding: b.n === fqCount ? "6px 8px" : "6px 0",
 }}>
 <span style={{ fontWeight: 700, fontSize: 14, width: 32, textAlign: "right", color: b.n === fqCount ? "hsl(150,60%,35%)" : "var(--color-text-primary)" }}>{b.n}</span>
 <span style={{ flex: 1 }}>
 <span style={{ fontSize: 13, fontWeight: 600 }}>{b.desc}</span>
 <br /><span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>{b.ex}</span>
 </span>
 </div>
 ))}
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
 <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Fat Quarter Facts</h4>
 <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.9 }}>
 <div>Size: 18&quot; × 22&quot;</div>
 <div>Usable: {toFrac(FQ_W)}&quot; × {FQ_H}&quot;</div>
 <div>Area: 396 sq&quot; each</div>
 <div>= ¼ yard (0.25 yd)</div>
 <div style={{ marginTop: 6, fontWeight: 600, color: "hsl(150,60%,35%)" }}>Sweet spot: 12&quot; block = 1 per FQ</div>
 </div>
 </div>
 <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
 <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Your Bundle</h4>
 <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.9 }}>
 <div>Fat quarters: {fqCount}</div>
 <div>Block size: {blockSize}&quot;</div>
 <div>Blocks per FQ: {results.blocksPerFQ}</div>
 <div>Total blocks: {results.totalBlocks}</div>
 {useBackground && <div>+ Background: {results.bgLayout?.bgBlocks || 0}</div>}
 </div>
 </div>
 <div className="glass-card related-tools">
 <h4>Related Tools</h4>
 <a href="/quilt/charm-pack-calculator" className="related-tool-link">Charm Pack Calculator</a>
 <a href="/quilt/blocks-needed" className="related-tool-link">Blocks Needed Calculator</a>
 <a href="/quilt/backing-calculator" className="related-tool-link">Backing Calculator</a>
 <a href="/quilt/binding-calculator" className="related-tool-link">Binding Calculator</a>
 <a href="/quilt" className="related-tool-link">All Quilt Tools</a>
 </div>
 </aside>
 </div>
 </div>
 );
}