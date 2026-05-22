"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Scissors, Copy, Printer, ChevronDown, Ruler, Scale } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
  { name: "French Seam Calc", href: "/seam-allowance/french-seam", icon: Scissors },
  { name: "Finish Comparison", href: "/seam-allowance/finish-comparison", icon: Scale },
  { name: "Hong Kong Finish", href: "/seam-allowance/hong-kong", icon: Ruler },
];
const faqItems = [
  { q: "What is a flat-felled seam?", a: "A strong, fully enclosed seam with two rows of stitching visible on the outside. One SA is trimmed, the other folds over it. Used on jeans, menswear, and activewear." },
  { q: "Why are flat-felled seams so strong?", a: "Two rows of stitching plus folded fabric = 4 layers at the seam. This distributes stress and prevents fraying. That's why they're used on workwear and denim." },
  { q: "What's the difference between flat-felled and mock flat-felled?", a: "True flat-felled: sewn wrong sides together, trimmed, folded, topstitched. Mock: sewn right sides, pressed open, edges turned under and topstitched. Mock is easier but less durable." },
];

export default function FlatFelledPage() {
  const [finishedWidth, setFinishedWidth] = useState("0.375");
  const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

  const fw = parseFloat(finishedWidth) || 0.375;
  const narrowSA = fw + 0.125; // trim to 1/8" inside the fold
  const wideSA = fw * 2 + 0.125; // fold over + 1/8" for turning
  const totalSA = narrowSA + wideSA;

  const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Flat-felled seam: Narrow side ${narrowSA.toFixed(3)}", Wide side ${wideSA.toFixed(3)}", Total ${totalSA.toFixed(3)}" (${fw}" finished width)`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [narrowSA, wideSA, totalSA, fw]);

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Seam Allowance", href: "/seam-allowance" }, { label: "Flat-Felled" }]} />
      <div className="calculator-layout"><div className="calculator-main">
        <div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} strokeWidth={1.5} /> Seam Allowance</span><h1>Flat-Felled Seam Allowance Calculator</h1><p>Calculate seam allowance for flat-felled seams with adjustable finishing widths.</p></div>
        <div className="calculator-card"><h2 className={styles.calcTitle}>Flat-Felled Settings</h2>
          <div className="calculator-form"><div className="input-group"><label className="input-label">Desired Finished Width (inches)</label><input type="number" className="input-field input-mono" value={finishedWidth} onChange={e => setFinishedWidth(e.target.value)} min="0.125" step="0.125" /><span className="input-helper">Visible topstitching width on finished garment</span></div></div>
          <div className="calculator-divider" />
          <div className="result-card"><div className="result-prefix">Seam Allowances Needed</div><div className="result-value">Narrow: {narrowSA.toFixed(3)}&quot; / Wide: {wideSA.toFixed(3)}&quot;</div><div className="result-label">For {fw}&quot; finished visible width</div></div>
          <div className={styles.resultDetails} style={{ marginTop: 16 }}>
            <div className="result-row"><span className="result-row-label">Step 1</span><span className="result-row-value">Sew wrong sides together at seam line</span></div>
            <div className="result-row"><span className="result-row-label">Step 2</span><span className="result-row-value">Trim narrow side to 1/8&quot;</span></div>
            <div className="result-row"><span className="result-row-label">Step 3</span><span className="result-row-value">Fold wide side over narrow, press</span></div>
            <div className="result-row"><span className="result-row-label">Step 4</span><span className="result-row-value">Topstitch at {fw}&quot; from fold edge</span></div>
          </div>
          <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
        </div>
        <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
      </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
    </div>);
}