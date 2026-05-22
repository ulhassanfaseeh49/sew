"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { PackageOpen, Copy, Printer, ChevronDown, Leaf, Recycle } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

interface StashItem { desc: string; fiber: string; yardage: string; width: string; prewashed: string; }
const emptyItem = (): StashItem => ({ desc: "", fiber: "cotton", yardage: "", width: "45", prewashed: "no" });
const fibers = ["cotton", "linen", "silk", "wool", "polyester", "blend", "other"];

const relatedTools = [
    { name: "Remnant Usage", href: "/sustainable/remnant-usage", icon: Recycle },
    { name: "Waste % Calculator", href: "/sustainable/waste-percentage", icon: Leaf },
    { name: "Donation Value", href: "/sustainable/donation-value", icon: PackageOpen },
];
const faqItems = [
    { q: "How do I organize my fabric stash?", a: "Sort by type (woven/knit), then by color. Store in labeled bins away from light and moisture. Track yardage so you know what you have before shopping." },
    { q: "When should I destash fabric?", a: "If unused for 2+ years with no project plan, consider selling, swapping, or donating. Keeping a manageable stash you can actually sew through is more sustainable." },
    { q: "How do I know if stash fabric is still good?", a: "Check for: fading, brittleness, musty smell, pest damage. Wash a test piece. Most fabric stored properly lasts decades. Silk and wool need cedar protection." },
];

export default function StashTrackerPage() {
    const [items, setItems] = useState<StashItem[]>([emptyItem()]);
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const update = (i: number, field: keyof StashItem, val: string) => { const n = [...items]; n[i] = { ...n[i], [field]: val }; setItems(n); };
    const totalYards = items.reduce((s, it) => s + (parseFloat(it.yardage) || 0), 0);
    const byFiber = fibers.map(f => ({ fiber: f, count: items.filter(it => it.fiber === f && (parseFloat(it.yardage) || 0) > 0).length, yards: items.filter(it => it.fiber === f).reduce((s, it) => s + (parseFloat(it.yardage) || 0), 0) })).filter(f => f.yards > 0);

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Stash: ${items.filter(it => parseFloat(it.yardage)! > 0).length} pieces, ${totalYards.toFixed(1)} yards total`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [items, totalYards]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Sustainable", href: "/sustainable" }, { label: "Stash Tracker" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><PackageOpen size={14} strokeWidth={1.5} /> Sustainable</span><h1>Fabric Stash Yardage Tracker</h1><p>Track your fabric stash to avoid unnecessary purchases and manage sustainably.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Add Fabrics</h2>
                    {items.map((it, i) => (
                        <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid var(--color-border)" }}>
                            <div className="calculator-form">
                                <div className="input-group"><label className="input-label">Description</label><input type="text" className="input-field" placeholder="e.g., navy cotton lawn" value={it.desc} onChange={e => update(i, "desc", e.target.value)} /></div>
                                <div className="calculator-form-row">
                                    <div className="input-group"><label className="input-label">Fiber</label><select className="input-field" value={it.fiber} onChange={e => update(i, "fiber", e.target.value)}>{fibers.map(f => <option key={f} value={f}>{f}</option>)}</select></div>
                                    <div className="input-group"><label className="input-label">Yardage</label><input type="number" className="input-field input-mono" placeholder="e.g., 3" value={it.yardage} onChange={e => update(i, "yardage", e.target.value)} min="0" step="0.25" /></div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button className="btn btn-secondary btn-sm" onClick={() => setItems([...items, emptyItem()])}>+ Add Another</button>
                </div>
                {totalYards > 0 && (<div className="calculator-card">
                    <h2 className={styles.sectionTitle}>Stash Summary</h2>
                    <div className="result-card"><div className="result-prefix">Total Stash</div><div className="result-value">{totalYards.toFixed(1)} yards</div><div className="result-label">{items.filter(it => (parseFloat(it.yardage) || 0) > 0).length} pieces</div></div>
                    {byFiber.length > 0 && (<div className={styles.resultDetails} style={{ marginTop: 16 }}>{byFiber.map(f => (<div className="result-row" key={f.fiber}><span className="result-row-label" style={{ textTransform: "capitalize" }}>{f.fiber}</span><span className="result-row-value">{f.count} pcs / {f.yards.toFixed(1)} yd</span></div>))}</div>)}
                    <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                </div>)}
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}