"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Layers, Copy, Printer, ChevronDown, Ruler, Scissors } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const gradingRef = [
  { area: "Enclosed seams (collars, facings)", inner: "Trim to 1/4\"", outer: "Trim to 3/8\"", notes: "Inner shorter to prevent ridge showing through" },
  { area: "Armhole + bodice junction", inner: "Grade to 1/4\"", outer: "Leave at 3/8\"", notes: "Reduces bulk at high-stress intersection" },
  { area: "Waistband junction", inner: "Trim to 1/4\"", outer: "Trim to 3/8\"", notes: "Critical for flat waistband finish" },
  { area: "Corner points (collars)", inner: "Clip diagonally", outer: "Trim close", notes: "Creates sharp, clean corners when turned" },
  { area: "Multi-layer intersections", inner: "Each layer 1/8\" shorter", outer: "Full width", notes: "Stagger widths to distribute bulk evenly" },
];

const relatedTools = [
  { name: "Curved Seams", href: "/seam-allowance/curved-seams", icon: Ruler },
  { name: "Finish Comparison", href: "/seam-allowance/finish-comparison", icon: Scissors },
  { name: "SA Converter", href: "/seam-allowance/converter", icon: Ruler },
];
const faqItems = [
  { q: "What is seam grading?", a: "Trimming each layer of a multi-layer seam to a different width. The layer closest to the outside stays widest; each inner layer is progressively narrower. This prevents a visible ridge." },
  { q: "Why not just trim all layers the same?", a: "Equal trimming creates a single thick ridge that shows through on the right side. Staggering widths distributes the bulk gradually for a smooth finish." },
  { q: "Where is grading most important?", a: "Enclosed seams: collars, cuffs, facings, waistbands — anywhere the SA is folded to the inside and pressed. Any place where bulk would be visible from the right side." },
];

export default function GradingPage() {
  const [originalSA, setOriginalSA] = useState("0.625"); const [layers, setLayers] = useState("2");
  const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

  const sa = parseFloat(originalSA) || 0.625; const n = parseInt(layers) || 2;
  const graded = Array.from({ length: n }, (_, i) => {
    const width = sa - (i * 0.125);
    return { layer: i + 1, label: i === 0 ? "Outer (closest to right side)" : i === n - 1 ? "Inner (closest to body)" : `Layer ${i + 1}`, width: Math.max(width, 0.125) };
  });

  const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Graded SA (${n} layers): ${graded.map(g => `Layer ${g.layer}: ${g.width.toFixed(3)}"`).join(", ")}`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [graded, n]);

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Seam Allowance", href: "/seam-allowance" }, { label: "Grading" }]} />
      <div className="calculator-layout"><div className="calculator-main">
        <div className={styles.toolHeader}><span className="category-badge"><Layers size={14} strokeWidth={1.5} /> Seam Allowance</span><h1>Seam Allowance Grading Calculator</h1><p>Calculate graded seam allowances for reducing bulk at intersections.</p></div>
        <div className="calculator-card"><h2 className={styles.calcTitle}>Grading Settings</h2>
          <div className="calculator-form"><div className="calculator-form-row">
            <div className="input-group"><label className="input-label">Original SA (inches)</label><input type="number" className="input-field input-mono" value={originalSA} onChange={e => setOriginalSA(e.target.value)} min="0.25" step="0.125" /></div>
            <div className="input-group"><label className="input-label">Number of Layers</label><select className="input-field" value={layers} onChange={e => setLayers(e.target.value)}><option value="2">2 layers</option><option value="3">3 layers</option><option value="4">4 layers</option></select></div>
          </div></div>
          <div className="calculator-divider" />
          <div className={styles.resultDetails}>{graded.map(g => (<div className="result-row" key={g.layer}><span className="result-row-label">{g.label}</span><span className="result-row-value" style={{ fontWeight: 600 }}>{g.width.toFixed(3)}&quot;</span></div>))}</div>
          <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
        </div>
        <div className="calculator-card"><h2 className={styles.sectionTitle}>Grading Reference by Area</h2>
          <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Area</th><th>Inner Layer</th><th>Outer Layer</th><th>Notes</th></tr></thead>
            <tbody>{gradingRef.map(g => (<tr key={g.area}><td style={{ fontFamily: "inherit", fontWeight: 500 }}>{g.area}</td><td>{g.inner}</td><td>{g.outer}</td><td style={{ fontFamily: "inherit", fontSize: 13 }}>{g.notes}</td></tr>))}</tbody>
          </table></div>
        </div>
        <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
      </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
    </div>);
}