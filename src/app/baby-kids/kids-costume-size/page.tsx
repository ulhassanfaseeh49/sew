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

type CType = "princess" | "superhero" | "animal" | "fairy" | "pirate" | "witch" | "simple";
const costumeSpecs: { key: CType; name: string; base: number; cape: number; hat: number }[] = [
    { key: "princess", name: "Princess / Dress", base: 2.5, cape: 1, hat: 0.25 },
    { key: "superhero", name: "Superhero", base: 1.5, cape: 1.25, hat: 0.25 },
    { key: "animal", name: "Animal (full body)", base: 2, cape: 0, hat: 0.5 },
    { key: "fairy", name: "Fairy / Wings", base: 2, cape: 0.75, hat: 0.25 },
    { key: "pirate", name: "Pirate", base: 1.5, cape: 0, hat: 0.25 },
    { key: "witch", name: "Witch / Wizard", base: 2, cape: 1.5, hat: 0.5 },
    { key: "simple", name: "Simple (tunic)", base: 1, cape: 0, hat: 0 },
];

type AgeGrp = "2-4" | "5-7" | "8-10" | "11-14";
const ageMulti: Record<AgeGrp, number> = { "2-4": 0.75, "5-7": 1, "8-10": 1.25, "11-14": 1.5 };

const faqItems = [
    { q: "How much fabric for a child's costume?", a: "Simple tunic: ¾–1½ yards. Full dress/gown: 2–4 yards depending on age. Cape adds 1–1.5 yards. Animal suit: 2–3 yards of fleece. Always buy extra — costumes have unusual shapes with more waste." },
    { q: "What is the best fabric for kids' Halloween costumes?", a: "Fleece: easiest for animal suits (no fray, warm). Satin: princess dresses. Cotton: tunics, simple costumes. Felt: great for accessories. Avoid itchy fabrics — comfort matters for kids." },
    { q: "How to make a quick kids' costume?", a: "The fastest: no-sew cape (rectangle of fabric + ribbon tie). Tunic: rectangle folded in half with head+arm holes. Felt accessories turn regular clothes into costumes. Budget: 1-2 hours." },
    { q: "Should costume fabric be pre-washed?", a: "For one-use Halloween costumes: not necessary. For costumes that will see repeated wear (dress-up play): yes, pre-wash. Fleece doesn't need pre-washing. Satin can be dry-cleaned." },
];

export default function Page() {
    const [costumeType, setCostumeType] = useState<CType>("princess");
    const [ageGroup, setAgeGroup] = useState<AgeGrp>("5-7");
    const [includeCape, setIncludeCape] = useState(true);
    const [includeHat, setIncludeHat] = useState(true);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const spec = costumeSpecs.find(c => c.key === costumeType) || costumeSpecs[0];
    const multi = ageMulti[ageGroup];

    const calc = useMemo(() => {
        const mainYd = Math.ceil(spec.base * multi * 4) / 4;
        const capeYd = includeCape && spec.cape > 0 ? Math.ceil(spec.cape * multi * 4) / 4 : 0;
        const hatYd = includeHat && spec.hat > 0 ? Math.ceil(spec.hat * 4) / 4 : 0;
        const totalYd = mainYd + capeYd + hatYd;
        return { mainYd, capeYd, hatYd, totalYd };
    }, [spec, multi, includeCape, includeHat]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Baby & Kids", href: "/baby-kids" }, { label: "Costume Size" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Baby size={14} strokeWidth={1.5} /> Baby #394</span>
                        <h1>Children&apos;s Costume Size Tool</h1>
                        <p>Estimate fabric for children&apos;s costumes by character type and age group. Includes cape and hat/headpiece yardage.</p>
                    </div>

                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Costume Details</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 5, marginBottom: 8 }}>
                            {costumeSpecs.map(c => (
                                <button key={c.key} className={`btn btn-sm ${costumeType === c.key ? "btn-primary" : "btn-ghost"}`} onClick={() => setCostumeType(c.key)} style={{ fontSize: 10 }}>{c.name}</button>
                            ))}
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Age group</label>
                                <div style={{ display: "flex", gap: 3 }}>
                                    {(["2-4", "5-7", "8-10", "11-14"] as AgeGrp[]).map(a => (
                                        <button key={a} className={`btn btn-sm ${ageGroup === a ? "btn-primary" : "btn-ghost"}`} onClick={() => setAgeGroup(a)} style={{ fontSize: 10 }}>{a} yrs</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                            {spec.cape > 0 && <label style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}><input type="checkbox" checked={includeCape} onChange={e => setIncludeCape(e.target.checked)} /> Cape</label>}
                            {spec.hat > 0 && <label style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}><input type="checkbox" checked={includeHat} onChange={e => setIncludeHat(e.target.checked)} /> Hat/headpiece</label>}
                        </div>
                    </div>

                    <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(280,50%,45%)" }}>
                        <h2 className={styles.calcTitle}>Fabric Estimate</h2>
                        <div style={{ padding: 14, background: "hsl(280,15%,95%)", borderRadius: 10, textAlign: "center", marginBottom: 12 }}>
                            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "hsl(280,40%,35%)" }}>Total Fabric</div>
                            <div style={{ fontSize: 36, fontWeight: 800, color: "hsl(280,50%,30%)" }}>{toFrac(calc.totalYd)}</div>
                            <div style={{ fontSize: 10 }}>yards</div>
                        </div>
                        <div className={styles.resultDetails}>
                            <div className="result-row"><span>Main costume</span><strong>{toFrac(calc.mainYd)} yd</strong></div>
                            {calc.capeYd > 0 && <div className="result-row"><span>Cape / cloak</span><strong>{toFrac(calc.capeYd)} yd</strong></div>}
                            {calc.hatYd > 0 && <div className="result-row"><span>Hat / headpiece</span><strong>{toFrac(calc.hatYd)} yd</strong></div>}
                        </div>
                    </div>

                    <div className="toolbar" style={{ marginBottom: 10 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`${spec.name} costume (ages ${ageGroup}): ${toFrac(calc.totalYd)} yd total.`)}><ClipboardCopy size={13} /> Copy</button>
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
                        <a href="/costume/costume-yardage" className="related-tool-link">Adult Costume Yardage</a>
                        <a href="/baby-kids/baby-clothing-yardage" className="related-tool-link">Baby Clothing</a>
                        <a href="/baby-kids" className="related-tool-link">All Baby & Kids</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}