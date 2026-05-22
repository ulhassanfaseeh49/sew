"use client";
import { useState } from "react";
import Link from "next/link";
import { Circle, ChevronDown, Ruler, Scissors } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const curves = [
  { type: "Inward (concave) curve", clip: "Clip perpendicular cuts into SA", spacing: "Every 1/2\" to 1\" depending on curve tightness", notes: "Allows SA to spread open and lie flat" },
  { type: "Outward (convex) curve", clip: "Notch (V-cuts) to remove excess SA", spacing: "Every 1/2\" to 1\" depending on curve tightness", notes: "Removes bulk so SA can fold smoothly" },
  { type: "Gentle curve (neckline back)", clip: "Clip at widest points", spacing: "Every 1\" to 1.5\"", notes: "Minimal clipping needed" },
  { type: "Tight curve (princess seam)", clip: "Clip/notch every 1/2\"", spacing: "Every 1/2\" or closer", notes: "Both sides need treatment — one concave, one convex" },
  { type: "Corner (right angle)", clip: "Clip diagonally across corner", spacing: "Single clip at corner point", notes: "Clip to within 1-2 threads of stitching" },
  { type: "Scalloped edge", clip: "Clip into each scallop valley", spacing: "At each valley point", notes: "Clip almost to stitching for clean curves" },
];

const relatedTools = [
  { name: "Finish Comparison", href: "/seam-allowance/finish-comparison", icon: Scissors },
  { name: "SA Grading", href: "/seam-allowance/grading", icon: Ruler },
  { name: "Standard Guide", href: "/seam-allowance/standard-guide", icon: Ruler },
];
const faqItems = [
  { q: "What is the difference between clipping and notching?", a: "Clipping: single straight cuts into SA on concave (inward) curves — lets SA spread. Notching: V-shaped wedge cuts on convex (outward) curves — removes excess SA bulk." },
  { q: "How close should I clip to the stitching?", a: "Within 1-2 threads of the stitch line. Too far = curve won't lie flat. Too close = weakens seam. Sharper curves need closer clipping." },
  { q: "Should I grade curved seam allowances?", a: "Yes, especially on enclosed curves (collars, facings). Trim the inner layer shorter than the outer layer to prevent a ridge showing through." },
];

export default function CurvedSeamsPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Seam Allowance", href: "/seam-allowance" }, { label: "Curved Seams" }]} />
      <div className="calculator-layout"><div className="calculator-main">
        <div className={styles.toolHeader}><span className="category-badge"><Circle size={14} strokeWidth={1.5} /> Seam Allowance</span><h1>Seam Allowance for Curved Seams Guide</h1><p>Guide for clipping and notching seam allowances on curves with spacing recommendations.</p></div>
        {curves.map(c => (<div key={c.type} className="calculator-card">
          <h3 style={{ fontSize: "var(--text-base)", fontWeight: 600, marginBottom: 6 }}>{c.type}</h3>
          <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.8 }}>
            <div><strong>Method:</strong> {c.clip}</div>
            <div><strong>Spacing:</strong> {c.spacing}</div>
            <div style={{ color: "var(--color-accent)", fontWeight: 500 }}>{c.notes}</div>
          </div>
        </div>))}
        <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
      </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
    </div>);
}