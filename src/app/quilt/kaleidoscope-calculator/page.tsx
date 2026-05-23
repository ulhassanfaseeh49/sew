"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Hexagon, ClipboardCopy, Printer, ChevronDown } from "lucide-react";

/* ─── helpers ─── */
function toFrac(v: number): string {
    const w = Math.floor(v); const r = v - w;
    const m: [number, string][] = [[.125, "⅛"], [.25, "¼"], [.375, "⅜"], [.5, "½"], [.625, "⅝"], [.75, "¾"], [.875, "⅞"]];
    for (const [t, s] of m) if (Math.abs(r - t) < .02) return w > 0 ? `${w}${s}` : s;
    if (r < .05) return `${w || "0"}`;
    return v.toFixed(2);
}
const roundUp8 = (v: number) => Math.ceil(v * 8) / 8;

const WEDGE_PRESETS = [
    { n: 6, label: "6 Wedges", angle: 60, desc: "Snowflake / Tumbling Blocks", ruler: "60° triangle" },
    { n: 8, label: "8 Wedges", angle: 45, desc: "Classic kaleidoscope", ruler: "45° wedge" },
    { n: 12, label: "12 Wedges", angle: 30, desc: "Fine detail", ruler: "12-wedge ruler" },
    { n: 16, label: "16 Wedges", angle: 22.5, desc: "Advanced / Compass", ruler: "16-wedge or FPP" },
];

const DIAM_PRESETS = [8, 10, 12, 14, 16, 18, 20];

/* ─── SVG kaleidoscope preview ─── */
function KaleidoPreview({ wedges, size }: { wedges: number; size: number }) {
    const r = size / 2 - 2;
    const cx = size / 2, cy = size / 2;
    const hues = [150, 170, 140, 160, 130, 155, 145, 165, 135, 152, 148, 158, 142, 162, 138, 168];
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ border: "1px solid hsl(0,0%,82%)", borderRadius: 8 }}>
            <rect width={size} height={size} fill="hsl(45,20%,94%)" rx={4} />
            {Array.from({ length: wedges }, (_, i) => {
                const a1 = (i * 360 / wedges - 90) * Math.PI / 180;
                const a2 = ((i + 1) * 360 / wedges - 90) * Math.PI / 180;
                const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
                const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
                const fill = `hsl(${hues[i % hues.length]},${40 + (i % 2) * 15}%,${45 + (i % 3) * 8}%)`;
                return <path key={i} d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`} fill={fill} stroke="hsl(0,0%,95%)" strokeWidth={0.8} />;
            })}
            <circle cx={cx} cy={cy} r={r * 0.08} fill="hsl(45,30%,85%)" stroke="hsl(0,0%,70%)" strokeWidth={0.5} />
        </svg>
    );
}

/* ─── core math ─── */
function calcKaleido(wedges: number, diameter: number, blocks: number, fabricW: number, repeatLen: number) {
    const angle = 360 / wedges;
    const halfAngle = angle / 2;
    const radius = diameter / 2;

    // Wedge dimensions (finished)
    const wedgeLen = radius;
    const outerArc = (Math.PI * diameter) / wedges;  // circumference / wedges
    // Straight approximation of outer width
    const outerWidth = 2 * radius * Math.sin((angle / 2) * Math.PI / 180);

    // Cut dimensions (+0.5" seam total)
    const cutLen = wedgeLen + 0.5;
    const cutOuterWidth = outerWidth + 0.5;

    // Background block (circle sits on square with ~1" margin each side)
    const blockSize = diameter + 2;
    const cutBlock = blockSize + 0.5;

    // Center circle
    const centerFinished = Math.max(1, Math.round(diameter * 0.12));
    const centerCut = centerFinished + 0.5;

    // Yardage
    const usableW = fabricW - 0.5;
    const totalWedges = blocks * wedges;

    let kaleidoYd: number, naiveYd: number, repeatPositions: number, wedgesPerPos: number;

    if (repeatLen > 0) {
        // With repeat matching
        wedgesPerPos = Math.floor(usableW / cutOuterWidth);
        const blocksNeedingRepeat = Math.ceil(totalWedges / wedgesPerPos);
        repeatPositions = blocksNeedingRepeat;
        const fabricLen = repeatPositions * repeatLen;
        kaleidoYd = fabricLen / 36;
        naiveYd = (Math.ceil(totalWedges / wedgesPerPos) * cutLen) / 36;
    } else {
        // No repeat
        wedgesPerPos = Math.floor(usableW / cutOuterWidth);
        const strips = Math.ceil(totalWedges / wedgesPerPos);
        kaleidoYd = (strips * cutLen) / 36;
        naiveYd = kaleidoYd;
        repeatPositions = strips;
    }

    // Background
    const bgPerRow = Math.floor(usableW / cutBlock);
    const bgRows = Math.ceil(blocks / Math.max(bgPerRow, 1));
    const bgYd = (bgRows * cutBlock) / 36;

    // Center circles (very small)
    const centersPerRow = Math.floor(usableW / centerCut);
    const centerRows = Math.ceil(blocks / Math.max(centersPerRow, 1));
    const centerYd = (centerRows * centerCut) / 36;

    const buyKaleido = roundUp8(kaleidoYd * 1.15);  // 15% safety for repeat matching
    const buyBg = roundUp8(bgYd * 1.1);
    const buyCenter = roundUp8(Math.max(centerYd, 0.25));

    const wastePercent = repeatLen > 0 ? Math.round((1 - naiveYd / kaleidoYd) * 100) : 0;

    return {
        angle, halfAngle, radius, wedgeLen, outerArc, outerWidth,
        cutLen, cutOuterWidth, blockSize, cutBlock,
        centerFinished, centerCut,
        totalWedges, wedgesPerPos, repeatPositions,
        kaleidoYd, naiveYd, buyKaleido, bgYd, buyBg, centerYd, buyCenter,
        wastePercent,
        quiltW: Math.ceil(Math.sqrt(blocks)) * blockSize,
        quiltH: Math.ceil(blocks / Math.ceil(Math.sqrt(blocks))) * blockSize,
    };
}

/* ─── FAQ ─── */
const faqItems = [
    { q: "What is a kaleidoscope quilt block?", a: "A kaleidoscope block is a circular design made by cutting identical wedge-shaped pieces from a repeating fabric and arranging them in a circle. The fabric pattern creates mirror-image symmetry — like looking through a real kaleidoscope. The magic depends entirely on cutting all wedges from the exact same position within the fabric repeat." },
    { q: "How do I cut wedges for a kaleidoscope quilt?", a: "Use a commercial wedge ruler (45° for 8-wedge, 60° for 6-wedge) or make a template. Position the template at the same spot within the fabric's print repeat for each cut. All wedges must come from identical positions for the kaleidoscope mirror effect to work." },
    { q: "Why does kaleidoscope need so much fabric?", a: "Kaleidoscope quilts use 2-3× more fabric than expected because all wedges must come from the same position within the print repeat. The fabric between usable repeat positions becomes waste. This is inherent to the technique — not a calculation error. A 49% waste rate is typical." },
    { q: "What angle do I cut kaleidoscope wedges?", a: "Divide 360° by the number of wedges: 8-wedge = 45° (most common), 6-wedge = 60° (Tumbling Blocks), 12-wedge = 30°, 16-wedge = 22.5°. Use a ruler designed for that specific angle." },
    { q: "What fabric is best for kaleidoscope quilts?", a: "Large-scale prints with clear, measurable repeating motifs work best. Geometric prints, paisleys, and florals with distinct flowers create dramatic effects. Striped fabrics cut on the bias produce spectacular starburst patterns. Avoid solids and random non-repeating prints." },
    { q: "How do I use a fabric repeat for kaleidoscope?", a: "Find a distinctive element in your fabric, then measure the distance to the next identical element going down — that's your vertical repeat. Cut all wedges from the exact same position within each repeat. The repeat-matching is what creates the symmetrical kaleidoscope effect." },
    { q: "What size center circle for a kaleidoscope block?", a: "The center circle covers where all wedge points meet. Standard: 2\" finished (2.5\" cut) for a 14\" circle. Minimum: 1\" finished. The circle is typically appliquéd in a contrasting accent fabric, or embellished with a button or yo-yo." },
    { q: "What is the difference between a kaleidoscope and a Mariner's Compass?", a: "Both use wedge shapes in a circle. Kaleidoscope relies on fabric repeat-matching for its effect — all wedges are identical. Mariner's Compass uses multiple different fabrics and varying point lengths to create a compass rose. Mariner's Compass is about the piecing geometry; kaleidoscope is about the fabric print." },
    { q: "How do I make a Tumbling Blocks quilt?", a: "Tumbling Blocks uses 60° diamonds (same angle as 6-wedge kaleidoscope) in a 3-color arrangement: light (top), medium (left), dark (right). The value contrast creates a 3D cube illusion. If values are too similar, the cubes look flat." },
    { q: "Can I use striped fabric for kaleidoscope?", a: "Yes! Striped fabrics create spectacular kaleidoscopes when cut on the bias (45° to the grain). The stripes create sunburst or star patterns when wedges are arranged. No repeat matching is needed — stripe position is consistently along the grain." },
];

export default function Page() {
    const [wedges, setWedges] = useState(8);
    const [diameter, setDiameter] = useState(14);
    const [blocks, setBlocks] = useState(16);
    const [fabricW, setFabricW] = useState(44);
    const [repeatLen, setRepeatLen] = useState(12);
    const [hasRepeat, setHasRepeat] = useState(true);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [showAngleRef, setShowAngleRef] = useState(false);
    const [showFabricGuide, setShowFabricGuide] = useState(false);
    const [showEdu, setShowEdu] = useState(false);

    const c = useMemo(() =>
        calcKaleido(wedges, diameter, blocks, fabricW, hasRepeat ? repeatLen : 0),
        [wedges, diameter, blocks, fabricW, repeatLen, hasRepeat]
    );

    const copyText = `Kaleidoscope: ${wedges}-wedge (${c.angle}°), ${toFrac(diameter)}" circle, ${toFrac(c.blockSize)}" blocks. Wedge: ${toFrac(c.cutLen)}" long × ${toFrac(c.cutOuterWidth)}" wide. ${blocks} blocks = ${c.totalWedges} wedges. Buy: ${c.buyKaleido.toFixed(2)} yd kaleidoscope, ${c.buyBg.toFixed(2)} yd background. Total: ${(c.buyKaleido + c.buyBg + c.buyCenter).toFixed(2)} yd.`;

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "Kaleidoscope Calculator" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    {/* HEADER */}
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Hexagon size={14} strokeWidth={1.5} /> Quilt #159</span>
                        <h1>Kaleidoscope Block Calculator</h1>
                        <p>Calculate wedge dimensions, angles, fabric repeat yardage, and template sizes for 6, 8, 12, or 16-wedge kaleidoscope quilts. Includes repeat-matching yardage and Tumbling Blocks support.</p>
                    </div>

                    {/* ① WEDGE COUNT */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>① Wedge Count</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 4 }}>
                            {WEDGE_PRESETS.map(p => (
                                <button key={p.n} className={`btn ${wedges === p.n ? "btn-primary" : "btn-secondary"}`}
                                    onClick={() => setWedges(p.n)} style={{ padding: "8px 6px", textAlign: "center" }}>
                                    <div style={{ fontWeight: 700, fontSize: 13 }}>{p.label}</div>
                                    <div style={{ fontSize: 9, opacity: .7 }}>{p.angle}° each</div>
                                    <div style={{ marginTop: 4 }}><KaleidoPreview wedges={p.n} size={50} /></div>
                                </button>
                            ))}
                        </div>
                        <div style={{ marginTop: 6, fontSize: 11, color: "var(--color-text-tertiary)" }}>
                            Angle per wedge: {c.angle}° | Half angle: {c.halfAngle}°
                        </div>
                    </div>

                    {/* ② DIAMETER */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>② Finished Circle Diameter</h2>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
                            {DIAM_PRESETS.map(d => (
                                <button key={d} className={`btn btn-sm ${diameter === d ? "btn-primary" : "btn-secondary"}`}
                                    onClick={() => setDiameter(d)}>{d}&quot;</button>
                            ))}
                        </div>
                        <div className="input-group">
                            <input type="number" className="input-field" value={diameter}
                                onChange={e => setDiameter(parseFloat(e.target.value) || 8)} min={4} max={36} />
                            <span className="input-helper">inches (finished circle diameter)</span>
                        </div>
                        <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 4 }}>
                            Block size: {toFrac(c.blockSize)}&quot; finished ({toFrac(c.cutBlock)}&quot; cut) | Radius: {toFrac(c.radius)}&quot;
                        </div>
                    </div>

                    {/* ③ LAYOUT */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>③ Layout</h2>
                        <div className="calculator-form-row">
                            <div className="input-group">
                                <label className="input-label">Number of blocks</label>
                                <input type="number" className="input-field" value={blocks}
                                    onChange={e => setBlocks(parseInt(e.target.value) || 1)} min={1} max={100} />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Fabric width</label>
                                <input type="number" className="input-field" value={fabricW}
                                    onChange={e => setFabricW(parseInt(e.target.value) || 44)} min={36} max={108} />
                                <span className="input-helper">inches</span>
                            </div>
                        </div>
                        <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 4 }}>
                            {blocks} blocks × {wedges} wedges = {c.totalWedges} total wedges
                        </div>
                    </div>

                    {/* ④ FABRIC REPEAT */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>④ Fabric Repeat</h2>
                        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                            <button className={`btn btn-sm ${hasRepeat ? "btn-primary" : "btn-secondary"}`}
                                onClick={() => setHasRepeat(true)}>Has repeat</button>
                            <button className={`btn btn-sm ${!hasRepeat ? "btn-primary" : "btn-secondary"}`}
                                onClick={() => setHasRepeat(false)}>No repeat / solid</button>
                        </div>
                        {hasRepeat && (
                            <div className="input-group">
                                <label className="input-label">Vertical repeat length</label>
                                <input type="number" className="input-field" value={repeatLen}
                                    onChange={e => setRepeatLen(parseFloat(e.target.value) || 1)} min={1} max={36} />
                                <span className="input-helper">inches between identical motifs</span>
                            </div>
                        )}
                        {hasRepeat && (
                            <div style={{ marginTop: 6, padding: 8, background: "hsl(40,30%,96%)", borderRadius: 6, fontSize: 11, color: "hsl(30,50%,40%)" }}>
                                💡 <strong>How to measure:</strong> Find a distinctive element, measure distance to the next identical element going down the fabric.
                            </div>
                        )}
                    </div>

                    {/* ═══ KALEIDOSCOPE PREVIEW ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`} style={{ textAlign: "center" }}>
                        <KaleidoPreview wedges={wedges} size={180} />
                        <div style={{ fontSize: 12, marginTop: 6, color: "var(--color-text-secondary)" }}>
                            {wedges}-wedge kaleidoscope ({c.angle}° per wedge)
                        </div>
                    </div>

                    {/* ═══ WEDGE DIMENSIONS ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(150,60%,40%)" }}>
                        <h2 className={styles.calcTitle}>Wedge Dimensions</h2>
                        <div className="result-card">
                            <div className="result-prefix">{wedges} wedges at {c.angle}°</div>
                            <div className="result-value">{toFrac(c.cutLen)}&quot; × {toFrac(c.cutOuterWidth)}&quot;</div>
                            <div className="result-label">Cut size (length × outer width)</div>
                        </div>
                        <div style={{ marginTop: 10, overflowX: "auto" }}>
                            <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
                                <tbody>
                                    {[
                                        ["Wedge angle", `${c.angle}°`],
                                        ["Finished length (radius)", `${toFrac(c.wedgeLen)}"`],
                                        ["Finished outer width", `${toFrac(c.outerWidth)}"`],
                                        ["Finished outer arc", `${c.outerArc.toFixed(2)}"`],
                                        ["Cut length (+seam)", `${toFrac(c.cutLen)}"`],
                                        ["Cut outer width (+seam)", `${toFrac(c.cutOuterWidth)}"`],
                                        ["Narrow end", "~0\" (comes to a point)"],
                                    ].map(([l, v], i) => (
                                        <tr key={i} style={{ borderBottom: "1px solid hsl(0,0%,92%)" }}>
                                            <td style={{ padding: "4px 6px", fontSize: 11 }}>{l}</td>
                                            <td style={{ padding: "4px 6px", textAlign: "right", fontWeight: 600, fontFamily: "var(--font-mono)" }}>{v}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ═══ BLOCK DETAILS ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Block &amp; Setting</h2>
                        <div style={{ fontSize: 12, lineHeight: 2 }}>
                            <div>Background block: <strong>{toFrac(c.blockSize)}&quot;</strong> finished ({toFrac(c.cutBlock)}&quot; cut)</div>
                            <div>Center circle: <strong>{toFrac(c.centerFinished)}&quot;</strong> finished ({toFrac(c.centerCut)}&quot; cut)</div>
                            <div>Total blocks: <strong>{blocks}</strong> ({c.totalWedges} wedges)</div>
                            <div>Wedges from one strip: <strong>{c.wedgesPerPos}</strong> (at {toFrac(c.cutOuterWidth)}&quot; each across {fabricW}&quot; fabric)</div>
                        </div>
                    </div>

                    {/* ═══ REPEAT YARDAGE ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(280,50%,55%)" }}>
                        <h2 className={styles.calcTitle}>Yardage Summary</h2>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
                                <thead><tr style={{ borderBottom: "2px solid hsl(0,0%,85%)" }}>
                                    <th style={{ textAlign: "left", padding: "6px 4px" }}>Fabric</th>
                                    <th style={{ textAlign: "right", padding: "6px 4px" }}>Calculated</th>
                                    <th style={{ textAlign: "right", padding: "6px 4px", fontWeight: 700 }}>Buy</th>
                                </tr></thead>
                                <tbody>
                                    <tr style={{ borderBottom: "1px solid hsl(0,0%,92%)" }}>
                                        <td style={{ padding: "5px 4px" }}>🎨 Kaleidoscope fabric{hasRepeat ? " (repeat-matched)" : ""}</td>
                                        <td style={{ textAlign: "right", padding: "5px 4px" }}>{c.kaleidoYd.toFixed(2)} yd</td>
                                        <td style={{ textAlign: "right", padding: "5px 4px", fontWeight: 700, fontSize: 14 }}>{c.buyKaleido.toFixed(2)} yd</td>
                                    </tr>
                                    <tr style={{ borderBottom: "1px solid hsl(0,0%,92%)" }}>
                                        <td style={{ padding: "5px 4px" }}>⬜ Background</td>
                                        <td style={{ textAlign: "right", padding: "5px 4px" }}>{c.bgYd.toFixed(2)} yd</td>
                                        <td style={{ textAlign: "right", padding: "5px 4px", fontWeight: 700, fontSize: 14 }}>{c.buyBg.toFixed(2)} yd</td>
                                    </tr>
                                    <tr style={{ borderBottom: "1px solid hsl(0,0%,92%)" }}>
                                        <td style={{ padding: "5px 4px" }}>🔵 Center circles</td>
                                        <td style={{ textAlign: "right", padding: "5px 4px" }}>{c.centerYd.toFixed(2)} yd</td>
                                        <td style={{ textAlign: "right", padding: "5px 4px", fontWeight: 700, fontSize: 14 }}>{c.buyCenter.toFixed(2)} yd</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div style={{ marginTop: 6, fontSize: 12, fontWeight: 700, textAlign: "right" }}>
                            Total: {(c.buyKaleido + c.buyBg + c.buyCenter).toFixed(2)} yards
                        </div>

                        {hasRepeat && c.wastePercent > 0 && (
                            <div style={{ marginTop: 8, padding: 10, background: "hsl(0,25%,97%)", borderRadius: 6, fontSize: 11 }}>
                                <strong>⚠️ Why so much kaleidoscope fabric?</strong><br />
                                Repeat matching requires cutting from the same position in each {repeatLen}&quot; repeat.
                                Fabric between usable positions becomes waste (~{c.wastePercent}% waste rate).
                                This is inherent to the kaleidoscope technique — not a calculation error.
                                {c.naiveYd < c.kaleidoYd && (
                                    <div style={{ marginTop: 4 }}>
                                        Without repeat: ~{c.naiveYd.toFixed(1)} yd | With repeat: ~{c.kaleidoYd.toFixed(1)} yd | Extra: +{(c.kaleidoYd - c.naiveYd).toFixed(1)} yd
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* TOOLBAR */}
                    <div className="toolbar" style={{ marginBottom: 10 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} /> Copy</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                    </div>

                    {/* ═══ ANGLE REFERENCE ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }}
                            onClick={() => setShowAngleRef(!showAngleRef)}>
                            📐 Wedge Angle Quick Reference
                            <ChevronDown size={14} style={{ transform: showAngleRef ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showAngleRef && (
                            <div style={{ marginTop: 10, overflowX: "auto" }}>
                                <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse" }}>
                                    <thead><tr style={{ borderBottom: "2px solid hsl(0,0%,85%)" }}>
                                        <th style={{ textAlign: "left", padding: "4px" }}>Wedges</th>
                                        <th style={{ textAlign: "right", padding: "4px" }}>Angle</th>
                                        <th style={{ textAlign: "right", padding: "4px" }}>½ Angle</th>
                                        <th style={{ padding: "4px" }}>Ruler</th>
                                        <th style={{ padding: "4px" }}>Best For</th>
                                    </tr></thead>
                                    <tbody>
                                        {[
                                            [4, "90°", "45°", "Square", "Bold geometric"],
                                            [6, "60°", "30°", "60° triangle", "Tumbling Blocks, snowflakes"],
                                            [8, "45°", "22.5°", "45° wedge", "Classic kaleidoscope"],
                                            [12, "30°", "15°", "12-wedge", "Fine detail"],
                                            [16, "22.5°", "11.25°", "16-wedge", "Advanced/Compass"],
                                            [24, "15°", "7.5°", "FPP recommended", "Expert"],
                                        ].map(([n, a, h, r, b], i) => (
                                            <tr key={i} style={{ borderBottom: "1px solid hsl(0,0%,92%)", background: wedges === n ? "hsl(150,30%,95%)" : "transparent", cursor: typeof n === "number" ? "pointer" : "default" }}
                                                onClick={() => typeof n === "number" && n >= 4 && n <= 24 && setWedges(n as number)}>
                                                <td style={{ padding: "4px", fontWeight: wedges === n ? 700 : 400 }}>{n}</td>
                                                <td style={{ textAlign: "right", padding: "4px" }}>{a}</td>
                                                <td style={{ textAlign: "right", padding: "4px" }}>{h}</td>
                                                <td style={{ padding: "4px", fontSize: 10 }}>{r}</td>
                                                <td style={{ padding: "4px", fontSize: 10 }}>{b}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* ═══ FABRIC GUIDE ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }}
                            onClick={() => setShowFabricGuide(!showFabricGuide)}>
                            🎨 Fabric Suitability Guide
                            <ChevronDown size={14} style={{ transform: showFabricGuide ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showFabricGuide && (
                            <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9 }}>
                                <div style={{ padding: 8, background: "hsl(150,20%,96%)", borderRadius: 6, marginBottom: 4 }}>
                                    <strong>✓ Best fabrics:</strong> Large-scale prints with clear repeating motifs, geometric prints, paisleys, florals with large flowers, ethnic/decorative prints, striped fabrics (cut on bias)
                                </div>
                                <div style={{ padding: 8, background: "hsl(45,20%,96%)", borderRadius: 6, marginBottom: 4 }}>
                                    <strong>≈ Good fabrics:</strong> Medium-scale prints (smaller effect), tone-on-tone with texture (subtle), abstract prints with some repeat
                                </div>
                                <div style={{ padding: 8, background: "hsl(0,15%,97%)", borderRadius: 6, marginBottom: 4 }}>
                                    <strong>✗ Poor fabrics:</strong> Solids (no visual effect), random prints with no repeat, very small prints (effect invisible), directional prints
                                </div>
                                <div style={{ padding: 8, background: "hsl(280,15%,97%)", borderRadius: 6 }}>
                                    <strong>⭐ Striped fabrics:</strong> Cut on the bias (45° to grain) for spectacular starburst/star patterns. No repeat matching needed — stripe position is consistent along the grain.
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ═══ EDUCATIONAL ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }}
                            onClick={() => setShowEdu(!showEdu)}>
                            📐 How Kaleidoscope Quilts Work
                            <ChevronDown size={14} style={{ transform: showEdu ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showEdu && (
                            <div style={{ marginTop: 10, fontSize: 12.5, lineHeight: 1.9, color: "var(--color-text-secondary)" }}>
                                <p><strong>The Mirror Principle:</strong> All wedges are cut from the EXACT same position in the fabric repeat. When arranged in a circle, each rotated by {c.angle}°, the print creates mirror-image symmetry — just like a real kaleidoscope. If even one wedge is from a different position, the symmetry breaks.</p>
                                <p style={{ marginTop: 6 }}><strong>Why so much waste?</strong> You might expect: {wedges} wedges × wedge size = fabric needed. But actual fabric is 2-3× more because you must cut from the same repeat position each time. The fabric between repeat positions is sacrificed. This is NOT a mistake — it is inherent to the technique.</p>
                                <p style={{ marginTop: 6 }}><strong>Tumbling Blocks (60°):</strong> Uses the same 60° diamond angle as 6-wedge kaleidoscope. Three diamonds in light/medium/dark values create a 3D cube illusion. The value arrangement (not color) creates the effect — if values are too similar, cubes look flat.</p>
                                <p style={{ marginTop: 6 }}><strong>Template tip:</strong> Draw two lines from center at {c.halfAngle}° on each side of vertical. Mark {toFrac(c.cutLen)}&quot; along each. Connect endpoints. The outer width should measure {toFrac(c.cutOuterWidth)}&quot;.</p>
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
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Quick Angles</h4>
                        <div style={{ fontSize: 12, lineHeight: 2 }}>
                            {WEDGE_PRESETS.map(p => (
                                <div key={p.n} style={{ cursor: "pointer", fontWeight: wedges === p.n ? 700 : 400, color: wedges === p.n ? "var(--color-accent-primary)" : undefined }}
                                    onClick={() => setWedges(p.n)}>
                                    {p.n} wedges = {p.angle}°
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Key Tip</h4>
                        <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.9 }}>
                            Every wedge must be cut from the exact same x,y position within the fabric repeat. If even one wedge is off, the kaleidoscope symmetry breaks.
                        </div>
                    </div>
                    <div className="glass-card related-tools">
                        <h4>Related Tools</h4>
                        <a href="/quilt/dresden-plate-calculator" className="related-tool-link">Dresden Plate Calculator</a>
                        <a href="/quilt/fpp-calculator" className="related-tool-link">FPP Calculator</a>
                        <a href="/quilt/hexagon-calculator" className="related-tool-link">Hexagon Calculator</a>
                        <a href="/quilt" className="related-tool-link">All Quilt Tools</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}