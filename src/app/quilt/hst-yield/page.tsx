"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { BarChart3, ClipboardCopy, Printer, ChevronDown, Plus, Trash2 } from "lucide-react";

/* ─── helpers ──────────────────────────────────── */
function toFrac(v: number): string {
    const w = Math.floor(v);
    const r = v - w;
    const m: [number, string][] = [[0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
    for (const [t, s] of m) if (Math.abs(r - t) < 0.02) return w > 0 ? `${w}${s}` : s;
    if (r < 0.05) return `${w || "0"}`;
    return v.toFixed(2);
}
const roundN = (v: number, d = 2) => Math.round(v * 10 ** d) / 10 ** d;

/* ─── constants ──────────────────────────────────── */
const SIZE_PRESETS = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6];
type Mode = "yield" | "enough" | "multi";

interface FabricPiece {
    id: number; label: string; w: number; h: number; color: "light" | "dark";
}

const PRECUT_TYPES = [
    { name: "Fat Quarter", w: 22, h: 18, emoji: "🟩" },
    { name: "Half Yard", w: 42, h: 18, emoji: "📏" },
    { name: "Quarter Yard", w: 42, h: 9, emoji: "📐" },
    { name: "Charm Square", w: 5, h: 5, emoji: "🔲" },
    { name: "Layer Cake", w: 10, h: 10, emoji: "🟫" },
    { name: "Jelly Roll Strip", w: 42, h: 2.5, emoji: "🎀" },
    { name: "Fat Eighth", w: 22, h: 9, emoji: "🟧" },
    { name: "Full Yard", w: 42, h: 36, emoji: "🧵" },
];

/* Yield calc helper: fabric → squares → HSTs per method */
function calcYield(w: number, h: number, finSize: number, oversize: number) {
    const cut2 = finSize + 0.875 + oversize;
    const cut4 = finSize + 1.25 + oversize;
    const cut8 = finSize * 2 + 1.5 + oversize;

    const sq2 = Math.floor(w / cut2) * Math.floor(h / cut2);
    const sq4 = Math.floor(w / cut4) * Math.floor(h / cut4);
    const sq8 = Math.floor(w / cut8) * Math.floor(h / cut8);

    return {
        cut2: roundN(cut2, 3), cut4: roundN(cut4, 3), cut8: roundN(cut8, 3),
        sq2, sq4, sq8,
        hst2: sq2 * 2, hst4: sq4 * 4, hst8: sq8 * 8,
        area: roundN(w * h),
    };
}

/* ─── Reference tables (spec lines 496-528) ─── */
const FQ_REF = [
    { fin: 1, cut: 1.875, hsts: 143 },
    { fin: 1.5, cut: 2.375, hsts: 90 },
    { fin: 2, cut: 2.875, hsts: 56 },
    { fin: 2.5, cut: 3.375, hsts: 42 },
    { fin: 3, cut: 3.875, hsts: 40 },
    { fin: 3.5, cut: 4.375, hsts: 28 },
    { fin: 4, cut: 4.875, hsts: 20 },
    { fin: 4.5, cut: 5.375, hsts: 20 },
    { fin: 5, cut: 5.875, hsts: 12 },
    { fin: 6, cut: 6.875, hsts: 8 },
];

const YARD_REF = [
    { fin: 2, two: 252, four: 288, eight: 288 },
    { fin: 2.5, two: 180, four: 210, eight: 200 },
    { fin: 3, two: 180, four: 224, eight: 160 },
    { fin: 3.5, two: 110, four: 144, eight: 112 },
    { fin: 4, two: 90, four: 112, eight: 96 },
    { fin: 5, two: 72, four: 84, eight: 72 },
    { fin: 6, two: 42, four: 56, eight: 48 },
];

/* ─── component ──────────────────────────────────── */
export default function Page() {
    const [mode, setMode] = useState<Mode>("yield");
    const [finSize, setFinSize] = useState(3);
    const [fabricW, setFabricW] = useState(22);
    const [fabricH, setFabricH] = useState(18);
    const [oversize, setOversize] = useState(0);
    const [hstsNeeded, setHstsNeeded] = useState(200);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [showRef, setShowRef] = useState(false);
    const [showYardRef, setShowYardRef] = useState(false);
    const [showPrecut, setShowPrecut] = useState(false);
    const [showWhy, setShowWhy] = useState(false);
    const [showScrap, setShowScrap] = useState(false);

    /* Mode C: multiple pieces */
    const [pieces, setPieces] = useState<FabricPiece[]>([
        { id: 1, label: "Fat quarter #1", w: 22, h: 18, color: "light" },
        { id: 2, label: "Fat quarter #1", w: 22, h: 18, color: "dark" },
    ]);
    const [nextId, setNextId] = useState(3);

    const addPiece = (color: "light" | "dark") => {
        setPieces(p => [...p, { id: nextId, label: `Piece #${nextId}`, w: 22, h: 18, color }]);
        setNextId(n => n + 1);
    };
    const removePiece = (id: number) => setPieces(p => p.filter(x => x.id !== id));
    const updatePiece = (id: number, field: keyof FabricPiece, val: string | number) => {
        setPieces(p => p.map(x => x.id === id ? { ...x, [field]: val } : x));
    };

    /* ─── calculations ─── */
    const calc = useMemo(() => {
        const y = calcYield(fabricW, fabricH, finSize, oversize);
        const best = Math.max(y.hst2, y.hst4, y.hst8);
        const bestMethod = best === y.hst4 ? "4-at-a-time" : best === y.hst8 ? "8-at-a-time" : "2-at-a-time";

        // Mode B: enough?
        const enough2 = y.hst2 >= hstsNeeded;
        const enough4 = y.hst4 >= hstsNeeded;
        const enough8 = y.hst8 >= hstsNeeded;
        const surplus2 = y.hst2 - hstsNeeded;
        const surplus4 = y.hst4 - hstsNeeded;
        const surplus8 = y.hst8 - hstsNeeded;

        // Mode C: multi-piece
        const lightPieces = pieces.filter(p => p.color === "light");
        const darkPieces = pieces.filter(p => p.color === "dark");
        const lightSq = lightPieces.reduce((sum, p) => sum + calcYield(p.w, p.h, finSize, oversize).sq2, 0);
        const darkSq = darkPieces.reduce((sum, p) => sum + calcYield(p.w, p.h, finSize, oversize).sq2, 0);
        const limitingSq = Math.min(lightSq, darkSq);
        const multiHst2 = limitingSq * 2;
        const limiting = lightSq <= darkSq ? "light" : "dark";

        // Nearby sizes
        const nearby = [-0.5, 0, 0.5, 1].map(d => {
            const s = finSize + d;
            if (s < 0.5) return null;
            const ny = calcYield(fabricW, fabricH, s, oversize);
            return { fin: s, hst2: ny.hst2, diff: ny.hst2 - y.hst2 };
        }).filter(Boolean) as { fin: number; hst2: number; diff: number }[];

        // Fixed fat quarter calc (always 22x18, independent of current fabric selection)
        const fq = calcYield(22, 18, finSize, oversize);
        const fqBest = Math.max(fq.hst2, fq.hst4, fq.hst8);
        const fqBestMethod = fqBest === fq.hst4 ? "4-at-a-time" : fqBest === fq.hst8 ? "8-at-a-time" : "2-at-a-time";

        return {
            ...y, best, bestMethod,
            enough2, enough4, enough8,
            surplus2, surplus4, surplus8,
            lightSq, darkSq, limitingSq, multiHst2, limiting,
            nearby,
            fqHst2: fq.hst2, fqHst4: fq.hst4, fqHst8: fq.hst8,
            fqBest, fqBestMethod,
        };
    }, [fabricW, fabricH, finSize, oversize, hstsNeeded, pieces]);

    /* ─── copy text ─── */
    const copyText = `HST Yield: ${fabricW}"×${fabricH}" fabric → ${calc.hst2} HSTs (2-at-a-time), ${calc.hst4} (4-at-a-time), ${calc.hst8} (8-at-a-time) at ${toFrac(finSize)}" finished. Best: ${calc.bestMethod} (${calc.best} HSTs).`;

    /* ─── FAQ ─── */
    const faqItems = [
        { q: "How many HSTs can I make from a fat quarter?", a: `From one fat quarter (18"×22") per color at ${toFrac(finSize)}" finished: 2-at-a-time yields ${calc.fqHst2} HSTs, 4-at-a-time yields ${calc.fqHst4} HSTs. The ${calc.fqBestMethod} method gives the best yield of ${calc.fqBest} HSTs.` },
        { q: "How many HSTs from a charm pack?", a: `From a 42-piece charm pack (5"×5"): use as-is for 4.125" finished (trim to 4") = 2 HSTs per pair = 42 HSTs from 42 pairs. Or sub-cut to 3⅞" for 3" finished HSTs = still 2 per pair = 42 HSTs.` },
        { q: "How many HSTs can I make from 1 yard of fabric?", a: `From 1 yard (36"×42") per color at 3" finished: 2-at-a-time = 180 HSTs, 4-at-a-time = 224 HSTs, 8-at-a-time = 160 HSTs. The 4-at-a-time method is most efficient at this size.` },
        { q: "What is the most HSTs I can get from a charm square?", a: `Each 5" charm square pair gives 2 HSTs using the 2-at-a-time method. The finished size is 4.125" (trim to 4"). For smaller HSTs, sub-cut the charm square to the needed cut size.` },
        { q: "How many half square triangles from a layer cake?", a: `Each 10" layer cake pair gives 2 HSTs at 9.125" finished (trim to 9") using 2-at-a-time. Or sub-cut: 4 squares at 4⅞" = 8 HSTs at 4" finished, or 9 squares at 2⅞" = 18 HSTs at 2" finished per pair.` },
        { q: "What method gives the most HSTs from the same fabric?", a: `It depends on fabric and HST size! For most common sizes (2-5" finished), 4-at-a-time gives the highest yield because its per-pair output (4 HSTs) more than compensates for the larger cut square. Check the calculator for your specific combination.` },
        { q: "How do I calculate HST yield from scraps?", a: `Measure each scrap piece. Divide width by cut size (floor) to get squares per row, divide height by cut size (floor) to get rows. Multiply for total squares. Use Mode C to combine multiple scraps.` },
        { q: "How many HSTs from a jelly roll strip?", a: `A jelly roll strip (2.5"×42"): cut into 2.5" squares = 16 squares. Each pair (with matching strip) gives 2 HSTs at 1.625" finished (trim to 1.5"). Total: 32 HSTs per strip pair.` },
        { q: "What is the minimum scrap size for making HSTs?", a: `For 2" HSTs: min 2⅞"×2⅞". For 3" HSTs: min 3⅞"×3⅞". For 4" HSTs: min 4⅞"×4⅞". Any scrap at least this large can make one HST square.` },
        { q: "How do I know if I have enough fabric for my HSTs?", a: `Use Mode B "Do I Have Enough?" — enter your fabric dimensions, HST count needed, and finished size. The calculator shows ✓ or ✗ for each method and tells you exactly how much more fabric to buy if short.` },
    ];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "HST Yield Calculator" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    {/* HEADER */}
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><BarChart3 size={14} strokeWidth={1.5} /> Quilt #147</span>
                        <h1>HST Yield Calculator</h1>
                        <p>Calculate how many half-square triangles you can make from any fabric amount — fat quarters, charm packs, layer cakes, yardage, or scraps. Compare yield across all construction methods and plan your HST production.</p>
                    </div>

                    {/* ① MODE SELECTION */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>① Calculation Mode</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>
                            {([
                                ["yield", "Fabric → HST Yield", "How many HSTs from my fabric?"],
                                ["enough", "Do I Have Enough?", "Is my fabric sufficient for X HSTs?"],
                                ["multi", "Multiple Pieces", "Combine scraps & pre-cuts"],
                            ] as [Mode, string, string][]).map(([m, title, desc]) => (
                                <button key={m} className={`btn btn-sm ${mode === m ? "btn-primary" : "btn-secondary"}`}
                                    onClick={() => setMode(m)} style={{ textAlign: "left", padding: "8px 10px" }}>
                                    <div style={{ fontWeight: 600, fontSize: 12 }}>{title}</div>
                                    <div style={{ fontSize: 10, opacity: 0.7 }}>{desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ② FINISHED SIZE */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>② Finished HST Size</h2>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
                            {SIZE_PRESETS.map(s => (
                                <button key={s} className={`btn btn-sm ${finSize === s ? "btn-primary" : "btn-secondary"}`}
                                    onClick={() => setFinSize(s)}>{toFrac(s)}&quot;</button>
                            ))}
                        </div>
                        <div className="input-group">
                            <input type="number" className="input-field" value={finSize}
                                onChange={e => setFinSize(parseFloat(e.target.value) || 1)} min={0.5} max={24} step={0.25} />
                        </div>
                        <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 4 }}>
                            Unfinished: {toFrac(finSize + 0.5)}&quot; | Cut (2-at-a-time): {toFrac(calc.cut2)}&quot;
                        </div>
                        {/* Oversize */}
                        <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                            {[{ v: 0, l: "No oversize" }, { v: 0.25, l: "+¼\" oversize" }].map(o => (
                                <button key={o.v} className={`btn btn-sm ${oversize === o.v ? "btn-primary" : "btn-secondary"}`}
                                    onClick={() => setOversize(o.v)} style={{ fontSize: 11 }}>{o.l}</button>
                            ))}
                        </div>
                    </div>

                    {/* ③ FABRIC INPUT — Modes A & B */}
                    {mode !== "multi" && (
                        <div className={`glass-card ${styles.calculatorCard}`}>
                            <h2 className={styles.calcTitle}>③ Fabric Dimensions</h2>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
                                {PRECUT_TYPES.map(p => (
                                    <button key={p.name} className={`btn btn-sm ${fabricW === p.w && fabricH === p.h ? "btn-primary" : "btn-secondary"}`}
                                        onClick={() => { setFabricW(p.w); setFabricH(p.h); }} style={{ fontSize: 10 }}>
                                        {p.emoji} {p.name}
                                    </button>
                                ))}
                            </div>
                            <div className="calculator-form-row">
                                <div className="input-group">
                                    <label className="input-label">Width (inches)</label>
                                    <input type="number" className="input-field" value={fabricW}
                                        onChange={e => setFabricW(parseFloat(e.target.value) || 1)} min={1} max={120} />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Height (inches)</label>
                                    <input type="number" className="input-field" value={fabricH}
                                        onChange={e => setFabricH(parseFloat(e.target.value) || 1)} min={1} max={144} />
                                </div>
                            </div>
                            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 4 }}>
                                Fabric area: {calc.area} sq in ({roundN(calc.area / 144, 1)} sq ft)
                            </div>
                        </div>
                    )}

                    {/* ③ EXTRA: HSTs needed for Mode B */}
                    {mode === "enough" && (
                        <div className={`glass-card ${styles.calculatorCard}`}>
                            <h2 className={styles.calcTitle}>④ How Many HSTs Do You Need?</h2>
                            <div className="input-group">
                                <input type="number" className="input-field" value={hstsNeeded}
                                    onChange={e => setHstsNeeded(parseInt(e.target.value) || 1)} min={1} max={5000} />
                            </div>
                        </div>
                    )}

                    {/* ③ MULTI-PIECE MODE C */}
                    {mode === "multi" && (
                        <div className={`glass-card ${styles.calculatorCard}`}>
                            <h2 className={styles.calcTitle}>③ Fabric Pieces</h2>
                            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 8 }}>
                                Add each fabric piece with its color. HSTs require matching light + dark pairs.
                            </div>
                            {pieces.map((p) => {
                                const py = calcYield(p.w, p.h, finSize, oversize);
                                return (
                                    <div key={p.id} style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 4, padding: 6, background: p.color === "light" ? "hsl(45,30%,96%)" : "hsl(220,20%,94%)", borderRadius: 6, fontSize: 12 }}>
                                        <select className="input-field" value={p.color} onChange={e => updatePiece(p.id, "color", e.target.value)} style={{ width: 70, fontSize: 11, padding: "4px 2px" }}>
                                            <option value="light">Light</option>
                                            <option value="dark">Dark</option>
                                        </select>
                                        <input type="text" className="input-field" value={p.label} onChange={e => updatePiece(p.id, "label", e.target.value)} style={{ flex: 1, fontSize: 11, padding: "4px 6px" }} />
                                        <input type="number" className="input-field" value={p.w} onChange={e => updatePiece(p.id, "w", parseFloat(e.target.value) || 1)} style={{ width: 55, fontSize: 11, padding: "4px 4px" }} min={1} />
                                        <span style={{ fontSize: 10 }}>×</span>
                                        <input type="number" className="input-field" value={p.h} onChange={e => updatePiece(p.id, "h", parseFloat(e.target.value) || 1)} style={{ width: 55, fontSize: 11, padding: "4px 4px" }} min={1} />
                                        <span style={{ fontSize: 10, minWidth: 45, textAlign: "right" }}>{py.sq2} sq</span>
                                        <button className="btn btn-sm btn-secondary" onClick={() => removePiece(p.id)} style={{ padding: "3px 5px" }}><Trash2 size={12} /></button>
                                    </div>
                                );
                            })}
                            <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                                <button className="btn btn-sm btn-secondary" onClick={() => addPiece("light")} style={{ fontSize: 11 }}>
                                    <Plus size={12} /> Add Light
                                </button>
                                <button className="btn btn-sm btn-secondary" onClick={() => addPiece("dark")} style={{ fontSize: 11 }}>
                                    <Plus size={12} /> Add Dark
                                </button>
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                                <span style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>Quick add:</span>
                                {PRECUT_TYPES.slice(0, 5).map(pc => (
                                    <button key={pc.name} className="btn btn-sm btn-secondary" style={{ fontSize: 9, padding: "2px 6px" }}
                                        onClick={() => { setPieces(p => [...p, { id: nextId, label: pc.name, w: pc.w, h: pc.h, color: "light" }, { id: nextId + 1, label: pc.name, w: pc.w, h: pc.h, color: "dark" }]); setNextId(n => n + 2); }}>
                                        {pc.emoji} {pc.name} pair
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ═══ PRIMARY RESULTS — MODE A ═══ */}
                    {mode === "yield" && (
                        <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(150,60%,40%)" }}>
                            <h2 className={styles.calcTitle}>HST Yield — {fabricW}&quot; × {fabricH}&quot; each color</h2>
                            <div style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
                                    <thead><tr style={{ borderBottom: "2px solid hsl(0,0%,85%)" }}>
                                        <th style={{ textAlign: "left", padding: "6px 4px" }}>Method</th>
                                        <th style={{ textAlign: "right", padding: "6px 4px" }}>Cut Size</th>
                                        <th style={{ textAlign: "right", padding: "6px 4px" }}>Squares</th>
                                        <th style={{ textAlign: "right", padding: "6px 4px", fontWeight: 700 }}>HSTs</th>
                                    </tr></thead>
                                    <tbody>
                                        {[
                                            { name: "2-at-a-time", cut: calc.cut2, sq: calc.sq2, hsts: calc.hst2 },
                                            { name: "4-at-a-time", cut: calc.cut4, sq: calc.sq4, hsts: calc.hst4 },
                                            { name: "8-at-a-time", cut: calc.cut8, sq: calc.sq8, hsts: calc.hst8 },
                                        ].map((m, i) => (
                                            <tr key={i} style={{ borderBottom: "1px solid hsl(0,0%,92%)", background: m.hsts === calc.best ? "hsl(150,30%,96%)" : undefined }}>
                                                <td style={{ padding: "5px 4px", fontWeight: m.hsts === calc.best ? 700 : 400 }}>{m.name}{m.hsts === calc.best ? " ← Best" : ""}</td>
                                                <td style={{ textAlign: "right", padding: "5px 4px", fontFamily: "monospace" }}>{toFrac(m.cut)}&quot;</td>
                                                <td style={{ textAlign: "right", padding: "5px 4px" }}>{m.sq}</td>
                                                <td style={{ textAlign: "right", padding: "5px 4px", fontWeight: 700, fontSize: 14 }}>{m.hsts}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div style={{ marginTop: 8, padding: 8, background: "hsl(150,20%,97%)", borderRadius: 6, fontSize: 12, lineHeight: 1.8 }}>
                                <div>Best method: <strong>{calc.bestMethod}</strong> ({calc.best} HSTs at {toFrac(finSize)}&quot; finished)</div>
                                <div>From <strong>{fabricW}&quot; × {fabricH}&quot;</strong> of each light and dark fabric</div>
                            </div>
                            {/* Yield bar chart */}
                            <div style={{ marginTop: 10 }}>
                                {[
                                    { name: "2-at-a-time", hsts: calc.hst2, color: "hsl(150,50%,55%)" },
                                    { name: "4-at-a-time", hsts: calc.hst4, color: "hsl(200,50%,55%)" },
                                    { name: "8-at-a-time", hsts: calc.hst8, color: "hsl(280,40%,60%)" },
                                ].map((m, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                                        <span style={{ fontSize: 10, width: 80, textAlign: "right" }}>{m.name}</span>
                                        <div style={{ flex: 1, background: "hsl(0,0%,92%)", borderRadius: 4, height: 16, overflow: "hidden" }}>
                                            <div style={{ width: `${calc.best > 0 ? (m.hsts / calc.best) * 100 : 0}%`, background: m.color, height: "100%", borderRadius: 4, transition: "width 0.3s" }} />
                                        </div>
                                        <span style={{ fontSize: 11, fontWeight: 600, minWidth: 40 }}>{m.hsts}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ═══ RESULTS — MODE B: ENOUGH? ═══ */}
                    {mode === "enough" && (
                        <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(40,70%,50%)" }}>
                            <h2 className={styles.calcTitle}>Do You Have Enough for {hstsNeeded} HSTs?</h2>
                            {[
                                { name: "2-at-a-time", hsts: calc.hst2, ok: calc.enough2, surplus: calc.surplus2 },
                                { name: "4-at-a-time", hsts: calc.hst4, ok: calc.enough4, surplus: calc.surplus4 },
                                { name: "8-at-a-time", hsts: calc.hst8, ok: calc.enough8, surplus: calc.surplus8 },
                            ].map((m, i) => (
                                <div key={i} style={{ padding: 10, marginBottom: 4, borderRadius: 6, background: m.ok ? "hsl(150,30%,96%)" : "hsl(0,30%,97%)", border: `1px solid ${m.ok ? "hsl(150,40%,80%)" : "hsl(0,40%,85%)"}`, fontSize: 13, lineHeight: 1.8 }}>
                                    <div style={{ fontWeight: 700 }}>
                                        {m.ok ? "✓" : "✗"} {m.name}: {m.hsts} HSTs available
                                    </div>
                                    <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
                                        {m.ok
                                            ? `Enough — surplus of ${m.surplus} HSTs`
                                            : `Short by ${Math.abs(m.surplus)} HSTs — need more fabric`}
                                    </div>
                                </div>
                            ))}
                            {(calc.enough2 || calc.enough4 || calc.enough8) && (
                                <div style={{ marginTop: 6, padding: 8, background: "hsl(150,20%,97%)", borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
                                    Recommendation: Use {calc.enough4 ? "4-at-a-time" : calc.enough2 ? "2-at-a-time" : "8-at-a-time"} for best results with your fabric.
                                </div>
                            )}
                        </div>
                    )}

                    {/* ═══ RESULTS — MODE C: MULTI PIECE ═══ */}
                    {mode === "multi" && (
                        <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(280,50%,55%)" }}>
                            <h2 className={styles.calcTitle}>Combined HST Yield (2-at-a-time)</h2>
                            <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                                <div style={{ flex: 1, padding: 8, background: "hsl(45,30%,96%)", borderRadius: 6, fontSize: 12, lineHeight: 1.8 }}>
                                    <div style={{ fontWeight: 600 }}>Light fabric</div>
                                    <div>Squares: <strong>{calc.lightSq}</strong></div>
                                </div>
                                <div style={{ flex: 1, padding: 8, background: "hsl(220,20%,94%)", borderRadius: 6, fontSize: 12, lineHeight: 1.8 }}>
                                    <div style={{ fontWeight: 600 }}>Dark fabric</div>
                                    <div>Squares: <strong>{calc.darkSq}</strong></div>
                                </div>
                            </div>
                            {/* Pairing balance bar */}
                            <div style={{ marginBottom: 8 }}>
                                <div style={{ fontSize: 10, marginBottom: 2 }}>Pairing balance:</div>
                                {["light", "dark"].map(c => {
                                    const sq = c === "light" ? calc.lightSq : calc.darkSq;
                                    const maxSq = Math.max(calc.lightSq, calc.darkSq) || 1;
                                    return (
                                        <div key={c} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                                            <span style={{ fontSize: 10, width: 40, textAlign: "right", textTransform: "capitalize" }}>{c}</span>
                                            <div style={{ flex: 1, background: "hsl(0,0%,92%)", borderRadius: 4, height: 14, overflow: "hidden" }}>
                                                <div style={{ width: `${(sq / maxSq) * 100}%`, background: c === "light" ? "hsl(45,60%,65%)" : "hsl(220,40%,55%)", height: "100%", borderRadius: 4 }} />
                                            </div>
                                            <span style={{ fontSize: 10, fontWeight: 600, minWidth: 30 }}>{sq}</span>
                                        </div>
                                    );
                                })}
                                {calc.lightSq !== calc.darkSq && (
                                    <div style={{ fontSize: 10, color: "hsl(0,60%,50%)", marginTop: 2 }}>
                                        Limiting factor: {calc.limiting} fabric ({calc.limitingSq} pairs possible).
                                        {Math.abs(calc.lightSq - calc.darkSq)} unmatched {calc.limiting === "light" ? "dark" : "light"} squares.
                                    </div>
                                )}
                            </div>
                            <div style={{ padding: 10, background: "hsl(280,15%,97%)", borderRadius: 6, fontSize: 14, fontWeight: 700, textAlign: "center" }}>
                                Total: {calc.multiHst2} HSTs at {toFrac(finSize)}&quot; finished
                            </div>
                            <div style={{ fontSize: 11, marginTop: 4, color: "var(--color-text-tertiary)", textAlign: "center" }}>
                                From {calc.limitingSq} matched pairs (2-at-a-time method)
                            </div>
                        </div>
                    )}

                    {/* Toolbar */}
                    <div className="toolbar" style={{ marginBottom: 16 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} /> Copy</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                    </div>

                    {/* ═══ NEARBY SIZES ═══ */}
                    {mode === "yield" && (
                        <div className={`glass-card ${styles.calculatorCard}`}>
                            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>🔄 Nearby Size Alternatives</h3>
                            <div style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
                                    <thead><tr style={{ borderBottom: "2px solid hsl(0,0%,85%)" }}>
                                        <th style={{ textAlign: "left", padding: "5px 4px" }}>Size</th>
                                        <th style={{ textAlign: "right", padding: "5px 4px" }}>Yield (2×)</th>
                                        <th style={{ textAlign: "right", padding: "5px 4px" }}>Difference</th>
                                    </tr></thead>
                                    <tbody>
                                        {calc.nearby.map((n, i) => (
                                            <tr key={i} style={{ borderBottom: "1px solid hsl(0,0%,92%)", background: n.diff === 0 ? "hsl(150,30%,96%)" : undefined, cursor: "pointer" }}
                                                onClick={() => setFinSize(n.fin)}>
                                                <td style={{ padding: "4px 4px", fontWeight: n.diff === 0 ? 700 : 400 }}>{toFrac(n.fin)}&quot;{n.diff === 0 ? " (yours)" : ""}</td>
                                                <td style={{ textAlign: "right", padding: "4px 4px", fontWeight: 600 }}>{n.hst2} HSTs</td>
                                                <td style={{ textAlign: "right", padding: "4px 4px", color: n.diff > 0 ? "hsl(150,60%,35%)" : n.diff < 0 ? "hsl(0,60%,45%)" : undefined }}>
                                                    {n.diff > 0 ? `+${n.diff}` : n.diff === 0 ? "—" : n.diff}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ═══ FAT QUARTER REFERENCE TABLE ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
                            onClick={() => setShowRef(!showRef)}>
                            📊 Fat Quarter Yield Reference (2-at-a-time)
                            <ChevronDown size={14} style={{ transform: showRef ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                        </button>
                        {showRef && (
                            <div style={{ marginTop: 10, overflowX: "auto" }}>
                                <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}>
                                    <thead><tr style={{ borderBottom: "2px solid hsl(0,0%,85%)" }}>
                                        <th style={{ textAlign: "left", padding: "5px 3px" }}>Finished</th>
                                        <th style={{ textAlign: "right", padding: "5px 3px" }}>Cut Size</th>
                                        <th style={{ textAlign: "right", padding: "5px 3px" }}>HSTs/FQ Pair</th>
                                    </tr></thead>
                                    <tbody>
                                        {FQ_REF.map((r, i) => (
                                            <tr key={i} style={{ borderBottom: "1px solid hsl(0,0%,92%)", background: Math.abs(r.fin - finSize) < 0.01 ? "hsl(150,40%,95%)" : undefined, cursor: "pointer" }}
                                                onClick={() => setFinSize(r.fin)}>
                                                <td style={{ padding: "4px 3px" }}>{toFrac(r.fin)}&quot;</td>
                                                <td style={{ textAlign: "right", padding: "4px 3px" }}>{toFrac(r.cut)}&quot;</td>
                                                <td style={{ textAlign: "right", padding: "4px 3px", fontWeight: 600 }}>{r.hsts}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* ═══ YARD REFERENCE TABLE ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
                            onClick={() => setShowYardRef(!showYardRef)}>
                            📏 Yield from 1 Yard (per color)
                            <ChevronDown size={14} style={{ transform: showYardRef ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                        </button>
                        {showYardRef && (
                            <div style={{ marginTop: 10, overflowX: "auto" }}>
                                <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}>
                                    <thead><tr style={{ borderBottom: "2px solid hsl(0,0%,85%)" }}>
                                        <th style={{ textAlign: "left", padding: "5px 3px" }}>Finished</th>
                                        <th style={{ textAlign: "right", padding: "5px 3px" }}>2-at-a-time</th>
                                        <th style={{ textAlign: "right", padding: "5px 3px" }}>4-at-a-time</th>
                                        <th style={{ textAlign: "right", padding: "5px 3px" }}>8-at-a-time</th>
                                    </tr></thead>
                                    <tbody>
                                        {YARD_REF.map((r, i) => (
                                            <tr key={i} style={{ borderBottom: "1px solid hsl(0,0%,92%)", background: Math.abs(r.fin - finSize) < 0.01 ? "hsl(150,40%,95%)" : undefined, cursor: "pointer" }}
                                                onClick={() => setFinSize(r.fin)}>
                                                <td style={{ padding: "4px 3px" }}>{toFrac(r.fin)}&quot;</td>
                                                <td style={{ textAlign: "right", padding: "4px 3px" }}>{r.two}</td>
                                                <td style={{ textAlign: "right", padding: "4px 3px", fontWeight: 600 }}>{r.four}</td>
                                                <td style={{ textAlign: "right", padding: "4px 3px" }}>{r.eight}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* ═══ PRE-CUT YIELD ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
                            onClick={() => setShowPrecut(!showPrecut)}>
                            🧩 Pre-Cut Fabric HST Yield Guide
                            <ChevronDown size={14} style={{ transform: showPrecut ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                        </button>
                        {showPrecut && (
                            <div style={{ marginTop: 10, fontSize: 12.5, lineHeight: 1.8 }}>
                                {[
                                    { name: "Charm Squares (5\"×5\")", info: "Use as-is: 4.125\" finished (trim to 4\"). 2 HSTs per pair. 42-piece pack × 2 = 42 HSTs at 4\"." },
                                    { name: "Layer Cakes (10\"×10\")", info: "As-is: 9.125\" → trim to 9\" (2 HSTs/pair). Sub-cut to 4⅞\": 4 squares per layer cake = 8 HSTs at 4\". Sub-cut to 2⅞\": 9 squares = 18 HSTs at 2\"." },
                                    { name: "Jelly Roll Strips (2.5\"×42\")", info: "Cut into 2.5\" squares: 16 per strip. Each pair = 2 HSTs at 1.625\" (trim to 1.5\"). Total: 32 HSTs per strip pair." },
                                    { name: "Fat Quarters (18\"×22\")", info: `${toFrac(finSize)}" finished: 2×=${calc.fqHst2} HSTs, 4×=${calc.fqHst4}, 8×=${calc.fqHst8}. Best: ${calc.fqBestMethod} (${calc.fqBest} HSTs per FQ pair).` },
                                    { name: "Fat Eighths (9\"×22\")", info: "About half a fat quarter. Useful for scrappy HSTs where you need fewer of each fabric." },
                                ].map((p, i) => (
                                    <div key={i} style={{ padding: 8, background: i % 2 === 0 ? "hsl(45,20%,97%)" : "hsl(200,15%,97%)", borderRadius: 6, marginBottom: 4 }}>
                                        <strong>{p.name}</strong>: {p.info}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ═══ SCRAP MIN SIZES ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
                            onClick={() => setShowScrap(!showScrap)}>
                            ✂️ Minimum Scrap Sizes for HSTs
                            <ChevronDown size={14} style={{ transform: showScrap ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                        </button>
                        {showScrap && (
                            <div style={{ marginTop: 10, overflowX: "auto" }}>
                                <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}>
                                    <thead><tr style={{ borderBottom: "2px solid hsl(0,0%,85%)" }}>
                                        <th style={{ textAlign: "left", padding: "5px 3px" }}>Finished HST</th>
                                        <th style={{ textAlign: "right", padding: "5px 3px" }}>Min for 1 Square</th>
                                        <th style={{ textAlign: "right", padding: "5px 3px" }}>Min for 4 Squares</th>
                                    </tr></thead>
                                    <tbody>
                                        {[2, 3, 4, 5, 6].map(f => {
                                            const c = f + 0.875;
                                            return (
                                                <tr key={f} style={{ borderBottom: "1px solid hsl(0,0%,92%)" }}>
                                                    <td style={{ padding: "4px 3px" }}>{f}&quot;</td>
                                                    <td style={{ textAlign: "right", padding: "4px 3px" }}>{toFrac(c)}&quot; × {toFrac(c)}&quot;</td>
                                                    <td style={{ textAlign: "right", padding: "4px 3px" }}>{toFrac(c * 2)}&quot; × {toFrac(c * 2)}&quot;</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                <div style={{ fontSize: 9, marginTop: 4, color: "var(--color-text-tertiary)" }}>Keep scraps at least this large for future HST projects.</div>
                            </div>
                        )}
                    </div>

                    {/* ═══ WHY YIELD VARIES ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
                            onClick={() => setShowWhy(!showWhy)}>
                            📐 Why Yield Varies Between Methods
                            <ChevronDown size={14} style={{ transform: showWhy ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                        </button>
                        {showWhy && (
                            <div style={{ marginTop: 10, fontSize: 12.5, lineHeight: 1.9, color: "var(--color-text-secondary)" }}>
                                <div style={{ padding: 10, background: "hsl(200,15%,97%)", borderRadius: 6, marginBottom: 6 }}>
                                    <strong>Total yield = (squares that fit) × (HSTs per pair)</strong>
                                </div>
                                <div><strong>2-at-a-time</strong>: Smaller cut squares ({toFrac(calc.cut2)}&quot;) — more fit, but only 2 HSTs per pair.</div>
                                <div><strong>4-at-a-time</strong>: Larger squares ({toFrac(calc.cut4)}&quot;) — fewer fit, but 4 HSTs each. Often the best yield.</div>
                                <div><strong>8-at-a-time</strong>: Much larger ({toFrac(calc.cut8)}&quot;) — very few fit, but 8 HSTs each. Best with large fabric.</div>
                                <div style={{ marginTop: 6, fontStyle: "italic" }}>The sweet spot depends on your fabric size and HST size. This calculator finds it for you!</div>
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
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>HST Cut Formulas</h4>
                        <div style={{ fontSize: 12, fontFamily: "monospace", lineHeight: 2, color: "var(--color-text-secondary)" }}>
                            <div><strong>2-at-a-time:</strong></div>
                            <div>cut = fin + ⅞&quot;</div>
                            <div style={{ marginTop: 6 }}><strong>4-at-a-time:</strong></div>
                            <div>cut = fin + 1¼&quot;</div>
                            <div style={{ marginTop: 6 }}><strong>8-at-a-time:</strong></div>
                            <div>cut = fin × 2 + 1½&quot;</div>
                        </div>
                    </div>
                    <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Pairing Rule</h4>
                        <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.9 }}>
                            <div>Every HST needs 1 light + 1 dark square.</div>
                            <div>Max pairs = min(light, dark).</div>
                            <div>Extra squares of one color are wasted unless you add more of the other.</div>
                        </div>
                    </div>
                    <div className="glass-card related-tools">
                        <h4>Related Tools</h4>
                        <a href="/quilt/hst-calculator" className="related-tool-link">HST Calculator</a>
                        <a href="/quilt/flying-geese-calculator" className="related-tool-link">Flying Geese</a>
                        <a href="/quilt/cornerstone-calculator" className="related-tool-link">Cornerstone</a>
                        <a href="/quilt" className="related-tool-link">All Quilt Tools</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}