"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, ChevronDown, Info, AlertTriangle, Ruler } from "lucide-react";

/* ─── constants ────────────────────────────────────── */
type FoldType = "double" | "single" | "premade";

const SA_OPTIONS = [
 { value: 0.21875, label: "Scant ¼\"" },
 { value: 0.25, label: "¼\" (standard)" },
 { value: 0.375, label: "⅜\"" },
 { value: 0.5, label: "½\"" },
];

const THICKNESS_OPTIONS = [
 { key: "very-thin", label: "Very Thin (under ¼\")", adj: 0, desc: "Table runners, wall hangings" },
 { key: "standard", label: "Standard / Low Loft (¼\"–⅜\")", adj: 0, desc: "Standard cotton + low loft batting" },
 { key: "medium", label: "Medium Loft (⅜\"–⅝\")", adj: 0.1875, desc: "Standard polyester batting" },
 { key: "high", label: "High Loft (⅝\"–1\")", adj: 0.3125, desc: "Thick batting, multiple layers" },
 { key: "extra-high", label: "Extra High Loft (over 1\")", adj: 0.4375, desc: "Comforters, tied quilts" },
];

const FINISHED_PRESETS = [
 { value: 0.125, label: "⅛\" Ultra Narrow", style: "Miniature quilts, doll quilts" },
 { value: 0.25, label: "¼\" Narrow", style: "Modern, minimalist" },
 { value: 0.375, label: "⅜\" Standard Narrow", style: "Modern quilts, clean look" },
 { value: 0.5, label: "½\" Standard", style: "Most common — suits all styles" },
 { value: 0.625, label: "⅝\" Traditional", style: "Classic, traditional quilts" },
 { value: 0.75, label: "¾\" Wide", style: "Bold, statement binding" },
 { value: 1.0, label: "1\" Extra Wide", style: "Art quilts, decorative" },
];

const CUT_PRESETS = [
 { value: 1.0, label: "1\"", desc: "Ultra narrow — minis only" },
 { value: 1.5, label: "1½\"", desc: "Narrow — wall hangings" },
 { value: 2.0, label: "2\"", desc: "Standard narrow — modern" },
 { value: 2.25, label: "2¼\"", desc: "Between narrow and standard" },
 { value: 2.5, label: "2½\"", desc: "Most popular cut width" },
 { value: 2.75, label: "2¾\"", desc: "Slightly wider than standard" },
 { value: 3.0, label: "3\"", desc: "Wide — traditional" },
 { value: 3.5, label: "3½\"", desc: "Wide — bold look" },
 { value: 4.5, label: "4½\"", desc: "Extra wide — statement" },
];

function toFrac(v: number): string {
 const w = Math.floor(v); const f = v - w;
 const fracs: [number, string][] = [[0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
 for (const [d, sym] of fracs) { if (Math.abs(f - d) < 0.02) return w >0 ? `${w}${sym}` : sym; }
 if (f >0.01) return v.toFixed(2);
 return String(w);
}

/* ─── component ──────────────────────────────────── */
export default function Page() {
 /* Mode: A = finished → cut, B = cut → finished */
 const [mode, setMode] = useState<"A" | "B">("A");
 const [foldType, setFoldType] = useState<FoldType>("double");
 /* Mode A inputs */
 const [finishedW, setFinishedW] = useState("0.5");
 /* Mode B inputs */
 const [cutW, setCutW] = useState("2.5");
 /* Common inputs */
 const [sa, setSa] = useState("0.25");
 const [customSa, setCustomSa] = useState("");
 const [thickness, setThickness] = useState("standard");
 const [customThick, setCustomThick] = useState("");
 /* Back preference */
 const [backPref, setBackPref] = useState<"equal" | "more" | "flush">("equal");
 /* UI */
 const [showRef, setShowRef] = useState(true);
 const [showEdu, setShowEdu] = useState(false);
 const [showTestGuide, setShowTestGuide] = useState(false);
 const [activeFaq, setActiveFaq] = useState<number | null>(null);

 /* derived */
 const seamAllow = sa === "custom" ? (parseFloat(customSa) || 0.25) : parseFloat(sa);
 const thickAdj = thickness === "custom"
 ? (parseFloat(customThick) || 0) * 2
 : (THICKNESS_OPTIONS.find(t =>t.key === thickness)?.adj ?? 0);
 const backAdj = backPref === "more" ? 0.125 : backPref === "flush" ? -0.0625 : 0;

 /* ═══ CORE FORMULAS ═══ */
 const result = useMemo(() =>{
 if (foldType === "premade") {
 return { cutWidth: 0, finWidth: 0.5, finFront: 0.5, finBack: 0.5, isPremade: true };
 }
 if (mode === "A") {
 // Finished → Cut
 const fw = parseFloat(finishedW) || 0;
 if (fw <= 0) return null;
 let cutCalc: number;
 if (foldType === "double") {
 // Double-fold: Cut = (finished × 4) + (SA × 2) + thicknessAdj + backAdj
 cutCalc = (fw * 4) + (seamAllow * 2) + thickAdj + backAdj;
 } else {
 // Single-fold: Cut = (finished × 2) + SA + turnUnder(SA) + thicknessAdj + backAdj
 cutCalc = (fw * 2) + seamAllow + seamAllow + thickAdj + backAdj;
 }
 const finFront = fw;
 const finBack = backPref === "more" ? fw + 0.0625 : backPref === "flush" ? fw - 0.0625 : fw;
 return { cutWidth: cutCalc, finWidth: fw, finFront, finBack: Math.max(finBack, 0.0625), isPremade: false };
 } else {
 // Cut → Finished
 const cw = parseFloat(cutW) || 0;
 if (cw <= 0) return null;
 let finCalc: number;
 if (foldType === "double") {
 finCalc = (cw - (seamAllow * 2) - thickAdj - backAdj) / 4;
 } else {
 finCalc = (cw - seamAllow - seamAllow - thickAdj - backAdj) / 2;
 }
 if (finCalc <= 0) return null;
 const finFront = finCalc;
 const finBack = backPref === "more" ? finCalc + 0.0625 : backPref === "flush" ? finCalc - 0.0625 : finCalc;
 return { cutWidth: cw, finWidth: finCalc, finFront, finBack: Math.max(finBack, 0.0625), isPremade: false };
 }
 }, [mode, foldType, finishedW, cutW, seamAllow, thickAdj, backAdj, backPref]);

 /* warnings */
 const warnings: string[] = [];
 if (result && !result.isPremade) {
 if (result.finWidth < 0.125) warnings.push("This is extremely narrow — very difficult to sew accurately.");
 if (result.finWidth >2) warnings.push("This is unusually wide binding — confirm this is intentional.");
 if (result.cutWidth < 0.75) warnings.push("Cut width is too narrow for any standard binding method.");
 if (result.cutWidth >5) warnings.push("Cut width exceeds 5\" — this is uncommonly wide.");
 if (thickness === "high" || thickness === "extra-high") {
 if (result.finWidth < 0.375) warnings.push("High-loft quilts should not use very narrow binding — it won't lie flat.");
 }
 }

 /* reference table */
 const refTable = FINISHED_PRESETS.map(p =>{
 const dbl = (p.value * 4) + (seamAllow * 2);
 const sgl = (p.value * 2) + seamAllow + seamAllow;
 return { fin: p.value, finLabel: p.label, dblCut: dbl, sglCut: sgl, style: p.style };
 });

 /* SA comparison for current finished width */
 const saCompare = SA_OPTIONS.map(s =>{
 const fw = result?.finWidth || 0.5;
 const dbl = (fw * 4) + (s.value * 2);
 return { sa: s.value, label: s.label, cut: dbl, isCurrent: Math.abs(s.value - seamAllow) < 0.01 };
 });

 const copyText = result && !result.isPremade
 ? `Cut binding strips at ${toFrac(result.cutWidth)}". This gives a finished binding of ${toFrac(result.finWidth)}" (${foldType}-fold, ${toFrac(seamAllow)}" seam allowance).`
 : "";

 /* FAQ */
 const faqItems = [
 { q: "How wide do I cut quilt binding strips?", a: "For standard ½\" finished double-fold binding with ¼\" seam allowance, cut your strips 2½\" wide. This is the most common binding strip width used by quilters worldwide." },
 { q: "What is the standard binding strip width?", a: "2½\" is the standard cut width for double-fold quilt binding. This gives a finished binding of ½\" visible on both the front and back of the quilt, using standard ¼\" seam allowance." },
 { q: "Why is my binding not reaching the back of my quilt?", a: "Your quilt may be thicker than standard, consuming more fabric when the binding wraps around the edge. Try adding ¼\" to your cut width, or use the thickness adjustment in this calculator to get the precise width for your quilt's loft." },
 { q: "What is double-fold quilt binding?", a: "Double-fold (French) binding is a strip folded in half lengthwise before being attached. This creates two layers of fabric, making the binding more durable. It's the most popular binding method for quilts." },
 { q: "How wide should I cut binding for a thick quilt?", a: "Add ¼\"–½\" to standard cut width. For medium loft: cut at 2⅝\"–2¾\". For high loft: cut at 2¾\"–3\". For extra-high loft: cut at 3\"–3½\". Always do a test strip on your actual quilt sandwich first." },
 { q: "What is the difference between cut width and finished width in binding?", a: "Cut width is the size you cut your strips. Finished width is the visible binding on the quilt after sewing. For double-fold binding, finished width is approximately ¼ of the cut width minus seam allowances." },
 { q: "How do I calculate binding strip width in centimeters?", a: "Use the same formula, then multiply inches by 2.54 to get cm. Standard: 2.5\" = 6.35 cm (round to 6.5 cm for practical cutting). Or enter your desired finished width in this calculator and check the metric display." },
 { q: "What finished binding width looks best on a quilt?", a: "½\" finished is the most popular and versatile width. Narrow modern quilts look great with ¼\"–⅜\" binding. Traditional quilts suit ⅝\"–¾\" binding. Choose based on your quilt's style and personal preference." },
 { q: "What is single-fold binding and when do I use it?", a: "Single-fold binding uses a single layer of fabric folded over the quilt edge. It's lighter weight than double-fold, making it suitable for wall hangings, table runners, and lightweight projects where durability is less critical." },
 { q: "How do I test my binding strip width before cutting all my fabric?", a: "Cut one 6\" test strip at your calculated width. Fold, press, and stitch it to a scrap of your actual quilt sandwich. Wrap around the edge and check: does it reach the back? Is the front width correct? Adjust and retest if needed." },
 { q: "My pattern says cut 2.5 inch strips — why is my binding not 2.5 inches wide?", a: "Cut width ≠ finished width. A 2.5\" strip folded in half becomes 1.25\", then seam allowance and wrapping reduce the visible binding to about ½\" on each side. This is normal — a 2.5\" cut strip gives ½\" finished binding." },
 ];

 return (
 <div className="container">
 <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "Binding Strip Width Calculator" }]} />
 <div className="calculator-layout">
 <div className="calculator-main">
 {/* HEADER */}
 <div className={styles.toolHeader}>
 <span className="category-badge"><Ruler size={14} strokeWidth={1.5} />Quilt #139</span>
 <h1>Binding Strip Width Calculator</h1>
 <p>Calculate the exact width to cut binding strips — or enter your cut width to see what finished binding you&apos;ll get. For double-fold, single-fold, or pre-made binding.</p>
 </div>

 {/* ① MODE SELECTOR */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>① Calculation Mode</h2>
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
 <button className={`btn ${mode === "A" ? "btn-primary" : "btn-secondary"}`} style={{ textAlign: "left", padding: "10px 14px" }}
 onClick={() =>setMode("A")}>
 <strong>Finished → Cut Width</strong>
 <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>I know what finished width I want</div>
 </button>
 <button className={`btn ${mode === "B" ? "btn-primary" : "btn-secondary"}`} style={{ textAlign: "left", padding: "10px 14px" }}
 onClick={() =>setMode("B")}>
 <strong>Cut → Finished Width</strong>
 <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>I know what width I cut my strips</div>
 </button>
 </div>
 </div>

 {/* ② BINDING FOLD TYPE */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>② Binding Fold Type</h2>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
 {([
 { key: "double" as FoldType, label: "Double-Fold (French)", desc: "Most common, most durable" },
 { key: "single" as FoldType, label: "Single-Fold", desc: "Lightweight projects" },
 { key: "premade" as FoldType, label: "Pre-Made Binding", desc: "Store-bought, pre-folded" },
 ]).map(f =>(
 <button key={f.key} className={`btn btn-sm ${foldType === f.key ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setFoldType(f.key)} title={f.desc}>{f.label}</button>
 ))}
 </div>
 {foldType === "double" && <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}><Info size={12} style={{ display: "inline", marginRight: 4 }} />Strip folded in half lengthwise before applying. Formula: Cut = (Finished × 4) + (SA × 2)</div>}
 {foldType === "single" && <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}><Info size={12} style={{ display: "inline", marginRight: 4 }} />Single layer folded over edge. Formula: Cut = (Finished × 2) + SA + Turn-under</div>}
 {foldType === "premade" && <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}><Info size={12} style={{ display: "inline", marginRight: 4 }} />Already folded to a specific finished width. Standard commercial: ½&quot; or ¾&quot; finished.</div>}
 </div>

 {foldType !== "premade" && (<>
 {/* ③ SEAM ALLOWANCE */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>③ Seam Allowance</h2>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
 {SA_OPTIONS.map(o =>(
 <button key={o.value} className={`btn btn-sm ${parseFloat(sa) === o.value && sa !== "custom" ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setSa(String(o.value))}>{o.label}</button>
 ))}
 <button className={`btn btn-sm ${sa === "custom" ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setSa("custom")}>Custom</button>
 </div>
 {sa === "custom" && (
 <div className="input-group" style={{ maxWidth: 200, marginTop: 8 }}>
 <input type="number" className="input-field" placeholder="e.g. 0.3125" value={customSa}
 onChange={e =>setCustomSa(e.target.value)} min={0.0625} max={1} step={0.0625} />
 </div>
 )}
 {parseFloat(sa) === 0.21875 && <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 6 }}><Info size={12} style={{ display: "inline", marginRight: 4 }} />Scant ¼&quot; is ~1/32&quot; less than ¼&quot;. Compensates for the fold taking up a tiny amount of fabric.</div>}
 </div>

 {/* ④ QUILT THICKNESS */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>④ Quilt Thickness / Batting Loft</h2>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
 {THICKNESS_OPTIONS.map(t =>(
 <button key={t.key} className={`btn btn-sm ${thickness === t.key ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setThickness(t.key)} title={t.desc}>{t.label}</button>
 ))}
 <button className={`btn btn-sm ${thickness === "custom" ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setThickness("custom")}>Custom Thickness</button>
 </div>
 {thickness === "custom" && (
 <div className="input-group" style={{ maxWidth: 250, marginTop: 8 }}>
 <label className="input-label">Quilt sandwich thickness (inches)</label>
 <input type="number" className="input-field" value={customThick} onChange={e =>setCustomThick(e.target.value)} min={0} max={3} step={0.0625} placeholder="e.g. 0.75" />
 <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>Compress gently and measure with a ruler</span>
 </div>
 )}
 {thickAdj >0 && <div style={{ fontSize: 12, color: "hsl(35,80%,45%)", marginTop: 6 }}><AlertTriangle size={12} style={{ display: "inline", marginRight: 4 }} />Adding +{toFrac(thickAdj)}&quot; to cut width for quilt thickness.</div>}
 </div>

 {/* ⑤ INPUT (Mode A or B) */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 {mode === "A" ? (<>
 <h2 className={styles.calcTitle}>⑤ Desired Finished Binding Width</h2>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
 {FINISHED_PRESETS.map(p =>(
 <button key={p.value} className={`btn btn-sm ${parseFloat(finishedW) === p.value ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setFinishedW(String(p.value))}>{p.label}</button>
 ))}
 </div>
 <div className="input-group" style={{ maxWidth: 250 }}>
 <label className="input-label">Custom finished width (inches)</label>
 <input type="number" className="input-field" value={finishedW} onChange={e =>setFinishedW(e.target.value)} min={0.0625} max={3} step={0.0625} />
 </div>
 </>) : (<>
 <h2 className={styles.calcTitle}>⑤ Your Cut Strip Width</h2>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
 {CUT_PRESETS.map(p =>(
 <button key={p.value} className={`btn btn-sm ${parseFloat(cutW) === p.value ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setCutW(String(p.value))}>{p.label}</button>
 ))}
 </div>
 <div className="input-group" style={{ maxWidth: 250 }}>
 <label className="input-label">Custom cut width (inches)</label>
 <input type="number" className="input-field" value={cutW} onChange={e =>setCutW(e.target.value)} min={0.5} max={8} step={0.0625} />
 </div>
 </>)}
 </div>

 {/* ⑥ BACK PREFERENCE */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>⑥ Back Binding Visibility</h2>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
 {([
 { key: "equal" as const, label: "Equal front & back", desc: "Standard result" },
 { key: "more" as const, label: "More on back (+⅛\")", desc: "Easier hand-stitching" },
 { key: "flush" as const, label: "Flush to seam (machine)", desc: "Machine stitch-in-ditch" },
 ]).map(b =>(
 <button key={b.key} className={`btn btn-sm ${backPref === b.key ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setBackPref(b.key)} title={b.desc}>{b.label}</button>
 ))}
 </div>
 </div>
 </>)}

 {/* ═══ RESULTS ═══ */}
 {result && (<>
 <div className={`calculator-results ${styles.results}`}>
 {result.isPremade ? (
 <div className="result-card">
 <div className="result-value">Pre-Made Binding — No Cutting Needed</div>
 <div className="result-label">Standard commercial binding: ½&quot; or ¾&quot; finished. Purchase by total length needed.</div>
 </div>
 ) : (<>
 <div className="result-card">
 <div className="result-value">
 {mode === "A"
 ? `Cut strips at ${toFrac(result.cutWidth)}"`
 : `Finished binding: ${toFrac(result.finWidth)}"`
 }
 </div>
 <div className="result-label">
 {mode === "A"
 ? `${toFrac(result.finWidth)}" finished · ${foldType}-fold · ${toFrac(seamAllow)}" SA`
 : `From ${toFrac(result.cutWidth)}" cut strips · ${foldType}-fold · ${toFrac(seamAllow)}" SA`
 }
 </div>
 </div>

 {/* Detailed breakdown */}
 <div className={styles.resultDetails}>
 <div className={styles.resultRow}><span>Cut strip width</span><strong>{toFrac(result.cutWidth)}&quot; ({(result.cutWidth * 2.54).toFixed(1)} cm)</strong></div>
 <div className={styles.resultRow}><span>Finished width (front)</span><strong>{toFrac(result.finFront)}&quot;</strong></div>
 <div className={styles.resultRow}><span>Finished width (back)</span><strong>{toFrac(result.finBack)}&quot;</strong></div>
 <div className={styles.resultRow}><span>Binding type</span><strong>{foldType === "double" ? "Double-fold (French)" : "Single-fold"}</strong></div>
 <div className={styles.resultRow}><span>Seam allowance</span><strong>{toFrac(seamAllow)}&quot;</strong></div>
 {thickAdj >0 && <div className={styles.resultRow}><span>Thickness adjustment</span><strong>+{toFrac(thickAdj)}&quot;</strong></div>}
 {backAdj !== 0 && <div className={styles.resultRow}><span>Back preference adjustment</span><strong>{backAdj >0 ? "+" : ""}{toFrac(backAdj)}&quot;</strong></div>}
 </div>

 {/* Formula */}
 <div style={{ background: "var(--color-bg-secondary)", borderRadius: "var(--radius-md)", padding: 14, marginTop: 12, fontSize: 13, fontFamily: "var(--font-mono, monospace)", lineHeight: 1.9 }}>
 <strong>{foldType === "double" ? "Double-Fold" : "Single-Fold"} Formula:</strong>
 {foldType === "double" ? (<>
 <div>Cut = (Finished × 4) + (SA × 2){thickAdj >0 ? " + Thickness" : ""}{backAdj !== 0 ? " + BackAdj" : ""}</div>
 <div>Cut = ({toFrac(result.finWidth)}&quot; × 4) + ({toFrac(seamAllow)}&quot; × 2){thickAdj >0 ? ` + ${toFrac(thickAdj)}"` : ""}{backAdj !== 0 ? ` ${backAdj >0 ? "+" : ""}${toFrac(backAdj)}"` : ""}</div>
 <div>Cut = {toFrac(result.finWidth * 4)}&quot; + {toFrac(seamAllow * 2)}&quot;{thickAdj >0 ? ` + ${toFrac(thickAdj)}"` : ""}{backAdj !== 0 ? ` ${backAdj >0 ? "+" : ""}${toFrac(backAdj)}"` : ""} = <strong>{toFrac(result.cutWidth)}&quot;</strong></div>
 </>) : (<>
 <div>Cut = (Finished × 2) + SA + Turn-under{thickAdj >0 ? " + Thickness" : ""}{backAdj !== 0 ? " + BackAdj" : ""}</div>
 <div>Cut = ({toFrac(result.finWidth)}&quot; × 2) + {toFrac(seamAllow)}&quot; + {toFrac(seamAllow)}&quot;{thickAdj >0 ? ` + ${toFrac(thickAdj)}"` : ""} = <strong>{toFrac(result.cutWidth)}&quot;</strong></div>
 </>)}
 </div>

 {/* Where the fabric goes */}
 {foldType === "double" && (
 <div style={{ background: "var(--color-bg-secondary)", borderRadius: "var(--radius-md)", padding: 14, marginTop: 10, fontSize: 13, lineHeight: 1.9 }}>
 <strong>Where the Fabric Goes:</strong>
 <div style={{ fontFamily: "var(--font-mono, monospace)", marginTop: 6 }}>
 <div>Front visible binding: {toFrac(result.finFront)}&quot;</div>
 <div>Fold around front edge: {toFrac(result.finFront)}&quot;</div>
 <div>Around quilt edge: {toFrac(result.finFront)}&quot;{thickAdj >0 ? ` (+${toFrac(thickAdj)}" for thickness)` : ""}</div>
 <div>Back visible + seam: {toFrac(result.finFront)}&quot; (includes {toFrac(seamAllow)}&quot; SA)</div>
 <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: 4, marginTop: 4, fontWeight: 600 }}>Total: {toFrac(result.cutWidth)}&quot; ✓</div>
 </div>
 </div>
 )}

 {/* Metric equivalents */}
 <div style={{ background: "var(--color-bg-secondary)", borderRadius: "var(--radius-md)", padding: 14, marginTop: 10, fontSize: 13, fontFamily: "var(--font-mono, monospace)", lineHeight: 2 }}>
 <strong>Metric Equivalents:</strong>
 <div>Cut width: {toFrac(result.cutWidth)}&quot; = {(result.cutWidth * 2.54).toFixed(2)} cm = {(result.cutWidth * 25.4).toFixed(1)} mm</div>
 <div>Finished: {toFrac(result.finWidth)}&quot; = {(result.finWidth * 2.54).toFixed(2)} cm = {(result.finWidth * 25.4).toFixed(1)} mm</div>
 <div>Practical: cut at {(Math.ceil(result.cutWidth * 2.54 * 2) / 2).toFixed(1)} cm (nearest 0.5 cm)</div>
 </div>

 {/* Salvage assessment (Mode B) */}
 {mode === "B" && result.finWidth >0 && (
 <div style={{ background: result.finWidth >= 0.25 ? "hsl(140,50%,95%)" : "hsl(0,50%,95%)", borderRadius: "var(--radius-md)", padding: 14, marginTop: 10, fontSize: 13, lineHeight: 1.8 }}>
 <strong>{result.finWidth >= 0.25 ? "✓ This is usable!" : "⚠ Very narrow — may not be practical"}</strong>
 <div style={{ marginTop: 4 }}>Your {toFrac(result.cutWidth)}&quot; strips give {toFrac(result.finWidth)}&quot; finished binding.
 {result.finWidth >= 0.5 && " This is standard width — works great for any quilt."}
 {result.finWidth >= 0.375 && result.finWidth < 0.5 && " This is a clean, modern look — works well for wall hangings and modern quilts."}
 {result.finWidth >= 0.25 && result.finWidth < 0.375 && " This is narrow but usable — works for minimalist quilts and light projects."}
 {result.finWidth < 0.25 && " This is too narrow for most quilts. Consider cutting wider strips."}
 </div>
 </div>
 )}

 {/* Warnings */}
 {warnings.length >0 && (
 <div style={{ marginTop: 10 }}>
 {warnings.map((w, i) =>(
 <div key={i} style={{ fontSize: 12, color: "hsl(35,80%,45%)", marginTop: 4 }}>
 <AlertTriangle size={12} style={{ display: "inline", marginRight: 4 }} />{w}
 </div>
 ))}
 </div>
 )}
 </>)}
 </div>

 {/* Toolbar */}
 {!result.isPremade && (
 <div className="toolbar" style={{ marginBottom: 16 }}>
 <button className="btn btn-secondary btn-sm" onClick={() =>navigator.clipboard.writeText(copyText)}>
 <ClipboardCopy size={13} />Copy
 </button>
 <button className="btn btn-secondary btn-sm" onClick={() =>window.print()}>
 <Printer size={13} />Print
 </button>
 </div>
 )}
 </>)}

 {/* SA COMPARISON TABLE */}
 {result && !result.isPremade && foldType === "double" && (
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>How Seam Allowance Affects Cut Width</h3>
 <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 8 }}>For {toFrac(result.finWidth)}&quot; finished double-fold binding:</div>
 <div className={styles.tableWrap}>
 <table className={styles.convTable}>
 <thead><tr><th>Seam Allowance</th><th>Cut Width</th><th></th></tr></thead>
 <tbody>
 {saCompare.map((s, i) =>(
 <tr key={i} style={s.isCurrent ? { background: "var(--color-accent-light)", fontWeight: 600 } : undefined}>
 <td>{s.label}</td>
 <td>{toFrac(s.cut)}&quot;</td>
 <td>{s.isCurrent ? "← Your selection" : ""}</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 )}

 {/* WIDTH REFERENCE TABLE */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
 onClick={() =>setShowRef(!showRef)}>Full Width Reference Table <ChevronDown size={14} style={{ transform: showRef ? "rotate(180deg)" : "none", transition: "0.2s" }} />
 </button>
 {showRef && (
 <div className={styles.tableWrap} style={{ marginTop: 12 }}>
 <table className={styles.convTable}>
 <thead><tr><th>Finished Width</th><th>Cut (Double-Fold)</th><th>Cut (Single-Fold)</th><th>Style</th></tr></thead>
 <tbody>
 {refTable.map((r, i) =>(
 <tr key={i} style={result && Math.abs(r.fin - (result.finWidth || 0)) < 0.02 ? { background: "var(--color-accent-light)", fontWeight: 600 } : undefined}>
 <td>{r.finLabel.split(" ")[0]}</td>
 <td style={{ fontWeight: 600 }}>{toFrac(r.dblCut)}&quot;</td>
 <td>{toFrac(r.sglCut)}&quot;</td>
 <td style={{ fontSize: 12 }}>{r.style}</td>
 </tr>
 ))}
 </tbody>
 </table>
 <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 6 }}>Based on {toFrac(seamAllow)}&quot; seam allowance. No thickness adjustment.</div>
 </div>
 )}
 </div>

 {/* BINDING TEST GUIDE */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
 onClick={() =>setShowTestGuide(!showTestGuide)}>Binding Strip Test Method <ChevronDown size={14} style={{ transform: showTestGuide ? "rotate(180deg)" : "none", transition: "0.2s" }} />
 </button>
 {showTestGuide && (
 <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
 <p style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>Test your binding width before cutting all your strips:</p>
 <ol style={{ paddingLeft: 20, marginTop: 6 }}>
 <li>Cut one <strong>6&quot; test strip</strong>at your calculated width</li>
 <li>Fold in half lengthwise, press with iron</li>
 <li>Stitch to a scrap of your <strong>actual quilt sandwich</strong>(not just fabric)</li>
 <li>Wrap around edge and pin to back</li>
 <li><strong>Check:</strong>Does it reach the back with enough to turn under?</li>
 <li><strong>Check:</strong>Is the front width what you wanted?</li>
 <li><strong>Check:</strong>Is it too tight or loose around the edge?</li>
 <li>If needed, adjust width and cut another test strip</li>
 <li>Once satisfied, cut all your strips at the confirmed width</li>
 </ol>
 <p style={{ fontSize: 12, color: "hsl(35,80%,45%)", marginTop: 8 }}><AlertTriangle size={12} style={{ display: "inline", marginRight: 4 }} />This 5-minute test can save hours of frustration and wasted fabric!</p>
 </div>
 )}
 </div>

 {/* EDUCATIONAL CONTENT */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
 onClick={() =>setShowEdu(!showEdu)}>Why 2.5&quot; Strips Don&apos;t Make 2.5&quot; Binding <ChevronDown size={14} style={{ transform: showEdu ? "rotate(180deg)" : "none", transition: "0.2s" }} />
 </button>
 {showEdu && (
 <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
 <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: "var(--color-text-primary)" }}>The Binding Strip Width Mystery — Solved</h3>
 <p>The #1 question beginners ask: &quot;I cut my strips 2½&quot; wide — why is my binding only ½&quot; wide on the quilt?&quot; Here&apos;s exactly what happens:</p>
 <ol style={{ paddingLeft: 20, marginTop: 6 }}>
 <li><strong>Start with 2½&quot; strip</strong>— your cut width</li>
 <li><strong>Fold in half:</strong>now 1¼&quot; wide (two layers)</li>
 <li><strong>Stitch ¼&quot; from edge:</strong>seam hidden but consumes ¼&quot;</li>
 <li><strong>Front visible:</strong>fold edge shows ~½&quot; from seam to fold</li>
 <li><strong>Wrap to back:</strong>remaining fabric wraps around quilt edge</li>
 <li><strong>Back visible:</strong>~¾&quot; reaches back, turn under ¼&quot; → ½&quot; visible on back</li>
 </ol>
 <p style={{ marginTop: 10 }}><strong>Result:</strong>2½&quot; cut strip = ½&quot; visible binding on each side. This is <em>normal</em>and <em>correct</em>.</p>

 <h3 style={{ fontSize: 15, fontWeight: 600, margin: "14px 0 6px", color: "var(--color-text-primary)" }}>Double-Fold vs Single-Fold</h3>
 <p><strong>Double-fold:</strong>folded in half first, then applied. Two layers = more durable. Requires wider cut strip. Best for bed quilts, lap quilts, anything that gets used.</p>
 <p><strong>Single-fold:</strong>single layer folded over edge. Lighter weight but less durable. Narrower cut strip needed. Best for wall hangings, table runners, lightweight items.</p>

 <h3 style={{ fontSize: 15, fontWeight: 600, margin: "14px 0 6px", color: "var(--color-text-primary)" }}>Why Quilt Thickness Matters</h3>
 <p>Standard formulas assume a thin quilt (~⅜&quot;). Thick quilts consume more fabric wrapping around the edge. Without adjusting, your binding may not reach the back. For high-loft batting, add ¼&quot;–½&quot; to your cut width.</p>
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
 <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Key Formula</h4>
 <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.8, fontFamily: "var(--font-mono, monospace)" }}>
 <div style={{ marginBottom: 8 }}>
 <strong>Double-fold:</strong><br />Cut = (Fin × 4) + (SA × 2)
 </div>
 <div>
 <strong>Single-fold:</strong><br />Cut = (Fin × 2) + SA + SA
 </div>
 </div>
 </div>
 <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
 <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Most Common</h4>
 <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.8 }}>
 <div style={{ fontWeight: 600, color: "var(--color-accent-primary)" }}>Cut: 2½&quot; → Finished: ½&quot;</div>
 <div style={{ fontSize: 12, marginTop: 4 }}>Double-fold, ¼&quot; SA</div>
 <div style={{ fontSize: 12 }}>Suits most quilts</div>
 </div>
 </div>
 <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
 <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Pattern Decoder</h4>
 <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.8 }}>
 <div>&quot;Cut 2.5&quot; strips&quot; → ½&quot; finished</div>
 <div>&quot;Cut 2&quot; strips&quot; → ⅜&quot; finished</div>
 <div>&quot;Cut 3&quot; strips&quot; → ⅝&quot; finished</div>
 <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 4 }}>Assumes double-fold, ¼&quot; SA</div>
 </div>
 </div>
 <div className="glass-card related-tools">
 <h4>Related Tools</h4>
 <a href="/quilt/binding-calculator" className="related-tool-link">Binding Calculator</a>
 <a href="/quilt/binding-strip-length" className="related-tool-link">Binding Strip Length</a>
 <a href="/quilt/binding-yardage" className="related-tool-link">Binding Yardage</a>
 <a href="/quilt/backing-calculator" className="related-tool-link">Backing Calculator</a>
 <a href="/quilt" className="related-tool-link">All Quilt Tools</a>
 </div>
 </aside>
 </div>
 </div>
 );
}