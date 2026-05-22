"use client";
import { useState } from "react";
import Link from "next/link";
import { Layers, ChevronDown, BookOpen, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Machine Needle Chart", href: "/needles-thread/machine-needle-chart", icon: BookOpen },
    { name: "Needle by Fabric", href: "/needles-thread/needle-by-fabric", icon: Ruler },
    { name: "Needle Size Converter", href: "/needles-thread/needle-size-converter", icon: Layers },
];

const faqItems = [
    { q: "Ball point vs stretch needle?", a: "Ball point pushes between knit loops. Stretch needles have a special scarf (groove) that prevents skipped stitches on very stretchy fabrics like Lycra and swimwear. Use stretch for high-stretch, ball point for regular knits." },
    { q: "Universal vs Microtex?", a: "Universal has a slightly rounded point for versatility. Microtex (Sharp) has a very sharp point for precise piercing — better for silk, microfiber, and tightly woven fabrics where you need clean holes." },
    { q: "When to use a Quilting needle?", a: "Use quilting needles when sewing through multiple layers (quilt sandwich). The tapered point and thin shaft reduce drag through batting and prevent distortion." },
];

export default function NeedleTypeComparatorPage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Needles & Thread", href: "/needles-thread" }, { label: "Type Comparator" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Layers size={14} strokeWidth={1.5} /> Needles & Thread</span>
                        <h1>Needle Type Comparator</h1>
                        <p>Compare needle types side-by-side to choose the right one for your project.</p>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.sectionTitle}>Common Comparisons</h2>
                        {[
                            { a: "Universal", b: "Ball Point", diff: "Universal has a slight point for wovens. Ball Point is fully rounded to slip between knit loops without snagging.", when: "Use Universal for wovens, Ball Point for knits." },
                            { a: "Ball Point", b: "Stretch", diff: "Both for knits, but Stretch has a deeper scarf that prevents skipped stitches on high-stretch fabrics.", when: "Use Ball Point for jersey/interlock. Stretch for Lycra/swimwear." },
                            { a: "Universal", b: "Microtex", diff: "Universal is slightly rounded. Microtex is razor-sharp for penetrating tight weaves cleanly.", when: "Use Microtex for silk, microfiber, finely woven fabrics." },
                            { a: "Denim", b: "Leather", diff: "Denim has a sharp reinforced point. Leather has a cutting wedge that slices through material.", when: "Never use leather needles on fabric — they cut the fibers." },
                            { a: "Embroidery", b: "Topstitch", diff: "Both have large eyes. Embroidery has a special groove for metallic/rayon thread. Topstitch fits heavy topstitching thread.", when: "Embroidery for machine embroidery. Topstitch for decorative heavy stitching." },
                        ].map(c => (
                            <div key={c.a + c.b} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid var(--color-border)" }}>
                                <h3 style={{ fontSize: "var(--text-base)", fontWeight: 600, marginBottom: 6 }}>{c.a} vs {c.b}</h3>
                                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginBottom: 6 }}>{c.diff}</p>
                                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-accent)", fontWeight: 500 }}>{c.when}</p>
                            </div>
                        ))}
                    </div>
                    <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside>
            </div>
        </div>
    );
}