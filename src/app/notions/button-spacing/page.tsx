"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { AlignVerticalSpaceAround, Copy, Printer, ChevronDown, Scissors, CircleDot } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Button Size", href: "/notions/button-size-calculator", icon: CircleDot },
    { name: "Buttonhole Length", href: "/notions/buttonhole-calculator", icon: Scissors },
    { name: "Hook & Eye Spacing", href: "/notions/hook-eye-spacing", icon: Scissors },
];
const faqItems = [
    { q: "Where do I start measuring for button placement?", a: "Start from the neckline (top button) and the bottom edge (last button). Distribute remaining buttons evenly in between. The bust line button is the most critical placement." },
    { q: "What is the standard spacing between shirt buttons?", a: "Menswear: 3-3.5 inches apart. Womenswear: 2.5-3 inches. Always adjust for bust line -- place a button at the fullest point." },
    { q: "Should I add a button at the bust line?", a: "Always. Gaps at the bust are the most common garment fitting issue. If your calculated spacing skips the bust, add an extra button there." },
];

export default function ButtonSpacingPage() {
    const [placketLen, setPlacketLen] = useState("18"); const [numButtons, setNumButtons] = useState("6");
    const [topOffset, setTopOffset] = useState("0.75"); const [bottomOffset, setBottomOffset] = useState("0.75");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const pl = parseFloat(placketLen) || 0; const nb = parseInt(numButtons) || 0;
    const to = parseFloat(topOffset) || 0; const bo = parseFloat(bottomOffset) || 0;
    const usableLen = pl - to - bo;
    const spacing = nb > 1 ? usableLen / (nb - 1) : usableLen;
    const hasResult = pl > 0 && nb > 0 && usableLen > 0;

    const positions: number[] = [];
    for (let i = 0; i < nb; i++) { positions.push(to + i * spacing); }

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`${nb} buttons, ${spacing.toFixed(2)}" apart. Positions: ${positions.map(p => p.toFixed(2) + '"').join(", ")}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [nb, spacing, positions]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Notions", href: "/notions" }, { label: "Button Spacing" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><AlignVerticalSpaceAround size={14} strokeWidth={1.5} /> Notions</span><h1>Button Spacing Calculator</h1><p>Calculate even button placement from top to bottom of any placket length.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Placket Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Placket Length (in)</label><input type="number" className="input-field input-mono" value={placketLen} onChange={e => setPlacketLen(e.target.value)} min="1" step="0.25" /></div>
                            <div className="input-group"><label className="input-label">Number of Buttons</label><input type="number" className="input-field input-mono" value={numButtons} onChange={e => setNumButtons(e.target.value)} min="1" max="20" /></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Top Edge Offset (in)</label><input type="number" className="input-field input-mono" value={topOffset} onChange={e => setTopOffset(e.target.value)} min="0" step="0.25" /></div>
                            <div className="input-group"><label className="input-label">Bottom Edge Offset (in)</label><input type="number" className="input-field input-mono" value={bottomOffset} onChange={e => setBottomOffset(e.target.value)} min="0" step="0.25" /></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Button Spacing</div><div className="result-value">{spacing.toFixed(2)}&quot; apart</div><div className="result-label">{nb} buttons across {usableLen.toFixed(2)}&quot; usable length</div></div>
                        <div className={styles.tableWrap} style={{ marginTop: 12 }}><table className={styles.convTable}><thead><tr><th>Button #</th><th>From Top Edge</th></tr></thead>
                            <tbody>{positions.map((p, i) => (<tr key={i}><td style={{ fontWeight: 600 }}>#{i + 1}</td><td>{p.toFixed(2)}&quot;</td></tr>))}</tbody>
                        </table></div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}