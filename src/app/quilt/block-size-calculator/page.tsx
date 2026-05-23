"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, ChevronDown, Info, AlertTriangle, Ruler } from "lucide-react";

/* ─── constants ────────────────────────────────────── */
type Mode = "fin2unfin" | "unfin2fin" | "piece" | "troubleshoot";
const MODES: { key: Mode; label: string; desc: string }[] = [
    { key: "fin2unfin", label: "Finished → Unfinished", desc: "I know my finished size — tell me cutting size" },
    { key: "unfin2fin", label: "Unfinished → Finished", desc: "I know my cutting size — tell me finished size" },
    { key: "piece", label: "Block Pieces", desc: "Calculate all piece sizes for a block type" },
    { key: "troubleshoot", label: "Troubleshoot", desc: "My blocks are the wrong size — help!" },
];

const SA_OPTIONS = [
    { value: 0.25, label: "¼\" (quilting standard)" },
    { value: 0.375, label: "⅜\"" },
    { value: 0.5, label: "½\"" },
    { value: 0.625, label: "⅝\" (garment standard)" },
];

const FINISHED_PRESETS = [3, 4, 4.5, 5, 6, 7, 8, 9, 10, 12, 14, 15, 16, 18, 20, 24];

interface BlockType {
    key: string; label: string;
    pieces: (fin: number, sa: number) => { piece: string; desc: string; cutW: number; cutH: number; qty: number; notes: string }[];
}

const BLOCK_TYPES: BlockType[] = [
    {
        key: "plain", label: "Plain Square", pieces: (f, sa) => [
            { piece: "A", desc: "Whole block", cutW: f + sa * 2, cutH: f + sa * 2, qty: 1, notes: "Single square" }
        ]
    },
    {
        key: "four-patch", label: "Four-Patch", pieces: (f, sa) => {
            const p = f / 2;
            return [{ piece: "A", desc: "Square", cutW: p + sa * 2, cutH: p + sa * 2, qty: 4, notes: "2 light, 2 dark" }];
        }
    },
    {
        key: "nine-patch", label: "Nine-Patch", pieces: (f, sa) => {
            const p = f / 3;
            return [{ piece: "A", desc: "Square", cutW: p + sa * 2, cutH: p + sa * 2, qty: 9, notes: "5 of one color, 4 of another" }];
        }
    },
    {
        key: "hst", label: "Half-Square Triangle (HST)", pieces: (f, sa) => {
            const cut = f + sa * 2 + 0.875; // +⅞" for diagonal
            return [{ piece: "A", desc: "Square (cut diagonally once)", cutW: cut, cutH: cut, qty: 2, notes: "1 light, 1 dark — yields 2 HSTs" }];
        }
    },
    {
        key: "qst", label: "Quarter-Square Triangle", pieces: (f, sa) => {
            const cut = f + sa * 2 + 1.25; // +1¼" for double diagonal
            return [{ piece: "A", desc: "Square (cut diagonally twice)", cutW: cut, cutH: cut, qty: 2, notes: "1 light, 1 dark — yields 4 QSTs" }];
        }
    },
    {
        key: "flying-geese", label: "Flying Geese", pieces: (f, sa) => {
            const gW = f; const gH = f / 2;
            return [
                { piece: "A", desc: "Goose rectangle", cutW: gW + sa * 2 + 0.5, cutH: gH + sa * 2 + 0.5, qty: 1, notes: "Large triangle fabric" },
                { piece: "B", desc: "Sky square", cutW: gH + sa * 2 + 0.875, cutH: gH + sa * 2 + 0.875, qty: 2, notes: "Background — cut diag. once" },
            ];
        }
    },
    {
        key: "snowball", label: "Snowball Block", pieces: (f, sa) => {
            const corner = f / 3;
            return [
                { piece: "A", desc: "Center square", cutW: f + sa * 2, cutH: f + sa * 2, qty: 1, notes: "Main fabric" },
                { piece: "B", desc: "Corner square", cutW: corner + sa * 2, cutH: corner + sa * 2, qty: 4, notes: "Draw diagonal, stitch, trim" },
            ];
        }
    },
    {
        key: "pinwheel", label: "Pinwheel", pieces: (f, sa) => {
            const p = f / 2;
            const cut = p + sa * 2 + 0.875;
            return [{ piece: "A", desc: "Square (for HSTs)", cutW: cut, cutH: cut, qty: 4, notes: "2 light, 2 dark — makes 4 HSTs" }];
        }
    },
    {
        key: "rail-fence", label: "Rail Fence", pieces: (f, sa) => {
            const stripW = f / 3;
            return [{ piece: "A", desc: "Strip", cutW: f + sa * 2, cutH: stripW + sa * 2, qty: 3, notes: "3 different fabrics" }];
        }
    },
    {
        key: "friendship-star", label: "Friendship Star", pieces: (f, sa) => {
            const p = f / 3;
            const hstCut = p + sa * 2 + 0.875;
            return [
                { piece: "A", desc: "Center square", cutW: p + sa * 2, cutH: p + sa * 2, qty: 1, notes: "Star center" },
                { piece: "B", desc: "Corner square", cutW: p + sa * 2, cutH: p + sa * 2, qty: 4, notes: "Background" },
                { piece: "C", desc: "HST square", cutW: hstCut, cutH: hstCut, qty: 4, notes: "2 star + 2 bg → 4 HSTs for star points" },
            ];
        }
    },
    {
        key: "ohio-star", label: "Ohio Star", pieces: (f, sa) => {
            const p = f / 3;
            const qstCut = p + sa * 2 + 1.25;
            return [
                { piece: "A", desc: "Center square", cutW: p + sa * 2, cutH: p + sa * 2, qty: 1, notes: "Star center" },
                { piece: "B", desc: "Corner square", cutW: p + sa * 2, cutH: p + sa * 2, qty: 4, notes: "Background" },
                { piece: "C", desc: "QST square", cutW: qstCut, cutH: qstCut, qty: 4, notes: "2 star + 2 bg → cut diag. twice" },
            ];
        }
    },
    {
        key: "shoofly", label: "Shoofly", pieces: (f, sa) => {
            const p = f / 3;
            const hstCut = p + sa * 2 + 0.875;
            return [
                { piece: "A", desc: "Center square", cutW: p + sa * 2, cutH: p + sa * 2, qty: 1, notes: "Main fabric" },
                { piece: "B", desc: "Background square", cutW: p + sa * 2, cutH: p + sa * 2, qty: 4, notes: "Background" },
                { piece: "C", desc: "HST square", cutW: hstCut, cutH: hstCut, qty: 4, notes: "2 main + 2 bg → 4 HSTs" },
            ];
        }
    },
    {
        key: "churn-dash", label: "Churn Dash", pieces: (f, sa) => {
            const p = f / 3;
            const hstCut = p + sa * 2 + 0.875;
            return [
                { piece: "A", desc: "Center square", cutW: p + sa * 2, cutH: p + sa * 2, qty: 1, notes: "Center" },
                { piece: "B", desc: "Side square", cutW: p + sa * 2, cutH: p + sa * 2, qty: 4, notes: "Side units — alternating fabrics" },
                { piece: "C", desc: "HST square", cutW: hstCut, cutH: hstCut, qty: 4, notes: "2 light + 2 dark → 4 HSTs" },
            ];
        }
    },
    {
        key: "square-in-square", label: "Square in a Square", pieces: (f, sa) => {
            const center = f * 0.7071; // center on-point: f / √2
            const cornerTri = center / 2 + sa * 2 + 0.875;
            return [
                { piece: "A", desc: "Center square (on-point)", cutW: center + sa * 2, cutH: center + sa * 2, qty: 1, notes: "Center, set on point" },
                { piece: "B", desc: "Corner triangle", cutW: cornerTri, cutH: cornerTri, qty: 2, notes: "Cut diag. once → 4 triangles" },
            ];
        }
    },
    {
        key: "log-cabin", label: "Log Cabin", pieces: (f, sa) => {
            const center = f / 5; // center is ~1/5 of finished block
            const strips: { piece: string; desc: string; cutW: number; cutH: number; qty: number; notes: string }[] = [
                { piece: "A", desc: "Center square", cutW: center + sa * 2, cutH: center + sa * 2, qty: 1, notes: "Center — traditionally red" },
            ];
            let logNum = 1;
            for (let round = 1; round <= 2; round++) {
                for (let side = 1; side <= 4; side++) {
                    const len = center + (logNum * center);
                    const lbl = String.fromCharCode(65 + logNum);
                    strips.push({ piece: lbl, desc: `Log ${logNum}`, cutW: len + sa * 2, cutH: center + sa * 2, qty: 1, notes: `Round ${round}, side ${side}` });
                    logNum++;
                }
            }
            return strips;
        }
    },
    {
        key: "sawtooth-star", label: "Sawtooth Star", pieces: (f, sa) => {
            const p = f / 3;
            return [
                { piece: "A", desc: "Center square", cutW: p + sa * 2, cutH: p + sa * 2, qty: 1, notes: "Star center" },
                { piece: "B", desc: "Corner square", cutW: p + sa * 2, cutH: p + sa * 2, qty: 4, notes: "Background corners" },
                { piece: "C", desc: "Star point rect", cutW: p * 2 + sa * 2 + 0.5, cutH: p + sa * 2 + 0.5, qty: 4, notes: "Flying geese units" },
                { piece: "D", desc: "Sky square", cutW: p + sa * 2 + 0.875, cutH: p + sa * 2 + 0.875, qty: 8, notes: "For star point corners" },
            ];
        }
    },
    {
        key: "hourglass", label: "Hourglass", pieces: (f, sa) => {
            const cut = f + sa * 2 + 1.25;
            return [{ piece: "A", desc: "Square (cut diag. twice)", cutW: cut, cutH: cut, qty: 2, notes: "1 light, 1 dark — yields 4 QSTs, use 2" }];
        }
    },
    {
        key: "bow-tie", label: "Bow Tie", pieces: (f, sa) => {
            const p = f / 2;
            return [
                { piece: "A", desc: "Background square", cutW: p + sa * 2, cutH: p + sa * 2, qty: 2, notes: "Background fabric" },
                { piece: "B", desc: "Bow tie square", cutW: p + sa * 2, cutH: p + sa * 2, qty: 2, notes: "Bow tie fabric" },
                { piece: "C", desc: "Connector square", cutW: p / 2 + sa * 2, cutH: p / 2 + sa * 2, qty: 2, notes: "Stitch-and-flip on bg corners" },
            ];
        }
    },
];

const PRECUTS = [
    { label: "Charm Square", w: 5, h: 5 },
    { label: "Mini Charm", w: 2.5, h: 2.5 },
    { label: "Layer Cake", w: 10, h: 10 },
    { label: "Jelly Roll Strip", w: 2.5, h: 42 },
    { label: "Fat Quarter", w: 18, h: 22 },
    { label: "Fat Eighth", w: 9, h: 22 },
];

function toFrac(v: number): string {
    const w = Math.floor(v); const f = v - w;
    const fracs: [number, string][] = [[0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
    for (const [d, sym] of fracs) { if (Math.abs(f - d) < 0.02) return w > 0 ? `${w}${sym}` : sym; }
    if (f > 0.01) return v.toFixed(2);
    return String(w);
}

/* ─── component ──────────────────────────────────── */
export default function Page() {
    const [mode, setMode] = useState<Mode>("fin2unfin");
    /* Mode 1 & 2 */
    const [blockSize, setBlockSize] = useState("12");
    const [blockW, setBlockW] = useState("12");
    const [blockH, setBlockH] = useState("12");
    const [isRect, setIsRect] = useState(false);
    const [sa, setSa] = useState("0.25");
    const [customSa, setCustomSa] = useState("");
    /* Mode 3 */
    const [blockType, setBlockType] = useState("four-patch");
    /* Mode 4 */
    const [targetSize, setTargetSize] = useState("12");
    const [actualSize, setActualSize] = useState("");
    const [numSeamsW, setNumSeamsW] = useState("2");
    const [numSeamsH, setNumSeamsH] = useState("2");
    /* Collapsibles */
    const [showPrecut, setShowPrecut] = useState(false);
    const [showRef, setShowRef] = useState(true);
    const [showEdu, setShowEdu] = useState(false);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    /* derived */
    const seamAllow = sa === "custom" ? (parseFloat(customSa) || 0.25) : parseFloat(sa);
    const totalSA = seamAllow * 2;

    /* Mode 1&2 result */
    const sizeResult = useMemo(() => {
        const w1 = isRect ? (parseFloat(blockW) || 0) : (parseFloat(blockSize) || 0);
        const h1 = isRect ? (parseFloat(blockH) || 0) : w1;
        if (w1 <= 0 || h1 <= 0) return null;
        if (mode === "fin2unfin") {
            const uw = w1 + totalSA; const uh = h1 + totalSA;
            return { finW: w1, finH: h1, unfW: uw, unfH: uh, finWcm: (w1 * 2.54).toFixed(1), finHcm: (h1 * 2.54).toFixed(1), unfWcm: (uw * 2.54).toFixed(1), unfHcm: (uh * 2.54).toFixed(1) };
        } else {
            const fw = w1 - totalSA; const fh = h1 - totalSA;
            if (fw <= 0 || fh <= 0) return null;
            return { finW: fw, finH: fh, unfW: w1, unfH: h1, finWcm: (fw * 2.54).toFixed(1), finHcm: (fh * 2.54).toFixed(1), unfWcm: (w1 * 2.54).toFixed(1), unfHcm: (h1 * 2.54).toFixed(1) };
        }
    }, [mode, blockSize, blockW, blockH, isRect, totalSA]);

    /* Mode 3 pieces */
    const pieceResult = useMemo(() => {
        const fin = parseFloat(blockSize) || 0;
        if (fin <= 0) return null;
        const bt = BLOCK_TYPES.find(b => b.key === blockType);
        if (!bt) return null;
        return { blockLabel: bt.label, pieces: bt.pieces(fin, seamAllow), fin, unfin: fin + totalSA };
    }, [blockSize, blockType, seamAllow, totalSA]);

    /* Mode 4 troubleshoot */
    const troubleResult = useMemo(() => {
        const target = parseFloat(targetSize) || 0;
        const actual = parseFloat(actualSize) || 0;
        const sw = parseFloat(numSeamsW) || 0;
        const sh = parseFloat(numSeamsH) || 0;
        if (target <= 0 || actual <= 0 || sw < 0 || sh < 0) return null;
        const diff = actual - target;
        const avgSeams = (sw + sh) / 2;
        const perSeamError = avgSeams > 0 ? diff / avgSeams : 0;
        const likelySA = seamAllow - perSeamError / 2;
        const correctedCut = target + likelySA * 2;
        return { target, actual, diff, perSeamError, likelySA, correctedCut, seamsW: sw, seamsH: sh };
    }, [targetSize, actualSize, numSeamsW, numSeamsH, seamAllow]);

    /* Pre-cut results */
    const precutResults = PRECUTS.map(p => ({
        ...p,
        finW: p.w - totalSA,
        finH: p.h - totalSA,
    }));

    /* Quick ref table */
    const refTable = FINISHED_PRESETS.map(f => ({
        fin: f, unfin: f + totalSA, finCm: (f * 2.54).toFixed(1), unfinCm: ((f + totalSA) * 2.54).toFixed(1),
    }));

    const copyText = sizeResult
        ? `Block: ${toFrac(sizeResult.finW)}" finished = ${toFrac(sizeResult.unfW)}" unfinished (${toFrac(seamAllow)}" SA)`
        : pieceResult
            ? `${pieceResult.blockLabel} ${toFrac(pieceResult.fin)}" finished: ${pieceResult.pieces.map(p => `${p.piece}: ${toFrac(p.cutW)}" × ${toFrac(p.cutH)}" ×${p.qty}`).join(", ")}`
            : "";

    /* FAQ */
    const faqItems = [
        { q: "What is the difference between finished and unfinished quilt block size?", a: "Finished size is the size of the block after it's sewn into the quilt — the visible size. Unfinished size is the cutting size (larger) which includes seam allowances on all sides. With ¼\" seam allowance, unfinished = finished + ½\"." },
        { q: "How do I calculate unfinished block size?", a: "Add your seam allowance to each side. With standard ¼\" seam allowance: Unfinished = Finished + (¼\" × 2) = Finished + ½\". Example: a 12\" finished block is 12½\" unfinished." },
        { q: "Why are my quilt blocks not the right size?", a: "The most common cause is inaccurate seam allowance. Even 1/32\" off per seam multiplies across the block. Other causes: inaccurate cutting, pressing too hard (stretching), or not accounting for fabric grain." },
        { q: "What is a scant quarter inch seam allowance?", a: "A scant ¼\" is just slightly less than ¼\" — about 1 thread width narrower. This compensates for the tiny bit of fabric taken up when pressing the seam to one side, helping blocks finish at the correct size." },
        { q: "How do I resize a quilt block?", a: "Calculate the scaling percentage (new size ÷ old size × 100). Apply that percentage to every piece in the block. Check if the new sizes are ruler-friendly — sizes that align with ⅛\" markings are easiest to cut." },
        { q: "What size do I cut for a 12-inch quilt block?", a: "With standard ¼\" seam allowance, cut the overall block at 12½\" × 12½\" unfinished. Individual pieces within the block depend on the block design — use the Block Pieces mode to see all piece sizes." },
        { q: "What finished size do I get from a 5-inch charm square?", a: "With standard ¼\" seam allowance, a 5\" charm square finishes at 4½\" × 4½\". If making HSTs from a charm square, each HST would finish at approximately 4\" × 4\"." },
        { q: "How do I figure out all the piece sizes for a quilt block?", a: "Use this calculator's Block Pieces mode. Select your block type (Nine-Patch, HST, Flying Geese, etc.), enter your desired finished block size, and the tool calculates every piece's cutting size." },
        { q: "What does 'unfinished block size' mean on a pattern?", a: "It means the size the block should measure after sewing but before joining to other blocks. It includes the seam allowances that will be consumed when joining blocks together into the quilt top." },
        { q: "How do I fix blocks that are coming out too small?", a: "First, test your seam allowance: sew three 1½\" strips together — the result should measure exactly 3½\". If it's smaller, your seam is too wide. Adjust your needle position or use a ¼\" presser foot." },
    ];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Quilt Tools", href: "/quilt" }, { label: "Block Size Calculator" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    {/* HEADER */}
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Quilt #132</span>
                        <h1>Quilt Block Size Calculator</h1>
                        <p>Calculate finished and unfinished block sizes, all piece sizes for any block type, and troubleshoot sizing issues.</p>
                    </div>

                    {/* MODE TABS */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 6, marginBottom: 16 }}>
                        {MODES.map(m => (
                            <button key={m.key} className={`btn btn-sm ${mode === m.key ? "btn-primary" : "btn-secondary"}`}
                                onClick={() => setMode(m.key)} style={{ textAlign: "left", padding: "10px 14px", height: "auto" }}>
                                <div style={{ fontWeight: 600, fontSize: 13 }}>{m.label}</div>
                                <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>{m.desc}</div>
                            </button>
                        ))}
                    </div>

                    {/* ═══ MODE 1 & 2: SIZE CONVERSION ═══ */}
                    {(mode === "fin2unfin" || mode === "unfin2fin") && (<>
                        <div className={`glass-card ${styles.calculatorCard}`}>
                            <h2 className={styles.calcTitle}>
                                {mode === "fin2unfin" ? "① Enter Finished Block Size" : "① Enter Unfinished (Cutting) Size"}
                            </h2>
                            {/* Presets */}
                            {!isRect && (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                                    {(mode === "fin2unfin" ? FINISHED_PRESETS : FINISHED_PRESETS.map(f => f + totalSA)).map((v, i) => (
                                        <button key={i} className={`btn btn-sm ${parseFloat(blockSize) === v ? "btn-primary" : "btn-secondary"}`}
                                            onClick={() => setBlockSize(String(v))}>{toFrac(v)}&quot;</button>
                                    ))}
                                </div>
                            )}
                            <label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 13, marginBottom: 10, color: "var(--color-text-secondary)" }}>
                                <input type="checkbox" checked={isRect} onChange={e => setIsRect(e.target.checked)} />
                                Rectangular block (different width and height)
                            </label>
                            <div className="calculator-form">
                                {isRect ? (
                                    <div className="calculator-form-row">
                                        <div className="input-group"><label className="input-label">Width (inches)</label>
                                            <input type="number" className="input-field" value={blockW} onChange={e => setBlockW(e.target.value)} min={0.5} step={0.25} /></div>
                                        <div className="input-group"><label className="input-label">Height (inches)</label>
                                            <input type="number" className="input-field" value={blockH} onChange={e => setBlockH(e.target.value)} min={0.5} step={0.25} /></div>
                                    </div>
                                ) : (
                                    <div className="calculator-form-row" style={{ maxWidth: 300 }}>
                                        <div className="input-group"><label className="input-label">
                                            {mode === "fin2unfin" ? "Finished size (inches)" : "Unfinished size (inches)"}
                                        </label>
                                            <input type="number" className="input-field" value={blockSize} onChange={e => setBlockSize(e.target.value)} min={0.5} step={0.25} /></div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* SEAM ALLOWANCE */}
                        <div className={`glass-card ${styles.calculatorCard}`}>
                            <h2 className={styles.calcTitle}>② Seam Allowance</h2>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                                {SA_OPTIONS.map(o => (
                                    <button key={o.value} className={`btn btn-sm ${parseFloat(sa) === o.value && sa !== "custom" ? "btn-primary" : "btn-secondary"}`}
                                        onClick={() => setSa(String(o.value))}>{o.label}</button>
                                ))}
                                <button className={`btn btn-sm ${sa === "custom" ? "btn-primary" : "btn-secondary"}`}
                                    onClick={() => setSa("custom")}>Custom</button>
                            </div>
                            {sa === "custom" && (
                                <div className="input-group" style={{ maxWidth: 200 }}>
                                    <input type="number" className="input-field" placeholder="e.g., 0.3125" value={customSa} onChange={e => setCustomSa(e.target.value)} min={0.0625} step={0.0625} />
                                </div>
                            )}
                            <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 6 }}>
                                <Info size={12} style={{ display: "inline", marginRight: 4 }} />
                                Seam allowance is added to each side: {toFrac(seamAllow)}&quot; × 2 sides = {toFrac(totalSA)}&quot; total per dimension.
                            </div>
                        </div>

                        {/* RESULTS */}
                        {sizeResult && (
                            <div className={`calculator-results ${styles.results}`}>
                                <div className="result-card">
                                    <div className="result-value">
                                        {mode === "fin2unfin"
                                            ? <>{toFrac(sizeResult.unfW)}&quot;{sizeResult.unfW !== sizeResult.unfH && ` × ${toFrac(sizeResult.unfH)}"`} unfinished</>
                                            : <>{toFrac(sizeResult.finW)}&quot;{sizeResult.finW !== sizeResult.finH && ` × ${toFrac(sizeResult.finH)}"`} finished</>
                                        }
                                    </div>
                                    <div className="result-label">
                                        {mode === "fin2unfin"
                                            ? `From ${toFrac(sizeResult.finW)}"${sizeResult.finW !== sizeResult.finH ? ` × ${toFrac(sizeResult.finH)}"` : ""} finished + ${toFrac(seamAllow)}" SA each side`
                                            : `From ${toFrac(sizeResult.unfW)}"${sizeResult.unfW !== sizeResult.unfH ? ` × ${toFrac(sizeResult.unfH)}"` : ""} unfinished − ${toFrac(seamAllow)}" SA each side`
                                        }
                                    </div>
                                </div>
                                <div className={styles.resultDetails}>
                                    <div className={styles.resultRow}><span>Finished size</span><strong>{toFrac(sizeResult.finW)}&quot;{sizeResult.finW !== sizeResult.finH ? ` × ${toFrac(sizeResult.finH)}"` : ""}</strong></div>
                                    <div className={styles.resultRow}><span>Unfinished (cutting) size</span><strong>{toFrac(sizeResult.unfW)}&quot;{sizeResult.unfW !== sizeResult.unfH ? ` × ${toFrac(sizeResult.unfH)}"` : ""}</strong></div>
                                    <div className={styles.resultRow}><span>Seam allowance</span><strong>{toFrac(seamAllow)}&quot; each side ({toFrac(totalSA)}&quot; total)</strong></div>
                                    <div className={styles.resultRow}><span>Metric — finished</span><strong>{sizeResult.finWcm}{sizeResult.finWcm !== sizeResult.finHcm ? ` × ${sizeResult.finHcm}` : ""} cm</strong></div>
                                    <div className={styles.resultRow}><span>Metric — unfinished</span><strong>{sizeResult.unfWcm}{sizeResult.unfWcm !== sizeResult.unfHcm ? ` × ${sizeResult.unfHcm}` : ""} cm</strong></div>
                                </div>
                                {/* Formula */}
                                <div style={{ background: "var(--color-bg-secondary)", padding: 12, borderRadius: "var(--radius-md)", fontSize: 13, marginTop: 12, fontFamily: "var(--font-mono, monospace)" }}>
                                    {mode === "fin2unfin"
                                        ? `Unfinished = Finished + (SA × 2) = ${toFrac(sizeResult.finW)}" + (${toFrac(seamAllow)}" × 2) = ${toFrac(sizeResult.unfW)}"`
                                        : `Finished = Unfinished − (SA × 2) = ${toFrac(sizeResult.unfW)}" − (${toFrac(seamAllow)}" × 2) = ${toFrac(sizeResult.finW)}"`
                                    }
                                </div>
                            </div>
                        )}
                    </>)}

                    {/* ═══ MODE 3: BLOCK PIECE CALCULATOR ═══ */}
                    {mode === "piece" && (<>
                        <div className={`glass-card ${styles.calculatorCard}`}>
                            <h2 className={styles.calcTitle}>① Block Type</h2>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                                {BLOCK_TYPES.map(bt => (
                                    <button key={bt.key} className={`btn btn-sm ${blockType === bt.key ? "btn-primary" : "btn-secondary"}`}
                                        onClick={() => setBlockType(bt.key)}>{bt.label}</button>
                                ))}
                            </div>
                        </div>

                        <div className={`glass-card ${styles.calculatorCard}`}>
                            <h2 className={styles.calcTitle}>② Finished Block Size</h2>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                                {[3, 4, 6, 8, 9, 10, 12, 15, 18].map(v => (
                                    <button key={v} className={`btn btn-sm ${parseFloat(blockSize) === v ? "btn-primary" : "btn-secondary"}`}
                                        onClick={() => setBlockSize(String(v))}>{v}&quot;</button>
                                ))}
                            </div>
                            <div className="calculator-form-row" style={{ maxWidth: 300 }}>
                                <div className="input-group"><label className="input-label">Finished block size (inches)</label>
                                    <input type="number" className="input-field" value={blockSize} onChange={e => setBlockSize(e.target.value)} min={1} step={0.5} /></div>
                            </div>
                        </div>

                        <div className={`glass-card ${styles.calculatorCard}`}>
                            <h2 className={styles.calcTitle}>③ Seam Allowance</h2>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                {SA_OPTIONS.map(o => (
                                    <button key={o.value} className={`btn btn-sm ${parseFloat(sa) === o.value && sa !== "custom" ? "btn-primary" : "btn-secondary"}`}
                                        onClick={() => setSa(String(o.value))}>{o.label}</button>
                                ))}
                            </div>
                        </div>

                        {/* PIECE RESULTS */}
                        {pieceResult && (
                            <div className={`calculator-results ${styles.results}`}>
                                <div className="result-card">
                                    <div className="result-value">{pieceResult.blockLabel} — {toFrac(pieceResult.fin)}&quot; finished</div>
                                    <div className="result-label">Unfinished: {toFrac(pieceResult.unfin)}&quot; · SA: {toFrac(seamAllow)}&quot;</div>
                                </div>
                                <div className={styles.tableWrap} style={{ marginTop: 12 }}>
                                    <table className={styles.convTable}>
                                        <thead><tr><th>Piece</th><th>Description</th><th>Cut Size</th><th>Qty</th><th>Notes</th></tr></thead>
                                        <tbody>
                                            {pieceResult.pieces.map((p, i) => (
                                                <tr key={i}>
                                                    <td style={{ fontWeight: 700, color: "var(--color-accent-primary)" }}>{p.piece}</td>
                                                    <td>{p.desc}</td>
                                                    <td style={{ fontWeight: 600, fontFamily: "inherit", whiteSpace: "nowrap" }}>{toFrac(p.cutW)}&quot;{p.cutW !== p.cutH ? ` × ${toFrac(p.cutH)}"` : ` × ${toFrac(p.cutH)}"`}</td>
                                                    <td style={{ fontWeight: 600 }}>{p.qty}</td>
                                                    <td style={{ fontSize: 12 }}>{p.notes}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {pieceResult.pieces.some(p => p.cutW < 1.5 || p.cutH < 1.5) && (
                                    <div style={{ fontSize: 12, color: "hsl(35,80%,45%)", marginTop: 8 }}>
                                        <AlertTriangle size={12} style={{ display: "inline", marginRight: 4 }} />
                                        Some pieces are very small — these can be tricky to handle. Consider a larger finished block size.
                                    </div>
                                )}
                            </div>
                        )}
                    </>)}

                    {/* ═══ MODE 4: TROUBLESHOOT ═══ */}
                    {mode === "troubleshoot" && (<>
                        <div className={`glass-card ${styles.calculatorCard}`}>
                            <h2 className={styles.calcTitle}>① Enter Your Block Measurements</h2>
                            <div className="calculator-form">
                                <div className="calculator-form-row">
                                    <div className="input-group"><label className="input-label">Target finished size (inches)</label>
                                        <input type="number" className="input-field" value={targetSize} onChange={e => setTargetSize(e.target.value)} min={1} step={0.125} /></div>
                                    <div className="input-group"><label className="input-label">Actual finished size (inches)</label>
                                        <input type="number" className="input-field" placeholder="measure your block" value={actualSize} onChange={e => setActualSize(e.target.value)} min={0.5} step={0.125} /></div>
                                </div>
                                <div className="calculator-form-row">
                                    <div className="input-group"><label className="input-label">Seams across width</label>
                                        <input type="number" className="input-field" value={numSeamsW} onChange={e => setNumSeamsW(e.target.value)} min={0} /></div>
                                    <div className="input-group"><label className="input-label">Seams across height</label>
                                        <input type="number" className="input-field" value={numSeamsH} onChange={e => setNumSeamsH(e.target.value)} min={0} /></div>
                                </div>
                                <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 4 }}>
                                    <Info size={12} style={{ display: "inline", marginRight: 4 }} />
                                    A Nine-Patch has 2 seams across each direction. A Four-Patch has 1 seam.
                                </div>
                                <div style={{ marginTop: 12 }}>
                                    <label className="input-label" style={{ marginBottom: 6, display: "block" }}>Intended seam allowance</label>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                        {SA_OPTIONS.map(o => (
                                            <button key={o.value} className={`btn btn-sm ${parseFloat(sa) === o.value && sa !== "custom" ? "btn-primary" : "btn-secondary"}`}
                                                onClick={() => setSa(String(o.value))}>{o.label}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {troubleResult && troubleResult.actual > 0 && (
                            <div className={`calculator-results ${styles.results}`}>
                                <div className="result-card" style={{ background: troubleResult.diff === 0 ? "hsl(140,50%,95%)" : "hsl(0,50%,95%)" }}>
                                    <div className="result-value" style={{ color: troubleResult.diff === 0 ? "hsl(140,50%,30%)" : "hsl(0,50%,40%)" }}>
                                        {troubleResult.diff === 0 ? "✓ Your blocks are the correct size!" :
                                            `${Math.abs(troubleResult.diff).toFixed(3)}" ${troubleResult.diff < 0 ? "too small" : "too large"}`}
                                    </div>
                                    <div className="result-label">{troubleResult.target}&quot; target → {troubleResult.actual}&quot; actual</div>
                                </div>
                                {troubleResult.diff !== 0 && (
                                    <div className={styles.resultDetails}>
                                        <div className={styles.resultRow}><span>Size difference</span><strong>{troubleResult.diff > 0 ? "+" : ""}{troubleResult.diff.toFixed(3)}&quot;</strong></div>
                                        <div className={styles.resultRow}><span>Error per seam</span><strong>{troubleResult.perSeamError > 0 ? "+" : ""}{troubleResult.perSeamError.toFixed(4)}&quot;</strong></div>
                                        <div className={styles.resultRow}><span>Likely actual SA</span><strong>~{troubleResult.likelySA.toFixed(4)}&quot; (target: {toFrac(seamAllow)}&quot;)</strong></div>
                                        <div className={styles.resultRow}><span>Corrected cut size</span><strong>{toFrac(parseFloat(troubleResult.correctedCut.toFixed(3)))}&quot;</strong></div>
                                    </div>
                                )}
                                {troubleResult.diff !== 0 && (
                                    <div style={{ background: "var(--color-bg-secondary)", padding: 14, borderRadius: "var(--radius-md)", fontSize: 13, marginTop: 12, lineHeight: 1.8 }}>
                                        <strong>Diagnosis:</strong>
                                        {troubleResult.diff < 0 ? (
                                            <><br />Your blocks are <strong>{Math.abs(troubleResult.diff).toFixed(3)}&quot; too small</strong>.
                                                This suggests your seam allowance is about <strong>{troubleResult.likelySA.toFixed(3)}&quot;</strong> instead of {toFrac(seamAllow)}&quot;.
                                                <br /><br /><strong>Fix options:</strong>
                                                <br />1. Adjust your seam to exactly {toFrac(seamAllow)}&quot; (use a ¼&quot; foot or guide)
                                                <br />2. Or cut pieces at {toFrac(parseFloat(troubleResult.correctedCut.toFixed(3)))}&quot; to compensate</>
                                        ) : (
                                            <><br />Your blocks are <strong>{troubleResult.diff.toFixed(3)}&quot; too large</strong>.
                                                This suggests your seam allowance is narrower than {toFrac(seamAllow)}&quot;.
                                                <br /><br /><strong>Fix options:</strong>
                                                <br />1. Widen your seam slightly toward {toFrac(seamAllow)}&quot;
                                                <br />2. Or trim blocks to {toFrac(troubleResult.target + totalSA)}&quot; unfinished before joining</>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Seam test guide */}
                        <div className={`glass-card ${styles.calculatorCard}`}>
                            <h2 className={styles.calcTitle}>🧪 Seam Allowance Test</h2>
                            <div style={{ fontSize: 14, lineHeight: 1.9, color: "var(--color-text-secondary)" }}>
                                <ol style={{ paddingLeft: 20 }}>
                                    <li>Cut 3 strips exactly <strong>1½&quot;</strong> wide</li>
                                    <li>Sew them together with your normal seam</li>
                                    <li>Press seams to one side</li>
                                    <li>Measure across: should be exactly <strong>3½&quot;</strong></li>
                                </ol>
                                <div style={{ marginTop: 6, fontSize: 13, color: "var(--color-text-tertiary)" }}>
                                    • Less than 3½&quot; → seam is too wide<br />
                                    • More than 3½&quot; → seam is too narrow<br />
                                    • Adjust until you consistently hit 3½&quot;
                                </div>
                            </div>
                        </div>
                    </>)}

                    {/* ═══ COMMON SECTIONS ═══ */}
                    {/* TOOLBAR */}
                    {(sizeResult || pieceResult) && (
                        <div className="toolbar" style={{ marginBottom: 16 }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(copyText)}>
                                <ClipboardCopy size={13} /> Copy
                            </button>
                            <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
                                <Printer size={13} /> Print
                            </button>
                        </div>
                    )}

                    {/* PRE-CUT COMPATIBILITY */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
                            onClick={() => setShowPrecut(!showPrecut)}>
                            🧩 Pre-Cut Fabric → Finished Block Size <ChevronDown size={14} style={{ transform: showPrecut ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                        </button>
                        {showPrecut && (
                            <div className={styles.tableWrap} style={{ marginTop: 12 }}>
                                <table className={styles.convTable}>
                                    <thead><tr><th>Pre-Cut</th><th>Size</th><th>Finished Block</th><th>Notes</th></tr></thead>
                                    <tbody>
                                        {precutResults.map((p, i) => (
                                            <tr key={i}>
                                                <td style={{ fontWeight: 600, fontFamily: "inherit" }}>{p.label}</td>
                                                <td>{p.w}&quot; × {p.h}&quot;</td>
                                                <td style={{ fontWeight: 600 }}>{toFrac(p.finW)}&quot; × {toFrac(p.finH)}&quot;</td>
                                                <td style={{ fontSize: 12 }}>{p.finW < 2 ? "Very small" : p.finW > 15 ? "Large block" : "Standard"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 6 }}>
                                    Based on {toFrac(seamAllow)}&quot; seam allowance. One pre-cut = one plain block.
                                </div>
                            </div>
                        )}
                    </div>

                    {/* COMMON BLOCK SIZES REFERENCE */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
                            onClick={() => setShowRef(!showRef)}>
                            📐 Common Block Sizes Reference <ChevronDown size={14} style={{ transform: showRef ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                        </button>
                        {showRef && (
                            <div className={styles.tableWrap} style={{ marginTop: 12 }}>
                                <table className={styles.convTable}>
                                    <thead><tr><th>Finished</th><th>Unfinished</th><th>Metric (fin)</th><th>Metric (unfin)</th></tr></thead>
                                    <tbody>
                                        {refTable.map((r, i) => (
                                            <tr key={i} style={sizeResult && Math.abs(sizeResult.finW - r.fin) < 0.01 ? { background: "var(--color-accent-light)" } : undefined}>
                                                <td style={{ fontWeight: 600, fontFamily: "inherit" }}>{toFrac(r.fin)}&quot;</td>
                                                <td style={{ fontWeight: 600 }}>{toFrac(r.unfin)}&quot;</td>
                                                <td>{r.finCm} cm</td>
                                                <td>{r.unfinCm} cm</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 6 }}>
                                    Based on {toFrac(seamAllow)}&quot; seam allowance ({toFrac(totalSA)}&quot; total per dimension).
                                </div>
                            </div>
                        )}
                    </div>

                    {/* EDUCATIONAL CONTENT */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between" }}
                            onClick={() => setShowEdu(!showEdu)}>
                            📚 Understanding Block Sizes <ChevronDown size={14} style={{ transform: showEdu ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                        </button>
                        {showEdu && (
                            <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
                                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: "var(--color-text-primary)" }}>Finished vs Unfinished Size</h3>
                                <p><strong>Finished size</strong> = the size of the block AFTER it&apos;s sewn into the quilt top. This is the visible size in the completed quilt.</p>
                                <p><strong>Unfinished size</strong> = the size you CUT the block, before sewing. It&apos;s larger because it includes seam allowances on all four sides.</p>
                                <p>With the standard ¼&quot; seam allowance: <strong>Unfinished = Finished + ½&quot;</strong> (¼&quot; on each side).</p>
                                <h3 style={{ fontSize: 15, fontWeight: 600, margin: "14px 0 6px", color: "var(--color-text-primary)" }}>Why Accuracy Matters</h3>
                                <p>If each seam is just 1/32&quot; off and your block has 10 seams, you&apos;ll be 10/32&quot; (over 5/16&quot;) off on the final block. Across a whole quilt with dozens of blocks, small errors compound into big problems — seams that don&apos;t align, borders that don&apos;t fit, and a quilt that won&apos;t lie flat.</p>
                                <h3 style={{ fontSize: 15, fontWeight: 600, margin: "14px 0 6px", color: "var(--color-text-primary)" }}>The Scant Quarter Inch</h3>
                                <p>Many experienced quilters use a &quot;scant ¼&quot;&quot; — just a thread width less than ¼&quot;. This compensates for the tiny bit of fabric taken up when pressing seams to one side, helping blocks finish at the exact correct size.</p>
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
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Key Formula</h4>
                        <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.8, fontFamily: "var(--font-mono, monospace)" }}>
                            <div>Unfinished = Finished + SA×2</div>
                            <div style={{ marginTop: 6 }}>With ¼&quot; SA:</div>
                            <div style={{ fontWeight: 600, color: "var(--color-accent-primary)" }}>Unfin = Fin + ½&quot;</div>
                        </div>
                    </div>
                    <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Most Popular Sizes</h4>
                        <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.8 }}>
                            <div>12&quot; finished (12½&quot; unfin) ★</div>
                            <div>6&quot; finished (6½&quot; unfin)</div>
                            <div>10&quot; finished (10½&quot; unfin)</div>
                            <div>9&quot; finished (9½&quot; unfin)</div>
                        </div>
                    </div>
                    <div className="glass-card related-tools">
                        <h4>Related Tools</h4>
                        <a href="/quilt/blocks-needed" className="related-tool-link">Blocks Needed Calculator</a>
                        <a href="/quilt/size-calculator" className="related-tool-link">Quilt Size Calculator</a>
                        <a href="/quilt/hst-calculator" className="related-tool-link">HST Calculator</a>
                        <a href="/quilt/flying-geese-calculator" className="related-tool-link">Flying Geese Calculator</a>
                        <a href="/quilt/nine-patch-calculator" className="related-tool-link">Nine-Patch Calculator</a>
                        <a href="/quilt" className="related-tool-link">All Quilt Tools</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}