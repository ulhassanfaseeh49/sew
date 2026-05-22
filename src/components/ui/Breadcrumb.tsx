import Link from "next/link";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            {items.map((item, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span className="breadcrumb-separator">›</span>
                    {item.href ? (
                        <Link href={item.href}>{item.label}</Link>
                    ) : (
                        <span className="breadcrumb-current">{item.label}</span>
                    )}
                </span>
            ))}
        </nav>
    );
}
