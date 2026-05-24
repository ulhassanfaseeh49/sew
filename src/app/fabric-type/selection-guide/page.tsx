"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Scale, ClipboardCopy, Printer } from "lucide-react";

type Project = "blouse" | "dress" | "pants" | "jacket" | "quilt" | "bag" | "curtain" | "upholstery" | "activewear" | "formal";
const projRecs: Record<Project, { recs: string[]; avoid: string[]; weight: string }> = {
    blouse: { recs: ["Voile", "Lawn", "Silk crepe", "Rayon challis", "Cotton batiste"], avoid: ["Canvas", "Denim", "Fleece", "Upholstery"], weight: "80-150 GSM" },
    dress: { recs: ["Rayon", "Linen", "Cotton sateen", "Ponte", "Crepe"], avoid: ["Canvas", "Heavy denim", "Interfacing"], weight: "100-250 GSM" },
    pants: { recs: ["Twill", "Denim", "Linen", "Cotton drill", "Ponte"], avoid: ["Chiffon", "Voile", "Organza"], weight: "180-350 GSM" },
    jacket: { recs: ["Wool coating", "Denim", "Canvas", "Ponte", "Boiled wool"], avoid: ["Chiffon", "Voile", "Lawn"], weight: "250-450 GSM" },
    quilt: { recs: ["Quilting cotton", "Cotton broadcloth", "Batik", "Homespun"], avoid: ["Stretch fabrics", "Slippery fabrics", "Very heavy fabrics"], weight: "100-160 GSM" },
    bag: { recs: ["Canvas", "Duck", "Denim", "Cordura", "Cork fabric"], avoid: ["Chiffon", "Silk", "Lightweight knits"], weight: "250-500+ GSM" },
    curtain: { recs: ["Linen", "Cotton duck", "Voile", "Velvet", "Drapery fabric"], avoid: ["Stretchy knits", "Heavy upholstery"], weight: "100-300 GSM" },
    upholstery: { recs: ["Upholstery fabric", "Canvas", "Sunbrella", "Duck", "Tapestry"], avoid: ["Lightweight wovens", "Knits", "Silk"], weight: "300-600+ GSM" },
    activewear: { recs: ["Performance jersey", "Supplex", "Lycra blend", "Moisture-wicking knit"], avoid: ["Wovens", "Heavy fabrics", "Non-stretch"], weight: "150-250 GSM" },
    formal: { recs: ["Silk charmeuse", "Duchess satin", "Velvet", "Brocade", "Chiffon overlay"], avoid: ["Canvas", "Denim", "Fleece"], weight: "80-350 GSM" },
};

const faqItems = [
    { q: "How do I choose the right fabric?", a: "Start with your project type, then consider: weight, drape, stretch, care needs, and your skill level. This guide narrows down options based on your project." },
    { q: "What if the recommended fabric is too expensive?", a: "Use our Fabric Substitution Tool to find affordable alternatives. Polyester versions of silk, cotton canvas instead of linen — there's almost always a budget-friendly swap." },
];

export default function Page() {
    const [project, setProject] = useState<Project>("dress");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const rec = projRecs[project];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Fabric Type", href: "/fabric-type" }, { label: "Selection Guide" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Scale size={14} strokeWidth={1.5} /> Fabric #418</span>
                        <h1>Fabric Type Selection Guide</h1>
                        <p>Don&apos;t know what fabric to buy? Select your project and get recommendations.</p>
                    </div>
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>What Are You Making?</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: 4 }}>
                            {(Object.keys(projRecs) as Project[]).map(p => (<button key={p} className={`btn btn-sm ${project === p ? "btn-primary" : "btn-ghost"}`} onClick={() => setProject(p)} style={{ fontSize: 10, textTransform: "capitalize" }}>{p}</button>))}
                        </div>
                    </div>
                    <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(160,50%,40%)" }}>
                        <h2 className={styles.calcTitle} style={{ textTransform: "capitalize" }}>Best Fabrics for {project}</h2>
                        <div style={{ fontSize: 11, marginBottom: 8, color: "var(--color-text-secondary)" }}>Recommended weight: <strong>{rec.weight}</strong></div>
                        <div style={{ marginBottom: 12 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "hsl(160,40%,30%)", marginBottom: 4 }}>✅ Recommended:</div>
                            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                                {rec.recs.map((r, i) => (<span key={i} style={{ fontSize: 11, padding: "3px 8px", background: "hsl(160,20%,95%)", borderRadius: 6 }}>{r}</span>))}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "hsl(0,40%,40%)", marginBottom: 4 }}>❌ Avoid:</div>
                            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                                {rec.avoid.map((r, i) => (<span key={i} style={{ fontSize: 11, padding: "3px 8px", background: "hsl(0,20%,95%)", borderRadius: 6 }}>{r}</span>))}
                            </div>
                        </div>
                    </div>
                    <div className="toolbar" style={{ marginBottom: 10 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(`${project}: ${rec.recs.join(", ")} (${rec.weight})`)}><ClipboardCopy size={13} /> Copy</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                    </div>
                    <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/fabric-type/substitution" className="related-tool-link">Substitution Tool</a><a href="/fabric-type/property-comparator" className="related-tool-link">Property Comparator</a><a href="/fabric-type" className="related-tool-link">All Fabric Type</a></div></aside>
            </div>
        </div>
    );
}