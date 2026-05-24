"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, ChevronDown, Scissors } from "lucide-react";

/* helpers */
function toFrac(v: number): string {
 if (v <= 0) return "0";
 const w = Math.floor(v);
 const f = v - w;
 const map: [number, string][] = [[0, ""], [0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
 let best = map[0], bd = 1;
 for (const [n, s] of map) { const d = Math.abs(f - n); if (d < bd) { bd = d; best = [n, s]; } }
 if (Math.abs(f - 1) < bd) return `${w + 1}`;
 if (!best[1]) return `${w || ""}`;
 return w >0 ? `${w}${best[1]}` : `${best[1]}`;
}

const SQ_IN_PER_YARD = 44 * 36; // 1584 sq in
const FQ_SQ_IN = 18 * 22; // 396 sq in

const stdSizes: { name: string; w: number; h: number }[] = [
 { name: "Baby", w: 36, h: 52 },
 { name: "Stroller", w: 30, h: 36 },
 { name: "Throw", w: 54, h: 72 },
 { name: "Lap", w: 60, h: 80 },
 { name: "Twin", w: 60, h: 90 },
 { name: "Full", w: 72, h: 90 },
 { name: "Queen", w: 84, h: 92 },
 { name: "King", w: 100, h: 108 },
];

const wasteMap: Record<string, number>= {
 squares: 0.10, hst: 0.15, strip: 0.15, geese: 0.20, complex: 0.30,
};

const faqItems = [
 { q: "How much fabric do I need for a scrappy quilt?", a: "Think in total area, not yards of one fabric. A throw quilt (54\"×72\") needs about 4.3 yards of total scrap fabric (including 15% waste). A queen needs ~8.5 yards total. Divide by value groups (light/dark) for visual balance." },
 { q: "How do I calculate yardage for a scrappy quilt?", a: "Calculate quilt area (width × height), add waste factor (10–30% depending on block complexity), then convert square inches to yards by dividing by 1,584 (44\" × 36\"). Split the total by your light/dark ratio for balanced sourcing." },
 { q: "How do I know if I have enough scraps for a quilt?", a: "Sort scraps by value (light/dark), then roughly estimate each pile's total area. A loosely stacked 12\"×12\"×4\" pile ≈ 1 yard. Count fat-quarter-sized pieces × 0.25 yards each. Compare your total to the yardage needed for your target quilt size." },
 { q: "What size scraps are useful for quilting?", a: "Keep anything larger than 2.5\" square. For 6\" blocks: need 6.5\"+ pieces. For HSTs: 5\"+ squares. For strip blocks: 2.5\" wide strips. Pieces under 1.5\" are generally too small for quilting but useful for tiny projects." },
 { q: "How much scraps for a throw-size quilt?", a: "About 3.5–4.5 yards total, depending on block complexity. For simple squares: ~3.5 yd. For HST blocks: ~4 yd. For complex blocks: ~5 yd. That's roughly 18 fat quarters worth of fabric." },
 { q: "How do I sort scraps for a scrappy quilt?", a: "Sort by VALUE first (light, medium, dark), not color. Value contrast creates the visual pattern. Within each value group, aim for variety in color, scale, and print type. More different fabrics = better scrappy look." },
 { q: "Can I make a queen-size quilt from scraps?", a: "Yes! A queen quilt needs about 8.5 yards of total scrap fabric — roughly 35 fat quarters' worth. Most experienced quilters accumulate this. If short, supplement with purchased fat quarter bundles to fill gaps in your value distribution." },
 { q: "How do I convert a pattern to scrappy?", a: "When a pattern says '3 yards blue': collect 3 yards of blue total from many fabrics. Keep background fabric consistent (don't make backgrounds scrappy). The total yardage stays the same — you just source it from many fabrics instead of one." },
 { q: "What is a two-value scrappy quilt?", a: "A quilt divided into 'light' and 'dark' categories. Each category uses many different fabrics. The contrast between light and dark creates the pattern. Common ratios: 50/50 (balanced), 60/40 light-heavy (airy), or 40/60 (dramatic)." },
 { q: "How do I calculate rainbow quilt yardage?", a: "Divide total yardage by color families. For 7 colors in equal portions: total ÷ 7 per color. For weighted distribution: assign percentages (e.g., 20% blue, 15% red, etc.) and multiply each by total yardage. Our color family calculator does this automatically." },
];

export default function Page() {
 const [mode, setMode] = useState<"plan" | "assess">("plan");
 const [sizePreset, setSizePreset] = useState("Throw");
 const [customW, setCustomW] = useState(54);
 const [customH, setCustomH] = useState(72);
 const [blockType, setBlockType] = useState("squares");
 const [customWaste, setCustomWaste] = useState(15);
 const [valueMode, setValueMode] = useState<"two" | "three" | "color">("two");
 const [lightPct, setLightPct] = useState(50);
 const [medPct, setMedPct] = useState(0);
 const [bgPct, setBgPct] = useState(0);
 // Assess mode
 const [lightYd, setLightYd] = useState(2.5);
 const [darkYd, setDarkYd] = useState(1.8);
 // Color families
 const [colorFams, setColorFams] = useState([
 { name: "Red", pct: 15 }, { name: "Orange", pct: 10 }, { name: "Yellow", pct: 15 },
 { name: "Green", pct: 20 }, { name: "Blue", pct: 20 }, { name: "Purple", pct: 15 }, { name: "Neutral", pct: 5 },
 ]);
 const [showPieces, setShowPieces] = useState(false);
 const [showReverse, setShowReverse] = useState(false);
 const [showGuild, setShowGuild] = useState(false);
 const [showSupplement, setShowSupplement] = useState(false);
 const [showEdu, setShowEdu] = useState(false);
 const [guildMembers, setGuildMembers] = useState(10);
 const [activeFaq, setActiveFaq] = useState<number | null>(null);

 const sel = stdSizes.find(s =>s.name === sizePreset);
 const qW = sel ? sel.w : customW;
 const qH = sel ? sel.h : customH;
 const wasteBase = wasteMap[blockType] || 0.15;
 const wastePct = customWaste / 100;
 const darkPct = valueMode === "two" ? (100 - lightPct - bgPct) : (valueMode === "three" ? (100 - lightPct - medPct - bgPct) : 0);

 const calc = useMemo(() =>{
 const area = qW * qH;
 const featureArea = area * (1 - bgPct / 100);
 const adjustedArea = featureArea * (1 + wastePct);
 const totalYd = adjustedArea / SQ_IN_PER_YARD;
 const buyYd = Math.ceil(totalYd * 4) / 4 + 0.25;
 const fqs = Math.ceil(adjustedArea / FQ_SQ_IN);
 const bgYd = bgPct >0 ? (area * (bgPct / 100) * (1 + 0.10)) / SQ_IN_PER_YARD : 0;
 const bgBuy = Math.ceil(bgYd * 4) / 4 + 0.25;
 // Value split
 const lYd = totalYd * (lightPct / 100);
 const dYd = totalYd * (darkPct / 100);
 const mYd = valueMode === "three" ? totalYd * (medPct / 100) : 0;
 return { area, featureArea, adjustedArea, totalYd, buyYd, fqs, bgYd, bgBuy, lYd, dYd, mYd };
 }, [qW, qH, wastePct, bgPct, lightPct, darkPct, medPct, valueMode]);

 // Assess
 const assess = useMemo(() =>{
 const totalHave = lightYd + darkYd;
 const lNeed = calc.lYd;
 const dNeed = calc.dYd;
 const lOk = lightYd >= lNeed;
 const dOk = darkYd >= dNeed;
 const lShort = lOk ? 0 : lNeed - lightYd;
 const dShort = dOk ? 0 : dNeed - darkYd;
 return { totalHave, lNeed, dNeed, lOk, dOk, lShort, dShort, enough: lOk && dOk };
 }, [lightYd, darkYd, calc]);

 // Reverse: what can you make?
 const reverseCalc = useMemo(() =>{
 const totalHave = lightYd + darkYd;
 const usable = totalHave * (1 - wastePct) * SQ_IN_PER_YARD;
 return stdSizes.map(s =>{
 const need = s.w * s.h;
 return { ...s, possible: usable >= need, needYd: (need * (1 + wastePct)) / SQ_IN_PER_YARD };
 });
 }, [lightYd, darkYd, wastePct]);

 // Ref table
 const refTable = useMemo(() =>{
 return stdSizes.map(s =>{
 const area = s.w * s.h;
 const adj = area * 1.15;
 const yd = adj / SQ_IN_PER_YARD;
 const buy = Math.ceil(yd * 4) / 4;
 const fq = Math.ceil(adj / FQ_SQ_IN);
 return { ...s, yd, buy, fq, half: yd / 2 };
 });
 }, []);

 const tH = { padding: "5px 8px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left" as const, fontSize: 11, fontWeight: 600 as const };
 const tD = { padding: "4px 8px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11 };

 const copyText = `Scrappy Quilt: ${qW}"×${qH}". Total scraps: ${toFrac(calc.buyYd)} yd (~${calc.fqs} FQs). Light: ${calc.lYd.toFixed(2)} yd, Dark: ${calc.dYd.toFixed(2)} yd. Waste: ${customWaste}%.${bgPct >0 ? ` Background: ${toFrac(calc.bgBuy)} yd.` : ""}`;

 return (
 <div className="container">
 <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "Scrappy Yardage Estimator" }]} />
 <div className="calculator-layout">
 <div className="calculator-main">
 <div className={styles.toolHeader}>
 <span className="category-badge"><Scissors size={14} strokeWidth={1.5} />Quilt #164</span>
 <h1>Scrappy Quilt Yardage Estimator</h1>
 <p>Calculate total scrap fabric needed for any quilt size. Assess your stash, plan two-value or rainbow quilts, convert yardage patterns to scrappy, and find out what size quilt your scraps can make.</p>
 </div>

 {/* ① MODE + SIZE */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>① Quilt Size</h2>
 <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
 {stdSizes.map(s =>(
 <button key={s.name} className={`btn btn-sm ${sizePreset === s.name ? "btn-primary" : "btn-ghost"}`} onClick={() =>setSizePreset(s.name)} style={{ fontSize: 9 }}>
 {s.name}
 </button>
 ))}
 <button className={`btn btn-sm ${sizePreset === "Custom" ? "btn-primary" : "btn-ghost"}`} onClick={() =>setSizePreset("Custom")} style={{ fontSize: 9 }}>Custom</button>
 </div>
 {sizePreset === "Custom" && (
 <div className="calculator-form-row">
 <div className="input-group"><label className="input-label">Width (in)</label>
 <input type="number" className="input-field" value={customW} onChange={e =>setCustomW(Math.max(10, parseInt(e.target.value) || 54))} min={10} /></div>
 <div className="input-group"><label className="input-label">Height (in)</label>
 <input type="number" className="input-field" value={customH} onChange={e =>setCustomH(Math.max(10, parseInt(e.target.value) || 72))} min={10} /></div>
 </div>
 )}
 <div style={{ fontSize: 12, marginTop: 4, color: "var(--color-text-secondary)" }}>Target: <strong>{qW}&quot; × {qH}&quot;</strong>= {(qW * qH).toLocaleString()} sq in</div>
 </div>

 {/* ② BLOCK + WASTE */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>② Block Type &amp; Waste</h2>
 <div className="input-group" style={{ marginBottom: 8 }}>
 <label className="input-label">Block construction</label>
 <select className="input-field" value={blockType} onChange={e =>{ setBlockType(e.target.value); setCustomWaste(Math.round((wasteMap[e.target.value] || 0.15) * 100)); }}>
 <option value="squares">Simple Squares (10% waste)</option>
 <option value="hst">HST / Strip Blocks (15% waste)</option>
 <option value="geese">Flying Geese / Angles (20% waste)</option>
 <option value="complex">Complex / FPP (30% waste)</option>
 </select>
 </div>
 <div className="input-group">
 <label className="input-label">Waste factor (%)</label>
 <input type="number" className="input-field" value={customWaste} onChange={e =>setCustomWaste(Math.max(0, Math.min(50, parseInt(e.target.value) || 15)))} min={0} max={50} />
 <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 2 }}>Includes seam allowances + cutting inefficiency</div>
 </div>
 <div className="input-group" style={{ marginTop: 8 }}>
 <label className="input-label">Consistent background fabric (%)</label>
 <input type="number" className="input-field" value={bgPct} onChange={e =>setBgPct(Math.max(0, Math.min(70, parseInt(e.target.value) || 0)))} min={0} max={70} />
 <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>0% = all scrappy. Set 30–50% for scrappy blocks on solid background.</div>
 </div>
 </div>

 {/* ③ VALUE DISTRIBUTION */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>③ Value Distribution</h2>
 <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
 {([["two", "Light / Dark"], ["three", "Light / Med / Dark"], ["color", "Color Families"]] as const).map(([m, label]) =>(
 <button key={m} className={`btn btn-sm ${valueMode === m ? "btn-primary" : "btn-ghost"}`} onClick={() =>setValueMode(m)} style={{ fontSize: 10 }}>{label}</button>
 ))}
 </div>
 {(valueMode === "two" || valueMode === "three") && (
 <div className="calculator-form-row">
 <div className="input-group"><label className="input-label">Light %</label>
 <input type="number" className="input-field" value={lightPct} onChange={e =>setLightPct(Math.max(0, Math.min(100, parseInt(e.target.value) || 50)))} min={0} max={100} /></div>
 {valueMode === "three" && (
 <div className="input-group"><label className="input-label">Medium %</label>
 <input type="number" className="input-field" value={medPct} onChange={e =>setMedPct(Math.max(0, Math.min(100, parseInt(e.target.value) || 30)))} min={0} max={100} /></div>
 )}
 <div className="input-group"><label className="input-label">Dark %</label>
 <input type="number" className="input-field" value={darkPct} disabled style={{ background: "hsl(0,0%,95%)" }} /></div>
 </div>
 )}
 {valueMode === "color" && (
 <div style={{ fontSize: 12 }}>
 {colorFams.map((cf, i) =>(
 <div key={i} style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 3 }}>
 <span style={{ width: 60, fontSize: 11, fontWeight: 600 }}>{cf.name}</span>
 <input type="number" className="input-field" style={{ width: 60, padding: "3px 6px" }} value={cf.pct} onChange={e =>{
 const arr = [...colorFams]; arr[i] = { ...arr[i], pct: Math.max(0, parseInt(e.target.value) || 0) }; setColorFams(arr);
 }} min={0} max={100} />
 <span style={{ fontSize: 10 }}>% → {(calc.totalYd * cf.pct / 100).toFixed(2)} yd</span>
 </div>
 ))}
 <div style={{ fontSize: 10, color: colorFams.reduce((s, c) =>s + c.pct, 0) === 100 ? "hsl(150,50%,40%)" : "hsl(0,60%,50%)", marginTop: 4 }}>Total: {colorFams.reduce((s, c) =>s + c.pct, 0)}% {colorFams.reduce((s, c) =>s + c.pct, 0) === 100 ? "✓" : "— must equal 100%"}
 </div>
 </div>
 )}
 </div>

 {/* ④ RESULTS */}
 <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(280,50%,50%)" }}>
 <h2 className={styles.calcTitle}>④ Scrappy Yardage Estimate</h2>
 <div className="result-card" style={{ textAlign: "center", padding: 16 }}>
 <div className="result-prefix">{qW}&quot; × {qH}&quot; — {sizePreset !== "Custom" ? sizePreset : "Custom"}</div>
 <div className="result-value" style={{ fontSize: 32 }}>{toFrac(calc.buyYd)} yards total scraps</div>
 <div className="result-label">~{calc.fqs} fat quarters equivalent | {customWaste}% waste</div>
 </div>
 <div className={styles.resultDetails} style={{ marginTop: 8 }}>
 <div className="result-row"><span>Quilt area</span><strong>{(qW * qH).toLocaleString()} sq in</strong></div>
 <div className="result-row"><span>Feature area ({100 - bgPct}%)</span><strong>{Math.round(calc.featureArea).toLocaleString()} sq in</strong></div>
 <div className="result-row"><span>After {customWaste}% waste</span><strong>{Math.round(calc.adjustedArea).toLocaleString()} sq in</strong></div>
 <div className="result-row"><span>Total scrap yardage</span><strong>{calc.totalYd.toFixed(2)} yd → buy {toFrac(calc.buyYd)} yd</strong></div>
 </div>
 {(valueMode === "two" || valueMode === "three") && (
 <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: valueMode === "three" ? "1fr 1fr 1fr" : "1fr 1fr", gap: 8 }}>
 <div style={{ padding: 10, background: "hsl(50,30%,95%)", borderRadius: 6, textAlign: "center" }}>
 <div style={{ fontSize: 10, fontWeight: 600 }}>Light ({lightPct}%)</div>
 <div style={{ fontSize: 20, fontWeight: 800, color: "hsl(40,60%,45%)" }}>{calc.lYd.toFixed(2)} yd</div>
 </div>
 {valueMode === "three" && (
 <div style={{ padding: 10, background: "hsl(0,0%,94%)", borderRadius: 6, textAlign: "center" }}>
 <div style={{ fontSize: 10, fontWeight: 600 }}>Medium ({medPct}%)</div>
 <div style={{ fontSize: 20, fontWeight: 800, color: "hsl(0,0%,50%)" }}>{calc.mYd.toFixed(2)} yd</div>
 </div>
 )}
 <div style={{ padding: 10, background: "hsl(220,20%,92%)", borderRadius: 6, textAlign: "center" }}>
 <div style={{ fontSize: 10, fontWeight: 600 }}>Dark ({darkPct}%)</div>
 <div style={{ fontSize: 20, fontWeight: 800, color: "hsl(220,40%,35%)" }}>{calc.dYd.toFixed(2)} yd</div>
 </div>
 </div>
 )}
 {bgPct >0 && (
 <div style={{ marginTop: 8, padding: 8, background: "hsl(0,0%,97%)", borderRadius: 6, fontSize: 12 }}>
 <strong>Background fabric:</strong>{calc.bgYd.toFixed(2)} yd → buy <strong>{toFrac(calc.bgBuy)} yd</strong>(purchased as yardage, not scraps)
 </div>
 )}
 </div>

 {/* Toolbar */}
 <div className="toolbar" style={{ marginBottom: 10 }}>
 <button className="btn btn-secondary btn-sm" onClick={() =>navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} />Copy</button>
 <button className="btn btn-secondary btn-sm" onClick={() =>window.print()}><Printer size={13} />Print</button>
 </div>

 {/* ═══ STASH ASSESSMENT ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(40,70%,50%)" }}>
 <h2 className={styles.calcTitle}>⑤ Stash Assessment</h2>
 <div className="calculator-form-row" style={{ marginBottom: 8 }}>
 <div className="input-group"><label className="input-label">Your light scraps (yards)</label>
 <input type="number" className="input-field" value={lightYd} onChange={e =>setLightYd(Math.max(0, parseFloat(e.target.value) || 0))} min={0} step={0.25} /></div>
 <div className="input-group"><label className="input-label">Your dark scraps (yards)</label>
 <input type="number" className="input-field" value={darkYd} onChange={e =>setDarkYd(Math.max(0, parseFloat(e.target.value) || 0))} min={0} step={0.25} /></div>
 </div>
 <div style={{ padding: 12, borderRadius: 8, background: assess.enough ? "hsl(150,20%,95%)" : "hsl(40,30%,95%)", textAlign: "center" }}>
 <div style={{ fontSize: 20, fontWeight: 800, color: assess.enough ? "hsl(150,50%,35%)" : "hsl(40,70%,40%)" }}>
 {assess.enough ? "✓ You have enough!" : "⚠ Need more scraps"}
 </div>
 <div style={{ fontSize: 12, marginTop: 4 }}>You have {(lightYd + darkYd).toFixed(1)} yd total | Need {calc.totalYd.toFixed(2)} yd</div>
 </div>
 <div className={styles.resultDetails} style={{ marginTop: 8 }}>
 <div className="result-row">
 <span>Light: have {lightYd} yd, need {calc.lYd.toFixed(2)} yd</span>
 <strong style={{ color: assess.lOk ? "hsl(150,50%,35%)" : "hsl(0,60%,50%)" }}>{assess.lOk ? `✓ surplus ${(lightYd - calc.lYd).toFixed(2)} yd` : `✗ short ${assess.lShort.toFixed(2)} yd`}</strong>
 </div>
 <div className="result-row">
 <span>Dark: have {darkYd} yd, need {calc.dYd.toFixed(2)} yd</span>
 <strong style={{ color: assess.dOk ? "hsl(150,50%,35%)" : "hsl(0,60%,50%)" }}>{assess.dOk ? `✓ surplus ${(darkYd - calc.dYd).toFixed(2)} yd` : `✗ short ${assess.dShort.toFixed(2)} yd`}</strong>
 </div>
 </div>
 </div>

 {/* ═══ REVERSE: what can you make ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowReverse(!showReverse)}>What Can You Make From Your Scraps?
 <ChevronDown size={14} style={{ transform: showReverse ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showReverse && (
 <div style={{ marginTop: 10, overflowX: "auto" }}>
 <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
 <thead><tr><th style={tH}>Size</th><th style={tH}>Dimensions</th><th style={tH}>Needs</th><th style={tH}>Possible?</th></tr></thead>
 <tbody>{reverseCalc.map(r =>(
 <tr key={r.name} style={{ background: r.possible ? "hsl(150,15%,96%)" : undefined }}>
 <td style={{ ...tD, fontWeight: 600 }}>{r.name}</td>
 <td style={tD}>{r.w}&quot;×{r.h}&quot;</td>
 <td style={tD}>{r.needYd.toFixed(2)} yd</td>
 <td style={tD}>
 <span style={{ padding: "1px 6px", borderRadius: 4, fontSize: 10, fontWeight: 600, color: "#fff", background: r.possible ? "hsl(150,50%,40%)" : "hsl(0,40%,55%)" }}>
 {r.possible ? "✓ Yes" : "✗ No"}
 </span>
 </td>
 </tr>
 ))}</tbody>
 </table>
 <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 4 }}>Based on {(lightYd + darkYd).toFixed(1)} yd total scraps with {customWaste}% waste.</div>
 </div>
 )}
 </div>

 {/* ═══ SUPPLEMENT ═══ */}
 {(!assess.lOk || !assess.dOk) && (
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowSupplement(!showSupplement)}>Supplemental Purchase Plan
 <ChevronDown size={14} style={{ transform: showSupplement ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showSupplement && (
 <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9 }}>
 {!assess.lOk && (
 <div style={{ padding: 8, background: "hsl(50,20%,96%)", borderRadius: 6, marginBottom: 6 }}>
 <strong>Light fabrics:</strong>buy {(assess.lShort + 0.25).toFixed(2)} yd ({Math.ceil(assess.lShort / 0.25)} fat quarters of assorted lights)
 </div>
 )}
 {!assess.dOk && (
 <div style={{ padding: 8, background: "hsl(220,15%,96%)", borderRadius: 6, marginBottom: 6 }}>
 <strong>Dark fabrics:</strong>buy {(assess.dShort + 0.25).toFixed(2)} yd ({Math.ceil(assess.dShort / 0.25)} fat quarters of assorted darks)
 </div>
 )}
 <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>Tip: Buy fat quarter bundles for maximum scrappy variety. A 10-FQ bundle ≈ 2.5 yd of coordinated fabrics.
 </div>
 </div>
 )}
 </div>
 )}

 {/* ═══ GUILD GROUP ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowGuild(!showGuild)}>Guild Group Quilt Planner
 <ChevronDown size={14} style={{ transform: showGuild ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showGuild && (
 <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9 }}>
 <div className="input-group" style={{ marginBottom: 8 }}>
 <label className="input-label">Number of members</label>
 <input type="number" className="input-field" value={guildMembers} onChange={e =>setGuildMembers(Math.max(2, parseInt(e.target.value) || 10))} min={2} />
 </div>
 <div className={styles.resultDetails}>
 <div className="result-row"><span>Total needed</span><strong>{calc.totalYd.toFixed(2)} yd</strong></div>
 <div className="result-row"><span>Per member</span><strong>{(calc.totalYd / guildMembers).toFixed(2)} yd (~{Math.ceil((calc.totalYd / guildMembers) / 0.25)} FQ)</strong></div>
 <div className="result-row"><span>Light per member</span><strong>{(calc.lYd / guildMembers).toFixed(2)} yd</strong></div>
 <div className="result-row"><span>Dark per member</span><strong>{(calc.dYd / guildMembers).toFixed(2)} yd</strong></div>
 </div>
 <div style={{ marginTop: 6, padding: 8, background: "hsl(0,0%,97%)", borderRadius: 6, fontSize: 11 }}>
 <strong>Member note:</strong>&quot;Please bring ~{(calc.totalYd / guildMembers).toFixed(2)} yd of mixed fabrics ({(calc.lYd / guildMembers).toFixed(2)} yd light, {(calc.dYd / guildMembers).toFixed(2)} yd dark). Minimum piece size: 5&quot; × 5&quot;.&quot;
 </div>
 </div>
 )}
 </div>

 {/* ═══ REFERENCE TABLE ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>Total Fabric Reference (15% waste, 50/50 split)</h2>
 <div style={{ overflowX: "auto" }}>
 <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
 <thead><tr><th style={tH}>Size</th><th style={tH}>Dims</th><th style={tH}>Total</th><th style={tH}>Lights</th><th style={tH}>Darks</th><th style={tH}>FQs</th></tr></thead>
 <tbody>{refTable.map(r =>{
 const active = r.w === qW && r.h === qH;
 return (
 <tr key={r.name} style={{ background: active ? "hsl(280,15%,93%)" : undefined, cursor: "pointer" }} onClick={() =>setSizePreset(r.name)}>
 <td style={{ ...tD, fontWeight: 600 }}>{r.name}</td>
 <td style={tD}>{r.w}&quot;×{r.h}&quot;</td>
 <td style={{ ...tD, fontWeight: 600 }}>{r.yd.toFixed(1)} yd</td>
 <td style={tD}>{r.half.toFixed(1)} yd</td>
 <td style={tD}>{r.half.toFixed(1)} yd</td>
 <td style={tD}>{r.fq}</td>
 </tr>
 );
 })}</tbody>
 </table>
 </div>
 <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 4 }}>Click a row to select that size. FQs = approximate fat-quarter equivalents.</div>
 </div>

 {/* ═══ EDUCATIONAL ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowEdu(!showEdu)}>Understanding Scrappy Quilts
 <ChevronDown size={14} style={{ transform: showEdu ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showEdu && (
 <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.9, color: "var(--color-text-secondary)" }}>
 <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>Think in Area, Not Yards</h4>
 <p style={{ fontSize: 12 }}>The key insight: a quilt needs a certain TOTAL AREA of fabric regardless of how many fabrics contribute. A throw needs ~4 yards total — from 1 fabric or 40 different pieces, the total stays the same. Focus on the total, not individual pieces.</p>
 <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 10 }}>Value Over Color</h4>
 <p style={{ fontSize: 12 }}>In scrappy quilts, VALUE (light/dark contrast) matters more than color. A mix of reds, blues, and greens at the same darkness level reads as &quot;dark&quot; from a distance. Sort by value first, then sprinkle colors for interest. More variety = better scrappy look.</p>
 <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 10 }}>Assessing Your Stash</h4>
 <p style={{ fontSize: 12 }}>Quick estimate: a loosely rolled 12&quot;×12&quot;×4&quot; pile ≈ 1 yard. Count fat-quarter-sized pieces × 0.25 yd each. Sort into light/medium/dark piles and estimate each. Within 20% accuracy is sufficient for planning. Always budget 15–25% extra for scrappy quilts.</p>
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
 <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Your Scrappy Quilt</h4>
 <div style={{ fontSize: 12, lineHeight: 2.2, color: "var(--color-text-secondary)" }}>
 <div>Size: <strong>{qW}&quot;×{qH}&quot;</strong></div>
 <div>Total: <strong>{toFrac(calc.buyYd)} yd</strong></div>
 <div>~{calc.fqs} fat quarters</div>
 <div>Waste: <strong>{customWaste}%</strong></div>
 {bgPct >0 && <div>Background: <strong>{toFrac(calc.bgBuy)} yd</strong></div>}
 </div>
 </div>
 <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
 <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Quick Rule</h4>
 <div style={{ fontSize: 11, padding: 8, background: "hsl(0,0%,96%)", borderRadius: 6, lineHeight: 2 }}>Baby: ~2 yd<br />Throw: ~4 yd<br />Twin: ~6 yd<br />Queen: ~8.5 yd<br />King: ~12 yd<br />
 <span style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>All assume 15% waste, 50/50 split</span>
 </div>
 </div>
 <div className="glass-card related-tools">
 <h4>Related Tools</h4>
 <a href="/quilt/fat-quarter-calculator" className="related-tool-link">Fat Quarter Calculator</a>
 <a href="/quilt/charm-pack-calculator" className="related-tool-link">Charm Pack Calculator</a>
 <a href="/quilt/backing-calculator" className="related-tool-link">Backing Calculator</a>
 <a href="/quilt/binding-calculator" className="related-tool-link">Binding Calculator</a>
 <a href="/quilt/size-calculator" className="related-tool-link">Quilt Size Calculator</a>
 <a href="/quilt" className="related-tool-link">All Quilt Tools</a>
 </div>
 </aside>
 </div>
 </div>
 );
}