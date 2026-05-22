"use client";
import { useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronDown, Droplets, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const guides: Record<string, { label: string; steps: string[] }> = {
    cotton: { label: "Cotton (quilting, muslin, denim, flannel)", steps: ["Serge or zigzag raw edges to prevent fraying", "Machine wash warm on normal cycle", "Use mild detergent or none", "Tumble dry medium until slightly damp", "Press with steam while slightly damp", "Measure and compare to original dimensions"] },
    linen: { label: "Linen", steps: ["Serge or zigzag all edges (linen frays heavily)", "Machine wash warm-hot on normal cycle", "Tumble dry medium until damp", "Press immediately with steam on linen setting", "May need 2-3 washes to fully pre-shrink", "Gets softer with each wash"] },
    rayon: { label: "Rayon / Viscose", steps: ["Serge or zigzag edges carefully", "Hand wash in cool water -- do NOT agitate or wring", "Gently squeeze out water (do not twist)", "Lay flat to dry on towel -- do NOT hang (stretches)", "Press on medium heat with pressing cloth while slightly damp", "May need to block back to shape while damp"] },
    wool: { label: "Wool", steps: ["Use wool wash or very mild detergent", "Hand wash in lukewarm water only -- NO hot water", "Do NOT change temperature suddenly (causes felting)", "Do NOT agitate -- gently press garment in water", "Roll in towel to remove excess water", "Lay flat to dry -- never hang (stretches)", "Press with steam on wool setting with pressing cloth"] },
    silk: { label: "Silk", steps: ["Test a small piece first -- some silks water-spot", "Hand wash in cool water with silk-specific detergent", "Do not wring or twist", "Roll in clean towel to remove excess water", "Hang dry or lay flat away from direct sunlight", "Iron on reverse side while slightly damp on silk setting"] },
    knits: { label: "Knit Fabrics (jersey, interlock, rib)", steps: ["Machine wash as you will wash the finished garment", "Use gentle cycle with cold or warm water", "Tumble dry low or lay flat to dry", "Do NOT wring or stretch while wet", "Press gently -- avoid stretching with iron"] },
    polyester: { label: "Polyester / Synthetics", steps: ["Machine wash on any cycle (very forgiving)", "Any water temperature is fine", "Tumble dry low-medium", "Minimal shrinkage expected (under 1%)", "Pre-washing is optional but removes manufacturing chemicals"] },
};

const relatedTools = [
    { name: "Pre-Wash Estimator", href: "/shrinkage/pre-wash-estimator", icon: Droplets },
    { name: "Fabric Database", href: "/shrinkage/fabric-database", icon: Droplets },
    { name: "Shrinkage % Calc", href: "/shrinkage/percentage-calculator", icon: Ruler },
];
const faqItems = [
    { q: "Do I really need to pre-wash fabric before sewing?", a: "For natural fibers (cotton, linen, wool, rayon): strongly recommended. For synthetics: optional. Skipping pre-wash risks garment shrinking after first laundering." },
    { q: "How do I prevent fabric from fraying in the washing machine?", a: "Serge, zigzag, or pink all raw edges before washing. Alternatively, use a mesh laundry bag to contain loose threads." },
    { q: "Should I pre-wash quilting cotton?", a: "Debated in the quilting community. Pre-wash for: color bleeding prevention and shrinkage control. Skip for: the crinkled antique look after washing the finished quilt." },
];

export default function PreWashingGuidePage() {
    const [selectedFiber, setSelectedFiber] = useState("cotton");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const guide = guides[selectedFiber];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Shrinkage", href: "/shrinkage" }, { label: "Pre-Washing Guide" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><BookOpen size={14} strokeWidth={1.5} /> Shrinkage</span><h1>Pre-Washing Guide by Fabric Type</h1><p>Step-by-step instructions for how to correctly pre-wash different fabric types.</p></div>
                <div className="calculator-card">
                    <div className="input-group" style={{ marginBottom: 16 }}><label className="input-label">Select Fabric Type</label><select className="input-field" value={selectedFiber} onChange={e => setSelectedFiber(e.target.value)}>{Object.entries(guides).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
                    <h3 style={{ fontSize: "var(--text-base)", fontWeight: 600, marginBottom: 12 }}>Pre-Washing Steps: {guide.label}</h3>
                    <ol style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 2.2, paddingLeft: 24, margin: 0 }}>
                        {guide.steps.map((step, i) => <li key={i} style={{ paddingLeft: 4 }}>{step}</li>)}
                    </ol>
                </div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Quick Reference: Pre-Wash Necessity</h2>
                    <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 2 }}>
                        <p><strong>Always pre-wash:</strong> Cotton, linen, rayon, wool, bamboo</p>
                        <p><strong>Usually pre-wash:</strong> Silk, denim, flannel, any natural fiber</p>
                        <p><strong>Optional:</strong> Polyester, nylon, acrylic blends</p>
                        <p><strong>Cannot wash (use steam):</strong> Dry-clean-only fabrics</p>
                    </div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}