import Link from "next/link";
import { categories } from "@/lib/categories";
import styles from "./Footer.module.css";

export default function Footer() {
    const topCategories = categories.slice(0, 8);

    return (
        <footer className={styles.footer}>
            <div className={styles.footerInner}>
                <div className={styles.footerGrid}>
                    {/* Brand */}
                    <div className={styles.footerBrand}>
                        <Link href="/" className={styles.footerLogo}>
                            <span>✂️</span>
                            <span className={styles.footerLogoText}>
                                Sew<span className={styles.accent}>Tools</span>
                            </span>
                        </Link>
                        <p className={styles.footerDesc}>
                            484+ free sewing calculators and tools for quilters, garment sewists,
                            home decorators, and crafters worldwide.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className={styles.footerCol}>
                        <h4 className={styles.footerColTitle}>Quick Links</h4>
                        <Link href="/tools-index">All Tools (A-Z)</Link>
                        <Link href="/tools-by-category">Tools by Category</Link>
                        <Link href="/blog">Guides & Tutorials</Link>
                        <Link href="/printables">Printable Sheets</Link>
                        <Link href="/suggest-tool">Suggest a Tool</Link>
                    </div>

                    {/* Popular Categories */}
                    <div className={styles.footerCol}>
                        <h4 className={styles.footerColTitle}>Popular Categories</h4>
                        {topCategories.map((cat) => (
                            <Link key={cat.slug} href={`/${cat.slug}`}>
                                {cat.icon} {cat.name}
                            </Link>
                        ))}
                    </div>

                    {/* Legal */}
                    <div className={styles.footerCol}>
                        <h4 className={styles.footerColTitle}>Company</h4>
                        <Link href="/about">About Us</Link>
                        <Link href="/contact">Contact</Link>
                        <Link href="/privacy-policy">Privacy Policy</Link>
                        <Link href="/terms-of-service">Terms of Service</Link>
                        <Link href="/accessibility">Accessibility</Link>
                        <Link href="/sitemap">Sitemap</Link>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <p>© {new Date().getFullYear()} SewTools. All rights reserved. Calculations are estimates — always buy extra fabric!</p>
                </div>
            </div>
        </footer>
    );
}
