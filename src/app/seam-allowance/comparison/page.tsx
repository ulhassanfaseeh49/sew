"use client";
import { useState } from "react";
import Link from "next/link";
import { Scale, ChevronDown, Ruler, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const comparisons = [
  { sa: '1/4"', mm: 6.35, when: "Quilting, piecing, narrow finishing", pros: "Precise, minimal fabric use, consistent blocks", cons: "No room for alterations, hard for beginners" },
  { sa: '3/8"', mm: 9.53, when: "Facings, linings, enclosed seams", pros: "Less bulk than 5/8\", good for lightweight", cons: "Limited alteration room" },
  { sa: '1/2"', mm: 12.7, when: "Home décor, crafts, simple projects", pros: "Easy to measure, good compromise", cons: "Non-standard for garments" },
  { sa: '5/8"', mm: 15.88, when: "US garment standard, most commercial patterns", pros: "Room to grade, finish, alter. Industry standard", cons: "More fabric, can add bulk" },
  { sa: '1"', mm: 25.4, when: "Tailoring, flat-felled, heavy fabrics", pros: "Maximum alteration room, strong seams", cons: "Uses most fabric, bulky in tight areas" },
];

const relatedTools = [
  { name: "Standard Guide", href: "/seam-allowance/standard-guide", icon: BookOpen },
  { name: "SA Converter", href: "/seam-allowance/converter", icon: Ruler },
  { name: "Finish Comparison", href: "/seam-allowance/finish-comparison", icon: Scale },
];
const faqItems = [
  { q: "Which seam allowance should I use as a beginner?", a: "Start with 5/8\" for garments (the US standard) and 1/4\" for quilting. These are the most common, and most tutorials/patterns assume them." },
  { q: "Does seam allowance affect fit?", a: "Absolutely. Using the wrong SA changes the finished size. A 1/4\" difference on every seam adds up quickly — potentially a full size difference across a garment." },
  { q: "Can I mix seam allowances in one project?", a: "Yes, it is common. 5/8\" for main seams, 1/4\" for facings, 1\" for hems. Just mark each piece clearly and be consistent within each seam." },
];

export default function ComparisonPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Seam Allowance", href: "/seam-allowance" }, { label: "Comparison" }]} />
      <div className="calculator-layout"><div className="calculator-main">
        <div className={styles.toolHeader}><span className="category-badge"><Scale size={14} strokeWidth={1.5} /> Seam Allowance</span><h1>Seam Allowance Comparison Tool</h1><p>Visual comparison of different seam allowances — when to use each one.</p></div>
        {comparisons.map(c => (<div key={c.sa} className="calculator-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <h3 style={{ fontSize: "var(--text-base)", fontWeight: 700 }}>{c.sa}</h3>
            <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>{c.mm} mm</span>
          </div>
          <p style={{ fontSize: "var(--text-sm)", color: "var(--color-accent)", fontWeight: 500, marginBottom: 4 }}>When: {c.when}</p>
          <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.8 }}>
            <div>Advantages: {c.pros}</div>
            <div>Disadvantages: {c.cons}</div>
          </div>
        </div>))}
        <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
      </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
    </div>);
}