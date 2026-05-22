"use client";
import { useState } from "react";
import Link from "next/link";
import { Layout, ChevronDown, Recycle, Leaf, Scissors } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const categories = [
    { size: "Large (over 18\")", projects: "Any fat-quarter project: baby items, small bags, quilt blocks any size", store: "Fold and add to main stash with yardage", color: "#dcfce7" },
    { size: "Medium (9\"-18\")", projects: "Zipper pouches, baby bibs, quilt blocks up to 9\", headbands, tote sections", store: "Folded by fabric type in labeled bins", color: "#e8f5e9" },
    { size: "Small (4\"-9\")", projects: "Quilt squares (3.5\"-4.5\"), patchwork, appliqué shapes, yo-yos", store: "By color family in clear bags", color: "#fef9c3" },
    { size: "Strips (2\"-4\" wide)", projects: "Quilt binding, bias tape, braided rugs, scrunchies, headbands", store: "Wound into bundles by width", color: "#fed7aa" },
    { size: "Very Small (1\"-4\")", projects: "Charm-pack quilts, English paper piecing, appliqué details, fabric buttons", store: "By color in small bags or jars", color: "#fecaca" },
    { size: "Tiny (under 1\")", projects: "Pincushion stuffing, small toy stuffing. Compost natural fibers. Recycle synthetics.", store: "One jar for stuffing", color: "#e5e7eb" },
];

const donations = [
    { recipient: "Quilting group", min: "2.5\" x 2.5\" minimum" },
    { recipient: "School / college", min: "6\" x 6\" useful" },
    { recipient: "Craft group", min: "4\" x 4\" minimum" },
    { recipient: "Charity shop", min: "1/4 yard minimum typically" },
    { recipient: "Textile recycling", min: "Any size including scraps" },
];

const relatedTools = [
    { name: "Remnant Usage", href: "/sustainable/remnant-usage", icon: Recycle },
    { name: "Waste % Calculator", href: "/sustainable/waste-percentage", icon: Leaf },
    { name: "Upcycling Calculator", href: "/sustainable/upcycling", icon: Scissors },
];
const faqItems = [
    { q: "How small is too small to keep?", a: "Under 1\" is generally only useful as stuffing or compost. 1.5\"+ squares can make postage-stamp quilts. Be realistic — hoarding tiny scraps creates clutter without benefit." },
    { q: "Should I sort scraps by color or type?", a: "Both! Sort primarily by type (woven/knit) since they behave differently. Within type, sort by color for easy project matching. Keep strips separate regardless of color." },
    { q: "Can I compost fabric scraps?", a: "Only 100% natural fibers: cotton, linen, wool, silk. Remove synthetic thread and labels first. Cut small for faster composting. Never compost polyester, nylon, or acrylic." },
];

export default function ScrapSortingPage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Sustainable", href: "/sustainable" }, { label: "Scrap Sorting" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Layout size={14} strokeWidth={1.5} /> Sustainable</span><h1>Scrap Sorting Size Guide</h1><p>Organize fabric scraps by size with project suggestions for each category.</p></div>
                {categories.map(c => (
                    <div key={c.size} className="calculator-card" style={{ borderLeft: `4px solid ${c.color}` }}>
                        <h3 style={{ fontSize: "var(--text-base)", fontWeight: 600, marginBottom: 6 }}>{c.size}</h3>
                        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginBottom: 4 }}>Projects: {c.projects}</p>
                        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-accent)", fontWeight: 500 }}>Storage: {c.store}</p>
                    </div>
                ))}
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Donation Minimums</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Recipient</th><th>Minimum Size</th></tr></thead>
                        <tbody>{donations.map(d => (<tr key={d.recipient}><td style={{ fontFamily: "inherit", fontWeight: 500 }}>{d.recipient}</td><td>{d.min}</td></tr>))}</tbody>
                    </table></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}