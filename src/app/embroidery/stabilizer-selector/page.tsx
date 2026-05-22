"use client";
import { useState } from "react";
import Link from "next/link";
import { Shield, ChevronDown, Layers, Maximize } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Thread Coverage", href: "/embroidery/thread-coverage", icon: Layers },
    { name: "Hoop Selector", href: "/embroidery/hoop-selector", icon: Maximize },
    { name: "Design Scaler", href: "/embroidery/design-scaler", icon: Shield },
];
const faqItems = [
    { q: "What stabilizer should I use for T-shirts?", a: "Cut-away stabilizer (medium weight). Knit fabrics stretch, and tear-away will distort the design when removed." },
    { q: "Can I use tear-away on knit fabric?", a: "No. Tearing the stabilizer pulls and distorts knit fabric. Always use cut-away for knits." },
    { q: "Do I need a topping for fleece?", a: "Yes. Without topping, stitches sink into the pile and disappear. Use clear water-soluble topping on top of the fabric." },
];

type StabRec = { stabilizer: string; layers: string; topping: string; note: string };
function getRecommendation(fabric: string, density: string): StabRec {
    const isKnit = ["jersey", "interlock", "athletic"].includes(fabric);
    const isTerry = fabric === "terry"; const isSheer = fabric === "sheer"; const isFSL = fabric === "fsl";
    if (isFSL) return { stabilizer: "Water-soluble (wash-away)", layers: "2-3", topping: "None", note: "Entire stabilizer dissolves, leaving only thread structure." };
    if (isSheer) return { stabilizer: "Water-soluble + lightweight cut-away", layers: "1-2", topping: "Clear solvy", note: "Wash-away for main support; light cut-away if item is washed often." };
    if (isTerry) return { stabilizer: "Cut-away (medium-heavy)", layers: "1-2", topping: "Clear water-soluble topping required", note: "Topping prevents stitches from sinking into pile. Essential." };
    if (isKnit) { const ly = density === "dense" ? "2" : "1"; return { stabilizer: "Cut-away stretch (medium)", layers: ly, topping: density === "dense" ? "Optional topping" : "None needed", note: "Never use tear-away on knits -- distorts when removed." }; }
    if (density === "dense") return { stabilizer: "Cut-away (medium-heavy)", layers: "1-2", topping: "None", note: "Dense designs need permanent support for long-term wear." };
    return { stabilizer: "Tear-away (medium)", layers: "1", topping: "None", note: "Stable woven fabric with moderate design -- tear-away works well." };
}

export default function StabilizerSelectorPage() {
    const [fabric, setFabric] = useState("cotton"); const [density, setDensity] = useState("medium");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const rec = getRecommendation(fabric, density);

    const matrix = [
        { fabric: "Stable woven", light: "Tear-away 1 layer", med: "Tear-away 1-2 layers", dense: "Cut-away 1-2 layers" },
        { fabric: "Knit", light: "Cut-away stretch", med: "Cut-away stretch 1-2", dense: "Cut-away stretch 2" },
        { fabric: "Terry / Fleece", light: "Cut-away + topping", med: "Cut-away + topping", dense: "Cut-away + topping" },
        { fabric: "Sheer", light: "Wash-away", med: "Wash-away", dense: "Wash-away + cut-away" },
    ];

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Embroidery", href: "/embroidery" }, { label: "Stabilizer Selector" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Shield size={14} strokeWidth={1.5} /> Embroidery</span><h1>Embroidery Stabilizer Selector</h1><p>Select the correct stabilizer type based on your fabric and design density.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Your Project</h2>
                    <div className="calculator-form"><div className="calculator-form-row">
                        <div className="input-group"><label className="input-label">Fabric Type</label><select className="input-field" value={fabric} onChange={e => setFabric(e.target.value)}><option value="cotton">Quilting cotton / broadcloth</option><option value="denim">Denim / canvas</option><option value="jersey">Jersey knit (T-shirt)</option><option value="interlock">Interlock knit</option><option value="athletic">Athletic / stretchy knit</option><option value="terry">Toweling / terry / fleece</option><option value="sheer">Sheer / organza</option><option value="fsl">Water-soluble only (FSL)</option></select></div>
                        <div className="input-group"><label className="input-label">Design Density</label><select className="input-field" value={density} onChange={e => setDensity(e.target.value)}><option value="light">Light (outline, running)</option><option value="medium">Medium (lettering, simple fill)</option><option value="dense">Dense (solid fill, logos)</option></select></div>
                    </div></div>
                    <div className="calculator-divider" />
                    <div className="result-card"><div className="result-prefix">Recommended Stabilizer</div><div className="result-value" style={{ fontSize: "var(--text-lg)" }}>{rec.stabilizer}</div><div className="result-label">Layers: {rec.layers} | Topping: {rec.topping}</div></div>
                    <p style={{ margin: "12px 0", padding: 12, fontSize: "var(--text-sm)", background: "var(--color-surface-hover)", borderRadius: 8, color: "var(--color-text-secondary)" }}>{rec.note}</p>
                    <div className="calculator-card" style={{ marginTop: 16 }}><h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 8 }}>Decision Matrix</h3>
                        <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Fabric</th><th>Light</th><th>Medium</th><th>Dense</th></tr></thead>
                            <tbody>{matrix.map(r => (<tr key={r.fabric}><td style={{ fontWeight: 600 }}>{r.fabric}</td><td>{r.light}</td><td>{r.med}</td><td>{r.dense}</td></tr>))}</tbody>
                        </table></div>
                    </div>
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}