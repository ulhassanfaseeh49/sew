"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Layers, ClipboardCopy, Printer, ChevronDown } from "lucide-react";

const roundUp8 = (v: number) =>Math.ceil(v * 8) / 8;

type Proj = "overview" | "simple" | "subcut" | "hst" | "disappearing";
const PROJ_INFO: { id: Proj; label: string; desc: string }[] = [
 { id: "overview", label: "Project Overview", desc: "See all options" },
 { id: "simple", label: "Large Square Quilt", desc: "10\" squares as-is" },
 { id: "subcut", label: "Sub-Cut Options", desc: "Charms, strips, squares" },
 { id: "hst", label: "HST Projects", desc: "Half-square triangles" },
 { id: "disappearing", label: "Disappearing Patterns", desc: "Nine-patch & four-patch" },
];

/* ─── LAYOUTS ─── */
function bestLayouts(sq: number, finSize: number): { a: number; d: number; w: number; h: number; left: number }[] {
 const res: { a: number; d: number; w: number; h: number; left: number }[] = [];
 for (let a = 3; a <= Math.min(sq, 15); a++) {
 const d = Math.floor(sq / a);
 if (d >= 3 && d <= 15) res.push({ a, d, w: +(a * finSize).toFixed(1), h: +(d * finSize).toFixed(1), left: sq - a * d });
 }
 return res.sort((a, b) =>Math.abs(a.w / a.h - 0.75) - Math.abs(b.w / b.h - 0.75)).slice(0, 4);
}

/* ─── CORE MATH ─── */
function calcAll(cakes: number, sqPerCake: number) {
 const totalSq = cakes * sqPerCake;
 const finSq = 9.5; // 10" - 0.5" seam = 9.5" finished

 // Simple large square layouts
 const layouts = bestLayouts(totalSq, finSq);

 // Sub-cut options
 const charms = totalSq * 4; // 4 × 5" per 10"
 const halves = totalSq * 2; // 2 × (5"×10") per 10"
 const strips25 = totalSq * 4; // 4 × (2.5"×10")
 const squares25 = totalSq * 16; // 16 × 2.5" squares

 // HST large: pair squares, 2-at-a-time → 2 HSTs per pair
 const hstPairs = Math.floor(totalSq / 2);
 const hstLarge = hstPairs * 2; // 9" finished each
 const hstLargeFinished = 9; // 10 - 0.875 = 9.125 → trim to 9"

 // HST medium: sub-cut to 5" first, then pair
 const hstMedPairs = Math.floor(charms / 2);
 const hstMed = hstMedPairs * 2; // 4" finished
 const hstMedFinished = 4;

 // Pinwheel from large HSTs (4 HSTs per block)
 const pinLargeBlocks = Math.floor(hstLarge / 4);
 const pinLargeSize = hstLargeFinished * 2; // 18"

 // Pinwheel from medium HSTs
 const pinMedBlocks = Math.floor(hstMed / 4);
 const pinMedSize = hstMedFinished * 2; // 8"

 // Disappearing nine-patch: 9 squares each → 4 blocks at ~14"
 const d9units = Math.floor(totalSq / 9);
 const d9leftover = totalSq - d9units * 9;
 const d9blocks = d9units * 4;
 const d9blockSize = 14; // ~14" finished

 // Disappearing four-patch: 4 squares each → 4 blocks at ~9"
 const d4units = Math.floor(totalSq / 4);
 const d4leftover = totalSq - d4units * 4;
 const d4blocks = d4units * 4;
 const d4blockSize = 9; // ~9" finished

 // Background fabric for alternating
 const bgSq = totalSq;
 const bgCutSize = 10.5; // unfinished, matches 10" LC at 9.5" finished
 const bgPerRow = Math.floor(43.5 / bgCutSize); // 44"-0.5" usable
 const bgRows = Math.ceil(bgSq / Math.max(bgPerRow, 1));
 const bgYd = (bgRows * bgCutSize) / 36;
 const bgBuy = roundUp8(bgYd * 1.1);

 return {
 totalSq, finSq, layouts,
 charms, halves, strips25, squares25,
 hstLarge, hstLargeFinished, hstMed, hstMedFinished,
 pinLargeBlocks, pinLargeSize, pinMedBlocks, pinMedSize,
 d9units, d9leftover, d9blocks, d9blockSize,
 d4units, d4leftover, d4blocks, d4blockSize,
 bgSq, bgBuy,
 };
}

/* ─── Sub-cut SVG ─── */
function SubCutDiagram() {
 return (
 <svg width="220" height="110" viewBox="0 0 220 110" style={{ border: "1px solid hsl(0,0%,85%)", borderRadius: 6 }}>
 {/* Whole */}
 <rect x="5" y="5" width="45" height="45" fill="hsl(150,35%,80%)" stroke="hsl(150,40%,50%)" strokeWidth={1} rx={2} />
 <text x="27" y="30" textAnchor="middle" fontSize="7" fill="hsl(150,40%,30%)">10&quot;</text>
 <text x="27" y="58" textAnchor="middle" fontSize="6" fill="hsl(0,0%,50%)">Whole</text>
 {/* 4 charms */}
 <g transform="translate(60,5)">
 {[0, 1, 2, 3].map(i =><rect key={i} x={(i % 2) * 23} y={Math.floor(i / 2) * 23} width="21" height="21" fill="hsl(200,35%,80%)" stroke="hsl(200,40%,50%)" strokeWidth={0.8} rx={1} />)}
 <text x="22" y="28" textAnchor="middle" fontSize="7" fill="hsl(200,40%,30%)">5&quot;</text>
 </g>
 <text x="82" y="58" textAnchor="middle" fontSize="6" fill="hsl(0,0%,50%)">4 charms</text>
 {/* 4 strips */}
 <g transform="translate(115,5)">
 {[0, 1, 2, 3].map(i =><rect key={i} x="0" y={i * 11.5} width="45" height="10" fill="hsl(30,35%,82%)" stroke="hsl(30,40%,55%)" strokeWidth={0.8} rx={1} />)}
 </g>
 <text x="137" y="58" textAnchor="middle" fontSize="6" fill="hsl(0,0%,50%)">4 strips</text>
 {/* 2 halves */}
 <g transform="translate(170,5)">
 <rect x="0" y="0" width="45" height="21" fill="hsl(340,30%,82%)" stroke="hsl(340,35%,55%)" strokeWidth={0.8} rx={1} />
 <rect x="0" y="23" width="45" height="21" fill="hsl(340,30%,82%)" stroke="hsl(340,35%,55%)" strokeWidth={0.8} rx={1} />
 </g>
 <text x="192" y="58" textAnchor="middle" fontSize="6" fill="hsl(0,0%,50%)">2 halves</text>
 {/* Key insight */}
 <text x="110" y="78" textAnchor="middle" fontSize="8" fontWeight="bold" fill="hsl(150,50%,35%)">1 Layer Cake = 4 Charm Packs!</text>
 <text x="110" y="92" textAnchor="middle" fontSize="7" fill="hsl(0,0%,50%)">42 × 10&quot; squares → 168 × 5&quot; charm squares</text>
 </svg>
 );
}

/* ─── FAQ ─── */
const faqItems = [
 { q: "What is a layer cake in quilting?", a: "A layer cake is a pre-cut bundle of 10\" × 10\" squares, usually containing 42 squares — one of each fabric in a collection. Named for their resemblance to a layered cake when stacked. The 10\" size showcases fabric prints beautifully and is exactly double a 5\" charm square." },
 { q: "How many squares in a layer cake?", a: "Standard layer cakes contain 42 squares (Moda and most brands). Some brands include 40 squares. Each square is 10\" × 10\". Always check your specific product for the exact count." },
 { q: "What can I make with one layer cake?", a: "One layer cake (42 squares) makes a complete throw quilt (57\"×66.5\") with NO additional fabric! You can also sub-cut into 168 charm squares, make 42 large HSTs (9\" finished), create disappearing nine-patch or four-patch blocks, or add background fabric to make a queen-size quilt." },
 { q: "How many layer cakes for a queen-size quilt?", a: "For a simple large-square queen quilt (~85\"×95\"): 3 layer cakes (90 squares needed). With alternating background squares: 2 layer cakes + 2.5 yards of background fabric for a queen-size quilt." },
 { q: "How do you cut a layer cake into charm squares?", a: "Cut each 10\" square in half both ways: 2 cuts produce 4 charm squares at 5\" × 5\" each. One layer cake (42 squares) yields 168 charm squares — equivalent to 4 charm packs!" },
 { q: "What is a disappearing nine-patch from a layer cake?", a: "Sew 9 layer cake squares into a 3×3 nine-patch, then cut through the center both ways to create 4 pieces. Rearrange and resew the pieces to create 4 new blocks (~14\" each) with a completely different pattern. From 42 squares: 4 nine-patch units → 16 blocks." },
 { q: "What size HSTs from a layer cake?", a: "Large HSTs: Use 10\" squares directly with the 2-at-a-time method → 9\" finished HSTs (trim from 9.125\"). Medium HSTs: Sub-cut to 5\" first, then pair → 4\" finished HSTs. From 42 squares: 42 large HSTs or 168 medium HSTs." },
 { q: "Can I use a layer cake with a jelly roll?", a: "Yes! This is a popular combination from the same collection. Layer cake provides large feature blocks, while jelly roll strips serve as sashing, borders, or binding. Together they can create a ~55\"×70\" quilt with sashing and borders." },
 { q: "How many layer cakes for a throw quilt?", a: "Just ONE! A single layer cake (42 squares at 9.5\" finished) arranged 6×7 creates a 57\"×66.5\" throw quilt — the magic of layer cakes. No cutting or additional fabric needed." },
 { q: "What is the finished size of a layer cake square?", a: "Each 10\" layer cake square finishes at 9.5\" × 9.5\" (after 1/4\" seam allowances on each side). In a quilt layout, each square contributes 9.5\" to the finished dimensions." },
];

export default function Page() {
 const [cakes, setCakes] = useState(1);
 const [sqPerCake, setSqPerCake] = useState(42);
 const [proj, setProj] = useState<Proj>("overview");
 const [activeFaq, setActiveFaq] = useState<number | null>(null);
 const [showComparison, setShowComparison] = useState(false);
 const [showSizeRef, setShowSizeRef] = useState(false);
 const [showEdu, setShowEdu] = useState(false);

 const c = useMemo(() =>calcAll(cakes, sqPerCake), [cakes, sqPerCake]);

 const tS = { fontSize: 11, borderCollapse: "collapse" as const, width: "100%" };
 const tH = { padding: "5px 4px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left" as const, fontSize: 11 };
 const tD = { padding: "4px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11 };
 const tR = { textAlign: "right" as const };

 const copyText = `Layer Cake: ${cakes} cake(s) × ${sqPerCake} = ${c.totalSq} squares (10"). Simple throw: ${c.layouts[0]?.a}×${c.layouts[0]?.d} = ${c.layouts[0]?.w}"×${c.layouts[0]?.h}". Sub-cut: ${c.charms} charms. HST large: ${c.hstLarge}. Disappearing 9-patch: ${c.d9blocks} blocks.`;

 return (
 <div className="container">
 <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "Layer Cake Calculator" }]} />
 <div className="calculator-layout">
 <div className="calculator-main">
 <div className={styles.toolHeader}>
 <span className="category-badge"><Layers size={14} strokeWidth={1.5} />Quilt #162</span>
 <h1>Layer Cake Project Calculator</h1>
 <p>Calculate what quilt projects you can make from layer cakes (10&quot; squares). Includes sub-cutting to charm squares, HSTs, disappearing patterns, and background fabric needs.</p>
 </div>

 {/* ① YOUR LAYER CAKE */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>① Your Layer Cake</h2>
 <div className="calculator-form-row">
 <div className="input-group">
 <label className="input-label">Layer cakes</label>
 <input type="number" className="input-field" value={cakes} onChange={e =>setCakes(parseInt(e.target.value) || 1)} min={1} max={10} />
 </div>
 <div className="input-group">
 <label className="input-label">Squares per cake</label>
 <select className="input-field" value={sqPerCake} onChange={e =>setSqPerCake(parseInt(e.target.value))}>
 <option value={42}>42 (standard)</option>
 <option value={40}>40</option>
 </select>
 </div>
 </div>
 <div style={{ marginTop: 8, padding: 10, background: "hsl(150,20%,97%)", borderRadius: 6, fontSize: 12, lineHeight: 1.9 }}>
 <strong>Total:</strong>{c.totalSq} squares at 10&quot; × 10&quot; | Finished: 9.5&quot; × 9.5&quot; each
 </div>
 {cakes === 1 && sqPerCake === 42 && (
 <div style={{ marginTop: 6, padding: 8, background: "hsl(45,40%,94%)", borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
 ⭐ 1 Layer Cake = 1 complete throw quilt (57&quot; × 66.5&quot;) — NO additional fabric needed!
 </div>
 )}
 </div>

 {/* ② PROJECT TYPE */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>② Project Type</h2>
 <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 4 }}>
 {PROJ_INFO.map(p =>(
 <button key={p.id} className={`btn ${proj === p.id ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setProj(p.id)} style={{ padding: "8px 6px", textAlign: "center", fontSize: 11 }}>
 <div style={{ fontWeight: 700, fontSize: 12 }}>{p.label}</div>
 <div style={{ fontSize: 9, opacity: .7 }}>{p.desc}</div>
 </button>
 ))}
 </div>
 </div>

 {/* ═══ OVERVIEW ═══ */}
 {proj === "overview" && (
 <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(150,60%,40%)" }}>
 <h2 className={styles.calcTitle}>What You Can Make from {cakes} Layer Cake{cakes >1 ? "s" : ""}</h2>
 {[
 { name: "Simple Large Square Quilt", size: c.layouts[0] ? `${c.layouts[0].w}" × ${c.layouts[0].h}"` : "—", diff: "★☆☆☆☆", extra: "None" },
 { name: "With Background (alternating)", size: `${c.totalSq * 2} total squares`, diff: "★☆☆☆☆", extra: `${c.bgBuy.toFixed(1)} yd bg` },
 { name: "Sub-cut to Charm Squares", size: `${c.charms} charms (5")`, diff: "★☆☆☆☆", extra: "Various" },
 { name: "Large HSTs (9\" finished)", size: `${c.hstLarge} HSTs`, diff: "★★☆☆☆", extra: "None" },
 { name: "Medium HSTs (4\" finished)", size: `${c.hstMed} HSTs`, diff: "★★☆☆☆", extra: "None" },
 { name: "Disappearing Nine-Patch (~14\")", size: `${c.d9blocks} blocks`, diff: "★★☆☆☆", extra: "None" },
 { name: "Disappearing Four-Patch (~9\")", size: `${c.d4blocks} blocks`, diff: "★★☆☆☆", extra: "None" },
 ].map((p, i) =>(
 <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px", background: i % 2 === 0 ? "hsl(0,0%,98%)" : "transparent", borderRadius: 4, fontSize: 12, marginBottom: 2 }}>
 <div><strong>{p.name}</strong></div>
 <div style={{ textAlign: "right" }}>
 <span style={{ fontWeight: 700, color: "var(--color-accent-primary)" }}>{p.size}</span>
 <span style={{ fontSize: 10, marginLeft: 8, opacity: .6 }}>{p.diff}</span>
 </div>
 </div>
 ))}
 </div>
 )}

 {/* ═══ SIMPLE LARGE SQUARE ═══ */}
 {proj === "simple" && (
 <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(200,50%,50%)" }}>
 <h2 className={styles.calcTitle}>Large Square Quilt</h2>
 <div className="result-card">
 <div className="result-prefix">Using {c.totalSq} squares at 9.5&quot; finished</div>
 <div className="result-value">{c.layouts[0]?.w}&quot; × {c.layouts[0]?.h}&quot;</div>
 <div className="result-label">{c.layouts[0]?.a} × {c.layouts[0]?.d} = {(c.layouts[0]?.a || 0) * (c.layouts[0]?.d || 0)} squares{c.layouts[0]?.left ? ` (${c.layouts[0].left} leftover)` : ""}</div>
 </div>
 <div style={{ marginTop: 10 }}>
 <strong style={{ fontSize: 12 }}>All layout options:</strong>
 <table style={{ ...tS, marginTop: 4 }}>
 <thead><tr><th style={tH}>Layout</th><th style={{ ...tH, ...tR }}>Squares</th><th style={{ ...tH, ...tR }}>Size</th><th style={{ ...tH, ...tR }}>Left</th></tr></thead>
 <tbody>
 {c.layouts.map((l, i) =>(
 <tr key={i} style={{ fontWeight: i === 0 ? 700 : 400 }}>
 <td style={tD}>{l.a}×{l.d}</td>
 <td style={{ ...tD, ...tR }}>{l.a * l.d}</td>
 <td style={{ ...tD, ...tR, fontWeight: 600 }}>{l.w}&quot; × {l.h}&quot;</td>
 <td style={{ ...tD, ...tR }}>{l.left}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 <div style={{ marginTop: 10, padding: 8, background: "hsl(150,15%,97%)", borderRadius: 6, fontSize: 12, lineHeight: 2 }}>
 <strong>With background:</strong>Add {c.bgSq} alternating 10.5&quot; background squares → {c.totalSq * 2} total → much larger quilt!<br />Background fabric needed: <strong>{c.bgBuy.toFixed(2)} yards</strong>
 </div>
 </div>
 )}

 {/* ═══ SUB-CUT ═══ */}
 {proj === "subcut" && (
 <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(280,50%,55%)" }}>
 <h2 className={styles.calcTitle}>Sub-Cut Options</h2>
 <div style={{ textAlign: "center", marginBottom: 10 }}><SubCutDiagram /></div>
 <table style={tS}>
 <thead><tr>
 <th style={tH}>Sub-Cut</th><th style={{ ...tH, ...tR }}>Per Sq</th>
 <th style={{ ...tH, ...tR, fontWeight: 700 }}>Total</th><th style={tH}>Equivalent</th>
 </tr></thead>
 <tbody>
 {[
 ["Keep whole (10\")", "1", c.totalSq, `${cakes} layer cake${cakes >1 ? "s" : ""}`],
 ["Halves (5\"×10\")", "2", c.halves, "—"],
 ["Charms (5\"×5\")", "4", c.charms, `${Math.floor(c.charms / 42)} charm packs!`],
 ["Strips (2.5\"×10\")", "4", c.strips25, "Short strips (10\" only)"],
 ["2.5\" squares", "16", c.squares25, "—"],
 ].map(([name, per, total, equiv], i) =>(
 <tr key={i} style={{ borderBottom: "1px solid hsl(0,0%,92%)" }}>
 <td style={tD}>{name}</td>
 <td style={{ ...tD, ...tR }}>{per}</td>
 <td style={{ ...tD, ...tR, fontWeight: 700, color: "var(--color-accent-primary)" }}>{total}</td>
 <td style={{ ...tD, fontSize: 10 }}>{equiv}</td>
 </tr>
 ))}
 </tbody>
 </table>
 <div style={{ marginTop: 8, padding: 8, background: "hsl(280,15%,97%)", borderRadius: 6, fontSize: 12 }}>
 ⭐ <strong>Biggest value unlock:</strong>Sub-cutting 1 layer cake to 5&quot; squares = {Math.floor(c.charms / 42)} charm packs worth of fabric!
 </div>
 </div>
 )}

 {/* ═══ HST ═══ */}
 {proj === "hst" && (
 <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(30,60%,50%)" }}>
 <h2 className={styles.calcTitle}>Half-Square Triangles</h2>
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
 <div className="result-card">
 <div className="result-prefix">Large HSTs ({c.hstLargeFinished}&quot; finished)</div>
 <div className="result-value">{c.hstLarge} HSTs</div>
 <div className="result-label">From {c.totalSq} squares (2-at-a-time)</div>
 </div>
 <div className="result-card">
 <div className="result-prefix">Medium HSTs ({c.hstMedFinished}&quot; finished)</div>
 <div className="result-value">{c.hstMed} HSTs</div>
 <div className="result-label">Sub-cut to 5&quot; first</div>
 </div>
 </div>
 <div style={{ marginTop: 10, fontSize: 12, lineHeight: 2 }}>
 <div style={{ padding: 8, background: "hsl(30,15%,97%)", borderRadius: 6, marginBottom: 6 }}>
 <strong>Large HSTs:</strong>Pair {Math.floor(c.totalSq / 2)} pairs of 10&quot; squares → {c.hstLarge} HSTs at {c.hstLargeFinished}&quot; finished (trim from 9.125&quot;)<br />
 <strong>Pinwheels (4 HSTs each):</strong>{c.pinLargeBlocks} blocks at {c.pinLargeSize}&quot; finished (very large!)
 {c.pinLargeBlocks >= 9 && <div style={{ fontSize: 11 }}>Layout: 3×3 = 9 blocks → {3 * c.pinLargeSize}&quot; × {3 * c.pinLargeSize}&quot;</div>}
 </div>
 <div style={{ padding: 8, background: "hsl(200,15%,97%)", borderRadius: 6 }}>
 <strong>Medium HSTs:</strong>Sub-cut each 10&quot; → 4 × 5&quot;, pair {Math.floor(c.charms / 2)} pairs → {c.hstMed} HSTs at {c.hstMedFinished}&quot; finished<br />
 <strong>Pinwheels:</strong>{c.pinMedBlocks} blocks at {c.pinMedSize}&quot; finished
 {c.pinMedBlocks >= 16 && (
 <div style={{ fontSize: 11 }}>
 {bestLayouts(c.pinMedBlocks, c.pinMedSize).slice(0, 2).map((l, i) =>(
 <span key={i}>{i >0 ? " | " : ""}{l.a}×{l.d} = {l.w}&quot;×{l.h}&quot;</span>
 ))}
 </div>
 )}
 </div>
 </div>
 </div>
 )}

 {/* ═══ DISAPPEARING ═══ */}
 {proj === "disappearing" && (
 <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(340,50%,50%)" }}>
 <h2 className={styles.calcTitle}>Disappearing Patterns</h2>
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
 <div className="result-card">
 <div className="result-prefix">Disappearing Nine-Patch</div>
 <div className="result-value">{c.d9blocks} blocks</div>
 <div className="result-label">~{c.d9blockSize}&quot; each ({c.d9units} units{c.d9leftover >0 ? `, ${c.d9leftover} leftover` : ""})</div>
 </div>
 <div className="result-card">
 <div className="result-prefix">Disappearing Four-Patch</div>
 <div className="result-value">{c.d4blocks} blocks</div>
 <div className="result-label">~{c.d4blockSize}&quot; each ({c.d4units} units{c.d4leftover >0 ? `, ${c.d4leftover} leftover` : ""})</div>
 </div>
 </div>
 <div style={{ marginTop: 10, fontSize: 12, lineHeight: 2 }}>
 <div style={{ padding: 8, background: "hsl(340,10%,97%)", borderRadius: 6, marginBottom: 6 }}>
 <strong>Disappearing Nine-Patch:</strong><br />
 1. Sew 9 squares (3×3) into a large nine-patch<br />
 2. Cut through center both ways → 4 pieces<br />
 3. Rearrange (rotate alternating pieces 180°) and resew<br />
 4. Each nine-patch → 4 new blocks at ~{c.d9blockSize}&quot;<br />
 {c.d9blocks >= 16 && <span>Layout: 4×4 = 16 blocks → {4 * c.d9blockSize}&quot;×{4 * c.d9blockSize}&quot; throw!</span>}
 </div>
 <div style={{ padding: 8, background: "hsl(280,10%,97%)", borderRadius: 6 }}>
 <strong>Disappearing Four-Patch:</strong><br />
 1. Sew 4 squares (2×2) into a four-patch<br />
 2. Cut through center both ways → 4 pieces<br />
 3. Rearrange and resew<br />
 4. Each four-patch → 4 new blocks at ~{c.d4blockSize}&quot;<br />
 {c.d4blocks >= 36 && (
 <span>Layout: 6×6 = 36 blocks → {6 * c.d4blockSize}&quot;×{6 * c.d4blockSize}&quot;</span>
 )}
 </div>
 </div>
 </div>
 )}

 {/* TOOLBAR */}
 <div className="toolbar" style={{ marginBottom: 10 }}>
 <button className="btn btn-secondary btn-sm" onClick={() =>navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} />Copy</button>
 <button className="btn btn-secondary btn-sm" onClick={() =>window.print()}><Printer size={13} />Print</button>
 </div>

 {/* ═══ COMPARISON TABLE ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }}
 onClick={() =>setShowComparison(!showComparison)}>Project Comparison Table
 <ChevronDown size={14} style={{ transform: showComparison ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showComparison && (
 <div style={{ marginTop: 10, overflowX: "auto" }}>
 <table style={tS}>
 <thead><tr>
 <th style={tH}>Project</th><th style={tH}>Result</th>
 <th style={tH}>Difficulty</th><th style={tH}>Extra</th>
 </tr></thead>
 <tbody>
 {[
 ["Simple large square", c.layouts[0] ? `${c.layouts[0].w}"×${c.layouts[0].h}"` : "—", "★☆☆☆☆", "None!"],
 ["With background", `${c.totalSq * 2} squares`, "★☆☆☆☆", `${c.bgBuy.toFixed(1)} yd bg`],
 ["Large HST pinwheel", `${c.pinLargeBlocks} blocks (${c.pinLargeSize}")`, "★★☆☆☆", "None"],
 ["Sub-cut to charms", `${c.charms} charms`, "★☆☆☆☆", "Various"],
 ["Disappearing 9-patch", `${c.d9blocks} blocks (~${c.d9blockSize}")`, "★★☆☆☆", "None"],
 ["Disappearing 4-patch", `${c.d4blocks} blocks (~${c.d4blockSize}")`, "★★☆☆☆", "None"],
 ].map(([n, s, d, e], i) =>(
 <tr key={i}><td style={tD}>{n}</td><td style={{ ...tD, fontWeight: 600 }}>{s}</td><td style={tD}>{d}</td><td style={{ ...tD, fontSize: 10 }}>{e}</td></tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </div>

 {/* ═══ SIZE REFERENCE ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }}
 onClick={() =>setShowSizeRef(!showSizeRef)}>Layer Cakes Needed for Standard Sizes
 <ChevronDown size={14} style={{ transform: showSizeRef ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showSizeRef && (
 <div style={{ marginTop: 10, overflowX: "auto" }}>
 <table style={tS}>
 <thead><tr>
 <th style={tH}>Quilt</th><th style={tH}>Layout</th>
 <th style={{ ...tH, ...tR }}>Squares</th><th style={{ ...tH, ...tR }}>LCs</th><th style={tH}>Left</th>
 </tr></thead>
 <tbody>
 {[
 ["Baby 38\"×47.5\"", "4×5", 20, 1, 22],
 ["Throw 57\"×66.5\"", "6×7", 42, 1, 0],
 ["Lap 66.5\"×76\"", "7×8", 56, 2, 28],
 ["Twin 66.5\"×95\"", "7×10", 70, 2, 14],
 ["Full 76\"×85.5\"", "8×9", 72, 2, 12],
 ["Queen 85.5\"×95\"", "9×10", 90, 3, 36],
 ["King 95\"×104.5\"", "10×11", 110, 3, 16],
 ].map(([sz, lay, sq, lc, left], i) =>(
 <tr key={i} style={{ fontWeight: (lc as number) === cakes ? 700 : 400, background: (lc as number) === cakes ? "hsl(150,30%,95%)" : "transparent" }}>
 <td style={tD}>{sz}</td>
 <td style={tD}>{lay}</td>
 <td style={{ ...tD, ...tR }}>{sq}</td>
 <td style={{ ...tD, ...tR, fontWeight: 700 }}>{lc}</td>
 <td style={tD}>{left}</td>
 </tr>
 ))}
 </tbody>
 </table>
 <div style={{ marginTop: 8, fontSize: 11, padding: 6, background: "hsl(45,30%,95%)", borderRadius: 4 }}>
 ⭐ <strong>Key insight:</strong>1 LC makes a throw EXACTLY (6×7 = 42, 0 leftover). This is the most efficient pre-cut for throw quilts.
 </div>
 </div>
 )}
 </div>

 {/* ═══ EDUCATIONAL ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }}
 onClick={() =>setShowEdu(!showEdu)}>What Is a Layer Cake &amp; Pre-Cut Comparison
 <ChevronDown size={14} style={{ transform: showEdu ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showEdu && (
 <div style={{ marginTop: 10, fontSize: 12.5, lineHeight: 1.9, color: "var(--color-text-secondary)" }}>
 <p><strong>What is a layer cake?</strong>A pre-cut bundle of 10&quot; × 10&quot; squares — usually 42 squares (one of each fabric in the collection). Named for their layered appearance when stacked. The 10&quot; size shows off fabric prints beautifully.</p>
 <p style={{ marginTop: 8 }}><strong>Pre-Cut Comparison:</strong></p>
 <table style={{ ...tS, marginBottom: 8 }}>
 <thead><tr><th style={tH}></th><th style={tH}>Charm Pack</th><th style={tH}>Jelly Roll</th><th style={tH}>Layer Cake</th></tr></thead>
 <tbody>
 <tr><td style={{ ...tD, fontWeight: 600 }}>Size</td><td style={tD}>5&quot;×5&quot;</td><td style={tD}>2.5&quot;×42&quot;</td><td style={{ ...tD, fontWeight: 700 }}>10&quot;×10&quot;</td></tr>
 <tr><td style={{ ...tD, fontWeight: 600 }}>Count</td><td style={tD}>42</td><td style={tD}>40</td><td style={{ ...tD, fontWeight: 700 }}>42</td></tr>
 <tr><td style={{ ...tD, fontWeight: 600 }}>Area</td><td style={tD}>1,050 sq in</td><td style={tD}>4,200 sq in</td><td style={{ ...tD, fontWeight: 700 }}>4,200 sq in</td></tr>
 <tr><td style={{ ...tD, fontWeight: 600 }}>Best for</td><td style={tD}>Small blocks</td><td style={tD}>Strips</td><td style={{ ...tD, fontWeight: 700 }}>Big blocks</td></tr>
 </tbody>
 </table>
 <p><strong>Important:</strong>Layer cake total area = jelly roll total area (4,200 sq in each) — but in completely different formats for different uses.</p>
 <p style={{ marginTop: 6 }}><strong>Disappearing patterns</strong>create complex-looking blocks from simple construction: sew a recognizable pattern, cut it apart, rearrange the pieces. The original pattern &quot;disappears&quot; and a new one appears.</p>
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
 <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Layer Cake Facts</h4>
 <div style={{ fontSize: 12, lineHeight: 2 }}>
 <div>Size: <strong>10&quot; × 10&quot;</strong></div>
 <div>Standard: <strong>42 squares</strong></div>
 <div>Finished: <strong>9.5&quot; × 9.5&quot;</strong></div>
 <div>= 4 charm packs</div>
 <div>1 LC = 1 throw quilt!</div>
 </div>
 </div>
 <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
 <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Sub-Cut Quick Ref</h4>
 <div style={{ fontSize: 11, lineHeight: 2.2 }}>
 <div>→ 4 charms (5&quot;×5&quot;)</div>
 <div>→ 2 halves (5&quot;×10&quot;)</div>
 <div>→ 4 strips (2.5&quot;×10&quot;)</div>
 <div>→ 16 squares (2.5&quot;)</div>
 </div>
 </div>
 <div className="glass-card related-tools">
 <h4>Related Tools</h4>
 <a href="/quilt/charm-pack-calculator" className="related-tool-link">Charm Pack Calculator</a>
 <a href="/quilt/jelly-roll-calculator" className="related-tool-link">Jelly Roll Calculator</a>
 <a href="/quilt/hst-yield" className="related-tool-link">HST Yield Calculator</a>
 <a href="/quilt" className="related-tool-link">All Quilt Tools</a>
 </div>
 </aside>
 </div>
 </div>
 );
}