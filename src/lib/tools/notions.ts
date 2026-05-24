export interface NotionTool { id: number; name: string; slug: string; description: string; icon: string; }
export const notionTools: NotionTool[] = [
    { id: 180, name: "Thread Yardage Estimator", slug: "thread-yardage", description: "Estimate thread needed based on seam length and type", icon: "" },
    { id: 181, name: "Bobbin Thread Calculator", slug: "bobbin-thread", description: "Calculate bobbins needed for a project", icon: "" },
    { id: 182, name: "Thread Weight Comparison", slug: "thread-weight-comparison", description: "Compare thread weights with recommendations", icon: "" },
    { id: 183, name: "Thread Color Matching", slug: "thread-color-matching", description: "Guide for choosing thread color", icon: "" },
    { id: 185, name: "Spool Size Comparison", slug: "spool-size-comparison", description: "Compare spool sizes and economy", icon: "" },
    { id: 186, name: "Button Size Calculator", slug: "button-size-calculator", description: "Convert button sizes: ligne, mm, inches", icon: "" },
    { id: 187, name: "Button Spacing Calculator", slug: "button-spacing", description: "Calculate even button spacing", icon: "" },
    { id: 188, name: "Buttonhole Length Calculator", slug: "buttonhole-calculator", description: "Buttonhole length from button diameter", icon: "" },
    { id: 189, name: "Zipper Length Selector", slug: "zipper-length", description: "Correct zipper length by garment type", icon: "" },
    { id: 190, name: "Hook & Eye Spacing", slug: "hook-eye-spacing", description: "Even spacing for hooks and eyes", icon: "🪝" },
    { id: 191, name: "Snap Spacing Calculator", slug: "snap-spacing", description: "Even spacing for snaps", icon: "" },
    { id: 196, name: "Interfacing Calculator", slug: "interfacing-calculator", description: "Select interfacing type and calculate yardage", icon: "" },
    { id: 198, name: "Fusible Web Calculator", slug: "fusible-web-calculator", description: "Fusible web yardage for applique", icon: "" },
];
