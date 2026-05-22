"use client";
import { useState } from "react";
import Link from "next/link";
import { Palette, ChevronDown, Scissors, Layers } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const strategies = [
    { name: "Exact Match", when: "Seams that should not show, zipper insertion, general construction", tip: "Match to the DARKER shade when between two options. Thread appears lighter once sewn." },
    { name: "Blend (One Shade Darker)", when: "Most garment sewing -- safer than exact match", tip: "Thread looks lighter when it catches light on the sewing machine. Going one shade darker compensates." },
    { name: "Contrast / Decorative", when: "Topstitching as a design feature, visible construction details", tip: "Use complementary colors for pop, or classic gold topstitching on denim." },
    { name: "Neutral Thread", when: "Printed fabrics, plaids, multicolor patchwork", tip: "Medium gray blends with most prints. Match the gray to the medium value in the print." },
    { name: "Invisible / Monofilament", when: "Applique, quilting, piecing multicolor blocks", tip: "Use clear for light fabrics, smoke for dark fabrics. Loosen tension slightly." },
];
const relatedTools = [
    { name: "Thread Weight", href: "/notions/thread-weight-comparison", icon: Layers },
    { name: "Thread by Fabric", href: "/notions/thread-by-fabric", icon: Scissors },
    { name: "Thread Yardage", href: "/notions/thread-yardage", icon: Scissors },
];
const faqItems = [
    { q: "Should I go lighter or darker when choosing thread?", a: "Always go one shade DARKER. Thread appears lighter when sewn because it catches light on the surface. A slightly darker thread blends better than a lighter one." },
    { q: "What thread color for multicolor prints?", a: "Use a medium-value gray that matches the overall 'value' of the print. Step back, squint at the fabric, and choose a gray that matches that blurry impression." },
    { q: "Why does my thread look different on the fabric than on the spool?", a: "Spools show concentrated color. When sewn, thread is spread thin across fabric. Also, store fluorescent lighting differs from natural daylight. Always test in daylight." },
];

export default function ThreadColorPage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Notions", href: "/notions" }, { label: "Thread Color Matching" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Palette size={14} strokeWidth={1.5} /> Notions</span><h1>Thread Color Matching Guide</h1><p>Choose the right thread color for any fabric with proven color-matching strategies.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Color Matching Strategies</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {strategies.map(s => (<div key={s.name} style={{ borderLeft: "3px solid var(--color-primary)", paddingLeft: 16 }}>
                            <h4 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 4 }}>{s.name}</h4>
                            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", margin: "0 0 4px", lineHeight: 1.6 }}><strong>When:</strong> {s.when}</p>
                            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.6, fontStyle: "italic" }}>{s.tip}</p>
                        </div>))}
                    </div>
                </div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>The Fold Test</h2>
                    <ol style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
                        <li>Unwind about 12 inches of thread from the spool.</li>
                        <li>Fold the thread over the fabric several times to create a small bundle.</li>
                        <li>View under natural daylight -- not store fluorescent lighting.</li>
                        <li>The bundle should nearly disappear into the fabric color.</li>
                        <li>If between two shades, pick the darker one.</li>
                    </ol>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}