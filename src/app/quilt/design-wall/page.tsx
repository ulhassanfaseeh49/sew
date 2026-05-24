"use client";
import { useState, useMemo, useCallback, useRef } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import {
 ClipboardCopy, Printer, Palette, Plus, Trash2, Camera,
 RotateCw, Shuffle, Layout, ChevronDown, Grid3X3, Minus, Eye
} from "lucide-react";

/* ─── types ──────────────────────────────────── */
interface BlockDef {
 id: string;
 name: string;
 width: number; // finished inches
 height: number;
 color: string;
 qty: number;
}

interface PlacedBlock {
 id: string;
 defId: string;
 gridRow: number;
 gridCol: number;
 rotation: number; // 0, 90, 180, 270
}

interface Snapshot {
 id: string;
 name: string;
 placed: PlacedBlock[];
 timestamp: number;
}

/* ─── helpers ──────────────────────────────────── */
let _uid = 0;
function uid() { return `b${Date.now()}_${_uid++}`; }

const CANVAS_PRESETS = [
 { label: "Baby (36×36)", w: 36, h: 36 },
 { label: "Throw (48×60)", w: 48, h: 60 },
 { label: "Twin (60×80)", w: 60, h: 80 },
 { label: "Queen (80×90)", w: 80, h: 90 },
 { label: "King (96×96)", w: 96, h: 96 },
];

const BLOCK_PRESETS = [
 { name: "6\" Square", w: 6, h: 6 },
 { name: "9\" Square", w: 9, h: 9 },
 { name: "12\" Square", w: 12, h: 12 },
 { name: "6×12\" Rect", w: 6, h: 12 },
 { name: "3×12\" Sashing", w: 3, h: 12 },
];

const BG_COLORS = [
 { label: "White Flannel", color: "#ffffff" },
 { label: "Light Gray", color: "#e8e8e8" },
 { label: "Tan/Natural", color: "#ede4d4" },
 { label: "Dark Gray", color: "#3a3a3a" },
];

const FABRIC_COLORS = [
 "#1a3a5c", "#8b2323", "#f5f0e0", "#2e6e4e", "#9b6b3f",
 "#5c3d7a", "#d4a843", "#c65050", "#4a8eac", "#e88e5a",
 "#3d5c3d", "#d4b8e0", "#f0d0d0", "#6498c8", "#8b8040",
];

/* ─── component ──────────────────────────────────── */
export default function Page() {
 /* Canvas state */
 const [canvasW, setCanvasW] = useState(60);
 const [canvasH, setCanvasH] = useState(72);
 const [bgColor, setBgColor] = useState("#ffffff");
 const [showGrid, setShowGrid] = useState(true);
 const [gridSize, setGridSize] = useState(6); // inches
 const [showLabels, setShowLabels] = useState(true);

 /* Block library */
 const [blockDefs, setBlockDefs] = useState<BlockDef[]>([
 { id: uid(), name: "Ohio Star", width: 12, height: 12, color: "#1a3a5c", qty: 6 },
 { id: uid(), name: "HST Block", width: 12, height: 12, color: "#8b2323", qty: 6 },
 { id: uid(), name: "Solid Spacer", width: 12, height: 12, color: "#f5f0e0", qty: 8 },
 ]);

 /* New block form */
 const [newName, setNewName] = useState("");
 const [newW, setNewW] = useState(12);
 const [newH, setNewH] = useState(12);
 const [newColor, setNewColor] = useState("#2e6e4e");
 const [newQty, setNewQty] = useState(4);
 const [showAddForm, setShowAddForm] = useState(false);

 /* Placed blocks */
 const [placed, setPlaced] = useState<PlacedBlock[]>([]);
 const [selectedId, setSelectedId] = useState<string | null>(null);

 /* Placing mode */
 const [placingDefId, setPlacingDefId] = useState<string | null>(null);

 /* Snapshots */
 const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
 const [showSnapshots, setShowSnapshots] = useState(false);

 /* View */
 const [showEdu, setShowEdu] = useState(false);
 const [showValueMap, setShowValueMap] = useState(false);
 const [activeFaq, setActiveFaq] = useState<number | null>(null);

 const canvasRef = useRef<HTMLDivElement>(null);

 /* Scale: pixels per inch on screen */
 const scale = useMemo(() =>{
 const maxW = 680; // max canvas px width
 return Math.min(maxW / canvasW, 8);
 }, [canvasW]);

 /* Count placed per def */
 const placedCounts = useMemo(() =>{
 const m: Record<string, number>= {};
 for (const p of placed) { m[p.defId] = (m[p.defId] || 0) + 1; }
 return m;
 }, [placed]);

 /* ─── block operations ─── */
 const addBlockDef = useCallback(() =>{
 if (newW <= 0 || newH <= 0 || newQty <= 0) return;
 setBlockDefs(prev =>[...prev, { id: uid(), name: newName || `Block ${prev.length + 1}`, width: newW, height: newH, color: newColor, qty: newQty }]);
 setNewName(""); setShowAddForm(false);
 }, [newName, newW, newH, newColor, newQty]);

 const addPreset = useCallback((p: typeof BLOCK_PRESETS[0]) =>{
 setBlockDefs(prev =>[...prev, { id: uid(), name: p.name, width: p.w, height: p.h, color: FABRIC_COLORS[prev.length % FABRIC_COLORS.length], qty: 4 }]);
 }, []);

 const removeBlockDef = useCallback((defId: string) =>{
 setBlockDefs(prev =>prev.filter(d =>d.id !== defId));
 setPlaced(prev =>prev.filter(p =>p.defId !== defId));
 }, []);

 /* ─── canvas click to place ─── */
 const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) =>{
 if (!placingDefId) return;
 const def = blockDefs.find(d =>d.id === placingDefId);
 if (!def) return;
 const usedCount = placedCounts[placingDefId] || 0;
 if (usedCount >= def.qty) return;
 const rect = canvasRef.current?.getBoundingClientRect();
 if (!rect) return;
 const x = e.clientX - rect.left;
 const y = e.clientY - rect.top;
 const col = Math.round((x / scale - def.width / 2) / gridSize) * gridSize;
 const row = Math.round((y / scale - def.height / 2) / gridSize) * gridSize;
 setPlaced(prev =>[...prev, { id: uid(), defId: placingDefId, gridRow: Math.max(0, row), gridCol: Math.max(0, col), rotation: 0 }]);
 setSelectedId(null);
 }, [placingDefId, blockDefs, placedCounts, scale, gridSize]);

 /* Remove placed block */
 const removePlaced = useCallback((pid: string) =>{
 setPlaced(prev =>prev.filter(p =>p.id !== pid));
 if (selectedId === pid) setSelectedId(null);
 }, [selectedId]);

 /* Rotate placed block */
 const rotatePlaced = useCallback((pid: string) =>{
 setPlaced(prev =>prev.map(p =>p.id === pid ? { ...p, rotation: (p.rotation + 90) % 360 } : p));
 }, []);

 /* Auto-arrange */
 const autoArrange = useCallback(() =>{
 const newPlaced: PlacedBlock[] = [];
 let curRow = 0;
 let curCol = 0;
 let maxRowH = 0;
 for (const def of blockDefs) {
 const qty = def.qty;
 for (let i = 0; i < qty; i++) {
 if (curCol + def.width >canvasW) {
 curCol = 0;
 curRow += maxRowH;
 maxRowH = 0;
 }
 if (curRow + def.height >canvasH) break;
 newPlaced.push({ id: uid(), defId: def.id, gridRow: curRow, gridCol: curCol, rotation: 0 });
 curCol += def.width;
 maxRowH = Math.max(maxRowH, def.height);
 }
 }
 setPlaced(newPlaced);
 setPlacingDefId(null);
 }, [blockDefs, canvasW, canvasH]);

 /* Shuffle arrangement */
 const shufflePlaced = useCallback(() =>{
 setPlaced(prev =>{
 const arr = [...prev];
 for (let i = arr.length - 1; i >0; i--) {
 const j = Math.floor(Math.random() * (i + 1));
 const tmpRow = arr[i].gridRow; const tmpCol = arr[i].gridCol;
 arr[i] = { ...arr[i], gridRow: arr[j].gridRow, gridCol: arr[j].gridCol };
 arr[j] = { ...arr[j], gridRow: tmpRow, gridCol: tmpCol };
 }
 return arr;
 });
 }, []);

 /* Clear canvas */
 const clearCanvas = useCallback(() =>{ setPlaced([]); setSelectedId(null); setPlacingDefId(null); }, []);

 /* ─── snapshots ─── */
 const takeSnapshot = useCallback(() =>{
 setSnapshots(prev =>[...prev, {
 id: uid(),
 name: `Arrangement ${prev.length + 1}`,
 placed: JSON.parse(JSON.stringify(placed)),
 timestamp: Date.now(),
 }]);
 }, [placed]);

 const restoreSnapshot = useCallback((snap: Snapshot) =>{
 setPlaced(JSON.parse(JSON.stringify(snap.placed)));
 }, []);

 const deleteSnapshot = useCallback((snapId: string) =>{
 setSnapshots(prev =>prev.filter(s =>s.id !== snapId));
 }, []);

 /* ─── analysis ─── */
 const analysis = useMemo(() =>{
 const totalCanvasArea = canvasW * canvasH;
 let coveredArea = 0;
 const colorMap: Record<string, { name: string; color: string; count: number; area: number }>= {};

 for (const p of placed) {
 const def = blockDefs.find(d =>d.id === p.defId);
 if (!def) continue;
 const area = def.width * def.height;
 coveredArea += area;
 if (!colorMap[def.id]) {
 colorMap[def.id] = { name: def.name, color: def.color, count: 0, area: 0 };
 }
 colorMap[def.id].count++;
 colorMap[def.id].area += area;
 }

 const coverage = totalCanvasArea >0 ? (coveredArea / totalCanvasArea * 100) : 0;
 const colorBreakdown = Object.values(colorMap);

 // Value analysis: bucket by lightness
 let lightCount = 0, medCount = 0, darkCount = 0;
 for (const cb of colorBreakdown) {
 const hex = cb.color.replace("#", "");
 const r = parseInt(hex.substring(0, 2), 16);
 const g = parseInt(hex.substring(2, 4), 16);
 const b = parseInt(hex.substring(4, 6), 16);
 const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
 if (lum >0.65) lightCount += cb.count;
 else if (lum >0.35) medCount += cb.count;
 else darkCount += cb.count;
 }
 const totalBlocks = placed.length;

 return {
 totalCanvasArea, coveredArea, coverage, colorBreakdown, totalBlocks,
 lightPct: totalBlocks >0 ? Math.round(lightCount / totalBlocks * 100) : 0,
 medPct: totalBlocks >0 ? Math.round(medCount / totalBlocks * 100) : 0,
 darkPct: totalBlocks >0 ? Math.round(darkCount / totalBlocks * 100) : 0,
 unplaced: blockDefs.reduce((sum, d) =>sum + d.qty - (placedCounts[d.id] || 0), 0),
 };
 }, [placed, blockDefs, canvasW, canvasH, placedCounts]);

 /* Copy summary */
 const copyText = `Design Wall: ${canvasW}"×${canvasH}" canvas, ${placed.length} blocks placed, ${analysis.coverage.toFixed(0)}% coverage.`;

 /* FAQ */
 const faqItems = [
 { q: "What is a quilt design wall?", a: "A design wall is a large flannel or batting-covered surface where quilters pin blocks to arrange them before sewing. It lets you stand back and see the full quilt layout, evaluate color and value balance, and try different arrangements. This virtual version replicates that experience digitally." },
 { q: "How do I use this virtual design wall?", a: "1) Set your canvas size to match your quilt. 2) Add blocks to your library with colors and sizes. 3) Click a block in the library, then click on the canvas to place it. 4) Rearrange blocks until you're happy. 5) Take snapshots of arrangements you like. 6) Use the analysis tools to check color balance." },
 { q: "What is the difference between a layout planner and a design wall?", a: "The Layout Planner (#131) is grid-based — all blocks are the same size in a structured grid. The Design Wall is freeform — it handles mixed block sizes, sampler quilts, and improv quilts. The planner calculates precise dimensions; the design wall focuses on visual composition." },
 { q: "How do I plan an improv quilt layout?", a: "Add blocks of different sizes to your library. Place them freely on the canvas without snapping to a grid. Use the gap finder to see where you need filler pieces. The freeform nature of the design wall makes it perfect for improv quilts." },
 { q: "What size should a physical design wall be?", a: "Your design wall should be at least as large as your biggest quilt plus 20% on each side for rearranging. For a queen quilt (90\"×96\"), you'd want a wall at least 108\"×115\". Many quilters use a 72\"×96\" wall which works for most lap and twin quilts." },
 { q: "How do I balance colors on a design wall?", a: "Use the built-in color balance analysis to see the distribution. Aim for good distribution of values (light, medium, dark) across the quilt. Spread accent colors evenly rather than clustering them. The value map overlay helps you check light/dark balance." },
 { q: "What is value in quilt design?", a: "Value refers to how light or dark a fabric is, regardless of color. A dark navy and dark red have similar value. Good quilts need contrast between values — all medium-value fabrics make a flat-looking quilt. Use the value map overlay (grayscale) to check your value distribution." },
 { q: "How do I plan a sampler quilt layout?", a: "Add each different block type to your library with accurate sizes. Place them on the canvas and experiment with arrangements. Consider alternating busy (pieced) blocks with calm (solid) blocks. Use the shuffle feature to try random arrangements quickly." },
 { q: "Can I save multiple arrangements to compare?", a: "Yes! Use the Snapshot feature. Take a snapshot of any arrangement you like. You can save unlimited snapshots and restore any of them with one click. This lets you try many arrangements without fear of losing a good one." },
 { q: "How do I use the auto-arrange feature?", a: "Click 'Auto-Arrange' to automatically place all blocks from your library onto the canvas in a grid pattern. This gives you a starting point that you can then customize. Use 'Shuffle' to randomly swap block positions for a different arrangement." },
 ];

 return (
 <div className="container">
 <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "Virtual Design Wall" }]} />
 <div className="calculator-layout">
 <div className="calculator-main">
 {/* HEADER */}
 <div className={styles.toolHeader}>
 <span className="category-badge"><Palette size={14} strokeWidth={1.5} />Quilt #134</span>
 <h1>Virtual Quilt Design Wall</h1>
 <p>Arrange quilt blocks on a digital canvas. Add blocks, place them visually, check color and value balance, compare arrangements with snapshots, and plan your quilt composition — works for sampler, improv, row, and regular quilts.</p>
 </div>

 {/* ① CANVAS SETUP */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>① Canvas Setup</h2>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
 {CANVAS_PRESETS.map(p =>(
 <button key={p.label}
 className={`btn btn-sm ${canvasW === p.w && canvasH === p.h ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>{ setCanvasW(p.w); setCanvasH(p.h); }}>{p.label}</button>
 ))}
 </div>
 <div className="calculator-form-row">
 <div className="input-group"><label className="input-label">Width (inches)</label>
 <input type="number" className="input-field" value={canvasW} onChange={e =>setCanvasW(parseInt(e.target.value) || 36)} min={12} max={120} /></div>
 <div className="input-group"><label className="input-label">Height (inches)</label>
 <input type="number" className="input-field" value={canvasH} onChange={e =>setCanvasH(parseInt(e.target.value) || 36)} min={12} max={120} /></div>
 </div>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
 <div className="input-group" style={{ flex: "0 0 auto" }}>
 <label className="input-label" style={{ fontSize: 11 }}>Background</label>
 <div style={{ display: "flex", gap: 4 }}>
 {BG_COLORS.map(bg =>(
 <button key={bg.color} title={bg.label} onClick={() =>setBgColor(bg.color)}
 style={{ width: 24, height: 24, borderRadius: 4, border: bgColor === bg.color ? "2px solid hsl(150,60%,40%)" : "1px solid #ccc", background: bg.color, cursor: "pointer" }} />
 ))}
 </div>
 </div>
 <div className="input-group" style={{ flex: "0 0 auto" }}>
 <label className="input-label" style={{ fontSize: 11 }}>Grid</label>
 <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
 <button className={`btn btn-sm ${showGrid ? "btn-primary" : "btn-secondary"}`} onClick={() =>setShowGrid(!showGrid)} style={{ fontSize: 11 }}>
 <Grid3X3 size={12} />{showGrid ? "On" : "Off"}
 </button>
 {showGrid && (
 <select className="input-field" style={{ width: 60, fontSize: 11, padding: "3px 4px" }} value={gridSize} onChange={e =>setGridSize(parseInt(e.target.value))}>
 <option value="3">3&quot;</option><option value="6">6&quot;</option><option value="12">12&quot;</option>
 </select>
 )}
 </div>
 </div>
 <div className="input-group" style={{ flex: "0 0 auto" }}>
 <label className="input-label" style={{ fontSize: 11 }}>Labels</label>
 <button className={`btn btn-sm ${showLabels ? "btn-primary" : "btn-secondary"}`} onClick={() =>setShowLabels(!showLabels)} style={{ fontSize: 11 }}>
 {showLabels ? "On" : "Off"}
 </button>
 </div>
 </div>
 </div>

 {/* ② BLOCK LIBRARY */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>② Block Library</h2>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
 {BLOCK_PRESETS.map((p, i) =>(
 <button key={i} className="btn btn-sm btn-secondary" onClick={() =>addPreset(p)} style={{ fontSize: 11 }}>
 <Plus size={10} />{p.name}
 </button>
 ))}
 </div>

 {/* Existing blocks */}
 <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
 {blockDefs.map(def =>{
 const placedN = placedCounts[def.id] || 0;
 const remaining = def.qty - placedN;
 const isActive = placingDefId === def.id;
 return (
 <div key={def.id} style={{
 display: "flex", alignItems: "center", gap: 8, padding: "6px 8px",
 borderRadius: 6, border: isActive ? "2px solid hsl(150,60%,40%)" : "1px solid hsl(0,0%,88%)",
 background: isActive ? "hsl(150,40%,96%)" : "hsl(0,0%,98%)", cursor: "pointer",
 }} onClick={() =>{ if (remaining >0) setPlacingDefId(isActive ? null : def.id); }}>
 <div style={{ width: 24, height: 24, borderRadius: 3, background: def.color, flexShrink: 0, border: "1px solid rgba(0,0,0,0.1)" }} />
 <div style={{ flex: 1, minWidth: 0 }}>
 <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{def.name}</div>
 <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>{def.width}&quot;×{def.height}&quot; • {placedN}/{def.qty} placed</div>
 </div>
 <span style={{ fontSize: 11, color: remaining >0 ? "hsl(150,60%,35%)" : "hsl(0,50%,50%)", fontWeight: 600, whiteSpace: "nowrap" }}>
 {remaining >0 ? `${remaining} left` : "All placed"}
 </span>
 <button onClick={e =>{ e.stopPropagation(); removeBlockDef(def.id); }} style={{ border: "none", background: "none", cursor: "pointer", color: "hsl(0,50%,60%)", padding: 2 }}><Trash2 size={13} /></button>
 </div>
 );
 })}
 </div>

 {/* Add custom block */}
 {!showAddForm ? (
 <button className="btn btn-sm btn-secondary" style={{ marginTop: 8 }} onClick={() =>setShowAddForm(true)}>
 <Plus size={12} />Add Custom Block
 </button>
 ) : (
 <div style={{ marginTop: 8, padding: 10, background: "hsl(0,0%,97%)", borderRadius: 6, border: "1px solid hsl(0,0%,90%)" }}>
 <div className="calculator-form-row" style={{ gap: 6, marginBottom: 6 }}>
 <div className="input-group"><label className="input-label" style={{ fontSize: 11 }}>Name</label>
 <input className="input-field" value={newName} onChange={e =>setNewName(e.target.value)} placeholder="e.g. Log Cabin" style={{ fontSize: 12 }} /></div>
 <div className="input-group"><label className="input-label" style={{ fontSize: 11 }}>Width</label>
 <input type="number" className="input-field" value={newW} onChange={e =>setNewW(parseInt(e.target.value) || 1)} min={1} style={{ fontSize: 12 }} /></div>
 <div className="input-group"><label className="input-label" style={{ fontSize: 11 }}>Height</label>
 <input type="number" className="input-field" value={newH} onChange={e =>setNewH(parseInt(e.target.value) || 1)} min={1} style={{ fontSize: 12 }} /></div>
 </div>
 <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
 <label className="input-label" style={{ fontSize: 11, margin: 0 }}>Color:</label>
 {FABRIC_COLORS.slice(0, 10).map(c =>(
 <button key={c} onClick={() =>setNewColor(c)}
 style={{ width: 18, height: 18, borderRadius: 3, background: c, border: newColor === c ? "2px solid hsl(150,60%,40%)" : "1px solid #ccc", cursor: "pointer" }} />
 ))}
 <input type="color" value={newColor} onChange={e =>setNewColor(e.target.value)} style={{ width: 22, height: 22, border: "none", padding: 0, cursor: "pointer" }} />
 </div>
 <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
 <label className="input-label" style={{ fontSize: 11, margin: 0 }}>Qty:</label>
 <input type="number" className="input-field" value={newQty} onChange={e =>setNewQty(parseInt(e.target.value) || 1)} min={1} style={{ width: 50, fontSize: 12 }} />
 <button className="btn btn-sm btn-primary" onClick={addBlockDef}>Add</button>
 <button className="btn btn-sm btn-secondary" onClick={() =>setShowAddForm(false)}>Cancel</button>
 </div>
 </div>
 )}

 {placingDefId && (
 <div style={{ marginTop: 8, padding: 8, background: "hsl(150,40%,95%)", borderRadius: 6, fontSize: 12, color: "hsl(150,60%,30%)", fontWeight: 600 }}>Click on the canvas below to place: {blockDefs.find(d =>d.id === placingDefId)?.name}
 </div>
 )}
 </div>

 {/* Canvas toolbar */}
 <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
 <button className="btn btn-sm btn-secondary" onClick={autoArrange}><Layout size={12} />Auto-Arrange</button>
 <button className="btn btn-sm btn-secondary" onClick={shufflePlaced} disabled={placed.length < 2}><Shuffle size={12} />Shuffle</button>
 <button className="btn btn-sm btn-secondary" onClick={clearCanvas} disabled={placed.length === 0}><Trash2 size={12} />Clear</button>
 <button className="btn btn-sm btn-secondary" onClick={takeSnapshot} disabled={placed.length === 0}><Camera size={12} />Snapshot</button>
 <button className={`btn btn-sm ${showValueMap ? "btn-primary" : "btn-secondary"}`} onClick={() =>setShowValueMap(!showValueMap)}><Eye size={12} />Value Map</button>
 </div>

 {/* ═══ THE CANVAS ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`} style={{ padding: 8 }}>
 <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 4 }}>
 {canvasW}&quot; × {canvasH}&quot; canvas — {placed.length} blocks placed • {analysis.coverage.toFixed(0)}% coverage
 </div>
 <div ref={canvasRef}
 onClick={handleCanvasClick}
 style={{
 position: "relative", width: canvasW * scale, height: canvasH * scale,
 background: bgColor, border: "2px solid hsl(0,0%,80%)", borderRadius: 4,
 cursor: placingDefId ? "crosshair" : "default", overflow: "hidden",
 filter: showValueMap ? "grayscale(100%)" : "none",
 }}>
 {/* Grid lines */}
 {showGrid && (() =>{
 const lines: React.JSX.Element[] = [];
 for (let x = gridSize; x < canvasW; x += gridSize) {
 lines.push(<div key={`gv${x}`} style={{ position: "absolute", left: x * scale, top: 0, width: 1, height: "100%", background: "rgba(0,0,0,0.06)" }} />);
 }
 for (let y = gridSize; y < canvasH; y += gridSize) {
 lines.push(<div key={`gh${y}`} style={{ position: "absolute", top: y * scale, left: 0, height: 1, width: "100%", background: "rgba(0,0,0,0.06)" }} />);
 }
 return lines;
 })()}

 {/* Placed blocks */}
 {placed.map(p =>{
 const def = blockDefs.find(d =>d.id === p.defId);
 if (!def) return null;
 const isRotated = p.rotation === 90 || p.rotation === 270;
 const w = isRotated ? def.height : def.width;
 const h = isRotated ? def.width : def.height;
 const isSel = selectedId === p.id;
 return (
 <div key={p.id}
 onClick={e =>{ e.stopPropagation(); setSelectedId(isSel ? null : p.id); setPlacingDefId(null); }}
 style={{
 position: "absolute",
 left: p.gridCol * scale, top: p.gridRow * scale,
 width: w * scale, height: h * scale,
 background: def.color, borderRadius: 2,
 border: isSel ? "2px solid hsl(50,90%,50%)" : "1px solid rgba(0,0,0,0.2)",
 boxShadow: isSel ? "0 0 0 2px rgba(255,200,0,0.4)" : "none",
 cursor: "pointer", display: "flex", flexDirection: "column",
 alignItems: "center", justifyContent: "center",
 fontSize: Math.max(7, Math.min(10, w * scale / 6)), color: "#fff",
 textShadow: "0 1px 2px rgba(0,0,0,0.5)", lineHeight: 1.2,
 zIndex: isSel ? 10 : 1,
 }}>
 {showLabels && w * scale >30 && (
 <>
 <span style={{ fontWeight: 700, maxWidth: "90%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{def.name}</span>
 <span style={{ fontSize: Math.max(6, Math.min(8, w * scale / 8)), opacity: 0.8 }}>{def.width}&quot;×{def.height}&quot;</span>
 </>
 )}
 </div>
 );
 })}
 </div>

 {/* Selected block controls */}
 {selectedId && (
 <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
 <button className="btn btn-sm btn-secondary" onClick={() =>rotatePlaced(selectedId)}><RotateCw size={12} />Rotate</button>
 <button className="btn btn-sm btn-secondary" onClick={() =>removePlaced(selectedId)} style={{ color: "hsl(0,60%,50%)" }}><Minus size={12} />Remove</button>
 </div>
 )}
 </div>

 {/* ═══ SNAPSHOTS ═══ */}
 {snapshots.length >0 && (
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
 onClick={() =>setShowSnapshots(!showSnapshots)}>Saved Snapshots ({snapshots.length})
 <ChevronDown size={14} style={{ transform: showSnapshots ? "rotate(180deg)" : "none", transition: "0.2s" }} />
 </button>
 {showSnapshots && (
 <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
 {snapshots.map(snap =>(
 <div key={snap.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: 6, background: "hsl(0,0%,97%)", borderRadius: 6 }}>
 <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{snap.name} — {snap.placed.length} blocks</span>
 <span style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{new Date(snap.timestamp).toLocaleTimeString()}</span>
 <button className="btn btn-sm btn-primary" onClick={() =>restoreSnapshot(snap)} style={{ fontSize: 10 }}>Restore</button>
 <button className="btn btn-sm btn-secondary" onClick={() =>deleteSnapshot(snap.id)} style={{ fontSize: 10, color: "hsl(0,50%,55%)" }}>Delete</button>
 </div>
 ))}
 </div>
 )}
 </div>
 )}

 {/* ═══ ANALYSIS ═══ */}
 {placed.length >0 && (
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>Design Analysis</h2>
 <div className={styles.resultDetails}>
 <div className={styles.resultRow}><span>Total blocks placed</span><strong>{analysis.totalBlocks}</strong></div>
 <div className={styles.resultRow}><span>Unplaced blocks</span><strong>{analysis.unplaced}</strong></div>
 <div className={styles.resultRow}><span>Canvas area</span><strong>{analysis.totalCanvasArea.toLocaleString()} sq&quot;</strong></div>
 <div className={styles.resultRow}><span>Covered area</span><strong>{analysis.coveredArea.toLocaleString()} sq&quot;</strong></div>
 <div className={styles.resultRow}><span>Coverage</span><strong style={{ color: analysis.coverage >80 ? "hsl(150,60%,35%)" : analysis.coverage >50 ? "hsl(40,70%,45%)" : "hsl(0,60%,50%)" }}>{analysis.coverage.toFixed(1)}%</strong></div>
 </div>

 {/* Color breakdown */}
 <div style={{ marginTop: 10 }}>
 <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Color Distribution</div>
 {analysis.colorBreakdown.map((cb, i) =>(
 <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, fontSize: 12 }}>
 <div style={{ width: 14, height: 14, borderRadius: 2, background: cb.color, border: "1px solid rgba(0,0,0,0.15)" }} />
 <span style={{ flex: 1 }}>{cb.name}</span>
 <span style={{ color: "var(--color-text-secondary)" }}>{cb.count} blocks</span>
 <span style={{ fontWeight: 600, width: 42, textAlign: "right" }}>{(cb.area / analysis.totalCanvasArea * 100).toFixed(0)}%</span>
 </div>
 ))}
 </div>

 {/* Value distribution */}
 <div style={{ marginTop: 10 }}>
 <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Value Distribution</div>
 <div style={{ display: "flex", gap: 8 }}>
 <div style={{ flex: 1, padding: 8, background: "hsl(50,40%,93%)", borderRadius: 6, textAlign: "center" }}>
 <div style={{ fontSize: 18, fontWeight: 700 }}>{analysis.lightPct}%</div>
 <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>Light</div>
 </div>
 <div style={{ flex: 1, padding: 8, background: "hsl(0,0%,88%)", borderRadius: 6, textAlign: "center" }}>
 <div style={{ fontSize: 18, fontWeight: 700 }}>{analysis.medPct}%</div>
 <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>Medium</div>
 </div>
 <div style={{ flex: 1, padding: 8, background: "hsl(0,0%,75%)", borderRadius: 6, textAlign: "center" }}>
 <div style={{ fontSize: 18, fontWeight: 700 }}>{analysis.darkPct}%</div>
 <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>Dark</div>
 </div>
 </div>
 </div>
 </div>
 )}

 {/* Toolbar */}
 <div className="toolbar" style={{ marginBottom: 16 }}>
 <button className="btn btn-secondary btn-sm" onClick={() =>navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} />Copy</button>
 <button className="btn btn-secondary btn-sm" onClick={() =>window.print()}><Printer size={13} />Print</button>
 </div>

 {/* ═══ EDUCATIONAL ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
 onClick={() =>setShowEdu(!showEdu)}>Tips for Good Quilt Composition
 <ChevronDown size={14} style={{ transform: showEdu ? "rotate(180deg)" : "none", transition: "0.2s" }} />
 </button>
 {showEdu && (
 <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
 <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>The Rule of Thirds</h4>
 <p style={{ marginBottom: 8 }}>Divide your quilt into a 3×3 grid. Placing focal elements along these lines or at intersections creates more dynamic compositions than centering everything.</p>
 <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 12 }}>Value Matters More Than Color</h4>
 <p style={{ marginBottom: 8 }}>The contrast between light and dark (value) creates the visual structure of your quilt. A quilt with all medium-value fabrics will look flat. Mix lights and darks for visual interest. Use the Value Map toggle to check in grayscale.</p>
 <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 12 }}>Spreading Accent Colors</h4>
 <p style={{ marginBottom: 8 }}>Distribute accent fabrics evenly across the quilt rather than clustering them. Your eye should travel across the entire design, not get stuck in one area.</p>
 <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 12 }}>Odd Numbers Work Better</h4>
 <p>Odd numbers of accent blocks (3, 5, 7) typically create more visual interest than even numbers. This applies to both block counts and color placement.</p>
 </div>
 )}
 </div>

 {/* FAQ */}
 <section className="faq-section">
 <h2>Frequently Asked Questions</h2>
 <div style={{ marginTop: "1.5rem" }}>
 {faqItems.map((f, i) =>(
 <div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}>
 <button className="faq-question" onClick={() =>setActiveFaq(activeFaq === i ? null : i)}>
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
 <li>Set canvas size</li>
 <li>Add blocks to library</li>
 <li>Click block, then click canvas</li>
 <li>Rearrange & snapshot</li>
 <li>Check analysis</li>
 </ol>
 </div>
 <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
 <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Design Wall Stats</h4>
 <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.9 }}>
 <div>Canvas: {canvasW}&quot;×{canvasH}&quot;</div>
 <div>Block types: {blockDefs.length}</div>
 <div>Total in library: {blockDefs.reduce((s, d) =>s + d.qty, 0)}</div>
 <div>Placed: {placed.length}</div>
 <div>Snapshots: {snapshots.length}</div>
 </div>
 </div>
 <div className="glass-card related-tools">
 <h4>Related Tools</h4>
 <a href="/quilt/blocks-needed" className="related-tool-link">Blocks Needed Calculator</a>
 <a href="/quilt/block-size-calculator" className="related-tool-link">Block Size Calculator</a>
 <a href="/quilt/backing-calculator" className="related-tool-link">Backing Calculator</a>
 <a href="/quilt/binding-calculator" className="related-tool-link">Binding Calculator</a>
 <a href="/quilt" className="related-tool-link">All Quilt Tools</a>
 </div>
 </aside>
 </div>
 </div>
 );
}