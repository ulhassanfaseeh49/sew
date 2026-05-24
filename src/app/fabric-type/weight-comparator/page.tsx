"use client";
import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
import { Scale, ClipboardCopy, Printer } from "lucide-react";

const fabricDb = [
    { name: "Chiffon", gsm: 40, drape: 5, projects: "Overlays, scarves" },
    { name: "Voile", gsm: 70, drape: 4, projects: "Blouses, curtains" },
    { name: "Lawn", gsm: 80, drape: 4, projects: "Summer dresses" },
    { name: "Quilting Cotton", gsm: 130, drape: 2, projects: "Quilts, crafts" },
    { name: "Poplin", gsm: 140, drape: 2, projects: "Shirts, dresses" },
    { name: "Linen", gsm: 180, drape: 3, projects: "Garments, home" },
    { name: "Denim (light)", gsm: 220, drape: 2, projects: "Shirts, skirts" },
    { name: "Canvas", gsm: 280, drape: 1, projects: "Bags, upholstery" },
    { name: "Denim (heavy)", gsm: 400, drape: 1, projects: "Jeans, jackets" },
    { name: "Jersey (light)", gsm: 120, drape: 4, projects: "T-shirts" },
    { name: "French Terry", gsm: 250, drape: 3, projects: "Sweatshirts" },
    { name: "Fleece", gsm: 220, drape: 2, projects: "Jackets, blankets" },
    { name: "Minky", gsm: 280, drape: 3, projects: "Baby items, plush" },
    { name: "Silk Charmeuse", gsm: 80, drape: 5, projects: "Formal wear, lingerie" },
    { name: "Velvet", gsm: 300, drape: 3, projects: "Eveningwear" },
    { name: "Ponte", gsm: 300, drape: 2, projects: "Structured knit garments" },
];

export default function Page() {
    const [sel, setSel] = useState<number[]>([0, 3, 6]);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const toggle = (i: number) => { const s = [...sel]; const idx = s.indexOf(i); idx >= 0 ? s.splice(idx, 1) : s.length < 6 && s.push(i); setSel(s); };
    const selected = sel.map(i => fabricDb[i]).filter(Boolean);
    const maxGsm = Math.max(...selected.map(f => f.gsm), 1);

    const faqItems = [
        { q: "Why compare fabric weights?", a: "Weight helps determine suitability for a project. Mixing incompatible weights causes problems — a heavy denim paired with chiffon won't work. Knowing weights helps you choose compatible fabrics for multi-fabric projects." },
        { q: "Can I combine different weight fabrics?", a: "Within 1-2 weight categories is ideal. Using interfacing can help bridge gaps. For lining, it should be lighter than the outer fabric. For patchwork, keep all fabrics in the same weight range." },
    ];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Fabric Type", href: "/fabric-type" }, { label: "Weight Comparator" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Scale size={14} strokeWidth={1.5} /> Fabric #417</span>
                        <h1>Fabric Weight Comparator</h1>
                        <p>Compare up to 6 fabrics by weight. See GSM, oz/yd², drape rating, and project suitability side by side.</p>
                    </div>
                    <div className={`glass-card ${styles.calculatorCard}`}>
                        <h2 className={styles.calcTitle}>Select Fabrics to Compare (up to 6)</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 4 }}>
                            {fabricDb.map((f, i) => (<button key={i} className={`btn btn-sm ${sel.includes(i) ? "btn-primary" : "btn-ghost"}`} onClick={() => toggle(i)} style={{ fontSize: 10 }}>{f.name}</button>))}
                        </div>
                    </div>
                    {selected.length > 0 && (
                        <div className={`glass-card ${styles.calculatorCard}`} style={{ borderLeft: "4px solid hsl(200,50%,45%)" }}>
                            <h2 className={styles.calcTitle}>Comparison</h2>
                            {selected.map((f, i) => (
                                <div key={i} style={{ marginBottom: 10 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                                        <strong style={{ fontSize: 12, minWidth: 100 }}>{f.name}</strong>
                                        <div style={{ flex: 1, height: 16, background: "hsl(0,0%,92%)", borderRadius: 8, overflow: "hidden" }}>
                                            <div style={{ width: `${(f.gsm / maxGsm) * 100}%`, height: "100%", background: `hsl(${200 + i * 30},50%,50%)`, borderRadius: 8, transition: "width .3s" }} />
                                        </div>
                                        <span style={{ fontSize: 11, minWidth: 80 }}>{f.gsm} GSM / {(f.gsm / 33.906).toFixed(1)} oz</span>
                                    </div>
                                    <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginLeft: 108 }}>Drape: {"★".repeat(f.drape)}{"☆".repeat(5 - f.drape)} — {f.projects}</div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="toolbar" style={{ marginBottom: 10 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => { const t = selected.map(f => `${f.name}: ${f.gsm} GSM (${(f.gsm / 33.906).toFixed(1)} oz)`).join(", "); navigator.clipboard.writeText(t); }}><ClipboardCopy size={13} /> Copy</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={13} /> Print</button>
                    </div>
                    <section className="faq-section"><h2>FAQ</h2><div style={{ marginTop: "1.5rem" }}>{faqItems.map((f, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{f.q}<svg className="faq-chevron" width="16" height="10" viewBox="0 0 16 10" fill="none"><path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg></button><div className="faq-answer">{f.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="glass-card related-tools"><h4>Related</h4><a href="/fabric-type/gsm-to-oz" className="related-tool-link">GSM to oz</a><a href="/fabric-type/property-comparator" className="related-tool-link">Property Comparator</a><a href="/fabric-type" className="related-tool-link">All Fabric Type</a></div></aside>
            </div>
        </div>
    );
}