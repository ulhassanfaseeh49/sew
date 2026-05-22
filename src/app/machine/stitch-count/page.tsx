"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Hash, Copy, Printer, ChevronDown, Ruler, Clock } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const stitchMult: Record<string, { label: string; mult: number }> = {
    straight: { label: "Straight stitch", mult: 1 }, zigzag: { label: "Zigzag", mult: 1.4 },
    threestep: { label: "Three-step zigzag", mult: 1.5 }, stretch: { label: "Stretch stitch", mult: 1.6 },
    satin: { label: "Satin stitch (dense)", mult: 15 },
};

const embRef = [
    { design: "Small monogram (1\" tall)", stitches: "2,000–5,000" },
    { design: "Medium logo (3\" x 3\")", stitches: "5,000–15,000" },
    { design: "Large complex (5\" x 7\")", stitches: "15,000–50,000" },
    { design: "Very dense large design", stitches: "50,000–100,000+" },
];

const relatedTools = [
    { name: "Stitch Length Calculator", href: "/machine/stitch-length", icon: Ruler },
    { name: "Speed Estimator", href: "/machine/speed-estimator", icon: Clock },
    { name: "SPI Calculator", href: "/machine/spi-calculator", icon: Hash },
];

const faqItems = [
    { q: "How do I estimate embroidery thread usage?", a: "A rough guide: 1,000 stitches uses about 5-7 yards of thread. A 10,000-stitch design needs roughly 50-70 yards. Dense fill uses more; running stitch uses less." },
    { q: "How long does embroidery take?", a: "Home embroidery machines run at 400-800 SPM. A 10,000-stitch design takes 12-25 minutes of machine time. Add setup time: hooping, thread changes, and positioning." },
    { q: "Why does stitch count matter for pricing?", a: "More stitches = more thread + more machine time + more bobbin changes. Embroidery digitizers often price per 1,000 stitches for this reason." },
];

export default function StitchCountPage() {
    const [seamLength, setSeam] = useState("");
    const [stitchLength, setStitch] = useState("2.5");
    const [stitchType, setType] = useState("straight");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const sl = parseFloat(seamLength) || 0;
    const stl = parseFloat(stitchLength) || 2.5;
    const mult = stitchMult[stitchType].mult;
    const seamMM = sl * 25.4;
    const count = Math.round((seamMM / stl) * mult);
    const threadYards = Math.round(count * 0.006);
    const hasResult = sl > 0;

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(`Stitch count: ${count.toLocaleString()} stitches (${threadYards} yards thread)`);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    }, [count, threadYards]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Machine Tools", href: "/machine" }, { label: "Stitch Count" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Hash size={14} strokeWidth={1.5} /> Sewing Machine Tool</span>
                        <h1>Stitch Count Estimator</h1>
                        <p>Estimate total stitch count for seams or embroidery — useful for thread consumption and pricing.</p>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.calcTitle}>From Seam Length</h2>
                        <div className="calculator-form">
                            <div className="input-group"><label className="input-label">Seam Length (inches)</label><input type="number" className="input-field input-mono" placeholder="e.g., 36" value={seamLength} onChange={e => setSeam(e.target.value)} min="0" step="0.5" /></div>
                            <div className="calculator-form-row">
                                <div className="input-group"><label className="input-label">Stitch Length (mm)</label><input type="number" className="input-field input-mono" value={stitchLength} onChange={e => setStitch(e.target.value)} min="0.3" step="0.1" /></div>
                                <div className="input-group"><label className="input-label">Stitch Type</label><select className="input-field" value={stitchType} onChange={e => setType(e.target.value)}>{Object.entries(stitchMult).map(([k, v]) => <option key={k} value={k}>{v.label} ({v.mult}x)</option>)}</select></div>
                            </div>
                        </div>
                        {hasResult && (
                            <div><div className="calculator-divider" />
                                <div className="result-card"><div className="result-prefix">Estimated Stitch Count</div><div className="result-value">{count.toLocaleString()}</div><div className="result-label">stitches</div></div>
                                <div className={styles.resultDetails} style={{ marginTop: 16 }}>
                                    <div className="result-row"><span className="result-row-label">Thread consumption</span><span className="result-row-value">~{threadYards} yards</span></div>
                                    <div className="result-row"><span className="result-row-label">Bobbin changes</span><span className="result-row-value">~{Math.ceil(count / 3000)}</span></div>
                                </div>
                                <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                            </div>
                        )}
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.sectionTitle}>Embroidery Stitch Count Reference</h2>
                        <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Design</th><th>Typical Stitch Count</th></tr></thead><tbody>{embRef.map(e => (<tr key={e.design}><td style={{ fontFamily: "inherit", fontWeight: 500 }}>{e.design}</td><td>{e.stitches}</td></tr>))}</tbody></table></div>
                    </div>
                    <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside>
            </div>
        </div>
    );
}