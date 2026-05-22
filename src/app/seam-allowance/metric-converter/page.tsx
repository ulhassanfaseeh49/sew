"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRightLeft, Copy, Printer, ChevronDown, Ruler, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const quickRef = [
  { imp: '1/4"', exact: "6.35 mm", practical: "6 mm", note: "Close enough for quilting" },
  { imp: '3/8"', exact: "9.53 mm", practical: "10 mm / 1 cm", note: "Round up" },
  { imp: '1/2"', exact: "12.7 mm", practical: "13 mm / 1.3 cm", note: "Round to nearest mm" },
  { imp: '5/8"', exact: "15.88 mm", practical: "15 mm / 1.5 cm", note: "Standard metric equivalent" },
  { imp: '3/4"', exact: "19.05 mm", practical: "19 mm / 2 cm", note: "Round to 2cm for ease" },
  { imp: '1"', exact: "25.4 mm", practical: "25 mm / 2.5 cm", note: "Round to 2.5cm" },
];

const relatedTools = [
  { name: "SA Converter", href: "/seam-allowance/converter", icon: Ruler },
  { name: "Standard Guide", href: "/seam-allowance/standard-guide", icon: BookOpen },
  { name: "SA Adder", href: "/seam-allowance/adder", icon: Ruler },
];
const faqItems = [
  { q: "Is 1.5cm the same as 5/8 inch?", a: "Not exactly. 5/8\" = 1.5875cm. But 1.5cm is the accepted metric equivalent. The 0.88mm difference is negligible in practice." },
  { q: "Should I round metric SA?", a: "Yes. Sewing to 15.88mm is impractical. Round to the nearest practical marking on your ruler: 1.5cm for 5/8\", 1cm for 3/8\", 6mm for 1/4\"." },
  { q: "Do European patterns use different SA?", a: "Yes. European patterns use metric SA (typically 1.5cm for garments, 1cm for facings). Some brands (Burda) include SA, others require you to add it." },
];

export default function MetricConverterPage() {
  const [val, setVal] = useState(""); const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const v = parseFloat(val) || 0; const mm = v * 25.4; const cm = v * 2.54;
  const hasResult = v > 0;

  const handleCopy = useCallback(() => { navigator.clipboard.writeText(`${v}" = ${mm.toFixed(1)}mm = ${cm.toFixed(2)}cm (practical: ${Math.round(mm)}mm)`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [v, mm, cm]);

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Seam Allowance", href: "/seam-allowance" }, { label: "Metric Converter" }]} />
      <div className="calculator-layout"><div className="calculator-main">
        <div className={styles.toolHeader}><span className="category-badge"><ArrowRightLeft size={14} strokeWidth={1.5} /> Seam Allowance</span><h1>Seam Allowance to Metric Converter</h1><p>Convert imperial seam allowances to practical metric equivalents.</p></div>
        <div className="calculator-card"><h2 className={styles.calcTitle}>Convert Imperial to Metric</h2>
          <div className="calculator-form"><div className="input-group"><label className="input-label">Imperial SA (inches)</label><input type="number" className="input-field input-mono" placeholder="e.g., 0.625" value={val} onChange={e => setVal(e.target.value)} min="0" step="0.125" /></div></div>
          {hasResult && (<div><div className="calculator-divider" />
            <div className="result-card"><div className="result-prefix">Metric Equivalent</div><div className="result-value">{cm.toFixed(2)} cm</div><div className="result-label">{mm.toFixed(1)} mm (practical: {Math.round(mm)} mm)</div></div>
            <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
          </div>)}
        </div>
        <div className="calculator-card"><h2 className={styles.sectionTitle}>Quick Reference: Imperial to Practical Metric</h2>
          <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Imperial</th><th>Exact mm</th><th>Practical</th><th>Note</th></tr></thead>
            <tbody>{quickRef.map(r => (<tr key={r.imp}><td style={{ fontWeight: 600 }}>{r.imp}</td><td>{r.exact}</td><td style={{ fontWeight: 600, color: "var(--color-accent)" }}>{r.practical}</td><td style={{ fontFamily: "inherit", fontSize: 13 }}>{r.note}</td></tr>))}</tbody>
          </table></div>
        </div>
        <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
      </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
    </div>);
}