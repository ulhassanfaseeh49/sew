"use client";
import { useState } from "react";
import Link from "next/link";
import { Settings, ChevronDown, Ruler, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const fabricSettings = [
    { fabric: "Lightweight jersey", needle: "75/11", stitch: "2.5–3.0mm", diff: "0.7–0.8", notes: "Stretch needle recommended" },
    { fabric: "Standard jersey", needle: "80/12", stitch: "3.0mm", diff: "0.7–0.9", notes: "Most common setup" },
    { fabric: "Interlock", needle: "80/12", stitch: "3.0mm", diff: "0.8–1.0", notes: "More stable than jersey" },
    { fabric: "Ribbing", needle: "75/11", stitch: "2.5mm", diff: "0.7–0.8", notes: "Stretch needle essential" },
    { fabric: "Ponte / Heavy knit", needle: "90/14", stitch: "3.0–3.5mm", diff: "0.9–1.0", notes: "Less differential needed" },
    { fabric: "Swimwear", needle: "75/11 Stretch", stitch: "2.5mm", diff: "0.7", notes: "Wooly nylon in looper essential" },
    { fabric: "Fleece", needle: "90/14", stitch: "3.5mm", diff: "1.0", notes: "Universal needle OK" },
    { fabric: "Activewear", needle: "75/11 Stretch", stitch: "2.5–3.0mm", diff: "0.7–0.8", notes: "Stretch needle for lycra content" },
];

const stitchTypes = [
    { type: "2-Needle Coverstitch", desc: "Two parallel rows on top, chain on bottom. Standard knit hemming.", width: "1/4\" (6mm)" },
    { type: "3-Needle Coverstitch", desc: "Three parallel rows for wider coverage. Sportswear and decorative.", width: "Wider" },
    { type: "Chain Stitch", desc: "Single row, stretchy chain underneath. Basting or lightweight seaming.", width: "Single row" },
];

const troubleshooting = [
    { problem: "Skipped stitches", fix: "Use stretch needle. Ensure needle fully inserted. Adjust differential feed. Don't stretch fabric while sewing." },
    { problem: "Tunneling between rows", fix: "Loosen looper tension. Increase differential feed slightly. Use fusible hem tape to stabilize." },
    { problem: "Join coming apart (circular hem)", fix: "Overlap start by 1\". Pull threads to wrong side and knot. Apply seam sealant for security." },
    { problem: "Wavy hem", fix: "Reduce differential feed setting (try 0.7). Don't stretch fabric as you sew." },
];

const relatedTools = [
    { name: "Serger Settings Guide", href: "/machine/serger-guide", icon: Settings },
    { name: "Twin Needle Guide", href: "/needles-thread/twin-needle-guide", icon: Ruler },
    { name: "Needle by Fabric", href: "/needles-thread/needle-by-fabric", icon: BookOpen },
];

const faqItems = [
    { q: "What's the difference between coverstitch and twin needle?", a: "Coverstitch creates a genuinely stretchy seam with chain looper underneath. Twin needle on a regular machine simulates the look but the bobbin zigzag has limited stretch and can pop." },
    { q: "Do I need a separate coverstitch machine?", a: "You can get combo serger/coverstitch machines. Standalone coverstitch is faster to switch to. Twin needle on a regular sewing machine is a good budget alternative." },
    { q: "How do I secure the chain stitch at the end?", a: "Coverstitch doesn't backstitch. Sew off the fabric, leave 3-4 inch chain tail, pull the looper thread to pull needle threads to the wrong side, then knot." },
];

export default function CoverstitchGuidePage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Machine Tools", href: "/machine" }, { label: "Coverstitch Guide" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Settings size={14} strokeWidth={1.5} /> Sewing Machine Tool</span>
                        <h1>Coverstitch Machine Guide</h1>
                        <p>Settings and application guide for professional-quality knit hems and topstitching.</p>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.sectionTitle}>Stitch Types Available</h2>
                        {stitchTypes.map(s => (
                            <div key={s.type} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid var(--color-border)" }}>
                                <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 4 }}>{s.type}</h3>
                                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginBottom: 2 }}>{s.desc}</p>
                                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-accent)" }}>Width: {s.width}</p>
                            </div>
                        ))}
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.sectionTitle}>Settings by Fabric</h2>
                        <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Fabric</th><th>Needle</th><th>Stitch</th><th>Diff Feed</th><th>Notes</th></tr></thead>
                            <tbody>{fabricSettings.map(f => (<tr key={f.fabric}><td style={{ fontFamily: "inherit", fontWeight: 500 }}>{f.fabric}</td><td>{f.needle}</td><td>{f.stitch}</td><td style={{ fontWeight: 600 }}>{f.diff}</td><td style={{ fontFamily: "inherit", fontSize: 13 }}>{f.notes}</td></tr>))}</tbody>
                        </table></div>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.sectionTitle}>Troubleshooting</h2>
                        {troubleshooting.map((t, i) => (
                            <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: i < troubleshooting.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                                <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 4 }}>{t.problem}</h3>
                                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>{t.fix}</p>
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