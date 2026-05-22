"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { SquareStack, Copy, Printer, ChevronDown, Scissors, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const quiltSizes: Record<string, { w: number; l: number; label: string }> = {
    baby: { w: 36, l: 52, label: "Baby (36x52)" }, throw: { w: 50, l: 65, label: "Throw (50x65)" },
    twin: { w: 65, l: 90, label: "Twin (65x90)" }, full: { w: 80, l: 90, label: "Full (80x90)" },
    queen: { w: 90, l: 108, label: "Queen (90x108)" }, king: { w: 108, l: 108, label: "King (108x108)" },
    custom: { w: 0, l: 0, label: "Custom" },
};

const sizeRef = [
    { size: "Baby", perim: '176"', strips: "3", yardage: "1/4 yard" },
    { size: "Throw", perim: '230"', strips: "4", yardage: "3/8 yard" },
    { size: "Twin", perim: '310"', strips: "5", yardage: "3/8 yard" },
    { size: "Full", perim: '340"', strips: "5", yardage: "1/2 yard" },
    { size: "Queen", perim: '396"', strips: "6", yardage: "1/2 yard" },
    { size: "King", perim: '432"', strips: "7", yardage: "5/8 yard" },
];

const relatedTools = [
    { name: "Tape Width Calc", href: "/bias-binding/tape-width", icon: Scissors },
    { name: "Finished Width Calc", href: "/bias-binding/finished-width", icon: Scissors },
    { name: "Continuous Bias", href: "/bias-binding/continuous-bias", icon: BookOpen },
];
const faqItems = [
    { q: "How much binding do I need for a queen quilt?", a: "Queen quilt perimeter is approximately 396 inches. With corner allowances and overlap, you need about 420 inches (11.7 yards). From 44\" fabric, buy 1/2 yard." },
    { q: "Should I use straight grain or bias binding for quilts?", a: "Straight grain (cross grain) is standard for quilts with straight edges. Use bias only for quilts with curved or scalloped edges." },
    { q: "How wide should I cut quilt binding strips?", a: "2-1/2\" is the most common width for standard batting thickness. Use 2-1/4\" for thin quilts, 3\" for thick quilts." },
];

export default function QuiltBindingPage() {
    const [sizeKey, setSizeKey] = useState("throw");
    const [customW, setCustomW] = useState(""); const [customL, setCustomL] = useState("");
    const [stripWidth, setStripWidth] = useState("2.5");
    const [fabricWidth, setFabricWidth] = useState("44"); const [overlap, setOverlap] = useState("10");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const sz = quiltSizes[sizeKey];
    const w = sizeKey === "custom" ? (parseFloat(customW) || 0) : sz.w;
    const l = sizeKey === "custom" ? (parseFloat(customL) || 0) : sz.l;
    const sw = parseFloat(stripWidth) || 2.5; const fw = parseFloat(fabricWidth) || 44; const ov = parseFloat(overlap) || 10;
    const perim = (w + l) * 2; const corners = 12; // 4 corners x 3"
    const totalBinding = perim + corners + ov + 10; // +10 safety
    const usableWidth = fw - 1; // remove selvages
    const stripsPerYard = Math.floor(36 / sw);
    const stripsNeeded = Math.ceil(totalBinding / usableWidth);
    const yardsNeeded = stripsNeeded / stripsPerYard;
    const buyYards = Math.ceil(yardsNeeded * 8) / 8;
    const hasResult = w > 0 && l > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Quilt ${w}"x${l}": ${totalBinding.toFixed(0)}" binding needed. Cut ${stripsNeeded} strips at ${sw}" wide from ${fw}" fabric. Buy ${buyYards} yard(s).`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [w, l, totalBinding, stripsNeeded, sw, fw, buyYards]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Bias Binding", href: "/bias-binding" }, { label: "Quilt Binding" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><SquareStack size={14} strokeWidth={1.5} /> Bias Binding</span><h1>Quilt Binding Calculator</h1><p>Calculate binding for quilts including corners, overlap, and fabric yardage.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Quilt Details</h2>
                    <div className="calculator-form">
                        <div className="input-group"><label className="input-label">Quilt Size</label><select className="input-field" value={sizeKey} onChange={e => setSizeKey(e.target.value)}>{Object.entries(quiltSizes).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
                        {sizeKey === "custom" && <div className="calculator-form-row"><div className="input-group"><label className="input-label">Width (inches)</label><input type="number" className="input-field input-mono" value={customW} onChange={e => setCustomW(e.target.value)} min="1" /></div><div className="input-group"><label className="input-label">Length (inches)</label><input type="number" className="input-field input-mono" value={customL} onChange={e => setCustomL(e.target.value)} min="1" /></div></div>}
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Strip Width (inches)</label><input type="number" className="input-field input-mono" value={stripWidth} onChange={e => setStripWidth(e.target.value)} min="1" step="0.25" /></div>
                            <div className="input-group"><label className="input-label">Fabric Width (inches)</label><input type="number" className="input-field input-mono" value={fabricWidth} onChange={e => setFabricWidth(e.target.value)} min="36" /></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Total Binding Needed</div><div className="result-value">{totalBinding.toFixed(0)}&quot; ({(totalBinding / 36).toFixed(1)} yd)</div><div className="result-label">Cut {stripsNeeded} strips at {sw}&quot; wide. Buy {buyYards} yard{buyYards !== 1 ? "s" : ""} of fabric.</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Quilt perimeter</span><span className="result-row-value">{perim}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Corner allowance (4x3&quot;)</span><span className="result-row-value">+{corners}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Join overlap</span><span className="result-row-value">+{ov}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Safety buffer</span><span className="result-row-value">+10&quot;</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Binding per Quilt Size (at 2-1/2&quot; strips)</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Size</th><th>Perimeter</th><th>Strips (44&quot;)</th><th>Fabric</th></tr></thead>
                        <tbody>{sizeRef.map(r => (<tr key={r.size}><td style={{ fontWeight: 600 }}>{r.size}</td><td>{r.perim}</td><td>{r.strips}</td><td>{r.yardage}</td></tr>))}</tbody>
                    </table></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}