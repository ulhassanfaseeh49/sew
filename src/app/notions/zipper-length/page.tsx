"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowDownWideNarrow, Copy, Printer, ChevronDown, Scissors, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const garmentLengths: Record<string, { ease: number; type: string }> = {
    "Dress (back zip)": { ease: 1, type: "Coil invisible" },
    "Dress (side zip)": { ease: 1, type: "Coil invisible" },
    "Skirt (back/side)": { ease: 1, type: "Coil invisible" },
    "Pants fly": { ease: 0.5, type: "Metal or coil" },
    "Jacket (separating)": { ease: 2, type: "Separating" },
    "Hoodie (separating)": { ease: 2, type: "Separating" },
    "Tote bag pocket": { ease: 0.5, type: "Coil" },
    "Pillow cover": { ease: 2, type: "Coil" },
    "Custom": { ease: 0, type: "Any" },
};
const stdLengths = [4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 22, 24];

const relatedTools = [
    { name: "Buttonhole Calc", href: "/notions/buttonhole-calculator", icon: Scissors },
    { name: "Hook & Eye", href: "/notions/hook-eye-spacing", icon: Ruler },
    { name: "Seam Allowance", href: "/seam-allowance", icon: Ruler },
];
const faqItems = [
    { q: "Should I buy a zipper longer than my opening?", a: "Usually yes. The zipper should be at least as long as the opening. For invisible zippers, buy 1-2\" longer and trim the bottom after installation." },
    { q: "Can I shorten a zipper?", a: "Yes. Coil and plastic zippers can be shortened by sewing a bar-tack where you want the new stop. Metal zippers need a metal stopper." },
    { q: "What zipper type for a concealed dress closure?", a: "An invisible/concealed zipper with a matching color. It requires a special invisible zipper foot and is inserted into an open seam." },
];

export default function ZipperLengthPage() {
    const [garment, setGarment] = useState("Dress (back zip)"); const [opening, setOpening] = useState("18");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const op = parseFloat(opening) || 0;
    const info = garmentLengths[garment] || { ease: 0, type: "Any" };
    const idealLen = op + info.ease;
    const recommended = stdLengths.find(l => l >= idealLen) || stdLengths[stdLengths.length - 1];
    const altLen = stdLengths.find(l => l >= idealLen && l !== recommended);
    const hasResult = op > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Opening: ${op}". Recommended zipper: ${recommended}" (${info.type}).`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [op, recommended, info.type]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Notions", href: "/notions" }, { label: "Zipper Length Selector" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><ArrowDownWideNarrow size={14} strokeWidth={1.5} /> Notions</span><h1>Zipper Length Selector</h1><p>Find the right zipper length and type for any garment or project.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Project Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Project Type</label><select className="input-field" value={garment} onChange={e => setGarment(e.target.value)}>{Object.keys(garmentLengths).map(g => (<option key={g} value={g}>{g}</option>))}</select></div>
                            <div className="input-group"><label className="input-label">Opening Length (in)</label><input type="number" className="input-field input-mono" value={opening} onChange={e => setOpening(e.target.value)} min="1" step="0.5" /></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Recommended Zipper</div><div className="result-value">{recommended}&quot;</div><div className="result-label">{info.type}</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Opening</span><span className="result-row-value">{op}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Ideal min length</span><span className="result-row-value">{idealLen.toFixed(1)}&quot;</span></div>
                            {altLen && <div className="result-row"><span className="result-row-label">Alternative</span><span className="result-row-value">{altLen}&quot;</span></div>}
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Standard Zipper Lengths</h2>
                    <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", margin: "0 0 8px" }}>{stdLengths.map(l => `${l}"`).join(", ")}</p>
                    <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", fontStyle: "italic", margin: 0 }}>Also available by the yard (continuous zipper roll) for custom lengths.</p>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}