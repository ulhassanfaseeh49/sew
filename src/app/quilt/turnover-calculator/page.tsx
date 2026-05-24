"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, ChevronDown, Triangle } from "lucide-react";

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

type TriType = "turnover" | "equilateral";

const projectRef = [
 { name: "Wall 16\"×24\"", blocks: 6, hsts: 24, turnovers: 48, packs: 1 },
 { name: "Throw 32\"×40\"", blocks: 20, hsts: 80, turnovers: 160, packs: 2 },
 { name: "Lap 48\"×56\"", blocks: 42, hsts: 168, turnovers: 336, packs: 5 },
 { name: "Twin 56\"×72\"", blocks: 63, hsts: 252, turnovers: 504, packs: 7 },
 { name: "Queen 80\"×88\"", blocks: 110, hsts: 440, turnovers: 880, packs: 11 },
];

const faqItems = [
 { q: "What is a turnover pre-cut in quilting?", a: "A turnover is a right isosceles triangle (45°-45°-90°) created by cutting a 5\" charm square diagonally once. Each 5\" square yields 2 turnovers. Standard pack: 80 triangles from 40 charm squares. The short legs are on straight grain; the hypotenuse is on the bias." },
 { q: "How many turnovers in a pack?", a: "Standard turnover packs contain 80 triangles (from 40 charm squares cut in half). Some packs contain 40 triangles. The triangles come from coordinated fabric collections, giving you matching variety without buying individual charm packs." },
 { q: "What can I make with turnover pre-cuts?", a: "HST blocks (pair 2 turnovers), pinwheel blocks (4 HSTs each), hourglass blocks (2 HSTs each), scrappy quilts, and star point elements. From 80 turnovers: 40 HSTs → 10 pinwheels at 8\" each, or 20 hourglasses at 4\" each." },
 { q: "What is the finished size of turnovers from 5-inch squares?", a: "Two 5\" turnovers sewn into an HST produce approximately 4.5\" unfinished (4\" finished after seaming). Trim to exactly 4½\" × 4½\" unfinished for accurate blocks. The common misconception is they finish at 5\" — they do not." },
 { q: "How do I sew turnovers into HSTs?", a: "Place one light and one dark turnover right sides together, aligning the long edges (hypotenuse). Sew with ¼\" seam along the hypotenuse. Press open. Trim dog-ears. Square up to 4½\" × 4½\". The hypotenuse is on the bias — handle gently, consider pinning or a walking foot." },
 { q: "What is the difference between turnovers and charm squares?", a: "Charm squares are 5\" × 5\" squares. Turnovers are charm squares that have been pre-cut diagonally — each charm square becomes 2 turnovers. If you have charm squares, you can make your own turnovers by cutting diagonally. Turnovers save you the cutting step." },
 { q: "How many turnover packs for a quilt?", a: "For pinwheel quilts (8\" blocks): throw (32\"×40\") needs 2 packs, lap (48\"×56\") needs 5 packs, twin (56\"×72\") needs 7 packs, queen (80\"×88\") needs 11 packs. Each pack of 80 turnovers makes 40 HSTs = 10 pinwheel blocks." },
 { q: "What is a thousand pyramids quilt?", a: "A quilt made entirely of equilateral (60°) triangles arranged in alternating up-and-down rows. Creates a stunning optical illusion of depth. Uses equilateral triangle pre-cuts, not turnovers (which are right triangles). Triangle height = side × 0.866." },
 { q: "What are equilateral triangle pre-cuts used for?", a: "Equilateral triangles (60° angles, equal sides) are used for thousand pyramids quilts, tumbling blocks elements, hexagon-adjacent patterns, and modern geometric designs. They are fundamentally different from turnovers (which are right triangles at 45°-45°-90°)." },
 { q: "How do I handle the bias edge on turnover triangles?", a: "The hypotenuse (long edge) is on the bias and stretches easily. Tips: 1) Pin before sewing. 2) Use walking foot for bias seams. 3) Spray starch before sewing. 4) Don't pull or stretch when pressing. 5) Once sewn into HSTs, the bias is encased and stable." },
];

export default function Page() {
 const [triType, setTriType] = useState<TriType>("turnover");
 const [packs, setPacks] = useState(1);
 const [perPack, setPerPack] = useState(80);
 const [squareSize, setSquareSize] = useState(5);
 // Equilateral
 const [eqCount, setEqCount] = useState(60);
 const [eqSide, setEqSide] = useState(5);

 const [showProjects, setShowProjects] = useState(false);
 const [showBgCalc, setShowBgCalc] = useState(false);
 const [showCompare, setShowCompare] = useState(false);
 const [showEdu, setShowEdu] = useState(false);
 const [activeFaq, setActiveFaq] = useState<number | null>(null);

 const calc = useMemo(() =>{
 if (triType === "turnover") {
 const totalTri = packs * perPack;
 const pairs = Math.floor(totalTri / 2);
 const hsts = pairs;
 // HST finished size: square - 0.5" SA on each triangle = square - 0.875" ≈ square/√2 - seam
 // Standard: 5" turnovers → ~4.5" unfinished → 4" finished (trim target)
 const hstUnfin = squareSize - 0.5;
 const hstFin = hstUnfin - 0.5;
 const pinwheels = Math.floor(hsts / 4);
 const pinwheelFin = hstFin * 2;
 const hourglasses = Math.floor(hsts / 2);
 const hourglassFin = hstFin;
 // Background fabric
 const bgSquares = Math.ceil(pairs / 2); // each square cut diag = 2 bg triangles
 const bgPerWOF = Math.floor(42 / squareSize);
 const bgStrips = Math.ceil(bgSquares / Math.max(bgPerWOF, 1));
 const bgYd = (bgStrips * squareSize) / 36;
 const bgBuy = Math.ceil(bgYd * 4) / 4 + 0.25;

 return {
 type: "turnover" as const, totalTri, pairs, hsts,
 hstUnfin, hstFin, pinwheels, pinwheelFin,
 hourglasses, hourglassFin,
 bgSquares, bgPerWOF, bgStrips, bgBuy,
 };
 }
 // Equilateral
 const height = eqSide * 0.866;
 const triPerRow6 = 6;
 const rows6 = Math.floor(eqCount / triPerRow6);
 const w6 = triPerRow6 * eqSide / 2;
 const h6 = rows6 * height / 2;
 const triPerRow10 = 10;
 const rows10 = Math.floor(eqCount / triPerRow10);
 const w10 = triPerRow10 * eqSide / 2;
 const h10 = rows10 * height / 2;

 return {
 type: "equilateral" as const, height, eqCount,
 layout6: { triPerRow: triPerRow6, rows: rows6, w: w6, h: h6 },
 layout10: { triPerRow: triPerRow10, rows: rows10, w: w10, h: h10 },
 };
 }, [triType, packs, perPack, squareSize, eqCount, eqSide]);

 const tH = { padding: "5px 8px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left" as const, fontSize: 11, fontWeight: 600 as const };
 const tD = { padding: "4px 8px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11 };

 const copyText = triType === "turnover" && calc.type === "turnover"
 ? `${calc.totalTri} turnovers (${squareSize}" squares): ${calc.hsts} HSTs at ${calc.hstFin}" finished, ${calc.pinwheels} pinwheels at ${calc.pinwheelFin}", ${calc.hourglasses} hourglasses at ${calc.hourglassFin}".`
 : `${eqCount} equilateral triangles at ${eqSide}" sides (height ${(eqSide * 0.866).toFixed(1)}").`;

 return (
 <div className="container">
 <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "Turnover Calculator" }]} />
 <div className="calculator-layout">
 <div className="calculator-main">
 <div className={styles.toolHeader}>
 <span className="category-badge"><Triangle size={14} strokeWidth={1.5} />Quilt #166</span>
 <h1>Turnover &amp; Triangle Pre-Cut Calculator</h1>
 <p>Calculate projects from turnover pre-cuts, equilateral triangle packs, and other triangular pre-cuts. Get HST counts, block options, background fabric needs, and complete project planning.</p>
 </div>

 {/* TYPE SELECTOR */}
 <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
 <button className={`btn ${triType === "turnover" ? "btn-primary" : "btn-secondary"}`} onClick={() =>setTriType("turnover")}>Turnovers (Right △)
 </button>
 <button className={`btn ${triType === "equilateral" ? "btn-primary" : "btn-secondary"}`} onClick={() =>setTriType("equilateral")}>Equilateral △
 </button>
 </div>

 {/* ═══ TURNOVER MODE ═══ */}
 {triType === "turnover" && calc.type === "turnover" && (<>
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>① Turnover Pack Details</h2>
 <div className="calculator-form-row">
 <div className="input-group"><label className="input-label">Packs</label>
 <input type="number" className="input-field" value={packs} onChange={e =>setPacks(Math.max(1, parseInt(e.target.value) || 1))} min={1} /></div>
 <div className="input-group"><label className="input-label">Triangles / pack</label>
 <div style={{ display: "flex", gap: 3 }}>
 {[40, 80].map(n =>(
 <button key={n} className={`btn btn-sm ${perPack === n ? "btn-primary" : "btn-ghost"}`} onClick={() =>setPerPack(n)} style={{ fontSize: 10 }}>{n}</button>
 ))}
 </div>
 </div>
 <div className="input-group"><label className="input-label">Original square size</label>
 <input type="number" className="input-field" value={squareSize} onChange={e =>setSquareSize(Math.max(2, parseFloat(e.target.value) || 5))} min={2} step={0.5} /></div>
 </div>
 <div style={{ fontSize: 11, marginTop: 4, color: "var(--color-text-secondary)" }}>Total: <strong>{calc.totalTri} turnovers</strong>(from {Math.ceil(calc.totalTri / 2)} charm squares cut diagonally)
 </div>
 </div>

 {/* BIAS WARNING */}
 <div style={{ padding: 8, background: "hsl(40,30%,95%)", borderRadius: 6, fontSize: 11, marginBottom: 10, color: "hsl(40,70%,30%)", fontWeight: 600 }}>
 ⚠ Hypotenuse is on the BIAS — handle gently, pin before sewing, consider walking foot. Short legs are straight grain.
 </div>

 {/* RESULTS */}
 <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(200,50%,45%)" }}>
 <h2 className={styles.calcTitle}>② What You Can Make</h2>

 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
 <div style={{ padding: 14, background: "hsl(200,15%,95%)", borderRadius: 10, textAlign: "center" }}>
 <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(200,40%,35%)" }}>HST Units</div>
 <div style={{ fontSize: 32, fontWeight: 800, color: "hsl(200,50%,30%)" }}>{calc.hsts}</div>
 <div style={{ fontSize: 10 }}>{toF(calc.hstFin)} finished ({toF(calc.hstUnfin)} unfin)</div>
 </div>
 <div style={{ padding: 14, background: "hsl(340,15%,95%)", borderRadius: 10, textAlign: "center" }}>
 <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(340,40%,35%)" }}>Turnovers</div>
 <div style={{ fontSize: 32, fontWeight: 800, color: "hsl(340,50%,35%)" }}>{calc.totalTri}</div>
 <div style={{ fontSize: 10 }}>from {squareSize}&quot; squares</div>
 </div>
 </div>

 <div className={styles.resultDetails}>
 <div className="result-row"><span>2 turnovers → 1 HST</span><strong>{calc.hsts} HSTs at {toF(calc.hstFin)}</strong></div>
 <div className="result-row"><span>4 HSTs → 1 pinwheel</span><strong>{calc.pinwheels} pinwheels at {toF(calc.pinwheelFin)}</strong></div>
 <div className="result-row"><span>2 HSTs → 1 hourglass</span><strong>{calc.hourglasses} hourglasses at {toF(calc.hourglassFin)}</strong></div>
 </div>

 {/* Layout suggestions */}
 <div style={{ marginTop: 10, padding: 10, background: "hsl(0,0%,97%)", borderRadius: 6, fontSize: 11, lineHeight: 2 }}>
 <strong>Layout ideas from {calc.hsts} HSTs:</strong>
 {calc.pinwheels >= 6 && <div>• Pinwheel runner: 2×{Math.min(calc.pinwheels, 5)} = {Math.min(calc.pinwheels, 10)} blocks → {calc.pinwheelFin * 2}&quot; × {calc.pinwheelFin * Math.min(calc.pinwheels / 2, 5)}&quot;</div>}
 {calc.hourglasses >= 12 && <div>• Hourglass quilt: 4×{Math.min(Math.floor(calc.hourglasses / 4), 5)} = {Math.min(calc.hourglasses, 20)} → {calc.hourglassFin * 4}&quot; × {calc.hourglassFin * Math.min(Math.floor(calc.hourglasses / 4), 5)}&quot;</div>}
 <div>• Scrappy HST layout: {calc.hsts} HSTs in rows → {calc.hstFin * Math.min(8, Math.ceil(Math.sqrt(calc.hsts)))}&quot; wide approx</div>
 </div>
 </div>

 {/* STITCH PROCESS */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>Stitch-and-Trim Process</h2>
 <div style={{ fontSize: 12, lineHeight: 2 }}>
 <div style={{ padding: 10, background: "hsl(200,10%,97%)", borderRadius: 6, marginBottom: 6 }}>
 <strong>Step 1:</strong>Pair one light + one dark turnover
 </div>
 <div style={{ padding: 10, background: "hsl(200,10%,97%)", borderRadius: 6, marginBottom: 6 }}>
 <strong>Step 2:</strong>Place right sides together, align hypotenuse
 </div>
 <div style={{ padding: 10, background: "hsl(200,10%,97%)", borderRadius: 6, marginBottom: 6 }}>
 <strong>Step 3:</strong>Sew ¼&quot; seam along hypotenuse (pin first — it&apos;s bias!)
 </div>
 <div style={{ padding: 10, background: "hsl(200,10%,97%)", borderRadius: 6, marginBottom: 6 }}>
 <strong>Step 4:</strong>Press open, trim dog-ears
 </div>
 <div style={{ padding: 10, background: "hsl(160,10%,97%)", borderRadius: 6 }}>
 <strong>Step 5:</strong>Square up to <strong>{toF(calc.hstUnfin)} × {toF(calc.hstUnfin)}</strong>unfinished ({toF(calc.hstFin)} finished)
 </div>
 </div>
 </div>
 </>)}

 {/* ═══ EQUILATERAL MODE ═══ */}
 {triType === "equilateral" && calc.type === "equilateral" && (<>
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>① Equilateral Triangle Details</h2>
 <div className="calculator-form-row">
 <div className="input-group"><label className="input-label">Total triangles</label>
 <input type="number" className="input-field" value={eqCount} onChange={e =>setEqCount(Math.max(1, parseInt(e.target.value) || 1))} min={1} /></div>
 <div className="input-group"><label className="input-label">Side length (in)</label>
 <input type="number" className="input-field" value={eqSide} onChange={e =>setEqSide(Math.max(1, parseFloat(e.target.value) || 5))} min={1} step={0.5} /></div>
 </div>
 <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 4 }}>Height: <strong>{calc.height.toFixed(2)}&quot;</strong>(side × 0.866) — All angles 60°
 </div>
 </div>

 <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(120,50%,40%)" }}>
 <h2 className={styles.calcTitle}>② Thousand Pyramids Layouts</h2>
 <div className={styles.resultDetails}>
 <div className="result-row"><span>6 per row × {calc.layout6.rows} rows</span><strong>~{calc.layout6.w.toFixed(0)}&quot; × {calc.layout6.h.toFixed(0)}&quot;</strong></div>
 <div className="result-row"><span>10 per row × {calc.layout10.rows} rows</span><strong>~{calc.layout10.w.toFixed(0)}&quot; × {calc.layout10.h.toFixed(0)}&quot;</strong></div>
 </div>
 <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 6 }}>Triangles alternate pointing up/down in rows. Top/bottom edges need partial triangles to square off.
 </div>
 </div>
 </>)}

 {/* Toolbar */}
 <div className="toolbar" style={{ marginBottom: 10 }}>
 <button className="btn btn-secondary btn-sm" onClick={() =>navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} />Copy</button>
 <button className="btn btn-secondary btn-sm" onClick={() =>window.print()}><Printer size={13} />Print</button>
 </div>

 {/* ═══ PROJECT REF TABLE ═══ */}
 {triType === "turnover" && (
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowProjects(!showProjects)}>Pinwheel Quilt — Packs Needed
 <ChevronDown size={14} style={{ transform: showProjects ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showProjects && (
 <div style={{ marginTop: 10, overflowX: "auto" }}>
 <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
 <thead><tr><th style={tH}>Size</th><th style={tH}>Blocks</th><th style={tH}>HSTs</th><th style={tH}>Turnovers</th><th style={tH}>Packs (80)</th></tr></thead>
 <tbody>{projectRef.map((p, i) =>(
 <tr key={i}><td style={{ ...tD, fontWeight: 600 }}>{p.name}</td><td style={tD}>{p.blocks}</td><td style={tD}>{p.hsts}</td><td style={tD}>{p.turnovers}</td><td style={tD}>{p.packs}</td></tr>
 ))}</tbody>
 </table>
 <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 4 }}>Pinwheel quilts use 8&quot; blocks (4 HSTs each at 4&quot; finished from 5&quot; turnovers).</div>
 </div>
 )}
 </div>
 )}

 {/* ═══ BACKGROUND FABRIC ═══ */}
 {triType === "turnover" && calc.type === "turnover" && (
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowBgCalc(!showBgCalc)}>Background Fabric Calculator
 <ChevronDown size={14} style={{ transform: showBgCalc ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showBgCalc && (
 <div style={{ marginTop: 10, fontSize: 12, lineHeight: 2 }}>
 <p style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>If your turnovers are all feature/dark fabric, you need matching light background turnovers.</p>
 <div className={styles.resultDetails}>
 <div className="result-row"><span>Background squares to cut</span><strong>{calc.bgSquares} at {toF(squareSize)}</strong></div>
 <div className="result-row"><span>Cut each diagonally once</span><strong>→ {calc.bgSquares * 2} bg triangles</strong></div>
 <div className="result-row"><span>WOF strips needed</span><strong>{calc.bgStrips} at {toF(squareSize)}</strong></div>
 <div className="result-row"><span>Background yardage</span><strong>{toFrac(calc.bgBuy)} yd</strong></div>
 </div>
 <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 4 }}>Or: buy a second pack in light/background fabrics for coordinated variety.
 </div>
 </div>
 )}
 </div>
 )}

 {/* ═══ TYPE COMPARISON ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowCompare(!showCompare)}>Triangle Type Comparison
 <ChevronDown size={14} style={{ transform: showCompare ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showCompare && (
 <div style={{ marginTop: 10, overflowX: "auto" }}>
 <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
 <thead><tr><th style={tH}>Type</th><th style={tH}>Shape</th><th style={tH}>Angles</th><th style={tH}>Common Use</th></tr></thead>
 <tbody>
 <tr style={{ background: triType === "turnover" ? "hsl(200,15%,93%)" : undefined }}><td style={{ ...tD, fontWeight: 600 }}>Turnovers</td><td style={tD}>Right △ (half square)</td><td style={tD}>45-45-90°</td><td style={tD}>HSTs, pinwheels</td></tr>
 <tr style={{ background: triType === "equilateral" ? "hsl(120,15%,93%)" : undefined }}><td style={{ ...tD, fontWeight: 600 }}>Equilateral</td><td style={tD}>Equal sides</td><td style={tD}>60-60-60°</td><td style={tD}>Thousand pyramids</td></tr>
 <tr><td style={{ ...tD, fontWeight: 600 }}>Setting triangles</td><td style={tD}>Right △ (from QST)</td><td style={tD}>Special</td><td style={tD}>On-point quilts</td></tr>
 <tr><td style={{ ...tD, fontWeight: 600 }}>HST papers</td><td style={tD}>Right △ with paper</td><td style={tD}>45-45-90°</td><td style={tD}>Precision HSTs</td></tr>
 </tbody>
 </table>
 </div>
 )}
 </div>

 {/* ═══ EDUCATIONAL ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowEdu(!showEdu)}>Understanding Triangle Pre-Cuts
 <ChevronDown size={14} style={{ transform: showEdu ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showEdu && (
 <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.9, color: "var(--color-text-secondary)" }}>
 <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>What Are Turnovers?</h4>
 <p style={{ fontSize: 12 }}>Turnovers are right isosceles triangles made by cutting 5&quot; charm squares diagonally once. Each square yields 2 turnovers. Standard packs contain 80 triangles from 40 coordinated charm squares. They&apos;re &quot;pre-cut&quot; — someone cut them for you.</p>

 <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 10 }}>The Bias Edge Challenge</h4>
 <p style={{ fontSize: 12 }}>The hypotenuse (long edge) is on the bias and stretches easily. Pin before sewing, consider a walking foot, and press without sliding the iron. After sewing into HSTs, the bias is encased in the seam and stabilized. Spray starch helps too.</p>

 <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 10 }}>Finished Sizes (Common Confusion)</h4>
 <p style={{ fontSize: 12 }}>5&quot; turnovers do NOT make 5&quot; finished HSTs! Two 5&quot; turnovers → ~4½&quot; unfinished HST → 4&quot; finished after seaming into a quilt. Always trim to exact size after pressing. The &quot;lost inch&quot; accounts for seam allowances on both triangles.</p>
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
 {triType === "turnover" && calc.type === "turnover" ? (<>
 <div>Type: <strong>Turnovers</strong></div>
 <div>Total: <strong>{calc.totalTri}</strong></div>
 <div>HSTs: <strong>{calc.hsts}</strong>at {toF(calc.hstFin)}</div>
 <div>Pinwheels: <strong>{calc.pinwheels}</strong>at {toF(calc.pinwheelFin)}</div>
 <div>Hourglasses: <strong>{calc.hourglasses}</strong></div>
 </>) : (<>
 <div>Type: <strong>Equilateral</strong></div>
 <div>Count: <strong>{eqCount}</strong></div>
 <div>Side: <strong>{eqSide}&quot;</strong></div>
 <div>Height: <strong>{(eqSide * 0.866).toFixed(1)}&quot;</strong></div>
 </>)}
 </div>
 </div>
 <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
 <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Quick Sizes</h4>
 <div style={{ fontSize: 11, padding: 8, background: "hsl(0,0%,96%)", borderRadius: 6, fontFamily: "monospace", lineHeight: 2 }}>
 5&quot; turnovers:<br />HST = 4&quot; fin (4½&quot; unfin)<br />Pinwheel = 8&quot; fin<br />Hourglass = 4&quot; fin<br />80 turnovers = 1 pack
 </div>
 </div>
 <div className="glass-card related-tools">
 <h4>Related Tools</h4>
 <a href="/quilt/hst-calculator" className="related-tool-link">HST Calculator</a>
 <a href="/quilt/pinwheel-calculator" className="related-tool-link">Pinwheel Calculator</a>
 <a href="/quilt/qst-calculator" className="related-tool-link">QST Calculator</a>
 <a href="/quilt/setting-triangles" className="related-tool-link">Setting Triangles</a>
 <a href="/quilt/charm-pack-calculator" className="related-tool-link">Charm Pack</a>
 <a href="/quilt" className="related-tool-link">All Quilt Tools</a>
 </div>
 </aside>
 </div>
 </div>
 );
}