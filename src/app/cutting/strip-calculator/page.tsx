"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Scissors, Copy, Printer, ChevronDown, Ruler, Grid3X3 } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
    { name: "Square Cutting", href: "/cutting/square-calculator", icon: Grid3X3 },
    { name: "Sub-Cut Calc", href: "/cutting/sub-cut-calculator", icon: Scissors },
    { name: "Waste Minimizer", href: "/cutting/waste-minimizer", icon: Ruler },
];
const faqItems = [
    { q: "How many strips can I get from a yard of fabric?", a: "Divide 36 inches (1 yard) by your strip width. For example, 2.5-inch strips give 14 strips per yard. Always subtract selvage from usable width first." },
    { q: "Should I cut WOF or LOF strips?", a: "WOF (width of fabric) strips are standard for quilting. LOF (length of fabric) strips are longer with no joins -- ideal for borders and sashing." },
    { q: "Should I cut the widest strips first?", a: "Yes. Always cut the widest strips first to maximize usable fabric. If a mistake happens, narrower strips can still be recovered from the remnant." },
];

export default function StripCalcPage() {
    const [stripWidth, setStripWidth] = useState("2.5");
    const [fabWidth, setFabWidth] = useState("44");
    const [fabLength, setFabLength] = useState("36");
    const [selvage, setSelvage] = useState("0.5");
    const [direction, setDirection] = useState("wof");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const sw = parseFloat(stripWidth) || 0;
    const fw = parseFloat(fabWidth) || 44;
    const fl = parseFloat(fabLength) || 36;
    const sv = parseFloat(selvage) || 0.5;
    const usableWidth = fw - sv * 2;

    let numStrips = 0;
    let stripLen = 0;
    let remainder = 0;

    if (sw > 0) {
        if (direction === "wof") {
            numStrips = Math.floor(fl / sw);
            stripLen = usableWidth;
            remainder = fl - numStrips * sw;
        } else {
            numStrips = Math.floor(usableWidth / sw);
            stripLen = fl;
            remainder = usableWidth - numStrips * sw;
        }
    }
    const hasResult = sw > 0 && numStrips > 0;
    const efficiency = hasResult ? ((numStrips * sw * stripLen) / (fw * fl) * 100) : 0;

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(`${numStrips} strips of ${sw}" x ${stripLen.toFixed(1)}", remainder: ${remainder.toFixed(2)}"`);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    }, [numStrips, sw, stripLen, remainder]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Cutting Tools", href: "/cutting" }, { label: "Strip Calculator" }]} />
            <div className="calculator-layout"><div className="calculator-main">
                <div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} strokeWidth={1.5} /> Cutting</span><h1>Strip Cutting Calculator</h1><p>Calculate how many strips of a given width can be cut from your fabric.</p></div>
                <div className="calculator-card"><h2 className={styles.calcTitle}>Fabric and Strip Details</h2>
                    <div className="calculator-form">
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Fabric Width (in)</label><input type="number" className="input-field input-mono" value={fabWidth} onChange={e => setFabWidth(e.target.value)} min="1" /></div>
                            <div className="input-group"><label className="input-label">Fabric Length (in)</label><input type="number" className="input-field input-mono" value={fabLength} onChange={e => setFabLength(e.target.value)} min="1" /></div>
                            <div className="input-group"><label className="input-label">Selvage per Side (in)</label><input type="number" className="input-field input-mono" value={selvage} onChange={e => setSelvage(e.target.value)} min="0" step="0.25" /></div>
                        </div>
                        <div className="calculator-form-row">
                            <div className="input-group"><label className="input-label">Strip Width (in)</label><input type="number" className="input-field input-mono" value={stripWidth} onChange={e => setStripWidth(e.target.value)} min="0.5" step="0.25" /></div>
                            <div className="input-group"><label className="input-label">Cutting Direction</label><select className="input-field" value={direction} onChange={e => setDirection(e.target.value)}><option value="wof">WOF (across width)</option><option value="lof">LOF (along length)</option></select></div>
                        </div>
                    </div>
                    {hasResult && (<div><div className="calculator-divider" />
                        <div className="result-card"><div className="result-prefix">Strips Available</div><div className="result-value">{numStrips} strips</div><div className="result-label">Each {sw}&quot; wide x {stripLen.toFixed(1)}&quot; long</div></div>
                        <div className={styles.resultDetails} style={{ marginTop: 12 }}>
                            <div className="result-row"><span className="result-row-label">Usable width</span><span className="result-row-value">{usableWidth.toFixed(1)}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Remainder</span><span className="result-row-value">{remainder.toFixed(2)}&quot;</span></div>
                            <div className="result-row"><span className="result-row-label">Fabric efficiency</span><span className="result-row-value">{efficiency.toFixed(0)}%</span></div>
                        </div>
                        <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
                    </div>)}
                </div>
                <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
            </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
        </div>);
}