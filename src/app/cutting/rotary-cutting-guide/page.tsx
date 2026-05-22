"use client";
import { useState } from "react";
import Link from "next/link";
import { Disc, ChevronDown, Scissors, Ruler, Grid3X3 } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Strip Cutting", href: "/cutting/strip-calculator", icon: Scissors },
    { name: "Triangle Cutting", href: "/cutting/triangle-calculator", icon: Grid3X3 },
    { name: "Square Cutting", href: "/cutting/square-calculator", icon: Grid3X3 },
];

const shapes = [
    { name: "Squares", steps: "1. Cut strip at square width. 2. Sub-cut strip into squares by turning strip and cutting at the same width interval. Always use ruler line, not mat markings." },
    { name: "Rectangles", steps: "1. Cut strip at rectangle height. 2. Sub-cut strip at rectangle width. Check that the longer dimension has straight grain." },
    { name: "Half-Square Triangles", steps: "1. Cut square at finished + 7/8\". 2. Mark diagonal with pencil. 3. Cut once diagonally corner to corner. Yields 2 triangles." },
    { name: "Quarter-Square Triangles", steps: "1. Cut square at finished + 1-1/4\". 2. Cut diagonally both ways (X cut). Yields 4 triangles. Handle carefully -- all bias edges." },
    { name: "60-degree Triangles", steps: "1. Cut strip at desired height. 2. Use a 60-degree ruler. 3. Alternate up/down triangles to minimize waste." },
    { name: "Diamonds (45-degree)", steps: "1. Cut strip at diamond height. 2. Angle ruler to 45 degrees. 3. Cut parallelogram shapes. Used in Lone Star patterns." },
];

const stacking = [
    { layers: "2-4 layers", note: "Standard for most rotary cutting. Align edges carefully." },
    { layers: "4-6 layers", note: "For experienced cutters with a sharp blade." },
    { layers: "6-8 layers", note: "Only with a brand-new blade and lightweight fabric." },
];

const faqItems = [
    { q: "How often should I change my rotary blade?", a: "Every 6-8 hours of cutting, or when you notice dragging, skipping threads, or rough edges. A dull blade is the most common cause of inaccurate cuts." },
    { q: "Do I cut with the ruler on the left or right?", a: "Right-handed: ruler on the left, cut on the right side. Left-handed: ruler on the right, cut on the left side. Always keep fingers away from the cutting edge." },
    { q: "Which rulers do I need to start quilting?", a: "Start with a 6\" x 24\" long ruler and a 12.5\" square ruler. Add a 6.5\" square and specialty rulers (60-degree, HST) as you progress." },
];

export default function RotaryCuttingGuidePage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Cutting Tools", href: "/cutting" }, { label: "Rotary Cutting Guide" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Disc size={14} strokeWidth={1.5} /> Cutting</span><h1>Rotary Cutting Reference Guide</h1><p>Step-by-step cutting instructions for every quilt shape using a rotary cutter.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Shape Cutting Instructions</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {shapes.map(s => (<div key={s.name} style={{ borderLeft: "3px solid var(--color-primary)", paddingLeft: 16 }}>
                            <h4 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 4 }}>{s.name}</h4>
                            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>{s.steps}</p>
                        </div>))}
                    </div>
                </div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Layer Stacking Guide</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Layers</th><th>Notes</th></tr></thead>
                        <tbody>{stacking.map(s => (<tr key={s.layers}><td style={{ fontWeight: 600 }}>{s.layers}</td><td>{s.note}</td></tr>))}</tbody>
                    </table></div>
                </div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Accuracy Tips</h2>
                    <ul style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
                        <li>Always press fabric before cutting -- wrinkles cause inaccuracy.</li>
                        <li>Use spray starch for crisp, stable cuts.</li>
                        <li>Place non-slip strips under your ruler to prevent slipping.</li>
                        <li>Always cut away from your body for safety.</li>
                        <li>Close the blade guard immediately after every cut.</li>
                        <li>Trim dog ears from triangle points to improve alignment during piecing.</li>
                    </ul>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}