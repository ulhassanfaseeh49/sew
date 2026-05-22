"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Ruler, Copy, Printer, ChevronDown, Settings, BarChart3 } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const fabrics: Record<string, { label: string; group: string }> = {
    ultralight: { label: "Chiffon, organza, voile, batiste", group: "Ultra-lightweight" },
    light: { label: "Lawn, georgette, crepe de chine", group: "Lightweight woven" },
    medlight: { label: "Quilting cotton, shirting, chambray", group: "Medium-light woven" },
    medium: { label: "Poplin, linen, twill, flannel", group: "Medium woven" },
    medheavy: { label: "Denim shirting, corduroy", group: "Medium-heavy woven" },
    heavy: { label: "Denim, canvas, duck cloth", group: "Heavy woven" },
    vheavy: { label: "Multiple layers, heavy canvas, leather", group: "Very heavy" },
    lightknit: { label: "Fine jersey, lightweight interlock", group: "Light knit" },
    medknit: { label: "Standard jersey, interlock, ponte", group: "Medium knit" },
    heavyknit: { label: "Heavy ponte, scuba, double knit", group: "Heavy knit" },
    stretch: { label: "Swimwear, activewear, lycra", group: "High-stretch knit" },
    fleece: { label: "Fleece", group: "Fleece" },
    leather: { label: "Leather, faux leather, vinyl", group: "Leather/Vinyl" },
};

const applications: Record<string, string> = {
    seam: "Construction seam", topstitch: "Topstitching (decorative)", understitch: "Understitching",
    edgestitch: "Edge stitching", basting: "Basting (temporary)", gathering: "Gathering",
    staystitch: "Stay stitching", quilting: "Quilting", reinforce: "Reinforcement", blindhem: "Blind hem",
};

function getRecommendation(fabric: string, app: string): { mm: string; spi: string; min: string; max: string; notes: string } {
    const base: Record<string, number> = { ultralight: 1.8, light: 2.0, medlight: 2.5, medium: 2.5, medheavy: 3.0, heavy: 3.0, vheavy: 3.5, lightknit: 2.5, medknit: 2.5, heavyknit: 3.0, stretch: 2.5, fleece: 3.0, leather: 3.5 };
    const appMod: Record<string, number> = { seam: 0, topstitch: 0.5, understitch: -0.5, edgestitch: -0.3, basting: 2.0, gathering: 1.5, staystitch: -0.3, quilting: 0, reinforce: -0.5, blindhem: 0 };
    const b = base[fabric] || 2.5;
    const m = appMod[app] || 0;
    const rec = Math.max(0.5, Math.min(6.0, b + m));
    const spi = (25.4 / rec).toFixed(1);
    const min = Math.max(0.5, rec - 0.5).toFixed(1);
    const max = Math.min(6.0, rec + 0.5).toFixed(1);
    const notes = app === "basting" ? "Use longest stitch for easy removal" : app === "gathering" ? "Two rows of stitching for better control" : app === "reinforce" ? "Shorter stitch for stress points" : fabric === "leather" ? "Choose correctly first time — holes are permanent" : "";
    return { mm: rec.toFixed(1), spi, min, max, notes };
}

const refTable = [
    { app: "Standard seam", weight: "Ultra-light", mm: "1.5–2.0", spi: "12–17" },
    { app: "Standard seam", weight: "Lightweight", mm: "2.0–2.5", spi: "10–12" },
    { app: "Standard seam", weight: "Medium", mm: "2.5", spi: "10" },
    { app: "Standard seam", weight: "Heavy", mm: "3.0–3.5", spi: "7–8" },
    { app: "Topstitching", weight: "Any", mm: "3.0–3.5", spi: "7–8" },
    { app: "Basting", weight: "Any", mm: "4.0–6.0", spi: "4–6" },
    { app: "Gathering", weight: "Any", mm: "4.0–5.0", spi: "5–6" },
    { app: "Quilting", weight: "Cotton layers", mm: "2.5–3.0", spi: "8–10" },
    { app: "Knit seam", weight: "Light-medium", mm: "2.5–3.0", spi: "8–10" },
    { app: "Stay stitch", weight: "Any", mm: "2.0–2.5", spi: "10–12" },
    { app: "Reinforcement", weight: "Any", mm: "1.5–2.0", spi: "12–17" },
    { app: "Leather", weight: "Leather", mm: "3.0–4.0", spi: "6–8" },
    { app: "Denim topstitch", weight: "Heavy", mm: "3.0–3.5", spi: "7–8" },
];

const relatedTools = [
    { name: "Stitch Width Guide", href: "/machine/stitch-width", icon: Ruler },
    { name: "SPI Calculator", href: "/machine/spi-calculator", icon: BarChart3 },
    { name: "Tension Guide", href: "/machine/tension-guide", icon: Settings },
];

const faqItems = [
    { q: "What stitch length for most sewing?", a: "2.5mm (10 SPI) is the universal default for medium-weight fabric construction seams. This balances strength, speed, and thread consumption." },
    { q: "Why is my fabric puckering?", a: "Stitch length is probably too short for your fabric. Try increasing by 0.5mm. Lightweight fabrics need 1.5–2.0mm minimum to avoid the 'paper doll' perforation effect." },
    { q: "What does SPI mean?", a: "Stitches Per Inch — the older American measurement system. Formula: SPI = 25.4 ÷ stitch length (mm). Modern machines use mm; vintage machines often use SPI." },
];

export default function StitchLengthPage() {
    const [fabric, setFabric] = useState("medlight");
    const [app, setApp] = useState("seam");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const rec = getRecommendation(fabric, app);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(`Stitch length: ${rec.mm}mm (${rec.spi} SPI) for ${fabrics[fabric].group} / ${applications[app]}`);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    }, [rec, fabric, app]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Machine Tools", href: "/machine" }, { label: "Stitch Length" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Sewing Machine Tool</span>
                        <h1>Stitch Length Calculator</h1>
                        <p>Find the optimal stitch length for any fabric and application with SPI conversion and reference table.</p>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.calcTitle}>Find Recommended Stitch Length</h2>
                        <div className="calculator-form">
                            <div className="input-group">
                                <label className="input-label">Fabric Type</label>
                                <select className="input-field" value={fabric} onChange={e => setFabric(e.target.value)}>
                                    {Object.entries(fabrics).map(([k, v]) => <option key={k} value={k}>{v.group} — {v.label}</option>)}
                                </select>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Application</label>
                                <select className="input-field" value={app} onChange={e => setApp(e.target.value)}>
                                    {Object.entries(applications).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="calculator-divider" />
                        <div className="result-card">
                            <div className="result-prefix">Recommended Stitch Length</div>
                            <div className="result-value">{rec.mm}mm</div>
                            <div className="result-label">{rec.spi} stitches per inch</div>
                        </div>
                        <div className={styles.resultDetails} style={{ marginTop: 16 }}>
                            <div className="result-row"><span className="result-row-label">Minimum acceptable</span><span className="result-row-value">{rec.min}mm</span></div>
                            <div className="result-row"><span className="result-row-label">Recommended</span><span className="result-row-value">{rec.mm}mm</span></div>
                            <div className="result-row"><span className="result-row-label">Maximum acceptable</span><span className="result-row-value">{rec.max}mm</span></div>
                            {rec.notes && <div className="result-row"><span className="result-row-label">Note</span><span className="result-row-value" style={{ fontFamily: "inherit" }}>{rec.notes}</span></div>}
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}>
                            <button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button>
                            <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button>
                        </div>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.sectionTitle}>Stitch Length Reference Table</h2>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead><tr><th>Application</th><th>Weight</th><th>Length (mm)</th><th>SPI</th></tr></thead>
                                <tbody>{refTable.map((r, i) => (<tr key={i}><td style={{ fontFamily: "inherit", fontWeight: 500 }}>{r.app}</td><td style={{ fontFamily: "inherit" }}>{r.weight}</td><td>{r.mm}</td><td>{r.spi}</td></tr>))}</tbody>
                            </table>
                        </div>
                    </div>
                    <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside>
            </div>
        </div>
    );
}