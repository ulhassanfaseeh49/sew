"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Grid3X3, Copy, Printer, ChevronDown, Layers, Maximize } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Cross-Stitch Size", href: "/embroidery/cross-stitch-fabric-size", icon: Maximize },
    { name: "Cross-Stitch Thread", href: "/embroidery/cross-stitch-thread-usage", icon: Layers },
    { name: "Thread Coverage", href: "/embroidery/thread-coverage", icon: Layers },
];
const faqItems = [
    { q: "What count Aida should I use?", a: "14-count is most popular. 11-count for beginners. 18-count for fine detail. 28-count evenweave over 2 threads equals 14-count Aida." },
    { q: "What does 'over 2' mean?", a: "On evenweave/linen, each cross-stitch spans 2 fabric threads. 28-count over 2 = 14 stitches per inch, same as 14ct Aida." },
    { q: "How much extra fabric do I need?", a: "Add 3-4 inches on each side for framing. A design finishing at 8x10 needs at least 14x16 inches of fabric." },
];

const counts = [11, 14, 16, 18, 22, 25, 28, 32, 36];

export default function CrossStitchFabricCountPage() {
    const [stitchW, setStitchW] = useState(""); const [stitchH, setStitchH] = useState(""); const [extraInches, setExtraInches] = useState("3");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const sw = parseInt(stitchW) || 0; const sh = parseInt(stitchH) || 0; const ex = parseInt(extraInches) || 3;
    const hasResult = sw > 0 && sh > 0;

    const results = counts.map(ct => {
        const over2 = ct >= 25; const effective = over2 ? ct / 2 : ct;
        const w = sw / effective; const h = sh / effective;
        return { count: ct, over2, effective, w, h, fabricW: w + ex * 2, fabricH: h + ex * 2, label: over2 ? `${ct}ct over 2` : `${ct}ct Aida` };
    });

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Design: ${sw} x ${sh} stitches.\n${results.map(r => `${r.label}: ${r.w.toFixed(1)}" x ${r.h.toFixed(1)}" (fabric: ${r.fabricW.toFixed(1)}" x ${r.fabricH.toFixed(1)}")`).join("\n")}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [sw, sh, results]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Embroidery", href: "/embroidery" }, { label: "Cross-Stitch Fabric Count" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Grid3X3 size={14} strokeWidth={1.5} /> Embroidery</span><h1>Cross-Stitch Fabric Count Calculator</h1><p>See your finished design size across all common fabric counts at a glance.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Pattern Size</h2>
                    <div className="calculator-form"><div className="calculator-form-row">
                        <div className="input-group"><label className="input-label">Width (stitches)</label><input type="number" className="input-field input-mono" placeholder="e.g., 200" value={stitchW} onChange={e => setStitchW(e.target.value)} min="0" /></div>
                        <div className="input-group"><label className="input-label">Height (stitches)</label><input type="number" className="input-field input-mono" placeholder="e.g., 300" value={stitchH} onChange={e => setStitchH(e.target.value)} min="0" /></div>
                        <div className="input-group"><label className="input-label">Extra per Side (in)</label><select className="input-field" value={extraInches} onChange={e => setExtraInches(e.target.value)}><option value="2">2"</option><option value="3">3" (standard)</option><option value="4">4" (framing)</option></select></div>
                    </div></div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Fabric</th><th>Design Size</th><th>Fabric Needed</th></tr></thead>
                            <tbody>{results.map(r => (<tr key={r.count}><td style={{ fontWeight: 600 }}>{r.label}</td><td>{r.w.toFixed(1)}&quot; x {r.h.toFixed(1)}&quot;</td><td>{r.fabricW.toFixed(1)}&quot; x {r.fabricH.toFixed(1)}&quot;</td></tr>))}</tbody>
                        </table></div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}