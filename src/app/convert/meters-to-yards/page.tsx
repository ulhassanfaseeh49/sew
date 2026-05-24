"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Ruler, ArrowRightLeft, Copy, Printer, ChevronDown, ShoppingBag, BookOpen, Info } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../yards-to-meters/page.module.css";

const M2Y = 1.0936133;

/* ─── FRACTION HELPERS ─── */
function fracYd(val: number, precision: number = 8): string {
    const w = Math.floor(val);
    const f = val - w;
    const nearest = Math.round(f * precision) / precision;
    if (nearest >= 1) return `${w + 1}`;
    if (nearest <= 0) return w ? `${w}` : "0";
    const map: Record<string, string> = { "0.125": "⅛", "0.25": "¼", "0.375": "⅜", "0.5": "½", "0.625": "⅝", "0.75": "¾", "0.875": "⅞", "0.333": "⅓", "0.667": "⅔" };
    const key = nearest.toFixed(3);
    const sym = map[key] || `${Math.round(nearest * precision)}/${precision}`;
    return w > 0 ? `${w}${sym}` : sym;
}
function roundUpEighth(v: number): number { return Math.ceil(v * 8) / 8; }
function roundUpQuarter(v: number): number { return Math.ceil(v * 4) / 4; }

/* ─── PRESETS ─── */
const commonPresets = [0.25, 0.3, 0.5, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.4, 1.5, 1.8, 2, 2.5, 3, 4, 5];
const euroPresets = [0.7, 0.8, 0.9, 1, 1.1, 1.15, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.2, 2.3, 2.5, 2.7, 2.8, 3, 3.5, 4];
const jpPresets = [0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.5, 1.8, 2, 2.5, 3];

/* ─── REFERENCE TABLE ─── */
const refTable: { m: number; use: string }[] = [
    { m: 0.25, use: "Quarter meter — small accent, appliqué" },
    { m: 0.5, use: "Half meter — baby items, accessories" },
    { m: 0.7, use: "Common Burda lining amount" },
    { m: 0.9, use: "European lining/contrast amount" },
    { m: 1, use: "Basic top, simple skirt" },
    { m: 1.1, use: "Common Japanese pattern amount" },
    { m: 1.2, use: "Simple blouse, short skirt" },
    { m: 1.4, use: "Very common Burda amount" },
    { m: 1.5, use: "Standard skirt, sleeveless dress" },
    { m: 1.8, use: "Standard dress (many patterns)" },
    { m: 2, use: "Long dress, short coat" },
    { m: 2.3, use: "Jumpsuit (short), long skirt" },
    { m: 2.5, use: "Jumpsuit, robe, coat (small)" },
    { m: 3, use: "Curtain panel, long gown" },
    { m: 3.5, use: "Wide circle skirt, large curtain" },
    { m: 4, use: "Curtains (pair), full costume" },
    { m: 5, use: "Large home décor project" },
    { m: 10, use: "Large batch, multiple projects" },
];

/* ─── FABRIC CONTEXT ─── */
function getFabricContext(m: number): { range: string; items: string[] } | null {
    if (m <= 0) return null;
    if (m <= 0.5) return { range: "0–0.50m (up to ½ yd)", items: ["Baby bib or burp cloth", "Small zippered pouch", "Headband or scrunchie", "Fabric coasters", "Pocket fabric or facings"] };
    if (m <= 1) return { range: "0.50–1.00m (½–1⅛ yd)", items: ["Baby dress or romper", "Tote bag", "Simple crop top", "Pillow cover (18–20\")", "Cloth napkins (set of 4–6)"] };
    if (m <= 1.5) return { range: "1.00–1.50m (1⅛–1⅝ yd)", items: ["Sleeveless top or tank", "Simple A-line skirt", "Shorts", "Table runner", "Full apron"] };
    if (m <= 2) return { range: "1.50–2.00m (1⅝–2¼ yd)", items: ["Blouse with sleeves", "Standard skirt with waistband", "Simple dress (sleeveless)", "Pajama pants", "Pair of cushion covers"] };
    if (m <= 3) return { range: "2.00–3.00m (2¼–3¼ yd)", items: ["Dress with sleeves", "Jumpsuit or romper", "Lined jacket (short)", "Long skirt", "Single curtain panel"] };
    if (m <= 5) return { range: "3.00–5.00m (3¼–5½ yd)", items: ["Long coat", "Evening gown", "Circle skirt", "Curtain panels (pair)", "Costume with multiple pieces"] };
    return { range: "5.00+ m (5½+ yd)", items: ["Full bedding set", "Multiple curtain panels", "Quilt (large)", "Bulk production", "Wedding dress with train"] };
}

/* ─── FAQ ─── */
const faqItems = [
    { q: "How many yards is 1 meter of fabric?", a: "One meter equals approximately 1.094 yards, or about 1⅛ yards. A meter is roughly 10% longer than a yard — 39.37 inches versus 36 inches, a difference of about 3⅜ inches. When buying, ask for 1⅛ or 1¼ yards to be safe." },
    { q: "How do I convert meters to yards for buying fabric?", a: "Multiply meters by 1.094, then round UP to the nearest ⅛ yard. Example: 1.50m × 1.094 = 1.64 yards → buy 1¾ yards. Quick mental math: add 10% to your meter number (1.50 + 0.15 = 1.65 ≈ 1⅝ to 1¾ yards)." },
    { q: "Why does my European pattern say \"1,40 m\" with a comma?", a: "In most European countries (Germany, France, Italy, Spain), a comma replaces the decimal point. So \"1,40 m\" means 1.40 meters (one meter and forty centimeters) — about 1½ yards. It does NOT mean \"1 meter and 40 meters.\"" },
    { q: "My Burda pattern says 1.40m at 140cm width. I have 44/45\" fabric. How much?", a: "This requires TWO conversions: length AND width. 1.40m ≈ 1.53 yards in length, but since your fabric is narrower (44\" vs 140cm/55\"), you'll need more length — potentially 1.8 to 2.2× more. Use our Fabric Width Converter for precise adjustment." },
    { q: "Is a meter bigger than a yard?", a: "Yes. A meter is about 3.37 inches (8.56 cm) longer than a yard — roughly the width of your palm. So your yard number is always slightly LARGER than your meter number when converting." },
    { q: "How many yards of fabric is 2 meters?", a: "2 meters = approximately 2.19 yards, or about 2¼ yards. When buying, ask for 2¼ yards. Two meters is common for dresses with sleeves, long skirts, and short jackets in European patterns." },
    { q: "How is Japanese fabric sold and how do I convert it?", a: "Japanese fabric is sold by 10cm increments, not meters. \"1 unit\" = 10cm (0.1m ≈ 4 inches). To buy 1 meter, order 10 units. Japanese cotton is usually 110cm (43\") wide. Convert cm to meters (÷100), then multiply by 1.094 for yards." },
    { q: "Why can't I just ask for 1.53 yards at the fabric store?", a: "US/Canadian fabric stores cut in ⅛-yard increments. Staff use yardstick markings with fractions, not decimals. Asking for \"1.53 yards\" would confuse most staff. Convert to the nearest ⅛-yard fraction — our calculator does this automatically." },
    { q: "Do I need to convert fabric width from centimeters too?", a: "If the pattern assumes wider fabric than yours, yes — you'll need more yardage. Key widths: 110cm=43\", 112cm=44\", 140cm=55\", 150cm=59\". If your pattern says 140cm and you have 44\", use a Fabric Width Converter." },
    { q: "Should I round up or down when converting?", a: "ALWAYS round UP. When converting 1.40m (=1.53 yd exact), buy 1⅝ or 1¾ yards, NEVER 1½ yards. The small extra cost is always worth it compared to not having enough fabric. Our calculator's \"Buy This Much\" amount already rounds up for safety." },
];

export default function MetersToYardsPage() {
    const [meters, setMeters] = useState<string>("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState<string>("");
    const [showEuro, setShowEuro] = useState(false);
    const [showJp, setShowJp] = useState(false);
    const [showAllConv, setShowAllConv] = useState(false);
    const [showContext, setShowContext] = useState(false);
    const [showIntl, setShowIntl] = useState(false);
    const [showFormula, setShowFormula] = useState(false);
    const [showTips, setShowTips] = useState(false);

    const m = parseFloat(meters.replace(",", ".")) || 0;
    const yd = m * M2Y;
    const inches = m * 39.3701;
    const cm = m * 100;
    const ft = Math.floor(inches / 12);
    const remIn = inches % 12;
    const buyAmt = roundUpEighth(yd + 0.06);
    const context = getFabricContext(m);

    const handleCopy = useCallback((text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopied(label);
        setTimeout(() => setCopied(""), 2000);
    }, []);

    const tH = { padding: "6px 8px", borderBottom: "2px solid hsl(0,0%,85%)", textAlign: "left" as const, fontSize: 11, fontWeight: 600 as const };
    const tD = { padding: "5px 8px", borderBottom: "1px solid hsl(0,0%,92%)", fontSize: 11 };

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Conversion Tools", href: "/convert" }, { label: "Meters to Yards" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Ruler size={14} strokeWidth={1.5} />Conversion #2</span>
                        <h1>Meters to Yards Converter for Fabric &amp; Sewing</h1>
                        <p>Convert fabric meters to yards with sewing fraction display, European &amp; Japanese pattern presets, and a &quot;buy this much&quot; recommendation. The only converter built specifically for sewists.</p>
                    </div>

                    {/* ═══ CALCULATOR ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Enter Meters</h2>
                        <div className="input-group" style={{ marginBottom: 10 }}>
                            <label className="input-label" htmlFor="m-input">Meters</label>
                            <input id="m-input" type="text" inputMode="decimal" className="input-field input-mono"
                                placeholder="e.g., 1.5" value={meters} onChange={e => setMeters(e.target.value)}
                                onFocus={e => e.target.select()} autoFocus
                                style={{ fontSize: 22, height: 56, maxWidth: 320 }} />
                            <span className="input-helper">1 meter = 1.094 yards ≈ 39.37 inches. Accepts European comma (1,40).</span>
                        </div>

                        {/* Common presets */}
                        <div style={{ marginBottom: 8 }}>
                            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-secondary)", marginRight: 6 }}>Common:</span>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                                {commonPresets.map(v => (
                                    <button key={v} className={`btn btn-sm ${m === v ? "btn-primary" : "btn-ghost"}`}
                                        onClick={() => setMeters(v.toString())} style={{ fontSize: 10 }}>{v}m</button>
                                ))}
                            </div>
                        </div>

                        {/* European presets */}
                        <div style={{ marginBottom: 6 }}>
                            <button className="btn btn-sm btn-ghost" onClick={() => setShowEuro(!showEuro)} style={{ fontSize: 10, width: "100%", justifyContent: "space-between" }}>
                                🇪🇺 European Pattern Amounts (Burda, Knipmode, Named)
                                <ChevronDown size={12} style={{ transform: showEuro ? "rotate(180deg)" : "none", transition: ".2s" }} />
                            </button>
                            {showEuro && <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 4 }}>
                                {euroPresets.map(v => (
                                    <button key={v} className={`btn btn-sm ${m === v ? "btn-primary" : "btn-ghost"}`}
                                        onClick={() => setMeters(v.toString())} style={{ fontSize: 10 }}>{v}m</button>
                                ))}
                            </div>}
                        </div>

                        {/* Japanese presets */}
                        <div style={{ marginBottom: 10 }}>
                            <button className="btn btn-sm btn-ghost" onClick={() => setShowJp(!showJp)} style={{ fontSize: 10, width: "100%", justifyContent: "space-between" }}>
                                🇯🇵 Japanese Pattern Amounts
                                <ChevronDown size={12} style={{ transform: showJp ? "rotate(180deg)" : "none", transition: ".2s" }} />
                            </button>
                            {showJp && <>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 4 }}>
                                    {jpPresets.map(v => (
                                        <button key={v} className={`btn btn-sm ${m === v ? "btn-primary" : "btn-ghost"}`}
                                            onClick={() => setMeters(v.toString())} style={{ fontSize: 10 }}>{v}m</button>
                                    ))}
                                </div>
                                <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 4 }}>Japanese fabric is often 110cm (43&quot;) wide. Amounts may differ from wider European patterns.
                                    → <Link href="/convert/fabric-width-36-to-45" style={{ color: "var(--color-accent-primary)" }}>Fabric Width Converter</Link>
                                </div>
                            </>}
                        </div>

                        {/* ═══ RESULTS ═══ */}
                        {m > 0 && (<>
                            <div className="calculator-divider" />

                            {/* Primary result */}
                            <div className="result-card" style={{ textAlign: "center", padding: 24, background: "hsl(150,20%,97%)" }}>
                                <div className="result-prefix" style={{ fontSize: 14 }}>{m} meter{m !== 1 ? "s" : ""} =</div>
                                <div className="result-value" style={{ fontSize: 40 }}>{fracYd(yd)} yards</div>
                                <div className="result-label" style={{ fontSize: 14 }}>({yd.toFixed(4)} yards exact)</div>
                            </div>

                            {/* Buy This Much */}
                            <div className="note-tip" style={{ marginTop: 12, padding: 16, background: "hsl(150,25%,95%)", borderLeft: "4px solid hsl(150,50%,45%)", borderRadius: 8 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                                    <ShoppingBag size={16} style={{ color: "hsl(150,50%,35%)" }} />
                                    <strong style={{ fontSize: 13 }}>At the fabric store, ask for:</strong>
                                </div>
                                <div style={{ fontSize: 28, fontWeight: 800, color: "hsl(150,50%,30%)", textAlign: "center", padding: "8px 0" }}>
                                    {fracYd(buyAmt)} yards
                                </div>
                                <div style={{ fontSize: 11, color: "var(--color-text-secondary)", textAlign: "center" }}>
                                    (rounded UP for safety — gives ~{Math.round((buyAmt - yd) * 36)} extra inches beyond exact)
                                </div>
                            </div>

                            {/* Fraction precision row */}
                            <div style={{ display: "flex", gap: 8, marginTop: 10, fontSize: 12 }}>
                                <div style={{ flex: 1, padding: 8, background: "hsl(0,0%,97%)", borderRadius: 6, textAlign: "center" }}>
                                    <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>Nearest ⅛</div>
                                    <strong>{fracYd(yd, 8)} yd</strong>
                                </div>
                                <div style={{ flex: 1, padding: 8, background: "hsl(0,0%,97%)", borderRadius: 6, textAlign: "center" }}>
                                    <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>Nearest ¼</div>
                                    <strong>{fracYd(yd, 4)} yd</strong>
                                </div>
                                <div style={{ flex: 1, padding: 8, background: "hsl(0,0%,97%)", borderRadius: 6, textAlign: "center" }}>
                                    <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>Nearest ½</div>
                                    <strong>{fracYd(yd, 2)} yd</strong>
                                </div>
                            </div>

                            {/* Visual comparison bars */}
                            <div style={{ marginTop: 12, padding: 10, background: "hsl(0,0%,98%)", borderRadius: 8 }}>
                                <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 8 }}>Visual Comparison</div>
                                {[
                                    { label: "Meters", val: m, max: Math.max(m, buyAmt * 0.9144), color: "hsl(200,50%,55%)", text: `${m} m` },
                                    { label: "Yards (exact)", val: yd * 0.9144, max: Math.max(m, buyAmt * 0.9144), color: "hsl(150,50%,50%)", text: `${yd.toFixed(2)} yd` },
                                    { label: "Buy amount", val: buyAmt * 0.9144, max: Math.max(m, buyAmt * 0.9144), color: "hsl(150,60%,35%)", text: `${fracYd(buyAmt)} yd` },
                                ].map((b, i) => (
                                    <div key={i} style={{ marginBottom: 4 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--color-text-secondary)" }}>
                                            <span>{b.label}</span><span>{b.text}</span>
                                        </div>
                                        <div style={{ height: 10, background: "hsl(0,0%,92%)", borderRadius: 5, overflow: "hidden" }}>
                                            <div style={{ width: `${Math.min((b.val / b.max) * 100, 100)}%`, height: "100%", background: b.color, borderRadius: 5, transition: "width 0.4s ease" }} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* All conversions */}
                            <div style={{ marginTop: 10 }}>
                                <button className="btn btn-sm btn-ghost" onClick={() => setShowAllConv(!showAllConv)} style={{ width: "100%", justifyContent: "space-between", fontSize: 11 }}>All Conversions & Fabric Area
                                    <ChevronDown size={12} style={{ transform: showAllConv ? "rotate(180deg)" : "none", transition: ".2s" }} />
                                </button>
                                {showAllConv && (
                                    <div className={styles.resultDetails} style={{ marginTop: 6 }}>
                                        <div className="result-row"><span className="result-row-label">Decimal yards</span><span className="result-row-value">{yd.toFixed(4)} yd</span></div>
                                        <div className="result-row"><span className="result-row-label">Fraction yards (⅛)</span><span className="result-row-value">{fracYd(yd)} yd</span></div>
                                        <div className="result-row"><span className="result-row-label">Buy amount (rounded up)</span><span className="result-row-value" style={{ color: "var(--color-accent-primary)", fontWeight: 700 }}>{fracYd(buyAmt)} yd</span></div>
                                        <div className="result-row"><span className="result-row-label">Inches</span><span className="result-row-value">{inches.toFixed(1)} in</span></div>
                                        <div className="result-row"><span className="result-row-label">Feet &amp; inches</span><span className="result-row-value">{ft} ft {remIn.toFixed(1)} in</span></div>
                                        <div className="result-row"><span className="result-row-label">Centimeters</span><span className="result-row-value">{cm.toFixed(1)} cm</span></div>
                                        <div className="result-row"><span className="result-row-label">Millimeters</span><span className="result-row-value">{(cm * 10).toFixed(0)} mm</span></div>
                                        <div style={{ marginTop: 8, fontSize: 11, fontWeight: 600 }}>Fabric Area (at different widths)</div>
                                        {[{ w: 44, label: '44/45" (112cm) standard' }, { w: 54, label: '54" (137cm) home décor' }, { w: 60, label: '60" (150cm) wide' }, { w: 43, label: '43" (110cm) Japanese' }].map((fw, i) => (
                                            <div key={i} className="result-row"><span className="result-row-label">{fw.label}</span><span className="result-row-value">{(inches * fw.w).toLocaleString(undefined, { maximumFractionDigits: 0 })} sq in ({(m * fw.w * 0.0254).toFixed(2)} m²)</span></div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="toolbar" style={{ marginTop: 12 }}>
                                <button className="btn btn-secondary btn-sm" onClick={() => handleCopy(`${m} meters = ${yd.toFixed(4)} yards (≈ ${fracYd(yd)} yd). Buy: ${fracYd(buyAmt)} yards.`, "result")}>
                                    <Copy size={13} />{copied === "result" ? "Copied!" : "Copy"}
                                </button>
                                <button className="btn btn-secondary btn-sm" onClick={() => handleCopy(`Buy ${fracYd(buyAmt)} yards`, "buy")}>
                                    <ShoppingBag size={13} />{copied === "buy" ? "Copied!" : "Copy Buy Amount"}
                                </button>
                                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} />Print</button>
                                <button className="btn btn-secondary btn-sm" onClick={() => setMeters("")}>Clear</button>
                            </div>

                            {/* Reverse link */}
                            <div style={{ marginTop: 8, textAlign: "center" }}>
                                <Link href={`/convert/yards-to-meters?v=${yd.toFixed(2)}`} style={{ fontSize: 12, color: "var(--color-accent-primary)" }}>
                                    ⇄ Convert {yd.toFixed(2)} yards back to meters
                                </Link>
                            </div>
                        </>)}
                    </div>

                    {/* ═══ WHAT CAN YOU MAKE? ═══ */}
                    {context && (
                        <div className={`glass-card ${styles.calculatorCard}`}>
                            <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowContext(!showContext)}>What Can You Make with {m}m ({fracYd(yd)} yd)?
                                <ChevronDown size={14} style={{ transform: showContext ? "rotate(180deg)" : "none", transition: ".2s" }} />
                            </button>
                            {showContext && (
                                <div style={{ marginTop: 10, padding: 10, background: "hsl(150,15%,97%)", borderRadius: 6 }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Range: {context.range}</div>
                                    <ul style={{ paddingLeft: 18, fontSize: 12, lineHeight: 2 }}>
                                        {context.items.map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                    <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 6 }}>Based on 44/45&quot; wide fabric. Wider fabric yields more from the same length.
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ═══ REFERENCE TABLE ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}><BookOpen size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />Common Meters to Yards Conversion Chart</h2>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
                                <thead><tr>
                                    <th style={tH}>Meters</th><th style={tH}>Yards (exact)</th><th style={tH}>Fraction</th><th style={tH}>Buy</th><th style={tH}>Common Sewing Use</th>
                                </tr></thead>
                                <tbody>{refTable.map(r => {
                                    const y = r.m * M2Y;
                                    const isActive = Math.abs(r.m - m) < 0.01;
                                    return (
                                        <tr key={r.m} style={{ background: isActive ? "hsl(150,30%,93%)" : undefined, cursor: "pointer" }} onClick={() => setMeters(r.m.toString())}>
                                            <td style={{ ...tD, fontWeight: 600 }}>{r.m} m</td>
                                            <td style={tD}>{y.toFixed(2)} yd</td>
                                            <td style={{ ...tD, fontWeight: 600 }}>{fracYd(y)} yd</td>
                                            <td style={{ ...tD, color: "hsl(150,50%,35%)", fontWeight: 600 }}>{fracYd(roundUpEighth(y + 0.06))} yd</td>
                                            <td style={{ ...tD, color: "var(--color-text-secondary)" }}>{r.use}</td>
                                        </tr>
                                    );
                                })}</tbody>
                            </table>
                        </div>
                    </div>

                    {/* ═══ INTERNATIONAL PATTERN GUIDE ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowIntl(!showIntl)}>International Pattern Conversion Guide
                            <ChevronDown size={14} style={{ transform: showIntl ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showIntl && (
                            <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9, color: "var(--color-text-secondary)" }}>
                                <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>Converting Burda Patterns</h4>
                                <p>Burda lists requirements as &quot;Stoffverbrauch&quot; in German editions. They typically assume 140cm (55&quot;) or 150cm (59&quot;) wide fabric. If using American 44/45&quot; fabric, you need MORE yardage. → <Link href="/convert/fabric-width-36-to-45" style={{ color: "var(--color-accent-primary)" }}>Fabric Width Converter</Link></p>
                                <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 10 }}>Japanese Sewing Books</h4>
                                <p>Japanese cottons are usually 110cm (43&quot;) wide — close to American 44/45&quot;. Fabric is sold in 10cm increments (not meters). 50cm, 100cm, 150cm are common amounts.</p>
                                <h4 style={{ fontWeight: 600, color: "var(--color-text-primary)", marginTop: 10 }}>Metric Fabric Width Guide</h4>
                                <div style={{ overflowX: "auto", marginTop: 6 }}>
                                    <table style={{ fontSize: 11, borderCollapse: "collapse", width: "100%" }}>
                                        <thead><tr><th style={tH}>European Width</th><th style={tH}>US Equivalent</th><th style={tH}>Action</th></tr></thead>
                                        <tbody>
                                            {[["90cm (35\")", "Similar to 36\"", "Direct conversion OK"], ["110cm (43\")", "Similar to 44/45\"", "Usually OK"], ["140cm (55\")", "Between 44\" and 60\"", "May need more yardage"], ["150cm (59\")", "Similar to 60\"", "Use 60\" fabric or adjust"]].map(([ew, us, act], i) => (
                                                <tr key={i}><td style={tD}>{ew}</td><td style={tD}>{us}</td><td style={tD}>{act}</td></tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ═══ FORMULA ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowFormula(!showFormula)}>How to Convert Meters to Yards — The Formula
                            <ChevronDown size={14} style={{ transform: showFormula ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showFormula && (
                            <div style={{ marginTop: 10, fontSize: 13, lineHeight: 1.9, color: "var(--color-text-secondary)" }}>
                                <div style={{ padding: 16, background: "hsl(200,15%,96%)", borderRadius: 8, textAlign: "center", marginBottom: 10, fontFamily: "monospace", fontSize: 18, fontWeight: 700 }}>Yards = Meters × 1.09361
                                </div>
                                <p><strong>Example:</strong>1.40m × 1.09361 = 1.5311 yards → nearest ⅛ = 1½ yd → round UP to 1⅝ yd.</p>
                                <div style={{ padding: 10, background: "hsl(40,30%,96%)", borderRadius: 6, marginTop: 8 }}>
                                    <strong>Mental math shortcut:</strong>&quot;A meter is a yard and a hand.&quot; Add ~10% to your meters: 1.40m + 0.14 = 1.54 yd ≈ 1½–1⅝ yd. Actual: 1.53 yd ✓
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ═══ TIPS ═══ */}
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <button className="btn btn-sm btn-secondary" style={{ width: "100%", justifyContent: "space-between" }} onClick={() => setShowTips(!showTips)}>Tips for Buying Fabric When Converting
                            <ChevronDown size={14} style={{ transform: showTips ? "rotate(180deg)" : "none", transition: ".2s" }} />
                        </button>
                        {showTips && (
                            <div style={{ marginTop: 10, fontSize: 12, lineHeight: 1.9, color: "var(--color-text-secondary)" }}>
                                {[
                                    { title: "Always Round UP", text: "Never down. The extra cents are worth it vs. running out of fabric mid-project." },
                                    { title: "Account for Fabric Width", text: "European patterns (140cm) are wider than American 44/45\". If buying narrower fabric, you need MORE length." },
                                    { title: "Watch the Comma/Decimal", text: "\"1,40 m\" in European patterns = 1.40 meters. Comma replaces the period." },
                                    { title: "Japanese 10cm Units", text: "\"110cm\" = 1.10 meters. Japanese shops sell by 10cm increments, not meters." },
                                    { title: "Convert Lining Separately", text: "Lining and fashion fabric need separate conversions. Don't assume they're the same." },
                                    { title: "Add Shrinkage After Converting", text: "Pre-wash shrinkage is EXTRA, on top of the converted amount." },
                                ].map((tip, i) => (
                                    <div key={i} style={{ padding: 8, background: i % 2 === 0 ? "hsl(0,0%,97%)" : "transparent", borderRadius: 6, marginBottom: 4 }}>
                                        <strong style={{ color: "var(--color-text-primary)" }}>{tip.title}:</strong>{tip.text}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

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

                {/* SIDEBAR */}
                <aside className="calculator-sidebar">
                    <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Quick Reference</h4>
                        <div style={{ fontSize: 12, lineHeight: 2.2, color: "var(--color-text-secondary)" }}>
                            <div>1 meter = <strong>1.094 yards</strong></div>
                            <div>1 yard = <strong>0.914 meters</strong></div>
                            <div>1 meter = <strong>39.37 inches</strong></div>
                            <div>1 meter = <strong>100 cm</strong></div>
                            <div style={{ marginTop: 8, fontSize: 11, fontStyle: "italic" }}>&quot;A meter is a yard and a hand&quot; — add ~10%</div>
                        </div>
                    </div>
                    <div className="glass-card" style={{ padding: "var(--space-5)", marginBottom: "var(--space-4)" }}>
                        <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>How to Use</h4>
                        <ol style={{ fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 2, paddingLeft: 16 }}>
                            <li>Enter meters (or pick a preset)</li>
                            <li>Read the fraction result</li>
                            <li>Note the &quot;Buy This Much&quot; amount</li>
                            <li>Copy the buy amount to take to the store</li>
                        </ol>
                    </div>
                    <Link href="/convert/yards-to-meters" className="btn btn-secondary btn-md" style={{ width: "100%", justifyContent: "center", marginBottom: "var(--space-4)" }}>
                        <ArrowRightLeft size={16} />Yards → Meters
                    </Link>
                    <div className="glass-card related-tools">
                        <h4>Related Tools</h4>
                        <a href="/convert/yards-to-meters" className="related-tool-link">Yards to Meters</a>
                        <a href="/convert/centimeters-to-inches" className="related-tool-link">Centimeters to Inches</a>
                        <a href="/convert/universal-sewing-converter" className="related-tool-link">Universal Converter</a>
                        <a href="/convert/fabric-width-36-to-45" className="related-tool-link">Fabric Width Converter</a>
                        <a href="/cost/per-meter" className="related-tool-link">Cost Per Meter</a>
                        <a href="/cost/per-yard" className="related-tool-link">Cost Per Yard</a>
                        <a href="/convert" className="related-tool-link">All Conversion Tools</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}
