"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Bird, ChevronDown } from "lucide-react";

/* ─── helpers ──────────────────────────────────── */
function toFrac(v: number): string {
    const w = Math.floor(v);
    const r = v - w;
    const m: [number, string][] = [[0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
    for (const [t, s] of m) if (Math.abs(r - t) < 0.02) return w > 0 ? `${w}${s}` : s;
    if (r < 0.05) return `${w}`;
    return v.toFixed(2);
}
const roundN = (v: number, d = 3) => Math.round(v * 10 ** d) / 10 ** d;
const ceilQ = (v: number, q = 0.25) => Math.ceil(v / q) * q;

/* ─── presets ──────────────────────────────────── */
const SIZE_PRESETS = [
    { w: 2, h: 1, label: '2×1"' }, { w: 3, h: 1.5, label: '3×1½"' },
    { w: 4, h: 2, label: '4×2"' }, { w: 5, h: 2.5, label: '5×2½"' },
    { w: 6, h: 3, label: '6×3"' }, { w: 8, h: 4, label: '8×4"' },
    { w: 10, h: 5, label: '10×5"' }, { w: 12, h: 6, label: '12×6"' },
];

const REF_TABLE = [
    { w: 2, h: 1 }, { w: 3, h: 1.5 }, { w: 4, h: 2 }, { w: 4.5, h: 2.25 },
    { w: 5, h: 2.5 }, { w: 6, h: 3 }, { w: 7, h: 3.5 }, { w: 8, h: 4 },
    { w: 10, h: 5 }, { w: 12, h: 6 },
];

/* ─── component ──────────────────────────────────── */
export default function Page() {
    const [finW, setFinW] = useState(4);
    const [finH, setFinH] = useState(2);
    const [count, setCount] = useState(24);
    const [fabricWidth, setFabricWidth] = useState(42);
    const [mode, setMode] = useState<"A" | "D">("A");
    const [borderEdge, setBorderEdge] = useState(72);
    const [borderSides, setBorderSides] = useState(4);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [showRef, setShowRef] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [showTrouble, setShowTrouble] = useState(false);

    /* ─── cutting formulas ─── */
    const calc = useMemo(() => {
        // Traditional (1-at-a-time)
        const tradRectW = finW + 0.5;
        const tradRectH = finH + 0.5;
        const tradSkySquare = finH + 0.5;

        // No-waste 4-at-a-time
        const nwLargeSquare = finW + 1.25;
        const nwSmallSquare = finH + 0.875;

        const ratio = finW / finH;
        const unfinW = finW + 0.5;
        const unfinH = finH + 0.5;

        return {
            tradRectW: roundN(tradRectW), tradRectH: roundN(tradRectH),
            tradSkySquare: roundN(tradSkySquare),
            nwLargeSquare: roundN(nwLargeSquare), nwSmallSquare: roundN(nwSmallSquare),
            ratio: roundN(ratio, 1), unfinW: roundN(unfinW), unfinH: roundN(unfinH),
        };
    }, [finW, finH]);

    /* ─── yardage ─── */
    const yardage = useMemo(() => {
        const usableW = fabricWidth - 1;

        // Traditional method
        const goosePerStrip = Math.max(1, Math.floor(usableW / calc.tradRectW));
        const gooseStrips = Math.ceil(count / goosePerStrip);
        const gooseInches = gooseStrips * calc.tradRectH;
        const gooseYd = roundN(gooseInches / 36, 2);
        const gooseBuy = ceilQ(gooseYd + 0.05);

        const skyTotal = count * 2;
        const skyPerStrip = Math.max(1, Math.floor(usableW / calc.tradSkySquare));
        const skyStrips = Math.ceil(skyTotal / skyPerStrip);
        const skyInches = skyStrips * calc.tradSkySquare;
        const skyYd = roundN(skyInches / 36, 2);
        const skyBuy = ceilQ(skyYd + 0.05);

        // No-waste 4-at-a-time
        const sets = Math.ceil(count / 4);
        const lgPerStrip = Math.max(1, Math.floor(usableW / calc.nwLargeSquare));
        const lgStrips = Math.ceil(sets / lgPerStrip);
        const lgInches = lgStrips * calc.nwLargeSquare;
        const lgYd = roundN(lgInches / 36, 2);
        const lgBuy = ceilQ(lgYd + 0.05);

        const smTotal = sets * 4;
        const smPerStrip = Math.max(1, Math.floor(usableW / calc.nwSmallSquare));
        const smStrips = Math.ceil(smTotal / smPerStrip);
        const smInches = smStrips * calc.nwSmallSquare;
        const smYd = roundN(smInches / 36, 2);
        const smBuy = ceilQ(smYd + 0.05);

        return {
            trad: { goosePerStrip, gooseStrips, gooseYd, gooseBuy, skyTotal, skyPerStrip, skyStrips, skyYd, skyBuy },
            nw: { sets, lgPerStrip, lgStrips, lgYd, lgBuy, smTotal, smPerStrip, smStrips, smYd, smBuy },
        };
    }, [count, fabricWidth, calc]);

    /* ─── border planner ─── */
    const borderResults = useMemo(() => {
        if (mode !== "D") return null;
        // Find geese sizes that fit perfectly (2:1 ratio, standard)
        const options: { geeseW: number; geeseH: number; count: number; label: string }[] = [];
        const divisors = [2, 3, 4, 5, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 24, 30, 36];
        for (const d of divisors) {
            const gw = borderEdge / d;
            if (gw >= 1.5 && gw <= 14 && gw === Math.round(gw * 4) / 4) {
                const gh = gw / 2;
                let label = "";
                if (d <= 8) label = "Large, dramatic";
                else if (d <= 14) label = "Medium";
                else if (d <= 24) label = "Standard";
                else label = "Small, intricate";
                options.push({ geeseW: gw, geeseH: gh, count: d, label });
            }
        }
        // Deduplicate by geeseW
        const seen = new Set<number>();
        const deduped = options.filter(o => { if (seen.has(o.geeseW)) return false; seen.add(o.geeseW); return true; });

        // Total geese for all sides
        let totalGeese = 0;
        const selectedW = finW;
        const perTop = Math.floor(borderEdge / selectedW);
        const perSide = Math.floor((borderEdge - 2 * selectedW) / selectedW); // minus corners
        if (borderSides === 4) {
            totalGeese = perTop * 2 + perSide * 2;
        } else if (borderSides === 2) {
            totalGeese = perTop * 2;
        } else {
            totalGeese = perTop;
        }
        const cornerSquares = borderSides === 4 ? 4 : 0;

        return { options: deduped, perTop, perSide, totalGeese, cornerSquares };
    }, [mode, borderEdge, borderSides, finW]);

    /* ─── SVG visual ─── */
    const geeseSvg = useMemo(() => {
        const aspectW = Math.min(finW * 30, 160);
        const aspectH = Math.min(finH * 30, 80);
        const svgW = aspectW + 20;
        const svgH = aspectH + 30;
        const ox = 10, oy = 10;
        return (
            <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: "100%", maxWidth: svgW }}>
                {/* Goose body triangle */}
                <polygon
                    points={`${ox},${oy + aspectH} ${ox + aspectW / 2},${oy} ${ox + aspectW},${oy + aspectH}`}
                    fill="hsl(200,50%,55%)" stroke="hsl(200,50%,35%)" strokeWidth={1}
                />
                {/* Left sky triangle */}
                <polygon
                    points={`${ox},${oy} ${ox + aspectW / 2},${oy} ${ox},${oy + aspectH}`}
                    fill="hsl(45,50%,90%)" stroke="hsl(45,40%,60%)" strokeWidth={1}
                />
                {/* Right sky triangle */}
                <polygon
                    points={`${ox + aspectW / 2},${oy} ${ox + aspectW},${oy} ${ox + aspectW},${oy + aspectH}`}
                    fill="hsl(45,50%,90%)" stroke="hsl(45,40%,60%)" strokeWidth={1}
                />
                {/* Dimension labels */}
                <text x={ox + aspectW / 2} y={oy + aspectH + 14} textAnchor="middle" fontSize={8} fill="hsl(0,0%,45%)">{toFrac(finW)}&quot;</text>
                <text x={ox + aspectW + 10} y={oy + aspectH / 2} textAnchor="start" fontSize={8} fill="hsl(0,0%,45%)">{toFrac(finH)}&quot;</text>
                <text x={ox + aspectW / 4 - 4} y={oy + aspectH / 2 - 4} textAnchor="middle" fontSize={6} fill="hsl(45,40%,50%)">Sky</text>
                <text x={ox + 3 * aspectW / 4 + 4} y={oy + aspectH / 2 - 4} textAnchor="middle" fontSize={6} fill="hsl(45,40%,50%)">Sky</text>
                <text x={ox + aspectW / 2} y={oy + aspectH - 8} textAnchor="middle" fontSize={7} fill="white">Goose</text>
            </svg>
        );
    }, [finW, finH]);

    /* copy text */
    const copyText = `Flying Geese: ${toFrac(finW)}" × ${toFrac(finH)}" finished (${calc.ratio}:1). Traditional: rectangle ${toFrac(calc.tradRectW)}" × ${toFrac(calc.tradRectH)}", sky squares ${toFrac(calc.tradSkySquare)}" × ${toFrac(calc.tradSkySquare)}". No-waste: large square ${toFrac(calc.nwLargeSquare)}", small squares ${toFrac(calc.nwSmallSquare)}". Need ${count}: buy ${toFrac(yardage.trad.gooseBuy)} yd goose, ${toFrac(yardage.trad.skyBuy)} yd sky.`;

    /* FAQ */
    const faqItems = [
        { q: "What size do I cut rectangles for flying geese?", a: `For the traditional method: cut the goose rectangle at finished width + ½" by finished height + ½". For ${toFrac(finW)}" × ${toFrac(finH)}" finished geese, cut rectangles at ${toFrac(calc.tradRectW)}" × ${toFrac(calc.tradRectH)}". Cut sky corner squares at ${toFrac(calc.tradSkySquare)}" × ${toFrac(calc.tradSkySquare)}" (2 per goose).` },
        { q: "What is the no-waste flying geese method?", a: `The no-waste (4-at-a-time) method cuts one large square and four small squares to produce 4 flying geese with zero fabric waste. For ${toFrac(finW)}" × ${toFrac(finH)}" finished: large square = ${toFrac(calc.nwLargeSquare)}", small squares = ${toFrac(calc.nwSmallSquare)}". The corner triangles from each step become sky triangles for adjacent geese.` },
        { q: "How do I make flying geese without waste?", a: "Use the 4-at-a-time method. Cut 1 large square (finished width + 1¼\") and 4 small squares (finished height + ⅞\"). Place 2 small squares on opposite corners of the large square, stitch ¼\" on each side of diagonal, cut apart, then repeat with remaining corners. All fabric becomes part of the 4 geese." },
        { q: "What is the difference between traditional and no-waste flying geese?", a: "Traditional makes 1 goose per set (rectangle + 2 squares), wastes corner triangles, but allows scrappy variety. No-waste makes 4 geese per set, uses all fabric efficiently (~4% more geese per yard), but all 4 geese have the same goose fabric. Use traditional for scrappy, no-waste for efficiency." },
        { q: "How do I plan a flying geese border that fits my quilt?", a: "Measure your quilt edge through the center. Divide by candidate goose widths until you find one that divides evenly. For a 72\" edge: 6\" geese = 12, 4\" = 18, 3\" = 24. If geese don't fit evenly, add spacer strips at the ends, adjust goose size slightly, or choose a different size." },
        { q: "What size corner squares for flying geese?", a: `Corner (sky) squares are always finished height + ½". For ${toFrac(finH)}" finished height: cut ${toFrac(calc.tradSkySquare)}" × ${toFrac(calc.tradSkySquare)}" squares. You need 2 squares per flying geese unit. The squares are placed on opposite ends of the rectangle and sewn on the diagonal.` },
        { q: "How do I fix flying geese points that are cut off?", a: "Cut-off points mean sky squares are too large. Verify: sky square should be finished height + ½\" — no larger. If your point is off-center, check that diagonals go in opposite directions (forming a V shape). If the geese finish too small, check that your seam allowance is exactly ¼\"." },
        { q: "How many flying geese do I need for a border?", a: `For a border: quilt edge ÷ goose finished width = geese per side. For a 72\" edge with 4\" geese: 72 ÷ 4 = 18 geese per side. With corner squares: deduct one goose-width from each end of side borders. For all 4 sides of a 72\" quilt: 18 top + 18 bottom + 16 each side = 68 total.` },
        { q: "What is the flying geese rectangle formula?", a: "Traditional method: Rectangle = (finished width + ½\") × (finished height + ½\"). Sky squares = (finished height + ½\") × (finished height + ½\"). No-waste: Large square = finished width + 1¼\". Small squares = finished height + ⅞\". The standard proportion is 2:1 (width twice the height)." },
        { q: "How do I calculate yardage for flying geese?", a: `For ${count} geese at ${toFrac(finW)}" × ${toFrac(finH)}" using traditional method: goose fabric = ${toFrac(yardage.trad.gooseBuy)} yd (${count} rectangles at ${toFrac(calc.tradRectW)}" × ${toFrac(calc.tradRectH)}"). Sky fabric = ${toFrac(yardage.trad.skyBuy)} yd (${yardage.trad.skyTotal} squares at ${toFrac(calc.tradSkySquare)}").` },
        { q: "What is the standard flying geese proportion?", a: "The standard flying geese proportion is 2:1 — width is twice the height. For example, 4\" wide × 2\" tall, or 6\" wide × 3\" tall. This is the proportion that cutting methods naturally create. Non-standard proportions (wide, tall, square) are possible but require adjusted formulas." },
        { q: "How do I make scrappy flying geese?", a: "Use the traditional (1-at-a-time) method for scrappy geese. Each goose body is cut from a different fabric, while sky squares can all be the same background fabric. This gives maximum variety. The no-waste method produces 4 identical geese per set, making it less suitable for scrappy designs." },
    ];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "Flying Geese Calculator" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    {/* HEADER */}
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Bird size={14} strokeWidth={1.5} /> Quilt #149</span>
                        <h1>Flying Geese Calculator</h1>
                        <p>Calculate precise cutting dimensions for flying geese units using traditional and no-waste methods. Includes border planner, yardage calculator, method comparison, step-by-step construction, and troubleshooting guide.</p>
                    </div>

                    {/* MODE SELECTOR */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Calculation Mode</h2>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            <button className={`btn btn-sm ${mode === "A" ? "btn-primary" : "btn-secondary"}`}
                                onClick={() => setMode("A")}>🔢 Size → Cutting</button>
                            <button className={`btn btn-sm ${mode === "D" ? "btn-primary" : "btn-secondary"}`}
                                onClick={() => setMode("D")}>📏 Border Planner</button>
                        </div>
                    </div>

                    {/* ① GEESE SIZE */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>① Finished Geese Size</h2>
                        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, color: "var(--color-text-secondary)" }}>Standard 2:1 Presets</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
                            {SIZE_PRESETS.map(p => (
                                <button key={p.label}
                                    className={`btn btn-sm ${finW === p.w && finH === p.h ? "btn-primary" : "btn-secondary"}`}
                                    onClick={() => { setFinW(p.w); setFinH(p.h); }}>
                                    {p.label}
                                </button>
                            ))}
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Finished width (inches)</label>
                                <input type="number" className="input-field" value={finW} onChange={e => setFinW(parseFloat(e.target.value) || 2)} min={1} max={20} step={0.25} /></div>
                            <div className="input-group"><label className="input-label">Finished height (inches)</label>
                                <input type="number" className="input-field" value={finH} onChange={e => setFinH(parseFloat(e.target.value) || 1)} min={0.5} max={10} step={0.25} /></div>
                        </div>
                        <div style={{ fontSize: 12, marginTop: 6, color: "var(--color-text-tertiary)" }}>
                            Ratio: <strong>{calc.ratio}:1</strong> {Math.abs(calc.ratio - 2) < 0.01 ? "(standard)" : calc.ratio > 2 ? "(wide)" : "(tall)"}
                            {finH > finW && <span style={{ color: "hsl(0,60%,50%)", marginLeft: 8 }}>⚠ Height &gt; width — unusual proportion</span>}
                        </div>
                    </div>

                    {/* ② QUANTITY & FABRIC */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>② Quantity &amp; Fabric</h2>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Flying geese needed</label>
                                <input type="number" className="input-field" value={count} onChange={e => setCount(parseInt(e.target.value) || 1)} min={1} max={500} /></div>
                            <div className="input-group"><label className="input-label">Fabric width (inches)</label>
                                <select className="input-field" value={fabricWidth} onChange={e => setFabricWidth(parseInt(e.target.value))}>
                                    <option value={42}>42&quot;</option><option value={44}>44&quot;</option><option value={60}>60&quot;</option>
                                </select></div>
                        </div>
                    </div>

                    {/* BORDER PLANNER */}
                    {mode === "D" && (
                        <div className={`glass-card ${styles.calculatorCard}`}>
                            <h2 className={styles.calcTitle}>📏 Border Planner</h2>
                            <div className="calculator-form-row">
                                <div className="input-group"><label className="input-label">Quilt edge (inches)</label>
                                    <input type="number" className="input-field" value={borderEdge} onChange={e => setBorderEdge(parseFloat(e.target.value) || 48)} min={12} max={200} step={0.5} /></div>
                                <div className="input-group"><label className="input-label">Sides with borders</label>
                                    <select className="input-field" value={borderSides} onChange={e => setBorderSides(parseInt(e.target.value))}>
                                        <option value={4}>All 4 sides</option><option value={2}>Top &amp; bottom only</option><option value={1}>One side only</option>
                                    </select></div>
                            </div>

                            {borderResults && borderResults.options.length > 0 && (
                                <div style={{ marginTop: 12 }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, color: "var(--color-text-secondary)" }}>
                                        Geese sizes that fit {borderEdge}&quot; perfectly (2:1 ratio)
                                    </div>
                                    <div style={{ overflowX: "auto" }}>
                                        <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
                                            <thead><tr style={{ borderBottom: "2px solid hsl(0,0%,85%)" }}>
                                                <th style={{ textAlign: "left", padding: "6px 6px" }}>Size</th>
                                                <th style={{ textAlign: "right", padding: "6px 6px" }}>Count</th>
                                                <th style={{ textAlign: "left", padding: "6px 6px" }}>Look</th>
                                            </tr></thead>
                                            <tbody>
                                                {borderResults.options.slice(0, 6).map((o, i) => (
                                                    <tr key={i} style={{
                                                        background: o.geeseW === finW ? "hsl(150,40%,95%)" : undefined,
                                                        borderBottom: "1px solid hsl(0,0%,92%)", cursor: "pointer",
                                                    }} onClick={() => { setFinW(o.geeseW); setFinH(o.geeseH); }}>
                                                        <td style={{ padding: "5px 6px", fontWeight: o.geeseW === finW ? 700 : 400 }}>{toFrac(o.geeseW)}&quot; × {toFrac(o.geeseH)}&quot;</td>
                                                        <td style={{ textAlign: "right", padding: "5px 6px" }}>{o.count}</td>
                                                        <td style={{ padding: "5px 6px" }}>{o.label}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div style={{ fontSize: 11, marginTop: 6, color: "var(--color-text-tertiary)" }}>
                                        Click a row to select that size. Corner squares: {toFrac(finW)}&quot; × {toFrac(finW)}&quot;
                                    </div>
                                </div>
                            )}

                            {borderResults && (
                                <div style={{ marginTop: 10, padding: 10, background: "hsl(200,25%,96%)", borderRadius: 6 }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Border Summary — {toFrac(finW)}&quot; × {toFrac(finH)}&quot; geese</div>
                                    <div style={{ fontSize: 12, lineHeight: 1.8 }}>
                                        <div>Per top/bottom: {borderResults.perTop} geese</div>
                                        {borderSides === 4 && <div>Per side (minus corners): {borderResults.perSide} geese</div>}
                                        <div style={{ fontWeight: 600 }}>Total geese: {borderResults.totalGeese}</div>
                                        {borderResults.cornerSquares > 0 && <div>Corner squares: {borderResults.cornerSquares} at {toFrac(calc.unfinW)}&quot; × {toFrac(calc.unfinW)}&quot;</div>}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ═══ PRIMARY RESULTS ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(150,60%,40%)" }}>
                        <h2 className={styles.calcTitle}>Cutting Sizes — {toFrac(finW)}&quot; × {toFrac(finH)}&quot; Finished</h2>

                        {/* Visual */}
                        <div style={{ textAlign: "center", marginBottom: 12 }}>
                            {geeseSvg}
                            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>
                                Unfinished: {toFrac(calc.unfinW)}&quot; × {toFrac(calc.unfinH)}&quot; • Ratio: {calc.ratio}:1
                            </div>
                        </div>

                        {/* Method comparison */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                            <div style={{ padding: 12, background: "hsl(200,25%,96%)", borderRadius: 6 }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: "hsl(200,60%,35%)", marginBottom: 6 }}>Traditional (1-at-a-time)</div>
                                <div style={{ fontSize: 13, lineHeight: 2 }}>
                                    <div>Goose rectangle: <strong>{toFrac(calc.tradRectW)}&quot; × {toFrac(calc.tradRectH)}&quot;</strong></div>
                                    <div>Sky squares: <strong>{toFrac(calc.tradSkySquare)}&quot; × {toFrac(calc.tradSkySquare)}&quot;</strong></div>
                                    <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>2 squares per goose</div>
                                    <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>Yield: 1 goose/set</div>
                                </div>
                            </div>
                            <div style={{ padding: 12, background: "hsl(150,25%,96%)", borderRadius: 6 }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: "hsl(150,60%,35%)", marginBottom: 6 }}>No-Waste (4-at-a-time) ★</div>
                                <div style={{ fontSize: 13, lineHeight: 2 }}>
                                    <div>Large square: <strong>{toFrac(calc.nwLargeSquare)}&quot; × {toFrac(calc.nwLargeSquare)}&quot;</strong></div>
                                    <div>Small squares: <strong>{toFrac(calc.nwSmallSquare)}&quot; × {toFrac(calc.nwSmallSquare)}&quot;</strong></div>
                                    <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>4 small squares per set</div>
                                    <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>Yield: 4 geese/set</div>
                                </div>
                            </div>
                        </div>

                        {/* Formulas */}
                        <div style={{ marginTop: 8, fontSize: 11, color: "var(--color-text-tertiary)", lineHeight: 1.8, fontFamily: "monospace" }}>
                            Traditional: Rect = (W+½&quot;) × (H+½&quot;), Sq = (H+½&quot;)² &nbsp;|&nbsp; No-waste: Lg = W+1¼&quot;, Sm = H+⅞&quot;
                        </div>
                    </div>

                    {/* ═══ YARDAGE ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Yardage — {count} Flying Geese</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                            {/* Traditional yardage */}
                            <div style={{ padding: 10, background: "hsl(200,20%,97%)", borderRadius: 6 }}>
                                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Traditional Method</div>
                                <div style={{ fontSize: 12, lineHeight: 1.8 }}>
                                    <div><strong>Goose fabric</strong></div>
                                    <div>{count} rect at {toFrac(calc.tradRectW)}&quot;×{toFrac(calc.tradRectH)}&quot;</div>
                                    <div>{yardage.trad.goosePerStrip}/strip × {yardage.trad.gooseStrips} strips</div>
                                    <div style={{ fontWeight: 600, color: "hsl(150,60%,35%)" }}>Buy: {toFrac(yardage.trad.gooseBuy)} yd</div>
                                    <div style={{ marginTop: 4 }}><strong>Sky fabric</strong></div>
                                    <div>{yardage.trad.skyTotal} sq at {toFrac(calc.tradSkySquare)}&quot;</div>
                                    <div>{yardage.trad.skyPerStrip}/strip × {yardage.trad.skyStrips} strips</div>
                                    <div style={{ fontWeight: 600, color: "hsl(150,60%,35%)" }}>Buy: {toFrac(yardage.trad.skyBuy)} yd</div>
                                </div>
                            </div>
                            {/* No-waste yardage */}
                            <div style={{ padding: 10, background: "hsl(150,20%,97%)", borderRadius: 6 }}>
                                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>No-Waste Method ★</div>
                                <div style={{ fontSize: 12, lineHeight: 1.8 }}>
                                    <div><strong>Goose fabric</strong> ({yardage.nw.sets} sets)</div>
                                    <div>{yardage.nw.sets} lg sq at {toFrac(calc.nwLargeSquare)}&quot;</div>
                                    <div>{yardage.nw.lgPerStrip}/strip × {yardage.nw.lgStrips} strips</div>
                                    <div style={{ fontWeight: 600, color: "hsl(150,60%,35%)" }}>Buy: {toFrac(yardage.nw.lgBuy)} yd</div>
                                    <div style={{ marginTop: 4 }}><strong>Sky fabric</strong></div>
                                    <div>{yardage.nw.smTotal} sm sq at {toFrac(calc.nwSmallSquare)}&quot;</div>
                                    <div>{yardage.nw.smPerStrip}/strip × {yardage.nw.smStrips} strips</div>
                                    <div style={{ fontWeight: 600, color: "hsl(150,60%,35%)" }}>Buy: {toFrac(yardage.nw.smBuy)} yd</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="toolbar" style={{ marginBottom: 16 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} /> Copy</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                    </div>

                    {/* ═══ SIZE REFERENCE TABLE ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
                            onClick={() => setShowRef(!showRef)}>
                            📐 Flying Geese Size Reference
                            <ChevronDown size={14} style={{ transform: showRef ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                        </button>
                        {showRef && (
                            <div style={{ marginTop: 10, overflowX: "auto" }}>
                                <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}>
                                    <thead><tr style={{ borderBottom: "2px solid hsl(0,0%,85%)" }}>
                                        <th style={{ textAlign: "left", padding: "5px 4px" }}>Finished</th>
                                        <th style={{ textAlign: "left", padding: "5px 4px" }}>Rect Cut</th>
                                        <th style={{ textAlign: "left", padding: "5px 4px" }}>Sky Sq</th>
                                        <th style={{ textAlign: "left", padding: "5px 4px" }}>NW Lg Sq</th>
                                        <th style={{ textAlign: "left", padding: "5px 4px" }}>NW Sm Sq</th>
                                    </tr></thead>
                                    <tbody>
                                        {REF_TABLE.map(r => {
                                            const rW = r.w + 0.5;
                                            const rH = r.h + 0.5;
                                            const sky = r.h + 0.5;
                                            const lg = r.w + 1.25;
                                            const sm = r.h + 0.875;
                                            const isCurrent = r.w === finW && r.h === finH;
                                            return (
                                                <tr key={r.w} style={{ background: isCurrent ? "hsl(150,40%,95%)" : undefined, borderBottom: "1px solid hsl(0,0%,92%)" }}>
                                                    <td style={{ padding: "4px 4px", fontWeight: isCurrent ? 700 : 400 }}>{toFrac(r.w)}&quot;×{toFrac(r.h)}&quot;</td>
                                                    <td style={{ padding: "4px 4px" }}>{toFrac(rW)}&quot;×{toFrac(rH)}&quot;</td>
                                                    <td style={{ padding: "4px 4px" }}>{toFrac(sky)}&quot;</td>
                                                    <td style={{ padding: "4px 4px" }}>{toFrac(lg)}&quot;</td>
                                                    <td style={{ padding: "4px 4px" }}>{toFrac(sm)}&quot;</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* ═══ CONSTRUCTION INSTRUCTIONS ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
                            onClick={() => setShowInstructions(!showInstructions)}>
                            🧵 Construction Instructions
                            <ChevronDown size={14} style={{ transform: showInstructions ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                        </button>
                        {showInstructions && (
                            <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
                                <h4 style={{ color: "hsl(200,60%,35%)", fontWeight: 700, marginBottom: 4 }}>Traditional Method (1-at-a-time)</h4>
                                <div style={{ padding: 10, background: "hsl(200,15%,97%)", borderRadius: 6, marginBottom: 10 }}>
                                    <div><strong>Cut per goose:</strong> 1 rectangle at {toFrac(calc.tradRectW)}&quot; × {toFrac(calc.tradRectH)}&quot; + 2 squares at {toFrac(calc.tradSkySquare)}&quot;</div>
                                    <ol style={{ paddingLeft: 20, marginTop: 6 }}>
                                        <li>Place 1 sky square on LEFT end of goose rectangle, right sides together. Draw diagonal. Stitch ON the line.</li>
                                        <li>Trim leaving ¼&quot; seam. Flip and press open.</li>
                                        <li>Place 2nd sky square on RIGHT end. Draw diagonal in <strong>opposite direction</strong> (forms V shape). Stitch on line.</li>
                                        <li>Trim leaving ¼&quot;. Flip and press. Unit should measure {toFrac(calc.unfinW)}&quot; × {toFrac(calc.unfinH)}&quot; unfinished.</li>
                                    </ol>
                                    <div style={{ fontSize: 12, marginTop: 6, color: "hsl(0,60%,50%)" }}>⚠ Common mistake: drawing both diagonals in the same direction places both sky triangles on the same side!</div>
                                </div>

                                <h4 style={{ color: "hsl(150,60%,35%)", fontWeight: 700, marginBottom: 4 }}>No-Waste 4-at-a-Time Method</h4>
                                <div style={{ padding: 10, background: "hsl(150,15%,97%)", borderRadius: 6 }}>
                                    <div><strong>Cut per set of 4:</strong> 1 large square at {toFrac(calc.nwLargeSquare)}&quot; + 4 small squares at {toFrac(calc.nwSmallSquare)}&quot;</div>
                                    <ol style={{ paddingLeft: 20, marginTop: 6 }}>
                                        <li>Draw diagonal on wrong side of all 4 small squares.</li>
                                        <li>Place 2 small squares on opposite corners of large square (right sides together, overlapping slightly in center). Stitch ¼&quot; on EACH SIDE of diagonal. Cut apart on diagonal. Press open → 2 half-units.</li>
                                        <li>Place 1 remaining small square on unsewn corner of each half-unit. Stitch ¼&quot; each side of diagonal. Cut on diagonal. Press → 4 flying geese.</li>
                                        <li>Each should measure {toFrac(calc.unfinW)}&quot; × {toFrac(calc.unfinH)}&quot; unfinished. Trim if needed.</li>
                                    </ol>
                                    <div style={{ fontSize: 12, marginTop: 6, color: "hsl(150,60%,35%)" }}>✓ Zero waste — all corner triangles become part of adjacent geese!</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ═══ TROUBLESHOOTING ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
                            onClick={() => setShowTrouble(!showTrouble)}>
                            🔧 Troubleshooting Flying Geese
                            <ChevronDown size={14} style={{ transform: showTrouble ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                        </button>
                        {showTrouble && (
                            <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
                                {[
                                    {
                                        title: "Goose point is cut off or blunt", color: "hsl(0,20%,97%)", titleColor: "hsl(0,60%,45%)",
                                        desc: `Sky squares cut too large — they cover the goose point. Sky square should be finished height + ½" = ${toFrac(calc.tradSkySquare)}". Recut sky squares to correct size.`
                                    },
                                    {
                                        title: "Goose point not centered — off to one side", color: "hsl(40,20%,97%)", titleColor: "hsl(40,60%,40%)",
                                        desc: "Both diagonals must form a symmetric V shape. Left diagonal: lower-left to upper-right. Right diagonal: lower-right to upper-left. Mark carefully before stitching."
                                    },
                                    {
                                        title: "Geese finish too small", color: "hsl(200,20%,97%)", titleColor: "hsl(200,60%,40%)",
                                        desc: `Rectangle or sky squares cut too small, or seam allowance too wide. Verify rectangle is ${toFrac(calc.tradRectW)}" × ${toFrac(calc.tradRectH)}", squares are ${toFrac(calc.tradSkySquare)}". Test 1 unit first.`
                                    },
                                    {
                                        title: "Sky triangles don't cover rectangle corners", color: "hsl(280,20%,97%)", titleColor: "hsl(280,60%,40%)",
                                        desc: "Sky squares too small. The corner triangle should extend ¼\" beyond the rectangle edge when positioned. Increase sky squares by ¼\"."
                                    },
                                ].map((p, i) => (
                                    <div key={i} style={{ padding: 10, background: p.color, borderRadius: 6, marginBottom: 8 }}>
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
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Quick Formula</h4>
                        <div style={{ fontSize: 12, fontFamily: "monospace", lineHeight: 2, color: "var(--color-text-secondary)" }}>
                            <div><strong>Traditional:</strong></div>
                            <div>Rect = (W+½) × (H+½)</div>
                            <div>Sky = (H+½)²</div>
                            <div style={{ marginTop: 6 }}><strong>No-waste:</strong></div>
                            <div>Lg sq = W + 1¼</div>
                            <div>Sm sq = H + ⅞</div>
                            <div>Yield: 4 geese/set</div>
                        </div>
                    </div>
                    <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Quick Answer</h4>
                        <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.9 }}>
                            <div>4&quot;×2&quot; finished (standard)</div>
                            <div>Rect: 4½&quot; × 2½&quot;</div>
                            <div>Sky: 2½&quot; squares</div>
                            <div>NW: 5¼&quot; + 2⅞&quot;</div>
                        </div>
                    </div>
                    <div className="glass-card related-tools">
                        <h4>Related Tools</h4>
                        <a href="/quilt/hst-calculator" className="related-tool-link">HST Calculator</a>
                        <a href="/quilt/border-calculator" className="related-tool-link">Border Calculator</a>
                        <a href="/quilt/blocks-needed" className="related-tool-link">Blocks Needed</a>
                        <a href="/quilt/backing-calculator" className="related-tool-link">Backing Calculator</a>
                        <a href="/quilt" className="related-tool-link">All Quilt Tools</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}