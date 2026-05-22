"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Scissors, Copy, Printer, ChevronDown, Grid3X3, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Strip Cutting", href: "/cutting/strip-calculator", icon: Scissors },
    { name: "Square Cutting", href: "/cutting/square-calculator", icon: Grid3X3 },
    { name: "Waste Minimizer", href: "/cutting/waste-minimizer", icon: Ruler },
];
const faqItems = [
    { q: "What is sub-cutting?", a: "Sub-cutting is the second step: after cutting strips from fabric, you cross-cut those strips into smaller pieces (squares, rectangles, or triangles)." },
    { q: "Can I stack strips for faster sub-cutting?", a: "Yes. Align up to 4-6 strips carefully, then cut through all layers at once with a rotary cutter for identical sub-cuts." },
    { q: "What do I do with leftover strip ends?", a: "Save them organized by size. Small ends can become cornerstones, binding connectors, or scrappy quilt elements." },
];

export default function SubCutCalcPage() {
    const [stripWidth, setStripWidth] = useState("2.5"); const [stripLength, setStripLength] = useState("43"); const [numStrips, setNumStrips] = useState("10");
    const [subType, setSubType] = useState("square"); const [subSize, setSubSize] = useState("2.5");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const sw = parseFloat(stripWidth) || 0; const sl = parseFloat(stripLength) || 43; const ns = parseInt(numStrips) || 1;
    const ss = parseFloat(subSize) || 0;
    const cutWidth = subType === "square" ? ss : ss; // for rects the user enters height
    const piecesPerStrip = cutWidth > 0 ? Math.floor(sl / cutWidth) : 0;
    const remainder = sl - piecesPerStrip * cutWidth;
    const totalPieces = piecesPerStrip * ns;
    const hasResult = sw > 0 && ss > 0 && totalPieces > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`${totalPieces} pieces (${ss}" ${subType}s). ${piecesPerStrip} per strip x ${ns} strips.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [totalPieces, ss, subType, piecesPerStrip, ns]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Cutting Tools", href: "/cutting" }, { label: "Sub-Cut Calculator" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} strokeWidth={1.5} /> Cutting</span><h1>Sub-Cut Calculator</h1><p>Calculate how many smaller pieces can be sub-cut from already-cut strips.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Strip and Sub-Cut Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Strip Width (in)</label><input type="number" className="input-field input-mono" value={stripWidth} onChange={e => setStripWidth(e.target.value)} min="0.5" step="0.25" /></div>
                            <div className="input-group"><label className="input-label">Strip Length (in)</label><input type="number" className="input-field input-mono" value={stripLength} onChange={e => setStripLength(e.target.value)} min="1" /></div>
                            <div className="input-group"><label className="input-label">Number of Strips</label><input type="number" className="input-field input-mono" value={numStrips} onChange={e => setNumStrips(e.target.value)} min="1" /></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Sub-Cut Type</label><select className="input-field" value={subType} onChange={e => setSubType(e.target.value)}><option value="square">Squares</option><option value="rectangle">Rectangles</option></select></div>
                            <div className="input-group"><label className="input-label">Sub-Cut Size (in)</label><input type="number" className="input-field input-mono" value={subSize} onChange={e => setSubSize(e.target.value)} min="0.5" step="0.25" /></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Total Pieces</div><div className="result-value">{totalPieces} {subType === "square" ? "squares" : "rectangles"}</div><div className="result-label">{subType === "square" ? `${ss}" x ${ss}"` : `${sw}" x ${ss}"`} each</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Pieces per strip</span><span className="result-row-value">{piecesPerStrip}</span></div>
                            <div className="result-row"><span className="result-row-label">Leftover per strip</span><span className="result-row-value">{remainder.toFixed(2)}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Total strips used</span><span className="result-row-value">{ns}</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}