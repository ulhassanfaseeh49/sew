"use client";
import { useState } from "react";
import Link from "next/link";
import { Layers, ChevronDown, Scissors, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const weights = [
    { wt: "100wt", desc: "Ultra-fine", use: "Heirloom, applique edges", needle: "60/8 - 65/9", vis: "Invisible" },
    { wt: "80wt", desc: "Very fine", use: "Delicate fabrics, bobbin thread", needle: "65/9 - 70/10", vis: "Nearly invisible" },
    { wt: "60wt", desc: "Fine", use: "Lightweight fabrics, invisible seams", needle: "70/10 - 80/12", vis: "Nearly invisible" },
    { wt: "50wt", desc: "Standard", use: "General sewing, quilting piecing", needle: "80/12", vis: "Subtle" },
    { wt: "40wt", desc: "Slightly heavy", use: "Machine embroidery, quilting", needle: "80/12 - 90/14", vis: "Visible" },
    { wt: "30wt", desc: "Heavy", use: "Topstitching, decorative", needle: "90/14 - 100/16", vis: "Clearly visible" },
    { wt: "12wt", desc: "Very heavy", use: "Hand-look quilting, decorative", needle: "100/16 - 110/18", vis: "Very visible" },
];
const relatedTools = [
    { name: "Thread by Fabric", href: "/needles-thread/thread-by-fabric", icon: Scissors },
    { name: "Thread Color", href: "/notions/thread-color-matching", icon: Layers },
    { name: "Thread Yardage", href: "/notions/thread-yardage", icon: Ruler },
];
const faqItems = [
    { q: "Why does a higher number mean thinner thread?", a: "The weight number represents how many meters of thread weigh 1 gram. 50wt means 50 meters weighs 1g. 100wt means 100 meters weighs 1g -- so the thread must be thinner." },
    { q: "What thread weight should I use for quilting?", a: "50wt for piecing (less bulk in seams). 40wt for machine quilting (slightly visible). 12wt or 30wt for decorative or hand-look quilting." },
    { q: "Can I use different weights in the needle and bobbin?", a: "Yes. A common technique is 50wt on top and 60wt in the bobbin. The lighter bobbin thread saves space and is often invisible." },
];

export default function ThreadWeightPage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Notions", href: "/notions" }, { label: "Thread Weight Comparison" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Layers size={14} strokeWidth={1.5} /> Notions</span><h1>Thread Weight Comparison Tool</h1><p>Compare thread weights across the numbering system with project recommendations and needle pairing.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Thread Weight Reference</h2>
                    <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginBottom: 16, fontStyle: "italic" }}>Important: Higher number = FINER/THINNER thread. Lower number = HEAVIER/THICKER thread.</p>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Weight</th><th>Category</th><th>Best Uses</th><th>Needle Size</th><th>Visibility</th></tr></thead>
                        <tbody>{weights.map(w => (<tr key={w.wt}><td style={{ fontWeight: 600 }}>{w.wt}</td><td>{w.desc}</td><td>{w.use}</td><td>{w.needle}</td><td>{w.vis}</td></tr>))}</tbody>
                    </table></div>
                </div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Tex Weight Cross-Reference</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Standard Weight</th><th>Tex Equivalent</th></tr></thead>
                        <tbody>
                            <tr><td>50wt</td><td>Tex 27</td></tr><tr><td>60wt</td><td>Tex 18</td></tr>
                            <tr><td>40wt</td><td>Tex 35</td></tr><tr><td>30wt</td><td>Tex 50</td></tr>
                            <tr><td>12wt</td><td>Tex 90</td></tr>
                        </tbody>
                    </table></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}