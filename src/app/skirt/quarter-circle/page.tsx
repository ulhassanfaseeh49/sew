"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Circle, Copy, Printer, ChevronDown, Scissors, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Full Circle", href: "/skirt/full-circle", icon: Circle },
    { name: "Half Circle", href: "/skirt/half-circle", icon: Circle },
    { name: "Waist Radius", href: "/skirt/waist-radius", icon: Ruler },
];
const faqItems = [
    { q: "How is a quarter circle skirt constructed?", a: "Typically 4 quarter-circle pieces are joined to make the full skirt. Each piece uses the same waist radius as a full circle but only covers 90 degrees." },
    { q: "How full is a quarter circle skirt?", a: "It has a gentle A-line flare -- much less full than a half or full circle. It is the most fabric-efficient circle skirt option." },
    { q: "Can I hem a quarter circle with a standard hem?", a: "Yes. The curve is gentle enough for a standard double-fold hem. No rolled hem needed." },
];

export default function QuarterCirclePage() {
    const [waist, setWaist] = useState("28"); const [length, setLength] = useState("24"); const [fabWidth, setFabWidth] = useState("60");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const w = parseFloat(waist) || 28; const l = parseFloat(length) || 24; const fw = parseFloat(fabWidth) || 60;
    const radius = w / (Math.PI / 2); // waist / (pi/2) for quarter circle times 4 pieces
    const perPieceRadius = w / (2 * Math.PI); // same as full circle radius
    const outerRadius = perPieceRadius + l;
    const hemCirc = (Math.PI / 2) * outerRadius * 4; // 4 pieces
    const pieceW = outerRadius + 1; const pieceH = outerRadius + 1;
    const piecesAcross = Math.floor(fw / pieceW) || 1;
    const rows = Math.ceil(4 / piecesAcross);
    const yardage = (rows * pieceH) / 36;
    const hasResult = w > 0 && l > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Quarter circle: radius ${perPieceRadius.toFixed(1)}", 4 pieces, ~${yardage.toFixed(1)} yd on ${fw}" fabric.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [perPieceRadius, yardage, fw]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Skirt Calculators", href: "/skirt" }, { label: "Quarter Circle" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Circle size={14} strokeWidth={1.5} /> Skirt</span><h1>Quarter Circle Skirt Calculator</h1><p>Calculate dimensions for a 90-degree quarter circle skirt -- gentle A-line flare, most fabric-efficient.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Measurements</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Waist (in)</label><input type="number" className="input-field input-mono" value={waist} onChange={e => setWaist(e.target.value)} min="1" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Skirt Length (in)</label><input type="number" className="input-field input-mono" value={length} onChange={e => setLength(e.target.value)} min="1" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Fabric Width (in)</label><select className="input-field" value={fabWidth} onChange={e => setFabWidth(e.target.value)}><option value="44">44/45&quot;</option><option value="54">54&quot;</option><option value="60">60&quot;</option></select></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Per-Piece Waist Radius</div><div className="result-value">{perPieceRadius.toFixed(2)}&quot;</div><div className="result-label">4 quarter-circle pieces needed</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Outer radius per piece</span><span className="result-row-value">{outerRadius.toFixed(1)}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Total hem circumference</span><span className="result-row-value">{hemCirc.toFixed(0)}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Pieces on {fw}&quot; wide</span><span className="result-row-value">{piecesAcross} per row</span></div>
                            <div className="result-row"><span className="result-row-label">Yardage estimate</span><span className="result-row-value">~{yardage.toFixed(1)} yards</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}