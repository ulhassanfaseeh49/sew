"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Grid3X3, Copy, Printer, ChevronDown, Scissors, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Strip Cutting", href: "/cutting/strip-calculator", icon: Scissors },
    { name: "Rectangle Cutting", href: "/cutting/rectangle-calculator", icon: Ruler },
    { name: "Sub-Cut Calc", href: "/cutting/sub-cut-calculator", icon: Scissors },
];
const faqItems = [
    { q: "How do I cut squares efficiently from fabric?", a: "Cut strips first at the square width (WOF), then sub-cut squares from each strip. This is faster and more accurate than cutting individual squares." },
    { q: "How many 5-inch charm squares can I get from a yard?", a: "With 42\" usable width: 8 squares per strip. From 1 yard (36\"): 7 strips. Total: 56 charm squares per yard." },
    { q: "Should I cut finished or cut size?", a: "Always enter the CUT size (finished plus seam allowances). For quilting, add 1/2\" to finished size. For garments, add 1-1/4\" (5/8\" per side)." },
];

export default function SquareCalcPage() {
    const [squareSize, setSquareSize] = useState("5"); const [fabWidth, setFabWidth] = useState("44"); const [fabLength, setFabLength] = useState("36"); const [selvage, setSelvage] = useState("0.5");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const sq = parseFloat(squareSize) || 0; const fw = parseFloat(fabWidth) || 44; const fl = parseFloat(fabLength) || 36; const sv = parseFloat(selvage) || 0.5;
    const usableWidth = fw - sv * 2;
    const squaresPerStrip = sq > 0 ? Math.floor(usableWidth / sq) : 0;
    const numStrips = sq > 0 ? Math.floor(fl / sq) : 0;
    const totalSquares = squaresPerStrip * numStrips;
    const hasResult = sq > 0 && totalSquares > 0;
    const efficiency = hasResult ? ((totalSquares * sq * sq) / (fw * fl) * 100) : 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`${totalSquares} squares of ${sq}" from ${fw}"x${fl}" fabric. ${squaresPerStrip} per strip across ${numStrips} strips.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [totalSquares, sq, fw, fl, squaresPerStrip, numStrips]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Cutting Tools", href: "/cutting" }, { label: "Square Calculator" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Grid3X3 size={14} strokeWidth={1.5} /> Cutting</span><h1>Square Cutting Calculator</h1><p>Calculate how many squares can be cut from your fabric using the strip method.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Fabric and Square Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Fabric Width (in)</label><input type="number" className="input-field input-mono" value={fabWidth} onChange={e => setFabWidth(e.target.value)} min="1" /></div>
                            <div className="input-group"><label className="input-label">Fabric Length (in)</label><input type="number" className="input-field input-mono" value={fabLength} onChange={e => setFabLength(e.target.value)} min="1" /></div>
                            <div className="input-group"><label className="input-label">Selvage/Side (in)</label><input type="number" className="input-field input-mono" value={selvage} onChange={e => setSelvage(e.target.value)} min="0" step="0.25" /></div>
                        </div>
                        <div className="input-group"><label className="input-label">Square Size (cut, in)</label><select className="input-field" value={squareSize} onChange={e => setSquareSize(e.target.value)}><option value="2.5">2.5&quot; (mini charm)</option><option value="5">5&quot; (charm)</option><option value="10">10&quot; (layer cake)</option><option value="3.5">3.5&quot;</option><option value="4.5">4.5&quot;</option><option value="6.5">6.5&quot;</option></select></div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Total Squares</div><div className="result-value">{totalSquares} squares</div><div className="result-label">{sq}&quot; x {sq}&quot; each</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Strips to cut</span><span className="result-row-value">{numStrips} strips of {sq}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Squares per strip</span><span className="result-row-value">{squaresPerStrip}</span></div>
                            <div className="result-row"><span className="result-row-label">Efficiency</span><span className="result-row-value">{efficiency.toFixed(0)}%</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}