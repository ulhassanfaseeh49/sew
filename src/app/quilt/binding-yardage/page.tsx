"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, ChevronDown, Info, AlertTriangle, Scissors } from "lucide-react";

/* ─── constants ────────────────────────────────────── */
type Mode = "A" | "B" | "C";
type Direction = "wof" | "lof" | "bias";
type PreCut = "none" | "fat-quarter" | "fat-eighth" | "half-yard" | "quarter-yard" | "jelly";

const STRIP_WIDTHS = [
 { value: 2, label: '2"' }, { value: 2.25, label: '2¼"' },
 { value: 2.5, label: '2½"' }, { value: 2.75, label: '2¾"' },
 { value: 3, label: '3"' }, { value: 3.5, label: '3½"' },
];
const FABRIC_WIDTHS = [
 { value: 36, label: '36"' }, { value: 42, label: '42"' },
 { value: 44, label: '44"' }, { value: 45, label: '45"' }, { value: 60, label: '60"' },
];
const SELVAGE_OPTIONS = [
 { key: "minimal", label: "Minimal (¼\" each)", total: 0.5 },
 { key: "standard", label: "Standard (¾\" each)", total: 1.5 },
 { key: "generous", label: "Generous (1\" each)", total: 2 },
];
const SHRINK_PRESETS = [
 { key: "cotton", label: "Cotton (3%)", pct: 3 },
 { key: "linen", label: "Linen (5%)", pct: 5 },
 { key: "flannel", label: "Flannel (7%)", pct: 7 },
];
const PRECUT_DIMS: Record<string, { w: number; h: number; label: string }>= {
 "fat-quarter": { w: 18, h: 22, label: "Fat Quarter" },
 "fat-eighth": { w: 9, h: 22, label: "Fat Eighth" },
 "half-yard": { w: 18, h: 44, label: "Half Yard" },
 "quarter-yard": { w: 9, h: 44, label: "Quarter Yard" },
};
const QUICK_REF = [
 { name: "Baby / Crib", w: 36, h: 52 },
 { name: "Throw", w: 54, h: 72 },
 { name: "Twin", w: 60, h: 80 },
 { name: "Full / Double", w: 72, h: 90 },
 { name: "Queen", w: 84, h: 92 },
 { name: "King", w: 100, h: 108 },
 { name: "Cal King", w: 104, h: 108 },
];
const PURCHASE_INCREMENTS = [
 { key: "eighth", label: "⅛ yard", val: 0.125 },
 { key: "quarter", label: "¼ yard", val: 0.25 },
 { key: "inch", label: "1 inch", val: 1 / 36 },
];

function toFrac(v: number): string {
 const w = Math.floor(v); const f = v - w;
 const fracs: [number, string][] = [[0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
 for (const [d, sym] of fracs) { if (Math.abs(f - d) < 0.02) return w >0 ? `${w}${sym}` : sym; }
 if (f >0.01) return v.toFixed(2);
 return String(w);
}
function roundUp(val: number, incr: number) { return Math.ceil(val / incr) * incr; }

/* ─── component ──────────────────────────────────── */
export default function Page() {
 /* Mode */
 const [mode, setMode] = useState<Mode>("A");
 /* Strip dimensions */
 const [stripW, setStripW] = useState("2.5");
 const [direction, setDirection] = useState<Direction>("wof");
 /* Fabric */
 const [fabricW, setFabricW] = useState("44");
 const [selvage, setSelvage] = useState("standard");
 const [customSelv, setCustomSelv] = useState("");
 const [preWash, setPreWash] = useState(false);
 const [shrinkType, setShrinkType] = useState("cotton");
 const [customShrink, setCustomShrink] = useState("");
 /* Mode A */
 const [bindingLen, setBindingLen] = useState("416");
 /* Mode B */
 const [yardageOnHand, setYardageOnHand] = useState("1");
 const [preCut, setPreCut] = useState<PreCut>("none");
 const [jellyCount, setJellyCount] = useState("6");
 /* Mode C */
 const [stripCount, setStripCount] = useState("10");
 /* Purchase */
 const [purchaseIncr, setPurchaseIncr] = useState("quarter");
 const [buffer, setBuffer] = useState("0.25");
 /* UI */
 const [showRef, setShowRef] = useState(true);
 const [showEdu, setShowEdu] = useState(false);
 const [showWidthComp, setShowWidthComp] = useState(false);
 const [activeFaq, setActiveFaq] = useState<number | null>(null);

 /* derived */
 const sw = parseFloat(stripW) || 2.5;
 const fw = parseFloat(fabricW) || 44;
 const selvTotal = selvage === "custom" ? (parseFloat(customSelv) || 0) * 2 : SELVAGE_OPTIONS.find(s =>s.key === selvage)?.total ?? 1.5;
 const shrinkPct = preWash ? (shrinkType === "custom" ? (parseFloat(customShrink) || 0) : SHRINK_PRESETS.find(s =>s.key === shrinkType)?.pct ?? 3) : 0;
 const shrinkFactor = 1 - shrinkPct / 100;
 const usableW = (fw * shrinkFactor) - selvTotal;
 const incr = PURCHASE_INCREMENTS.find(p =>p.key === purchaseIncr)?.val ?? 0.25;
 const bufferYd = parseFloat(buffer) || 0;

 /* ═══ MODE A: Binding Length → Yardage ═══ */
 const modeAResult = useMemo(() =>{
 if (mode !== "A") return null;
 const totalLen = parseFloat(bindingLen) || 0;
 if (totalLen <= 0 || usableW <= 0 || sw <= 0) return null;

 if (direction === "lof") {
 // LOF: need fabric length ≥ totalLen, strips cut along length
 const ydNeeded = totalLen / 36;
 const buyYd = roundUp(ydNeeded + bufferYd, incr);
 return { totalLen, stripsRaw: 1, stripsNeeded: 1, fabricInches: totalLen, fabricYd: ydNeeded, buyYd, isLof: true, totalBinding: totalLen, surplus: 0 };
 }

 const stripsRaw = totalLen / usableW;
 const stripsNeeded = Math.ceil(stripsRaw);
 const fabricInches = stripsNeeded * sw * (1 / shrinkFactor);
 const fabricYd = fabricInches / 36;
 const buyYdRaw = roundUp(fabricYd, incr);
 const buyYd = roundUp(buyYdRaw + bufferYd, incr);
 const totalBinding = stripsNeeded * usableW;
 const surplus = totalBinding - totalLen;
 return { totalLen, stripsRaw, stripsNeeded, fabricInches, fabricYd, buyYd, isLof: false, totalBinding, surplus };
 }, [mode, bindingLen, usableW, sw, direction, shrinkFactor, incr, bufferYd]);

 /* ═══ MODE B: Yardage → Strips ═══ */
 const modeBResult = useMemo(() =>{
 if (mode !== "B") return null;

 if (preCut === "jelly") {
 const jc = parseInt(jellyCount) || 0;
 if (jc <= 0) return null;
 const stripLen = 42; // standard jelly roll
 const joins = jc - 1;
 const joinLoss = joins * 2;
 const totalBinding = (jc * stripLen) - joinLoss;
 return { strips: jc, stripLen, totalBinding, joinLoss, isJelly: true, isPreCut: false, fabricDesc: `${jc} jelly roll strips`, leftover: 0 };
 }

 if (preCut !== "none") {
 const dims = PRECUT_DIMS[preCut];
 if (!dims) return null;
 // cut along shorter dimension → more strips, longer each
 const opt1Strips = Math.floor(dims.w / sw);
 const opt1Len = dims.h - selvTotal;
 const opt1Total = opt1Strips * opt1Len;
 // cut along longer dimension
 const opt2Strips = Math.floor(dims.h / sw);
 const opt2Len = dims.w;
 const opt2Total = opt2Strips * opt2Len;
 const best = opt1Total >= opt2Total ? { strips: opt1Strips, len: opt1Len, total: opt1Total, dir: "width" } : { strips: opt2Strips, len: opt2Len, total: opt2Total, dir: "length" };
 return { strips: best.strips, stripLen: best.len, totalBinding: best.total, joinLoss: 0, isJelly: false, isPreCut: true, fabricDesc: dims.label + ` (${dims.w}" × ${dims.h}")`, leftover: 0, precutName: dims.label, opt1: { strips: opt1Strips, len: opt1Len, total: opt1Total }, opt2: { strips: opt2Strips, len: opt2Len, total: opt2Total } };
 }

 const yardage = parseFloat(yardageOnHand) || 0;
 if (yardage <= 0 || sw <= 0) return null;
 const lengthInches = yardage * 36 * shrinkFactor;
 const strips = Math.floor(lengthInches / sw);
 const totalBinding = strips * usableW;
 const usedLength = strips * sw;
 const leftoverInches = lengthInches - usedLength;
 return { strips, stripLen: usableW, totalBinding, joinLoss: 0, isJelly: false, isPreCut: false, fabricDesc: `${toFrac(yardage)} yard × ${fw}" wide`, leftover: leftoverInches };
 }, [mode, yardageOnHand, preCut, jellyCount, sw, usableW, fw, selvTotal, shrinkFactor]);

 /* ═══ MODE C: Strip Count → Yardage ═══ */
 const modeCResult = useMemo(() =>{
 if (mode !== "C") return null;
 const sc = parseInt(stripCount) || 0;
 if (sc <= 0 || sw <= 0) return null;
 const fabricInches = sc * sw * (1 / shrinkFactor);
 const fabricYd = fabricInches / 36;
 const buyYdRaw = roundUp(fabricYd, incr);
 const buyYd = roundUp(buyYdRaw + bufferYd, incr);
 const totalBinding = sc * usableW;
 return { strips: sc, fabricInches, fabricYd, buyYd, totalBinding };
 }, [mode, stripCount, sw, usableW, shrinkFactor, incr, bufferYd]);

 /* quick ref table */
 const quickRef = QUICK_REF.map(q =>{
 const perim = (q.w + q.h) * 2;
 const totalLen = perim + 14 + 20 + 12; // corners(14) + join(20) + safety(12)
 const stripsNeeded = Math.ceil(totalLen / 42);
 const fabInches = stripsNeeded * 2.5;
 const fabYd = roundUp(fabInches / 36 + 0.25, 0.25);
 return { ...q, perim, totalLen, stripsNeeded, fabYd };
 });

 /* width comparison */
 const widthComp = FABRIC_WIDTHS.map(f =>{
 const uW = f.value - 1.5;
 const totalLen = parseFloat(bindingLen) || 416;
 const strips = Math.ceil(totalLen / uW);
 const fabIn = strips * sw;
 const fabYd = fabIn / 36;
 const buy = roundUp(fabYd + 0.25, 0.25);
 return { width: f.value, usable: uW, strips, fabYd: fabYd.toFixed(2), buy: toFrac(buy) };
 });

 /* copy text */
 const copyText = modeAResult && !modeAResult.isLof
 ? `Binding fabric: Buy ${toFrac(modeAResult.buyYd)} yards of ${fw}" fabric. Cut ${modeAResult.stripsNeeded} strips at ${toFrac(sw)}" wide. Total binding: ~${Math.round(modeAResult.totalBinding)}".`
 : modeCResult
 ? `Binding fabric: Buy ${toFrac(modeCResult.buyYd)} yards. ${modeCResult.strips} strips at ${toFrac(sw)}" wide.`
 : "";

 /* FAQ */
 const faqItems = [
 { q: "How many yards of fabric do I need for quilt binding?", a: "For a queen quilt (84×92\"), you need about 1 yard of 44\"-wide fabric to cut 10 strips at 2½\" wide. This provides ~425\" of binding. Smaller quilts need ½–¾ yard; king quilts need about 1–1¼ yards." },
 { q: "How do I convert binding strips to yardage?", a: "Count how many strips you need, multiply by your cut strip width to get total fabric length in inches, then divide by 36 to convert to yards. Example: 10 strips × 2.5\" = 25\" ÷ 36 = 0.69 yards → round up to ¾ yard." },
 { q: "How many binding strips can I cut from one yard of fabric?", a: "One yard (36\") of 44\"-wide fabric gives: 36\" ÷ 2.5\" = 14 strips at 2½\" wide. Each strip is ~42\" long (after removing selvages). Total binding: 14 × 42\" = 588\" — enough for a king quilt with plenty to spare." },
 { q: "Can I use a fat quarter for quilt binding?", a: "Yes, but a fat quarter (18×22\") only yields about 147\" of binding — enough for a small project like a wall hanging or table runner, but NOT enough for a bed quilt. A throw quilt needs ~300\" of binding, requiring at least 2 fat quarters." },
 { q: "How do I calculate scrappy binding yardage?", a: "Divide your total binding length by the number of fabrics. Calculate yardage for each fabric separately — each typically needs ¼ yard. For 4 fabrics binding a queen quilt: 4 × ¼ yard = 1 yard total across 4 fabrics." },
 { q: "How much binding can I cut from half a yard of fabric?", a: "Half a yard (18\") of 44\"-wide fabric gives: 18\" ÷ 2.5\" = 7 strips. Each ~42\" long. Total: 7 × 42\" = 294\" of binding — enough for a throw quilt." },
 { q: "What is the difference between strip length and yardage?", a: "Strip length is the total combined length of all your joined binding strips (measured in inches). Yardage is the amount of fabric you need to BUY (measured in yards) to cut enough strips. They are perpendicular measurements." },
 { q: "How does fabric width affect binding yardage?", a: "Wider fabric means each strip is longer, so you need fewer strips, which means less fabric length (yardage). 60\" fabric needs ~20% less yardage than 44\" fabric for the same binding length." },
 { q: "Can I use jelly roll strips for binding?", a: "Yes! Jelly roll strips are pre-cut at 2½\" × ~42\" — perfect for standard double-fold binding. Count how many strips you need, subtract ~2\" per join for diagonal seam losses. 10 jelly roll strips give about 400\" of binding." },
 { q: "How do I calculate binding for multiple quilts?", a: "Calculate the total binding length for each quilt, add them together, then calculate yardage for the combined total. Buying in bulk is often more efficient — fewer leftover scraps than buying separately for each quilt." },
 ];

 return (
 <div className="container">
 <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "Binding Yardage Calculator" }]} />
 <div className="calculator-layout">
 <div className="calculator-main">
 {/* HEADER */}
 <div className={styles.toolHeader}>
 <span className="category-badge"><Scissors size={14} strokeWidth={1.5} />Quilt #141</span>
 <h1>Binding Yardage Calculator</h1>
 <p>Calculate how much fabric to buy for quilt binding — from binding length, available yardage, or strip count. Includes store rounding, shrinkage, and pre-cut support.</p>
 </div>

 {/* ① MODE SELECTOR */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>① Calculation Mode</h2>
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
 {([
 { key: "A" as Mode, title: "Length → Yardage", desc: "I know my binding length" },
 { key: "B" as Mode, title: "Yardage → Strips", desc: "I have fabric on hand" },
 { key: "C" as Mode, title: "Strips → Yardage", desc: "I know how many strips" },
 ]).map(m =>(
 <button key={m.key} className={`btn ${mode === m.key ? "btn-primary" : "btn-secondary"}`}
 style={{ textAlign: "left", padding: "10px 12px" }} onClick={() =>setMode(m.key)}>
 <strong style={{ fontSize: 13 }}>{m.title}</strong>
 <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>{m.desc}</div>
 </button>
 ))}
 </div>
 </div>

 {/* ② STRIP DIMENSIONS */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>② Strip Width &amp; Direction</h2>
 <div style={{ marginBottom: 10 }}>
 <label className="input-label">Cut strip width</label>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 4 }}>
 {STRIP_WIDTHS.map(s =>(
 <button key={s.value} className={`btn btn-sm ${parseFloat(stripW) === s.value ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setStripW(String(s.value))}>{s.label}</button>
 ))}
 </div>
 <div className="input-group" style={{ maxWidth: 200 }}>
 <input type="number" className="input-field" value={stripW} onChange={e =>setStripW(e.target.value)} min={0.5} max={8} step={0.125} />
 </div>
 <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 4 }}><Info size={11} style={{ display: "inline", marginRight: 3 }} />Not sure? Use the <a href="/quilt/binding-strip-width" style={{ color: "var(--color-accent-primary)" }}>Binding Strip Width Calculator</a></div>
 </div>
 {mode !== "B" && (
 <div>
 <label className="input-label">Strip direction</label>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
 <button className={`btn btn-sm ${direction === "wof" ? "btn-primary" : "btn-secondary"}`} onClick={() =>setDirection("wof")}>Cross-Grain (WOF)</button>
 <button className={`btn btn-sm ${direction === "lof" ? "btn-primary" : "btn-secondary"}`} onClick={() =>setDirection("lof")}>Length-of-Grain (LOF)</button>
 <button className={`btn btn-sm ${direction === "bias" ? "btn-primary" : "btn-secondary"}`} onClick={() =>setDirection("bias")} title="Use Continuous Bias Calculator for bias">Bias</button>
 </div>
 {direction === "lof" && <div style={{ fontSize: 12, color: "hsl(35,80%,45%)", marginTop: 6 }}><AlertTriangle size={12} style={{ display: "inline", marginRight: 4 }} />LOF binding requires significantly more fabric — strips run the full fabric length.</div>}
 {direction === "bias" && <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 6 }}><Info size={12} style={{ display: "inline", marginRight: 4 }} />For bias binding, use the <a href="/quilt/continuous-bias-strip" style={{ color: "var(--color-accent-primary)" }}>Continuous Bias Strip Calculator</a>for precise calculations.</div>}
 </div>
 )}
 </div>

 {/* ③ FABRIC INFO */}
 {!(mode === "B" && preCut !== "none") && (
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>③ Fabric Details</h2>
 <div style={{ marginBottom: 10 }}>
 <label className="input-label">Fabric bolt width</label>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 4 }}>
 {FABRIC_WIDTHS.map(f =>(
 <button key={f.value} className={`btn btn-sm ${parseFloat(fabricW) === f.value ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setFabricW(String(f.value))}>{f.label}</button>
 ))}
 </div>
 <div className="input-group" style={{ maxWidth: 200 }}>
 <input type="number" className="input-field" value={fabricW} onChange={e =>setFabricW(e.target.value)} min={20} max={120} />
 </div>
 </div>
 <div style={{ marginBottom: 10 }}>
 <label className="input-label">Selvage allowance</label>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
 {SELVAGE_OPTIONS.map(s =>(
 <button key={s.key} className={`btn btn-sm ${selvage === s.key ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setSelvage(s.key)}>{s.label}</button>
 ))}
 <button className={`btn btn-sm ${selvage === "custom" ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setSelvage("custom")}>Custom</button>
 </div>
 {selvage === "custom" && <div className="input-group" style={{ maxWidth: 200, marginTop: 6 }}><input type="number" className="input-field" value={customSelv} onChange={e =>setCustomSelv(e.target.value)} min={0} max={3} step={0.125} placeholder="Per side (inches)" /></div>}
 <div style={{ fontSize: 12, color: "var(--color-accent-primary)", marginTop: 6, fontWeight: 500 }}>Usable width: {usableW.toFixed(1)}&quot;</div>
 </div>
 <div>
 <label className="input-label" style={{ display: "flex", alignItems: "center", gap: 8 }}>
 <input type="checkbox" checked={preWash} onChange={e =>setPreWash(e.target.checked)} style={{ accentColor: "var(--color-accent-primary)" }} />Pre-wash shrinkage
 </label>
 {preWash && (
 <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
 {SHRINK_PRESETS.map(s =>(
 <button key={s.key} className={`btn btn-sm ${shrinkType === s.key ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setShrinkType(s.key)}>{s.label}</button>
 ))}
 <button className={`btn btn-sm ${shrinkType === "custom" ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setShrinkType("custom")}>Custom</button>
 {shrinkType === "custom" && <div className="input-group" style={{ maxWidth: 150 }}><input type="number" className="input-field" value={customShrink} onChange={e =>setCustomShrink(e.target.value)} min={0} max={20} step={0.5} placeholder="%" /></div>}
 </div>
 )}
 </div>
 </div>
 )}

 {/* ④ MODE-SPECIFIC INPUT */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 {mode === "A" && (<>
 <h2 className={styles.calcTitle}>④ Total Binding Length Needed</h2>
 <div className="input-group" style={{ maxWidth: 300 }}>
 <label className="input-label">Binding length (inches)</label>
 <input type="number" className="input-field" value={bindingLen} onChange={e =>setBindingLen(e.target.value)} min={1} />
 <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>From <a href="/quilt/binding-strip-length" style={{ color: "var(--color-accent-primary)" }}>Binding Strip Length Calculator</a></span>
 </div>
 </>)}
 {mode === "B" && (<>
 <h2 className={styles.calcTitle}>④ Fabric on Hand</h2>
 <div style={{ marginBottom: 10 }}>
 <label className="input-label">Fabric type</label>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
 <button className={`btn btn-sm ${preCut === "none" ? "btn-primary" : "btn-secondary"}`} onClick={() =>setPreCut("none")}>Yardage</button>
 <button className={`btn btn-sm ${preCut === "fat-quarter" ? "btn-primary" : "btn-secondary"}`} onClick={() =>setPreCut("fat-quarter")}>Fat Quarter</button>
 <button className={`btn btn-sm ${preCut === "fat-eighth" ? "btn-primary" : "btn-secondary"}`} onClick={() =>setPreCut("fat-eighth")}>Fat Eighth</button>
 <button className={`btn btn-sm ${preCut === "half-yard" ? "btn-primary" : "btn-secondary"}`} onClick={() =>setPreCut("half-yard")}>Half Yard</button>
 <button className={`btn btn-sm ${preCut === "quarter-yard" ? "btn-primary" : "btn-secondary"}`} onClick={() =>setPreCut("quarter-yard")}>Quarter Yard</button>
 <button className={`btn btn-sm ${preCut === "jelly" ? "btn-primary" : "btn-secondary"}`} onClick={() =>setPreCut("jelly")}>Jelly Roll</button>
 </div>
 </div>
 {preCut === "none" && (
 <div className="input-group" style={{ maxWidth: 250 }}>
 <label className="input-label">Yardage available</label>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
 {[0.25, 0.5, 0.75, 1, 1.25, 1.5].map(y =>(
 <button key={y} className={`btn btn-sm ${parseFloat(yardageOnHand) === y ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setYardageOnHand(String(y))}>{toFrac(y)} yd</button>
 ))}
 </div>
 <input type="number" className="input-field" value={yardageOnHand} onChange={e =>setYardageOnHand(e.target.value)} min={0.1} step={0.125} />
 </div>
 )}
 {preCut === "jelly" && (
 <div className="input-group" style={{ maxWidth: 250 }}>
 <label className="input-label">Number of jelly roll strips</label>
 <input type="number" className="input-field" value={jellyCount} onChange={e =>setJellyCount(e.target.value)} min={1} max={42} />
 <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>Pre-cut at 2½" × ~42"</span>
 </div>
 )}
 {preCut !== "none" && preCut !== "jelly" && (
 <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 6 }}>
 <Info size={12} style={{ display: "inline", marginRight: 4 }} />
 {PRECUT_DIMS[preCut]?.label}: {PRECUT_DIMS[preCut]?.w}&quot; × {PRECUT_DIMS[preCut]?.h}&quot;
 </div>
 )}
 </>)}
 {mode === "C" && (<>
 <h2 className={styles.calcTitle}>④ Number of Strips</h2>
 <div className="input-group" style={{ maxWidth: 250 }}>
 <label className="input-label">Strips to cut</label>
 <input type="number" className="input-field" value={stripCount} onChange={e =>setStripCount(e.target.value)} min={1} max={100} />
 </div>
 </>)}
 </div>

 {/* ⑤ PURCHASE SETTINGS (Mode A & C) */}
 {(mode === "A" || mode === "C") && (
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>⑤ Purchase Settings</h2>
 <div className="calculator-form-row">
 <div className="input-group">
 <label className="input-label">Store cut increment</label>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
 {PURCHASE_INCREMENTS.map(p =>(
 <button key={p.key} className={`btn btn-sm ${purchaseIncr === p.key ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setPurchaseIncr(p.key)}>{p.label}</button>
 ))}
 </div>
 </div>
 <div className="input-group">
 <label className="input-label">Safety buffer</label>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
 {[{ val: "0", label: "None" }, { val: "0.25", label: "+¼ yd" }, { val: "0.5", label: "+½ yd" }].map(b =>(
 <button key={b.val} className={`btn btn-sm ${buffer === b.val ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setBuffer(b.val)}>{b.label}</button>
 ))}
 </div>
 </div>
 </div>
 </div>
 )}

 {/* ═══ RESULTS ═══ */}
 {/* MODE A RESULTS */}
 {modeAResult && (<>
 <div className={`calculator-results ${styles.results}`}>
 <div className="result-card">
 <div className="result-value">Buy {toFrac(modeAResult.buyYd)} yard{modeAResult.buyYd !== 1 ? "s" : ""} of binding fabric</div>
 <div className="result-label">
 {modeAResult.isLof
 ? `LOF: ${Math.round(modeAResult.totalLen)}" continuous length needed`
 : `${modeAResult.stripsNeeded} strips × ${toFrac(sw)}" wide from ${fw}" fabric`
 }
 </div>
 </div>
 {!modeAResult.isLof && (
 <div className={styles.resultDetails}>
 <div className={styles.resultRow}><span>Total binding length needed</span><strong>{Math.round(modeAResult.totalLen)}&quot;</strong></div>
 <div className={styles.resultRow}><span>Usable fabric width</span><strong>{usableW.toFixed(1)}&quot;</strong></div>
 <div className={styles.resultRow}><span>Strips needed</span><strong>{modeAResult.stripsRaw.toFixed(2)} → {modeAResult.stripsNeeded} strips</strong></div>
 <div className={styles.resultRow}><span>Fabric length ({modeAResult.stripsNeeded} × {toFrac(sw)}&quot;)</span><strong>{Math.round(modeAResult.fabricInches)}&quot; = {modeAResult.fabricYd.toFixed(2)} yd</strong></div>
 <div className={styles.resultRow}><span>Rounded to {PURCHASE_INCREMENTS.find(p =>p.key === purchaseIncr)?.label} + {toFrac(bufferYd)} yd buffer</span><strong>{toFrac(modeAResult.buyYd)} yd</strong></div>
 <div className={styles.resultRow} style={{ borderTop: "2px solid var(--color-border)", paddingTop: 8, marginTop: 4 }}>
 <span>Total binding produced ({modeAResult.stripsNeeded} × {usableW.toFixed(1)}&quot;)</span>
 <strong>{Math.round(modeAResult.totalBinding)}&quot; ({modeAResult.surplus >0 ? `+${Math.round(modeAResult.surplus)}" extra ✓` : "exact"})</strong>
 </div>
 </div>
 )}
 {modeAResult.isLof && (
 <div style={{ background: "hsl(35,90%,95%)", borderRadius: "var(--radius-md)", padding: 14, marginTop: 10, fontSize: 13 }}>
 <strong><AlertTriangle size={14} style={{ display: "inline", marginRight: 4 }} />LOF binding requires {toFrac(modeAResult.buyYd)} yards of fabric.</strong>
 <div style={{ marginTop: 6, lineHeight: 1.8 }}>LOF strips run the full length of the fabric. For {Math.round(modeAResult.totalLen)}&quot; of binding, you need a single piece {Math.round(modeAResult.totalLen)}&quot; long.
 <br />WOF binding is strongly recommended for most quilts — it uses far less fabric.
 </div>
 </div>
 )}
 {/* Leftover fabric */}
 {!modeAResult.isLof && (
 <div style={{ background: "var(--color-bg-secondary)", borderRadius: "var(--radius-md)", padding: 14, marginTop: 10, fontSize: 13, lineHeight: 1.8 }}>
 <strong>Leftover Fabric:</strong>
 <div style={{ fontFamily: "var(--font-mono, monospace)", marginTop: 4 }}>
 <div>You buy: {toFrac(modeAResult.buyYd)} yd ({Math.round(modeAResult.buyYd * 36)}&quot;) × {fw}&quot; wide</div>
 <div>Strips use: {modeAResult.stripsNeeded} × {toFrac(sw)}&quot; = {Math.round(modeAResult.stripsNeeded * sw)}&quot;</div>
 <div>Remaining: {Math.round(modeAResult.buyYd * 36 - modeAResult.stripsNeeded * sw)}&quot; × {fw}&quot; ({((modeAResult.buyYd * 36 - modeAResult.stripsNeeded * sw) / 36).toFixed(2)} yd)</div>
 </div>
 </div>
 )}
 </div>
 <div className="toolbar" style={{ marginBottom: 16 }}>
 <button className="btn btn-secondary btn-sm" onClick={() =>navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} />Copy</button>
 <button className="btn btn-secondary btn-sm" onClick={() =>window.print()}><Printer size={13} />Print</button>
 </div>
 </>)}

 {/* MODE B RESULTS */}
 {modeBResult && (<>
 <div className={`calculator-results ${styles.results}`}>
 <div className="result-card">
 <div className="result-value">
 {modeBResult.isJelly
 ? `${Math.round(modeBResult.totalBinding)}" of binding`
 : `${modeBResult.strips} strips → ${Math.round(modeBResult.totalBinding)}" of binding`
 }
 </div>
 <div className="result-label">From {modeBResult.fabricDesc}</div>
 </div>
 <div className={styles.resultDetails}>
 <div className={styles.resultRow}><span>Strips available</span><strong>{modeBResult.strips}</strong></div>
 <div className={styles.resultRow}><span>Strip length</span><strong>{modeBResult.stripLen.toFixed(1)}&quot;</strong></div>
 {modeBResult.isJelly && <div className={styles.resultRow}><span>Join losses ({modeBResult.strips - 1} joins × 2&quot;)</span><strong>-{modeBResult.joinLoss}&quot;</strong></div>}
 <div className={styles.resultRow} style={{ borderTop: "2px solid var(--color-border)", paddingTop: 8 }}>
 <span style={{ fontWeight: 600 }}>Total binding length</span>
 <strong>{Math.round(modeBResult.totalBinding)}&quot; ({(modeBResult.totalBinding / 36).toFixed(1)} ft)</strong>
 </div>
 {!modeBResult.isJelly && !modeBResult.isPreCut && modeBResult.leftover >0 && (
 <div className={styles.resultRow}><span>Leftover fabric</span><strong>{modeBResult.leftover.toFixed(1)}&quot; × {fw}&quot;</strong></div>
 )}
 </div>
 {/* Pre-cut both-direction comparison */}
 {modeBResult.isPreCut && 'opt1' in modeBResult && (
 <div style={{ background: "var(--color-bg-secondary)", borderRadius: "var(--radius-md)", padding: 14, marginTop: 10, fontSize: 13, lineHeight: 1.8 }}>
 <strong>Cutting Direction Comparison:</strong>
 <div style={{ fontFamily: "var(--font-mono, monospace)", marginTop: 4 }}>
 <div>Option A: {(modeBResult as Record<string, unknown>& { opt1: { strips: number; len: number; total: number } }).opt1.strips} strips × {(modeBResult as Record<string, unknown>& { opt1: { strips: number; len: number; total: number } }).opt1.len.toFixed(1)}&quot; = {(modeBResult as Record<string, unknown>& { opt1: { strips: number; len: number; total: number } }).opt1.total}&quot;</div>
 <div>Option B: {(modeBResult as Record<string, unknown>& { opt2: { strips: number; len: number; total: number } }).opt2.strips} strips × {(modeBResult as Record<string, unknown>& { opt2: { strips: number; len: number; total: number } }).opt2.len.toFixed(1)}&quot; = {(modeBResult as Record<string, unknown>& { opt2: { strips: number; len: number; total: number } }).opt2.total}&quot;</div>
 </div>
 </div>
 )}
 </div>
 <div className="toolbar" style={{ marginBottom: 16 }}>
 <button className="btn btn-secondary btn-sm" onClick={() =>navigator.clipboard.writeText(`From ${modeBResult.fabricDesc}: ${modeBResult.strips} strips, ${Math.round(modeBResult.totalBinding)}" total binding.`)}><ClipboardCopy size={13} />Copy</button>
 <button className="btn btn-secondary btn-sm" onClick={() =>window.print()}><Printer size={13} />Print</button>
 </div>
 </>)}

 {/* MODE C RESULTS */}
 {modeCResult && (<>
 <div className={`calculator-results ${styles.results}`}>
 <div className="result-card">
 <div className="result-value">Buy {toFrac(modeCResult.buyYd)} yard{modeCResult.buyYd !== 1 ? "s" : ""}</div>
 <div className="result-label">{modeCResult.strips} strips × {toFrac(sw)}&quot; = {Math.round(modeCResult.fabricInches)}&quot; of fabric</div>
 </div>
 <div className={styles.resultDetails}>
 <div className={styles.resultRow}><span>Strip count</span><strong>{modeCResult.strips}</strong></div>
 <div className={styles.resultRow}><span>Cut strip width</span><strong>{toFrac(sw)}&quot;</strong></div>
 <div className={styles.resultRow}><span>Fabric length needed</span><strong>{Math.round(modeCResult.fabricInches)}&quot; = {modeCResult.fabricYd.toFixed(2)} yd</strong></div>
 <div className={styles.resultRow}><span>Rounded + buffer</span><strong>{toFrac(modeCResult.buyYd)} yd</strong></div>
 <div className={styles.resultRow} style={{ borderTop: "2px solid var(--color-border)", paddingTop: 8 }}>
 <span>Total binding produced</span><strong>{Math.round(modeCResult.totalBinding)}&quot;</strong>
 </div>
 </div>
 </div>
 <div className="toolbar" style={{ marginBottom: 16 }}>
 <button className="btn btn-secondary btn-sm" onClick={() =>navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} />Copy</button>
 <button className="btn btn-secondary btn-sm" onClick={() =>window.print()}><Printer size={13} />Print</button>
 </div>
 </>)}

 {/* FABRIC WIDTH COMPARISON */}
 {mode === "A" && (
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
 onClick={() =>setShowWidthComp(!showWidthComp)}>How Fabric Width Affects Your Purchase <ChevronDown size={14} style={{ transform: showWidthComp ? "rotate(180deg)" : "none", transition: "0.2s" }} />
 </button>
 {showWidthComp && (
 <div className={styles.tableWrap} style={{ marginTop: 12 }}>
 <table className={styles.convTable}>
 <thead><tr><th>Fabric Width</th><th>Usable</th><th>Strips</th><th>Yardage</th><th>Buy</th></tr></thead>
 <tbody>
 {widthComp.map((w, i) =>(
 <tr key={i} style={parseFloat(fabricW) === w.width ? { background: "var(--color-accent-light)", fontWeight: 600 } : undefined}>
 <td>{w.width}&quot;</td>
 <td>{w.usable}&quot;</td>
 <td>{w.strips}</td>
 <td>{w.fabYd} yd</td>
 <td>{w.buy} yd</td>
 </tr>
 ))}
 </tbody>
 </table>
 <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 6 }}>For {Math.round(parseFloat(bindingLen) || 416)}&quot; binding, {toFrac(sw)}&quot; strips, standard selvage, +¼ yd buffer.</div>
 </div>
 )}
 </div>
 )}

 {/* QUICK REFERENCE TABLE */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
 onClick={() =>setShowRef(!showRef)}>Quick Reference — Standard Quilt Sizes <ChevronDown size={14} style={{ transform: showRef ? "rotate(180deg)" : "none", transition: "0.2s" }} />
 </button>
 {showRef && (
 <div className={styles.tableWrap} style={{ marginTop: 12 }}>
 <table className={styles.convTable}>
 <thead><tr><th>Quilt Size</th><th>Binding Length</th><th>Strips (2½&quot;)</th><th>Buy</th></tr></thead>
 <tbody>
 {quickRef.map((q, i) =>(
 <tr key={i}>
 <td>{q.name} ({q.w}×{q.h}&quot;)</td>
 <td>{q.totalLen}&quot;</td>
 <td>{q.stripsNeeded}</td>
 <td style={{ fontWeight: 600 }}>{toFrac(q.fabYd)} yd</td>
 </tr>
 ))}
 </tbody>
 </table>
 <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 6 }}>Assumes 42&quot; usable width, 2½&quot; strips, standard allowances, +¼ yd buffer.</div>
 </div>
 )}
 </div>

 {/* EDUCATIONAL CONTENT */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
 onClick={() =>setShowEdu(!showEdu)}>Understanding Strip-to-Yardage Conversion <ChevronDown size={14} style={{ transform: showEdu ? "rotate(180deg)" : "none", transition: "0.2s" }} />
 </button>
 {showEdu && (
 <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
 <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: "var(--color-text-primary)" }}>Why Strips and Yardage Seem Confusing</h3>
 <p>Binding fabric is sold by the <strong>yard</strong>(length of the bolt). Binding strips are cut across the <strong>width</strong>. These are perpendicular!</p>
 <ul style={{ paddingLeft: 20, marginTop: 6 }}>
 <li>The <strong>length</strong>you buy determines how <strong>many strips</strong>you can cut</li>
 <li>The <strong>width</strong>of the fabric determines how <strong>long each strip</strong>is</li>
 <li>1 yard (36&quot;) ÷ 2.5&quot; strip width = 14 strips from one yard</li>
 <li>Each strip is ~42&quot; long (the fabric width minus selvages)</li>
 <li>14 strips × 42&quot; = 588&quot; of binding from just 1 yard!</li>
 </ul>

 <h3 style={{ fontSize: 15, fontWeight: 600, margin: "14px 0 6px", color: "var(--color-text-primary)" }}>Why Always Round Strips UP</h3>
 <p>If you need 9.78 strips, you must cut <strong>10</strong>. You can&apos;t cut 0.78 of a strip — that partial strip is waste, but it&apos;s unavoidable. Always round up to the next whole number.</p>

 <h3 style={{ fontSize: 15, fontWeight: 600, margin: "14px 0 6px", color: "var(--color-text-primary)" }}>Join Loss</h3>
 <p>When joining strips with diagonal seams, each join consumes ~2&quot; of total length. With 10 strips (9 joins), you lose about 18&quot;. This is already accounted for if you used the Binding Strip Length Calculator&apos;s safety margin.</p>
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
 <div>Strips = Length ÷ Usable Width</div>
 <div>Fabric = Strips × Strip Width</div>
 <div>Yards = Fabric ÷ 36</div>
 </div>
 </div>
 <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
 <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Quick Answer</h4>
 <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.8 }}>
 <div>Baby quilt → <strong>½ yd</strong></div>
 <div>Throw quilt → <strong>¾ yd</strong></div>
 <div>Queen quilt → <strong>1 yd</strong></div>
 <div>King quilt → <strong>1¼ yd</strong></div>
 <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 4 }}>Based on 2½&quot; strips, 44&quot; fabric</div>
 </div>
 </div>
 <div className="glass-card related-tools">
 <h4>Related Tools</h4>
 <a href="/quilt/binding-strip-width" className="related-tool-link">Binding Strip Width</a>
 <a href="/quilt/binding-strip-length" className="related-tool-link">Binding Strip Length</a>
 <a href="/quilt/binding-calculator" className="related-tool-link">Binding Calculator</a>
 <a href="/quilt/backing-calculator" className="related-tool-link">Backing Calculator</a>
 <a href="/quilt" className="related-tool-link">All Quilt Tools</a>
 </div>
 </aside>
 </div>
 </div>
 );
}