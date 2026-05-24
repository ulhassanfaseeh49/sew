"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, ChevronDown } from "lucide-react";

/* ─── helpers ──────────────────────────────────── */
function toFrac(v: number): string {
 const w = Math.floor(v);
 const r = v - w;
 const m: [number, string][] = [[0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
 for (const [t, s] of m) if (Math.abs(r - t) < 0.02) return w >0 ? `${w}${s}` : s;
 if (r < 0.05) return `${w || "0"}`;
 return v.toFixed(2);
}
const roundN = (v: number, d = 2) =>Math.round(v * 10 ** d) / 10 ** d;
const ceilQ = (v: number, q = 0.25) =>Math.ceil(v / q) * q;

/* ─── constants ──────────────────────────────────── */
const SIZE_PRESETS = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 8, 10];
type Mode = "finToCut" | "cutToFin" | "fabricYield" | "yardage";

const BLOCK_TYPES = [
 { name: "Pinwheel", hsts: 4 },
 { name: "Ohio Star", hsts: 8 },
 { name: "Sawtooth Star", hsts: 8 },
 { name: "Bear Paw", hsts: 4 },
 { name: "Shoofly", hsts: 4 },
 { name: "Friendship Star", hsts: 8 },
 { name: "Churn Dash", hsts: 4 },
 { name: "Broken Dishes", hsts: 4 },
];

/* Reference table: spec lines 544-554 */
const REF_TABLE = [
 { fin: 1, unfin: 1.5, two: 1.875, four: 2.25, eight: 3.5 },
 { fin: 1.5, unfin: 2, two: 2.375, four: 2.75, eight: 4.5 },
 { fin: 2, unfin: 2.5, two: 2.875, four: 3.25, eight: 5.5 },
 { fin: 2.5, unfin: 3, two: 3.375, four: 3.75, eight: 6.5 },
 { fin: 3, unfin: 3.5, two: 3.875, four: 4.25, eight: 7.5 },
 { fin: 3.5, unfin: 4, two: 4.375, four: 4.75, eight: 8.5 },
 { fin: 4, unfin: 4.5, two: 4.875, four: 5.25, eight: 9.5 },
 { fin: 4.5, unfin: 5, two: 5.375, four: 5.75, eight: 10.5 },
 { fin: 5, unfin: 5.5, two: 5.875, four: 6.25, eight: 11.5 },
 { fin: 6, unfin: 6.5, two: 6.875, four: 7.25, eight: 13.5 },
];

/* ─── component ──────────────────────────────────── */
export default function Page() {
 const [mode, setMode] = useState<Mode>("finToCut");
 const [finSize, setFinSize] = useState(3);
 const [cutInput, setCutInput] = useState(3.875);
 const [fabricW, setFabricW] = useState(42);
 const [fabricH, setFabricH] = useState(18);
 const [hstCount, setHstCount] = useState(100);
 const [activeFaq, setActiveFaq] = useState<number | null>(null);
 const [showRef, setShowRef] = useState(false);
 const [showCompare, setShowCompare] = useState(false);
 const [showSteps, setShowSteps] = useState(false);
 const [showWhy, setShowWhy] = useState(false);
 const [showBlocks, setShowBlocks] = useState(false);
 const [showPrecut, setShowPrecut] = useState(false);
 const [oversize, setOversize] = useState(0);

 /* ─── core math ─── */
 const calc = useMemo(() =>{
 const fin = mode === "cutToFin" ? cutInput - 0.875 : finSize;
 const unfinished = fin + 0.5;

 // Method formulas (spec lines 115, 140, 167, 196)
 const cut2 = fin + 0.875 + oversize; // 2-at-a-time
 const cut4 = fin + 1.25 + oversize; // 4-at-a-time
 const cut8 = fin * 2 + 1.5 + oversize; // 8-at-a-time
 const cutSF = fin + 0.5; // stitch & flip

 // Yield from fabric (Mode C)
 const usableW = fabricW;
 // 2-at-a-time
 const sqPerRow2 = Math.floor(usableW / cut2);
 const rows2 = Math.floor(fabricH / cut2);
 const pairsFromFab2 = Math.floor((sqPerRow2 * rows2) / 1); // each fabric gives squares, need pairs
 const hstsFromFab2 = pairsFromFab2 * 2;
 // 4-at-a-time
 const sqPerRow4 = Math.floor(usableW / cut4);
 const rows4 = Math.floor(fabricH / cut4);
 const pairsFromFab4 = sqPerRow4 * rows4;
 const hstsFromFab4 = pairsFromFab4 * 4;
 // 8-at-a-time
 const sqPerRow8 = Math.floor(usableW / cut8);
 const rows8 = Math.floor(fabricH / cut8);
 const pairsFromFab8 = sqPerRow8 * rows8;
 const hstsFromFab8 = pairsFromFab8 * 8;

 // Yardage for N HSTs (Mode D) — how many strips of fabric from WOF=42
 const wof = 42;
 const calcYardage = (cutSz: number, yield_per_pair: number) =>{
 const sqPerStrip = Math.floor(wof / cutSz);
 if (sqPerStrip <= 0) return { strips: 0, inches: 0, yards: 0, buy: 0 };
 const pairsNeeded = Math.ceil(hstCount / yield_per_pair);
 const strips = Math.ceil(pairsNeeded / sqPerStrip);
 const inches = strips * cutSz;
 const yards = roundN(inches / 36, 2);
 const buy = ceilQ(yards + 0.1);
 return { strips, inches: roundN(inches, 1), yards, buy };
 };
 const yd2 = calcYardage(cut2, 2);
 const yd4 = calcYardage(cut4, 4);
 const yd8 = calcYardage(cut8, 8);

 // Pre-cut yields
 const charmFin = 5 - 0.875; // 4.125 → trim to 4"
 const layerFin = 10 - 0.875; // 9.125 → trim to 9"
 const jellyFin = 2.5 - 0.875; // 1.625 → trim to 1.5"

 return {
 fin: roundN(fin), unfinished: roundN(unfinished),
 cut2: roundN(cut2, 3), cut4: roundN(cut4, 3), cut8: roundN(cut8, 3), cutSF: roundN(cutSF, 3),
 hstsFromFab2, hstsFromFab4, hstsFromFab8,
 yd2, yd4, yd8,
 charmFin: roundN(charmFin, 3), layerFin: roundN(layerFin, 3), jellyFin: roundN(jellyFin, 3),
 };
 }, [mode, finSize, cutInput, fabricW, fabricH, hstCount, oversize]);

 /* ─── SVG diagram ─── */
 const svgDiagram = useMemo(() =>{
 const s = 70;
 return (
 <svg viewBox="0 0 220 80" style={{ width: "100%", maxWidth: 300 }}>
 {/* Light square */}
 <rect x={10} y={5} width={s} height={s} fill="hsl(45,40%,92%)" stroke="hsl(45,40%,70%)" strokeWidth={0.8} />
 <text x={10 + s / 2} y={s + 15} textAnchor="middle" fontSize={7} fill="hsl(45,40%,50%)">Light</text>
 {/* Dark square */}
 <rect x={90} y={5} width={s} height={s} fill="hsl(220,30%,75%)" stroke="hsl(220,40%,55%)" strokeWidth={0.8} />
 <text x={90 + s / 2} y={s + 15} textAnchor="middle" fontSize={7} fill="hsl(220,40%,40%)">Dark</text>
 {/* Arrow */}
 <text x={82} y={38} fontSize={12} fill="var(--color-text-tertiary)">→</text>
 {/* Result HSTs */}
 <g transform="translate(170, 5)">
 <polygon points="0,0 35,0 0,35" fill="hsl(45,40%,92%)" stroke="hsl(0,0%,70%)" strokeWidth={0.5} />
 <polygon points="35,0 35,35 0,35" fill="hsl(220,30%,75%)" stroke="hsl(0,0%,70%)" strokeWidth={0.5} />
 <line x1={0} y1={0} x2={35} y2={35} stroke="hsl(0,0%,50%)" strokeWidth={0.5} />
 </g>
 <g transform="translate(170, 42)">
 <polygon points="0,0 35,0 0,35" fill="hsl(220,30%,75%)" stroke="hsl(0,0%,70%)" strokeWidth={0.5} />
 <polygon points="35,0 35,35 0,35" fill="hsl(45,40%,92%)" stroke="hsl(0,0%,70%)" strokeWidth={0.5} />
 <line x1={0} y1={0} x2={35} y2={35} stroke="hsl(0,0%,50%)" strokeWidth={0.5} />
 </g>
 <text x={188} y={s + 15} textAnchor="middle" fontSize={7} fill="hsl(150,50%,40%)">= 2 HSTs</text>
 </svg>
 );
 }, []);

 const activeFin = mode === "cutToFin" ? calc.fin : finSize;

 /* ─── copy text ─── */
 const copyText = `HST Calculator: ${toFrac(activeFin)}" finished HSTs. 2-at-a-time: cut ${toFrac(calc.cut2)}" squares (yields 2). 4-at-a-time: cut ${toFrac(calc.cut4)}" (yields 4). 8-at-a-time: cut ${toFrac(calc.cut8)}" (yields 8). Unfinished: ${toFrac(calc.unfinished)}". For ${hstCount} HSTs (2-at-a-time): buy ${toFrac(calc.yd2.buy)} yd each fabric.`;

 /* ─── FAQ ─── */
 const faqItems = [
 { q: `What size squares do I cut for ${toFrac(activeFin)}" finished HSTs?`, a: `For ${toFrac(activeFin)}" finished HSTs using the 2-at-a-time method: cut squares at ${toFrac(calc.cut2)}" (finished + ⅞"). For 4-at-a-time: cut at ${toFrac(calc.cut4)}" (finished + 1¼"). For 8-at-a-time: cut at ${toFrac(calc.cut8)}" (finished × 2 + 1½").` },
 { q: "What is the formula for cutting HSTs?", a: `2-at-a-time: cut = finished + ⅞" (0.875"). 4-at-a-time: cut = finished + 1¼" (1.25"). 8-at-a-time: cut = finished × 2 + 1½" (1.5"). Stitch & flip: cut = finished + ½". The ⅞" accounts for ¼" seam allowance on both sides plus diagonal geometry.` },
 { q: "What is the difference between 2-at-a-time and 4-at-a-time HSTs?", a: "2-at-a-time: draw one diagonal, sew ¼\" each side, cut apart = 2 HSTs. 4-at-a-time: draw BOTH diagonals (X), sew ¼\" each side of both lines, cut apart on both lines = 4 HSTs. The 4-at-a-time uses slightly larger squares but is more efficient." },
 { q: "How do I make 8 HSTs at once?", a: `8-at-a-time: cut two large squares (${toFrac(calc.cut8)}" for ${toFrac(activeFin)}" finished). Sew around the entire perimeter with ¼" seam. Cut apart with two diagonal cuts (X). Open each triangle, then cut each in half diagonally. Press open = 8 HSTs.` },
 { q: "Why does the HST formula add ⅞ inch?", a: "The ⅞\" (0.875\") accounts for: ¼\" seam allowance × 2 sides = 0.5\" baseline, plus approximately 0.375\" for the diagonal geometry. When you sew diagonally across a square, the seam takes more fabric than a straight seam due to the angle. The total: 0.5\" + 0.375\" = 0.875\" = ⅞\"." },
 { q: "How many HSTs can I make from a fat quarter?", a: `From a fat quarter (18"×22") for ${toFrac(activeFin)}" finished HSTs: 2-at-a-time yields ~${calc.hstsFromFab2} HSTs, 4-at-a-time yields ~${calc.hstsFromFab4} HSTs. Use 2-at-a-time for scrappy quilts, 4-at-a-time for planned two-color quilts.` },
 { q: "How do I trim HSTs to size?", a: `After pressing, trim to ${toFrac(calc.unfinished)}" square (unfinished size). Align the diagonal seam with the 45° line on your square ruler. Trim two sides, rotate 180°, trim the remaining two sides. This ensures perfectly square HSTs that finish at exactly ${toFrac(activeFin)}".` },
 { q: `What size do I cut for a ${toFrac(activeFin)}" finished HST?`, a: `For ${toFrac(activeFin)}" finished HSTs: 2-at-a-time = ${toFrac(calc.cut2)}" squares. 4-at-a-time = ${toFrac(calc.cut4)}" squares. 8-at-a-time = ${toFrac(calc.cut8)}" squares. The unfinished (before final seaming into a block) size is ${toFrac(calc.unfinished)}".` },
 { q: "How do I fix HSTs that are the wrong size?", a: "If too small: your seam allowance is too wide. Check with a ruler — even 1/16\" extra per seam compounds. If too big: trim down to the correct unfinished size. For consistent results: always test-sew one pair first and measure before cutting all your fabric." },
 { q: "Should I press HSTs open or to one side?", a: "Press toward dark: easiest, no seam show-through, creates seam nesting. Press open: flattest result, best for dense quilting, but bias edges are less stable. Press toward light: when specific seam nesting is required. For most projects, pressing toward dark is recommended." },
 { q: "What is the easiest HST method for beginners?", a: "The 2-at-a-time method is best for beginners. It's the simplest to understand, uses the most straightforward formula (finished + ⅞\"), and gives accurate results with just one diagonal seam. Start here, then graduate to 4-at-a-time or 8-at-a-time for efficiency." },
 { q: "What HST size from charm squares (5\")?", a: `5" charm squares yield HSTs at 4.125" finished (5 - 0.875 = 4.125"). Trim to 4" finished. Each pair of charm squares gives 2 HSTs using the 2-at-a-time method. A 42-piece charm pack gives 42 HSTs at 4" finished.` },
 ];

 return (
 <div className="container">
 <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "HST Calculator" }]} />
 <div className="calculator-layout">
 <div className="calculator-main">
 {/* HEADER */}
 <div className={styles.toolHeader}>
 <span className="category-badge">◣ Quilt #146</span>
 <h1>Half-Square Triangle (HST) Calculator</h1>
 <p>Calculate precise cutting sizes for half-square triangles using all construction methods — 2-at-a-time, 4-at-a-time, and 8-at-a-time. Compare efficiency, calculate yardage, and get step-by-step instructions for any finished HST size.</p>
 </div>

 {/* ① MODE SELECTION */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>① Calculation Mode</h2>
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
 {([
 ["finToCut", "Finished → Cut Size", "I know my desired finished size"],
 ["cutToFin", "Cut → Finished Size", "I know what I cut — what's the finished?"],
 ["fabricYield", "Fabric → HST Count", "How many HSTs from this fabric?"],
 ["yardage", "HST Count → Yardage", "How much fabric for this many HSTs?"],
 ] as [Mode, string, string][]).map(([m, title, desc]) =>(
 <button key={m} className={`btn btn-sm ${mode === m ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setMode(m)} style={{ textAlign: "left", padding: "8px 10px" }}>
 <div style={{ fontWeight: 600, fontSize: 12 }}>{title}</div>
 <div style={{ fontSize: 10, opacity: 0.7 }}>{desc}</div>
 </button>
 ))}
 </div>
 </div>

 {/* ② SIZE INPUT */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>
 {mode === "cutToFin" ? "② Enter Cut Square Size" : "② Finished HST Size"}
 </h2>
 {mode !== "cutToFin" && (
 <>
 <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 6 }}>The finished HST is the square measurement AFTER sewing into a block.
 </div>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
 {SIZE_PRESETS.map(s =>(
 <button key={s} className={`btn btn-sm ${finSize === s ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setFinSize(s)}>{toFrac(s)}&quot;</button>
 ))}
 </div>
 <div className="input-group">
 <input type="number" className="input-field" value={finSize} onChange={e =>setFinSize(parseFloat(e.target.value) || 1)} min={0.5} max={24} step={0.25} />
 </div>
 </>
 )}
 {mode === "cutToFin" && (
 <div className="input-group">
 <label className="input-label">Cut square size (inches)</label>
 <input type="number" className="input-field" value={cutInput} onChange={e =>setCutInput(parseFloat(e.target.value) || 1)} min={1} max={24} step={0.125} />
 <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 4 }}>Finished = cut − ⅞&quot; = {toFrac(calc.fin)}&quot;
 </div>
 </div>
 )}
 </div>

 {/* ② EXTRA: Fabric dims for yield mode */}
 {mode === "fabricYield" && (
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>Fabric Dimensions</h2>
 <div className="calculator-form-row">
 <div className="input-group">
 <label className="input-label">Width (inches)</label>
 <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
 {[{ v: 22, l: "FQ 22\"" }, { v: 42, l: "WOF 42\"" }, { v: 44, l: "WOF 44\"" }].map(p =>(
 <button key={p.v} className={`btn btn-sm ${fabricW === p.v ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setFabricW(p.v)}>{p.l}</button>
 ))}
 </div>
 <input type="number" className="input-field" value={fabricW} onChange={e =>setFabricW(parseFloat(e.target.value) || 22)} min={5} max={108} />
 </div>
 <div className="input-group">
 <label className="input-label">Height (inches)</label>
 <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
 {[{ v: 9, l: "¼ yd" }, { v: 18, l: "FQ/½ yd" }, { v: 36, l: "1 yd" }].map(p =>(
 <button key={p.v} className={`btn btn-sm ${fabricH === p.v ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setFabricH(p.v)}>{p.l}</button>
 ))}
 </div>
 <input type="number" className="input-field" value={fabricH} onChange={e =>setFabricH(parseFloat(e.target.value) || 9)} min={3} max={144} />
 </div>
 </div>
 </div>
 )}

 {/* ② EXTRA: HST count for yardage mode */}
 {mode === "yardage" && (
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>How Many HSTs?</h2>
 <div className="input-group">
 <input type="number" className="input-field" value={hstCount} onChange={e =>setHstCount(parseInt(e.target.value) || 1)} min={1} max={5000} />
 </div>
 <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 4 }}>Or choose a block type:
 </div>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
 {BLOCK_TYPES.map(b =>(
 <button key={b.name} className="btn btn-sm btn-secondary" style={{ fontSize: 10 }}
 onClick={() =>setHstCount(b.hsts)}>
 {b.name} ({b.hsts})
 </button>
 ))}
 </div>
 </div>
 )}

 {/* Oversize option */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>③ Trimming Preference</h2>
 <div style={{ display: "flex", gap: 4 }}>
 {[
 { v: 0, l: "No oversize (trust formula)" },
 { v: 0.25, l: "+¼\" oversize (recommended)" },
 { v: 0.5, l: "+½\" generous" },
 ].map(o =>(
 <button key={o.v} className={`btn btn-sm ${oversize === o.v ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setOversize(o.v)} style={{ fontSize: 11 }}>{o.l}</button>
 ))}
 </div>
 {oversize >0 && (
 <div style={{ fontSize: 11, marginTop: 4, color: "var(--color-text-tertiary)" }}>Cut sizes include +{toFrac(oversize)}&quot; oversize. Trim to {toFrac(calc.unfinished)}&quot; unfinished after sewing.
 </div>
 )}
 </div>

 {/* ═══ PRIMARY RESULTS ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(150,60%,40%)" }}>
 <h2 className={styles.calcTitle}>All Methods — {toFrac(activeFin)}&quot; Finished HSTs</h2>
 <div style={{ textAlign: "center", marginBottom: 10 }}>{svgDiagram}</div>

 <div style={{ overflowX: "auto" }}>
 <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
 <thead><tr style={{ borderBottom: "2px solid hsl(0,0%,85%)" }}>
 <th style={{ textAlign: "left", padding: "6px 4px" }}>Method</th>
 <th style={{ textAlign: "right", padding: "6px 4px" }}>Cut Size</th>
 <th style={{ textAlign: "right", padding: "6px 4px" }}>Yield/Pair</th>
 <th style={{ textAlign: "left", padding: "6px 4px" }}>Notes</th>
 </tr></thead>
 <tbody>
 {[
 { name: "2-at-a-time", cut: calc.cut2, yld: 2, note: "Most common, easiest" },
 { name: "4-at-a-time", cut: calc.cut4, yld: 4, note: "More efficient" },
 { name: "8-at-a-time", cut: calc.cut8, yld: 8, note: "Best for big batches" },
 { name: "Stitch & flip", cut: calc.cutSF, yld: 1, note: "Corner triangles only" },
 ].map((m, i) =>(
 <tr key={i} style={{ borderBottom: "1px solid hsl(0,0%,92%)", background: i === 0 ? "hsl(150,30%,97%)" : undefined }}>
 <td style={{ padding: "5px 4px", fontWeight: i === 0 ? 700 : 400 }}>{m.name}</td>
 <td style={{ textAlign: "right", padding: "5px 4px", fontWeight: 700, fontFamily: "monospace" }}>{toFrac(m.cut)}&quot;</td>
 <td style={{ textAlign: "right", padding: "5px 4px" }}>{m.yld} HST{m.yld >1 ? "s" : ""}</td>
 <td style={{ padding: "5px 4px", fontSize: 11, color: "var(--color-text-tertiary)" }}>{m.note}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>

 <div style={{ marginTop: 8, padding: 8, background: "hsl(200,15%,97%)", borderRadius: 6, fontSize: 12, lineHeight: 1.8 }}>
 <div>Unfinished HST: <strong>{toFrac(calc.unfinished)}&quot; × {toFrac(calc.unfinished)}&quot;</strong>(trim to this before block assembly)</div>
 <div>Finished HST: <strong>{toFrac(activeFin)}&quot; × {toFrac(activeFin)}&quot;</strong>(after ¼&quot; seams on all sides)</div>
 </div>
 </div>

 {/* ═══ FABRIC YIELD RESULTS ═══ */}
 {mode === "fabricYield" && (
 <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(40,70%,50%)" }}>
 <h2 className={styles.calcTitle}>HSTs from {fabricW}&quot; × {fabricH}&quot; Fabric</h2>
 {[
 { name: "2-at-a-time", cut: calc.cut2, hsts: calc.hstsFromFab2, color: "hsl(150,15%,97%)" },
 { name: "4-at-a-time", cut: calc.cut4, hsts: calc.hstsFromFab4, color: "hsl(200,15%,97%)" },
 { name: "8-at-a-time", cut: calc.cut8, hsts: calc.hstsFromFab8, color: "hsl(280,15%,97%)" },
 ].map((m, i) =>(
 <div key={i} style={{ padding: 8, background: m.color, borderRadius: 6, marginBottom: 4, fontSize: 13, lineHeight: 1.7 }}>
 <strong>{m.name}</strong>: cut at {toFrac(m.cut)}&quot; → <strong>{m.hsts} HSTs</strong>at {toFrac(activeFin)}&quot; finished
 </div>
 ))}
 <div style={{ fontSize: 10, marginTop: 4, color: "var(--color-text-tertiary)" }}>Yield from ONE piece of each fabric. You need matching squares from both light and dark.
 </div>
 </div>
 )}

 {/* ═══ YARDAGE RESULTS ═══ */}
 {mode === "yardage" && (
 <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(280,50%,55%)" }}>
 <h2 className={styles.calcTitle}>Yardage for {hstCount} HSTs at {toFrac(activeFin)}&quot;</h2>
 {[
 { name: "2-at-a-time", yd: calc.yd2, cut: calc.cut2, per: 2, color: "hsl(150,15%,97%)" },
 { name: "4-at-a-time", yd: calc.yd4, cut: calc.cut4, per: 4, color: "hsl(200,15%,97%)" },
 { name: "8-at-a-time", yd: calc.yd8, cut: calc.cut8, per: 8, color: "hsl(280,15%,97%)" },
 ].map((m, i) =>(
 <div key={i} style={{ padding: 8, background: m.color, borderRadius: 6, marginBottom: 4, fontSize: 13, lineHeight: 1.7 }}>
 <strong>{m.name}</strong>: cut {toFrac(m.cut)}&quot; squares → {m.yd.strips} strips → <strong>buy {toFrac(m.yd.buy)} yd</strong>(each fabric)
 </div>
 ))}
 <div style={{ marginTop: 6, padding: 8, background: "hsl(45,30%,96%)", borderRadius: 6, fontSize: 12, fontWeight: 600 }}>Total (both fabrics, 2-at-a-time): {toFrac(calc.yd2.buy * 2)} yards
 </div>
 </div>
 )}

 {/* Toolbar */}
 <div className="toolbar" style={{ marginBottom: 16 }}>
 <button className="btn btn-secondary btn-sm" onClick={() =>navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} />Copy</button>
 <button className="btn btn-secondary btn-sm" onClick={() =>window.print()}><Printer size={13} />Print</button>
 </div>

 {/* ═══ REFERENCE TABLE ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
 onClick={() =>setShowRef(!showRef)}>HST Size Reference Chart
 <ChevronDown size={14} style={{ transform: showRef ? "rotate(180deg)" : "none", transition: "0.2s" }} />
 </button>
 {showRef && (
 <div style={{ marginTop: 10, overflowX: "auto" }}>
 <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}>
 <thead><tr style={{ borderBottom: "2px solid hsl(0,0%,85%)" }}>
 <th style={{ textAlign: "left", padding: "5px 3px" }}>Finished</th>
 <th style={{ textAlign: "right", padding: "5px 3px" }}>Unfin.</th>
 <th style={{ textAlign: "right", padding: "5px 3px" }}>2-at-a-time</th>
 <th style={{ textAlign: "right", padding: "5px 3px" }}>4-at-a-time</th>
 <th style={{ textAlign: "right", padding: "5px 3px" }}>8-at-a-time</th>
 </tr></thead>
 <tbody>
 {REF_TABLE.map((r, i) =>{
 const isCurrent = Math.abs(r.fin - activeFin) < 0.01;
 return (
 <tr key={i} style={{ background: isCurrent ? "hsl(150,40%,95%)" : undefined, borderBottom: "1px solid hsl(0,0%,92%)", cursor: "pointer" }}
 onClick={() =>{ setFinSize(r.fin); setMode("finToCut"); }}>
 <td style={{ padding: "4px 3px", fontWeight: isCurrent ? 700 : 400 }}>{toFrac(r.fin)}&quot;</td>
 <td style={{ textAlign: "right", padding: "4px 3px" }}>{toFrac(r.unfin)}&quot;</td>
 <td style={{ textAlign: "right", padding: "4px 3px", fontWeight: 600 }}>{toFrac(r.two)}&quot;</td>
 <td style={{ textAlign: "right", padding: "4px 3px" }}>{toFrac(r.four)}&quot;</td>
 <td style={{ textAlign: "right", padding: "4px 3px" }}>{toFrac(r.eight)}&quot;</td>
 </tr>
 );
 })}
 </tbody>
 </table>
 <div style={{ fontSize: 9, marginTop: 4, color: "var(--color-text-tertiary)" }}>Click any row to fill calculator. Bold = 2-at-a-time (most common).</div>
 </div>
 )}
 </div>

 {/* ═══ METHOD COMPARISON ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
 onClick={() =>setShowCompare(!showCompare)}>Method Efficiency Comparison
 <ChevronDown size={14} style={{ transform: showCompare ? "rotate(180deg)" : "none", transition: "0.2s" }} />
 </button>
 {showCompare && (
 <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.8 }}>
 <div style={{ marginBottom: 6, fontSize: 12, color: "var(--color-text-secondary)" }}>For {hstCount} HSTs at {toFrac(activeFin)}&quot; finished:</div>
 {[
 { name: "2-at-a-time", yd: calc.yd2, waste: "~20%", accuracy: "Best", ease: "Easiest", color: "hsl(150,15%,97%)" },
 { name: "4-at-a-time", yd: calc.yd4, waste: "~15%", accuracy: "Good", ease: "Moderate", color: "hsl(200,15%,97%)" },
 { name: "8-at-a-time", yd: calc.yd8, waste: "~8%", accuracy: "Needs trim", ease: "Complex", color: "hsl(280,15%,97%)" },
 ].map((m, i) =>(
 <div key={i} style={{ padding: 8, background: m.color, borderRadius: 6, marginBottom: 4 }}>
 <strong>{m.name}</strong>: {toFrac(m.yd.buy)} yd each — waste {m.waste} — accuracy: {m.accuracy} — {m.ease}
 </div>
 ))}
 <div style={{ marginTop: 6, fontSize: 11, color: "var(--color-text-tertiary)" }}>Most fabric efficient: 8-at-a-time. Easiest: 2-at-a-time. Best accuracy: 2-at-a-time with trimming.
 </div>
 </div>
 )}
 </div>

 {/* ═══ STEP-BY-STEP ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
 onClick={() =>setShowSteps(!showSteps)}>
 ✂️ Step-by-Step Instructions (All Methods)
 <ChevronDown size={14} style={{ transform: showSteps ? "rotate(180deg)" : "none", transition: "0.2s" }} />
 </button>
 {showSteps && (
 <div style={{ marginTop: 10, fontSize: 12.5, lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
 {[
 {
 title: "2-at-a-time (Yields 2 HSTs)", cut: calc.cut2,
 steps: [
 `Cut one ${toFrac(calc.cut2)}" square from light fabric`,
 `Cut one ${toFrac(calc.cut2)}" square from dark fabric`,
 "Draw a diagonal line on wrong side of LIGHT square",
 "Layer light and dark right sides together",
 "Stitch ¼\" from EACH side of the drawn line (2 stitch lines)",
 "Cut apart ON the drawn diagonal line",
 `Press seams open (or toward dark). Trim to ${toFrac(calc.unfinished)}" square`,
 "Result: 2 identical HSTs ✓",
 ],
 },
 {
 title: "4-at-a-time (Yields 4 HSTs)", cut: calc.cut4,
 steps: [
 `Cut one ${toFrac(calc.cut4)}" square from each fabric`,
 "Draw BOTH diagonals (X shape) on wrong side of light",
 "Layer right sides together",
 "Stitch ¼\" from each side of BOTH diagonal lines (4 stitch lines total)",
 "Cut apart on BOTH diagonal lines",
 `Press and trim each to ${toFrac(calc.unfinished)}" square`,
 "Result: 4 identical HSTs ✓",
 ],
 },
 {
 title: "8-at-a-time (Yields 8 HSTs)", cut: calc.cut8,
 steps: [
 `Cut one ${toFrac(calc.cut8)}" square from each fabric`,
 "Layer right sides together",
 "Sew around the ENTIRE perimeter with ¼\" seam",
 "Cut apart with two diagonal cuts (X through center)",
 "Open each resulting triangle — you have 4 square units",
 "Cut each square unit in half diagonally",
 `Press and trim each to ${toFrac(calc.unfinished)}" square`,
 "Result: 8 identical HSTs ✓",
 ],
 },
 ].map((method, mi) =>(
 <div key={mi} style={{ padding: 10, background: mi % 2 === 0 ? "hsl(0,0%,98%)" : "hsl(200,10%,97%)", borderRadius: 6, marginBottom: 6 }}>
 <div style={{ fontWeight: 700, marginBottom: 4, color: "hsl(150,50%,35%)" }}>{method.title}</div>
 {method.steps.map((s, si) =>(
 <div key={si} style={{ display: "flex", gap: 8, padding: "2px 0" }}>
 <span style={{ fontWeight: 700, color: "hsl(150,60%,40%)", minWidth: 16, textAlign: "right" }}>{si + 1}</span>
 <span>{s}</span>
 </div>
 ))}
 </div>
 ))}
 </div>
 )}
 </div>

 {/* ═══ PRE-CUT FABRIC ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
 onClick={() =>setShowPrecut(!showPrecut)}>HSTs from Pre-Cut Fabrics
 <ChevronDown size={14} style={{ transform: showPrecut ? "rotate(180deg)" : "none", transition: "0.2s" }} />
 </button>
 {showPrecut && (
 <div style={{ marginTop: 10, fontSize: 12.5, lineHeight: 1.8 }}>
 {[
 { name: "Charm Squares (5\")", fin: "4.125\" → trim to 4\"", yld: "2 HSTs per pair", from: "42-piece charm pack = 42 HSTs at 4\"" },
 { name: "Layer Cakes (10\")", fin: "9.125\" → trim to 9\"", yld: "2 HSTs per pair (or sub-cut for smaller)", from: "42-piece layer cake = 42 HSTs at 9\"" },
 { name: "Jelly Roll Strips (2.5\")", fin: "1.625\" → trim to 1.5\"", yld: "Cut strips into 2.5\" squares", from: "~16 squares per strip × 2 = 32 HSTs per strip" },
 ].map((p, i) =>(
 <div key={i} style={{ padding: 8, background: i % 2 === 0 ? "hsl(45,20%,97%)" : "hsl(200,15%,97%)", borderRadius: 6, marginBottom: 4 }}>
 <strong>{p.name}</strong>: finishes at {p.fin}. Yield: {p.yld}. {p.from}
 </div>
 ))}
 </div>
 )}
 </div>

 {/* ═══ WHY 7/8" ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
 onClick={() =>setShowWhy(!showWhy)}>Why the ⅞&quot; Formula Works
 <ChevronDown size={14} style={{ transform: showWhy ? "rotate(180deg)" : "none", transition: "0.2s" }} />
 </button>
 {showWhy && (
 <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.9, color: "var(--color-text-secondary)" }}>
 <div style={{ padding: 10, background: "hsl(200,15%,97%)", borderRadius: 6, fontFamily: "monospace", marginBottom: 6 }}>
 <div><strong>2-at-a-time:</strong>cut = finished + ⅞&quot;</div>
 <div><strong>4-at-a-time:</strong>cut = finished + 1¼&quot;</div>
 <div><strong>8-at-a-time:</strong>cut = finished × 2 + 1½&quot;</div>
 </div>
 <div style={{ fontSize: 12 }}>
 <strong>Why ⅞&quot; (0.875&quot;)?</strong>
 <div>¼&quot; seam × 2 sides = 0.5&quot; baseline</div>
 <div>+ 0.375&quot; for diagonal geometry = <strong>0.875&quot; (⅞&quot;)</strong></div>
 <div style={{ marginTop: 6 }}>When you sew diagonally across a square and press open, more fabric is consumed than a straight seam. The ⅞&quot; precisely accounts for the ¼&quot; seam on each triangle half plus the extra fabric the diagonal angle requires.</div>
 </div>
 </div>
 )}
 </div>

 {/* ═══ BLOCKS REFERENCE ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
 onClick={() =>setShowBlocks(!showBlocks)}>HSTs Per Block Reference
 <ChevronDown size={14} style={{ transform: showBlocks ? "rotate(180deg)" : "none", transition: "0.2s" }} />
 </button>
 {showBlocks && (
 <div style={{ marginTop: 10, overflowX: "auto" }}>
 <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}>
 <thead><tr style={{ borderBottom: "2px solid hsl(0,0%,85%)" }}>
 <th style={{ textAlign: "left", padding: "5px 4px" }}>Block</th>
 <th style={{ textAlign: "right", padding: "5px 4px" }}>HSTs</th>
 <th style={{ textAlign: "left", padding: "5px 4px" }}>Position</th>
 </tr></thead>
 <tbody>
 {[
 ...BLOCK_TYPES.map(b =>({ ...b, pos: "" })),
 { name: "Flying Geese (from HSTs)", hsts: 2, pos: "Each goose unit" },
 { name: "Storm at Sea", hsts: 0, pos: "Varies" },
 ].map((b, i) =>(
 <tr key={i} style={{ borderBottom: "1px solid hsl(0,0%,92%)" }}>
 <td style={{ padding: "4px 4px" }}>{b.name}</td>
 <td style={{ textAlign: "right", padding: "4px 4px", fontWeight: 600 }}>{b.hsts || "Varies"}</td>
 <td style={{ padding: "4px 4px", fontSize: 10, color: "var(--color-text-tertiary)" }}>{b.pos}</td>
 </tr>
 ))}
 </tbody>
 </table>
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
 <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>HST Formulas</h4>
 <div style={{ fontSize: 12, fontFamily: "monospace", lineHeight: 2, color: "var(--color-text-secondary)" }}>
 <div><strong>2-at-a-time:</strong></div>
 <div>cut = fin + ⅞&quot;</div>
 <div style={{ marginTop: 6 }}><strong>4-at-a-time:</strong></div>
 <div>cut = fin + 1¼&quot;</div>
 <div style={{ marginTop: 6 }}><strong>8-at-a-time:</strong></div>
 <div>cut = fin × 2 + 1½&quot;</div>
 <div style={{ marginTop: 6 }}><strong>Unfinished:</strong></div>
 <div>fin + ½&quot;</div>
 </div>
 </div>
 <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
 <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Quick Answer</h4>
 <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.9 }}>
 <div>3&quot; finished HST:</div>
 <div>Cut 3⅞&quot; squares</div>
 <div>(2-at-a-time method)</div>
 <div>Unfin: 3½&quot;</div>
 </div>
 </div>
 <div className="glass-card related-tools">
 <h4>Related Tools</h4>
 <a href="/quilt/flying-geese-calculator" className="related-tool-link">Flying Geese</a>
 <a href="/quilt/cornerstone-calculator" className="related-tool-link">Cornerstone</a>
 <a href="/quilt/binding-calculator" className="related-tool-link">Binding</a>
 <a href="/quilt" className="related-tool-link">All Quilt Tools</a>
 </div>
 </aside>
 </div>
 </div>
 );
}