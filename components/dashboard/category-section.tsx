"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus, GripVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppCard } from "./app-card";
import type { AppItem, Category } from "@/lib/types";

interface CategorySectionProps {
  category: Category;
  apps: AppItem[];
  allCategories: Category[];
  onAddApp: (categoryId: string) => void;
  onEditApp: (app: AppItem) => void;
  onDuplicateApp: (id: string) => void;
  onDeleteApp: (id: string) => void;
  onMoveApp: (appId: string, categoryId: string) => void;
  onReorderApps: (categoryId: string, orderedIds: string[]) => void;
  onRenameCategory: (id: string, name: string) => void;
  onDeleteCategory: (id: string) => void;
  highlight?: string;
  readOnly?: boolean;
}

export function CategorySection({
  category,
  apps,
  allCategories,
  onAddApp,
  onEditApp,
  onDuplicateApp,
  onDeleteApp,
  onMoveApp,
  onReorderApps,
  onRenameCategory,
  onDeleteCategory,
  highlight = "",
  readOnly = false,
}: CategorySectionProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(category.name);

  const sortedApps = useMemo(
    () => [...apps].sort((a, b) => a.order - b.order),
    [apps]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const ids = sortedApps.map((a) => a.id);
    const oldIndex = ids.indexOf(active.id as string);
    const newIndex = ids.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;

    const newIds = [...ids];
    newIds.splice(oldIndex, 1);
    newIds.splice(newIndex, 0, active.id as string);
    onReorderApps(category.id, newIds);
  }

  function handleRename() {
    if (renameValue.trim()) {
      onRenameCategory(category.id, renameValue.trim());
    }
    setIsRenaming(false);
  }

  return (
    <section className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-4 group relative">
        {!readOnly && (
          <GripVertical className="w-4 h-4 text-white/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
        )}
        {isRenaming && !readOnly ? (
          <Input
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
            className="bg-white/5 border-white/10 text-sm font-semibold w-48 h-7"
            autoFocus
          />
        ) : (
          <h2 className="text-sm font-semibold text-white/60 tracking-wide uppercase">{category.name}</h2>
        )}
        <span className="text-xs text-white/20 font-mono">{apps.length}</span>

        {!readOnly && (
          <div className="flex items-center gap-1 absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white/30 hover:text-white/60"
              onClick={() => onAddApp(category.id)}
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center h-6 w-6 text-white/30 hover:text-white/60 rounded-md hover:bg-white/5 transition-colors">
                <Pencil className="w-3 h-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-strong rounded-xl border-white/10" align="end">
                <DropdownMenuItem onClick={() => { setRenameValue(category.name); setIsRenaming(true); }}>
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-400" onClick={() => onDeleteCategory(category.id)}>
                  <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Grid */}
      {sortedApps.length === 0 && !readOnly ? (
        <div
          className="border border-dashed border-white/10 rounded-2xl p-8 flex items-center justify-center cursor-pointer hover:border-white/20 transition-colors"
          onClick={() => onAddApp(category.id)}
        >
          <p className="text-xs text-white/30">Drop an app here or click +</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sortedApps.map((a) => a.id)} strategy={rectSortingStrategy}>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-5">
              {sortedApps.map((app) => (
                <AppCard
                  key={app.id}
                  app={app}
                  categories={allCategories}
                  onEdit={onEditApp}
                  onDuplicate={onDuplicateApp}
                  onDelete={onDeleteApp}
                  onMove={onMoveApp}
                  highlight={highlight}
                  readOnly={readOnly}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </section>
  );
}
