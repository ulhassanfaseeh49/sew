"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, ChevronDown, Triangle } from "lucide-react";

/* helpers */
const SQRT2 = Math.SQRT2; // 1.41421356…
function roundUp8(v: number): number { return Math.ceil(v * 8) / 8; }
function toFrac(v: number): string {
 if (v <= 0) return "0";
 const w = Math.floor(v);
 const f = v - w;
 const map: [number, string][] = [[0, ""], [0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
 let best = map[0], bd = 1;
 for (const [n, s] of map) { const d = Math.abs(f - n); if (d < bd) { bd = d; best = [n, s]; } }
 if (Math.abs(f - 1) < bd) return `${w + 1}`;
 if (!best[1]) return w >0 ? `${w}` : "0";
 return w >0 ? `${w}${best[1]}` : `${best[1]}`;
}
function toF(v: number): string { return toFrac(v) + '"'; }

const blockPresets = [4, 4.5, 5, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 24];
const layoutPresets: [number, number][] = [[3, 3], [3, 4], [4, 4], [4, 5], [5, 5], [5, 6]];

const faqItems = [
 { q: "What are setting triangles in a quilt?", a: "Setting triangles fill the edge and corner spaces in an on-point (diagonal) quilt. When blocks are rotated 45°, the edges are jagged — setting triangles create straight quilt edges. There are two types: side triangles (along edges) and corner triangles (at four corners)." },
 { q: "How do I calculate setting triangle sizes?", a: "Side triangles: cut squares at (block size × 1.414) + 1.25\", then cut TWICE diagonally. Corner triangles: cut squares at (block size × 0.707) + 0.875\", then cut ONCE diagonally. For 12\" blocks: side squares = 18¼\", corner squares = 9⅜\"." },
 { q: "What size squares do I cut for setting triangles?", a: "It depends on your block size. For 12\" blocks: 18¼\" for sides, 9⅜\" for corners. For 6\" blocks: 9⅞\" for sides, 5\" for corners. See our reference table for all common sizes. Always round UP to nearest ⅛\"." },
 { q: "Do I cut setting triangle squares once or twice?", a: "Side triangles: cut TWICE diagonally (X cut = 4 quarter-square triangles per square). Corner triangles: cut ONCE diagonally (= 2 half-square triangles per square). This puts straight grain on the outside quilt edges." },
 { q: "What is the difference between side and corner triangles?", a: "Side triangles fill the edge spaces (larger, more numerous). Corner triangles fill only the 4 corners (smaller, always exactly 4 needed). They use different cutting methods to keep straight grain on outside edges." },
 { q: "Why do setting triangles need different cutting than HSTs?", a: "The cutting method determines grain direction. Side triangles are cut from squares divided TWICE so the long edge (quilt's outside edge) is on straight grain. Cutting once would put bias on the outside edge, causing stretching." },
 { q: "Why does my on-point quilt have wavy edges?", a: "Almost certainly: the setting triangles were cut with the wrong method, putting bias on the outside edges. Solution: recut with correct method, or starch/stabilize the bias edges heavily before and after sewing." },
 { q: "How do I fix wrong-sized setting triangles?", a: "If too big: trim after assembly. If too small: you must recut — there's no way to stretch them safely. The most common mistake is using block size directly instead of block diagonal (×1.414) in the formula." },
 { q: "Should I cut setting triangles oversized?", a: "Yes — strongly recommended! Cut squares 1\" larger than calculated, assemble the quilt, then trim edges straight using a ruler. This produces perfectly straight edges and is more forgiving of small cutting inaccuracies." },
 { q: "How much fabric do I need for setting triangles?", a: "Depends on block size and layout. For 12\" blocks in a 4×5 layout: about 1.5 yards total. Side triangle squares are large (18¼\" for 12\" blocks), so yardage adds up. Use different fabrics for sides and corners if desired." },
 { q: "What does 'on-point' mean in quilting?", a: "On-point means blocks are rotated 45° so they appear as diamonds. The quilt is still rectangular, but blocks inside are diagonal. This creates a dynamic, elegant look. Requires setting triangles to fill edge spaces." },
 { q: "How do I calculate on-point quilt size?", a: "Each block's diagonal = block size × 1.414. Quilt width ≈ widest diagonal row × block diagonal. For 4 blocks wide with 12\" blocks: widest row = 4 × 16.97\" ≈ 68\". Add setting triangle margins for final size." },
];

/* Reference table data: block → side square, corner square */
const refData = blockPresets.map(bs =>{
 const diag = bs * SQRT2;
 const sideRaw = diag + 1.25;
 const cornerRaw = (diag / 2) + 0.875;
 return { bs, diag, side: roundUp8(sideRaw), sideRaw, corner: roundUp8(cornerRaw), cornerRaw };
});

export default function Page() {
 const [blockSize, setBlockSize] = useState(12);
 const [bCols, setBCols] = useState(4);
 const [bRows, setBRows] = useState(5);
 const [oversize, setOversize] = useState(true);
 const [oversizeAmt, setOversizeAmt] = useState(1);
 const [fabricW, setFabricW] = useState(42);
 const [showFormula, setShowFormula] = useState(false);
 const [showCutPlan, setShowCutPlan] = useState(false);
 const [showCompare, setShowCompare] = useState(false);
 const [showEdu, setShowEdu] = useState(false);
 const [activeFaq, setActiveFaq] = useState<number | null>(null);

 const calc = useMemo(() =>{
 const diag = blockSize * SQRT2;
 // Side setting triangle: cut square TWICE diag → 4 QSTs
 const sideRaw = diag + 1.25;
 const sideSq = roundUp8(sideRaw) + (oversize ? oversizeAmt : 0);
 // Corner setting triangle: cut square ONCE diag → 2 HSTs
 const cornerRaw = (diag / 2) + 0.875;
 const cornerSq = roundUp8(cornerRaw) + (oversize ? oversizeAmt : 0);

 // Side triangle count: for on-point grid, side triangles = 2*(cols+rows) - 4
 // (each edge of the diamond shape gets triangles)
 const sideTriNeeded = 2 * (bCols + bRows) - 4;
 const sideSquaresNeeded = Math.ceil(sideTriNeeded / 4);
 const sideTriProduced = sideSquaresNeeded * 4;

 // Corner triangles: always 4 (from 2 squares cut once)
 const cornerTriNeeded = 4;
 const cornerSquaresNeeded = 2;
 const cornerTriProduced = 4;

 // Yardage
 const sidePerRow = Math.floor(fabricW / sideSq);
 const sideRows = Math.ceil(sideSquaresNeeded / Math.max(sidePerRow, 1));
 const sideYdIn = sideRows * sideSq;
 const sideYd = sideYdIn / 36;
 const sideBuy = Math.ceil(sideYd * 4) / 4 + 0.25;

 const cornerPerRow = Math.floor(fabricW / cornerSq);
 const cornerRows = Math.ceil(cornerSquaresNeeded / Math.max(cornerPerRow, 1));
 const cornerYdIn = cornerRows * cornerSq;
 const cornerYd = cornerYdIn / 36;
 const cornerBuy = Math.max(0.5, Math.ceil(cornerYd * 4) / 4 + 0.25);

 const totalYd = sideYd + cornerYd;
 const totalBuy = Math.ceil(totalYd * 4) / 4 + 0.25;

 // On-point quilt size approx
 const maxDiagRow = Math.min(bCols, bRows);
 const quiltW = bCols * diag;
 const quiltH = bRows * diag;

 return {
 diag, sideRaw, sideSq, cornerRaw, cornerSq,
 sideTriNeeded, sideSquaresNeeded, sideTriProduced,
 cornerTriNeeded, cornerSquaresNeeded, cornerTriProduced,
 sidePerRow, sideRows, sideYd, sideBuy,
 cornerPerRow, cornerRows, cornerYd, cornerBuy,
 totalYd, totalBuy, quiltW, quiltH, maxDiagRow,
 };
 }, [blockSize, bCols, bRows, oversize, oversizeAmt, fabricW]);

 const tH = { padding: "5px 8px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left" as const, fontSize: 11, fontWeight: 600 as const };
 const tD = { padding: "4px 8px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11 };

 const copyText = `Setting triangles for ${blockSize}" blocks: Side squares ${toF(calc.sideSq)} (cut TWICE, ${calc.sideSquaresNeeded} squares → ${calc.sideTriProduced} triangles). Corner squares ${toF(calc.cornerSq)} (cut ONCE, ${calc.cornerSquaresNeeded} squares → ${calc.cornerTriProduced} triangles). Buy: ${toFrac(calc.totalBuy)} yd.`;

 return (
 <div className="container">
 <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "Setting Triangles" }]} />
 <div className="calculator-layout">
 <div className="calculator-main">
 <div className={styles.toolHeader}>
 <span className="category-badge"><Triangle size={14} strokeWidth={1.5} />Quilt #144</span>
 <h1>Setting Triangle Calculator</h1>
 <p>Calculate exact cutting sizes for side and corner setting triangles in on-point quilts. Get piece counts, yardage, and understand why the cutting method matters for straight quilt edges.</p>
 </div>

 {/* ① BLOCK & LAYOUT */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>① Block &amp; Layout</h2>
 <div className="input-group" style={{ marginBottom: 8 }}>
 <label className="input-label">Finished block size (inches)</label>
 <input type="number" className="input-field" value={blockSize} onChange={e =>setBlockSize(Math.max(2, parseFloat(e.target.value) || 12))} min={2} step={0.5} />
 <div style={{ display: "flex", gap: 3, marginTop: 4, flexWrap: "wrap" }}>
 {blockPresets.map(s =>(
 <button key={s} className={`btn btn-sm ${blockSize === s ? "btn-primary" : "btn-ghost"}`} onClick={() =>setBlockSize(s)} style={{ fontSize: 9, padding: "2px 5px" }}>{s}&quot;</button>
 ))}
 </div>
 </div>
 <div className="calculator-form-row">
 <div className="input-group"><label className="input-label">Blocks across (diagonal)</label>
 <input type="number" className="input-field" value={bCols} onChange={e =>setBCols(Math.max(2, parseInt(e.target.value) || 2))} min={2} /></div>
 <div className="input-group"><label className="input-label">Blocks down (diagonal)</label>
 <input type="number" className="input-field" value={bRows} onChange={e =>setBRows(Math.max(2, parseInt(e.target.value) || 2))} min={2} /></div>
 </div>
 <div style={{ display: "flex", gap: 3, marginTop: 4, flexWrap: "wrap" }}>
 {layoutPresets.map(([c, r]) =>(
 <button key={`${c}x${r}`} className={`btn btn-sm ${bCols === c && bRows === r ? "btn-primary" : "btn-ghost"}`} onClick={() =>{ setBCols(c); setBRows(r); }} style={{ fontSize: 9 }}>{c}×{r}</button>
 ))}
 </div>
 <div style={{ marginTop: 6, fontSize: 12, color: "var(--color-text-secondary)" }}>Block diagonal: <strong>{calc.diag.toFixed(2)}&quot;</strong>| Total blocks: <strong>{bCols * bRows}</strong></div>
 </div>

 {/* ② OPTIONS */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>② Options</h2>
 <label style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 6, cursor: "pointer", marginBottom: 6 }}>
 <input type="checkbox" checked={oversize} onChange={e =>setOversize(e.target.checked)} />Cut oversized for trimming (recommended)
 </label>
 {oversize && (
 <div className="input-group" style={{ marginBottom: 6 }}>
 <label className="input-label">Oversize amount</label>
 <div style={{ display: "flex", gap: 3 }}>
 {[0.5, 0.75, 1, 1.5].map(a =>(
 <button key={a} className={`btn btn-sm ${oversizeAmt === a ? "btn-primary" : "btn-ghost"}`} onClick={() =>setOversizeAmt(a)} style={{ fontSize: 9 }}>+{toF(a)}</button>
 ))}
 </div>
 </div>
 )}
 <div className="input-group">
 <label className="input-label">Usable fabric width</label>
 <input type="number" className="input-field" value={fabricW} onChange={e =>setFabricW(Math.max(36, parseInt(e.target.value) || 42))} min={36} />
 </div>
 </div>

 {/* ③ THE TWO CRITICAL NUMBERS */}
 <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(150,50%,40%)" }}>
 <h2 className={styles.calcTitle}>③ Setting Triangle Sizes</h2>
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
 <div style={{ padding: 16, background: "hsl(150,15%,95%)", borderRadius: 10, textAlign: "center" }}>
 <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "hsl(150,40%,35%)" }}>Side Triangles</div>
 <div style={{ fontSize: 30, fontWeight: 800, color: "hsl(150,50%,30%)", margin: "4px 0" }}>{toF(calc.sideSq)}</div>
 <div style={{ fontSize: 14, fontWeight: 700, color: "hsl(0,60%,45%)" }}>Cut TWICE ✂✂</div>
 <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 2 }}>4 triangles per square</div>
 </div>
 <div style={{ padding: 16, background: "hsl(30,20%,95%)", borderRadius: 10, textAlign: "center" }}>
 <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "hsl(30,50%,35%)" }}>Corner Triangles</div>
 <div style={{ fontSize: 30, fontWeight: 800, color: "hsl(30,60%,35%)", margin: "4px 0" }}>{toF(calc.cornerSq)}</div>
 <div style={{ fontSize: 14, fontWeight: 700, color: "hsl(220,60%,45%)" }}>Cut ONCE ✂</div>
 <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 2 }}>2 triangles per square</div>
 </div>
 </div>
 {oversize && <div style={{ fontSize: 11, padding: 6, background: "hsl(40,20%,96%)", borderRadius: 4, marginBottom: 8 }}>Includes +{toF(oversizeAmt)} oversize — trim after assembly for perfect edges.</div>}

 <div className={styles.resultDetails}>
 <div className="result-row"><span>Side triangles needed</span><strong>{calc.sideTriNeeded} (cut {calc.sideSquaresNeeded} squares → {calc.sideTriProduced} tri, {calc.sideTriProduced - calc.sideTriNeeded} spare)</strong></div>
 <div className="result-row"><span>Corner triangles needed</span><strong>{calc.cornerTriNeeded} (cut {calc.cornerSquaresNeeded} squares → {calc.cornerTriProduced} tri)</strong></div>
 <div className="result-row"><span>Total squares to cut</span><strong>{calc.sideSquaresNeeded + calc.cornerSquaresNeeded} ({calc.sideSquaresNeeded} side + {calc.cornerSquaresNeeded} corner)</strong></div>
 </div>

 <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
 <div style={{ padding: 10, background: "hsl(150,10%,96%)", borderRadius: 6, textAlign: "center" }}>
 <div style={{ fontSize: 10, fontWeight: 600 }}>Side Yardage</div>
 <div style={{ fontSize: 18, fontWeight: 800, color: "hsl(150,50%,35%)" }}>{toFrac(calc.sideBuy)} yd</div>
 </div>
 <div style={{ padding: 10, background: "hsl(30,10%,96%)", borderRadius: 6, textAlign: "center" }}>
 <div style={{ fontSize: 10, fontWeight: 600 }}>Corner Yardage</div>
 <div style={{ fontSize: 18, fontWeight: 800, color: "hsl(30,60%,40%)" }}>{toFrac(calc.cornerBuy)} yd</div>
 </div>
 <div style={{ padding: 10, background: "hsl(220,10%,96%)", borderRadius: 6, textAlign: "center" }}>
 <div style={{ fontSize: 10, fontWeight: 600 }}>Total (same fabric)</div>
 <div style={{ fontSize: 18, fontWeight: 800, color: "hsl(220,50%,40%)" }}>{toFrac(calc.totalBuy)} yd</div>
 </div>
 </div>
 <div style={{ marginTop: 8, fontSize: 11, color: "var(--color-text-tertiary)" }}>Approx on-point quilt size: {calc.quiltW.toFixed(0)}&quot; × {calc.quiltH.toFixed(0)}&quot; (before borders)
 </div>
 </div>

 {/* Toolbar */}
 <div className="toolbar" style={{ marginBottom: 10 }}>
 <button className="btn btn-secondary btn-sm" onClick={() =>navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} />Copy</button>
 <button className="btn btn-secondary btn-sm" onClick={() =>window.print()}><Printer size={13} />Print</button>
 </div>

 {/* ═══ FORMULA EXPLANATION ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowFormula(!showFormula)}>How These Sizes Were Calculated
 <ChevronDown size={14} style={{ transform: showFormula ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showFormula && (
 <div style={{ marginTop: 10, fontSize: 12, lineHeight: 2 }}>
 <div style={{ padding: 10, background: "hsl(150,10%,97%)", borderRadius: 6, marginBottom: 8 }}>
 <strong style={{ color: "hsl(150,40%,35%)" }}>SIDE Setting Triangles</strong>
 <div style={{ fontFamily: "monospace", fontSize: 11, marginTop: 4, lineHeight: 1.8 }}>Block diagonal = {blockSize}&quot; × √2 = {calc.diag.toFixed(3)}&quot;<br />Square = diagonal + 1.25&quot; = {calc.diag.toFixed(3)} + 1.25 = {calc.sideRaw.toFixed(3)}&quot;<br />Round up to ⅛&quot;: {toF(roundUp8(calc.sideRaw))}{oversize ? ` + ${toF(oversizeAmt)} oversize = ${toF(calc.sideSq)}` : ""}
 </div>
 <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 4 }}>Cut TWICE diagonally → 4 quarter-square triangles.<br />Straight grain on long edge (quilt&apos;s outside edge) ✓
 </div>
 </div>
 <div style={{ padding: 10, background: "hsl(30,10%,97%)", borderRadius: 6 }}>
 <strong style={{ color: "hsl(30,50%,35%)" }}>CORNER Setting Triangles</strong>
 <div style={{ fontFamily: "monospace", fontSize: 11, marginTop: 4, lineHeight: 1.8 }}>Block diagonal / 2 = {calc.diag.toFixed(3)} / 2 = {(calc.diag / 2).toFixed(3)}&quot;<br />Square = half-diag + 0.875&quot; = {(calc.diag / 2).toFixed(3)} + 0.875 = {calc.cornerRaw.toFixed(3)}&quot;<br />Round up to ⅛&quot;: {toF(roundUp8(calc.cornerRaw))}{oversize ? ` + ${toF(oversizeAmt)} oversize = ${toF(calc.cornerSq)}` : ""}
 </div>
 <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 4 }}>Cut ONCE diagonally → 2 half-square triangles.<br />Straight grain on two short legs (quilt&apos;s corner edges) ✓
 </div>
 </div>
 </div>
 )}
 </div>

 {/* ═══ CUTTING PLAN ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowCutPlan(!showCutPlan)}>
 ✂️ Complete Cutting Plan
 <ChevronDown size={14} style={{ transform: showCutPlan ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showCutPlan && (
 <div style={{ marginTop: 10, fontSize: 12, lineHeight: 2 }}>
 <div style={{ padding: 10, background: "hsl(150,10%,97%)", borderRadius: 6, marginBottom: 6 }}>
 <strong>Step 1: Cut side triangle squares</strong>
 <div>□ Cut <strong>{calc.sideSquaresNeeded} squares</strong>at {toF(calc.sideSq)} × {toF(calc.sideSq)}</div>
 <div>□ ({calc.sidePerRow} squares fit across {fabricW}&quot; fabric = {calc.sideRows} WOF row{calc.sideRows >1 ? "s" : ""})</div>
 </div>
 <div style={{ padding: 10, background: "hsl(0,10%,97%)", borderRadius: 6, marginBottom: 6 }}>
 <strong>Step 2: Cut each side square TWICE diagonally</strong>
 <div>□ Cut corner-to-corner, then corner-to-corner again (X cut)</div>
 <div>□ Result: {calc.sideTriProduced} quarter-square triangles (need {calc.sideTriNeeded})</div>
 <div style={{ fontSize: 11, color: "hsl(0,60%,50%)" }}>⚠ Handle bias edges gently — do not stretch!</div>
 </div>
 <div style={{ padding: 10, background: "hsl(30,10%,97%)", borderRadius: 6, marginBottom: 6 }}>
 <strong>Step 3: Cut corner triangle squares</strong>
 <div>□ Cut <strong>{calc.cornerSquaresNeeded} squares</strong>at {toF(calc.cornerSq)} × {toF(calc.cornerSq)}</div>
 </div>
 <div style={{ padding: 10, background: "hsl(220,10%,97%)", borderRadius: 6, marginBottom: 6 }}>
 <strong>Step 4: Cut each corner square ONCE diagonally</strong>
 <div>□ Cut corner-to-corner (single diagonal cut)</div>
 <div>□ Result: {calc.cornerTriProduced} half-square triangles (need exactly 4)</div>
 </div>
 <div style={{ padding: 8, background: "hsl(0,0%,96%)", borderRadius: 6, fontSize: 11 }}>
 <strong>Assembly:</strong>Sew diagonal rows (blocks + side triangles) → Join rows → Add corner triangles last → {oversize ? "Trim edges straight → " : ""}Square up quilt top
 </div>
 </div>
 )}
 </div>

 {/* ═══ STANDARD vs OVERSIZED ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowCompare(!showCompare)}>Standard vs Oversized Comparison
 <ChevronDown size={14} style={{ transform: showCompare ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showCompare && (() =>{
 const stdSide = roundUp8(calc.sideRaw);
 const stdCorner = roundUp8(calc.cornerRaw);
 const osSide = stdSide + 1;
 const osCorner = stdCorner + 1;
 return (
 <div style={{ marginTop: 10, overflowX: "auto" }}>
 <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
 <thead><tr><th style={tH}></th><th style={tH}>Standard</th><th style={tH}>Oversized (+1&quot;)</th></tr></thead>
 <tbody>
 <tr><td style={{ ...tD, fontWeight: 600 }}>Side square</td><td style={tD}>{toF(stdSide)}</td><td style={tD}>{toF(osSide)}</td></tr>
 <tr><td style={{ ...tD, fontWeight: 600 }}>Corner square</td><td style={tD}>{toF(stdCorner)}</td><td style={tD}>{toF(osCorner)}</td></tr>
 <tr><td style={{ ...tD, fontWeight: 600 }}>Trimming</td><td style={tD}>No</td><td style={tD}>Yes — after assembly</td></tr>
 <tr><td style={{ ...tD, fontWeight: 600 }}>Edge precision</td><td style={tD}>Depends on skill</td><td style={tD}>Excellent</td></tr>
 <tr><td style={{ ...tD, fontWeight: 600 }}>Recommended</td><td style={tD}>Experienced</td><td style={{ ...tD, fontWeight: 700, color: "hsl(150,50%,35%)" }}>All quilters ✓</td></tr>
 </tbody>
 </table>
 </div>
 );
 })()}
 </div>

 {/* ═══ REFERENCE TABLE ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>Setting Triangle Reference Table</h2>
 <div style={{ overflowX: "auto" }}>
 <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
 <thead><tr><th style={tH}>Block</th><th style={tH}>Side Square</th><th style={tH}>Corner Square</th><th style={tH}>Yield</th></tr></thead>
 <tbody>{refData.map(r =>{
 const active = Math.abs(r.bs - blockSize) < 0.01;
 return (
 <tr key={r.bs} style={{ background: active ? "hsl(150,15%,93%)" : undefined, cursor: "pointer" }} onClick={() =>setBlockSize(r.bs)}>
 <td style={{ ...tD, fontWeight: 600 }}>{r.bs}&quot;</td>
 <td style={tD}>{toF(r.side)}</td>
 <td style={tD}>{toF(r.corner)}</td>
 <td style={tD}>4 / 2</td>
 </tr>
 );
 })}</tbody>
 </table>
 </div>
 <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 4 }}>Standard ¼&quot; seam allowance, no oversize. Click a row to select. Side: cut TWICE, Corner: cut ONCE.</div>
 </div>

 {/* ═══ EDUCATIONAL ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowEdu(!showEdu)}>Understanding Setting Triangles
 <ChevronDown size={14} style={{ transform: showEdu ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showEdu && (
 <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.9, color: "var(--color-text-secondary)" }}>
 <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>Why Two Different Cutting Methods?</h4>
 <p style={{ fontSize: 12 }}>The goal: straight grain on EVERY outside edge. Side triangles&apos; long edge faces outward → cut TWICE (QST method) puts straight grain on the hypotenuse. Corner triangles&apos; short legs face outward → cut ONCE (HST method) puts straight grain on the legs. Wrong method = bias on outside = wavy, stretched edges.</p>

 <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 10 }}>The Biggest Mistake</h4>
 <p style={{ fontSize: 12 }}>Using block SIZE directly instead of block DIAGONAL. A 12&quot; block on-point spans 16.97&quot; diagonally — that&apos;s the measurement the setting triangle must match. Using 12&quot; produces triangles 5&quot; too small! Always multiply block size × 1.414 first.</p>

 <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 10 }}>Handling Bias Edges</h4>
 <p style={{ fontSize: 12 }}>Diagonal cuts create stretchy bias edges. Tips: spray with starch before cutting, handle minimally, pin carefully when sewing, press up-and-down (not side-to-side). Sew bias edge to straight grain edge whenever possible — the straight grain stabilizes it.</p>

 <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 10 }}>Assembly Order</h4>
 <p style={{ fontSize: 12 }}>1) Lay out blocks + triangles in diagonal pattern. 2) Sew diagonal rows with side triangles at ends. 3) Press each row. 4) Join diagonal rows. 5) Add corner triangles last. 6) Trim edges if oversized. 7) Square up before borders.</p>
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
 <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Your Triangles</h4>
 <div style={{ fontSize: 12, lineHeight: 2.2, color: "var(--color-text-secondary)" }}>
 <div>Block: <strong>{blockSize}&quot;</strong>(diag {calc.diag.toFixed(1)}&quot;)</div>
 <div>Layout: <strong>{bCols}×{bRows} on-point</strong></div>
 <div>Side: <strong>{toF(calc.sideSq)}</strong>× {calc.sideSquaresNeeded}</div>
 <div>Corner: <strong>{toF(calc.cornerSq)}</strong>× {calc.cornerSquaresNeeded}</div>
 <div>Buy: <strong>{toFrac(calc.totalBuy)} yd</strong></div>
 </div>
 </div>
 <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
 <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Key Formulas</h4>
 <div style={{ fontSize: 11, padding: 8, background: "hsl(0,0%,96%)", borderRadius: 6, fontFamily: "monospace", lineHeight: 2 }}>Side = block × √2 + 1.25&quot;<br />Corner = block × √2 ÷ 2 + 0.875&quot;<br />Side: cut TWICE → 4 tri<br />Corner: cut ONCE → 2 tri
 </div>
 </div>
 <div className="glass-card related-tools">
 <h4>Related Tools</h4>
 <a href="/quilt/size-calculator" className="related-tool-link">Quilt Size Calculator</a>
 <a href="/quilt/sashing-calculator" className="related-tool-link">Sashing Calculator</a>
 <a href="/quilt/border-calculator" className="related-tool-link">Border Calculator</a>
 <a href="/quilt/hst-calculator" className="related-tool-link">HST Calculator</a>
 <a href="/quilt/qst-calculator" className="related-tool-link">QST Calculator</a>
 <a href="/quilt/backing-calculator" className="related-tool-link">Backing Calculator</a>
 <a href="/quilt" className="related-tool-link">All Quilt Tools</a>
 </div>
 </aside>
 </div>
 </div>
 );
}