"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { CheckCircle, Copy, Printer, ChevronDown, BarChart3, Ruler, Info } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Stretch % Calculator", href: "/stretch/percentage-calculator", icon: BarChart3 },
    { name: "Negative Ease Calculator", href: "/stretch/negative-ease", icon: Ruler },
    { name: "Stretch Direction Guide", href: "/stretch/stretch-direction-guide", icon: Info },
];

const faqItems = [
    { q: "Where do I find the pattern's stretch requirement?", a: "Check the pattern envelope back, fabric suggestions page, or the stretch gauge printed on the pattern tissue. It's usually a ruler showing how far 4 inches should stretch." },
    { q: "What if my fabric is close but not quite enough?", a: "If within 5% of the requirement, you may be able to size up. If more than 10% short, choose a different fabric or pattern." },
    { q: "Do all knit patterns require stretch?", a: "Most do, but some designs labeled 'knit' are loose-fitting and need only minimal stretch (10-15%). Always check the specific pattern's requirement." },
];

export default function PatternRequirementPage() {
    const [required, setRequired] = useState("");
    const [actual, setActual] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const req = parseFloat(required) || 0;
    const act = parseFloat(actual) || 0;
    const diff = act - req;
    const passes = act >= req;
    const hasResult = req > 0 && act > 0;

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(`Pattern requires ${req}% stretch. Your fabric: ${act}% — ${passes ? "PASS" : "FAIL"}`);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    }, [req, act, passes]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Stretch Tools", href: "/stretch" }, { label: "Pattern Requirement" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><CheckCircle size={14} strokeWidth={1.5} /> Stretch Tool</span>
                        <h1>Pattern Stretch Requirement Checker</h1>
                        <p>Verify your fabric meets a pattern&apos;s minimum stretch requirement before cutting.</p>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.calcTitle}>Stretch Check</h2>
                        <div className="calculator-form">
                            <div className="calculator-form-row">
                                <div className="input-group"><label className="input-label">Pattern Requires (%)</label><input type="number" className="input-field input-mono" placeholder="e.g., 25" value={required} onChange={e => setRequired(e.target.value)} min="0" step="5" /></div>
                                <div className="input-group"><label className="input-label">Your Fabric Stretch (%)</label><input type="number" className="input-field input-mono" placeholder="e.g., 50" value={actual} onChange={e => setActual(e.target.value)} min="0" step="5" /></div>
                            </div>
                        </div>
                        {hasResult && (
                            <div>
                                <div className="calculator-divider" />
                                <div className="result-card" style={{ borderColor: passes ? "#22c55e" : "#ef4444", borderWidth: 2 }}>
                                    <div className="result-prefix" style={{ color: passes ? "#22c55e" : "#ef4444" }}>{passes ? "PASS" : "FAIL"}</div>
                                    <div className="result-value">{act}% vs {req}%</div>
                                    <div className="result-label">{passes ? `${diff.toFixed(0)}% above minimum — safe to use` : `${Math.abs(diff).toFixed(0)}% short — do NOT use this fabric`}</div>
                                </div>
                                <div className="toolbar" style={{ marginTop: 16 }}>
                                    <button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button>
                                    <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside>
            </div>
        </div>
    );
}