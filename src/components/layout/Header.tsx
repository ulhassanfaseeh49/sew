"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Scissors, Search, ChevronDown, ArrowRightLeft, Ruler, DollarSign,
    ScissorsLineDashed, Scaling, User, Grid3X3, Slice, Wrench, Shirt,
    Droplets, PanelTop, Sofa, Ribbon, CircleDot, Zap, Flower2,
    Sparkles, Theater, CircleDashed, ShoppingBag, Baby, Tag, Weight,
    Pin, Cpu, Recycle, BookOpen, LayoutGrid, Compass, FolderOpen,
    Users, X, Menu
} from "lucide-react";
import { categories } from "@/lib/categories";
import styles from "./Header.module.css";

// Map category slugs to Lucide icons
const categoryIcons: Record<string, React.ElementType> = {
    convert: ArrowRightLeft, yardage: Ruler, cost: DollarSign, "seam-allowance": ScissorsLineDashed,
    pattern: Scaling, body: User, quilt: Grid3X3, cutting: Slice,
    notions: Wrench, garment: Shirt, shrinkage: Droplets, curtains: PanelTop,
    "home-decor": Sofa, "bias-binding": Ribbon, elastic: CircleDot, stretch: Zap,
    embroidery: Flower2, "lace-trim": Sparkles, costume: Theater, skirt: CircleDashed,
    bags: ShoppingBag, "baby-kids": Baby, pricing: Tag, "fabric-type": Weight,
    "needles-thread": Pin, machine: Cpu, sustainable: Recycle, reference: BookOpen,
};

// Group categories into columns for the mega menu
const megaColumns = [
    {
        title: "Measurement & Fabric",
        items: categories.filter(c => ["convert", "yardage", "cost", "fabric-type", "shrinkage"].includes(c.slug)),
    },
    {
        title: "Construction",
        items: categories.filter(c => ["seam-allowance", "pattern", "garment", "body", "elastic", "stretch", "bias-binding"].includes(c.slug)),
    },
    {
        title: "Projects",
        items: categories.filter(c => ["quilt", "cutting", "skirt", "curtains", "home-decor", "bags", "costume", "baby-kids"].includes(c.slug)),
    },
    {
        title: "Equipment & More",
        items: categories.filter(c => ["notions", "needles-thread", "machine", "embroidery", "lace-trim", "pricing", "sustainable", "reference"].includes(c.slug)),
    },
];

export default function Header() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const headerRef = useRef<HTMLElement>(null);

    // Scroll detection
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    // Close on route change
    useEffect(() => {
        setActiveDropdown(null);
        setMenuOpen(false);
    }, [pathname]);

    // Hover-based dropdown (desktop)
    const handleMouseEnter = useCallback((key: string) => {
        if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
        setActiveDropdown(key);
    }, []);

    const handleMouseLeave = useCallback(() => {
        dropdownTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 200);
    }, []);

    const handleDropdownClick = useCallback((key: string) => {
        setActiveDropdown(prev => prev === key ? null : key);
    }, []);

    const closeAll = useCallback(() => {
        setActiveDropdown(null);
        setMenuOpen(false);
    }, []);

    const totalTools = categories.reduce((t, c) => t + c.toolCount, 0);

    return (
        <>
            <header ref={headerRef} className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
                <div className={styles.headerInner}>
                    {/* Logo */}
                    <Link href="/" className={styles.logo} onClick={closeAll}>
                        <span className={styles.logoIcon}>
                            <Scissors size={22} strokeWidth={1.5} />
                        </span>
                        <span className={styles.logoText}>
                            Sew<span className={styles.logoAccent}>Tools</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
                        {/* Mobile close button */}
                        <div className={styles.mobileNavHeader}>
                            <span className={styles.mobileNavTitle}>Menu</span>
                            <button className={styles.mobileClose} onClick={() => setMenuOpen(false)} aria-label="Close menu">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Tools Dropdown */}
                        <div
                            className={styles.navGroup}
                            onMouseEnter={() => handleMouseEnter("tools")}
                            onMouseLeave={handleMouseLeave}
                        >
                            <button
                                className={`${styles.navDropdownBtn} ${activeDropdown === "tools" ? styles.navDropdownActive : ""}`}
                                onClick={() => handleDropdownClick("tools")}
                                aria-expanded={activeDropdown === "tools"}
                            >
                                Tools
                                <ChevronDown size={13} className={`${styles.chevron} ${activeDropdown === "tools" ? styles.chevronOpen : ""}`} />
                            </button>

                            {activeDropdown === "tools" && (
                                <div className={styles.megaMenu} onMouseEnter={() => handleMouseEnter("tools")} onMouseLeave={handleMouseLeave}>
                                    <div className={styles.megaMenuInner}>
                                        <div className={styles.megaColumns}>
                                            {megaColumns.map(col => (
                                                <div key={col.title} className={styles.megaColumn}>
                                                    <div className={styles.megaColumnTitle}>{col.title}</div>
                                                    {col.items.map(cat => {
                                                        const IC = categoryIcons[cat.slug] || Ruler;
                                                        return (
                                                            <Link key={cat.slug} href={`/${cat.slug}`} className={styles.megaCategoryLink} onClick={closeAll}>
                                                                <IC size={15} strokeWidth={1.5} className={styles.megaCatIcon} />
                                                                <span className={styles.megaCatName}>{cat.name}</span>
                                                                <span className={styles.megaCatCount}>{cat.toolCount}</span>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            ))}
                                        </div>
                                        <div className={styles.megaFooter}>
                                            <Link href="/tools-index" className={styles.megaFooterLink} onClick={closeAll}>
                                                <LayoutGrid size={14} /> View All {totalTools} Tools
                                            </Link>
                                            <span className={styles.megaFooterSep}>·</span>
                                            <Link href="/tools-by-project" className={styles.megaFooterLink} onClick={closeAll}>
                                                <Compass size={14} /> Browse by Project
                                            </Link>
                                            <span className={styles.megaFooterSep}>·</span>
                                            <Link href="/tools-by-category" className={styles.megaFooterLink} onClick={closeAll}>
                                                <FolderOpen size={14} /> Browse by Category
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Static Links */}
                        <Link href="/blog" className={`${styles.navLink} ${pathname === "/blog" ? styles.navLinkActive : ""}`} onClick={closeAll}>
                            Guides
                        </Link>
                        <Link href="/about" className={`${styles.navLink} ${pathname === "/about" ? styles.navLinkActive : ""}`} onClick={closeAll}>
                            About
                        </Link>
                    </nav>

                    {/* Right Side Actions */}
                    <div className={styles.headerActions}>
                        <Link href="/tools-index" className={styles.searchBtn} aria-label="Search tools">
                            <Search size={15} className={styles.searchBtnIcon} />
                            <span className={styles.searchBtnText}>Search tools...</span>
                            <kbd className={styles.searchBtnKbd}>⌘K</kbd>
                        </Link>

                        <button
                            className={styles.menuToggle}
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Backdrop */}
            {(activeDropdown || menuOpen) && <div className={styles.backdrop} onClick={closeAll} />}
        </>
    );
}
