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

function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    return "";
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

  const iconSrc = app.icon || getFaviconUrl(app.url);
  const showFallback = !iconSrc || imgError;

  const handleClick = useCallback(() => {
    window.open(app.url, "_blank", "noopener,noreferrer");
  }, [app.url]);

  const otherCategories = categories.filter((c) => c.id !== app.categoryId);

  const cardVisual = (
    <div className="flex flex-col items-center gap-2 group cursor-pointer select-none">
      <div className="relative">
        <div
          className="w-[80px] h-[80px] rounded-2xl overflow-hidden flex items-center justify-center transition-all duration-200 shadow-lg shadow-black/20 group-hover:-translate-y-0.5 group-hover:brightness-110"
          style={{ background: showFallback ? `linear-gradient(135deg, oklch(0.3 0.05 ${(app.name.charCodeAt(0) * 7) % 360}), oklch(0.2 0.03 ${(app.name.charCodeAt(0) * 7 + 60) % 360}))` : "oklch(0.12 0.01 270)" }}
        >
          {showFallback ? (
            <span className="text-2xl font-bold text-white/80">{app.name.charAt(0).toUpperCase()}</span>
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
        {app.status && app.status !== "none" && (
          <div className="absolute -top-1 -right-1 glass rounded-full px-1.5 py-0.5 flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(app.status)}`} />
            <span className="text-[9px] font-medium tracking-tight text-white/70">{getStatusLabel(app.status)}</span>
          </div>
        )}
      </div>
      <span className="text-xs font-medium text-center text-white/80 max-w-[90px] truncate leading-tight">
        {highlightText(app.name, highlight)}
      </span>
      {/* Tags on hover */}
      {app.tags.length > 0 && (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -bottom-5">
          {app.tags.map((tag) => (
            <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/40">{tag}</span>
          ))}
        </div>
      )}
    </div>
  );

  if (readOnly) {
    return (
      <div className="relative pb-5" onClick={handleClick}>
        {cardVisual}
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative pb-5">
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
