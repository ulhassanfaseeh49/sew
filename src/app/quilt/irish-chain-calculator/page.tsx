"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Grid3X3, ClipboardCopy, Printer, ChevronDown } from "lucide-react";

/* ─── helpers ─── */
function toFrac(v: number): string {
    const w = Math.floor(v); const r = v - w;
    const m: [number, string][] = [[.125, "⅛"], [.25, "¼"], [.375, "⅜"], [.5, "½"], [.625, "⅝"], [.75, "¾"], [.875, "⅞"]];
    for (const [t, s] of m) if (Math.abs(r - t) < .02) return w > 0 ? `${w}${s}` : s;
    if (r < .05) return `${w || "0"}`;
    return v.toFixed(2);
}
const roundUp8 = (v: number) => Math.ceil(v * 8) / 8;

type ChainType = "single" | "double" | "triple";
const GRID: Record<ChainType, number> = { single: 3, double: 5, triple: 7 };
const LABELS: Record<ChainType, string> = { single: "Single", double: "Double", triple: "Triple" };

const PRESETS: Record<ChainType, number[]> = {
    single: [6, 9, 12, 15],
    double: [10, 15, 20],
    triple: [7, 14, 21],
};

/* ─── core math: square counts per block ─── */
function blockSquares(type: ChainType) {
    const g = GRID[type];
    // Block A checkerboard: chain on odd positions (0-indexed r+c even)
    let chainA = 0, bgA = 0;
    for (let r = 0; r < g; r++) for (let c = 0; c < g; c++) { if ((r + c) % 2 === 0) chainA++; else bgA++; }
    // Block B
    let chainB = 0, bgB = 0;
    if (type === "single") { bgB = 1; chainB = 0; }  // plain square
    else {
        // corners get chain, rest bg
        for (let r = 0; r < g; r++) for (let c = 0; c < g; c++) {
            const isCorner = (r === 0 || r === g - 1) && (c === 0 || c === g - 1);
            if (isCorner) chainB++; else bgB++;
        }
    }
    return { chainA, bgA, chainB, bgB, grid: g };
}

/* ─── strip set calculations ─── */
function calcStripSets(type: ChainType, blockSize: number, blocksAcross: number, blocksDown: number, fabricW: number) {
    const g = GRID[type];
    const sq = blockSize / g;           // chain square finished
    const cut = sq + 0.5;              // unfinished size (+ seam)
    const usable = fabricW - 0.5;      // usable WOF
    const segsPerSet = Math.floor(usable / cut);

    const totalBlocks = blocksAcross * blocksDown;
    const halfBlocks = Math.ceil(totalBlocks / 2);
    const numA = halfBlocks;
    const numB = totalBlocks - numA;

    // Strip set types
    const oddRows = Math.ceil(g / 2);   // rows 1,3,5... in block A
    const evenRows = Math.floor(g / 2); // rows 2,4...

    const segsSetA = numA * oddRows;    // each block A needs oddRows segments from set A
    const setsA = Math.ceil(segsSetA / segsPerSet);
    const segsSetB = numA * evenRows;
    const setsB = Math.ceil(segsSetB / segsPerSet);

    // Strip counts for set A: g strips, alternating A-B-A-B-A
    const chainStripsPerSetA = Math.ceil(g / 2);  // Color A strips
    const bgStripsPerSetA = Math.floor(g / 2);
    const chainStripsPerSetB = Math.floor(g / 2);
    const bgStripsPerSetB = Math.ceil(g / 2);

    const totalChainStripsA = setsA * chainStripsPerSetA + setsB * chainStripsPerSetB;
    const totalBgStripsA = setsA * bgStripsPerSetA + setsB * bgStripsPerSetB;

    // Block B pieces
    let blockBChainSq = 0, blockBBgSq = 0, blockBCenterSize = 0;
    if (type === "single") {
        blockBChainSq = 0; blockBBgSq = 0;  // just one big square
        blockBCenterSize = blockSize + 0.5;
    } else {
        blockBChainSq = 4;  // corner squares
        blockBBgSq = 2 * (g - 2) * 2;  // edge bg squares (top/bottom rows minus corners, left/right cols minus corners)
        // Actually: top row = g-2 bg, bottom row = g-2 bg, left col (minus corners) = g-2, right col = g-2
        // But center is one big piece
        blockBBgSq = (g - 2) * 2 + (g - 2) * 2;  // 4*(g-2) edge pieces
        // Actually simpler: top/bottom rows each have g squares, 2 are chain corners, g-2 are bg
        // left/right cols (inner) each have g-2 squares (excluding corners already counted)
        // So edge bg = 2*(g-2) + 2*(g-2) = 4*(g-2)
        blockBBgSq = 4 * (g - 2);
        blockBCenterSize = (g - 2) * sq + 0.5;  // center piece: (g-2) squares combined + seam
    }

    const totalBlockBChainSq = numB * blockBChainSq;
    const blockBChainStrips = Math.ceil(totalBlockBChainSq / Math.floor(usable / cut));

    // Yardage
    const totalChainStrips = totalChainStripsA + blockBChainStrips;
    const chainYardage = (totalChainStrips * cut) / 36;

    // Background: strips + block B squares + center pieces
    const bgStripYardage = (totalBgStripsA * cut) / 36;
    let bgBlockBYardage = 0;
    if (type === "single") {
        // plain squares
        const sqPerRow = Math.floor(usable / (blockSize + 0.5));
        const rows = Math.ceil(numB / sqPerRow);
        bgBlockBYardage = (rows * (blockSize + 0.5)) / 36;
    } else {
        // edge bg squares from strips
        const bgEdgeStrips = Math.ceil((numB * blockBBgSq) / Math.floor(usable / cut));
        bgBlockBYardage = (bgEdgeStrips * cut) / 36;
        // center pieces
        const centersPerRow = Math.floor(usable / blockBCenterSize);
        const centerRows = Math.ceil(numB / Math.max(centersPerRow, 1));
        bgBlockBYardage += (centerRows * blockBCenterSize) / 36;
    }
    const bgYardage = bgStripYardage + bgBlockBYardage;

    return {
        sq, cut, segsPerSet, totalBlocks, numA, numB,
        oddRows, evenRows,
        setsA, setsB, segsSetA, segsSetB,
        chainStripsPerSetA, bgStripsPerSetA, chainStripsPerSetB, bgStripsPerSetB,
        totalChainStripsA, totalBgStripsA, blockBChainStrips,
        totalChainStrips,
        blockBChainSq, blockBBgSq, blockBCenterSize,
        totalBlockBChainSq,
        chainYardage: roundUp8(chainYardage),
        bgYardage: roundUp8(bgYardage),
        buyChain: roundUp8(chainYardage * 1.1),
        buyBg: roundUp8(bgYardage * 1.1),
        quiltW: blocksAcross * blockSize,
        quiltH: blocksDown * blockSize,
        unfinBlock: blockSize + 0.5,
    };
}

/* ─── block grid SVG ─── */
function BlockGrid({ type, size }: { type: ChainType; size: number }) {
    const g = GRID[type];
    const cell = size / g;
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ border: "1px solid hsl(0,0%,80%)", borderRadius: 4 }}>
            {Array.from({ length: g }, (_, r) => Array.from({ length: g }, (_, c) => {
                const isChain = (r + c) % 2 === 0;
                return <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell}
                    fill={isChain ? "hsl(150,45%,45%)" : "hsl(45,20%,92%)"} stroke="hsl(0,0%,75%)" strokeWidth={0.5} />;
            }))}
        </svg>
    );
}

function BlockBGrid({ type, size }: { type: ChainType; size: number }) {
    const g = GRID[type];
    const cell = size / g;
    if (type === "single") return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ border: "1px solid hsl(0,0%,80%)", borderRadius: 4 }}>
            <rect width={size} height={size} fill="hsl(45,20%,92%)" />
        </svg>
    );
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ border: "1px solid hsl(0,0%,80%)", borderRadius: 4 }}>
            <rect width={size} height={size} fill="hsl(45,20%,92%)" stroke="hsl(0,0%,75%)" strokeWidth={0.5} />
            {/* corner chain squares */}
            {[[0, 0], [0, g - 1], [g - 1, 0], [g - 1, g - 1]].map(([r, c]) => (
                <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell}
                    fill="hsl(150,45%,45%)" stroke="hsl(0,0%,75%)" strokeWidth={0.5} />
            ))}
            {/* edge squares (non-corner top/bottom rows) */}
            {[0, g - 1].map(r => Array.from({ length: g - 2 }, (_, i) => (
                <rect key={`e${r}-${i + 1}`} x={(i + 1) * cell} y={r * cell} width={cell} height={cell}
                    fill="hsl(45,20%,92%)" stroke="hsl(0,0%,80%)" strokeWidth={0.3} />
            )))}
            {/* center big piece outline */}
            <rect x={cell} y={cell} width={(g - 2) * cell} height={(g - 2) * cell}
                fill="hsl(45,20%,92%)" stroke="hsl(0,0%,75%)" strokeWidth={0.8} strokeDasharray="3,2" />
            <text x={size / 2} y={size / 2 + 3} textAnchor="middle" fontSize={Math.max(8, cell * 0.6)} fill="hsl(0,0%,60%)">center</text>
        </svg>
    );
}

/* ─── FAQ ─── */
const faqItems = [
    { q: "What is a Single Irish Chain quilt?", a: "A Single Irish Chain uses two alternating blocks: a 9-patch chain block and a plain alternate block. When placed in a checkerboard pattern, the chain-color squares align diagonally to create continuous chain lines. It's the simplest Irish Chain — great for beginners." },
    { q: "What is the difference between Single and Double Irish Chain?", a: "Single Irish Chain uses a 3×3 (9-patch) grid and creates thin diagonal chains. Double Irish Chain uses a 5×5 grid and creates wider, bolder chains. The key difference: Double Irish Chain's alternate block is NOT a plain square — it has chain-color squares in its corners." },
    { q: "What size blocks for an Irish Chain quilt?", a: "Block size must divide evenly by the grid number. Single (÷3): 6\", 9\", 12\", 15\". Double (÷5): 10\", 15\", 20\". Triple (÷7): 7\", 14\", 21\". The most popular sizes are 9\" Single, 15\" Double, and 14\" Triple." },
    { q: "How does strip piecing work for Irish Chain?", a: "Cut long strips at the chain square width + ½\" seam. Sew strips into sets (alternating colors), then sub-cut into segments. Each segment becomes one row of a block. Assemble rows to complete the block. Much faster than cutting individual squares." },
    { q: "Why does my Irish Chain look broken?", a: "Most likely cause: Block B (alternate block) is rotated incorrectly. In Double Irish Chain, Block B has chain squares in its corners — if rotated 90°, the corners move to wrong positions and break the chain. Mark an arrow on each Block B before assembly." },
    { q: "Is the alternate block in Double Irish Chain a plain square?", a: "No! This is the most common mistake. Block B in Double Irish Chain has chain-color squares sewn into its four corners and bg squares along the edges, with a large bg center piece. Without these corner squares, the chain appears broken at block boundaries." },
    { q: "How much fabric do I need for an Irish Chain quilt?", a: "It depends on chain type, block size, and block count. Use this calculator for exact yardage. As a rough guide: a Double Irish Chain throw (4×6 blocks at 15\") needs about 2.75 yards chain color and 4 yards background." },
    { q: "How do I calculate Irish Chain for a queen bed?", a: "Target ~90\"×105\". For 15\" Double Irish Chain: 6×7=42 blocks, but 7 is odd. Use 6×6=36 blocks (90\"×90\") and add borders to reach 105\". Irish Chain requires even block counts in both directions." },
    { q: "What is a Triple Irish Chain quilt?", a: "Triple Irish Chain uses a 7×7 grid per block (49 squares), creating three parallel diagonal chain lines for maximum drama. It's an advanced project — 14\" blocks with 2\" chain squares are the most popular Triple configuration." },
    { q: "Why does Irish Chain need an even number of blocks?", a: "Blocks A and B must alternate in a checkerboard. With even counts, all four edges start and end consistently. With odd counts, opposite edges start with different block types, making the chain asymmetric and visually unbalanced." },
];

export default function Page() {
    const [type, setType] = useState<ChainType>("double");
    const [blockSize, setBlockSize] = useState(15);
    const [across, setAcross] = useState(4);
    const [down, setDown] = useState(6);
    const [fabricW, setFabricW] = useState(42);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [showRef, setShowRef] = useState(false);
    const [showTrouble, setShowTrouble] = useState(false);
    const [showEdu, setShowEdu] = useState(false);

    const grid = GRID[type];
    const divisible = blockSize % grid === 0;
    const nearLow = Math.floor(blockSize / grid) * grid;
    const nearHigh = nearLow + grid;

    const calc = useMemo(() => {
        if (!divisible || blockSize <= 0) return null;
        return calcStripSets(type, blockSize, across, down, fabricW);
    }, [type, blockSize, across, down, fabricW, divisible]);

    const sq = blockSquares(type);
    const oddAcross = across % 2 !== 0;
    const oddDown = down % 2 !== 0;

    const copyText = calc
        ? `${LABELS[type]} Irish Chain, ${toFrac(blockSize)}" blocks, ${across}×${down} layout. Chain sq: ${toFrac(calc.sq)}". Strip Sets A: ${calc.setsA}, B: ${calc.setsB}. Buy: ${calc.buyChain} yd chain, ${calc.buyBg} yd background. Quilt: ${calc.quiltW}"×${calc.quiltH}".`
        : "";

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "Irish Chain Calculator" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    {/* HEADER */}
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Grid3X3 size={14} strokeWidth={1.5} /> Quilt #157</span>
                        <h1>Irish Chain Quilt Calculator</h1>
                        <p>Calculate strip sets, cutting sizes, piece counts, and yardage for Single, Double, and Triple Irish Chain quilts. Includes complete strip piecing production plan and alternate block explanation.</p>
                    </div>

                    {/* ① CHAIN TYPE */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>① Irish Chain Type</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                            {(["single", "double", "triple"] as ChainType[]).map(t => (
                                <button key={t} className={`btn ${type === t ? "btn-primary" : "btn-secondary"}`}
                                    onClick={() => { setType(t); setBlockSize(PRESETS[t][1] || PRESETS[t][0]); }}
                                    style={{ padding: "10px 6px", textAlign: "center" }}>
                                    <div style={{ fontWeight: 700, fontSize: 14 }}>{LABELS[t]}</div>
                                    <div style={{ fontSize: 10, opacity: .7 }}>{GRID[t]}×{GRID[t]} grid</div>
                                    <div style={{ marginTop: 4 }}><BlockGrid type={t} size={50} /></div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ② BLOCK SIZE */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>② Finished Block Size</h2>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
                            {PRESETS[type].map(s => (
                                <button key={s} className={`btn btn-sm ${blockSize === s ? "btn-primary" : "btn-secondary"}`}
                                    onClick={() => setBlockSize(s)}>
                                    {s}&quot; → {toFrac(s / grid)}&quot; squares
                                </button>
                            ))}
                        </div>
                        <div className="input-group">
                            <input type="number" className="input-field" value={blockSize}
                                onChange={e => setBlockSize(parseFloat(e.target.value) || 1)} min={1} max={42} />
                        </div>
                        {!divisible && blockSize > 0 && (
                            <div style={{ marginTop: 6, padding: 8, background: "hsl(40,80%,95%)", borderRadius: 6, fontSize: 12, color: "hsl(30,70%,35%)" }}>
                                ⚠️ {blockSize}&quot; does not divide evenly by {grid}. Nearest valid: <strong>{nearLow}&quot;</strong> or <strong>{nearHigh}&quot;</strong>.
                                <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
                                    {nearLow > 0 && <button className="btn btn-sm btn-secondary" onClick={() => setBlockSize(nearLow)}>{nearLow}&quot;</button>}
                                    <button className="btn btn-sm btn-secondary" onClick={() => setBlockSize(nearHigh)}>{nearHigh}&quot;</button>
                                </div>
                            </div>
                        )}
                        {divisible && blockSize > 0 && (
                            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 4 }}>
                                Chain square: {toFrac(blockSize / grid)}&quot; finished | Strip width: {toFrac(blockSize / grid + 0.5)}&quot;
                            </div>
                        )}
                    </div>

                    {/* ③ LAYOUT */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>③ Quilt Layout</h2>
                        <div className="calculator-form-row">
                            <div className="input-group">
                                <label className="input-label">Blocks across</label>
                                <input type="number" className="input-field" value={across}
                                    onChange={e => setAcross(parseInt(e.target.value) || 2)} min={2} max={20} />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Blocks down</label>
                                <input type="number" className="input-field" value={down}
                                    onChange={e => setDown(parseInt(e.target.value) || 2)} min={2} max={20} />
                            </div>
                        </div>
                        {(oddAcross || oddDown) && (
                            <div style={{ marginTop: 6, padding: 8, background: "hsl(40,80%,95%)", borderRadius: 6, fontSize: 12, color: "hsl(30,70%,35%)" }}>
                                ⚠️ Irish Chain needs even block counts. {oddAcross && <span>Across: try {across - 1} or {across + 1}. </span>}{oddDown && <span>Down: try {down - 1} or {down + 1}.</span>}
                            </div>
                        )}
                        {calc && (
                            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 4 }}>
                                {across} × {down} = {calc.totalBlocks} blocks ({calc.numA} Block A + {calc.numB} Block B) | Quilt: {calc.quiltW}&quot; × {calc.quiltH}&quot;
                            </div>
                        )}
                    </div>

                    {/* ═══ BLOCK DIAGRAMS ═══ */}
                    {calc && (
                        <div className={`glass-card ${styles.calculatorCard}`}>
                            <h2 className={styles.calcTitle}>Block Structure</h2>
                            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                                <div style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Block A — Chain Block ({grid}×{grid})</div>
                                    <BlockGrid type={type} size={120} />
                                    <div style={{ fontSize: 10, marginTop: 4 }}>Chain: {sq.chainA} | Bg: {sq.bgA}</div>
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>Block B — Alternate Block</div>
                                    <BlockBGrid type={type} size={120} />
                                    <div style={{ fontSize: 10, marginTop: 4 }}>
                                        {type === "single" ? "Plain background square" : `Chain corners: ${sq.chainB} | Bg: ${sq.bgB}`}
                                    </div>
                                </div>
                            </div>
                            {type !== "single" && (
                                <div style={{ marginTop: 8, padding: 8, background: "hsl(0,30%,97%)", borderRadius: 6, fontSize: 11 }}>
                                    ⚠️ <strong>Block B is NOT a plain square!</strong> It has chain-color squares in all 4 corners plus a large background center ({toFrac(calc.blockBCenterSize)}&quot; unfinished).
                                </div>
                            )}
                        </div>
                    )}

                    {/* ═══ STRIP SET PLAN ═══ */}
                    {calc && (
                        <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(150,60%,40%)" }}>
                            <h2 className={styles.calcTitle}>Strip Set Production Plan</h2>

                            {/* STRIP SET A */}
                            <div style={{ padding: 10, background: "hsl(150,20%,97%)", borderRadius: 6, marginBottom: 8, fontSize: 12, lineHeight: 1.9 }}>
                                <div style={{ fontWeight: 700, fontSize: 13 }}>Strip Set A ({Array.from({ length: grid }, (_, i) => i % 2 === 0 ? "A" : "B").join("-")})</div>
                                <div>For Block A rows {Array.from({ length: calc.oddRows }, (_, i) => i * 2 + 1).join(", ")}</div>
                                <div>Strip width: <strong>{toFrac(calc.cut)}&quot;</strong> × WOF</div>
                                <div>Strips per set: {calc.chainStripsPerSetA} chain + {calc.bgStripsPerSetA} background = {grid}</div>
                                <div>Sub-cut at: {toFrac(calc.cut)}&quot; intervals → {calc.segsPerSet} segments/set</div>
                                <div>Segments needed: {calc.segsSetA} ({calc.numA} blocks × {calc.oddRows} rows)</div>
                                <div style={{ fontWeight: 700 }}>Make {calc.setsA} strip set{calc.setsA > 1 ? "s" : ""}</div>
                            </div>

                            {/* STRIP SET B */}
                            <div style={{ padding: 10, background: "hsl(200,20%,97%)", borderRadius: 6, marginBottom: 8, fontSize: 12, lineHeight: 1.9 }}>
                                <div style={{ fontWeight: 700, fontSize: 13 }}>Strip Set B ({Array.from({ length: grid }, (_, i) => i % 2 === 0 ? "B" : "A").join("-")})</div>
                                <div>For Block A rows {Array.from({ length: calc.evenRows }, (_, i) => i * 2 + 2).join(", ")}</div>
                                <div>Strip width: <strong>{toFrac(calc.cut)}&quot;</strong> × WOF</div>
                                <div>Strips per set: {calc.chainStripsPerSetB} chain + {calc.bgStripsPerSetB} background = {grid}</div>
                                <div>Sub-cut at: {toFrac(calc.cut)}&quot; intervals → {calc.segsPerSet} segments/set</div>
                                <div>Segments needed: {calc.segsSetB} ({calc.numA} blocks × {calc.evenRows} rows)</div>
                                <div style={{ fontWeight: 700 }}>Make {calc.setsB} strip set{calc.setsB > 1 ? "s" : ""}</div>
                            </div>

                            {/* BLOCK B CUTTING */}
                            <div style={{ padding: 10, background: "hsl(45,30%,96%)", borderRadius: 6, marginBottom: 8, fontSize: 12, lineHeight: 1.9 }}>
                                <div style={{ fontWeight: 700, fontSize: 13 }}>Block B Cutting — {calc.numB} blocks</div>
                                {type === "single" ? (
                                    <div>Cut {calc.numB} background squares at <strong>{toFrac(calc.unfinBlock)}&quot; × {toFrac(calc.unfinBlock)}&quot;</strong></div>
                                ) : (
                                    <>
                                        <div>Corner chain squares: {calc.totalBlockBChainSq} total ({calc.blockBChainSq} per block) at {toFrac(calc.cut)}&quot;</div>
                                        <div>Edge bg squares: {calc.numB * calc.blockBBgSq} total ({calc.blockBBgSq} per block) at {toFrac(calc.cut)}&quot;</div>
                                        <div>Center bg pieces: {calc.numB} at <strong>{toFrac(calc.blockBCenterSize)}&quot; × {toFrac(calc.blockBCenterSize)}&quot;</strong></div>
                                    </>
                                )}
                            </div>

                            {/* ASSEMBLY */}
                            <div style={{ padding: 10, background: "hsl(280,15%,97%)", borderRadius: 6, fontSize: 12, lineHeight: 1.9 }}>
                                <div style={{ fontWeight: 700, fontSize: 13 }}>Assembly</div>
                                <div>Block A: Arrange {calc.oddRows} Set A segments + {calc.evenRows} Set B segments → sew rows → trim to {toFrac(calc.unfinBlock)}&quot;</div>
                                <div>Block B: {type === "single" ? `Already cut at ${toFrac(calc.unfinBlock)}"` : `Assemble corners + edges + center → trim to ${toFrac(calc.unfinBlock)}"`}</div>
                                <div>Layout: Alternate A and B in checkerboard → verify chain diagonals → sew rows</div>
                            </div>
                        </div>
                    )}

                    {/* ═══ YARDAGE ═══ */}
                    {calc && (
                        <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(280,50%,55%)" }}>
                            <h2 className={styles.calcTitle}>Yardage Summary</h2>
                            <div style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
                                    <thead><tr style={{ borderBottom: "2px solid hsl(0,0%,85%)" }}>
                                        <th style={{ textAlign: "left", padding: "6px 4px" }}>Fabric</th>
                                        <th style={{ textAlign: "right", padding: "6px 4px" }}>Strips</th>
                                        <th style={{ textAlign: "right", padding: "6px 4px" }}>Calculated</th>
                                        <th style={{ textAlign: "right", padding: "6px 4px", fontWeight: 700 }}>Buy</th>
                                    </tr></thead>
                                    <tbody>
                                        <tr style={{ borderBottom: "1px solid hsl(0,0%,92%)" }}>
                                            <td style={{ padding: "5px 4px" }}>🟩 Chain color (A)</td>
                                            <td style={{ textAlign: "right", padding: "5px 4px" }}>{calc.totalChainStrips}</td>
                                            <td style={{ textAlign: "right", padding: "5px 4px" }}>{calc.chainYardage.toFixed(2)} yd</td>
                                            <td style={{ textAlign: "right", padding: "5px 4px", fontWeight: 700, fontSize: 14 }}>{calc.buyChain.toFixed(2)} yd</td>
                                        </tr>
                                        <tr style={{ borderBottom: "1px solid hsl(0,0%,92%)" }}>
                                            <td style={{ padding: "5px 4px" }}>⬜ Background (B)</td>
                                            <td style={{ textAlign: "right", padding: "5px 4px" }}>{calc.totalBgStripsA}+</td>
                                            <td style={{ textAlign: "right", padding: "5px 4px" }}>{calc.bgYardage.toFixed(2)} yd</td>
                                            <td style={{ textAlign: "right", padding: "5px 4px", fontWeight: 700, fontSize: 14 }}>{calc.buyBg.toFixed(2)} yd</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div style={{ marginTop: 6, fontSize: 12, fontWeight: 700, textAlign: "right" }}>
                                Total: {(calc.buyChain + calc.buyBg).toFixed(2)} yards (blocks only)
                            </div>
                            <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 2, textAlign: "right" }}>
                                +10% safety buffer included. Add backing, batting, and binding separately.
                            </div>
                        </div>
                    )}

                    {/* TOOLBAR */}
                    {calc && (
                        <div className="toolbar" style={{ marginBottom: 16 }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} /> Copy</button>
                            <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                        </div>
                    )}

                    {/* ═══ REFERENCE TABLES ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }}
                            onClick={() => setShowRef(!showRef)}>
                            📊 Irish Chain Block Reference Tables
                            <ChevronDown size={14} style={{ transform: showRef ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showRef && (
                            <div style={{ marginTop: 10 }}>
                                {(["single", "double", "triple"] as ChainType[]).map(t => (
                                    <div key={t} style={{ marginBottom: 10 }}>
                                        <h4 style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{LABELS[t]} Irish Chain</h4>
                                        <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}>
                                            <thead><tr style={{ borderBottom: "2px solid hsl(0,0%,85%)" }}>
                                                <th style={{ textAlign: "left", padding: "4px 3px" }}>Block</th>
                                                <th style={{ textAlign: "right", padding: "4px 3px" }}>Chain Sq</th>
                                                <th style={{ textAlign: "right", padding: "4px 3px" }}>Strip Width</th>
                                                <th style={{ padding: "4px 3px" }}>Set A</th>
                                            </tr></thead>
                                            <tbody>
                                                {PRESETS[t].map(s => (
                                                    <tr key={s} style={{ borderBottom: "1px solid hsl(0,0%,92%)", cursor: "pointer" }}
                                                        onClick={() => { setType(t); setBlockSize(s); }}>
                                                        <td style={{ padding: "3px" }}>{s}&quot;</td>
                                                        <td style={{ textAlign: "right", padding: "3px" }}>{toFrac(s / GRID[t])}&quot;</td>
                                                        <td style={{ textAlign: "right", padding: "3px" }}>{toFrac(s / GRID[t] + 0.5)}&quot;</td>
                                                        <td style={{ padding: "3px", fontSize: 10 }}>{Array.from({ length: GRID[t] }, (_, i) => i % 2 === 0 ? "A" : "B").join("-")}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ═══ TROUBLESHOOTING ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }}
                            onClick={() => setShowTrouble(!showTrouble)}>
                            🔧 Troubleshooting Irish Chain
                            <ChevronDown size={14} style={{ transform: showTrouble ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showTrouble && (
                            <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9 }}>
                                {[
                                    { prob: "Chain looks broken / not continuous", fix: "Block B is rotated incorrectly. In Double/Triple Chain, Block B has corner squares — rotation moves them to wrong positions. Mark an arrow on top edge of every Block B." },
                                    { prob: "Block A and Block B are different sizes", fix: "Strip piecing accumulates seam errors. Check ¼\" seam allowance. Use scant ¼\" consistently. Press strips before sub-cutting. Trim Block A to exact unfinished size before combining." },
                                    { prob: "Chain squares vary in size", fix: "Fabric stretched during cutting/sewing. Starch strips before cutting. Cut on straight grain. Use walking foot for long strip sets. Press (lift iron), don't iron-press (push)." },
                                    { prob: "Seams not nesting when joining rows", fix: "Press Strip Set A seams toward chain color, Strip Set B toward background. Alternating sets will have seams pointing opposite directions (they nest)." },
                                ].map((t, i) => (
                                    <div key={i} style={{ padding: 8, background: i % 2 === 0 ? "hsl(0,10%,97%)" : "hsl(40,15%,97%)", borderRadius: 6, marginBottom: 4 }}>
                                        <strong>Problem:</strong> {t.prob}<br /><strong>Fix:</strong> {t.fix}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ═══ EDUCATIONAL ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }}
                            onClick={() => setShowEdu(!showEdu)}>
                            📐 How Irish Chain Quilts Work
                            <ChevronDown size={14} style={{ transform: showEdu ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showEdu && (
                            <div style={{ marginTop: 10, fontSize: 12.5, lineHeight: 1.9, color: "var(--color-text-secondary)" }}>
                                <p><strong>The Two-Block System:</strong> Irish Chain quilts use an optical illusion. There are NO diagonal strips. Instead, chain-color squares in Block A align with squares in Block B when arranged in a checkerboard — creating the appearance of continuous diagonal chains.</p>
                                <p style={{ marginTop: 6 }}><strong>Choosing Your Chain Type:</strong></p>
                                <div style={{ padding: 8, background: "hsl(150,15%,97%)", borderRadius: 6 }}>• <strong>Single</strong> — Beginner-friendly. 9-patch + plain block. Great for appliqué in alternate blocks.</div>
                                <div style={{ padding: 8, background: "hsl(200,15%,97%)", borderRadius: 6, marginTop: 2 }}>• <strong>Double</strong> — Most popular. 5×5 grid. Wider, bolder chain. Block B has corner chain squares.</div>
                                <div style={{ padding: 8, background: "hsl(280,10%,97%)", borderRadius: 6, marginTop: 2 }}>• <strong>Triple</strong> — Advanced. 7×7 grid (49 pieces/block). Three parallel chain lines. Maximum drama.</div>
                                <p style={{ marginTop: 8 }}><strong>Even Block Count Rule:</strong> Irish Chain requires even block counts in both directions so the checkerboard pattern starts and ends consistently on all edges.</p>
                                <p style={{ marginTop: 6 }}><strong>Strip Piecing:</strong> Essential for efficiency. A 9-patch from strips takes ⅓ the cutting time vs individual squares. A 5×5 block without strips requires cutting 25 individual squares per block!</p>
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
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Grid Rules</h4>
                        <div style={{ fontSize: 12, lineHeight: 2 }}>
                            <div><strong>Single:</strong> block ÷ 3</div>
                            <div><strong>Double:</strong> block ÷ 5</div>
                            <div><strong>Triple:</strong> block ÷ 7</div>
                            <div style={{ marginTop: 6, fontSize: 11, color: "var(--color-text-tertiary)" }}>Block size must divide evenly by the grid number.</div>
                        </div>
                    </div>
                    <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Key Tip</h4>
                        <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.9 }}>
                            Mark an arrow on every Block B before assembly. Block B rotation is the #1 cause of broken chains in Double/Triple Irish Chain quilts.
                        </div>
                    </div>
                    <div className="glass-card related-tools">
                        <h4>Related Tools</h4>
                        <a href="/quilt/nine-patch-calculator" className="related-tool-link">Nine-Patch Calculator</a>
                        <a href="/quilt/blocks-needed" className="related-tool-link">Blocks Needed</a>
                        <a href="/quilt/border-calculator" className="related-tool-link">Border Calculator</a>
                        <a href="/quilt" className="related-tool-link">All Quilt Tools</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}