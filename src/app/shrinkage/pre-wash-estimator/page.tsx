"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Droplets, Copy, Printer, ChevronDown, BookOpen, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const fibers: Record<string, { label: string; lenMin: number; lenMax: number; crossMin: number; crossMax: number; note: string }> = {
    cotton: { label: "100% Cotton", lenMin: 3, lenMax: 5, crossMin: 2, crossMax: 4, note: "Typically shrinks 3-5% in first wash, minimal after that." },
    linen: { label: "100% Linen", lenMin: 5, lenMax: 10, crossMin: 3, crossMax: 7, note: "Can shrink up to 10% -- pre-wash essential, may need multiple washes." },
    wool: { label: "100% Wool", lenMin: 3, lenMax: 8, crossMin: 2, crossMax: 6, note: "Shrinks AND felts if agitated in hot water -- handle carefully." },
    silk: { label: "100% Silk", lenMin: 1, lenMax: 3, crossMin: 0.5, crossMax: 2, note: "Minimal shrinkage but may lose luster in machine wash." },
    rayon: { label: "100% Rayon / Viscose", lenMin: 5, lenMax: 12, crossMin: 3, crossMax: 8, note: "One of the highest shrinkage rates -- up to 10% or more." },
    polyester: { label: "100% Polyester", lenMin: 0, lenMax: 1, crossMin: 0, crossMax: 0.5, note: "Very minimal shrinkage -- under 1% typically." },
    nylon: { label: "100% Nylon", lenMin: 0, lenMax: 1, crossMin: 0, crossMax: 0.5, note: "Very low shrinkage." },
    cottonPoly: { label: "Cotton/Polyester Blend", lenMin: 1, lenMax: 3, crossMin: 1, crossMax: 2, note: "Polyester content reduces shrinkage proportionally." },
    cottonSpandex: { label: "Cotton/Spandex Blend", lenMin: 2, lenMax: 5, crossMin: 2, crossMax: 4, note: "Spandex adds stretch recovery but cotton still shrinks." },
    bamboo: { label: "100% Bamboo", lenMin: 3, lenMax: 6, crossMin: 2, crossMax: 4, note: "Similar to rayon; pre-wash recommended." },
    tencel: { label: "100% Tencel / Lyocell", lenMin: 2, lenMax: 4, crossMin: 1, crossMax: 3, note: "Moderate shrinkage; pre-wash recommended for fitted garments." },
};

const washAdj: Record<string, number> = { cold: 0.7, warm: 1, hot: 1.4 };
const dryAdj: Record<string, number> = { tumbleLow: 1, tumbleMed: 1.15, tumbleHigh: 1.3, line: 0.8, flat: 0.7 };

const relatedTools = [
    { name: "Buy Extra Calc", href: "/shrinkage/buy-extra", icon: Ruler },
    { name: "Post-Wash Yardage", href: "/shrinkage/post-wash-yardage", icon: Ruler },
    { name: "Shrinkage % Calc", href: "/shrinkage/percentage-calculator", icon: BookOpen },
];
const faqItems = [
    { q: "Does all fabric shrink when washed?", a: "Most natural fibers (cotton, linen, wool, silk) shrink. Synthetics (polyester, nylon, acrylic) have minimal shrinkage. Blends fall in between." },
    { q: "How much does cotton fabric shrink?", a: "Typically 3-5% in the first wash with warm water. Hot water and high-heat drying can increase this to 5-8%." },
    { q: "Does pre-shrunk fabric still shrink?", a: "Yes, usually 1-3% residual shrinkage. Pre-shrunk (Sanforized) fabric has been treated to reduce but not eliminate shrinkage." },
];

export default function PreWashEstimatorPage() {
    const [fiber, setFiber] = useState("cotton"); const [wash, setWash] = useState("warm"); const [dry, setDry] = useState("tumbleLow");
    const [yardage, setYardage] = useState(""); const [width, setWidth] = useState("44");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const fb = fibers[fiber]; const wm = washAdj[wash]; const dm = dryAdj[dry];
    const lenLow = fb.lenMin * wm * dm; const lenHigh = fb.lenMax * wm * dm;
    const crossLow = fb.crossMin * wm * dm; const crossHigh = fb.crossMax * wm * dm;
    const avgLow = (lenLow + crossLow) / 2; const avgHigh = (lenHigh + crossHigh) / 2;

    const yd = parseFloat(yardage) || 0; const wd = parseFloat(width) || 44;
    const postYdLow = yd * (1 - lenHigh / 100); const postYdHigh = yd * (1 - lenLow / 100);
    const postWdLow = wd * (1 - crossHigh / 100); const postWdHigh = wd * (1 - crossLow / 100);

    const riskLevel = avgHigh < 3 ? "Low" : avgHigh < 7 ? "Moderate" : avgHigh < 10 ? "High" : "Very High";
    const riskColor = avgHigh < 3 ? "var(--color-success)" : avgHigh < 7 ? "#e6a817" : "var(--color-error)";

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`${fb.label}: ${lenLow.toFixed(1)}-${lenHigh.toFixed(1)}% lengthwise, ${crossLow.toFixed(1)}-${crossHigh.toFixed(1)}% crosswise. Risk: ${riskLevel}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [fb, lenLow, lenHigh, crossLow, crossHigh, riskLevel]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Shrinkage", href: "/shrinkage" }, { label: "Pre-Wash Estimator" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Droplets size={14} strokeWidth={1.5} /> Shrinkage</span><h1>Pre-Wash Shrinkage Estimator</h1><p>Estimate how much your fabric will shrink based on fiber, wash method, and drying.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Fabric and Wash Details</h2>
                    <div className="calculator-form">
                        <div className="input-group"><label className="input-label">Fiber Content</label><select className="input-field" value={fiber} onChange={e => setFiber(e.target.value)}>{Object.entries(fibers).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Wash Temperature</label><select className="input-field" value={wash} onChange={e => setWash(e.target.value)}><option value="cold">Cold</option><option value="warm">Warm</option><option value="hot">Hot</option></select></div>
                            <div className="input-group"><label className="input-label">Drying Method</label><select className="input-field" value={dry} onChange={e => setDry(e.target.value)}><option value="tumbleLow">Tumble dry - low</option><option value="tumbleMed">Tumble dry - medium</option><option value="tumbleHigh">Tumble dry - high</option><option value="line">Line dry</option><option value="flat">Flat dry</option></select></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Yardage (optional)</label><input type="number" className="input-field input-mono" placeholder="e.g., 3" value={yardage} onChange={e => setYardage(e.target.value)} min="0" step="0.25" /></div>
                            <div className="input-group"><label className="input-label">Width (inches)</label><input type="number" className="input-field input-mono" value={width} onChange={e => setWidth(e.target.value)} min="1" /></div>
                        </div>
                    </div>
                    <div className="calculator-divider" />
                    <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}><span style={{ display: "inline-block", width: 12, height: 12, borderRadius: "50%", backgroundColor: riskColor }} /><span style={{ fontWeight: 600 }}>Shrinkage Risk: {riskLevel}</span></div>
                    <div className={styles.resultDetails}>
                        <div className="result-row"><span className="result-row-label">Lengthwise (warp)</span><span className="result-row-value">{lenLow.toFixed(1)}% - {lenHigh.toFixed(1)}%</span></div>
                        <div className="result-row"><span className="result-row-label">Crosswise (weft)</span><span className="result-row-value">{crossLow.toFixed(1)}% - {crossHigh.toFixed(1)}%</span></div>
                        <div className="result-row"><span className="result-row-label">Overall average</span><span className="result-row-value">{avgLow.toFixed(1)}% - {avgHigh.toFixed(1)}%</span></div>
                    </div>
                    {yd > 0 && (<div style={{ marginTop: 16 }}><h4 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 8 }}>Post-Wash Dimensions</h4>
                        <div className={styles.resultDetails}>
                            <div className="result-row"><span className="result-row-label">Yardage after wash</span><span className="result-row-value">{postYdLow.toFixed(2)} - {postYdHigh.toFixed(2)} yd</span></div>
                            <div className="result-row"><span className="result-row-label">Width after wash</span><span className="result-row-value">{postWdLow.toFixed(1)}&quot; - {postWdHigh.toFixed(1)}&quot;</span></div>
                        </div>
                    </div>)}
                    <p style={{ margin: "12px 0 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", fontStyle: "italic" }}>{fb.note}</p>
                    <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}