"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Grid3X3, Copy, Printer, ChevronDown, Layers, Palette } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Cross-Stitch Fabric Count", href: "/embroidery/cross-stitch-fabric-count", icon: Grid3X3 },
    { name: "Thread Color Converter", href: "/embroidery/thread-color-converter", icon: Palette },
    { name: "Hand Embroidery Floss", href: "/embroidery/hand-embroidery-floss", icon: Layers },
];
const faqItems = [
    { q: "What is needlepoint canvas mesh count?", a: "Mesh (or gauge) is the number of holes per inch. 14-mesh = 14 holes per inch. Higher mesh = finer work." },
    { q: "What yarn/thread for needlepoint?", a: "Persian wool for most canvas. Tapestry wool for larger mesh. Perle cotton, silk, or specialty threads for finer mesh." },
    { q: "How much yarn does needlepoint use?", a: "50-100 sq inches of coverage per 8-yard skein with 3-ply Persian wool on 14-mesh. Dense stitches use more." },
];

export default function NeedlepointCanvasPage() {
    const [canvasW, setCanvasW] = useState(""); const [canvasH, setCanvasH] = useState("");
    const [mesh, setMesh] = useState("14"); const [coverage, setCoverage] = useState("100"); const [colors, setColors] = useState("6");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const cw = parseFloat(canvasW) || 0; const ch = parseFloat(canvasH) || 0; const mc = parseInt(mesh) || 14;
    const cov = parseFloat(coverage) || 100; const nc = parseInt(colors) || 1;
    const area = cw * ch * (cov / 100);
    // Approx 1 yard per 6 sq inches on 14-mesh with 3-ply
    const ydsPerSqIn = (mc / 14) * (1 / 6);
    const totalYds = area * ydsPerSqIn;
    const perColor = totalYds / nc;
    const skeinYds = 8; const skeinsPerColor = Math.ceil(perColor / skeinYds);
    const totalSkeins = skeinsPerColor * nc;
    const totalStitches = cw * mc * ch * mc * (cov / 100);
    const hasResult = area > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Needlepoint: ${cw}" x ${ch}" on ${mc}-mesh (${cov}% coverage). ~${totalStitches.toFixed(0)} stitches. ${totalSkeins} skeins.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [cw, ch, mc, cov, totalStitches, totalSkeins]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Embroidery", href: "/embroidery" }, { label: "Needlepoint Canvas" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Grid3X3 size={14} strokeWidth={1.5} /> Embroidery</span><h1>Needlepoint Canvas Calculator</h1><p>Calculate yarn and stitch count for needlepoint projects based on canvas size and mesh count.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Canvas Details</h2>
                    <div className="calculator-form"><div className="calculator-form-row">
                        <div className="input-group"><label className="input-label">Width (in)</label><input type="number" className="input-field input-mono" placeholder="e.g., 12" value={canvasW} onChange={e => setCanvasW(e.target.value)} min="0" step="0.5" /></div>
                        <div className="input-group"><label className="input-label">Height (in)</label><input type="number" className="input-field input-mono" placeholder="e.g., 12" value={canvasH} onChange={e => setCanvasH(e.target.value)} min="0" step="0.5" /></div>
                        <div className="input-group"><label className="input-label">Mesh Count</label><select className="input-field" value={mesh} onChange={e => setMesh(e.target.value)}><option value="7">7 mesh</option><option value="10">10 mesh</option><option value="12">12 mesh</option><option value="14">14 mesh</option><option value="18">18 mesh</option><option value="24">24 mesh</option></select></div>
                    </div><div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Coverage %</label><select className="input-field" value={coverage} onChange={e => setCoverage(e.target.value)}><option value="100">100% (full coverage)</option><option value="75">75%</option><option value="50">50%</option></select></div>
                            <div className="input-group"><label className="input-label">Colors</label><input type="number" className="input-field input-mono" value={colors} onChange={e => setColors(e.target.value)} min="1" max="50" /></div>
                        </div></div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Yarn Needed</div><div className="result-value">{totalSkeins} skeins</div><div className="result-label">{skeinsPerColor}/color | {totalYds.toFixed(0)} yds total | ~{totalStitches.toLocaleString()} stitches</div></div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}