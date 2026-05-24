"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Baby, ClipboardCopy, Printer } from "lucide-react";

function toFrac(v: number): string {
    if (v <= 0) return "0"; const w = Math.floor(v); const f = v - w;
    const map: [number, string][] = [[0, ""], [0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
    let best = map[0], bd = 1;
    for (const [n, s] of map) { const d = Math.abs(f - n); if (d < bd) { bd = d; best = [n, s]; } }
    if (Math.abs(f - 1) < bd) return `${w + 1}`; if (!best[1]) return w > 0 ? `${w}` : "0";
    return w > 0 ? `${w} ${best[1]}` : `${best[1]}`;
}

type SheetSize = "mini" | "standard" | "toddler" | "custom";
const sheetSizes: { key: SheetSize; name: string; w: number; l: number; d: number }[] = [
    { key: "mini", name: "Mini Crib", w: 24, l: 38, d: 5 },
    { key: "standard", name: "Standard Crib", w: 28, l: 52, d: 6 },
    { key: "toddler", name: "Toddler Bed", w: 28, l: 52, d: 8 },
    { key: "custom", name: "Custom", w: 28, l: 52, d: 6 },
];

const faqItems = [
    { q: "How much fabric for a crib sheet?", a: "Standard crib (28×52×6\"): about 2 yards of 44\" fabric OR 1⅔ yards of 60\" fabric. You need the mattress top + sides + tuck-under on all sides. Wider fabric means less piecing." },
    { q: "How much elastic for a fitted sheet?", a: "Perimeter of the sheet (about 170\" for standard crib) minus 10-15\". Most people use ¼\" braided elastic. Some patterns use elastic only at the corners (4 pieces × 10-12\" each)." },
    { q: "What fabric for crib sheets?", a: "Cotton jersey knit is softest and most popular. Quilting cotton works but is stiffer. Flannel is warm for winter. Always pre-wash — sheets get washed frequently." },
    { q: "Can I use 44\" fabric for a crib sheet?", a: "For a standard 28\" × 52\" mattress: 44\" fabric is NOT wide enough to cut in one piece (you need 28\" + 6\" + 6\" + 4\" tuck = 44\" minimum). Use 60\" fabric for no piecing, or piece the bottom." },
];

export default function Page() {
    const [sizeKey, setSizeKey] = useState<SheetSize>("standard");
    const [customW, setCustomW] = useState(28);
    const [customL, setCustomL] = useState(52);
    const [customD, setCustomD] = useState(6);
    const [fabricWidth, setFabricWidth] = useState(60);
    const [tuckUnder, setTuckUnder] = useState(4);
    const [elasticStyle, setElasticStyle] = useState<"full" | "corner">("full");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const calc = useMemo(() => {
        const preset = sheetSizes.find(s => s.key === sizeKey) || sheetSizes[1];
        const w = sizeKey === "custom" ? customW : preset.w;
        const l = sizeKey === "custom" ? customL : preset.l;
        const d = sizeKey === "custom" ? customD : preset.d;

        const cutW = w + d * 2 + tuckUnder * 2 + 1; // + SA
        const cutL = l + d * 2 + tuckUnder * 2 + 1;

        const needsPiecing = cutW > fabricWidth;
        let yd: number;
        if (!needsPiecing) {
            yd = Math.ceil(cutL / 36 * 4) / 4;
        } else {
            yd = Math.ceil((cutL * 2) / 36 * 4) / 4; // need two lengths
        }

        // Elastic
        const perim = (w + l) * 2;
        const fullElastic = Math.ceil(perim * 0.9); // 10% shorter
        const cornerElastic = 4 * 12;
        const elastic = elasticStyle === "full" ? fullElastic : cornerElastic;

        return { w, l, d, cutW, cutL, yd, needsPiecing, elastic };
    }, [sizeKey, customW, customL, customD, fabricWidth, tuckUnder, elasticStyle]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Baby & Kids", href: "/baby-kids" }, { label: "Crib Sheet" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Baby size={14} strokeWidth={1.5} /> Baby #397</span>
                        <h1>Crib Sheet Calculator</h1>
                        <p>Calculate fabric and elastic for fitted crib sheets. Includes mini crib, standard crib, and toddler bed sizes.</p>
                    </div>

                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>① Mattress Size</h2>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                            {sheetSizes.map(s => (<button key={s.key} className={`btn btn-sm ${sizeKey === s.key ? "btn-primary" : "btn-ghost"}`} onClick={() => setSizeKey(s.key)} style={{ fontSize: 10 }}>{s.name} ({s.w}&quot;×{s.l}&quot;×{s.d}&quot;)</button>))}
                        </div>
                        {sizeKey === "custom" && (
                            <div className="calculator-form-row">
                                <div className="input-group"><label className="input-label">Width</label><input type="number" className="input-field" value={customW} onChange={e => setCustomW(Math.max(10, parseInt(e.target.value) || 28))} /></div>
                                <div className="input-group"><label className="input-label">Length</label><input type="number" className="input-field" value={customL} onChange={e => setCustomL(Math.max(10, parseInt(e.target.value) || 52))} /></div>
                                <div className="input-group"><label className="input-label">Depth</label><input type="number" className="input-field" value={customD} onChange={e => setCustomD(Math.max(2, parseInt(e.target.value) || 6))} /></div>
                            </div>
                        )}
                    </div>

                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>② Options</h2>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Fabric width</label>
                                <div style={{ display: "flex", gap: 3 }}>
                                    {[44, 54, 60].map(w => (<button key={w} className={`btn btn-sm ${fabricWidth === w ? "btn-primary" : "btn-ghost"}`} onClick={() => setFabricWidth(w)} style={{ fontSize: 10 }}>{w}&quot;</button>))}
                                </div>
                            </div>
                            <div className="input-group"><label className="input-label">Tuck-under</label>
                                <div style={{ display: "flex", gap: 3 }}>
                                    {[3, 4, 5].map(t => (<button key={t} className={`btn btn-sm ${tuckUnder === t ? "btn-primary" : "btn-ghost"}`} onClick={() => setTuckUnder(t)} style={{ fontSize: 10 }}>{t}&quot;</button>))}
                                </div>
                            </div>
                            <div className="input-group"><label className="input-label">Elastic</label>
                                <div style={{ display: "flex", gap: 3 }}>
                                    <button className={`btn btn-sm ${elasticStyle === "full" ? "btn-primary" : "btn-ghost"}`} onClick={() => setElasticStyle("full")} style={{ fontSize: 10 }}>Full perimeter</button>
                                    <button className={`btn btn-sm ${elasticStyle === "corner" ? "btn-primary" : "btn-ghost"}`} onClick={() => setElasticStyle("corner")} style={{ fontSize: 10 }}>Corners only</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(200,50%,45%)" }}>
                        <h2 className={styles.calcTitle}>Results</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                            <div style={{ padding: 14, background: "hsl(200,15%,95%)", borderRadius: 10, textAlign: "center" }}>
                                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(200,40%,35%)" }}>Fabric</div>
                                <div style={{ fontSize: 32, fontWeight: 800, color: "hsl(200,50%,30%)" }}>{toFrac(calc.yd)}</div>
                                <div style={{ fontSize: 10 }}>yards ({fabricWidth}&quot; wide)</div>
                            </div>
                            <div style={{ padding: 14, background: "hsl(160,15%,95%)", borderRadius: 10, textAlign: "center" }}>
                                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(160,40%,35%)" }}>Elastic (¼&quot;)</div>
                                <div style={{ fontSize: 32, fontWeight: 800, color: "hsl(160,50%,30%)" }}>{calc.elastic}&quot;</div>
                                <div style={{ fontSize: 10 }}>{toFrac(Math.ceil(calc.elastic / 36 * 4) / 4)} yards</div>
                            </div>
                        </div>
                        <div className={styles.resultDetails}>
                            <div className="result-row"><span>Cut fabric size</span><strong>{calc.cutW}&quot; × {calc.cutL}&quot;</strong></div>
                            <div className="result-row"><span>Mattress</span><strong>{calc.w}&quot;×{calc.l}&quot;×{calc.d}&quot;</strong></div>
                        </div>
                        {calc.needsPiecing && <div style={{ fontSize: 10, color: "hsl(40,70%,35%)", marginTop: 6 }}>⚠ Fabric width {fabricWidth}&quot; is too narrow for {calc.cutW}&quot; cut — piecing required. Consider wider fabric.</div>}
                    </div>

                    <div className="toolbar" style={{ marginBottom: 10 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`Crib sheet (${calc.w}"×${calc.l}"×${calc.d}"): ${toFrac(calc.yd)} yd fabric + ${calc.elastic}" elastic.`)}><ClipboardCopy size={13} /> Copy</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                    </div>

                    <section className="faq-section"><h2>FAQ</h2>
                        <div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (
                            <div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}>
                                <button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button>
                                <div className="faq-answer">{f.a}</div>
                            </div>
                        ))}</div>
                    </section>
                </div>
                <aside className="calculator-sidebar">
                    <div className="glass-card related-tools">
                        <h4>Related Tools</h4>
                        <a href="/baby-kids/baby-quilt" className="related-tool-link">Baby Quilt</a>
                        <a href="/elastic/elastic-calculator" className="related-tool-link">Elastic Calculator</a>
                        <a href="/baby-kids" className="related-tool-link">All Baby & Kids</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}