"use client";
import { useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronDown, Droplets, Database } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const guides: { fiber: string; steps: string[] }[] = [
    { fiber: "Cotton (quilting, broadcloth, lawn)", steps: ["Serge or zigzag all raw edges to prevent fraying", "Machine wash warm on normal cycle with mild detergent", "Tumble dry medium until slightly damp", "Press with hot iron while slightly damp for best results", "Measure and record shrinkage for your records"] },
    { fiber: "Linen", steps: ["Serge or zigzag edges (linen frays significantly)", "Machine wash warm on normal cycle", "Tumble dry medium — remove while slightly damp", "Press with hot iron + steam while damp", "Repeat 1-2 more times — linen needs multiple washes to stabilize"] },
    { fiber: "Wool", steps: ["Do NOT machine wash unless specifically machine-washable", "Hand wash in lukewarm water with wool wash detergent", "Do not agitate — gently submerge and soak 15 minutes", "Rinse in same-temperature water (temperature shock causes felting)", "Roll in towel to remove water, lay flat to dry — never hang"] },
    { fiber: "Silk", steps: ["Hand wash in cool water with silk-specific detergent", "Gently agitate — do not wring or twist", "Rinse in cool water", "Roll in towel to absorb moisture", "Iron on reverse side while slightly damp at silk setting"] },
    { fiber: "Rayon / Viscose", steps: ["Handle very carefully — rayon is fragile when wet", "Hand wash in cool water with gentle detergent", "Do not agitate or wring — fabric stretches dramatically when wet", "Roll in towel, then lay completely flat to dry", "May need to block back to shape while still damp"] },
    { fiber: "Denim", steps: ["Turn inside out to reduce surface fading", "Machine wash warm (cold if you want minimal shrinkage)", "Tumble dry medium or hang dry to preserve color", "Press with hot iron + steam", "Expect 3-5% shrinkage on first wash"] },
    { fiber: "Knit Fabrics (jersey, interlock, rib)", steps: ["Machine wash on same cycle you will use for finished garment", "Do not wring or twist — can distort fabric", "Tumble dry low or lay flat to dry", "Steam or press gently — do not stretch while pressing", "Let fabric rest and relax before cutting"] },
    { fiber: "Polyester / Synthetics", steps: ["Pre-washing is optional but recommended to remove sizing", "Machine wash warm on normal cycle", "Tumble dry low — synthetics can melt at high heat", "Minimal shrinkage expected (under 1%)", "Press at appropriate temperature for fiber"] },
];

const relatedTools = [
    { name: "Pre-Wash Estimator", href: "/shrinkage/pre-wash-estimator", icon: Droplets },
    { name: "Shrinkage Database", href: "/shrinkage/fabric-database", icon: Database },
    { name: "Shrinkage % Calc", href: "/shrinkage/percentage-calculator", icon: Droplets },
];
const faqItems = [
    { q: "Do I really need to pre-wash fabric before sewing?", a: "For natural fibers being used in washable garments: yes. For dry-clean-only projects or synthetics: optional. Quilters are split — both approaches are valid." },
    { q: "How do I prevent fabric from fraying in the washing machine?", a: "Serge, zigzag, or pink all raw edges before washing. Use a mesh laundry bag for delicates. This is essential for linen and loosely woven cotton." },
    { q: "Should I pre-wash quilting cotton?", a: "Debated in the quilting community. Pre-washing removes chemicals and prevents color bleeding. Not pre-washing preserves sizing (easier to cut) and creates the crinkled antique look after washing the finished quilt." },
];

export default function PreWashingGuidePage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Shrinkage", href: "/shrinkage" }, { label: "Pre-Washing Guide" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><BookOpen size={14} strokeWidth={1.5} /> Shrinkage</span><h1>Pre-Washing Guide by Fabric Type</h1><p>Step-by-step pre-washing instructions for every fabric type.</p></div>
                {guides.map(g => (<div key={g.fiber} className="calculator-card">
                    <h3 style={{ fontSize: "var(--text-base)", fontWeight: 600, marginBottom: 10 }}>{g.fiber}</h3>
                    <ol style={{ paddingLeft: 20, margin: 0, lineHeight: 2, fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
                        {g.steps.map((s, i) => <li key={i}>{s}</li>)}
                    </ol>
                </div>))}
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}