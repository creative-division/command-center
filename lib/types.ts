export type AppStatus = "live" | "wip" | "idea" | "none" | string;

export interface AppItem {
  id: string;
  name: string;
  url: string;
  categoryId: string;
  icon?: string; // URL or base64
  status: AppStatus;
  tags: string[];
  notes: string;
  order: number;
}

export interface Category {
  id: string;
  name: string;
  order: number;
}

export interface DashboardState {
  categories: Category[];
  apps: AppItem[];
}

export interface SharePayload {
  name?: string;
  categories: Category[];
  apps: Omit<AppItem, "icon">[];
}
