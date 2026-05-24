"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, ChevronDown, BookOpen } from "lucide-react";

/* ──── DATA ──── */
type Bed = { name: string; mw: number; mh: number };
const US: Bed[] = [
 { name: "Crib", mw: 28, mh: 52 }, { name: "Toddler", mw: 28, mh: 52 },
 { name: "Twin", mw: 38, mh: 75 }, { name: "Twin XL", mw: 38, mh: 80 },
 { name: "Full / Double", mw: 54, mh: 75 }, { name: "Queen", mw: 60, mh: 80 },
 { name: "Olympic Queen", mw: 66, mh: 80 }, { name: "King", mw: 76, mh: 80 },
 { name: "Cal King", mw: 72, mh: 84 }, { name: "Wyoming King", mw: 84, mh: 84 },
 { name: "Alaskan King", mw: 108, mh: 108 },
];
const UK: Bed[] = [
 { name: "UK Single", mw: 36, mh: 75 }, { name: "UK Small Dbl", mw: 48, mh: 75 },
 { name: "UK Double", mw: 54, mh: 75 }, { name: "UK King", mw: 60, mh: 78 },
 { name: "UK Super King", mw: 72, mh: 78 },
];
const EU: Bed[] = [
 { name: "EU Single", mw: 35, mh: 79 }, { name: "EU Double", mw: 55, mh: 79 },
 { name: "EU Queen", mw: 63, mh: 79 }, { name: "EU King", mw: 71, mh: 79 },
];
const AU: Bed[] = [
 { name: "AU Single", mw: 36, mh: 74 }, { name: "AU King Single", mw: 41, mh: 80 },
 { name: "AU Double", mw: 54, mh: 74 }, { name: "AU Queen", mw: 60, mh: 80 },
 { name: "AU King", mw: 72, mh: 80 }, { name: "AU Super King", mw: 80, mh: 80 },
];

const throwSizes = [
 { name: "Compact throw", w: 50, h: 60, use: "Sofa arm, travel" },
 { name: "Standard throw", w: 54, h: 72, use: "Sofa, lap, gift" },
 { name: "Generous throw", w: 60, h: 80, use: "Cuddle, full coverage" },
 { name: "XL throw (2 people)", w: 72, h: 90, use: "Sharing on sofa" },
];

const babySizes = [
 { name: "Crib standard", w: 36, h: 52 }, { name: "Crib with drop", w: 45, h: 60 },
 { name: "Mini crib", w: 24, h: 38 }, { name: "Bassinet", w: 14, h: 29 },
 { name: "Stroller", w: 30, h: 36 }, { name: "Play mat", w: 36, h: 45 },
 { name: "Toddler bed", w: 42, h: 52 }, { name: "Receiving blanket", w: 34, h: 34 },
];

const wallSizes = [
 { name: "Mini", w: 12, h: 12 }, { name: "Small", w: 18, h: 18 },
 { name: "Medium", w: 30, h: 30 }, { name: "Large", w: 48, h: 60 },
 { name: "Statement", w: 60, h: 72 },
];

const battingRef = [
 { quilt: "Baby / Crib", size: "45\" × 60\"", precut: "Crib: 45\" × 60\" ✓" },
 { quilt: "Throw", size: "60\" × 72\"", precut: "Twin: 72\" × 90\"" },
 { quilt: "Twin", size: "72\" × 90\"", precut: "Twin: 72\" × 90\" ✓" },
 { quilt: "Full", size: "81\" × 96\"", precut: "Full: 81\" × 96\" ✓" },
 { quilt: "Queen", size: "90\" × 108\"", precut: "Queen: 90\" × 108\" ✓" },
 { quilt: "King", size: "120\" × 120\"", precut: "King: 120\" × 120\" ✓" },
];

const patternDecoder = [
 { label: "Baby", dims: "36\" × 45\"", best: "Crib or stroller" },
 { label: "Lap / Throw", dims: "54\" × 72\"", best: "Sofa use, twin no drop" },
 { label: "Throw", dims: "60\" × 80\"", best: "Generous lap, twin bed" },
 { label: "Twin", dims: "60\" × 80\"", best: "Twin bed, small drop" },
 { label: "Full / Double", dims: "72\" × 90\"", best: "Full bed, moderate drop" },
 { label: "Queen", dims: "84\" × 92\"", best: "Queen bed, moderate drop" },
 { label: "King", dims: "100\" × 108\"", best: "King bed, moderate drop" },
];

const dropGuide = [
 { drop: "0\"", best: "Mattress-top only, uses bed skirt" },
 { drop: "6\"–8\"", best: "Low platform beds, covers mattress sides" },
 { drop: "10\"–12\"", best: "Standard platform beds" },
 { drop: "14\"–16\"", best: "Traditional beds with box spring" },
 { drop: "18\"–21\"", best: "Vintage / antique beds, near-floor" },
];

const pillowGuide = [
 { option: "No coverage", add: "0\"" },
 { option: "Partial tuck", add: "6\"–8\"" },
 { option: "Full tuck", add: "10\"–12\"" },
 { option: "Drape over pillows", add: "20\"–24\"" },
];

const faqItems = [
 { q: "What size is a standard queen quilt?", a: "A standard queen quilt top is approximately 84\" × 92\" (without drop). With a 14\" drop on a 60\" × 80\" queen mattress, the recommended size is 88\" × 94\". With 16\" drop: 92\" × 96\"." },
 { q: "What size quilt do I need for a king bed?", a: "A king mattress is 76\" × 80\". Standard quilt top: 100\" × 108\". With 14\" drop: 104\" × 94\". With 16\" drop: 108\" × 96\". Use our calculator above with your preferred drop length." },
 { q: "How much should a quilt hang over the sides of a bed?", a: "This is called 'drop.' Common choices: 10\"–12\" (covers mattress sides, platform bed), 14\"–16\" (covers box spring, classic look), 18\"+ (near-floor, vintage look). Measure from mattress top to where you want the quilt to end." },
 { q: "What is the difference between a throw and a lap quilt?", a: "A throw (50\"–60\" × 60\"–72\") is sized for draping over sofa backs and general use. A lap quilt (54\"–60\" × 72\"–80\") is slightly larger, designed to cover your lap while seated. Both are non-bed quilts." },
 { q: "What size is a standard baby quilt?", a: "Standard crib quilt: 36\" × 52\". Stroller quilt: 30\" × 36\". Play mat: 36\" × 45\". Important: loose blankets in cribs are a SIDS risk for babies under 12 months — follow safe sleep guidelines." },
 { q: "What size batting do I need for a queen quilt?", a: "For a queen quilt, use Queen-size batting (90\" × 108\"). The batting must be 2\"–4\" larger than the quilt top on all sides for quilting margin. Pre-cut queen batting is widely available." },
 { q: "Is a UK king the same as a US king?", a: "No! A UK King (60\" × 78\") is roughly the same as a US Queen (60\" × 80\"). A US King (76\" × 80\") is much wider. For UK beds, use the UK size chart — using US sizes will result in a quilt that doesn't fit." },
 { q: "What size quilt covers pillows?", a: "Add length for pillow coverage: partial tuck (6\"–8\" extra), full tuck (10\"–12\" extra), drape over pillows (20\"–24\" extra). Most quilters add 10\" for a standard pillow tuck." },
 { q: "What is a standard throw quilt size?", a: "The most common throw quilt size is 54\" × 72\" (standard). Other options: compact (50\" × 60\"), generous (60\" × 80\"), XL for sharing (72\" × 90\"). Pattern designers vary, so always check actual dimensions." },
 { q: "How do I measure my bed for a quilt?", a: "Measure: 1) Mattress width and length (top only). 2) Mattress depth/thickness. 3) Distance from mattress top to where you want quilt to end (drop). Quilt width = mattress width + (2 × drop). Quilt length = mattress length + foot drop + pillow allowance." },
 { q: "What size quilt fits a twin XL bed?", a: "Twin XL mattress: 38\" × 80\" (5\" longer than regular twin). Standard quilt: 60\" × 85\". With 14\" drop: 66\" × 94\". Common in college dorms — the extra 5\" in length matters for tall sleepers." },
 { q: "How big should a wall hanging quilt be?", a: "Rule of thumb: wall hanging should be ⅔ to ¾ the width of the furniture below it. Common sizes: small (12\"–18\"), medium (24\"–36\"), large (36\"–60\"), statement (60\"+). Add 4\" at top for hanging sleeve." },
];

export default function Page() {
 const [tab, setTab] = useState<"bed" | "throw" | "baby" | "wall">("bed");
 const [region, setRegion] = useState<"us" | "uk" | "eu" | "au">("us");
 const [mattIdx, setMattIdx] = useState(5); // Queen
 const [customW, setCustomW] = useState(60); const [customH, setCustomH] = useState(80);
 const [dropSide, setDropSide] = useState(14);
 const [dropFoot, setDropFoot] = useState(14);
 const [pillowAdd, setPillowAdd] = useState(10);
 const [showDecoder, setShowDecoder] = useState(false);
 const [showBatting, setShowBatting] = useState(false);
 const [showDrop, setShowDrop] = useState(false);
 const [showEdu, setShowEdu] = useState(false);
 const [activeFaq, setActiveFaq] = useState<number | null>(null);

 const beds = region === "uk" ? UK : region === "eu" ? EU : region === "au" ? AU : US;
 const matt = beds[mattIdx] || beds[0];
 const mw = matt ? matt.mw : customW;
 const mh = matt ? matt.mh : customH;

 const calc = useMemo(() =>{
 const quiltW = mw + dropSide * 2;
 const quiltH = mh + dropFoot + pillowAdd;
 return { quiltW, quiltH };
 }, [mw, mh, dropSide, dropFoot, pillowAdd]);

 const tH = { padding: "5px 8px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left" as const, fontSize: 11, fontWeight: 600 as const };
 const tD = { padding: "4px 8px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11 };

 const copyText = `${matt?.name || "Custom"}: Mattress ${mw}"×${mh}", Drop ${dropSide}", Pillow +${pillowAdd}". Recommended quilt: ${calc.quiltW}" × ${calc.quiltH}".`;

 return (
 <div className="container">
 <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "Standard Quilt Sizes" }]} />
 <div className="calculator-layout">
 <div className="calculator-main">
 <div className={styles.toolHeader}>
 <span className="category-badge"><BookOpen size={14} strokeWidth={1.5} />Quilt #133</span>
 <h1>Standard Quilt Size Reference &amp; Calculator</h1>
 <p>Find the perfect quilt size for any bed, throw, baby quilt, or wall hanging. Includes US, UK, European &amp; Australian mattress sizes, drop lengths, pillow tuck, batting reference, and pattern size decoder.</p>
 </div>

 {/* TAB SELECTOR */}
 <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
 {([["bed", " Bed Quilt"], ["throw", "️ Throw / Lap"], ["baby", " Baby Quilt"], ["wall", "️ Wall Hanging"]] as const).map(([k, label]) =>(
 <button key={k} className={`btn ${tab === k ? "btn-primary" : "btn-secondary"}`} onClick={() =>setTab(k)} style={{ fontSize: 12 }}>{label}</button>
 ))}
 </div>

 {/* ═══ BED QUILT ═══ */}
 {tab === "bed" && (<>
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>① Mattress Size</h2>
 <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
 {([["us", "US"], ["uk", "UK"], ["eu", "EU"], ["au", "AU"]] as const).map(([k, l]) =>(
 <button key={k} className={`btn btn-sm ${region === k ? "btn-primary" : "btn-ghost"}`} onClick={() =>{ setRegion(k); setMattIdx(0); }} style={{ fontSize: 10 }}>{l}</button>
 ))}
 </div>
 <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginBottom: 6 }}>
 {beds.map((b, i) =>(
 <button key={i} className={`btn btn-sm ${mattIdx === i ? "btn-primary" : "btn-ghost"}`} onClick={() =>setMattIdx(i)} style={{ fontSize: 9 }}>{b.name}</button>
 ))}
 </div>
 <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Mattress: <strong>{mw}&quot; × {mh}&quot;</strong>({(mw * 2.54).toFixed(0)} × {(mh * 2.54).toFixed(0)} cm)</div>
 </div>

 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>② Drop &amp; Pillow</h2>
 <div className="calculator-form-row">
 <div className="input-group"><label className="input-label">Side drop (each side)</label>
 <input type="number" className="input-field" value={dropSide} onChange={e =>setDropSide(Math.max(0, parseInt(e.target.value) || 0))} min={0} /></div>
 <div className="input-group"><label className="input-label">Foot drop</label>
 <input type="number" className="input-field" value={dropFoot} onChange={e =>setDropFoot(Math.max(0, parseInt(e.target.value) || 0))} min={0} /></div>
 <div className="input-group"><label className="input-label">Pillow tuck</label>
 <input type="number" className="input-field" value={pillowAdd} onChange={e =>setPillowAdd(Math.max(0, parseInt(e.target.value) || 0))} min={0} /></div>
 </div>
 <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 4 }}>
 {[0, 8, 12, 14, 16, 18].map(d =>(
 <button key={d} className={`btn btn-sm ${dropSide === d ? "btn-primary" : "btn-ghost"}`} onClick={() =>{ setDropSide(d); setDropFoot(d); }} style={{ fontSize: 9 }}>{d}&quot; drop</button>
 ))}
 </div>
 </div>

 {/* RESULT */}
 <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(160,50%,40%)" }}>
 <h2 className={styles.calcTitle}>Your Recommended Quilt Size</h2>
 <div className="result-card" style={{ textAlign: "center", padding: 16 }}>
 <div className="result-prefix">{matt?.name || "Custom"} — {dropSide}&quot; drop, {pillowAdd}&quot; pillow tuck</div>
 <div className="result-value" style={{ fontSize: 36 }}>{calc.quiltW}&quot; × {calc.quiltH}&quot;</div>
 <div className="result-label">{(calc.quiltW * 2.54).toFixed(0)} × {(calc.quiltH * 2.54).toFixed(0)} cm</div>
 </div>
 <div className={styles.resultDetails} style={{ marginTop: 8 }}>
 <div className="result-row"><span>Mattress width</span><strong>{mw}&quot;</strong></div>
 <div className="result-row"><span>+ Side drop × 2</span><strong>+ {dropSide * 2}&quot;</strong></div>
 <div className="result-row"><span>= Quilt width</span><strong>{calc.quiltW}&quot;</strong></div>
 <div className="result-row" style={{ borderTop: "1px solid hsl(0,0%,90%)", marginTop: 4, paddingTop: 4 }}><span>Mattress length</span><strong>{mh}&quot;</strong></div>
 <div className="result-row"><span>+ Foot drop</span><strong>+ {dropFoot}&quot;</strong></div>
 <div className="result-row"><span>+ Pillow tuck</span><strong>+ {pillowAdd}&quot;</strong></div>
 <div className="result-row"><span>= Quilt length</span><strong>{calc.quiltH}&quot;</strong></div>
 </div>
 </div>
 </>)}

 {/* ═══ THROW / LAP ═══ */}
 {tab === "throw" && (
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>Throw &amp; Lap Quilt Sizes</h2>
 <div style={{ overflowX: "auto" }}>
 <table style={{ fontSize: 12, borderCollapse: "collapse", width: "100%" }}>
 <thead><tr><th style={tH}>Name</th><th style={tH}>Size</th><th style={tH}>Best For</th></tr></thead>
 <tbody>{throwSizes.map((t, i) =>(
 <tr key={i}><td style={{ ...tD, fontWeight: 600 }}>{t.name}</td><td style={tD}>{t.w}&quot; × {t.h}&quot;</td><td style={tD}>{t.use}</td></tr>
 ))}</tbody>
 </table>
 </div>
 </div>
 )}

 {/* ═══ BABY ═══ */}
 {tab === "baby" && (
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>Baby &amp; Crib Quilt Sizes</h2>
 <div style={{ padding: 8, background: "hsl(0,30%,96%)", borderRadius: 6, fontSize: 11, marginBottom: 10, color: "hsl(0,60%,40%)", fontWeight: 600 }}>
 ⚠ Safety: Loose quilts in cribs are a SIDS risk for babies under 12 months. Always follow safe sleep guidelines from your pediatrician.
 </div>
 <div style={{ overflowX: "auto" }}>
 <table style={{ fontSize: 12, borderCollapse: "collapse", width: "100%" }}>
 <thead><tr><th style={tH}>Type</th><th style={tH}>Size</th></tr></thead>
 <tbody>{babySizes.map((b, i) =>(
 <tr key={i}><td style={{ ...tD, fontWeight: 600 }}>{b.name}</td><td style={tD}>{b.w}&quot; × {b.h}&quot;</td></tr>
 ))}</tbody>
 </table>
 </div>
 </div>
 )}

 {/* ═══ WALL ═══ */}
 {tab === "wall" && (
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>Wall Hanging Sizes</h2>
 <div style={{ overflowX: "auto" }}>
 <table style={{ fontSize: 12, borderCollapse: "collapse", width: "100%" }}>
 <thead><tr><th style={tH}>Category</th><th style={tH}>Size</th></tr></thead>
 <tbody>{wallSizes.map((w, i) =>(
 <tr key={i}><td style={{ ...tD, fontWeight: 600 }}>{w.name}</td><td style={tD}>{w.w}&quot; × {w.h}&quot;</td></tr>
 ))}</tbody>
 </table>
 </div>
 <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 6 }}>Tip: Add 4&quot; to top for hanging sleeve. Wall hanging should be ⅔–¾ the width of furniture below it.</div>
 </div>
 )}

 {/* Toolbar */}
 {tab === "bed" && (
 <div className="toolbar" style={{ marginBottom: 10 }}>
 <button className="btn btn-secondary btn-sm" onClick={() =>navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} />Copy</button>
 <button className="btn btn-secondary btn-sm" onClick={() =>window.print()}><Printer size={13} />Print</button>
 </div>
 )}

 {/* ═══ US STANDARD SIZES TABLE ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>US Standard Quilt Sizes</h2>
 <div style={{ overflowX: "auto" }}>
 <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
 <thead><tr><th style={tH}>Name</th><th style={tH}>Mattress</th><th style={tH}>Quilt Top</th><th style={tH}>+14&quot; Drop</th><th style={tH}>+16&quot; Drop</th><th style={tH}>Batting</th></tr></thead>
 <tbody>
 <tr><td style={{ ...tD, fontWeight: 600 }}>Crib</td><td style={tD}>28×52</td><td style={tD}>36×52</td><td style={tD}>—</td><td style={tD}>—</td><td style={tD}>45×60</td></tr>
 <tr><td style={{ ...tD, fontWeight: 600 }}>Throw</td><td style={tD}>N/A</td><td style={tD}>50×65</td><td style={tD}>N/A</td><td style={tD}>N/A</td><td style={tD}>60×72</td></tr>
 <tr><td style={{ ...tD, fontWeight: 600 }}>Twin</td><td style={tD}>38×75</td><td style={tD}>60×80</td><td style={tD}>66×89</td><td style={tD}>70×91</td><td style={tD}>72×90</td></tr>
 <tr><td style={{ ...tD, fontWeight: 600 }}>Twin XL</td><td style={tD}>38×80</td><td style={tD}>60×85</td><td style={tD}>66×94</td><td style={tD}>70×96</td><td style={tD}>72×90</td></tr>
 <tr><td style={{ ...tD, fontWeight: 600 }}>Full</td><td style={tD}>54×75</td><td style={tD}>72×84</td><td style={tD}>82×89</td><td style={tD}>86×91</td><td style={tD}>81×96</td></tr>
 <tr style={{ background: tab === "bed" && matt?.name === "Queen" ? "hsl(160,15%,93%)" : undefined }}><td style={{ ...tD, fontWeight: 600 }}>Queen</td><td style={tD}>60×80</td><td style={tD}>84×92</td><td style={tD}>88×94</td><td style={tD}>92×96</td><td style={tD}>90×108</td></tr>
 <tr><td style={{ ...tD, fontWeight: 600 }}>King</td><td style={tD}>76×80</td><td style={tD}>100×108</td><td style={tD}>104×94</td><td style={tD}>108×96</td><td style={tD}>120×120</td></tr>
 <tr><td style={{ ...tD, fontWeight: 600 }}>Cal King</td><td style={tD}>72×84</td><td style={tD}>104×108</td><td style={tD}>100×98</td><td style={tD}>104×100</td><td style={tD}>120×120</td></tr>
 </tbody>
 </table>
 </div>
 </div>

 {/* ═══ INTERNATIONAL SIZES ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>International Mattress Sizes</h2>
 <div style={{ overflowX: "auto" }}>
 <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
 <thead><tr><th style={tH}>Name</th><th style={tH}>Mattress (in)</th><th style={tH}>Mattress (cm)</th></tr></thead>
 <tbody>
 {[...UK, ...EU, ...AU].map((b, i) =>(
 <tr key={i}><td style={{ ...tD, fontWeight: 600 }}>{b.name}</td><td style={tD}>{b.mw}&quot;×{b.mh}&quot;</td><td style={tD}>{Math.round(b.mw * 2.54)}×{Math.round(b.mh * 2.54)} cm</td></tr>
 ))}
 </tbody>
 </table>
 </div>
 <div style={{ fontSize: 11, color: "hsl(0,60%,45%)", marginTop: 4, fontWeight: 600 }}>⚠ UK King (60&quot;×78&quot;) ≈ US Queen — NOT US King!</div>
 </div>

 {/* ═══ BATTING REF ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowBatting(!showBatting)}>Batting Size Reference
 <ChevronDown size={14} style={{ transform: showBatting ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showBatting && (
 <div style={{ marginTop: 10, overflowX: "auto" }}>
 <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
 <thead><tr><th style={tH}>Quilt</th><th style={tH}>Batting Size</th><th style={tH}>Pre-Cut Available</th></tr></thead>
 <tbody>{battingRef.map((b, i) =>(
 <tr key={i}><td style={{ ...tD, fontWeight: 600 }}>{b.quilt}</td><td style={tD}>{b.size}</td><td style={tD}>{b.precut}</td></tr>
 ))}</tbody>
 </table>
 <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 4 }}>Batting should be 2&quot;–4&quot; larger than quilt top on each side.</div>
 </div>
 )}
 </div>

 {/* ═══ PATTERN DECODER ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowDecoder(!showDecoder)}>
 ️ Pattern Size Decoder
 <ChevronDown size={14} style={{ transform: showDecoder ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showDecoder && (
 <div style={{ marginTop: 10, overflowX: "auto" }}>
 <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
 <thead><tr><th style={tH}>Label</th><th style={tH}>Typical Dims</th><th style={tH}>Best For</th></tr></thead>
 <tbody>{patternDecoder.map((p, i) =>(
 <tr key={i}><td style={{ ...tD, fontWeight: 600 }}>{p.label}</td><td style={tD}>{p.dims}</td><td style={tD}>{p.best}</td></tr>
 ))}</tbody>
 </table>
 <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 4 }}>Pattern sizes vary by designer — always check actual finished dimensions.</div>
 </div>
 )}
 </div>

 {/* ═══ DROP & PILLOW GUIDE ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowDrop(!showDrop)}>Drop Length &amp; Pillow Guide
 <ChevronDown size={14} style={{ transform: showDrop ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showDrop && (
 <div style={{ marginTop: 10, fontSize: 12 }}>
 <strong style={{ fontSize: 13 }}>Drop Lengths</strong>
 <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%", marginTop: 4 }}>
 <thead><tr><th style={tH}>Drop</th><th style={tH}>Best For</th></tr></thead>
 <tbody>{dropGuide.map((d, i) =>(
 <tr key={i}><td style={{ ...tD, fontWeight: 600 }}>{d.drop}</td><td style={tD}>{d.best}</td></tr>
 ))}</tbody>
 </table>
 <strong style={{ fontSize: 13, display: "block", marginTop: 10 }}>Pillow Coverage</strong>
 <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%", marginTop: 4 }}>
 <thead><tr><th style={tH}>Option</th><th style={tH}>Add to Length</th></tr></thead>
 <tbody>{pillowGuide.map((p, i) =>(
 <tr key={i}><td style={{ ...tD, fontWeight: 600 }}>{p.option}</td><td style={tD}>{p.add}</td></tr>
 ))}</tbody>
 </table>
 </div>
 )}
 </div>

 {/* ═══ EDUCATIONAL ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowEdu(!showEdu)}>Understanding Quilt Sizing
 <ChevronDown size={14} style={{ transform: showEdu ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showEdu && (
 <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.9, color: "var(--color-text-secondary)" }}>
 <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>Why Quilts Aren&apos;t Mattress-Sized</h4>
 <p style={{ fontSize: 12 }}>A quilt must be larger than the mattress to drape over the sides. The total quilt width = mattress width + (2 × side drop). The total length = mattress length + foot drop + pillow allowance. A queen mattress (60&quot;×80&quot;) with 14&quot; drop becomes an 88&quot;×104&quot; quilt.</p>

 <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 10 }}>International Size Warning</h4>
 <p style={{ fontSize: 12 }}>A UK &quot;King&quot; (60&quot;×78&quot;) is roughly a US Queen. A US &quot;King&quot; (76&quot;×80&quot;) is much wider. If making a quilt as a gift internationally, always confirm the actual mattress dimensions — size labels differ significantly between countries.</p>

 <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 10 }}>Pattern Size Labels</h4>
 <p style={{ fontSize: 12 }}>When a pattern says &quot;Queen size,&quot; it typically means 84&quot;×92&quot; — which provides about 12&quot; drop with no pillow tuck on a queen mattress. If you want more drop or pillow coverage, you&apos;ll need to add blocks. Our Pattern Size Decoder shows what each label typically means.</p>
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
 {tab === "bed" && (
 <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
 <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Your Quilt</h4>
 <div style={{ fontSize: 12, lineHeight: 2.2, color: "var(--color-text-secondary)" }}>
 <div>Mattress: <strong>{matt?.name}</strong></div>
 <div>{mw}&quot; × {mh}&quot;</div>
 <div>Drop: <strong>{dropSide}&quot;</strong></div>
 <div>Pillow: <strong>+{pillowAdd}&quot;</strong></div>
 <div style={{ borderTop: "1px solid hsl(0,0%,90%)", paddingTop: 4, marginTop: 4, fontSize: 16, fontWeight: 800, color: "hsl(160,50%,35%)" }}>
 {calc.quiltW}&quot; × {calc.quiltH}&quot;
 </div>
 </div>
 </div>
 )}
 <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
 <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Quick Sizes</h4>
 <div style={{ fontSize: 11, padding: 8, background: "hsl(0,0%,96%)", borderRadius: 6, lineHeight: 2, fontFamily: "monospace" }}>Baby: 36×52<br />Throw: 54×72<br />Twin: 60×80<br />Full: 72×84<br />Queen: 84×92<br />King: 100×108
 </div>
 </div>
 <div className="glass-card related-tools">
 <h4>Related Tools</h4>
 <a href="/quilt/size-calculator" className="related-tool-link">Quilt Size Calculator</a>
 <a href="/quilt/blocks-needed" className="related-tool-link">Blocks Needed</a>
 <a href="/quilt/backing-calculator" className="related-tool-link">Backing Calculator</a>
 <a href="/quilt/batting-calculator" className="related-tool-link">Batting Calculator</a>
 <a href="/quilt/binding-calculator" className="related-tool-link">Binding Calculator</a>
 <a href="/quilt" className="related-tool-link">All Quilt Tools</a>
 </div>
 </aside>
 </div>
 </div>
 );
}