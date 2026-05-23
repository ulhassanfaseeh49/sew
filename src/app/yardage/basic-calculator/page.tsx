"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { ClipboardCopy, Printer, Ruler, Plus, Trash2, Info, ChevronDown } from "lucide-react";

/* ─── constants ─────────────────────────────────────── */
const FABRIC_WIDTHS = [
    { label: '36"', value: 36 },
    { label: '44/45"', value: 44.5 },
    { label: '54"', value: 54 },
    { label: '60"', value: 60 },
    { label: '72"', value: 72 },
    { label: '90"', value: 90 },
    { label: '108"', value: 108 },
];

const SHRINKAGE: Record<string, { label: string; pct: number; note: string }> = {
    none: { label: "None", pct: 0, note: "No shrinkage buffer." },
    cotton: { label: "Cotton", pct: 8, note: "Cotton shrinks 3-5%. We add 8% for shrinkage + grain straightening." },
    linen: { label: "Linen", pct: 10, note: "Linen can shrink 5-10%. Adding 10% buffer." },
    wool: { label: "Wool", pct: 8, note: "Wool shrinks 3-5% depending on weave." },
    silk: { label: "Silk", pct: 5, note: "Silk has minimal shrinkage, 3-5% buffer." },
    polyester: { label: "Polyester", pct: 2, note: "Synthetics barely shrink. 2% safety buffer." },
    rayon: { label: "Rayon", pct: 10, note: "Rayon/viscose shrinks significantly — 8-10%." },
    denim: { label: "Denim", pct: 10, note: "Denim can shrink 5-10%, especially raw/unwashed." },
    knit: { label: "Knit", pct: 8, note: "Knits vary; 5-8% is typical for cotton knits." },
};

type Mode = "dimensions" | "project" | "reverse" | "multi";

interface Piece { name: string; w: string; l: string; qty: string }

const PROJECT_DATA: { cat: string; items: { name: string; y44: number; y60: number; note?: string }[] }[] = [
    {
        cat: "Garments", items: [
            { name: "Simple T-shirt (S–L)", y44: 1.5, y60: 1.25 },
            { name: "Simple T-shirt (XL–XXL)", y44: 1.75, y60: 1.5 },
            { name: "Blouse with sleeves (S–L)", y44: 2, y60: 1.75 },
            { name: "Dress, sleeveless (S–L)", y44: 2.5, y60: 2 },
            { name: "Dress with sleeves (S–L)", y44: 3, y60: 2.5 },
            { name: "Skirt, knee (S–L)", y44: 1.5, y60: 1.25 },
            { name: "Skirt, maxi (S–L)", y44: 2.5, y60: 2 },
            { name: "Pants / Jeans (S–L)", y44: 2, y60: 1.75 },
            { name: "Shorts (S–L)", y44: 1, y60: 0.75 },
            { name: "Jacket (S–L)", y44: 3, y60: 2.5 },
            { name: "Full coat (S–L)", y44: 4, y60: 3.5 },
        ]
    },
    {
        cat: "Home Décor", items: [
            { name: "Pillow cover 18\"", y44: 0.5, y60: 0.5 },
            { name: "Pillow cover 24\"", y44: 0.75, y60: 0.75 },
            { name: "Tablecloth 60×90\"", y44: 2.5, y60: 1.75 },
            { name: "Curtain panel 54\" H", y44: 1.75, y60: 1.75 },
            { name: "Curtain panel 84\" H", y44: 2.5, y60: 2.5 },
            { name: "Duvet cover (Queen)", y44: 5.5, y60: 4 },
        ]
    },
    {
        cat: "Bags & Accessories", items: [
            { name: "Tote bag", y44: 1, y60: 0.75 },
            { name: "Backpack", y44: 2, y60: 1.5 },
            { name: "Zippered pouch", y44: 0.25, y60: 0.25 },
            { name: "Large tote with pockets", y44: 1.5, y60: 1.25 },
        ]
    },
    {
        cat: "Quilting", items: [
            { name: "Baby quilt top", y44: 1.5, y60: 1.25, note: "Per fabric" },
            { name: "Throw quilt top", y44: 3, y60: 2.5, note: "Per fabric" },
            { name: "Queen quilt top", y44: 5, y60: 4.5, note: "Per fabric" },
            { name: "Quilt backing (Queen)", y44: 5.5, y60: 3.25 },
        ]
    },
    {
        cat: "Baby & Kids", items: [
            { name: "Baby onesie", y44: 0.5, y60: 0.4 },
            { name: "Baby dress", y44: 0.75, y60: 0.6 },
            { name: "Baby bib", y44: 0.25, y60: 0.25 },
            { name: "Receiving blanket", y44: 1, y60: 1 },
        ]
    },
];

/* ─── helpers ──────────────────────────────────────── */
function toFraction(y: number): string {
    const neg = y < 0;
    const abs = Math.abs(y);
    const whole = Math.floor(abs);
    const frac = abs - whole;
    const fracs: [number, string][] = [[0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
    const sign = neg ? "-" : "";
    for (const [v, s] of fracs) {
        if (Math.abs(frac - v) < 0.02) return whole > 0 ? `${sign}${whole}${s}` : `${sign}${s}`;
    }
    if (frac > 0.01) return `${sign}${abs.toFixed(2)}`;
    return `${sign}${whole}`;
}
function roundUp8(v: number) { return Math.ceil(v * 8) / 8; }
function ydsToM(y: number) { return (y * 0.9144).toFixed(2); }

/* ─── component ────────────────────────────────────── */
export default function Page() {
    const [mode, setMode] = useState<Mode>("dimensions");
    /* Mode 1 state */
    const [inputMode, setInputMode] = useState<"simple" | "pieces">("simple");
    const [totalLength, setTotalLength] = useState("");
    const [lengthUnit, setLengthUnit] = useState<"in" | "cm">("in");
    const [pieces, setPieces] = useState<Piece[]>([{ name: "", w: "", l: "", qty: "1" }]);
    const [fabricWidthIdx, setFabricWidthIdx] = useState(1);
    const [saMode, setSaMode] = useState<"none" | "add">("none");
    const [saVal, setSaVal] = useState("0.625");
    const [shrinkType, setShrinkType] = useState("none");
    const [customShrink, setCustomShrink] = useState("");
    const [hasRepeat, setHasRepeat] = useState(false);
    const [repeatV, setRepeatV] = useState("");
    const [directional, setDirectional] = useState(false);
    const [dirExtra, setDirExtra] = useState("15");
    const [quantity, setQuantity] = useState("1");
    const [pricePerYd, setPricePerYd] = useState("");
    /* Collapsibles */
    const [showSA, setShowSA] = useState(false);
    const [showShrink, setShowShrink] = useState(false);
    const [showRepeat, setShowRepeat] = useState(false);
    const [showQty, setShowQty] = useState(false);
    /* Mode 3 — reverse */
    const [revAmount, setRevAmount] = useState("");
    const [revWidth, setRevWidth] = useState(1);
    const [revUnit, setRevUnit] = useState<"yd" | "m">("yd");
    /* FAQ */
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    /* Quick ref filter */
    const [refCat, setRefCat] = useState("All");

    /* derived */
    const fw = FABRIC_WIDTHS[fabricWidthIdx].value;
    const sa = saMode === "add" ? (parseFloat(saVal) || 0) : 0;
    const shrinkPct = shrinkType === "none" ? 0 : (customShrink !== "" ? (parseFloat(customShrink) || 0) : SHRINKAGE[shrinkType]?.pct ?? 0);
    const repeatLen = hasRepeat ? (parseFloat(repeatV) || 0) : 0;
    const dirPct = directional ? (parseFloat(dirExtra) || 0) : 0;
    const qty = Math.max(1, parseInt(quantity) || 1);
    const price = parseFloat(pricePerYd) || 0;

    /* ── Mode 1 calculation ────── */
    const mode1Result = useMemo(() => {
        let rawLengthIn = 0;
        let piecesAcross = 0;
        let rows = 0;
        let cutL = 0, cutW = 0;
        let totalPcs = 0;

        if (inputMode === "simple") {
            const tl = parseFloat(totalLength) || 0;
            if (tl <= 0) return null;
            rawLengthIn = lengthUnit === "cm" ? tl / 2.54 : tl;
        } else {
            const validPieces = pieces.filter(p => (parseFloat(p.l) || 0) > 0 && (parseFloat(p.w) || 0) > 0);
            if (validPieces.length === 0) return null;
            let totalLen = 0;
            for (const p of validPieces) {
                const pl = parseFloat(p.l) || 0;
                const pw = parseFloat(p.w) || 0;
                const pq = Math.max(1, parseInt(p.qty) || 1);
                cutL = pl + sa * 2;
                cutW = pw + sa * 2;
                const across = cutW > 0 ? Math.floor(fw / cutW) : 0;
                if (across <= 0) { totalLen += cutL * pq; continue; }
                const r = Math.ceil(pq / across);
                totalLen += r * cutL;
                piecesAcross += across;
                rows += r;
                totalPcs += pq;
            }
            rawLengthIn = totalLen;
        }

        // add pattern repeat
        if (repeatLen > 0 && inputMode === "pieces") {
            rawLengthIn += repeatLen * (rows || 1);
        } else if (repeatLen > 0) {
            rawLengthIn += repeatLen;
        }

        // directional add
        if (dirPct > 0) rawLengthIn *= (1 + dirPct / 100);

        // to yards
        let rawYards = rawLengthIn / 36;

        // shrinkage
        rawYards *= (1 + shrinkPct / 100);

        // quantity
        rawYards *= qty;

        const rounded = roundUp8(rawYards);
        const widthComp = FABRIC_WIDTHS.map(f => {
            const adj = (rawYards * fw) / f.value;
            return { label: f.label, value: f.value, yards: roundUp8(adj), diff: roundUp8(adj) - rounded };
        });

        return { rawLengthIn: rawLengthIn / qty, rawYards, rounded, widthComp, piecesAcross, rows, totalPcs, cutL, cutW };
    }, [inputMode, totalLength, lengthUnit, pieces, fw, sa, shrinkPct, repeatLen, dirPct, qty]);

    /* ── Mode 3 reverse calc ────── */
    const reverseResult = useMemo(() => {
        let amtYds = parseFloat(revAmount) || 0;
        if (amtYds <= 0) return null;
        if (revUnit === "m") amtYds /= 0.9144;
        const rfw = FABRIC_WIDTHS[revWidth].value;
        const allItems = PROJECT_DATA.flatMap(c => c.items.map(it => ({ ...it, cat: c.cat })));
        const getYd = (it: typeof allItems[0]) => rfw >= 58 ? it.y60 : it.y44 * (44.5 / rfw);
        const can = allItems.filter(it => getYd(it) <= amtYds * 0.9);
        const tight = allItems.filter(it => { const need = getYd(it); return need > amtYds * 0.9 && need <= amtYds * 1.05; });
        const no = allItems.filter(it => getYd(it) > amtYds * 1.05);
        return { can, tight, no, amtYds, rfw };
    }, [revAmount, revUnit, revWidth]);

    /* piece helpers */
    function addPiece() { if (pieces.length < 20) setPieces([...pieces, { name: "", w: "", l: "", qty: "1" }]); }
    function removePiece(i: number) { setPieces(pieces.filter((_, idx) => idx !== i)); }
    function updatePiece(i: number, field: keyof Piece, val: string) {
        const np = [...pieces]; np[i] = { ...np[i], [field]: val }; setPieces(np);
    }

    const copyText = mode1Result ? `Need ${toFraction(mode1Result.rounded)} yards of ${fw}" fabric` : "";

    /* ─── FAQ ─────────────────── */
    const faqItems = [
        { q: "How do I calculate how much fabric I need?", a: "Measure the total length of all your fabric pieces along the fabric's length, then divide by 36 to convert inches to yards. Account for seam allowances, shrinkage (especially cotton and linen), pattern matching for repeats, and a safety buffer. Our calculator handles all of these automatically." },
        { q: "How much fabric do I need for a dress?", a: "For 44\" fabric: sleeveless shift (S–L): 2–2.5 yards, short sleeves: 2.5–3 yards, long sleeves: 3–3.5 yards, maxi: 3.5–4.5 yards. Add 0.5–1 yard for plus sizes. Wider fabric reduces the amount needed." },
        { q: "Does fabric width affect how much I need to buy?", a: "Yes — significantly! Wider fabric gives more usable area per yard. If you need 2 yards of 44\" fabric, you'd need only about 1.5 yards of 60\" fabric. Our width comparison table shows this automatically." },
        { q: "How much extra fabric should I buy?", a: "Plan for at least 10% extra. For solid fabrics: +10%, directional fabric: +15%, pattern repeats: +20–30%, beginners: add another 10%. For cotton/linen (shrinkable fabrics): add 5–10% more." },
        { q: "How do I calculate yardage for fabric with a pattern repeat?", a: "For every piece, you lose up to one full repeat. Calculate: extra yardage = number of rows × repeat length. Example: 4 rows with 6\" repeat = 24\" = 0.67 yards extra. Our calculator handles this in the Pattern Repeat section." },
        { q: "How many yards is a fat quarter?", a: "A fat quarter is ½ yard of fabric cut in half widthwise, measuring 18\" × 22\". It's ½ yard by area but shaped differently than a standard ½-yard cut (which would be 44\" × 18\")." },
        { q: "What if I have too little fabric already bought?", a: "Try: (1) piece it with a seam, (2) use contrast fabric for some pieces, (3) cut differently for creative layout, (4) make a smaller version, or (5) buy more if available. Use our 'I Have Fabric' mode to see what's possible." },
        { q: "How do I convert yardage between different fabric widths?", a: "Formula: New yardage = (Old yardage × Old width) ÷ New width. Example: 2 yards at 44\" switching to 60\": (2 × 44) ÷ 60 = 1.47 yards → buy 1.5 yards." },
        { q: "How much fabric do I need for a quilt?", a: "Baby quilt top: 1–1.5 yd per fabric. Throw: 2–3 yd. Queen: 3–5 yd. Add backing fabric separately based on quilt size and backing width. Use our Quilt Backing Calculator for precise backing yardage." },
        { q: "Why does my pattern list different yardages for different widths?", a: "Wider fabric fits more pattern pieces across its width, so you need less length. Most patterns list yardage for 44/45\" and 60\" widths." },
    ];

    /* ─── render ──────────────── */
    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Yardage Calculators", href: "/yardage" }, { label: "Basic Yardage Calculator" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    {/* HEADER */}
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Yardage #5</span>
                        <h1>Fabric Yardage Calculator — How Much Fabric Do I Need?</h1>
                        <p>Calculate exactly how much fabric to buy for any sewing project, any fabric width.</p>
                    </div>

                    {/* MODE TABS */}
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
                        {([
                            { key: "dimensions" as Mode, icon: "📐", label: "I Know My Dimensions" },
                            { key: "project" as Mode, icon: "👗", label: "Project Reference" },
                            { key: "reverse" as Mode, icon: "🔄", label: "I Have Fabric" },
                            { key: "multi" as Mode, icon: "📋", label: "Multi-Fabric" },
                        ]).map(t => (
                            <button key={t.key}
                                className={`btn btn-sm ${mode === t.key ? "btn-primary" : "btn-secondary"}`}
                                style={{ flex: "1 1 140px", padding: "10px 12px", fontSize: 13 }}
                                onClick={() => setMode(t.key)}>
                                {t.icon} {t.label}
                            </button>
                        ))}
                    </div>

                    {/* ═══ MODE 1: DIMENSIONS ═══ */}
                    {mode === "dimensions" && (<>
                        <div className={`glass-card ${styles.calculatorCard}`}>
                            <h2 className={styles.calcTitle}>① How Much Fabric Do You Need?</h2>
                            {/* Simple vs Pieces toggle */}
                            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                                <button className={`btn btn-sm ${inputMode === "simple" ? "btn-primary" : "btn-secondary"}`}
                                    onClick={() => setInputMode("simple")}>Total Length</button>
                                <button className={`btn btn-sm ${inputMode === "pieces" ? "btn-primary" : "btn-secondary"}`}
                                    onClick={() => setInputMode("pieces")}>Piece-by-Piece</button>
                            </div>

                            {inputMode === "simple" ? (
                                <div className="calculator-form">
                                    <div className="calculator-form-row">
                                        <div className="input-group" style={{ flex: 2 }}>
                                            <label className="input-label">Total Length Needed</label>
                                            <input type="number" className="input-field" placeholder="e.g., 72"
                                                value={totalLength} onChange={e => setTotalLength(e.target.value)} min={0} />
                                        </div>
                                        <div className="input-group" style={{ flex: 1 }}>
                                            <label className="input-label">Unit</label>
                                            <select className="input-field" value={lengthUnit}
                                                onChange={e => setLengthUnit(e.target.value as "in" | "cm")}>
                                                <option value="in">inches</option>
                                                <option value="cm">cm</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 4 }}>
                                        <Info size={12} style={{ display: "inline", marginRight: 4 }} />
                                        Add up all your pieces measured along the length of the fabric.
                                    </div>
                                </div>
                            ) : (
                                <div className="calculator-form">
                                    {pieces.map((p, i) => (
                                        <div key={i} style={{ background: "var(--color-bg-secondary)", padding: "12px 14px", borderRadius: "var(--radius-md)", marginBottom: 8 }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                                <strong style={{ fontSize: 13 }}>Piece {i + 1}</strong>
                                                {pieces.length > 1 && (
                                                    <button className="btn btn-sm btn-secondary" style={{ padding: "2px 6px" }}
                                                        onClick={() => removePiece(i)}><Trash2 size={12} /></button>
                                                )}
                                            </div>
                                            <div className="calculator-form-row" style={{ gap: 8 }}>
                                                <div className="input-group" style={{ flex: 2 }}>
                                                    <label className="input-label" style={{ fontSize: 11 }}>Name (optional)</label>
                                                    <input type="text" className="input-field" placeholder="e.g., Front bodice"
                                                        value={p.name} onChange={e => updatePiece(i, "name", e.target.value)} />
                                                </div>
                                                <div className="input-group"><label className="input-label" style={{ fontSize: 11 }}>Width&quot;</label>
                                                    <input type="number" className="input-field" placeholder="20"
                                                        value={p.w} onChange={e => updatePiece(i, "w", e.target.value)} min={0} />
                                                </div>
                                                <div className="input-group"><label className="input-label" style={{ fontSize: 11 }}>Length&quot;</label>
                                                    <input type="number" className="input-field" placeholder="36"
                                                        value={p.l} onChange={e => updatePiece(i, "l", e.target.value)} min={0} />
                                                </div>
                                                <div className="input-group" style={{ maxWidth: 60 }}><label className="input-label" style={{ fontSize: 11 }}>Qty</label>
                                                    <input type="number" className="input-field"
                                                        value={p.qty} onChange={e => updatePiece(i, "qty", e.target.value)} min={1} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button className="btn btn-sm btn-secondary" onClick={addPiece} style={{ gap: 4 }}>
                                        <Plus size={13} /> Add Piece
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* FABRIC WIDTH */}
                        <div className={`glass-card ${styles.calculatorCard}`}>
                            <h2 className={styles.calcTitle}>② Fabric Width</h2>
                            <div className={styles.presets} style={{ marginBottom: 0 }}>
                                <div className={styles.presetGrid}>
                                    {FABRIC_WIDTHS.map((f, i) => (
                                        <button key={i} className={`btn btn-sm ${fabricWidthIdx === i ? styles.presetActive : ""} btn-secondary`}
                                            onClick={() => setFabricWidthIdx(i)}>{f.label}</button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* COLLAPSIBLE OPTIONS */}
                        <div className={`glass-card ${styles.calculatorCard}`}>
                            <h2 className={styles.calcTitle}>③ Options</h2>
                            {/* Seam Allowance */}
                            <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between", marginBottom: showSA ? 10 : 6 }}
                                onClick={() => setShowSA(!showSA)}>
                                Seam Allowances {saMode === "add" ? `(+${saVal}")` : "(none)"} <ChevronDown size={14} style={{ transform: showSA ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                            </button>
                            {showSA && (
                                <div style={{ padding: "0 8px 12px", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                                    <label style={{ fontSize: 13, display: "flex", gap: 4, alignItems: "center" }}>
                                        <input type="radio" checked={saMode === "none"} onChange={() => setSaMode("none")} /> Don&apos;t add
                                    </label>
                                    <label style={{ fontSize: 13, display: "flex", gap: 4, alignItems: "center" }}>
                                        <input type="radio" checked={saMode === "add"} onChange={() => setSaMode("add")} /> Add:
                                    </label>
                                    {saMode === "add" && (
                                        <select className="input-field" style={{ width: "auto", minWidth: 100 }} value={saVal} onChange={e => setSaVal(e.target.value)}>
                                            <option value="0.25">¼&quot;</option><option value="0.375">⅜&quot;</option>
                                            <option value="0.5">½&quot;</option><option value="0.625">⅝&quot; (standard)</option>
                                            <option value="1">1&quot;</option>
                                        </select>
                                    )}
                                </div>
                            )}

                            {/* Shrinkage */}
                            <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between", marginBottom: showShrink ? 10 : 6 }}
                                onClick={() => setShowShrink(!showShrink)}>
                                Shrinkage Buffer {shrinkType !== "none" ? `(${shrinkPct}%)` : "(none)"} <ChevronDown size={14} style={{ transform: showShrink ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                            </button>
                            {showShrink && (
                                <div style={{ padding: "0 8px 12px" }}>
                                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                                        {Object.entries(SHRINKAGE).map(([k, v]) => (
                                            <button key={k} className={`btn btn-sm ${shrinkType === k ? "btn-primary" : "btn-secondary"}`}
                                                onClick={() => { setShrinkType(k); setCustomShrink(""); }}>{v.label}</button>
                                        ))}
                                        <div className="input-group" style={{ maxWidth: 100, margin: 0 }}>
                                            <input type="number" className="input-field" placeholder="Custom %"
                                                value={customShrink} onChange={e => { setCustomShrink(e.target.value); setShrinkType("cotton"); }} min={0} max={50} />
                                        </div>
                                    </div>
                                    {shrinkType !== "none" && (
                                        <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
                                            <Info size={12} style={{ display: "inline", marginRight: 4 }} />{SHRINKAGE[shrinkType]?.note}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Pattern Repeat */}
                            <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between", marginBottom: showRepeat ? 10 : 6 }}
                                onClick={() => setShowRepeat(!showRepeat)}>
                                Pattern Repeat {hasRepeat ? `(${repeatV}")` : directional ? `(+${dirExtra}%)` : "(none)"} <ChevronDown size={14} style={{ transform: showRepeat ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                            </button>
                            {showRepeat && (
                                <div style={{ padding: "0 8px 12px" }}>
                                    <label style={{ fontSize: 13, display: "flex", gap: 4, alignItems: "center", marginBottom: 6 }}>
                                        <input type="checkbox" checked={hasRepeat} onChange={e => setHasRepeat(e.target.checked)} /> Has pattern repeat
                                    </label>
                                    {hasRepeat && (
                                        <div className="input-group" style={{ maxWidth: 200, marginBottom: 8 }}>
                                            <label className="input-label" style={{ fontSize: 11 }}>Vertical repeat (inches)</label>
                                            <input type="number" className="input-field" value={repeatV} onChange={e => setRepeatV(e.target.value)} min={0} />
                                        </div>
                                    )}
                                    <label style={{ fontSize: 13, display: "flex", gap: 4, alignItems: "center", marginBottom: 6 }}>
                                        <input type="checkbox" checked={directional} onChange={e => setDirectional(e.target.checked)} /> Directional / one-way fabric
                                    </label>
                                    {directional && (
                                        <div className="input-group" style={{ maxWidth: 200 }}>
                                            <label className="input-label" style={{ fontSize: 11 }}>Extra percentage</label>
                                            <select className="input-field" value={dirExtra} onChange={e => setDirExtra(e.target.value)}>
                                                <option value="10">+10%</option><option value="15">+15% (recommended)</option>
                                                <option value="20">+20%</option>
                                            </select>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Quantity */}
                            <button className="btn btn-sm btn-secondary" style={{ width: "100%", textAlign: "left", justifyContent: "space-between", marginBottom: showQty ? 10 : 6 }}
                                onClick={() => setShowQty(!showQty)}>
                                Quantity {qty > 1 ? `(×${qty})` : "(single)"} <ChevronDown size={14} style={{ transform: showQty ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                            </button>
                            {showQty && (
                                <div style={{ padding: "0 8px 12px" }}>
                                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                        {[1, 2, 3, 5, 10].map(n => (
                                            <button key={n} className={`btn btn-sm ${qty === n ? "btn-primary" : "btn-secondary"}`}
                                                onClick={() => setQuantity(String(n))}>{n}</button>
                                        ))}
                                        <div className="input-group" style={{ maxWidth: 80, margin: 0 }}>
                                            <input type="number" className="input-field" placeholder="Custom"
                                                value={qty > 10 || ![1, 2, 3, 5, 10].includes(qty) ? quantity : ""}
                                                onChange={e => setQuantity(e.target.value)} min={1} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ═══ RESULTS ═══ */}
                        {mode1Result && (
                            <div className={`calculator-results ${styles.results}`}>
                                <div className="result-card">
                                    <div className="result-value">{toFraction(mode1Result.rounded)} yards</div>
                                    <div className="result-label">
                                        recommended purchase &nbsp;·&nbsp; {mode1Result.rounded.toFixed(2)} yd &nbsp;·&nbsp; {ydsToM(mode1Result.rounded)} m
                                        &nbsp;·&nbsp; of {fw}&quot; fabric
                                    </div>
                                </div>
                                <div style={{ textAlign: "center", fontSize: 15, fontWeight: 600, color: "var(--color-accent-primary)", margin: "8px 0" }}>
                                    AT THE STORE: Ask for {toFraction(mode1Result.rounded)} yards
                                </div>

                                <div className={styles.resultDetails}>
                                    {inputMode === "pieces" && mode1Result.totalPcs > 0 && <>
                                        <div className={styles.resultRow}><span>Cut size (last piece)</span><strong>{mode1Result.cutL.toFixed(1)}&quot; × {mode1Result.cutW.toFixed(1)}&quot;</strong></div>
                                        <div className={styles.resultRow}><span>Pieces across width</span><strong>{mode1Result.piecesAcross}</strong></div>
                                        <div className={styles.resultRow}><span>Rows needed</span><strong>{mode1Result.rows}</strong></div>
                                    </>}
                                    <div className={styles.resultRow}><span>Raw fabric length</span><strong>{(mode1Result.rawLengthIn).toFixed(1)}&quot;</strong></div>
                                    <div className={styles.resultRow}><span>Raw yardage</span><strong>{(mode1Result.rawLengthIn / 36).toFixed(3)} yd</strong></div>
                                    {shrinkPct > 0 && <div className={styles.resultRow}><span>Shrinkage buffer ({shrinkPct}%)</span><strong>+{((mode1Result.rawLengthIn / 36) * shrinkPct / 100).toFixed(3)} yd</strong></div>}
                                    {qty > 1 && <div className={styles.resultRow}><span>Quantity</span><strong>×{qty}</strong></div>}
                                    <div className={styles.resultRow}><span>Rounded to buyable</span><strong>{toFraction(mode1Result.rounded)} yd</strong></div>
                                </div>

                                {/* Cost */}
                                <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "12px 0 8px", flexWrap: "wrap" }}>
                                    <label style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Price per yard: $</label>
                                    <input type="number" className="input-field" style={{ width: 80 }} placeholder="0.00"
                                        value={pricePerYd} onChange={e => setPricePerYd(e.target.value)} min={0} step={0.01} />
                                    {price > 0 && <strong style={{ fontSize: 15, color: "var(--color-accent-primary)" }}>
                                        Total: ${(mode1Result.rounded * price).toFixed(2)}
                                    </strong>}
                                </div>

                                {/* Width Comparison */}
                                <div className={styles.tableWrap} style={{ marginTop: 12 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Same Project at Other Widths:</div>
                                    <table className={styles.convTable}>
                                        <thead><tr><th>Width</th><th>Yards</th><th>vs. {fw}&quot;</th></tr></thead>
                                        <tbody>
                                            {mode1Result.widthComp.map((c, i) => (
                                                <tr key={i} style={c.value === fw ? { background: "var(--color-accent-light)" } : undefined}>
                                                    <td>{c.label}</td>
                                                    <td style={{ fontWeight: 600 }}>{toFraction(c.yards)} yd</td>
                                                    <td>{c.value === fw ? "base" : `${c.diff > 0 ? "+" : ""}${toFraction(c.diff)} yd`}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="toolbar" style={{ marginTop: 12 }}>
                                    <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(copyText)}>
                                        <ClipboardCopy size={13} /> Copy
                                    </button>
                                    <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
                                        <Printer size={13} /> Print
                                    </button>
                                </div>
                            </div>
                        )}
                    </>)}

                    {/* ═══ MODE 2: PROJECT REFERENCE ═══ */}
                    {mode === "project" && (
                        <div className={`glass-card ${styles.calculatorCard}`}>
                            <h2 className={styles.calcTitle}>Common Project Yardage at a Glance</h2>
                            <p style={{ fontSize: 13, color: "var(--color-text-tertiary)", marginBottom: 14 }}>
                                Industry-standard estimates for 44&quot; and 60&quot; fabric. Use as a sanity check or starting point.
                            </p>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                                {["All", ...PROJECT_DATA.map(c => c.cat)].map(c => (
                                    <button key={c} className={`btn btn-sm ${refCat === c ? "btn-primary" : "btn-secondary"}`}
                                        onClick={() => setRefCat(c)}>{c}</button>
                                ))}
                            </div>
                            <div className={styles.tableWrap}>
                                <table className={styles.convTable}>
                                    <thead><tr><th>Project</th><th>44&quot; Fabric</th><th>60&quot; Fabric</th><th>Notes</th></tr></thead>
                                    <tbody>
                                        {PROJECT_DATA.filter(c => refCat === "All" || c.cat === refCat).map(c =>
                                            c.items.map((it, j) => (
                                                <tr key={`${c.cat}-${j}`}>
                                                    <td style={{ fontFamily: "inherit" }}>{it.name}</td>
                                                    <td>{it.y44} yd</td>
                                                    <td>{it.y60} yd</td>
                                                    <td style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>{it.note || "—"}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 10, fontStyle: "italic" }}>
                                These are general estimates. For precise calculations, use the &quot;I Know My Dimensions&quot; mode or the specific project calculator.
                            </p>
                        </div>
                    )}

                    {/* ═══ MODE 3: REVERSE ═══ */}
                    {mode === "reverse" && (<>
                        <div className={`glass-card ${styles.calculatorCard}`}>
                            <h2 className={styles.calcTitle}>🔄 I Have Fabric — What Can I Make?</h2>
                            <div className="calculator-form">
                                <div className="calculator-form-row">
                                    <div className="input-group" style={{ flex: 2 }}>
                                        <label className="input-label">How much fabric do you have?</label>
                                        <input type="number" className="input-field" placeholder="e.g., 2"
                                            value={revAmount} onChange={e => setRevAmount(e.target.value)} min={0} step={0.25} />
                                    </div>
                                    <div className="input-group" style={{ flex: 1 }}>
                                        <label className="input-label">Unit</label>
                                        <select className="input-field" value={revUnit} onChange={e => setRevUnit(e.target.value as "yd" | "m")}>
                                            <option value="yd">yards</option><option value="m">meters</option>
                                        </select>
                                    </div>
                                    <div className="input-group" style={{ flex: 1 }}>
                                        <label className="input-label">Width</label>
                                        <select className="input-field" value={revWidth} onChange={e => setRevWidth(Number(e.target.value))}>
                                            {FABRIC_WIDTHS.map((f, i) => <option key={i} value={i}>{f.label}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {reverseResult && (
                            <div className={`glass-card ${styles.calculatorCard}`}>
                                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>
                                    With {toFraction(reverseResult.amtYds)} yards of {FABRIC_WIDTHS[revWidth].label} fabric:
                                </h3>
                                {reverseResult.can.length > 0 && (
                                    <div style={{ marginBottom: 16 }}>
                                        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-accent-primary)", marginBottom: 6 }}>✅ Can Make (comfortably):</div>
                                        <ul style={{ fontSize: 13, lineHeight: 1.8, color: "var(--color-text-secondary)", paddingLeft: 20 }}>
                                            {reverseResult.can.map((it, i) => <li key={i}>{it.name} <span style={{ color: "var(--color-text-tertiary)", fontSize: 11 }}>({it.cat})</span></li>)}
                                        </ul>
                                    </div>
                                )}
                                {reverseResult.tight.length > 0 && (
                                    <div style={{ marginBottom: 16 }}>
                                        <div style={{ fontSize: 14, fontWeight: 600, color: "#e67e22", marginBottom: 6 }}>⚠️ Might Work (tight — measure carefully):</div>
                                        <ul style={{ fontSize: 13, lineHeight: 1.8, color: "var(--color-text-secondary)", paddingLeft: 20 }}>
                                            {reverseResult.tight.map((it, i) => <li key={i}>{it.name}</li>)}
                                        </ul>
                                    </div>
                                )}
                                {reverseResult.no.length > 0 && (
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 600, color: "hsl(0,60%,50%)", marginBottom: 6 }}>❌ Not Enough For:</div>
                                        <ul style={{ fontSize: 13, lineHeight: 1.8, color: "var(--color-text-tertiary)", paddingLeft: 20 }}>
                                            {reverseResult.no.slice(0, 10).map((it, i) => <li key={i}>{it.name}</li>)}
                                            {reverseResult.no.length > 10 && <li>...and {reverseResult.no.length - 10} more</li>}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </>)}

                    {/* ═══ MODE 4: MULTI-FABRIC (placeholder) ═══ */}
                    {mode === "multi" && (
                        <div className={`glass-card ${styles.calculatorCard}`}>
                            <h2 className={styles.calcTitle}>📋 Multi-Fabric Project Planner</h2>
                            <p style={{ fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
                                Plan a complete multi-fabric project — main fabric + lining + interfacing + contrast — with a full shopping list and cost breakdown.
                            </p>
                            <p style={{ fontSize: 13, color: "var(--color-text-tertiary)", fontStyle: "italic", marginTop: 12 }}>
                                Advanced multi-fabric planner coming soon. For now, use the &quot;I Know My Dimensions&quot; mode to calculate each fabric individually.
                            </p>
                        </div>
                    )}

                    {/* ═══ FAQ ═══ */}
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

                {/* ═══ SIDEBAR ═══ */}
                <aside className="calculator-sidebar">
                    <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Yardage Quick Tips</h4>
                        <ul style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.8, listStyle: "none", padding: 0, margin: 0 }}>
                            {[
                                "Wider fabric = less yardage needed",
                                "Always round UP, never down",
                                "Pre-wash cotton before cutting",
                                "Add 10% buffer for beginners",
                                "Keep scraps for future repairs",
                            ].map((item, i) => (
                                <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                                    <span style={{ color: "var(--color-accent-primary)", fontWeight: 700, flexShrink: 0 }}>✓</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="glass-card related-tools">
                        <h4>Related Tools</h4>
                        <a href="/yardage/pattern-repeat-calculator" className="related-tool-link">Pattern Repeat Calculator</a>
                        <a href="/yardage/buffer-calculator" className="related-tool-link">Buffer / Shrinkage Calculator</a>
                        <a href="/convert/fabric-width-universal" className="related-tool-link">Fabric Width Converter</a>
                        <a href="/yardage/lining-calculator" className="related-tool-link">Lining Yardage Calculator</a>
                        <a href="/cost/project-estimator" className="related-tool-link">Project Cost Estimator</a>
                        <a href="/yardage" className="related-tool-link">All Yardage Tools</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}
