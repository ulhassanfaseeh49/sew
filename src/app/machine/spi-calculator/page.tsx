"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Calculator, Copy, Printer, ChevronDown, Ruler, Settings } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const convTable = [
    { mm: "0.5", spi: "51", cat: "Extremely short" }, { mm: "1.0", spi: "25", cat: "Very short (reinforcement)" },
    { mm: "1.5", spi: "17", cat: "Short (fine fabrics)" }, { mm: "2.0", spi: "12.7", cat: "Medium-short" },
    { mm: "2.5", spi: "10.2", cat: "Standard (most sewing)" }, { mm: "3.0", spi: "8.5", cat: "Medium-long (topstitch)" },
    { mm: "3.5", spi: "7.3", cat: "Long (heavy topstitch)" }, { mm: "4.0", spi: "6.4", cat: "Very long (gathering)" },
    { mm: "4.5", spi: "5.6", cat: "Basting" }, { mm: "5.0", spi: "5.1", cat: "Basting" }, { mm: "6.0", spi: "4.2", cat: "Maximum basting" },
];

const relatedTools = [
    { name: "Stitch Length Calculator", href: "/machine/stitch-length", icon: Ruler },
    { name: "Stitch Width Guide", href: "/machine/stitch-width", icon: Ruler },
    { name: "Tension Guide", href: "/machine/tension-guide", icon: Settings },
];

const faqItems = [
    { q: "How do I convert SPI to mm?", a: "mm = 25.4 ÷ SPI. For example: 10 SPI = 25.4 ÷ 10 = 2.54mm. Set machine to 2.5mm." },
    { q: "What SPI should I use for quilting?", a: "Machine quilting: 10-12 SPI (2.1-2.5mm). Hand quilting: aim for 8-12 stitches per inch (varies by experience)." },
    { q: "My vintage machine has numbers 0-9, not mm. What do they mean?", a: "Most vintage machines: lower number = shorter stitch, higher = longer. Number 4-5 usually equals about 2.5mm (10 SPI). Test on scrap and count stitches in 1 inch." },
];

export default function SPICalculatorPage() {
    const [mode, setMode] = useState<"mmToSpi" | "spiToMm">("mmToSpi");
    const [value, setValue] = useState("");
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    const v = parseFloat(value) || 0;
    const result = mode === "mmToSpi" ? (v > 0 ? (25.4 / v) : 0) : (v > 0 ? (25.4 / v) : 0);
    const resultLabel = mode === "mmToSpi" ? `${result.toFixed(1)} SPI` : `${result.toFixed(1)} mm`;
    const hasResult = v > 0;

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(mode === "mmToSpi" ? `${v}mm = ${result.toFixed(1)} SPI` : `${v} SPI = ${result.toFixed(1)}mm`);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    }, [mode, v, result]);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Machine Tools", href: "/machine" }, { label: "SPI Calculator" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Calculator size={14} strokeWidth={1.5} /> Sewing Machine Tool</span>
                        <h1>Stitches Per Inch (SPI) Calculator</h1>
                        <p>Convert between millimeters and stitches per inch. Essential for vintage machines and pattern instructions.</p>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.calcTitle}>Convert</h2>
                        <div className="calculator-form">
                            <div className="input-group">
                                <label className="input-label">Conversion Direction</label>
                                <select className="input-field" value={mode} onChange={e => setMode(e.target.value as "mmToSpi" | "spiToMm")}>
                                    <option value="mmToSpi">mm → SPI</option>
                                    <option value="spiToMm">SPI → mm</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label className="input-label">{mode === "mmToSpi" ? "Stitch Length (mm)" : "Stitches Per Inch"}</label>
                                <input type="number" className="input-field input-mono" placeholder={mode === "mmToSpi" ? "e.g., 2.5" : "e.g., 10"} value={value} onChange={e => setValue(e.target.value)} min="0.1" step="0.1" />
                                <span className="input-helper">Formula: {mode === "mmToSpi" ? "SPI = 25.4 ÷ mm" : "mm = 25.4 ÷ SPI"}</span>
                            </div>
                        </div>
                        {hasResult && (
                            <div>
                                <div className="calculator-divider" />
                                <div className="result-card"><div className="result-prefix">{mode === "mmToSpi" ? "Stitches Per Inch" : "Stitch Length"}</div><div className="result-value">{resultLabel}</div></div>
                                <div className="toolbar" style={{ marginTop: 16 }}>
                                    <button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button>
                                    <button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.sectionTitle}>Complete Conversion Reference</h2>
                        <div className={styles.tableWrap}>
                            <table className={styles.convTable}>
                                <thead><tr><th>mm</th><th>SPI</th><th>Category</th></tr></thead>
                                <tbody>{convTable.map(c => (<tr key={c.mm}><td style={{ fontWeight: 600 }}>{c.mm}</td><td>{c.spi}</td><td style={{ fontFamily: "inherit" }}>{c.cat}</td></tr>))}</tbody>
                            </table>
                        </div>
                    </div>
                    <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside>
            </div>
        </div>
    );
}