"use client";
import { useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronDown, Scissors, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const compData = [
    { feature: "Layers", single: "2", double: "4" },
    { feature: "Cut width for 1/2\" finished", single: '2"', double: '4"' },
    { feature: "Finished width (from 2\" cut)", single: '1/2"', double: '1/4"' },
    { feature: "Raw edges", single: "Hidden inside folds", double: "Fully enclosed" },
    { feature: "Thickness", single: "Medium", double: "Thick (4 layers)" },
    { feature: "Best for", single: "Seam finishing, piping, flat trim", double: "Edge binding, quilt binding" },
];

const widthRef = [
    { fin: '1/4" (6mm)', sCut: '1"', dCut: '2"' },
    { fin: '1/2" (12mm)', sCut: '2"', dCut: '4"' },
    { fin: '3/4" (18mm)', sCut: '3"', dCut: '6"' },
    { fin: '1" (25mm)', sCut: '4"', dCut: '8"' },
];

const relatedTools = [
    { name: "Tape Width Calc", href: "/bias-binding/tape-width", icon: Scissors },
    { name: "Finished Width Calc", href: "/bias-binding/finished-width", icon: Ruler },
    { name: "Quilt Binding Calc", href: "/bias-binding/quilt-binding", icon: BookOpen },
];
const faqItems = [
    { q: "What is the difference between single and double fold bias tape?", a: "Single fold: both edges folded to center (2 layers). Double fold: single fold tape folded in half again (4 layers). Double fold is standard for binding edges." },
    { q: "Can I make double fold from single fold?", a: "Yes! Simply fold single fold tape in half again and press. The resulting double fold tape will be half the width of the single fold." },
    { q: "Which type is standard for quilt binding?", a: "Double fold (also called French binding). Cut strips 2-1/4\" to 2-1/2\" wide, fold in half wrong sides together, then apply to quilt edge." },
];

export default function FoldComparatorPage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Bias Binding", href: "/bias-binding" }, { label: "Single vs Double Fold" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><BookOpen size={14} strokeWidth={1.5} /> Bias Binding</span><h1>Single Fold vs Double Fold Comparator</h1><p>Comprehensive comparison of single fold and double fold bias tape to help you choose.</p></div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Side-by-Side Comparison</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Feature</th><th>Single Fold</th><th>Double Fold</th></tr></thead>
                        <tbody>{compData.map(r => (<tr key={r.feature}><td style={{ fontWeight: 600 }}>{r.feature}</td><td>{r.single}</td><td>{r.double}</td></tr>))}</tbody>
                    </table></div>
                </div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>When to Use Each</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div><h4 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 8 }}>Single Fold</h4><ul style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 2, paddingLeft: 20, margin: 0 }}><li>Finishing seams</li><li>Making piping</li><li>Decorative trim applied flat</li><li>When less bulk is needed</li><li>Lingerie edges</li></ul></div>
                        <div><h4 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 8 }}>Double Fold</h4><ul style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 2, paddingLeft: 20, margin: 0 }}><li>Quilt binding</li><li>Garment edge binding</li><li>Bag and accessory edges</li><li>Fully enclosed raw edges</li><li>Baby and children items</li></ul></div>
                    </div>
                </div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Width Reference Table</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Finished Width</th><th>Single Fold Cut</th><th>Double Fold Cut</th></tr></thead>
                        <tbody>{widthRef.map(r => (<tr key={r.fin}><td style={{ fontWeight: 600 }}>{r.fin}</td><td>{r.sCut}</td><td>{r.dCut}</td></tr>))}</tbody>
                    </table></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}