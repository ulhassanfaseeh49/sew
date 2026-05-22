import Link from "next/link";
import { Scissors } from "lucide-react";
import { categories } from "@/lib/categories";
import styles from "./Footer.module.css";

export default function Footer() {
    const topCategories = categories.slice(0, 6);

    return (
        <footer className={styles.footer}>
            <div className={styles.footerInner}>
                <div className={styles.footerGrid}>
                    {/* Brand */}
                    <div className={styles.footerBrand}>
                        <Link href="/" className={styles.footerLogo}>
                            <Scissors size={20} strokeWidth={1.5} style={{ color: 'var(--color-accent-primary)' }} />
                            <span className={styles.footerLogoText}>
                                Sew<span className={styles.accent}>Tools</span>
                            </span>
                        </Link>
                        <p className={styles.footerDesc}>
                            Free precision sewing calculators for quilters, garment sewists,
                            home decorators, and crafters.
                        </p>
                    </div>

                    {/* Tools */}
                    <div className={styles.footerCol}>
                        <h4 className={styles.footerColTitle}>TOOLS</h4>
                        {topCategories.map((cat) => (
                            <Link key={cat.slug} href={`/${cat.slug}`}>
                                {cat.name}
                            </Link>
                        ))}
                        <Link href="/tools-index" style={{ color: 'var(--color-accent-primary)', fontWeight: 500 }}>
                            View All →
                        </Link>
                    </div>

                    {/* Resources */}
                    <div className={styles.footerCol}>
                        <h4 className={styles.footerColTitle}>RESOURCES</h4>
                        <Link href="/blog">Blog</Link>
                        <Link href="/reference/fabric-glossary">Glossary</Link>
                        <Link href="/printables">Printable Sheets</Link>
                        <Link href="/reference/standard-size-chart">Size Charts</Link>
                        <Link href="/suggest-tool">Suggest a Tool</Link>
                    </div>

                    {/* Company */}
                    <div className={styles.footerCol}>
                        <h4 className={styles.footerColTitle}>COMPANY</h4>
                        <Link href="/about">About</Link>
                        <Link href="/contact">Contact</Link>
                        <Link href="/privacy-policy">Privacy</Link>
                        <Link href="/terms-of-service">Terms</Link>
                        <Link href="/accessibility">Accessibility</Link>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <p>© {new Date().getFullYear()} SewTools. All rights reserved.</p>
                    <p className={styles.footerMade}>Made with care for the sewing community.</p>
                </div>
            </div>
        </footer>
    );
}
