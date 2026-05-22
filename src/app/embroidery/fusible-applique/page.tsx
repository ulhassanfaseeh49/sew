"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Flame, Copy, Printer, ChevronDown, Layers, Maximize } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Applique Yardage", href: "/embroidery/applique-yardage", icon: Layers },
    { name: "Thread Coverage", href: "/embroidery/thread-coverage", icon: Layers },
    { name: "Design Scaler", href: "/embroidery/design-scaler", icon: Maximize },
];
const faqItems = [
    { q: "What is fusible web?", a: "A heat-activated adhesive sheet. Iron it to fabric, cut your shape, peel the paper backing, and iron the shape to your project. No sewing to attach." },
    { q: "Do I need to finish edges with fusible?", a: "Fusible holds the shape in place, but raw edges will fray over time. Add satin stitch, blanket stitch, or zigzag around edges for durability." },
    { q: "Can I use fusible web on any fabric?", a: "Most woven cottons work well. Avoid heat-sensitive fabrics (some synthetics, sequined). Test a scrap first." },
];

export default function FusibleAppliquePage() {
    const [shapes, setShapes] = useState([{ name: "Shape 1", w: "", h: "", qty: "1" }]);
    const [webType, setWebType] = useState("standard");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const updateShape = (i: number, field: string, val: string) => { const s = [...shapes]; (s[i] as Record<string, string>)[field] = val; setShapes(s); };
    const totalArea = shapes.reduce((s, sh) => { const w = (parseFloat(sh.w) || 0) + 1; const h = (parseFloat(sh.h) || 0) + 1; return s + w * h * (parseInt(sh.qty) || 1); }, 0);
    const withWaste = totalArea * 1.15; // 15% waste
    const webWidth = webType === "lite" ? 17 : 17; // standard widths
    const yardsNeeded = withWaste / (webWidth * 36);
    const roundedYards = Math.ceil(yardsNeeded * 4) / 4;
    const hasResult = totalArea > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Fusible web: ${roundedYards} yards (${withWaste.toFixed(0)} sq in incl waste). ${shapes.length} shapes.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [roundedYards, withWaste, shapes.length]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Embroidery", href: "/embroidery" }, { label: "Fusible Applique" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Flame size={14} strokeWidth={1.5} /> Embroidery</span><h1>Fusible Applique Calculator</h1><p>Calculate fusible web needed for iron-on applique shapes with cutting waste.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Shapes</h2>
                    {shapes.map((sh, i) => (<div key={i} className="calculator-form" style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < shapes.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Name</label><input type="text" className="input-field" value={sh.name} onChange={e => updateShape(i, "name", e.target.value)} /></div>
                            <div className="input-group"><label className="input-label">Width (in)</label><input type="number" className="input-field input-mono" value={sh.w} onChange={e => updateShape(i, "w", e.target.value)} min="0" step="0.25" /></div>
                            <div className="input-group"><label className="input-label">Height (in)</label><input type="number" className="input-field input-mono" value={sh.h} onChange={e => updateShape(i, "h", e.target.value)} min="0" step="0.25" /></div>
                            <div className="input-group"><label className="input-label">Qty</label><input type="number" className="input-field input-mono" value={sh.qty} onChange={e => updateShape(i, "qty", e.target.value)} min="1" style={{ maxWidth: 60 }} /></div>
                        </div>
                    </div>))}
                    <button className="btn btn-secondary btn-sm" onClick={() => setShapes([...shapes, { name: "", w: "", h: "", qty: "1" }])}>+ Add Shape</button>
                    <div className="input-group" style={{ marginTop: 12 }}><label className="input-label">Fusible Web Type</label><select className="input-field" value={webType} onChange={e => setWebType(e.target.value)}><option value="standard">Standard (HeatnBond Lite)</option><option value="heavy">Heavy duty (HeatnBond Ultra)</option><option value="steam">Steam-a-Seam 2</option></select></div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Fusible Web Needed</div><div className="result-value">{roundedYards} yards</div><div className="result-label">{withWaste.toFixed(0)} sq in total (including 15% cutting waste)</div></div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}