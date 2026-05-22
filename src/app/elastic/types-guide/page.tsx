"use client";
import { useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronDown, Ruler, Activity } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const types = [
    { name: "Braided Elastic", stretch: "50-75%", widths: '1/4" to 3"', best: "Casings, lightweight, children's", avoid: "Direct application (narrows when stretched)", care: "Wash warm, air dry", durability: "2-3 years" },
    { name: "Knitted Elastic", stretch: "50-70%", widths: '1/4" to 3"', best: "All-purpose, direct or casing, lingerie", avoid: "None -- most versatile type", care: "Machine wash, tumble low", durability: "2-4 years" },
    { name: "Woven Elastic", stretch: "60-75%", widths: '1/2" to 3"', best: "Structured waistbands, heavy fabrics, durability", avoid: "Delicate applications (stiffer feel)", care: "Machine wash, tumble low", durability: "3-5 years" },
    { name: "Clear/Poly Elastic", stretch: "60-80%", widths: '1/4" to 3/4"', best: "Stabilizing knit seams, lingerie, invisible use", avoid: "High-heat applications (melts easily)", care: "Hand wash, air dry", durability: "1-3 years" },
    { name: "Fold-Over Elastic (FOE)", stretch: "50-70%", widths: '5/8" (folds to 3/8")', best: "Lingerie edges, baby clothes, activewear edges", avoid: "Casings (designed for edge finishing)", care: "Machine wash, tumble low", durability: "2-3 years" },
    { name: "Swimwear Elastic", stretch: "65-80%", widths: '1/4" to 1"', best: "Swimwear only (chlorine/salt resistant)", avoid: "Non-swimwear (unnecessarily expensive)", care: "Rinse after pool, air dry", durability: "1-2 seasons" },
    { name: "No-Roll Elastic", stretch: "50-65%", widths: '3/4" to 3"', best: "Wide waistbands, pants (stays flat)", avoid: "Narrow applications (stiffer)", care: "Machine wash, tumble low", durability: "3-5 years" },
    { name: "Buttonhole Elastic", stretch: "50-70%", widths: '3/4" to 1"', best: "Adjustable children's/maternity waistbands", avoid: "Non-adjustable applications", care: "Machine wash, tumble low", durability: "2-3 years" },
];

const projectMatch = [
    { project: "Pajama pants", rec: "Knitted or woven, 3/4\"-1\"" },
    { project: "Swimsuit", rec: "Swimwear elastic, 1/4\"-1/2\"" },
    { project: "Leggings", rec: "Knitted, 1\"-3\"" },
    { project: "Lingerie edge", rec: "FOE or clear 1/4\"" },
    { project: "Children's pants", rec: "Knitted or braided, 1/2\"-3/4\"" },
    { project: "Athletic waistband", rec: "Woven, 1\"-3\"" },
    { project: "Shoulder stabilizer", rec: "Clear 1/4\"" },
    { project: "Baby clothing", rec: "Knitted 1/4\"-1/2\" or FOE" },
    { project: "Maternity", rec: "Buttonhole or knitted extra wide" },
];

const relatedTools = [
    { name: "Waist Elastic Calc", href: "/elastic/waist-calculator", icon: Ruler },
    { name: "Recovery Calc", href: "/elastic/recovery-calculator", icon: Activity },
    { name: "Clear Elastic Calc", href: "/elastic/clear-elastic", icon: Ruler },
];
const faqItems = [
    { q: "Can I substitute braided for knitted elastic?", a: "In a casing: yes, braided works fine. For direct application on fabric: no, because braided elastic narrows when stretched, causing problems." },
    { q: "Can I use regular elastic in swimwear?", a: "No. Regular elastic degrades rapidly with chlorine and salt water. Always use swimwear-specific elastic for pool and beach garments." },
    { q: "What is the most versatile elastic type?", a: "Knitted elastic. It maintains width when stretched, works in casings or sewn directly, comes in all widths, and is soft enough for most applications." },
];

export default function TypesGuidePage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Elastic", href: "/elastic" }, { label: "Types Guide" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><BookOpen size={14} strokeWidth={1.5} /> Elastic</span><h1>Elastic Types and Applications Guide</h1><p>Complete reference for all elastic types with properties, uses, and project matching.</p></div>
                {types.map(t => (<div key={t.name} className="calculator-card">
                    <h3 style={{ fontSize: "var(--text-base)", fontWeight: 600, marginBottom: 8 }}>{t.name}</h3>
                    <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 2 }}>
                        <div><strong>Stretch:</strong> {t.stretch} | <strong>Widths:</strong> {t.widths} | <strong>Durability:</strong> {t.durability}</div>
                        <div style={{ color: "var(--color-accent)", fontWeight: 500 }}>Best for: {t.best}</div>
                        <div>Avoid: {t.avoid}</div>
                        <div>Care: {t.care}</div>
                    </div>
                </div>))}
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Project Matching Quick Reference</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Project</th><th>Recommended Elastic</th></tr></thead>
                        <tbody>{projectMatch.map(p => (<tr key={p.project}><td style={{ fontWeight: 600 }}>{p.project}</td><td>{p.rec}</td></tr>))}</tbody>
                    </table></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}