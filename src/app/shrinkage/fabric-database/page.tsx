"use client";
import { useState } from "react";
import Link from "next/link";
import { Database, ChevronDown, Droplets, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const fabricData = [
    { name: "Quilting Cotton", fiber: "100% Cotton", len: "3-5%", cross: "2-4%", care: "Machine warm", prewash: "Recommended" },
    { name: "Muslin / Calico", fiber: "100% Cotton", len: "3-8%", cross: "2-5%", care: "Machine warm", prewash: "Essential" },
    { name: "Denim", fiber: "Cotton/Spandex", len: "3-5%", cross: "1-3%", care: "Machine cold-warm", prewash: "Recommended" },
    { name: "Flannel", fiber: "100% Cotton", len: "5-8%", cross: "3-5%", care: "Machine warm", prewash: "Essential" },
    { name: "Lawn / Batiste", fiber: "100% Cotton", len: "2-4%", cross: "1-3%", care: "Machine gentle", prewash: "Recommended" },
    { name: "Linen (light)", fiber: "100% Linen", len: "5-10%", cross: "3-7%", care: "Machine warm", prewash: "Essential (2-3x)" },
    { name: "Linen (heavy)", fiber: "100% Linen", len: "5-8%", cross: "3-5%", care: "Machine warm", prewash: "Essential" },
    { name: "Rayon Challis", fiber: "100% Rayon", len: "5-12%", cross: "3-8%", care: "Hand wash/gentle", prewash: "Essential" },
    { name: "Rayon Jersey", fiber: "Rayon/Spandex", len: "4-8%", cross: "3-6%", care: "Gentle cold", prewash: "Essential" },
    { name: "Silk Charmeuse", fiber: "100% Silk", len: "1-3%", cross: "0.5-2%", care: "Hand wash/dry clean", prewash: "Recommended" },
    { name: "Silk Dupioni", fiber: "100% Silk", len: "2-4%", cross: "1-3%", care: "Dry clean preferred", prewash: "Test swatch first" },
    { name: "Wool Suiting", fiber: "100% Wool", len: "3-5%", cross: "2-4%", care: "Steam/dry clean", prewash: "Steam only" },
    { name: "Merino Knit", fiber: "100% Wool", len: "3-8%", cross: "2-6%", care: "Hand wash cool", prewash: "Essential (gently)" },
    { name: "100% Polyester", fiber: "Polyester", len: "0-1%", cross: "0-0.5%", care: "Machine any", prewash: "Optional" },
    { name: "Polyester Chiffon", fiber: "Polyester", len: "0-0.5%", cross: "0-0.5%", care: "Machine gentle", prewash: "Optional" },
    { name: "Nylon", fiber: "Nylon", len: "0-1%", cross: "0-0.5%", care: "Machine any", prewash: "Optional" },
    { name: "Bamboo Jersey", fiber: "Bamboo", len: "3-6%", cross: "2-4%", care: "Machine gentle", prewash: "Recommended" },
    { name: "Tencel / Lyocell", fiber: "Tencel", len: "2-4%", cross: "1-3%", care: "Machine gentle", prewash: "Recommended" },
    { name: "Corduroy", fiber: "Cotton/Poly", len: "2-4%", cross: "1-3%", care: "Machine warm", prewash: "Recommended" },
    { name: "Canvas / Duck", fiber: "100% Cotton", len: "3-5%", cross: "2-3%", care: "Machine warm", prewash: "Recommended" },
    { name: "Fleece (Poly)", fiber: "Polyester", len: "0-1%", cross: "0-0.5%", care: "Machine warm", prewash: "Optional" },
    { name: "Minky / Cuddle", fiber: "Polyester", len: "0-1%", cross: "0-0.5%", care: "Machine gentle", prewash: "Optional" },
];

const relatedTools = [
    { name: "Pre-Wash Estimator", href: "/shrinkage/pre-wash-estimator", icon: Droplets },
    { name: "Pre-Washing Guide", href: "/shrinkage/pre-washing-guide", icon: Droplets },
    { name: "Shrinkage % Calc", href: "/shrinkage/percentage-calculator", icon: Ruler },
];
const faqItems = [
    { q: "Which fabric type shrinks the most?", a: "Rayon/viscose and linen have the highest shrinkage rates, often 5-12%. Loose-weave cottons like muslin and flannel are also high." },
    { q: "Does polyester fabric shrink?", a: "Very minimally -- under 1%. Polyester is heat-set during manufacturing, making it dimensionally stable." },
    { q: "Why does the same fabric type vary in shrinkage?", a: "Shrinkage depends on weave tightness, finishing treatments, manufacturer, and yarn tension. Two 100% cotton fabrics can shrink very differently." },
];

export default function FabricDatabasePage() {
    const [search, setSearch] = useState(""); const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const filtered = fabricData.filter(f => f.name.toLowerCase().includes(search.toLowerCase()) || f.fiber.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Shrinkage", href: "/shrinkage" }, { label: "Fabric Database" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Database size={14} strokeWidth={1.5} /> Shrinkage</span><h1>Fabric Type Shrinkage Database</h1><p>Searchable reference of expected shrinkage percentages by fabric type.</p></div>
                <div className="calculator-card">
                    <div className="input-group" style={{ marginBottom: 16 }}><label className="input-label">Search Fabric</label><input type="text" className="input-field" placeholder="e.g., denim, silk, rayon..." value={search} onChange={e => setSearch(e.target.value)} /></div>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Fabric</th><th>Fiber</th><th>Length</th><th>Width</th><th>Care</th><th>Pre-wash</th></tr></thead>
                        <tbody>{filtered.map(f => (<tr key={f.name}><td style={{ fontWeight: 600 }}>{f.name}</td><td style={{ fontSize: 13 }}>{f.fiber}</td><td>{f.len}</td><td>{f.cross}</td><td style={{ fontSize: 13 }}>{f.care}</td><td style={{ fontSize: 13 }}>{f.prewash}</td></tr>))}</tbody>
                    </table></div>
                    {filtered.length === 0 && <p style={{ padding: 16, color: "var(--color-text-secondary)", textAlign: "center" }}>No fabrics match your search.</p>}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}