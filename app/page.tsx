"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDashboard } from "@/lib/use-dashboard";
import { CategorySection } from "@/components/dashboard/category-section";
import { AppModal } from "@/components/dashboard/app-modal";
import { ShareModal } from "@/components/dashboard/share-modal";
import { DeleteConfirm } from "@/components/dashboard/delete-confirm";
import { FooterStrip } from "@/components/dashboard/footer-strip";
import { CornerBadge } from "@/components/creative-division/corner-badge";
import type { AppItem } from "@/lib/types";

export default function HomePage() {
  const dashboard = useDashboard();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [appModalOpen, setAppModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<AppItem | null>(null);
  const [defaultCategoryId, setDefaultCategoryId] = useState<string | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<{ type: "app" | "category"; id: string } | null>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  // First load toast
  useEffect(() => {
    if (dashboard.hydrated && dashboard.isFirstLoad) {
      toast("Welcome back, boss. Seeded with your ventures — edit or clear anytime.");
    }
  }, [dashboard.hydrated, dashboard.isFirstLoad]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key === "k") {
        e.preventDefault();
        document.getElementById("search-input")?.focus();
      }
      if (meta && e.key === "n") {
        e.preventDefault();
        setEditingApp(null);
        setDefaultCategoryId(undefined);
        setAppModalOpen(true);
      }
      if (meta && e.key === "s") {
        e.preventDefault();
        setShareModalOpen(true);
      }
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        document.getElementById("search-input")?.focus();
      }
      if (e.key === "Escape") {
        setSearch("");
        (document.activeElement as HTMLElement)?.blur?.();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Filtered apps
  const filteredApps = useMemo(() => {
    let apps = dashboard.state.apps;
    if (statusFilter !== "all") {
      apps = apps.filter((a) => a.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      apps = apps.filter((a) => {
        const cat = dashboard.state.categories.find((c) => c.id === a.categoryId);
        return (
          a.name.toLowerCase().includes(q) ||
          a.url.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)) ||
          a.notes.toLowerCase().includes(q) ||
          (cat?.name.toLowerCase().includes(q) ?? false)
        );
      });
    }
    return apps;
  }, [dashboard.state, search, statusFilter]);

  const sortedCategories = useMemo(
    () => [...dashboard.state.categories].sort((a, b) => a.order - b.order),
    [dashboard.state.categories]
  );

  const handleAddApp = useCallback((categoryId?: string) => {
    setEditingApp(null);
    setDefaultCategoryId(categoryId);
    setAppModalOpen(true);
  }, []);

  const handleEditApp = useCallback((app: AppItem) => {
    setEditingApp(app);
    setAppModalOpen(true);
  }, []);

  const handleSaveApp = useCallback((data: Omit<AppItem, "id" | "order">) => {
    if (editingApp) {
      dashboard.updateApp(editingApp.id, data);
      toast("App updated.");
    } else {
      dashboard.addApp(data);
      toast("App added.");
    }
  }, [editingApp, dashboard]);

  const handleDeleteApp = useCallback((id: string) => {
    setDeleteTarget({ type: "app", id });
  }, []);

  const handleDeleteCategory = useCallback((id: string) => {
    setDeleteTarget({ type: "category", id });
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "app") {
      dashboard.deleteApp(deleteTarget.id);
      toast("App deleted.");
    } else {
      dashboard.deleteCategory(deleteTarget.id);
      toast("Category deleted.");
    }
    setDeleteTarget(null);
  }, [deleteTarget, dashboard]);

  const handleExport = useCallback(() => {
    const json = dashboard.exportJSON();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "command-center-backup.json";
    a.click();
    URL.revokeObjectURL(url);
    toast("Exported.");
  }, [dashboard]);

  const handleImport = useCallback((json: string) => {
    const ok = dashboard.importJSON(json);
    if (ok) {
      toast("Imported successfully.");
    } else {
      toast.error("Invalid file. Make sure it's a Command Center export.");
    }
  }, [dashboard]);

  if (!dashboard.hydrated) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-[var(--cyan)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-4">
          <h1 className="text-sm font-semibold tracking-tight text-white/70 hidden sm:block whitespace-nowrap">
            Command Center
          </h1>

          <div className="flex-1 max-w-md mx-auto relative">
            <div className="glass rounded-full flex items-center gap-2 px-4 py-2">
              <Search className="w-4 h-4 text-white/30 shrink-0" />
              <input
                id="search-input"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search apps... (⌘K)"
                className="bg-transparent border-none outline-none text-sm text-white/80 placeholder:text-white/25 w-full"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-xs text-white/30 hover:text-white/50">esc</button>
              )}
            </div>
          </div>

          <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v)}>
            <SelectTrigger className="w-24 h-8 bg-white/5 border-white/10 text-xs hidden sm:flex">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-strong border-white/10">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="wip">WIP</SelectItem>
              <SelectItem value="idea">Idea</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={() => handleAddApp()}
            size="sm"
            className="gap-1.5 h-8 text-xs shrink-0"
            style={{ background: "var(--cyan)", color: "#000" }}
          >
            <Plus className="w-3.5 h-3.5" /> Add App
          </Button>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4">
        {sortedCategories.map((cat) => {
          const categoryApps = filteredApps.filter((a) => a.categoryId === cat.id);
          if (search && categoryApps.length === 0) return null;
          return (
            <CategorySection
              key={cat.id}
              category={cat}
              apps={categoryApps}
              allCategories={sortedCategories}
              onAddApp={handleAddApp}
              onEditApp={handleEditApp}
              onDuplicateApp={dashboard.duplicateApp}
              onDeleteApp={handleDeleteApp}
              onMoveApp={dashboard.moveApp}
              onReorderApps={dashboard.reorderApps}
              onRenameCategory={dashboard.renameCategory}
              onDeleteCategory={handleDeleteCategory}
              highlight={search}
            />
          );
        })}

        {filteredApps.length === 0 && search && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-white/30 text-sm">No apps match &ldquo;{search}&rdquo;</p>
          </div>
        )}

        <FooterStrip
          totalApps={dashboard.totalApps}
          onShare={() => setShareModalOpen(true)}
          onExport={handleExport}
          onImport={handleImport}
          onReset={() => setResetConfirmOpen(true)}
        />
      </main>

      <AppModal
        open={appModalOpen}
        onClose={() => { setAppModalOpen(false); setEditingApp(null); }}
        onSave={handleSaveApp}
        categories={sortedCategories}
        onAddCategory={dashboard.addCategory}
        editingApp={editingApp}
        defaultCategoryId={defaultCategoryId}
      />

      <ShareModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        state={dashboard.state}
      />

      <DeleteConfirm
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={deleteTarget?.type === "app" ? "Delete app?" : "Delete category?"}
        description={deleteTarget?.type === "app" ? "This app will be removed from your dashboard." : "All apps in this category will also be deleted."}
      />

      <DeleteConfirm
        open={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        onConfirm={() => { dashboard.reset(); toast("Reset to defaults."); }}
        title="Reset dashboard?"
        description="This will wipe all your apps and categories and reseed with defaults."
      />

      <CornerBadge />
    </div>
  );
}
