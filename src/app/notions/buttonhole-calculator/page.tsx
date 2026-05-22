"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Scissors, Copy, Printer, ChevronDown, CircleDot, Ruler } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Button Size", href: "/notions/button-size-calculator", icon: CircleDot },
    { name: "Button Spacing", href: "/notions/button-spacing", icon: Ruler },
    { name: "Zipper Length", href: "/notions/zipper-length", icon: Scissors },
];
const faqItems = [
    { q: "What is the buttonhole length formula?", a: "Buttonhole length = button diameter + button thickness + 1/8\" (3mm) ease. For shank buttons: diameter + shank length." },
    { q: "Why are my buttonholes too tight?", a: "Most likely you forgot to add for button thickness. A thick button needs more room than just its diameter. Also, very thick fabric adds bulk." },
    { q: "Should I always sew a test buttonhole first?", a: "Always. Test on a scrap of the same fabric with the same interfacing. Check that the button slides through smoothly without being loose." },
];

export default function ButtonholeCalcPage() {
    const [btnType, setBtnType] = useState("flat"); const [diameter, setDiameter] = useState("12.7");
    const [thickness, setThickness] = useState("3"); const [shankLen, setShankLen] = useState("5");
    const [fabricAdj, setFabricAdj] = useState("0");
    const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

    const d = parseFloat(diameter) || 0; const t = parseFloat(thickness) || 0;
    const sl = parseFloat(shankLen) || 0; const fa = parseFloat(fabricAdj) || 0;
    const ease = 3; // 3mm standard ease
    let bhLength = 0;
    if (btnType === "flat") { bhLength = d + t + ease + fa; }
    else if (btnType === "shank") { bhLength = d + sl + ease + fa; }
    else { bhLength = d + t + ease + fa; }
    const bhInches = bhLength / 25.4;
    const hasResult = d > 0;

    const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Buttonhole: ${bhLength.toFixed(1)}mm (${bhInches.toFixed(3)}"). Button: ${d}mm ${btnType}.`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [bhLength, bhInches, d, btnType]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Notions", href: "/notions" }, { label: "Buttonhole Calculator" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} strokeWidth={1.5} /> Notions</span><h1>Buttonhole Length Calculator</h1><p>Calculate correct buttonhole length for flat, shank, or novelty buttons.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Button Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Button Type</label><select className="input-field" value={btnType} onChange={e => setBtnType(e.target.value)}><option value="flat">Flat (2/4-hole)</option><option value="shank">Shank button</option><option value="novelty">Novelty/irregular</option></select></div>
                            <div className="input-group"><label className="input-label">Diameter (mm)</label><input type="number" className="input-field input-mono" value={diameter} onChange={e => setDiameter(e.target.value)} min="1" step="0.5" /></div>
                        </div>
                        <div className="calculator-form-row">
                            {btnType !== "shank" && <div className="input-group"><label className="input-label">Thickness (mm)</label><input type="number" className="input-field input-mono" value={thickness} onChange={e => setThickness(e.target.value)} min="0" step="0.5" /></div>}
                            {btnType === "shank" && <div className="input-group"><label className="input-label">Shank Length (mm)</label><input type="number" className="input-field input-mono" value={shankLen} onChange={e => setShankLen(e.target.value)} min="1" step="0.5" /></div>}
                            <div className="input-group"><label className="input-label">Fabric Adjustment (mm)</label><select className="input-field" value={fabricAdj} onChange={e => setFabricAdj(e.target.value)}><option value="0">Standard fabric (0)</option><option value="1.5">Thick fabric (+1.5mm)</option><option value="3">Very thick (+3mm)</option></select></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Buttonhole Length</div><div className="result-value">{bhLength.toFixed(1)}mm</div><div className="result-label">{bhInches.toFixed(3)}&quot; (round to nearest 1/8&quot;: {(Math.ceil(bhInches * 8) / 8).toFixed(3)}&quot;)</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Button diameter</span><span className="result-row-value">{d}mm</span></div>
                            <div className="result-row"><span className="result-row-label">{btnType === "shank" ? "Shank length" : "Thickness"}</span><span className="result-row-value">{btnType === "shank" ? sl : t}mm</span></div>
                            <div className="result-row"><span className="result-row-label">Ease</span><span className="result-row-value">{ease}mm</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}