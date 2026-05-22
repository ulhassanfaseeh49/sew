"use client";
import { useState } from "react";
import Link from "next/link";
import { Database, ChevronDown, Droplets, BookOpen, Search } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const fabrics = [
    { name: "Quilting Cotton", fiber: "Cotton", construction: "Woven", lenShrink: "3-5%", crossShrink: "2-4%", care: "Machine warm", preWash: "Recommended" },
    { name: "Muslin / Calico", fiber: "Cotton", construction: "Woven (loose)", lenShrink: "5-8%", crossShrink: "3-5%", care: "Machine warm", preWash: "Essential" },
    { name: "Denim", fiber: "Cotton", construction: "Twill", lenShrink: "3-5%", crossShrink: "1-3%", care: "Machine warm", preWash: "Essential" },
    { name: "Cotton Flannel", fiber: "Cotton", construction: "Woven", lenShrink: "4-7%", crossShrink: "2-4%", care: "Machine warm", preWash: "Essential" },
    { name: "Cotton Lawn", fiber: "Cotton", construction: "Woven (fine)", lenShrink: "3-5%", crossShrink: "2-3%", care: "Machine gentle", preWash: "Recommended" },
    { name: "Canvas / Duck", fiber: "Cotton", construction: "Heavy woven", lenShrink: "3-5%", crossShrink: "2-3%", care: "Machine warm", preWash: "Essential" },
    { name: "Corduroy", fiber: "Cotton", construction: "Woven", lenShrink: "4-6%", crossShrink: "2-4%", care: "Machine warm", preWash: "Essential" },
    { name: "100% Linen (light)", fiber: "Linen", construction: "Woven", lenShrink: "5-10%", crossShrink: "3-7%", care: "Machine warm", preWash: "Essential (2-3 washes)" },
    { name: "100% Linen (heavy)", fiber: "Linen", construction: "Woven", lenShrink: "4-8%", crossShrink: "3-5%", care: "Machine warm", preWash: "Essential" },
    { name: "Linen/Cotton Blend", fiber: "Blend", construction: "Woven", lenShrink: "3-7%", crossShrink: "2-5%", care: "Machine warm", preWash: "Essential" },
    { name: "Wool Suiting", fiber: "Wool", construction: "Woven", lenShrink: "2-5%", crossShrink: "1-3%", care: "Dry clean / steam", preWash: "Steam only" },
    { name: "Merino Wool Knit", fiber: "Wool", construction: "Knit", lenShrink: "3-8%", crossShrink: "2-5%", care: "Hand wash cold", preWash: "Essential" },
    { name: "Silk Charmeuse", fiber: "Silk", construction: "Satin weave", lenShrink: "1-3%", crossShrink: "1-2%", care: "Hand wash / dry clean", preWash: "Optional" },
    { name: "Silk Dupioni", fiber: "Silk", construction: "Woven", lenShrink: "2-4%", crossShrink: "1-3%", care: "Dry clean", preWash: "Dry clean only" },
    { name: "100% Rayon", fiber: "Rayon", construction: "Woven", lenShrink: "5-12%", crossShrink: "3-8%", care: "Hand wash cold", preWash: "ESSENTIAL" },
    { name: "Rayon Challis", fiber: "Rayon", construction: "Woven", lenShrink: "5-10%", crossShrink: "3-7%", care: "Hand wash cold", preWash: "ESSENTIAL" },
    { name: "100% Polyester", fiber: "Polyester", construction: "Various", lenShrink: "0-1%", crossShrink: "0-1%", care: "Machine any", preWash: "Optional" },
    { name: "Polyester Fleece", fiber: "Polyester", construction: "Knit", lenShrink: "0-1%", crossShrink: "0-1%", care: "Machine warm", preWash: "Optional" },
    { name: "Jersey Knit (cotton)", fiber: "Cotton", construction: "Knit", lenShrink: "3-6%", crossShrink: "2-4%", care: "Machine warm", preWash: "Recommended" },
    { name: "Bamboo Jersey", fiber: "Bamboo", construction: "Knit", lenShrink: "3-6%", crossShrink: "2-4%", care: "Machine gentle", preWash: "Recommended" },
    { name: "Tencel / Lyocell", fiber: "Tencel", construction: "Woven", lenShrink: "2-4%", crossShrink: "1-3%", care: "Machine gentle", preWash: "Recommended" },
    { name: "Nylon", fiber: "Nylon", construction: "Various", lenShrink: "0-1%", crossShrink: "0-1%", care: "Machine any", preWash: "Optional" },
    { name: "Cotton/Spandex", fiber: "Blend", construction: "Knit", lenShrink: "3-5%", crossShrink: "2-4%", care: "Machine warm", preWash: "Recommended" },
    { name: "Hemp Fabric", fiber: "Hemp", construction: "Woven", lenShrink: "3-5%", crossShrink: "2-3%", care: "Machine warm", preWash: "Recommended" },
];

const relatedTools = [
    { name: "Pre-Wash Estimator", href: "/shrinkage/pre-wash-estimator", icon: Droplets },
    { name: "Pre-Washing Guide", href: "/shrinkage/pre-washing-guide", icon: BookOpen },
    { name: "Shrinkage % Calc", href: "/shrinkage/percentage-calculator", icon: Droplets },
];
const faqItems = [
    { q: "Why does shrinkage vary within the same fabric type?", a: "Manufacturing processes, weave tightness, finishing treatments, and fabric quality all affect shrinkage. Two cotton fabrics from different mills can behave quite differently." },
    { q: "What does Sanforized/pre-shrunk mean?", a: "Sanforized fabric has been treated to reduce shrinkage to under 1%. Pre-shrunk is a broader term with less precision — may still shrink 1-3%." },
    { q: "Why do knits shrink differently than wovens?", a: "Knits can stretch and recover, so shrinkage often looks different. Knits tend to shrink more in length and may also draw in (narrow) more than wovens." },
];

export default function FabricDatabasePage() {
    const [search, setSearch] = useState(""); const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const filtered = fabrics.filter(f => f.name.toLowerCase().includes(search.toLowerCase()) || f.fiber.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Shrinkage", href: "/shrinkage" }, { label: "Fabric Database" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Database size={14} strokeWidth={1.5} /> Shrinkage</span><h1>Fabric Type Shrinkage Database</h1><p>Searchable reference of expected shrinkage by fabric type and fiber content.</p></div>
                <div className="calculator-card">
                    <div className="input-group" style={{ marginBottom: 16 }}><div style={{ position: "relative" }}><Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-secondary)" }} /><input type="text" className="input-field" placeholder="Search fabrics..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36 }} /></div></div>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Fabric</th><th>Fiber</th><th>Length</th><th>Cross</th><th>Care</th><th>Pre-Wash</th></tr></thead>
                        <tbody>{filtered.map(f => (<tr key={f.name}><td style={{ fontWeight: 600 }}>{f.name}</td><td>{f.fiber}</td><td>{f.lenShrink}</td><td>{f.crossShrink}</td><td style={{ fontSize: 13 }}>{f.care}</td><td style={{ fontSize: 13, fontWeight: f.preWash === "ESSENTIAL" ? 700 : 500, color: f.preWash === "ESSENTIAL" ? "var(--color-error)" : undefined }}>{f.preWash}</td></tr>))}</tbody>
                    </table></div>
                    <p style={{ marginTop: 12, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>Showing {filtered.length} of {fabrics.length} fabrics. Ranges represent typical variation by manufacturer and finishing.</p>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}