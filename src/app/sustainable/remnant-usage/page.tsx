"use client";
import { useState } from "react";
import Link from "next/link";
import { Recycle, ChevronDown, Leaf, Scissors } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const sizeRef = [
    { project: "Scrunchie", minSize: "3\" x 22\"", notes: "" },
    { project: "Bias tape (1 yard)", minSize: "12\" x 12\" square", notes: "" },
    { project: "Quilt charm square", minSize: "5\" x 5\"", notes: "" },
    { project: "Baby bib", minSize: "10\" x 12\"", notes: "" },
    { project: "Zippered pouch", minSize: "10\" x 14\"", notes: "Minimum" },
    { project: "Tote bag handles", minSize: "4\" x 18\" per handle", notes: "" },
    { project: "Headband", minSize: "4\" x 22\"", notes: "" },
    { project: "Face mask", minSize: "9\" x 7\" per mask", notes: "" },
    { project: "Small drawstring bag", minSize: "10\" x 14\"", notes: "" },
    { project: "Patchwork square", minSize: "Any size from 1.5\"", notes: "" },
    { project: "Binding strip", minSize: "2.5\" x any length", notes: "" },
];

const relatedTools = [
    { name: "Scrap Sorting Guide", href: "/sustainable/scrap-sorting", icon: Recycle },
    { name: "Waste % Calculator", href: "/sustainable/waste-percentage", icon: Leaf },
    { name: "Upcycling Calculator", href: "/sustainable/upcycling", icon: Scissors },
];
const faqItems = [
    { q: "What is the minimum useful scrap size?", a: "1.5\" squares can make patchwork postage stamp quilts. Strips 2.5\"+ wide make binding. Under 1\", consider composting natural fibers or using as stuffing." },
    { q: "What can I make from a fat quarter remnant?", a: "Tote bag handles, zippered pouch, baby bib (2), headband, bias tape (3+ yards), multiple scrunchies, or 18+ quilt charm squares." },
    { q: "Should I keep all my scraps?", a: "Be realistic. Keep medium+ pieces (9\"+ in both directions) in organized bins. Small pieces for quilting. Tiny scraps (<1\") — compost natural fibers, recycle synthetics." },
];

export default function RemnantUsagePage() {
    const [w, setW] = useState(""); const [l, setL] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const rw = parseFloat(w) || 0; const rl = parseFloat(l) || 0;
    const matches = rw > 0 && rl > 0 ? sizeRef.filter(s => {
        const parts = s.minSize.match(/(\d+\.?\d*)" ?x ?(\d+\.?\d*)"/);
        if (!parts) return false;
        const sw = parseFloat(parts[1]); const sh = parseFloat(parts[2]);
        return (rw >= sw && rl >= sh) || (rw >= sh && rl >= sw);
    }) : [];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Sustainable", href: "/sustainable" }, { label: "Remnant Usage" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Recycle size={14} strokeWidth={1.5} /> Sustainable</span><h1>Remnant Usage Calculator</h1><p>Find projects that match your leftover fabric scraps by entering dimensions.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Enter Remnant Size</h2>
                    <div className="calculator-form"><div className="calculator-form-row">
                        <div className="input-group"><label className="input-label">Width (inches)</label><input type="number" className="input-field input-mono" placeholder="e.g., 12" value={w} onChange={e => setW(e.target.value)} min="0" step="0.5" /></div>
                        <div className="input-group"><label className="input-label">Length (inches)</label><input type="number" className="input-field input-mono" placeholder="e.g., 18" value={l} onChange={e => setL(e.target.value)} min="0" step="0.5" /></div>
                    </div></div>
                    {rw > 0 && rl > 0 && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Matching Projects</div><div className="result-value">{matches.length} found</div><div className="result-label">for a {rw}&quot; x {rl}&quot; remnant</div></div>
                        {matches.length > 0 ? (<div className={styles.resultDetails} style={{ marginTop: 16 }}>{matches.map(m => (<div className="result-row" key={m.project}><span className="result-row-label">{m.project}</span><span className="result-row-value">{m.minSize}</span></div>))}</div>)
                            : <p style={{ marginTop: 12, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>This piece is too small for listed projects. Consider patchwork, appliqué, or composting (natural fibers).</p>}
                    </div>)}
                </div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Minimum Size Reference</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Project</th><th>Minimum Piece Size</th></tr></thead>
                        <tbody>{sizeRef.map(s => (<tr key={s.project}><td style={{ fontFamily: "inherit", fontWeight: 500 }}>{s.project}</td><td>{s.minSize}</td></tr>))}</tbody>
                    </table></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}