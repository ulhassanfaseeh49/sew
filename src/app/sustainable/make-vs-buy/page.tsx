"use client";
import { useState } from "react";
import Link from "next/link";
import { Scale, ChevronDown, Leaf, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const comparison = [
    { cat: "Carbon footprint", make: "Low-Medium", fast: "High", sustBrand: "Low", secondhand: "Very Low" },
    { cat: "Water use", make: "Medium", fast: "Very High", sustBrand: "Low-Medium", secondhand: "None (already made)" },
    { cat: "Chemical pollution", make: "Low (if certified)", fast: "High", sustBrand: "Low", secondhand: "None" },
    { cat: "Packaging waste", make: "Minimal", fast: "High", sustBrand: "Medium", secondhand: "Low" },
    { cat: "Transportation", make: "Low (local store)", fast: "High (overseas)", sustBrand: "Medium", secondhand: "Very Low" },
    { cat: "Longevity potential", make: "High", fast: "Very Low", sustBrand: "High", secondhand: "Medium" },
    { cat: "Worker welfare", make: "N/A (you)", fast: "Low", sustBrand: "High", secondhand: "N/A" },
    { cat: "End-of-life", make: "Repairable", fast: "Disposable", sustBrand: "Repairable", secondhand: "Extended life" },
];

const relatedTools = [
    { name: "Carbon Footprint", href: "/sustainable/carbon-footprint", icon: Leaf },
    { name: "Eco-Fabric Comparator", href: "/sustainable/eco-fabric", icon: Scale },
    { name: "Fiber Guide", href: "/sustainable/fiber-guide", icon: BookOpen },
];
const faqItems = [
    { q: "Is sewing always more sustainable than buying?", a: "Not always. Buying quality secondhand often beats making new. Making from shipped synthetic fabric may not beat buying organic from a local sustainable brand. Context matters." },
    { q: "When does buying beat making?", a: "When buying secondhand (extends garment life), or buying from certified sustainable brands using local sourcing. Also when making a garment that won't last or won't be worn often." },
    { q: "What's the single most sustainable choice?", a: "The most sustainable garment is one you already own and wear regularly. After that: secondhand, then handmade from quality fabric, then sustainable brand, then mid-range, then fast fashion." },
];

export default function MakeVsBuyPage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Sustainable", href: "/sustainable" }, { label: "Make vs Buy" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Scale size={14} strokeWidth={1.5} /> Sustainable</span><h1>Make vs Buy Environmental Calculator</h1><p>Multi-factor comparison of making, buying fast fashion, sustainable brand, or secondhand.</p></div>
                <div className="calculator-card">
                    <h2 className={styles.sectionTitle}>Environmental Impact Comparison</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}>
                        <thead><tr><th>Category</th><th>Make</th><th>Fast Fashion</th><th>Sustainable Brand</th><th>Secondhand</th></tr></thead>
                        <tbody>{comparison.map(c => (<tr key={c.cat}>
                            <td style={{ fontFamily: "inherit", fontWeight: 500 }}>{c.cat}</td>
                            <td style={{ fontSize: 13, color: c.make.includes("Low") || c.make === "Minimal" || c.make === "High" && c.cat === "Longevity potential" ? "var(--color-accent)" : "inherit" }}>{c.make}</td>
                            <td style={{ fontSize: 13, color: c.fast.includes("High") || c.fast.includes("Very") ? "#991b1b" : "inherit" }}>{c.fast}</td>
                            <td style={{ fontSize: 13 }}>{c.sustBrand}</td>
                            <td style={{ fontSize: 13, color: "var(--color-accent)" }}>{c.secondhand}</td>
                        </tr>))}</tbody>
                    </table></div>
                </div>
                <div className="calculator-card" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                    <h2 style={{ fontSize: "var(--text-base)", fontWeight: 600, marginBottom: 8, color: "#166534" }}>The Longevity Factor</h2>
                    <p style={{ fontSize: "var(--text-sm)", color: "#166534", lineHeight: 1.8 }}>A garment worn 300 times has 30x lower per-wear environmental impact than one worn 10 times. <strong>Longevity matters more than production method.</strong> Make quality, repair often, and wear everything you make.</p>
                </div>
                <div className="calculator-card">
                    <h2 className={styles.sectionTitle}>When Buying Beats Making</h2>
                    <ul style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", paddingLeft: 20, lineHeight: 2 }}>
                        <li>Buying quality secondhand extends garment life with zero new production</li>
                        <li>Certified organic from a local sustainable brand vs shipped conventional polyester</li>
                        <li>Poorly constructed handmade garments that fall apart quickly are not sustainable</li>
                    </ul>
                    <h2 className={styles.sectionTitle} style={{ marginTop: 20 }}>When Making Beats Buying</h2>
                    <ul style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", paddingLeft: 20, lineHeight: 2 }}>
                        <li>Making from organic or certified fabric and keeping 5+ years</li>
                        <li>Repairing and altering instead of replacing</li>
                        <li>Upcycling existing materials (zero new production)</li>
                        <li>Zero-waste pattern cutting designs</li>
                    </ul>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}