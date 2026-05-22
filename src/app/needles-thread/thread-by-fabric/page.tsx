"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, BookOpen, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const threads = [
    { fabric: "Silk / Chiffon", thread: "Silk thread or Fine Poly 60wt", weight: "60wt", color: "Match fabric", notes: "Extra fine to avoid bulk on delicate fabric" },
    { fabric: "Cotton (quilting)", thread: "Cotton 50wt or Poly 50wt", weight: "50wt", color: "Match or contrast", notes: "Cotton thread for cotton fabric is traditional" },
    { fabric: "Linen", thread: "Poly 40wt or Cotton 50wt", weight: "40-50wt", color: "Match fabric", notes: "Linen thread exists but hard to find" },
    { fabric: "Jersey / Knits", thread: "Poly 40wt", weight: "40wt", color: "Match fabric", notes: "Polyester has slight stretch — good for knits" },
    { fabric: "Denim", thread: "Poly 40wt (seams) / 30wt (topstitch)", weight: "30-40wt", color: "Gold/contrast for topstitch", notes: "Heavy topstitch thread for visible stitching" },
    { fabric: "Leather / Vinyl", thread: "Poly 30wt or Nylon", weight: "30wt", color: "Match or contrast", notes: "Strong thread — nylon for maximum strength" },
    { fabric: "Swimwear", thread: "Wooly Nylon", weight: "—", color: "Match", notes: "Wooly nylon stretches with fabric" },
    { fabric: "Machine Embroidery", thread: "Rayon 40wt or Poly 40wt", weight: "40wt", color: "Various", notes: "Rayon for sheen, poly for durability" },
    { fabric: "Serger / Overlock", thread: "Poly Serger Thread", weight: "40-50wt", color: "Match fabric", notes: "Serger thread on cones — better value" },
    { fabric: "Upholstery", thread: "Poly 30wt or Nylon", weight: "30wt", color: "Match", notes: "Strong thread for heavy use" },
];

const relatedTools = [
    { name: "Thread by Project", href: "/needles-thread/thread-by-project", icon: Ruler },
    { name: "Needle by Fabric", href: "/needles-thread/needle-by-fabric", icon: BookOpen },
    { name: "Machine Needle Chart", href: "/needles-thread/machine-needle-chart", icon: BookOpen },
];

const faqItems = [
    { q: "What weight thread for general sewing?", a: "50wt polyester all-purpose thread (like Gutermann or Coats) works for most projects. Use 40wt for heavier fabrics and 60wt for delicate fabrics." },
    { q: "Cotton or polyester thread?", a: "Polyester is stronger, has slight stretch, and is UV resistant. Cotton is traditional for quilting and natural fiber projects. Either works for most sewing — polyester is more versatile." },
    { q: "What is wooly nylon thread?", a: "Wooly nylon is a textured nylon thread with natural stretch. Used in loopers of sergers for soft, stretchy seams. Essential for swimwear and activewear hems." },
];

export default function ThreadByFabricPage() {
    const [filter, setFilter] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const filtered = threads.filter(t => t.fabric.toLowerCase().includes(filter.toLowerCase()));

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Needles & Thread", href: "/needles-thread" }, { label: "Thread by Fabric" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Search size={14} strokeWidth={1.5} /> Needles & Thread</span>
                        <h1>Thread by Fabric Guide</h1>
                        <p>Find the right thread type and weight for any fabric.</p>
                    </div>
                    <div className="calculator-card">
                        <div className="input-group" style={{ marginBottom: 16 }}>
                            <label className="input-label">Search Fabric</label>
                            <input type="text" className="input-field" placeholder="e.g., silk, denim..." value={filter} onChange={e => setFilter(e.target.value)} />
                        </div>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead><tr><th>Fabric</th><th>Thread</th><th>Weight</th><th>Notes</th></tr></thead>
                                <tbody>
                                    {filtered.map(t => (
                                        <tr key={t.fabric}><td style={{ fontFamily: "inherit", fontWeight: 500 }}>{t.fabric}</td><td style={{ fontFamily: "inherit", fontSize: 13 }}>{t.thread}</td><td>{t.weight}</td><td style={{ fontFamily: "inherit", fontSize: 13 }}>{t.notes}</td></tr>
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