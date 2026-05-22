"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Layers, Copy, Printer, ChevronDown, Scissors, Maximize } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Fusible Applique", href: "/embroidery/fusible-applique", icon: Layers },
    { name: "Design Scaler", href: "/embroidery/design-scaler", icon: Maximize },
    { name: "Thread Coverage", href: "/embroidery/thread-coverage", icon: Scissors },
];
const faqItems = [
    { q: "How much fabric do I need for applique?", a: "Each shape needs fabric slightly larger than the design piece. Add 0.5\" for seam allowance + 10% waste for cutting curves." },
    { q: "How do I calculate for multiple shapes?", a: "List each shape's dimensions separately. Different fabrics for different shapes need separate yardage calculations." },
    { q: "Should I use the same fabric for all applique pieces?", a: "Not necessarily. Contrasting fabrics add visual interest. But consider wash care compatibility between all fabrics." },
];

export default function AppliqueYardagePage() {
    const [shapes, setShapes] = useState([{ name: "Shape 1", w: "", h: "", qty: "1" }]);
    const [seam, setSeam] = useState("0.5"); const [buffer, setBuffer] = useState("10");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const updateShape = (i: number, field: string, val: string) => { const s = [...shapes]; (s[i] as Record<string, string>)[field] = val; setShapes(s); };
    const sm = parseFloat(seam) || 0.5; const bf = parseFloat(buffer) || 10;
    const totalArea = shapes.reduce((s, sh) => { const w = (parseFloat(sh.w) || 0) + sm * 2; const h = (parseFloat(sh.h) || 0) + sm * 2; return s + w * h * (parseInt(sh.qty) || 1); }, 0);
    const withBuffer = totalArea * (1 + bf / 100);
    const fabricWidth = 44; // standard quilting cotton
    const yardsNeeded = withBuffer / (fabricWidth * 36);
    const roundedYards = Math.ceil(yardsNeeded * 8) / 8;
    const hasResult = totalArea > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Applique fabric: ${roundedYards} yards (${withBuffer.toFixed(0)} sq in including seam allowance and ${bf}% buffer).`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [roundedYards, withBuffer, bf]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Embroidery", href: "/embroidery" }, { label: "Applique Yardage" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Layers size={14} strokeWidth={1.5} /> Embroidery</span><h1>Applique Yardage Calculator</h1><p>Calculate fabric needed for applique shapes with seam allowance and cutting waste.</p></div>
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
                    <div className="calculator-form-row" style={{ marginTop: 12 }}>
                        <div className="input-group"><label className="input-label">Seam Allowance (in)</label><select className="input-field" value={seam} onChange={e => setSeam(e.target.value)}><option value="0.25">1/4"</option><option value="0.5">1/2"</option></select></div>
                        <div className="input-group"><label className="input-label">Waste Buffer %</label><select className="input-field" value={buffer} onChange={e => setBuffer(e.target.value)}><option value="10">10%</option><option value="15">15%</option><option value="20">20%</option></select></div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Fabric Needed</div><div className="result-value">{roundedYards} yards</div><div className="result-label">{withBuffer.toFixed(0)} sq in total (incl seam + {bf}% waste)</div></div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}