"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Settings, Copy, Printer, ChevronDown, BarChart3, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Stitch Length Guide", href: "/stretch/stitch-length", icon: Ruler },
    { name: "Knit Types", href: "/stretch/knit-type-comparator", icon: BarChart3 },
    { name: "All Stretch Tools", href: "/stretch", icon: Settings },
];

const faqItems = [
    { q: "What is differential feed?", a: "Differential feed is a serger/overlocker feature with two sets of feed dogs that can move at different speeds. When the front feeds faster than the back, fabric gathers. When slower, it stretches." },
    { q: "What setting for wavy lettuce edges?", a: "Set differential feed to 0.6-0.7 (front slower than back). The fabric stretches as it feeds, creating the distinctive wavy lettuce-edge finish." },
    { q: "What setting to prevent stretching at seams?", a: "Set differential feed to 1.3-2.0 (front faster than back). This gently gathers the fabric at the feed, counteracting the stretch that sewing naturally creates." },
];

export default function DifferentialFeedPage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Stretch Tools", href: "/stretch" }, { label: "Differential Feed" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Settings size={14} strokeWidth={1.5} /> Stretch Tool</span>
                        <h1>Differential Feed Guide</h1>
                        <p>Serger/overlocker differential feed settings for perfect knit seams without stretching or puckering.</p>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.sectionTitle}>Differential Feed Settings</h2>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead><tr><th>Setting</th><th>Effect</th><th>Best For</th></tr></thead>
                                <tbody>
                                    {[
                                        ["0.6 - 0.7", "Stretches fabric (wavy edge)", "Lettuce edges, decorative effects"],
                                        ["0.7 - 0.9", "Slight stretch", "Lightweight wovens, gentle wave"],
                                        ["1.0", "Neutral (no change)", "Stable fabrics, wovens"],
                                        ["1.0 - 1.3", "Slight gather (prevents stretch)", "Light knits, jersey"],
                                        ["1.3 - 1.5", "Moderate gather", "Medium knits, interlock"],
                                        ["1.5 - 2.0", "Strong gather", "Very stretchy knits, swimwear, rib knit"],
                                    ].map(([s, e, b]) => (
                                        <tr key={s}><td style={{ fontWeight: 600 }}>{s}</td><td style={{ fontFamily: "inherit" }}>{e}</td><td style={{ fontFamily: "inherit" }}>{b}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.sectionTitle}>Settings by Fabric Type</h2>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead><tr><th>Fabric</th><th>Recommended</th><th>Notes</th></tr></thead>
                                <tbody>
                                    {[
                                        ["Cotton jersey", "1.0 - 1.3", "Light gather prevents wavy seams"],
                                        ["Interlock", "1.0 - 1.3", "Very stable, minimal adjustment"],
                                        ["Rib knit", "1.5 - 2.0", "Very stretchy, needs strong gather"],
                                        ["Lycra/spandex", "1.5 - 2.0", "High stretch, high differential"],
                                        ["Swimwear", "1.5 - 2.0", "Very stretchy, test on scraps first"],
                                        ["Ponte", "1.0", "Stable knit, usually neutral"],
                                        ["French terry", "1.0 - 1.3", "Medium stretch"],
                                        ["Sweater knit", "1.3 - 1.5", "Watch for stretching"],
                                    ].map(([f, r, n]) => (
                                        <tr key={f}><td style={{ fontFamily: "inherit", fontWeight: 500 }}>{f}</td><td style={{ fontWeight: 600 }}>{r}</td><td style={{ fontFamily: "inherit", fontSize: 13 }}>{n}</td></tr>
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