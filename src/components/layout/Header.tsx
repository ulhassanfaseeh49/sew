"use client";

import { useState } from "react";
import Link from "next/link";
import { Scissors, Search, ChevronDown } from "lucide-react";
import { categories } from "@/lib/categories";
import styles from "./Header.module.css";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [toolsOpen, setToolsOpen] = useState(false);

    return (
        <header className={styles.header}>
            <div className={styles.headerInner}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>
                        <Scissors size={24} strokeWidth={1.5} />
                    </span>
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
                            <ChevronDown
                                size={14}
                                className={`${styles.chevron} ${toolsOpen ? styles.chevronOpen : ""}`}
                            />
                        </button>
                        {toolsOpen && (
                            <div className={styles.megaMenu}>
                                <div className={styles.megaMenuInner}>
                                    <div className={styles.megaSidebar}>
                                        {categories.map((cat) => (
                                            <Link
                                                key={cat.slug}
                                                href={`/${cat.slug}`}
                                                className={styles.megaSidebarItem}
                                                onClick={() => { setToolsOpen(false); setMenuOpen(false); }}
                                            >
                                                <span>{cat.name}</span>
                                                <span className={styles.megaSidebarCount}>{cat.toolCount}</span>
                                            </Link>
                                        ))}
                                    </div>
                                    <div className={styles.megaContent}>
                                        <div className={styles.megaQuickLinks}>
                                            <Link href="/tools-index" className={styles.megaQuickLink} onClick={() => setToolsOpen(false)}>
                                                View All {categories.reduce((t, c) => t + c.toolCount, 0)} Tools
                                            </Link>
                                            <span className={styles.megaQuickSep}>&middot;</span>
                                            <Link href="/tools-by-project" className={styles.megaQuickLink} onClick={() => setToolsOpen(false)}>
                                                Tools by Project
                                            </Link>
                                            <span className={styles.megaQuickSep}>&middot;</span>
                                            <Link href="/tools-index" className={styles.megaQuickLink} onClick={() => setToolsOpen(false)}>
                                                Browse A-Z
                                            </Link>
                                        </div>
                                    </div>
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
                        <Search size={16} className={styles.searchBtnIcon} />
                        <span className={styles.searchBtnText}>Search</span>
                        <span className={styles.searchBtnShortcut}>Ctrl+K</span>
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
