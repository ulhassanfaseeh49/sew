"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Scissors, Copy, Printer, ChevronDown, Ruler, Scale } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
  { name: "French Seam Calc", href: "/seam-allowance/french-seam", icon: Scissors },
  { name: "Flat-Felled Calc", href: "/seam-allowance/flat-felled", icon: Scissors },
  { name: "Finish Comparison", href: "/seam-allowance/finish-comparison", icon: Scale },
];
const faqItems = [
  { q: "What is a Hong Kong seam finish?", a: "A couture finishing technique where each raw seam edge is bound with a bias strip. Results in a clean, professional interior with no visible raw edges." },
  { q: "When should I use a Hong Kong finish?", a: "Unlined jackets, coats, and tailored garments where the inside is visible. Also great for heavy wovens where French seams add too much bulk." },
  { q: "Do I need true bias strips?", a: "Yes — bias cut allows the strip to curve around the seam edge smoothly without puckering. Straight grain strips will not wrap cleanly." },
];

export default function HongKongPage() {
  const [seamAllowance, setSeamAllowance] = useState("0.625");
  const [stripWidth, setStripWidth] = useState("1.25");
  const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

  const sa = parseFloat(seamAllowance) || 0.625;
  const sw = parseFloat(stripWidth) || 1.25;
  const foldedWidth = sw / 2;
  const visibleBinding = foldedWidth - 0.25; // 1/4" seam to attach

  const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Hong Kong finish: ${sa}" SA, ${sw}" bias strip width, ${foldedWidth}" folded, ~${visibleBinding.toFixed(2)}" visible binding`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [sa, sw, foldedWidth, visibleBinding]);

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Seam Allowance", href: "/seam-allowance" }, { label: "Hong Kong" }]} />
      <div className="calculator-layout"><div className="calculator-main">
        <div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} strokeWidth={1.5} /> Seam Allowance</span><h1>Hong Kong Seam Finish Calculator</h1><p>Calculate bias strip width and seam allowance for Hong Kong seam finishes.</p></div>
        <div className="calculator-card"><h2 className={styles.calcTitle}>Hong Kong Settings</h2>
          <div className="calculator-form"><div className="calculator-form-row">
            <div className="input-group"><label className="input-label">Seam Allowance (inches)</label><input type="number" className="input-field input-mono" value={seamAllowance} onChange={e => setSeamAllowance(e.target.value)} min="0.25" step="0.125" /></div>
            <div className="input-group"><label className="input-label">Bias Strip Cut Width</label><input type="number" className="input-field input-mono" value={stripWidth} onChange={e => setStripWidth(e.target.value)} min="0.5" step="0.125" /><span className="input-helper">Typically 1&quot; to 1.5&quot; cut width</span></div>
          </div></div>
          <div className="calculator-divider" />
          <div className="result-card"><div className="result-prefix">Bias Strip Requirements</div><div className="result-value">{sw}&quot; cut width</div><div className="result-label">{foldedWidth}&quot; folded / ~{visibleBinding.toFixed(2)}&quot; visible binding</div></div>
          <div className={styles.resultDetails} style={{ marginTop: 16 }}>
            <div className="result-row"><span className="result-row-label">Step 1</span><span className="result-row-value">Cut bias strips {sw}&quot; wide</span></div>
            <div className="result-row"><span className="result-row-label">Step 2</span><span className="result-row-value">Sew strip to SA edge at 1/4&quot;</span></div>
            <div className="result-row"><span className="result-row-label">Step 3</span><span className="result-row-value">Fold strip to wrong side, press</span></div>
            <div className="result-row"><span className="result-row-label">Step 4</span><span className="result-row-value">Stitch in the ditch or hand-stitch</span></div>
            <div className="result-row"><span className="result-row-label">Step 5</span><span className="result-row-value">Trim excess strip close to stitching</span></div>
          </div>
          <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
        </div>
        <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
      </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
    </div>);
}