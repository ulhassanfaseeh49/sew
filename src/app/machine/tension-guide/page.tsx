"use client";
import { useState } from "react";
import Link from "next/link";
import { Settings, ChevronDown, Ruler, AlertTriangle } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const tensionRecs = [
    { combo: "Standard cotton/polyester", tension: "4–5", dir: "Standard" },
    { combo: "Lightweight fabric", tension: "3–4", dir: "Slightly lower" },
    { combo: "Heavy fabric", tension: "5–6", dir: "Slightly higher" },
    { combo: "Metallic thread", tension: "2–3", dir: "Lower significantly" },
    { combo: "Monofilament", tension: "2–3", dir: "Lower" },
    { combo: "Thick thread (12wt, 30wt)", tension: "3–4", dir: "Lower" },
    { combo: "Fine thread (60wt, 80wt)", tension: "4–5", dir: "Standard" },
    { combo: "Satin stitch / appliqué", tension: "2–3", dir: "Lower (pull to underside)" },
    { combo: "Quilting", tension: "4–5", dir: "Standard" },
    { combo: "Knit seams", tension: "3.5–4.5", dir: "Slightly lower" },
];

const problems = [
    { symptom: "Loops on bottom of fabric", cause: "Upper thread NOT through tension discs", fix: "Rethread completely with presser foot UP (opens tension discs). Check thread is through ALL guides including take-up lever." },
    { symptom: "Loops on top of fabric", cause: "Bobbin tension issue", fix: "Check bobbin is correctly inserted and threaded through bobbin case tension spring. If problem persists, loosen upper tension by 1 number." },
    { symptom: "Seam puckering", cause: "Stitch too short + tension too tight", fix: "Increase stitch length by 0.5mm first. If still puckering, decrease tension by 1. Use stabilizer on very light fabrics." },
    { symptom: "Thread breaking at needle", cause: "Tension too tight or needle issue", fix: "Check needle (bent? correct size?). Loosen tension by 1-2 numbers. Check threading path. Try fresh needle." },
    { symptom: "Bird's nest under fabric", cause: "Upper thread not in tension discs", fix: "Most common problem! Rethread with presser foot UP. Must be threaded through every guide and take-up lever." },
    { symptom: "Stitches skipping", cause: "Usually needle, not tension", fix: "Change needle first (correct type for fabric). If ball point for knits, stretch for lycra. Check needle is fully inserted." },
];

const relatedTools = [
    { name: "Stitch Length Calculator", href: "/machine/stitch-length", icon: Ruler },
    { name: "Troubleshooting", href: "/machine/troubleshooting", icon: AlertTriangle },
    { name: "Needle by Fabric", href: "/needles-thread/needle-by-fabric", icon: Ruler },
];

const faqItems = [
    { q: "What should tension be set to normally?", a: "Most machines: 4-5 on the dial (middle position). This is the default for standard cotton/polyester thread with medium-weight woven fabric. Always test on scrap first." },
    { q: "Should I adjust bobbin tension?", a: "Rarely! Bobbin tension is set at the factory and almost never needs adjustment. 95% of tension problems are solved by rethreading the upper thread correctly or adjusting the upper tension dial." },
    { q: "How do I adjust tension systematically?", a: "Rule: adjust ONE number at a time. Sew test seam, check top and bottom. If loops on bottom, increase upper tension by 1. If loops on top, decrease by 1. Repeat until even." },
];

export default function TensionGuidePage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Machine Tools", href: "/machine" }, { label: "Tension Guide" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Settings size={14} strokeWidth={1.5} /> Sewing Machine Tool</span>
                        <h1>Tension Guide by Fabric</h1>
                        <p>Interactive guide for tension settings by fabric, thread, and stitch type with visual diagnostics.</p>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.sectionTitle}>Tension Recommendations</h2>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead><tr><th>Fabric / Thread</th><th>Tension</th><th>Direction</th></tr></thead>
                                <tbody>{tensionRecs.map(t => (<tr key={t.combo}><td style={{ fontFamily: "inherit", fontWeight: 500 }}>{t.combo}</td><td style={{ fontWeight: 600 }}>{t.tension}</td><td style={{ fontFamily: "inherit", color: t.dir === "Standard" ? "var(--color-accent)" : "inherit" }}>{t.dir}</td></tr>))}</tbody>
                            </table>
                        </div>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.sectionTitle}>Problem Diagnosis</h2>
                        {problems.map(p => (
                            <div key={p.symptom} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid var(--color-border)" }}>
                                <h3 style={{ fontSize: "var(--text-base)", fontWeight: 600, marginBottom: 4 }}>{p.symptom}</h3>
                                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginBottom: 4 }}>Likely cause: {p.cause}</p>
                                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-accent)", fontWeight: 500 }}>{p.fix}</p>
                            </div>
                        ))}
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.sectionTitle}>Step-by-Step Adjustment</h2>
                        <ol style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", paddingLeft: 20, lineHeight: 2 }}>
                            <li>Sew a test seam on the same fabric + thread to be used</li>
                            <li>Examine BOTH top and bottom of seam</li>
                            <li>If loops on bottom → upper tension too LOOSE → increase by 1</li>
                            <li>If loops on top → upper tension too TIGHT → decrease by 1</li>
                            <li>Sew another test seam</li>
                            <li>Repeat until both sides look identical</li>
                            <li>Never adjust more than 1 number at a time</li>
                        </ol>
                    </div>
                    <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside>
            </div>
        </div>
    );
}