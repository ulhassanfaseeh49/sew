"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Droplets, Copy, Printer, ChevronDown, ShoppingCart, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Pre-Wash Estimator", href: "/shrinkage/pre-wash-estimator", icon: Droplets },
    { name: "Shrinkage % Calc", href: "/shrinkage/percentage-calculator", icon: Droplets },
    { name: "Buy Extra Calc", href: "/shrinkage/buy-extra", icon: ShoppingCart },
];
const faqItems = [
    { q: "How do I calculate how much fabric I'll have after washing?", a: "Multiply your current yardage by (1 - shrinkage%). For example, 3 yards with 5% shrinkage = 3 x 0.95 = 2.85 yards remaining." },
    { q: "Does fabric shrink every time you wash it?", a: "The first wash causes the most shrinkage (80-90% of total). Second wash adds a small amount. After 3 washes, most fabrics have stabilized." },
    { q: "My fabric shrank - is there enough left for my project?", a: "Measure your post-wash fabric carefully. Enter both post-wash yardage and pattern requirement to check if you have enough." },
];

export default function PostWashYardagePage() {
    const [yardage, setYardage] = useState(""); const [width, setWidth] = useState("45");
    const [lenShrink, setLenShrink] = useState("4"); const [crossShrink, setCrossShrink] = useState("3");
    const [patternReq, setPatternReq] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const y = parseFloat(yardage) || 0; const w = parseFloat(width) || 45;
    const ls = parseFloat(lenShrink) || 0; const cs = parseFloat(crossShrink) || 0;
    const postYard = y * (1 - ls / 100); const postWidth = w * (1 - cs / 100);
    const yardLost = y - postYard; const widthLost = w - postWidth;
    const pr = parseFloat(patternReq) || 0;
    const sufficient = pr > 0 ? postYard >= pr : null;
    const hasResult = y > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Original: ${y} yd x ${w}". After ${ls}%/${cs}% shrinkage: ${postYard.toFixed(2)} yd x ${postWidth.toFixed(1)}"`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [y, w, ls, cs, postYard, postWidth]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Shrinkage", href: "/shrinkage" }, { label: "Post-Wash Yardage" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Droplets size={14} strokeWidth={1.5} /> Shrinkage</span><h1>Post-Wash Yardage Calculator</h1><p>Calculate remaining yardage and dimensions after washing.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Current Fabric</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Current Yardage</label><input type="number" className="input-field input-mono" placeholder="e.g., 3" value={yardage} onChange={e => setYardage(e.target.value)} min="0" step="0.25" /></div>
                            <div className="input-group"><label className="input-label">Fabric Width (inches)</label><input type="number" className="input-field input-mono" value={width} onChange={e => setWidth(e.target.value)} min="1" /></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Lengthwise Shrinkage (%)</label><input type="number" className="input-field input-mono" value={lenShrink} onChange={e => setLenShrink(e.target.value)} min="0" max="50" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Crosswise Shrinkage (%)</label><input type="number" className="input-field input-mono" value={crossShrink} onChange={e => setCrossShrink(e.target.value)} min="0" max="50" step="0.5" /></div>
                        </div>
                        <div className="input-group"><label className="input-label">Pattern Requirement (optional, yards)</label><input type="number" className="input-field input-mono" placeholder="e.g., 2.5" value={patternReq} onChange={e => setPatternReq(e.target.value)} min="0" step="0.125" /></div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Post-Wash Yardage</div><div className="result-value">{postYard.toFixed(2)} yards</div><div className="result-label">{postWidth.toFixed(1)}&quot; wide ({yardLost.toFixed(2)} yd lost, {widthLost.toFixed(1)}&quot; narrower)</div></div>
                        {sufficient !== null && (<p style={{ marginTop: 12, padding: "12px 16px", borderRadius: 8, fontSize: "var(--text-sm)", fontWeight: 600, background: sufficient ? "#dcfce7" : "#fecaca", color: sufficient ? "#166534" : "#991b1b" }}>{sufficient ? `You have enough -- ${(postYard - pr).toFixed(2)} yd to spare` : `You are short by ${(pr - postYard).toFixed(2)} yd`}</p>)}
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}