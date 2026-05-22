"use client";
import { useState } from "react";
import Link from "next/link";
import { Scissors, ChevronDown, Leaf, Recycle } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const approaches = [
    { name: "Traditional Rectangular", diff: "Easy", waste: "0-5%", suit: "Loose/casual styles", desc: "All rectangular pieces — shape created by seaming, gathering, and draping. Based on kimono, saree, and medieval techniques." },
    { name: "Companion Item Plan", diff: "Easy-Moderate", waste: "5-10%", suit: "Any project", desc: "Standard cutting plus planned companion items from offcuts — scrunchies, bias tape, quilt blocks from leftover pieces." },
    { name: "Modular to Width", diff: "Moderate", waste: "5-15%", suit: "Planned designs", desc: "Garment designed around standard fabric widths. Piece widths are multiples of fabric width, no trimming." },
    { name: "Jigsaw Layout", diff: "Advanced", waste: "0-5%", suit: "Shaped garments", desc: "Pieces interlock like puzzle pieces — waste from one piece fills gap in another. Near-zero waste with complex cutting." },
    { name: "Standard + Optimization", diff: "Easy", waste: "15-25%", suit: "All projects", desc: "Standard pattern with optimized layout. Rotate and nest pieces to minimize gaps." },
];

const starters = [
    { project: "Tote bag from fat quarter", waste: "Near-zero" },
    { project: "Wrap skirt (rectangular)", waste: "0-5%" },
    { project: "Drawstring bag", waste: "Under 5%" },
    { project: "Bias tape from fabric square", waste: "0%" },
    { project: "Scrunchie set from offcuts", waste: "0% (uses waste)" },
];

const relatedTools = [
    { name: "Waste % Calculator", href: "/sustainable/waste-percentage", icon: Leaf },
    { name: "Remnant Usage", href: "/sustainable/remnant-usage", icon: Recycle },
    { name: "Upcycling Calculator", href: "/sustainable/upcycling", icon: Scissors },
];
const faqItems = [
    { q: "What is zero-waste pattern cutting?", a: "Designing pattern layouts that use 100% (or near 100%) of fabric. Techniques include rectangular construction, jigsaw interlocking, and companion item planning." },
    { q: "Is zero-waste sewing difficult?", a: "Start easy with companion item planning (use offcuts for scrunchies, bias tape). Rectangular construction is simple too. Jigsaw layouts are advanced." },
    { q: "Which garments are easiest to make zero-waste?", a: "Loose styles: kimono tops, caftans, wrap skirts, tunics. These use rectangular pieces that tile across fabric with no waste." },
];

export default function ZeroWasteCuttingPage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Sustainable", href: "/sustainable" }, { label: "Zero-Waste Cutting" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} strokeWidth={1.5} /> Sustainable</span><h1>Zero-Waste Pattern Cutting Guide</h1><p>Techniques and layouts to use 100% of your fabric with no waste.</p></div>
                <div className="calculator-card">
                    <h2 className={styles.sectionTitle}>Zero-Waste Approaches</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Approach</th><th>Difficulty</th><th>Waste</th><th>Best For</th></tr></thead>
                        <tbody>{approaches.map(a => (<tr key={a.name}><td style={{ fontFamily: "inherit", fontWeight: 500 }}>{a.name}</td><td>{a.diff}</td><td style={{ fontWeight: 600 }}>{a.waste}</td><td style={{ fontFamily: "inherit", fontSize: 13 }}>{a.suit}</td></tr>))}</tbody>
                    </table></div>
                </div>
                {approaches.map(a => (<div key={a.name} className="calculator-card">
                    <h3 style={{ fontSize: "var(--text-base)", fontWeight: 600, marginBottom: 4 }}>{a.name}</h3>
                    <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.7 }}>{a.desc}</p>
                </div>))}
                <div className="calculator-card">
                    <h2 className={styles.sectionTitle}>Beginner Zero-Waste Projects</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Project</th><th>Expected Waste</th></tr></thead>
                        <tbody>{starters.map(s => (<tr key={s.project}><td style={{ fontFamily: "inherit", fontWeight: 500 }}>{s.project}</td><td style={{ fontWeight: 600, color: "var(--color-accent)" }}>{s.waste}</td></tr>))}</tbody>
                    </table></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}