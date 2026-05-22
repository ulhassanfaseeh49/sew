"use client";
import { useState } from "react";
import Link from "next/link";
import { Palette, ChevronDown, Layers, Maximize } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Thread Coverage", href: "/embroidery/thread-coverage", icon: Layers },
    { name: "Thread Inventory", href: "/embroidery/thread-inventory", icon: Layers },
    { name: "Hand Embroidery Floss", href: "/embroidery/hand-embroidery-floss", icon: Maximize },
];
const faqItems = [
    { q: "How do I convert DMC to Anchor thread?", a: "Each conversion is specific -- DMC 321 is not Anchor 321. Use this tool to look up the correct equivalent from our database." },
    { q: "Is there an exact match for every color?", a: "Not always. Some colors are close matches rather than exact. Always compare physical spools under natural light." },
    { q: "Can I use Anchor thread in my embroidery machine?", a: "Anchor is primarily hand embroidery floss (6-strand). For machine embroidery, use machine-specific brands like Isacord, Sulky, or Madeira." },
];

const dmcDatabase: Record<string, { name: string; hex: string; anchor: string; sulky: string; madeira: string }> = {
    "310": { name: "Black", hex: "#000000", anchor: "403", sulky: "1005", madeira: "Black" },
    "White": { name: "White", hex: "#FFFFFF", anchor: "2", sulky: "1001", madeira: "White" },
    "321": { name: "Christmas Red", hex: "#C5171A", anchor: "9046", sulky: "1039", madeira: "0510" },
    "498": { name: "Dark Red", hex: "#A7132A", anchor: "1014", sulky: "1147", madeira: "0511" },
    "666": { name: "Bright Red", hex: "#E31D42", anchor: "46", sulky: "1037", madeira: "0210" },
    "550": { name: "Very Dark Violet", hex: "#5C1A66", anchor: "101", sulky: "1112", madeira: "0714" },
    "797": { name: "Royal Blue", hex: "#1C5FA3", anchor: "132", sulky: "1076", madeira: "0912" },
    "699": { name: "Christmas Green", hex: "#006B3A", anchor: "923", sulky: "1051", madeira: "1303" },
    "972": { name: "Deep Canary", hex: "#FFB515", anchor: "298", sulky: "1124", madeira: "0107" },
    "740": { name: "Tangerine", hex: "#FF8C00", anchor: "316", sulky: "1078", madeira: "0203" },
};

export default function ThreadColorConverterPage() {
    const [dmcNumber, setDmcNumber] = useState("321");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const match = dmcDatabase[dmcNumber];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Embroidery", href: "/embroidery" }, { label: "Thread Color Converter" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Palette size={14} strokeWidth={1.5} /> Embroidery</span><h1>Thread Color Conversion Tool</h1><p>Convert thread colors between DMC, Anchor, Sulky, and Madeira brands.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Source Thread</h2>
                    <div className="calculator-form"><div className="calculator-form-row">
                        <div className="input-group"><label className="input-label">DMC Number</label><select className="input-field" value={dmcNumber} onChange={e => setDmcNumber(e.target.value)}>{Object.entries(dmcDatabase).map(([key, val]) => (<option key={key} value={key}>DMC {key} - {val.name}</option>))}</select></div>
                    </div></div>
                    <div className="calculator-divider" />
                    {match ? (<div>
                        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                            <div style={{ width: 64, height: 64, borderRadius: 8, background: match.hex, border: "2px solid var(--color-border)" }} />
                            <div><div style={{ fontWeight: 700, fontSize: "var(--text-lg)" }}>DMC {dmcNumber}</div><div style={{ color: "var(--color-text-secondary)" }}>{match.name}</div></div>
                        </div>
                        <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Brand</th><th>Number</th><th>Match Quality</th></tr></thead>
                            <tbody>
                                <tr><td style={{ fontWeight: 600 }}>Anchor</td><td>{match.anchor}</td><td>Close match</td></tr>
                                <tr><td style={{ fontWeight: 600 }}>Sulky</td><td>{match.sulky}</td><td>Good match</td></tr>
                                <tr><td style={{ fontWeight: 600 }}>Madeira</td><td>{match.madeira}</td><td>Close match</td></tr>
                            </tbody>
                        </table></div>
                        <p style={{ margin: "12px 0", padding: 12, fontSize: "var(--text-sm)", background: "var(--color-surface-hover)", borderRadius: 8, color: "var(--color-text-secondary)" }}>Screen colors are approximate. Always compare physical spools under natural light before committing to a project.</p>
                    </div>) : <p style={{ color: "var(--color-text-secondary)" }}>No match found. Try a different DMC number.</p>}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}