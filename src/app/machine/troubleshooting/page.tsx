"use client";
import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, ChevronDown, Ruler, Settings } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const problems = [
    {
        symptom: "Thread bunching / bird's nest under fabric", severity: "common", causes: [
            { cause: "Upper thread not in tension discs", fix: "Rethread completely with presser foot UP. This opens the tension discs so thread seats properly.", likelihood: "Most likely" },
            { cause: "Thread not through take-up lever", fix: "Check the take-up lever — the thread must pass through it. Rethread from scratch.", likelihood: "Very common" },
            { cause: "Bobbin incorrectly inserted", fix: "Remove and reinsert bobbin, following your machine's threading direction.", likelihood: "Common" },
        ]
    },
    {
        symptom: "Skipped stitches", severity: "common", causes: [
            { cause: "Wrong needle type for fabric", fix: "Ball point for knits, Stretch for lycra, Microtex for fine wovens. Match needle to fabric.", likelihood: "Most likely" },
            { cause: "Needle dull or bent", fix: "Replace needle. Change every 6-8 hours of sewing or per project.", likelihood: "Very common" },
            { cause: "Needle not fully inserted", fix: "Push needle all the way up into clamp, tighten screw securely.", likelihood: "Common" },
        ]
    },
    {
        symptom: "Thread breaking at needle", severity: "common", causes: [
            { cause: "Thread not through all guides", fix: "Rethread from spool completely. Check every thread guide.", likelihood: "Most likely" },
            { cause: "Needle too small for thread", fix: "Size up the needle — eye must comfortably fit the thread.", likelihood: "Common" },
            { cause: "Top tension too tight", fix: "Decrease tension dial by 1-2 numbers.", likelihood: "Common" },
        ]
    },
    {
        symptom: "Needle keeps breaking", severity: "urgent", causes: [
            { cause: "Hitting a pin while sewing", fix: "Remove pins before they reach the needle. Never sew over pins.", likelihood: "Most likely" },
            { cause: "Needle too small for fabric", fix: "Use larger needle — it deflects less on thick fabric.", likelihood: "Common" },
            { cause: "Wrong presser foot installed", fix: "Check foot compatibility, needle shouldn't hit foot.", likelihood: "Possible" },
        ]
    },
    {
        symptom: "Seam puckering", severity: "common", causes: [
            { cause: "Stitch length too short", fix: "Increase by 0.5mm. Lightweight fabrics need 1.5-2.0mm minimum.", likelihood: "Most likely" },
            { cause: "Top tension too tight", fix: "Decrease by 1 number on dial.", likelihood: "Common" },
            { cause: "Wrong needle for lightweight fabric", fix: "Use Microtex 60/8-70/10 for fine fabrics.", likelihood: "Possible" },
        ]
    },
    {
        symptom: "Fabric not feeding", severity: "check", causes: [
            { cause: "Feed dogs lowered", fix: "Check and raise feed dogs. They must be up for standard sewing.", likelihood: "Most likely" },
            { cause: "Stitch length set to 0", fix: "Increase stitch length above 0.", likelihood: "Common" },
            { cause: "Lint clogging feed dogs", fix: "Clean lint from feed dogs and bobbin area.", likelihood: "Common" },
        ]
    },
    {
        symptom: "Machine making unusual noise", severity: "urgent", causes: [
            { cause: "Bent needle hitting throat plate", fix: "Replace needle immediately.", likelihood: "Most likely" },
            { cause: "Lint buildup", fix: "Clean bobbin area thoroughly.", likelihood: "Common" },
            { cause: "Machine needs oiling", fix: "Oil if oil-type machine. Check manual for locations.", likelihood: "Possible" },
            { cause: "Timing issue", fix: "If grinding/knocking persists after cleaning, seek professional service.", likelihood: "Pro service" },
        ]
    },
];

const quickFix = [
    "Change the needle — solves 30% of all machine problems",
    "Rethread completely from scratch with presser foot UP",
    "Check and reinsert bobbin correctly",
    "Clean lint from bobbin area and feed dogs",
    "Check tension settings (default: 4-5)",
];

const relatedTools = [
    { name: "Tension Guide", href: "/machine/tension-guide", icon: Settings },
    { name: "Needle by Fabric", href: "/needles-thread/needle-by-fabric", icon: Ruler },
    { name: "Stitch Length Calculator", href: "/machine/stitch-length", icon: Ruler },
];

const faqItems = [
    { q: "My machine is doing everything wrong. Where do I start?", a: "Start with the 5-step emergency fix: 1) New needle, 2) Rethread with foot UP, 3) Reinsert bobbin, 4) Clean lint, 5) Reset tension to 4-5. This fixes 80% of problems." },
    { q: "When should I take my machine for service?", a: "If cleaning, rethreading, and new needle don't fix it. Also: grinding/knocking sounds, timing issues, needle bar problems, electrical issues. Annual service recommended for regular sewists." },
    { q: "How often should I clean my machine?", a: "Every 8-10 hours of sewing. Use the small brush from your machine kit. Clean lint from bobbin area and feed dogs. Never use compressed air inside the machine." },
];

export default function TroubleshootingPage() {
    const [activeProblem, setActiveProblem] = useState<number | null>(null);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Machine Tools", href: "/machine" }, { label: "Troubleshooting" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><AlertTriangle size={14} strokeWidth={1.5} /> Sewing Machine Tool</span>
                        <h1>Machine Troubleshooting Tool</h1>
                        <p>Interactive diagnostic for all common sewing machine problems with step-by-step fixes.</p>
                    </div>
                    <div className="calculator-card" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                        <h2 style={{ fontSize: "var(--text-base)", fontWeight: 600, marginBottom: 8, color: "#166534" }}>Try This First — 5-Step Emergency Fix</h2>
                        <ol style={{ fontSize: "var(--text-sm)", color: "#166534", paddingLeft: 20, lineHeight: 2 }}>
                            {quickFix.map((step, i) => <li key={i}>{step}</li>)}
                        </ol>
                    </div>
                    {problems.map((p, pi) => (
                        <div key={pi} className="calculator-card" style={{ cursor: "pointer" }} onClick={() => setActiveProblem(activeProblem === pi ? null : pi)}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h3 style={{ fontSize: "var(--text-base)", fontWeight: 600 }}>{p.symptom}</h3>
                                <ChevronDown size={16} style={{ transform: activeProblem === pi ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                            </div>
                            {activeProblem === pi && (
                                <div style={{ marginTop: 16 }}>
                                    {p.causes.map((c, ci) => (
                                        <div key={ci} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: ci < p.causes.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                                <span style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>{c.cause}</span>
                                                <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: c.likelihood === "Most likely" ? "#dcfce7" : c.likelihood === "Pro service" ? "#fef2f2" : "#f5f3ff", color: c.likelihood === "Most likely" ? "#166534" : c.likelihood === "Pro service" ? "#991b1b" : "#5b21b6" }}>{c.likelihood}</span>
                                            </div>
                                            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>{c.fix}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside>
            </div>
        </div>
    );
}