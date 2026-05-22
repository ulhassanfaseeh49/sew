"use client";
import { useState } from "react";
import Link from "next/link";
import { Target, ChevronDown, BookOpen, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";
const relatedTools = [
    { name: "Thread by Fabric", href: "/needles-thread/thread-by-fabric", icon: Ruler },
    { name: "Needle by Fabric", href: "/needles-thread/needle-by-fabric", icon: BookOpen },
];
const faqItems = [
    { q: "What thread for quilting?", a: "Cotton 50wt for piecing (like Aurifil 50wt). Cotton 40wt or poly for machine quilting. For hand quilting, use special hand quilting thread (glazed cotton)." },
    { q: "What thread for garments?", a: "All-purpose polyester 40-50wt for most garments. Use matching color. For topstitching, use heavier thread (30wt) with a topstitch needle." },
    { q: "What thread for bags?", a: "Polyester 40wt for seams. For topstitching and handles, use heavy-duty 30wt or even upholstery-weight nylon thread with a denim needle 100/16." },
];
export default function ThreadByProjectPage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Needles & Thread", href: "/needles-thread" }, { label: "Thread by Project" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Target size={14} strokeWidth={1.5} /> Needles & Thread</span>
                        <h1>Thread by Project Guide</h1>
                        <p>Thread recommendations organized by project type for quick reference.</p>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.sectionTitle}>Thread by Project Type</h2>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead><tr><th>Project</th><th>Thread Type</th><th>Weight</th><th>Notes</th></tr></thead>
                                <tbody>
                                    {[
                                        ["Quilting (piecing)", "Cotton", "50wt", "Aurifil, Gutermann Natural Cotton"],
                                        ["Quilting (machine quilting)", "Cotton or Poly", "40-50wt", "Thicker for visible quilting"],
                                        ["Garment sewing", "All-purpose Poly", "40-50wt", "Match fabric color closely"],
                                        ["Garment topstitch", "Heavy Poly", "30wt", "Topstitch needle required"],
                                        ["Knit garments", "Poly (slight stretch)", "40wt", "Wooly nylon for serger loopers"],
                                        ["Swimwear", "Wooly Nylon", "—", "Essential for stretch + recovery"],
                                        ["Bags & accessories", "Heavy Poly or Nylon", "30wt", "Strong for wear and tear"],
                                        ["Machine embroidery", "Rayon or Poly", "40wt", "Rayon for sheen, poly for wash"],
                                        ["Hand sewing", "All-purpose or Silk", "50wt", "Wax for hand sewing ease"],
                                        ["Upholstery", "Nylon or Heavy Poly", "30wt", "UV-resistant for outdoor"],
                                        ["Serger (overlock)", "Serger Poly", "40-50wt", "Buy on cones for economy"],
                                        ["Bobbin fill", "Lightweight Poly", "60-80wt", "Thin bobbin thread reduces bulk"],
                                    ].map(([p, t, w, n]) => (
                                        <tr key={p}><td style={{ fontFamily: "inherit", fontWeight: 500 }}>{p}</td><td style={{ fontFamily: "inherit" }}>{t}</td><td>{w}</td><td style={{ fontFamily: "inherit", fontSize: 13 }}>{n}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside>
            </div>
        </div>
    );
}