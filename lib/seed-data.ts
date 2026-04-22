import type { Category, AppItem } from "./types";

let _id = 0;
function id() {
  return `app-${++_id}-${Date.now().toString(36)}`;
}

export const SEED_CATEGORIES: Category[] = [
  { id: "cat-ventures", name: "Ventures", order: 0 },
  { id: "cat-tools", name: "Tools", order: 1 },
  { id: "cat-builds", name: "Builds", order: 2 },
];

export const SEED_APPS: AppItem[] = [
  // Ventures
  { id: id(), name: "Recovery Collective", url: "https://recoverycollective.com.au", categoryId: "cat-ventures", status: "live", tags: ["music", "label"], notes: "", order: 0 },
  { id: id(), name: "Building Bridges", url: "https://buildingbridges.agency", categoryId: "cat-ventures", status: "live", tags: ["agency", "music"], notes: "", order: 1 },
  { id: id(), name: "Creative Division", url: "https://creativedivision.io", categoryId: "cat-ventures", status: "live", tags: ["studio", "design"], notes: "", order: 2 },
  { id: id(), name: "JYDN", url: "https://jydn.com", categoryId: "cat-ventures", status: "live", tags: ["artist", "music"], notes: "", order: 3 },
  // Tools
  { id: id(), name: "Figma", url: "https://figma.com", categoryId: "cat-tools", status: "none", tags: ["design"], notes: "", order: 0 },
  { id: id(), name: "Framer", url: "https://framer.com", categoryId: "cat-tools", status: "none", tags: ["design", "web"], notes: "", order: 1 },
  { id: id(), name: "CapCut", url: "https://capcut.com", categoryId: "cat-tools", status: "none", tags: ["video"], notes: "", order: 2 },
  { id: id(), name: "Luma Labs", url: "https://lumalabs.ai", categoryId: "cat-tools", status: "none", tags: ["ai", "3d"], notes: "", order: 3 },
  { id: id(), name: "Notion", url: "https://notion.so", categoryId: "cat-tools", status: "none", tags: ["productivity"], notes: "", order: 4 },
  { id: id(), name: "Gmail", url: "https://mail.google.com", categoryId: "cat-tools", status: "none", tags: ["email"], notes: "", order: 5 },
  { id: id(), name: "Google Drive", url: "https://drive.google.com", categoryId: "cat-tools", status: "none", tags: ["storage"], notes: "", order: 6 },
  { id: id(), name: "ChatGPT", url: "https://chatgpt.com", categoryId: "cat-tools", status: "none", tags: ["ai"], notes: "", order: 7 },
  { id: id(), name: "Claude", url: "https://claude.ai", categoryId: "cat-tools", status: "none", tags: ["ai"], notes: "", order: 8 },
  // Builds
  { id: id(), name: "Bridges App", url: "https://bridgesapp.io", categoryId: "cat-builds", status: "wip", tags: ["saas", "crm"], notes: "", order: 0 },
  { id: id(), name: "Echo Village", url: "https://echovillage.co", categoryId: "cat-builds", status: "idea", tags: ["community"], notes: "", order: 1 },
  { id: id(), name: "LTD RUN", url: "https://ltdrun.com", categoryId: "cat-builds", status: "idea", tags: ["ecommerce"], notes: "", order: 2 },
  { id: id(), name: "Digital Gypsy", url: "https://digitalgypsy.co", categoryId: "cat-builds", status: "wip", tags: ["travel", "digital"], notes: "", order: 3 },
];
