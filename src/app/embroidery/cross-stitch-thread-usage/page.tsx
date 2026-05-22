"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Scissors, Copy, Printer, ChevronDown, Grid3X3, Layers } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Fabric Count", href: "/embroidery/cross-stitch-fabric-count", icon: Grid3X3 },
    { name: "Fabric Size", href: "/embroidery/cross-stitch-fabric-size", icon: Grid3X3 },
    { name: "Thread Color Converter", href: "/embroidery/thread-color-converter", icon: Layers },
];
const faqItems = [
    { q: "How much floss does a cross-stitch use?", a: "One DMC skein (8m/8.7yd) covers roughly 400-500 full cross-stitches on 14-count Aida with 2 strands." },
    { q: "How many strands should I use?", a: "14ct: 2 strands for cross-stitch, 1 for backstitch. 18ct: 1-2 strands. 11ct: 3 strands for good coverage." },
    { q: "Should I buy extra skeins?", a: "Always buy 1 extra skein of each color. Dye lots vary, and running out mid-project risks a visible color difference." },
];

export default function CrossStitchThreadUsagePage() {
    const [totalStitches, setTotalStitches] = useState(""); const [numColors, setNumColors] = useState("8");
    const [fabricCount, setFabricCount] = useState("14"); const [strands, setStrands] = useState("2");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const ts = parseInt(totalStitches) || 0; const nc = parseInt(numColors) || 1;
    const fc = parseInt(fabricCount) || 14; const st = parseInt(strands) || 2;
    // Stitch length varies by count: ~2.5" per stitch on 14ct with 2 strands. Adjusted for count and strands.
    const inchesPerStitch = (2.5 * (14 / fc) * (st / 2));
    const totalInches = ts * inchesPerStitch;
    const totalYards = totalInches / 36;
    const perColor = totalYards / nc;
    const skeinYards = 8.7; // 1 DMC skein = 8m = 8.7 yards
    const skeinsPerColor = Math.ceil(perColor / skeinYards);
    const totalSkeins = skeinsPerColor * nc;
    const hasResult = ts > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`${ts} stitches, ${nc} colors on ${fc}ct (${st} strands): ~${totalYards.toFixed(0)} yds total, ${skeinsPerColor} skeins/color, ${totalSkeins} skeins total.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [ts, nc, fc, st, totalYards, skeinsPerColor, totalSkeins]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Embroidery", href: "/embroidery" }, { label: "Cross-Stitch Thread Usage" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} strokeWidth={1.5} /> Embroidery</span><h1>Cross-Stitch Thread Usage Estimator</h1><p>Estimate DMC floss skeins needed based on stitch count, fabric, and strand count.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Pattern Info</h2>
                    <div className="calculator-form"><div className="calculator-form-row">
                        <div className="input-group"><label className="input-label">Total Stitches</label><input type="number" className="input-field input-mono" placeholder="e.g., 15000" value={totalStitches} onChange={e => setTotalStitches(e.target.value)} min="0" /></div>
                        <div className="input-group"><label className="input-label">Number of Colors</label><input type="number" className="input-field input-mono" value={numColors} onChange={e => setNumColors(e.target.value)} min="1" max="100" /></div>
                        <div className="input-group"><label className="input-label">Fabric Count</label><select className="input-field" value={fabricCount} onChange={e => setFabricCount(e.target.value)}><option value="11">11 ct</option><option value="14">14 ct</option><option value="16">16 ct</option><option value="18">18 ct</option></select></div>
                        <div className="input-group"><label className="input-label">Strands</label><select className="input-field" value={strands} onChange={e => setStrands(e.target.value)}><option value="1">1 strand</option><option value="2">2 strands</option><option value="3">3 strands</option></select></div>
                    </div></div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Total Skeins Needed</div><div className="result-value">{totalSkeins} skeins</div><div className="result-label">{perColor.toFixed(1)} yds/color x {nc} colors = {totalYards.toFixed(0)} yds total</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Per color (avg)</span><span className="result-row-value">{perColor.toFixed(1)} yds ({skeinsPerColor} skeins)</span></div>
                            <div className="result-row"><span className="result-row-label">DMC skein size</span><span className="result-row-value">8m / 8.7 yds</span></div>
                            <div className="result-row"><span className="result-row-label">Thread per stitch</span><span className="result-row-value">{inchesPerStitch.toFixed(1)}&quot;</span></div>
                        </div>
                        <p style={{ margin: "12px 0", padding: 12, fontSize: "var(--text-sm)", background: "var(--color-surface-hover)", borderRadius: 8, color: "var(--color-text-secondary)" }}>Estimates assume even color distribution. Buy 1 extra skein per color to be safe.</p>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}