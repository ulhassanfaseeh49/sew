"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, ChevronDown, Gem } from "lucide-react";

/* ─── CONSTANTS ─── */
const SQ_SIZE = 2.5;
const FIN_SIZE = 2;
const HST_FIN = 1.5;

/* ─── PROJECT REFERENCE ─── */
const projectRef = [
    { name: "Doll quilt (direct squares)", cols: 6, rows: 7, sqPer: 1, blockFin: FIN_SIZE, diff: 1, best: "Quick gift" },
    { name: "Four-patch doll quilt", cols: 2, rows: 5, sqPer: 4, blockFin: 4, diff: 1, best: "Beginner" },
    { name: "Nine-patch wall hanging", cols: 2, rows: 2, sqPer: 9, blockFin: 6, diff: 2, best: "Wall art" },
    { name: "Mug rug (3×4 squares)", cols: 3, rows: 4, sqPer: 1, blockFin: FIN_SIZE, diff: 1, best: "Gifts" },
    { name: "HST mini quilt", cols: 6, rows: 7, sqPer: 1, blockFin: HST_FIN, diff: 3, best: "Advanced" },
];

const packRef: { packs: number; sq: number; fp: number; np: number }[] = [
    { packs: 1, sq: 42, fp: 10, np: 4 },
    { packs: 2, sq: 84, fp: 21, np: 9 },
    { packs: 3, sq: 126, fp: 31, np: 14 },
    { packs: 4, sq: 168, fp: 42, np: 18 },
    { packs: 5, sq: 210, fp: 52, np: 23 },
    { packs: 10, sq: 420, fp: 105, np: 46 },
];

const faqItems = [
    { q: "What is a mini charm pack?", a: "A mini charm pack contains pre-cut 2.5\" × 2.5\" squares — usually 42 squares, one of each fabric in a collection. Also called \"candy squares\" or \"baby charm packs.\" They are the same size as a cross-cut from a jelly roll strip (2.5\" × WOF)." },
    { q: "How many squares in a mini charm pack?", a: "Most mini charm packs contain 42 squares (one per fabric). Some brands have 40 or 36 squares. Moda is the most common brand offering mini charm packs." },
    { q: "What can I make with one mini charm pack?", a: "From 42 squares: a 12\"×14\" doll quilt (direct squares), 10 four-patch blocks (8\"×20\" runner), 3–7 mug rugs, 4 nine-patch blocks (12\"×12\" wall hanging), or 42 cornerstones for a larger quilt. Mini charms are best for small gift projects." },
    { q: "What is the finished size of a mini charm square?", a: "Each 2.5\" square finishes at 2\" × 2\" after seaming (loses ¼\" seam allowance on each side). This is quite small — doll quilt and miniature quilt territory." },
    { q: "How many mini charm packs for a baby quilt?", a: "For a 24\"×30\" baby quilt using direct 2\" squares: 180 squares = 5 packs. Using four-patch blocks (4\" finished): ~30 blocks = 120 squares = 3 packs. Mini charms aren't efficient for large quilts — consider regular charm packs (5\" squares) instead." },
    { q: "What is the difference between mini charm and regular charm?", a: "Regular charm squares are 5\" × 5\" (finish at 4.5\"). Mini charms are 2.5\" × 2.5\" (finish at 2\") — exactly HALF the size in each direction, and only 25% of the area. Regular charms are much more practical for larger quilts." },
    { q: "Can I make HSTs from 2.5\" mini charm squares?", a: "Yes, but the finished HSTs are only 1.5\" × 1.5\" — very tiny! These require precise ¼\" seam allowance and are recommended for intermediate-to-advanced quilters. From 42 squares (21 pairs): 42 tiny HSTs." },
    { q: "How do I use mini charm squares as cornerstones?", a: "Mini charms (2.5\" cut, 2\" finished) are the PERFECT size for cornerstones in quilts with 2\" sashing. Simply use them at sashing intersections. One pack of 42 squares provides enough cornerstones for a 7×8 block quilt layout." },
    { q: "How many mug rugs from a mini charm pack?", a: "A 6\"×8\" mug rug uses 12 mini charm squares (3×4 grid). From 42 squares: 3 complete mug rugs with 6 squares leftover. A smaller 4\"×6\" mug rug uses only 6 squares, giving you 7 mug rugs per pack — great for a gift set!" },
    { q: "Can I make a doll quilt from one mini charm pack?", a: "Yes! From 42 squares: arrange in a 6×7 grid for a 12\"×14\" doll quilt (perfect for American Girl dolls). Or make 10 four-patch blocks for an 8\"×20\" doll quilt. One pack is ideal for small doll quilts." },
];

export default function Page() {
    const [packs, setPacks] = useState(1);
    const [sqPerPack, setSqPerPack] = useState(42);
    const [useIndividual, setUseIndividual] = useState(false);
    const [individualSq, setIndividualSq] = useState(42);
    const [hasJellyRoll, setHasJellyRoll] = useState(false);
    const [showHST, setShowHST] = useState(false);
    const [showCorner, setShowCorner] = useState(false);
    const [showJelly, setShowJelly] = useState(false);
    const [showMugRug, setShowMugRug] = useState(false);
    const [showDoll, setShowDoll] = useState(false);
    const [showFullSize, setShowFullSize] = useState(false);
    const [showEdu, setShowEdu] = useState(false);
    const [cornerCols, setCornerCols] = useState(7);
    const [cornerRows, setCornerRows] = useState(8);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const totalSq = useIndividual ? individualSq : packs * sqPerPack;
    const jellyRollSq = hasJellyRoll ? 40 * Math.floor(42 / SQ_SIZE) * 1 : 0; // 40 strips × 16 sq = 640
    const jellyActual = hasJellyRoll ? 40 * 16 : 0;
    const combinedSq = totalSq + jellyActual;

    // Calculations
    const fourPatch = Math.floor(totalSq / 4);
    const fourPatchLeft = totalSq % 4;
    const ninePatch = Math.floor(totalSq / 9);
    const ninePatchLeft = totalSq % 9;
    const sixteenPatch = Math.floor(totalSq / 16);
    const sixteenPatchLeft = totalSq % 16;
    const hstCount = Math.floor(totalSq / 2) * 2; // pairs
    const pinwheels = Math.floor(hstCount / 4);

    // Mug rugs
    const mugRugLg = Math.floor(totalSq / 12); // 3×4 = 12 squares = 6"×8"
    const mugRugSm = Math.floor(totalSq / 6);  // 2×3 = 6 squares = 4"×6"

    // Cornerstones
    const cornerstones = (cornerCols - 1) * (cornerRows - 1);
    const cornerPacks = Math.ceil(cornerstones / sqPerPack);

    // Best grid layouts from total squares
    const gridLayouts = useMemo(() => {
        const layouts: { c: number; r: number; used: number; w: string; h: string }[] = [];
        for (let c = 3; c <= Math.min(totalSq, 30); c++) {
            const r = Math.floor(totalSq / c);
            if (r >= 2 && c * r <= totalSq) {
                layouts.push({ c, r, used: c * r, w: `${c * FIN_SIZE}`, h: `${r * FIN_SIZE}` });
            }
        }
        return layouts.sort((a, b) => b.used - a.used).slice(0, 6);
    }, [totalSq]);

    const tH = { padding: "5px 8px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left" as const, fontSize: 11, fontWeight: 600 as const };
    const tD = { padding: "4px 8px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11 };
    const tR = { textAlign: "right" as const };

    const copyText = `Mini Charm Pack: ${useIndividual ? individualSq : packs + " pack(s)"} = ${totalSq} squares (2.5"). Four-patches: ${fourPatch}. Nine-patches: ${ninePatch}. Direct grid: ${gridLayouts[0]?.c || 0}×${gridLayouts[0]?.r || 0} = ${gridLayouts[0]?.w || 0}"×${gridLayouts[0]?.h || 0}". Mug rugs (6"×8"): ${mugRugLg}.`;

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "Mini Charm Calculator" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Gem size={14} strokeWidth={1.5} /> Quilt #165</span>
                        <h1>Mini Charm/Candy Pack Calculator</h1>
                        <p>Calculate what you can make from mini charm packs (2.5&quot; squares). Doll quilts, mug rugs, four-patch blocks, cornerstones, HSTs — with honest scale guidance and pack-count planning.</p>
                    </div>

                    {/* ① PACK INPUT */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>① Your Mini Charm Squares</h2>
                        {/* Info box */}
                        <div style={{ padding: 10, background: "hsl(280,15%,97%)", borderRadius: 6, marginBottom: 10, fontSize: 12, lineHeight: 1.8 }}>
                            <strong>Mini charm packs</strong> contain pre-cut <strong>2.5&quot; × 2.5&quot;</strong> squares (finish at 2&quot; × 2&quot;). Usually 42 per pack. Also called &quot;candy squares.&quot; Same size as jelly roll strip cross-cuts.
                        </div>
                        <div style={{ marginBottom: 8 }}>
                            <label style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                                <input type="checkbox" checked={useIndividual} onChange={e => setUseIndividual(e.target.checked)} />
                                I have individual 2.5&quot; squares (not full packs)
                            </label>
                        </div>
                        {useIndividual ? (
                            <div className="input-group">
                                <label className="input-label">Total 2.5&quot; squares</label>
                                <input type="number" className="input-field" value={individualSq} onChange={e => setIndividualSq(Math.max(1, parseInt(e.target.value) || 1))} min={1} />
                            </div>
                        ) : (
                            <div className="calculator-form-row">
                                <div className="input-group">
                                    <label className="input-label">Mini charm packs</label>
                                    <input type="number" className="input-field" value={packs} onChange={e => setPacks(Math.max(1, parseInt(e.target.value) || 1))} min={1} max={100} />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Squares per pack</label>
                                    <select className="input-field" value={sqPerPack} onChange={e => setSqPerPack(parseInt(e.target.value))}>
                                        <option value={42}>42 (standard)</option>
                                        <option value={40}>40</option>
                                        <option value={36}>36</option>
                                    </select>
                                </div>
                            </div>
                        )}
                        <div style={{ marginTop: 8 }}>
                            <label style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                                <input type="checkbox" checked={hasJellyRoll} onChange={e => setHasJellyRoll(e.target.checked)} />
                                I also have a jelly roll from the same collection (+640 squares)
                            </label>
                        </div>
                    </div>

                    {/* ② RESULTS OVERVIEW */}
                    <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(280,50%,55%)" }}>
                        <h2 className={styles.calcTitle}>② What You Can Make</h2>
                        <div style={{ fontSize: 13, marginBottom: 10, padding: 8, background: "hsl(280,15%,97%)", borderRadius: 6 }}>
                            <strong>{totalSq}</strong> squares at 2.5&quot; × 2.5&quot; (finish at 2&quot; × 2&quot;)
                            {hasJellyRoll && <span> + <strong>{jellyActual}</strong> from jelly roll = <strong>{combinedSq}</strong> total</span>}
                        </div>

                        {/* Block projects */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
                            {/* Four-Patch */}
                            <div style={{ padding: 12, background: "hsl(150,15%,97%)", borderRadius: 8, border: "1px solid hsl(150,20%,90%)" }}>
                                <div style={{ fontSize: 13, fontWeight: 700 }}>Four-Patch Blocks</div>
                                <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>4 squares → 4&quot;×4&quot; finished</div>
                                <div style={{ fontSize: 22, fontWeight: 800, color: "hsl(150,50%,35%)", marginTop: 4 }}>{fourPatch} blocks</div>
                                <div style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>{fourPatchLeft} leftover squares</div>
                                <div style={{ fontSize: 10, marginTop: 4 }}>
                                    {fourPatch >= 10 && <span>→ 2×5 = 8&quot;×20&quot; runner</span>}
                                    {fourPatch >= 9 && <span> | 3×3 = 12&quot;×12&quot;</span>}
                                </div>
                            </div>
                            {/* Nine-Patch */}
                            <div style={{ padding: 12, background: "hsl(200,15%,97%)", borderRadius: 8, border: "1px solid hsl(200,20%,90%)" }}>
                                <div style={{ fontSize: 13, fontWeight: 700 }}>Nine-Patch Blocks</div>
                                <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>9 squares → 6&quot;×6&quot; finished</div>
                                <div style={{ fontSize: 22, fontWeight: 800, color: "hsl(200,50%,35%)", marginTop: 4 }}>{ninePatch} blocks</div>
                                <div style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>{ninePatchLeft} leftover squares</div>
                                {ninePatch >= 4 && <div style={{ fontSize: 10, marginTop: 4 }}>→ 2×2 = 12&quot;×12&quot; wall hanging</div>}
                            </div>
                            {/* Direct Grid */}
                            <div style={{ padding: 12, background: "hsl(40,20%,97%)", borderRadius: 8, border: "1px solid hsl(40,20%,90%)" }}>
                                <div style={{ fontSize: 13, fontWeight: 700 }}>Direct Square Grid</div>
                                <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>2&quot; finished squares in grid</div>
                                {gridLayouts.length > 0 && <>
                                    <div style={{ fontSize: 22, fontWeight: 800, color: "hsl(40,60%,35%)", marginTop: 4 }}>{gridLayouts[0].w}&quot;×{gridLayouts[0].h}&quot;</div>
                                    <div style={{ fontSize: 10 }}>{gridLayouts[0].c}×{gridLayouts[0].r} = {gridLayouts[0].used} squares</div>
                                </>}
                            </div>
                            {/* Mug Rugs */}
                            <div style={{ padding: 12, background: "hsl(330,15%,97%)", borderRadius: 8, border: "1px solid hsl(330,20%,90%)" }}>
                                <div style={{ fontSize: 13, fontWeight: 700 }}>Mug Rugs 🎁</div>
                                <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>6&quot;×8&quot; (12 sq each) or 4&quot;×6&quot; (6 sq)</div>
                                <div style={{ fontSize: 22, fontWeight: 800, color: "hsl(330,50%,40%)", marginTop: 4 }}>{mugRugLg}–{mugRugSm}</div>
                                <div style={{ fontSize: 10 }}>Great gift set!</div>
                            </div>
                            {/* Cornerstones */}
                            <div style={{ padding: 12, background: "hsl(0,0%,97%)", borderRadius: 8, border: "1px solid hsl(0,0%,90%)" }}>
                                <div style={{ fontSize: 13, fontWeight: 700 }}>Cornerstones</div>
                                <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>2&quot; sashing cornerstones</div>
                                <div style={{ fontSize: 22, fontWeight: 800, color: "hsl(0,0%,35%)", marginTop: 4 }}>{totalSq}</div>
                                <div style={{ fontSize: 10 }}>Perfect for 2&quot; sashing quilts</div>
                            </div>
                            {/* Sixteen-Patch */}
                            <div style={{ padding: 12, background: "hsl(260,15%,97%)", borderRadius: 8, border: "1px solid hsl(260,20%,90%)" }}>
                                <div style={{ fontSize: 13, fontWeight: 700 }}>Sixteen-Patch Blocks</div>
                                <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>16 squares → 8&quot;×8&quot; finished</div>
                                <div style={{ fontSize: 22, fontWeight: 800, color: "hsl(260,40%,45%)", marginTop: 4 }}>{sixteenPatch} blocks</div>
                                <div style={{ fontSize: 10 }}>{sixteenPatchLeft} leftover</div>
                            </div>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="toolbar" style={{ marginBottom: 10 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} /> Copy</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                    </div>

                    {/* ═══ MUG RUG CALCULATOR ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowMugRug(!showMugRug)}>
                            ☕ Mug Rug Planner (Best Mini Charm Project!)
                            <ChevronDown size={14} style={{ transform: showMugRug ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showMugRug && (
                            <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9 }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                                    <div style={{ padding: 10, background: "hsl(330,15%,97%)", borderRadius: 6, textAlign: "center" }}>
                                        <div style={{ fontWeight: 700, fontSize: 14 }}>Large: 6&quot;×8&quot;</div>
                                        <div style={{ fontSize: 11 }}>3×4 = 12 squares each</div>
                                        <div style={{ fontSize: 20, fontWeight: 800, color: "hsl(330,50%,40%)" }}>{mugRugLg} mug rugs</div>
                                        <div style={{ fontSize: 10 }}>{totalSq - mugRugLg * 12} leftover squares</div>
                                    </div>
                                    <div style={{ padding: 10, background: "hsl(40,15%,97%)", borderRadius: 6, textAlign: "center" }}>
                                        <div style={{ fontWeight: 700, fontSize: 14 }}>Small: 4&quot;×6&quot;</div>
                                        <div style={{ fontSize: 11 }}>2×3 = 6 squares each</div>
                                        <div style={{ fontSize: 20, fontWeight: 800, color: "hsl(40,50%,40%)" }}>{mugRugSm} mug rugs</div>
                                        <div style={{ fontSize: 10 }}>{totalSq - mugRugSm * 6} leftover squares</div>
                                    </div>
                                </div>
                                <div style={{ padding: 8, background: "hsl(0,0%,97%)", borderRadius: 6, fontSize: 11 }}>
                                    <strong>Each mug rug also needs:</strong> backing fabric ({`6"×8" or 4"×6"`}) + batting same size. Great for using small fabric remnants!
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ═══ DOLL QUILT ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowDoll(!showDoll)}>
                            🧸 Doll Quilt Planner
                            <ChevronDown size={14} style={{ transform: showDoll ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showDoll && (
                            <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9 }}>
                                <div style={{ marginBottom: 8, padding: 8, background: "hsl(0,0%,97%)", borderRadius: 6 }}>
                                    <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Standard doll quilt sizes:</div>
                                    <div style={{ fontSize: 11 }}>• Small: 14&quot;×18&quot; (American Girl) • Medium: 18&quot;×24&quot; • Large: 24&quot;×36&quot;</div>
                                </div>
                                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Direct squares (2&quot; finished) — Your {totalSq} squares:</div>
                                <div style={{ overflowX: "auto" }}>
                                    <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
                                        <thead><tr><th style={tH}>Layout</th><th style={{ ...tH, ...tR }}>Squares</th><th style={{ ...tH, ...tR }}>Size</th><th style={tH}>Fit?</th></tr></thead>
                                        <tbody>
                                            {gridLayouts.map((g, i) => (
                                                <tr key={i} style={{ background: g.used <= totalSq ? "hsl(150,20%,97%)" : "hsl(0,20%,97%)" }}>
                                                    <td style={tD}>{g.c}×{g.r}</td>
                                                    <td style={{ ...tD, ...tR }}>{g.used}</td>
                                                    <td style={{ ...tD, ...tR, fontWeight: 600 }}>{g.w}&quot;×{g.h}&quot;</td>
                                                    <td style={tD}>{g.used <= totalSq ? <span style={{ color: "hsl(150,60%,35%)" }}>✓ ({totalSq - g.used} spare)</span> : <span style={{ color: "hsl(0,60%,45%)" }}>✗ need {g.used - totalSq} more</span>}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div style={{ fontSize: 12, fontWeight: 600, marginTop: 10, marginBottom: 6 }}>Four-patch blocks (4&quot; finished):</div>
                                <div style={{ fontSize: 11 }}>
                                    {fourPatch} blocks available:
                                    {fourPatch >= 6 && <span> → 2×3 = 8&quot;×12&quot;</span>}
                                    {fourPatch >= 10 && <span> | 2×5 = 8&quot;×20&quot;</span>}
                                    {fourPatch >= 12 && <span> | 3×4 = 12&quot;×16&quot;</span>}
                                    {fourPatch >= 20 && <span> | 4×5 = 16&quot;×20&quot;</span>}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ═══ HSTs ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowHST(!showHST)}>
                            🔺 HSTs from Mini Charms (Advanced)
                            <ChevronDown size={14} style={{ transform: showHST ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showHST && (
                            <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9 }}>
                                <div style={{ padding: 8, background: "hsl(40,30%,96%)", borderRadius: 6, marginBottom: 8 }}>
                                    ⚠️ <strong>HSTs from 2.5&quot; squares finish at only 1.5&quot; — very tiny!</strong> Requires precise ¼&quot; seam. Recommended for intermediate+ quilters.
                                </div>
                                <div className={styles.resultDetails}>
                                    <div className="result-row"><span>Pairs from {totalSq} squares</span><strong>{Math.floor(totalSq / 2)}</strong></div>
                                    <div className="result-row"><span>HSTs (2 per pair)</span><strong>{hstCount}</strong></div>
                                    <div className="result-row"><span>Finished HST size</span><strong>1½&quot; × 1½&quot;</strong></div>
                                    <div className="result-row"><span>Pinwheel blocks (4 HSTs)</span><strong>{pinwheels} at 3&quot;×3&quot;</strong></div>
                                    <div className="result-row"><span>HST mini quilt (6×7)</span><strong>{hstCount >= 42 ? "9\"×10.5\" ✓" : `Need ${42 - hstCount} more`}</strong></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ═══ CORNERSTONES ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowCorner(!showCorner)}>
                            🔲 Cornerstone Calculator
                            <ChevronDown size={14} style={{ transform: showCorner ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showCorner && (
                            <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9 }}>
                                <div style={{ padding: 8, background: "hsl(0,0%,97%)", borderRadius: 6, marginBottom: 8, fontSize: 11 }}>
                                    Mini charms (2.5&quot; cut, 2&quot; finished) are the <strong>perfect size</strong> for cornerstones in quilts with 2&quot; sashing.
                                </div>
                                <div className="calculator-form-row">
                                    <div className="input-group"><label className="input-label">Blocks across</label>
                                        <input type="number" className="input-field" value={cornerCols} onChange={e => setCornerCols(Math.max(2, parseInt(e.target.value) || 2))} min={2} /></div>
                                    <div className="input-group"><label className="input-label">Blocks down</label>
                                        <input type="number" className="input-field" value={cornerRows} onChange={e => setCornerRows(Math.max(2, parseInt(e.target.value) || 2))} min={2} /></div>
                                </div>
                                <div className={styles.resultDetails} style={{ marginTop: 8 }}>
                                    <div className="result-row"><span>Cornerstones needed</span><strong>{cornerstones}</strong></div>
                                    <div className="result-row"><span>Formula</span><strong>({cornerCols}-1) × ({cornerRows}-1) = {cornerstones}</strong></div>
                                    <div className="result-row"><span>Mini charm packs needed</span><strong style={{ color: "hsl(150,50%,35%)" }}>{cornerPacks} pack{cornerPacks !== 1 ? "s" : ""}</strong></div>
                                    <div className="result-row"><span>Leftover squares</span><strong>{cornerPacks * sqPerPack - cornerstones}</strong></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ═══ JELLY ROLL COMBO ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowJelly(!showJelly)}>
                            🧵 Jelly Roll + Mini Charm Combination
                            <ChevronDown size={14} style={{ transform: showJelly ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showJelly && (
                            <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9 }}>
                                <div style={{ padding: 10, background: "hsl(200,15%,97%)", borderRadius: 6 }}>
                                    <div style={{ fontWeight: 700, marginBottom: 6 }}>From the same collection:</div>
                                    <div>• <strong>1 Jelly Roll:</strong> 40 strips × 2.5&quot; × 42&quot;</div>
                                    <div>• Each strip → 16 squares (42&quot; ÷ 2.5&quot;) = <strong>640 mini charm equivalent squares</strong></div>
                                    <div>• <strong>1 Mini Charm Pack:</strong> {sqPerPack} squares</div>
                                    <div style={{ marginTop: 6, fontWeight: 700, color: "hsl(150,50%,35%)" }}>Combined: {640 + sqPerPack} squares</div>
                                    <div style={{ marginTop: 8, fontSize: 11 }}>
                                        <strong>This is enough for:</strong><br />
                                        • Nine-patch blocks: {Math.floor((640 + sqPerPack) / 9)} blocks → 8×9 layout = 48&quot;×54&quot; throw quilt!<br />
                                        • Four-patch blocks: {Math.floor((640 + sqPerPack) / 4)} blocks<br />
                                        • <strong>Best combo:</strong> Jelly roll strips for blocks/sashing + mini charms for cornerstones
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ═══ PACK REFERENCE TABLE ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Pack Reference Table</h2>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
                                <thead><tr>
                                    <th style={tH}>Packs</th><th style={{ ...tH, ...tR }}>Squares</th><th style={{ ...tH, ...tR }}>Four-Patch</th><th style={{ ...tH, ...tR }}>Nine-Patch</th><th style={{ ...tH, ...tR }}>Direct Grid</th><th style={{ ...tH, ...tR }}>Cornerstones</th>
                                </tr></thead>
                                <tbody>{packRef.map(r => (
                                    <tr key={r.packs} style={{ background: r.packs === packs && !useIndividual ? "hsl(280,20%,95%)" : undefined }}>
                                        <td style={{ ...tD, fontWeight: 600 }}>{r.packs}</td>
                                        <td style={{ ...tD, ...tR }}>{r.sq}</td>
                                        <td style={{ ...tD, ...tR }}>{r.fp} blocks</td>
                                        <td style={{ ...tD, ...tR }}>{r.np} blocks</td>
                                        <td style={{ ...tD, ...tR }}>{r.sq} sq</td>
                                        <td style={{ ...tD, ...tR }}>{r.sq}</td>
                                    </tr>
                                ))}</tbody>
                            </table>
                        </div>
                    </div>

                    {/* ═══ FULL-SIZE QUILT ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowFullSize(!showFullSize)}>
                            ⚠️ Full-Size Quilts from Mini Charms (Not Recommended)
                            <ChevronDown size={14} style={{ transform: showFullSize ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showFullSize && (
                            <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9 }}>
                                <div style={{ padding: 8, background: "hsl(40,30%,96%)", borderRadius: 6, marginBottom: 8 }}>
                                    ⚠️ Mini charm packs are NOT efficient for large quilts. Regular charm packs (5&quot; squares) require ¼ as many packs for the same area.
                                </div>
                                <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
                                    <thead><tr><th style={tH}>Project</th><th style={{ ...tH, ...tR }}>Blocks</th><th style={{ ...tH, ...tR }}>Squares</th><th style={{ ...tH, ...tR }}>Packs</th></tr></thead>
                                    <tbody>
                                        {[["Throw (48\"×60\")", "12×15", 180, 720], ["Queen (84\"×92\")", "21×23", 483, 1932], ["King (96\"×108\")", "24×27", 648, 2592]].map(([name, layout, bl, sq], i) => (
                                            <tr key={i}><td style={tD}>{name as string}</td><td style={{ ...tD, ...tR }}>{bl as number}</td><td style={{ ...tD, ...tR }}>{(sq as number).toLocaleString()}</td><td style={{ ...tD, ...tR, fontWeight: 700, color: "hsl(0,50%,45%)" }}>{Math.ceil((sq as number) / 42)}</td></tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div style={{ marginTop: 8, fontSize: 11, fontWeight: 600, color: "hsl(150,50%,35%)" }}>
                                    ✓ Mini charms are BEST for: mug rugs, doll quilts, cornerstones, and accent squares.
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ═══ EDUCATIONAL ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowEdu(!showEdu)}>
                            📚 Understanding Mini Charms
                            <ChevronDown size={14} style={{ transform: showEdu ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showEdu && (
                            <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.9, color: "var(--color-text-secondary)" }}>
                                <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>Mini vs Regular Charm Comparison</h4>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                                    <div style={{ padding: 10, background: "hsl(280,10%,97%)", borderRadius: 6, textAlign: "center" }}>
                                        <div style={{ fontWeight: 700 }}>Mini Charm</div>
                                        <div style={{ fontSize: 24, fontWeight: 800 }}>2.5&quot;</div>
                                        <div style={{ fontSize: 11 }}>Finishes at 2&quot;</div>
                                        <div style={{ fontSize: 11 }}>Area: 6.25 sq in</div>
                                    </div>
                                    <div style={{ padding: 10, background: "hsl(150,10%,97%)", borderRadius: 6, textAlign: "center" }}>
                                        <div style={{ fontWeight: 700 }}>Regular Charm</div>
                                        <div style={{ fontSize: 24, fontWeight: 800 }}>5&quot;</div>
                                        <div style={{ fontSize: 11 }}>Finishes at 4.5&quot;</div>
                                        <div style={{ fontSize: 11 }}>Area: 25 sq in (4× more!)</div>
                                    </div>
                                </div>
                                <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>The Jelly Roll Connection</h4>
                                <p style={{ fontSize: 12 }}>Mini charms (2.5&quot;) are exactly the same width as jelly roll strips. A cross-cut of a jelly roll strip produces mini charm squares. From the same collection, they coordinate perfectly — use strips for blocks/sashing and mini charms for cornerstones.</p>
                                <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 10 }}>Managing Expectations</h4>
                                <p style={{ fontSize: 12 }}>2&quot; finished squares are very small — mini quilt territory. Full-size quilts require 18+ packs for just a throw. Mini charms shine as small gifts (mug rugs, doll quilts) and as accent pieces (cornerstones, checkerboard borders) in larger quilts.</p>
                            </div>
                        )}
                    </div>

                    {/* FAQ */}
                    <section className="faq-section">
                        <h2>Frequently Asked Questions</h2>
                        <div style={{ marginTop: "1.5rem" }}>
                            {faqItems.map((f, i) => (
                                <div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}>
                                    <button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
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
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Your Squares</h4>
                        <div style={{ fontSize: 12, lineHeight: 2.2, color: "var(--color-text-secondary)" }}>
                            <div>Total: <strong>{totalSq} squares</strong></div>
                            <div>Size: <strong>2.5&quot; × 2.5&quot;</strong></div>
                            <div>Finished: <strong>2&quot; × 2&quot;</strong></div>
                            <div>Four-patches: <strong>{fourPatch}</strong></div>
                            <div>Nine-patches: <strong>{ninePatch}</strong></div>
                            <div>Mug rugs: <strong>{mugRugLg}–{mugRugSm}</strong></div>
                        </div>
                    </div>
                    <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Best Uses</h4>
                        <ol style={{ fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 2, paddingLeft: 16 }}>
                            <li>Mug rugs (gift set!)</li>
                            <li>Doll quilts</li>
                            <li>Cornerstones</li>
                            <li>Four-patch blocks</li>
                            <li>Quilted postcards</li>
                        </ol>
                    </div>
                    <div className="glass-card related-tools">
                        <h4>Related Tools</h4>
                        <a href="/quilt/charm-pack-calculator" className="related-tool-link">Charm Pack Calculator</a>
                        <a href="/quilt/jelly-roll-calculator" className="related-tool-link">Jelly Roll Calculator</a>
                        <a href="/quilt/layer-cake-calculator" className="related-tool-link">Layer Cake Calculator</a>
                        <a href="/quilt/hst-calculator" className="related-tool-link">HST Calculator</a>
                        <a href="/quilt/cornerstone-calculator" className="related-tool-link">Cornerstone Calculator</a>
                        <a href="/quilt/size-calculator" className="related-tool-link">Quilt Size Calculator</a>
                        <a href="/quilt/backing-calculator" className="related-tool-link">Backing Calculator</a>
                        <a href="/quilt/binding-calculator" className="related-tool-link">Binding Calculator</a>
                        <a href="/quilt" className="related-tool-link">All Quilt Tools</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}