"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Clock, Copy, Printer, ChevronDown, Ruler, DollarSign } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const projectTimes: Record<string, { min: number; max: number; label: string }> = {
    tote: { min: 45, max: 90, label: "Simple tote bag" }, pillowcase: { min: 30, max: 60, label: "Pillowcase" },
    skirt: { min: 60, max: 120, label: "Simple skirt (elastic waist)" }, blouse: { min: 120, max: 240, label: "Simple blouse" },
    pants: { min: 180, max: 300, label: "Pants (simple)" }, dress: { min: 180, max: 300, label: "A-line dress" },
    shirt: { min: 240, max: 480, label: "Button-up shirt" }, jacket: { min: 480, max: 900, label: "Lined jacket" },
    coat: { min: 600, max: 1200, label: "Coat" }, quilt: { min: 900, max: 1800, label: "Basic quilt (twin)" },
    babyquilt: { min: 240, max: 480, label: "Baby quilt" }, costume: { min: 180, max: 360, label: "Costume (simple)" },
    costumeAdv: { min: 600, max: 1200, label: "Costume (complex)" },
};

const skillMult: Record<string, { label: string; mult: number }> = {
    beginner: { label: "Complete beginner", mult: 3 }, inter: { label: "Beginner", mult: 2 },
    standard: { label: "Intermediate", mult: 1 }, advanced: { label: "Advanced", mult: 0.75 },
    pro: { label: "Professional", mult: 0.5 },
};

const relatedTools = [
    { name: "Project Time Estimator", href: "/machine/project-time", icon: Clock },
    { name: "Stitch Length Calculator", href: "/machine/stitch-length", icon: Ruler },
    { name: "Pricing Calculator", href: "/pricing", icon: DollarSign },
];

const faqItems = [
    { q: "Why do projects take so long?", a: "Real sewing speed is much slower than machine speed. Stopped for positioning, pinning, adjusting, pressing, and re-threading. Actual seam rate: 1-3 yards/minute for experienced sewists." },
    { q: "How do I sew faster?", a: "Batch similar steps (all seams first, then pressing). Pre-pin everything. Use chain piecing for quilts. Have tools organized and within reach. Experience is the biggest factor." },
    { q: "How should I price my sewing time?", a: "Track actual time for a project, multiply by your hourly rate. Include ALL time — not just machine sewing. Cutting, pressing, and fitting often take as long as sewing." },
];

export default function SpeedEstimatorPage() {
    const [project, setProject] = useState("dress");
    const [skill, setSkill] = useState("standard");
    const [rate, setRate] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const pt = projectTimes[project];
    const sm = skillMult[skill].mult;
    const minMin = Math.round(pt.min * (sm / 1));
    const maxMin = Math.round(pt.max * (sm / 1));

    const formatTime = (mins: number) => {
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    const hrRate = parseFloat(rate) || 0;
    const laborMin = hrRate > 0 ? ((minMin / 60) * hrRate).toFixed(0) : "";
    const laborMax = hrRate > 0 ? ((maxMin / 60) * hrRate).toFixed(0) : "";

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(`${pt.label}: ${formatTime(minMin)} – ${formatTime(maxMin)} (${skillMult[skill].label})`);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    }, [pt, minMin, maxMin, skill]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Machine Tools", href: "/machine" }, { label: "Speed Estimator" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Clock size={14} strokeWidth={1.5} /> Sewing Machine Tool</span>
                        <h1>Sewing Speed Estimator</h1>
                        <p>Estimate sewing time for any project based on type and skill level. Plan schedules and pricing.</p>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.calcTitle}>Estimate Time</h2>
                        <div className="calculator-form">
                            <div className="input-group">
                                <label className="input-label">Project Type</label>
                                <select className="input-field" value={project} onChange={e => setProject(e.target.value)}>
                                    {Object.entries(projectTimes).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                                </select>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Skill Level</label>
                                <select className="input-field" value={skill} onChange={e => setSkill(e.target.value)}>
                                    {Object.entries(skillMult).map(([k, v]) => <option key={k} value={k}>{v.label} ({v.mult}x)</option>)}
                                </select>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Hourly Rate (optional, for pricing)</label>
                                <input type="number" className="input-field input-mono" placeholder="e.g., 25" value={rate} onChange={e => setRate(e.target.value)} min="0" step="1" />
                            </div>
                        </div>
                        <div className="calculator-divider" />
                        <div className="result-card">
                            <div className="result-prefix">Estimated Sewing Time</div>
                            <div className="result-value">{formatTime(minMin)} – {formatTime(maxMin)}</div>
                            <div className="result-label">{pt.label} at {skillMult[skill].label} level</div>
                        </div>
                        <div className={styles.resultDetails} style={{ marginTop: 16 }}>
                            <div className="result-row"><span className="result-row-label">2-hour sessions</span><span className="result-row-value">{Math.ceil(minMin / 120)}–{Math.ceil(maxMin / 120)} sessions</span></div>
                            <div className="result-row"><span className="result-row-label">Full day (8 hrs)</span><span className="result-row-value">{Math.ceil(minMin / 480)}–{Math.ceil(maxMin / 480)} days</span></div>
                            {hrRate > 0 && <div className="result-row"><span className="result-row-label">Labor cost</span><span className="result-row-value">${laborMin}–${laborMax}</span></div>}
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}>
                            <button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button>
                            <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button>
                        </div>
                    </div>
                    <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside>
            </div>
        </div>
    );
}