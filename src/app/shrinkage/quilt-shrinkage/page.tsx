"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Layers, Copy, Printer, ChevronDown, Droplets, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const quiltSizes: Record<string, { w: number; l: number }> = {
    custom: { w: 0, l: 0 }, baby: { w: 36, l: 52 }, throw: { w: 50, l: 65 },
    twin: { w: 68, l: 86 }, full: { w: 86, l: 86 }, queen: { w: 90, l: 95 },
    king: { w: 108, l: 95 }, calKing: { w: 104, l: 100 },
};

const battingData: Record<string, { label: string; shrink: number; crinkle: string }> = {
    cotton100: { label: "100% Cotton Batting", shrink: 4, crinkle: "Significant — classic antique look" },
    poly100: { label: "100% Polyester Batting", shrink: 0.5, crinkle: "Minimal — smooth flat finish" },
    blend8020: { label: "80/20 Cotton/Poly Blend", shrink: 2.5, crinkle: "Moderate — subtle texture" },
    wool: { label: "100% Wool Batting", shrink: 3, crinkle: "Moderate — soft loft" },
    bamboo: { label: "Bamboo Batting", shrink: 2, crinkle: "Light — smooth drape" },
};

const relatedTools = [
    { name: "Pre-Wash Estimator", href: "/shrinkage/pre-wash-estimator", icon: Droplets },
    { name: "Pre-Washing Guide", href: "/shrinkage/pre-washing-guide", icon: BookOpen },
    { name: "Quilt Size Calculator", href: "/quilt/size-calculator", icon: Layers },
];
const faqItems = [
    { q: "How much will my quilt shrink after the first wash?", a: "With cotton batting and unwashed cotton fabric: 3-5% overall. With polyester batting: under 1%. The biggest factor is batting type, not fabric." },
    { q: "Should I pre-wash fabric before quilting?", a: "Both approaches are valid. Pre-washing: removes chemicals, prevents color bleeding, gives precise sizing. Not pre-washing: preserves sizing for easier cutting, creates beloved crinkled antique texture after washing." },
    { q: "How do I get the crinkled vintage look?", a: "Do not pre-wash any fabric. Use 100% cotton batting. Quilt with standard density. Wash the finished quilt in warm water, tumble dry medium. The crinkle develops beautifully." },
];

export default function QuiltShrinkagePage() {
    const [sizeKey, setSizeKey] = useState("throw");
    const [customW, setCustomW] = useState(""); const [customL, setCustomL] = useState("");
    const [prewashed, setPrewashed] = useState("no"); const [batting, setBatting] = useState("cotton100");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const sz = quiltSizes[sizeKey];
    const w = sizeKey === "custom" ? (parseFloat(customW) || 0) : sz.w;
    const l = sizeKey === "custom" ? (parseFloat(customL) || 0) : sz.l;
    const bat = battingData[batting];
    const fabricShrink = prewashed === "yes" ? 0.5 : 4; // already washed = minimal residual
    const totalShrink = (fabricShrink + bat.shrink) / 2;
    const postW = w * (1 - totalShrink / 100); const postL = l * (1 - totalShrink / 100);
    const hasResult = w > 0 && l > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Quilt: ${w}" x ${l}" → Post-wash: ${postW.toFixed(1)}" x ${postL.toFixed(1)}" (~${totalShrink.toFixed(1)}% shrinkage, ${bat.label})`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [w, l, postW, postL, totalShrink, bat]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Shrinkage", href: "/shrinkage" }, { label: "Quilt Shrinkage" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Layers size={14} strokeWidth={1.5} /> Shrinkage</span><h1>Quilt Shrinkage Calculator</h1><p>Estimate how much a finished quilt will shrink after the first wash.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Quilt Details</h2>
                    <div className="calculator-form">
                        <div className="input-group"><label className="input-label">Quilt Size</label><select className="input-field" value={sizeKey} onChange={e => setSizeKey(e.target.value)}><option value="baby">Baby (36x52)</option><option value="throw">Throw (50x65)</option><option value="twin">Twin (68x86)</option><option value="full">Full (86x86)</option><option value="queen">Queen (90x95)</option><option value="king">King (108x95)</option><option value="calKing">Cal King (104x100)</option><option value="custom">Custom Size</option></select></div>
                        {sizeKey === "custom" && <div className="calculator-form-row"><div className="input-group"><label className="input-label">Width (inches)</label><input type="number" className="input-field input-mono" value={customW} onChange={e => setCustomW(e.target.value)} min="1" /></div><div className="input-group"><label className="input-label">Length (inches)</label><input type="number" className="input-field input-mono" value={customL} onChange={e => setCustomL(e.target.value)} min="1" /></div></div>}
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Fabric Pre-Washed?</label><select className="input-field" value={prewashed} onChange={e => setPrewashed(e.target.value)}><option value="no">No — unwashed fabric</option><option value="yes">Yes — pre-washed</option></select></div>
                            <div className="input-group"><label className="input-label">Batting Type</label><select className="input-field" value={batting} onChange={e => setBatting(e.target.value)}>{Object.entries(battingData).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Post-Wash Size</div><div className="result-value">{postW.toFixed(1)}&quot; x {postL.toFixed(1)}&quot;</div><div className="result-label">~{totalShrink.toFixed(1)}% overall shrinkage ({(w - postW).toFixed(1)}&quot; x {(l - postL).toFixed(1)}&quot; lost)</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Original size</span><span className="result-row-value">{w}&quot; x {l}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Fabric shrinkage</span><span className="result-row-value">~{fabricShrink}%</span></div>
                            <div className="result-row"><span className="result-row-label">Batting shrinkage</span><span className="result-row-value">~{bat.shrink}%</span></div>
                            <div className="result-row"><span className="result-row-label">Crinkle effect</span><span className="result-row-value">{bat.crinkle}</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}