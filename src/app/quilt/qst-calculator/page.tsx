"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, ChevronDown, Triangle } from "lucide-react";

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

/* Ref table sizes */
const refSizes = [2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10, 12];

/* FAQ */
const faqItems = [
 { q: "What is a quarter-square triangle in quilting?", a: "A QST is a square unit made from four triangles created by cutting a square on both diagonals. It has TWO seam lines forming an X. Also called an \"hourglass\" block when using two alternating colors. The key difference from an HST: the straight grain runs along the long edge (hypotenuse)." },
 { q: "What is the formula for cutting quarter-square triangles?", a: "Cut size = Finished size + 1¼\" (1.25\"). Example: 4\" finished QST → cut squares at 5¼\". This is different from HSTs which add only ⅞\". The extra accounts for two diagonal seams instead of one." },
 { q: "What is the difference between QST and HST?", a: "HST: 1 diagonal seam, 2 triangles, adds ⅞\" to finished size. Straight grain on short legs. QST: 2 diagonal seams, 4 triangles, adds 1¼\" to finished size. Straight grain on hypotenuse. They look completely different even at the same finished size." },
 { q: "How do I make hourglass blocks?", a: "Make two HSTs first (cut at finished + 1¼\", stitch diagonal, cut, press). Then pair two HSTs right sides together with seams opposing. Draw diagonal perpendicular to existing seam. Stitch ¼\" each side, cut apart → 2 QST hourglass units. Press seams open." },
 { q: "Why does the QST formula add 1¼ inches?", a: "The first diagonal seam (making HSTs) uses ⅞\". The second diagonal seam (combining HSTs into QST) adds another ⅜\". Total: ⅞\" + ⅜\" = 1¼\". It accounts for seam allowances on both diagonal cuts." },
 { q: "How do I make a four-color QST?", a: "Cut 4 squares (one per fabric) at finished + 1¼\". Cut each on both diagonals (4 triangles each). Use 1 triangle from each fabric. Sew pairs along short legs, then join pairs on hypotenuse. Handle bias edges carefully — use starch for stability." },
 { q: "What size do I cut for a 4-inch QST?", a: "4\" + 1¼\" = 5¼\" squares for the Two-HST method. For the No-waste method: 5½\" squares (yields 8 QSTs per pair but requires trimming). The Two-HST method is most accurate for beginners." },
 { q: "How do I trim QST units accurately?", a: "QST trimming is harder than HST trimming — you have 2 seams to align. Use a square ruler with 45° line through BOTH seams. Place the center mark at the seam intersection. Trim from center out, rotate 180°, trim remaining sides. Specialty rulers (Bloc Loc) grip the seam intersection." },
 { q: "Why won't my QST points meet in the center?", a: "Three common causes: 1) HSTs pressed to side instead of open (causing bulk). 2) Second diagonal not drawn perpendicular to first seam. 3) HSTs not nested before sewing. Solution: press HSTs open, use ruler for 90° angle, and ensure seams oppose when pairing." },
 { q: "How do I make Ohio Star points using QSTs?", a: "An Ohio Star block (12\" finished) uses 4 QST units at 4\" finished as star points. Cut squares at 5¼\". Make 4 QSTs using the Two-HST method. Place them at the side positions of a 3×3 block grid with the center and corners as plain squares." },
 { q: "When should I use a QST instead of an HST?", a: "Use QSTs when the long diagonal edge is on the outside of the block (Ohio Star points, setting triangles). Use HSTs when the short edges are on the outside (sawtooth borders). The key: outer edges should be on straight grain for stability." },
 { q: "What size do I cut for a 6-inch hourglass block?", a: "6\" + 1¼\" = 7¼\" squares. This gives you QST hourglass blocks that finish at exactly 6\" × 6\". Using the No-waste method (cut at 7½\"), you'd get 8 hourglass blocks per pair of squares but need to trim each to 6½\" unfinished." },
];

export default function Page() {
 const [mode, setMode] = useState<"A" | "B">("A");
 const [finQST, setFinQST] = useState(4);
 const [cutInput, setCutInput] = useState(5.25);
 const [qstCount, setQstCount] = useState(20);
 const [fabricWidth, setFabricWidth] = useState(42);
 const [showConstruction, setShowConstruction] = useState(false);
 const [showFourColor, setShowFourColor] = useState(false);
 const [showYardage, setShowYardage] = useState(false);
 const [showTrimming, setShowTrimming] = useState(false);
 const [showBlocks, setShowBlocks] = useState(false);
 const [showTrouble, setShowTrouble] = useState(false);
 const [showEdu, setShowEdu] = useState(false);
 const [activeFaq, setActiveFaq] = useState<number | null>(null);

 const calc = useMemo(() =>{
 let fin: number, twoHST: number, noWaste: number, unfin: number;
 if (mode === "A") {
 fin = finQST;
 twoHST = fin + 1.25;
 noWaste = fin + 1.5;
 unfin = fin + 0.5;
 } else {
 twoHST = cutInput;
 fin = twoHST - 1.25;
 noWaste = fin + 1.5;
 unfin = fin + 0.5;
 }
 // HST comparison
 const hstCut = fin + 0.875;
 // Yield per pair
 const yieldTwoHST = 2; // per pair of squares
 const yieldNoWaste = 8; // per pair of squares
 // Squares per WOF
 const sqPerWOF2 = Math.floor(fabricWidth / twoHST);
 const sqPerWOFnw = Math.floor(fabricWidth / noWaste);
 return { fin, twoHST, noWaste, unfin, hstCut, yieldTwoHST, yieldNoWaste, sqPerWOF2, sqPerWOFnw };
 }, [mode, finQST, cutInput, fabricWidth]);

 // Yardage (Two-HST method)
 const yard = useMemo(() =>{
 const pairsNeeded = Math.ceil(qstCount / calc.yieldTwoHST);
 const sqPerColor = pairsNeeded; // 1 sq each color per pair
 const stripsPerColor = Math.ceil(sqPerColor / Math.max(calc.sqPerWOF2, 1));
 const inPerColor = stripsPerColor * calc.twoHST;
 const ydPerColor = inPerColor / 36;
 const buyPerColor = Math.ceil(ydPerColor * 8) / 8;
 // No-waste comparison
 const nwPairs = Math.ceil(qstCount / calc.yieldNoWaste);
 const nwStrips = Math.ceil(nwPairs / Math.max(calc.sqPerWOFnw, 1));
 const nwYd = (nwStrips * calc.noWaste) / 36;
 const nwBuy = Math.ceil(nwYd * 8) / 8;
 return { pairsNeeded, sqPerColor, stripsPerColor, ydPerColor, buyPerColor, nwPairs, nwBuy };
 }, [qstCount, calc]);

 const tH = { padding: "5px 8px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left" as const, fontSize: 11, fontWeight: 600 as const };
 const tD = { padding: "4px 8px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11 };
 const tR = { textAlign: "right" as const };

 // SVG QST unit
 const svgQST = (
 <svg viewBox="0 0 100 100" style={{ width: 110, height: 110 }}>
 <polygon points="0,0 50,50 100,0" fill="hsl(220,45%,42%)" />
 <polygon points="100,0 50,50 100,100" fill="hsl(45,60%,85%)" />
 <polygon points="100,100 50,50 0,100" fill="hsl(220,45%,42%)" />
 <polygon points="0,100 50,50 0,0" fill="hsl(45,60%,85%)" />
 <line x1="0" y1="0" x2="100" y2="100" stroke="hsl(0,0%,65%)" strokeWidth="1" />
 <line x1="100" y1="0" x2="0" y2="100" stroke="hsl(0,0%,65%)" strokeWidth="1" />
 <rect x="0" y="0" width="100" height="100" fill="none" stroke="hsl(0,0%,80%)" strokeWidth="1" />
 </svg>
 );

 const copyText = `QST: ${toF(calc.fin)} finished. Cut squares at ${toF(calc.twoHST)} (Two-HST method). Yield: 2 QSTs per pair. Unfinished: ${toF(calc.unfin)}. For ${qstCount} QSTs: ${toFrac(yard.buyPerColor)} yd each color.`;

 return (
 <div className="container">
 <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "QST Calculator" }]} />
 <div className="calculator-layout">
 <div className="calculator-main">
 <div className={styles.toolHeader}>
 <span className="category-badge"><Triangle size={14} strokeWidth={1.5} />Quilt #148</span>
 <h1>Quarter-Square Triangle (QST) Calculator</h1>
 <p>Calculate cutting sizes for quarter-square triangles and hourglass blocks. All construction methods, QST vs HST comparison, four-color QSTs, yardage calculator, and block context guide.</p>
 </div>

 {/* ① INPUT */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>① QST Size</h2>
 <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
 {([["A", "Finished Size → Cut"], ["B", "Cut Size → Finished"]] as const).map(([m, label]) =>(
 <button key={m} className={`btn btn-sm ${mode === m ? "btn-primary" : "btn-ghost"}`} onClick={() =>setMode(m)}>{label}</button>
 ))}
 </div>
 {mode === "A" ? (
 <div className="input-group">
 <label className="input-label">Finished QST size (inches)</label>
 <input type="number" className="input-field" value={finQST} onChange={e =>setFinQST(Math.max(1, parseFloat(e.target.value) || 4))} min={1} step={0.5} />
 <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
 {[2, 3, 4, 5, 6, 8, 10, 12].map(s =>(
 <button key={s} className={`btn btn-sm ${finQST === s ? "btn-primary" : "btn-ghost"}`} onClick={() =>setFinQST(s)} style={{ fontSize: 10 }}>{s}&quot;</button>
 ))}
 </div>
 </div>
 ) : (
 <div className="input-group">
 <label className="input-label">Cut square size (inches)</label>
 <input type="number" className="input-field" value={cutInput} onChange={e =>setCutInput(Math.max(2, parseFloat(e.target.value) || 5.25))} min={2} step={0.25} />
 </div>
 )}
 <div className="calculator-form-row" style={{ marginTop: 8 }}>
 <div className="input-group"><label className="input-label">QSTs needed</label>
 <input type="number" className="input-field" value={qstCount} onChange={e =>setQstCount(Math.max(1, parseInt(e.target.value) || 1))} min={1} /></div>
 <div className="input-group"><label className="input-label">Usable WOF</label>
 <input type="number" className="input-field" value={fabricWidth} onChange={e =>setFabricWidth(Math.max(36, parseInt(e.target.value) || 42))} min={36} /></div>
 </div>
 </div>

 {/* ② RESULTS — ALL METHODS */}
 <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(260,50%,55%)" }}>
 <h2 className={styles.calcTitle}>② Cutting Sizes — All Methods</h2>
 <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-start" }}>
 <div style={{ flex: 1, minWidth: 200 }}>
 <div className="result-card" style={{ textAlign: "center", padding: 16 }}>
 <div className="result-prefix">Finished QST</div>
 <div className="result-value" style={{ fontSize: 30 }}>{toF(calc.fin)}</div>
 <div className="result-label">Unfinished: {toF(calc.unfin)}</div>
 </div>
 <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
 <div style={{ padding: 10, background: "hsl(260,12%,97%)", borderRadius: 6, textAlign: "center" }}>
 <div style={{ fontSize: 10, fontWeight: 600 }}>Two-HST Method</div>
 <div style={{ fontSize: 22, fontWeight: 800, color: "hsl(260,50%,45%)" }}>{toF(calc.twoHST)}</div>
 <div style={{ fontSize: 10 }}>Yield: 2 QSTs/pair</div>
 <div style={{ fontSize: 9, color: "hsl(150,50%,40%)" }}>★ Most common</div>
 </div>
 <div style={{ padding: 10, background: "hsl(150,12%,97%)", borderRadius: 6, textAlign: "center" }}>
 <div style={{ fontSize: 10, fontWeight: 600 }}>No-Waste Method</div>
 <div style={{ fontSize: 22, fontWeight: 800, color: "hsl(150,50%,40%)" }}>{toF(calc.noWaste)}</div>
 <div style={{ fontSize: 10 }}>Yield: 8 QSTs/pair</div>
 <div style={{ fontSize: 9 }}>Trim to {toF(calc.unfin)}</div>
 </div>
 </div>
 <div style={{ marginTop: 6, fontSize: 11, padding: 6, background: "hsl(0,0%,97%)", borderRadius: 4 }}>
 <strong>Formula:</strong>QST cut = Finished + 1¼&quot; | No-waste = Finished + 1½&quot;
 </div>
 </div>
 <div style={{ textAlign: "center" }}>
 {svgQST}
 <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 4 }}>Hourglass / QST unit</div>
 </div>
 </div>
 </div>

 {/* ★ QST vs HST — ALWAYS VISIBLE */}
 <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(40,70%,50%)", background: "hsl(40,15%,98%)" }}>
 <h2 className={styles.calcTitle}>QST vs HST — Key Difference</h2>
 <div style={{ overflowX: "auto" }}>
 <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
 <thead><tr><th style={tH}></th><th style={tH}>HST</th><th style={{ ...tH, background: "hsl(260,15%,93%)" }}>QST</th></tr></thead>
 <tbody>
 {[
 ["Diagonal seams", "1", "2 (X shape)"],
 ["Triangles", "2", "4"],
 ["Formula adds", "+ ⅞\" (0.875\")", "+ 1¼\" (1.25\")"],
 [`Cut for ${toF(calc.fin)} fin`, toF(calc.hstCut), toF(calc.twoHST)],
 ["Long edge grain", "BIAS", "STRAIGHT"],
 ["Short edge grain", "STRAIGHT", "BIAS"],
 ["Best for", "Sawtooth borders", "Ohio Star points"],
 ["Looks like", "Triangle in square", "Hourglass / pinwheel"],
 ].map(([label, hst, qst], i) =>(
 <tr key={i}><td style={{ ...tD, fontWeight: 600 }}>{label}</td><td style={tD}>{hst}</td><td style={{ ...tD, background: "hsl(260,10%,97%)" }}>{qst}</td></tr>
 ))}
 </tbody>
 </table>
 </div>
 <div style={{ marginTop: 6, fontSize: 11, padding: 6, background: "hsl(40,20%,96%)", borderRadius: 4 }}>
 <strong>When to use which:</strong>Use HST when short edges are on the block outside. Use QST when the long diagonal edge is on the outside (Ohio Star points, setting triangles).
 </div>
 </div>

 {/* Toolbar */}
 <div className="toolbar" style={{ marginBottom: 10 }}>
 <button className="btn btn-secondary btn-sm" onClick={() =>navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} />Copy</button>
 <button className="btn btn-secondary btn-sm" onClick={() =>window.print()}><Printer size={13} />Print</button>
 </div>

 {/* ═══ TWO-HST CONSTRUCTION ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowConstruction(!showConstruction)}>Two-HST Method (Step-by-Step)
 <ChevronDown size={14} style={{ transform: showConstruction ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showConstruction && (
 <div style={{ marginTop: 10, fontSize: 12, lineHeight: 2 }}>
 {[
 { step: 1, title: "Cut Squares", bg: "hsl(260,10%,97%)", items: [`Light fabric: cut squares at ${toF(calc.twoHST)}`, `Dark fabric: cut squares at ${toF(calc.twoHST)}`, `Per QST pair: 1 light + 1 dark square`] },
 { step: 2, title: "Make HSTs", bg: "hsl(0,0%,97%)", items: ["Draw diagonal on wrong side of light square", "Layer light+dark right sides together", "Stitch ¼\" each side of diagonal line", "Cut apart on line → 2 HSTs", "Press seams open (recommended for QSTs)"] },
 { step: 3, title: "Pair HSTs into QSTs", bg: "hsl(150,10%,97%)", items: ["Place 2 HSTs right sides together, seams opposing", "Dark triangle faces light triangle (creates hourglass)", "Draw diagonal PERPENDICULAR to existing seam", "Stitch ¼\" each side of new line", "Cut apart → 2 QST units"] },
 { step: 4, title: "Check & Trim", bg: "hsl(40,10%,97%)", items: [`QST should measure ${toF(calc.unfin)} unfinished`, "Press seams open for flat center", `Trim to ${toF(calc.unfin)} with 45° ruler if needed`, `Finished: ${toF(calc.fin)} after sewing into quilt`] },
 ].map(s =>(
 <div key={s.step} style={{ padding: 10, background: s.bg, borderRadius: 6, marginBottom: 6 }}>
 <strong>Step {s.step}: {s.title}</strong>
 <ul style={{ paddingLeft: 16, margin: "4px 0 0", fontSize: 11 }}>
 {s.items.map((item, i) =><li key={i}>{item}</li>)}
 </ul>
 </div>
 ))}
 <div style={{ padding: 8, background: "hsl(0,0%,96%)", borderRadius: 6, fontSize: 11 }}>
 <strong>Yield:</strong>1 light + 1 dark square → 2 HSTs → 2 QSTs. For {qstCount} QSTs: {yard.sqPerColor} squares per color.
 </div>
 </div>
 )}
 </div>

 {/* ═══ FOUR-COLOR ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowFourColor(!showFourColor)}>Four-Color QST (Advanced)
 <ChevronDown size={14} style={{ transform: showFourColor ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showFourColor && (
 <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9 }}>
 <div style={{ padding: 8, background: "hsl(40,20%,96%)", borderRadius: 6, marginBottom: 8 }}>
 ⚠ <strong>Each triangle is a different fabric.</strong>Triangles have bias edges on short legs — handle carefully, use starch.
 </div>
 <div className={styles.resultDetails}>
 <div className="result-row"><span>Cut each fabric at</span><strong>{toF(calc.twoHST)} × {toF(calc.twoHST)}</strong></div>
 <div className="result-row"><span>Cut each square on both diagonals</span><strong>4 triangles per square</strong></div>
 <div className="result-row"><span>Use 1 triangle per fabric</span><strong>4 fabrics = 1 QST</strong></div>
 <div className="result-row"><span>Spare triangles per square</span><strong>3 (use for other QSTs)</strong></div>
 </div>
 <div style={{ marginTop: 8, fontSize: 11 }}>
 <strong>Assembly:</strong>Sew A+B along short legs → Sew C+D along short legs → Join pairs on hypotenuse → Press open.
 </div>
 <div style={{ marginTop: 6, fontSize: 11 }}>
 <strong>Per fabric for {qstCount} QSTs:</strong>{Math.ceil(qstCount / 4)} squares at {toF(calc.twoHST)} (each yields 4 triangles)
 </div>
 </div>
 )}
 </div>

 {/* ═══ YARDAGE ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowYardage(!showYardage)}>Yardage for {qstCount} QSTs
 <ChevronDown size={14} style={{ transform: showYardage ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showYardage && (
 <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9 }}>
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
 <div style={{ padding: 12, background: "hsl(260,12%,96%)", borderRadius: 8, textAlign: "center" }}>
 <div style={{ fontWeight: 700 }}>Two-HST Method</div>
 <div style={{ fontSize: 10 }}>{yard.sqPerColor} sq × {toF(calc.twoHST)} per color</div>
 <div style={{ fontSize: 10 }}>{yard.stripsPerColor} strips ({calc.sqPerWOF2}/strip)</div>
 <div style={{ fontSize: 22, fontWeight: 800, color: "hsl(260,50%,45%)" }}>{toFrac(yard.buyPerColor)} yd each</div>
 <div style={{ fontSize: 10 }}>Total: {toFrac(yard.buyPerColor * 2)} yd</div>
 </div>
 <div style={{ padding: 12, background: "hsl(150,12%,96%)", borderRadius: 8, textAlign: "center" }}>
 <div style={{ fontWeight: 700 }}>No-Waste Method</div>
 <div style={{ fontSize: 10 }}>{yard.nwPairs} pairs × {toF(calc.noWaste)}</div>
 <div style={{ fontSize: 10 }}>8 QSTs per pair</div>
 <div style={{ fontSize: 22, fontWeight: 800, color: "hsl(150,50%,40%)" }}>{toFrac(yard.nwBuy)} yd each</div>
 <div style={{ fontSize: 10 }}>Total: {toFrac(yard.nwBuy * 2)} yd</div>
 </div>
 </div>
 <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>No-waste uses {(((yard.buyPerColor - yard.nwBuy) / yard.buyPerColor) * 100).toFixed(0)}% less fabric but requires trimming each QST to size.
 </div>
 </div>
 )}
 </div>

 {/* ═══ BLOCK CONTEXT ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowBlocks(!showBlocks)}>QSTs in Common Blocks
 <ChevronDown size={14} style={{ transform: showBlocks ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showBlocks && (
 <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9 }}>
 {[
 { name: "Hourglass Block", qsts: 1, note: "Entire block = 1 QST unit", cut: `Cut at ${toF(calc.twoHST)}` },
 { name: "Ohio Star (12\" block)", qsts: 4, note: "Star points are QST units at block÷3", cut: `4 QSTs at ${toF(calc.fin >0 ? calc.fin : 4)} fin` },
 { name: "Broken Dishes", qsts: 4, note: "4 QSTs in specific orientation", cut: "Same formula applies" },
 { name: "Pinwheel (QST variation)", qsts: 4, note: "More intricate center than HST pinwheel", cut: "4 QSTs arranged spinning" },
 { name: "Bear's Paw", qsts: 4, note: "Paw portions use QST units", cut: "Varies by block design" },
 ].map((b, i) =>(
 <div key={i} style={{ padding: 8, background: i % 2 === 0 ? "hsl(260,8%,97%)" : "transparent", borderRadius: 6, marginBottom: 2 }}>
 <strong>{b.name}</strong>— {b.qsts} QST{b.qsts >1 ? "s" : ""}/block
 <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>{b.note} | {b.cut}</div>
 </div>
 ))}
 </div>
 )}
 </div>

 {/* ═══ TRIMMING ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowTrimming(!showTrimming)}>
 ✂️ Trimming QSTs Accurately
 <ChevronDown size={14} style={{ transform: showTrimming ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showTrimming && (
 <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9 }}>
 <div style={{ padding: 8, background: "hsl(40,15%,96%)", borderRadius: 6, marginBottom: 8 }}>
 ⚠ QST trimming is harder than HST — you have <strong>two seams</strong>to align through center.
 </div>
 {[
 `Target: ${toF(calc.unfin)} unfinished`,
 "Place QST on cutting mat, find center X intersection",
 "Align 45° ruler line through BOTH diagonal seams",
 `Position ${toFrac(calc.unfin / 2)}\" mark (half of ${toF(calc.unfin)}) at center`,
 "Trim right and top edges",
 "Rotate 180°, align, trim remaining two edges",
 ].map((s, i) =>(
 <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
 <span style={{ width: 20, height: 20, borderRadius: "50%", background: "hsl(260,40%,55%)", color: "#fff", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
 <span>{s}</span>
 </div>
 ))}
 <div style={{ marginTop: 6, fontSize: 11, padding: 6, background: "hsl(0,0%,97%)", borderRadius: 4 }}>
 <strong>Tip:</strong>Specialty rulers (Bloc Loc) grip the seam intersection to prevent slipping.
 </div>
 </div>
 )}
 </div>

 {/* ═══ REFERENCE TABLE ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>QST Size Reference</h2>
 <div style={{ overflowX: "auto" }}>
 <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
 <thead><tr>
 <th style={tH}>Finished</th><th style={tH}>Unfin</th><th style={tH}>Two-HST Cut</th><th style={tH}>No-Waste Cut</th><th style={{ ...tH, color: "hsl(0,0%,60%)" }}>HST Cut</th>
 </tr></thead>
 <tbody>{refSizes.map(fin =>{
 const unfin = fin + 0.5, twoH = fin + 1.25, nw = fin + 1.5, hst = fin + 0.875;
 const active = Math.abs(fin - calc.fin) < 0.01;
 return (
 <tr key={fin} style={{ background: active ? "hsl(260,20%,93%)" : undefined, cursor: "pointer" }} onClick={() =>{ setMode("A"); setFinQST(fin); }}>
 <td style={{ ...tD, fontWeight: 600 }}>{toF(fin)}</td>
 <td style={tD}>{toF(unfin)}</td>
 <td style={{ ...tD, fontWeight: 600 }}>{toF(twoH)}</td>
 <td style={tD}>{toF(nw)}</td>
 <td style={{ ...tD, color: "hsl(0,0%,60%)" }}>{toF(hst)}</td>
 </tr>
 );
 })}</tbody>
 </table>
 </div>
 <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 4 }}>HST column shown for comparison. Click any row to select that size.</div>
 </div>

 {/* ═══ TROUBLESHOOTING ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowTrouble(!showTrouble)}>QST Troubleshooting
 <ChevronDown size={14} style={{ transform: showTrouble ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showTrouble && (
 <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9, color: "var(--color-text-secondary)" }}>
 {[
 { title: "QSTs finishing too small", cause: `Used HST formula (+⅞") instead of QST formula (+1¼"). Difference: ⅜" per QST = ~¾" total.`, fix: `Recut at ${toF(calc.twoHST)} (QST formula) instead of ${toF(calc.hstCut)} (HST formula).` },
 { title: "Points not meeting in center", cause: "HSTs pressed to side (bulk), or second diagonal not perpendicular, or seams not nested.", fix: "Press HSTs OPEN. Use ruler to draw 90° angle. Ensure opposing seam directions when pairing HSTs." },
 { title: "QST center is bulky", cause: "Two seam lines crossing creates 8 layers in center.", fix: "Always press QST seams OPEN. This is more important for QSTs than HSTs because of the double seam intersection." },
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
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowEdu(!showEdu)}>Understanding QSTs
 <ChevronDown size={14} style={{ transform: showEdu ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showEdu && (
 <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.9, color: "var(--color-text-secondary)" }}>
 <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>The 1¼&quot; Magic Number</h4>
 <p style={{ fontSize: 12 }}>First seam (HST diagonal) uses ⅞&quot;. Second seam (combining HSTs) adds another ⅜&quot;. Total: ⅞&quot; + ⅜&quot; = 1¼&quot;. This accounts for seam allowances on both diagonal cuts through the unit.</p>
 <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 10 }}>Why Pressing Open Matters More for QSTs</h4>
 <p style={{ fontSize: 12 }}>QSTs have two seams meeting at center = 4 fabric layers at intersection. Pressing to side creates a visible lump. Pressing OPEN distributes bulk evenly, giving flat centers and sharp points. This is the #1 pressing tip for QST success.</p>
 <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 10 }}>Grain Direction</h4>
 <p style={{ fontSize: 12 }}>QST triangles have straight grain on the hypotenuse (long edge) and bias on the short legs — the <strong>opposite</strong>of HST triangles. This makes QSTs ideal when the long edge is on the block&apos;s exterior (Ohio Star points, setting triangles for on-point quilts).</p>
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
 <div>QST: <strong>{toF(calc.fin)} fin</strong></div>
 <div>Unfin: <strong>{toF(calc.unfin)}</strong></div>
 <div>Two-HST: <strong>{toF(calc.twoHST)}</strong></div>
 <div>No-waste: <strong>{toF(calc.noWaste)}</strong></div>
 <div>HST same size: <strong>{toF(calc.hstCut)}</strong></div>
 </div>
 </div>
 <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
 <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>The Formulas</h4>
 <div style={{ fontSize: 11, padding: 8, background: "hsl(0,0%,96%)", borderRadius: 6, fontFamily: "monospace", lineHeight: 2 }}>QST = Fin + 1¼&quot;<br />No-waste = Fin + 1½&quot;<br />HST = Fin + ⅞&quot;<br />Unfin = Fin + ½&quot;
 </div>
 </div>
 <div className="glass-card related-tools">
 <h4>Related Tools</h4>
 <a href="/quilt/hst-calculator" className="related-tool-link">HST Calculator</a>
 <a href="/quilt/flying-geese-calculator" className="related-tool-link">Flying Geese Calculator</a>
 <a href="/quilt/pinwheel-calculator" className="related-tool-link">Pinwheel Calculator</a>
 <a href="/quilt/snowball-calculator" className="related-tool-link">Snowball Calculator</a>
 <a href="/quilt/size-calculator" className="related-tool-link">Quilt Size Calculator</a>
 <a href="/quilt/backing-calculator" className="related-tool-link">Backing Calculator</a>
 <a href="/quilt" className="related-tool-link">All Quilt Tools</a>
 </div>
 </aside>
 </div>
 </div>
 );
}