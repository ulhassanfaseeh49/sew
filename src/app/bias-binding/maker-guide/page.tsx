"use client";
import { useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronDown, Scissors, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const makers = [
    { size: "6mm", output: '1/4" (6mm)', cut: '1/2" (12mm)', doubleFold: '1/8" (3mm)', best: "Lingerie, delicate edges", difficulty: "Challenging" },
    { size: "12mm", output: '1/2" (12mm)', cut: '1" (25mm)', doubleFold: '1/4" (6mm)', best: "Garment edges, standard", difficulty: "Moderate" },
    { size: "18mm", output: '3/4" (18mm)', cut: '1-1/2" (38mm)', doubleFold: '3/8" (9mm)', best: "General purpose, bags", difficulty: "Easy" },
    { size: "25mm", output: '1" (25mm)', cut: '2" (50mm)', doubleFold: '1/2" (12mm)', best: "Bags, aprons, quilt binding", difficulty: "Very easy" },
    { size: "50mm", output: '2" (50mm)', cut: '4" (100mm)', doubleFold: '1" (25mm)', best: "Wide decorative binding", difficulty: "Easy" },
];

const relatedTools = [
    { name: "Tape Width Calc", href: "/bias-binding/tape-width", icon: Scissors },
    { name: "Fold Comparator", href: "/bias-binding/fold-comparator", icon: Ruler },
    { name: "Continuous Bias", href: "/bias-binding/continuous-bias", icon: Scissors },
];
const faqItems = [
    { q: "What size bias tape maker do I need?", a: "The mm number is the OUTPUT width (finished single fold tape). For 1/2\" finished tape, use 12mm. For 1\" finished tape, use 25mm maker." },
    { q: "Does a bias tape maker make double fold tape?", a: "No. Tape makers produce single fold only. To make double fold, fold the single fold tape in half again and press." },
    { q: "Which bias tape maker is best for beginners?", a: "The 25mm maker is the easiest to use. The wider strips are easier to handle and feed through smoothly." },
];

export default function MakerGuidePage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Bias Binding", href: "/bias-binding" }, { label: "Maker Guide" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><BookOpen size={14} strokeWidth={1.5} /> Bias Binding</span><h1>Bias Tape Maker Size Guide</h1><p>Complete guide to bias tape maker sizes -- what to cut and what each tool produces.</p></div>
                {makers.map(m => (<div key={m.size} className="calculator-card">
                    <h3 style={{ fontSize: "var(--text-base)", fontWeight: 600, marginBottom: 8 }}>{m.size} Tape Maker</h3>
                    <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 2 }}>
                        <div><strong>Output (single fold):</strong> {m.output}</div>
                        <div><strong>Cut strip width:</strong> {m.cut}</div>
                        <div><strong>Double fold output:</strong> {m.doubleFold}</div>
                        <div style={{ color: "var(--color-accent)", fontWeight: 500 }}>Best for: {m.best}</div>
                        <div>Difficulty: {m.difficulty}</div>
                    </div>
                </div>))}
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Complete Comparison</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Maker</th><th>Single Fold</th><th>Cut Strip</th><th>Double Fold</th><th>Best For</th></tr></thead>
                        <tbody>{makers.map(m => (<tr key={m.size}><td style={{ fontWeight: 600 }}>{m.size}</td><td>{m.output}</td><td>{m.cut}</td><td>{m.doubleFold}</td><td style={{ fontSize: 13 }}>{m.best}</td></tr>))}</tbody>
                    </table></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}