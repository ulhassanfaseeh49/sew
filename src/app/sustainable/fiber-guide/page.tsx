"use client";
import { useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronDown, Leaf, Scale } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const fibers = [
    { name: "Organic Cotton", impact: "Low-Medium", water: "Still high but 91% less than conventional", co2: "Lower (no synthetic fertilizer)", bio: "Yes", cert: "GOTS, OCS", best: "Baby items, quilting", rating: 4 },
    { name: "Hemp", impact: "Very Low", water: "Very low — grows with rainfall", co2: "Carbon sequestering", bio: "Yes", cert: "OEKO-TEX", best: "Durable clothing, bags", rating: 5 },
    { name: "Tencel / Lyocell", impact: "Low", water: "Low — closed-loop process", co2: "Low — sustainable forestry", bio: "Yes", cert: "OEKO-TEX, EU Ecolabel", best: "Flowy garments, blouses", rating: 4 },
    { name: "Linen", impact: "Low", water: "Low — rain-fed flax", co2: "Low", bio: "Yes", cert: "Various", best: "Summer garments, home décor", rating: 4 },
    { name: "Recycled Polyester (rPET)", impact: "Medium", water: "Lower than virgin", co2: "30-50% lower", bio: "No", cert: "GRS, RCS", best: "Activewear, outerwear", rating: 3 },
    { name: "Conventional Cotton", impact: "High", water: "Very high (10,000L per kg)", co2: "Medium", bio: "Yes", cert: "None standard", best: "General — consider organic", rating: 2 },
    { name: "Silk", impact: "Medium", water: "Medium", co2: "Medium", bio: "Yes", cert: "OEKO-TEX", best: "Luxury garments", rating: 3 },
    { name: "Wool (organic/mulesing-free)", impact: "Medium", water: "Medium", co2: "Medium", bio: "Yes", cert: "RWS, ZQ", best: "Outerwear, cold-weather", rating: 3 },
];

const endOfLife = [
    { fiber: "100% Cotton", compost: "Yes", recycle: "Some programs", donate: "Yes" },
    { fiber: "100% Linen", compost: "Yes", recycle: "Limited", donate: "Yes" },
    { fiber: "100% Wool", compost: "Yes", recycle: "Yes (wool programs)", donate: "Yes" },
    { fiber: "100% Silk", compost: "Yes", recycle: "Limited", donate: "Yes" },
    { fiber: "Polyester", compost: "No", recycle: "Theoretically", donate: "Yes" },
    { fiber: "Cotton/Poly blend", compost: "No", recycle: "Very limited", donate: "Yes" },
];

const relatedTools = [
    { name: "Eco-Fabric Comparator", href: "/sustainable/eco-fabric", icon: Scale },
    { name: "Carbon Footprint", href: "/sustainable/carbon-footprint", icon: Leaf },
    { name: "Make vs Buy", href: "/sustainable/make-vs-buy", icon: Scale },
];
const faqItems = [
    { q: "What is GOTS certification?", a: "Global Organic Textile Standard — the gold standard for organic textiles. Covers the entire supply chain: organic fiber production, responsible processing, fair labor, and chemical restrictions." },
    { q: "Can I compost old fabric?", a: "Only 100% natural fibers (cotton, linen, wool, silk) with no synthetic thread or labels. Remove all non-natural components first. Cut into small pieces for faster composting." },
    { q: "Is Tencel really sustainable?", a: "Tencel (Lenzing brand) uses a closed-loop process that recycles 99%+ of the solvent. Generic lyocell may not have the same standards. Look for the Tencel brand specifically." },
];

export default function FiberGuidePage() {
    const [filter, setFilter] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const filtered = fibers.filter(f => f.name.toLowerCase().includes(filter.toLowerCase()));

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Sustainable", href: "/sustainable" }, { label: "Fiber Guide" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><BookOpen size={14} strokeWidth={1.5} /> Sustainable</span><h1>Sustainable Fiber Guide</h1><p>Comprehensive reference for eco-friendly fibers with sourcing, care, and environmental impact data.</p></div>
                <div className="calculator-card">
                    <div className="input-group" style={{ marginBottom: 16 }}><input type="text" className="input-field" placeholder="Search fibers..." value={filter} onChange={e => setFilter(e.target.value)} /></div>
                    {filtered.map(f => (<div key={f.name} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid var(--color-border)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                            <h3 style={{ fontSize: "var(--text-base)", fontWeight: 600 }}>{f.name}</h3>
                            <span style={{ fontSize: 13 }}>{"★".repeat(f.rating)}{"☆".repeat(5 - f.rating)}</span>
                        </div>
                        <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.8 }}>
                            <div>Water: {f.water}</div><div>CO2: {f.co2}</div><div>Biodegradable: {f.bio}</div>
                            <div>Certifications: {f.cert}</div><div style={{ color: "var(--color-accent)", fontWeight: 500 }}>Best for: {f.best}</div>
                        </div>
                    </div>))}
                </div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>End-of-Life Guide</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Fiber</th><th>Compostable</th><th>Recyclable</th><th>Donatable</th></tr></thead>
                        <tbody>{endOfLife.map(e => (<tr key={e.fiber}><td style={{ fontFamily: "inherit", fontWeight: 500 }}>{e.fiber}</td><td>{e.compost}</td><td>{e.recycle}</td><td>{e.donate}</td></tr>))}</tbody>
                    </table></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}