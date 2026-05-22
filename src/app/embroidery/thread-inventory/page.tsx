"use client";
import { useState } from "react";
import Link from "next/link";
import { Archive, ChevronDown, Palette, Layers } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Thread Color Converter", href: "/embroidery/thread-color-converter", icon: Palette },
    { name: "Thread Coverage", href: "/embroidery/thread-coverage", icon: Layers },
    { name: "Hand Embroidery Floss", href: "/embroidery/hand-embroidery-floss", icon: Layers },
];
const faqItems = [
    { q: "How should I organize my thread inventory?", a: "By brand and number is most efficient. Many stitchers use DMC floss organizer boxes with numbered bobbins. Digital tracking prevents duplicate purchases." },
    { q: "How long does embroidery thread last?", a: "Polyester thread lasts indefinitely. Cotton/rayon can degrade in 5-10 years. Store away from sunlight and humidity." },
    { q: "Should I buy duplicates of popular colors?", a: "Yes. Black, white, and your most-used colors should have backups. Dye lots can vary, so buy same-lot when possible." },
];

export default function ThreadInventoryPage() {
    const [threads, setThreads] = useState([{ brand: "DMC", number: "", name: "", qty: "1" }]);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const updateThread = (i: number, field: string, val: string) => { const t = [...threads]; (t[i] as Record<string, string>)[field] = val; setThreads(t); };
    const totalSkeins = threads.reduce((s, t) => s + (parseInt(t.qty) || 0), 0);
    const uniqueColors = threads.filter(t => t.number).length;

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Embroidery", href: "/embroidery" }, { label: "Thread Inventory" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Archive size={14} strokeWidth={1.5} /> Embroidery</span><h1>Thread Inventory Tracker</h1><p>Track your embroidery thread collection to avoid duplicate purchases and find what you need.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Your Collection</h2>
                    {threads.map((t, i) => (<div key={i} className="calculator-form" style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < threads.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Brand</label><select className="input-field" value={t.brand} onChange={e => updateThread(i, "brand", e.target.value)}><option value="DMC">DMC</option><option value="Anchor">Anchor</option><option value="Sulky">Sulky</option><option value="Isacord">Isacord</option><option value="Madeira">Madeira</option><option value="Other">Other</option></select></div>
                            <div className="input-group"><label className="input-label">Number</label><input type="text" className="input-field input-mono" placeholder="e.g., 321" value={t.number} onChange={e => updateThread(i, "number", e.target.value)} /></div>
                            <div className="input-group"><label className="input-label">Color Name</label><input type="text" className="input-field" placeholder="e.g., Red" value={t.name} onChange={e => updateThread(i, "name", e.target.value)} /></div>
                            <div className="input-group"><label className="input-label">Qty</label><input type="number" className="input-field input-mono" value={t.qty} onChange={e => updateThread(i, "qty", e.target.value)} min="0" style={{ maxWidth: 60 }} /></div>
                        </div>
                    </div>))}
                    <button className="btn btn-secondary btn-sm" onClick={() => setThreads([...threads, { brand: "DMC", number: "", name: "", qty: "1" }])}>+ Add Thread</button>
                    <div className="calculator-divider" />
                    <div className={styles.resultDetails}>
                        <div className="result-row"><span className="result-row-label">Unique colors</span><span className="result-row-value">{uniqueColors}</span></div>
                        <div className="result-row"><span className="result-row-label">Total skeins/spools</span><span className="result-row-value">{totalSkeins}</span></div>
                    </div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}