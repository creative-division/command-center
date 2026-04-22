"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { decompressFromEncodedURIComponent } from "lz-string";
import { Suspense } from "react";
import { CategorySection } from "@/components/dashboard/category-section";
import { CornerBadge } from "@/components/creative-division/corner-badge";
import type { SharePayload, AppItem, Category } from "@/lib/types";

function StackContent() {
  const searchParams = useSearchParams();
  const data = searchParams.get("data");

  const payload = useMemo<SharePayload | null>(() => {
    if (!data) return null;
    try {
      const json = decompressFromEncodedURIComponent(data);
      if (!json) return null;
      return JSON.parse(json) as SharePayload;
    } catch {
      return null;
    }
  }, [data]);

  if (!payload) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-white/50 text-sm">Invalid or missing stack data.</p>
          <a href="/" className="text-[var(--cyan)] text-sm mt-2 inline-block hover:underline">
            Build your own Command Center →
          </a>
        </div>
      </div>
    );
  }

  const viewerName = payload.name || null;
  const categories: Category[] = payload.categories.sort((a, b) => a.order - b.order);
  const apps: AppItem[] = payload.apps.map((a) => ({ ...a, icon: "" }));

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Banner */}
      <div className="glass px-4 py-3 text-center">
        <p className="text-sm text-white/60">
          {viewerName ? `Viewing ${viewerName}'s stack` : "Viewing a shared stack"}
        </p>
      </div>

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        {categories.map((cat) => {
          const categoryApps = apps.filter((a) => a.categoryId === cat.id);
          return (
            <CategorySection
              key={cat.id}
              category={cat}
              apps={categoryApps}
              allCategories={categories}
              onAddApp={() => {}}
              onEditApp={() => {}}
              onDuplicateApp={() => {}}
              onDeleteApp={() => {}}
              onMoveApp={() => {}}
              onReorderApps={() => {}}
              onRenameCategory={() => {}}
              onDeleteCategory={() => {}}
              readOnly
            />
          );
        })}
      </main>

      {/* CTA footer */}
      <div className="glass rounded-xl mx-4 sm:mx-6 lg:mx-8 mb-20 p-6 text-center">
        <p className="text-sm text-white/60 mb-3">Like this?</p>
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium no-underline transition-all duration-200 hover:brightness-110"
          style={{ background: "var(--cyan)", color: "#000" }}
        >
          Build your own Command Center →
        </a>
      </div>

      <CornerBadge />
    </div>
  );
}

export default function StackPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-[var(--cyan)] animate-spin" />
      </div>
    }>
      <StackContent />
    </Suspense>
  );
}
