"use client";
import { useState } from "react";
import Link from "next/link";
import { Shield, ChevronDown, Scissors, Layers } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const stabMatrix = [
    { fabric: "Stable woven (cotton, linen)", stab: "Tear-away (medium)", top: "No", why: "Easy removal, fabric supports itself" },
    { fabric: "Knit / stretch", stab: "Cut-away (soft)", top: "No", why: "Permanent support; tear-away leaves holes" },
    { fabric: "Terry / fleece / velvet", stab: "Cut-away or tear-away", top: "Yes (water-soluble film)", why: "Topping prevents stitches sinking into nap" },
    { fabric: "Sheer / delicate", stab: "Wash-away (fibrous)", top: "No", why: "Removes completely; no residue" },
    { fabric: "Already constructed items", stab: "Sticky (self-adhesive)", top: "Optional", why: "Hoop stabilizer, stick item on top" },
    { fabric: "Free-standing lace", stab: "Wash-away (film)", top: "N/A", why: "Dissolves, leaving only thread" },
];
const relatedTools = [
    { name: "Interfacing Calc", href: "/notions/interfacing-calculator", icon: Layers },
    { name: "Fusible Web", href: "/notions/fusible-web-calculator", icon: Scissors },
    { name: "Thread Yardage", href: "/notions/thread-yardage", icon: Scissors },
];
const faqItems = [
    { q: "Why is my embroidery puckering?", a: "Most likely wrong stabilizer type, or stabilizer too light. Knits need cut-away (not tear-away). Dense designs need heavier stabilizer. Always hoop tightly." },
    { q: "Can I double up stabilizer?", a: "Yes. For very dense designs or problem fabrics, use two layers of stabilizer. This is especially useful for towels and knits." },
    { q: "What is topping and when do I need it?", a: "Topping is a water-soluble film placed ON TOP of napped fabrics (terry, fleece). It prevents stitches from sinking between fibers." },
];

export default function StabilizerCalcPage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Notions", href: "/notions" }, { label: "Stabilizer Calculator" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Shield size={14} strokeWidth={1.5} /> Notions</span><h1>Stabilizer Type and Size Calculator</h1><p>Select the correct stabilizer for embroidery and applique based on fabric and design type.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Stabilizer Selection Guide</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Fabric</th><th>Stabilizer</th><th>Topping?</th><th>Why</th></tr></thead>
                        <tbody>{stabMatrix.map(s => (<tr key={s.fabric}><td style={{ fontWeight: 600 }}>{s.fabric}</td><td>{s.stab}</td><td>{s.top}</td><td style={{ color: "var(--color-text-secondary)", fontStyle: "italic" }}>{s.why}</td></tr>))}</tbody>
                    </table></div>
                </div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Popular Stabilizer Brands</h2>
                    <ul style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
                        <li><strong>Sulky Tear-Easy</strong> -- standard tear-away</li>
                        <li><strong>Sulky Cut-Away Plus</strong> -- soft cut-away for knits</li>
                        <li><strong>Sulky Solvy / Fabri-Solvy</strong> -- water-soluble</li>
                        <li><strong>Sulky Sticky</strong> -- self-adhesive for hard-to-hoop items</li>
                        <li><strong>Madeira No-Show Mesh</strong> -- invisible cut-away</li>
                        <li><strong>OESD StabilStick</strong> -- premium self-adhesive</li>
                    </ul>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}