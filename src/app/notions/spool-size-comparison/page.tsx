"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Package, Copy, Printer, ChevronDown, Scissors, Layers } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const spools = [
    { name: "Mini spool", yards: 100, price: 2.49 },
    { name: "Standard spool", yards: 250, price: 3.99 },
    { name: "Large spool", yards: 500, price: 5.99 },
    { name: "King spool", yards: 1000, price: 8.99 },
    { name: "Cone", yards: 3000, price: 14.99 },
    { name: "Industrial cone", yards: 6000, price: 22.99 },
];
const relatedTools = [
    { name: "Thread Yardage", href: "/notions/thread-yardage", icon: Scissors },
    { name: "Bobbin Thread", href: "/notions/bobbin-thread", icon: Scissors },
    { name: "Thread Weight", href: "/notions/thread-weight-comparison", icon: Layers },
];
const faqItems = [
    { q: "What spool size should I buy for quilting?", a: "If you quilt regularly, buy cones (3,000+ yards). The cost per yard is 60-70% less than small spools, and you avoid running out mid-project." },
    { q: "Does thread expire or go bad?", a: "Yes. Thread weakens with age, especially cotton. Old thread snaps easily. If a spool is over 10 years old or frays when pulled, replace it." },
    { q: "Is buying in bulk always cheaper?", a: "Per yard, yes. But only buy large quantities of colors you use often. For one-project colors, a standard spool is more economical." },
];

export default function SpoolSizePage() {
    const [neededYards, setNeededYards] = useState("80"); const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);
    const ny = parseFloat(neededYards) || 0;
    const hasResult = ny > 0;
    const bestValue = spools.reduce((best, s) => (s.price / s.yards < best.price / best.yards) ? s : best, spools[0]);

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`For ${ny} yards: Best value is ${bestValue.name} at $${(bestValue.price / bestValue.yards * 36).toFixed(2)}/yd`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [ny, bestValue]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Notions", href: "/notions" }, { label: "Spool Size Comparison" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Package size={14} strokeWidth={1.5} /> Notions</span><h1>Spool Size Comparison Tool</h1><p>Compare thread spool sizes by cost per yard to find the best value for your project.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>How Much Thread Do You Need?</h2>
                    <div className="calculator-form">
                        <div className="input-group"><label className="input-label">Yards Needed</label><input type="number" className="input-field input-mono" value={neededYards} onChange={e => setNeededYards(e.target.value)} min="1" /></div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Spool</th><th>Yards</th><th>Price*</th><th>$/yard</th><th>Fits?</th></tr></thead>
                            <tbody>{spools.map(s => (<tr key={s.name} style={{ background: s.yards >= ny && (s.yards - ny < s.yards * 0.5) ? "var(--color-surface-hover)" : undefined }}>
                                <td style={{ fontWeight: 600 }}>{s.name}</td><td>{s.yards.toLocaleString()}</td><td>${s.price.toFixed(2)}</td><td>${(s.price / s.yards).toFixed(4)}</td><td>{s.yards >= ny ? "Yes" : "No"}</td>
                            </tr>))}</tbody>
                        </table></div>
                        <p style={{ margin: "12px 0 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", fontStyle: "italic" }}>*Approximate retail prices for all-purpose polyester thread. Actual prices vary by brand.</p>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}