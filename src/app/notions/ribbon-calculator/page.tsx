"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Ribbon, Copy, Printer, ChevronDown, Scissors, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const bowSizes: Record<string, number> = { "Mini (1-2\")": 12, "Small (2-3\")": 20, "Standard (3-5\")": 30, "Large (5-8\")": 48, "Oversized (8\"+)": 72 };
const relatedTools = [
    { name: "Lace Calculator", href: "/notions/lace-calculator", icon: Ruler },
    { name: "Trim Calculator", href: "/notions/trim-calculator", icon: Scissors },
    { name: "Thread Yardage", href: "/notions/thread-yardage", icon: Scissors },
];
const faqItems = [
    { q: "How much ribbon for a bow?", a: "Ribbon per bow = (bow width x 2 x number of loops) + (tail length x 2) + 2\" for center wrap. A standard 4-loop bow with 4\" tails needs ~36\" of ribbon." },
    { q: "Which ribbon type is best for garment ties?", a: "Grosgrain for casual garments (holds shape). Satin for formal/bridal (drapes beautifully). Velvet for necklines (luxurious look)." },
    { q: "How do I prevent ribbon ends from fraying?", a: "Heat-seal synthetic ribbons with a flame or heat tool. For natural fibers, use Fray Check or fold and stitch the ends." },
];

export default function RibbonCalcPage() {
    const [appType, setAppType] = useState("bow"); const [bowSize, setBowSize] = useState("Standard (3-5\")");
    const [qty, setQty] = useState("1"); const [edgeLen, setEdgeLen] = useState("48");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const q = parseInt(qty) || 1;
    let ribbonPerUnit = 0;
    if (appType === "bow") { ribbonPerUnit = bowSizes[bowSize] || 30; }
    else if (appType === "edge") { ribbonPerUnit = parseFloat(edgeLen) || 0; ribbonPerUnit *= 1.1; }
    else if (appType === "sash") { ribbonPerUnit = 80; }
    const totalInches = ribbonPerUnit * q;
    const totalYards = totalInches / 36;
    const hasResult = ribbonPerUnit > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Ribbon: ~${totalYards.toFixed(1)} yards total (${q} x ${ribbonPerUnit.toFixed(0)}").`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [totalYards, q, ribbonPerUnit]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Notions", href: "/notions" }, { label: "Ribbon Calculator" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Ribbon size={14} strokeWidth={1.5} /> Notions</span><h1>Ribbon Length Calculator</h1><p>Calculate ribbon yardage for bows, sashes, edge binding, and gift wrapping.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Ribbon Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Application</label><select className="input-field" value={appType} onChange={e => setAppType(e.target.value)}><option value="bow">Bow making</option><option value="edge">Edge/border</option><option value="sash">Sash/tie</option></select></div>
                            {appType === "bow" && <div className="input-group"><label className="input-label">Bow Size</label><select className="input-field" value={bowSize} onChange={e => setBowSize(e.target.value)}>{Object.keys(bowSizes).map(s => (<option key={s} value={s}>{s}</option>))}</select></div>}
                            {appType === "edge" && <div className="input-group"><label className="input-label">Edge Length (in)</label><input type="number" className="input-field input-mono" value={edgeLen} onChange={e => setEdgeLen(e.target.value)} min="1" /></div>}
                            <div className="input-group"><label className="input-label">Quantity</label><input type="number" className="input-field input-mono" value={qty} onChange={e => setQty(e.target.value)} min="1" /></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Total Ribbon</div><div className="result-value">~{totalYards.toFixed(1)} yards</div><div className="result-label">{totalInches.toFixed(0)}&quot; ({q} x {ribbonPerUnit.toFixed(0)}&quot;)</div></div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}