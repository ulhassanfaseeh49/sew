"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeftRight, ChevronDown, Ruler, Settings } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const combos = [
    { stitch: "Standard straight", width: "0mm", length: "2.5mm", use: "General seams" },
    { stitch: "Narrow zigzag (knit)", width: "0.5–1.0mm", length: "2.5mm", use: "Knit seams" },
    { stitch: "Seam finish zigzag", width: "3.0–5.0mm", length: "1.5–2.5mm", use: "Raw edge finishing" },
    { stitch: "Satin stitch", width: "2.0–6.0mm", length: "0.3–0.5mm", use: "Appliqué edges" },
    { stitch: "Three-step zigzag", width: "5.0–7.0mm", length: "varies", use: "Elastic application" },
    { stitch: "Blind hem", width: "5.0–7.0mm", length: "1.5mm", use: "Invisible hems" },
    { stitch: "Bar tack", width: "4.0–5.0mm", length: "0.3mm", use: "Stress points" },
    { stitch: "Gathering zigzag", width: "4.0–5.0mm", length: "3.0mm", use: "Over cord gathering" },
    { stitch: "Stretch stitch", width: "built-in", length: "2.5mm", use: "Stretch seams" },
];

const relatedTools = [
    { name: "Stitch Length Calculator", href: "/machine/stitch-length", icon: Ruler },
    { name: "SPI Calculator", href: "/machine/spi-calculator", icon: Ruler },
    { name: "Tension Guide", href: "/machine/tension-guide", icon: Settings },
    { name: "Presser Foot Guide", href: "/machine/presser-foot-guide", icon: Settings },
];

const faqItems = [
    { q: "What width for zigzag seam finishing?", a: "3.0-5.0mm width with 1.5-2.5mm length. Use narrower (3mm) for lightweight fabric to prevent distortion, wider (5mm) for heavy fabric." },
    { q: "What makes satin stitch different from zigzag?", a: "Satin stitch is a zigzag with very short length (0.3-0.5mm), making it extremely dense. The stitches sit against each other with no gaps, creating a smooth, satin-like bar." },
    { q: "Why does my zigzag distort the fabric?", a: "Width is too wide and/or length too short for your fabric weight. Try narrower width (reduce by 1mm) or longer stitch length. Use stabilizer underneath for very light fabrics." },
];

export default function StitchWidthPage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Machine Tools", href: "/machine" }, { label: "Stitch Width" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><ArrowLeftRight size={14} strokeWidth={1.5} /> Sewing Machine Tool</span>
                        <h1>Stitch Width Guide</h1>
                        <p>Complete guide to stitch width settings for zigzag, decorative, and utility stitches with fabric-specific recommendations.</p>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.sectionTitle}>Width + Length Combinations</h2>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead><tr><th>Stitch Type</th><th>Width</th><th>Length</th><th>Use</th></tr></thead>
                                <tbody>{combos.map(c => (<tr key={c.stitch}><td style={{ fontFamily: "inherit", fontWeight: 500 }}>{c.stitch}</td><td>{c.width}</td><td>{c.length}</td><td style={{ fontFamily: "inherit", fontSize: 13 }}>{c.use}</td></tr>))}</tbody>
                            </table>
                        </div>
                    </div>
                    {[
                        { title: "Zigzag for Seam Finishing", desc: "Width 3.0–5.0mm, Length 1.5–2.5mm. Narrower for lightweight to prevent distortion. Wider for heavy fabric with more coverage." },
                        { title: "Zigzag for Knit Seams (No Serger)", desc: "Width 0.5–1.0mm (very narrow), Length 2.5–3.0mm. Provides minimal stretch without width distortion." },
                        { title: "Satin Stitch (Appliqué)", desc: "Width 2.0–6.0mm, Length 0.3–0.5mm. Smaller pieces = narrower. Should cover all fabric at edge with no gaps. Loosen top tension slightly." },
                        { title: "Bar Tack", desc: "Width 4.0–5.0mm, Length 0.3–0.5mm. Very short, very wide zigzag for reinforcement at zipper ends, pocket corners, stress points." },
                        { title: "Blind Hem Stitch", desc: "Width 5.0–7.0mm, Length 1.5–2.0mm. Several straight stitches then one swing to catch fold. Test on scrap to set exact width." },
                    ].map(s => (
                        <div key={s.title} className="calculator-card">
                            <h3 style={{ fontSize: "var(--text-base)", fontWeight: 600, marginBottom: 6 }}>{s.title}</h3>
                            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.7 }}>{s.desc}</p>
                        </div>
                    ))}
                    <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside>
            </div>
        </div>
    );
}