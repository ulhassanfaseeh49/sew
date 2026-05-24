"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, FileText, ChevronDown } from "lucide-react";

/* ─── helpers ──────────────────────────────────── */
function toFrac(v: number): string {
 const w = Math.floor(v);
 const r = v - w;
 const m: [number, string][] = [[0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
 for (const [t, s] of m) if (Math.abs(r - t) < 0.02) return w >0 ? `${w}${s}` : s;
 if (r < 0.05) return `${w}`;
 return v.toFixed(2);
}
const ceilQ = (v: number, q = 0.25) =>Math.ceil(v / q) * q;
const roundN = (v: number, d = 2) =>Math.round(v * 10 ** d) / 10 ** d;

/* ─── constants ──────────────────────────────────── */
const SA_OPTIONS = [
 { value: 0.5, label: '½" (experienced)', desc: "Experienced, simple shapes" },
 { value: 0.75, label: '¾" (standard)', desc: "Recommended for most quilters" },
 { value: 1, label: '1" (beginner)', desc: "Forgiving for beginners" },
 { value: 1.25, label: '1¼" (very generous)', desc: "Complex shapes or first-timers" },
];

const BLOCK_SIZES = [6, 8, 10, 12, 15, 18, 20, 24];

const RESIZE_SIZES = [6, 8, 10, 12, 15, 18];

const PIECE_REF = [
 { sw: 1, sh: 2 }, { sw: 2, sh: 3 }, { sw: 2, sh: 4 },
 { sw: 3, sh: 4 }, { sw: 3, sh: 5 }, { sw: 4, sh: 6 },
 { sw: 4, sh: 8 }, { sw: 5, sh: 10 },
];

const BLOCK_EST = [
 { type: "Flying Geese (FPP)", sections: 3, colors: 2, yd: 0.1 },
 { type: "Simple Star Point", sections: "5-8", colors: "2-3", yd: 0.15 },
 { type: "Mariner's Compass 8-pt", sections: "8+center", colors: "2-3", yd: 0.35 },
 { type: "Mariner's Compass 16-pt", sections: "16+center", colors: "3-4", yd: 0.6 },
 { type: "Complex Feather", sections: "20-30", colors: "2-3", yd: 0.5 },
 { type: "Pineapple Log Cabin", sections: "24-32", colors: "3-4", yd: 0.75 },
];

/* ─── component ──────────────────────────────────── */
export default function Page() {
 const [mode, setMode] = useState<"B" | "A" | "C" | "D">("B");

 // Mode B: Fabric Piece Size
 const [secW, setSecW] = useState(2.5);
 const [secH, setSecH] = useState(5.5);
 const [sa, setSa] = useState(0.75);
 const [secCount, setSecCount] = useState(4);

 // Mode A: Print Verification
 const [statedSize, setStatedSize] = useState(12);
 const [printedSize, setPrintedSize] = useState(11.7);

 // Mode C: Yardage
 const [blockSize, setBlockSize] = useState(12);
 const [numBlocks, setNumBlocks] = useState(20);
 const [sections, setSections] = useState(8);
 const [fabricWidth, setFabricWidth] = useState(42);
 const [colorSections, setColorSections] = useState([4, 4]);

 // Mode D: Resize
 const [origSize, setOrigSize] = useState(12);
 const [targetSize, setTargetSize] = useState(15);

 const [activeFaq, setActiveFaq] = useState<number | null>(null);
 const [showRef, setShowRef] = useState(false);
 const [showResizeRef, setShowResizeRef] = useState(false);
 const [showProcess, setShowProcess] = useState(false);
 const [showTrouble, setShowTrouble] = useState(false);
 const [showEstimates, setShowEstimates] = useState(false);

 /* ─── Mode B calculations ─── */
 const fabricPiece = useMemo(() =>{
 const cutW = secW + sa * 2;
 const cutH = secH + sa * 2;
 return { cutW: roundN(cutW), cutH: roundN(cutH) };
 }, [secW, secH, sa]);

 /* ─── Mode A calculations ─── */
 const printVerify = useMemo(() =>{
 if (statedSize <= 0 || printedSize <= 0) return null;
 const printedPct = roundN((printedSize / statedSize) * 100, 1);
 const isCorrect = Math.abs(printedPct - 100) < 1;
 const correctPct = roundN((statedSize / printedSize) * 100, 1);
 const diff = roundN(Math.abs(statedSize - printedSize), 2);
 return { printedPct, isCorrect, correctPct, diff };
 }, [statedSize, printedSize]);

 /* ─── Mode C calculations ─── */
 const yardageCalc = useMemo(() =>{
 const usableW = fabricWidth - 1;
 // Estimate section size from block size and section count
 const avgSectionW = blockSize / Math.sqrt(sections) + sa * 2;
 const avgSectionH = blockSize / Math.sqrt(sections) + sa * 2;

 return colorSections.map((cs, i) =>{
 const totalPieces = cs * numBlocks;
 const perStrip = Math.max(1, Math.floor(usableW / avgSectionW));
 const strips = Math.ceil(totalPieces / perStrip);
 const inches = strips * avgSectionH;
 const yd = roundN(inches / 36, 2);
 const buy = ceilQ(yd + 0.05);
 return { color: String.fromCharCode(65 + i), pieces: cs, total: totalPieces, perStrip, strips, yd, buy, cutW: roundN(avgSectionW), cutH: roundN(avgSectionH) };
 });
 }, [blockSize, numBlocks, sections, fabricWidth, colorSections, sa]);

 /* ─── Mode D calculations ─── */
 const resizeCalc = useMemo(() =>{
 if (origSize <= 0) return null;
 const pct = roundN((targetSize / origSize) * 100, 1);
 const scaledSA = roundN(0.25 * targetSize / origSize, 3);
 return { pct, scaledSA };
 }, [origSize, targetSize]);

 /* ─── Copy text ─── */
 const copyText = mode === "B"
 ? `FPP Fabric Piece: template section ${toFrac(secW)}" × ${toFrac(secH)}" → cut at ${toFrac(fabricPiece.cutW)}" × ${toFrac(fabricPiece.cutH)}" (${toFrac(sa)}" seam allowance per edge). ${secCount} pieces needed.`
 : mode === "A"
 ? `FPP Print Verification: stated ${statedSize}", printed ${printedSize}". ${printVerify?.isCorrect ? "Correct!" : `Printed at ${printVerify?.printedPct}%. Reprint at ${printVerify?.correctPct}%.`}`
 : mode === "D"
 ? `FPP Resize: ${origSize}" → ${targetSize}". Print at ${resizeCalc?.pct}%.`
 : `FPP Yardage: ${numBlocks} blocks at ${blockSize}". ${yardageCalc.map(c =>`Color ${c.color}: buy ${toFrac(c.buy)} yd`).join(", ")}.`;

 /* FAQ */
 const faqItems = [
 { q: "What is Foundation Paper Piecing?", a: "Foundation Paper Piecing (FPP) is a precision quilting technique where fabric is sewn directly to a paper template. The paper acts as a foundation that stabilizes fabric and ensures perfect points and angles. You sew numbered sections in order from the paper side, then remove the paper afterward. It creates blocks that would be nearly impossible with traditional cutting methods." },
 { q: "How big do I cut fabric for FPP?", a: `Cut each fabric piece with generous seam allowance beyond the template section size. Formula: fabric width = section width + (seam allowance × 2). For a ${toFrac(secW)}" × ${toFrac(secH)}" section with ${toFrac(sa)}" seam allowance: cut at ${toFrac(fabricPiece.cutW)}" × ${toFrac(fabricPiece.cutH)}". Standard seam allowance is ¾" per edge; beginners should use 1".` },
 { q: "How do I verify my FPP template printed at the right size?", a: "Measure the printed block size and compare to the stated finished size. If the pattern says 12\" and your print measures 11.7\", it printed at 97.5%. To fix this: reprint with \"Actual Size\" or \"100%\" selected (not \"Fit to Page\"). Alternatively, print at 102.6% to compensate. Always test with one page before printing all." },
 { q: "What seam allowance do I use for FPP?", a: `FPP uses more generous seam allowance than standard quilting. Standard FPP: ¾" per edge. Beginners: 1" per edge. Experienced: ½" per edge. Complex shapes: 1" to 1¼". The extra allowance compensates for placement error and ensures fabric covers each section after flipping. You trim the excess after sewing each piece.` },
 { q: "Why does FPP need larger fabric pieces?", a: "In FPP, fabric is placed on the blank (back) side of the paper and sewn from the printed (front) side. After stitching on the line, you flip the fabric to cover the section. If the piece were exactly section-size, there would be no seam allowance, and slight placement errors would leave gaps. The generous cut size is the price of precision — excess is trimmed away after each step." },
 { q: "How do I resize an FPP pattern?", a: `Divide target size by original size and multiply by 100 to get the percentage. For example: ${targetSize}" from ${origSize}" = (${targetSize} ÷ ${origSize}) × 100 = ${resizeCalc?.pct}%. Print your PDF at ${resizeCalc?.pct}% scale. Note: seam allowance also scales — original ¼" becomes ${toFrac(resizeCalc?.scaledSA || 0)}". You may want to redraw seam lines at standard ¼".` },
 { q: "What paper should I use for Foundation Paper Piecing?", a: "Standard copy paper (20 lb bond) is ideal — easy to sew through and tears away cleanly. Vellum paper is semi-transparent, making fabric placement easier. Tear-away stabilizer also works well. Do NOT use card stock (too thick, hard to remove) or newsprint (ink transfers to fabric). The key is paper that perforates well with short stitches." },
 { q: "What stitch length for FPP?", a: "Use 1.5–1.8mm stitch length — shorter than standard quilting (2.5mm). Shorter stitches perforate the paper more densely, making it tear away much more easily. They also hold seams more securely during paper removal. Don't go below 1mm — too many perforations can make the paper disintegrate before you're done sewing." },
 { q: "How do I remove paper after Foundation Paper Piecing?", a: "Remove paper AFTER blocks are sewn together — the seams stabilize bias edges. The short stitch perforations make paper tear along seam lines. Pull paper away gently — don't jerk. Use tweezers for small bits. Spraying lightly with water first can make paper easier to tear. Press the block after removal." },
 { q: "Why won't my FPP fabric cover the section after flipping?", a: "The fabric piece is too small or was mispositioned. Solution: remove stitching with a seam ripper, cut a larger piece (add ½\" more), and reposition ensuring fabric overlaps the seam line by at least ¾\" before sewing. Prevention: hold the piece up to light before sewing to verify coverage." },
 { q: "How do I calculate yardage for FPP blocks?", a: `Count sections per color, multiply by blocks needed, then calculate strips from your fabric width. For ${numBlocks} blocks with ${colorSections[0]} sections of Color A: ${colorSections[0] * numBlocks} total pieces. FPP uses 20-40% more fabric than traditional methods due to generous seam allowances — this is normal.` },
 { q: "What is the numbered order for FPP?", a: "FPP sections are sewn in strict numbered order (1, 2, 3, …). Each new section shares a seam with the previous section. The designer numbers sections to ensure proper fabric coverage. Never skip sections or sew out of order — section 3 relies on section 2's seam for proper placement." },
 ];

 /* Color management */
 const addColor = () =>{ if (colorSections.length < 6) setColorSections([...colorSections, 2]); };
 const removeColor = () =>{ if (colorSections.length >1) setColorSections(colorSections.slice(0, -1)); };
 const updateColor = (i: number, v: number) =>{ const n = [...colorSections]; n[i] = v; setColorSections(n); };

 return (
 <div className="container">
 <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "FPP Size Calculator" }]} />
 <div className="calculator-layout">
 <div className="calculator-main">
 {/* HEADER */}
 <div className={styles.toolHeader}>
 <span className="category-badge"><FileText size={14} strokeWidth={1.5} />Quilt #158</span>
 <h1>Foundation Paper Piecing (FPP) Calculator</h1>
 <p>Calculate fabric piece sizes, verify template print accuracy, plan yardage, and resize FPP patterns. Includes seam allowance guidance, construction instructions, and troubleshooting for all skill levels.</p>
 </div>

 {/* MODE SELECTOR */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>What Are You Calculating?</h2>
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
 {[
 { m: "B" as const, icon: "✂️", label: "Fabric Piece Sizes", desc: "How big do I cut each piece?" },
 { m: "A" as const, icon: "", label: "Print Verification", desc: "Did my template print right?" },
 { m: "C" as const, icon: "", label: "Yardage Calculator", desc: "How much fabric total?" },
 { m: "D" as const, icon: "", label: "Pattern Resize", desc: "Change to a different size" },
 ].map(t =>(
 <button key={t.m} className={`btn btn-sm ${mode === t.m ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setMode(t.m)} style={{ textAlign: "left", padding: "8px 12px" }}>
 <div style={{ fontSize: 13 }}>{t.icon} {t.label}</div>
 <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>{t.desc}</div>
 </button>
 ))}
 </div>
 </div>

 {/* ═══ MODE B: FABRIC PIECE SIZE ═══ */}
 {mode === "B" && (
 <>
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>① Template Section Size</h2>
 <div className="calculator-form-row">
 <div className="input-group"><label className="input-label">Section width (on template)</label>
 <input type="number" className="input-field" value={secW} onChange={e =>setSecW(parseFloat(e.target.value) || 1)} min={0.5} max={24} step={0.25} /></div>
 <div className="input-group"><label className="input-label">Section height (on template)</label>
 <input type="number" className="input-field" value={secH} onChange={e =>setSecH(parseFloat(e.target.value) || 1)} min={0.5} max={24} step={0.25} /></div>
 </div>
 <div className="calculator-form-row" style={{ marginTop: 8 }}>
 <div className="input-group"><label className="input-label">FPP seam allowance per edge</label>
 <select className="input-field" value={sa} onChange={e =>setSa(parseFloat(e.target.value))}>
 {SA_OPTIONS.map(o =><option key={o.value} value={o.value}>{o.label} — {o.desc}</option>)}
 </select></div>
 <div className="input-group"><label className="input-label">Pieces of this size</label>
 <input type="number" className="input-field" value={secCount} onChange={e =>setSecCount(parseInt(e.target.value) || 1)} min={1} max={100} /></div>
 </div>
 </div>

 {/* Result */}
 <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(150,60%,40%)" }}>
 <h2 className={styles.calcTitle}>Cut Fabric at:</h2>
 <div className="result-card" style={{ marginBottom: 8 }}>
 <div className="result-value">{toFrac(fabricPiece.cutW)}&quot; × {toFrac(fabricPiece.cutH)}&quot;</div>
 <div className="result-label">Cut {secCount} pieces at this size</div>
 </div>
 <div style={{ padding: 10, background: "hsl(200,20%,97%)", borderRadius: 6, fontSize: 12, lineHeight: 1.8 }}>
 <div><strong>Formula:</strong>Width = {toFrac(secW)} + ({toFrac(sa)} × 2) = {toFrac(secW)} + {toFrac(sa * 2)} = <strong>{toFrac(fabricPiece.cutW)}&quot;</strong></div>
 <div>Height = {toFrac(secH)} + ({toFrac(sa)} × 2) = {toFrac(secH)} + {toFrac(sa * 2)} = <strong>{toFrac(fabricPiece.cutH)}&quot;</strong></div>
 </div>
 <div style={{ marginTop: 8, padding: 8, background: "hsl(45,30%,96%)", borderRadius: 6, fontSize: 12, color: "var(--color-text-secondary)" }}>The {toFrac(sa)}&quot; on each side ensures fabric fully covers the section after sewing and flipping. Excess is trimmed away after stitching — this waste is the price of precision!
 </div>
 </div>
 </>
 )}

 {/* ═══ MODE A: PRINT VERIFICATION ═══ */}
 {mode === "A" && (
 <>
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>① Print Size Check</h2>
 <div className="calculator-form-row">
 <div className="input-group"><label className="input-label">Pattern states finished size (inches)</label>
 <input type="number" className="input-field" value={statedSize} onChange={e =>setStatedSize(parseFloat(e.target.value) || 6)} min={1} max={36} step={0.5} /></div>
 <div className="input-group"><label className="input-label">Your print measures (inches)</label>
 <input type="number" className="input-field" value={printedSize} onChange={e =>setPrintedSize(parseFloat(e.target.value) || 1)} min={0.5} max={36} step={0.1} /></div>
 </div>
 <div style={{ fontSize: 12, marginTop: 6, color: "var(--color-text-tertiary)" }}>Measure the block outline on your printed template, or a 1&quot; reference line if included.
 </div>
 </div>

 {printVerify && (
 <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: `4px solid ${printVerify.isCorrect ? "hsl(150,60%,40%)" : "hsl(0,60%,50%)"}` }}>
 <h2 className={styles.calcTitle}>Print Verification Result</h2>
 <div className="result-card" style={{ marginBottom: 8 }}>
 <div className="result-value" style={{ color: printVerify.isCorrect ? "hsl(150,60%,35%)" : "hsl(0,60%,45%)" }}>
 {printVerify.isCorrect ? "✓ Correct Print Size!" : `✗ Incorrect — ${printVerify.printedPct}%`}
 </div>
 <div className="result-label">
 {printVerify.isCorrect
 ? `Your template printed at ${printVerify.printedPct}% — within tolerance`
 : `Off by ${toFrac(printVerify.diff)}" — reprint at ${printVerify.correctPct}%`}
 </div>
 </div>
 {!printVerify.isCorrect && (
 <div style={{ padding: 10, background: "hsl(0,20%,97%)", borderRadius: 6, fontSize: 12, lineHeight: 1.8 }}>
 <strong>How to fix:</strong>
 <ol style={{ paddingLeft: 18, margin: "4px 0 0" }}>
 <li>In PDF Print Settings: change from &quot;Fit to Page&quot; to &quot;Actual Size&quot; or &quot;100%&quot;</li>
 <li>OR: set Custom Scale to <strong>{printVerify.correctPct}%</strong></li>
 <li>Print one test page first and measure before printing all pages</li>
 </ol>
 </div>
 )}
 </div>
 )}
 </>
 )}

 {/* ═══ MODE C: YARDAGE ═══ */}
 {mode === "C" && (
 <>
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>① FPP Block Details</h2>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
 {BLOCK_SIZES.map(bs =>(
 <button key={bs} className={`btn btn-sm ${blockSize === bs ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setBlockSize(bs)}>{bs}&quot;</button>
 ))}
 </div>
 <div className="calculator-form-row">
 <div className="input-group"><label className="input-label">Finished block size</label>
 <input type="number" className="input-field" value={blockSize} onChange={e =>setBlockSize(parseFloat(e.target.value) || 6)} min={3} max={36} step={0.5} /></div>
 <div className="input-group"><label className="input-label">Sections per block</label>
 <input type="number" className="input-field" value={sections} onChange={e =>setSections(parseInt(e.target.value) || 4)} min={2} max={60} /></div>
 </div>
 <div className="calculator-form-row">
 <div className="input-group"><label className="input-label">Number of blocks</label>
 <input type="number" className="input-field" value={numBlocks} onChange={e =>setNumBlocks(parseInt(e.target.value) || 1)} min={1} max={100} /></div>
 <div className="input-group"><label className="input-label">Fabric width</label>
 <select className="input-field" value={fabricWidth} onChange={e =>setFabricWidth(parseInt(e.target.value))}>
 <option value={42}>42&quot;</option><option value={44}>44&quot;</option><option value={60}>60&quot;</option>
 </select></div>
 </div>
 </div>

 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>② Color Distribution</h2>
 <div style={{ fontSize: 12, marginBottom: 6, color: "var(--color-text-secondary)" }}>How many sections use each fabric color?
 <span style={{ float: "right" }}>Total: {colorSections.reduce((a, b) =>a + b, 0)} / {sections}</span>
 </div>
 {colorSections.map((cs, i) =>(
 <div key={i} className="calculator-form-row" style={{ marginBottom: 4 }}>
 <div className="input-group" style={{ flex: 0 }}>
 <span style={{ fontSize: 13, fontWeight: 600, minWidth: 65 }}>Color {String.fromCharCode(65 + i)}</span>
 </div>
 <div className="input-group">
 <input type="number" className="input-field" value={cs} onChange={e =>updateColor(i, parseInt(e.target.value) || 1)} min={1} max={sections} />
 </div>
 </div>
 ))}
 <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
 <button className="btn btn-sm btn-secondary" onClick={addColor} disabled={colorSections.length >= 6}>+ Add Color</button>
 <button className="btn btn-sm btn-secondary" onClick={removeColor} disabled={colorSections.length <= 1}>− Remove</button>
 </div>
 </div>

 {/* Yardage results */}
 <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(150,60%,40%)" }}>
 <h2 className={styles.calcTitle}>FPP Yardage — {numBlocks} Blocks</h2>
 {yardageCalc.map((c, i) =>(
 <div key={i} style={{ padding: 10, background: i % 2 === 0 ? "hsl(200,15%,97%)" : "hsl(150,15%,97%)", borderRadius: 6, marginBottom: 6, fontSize: 12, lineHeight: 1.8 }}>
 <div style={{ fontWeight: 700, color: i % 2 === 0 ? "hsl(200,60%,35%)" : "hsl(150,60%,35%)" }}>Color {c.color} — {c.pieces} sections/block × {numBlocks} = {c.total} pieces
 </div>
 <div>Est. piece size: ~{toFrac(c.cutW)}&quot; × ~{toFrac(c.cutH)}&quot; (with {toFrac(sa)}&quot; SA)</div>
 <div>{c.perStrip}/strip × {c.strips} strips = {roundN(c.yd)} yd</div>
 <div style={{ fontWeight: 600, color: "hsl(150,60%,35%)" }}>Buy: {toFrac(c.buy)} yd</div>
 </div>
 ))}
 <div style={{ padding: 8, background: "hsl(45,30%,96%)", borderRadius: 6, fontSize: 11, color: "var(--color-text-secondary)" }}>
 ⚠ FPP uses 20-40% more fabric than traditional methods due to generous seam allowances. This is normal — excess is trimmed after each step.
 </div>
 </div>
 </>
 )}

 {/* ═══ MODE D: RESIZE ═══ */}
 {mode === "D" && (
 <>
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>① Resize Your FPP Pattern</h2>
 <div className="calculator-form-row">
 <div className="input-group"><label className="input-label">Original finished size (inches)</label>
 <input type="number" className="input-field" value={origSize} onChange={e =>setOrigSize(parseFloat(e.target.value) || 6)} min={2} max={36} step={0.5} /></div>
 <div className="input-group"><label className="input-label">Target finished size (inches)</label>
 <input type="number" className="input-field" value={targetSize} onChange={e =>setTargetSize(parseFloat(e.target.value) || 6)} min={2} max={36} step={0.5} /></div>
 </div>
 </div>

 {resizeCalc && (
 <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(150,60%,40%)" }}>
 <h2 className={styles.calcTitle}>Resize Result</h2>
 <div className="result-card" style={{ marginBottom: 8 }}>
 <div className="result-value">Print at {resizeCalc.pct}%</div>
 <div className="result-label">{origSize}&quot; → {targetSize}&quot; ({targetSize >origSize ? "enlarging" : "reducing"})</div>
 </div>
 <div style={{ padding: 10, background: "hsl(200,20%,97%)", borderRadius: 6, fontSize: 12, lineHeight: 1.8 }}>
 <div><strong>Formula:</strong>({targetSize} ÷ {origSize}) × 100 = <strong>{resizeCalc.pct}%</strong></div>
 <div style={{ marginTop: 4 }}><strong>In PDF settings:</strong>Custom Scale = {resizeCalc.pct}%</div>
 <div><strong>On copy machine:</strong>Zoom = {resizeCalc.pct}%</div>
 </div>
 <div style={{ marginTop: 8, padding: 8, background: "hsl(45,30%,96%)", borderRadius: 6, fontSize: 12 }}>
 <strong>⚠ Seam allowance note:</strong>Original ¼&quot; seam allowance will scale to {toFrac(resizeCalc.scaledSA)}&quot;.
 You may want to redraw seam allowance lines at standard ¼&quot;.
 </div>
 <div style={{ marginTop: 6, fontSize: 12, color: "var(--color-text-secondary)" }}>
 <strong>After printing — verify:</strong>Block outline should measure exactly {targetSize}&quot; × {targetSize}&quot;.
 {origSize !== targetSize && <span>Original 1&quot; reference line should now measure {toFrac(roundN(targetSize / origSize, 2))}&quot;.</span>}
 </div>
 </div>
 )}
 </>
 )}

 {/* Toolbar */}
 <div className="toolbar" style={{ marginBottom: 16 }}>
 <button className="btn btn-secondary btn-sm" onClick={() =>navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} />Copy</button>
 <button className="btn btn-secondary btn-sm" onClick={() =>window.print()}><Printer size={13} />Print</button>
 </div>

 {/* ═══ PIECE SIZE REFERENCE TABLE ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
 onClick={() =>setShowRef(!showRef)}>FPP Piece Size Reference
 <ChevronDown size={14} style={{ transform: showRef ? "rotate(180deg)" : "none", transition: "0.2s" }} />
 </button>
 {showRef && (
 <div style={{ marginTop: 10, overflowX: "auto" }}>
 <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}>
 <thead><tr style={{ borderBottom: "2px solid hsl(0,0%,85%)" }}>
 <th style={{ textAlign: "left", padding: "5px 4px" }}>Section</th>
 <th style={{ textAlign: "left", padding: "5px 4px" }}>+½&quot; SA</th>
 <th style={{ textAlign: "left", padding: "5px 4px" }}>+¾&quot; SA</th>
 <th style={{ textAlign: "left", padding: "5px 4px" }}>+1&quot; SA</th>
 </tr></thead>
 <tbody>
 {PIECE_REF.map((r, i) =>(
 <tr key={i} style={{ borderBottom: "1px solid hsl(0,0%,92%)" }}>
 <td style={{ padding: "4px 4px" }}>{r.sw}&quot;×{r.sh}&quot;</td>
 <td style={{ padding: "4px 4px" }}>{r.sw + 1}&quot;×{r.sh + 1}&quot;</td>
 <td style={{ padding: "4px 4px", fontWeight: 600 }}>{toFrac(r.sw + 1.5)}&quot;×{toFrac(r.sh + 1.5)}&quot;</td>
 <td style={{ padding: "4px 4px" }}>{r.sw + 2}&quot;×{r.sh + 2}&quot;</td>
 </tr>
 ))}
 </tbody>
 </table>
 <div style={{ fontSize: 10, marginTop: 4, color: "var(--color-text-tertiary)" }}>SA added to EACH edge (×2 per dimension). Round up to nearest useful measure.
 </div>
 </div>
 )}
 </div>

 {/* ═══ RESIZE REFERENCE TABLE ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
 onClick={() =>setShowResizeRef(!showResizeRef)}>Print Percentage Reference
 <ChevronDown size={14} style={{ transform: showResizeRef ? "rotate(180deg)" : "none", transition: "0.2s" }} />
 </button>
 {showResizeRef && (
 <div style={{ marginTop: 10, overflowX: "auto" }}>
 <table style={{ width: "100%", fontSize: 10, borderCollapse: "collapse" }}>
 <thead><tr style={{ borderBottom: "2px solid hsl(0,0%,85%)" }}>
 <th style={{ textAlign: "left", padding: "4px 3px" }}>From↓ To→</th>
 {RESIZE_SIZES.map(s =><th key={s} style={{ textAlign: "right", padding: "4px 3px" }}>{s}&quot;</th>)}
 </tr></thead>
 <tbody>
 {RESIZE_SIZES.map(from =>(
 <tr key={from} style={{ borderBottom: "1px solid hsl(0,0%,92%)" }}>
 <td style={{ padding: "3px 3px", fontWeight: 600 }}>{from}&quot;</td>
 {RESIZE_SIZES.map(to =>{
 const pct = Math.round((to / from) * 100);
 return (
 <td key={to} style={{
 textAlign: "right", padding: "3px 3px",
 fontWeight: pct === 100 ? 700 : 400,
 background: pct === 100 ? "hsl(0,0%,90%)" : undefined,
 }}>{pct}%</td>
 );
 })}
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}
 </div>

 {/* ═══ BLOCK ESTIMATES ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
 onClick={() =>setShowEstimates(!showEstimates)}>Common FPP Block Fabric Estimates
 <ChevronDown size={14} style={{ transform: showEstimates ? "rotate(180deg)" : "none", transition: "0.2s" }} />
 </button>
 {showEstimates && (
 <div style={{ marginTop: 10, overflowX: "auto" }}>
 <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}>
 <thead><tr style={{ borderBottom: "2px solid hsl(0,0%,85%)" }}>
 <th style={{ textAlign: "left", padding: "5px 4px" }}>Block Type</th>
 <th style={{ textAlign: "right", padding: "5px 4px" }}>Sections</th>
 <th style={{ textAlign: "right", padding: "5px 4px" }}>Colors</th>
 <th style={{ textAlign: "right", padding: "5px 4px" }}>~Fabric/Block</th>
 </tr></thead>
 <tbody>
 {BLOCK_EST.map((b, i) =>(
 <tr key={i} style={{ borderBottom: "1px solid hsl(0,0%,92%)" }}>
 <td style={{ padding: "4px 4px" }}>{b.type}</td>
 <td style={{ textAlign: "right", padding: "4px 4px" }}>{b.sections}</td>
 <td style={{ textAlign: "right", padding: "4px 4px" }}>{b.colors}</td>
 <td style={{ textAlign: "right", padding: "4px 4px", fontWeight: 600 }}>{b.yd} yd</td>
 </tr>
 ))}
 </tbody>
 </table>
 <div style={{ fontSize: 10, marginTop: 4, color: "var(--color-text-tertiary)" }}>Estimates for 12&quot; finished blocks. Use the calculator above for precise yardage.
 </div>
 </div>
 )}
 </div>

 {/* ═══ CONSTRUCTION PROCESS ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
 onClick={() =>setShowProcess(!showProcess)}>FPP Construction Process
 <ChevronDown size={14} style={{ transform: showProcess ? "rotate(180deg)" : "none", transition: "0.2s" }} />
 </button>
 {showProcess && (
 <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
 {[
 { step: 1, title: "Place fabric #1 on BLANK side", desc: "Right side up, covering section 1 with at least ¾\" excess on all sides. Hold up to light to verify." },
 { step: 2, title: "Place fabric #2 on top of #1", desc: "RIGHT SIDES TOGETHER (face down). Fabric must overlap the line between sections 1 and 2." },
 { step: 3, title: "Flip & stitch from paper side", desc: "Sew ON the printed line between sections 1 and 2. Use short stitch: 1.5-1.8mm. Extend 2-3 stitches beyond each end." },
 { step: 4, title: "Trim seam allowance to ¼\"", desc: "Fold paper back along stitch line to expose seam. Trim to ¼\" from stitch line." },
 { step: 5, title: "Flip section 2 open & press", desc: "Verify fabric covers entire section 2. If not: remove stitching and use a larger piece." },
 { step: 6, title: "Continue in numbered order", desc: "Section 3, 4, 5… each new section placed RIGHT SIDES TOGETHER against last sewn section." },
 { step: 7, title: "Trim block to outer cutting line", desc: "After all sections sewn, trim to outer line (includes seam allowance). Do NOT remove paper yet." },
 { step: 8, title: "Remove paper after joining blocks", desc: "Seams stabilize bias edges. Pull paper gently. Use tweezers for small bits. Press after removal." },
 ].map(s =>(
 <div key={s.step} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid hsl(0,0%,92%)" }}>
 <span style={{ fontWeight: 700, fontSize: 16, color: "hsl(150,60%,40%)", minWidth: 24, textAlign: "right" }}>{s.step}</span>
 <div>
 <div style={{ fontWeight: 600 }}>{s.title}</div>
 <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>{s.desc}</div>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>

 {/* ═══ TROUBLESHOOTING ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
 onClick={() =>setShowTrouble(!showTrouble)}>FPP Troubleshooting
 <ChevronDown size={14} style={{ transform: showTrouble ? "rotate(180deg)" : "none", transition: "0.2s" }} />
 </button>
 {showTrouble && (
 <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.7, color: "var(--color-text-secondary)" }}>
 {[
 {
 title: "Fabric doesn't cover section after flipping", color: "hsl(0,20%,97%)", titleColor: "hsl(0,60%,45%)",
 desc: "Piece too small or mispositioned. Remove stitching, cut larger (add ½\" more), reposition overlapping seam line by at least ¾\". Prevention: hold up to light before sewing."
 },
 {
 title: "Points not meeting precisely", color: "hsl(40,20%,97%)", titleColor: "hsl(40,60%,40%)",
 desc: "Template printed at wrong size, stitch length too long, or sections sewn out of order. Verify template size, use 1.5mm stitch, and follow numbered order strictly."
 },
 {
 title: "Paper is difficult to remove", color: "hsl(200,20%,97%)", titleColor: "hsl(200,60%,40%)",
 desc: "Stitch length too long or paper too thick. Use 1.5-1.8mm stitches and 20 lb copy paper. Spray lightly with water before removing. Never use card stock."
 },
 {
 title: "Block is warped after paper removal", color: "hsl(280,20%,97%)", titleColor: "hsl(280,60%,40%)",
 desc: "Bias edges not stabilized. Remove paper AFTER joining blocks. Pull gently — don't jerk. Press well and starch before/after removal."
 },
 {
 title: "Fabric is wrong side out after sewing", color: "hsl(150,20%,97%)", titleColor: "hsl(150,60%,40%)",
 desc: "Fabric placed wrong side down against previous section. Always place RIGHT SIDES TOGETHER — say it before each stitch!"
 },
 ].map((p, i) =>(
 <div key={i} style={{ padding: 10, background: p.color, borderRadius: 6, marginBottom: 6 }}>
 <strong style={{ color: p.titleColor }}>{p.title}</strong>
 <p style={{ marginTop: 4 }}>{p.desc}</p>
 </div>
 ))}
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
 <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>FPP Quick Formula</h4>
 <div style={{ fontSize: 12, fontFamily: "monospace", lineHeight: 2, color: "var(--color-text-secondary)" }}>
 <div><strong>Fabric piece =</strong></div>
 <div>W + (SA × 2)</div>
 <div>H + (SA × 2)</div>
 <div style={{ marginTop: 6 }}><strong>SA options:</strong></div>
 <div>½&quot; experienced</div>
 <div>¾&quot; standard</div>
 <div>1&quot; beginner</div>
 <div style={{ marginTop: 6 }}><strong>Stitch:</strong>1.5-1.8mm</div>
 </div>
 </div>
 <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
 <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>FPP Tips</h4>
 <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.9 }}>
 <div>• Sew in numbered order</div>
 <div>• Right sides together</div>
 <div>• Hold to light to check</div>
 <div>• Print at &quot;Actual Size&quot;</div>
 <div>• Use 20 lb copy paper</div>
 <div>• Trim to ¼&quot; after each step</div>
 </div>
 </div>
 <div className="glass-card related-tools">
 <h4>Related Tools</h4>
 <a href="/quilt/flying-geese-calculator" className="related-tool-link">Flying Geese Calculator</a>
 <a href="/quilt/dresden-plate-calculator" className="related-tool-link">Dresden Plate Calculator</a>
 <a href="/quilt/backing-calculator" className="related-tool-link">Backing Calculator</a>
 <a href="/quilt/binding-calculator" className="related-tool-link">Binding Calculator</a>
 <a href="/quilt" className="related-tool-link">All Quilt Tools</a>
 </div>
 </aside>
 </div>
 </div>
 );
}