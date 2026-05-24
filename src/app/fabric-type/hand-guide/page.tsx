"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Scale, Printer } from "lucide-react";

const handChars = [
    { name: "Drape", scale: ["Crisp/stiff", "Semi-crisp", "Medium", "Fluid", "Liquid"], desc: "How fabric falls with gravity" },
    { name: "Body", scale: ["Limp", "Soft", "Medium", "Firm", "Stiff"], desc: "Structural integrity" },
    { name: "Surface", scale: ["Smooth", "Slightly textured", "Medium texture", "Rough", "Very textured"], desc: "How fabric feels to touch" },
    { name: "Resilience", scale: ["No recovery", "Slight spring", "Medium", "Springy", "Very springy"], desc: "Returns to shape when crushed" },
];

const fabricHands = [
    { name: "Silk Charmeuse", drape: 5, body: 1, surface: 1, resilience: 2, use: "Lingerie, formal wear" },
    { name: "Quilting Cotton", drape: 2, body: 3, surface: 2, resilience: 2, use: "Quilts, crafts, structured" },
    { name: "Wool Crepe", drape: 3, body: 3, surface: 2, resilience: 4, use: "Dresses, suits" },
    { name: "Linen", drape: 3, body: 3, surface: 3, resilience: 1, use: "Summer garments" },
    { name: "Organza", drape: 1, body: 5, surface: 1, resilience: 3, use: "Overlays, structured" },
    { name: "Jersey Knit", drape: 4, body: 2, surface: 1, resilience: 3, use: "T-shirts, casual" },
    { name: "Denim", drape: 2, body: 4, surface: 3, resilience: 2, use: "Jeans, jackets, bags" },
    { name: "Velvet", drape: 3, body: 3, surface: 4, resilience: 2, use: "Eveningwear, pillows" },
];

export default function Page() {
    const [selDrape, setSelDrape] = useState(0);
    const [selBody, setSelBody] = useState(0);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const matches = selDrape === 0 && selBody === 0 ? fabricHands : fabricHands.filter(f => {
        const dm = selDrape === 0 || Math.abs(f.drape - selDrape) <= 1;
        const bm = selBody === 0 || Math.abs(f.body - selBody) <= 1;
        return dm && bm;
    });

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Fabric Type", href: "/fabric-type" }, { label: "Hand Guide" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Scale size={14} strokeWidth={1.5} /> Fabric #424</span>
                        <h1>Fabric Hand Guide</h1>
                        <p>Understand fabric &quot;hand&quot; — the feel and behavior — with interactive drape and body selectors.</p>
                    </div>
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>What Hand Do You Want?</h2>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Drape</label>
                                <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>{[0, 1, 2, 3, 4, 5].map(v => (<button key={v} className={`btn btn-sm ${selDrape === v ? "btn-primary" : "btn-ghost"}`} onClick={() => setSelDrape(v)} style={{ fontSize: 10 }}>{v === 0 ? "Any" : handChars[0].scale[v - 1]}</button>))}</div>
                            </div>
                            <div className="input-group"><label className="input-label">Body</label>
                                <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>{[0, 1, 2, 3, 4, 5].map(v => (<button key={v} className={`btn btn-sm ${selBody === v ? "btn-primary" : "btn-ghost"}`} onClick={() => setSelBody(v)} style={{ fontSize: 10 }}>{v === 0 ? "Any" : handChars[1].scale[v - 1]}</button>))}</div>
                            </div>
                        </div>
                    </div>
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Matching Fabrics ({matches.length})</h2>
                        {matches.length === 0 ? <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>No exact matches — try broader settings.</div> : matches.map((f, i) => (
                            <div key={i} style={{ padding: "6px 0", borderBottom: i < matches.length - 1 ? "1px solid hsl(0,0%,92%)" : "none" }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}><strong style={{ fontSize: 12 }}>{f.name}</strong><span style={{ fontSize: 10, color: "var(--color-text-secondary)" }}>{f.use}</span></div>
                                <div style={{ display: "flex", gap: 6, marginTop: 3 }}>
                                    {(["drape", "body", "surface", "resilience"] as const).map((p, pi) => (
                                        <span key={p} style={{ fontSize: 9, color: "var(--color-text-tertiary)" }}>{handChars[pi].name}: {"●".repeat(f[p])}{"○".repeat(5 - f[p])}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="toolbar" style={{ marginBottom: 10 }}><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button></div>
                    <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{[{ q: "What is fabric 'hand'?", a: "Hand describes how fabric feels and behaves — its drape, body, surface texture, and resilience. Two fabrics of the same weight can have completely different hand. Hand determines if a fabric works for a specific project." }].map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/fabric-type/property-comparator" className="related-tool-link">Property Comparator</a><a href="/fabric-type/selection-guide" className="related-tool-link">Selection Guide</a><a href="/fabric-type" className="related-tool-link">All Fabric Type</a></div></aside>
            </div>
        </div>
    );
}