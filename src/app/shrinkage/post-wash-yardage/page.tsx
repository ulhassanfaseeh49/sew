"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Shrink, Copy, Printer, ChevronDown, Droplets, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Pre-Wash Estimator", href: "/shrinkage/pre-wash-estimator", icon: Droplets },
    { name: "Buy Extra Calc", href: "/shrinkage/buy-extra", icon: Ruler },
    { name: "Shrinkage % Calc", href: "/shrinkage/percentage-calculator", icon: Ruler },
];
const faqItems = [
    { q: "How do I calculate how much fabric I have after washing?", a: "Multiply original yardage by (1 - shrinkage%/100). For example: 3 yards with 5% shrinkage = 3 x 0.95 = 2.85 yards remaining." },
    { q: "Does fabric shrink every time you wash it?", a: "Most shrinkage occurs in the first 1-2 washes. After that, further shrinkage is minimal. Cotton stabilizes after about 3 washes." },
    { q: "My fabric shrank -- is there enough left for my project?", a: "Measure after washing and compare to your pattern requirements. Use the sufficiency check below to see if you have enough." },
];

export default function PostWashYardagePage() {
    const [origYd, setOrigYd] = useState(""); const [origWidth, setOrigWidth] = useState("44");
    const [lenShrink, setLenShrink] = useState("4"); const [crossShrink, setCrossShrink] = useState("2");
    const [patternYd, setPatternYd] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const oy = parseFloat(origYd) || 0; const ow = parseFloat(origWidth) || 44;
    const ls = parseFloat(lenShrink) || 0; const cs = parseFloat(crossShrink) || 0;
    const postYd = oy * (1 - ls / 100); const postWidth = ow * (1 - cs / 100);
    const ydLost = oy - postYd; const wdLost = ow - postWidth;
    const py = parseFloat(patternYd) || 0;
    const hasResult = oy > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Original: ${oy} yd x ${ow}". After ${ls}%/${cs}% shrinkage: ${postYd.toFixed(2)} yd x ${postWidth.toFixed(1)}"`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [oy, ow, ls, cs, postYd, postWidth]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Shrinkage", href: "/shrinkage" }, { label: "Post-Wash Yardage" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Shrink size={14} strokeWidth={1.5} /> Shrinkage</span><h1>Post-Wash Yardage Calculator</h1><p>Calculate resulting yardage and dimensions after washing.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Fabric Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Original Yardage</label><input type="number" className="input-field input-mono" placeholder="e.g., 3" value={origYd} onChange={e => setOrigYd(e.target.value)} min="0" step="0.125" /></div>
                            <div className="input-group"><label className="input-label">Original Width (inches)</label><input type="number" className="input-field input-mono" value={origWidth} onChange={e => setOrigWidth(e.target.value)} min="1" /></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Lengthwise Shrinkage %</label><input type="number" className="input-field input-mono" value={lenShrink} onChange={e => setLenShrink(e.target.value)} min="0" max="50" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Crosswise Shrinkage %</label><input type="number" className="input-field input-mono" value={crossShrink} onChange={e => setCrossShrink(e.target.value)} min="0" max="50" step="0.5" /></div>
                        </div>
                        <div className="input-group"><label className="input-label">Pattern Requires (yards, optional)</label><input type="number" className="input-field input-mono" placeholder="e.g., 2.75" value={patternYd} onChange={e => setPatternYd(e.target.value)} min="0" step="0.125" /></div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">After Washing</div><div className="result-value">{postYd.toFixed(2)} yards x {postWidth.toFixed(1)}&quot;</div><div className="result-label">Lost {ydLost.toFixed(2)} yd in length, {wdLost.toFixed(1)}&quot; in width</div></div>
                        {py > 0 && (<div style={{ marginTop: 12, padding: "12px 16px", borderRadius: 8, backgroundColor: postYd >= py ? "var(--color-success-bg, rgba(0,128,0,0.1))" : "var(--color-error-bg, rgba(255,0,0,0.1))", fontSize: "var(--text-sm)", fontWeight: 600 }}>
                            {postYd >= py ? `You have enough: ${(postYd - py).toFixed(2)} yards extra after shrinkage` : `Short by ${(py - postYd).toFixed(2)} yards -- buy more fabric`}
                        </div>)}
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}