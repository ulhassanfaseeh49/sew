"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { CircleDot, Copy, Printer, ChevronDown, Scissors, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const btnSizes = [
    { ligne: 14, mm: 8.9, use: "Baby, delicate blouses" },
    { ligne: 16, mm: 10.2, use: "Shirt collars, cuffs" },
    { ligne: 18, mm: 11.4, use: "Lightweight shirts" },
    { ligne: 20, mm: 12.7, use: "Standard dress shirts" },
    { ligne: 24, mm: 15.2, use: "Blouses, light jackets" },
    { ligne: 28, mm: 17.8, use: "Suits, blazers" },
    { ligne: 32, mm: 20.3, use: "Coats, heavy jackets" },
    { ligne: 36, mm: 22.9, use: "Outerwear, decorative" },
    { ligne: 40, mm: 25.4, use: "Statement buttons, coats" },
    { ligne: 44, mm: 27.9, use: "Large decorative buttons" },
];

const relatedTools = [
    { name: "Button Spacing", href: "/notions/button-spacing", icon: Ruler },
    { name: "Buttonhole Length", href: "/notions/buttonhole-calculator", icon: Scissors },
    { name: "Thread Yardage", href: "/notions/thread-yardage", icon: Scissors },
];
const faqItems = [
    { q: "What is the ligne measurement system?", a: "Ligne (L or ''') is the French system used worldwide for buttons. 1 ligne = 0.635mm. A 20L button is ~12.7mm (~1/2 inch) -- the standard dress shirt button." },
    { q: "What size button do I need for a dress shirt?", a: "Standard dress shirt front buttons are 20L (12.7mm / 1/2\"). Collar and cuff buttons are often 16L (10.2mm)." },
    { q: "How do I measure a button for replacement?", a: "Measure the widest point across the face in millimeters. For shank buttons, also measure the height from the fabric surface to the top." },
];

export default function ButtonSizePage() {
    const [sizeMm, setSizeMm] = useState(""); const [sizeLigne, setSizeLigne] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const mm = parseFloat(sizeMm) || 0;
    const lg = parseFloat(sizeLigne) || 0;
    const calcMm = mm > 0 ? mm : lg > 0 ? lg * 0.635 : 0;
    const calcLg = lg > 0 ? lg : mm > 0 ? mm / 0.635 : 0;
    const calcIn = calcMm > 0 ? calcMm / 25.4 : 0;
    const hasConversion = calcMm > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Button: ${calcLg.toFixed(0)}L = ${calcMm.toFixed(1)}mm = ${calcIn.toFixed(3)}"`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [calcLg, calcMm, calcIn]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Notions", href: "/notions" }, { label: "Button Size Calculator" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><CircleDot size={14} strokeWidth={1.5} /> Notions</span><h1>Button Size Calculator</h1><p>Convert between ligne, millimeters, and inches with project-appropriate size recommendations.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Convert Button Size</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Size in mm</label><input type="number" className="input-field input-mono" placeholder="e.g. 12.7" value={sizeMm} onChange={e => { setSizeMm(e.target.value); setSizeLigne(""); }} min="1" step="0.1" /></div>
                            <div className="input-group"><label className="input-label">Size in Ligne (L)</label><input type="number" className="input-field input-mono" placeholder="e.g. 20" value={sizeLigne} onChange={e => { setSizeLigne(e.target.value); setSizeMm(""); }} min="1" /></div>
                        </div>
                    </div>
                    {hasConversion && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Button Size</div><div className="result-value">{calcLg.toFixed(0)}L = {calcMm.toFixed(1)}mm</div><div className="result-label">{calcIn.toFixed(3)}&quot; ({(calcIn * 16).toFixed(0)}/16&quot;)</div></div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Standard Button Sizes</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Ligne</th><th>mm</th><th>Inches</th><th>Common Use</th></tr></thead>
                        <tbody>{btnSizes.map(b => (<tr key={b.ligne}><td style={{ fontWeight: 600 }}>{b.ligne}L</td><td>{b.mm}</td><td>{(b.mm / 25.4).toFixed(3)}&quot;</td><td>{b.use}</td></tr>))}</tbody>
                    </table></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}