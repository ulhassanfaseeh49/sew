"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, ChevronDown, Wind } from "lucide-react";

/* ─── FRACTION ─── */
function toFrac(v: number): string {
 if (v <= 0) return "0";
 const w = Math.floor(v);
 const f = v - w;
 const map: [number, string][] = [[0, ""], [0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
 let best = map[0], bd = 1;
 for (const [n, s] of map) { const d = Math.abs(f - n); if (d < bd) { bd = d; best = [n, s]; } }
 if (Math.abs(f - 1) < bd) return `${w + 1}`;
 if (!best[1]) return `${w}`;
 return w >0 ? `${w}${best[1]}` : `${best[1]}`;
}
function toF(v: number): string { return toFrac(v) + '"'; }

const WOF = 42;
const refSizes = [4, 6, 8, 10, 12, 14, 16];

/* ─── FAQ ─── */
const faqItems = [
 { q: "How do I make a pinwheel quilt block?", a: "Cut squares of two contrasting fabrics, make 4 half-square triangle (HST) units using the 2-at-a-time method, arrange them in a 2×2 grid with all dark triangles pointing toward the center in a spinning pattern, then sew into rows and join. The key is HST orientation — all blades must rotate the same direction." },
 { q: "What size squares for a pinwheel block?", a: "For the 2-at-a-time HST method: cut squares at (finished block size ÷ 2) + ⅞\". Example: 12\" block → 6\" HSTs → cut 6⅞\" squares. For 4-at-a-time: (finished block ÷ 2) + 1¼\". Each pinwheel needs 2 squares of each color." },
 { q: "Why doesn't my pinwheel look like it is spinning?", a: "The #1 cause is incorrect HST orientation. All dark triangles must point toward the center, each rotated 90° from its neighbor. If even one HST is backwards, the illusion breaks. Lay all 4 HSTs flat before sewing and verify the spinning pattern from a distance." },
 { q: "How do I arrange HSTs for a pinwheel block?", a: "Place first HST with dark in top-left. Rotate second 90° CW (dark top-right). Rotate third 180° (dark bottom-right). Rotate fourth 270° (dark bottom-left). All dark triangles form a pinwheel rotation pointing toward center. Take a photo before sewing!" },
 { q: "What is the twirl pressing technique?", a: "After joining rows, unsew the last 1–2 stitches of each seam at the center intersection. Fan the 8 seam allowances in a clockwise circle (like a mini pinwheel). Press from the right side. The center lies perfectly flat with sharp points. It's the professional technique for pinwheel centers." },
 { q: "How do I make pinwheels from charm squares?", a: "Charm squares (5\") make HSTs that finish at ~4\" (trimmed). Four of these create an 8\" finished pinwheel block. Per block: 2 dark + 2 light charm squares → 4 HSTs. A 42-piece charm pack (21 pairs) yields 10 complete pinwheel blocks." },
 { q: "What is a double pinwheel block?", a: "A double pinwheel has two spinning elements: 4 large outer HSTs and 4 small inner HSTs. The inner HST finished size is half the outer. Example: 12\" block → outer HSTs at 6\", inner at 3\". Creates a dramatic nested spinning effect." },
 { q: "How do I press a pinwheel so the center lies flat?", a: "Use the twirl technique (best results), press all seams open (easiest), or press row seams in opposite directions so they nest at the center. The center has 8 seam allowances meeting at one point — without special pressing, it creates a bulky bump." },
 { q: "How many HSTs for a pinwheel block?", a: "A standard pinwheel block needs exactly 4 HSTs. With the 2-at-a-time method, 2 pairs of squares yield 4 HSTs = 1 block. With 4-at-a-time, 1 pair yields 4 HSTs = 1 block (more efficient for large quantities)." },
 { q: "What is the difference between a pinwheel and a windmill?", a: "A pinwheel uses square HSTs — each blade is a right triangle. A windmill uses rectangular Flying Geese units — each blade is an elongated triangle. Windmills have a more dramatic, stretched spinning effect. Both need 4 units per block." },
 { q: "How do I calculate pinwheel block fabric?", a: "Per block (2-at-a-time): 2 dark + 2 light squares at (HST finished + ⅞\"). For yardage: squares needed = blocks × 2 per color. Squares per WOF strip = floor(42 ÷ cut size). Strips × cut size ÷ 36 = yards." },
 { q: "How do I plan a pinwheel border?", a: "Divide your quilt edge length by the pinwheel block size to see how many fit. Choose a size that divides evenly (e.g., 60\" edge ÷ 6\" pinwheel = 10 blocks). Add 4 corner blocks. Total = (2 × top/bottom) + (2 × side) blocks." },
];

export default function Page() {
 const [finBlock, setFinBlock] = useState(12);
 const [method, setMethod] = useState<"2at" | "4at">("2at");
 const [blockCount, setBlockCount] = useState(12);
 const [fabricWidth, setFabricWidth] = useState(42);
 const [showAssembly, setShowAssembly] = useState(false);
 const [showTwirl, setShowTwirl] = useState(false);
 const [showYardage, setShowYardage] = useState(false);
 const [showDouble, setShowDouble] = useState(false);
 const [showPrecut, setShowPrecut] = useState(false);
 const [showBorder, setShowBorder] = useState(false);
 const [showTrouble, setShowTrouble] = useState(false);
 const [showEdu, setShowEdu] = useState(false);
 const [borderEdge, setBorderEdge] = useState(60);
 const [activeFaq, setActiveFaq] = useState<number | null>(null);

 const calc = useMemo(() =>{
 const hstFin = finBlock / 2;
 const cut2 = hstFin + 0.875; // 2-at-a-time
 const cut4 = hstFin + 1.25; // 4-at-a-time
 const cutSq = method === "2at" ? cut2 : cut4;
 const sqPerBlock = method === "2at" ? 2 : 1; // per color per block
 const hstsPerPair = method === "2at" ? 2 : 4;
 const unfin = hstFin + 0.5;
 const isEven = finBlock % 2 === 0;
 return { hstFin, cut2, cut4, cutSq, sqPerBlock, hstsPerPair, unfin, isEven };
 }, [finBlock, method]);

 const yard = useMemo(() =>{
 const totalSqA = blockCount * calc.sqPerBlock;
 const totalSqB = blockCount * calc.sqPerBlock;
 const sqPerWOF = Math.floor(fabricWidth / calc.cutSq);
 const stripsA = Math.ceil(totalSqA / Math.max(sqPerWOF, 1));
 const stripsB = Math.ceil(totalSqB / Math.max(sqPerWOF, 1));
 const ydA = (stripsA * calc.cutSq) / 36;
 const ydB = (stripsB * calc.cutSq) / 36;
 const buyA = Math.ceil(ydA * 8) / 8;
 const buyB = Math.ceil(ydB * 8) / 8;
 return { totalSqA, totalSqB, sqPerWOF, stripsA, stripsB, ydA, ydB, buyA, buyB };
 }, [blockCount, calc, fabricWidth]);

 // Double pinwheel
 const dbl = useMemo(() =>{
 const outerHST = finBlock / 2;
 const innerHST = finBlock / 4;
 const outerCut = outerHST + 0.875;
 const innerCut = innerHST + 0.875;
 return { outerHST, innerHST, outerCut, innerCut };
 }, [finBlock]);

 const tH = { padding: "5px 8px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left" as const, fontSize: 11, fontWeight: 600 as const };
 const tD = { padding: "4px 8px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11 };
 const tR = { textAlign: "right" as const };

 // SVG pinwheel block preview
 const svgBlock = (
 <svg viewBox="0 0 100 100" style={{ width: 130, height: 130 }}>
 {/* 4 HSTs in 2×2 grid - clockwise spin */}
 {/* Top-left: dark upper-left triangle */}
 <polygon points="0,0 50,0 0,50" fill="hsl(220,45%,40%)" />
 <polygon points="50,0 0,50 50,50" fill="hsl(45,60%,88%)" />
 {/* Top-right: dark upper-right triangle */}
 <polygon points="50,0 100,0 100,50" fill="hsl(220,45%,40%)" />
 <polygon points="50,0 100,50 50,50" fill="hsl(45,60%,88%)" />
 {/* Bottom-right: dark lower-right triangle */}
 <polygon points="100,50 100,100 50,100" fill="hsl(220,45%,40%)" />
 <polygon points="50,50 100,50 50,100" fill="hsl(45,60%,88%)" />
 {/* Bottom-left: dark lower-left triangle */}
 <polygon points="0,50 50,100 0,100" fill="hsl(220,45%,40%)" />
 <polygon points="50,50 0,50 50,100" fill="hsl(45,60%,88%)" />
 <line x1="0" y1="0" x2="50" y2="50" stroke="hsl(0,0%,70%)" strokeWidth="0.5" />
 <line x1="50" y1="0" x2="100" y2="50" stroke="hsl(0,0%,70%)" strokeWidth="0.5" />
 <line x1="100" y1="50" x2="50" y2="100" stroke="hsl(0,0%,70%)" strokeWidth="0.5" />
 <line x1="50" y1="100" x2="0" y2="50" stroke="hsl(0,0%,70%)" strokeWidth="0.5" />
 <line x1="50" y1="0" x2="50" y2="100" stroke="hsl(0,0%,75%)" strokeWidth="0.5" />
 <line x1="0" y1="50" x2="100" y2="50" stroke="hsl(0,0%,75%)" strokeWidth="0.5" />
 <rect x="0" y="0" width="100" height="100" fill="none" stroke="hsl(0,0%,80%)" strokeWidth="1" />
 </svg>
 );

 const copyText = `Pinwheel ${toF(finBlock)}: HST ${toF(calc.hstFin)} fin. Cut at ${toF(calc.cutSq)} (${method === "2at" ? "2-at-a-time" : "4-at-a-time"}). Per block: ${calc.sqPerBlock} sq each color. For ${blockCount} blocks: ${toFrac(yard.buyA)} yd each color, ${toFrac(yard.buyA + yard.buyB)} yd total.`;

 return (
 <div className="container">
 <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "Pinwheel Calculator" }]} />
 <div className="calculator-layout">
 <div className="calculator-main">
 <div className={styles.toolHeader}>
 <span className="category-badge"><Wind size={14} strokeWidth={1.5} />Quilt #156</span>
 <h1>Pinwheel Block Calculator</h1>
 <p>Calculate HST cutting sizes, orientation guide, twirl pressing technique, and yardage for pinwheel blocks of any size. Includes double pinwheel, pre-cut calculator, and border planner.</p>
 </div>

 {/* ① INPUT */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>① Block Size &amp; Method</h2>
 <div className="calculator-form-row">
 <div className="input-group">
 <label className="input-label">Finished block size (inches)</label>
 <input type="number" className="input-field" value={finBlock} onChange={e =>setFinBlock(Math.max(2, parseFloat(e.target.value) || 8))} min={2} step={1} />
 <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
 {refSizes.map(s =>(<button key={s} className={`btn btn-sm ${finBlock === s ? "btn-primary" : "btn-ghost"}`} onClick={() =>setFinBlock(s)} style={{ fontSize: 10 }}>{s}&quot;</button>))}
 </div>
 {!calc.isEven && <div style={{ marginTop: 4, fontSize: 10, color: "hsl(40,70%,45%)" }}>⚠ Odd sizes create non-standard HSTs.</div>}
 </div>
 <div className="input-group">
 <label className="input-label">HST Method</label>
 <select className="input-field" value={method} onChange={e =>setMethod(e.target.value as "2at" | "4at")}>
 <option value="2at">2-at-a-time (standard)</option>
 <option value="4at">4-at-a-time (efficient)</option>
 </select>
 </div>
 </div>
 <div className="calculator-form-row" style={{ marginTop: 8 }}>
 <div className="input-group"><label className="input-label">Blocks to make</label>
 <input type="number" className="input-field" value={blockCount} onChange={e =>setBlockCount(Math.max(1, parseInt(e.target.value) || 1))} min={1} /></div>
 <div className="input-group"><label className="input-label">Usable WOF</label>
 <input type="number" className="input-field" value={fabricWidth} onChange={e =>setFabricWidth(Math.max(36, parseInt(e.target.value) || 42))} min={36} /></div>
 </div>
 </div>

 {/* ② PRIMARY RESULTS */}
 <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(280,50%,55%)" }}>
 <h2 className={styles.calcTitle}>② Cutting Dimensions</h2>
 <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-start" }}>
 <div style={{ flex: 1, minWidth: 200 }}>
 <div className="result-card" style={{ textAlign: "center", padding: 16 }}>
 <div className="result-prefix">Pinwheel Block</div>
 <div className="result-value" style={{ fontSize: 30 }}>{toF(finBlock)} finished</div>
 <div className="result-label">Each HST: {toF(calc.hstFin)} finished</div>
 </div>
 <div className={styles.resultDetails} style={{ marginTop: 8 }}>
 <div className="result-row"><span>Cut squares ({method === "2at" ? "2-at-a-time" : "4-at-a-time"})</span><strong style={{ color: "hsl(280,50%,45%)" }}>{toF(calc.cutSq)} × {toF(calc.cutSq)}</strong></div>
 <div className="result-row"><span>Unfinished HST</span><strong>{toF(calc.unfin)} × {toF(calc.unfin)}</strong></div>
 <div className="result-row"><span>HSTs per block</span><strong>4</strong></div>
 <div className="result-row"><span>Squares per block per color</span><strong>{calc.sqPerBlock}</strong></div>
 </div>
 <div style={{ marginTop: 8, padding: 8, background: "hsl(280,12%,97%)", borderRadius: 6, fontSize: 12 }}>
 <strong>Per block:</strong><br />Color A (dark): <strong>{calc.sqPerBlock} square{calc.sqPerBlock >1 ? "s" : ""}</strong>at {toF(calc.cutSq)}<br />Color B (light): <strong>{calc.sqPerBlock} square{calc.sqPerBlock >1 ? "s" : ""}</strong>at {toF(calc.cutSq)}
 </div>
 {method === "2at" && <div style={{ marginTop: 6, fontSize: 11, color: "var(--color-text-tertiary)" }}>
 4-at-a-time alternative: cut at {toF(calc.cut4)} (1 sq each color per block)
 </div>}
 </div>
 <div style={{ textAlign: "center" }}>
 {svgBlock}
 <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 4 }}>Clockwise spin</div>
 </div>
 </div>
 </div>

 {/* ★ HST ORIENTATION — ALWAYS VISIBLE */}
 <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(40,70%,50%)", background: "hsl(40,20%,98%)" }}>
 <h2 className={styles.calcTitle}>⚠ Critical: HST Orientation</h2>
 <div style={{ fontSize: 12, lineHeight: 2 }}>
 <p style={{ fontWeight: 600, color: "hsl(40,70%,35%)", marginBottom: 6 }}>This is the step that makes or breaks your pinwheel. All dark triangles must point toward the center in a spinning pattern.</p>
 <div style={{ fontFamily: "monospace", fontSize: 12, padding: 10, background: "hsl(0,0%,97%)", borderRadius: 6, lineHeight: 1.8, marginBottom: 8 }}>Clockwise arrangement:<br />
 ┌─────┬─────┐<br />
 │ ■ ╲ │ ╱ ■ │ &nbsp;← dark triangles<br />
 │ &nbsp;╲□│□╱ &nbsp;│ &nbsp;&nbsp;&nbsp; point to center<br />
 ├─────┼─────┤<br />
 │□╱ &nbsp;│ &nbsp;╲□│<br />
 │╱ ■ │ ■ ╲ │<br />
 └─────┴─────┘
 </div>
 <div style={{ fontSize: 11, background: "hsl(40,30%,95%)", padding: 8, borderRadius: 6 }}>
 <strong>Simple rule:</strong>Place HST #1 dark top-left → Rotate #2 by 90° CW (dark top-right) → #3 by 180° (dark bottom-right) → #4 by 270° (dark bottom-left). <strong>Photo tip:</strong>Take a photo of your arrangement before picking up pieces!
 </div>
 </div>
 </div>

 {/* Toolbar */}
 <div className="toolbar" style={{ marginBottom: 10 }}>
 <button className="btn btn-secondary btn-sm" onClick={() =>navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} />Copy</button>
 <button className="btn btn-secondary btn-sm" onClick={() =>window.print()}><Printer size={13} />Print</button>
 </div>

 {/* ═══ ASSEMBLY ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowAssembly(!showAssembly)}>Step-by-Step Assembly
 <ChevronDown size={14} style={{ transform: showAssembly ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showAssembly && (
 <div style={{ marginTop: 10, fontSize: 12, lineHeight: 2 }}>
 {[
 { step: 1, title: "Make 4 HSTs", items: [`Cut ${calc.sqPerBlock} Color A squares at ${toF(calc.cutSq)}`, `Cut ${calc.sqPerBlock} Color B squares at ${toF(calc.cutSq)}`, "Draw diagonal on wrong side of lighter squares", "Pair A+B right sides together, stitch ¼\" each side of diagonal", `Cut apart on diagonal → 4 HSTs`, `Press seams toward dark. Trim to ${toF(calc.unfin)}`] },
 { step: 2, title: "Arrange HSTs", items: ["Lay all 4 in a 2×2 grid", "Rotate so dark triangles all point toward center", "Verify spinning effect from a distance", " Take a photo of arrangement!"] },
 { step: 3, title: "Sew Rows", items: ["Sew top two HSTs together (RST)", "Press seam to one side", "Sew bottom two HSTs", "Press seam OPPOSITE direction (for nesting)"] },
 { step: 4, title: "Join Rows", items: ["Place rows RST, nest seams at center", "Sew center seam", "Apply twirl technique at center (or press open)", `Block should measure ${toF(calc.unfin + calc.hstFin)} unfinished, ${toF(finBlock)} finished`] },
 ].map(s =>(
 <div key={s.step} style={{ padding: 10, background: s.step % 2 === 1 ? "hsl(280,10%,97%)" : "hsl(0,0%,97%)", borderRadius: 6, marginBottom: 6 }}>
 <strong>Step {s.step}: {s.title}</strong>
 <ul style={{ paddingLeft: 16, margin: "4px 0 0", fontSize: 11 }}>
 {s.items.map((item, i) =><li key={i}>{item}</li>)}
 </ul>
 </div>
 ))}
 </div>
 )}
 </div>

 {/* ═══ TWIRL ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowTwirl(!showTwirl)}>Twirl Pressing Technique
 <ChevronDown size={14} style={{ transform: showTwirl ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showTwirl && (
 <div style={{ marginTop: 10, fontSize: 12, lineHeight: 2, color: "var(--color-text-secondary)" }}>
 <div style={{ padding: 8, background: "hsl(280,10%,97%)", borderRadius: 6, marginBottom: 8 }}>The center of a pinwheel has <strong>8 seam allowances</strong>meeting at one point. Without special pressing, this creates a hard, bulky bump.
 </div>
 {[
 "With block face-DOWN, locate the center intersection",
 "Unsew the last 1–2 stitches of each seam AT the center (just the crossing stitches)",
 "Fan the 4 freed seam allowance tabs in a CLOCKWISE circle",
 "Press from the right side — center lies perfectly flat",
 ].map((s, i) =>(
 <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
 <span style={{ width: 20, height: 20, borderRadius: "50%", background: "hsl(280,40%,55%)", color: "#fff", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
 <span>{s}</span>
 </div>
 ))}
 <div style={{ marginTop: 8, fontSize: 11, background: "hsl(0,0%,97%)", padding: 6, borderRadius: 4 }}>
 <strong>Alternative:</strong>Press ALL seams open — also creates flat centers but may be slightly less sturdy.
 </div>
 </div>
 )}
 </div>

 {/* ═══ YARDAGE ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowYardage(!showYardage)}>Yardage for {blockCount} Blocks
 <ChevronDown size={14} style={{ transform: showYardage ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showYardage && (
 <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9 }}>
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
 <div style={{ padding: 12, background: "hsl(220,15%,96%)", borderRadius: 8, textAlign: "center" }}>
 <div style={{ fontWeight: 700 }}>Color A (Dark)</div>
 <div style={{ fontSize: 10 }}>{yard.totalSqA} squares at {toF(calc.cutSq)}</div>
 <div style={{ fontSize: 10 }}>{yard.stripsA} strips ({yard.sqPerWOF}/strip)</div>
 <div style={{ fontSize: 24, fontWeight: 800, color: "hsl(220,50%,40%)" }}>{toFrac(yard.buyA)} yd</div>
 <div style={{ fontSize: 10 }}>({yard.ydA.toFixed(2)} yd exact)</div>
 </div>
 <div style={{ padding: 12, background: "hsl(45,20%,96%)", borderRadius: 8, textAlign: "center" }}>
 <div style={{ fontWeight: 700 }}>Color B (Light)</div>
 <div style={{ fontSize: 10 }}>{yard.totalSqB} squares at {toF(calc.cutSq)}</div>
 <div style={{ fontSize: 10 }}>{yard.stripsB} strips ({yard.sqPerWOF}/strip)</div>
 <div style={{ fontSize: 24, fontWeight: 800, color: "hsl(45,50%,35%)" }}>{toFrac(yard.buyB)} yd</div>
 <div style={{ fontSize: 10 }}>({yard.ydB.toFixed(2)} yd exact)</div>
 </div>
 </div>
 <div style={{ padding: 8, background: "hsl(0,0%,97%)", borderRadius: 6, textAlign: "center", fontWeight: 700 }}>Total: {toFrac(yard.buyA + yard.buyB)} yards
 </div>
 {method === "2at" && (
 <div style={{ marginTop: 8, fontSize: 11, color: "var(--color-text-tertiary)" }}>
 4-at-a-time comparison: {blockCount} squares at {toF(calc.cut4)} per color.
 {(() =>{ const sq4 = Math.floor(fabricWidth / calc.cut4); const st4 = Math.ceil(blockCount / sq4); const yd4 = (st4 * calc.cut4) / 36; const buy4 = Math.ceil(yd4 * 8) / 8; return ` Buy ${toFrac(buy4)} yd each (saves ${toFrac(yard.buyA - buy4)} yd per color).`; })()}
 </div>
 )}
 </div>
 )}
 </div>

 {/* ═══ DOUBLE PINWHEEL ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowDouble(!showDouble)}>Double Pinwheel Calculator
 <ChevronDown size={14} style={{ transform: showDouble ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showDouble && (
 <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9 }}>
 <div style={{ padding: 8, background: "hsl(280,10%,97%)", borderRadius: 6, marginBottom: 8 }}>Two nested spinning elements: large outer blades + small inner blades.
 </div>
 <div className={styles.resultDetails}>
 <div className="result-row"><span>Block size</span><strong>{toF(finBlock)} finished</strong></div>
 <div className="result-row"><span>Outer HST finished</span><strong>{toF(dbl.outerHST)}</strong></div>
 <div className="result-row"><span>Outer cut (2-at-a-time)</span><strong>{toF(dbl.outerCut)}</strong></div>
 <div className="result-row"><span>Inner HST finished</span><strong>{toF(dbl.innerHST)}</strong></div>
 <div className="result-row"><span>Inner cut (2-at-a-time)</span><strong>{toF(dbl.innerCut)}</strong></div>
 </div>
 <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600 }}>Per double pinwheel block:</div>
 <div className={styles.resultDetails}>
 <div className="result-row"><span>Outer: Color A + BG</span><strong>2+2 squares at {toF(dbl.outerCut)}</strong></div>
 <div className="result-row"><span>Inner: Color B + BG</span><strong>2+2 squares at {toF(dbl.innerCut)}</strong></div>
 <div className="result-row"><span>Total pieces</span><strong>8 HST units</strong></div>
 </div>
 {finBlock % 4 !== 0 && <div style={{ marginTop: 6, fontSize: 11, color: "hsl(40,70%,45%)" }}>⚠ For best results, block size should be divisible by 4 for equal inner/outer HSTs.</div>}
 </div>
 )}
 </div>

 {/* ═══ PRE-CUT ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowPrecut(!showPrecut)}>
 ✂️ Pinwheels from Pre-Cut Fabrics
 <ChevronDown size={14} style={{ transform: showPrecut ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showPrecut && (
 <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9 }}>
 {[
 { name: "Charm Squares (5\")", hst: "4.125\" → trim to 4\"", block: "8\" finished", perBlock: "2 dark + 2 light charms", from42: "42-piece charm pack: 21 pairs → 42 HSTs → 10 blocks + 2 leftover HSTs" },
 { name: "Layer Cakes (10\")", hst: "9.125\" → trim to 9\"", block: "18\" (very large)", perBlock: "2 + 2 layer cakes", from42: "Better: sub-cut each 10\" square into four 5\" charms for 8\" blocks" },
 { name: "Jelly Rolls (2.5\")", hst: "1.625\" → trim to 1.5\"", block: "3\" (very small)", perBlock: "Sub-cut strips into 2.5\" squares", from42: "Small pinwheels — advanced sewing required" },
 ].map((pc, i) =>(
 <div key={i} style={{ padding: 10, background: i % 2 === 0 ? "hsl(280,10%,97%)" : "hsl(0,0%,97%)", borderRadius: 6, marginBottom: 6 }}>
 <strong>{pc.name}</strong>
 <div style={{ fontSize: 11, marginTop: 2 }}>HST: {pc.hst} | Block: {pc.block}</div>
 <div style={{ fontSize: 11 }}>Per block: {pc.perBlock}</div>
 <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>{pc.from42}</div>
 </div>
 ))}
 </div>
 )}
 </div>

 {/* ═══ BORDER PLANNER ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowBorder(!showBorder)}>
 ️ Pinwheel Border Planner
 <ChevronDown size={14} style={{ transform: showBorder ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showBorder && (
 <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9 }}>
 <div className="input-group" style={{ marginBottom: 8 }}>
 <label className="input-label">Quilt edge length (inches)</label>
 <input type="number" className="input-field" value={borderEdge} onChange={e =>setBorderEdge(Math.max(4, parseInt(e.target.value) || 60))} min={4} />
 </div>
 <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Sizes that fit perfectly:</div>
 {[4, 5, 6, 8, 10, 12].filter(s =>borderEdge % s === 0).map(s =>(
 <div key={s} style={{ padding: 6, background: "hsl(0,0%,97%)", borderRadius: 4, marginBottom: 2, fontSize: 11 }}>
 <strong>{s}&quot; pinwheels:</strong>{borderEdge / s} blocks per side | All 4 sides: {(borderEdge / s) * 4} blocks (corners shared)
 </div>
 ))}
 {[4, 5, 6, 8, 10, 12].filter(s =>borderEdge % s === 0).length === 0 && (
 <div style={{ fontSize: 11, color: "hsl(40,70%,45%)" }}>No standard size divides evenly. Consider adjusting quilt size or using partial pinwheels at corners.</div>
 )}
 </div>
 )}
 </div>

 {/* ═══ REFERENCE TABLE ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>Pinwheel Quick Reference</h2>
 <div style={{ overflowX: "auto" }}>
 <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
 <thead><tr>
 <th style={tH}>Block</th><th style={tH}>HST Fin</th><th style={tH}>Cut (2-at)</th><th style={tH}>Cut (4-at)</th><th style={{ ...tH, ...tR }}>Sq/Block</th>
 </tr></thead>
 <tbody>{refSizes.map(b =>{
 const hst = b / 2, c2 = hst + 0.875, c4 = hst + 1.25;
 const active = b === finBlock;
 return (
 <tr key={b} style={{ background: active ? "hsl(280,20%,93%)" : undefined, cursor: "pointer" }} onClick={() =>setFinBlock(b)}>
 <td style={{ ...tD, fontWeight: 600 }}>{toF(b)}</td>
 <td style={tD}>{toF(hst)}</td>
 <td style={{ ...tD, fontWeight: 600 }}>{toF(c2)}</td>
 <td style={tD}>{toF(c4)}</td>
 <td style={{ ...tD, ...tR }}>2+2 / 1+1</td>
 </tr>
 );
 })}</tbody>
 </table>
 </div>
 <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 4 }}>Squares per block: Color A + Color B for 2-at-time / 4-at-time</div>
 </div>

 {/* ═══ TROUBLESHOOTING ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowTrouble(!showTrouble)}>Troubleshooting Pinwheel Blocks
 <ChevronDown size={14} style={{ transform: showTrouble ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showTrouble && (
 <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9, color: "var(--color-text-secondary)" }}>
 {[
 { title: "Pinwheel looks flat — no spin", cause: "HSTs not rotated correctly. Even one backwards HST breaks the illusion.", fix: "Disassemble, lay flat, rotate all dark triangles toward center. No two dark triangles should touch edge-to-edge." },
 { title: "Bulky center bump", cause: "8 seam allowances meeting without twirl technique.", fix: "Use twirl pressing: unsew last 1–2 stitches at center, fan seam allowances clockwise, press flat. Or press all seams open." },
 { title: "HSTs are different sizes", cause: "Inconsistent cutting or seam allowance.", fix: `Trim ALL HSTs to exactly ${toF(calc.unfin)} before assembling. Use a square ruler with 45° line aligned to diagonal seam.` },
 { title: "Points don't meet at center", cause: "HST trimming not aligned with diagonal seam.", fix: "When trimming: 45° ruler line MUST align with HST seam. The ruler's center mark = block center." },
 ].map((t, i) =>(
 <div key={i} style={{ padding: 8, background: i % 2 === 0 ? "hsl(0,0%,97%)" : "transparent", borderRadius: 6, marginBottom: 4 }}>
 <strong style={{ color: "var(--color-text-primary)" }}>{t.title}</strong><br />
 <span style={{ fontSize: 11 }}>Cause: {t.cause}</span><br />
 <span style={{ fontSize: 11, color: "hsl(150,50%,35%)" }}>Fix: {t.fix}</span>
 </div>
 ))}
 </div>
 )}
 </div>

 {/* ═══ EDUCATIONAL ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowEdu(!showEdu)}>Understanding Pinwheel Blocks
 <ChevronDown size={14} style={{ transform: showEdu ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showEdu && (
 <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.9, color: "var(--color-text-secondary)" }}>
 <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>What Makes a Pinwheel Spin?</h4>
 <p style={{ fontSize: 12 }}>The spinning effect is an optical illusion from value contrast. Dark triangles arranged in rotation create &quot;blades&quot; the brain perceives as motion. If even one HST is reversed, the illusion breaks. High contrast (dark navy + light cream) = dramatic spin. Similar values = flat-looking block. Tip: view fabrics in black &amp; white — high contrast = spinning pinwheel.</p>
 <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 10 }}>Secondary Patterns</h4>
 <p style={{ fontSize: 12 }}>When sewn together: <strong>Same spin</strong>= whole quilt appears as one giant pinwheel. <strong>Alternating</strong>= hourglasses/bowties at intersections. <strong>Pairs facing</strong>= star secondary pattern. Plan spin direction BEFORE making blocks — you can&apos;t change it after sewing.</p>
 <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 10 }}>Pinwheel Variations</h4>
 <div style={{ overflowX: "auto" }}>
 <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
 <thead><tr><th style={tH}>Variation</th><th style={tH}>Units</th><th style={tH}>Difficulty</th><th style={tH}>Effect</th></tr></thead>
 <tbody>
 {[["Simple 2-color", "4 HSTs", "Beginner", "Classic spin"], ["4-color", "4 HSTs", "Beginner", "Rainbow spin"], ["Double pinwheel", "8 HSTs", "Intermediate", "Nested spin"], ["Windmill", "4 Flying Geese", "Intermediate", "Elongated blades"], ["Pinwheel Star", "12 HSTs+sq", "Intermediate", "Star + spin"]].map(([n, u, d, e], i) =>(
 <tr key={i}><td style={tD}>{n}</td><td style={tD}>{u}</td><td style={tD}>{d}</td><td style={tD}>{e}</td></tr>
 ))}
 </tbody>
 </table>
 </div>
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
 <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Quick Reference</h4>
 <div style={{ fontSize: 12, lineHeight: 2.2, color: "var(--color-text-secondary)" }}>
 <div>Block: <strong>{toF(finBlock)}</strong></div>
 <div>HST: <strong>{toF(calc.hstFin)} fin</strong></div>
 <div>Cut: <strong>{toF(calc.cutSq)}</strong></div>
 <div>Per block: <strong>{calc.sqPerBlock}+{calc.sqPerBlock} sq</strong></div>
 <div>HSTs/block: <strong>4</strong></div>
 </div>
 </div>
 <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
 <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>The Formulas</h4>
 <div style={{ fontSize: 11, padding: 8, background: "hsl(0,0%,96%)", borderRadius: 6, fontFamily: "monospace", lineHeight: 2 }}>HST = Block ÷ 2<br />
 2-at: HST + ⅞&quot;<br />
 4-at: HST + 1¼&quot;<br />
 4 HSTs = 1 block
 </div>
 </div>
 <div className="glass-card related-tools">
 <h4>Related Tools</h4>
 <a href="/quilt/hst-calculator" className="related-tool-link">HST Calculator</a>
 <a href="/quilt/flying-geese-calculator" className="related-tool-link">Flying Geese Calculator</a>
 <a href="/quilt/snowball-calculator" className="related-tool-link">Snowball Calculator</a>
 <a href="/quilt/size-calculator" className="related-tool-link">Quilt Size Calculator</a>
 <a href="/quilt/backing-calculator" className="related-tool-link">Backing Calculator</a>
 <a href="/quilt/binding-calculator" className="related-tool-link">Binding Calculator</a>
 <a href="/quilt/border-calculator" className="related-tool-link">Border Calculator</a>
 <a href="/quilt" className="related-tool-link">All Quilt Tools</a>
 </div>
 </aside>
 </div>
 </div>
 );
}