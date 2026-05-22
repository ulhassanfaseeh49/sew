"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeftRight, Copy, Printer, ChevronDown, BookOpen, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const conversions = [
    { eu: 60, us: 8, singer: 8, use: "Very fine: silk, organza" },
    { eu: 65, us: 9, singer: 9, use: "Fine: batiste, chiffon" },
    { eu: 70, us: 10, singer: 10, use: "Light: lawn, voile" },
    { eu: 75, us: 11, singer: 11, use: "Light-medium: poplin" },
    { eu: 80, us: 12, singer: 12, use: "Medium: quilting cotton, linen" },
    { eu: 90, us: 14, singer: 14, use: "Medium-heavy: denim, corduroy" },
    { eu: 100, us: 16, singer: 16, use: "Heavy: canvas, upholstery" },
    { eu: 110, us: 18, singer: 18, use: "Very heavy: heavy denim" },
    { eu: 120, us: 20, singer: 21, use: "Extra heavy: heavy leather" },
];

const relatedTools = [
    { name: "Machine Needle Chart", href: "/needles-thread/machine-needle-chart", icon: BookOpen },
    { name: "Needle by Fabric", href: "/needles-thread/needle-by-fabric", icon: Ruler },
    { name: "Needle Type Comparator", href: "/needles-thread/needle-type-comparator", icon: ArrowLeftRight },
];

const faqItems = [
    { q: "What does 80/12 mean?", a: "The first number (80) is the European metric size — the shaft diameter in hundredths of a millimeter. The second (12) is the American size number. Both refer to the same needle." },
    { q: "Is Singer sizing different?", a: "Singer uses its own numbering that closely matches American sizes but occasionally differs for very large needles. For most sizes (8-18), Singer and American are identical." },
    { q: "What size for general sewing?", a: "80/12 is the most versatile all-purpose size. Keep 70/10 for lightweight and 90/14 for heavier fabrics as well." },
];

export default function NeedleSizeConverterPage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Needles & Thread", href: "/needles-thread" }, { label: "Size Converter" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><ArrowLeftRight size={14} strokeWidth={1.5} /> Needles & Thread</span>
                        <h1>Needle Size Converter</h1>
                        <p>Convert between European, American, and Singer needle sizing systems.</p>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.sectionTitle}>Size Conversion Chart</h2>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead><tr><th>European</th><th>American</th><th>Singer</th><th>Recommended For</th></tr></thead>
                                <tbody>
                                    {conversions.map(c => (
                                        <tr key={c.eu}><td style={{ fontWeight: 600 }}>{c.eu}</td><td>{c.us}</td><td>{c.singer}</td><td style={{ fontFamily: "inherit", fontSize: 13 }}>{c.use}</td></tr>
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