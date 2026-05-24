"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Scissors, Search, ChevronDown, ChevronRight, ArrowRightLeft, Ruler, DollarSign,
    ScissorsLineDashed, Scaling, User, Grid3X3, Slice, Wrench, Shirt,
    Droplets, PanelTop, Sofa, Ribbon, CircleDot, Zap, Flower2,
    Sparkles, Theater, CircleDashed, ShoppingBag, Baby, Tag, Weight,
    Pin, Cpu, Recycle, BookOpen, LayoutGrid,
    X, Menu
} from "lucide-react";
import { categories } from "@/lib/categories";
import styles from "./Header.module.css";

// Import all tool arrays
import { getAllConversionTools } from "@/lib/tools/convert";
import { yardageTools } from "@/lib/tools/yardage";
import { costTools } from "@/lib/tools/cost";
import { seamTools } from "@/lib/tools/seam";
import { patternTools } from "@/lib/tools/pattern";
import { bodyTools } from "@/lib/tools/body";
import { quiltTools } from "@/lib/tools/quilt";
import { cuttingTools } from "@/lib/tools/cutting";
import { notionTools } from "@/lib/tools/notions";
import { garmentTools } from "@/lib/tools/garment";
import { shrinkageTools } from "@/lib/tools/shrinkage";
import { curtainTools } from "@/lib/tools/curtains";
import { homeDecorTools } from "@/lib/tools/home-decor";
import { biasBindingTools } from "@/lib/tools/bias-binding";
import { elasticTools, stretchTools, embroideryTools } from "@/lib/tools/elastic-stretch-emb";
import { fabricTypeTools, needleThreadTools, machineTools } from "@/lib/tools/fabric-needle-machine";
import { laceTrimTools, costumeTools } from "@/lib/tools/lace-costume";
import { skirtTools, bagTools } from "@/lib/tools/skirt-bags";
import { babyKidsTools, pricingTools } from "@/lib/tools/baby-pricing";
import { sustainableTools, referenceTools } from "@/lib/tools/sustainable-reference";

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

// Map category slugs to their tools
const categoryToolsMap: Record<string, { name: string; slug: string }[]> = {
    convert: getAllConversionTools(),
    yardage: yardageTools,
    cost: costTools,
    "seam-allowance": seamTools,
    pattern: patternTools,
    body: bodyTools,
    quilt: quiltTools,
    cutting: cuttingTools,
    notions: notionTools,
    garment: garmentTools,
    shrinkage: shrinkageTools,
    curtains: curtainTools,
    "home-decor": homeDecorTools,
    "bias-binding": biasBindingTools,
    elastic: elasticTools,
    stretch: stretchTools,
    embroidery: embroideryTools,
    "fabric-type": fabricTypeTools,
    "needles-thread": needleThreadTools,
    machine: machineTools,
    "lace-trim": laceTrimTools,
    costume: costumeTools,
    skirt: skirtTools,
    bags: bagTools,
    "baby-kids": babyKidsTools,
    pricing: pricingTools,
    sustainable: sustainableTools,
    reference: referenceTools,
};

// Group categories for the left panel
const megaGroups = [
    { title: "Measurement & Fabric", slugs: ["convert", "yardage", "cost", "fabric-type", "shrinkage"] },
    { title: "Construction", slugs: ["seam-allowance", "pattern", "garment", "body", "elastic", "stretch", "bias-binding"] },
    { title: "Projects", slugs: ["quilt", "cutting", "skirt", "curtains", "home-decor", "bags", "costume", "baby-kids"] },
    { title: "Equipment & More", slugs: ["notions", "needles-thread", "machine", "embroidery", "lace-trim", "pricing", "sustainable", "reference"] },
];

export default function Header() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const [headerHidden, setHeaderHidden] = useState(false);
    const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const headerRef = useRef<HTMLElement>(null);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            setScrolled(currentY > 8);

            // Don't hide when mega menu or mobile menu is open
            if (activeDropdown || menuOpen) {
                lastScrollY.current = currentY;
                return;
            }

            // Show header at the very top
            if (currentY < 60) {
                setHeaderHidden(false);
            } else if (currentY > lastScrollY.current + 10) {
                // Scrolling down — hide
                setHeaderHidden(true);
            } else if (currentY < lastScrollY.current - 10) {
                // Scrolling up — show
                setHeaderHidden(false);
            }

            lastScrollY.current = currentY;
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [activeDropdown, menuOpen]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
                setActiveDropdown(null);
                setHoveredCategory(null);
            }
        };
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    useEffect(() => {
        setActiveDropdown(null);
        setMenuOpen(false);
        setHoveredCategory(null);
    }, [pathname]);

    // Default to first category when mega menu opens
    useEffect(() => {
        if (activeDropdown === "tools" && !hoveredCategory) {
            setHoveredCategory("convert");
        }
    }, [activeDropdown, hoveredCategory]);

    const handleMouseEnter = useCallback((key: string) => {
        if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
        setActiveDropdown(key);
    }, []);

    const handleMouseLeave = useCallback(() => {
        dropdownTimeoutRef.current = setTimeout(() => {
            setActiveDropdown(null);
            setHoveredCategory(null);
        }, 200);
    }, []);

    const handleDropdownClick = useCallback((key: string) => {
        setActiveDropdown(prev => {
            if (prev === key) { setHoveredCategory(null); return null; }
            return key;
        });
    }, []);

    const closeAll = useCallback(() => {
        setActiveDropdown(null);
        setMenuOpen(false);
        setHoveredCategory(null);
    }, []);

    const totalTools = categories.reduce((t, c) => t + c.toolCount, 0);
    const hoveredTools = hoveredCategory ? (categoryToolsMap[hoveredCategory] || []) : [];
    const hoveredCatData = hoveredCategory ? categories.find(c => c.slug === hoveredCategory) : null;

    return (
        <>
            <header ref={headerRef} className={`${styles.header} ${scrolled ? styles.headerScrolled : ""} ${headerHidden ? styles.headerHidden : ""}`}>
                <div className={styles.headerInner}>
                    <Link href="/" className={styles.logo} onClick={closeAll}>
                        <span className={styles.logoIcon}><Scissors size={22} strokeWidth={1.5} /></span>
                        <span className={styles.logoText}>Sew<span className={styles.logoAccent}>Tools</span></span>
                    </Link>

                    <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
                        <div className={styles.mobileNavHeader}>
                            <span className={styles.mobileNavTitle}>Menu</span>
                            <button className={styles.mobileClose} onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={20} /></button>
                        </div>

                        {/* Tools Mega Menu */}
                        <div className={styles.navGroup} onMouseEnter={() => handleMouseEnter("tools")} onMouseLeave={handleMouseLeave}>
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
                                        <div className={styles.megaTwoPanels}>
                                            {/* LEFT — Categories */}
                                            <div className={styles.megaLeft}>
                                                {megaGroups.map(group => (
                                                    <div key={group.title} className={styles.megaGroup}>
                                                        <div className={styles.megaGroupTitle}>{group.title}</div>
                                                        {group.slugs.map(slug => {
                                                            const cat = categories.find(c => c.slug === slug);
                                                            if (!cat) return null;
                                                            const IC = categoryIcons[slug] || Ruler;
                                                            return (
                                                                <div key={slug}
                                                                    className={`${styles.megaCatItem} ${hoveredCategory === slug ? styles.megaCatItemActive : ""}`}
                                                                    onMouseEnter={() => setHoveredCategory(slug)}
                                                                >
                                                                    <Link href={`/${slug}`} className={styles.megaCatLink} onClick={closeAll}>
                                                                        <IC size={14} strokeWidth={1.5} className={styles.megaCatIcon} />
                                                                        <span className={styles.megaCatName}>{cat.name}</span>
                                                                        <ChevronRight size={11} className={styles.megaCatArrow} />
                                                                    </Link>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* RIGHT — Tools */}
                                            <div className={styles.megaRight}>
                                                {hoveredCatData && (
                                                    <>
                                                        <div className={styles.megaRightHeader}>
                                                            <Link href={`/${hoveredCatData.slug}`} className={styles.megaRightTitle} onClick={closeAll}>
                                                                {hoveredCatData.name} <span className={styles.megaRightViewAll}>View all →</span>
                                                            </Link>
                                                        </div>
                                                        <div className={styles.megaToolGrid}>
                                                            {hoveredTools.slice(0, 20).map(tool => (
                                                                <Link key={tool.slug} href={`/${hoveredCatData.slug}/${tool.slug}`}
                                                                    className={styles.megaToolLink} onClick={closeAll}>
                                                                    {tool.name}
                                                                </Link>
                                                            ))}
                                                            {hoveredTools.length > 20 && (
                                                                <Link href={`/${hoveredCatData.slug}`} className={styles.megaToolMore} onClick={closeAll}>
                                                                    +{hoveredTools.length - 20} more →
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className={styles.megaFooter}>
                                            <Link href="/tools-index" className={styles.megaFooterLink} onClick={closeAll}>
                                                <LayoutGrid size={14} /> View All {totalTools} Tools
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link href="/blog" className={`${styles.navLink} ${pathname === "/blog" ? styles.navLinkActive : ""}`} onClick={closeAll}>Guides</Link>
                        <Link href="/about" className={`${styles.navLink} ${pathname === "/about" ? styles.navLinkActive : ""}`} onClick={closeAll}>About</Link>
                    </nav>

                    <div className={styles.headerActions}>
                        <Link href="/tools-index" className={styles.searchBtn} aria-label="Search tools">
                            <Search size={17} className={styles.searchBtnIcon} />
                            <span className={styles.searchBtnText}>Search tools...</span>
                            <kbd className={styles.searchBtnKbd}>⌘K</kbd>
                        </Link>
                        <Link href="/tools-index" className={styles.ctaBtn}>All Tools</Link>
                        <button className={styles.menuToggle} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
                            {menuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </header>

            {(activeDropdown || menuOpen) && <div className={styles.backdrop} onClick={closeAll} />}
        </>
    );
}
