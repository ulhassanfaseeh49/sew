"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Scissors, ClipboardCopy, Printer, ChevronDown } from "lucide-react";

const roundUp8 = (v: number) => Math.ceil(v * 8) / 8;

type Proj = "overview" | "race" | "strip" | "ninepatch" | "railfence" | "logcabin" | "binding";
const PROJ_INFO: { id: Proj; label: string; desc: string; diff: string }[] = [
    { id: "overview", label: "Project Overview", desc: "See all project options from your jelly roll", diff: "—" },
    { id: "race", label: "Jelly Roll Race", desc: "Sew all strips end-to-end, fold & sew", diff: "★☆☆☆☆" },
    { id: "strip", label: "Strip Quilt", desc: "Strips sewn side by side", diff: "★☆☆☆☆" },
    { id: "ninepatch", label: "Nine-Patch", desc: "Strip-pieced 6\" nine-patch blocks", diff: "★★☆☆☆" },
    { id: "railfence", label: "Rail Fence", desc: "3-strip units sub-cut into squares", diff: "★★☆☆☆" },
    { id: "logcabin", label: "Log Cabin", desc: "Strips wrapped around a center", diff: "★★☆☆☆" },
    { id: "binding", label: "Binding", desc: "2.5\" strips = perfect binding width", diff: "★☆☆☆☆" },
];

/* ─── calculations ─── */
function calcAll(rolls: number, stripsPerRoll: number, stripLen: number) {
    const totalStrips = rolls * stripsPerRoll;
    const totalLen = totalStrips * stripLen;
    const totalYd = totalLen / 36;

    // Race: ~50×65 from 40 strips, scale linearly
    const raceW = Math.round(50 * Math.sqrt(totalStrips / 40));
    const raceH = Math.round(65 * Math.sqrt(totalStrips / 40));

    // Strip quilt: all strips side by side
    const stripFinW = totalStrips * 2; // 2" finished per strip
    const stripLen_ = stripLen; // length = strip length

    // Nine-patch: 2.5" strips → 2" finished → 6" block
    // Per block: 5 dark + 4 light = 9 strip segments, each segment = 2.5" of WOF strip set
    // Strip sets use 3 strips each. Ratio 2A:1B. Group = 2A+1B = 9 strips
    // Segments per set = floor(stripLen / 2.5) = 16
    const segsPerSet = Math.floor(stripLen / 2.5);
    const npGroups = Math.floor(totalStrips / 9); // each group = 9 strips (2 Set A + 1 Set B)
    const npSegsPerGroup = 3 * segsPerSet; // 3 sets × segsPerSet
    const npBlocksPerGroup = Math.floor(npSegsPerGroup / 3); // 3 segments per block
    const npBlocks = npGroups * npBlocksPerGroup;
    const npLeftover = totalStrips - npGroups * 9;

    // Rail Fence: 3 strips per set, sub-cut to 6.5" squares
    const rfSets = Math.floor(totalStrips / 3);
    const rfLeftover = totalStrips - rfSets * 3;
    const rfSquareSize = 6.5; // unfinished
    const rfSquaresPerSet = Math.floor(stripLen / rfSquareSize);
    const rfTotalSquares = rfSets * rfSquaresPerSet;

    // Log cabin 8" block: center 4.5" + strips totaling ~30.5" per block
    const lcStripPerBlock8 = 30.5;
    const lcBlocks8 = Math.floor(totalLen / lcStripPerBlock8);
    // Log cabin 12" block: ~60" per block
    const lcStripPerBlock12 = 60;
    const lcBlocks12 = Math.floor(totalLen / lcStripPerBlock12);

    // Binding: perimeter + 40" allowance
    const bindingPerStrip = stripLen;
    const bindQuiltSizes = [
        { name: "Baby 36×45", perim: 162, allow: 40 },
        { name: "Throw 54×63", perim: 234, allow: 40 },
        { name: "Twin 60×80", perim: 280, allow: 40 },
        { name: "Queen 84×92", perim: 352, allow: 40 },
        { name: "King 100×108", perim: 416, allow: 40 },
    ];
    const bindData = bindQuiltSizes.map(q => {
        const need = q.perim + q.allow;
        const strips = Math.ceil(need / bindingPerStrip);
        const canBind = Math.floor(totalStrips / strips);
        return { ...q, need, strips, canBind };
    });

    return {
        totalStrips, totalLen, totalYd,
        raceW, raceH,
        stripFinW, stripLen_,
        npBlocks, npGroups, npLeftover, segsPerSet,
        rfSets, rfLeftover, rfSquaresPerSet, rfTotalSquares,
        lcBlocks8, lcBlocks12,
        bindData,
    };
}

/* bestLayout: find layout closest to aspect ratio */
function layouts(blocks: number, blockSize: number): { across: number; down: number; w: number; h: number }[] {
    const res: { across: number; down: number; w: number; h: number }[] = [];
    for (let a = 2; a <= Math.ceil(Math.sqrt(blocks * 2)); a++) {
        const d = Math.floor(blocks / a);
        if (d >= 2 && a * d <= blocks) res.push({ across: a, down: d, w: a * blockSize, h: d * blockSize });
    }
    return res.sort((a, b) => Math.abs(a.w / a.h - 0.75) - Math.abs(b.w / b.h - 0.75)).slice(0, 3);
}

/* ─── FAQ ─── */
const faqItems = [
    { q: "What is a jelly roll in quilting?", a: "A jelly roll is a pre-cut bundle of 2.5\" wide strips cut selvage to selvage (approximately 42\" long). Most contain 40 strips — one of each fabric in a collection. Named for their resemblance to a jelly roll cake when bundled." },
    { q: "How many strips are in a jelly roll?", a: "Standard jelly rolls contain 40 strips. Some specialty collections have 42 or 36 strips. Each strip is 2.5\" wide × approximately 42\" long (the usable width of the fabric bolt)." },
    { q: "What can I make with one jelly roll?", a: "One jelly roll (40 strips) can make: a Jelly Roll Race quilt (~50\"×65\"), 64+ nine-patch blocks, 78 rail fence squares, 55 log cabin blocks (8\"), or a strip quilt (42\"×80\"). It's also enough binding for 3-5 quilts." },
    { q: "How many jelly rolls for a throw quilt?", a: "For a throw quilt (~54\"×63\"): 1 jelly roll for a Jelly Roll Race, 1 jelly roll + background fabric for nine-patch, or 2 jelly rolls for a wider strip quilt. Project type determines the exact count." },
    { q: "How does a jelly roll race quilt work?", a: "Sew all 40 strips end-to-end into one very long strip (1,680\"). Fold in half, sew the long edge, fold again, sew again. Repeat until you have a wide layered unit. Cut folds open and arrange into a quilt. Result: ~50\"×65\" throw in 1-2 hours." },
    { q: "What size nine-patch from a jelly roll?", a: "Jelly roll strips (2.5\") produce 2\" finished squares, making 6\" finished nine-patch blocks (3×2\" = 6\"). From 40 strips, you can make approximately 64 nine-patch blocks using the strip-piecing method." },
    { q: "Can I use jelly roll strips for binding?", a: "Yes! 2.5\" is the PERFECT width for double-fold binding, producing ~½\" finished binding. One jelly roll (40 strips × 42\") = 1,680\" of binding — enough for 3-5 quilts depending on size." },
    { q: "How many jelly rolls for a queen-size quilt?", a: "For a queen-size quilt (~84\"×92\"): 3-4 jelly rolls for a pure nine-patch layout, or 2-3 jelly rolls for a Jelly Roll Race (stitching multiple race pieces together). Adding background fabric reduces the jelly rolls needed." },
    { q: "What is the best project for one jelly roll?", a: "The Jelly Roll Race is the most popular one-jelly-roll project — it produces a generous throw quilt in 1-2 hours with zero additional fabric. For more structure, nine-patch blocks with alternating background squares create a beautiful quilt." },
    { q: "How long is a jelly roll strip?", a: "Each strip is approximately 42-44\" long (the usable width of fabric, selvage to selvage). Total length of one jelly roll: 40 strips × 42\" = 1,680\" = 140 feet = 46.7 yards." },
];

export default function Page() {
    const [rolls, setRolls] = useState(1);
    const [stripsPerRoll, setStripsPerRoll] = useState(40);
    const [stripLen, setStripLen] = useState(42);
    const [proj, setProj] = useState<Proj>("overview");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [showComparison, setShowComparison] = useState(false);
    const [showJRRef, setShowJRRef] = useState(false);
    const [showEdu, setShowEdu] = useState(false);

    const c = useMemo(() => calcAll(rolls, stripsPerRoll, stripLen), [rolls, stripsPerRoll, stripLen]);

    const tS = { fontSize: 11, borderCollapse: "collapse" as const, width: "100%" };
    const tH = { padding: "5px 4px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left" as const, fontSize: 11 };
    const tD = { padding: "4px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11 };
    const tR = { textAlign: "right" as const };

    const copyText = `Jelly Roll: ${rolls} roll(s) × ${stripsPerRoll} strips = ${c.totalStrips} strips (${c.totalLen}" / ${c.totalYd.toFixed(1)} yd). Race: ~${c.raceW}"×${c.raceH}". Nine-Patch: ${c.npBlocks} blocks. Rail Fence: ${c.rfTotalSquares} squares. Log Cabin 8": ${c.lcBlocks8} blocks.`;

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "Jelly Roll Calculator" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Scissors size={14} strokeWidth={1.5} /> Quilt #161</span>
                        <h1>Jelly Roll Project Calculator</h1>
                        <p>Calculate what quilt projects you can make from any number of jelly rolls. Includes Jelly Roll Race, nine-patch, rail fence, log cabin, strip quilt, and binding calculations.</p>
                    </div>

                    {/* ① JELLY ROLL INFO */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>① Your Jelly Roll</h2>
                        <div className="calculator-form-row">
                            <div className="input-group">
                                <label className="input-label">Jelly rolls</label>
                                <input type="number" className="input-field" value={rolls} onChange={e => setRolls(parseInt(e.target.value) || 1)} min={1} max={10} />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Strips/roll</label>
                                <select className="input-field" value={stripsPerRoll} onChange={e => setStripsPerRoll(parseInt(e.target.value))}>
                                    <option value={40}>40 (standard)</option>
                                    <option value={42}>42</option>
                                    <option value={36}>36 (specialty)</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Strip length</label>
                                <input type="number" className="input-field" value={stripLen} onChange={e => setStripLen(parseInt(e.target.value) || 42)} min={20} max={60} />
                                <span className="input-helper">inches (WOF)</span>
                            </div>
                        </div>
                        <div style={{ marginTop: 8, padding: 10, background: "hsl(150,20%,97%)", borderRadius: 6, fontSize: 12, lineHeight: 1.9 }}>
                            <strong>Total:</strong> {c.totalStrips} strips × 2.5&quot; wide × {stripLen}&quot; long<br />
                            <strong>Total length:</strong> {c.totalLen.toLocaleString()}&quot; = {Math.round(c.totalLen / 12)} ft = {c.totalYd.toFixed(1)} yards
                        </div>
                    </div>

                    {/* ② PROJECT TYPE */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>② Project Type</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 4 }}>
                            {PROJ_INFO.map(p => (
                                <button key={p.id} className={`btn ${proj === p.id ? "btn-primary" : "btn-secondary"}`}
                                    onClick={() => setProj(p.id)} style={{ padding: "8px 6px", textAlign: "center", fontSize: 11 }}>
                                    <div style={{ fontWeight: 700, fontSize: 12 }}>{p.label}</div>
                                    <div style={{ fontSize: 9, opacity: .7 }}>{p.diff !== "—" ? p.diff : ""}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ═══ PROJECT RESULTS ═══ */}

                    {/* OVERVIEW */}
                    {proj === "overview" && (
                        <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(150,60%,40%)" }}>
                            <h2 className={styles.calcTitle}>What You Can Make from {rolls} Jelly Roll{rolls > 1 ? "s" : ""}</h2>
                            {[
                                { name: "Jelly Roll Race", size: `~${c.raceW}" × ${c.raceH}"`, time: "1-2 hr", extra: "None", diff: "★☆☆☆☆" },
                                { name: "Strip Quilt", size: `${stripLen}" × ${c.stripFinW}"`, time: "2-3 hr", extra: "None", diff: "★☆☆☆☆" },
                                { name: "Nine-Patch (6\" blocks)", size: `${c.npBlocks} blocks`, time: "4-6 hr", extra: "Optional bg", diff: "★★☆☆☆" },
                                { name: "Rail Fence (6\" blocks)", size: `${c.rfTotalSquares} squares`, time: "3-4 hr", extra: "None", diff: "★★☆☆☆" },
                                { name: "Log Cabin (8\" blocks)", size: `${c.lcBlocks8} blocks`, time: "5-8 hr", extra: "Center fabric", diff: "★★☆☆☆" },
                                { name: "Log Cabin (12\" blocks)", size: `${c.lcBlocks12} blocks`, time: "6-10 hr", extra: "Center fabric", diff: "★★★☆☆" },
                                { name: "Binding", size: `Bind ${c.bindData[1]?.canBind || 0}+ throw quilts`, time: "—", extra: "—", diff: "★☆☆☆☆" },
                            ].map((p, i) => (
                                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px", background: i % 2 === 0 ? "hsl(0,0%,98%)" : "transparent", borderRadius: 4, fontSize: 12, marginBottom: 2 }}>
                                    <div><strong>{p.name}</strong></div>
                                    <div style={{ textAlign: "right" }}>
                                        <span style={{ fontWeight: 700, color: "var(--color-accent-primary)" }}>{p.size}</span>
                                        <span style={{ fontSize: 10, marginLeft: 8, opacity: .6 }}>{p.diff}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* RACE */}
                    {proj === "race" && (
                        <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(280,50%,55%)" }}>
                            <h2 className={styles.calcTitle}>Jelly Roll Race Quilt</h2>
                            <div className="result-card">
                                <div className="result-prefix">Approximate finished size</div>
                                <div className="result-value">~{c.raceW}&quot; × {c.raceH}&quot;</div>
                                <div className="result-label">From {c.totalStrips} strips ({c.totalLen.toLocaleString()}&quot; total)</div>
                            </div>
                            <div style={{ marginTop: 10, fontSize: 12, lineHeight: 2 }}>
                                <strong>How it works:</strong>
                                <div style={{ padding: 8, background: "hsl(280,10%,97%)", borderRadius: 6, marginTop: 4 }}>
                                    1. Sew all {c.totalStrips} strips end-to-end → {c.totalLen.toLocaleString()}&quot; ({Math.round(c.totalLen / 12)} ft)<br />
                                    2. Fold in half, sew long edge → {Math.round(c.totalLen / 2).toLocaleString()}&quot; long, 5&quot; wide<br />
                                    3. Fold again, sew → {Math.round(c.totalLen / 4).toLocaleString()}&quot; long, 10&quot; wide<br />
                                    4. Continue: each cycle doubles width, halves length<br />
                                    5. Stop when width reaches ~{c.raceW}&quot;, cut folds open, arrange
                                </div>
                                <div style={{ marginTop: 6, fontSize: 11, color: "var(--color-text-tertiary)" }}>
                                    Result varies slightly based on technique. Most sources report ~50&quot;×65&quot; from 40 strips.
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STRIP QUILT */}
                    {proj === "strip" && (
                        <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(200,50%,50%)" }}>
                            <h2 className={styles.calcTitle}>Strip Quilt</h2>
                            <div className="result-card">
                                <div className="result-prefix">All strips sewn side by side</div>
                                <div className="result-value">{stripLen}&quot; × {c.stripFinW}&quot;</div>
                                <div className="result-label">{c.totalStrips} strips × 2&quot; finished = {c.stripFinW}&quot;</div>
                            </div>
                            <div style={{ marginTop: 10, fontSize: 12, lineHeight: 2 }}>
                                <strong>Layout options:</strong>
                                <div style={{ padding: 8, background: "hsl(200,10%,97%)", borderRadius: 6, marginTop: 4 }}>
                                    <strong>Horizontal strips:</strong> {stripLen}&quot; wide × {c.stripFinW}&quot; tall<br />
                                    <strong>Cut in half:</strong> {Math.round(c.stripFinW / 2)}&quot; wide × {stripLen * 2}&quot; tall (sewn end-to-end)<br />
                                    <strong>Best approach:</strong> All strips one direction → {stripLen}&quot; × {c.stripFinW}&quot;
                                </div>
                            </div>
                        </div>
                    )}

                    {/* NINE-PATCH */}
                    {proj === "ninepatch" && (
                        <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(30,60%,50%)" }}>
                            <h2 className={styles.calcTitle}>Nine-Patch Blocks</h2>
                            <div className="result-card">
                                <div className="result-prefix">6&quot; finished nine-patch blocks</div>
                                <div className="result-value">{c.npBlocks} blocks</div>
                                <div className="result-label">From {c.totalStrips} strips ({c.npGroups} strip-set groups + {c.npLeftover} leftover)</div>
                            </div>
                            <div style={{ marginTop: 10, fontSize: 12, lineHeight: 2 }}>
                                <div style={{ padding: 8, background: "hsl(30,15%,97%)", borderRadius: 6 }}>
                                    <strong>Strip-piecing method:</strong><br />
                                    • 2.5&quot; strips → 2&quot; finished squares → 6&quot; finished blocks (3×2&quot;)<br />
                                    • Set A (Dark-Light-Dark): 3 strips → {c.segsPerSet} segments<br />
                                    • Set B (Light-Dark-Light): 3 strips → {c.segsPerSet} segments<br />
                                    • Each block: 2 Set A segments + 1 Set B segment<br />
                                    • Group (2A + 1B) = 9 strips → {Math.floor(3 * c.segsPerSet / 3)} blocks per group
                                </div>
                                <div style={{ marginTop: 8 }}>
                                    <strong>Suggested layouts:</strong>
                                    {layouts(c.npBlocks, 6).map((l, i) => (
                                        <div key={i} style={{ fontSize: 11, padding: "2px 0" }}>
                                            {l.across}×{l.down} = {l.across * l.down} blocks → <strong>{l.w}&quot; × {l.h}&quot;</strong>
                                            {i === 0 && <span style={{ color: "var(--color-accent-primary)", marginLeft: 4 }}>recommended</span>}
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop: 6, padding: 8, background: "hsl(150,15%,97%)", borderRadius: 6, fontSize: 11 }}>
                                    💡 <strong>With background:</strong> Add {c.npBlocks} alternating 6.5&quot; background squares → {c.npBlocks * 2} total blocks for a much larger quilt!
                                    Background fabric needed: ~{roundUp8((Math.ceil(c.npBlocks / Math.floor(42 / 6.5)) * 6.5) / 36).toFixed(2)} yards.
                                </div>
                            </div>
                        </div>
                    )}

                    {/* RAIL FENCE */}
                    {proj === "railfence" && (
                        <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(340,50%,50%)" }}>
                            <h2 className={styles.calcTitle}>Rail Fence Blocks</h2>
                            <div className="result-card">
                                <div className="result-prefix">6&quot; finished rail fence squares</div>
                                <div className="result-value">{c.rfTotalSquares} squares</div>
                                <div className="result-label">{c.rfSets} sets of 3 strips × {c.rfSquaresPerSet} squares/set {c.rfLeftover > 0 ? `(${c.rfLeftover} leftover strip${c.rfLeftover > 1 ? "s" : ""})` : ""}</div>
                            </div>
                            <div style={{ marginTop: 10, fontSize: 12, lineHeight: 2 }}>
                                <div style={{ padding: 8, background: "hsl(340,10%,97%)", borderRadius: 6 }}>
                                    <strong>How it works:</strong><br />
                                    • Sew 3 strips together lengthwise → 6.5&quot; wide × {stripLen}&quot; long<br />
                                    • Sub-cut into 6.5&quot; squares → {c.rfSquaresPerSet} squares per set<br />
                                    • Rotate every other square 90° for woven appearance
                                </div>
                                <div style={{ marginTop: 8 }}>
                                    <strong>Suggested layouts:</strong>
                                    {layouts(c.rfTotalSquares, 6).map((l, i) => (
                                        <div key={i} style={{ fontSize: 11, padding: "2px 0" }}>
                                            {l.across}×{l.down} = {l.across * l.down} squares → <strong>{l.w}&quot; × {l.h}&quot;</strong>
                                            {i === 0 && <span style={{ color: "var(--color-accent-primary)", marginLeft: 4 }}>recommended</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* LOG CABIN */}
                    {proj === "logcabin" && (
                        <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(25,60%,50%)" }}>
                            <h2 className={styles.calcTitle}>Log Cabin Blocks</h2>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                                <div className="result-card">
                                    <div className="result-prefix">8&quot; finished (2 rounds)</div>
                                    <div className="result-value">{c.lcBlocks8} blocks</div>
                                    <div className="result-label">~30.5&quot; strip/block</div>
                                </div>
                                <div className="result-card">
                                    <div className="result-prefix">12&quot; finished (4 rounds)</div>
                                    <div className="result-value">{c.lcBlocks12} blocks</div>
                                    <div className="result-label">~60&quot; strip/block</div>
                                </div>
                            </div>
                            <div style={{ marginTop: 10, fontSize: 12, lineHeight: 2 }}>
                                <div style={{ padding: 8, background: "hsl(25,15%,97%)", borderRadius: 6 }}>
                                    • 2.5&quot; strips → 2&quot; finished logs<br />
                                    • Center: 4.5&quot; cut from strip (4&quot; finished)<br />
                                    • 8&quot; block: center + 4 logs = 30.5&quot; total strip<br />
                                    • 12&quot; block: center + 8 logs = ~60&quot; total strip
                                </div>
                                <div style={{ marginTop: 8 }}><strong>8&quot; block layouts:</strong>
                                    {layouts(c.lcBlocks8, 8).map((l, i) => (
                                        <div key={i} style={{ fontSize: 11, padding: "2px 0" }}>
                                            {l.across}×{l.down} = {l.across * l.down} blocks → <strong>{l.w}&quot; × {l.h}&quot;</strong>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ marginTop: 4 }}><strong>12&quot; block layouts:</strong>
                                    {layouts(c.lcBlocks12, 12).map((l, i) => (
                                        <div key={i} style={{ fontSize: 11, padding: "2px 0" }}>
                                            {l.across}×{l.down} = {l.across * l.down} blocks → <strong>{l.w}&quot; × {l.h}&quot;</strong>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* BINDING */}
                    {proj === "binding" && (
                        <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(45,70%,50%)" }}>
                            <h2 className={styles.calcTitle}>Jelly Roll Binding</h2>
                            <div className="result-card">
                                <div className="result-prefix">Total binding length</div>
                                <div className="result-value">{c.totalLen.toLocaleString()}&quot;</div>
                                <div className="result-label">{c.totalStrips} strips × {stripLen}&quot; = {c.totalYd.toFixed(1)} yards</div>
                            </div>
                            <div style={{ marginTop: 10, overflowX: "auto" }}>
                                <table style={tS}>
                                    <thead><tr>
                                        <th style={tH}>Quilt Size</th>
                                        <th style={{ ...tH, ...tR }}>Perimeter</th>
                                        <th style={{ ...tH, ...tR }}>Strips</th>
                                        <th style={{ ...tH, ...tR, fontWeight: 700 }}>Can Bind</th>
                                    </tr></thead>
                                    <tbody>
                                        {c.bindData.map((b, i) => (
                                            <tr key={i} style={{ borderBottom: "1px solid hsl(0,0%,92%)" }}>
                                                <td style={tD}>{b.name}</td>
                                                <td style={{ ...tD, ...tR }}>{b.need}&quot;</td>
                                                <td style={{ ...tD, ...tR }}>{b.strips}</td>
                                                <td style={{ ...tD, ...tR, fontWeight: 700, color: "var(--color-accent-primary)" }}>{b.canBind} quilts</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div style={{ marginTop: 8, padding: 8, background: "hsl(45,20%,96%)", borderRadius: 6, fontSize: 12 }}>
                                ⭐ <strong>2.5&quot; strips are the PERFECT width</strong> for double-fold binding (~½&quot; finished). Consider buying an extra jelly roll just for binding!
                            </div>
                        </div>
                    )}

                    {/* TOOLBAR */}
                    <div className="toolbar" style={{ marginBottom: 10 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} /> Copy</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                    </div>

                    {/* ═══ COMPARISON TABLE ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }}
                            onClick={() => setShowComparison(!showComparison)}>
                            📊 Project Comparison Table
                            <ChevronDown size={14} style={{ transform: showComparison ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showComparison && (
                            <div style={{ marginTop: 10, overflowX: "auto" }}>
                                <table style={tS}>
                                    <thead><tr>
                                        <th style={tH}>Project</th><th style={tH}>Result Size</th>
                                        <th style={tH}>Difficulty</th><th style={tH}>Time</th><th style={tH}>Extra Fabric</th>
                                    </tr></thead>
                                    <tbody>
                                        {[
                                            ["Jelly Roll Race", `~${c.raceW}"×${c.raceH}"`, "★☆☆☆☆", "1-2 hr", "None"],
                                            ["Strip Quilt", `${stripLen}"×${c.stripFinW}"`, "★☆☆☆☆", "2-3 hr", "None"],
                                            ["Rail Fence", `${c.rfTotalSquares} sq (6")`, "★★☆☆☆", "3-4 hr", "None"],
                                            ["Nine-Patch", `${c.npBlocks} blocks (6")`, "★★☆☆☆", "4-6 hr", "Optional bg"],
                                            ["Log Cabin 8\"", `${c.lcBlocks8} blocks`, "★★☆☆☆", "5-8 hr", "Center fabric"],
                                            ["Log Cabin 12\"", `${c.lcBlocks12} blocks`, "★★★☆☆", "6-10 hr", "Center fabric"],
                                            ["Binding", `${c.bindData[1]?.canBind}+ throws`, "★☆☆☆☆", "—", "—"],
                                        ].map(([n, s, d, t, e], i) => (
                                            <tr key={i}><td style={tD}>{n}</td><td style={{ ...tD, fontWeight: 600 }}>{s}</td><td style={tD}>{d}</td><td style={tD}>{t}</td><td style={{ ...tD, fontSize: 10 }}>{e}</td></tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* ═══ JR REFERENCE ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }}
                            onClick={() => setShowJRRef(!showJRRef)}>
                            📏 Jelly Rolls Needed for Standard Sizes
                            <ChevronDown size={14} style={{ transform: showJRRef ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showJRRef && (
                            <div style={{ marginTop: 10, overflowX: "auto" }}>
                                <table style={tS}>
                                    <thead><tr>
                                        <th style={tH}>Quilt</th><th style={tH}>Nine-Patch</th><th style={tH}>Race</th>
                                    </tr></thead>
                                    <tbody>
                                        {[
                                            ["Baby 36×45\"", "1 JR + bg", "1 JR (trim)"],
                                            ["Throw 54×63\"", "2 JR", "1 JR"],
                                            ["Twin 60×80\"", "3 JR", "2 JR"],
                                            ["Queen 84×92\"", "4 JR", "2-3 JR"],
                                            ["King 90×99\"", "4 JR + bg", "3 JR"],
                                        ].map(([s, np, r], i) => (
                                            <tr key={i}><td style={{ ...tD, fontWeight: 600 }}>{s}</td><td style={tD}>{np}</td><td style={tD}>{r}</td></tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div style={{ marginTop: 8 }}><strong>Total strip length:</strong></div>
                                <table style={tS}>
                                    <thead><tr><th style={tH}>Rolls</th><th style={{ ...tH, ...tR }}>Strips</th><th style={{ ...tH, ...tR }}>Length</th><th style={{ ...tH, ...tR }}>Yards</th></tr></thead>
                                    <tbody>
                                        {[1, 2, 3, 4, 5].map(n => (
                                            <tr key={n} style={{ fontWeight: n === rolls ? 700 : 400, background: n === rolls ? "hsl(150,40%,95%)" : "transparent" }}>
                                                <td style={tD}>{n}</td>
                                                <td style={{ ...tD, ...tR }}>{n * 40}</td>
                                                <td style={{ ...tD, ...tR }}>{(n * 40 * 42).toLocaleString()}&quot;</td>
                                                <td style={{ ...tD, ...tR }}>{(n * 40 * 42 / 36).toFixed(1)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* ═══ EDUCATIONAL ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }}
                            onClick={() => setShowEdu(!showEdu)}>
                            📐 What Is a Jelly Roll &amp; Tips
                            <ChevronDown size={14} style={{ transform: showEdu ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showEdu && (
                            <div style={{ marginTop: 10, fontSize: 12.5, lineHeight: 1.9, color: "var(--color-text-secondary)" }}>
                                <p><strong>What is a jelly roll?</strong> A pre-cut bundle of 2.5&quot;-wide strips cut selvage to selvage (~42&quot;). Usually 40 strips — one of each fabric in a collection. Named for the cake-like appearance when rolled.</p>
                                <p style={{ marginTop: 6 }}><strong>Why 2.5&quot; is the magic width:</strong></p>
                                <div style={{ padding: 8, background: "hsl(150,15%,97%)", borderRadius: 6 }}>
                                    • 2.5&quot; → 2&quot; finished = standard nine-patch, four-patch square<br />
                                    • 2.5&quot; = standard double-fold binding width<br />
                                    • 2.5&quot; = standard rail fence strip width<br />
                                    • Aligns with the most common quilting measurements
                                </div>
                                <p style={{ marginTop: 6 }}><strong>Tips for maximizing value:</strong></p>
                                <div style={{ padding: 8, background: "hsl(45,20%,96%)", borderRadius: 6 }}>
                                    • Save one jelly roll for binding — perfect color match<br />
                                    • Nine-patch + background fabric doubles quilt size<br />
                                    • Two rolls from same collection ensure color balance<br />
                                    • Strips can be cross-cut to any shorter length needed
                                </div>
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
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Jelly Roll Facts</h4>
                        <div style={{ fontSize: 12, lineHeight: 2 }}>
                            <div>Strips: <strong>2.5&quot; × ~42&quot;</strong></div>
                            <div>Standard count: <strong>40 strips</strong></div>
                            <div>Total length: <strong>1,680&quot;</strong></div>
                            <div>= 140 feet = 46.7 yards</div>
                            <div style={{ marginTop: 6, fontSize: 11, color: "var(--color-text-tertiary)" }}>
                                2.5&quot; is the most versatile strip width in quilting.
                            </div>
                        </div>
                    </div>
                    <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>From 1 Jelly Roll</h4>
                        <div style={{ fontSize: 11, lineHeight: 2.2 }}>
                            <div>Race: ~50&quot;×65&quot;</div>
                            <div>Nine-patch: 64 blocks</div>
                            <div>Rail fence: 78 squares</div>
                            <div>Log cabin: 55 blocks (8&quot;)</div>
                            <div>Binding: 3-5 quilts</div>
                        </div>
                    </div>
                    <div className="glass-card related-tools">
                        <h4>Related Tools</h4>
                        <a href="/quilt/nine-patch-calculator" className="related-tool-link">Nine-Patch Calculator</a>
                        <a href="/quilt/log-cabin-calculator" className="related-tool-link">Log Cabin Calculator</a>
                        <a href="/quilt/charm-pack-calculator" className="related-tool-link">Charm Pack Calculator</a>
                        <a href="/quilt" className="related-tool-link">All Quilt Tools</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}