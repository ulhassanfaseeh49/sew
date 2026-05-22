"use client";
import { useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronDown, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
const relatedTools = [
    { name: "Machine Needle Chart", href: "/needles-thread/machine-needle-chart", icon: BookOpen },
    { name: "Needle by Fabric", href: "/needles-thread/needle-by-fabric", icon: Ruler },
];
const faqItems = [
    { q: "What hand needles for general sewing?", a: "Sharps are the most versatile hand sewing needles. Size 7-9 for most fabrics. Use Betweens (shorter) for quilting." },
    { q: "What size for hand quilting?", a: "Betweens size 8-12. Higher numbers = smaller needles. Beginners start at 8, experienced quilters use 10-12 for finer stitches." },
    { q: "How to choose embroidery needle size?", a: "Match the needle eye to your thread: larger eye for thicker thread (embroidery floss). Crewel needles have sharp tips for woven fabric, Tapestry for counted work." },
];
export default function HandNeedleGuidePage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Needles & Thread", href: "/needles-thread" }, { label: "Hand Needle Guide" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><BookOpen size={14} strokeWidth={1.5} /> Needles & Thread</span>
                        <h1>Hand Sewing Needle Guide</h1>
                        <p>Complete reference for hand sewing needle types, sizes, and uses.</p>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.sectionTitle}>Hand Needle Types</h2>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead><tr><th>Type</th><th>Sizes</th><th>Eye</th><th>Point</th><th>Best For</th></tr></thead>
                                <tbody>
                                    {[
                                        ["Sharps", "1-12", "Small round", "Sharp", "General hand sewing, mending"],
                                        ["Betweens", "3-12", "Small round", "Sharp, short", "Hand quilting"],
                                        ["Crewel/Embroidery", "1-10", "Long oval", "Sharp", "Embroidery with floss"],
                                        ["Tapestry", "13-28", "Large blunt", "Rounded", "Cross stitch, needlepoint"],
                                        ["Chenille", "13-26", "Large", "Sharp", "Ribbon embroidery, heavy thread"],
                                        ["Beading", "10-16", "Very tiny", "Thin, sharp", "Beadwork, sequins"],
                                        ["Darning", "1-18", "Large", "Blunt", "Darning, weaving yarn"],
                                        ["Upholstery", "Various", "Large", "Curved", "Buttons, tufting, upholstery"],
                                        ["Milliner/Straw", "1-10", "Small", "Long, sharp", "Hat making, bullion knots"],
                                        ["Bodkin", "Various", "Large flat", "Blunt", "Threading elastic, ribbon"],
                                    ].map(([t, s, e, p, b]) => (
                                        <tr key={t}><td style={{ fontFamily: "inherit", fontWeight: 500 }}>{t}</td><td>{s}</td><td style={{ fontFamily: "inherit" }}>{e}</td><td style={{ fontFamily: "inherit" }}>{p}</td><td style={{ fontFamily: "inherit", fontSize: 13 }}>{b}</td></tr>
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