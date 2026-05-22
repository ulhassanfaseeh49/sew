"use client";
import { useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronDown, Scissors, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const placements = [
    { garment: "Dress", positions: ["Hem edge", "Neckline edge", "Sleeve cuff", "Waist seam", "Bodice center panel", "Sleeve panel (insertion)"] },
    { garment: "Skirt", positions: ["Hem edge", "Waistband top", "Above-hem band (3-6\" up)", "Along seam lines", "Tiered between layers"] },
    { garment: "Blouse / Top", positions: ["Neckline", "Collar edge", "Cuff edge", "Yoke seam", "Button placket", "Hem edge"] },
    { garment: "Cushion / Pillow", positions: ["Perimeter edge (piping/fringe)", "Center panel border", "Flange edge", "Between patchwork sections"] },
    { garment: "Curtain", positions: ["Bottom hem", "Side edges", "Tieback trim", "Across panel (1/3 up)", "Top valance edge"] },
];

const trimMatch = [
    { trim: "Lace edging", best: "Hems, necklines, cuffs" },
    { trim: "Gathered lace", best: "Ruffled edges, baby items, Victorian" },
    { trim: "Rickrack", best: "Retro, children's, quilts" },
    { trim: "Piping", best: "Cushions, structured seams" },
    { trim: "Fringe", best: "Shawls, bohemian, home decor" },
    { trim: "Pom-pom trim", best: "Children's, boho curtains, tiers" },
    { trim: "Ribbon", best: "Sashes, edge trim, bows" },
];

const relatedTools = [
    { name: "Lace Straight", href: "/lace-trim/lace-straight", icon: Scissors },
    { name: "Ribbon Calc", href: "/lace-trim/ribbon", icon: Scissors },
    { name: "Rickrack Calc", href: "/lace-trim/rickrack", icon: Ruler },
];
const faqItems = [
    { q: "Where should I place trim on a dress?", a: "Most common: hem edge. Other options: neckline, cuffs, waist seam, or bodice panel. Use the rule of thirds -- place trim at 1/3 or 2/3 of the garment height." },
    { q: "How do I avoid over-trimming?", a: "Choose one to two trim types maximum. Keep trim scale proportional to the garment. If using patterned fabric, use simpler trims." },
    { q: "What trim works best for beginners?", a: "Rickrack (medium size) is the most forgiving trim to work with. It is flexible, easy to sew, and hides small irregularities." },
];

export default function PlacementGuidePage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Lace & Trim", href: "/lace-trim" }, { label: "Placement Guide" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><BookOpen size={14} strokeWidth={1.5} /> Lace and Trim</span><h1>Trim Placement Guide</h1><p>Visual guide for where to place trim on garments and home decor items.</p></div>
                {placements.map(p => (<div key={p.garment} className="calculator-card">
                    <h3 style={{ fontSize: "var(--text-base)", fontWeight: 600, marginBottom: 8 }}>{p.garment}</h3>
                    <ul style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 2, paddingLeft: 20, margin: 0 }}>{p.positions.map(pos => (<li key={pos}>{pos}</li>))}</ul>
                </div>))}
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Trim Type Matching</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Trim Type</th><th>Best For</th></tr></thead>
                        <tbody>{trimMatch.map(t => (<tr key={t.trim}><td style={{ fontWeight: 600 }}>{t.trim}</td><td>{t.best}</td></tr>))}</tbody>
                    </table></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}