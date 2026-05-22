"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Ruler, Copy, Printer, ChevronDown, Grid3X3, Layers } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Fabric Count Calc", href: "/embroidery/cross-stitch-fabric-count", icon: Grid3X3 },
    { name: "Thread Usage", href: "/embroidery/cross-stitch-thread-usage", icon: Layers },
    { name: "Hoop Selector", href: "/embroidery/hoop-selector", icon: Ruler },
];
const faqItems = [
    { q: "How do I calculate cross-stitch fabric size?", a: "Divide stitch count by fabric count to get inches. Add 3-4\" on each side for framing allowance." },
    { q: "How much extra fabric should I buy?", a: "At minimum, add 6\" to both width and height (3\" per side). For framing, add 8\" (4\" per side)." },
    { q: "What if my fabric is too small?", a: "Choose a higher count fabric (more stitches per inch = smaller finished size) or use a smaller design." },
];

export default function CrossStitchFabricSizePage() {
    const [stitchW, setStitchW] = useState(""); const [stitchH, setStitchH] = useState("");
    const [fabricCount, setFabricCount] = useState("14"); const [over, setOver] = useState("1");
    const [marginIn, setMarginIn] = useState("3");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const sw = parseInt(stitchW) || 0; const sh = parseInt(stitchH) || 0;
    const fc = parseInt(fabricCount) || 14; const ov = parseInt(over) || 1; const mg = parseInt(marginIn) || 3;
    const effective = fc / ov;
    const designW = sw / effective; const designH = sh / effective;
    const fabricW = designW + mg * 2; const fabricH = designH + mg * 2;
    const hasResult = sw > 0 && sh > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`${sw}x${sh} stitches on ${fc}-count (over ${ov}): design ${designW.toFixed(1)}" x ${designH.toFixed(1)}", fabric needed ${fabricW.toFixed(1)}" x ${fabricH.toFixed(1)}".`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [sw, sh, fc, ov, designW, designH, fabricW, fabricH]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Embroidery", href: "/embroidery" }, { label: "Cross-Stitch Fabric Size" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Embroidery</span><h1>Cross-Stitch Fabric Size Calculator</h1><p>Calculate the exact fabric dimensions needed for your cross-stitch pattern.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Pattern Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Width (stitches)</label><input type="number" className="input-field input-mono" placeholder="e.g., 150" value={stitchW} onChange={e => setStitchW(e.target.value)} min="0" /></div>
                            <div className="input-group"><label className="input-label">Height (stitches)</label><input type="number" className="input-field input-mono" placeholder="e.g., 200" value={stitchH} onChange={e => setStitchH(e.target.value)} min="0" /></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Fabric Count</label><select className="input-field" value={fabricCount} onChange={e => setFabricCount(e.target.value)}><option value="11">11 count</option><option value="14">14 count</option><option value="16">16 count</option><option value="18">18 count</option><option value="22">22 count</option><option value="28">28 count</option><option value="32">32 count</option><option value="36">36 count</option></select></div>
                            <div className="input-group"><label className="input-label">Stitch Over</label><select className="input-field" value={over} onChange={e => setOver(e.target.value)}><option value="1">Over 1 (Aida)</option><option value="2">Over 2 (evenweave/linen)</option></select></div>
                            <div className="input-group"><label className="input-label">Margin (in per side)</label><select className="input-field" value={marginIn} onChange={e => setMarginIn(e.target.value)}><option value="2">2"</option><option value="3">3" (standard)</option><option value="4">4" (framing)</option></select></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Fabric Needed</div><div className="result-value">{fabricW.toFixed(1)}&quot; x {fabricH.toFixed(1)}&quot;</div><div className="result-label">Design: {designW.toFixed(1)}" x {designH.toFixed(1)}" + {mg}" margin per side</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Effective count</span><span className="result-row-value">{effective} stitches/inch</span></div>
                            <div className="result-row"><span className="result-row-label">Design area</span><span className="result-row-value">{(designW * designH).toFixed(1)} sq in</span></div>
                            <div className="result-row"><span className="result-row-label">Total stitches</span><span className="result-row-value">{(sw * sh).toLocaleString()}</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}