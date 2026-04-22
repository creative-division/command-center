"use client";

import { useState, useCallback } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Edit, Copy, Trash2, MoveRight } from "lucide-react";
import type { AppItem, Category } from "@/lib/types";

interface AppCardProps {
  app: AppItem;
  categories: Category[];
  onEdit: (app: AppItem) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onMove: (appId: string, categoryId: string) => void;
  highlight?: string;
  readOnly?: boolean;
}

// Curated gradient palette for letter fallbacks
const GRADIENTS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
  "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
  "linear-gradient(135deg, #f5576c 0%, #ff6f91 100%)",
  "linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)",
];

function getGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

// Known major domains that return good favicons via Google's API
const KNOWN_FAVICON_DOMAINS = new Set([
  "figma.com", "framer.com", "capcut.com", "notion.so",
  "mail.google.com", "drive.google.com", "chatgpt.com", "claude.ai",
  "github.com", "twitter.com", "x.com", "linkedin.com",
  "youtube.com", "spotify.com", "slack.com", "discord.com",
  "vercel.com", "netlify.com", "stripe.com", "openai.com",
  "google.com", "apple.com", "microsoft.com", "amazon.com",
  "instagram.com", "facebook.com", "reddit.com", "twitch.tv",
  "zoom.us", "dropbox.com", "trello.com", "asana.com",
  "linear.app", "canva.com", "miro.com", "airtable.com",
  "webflow.com", "squarespace.com", "wordpress.com",
  "lumalabs.ai",
]);

function shouldUseFavicon(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    return KNOWN_FAVICON_DOMAINS.has(hostname);
  } catch {
    return false;
  }
}

function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    return "";
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case "live": return "status-live";
    case "wip": return "status-wip";
    case "idea": return "status-idea";
    default: return "status-idea";
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "live": return "Live";
    case "wip": return "WIP";
    case "idea": return "Idea";
    case "none": return "";
    default: return status;
  }
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-[var(--cyan)] font-semibold">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}

export function AppCard({ app, categories, onEdit, onDuplicate, onDelete, onMove, highlight = "", readOnly = false }: AppCardProps) {
  const [imgError, setImgError] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: app.id, disabled: readOnly });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Determine icon: custom icon > known favicon > letter fallback
  const hasCustomIcon = !!app.icon;
  const useFavicon = !hasCustomIcon && shouldUseFavicon(app.url);
  const iconSrc = hasCustomIcon ? app.icon : useFavicon ? getFaviconUrl(app.url) : "";
  const showFallback = (!iconSrc || imgError) && !hasCustomIcon;

  const handleClick = useCallback(() => {
    window.open(app.url, "_blank", "noopener,noreferrer");
  }, [app.url]);

  const otherCategories = categories.filter((c) => c.id !== app.categoryId);

  const cardVisual = (
    <div className="flex flex-col items-center gap-2.5 group cursor-pointer select-none">
      <div className="relative">
        <div
          className="w-[72px] h-[72px] rounded-[18px] overflow-hidden flex items-center justify-center transition-all duration-200 ring-1 ring-white/[0.06] group-hover:-translate-y-1 group-hover:ring-white/[0.12] group-hover:shadow-xl group-hover:shadow-black/30"
          style={{
            background: (showFallback || !iconSrc)
              ? getGradient(app.name)
              : "oklch(0.13 0.01 270)",
          }}
        >
          {showFallback || !iconSrc ? (
            <span className="text-[1.625rem] font-bold text-white drop-shadow-sm">{app.name.charAt(0).toUpperCase()}</span>
          ) : (
            <img
              src={iconSrc}
              alt={app.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
              draggable={false}
            />
          )}
        </div>
        {/* Status badge */}
        {app.status && app.status !== "none" && (
          <div className="absolute -top-1 -right-1 glass rounded-full px-1.5 py-0.5 flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(app.status)}`} />
            <span className="text-[9px] font-medium tracking-tight text-white/70">{getStatusLabel(app.status)}</span>
          </div>
        )}
      </div>
      {/* Name */}
      <span className="text-[11px] font-medium text-center text-white/70 max-w-[84px] truncate leading-tight">
        {highlightText(app.name, highlight)}
      </span>
    </div>
  );

  if (readOnly) {
    return (
      <div className="relative" onClick={handleClick}>
        {cardVisual}
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none" onClick={handleClick}>
          {cardVisual}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="glass-strong rounded-xl border-white/10" align="center">
          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(app); }}>
            <Edit className="w-3.5 h-3.5 mr-2" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDuplicate(app.id); }}>
            <Copy className="w-3.5 h-3.5 mr-2" /> Duplicate
          </DropdownMenuItem>
          {otherCategories.length > 0 && (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <MoveRight className="w-3.5 h-3.5 mr-2" /> Move to
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="glass-strong rounded-xl border-white/10">
                {otherCategories.map((cat) => (
                  <DropdownMenuItem key={cat.id} onClick={(e) => { e.stopPropagation(); onMove(app.id, cat.id); }}>
                    {cat.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-400 focus:text-red-300" onClick={(e) => { e.stopPropagation(); onDelete(app.id); }}>
            <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
