"use client";
import { useState } from "react";
import Link from "next/link";
import { Layers, ChevronDown, Scissors, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const matrix = [
    { fabric: "Lightweight woven (chiffon, voile)", rec: "Pellon 911FF (fusible featherweight)", alt: "Silk organza (sew-in)", why: "Prevents stiffness on delicate fabrics" },
    { fabric: "Medium woven (cotton, linen)", rec: "Pellon SF101 (Shape-Flex woven)", alt: "Pellon 931TD (Shirt-Tailor)", why: "All-purpose; drapes naturally" },
    { fabric: "Heavyweight woven (denim, canvas)", rec: "Pellon 809 (Decor-Bond)", alt: "Hair canvas (sew-in)", why: "Heavy-duty structure" },
    { fabric: "Knit / stretch fabric", rec: "Fusible knit (Pellon EK130)", alt: "Pellon SF101 (cross-grain)", why: "Maintains stretch" },
    { fabric: "Bags / craft projects", rec: "Pellon 809 or Pellon 987F", alt: "Peltex 72F (ultra-firm)", why: "Shape retention for structured items" },
];
const relatedTools = [
    { name: "Stabilizer Calc", href:  icon: Scissors },
    { name: "Fusible Web", href: "/notions/fusible-web-calculator", icon: Ruler },
    { name: "Lining Yardage", href:  icon: Ruler },
];
const faqItems = [
    { q: "Fusible or sew-in interfacing?", a: "Fusible is faster and easier -- best for most projects. Sew-in is better for delicate fabrics that can't take heat, or for professional tailoring." },
    { q: "Why does my interfacing bubble after washing?", a: "Usually wrong temperature setting or not pressing long enough. Always test on a scrap first. Press (don't iron) for 10-15 seconds with steam." },
    { q: "How much interfacing should I buy?", a: "Measure all pattern pieces needing interfacing, add 10% for cutting waste and grain matching. Standard interfacing comes in 20\" or 44\" widths." },
];

export default function InterfacingCalcPage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Notions", href: "/notions" }, { label: "Interfacing Calculator" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Layers size={14} strokeWidth={1.5} /> Notions</span><h1>Interfacing Type and Yardage Calculator</h1><p>Select the correct interfacing type based on fabric and application with Pellon product recommendations.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Interfacing Selection Guide</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Fabric</th><th>Recommended</th><th>Alternative</th><th>Why</th></tr></thead>
                        <tbody>{matrix.map(m => (<tr key={m.fabric}><td style={{ fontWeight: 600 }}>{m.fabric}</td><td>{m.rec}</td><td>{m.alt}</td><td style={{ color: "var(--color-text-secondary)", fontStyle: "italic" }}>{m.why}</td></tr>))}</tbody>
                    </table></div>
                </div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Common Pellon Products</h2>
                    <ul style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>
                        <li><strong>911FF</strong> -- Fusible Featherweight (lightweight garments)</li>
                        <li><strong>931TD</strong> -- Shirt-Tailor (shirts, blouses)</li>
                        <li><strong>SF101</strong> -- Shape-Flex (woven, all-purpose)</li>
                        <li><strong>809</strong> -- Decor-Bond (bags, structured items)</li>
                        <li><strong>987F</strong> -- Fusible Fleece (soft structure, bags)</li>
                        <li><strong>950F</strong> -- ShirTailor (waistbands)</li>
                        <li><strong>EK130</strong> -- Fusible Knit (stretch fabrics)</li>
                    </ul>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}