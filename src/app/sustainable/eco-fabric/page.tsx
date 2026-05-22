"use client";
import { useState } from "react";
import Link from "next/link";
import { Scale, ChevronDown, Leaf, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const fabrics = [
    { name: "Organic Cotton", water: "Low", co2: "Low", land: "Medium", chem: "Very Low", bio: "Yes", micro: "None", cert: "GOTS", score: 4 },
    { name: "Conventional Cotton", water: "Very High", co2: "Medium", land: "Medium", chem: "High", bio: "Yes", micro: "None", cert: "None", score: 2 },
    { name: "Linen", water: "Low", co2: "Low", land: "Low", chem: "Low", bio: "Yes", micro: "None", cert: "OEKO-TEX", score: 4 },
    { name: "Hemp", water: "Very Low", co2: "Very Low", land: "Very Low", chem: "Very Low", bio: "Yes", micro: "None", cert: "Various", score: 5 },
    { name: "Tencel / Lyocell", water: "Low", co2: "Low", land: "Low", chem: "Low", bio: "Yes", micro: "None", cert: "OEKO-TEX", score: 4 },
    { name: "Recycled Polyester", water: "Lower", co2: "30-50% lower", land: "None", chem: "Medium", bio: "No", micro: "Yes", cert: "GRS", score: 3 },
    { name: "Conventional Polyester", water: "Low", co2: "High", land: "None", chem: "Medium", bio: "No", micro: "Yes", cert: "None", score: 1 },
    { name: "Bamboo Viscose", water: "Medium", co2: "Medium", land: "Low", chem: "High", bio: "Yes", micro: "None", cert: "Varies", score: 2 },
    { name: "Silk", water: "Medium", co2: "Medium", land: "Low", chem: "Low", bio: "Yes", micro: "None", cert: "OEKO-TEX", score: 3 },
    { name: "Wool", water: "Medium", co2: "Medium", land: "High", chem: "Low", bio: "Yes", micro: "None", cert: "RWS", score: 3 },
];

const greenwash = [
    { claim: "Bamboo fabric is sustainable", alert: "Processing is often chemical-intensive (same as rayon). Only mechanically processed bamboo is truly sustainable." },
    { claim: "Natural = sustainable", alert: "Conventional cotton uses massive water and pesticides. Natural is not automatically sustainable." },
    { claim: "Biodegradable", alert: "Only if not blended with synthetic fibers. Poly-cotton blends do not biodegrade." },
    { claim: "Eco-friendly polyester", alert: "Still sheds microplastics in every wash. Use a microplastic filter bag." },
];

const relatedTools = [
    { name: "Fiber Guide", href: "/sustainable/fiber-guide", icon: BookOpen },
    { name: "Carbon Footprint", href: "/sustainable/carbon-footprint", icon: Leaf },
    { name: "Make vs Buy", href: "/sustainable/make-vs-buy", icon: Scale },
];
const faqItems = [
    { q: "Which fabric is most sustainable overall?", a: "Hemp scores highest: very low water, carbon sequestering, rarely needs pesticides, biodegradable. Organic linen and Tencel are close. It depends on specific criteria." },
    { q: "Is recycled polyester really better?", a: "30-50% lower CO2 than virgin polyester and diverts plastic from landfill. But it still sheds microplastics when washed. Better, but not perfect." },
    { q: "What certifications should I look for?", a: "GOTS (organic textiles), OEKO-TEX Standard 100 (no harmful chemicals), Fair Trade (worker welfare), Bluesign (chemical/water management)." },
];

export default function EcoFabricPage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Sustainable", href: "/sustainable" }, { label: "Eco-Fabric Comparator" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Scale size={14} strokeWidth={1.5} /> Sustainable</span><h1>Eco-Fabric Comparator</h1><p>Compare environmental impact of different fabric choices to make informed sustainable decisions.</p></div>
                <div className="calculator-card"><h2 className={styles.sectionTitle}>Environmental Impact Comparison</h2>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Fabric</th><th>Water</th><th>CO2</th><th>Chemical</th><th>Biodegradable</th><th>Score</th></tr></thead>
                        <tbody>{fabrics.map(f => (<tr key={f.name}><td style={{ fontFamily: "inherit", fontWeight: 500 }}>{f.name}</td><td style={{ fontSize: 13 }}>{f.water}</td><td style={{ fontSize: 13 }}>{f.co2}</td><td style={{ fontSize: 13 }}>{f.chem}</td><td style={{ fontSize: 13 }}>{f.bio}</td><td style={{ fontWeight: 700 }}>{"★".repeat(f.score)}{"☆".repeat(5 - f.score)}</td></tr>))}</tbody>
                    </table></div>
                </div>
                <div className="calculator-card" style={{ background: "#fef9c3", border: "1px solid #fde68a" }}>
                    <h2 style={{ fontSize: "var(--text-base)", fontWeight: 600, marginBottom: 12, color: "#854d0e" }}>Greenwashing Alerts</h2>
                    {greenwash.map(g => (<div key={g.claim} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #fde68a" }}>
                        <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "#92400e", marginBottom: 2 }}>{g.claim}</h3>
                        <p style={{ fontSize: "var(--text-sm)", color: "#78350f" }}>{g.alert}</p>
                    </div>))}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}