"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Grid3X3, Copy, Printer, ChevronDown, Droplets, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const quiltSizes: Record<string, { w: number; l: number; label: string }> = {
    baby: { w: 36, l: 52, label: "Baby (36x52)" }, throw_: { w: 50, l: 65, label: "Throw (50x65)" },
    twin: { w: 65, l: 90, label: "Twin (65x90)" }, full: { w: 80, l: 90, label: "Full (80x90)" },
    queen: { w: 90, l: 108, label: "Queen (90x108)" }, king: { w: 108, l: 108, label: "King (108x108)" },
    custom: { w: 0, l: 0, label: "Custom" },
};
const battingTypes: Record<string, { label: string; shrink: number }> = {
    cotton: { label: "100% Cotton batting", shrink: 4 },
    poly: { label: "100% Polyester batting", shrink: 0.5 },
    blend: { label: "80/20 Cotton/Poly blend", shrink: 2.5 },
    wool: { label: "100% Wool batting", shrink: 3 },
    bamboo: { label: "Bamboo batting", shrink: 3 },
};

const relatedTools = [
    { name: "Pre-Wash Estimator", href: "/shrinkage/pre-wash-estimator", icon: Droplets },
    { name: "Pre-Washing Guide", href: "/shrinkage/pre-washing-guide", icon: Droplets },
    { name: "Quilt Binding Calc", href: "/bias-binding/quilt-binding", icon: Ruler },
];
const faqItems = [
    { q: "How much will my quilt shrink after the first wash?", a: "With cotton batting and unwashed cotton fabric: 3-8% overall. With polyester batting and pre-washed fabric: under 1%." },
    { q: "How do I get the crinkled vintage look?", a: "Use cotton batting, do NOT pre-wash fabric, quilt normally, then wash the finished quilt in warm water and tumble dry. The differential shrinkage creates the texture." },
    { q: "Will cotton batting shrink more than polyester?", a: "Yes -- significantly. Cotton batting shrinks 3-5%, polyester under 1%. Blends (80/20) give a compromise at about 2-3%." },
];

export default function QuiltShrinkagePage() {
    const [sizeKey, setSizeKey] = useState("queen"); const [customW, setCustomW] = useState(""); const [customL, setCustomL] = useState("");
    const [batting, setBatting] = useState("cotton"); const [prewashed, setPrewashed] = useState("no");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const sz = quiltSizes[sizeKey];
    const w = sizeKey === "custom" ? (parseFloat(customW) || 0) : sz.w;
    const l = sizeKey === "custom" ? (parseFloat(customL) || 0) : sz.l;
    const bt = battingTypes[batting];
    const fabricShrink = prewashed === "yes" ? 0.5 : 4; // residual vs full
    const totalShrink = (bt.shrink + fabricShrink) / 2;
    const postW = w * (1 - totalShrink / 100); const postL = l * (1 - totalShrink / 100);
    const wLost = w - postW; const lLost = l - postL;
    const hasResult = w > 0 && l > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Quilt ${w}"x${l}" with ${bt.label}: post-wash ~${postW.toFixed(1)}"x${postL.toFixed(1)}" (${totalShrink.toFixed(1)}% shrinkage)`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [w, l, bt, postW, postL, totalShrink]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Shrinkage", href: "/shrinkage" }, { label: "Quilt Shrinkage" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Grid3X3 size={14} strokeWidth={1.5} /> Shrinkage</span><h1>Quilt Shrinkage Calculator</h1><p>Estimate how much your finished quilt will shrink after the first wash.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Quilt Details</h2>
                    <div className="calculator-form">
                        <div className="input-group"><label className="input-label">Quilt Size</label><select className="input-field" value={sizeKey} onChange={e => setSizeKey(e.target.value)}>{Object.entries(quiltSizes).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
                        {sizeKey === "custom" && (<div className="calculator-form-row"><div className="input-group"><label className="input-label">Width (in)</label><input type="number" className="input-field input-mono" value={customW} onChange={e => setCustomW(e.target.value)} min="1" /></div><div className="input-group"><label className="input-label">Length (in)</label><input type="number" className="input-field input-mono" value={customL} onChange={e => setCustomL(e.target.value)} min="1" /></div></div>)}
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Batting Type</label><select className="input-field" value={batting} onChange={e => setBatting(e.target.value)}>{Object.entries(battingTypes).map(([k, v]) => <option key={k} value={k}>{v.label} (~{v.shrink}%)</option>)}</select></div>
                            <div className="input-group"><label className="input-label">Fabric Pre-washed?</label><select className="input-field" value={prewashed} onChange={e => setPrewashed(e.target.value)}><option value="no">No (un-washed)</option><option value="yes">Yes (pre-washed)</option></select></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Post-Wash Quilt Size</div><div className="result-value">{postW.toFixed(1)}&quot; x {postL.toFixed(1)}&quot;</div><div className="result-label">Lost ~{wLost.toFixed(1)}&quot; width, ~{lLost.toFixed(1)}&quot; length ({totalShrink.toFixed(1)}%)</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Original size</span><span className="result-row-value">{w}&quot; x {l}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Batting shrinkage</span><span className="result-row-value">~{bt.shrink}%</span></div>
                            <div className="result-row"><span className="result-row-label">Fabric shrinkage</span><span className="result-row-value">~{fabricShrink}%</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}