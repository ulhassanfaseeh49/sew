"use client";
import { useState } from "react";
import Link from "next/link";
import { Settings, ChevronDown, Ruler, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "../../convert/yards-to-meters/page.module.css";

const diffFeed = [
    { fabric: "Jersey / knit", problem: "Wavy seam", setting: "0.7–0.9", result: "Seam lies flat" },
    { fabric: "Swimwear", problem: "Very wavy", setting: "0.7", result: "Flat seam" },
    { fabric: "Chiffon / voile", problem: "Gathering/wavy", setting: "0.7–0.8", result: "Flat seam" },
    { fabric: "Woven medium", problem: "None usually", setting: "1.0", result: "Standard" },
    { fabric: "Heavy woven", problem: "Can ripple", setting: "1.0–1.2", result: "Corrected" },
    { fabric: "Gathering (intentional)", problem: "Want gathered", setting: "1.5–2.0", result: "Gathered" },
];

const stitchTypes = [
    { type: "4-thread overlock", use: "Seam + finish together", notes: "Most common. Strong seam with covered edge." },
    { type: "3-thread overlock", use: "Edge finishing only", notes: "No seam strength — just edge finishing." },
    { type: "3-thread narrow", use: "Lingerie, sheers", notes: "Narrow stitch for delicate fabrics." },
    { type: "Rolled hem", use: "Narrow decorative edge", notes: "Requires stitch finger adjustment. Tight upper looper." },
    { type: "Flatlock", use: "Flat decorative seam", notes: "Activewear, lingerie. Needle tension very loose." },
];

const troubleshooting = [
    { problem: "Loops on top of fabric", fix: "Upper looper too loose — tighten. Or lower looper too tight — loosen." },
    { problem: "Loops on bottom", fix: "Lower looper too loose — tighten. Or upper looper too tight — loosen." },
    { problem: "Wavy seam on knit", fix: "Adjust differential feed lower (0.7-0.9). Also try shorter stitch length." },
    { problem: "Thread breaking", fix: "Tension too tight on that thread position — loosen. Check threading path." },
    { problem: "Skipped stitches", fix: "Wrong needle for fabric. Replace needle. Check threading." },
    { problem: "Rolled hem won't roll", fix: "Upper looper not tight enough. Increase upper looper tension." },
];

const relatedTools = [
    { name: "Stitch Length Calculator", href: "/machine/stitch-length", icon: Ruler },
    { name: "Tension Guide", href: "/machine/tension-guide", icon: Settings },
    { name: "Serger Needle Guide", href: "/needles-thread/serger-needle-guide", icon: BookOpen },
    { name: "Coverstitch Guide", href: "/machine/coverstitch-guide", icon: Settings },
];

const faqItems = [
    { q: "What is differential feed?", a: "Two sets of feed dogs (front and back) moving at different speeds. Setting 1.0 = equal. Below 1.0 = fabric stretches flat (for knits). Above 1.0 = fabric gathers." },
    { q: "3-thread or 4-thread overlock?", a: "4-thread for seaming and finishing in one pass (stronger). 3-thread for just finishing edges or when you've already sewn a seam on the regular machine." },
    { q: "How do I set up a rolled hem?", a: "Remove stitch finger (or activate rolled hem setting). Tighten upper looper significantly. Loosen lower looper. Use 1.0-2.0mm stitch length. Test on scrap first." },
];

export default function SergerGuidePage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    return (
        <div className="container">
            <Breadcrumb items={[{ label: "Machine Tools", href: "/machine" }, { label: "Serger Guide" }]} />
            <div className="calculator-layout">
                <div className="calculator-main">
                    <div className={styles.toolHeader}>
                        <span className="category-badge"><Settings size={14} strokeWidth={1.5} /> Sewing Machine Tool</span>
                        <h1>Serger / Overlocker Settings Guide</h1>
                        <p>Complete settings guide for sergers — tension, differential feed, stitch types, and troubleshooting.</p>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.sectionTitle}>Stitch Types</h2>
                        <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Type</th><th>Use</th><th>Notes</th></tr></thead>
                            <tbody>{stitchTypes.map(s => (<tr key={s.type}><td style={{ fontFamily: "inherit", fontWeight: 500 }}>{s.type}</td><td style={{ fontFamily: "inherit" }}>{s.use}</td><td style={{ fontFamily: "inherit", fontSize: 13 }}>{s.notes}</td></tr>))}</tbody>
                        </table></div>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.sectionTitle}>Differential Feed Settings</h2>
                        <div className={styles.tableWrap}><table className={styles.convTable}><thead><tr><th>Fabric</th><th>Problem</th><th>Setting</th><th>Result</th></tr></thead>
                            <tbody>{diffFeed.map(d => (<tr key={d.fabric}><td style={{ fontFamily: "inherit", fontWeight: 500 }}>{d.fabric}</td><td style={{ fontFamily: "inherit" }}>{d.problem}</td><td style={{ fontWeight: 600 }}>{d.setting}</td><td style={{ fontFamily: "inherit" }}>{d.result}</td></tr>))}</tbody>
                        </table></div>
                    </div>
                    <div className="calculator-card">
                        <h2 className={styles.sectionTitle}>Serger Troubleshooting</h2>
                        {troubleshooting.map((t, i) => (
                            <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: i < troubleshooting.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                                <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 4 }}>{t.problem}</h3>
                                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>{t.fix}</p>
                            </div>
                        ))}
                    </div>
                    <section className="faq-section"><h2>Frequently Asked Questions</h2><div className="faq-list">{faqItems.map((faq, i) => (<div key={i} className={`faq-item ${activeFaq === i ? "active" : ""}`}><button className="faq-question" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>{faq.q}<ChevronDown size={16} className="faq-chevron" /></button><div className="faq-answer">{faq.a}</div></div>))}</div></section>
                </div>
                <aside className="calculator-sidebar"><div className="related-tools"><h4>Related Tools</h4>{relatedTools.map(tool => { const IC = tool.icon; return (<Link key={tool.href} href={tool.href} className="related-tool-link"><span className="related-tool-icon"><IC size={16} strokeWidth={1.5} /></span>{tool.name}</Link>); })}</div></aside>
            </div>
        </div>
    );
}