"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, ChevronDown, Info, AlertTriangle, Layers } from "lucide-react";

/* ─── constants ────────────────────────────────────── */
const CENTER_PRESETS = [
    { label: "Baby", w: 27, h: 36 }, { label: "Throw", w: 48, h: 60 },
    { label: "Twin", w: 54, h: 72 }, { label: "Full", w: 60, h: 78 },
    { label: "Queen", w: 72, h: 84 }, { label: "King", w: 88, h: 96 },
];
const BW_PRESETS = [1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 8, 10, 12];
type Corner = "butted-tb" | "butted-lr" | "mitered" | "cornerblock";

function toFrac(v: number): string {
    const w = Math.floor(v); const f = v - w;
    const fracs: [number, string][] = [[0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
    for (const [d, sym] of fracs) { if (Math.abs(f - d) < 0.02) return w > 0 ? `${w}${sym}` : sym; }
    if (f > 0.01) return v.toFixed(2);
    return String(w);
}
function roundUp(val: number, incr: number) { return Math.ceil(val / incr) * incr; }

interface BorderCfg { width: string; corner: Corner; grain: "wof" | "lof"; }

/* ─── component ──────────────────────────────────── */
export default function Page() {
    /* Center size */
    const [cw, setCw] = useState("72");
    const [ch, setCh] = useState("84");
    /* Fabric */
    const [fabricW, setFabricW] = useState("44");
    const [selvage, setSelvage] = useState("1.5");
    /* Borders */
    const [borderCount, setBorderCount] = useState(2);
    const [b1, setB1] = useState<BorderCfg>({ width: "2", corner: "butted-tb", grain: "wof" });
    const [b2, setB2] = useState<BorderCfg>({ width: "6", corner: "butted-tb", grain: "wof" });
    const [b3, setB3] = useState<BorderCfg>({ width: "3", corner: "butted-tb", grain: "wof" });
    /* Target size mode */
    const [targetMode, setTargetMode] = useState(false);
    const [targetW, setTargetW] = useState("90");
    const [targetH, setTargetH] = useState("104");
    /* UI */
    const [showEdu, setShowEdu] = useState(false);
    const [showWidthOptions, setShowWidthOptions] = useState(false);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const cfgs = [b1, b2, b3];
    const setters = [setB1, setB2, setB3];

    const centerW = parseFloat(cw) || 0;
    const centerH = parseFloat(ch) || 0;
    const fw = parseFloat(fabricW) || 44;
    const selvTotal = parseFloat(selvage) || 1.5;
    const usableW = fw - selvTotal;
    const sa = 0.25; // seam allowance

    /* ═══ CALCULATIONS ═══  */
    const results = useMemo(() => {
        if (centerW <= 0 || centerH <= 0) return null;
        let runW = centerW;
        let runH = centerH;
        const borderResults: {
            idx: number; bw: number; corner: Corner; grain: string;
            topLen: number; botLen: number; leftLen: number; rightLen: number;
            cutW: number; wofStripsPerSide: { top: number; bot: number; left: number; right: number };
            totalWofStrips: number; fabricInches: number; fabricYd: number; buyYd: number;
            lofYd: number; afterW: number; afterH: number;
        }[] = [];

        for (let i = 0; i < borderCount; i++) {
            const cfg = cfgs[i];
            const bw = parseFloat(cfg.width) || 0;
            if (bw <= 0) continue;
            const cutW = bw + sa * 2;
            const corner = cfg.corner;

            let topLen: number, botLen: number, leftLen: number, rightLen: number;

            if (corner === "mitered") {
                const extra = (bw + sa) * 2;
                topLen = runW + extra;
                botLen = runW + extra;
                leftLen = runH + extra;
                rightLen = runH + extra;
            } else if (corner === "cornerblock") {
                topLen = runW;
                botLen = runW;
                leftLen = runH;
                rightLen = runH;
            } else if (corner === "butted-lr") {
                // Sides full length first
                leftLen = runH + bw * 2;
                rightLen = runH + bw * 2;
                topLen = runW;
                botLen = runW;
            } else {
                // butted-tb: top/bottom full length first
                topLen = runW + bw * 2;
                botLen = runW + bw * 2;
                leftLen = runH;
                rightLen = runH;
            }

            // WOF strips needed per side
            const stripsForLen = (len: number) => Math.ceil(len / usableW);
            const wofTop = stripsForLen(topLen);
            const wofBot = stripsForLen(botLen);
            const wofLeft = stripsForLen(leftLen);
            const wofRight = stripsForLen(rightLen);
            const totalWof = wofTop + wofBot + wofLeft + wofRight;

            // Yardage: total strips × cut width
            const fabricInches = totalWof * cutW;
            const fabricYd = fabricInches / 36;
            const buyYd = roundUp(fabricYd + 0.125, 0.25);

            // LOF: longest strip determines yardage
            const longestStrip = Math.max(topLen, botLen, leftLen, rightLen);
            const lofYd = roundUp((longestStrip + 2) / 36, 0.25); // +2" safety

            const afterW = runW + bw * 2;
            const afterH = runH + bw * 2;

            borderResults.push({
                idx: i, bw, corner, grain: cfg.grain, cutW,
                topLen, botLen, leftLen, rightLen,
                wofStripsPerSide: { top: wofTop, bot: wofBot, left: wofLeft, right: wofRight },
                totalWofStrips: totalWof, fabricInches, fabricYd, buyYd, lofYd,
                afterW, afterH,
            });

            runW = afterW;
            runH = afterH;
        }

        const totalYd = borderResults.reduce((s, b) => s + (b.grain === "lof" ? b.lofYd : b.buyYd), 0);
        return { borders: borderResults, finalW: runW, finalH: runH, totalYd };
    }, [centerW, centerH, borderCount, b1, b2, b3, usableW, sa]);

    /* Target size reverse */
    const targetResult = useMemo(() => {
        if (!targetMode) return null;
        const tw = parseFloat(targetW) || 0;
        const th = parseFloat(targetH) || 0;
        if (tw <= centerW || th <= centerH) return null;
        const diffW = (tw - centerW) / 2;
        const diffH = (th - centerH) / 2;
        const needsAsymmetric = Math.abs(diffW - diffH) > 0.1;
        return { tw, th, diffW, diffH, needsAsymmetric, uniform: Math.min(diffW, diffH) };
    }, [targetMode, targetW, targetH, centerW, centerH]);

    /* Border width options table */
    const widthOptions = useMemo(() => {
        return [2, 3, 4, 5, 6, 8, 10, 12].map(bw => {
            const finW = centerW + bw * 2;
            const finH = centerH + bw * 2;
            const cutW2 = bw + 0.5;
            const topLen = centerW + bw * 2;
            const sideLen = centerH + bw * 2;
            const wofTop = Math.ceil(topLen / usableW);
            const wofSide = Math.ceil(sideLen / usableW);
            const totalStrips = (wofTop + wofSide) * 2;
            const fabIn = totalStrips * cutW2;
            const buyYd = roundUp(fabIn / 36 + 0.125, 0.25);
            return { bw, finW, finH, strips: totalStrips, buyYd };
        });
    }, [centerW, centerH, usableW]);

    /* Warnings */
    const warnings: string[] = [];
    for (let i = 0; i < borderCount; i++) {
        const bw = parseFloat(cfgs[i].width) || 0;
        if (bw > 24) warnings.push(`Border ${i + 1}: width over 24" is unusually wide.`);
    }
    if (centerW < 10) warnings.push("Quilt center width seems very small.");
    if (centerH < 10) warnings.push("Quilt center height seems very small.");

    const copyText = results ? `Quilt center: ${toFrac(centerW)}" × ${toFrac(centerH)}". ${results.borders.map((b, i) => `Border ${i + 1}: ${toFrac(b.bw)}" (${b.grain === "lof" ? toFrac(b.lofYd) : toFrac(b.buyYd)} yd)`).join(", ")}. Final size: ${toFrac(results.finalW)}" × ${toFrac(results.finalH)}". Total yardage: ${toFrac(results.totalYd)} yards.` : "";

    const cornerLabels: Record<Corner, string> = {
        "butted-tb": "Butted (top/bottom first)",
        "butted-lr": "Butted (sides first)",
        "mitered": "Mitered corners",
        "cornerblock": "Corner blocks",
    };

    const faqItems = [
        { q: "How do I calculate quilt border yardage?", a: "Measure your quilt center, choose your border width, then calculate the strip lengths needed for all four sides. For WOF borders, divide each side length by usable fabric width (usually 42\") to find strips needed. Multiply total strips by cut width (finished width + ½\") to get fabric needed." },
        { q: "What is the difference between mitered and butted quilt corners?", a: "Butted corners are simpler — two sides are sewn first (full quilt width), then the remaining sides are sewn between them. Mitered corners join all four strips at 45° angles at each corner for a more professional look. Mitered corners require longer strips and more fabric." },
        { q: "How much extra fabric do I need for mitered corners?", a: "For mitered corners, each strip must extend past the quilt corner by at least the border width + seam allowance on each end. For a 4\" border, that's about 4.25\" extra per end (8.5\" total per strip). This typically adds 10-20% more yardage compared to butted corners." },
        { q: "How do I measure a quilt for adding borders?", a: "Always measure through the CENTER of your quilt, not along the edges. Edges stretch during handling and sewing, making them unreliable. Measure width through the vertical center and height through the horizontal center. Cut your border strips to these measurements." },
        { q: "Why does my quilt border wave?", a: "Wavy borders are caused by cutting border strips to match the (stretched) edge measurement instead of the center measurement, insufficient pinning, or feed dog pressure stretching fabric during sewing. Always measure through center, pin at center and quarter points, and press seams outward." },
        { q: "How do I calculate how many border strips to cut?", a: "Divide the longest border side by your usable fabric width (bolt width minus selvage, usually ~42\"). Round up. For a quilt needing 92\" borders from 42\" fabric: 92÷42 = 2.2 → cut 3 strips and join them. Repeat for all four sides." },
        { q: "What is the difference between length-of-grain and width-of-grain borders?", a: "WOF borders are cut across the fabric width (selvage to selvage) and joined to reach full length — uses less fabric. LOF borders are cut parallel to the selvage as one continuous piece — no joining, more stable, professional appearance, but requires more yardage." },
        { q: "What border width should I add to reach a specific quilt size?", a: "Subtract your quilt center width from your target width, then divide by 2. Example: target 90\" wide, center 72\" wide → (90-72)÷2 = 9\" border needed on each side. Use our 'Target Size Mode' for automatic calculation including multiple borders." },
        { q: "How do I sew mitered corners?", a: "1) Sew border strips to all four sides, stopping ¼\" from each corner. 2) Fold quilt diagonally at corner. 3) Align border strips. 4) Mark 45° line from corner to outer edge. 5) Stitch on line. 6) Check corner lies flat. 7) Trim to ¼\" seam allowance. 8) Press seam open." },
        { q: "How many border strips join to make one long border?", a: "Divide the border length needed by your usable fabric width (~42\"). A 92\" border needs 92÷42 = 2.2, so 3 WOF strips joined with diagonal seams. Most borders for bed quilts need 2-3 joined strips per side." },
    ];

    const renderBorderCfg = (idx: number) => {
        const cfg = cfgs[idx];
        const set = setters[idx];
        return (
            <div key={idx} className={`glass-card ${styles.calculatorCard}`}>
                <h2 className={styles.calcTitle}>Border {idx + 1}</h2>
                {/* Width */}
                <label className="input-label" style={{ marginBottom: 4 }}>Finished width</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
                    {BW_PRESETS.map(b => (
                        <button key={b} className={`btn btn-sm ${parseFloat(cfg.width) === b ? "btn-primary" : "btn-secondary"}`}
                            onClick={() => set({ ...cfg, width: String(b) })}>{toFrac(b)}&quot;</button>
                    ))}
                </div>
                <div className="input-group" style={{ maxWidth: 150, marginBottom: 6 }}>
                    <input type="number" className="input-field" value={cfg.width} onChange={e => set({ ...cfg, width: e.target.value })} min={0.5} max={24} step={0.25} />
                </div>
                <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 10 }}>Cut width: {toFrac((parseFloat(cfg.width) || 0) + 0.5)}&quot; (finished + ½&quot; SA)</div>

                {/* Corner style */}
                <label className="input-label" style={{ marginBottom: 4 }}>Corner style</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
                    {(["butted-tb", "butted-lr", "mitered", "cornerblock"] as Corner[]).map(c => (
                        <button key={c} className={`btn btn-sm ${cfg.corner === c ? "btn-primary" : "btn-secondary"}`}
                            onClick={() => set({ ...cfg, corner: c })}>{cornerLabels[c]}</button>
                    ))}
                </div>
                {cfg.corner === "mitered" && <div style={{ fontSize: 12, color: "hsl(35,80%,45%)", marginBottom: 6 }}><Info size={12} style={{ display: "inline", marginRight: 4 }} />Mitered corners require longer strips — extra yardage calculated automatically.</div>}
                {cfg.corner === "cornerblock" && <div style={{ fontSize: 12, color: "var(--color-accent-primary)", marginBottom: 6 }}><Info size={12} style={{ display: "inline", marginRight: 4 }} />Corner blocks: {toFrac(parseFloat(cfg.width) || 0)}&quot; × {toFrac(parseFloat(cfg.width) || 0)}&quot; finished — 4 squares needed.</div>}

                {/* Grain */}
                <label className="input-label" style={{ marginBottom: 4 }}>Grain direction</label>
                <div style={{ display: "flex", gap: 4 }}>
                    <button className={`btn btn-sm ${cfg.grain === "wof" ? "btn-primary" : "btn-secondary"}`}
                        onClick={() => set({ ...cfg, grain: "wof" })}>Cross-Grain (WOF)</button>
                    <button className={`btn btn-sm ${cfg.grain === "lof" ? "btn-primary" : "btn-secondary"}`}
                        onClick={() => set({ ...cfg, grain: "lof" })}>Length-of-Grain (LOF)</button>
                </div>
                {cfg.grain === "lof" && <div style={{ fontSize: 12, color: "hsl(35,80%,45%)", marginTop: 4 }}><Info size={12} style={{ display: "inline", marginRight: 4 }} />LOF: no strip joining, more stable. Requires more fabric.</div>}
            </div>
        );
    };

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "Border Calculator" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    {/* HEADER */}
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Layers size={14} strokeWidth={1.5} /> Quilt #143</span>
                        <h1>Border Width &amp; Yardage Calculator</h1>
                        <p>Calculate border dimensions, strip counts, and yardage for butted corners, mitered corners, and corner blocks. Supports up to 3 borders with WOF and LOF grain direction.</p>
                    </div>

                    {/* ① QUILT CENTER */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>① Quilt Center Size (before borders)</h2>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                            {CENTER_PRESETS.map(s => (
                                <button key={s.label} className={`btn btn-sm ${parseFloat(cw) === s.w && parseFloat(ch) === s.h ? "btn-primary" : "btn-secondary"}`}
                                    onClick={() => { setCw(String(s.w)); setCh(String(s.h)); }}>{s.label} ({s.w}×{s.h})</button>
                            ))}
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group">
                                <label className="input-label">Width (inches)</label>
                                <input type="number" className="input-field" value={cw} onChange={e => setCw(e.target.value)} min={1} />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Height (inches)</label>
                                <input type="number" className="input-field" value={ch} onChange={e => setCh(e.target.value)} min={1} />
                            </div>
                        </div>
                    </div>

                    {/* ② FABRIC */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>② Fabric Settings</h2>
                        <div className="calculator-form-row">
                            <div className="input-group">
                                <label className="input-label">Fabric bolt width</label>
                                <select className="input-field" value={fabricW} onChange={e => setFabricW(e.target.value)}>
                                    <option value="42">42&quot;</option><option value="44">44&quot;</option><option value="45">45&quot;</option><option value="60">60&quot;</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Selvage (total both sides)</label>
                                <select className="input-field" value={selvage} onChange={e => setSelvage(e.target.value)}>
                                    <option value="0.5">½&quot; (minimal)</option><option value="1.5">1½&quot; (standard)</option><option value="2">2&quot; (generous)</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Usable fabric width: {toFrac(usableW)}&quot;</div>
                    </div>

                    {/* ③ BORDER COUNT */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>③ Number of Borders</h2>
                        <div style={{ display: "flex", gap: 6 }}>
                            {[1, 2, 3].map(n => (
                                <button key={n} className={`btn btn-sm ${borderCount === n ? "btn-primary" : "btn-secondary"}`}
                                    onClick={() => setBorderCount(n)}>{n} border{n > 1 ? "s" : ""}</button>
                            ))}
                        </div>
                    </div>

                    {/* ④ BORDER CONFIGS */}
                    {Array.from({ length: borderCount }, (_, i) => renderBorderCfg(i))}

                    {/* ⑤ TARGET SIZE MODE */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>⑤ Target Size Mode (optional)</h2>
                        <label style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            <input type="checkbox" checked={targetMode} onChange={e => setTargetMode(e.target.checked)} style={{ accentColor: "var(--color-accent-primary)" }} />
                            I want to reach a specific finished quilt size
                        </label>
                        {targetMode && (<>
                            <div className="calculator-form-row">
                                <div className="input-group">
                                    <label className="input-label">Target width</label>
                                    <input type="number" className="input-field" value={targetW} onChange={e => setTargetW(e.target.value)} min={1} />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Target height</label>
                                    <input type="number" className="input-field" value={targetH} onChange={e => setTargetH(e.target.value)} min={1} />
                                </div>
                            </div>
                            {targetResult && (
                                <div style={{ marginTop: 10, padding: 12, background: "hsl(150,40%,95%)", borderRadius: "var(--radius-md)", fontSize: 13, lineHeight: 1.8 }}>
                                    <strong>Border Width Needed:</strong>
                                    <div>Width gap: ({toFrac(targetResult.tw)}&quot; − {toFrac(centerW)}&quot;) ÷ 2 = <strong>{toFrac(targetResult.diffW)}&quot;</strong> each side</div>
                                    <div>Height gap: ({toFrac(targetResult.th)}&quot; − {toFrac(centerH)}&quot;) ÷ 2 = <strong>{toFrac(targetResult.diffH)}&quot;</strong> each side</div>
                                    {targetResult.needsAsymmetric && (
                                        <div style={{ marginTop: 6, color: "hsl(35,80%,45%)" }}>
                                            <AlertTriangle size={12} style={{ display: "inline", marginRight: 4 }} />
                                            Width and height need different border widths. Options:
                                            <ul style={{ paddingLeft: 18, marginTop: 2 }}>
                                                <li>Use {toFrac(targetResult.uniform)}&quot; uniform border (closest fit: {toFrac(centerW + targetResult.uniform * 2)}&quot; × {toFrac(centerH + targetResult.uniform * 2)}&quot;)</li>
                                                <li>Use different widths: sides {toFrac(targetResult.diffW)}&quot;, top/bottom {toFrac(targetResult.diffH)}&quot; for exact {toFrac(targetResult.tw)}&quot; × {toFrac(targetResult.th)}&quot;</li>
                                                <li>Use two borders to distribute the difference</li>
                                            </ul>
                                        </div>
                                    )}
                                    {!targetResult.needsAsymmetric && (
                                        <div style={{ marginTop: 4, color: "hsl(140,60%,35%)" }}>✓ A uniform {toFrac(targetResult.diffW)}&quot; border achieves exactly {toFrac(targetResult.tw)}&quot; × {toFrac(targetResult.th)}&quot;</div>
                                    )}
                                </div>
                            )}
                        </>)}
                    </div>

                    {/* Warnings */}
                    {warnings.length > 0 && warnings.map((w, i) => (
                        <div key={i} style={{ fontSize: 12, color: "hsl(0,70%,50%)", marginTop: 4 }}>
                            <AlertTriangle size={12} style={{ display: "inline", marginRight: 4 }} />{w}
                        </div>
                    ))}

                    {/* ═══ RESULTS ═══ */}
                    {results && results.borders.length > 0 && (<>
                        <div className={`calculator-results ${styles.results}`}>
                            <div className="result-card">
                                <div className="result-value">Final size: {toFrac(results.finalW)}&quot; × {toFrac(results.finalH)}&quot;</div>
                                <div className="result-label">Total border yardage: {toFrac(results.totalYd)} yards across {results.borders.length} border{results.borders.length > 1 ? "s" : ""}</div>
                            </div>

                            {/* Step-by-step size building */}
                            <div style={{ background: "var(--color-bg-secondary)", borderRadius: "var(--radius-md)", padding: 14, marginTop: 10, fontSize: 13, lineHeight: 2, fontFamily: "var(--font-mono, monospace)" }}>
                                <div style={{ fontWeight: 600, marginBottom: 4 }}>How Your Quilt Grows:</div>
                                <div>Start (center): {toFrac(centerW)}&quot; × {toFrac(centerH)}&quot;</div>
                                {results.borders.map((b, i) => (
                                    <div key={i}>
                                        &nbsp;&nbsp;▼ + Border {i + 1} ({toFrac(b.bw)}&quot; {cornerLabels[b.corner as Corner].split(" ")[0].toLowerCase()})
                                        <br />&nbsp;&nbsp;After Border {i + 1}: <strong>{toFrac(b.afterW)}&quot; × {toFrac(b.afterH)}&quot;</strong> (+{toFrac(b.bw * 2)}&quot; each dimension)
                                    </div>
                                ))}
                            </div>

                            {/* Per-border details */}
                            {results.borders.map((b, i) => (
                                <div key={i} style={{ background: "var(--color-bg-secondary)", borderRadius: "var(--radius-md)", padding: 14, marginTop: 10, fontSize: 13, lineHeight: 1.8 }}>
                                    <strong>Border {i + 1} — {toFrac(b.bw)}&quot; ({cornerLabels[b.corner as Corner]})</strong>
                                    <div className={styles.resultDetails} style={{ marginTop: 6 }}>
                                        <div className={styles.resultRow}><span>Cut width</span><strong>{toFrac(b.cutW)}&quot;</strong></div>
                                        <div className={styles.resultRow}><span>Top strip</span><strong>{toFrac(b.topLen)}&quot; ({b.wofStripsPerSide.top} WOF strip{b.wofStripsPerSide.top > 1 ? "s joined" : ""})</strong></div>
                                        <div className={styles.resultRow}><span>Bottom strip</span><strong>{toFrac(b.botLen)}&quot; ({b.wofStripsPerSide.bot} WOF strip{b.wofStripsPerSide.bot > 1 ? "s joined" : ""})</strong></div>
                                        <div className={styles.resultRow}><span>Left strip</span><strong>{toFrac(b.leftLen)}&quot; ({b.wofStripsPerSide.left} WOF strip{b.wofStripsPerSide.left > 1 ? "s joined" : ""})</strong></div>
                                        <div className={styles.resultRow}><span>Right strip</span><strong>{toFrac(b.rightLen)}&quot; ({b.wofStripsPerSide.right} WOF strip{b.wofStripsPerSide.right > 1 ? "s joined" : ""})</strong></div>
                                        <div className={styles.resultRow} style={{ borderTop: "1px solid var(--color-border)", paddingTop: 6, marginTop: 4 }}>
                                            <span>WOF strips total</span><strong>{b.totalWofStrips} strips × {toFrac(b.cutW)}&quot;</strong>
                                        </div>
                                        {b.grain === "wof" ? (
                                            <div className={styles.resultRow}><span>Fabric needed</span><strong>{toFrac(b.fabricYd)} yd → buy {toFrac(b.buyYd)} yd</strong></div>
                                        ) : (
                                            <div className={styles.resultRow}><span>LOF yardage</span><strong>Buy {toFrac(b.lofYd)} yd (no joining)</strong></div>
                                        )}
                                        <div className={styles.resultRow}><span>After border {i + 1}</span><strong>{toFrac(b.afterW)}&quot; × {toFrac(b.afterH)}&quot;</strong></div>
                                    </div>
                                    {b.corner === "cornerblock" && (
                                        <div style={{ marginTop: 6, fontSize: 12, color: "var(--color-accent-primary)" }}>
                                            + 4 corner blocks at {toFrac(b.bw + 0.5)}&quot; × {toFrac(b.bw + 0.5)}&quot; (unfinished)
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Summary table */}
                            {results.borders.length > 1 && (
                                <div style={{ marginTop: 10 }}>
                                    <div className={styles.tableWrap}>
                                        <table className={styles.convTable}>
                                            <thead><tr><th>Border</th><th>Width</th><th>Corners</th><th>Grain</th><th>Strips</th><th>Buy</th></tr></thead>
                                            <tbody>
                                                {results.borders.map((b, i) => (
                                                    <tr key={i}>
                                                        <td>Border {i + 1}</td>
                                                        <td>{toFrac(b.bw)}&quot;</td>
                                                        <td>{cornerLabels[b.corner as Corner].split("(")[0].trim()}</td>
                                                        <td>{b.grain.toUpperCase()}</td>
                                                        <td>{b.totalWofStrips}</td>
                                                        <td style={{ fontWeight: 600 }}>{toFrac(b.grain === "lof" ? b.lofYd : b.buyYd)} yd</td>
                                                    </tr>
                                                ))}
                                                <tr style={{ borderTop: "2px solid var(--color-border)", fontWeight: 700 }}>
                                                    <td colSpan={5}>Total</td>
                                                    <td>{toFrac(results.totalYd)} yd</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Toolbar */}
                        <div className="toolbar" style={{ marginBottom: 16 }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} /> Copy</button>
                            <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                        </div>
                    </>)}

                    {/* WIDTH OPTIONS TABLE */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
                            onClick={() => setShowWidthOptions(!showWidthOptions)}>
                            📐 Border Width Options for Your Quilt <ChevronDown size={14} style={{ transform: showWidthOptions ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                        </button>
                        {showWidthOptions && (
                            <div style={{ marginTop: 10 }}>
                                <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 6 }}>Center: {toFrac(centerW)}&quot; × {toFrac(centerH)}&quot; | Single border, butted corners, {toFrac(fw)}&quot; fabric</div>
                                <div className={styles.tableWrap}>
                                    <table className={styles.convTable}>
                                        <thead><tr><th>Border Width</th><th>Final Width</th><th>Final Height</th><th>WOF Strips</th><th>Buy</th></tr></thead>
                                        <tbody>
                                            {widthOptions.map((o, i) => (
                                                <tr key={i}>
                                                    <td>{toFrac(o.bw)}&quot;</td>
                                                    <td>{toFrac(o.finW)}&quot;</td>
                                                    <td>{toFrac(o.finH)}&quot;</td>
                                                    <td>{o.strips}</td>
                                                    <td style={{ fontWeight: 600 }}>{toFrac(o.buyYd)} yd</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* EDUCATIONAL */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
                            onClick={() => setShowEdu(!showEdu)}>
                            📚 Butted vs Mitered Corners — Complete Guide <ChevronDown size={14} style={{ transform: showEdu ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                        </button>
                        {showEdu && (
                            <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
                                <h4 style={{ fontSize: 15, fontWeight: 600, color: "var(--color-text-primary)" }}>Butted Corners (Straight)</h4>
                                <ul style={{ paddingLeft: 20, marginTop: 6 }}>
                                    <li>Two opposite sides sewn first (full quilt length)</li>
                                    <li>Remaining sides cut shorter to fit between</li>
                                    <li>Visible seam at corners — simpler to sew</li>
                                    <li><strong>Sew order:</strong> top/bottom first for horizontal designs; sides first for vertical designs</li>
                                </ul>
                                <h4 style={{ fontSize: 15, fontWeight: 600, marginTop: 14, color: "var(--color-text-primary)" }}>Mitered Corners</h4>
                                <ul style={{ paddingLeft: 20, marginTop: 6 }}>
                                    <li>All strips extend past corners and join at 45° angle</li>
                                    <li>Professional diagonal seam at each corner</li>
                                    <li>Requires extra strip length: border width + SA per end</li>
                                    <li><strong>Required for:</strong> striped fabric, plaids, border prints</li>
                                </ul>
                                <h4 style={{ fontSize: 15, fontWeight: 600, marginTop: 14, color: "var(--color-text-primary)" }}>Always Measure Through Center!</h4>
                                <p style={{ marginTop: 4 }}>
                                    Quilt edges stretch during handling — they are <strong>never accurate</strong>. Always measure your quilt through the center to determine border strip length. Cut borders to center measurement and ease to fit the edge. Borders cut to edge measurement result in wavy borders.
                                </p>
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
                        <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.9, fontFamily: "var(--font-mono, monospace)" }}>
                            <div>Cut W = Fin W + ½&quot;</div>
                            <div>Strips = SideLen ÷ Usable</div>
                            <div>Yd = Strips × CutW ÷ 36</div>
                        </div>
                    </div>
                    <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Quick Answer</h4>
                        <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.8 }}>
                            <div>4&quot; border, Queen → <strong>1 yd</strong></div>
                            <div>6&quot; border, Queen → <strong>1½ yd</strong></div>
                            <div>4&quot; border, King → <strong>1¼ yd</strong></div>
                            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 4 }}>WOF, butted corners, 44&quot; fabric</div>
                        </div>
                    </div>
                    <div className="glass-card related-tools">
                        <h4>Related Tools</h4>
                        <a href="/quilt/blocks-needed" className="related-tool-link">Blocks Needed Calculator</a>
                        <a href="/quilt/sashing-calculator" className="related-tool-link">Sashing Calculator</a>
                        <a href="/quilt/backing-calculator" className="related-tool-link">Backing Calculator</a>
                        <a href="/quilt/binding-calculator" className="related-tool-link">Binding Calculator</a>
                        <a href="/quilt" className="related-tool-link">All Quilt Tools</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}