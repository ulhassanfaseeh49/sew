"use client";
import { useState } from "react";
import Link from "next/link";
import { Layout, ChevronDown, Scissors, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Waste Minimizer", href: "/cutting/waste-minimizer", icon: Scissors },
    { name: "Strip Cutting", href: "/cutting/strip-calculator", icon: Scissors },
    { name: "Usable Width", href: "/cutting/usable-width", icon: Ruler },
];
const faqItems = [
    { q: "Should I fold fabric when cutting pattern pieces?", a: "Fold selvage-to-selvage for symmetric pieces. Use single layer for asymmetric pieces or directional prints." },
    { q: "What order should I cut pieces?", a: "1. Place directional/on-fold pieces first, 2. Cut largest pieces, 3. Fill gaps with smaller pieces, 4. Use scraps for the smallest." },
    { q: "How do I handle pattern matching in layout?", a: "Extra fabric is needed (up to 2x). Match the pattern at seam lines, not cut edges. Always preview placement with a see-through template." },
];

const tips = [
    { title: "1. Grain Line Alignment", text: "Align grain lines on pattern pieces parallel to the selvage for stability. Cross-grain or bias placement causes stretching." },
    { title: "2. Fold Placement", text: "\"On fold\" pieces must have the fold edge on the fabric fold. Only half the piece is shown; the fold creates the mirror image." },
    { title: "3. Nap/Directional Prints", text: "All pieces must run the same direction. This uses more fabric but prevents upside-down sections in the finished garment." },
    { title: "4. Seam Allowances", text: "Ensure seam allowances are included in the layout. Pattern pieces without seam allowances need extra space between them." },
    { title: "5. Cut Largest First", text: "Place and cut the largest pieces first to ensure they fit. Smaller pieces can fill gaps around the larger ones." },
];

export default function LayoutOptimizerPage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Cutting Tools", href: "/cutting" }, { label: "Layout Optimizer" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Layout size={14} strokeWidth={1.5} /> Cutting</span><h1>Cutting Layout Optimizer</h1><p>Best practices and guidelines for arranging pattern pieces on fabric for efficient cutting.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Layout Planning Principles</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {tips.map(tip => (<div key={tip.title} style={{ borderLeft: "3px solid var(--color-primary)", paddingLeft: 16 }}>
                            <h4 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 4 }}>{tip.title}</h4>
                            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6 }}>{tip.text}</p>
                        </div>))}
                    </div>
                </div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Fabric Fold Options</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Fold Type</th><th>When to Use</th><th>Visible Width</th></tr></thead>
                        <tbody>
                            <tr><td style={{ fontWeight: 600 }}>Single layer (open)</td><td>Asymmetric pieces, directional prints</td><td>Full width</td></tr>
                            <tr><td style={{ fontWeight: 600 }}>Selvage-to-selvage fold</td><td>Standard for most sewing</td><td>Half width</td></tr>
                            <tr><td style={{ fontWeight: 600 }}>Double fold</td><td>Cutting on two fold lines</td><td>Quarter width</td></tr>
                        </tbody>
                    </table></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}