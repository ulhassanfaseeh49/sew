"use client";
import { useState, useMemo, useCallback } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Palette, Plus, Minus, ChevronDown, Shuffle } from "lucide-react";

/* ─── helpers ───────────────────────────────────── */
function toFrac(v: number): string {
    const w = Math.floor(v); const f = v - w;
    const fracs: [number, string][] = [[0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
    for (const [d, sym] of fracs) { if (Math.abs(f - d) < 0.02) return w > 0 ? `${w}${sym}` : sym; }
    if (f > 0.01) return v.toFixed(2);
    return String(w);
}
function roundUp(val: number, incr: number) { return Math.ceil(val / incr) * incr; }

/* ─── types ──────────────────────────────────────── */
interface FabricEntry {
    name: string;
    role: string;
    color: string;
    value: "light" | "medium-light" | "medium" | "medium-dark" | "dark";
    pct: number;  // percentage 0-100
}

const ROLES = ["Background", "Main Feature", "Secondary", "Accent", "Sashing", "Border", "Custom"];
const VALUES: FabricEntry["value"][] = ["light", "medium-light", "medium", "medium-dark", "dark"];
const VALUE_LABELS: Record<string, string> = { light: "Light", "medium-light": "Med-Light", medium: "Medium", "medium-dark": "Med-Dark", dark: "Dark" };

const DEFAULT_COLORS = ["#1e3a5f", "#c0392b", "#f5f0e1", "#2c6e49", "#7d3c98", "#d35400", "#2980b9", "#8e6f47", "#e74c9c", "#34495e"];
const DEFAULT_NAMES = ["Navy Background", "Red Feature", "Cream Accent", "Forest Green", "Purple", "Orange", "Sky Blue", "Brown", "Pink", "Slate"];

const PRESETS: Record<string, { w: number; h: number }> = {
    Baby: { w: 36, h: 52 }, Throw: { w: 54, h: 72 }, Twin: { w: 60, h: 80 },
    Queen: { w: 84, h: 92 }, King: { w: 100, h: 108 },
};

const MODELS: { key: string; label: string; desc: string; dist: number[] | null }[] = [
    { key: "60-30-10", label: "60-30-10 Rule", desc: "Classic: 60% dominant, 30% secondary, 10% accent", dist: [60, 30, 10] },
    { key: "70-20-10", label: "70-20-10 Rule", desc: "Dramatic: 70% dominant, 20% secondary, 10% accent", dist: [70, 20, 10] },
    { key: "equal", label: "Equal Distribution", desc: "All fabrics in equal proportion (scrappy look)", dist: null },
    { key: "bg-heavy", label: "Background Heavy", desc: "70% background, feature fabrics share rest", dist: null },
    { key: "custom", label: "Custom", desc: "Set your own proportions freely", dist: null },
];

/* ─── color temperature ──────────────────────────── */
function hexToHsl(hex: string): [number, number, number] {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0; const l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        else if (max === g) h = ((b - r) / d + 2) / 6;
        else h = ((r - g) / d + 4) / 6;
    }
    return [h * 360, s * 100, l * 100];
}
function colorTemp(hex: string): "warm" | "cool" | "neutral" {
    const [h, s] = hexToHsl(hex);
    if (s < 10) return "neutral";
    if ((h >= 0 && h < 70) || h > 330) return "warm";
    if (h >= 70 && h < 170) return "neutral"; // yellow-green zone
    return "cool";
}

/* ─── component ──────────────────────────────────── */
export default function Page() {
    /* Quilt size */
    const [sizePreset, setSizePreset] = useState("Throw");
    const [qw, setQw] = useState("54");
    const [qh, setQh] = useState("72");
    const [fabricW, setFabricW] = useState("44");

    /* Fabrics */
    const [fabrics, setFabrics] = useState<FabricEntry[]>([
        { name: "Navy Background", role: "Background", color: "#1e3a5f", value: "dark", pct: 60 },
        { name: "Red Feature", role: "Main Feature", color: "#c0392b", value: "medium-dark", pct: 30 },
        { name: "Cream Accent", role: "Accent", color: "#f5f0e1", value: "light", pct: 10 },
    ]);

    /* Model */
    const [model, setModel] = useState("60-30-10");

    /* UI */
    const [showEdu, setShowEdu] = useState(false);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [gridSeed, setGridSeed] = useState(1);

    /* Derived */
    const width = parseFloat(qw) || 54;
    const height = parseFloat(qh) || 72;
    const totalArea = width * height; // sq inches
    const usableW = (parseFloat(fabricW) || 44) - 1; // selvage
    const totalPct = fabrics.reduce((s, f) => s + f.pct, 0);
    const balanced = Math.abs(totalPct - 100) < 0.5;

    /* Fabric update helpers */
    const updateFabric = useCallback((idx: number, key: keyof FabricEntry, val: string | number) => {
        setFabrics(prev => prev.map((f, i) => i === idx ? { ...f, [key]: val } : f));
    }, []);

    const addFabric = useCallback(() => {
        if (fabrics.length >= 10) return;
        const n = fabrics.length;
        setFabrics(prev => [...prev, { name: DEFAULT_NAMES[n] || `Fabric ${n + 1}`, role: "Custom", color: DEFAULT_COLORS[n] || "#888888", value: "medium", pct: 0 }]);
    }, [fabrics.length]);

    const removeFabric = useCallback((idx: number) => {
        if (fabrics.length <= 2) return;
        setFabrics(prev => prev.filter((_, i) => i !== idx));
    }, [fabrics.length]);

    /* Apply model */
    const applyModel = useCallback((key: string) => {
        setModel(key);
        const m = MODELS.find(m => m.key === key);
        if (!m) return;
        if (key === "equal") {
            const eq = +(100 / fabrics.length).toFixed(1);
            setFabrics(prev => prev.map((f, i) => ({ ...f, pct: i === 0 ? +(100 - eq * (prev.length - 1)).toFixed(1) : eq })));
        } else if (key === "bg-heavy") {
            const bg = 70;
            const rest = +(30 / Math.max(fabrics.length - 1, 1)).toFixed(1);
            setFabrics(prev => prev.map((f, i) => ({ ...f, pct: i === 0 ? bg : (i === prev.length - 1 ? +(100 - bg - rest * (prev.length - 2)).toFixed(1) : rest) })));
        } else if (m.dist && m.dist.length >= fabrics.length) {
            setFabrics(prev => prev.map((f, i) => ({ ...f, pct: m.dist![i] ?? 0 })));
        } else if (m.dist) {
            // More fabrics than model slots: split last slot
            const dist = [...m.dist!];
            while (dist.length < fabrics.length) {
                const last = dist.pop()!;
                const half = +(last / 2).toFixed(1);
                dist.push(half, +(last - half).toFixed(1));
            }
            setFabrics(prev => prev.map((f, i) => ({ ...f, pct: dist[i] ?? 0 })));
        }
    }, [fabrics.length]);

    /* ═══ ANALYSIS ═══ */
    const analysis = useMemo(() => {
        /* Value distribution */
        const valueGroups: Record<string, number> = { light: 0, "medium-light": 0, medium: 0, "medium-dark": 0, dark: 0 };
        fabrics.forEach(f => { valueGroups[f.value] = (valueGroups[f.value] || 0) + f.pct; });
        const lightPct = valueGroups.light + valueGroups["medium-light"];
        const medPct = valueGroups.medium;
        const darkPct = valueGroups["medium-dark"] + valueGroups.dark;

        let contrastRating = "Excellent contrast";
        if (lightPct < 5 || darkPct < 5) contrastRating = "Very low contrast — quilt may look muddy or washed out";
        else if (lightPct < 15 || darkPct < 15) contrastRating = "Low contrast — consider adding lighter or darker fabrics";
        else if (Math.abs(lightPct - darkPct) < 15 && medPct < 50) contrastRating = "Good contrast";

        /* Color temperature */
        let warmPct = 0, coolPct = 0, neutralPct = 0;
        fabrics.forEach(f => {
            const t = colorTemp(f.color);
            if (t === "warm") warmPct += f.pct;
            else if (t === "cool") coolPct += f.pct;
            else neutralPct += f.pct;
        });

        /* Balance score 0-100 */
        let score = 100;
        // Penalize total not 100
        if (!balanced) score -= Math.min(30, Math.abs(totalPct - 100) * 2);
        // Penalize low contrast
        if (lightPct < 5 || darkPct < 5) score -= 25;
        else if (lightPct < 15 || darkPct < 15) score -= 10;
        // Penalize two nearly-equal large proportions (competition)
        const sorted = [...fabrics].sort((a, b) => b.pct - a.pct);
        if (sorted.length >= 2 && sorted[0].pct > 30 && Math.abs(sorted[0].pct - sorted[1].pct) < 8) score -= 15;
        // Reward following a known model
        const m = MODELS.find(m => m.key === model);
        if (m?.dist) {
            const dist = [...m.dist];
            while (dist.length < fabrics.length) { const l = dist.pop()!; dist.push(l / 2, l / 2); }
            let deviance = 0;
            fabrics.forEach((f, i) => { deviance += Math.abs(f.pct - (dist[i] || 0)); });
            if (deviance < 10) score += 5;
            else if (deviance > 30) score -= 10;
        }
        score = Math.max(0, Math.min(100, score));

        let scoreLabel = "Well balanced, pleasing proportions";
        if (score < 40) scoreLabel = "Significant imbalance — may look unintentional";
        else if (score < 60) scoreLabel = "Some imbalance — consider adjusting";
        else if (score < 80) scoreLabel = "Mostly balanced — minor tweaks could help";

        /* Feedback */
        const feedback: string[] = [];
        if (balanced) {
            if (sorted[0]?.pct >= 55 && sorted[0]?.pct <= 70) feedback.push(`Your ${sorted[0].name} at ${sorted[0].pct}% gives your feature fabrics room to shine.`);
            if (sorted.length >= 2 && sorted[0].pct > 30 && Math.abs(sorted[0].pct - sorted[1].pct) < 8)
                feedback.push(`Your two largest colors (${sorted[0].name} at ${sorted[0].pct}% and ${sorted[1].name} at ${sorted[1].pct}%) are nearly equal — this can create visual competition. Consider shifting to 60% and 30%.`);
            const accents = fabrics.filter(f => f.pct >= 5 && f.pct <= 15);
            if (accents.length > 0) feedback.push(`Your accent color${accents.length > 1 ? "s" : ""} at ${accents.map(a => a.pct + "%").join(", ")} ${accents.length === 1 ? "is" : "are"} in the sweet spot — enough to pop without overwhelming.`);
        }
        if (lightPct === 0) feedback.push("No light fabrics — consider adding a light value for contrast.");
        if (darkPct === 0) feedback.push("No dark fabrics — adding dark fabric increases contrast and makes the design pop.");
        if (feedback.length === 0 && balanced) feedback.push("Your proportions follow a pleasing, balanced distribution.");

        /* Yardage per fabric */
        const yardage = fabrics.map(f => {
            const area = totalArea * (f.pct / 100); // sq inches needed
            // Approximate: strips of usableW width, cut length = we treat as a flat area calc
            const yd = area / (usableW * 36); // convert area to linear yards at usable width
            const buf = yd * 1.1; // 10% waste buffer
            const buy = roundUp(buf + 0.05, 0.25);
            return { ...f, area: +area.toFixed(0), yd: +yd.toFixed(2), buy };
        });

        return {
            lightPct: +lightPct.toFixed(1), medPct: +medPct.toFixed(1), darkPct: +darkPct.toFixed(1),
            contrastRating, warmPct: +warmPct.toFixed(1), coolPct: +coolPct.toFixed(1), neutralPct: +neutralPct.toFixed(1),
            score, scoreLabel, feedback, yardage,
        };
    }, [fabrics, totalArea, usableW, balanced, totalPct, model]);

    /* Grid simulation */
    const gridCells = useMemo(() => {
        const gridW = 12;
        const gridH = 10;
        const cells: string[] = [];
        // Place cells proportional to fabric percentages
        fabrics.forEach(f => {
            const count = Math.round((gridW * gridH) * (f.pct / 100));
            for (let i = 0; i < count && cells.length < gridW * gridH; i++) cells.push(f.color);
        });
        while (cells.length < gridW * gridH) cells.push(fabrics[0]?.color || "#ccc");
        // Shuffle with seed
        const shuffled = [...cells];
        let seed = gridSeed;
        for (let i = shuffled.length - 1; i > 0; i--) {
            seed = (seed * 16807) % 2147483647;
            const j = seed % (i + 1);
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return { cells: shuffled, w: gridW, h: gridH };
    }, [fabrics, gridSeed]);

    const copyText = fabrics.map(f => `${f.name}: ${f.pct}%`).join(", ") + ` → ${width}" × ${height}" quilt`;

    /* Preset handler */
    const handlePreset = (key: string) => {
        setSizePreset(key);
        const p = PRESETS[key];
        if (p) { setQw(String(p.w)); setQh(String(p.h)); }
    };

    const faqItems = [
        { q: "What is the 60-30-10 rule in quilting?", a: "The 60-30-10 rule comes from interior design: use 60% of a dominant color (usually background), 30% of a secondary color (main feature fabric), and 10% of an accent color. This creates a visually balanced quilt with clear hierarchy." },
        { q: "How do I calculate how much of each fabric to buy for a quilt?", a: "First determine your quilt's total area (width × height). Then assign a percentage to each fabric. Multiply the total area by each percentage to get square inches needed, then divide by the usable fabric width (typically 42\") × 36\" to get yards. Add 10% for waste." },
        { q: "How do I balance colors in a quilt?", a: "Consider three factors: proportion (how much of each color), value (light/medium/dark distribution), and placement (where colors go). Start with a proven model like 60-30-10, ensure you have a mix of light and dark values, and use a design wall to check placement." },
        { q: "What is value in quilting?", a: "Value refers to how light or dark a fabric appears, independent of color. A navy blue and a dark brown can have the same value. Good quilts need a range of values — light, medium, and dark — to create contrast and visual interest." },
        { q: "How much background fabric do I need for a quilt?", a: "Most well-balanced quilts use 55-70% background fabric. For a throw quilt (54\" × 72\"), that's about 2,100-2,800 square inches of background. This translates to roughly 1.5-2 yards depending on fabric width and cutting efficiency." },
        { q: "What proportion of accent fabric should a quilt have?", a: "Accent fabrics typically work best at 5-15% of the total quilt. Too little (under 3%) and the accent disappears. Too much (over 20%) and it becomes a secondary color, not an accent. The 10% rule is a reliable guideline." },
        { q: "How do I plan an ombré quilt color progression?", a: "For an ombré quilt, select 5-8 colors that transition from light to dark. Distribute them in graduated steps — either equal proportions for sharp transitions or weighted proportions (more of center colors, less of edge colors) for smooth blending." },
        { q: "How many fabrics should a quilt have?", a: "Most quilts use 3-6 fabrics for a planned look. Scrappy quilts can use 8-20+ fabrics effectively. The key is having clear value contrast regardless of how many fabrics you use. Even one fabric at 60%+ creates a strong foundation." },
        { q: "What makes a quilt look balanced?", a: "A balanced quilt has: (1) a clear dominant fabric (50-70%), (2) good light/dark contrast, (3) accent colors that pop without overwhelming, and (4) consistent value distribution. The \"squint test\" — squinting at your quilt — reveals value balance." },
        { q: "How do I use a fat quarter bundle and know if proportions are right?", a: "A fat quarter (18\" × 22\") gives about 396 square inches. If your bundle has 8 fat quarters, each provides 12.5% of total fabric. This equal distribution works for scrappy quilts. For planned designs, add extra yardage of your dominant and background fabrics." },
    ];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "Color Proportion Tool" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    {/* HEADER */}
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Palette size={14} strokeWidth={1.5} /> Quilt #135</span>
                        <h1>Quilt Color Proportion Tool</h1>
                        <p>Calculate, visualize, and optimize fabric color proportions. Apply the 60-30-10 rule, check value balance, and get exact yardage for each fabric color.</p>
                    </div>

                    {/* ① QUILT SIZE */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>① Quilt Size</h2>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
                            {Object.keys(PRESETS).map(k => (
                                <button key={k} className={`btn btn-sm ${sizePreset === k ? "btn-primary" : "btn-secondary"}`}
                                    onClick={() => handlePreset(k)}>{k}</button>
                            ))}
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Width (inches)</label>
                                <input type="number" className="input-field" value={qw} onChange={e => { setQw(e.target.value); setSizePreset("Custom"); }} min={10} /></div>
                            <div className="input-group"><label className="input-label">Height (inches)</label>
                                <input type="number" className="input-field" value={qh} onChange={e => { setQh(e.target.value); setSizePreset("Custom"); }} min={10} /></div>
                            <div className="input-group"><label className="input-label">Fabric width</label>
                                <select className="input-field" value={fabricW} onChange={e => setFabricW(e.target.value)}>
                                    <option value="42">42&quot;</option><option value="44">44&quot;</option><option value="45">45&quot;</option><option value="60">60&quot;</option>
                                </select></div>
                        </div>
                        <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 4 }}>
                            Total area: {totalArea.toLocaleString()} sq inches
                        </div>
                    </div>

                    {/* ② PROPORTION MODEL */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>② Proportion Model</h2>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {MODELS.map(m => (
                                <button key={m.key}
                                    className={`btn btn-sm ${model === m.key ? "btn-primary" : "btn-secondary"}`}
                                    onClick={() => applyModel(m.key)}
                                    style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1.3, padding: "8px 12px" }}>
                                    <span style={{ fontWeight: 600 }}>{m.label}</span>
                                    <span style={{ fontSize: 10, opacity: 0.8, fontWeight: 400 }}>{m.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ③ FABRIC ENTRIES */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                            <h2 className={styles.calcTitle} style={{ margin: 0 }}>③ Fabrics ({fabrics.length})</h2>
                            <div style={{ display: "flex", gap: 4 }}>
                                <button className="btn btn-sm btn-secondary" onClick={addFabric} disabled={fabrics.length >= 10}><Plus size={13} /> Add</button>
                            </div>
                        </div>

                        {/* Proportion total bar */}
                        <div style={{ marginBottom: 12 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                                <span>Total: <strong style={{ color: balanced ? "hsl(150,60%,35%)" : "hsl(0,70%,50%)" }}>{totalPct.toFixed(1)}%</strong></span>
                                {!balanced && <span style={{ color: "hsl(0,70%,50%)", fontWeight: 600 }}>{totalPct > 100 ? `${(totalPct - 100).toFixed(1)}% over` : `${(100 - totalPct).toFixed(1)}% remaining`}</span>}
                            </div>
                            <div style={{ height: 8, background: "hsl(0,0%,90%)", borderRadius: 4, overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${Math.min(totalPct, 100)}%`, background: balanced ? "hsl(150,60%,45%)" : totalPct > 100 ? "hsl(0,70%,55%)" : "hsl(40,80%,55%)", borderRadius: 4, transition: "width 0.3s" }} />
                            </div>
                        </div>

                        {fabrics.map((f, idx) => (
                            <div key={idx} style={{ display: "grid", gridTemplateColumns: "32px 1fr", gap: 8, padding: "10px 0", borderTop: idx > 0 ? "1px solid hsl(0,0%,92%)" : "none" }}>
                                {/* Color swatch */}
                                <div style={{ width: 32, height: 32, borderRadius: 6, background: f.color, border: "2px solid hsl(0,0%,80%)", cursor: "pointer", position: "relative" }}>
                                    <input type="color" value={f.color} onChange={e => updateFabric(idx, "color", e.target.value)}
                                        style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" }} />
                                </div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                    <input type="text" value={f.name} onChange={e => updateFabric(idx, "name", e.target.value)} className="input-field"
                                        style={{ flex: "1 1 120px", padding: "4px 8px", fontSize: 13 }} placeholder="Fabric name" />
                                    <select value={f.role} onChange={e => updateFabric(idx, "role", e.target.value)} className="input-field"
                                        style={{ flex: "0 0 110px", padding: "4px 6px", fontSize: 12 }}>
                                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                    <select value={f.value} onChange={e => updateFabric(idx, "value", e.target.value as FabricEntry["value"])} className="input-field"
                                        style={{ flex: "0 0 100px", padding: "4px 6px", fontSize: 12 }}>
                                        {VALUES.map(v => <option key={v} value={v}>{VALUE_LABELS[v]}</option>)}
                                    </select>
                                    <div style={{ flex: "0 0 100px", display: "flex", alignItems: "center", gap: 4 }}>
                                        <input type="number" value={f.pct} onChange={e => updateFabric(idx, "pct", parseFloat(e.target.value) || 0)}
                                            className="input-field" style={{ width: 60, padding: "4px 6px", fontSize: 13, textAlign: "right" }} min={0} max={100} step={1} />
                                        <span style={{ fontSize: 12 }}>%</span>
                                    </div>
                                    {fabrics.length > 2 && (
                                        <button className="btn btn-sm btn-secondary" onClick={() => removeFabric(idx)} style={{ padding: "4px 6px" }}>
                                            <Minus size={12} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ═══ LIVING PROPORTION BAR ═══ */}
                    {totalPct > 0 && (
                        <div className={`glass-card ${styles.calculatorCard}`}>
                            <h2 className={styles.calcTitle}>Proportion Bar</h2>
                            <div style={{ display: "flex", height: 40, borderRadius: 8, overflow: "hidden", border: "1px solid hsl(0,0%,85%)" }}>
                                {fabrics.filter(f => f.pct > 0).map((f, i) => (
                                    <div key={i} style={{ width: `${(f.pct / totalPct) * 100}%`, background: f.color, display: "flex", alignItems: "center", justifyContent: "center", minWidth: f.pct > 4 ? 0 : 2, transition: "width 0.3s" }}>
                                        {f.pct >= 10 && <span style={{ fontSize: 10, fontWeight: 600, color: hexToHsl(f.color)[2] > 60 ? "#333" : "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>{f.pct}%</span>}
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8, fontSize: 11 }}>
                                {fabrics.filter(f => f.pct > 0).map((f, i) => (
                                    <span key={i} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                                        <span style={{ width: 10, height: 10, borderRadius: 2, background: f.color, display: "inline-block" }} />
                                        {f.name} ({f.pct}%)
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ═══ QUILT GRID SIMULATION ═══ */}
                    {balanced && (
                        <div className={`glass-card ${styles.calculatorCard}`}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h2 className={styles.calcTitle} style={{ margin: 0 }}>Quilt Preview Simulation</h2>
                                <button className="btn btn-sm btn-secondary" onClick={() => setGridSeed(s => s + 1)}>
                                    <Shuffle size={13} /> Shuffle
                                </button>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: `repeat(${gridCells.w}, 1fr)`, gap: 1, marginTop: 10, borderRadius: 6, overflow: "hidden", border: "1px solid hsl(0,0%,85%)" }}>
                                {gridCells.cells.map((c, i) => (
                                    <div key={`${i}-${gridSeed}`} style={{ aspectRatio: "1", background: c }} />
                                ))}
                            </div>
                            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 6, textAlign: "center" }}>
                                Simulated 12×10 block grid showing approximate color distribution. Click Shuffle for new arrangement.
                            </div>
                        </div>
                    )}

                    {/* ═══ BALANCE SCORE & ANALYSIS ═══ */}
                    {balanced && (
                        <div className={`calculator-results ${styles.results}`}>
                            <div className="result-card">
                                <div className="result-value">Balance Score: {analysis.score}/100</div>
                                <div className="result-label">{analysis.scoreLabel}</div>
                            </div>

                            {/* Score bar */}
                            <div style={{ marginTop: 10, marginBottom: 12 }}>
                                <div style={{ height: 10, background: "hsl(0,0%,90%)", borderRadius: 5, overflow: "hidden" }}>
                                    <div style={{
                                        height: "100%", width: `${analysis.score}%`, borderRadius: 5, transition: "width 0.3s",
                                        background: analysis.score >= 80 ? "hsl(150,60%,45%)" : analysis.score >= 60 ? "hsl(40,80%,50%)" : "hsl(0,60%,55%)"
                                    }} />
                                </div>
                            </div>

                            {/* Feedback */}
                            {analysis.feedback.length > 0 && (
                                <div style={{ padding: 12, background: "hsl(200,40%,96%)", borderRadius: "var(--radius-md)", fontSize: 13, lineHeight: 1.7, marginBottom: 12 }}>
                                    <strong>Proportion Feedback:</strong>
                                    <ul style={{ paddingLeft: 18, marginTop: 4 }}>
                                        {analysis.feedback.map((f, i) => <li key={i}>{f}</li>)}
                                    </ul>
                                </div>
                            )}

                            {/* Value distribution */}
                            <div className={styles.resultDetails}>
                                <div className={styles.resultRow}><span>☀️ Light values</span><strong>{analysis.lightPct}%</strong></div>
                                <div className={styles.resultRow}><span>🔲 Medium values</span><strong>{analysis.medPct}%</strong></div>
                                <div className={styles.resultRow}><span>🌑 Dark values</span><strong>{analysis.darkPct}%</strong></div>
                                <div className={styles.resultRow}><span>Contrast rating</span><strong>{analysis.contrastRating}</strong></div>
                            </div>

                            {/* Color temperature */}
                            <div className={styles.resultDetails} style={{ marginTop: 10 }}>
                                <div className={styles.resultRow}><span>🔴 Warm colors</span><strong>{analysis.warmPct}%</strong></div>
                                <div className={styles.resultRow}><span>🔵 Cool colors</span><strong>{analysis.coolPct}%</strong></div>
                                <div className={styles.resultRow}><span>⚪ Neutral colors</span><strong>{analysis.neutralPct}%</strong></div>
                            </div>
                        </div>
                    )}

                    {/* ═══ YARDAGE TABLE ═══ */}
                    {balanced && analysis.yardage.length > 0 && (
                        <div className={`glass-card ${styles.calculatorCard}`}>
                            <h2 className={styles.calcTitle}>Yardage Per Fabric</h2>
                            <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 8 }}>
                                Based on {width}&quot; × {height}&quot; quilt ({totalArea.toLocaleString()} sq in) at {fabricW}&quot; fabric width
                            </div>
                            <div className={styles.tableWrap}>
                                <table className={styles.convTable}>
                                    <thead><tr><th style={{ width: 20 }}></th><th>Fabric</th><th>Role</th><th>%</th><th>Area</th><th>Yardage</th><th>Buy</th></tr></thead>
                                    <tbody>
                                        {analysis.yardage.map((f, i) => (
                                            <tr key={i}>
                                                <td><span style={{ width: 14, height: 14, borderRadius: 3, background: f.color, display: "inline-block" }} /></td>
                                                <td>{f.name}</td>
                                                <td style={{ fontSize: 12 }}>{f.role}</td>
                                                <td>{f.pct}%</td>
                                                <td>{f.area.toLocaleString()} sq&quot;</td>
                                                <td>{f.yd} yd</td>
                                                <td style={{ fontWeight: 600 }}>{toFrac(f.buy)} yd</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr style={{ fontWeight: 600 }}>
                                            <td></td><td colSpan={4}>Total</td>
                                            <td>{analysis.yardage.reduce((s, f) => s + f.yd, 0).toFixed(2)} yd</td>
                                            <td>{toFrac(analysis.yardage.reduce((s, f) => s + f.buy, 0))} yd</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 6 }}>
                                Includes 10% waste buffer. For directional prints, add 15-20% extra. Yardage formula: (Quilt Area × Proportion) ÷ (Usable Width × 36).
                            </div>
                        </div>
                    )}

                    {/* Toolbar */}
                    <div className="toolbar" style={{ marginBottom: 16 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} /> Copy</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                    </div>

                    {/* EDUCATIONAL */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
                            onClick={() => setShowEdu(!showEdu)}>
                            📚 The 60-30-10 Rule — A Guide for Quilters <ChevronDown size={14} style={{ transform: showEdu ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                        </button>
                        {showEdu && (
                            <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
                                <p style={{ marginBottom: 8 }}>The <strong>60-30-10 rule</strong> originated in interior design and works beautifully for quilts:</p>
                                <ul style={{ paddingLeft: 20, marginBottom: 10 }}>
                                    <li><strong>60% — Dominant color</strong> (usually background). Creates visual calm and lets other fabrics shine.</li>
                                    <li><strong>30% — Secondary color</strong> (main feature fabric). Carries the design and creates visual interest.</li>
                                    <li><strong>10% — Accent color</strong> (pop of contrast). Draws the eye and adds energy.</li>
                                </ul>
                                <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 12 }}>Value Matters More Than Color</h4>
                                <p style={{ marginBottom: 8 }}>Value (how light or dark a fabric is) often matters more than color. Common mistakes:</p>
                                <ul style={{ paddingLeft: 20 }}>
                                    <li><strong>All medium values</strong> → quilt looks muddy and flat</li>
                                    <li><strong>No dark values</strong> → quilt looks washed out</li>
                                    <li><strong>No light values</strong> → quilt feels heavy and dense</li>
                                    <li>The <strong>squint test</strong>: squint at your fabric — if you can&apos;t tell them apart, you need more value contrast</li>
                                </ul>
                                <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 12 }}>When to Break the Rule</h4>
                                <p>Scrappy quilts thrive on equal distribution. Modern quilts often use 70-20-10 for dramatic effect. Ombré quilts use graduated proportions. The rule is a starting point, not a requirement.</p>
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
                            <div>Area = W × H</div>
                            <div>Fabric = Area × %</div>
                            <div>Yd = FabricArea ÷ (UsW × 36)</div>
                        </div>
                    </div>
                    <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>60-30-10 Quick</h4>
                        <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.8 }}>
                            <div>60% → Background</div>
                            <div>30% → Feature fabric</div>
                            <div>10% → Accent color</div>
                            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 4 }}>Classic interior design rule</div>
                        </div>
                    </div>
                    <div className="glass-card related-tools">
                        <h4>Related Tools</h4>
                        <a href="/quilt/blocks-needed" className="related-tool-link">Blocks Needed Calculator</a>
                        <a href="/quilt/backing-calculator" className="related-tool-link">Backing Calculator</a>
                        <a href="/quilt/binding-calculator" className="related-tool-link">Binding Calculator</a>
                        <a href="/quilt/border-calculator" className="related-tool-link">Border Calculator</a>
                        <a href="/quilt" className="related-tool-link">All Quilt Tools</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}