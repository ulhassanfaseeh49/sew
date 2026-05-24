"use client";
import { useState, useMemo } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Scale, ClipboardCopy, Printer } from "lucide-react";

function toFrac(v: number): string {
    if (v <= 0) return "0"; const w = Math.floor(v); const f = v - w;
    const map: [number, string][] = [[0, ""], [0.125, "⅛"], [0.25, "¼"], [0.375, "⅜"], [0.5, "½"], [0.625, "⅝"], [0.75, "¾"], [0.875, "⅞"]];
    let best = map[0], bd = 1;
    for (const [n, s] of map) { const d = Math.abs(f - n); if (d < bd) { bd = d; best = [n, s]; } }
    if (Math.abs(f - 1) < bd) return `${w + 1}`; if (!best[1]) return w > 0 ? `${w}` : "0";
    return w > 0 ? `${w} ${best[1]}` : `${best[1]}`;
}

const fabricTypes = [
    { name: "Silk Chiffon", gsm: 40, width: 44 },
    { name: "Cotton Voile", gsm: 70, width: 44 },
    { name: "Quilting Cotton", gsm: 130, width: 44 },
    { name: "Linen", gsm: 180, width: 54 },
    { name: "Light Denim", gsm: 220, width: 60 },
    { name: "Canvas (light)", gsm: 280, width: 60 },
    { name: "Fleece", gsm: 220, width: 60 },
    { name: "Heavy Denim", gsm: 400, width: 60 },
    { name: "Heavy Canvas", gsm: 450, width: 60 },
];

export default function Page() {
    const [mode, setMode] = useState<"w2y" | "y2w">("w2y");
    const [weight, setWeight] = useState("");
    const [fabricIdx, setFabricIdx] = useState(2);
    const [fabricWidth, setFabricWidth] = useState(44);
    const [yardage, setYardage] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const fType = fabricTypes[fabricIdx];
    const gsmUsed = parseFloat(weight) || fType.gsm;
    const wUsed = fabricWidth;

    const calc = useMemo(() => {
        if (mode === "w2y") {
            const totalGrams = parseFloat(weight) || 0;
            if (totalGrams <= 0) return null;
            // area in sq meters for given weight
            const sqMeters = totalGrams / gsmUsed;
            const widthM = wUsed * 0.0254;
            const lengthM = sqMeters / widthM;
            const yd = lengthM / 0.9144;
            return { yd: Math.round(yd * 100) / 100, sqMeters, weightG: totalGrams, weightOz: totalGrams / 28.3495 };
        } else {
            const yd = parseFloat(yardage) || 0;
            if (yd <= 0) return null;
            const lengthM = yd * 0.9144;
            const widthM = wUsed * 0.0254;
            const sqMeters = lengthM * widthM;
            const totalGrams = sqMeters * gsmUsed;
            return { yd, sqMeters, weightG: Math.round(totalGrams), weightOz: totalGrams / 28.3495 };
        }
    }, [mode, weight, yardage, gsmUsed, wUsed]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Fabric Type", href: "/fabric-type" }, { label: "Yardage by Weight" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Scale size={14} strokeWidth={1.5} /> Fabric #427</span>
                        <h1>Fabric Yardage by Weight Calculator</h1>
                        <p>Convert between fabric weight (grams/ounces) and yardage. Essential for thrift store and bulk fabric purchases.</p>
                    </div>
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Mode</h2>
                        <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                            <button className={`btn btn-sm ${mode === "w2y" ? "btn-primary" : "btn-ghost"}`} onClick={() => setMode("w2y")} style={{ fontSize: 10 }}>Weight → Yardage</button>
                            <button className={`btn btn-sm ${mode === "y2w" ? "btn-primary" : "btn-ghost"}`} onClick={() => setMode("y2w")} style={{ fontSize: 10 }}>Yardage → Weight</button>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Fabric type</label>
                                <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                                    {fabricTypes.map((f, i) => (<button key={i} className={`btn btn-sm ${fabricIdx === i ? "btn-primary" : "btn-ghost"}`} onClick={() => { setFabricIdx(i); setFabricWidth(f.width); }} style={{ fontSize: 9 }}>{f.name}</button>))}
                                </div>
                            </div>
                        </div>
                        <div className="calculator-form-row">
                            {mode === "w2y" ? (
                                <div className="input-group"><label className="input-label">Total weight (grams)</label>
                                    <input type="number" className="input-field" placeholder="e.g. 500" value={weight} onChange={e => setWeight(e.target.value)} min={0} /></div>
                            ) : (
                                <div className="input-group"><label className="input-label">Yardage</label>
                                    <input type="number" className="input-field" placeholder="e.g. 3" value={yardage} onChange={e => setYardage(e.target.value)} min={0} step={0.25} /></div>
                            )}
                            <div className="input-group"><label className="input-label">Fabric width (in)</label>
                                <div style={{ display: "flex", gap: 3 }}>
                                    {[44, 54, 60].map(w => (<button key={w} className={`btn btn-sm ${fabricWidth === w ? "btn-primary" : "btn-ghost"}`} onClick={() => setFabricWidth(w)} style={{ fontSize: 10 }}>{w}&quot;</button>))}
                                </div>
                            </div>
                        </div>
                    </div>
                    {calc && (
                        <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(200,50%,45%)" }}>
                            <h2 className={styles.calcTitle}>Result</h2>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                                <div style={{ padding: 14, background: "hsl(200,15%,95%)", borderRadius: 10, textAlign: "center" }}>
                                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(200,40%,35%)" }}>Yardage</div>
                                    <div style={{ fontSize: 32, fontWeight: 800, color: "hsl(200,50%,30%)" }}>{toFrac(calc.yd)}</div>
                                    <div style={{ fontSize: 10 }}>yards</div>
                                </div>
                                <div style={{ padding: 14, background: "hsl(160,15%,95%)", borderRadius: 10, textAlign: "center" }}>
                                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(160,40%,35%)" }}>Weight</div>
                                    <div style={{ fontSize: 32, fontWeight: 800, color: "hsl(160,50%,30%)" }}>{calc.weightG}g</div>
                                    <div style={{ fontSize: 10 }}>{calc.weightOz.toFixed(1)} oz ({(calc.weightOz / 16).toFixed(2)} lbs)</div>
                                </div>
                            </div>
                            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>Based on {fType.name} at {gsmUsed} GSM, {wUsed}&quot; wide</div>
                        </div>
                    )}
                    <div className="toolbar" style={{ marginBottom: 10 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(calc ? `${toFrac(calc.yd)} yd = ${calc.weightG}g (${fType.name})` : "")}><ClipboardCopy size={13} /> Copy</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                    </div>
                    <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{[{ q: "How do I estimate yardage from a pile of fabric?", a: "Weigh the fabric in grams. Select the fabric type (or enter GSM if known). Enter the fabric width. The calculator estimates yardage based on the weight-to-area relationship." }, { q: "Why buy fabric by weight?", a: "Thrift stores, estate sales, and mill-end shops often sell by the pound. Knowing the effective cost per yard helps you decide if it's a good deal. This calculator converts weight to yardage for comparison shopping." }].map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/fabric-type/gsm-to-oz" className="related-tool-link">GSM to oz</a><a href="/fabric-type/weight-comparator" className="related-tool-link">Weight Comparator</a><a href="/fabric-type" className="related-tool-link">All Fabric Type</a></div></aside>
            </div>
        </div>
    );
}