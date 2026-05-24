"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, ChevronDown, Frame } from "lucide-react";

/* helpers */
function toFrac(v: number): string {
    if (v <= 0) return "0";
    const w = Math.floor(v);
    const f = v - w;
    const map: [number, string][] = [[0, ""], [0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
    let best = map[0], bd = 1;
    for (const [n, s] of map) { const d = Math.abs(f - n); if (d < bd) { bd = d; best = [n, s]; } }
    if (Math.abs(f - 1) < bd) return `${w + 1}`;
    if (!best[1]) return w > 0 ? `${w}` : "0";
    return w > 0 ? `${w} ${best[1]}` : `${best[1]}`;
}

type Header = "rod-pocket" | "pinch-pleat" | "pencil-pleat" | "eyelet" | "tab-top" | "wave" | "flat";
const headers: { key: Header; name: string; topAllow: number; desc: string }[] = [
    { key: "rod-pocket", name: "Rod Pocket", topAllow: 4, desc: "Fabric casing slides onto rod" },
    { key: "pinch-pleat", name: "Pinch Pleat", topAllow: 4, desc: "Formal pleated header with hooks" },
    { key: "pencil-pleat", name: "Pencil Pleat", topAllow: 3, desc: "Gathered header with tape" },
    { key: "eyelet", name: "Eyelet / Grommet", topAllow: 2, desc: "Metal rings punched through fabric" },
    { key: "tab-top", name: "Tab Top", topAllow: 5, desc: "Fabric loops hang from rod" },
    { key: "wave", name: "Wave / S-fold", topAllow: 3, desc: "Modern undulating folds" },
    { key: "flat", name: "Flat Panel", topAllow: 1, desc: "No gather, clip or track mount" },
];

type Drop = "sill" | "apron" | "floor" | "puddle" | "custom";
const drops: { key: Drop; name: string; desc: string }[] = [
    { key: "sill", name: "Sill", desc: "Ends at window sill" },
    { key: "apron", name: "Apron", desc: "4\" below sill" },
    { key: "floor", name: "Floor", desc: "½\" above floor" },
    { key: "puddle", name: "Puddle", desc: "Pools on floor" },
    { key: "custom", name: "Custom", desc: "Enter exact length" },
];

const fullnessOpts = [
    { v: 1.5, label: "1.5×", desc: "Light — sheers, casual" },
    { v: 2, label: "2×", desc: "Standard — most curtains" },
    { v: 2.5, label: "2.5×", desc: "Full — formal look" },
    { v: 3, label: "3×", desc: "Very full — luxury" },
];

const faqItems = [
    { q: "How much fabric do I need for curtains?", a: "It depends on window width, fullness ratio, finished length, header type, hem depth, and pattern repeat. For a standard 60\" window with 2× fullness and floor-length curtains, expect ~6-8 yards total for a pair. Use the calculator above for exact amounts." },
    { q: "What fullness ratio should I use for curtains?", a: "2× is standard for most curtains (fabric twice the rod width). Use 1.5× for sheers/voile, 2.5× for formal, 3× for luxury/hotel. Heavier fabrics (velvet) drape better at 2×; lightweight fabrics benefit from 2.5-3× for body." },
    { q: "How do I account for pattern repeat?", a: "Measure the vertical pattern repeat distance. Each cut length must be rounded UP to the nearest full repeat so patterns align between panels. This adds waste — fabric with large repeats (12\"+) can add 10-20% extra yardage." },
    { q: "What is the difference between finished length and cut length?", a: "Finished length is the visible curtain from rod to hem. Cut length adds: top header allowance (2-5\" depending on style), bottom hem allowance (6-8\" for double-fold hem), and any extra for pattern matching. Cut length is always longer than finished length." },
    { q: "How many fabric widths do I need per panel?", a: "Divide the fabric width needed per panel (after fullness) by the bolt width (usually 54\"). If over 1: you need multiple widths joined. Example: 80\" fabric needed ÷ 54\" bolt = 1.48 widths → 2 widths per panel, join them together." },
    { q: "Should I use a single or double fold hem?", a: "Double fold (fold fabric twice) is recommended for curtains — it hides raw edges, adds weight for better drape, and looks more professional. A 4\" double-fold hem requires 8\" of fabric. Single fold is lighter but shows a raw fold inside." },
    { q: "How do I measure for curtains?", a: "Measure: 1) Rod width (plus extensions past window). 2) From rod to desired end point (sill, floor, etc). 3) Rod diameter (for rod pocket). Use a steel tape measure, not fabric tape. Measure in at least 3 places — walls and floors are rarely perfectly level." },
    { q: "How much extra should I buy for safety?", a: "Most professionals add 10% extra as a buffer for cutting errors, shrinkage, and future repairs. For expensive fabric, consider buying an extra ½ yard. Always pre-wash washable fabrics — cotton can shrink 3-5%." },
    { q: "Do I need lining for my curtains?", a: "Lining protects fabric from sun damage, improves drape, adds insulation, and looks neater from outside. Blackout lining blocks light. Thermal lining saves energy. Lining is cut slightly smaller than the curtain — roughly 1\" less in width and length." },
    { q: "How wide should curtains be for a 72-inch window?", a: "At 2× fullness, you need 144\" of fabric width total. For a pair (2 panels): 72\" per panel. At 54\" fabric width: each panel needs 2 fabric widths (108\"), with excess trimmed or folded. That's 4 widths total." },
];

export default function Page() {
    const [winW, setWinW] = useState(60);
    const [winH, setWinH] = useState(84);
    const [rodAbove, setRodAbove] = useState(4);
    const [rodExt, setRodExt] = useState(3);
    const [dropStyle, setDropStyle] = useState<Drop>("floor");
    const [puddleExtra, setPuddleExtra] = useState(4);
    const [customLen, setCustomLen] = useState(84);
    const [headerStyle, setHeaderStyle] = useState<Header>("rod-pocket");
    const [fullness, setFullness] = useState(2);
    const [hemDepth, setHemDepth] = useState(4);
    const [hemType, setHemType] = useState<"single" | "double">("double");
    const [sideHem, setSideHem] = useState(1.5);
    const [panels, setPanels] = useState(2);
    const [fabricW, setFabricW] = useState(54);
    const [hasRepeat, setHasRepeat] = useState(false);
    const [vRepeat, setVRepeat] = useState(0);
    const [lined, setLined] = useState(false);
    const [liningW, setLiningW] = useState(54);

    const [showBreakdown, setShowBreakdown] = useState(false);
    const [showLining, setShowLining] = useState(false);
    const [showRef, setShowRef] = useState(false);
    const [showEdu, setShowEdu] = useState(false);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const header = headers.find(h => h.key === headerStyle) || headers[0];

    const calc = useMemo(() => {
        // Rod width = window width + extensions each side
        const rodW = winW + rodExt * 2;

        // Finished length
        let finLen = 0;
        if (dropStyle === "sill") finLen = winH;
        else if (dropStyle === "apron") finLen = winH + 4;
        else if (dropStyle === "floor") finLen = winH + rodAbove - 0.5; // rod height above window, floor = floor-to-window-top + above - 0.5 clearance
        else if (dropStyle === "puddle") finLen = winH + rodAbove + puddleExtra;
        else finLen = customLen;

        // Top allowance (header-specific)
        const topAllow = header.topAllow;
        // Bottom hem
        const hemAllow = hemType === "double" ? hemDepth * 2 : hemDepth;

        // Cut length per panel
        let cutLen = finLen + topAllow + hemAllow;

        // Pattern repeat adjustment
        let repeatExtra = 0;
        if (hasRepeat && vRepeat > 0) {
            const adjusted = Math.ceil(cutLen / vRepeat) * vRepeat;
            repeatExtra = adjusted - cutLen;
            cutLen = adjusted;
        }

        // Width calculation
        const totalFabricW = rodW * fullness;
        const panelFabricW = totalFabricW / panels;
        const panelCutW = panelFabricW + sideHem * 2;
        const widthsPerPanel = Math.ceil(panelCutW / fabricW);
        const totalWidths = widthsPerPanel * panels;

        // Yardage
        const rawYd = (totalWidths * cutLen) / 36;
        const buyYd = Math.ceil(rawYd * 4) / 4;
        const bufferYd = Math.ceil(buyYd * 1.1 * 4) / 4;

        // Lining (cut 1" narrower, 1" shorter per panel)
        const liningCutW = panelFabricW - 1;
        const liningCutLen = finLen + topAllow - 1;
        const liningWidths = Math.ceil(liningCutW / liningW) * panels;
        const liningRawYd = (liningWidths * liningCutLen) / 36;
        const liningBuyYd = Math.ceil(liningRawYd * 4) / 4;

        return {
            rodW, finLen, topAllow, hemAllow, cutLen, repeatExtra,
            totalFabricW, panelFabricW, panelCutW, widthsPerPanel, totalWidths,
            rawYd, buyYd, bufferYd,
            liningCutW, liningCutLen, liningWidths, liningBuyYd,
        };
    }, [winW, winH, rodAbove, rodExt, dropStyle, puddleExtra, customLen,
        headerStyle, fullness, hemDepth, hemType, sideHem, panels, fabricW,
        hasRepeat, vRepeat, lined, liningW, header.topAllow]);

    const tH = { padding: "5px 8px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left" as const, fontSize: 11, fontWeight: 600 as const };
    const tD = { padding: "4px 8px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11 };

    const copyText = `Curtains for ${winW}"×${winH}" window: ${panels} panels, ${fullness}× fullness, ${header.name}. Cut length: ${calc.cutLen}". Fabric widths: ${calc.totalWidths}. Buy: ${toFrac(calc.buyYd)} yards${lined ? ` + ${toFrac(calc.liningBuyYd)} yards lining` : ""}.`;

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Curtain Tools", href: "/curtains" }, { label: "Curtain Yardage Calculator" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Frame size={14} strokeWidth={1.5} /> Curtain #238</span>
                        <h1>Curtain Yardage Calculator</h1>
                        <p>The complete curtain fabric calculator. Enter your window dimensions, fullness, header style, hem, and pattern repeat to get exact yardage — including lining.</p>
                    </div>

                    {/* ① WINDOW */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>① Window &amp; Rod</h2>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Window width (in)</label>
                                <input type="number" className="input-field" value={winW} onChange={e => setWinW(Math.max(1, parseFloat(e.target.value) || 0))} min={1} /></div>
                            <div className="input-group"><label className="input-label">Window height (in)</label>
                                <input type="number" className="input-field" value={winH} onChange={e => setWinH(Math.max(1, parseFloat(e.target.value) || 0))} min={1} /></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Rod above window (in)</label>
                                <input type="number" className="input-field" value={rodAbove} onChange={e => setRodAbove(Math.max(0, parseFloat(e.target.value) || 0))} min={0} /></div>
                            <div className="input-group"><label className="input-label">Rod extension each side (in)</label>
                                <input type="number" className="input-field" value={rodExt} onChange={e => setRodExt(Math.max(0, parseFloat(e.target.value) || 0))} min={0} /></div>
                        </div>
                        <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 4 }}>Rod width: <strong>{calc.rodW}&quot;</strong> (window + {rodExt * 2}&quot; extensions)</div>
                    </div>

                    {/* ② DROP STYLE */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>② Curtain Length</h2>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                            {drops.map(d => (
                                <button key={d.key} className={`btn btn-sm ${dropStyle === d.key ? "btn-primary" : "btn-ghost"}`} onClick={() => setDropStyle(d.key)} style={{ fontSize: 10 }}>
                                    {d.name} <span style={{ fontSize: 8, opacity: 0.7 }}>({d.desc})</span>
                                </button>
                            ))}
                        </div>
                        {dropStyle === "puddle" && (
                            <div className="input-group" style={{ maxWidth: 180 }}><label className="input-label">Puddle extra (in)</label>
                                <input type="number" className="input-field" value={puddleExtra} onChange={e => setPuddleExtra(Math.max(1, parseFloat(e.target.value) || 4))} min={1} /></div>
                        )}
                        {dropStyle === "custom" && (
                            <div className="input-group" style={{ maxWidth: 180 }}><label className="input-label">Custom finished length (in)</label>
                                <input type="number" className="input-field" value={customLen} onChange={e => setCustomLen(Math.max(1, parseFloat(e.target.value) || 0))} min={1} /></div>
                        )}
                        <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 4 }}>Finished length: <strong>{calc.finLen}&quot;</strong></div>
                    </div>

                    {/* ③ HEADER */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>③ Header Style</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 6 }}>
                            {headers.map(h => (
                                <button key={h.key} className={`btn btn-sm ${headerStyle === h.key ? "btn-primary" : "btn-ghost"}`} onClick={() => setHeaderStyle(h.key)} style={{ fontSize: 10, textAlign: "left", padding: "6px 8px", height: "auto" }}>
                                    <strong>{h.name}</strong><br /><span style={{ fontSize: 8, opacity: 0.7 }}>{h.desc}</span>
                                </button>
                            ))}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 6 }}>Top allowance: <strong>{header.topAllow}&quot;</strong></div>
                    </div>

                    {/* ④ FULLNESS */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>④ Fullness &amp; Panels</h2>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                            {fullnessOpts.map(f => (
                                <button key={f.v} className={`btn btn-sm ${fullness === f.v ? "btn-primary" : "btn-ghost"}`} onClick={() => setFullness(f.v)} style={{ fontSize: 10 }}>
                                    {f.label} <span style={{ fontSize: 8, opacity: 0.7 }}>({f.desc})</span>
                                </button>
                            ))}
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Number of panels</label>
                                <div style={{ display: "flex", gap: 3 }}>
                                    {[1, 2, 3, 4].map(n => (
                                        <button key={n} className={`btn btn-sm ${panels === n ? "btn-primary" : "btn-ghost"}`} onClick={() => setPanels(n)} style={{ fontSize: 10 }}>{n} {n === 2 ? "(pair)" : ""}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="input-group"><label className="input-label">Fabric bolt width (in)</label>
                                <div style={{ display: "flex", gap: 3 }}>
                                    {[45, 54, 60, 118].map(w => (
                                        <button key={w} className={`btn btn-sm ${fabricW === w ? "btn-primary" : "btn-ghost"}`} onClick={() => setFabricW(w)} style={{ fontSize: 10 }}>{w}&quot;</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ⑤ HEM */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>⑤ Hems &amp; Allowances</h2>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Bottom hem depth (in)</label>
                                <input type="number" className="input-field" value={hemDepth} onChange={e => setHemDepth(Math.max(1, parseFloat(e.target.value) || 4))} min={1} /></div>
                            <div className="input-group"><label className="input-label">Hem type</label>
                                <div style={{ display: "flex", gap: 3 }}>
                                    {([["single", "Single fold"], ["double", "Double fold"]] as const).map(([k, l]) => (
                                        <button key={k} className={`btn btn-sm ${hemType === k ? "btn-primary" : "btn-ghost"}`} onClick={() => setHemType(k)} style={{ fontSize: 10 }}>{l}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="input-group"><label className="input-label">Side hem each side (in)</label>
                                <input type="number" className="input-field" value={sideHem} onChange={e => setSideHem(Math.max(0, parseFloat(e.target.value) || 1.5))} min={0} step={0.5} /></div>
                        </div>
                        <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 4 }}>Bottom hem total: <strong>{calc.hemAllow}&quot;</strong> ({hemType} fold × {hemDepth}&quot;)</div>
                    </div>

                    {/* ⑥ PATTERN REPEAT */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>⑥ Pattern Repeat</h2>
                        <div style={{ display: "flex", gap: 3, marginBottom: 6 }}>
                            <button className={`btn btn-sm ${!hasRepeat ? "btn-primary" : "btn-ghost"}`} onClick={() => setHasRepeat(false)} style={{ fontSize: 10 }}>No repeat</button>
                            <button className={`btn btn-sm ${hasRepeat ? "btn-primary" : "btn-ghost"}`} onClick={() => setHasRepeat(true)} style={{ fontSize: 10 }}>Has pattern repeat</button>
                        </div>
                        {hasRepeat && (
                            <div className="input-group" style={{ maxWidth: 200 }}>
                                <label className="input-label">Vertical repeat (in)</label>
                                <input type="number" className="input-field" value={vRepeat} onChange={e => setVRepeat(Math.max(0, parseFloat(e.target.value) || 0))} min={0} step={0.5} />
                            </div>
                        )}
                        {hasRepeat && vRepeat > 0 && calc.repeatExtra > 0 && (
                            <div style={{ fontSize: 11, color: "hsl(40,70%,35%)", marginTop: 4 }}>⚠ Pattern repeat adds <strong>{calc.repeatExtra.toFixed(1)}&quot;</strong> per cut length</div>
                        )}
                    </div>

                    {/* ⑦ LINING */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>⑦ Lining</h2>
                        <div style={{ display: "flex", gap: 3, marginBottom: 6 }}>
                            <button className={`btn btn-sm ${!lined ? "btn-primary" : "btn-ghost"}`} onClick={() => setLined(false)} style={{ fontSize: 10 }}>Unlined</button>
                            <button className={`btn btn-sm ${lined ? "btn-primary" : "btn-ghost"}`} onClick={() => setLined(true)} style={{ fontSize: 10 }}>Lined</button>
                        </div>
                        {lined && (
                            <div className="input-group" style={{ maxWidth: 200 }}>
                                <label className="input-label">Lining fabric width (in)</label>
                                <div style={{ display: "flex", gap: 3 }}>
                                    {[54, 60].map(w => (
                                        <button key={w} className={`btn btn-sm ${liningW === w ? "btn-primary" : "btn-ghost"}`} onClick={() => setLiningW(w)} style={{ fontSize: 10 }}>{w}&quot;</button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ═══ RESULT ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(200,50%,40%)" }}>
                        <h2 className={styles.calcTitle}>Your Curtain Yardage</h2>

                        <div style={{ display: "grid", gridTemplateColumns: lined ? "1fr 1fr 1fr" : "1fr 1fr", gap: 10, marginBottom: 14 }}>
                            <div style={{ padding: 14, background: "hsl(200,15%,95%)", borderRadius: 10, textAlign: "center" }}>
                                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(200,40%,35%)" }}>Main Fabric</div>
                                <div style={{ fontSize: 32, fontWeight: 800, color: "hsl(200,50%,30%)" }}>{toFrac(calc.buyYd)}</div>
                                <div style={{ fontSize: 10 }}>yards</div>
                            </div>
                            <div style={{ padding: 14, background: "hsl(160,15%,95%)", borderRadius: 10, textAlign: "center" }}>
                                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(160,40%,35%)" }}>+10% Buffer</div>
                                <div style={{ fontSize: 32, fontWeight: 800, color: "hsl(160,50%,30%)" }}>{toFrac(calc.bufferYd)}</div>
                                <div style={{ fontSize: 10 }}>yards</div>
                            </div>
                            {lined && (
                                <div style={{ padding: 14, background: "hsl(280,15%,95%)", borderRadius: 10, textAlign: "center" }}>
                                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(280,40%,35%)" }}>Lining</div>
                                    <div style={{ fontSize: 32, fontWeight: 800, color: "hsl(280,50%,30%)" }}>{toFrac(calc.liningBuyYd)}</div>
                                    <div style={{ fontSize: 10 }}>yards</div>
                                </div>
                            )}
                        </div>

                        <div className={styles.resultDetails}>
                            <div className="result-row"><span>Rod width</span><strong>{calc.rodW}&quot;</strong></div>
                            <div className="result-row"><span>Total fabric width ({fullness}× fullness)</span><strong>{calc.totalFabricW}&quot;</strong></div>
                            <div className="result-row"><span>Per panel cut width (+ {sideHem * 2}&quot; side hems)</span><strong>{calc.panelCutW.toFixed(1)}&quot;</strong></div>
                            <div className="result-row"><span>Fabric widths per panel ({fabricW}&quot; bolt)</span><strong>{calc.widthsPerPanel}</strong></div>
                            <div className="result-row"><span>Total fabric widths (× {panels} panels)</span><strong>{calc.totalWidths}</strong></div>
                            <div className="result-row" style={{ borderTop: "1px solid hsl(0,0%,90%)", paddingTop: 4, marginTop: 4 }}><span>Finished length</span><strong>{calc.finLen}&quot;</strong></div>
                            <div className="result-row"><span>+ Header ({header.name})</span><strong>+{calc.topAllow}&quot;</strong></div>
                            <div className="result-row"><span>+ Bottom hem ({hemType} fold)</span><strong>+{calc.hemAllow}&quot;</strong></div>
                            {hasRepeat && calc.repeatExtra > 0 && <div className="result-row"><span>+ Pattern repeat adjust</span><strong>+{calc.repeatExtra.toFixed(1)}&quot;</strong></div>}
                            <div className="result-row"><span><strong>Cut length per panel</strong></span><strong>{calc.cutLen}&quot;</strong></div>
                        </div>

                        {calc.widthsPerPanel > 1 && (
                            <div style={{ fontSize: 10, color: "hsl(40,70%,35%)", marginTop: 6 }}>
                                ⚠ Each panel needs {calc.widthsPerPanel} fabric widths joined. Place seams toward outside edges, not center.
                            </div>
                        )}
                    </div>

                    {/* Toolbar */}
                    <div className="toolbar" style={{ marginBottom: 10 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} /> Copy</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                    </div>

                    {/* ═══ BREAKDOWN ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowBreakdown(!showBreakdown)}>
                            📐 Calculation Breakdown
                            <ChevronDown size={14} style={{ transform: showBreakdown ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showBreakdown && (
                            <div style={{ marginTop: 10, fontSize: 12, lineHeight: 2, fontFamily: "monospace" }}>
                                <div style={{ padding: 10, background: "hsl(200,10%,97%)", borderRadius: 6 }}>
                                    <strong>Width Math:</strong><br />
                                    Window: {winW}&quot; + extensions: {rodExt * 2}&quot; = rod: {calc.rodW}&quot;<br />
                                    × {fullness} fullness = {calc.totalFabricW}&quot; total fabric W<br />
                                    ÷ {panels} panels = {calc.panelFabricW.toFixed(1)}&quot; per panel<br />
                                    + {sideHem * 2}&quot; side hems = {calc.panelCutW.toFixed(1)}&quot; cut W<br />
                                    ÷ {fabricW}&quot; bolt = {calc.widthsPerPanel} width(s) per panel<br />
                                    × {panels} panels = {calc.totalWidths} total widths
                                </div>
                                <div style={{ padding: 10, background: "hsl(160,10%,97%)", borderRadius: 6, marginTop: 6 }}>
                                    <strong>Length Math:</strong><br />
                                    Finished length: {calc.finLen}&quot;<br />
                                    + header: {calc.topAllow}&quot; ({header.name})<br />
                                    + hem: {calc.hemAllow}&quot; ({hemType} fold × {hemDepth}&quot;)<br />
                                    {hasRepeat && calc.repeatExtra > 0 ? `+ pattern repeat: ${calc.repeatExtra.toFixed(1)}"\n` : ""}
                                    = cut length: {calc.cutLen}&quot;
                                </div>
                                <div style={{ padding: 10, background: "hsl(40,10%,97%)", borderRadius: 6, marginTop: 6 }}>
                                    <strong>Yardage:</strong><br />
                                    {calc.totalWidths} widths × {calc.cutLen}&quot; = {(calc.totalWidths * calc.cutLen).toFixed(0)}&quot;<br />
                                    ÷ 36 = {calc.rawYd.toFixed(2)} yards → buy {toFrac(calc.buyYd)} yards
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ═══ LINING DETAILS ═══ */}
                    {lined && (
                        <div className={`glass-card ${styles.calculatorCard}`}>
                            <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowLining(!showLining)}>
                                🧵 Lining Details
                                <ChevronDown size={14} style={{ transform: showLining ? "rotate(180deg)" : "none", transition: ".2s" }} />
                            </button>
                            {showLining && (
                                <div style={{ marginTop: 10 }}>
                                    <div className={styles.resultDetails}>
                                        <div className="result-row"><span>Lining cut width per panel</span><strong>{calc.liningCutW.toFixed(1)}&quot; (1&quot; narrower)</strong></div>
                                        <div className="result-row"><span>Lining cut length</span><strong>{calc.liningCutLen}&quot; (1&quot; shorter)</strong></div>
                                        <div className="result-row"><span>Lining widths total</span><strong>{calc.liningWidths}</strong></div>
                                        <div className="result-row"><span>Lining yardage</span><strong>{toFrac(calc.liningBuyYd)} yd</strong></div>
                                    </div>
                                    <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 4 }}>Lining is cut ~1&quot; narrower and shorter than main fabric for a clean finish.</div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ═══ REFERENCE TABLE ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowRef(!showRef)}>
                            📊 Fullness Reference Table
                            <ChevronDown size={14} style={{ transform: showRef ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showRef && (
                            <div style={{ marginTop: 10, overflowX: "auto" }}>
                                <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
                                    <thead><tr><th style={tH}>Fullness</th><th style={tH}>Total W</th><th style={tH}>Per Panel</th><th style={tH}>Widths ({fabricW}&quot;)</th><th style={tH}>~Yardage</th></tr></thead>
                                    <tbody>
                                        {fullnessOpts.map(f => {
                                            const tw = calc.rodW * f.v;
                                            const ppw = tw / panels + sideHem * 2;
                                            const wpp = Math.ceil(ppw / fabricW);
                                            const totW = wpp * panels;
                                            const yd = Math.ceil((totW * calc.cutLen / 36) * 4) / 4;
                                            return (
                                                <tr key={f.v} style={{ background: fullness === f.v ? "hsl(200,15%,93%)" : undefined }}>
                                                    <td style={{ ...tD, fontWeight: 600 }}>{f.label}</td>
                                                    <td style={tD}>{tw}&quot;</td>
                                                    <td style={tD}>{ppw.toFixed(1)}&quot;</td>
                                                    <td style={tD}>{totW}</td>
                                                    <td style={tD}>{toFrac(yd)} yd</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 4 }}>Compare yardage at different fullness levels for your current window size.</div>
                            </div>
                        )}
                    </div>

                    {/* ═══ EDUCATIONAL ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowEdu(!showEdu)}>
                            📚 Understanding Curtain Yardage
                            <ChevronDown size={14} style={{ transform: showEdu ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showEdu && (
                            <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.9, color: "var(--color-text-secondary)" }}>
                                <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>Finished vs Cut Length</h4>
                                <p style={{ fontSize: 12 }}>Finished length is what you see. Cut length adds header allowance (2&quot;–5&quot; depending on style) and bottom hem (6&quot;–8&quot; for double-fold). A 84&quot; finished curtain with rod pocket + 4&quot; double hem needs 96&quot; cut length — 12&quot; more than the visible curtain.</p>

                                <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 10 }}>Why Fullness Matters</h4>
                                <p style={{ fontSize: 12 }}>A flat curtain (1×) looks cheap and doesn&apos;t block light well. Standard fullness (2×) creates proper gathers, blocks light, and looks professional. Going from 1.5× to 2.5× can double your fabric cost — but the difference in appearance is dramatic.</p>

                                <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 10 }}>Pattern Repeat Warning</h4>
                                <p style={{ fontSize: 12 }}>If your fabric has a pattern, every panel cut must start at the same point in the pattern so panels match. This means rounding up each cut length to the nearest full repeat — potentially adding 10&quot;+ of waste per panel. Always buy extra for patterned fabric.</p>
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
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Shopping List</h4>
                        <div style={{ fontSize: 12, lineHeight: 2.2, color: "var(--color-text-secondary)" }}>
                            <div>🪟 {winW}&quot;×{winH}&quot; window</div>
                            <div>📏 {panels} panels, {fullness}× full</div>
                            <div>✂️ {header.name}</div>
                            <div style={{ borderTop: "1px solid hsl(0,0%,90%)", paddingTop: 4, marginTop: 4 }}>
                                <div style={{ fontSize: 14, fontWeight: 800, color: "hsl(200,50%,35%)" }}>
                                    🧵 <strong>{toFrac(calc.buyYd)} yd</strong> fabric ({fabricW}&quot;)
                                </div>
                                {lined && <div style={{ fontSize: 14, fontWeight: 800, color: "hsl(280,50%,35%)" }}>
                                    🧵 <strong>{toFrac(calc.liningBuyYd)} yd</strong> lining ({liningW}&quot;)
                                </div>}
                            </div>
                        </div>
                    </div>
                    <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Key Numbers</h4>
                        <div style={{ fontSize: 11, padding: 8, background: "hsl(0,0%,96%)", borderRadius: 6, fontFamily: "monospace", lineHeight: 2 }}>
                            Cut length: {calc.cutLen}&quot;<br />
                            Fab widths: {calc.totalWidths}<br />
                            Rod width: {calc.rodW}&quot;
                        </div>
                    </div>
                    <div className="glass-card related-tools">
                        <h4>Related Tools</h4>
                        <a href="/curtains/fullness-calculator" className="related-tool-link">Fullness Calculator</a>
                        <a href="/curtains/length-calculator" className="related-tool-link">Length Calculator</a>
                        <a href="/curtains/header-calculator" className="related-tool-link">Header Calculator</a>
                        <a href="/curtains/lining-calculator" className="related-tool-link">Lining Calculator</a>
                        <a href="/curtains/rod-pocket" className="related-tool-link">Rod Pocket Size</a>
                        <a href="/curtains/measurement-guide" className="related-tool-link">Measurement Guide</a>
                        <a href="/curtains" className="related-tool-link">All Curtain Tools</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}