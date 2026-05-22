"use client";
import { useState } from "react";
import Link from "next/link";
import { Clock, ChevronDown, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
const relatedTools = [
    { name: "Machine Needle Chart", href: "/needles-thread/machine-needle-chart", icon: BookOpen },
    { name: "Needle by Fabric", href: "/needles-thread/needle-by-fabric", icon: BookOpen },
];
const faqItems = [
    { q: "How often should I change my needle?", a: "Every 6-8 hours of active sewing, or at the start of every new project. Dull needles cause skipped stitches, thread breakage, and fabric damage." },
    { q: "How do I know my needle is dull?", a: "Signs: popping sound when piercing fabric, skipped stitches, thread shredding, pulled threads in fabric, or visible burr when running needle across your fingernail." },
    { q: "Can I sharpen sewing machine needles?", a: "No. Machine needles are precision-ground and cannot be resharpened. They are a consumable item. At $3-5 per pack of 5, replacement is the only option." },
];
export default function ReplacementSchedulePage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Needles & Thread", href: "/needles-thread" }, { label: "Replacement Schedule" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Clock size={14} strokeWidth={1.5} /> Needles & Thread</span>
                        <h1>Needle Replacement Schedule</h1>
                        <p>Know when to change your needle to prevent fabric damage and stitch problems.</p>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.sectionTitle}>Replacement Guidelines</h2>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead><tr><th>Trigger</th><th>Replace?</th><th>Why</th></tr></thead>
                                <tbody>
                                    {[
                                        ["New project starting", "Yes", "Fresh needle for clean start"],
                                        ["6-8 hours of sewing", "Yes", "Needle dulls with use"],
                                        ["Hitting a pin", "Immediately", "Tip bends or burrs, damages fabric"],
                                        ["Skipped stitches", "Check first", "Likely dull — replace and retest"],
                                        ["Thread keeps breaking", "Check first", "Burr on needle eye — replace"],
                                        ["Popping sounds", "Yes", "Needle pushing through instead of piercing"],
                                        ["Pulled threads in fabric", "Yes", "Dull or wrong needle type"],
                                        ["Switching fabric types", "Yes", "Different fabric = different needle"],
                                        ["Visible burr on tip", "Immediately", "Run across fingernail to check"],
                                    ].map(([t, r, w]) => (
                                        <tr key={t}><td style={{ fontFamily: "inherit", fontWeight: 500 }}>{t}</td><td style={{ fontFamily: "inherit", fontWeight: 600, color: r === "Immediately" ? "#ef4444" : r === "Yes" ? "#22c55e" : "#f59e0b" }}>{r}</td><td style={{ fontFamily: "inherit", fontSize: 13 }}>{w}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.sectionTitle}>Signs of a Dull Needle</h2>
                        <ul style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", paddingLeft: 20, lineHeight: 1.8 }}>
                            <li>Popping or clicking sound when needle enters fabric</li>
                            <li>Skipped stitches that weren&apos;t happening before</li>
                            <li>Thread shredding or fraying</li>
                            <li>Visible holes or pulled threads in fabric</li>
                            <li>Fabric puckering along stitch line</li>
                            <li>Thread breaking repeatedly</li>
                            <li>Needle feels rough when run across fingernail</li>
                        </ul>
                    </div>
                    <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside>
            </div>
        </div>
    );
}