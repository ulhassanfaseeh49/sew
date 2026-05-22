"use client";
import { useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronDown, Ruler, Info } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const needles = [
    { type: "Universal", sizes: "60/8 - 120/20", point: "Slightly rounded", best: "Wovens and stable knits", desc: "All-purpose needle for most fabrics" },
    { type: "Ball Point (Jersey)", sizes: "70/10 - 100/16", point: "Rounded ball", best: "Knits, jersey, interlock", desc: "Slides between loops rather than piercing" },
    { type: "Stretch", sizes: "75/11 - 90/14", point: "Medium ball + special scarf", best: "Lycra, spandex, swimwear", desc: "Prevents skipped stitches on very stretchy fabrics" },
    { type: "Microtex/Sharp", sizes: "60/8 - 90/14", point: "Very sharp", best: "Silk, microfiber, tightly woven", desc: "Precise piercing for fine fabrics" },
    { type: "Denim/Jeans", sizes: "90/14 - 110/18", point: "Sharp, reinforced", best: "Denim, canvas, heavy wovens", desc: "Strong shaft prevents deflection" },
    { type: "Leather", sizes: "80/12 - 110/18", point: "Cutting wedge", best: "Leather, vinyl, suede", desc: "Cuts through rather than piercing" },
    { type: "Quilting", sizes: "75/11 - 90/14", point: "Tapered", best: "Quilting through multiple layers", desc: "Thin shaft for piecing and quilting" },
    { type: "Embroidery", sizes: "75/11 - 90/14", point: "Slightly rounded", best: "Machine embroidery", desc: "Large eye, special scarf for specialty threads" },
    { type: "Topstitch", sizes: "80/12 - 100/16", point: "Sharp", best: "Topstitching, decorative", desc: "Extra-large eye for heavy thread" },
    { type: "Twin/Double", sizes: "1.6mm - 6.0mm gap", point: "Varies", best: "Hems, pintucks, decorative", desc: "Two needles, creates parallel stitch lines" },
];

const relatedTools = [
    { name: "Needle by Fabric", href: "/needles-thread/needle-by-fabric", icon: Ruler },
    { name: "Needle Size Converter", href: "/needles-thread/needle-size-converter", icon: Info },
    { name: "Thread by Fabric", href: "/needles-thread/thread-by-fabric", icon: Ruler },
    { name: "Twin Needle Guide", href: "/needles-thread/twin-needle-guide", icon: Info },
];

const faqItems = [
    { q: "What needle for cotton?", a: "Universal 80/12 for most cottons. Use Microtex/Sharp 70/10 for fine cotton lawn or batiste. Use Denim 90/14 for heavy cotton canvas." },
    { q: "How often should I change needles?", a: "Replace after every 6-8 hours of sewing, or after every project. A dull needle causes skipped stitches, fabric damage, and thread breakage." },
    { q: "What do the needle numbers mean?", a: "The first number is European (higher = thicker). The second is American. 80/12 is the most common all-purpose size. Lower numbers for lighter fabrics, higher for heavier." },
];

export default function MachineNeedleChartPage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Needles & Thread", href: "/needles-thread" }, { label: "Machine Needle Chart" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><BookOpen size={14} strokeWidth={1.5} /> Needles & Thread</span>
                        <h1>Machine Needle Type Chart</h1>
                        <p>Complete reference for every machine needle type — point style, sizes, and best uses.</p>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.sectionTitle}>Machine Needle Types</h2>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead><tr><th>Type</th><th>Sizes</th><th>Point</th><th>Best For</th></tr></thead>
                                <tbody>
                                    {needles.map(n => (
                                        <tr key={n.type}><td style={{ fontFamily: "inherit", fontWeight: 500 }}>{n.type}</td><td>{n.sizes}</td><td style={{ fontFamily: "inherit" }}>{n.point}</td><td style={{ fontFamily: "inherit", fontSize: 13 }}>{n.best}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {needles.slice(0, 5).map(n => (
                        <div key={n.type} className="calculator-card">
                            <h3 style={{ fontSize: "var(--text-base)", fontWeight: 600, marginBottom: 8 }}>{n.type} Needle</h3>
                            <div className={styles.resultDetails}>
                                <div className="result-row"><span className="result-row-label">Sizes</span><span className="result-row-value">{n.sizes}</span></div>
                                <div className="result-row"><span className="result-row-label">Point style</span><span className="result-row-value" style={{ fontFamily: "inherit" }}>{n.point}</span></div>
                                <div className="result-row"><span className="result-row-label">Best for</span><span className="result-row-value" style={{ fontFamily: "inherit" }}>{n.best}</span></div>
                                <div className="result-row"><span className="result-row-label">Description</span><span className="result-row-value" style={{ fontFamily: "inherit" }}>{n.desc}</span></div>
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