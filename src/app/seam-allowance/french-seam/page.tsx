"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { Scissors, Copy, Printer, ChevronDown, Ruler, Scale } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const relatedTools = [
  { name: "Flat-Felled Calc", href: "/seam-allowance/flat-felled", icon: Scissors },
  { name: "Finish Comparison", href: "/seam-allowance/finish-comparison", icon: Scale },
  { name: "Standard Guide", href: "/seam-allowance/standard-guide", icon: Ruler },
];
const faqItems = [
  { q: "What is a French seam?", a: "A self-enclosed seam sewn twice: first with wrong sides together (enclosing raw edges inside), then folded and sewn again from the right side. Creates a clean finish with no visible raw edges." },
  { q: "When should I use French seams?", a: "Ideal for: sheer/lightweight wovens, unlined garments, baby clothing, summer dresses. Not suitable for: heavy fabrics, curves, knits, or bulky intersections." },
  { q: "Can I use French seams on curves?", a: "Gentle curves work with careful clipping. Tight curves are impractical — use Hong Kong finish or bias binding instead." },
];

export default function FrenchSeamPage() {
  const [firstPass, setFirstPass] = useState("0.375"); const [secondPass, setSecondPass] = useState("0.25");
  const [activeFaq, setActiveFaq] = useState<number | null>(null); const [copied, setCopied] = useState(false);

  const fp = parseFloat(firstPass) || 0.375; const sp = parseFloat(secondPass) || 0.25;
  const totalSA = fp + sp;

  const handleCopy = useCallback(() => { navigator.clipboard.writeText(`French seam: ${fp}" first pass + ${sp}" second pass = ${totalSA}" total SA needed`); setCopied(true); setTimeout(() => setCopied(false), 2000); }, [fp, sp, totalSA]);

  return (
    <div className="container">
      <Breadcrumb items={[{ label: "Seam Allowance", href: "/seam-allowance" }, { label: "French Seam" }]} />
      <div className="calculator-layout"><div className="calculator-main">
        <div className={styles.toolHeader}><span className="category-badge"><Scissors size={14} strokeWidth={1.5} /> Seam Allowance</span><h1>French Seam Allowance Calculator</h1><p>Calculate seam allowance needed for French seams — two-pass enclosed seam finishing.</p></div>
        <div className="calculator-card"><h2 className={styles.calcTitle}>French Seam Settings</h2>
          <div className="calculator-form"><div className="calculator-form-row">
            <div className="input-group"><label className="input-label">First Pass SA (inches)</label><input type="number" className="input-field input-mono" value={firstPass} onChange={e => setFirstPass(e.target.value)} min="0.125" step="0.125" /><span className="input-helper">Wrong sides together, trim to 1/8&quot;</span></div>
            <div className="input-group"><label className="input-label">Second Pass SA (inches)</label><input type="number" className="input-field input-mono" value={secondPass} onChange={e => setSecondPass(e.target.value)} min="0.125" step="0.125" /><span className="input-helper">Right sides together, encloses raw edge</span></div>
          </div></div>
          <div className="calculator-divider" />
          <div className="result-card"><div className="result-prefix">Total SA Needed</div><div className="result-value">{totalSA.toFixed(3)}&quot;</div><div className="result-label">{fp}&quot; first + {sp}&quot; second = {totalSA}&quot;</div></div>
          <div className={styles.resultDetails} style={{ marginTop: 16 }}>
            <div className="result-row"><span className="result-row-label">Step 1</span><span className="result-row-value">Sew wrong sides together at {fp}&quot;</span></div>
            <div className="result-row"><span className="result-row-label">Step 2</span><span className="result-row-value">Trim to 1/8&quot;, press</span></div>
            <div className="result-row"><span className="result-row-label">Step 3</span><span className="result-row-value">Fold, sew at {sp}&quot; from fold</span></div>
            <div className="result-row"><span className="result-row-label">Finished width</span><span className="result-row-value">{sp}&quot; from seam line</span></div>
          </div>
          <div className="toolbar" style={{ marginTop: 16 }}><button className="btn btn-secondary btn-sm" onClick={handleCopy}><Copy size={14} /> {copied ? "Copied!" : "Copy"}</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print</button></div>
        </div>
        <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
      </div><aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside></div>
    </div>);
}