"use client";
import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { Ruler, ArrowRightLeft, Copy, Printer, ChevronDown, Info, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

const C = 2.54;

/* ─── fraction parser ─── */
function parseInches(raw: string): number | null {
 const s = raw.trim().replace(/[^0-9./\- ]/g, "");
 if (!s) return null;
 if (s.includes("/")) {
 const parts = s.split(/[\s-]+/);
 if (parts.length === 2 && parts[1].includes("/")) {
 const whole = parseFloat(parts[0]) || 0;
 const [n, d] = parts[1].split("/").map(Number);
 if (!d || !isFinite(n / d)) return null;
 return whole + n / d;
 }
 const [n, d] = s.split("/").map(Number);
 if (!d || !isFinite(n / d)) return null;
 return n / d;
 }
 const v = parseFloat(s);
 return isFinite(v) && v >= 0 ? v : null;
}

function toFrac(v: number): string {
 const w = Math.floor(v); const r = v - w;
 const m: [number, string][] = [[.125, "⅛"], [.25, "¼"], [.375, "⅜"], [.5, "½"], [.625, "⅝"], [.75, "¾"], [.875, "⅞"]];
 for (const [t, s] of m) if (Math.abs(r - t) < .01) return w >0 ? `${w}${s}` : s;
 if (r < .05) return `${w || "0"}`;
 return v % 1 === 0 ? `${v}` : v.toFixed(3);
}

type Rounding = "0.5mm" | "mm" | "0.5cm" | "cm" | "exact";
function applyRound(cm: number, r: Rounding): number {
 switch (r) {
 case "0.5mm": return Math.round(cm * 20) / 20;
 case "mm": return Math.round(cm * 10) / 10;
 case "0.5cm": return Math.round(cm * 2) / 2;
 case "cm": return Math.round(cm);
 default: return cm;
 }
}
const ROUND_LABELS: { v: Rounding; l: string }[] = [
 { v: "0.5mm", l: "Nearest 0.5mm" }, { v: "mm", l: "Nearest mm" },
 { v: "0.5cm", l: "Nearest 0.5cm" }, { v: "cm", l: "Nearest cm" },
 { v: "exact", l: "No rounding" },
];

/* ─── preset rows ─── */
const SEAM = [
 { l: "⅛\"", v: .125, cm: "0.32" }, { l: "¼\"", v: .25, cm: "0.64" },
 { l: "⅜\"", v: .375, cm: "0.95" }, { l: "½\"", v: .5, cm: "1.27" },
 { l: "⅝\"", v: .625, cm: "1.59" }, { l: "¾\"", v: .75, cm: "1.91" },
 { l: "⅞\"", v: .875, cm: "2.22" }, { l: "1\"", v: 1, cm: "2.54" },
];
const HEM = [
 { l: "¼\"", v: .25 }, { l: "½\"", v: .5 }, { l: "1\"", v: 1 },
 { l: "1½\"", v: 1.5 }, { l: "2\"", v: 2 }, { l: "2½\"", v: 2.5 },
 { l: "3\"", v: 3 }, { l: "4\"", v: 4 },
];
const FABRIC_W = [
 { l: "36\"", v: 36 }, { l: "44\"", v: 44 }, { l: "45\"", v: 45 },
 { l: "54\"", v: 54 }, { l: "58\"", v: 58 }, { l: "60\"", v: 60 },
 { l: "72\"", v: 72 }, { l: "90\"", v: 90 }, { l: "108\"", v: 108 }, { l: "118\"", v: 118 },
];
const BODY = [20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54];
const WHOLE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 18, 20, 24, 27, 30, 36];

/* ─── sewing context engine ─── */
function getSewingContext(v: number): string | null {
 if (Math.abs(v - .25) < .01) return "Standard quilting seam allowance. Metric: 0.6 cm or 6 mm.";
 if (Math.abs(v - .375) < .01) return "Used for French seams, lightweight and baby garments. Metric: 1.0 cm.";
 if (Math.abs(v - .5) < .01) return "Common for knit garments and lingerie. Metric: 1.2–1.3 cm.";
 if (Math.abs(v - .625) < .01) return "THE standard US garment seam allowance. European equivalent: 1.5 cm (industry convention, not 1.6 cm). Most Burda/European patterns use 1.5 cm.";
 if (Math.abs(v - .75) < .01) return "Used in tailored garments for extra room to let out. Metric: 1.9–2.0 cm.";
 if (Math.abs(v - 1) < .01) return "Structural seams and tailored garments. Metric: 2.5 cm.";
 if (Math.abs(v - 36) < .01) return "One yard — the standard US fabric purchase unit. 91.44 cm ≈ 0.914 meters.";
 if (v === 44 || v === 45) return `Standard quilting cotton/fashion fabric width. European equivalent: ${v === 44 ? "112 cm" : "114–115 cm"}.`;
 if (v === 54) return "Home décor and upholstery fabric width. European: 137–140 cm.";
 if (v === 60) return "Wide fashion fabric, knits, and coating. European: 150–152 cm.";
 if (v >= 20 && v <= 60 && v % 1 === 0) return "Body measurement range — precision matters. Round to nearest 0.5 cm for pattern sizing.";
 return null;
}

/* ─── reference data ─── */
const REF_TABLE = [
 { frac: "1/16\"", dec: .0625, cm: .159, use: "Seam grading" },
 { frac: "⅛\"", dec: .125, cm: .318, use: "Ease, scant seam" },
 { frac: "3/16\"", dec: .1875, cm: .476, use: "Piping allowance" },
 { frac: "¼\"", dec: .25, cm: .635, use: "Quilting seam allowance" },
 { frac: "5/16\"", dec: .3125, cm: .794, use: "Narrow seam" },
 { frac: "⅜\"", dec: .375, cm: .953, use: "French seam, baby garments" },
 { frac: "7/16\"", dec: .4375, cm: 1.111, use: "Uncommon" },
 { frac: "½\"", dec: .5, cm: 1.27, use: "Knits, lingerie" },
 { frac: "9/16\"", dec: .5625, cm: 1.429, use: "Rare" },
 { frac: "⅝\"", dec: .625, cm: 1.588, use: "Standard US garment seam" },
 { frac: "¾\"", dec: .75, cm: 1.905, use: "Tailored garments" },
 { frac: "⅞\"", dec: .875, cm: 2.223, use: "Heavy tailoring" },
 { frac: "1\"", dec: 1, cm: 2.54, use: "Structural seams, hems" },
 { frac: "1¼\"", dec: 1.25, cm: 3.175, use: "Hem allowance" },
 { frac: "1½\"", dec: 1.5, cm: 3.81, use: "Standard hem depth" },
 { frac: "1¾\"", dec: 1.75, cm: 4.445, use: "Deep hem" },
 { frac: "2\"", dec: 2, cm: 5.08, use: "Deep hem, waistband" },
 { frac: "2½\"", dec: 2.5, cm: 6.35, use: "Wide waistband" },
 { frac: "3\"", dec: 3, cm: 7.62, use: "Wide hem" },
 { frac: "4\"", dec: 4, cm: 10.16, use: "Wide hem allowance" },
 { frac: "6\"", dec: 6, cm: 15.24, use: "Half a ruler" },
 { frac: "9\"", dec: 9, cm: 22.86, use: "Fat quarter width (half)" },
 { frac: "12\"", dec: 12, cm: 30.48, use: "One foot" },
 { frac: "18\"", dec: 18, cm: 45.72, use: "Fat quarter length" },
 { frac: "22\"", dec: 22, cm: 55.88, use: "Fat quarter width" },
 { frac: "36\"", dec: 36, cm: 91.44, use: "One yard" },
 { frac: "44\"", dec: 44, cm: 111.76, use: "Standard fabric width" },
 { frac: "45\"", dec: 45, cm: 114.3, use: "Standard fabric width" },
 { frac: "54\"", dec: 54, cm: 137.16, use: "Home décor width" },
 { frac: "60\"", dec: 60, cm: 152.4, use: "Wide fabric width" },
];

const BODY_TABLE = [
 { part: "Bust", range: "30–58\"", ex: 38, cm: 96.52 },
 { part: "High Bust", range: "28–54\"", ex: 36, cm: 91.44 },
 { part: "Waist", range: "22–54\"", ex: 30, cm: 76.2 },
 { part: "Hip", range: "32–60\"", ex: 40, cm: 101.6 },
 { part: "Back Length", range: "14–18\"", ex: 15.5, cm: 39.37 },
 { part: "Shoulder Width", range: "13–17\"", ex: 15, cm: 38.1 },
 { part: "Sleeve Length", range: "22–26\"", ex: 24, cm: 60.96 },
 { part: "Inseam", range: "26–36\"", ex: 30, cm: 76.2 },
 { part: "Head Circ.", range: "20–24\"", ex: 22, cm: 55.88 },
];

const FABRIC_TABLE = [
 { in: 27, cm: 68.6, type: "Vintage/specialty fabrics" },
 { in: 36, cm: 91.4, type: "Vintage fashion fabrics" },
 { in: 44, cm: 111.8, type: "Standard quilting cotton" },
 { in: 45, cm: 114.3, type: "Standard fashion fabric" },
 { in: 54, cm: 137.2, type: "Upholstery, home décor" },
 { in: 58, cm: 147.3, type: "Fashion fabrics, woollens" },
 { in: 60, cm: 152.4, type: "Wide fashion, knits, coating" },
 { in: 72, cm: 182.9, type: "Very wide fabric" },
 { in: 90, cm: 228.6, type: "Wide backing fabric" },
 { in: 108, cm: 274.3, type: "Wide quilt backing" },
 { in: 118, cm: 299.7, type: "Widest quilt backing" },
];

const EUR_TABLE = [
 { eu: "90 cm", actual: 90, us: "35.4\"" },
 { eu: "110 cm", actual: 110, us: "43.3\" (Japanese cotton)" },
 { eu: "112 cm", actual: 112, us: "44.1\" (≈ 44\")" },
 { eu: "115 cm", actual: 115, us: "45.3\" (≈ 45\")" },
 { eu: "140 cm", actual: 140, us: "55.1\" (Burda standard)" },
 { eu: "150 cm", actual: 150, us: "59.1\" (≈ 60\")" },
];

/* ─── FAQ ─── */
const faqItems = [
 { q: "How many centimeters is 1 inch?", a: "One inch equals exactly 2.54 centimeters. This is an internationally standardized conversion defined in 1959 — it is exact, not an approximation. To convert any inch measurement, multiply by 2.54." },
 { q: "What is 5/8 inch in centimeters?", a: "5/8 inch equals 1.5875 cm exactly. In practice, sewists use 1.5 cm (European seam allowance convention) or 1.6 cm (rounded to nearest mm). Patterns saying \"5/8 inch or 1.5 cm\" give the industry-standard metric equivalent." },
 { q: "What is 1/4 inch in centimeters?", a: "1/4 inch equals 0.635 cm exactly (6.35 mm). Quilters use 0.6 cm or 6 mm as the nearest metric equivalent — this is the standard quilting seam allowance in metric countries." },
 { q: "What is 1/2 inch in centimeters?", a: "1/2 inch equals exactly 1.27 cm (12.7 mm). For sewing, this rounds to 1.3 cm. This seam allowance is commonly used for knit garments, lingerie, and children's clothing." },
 { q: "How do I convert fabric width from inches to cm?", a: "Multiply by 2.54. Common widths: 44\" = 112 cm, 45\" = 114.3 cm, 54\" = 137 cm, 60\" = 152.4 cm. European fabrics listed as \"115 cm\" are the same as 45\" fabric, and \"150 cm\" ≈ 60\"." },
 { q: "How do I convert body measurements from inches to cm?", a: "Multiply each measurement by 2.54 and round to the nearest 0.5 cm. Example: 36\" bust = 91.44 cm → use 91.5 cm. Precision matters — even 0.5 cm can mean a different pattern size." },
 { q: "Why is 5/8\" listed as 1.5 cm, not 1.6 cm, on patterns?", a: "This is a deliberate industry convention. European pattern companies round 1.5875 cm DOWN to 1.5 cm because it's a cleaner metric number, easier to set on machines, and the 0.0875 cm difference (<1 mm) is negligible for sewing." },
 { q: "Can I enter fractions like 5/8 into this calculator?", a: "Yes! Enter \"5/8\" for five-eighths, \"1/4\" for one-quarter, \"1-3/4\" or \"1 3/4\" for mixed fractions. Regular decimals like \"0.625\" or whole numbers like \"36\" also work." },
 { q: "How do I convert inches to cm without a calculator?", a: "Quick mental math: multiply by 2.5 (error only 0.04 per inch). Example: 5/8\" ≈ 0.625 × 2.5 = 1.56 cm (actual: 1.59 cm — close enough!). Or memorize: 1\" = 2.54, 12\" = 30.48, 36\" = 91.44." },
 { q: "Is there a difference between inch and cm rulers for sewing?", a: "Same physical length, different markings. Inch rulers divide into fractions (1/16, 1/8, 1/4…). CM rulers show millimeters (10mm = 1cm). Most sewing rulers show both — one unit per side." },
];

export default function Page() {
 const [raw, setRaw] = useState("");
 const [rounding, setRounding] = useState<Rounding>("mm");
 const [activeFaq, setActiveFaq] = useState<number | null>(null);
 const [copied, setCopied] = useState(false);
 const [showHem, setShowHem] = useState(false);
 const [showFabric, setShowFabric] = useState(false);
 const [showBody, setShowBody] = useState(false);
 const [showWhole, setShowWhole] = useState(false);
 const [showRef, setShowRef] = useState(false);
 const [showSeamSec, setShowSeamSec] = useState(false);
 const [showBodySec, setShowBodySec] = useState(false);
 const [showFabricSec, setShowFabricSec] = useState(false);
 const [showFormula, setShowFormula] = useState(false);
 const [showRoundGuide, setShowRoundGuide] = useState(false);

 const parsed = useMemo(() =>parseInches(raw), [raw]);
 const inches = parsed ?? 0;
 const hasResult = parsed !== null && parsed >0;
 const cmExact = inches * C;
 const mmExact = cmExact * 10;
 const cmRounded = applyRound(cmExact, rounding);
 const cmPractical = Math.round(cmExact * 2) / 2;
 const cmRough = Math.round(cmExact);
 const context = hasResult ? getSewingContext(inches) : null;

 const handleCopy = useCallback(() =>{
 if (!hasResult) return;
 const txt = `${toFrac(inches)}" = ${cmExact.toFixed(4)} cm (exact)\nRounded: ${cmRounded.toFixed(2)} cm | ${mmExact.toFixed(1)} mm\nPractical: ${cmPractical.toFixed(1)} cm`;
 navigator.clipboard.writeText(txt);
 setCopied(true); setTimeout(() =>setCopied(false), 2000);
 }, [hasResult, inches, cmExact, cmRounded, mmExact, cmPractical]);

 const setVal = (v: number) =>setRaw(v % 1 === 0 ? v.toString() : v.toString());

 const tS = { fontSize: 12, borderCollapse: "collapse" as const, width: "100%" };
 const tH = { padding: "6px 4px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left" as const, fontSize: 11 };
 const tD = { padding: "5px 4px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11 };
 const tR = { textAlign: "right" as const };

 return (
 <div className="container">
 <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Inches to Centimeters" }]} />
 <div className="calculator-layout">
 <div className="calculator-main">
 {/* HEADER */}
 <div className={styles.toolHeader}>
 <span className="category-badge"><Ruler size={14} strokeWidth={1.5} />Conversion #3</span>
 <h1>Inches to Centimeters Converter for Sewing &amp; Fabric</h1>
 <p>Convert inches to cm — including sewing fractions like ⅝&quot;, ⅜&quot;, and ¼&quot; — with seam allowance presets, body measurement support, and practical rounding for metric patterns.</p>
 </div>

 {/* ═══ CALCULATOR ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>Enter Inches</h2>
 <div className="input-group">
 <label className="input-label" htmlFor="in-input">Inches (decimals or fractions)</label>
 <input id="in-input" type="text" inputMode="text" className="input-field" style={{ fontSize: 22, height: 52 }}
 placeholder='e.g. 5/8 or 2.5 or 1-3/4' value={raw} onChange={e =>setRaw(e.target.value)} autoFocus />
 <span className="input-helper">Accepts fractions (5/8, 1-3/4) and decimals (0.625, 36)</span>
 </div>

 {/* Seam Allowance Presets — always visible */}
 <div style={{ marginTop: 12 }}>
 <span style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-secondary)" }}>Seam Allowances:</span>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
 {SEAM.map(p =>(
 <button key={p.l} className={`btn btn-sm ${inches === p.v ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setVal(p.v)} style={{ flexDirection: "column", padding: "6px 8px", minWidth: 42 }}>
 <span style={{ fontWeight: 700, fontSize: 13 }}>{p.l}</span>
 <span style={{ fontSize: 9, opacity: .7 }}>{p.cm} cm</span>
 </button>
 ))}
 </div>
 </div>

 {/* Hem Depths — collapsible */}
 <div style={{ marginTop: 8 }}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between", fontSize: 11 }}
 onClick={() =>setShowHem(!showHem)}>Hem Depths <ChevronDown size={12} style={{ transform: showHem ? "rotate(180deg)" : "none", transition: ".2s" }} /></button>
 {showHem && <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
 {HEM.map(p =><button key={p.l} className={`btn btn-sm ${inches === p.v ? "btn-primary" : "btn-secondary"}`} onClick={() =>setVal(p.v)} style={{ fontSize: 11 }}>{p.l}</button>)}
 </div>}
 </div>

 {/* Fabric Widths — collapsible */}
 <div style={{ marginTop: 4 }}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between", fontSize: 11 }}
 onClick={() =>setShowFabric(!showFabric)}>Fabric Widths <ChevronDown size={12} style={{ transform: showFabric ? "rotate(180deg)" : "none", transition: ".2s" }} /></button>
 {showFabric && <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
 {FABRIC_W.map(p =><button key={p.l} className={`btn btn-sm ${inches === p.v ? "btn-primary" : "btn-secondary"}`} onClick={() =>setVal(p.v)} style={{ fontSize: 11 }}>{p.l}</button>)}
 </div>}
 </div>

 {/* Body Measurements — collapsible */}
 <div style={{ marginTop: 4 }}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between", fontSize: 11 }}
 onClick={() =>setShowBody(!showBody)}>Body Measurements <ChevronDown size={12} style={{ transform: showBody ? "rotate(180deg)" : "none", transition: ".2s" }} /></button>
 {showBody && <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 4 }}>
 {BODY.map(v =><button key={v} className={`btn btn-sm ${inches === v ? "btn-primary" : "btn-secondary"}`} onClick={() =>setVal(v)} style={{ fontSize: 10, padding: "3px 6px" }}>{v}&quot;</button>)}
 </div>}
 </div>

 {/* Whole Inches — collapsible */}
 <div style={{ marginTop: 4 }}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between", fontSize: 11 }}
 onClick={() =>setShowWhole(!showWhole)}>Whole Inches <ChevronDown size={12} style={{ transform: showWhole ? "rotate(180deg)" : "none", transition: ".2s" }} /></button>
 {showWhole && <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 4 }}>
 {WHOLE.map(v =><button key={v} className={`btn btn-sm ${inches === v ? "btn-primary" : "btn-secondary"}`} onClick={() =>setVal(v)} style={{ fontSize: 10, padding: "3px 6px" }}>{v}</button>)}
 </div>}
 </div>

 {/* Rounding selector */}
 <div style={{ marginTop: 12, padding: 8, background: "hsl(200,10%,97%)", borderRadius: 6 }}>
 <span style={{ fontSize: 11, fontWeight: 600 }}>Round to:</span>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
 {ROUND_LABELS.map(r =>(
 <button key={r.v} className={`btn btn-sm ${rounding === r.v ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setRounding(r.v)} style={{ fontSize: 10, padding: "3px 8px" }}>{r.l}</button>
 ))}
 </div>
 </div>

 {/* ═══ RESULTS ═══ */}
 {hasResult && (
 <div className={styles.results} style={{ marginTop: 16 }}>
 <div className="calculator-divider" />
 <div className="result-card">
 <div className="result-prefix">{toFrac(inches)}&quot; =</div>
 <div className="result-value">{cmRounded.toFixed(rounding === "exact" ? 4 : 2)} cm</div>
 <div className="result-label">({rounding === "exact" ? "exact" : `rounded to ${ROUND_LABELS.find(r =>r.v === rounding)?.l}`})</div>
 </div>

 <div className={styles.resultDetails}>
 <div className="result-row"><span className="result-row-label">Exact cm</span><span className="result-row-value">{cmExact.toFixed(4)} cm</span></div>
 <div className="result-row"><span className="result-row-label">Nearest mm</span><span className="result-row-value">{(Math.round(cmExact * 10) / 10).toFixed(1)} cm</span></div>
 <div className="result-row"><span className="result-row-label">Practical (nearest 0.5cm)</span><span className="result-row-value" style={{ color: "var(--color-accent-primary)", fontWeight: 700 }}>{cmPractical.toFixed(1)} cm</span></div>
 <div className="result-row"><span className="result-row-label">Rough (nearest cm)</span><span className="result-row-value">{cmRough} cm</span></div>
 <div className="result-row"><span className="result-row-label">Millimeters</span><span className="result-row-value">{mmExact.toFixed(1)} mm</span></div>
 <div className="result-row"><span className="result-row-label">As decimal inches</span><span className="result-row-value">{inches.toFixed(4)}&quot;</span></div>
 </div>

 {context && (
 <div className="note-tip" style={{ marginTop: 12 }}>
 <Info size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />
 <strong>Sewing context:</strong>{context}
 </div>
 )}

 <div className="toolbar" style={{ marginTop: 12 }}>
 <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
 <Copy size={13} />{copied ? "Copied!" : "Copy"}
 </button>
 <button className="btn btn-secondary btn-sm" onClick={() =>window.print()}>
 <Printer size={13} />Print
 </button>
 <button className="btn btn-secondary btn-sm" onClick={() =>setRaw("")}>Clear</button>
 </div>

 <Link href={`/convert/centimeters-to-inches`} className="btn btn-secondary btn-sm" style={{ marginTop: 8, justifyContent: "center" }}>
 <ArrowRightLeft size={14} />Convert {cmRounded.toFixed(1)} cm back to inches
 </Link>
 </div>
 )}

 {parsed === null && raw.length >0 && (
 <div style={{ marginTop: 10, padding: 8, background: "hsl(0,30%,97%)", borderRadius: 6, fontSize: 12, color: "hsl(0,60%,45%)" }}>Please enter a valid measurement. Examples: 5/8, 1/4, 2.5, 36, or 1-3/4
 </div>
 )}
 </div>

 {/* ═══ REFERENCE TABLE ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }}
 onClick={() =>setShowRef(!showRef)}>
 <span><BookOpen size={14} style={{ marginRight: 6 }} />Inches to CM Conversion Chart for Sewing</span>
 <ChevronDown size={14} style={{ transform: showRef ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showRef && (
 <div style={{ marginTop: 10, overflowX: "auto" }}>
 <table style={tS}>
 <thead><tr>
 <th style={tH}>Inches</th><th style={{ ...tH, ...tR }}>Decimal</th>
 <th style={{ ...tH, ...tR }}>Exact CM</th><th style={{ ...tH, ...tR }}>MM</th>
 <th style={tH}>Sewing Use</th>
 </tr></thead>
 <tbody>
 {REF_TABLE.map((r, i) =>(
 <tr key={i} style={{ cursor: "pointer", background: Math.abs(r.dec - inches) < .001 ? "hsl(150,40%,95%)" : undefined }}
 onClick={() =>setVal(r.dec)}>
 <td style={{ ...tD, fontWeight: 600 }}>{r.frac}</td>
 <td style={{ ...tD, ...tR, fontFamily: "monospace" }}>{r.dec}</td>
 <td style={{ ...tD, ...tR }}>{r.cm.toFixed(2)}</td>
 <td style={{ ...tD, ...tR }}>{(r.cm * 10).toFixed(1)}</td>
 <td style={{ ...tD, fontSize: 10, color: "var(--color-text-tertiary)" }}>{r.use}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </div>

 {/* ═══ SEAM ALLOWANCE SECTION ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }}
 onClick={() =>setShowSeamSec(!showSeamSec)}>Seam Allowance Conversions Guide
 <ChevronDown size={14} style={{ transform: showSeamSec ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showSeamSec && (
 <div style={{ marginTop: 10, fontSize: 12.5, lineHeight: 1.9 }}>
 {[
 { sa: "¼\"", cm: "0.635", practical: "0.6 cm / 6 mm", note: "Standard quilting seam allowance. Metric quilters use 6 mm." },
 { sa: "⅜\"", cm: "0.953", practical: "1.0 cm", note: "French seams and lightweight/baby garments. Nearest metric: 1.0 cm." },
 { sa: "½\"", cm: "1.270", practical: "1.3 cm", note: "Common for knit garments and lingerie. Metric: 1.2–1.3 cm." },
 { sa: "⅝\"", cm: "1.588", practical: "1.5 cm", note: "THE standard US garment seam. European convention: 1.5 cm (not 1.6 cm). The 0.09 cm difference is <1 mm — negligible." },
 { sa: "1\"", cm: "2.540", practical: "2.5 cm", note: "Tailored/structured garments. Very clean metric conversion." },
 ].map((s, i) =>(
 <div key={i} style={{ padding: 8, background: i % 2 === 0 ? "hsl(150,15%,97%)" : "hsl(200,15%,97%)", borderRadius: 6, marginBottom: 4 }}>
 <strong>{s.sa} = {s.cm} cm (exact) → use {s.practical}</strong>
 <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{s.note}</div>
 </div>
 ))}
 </div>
 )}
 </div>

 {/* ═══ BODY MEASUREMENTS ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }}
 onClick={() =>setShowBodySec(!showBodySec)}>Body Measurement Conversions
 <ChevronDown size={14} style={{ transform: showBodySec ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showBodySec && (
 <div style={{ marginTop: 10, overflowX: "auto" }}>
 <table style={tS}>
 <thead><tr>
 <th style={tH}>Body Part</th><th style={tH}>Range</th>
 <th style={{ ...tH, ...tR }}>Example</th><th style={{ ...tH, ...tR }}>In CM</th>
 </tr></thead>
 <tbody>{BODY_TABLE.map((b, i) =>(
 <tr key={i} style={{ cursor: "pointer" }} onClick={() =>setVal(b.ex)}>
 <td style={{ ...tD, fontWeight: 600 }}>{b.part}</td>
 <td style={tD}>{b.range}</td>
 <td style={{ ...tD, ...tR }}>{b.ex}&quot;</td>
 <td style={{ ...tD, ...tR, fontWeight: 600 }}>{b.cm.toFixed(1)} cm</td>
 </tr>
 ))}</tbody>
 </table>
 <div style={{ marginTop: 6, fontSize: 11, color: "var(--color-text-tertiary)" }}>Precision matters for body measurements — round to the nearest 0.5 cm. Even 0.5 cm can affect garment fit.
 </div>
 </div>
 )}
 </div>

 {/* ═══ FABRIC WIDTHS ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }}
 onClick={() =>setShowFabricSec(!showFabricSec)}>Fabric Width Conversions
 <ChevronDown size={14} style={{ transform: showFabricSec ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showFabricSec && (
 <div style={{ marginTop: 10 }}>
 <h4 style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>US Fabric Widths in CM</h4>
 <table style={tS}>
 <thead><tr><th style={tH}>Inches</th><th style={{ ...tH, ...tR }}>CM</th><th style={tH}>Fabric Type</th></tr></thead>
 <tbody>{FABRIC_TABLE.map((f, i) =>(
 <tr key={i} style={{ cursor: "pointer" }} onClick={() =>setVal(f.in)}>
 <td style={{ ...tD, fontWeight: 600 }}>{f.in}&quot;</td>
 <td style={{ ...tD, ...tR }}>{f.cm} cm</td>
 <td style={{ ...tD, fontSize: 10 }}>{f.type}</td>
 </tr>
 ))}</tbody>
 </table>
 <h4 style={{ fontSize: 12, fontWeight: 700, margin: "12px 0 6px" }}>European Width Equivalents</h4>
 <table style={tS}>
 <thead><tr><th style={tH}>European</th><th style={{ ...tH, ...tR }}>CM</th><th style={tH}>US Equivalent</th></tr></thead>
 <tbody>{EUR_TABLE.map((e, i) =>(
 <tr key={i}><td style={{ ...tD, fontWeight: 600 }}>{e.eu}</td><td style={{ ...tD, ...tR }}>{e.actual}</td><td style={tD}>{e.us}</td></tr>
 ))}</tbody>
 </table>
 </div>
 )}
 </div>

 {/* ═══ FORMULA ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }}
 onClick={() =>setShowFormula(!showFormula)}>The Formula &amp; Mental Math Tricks
 <ChevronDown size={14} style={{ transform: showFormula ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showFormula && (
 <div style={{ marginTop: 10, fontSize: 12.5, lineHeight: 1.9, color: "var(--color-text-secondary)" }}>
 <div style={{ padding: 10, background: "hsl(150,15%,97%)", borderRadius: 6, fontFamily: "monospace", fontSize: 16, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>Centimeters = Inches × 2.54
 </div>
 <p>This is <strong>exact</strong>— not an approximation. One inch is defined as exactly 2.54 cm since 1959.</p>
 <div style={{ marginTop: 8 }}><strong>Example 1:</strong>⅝&quot; seam → 5÷8 = 0.625 → 0.625 × 2.54 = 1.5875 cm → use 1.5 or 1.6 cm</div>
 <div><strong>Example 2:</strong>32&quot; waist → 32 × 2.54 = 81.28 cm → round to 81.5 cm</div>
 <div><strong>Example 3:</strong>44&quot; fabric → 44 × 2.54 = 111.76 cm ≈ 112 cm</div>
 <div style={{ marginTop: 8, padding: 8, background: "hsl(45,30%,96%)", borderRadius: 6 }}>
 <strong>Mental math trick:</strong>Multiply by 2.5 instead of 2.54. Error is only 0.04 per inch. Example: ⅝&quot; ≈ 0.625 × 2.5 = 1.5625 cm (actual: 1.5875 — close enough!)
 </div>
 </div>
 )}
 </div>

 {/* ═══ ROUNDING GUIDE ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }}
 onClick={() =>setShowRoundGuide(!showRoundGuide)}>Practical Rounding Guide for Sewists
 <ChevronDown size={14} style={{ transform: showRoundGuide ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showRoundGuide && (
 <div style={{ marginTop: 10, overflowX: "auto" }}>
 <table style={tS}>
 <thead><tr><th style={tH}>Measurement Type</th><th style={tH}>Round To</th><th style={tH}>Example</th></tr></thead>
 <tbody>
 {[
 ["Machine seam guides", "Nearest mm", "1.5875 → 1.6 cm"],
 ["Hem allowances", "Nearest 0.5 cm", "1.27 → 1.5 cm"],
 ["Body measurements", "Nearest 0.5 cm", "81.28 → 81.5 cm"],
 ["Fabric widths", "Nearest cm", "111.76 → 112 cm"],
 ["Quilt block sizes", "Nearest mm", "Precision needed"],
 ].map(([type, round, ex], i) =>(
 <tr key={i}><td style={tD}>{type}</td><td style={{ ...tD, fontWeight: 600 }}>{round}</td><td style={tD}>{ex}</td></tr>
 ))}
 </tbody>
 </table>
 <div style={{ marginTop: 6, fontSize: 11, fontStyle: "italic", color: "var(--color-text-tertiary)" }}>Tip: For seam allowances, round DOWN (not up) — slightly less SA is easier to manage than slightly more.
 </div>
 </div>
 )}
 </div>

 {/* ═══ FAQ ═══ */}
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
 <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Key Conversions</h4>
 <div style={{ fontSize: 12, lineHeight: 2.2 }}>
 {[
 ["1 inch", "2.54 cm"], ["⅝ inch", "1.59 cm"], ["½ inch", "1.27 cm"],
 ["¼ inch", "0.64 cm"], ["12 inches", "30.48 cm"], ["36 inches", "91.44 cm"],
 ].map(([a, b], i) =>(
 <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
 <span>{a}</span><strong>{b}</strong>
 </div>
 ))}
 </div>
 </div>
 <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
 <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Formula</h4>
 <div style={{ fontSize: 13, fontFamily: "monospace", textAlign: "center", padding: 8, background: "hsl(150,15%,97%)", borderRadius: 6 }}>
 cm = inches × 2.54
 </div>
 </div>
 <div className="glass-card related-tools">
 <h4>Related Tools</h4>
 <Link href="/convert/centimeters-to-inches" className="related-tool-link"><ArrowRightLeft size={14} />CM → Inches</Link>
 <Link href="/convert/millimeters-to-inches" className="related-tool-link">MM → Inches</Link>
 <Link href="/convert/yards-to-meters" className="related-tool-link">Yards → Meters</Link>
 <Link href="/convert/fraction-to-decimal" className="related-tool-link">Fraction → Decimal</Link>
 <Link href="/convert" className="related-tool-link">All Converters</Link>
 </div>
 </aside>
 </div>
 </div>
 );
}
