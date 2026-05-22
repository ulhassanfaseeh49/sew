"use client";
import { useState } from "react";
import Link from "next/link";
import { Ruler, ChevronDown, Settings, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const seamRef = [
    { app: "Quilting (piecing)", sa: "1/4\" (6mm)", notes: "Scant 1/4\" preferred" },
    { app: "US commercial patterns", sa: "5/8\" (16mm)", notes: "Simplicity, McCall's, Butterick" },
    { app: "European patterns", sa: "1.5cm (5/8\")", notes: "Sometimes no SA included" },
    { app: "Japanese patterns", sa: "None included", notes: "Add your own SA" },
    { app: "French seams", sa: "5/8\" total", notes: "3/8\" + 1/4\" two-step" },
    { app: "Flat-felled seams", sa: "1\" minimum", notes: "Triple the finished seam" },
    { app: "Baby/children", sa: "1/4\"–3/8\"", notes: "Smaller for small garments" },
    { app: "Home décor", sa: "1/2\"–1\"", notes: "More stability" },
];

const methods = [
    { name: "Needle Plate Lines", desc: "Most reliable when lines match needed seam width. Read distance from needle to engraved line." },
    { name: "Masking Tape Method", desc: "Universal solution: place tape on the needle plate at desired width from needle. Fabric edge runs along tape." },
    { name: "Magnetic Seam Guide", desc: "Attaches to needle plate. Reusable and adjustable. Does not work on plastic needle plates." },
    { name: "Seam Guide Foot", desc: "Adjustable screw-in guide on the presser foot. Fixed while foot is attached." },
    { name: "Needle Position Adjustment", desc: "Computerized machines can move needle left/right. Combine with foot edge for different seam widths." },
    { name: "1/4\" Quilting Foot", desc: "Right edge of foot = exactly 1/4\" from needle. Most reliable method for quilting." },
];

const relatedTools = [
    { name: "Stitch Length Calculator", href: "/machine/stitch-length", icon: Ruler },
    { name: "Presser Foot Guide", href: "/machine/presser-foot-guide", icon: BookOpen },
    { name: "Tension Guide", href: "/machine/tension-guide", icon: Settings },
];

const faqItems = [
    { q: "What is a scant 1/4\" seam?", a: "1-2 threads narrower than exact 1/4 inch. The thread takes up space in the seam, so scant compensates. Critical for accurate quilt blocks." },
    { q: "What do the lines on my needle plate mean?", a: "They show distance from the needle. Common markings: 1/4\", 3/8\", 1/2\", 5/8\", 3/4\", 1\". Align fabric edge with the desired line." },
    { q: "My seam allowance keeps drifting. How to fix?", a: "Use a physical guide (tape, magnetic guide, or seam guide foot). Watch the guide, not the needle. Maintain consistent hand pressure without pulling fabric." },
];

export default function SeamGuidePage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Machine Tools", href: "/machine" }, { label: "Seam Guide" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Sewing Machine Tool</span>
                        <h1>Seam Guide / Measurement Tool</h1>
                        <p>Visual reference for using seam guides on sewing machines for achieving consistent seam allowances.</p>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.sectionTitle}>Common Seam Allowances</h2>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead><tr><th>Application</th><th>Seam Allowance</th><th>Notes</th></tr></thead>
                                <tbody>{seamRef.map(s => (<tr key={s.app}><td style={{ fontFamily: "inherit", fontWeight: 500 }}>{s.app}</td><td>{s.sa}</td><td style={{ fontFamily: "inherit", fontSize: 13 }}>{s.notes}</td></tr>))}</tbody>
                            </table>
                        </div>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.sectionTitle}>Methods for Consistent Seams</h2>
                        {methods.map((m, i) => (
                            <div key={m.name} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: i < methods.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                                <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 4 }}>{i + 1}. {m.name}</h3>
                                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>{m.desc}</p>
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