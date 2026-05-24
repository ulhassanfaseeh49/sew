"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Sparkles, ChevronDown, Info } from "lucide-react";

/* ─── helpers ───────────────────────────────────── */
function toFrac(v: number): string {
 const w = Math.floor(v); const f = v - w;
 const fracs: [number, string][] = [[0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
 for (const [d, sym] of fracs) { if (Math.abs(f - d) < 0.02) return w >0 ? `${w}${sym}` : sym; }
 if (f >0.01) return v.toFixed(1);
 return String(w);
}
function roundUp(val: number, incr: number) { return Math.ceil(val / incr) * incr; }

const FINISHED = 4.5; // 5" charm → 4.5" finished

/* ─── layout finder ──────────────────────────── */
function findLayouts(total: number, finSize: number): { cols: number; rows: number; used: number; w: number; h: number; waste: number }[] {
 const opts: { cols: number; rows: number; used: number; w: number; h: number; waste: number }[] = [];
 for (let c = 3; c <= Math.min(total, 30); c++) {
 const r = Math.floor(total / c);
 if (r < 2) continue;
 const used = c * r;
 if (used >total) continue;
 // filter out duplicate permutation and narrow layouts
 if (c >r + 5) continue;
 opts.push({ cols: c, rows: r, used, w: +(c * finSize).toFixed(1), h: +(r * finSize).toFixed(1), waste: total - used });
 }
 // sort by least waste then most square aspect ratio
 opts.sort((a, b) =>a.waste - b.waste || Math.abs(a.cols - a.rows) - Math.abs(b.cols - b.rows));
 return opts.slice(0, 8);
}

/* ─── standard quilt sizes ref ───────────────── */
const STD_SIZES = [
 { label: "Baby", w: 36, h: 45 }, { label: "Throw", w: 54, h: 63 },
 { label: "Lap", w: 60, h: 72 }, { label: "Twin", w: 60, h: 81 },
 { label: "Full", w: 72, h: 81 }, { label: "Queen", w: 81, h: 90 },
 { label: "King", w: 90, h: 99 },
];

/* ─── component ──────────────────────────────── */
export default function Page() {
 /* Inputs */
 const [packs, setPacks] = useState("1");
 const [sqPerPack, setSqPerPack] = useState("42");
 const [mode, setMode] = useState<"individual" | "packs">("packs");
 const [individualSq, setIndividualSq] = useState("42");
 const [project, setProject] = useState<"grid" | "background" | "hst" | "fourpatch">("grid");
 const [addBg, setAddBg] = useState(false);
 const [fabricW, setFabricW] = useState("44");
 /* UI */
 const [showRef, setShowRef] = useState(false);
 const [showEdu, setShowEdu] = useState(false);
 const [activeFaq, setActiveFaq] = useState<number | null>(null);

 const totalSq = mode === "packs" ? (parseInt(packs) || 0) * (parseInt(sqPerPack) || 42) : parseInt(individualSq) || 0;
 const fw = parseFloat(fabricW) || 44;
 const usable = fw - 1; // selvage

 /* ═══ CALCULATIONS ═══ */
 const results = useMemo(() =>{
 if (totalSq < 4) return null;

 /* SIMPLE GRID */
 const gridLayouts = findLayouts(totalSq, FINISHED);
 const best = gridLayouts[0] || null;

 /* WITH BACKGROUND */
 const bgTotal = totalSq * 2; // one bg square per charm square
 const bgLayouts = findLayouts(bgTotal, FINISHED);
 const bgBest = bgLayouts[0] || null;
 // Background fabric needed
 const bgSqNeeded = totalSq;
 const bgPerStrip = Math.floor(usable / 5);
 const bgStrips = Math.ceil(bgSqNeeded / bgPerStrip);
 const bgInches = bgStrips * 5;
 const bgYd = bgInches / 36;
 const bgBuy = roundUp(bgYd + 0.125, 0.25);

 /* HST (2-at-a-time from charm squares) */
 const hstPairs = Math.floor(totalSq / 2);
 const hstCount = hstPairs * 2; // 2 HSTs per pair
 const hstFinished = 4; // trim to 4" finished
 const hstLayouts = findLayouts(hstCount, hstFinished);
 const pinwheelBlocks = Math.floor(hstCount / 4);
 const pinwheelSize = 8; // 4" HST × 2 = 8" pinwheel block
 const pinwheelLayouts = findLayouts(pinwheelBlocks, pinwheelSize);

 /* FOUR-PATCH */
 const subCutSq = totalSq * 4; // 4 × 2.5" squares per charm
 const fourPatchBlocks = Math.floor(subCutSq / 4); // same as totalSq conceptually
 const fourPatchFinished = 4; // 2" × 2 = 4" finished
 const fpLayouts = findLayouts(fourPatchBlocks, fourPatchFinished);

 return {
 totalSq,
 gridLayouts, best,
 bgTotal, bgLayouts, bgBest, bgSqNeeded, bgPerStrip, bgStrips, bgBuy,
 hstPairs, hstCount, hstLayouts, pinwheelBlocks, pinwheelLayouts,
 subCutSq, fourPatchBlocks, fpLayouts,
 };
 }, [totalSq, usable]);

 /* Packs-for-standard-sizes reference */
 const packsRef = useMemo(() =>{
 const spk = parseInt(sqPerPack) || 42;
 return STD_SIZES.map(s =>{
 const cols = Math.ceil(s.w / FINISHED);
 const rows = Math.ceil(s.h / FINISHED);
 const needed = cols * rows;
 const packsNeeded = Math.ceil(needed / spk);
 const totalAvail = packsNeeded * spk;
 return { ...s, cols, rows, needed, packsNeeded, totalAvail, leftover: totalAvail - needed };
 });
 }, [sqPerPack]);

 const copyText = results && results.best ? `${totalSq} charm squares (${mode === "packs" ? packs + " pack(s)" : "individual"}). Best grid: ${results.best.cols}×${results.best.rows} = ${results.best.w}" × ${results.best.h}" finished.` : "";

 const faqItems = [
 { q: "What is a charm pack in quilting?", a: "A charm pack is a pre-cut bundle of 5\" × 5\" fabric squares, usually containing 42 squares — one of each fabric in a collection. Major brands like Moda, Riley Blake, and Robert Kaufman produce charm packs. They eliminate color selection and reduce cutting time, making them ideal for beginners." },
 { q: "How many squares are in a charm pack?", a: "Standard charm packs contain 42 squares (Moda standard). Some brands offer 40 squares, and specialty or mini packs may have 36 or 24 squares. Always check the label before planning your project." },
 { q: "What can I make with one charm pack?", a: "From one charm pack (42 squares): a small baby quilt (6×7 = 27\" × 31½\"), a table runner (3×14 = 13½\" × 63\"), or multiple mug rugs. Add background fabric to double your squares and make a larger baby quilt (36\" × 45\")." },
 { q: "How many charm packs for a throw quilt?", a: "For a simple grid throw quilt (≈54\" × 63\"), you need 4 charm packs (168 squares in a 12×14 layout). With background fabric, just 2 packs plus 1¾ yards background achieves the same size." },
 { q: "How many charm packs for a queen-size quilt?", a: "For a simple grid queen quilt (≈81\" × 90\"), you need about 9 charm packs (378 squares). With background fabric, approximately 5 packs plus background yardage can achieve a queen size." },
 { q: "What size do charm squares finish at?", a: "Each 5\" charm square finishes at 4½\" after sewing (loses ¼\" seam allowance on each of 2 joining sides = ½\" total). A 6×7 layout of charm squares finishes at 27\" × 31½\"." },
 { q: "How do I make HSTs from charm squares?", a: "Use the 2-at-a-time method: pair one light and one dark charm square, draw a diagonal line, sew ¼\" on each side, cut on the line. Each pair yields 2 HSTs at approximately 4½\" unfinished, trim to 4\" finished. From 42 charms: 21 pairs → 42 HSTs." },
 { q: "Can I make a baby quilt from one charm pack?", a: "Yes! A 6×7 layout makes a 27\" × 31½\" small baby/stroller quilt. For a standard 36\" × 45\" baby quilt, use 2 charm packs (80 squares in an 8×10 layout) or 1 pack with background fabric." },
 { q: "What is the best quilt pattern for charm squares?", a: "Simple grid quilts are the easiest and fastest. Disappearing nine-patch creates stunning designs from simple charm squares. HST pinwheel quilts add visual interest. Adding sashing between squares frames each fabric beautifully." },
 { q: "How do I use a charm pack with background fabric?", a: "Cut background squares the same size as charms (5\" × 5\") and alternate them in a checkerboard pattern. This doubles your total squares and quilt size. For 42 charms, cut 42 background squares — about 1 yard of fabric." },
 ];

 return (
 <div className="container">
 <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "Charm Pack Calculator" }]} />
 <div className="calculator-layout">
 <div className="calculator-main">
 {/* HEADER */}
 <div className={styles.toolHeader}>
 <span className="category-badge"><Sparkles size={14} strokeWidth={1.5} />Quilt #160</span>
 <h1>Charm Pack Project Calculator</h1>
 <p>Calculate what quilt projects you can make from charm packs (5&quot; pre-cut squares), how many packs you need for a specific quilt size, and how much background fabric to buy.</p>
 </div>

 {/* ① CHARM PACK INPUT */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>① Your Charm Squares</h2>
 <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
 <button className={`btn btn-sm ${mode === "packs" ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setMode("packs")}>Charm Packs</button>
 <button className={`btn btn-sm ${mode === "individual" ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setMode("individual")}>Individual Squares</button>
 </div>
 {mode === "packs" ? (
 <div className="calculator-form-row">
 <div className="input-group">
 <label className="input-label">Number of packs</label>
 <input type="number" className="input-field" value={packs} onChange={e =>setPacks(e.target.value)} min={1} max={20} />
 </div>
 <div className="input-group">
 <label className="input-label">Squares per pack</label>
 <select className="input-field" value={sqPerPack} onChange={e =>setSqPerPack(e.target.value)}>
 <option value="42">42 (Moda standard)</option>
 <option value="40">40</option>
 <option value="36">36 (mini pack)</option>
 <option value="24">24 (specialty)</option>
 </select>
 </div>
 </div>
 ) : (
 <div className="input-group" style={{ maxWidth: 200 }}>
 <label className="input-label">Total 5&quot; squares</label>
 <input type="number" className="input-field" value={individualSq} onChange={e =>setIndividualSq(e.target.value)} min={4} />
 </div>
 )}
 <div style={{ marginTop: 8, padding: "8px 12px", background: "hsl(150,40%,95%)", borderRadius: "var(--radius-md)", fontSize: 13, fontWeight: 600, color: "hsl(150,50%,30%)" }}>Total: {totalSq} squares at 5&quot; × 5&quot; (finishes at {FINISHED}&quot; each)
 </div>
 </div>

 {/* ② PROJECT TYPE */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>② Project Type</h2>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
 {([
 ["grid", "Simple Grid", "Squares as-is, no cutting"],
 ["background", "With Background", "Alternate with bg squares"],
 ["hst", "HST / Pinwheel", "Half-square triangles"],
 ["fourpatch", "Four-Patch", "Sub-cut into 2½\" squares"],
 ] as const).map(([key, label, desc]) =>(
 <button key={key}
 className={`btn btn-sm ${project === key ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setProject(key)}
 style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1.3, padding: "8px 12px" }}>
 <span style={{ fontWeight: 600 }}>{label}</span>
 <span style={{ fontSize: 10, opacity: 0.8, fontWeight: 400 }}>{desc}</span>
 </button>
 ))}
 </div>
 </div>

 {/* ③ FABRIC WIDTH (for background) */}
 {(project === "background") && (
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>③ Background Fabric</h2>
 <div className="input-group" style={{ maxWidth: 200 }}>
 <label className="input-label">Fabric bolt width</label>
 <select className="input-field" value={fabricW} onChange={e =>setFabricW(e.target.value)}>
 <option value="42">42&quot;</option><option value="44">44&quot; (standard)</option><option value="45">45&quot;</option><option value="60">60&quot;</option>
 </select>
 </div>
 </div>
 )}

 {/* ═══ RESULTS ═══ */}
 {results && (<>
 {/* === SIMPLE GRID === */}
 {project === "grid" && results.best && (
 <div className={`calculator-results ${styles.results}`}>
 <div className="result-card">
 <div className="result-value">{results.best.cols} × {results.best.rows} = {results.best.used} squares</div>
 <div className="result-label">{results.best.w}&quot; × {results.best.h}&quot; finished • {results.best.waste >0 ? `${results.best.waste} leftover` : "all squares used"}</div>
 </div>
 <div className={styles.resultDetails} style={{ marginTop: 10 }}>
 <div className={styles.resultRow}><span>Total charm squares</span><strong>{totalSq}</strong></div>
 <div className={styles.resultRow}><span>Finished square size</span><strong>{FINISHED}&quot;</strong></div>
 <div className={styles.resultRow}><span>Best layout</span><strong>{results.best.cols} across × {results.best.rows} down</strong></div>
 <div className={styles.resultRow}><span>Finished quilt size</span><strong>{results.best.w}&quot; × {results.best.h}&quot;</strong></div>
 <div className={styles.resultRow}><span>Squares used / leftover</span><strong>{results.best.used} used, {results.best.waste} leftover</strong></div>
 </div>
 {results.gridLayouts.length >1 && (
 <div style={{ marginTop: 12 }}>
 <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>All Layout Options</div>
 <div className={styles.tableWrap}>
 <table className={styles.convTable}>
 <thead><tr><th>Layout</th><th>Squares</th><th>Finished Size</th><th>Leftover</th></tr></thead>
 <tbody>
 {results.gridLayouts.map((l, i) =>(
 <tr key={i} style={i === 0 ? { background: "hsl(150,40%,95%)" } : undefined}>
 <td>{l.cols} × {l.rows}</td>
 <td>{l.used}</td>
 <td style={{ fontWeight: 600 }}>{l.w}&quot; × {l.h}&quot;</td>
 <td>{l.waste}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )}
 {results.best.waste >0 && (
 <div style={{ marginTop: 8, fontSize: 12, color: "var(--color-text-tertiary)" }}>
 {results.best.waste} leftover squares: make mug rugs, add to scrap bin, or use for quilt label.
 </div>
 )}
 </div>
 )}

 {/* === WITH BACKGROUND === */}
 {project === "background" && results.bgBest && (
 <div className={`calculator-results ${styles.results}`}>
 <div className="result-card">
 <div className="result-value">{results.bgBest.cols} × {results.bgBest.rows} = {results.bgBest.used} squares</div>
 <div className="result-label">{results.bgBest.w}&quot; × {results.bgBest.h}&quot; finished • {totalSq} charm + {totalSq} background</div>
 </div>
 <div className={styles.resultDetails} style={{ marginTop: 10 }}>
 <div className={styles.resultRow}><span>Charm squares</span><strong>{totalSq}</strong></div>
 <div className={styles.resultRow}><span>Background squares (5&quot;)</span><strong>{results.bgSqNeeded}</strong></div>
 <div className={styles.resultRow}><span>Total squares</span><strong>{results.bgTotal}</strong></div>
 <div className={styles.resultRow}><span>Best layout</span><strong>{results.bgBest.cols} × {results.bgBest.rows}</strong></div>
 <div className={styles.resultRow}><span>Finished quilt size</span><strong>{results.bgBest.w}&quot; × {results.bgBest.h}&quot;</strong></div>
 </div>
 {/* bg fabric calc */}
 <div style={{ marginTop: 10, padding: 12, background: "hsl(200,40%,95%)", borderRadius: "var(--radius-md)", fontSize: 13, lineHeight: 1.8 }}>
 <strong>Background Fabric Needed:</strong>
 <div>{results.bgSqNeeded} squares at 5&quot; × 5&quot;</div>
 <div>Squares per WOF strip: {results.bgPerStrip}</div>
 <div>Strips needed: {results.bgStrips} × 5&quot; = {results.bgStrips * 5}&quot;</div>
 <div>Buy: <strong>{toFrac(results.bgBuy)} yards</strong>of background fabric</div>
 </div>
 {results.bgLayouts.length >1 && (
 <div style={{ marginTop: 12 }}>
 <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>All Layout Options (with background)</div>
 <div className={styles.tableWrap}>
 <table className={styles.convTable}>
 <thead><tr><th>Layout</th><th>Squares</th><th>Finished Size</th><th>Leftover</th></tr></thead>
 <tbody>
 {results.bgLayouts.map((l, i) =>(
 <tr key={i} style={i === 0 ? { background: "hsl(150,40%,95%)" } : undefined}>
 <td>{l.cols} × {l.rows}</td>
 <td>{l.used}</td>
 <td style={{ fontWeight: 600 }}>{l.w}&quot; × {l.h}&quot;</td>
 <td>{l.waste}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )}
 </div>
 )}

 {/* === HST / PINWHEEL === */}
 {project === "hst" && (
 <div className={`calculator-results ${styles.results}`}>
 <div className="result-card">
 <div className="result-value">{results.hstCount} HSTs at 4&quot; finished</div>
 <div className="result-label">From {results.hstPairs} pairs → {results.pinwheelBlocks} pinwheel blocks at 8&quot;</div>
 </div>
 <div className={styles.resultDetails} style={{ marginTop: 10 }}>
 <div className={styles.resultRow}><span>Charm squares used</span><strong>{totalSq} (pair light + dark)</strong></div>
 <div className={styles.resultRow}><span>Pairs (2&#8209;at&#8209;a&#8209;time method)</span><strong>{results.hstPairs} pairs</strong></div>
 <div className={styles.resultRow}><span>HSTs produced</span><strong>{results.hstCount} HSTs</strong></div>
 <div className={styles.resultRow}><span>HST finished size</span><strong>4&quot; (trim from ~4⅛&quot;)</strong></div>
 <div className={styles.resultRow}><span>Pinwheel blocks (4 HSTs each)</span><strong>{results.pinwheelBlocks} blocks ({results.hstCount % 4 >0 ? `${results.hstCount % 4} leftover HSTs` : "none leftover"})</strong></div>
 <div className={styles.resultRow}><span>Pinwheel block size</span><strong>8&quot; finished</strong></div>
 </div>
 {results.hstLayouts.length >0 && (
 <div style={{ marginTop: 12 }}>
 <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>HST Quilt Layouts (individual HSTs at 4&quot;)</div>
 <div className={styles.tableWrap}>
 <table className={styles.convTable}>
 <thead><tr><th>Layout</th><th>HSTs</th><th>Finished Size</th><th>Leftover</th></tr></thead>
 <tbody>
 {results.hstLayouts.slice(0, 5).map((l, i) =>(
 <tr key={i} style={i === 0 ? { background: "hsl(150,40%,95%)" } : undefined}>
 <td>{l.cols} × {l.rows}</td><td>{l.used}</td>
 <td style={{ fontWeight: 600 }}>{l.w}&quot; × {l.h}&quot;</td><td>{l.waste}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )}
 {results.pinwheelLayouts.length >0 && (
 <div style={{ marginTop: 12 }}>
 <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Pinwheel Block Layouts (8&quot; blocks)</div>
 <div className={styles.tableWrap}>
 <table className={styles.convTable}>
 <thead><tr><th>Layout</th><th>Blocks</th><th>Finished Size</th><th>Leftover</th></tr></thead>
 <tbody>
 {results.pinwheelLayouts.slice(0, 5).map((l, i) =>(
 <tr key={i} style={i === 0 ? { background: "hsl(150,40%,95%)" } : undefined}>
 <td>{l.cols} × {l.rows}</td><td>{l.used}</td>
 <td style={{ fontWeight: 600 }}>{l.w}&quot; × {l.h}&quot;</td><td>{l.waste}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )}
 <div style={{ marginTop: 8, fontSize: 12, color: "var(--color-text-tertiary)" }}>
 <Info size={12} style={{ display: "inline", marginRight: 4 }} />HST cutting: draw diagonal line on lighter square, sew ¼&quot; on each side, cut on line, press, trim to 4½&quot; unfinished.
 </div>
 </div>
 )}

 {/* === FOUR-PATCH === */}
 {project === "fourpatch" && (
 <div className={`calculator-results ${styles.results}`}>
 <div className="result-card">
 <div className="result-value">{results.fourPatchBlocks} four-patch blocks</div>
 <div className="result-label">Each 4&quot; finished • from {results.subCutSq} sub-cut 2½&quot; squares</div>
 </div>
 <div className={styles.resultDetails} style={{ marginTop: 10 }}>
 <div className={styles.resultRow}><span>Charm squares</span><strong>{totalSq}</strong></div>
 <div className={styles.resultRow}><span>Sub-cut per charm (2½&quot;)</span><strong>4 squares each</strong></div>
 <div className={styles.resultRow}><span>Total 2½&quot; squares</span><strong>{results.subCutSq}</strong></div>
 <div className={styles.resultRow}><span>Four-patch blocks (4 sq each)</span><strong>{results.fourPatchBlocks} blocks</strong></div>
 <div className={styles.resultRow}><span>Four-patch finished size</span><strong>4&quot; × 4&quot;</strong></div>
 </div>
 <div style={{ marginTop: 6, fontSize: 12, color: "var(--color-text-tertiary)" }}>Nine-patch option: {results.subCutSq} squares ÷ 9 = {Math.floor(results.subCutSq / 9)} nine-patch blocks at 6&quot; finished ({results.subCutSq % 9 >0 ? `${results.subCutSq % 9} leftover squares` : "none leftover"})
 </div>
 {results.fpLayouts.length >0 && (
 <div style={{ marginTop: 12 }}>
 <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Four-Patch Layouts (4&quot; blocks)</div>
 <div className={styles.tableWrap}>
 <table className={styles.convTable}>
 <thead><tr><th>Layout</th><th>Blocks</th><th>Finished Size</th><th>Leftover</th></tr></thead>
 <tbody>
 {results.fpLayouts.slice(0, 5).map((l, i) =>(
 <tr key={i} style={i === 0 ? { background: "hsl(150,40%,95%)" } : undefined}>
 <td>{l.cols} × {l.rows}</td><td>{l.used}</td>
 <td style={{ fontWeight: 600 }}>{l.w}&quot; × {l.h}&quot;</td><td>{l.waste}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )}
 </div>
 )}

 {/* Toolbar */}
 <div className="toolbar" style={{ marginBottom: 16 }}>
 <button className="btn btn-secondary btn-sm" onClick={() =>navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} />Copy</button>
 <button className="btn btn-secondary btn-sm" onClick={() =>window.print()}><Printer size={13} />Print</button>
 </div>
 </>)}

 {/* PACKS FOR STANDARD SIZES */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
 onClick={() =>setShowRef(!showRef)}>Charm Packs Needed for Standard Quilt Sizes <ChevronDown size={14} style={{ transform: showRef ? "rotate(180deg)" : "none", transition: "0.2s" }} />
 </button>
 {showRef && (
 <div style={{ marginTop: 10 }}>
 <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 6 }}>Simple grid, {FINISHED}&quot; finished squares, {sqPerPack} sq/pack</div>
 <div className={styles.tableWrap}>
 <table className={styles.convTable}>
 <thead><tr><th>Quilt Size</th><th>Layout</th><th>Squares</th><th>Packs</th><th>Leftover</th></tr></thead>
 <tbody>
 {packsRef.map((s, i) =>(
 <tr key={i}>
 <td>{s.label} ({s.w}&quot;×{s.h}&quot;)</td>
 <td>{s.cols}×{s.rows}</td>
 <td>{s.needed}</td>
 <td style={{ fontWeight: 600 }}>{s.packsNeeded}</td>
 <td>{s.leftover}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 6 }}>Adding background fabric halves the charm packs needed!</div>
 </div>
 )}
 </div>

 {/* EDUCATIONAL */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
 onClick={() =>setShowEdu(!showEdu)}>The 5&quot; to 4½&quot; Mystery — Why Charm Squares Shrink <ChevronDown size={14} style={{ transform: showEdu ? "rotate(180deg)" : "none", transition: "0.2s" }} />
 </button>
 {showEdu && (
 <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
 <p style={{ marginBottom: 8 }}>Each charm square is <strong>5&quot; × 5&quot; as cut</strong>. When sewn with a standard ¼&quot; seam, each side that joins another piece loses ¼&quot;. A square has 2 joining sides (left/right or top/bottom), so:</p>
 <div style={{ background: "hsl(150,40%,95%)", padding: 10, borderRadius: "var(--radius-md)", fontFamily: "var(--font-mono, monospace)", fontSize: 13, marginBottom: 10 }}>
 5&quot; − ¼&quot; (left seam) − ¼&quot; (right seam) = <strong>4½&quot; finished</strong>
 </div>
 <p style={{ marginBottom: 8 }}>So a 6×7 grid of charm squares finishes at: <strong>6 × 4½&quot; = 27&quot;</strong>wide, <strong>7 × 4½&quot; = 31½&quot;</strong>tall.</p>
 <h4 style={{ fontWeight: 600, marginTop: 12, color: "var(--color-text-primary)" }}>Getting the Most From One Pack</h4>
 <ul style={{ paddingLeft: 20, marginTop: 6 }}>
 <li>Add background fabric to double your quilt size</li>
 <li>Table runners use few squares for impressive results</li>
 <li>One pack makes 4-5 mug rugs as gifts</li>
 <li>Save leftover squares in a labeled bag—when you collect 42+, you have a &quot;virtual charm pack&quot;!</li>
 </ul>
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
 <div>Finished = 5&quot; − ½&quot; = 4½&quot;</div>
 <div>Quilt W = Cols × 4.5</div>
 <div>Quilt H = Rows × 4.5</div>
 </div>
 </div>
 <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
 <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Quick Answer</h4>
 <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.8 }}>
 <div>1 pack → <strong>27×31½&quot;</strong>baby</div>
 <div>2 packs → <strong>36×45&quot;</strong>baby/lap</div>
 <div>4 packs → <strong>54×63&quot;</strong>throw</div>
 <div>9 packs → <strong>81×94½&quot;</strong>queen</div>
 <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 4 }}>Simple grid, 42 sq/pack</div>
 </div>
 </div>
 <div className="glass-card related-tools">
 <h4>Related Tools</h4>
 <a href="/quilt/block-size-calculator" className="related-tool-link">Block Size Calculator</a>
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