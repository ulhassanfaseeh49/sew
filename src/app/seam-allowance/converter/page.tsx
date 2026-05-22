"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Ruler, Copy, Printer, ChevronDown, BookOpen, Scissors } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const saValues = [
  { imp: '1/4"', dec: 0.25, mm: 6.35, cm: 0.64, use: "Quilting, piecing" },
  { imp: '3/8"', dec: 0.375, mm: 9.53, cm: 0.95, use: "Narrow seams, facings" },
  { imp: '1/2"', dec: 0.50, mm: 12.7, cm: 1.27, use: "Home décor, crafts" },
  { imp: '5/8"', dec: 0.625, mm: 15.88, cm: 1.59, use: "US garment standard" },
  { imp: '3/4"', dec: 0.75, mm: 19.05, cm: 1.91, use: "Heavy fabrics" },
  { imp: '1"', dec: 1.0, mm: 25.4, cm: 2.54, use: "Flat-felled seams, alterations" },
  { imp: '1.5 cm', dec: 0.59, mm: 15.0, cm: 1.5, use: "European/metric standard" },
  { imp: '1 cm', dec: 0.39, mm: 10.0, cm: 1.0, use: "Japanese patterns" },
];

const relatedTools = [
  { name: "SA Adder", href: "/seam-allowance/adder", icon: Ruler },
  { name: "Standard Guide", href: "/seam-allowance/standard-guide", icon: BookOpen },
  { name: "Metric Converter", href: "/seam-allowance/metric-converter", icon: Ruler },
];
const faqItems = [
  { q: "What is the standard seam allowance?", a: "US commercial patterns: 5/8\" (1.6cm). European: 1.5cm. Quilting: 1/4\" (6mm). Japanese patterns often include no seam allowance — you add your own." },
  { q: "Why is 5/8\" the standard?", a: "It provides enough fabric to: 1) finish the edge (serge/zigzag), 2) grade for bulk reduction, 3) let out slightly for fitting, while not wasting excessive fabric." },
  { q: "How do I convert 5/8\" to metric?", a: "5/8\" = 15.88mm = 1.59cm. In practice, metric sewists round to 1.5cm. This is close enough for all but the most precision-critical work." },
];

export default function SAConverterPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [val, setVal] = useState(""); const [unit, setUnit] = useState<"in" | "mm" | "cm">("in");
  const [copied, setCopied] = useState(false);

  const v = parseFloat(val) || 0;
  const inVal = unit === "in" ? v : unit === "mm" ? v / 25.4 : v / 2.54;
  const mmVal = unit === "mm" ? v : unit === "in" ? v * 25.4 : v * 10;
  const cmVal = unit === "cm" ? v : unit === "in" ? v * 2.54 : v / 10;
  const hasResult = v > 0;

  const handleCopy = useCallback(() => { navigator.clipboard.writeText(`${inVal.toFixed(3)}" = ${mmVal.toFixed(1)}mm = ${cmVal.toFixed(2)}cm`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [inVal, mmVal, cmVal]);

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Seam Allowance", href: "/seam-allowance" }, { label: "Converter" }]} />
      <div className="calculator-layout"><div className="calculator-main">
        <div className={styles.toolHeader}><span className="category-badge"><Ruler size={14} strokeWidth={1.5} /> Seam Allowance</span><h1>Seam Allowance Converter</h1><p>Convert between common seam allowances in imperial and metric with quick reference.</p></div>
        <div className="calculator-card"><h2 className={styles.calcTitle}>Convert</h2>
          <div className="calculator-form"><div className="calculator-form-row">
            <div className="input-group"><label className="input-label">Value</label><input type="number" className="input-field input-mono" placeholder="e.g., 0.625" value={val} onChange={e => setVal(e.target.value)} min="0" step="0.001" /></div>
            <div className="input-group"><label className="input-label">Unit</label><select className="input-field" value={unit} onChange={e => setUnit(e.target.value as "in" | "mm" | "cm")}><option value="in">Inches</option><option value="mm">mm</option><option value="cm">cm</option></select></div>
          </div></div>
          {hasResult && (<div><div className="calculator-divider" />
            <div className={styles.resultDetails}>
              <div className="result-row"><span className="result-row-label">Inches</span><span className="result-row-value">{inVal.toFixed(3)}&quot;</span></div>
              <div className="result-row"><span className="result-row-label">Millimeters</span><span className="result-row-value">{mmVal.toFixed(1)} mm</span></div>
              <div className="result-row"><span className="result-row-label">Centimeters</span><span className="result-row-value">{cmVal.toFixed(2)} cm</span></div>
            </div>
            <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
          </div>)}
        </div>
        <div className="calculator-card"><h2 className={styles.sectionTitle}>Standard Seam Allowance Reference</h2>
          <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>SA</th><th>Decimal</th><th>mm</th><th>cm</th><th>Common Use</th></tr></thead>
            <tbody>{saValues.map(s => (<tr key={s.imp}><td style={{ fontWeight: 600 }}>{s.imp}</td><td>{s.dec}&quot;</td><td>{s.mm}</td><td>{s.cm}</td><td style={{ fontFamily: "inherit", fontSize: 13 }}>{s.use}</td></tr>))}</tbody>
          </table></div>
        </div>
        <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
      </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
    </div>);
}