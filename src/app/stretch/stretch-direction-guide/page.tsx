"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeftRight, ChevronDown, BarChart3, Ruler, Info } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Stretch % Calculator", href: "/stretch/percentage-calculator", icon: BarChart3 },
    { name: "Knit Types", href: "/stretch/knit-type-comparator", icon: Info },
    { name: "Negative Ease", href: "/stretch/negative-ease", icon: Ruler },
];

const faqItems = [
    { q: "What is stretch direction?", a: "Fabric has two main stretch directions: cross-grain (width, selvage to selvage) which typically has the most stretch, and lengthwise (parallel to selvage) which has less. Some fabrics have 4-way stretch (both directions equally)." },
    { q: "Why does pattern grainline matter for knits?", a: "The pattern places the greatest stretch direction where the body needs it most — usually around the body (cross-grain). Placing the pattern wrong means the garment won't fit properly." },
    { q: "What is 4-way stretch?", a: "4-way stretch means the fabric stretches significantly in both directions (cross-grain AND lengthwise). Most activewear and swimwear requires 4-way stretch. Standard jersey is 2-way (mainly cross-grain)." },
];

export default function StretchDirectionGuidePage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Stretch Tools", href: "/stretch" }, { label: "Stretch Direction" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><ArrowLeftRight size={14} strokeWidth={1.5} /> Stretch Tool</span>
                        <h1>Stretch Direction Guide</h1>
                        <p>Understand cross-grain vs lengthwise stretch and how to align patterns correctly on knit fabrics.</p>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.sectionTitle}>Stretch Direction Reference</h2>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead><tr><th>Direction</th><th>Description</th><th>Typical Stretch</th><th>Pattern Placement</th></tr></thead>
                                <tbody>
                                    {[
                                        ["Cross-grain (width)", "Selvage to selvage", "Greater stretch (25-100%)", "Around the body (bust, waist, hip)"],
                                        ["Lengthwise (length)", "Parallel to selvage", "Less stretch (10-30%)", "Up and down the body"],
                                        ["Bias (45°)", "Diagonal", "Maximum drape", "Rarely used in knits"],
                                    ].map(([d, desc, s, p]) => (
                                        <tr key={d}><td style={{ fontFamily: "inherit", fontWeight: 500 }}>{d}</td><td style={{ fontFamily: "inherit" }}>{desc}</td><td>{s}</td><td style={{ fontFamily: "inherit" }}>{p}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.sectionTitle}>2-Way vs 4-Way Stretch</h2>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead><tr><th>Type</th><th>Cross-grain</th><th>Lengthwise</th><th>Suitable For</th></tr></thead>
                                <tbody>
                                    {[
                                        ["2-way stretch", "High (25-75%)", "Low (5-15%)", "T-shirts, casual dresses, basics"],
                                        ["4-way stretch", "High (50-100%)", "High (30-75%)", "Activewear, swimwear, dance, compression"],
                                    ].map(([t, c, l, s]) => (
                                        <tr key={t}><td style={{ fontFamily: "inherit", fontWeight: 600 }}>{t}</td><td>{c}</td><td>{l}</td><td style={{ fontFamily: "inherit" }}>{s}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.sectionTitle}>How to Test Direction</h2>
                        <ol style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", paddingLeft: 20, lineHeight: 1.8 }}>
                            <li>Identify the selvage (finished edge). Cross-grain runs perpendicular to it.</li>
                            <li>Cut a 4&quot; swatch. Mark which direction is cross-grain.</li>
                            <li>Test stretch in each direction separately.</li>
                            <li>Most stretch = cross-grain. This goes around the body.</li>
                            <li>If both directions stretch equally = 4-way stretch fabric.</li>
                        </ol>
                    </div>
                    <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside>
            </div>
        </div>
    );
}