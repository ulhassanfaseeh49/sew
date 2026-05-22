"use client";
import { useState } from "react";
import Link from "next/link";
import { Columns, ChevronDown, BookOpen, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
const relatedTools = [
    { name: "Machine Needle Chart", href: "/needles-thread/machine-needle-chart", icon: BookOpen },
    { name: "Stitch Length Guide", href: "/stretch/stitch-length", icon: Ruler },
];
const faqItems = [
    { q: "What is a twin needle?", a: "A twin (double) needle has two needles on a single shank. It creates two parallel rows of straight stitch on top with a zigzag on the bottom — ideal for stretchy hems." },
    { q: "What gap size for hemming knits?", a: "2.5mm or 3.0mm gap is standard for hemming knits. Narrower (1.6-2.0mm) for fine details and pintucks. Wider (4.0-6.0mm) for decorative topstitching." },
    { q: "Can I use a twin needle on any machine?", a: "Only on machines with a zigzag capability (the needle bar must move side to side). Reduce maximum stitch width so needles don't hit the presser foot or plate." },
];
export default function TwinNeedleGuidePage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Needles & Thread", href: "/needles-thread" }, { label: "Twin Needle Guide" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Columns size={14} strokeWidth={1.5} /> Needles & Thread</span>
                        <h1>Twin Needle Guide</h1>
                        <p>Complete guide to twin needle sizes, types, and applications.</p>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.sectionTitle}>Twin Needle Size Chart</h2>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead><tr><th>Gap</th><th>Needle Size</th><th>Best For</th><th>Fabric</th></tr></thead>
                                <tbody>
                                    {[
                                        ["1.6mm", "75/11", "Fine pintucks, delicate hems", "Lightweight wovens, silk"],
                                        ["2.0mm", "80/12", "Narrow decorative stitching", "Light-medium fabrics"],
                                        ["2.5mm", "80/12", "Knit hems (standard)", "Jersey, interlock"],
                                        ["3.0mm", "80/12-90/14", "Knit hems, topstitching", "Medium knits, cotton"],
                                        ["4.0mm", "80/12-90/14", "Wide topstitching", "Medium-heavy fabrics"],
                                        ["6.0mm", "100/16", "Very wide decorative", "Heavy fabrics, denim"],
                                    ].map(([g, n, b, f]) => (
                                        <tr key={g}><td style={{ fontWeight: 600 }}>{g}</td><td>{n}</td><td style={{ fontFamily: "inherit" }}>{b}</td><td style={{ fontFamily: "inherit", fontSize: 13 }}>{f}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.sectionTitle}>Twin Needle Types</h2>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead><tr><th>Type</th><th>Point</th><th>Use</th></tr></thead>
                                <tbody>
                                    {[
                                        ["Universal Twin", "Slight round", "Wovens and basic knits"],
                                        ["Stretch Twin", "Ball point", "Knits, jersey, stretch fabrics"],
                                        ["Jeans Twin", "Sharp, reinforced", "Denim topstitching"],
                                        ["Embroidery Twin", "Rounded, large eye", "Decorative stitching"],
                                        ["Metallic Twin", "Large eye, special groove", "Metallic thread decorative work"],
                                    ].map(([t, p, u]) => (
                                        <tr key={t}><td style={{ fontFamily: "inherit", fontWeight: 500 }}>{t}</td><td style={{ fontFamily: "inherit" }}>{p}</td><td style={{ fontFamily: "inherit" }}>{u}</td></tr>
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