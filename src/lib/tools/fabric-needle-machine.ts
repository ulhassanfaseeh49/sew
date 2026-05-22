export interface FabricTypeTool { id: number; name: string; slug: string; description: string; icon: string; }
export const fabricTypeTools: FabricTypeTool[] = [
    { id: 415, name: "GSM to oz/yd² Converter", slug: "gsm-to-oz", description: "Convert GSM to oz/yd²", icon: "⚖️" },
    { id: 416, name: "oz/yd² to GSM Converter", slug: "oz-to-gsm", description: "Convert oz/yd² to GSM", icon: "⚖️" },
    { id: 417, name: "Fabric Weight Comparator", slug: "weight-comparator", description: "Compare fabric weights", icon: "📊" },
    { id: 418, name: "Fabric Selection Guide", slug: "selection-guide", description: "Find fabric for your project", icon: "📖" },
    { id: 419, name: "Care Symbol Database", slug: "care-symbols", description: "Fabric care symbols guide", icon: "🏷️" },
    { id: 420, name: "Property Comparator", slug: "property-comparator", description: "Compare fabric properties", icon: "📋" },
    { id: 421, name: "Fabric Substitution", slug: "substitution", description: "Find alternative fabrics", icon: "🔄" },
    { id: 422, name: "Natural vs Synthetic", slug: "fiber-comparator", description: "Compare fiber types", icon: "🌿" },
    { id: 423, name: "Grain Line Calculator", slug: "grain-line", description: "Identify grain direction", icon: "📐" },
    { id: 424, name: "Fabric Hand Guide", slug: "hand-guide", description: "Crisp, soft, fluid fabrics", icon: "✋" },
    { id: 425, name: "Burn Test Guide", slug: "burn-test", description: "Identify fibers by burn test", icon: "🔥" },
    { id: 426, name: "Weave Type Guide", slug: "weave-guide", description: "Plain, twill, satin weaves", icon: "🔲" },
    { id: 427, name: "Yardage by Weight", slug: "yardage-by-weight", description: "Calculate yardage from weight", icon: "⚖️" },
];
export interface NeedleThreadTool { id: number; name: string; slug: string; description: string; icon: string; }
export const needleThreadTools: NeedleThreadTool[] = [
    { id: 428, name: "Needle by Fabric Guide", slug: "needle-by-fabric", description: "Match needle to fabric", icon: "🪡" },
    { id: 429, name: "Needle Size Converter", slug: "needle-size-converter", description: "EU vs US needle sizes", icon: "🔄" },
    { id: 430, name: "Thread Weight Guide", slug: "thread-by-project", description: "Thread weight by project", icon: "🧵" },
    { id: 431, name: "Thread by Fabric", slug: "thread-by-fabric", description: "Match thread to fabric", icon: "🧵" },
    { id: 432, name: "Needle Type Comparator", slug: "needle-type-comparator", description: "Compare needle types", icon: "📊" },
    { id: 433, name: "Machine Needle Chart", slug: "machine-needle-chart", description: "Complete needle reference", icon: "📋" },
    { id: 434, name: "Hand Needle Guide", slug: "hand-needle-guide", description: "Hand sewing needles", icon: "✋" },
    { id: 435, name: "Serger Needle Guide", slug: "serger-needle-guide", description: "Serger needle selection", icon: "⚙️" },
    { id: 436, name: "Replacement Schedule", slug: "replacement-schedule", description: "When to change needles", icon: "📅" },
    { id: 437, name: "Twin Needle Guide", slug: "twin-needle-guide", description: "Twin needle sizes", icon: "🔗" },
];
export interface MachineTool { id: number; name: string; slug: string; description: string; icon: string; }
export const machineTools: MachineTool[] = [
    { id: 438, name: "Stitch Length Calculator", slug: "stitch-length", description: "Stitch length by fabric", icon: "📏" },
    { id: 439, name: "Stitch Width Guide", slug: "stitch-width", description: "Width for zigzag/decorative", icon: "↔️" },
    { id: 440, name: "SPI Calculator", slug: "spi-calculator", description: "Stitches per inch converter", icon: "🔢" },
    { id: 441, name: "Tension Guide", slug: "tension-guide", description: "Tension settings by fabric", icon: "⚙️" },
    { id: 442, name: "Presser Foot Guide", slug: "presser-foot-guide", description: "Which foot to use", icon: "🦶" },
    { id: 443, name: "Speed Estimator", slug: "speed-estimator", description: "Estimate sewing speed", icon: "⏱️" },
    { id: 444, name: "Project Time Estimator", slug: "project-time", description: "Total project time", icon: "🕐" },
    { id: 445, name: "Stitch Count Estimator", slug: "stitch-count", description: "Total stitches in project", icon: "🔢" },
    { id: 446, name: "Troubleshooting Tool", slug: "troubleshooting", description: "Fix common problems", icon: "🔧" },
    { id: 447, name: "Seam Guide Tool", slug: "seam-guide", description: "Seam allowance guide", icon: "📐" },
    { id: 448, name: "Serger Settings Guide", slug: "serger-guide", description: "Serger settings by fabric", icon: "⚙️" },
    { id: 449, name: "Coverstitch Guide", slug: "coverstitch-guide", description: "Coverstitch settings", icon: "🧵" },
];
