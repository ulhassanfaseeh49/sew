"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Scissors, Copy, Printer, ChevronDown, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const projectPresets: Record<string, number> = { "T-shirt / knit top": 800, "Woven blouse": 1200, "Simple dress": 1800, "Lined dress": 2500, "Pants / trousers": 1400, "Simple skirt": 900, "Jacket (unlined)": 2000, "Jacket (lined)": 3000, "Coat": 4000, "Tote bag": 600, "Pillow cover": 400, "Curtain panel": 500, "Custom": 0 };
const stitchMultipliers: Record<string, number> = { "Straight stitch": 1, "Zigzag stitch": 1.3, "Overlock (3-thread)": 3.2, "Overlock (4-thread)": 4.2, "Coverstitch (2-needle)": 3.5, "Blind hem": 1.1, "Stretch stitch": 1.5 };
const relatedTools = [
    { name: "Bobbin Thread", href: "/notions/bobbin-thread", icon: Scissors },
    { name: "Thread Weight", href: "/notions/thread-weight-comparison", icon: Ruler },
    { name: "Thread by Fabric", href: "/needles-thread/thread-by-fabric", icon: Scissors },
];
const faqItems = [
    { q: "How much thread does a typical garment use?", a: "A simple blouse uses about 1,200 inches (~33 yards). A lined jacket can use over 3,000 inches (~83 yards). Serged seams use 3-4x more thread than straight stitching." },
    { q: "Does stitch length affect thread consumption?", a: "Yes. Shorter stitches use more thread per inch. A 2.0mm stitch uses about 25% more thread than a 3.0mm stitch over the same seam length." },
    { q: "How much extra should I buy as a safety buffer?", a: "Add 20% for beginners, 10% for experienced sewists. This accounts for test seams, re-sewing, and bobbin winding waste." },
];

export default function ThreadYardagePage() {
    const [project, setProject] = useState("Woven blouse");
    const [seamLength, setSeamLength] = useState(""); const [stitchType, setStitchType] = useState("Straight stitch");
    const [buffer, setBuffer] = useState("20");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const baseLen = project === "Custom" ? (parseFloat(seamLength) || 0) : projectPresets[project];
    const mult = stitchMultipliers[stitchType] || 1;
    const bufPct = parseFloat(buffer) || 0;
    const topThread = baseLen * mult;
    const bobThread = topThread * 0.65;
    const totalRaw = topThread + bobThread;
    const totalBuf = totalRaw * (1 + bufPct / 100);
    const hasResult = baseLen > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Thread: ~${(totalBuf / 36).toFixed(0)} yards total (${(topThread / 36).toFixed(0)} yd top + ${(bobThread / 36).toFixed(0)} yd bobbin, +${bufPct}% buffer)`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [totalBuf, topThread, bobThread, bufPct]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Notions", href: "/notions" }, { label: "Thread Yardage Estimator" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} strokeWidth={1.5} /> Notions</span><h1>Thread Yardage Estimator</h1><p>Estimate total thread needed for any sewing project based on seam length and stitch type.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Project Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Project Type</label><select className="input-field" value={project} onChange={e => setProject(e.target.value)}>{Object.keys(projectPresets).map(p => (<option key={p} value={p}>{p}</option>))}</select></div>
                            <div className="input-group"><label className="input-label">Stitch Type</label><select className="input-field" value={stitchType} onChange={e => setStitchType(e.target.value)}>{Object.keys(stitchMultipliers).map(s => (<option key={s} value={s}>{s}</option>))}</select></div>
                        </div>
                        {project === "Custom" && <div className="input-group"><label className="input-label">Total Seam Length (in)</label><input type="number" className="input-field input-mono" value={seamLength} onChange={e => setSeamLength(e.target.value)} min="1" /></div>}
                        <div className="input-group"><label className="input-label">Safety Buffer (%)</label><select className="input-field" value={buffer} onChange={e => setBuffer(e.target.value)}><option value="0">0% (exact)</option><option value="10">10% (experienced)</option><option value="20">20% (recommended)</option><option value="30">30% (generous)</option></select></div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Total Thread Needed</div><div className="result-value">~{(totalBuf / 36).toFixed(0)} yards</div><div className="result-label">With {bufPct}% safety buffer</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Top/needle thread</span><span className="result-row-value">~{(topThread / 36).toFixed(0)} yd</span></div>
                            <div className="result-row"><span className="result-row-label">Bobbin thread</span><span className="result-row-value">~{(bobThread / 36).toFixed(0)} yd</span></div>
                            <div className="result-row"><span className="result-row-label">Standard spool (500 yd)</span><span className="result-row-value">{totalBuf / 36 <= 500 ? "Sufficient" : "Need 2+ spools"}</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}