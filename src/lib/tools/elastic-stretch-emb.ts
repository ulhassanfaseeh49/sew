export interface ElasticTool { id: number; name: string; slug: string; description: string; icon: string; }
export const elasticTools: ElasticTool[] = [
    { id: 290, name: "Waist Elastic Calculator", slug: "waist-calculator", description: "Elastic length for waistbands", icon: "〰️" },
    { id: 291, name: "Cuff Elastic Calculator", slug: "cuff-calculator", description: "Elastic for sleeve and pant cuffs", icon: "🔄" },
    { id: 292, name: "Neckline Elastic Calculator", slug: "neckline-calculator", description: "Elastic for necklines", icon: "👕" },
    { id: 293, name: "Elastic Casing Width", slug: "casing-width", description: "Casing width from elastic width", icon: "📏" },
    { id: 294, name: "Elastic Recovery Calculator", slug: "recovery-calculator", description: "Stretch and recovery rates", icon: "📊" },
    { id: 295, name: "Elastic Quartering Tool", slug: "quartering-tool", description: "Divide elastic evenly", icon: "➗" },
    { id: 296, name: "Clear Elastic for Knits", slug: "clear-elastic", description: "Clear elastic for stabilizing knits", icon: "🔍" },
    { id: 297, name: "Elastic Types Guide", slug: "types-guide", description: "Guide to elastic types", icon: "📖" },
    { id: 298, name: "Drawstring Length Calculator", slug: "drawstring-calculator", description: "Drawstring length for garments", icon: "🪢" },
];
export interface StretchTool { id: number; name: string; slug: string; description: string; icon: string; }
export const stretchTools: StretchTool[] = [
    { id: 299, name: "Stretch Percentage Calculator", slug: "percentage-calculator", description: "Calculate fabric stretch %", icon: "📊" },
    { id: 300, name: "Fabric Stretch Gauge", slug: "gauge-tool", description: "Measure stretch accurately", icon: "📏" },
    { id: 301, name: "Stretch Required for Pattern", slug: "pattern-requirement", description: "Does your fabric have enough stretch?", icon: "✅" },
    { id: 302, name: "Negative Ease Calculator", slug: "negative-ease", description: "Negative ease for knit garments", icon: "➖" },
    { id: 303, name: "Knit Type Comparator", slug: "knit-type-comparator", description: "Jersey vs interlock vs rib", icon: "⚖️" },
    { id: 304, name: "Woven to Knit Converter", slug: "woven-to-knit-converter", description: "Adapt woven patterns for knits", icon: "🔄" },
    { id: 305, name: "Knit Stitch Length Guide", slug: "stitch-length", description: "Stitch types for knit fabrics", icon: "🧵" },
    { id: 306, name: "Differential Feed Calculator", slug: "differential-feed", description: "Serger settings for knits", icon: "⚙️" },
    { id: 307, name: "Recovery & Stretch Ratio", slug: "recovery-ratio", description: "Stretch-to-recovery ratio", icon: "📈" },
    { id: 308, name: "Two-Way vs Four-Way Stretch", slug: "stretch-direction-guide", description: "Compare stretch directions", icon: "↔️" },
];
export interface EmbroideryTool { id: number; name: string; slug: string; description: string; icon: string; }
export const embroideryTools: EmbroideryTool[] = [
    { id: 309, name: "Thread Coverage Calculator", slug: "thread-coverage", description: "Thread for embroidery designs", icon: "🧵" },
    { id: 310, name: "Hoop Size Selector", slug: "hoop-selector", description: "Best hoop for your design", icon: "⭕" },
    { id: 311, name: "Stabilizer Type Selector", slug: "stabilizer-selector", description: "Pick the right stabilizer", icon: "📋" },
    { id: 312, name: "Design Size Scaler", slug: "design-scaler", description: "Resize embroidery designs", icon: "🔍" },
    { id: 313, name: "Thread Color Converter", slug: "thread-color-converter", description: "DMC/Anchor/Sulky conversion", icon: "🎨" },
    { id: 314, name: "Cross-Stitch Fabric Count", slug: "cross-stitch-fabric-count", description: "Finished size by fabric count", icon: "🔢" },
    { id: 315, name: "Cross-Stitch Thread Usage", slug: "cross-stitch-thread-usage", description: "Skeins needed per color", icon: "🧶" },
    { id: 316, name: "Cross-Stitch Fabric Size", slug: "cross-stitch-fabric-size", description: "Fabric piece size needed", icon: "📐" },
    { id: 317, name: "Needlepoint Canvas Count", slug: "needlepoint-canvas", description: "Size on different mesh counts", icon: "🔲" },
    { id: 318, name: "Appliqué Fabric Yardage", slug: "applique-yardage", description: "Fabric for appliqué pieces", icon: "✂️" },
    { id: 319, name: "Fusible Appliqué Calculator", slug: "fusible-applique", description: "Fusible web for appliqué", icon: "🔥" },
    { id: 320, name: "Thread Inventory Tracker", slug: "thread-inventory", description: "Track your thread collection", icon: "📦" },
    { id: 321, name: "Hand Embroidery Floss", slug: "hand-embroidery-floss", description: "Floss for hand embroidery", icon: "🪡" },
];
