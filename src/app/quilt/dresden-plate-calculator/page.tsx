"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Flower2, ChevronDown } from "lucide-react";

/* ─── helpers ──────────────────────────────────── */
const toRad = (d: number) =>(d * Math.PI) / 180;
const roundN = (v: number, d = 2) =>Math.round(v * 10 ** d) / 10 ** d;
const ceilQ = (v: number, q = 0.25) =>Math.ceil(v / q) * q;

function toFrac(v: number): string {
 const whole = Math.floor(v);
 const rem = v - whole;
 const map: [number, string][] = [[0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
 for (const [t, s] of map) if (Math.abs(rem - t) < 0.02) return whole >0 ? `${whole}${s}` : s;
 if (rem < 0.05) return `${whole}`;
 return v.toFixed(2);
}

/* ─── constants ──────────────────────────────────── */
const DIAMETER_PRESETS = [6, 8, 10, 12, 14, 16, 18, 20, 24];
const BLADE_PRESETS = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32];
const STYLE_OPTIONS = [
 { key: "full" as const, label: "Full Plate (360°)", arc: 360 },
 { key: "half" as const, label: "Dresden Fan (180°)", arc: 180 },
 { key: "quarter" as const, label: "Grandmother's Fan (90°)", arc: 90 },
];
const TIP_OPTIONS = [
 { key: "pointed" as const, label: "Pointed" },
 { key: "rounded" as const, label: "Rounded (Petal)" },
 { key: "flat" as const, label: "Flat-Topped" },
];
const FABRIC_MODES = [
 { key: "solid" as const, label: "All Same Fabric" },
 { key: "alternate" as const, label: "Alternating 2 Fabrics" },
 { key: "scrappy" as const, label: "Scrappy (each different)" },
];

const SA = 0.25; // seam allowance

/* ─── component ──────────────────────────────────── */
export default function Page() {
 const [diameter, setDiameter] = useState(12);
 const [bladeCount, setBladeCount] = useState(20);
 const [plateStyle, setPlateStyle] = useState<"full" | "half" | "quarter">("full");
 const [tipStyle, setTipStyle] = useState<"pointed" | "rounded" | "flat">("rounded");
 const [centerDia, setCenterDia] = useState(2.5);
 const [blockCount, setBlockCount] = useState(12);
 const [fabricWidth, setFabricWidth] = useState(44);
 const [fabricMode, setFabricMode] = useState<"solid" | "alternate" | "scrappy">("alternate");
 const [activeFaq, setActiveFaq] = useState<number | null>(null);
 const [showRef, setShowRef] = useState(false);
 const [showAssembly, setShowAssembly] = useState(false);
 const [showTrouble, setShowTrouble] = useState(false);

 /* ─── core math ─── */
 const results = useMemo(() =>{
 const angle = 360 / bladeCount;
 const halfAngle = angle / 2;
 const radius = diameter / 2;
 const arc = STYLE_OPTIONS.find(s =>s.key === plateStyle)!.arc;
 const bladesPerBlock = Math.round(arc / angle);
 const bladeLength = radius; // finished
 const wideEnd = roundN(2 * bladeLength * Math.tan(toRad(halfAngle)), 3);
 const narrowEnd = roundN(2 * (centerDia / 2) * Math.tan(toRad(halfAngle)), 3);

 // Cut dimensions (+ SA all around)
 const bladeCutLength = roundN(bladeLength + 2 * SA, 3);
 const wideEndCut = roundN(wideEnd + 2 * SA, 3);
 const narrowEndCut = roundN(narrowEnd + 2 * SA, 3);
 const centerCut = roundN(centerDia + 2 * SA, 3);

 // Background square
 const bgFinished = diameter + 1; // +1" border
 const bgCut = bgFinished + 0.5;

 // Yardage — blade fabric
 const usableWidth = fabricWidth - 1;
 const totalBlades = bladesPerBlock * blockCount;

 // Blades from WOF strip (cut strip at wideEndCut, nest wedges)
 const stripWidth = Math.ceil(wideEndCut * 4) / 4; // round up to nearest ¼"
 const bladesPerStrip = Math.max(1, Math.floor(usableWidth / wideEndCut)); // conservative: no nesting

 let bladeFabrics: { label: string; blades: number; strips: number; inches: number; yd: number; buy: number }[] = [];

 if (fabricMode === "solid") {
 const strips = Math.ceil(totalBlades / bladesPerStrip);
 const inches = strips * stripWidth;
 const yd = roundN(inches / 36, 2);
 const buy = ceilQ(yd + 0.05);
 bladeFabrics = [{ label: "Blade Fabric", blades: totalBlades, strips, inches, yd, buy }];
 } else if (fabricMode === "alternate") {
 const half = Math.ceil(bladesPerBlock / 2);
 const other = bladesPerBlock - half;
 const aTotal = half * blockCount;
 const bTotal = other * blockCount;
 const aStrips = Math.ceil(aTotal / bladesPerStrip);
 const bStrips = Math.ceil(bTotal / bladesPerStrip);
 const aIn = aStrips * stripWidth;
 const bIn = bStrips * stripWidth;
 bladeFabrics = [
 { label: "Fabric A", blades: aTotal, strips: aStrips, inches: aIn, yd: roundN(aIn / 36, 2), buy: ceilQ(aIn / 36 + 0.05) },
 { label: "Fabric B", blades: bTotal, strips: bStrips, inches: bIn, yd: roundN(bIn / 36, 2), buy: ceilQ(bIn / 36 + 0.05) },
 ];
 } else {
 // scrappy — each blade different, 1 blade per fabric
 const scrapW = roundN(wideEndCut + 0.5, 1);
 const scrapH = roundN(bladeCutLength + 0.5, 1);
 bladeFabrics = [{ label: `${totalBlades} scraps`, blades: totalBlades, strips: 0, inches: 0, yd: 0, buy: 0 }];
 // attach scrap info
 (bladeFabrics[0] as any).scrapSize = `${scrapW}" × ${scrapH}"`;
 }

 // Center circles
 const circlesPerRow = Math.max(1, Math.floor(usableWidth / centerCut));
 const circleRows = Math.ceil(blockCount / circlesPerRow);
 const circleInches = circleRows * centerCut;
 const circleYd = roundN(circleInches / 36, 2);
 const circleBuy = ceilQ(circleYd + 0.05);

 // Background squares
 const bgPerRow = Math.max(1, Math.floor(usableWidth / bgCut));
 const bgRows = Math.ceil(blockCount / bgPerRow);
 const bgInches = bgRows * bgCut;
 const bgYd = roundN(bgInches / 36, 2);
 const bgBuy = ceilQ(bgYd + 0.05);

 return {
 angle: roundN(angle, 2), halfAngle: roundN(halfAngle, 2),
 bladesPerBlock, totalBlades,
 bladeLength, wideEnd, narrowEnd,
 bladeCutLength, wideEndCut, narrowEndCut,
 centerCut, bgFinished, bgCut,
 stripWidth, bladesPerStrip,
 bladeFabrics, circleYd, circleBuy, circleInches,
 bgYd, bgBuy, bgInches,
 };
 }, [diameter, bladeCount, plateStyle, centerDia, blockCount, fabricWidth, fabricMode]);

 /* ─── SVG visual ─── */
 const plateSvg = useMemo(() =>{
 const arc = STYLE_OPTIONS.find(s =>s.key === plateStyle)!.arc;
 const cx = 110, cy = 110, r = 90;
 const bladesShown = Math.round(arc / results.angle);
 const startAngle = plateStyle === "quarter" ? -90 : plateStyle === "half" ? -90 : 0;
 const paths: JSX.Element[] = [];
 const innerR = (centerDia / diameter) * r;

 for (let i = 0; i < bladesShown; i++) {
 const a1 = startAngle + i * results.angle;
 const a2 = startAngle + (i + 1) * results.angle;
 const r1 = toRad(a1), r2 = toRad(a2);
 const ox1 = cx + r * Math.cos(r1), oy1 = cy + r * Math.sin(r1);
 const ox2 = cx + r * Math.cos(r2), oy2 = cy + r * Math.sin(r2);
 const ix1 = cx + innerR * Math.cos(r1), iy1 = cy + innerR * Math.sin(r1);
 const ix2 = cx + innerR * Math.cos(r2), iy2 = cy + innerR * Math.sin(r2);

 const isEven = i % 2 === 0;
 let fill = isEven ? "hsl(200,50%,50%)" : "hsl(0,55%,55%)";
 if (fabricMode === "solid") fill = "hsl(200,50%,50%)";
 if (fabricMode === "scrappy") {
 const hue = (i * 137.5) % 360;
 fill = `hsl(${hue},50%,50%)`;
 }

 let outerPath: string;
 if (tipStyle === "rounded") {
 const largeArc = results.angle >180 ? 1 : 0;
 outerPath = `M${ix1},${iy1} L${ox1},${oy1} A${r},${r} 0 ${largeArc} 1 ${ox2},${oy2} L${ix2},${iy2} Z`;
 } else {
 outerPath = `M${ix1},${iy1} L${ox1},${oy1} L${ox2},${oy2} L${ix2},${iy2} Z`;
 }
 paths.push(<path key={i} d={outerPath} fill={fill} stroke="#fff" strokeWidth={1.2} />);
 }

 return (
 <svg viewBox="0 0 220 220" style={{ width: "100%", maxWidth: 220 }}>
 {paths}
 <circle cx={cx} cy={cy} r={innerR} fill="hsl(45,60%,90%)" stroke="hsl(45,40%,60%)" strokeWidth={1} />
 <text x={cx} y={cy + 3} textAnchor="middle" fontSize={8} fill="hsl(0,0%,40%)">{results.bladesPerBlock} blades</text>
 </svg>
 );
 }, [diameter, bladeCount, plateStyle, tipStyle, centerDia, fabricMode, results]);

 /* blade template SVG */
 const templateSvg = useMemo(() =>{
 const h = 160, topW = results.wideEndCut * 20, botW = results.narrowEndCut * 20;
 const cx = 80;
 return (
 <svg viewBox="0 0 160 180" style={{ width: "100%", maxWidth: 160 }}>
 <polygon
 points={`${cx - topW / 2},10 ${cx + topW / 2},10 ${cx + botW / 2},${10 + h} ${cx - botW / 2},${10 + h}`}
 fill="hsl(150,30%,92%)" stroke="hsl(150,50%,40%)" strokeWidth={1.5}
 />
 {/* Center line */}
 <line x1={cx} y1={8} x2={cx} y2={10 + h + 2} stroke="hsl(0,0%,60%)" strokeWidth={0.5} strokeDasharray="3,2" />
 {/* Dimensions */}
 <text x={cx} y={7} textAnchor="middle" fontSize={7} fill="hsl(0,0%,40%)">{toFrac(results.wideEndCut)}&quot;</text>
 <text x={cx} y={10 + h + 12} textAnchor="middle" fontSize={7} fill="hsl(0,0%,40%)">{toFrac(results.narrowEndCut)}&quot;</text>
 <text x={cx + topW / 2 + 8} y={10 + h / 2} textAnchor="start" fontSize={7} fill="hsl(0,0%,40%)" transform={`rotate(90, ${cx + topW / 2 + 8}, ${10 + h / 2})`}>{toFrac(results.bladeCutLength)}&quot;</text>
 {/* Angle marker */}
 <text x={cx} y={10 + h - 5} textAnchor="middle" fontSize={6} fill="hsl(0,0%,55%)">{results.halfAngle}° half-angle</text>
 </svg>
 );
 }, [results]);

 /* copy text */
 const copyText = `Dresden Plate: ${diameter}" diameter, ${results.bladesPerBlock} blades at ${results.angle}° each. Blade cut: ${toFrac(results.bladeCutLength)}" × ${toFrac(results.wideEndCut)}" (wide) to ${toFrac(results.narrowEndCut)}" (narrow). Center circle cut: ${toFrac(results.centerCut)}". ${plateStyle === "full" ? "Full plate" : plateStyle === "half" ? "Dresden fan" : "Grandmother's fan"}.`;

 /* FAQ */
 const faqItems = [
 { q: "What angle do I cut Dresden Plate blades?", a: `Divide 360° by the number of blades. For ${bladeCount} blades: 360° ÷ ${bladeCount} = ${results.angle}°. The half-angle for cutting is ${results.halfAngle}°. This half-angle is the angle you need from the center line of each blade to the cutting edge.` },
 { q: "How many blades for a Dresden Plate?", a: "The most popular count is 20 blades, which gives a classic Dresden look with 18° per blade. For beginners, 12-16 blades are easier (wider blades). For an elegant look, 24 blades creates a finer pattern. The blade count must divide evenly into 360°." },
 { q: "How do I make a Dresden Plate block?", a: "1) Cut all blades using a template or specialty ruler. 2) If using rounded tips, fold and press each tip. 3) Sew blades together in pairs, then join pairs to form the ring. 4) Press seams open. 5) Appliqué the completed plate to a background square. 6) Add the center circle to cover blade ends." },
 { q: "What size template for a 12-inch Dresden Plate?", a: `For a 12" plate with 20 blades: blade cut length is 6.5" (6" finished + seam allowance), wide end cut is ${toFrac(results.wideEndCut)}", narrow end cut is ${toFrac(results.narrowEndCut)}". The blade is a tapered wedge shape, wider at the outer edge.` },
 { q: "What is the difference between a Dresden Plate and a Grandmother's Fan?", a: "Both use identical blade shapes and calculations. A Dresden Plate is a full circle (360°, all blades). A Grandmother's Fan is a quarter circle (90°) that sits in one corner of a block. A Dresden Fan is a half circle (180°). Use this calculator for all three by selecting the plate style." },
 { q: "How do I make rounded Dresden Plate tips?", a: "Cut blades with a curved wide end. Fold the wide end to the wrong side by ¼\", pressing carefully around the curve. Use spray starch and a cardstock pressing template for consistent results. Alternatively, use the facing method: sew a small facing piece, trim, clip curves, turn right side out." },
 { q: "What is the center circle size for a Dresden Plate?", a: `For a ${diameter}" plate: the recommended center circle is ${centerDia}" finished (${toFrac(results.centerCut)}" cut with seam allowance). The circle should be large enough to cover all blade narrow ends plus at least ½" overlap. Larger centers are fine and create a different design emphasis.` },
 { q: "How do I cut Dresden Plate blades without a ruler?", a: "Create a cardstock template using the blade dimensions from this calculator. Trace the template onto fabric and cut with scissors or rotary cutter. Alternatively, cut fabric strips at the wide-end width, then use the blade angle to cut wedges from the strip." },
 { q: "How much fabric do I need for a Dresden Plate?", a: `For ${blockCount} blocks of ${diameter}" plates with ${results.bladesPerBlock} blades each, you need ${results.totalBlades} total blades. ${fabricMode === "alternate" ? `At two fabrics alternating: buy ${toFrac(results.bladeFabrics[0]?.buy || 0)} yd each.` : fabricMode === "solid" ? `All same fabric: buy ${toFrac(results.bladeFabrics[0]?.buy || 0)} yd.` : `Scrappy: each blade from a different fabric.`}` },
 { q: "How do I make Dresden Plate blades lay flat?", a: "Keep the grain line running through the center of each blade (straight grain = center line). Stay-stitch the outer edge of the assembled plate before appliquéing. Press blade tips firmly with starch. Ensure the background square is at least 1\" larger than the plate diameter." },
 { q: "What ruler do I use for Dresden Plate cutting?", a: "Commercial rulers are available for 10, 12, 16, 20, and 24-blade Dresdens. The 20-blade ruler is most common. Always verify your ruler produces the correct size for your specific plate diameter, as rulers are sized for specific diameter ranges." },
 { q: "How do I fix a Dresden Plate that doesn't form a complete circle?", a: "If there's a gap (plate doesn't close): your blade angle was too small or seam allowances too wide. Slightly reduce the seam allowance between remaining blades. If blades overlap: your angle was too large. Trim the overlapping edges before completing the ring." },
 ];

 return (
 <div className="container">
 <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "Dresden Plate Calculator" }]} />
 <div className="calculator-layout">
 <div className="calculator-main">
 {/* HEADER */}
 <div className={styles.toolHeader}>
 <span className="category-badge"><Flower2 size={14} strokeWidth={1.5} />Quilt #153</span>
 <h1>Dresden Plate Calculator</h1>
 <p>Calculate blade dimensions, angles, cutting sizes, center circle, and yardage for Dresden Plate blocks of any size and blade count. Includes Grandmother&apos;s Fan and Dresden Fan calculations, rounded tip instructions, and complete cutting plans.</p>
 </div>

 {/* ① PLATE SIZE */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>① Plate Size &amp; Blade Count</h2>
 <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, color: "var(--color-text-secondary)" }}>Finished Plate Diameter</div>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
 {DIAMETER_PRESETS.map(d =>(
 <button key={d} className={`btn btn-sm ${diameter === d ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setDiameter(d)}>{d}&quot;</button>
 ))}
 </div>
 <div className="calculator-form-row">
 <div className="input-group"><label className="input-label">Diameter (inches)</label>
 <input type="number" className="input-field" value={diameter} onChange={e =>setDiameter(parseFloat(e.target.value) || 6)} min={4} max={36} step={0.5} /></div>
 <div className="input-group"><label className="input-label">Center Circle (finished)</label>
 <input type="number" className="input-field" value={centerDia} onChange={e =>setCenterDia(parseFloat(e.target.value) || 1)} min={0.5} max={diameter * 0.5} step={0.25} /></div>
 </div>

 <div style={{ fontSize: 12, fontWeight: 600, marginTop: 12, marginBottom: 4, color: "var(--color-text-secondary)" }}>Number of Blades</div>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
 {BLADE_PRESETS.map(b =>(
 <button key={b} className={`btn btn-sm ${bladeCount === b ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setBladeCount(b)}>
 {b} <span style={{ fontSize: 9, opacity: 0.7 }}>({roundN(360 / b)}°)</span>
 </button>
 ))}
 </div>
 <div className="calculator-form-row">
 <div className="input-group"><label className="input-label">Custom blade count</label>
 <input type="number" className="input-field" value={bladeCount} onChange={e =>setBladeCount(parseInt(e.target.value) || 8)} min={6} max={64} /></div>
 </div>
 </div>

 {/* ② STYLE OPTIONS */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>② Plate Style &amp; Blade Tips</h2>
 <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, color: "var(--color-text-secondary)" }}>Plate Style</div>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
 {STYLE_OPTIONS.map(s =>(
 <button key={s.key} className={`btn btn-sm ${plateStyle === s.key ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setPlateStyle(s.key)}>{s.label}</button>
 ))}
 </div>
 <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, color: "var(--color-text-secondary)" }}>Blade Tip Style</div>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
 {TIP_OPTIONS.map(t =>(
 <button key={t.key} className={`btn btn-sm ${tipStyle === t.key ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setTipStyle(t.key)}>{t.label}</button>
 ))}
 </div>
 <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>
 {tipStyle === "pointed" && "Classic pointed tips — sharper graphic look. No special tip construction."}
 {tipStyle === "rounded" && "Rounded petal tips — softer, flower-like. Requires folding and pressing each tip."}
 {tipStyle === "flat" && "Flat-topped blades — modern geometric look. Simplest to construct."}
 </div>
 </div>

 {/* ③ QUILT PLAN */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>③ Quilt Plan &amp; Fabric</h2>
 <div className="calculator-form-row">
 <div className="input-group"><label className="input-label">Blocks to make</label>
 <input type="number" className="input-field" value={blockCount} onChange={e =>setBlockCount(parseInt(e.target.value) || 1)} min={1} max={100} /></div>
 <div className="input-group"><label className="input-label">Fabric width (inches)</label>
 <select className="input-field" value={fabricWidth} onChange={e =>setFabricWidth(parseInt(e.target.value))}>
 <option value={42}>42&quot;</option><option value={44}>44&quot;</option><option value={60}>60&quot;</option>
 </select></div>
 </div>
 <div style={{ fontSize: 12, fontWeight: 600, marginTop: 8, marginBottom: 4, color: "var(--color-text-secondary)" }}>Blade Fabric Arrangement</div>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
 {FABRIC_MODES.map(fm =>(
 <button key={fm.key} className={`btn btn-sm ${fabricMode === fm.key ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setFabricMode(fm.key)}>{fm.label}</button>
 ))}
 </div>
 </div>

 {/* ═══ PRIMARY RESULT ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(150,60%,40%)" }}>
 <h2 className={styles.calcTitle}>
 {plateStyle === "full" ? "Dresden Plate" : plateStyle === "half" ? "Dresden Fan" : "Grandmother's Fan"} — {diameter}&quot; Diameter
 </h2>

 {/* Plate visual + template side by side */}
 <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
 <div style={{ textAlign: "center" }}>
 <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: "var(--color-text-secondary)" }}>Plate Preview</div>
 {plateSvg}
 </div>
 <div style={{ textAlign: "center" }}>
 <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: "var(--color-text-secondary)" }}>Blade Template</div>
 {templateSvg}
 </div>
 </div>

 {/* Core dimensions */}
 <div className={styles.resultDetails}>
 <div className={styles.resultRow}><span>Blade angle</span><strong>{results.angle}° <span style={{ fontSize: 11, fontWeight: 400, color: "var(--color-text-tertiary)" }}>(360° ÷ {bladeCount})</span></strong></div>
 <div className={styles.resultRow}><span>Half-angle (for cutting)</span><strong>{results.halfAngle}°</strong></div>
 <div className={styles.resultRow}><span>Blades per block</span><strong>{results.bladesPerBlock}</strong></div>
 {blockCount >1 && <div className={styles.resultRow}><span>Total blades ({blockCount} blocks)</span><strong>{results.totalBlades}</strong></div>}
 </div>
 </div>

 {/* ═══ BLADE DIMENSIONS ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>Blade Dimensions</h2>
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
 <div style={{ padding: 10, background: "hsl(150,30%,96%)", borderRadius: 6 }}>
 <div style={{ fontSize: 11, fontWeight: 600, color: "hsl(150,50%,35%)", marginBottom: 4 }}>Finished (sewn)</div>
 <div style={{ fontSize: 13, lineHeight: 1.8 }}>
 <div>Length: <strong>{toFrac(results.bladeLength)}&quot;</strong></div>
 <div>Wide end: <strong>{toFrac(results.wideEnd)}&quot;</strong></div>
 <div>Narrow end: <strong>{toFrac(results.narrowEnd)}&quot;</strong></div>
 </div>
 </div>
 <div style={{ padding: 10, background: "hsl(200,30%,96%)", borderRadius: 6 }}>
 <div style={{ fontSize: 11, fontWeight: 600, color: "hsl(200,50%,35%)", marginBottom: 4 }}>Cut (with ¼&quot; SA)</div>
 <div style={{ fontSize: 13, lineHeight: 1.8 }}>
 <div>Length: <strong>{toFrac(results.bladeCutLength)}&quot;</strong></div>
 <div>Wide end: <strong>{toFrac(results.wideEndCut)}&quot;</strong></div>
 <div>Narrow end: <strong>{toFrac(results.narrowEndCut)}&quot;</strong></div>
 </div>
 </div>
 </div>

 <div className={styles.resultDetails}>
 <div className={styles.resultRow}><span>Center circle (finished)</span><strong>{toFrac(centerDia)}&quot; diameter</strong></div>
 <div className={styles.resultRow}><span>Center circle (cut)</span><strong>{toFrac(results.centerCut)}&quot; diameter</strong></div>
 <div className={styles.resultRow}><span>Background square (finished)</span><strong>{toFrac(results.bgFinished)}&quot; × {toFrac(results.bgFinished)}&quot;</strong></div>
 <div className={styles.resultRow}><span>Background square (cut)</span><strong>{toFrac(results.bgCut)}&quot; × {toFrac(results.bgCut)}&quot;</strong></div>
 </div>

 <div style={{ marginTop: 8, fontSize: 12, color: "var(--color-text-tertiary)", lineHeight: 1.6 }}>Wide end formula: 2 × {toFrac(results.bladeLength)}&quot; × tan({results.halfAngle}°) = {toFrac(results.wideEnd)}&quot;
 </div>
 </div>

 {/* ═══ YARDAGE ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>Cutting &amp; Yardage — {blockCount} Block{blockCount >1 ? "s" : ""}</h2>

 <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Blade Fabric</div>
 {results.bladeFabrics.map((f, i) =>(
 <div key={i} style={{ padding: 10, background: i === 0 ? "hsl(200,25%,96%)" : "hsl(0,20%,96%)", borderRadius: 6, marginBottom: 6 }}>
 <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{f.label}</div>
 <div style={{ fontSize: 13, lineHeight: 1.7 }}>
 <div>Blades: {f.blades}</div>
 {f.strips >0 && <div>WOF strips at {toFrac(results.stripWidth)}&quot;: {f.strips}</div>}
 {f.strips >0 && <div>Fabric length: {toFrac(f.inches)}&quot; = {f.yd} yd</div>}
 {f.buy >0 && <div style={{ fontWeight: 600, color: "hsl(150,60%,35%)" }}>Buy: {toFrac(f.buy)} yd</div>}
 {(f as any).scrapSize && <div>Minimum scrap per blade: <strong>{(f as any).scrapSize}</strong></div>}
 </div>
 </div>
 ))}

 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
 <div style={{ padding: 10, background: "hsl(45,40%,95%)", borderRadius: 6 }}>
 <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>Center Circles</div>
 <div style={{ fontSize: 13, lineHeight: 1.7 }}>
 <div>{blockCount} circles at {toFrac(results.centerCut)}&quot;</div>
 <div style={{ fontWeight: 600, color: "hsl(150,60%,35%)" }}>Buy: {toFrac(results.circleBuy)} yd</div>
 </div>
 </div>
 <div style={{ padding: 10, background: "hsl(0,0%,96%)", borderRadius: 6 }}>
 <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>Background</div>
 <div style={{ fontSize: 13, lineHeight: 1.7 }}>
 <div>{blockCount} squares at {toFrac(results.bgCut)}&quot;</div>
 <div style={{ fontWeight: 600, color: "hsl(150,60%,35%)" }}>Buy: {toFrac(results.bgBuy)} yd</div>
 </div>
 </div>
 </div>
 </div>

 {/* Toolbar */}
 <div className="toolbar" style={{ marginBottom: 16 }}>
 <button className="btn btn-secondary btn-sm" onClick={() =>navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} />Copy</button>
 <button className="btn btn-secondary btn-sm" onClick={() =>window.print()}><Printer size={13} />Print</button>
 </div>

 {/* ═══ BLADE ANGLE REFERENCE ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
 onClick={() =>setShowRef(!showRef)}>Blade Angle Reference Table
 <ChevronDown size={14} style={{ transform: showRef ? "rotate(180deg)" : "none", transition: "0.2s" }} />
 </button>
 {showRef && (
 <div style={{ marginTop: 10, overflowX: "auto" }}>
 <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
 <thead><tr style={{ borderBottom: "2px solid hsl(0,0%,85%)" }}>
 <th style={{ textAlign: "left", padding: "6px 8px" }}>Blades</th>
 <th style={{ textAlign: "right", padding: "6px 8px" }}>Angle</th>
 <th style={{ textAlign: "right", padding: "6px 8px" }}>Half Angle</th>
 <th style={{ textAlign: "left", padding: "6px 8px" }}>Look</th>
 <th style={{ textAlign: "left", padding: "6px 8px" }}>Best Ruler</th>
 </tr></thead>
 <tbody>
 {[
 [8, "Wide, bold", "8-blade ruler"],
 [10, "Moderate", "10-blade ruler"],
 [12, "Classic fan", "12-blade ruler"],
 [16, "Fine", "16-blade ruler"],
 [20, "Classic Dresden", "20-blade ruler"],
 [24, "Elegant", "24-blade ruler"],
 [32, "Extremely fine", "Template"],
 ].map(([b, look, ruler]) =>{
 const bn = b as number;
 const a = roundN(360 / bn);
 const ha = roundN(a / 2);
 const isCurrent = bn === bladeCount;
 return (
 <tr key={bn} style={{ background: isCurrent ? "hsl(150,40%,95%)" : undefined, borderBottom: "1px solid hsl(0,0%,92%)" }}>
 <td style={{ padding: "5px 8px", fontWeight: isCurrent ? 700 : 400 }}>{bn}</td>
 <td style={{ textAlign: "right", padding: "5px 8px" }}>{a}°</td>
 <td style={{ textAlign: "right", padding: "5px 8px" }}>{ha}°</td>
 <td style={{ padding: "5px 8px" }}>{look as string}</td>
 <td style={{ padding: "5px 8px" }}>{ruler as string}</td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 )}
 </div>

 {/* ═══ ASSEMBLY ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
 onClick={() =>setShowAssembly(!showAssembly)}>Assembly Instructions
 <ChevronDown size={14} style={{ transform: showAssembly ? "rotate(180deg)" : "none", transition: "0.2s" }} />
 </button>
 {showAssembly && (
 <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
 <h4 style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>Step 1: Prepare Blades</h4>
 <p>Cut all {results.bladesPerBlock} blades using template or ruler ({toFrac(results.bladeCutLength)}&quot; × {toFrac(results.wideEndCut)}&quot; tapered).
 {tipStyle === "rounded" && " Fold, press, and starch all blade tips for the rounded petal shape."}</p>
 <h4 style={{ color: "var(--color-text-primary)", fontWeight: 600, marginTop: 8 }}>Step 2: Sew Blades Together</h4>
 <p>Place two blades right sides together. Sew along one long side with ¼&quot; seam. Chain piece all pairs, then join pairs. Press seams open (lies flatter) or to one side.</p>
 <h4 style={{ color: "var(--color-text-primary)", fontWeight: 600, marginTop: 8 }}>Step 3: Check Size</h4>
 <p>Completed ring should be approximately {diameter}&quot; in diameter. The center opening should be around {toFrac(centerDia)}&quot;. If significantly off, check seam allowance consistency.</p>
 <h4 style={{ color: "var(--color-text-primary)", fontWeight: 600, marginTop: 8 }}>Step 4: Appliqué to Background</h4>
 <p>Fold {toFrac(results.bgFinished)}&quot; background square in quarters to find center. Position plate centered. Pin and appliqué the outer edge.</p>
 <h4 style={{ color: "var(--color-text-primary)", fontWeight: 600, marginTop: 8 }}>Step 5: Add Center Circle</h4>
 <p>Prepare {toFrac(results.centerCut)}&quot; center circle with turned-under edge. Center over the plate opening and appliqué in place, covering all blade narrow ends.</p>
 </div>
 )}
 </div>

 {/* ═══ TROUBLESHOOTING ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
 onClick={() =>setShowTrouble(!showTrouble)}>Troubleshooting Dresden Plates
 <ChevronDown size={14} style={{ transform: showTrouble ? "rotate(180deg)" : "none", transition: "0.2s" }} />
 </button>
 {showTrouble && (
 <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
 <div style={{ padding: 10, background: "hsl(0,20%,97%)", borderRadius: 6, marginBottom: 8 }}>
 <strong style={{ color: "hsl(0,60%,45%)" }}>Plate not lying flat — tips curling</strong>
 <p>Ensure grain line is centered (straight grain = center of blade). Press tips firmly with starch. Stay-stitch the outer edge before appliqué.</p>
 </div>
 <div style={{ padding: 10, background: "hsl(40,20%,97%)", borderRadius: 6, marginBottom: 8 }}>
 <strong style={{ color: "hsl(40,60%,40%)" }}>Gap remains — blades don&apos;t complete the circle</strong>
 <p>Blade angle was too small or seam allowances too wide. Slightly reduce seam allowance between remaining blades. Verify blade template with a protractor.</p>
 </div>
 <div style={{ padding: 10, background: "hsl(200,20%,97%)", borderRadius: 6, marginBottom: 8 }}>
 <strong style={{ color: "hsl(200,60%,40%)" }}>Blades overlap — plate too large</strong>
 <p>Blade angle was too large. Trim overlapping edges slightly before completing the ring. Check template angle against the reference ({results.angle}° for {bladeCount} blades).</p>
 </div>
 <div style={{ padding: 10, background: "hsl(280,20%,97%)", borderRadius: 6 }}>
 <strong style={{ color: "hsl(280,60%,40%)" }}>Center circle doesn&apos;t cover blade ends</strong>
 <p>Increase center circle size by ½&quot; and recut. Or trim blade narrow ends slightly shorter before assembly. Current recommendation: {toFrac(centerDia)}&quot; finished.</p>
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
 <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Quick Formula</h4>
 <div style={{ fontSize: 12, fontFamily: "monospace", lineHeight: 2, color: "var(--color-text-secondary)" }}>
 <div>Angle = 360° ÷ blades</div>
 <div>Wide = 2 × R × tan(½∠)</div>
 <div>Cut = Finished + ½&quot;</div>
 <div>Circle cut = Ø + ½&quot;</div>
 </div>
 </div>
 <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
 <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Quick Answer</h4>
 <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.9 }}>
 <div>12&quot; plate, 20 blades → 18°</div>
 <div>Wide end ≈ 1.9&quot; finished</div>
 <div>Cut: 6½&quot; × 2.4&quot; tapered</div>
 <div>Center: 2½&quot; (3&quot; cut)</div>
 </div>
 </div>
 <div className="glass-card related-tools">
 <h4>Related Tools</h4>
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