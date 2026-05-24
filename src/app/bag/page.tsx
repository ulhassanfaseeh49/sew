"use client";
import Link from "next/link";
import styles from "../convert/yards-to-meters/page.module.css";
import { ShoppingBag } from "lucide-react";

const tools = [
    { href: "/bag/tote-bag", name: "Tote Bag Yardage", desc: "Fabric for tote bags" },
    { href: "/bag/bag-lining", name: "Bag Lining", desc: "Lining fabric calculator" },
    { href: "/bag/bag-interfacing", name: "Bag Interfacing", desc: "Interfacing for bags" },
    { href: "/bag/strap-length", name: "Strap Length", desc: "Strap by carry style" },
    { href: "/bag/strap-width", name: "Strap Width", desc: "Strap width & fabric" },
    { href: "/bag/zipper-pouch", name: "Zipper Pouch", desc: "Pouch by size" },
    { href: "/bag/wallet", name: "Wallet Pattern", desc: "Fabric wallets" },
    { href: "/bag/backpack", name: "Backpack Panels", desc: "Backpack construction" },
    { href: "/bag/drawstring-bag", name: "Drawstring Bag", desc: "Drawstring bags" },
    { href: "/bag/market-bag", name: "Market Bag", desc: "Reusable grocery bags" },
    { href: "/bag/gift-bag", name: "Gift Bag", desc: "Reusable gift bags" },
    { href: "/bag/clutch-bag", name: "Clutch / Evening", desc: "Clutch bags" },
    { href: "/bag/messenger-bag", name: "Messenger Bag", desc: "Crossbody bags" },
    { href: "/bag/laptop-sleeve", name: "Laptop Sleeve", desc: "Padded sleeves" },
    { href: "/bag/hat-size", name: "Hat Size", desc: "Sewn hats" },
    { href: "/bag/headband", name: "Headband", desc: "Headband calculator" },
    { href: "/bag/scrunchie", name: "Scrunchie", desc: "Scrunchie fabric" },
    { href: "/bag/face-mask", name: "Face Mask", desc: "Face mask fabric" },
    { href: "/bag/fabric-basket", name: "Fabric Basket", desc: "Sewn baskets" },
];

export default function Page() {
    return (
        <div className="container">
            <div className={styles.toolHeader}>
                <span className="category-badge"><ShoppingBag size={14} strokeWidth={1.5} /> Bags & Accessories</span>
                <h1>Bag & Accessory Calculators</h1>
                <p>19 free tools for bags, pouches, hats, headbands, and accessories. Calculate fabric, interfacing, straps, and hardware.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12, marginTop: 20 }}>
                {tools.map(t => (
                    <Link key={t.href} href={t.href} className="glass-card" style={{ display: "block", padding: 16, textDecoration: "none", color: "inherit", transition: "transform .15s, box-shadow .15s" }}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</div>
                        <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 4 }}>{t.desc}</div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
