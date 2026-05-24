"use client";

import Link from "next/link";
import { Scissors } from "lucide-react";
import { categories } from "@/lib/categories";
import styles from "./Footer.module.css";

export default function Footer() {
    const topCategories = categories.slice(0, 6);

    return (
        <footer className={styles.footer}>
            {/* Brand name centered */}
            <div className={styles.footerBrand}>
                <Link href="/" className={styles.brandName}>
                    <Scissors size={24} strokeWidth={1.5} />
                    <span>SewTools</span>
                </Link>
            </div>

            {/* Main content */}
            <div className={styles.footerMain}>
                <div className={styles.footerInner}>
                    <div className={styles.footerGrid}>
                        {/* Left — Tagline + Newsletter */}
                        <div className={styles.footerLeft}>
                            <h3 className={styles.tagline}>Precision Sewn.</h3>
                            <p className={styles.taglineDesc}>
                                Free sewing calculators and tools crafted
                                for quilters, sewists, and makers everywhere.
                            </p>
                            <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className={styles.newsletterInput}
                                />
                                <button type="submit" className={styles.newsletterBtn}>
                                    Subscribe
                                </button>
                            </form>
                        </div>

                        {/* Right — Link Groups */}
                        <div className={styles.footerLinks}>
                            {/* Top row of links */}
                            <div className={styles.linkRow}>
                                <div className={styles.linkCol}>
                                    {topCategories.map((cat) => (
                                        <Link key={cat.slug} href={`/${cat.slug}`} className={styles.footerLink}>
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                                <div className={styles.linkCol}>
                                    <Link href="/tools-index" className={styles.footerLink}>All Tools</Link>
                                    <Link href="/blog" className={styles.footerLink}>Guides</Link>
                                    <Link href="/reference/glossary" className={styles.footerLink}>Glossary</Link>
                                    <Link href="/reference/clothing-size-charts" className={styles.footerLink}>Size Charts</Link>
                                    <Link href="/reference/fabric-encyclopedia" className={styles.footerLink}>Fabric Encyclopedia</Link>
                                </div>
                            </div>

                            {/* Bottom row of links */}
                            <div className={styles.linkRow}>
                                <div className={styles.linkCol}>
                                    <Link href="/about" className={styles.footerLink}>About</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className={styles.footerBottom}>
                <div className={styles.footerBottomInner}>
                    <p className={styles.copyright}>
                        &copy; {new Date().getFullYear()} SewTools. All Rights Reserved.
                    </p>
                    <div className={styles.bottomLogo}>
                        <Scissors size={18} strokeWidth={1.5} />
                    </div>
                    <p className={styles.bottomNote}>
                        Free tools for the sewing community — no account required.
                    </p>
                </div>
            </div>
        </footer>
    );
}
