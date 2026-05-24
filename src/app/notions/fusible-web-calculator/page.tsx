"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Flame, Copy, Printer, ChevronDown, Layers, Scissors } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const products = [
    { name: "HeatnBond Lite", sewable: "Yes", hold: "Medium", temp: "Medium iron, no steam" },
    { name: "HeatnBond Ultra Hold", sewable: "No (clogs needle)", hold: "Permanent", temp: "Medium iron, no steam" },
    { name: "Wonder Under (Pellon 805)", sewable: "Yes", hold: "Medium", temp: "Steam iron" },
    { name: "Steam-A-Seam 2", sewable: "Yes", hold: "Medium", temp: "Steam iron, 10-15 sec" },
    { name: "Misty Fuse", sewable: "Yes", hold: "Light", temp: "Low-medium, dry" },
];
const relatedTools = [
    { name: "Interfacing Calc", href: "/notions/interfacing-calculator", icon: Layers },
    { name: "Stabilizer Calc", href: "/needles-thread/thread-by-fabric", icon: Scissors },
    { name: "Thread Yardage", href: "/notions/thread-yardage", icon: Scissors },
];
const faqItems = [
    { q: "Which fusible web should I use for applique?", a: "If you plan to sew around edges: HeatnBond Lite or Wonder Under (sewable). If no sewing: HeatnBond Ultra Hold (permanent but clogs needles)." },
    { q: "Why does my fusible web not stick?", a: "Wrong temperature, not enough pressing time, or using steam when the product requires dry heat. Always follow the specific product directions." },
    { q: "How do I calculate fusible web for applique?", a: "Measure each applique piece, add 1/2\" margin around each. Total all areas together. Divide by web width (usually 17\") to get yardage." },
];

export default function FusibleWebCalcPage() {
    const [totalArea, setTotalArea] = useState("100"); const [webWidth, setWebWidth] = useState("17");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const area = parseFloat(totalArea) || 0; const ww = parseFloat(webWidth) || 17;
    const yardage = ww > 0 ? area / ww / 36 : 0;
    const yardageWithExtra = yardage * 1.15;
    const hasResult = area > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Fusible web: ~${yardageWithExtra.toFixed(2)} yards (${area} sq in, +15% waste).`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [yardageWithExtra, area]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Notions", href: "/notions" }, { label: "Fusible Web Calculator" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Flame size={14} strokeWidth={1.5} /> Notions</span><h1>Fusible Web Yardage Calculator</h1><p>Calculate fusible web yardage for applique, hem bonding, and fabric fusing projects.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Project Area</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Total Applique Area (sq in)</label><input type="number" className="input-field input-mono" value={totalArea} onChange={e => setTotalArea(e.target.value)} min="1" /></div>
                            <div className="input-group"><label className="input-label">Web Width (in)</label><input type="number" className="input-field input-mono" value={webWidth} onChange={e => setWebWidth(e.target.value)} min="1" /></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Fusible Web Yardage</div><div className="result-value">~{yardageWithExtra.toFixed(2)} yards</div><div className="result-label">Including 15% cutting waste</div></div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Fusible Web Product Comparison</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Product</th><th>Sewable?</th><th>Hold</th><th>Iron Setting</th></tr></thead>
                        <tbody>{products.map(p => (<tr key={p.name}><td style={{ fontWeight: 600 }}>{p.name}</td><td>{p.sewable}</td><td>{p.hold}</td><td>{p.temp}</td></tr>))}</tbody>
                    </table></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}