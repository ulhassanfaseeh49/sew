"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Copy, Printer, ChevronDown, Ruler, Minus } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const presets = [
  { label: '1/4" (quilting)', val: 0.25 }, { label: '3/8"', val: 0.375 }, { label: '1/2"', val: 0.5 },
  { label: '5/8" (standard)', val: 0.625 }, { label: '1"', val: 1.0 }, { label: '1.5 cm', val: 0.59 },
];

const relatedTools = [
  { name: "SA Subtractor", href: "/seam-allowance/subtractor", icon: Minus },
  { name: "SA Converter", href: "/seam-allowance/converter", icon: Ruler },
  { name: "Standard Guide", href: "/seam-allowance/standard-guide", icon: Ruler },
];
const faqItems = [
  { q: "How do I add seam allowance to a pattern?", a: "Add the seam allowance to ALL edges that will be sewn. For a 5/8\" SA, a 10\" finished width becomes 10\" + 5/8\" + 5/8\" = 11.25\" cutting width." },
  { q: "Do I add SA to both sides?", a: "Yes — each edge that gets sewn needs its own seam allowance. A rectangle with seams on all 4 sides gets SA added to all 4 edges." },
  { q: "What about hem allowance?", a: "Hem allowance is separate from seam allowance. Common hems: 1\" single fold, 1\" double fold (needs 2\"), or 1/4\" rolled hem." },
];

export default function SAAdderPage() {
  const [measurement, setMeasurement] = useState(""); const [sa, setSa] = useState("0.625");
  const [sides, setSides] = useState("2");
  const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

  const m = parseFloat(measurement) || 0; const s = parseFloat(sa) || 0.625; const n = parseInt(sides) || 2;
  const cutting = m + (s * n);
  const hasResult = m > 0;

  const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Finished: ${m}" + ${s}" SA × ${n} sides = ${cutting.toFixed(3)}" cutting measurement`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [m, s, n, cutting]);

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Seam Allowance", href: "/seam-allowance" }, { label: "Adder" }]} />
      <div className="calculator-layout"><div className="calculator-main">
        <div className={styles.toolHeader}><span className="category-badge"><Plus size={14} strokeWidth={1.5} /> Seam Allowance</span><h1>Seam Allowance Adder</h1><p>Add seam allowance to finished measurements to get cutting measurements.</p></div>
        <div className="calculator-card"><h2 className={styles.calcTitle}>Add Seam Allowance</h2>
          <div className="calculator-form">
            <div className="input-group"><label className="input-label">Finished Measurement (inches)</label><input type="number" className="input-field input-mono" placeholder="e.g., 10" value={measurement} onChange={e => setMeasurement(e.target.value)} min="0" step="0.125" /></div>
            <div className="calculator-form-row">
              <div className="input-group"><label className="input-label">Seam Allowance</label><select className="input-field" value={sa} onChange={e => setSa(e.target.value)}>{presets.map(p => <option key={p.val} value={p.val}>{p.label}</option>)}<option value="custom">Custom</option></select></div>
              <div className="input-group"><label className="input-label">Sides to Add</label><select className="input-field" value={sides} onChange={e => setSides(e.target.value)}><option value="1">1 side</option><option value="2">2 sides</option><option value="3">3 sides</option><option value="4">4 sides</option></select></div>
            </div>
          </div>
          {hasResult && (<div><div className="calculator-divider" />
            <div className="result-card"><div className="result-prefix">Cutting Measurement</div><div className="result-value">{cutting.toFixed(3)}&quot;</div><div className="result-label">{m}&quot; + ({s}&quot; × {n}) = {cutting.toFixed(3)}&quot;</div></div>
            <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
          </div>)}
        </div>
        <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
      </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
    </div>);
}