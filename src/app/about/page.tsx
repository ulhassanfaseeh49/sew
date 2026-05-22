import Breadcrumb from "@/components/ui/Breadcrumb";
export const metadata = { title: "About SewTools — Free Sewing Calculators", description: "SewTools is the largest free collection of sewing calculators, converters, and reference tools — built by sewists, for sewists." };
export default function Page() {
    return (
        <div className="container" style={{ paddingBottom: "5rem" }}>
            <Breadcrumb items={[{ label: "About" }]} />
            <div style={{ maxWidth: "720px", margin: "0 auto" }}>
                <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>About SewTools</h1>
                <div className="glass-card" style={{ padding: "2.5rem" }}>
                    <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>🧵 Our Mission</h2>
                    <p style={{ lineHeight: 1.8, marginBottom: "1.5rem" }}>
                        SewTools is the largest free collection of sewing calculators, converters, and reference tools on the web. With <strong>484+ tools</strong> across <strong>28 categories</strong>, we cover everything from basic unit conversions to advanced quilt math, garment construction, pricing, and sustainability.
                    </p>
                    <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>✨ Why We Built This</h2>
                    <p style={{ lineHeight: 1.8, marginBottom: "1.5rem" }}>
                        Every sewist deserves access to precision tools without paywalls. Whether you&apos;re calculating circle skirt radii at the cutting table, estimating costs for your Etsy shop, or converting between metric and imperial — SewTools has you covered.
                    </p>
                    <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>🎯 Our Principles</h2>
                    <ul style={{ lineHeight: 2, paddingLeft: "1.25rem", marginBottom: "1.5rem" }}>
                        <li><strong>100% Free</strong> — No subscriptions, no ads, no hidden costs</li>
                        <li><strong>Precision Math</strong> — Every formula verified by experienced sewists</li>
                        <li><strong>Mobile-First</strong> — Designed for use at the cutting table</li>
                        <li><strong>Print & Save</strong> — Take results with you to the sewing room</li>
                        <li><strong>Comprehensive</strong> — 484 tools covering every sewing discipline</li>
                    </ul>
                    <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>📬 Get in Touch</h2>
                    <p style={{ lineHeight: 1.8 }}>
                        Have a suggestion for a new tool? Found a bug? We'd love to hear from you. SewTools is built with love for the sewing community.
                    </p>
                </div>
            </div>
        </div>
    );
}
