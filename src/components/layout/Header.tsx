"use client";

import { useState } from "react";
import Link from "next/link";
import { categories } from "@/lib/categories";
import styles from "./Header.module.css";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [toolsOpen, setToolsOpen] = useState(false);

    return (
        <header className={styles.header}>
            <div className={styles.headerInner}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>✂️</span>
                    <span className={styles.logoText}>
                        Sew<span className={styles.logoAccent}>Tools</span>
                    </span>
                </Link>

                <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
                    <div className={styles.navGroup}>
                        <button
                            className={styles.navDropdownBtn}
                            onClick={() => setToolsOpen(!toolsOpen)}
                            aria-expanded={toolsOpen}
                        >
                            Tools
                            <svg className={`${styles.chevron} ${toolsOpen ? styles.chevronOpen : ""}`} width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                        {toolsOpen && (
                            <div className={styles.megaMenu}>
                                <div className={styles.megaMenuGrid}>
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat.slug}
                                            href={`/${cat.slug}`}
                                            className={styles.megaMenuItem}
                                            onClick={() => { setToolsOpen(false); setMenuOpen(false); }}
                                        >
                                            <span className={styles.megaMenuIcon}>{cat.icon}</span>
                                            <div>
                                                <div className={styles.megaMenuTitle}>{cat.name}</div>
                                                <div className={styles.megaMenuCount}>{cat.toolCount} tools</div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <Link href="/tools-index" className={styles.navLink} onClick={() => setMenuOpen(false)}>All Tools</Link>
                    <Link href="/blog" className={styles.navLink} onClick={() => setMenuOpen(false)}>Guides</Link>
                    <Link href="/about" className={styles.navLink} onClick={() => setMenuOpen(false)}>About</Link>
                </nav>

                <div className={styles.headerActions}>
                    <Link href="/tools-index" className={styles.searchBtn} aria-label="Search tools">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                    </Link>
                    <button
                        className={styles.menuToggle}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ""}`} />
                    </button>
                </div>
            </div>

            {/* Backdrop for mega menu */}
            {toolsOpen && <div className={styles.backdrop} onClick={() => setToolsOpen(false)} />}
        </header>
    );
}
