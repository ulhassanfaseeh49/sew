"use client";
import { useState } from "react";
import Link from "next/link";
import { Scale, ChevronDown, Ruler, Scissors } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const finishes = [
  { name: "Serged / Overlocked", diff: "Easy", equip: "Serger required", sa: "Any", best: "Everyday garments, knits", desc: "Trims and finishes edge in one pass. Professional look, fast." },
  { name: "Zigzag Stitch", diff: "Easy", equip: "Basic machine", sa: "Any", best: "Wovens, beginners", desc: "Zigzag along raw edge, then trim close. Simple but less neat than serging." },
  { name: "Pinked", diff: "Easy", equip: "Pinking shears", sa: "1/2\"+", best: "Low-fray wovens", desc: "Trim with pinking shears to reduce fraying. Minimal bulk. Not for high-fray fabrics." },
  { name: "French Seam", diff: "Moderate", equip: "Basic machine", sa: "5/8\" total", best: "Sheer, lightweight wovens", desc: "Two-pass enclosed seam. No raw edges visible. Elegant interior finish." },
  { name: "Flat-Felled", diff: "Moderate", equip: "Basic machine", sa: '1"+', best: "Denim, workwear, active", desc: "Double-stitched, fully enclosed. Maximum strength and durability." },
  { name: "Hong Kong Finish", diff: "Advanced", equip: "Bias strips", sa: "5/8\"+", best: "Unlined jackets, tailoring", desc: "Each edge bound in bias strip. Couture finish — beautiful interior." },
  { name: "Bound / Bias Bound", diff: "Moderate", equip: "Bias tape", sa: "Any", best: "Heavy fabrics, home décor", desc: "Similar to Hong Kong but uses pre-made bias tape. Easier than Hong Kong." },
  { name: "Clean Finish (Turned Under)", diff: "Easy", equip: "Iron + machine", sa: "3/8\"+", best: "Simple garments, facings", desc: "Turn raw edge 1/4\" under, press, stitch. Simple but adds bulk." },
];

const relatedTools = [
  { name: "French Seam Calc", href: "/seam-allowance/french-seam", icon: Scissors },
  { name: "Flat-Felled Calc", href: "/seam-allowance/flat-felled", icon: Scissors },
  { name: "Hong Kong Calc", href: "/seam-allowance/hong-kong", icon: Ruler },
];
const faqItems = [
  { q: "Which seam finish should a beginner use?", a: "Zigzag or clean finish — both need only a basic machine. If you have a serger, that's the fastest and cleanest option for most projects." },
  { q: "Does seam finish affect seam allowance?", a: "Yes. French seams need 5/8\" total. Flat-felled needs 1\"+. Hong Kong needs regular SA plus bias strip. Serging works with any SA width." },
  { q: "When should I serge vs use French seams?", a: "Serge for: speed, knits, thick fabrics, most everyday garments. French seam for: sheers, lightweight wovens, beautiful interior finish, unlined garments." },
];

export default function FinishComparisonPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Seam Allowance", href: "/seam-allowance" }, { label: "Finish Comparison" }]} />
      <div className="calculator-layout"><div className="calculator-main">
        <div className={styles.toolHeader}><span className="category-badge"><Scale size={14} strokeWidth={1.5} /> Seam Allowance</span><h1>Seam Finish Comparison Guide</h1><p>Compare all seam finishes with equipment, SA requirements, and best-use cases.</p></div>
        <div className="calculator-card">
          <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Finish</th><th>Difficulty</th><th>Equipment</th><th>Min SA</th><th>Best For</th></tr></thead>
            <tbody>{finishes.map(f => (<tr key={f.name}><td style={{ fontWeight: 600 }}>{f.name}</td><td style={{ fontSize: 13 }}>{f.diff}</td><td style={{ fontSize: 13 }}>{f.equip}</td><td>{f.sa}</td><td style={{ fontFamily: "inherit", fontSize: 13 }}>{f.best}</td></tr>))}</tbody>
          </table></div>
        </div>
        {finishes.map(f => (<div key={f.name} className="calculator-card">
          <h3 style={{ fontSize: "var(--text-base)", fontWeight: 600, marginBottom: 4 }}>{f.name}</h3>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.7 }}>{f.desc}</p>
        </div>))}
        <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
      </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
    </div>);
}