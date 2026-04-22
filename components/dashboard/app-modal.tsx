"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Link, Globe } from "lucide-react";
import type { AppItem, Category, AppStatus } from "@/lib/types";

interface AppModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<AppItem, "id" | "order">) => void;
  categories: Category[];
  onAddCategory: (name: string) => void;
  editingApp?: AppItem | null;
  defaultCategoryId?: string;
}

const STATUSES: { value: AppStatus; label: string }[] = [
  { value: "none", label: "None" },
  { value: "live", label: "Live" },
  { value: "wip", label: "WIP" },
  { value: "idea", label: "Idea" },
];

function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    return "";
  }
}

export function AppModal({ open, onClose, onSave, categories, onAddCategory, editingApp, defaultCategoryId }: AppModalProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [icon, setIcon] = useState("");
  const [iconTab, setIconTab] = useState("auto");
  const [iconUrl, setIconUrl] = useState("");
  const [status, setStatus] = useState<AppStatus>("none");
  const [customStatus, setCustomStatus] = useState("");
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [urlError, setUrlError] = useState("");
  const [iconWarning, setIconWarning] = useState("");

  useEffect(() => {
    if (open) {
      if (editingApp) {
        setName(editingApp.name);
        setUrl(editingApp.url);
        setCategoryId(editingApp.categoryId);
        setIcon(editingApp.icon || "");
        setStatus(editingApp.status);
        setTags(editingApp.tags.join(", "));
        setNotes(editingApp.notes);
        if (editingApp.icon?.startsWith("data:")) setIconTab("upload");
        else if (editingApp.icon) setIconTab("url");
        else setIconTab("auto");
      } else {
        setName("");
        setUrl("");
        setCategoryId(defaultCategoryId || categories[0]?.id || "");
        setIcon("");
        setIconTab("auto");
        setIconUrl("");
        setStatus("none");
        setCustomStatus("");
        setTags("");
        setNotes("");
        setNewCategoryName("");
        setUrlError("");
        setIconWarning("");
      }
    }
  }, [open, editingApp, categories, defaultCategoryId]);

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      setIconWarning("File exceeds 500KB. Consider using a URL instead.");
    } else {
      setIconWarning("");
    }
    const reader = new FileReader();
    reader.onload = () => {
      setIcon(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function validateUrl(value: string): boolean {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  function handleSave() {
    if (!name.trim() || !url.trim()) return;
    if (!validateUrl(url)) {
      setUrlError("Please enter a valid URL");
      return;
    }

    let finalIcon = "";
    if (iconTab === "auto") {
      finalIcon = "";
    } else if (iconTab === "url") {
      finalIcon = iconUrl;
    } else {
      finalIcon = icon;
    }

    const finalStatus = status === "none" ? "none" : (STATUSES.some((s) => s.value === status) ? status : customStatus || status);
    const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 3);

    onSave({
      name: name.trim(),
      url: url.trim(),
      categoryId,
      icon: finalIcon,
      status: finalStatus,
      tags: tagList,
      notes: notes.trim(),
    });
    onClose();
  }

  function handleAddCategory() {
    if (!newCategoryName.trim()) return;
    onAddCategory(newCategoryName.trim());
    setNewCategoryName("");
  }

  const previewFavicon = iconTab === "auto" && url ? getFaviconUrl(url) : "";
  const previewIcon = iconTab === "url" ? iconUrl : iconTab === "upload" ? icon : previewFavicon;
  const showFallback = !previewIcon;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="glass-strong rounded-2xl border-white/10 max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{editingApp ? "Edit App" : "Add App"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Live preview */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
            <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center shrink-0"
              style={{ background: showFallback ? `linear-gradient(135deg, oklch(0.3 0.05 200), oklch(0.2 0.03 260))` : "oklch(0.12 0.01 270)" }}
            >
              {showFallback ? (
                <span className="text-lg font-bold text-white/80">{(name || "?").charAt(0).toUpperCase()}</span>
              ) : (
                <img src={previewIcon} alt="" className="w-full h-full object-cover" onError={() => {}} />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{name || "App Name"}</p>
              <p className="text-xs text-white/40 truncate">{url || "https://..."}</p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-xs font-medium text-white/50 mb-1 block">Name *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="App name" className="bg-white/5 border-white/10" />
          </div>

          {/* URL */}
          <div>
            <label className="text-xs font-medium text-white/50 mb-1 block">URL *</label>
            <Input
              value={url}
              onChange={(e) => { setUrl(e.target.value); setUrlError(""); }}
              placeholder="https://example.com"
              className="bg-white/5 border-white/10"
            />
            {urlError && <p className="text-xs text-red-400 mt-1">{urlError}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-medium text-white/50 mb-1 block">Category</label>
            <Select value={categoryId} onValueChange={(v) => v && setCategoryId(v)}>
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-strong border-white/10">
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2 mt-2">
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New category name"
                className="bg-white/5 border-white/10 text-xs"
                onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
              />
              <Button variant="outline" size="sm" onClick={handleAddCategory} className="shrink-0 border-white/10 bg-white/5 text-xs">
                Create
              </Button>
            </div>
          </div>

          {/* Icon */}
          <div>
            <label className="text-xs font-medium text-white/50 mb-1 block">Icon</label>
            <Tabs value={iconTab} onValueChange={setIconTab}>
              <TabsList className="bg-white/5 border border-white/10 rounded-lg">
                <TabsTrigger value="auto" className="text-xs gap-1.5 data-[state=active]:bg-white/10"><Globe className="w-3 h-3" /> Auto</TabsTrigger>
                <TabsTrigger value="url" className="text-xs gap-1.5 data-[state=active]:bg-white/10"><Link className="w-3 h-3" /> URL</TabsTrigger>
                <TabsTrigger value="upload" className="text-xs gap-1.5 data-[state=active]:bg-white/10"><Upload className="w-3 h-3" /> Upload</TabsTrigger>
              </TabsList>
              <TabsContent value="auto">
                <p className="text-xs text-white/40 mt-2">Auto-fetches favicon from URL domain.</p>
              </TabsContent>
              <TabsContent value="url">
                <Input value={iconUrl} onChange={(e) => setIconUrl(e.target.value)} placeholder="https://..." className="bg-white/5 border-white/10 mt-2" />
              </TabsContent>
              <TabsContent value="upload">
                <input type="file" accept="image/*" onChange={handleFileUpload} className="mt-2 text-xs text-white/60" />
                {iconWarning && <p className="text-xs text-amber-400 mt-1">{iconWarning}</p>}
              </TabsContent>
            </Tabs>
          </div>

          {/* Status */}
          <div>
            <label className="text-xs font-medium text-white/50 mb-1 block">Status</label>
            <Select value={STATUSES.some((s) => s.value === status) ? status : "custom"} onValueChange={(v) => v && setStatus(v as AppStatus)}>
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-strong border-white/10">
                {STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            {status === "custom" && (
              <Input value={customStatus} onChange={(e) => setCustomStatus(e.target.value)} placeholder="Custom status" className="bg-white/5 border-white/10 mt-2" />
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-medium text-white/50 mb-1 block">Tags (max 3, comma-separated)</label>
            <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="design, saas, music" className="bg-white/5 border-white/10" />
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-medium text-white/50 mb-1 block">Notes</label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes..." className="bg-white/5 border-white/10 min-h-[60px]" />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1 border-white/10 bg-white/5">Cancel</Button>
            <Button
              onClick={handleSave}
              disabled={!name.trim() || !url.trim()}
              className="flex-1"
              style={{ background: "var(--cyan)", color: "#000" }}
            >
              {editingApp ? "Save" : "Add App"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
