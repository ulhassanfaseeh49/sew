"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Layers, Copy, Printer, ChevronDown, Ruler, Circle } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Pleated", href: "/skirt/pleated", icon: Layers },
    { name: "Full Circle", href: "/skirt/full-circle", icon: Circle },
    { name: "Yardage by Style", href: "/skirt/yardage-by-style", icon: Ruler },
];
const faqItems = [
    { q: "How wide should the bottom tier be?", a: "With a 2:1 gather ratio and 3 tiers, the bottom tier is 4x the top tier width. For a 40\" hip, tier 3 could be 160\" wide -- join multiple strips." },
    { q: "Should all tiers be the same length?", a: "No. Graduated tiers look more proportional: each lower tier is 1.3-1.5x the length of the tier above." },
    { q: "Can I use different fabrics per tier?", a: "Yes -- this is a popular look. Calculate yardage separately for each tier fabric." },
];

export default function TieredPage() {
    const [hip, setHip] = useState("38"); const [totalLen, setTotalLen] = useState("24"); const [numTiers, setNumTiers] = useState("3");
    const [gatherRatio, setGatherRatio] = useState("2"); const [fabWidth, setFabWidth] = useState("60");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const h = parseFloat(hip) || 38; const tl = parseFloat(totalLen) || 24; const nt = parseInt(numTiers) || 3;
    const gr = parseFloat(gatherRatio) || 2; const fw = parseFloat(fabWidth) || 60;
    const tierLen = tl / nt;
    const hasResult = h > 0 && tl > 0 && nt > 0;

    const tiers: { tier: number; width: number; strips: number; cutLen: string; yardage: number }[] = [];
    let prevWidth = h * 1.5; // top tier = hip x 1.5 for elastic waist
    for (let i = 0; i < nt; i++) {
        const width = i === 0 ? prevWidth : prevWidth * gr;
        const strips = Math.ceil(width / fw);
        const cutLen = tierLen + (i === nt - 1 ? 2 : 1.25); // hem allowance on last tier
        tiers.push({ tier: i + 1, width: Math.round(width), strips, cutLen: cutLen.toFixed(1), yardage: (strips * cutLen / 36) });
        prevWidth = width;
    }
    const totalYardage = tiers.reduce((sum, t) => sum + t.yardage, 0);

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`${nt}-tier skirt: ${tiers.map(t => `Tier ${t.tier}: ${t.width}" wide (${t.strips} strips)`).join(", ")}. Total: ~${totalYardage.toFixed(1)} yd.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [nt, tiers, totalYardage]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Skirt Calculators", href: "/skirt" }, { label: "Tiered" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Layers size={14} strokeWidth={1.5} /> Skirt</span><h1>Tiered Skirt Calculator</h1><p>Calculate tier widths, strip counts, and yardage for multi-tier prairie skirts.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Skirt Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Hip (in)</label><input type="number" className="input-field input-mono" value={hip} onChange={e => setHip(e.target.value)} min="1" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Total Length (in)</label><input type="number" className="input-field input-mono" value={totalLen} onChange={e => setTotalLen(e.target.value)} min="1" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Number of Tiers</label><select className="input-field" value={numTiers} onChange={e => setNumTiers(e.target.value)}><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select></div>
                            <div className="input-group"><label className="input-label">Gather Ratio</label><select className="input-field" value={gatherRatio} onChange={e => setGatherRatio(e.target.value)}><option value="1.5">1.5:1 (subtle)</option><option value="2">2:1 (standard)</option><option value="2.5">2.5:1 (full)</option></select></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">{nt}-Tier Skirt</div><div className="result-value">~{totalYardage.toFixed(1)} yards total</div><div className="result-label">on {fw}&quot; fabric</div></div>
                        <div className={styles.tableWrap} style={{ marginTop: 12 }}><table className={styles.convTable}><thead><tr><th>Tier</th><th>Width</th><th>Cut Length</th><th>Strips</th><th>Yardage</th></tr></thead>
                            <tbody>{tiers.map(t => (<tr key={t.tier}><td style={{ fontWeight: 600 }}>Tier {t.tier}</td><td>{t.width}&quot;</td><td>{t.cutLen}&quot;</td><td>{t.strips}</td><td>{t.yardage.toFixed(1)} yd</td></tr>))}</tbody>
                        </table></div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}