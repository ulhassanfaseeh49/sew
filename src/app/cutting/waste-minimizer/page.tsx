"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Sparkles, Copy, Printer, ChevronDown, Scissors, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Layout Optimizer", href: "/cutting/layout-optimizer", icon: Scissors },
    { name: "Strip Cutting", href: "/cutting/strip-calculator", icon: Scissors },
    { name: "Usable Width", href: "/cutting/usable-width", icon: Ruler },
];
const faqItems = [
    { q: "How do I minimize cutting waste?", a: "Always cut the largest pieces first, plan all pieces before making any cuts, and use the strip-then-subcut method for small shapes." },
    { q: "What is a good fabric efficiency percentage?", a: "Over 85% is excellent, 70-85% is good, below 70% suggests re-arrangement may help. Bias cutting and fussy cutting inherently waste more." },
    { q: "Should I plan all cuts before starting?", a: "Absolutely. Cutting without a plan is the number one cause of wasted fabric, especially with expensive or limited-supply fabric." },
];

export default function WasteMinimizerPage() {
    const [fabWidth, setFabWidth] = useState("44"); const [fabLength, setFabLength] = useState("36");
    const [pieces, setPieces] = useState([{ name: "Piece A", width: "5", height: "5", qty: "10" }]);
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const fw = parseFloat(fabWidth) || 44; const fl = parseFloat(fabLength) || 36;
    const totalFabArea = fw * fl;

    const updatePiece = (i: number, field: string, val: string) => { const p = [...pieces]; (p[i] as Record<string, string>)[field] = val; setPieces(p); };

    const results = pieces.map(p => {
        const pw = parseFloat(p.width) || 0; const ph = parseFloat(p.height) || 0; const pq = parseInt(p.qty) || 0;
        return { ...p, pw, ph, pq, area: pw * ph * pq };
    });
    const totalPieceArea = results.reduce((s, r) => s + r.area, 0);
    const wasteArea = totalFabArea - totalPieceArea;
    const efficiency = totalFabArea > 0 ? (totalPieceArea / totalFabArea * 100) : 0;
    const fits = totalPieceArea <= totalFabArea;
    const hasResult = results.some(r => r.pq > 0 && r.pw > 0 && r.ph > 0);

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Efficiency: ${efficiency.toFixed(0)}%. Total piece area: ${totalPieceArea.toFixed(0)} sq in. Waste: ${wasteArea.toFixed(0)} sq in.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [efficiency, totalPieceArea, wasteArea]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Cutting Tools", href: "/cutting" }, { label: "Waste Minimizer" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Sparkles size={14} strokeWidth={1.5} /> Cutting</span><h1>Waste Minimization Planner</h1><p>Plan all your cuts before making any to minimize fabric waste.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Fabric and Pieces</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Fabric Width (in)</label><input type="number" className="input-field input-mono" value={fabWidth} onChange={e => setFabWidth(e.target.value)} min="1" /></div>
                            <div className="input-group"><label className="input-label">Fabric Length (in)</label><input type="number" className="input-field input-mono" value={fabLength} onChange={e => setFabLength(e.target.value)} min="1" /></div>
                        </div>
                    </div>
                    <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600, margin: "16px 0 8px" }}>Pieces Needed</h3>
                    {pieces.map((p, i) => (<div key={i} className="calculator-form" style={{ marginBottom: 8, paddingBottom: 8, borderBottom: i < pieces.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Name</label><input type="text" className="input-field" value={p.name} onChange={e => updatePiece(i, "name", e.target.value)} /></div>
                            <div className="input-group"><label className="input-label">W (in)</label><input type="number" className="input-field input-mono" value={p.width} onChange={e => updatePiece(i, "width", e.target.value)} min="0.5" step="0.25" /></div>
                            <div className="input-group"><label className="input-label">H (in)</label><input type="number" className="input-field input-mono" value={p.height} onChange={e => updatePiece(i, "height", e.target.value)} min="0.5" step="0.25" /></div>
                            <div className="input-group"><label className="input-label">Qty</label><input type="number" className="input-field input-mono" value={p.qty} onChange={e => updatePiece(i, "qty", e.target.value)} min="1" /></div>
                        </div>
                    </div>))}
                    <button className="btn btn-secondary btn-sm" onClick={() => setPieces([...pieces, { name: "", width: "", height: "", qty: "1" }])}>+ Add Piece</button>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Fabric Efficiency</div><div className="result-value">{Math.min(efficiency, 100).toFixed(0)}%</div><div className="result-label" style={{ color: fits ? "var(--color-success)" : "var(--color-error)" }}>{fits ? "All pieces fit" : `Short by ${Math.abs(wasteArea).toFixed(0)} sq in -- buy more fabric`}</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Fabric area</span><span className="result-row-value">{totalFabArea.toFixed(0)} sq in</span></div>
                            <div className="result-row"><span className="result-row-label">Pieces area</span><span className="result-row-value">{totalPieceArea.toFixed(0)} sq in</span></div>
                            {fits && <div className="result-row"><span className="result-row-label">Waste area</span><span className="result-row-value">{wasteArea.toFixed(0)} sq in</span></div>}
                        </div>
                        <p style={{ margin: "12px 0 0", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", fontStyle: "italic" }}>Tip: Cut largest pieces first, then use scraps for smaller pieces.</p>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}