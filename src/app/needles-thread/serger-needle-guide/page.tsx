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
    { q: "What needles for a serger?", a: "Most home sergers use standard home sewing machine needles (HAx1 or ELx705). Check your manual — some brands require specific needle systems." },
    { q: "Do serger needles need to match?", a: "Both needles should be the same type and size unless you're intentionally using a smaller needle for the right needle position for a thinner coverstitch." },
    { q: "How often to change serger needles?", a: "Same rule as regular machines: every 6-8 hours or per project. Serger stitch problems are often caused by dull needles." },
];
export default function SergerNeedleGuidePage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Needles & Thread", href: "/needles-thread" }, { label: "Serger Needle Guide" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><BookOpen size={14} strokeWidth={1.5} /> Needles & Thread</span>
                        <h1>Serger / Overlock Needle Guide</h1>
                        <p>Needle selection guide for sergers and overlock machines.</p>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.sectionTitle}>Serger Needle by Fabric</h2>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead><tr><th>Fabric</th><th>Needle Type</th><th>Size</th><th>Thread</th></tr></thead>
                                <tbody>
                                    {[
                                        ["Lightweight wovens", "Universal or Microtex", "70/10-80/12", "Serger poly 50wt"],
                                        ["Medium wovens", "Universal", "80/12", "Serger poly 40-50wt"],
                                        ["Heavy wovens", "Universal or Denim", "90/14", "Serger poly 40wt"],
                                        ["Jersey / Light knits", "Ball Point", "75/11-80/12", "Serger poly + wooly nylon looper"],
                                        ["Interlock", "Ball Point", "80/12", "Serger poly 40wt"],
                                        ["Lycra / Swimwear", "Stretch", "75/11", "Wooly nylon all positions"],
                                        ["Fleece", "Universal or Ball Point", "80/12-90/14", "Serger poly 40wt"],
                                        ["Sweater knits", "Ball Point", "80/12-90/14", "Woolly nylon looper optional"],
                                    ].map(([f, n, s, t]) => (
                                        <tr key={f}><td style={{ fontFamily: "inherit", fontWeight: 500 }}>{f}</td><td style={{ fontFamily: "inherit" }}>{n}</td><td>{s}</td><td style={{ fontFamily: "inherit", fontSize: 13 }}>{t}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.sectionTitle}>Serger Needle Systems</h2>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead><tr><th>System</th><th>Brands</th><th>Notes</th></tr></thead>
                                <tbody>
                                    {[
                                        ["HAx1 (standard home)", "Brother, Juki, Janome", "Most common — regular home needles"],
                                        ["ELx705", "Brother coverstitch", "Slightly different scarf"],
                                        ["BLx1", "Baby Lock sergers", "Brand-specific, check manual"],
                                        ["DCx1", "Some industrial", "Not for home machines"],
                                    ].map(([s, b, n]) => (
                                        <tr key={s}><td style={{ fontWeight: 600 }}>{s}</td><td style={{ fontFamily: "inherit" }}>{b}</td><td style={{ fontFamily: "inherit", fontSize: 13 }}>{n}</td></tr>
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