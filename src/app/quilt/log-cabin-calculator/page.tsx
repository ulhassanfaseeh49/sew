"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, ChevronDown, Layers } from "lucide-react";

/* ─── TYPES ─── */
type BlockStyle = "standard" | "courthouse";
interface StripInfo { pos: number; round: number; side: string; cutW: number; cutL: number; finW: number; finL: number; }

/* ─── MATH ENGINE ─── */
function calcStandardStrips(centerFin: number, stripFin: number, rounds: number): StripInfo[] {
 const strips: StripInfo[] = [];
 const sa = 0.5;
 let blockW = centerFin;
 let blockH = centerFin;
 let pos = 0;
 for (let r = 1; r <= rounds; r++) {
 // Strip 1: right side (dark) — length = blockH
 pos++;
 strips.push({ pos, round: r, side: "Dark", cutW: stripFin + sa, cutL: blockH + sa, finW: stripFin, finL: blockH });
 blockW += stripFin;
 // Strip 2: bottom (dark) — length = blockW
 pos++;
 strips.push({ pos, round: r, side: "Dark", cutW: stripFin + sa, cutL: blockW + sa, finW: stripFin, finL: blockW });
 blockH += stripFin;
 // Strip 3: left (light) — length = blockH
 pos++;
 strips.push({ pos, round: r, side: "Light", cutW: stripFin + sa, cutL: blockH + sa, finW: stripFin, finL: blockH });
 blockW += stripFin;
 // Strip 4: top (light) — length = blockW
 pos++;
 strips.push({ pos, round: r, side: "Light", cutW: stripFin + sa, cutL: blockW + sa, finW: stripFin, finL: blockW });
 blockH += stripFin;
 }
 return strips;
}

function calcCourthouseStrips(centerFin: number, stripFin: number, rounds: number): StripInfo[] {
 const strips: StripInfo[] = [];
 const sa = 0.5;
 let blockW = centerFin;
 let blockH = centerFin;
 let pos = 0;
 for (let r = 1; r <= rounds; r++) {
 // Top strip
 pos++;
 strips.push({ pos, round: r, side: "A", cutW: stripFin + sa, cutL: blockW + sa, finW: stripFin, finL: blockW });
 blockH += stripFin;
 // Bottom strip
 pos++;
 strips.push({ pos, round: r, side: "A", cutW: stripFin + sa, cutL: blockW + sa, finW: stripFin, finL: blockW });
 blockH += stripFin;
 // Left strip
 pos++;
 strips.push({ pos, round: r, side: "B", cutW: stripFin + sa, cutL: blockH + sa, finW: stripFin, finL: blockH });
 blockW += stripFin;
 // Right strip
 pos++;
 strips.push({ pos, round: r, side: "B", cutW: stripFin + sa, cutL: blockH + sa, finW: stripFin, finL: blockH });
 blockW += stripFin;
 }
 return strips;
}

function finalBlockSize(centerFin: number, stripFin: number, rounds: number, style: BlockStyle): number {
 if (style === "courthouse") return centerFin + rounds * stripFin * 2;
 return centerFin + rounds * stripFin * 2;
}

function findCombinations(targetSize: number) {
 const combos: { center: number; strip: number; rounds: number }[] = [];
 for (const center of [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6]) {
 for (const strip of [1, 1.25, 1.5, 2, 2.5, 3]) {
 const rem = targetSize - center;
 if (rem <= 0) continue;
 const rounds = rem / (strip * 2);
 if (rounds === Math.floor(rounds) && rounds >= 1 && rounds <= 10) {
 combos.push({ center, strip, rounds });
 }
 }
 }
 return combos.sort((a, b) =>a.rounds - b.rounds);
}

const roundUp8 = (v: number) =>Math.ceil(v * 8) / 8;
function toFrac(v: number): string {
 const w = Math.floor(v);
 const f = v - w;
 if (f < 0.0625) return w ? `${w}` : "0";
 const fracs: [number, string][] = [[0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
 let best = fracs[0];
 for (const fr of fracs) { if (Math.abs(f - fr[0]) < Math.abs(f - best[0])) best = fr; }
 return w ? `${w} ${best[1]}` : best[1];
}

/* ─── CONSTANTS ─── */
const BLOCK_PRESETS = [6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 24];
const STRIP_PRESETS = [1, 1.5, 2, 2.5, 3];
const CENTER_PRESETS = [1.5, 2, 2.5, 3, 4, 5];

/* ─── FAQ ─── */
const faqItems = [
 { q: "What is a log cabin quilt block?", a: "A log cabin block has a center square (the \"chimney\" or \"hearth\") surrounded by strips (\"logs\") added in a rotating sequence. Traditionally, two adjacent sides use light fabrics and two use dark fabrics, creating a diagonal split. This diagonal is what enables all the dramatic layout arrangements like barn raising and straight furrows." },
 { q: "What size strips do I cut for log cabin blocks?", a: "Add ½\" to the finished strip width for seam allowances. For 2\" finished strips, cut at 2½\" wide. Strip lengths vary by position — each successive strip gets longer as the block grows. Use this calculator to get exact lengths for every position." },
 { q: "How do I calculate log cabin block sizes?", a: "Block size = Center size + (Rounds × Strip width × 2). For example: 4\" center + 2 rounds of 2\" strips = 4 + (2 × 2 × 2) = 12\" finished. Not all combinations produce standard sizes — use the Achievable Sizes section to find combinations that work." },
 { q: "What is barn raising layout for log cabin quilts?", a: "Barn raising arranges log cabin blocks so the light and dark sides form concentric diamonds radiating from the center. It's the most dramatic log cabin layout. It works best with even numbers of blocks in both directions (e.g., 6×6, 8×8)." },
 { q: "What is the difference between log cabin and courthouse steps?", a: "In standard log cabin, strips rotate around the center (1-2-3-4 clockwise). In courthouse steps, strips are added in pairs on opposite sides — top+bottom, then left+right. Courthouse steps creates a symmetrical block, while standard log cabin creates a diagonal light/dark split." },
 { q: "How many jelly roll strips for a log cabin quilt?", a: "Jelly roll strips are 2½\" wide (2\" finished). Calculate total dark and light strip length per block, then divide by 42\" (WOF). For a 12\" block with 4\" center and 2 rounds: ~22 dark strips + ~28 light strips for 30 blocks — more than one jelly roll." },
 { q: "What size center square for a 12-inch log cabin block?", a: "For a 12\" block: 4\" center with 2\" strips needs 2 rounds. 3\" center with 1½\" strips needs 3 rounds. 2\" center with 2½\" strips needs 2 rounds. Multiple combinations work — choose based on the visual effect and strip width you prefer." },
 { q: "How much fabric do I need for a log cabin quilt?", a: "Calculate total strip length for dark and light per block, multiply by block count, divide by usable fabric width (42\"), multiply by cut strip width, then convert to yards. This calculator does all that math automatically. Light fabric always needs slightly more than dark." },
 { q: "Why are my log cabin blocks finishing at different sizes?", a: "The #1 log cabin problem! Each strip must be trimmed flush with the block edges after pressing and BEFORE adding the next strip. If strips aren't trimmed consistently, blocks grow at different rates. Chain piecing all blocks helps maintain consistency." },
 { q: "How do I make a scrappy log cabin quilt?", a: "Sort scraps into light and dark piles by value (not color). Any scrap at least cut-strip-width wide is usable. Short scraps work for inner rounds, longer ones for outer rounds. Use this calculator to find minimum strip lengths for each position." },
 { q: "What is chain piecing for log cabin blocks?", a: "Rather than completing one block, add Strip 1 to ALL centers, then Strip 2 to ALL blocks, etc. Sew pieces one after another without cutting thread between. This is faster, uses thread efficiently, and produces more consistent blocks." },
 { q: "Can I use different strip widths in a log cabin block?", a: "Yes! 'Thick-and-thin' log cabins alternate wide and narrow strips. This changes the math — each strip width affects the growing block size differently. Our calculator handles equal-width strips; for varying widths, adjust each round individually." },
];

export default function Page() {
 const [blockStyle, setBlockStyle] = useState<BlockStyle>("standard");
 const [finishedSize, setFinishedSize] = useState(12);
 const [centerSize, setCenterSize] = useState(4);
 const [stripWidth, setStripWidth] = useState(2);
 const [numRounds, setNumRounds] = useState(2);
 const [numBlocks, setNumBlocks] = useState(30);
 const [fabricWidth, setFabricWidth] = useState(42);
 const [showCombos, setShowCombos] = useState(false);
 const [showJelly, setShowJelly] = useState(false);
 const [showLayouts, setShowLayouts] = useState(false);
 const [showEdu, setShowEdu] = useState(false);
 const [showTrouble, setShowTrouble] = useState(false);
 const [activeFaq, setActiveFaq] = useState<number | null>(null);

 // Derived calculations
 const blockFin = finalBlockSize(centerSize, stripWidth, numRounds, blockStyle);
 const strips = useMemo(() =>
 blockStyle === "standard"
 ? calcStandardStrips(centerSize, stripWidth, numRounds)
 : calcCourthouseStrips(centerSize, stripWidth, numRounds),
 [centerSize, stripWidth, numRounds, blockStyle]);

 const centerCut = centerSize + 0.5;
 const stripCut = stripWidth + 0.5;
 const sizeMatch = Math.abs(blockFin - finishedSize) < 0.01;

 // Strip totals per side
 const analysis = useMemo(() =>{
 let darkLen = 0, lightLen = 0;
 for (const s of strips) {
 if (s.side === "Dark" || s.side === "A") darkLen += s.cutL;
 else lightLen += s.cutL;
 }
 const darkPerBlock = darkLen;
 const lightPerBlock = lightLen;
 const totalDarkLen = darkLen * numBlocks;
 const totalLightLen = lightLen * numBlocks;
 const usableW = fabricWidth - 0.5;
 // Centers
 const centersPerRow = Math.floor(usableW / centerCut);
 const centerRows = Math.ceil(numBlocks / Math.max(centersPerRow, 1));
 const centerYd = (centerRows * centerCut) / 36;
 // Dark strips
 const darkWofStrips = Math.ceil(totalDarkLen / usableW);
 const darkYd = (darkWofStrips * stripCut) / 36;
 // Light strips
 const lightWofStrips = Math.ceil(totalLightLen / usableW);
 const lightYd = (lightWofStrips * stripCut) / 36;
 const totalYd = roundUp8(centerYd * 1.1) + roundUp8(darkYd * 1.1) + roundUp8(lightYd * 1.1);
 // Jelly roll
 const jellyDarkPerBlock = Math.ceil(darkPerBlock / usableW);
 const jellyLightPerBlock = Math.ceil(lightPerBlock / usableW);
 const jellyDarkTotal = jellyDarkPerBlock * numBlocks;
 const jellyLightTotal = jellyLightPerBlock * numBlocks;

 return { darkPerBlock, lightPerBlock, totalDarkLen, totalLightLen, centersPerRow, centerRows, centerYd: roundUp8(centerYd * 1.1), darkWofStrips, darkYd: roundUp8(darkYd * 1.1), lightWofStrips, lightYd: roundUp8(lightYd * 1.1), totalYd, jellyDarkTotal, jellyLightTotal };
 }, [strips, numBlocks, fabricWidth, centerCut, stripCut]);

 const combos = useMemo(() =>findCombinations(finishedSize), [finishedSize]);

 // Apply a combo
 const applyCombination = (c: { center: number; strip: number; rounds: number }) =>{
 setCenterSize(c.center); setStripWidth(c.strip); setNumRounds(c.rounds);
 };

 const tS = { fontSize: 11, borderCollapse: "collapse" as const, width: "100%" };
 const tH = { padding: "5px 6px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left" as const, fontSize: 11, fontWeight: 600 as const };
 const tD = { padding: "4px 6px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11 };
 const tR = { textAlign: "right" as const };

 const copyText = `Log Cabin Block: ${blockFin}" finished. Center: ${centerSize}" (cut ${toFrac(centerCut)}"). Strip: ${stripWidth}" (cut ${toFrac(stripCut)}"). ${numRounds} rounds. ${strips.length} strips/block. For ${numBlocks} blocks: Center ${toFrac(analysis.centerYd)} yd, Dark ${toFrac(analysis.darkYd)} yd, Light ${toFrac(analysis.lightYd)} yd. Total: ${toFrac(analysis.totalYd)} yd.`;

 // Visual block diagram max size
 const diagScale = Math.min(280 / blockFin, 25);

 return (
 <div className="container">
 <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "Log Cabin Calculator" }]} />
 <div className="calculator-layout">
 <div className="calculator-main">
 <div className={styles.toolHeader}>
 <span className="category-badge"><Layers size={14} strokeWidth={1.5} />Quilt #152</span>
 <h1>Log Cabin Block Calculator</h1>
 <p>Calculate exact strip widths, lengths, and yardage for log cabin blocks of any size. Includes standard log cabin, courthouse steps, jelly roll planning, and layout arrangement guides.</p>
 </div>

 {/* ① BLOCK STYLE */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>① Block Style</h2>
 <div style={{ display: "flex", gap: 6 }}>
 {([["standard", "Standard Log Cabin", "Strips rotate clockwise around center. Light/dark diagonal split."],
 ["courthouse", "Courthouse Steps", "Strips added in pairs on opposite sides. Symmetric block."]] as const).map(([id, label, desc]) =>(
 <button key={id} className={`btn ${blockStyle === id ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setBlockStyle(id)} style={{ flex: 1, padding: "10px 8px", textAlign: "center" }}>
 <div style={{ fontWeight: 700, fontSize: 12 }}>{label}</div>
 <div style={{ fontSize: 9, opacity: 0.7, marginTop: 2 }}>{desc}</div>
 </button>
 ))}
 </div>
 </div>

 {/* ② BLOCK CONFIGURATION */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>② Block Configuration</h2>
 <div style={{ marginBottom: 8 }}>
 <label className="input-label" style={{ fontSize: 11 }}>Target finished block size</label>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
 {BLOCK_PRESETS.map(s =>(
 <button key={s} className={`btn btn-sm ${finishedSize === s ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setFinishedSize(s)} style={{ fontSize: 11 }}>{s}&quot;</button>
 ))}
 </div>
 <input type="number" className="input-field" value={finishedSize} onChange={e =>setFinishedSize(parseFloat(e.target.value) || 12)} min={4} max={36} step={0.5} style={{ width: 80 }} />
 </div>
 <div className="calculator-form-row">
 <div className="input-group">
 <label className="input-label">Center square (finished)</label>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: 4 }}>
 {CENTER_PRESETS.map(c =>(
 <button key={c} className={`btn btn-sm ${centerSize === c ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setCenterSize(c)} style={{ fontSize: 10 }}>{c}&quot;</button>
 ))}
 </div>
 <input type="number" className="input-field" value={centerSize} onChange={e =>setCenterSize(parseFloat(e.target.value) || 2)} min={0.5} max={12} step={0.5} />
 </div>
 <div className="input-group">
 <label className="input-label">Strip width (finished)</label>
 <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: 4 }}>
 {STRIP_PRESETS.map(w =>(
 <button key={w} className={`btn btn-sm ${stripWidth === w ? "btn-primary" : "btn-secondary"}`}
 onClick={() =>setStripWidth(w)} style={{ fontSize: 10 }}>{w}&quot;</button>
 ))}
 </div>
 <input type="number" className="input-field" value={stripWidth} onChange={e =>setStripWidth(parseFloat(e.target.value) || 1.5)} min={0.5} max={6} step={0.25} />
 </div>
 <div className="input-group">
 <label className="input-label">Rounds</label>
 <input type="number" className="input-field" value={numRounds} onChange={e =>setNumRounds(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))} min={1} max={10} />
 </div>
 </div>
 {/* Result */}
 <div style={{ marginTop: 10, padding: 10, borderRadius: 6, background: sizeMatch ? "hsl(150,25%,95%)" : "hsl(40,40%,95%)", border: `1px solid ${sizeMatch ? "hsl(150,40%,70%)" : "hsl(40,50%,70%)"}` }}>
 <div style={{ fontSize: 13, fontWeight: 700 }}>Resulting block: <span style={{ color: sizeMatch ? "hsl(150,60%,30%)" : "hsl(30,70%,40%)", fontSize: 16 }}>{blockFin}&quot; × {blockFin}&quot;</span>finished
 {sizeMatch ? <span style={{ color: "hsl(150,60%,35%)", marginLeft: 8 }}>✓ Matches target!</span>
 : <span style={{ color: "hsl(30,70%,40%)", marginLeft: 8 }}>≠ Target is {finishedSize}&quot;</span>}
 </div>
 <div style={{ fontSize: 11, marginTop: 4, color: "var(--color-text-secondary)" }}>Center: {toFrac(centerCut)}&quot; × {toFrac(centerCut)}&quot; cut • Strips: {toFrac(stripCut)}&quot; wide cut • {strips.length} strips per block • {numRounds} rounds
 </div>
 {!sizeMatch && combos.length >0 && (
 <div style={{ marginTop: 6, fontSize: 11 }}>
 <strong>Try:</strong>{" "}
 {combos.slice(0, 3).map((c, i) =>(
 <button key={i} className="btn btn-sm btn-secondary" onClick={() =>applyCombination(c)}
 style={{ fontSize: 10, marginLeft: 4 }}>{c.center}&quot; center + {c.strip}&quot; strips × {c.rounds} rounds</button>
 ))}
 </div>
 )}
 </div>
 </div>

 {/* ③ VISUAL BLOCK DIAGRAM */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <h2 className={styles.calcTitle}>③ Block Diagram</h2>
 <div style={{ display: "flex", justifyContent: "center", padding: 10 }}>
 <svg width={blockFin * diagScale + 20} height={blockFin * diagScale + 20} viewBox={`-10 -10 ${blockFin * diagScale + 20} ${blockFin * diagScale + 20}`}>
 {/* Build block visually */}
 {(() =>{
 const els: React.JSX.Element[] = [];
 const s = diagScale;
 if (blockStyle === "standard") {
 let x = 0, y = 0, w = centerSize, h = centerSize;
 // Offset to position center correctly
 const offset = (blockFin - centerSize) / 2;
 const cx = offset * s, cy = offset * s;
 // Center
 els.push(<rect key="c" x={cx} y={cy} width={centerSize * s} height={centerSize * s} fill="hsl(0,65%,55%)" stroke="hsl(0,0%,30%)" strokeWidth={0.5} rx={1} />);
 els.push(<text key="ct" x={cx + centerSize * s / 2} y={cy + centerSize * s / 2 + 3} textAnchor="middle" fontSize={Math.max(7, Math.min(10, centerSize * s / 4))} fill="#fff" fontWeight="bold">C</text>);
 // Draw strips in order
 let bx = cx, by = cy, bw = centerSize * s, bh = centerSize * s;
 for (const st of strips) {
 const isDark = st.side === "Dark";
 const fill = isDark ? "hsl(220,40%,45%)" : "hsl(45,50%,85%)";
 const txtFill = isDark ? "#fff" : "#333";
 const posInRound = (st.pos - 1) % 4;
 if (posInRound === 0) { // right
 const sx = bx + bw;
 els.push(<rect key={st.pos} x={sx} y={by} width={stripWidth * s} height={bh / s * s} fill={fill} stroke="hsl(0,0%,30%)" strokeWidth={0.3} rx={0.5} />);
 if (stripWidth * s >12) els.push(<text key={`t${st.pos}`} x={sx + stripWidth * s / 2} y={by + bh / 2 + 3} textAnchor="middle" fontSize={Math.max(6, Math.min(9, stripWidth * s / 3))} fill={txtFill}>{st.pos}</text>);
 bw += stripWidth * s;
 } else if (posInRound === 1) { // bottom
 const sy = by + bh;
 els.push(<rect key={st.pos} x={bx} y={sy} width={bw / s * s} height={stripWidth * s} fill={fill} stroke="hsl(0,0%,30%)" strokeWidth={0.3} rx={0.5} />);
 if (stripWidth * s >12) els.push(<text key={`t${st.pos}`} x={bx + bw / 2} y={sy + stripWidth * s / 2 + 3} textAnchor="middle" fontSize={Math.max(6, Math.min(9, stripWidth * s / 3))} fill={txtFill}>{st.pos}</text>);
 bh += stripWidth * s;
 } else if (posInRound === 2) { // left
 bx -= stripWidth * s;
 bw += stripWidth * s;
 els.push(<rect key={st.pos} x={bx} y={by} width={stripWidth * s} height={bh / s * s} fill={fill} stroke="hsl(0,0%,30%)" strokeWidth={0.3} rx={0.5} />);
 if (stripWidth * s >12) els.push(<text key={`t${st.pos}`} x={bx + stripWidth * s / 2} y={by + bh / 2 + 3} textAnchor="middle" fontSize={Math.max(6, Math.min(9, stripWidth * s / 3))} fill={txtFill}>{st.pos}</text>);
 } else { // top
 by -= stripWidth * s;
 bh += stripWidth * s;
 els.push(<rect key={st.pos} x={bx} y={by} width={bw / s * s} height={stripWidth * s} fill={fill} stroke="hsl(0,0%,30%)" strokeWidth={0.3} rx={0.5} />);
 if (stripWidth * s >12) els.push(<text key={`t${st.pos}`} x={bx + bw / 2} y={by + stripWidth * s / 2 + 3} textAnchor="middle" fontSize={Math.max(6, Math.min(9, stripWidth * s / 3))} fill={txtFill}>{st.pos}</text>);
 }
 }
 } else {
 // Courthouse steps
 const cx = (blockFin - centerSize) / 2 * s;
 const cy = (blockFin - centerSize) / 2 * s;
 els.push(<rect key="c" x={cx} y={cy} width={centerSize * s} height={centerSize * s} fill="hsl(0,65%,55%)" stroke="hsl(0,0%,30%)" strokeWidth={0.5} rx={1} />);
 els.push(<text key="ct" x={cx + centerSize * s / 2} y={cy + centerSize * s / 2 + 3} textAnchor="middle" fontSize={Math.max(7, Math.min(10, centerSize * s / 4))} fill="#fff" fontWeight="bold">C</text>);
 let bx = cx, by = cy, bw = centerSize * s, bh = centerSize * s;
 for (const st of strips) {
 const isA = st.side === "A";
 const fill = isA ? "hsl(220,40%,45%)" : "hsl(45,50%,85%)";
 const txtFill = isA ? "#fff" : "#333";
 const posInRound = (st.pos - 1) % 4;
 if (posInRound === 0) { // top
 by -= stripWidth * s;
 bh += stripWidth * s;
 els.push(<rect key={st.pos} x={bx} y={by} width={bw} height={stripWidth * s} fill={fill} stroke="hsl(0,0%,30%)" strokeWidth={0.3} />);
 if (stripWidth * s >12) els.push(<text key={`t${st.pos}`} x={bx + bw / 2} y={by + stripWidth * s / 2 + 3} textAnchor="middle" fontSize={7} fill={txtFill}>{st.pos}</text>);
 } else if (posInRound === 1) { // bottom
 const sy = by + bh;
 bh += stripWidth * s;
 els.push(<rect key={st.pos} x={bx} y={sy} width={bw} height={stripWidth * s} fill={fill} stroke="hsl(0,0%,30%)" strokeWidth={0.3} />);
 if (stripWidth * s >12) els.push(<text key={`t${st.pos}`} x={bx + bw / 2} y={sy + stripWidth * s / 2 + 3} textAnchor="middle" fontSize={7} fill={txtFill}>{st.pos}</text>);
 } else if (posInRound === 2) { // left
 bx -= stripWidth * s;
 bw += stripWidth * s;
 els.push(<rect key={st.pos} x={bx} y={by} width={stripWidth * s} height={bh} fill={fill} stroke="hsl(0,0%,30%)" strokeWidth={0.3} />);
 if (stripWidth * s >12) els.push(<text key={`t${st.pos}`} x={bx + stripWidth * s / 2} y={by + bh / 2 + 3} textAnchor="middle" fontSize={7} fill={txtFill}>{st.pos}</text>);
 } else { // right
 const sx = bx + bw;
 bw += stripWidth * s;
 els.push(<rect key={st.pos} x={sx} y={by} width={stripWidth * s} height={bh} fill={fill} stroke="hsl(0,0%,30%)" strokeWidth={0.3} />);
 if (stripWidth * s >12) els.push(<text key={`t${st.pos}`} x={sx + stripWidth * s / 2} y={by + bh / 2 + 3} textAnchor="middle" fontSize={7} fill={txtFill}>{st.pos}</text>);
 }
 }
 }
 return els;
 })()}
 </svg>
 </div>
 <div style={{ display: "flex", gap: 12, justifyContent: "center", fontSize: 11 }}>
 <span><span style={{ display: "inline-block", width: 12, height: 12, background: "hsl(0,65%,55%)", borderRadius: 2, verticalAlign: "middle", marginRight: 4 }} />Center</span>
 <span><span style={{ display: "inline-block", width: 12, height: 12, background: "hsl(220,40%,45%)", borderRadius: 2, verticalAlign: "middle", marginRight: 4 }} />{blockStyle === "standard" ? "Dark" : "Side A"}</span>
 <span><span style={{ display: "inline-block", width: 12, height: 12, background: "hsl(45,50%,85%)", borderRadius: 2, verticalAlign: "middle", marginRight: 4, border: "1px solid #ccc" }} />{blockStyle === "standard" ? "Light" : "Side B"}</span>
 </div>
 </div>

 {/* ④ STRIP CUTTING TABLE */}
 <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(150,60%,40%)" }}>
 <h2 className={styles.calcTitle}>④ Complete Strip Cutting Plan</h2>
 <div style={{ marginBottom: 8, padding: 8, background: "hsl(150,20%,97%)", borderRadius: 6, fontSize: 12 }}>
 <strong>Center:</strong>Cut 1 square at {toFrac(centerCut)}&quot; × {toFrac(centerCut)}&quot; per block
 </div>
 <div style={{ overflowX: "auto" }}>
 <table style={tS}>
 <thead><tr>
 <th style={tH}>#</th><th style={tH}>Round</th><th style={tH}>Side</th>
 <th style={{ ...tH, ...tR }}>Cut Width</th><th style={{ ...tH, ...tR }}>Cut Length</th>
 <th style={{ ...tH, ...tR }}>Fin Width</th><th style={{ ...tH, ...tR }}>Fin Length</th>
 </tr></thead>
 <tbody>
 {strips.map((s, i) =>(
 <tr key={i} style={{ background: s.side === "Dark" || s.side === "A" ? "hsl(220,15%,96%)" : "hsl(45,20%,97%)" }}>
 <td style={{ ...tD, fontWeight: 700 }}>{s.pos}</td>
 <td style={tD}>{s.round}</td>
 <td style={tD}><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: s.side === "Dark" || s.side === "A" ? "hsl(220,40%,45%)" : "hsl(45,50%,85%)", marginRight: 4, border: "1px solid rgba(0,0,0,0.2)", verticalAlign: "middle" }} />{s.side}</td>
 <td style={{ ...tD, ...tR }}>{toFrac(s.cutW)}&quot;</td>
 <td style={{ ...tD, ...tR, fontWeight: 700 }}>{toFrac(s.cutL)}&quot;</td>
 <td style={{ ...tD, ...tR }}>{toFrac(s.finW)}&quot;</td>
 <td style={{ ...tD, ...tR }}>{toFrac(s.finL)}&quot;</td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 <div style={{ marginTop: 8, display: "flex", gap: 12, fontSize: 12, padding: 8, background: "hsl(0,0%,97%)", borderRadius: 6 }}>
 <div><strong>{blockStyle === "standard" ? "Dark" : "Side A"} total:</strong>{toFrac(analysis.darkPerBlock)}&quot; of {toFrac(stripCut)}&quot;-wide strip</div>
 <div><strong>{blockStyle === "standard" ? "Light" : "Side B"} total:</strong>{toFrac(analysis.lightPerBlock)}&quot; of {toFrac(stripCut)}&quot;-wide strip</div>
 </div>
 </div>

 {/* ⑤ YARDAGE */}
 <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(200,50%,50%)" }}>
 <h2 className={styles.calcTitle}>⑤ Yardage Calculator</h2>
 <div className="calculator-form-row" style={{ marginBottom: 10 }}>
 <div className="input-group"><label className="input-label">Number of blocks</label>
 <input type="number" className="input-field" value={numBlocks} onChange={e =>setNumBlocks(Math.max(1, parseInt(e.target.value) || 1))} min={1} max={500} /></div>
 <div className="input-group"><label className="input-label">Fabric width (inches)</label>
 <select className="input-field" value={fabricWidth} onChange={e =>setFabricWidth(parseInt(e.target.value))}>
 <option value={42}>42&quot; (standard)</option><option value={44}>44&quot;</option><option value={60}>60&quot;</option>
 </select></div>
 </div>
 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
 <div className="result-card"><div className="result-prefix">Center Fabric</div><div className="result-value">{toFrac(analysis.centerYd)} yd</div><div className="result-label">{numBlocks} squares at {toFrac(centerCut)}&quot;</div></div>
 <div className="result-card"><div className="result-prefix">{blockStyle === "standard" ? "Dark" : "Side A"} Fabric</div><div className="result-value">{toFrac(analysis.darkYd)} yd</div><div className="result-label">{analysis.darkWofStrips} WOF strips</div></div>
 <div className="result-card"><div className="result-prefix">{blockStyle === "standard" ? "Light" : "Side B"} Fabric</div><div className="result-value">{toFrac(analysis.lightYd)} yd</div><div className="result-label">{analysis.lightWofStrips} WOF strips</div></div>
 </div>
 <div className="result-card" style={{ borderLeft: "3px solid hsl(150,60%,40%)" }}>
 <div className="result-prefix">Total Fabric (all 3)</div>
 <div className="result-value">{toFrac(analysis.totalYd)} yards</div>
 <div className="result-label">For {numBlocks} blocks at {blockFin}&quot; finished — quilt: {Math.round(Math.sqrt(numBlocks)) >0 ? `~${Math.round(Math.sqrt(numBlocks))}×${Math.ceil(numBlocks / Math.round(Math.sqrt(numBlocks)))} layout` : ""}</div>
 </div>
 </div>

 {/* Toolbar */}
 <div className="toolbar" style={{ marginBottom: 10 }}>
 <button className="btn btn-secondary btn-sm" onClick={() =>navigator.clipboard.writeText(copyText)}><ClipboardCopy size={13} />Copy</button>
 <button className="btn btn-secondary btn-sm" onClick={() =>window.print()}><Printer size={13} />Print</button>
 </div>

 {/* ═══ ACHIEVABLE SIZES ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowCombos(!showCombos)}>Achievable Combinations for {finishedSize}&quot; Block ({combos.length} found)
 <ChevronDown size={14} style={{ transform: showCombos ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showCombos && (
 <div style={{ marginTop: 10, overflowX: "auto" }}>
 {combos.length === 0 ? <div style={{ fontSize: 12, color: "hsl(0,60%,50%)", padding: 8 }}>No standard combinations found for {finishedSize}&quot;. Try a different target size.</div>: (
 <table style={tS}>
 <thead><tr><th style={tH}>Center</th><th style={tH}>Strip</th><th style={tH}>Rounds</th><th style={tH}>Cut Center</th><th style={tH}>Cut Strip</th><th style={tH}></th></tr></thead>
 <tbody>{combos.map((c, i) =>(
 <tr key={i} style={{ background: c.center === centerSize && c.strip === stripWidth && c.rounds === numRounds ? "hsl(150,30%,95%)" : "transparent" }}>
 <td style={tD}>{c.center}&quot;</td><td style={tD}>{c.strip}&quot;</td><td style={tD}>{c.rounds}</td>
 <td style={tD}>{toFrac(c.center + 0.5)}&quot;</td><td style={tD}>{toFrac(c.strip + 0.5)}&quot;</td>
 <td style={tD}><button className="btn btn-sm btn-primary" onClick={() =>applyCombination(c)} style={{ fontSize: 10 }}>Use</button></td>
 </tr>
 ))}</tbody>
 </table>
 )}
 </div>
 )}
 </div>

 {/* ═══ JELLY ROLL MODE ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowJelly(!showJelly)}>Jelly Roll Log Cabin Calculator
 <ChevronDown size={14} style={{ transform: showJelly ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showJelly && (
 <div style={{ marginTop: 10, fontSize: 12, lineHeight: 2 }}>
 <div style={{ padding: 8, background: "hsl(280,15%,97%)", borderRadius: 6, marginBottom: 8 }}>
 <strong>Jelly roll strips:</strong>2½&quot; × ~42&quot; (WOF) → <strong>2&quot; finished</strong>width after seams<br />
 {stripWidth === 2 ? <span style={{ color: "hsl(150,60%,35%)" }}>✓ Your current strip width (2&quot;) matches jelly roll strips!</span>
 : <span style={{ color: "hsl(30,70%,40%)" }}>⚠ Your strips are {stripWidth}&quot; — jelly rolls are 2&quot; finished. <button className="btn btn-sm btn-secondary" onClick={() =>setStripWidth(2)} style={{ fontSize: 10 }}>Switch to 2&quot;</button></span>}
 </div>
 <div style={{ padding: 8, background: "hsl(0,0%,97%)", borderRadius: 6 }}>
 <strong>For {numBlocks} blocks:</strong><br />Dark jelly roll strips needed: <strong>{analysis.jellyDarkTotal}</strong><br />Light jelly roll strips needed: <strong>{analysis.jellyLightTotal}</strong><br />Total: <strong>{analysis.jellyDarkTotal + analysis.jellyLightTotal} strips</strong><br />
 <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>A standard jelly roll has 40 strips. You need {Math.ceil((analysis.jellyDarkTotal + analysis.jellyLightTotal) / 40)} jelly roll(s).</span>
 </div>
 </div>
 )}
 </div>

 {/* ═══ LAYOUT ARRANGEMENTS ═══ */}
 {blockStyle === "standard" && (
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowLayouts(!showLayouts)}>Log Cabin Layout Arrangements
 <ChevronDown size={14} style={{ transform: showLayouts ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showLayouts && (
 <div style={{ marginTop: 10 }}>
 {[
 { name: "Barn Raising", desc: "Blocks arranged so light/dark sides form concentric diamonds. Most dramatic layout. Best with even block counts.", icon: "◇" },
 { name: "Straight Furrows", desc: "All blocks oriented same direction. Creates diagonal stripes across the quilt, like plowed rows in a field.", icon: "⟋" },
 { name: "Sunshine & Shadows", desc: "Half the blocks light-side-up, half dark-side-up. Creates a dramatic split-tone diagonal effect.", icon: "◧" },
 { name: "Pinwheels", desc: "Groups of 4 blocks form spinning pinwheels. Requires block count divisible by 4.", icon: "⟰" },
 { name: "Off-Center Rows", desc: "All blocks same orientation. Simplest arrangement — creates horizontal stripes of light and dark.", icon: "☰" },
 ].map((lay, i) =>(
 <div key={i} style={{ padding: 10, background: i % 2 === 0 ? "hsl(0,0%,98%)" : "transparent", borderRadius: 6, marginBottom: 4, display: "flex", gap: 10, alignItems: "flex-start" }}>
 <div style={{ fontSize: 24, lineHeight: 1 }}>{lay.icon}</div>
 <div><div style={{ fontSize: 13, fontWeight: 700 }}>{lay.name}</div><div style={{ fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{lay.desc}</div></div>
 </div>
 ))}
 <div style={{ marginTop: 8, fontSize: 11, color: "var(--color-text-tertiary)" }}>
 → <a href="/quilt/layout-planner" style={{ color: "var(--color-accent-primary)" }}>Open Layout Planner</a>to visually arrange your log cabin blocks
 </div>
 </div>
 )}
 </div>
 )}

 {/* ═══ EDUCATIONAL ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowEdu(!showEdu)}>Understanding Log Cabin Blocks
 <ChevronDown size={14} style={{ transform: showEdu ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showEdu && (
 <div style={{ marginTop: 12, fontSize: 13, lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
 <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>What Is a Log Cabin Block?</h4>
 <p style={{ marginBottom: 8 }}>One of the oldest and most beloved blocks in quilting. The center square represents &quot;the hearth&quot; — traditionally red for fire or yellow for candlelight. Strips (&quot;logs&quot;) are added in a rotating sequence, half light fabrics, half dark. The diagonal split between light and dark creates all the design magic.</p>
 <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 12 }}>Why Strips Get Longer</h4>
 <p style={{ marginBottom: 8 }}>Each strip spans the growing block. Strip 1 equals the center height. Strip 2 spans the center + strip 1. Each successive strip is longer because the block grows with each addition. This calculator computes exact lengths for every position.</p>
 <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 12 }}>The Block Size Formula</h4>
 <p style={{ marginBottom: 8 }}>Block size = Center + (Rounds × Strip width × 2). Not all combinations produce standard sizes. For example, a 2&quot; center with 2&quot; strips: 2 rounds = 10&quot;, 3 rounds = 14&quot; — you can&apos;t get exactly 12&quot;! Use the Achievable Combinations section to find what works.</p>
 <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 12 }}>Chain Piecing Tip</h4>
 <p>Add each strip to ALL blocks before moving to the next strip. This is faster, more consistent, and produces better results than completing one block at a time.</p>
 </div>
 )}
 </div>

 {/* ═══ TROUBLESHOOTING ═══ */}
 <div className={`glass-card ${styles.calculatorCard}`}>
 <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() =>setShowTrouble(!showTrouble)}>Troubleshooting Log Cabin Blocks
 <ChevronDown size={14} style={{ transform: showTrouble ? "rotate(180deg)" : "none", transition: ".2s" }} />
 </button>
 {showTrouble && (
 <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9, color: "var(--color-text-secondary)" }}>
 {[
 { prob: "Blocks finishing at different sizes", fix: "Trim each strip flush with block edges after pressing, BEFORE adding the next strip. Use a consistent ¼\" seam." },
 { prob: "Block is wonky or not square", fix: "Spray starch strips before cutting. Sew slowly without pulling fabric. Press strips before cutting to remove stretch." },
 { prob: "Running out of fabric mid-block", fix: "Use this calculator to pre-calculate all strip lengths. Cut longer strips when uncertain — you can always trim excess." },
 { prob: "Strips from jelly roll running out", fix: "Most jelly roll log cabin quilts need MORE than one roll. Use the Jelly Roll section above to count strips needed." },
 ].map((t, i) =>(
 <div key={i} style={{ padding: 8, background: i % 2 === 0 ? "hsl(0,0%,97%)" : "transparent", borderRadius: 6, marginBottom: 4 }}>
 <div style={{ fontWeight: 700, color: "hsl(0,50%,45%)", fontSize: 12 }}>Problem: {t.prob}</div>
 <div style={{ fontSize: 11, marginTop: 2 }}>✓ <strong>Fix:</strong>{t.fix}</div>
 </div>
 ))}
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
 <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Block Summary</h4>
 <div style={{ fontSize: 12, lineHeight: 2 }}>
 <div>Style: <strong>{blockStyle === "standard" ? "Standard" : "Courthouse"}</strong></div>
 <div>Block: <strong>{blockFin}&quot; finished</strong></div>
 <div>Center: <strong>{centerSize}&quot; (cut {toFrac(centerCut)}&quot;)</strong></div>
 <div>Strips: <strong>{stripWidth}&quot; (cut {toFrac(stripCut)}&quot;)</strong></div>
 <div>Rounds: <strong>{numRounds}</strong></div>
 <div>Strips/block: <strong>{strips.length}</strong></div>
 </div>
 </div>
 <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
 <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Quick Reference</h4>
 <div style={{ fontSize: 11, lineHeight: 2.2, color: "var(--color-text-secondary)" }}>
 <div>Block = Center + Rounds×Strip×2</div>
 <div>Cut width = Finished + ½&quot;</div>
 <div>Center cut = Finished + ½&quot;</div>
 <div style={{ marginTop: 6, fontWeight: 600 }}>Popular 12&quot; blocks:</div>
 <div>→ 4&quot; center + 2&quot; × 2 rnds</div>
 <div>→ 3&quot; center + 1½&quot; × 3 rnds</div>
 <div>→ 2&quot; center + 2½&quot; × 2 rnds</div>
 </div>
 </div>
 <div className="glass-card related-tools">
 <h4>Related Tools</h4>
 <a href="/quilt/layout-planner" className="related-tool-link">Layout Planner</a>
 <a href="/quilt/design-wall" className="related-tool-link">Design Wall</a>
 <a href="/quilt/blocks-needed" className="related-tool-link">Blocks Needed</a>
 <a href="/quilt/size-calculator" className="related-tool-link">Quilt Size Calculator</a>
 <a href="/quilt/backing-calculator" className="related-tool-link">Backing Calculator</a>
 <a href="/quilt/binding-calculator" className="related-tool-link">Binding Calculator</a>
 <a href="/quilt/border-calculator" className="related-tool-link">Border Calculator</a>
 <a href="/quilt/fpp-calculator" className="related-tool-link">FPP Calculator</a>
 <a href="/quilt" className="related-tool-link">All Quilt Tools</a>
 </div>
 </aside>
 </div>
 </div>
 );
}