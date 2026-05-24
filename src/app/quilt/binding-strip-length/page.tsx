"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, ChevronDown, Info, AlertTriangle, Ruler } from "lucide-react";

/* ─── constants ────────────────────────────────────── */
type Shape = "rect" | "square" | "hexagon" | "octagon" | "circle" | "irregular";
const SHAPES: { key: Shape; label: string }[] = [
 { key: "rect", label: "Rectangle" },
 { key: "square", label: "Square" },
 { key: "hexagon", label: "Hexagon" },
 { key: "octagon", label: "Octagon" },
 { key: "circle", label: "Circle / Scalloped" },
 { key: "irregular", label: "Custom Perimeter" },
];

const PRESETS = [
 { label: "Baby / Crib", w: 36, h: 52 },
 { label: "Throw", w: 54, h: 72 },
 { label: "Twin", w: 68, h: 90 },
 { label: "Full / Double", w: 80, h: 90 },
 { label: "Queen", w: 84, h: 92 },
 { label: "King", w: 104, h: 92 },
 { label: "Cal King", w: 100, h: 100 },
];

const SAFETY_LEVELS: { key: string; label: string; value: number }[] = [
 { key: "none", label: "None (0\")", value: 0 },
 { key: "min", label: "Minimal (6\")", value: 6 },
 { key: "std", label: "Standard (12\")", value: 12 },
 { key: "generous", label: "Generous (18\")", value: 18 },
];

function toFrac(v: number): string {
 const w = Math.floor(v); const f = v - w;
 const fracs: [number, string][] = [[0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
 for (const [d, sym] of fracs) { if (Math.abs(f - d) < 0.02) return w >0 ? `${w}${sym}` : sym; }
 if (f >0.01) return v.toFixed(1);
 return String(w);
}

/* ─── component ──────────────────────────────────── */
export default function Page() {
 /* shape & dimensions */
 const [shape, setShape] = useState<Shape>("rect");
 const [qw, setQw] = useState("84");
 const [qh, setQh] = useState("92");
 const [sideLen, setSideLen] = useState("12");
 const [diameter, setDiameter] = useState("60");
 const [directPerim, setDirectPerim] = useState("");
 /* allowances */
 const [cornerAllow, setCornerAllow] = useState("12");
 const [joinAllow, setJoinAllow] = useState("15");
 const [safetyLevel, setSafetyLevel] = useState("std");
 const [customSafety, setCustomSafety] = useState("12");
 /* unit toggle */
 const [showMetric, setShowMetric] = useState(false);
 /* collapsibles */
 const [showAllowances, setShowAllowances] = useState(false);
 const [showRef, setShowRef] = useState(true);
 const [showEdu, setShowEdu] = useState(false);
 const [activeFaq, setActiveFaq] = useState<number | null>(null);

 /* derived dimensions */
 const w = parseFloat(qw) || 0;
 const h = parseFloat(qh) || 0;
 const sl = parseFloat(sideLen) || 0;
 const dia = parseFloat(diameter) || 0;
 const ca = parseFloat(cornerAllow) || 0;
 const ja = parseFloat(joinAllow) || 0;
 const sm = safetyLevel === "custom" ? (parseFloat(customSafety) || 0) : (SAFETY_LEVELS.find(s =>s.key === safetyLevel)?.value ?? 12);

 /* corners count */
 const corners = shape === "hexagon" ? 6 : shape === "octagon" ? 8 : shape === "circle" ? 0 : shape === "irregular" ? -1 : 4;
 const effectiveCA = corners === -1 ? ca : corners >0 ? ca * (corners / 4) : 0;

 /* perimeter */
 const perimeter = useMemo(() =>{
 switch (shape) {
 case "rect": return (w + h) * 2;
 case "square": return w * 4;
 case "hexagon": return sl * 6;
 case "octagon": return sl * 8;
 case "circle": return Math.round(Math.PI * dia);
 case "irregular": return parseFloat(directPerim) || 0;
 default: return 0;
 }
 }, [shape, w, h, sl, dia, directPerim]);

 /* main result */
 const result = useMemo(() =>{
 if (perimeter <= 0) return null;
 const totalLen = perimeter + effectiveCA + ja + sm;
 const totalFt = totalLen / 12;
 const totalYd = totalLen / 36;
 const totalCm = totalLen * 2.54;
 const totalM = totalCm / 100;
 return { totalLen, totalFt, totalYd, totalCm, totalM };
 }, [perimeter, effectiveCA, ja, sm]);

 /* Quick reference */
 const quickRef = PRESETS.map(p =>{
 const perim = (p.w + p.h) * 2;
 const total = perim + 12 + 15 + 12; // standard allowances
 return { name: p.label, size: `${p.w}×${p.h}`, perim, total, totalFt: (total / 12).toFixed(1), totalYd: (total / 36).toFixed(2) };
 });

 const copyText = result
 ? `Binding strip length: ${result.totalLen}" (${result.totalFt.toFixed(1)} ft / ${result.totalYd.toFixed(2)} yd). Perimeter: ${perimeter}". Allowances: corners ${effectiveCA}" + join ${ja}" + safety ${sm}".`
 : "";

 /* FAQ */
 const faqItems = [
 { q: "How do I calculate the total binding strip length for my quilt?", a: "Measure your quilt's perimeter. For rectangles: (width + height) × 2. Then add allowances for corners (typically 3\" per corner = 12\" for 4 corners), joining/overlap (12–18\"), and a safety margin (6–12\"). The total is your binding strip length." },
 { q: "How much extra binding should I add beyond the perimeter?", a: "Add 3\" per corner for mitering (12\" for a rectangular quilt), 12–18\" for the starting/ending overlap where strips are joined, and 6–12\" of safety margin. Total extra is typically 30–42\" beyond the perimeter." },
 { q: "What is binding strip length vs binding yardage?", a: "Binding strip length is the total continuous length of binding needed (in inches). Binding yardage is how much fabric you need to BUY to cut enough strips to reach that length. They are related but different calculations." },
 { q: "How do I calculate binding length for a hexagon quilt?", a: "Measure one side of the hexagon and multiply by 6 for the perimeter. Add 3\" per point (18\" for 6 points) for corner allowance, plus joining and safety allowances." },
 { q: "How do I calculate binding length for a round quilt?", a: "Multiply the diameter by π (3.14159) to get the circumference. Add joining overlap (12–18\") and safety margin. Round quilts have no corners, so no corner allowance is needed — but bias binding is strongly recommended." },
 { q: "Why do I need extra binding for corners?", a: "When you miter binding at corners, you fold the binding at a 45° angle which consumes extra fabric. Approximately 3\" of extra binding is used per corner fold. For a rectangular quilt with 4 corners, that's 12\" total." },
 { q: "How do I measure the perimeter of an irregular quilt?", a: "Use a flexible measuring tape and carefully follow all edges of the quilt. Pin the tape to the edge as you go to keep it accurate. For scalloped edges, follow the curve of each scallop. Add 10–15% extra for curves." },
 { q: "Is binding strip length the same as quilt perimeter?", a: "No — binding strip length is always MORE than the perimeter. You need extra for mitering corners, overlapping where the binding strip starts and ends, and a safety margin for trimming. Typically 30–42\" more than the perimeter." },
 { q: "How do I calculate binding for a scalloped edge quilt?", a: "Measure along the scalloped edge with a flexible tape, following every curve. This measurement replaces your perimeter. Scalloped edges are longer than straight edges, so expect 15–25% more binding than a straight-edged quilt of the same size." },
 { q: "What if I'm using pre-made binding?", a: "Pre-made binding is sold by the yard or in packages with a stated length. Calculate your total binding strip length, then buy that amount (or slightly more). No strip cutting or joining needed with pre-made binding." },
 ];

 return (
 <div className="container">
 <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "Binding Strip Length Calculator" }]} />
 <div className="calculator-layout">
 <div className="calculator-main">
 {/* HEADER */}
 <div className={styles.toolHeader}>
 <span className="category-badge"><Ruler size={14} strokeWidth={1.5} />Quilt #140</span>
 <h1>Binding Strip Length Calculator</h1>
 <p>Calculate the exact total binding strip length needed for any quilt shape — including perimeter, corner mitering, joining overlap, and safety margin.</p>
 </div>

 {/* ① QUILT SHAPE & SIZE */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>① Quilt Shape &amp; Size</h2>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
 {SHAPES.map(s =>(
 <button key={s.key} className={`btn btn-sm ${shape === s.key ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setShape(s.key)}>{s.label}</button>
 ))}
 </div>

 {/* Size presets for rect */}
 {shape === "rect" && (
 <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
 {PRESETS.map(p =>(
 <button key={p.label} className={`btn btn-sm ${w === p.w && h === p.h ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>{ setQw(String(p.w)); setQh(String(p.h)); }}>{p.label}</button>
 ))}
 </div>
 )}

 {/* Dimension inputs */}
 {shape === "rect" && (
 <div className="calculator-form-row">
 <div className="input-group"><label className="input-label">Width (inches)</label>
 <input type="number" className="input-field" value={qw} onChange={e =>setQw(e.target.value)} min={1} /></div>
 <div className="input-group"><label className="input-label">Height (inches)</label>
 <input type="number" className="input-field" value={qh} onChange={e =>setQh(e.target.value)} min={1} /></div>
 </div>
 )}
 {shape === "square" && (
 <div className="calculator-form-row" style={{ maxWidth: 300 }}>
 <div className="input-group"><label className="input-label">Side length (inches)</label>
 <input type="number" className="input-field" value={qw} onChange={e =>setQw(e.target.value)} min={1} /></div>
 </div>
 )}
 {(shape === "hexagon" || shape === "octagon") && (
 <div className="calculator-form-row" style={{ maxWidth: 300 }}>
 <div className="input-group"><label className="input-label">Side length (inches)</label>
 <input type="number" className="input-field" value={sideLen} onChange={e =>setSideLen(e.target.value)} min={1} /></div>
 </div>
 )}
 {shape === "circle" && (
 <div className="calculator-form-row" style={{ maxWidth: 300 }}>
 <div className="input-group"><label className="input-label">Diameter (inches)</label>
 <input type="number" className="input-field" value={diameter} onChange={e =>setDiameter(e.target.value)} min={1} /></div>
 </div>
 )}
 {shape === "irregular" && (
 <div className="calculator-form-row" style={{ maxWidth: 300 }}>
 <div className="input-group"><label className="input-label">Total perimeter (inches)</label>
 <input type="number" className="input-field" placeholder="Measure all edges" value={directPerim} onChange={e =>setDirectPerim(e.target.value)} min={1} /></div>
 </div>
 )}
 {perimeter >0 && <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-accent-primary)", marginTop: 8 }}>Perimeter: {perimeter}&quot;{showMetric ? ` (${(perimeter * 2.54).toFixed(1)} cm)` : ""}</div>}
 {shape === "circle" && (
 <div style={{ fontSize: 12, color: "hsl(35,80%,45%)", marginTop: 6 }}>
 <AlertTriangle size={12} style={{ display: "inline", marginRight: 4 }} />Bias binding is strongly recommended for circular / scalloped quilts.
 </div>
 )}
 </div>

 {/* ② ALLOWANCES */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
 onClick={() =>setShowAllowances(!showAllowances)}>
 ② Allowances (corners {effectiveCA}&quot; + join {ja}&quot; + safety {sm}&quot; = +{effectiveCA + ja + sm}&quot;)
 <ChevronDown size={14} style={{ transform: showAllowances ? "rotate(180deg)" : "none", transition: "0.2s" }} />
 </button>
 {showAllowances && (
 <div style={{ marginTop: 12 }}>
 <div className="calculator-form-row">
 <div className="input-group">
 <label className="input-label">Corner allowance{corners >0 ? ` (total for all ${corners} corners)` : corners === -1 ? " (adjust for your quilt)" : ""}</label>
 <input type="number" className="input-field" value={cornerAllow} onChange={e =>setCornerAllow(e.target.value)} min={0} />
 <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>Default: 3&quot; × 4 corners = 12&quot;{corners !== 4 ? ` (scaled to ${effectiveCA}" for ${corners} corners)` : ""}
 </span>
 </div>
 <div className="input-group">
 <label className="input-label">Join / overlap allowance</label>
 <input type="number" className="input-field" value={joinAllow} onChange={e =>setJoinAllow(e.target.value)} min={0} />
 <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>Where binding starts and ends overlap</span>
 </div>
 </div>
 <div style={{ marginTop: 8 }}>
 <label className="input-label" style={{ display: "block", marginBottom: 6 }}>Safety margin</label>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
 {SAFETY_LEVELS.map(s =>(
 <button key={s.key} className={`btn btn-sm ${safetyLevel === s.key ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setSafetyLevel(s.key)}>{s.label}</button>
 ))}
 <button className={`btn btn-sm ${safetyLevel === "custom" ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setSafetyLevel("custom")}>Custom</button>
 </div>
 {safetyLevel === "custom" && (
 <div className="input-group" style={{ maxWidth: 200, marginTop: 8 }}>
 <input type="number" className="input-field" value={customSafety} onChange={e =>setCustomSafety(e.target.value)} min={0} />
 </div>
 )}
 </div>
 </div>
 )}
 </div>

 {/* ═══ RESULTS ═══ */}
 {result && (<>
 <div className={`calculator-results ${styles.results}`}>
 <div className="result-card">
 <div className="result-value">{result.totalLen}&quot; total binding strip length</div>
 <div className="result-label">{result.totalFt.toFixed(1)} feet · {result.totalYd.toFixed(2)} yards{showMetric ? ` · ${result.totalCm.toFixed(0)} cm · ${result.totalM.toFixed(2)} m` : ""}</div>
 </div>

 {/* Step-by-step breakdown */}
 <div className={styles.resultDetails}>
 <div className={styles.resultRow}><span>Quilt perimeter</span><strong>{perimeter}&quot;</strong></div>
 <div className={styles.resultRow}><span>+ Corner allowance{corners >0 ? ` (${corners} corners)` : corners === -1 ? " (est.)" : " (none)"}</span><strong>+{effectiveCA}&quot;</strong></div>
 <div className={styles.resultRow}><span>+ Join / overlap</span><strong>+{ja}&quot;</strong></div>
 <div className={styles.resultRow}><span>+ Safety margin</span><strong>+{sm}&quot;</strong></div>
 <div className={styles.resultRow} style={{ borderTop: "2px solid var(--color-border)", paddingTop: 8 }}>
 <span style={{ fontWeight: 600 }}>Total binding strip length</span>
 <strong>{result.totalLen}&quot; ({result.totalFt.toFixed(1)} ft)</strong>
 </div>
 </div>

 {/* Conversion table */}
 <div style={{ background: "var(--color-bg-secondary)", borderRadius: "var(--radius-md)", padding: 14, marginTop: 12, fontSize: 13, fontFamily: "var(--font-mono, monospace)", lineHeight: 2 }}>
 <div><strong>Inches:</strong>{result.totalLen}&quot;</div>
 <div><strong>Feet:</strong>{result.totalFt.toFixed(1)} ft</div>
 <div><strong>Yards:</strong>{result.totalYd.toFixed(2)} yd</div>
 <div><strong>Centimeters:</strong>{result.totalCm.toFixed(1)} cm</div>
 <div><strong>Meters:</strong>{result.totalM.toFixed(2)} m</div>
 </div>

 {/* Formula */}
 <div style={{ background: "var(--color-bg-secondary)", borderRadius: "var(--radius-md)", padding: 12, marginTop: 10, fontSize: 13, fontFamily: "var(--font-mono, monospace)" }}>Total = Perimeter + Corners + Join + Safety
 <br />Total = {perimeter}&quot; + {effectiveCA}&quot; + {ja}&quot; + {sm}&quot; = <strong>{result.totalLen}&quot;</strong>
 </div>
 </div>

 {/* Toolbar */}
 <div className="toolbar" style={{ marginBottom: 16 }}>
 <button className="btn btn-secondary btn-sm" onClick={() =>navigator.clipboard.writeText(copyText)}>
 <ClipboardCopy size={13} />Copy
 </button>
 <button className="btn btn-secondary btn-sm" onClick={() =>window.print()}>
 <Printer size={13} />Print
 </button>
 <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--color-text-secondary)" }}>
 <input type="checkbox" checked={showMetric} onChange={e =>setShowMetric(e.target.checked)} />Show metric
 </label>
 </div>
 </>)}

 {/* QUICK REFERENCE TABLE */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
 onClick={() =>setShowRef(!showRef)}>Quick Reference — Standard Quilt Sizes <ChevronDown size={14} style={{ transform: showRef ? "rotate(180deg)" : "none", transition: "0.2s" }} />
 </button>
 {showRef && (
 <div className={styles.tableWrap} style={{ marginTop: 12 }}>
 <table className={styles.convTable}>
 <thead><tr><th>Quilt Size</th><th>Dimensions</th><th>Perimeter</th><th>Total Length</th><th>Feet</th><th>Yards</th></tr></thead>
 <tbody>
 {quickRef.map((r, i) =>(
 <tr key={i} style={r.name === PRESETS.find(p =>p.w === w && p.h === h)?.label ? { background: "var(--color-accent-light)" } : undefined}>
 <td style={{ fontWeight: 600, fontFamily: "inherit" }}>{r.name}</td>
 <td>{r.size}&quot;</td>
 <td>{r.perim}&quot;</td>
 <td style={{ fontWeight: 600 }}>{r.total}&quot;</td>
 <td>{r.totalFt} ft</td>
 <td>{r.totalYd} yd</td>
 </tr>
 ))}
 </tbody>
 </table>
 <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 6 }}>Based on standard allowances: 12&quot; corners + 15&quot; join + 12&quot; safety = +39&quot;.
 </div>
 </div>
 )}
 </div>

 {/* EDUCATIONAL CONTENT */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
 onClick={() =>setShowEdu(!showEdu)}>Understanding Binding Strip Length <ChevronDown size={14} style={{ transform: showEdu ? "rotate(180deg)" : "none", transition: "0.2s" }} />
 </button>
 {showEdu && (
 <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
 <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: "var(--color-text-primary)" }}>What Is Binding Strip Length?</h3>
 <p>Binding strip length is the total continuous length of binding you need to go all the way around your quilt, including extra for corners, joining, and safety. It is NOT the same as yardage — yardage is how much fabric you need to <em>buy</em>to cut enough strips.</p>
 <h3 style={{ fontSize: 15, fontWeight: 600, margin: "14px 0 6px", color: "var(--color-text-primary)" }}>Why You Need More Than the Perimeter</h3>
 <p><strong>Corner mitering:</strong>Each 90° corner consumes about 3&quot; of extra binding fabric when you fold it at the miter. A rectangular quilt with 4 corners needs approximately 12&quot; extra.</p>
 <p><strong>Start/end overlap:</strong>Where you begin and end the binding strip, you overlap the two ends and join them together. This overlap typically uses 12–18&quot; of extra binding.</p>
 <p><strong>Safety margin:</strong>A small buffer (6–18&quot;) ensures you don&apos;t run short. Running out of binding with just one corner to go is every quilter&apos;s nightmare!</p>
 <h3 style={{ fontSize: 15, fontWeight: 600, margin: "14px 0 6px", color: "var(--color-text-primary)" }}>Binding Length vs Binding Yardage</h3>
 <p>After calculating binding strip length, you need a separate calculation to determine fabric yardage. The yardage depends on your fabric width and binding strip width. Use our <a href="/quilt/binding-calculator" style={{ color: "var(--color-accent-primary)" }}>Binding Calculator</a>for the complete yardage calculation.</p>
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
 <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.8 }}>
 <div style={{ fontFamily: "var(--font-mono, monospace)", marginBottom: 8 }}>Total = Perimeter<br />
 &nbsp; + Corner (3&quot;×4)<br />
 &nbsp; + Join (12-18&quot;)<br />
 &nbsp; + Safety (6-18&quot;)
 </div>
 <div style={{ fontWeight: 600, color: "var(--color-accent-primary)" }}>Typically Perimeter + ~39&quot;
 </div>
 </div>
 </div>
 <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
 <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Allowance Guide</h4>
 <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.8 }}>
 <div>✓ Corners: 3&quot; each</div>
 <div>✓ Join overlap: 12–18&quot;</div>
 <div>✓ Safety: 6–18&quot;</div>
 <div>✓ Total extra: ~30–42&quot;</div>
 </div>
 </div>
 <div className="glass-card related-tools">
 <h4>Related Tools</h4>
 <a href="/quilt/binding-calculator" className="related-tool-link">Binding Calculator</a>
 <a href="/quilt/binding-strip-width" className="related-tool-link">Binding Strip Width</a>
 <a href="/quilt/binding-yardage" className="related-tool-link">Binding Yardage</a>
 <a href="/quilt/backing-calculator" className="related-tool-link">Backing Calculator</a>
 <a href="/quilt" className="related-tool-link">All Quilt Tools</a>
 </div>
 </aside>
 </div>
 </div>
 );
}