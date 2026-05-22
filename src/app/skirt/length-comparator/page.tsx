"use client";
import { useState } from "react";
import Link from "next/link";
import { MoveVertical, ChevronDown, Circle, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Full Circle", href: "/skirt/full-circle", icon: Circle },
    { name: "Yardage by Style", href: "/skirt/yardage-by-style", icon: Ruler },
    { name: "A-Line", href: "/skirt/a-line", icon: Ruler },
];
const faqItems = [
    { q: "What length is most universally flattering?", a: "Just above or at the knee (20-24\" from waist) is universally flattering. It visually lengthens proportions for most body types." },
    { q: "What is midi length?", a: "Midi falls at mid-calf, typically 29-38\" from the waist. For most people this is about 2/3 of the way between waist and floor." },
    { q: "Does heel height affect skirt length?", a: "Yes. With 3\" heels, your effective floor distance increases by 3\". A floor-length skirt without heels becomes ankle length with heels." },
];

export default function LengthComparatorPage() {
    const [waistToFloor, setWaistToFloor] = useState("40"); const [waistToKnee, setWaistToKnee] = useState("22");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const wtf = parseFloat(waistToFloor) || 40; const wtk = parseFloat(waistToKnee) || 22;
    const hasResult = wtf > 0;

    const lengths = [
        { name: "Ultra mini", len: Math.round(wtf * 0.25), where: "High mid-thigh" },
        { name: "Mini", len: Math.round(wtf * 0.35), where: "Mid-thigh" },
        { name: "Above knee", len: wtk - 2, where: "2\" above knee" },
        { name: "Knee length", len: wtk, where: "At knee" },
        { name: "Below knee", len: wtk + 3, where: "3\" below knee" },
        { name: "Midi/calf", len: Math.round(wtf * 0.8), where: "Mid-calf" },
        { name: "Ankle length", len: wtf - 2, where: "Ankle" },
        { name: "Floor length", len: wtf, where: "Floor" },
    ];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Skirt Calculators", href: "/skirt" }, { label: "Length Comparator" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><MoveVertical size={14} strokeWidth={1.5} /> Skirt</span><h1>Skirt Length Comparator</h1><p>See exactly how skirt lengths translate to YOUR body with personalized measurements.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Your Measurements</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Waist to Floor (in)</label><input type="number" className="input-field input-mono" value={waistToFloor} onChange={e => setWaistToFloor(e.target.value)} min="1" step="0.5" /></div>
                            <div className="input-group"><label className="input-label">Waist to Knee (in)</label><input type="number" className="input-field input-mono" value={waistToKnee} onChange={e => setWaistToKnee(e.target.value)} min="1" step="0.5" /></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Style</th><th>Your Length</th><th>Falls At</th></tr></thead>
                            <tbody>{lengths.map(l => (<tr key={l.name}><td style={{ fontWeight: 600 }}>{l.name}</td><td>{l.len}&quot;</td><td>{l.where}</td></tr>))}</tbody>
                        </table></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}