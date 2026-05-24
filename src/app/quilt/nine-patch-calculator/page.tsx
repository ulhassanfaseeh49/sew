"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, ChevronDown, Grid3X3 } from "lucide-react";

/* ─── FRACTION DISPLAY ─── */
function toFrac(v: number): string {
    if (v <= 0) return "0";
    const w = Math.floor(v);
    const f = v - w;
    const map: [number, string][] = [[0, ""], [0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
    let best = map[0], bd = 1;
    for (const [n, s] of map) { const d = Math.abs(f - n); if (d < bd) { bd = d; best = [n, s]; } }
    if (Math.abs(f - 1) < bd) return `${w + 1}`;
    if (!best[1]) return `${w}`;
    return w > 0 ? `${w}${best[1]}` : `${best[1]}`;
}
function toFracIn(v: number): string { return toFrac(v) + '"'; }

/* ─── CONSTANTS ─── */
const SA = 0.5; // seam allowance per square (two sides)
const WOF = 42; // usable width of fabric

/* ─── REFERENCE TABLE ─── */
const refSizes = [3, 4.5, 6, 7.5, 9, 10.5, 12, 13.5, 15];

/* ─── FAQ ─── */
const faqItems = [
    { q: "What size strips do I cut for a nine-patch block?", a: "Divide the finished block size by 3, then add ½\" for seam allowance. For a 9\" block: 9÷3=3\" finished squares → cut 3½\" strips. This applies to both individual square cutting and strip piecing." },
    { q: "How do I strip piece a nine-patch block?", a: "Cut strips at the calculated width. Sew Strip Set A (Dark-Light-Dark) and Strip Set B (Light-Dark-Light). Sub-cut both sets into segments at the same width. Assemble each block: 2 Set A segments + 1 Set B segment. Press seams to nest at intersections." },
    { q: "What size squares for a 9-inch nine-patch block?", a: "A 9\" finished nine-patch has 3\" finished squares. Cut each square at 3½\" × 3½\" (adding ½\" for seam allowance). You need 5 dark and 4 light squares per block for a standard checkerboard arrangement." },
    { q: "How many nine-patch blocks from one strip set?", a: "From 42\" WOF fabric: segments per strip set = floor(42 ÷ cut width). Each block needs 2 Set A + 1 Set B segments. For 9\" blocks (3½\" cuts): 12 segments per set → 6 blocks per Set A (limiting factor)." },
    { q: "What is a double nine-patch?", a: "A double nine-patch is an 18\" block where 5 of the 9 squares are themselves mini nine-patches and 4 are plain squares. The inner nine-patches are 6\" finished with 2\" finished squares (cut at 2½\"). It creates beautiful Irish Chain effects." },
    { q: "How do I nest seams in a nine-patch?", a: "Press Set A segment seams toward dark fabric. Press Set B segment seams toward dark (center). When placed together, seams point in opposite directions and interlock ('nest'), creating flat, bulk-free intersections." },
    { q: "How much fabric for 30 nine-patch blocks?", a: "For 30 blocks at 9\" finished with strip piecing: ~13 dark strips + 11 light strips at 3½\" wide. Dark ≈ 1.5 yards, light ≈ 1.25 yards. Total ≈ 2.75 yards. Our calculator provides exact amounts for any block count and size." },
    { q: "What is strip piecing and is it faster?", a: "Strip piecing sews long strips together first, then sub-cuts into pre-sewn segments. For 30 nine-patch blocks: individual squares = 270 cuts; strip piecing = ~84 cuts. Saves ~69% of cutting time and produces more consistent blocks." },
    { q: "What size nine-patch goes with a 9\" snowball?", a: "They must match! A 9\" nine-patch pairs with a 9\" snowball block. Both use the same finished size so they tile perfectly. Use our Snowball Block Calculator for the snowball cutting dimensions." },
    { q: "How do I make a scrappy nine-patch quilt?", a: "Cut 3½\" squares from many different fabrics. For 30 blocks with 10 fabrics: 270 squares ÷ 10 = 27 per fabric (3 WOF strips each). Shuffle squares randomly before sewing. Each block becomes a unique mix of colors and prints." },
    { q: "Which pre-cut works for nine-patches?", a: "2.5\" strips (jelly rolls) → 6\" finished nine-patch (2\" squares). 5\" charm squares can be cut into four 2.5\" squares each. No standard pre-cut makes a 9\" nine-patch directly — you need 3.5\" strips cut from yardage." },
    { q: "Why is my nine-patch finishing too small?", a: "Most likely cause: seam allowance is wider than ¼\". Each extra ⅛\" per seam loses 1\" total across a nine-patch (8 seam allowances). Test your seam allowance with a scrap strip. Use a quarter-inch presser foot for accuracy." },
];

export default function Page() {
    const [mode, setMode] = useState<"A" | "B" | "C">("A");
    const [finBlock, setFinBlock] = useState(9);
    const [stripWidth, setStripWidth] = useState(3.5);
    const [sqCutSize, setSqCutSize] = useState(3.5);
    const [blockCount, setBlockCount] = useState(12);
    const [fabricWidth, setFabricWidth] = useState(42);
    const [showStrip, setShowStrip] = useState(false);
    const [showYardage, setShowYardage] = useState(false);
    const [showDouble, setShowDouble] = useState(false);
    const [showScrappy, setShowScrappy] = useState(false);
    const [showTrouble, setShowTrouble] = useState(false);
    const [showEdu, setShowEdu] = useState(false);
    const [scrappyFabrics, setScrappyFabrics] = useState(10);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    // Core calculations based on mode
    const calc = useMemo(() => {
        let finSq: number, cutSq: number, finBlk: number;
        if (mode === "A") {
            finBlk = finBlock;
            finSq = finBlk / 3;
            cutSq = finSq + SA;
        } else if (mode === "B") {
            cutSq = stripWidth;
            finSq = cutSq - SA;
            finBlk = finSq * 3;
        } else {
            cutSq = sqCutSize;
            finSq = cutSq - SA;
            finBlk = finSq * 3;
        }
        const segsPerWOF = Math.floor(fabricWidth / cutSq);
        // Strip set yield: each block needs 2 Set A + 1 Set B segments
        // Set A yields segsPerWOF segments → blocks from A = floor(segsPerWOF / 2)
        // Set B yields segsPerWOF segments → blocks from B = segsPerWOF
        // Limiting factor is Set A
        const blocksPerSetA = Math.floor(segsPerWOF / 2);
        const setBsegsNeeded = blocksPerSetA; // 1 per block
        const isDivisible = Math.abs(finBlk % 3) < 0.01;
        return { finSq, cutSq, finBlk, segsPerWOF, blocksPerSetA, setBsegsNeeded, isDivisible };
    }, [mode, finBlock, stripWidth, sqCutSize, fabricWidth]);

    // Yardage calculations
    const yard = useMemo(() => {
        const { cutSq, blocksPerSetA } = calc;
        const setANeeded = Math.ceil(blockCount / Math.max(blocksPerSetA, 1));
        const setBSegsTotal = blockCount; // 1 per block
        const setBNeeded = Math.ceil(setBSegsTotal / calc.segsPerWOF);
        // Dark strips: 2 per Set A + 1 per Set B
        const darkStrips = setANeeded * 2 + setBNeeded * 1;
        // Light strips: 1 per Set A + 2 per Set B
        const lightStrips = setANeeded * 1 + setBNeeded * 2;
        const darkInches = darkStrips * cutSq;
        const lightInches = lightStrips * cutSq;
        const darkYd = darkInches / 36;
        const lightYd = lightInches / 36;
        const darkBuy = Math.ceil(darkYd * 8) / 8;
        const lightBuy = Math.ceil(lightYd * 8) / 8;
        // Individual squares method
        const darkSqTotal = blockCount * 5;
        const lightSqTotal = blockCount * 4;
        const indivCuts = (darkSqTotal + lightSqTotal);
        const stripCuts = (darkStrips + lightStrips); // strip cuts
        const subCuts = setANeeded * calc.segsPerWOF + setBNeeded * calc.segsPerWOF; // sub-cuts
        return { setANeeded, setBNeeded, darkStrips, lightStrips, darkYd, lightYd, darkBuy, lightBuy, darkSqTotal, lightSqTotal, indivCuts, stripCuts, subCuts };
    }, [calc, blockCount]);

    // Double nine-patch
    const dbl = useMemo(() => {
        const outerFin = calc.finBlk;
        const innerFin = outerFin / 3;
        const tinySq = innerFin / 3;
        const tinyCut = tinySq + SA;
        const plainCut = innerFin + SA;
        // Standard double: 5 inner nine-patches + 4 plain
        const innerNPperBlock = 5;
        const plainPerBlock = 4;
        const tinyDarkPerBlock = innerNPperBlock * 5;
        const tinyLightPerBlock = innerNPperBlock * 4;
        return { outerFin, innerFin, tinySq, tinyCut, plainCut, innerNPperBlock, plainPerBlock, tinyDarkPerBlock, tinyLightPerBlock };
    }, [calc]);

    const tH = { padding: "5px 8px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left" as const, fontSize: 11, fontWeight: 600 as const };
    const tD = { padding: "4px 8px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11 };
    const tR = { textAlign: "right" as const };

    // SVG block preview
    const blockSVG = (
        <svg viewBox="0 0 120 120" style={{ width: 120, height: 120 }}>
            {[0, 1, 2].map(r => [0, 1, 2].map(c => {
                const isDark = (r + c) % 2 === 0;
                return <rect key={`${r}-${c}`} x={c * 40} y={r * 40} width={40} height={40} fill={isDark ? "hsl(220,40%,45%)" : "hsl(45,60%,88%)"} stroke="hsl(0,0%,80%)" strokeWidth={1} />;
            }))}
            {[0, 1, 2].map(r => [0, 1, 2].map(c => (
                <text key={`t${r}-${c}`} x={c * 40 + 20} y={r * 40 + 24} textAnchor="middle" fontSize={10} fill={(r + c) % 2 === 0 ? "#fff" : "#333"}>{(r + c) % 2 === 0 ? "A" : "B"}</text>
            )))}
        </svg>
    );

    const copyText = `Nine-Patch: ${toFracIn(calc.finBlk)} finished. Square: ${toFracIn(calc.finSq)} fin → cut at ${toFracIn(calc.cutSq)}. Strips: ${toFracIn(calc.cutSq)} wide × WOF. ${calc.segsPerWOF} segs/WOF, ${calc.blocksPerSetA} blocks/strip set. For ${blockCount} blocks: ${yard.darkStrips} dark + ${yard.lightStrips} light strips. Buy ${toFrac(yard.darkBuy)} yd dark, ${toFrac(yard.lightBuy)} yd light.`;

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "Nine-Patch Calculator" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Grid3X3 size={14} strokeWidth={1.5} /> Quilt #151</span>
                        <h1>Nine-Patch Block Calculator</h1>
                        <p>Calculate strip widths, square cut sizes, strip piecing instructions, and yardage for nine-patch blocks of any size. Includes double nine-patch, scrappy mode, and complete quilt planner.</p>
                    </div>

                    {/* ① MODE + INPUT */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>① Choose Mode</h2>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                            {([["A", "Block Size → Cuts"], ["B", "Strip Width → Size"], ["C", "Square Cut → Size"]] as const).map(([m, label]) => (
                                <button key={m} className={`btn btn-sm ${mode === m ? "btn-primary" : "btn-ghost"}`} onClick={() => setMode(m)}>{label}</button>
                            ))}
                        </div>
                        {mode === "A" && (
                            <div className="input-group">
                                <label className="input-label">Finished block size (inches)</label>
                                <input type="number" className="input-field" value={finBlock} onChange={e => setFinBlock(Math.max(1.5, parseFloat(e.target.value) || 9))} min={1.5} step={0.5} />
                                <span className="input-helper">Common: 6&quot;, 9&quot;, 12&quot;. Must be divisible by 3 for equal squares.</span>
                                <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                                    {[3, 4.5, 6, 7.5, 9, 10.5, 12, 13.5, 15].map(s => (
                                        <button key={s} className={`btn btn-sm ${finBlock === s ? "btn-primary" : "btn-ghost"}`} onClick={() => setFinBlock(s)} style={{ fontSize: 10 }}>{s}&quot;</button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {mode === "B" && (
                            <div className="input-group">
                                <label className="input-label">Strip width cut (inches)</label>
                                <input type="number" className="input-field" value={stripWidth} onChange={e => setStripWidth(Math.max(1, parseFloat(e.target.value) || 3.5))} min={1} step={0.25} />
                                <span className="input-helper">Enter the width you already cut your strips at.</span>
                            </div>
                        )}
                        {mode === "C" && (
                            <div className="input-group">
                                <label className="input-label">Individual square cut size (inches)</label>
                                <input type="number" className="input-field" value={sqCutSize} onChange={e => setSqCutSize(Math.max(1, parseFloat(e.target.value) || 3.5))} min={1} step={0.25} />
                            </div>
                        )}
                        <div className="calculator-form-row" style={{ marginTop: 10 }}>
                            <div className="input-group"><label className="input-label">Blocks to make</label>
                                <input type="number" className="input-field" value={blockCount} onChange={e => setBlockCount(Math.max(1, parseInt(e.target.value) || 1))} min={1} /></div>
                            <div className="input-group"><label className="input-label">Usable WOF</label>
                                <input type="number" className="input-field" value={fabricWidth} onChange={e => setFabricWidth(Math.max(36, parseInt(e.target.value) || 42))} min={36} /></div>
                        </div>
                    </div>

                    {/* ② PRIMARY RESULTS */}
                    <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(220,55%,55%)" }}>
                        <h2 className={styles.calcTitle}>② Cutting Dimensions</h2>
                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-start" }}>
                            <div style={{ flex: 1, minWidth: 200 }}>
                                {!calc.isDivisible && <div style={{ padding: 6, background: "hsl(40,40%,95%)", borderRadius: 6, fontSize: 11, marginBottom: 8 }}>⚠️ Block size {toFracIn(calc.finBlk)} does not divide evenly by 3. Squares will be {toFracIn(calc.finSq)} finished.</div>}
                                <div className="result-card" style={{ textAlign: "center", padding: 16 }}>
                                    <div className="result-prefix" style={{ fontSize: 13 }}>Finished Block</div>
                                    <div className="result-value" style={{ fontSize: 32 }}>{toFracIn(calc.finBlk)}</div>
                                    <div className="result-label">Each square: {toFracIn(calc.finSq)} finished</div>
                                </div>
                                <div className={styles.resultDetails} style={{ marginTop: 8 }}>
                                    <div className="result-row"><span>Individual square cut</span><strong>{toFracIn(calc.cutSq)} × {toFracIn(calc.cutSq)}</strong></div>
                                    <div className="result-row"><span>Strip width (strip piecing)</span><strong>{toFracIn(calc.cutSq)} × WOF</strong></div>
                                    <div className="result-row"><span>Sub-cut width</span><strong>{toFracIn(calc.cutSq)}</strong></div>
                                    <div className="result-row"><span>Segments per WOF strip set</span><strong>{calc.segsPerWOF}</strong></div>
                                    <div className="result-row"><span>Blocks per strip set pair</span><strong>{calc.blocksPerSetA}</strong></div>
                                </div>
                                {/* Per block */}
                                <div style={{ marginTop: 8, padding: 8, background: "hsl(220,15%,97%)", borderRadius: 6, fontSize: 12 }}>
                                    <strong>Per block:</strong><br />
                                    Color A (dark): <strong>5 squares</strong> at {toFracIn(calc.cutSq)}<br />
                                    Color B (light): <strong>4 squares</strong> at {toFracIn(calc.cutSq)}
                                </div>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                {blockSVG}
                                <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 4 }}>5A (dark) + 4B (light)</div>
                            </div>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="toolbar" style={{ marginBottom: 10 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} /> Copy</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                    </div>

                    {/* ═══ STRIP PIECING ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowStrip(!showStrip)}>
                            🧵 Strip Piecing Instructions (Step-by-Step)
                            <ChevronDown size={14} style={{ transform: showStrip ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showStrip && (
                            <div style={{ marginTop: 10, fontSize: 12, lineHeight: 2 }}>
                                <div style={{ padding: 10, background: "hsl(220,15%,97%)", borderRadius: 8, marginBottom: 10 }}>
                                    <strong>Step 1: Cut Strips</strong>
                                    <div>□ Cut Color A (dark) strips: <strong>{yard.darkStrips} strips at {toFracIn(calc.cutSq)} × WOF</strong></div>
                                    <div>□ Cut Color B (light) strips: <strong>{yard.lightStrips} strips at {toFracIn(calc.cutSq)} × WOF</strong></div>
                                </div>
                                <div style={{ padding: 10, background: "hsl(150,12%,97%)", borderRadius: 8, marginBottom: 10 }}>
                                    <strong>Step 2: Make Strip Set A (Dark–Light–Dark)</strong>
                                    <div>□ Sew: Dark + Light + Dark (long edges)</div>
                                    <div>□ Press seams toward dark fabric</div>
                                    <div>□ Make <strong>{yard.setANeeded}</strong> of Strip Set A</div>
                                    <div style={{ marginTop: 6, padding: 6, background: "hsl(0,0%,95%)", borderRadius: 4, fontFamily: "monospace", fontSize: 11 }}>
                                        ■■■ DARK ■■■<br />░░░ LIGHT ░░░<br />■■■ DARK ■■■
                                    </div>
                                </div>
                                <div style={{ padding: 10, background: "hsl(40,15%,97%)", borderRadius: 8, marginBottom: 10 }}>
                                    <strong>Step 3: Make Strip Set B (Light–Dark–Light)</strong>
                                    <div>□ Sew: Light + Dark + Light (long edges)</div>
                                    <div>□ Press seams toward dark center strip</div>
                                    <div>□ Make <strong>{yard.setBNeeded}</strong> of Strip Set B</div>
                                    <div style={{ marginTop: 6, padding: 6, background: "hsl(0,0%,95%)", borderRadius: 4, fontFamily: "monospace", fontSize: 11 }}>
                                        ░░░ LIGHT ░░░<br />■■■ DARK ■■■<br />░░░ LIGHT ░░░
                                    </div>
                                </div>
                                <div style={{ padding: 10, background: "hsl(280,12%,97%)", borderRadius: 8, marginBottom: 10 }}>
                                    <strong>Step 4: Sub-Cut Segments</strong>
                                    <div>□ Sub-cut all strip sets at {toFracIn(calc.cutSq)} intervals</div>
                                    <div>□ Each strip set yields {calc.segsPerWOF} segments</div>
                                    <div>□ Set A segments needed: <strong>{blockCount * 2}</strong> (2 per block)</div>
                                    <div>□ Set B segments needed: <strong>{blockCount}</strong> (1 per block)</div>
                                </div>
                                <div style={{ padding: 10, background: "hsl(0,0%,97%)", borderRadius: 8 }}>
                                    <strong>Step 5: Assemble Blocks</strong>
                                    <div>□ Each block: Set A + Set B + Set A</div>
                                    <div>□ Nest seams at intersections for flat joins</div>
                                    <div>□ Press final seams open or consistently to one side</div>
                                    <div>□ Total blocks: <strong>{blockCount}</strong></div>
                                </div>

                                {/* Efficiency comparison */}
                                <div style={{ marginTop: 10, padding: 10, background: "hsl(150,15%,96%)", borderRadius: 8 }}>
                                    <strong>Efficiency: Strip Piecing vs Individual Squares</strong>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 6 }}>
                                        <div style={{ padding: 8, background: "hsl(0,10%,95%)", borderRadius: 6, textAlign: "center" }}>
                                            <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>Individual squares</div>
                                            <div style={{ fontSize: 20, fontWeight: 800, color: "hsl(0,50%,45%)" }}>{yard.indivCuts} cuts</div>
                                        </div>
                                        <div style={{ padding: 8, background: "hsl(150,20%,95%)", borderRadius: 6, textAlign: "center" }}>
                                            <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>Strip piecing</div>
                                            <div style={{ fontSize: 20, fontWeight: 800, color: "hsl(150,50%,35%)" }}>{yard.stripCuts + yard.subCuts} cuts</div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "center", fontSize: 11, marginTop: 4, fontWeight: 600, color: "hsl(150,50%,35%)" }}>
                                        Saves {yard.indivCuts - yard.stripCuts - yard.subCuts} cuts ({Math.round((1 - (yard.stripCuts + yard.subCuts) / yard.indivCuts) * 100)}% fewer)
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ═══ YARDAGE ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowYardage(!showYardage)}>
                            📐 Yardage Calculator for {blockCount} Blocks
                            <ChevronDown size={14} style={{ transform: showYardage ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showYardage && (
                            <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9 }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                                    <div style={{ padding: 12, background: "hsl(220,15%,96%)", borderRadius: 8, textAlign: "center" }}>
                                        <div style={{ fontWeight: 700 }}>Color A (Dark)</div>
                                        <div style={{ fontSize: 10 }}>{yard.darkSqTotal} squares ({blockCount}×5)</div>
                                        <div style={{ fontSize: 10 }}>{yard.darkStrips} strips at {toFracIn(calc.cutSq)}</div>
                                        <div style={{ fontSize: 24, fontWeight: 800, color: "hsl(220,50%,40%)" }}>{toFrac(yard.darkBuy)} yd</div>
                                        <div style={{ fontSize: 10 }}>({yard.darkYd.toFixed(2)} yd exact)</div>
                                    </div>
                                    <div style={{ padding: 12, background: "hsl(45,20%,96%)", borderRadius: 8, textAlign: "center" }}>
                                        <div style={{ fontWeight: 700 }}>Color B (Light)</div>
                                        <div style={{ fontSize: 10 }}>{yard.lightSqTotal} squares ({blockCount}×4)</div>
                                        <div style={{ fontSize: 10 }}>{yard.lightStrips} strips at {toFracIn(calc.cutSq)}</div>
                                        <div style={{ fontSize: 24, fontWeight: 800, color: "hsl(45,50%,35%)" }}>{toFrac(yard.lightBuy)} yd</div>
                                        <div style={{ fontSize: 10 }}>({yard.lightYd.toFixed(2)} yd exact)</div>
                                    </div>
                                </div>
                                <div style={{ padding: 8, background: "hsl(0,0%,97%)", borderRadius: 6, textAlign: "center", fontWeight: 700, fontSize: 14 }}>
                                    Total: {toFrac(yard.darkBuy + yard.lightBuy)} yards ({(yard.darkBuy + yard.lightBuy).toFixed(2)} yd)
                                </div>
                                <div style={{ marginTop: 8, fontSize: 11, color: "var(--color-text-secondary)" }}>
                                    <strong>Strip sets:</strong> {yard.setANeeded} × Set A (D-L-D) + {yard.setBNeeded} × Set B (L-D-L)
                                </div>
                                <div style={{ marginTop: 4, fontSize: 11, color: "var(--color-text-secondary)" }}>
                                    <strong>Quilt size ({blockCount} blocks):</strong>{" "}
                                    {(() => { const cols = Math.ceil(Math.sqrt(blockCount)); const rows = Math.ceil(blockCount / cols); return `${cols}×${rows} = ${(cols * calc.finBlk).toFixed(0)}"×${(rows * calc.finBlk).toFixed(0)}" (blocks only)`; })()}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ═══ SCRAPPY ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowScrappy(!showScrappy)}>
                            🎨 Scrappy Nine-Patch Planner
                            <ChevronDown size={14} style={{ transform: showScrappy ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showScrappy && (
                            <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9 }}>
                                <div className="input-group" style={{ marginBottom: 8 }}>
                                    <label className="input-label">Number of different fabrics</label>
                                    <input type="number" className="input-field" value={scrappyFabrics} onChange={e => setScrappyFabrics(Math.max(2, parseInt(e.target.value) || 2))} min={2} max={100} />
                                </div>
                                {(() => {
                                    const totalSq = blockCount * 9;
                                    const sqPerFab = Math.ceil(totalSq / scrappyFabrics);
                                    const stripsPerFab = Math.ceil(sqPerFab / calc.segsPerWOF);
                                    const ydPerFab = (stripsPerFab * calc.cutSq) / 36;
                                    const buyPerFab = Math.ceil(ydPerFab * 8) / 8;
                                    return (
                                        <div className={styles.resultDetails}>
                                            <div className="result-row"><span>Total squares needed</span><strong>{totalSq} ({blockCount}×9)</strong></div>
                                            <div className="result-row"><span>Squares per fabric</span><strong>{sqPerFab} ({totalSq}÷{scrappyFabrics})</strong></div>
                                            <div className="result-row"><span>WOF strips per fabric</span><strong>{stripsPerFab} at {toFracIn(calc.cutSq)}</strong></div>
                                            <div className="result-row"><span>Yardage per fabric</span><strong style={{ color: "hsl(150,50%,35%)" }}>{toFrac(buyPerFab)} yd</strong></div>
                                            <div className="result-row"><span>Total across {scrappyFabrics} fabrics</span><strong>{toFrac(buyPerFab * scrappyFabrics)} yd</strong></div>
                                            <div style={{ marginTop: 8, fontSize: 11, padding: 6, background: "hsl(0,0%,97%)", borderRadius: 4 }}>
                                                <strong>Minimum useful scrap sizes:</strong><br />
                                                1 square: {toFracIn(calc.cutSq)} × {toFracIn(calc.cutSq)} | 4 squares: {toFracIn(calc.cutSq * 2)} × {toFracIn(calc.cutSq * 2)} | 12 squares: 1 WOF strip
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        )}
                    </div>

                    {/* ═══ DOUBLE NINE-PATCH ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowDouble(!showDouble)}>
                            ⊞ Double Nine-Patch Calculator
                            <ChevronDown size={14} style={{ transform: showDouble ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showDouble && (
                            <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9 }}>
                                <div style={{ padding: 10, background: "hsl(260,12%,97%)", borderRadius: 8, marginBottom: 8 }}>
                                    A double nine-patch: 5 of the 9 inner squares are themselves mini nine-patches; 4 are plain squares.
                                </div>
                                <div className={styles.resultDetails}>
                                    <div className="result-row"><span>Outer block</span><strong>{toFracIn(dbl.outerFin)} finished</strong></div>
                                    <div className="result-row"><span>Inner square</span><strong>{toFracIn(dbl.innerFin)} finished</strong></div>
                                    <div className="result-row"><span>Tiny square (inner NP)</span><strong>{toFracIn(dbl.tinySq)} fin → cut at {toFracIn(dbl.tinyCut)}</strong></div>
                                    <div className="result-row"><span>Plain inner square cut</span><strong>{toFracIn(dbl.plainCut)} × {toFracIn(dbl.plainCut)}</strong></div>
                                </div>
                                <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600 }}>Per outer block:</div>
                                <div className={styles.resultDetails}>
                                    <div className="result-row"><span>Inner nine-patches</span><strong>{dbl.innerNPperBlock}</strong></div>
                                    <div className="result-row"><span>Plain squares</span><strong>{dbl.plainPerBlock} at {toFracIn(dbl.plainCut)}</strong></div>
                                    <div className="result-row"><span>Tiny dark squares</span><strong>{dbl.tinyDarkPerBlock} at {toFracIn(dbl.tinyCut)}</strong></div>
                                    <div className="result-row"><span>Tiny light squares</span><strong>{dbl.tinyLightPerBlock} at {toFracIn(dbl.tinyCut)}</strong></div>
                                </div>
                                {blockCount > 1 && <>
                                    <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600 }}>For {blockCount} blocks:</div>
                                    <div className={styles.resultDetails}>
                                        <div className="result-row"><span>Inner nine-patches total</span><strong>{blockCount * dbl.innerNPperBlock}</strong></div>
                                        <div className="result-row"><span>Plain squares total</span><strong>{blockCount * dbl.plainPerBlock} at {toFracIn(dbl.plainCut)}</strong></div>
                                        <div className="result-row"><span>Tiny dark squares</span><strong>{blockCount * dbl.tinyDarkPerBlock} at {toFracIn(dbl.tinyCut)}</strong></div>
                                        <div className="result-row"><span>Tiny light squares</span><strong>{blockCount * dbl.tinyLightPerBlock} at {toFracIn(dbl.tinyCut)}</strong></div>
                                    </div>
                                </>}
                            </div>
                        )}
                    </div>

                    {/* ═══ REFERENCE TABLE ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Nine-Patch Block Reference</h2>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
                                <thead><tr>
                                    <th style={tH}>Finished Block</th><th style={tH}>Each Sq</th><th style={tH}>Cut Size</th><th style={tH}>Strip Width</th><th style={{ ...tH, ...tR }}>Segs/WOF</th><th style={{ ...tH, ...tR }}>Blocks/Set</th>
                                </tr></thead>
                                <tbody>{refSizes.map(b => {
                                    const sq = b / 3, cut = sq + SA, segs = Math.floor(WOF / cut), blks = Math.floor(segs / 2);
                                    const active = Math.abs(b - calc.finBlk) < 0.01;
                                    return (
                                        <tr key={b} style={{ background: active ? "hsl(220,25%,93%)" : undefined, cursor: "pointer" }} onClick={() => { setMode("A"); setFinBlock(b); }}>
                                            <td style={{ ...tD, fontWeight: 600 }}>{toFracIn(b)}</td>
                                            <td style={tD}>{toFracIn(sq)}</td>
                                            <td style={{ ...tD, fontWeight: 600 }}>{toFracIn(cut)}</td>
                                            <td style={tD}>{toFracIn(cut)}</td>
                                            <td style={{ ...tD, ...tR }}>{segs}</td>
                                            <td style={{ ...tD, ...tR }}>{blks}</td>
                                        </tr>
                                    );
                                })}</tbody>
                            </table>
                        </div>
                        <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 4 }}>Based on 42&quot; usable WOF. Click any row to select that size.</div>
                    </div>

                    {/* ═══ TROUBLESHOOTING ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowTrouble(!showTrouble)}>
                            🔧 Troubleshooting Nine-Patch Blocks
                            <ChevronDown size={14} style={{ transform: showTrouble ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showTrouble && (
                            <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9, color: "var(--color-text-secondary)" }}>
                                {[
                                    { title: "Blocks finishing too small", cause: "Seam allowance too wide. Each extra ⅛\" per seam loses 1\" total across a nine-patch.", fix: "Check seam allowance with a test strip. Use a ¼\" presser foot." },
                                    { title: "Bulky intersections", cause: "Seams not nested when assembling rows.", fix: "Press Set A seams one direction, Set B opposite. They interlock when placed together." },
                                    { title: "Checkerboard pattern broken", cause: "Segment placed in wrong direction or wrong arrangement used.", fix: "Always: Dark-Light-Dark = rows 1 & 3, Light-Dark-Light = row 2. Lay out before sewing." },
                                    { title: "Stretched strip piecing edges", cause: "Pulling fabric through machine or no seam guide.", fix: "Use a walking foot. Let feed dogs do the work. Press strips flat before sub-cutting." },
                                ].map((t, i) => (
                                    <div key={i} style={{ padding: 8, background: i % 2 === 0 ? "hsl(0,0%,97%)" : "transparent", borderRadius: 6, marginBottom: 4 }}>
                                        <strong style={{ color: "var(--color-text-primary)" }}>{t.title}</strong><br />
                                        <span style={{ fontSize: 11 }}>Cause: {t.cause}</span><br />
                                        <span style={{ fontSize: 11, color: "hsl(150,50%,35%)" }}>Fix: {t.fix}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ═══ EDUCATIONAL ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowEdu(!showEdu)}>
                            📚 Understanding Nine-Patch Blocks
                            <ChevronDown size={14} style={{ transform: showEdu ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showEdu && (
                            <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.9, color: "var(--color-text-secondary)" }}>
                                <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>What Is a Nine-Patch?</h4>
                                <p style={{ fontSize: 12 }}>Nine squares in a 3×3 grid — the most fundamental quilt block after a plain square. It&apos;s the gateway block for beginners and the foundation for Irish Chain, Double Nine-Patch, and countless other patterns.</p>
                                <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 10 }}>Why 5 and 4?</h4>
                                <p style={{ fontSize: 12 }}>The checkerboard pattern alternates colors. In a 3×3 grid, corners + center = 5 odd positions (Color A), and sides = 4 even positions (Color B). The 5-square color appears more dominant — typically the darker or feature fabric.</p>
                                <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 10 }}>Which Pre-Cuts Work?</h4>
                                <p style={{ fontSize: 12 }}>
                                    • <strong>Jelly rolls (2.5&quot;)</strong> → 6&quot; finished block (2&quot; squares)<br />
                                    • <strong>Charm squares (5&quot;)</strong> → cut into four 2.5&quot; pieces for 6&quot; blocks<br />
                                    • For 9&quot; blocks (3&quot; squares), cut 3.5&quot; strips from yardage — no standard pre-cut matches
                                </p>
                                <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 10 }}>Nesting Seams</h4>
                                <p style={{ fontSize: 12 }}>The key to flat nine-patches: press Row 1&amp;3 seams one direction and Row 2 opposite. When placed right-sides-together, seams interlock at every intersection, eliminating bulk.</p>
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
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Quick Reference</h4>
                        <div style={{ fontSize: 12, lineHeight: 2.2, color: "var(--color-text-secondary)" }}>
                            <div>Block: <strong>{toFracIn(calc.finBlk)}</strong></div>
                            <div>Square: <strong>{toFracIn(calc.finSq)} fin</strong></div>
                            <div>Cut: <strong>{toFracIn(calc.cutSq)}</strong></div>
                            <div>Strip: <strong>{toFracIn(calc.cutSq)} × WOF</strong></div>
                            <div>Segs/WOF: <strong>{calc.segsPerWOF}</strong></div>
                            <div>Blocks/set: <strong>{calc.blocksPerSetA}</strong></div>
                        </div>
                    </div>
                    <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>The Formula</h4>
                        <div style={{ fontSize: 11, padding: 8, background: "hsl(0,0%,96%)", borderRadius: 6, fontFamily: "monospace", lineHeight: 2 }}>
                            Square = Block ÷ 3<br />
                            Cut = Square + ½&quot;<br />
                            Strip = Cut width × WOF<br />
                            Segs = WOF ÷ Cut<br />
                            Blocks/set = Segs ÷ 2
                        </div>
                    </div>
                    <div className="glass-card related-tools">
                        <h4>Related Tools</h4>
                        <a href="/quilt/snowball-calculator" className="related-tool-link">Snowball Calculator</a>
                        <a href="/quilt/irish-chain-calculator" className="related-tool-link">Irish Chain Calculator</a>
                        <a href="/quilt/size-calculator" className="related-tool-link">Quilt Size Calculator</a>
                        <a href="/quilt/blocks-needed" className="related-tool-link">Blocks Needed Calculator</a>
                        <a href="/quilt/sashing-calculator" className="related-tool-link">Sashing Calculator</a>
                        <a href="/quilt/border-calculator" className="related-tool-link">Border Calculator</a>
                        <a href="/quilt/backing-calculator" className="related-tool-link">Backing Calculator</a>
                        <a href="/quilt/binding-calculator" className="related-tool-link">Binding Calculator</a>
                        <a href="/quilt" className="related-tool-link">All Quilt Tools</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}