"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Layers, Copy, Printer, ChevronDown, Scissors, Target } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Hoop Selector", href: "/embroidery/hoop-selector", icon: Target },
    { name: "Stabilizer", href: "/embroidery/stabilizer-selector", icon: Layers },
    { name: "Design Scaler", href: "/embroidery/design-scaler", icon: Scissors },
];
const faqItems = [
    { q: "How much thread does a 10,000 stitch design use?", a: "Roughly 8-12 yards of top thread for standard 40wt polyester. Dense fills use more; outline-only designs use less." },
    { q: "How many bobbins do I need for a design?", a: "Bobbin thread is about 1/3 of top thread. A standard bobbin holds 60-100 yards. For a 15,000-stitch design, 1-2 bobbins." },
    { q: "Why does metallic thread run out faster?", a: "Metallic thread is stiffer and requires looser tension, using more thread per stitch. Add 30% extra when calculating." },
];

const threadFactors: Record<string, number> = { "40wt-poly": 1, "40wt-rayon": 1.05, "60wt": 0.7, "30wt": 1.3, "metallic": 1.35 };
const designFactors: Record<string, number> = { outline: 0.6, satin: 1.1, fill: 1.0, mixed: 0.9, applique: 0.5 };

export default function ThreadCoveragePage() {
    const [stitchCount, setStitchCount] = useState(""); const [designType, setDesignType] = useState("mixed");
    const [threadType, setThreadType] = useState("40wt-poly"); const [spoolSize, setSpoolSize] = useState("500");
    const [colors, setColors] = useState("3"); const [quantity, setQuantity] = useState("1");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const sc = parseInt(stitchCount) || 0; const ss = parseInt(spoolSize) || 500; const nc = parseInt(colors) || 1; const qty = parseInt(quantity) || 1;
    const tf = threadFactors[threadType] || 1; const df = designFactors[designType] || 1;
    // ~1 yard per 1000 stitches baseline for 40wt, adjusted by factors
    const ydsPerDesign = (sc / 1000) * tf * df;
    const bobbinYds = ydsPerDesign * 0.35;
    const totalTop = ydsPerDesign * qty;
    const totalBobbin = bobbinYds * qty;
    const ydsPerColor = nc > 0 ? ydsPerDesign / nc : ydsPerDesign;
    const spoolsPerColor = Math.ceil(ydsPerColor * qty / ss);
    const bobbinsNeeded = Math.ceil(totalBobbin / 80); // 80yd bobbin average
    const wasteBuffer = totalTop * 0.15;
    const hasResult = sc > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Thread: ${(totalTop + wasteBuffer).toFixed(1)} yds top thread (${nc} colors), ${bobbinsNeeded} bobbins for ${qty}x runs of ${sc} stitches.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [totalTop, wasteBuffer, nc, bobbinsNeeded, qty, sc]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Embroidery", href: "/embroidery" }, { label: "Thread Coverage" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Layers size={14} strokeWidth={1.5} /> Embroidery</span><h1>Embroidery Thread Coverage Calculator</h1><p>Estimate thread consumption per design based on stitch count, density, and thread weight.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Design Info</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Stitch Count</label><input type="number" className="input-field input-mono" placeholder="e.g., 15000" value={stitchCount} onChange={e => setStitchCount(e.target.value)} min="0" /></div>
                            <div className="input-group"><label className="input-label">Design Type</label><select className="input-field" value={designType} onChange={e => setDesignType(e.target.value)}><option value="outline">Outline only</option><option value="satin">Satin stitch fill</option><option value="fill">Tatami / fill</option><option value="mixed">Mix of fill + outline</option><option value="applique">Applique</option></select></div>
                            <div className="input-group"><label className="input-label">Thread Type</label><select className="input-field" value={threadType} onChange={e => setThreadType(e.target.value)}><option value="40wt-poly">40wt polyester</option><option value="40wt-rayon">40wt rayon</option><option value="60wt">60wt polyester</option><option value="30wt">30wt</option><option value="metallic">Metallic</option></select></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Colors</label><input type="number" className="input-field input-mono" value={colors} onChange={e => setColors(e.target.value)} min="1" max="30" /></div>
                            <div className="input-group"><label className="input-label">Spool Size (yards)</label><select className="input-field" value={spoolSize} onChange={e => setSpoolSize(e.target.value)}><option value="200">200 yd (small)</option><option value="500">500 yd (standard)</option><option value="1100">1100 yd (large)</option><option value="5500">5500 yd (cone)</option></select></div>
                            <div className="input-group"><label className="input-label">Quantity</label><input type="number" className="input-field input-mono" value={quantity} onChange={e => setQuantity(e.target.value)} min="1" /></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Thread Needed (incl. 15% waste)</div><div className="result-value">{(totalTop + wasteBuffer).toFixed(1)} yards</div><div className="result-label">{ydsPerDesign.toFixed(1)} yds/design x {qty} | {bobbinsNeeded} bobbins | {spoolsPerColor} spool(s)/color</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Top thread per design</span><span className="result-row-value">{ydsPerDesign.toFixed(1)} yds</span></div>
                            <div className="result-row"><span className="result-row-label">Per color average</span><span className="result-row-value">{ydsPerColor.toFixed(1)} yds</span></div>
                            <div className="result-row"><span className="result-row-label">Bobbin thread total</span><span className="result-row-value">{totalBobbin.toFixed(1)} yds</span></div>
                            <div className="result-row"><span className="result-row-label">Waste / buffer</span><span className="result-row-value">{wasteBuffer.toFixed(1)} yds (15%)</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}