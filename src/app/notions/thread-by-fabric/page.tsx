"use client";
import { useState } from "react";
import Link from "next/link";
import { Grid3X3, ChevronDown, Scissors, Layers } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const matrix = [
    { fabric: "Quilting cotton", thread: "50wt cotton", alt: "50wt poly", avoid: "Heavy thread (30wt) -- too thick for piecing" },
    { fabric: "Silk / chiffon", thread: "60-80wt silk or poly", alt: "Extra-fine cotton", avoid: "Standard 50wt -- creates pucker" },
    { fabric: "Denim", thread: "40wt poly or cotton", alt: "Heavy-duty poly", avoid: "Fine thread -- weak seams under stress" },
    { fabric: "Knit / jersey", thread: "50wt poly w/ serger thread", alt: "Woolly nylon (serger)", avoid: "100% cotton -- no stretch, snaps" },
    { fabric: "Linen", thread: "50wt cotton or linen", alt: "50wt poly", avoid: "Nylon -- different heat tolerance" },
    { fabric: "Wool", thread: "50wt poly or silk", alt: "Cotton for topstitch", avoid: "Stiff thread -- creates holes" },
    { fabric: "Leather / vinyl", thread: "40wt poly or nylon", alt: "V-69 bonded nylon", avoid: "Cotton -- rots, too weak" },
    { fabric: "Fleece", thread: "50wt poly + woolly nylon", alt: "Stretch thread in bobbin", avoid: "Short staple cotton -- pills" },
    { fabric: "Tulle / net", thread: "60-80wt poly or mono", alt: "Monofilament", avoid: "Heavy thread -- distorts mesh" },
    { fabric: "Canvas / duck", thread: "40wt poly or heavy-duty", alt: "V-92 bonded nylon", avoid: "Fine thread -- seams fail under load" },
];
const relatedTools = [
    { name: "Thread Weight", href: "/notions/thread-weight-comparison", icon: Layers },
    { name: "Thread Color", href: "/notions/thread-color-matching", icon: Scissors },
    { name: "Thread Yardage", href: "/notions/thread-yardage", icon: Scissors },
];
const faqItems = [
    { q: "Can I use polyester thread on natural fabrics?", a: "Yes. Modern polyester thread is fine for cotton and linen. The old concern about poly thread cutting natural fibers under stress is largely unfounded with modern thread." },
    { q: "Why does my thread keep breaking?", a: "Most common causes: wrong thread weight for fabric, old/degraded thread, wrong needle size, or too-tight tension. Try a fresh spool and correct needle first." },
    { q: "Is cotton or polyester thread better?", a: "Poly is stronger and more durable. Cotton is softer and preferred for heirloom work. For everyday sewing, either works -- pick based on project needs." },
];

export default function ThreadByFabricPage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Notions", href: "/notions" }, { label: "Thread by Fabric" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Grid3X3 size={14} strokeWidth={1.5} /> Notions</span><h1>Thread Type by Fabric Guide</h1><p>Fabric-to-thread compatibility matrix with recommendations and pitfalls.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Fabric-Thread Compatibility</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Fabric</th><th>Best Thread</th><th>Alternative</th><th>Avoid</th></tr></thead>
                        <tbody>{matrix.map(m => (<tr key={m.fabric}><td style={{ fontWeight: 600 }}>{m.fabric}</td><td>{m.thread}</td><td>{m.alt}</td><td style={{ color: "var(--color-text-secondary)", fontStyle: "italic" }}>{m.avoid}</td></tr>))}</tbody>
                    </table></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}