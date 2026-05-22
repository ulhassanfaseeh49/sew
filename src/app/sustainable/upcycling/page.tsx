"use client";
import { useState } from "react";
import Link from "next/link";
import { Recycle, ChevronDown, Leaf, Scissors } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const garments: Record<string, { label: string; panels: { part: string; area: string }[]; projects: { name: string; needs: string; feasible: string }[] }> = {
    shirt: {
        label: "Men's Dress Shirt (L)", panels: [
            { part: "Back panel", area: "~24\" x 30\" = 720 sq in" }, { part: "Front panels (2)", area: "~12\" x 30\" each = 720 sq in" },
            { part: "Sleeves (2)", area: "~18\" x 24\" each = 864 sq in" }, { part: "Collar/cuffs", area: "~small pieces" },
        ], projects: [
            { name: "Tote bag", needs: "~1,200 sq in", feasible: "Yes" }, { name: "Pillowcase", needs: "~1,800 sq in", feasible: "Yes" },
            { name: "3 Scrunchies", needs: "~600 sq in", feasible: "Yes (sleeves)" }, { name: "Zippered pouch", needs: "~400 sq in", feasible: "Yes" },
            { name: "8 Quilt blocks (12.5\")", needs: "Variable", feasible: "Yes" },
        ]
    },
    jeans: {
        label: "Jeans", panels: [
            { part: "Leg panels (2)", area: "~16\" x 40\" each" }, { part: "Waistband", area: "~4\" x 34\"" },
            { part: "Pockets (4)", area: "Various sizes" },
        ], projects: [
            { name: "Denim tote bag", needs: "Both legs", feasible: "Yes (classic)" },
            { name: "Denim shorts", needs: "Cut + hem", feasible: "Yes" }, { name: "Apron", needs: "One leg", feasible: "Yes" },
            { name: "Pot holders (4)", needs: "Double layers", feasible: "Yes" },
        ]
    },
    tshirt: {
        label: "T-Shirt", panels: [
            { part: "Front panel", area: "~20\" x 28\"" }, { part: "Back panel", area: "~20\" x 28\"" },
            { part: "Sleeves (2)", area: "~10\" x 14\" each" },
        ], projects: [
            { name: "T-shirt yarn", needs: "Whole shirt", feasible: "Yes" },
            { name: "Reusable shopping bag", needs: "Whole shirt (no sew)", feasible: "Yes" },
            { name: "Quilt blocks (with interfacing)", needs: "Stabilize first", feasible: "Yes" },
        ]
    },
    sheet: {
        label: "Bed Sheet (Queen)", panels: [
            { part: "Full sheet", area: "~90\" x 102\"" },
        ], projects: [
            { name: "New pillowcases", needs: "~20\" x 30\" each", feasible: "Yes (many)" },
            { name: "Garment lining", needs: "Variable", feasible: "Yes (excellent)" },
            { name: "Quilt backing", needs: "Full sheet", feasible: "Yes" },
            { name: "Children's clothing", needs: "Variable", feasible: "Yes (entire outfit)" },
            { name: "Reusable shopping bags", needs: "~18\" x 22\" each", feasible: "Yes (many)" },
        ]
    },
};

const relatedTools = [
    { name: "Remnant Usage", href: "/sustainable/remnant-usage", icon: Recycle },
    { name: "Waste % Calculator", href: "/sustainable/waste-percentage", icon: Leaf },
    { name: "Scrap Sorting", href: "/sustainable/scrap-sorting", icon: Scissors },
];
const faqItems = [
    { q: "How much fabric is in a men's shirt?", a: "Approximately 2,500-3,000 sq inches of usable fabric. The back panel is the largest single piece. Sleeves provide excellent strips for handles and accessories." },
    { q: "Can I use T-shirt fabric for woven projects?", a: "Yes, but stabilize with fusible interfacing first. Knit fabric stretches — interfacing gives it stability for cutting and sewing with woven-style techniques." },
    { q: "Should I unpick seams before cutting?", a: "Yes when possible — unpicking gives more usable fabric. Press flat after unpicking. Remove all buttons, zippers, and hardware first (save for reuse)." },
];

export default function UpcyclingPage() {
    const [garment, setGarment] = useState("shirt");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const g = garments[garment];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Sustainable", href: "/sustainable" }, { label: "Upcycling" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Recycle size={14} strokeWidth={1.5} /> Sustainable</span><h1>Upcycling Project Calculator</h1><p>Find what new items you can make from old garments with estimated fabric areas.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Select Source Garment</h2>
                    <div className="input-group"><select className="input-field" value={garment} onChange={e => setGarment(e.target.value)}>
                        {Object.entries(garments).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select></div>
                    <div className="calculator-divider" />
                    <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 8 }}>Available Fabric from {g.label}</h3>
                    <div className={styles.resultDetails}>{g.panels.map(p => (<div className="result-row" key={p.part}><span className="result-row-label">{p.part}</span><span className="result-row-value">{p.area}</span></div>))}</div>
                    <div className="calculator-divider" />
                    <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 8 }}>Possible Projects</h3>
                    <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Project</th><th>Needs</th><th>Feasible</th></tr></thead>
                        <tbody>{g.projects.map(p => (<tr key={p.name}><td style={{ fontFamily: "inherit", fontWeight: 500 }}>{p.name}</td><td style={{ fontSize: 13 }}>{p.needs}</td><td style={{ color: "var(--color-accent)", fontWeight: 600 }}>{p.feasible}</td></tr>))}</tbody>
                    </table></div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}