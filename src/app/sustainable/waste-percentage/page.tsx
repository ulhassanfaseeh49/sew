"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Leaf, Copy, Printer, ChevronDown, Recycle, Scissors } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

function getColor(pct: number) {
    if (pct < 15) return { bg: "#dcfce7", color: "#166534", label: "Excellent — minimal waste" };
    if (pct < 25) return { bg: "#fef9c3", color: "#854d0e", label: "Good — typical for most projects" };
    if (pct < 35) return { bg: "#fed7aa", color: "#9a3412", label: "Average — room for improvement" };
    if (pct < 50) return { bg: "#fecaca", color: "#991b1b", label: "High — significant waste" };
    return { bg: "#e5e7eb", color: "#374151", label: "Very high — consider layout changes" };
}

const relatedTools = [
    { name: "Zero-Waste Cutting", href: "/sustainable/zero-waste-cutting", icon: Scissors },
    { name: "Remnant Usage", href: "/sustainable/remnant-usage", icon: Recycle },
    { name: "Scrap Sorting Guide", href: "/sustainable/scrap-sorting", icon: Leaf },
];
const faqItems = [
    { q: "How much fabric waste is normal?", a: "15-25% is typical for most garment sewing. Under 15% is excellent. Fast fashion industry averages 30-40%. Circle skirts can waste 50%+." },
    { q: "What can I do with fabric scraps?", a: "Large scraps: small accessories. Medium: quilt blocks, bias tape. Small: appliqué, pincushion stuffing. Natural fibers can be composted." },
    { q: "Is home sewing more sustainable than buying?", a: "Generally yes — you choose fabric quality, create less packaging waste, and garments last longer. Even with some fabric waste, home sewing beats fast fashion." },
];

export default function WastePercentagePage() {
    const [yardage, setYardage] = useState(""); const [width, setWidth] = useState("45");
    const [usedArea, setUsedArea] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const y = parseFloat(yardage) || 0; const w = parseFloat(width) || 45;
    const totalArea = y * 36 * w;
    const used = parseFloat(usedArea) || 0;
    const waste = totalArea - used; const wastePct = totalArea > 0 ? (waste / totalArea) * 100 : 0;
    const hasResult = y > 0 && used > 0;
    const rating = getColor(wastePct);

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Fabric waste: ${wastePct.toFixed(1)}% (${waste.toFixed(0)} sq in wasted of ${totalArea.toFixed(0)} sq in total)`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [wastePct, waste, totalArea]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Sustainable", href: "/sustainable" }, { label: "Waste %" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Leaf size={14} strokeWidth={1.5} /> Sustainable</span><h1>Fabric Waste Percentage Calculator</h1><p>Calculate how much fabric is wasted per project and compare against industry benchmarks.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Enter Fabric Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Total Yardage</label><input type="number" className="input-field input-mono" placeholder="e.g., 3" value={yardage} onChange={e => setYardage(e.target.value)} min="0" step="0.25" /></div>
                            <div className="input-group"><label className="input-label">Fabric Width (inches)</label><input type="number" className="input-field input-mono" value={width} onChange={e => setWidth(e.target.value)} min="1" /></div>
                        </div>
                        <div className="input-group"><label className="input-label">Total Area Used in Pieces (sq in)</label><input type="number" className="input-field input-mono" placeholder="Sum of all pattern piece areas" value={usedArea} onChange={e => setUsedArea(e.target.value)} min="0" />
                            <span className="input-helper">Total fabric area: {totalArea.toLocaleString()} sq in</span>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card" style={{ background: rating.bg }}><div className="result-prefix" style={{ color: rating.color }}>Waste Percentage</div><div className="result-value" style={{ color: rating.color }}>{wastePct.toFixed(1)}%</div><div className="result-label" style={{ color: rating.color }}>{rating.label}</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 16 }}>
                            <div className="result-row"><span className="result-row-label">Total fabric</span><span className="result-row-value">{totalArea.toLocaleString()} sq in</span></div>
                            <div className="result-row"><span className="result-row-label">Used in pieces</span><span className="result-row-value">{used.toLocaleString()} sq in</span></div>
                            <div className="result-row"><span className="result-row-label">Waste</span><span className="result-row-value">{waste.toLocaleString()} sq in</span></div>
                            <div className="result-row"><span className="result-row-label">vs Industry avg (15-20%)</span><span className="result-row-value">{wastePct < 20 ? "Better" : wastePct < 30 ? "Similar" : "Higher"}</span></div>
                            <div className="result-row"><span className="result-row-label">vs Fast fashion (30-40%)</span><span className="result-row-value">{wastePct < 30 ? "Better" : "Similar or higher"}</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}