"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Scissors, Copy, Printer, ChevronDown, Layers, Palette } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Thread Color Converter", href: "/embroidery/thread-color-converter", icon: Palette },
    { name: "Thread Inventory", href: "/embroidery/thread-inventory", icon: Layers },
    { name: "Cross-Stitch Thread", href: "/embroidery/cross-stitch-thread-usage", icon: Scissors },
];
const faqItems = [
    { q: "How many strands of embroidery floss should I use?", a: "1 strand for fine detail, 2 for standard work, 3 for bold lines, 6 for filling. Match strands to fabric weight." },
    { q: "How long should I cut my floss?", a: "18 inches (45 cm) is ideal. Longer pieces tangle and fray. Metallic floss: 12 inches max." },
    { q: "How do I separate strands?", a: "Cut length, hold top, pull ONE strand straight up and out. Never pull multiple strands at once -- they tangle." },
];

export default function HandEmbroideryFlossPage() {
    const [areaW, setAreaW] = useState(""); const [areaH, setAreaH] = useState(""); const [coverage, setCoverage] = useState("50");
    const [strands, setStrands] = useState("2"); const [colors, setColors] = useState("5");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const aw = parseFloat(areaW) || 0; const ah = parseFloat(areaH) || 0; const cov = parseFloat(coverage) || 50;
    const st = parseInt(strands) || 2; const nc = parseInt(colors) || 1;
    const area = aw * ah; const stitchedArea = area * (cov / 100);
    // ~5 yards of 2-strand per sq inch of filled area (rough estimate)
    const ydsPerSqIn = 5 * (st / 2);
    const totalYds = stitchedArea * ydsPerSqIn;
    const perColor = totalYds / nc;
    const skeinYds = 8.7; // DMC skein = 8m = 8.7 yards
    const skeinsPerColor = Math.ceil(perColor / skeinYds);
    const totalSkeins = skeinsPerColor * nc;
    const hasResult = area > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Design area: ${aw}" x ${ah}" (${cov}% coverage). ${st} strands, ${nc} colors. Est: ${totalSkeins} skeins total.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [aw, ah, cov, st, nc, totalSkeins]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Embroidery", href: "/embroidery" }, { label: "Hand Embroidery Floss" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} strokeWidth={1.5} /> Embroidery</span><h1>Hand Embroidery Floss Estimator</h1><p>Estimate DMC floss skeins for hand embroidery based on design area, coverage, and strands.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Design</h2>
                    <div className="calculator-form"><div className="calculator-form-row">
                        <div className="input-group"><label className="input-label">Width (in)</label><input type="number" className="input-field input-mono" placeholder="e.g., 6" value={areaW} onChange={e => setAreaW(e.target.value)} min="0" step="0.5" /></div>
                        <div className="input-group"><label className="input-label">Height (in)</label><input type="number" className="input-field input-mono" placeholder="e.g., 8" value={areaH} onChange={e => setAreaH(e.target.value)} min="0" step="0.5" /></div>
                        <div className="input-group"><label className="input-label">Coverage %</label><input type="range" min="10" max="100" step="10" value={coverage} onChange={e => setCoverage(e.target.value)} style={{ width: "100%" }} /><div style={{ textAlign: "center", fontWeight: 600, fontSize: "var(--text-sm)" }}>{coverage}%</div></div>
                    </div><div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Strands</label><select className="input-field" value={strands} onChange={e => setStrands(e.target.value)}><option value="1">1 strand</option><option value="2">2 strands</option><option value="3">3 strands</option><option value="6">6 strands</option></select></div>
                            <div className="input-group"><label className="input-label">Colors</label><input type="number" className="input-field input-mono" value={colors} onChange={e => setColors(e.target.value)} min="1" /></div>
                        </div></div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Estimated Skeins</div><div className="result-value">{totalSkeins} skeins</div><div className="result-label">{skeinsPerColor}/color x {nc} colors | {totalYds.toFixed(0)} yds total</div></div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}