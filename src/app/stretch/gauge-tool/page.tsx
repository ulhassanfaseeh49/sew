"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Ruler, Copy, Printer, ChevronDown, BarChart3, Info } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Stretch % Calculator", href: "/stretch/percentage-calculator", icon: BarChart3 },
    { name: "Knit Types", href: "/stretch/knit-type-comparator", icon: Info },
    { name: "Stitch Length Guide", href: "/stretch/stitch-length", icon: Ruler },
];

const faqItems = [
    { q: "What is a stretch gauge?", a: "A stretch gauge is a measurement tool to compare your fabric's stretch against a pattern's requirement. You stretch a marked section of fabric and see if it reaches the pattern's gauge mark." },
    { q: "How do I use a stretch gauge ruler?", a: "Mark 4 inches on your fabric. Stretch the fabric and see how far the 4 inch section extends. If the pattern's gauge shows 4 inches stretching to 6 inches, your fabric needs to reach at least 6 inches." },
    { q: "Why is 4 inches the standard?", a: "4 inches is the most common gauge measurement because it's large enough for accuracy but small enough to test easily. Some patterns use 10cm (approximately 4 inches) for metric." },
];

export default function GaugeToolPage() {
    const [original, setOrig] = useState("4");
    const [stretched, setStretched] = useState("");
    const [patternReq, setPattern] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const o = parseFloat(original) || 4;
    const s = parseFloat(stretched) || 0;
    const req = parseFloat(patternReq) || 0;
    const stretchPct = s > 0 ? ((s - o) / o * 100) : 0;
    const reqPct = req > 0 ? ((req - o) / o * 100) : 0;
    const passes = s >= req;
    const hasResult = s > 0;

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(`Gauge: ${o}" → ${s}" = ${stretchPct.toFixed(0)}% stretch${req > 0 ? `. Pattern needs ${reqPct.toFixed(0)}% — ${passes ? "PASS" : "FAIL"}` : ""}`);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    }, [o, s, stretchPct, req, reqPct, passes]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Stretch Tools", href: "/stretch" }, { label: "Stretch Gauge" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Stretch Tool</span>
                        <h1>Stretch Gauge Tool</h1>
                        <p>Test your fabric against a pattern&apos;s stretch gauge to verify compatibility.</p>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.calcTitle}>Gauge Test</h2>
                        <div className="calculator-form">
                            <div className="input-group"><label className="input-label">Gauge Length (inches)</label><input type="number" className="input-field input-mono" value={original} onChange={e => setOrig(e.target.value)} min="1" step="0.5" /><span className="input-helper">Standard: 4&quot;</span></div>
                            <div className="calculator-form-row">
                                <div className="input-group"><label className="input-label">Your Stretched Length</label><input type="number" className="input-field input-mono" placeholder="e.g., 6" value={stretched} onChange={e => setStretched(e.target.value)} min="0" step="0.25" /></div>
                                <div className="input-group"><label className="input-label">Pattern Gauge Mark (optional)</label><input type="number" className="input-field input-mono" placeholder="e.g., 5.5" value={patternReq} onChange={e => setPattern(e.target.value)} min="0" step="0.25" /></div>
                            </div>
                        </div>
                        {hasResult && (
                            <div>
                                <div className="calculator-divider" />
                                <div className="result-card"><div className="result-prefix">Your Fabric</div><div className="result-value">{stretchPct.toFixed(0)}% stretch</div><div className="result-label">{o}&quot; stretched to {s}&quot;</div></div>
                                {req > 0 && (
                                    <div className="smart-tip" style={{ marginTop: 16, borderColor: passes ? "#22c55e" : "#ef4444" }}>
                                        <Info size={16} style={{ color: passes ? "#22c55e" : "#ef4444", flexShrink: 0 }} />
                                        <div>{passes ? `Passed! Your fabric (${stretchPct.toFixed(0)}%) meets the pattern requirement (${reqPct.toFixed(0)}%).` : `Failed. Pattern needs ${reqPct.toFixed(0)}% but fabric only has ${stretchPct.toFixed(0)}%. Choose a stretchier fabric.`}</div>
                                    </div>
                                )}
                                <div className="toolbar" style={{ marginTop: 16 }}>
                                    <button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button>
                                    <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside>
            </div>
        </div>
    );
}