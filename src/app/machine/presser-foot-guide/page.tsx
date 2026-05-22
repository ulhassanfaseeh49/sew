"use client";
import { useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronDown, Ruler, Settings } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const feet = [
    { name: "Standard / General Purpose", cat: "Essential", uses: "General seaming, straight stitch, basic zigzag", tip: "Included with all machines. Use seam guide lines on foot and plate." },
    { name: "Zipper Foot", cat: "Essential", uses: "Lapped/centered zippers, piping", tip: "Adjustable left or right. For invisible zippers, use the invisible zipper foot instead." },
    { name: "Invisible Zipper Foot", cat: "Essential", uses: "Invisible/concealed zippers", tip: "Opens the coil for stitching very close to teeth. Regular zipper foot won't work." },
    { name: "Buttonhole Foot", cat: "Essential", uses: "All buttonholes", tip: "1-step sensor foot measures button automatically. 4-step manual requires setting each step." },
    { name: "Walking Foot / Even Feed", cat: "Specialty", uses: "Quilting, matching plaids, leather/vinyl, knits", tip: "Top feed dogs grip fabric from above. Essential for multiple layers and slippery fabrics." },
    { name: "1/4 Inch Quilting Foot", cat: "Specialty", uses: "Quilt piecing with exact 1/4\" seam", tip: "Right edge = exactly 1/4\" from needle. Scant 1/4\" preferred for quilt blocks." },
    { name: "Free-Motion / Darning Foot", cat: "Specialty", uses: "Free-motion quilting, embroidery, thread painting", tip: "Works with feed dogs lowered. Open-toe version gives better visibility." },
    { name: "Blind Hem Foot", cat: "Specialty", uses: "Invisible hems", tip: "Guide rides along fold. Width adjustment for different fabric thicknesses." },
    { name: "Rolled Hem Foot", cat: "Specialty", uses: "Tiny rolled hems on lightweight fabric", tip: "Available in 2mm, 3mm, 4mm, 6mm widths. Best on chiffon, silk, lightweight wovens." },
    { name: "Gathering / Ruffle Foot", cat: "Specialty", uses: "Gathering one layer while feeding another flat", tip: "Gathering ratio controlled by stitch length — longer stitch = more gathering." },
    { name: "Pintuck Foot", cat: "Specialty", uses: "Decorative pintucks with twin needle", tip: "Available in 3, 5, 7, 9 groove versions. Each groove guides next tuck." },
    { name: "Teflon / Non-Stick Foot", cat: "Specialty", uses: "Leather, vinyl, faux leather, laminated fabric", tip: "Coated sole glides over sticky fabrics. Alternative to walking foot." },
    { name: "Edge Stitch / Stitch in Ditch Foot", cat: "Specialty", uses: "Edge stitching, stitch in ditch quilting, topstitching", tip: "Guide blade rides in seam or along edge for perfectly straight stitching." },
    { name: "Overcast / Overedge Foot", cat: "Specialty", uses: "Raw edge finishing without serger", tip: "Small prong prevents fabric curling. Simulates serged finish." },
    { name: "Bias Tape Binding Foot", cat: "Specialty", uses: "Applying bias tape to edges", tip: "Folds bias tape and applies simultaneously. Available in 6mm, 12mm, 25mm." },
];

const relatedTools = [
    { name: "Stitch Length Calculator", href: "/machine/stitch-length", icon: Ruler },
    { name: "Tension Guide", href: "/machine/tension-guide", icon: Settings },
    { name: "Troubleshooting", href: "/machine/troubleshooting", icon: Settings },
];

const faqItems = [
    { q: "What presser feet come with my machine?", a: "Most machines include: standard foot, zipper foot, buttonhole foot, and sometimes a blind hem foot. Check your machine manual for the complete list." },
    { q: "Do all feet fit all machines?", a: "No. Check your shank type: low-shank (most modern), high-shank, slant shank (vintage Singer), or Bernina (proprietary). Snap-on feet are interchangeable within the same shank type." },
    { q: "Which specialty foot should I buy first?", a: "Walking foot — it's the most versatile specialty foot. Use it for quilting, matching plaids, sewing knits, leather, and any time layers shift." },
];

export default function PresserFootGuidePage() {
    const [filter, setFilter] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const filtered = feet.filter(f => f.name.toLowerCase().includes(filter.toLowerCase()) || f.uses.toLowerCase().includes(filter.toLowerCase()));

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Machine Tools", href: "/machine" }, { label: "Presser Foot Guide" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><BookOpen size={14} strokeWidth={1.5} /> Sewing Machine Tool</span>
                        <h1>Presser Foot Guide</h1>
                        <p>Complete visual guide to all sewing machine presser feet with uses and selector tool.</p>
                    </div>
                    <div className="calculator-card">
                        <div className="input-group" style={{ marginBottom: 16 }}>
                            <label className="input-label">Search by foot name or use</label>
                            <input type="text" className="input-field" placeholder="e.g., zipper, quilting, leather..." value={filter} onChange={e => setFilter(e.target.value)} />
                        </div>
                        {filtered.map(f => (
                            <div key={f.name} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid var(--color-border)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                                    <h3 style={{ fontSize: "var(--text-base)", fontWeight: 600 }}>{f.name}</h3>
                                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: f.cat === "Essential" ? "#e8f5e9" : "#f3f0ff", color: f.cat === "Essential" ? "#2e7d32" : "#6d28d9" }}>{f.cat}</span>
                                </div>
                                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginBottom: 4 }}>Uses: {f.uses}</p>
                                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-accent)", fontWeight: 500 }}>{f.tip}</p>
                            </div>
                        ))}
                    </div>
                    <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside>
            </div>
        </div>
    );
}