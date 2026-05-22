"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, BookOpen, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const fabrics = [
    { name: "Silk / Chiffon", needle: "Microtex 60/8-70/10", thread: "Silk or Fine Poly 60wt", tension: "Lower", stitch: "1.5-2mm" },
    { name: "Cotton Lawn / Voile", needle: "Microtex 70/10", thread: "Cotton 50wt or Poly 50wt", tension: "Normal", stitch: "2mm" },
    { name: "Quilting Cotton", needle: "Universal 80/12", thread: "Cotton 50wt or Poly 40wt", tension: "Normal", stitch: "2.5mm" },
    { name: "Linen", needle: "Universal 80/12-90/14", thread: "Poly 40wt or Cotton 50wt", tension: "Normal", stitch: "2.5mm" },
    { name: "Jersey / T-shirt Knit", needle: "Ball Point 75/11-80/12", thread: "Poly 40wt or Wooly Nylon", tension: "Slightly lower", stitch: "2.5mm zigzag" },
    { name: "Interlock Knit", needle: "Ball Point 80/12", thread: "Poly 40wt", tension: "Normal", stitch: "2.5mm zigzag" },
    { name: "Lycra / Spandex", needle: "Stretch 75/11", thread: "Poly 40wt or Wooly Nylon", tension: "Lower", stitch: "2mm zigzag" },
    { name: "Denim (light)", needle: "Denim 90/14", thread: "Poly 40wt", tension: "Normal-Higher", stitch: "3mm" },
    { name: "Denim (heavy)", needle: "Denim 100/16-110/18", thread: "Poly 30wt or Topstitch", tension: "Higher", stitch: "3-3.5mm" },
    { name: "Canvas / Duck", needle: "Denim 100/16", thread: "Poly 30wt", tension: "Higher", stitch: "3mm" },
    { name: "Leather / Faux Leather", needle: "Leather 90/14-100/16", thread: "Poly 30wt or Nylon", tension: "Higher", stitch: "3-3.5mm" },
    { name: "Fleece", needle: "Universal 80/12-90/14", thread: "Poly 40wt", tension: "Normal", stitch: "3mm" },
    { name: "Tulle / Net", needle: "Microtex 60/8-70/10", thread: "Fine Poly 60wt", tension: "Lower", stitch: "2mm" },
    { name: "Swimwear", needle: "Stretch 75/11", thread: "Wooly Nylon", tension: "Lower", stitch: "Narrow zigzag" },
];

const relatedTools = [
    { name: "Machine Needle Chart", href: "/needles-thread/machine-needle-chart", icon: BookOpen },
    { name: "Thread by Fabric", href: "/needles-thread/thread-by-fabric", icon: Ruler },
    { name: "Needle Size Converter", href: "/needles-thread/needle-size-converter", icon: Ruler },
];

const faqItems = [
    { q: "What's the most important rule for needle selection?", a: "Match needle type to fabric type (ball point for knits, sharp for wovens) and needle size to fabric weight (smaller for lighter, larger for heavier). Both matter equally." },
    { q: "Can I use a universal needle for everything?", a: "Universal works for many fabrics but isn't optimal for all. Knits benefit from ball point (fewer skipped stitches). Delicate silks need Microtex. Heavy fabrics need Denim needles." },
    { q: "Why does my thread keep breaking?", a: "Common causes: wrong needle size (too small), needle inserted incorrectly, tension too high, old/cheap thread, burr on needle plate or bobbin case. Try a new needle first." },
];

export default function NeedleByFabricPage() {
    const [filter, setFilter] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const filtered = fabrics.filter(f => f.name.toLowerCase().includes(filter.toLowerCase()));

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Needles & Thread", href: "/needles-thread" }, { label: "Needle by Fabric" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Search size={14} strokeWidth={1.5} /> Needles & Thread</span>
                        <h1>Needle by Fabric Guide</h1>
                        <p>Find the correct needle type, size, thread, and stitch settings for any fabric.</p>
                    </div>
                    <div className="calculator-card">
                        <div className="input-group" style={{ marginBottom: 16 }}>
                            <label className="input-label">Search Fabric</label>
                            <input type="text" className="input-field" placeholder="e.g., silk, denim, jersey..." value={filter} onChange={e => setFilter(e.target.value)} />
                        </div>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead><tr><th>Fabric</th><th>Needle</th><th>Thread</th><th>Tension</th><th>Stitch</th></tr></thead>
                                <tbody>
                                    {filtered.map(f => (
                                        <tr key={f.name}><td style={{ fontFamily: "inherit", fontWeight: 500 }}>{f.name}</td><td style={{ fontFamily: "inherit", fontSize: 13 }}>{f.needle}</td><td style={{ fontFamily: "inherit", fontSize: 13 }}>{f.thread}</td><td style={{ fontFamily: "inherit" }}>{f.tension}</td><td>{f.stitch}</td></tr>
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