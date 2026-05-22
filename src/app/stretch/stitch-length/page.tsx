"use client";
import { useState } from "react";
import Link from "next/link";
import { Ruler, ChevronDown, BarChart3, Info } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Stretch % Calculator", href: "/stretch/percentage-calculator", icon: BarChart3 },
    { name: "Knit Type Comparator", href: "/stretch/knit-type-comparator", icon: Info },
    { name: "Differential Feed", href: "/stretch/differential-feed", icon: Ruler },
];

const faqItems = [
    { q: "What stitch length for knits?", a: "Use a longer stitch (2.5-3mm) for standard seams and a shorter stitch (1.5-2mm) for areas that need stability like necklines. Always use a stretch stitch or zigzag." },
    { q: "Why does my knit fabric pucker?", a: "Puckering comes from tension too tight, stitch too short, wrong needle (use ball point), or fabric being stretched while sewing. Use a walking foot and let fabric feed naturally." },
    { q: "Do I need a serger for knits?", a: "No, but it helps. A regular machine with zigzag or stretch stitch works well for most knit projects. A serger trims, sews, and finishes in one step." },
];

export default function StitchLengthPage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Stretch Tools", href: "/stretch" }, { label: "Stitch Length Guide" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Stretch Tool</span>
                        <h1>Knit Stitch Length Guide</h1>
                        <p>Recommended stitch types and lengths for every stretch fabric application.</p>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.sectionTitle}>Stitch Settings by Application</h2>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead><tr><th>Application</th><th>Stitch Type</th><th>Length</th><th>Width</th><th>Notes</th></tr></thead>
                                <tbody>
                                    {[
                                        ["Regular seam", "Zigzag or stretch", "2.5-3mm", "1-1.5mm", "Most versatile"],
                                        ["Neckline", "Short zigzag", "1.5-2mm", "0.5-1mm", "Stabilize with clear elastic"],
                                        ["Hemming", "Twin needle", "3mm", "N/A", "Stretchy hem, professional look"],
                                        ["Topstitching", "Stretch stitch", "3mm", "N/A", "Lightning bolt stitch if available"],
                                        ["Activewear seams", "3-step zigzag", "2.5mm", "2-3mm", "Very stretchy, flat"],
                                        ["Swimwear", "Zigzag + overlock", "2mm", "2mm", "Double stitch for security"],
                                        ["Lightweight jersey", "Narrow zigzag", "2.5mm", "0.5mm", "Almost invisible"],
                                        ["Heavy knit", "Straight + zigzag", "3mm", "—", "Straight first, zigzag to finish"],
                                    ].map(([a, s, l, w, n]) => (
                                        <tr key={a}><td style={{ fontFamily: "inherit", fontWeight: 500 }}>{a}</td><td style={{ fontFamily: "inherit" }}>{s}</td><td>{l}</td><td>{w}</td><td style={{ fontFamily: "inherit", fontSize: 13 }}>{n}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.sectionTitle}>Needle Guide for Knits</h2>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead><tr><th>Needle Type</th><th>Size</th><th>Best For</th></tr></thead>
                                <tbody>
                                    {[["Ball Point (Jersey)", "70/10 - 90/14", "Most knits, jersey, interlock"], ["Stretch Needle", "75/11 - 90/14", "Lycra, spandex, swimwear, power mesh"], ["Twin Needle", "2.5mm - 4mm gap", "Hemming knits (stretch topstitch)"], ["Universal", "80/12", "Ponte, double knit (stable knits only)"]].map(([t, s, b]) => (
                                        <tr key={t}><td style={{ fontFamily: "inherit", fontWeight: 500 }}>{t}</td><td>{s}</td><td style={{ fontFamily: "inherit" }}>{b}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside>
            </div>
        </div>
    );
}