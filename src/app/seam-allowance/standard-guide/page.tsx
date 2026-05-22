"use client";
import { useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronDown, Ruler, Scale } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const standards = [
  { project: "Quilting", sa: '1/4"', metric: "6mm", notes: "Universal quilting standard. Scant 1/4\" (slightly less) is common." },
  { project: "US garment sewing", sa: '5/8"', metric: "1.5cm", notes: "US commercial pattern standard. Allows finishing, grading, fitting." },
  { project: "European garments", sa: '1.5 cm', metric: "1.5cm", notes: "European/metric standard. Some patterns: 1cm." },
  { project: "Japanese patterns", sa: "Varies", metric: "1cm", notes: "Often no SA included — you add your own (typically 1cm seams, 2-3cm hems)." },
  { project: "Home décor / crafts", sa: '1/2"', metric: "1.3cm", notes: "Common for pillows, bags, accessories." },
  { project: "Knit garments", sa: '1/4" or 3/8"', metric: "6-10mm", notes: "Narrower SA for stretch. Serged edges don't need wide SA." },
  { project: "Lingerie", sa: '1/4"', metric: "6mm", notes: "Narrow for comfort. Often serged or overlocked." },
  { project: "Tailoring / coats", sa: '1"', metric: "2.5cm", notes: "Extra width for pressing open, easing, and alterations." },
  { project: "Flat-felled seams", sa: '1"', metric: "2.5cm", notes: "Needs extra for folding and enclosing raw edge." },
  { project: "French seams", sa: '5/8"', metric: "1.5cm", notes: "3/8\" first pass + 1/4\" second pass." },
];

const relatedTools = [
  { name: "SA Converter", href: "/seam-allowance/converter", icon: Ruler },
  { name: "SA Comparison", href: "/seam-allowance/comparison", icon: Scale },
  { name: "French Seam Calc", href: "/seam-allowance/french-seam", icon: Ruler },
];
const faqItems = [
  { q: "Why do different projects use different seam allowances?", a: "Each SA serves the seam type: quilting needs precision (1/4\"), garments need fitting room (5/8\"), tailoring needs pressing/alteration room (1\"). Wider SA uses more fabric but gives more options." },
  { q: "What if my pattern doesn't specify?", a: "US patterns: assume 5/8\" unless quilting pattern (1/4\"). European: 1.5cm. Japanese: check carefully — many include no SA. When in doubt, measure the pattern piece." },
  { q: "Can I change the seam allowance?", a: "Yes, but adjust all pieces consistently. Reducing SA saves fabric but limits fitting options. Increasing SA helps with alterations but uses more fabric." },
];

export default function StandardGuidePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Seam Allowance", href: "/seam-allowance" }, { label: "Standard Guide" }]} />
      <div className="calculator-layout"><div className="calculator-main">
        <div className={styles.toolHeader}><span className="category-badge"><BookOpen size={14} strokeWidth={1.5} /> Seam Allowance</span><h1>Standard Seam Allowance Guide by Project</h1><p>Interactive reference showing standard seam allowances by project type.</p></div>
        <div className="calculator-card">
          <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Project Type</th><th>Standard SA</th><th>Metric</th><th>Notes</th></tr></thead>
            <tbody>{standards.map(s => (<tr key={s.project}><td style={{ fontWeight: 600 }}>{s.project}</td><td>{s.sa}</td><td>{s.metric}</td><td style={{ fontFamily: "inherit", fontSize: 13 }}>{s.notes}</td></tr>))}</tbody>
          </table></div>
        </div>
        <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
      </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
    </div>);
}