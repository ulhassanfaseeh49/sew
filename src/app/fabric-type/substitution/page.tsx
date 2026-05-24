"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Scale, ClipboardCopy, Printer } from "lucide-react";

const subs: { orig: string; alts: { name: string; match: number; note: string }[] }[] = [
    { orig: "Silk Charmeuse", alts: [{ name: "Polyester Charmeuse", match: 85, note: "Similar drape, fraction of cost. Doesn't breathe as well." }, { name: "Satin-back Crepe", match: 75, note: "Heavier body, less slippery to sew." }, { name: "Rayon Challis", match: 60, note: "Different texture but similar drape. Machine washable." }] },
    { orig: "Silk Chiffon", alts: [{ name: "Polyester Chiffon", match: 80, note: "Very close match. Slightly stiffer." }, { name: "Polyester Georgette", match: 75, note: "Slightly heavier, less transparent." }] },
    { orig: "Linen", alts: [{ name: "Linen-Cotton Blend", match: 85, note: "Less wrinkly, slightly less breathable." }, { name: "Cotton Chambray", match: 70, note: "Similar weight, less texture." }, { name: "Rayon", match: 60, note: "Similar drape but stretches. Not as durable." }] },
    { orig: "Wool Melton", alts: [{ name: "Boiled Wool", match: 80, note: "Similar weight and warmth." }, { name: "Thick Ponte", match: 65, note: "Stretch alternative, machine washable." }] },
    { orig: "Cotton Lawn", alts: [{ name: "Cotton Batiste", match: 90, note: "Very similar. Batiste slightly heavier." }, { name: "Cotton Voile", match: 75, note: "More transparent, similar drape." }] },
    { orig: "Velvet", alts: [{ name: "Velveteen", match: 80, note: "Easier to sew, more affordable." }, { name: "Stretch Velvet", match: 70, note: "Easier to fit but different look." }] },
    { orig: "Cashmere", alts: [{ name: "Fine Merino Wool", match: 75, note: "Less soft but much more affordable." }, { name: "Wool/Acrylic Blend", match: 55, note: "Budget option. Machine washable." }] },
];

export default function Page() {
    const [origIdx, setOrigIdx] = useState(0);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const sub = subs[origIdx];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Fabric Type", href: "/fabric-type" }, { label: "Substitution" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Scale size={14} strokeWidth={1.5} /> Fabric #421</span>
                        <h1>Fabric Substitution Tool</h1>
                        <p>Can&apos;t find or afford the recommended fabric? Find alternatives with match scores and adjustment notes.</p>
                    </div>
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Original Fabric</h2>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                            {subs.map((s, i) => (<button key={i} className={`btn btn-sm ${origIdx === i ? "btn-primary" : "btn-ghost"}`} onClick={() => setOrigIdx(i)} style={{ fontSize: 10 }}>{s.orig}</button>))}
                        </div>
                    </div>
                    <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(160,50%,40%)" }}>
                        <h2 className={styles.calcTitle}>Substitutes for {sub.orig}</h2>
                        {sub.alts.map((a, i) => (
                            <div key={i} style={{ padding: "8px 0", borderBottom: i < sub.alts.length - 1 ? "1px solid hsl(0,0%,92%)" : "none" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <strong style={{ fontSize: 13 }}>{a.name}</strong>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: a.match >= 80 ? "hsl(160,50%,35%)" : a.match >= 65 ? "hsl(40,60%,40%)" : "hsl(0,50%,45%)" }}>{a.match}% match</span>
                                </div>
                                <div style={{ marginTop: 3, height: 6, background: "hsl(0,0%,92%)", borderRadius: 3, overflow: "hidden" }}>
                                    <div style={{ width: `${a.match}%`, height: "100%", background: a.match >= 80 ? "hsl(160,50%,45%)" : a.match >= 65 ? "hsl(40,60%,50%)" : "hsl(0,50%,50%)", borderRadius: 3 }} />
                                </div>
                                <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 3 }}>{a.note}</div>
                            </div>
                        ))}
                    </div>
                    <div className="toolbar" style={{ marginBottom: 10 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(sub.alts.map(a => `${a.name} (${a.match}%): ${a.note}`).join("\n"))}><ClipboardCopy size={13} /> Copy</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                    </div>
                    <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{[{ q: "How accurate are match scores?", a: "Match scores compare weight, drape, and sewing behavior. 80%+ is very close. 60-80% works with adjustments. Below 60% is a significant compromise — expect different results." }].map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/fabric-type/property-comparator" className="related-tool-link">Property Comparator</a><a href="/fabric-type/selection-guide" className="related-tool-link">Selection Guide</a><a href="/fabric-type" className="related-tool-link">All Fabric Type</a></div></aside>
            </div>
        </div>
    );
}