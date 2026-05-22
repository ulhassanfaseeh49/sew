"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Minus, Copy, Printer, ChevronDown, Ruler, Plus } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const presets = [
  { label: '1/4" (quilting)', val: 0.25 }, { label: '3/8"', val: 0.375 }, { label: '1/2"', val: 0.5 },
  { label: '5/8" (standard)', val: 0.625 }, { label: '1"', val: 1.0 }, { label: '1.5 cm', val: 0.59 },
];

const relatedTools = [
  { name: "SA Adder", href: "/seam-allowance/adder", icon: Plus },
  { name: "SA Converter", href: "/seam-allowance/converter", icon: Ruler },
  { name: "Standard Guide", href: "/seam-allowance/standard-guide", icon: Ruler },
];
const faqItems = [
  { q: "Why subtract seam allowance?", a: "To find the finished size of a pattern piece. This helps verify pattern accuracy and plan how pieces fit together before cutting." },
  { q: "What if my cutting measurement is already the finished size?", a: "Some patterns (especially European/Japanese) give finished measurements and require you to add SA. Check your pattern instructions carefully." },
  { q: "How do I know how much SA is included?", a: "US commercial patterns: typically 5/8\". Quilting patterns: 1/4\". European: 1.5cm. Check the pattern envelope or instructions." },
];

export default function SASubtractorPage() {
  const [measurement, setMeasurement] = useState(""); const [sa, setSa] = useState("0.625");
  const [sides, setSides] = useState("2");
  const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

  const m = parseFloat(measurement) || 0; const s = parseFloat(sa) || 0.625; const n = parseInt(sides) || 2;
  const finished = m - (s * n);
  const hasResult = m > 0;

  const handleCopy = useCallback(() => { navigator.clipboard.writeText(`Cutting: ${m}" - ${s}" SA × ${n} sides = ${finished.toFixed(3)}" finished measurement`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [m, s, n, finished]);

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Seam Allowance", href: "/seam-allowance" }, { label: "Subtractor" }]} />
      <div className="calculator-layout"><div className="calculator-main">
        <div className={styles.toolHeader}><span className="category-badge"><Minus size={14} strokeWidth={1.5} /> Seam Allowance</span><h1>Seam Allowance Subtractor</h1><p>Remove seam allowance from cutting measurements to find finished dimensions.</p></div>
        <div className="calculator-card"><h2 className={styles.calcTitle}>Subtract Seam Allowance</h2>
          <div className="calculator-form">
            <div className="input-group"><label className="input-label">Cutting Measurement (inches)</label><input type="number" className="input-field input-mono" placeholder="e.g., 11.25" value={measurement} onChange={e => setMeasurement(e.target.value)} min="0" step="0.125" /></div>
            <div className="calculator-form-row">
              <div className="input-group"><label className="input-label">Seam Allowance</label><select className="input-field" value={sa} onChange={e => setSa(e.target.value)}>{presets.map(p => <option key={p.val} value={p.val}>{p.label}</option>)}</select></div>
              <div className="input-group"><label className="input-label">Sides to Remove</label><select className="input-field" value={sides} onChange={e => setSides(e.target.value)}><option value="1">1 side</option><option value="2">2 sides</option><option value="3">3 sides</option><option value="4">4 sides</option></select></div>
            </div>
          </div>
          {hasResult && (<div><div className="calculator-divider" />
            <div className="result-card"><div className="result-prefix">Finished Measurement</div><div className="result-value">{finished > 0 ? finished.toFixed(3) : "N/A"}&quot;</div><div className="result-label">{m}&quot; - ({s}&quot; × {n}) = {finished.toFixed(3)}&quot;</div></div>
            {finished <= 0 && <p style={{ marginTop: 8, color: "#991b1b", fontSize: "var(--text-sm)" }}>Seam allowance exceeds measurement. Check your inputs.</p>}
            <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
          </div>)}
        </div>
        <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
      </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
    </div>);
}