"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Sparkles, Copy, Printer, ChevronDown, Spline, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const trimTypes: Record<string, string> = { "Rickrack": "Flat zigzag", "Piping": "Covered cord", "Braid": "Flat or round", "Fringe": "Hanging strands", "Pom-pom trim": "Ball trim", "Tassel trim": "Tassel drops", "Beaded trim": "Bead strand", "Sequin trim": "Sequins", "Eyelet trim": "Cut-work", "Cording": "Decorative" };
const relatedTools = [
    { name: "Lace Calculator", href: "/notions/lace-calculator", icon: Spline },
    { name: "Ribbon Calculator", href: "/notions/ribbon-calculator", icon: Ruler },
    { name: "Thread Yardage", href: "/notions/thread-yardage", icon: Ruler },
];
const faqItems = [
    { q: "How much extra trim for mitered corners?", a: "Add 2-3\" of trim per corner for mitering. Square corners need slightly more than rounded corners." },
    { q: "Should I buy extra trim?", a: "Always add 5% safety margin. Trim that is discontinued or from a special dye lot cannot be reordered to match." },
    { q: "How do I join trim ends?", a: "Overlap by 1/2\" and stitch. For piping: open the covering fabric, trim the cord, and re-stitch smoothly. For rickrack: overlap at a peak." },
];

export default function TrimCalcPage() {
    const [edgeLen, setEdgeLen] = useState("60"); const [trimType, setTrimType] = useState("Rickrack");
    const [fullness, setFullness] = useState("1"); const [corners, setCorners] = useState("0"); const [qty, setQty] = useState("1");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const el = parseFloat(edgeLen) || 0; const f = parseFloat(fullness) || 1;
    const c = parseInt(corners) || 0; const q = parseInt(qty) || 1;
    const baseLen = el * f; const cornerExtra = c * 3; const join = 4;
    const perItem = baseLen + cornerExtra + join;
    const total = perItem * q; const safety = total * 1.05;
    const totalYards = safety / 36;
    const hasResult = el > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`${trimType} trim: ~${totalYards.toFixed(1)} yards (${q} x ${perItem.toFixed(0)}" + 5% safety).`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [trimType, totalYards, q, perItem]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Notions", href: "/notions" }, { label: "Trim Calculator" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Sparkles size={14} strokeWidth={1.5} /> Notions</span><h1>Trim Yardage Calculator</h1><p>Calculate yardage for any decorative trim with fullness, corners, and batch quantities.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Trim Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Trim Type</label><select className="input-field" value={trimType} onChange={e => setTrimType(e.target.value)}>{Object.keys(trimTypes).map(t => (<option key={t} value={t}>{t}</option>))}</select></div>
                            <div className="input-group"><label className="input-label">Edge Length (in)</label><input type="number" className="input-field input-mono" value={edgeLen} onChange={e => setEdgeLen(e.target.value)} min="1" /></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Fullness</label><select className="input-field" value={fullness} onChange={e => setFullness(e.target.value)}><option value="1">1x (flat)</option><option value="1.5">1.5x (slight gather)</option><option value="2">2x (gathered)</option></select></div>
                            <div className="input-group"><label className="input-label">Corners</label><select className="input-field" value={corners} onChange={e => setCorners(e.target.value)}><option value="0">None</option><option value="2">2</option><option value="4">4</option></select></div>
                            <div className="input-group"><label className="input-label">Quantity</label><input type="number" className="input-field input-mono" value={qty} onChange={e => setQty(e.target.value)} min="1" /></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Total {trimType} Trim</div><div className="result-value">~{totalYards.toFixed(1)} yards</div><div className="result-label">With 5% safety margin</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Per item</span><span className="result-row-value">{perItem.toFixed(0)}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Total (x{q})</span><span className="result-row-value">{total.toFixed(0)}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">With safety</span><span className="result-row-value">{safety.toFixed(0)}&quot;</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}