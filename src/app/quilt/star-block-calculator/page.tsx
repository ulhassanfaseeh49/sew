"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, ChevronDown, Star } from "lucide-react";

/* helpers */
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
function toF(v: number) { return toFrac(v) + '"'; }

const SA = 0.5;
const QST_ADD = 1.25; // QST starting square = finished + 1.25"

type StarType = "ohio" | "sawtooth" | "variable" | "lemoyne";
const starTypes: { key: StarType; name: string; level: string; desc: string; yseam: boolean }[] = [
 { key: "ohio", name: "Ohio Star", level: "Beginner", desc: "9-patch with QST star points", yseam: false },
 { key: "sawtooth", name: "Sawtooth Star", level: "Beginner", desc: "Flying Geese star points", yseam: false },
 { key: "variable", name: "Variable Star", level: "Beginner", desc: "HST star points (Friendship Star)", yseam: false },
 { key: "lemoyne", name: "LeMoyne Star", level: "Intermediate", desc: "8 diamonds — requires Y-seams", yseam: true },
];

const blockPresets = [6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 24];

const faqItems = [
 { q: "How do I make an Ohio Star quilt block?", a: "Make 4 QST (quarter square triangle) units, 1 center square, and 4 corner squares. Layout in a 3×3 grid: corners at 4 positions, QSTs at 4 side positions with dark triangles pointing toward center, center square in the middle. Sew in 3 rows, then join rows." },
 { q: "What size pieces for a 12-inch Ohio Star?", a: "Center square: 4½\" cut. 4 corner squares: 4½\" cut each. QST starting squares: 5¼\" (cut 2 dark + 2 background). Each section finishes at 4\" (12\" ÷ 3 = 4\")." },
 { q: "What is a Sawtooth Star quilt block?", a: "A star made with 4 Flying Geese units pointing inward toward a center square, with corner squares filling the block. For a 12\" block: center = 6½\", 4 geese rectangles = 6½\"×3½\", 8 sky squares = 3½\", 4 corner squares = 3½\"." },
 { q: "How do I make a LeMoyne Star without Y-seams?", a: "Strictly speaking, a true LeMoyne Star requires Y-seams. However, you can get a similar look with an Ohio Star (uses QSTs, no Y-seams) or by paper-foundation-piecing the LeMoyne, which avoids hand-setting seams." },
 { q: "What is a Y-seam in quilting?", a: "A Y-seam (set-in seam) is needed when 3 pieces meet at a single point forming a Y shape. You stitch from seam allowance mark to seam allowance mark only — never into the seam allowance. This leaves corners free to pivot and set in the next piece." },
 { q: "How do I fix star points that don't meet?", a: "Check: 1) Starting squares were cut exactly right. 2) Seam allowance is a consistent ¼\". 3) For Ohio Star QSTs: press seams open to reduce bulk at center. 4) Trim QST/HST/FG units to exact size before assembling. 5) Pin at intersections before sewing." },
 { q: "What is the difference between Ohio Star and Sawtooth Star?", a: "Both are 9-unit blocks with 4 star points. Ohio Star uses QST (quarter square triangle) units — the points are formed by diagonal seams within a square. Sawtooth Star uses Flying Geese units — the points are formed by a triangle within a rectangle. Both are beginner-friendly with no Y-seams." },
 { q: "How do I cut 45-degree diamonds for a star quilt?", a: "Cut strips at the diamond width (e.g., 4½\" for 12\" LeMoyne). Align the 45° line on your ruler with the strip edge. Cut at 45° angle. Each cut yields one diamond. Cut 8 diamonds for a complete 8-pointed star. Use a dedicated 45° ruler for accuracy." },
 { q: "How many pieces in an Ohio Star block?", a: "9 pieces total: 1 center square + 4 corner squares + 4 QST units. Each QST unit is made from 2 squares (1 dark + 1 light), so the total cut count is: 1 center + 4 corners + 2 dark QST squares + 2 light QST squares = 9 cut pieces." },
 { q: "What is a Lone Star quilt?", a: "A dramatic full-quilt design featuring one giant 8-pointed star (Star of Bethlehem). Each of the 8 diamond points is strip-pieced from smaller diamonds in a gradient. Requires 45° cutting, Y-seams, and very precise piecing. An advanced project." },
 { q: "What star blocks are good for beginners?", a: "Ohio Star and Sawtooth Star — both are beginner-friendly with no Y-seams. Ohio Star teaches QST construction. Sawtooth Star teaches Flying Geese. Variable Star (Friendship Star) is even simpler, using basic HSTs. All three produce impressive-looking stars." },
 { q: "How much fabric for 20 Ohio Star blocks?", a: "For 12\" blocks: ~0.5 yd center fabric, ~⅞ yd dark star point fabric, ~2 yd background fabric. Total: ~3.4 yards across 3 fabrics. Exact amounts depend on fabric width and cutting efficiency." },
];

export default function Page() {
 const [starType, setStarType] = useState<StarType>("ohio");
 const [blockSize, setBlockSize] = useState(12);
 const [blockCount, setBlockCount] = useState(20);
 const [fabricW, setFabricW] = useState(42);
 const [showFormula, setShowFormula] = useState(false);
 const [showCutPlan, setShowCutPlan] = useState(false);
 const [showCompare, setShowCompare] = useState(false);
 const [showEdu, setShowEdu] = useState(false);
 const [activeFaq, setActiveFaq] = useState<number | null>(null);

 const star = starTypes.find(s =>s.key === starType) || starTypes[0];

 const calc = useMemo(() =>{
 const n = blockCount;
 const fw = fabricW;

 if (starType === "ohio") {
 const sec = blockSize / 3;
 const centerCut = sec + SA;
 const cornerCut = sec + SA;
 const qstStart = sec + QST_ADD;

 // Per block: 1 center, 4 corners, 2 dark QST sq, 2 bg QST sq
 const centers = n;
 const corners = n * 4;
 const darkQST = n * 2;
 const bgQST = n * 2;

 const yardage = (label: string, count: number, cutSize: number) =>{
 const perRow = Math.floor(fw / cutSize);
 const rows = Math.ceil(count / Math.max(perRow, 1));
 const yd = (rows * cutSize) / 36;
 const buy = Math.ceil(yd * 8) / 8 + 0.125;
 return { label, count, cutSize, perRow, rows, yd, buy };
 };

 const yA = yardage("Center (A)", centers, centerCut);
 const yB = yardage("Dark points (B)", darkQST, qstStart);
 const yCcorners = yardage("Bg corners (C)", corners, cornerCut);
 const yCqst = yardage("Bg QST (C)", bgQST, qstStart);
 const bgBuy = Math.ceil((yCcorners.yd + yCqst.yd) * 4) / 4 + 0.25;

 return {
 type: "ohio" as const, sec, centerCut, cornerCut, qstStart,
 pieces: [
 { name: "Center square (A)", cut: centerCut, qty: 1 },
 { name: "Corner squares (C)", cut: cornerCut, qty: 4 },
 { name: "Dark QST squares (B)", cut: qstStart, qty: 2 },
 { name: "Bg QST squares (C)", cut: qstStart, qty: 2 },
 ],
 yardage: [yA, yB],
 bgYd: bgBuy, totalYd: yA.buy + yB.buy + bgBuy,
 };
 }

 if (starType === "sawtooth") {
 const unit = blockSize / 4;
 const centerCut = blockSize / 2 + SA;
 const geeseW = blockSize / 2 + SA;
 const geeseH = unit + SA;
 const skyCorner = unit + SA;
 const cornerCut = unit + SA;

 const yardage = (label: string, count: number, cutSize: number) =>{
 const perRow = Math.floor(fw / cutSize);
 const rows = Math.ceil(count / Math.max(perRow, 1));
 const yd = (rows * cutSize) / 36;
 const buy = Math.ceil(yd * 8) / 8 + 0.125;
 return { label, count, cutSize, perRow, rows, yd, buy };
 };

 const yCenter = yardage("Center (A)", n, centerCut);
 const yGoose = yardage("Geese rect (B)", n * 4, geeseW); // width-based strips
 const gooseYdReal = (Math.ceil((n * 4) / Math.max(Math.floor(fw / geeseW), 1)) * geeseH) / 36;
 const yBbuy = Math.ceil(gooseYdReal * 8) / 8 + 0.125;
 const skySq = n * 8;
 const cornerSq = n * 4;
 const bgTotal = skySq + cornerSq;
 const bgYardage = yardage("Bg sky+corners (C)", bgTotal, skyCorner);

 return {
 type: "sawtooth" as const, unit, centerCut, geeseW, geeseH, skyCorner, cornerCut,
 pieces: [
 { name: "Center square (A)", cut: centerCut, qty: 1 },
 { name: "Geese rectangles (B)", cut: geeseW, qty: 4, h: geeseH },
 { name: "Sky squares (C)", cut: skyCorner, qty: 8 },
 { name: "Corner squares (C)", cut: cornerCut, qty: 4 },
 ],
 yardage: [yCenter, { ...yGoose, buy: yBbuy, yd: gooseYdReal }],
 bgYd: bgYardage.buy, totalYd: yCenter.buy + yBbuy + bgYardage.buy,
 };
 }

 if (starType === "variable") {
 const sec = blockSize / 3;
 const centerCut = sec + SA;
 const cornerCut = sec + SA;
 const hstStart = sec + 0.875; // HST starting square

 const yardage = (label: string, count: number, cutSize: number) =>{
 const perRow = Math.floor(fw / cutSize);
 const rows = Math.ceil(count / Math.max(perRow, 1));
 const yd = (rows * cutSize) / 36;
 const buy = Math.ceil(yd * 8) / 8 + 0.125;
 return { label, count, cutSize, perRow, rows, yd, buy };
 };

 const yA = yardage("Center (A)", n, centerCut);
 const yB = yardage("Dark HST (B)", n * 4, hstStart);
 const yCcorners = yardage("Bg corners (C)", n * 4, cornerCut);
 const yCHst = yardage("Bg HST (C)", n * 4, hstStart);
 const bgBuy = Math.ceil((yCcorners.yd + yCHst.yd) * 4) / 4 + 0.25;

 return {
 type: "variable" as const, sec, centerCut, cornerCut, hstStart,
 pieces: [
 { name: "Center square (A)", cut: centerCut, qty: 1 },
 { name: "Corner squares (C)", cut: cornerCut, qty: 4 },
 { name: "Dark HST squares (B)", cut: hstStart, qty: 4 },
 { name: "Bg HST squares (C)", cut: hstStart, qty: 4 },
 ],
 yardage: [yA, yB],
 bgYd: bgBuy, totalYd: yA.buy + yB.buy + bgBuy,
 };
 }

 // LeMoyne
 const stripW = blockSize / 3 + SA; // diamond strip width
 const setSqCut = blockSize / 3 + SA;
 const setTriSq = blockSize / 3 + 0.875;

 const yardage = (label: string, count: number, cutSize: number) =>{
 const perRow = Math.floor(fw / cutSize);
 const rows = Math.ceil(count / Math.max(perRow, 1));
 const yd = (rows * cutSize) / 36;
 const buy = Math.ceil(yd * 8) / 8 + 0.125;
 return { label, count, cutSize, perRow, rows, yd, buy };
 };

 const yDiamond = yardage("Diamonds (A)", n * 8, stripW);
 const ySquares = yardage("Setting squares (C)", n * 4, setSqCut);
 const yTri = yardage("Setting tri sq (C)", n * 2, setTriSq);
 const bgBuy = Math.ceil((ySquares.yd + yTri.yd) * 4) / 4 + 0.25;

 return {
 type: "lemoyne" as const, stripW, setSqCut, setTriSq,
 pieces: [
 { name: "45° Diamonds (A)", cut: stripW, qty: 8 },
 { name: "Setting squares (C)", cut: setSqCut, qty: 4 },
 { name: "Setting tri from sq (C)", cut: setTriSq, qty: 2, note: "cut once diag → 4 tri" },
 ],
 yardage: [yDiamond],
 bgYd: bgBuy, totalYd: yDiamond.buy + bgBuy,
 };
 }, [starType, blockSize, blockCount, fabricW]);

 // Reference tables
 const ohioRef = [6, 9, 12, 15, 18, 24].map(bs =>({ bs, sec: bs / 3, center: bs / 3 + SA, corner: bs / 3 + SA, qst: bs / 3 + QST_ADD }));
 const sawRef = [8, 12, 16, 20, 24].map(bs =>({ bs, center: bs / 2 + SA, gW: bs / 2 + SA, gH: bs / 4 + SA, sky: bs / 4 + SA, corner: bs / 4 + SA }));

 const tH = { padding: "5px 8px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left" as const, fontSize: 11, fontWeight: 600 as const };
 const tD = { padding: "4px 8px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11 };

 const copyText = `${star.name} ${blockSize}": ${calc.pieces.map(p =>`${p.name} ${toF(p.cut)}${p.qty >1 ? ` ×${p.qty}` : ""}`).join(", ")}. For ${blockCount} blocks: ~${calc.totalYd.toFixed(1)} yd total.`;

 return (
 <div className="container">
 <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "Star Block Calculator" }]} />
 <div className="calculator-layout">
 <div className="calculator-main">
 <div className={styles.toolHeader}>
 <span className="category-badge"><Star size={14} strokeWidth={1.5} />Quilt #155</span>
 <h1>Star Block Calculator</h1>
 <p>Calculate exact cutting sizes for Ohio Star, Sawtooth Star, Variable Star &amp; LeMoyne Star. Get complete piece lists, yardage, and assembly guidance with Y-seam instructions.</p>
 </div>

 {/* STAR TYPE */}
 <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
 {starTypes.map(s =>(
 <button key={s.key} className={`btn ${starType === s.key ? "btn-primary" : "btn-secondary"}`} onClick={() =>setStarType(s.key)} style={{ fontSize: 11 }}>
 {s.name} <span style={{ fontSize: 9, opacity: 0.8 }}>({s.level})</span>
 </button>
 ))}
 </div>

 {star.yseam && (
 <div style={{ padding: 8, background: "hsl(40,30%,95%)", borderRadius: 6, fontSize: 11, marginBottom: 10, color: "hsl(40,70%,30%)", fontWeight: 600 }}>
 ⚠ {star.name} requires Y-seams (set-in seams) — intermediate technique. Consider Ohio Star or Sawtooth Star for a no-Y-seam alternative.
 </div>
 )}

 {/* ① BLOCK SIZE */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>① Block Size &amp; Quantity</h2>
 <div className="calculator-form-row">
 <div className="input-group"><label className="input-label">Finished block size (in)</label>
 <input type="number" className="input-field" value={blockSize} onChange={e =>setBlockSize(Math.max(3, parseFloat(e.target.value) || 12))} min={3} step={0.5} /></div>
 <div className="input-group"><label className="input-label">Number of blocks</label>
 <input type="number" className="input-field" value={blockCount} onChange={e =>setBlockCount(Math.max(1, parseInt(e.target.value) || 1))} min={1} /></div>
 </div>
 <div style={{ display: "flex", gap: 3, marginTop: 4, flexWrap: "wrap" }}>
 {blockPresets.map(s =>(
 <button key={s} className={`btn btn-sm ${blockSize === s ? "btn-primary" : "btn-ghost"}`} onClick={() =>setBlockSize(s)} style={{ fontSize: 9, padding: "2px 5px" }}>{s}&quot;</button>
 ))}
 </div>
 {(starType === "ohio" || starType === "variable") && blockSize % 3 !== 0 && (
 <div style={{ fontSize: 10, color: "hsl(40,70%,40%)", marginTop: 4 }}>⚠ {star.name} divides into 3×3 — block size should be divisible by 3. Nearest: {Math.round(blockSize / 3) * 3}&quot;</div>
 )}
 <div className="input-group" style={{ marginTop: 8 }}>
 <label className="input-label">Usable fabric width</label>
 <input type="number" className="input-field" value={fabricW} onChange={e =>setFabricW(Math.max(36, parseInt(e.target.value) || 42))} min={36} />
 </div>
 </div>

 {/* ② CUTTING SIZES */}
 <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: `4px solid hsl(${starType === "ohio" ? "200" : starType === "sawtooth" ? "340" : starType === "variable" ? "120" : "40"},50%,40%)` }}>
 <h2 className={styles.calcTitle}>② {star.name} — {blockSize}&quot; Cutting Sizes</h2>
 <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 8 }}>{star.desc}</div>

 <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8, marginBottom: 12 }}>
 {calc.pieces.map((p, i) =>(
 <div key={i} style={{ padding: 12, background: `hsl(${i * 60},10%,96%)`, borderRadius: 8, textAlign: "center" }}>
 <div style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{p.name}</div>
 <div style={{ fontSize: 24, fontWeight: 800, color: `hsl(${i * 60 + 200},50%,35%)` }}>{toF(p.cut)}</div>
 <div style={{ fontSize: 10 }}>×{p.qty} per block</div>
 {"h" in p && <div style={{ fontSize: 9, color: "var(--color-text-tertiary)" }}>{toF(p.cut)} × {toF((p as { h: number }).h)}</div>}
 </div>
 ))}
 </div>

 <div className={styles.resultDetails}>
 {calc.pieces.map((p, i) =>(
 <div key={i} className="result-row"><span>{p.name}</span><strong>{toF(p.cut)} × {p.qty * blockCount} total</strong></div>
 ))}
 </div>

 <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
 {calc.yardage.map((y, i) =>(
 <div key={i} style={{ padding: 8, background: `hsl(${i * 120 + 200},10%,96%)`, borderRadius: 6, textAlign: "center" }}>
 <div style={{ fontSize: 9, fontWeight: 600 }}>{y.label}</div>
 <div style={{ fontSize: 16, fontWeight: 800 }}>{toFrac(y.buy)} yd</div>
 </div>
 ))}
 <div style={{ padding: 8, background: "hsl(0,0%,96%)", borderRadius: 6, textAlign: "center" }}>
 <div style={{ fontSize: 9, fontWeight: 600 }}>Background (C)</div>
 <div style={{ fontSize: 16, fontWeight: 800 }}>{toFrac(calc.bgYd)} yd</div>
 </div>
 </div>
 <div style={{ marginTop: 6, fontSize: 11, textAlign: "center", color: "var(--color-text-tertiary)" }}>Total: ~{calc.totalYd.toFixed(1)} yd across all fabrics for {blockCount} blocks
 </div>
 </div>

 {/* Toolbar */}
 <div className="toolbar" style={{ marginBottom: 10 }}>
 <button className="btn btn-secondary btn-sm" onClick={() =>navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} />Copy</button>
 <button className="btn btn-secondary btn-sm" onClick={() =>window.print()}><Printer size={13} />Print</button>
 </div>

 {/* ═══ FORMULA ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowFormula(!showFormula)}>How Sizes Are Calculated
 <ChevronDown size={14} style={{ transform: showFormula ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showFormula && (
 <div style={{ marginTop: 10, fontSize: 12, lineHeight: 2, fontFamily: "monospace" }}>
 {starType === "ohio" && (
 <div style={{ padding: 10, background: "hsl(200,10%,97%)", borderRadius: 6 }}>Block = 3×3 grid → section = {blockSize} ÷ 3 = {(blockSize / 3).toFixed(2)}&quot;<br />Center / Corner cut = section + ½&quot; SA = {toF(blockSize / 3 + SA)}<br />QST starting square = section + 1¼&quot; = {toF(blockSize / 3 + QST_ADD)}<br />Per block: 1 center + 4 corners + 2 dark QST + 2 bg QST = 9 pieces
 </div>
 )}
 {starType === "sawtooth" && (
 <div style={{ padding: 10, background: "hsl(340,10%,97%)", borderRadius: 6 }}>Center = block ÷ 2 + ½&quot; = {toF(blockSize / 2 + SA)}<br />Unit = block ÷ 4 = {(blockSize / 4).toFixed(2)}&quot;<br />Geese rectangle = {toF(blockSize / 2 + SA)} × {toF(blockSize / 4 + SA)}<br />Sky / Corner squares = unit + ½&quot; = {toF(blockSize / 4 + SA)}<br />Per block: 1 center + 4 geese rect + 8 sky sq + 4 corners = 17 pieces
 </div>
 )}
 {starType === "variable" && (
 <div style={{ padding: 10, background: "hsl(120,10%,97%)", borderRadius: 6 }}>Block = 3×3 grid → section = {blockSize} ÷ 3 = {(blockSize / 3).toFixed(2)}&quot;<br />Center / Corner cut = section + ½&quot; = {toF(blockSize / 3 + SA)}<br />HST starting square = section + ⅞&quot; = {toF(blockSize / 3 + 0.875)}<br />Per block: 1 center + 4 corners + 4 dark HST + 4 bg HST = 13 pieces
 </div>
 )}
 {starType === "lemoyne" && (
 <div style={{ padding: 10, background: "hsl(40,10%,97%)", borderRadius: 6 }}>Diamond strip width ≈ block ÷ 3 + ½&quot; = {toF(blockSize / 3 + SA)}<br />Cut 45° diamonds from strips<br />Setting squares = {toF(blockSize / 3 + SA)}<br />Setting triangle squares = {toF(blockSize / 3 + 0.875)} (cut once diag)<br />Per block: 8 diamonds + 4 setting sq + 4 setting tri = 16 pieces
 </div>
 )}
 </div>
 )}
 </div>

 {/* ═══ COMPARISON TABLE ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowCompare(!showCompare)}>Star Block Comparison
 <ChevronDown size={14} style={{ transform: showCompare ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showCompare && (
 <div style={{ marginTop: 10, overflowX: "auto" }}>
 <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
 <thead><tr><th style={tH}>Block</th><th style={tH}>Pieces</th><th style={tH}>Level</th><th style={tH}>Construction</th><th style={tH}>Y-Seams</th></tr></thead>
 <tbody>
 <tr style={{ background: starType === "variable" ? "hsl(120,15%,93%)" : undefined }}><td style={{ ...tD, fontWeight: 600 }}>Variable Star</td><td style={tD}>9</td><td style={tD}>Beginner</td><td style={tD}>HSTs + squares</td><td style={tD}>No</td></tr>
 <tr style={{ background: starType === "ohio" ? "hsl(200,15%,93%)" : undefined }}><td style={{ ...tD, fontWeight: 600 }}>Ohio Star</td><td style={tD}>9</td><td style={tD}>Beginner</td><td style={tD}>QSTs + squares</td><td style={tD}>No</td></tr>
 <tr style={{ background: starType === "sawtooth" ? "hsl(340,15%,93%)" : undefined }}><td style={{ ...tD, fontWeight: 600 }}>Sawtooth Star</td><td style={tD}>9</td><td style={tD}>Beginner</td><td style={tD}>Flying Geese</td><td style={tD}>No</td></tr>
 <tr style={{ background: starType === "lemoyne" ? "hsl(40,15%,93%)" : undefined }}><td style={{ ...tD, fontWeight: 600 }}>LeMoyne Star</td><td style={tD}>16</td><td style={tD}>Intermediate</td><td style={tD}>45° diamonds</td><td style={{ ...tD, color: "hsl(0,60%,45%)", fontWeight: 600 }}>YES</td></tr>
 <tr><td style={{ ...tD, fontWeight: 600 }}>Lone Star</td><td style={tD}>72+</td><td style={tD}>Advanced</td><td style={tD}>Strip piecing</td><td style={{ ...tD, color: "hsl(0,60%,45%)", fontWeight: 600 }}>YES</td></tr>
 </tbody>
 </table>
 <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 4 }}>Beginners: start with Ohio Star or Sawtooth Star (no Y-seams, impressive results).</div>
 </div>
 )}
 </div>

 {/* ═══ CUTTING PLAN ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowCutPlan(!showCutPlan)}>
 ✂️ Reference Tables
 <ChevronDown size={14} style={{ transform: showCutPlan ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showCutPlan && (
 <div style={{ marginTop: 10 }}>
 <strong style={{ fontSize: 12 }}>Ohio Star Reference</strong>
 <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%", marginTop: 4, marginBottom: 10 }}>
 <thead><tr><th style={tH}>Block</th><th style={tH}>Section</th><th style={tH}>Center</th><th style={tH}>Corner</th><th style={tH}>QST sq</th></tr></thead>
 <tbody>{ohioRef.map(r =>(
 <tr key={r.bs} style={{ background: r.bs === blockSize && starType === "ohio" ? "hsl(200,15%,93%)" : undefined }}>
 <td style={{ ...tD, fontWeight: 600 }}>{r.bs}&quot;</td><td style={tD}>{toF(r.sec)}</td><td style={tD}>{toF(r.center)}</td><td style={tD}>{toF(r.corner)}</td><td style={tD}>{toF(r.qst)}</td>
 </tr>
 ))}</tbody>
 </table>
 <strong style={{ fontSize: 12 }}>Sawtooth Star Reference</strong>
 <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%", marginTop: 4 }}>
 <thead><tr><th style={tH}>Block</th><th style={tH}>Center</th><th style={tH}>Geese</th><th style={tH}>Sky / Corner</th></tr></thead>
 <tbody>{sawRef.map(r =>(
 <tr key={r.bs} style={{ background: r.bs === blockSize && starType === "sawtooth" ? "hsl(340,15%,93%)" : undefined }}>
 <td style={{ ...tD, fontWeight: 600 }}>{r.bs}&quot;</td><td style={tD}>{toF(r.center)}</td><td style={tD}>{toF(r.gW)}×{toF(r.gH)}</td><td style={tD}>{toF(r.sky)}</td>
 </tr>
 ))}</tbody>
 </table>
 </div>
 )}
 </div>

 {/* ═══ EDUCATIONAL ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowEdu(!showEdu)}>Understanding Star Blocks
 <ChevronDown size={14} style={{ transform: showEdu ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showEdu && (
 <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.9, color: "var(--color-text-secondary)" }}>
 <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>Stars Without Y-Seams</h4>
 <p style={{ fontSize: 12 }}>Ohio Star and Sawtooth Star look like 8-pointed stars but avoid Y-seams entirely. The trick: QSTs (Ohio) and Flying Geese (Sawtooth) create the illusion of meeting star points using simple row-by-row construction. Both are perfect for beginners.</p>

 <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 10 }}>What Are Y-Seams?</h4>
 <p style={{ fontSize: 12 }}>Y-seams (set-in seams) occur when 3 pieces meet at one point. You stitch seam-allowance-mark to seam-allowance-mark only — never into the SA. This leaves corners free to pivot. Required for LeMoyne/Lone Star. Practice on scraps first — it clicks after a few tries.</p>

 <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 10 }}>Common Star Point Problems</h4>
 <p style={{ fontSize: 12 }}>Points not meeting? Check: 1) Squares cut to exact size. 2) Consistent ¼&quot; SA. 3) Press QST seams OPEN (not to side). 4) Trim units to exact size before assembly. 5) Pin at intersections. Bias edges cause waviness — starch and handle gently.</p>
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
 <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Your Star Block</h4>
 <div style={{ fontSize: 12, lineHeight: 2.2, color: "var(--color-text-secondary)" }}>
 <div><strong>{star.name}</strong></div>
 <div>Size: <strong>{blockSize}&quot;</strong></div>
 <div>Blocks: <strong>{blockCount}</strong></div>
 {calc.pieces.map((p, i) =><div key={i}>{p.name.split("(")[0].trim()}: <strong>{toF(p.cut)}</strong></div>)}
 <div style={{ borderTop: "1px solid hsl(0,0%,90%)", paddingTop: 4, marginTop: 4 }}>Total: <strong>~{calc.totalYd.toFixed(1)} yd</strong></div>
 </div>
 </div>
 <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
 <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Block Layout</h4>
 <div style={{ fontSize: 11, padding: 8, background: "hsl(0,0%,96%)", borderRadius: 6, fontFamily: "monospace", lineHeight: 1.8, textAlign: "center" }}>
 {starType === "ohio" ? "[Bg] [QST] [Bg]\n[QST][Ctr][QST]\n[Bg] [QST] [Bg]".split("\n").map((l, i) =><div key={i}>{l}</div>) :
 starType === "sawtooth" ? "[Bg] [▲FG▲] [Bg]\n[◄FG►][Ctr][◄FG►]\n[Bg] [▼FG▼] [Bg]".split("\n").map((l, i) =><div key={i}>{l}</div>) :
 starType === "variable" ? "[Bg] [HST] [Bg]\n[HST][Ctr][HST]\n[Bg] [HST] [Bg]".split("\n").map((l, i) =><div key={i}>{l}</div>) :
 "8 diamonds at 45°\n4 setting squares\n4 setting triangles\nY-seams required".split("\n").map((l, i) =><div key={i}>{l}</div>)}
 </div>
 </div>
 <div className="glass-card related-tools">
 <h4>Related Tools</h4>
 <a href="/quilt/qst-calculator" className="related-tool-link">QST Calculator</a>
 <a href="/quilt/hst-calculator" className="related-tool-link">HST Calculator</a>
 <a href="/quilt/flying-geese-calculator" className="related-tool-link">Flying Geese</a>
 <a href="/quilt/size-calculator" className="related-tool-link">Quilt Size Calculator</a>
 <a href="/quilt/blocks-needed" className="related-tool-link">Blocks Needed</a>
 <a href="/quilt" className="related-tool-link">All Quilt Tools</a>
 </div>
 </aside>
 </div>
 </div>
 );
}