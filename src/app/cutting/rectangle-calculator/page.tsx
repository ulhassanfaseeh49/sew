"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { RectangleHorizontal, Copy, Printer, ChevronDown, Scissors, Grid3X3 } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Square Cutting", href: "/cutting/square-calculator", icon: Grid3X3 },
    { name: "Strip Cutting", href: "/cutting/strip-calculator", icon: Scissors },
    { name: "Triangle Cutting", href: "/cutting/triangle-calculator", icon: Scissors },
];
const faqItems = [
    { q: "Does rectangle orientation matter when cutting?", a: "Yes. Rectangles can be cut in two orientations. One may yield significantly more pieces. This tool compares both and shows the better option." },
    { q: "Should a rectangle's long side follow the grain?", a: "Typically yes. The long dimension is usually placed along the lengthwise grain for stability. However, maximizing yield sometimes means rotating." },
    { q: "How do I cut rectangles efficiently?", a: "Cut strips at one of the rectangle dimensions, then sub-cut to the other dimension. Always cut widest strips first." },
];

export default function RectangleCalcPage() {
    const [rectW, setRectW] = useState("2.5"); const [rectH, setRectH] = useState("4.5");
    const [fabWidth, setFabWidth] = useState("44"); const [fabLength, setFabLength] = useState("36"); const [selvage, setSelvage] = useState("0.5");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const rw = parseFloat(rectW) || 0; const rh = parseFloat(rectH) || 0;
    const fw = parseFloat(fabWidth) || 44; const fl = parseFloat(fabLength) || 36;
    const sv = parseFloat(selvage) || 0.5; const uw = fw - sv * 2;

    // Orientation A: strip width = rh, sub-cut = rw across usable width
    const aStrips = rh > 0 ? Math.floor(fl / rh) : 0;
    const aPerStrip = rw > 0 ? Math.floor(uw / rw) : 0;
    const aTotal = aStrips * aPerStrip;

    // Orientation B: strip width = rw, sub-cut = rh across usable width
    const bStrips = rw > 0 ? Math.floor(fl / rw) : 0;
    const bPerStrip = rh > 0 ? Math.floor(uw / rh) : 0;
    const bTotal = bStrips * bPerStrip;

    const bestLabel = aTotal >= bTotal ? "A" : "B";
    const bestTotal = Math.max(aTotal, bTotal);
    const hasResult = rw > 0 && rh > 0 && bestTotal > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Best: Orientation ${bestLabel} = ${bestTotal} rectangles (${rw}"x${rh}"). A=${aTotal}, B=${bTotal}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [bestLabel, bestTotal, rw, rh, aTotal, bTotal]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Cutting Tools", href: "/cutting" }, { label: "Rectangle Calculator" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><RectangleHorizontal size={14} strokeWidth={1.5} /> Cutting</span><h1>Rectangle Cutting Calculator</h1><p>Calculate how many rectangles can be cut, comparing both orientations for best yield.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Fabric and Rectangle Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Fabric Width (in)</label><input type="number" className="input-field input-mono" value={fabWidth} onChange={e => setFabWidth(e.target.value)} min="1" /></div>
                            <div className="input-group"><label className="input-label">Fabric Length (in)</label><input type="number" className="input-field input-mono" value={fabLength} onChange={e => setFabLength(e.target.value)} min="1" /></div>
                            <div className="input-group"><label className="input-label">Selvage/Side (in)</label><input type="number" className="input-field input-mono" value={selvage} onChange={e => setSelvage(e.target.value)} min="0" step="0.25" /></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Rectangle Width (in)</label><input type="number" className="input-field input-mono" value={rectW} onChange={e => setRectW(e.target.value)} min="0.5" step="0.25" /></div>
                            <div className="input-group"><label className="input-label">Rectangle Height (in)</label><input type="number" className="input-field input-mono" value={rectH} onChange={e => setRectH(e.target.value)} min="0.5" step="0.25" /></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Best Yield: Orientation {bestLabel}</div><div className="result-value">{bestTotal} rectangles</div><div className="result-label">{rw}&quot; x {rh}&quot; each</div></div>
                        <div className={styles.tableWrap} style={{ marginTop: 12 }}><table className={styles.convTable}><thead><tr><th></th><th>Orientation A</th><th>Orientation B</th></tr></thead>
                            <tbody>
                                <tr><td style={{ fontWeight: 600 }}>Strip width</td><td>{rh}&quot;</td><td>{rw}&quot;</td></tr>
                                <tr><td style={{ fontWeight: 600 }}>Strips from length</td><td>{aStrips}</td><td>{bStrips}</td></tr>
                                <tr><td style={{ fontWeight: 600 }}>Rects per strip</td><td>{aPerStrip}</td><td>{bPerStrip}</td></tr>
                                <tr><td style={{ fontWeight: 600 }}>Total</td><td style={{ fontWeight: aTotal >= bTotal ? 700 : 400 }}>{aTotal}{aTotal >= bTotal ? " (best)" : ""}</td><td style={{ fontWeight: bTotal > aTotal ? 700 : 400 }}>{bTotal}{bTotal > aTotal ? " (best)" : ""}</td></tr>
                            </tbody>
                        </table></div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}