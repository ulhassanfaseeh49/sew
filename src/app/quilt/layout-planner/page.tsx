"use client";
import { useState, useMemo, useCallback } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, ChevronDown, Grid3X3, RotateCw, Shuffle, Paintbrush, Eraser, Eye, Copy, Palette } from "lucide-react";

/* ─── TYPES ─── */
interface CellData { color: string; rotation: number; blockType: number; }
interface LayoutTab { id: number; name: string; cells: CellData[][]; }

/* ─── CONSTANTS ─── */
const GRID_PRESETS = [
    { label: "3×3", r: 3, c: 3 }, { label: "4×4", r: 4, c: 4 }, { label: "4×5", r: 5, c: 4 },
    { label: "4×6", r: 6, c: 4 }, { label: "5×6", r: 6, c: 5 }, { label: "5×7", r: 7, c: 5 },
    { label: "6×6", r: 6, c: 6 }, { label: "6×7", r: 7, c: 6 }, { label: "6×8", r: 8, c: 6 },
    { label: "7×8", r: 8, c: 7 }, { label: "7×9", r: 9, c: 7 }, { label: "8×10", r: 10, c: 8 },
];
const BLOCK_SIZES = [3, 4, 6, 8, 9, 10, 12, 15, 18];
const SASHING_WIDTHS = [0, 1, 1.5, 2, 2.5, 3];

const COLOR_PALETTES: { name: string; colors: string[] }[] = [
    { name: "Classic Americana", colors: ["#1a3a5c", "#b22234", "#f5f0e0", "#8b6914", "#2e4a2e"] },
    { name: "Neutrals", colors: ["#f5f0e0", "#c4b89e", "#8a8178", "#6b5b4f", "#3d3530"] },
    { name: "Pastels", colors: ["#f4c2c2", "#c5a3d9", "#a8d8b9", "#fde4b0", "#a8d4e6"] },
    { name: "Jewel Tones", colors: ["#1a3a7a", "#1a6e4a", "#8b1a1a", "#d4a843", "#5c1a6e"] },
    { name: "Earth Tones", colors: ["#8b4513", "#556b2f", "#6b4423", "#f5f0e0", "#a0522d"] },
    { name: "Black & White", colors: ["#1a1a1a", "#4a4a4a", "#808080", "#c0c0c0", "#f0f0f0"] },
    { name: "Rainbow", colors: ["#d32f2f", "#f57c00", "#fbc02d", "#388e3c", "#1976d2", "#7b1fa2"] },
    { name: "Ocean Blues", colors: ["#0d47a1", "#1565c0", "#1e88e5", "#42a5f5", "#e3f2fd"] },
    { name: "Forest Greens", colors: ["#1b5e20", "#2e7d32", "#43a047", "#66bb6a", "#e8f5e9"] },
];

const TEMPLATES: { name: string; desc: string; gen: (r: number, c: number, pal: string[]) => CellData[][] }[] = [
    { name: "Blank", desc: "Empty grid", gen: (r, c) => makeGrid(r, c) },
    { name: "Checkerboard", desc: "Alternating 2 colors", gen: (r, c, p) => makeGrid(r, c, (ri, ci) => ({ color: (ri + ci) % 2 === 0 ? p[0] : p[1], rotation: 0, blockType: 0 })) },
    { name: "Diagonal Stripes", desc: "Color bands on diagonal", gen: (r, c, p) => makeGrid(r, c, (ri, ci) => ({ color: p[(ri + ci) % p.length], rotation: 0, blockType: 0 })) },
    { name: "Irish Chain", desc: "Classic chain pattern", gen: (r, c, p) => makeGrid(r, c, (ri, ci) => ({ color: (ri % 2 === 0 && ci % 2 === 0) || (ri % 2 === 1 && ci % 2 === 1) ? p[0] : p[1], rotation: 0, blockType: 0 })) },
    { name: "Rail Fence", desc: "Rotating rows", gen: (r, c, p) => makeGrid(r, c, (ri, ci) => ({ color: p[ci % p.length], rotation: ri % 2 === 0 ? 0 : 90, blockType: 0 })) },
    { name: "Log Cabin Light/Dark", desc: "Half light, half dark", gen: (r, c, p) => makeGrid(r, c, (ri, ci) => ({ color: ci < Math.ceil(c / 2) ? p[0] : p[p.length - 1], rotation: 0, blockType: 0 })) },
    { name: "Barn Raising", desc: "Concentric diamonds", gen: (r, c, p) => makeGrid(r, c, (ri, ci) => { const d = Math.min(ri, ci, r - 1 - ri, c - 1 - ci); return { color: p[d % p.length], rotation: 0, blockType: 0 }; }) },
    { name: "Gradient", desc: "Color fade across grid", gen: (r, c, p) => makeGrid(r, c, (ri) => ({ color: p[Math.min(Math.floor(ri / r * p.length), p.length - 1)], rotation: 0, blockType: 0 })) },
    { name: "Pinwheel", desc: "Rotated blocks", gen: (r, c, p) => makeGrid(r, c, (ri, ci) => { const q = (ri % 2) * 2 + (ci % 2); return { color: p[q % p.length], rotation: q * 90, blockType: 0 }; }) },
    { name: "Row Quilt", desc: "Each row one color", gen: (r, c, p) => makeGrid(r, c, (ri) => ({ color: p[ri % p.length], rotation: 0, blockType: 0 })) },
    { name: "Medallion", desc: "Center focus", gen: (r, c, p) => makeGrid(r, c, (ri, ci) => { const cr = Math.floor(r / 2); const cc = Math.floor(c / 2); const dist = Math.max(Math.abs(ri - cr), Math.abs(ci - cc)); return { color: p[Math.min(dist, p.length - 1)], rotation: 0, blockType: 0 }; }) },
    { name: "Star", desc: "Star layout", gen: (r, c, p) => makeGrid(r, c, (ri, ci) => { const cr = (r - 1) / 2; const cc = (c - 1) / 2; const dist = Math.sqrt((ri - cr) ** 2 + (ci - cc) ** 2); const maxD = Math.sqrt(cr ** 2 + cc ** 2); return { color: dist < maxD * 0.35 ? p[0] : dist < maxD * 0.65 ? p[1 % p.length] : p[2 % p.length], rotation: 0, blockType: 0 }; }) },
];

function makeGrid(r: number, c: number, gen?: (ri: number, ci: number) => CellData): CellData[][] {
    return Array.from({ length: r }, (_, ri) => Array.from({ length: c }, (_, ci) => gen ? gen(ri, ci) : { color: "", rotation: 0, blockType: 0 }));
}

function emptyTab(id: number, rows: number, cols: number): LayoutTab {
    return { id, name: `Layout ${id}`, cells: makeGrid(rows, cols) };
}

/* ─── COMPONENT ─── */
export default function Page() {
    // Grid setup
    const [rows, setRows] = useState(6);
    const [cols, setCols] = useState(7);
    const [blockSize, setBlockSize] = useState(9);
    const [blockW, setBlockW] = useState(9);
    const [blockH, setBlockH] = useState(9);
    const [nonSquare, setNonSquare] = useState(false);
    const [sashingW, setSashingW] = useState(0);
    const [sashingColor, setSashingColor] = useState("#c4b89e");
    const [cornerstones, setCornerstones] = useState(false);
    const [cornerstoneColor, setCornerstoneColor] = useState("#8b6914");
    const [borderCount, setBorderCount] = useState(0);
    const [borderWidths, setBorderWidths] = useState([2, 1.5, 0, 0, 0]);
    const [borderColors, setBorderColors] = useState(["#1a3a5c", "#f5f0e0", "#8b1a1a", "#d4a843", "#2e4a2e"]);

    // Color palette
    const [palette, setPalette] = useState(COLOR_PALETTES[0].colors);
    const [paletteName, setPaletteName] = useState(COLOR_PALETTES[0].name);
    const [activeColor, setActiveColor] = useState(COLOR_PALETTES[0].colors[0]);
    const [customColor, setCustomColor] = useState("#e88e5a");

    // Tools
    type ToolMode = "paint" | "rotate" | "erase" | "select";
    const [tool, setTool] = useState<ToolMode>("paint");
    const [showGrid, setShowGrid] = useState(true);
    const [showLabels, setShowLabels] = useState(false);
    const [showValueMap, setShowValueMap] = useState(false);

    // Layout tabs
    const [tabs, setTabs] = useState<LayoutTab[]>([emptyTab(1, 6, 7)]);
    const [activeTab, setActiveTab] = useState(0);

    // UI toggles
    const [showEdu, setShowEdu] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);
    const [showComparison, setShowComparison] = useState(false);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const bw = nonSquare ? blockW : blockSize;
    const bh = nonSquare ? blockH : blockSize;
    const currentTab = tabs[activeTab] || tabs[0];
    const cells = currentTab.cells;

    /* Resize grid */
    const resizeGrid = useCallback((newR: number, newC: number) => {
        setRows(newR); setCols(newC);
        setTabs(prev => prev.map(t => {
            const newCells = makeGrid(newR, newC, (ri, ci) =>
                (ri < t.cells.length && ci < (t.cells[0]?.length || 0)) ? t.cells[ri][ci] : { color: "", rotation: 0, blockType: 0 }
            );
            return { ...t, cells: newCells };
        }));
    }, []);

    /* Cell operations */
    const updateCell = useCallback((ri: number, ci: number) => {
        setTabs(prev => prev.map((t, ti) => {
            if (ti !== activeTab) return t;
            const newCells = t.cells.map((row, r) => row.map((cell, c) => {
                if (r !== ri || c !== ci) return cell;
                if (tool === "paint") return { ...cell, color: activeColor };
                if (tool === "rotate") return { ...cell, rotation: (cell.rotation + 90) % 360 };
                if (tool === "erase") return { ...cell, color: "", rotation: 0 };
                return cell;
            }));
            return { ...t, cells: newCells };
        }));
    }, [activeTab, tool, activeColor]);

    /* Bulk operations */
    const fillAll = useCallback((color: string) => {
        setTabs(prev => prev.map((t, ti) => ti !== activeTab ? t : { ...t, cells: t.cells.map(row => row.map(c => ({ ...c, color }))) }));
    }, [activeTab]);

    const fillCheckerboard = useCallback((c1: string, c2: string) => {
        setTabs(prev => prev.map((t, ti) => ti !== activeTab ? t : { ...t, cells: t.cells.map((row, ri) => row.map((cell, ci) => ({ ...cell, color: (ri + ci) % 2 === 0 ? c1 : c2 }))) }));
    }, [activeTab]);

    const fillRandom = useCallback((balanced: boolean) => {
        const p = palette.filter(c => c);
        if (p.length === 0) return;
        setTabs(prev => prev.map((t, ti) => {
            if (ti !== activeTab) return t;
            if (balanced) {
                const total = rows * cols;
                const perColor = Math.floor(total / p.length);
                const pool: string[] = [];
                p.forEach(c => { for (let i = 0; i < perColor; i++) pool.push(c); });
                while (pool.length < total) pool.push(p[pool.length % p.length]);
                for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[pool[i], pool[j]] = [pool[j], pool[i]]; }
                let idx = 0;
                return { ...t, cells: t.cells.map(row => row.map(cell => ({ ...cell, color: pool[idx++] }))) };
            }
            return { ...t, cells: t.cells.map(row => row.map(cell => ({ ...cell, color: p[Math.floor(Math.random() * p.length)] }))) };
        }));
    }, [activeTab, palette, rows, cols]);

    const shuffleLayout = useCallback(() => {
        setTabs(prev => prev.map((t, ti) => {
            if (ti !== activeTab) return t;
            const flat = t.cells.flat();
            for (let i = flat.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[flat[i], flat[j]] = [flat[j], flat[i]]; }
            let idx = 0;
            return { ...t, cells: t.cells.map(row => row.map(() => flat[idx++])) };
        }));
    }, [activeTab]);

    const mirrorH = useCallback(() => {
        setTabs(prev => prev.map((t, ti) => ti !== activeTab ? t : { ...t, cells: t.cells.map(row => [...row].reverse()) }));
    }, [activeTab]);

    const mirrorV = useCallback(() => {
        setTabs(prev => prev.map((t, ti) => ti !== activeTab ? t : { ...t, cells: [...t.cells].reverse() }));
    }, [activeTab]);

    const clearAll = useCallback(() => {
        setTabs(prev => prev.map((t, ti) => ti !== activeTab ? t : { ...t, cells: makeGrid(rows, cols) }));
    }, [activeTab, rows, cols]);

    const rotateAll = useCallback(() => {
        setTabs(prev => prev.map((t, ti) => ti !== activeTab ? t : { ...t, cells: t.cells.map(r => r.map(c => ({ ...c, rotation: (c.rotation + 90) % 360 }))) }));
    }, [activeTab]);

    const applyTemplate = useCallback((tpl: typeof TEMPLATES[0]) => {
        const newCells = tpl.gen(rows, cols, palette);
        setTabs(prev => prev.map((t, ti) => ti !== activeTab ? t : { ...t, cells: newCells }));
    }, [activeTab, rows, cols, palette]);

    /* Layout tabs */
    const addTab = useCallback(() => {
        if (tabs.length >= 6) return;
        const id = tabs.length + 1;
        setTabs(prev => [...prev, emptyTab(id, rows, cols)]);
        setActiveTab(tabs.length);
    }, [tabs, rows, cols]);

    const duplicateTab = useCallback(() => {
        if (tabs.length >= 6) return;
        const src = tabs[activeTab];
        setTabs(prev => [...prev, { ...src, id: prev.length + 1, name: `${src.name} (copy)`, cells: JSON.parse(JSON.stringify(src.cells)) }]);
        setActiveTab(tabs.length);
    }, [tabs, activeTab]);

    const renameTab = useCallback((name: string) => {
        setTabs(prev => prev.map((t, i) => i === activeTab ? { ...t, name } : t));
    }, [activeTab]);

    const deleteTab = useCallback((idx: number) => {
        if (tabs.length <= 1) return;
        setTabs(prev => prev.filter((_, i) => i !== idx));
        if (activeTab >= tabs.length - 1) setActiveTab(Math.max(0, tabs.length - 2));
    }, [tabs, activeTab]);

    /* Analysis */
    const analysis = useMemo(() => {
        const total = rows * cols;
        const colorCounts: Record<string, number> = {};
        let assigned = 0;
        for (const row of cells) for (const cell of row) {
            if (cell.color) { colorCounts[cell.color] = (colorCounts[cell.color] || 0) + 1; assigned++; }
        }
        const finW = cols * bw + (sashingW > 0 ? (cols - 1) * sashingW : 0) + borderWidths.slice(0, borderCount).reduce((s, w) => s + w * 2, 0);
        const finH = rows * bh + (sashingW > 0 ? (rows - 1) * sashingW : 0) + borderWidths.slice(0, borderCount).reduce((s, w) => s + w * 2, 0);
        const sashH = sashingW > 0 ? (rows - 1) * cols : 0;
        const sashV = sashingW > 0 ? rows * (cols - 1) : 0;
        const csCount = sashingW > 0 && cornerstones ? (rows - 1) * (cols - 1) : 0;
        const totalArea = finW * finH;
        const blockArea = total * bw * bh;

        // Value analysis
        let light = 0, med = 0, dark = 0;
        Object.entries(colorCounts).forEach(([hex, count]) => {
            const h = hex.replace("#", "");
            const r = parseInt(h.substring(0, 2), 16); const g = parseInt(h.substring(2, 4), 16); const b = parseInt(h.substring(4, 6), 16);
            const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            if (lum > 0.65) light += count; else if (lum > 0.35) med += count; else dark += count;
        });

        return { total, assigned, unassigned: total - assigned, colorCounts, finW, finH, sashH, sashV, csCount, totalArea, blockArea, light, med, dark };
    }, [cells, rows, cols, bw, bh, sashingW, cornerstones, borderCount, borderWidths]);

    /* Render scale */
    const maxCanvasPx = 640;
    const totalGridW = cols * bw + (sashingW > 0 ? (cols - 1) * sashingW : 0);
    const totalGridH = rows * bh + (sashingW > 0 ? (rows - 1) * sashingW : 0);
    const scale = Math.min(maxCanvasPx / totalGridW, maxCanvasPx / totalGridH, 8);

    const copyText = `Quilt Layout: ${cols}×${rows} blocks at ${bw}"×${bh}". Finished size: ${analysis.finW}"×${analysis.finH}". ${analysis.assigned}/${analysis.total} blocks assigned.${sashingW > 0 ? ` Sashing: ${sashingW}".` : ""}`;

    /* FAQ */
    const faqItems = [
        { q: "How do I plan a quilt layout?", a: "Start by choosing your grid size (columns × rows) and block size. Then set up your color palette and assign colors to blocks by clicking. Use the checkerboard, random, or template fills for quick starting points, then fine-tune individual blocks. Check the value map to ensure good light/dark balance." },
        { q: "How do I balance colors in a quilt?", a: "Aim for roughly 50-60% background/neutral, 30-40% main color, and 10-20% accent. Spread your accent colors evenly rather than clustering them. Use the Color Distribution panel to check percentages, and the Value Map toggle to verify light/medium/dark balance." },
        { q: "What is quilt value and why does it matter?", a: "Value refers to how light or dark a fabric is, regardless of its color. Good contrast between values (light and dark) creates the visual structure of your quilt. A quilt with all medium-value fabrics looks flat and uninteresting. Toggle the Value Map to see your design in grayscale." },
        { q: "How do I create a secondary pattern in my quilt?", a: "Secondary patterns emerge when blocks are placed together. Try rotating blocks — a simple block like a Log Cabin creates entirely different designs based on rotation (Barn Raising, Sunshine & Shadows, etc.). Use the rotation tool to experiment." },
        { q: "What is an on-point quilt layout?", a: "An on-point layout sets blocks at a 45° angle (diamond orientation) instead of straight rows. It creates more visual interest and makes blocks appear larger. Setting triangles fill the edges. Our planner focuses on straight-set layouts; use the Setting Triangle Calculator for on-point planning." },
        { q: "How do I plan a scrappy quilt layout?", a: "Use the Balanced Random fill to distribute colors evenly. Add all your scrap fabrics to the palette, then use random fill. The balanced option ensures each color appears roughly the same number of times. Then manually swap any blocks that create unwanted clusters of the same color." },
        { q: "What is the best color arrangement for a quilt?", a: "There's no single best arrangement — it depends on your design goals. Checkerboard creates classic contrast, barnraising creates concentric diamonds from the same blocks, and gradient arrangements create flowing movement. Try multiple layouts using the tabs feature and compare them side by side." },
        { q: "Can I save multiple layout versions?", a: "Yes! Use the Layout Tabs feature to save up to 6 different arrangements. Name each tab, duplicate layouts to create variations, and use the Side-by-Side Comparison to view multiple layouts simultaneously. This lets you experiment without losing previous arrangements." },
        { q: "How do I use actual fabric photos in this planner?", a: "This version of the planner uses solid colors to represent fabrics. For fabric photo support, use our Virtual Design Wall tool which allows uploading actual fabric swatch photos. You can start here for layout planning and then transfer your design to the Design Wall for photo visualization." },
        { q: "What is sashing and when should I use it?", a: "Sashing is strips of fabric sewn between blocks. It frames each block individually, adds size to the quilt, and creates visual separation. Use sashing when blocks are busy or when you want each block to stand on its own. Cornerstones (small squares at sashing intersections) add another design element." },
    ];

    /* Dragging state for paint mode */
    const [isDragging, setIsDragging] = useState(false);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "Quilt Layout Planner" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    {/* HEADER */}
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Grid3X3 size={14} strokeWidth={1.5} /> Quilt #131</span>
                        <h1>Quilt Layout Planner</h1>
                        <p>Visual grid planner for arranging quilt blocks. Assign colors, rotate blocks, try different arrangements with up to 6 layout variations, check color balance, and plan your quilt before cutting a single piece of fabric.</p>
                    </div>

                    {/* ① GRID SETUP */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>① Grid Setup</h2>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
                            {GRID_PRESETS.map(p => (
                                <button key={p.label} className={`btn btn-sm ${cols === p.c && rows === p.r ? "btn-primary" : "btn-secondary"}`}
                                    onClick={() => resizeGrid(p.r, p.c)} style={{ fontSize: 11 }}>{p.label}</button>
                            ))}
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Columns (across)</label>
                                <input type="number" className="input-field" value={cols} onChange={e => resizeGrid(rows, Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))} min={1} max={30} /></div>
                            <div className="input-group"><label className="input-label">Rows (down)</label>
                                <input type="number" className="input-field" value={rows} onChange={e => resizeGrid(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)), cols)} min={1} max={30} /></div>
                        </div>
                        <div className="calculator-form-row" style={{ marginTop: 8 }}>
                            <div className="input-group"><label className="input-label">Block size (inches)</label>
                                <select className="input-field" value={nonSquare ? "custom" : blockSize} onChange={e => { if (e.target.value === "custom") { setNonSquare(true); } else { setNonSquare(false); setBlockSize(parseInt(e.target.value)); } }}>
                                    {BLOCK_SIZES.map(s => <option key={s} value={s}>{s}&quot; × {s}&quot;</option>)}
                                    <option value="custom">Custom (non-square)</option>
                                </select></div>
                            {nonSquare && <>
                                <div className="input-group"><label className="input-label">Width</label>
                                    <input type="number" className="input-field" value={blockW} onChange={e => setBlockW(parseFloat(e.target.value) || 1)} min={1} step={0.5} /></div>
                                <div className="input-group"><label className="input-label">Height</label>
                                    <input type="number" className="input-field" value={blockH} onChange={e => setBlockH(parseFloat(e.target.value) || 1)} min={1} step={0.5} /></div>
                            </>}
                        </div>
                        {/* Sashing */}
                        <div style={{ marginTop: 10, padding: 10, background: "hsl(0,0%,97%)", borderRadius: 6 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                <label className="input-label" style={{ margin: 0, fontSize: 12, fontWeight: 600 }}>Sashing</label>
                                <select className="input-field" style={{ width: 80, fontSize: 11 }} value={sashingW} onChange={e => setSashingW(parseFloat(e.target.value))}>
                                    {SASHING_WIDTHS.map(w => <option key={w} value={w}>{w === 0 ? "None" : `${w}"`}</option>)}
                                </select>
                                {sashingW > 0 && <>
                                    <input type="color" value={sashingColor} onChange={e => setSashingColor(e.target.value)} style={{ width: 24, height: 24, border: "none", padding: 0, cursor: "pointer" }} />
                                    <label style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                                        <input type="checkbox" checked={cornerstones} onChange={e => setCornerstones(e.target.checked)} /> Cornerstones
                                    </label>
                                    {cornerstones && <input type="color" value={cornerstoneColor} onChange={e => setCornerstoneColor(e.target.value)} style={{ width: 24, height: 24, border: "none", padding: 0, cursor: "pointer" }} />}
                                </>}
                            </div>
                        </div>
                        {/* Borders */}
                        <div style={{ marginTop: 8, padding: 10, background: "hsl(0,0%,97%)", borderRadius: 6 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                <label className="input-label" style={{ margin: 0, fontSize: 12, fontWeight: 600 }}>Borders</label>
                                <select className="input-field" style={{ width: 60, fontSize: 11 }} value={borderCount} onChange={e => setBorderCount(parseInt(e.target.value))}>
                                    {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </div>
                            {borderCount > 0 && <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                                {Array.from({ length: borderCount }, (_, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
                                        <span>B{i + 1}:</span>
                                        <input type="number" className="input-field" style={{ width: 50, fontSize: 11 }} value={borderWidths[i]} min={0.5} step={0.5}
                                            onChange={e => { const nw = [...borderWidths]; nw[i] = parseFloat(e.target.value) || 1; setBorderWidths(nw); }} />
                                        <input type="color" value={borderColors[i]} onChange={e => { const nc = [...borderColors]; nc[i] = e.target.value; setBorderColors(nc); }}
                                            style={{ width: 22, height: 22, border: "none", padding: 0, cursor: "pointer" }} />
                                    </div>
                                ))}
                            </div>}
                        </div>
                    </div>

                    {/* ② COLOR PALETTE */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>② Color Palette</h2>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
                            {COLOR_PALETTES.map(p => (
                                <button key={p.name} className={`btn btn-sm ${paletteName === p.name ? "btn-primary" : "btn-secondary"}`}
                                    onClick={() => { setPalette(p.colors); setPaletteName(p.name); setActiveColor(p.colors[0]); }} style={{ fontSize: 10, padding: "4px 8px" }}>
                                    <span style={{ display: "inline-flex", gap: 1, marginRight: 4 }}>{p.colors.slice(0, 3).map((c, i) => <span key={i} style={{ width: 8, height: 8, borderRadius: 2, background: c, display: "inline-block" }} />)}</span>
                                    {p.name}
                                </button>
                            ))}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}>
                            {palette.map((c, i) => (
                                <button key={i} onClick={() => setActiveColor(c)} title={c}
                                    style={{ width: 32, height: 32, borderRadius: 6, background: c, border: activeColor === c ? "3px solid hsl(150,60%,40%)" : "2px solid rgba(0,0,0,0.15)", cursor: "pointer", boxShadow: activeColor === c ? "0 0 0 2px hsl(150,60%,80%)" : "none", transition: "all 0.15s" }} />
                            ))}
                            <input type="color" value={customColor} onChange={e => setCustomColor(e.target.value)} style={{ width: 32, height: 32, border: "none", padding: 0, cursor: "pointer", borderRadius: 4 }} />
                            <button className="btn btn-sm btn-secondary" onClick={() => { if (!palette.includes(customColor)) { const np = [...palette, customColor]; setPalette(np); setActiveColor(customColor); } }} style={{ fontSize: 10 }}>+ Add</button>
                        </div>
                        {/* Quick fill actions */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                            <button className="btn btn-sm btn-secondary" onClick={() => fillAll(activeColor)} style={{ fontSize: 10 }}>Fill All</button>
                            <button className="btn btn-sm btn-secondary" onClick={() => fillCheckerboard(palette[0] || activeColor, palette[1] || "#f5f0e0")} style={{ fontSize: 10 }}>Checkerboard</button>
                            <button className="btn btn-sm btn-secondary" onClick={() => fillRandom(false)} style={{ fontSize: 10 }}>Random</button>
                            <button className="btn btn-sm btn-secondary" onClick={() => fillRandom(true)} style={{ fontSize: 10 }}>Balanced Random</button>
                        </div>
                    </div>

                    {/* ③ TOOLBAR */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
                        <button className={`btn btn-sm ${tool === "paint" ? "btn-primary" : "btn-secondary"}`} onClick={() => setTool("paint")}><Paintbrush size={12} /> Paint</button>
                        <button className={`btn btn-sm ${tool === "rotate" ? "btn-primary" : "btn-secondary"}`} onClick={() => setTool("rotate")}><RotateCw size={12} /> Rotate</button>
                        <button className={`btn btn-sm ${tool === "erase" ? "btn-primary" : "btn-secondary"}`} onClick={() => setTool("erase")}><Eraser size={12} /> Erase</button>
                        <span style={{ width: 1, background: "hsl(0,0%,85%)", margin: "0 2px" }} />
                        <button className="btn btn-sm btn-secondary" onClick={shuffleLayout}><Shuffle size={12} /> Shuffle</button>
                        <button className="btn btn-sm btn-secondary" onClick={mirrorH}>↔ Mirror H</button>
                        <button className="btn btn-sm btn-secondary" onClick={mirrorV}>↕ Mirror V</button>
                        <button className="btn btn-sm btn-secondary" onClick={rotateAll}><RotateCw size={12} /> Rotate All</button>
                        <button className="btn btn-sm btn-secondary" onClick={clearAll} style={{ color: "hsl(0,60%,50%)" }}><Eraser size={12} /> Clear</button>
                        <span style={{ width: 1, background: "hsl(0,0%,85%)", margin: "0 2px" }} />
                        <button className={`btn btn-sm ${showGrid ? "btn-primary" : "btn-secondary"}`} onClick={() => setShowGrid(!showGrid)}><Grid3X3 size={12} /></button>
                        <button className={`btn btn-sm ${showLabels ? "btn-primary" : "btn-secondary"}`} onClick={() => setShowLabels(!showLabels)} style={{ fontSize: 10 }}>Labels</button>
                        <button className={`btn btn-sm ${showValueMap ? "btn-primary" : "btn-secondary"}`} onClick={() => setShowValueMap(!showValueMap)}><Eye size={12} /> Value Map</button>
                    </div>

                    {/* ④ LAYOUT TABS */}
                    <div style={{ display: "flex", gap: 4, marginBottom: 6, flexWrap: "wrap", alignItems: "center" }}>
                        {tabs.map((t, i) => (
                            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 0 }}>
                                <button className={`btn btn-sm ${activeTab === i ? "btn-primary" : "btn-secondary"}`}
                                    onClick={() => setActiveTab(i)} style={{ fontSize: 11, borderRadius: "6px 0 0 6px" }}>{t.name}</button>
                                {tabs.length > 1 && <button className="btn btn-sm btn-secondary" onClick={() => deleteTab(i)}
                                    style={{ fontSize: 10, borderRadius: "0 6px 6px 0", padding: "4px 6px", color: "hsl(0,50%,55%)", borderLeft: "none" }}>×</button>}
                            </div>
                        ))}
                        {tabs.length < 6 && <button className="btn btn-sm btn-secondary" onClick={addTab} style={{ fontSize: 10 }}>+ New</button>}
                        <button className="btn btn-sm btn-secondary" onClick={duplicateTab} style={{ fontSize: 10 }}><Copy size={10} /> Duplicate</button>
                        <input className="input-field" value={currentTab.name} onChange={e => renameTab(e.target.value)}
                            style={{ width: 120, fontSize: 11, padding: "3px 6px" }} placeholder="Tab name" />
                    </div>

                    {/* ═══ QUILT GRID CANVAS ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`} style={{ padding: 8, overflow: "auto" }}>
                        <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 6 }}>
                            {cols}×{rows} = {analysis.total} blocks • Finished: {analysis.finW}&quot; × {analysis.finH}&quot; • {analysis.assigned}/{analysis.total} assigned
                        </div>
                        {/* Borders wrapper */}
                        <div style={{ display: "inline-block" }}>
                            {/* Outer borders */}
                            {(() => {
                                let content = (
                                    <div style={{ display: "inline-grid", gridTemplateColumns: `repeat(${cols}, ${bw * scale}px)`, gap: sashingW > 0 ? sashingW * scale : (showGrid ? 1 : 0), background: sashingW > 0 ? sashingColor : (showGrid ? "hsl(0,0%,80%)" : "transparent"), padding: 0, filter: showValueMap ? "grayscale(100%) contrast(1.2)" : "none" }}
                                        onMouseLeave={() => setIsDragging(false)} onMouseUp={() => setIsDragging(false)}>
                                        {cells.map((row, ri) => row.map((cell, ci) => {
                                            const isCorner = cornerstones && sashingW > 0;
                                            return (
                                                <div key={`${ri}-${ci}`}
                                                    onMouseDown={e => { e.preventDefault(); setIsDragging(true); updateCell(ri, ci); }}
                                                    onMouseEnter={() => { if (isDragging) updateCell(ri, ci); }}
                                                    style={{
                                                        width: bw * scale, height: bh * scale,
                                                        background: cell.color || (showValueMap ? "#808080" : "hsl(0,0%,95%)"),
                                                        borderRadius: 2, cursor: tool === "paint" ? "crosshair" : tool === "rotate" ? "grab" : "pointer",
                                                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                                        fontSize: Math.max(7, Math.min(11, bw * scale / 5)),
                                                        color: cell.color ? "#fff" : "hsl(0,0%,70%)", textShadow: cell.color ? "0 1px 2px rgba(0,0,0,0.5)" : "none",
                                                        transition: "background 0.1s", position: "relative",
                                                        border: !cell.color ? "1px dashed hsl(0,0%,80%)" : "none",
                                                    }}>
                                                    {cell.rotation > 0 && bw * scale > 24 && (
                                                        <div style={{ position: "absolute", top: 1, right: 2, fontSize: 8, opacity: 0.7 }}>↻{cell.rotation}°</div>
                                                    )}
                                                    {showLabels && bw * scale > 35 && (
                                                        <span style={{ fontSize: Math.max(6, Math.min(9, bw * scale / 7)), opacity: 0.8 }}>R{ri + 1}C{ci + 1}</span>
                                                    )}
                                                    {!cell.color && bw * scale > 20 && <span style={{ fontSize: 10, opacity: 0.4 }}>?</span>}
                                                </div>
                                            );
                                        }))}
                                    </div>
                                );
                                // Wrap in borders
                                for (let b = borderCount - 1; b >= 0; b--) {
                                    const bWidth = borderWidths[b] * scale;
                                    content = (
                                        <div style={{ padding: bWidth, background: showValueMap ? (b % 2 === 0 ? "#555" : "#aaa") : borderColors[b], borderRadius: 3 }}>
                                            {content}
                                        </div>
                                    );
                                }
                                return content;
                            })()}
                        </div>
                        {/* Dimension labels */}
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "var(--color-text-tertiary)" }}>
                            <span>↔ {analysis.finW}&quot; wide</span>
                            <span>↕ {analysis.finH}&quot; tall</span>
                        </div>
                    </div>

                    {/* ═══ STATISTICS ═══ */}
                    {analysis.assigned > 0 && (
                        <div className={`glass-card ${styles.calculatorCard}`}>
                            <h2 className={styles.calcTitle}>Statistics</h2>
                            <div className={styles.resultDetails}>
                                <div className={styles.resultRow}><span>Total blocks</span><strong>{analysis.total}</strong></div>
                                <div className={styles.resultRow}><span>Assigned</span><strong style={{ color: "hsl(150,60%,35%)" }}>{analysis.assigned}</strong></div>
                                <div className={styles.resultRow}><span>Unassigned</span><strong style={{ color: analysis.unassigned > 0 ? "hsl(40,70%,45%)" : "hsl(150,60%,35%)" }}>{analysis.unassigned}</strong></div>
                                <div className={styles.resultRow}><span>Finished quilt size</span><strong>{analysis.finW}&quot; × {analysis.finH}&quot;</strong></div>
                                <div className={styles.resultRow}><span>Total quilt area</span><strong>{analysis.totalArea.toLocaleString()} sq&quot;</strong></div>
                                {sashingW > 0 && <>
                                    <div className={styles.resultRow}><span>Sashing strips (H)</span><strong>{analysis.sashH}</strong></div>
                                    <div className={styles.resultRow}><span>Sashing strips (V)</span><strong>{analysis.sashV}</strong></div>
                                    {cornerstones && <div className={styles.resultRow}><span>Cornerstones</span><strong>{analysis.csCount}</strong></div>}
                                </>}
                            </div>
                            {/* Color distribution */}
                            <div style={{ marginTop: 10 }}>
                                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Color Distribution</div>
                                {Object.entries(analysis.colorCounts).sort(([, a], [, b]) => b - a).map(([color, count], i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, fontSize: 12 }}>
                                        <div style={{ width: 14, height: 14, borderRadius: 2, background: color, border: "1px solid rgba(0,0,0,0.15)", flexShrink: 0 }} />
                                        <div style={{ flex: 1, height: 6, background: "hsl(0,0%,92%)", borderRadius: 3, overflow: "hidden" }}>
                                            <div style={{ width: `${count / analysis.total * 100}%`, height: "100%", background: color, borderRadius: 3 }} />
                                        </div>
                                        <span style={{ width: 30, textAlign: "right", fontWeight: 600 }}>{count}</span>
                                        <span style={{ width: 38, textAlign: "right", color: "var(--color-text-tertiary)" }}>{(count / analysis.total * 100).toFixed(0)}%</span>
                                    </div>
                                ))}
                            </div>
                            {/* Value distribution */}
                            <div style={{ marginTop: 10 }}>
                                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Value Distribution (Light / Medium / Dark)</div>
                                <div style={{ display: "flex", gap: 8 }}>
                                    {[{ label: "Light", val: analysis.light, bg: "hsl(50,40%,93%)" }, { label: "Medium", val: analysis.med, bg: "hsl(0,0%,88%)" }, { label: "Dark", val: analysis.dark, bg: "hsl(0,0%,75%)" }].map((v, i) => (
                                        <div key={i} style={{ flex: 1, padding: 8, background: v.bg, borderRadius: 6, textAlign: "center" }}>
                                            <div style={{ fontSize: 18, fontWeight: 700 }}>{analysis.assigned > 0 ? Math.round(v.val / analysis.assigned * 100) : 0}%</div>
                                            <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{v.label} ({v.val})</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Toolbar */}
                    <div className="toolbar" style={{ marginBottom: 10 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} /> Copy</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                    </div>

                    {/* ═══ TEMPLATES ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }}
                            onClick={() => setShowTemplates(!showTemplates)}>
                            🎨 Template Library
                            <ChevronDown size={14} style={{ transform: showTemplates ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                        </button>
                        {showTemplates && (
                            <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 6 }}>
                                {TEMPLATES.map((tpl, i) => (
                                    <button key={i} className="btn btn-sm btn-secondary" onClick={() => applyTemplate(tpl)}
                                        style={{ padding: "10px 8px", textAlign: "center", flexDirection: "column", gap: 2 }}>
                                        <div style={{ fontWeight: 600, fontSize: 12 }}>{tpl.name}</div>
                                        <div style={{ fontSize: 9, opacity: 0.7 }}>{tpl.desc}</div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ═══ COMPARISON ═══ */}
                    {tabs.length > 1 && (
                        <div className={`glass-card ${styles.calculatorCard}`}>
                            <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }}
                                onClick={() => setShowComparison(!showComparison)}>
                                🔀 Side-by-Side Comparison
                                <ChevronDown size={14} style={{ transform: showComparison ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                            </button>
                            {showComparison && (
                                <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: `repeat(${Math.min(tabs.length, 3)}, 1fr)`, gap: 8 }}>
                                    {tabs.map((t, ti) => {
                                        const miniScale = Math.min(160 / (cols * bw), 160 / (rows * bh), 4);
                                        return (
                                            <div key={t.id} style={{ cursor: "pointer", border: activeTab === ti ? "2px solid hsl(150,60%,40%)" : "1px solid hsl(0,0%,85%)", borderRadius: 6, padding: 6, textAlign: "center" }}
                                                onClick={() => { setActiveTab(ti); setShowComparison(false); }}>
                                                <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>{t.name}</div>
                                                <div style={{ display: "inline-grid", gridTemplateColumns: `repeat(${cols}, ${bw * miniScale}px)`, gap: 0.5 }}>
                                                    {t.cells.flat().map((cell, i) => (
                                                        <div key={i} style={{ width: bw * miniScale, height: bh * miniScale, background: cell.color || "#e8e8e8", borderRadius: 1 }} />
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ═══ EDUCATIONAL ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
                            onClick={() => setShowEdu(!showEdu)}>
                            📚 Design Tips & How To Use
                            <ChevronDown size={14} style={{ transform: showEdu ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                        </button>
                        {showEdu && (
                            <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
                                <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>How to Use This Planner</h4>
                                <ol style={{ paddingLeft: 18, marginBottom: 12 }}>
                                    <li>Set up your grid dimensions (columns × rows) and block size</li>
                                    <li>Add sashing and borders if your design uses them</li>
                                    <li>Choose a color palette that matches your fabrics</li>
                                    <li>Use Paint mode to click/drag colors onto blocks</li>
                                    <li>Try templates or random fills for quick starting points</li>
                                    <li>Use Shuffle, Mirror, and Rotate All to try arrangements</li>
                                    <li>Check the Value Map for light/dark balance</li>
                                    <li>Save layout variations in tabs; compare side-by-side</li>
                                </ol>
                                <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 12 }}>Understanding Value</h4>
                                <p style={{ marginBottom: 8 }}>Value (light vs dark) matters more than color in quilting. A quilt with all medium-value fabrics will look flat. Mix lights and darks for contrast. Use the Value Map toggle to see your design in grayscale — this replicates the &quot;squint test&quot; that experienced quilters use.</p>
                                <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 12 }}>Color Balance Guidelines</h4>
                                <p style={{ marginBottom: 8 }}>A classic color balance: 50-60% background/neutral, 30-40% main color, 10-20% accent. These aren&apos;t rules — they&apos;re starting points. Scrappy quilts intentionally break these guidelines for a different effect.</p>
                                <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 12 }}>Rotation Creates Secondary Patterns</h4>
                                <p>When directional blocks (Log Cabin, Flying Geese, Pinwheel) are rotated, they create entirely different secondary patterns. The same blocks arranged differently produce Barn Raising, Sunshine & Shadows, or Straight Furrows designs.</p>
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
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>How to Use</h4>
                        <ol style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.8, paddingLeft: 16 }}>
                            <li>Choose grid size</li>
                            <li>Set block size & sashing</li>
                            <li>Pick color palette</li>
                            <li>Paint blocks or use templates</li>
                            <li>Shuffle & rotate to experiment</li>
                            <li>Check value map</li>
                            <li>Compare layouts in tabs</li>
                        </ol>
                    </div>
                    <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Layout Stats</h4>
                        <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.9 }}>
                            <div>Grid: <strong>{cols} × {rows}</strong></div>
                            <div>Block: <strong>{bw}&quot; × {bh}&quot;</strong></div>
                            <div>Total blocks: <strong>{analysis.total}</strong></div>
                            <div>Finished: <strong>{analysis.finW}&quot; × {analysis.finH}&quot;</strong></div>
                            {sashingW > 0 && <div>Sashing: <strong>{sashingW}&quot;</strong></div>}
                            {borderCount > 0 && <div>Borders: <strong>{borderCount}</strong></div>}
                            <div>Palette: <strong>{palette.length} colors</strong></div>
                            <div>Tabs: <strong>{tabs.length}/6</strong></div>
                        </div>
                    </div>
                    <div className="glass-card related-tools">
                        <h4>Related Tools</h4>
                        <a href="/quilt/design-wall" className="related-tool-link">Virtual Design Wall</a>
                        <a href="/quilt/blocks-needed" className="related-tool-link">Blocks Needed Calculator</a>
                        <a href="/quilt/size-calculator" className="related-tool-link">Quilt Size Calculator</a>
                        <a href="/quilt/sashing-calculator" className="related-tool-link">Sashing Calculator</a>
                        <a href="/quilt/border-calculator" className="related-tool-link">Border Calculator</a>
                        <a href="/quilt/backing-calculator" className="related-tool-link">Backing Calculator</a>
                        <a href="/quilt/binding-calculator" className="related-tool-link">Binding Calculator</a>
                        <a href="/quilt/hst-calculator" className="related-tool-link">HST Calculator</a>
                        <a href="/quilt/setting-triangles" className="related-tool-link">Setting Triangles</a>
                        <a href="/quilt" className="related-tool-link">All Quilt Tools</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}