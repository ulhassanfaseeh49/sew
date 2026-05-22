"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Droplets, Copy, Printer, ChevronDown, BookOpen, ShoppingCart } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const shrinkData: Record<string, { label: string; len: [number, number]; cross: [number, number]; risk: string; note: string }> = {
    cotton: { label: "100% Cotton", len: [3, 5], cross: [2, 4], risk: "Moderate", note: "Shrinks 3-5% first wash, minimal after. Pre-wash essential." },
    linen: { label: "100% Linen", len: [5, 10], cross: [3, 7], risk: "High", note: "Can shrink up to 10%. May need 2-3 washes to stabilize." },
    wool: { label: "100% Wool", len: [3, 8], cross: [2, 5], risk: "High", note: "Shrinks AND felts if agitated in hot water. Handle carefully." },
    silk: { label: "100% Silk", len: [1, 3], cross: [1, 2], risk: "Low", note: "Minimal shrinkage but may lose luster in machine wash." },
    rayon: { label: "100% Rayon/Viscose", len: [5, 12], cross: [3, 8], risk: "Very High", note: "Among highest shrinkage rates. Dry flat, do not wring." },
    polyester: { label: "100% Polyester", len: [0, 1], cross: [0, 1], risk: "Very Low", note: "Very minimal shrinkage — under 1% typically." },
    nylon: { label: "100% Nylon", len: [0, 1], cross: [0, 1], risk: "Very Low", note: "Negligible shrinkage. Heat-sensitive." },
    cottonPoly: { label: "Cotton/Polyester Blend", len: [1, 3], cross: [1, 2], risk: "Low", note: "Polyester content reduces shrinkage proportionally." },
    cottonLinen: { label: "Cotton/Linen Blend", len: [3, 7], cross: [2, 5], risk: "Moderate-High", note: "Linen component increases shrinkage. Pre-wash essential." },
    tencel: { label: "Tencel/Lyocell", len: [2, 4], cross: [1, 3], risk: "Low-Moderate", note: "Moderate shrinkage. Machine washable, tumble dry low." },
    bamboo: { label: "100% Bamboo", len: [3, 6], cross: [2, 4], risk: "Moderate", note: "Similar to rayon processing. Pre-wash recommended." },
};

function riskColor(r: string) {
    if (r.includes("Very Low")) return { bg: "#dcfce7", color: "#166534" };
    if (r.includes("Low")) return { bg: "#e8f5e9", color: "#1b5e20" };
    if (r.includes("Moderate") && !r.includes("High")) return { bg: "#fef9c3", color: "#854d0e" };
    if (r.includes("High") && !r.includes("Very")) return { bg: "#fed7aa", color: "#9a3412" };
    return { bg: "#fecaca", color: "#991b1b" };
}

const relatedTools = [
    { name: "Buy Extra Calculator", href: "/shrinkage/buy-extra", icon: ShoppingCart },
    { name: "Shrinkage Database", href: "/shrinkage/fabric-database", icon: BookOpen },
    { name: "Pre-Washing Guide", href: "/shrinkage/pre-washing-guide", icon: Droplets },
];
const faqItems = [
    { q: "Does all fabric shrink when washed?", a: "Most natural fibers (cotton, linen, wool, silk) shrink. Synthetics (polyester, nylon) shrink very little. Pre-shrunk/Sanforized fabric has reduced but not zero shrinkage." },
    { q: "How much does cotton fabric shrink?", a: "Typically 3-5% in the first wash. Hot water and high heat drying increase shrinkage. After 2-3 washes, cotton stabilizes with minimal further shrinkage." },
    { q: "Can I prevent fabric from shrinking?", a: "Cold water and air drying minimize shrinkage. But you can't prevent it entirely for natural fibers. Pre-washing before cutting is the safest approach." },
];

export default function PreWashEstimatorPage() {
    const [fiber, setFiber] = useState("cotton"); const [yardage, setYardage] = useState(""); const [width, setWidth] = useState("45");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const d = shrinkData[fiber]; const y = parseFloat(yardage) || 0; const w = parseFloat(width) || 45;
    const lenLossMin = y * 36 * (d.len[0] / 100); const lenLossMax = y * 36 * (d.len[1] / 100);
    const postYardMin = y - (y * d.len[1] / 100); const postYardMax = y - (y * d.len[0] / 100);
    const postWidthMin = w - (w * d.cross[1] / 100); const postWidthMax = w - (w * d.cross[0] / 100);
    const rc = riskColor(d.risk); const hasResult = y > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`${d.label}: ${d.len[0]}-${d.len[1]}% lengthwise, ${d.cross[0]}-${d.cross[1]}% crosswise. Risk: ${d.risk}. Post-wash: ${postYardMin.toFixed(2)}-${postYardMax.toFixed(2)} yd`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [d, postYardMin, postYardMax]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Shrinkage", href: "/shrinkage" }, { label: "Pre-Wash Estimator" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Droplets size={14} strokeWidth={1.5} /> Shrinkage</span><h1>Pre-Wash Shrinkage Estimator</h1><p>Estimate how much fabric will shrink based on fiber content before you cut.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Fabric Details</h2>
                    <div className="calculator-form">
                        <div className="input-group"><label className="input-label">Fiber Content</label><select className="input-field" value={fiber} onChange={e => setFiber(e.target.value)}>{Object.entries(shrinkData).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Yardage</label><input type="number" className="input-field input-mono" placeholder="e.g., 3" value={yardage} onChange={e => setYardage(e.target.value)} min="0" step="0.25" /></div>
                            <div className="input-group"><label className="input-label">Fabric Width (inches)</label><input type="number" className="input-field input-mono" value={width} onChange={e => setWidth(e.target.value)} min="1" /></div>
                        </div>
                    </div>
                    <div className="calculator-divider" />
                    <div className="result-card" style={{ background: rc.bg }}><div className="result-prefix" style={{ color: rc.color }}>Shrinkage Risk: {d.risk}</div><div className="result-value" style={{ color: rc.color }}>{d.len[0]}-{d.len[1]}% lengthwise</div><div className="result-label" style={{ color: rc.color }}>{d.cross[0]}-{d.cross[1]}% crosswise</div></div>
                    <p style={{ margin: "12px 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.7 }}>{d.note}</p>
                    {hasResult && (<div className={styles.resultDetails}>
                        <div className="result-row"><span className="result-row-label">Post-wash yardage</span><span className="result-row-value">{postYardMin.toFixed(2)} - {postYardMax.toFixed(2)} yd</span></div>
                        <div className="result-row"><span className="result-row-label">Post-wash width</span><span className="result-row-value">{postWidthMin.toFixed(1)} - {postWidthMax.toFixed(1)}&quot;</span></div>
                        <div className="result-row"><span className="result-row-label">Length lost</span><span className="result-row-value">{lenLossMin.toFixed(1)} - {lenLossMax.toFixed(1)}&quot;</span></div>
                    </div>)}
                    {hasResult && <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}