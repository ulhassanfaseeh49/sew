"use client";
import { useState } from "react";
import Link from "next/link";
import { Grid3X3, ChevronDown, BarChart3, Ruler, Info } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const knits = [
    { name: "Jersey (single)", stretch: "25-50%", recovery: "Good", weight: "Light-Medium", uses: "T-shirts, dresses, underwear", needles: "Ball point / stretch", stitches: "Zigzag, stretch stitch" },
    { name: "Interlock", stretch: "15-30%", recovery: "Excellent", weight: "Medium", uses: "Baby clothes, structured knits", needles: "Ball point", stitches: "Zigzag, twin needle" },
    { name: "Rib Knit", stretch: "50-100%", recovery: "Excellent", weight: "Medium", uses: "Cuffs, collars, waistbands", needles: "Ball point / stretch", stitches: "Zigzag, overlock" },
    { name: "French Terry", stretch: "25-40%", recovery: "Good", weight: "Medium-Heavy", uses: "Sweatshirts, joggers", needles: "Ball point", stitches: "Zigzag, overlock" },
    { name: "Ponte di Roma", stretch: "20-30%", recovery: "Excellent", weight: "Medium-Heavy", uses: "Blazers, fit-and-flare, professional", needles: "Universal / ball point", stitches: "Straight or zigzag" },
    { name: "ITY (Interlock Twist Yarn)", stretch: "50-75%", recovery: "Good", weight: "Light-Medium", uses: "Wrap dresses, draped tops", needles: "Ball point", stitches: "Zigzag, stretch" },
    { name: "Spandex/Lycra Blend", stretch: "75-100%+", recovery: "Excellent", weight: "Light-Medium", uses: "Activewear, swimwear, dance", needles: "Stretch needle", stitches: "Zigzag, overlock, coverstitch" },
    { name: "Sweater Knit", stretch: "15-40%", recovery: "Fair-Good", weight: "Medium-Heavy", uses: "Cardigans, pullovers", needles: "Ball point", stitches: "Zigzag, walking foot" },
    { name: "Double Knit", stretch: "15-25%", recovery: "Good", weight: "Medium-Heavy", uses: "Structured garments, coats", needles: "Universal", stitches: "Straight okay" },
    { name: "Power Mesh", stretch: "75-100%+", recovery: "Excellent", weight: "Very Light", uses: "Lingerie lining, dance costumes", needles: "Stretch needle", stitches: "Zigzag, overlock" },
];

const relatedTools = [
    { name: "Stretch % Calculator", href: "/stretch/percentage-calculator", icon: BarChart3 },
    { name: "Stitch Length Guide", href: "/stretch/stitch-length", icon: Ruler },
    { name: "Woven to Knit Converter", href: "/stretch/woven-to-knit-converter", icon: Info },
];

const faqItems = [
    { q: "What's the most versatile knit fabric?", a: "Cotton/lycra jersey is the most versatile — good stretch, good recovery, easy to sew, widely available. Works for T-shirts to casual dresses." },
    { q: "Why does interlock feel different from jersey?", a: "Interlock has two interlocked layers of jersey, making it thicker, smoother on both sides, and more stable. Jersey has a distinct right/wrong side and tends to curl at edges." },
    { q: "Can I substitute one knit for another?", a: "It depends on stretch percentage and recovery. You can substitute knits with similar stretch/recovery values, but drape and weight affect the final look significantly." },
];

export default function KnitTypeComparatorPage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Stretch Tools", href: "/stretch" }, { label: "Knit Types" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Grid3X3 size={14} strokeWidth={1.5} /> Stretch Tool</span>
                        <h1>Knit Type Comparator</h1>
                        <p>Compare stretch, recovery, and sewing requirements for 10 common knit fabric types.</p>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.sectionTitle}>Knit Fabric Comparison</h2>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead><tr><th>Type</th><th>Stretch</th><th>Recovery</th><th>Weight</th><th>Best For</th></tr></thead>
                                <tbody>
                                    {knits.map(k => (
                                        <tr key={k.name}><td style={{ fontFamily: "inherit", fontWeight: 500 }}>{k.name}</td><td>{k.stretch}</td><td style={{ fontFamily: "inherit" }}>{k.recovery}</td><td style={{ fontFamily: "inherit" }}>{k.weight}</td><td style={{ fontFamily: "inherit", fontSize: 13 }}>{k.uses}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {knits.slice(0, 5).map(k => (
                        <div key={k.name} className="calculator-card">
                            <h3 style={{ fontSize: "var(--text-base)", fontWeight: 600, marginBottom: 8 }}>{k.name}</h3>
                            <div className={styles.resultDetails}>
                                <div className="result-row"><span className="result-row-label">Stretch</span><span className="result-row-value">{k.stretch}</span></div>
                                <div className="result-row"><span className="result-row-label">Recovery</span><span className="result-row-value" style={{ fontFamily: "inherit" }}>{k.recovery}</span></div>
                                <div className="result-row"><span className="result-row-label">Weight</span><span className="result-row-value" style={{ fontFamily: "inherit" }}>{k.weight}</span></div>
                                <div className="result-row"><span className="result-row-label">Best for</span><span className="result-row-value" style={{ fontFamily: "inherit" }}>{k.uses}</span></div>
                                <div className="result-row"><span className="result-row-label">Needles</span><span className="result-row-value" style={{ fontFamily: "inherit" }}>{k.needles}</span></div>
                                <div className="result-row"><span className="result-row-label">Stitches</span><span className="result-row-value" style={{ fontFamily: "inherit" }}>{k.stitches}</span></div>
                            </div>
                        </div>
                    ))}
                    <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside>
            </div>
        </div>
    );
}