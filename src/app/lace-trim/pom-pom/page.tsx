"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Circle, Copy, Printer, ChevronDown, Scissors, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const pomSizes: Record<string, { label: string; ppi: number }> = {
    mini: { label: 'Mini (1/4")', ppi: 2 },
    small: { label: 'Small (1/2")', ppi: 1.5 },
    standard: { label: 'Standard (3/4"-1")', ppi: 1 },
    large: { label: 'Large (1-1/2")', ppi: 0.75 },
    jumbo: { label: 'Jumbo (2"+)', ppi: 0.5 },
};

const relatedTools = [
    { name: "Rickrack Calc", href: "/lace-trim/rickrack", icon: Scissors },
    { name: "Fringe Calc", href: "/lace-trim/fringe", icon: Scissors },
    { name: "Ribbon Calc", href: "/lace-trim/ribbon", icon: Ruler },
];
const faqItems = [
    { q: "How many pom-poms are on a yard of trim?", a: "Depends on size: mini (1/4\") = about 72 poms/yard, standard (1\") = about 36 poms/yard, large (1.5\") = about 27 poms/yard." },
    { q: "Can pom-pom trim be washed?", a: "Yes, but use a garment bag. Pom-poms can tangle and flatten in the washing machine. Air drying is recommended." },
    { q: "How do I attach pom-pom trim?", a: "Sew through the header tape, positioning it at or slightly behind the fabric edge so poms hang freely. Use matching thread for invisible stitching." },
];

export default function PomPomPage() {
    const [edges, setEdges] = useState([{ name: "Skirt tier", length: "", qty: "1" }]);
    const [pomSize, setPomSize] = useState("standard"); const [buffer, setBuffer] = useState("10");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const updateEdge = (i: number, field: string, val: string) => { const e = [...edges]; (e[i] as Record<string, string>)[field] = val; setEdges(e); };

    const ps = pomSizes[pomSize];
    const rawTotal = edges.reduce((s, e) => s + (parseFloat(e.length) || 0) * (parseInt(e.qty) || 1), 0);
    const bf = parseFloat(buffer) || 0; const withBuffer = rawTotal * (1 + bf / 100);
    const yards = withBuffer / 36; const pkgs = Math.ceil(yards / 3);
    const totalPoms = Math.round(rawTotal * ps.ppi);
    const hasResult = rawTotal > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Pom-pom trim: ${yards.toFixed(1)} yards (~${totalPoms} poms). Buy ${pkgs} packages.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [yards, totalPoms, pkgs]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Lace & Trim", href: "/lace-trim" }, { label: "Pom-Pom Trim" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Circle size={14} strokeWidth={1.5} /> Lace and Trim</span><h1>Pom-Pom Trim Calculator</h1><p>Calculate pom-pom trim yardage and pom count for edges and tiers.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Pom-Pom Trim Details</h2>
                    <div className="input-group" style={{ marginBottom: 12 }}><label className="input-label">Pom-Pom Size</label><select className="input-field" value={pomSize} onChange={e => setPomSize(e.target.value)}>{Object.entries(pomSizes).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
                    {edges.map((e, i) => (<div key={i} className="calculator-form" style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < edges.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Edge</label><input type="text" className="input-field" value={e.name} onChange={ev => updateEdge(i, "name", ev.target.value)} /></div>
                            <div className="input-group"><label className="input-label">Length (in)</label><input type="number" className="input-field input-mono" placeholder="e.g., 120" value={e.length} onChange={ev => updateEdge(i, "length", ev.target.value)} min="0" step="1" /></div>
                            <div className="input-group"><label className="input-label">Qty</label><input type="number" className="input-field input-mono" value={e.qty} onChange={ev => updateEdge(i, "qty", ev.target.value)} min="1" style={{ maxWidth: 60 }} /></div>
                        </div>
                    </div>))}
                    <button className="btn btn-secondary btn-sm" onClick={() => setEdges([...edges, { name: "", length: "", qty: "1" }])}>+ Add Edge</button>
                    <div className="input-group" style={{ marginTop: 12 }}><label className="input-label">Buffer %</label><select className="input-field" value={buffer} onChange={e => setBuffer(e.target.value)}><option value="10">10%</option><option value="15">15%</option></select></div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Total Pom-Pom Trim</div><div className="result-value">{yards.toFixed(1)} yards</div><div className="result-label">~{totalPoms} poms | Buy {pkgs} package{pkgs > 1 ? "s" : ""} (3-yard)</div></div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}